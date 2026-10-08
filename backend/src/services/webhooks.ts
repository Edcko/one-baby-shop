import { createHmac, timingSafeEqual } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import type { Prisma } from '../../generated/prisma/client.js'

/**
 * Webhook verification (Mercado Pago):
 * x-signature header = 'ts=<ts>,v1=<hmac>'
 * HMAC-SHA256 over `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * with the MP_WEBHOOK_SECRET. Timing-safe compare.
 */
export function verifyMpSignature(params: {
  signatureHeader: string | undefined
  requestId: string | undefined
  dataId: string | undefined
  secret: string
}): boolean {
  const { signatureHeader, requestId, dataId, secret } = params
  if (!signatureHeader || !dataId) return false

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((pair) => pair.trim().split('=') as [string, string])
  )
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${requestId ?? ''};ts:${ts};`
  const computed = createHmac('sha256', secret).update(manifest).digest('hex')

  try {
    return timingSafeEqual(Buffer.from(computed, 'utf8'), Buffer.from(v1, 'utf8'))
  } catch {
    return false
  }
}

/**
 * Applies a payment notification to its order. IDEMPOTENT: replaying the same
 * webhook (or a different webhook for the same approved payment) must never
 * double-apply. Anchors: WebhookEvent (provider+eventId) and the
 * PaymentTransaction (provider+providerPaymentId) unique constraints.
 */
export async function applyPaymentWebhook(
  fastify: FastifyInstance,
  payment: {
    paymentId: string
    status: string
    statusDetail: string | null
    paymentTypeId: string | null
    externalReference: string | null
    amountCents: number | null
  },
  eventId: string
): Promise<'applied' | 'ignored' | 'not_found'> {
  // 1) Webhook receipt — dedupe BEFORE any side effect
  try {
    await fastify.prisma.webhookEvent.create({
      data: {
        provider: 'MERCADO_PAGO',
        eventId,
        payload: payment as unknown as Prisma.InputJsonValue,
      },
    })
  } catch {
    return 'ignored' // duplicate receipt — already processed
  }

  // 2) No external reference → nothing to correlate (log only)
  if (!payment.externalReference) return 'not_found'

  const order = await fastify.prisma.order.findUnique({
    where: { orderNumber: payment.externalReference },
    include: { items: true },
  })
  if (!order) return 'not_found'

  // 3) Record the payment attempt (idempotent anchor for replays)
  await fastify.prisma.paymentTransaction.upsert({
    where: {
      provider_providerPaymentId: {
        provider: 'MERCADO_PAGO',
        providerPaymentId: payment.paymentId,
      },
    },
    update: { status: mapPaymentStatus(payment.status) },
    create: {
      orderId: order.id,
      provider: 'MERCADO_PAGO',
      providerPaymentId: payment.paymentId,
      status: mapPaymentStatus(payment.status),
      raw: payment as unknown as Prisma.InputJsonValue,
    },
  })

  // 4) The ONE money-moving transition: approved + still pending
  if (payment.status === 'approved' && order.status === 'PENDING_PAYMENT') {
    await fastify.prisma.$transaction(async (tx) => {
      // Reservation → real decrement
      for (const item of order.items) {
        if (item.productId === null) continue
        await tx.$executeRaw`
          UPDATE "Product"
          SET "reservedQuantity" = GREATEST("reservedQuantity" - ${item.quantity}, 0),
              "stockQuantity" = GREATEST("stockQuantity" - ${item.quantity}, 0)
          WHERE "id" = ${item.productId}
        `
      }
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod: payment.paymentTypeId,
          paymentTransactionId: payment.paymentId,
        },
      })
    })
    return 'applied'
  }

  if (payment.status === 'rejected') {
    await fastify.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'FAILED' },
    })
  }

  // approved-on-already-PAID, pending, in_process → no state change
  return 'ignored'
}

function mapPaymentStatus(status: string): 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED' {
  switch (status) {
    case 'approved':
      return 'PAID'
    case 'rejected':
      return 'FAILED'
    case 'cancelled':
      return 'EXPIRED'
    case 'refunded':
      return 'REFUNDED'
    default:
      return 'PENDING'
  }
}

/**
 * Expiry sweeper: PENDING_PAYMENT orders past expiresAt → EXPIRED with the
 * reservation released. MP notifies cancellations, but webhooks get lost —
 * this is the safety net. Runs at boot and every 15 minutes.
 */
export async function sweepExpiredOrders(fastify: FastifyInstance): Promise<number> {
  const stale = await fastify.prisma.order.findMany({
    where: { status: 'PENDING_PAYMENT', expiresAt: { lt: new Date() } },
    include: { items: true },
  })

  for (const order of stale) {
    await fastify.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.productId === null) continue
        await tx.$executeRaw`
          UPDATE "Product"
          SET "reservedQuantity" = GREATEST("reservedQuantity" - ${item.quantity}, 0)
          WHERE "id" = ${item.productId}
        `
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'EXPIRED', paymentStatus: 'EXPIRED' },
      })
    })
  }

  return stale.length
}
