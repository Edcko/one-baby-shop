import type { FastifyInstance } from 'fastify'
import { ApiError } from '../errors.js'
import { env } from '../config/env.js'
import { applyPaymentWebhook, sweepExpiredOrders, verifyMpSignature } from '../services/webhooks.js'

const APP_URL = process.env.APP_URL ?? 'http://localhost:5173'
const PUBLIC_API_URL = process.env.PUBLIC_API_URL ?? null

export async function paymentRoutes(fastify: FastifyInstance) {
  // ── POST /orders/:orderNumber/payment — create MP preference ────────────
  fastify.post('/api/v1/orders/:orderNumber/payment', {
    preHandler: fastify.authenticate,
    schema: {
      params: {
        type: 'object',
        properties: { orderNumber: { type: 'string', minLength: 4 } },
        required: ['orderNumber'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: { initPoint: { type: 'string' } },
              required: ['initPoint'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request, reply) => {
      const { orderNumber } = request.params as { orderNumber: string }

      const order = await fastify.prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true, user: { select: { email: true } } },
      })
      if (!order || order.userId !== request.user.sub)
        throw ApiError.notFound('Pedido no encontrado')
      if (order.status !== 'PENDING_PAYMENT') {
        throw ApiError.conflict('Este pedido ya no está pendiente de pago')
      }
      if (order.expiresAt && order.expiresAt < new Date()) {
        throw ApiError.conflict('La ventana de pago de este pedido ya expiró')
      }

      const provider = fastify.payments.getOrCreate()
      if (!provider) {
        throw new ApiError(
          503,
          'PAYMENTS_NOT_CONFIGURED',
          'Mercado Pago no está configurado todavía'
        )
      }

      const preference = await provider.createPreference({
        orderNumber: order.orderNumber,
        totalCents: order.totalCents,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
        })),
        payerEmail: order.user?.email ?? null,
        expiresAt: order.expiresAt,
        backUrls: {
          success: `${APP_URL}/orders?payment=success`,
          failure: `${APP_URL}/orders?payment=failure`,
          pending: `${APP_URL}/orders?payment=pending`,
        },
        // Webhooks need a PUBLIC https URL — dev runs without them and relies
        // on the sweeper + manual verification.
        notificationUrl: PUBLIC_API_URL ? `${PUBLIC_API_URL}/api/v1/payments/webhook` : null,
      })

      await fastify.prisma.order.update({
        where: { id: order.id },
        data: { paymentPreferenceId: preference.preferenceId },
      })

      return reply.status(201).send({
        success: true,
        data: { initPoint: preference.initPoint },
      })
    },
  })

  // ── POST /payments/webhook — MP notifications (signature-verified) ──────
  // Unauthenticated BY DESIGN: the x-signature HMAC IS the authentication.
  // Always answers 200 for well-formed notifications (MP retries on non-2xx
  // and we do not want a retry storm); 401 only for bad signatures.
  fastify.post('/api/v1/payments/webhook', {
    config: {
      // Webhook validation is its own auth — skip the global rate limit.
      rateLimit: false,
    },
    schema: {
      querystring: {
        type: 'object',
        properties: {
          'data.id': { type: 'string' },
          type: { type: 'string' },
          topic: { type: 'string' },
        },
      },
      // MP posts form-encoded or JSON with varying shapes — validate manually.
      body: true as unknown as never,
    },
    handler: async (request, reply) => {
      const query = request.query as Record<string, string>
      const body = (request.body ?? {}) as Record<string, unknown>

      const dataId = query['data.id'] ?? (body.data as { id?: string } | undefined)?.id
      const eventType = query.type ?? query.topic ?? (body.type as string | undefined) ?? 'payment'

      const secret = process.env.MP_WEBHOOK_SECRET
      if (!secret) {
        // No secret configured → dev mode: accept and log, do nothing real.
        request.log.warn({ dataId }, 'webhook received without MP_WEBHOOK_SECRET (dev mode)')
        return reply.status(200).send({ received: true })
      }

      const valid = verifyMpSignature({
        signatureHeader: request.headers['x-signature'] as string | undefined,
        requestId: request.headers['x-request-id'] as string | undefined,
        dataId,
        secret,
      })
      if (!valid) {
        request.log.warn({ dataId }, 'webhook with INVALID signature — rejected')
        return reply.status(401).send({ received: false })
      }

      if (!dataId || eventType !== 'payment') {
        // Merchant order notifications etc. — acknowledge, ignore.
        return reply.status(200).send({ received: true })
      }

      const provider = fastify.payments.getOrCreate()
      if (!provider) {
        request.log.warn({ dataId }, 'webhook received but MP not configured')
        return reply.status(200).send({ received: true })
      }

      let payment
      try {
        payment = await provider.fetchPayment(dataId)
      } catch (error) {
        request.log.error({ error, dataId }, 'failed to fetch payment from MP')
        // 500 → MP retries later; transient API issues resolve on retry.
        return reply.status(500).send({ received: false })
      }

      const result = await applyPaymentWebhook(fastify, payment, `payment:${payment.paymentId}`)
      request.log.info({ dataId, result, status: payment.status }, 'webhook processed')

      return reply.status(200).send({ received: true, result })
    },
  })

  // ── POST /payments/sweep — manual expiry trigger (cron/admin) ────────────
  fastify.post('/api/v1/payments/sweep', {
    preHandler: fastify.authenticateAdmin,
    handler: async () => {
      const expired = await sweepExpiredOrders(fastify)
      return { success: true, data: { expiredOrders: expired } }
    },
  })
}
