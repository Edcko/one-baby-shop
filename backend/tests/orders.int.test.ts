import 'dotenv/config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app'

Object.assign(process.env, {
  NODE_ENV: 'test',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'test-secret-access-0123456789',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'test-secret-refresh-0123456789',
})

let app: Awaited<ReturnType<typeof buildApp>>
let token: string

const uniqueEmail = () => `ord-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

const ADDRESS = {
  recipientName: 'María López',
  phone: '5512345678',
  street: 'Av. Reforma',
  exteriorNumber: '123',
  interiorNumber: '4B',
  colonia: 'Juárez',
  municipality: 'Cuauhtémoc',
  state: 'CDMX',
  postalCode: '06600',
  references: 'Timbrar 4B',
}

async function registerAndFillCart(quantity = 2) {
  const reg = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      firstName: 'Orden',
      lastName: 'Prueba',
      email: uniqueEmail(),
      password: 'prueba123',
    },
  })
  const accessToken = reg.json().data.accessToken as string
  const products = await app.inject({ method: 'GET', url: '/api/v1/products/manta-de-algodon' })
  const productId = products.json().data.id
  await app.prisma.product.update({
    where: { id: productId },
    data: { stockQuantity: 30, reservedQuantity: 0 },
  })
  await app.inject({
    method: 'PUT',
    url: '/api/v1/cart/items',
    headers: { authorization: `Bearer ${accessToken}` },
    payload: { productId, quantity },
  })
  return { accessToken, productId }
}

beforeAll(async () => {
  app = await buildApp()
})

afterAll(async () => {
  await app.close()
})

describe('POST /api/v1/orders', () => {
  it('creates a PENDING_PAYMENT order with server-computed totals and stock reservation', async () => {
    const { accessToken, productId } = await registerAndFillCart(2)
    const product = (
      await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    ).json().data

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { shippingAddress: ADDRESS },
    })

    expect(response.statusCode).toBe(201)
    const order = response.json().data
    expect(order.status).toBe('PENDING_PAYMENT')
    expect(order.orderNumber).toMatch(/^OBS-\d{8}-[A-F0-9]{6}$/)
    expect(order.currency).toBe('MXN')

    // Totals from DB prices, never from the client
    const expectedSubtotal = product.priceCents * 2
    expect(order.subtotalCents).toBe(expectedSubtotal)
    expect(order.items).toHaveLength(1)
    expect(order.items[0].unitPriceCents).toBe(product.priceCents)
    expect(order.ivaCents).toBeGreaterThan(0) // desglose incluido en el precio
    // Envío: 2 × $29.99 = $59.98 < $500 → paga envío $99
    expect(order.shippingCents).toBe(9900)
    expect(order.totalCents).toBe(expectedSubtotal + 9900)

    // Snapshot de dirección mexicana presente
    expect(order.shippingAddress.postalCode).toBe('06600')
    expect(order.expiresAt).toBeTruthy()

    // Reserva reflejada en disponibilidad
    const after = (await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })).json()
      .data
    expect(after.available).toBe(product.available - 2)

    // El carrito quedó vacío
    const cart = await app.inject({
      method: 'GET',
      url: '/api/v1/cart',
      headers: { authorization: `Bearer ${accessToken}` },
    })
    expect(cart.json().data.items).toHaveLength(0)

    token = accessToken
  })

  it('rejects an empty cart with 400', async () => {
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'A', lastName: 'B', email: uniqueEmail(), password: 'prueba123' },
    })
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${reg.json().data.accessToken}` },
      payload: { shippingAddress: ADDRESS },
    })
    expect(response.statusCode).toBe(400)
  })

  it('rejects an invalid Mexican address (bad CP / phone)', async () => {
    const { accessToken } = await registerAndFillCart(1)
    const bad = await app.inject({
      method: 'POST',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: {
        shippingAddress: { ...ADDRESS, postalCode: '66', phone: 'abc' },
      },
    })
    expect(bad.statusCode).toBe(400)
    expect(bad.json().error).toBe('VALIDATION_ERROR')
  })
})

describe('GET /api/v1/orders', () => {
  it('lists only the owner orders', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${token}` },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json().data.orders.length).toBeGreaterThanOrEqual(1)
  })

  it('hides other users orders on detail', async () => {
    const list = await app.inject({
      method: 'GET',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${token}` },
    })
    const orderNumber = list.json().data.orders[0].orderNumber
    const stranger = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'Otro', lastName: 'User', email: uniqueEmail(), password: 'prueba123' },
    })
    const detail = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${orderNumber}`,
      headers: { authorization: `Bearer ${stranger.json().data.accessToken}` },
    })
    expect(detail.statusCode).toBe(404)
  })
})

describe('POST /api/v1/orders/:orderNumber/cancel', () => {
  it('cancels a pending order and RELEASES the reservation', async () => {
    const { accessToken, productId } = await registerAndFillCart(3)
    const before = (
      await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    ).json().data.available

    const created = await app.inject({
      method: 'POST',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { shippingAddress: ADDRESS },
    })
    const orderNumber = created.json().data.orderNumber
    const reserved = (
      await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    ).json().data.available
    expect(reserved).toBe(before - 3)

    const cancelled = await app.inject({
      method: 'POST',
      url: `/api/v1/orders/${orderNumber}/cancel`,
      headers: { authorization: `Bearer ${accessToken}` },
    })
    expect(cancelled.statusCode).toBe(200)
    expect(cancelled.json().data.status).toBe('CANCELLED')

    const released = (
      await app.inject({ method: 'GET', url: `/api/v1/products/${productId}` })
    ).json().data.available
    expect(released).toBe(before) // stock de vuelta

    // Idempotencia de estado: ya no es cancelable
    const again = await app.inject({
      method: 'POST',
      url: `/api/v1/orders/${orderNumber}/cancel`,
      headers: { authorization: `Bearer ${accessToken}` },
    })
    expect(again.statusCode).toBe(409)
  })
})

describe('User addresses', () => {
  it('creates, lists and deletes a Mexican address', async () => {
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        firstName: 'Dir',
        lastName: 'Prueba',
        email: uniqueEmail(),
        password: 'prueba123',
      },
    })
    const headers = { authorization: `Bearer ${reg.json().data.accessToken}` }

    const created = await app.inject({
      method: 'POST',
      url: '/api/v1/user/addresses',
      headers,
      payload: { ...ADDRESS, isDefault: true },
    })
    expect(created.statusCode).toBe(201)
    const id = created.json().data.id

    const list = await app.inject({ method: 'GET', url: '/api/v1/user/addresses', headers })
    expect(list.json().data.addresses).toHaveLength(1)
    // Fiscal columns never cross the wire
    expect(JSON.stringify(list.json())).not.toContain('rfc')

    const deleted = await app.inject({
      method: 'DELETE',
      url: `/api/v1/user/addresses/${id}`,
      headers,
    })
    expect(deleted.statusCode).toBe(204)
  })
})
