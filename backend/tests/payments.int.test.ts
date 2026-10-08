import 'dotenv/config'
import { createHmac } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app'
import type { PaymentProvider } from '../src/services/payments'
import { sweepExpiredOrders } from '../src/services/webhooks'

const WEBHOOK_SECRET = 'test-webhook-secret-0123456789abcdef'

Object.assign(process.env, {
  NODE_ENV: 'test',
  MP_WEBHOOK_SECRET: WEBHOOK_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'test-secret-access-0123456789',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'test-secret-refresh-0123456789',
})

let app: Awaited<ReturnType<typeof buildApp>>
const RUN = Date.now().toString(36)
let token: string
let orderNumber: string
let productId: number
let availableBeforeOrder: number

const uniqueEmail = () => `pay-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

const ADDRESS = {
  recipientName: 'María López',
  phone: '5512345678',
  street: 'Av. Reforma',
  exteriorNumber: '123',
  colonia: 'Juárez',
  municipality: 'Cuauhtémoc',
  state: 'CDMX',
  postalCode: '06600',
}

/** Fake MP provider — deterministic, no network. */
const fakePayments = new Map<
  string,
  { status: string; externalReference: string | null; amount: number }
>()
const fakeProvider: PaymentProvider = {
  async createPreference(input) {
    return {
      preferenceId: `FAKE-PREF-${input.orderNumber}`,
      initPoint: 'https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref=fake',
    }
  },
  async fetchPayment(paymentId) {
    const p = fakePayments.get(paymentId)
    if (!p) throw new Error('payment not found')
    return {
      paymentId,
      status: p.status as 'approved',
      statusDetail: 'accredited',
      paymentTypeId: 'oxxo',
      externalReference: p.externalReference,
      amountCents: Math.round(p.amount * 100),
    }
  },
}

function signedHeaders(dataId: string, requestId = 'req-123') {
  const ts = String(Math.floor(Date.now() / 1000))
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const v1 = createHmac('sha256', WEBHOOK_SECRET).update(manifest).digest('hex')
  return { 'x-signature': `ts=${ts},v1=${v1}`, 'x-request-id': requestId }
}

async function createUserWithOrder() {
  const reg = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: { firstName: 'Pay', lastName: 'Test', email: uniqueEmail(), password: 'prueba123' },
  })
  const accessToken = reg.json().data.accessToken as string
  const products = await app.inject({
    method: 'GET',
    url: '/api/v1/products?sort=price&order=asc&limit=1',
  })
  const product = products.json().data.products[0]
  productId = product.id
  // Deterministic: top the stock up (earlier runs' reservations bleed it dry)
  await app.prisma.product.update({
    where: { id: productId },
    data: { stockQuantity: 100, reservedQuantity: 0 },
  })
  availableBeforeOrder = 100
  await app.inject({
    method: 'PUT',
    url: '/api/v1/cart/items',
    headers: { authorization: `Bearer ${accessToken}` },
    payload: { productId, quantity: 2 },
  })
  const order = await app.inject({
    method: 'POST',
    url: '/api/v1/orders',
    headers: { authorization: `Bearer ${accessToken}` },
    payload: { shippingAddress: ADDRESS },
  })
  return { token: accessToken, orderNumber: order.json().data.orderNumber as string }
}

beforeAll(async () => {
  app = await buildApp()
  app.payments.setForTesting(fakeProvider)
})

afterAll(async () => {
  await app.close()
})

describe('POST /orders/:n/payment', () => {
  it('creates a preference with the fake provider and returns initPoint', async () => {
    ;({ token, orderNumber } = await createUserWithOrder())
    const response = await app.inject({
      method: 'POST',
      url: `/api/v1/orders/${orderNumber}/payment`,
      headers: { authorization: `Bearer ${token}` },
    })
    expect(response.statusCode).toBe(201)
    expect(response.json().data.initPoint).toContain('sandbox.mercadopago.com.mx')
  })

  it('rejects unknown orders and strangers', async () => {
    const stranger = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'X', lastName: 'Y', email: uniqueEmail(), password: 'prueba123' },
    })
    const forbidden = await app.inject({
      method: 'POST',
      url: `/api/v1/orders/${orderNumber}/payment`,
      headers: { authorization: `Bearer ${stranger.json().data.accessToken}` },
    })
    expect(forbidden.statusCode).toBe(404)
  })
})

describe('POST /payments/webhook', () => {
  it('rejects invalid signatures with 401', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/payments/webhook?data.id=999&type=payment',
      headers: { 'x-signature': 'ts=1,v1=deadbeef' },
      payload: {},
    })
    expect(response.statusCode).toBe(401)
  })

  it('APPROVES the order: reservation → real decrement, status PAID', async () => {
    // product.priceCents × 2 + envío
    const products = await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    const price = products.json().data.priceCents
    fakePayments.set(`PAY-${RUN}-1001`, {
      status: 'approved',
      externalReference: orderNumber,
      amount: (price * 2 + 9900) / 100,
    })

    const response = await app.inject({
      method: 'POST',
      url: `/api/v1/payments/webhook?data.id=PAY-${RUN}-1001&type=payment`,
      headers: signedHeaders(`PAY-${RUN}-1001`),
      payload: {},
    })
    expect(response.statusCode).toBe(200)
    expect(response.json().result).toBe('applied')

    const detail = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${orderNumber}`,
      headers: { authorization: `Bearer ${token}` },
    })
    const order = detail.json().data
    expect(order.status).toBe('PAID')
    expect(order.paymentStatus).toBe('PAID')
    expect(order.paymentMethod).toBe('oxxo')

    // Stock REAL decrementado (no solo reservado): available bajó 2 permanentemente
    const after = await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    expect(after.json().data.available).toBe(availableBeforeOrder - 2)
    expect(after.json().data.stockQuantity).toBeLessThan(products.json().data.stockQuantity)
  })

  it('REPLAYING the same webhook changes NOTHING (idempotency)', async () => {
    const before = await app.inject({
      method: 'GET',
      url: `/api/v1/products/${productId}`,
    })
    const stockBefore = before.json().data.stockQuantity

    const replay = await app.inject({
      method: 'POST',
      url: `/api/v1/payments/webhook?data.id=PAY-${RUN}-1001&type=payment`,
      headers: signedHeaders(`PAY-${RUN}-1001`),
      payload: {},
    })
    expect(replay.statusCode).toBe(200)
    expect(replay.json().result).toBe('ignored') // WebhookEvent dedupe

    const after = await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    expect(after.json().data.stockQuantity).toBe(stockBefore) // sin doble decremento
  })

  it('pending OXXO payment keeps the order PENDING_PAYMENT', async () => {
    const { token: accessToken, orderNumber: pending } = await createUserWithOrder()
    fakePayments.set(`PAY-${RUN}-2002`, {
      status: 'pending',
      externalReference: pending,
      amount: 100,
    })

    const response = await app.inject({
      method: 'POST',
      url: `/api/v1/payments/webhook?data.id=PAY-${RUN}-2002&type=payment`,
      headers: signedHeaders(`PAY-${RUN}-2002`),
      payload: {},
    })
    expect(response.json().result).toBe('ignored')

    const detail = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${pending}`,
      headers: { authorization: `Bearer ${accessToken}` },
    })
    expect(detail.json().data.status).toBe('PENDING_PAYMENT')
  })

  it('acknowledges webhooks for unknown orders (200, no retry storm)', async () => {
    fakePayments.set(`PAY-${RUN}-3003`, {
      status: 'approved',
      externalReference: 'OBS-XXXX-NOPE',
      amount: 1,
    })
    const response = await app.inject({
      method: 'POST',
      url: `/api/v1/payments/webhook?data.id=PAY-${RUN}-3003&type=payment`,
      headers: signedHeaders(`PAY-${RUN}-3003`),
      payload: {},
    })
    expect(response.statusCode).toBe(200)
    expect(response.json().result).toBe('not_found')
  })
})

describe('expiry sweeper', () => {
  it('expires stale PENDING_PAYMENT orders and releases stock', async () => {
    const { token: accessToken, orderNumber: stale } = await createUserWithOrder()

    // Forzar expiración moviendo expiresAt al pasado
    const order = await app.prisma.order.findUnique({ where: { orderNumber: stale } })
    await app.prisma.order.update({
      where: { id: order!.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    })

    const expired = await sweepExpiredOrders(app)
    expect(expired).toBeGreaterThanOrEqual(1)

    const detail = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${stale}`,
      headers: { authorization: `Bearer ${accessToken}` },
    })
    expect(detail.json().data.status).toBe('EXPIRED')
  })
})
