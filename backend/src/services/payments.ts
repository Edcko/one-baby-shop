import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'

/**
 * Mercado Pago provider (Checkout Pro — redirect to init_point).
 *
 * Everything happens SERVER-SIDE: the client never sees amounts of its own
 * making (the preference is built from the ORDER rows), and the webhook is
 * the only source of truth for payment confirmation.
 *
 * The interface exists so tests can inject a fake provider — MP sandbox
 * credentials are not always available in CI/local runs.
 */

export interface MpPreferenceInput {
  orderNumber: string
  totalCents: number
  items: { productName: string; quantity: number; unitPriceCents: number }[]
  payerEmail: string | null
  expiresAt: Date | null
  backUrls: { success: string; failure: string; pending: string }
  notificationUrl: string | null
}

export interface MpPreferenceResult {
  preferenceId: string
  initPoint: string
}

export interface MpPaymentInfo {
  paymentId: string
  status: 'approved' | 'pending' | 'in_process' | 'rejected' | 'cancelled' | 'refunded' | 'other'
  statusDetail: string | null
  paymentTypeId: string | null
  externalReference: string | null
  amountCents: number | null
}

export interface PaymentProvider {
  createPreference(input: MpPreferenceInput): Promise<MpPreferenceResult>
  fetchPayment(paymentId: string): Promise<MpPaymentInfo>
}

function mpClient(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN no está configurado')
  return new MercadoPagoConfig({ accessToken })
}

/**
 * MP Checkout Pro has no reliable shipping field — shipping is charged as an
 * explicit extra line so the preference total matches the order total exactly.
 */
function buildItems(input: MpPreferenceInput) {
  const items = input.items.map((item, index) => ({
    id: `${input.orderNumber}-${index + 1}`, // MP SDK requires item ids
    title: item.productName,
    quantity: item.quantity,
    unit_price: Number((item.unitPriceCents / 100).toFixed(2)),
    currency_id: 'MXN' as const,
  }))

  const itemsTotal = input.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0)
  const shippingCents = input.totalCents - itemsTotal
  if (shippingCents > 0) {
    items.push({
      id: `${input.orderNumber}-shipping`,
      title: 'Envío',
      quantity: 1,
      unit_price: Number((shippingCents / 100).toFixed(2)),
      currency_id: 'MXN' as const,
    })
  }
  return items
}

const realProvider: PaymentProvider = {
  async createPreference(input) {
    const preference = new Preference(mpClient())

    const response = await preference.create({
      body: {
        external_reference: input.orderNumber,
        items: buildItems(input),
        payer: input.payerEmail ? { email: input.payerEmail } : undefined,
        back_urls: input.backUrls,
        auto_return: 'approved',
        ...(input.notificationUrl ? { notification_url: input.notificationUrl } : {}),
        statement_descriptor: 'ONEBABYSHOP',
        binary_mode: false,
        ...(input.expiresAt
          ? {
              expires: true,
              expiration_date_to: input.expiresAt.toISOString().replace(/\.\d{3}Z$/, '-00:00'),
            }
          : {}),
      },
    })

    if (!response.init_point) throw new Error('MP no devolvió init_point')
    return { preferenceId: String(response.id), initPoint: response.init_point }
  },

  async fetchPayment(paymentId) {
    const payment = new Payment(mpClient())
    const response = await payment.get({ id: paymentId })

    const status = response.status as MpPaymentInfo['status']
    return {
      paymentId: String(response.id),
      status: status ?? 'other',
      statusDetail: response.status_detail ?? null,
      paymentTypeId: response.payment_type_id ?? null,
      externalReference: response.external_reference ?? null,
      amountCents: response.transaction_amount
        ? Math.round(response.transaction_amount * 100)
        : null,
    }
  },
}

export function getRealPaymentProvider(): PaymentProvider {
  return realProvider
}

/** Decorates fastify with the payment provider (overridable in tests). */
export async function registerPaymentProvider(
  fastify: FastifyInstance,
  provider?: PaymentProvider
) {
  // Lazily initialized: constructing the MP client without credentials throws,
  // and the server must still boot without MP configured (payments then 503).
  let instance: PaymentProvider | null = provider ?? null

  fastify.decorate('payments', {
    getOrCreate: () => {
      instance ??= (() => {
        try {
          return getRealPaymentProvider()
        } catch {
          return null
        }
      })()
      return instance
    },
    setForTesting: (p: PaymentProvider | null) => {
      instance = p
    },
  })
}

declare module 'fastify' {
  interface FastifyInstance {
    payments: {
      getOrCreate: () => PaymentProvider | null
      setForTesting: (provider: PaymentProvider | null) => void
    }
  }
}
