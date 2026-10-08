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
let productId: number

const uniqueEmail = () => `cart-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

async function register() {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      firstName: 'Caro',
      lastName: 'Cliente',
      email: uniqueEmail(),
      password: 'prueba123',
    },
  })
  return response.json().data.accessToken as string
}

beforeAll(async () => {
  app = await buildApp()
  token = await register()
  const products = await app.inject({ method: 'GET', url: '/api/v1/products?limit=1' })
  productId = products.json().data.products[0].id
})

afterAll(async () => {
  await app.close()
})

const authHeaders = () => ({ authorization: `Bearer ${token}` })

describe('PUT /api/v1/cart/items', () => {
  it('adds a line and returns the cart with product data', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: authHeaders(),
      payload: { productId, quantity: 2 },
    })
    expect(response.statusCode).toBe(200)
    const items = response.json().data.items
    expect(items).toHaveLength(1)
    expect(items[0].productId).toBe(productId)
    expect(items[0].quantity).toBe(2)
    expect(Number.isInteger(items[0].priceCents)).toBe(true)
    expect(typeof items[0].available).toBe('number')
  })

  it('upserts the absolute quantity', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: authHeaders(),
      payload: { productId, quantity: 5 },
    })
    const items = response.json().data.items
    expect(items[0].quantity).toBe(5)
  })

  it('rejects quantity above availability with 409', async () => {
    const cart = await app.inject({
      method: 'GET',
      url: '/api/v1/cart',
      headers: authHeaders(),
    })
    const available = cart.json().data.items[0].available
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: authHeaders(),
      payload: { productId, quantity: available + 1 },
    })
    expect(response.statusCode).toBe(409)
  })

  it('removes the line when quantity is 0', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: authHeaders(),
      payload: { productId, quantity: 0 },
    })
    expect(response.json().data.items).toHaveLength(0)
  })

  it('404s for unknown products', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: authHeaders(),
      payload: { productId: 999999, quantity: 1 },
    })
    expect(response.statusCode).toBe(404)
  })

  it('401s without a token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/cart',
    })
    expect(response.statusCode).toBe(401)
  })
})

describe('POST /api/v1/cart/merge', () => {
  it('sums guest quantities into existing lines (capped at availability)', async () => {
    await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: authHeaders(),
      payload: { productId, quantity: 2 },
    })
    const merged = await app.inject({
      method: 'POST',
      url: '/api/v1/cart/merge',
      headers: authHeaders(),
      payload: { items: [{ productId, quantity: 3 }] },
    })
    expect(merged.statusCode).toBe(200)
    const line = merged
      .json()
      .data.items.find((i: { productId: number }) => i.productId === productId)
    expect(line.quantity).toBe(5)
  })

  it('silently drops guest lines for vanished products', async () => {
    const merged = await app.inject({
      method: 'POST',
      url: '/api/v1/cart/merge',
      headers: authHeaders(),
      payload: { items: [{ productId: 999999, quantity: 1 }] },
    })
    expect(merged.statusCode).toBe(200)
    expect(
      merged.json().data.items.some((i: { productId: number }) => i.productId === 999999)
    ).toBe(false)
  })
})

describe('DELETE /api/v1/cart', () => {
  it('clears the cart', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/v1/cart',
      headers: authHeaders(),
    })
    expect(response.statusCode).toBe(200)
    const cart = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: authHeaders() })
    expect(cart.json().data.items).toHaveLength(0)
  })
})
