import 'dotenv/config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import argon2 from 'argon2'
import { buildApp } from '../src/app'

Object.assign(process.env, {
  NODE_ENV: 'test',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'test-secret-access-0123456789',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'test-secret-refresh-0123456789',
})

let app: Awaited<ReturnType<typeof buildApp>>
const RUN = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
let adminToken: string
let userToken: string

const uniqueEmail = () => `adm-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

async function register(role: 'USER' | 'ADMIN' = 'USER') {
  const email = uniqueEmail()
  const passwordHash = await argon2.hash('prueba123')
  const user = await app.prisma.user.create({
    data: { firstName: 'Admin', lastName: 'Test', email, passwordHash, role, emailVerified: true },
  })
  const token = app.jwt.sign({ sub: user.id, role, type: 'access' })
  return token
}

beforeAll(async () => {
  app = await buildApp()
  adminToken = await register('ADMIN')
  userToken = await register('USER')
})

afterAll(async () => {
  await app.close()
})

describe('admin guard', () => {
  it('blocks non-admin users from every admin route', async () => {
    for (const path of ['/admin/dashboard', '/admin/products', '/admin/orders', '/admin/users']) {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1${path}`,
        headers: { authorization: `Bearer ${userToken}` },
      })
      expect(response.statusCode, path).toBe(403)
    }
  })

  it('blocks anonymous access', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/admin/dashboard' })
    expect(response.statusCode).toBe(401)
  })
})

describe('admin product CRUD', () => {
  let createdId: number

  it('creates a product (slug derived, searchable, MXN cents)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      headers: { authorization: `Bearer ${adminToken}` },
      payload: {
        name: `Carriola ${RUN} Áéíóú`,
        description: 'Carriola ligera de prueba',
        priceCents: 499900,
        categorySlug: 'ropa',
        sku: `ADM-${RUN}-001`,
        stockQuantity: 15,
        imageUrl: 'https://example.com/x.jpg',
      },
    })
    expect(response.statusCode).toBe(201)
    const product = response.json().data
    expect(product.slug).toBe(`carriola-${RUN}-aeiou`) // accents stripped
    expect(product.priceCents).toBe(499900)
    expect(product.isActive).toBe(true)
    createdId = product.id
  })

  it('rejects duplicate slug (same name) with 409', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      headers: { authorization: `Bearer ${adminToken}` },
      payload: {
        name: `Carriola ${RUN} Áéíóú`,
        description: 'Otra igual',
        priceCents: 1000,
        categorySlug: 'ropa',
        sku: `ADM-${RUN}-002`,
      },
    })
    expect(response.statusCode).toBe(409)
  })

  it('updates price and stock; product appears in public catalog', async () => {
    const updated = await app.inject({
      method: 'PUT',
      url: `/api/v1/admin/products/${createdId}`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { priceCents: 399900, stockQuantity: 30 },
    })
    expect(updated.statusCode).toBe(200)
    expect(updated.json().data.priceCents).toBe(399900)

    const pub = await app.inject({ method: 'GET', url: `/api/v1/products/carriola-${RUN}-aeiou` })
    expect(pub.statusCode).toBe(200)
    expect(pub.json().data.priceCents).toBe(399900)
    expect(pub.json().data.available).toBe(30)
  })

  it('soft-deletes: hidden from catalog, row kept for order history', async () => {
    const gone = await app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/products/${createdId}`,
      headers: { authorization: `Bearer ${adminToken}` },
    })
    expect(gone.statusCode).toBe(200)

    const pub = await app.inject({ method: 'GET', url: `/api/v1/products/carriola-${RUN}-aeiou` })
    expect(pub.statusCode).toBe(404)

    const adminList = await app.inject({
      method: 'GET',
      url: `/api/v1/admin/products?search=${RUN}`,
      headers: { authorization: `Bearer ${adminToken}` },
    })
    expect(adminList.json().data.products.length).toBe(1) // still there for admin
  })
})

describe('admin order fulfillment', () => {
  it('dashboard returns REAL aggregates', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/dashboard',
      headers: { authorization: `Bearer ${adminToken}` },
    })
    expect(response.statusCode).toBe(200)
    const data = response.json().data
    expect(typeof data.products.total).toBe('number')
    expect(typeof data.revenueCents).toBe('number')
    expect(Array.isArray(data.lowStock)).toBe(true)
    expect(Array.isArray(data.recentOrders)).toBe(true)
  })

  it('rejects illegal status transitions (PENDING_PAYMENT → SHIPPED)', async () => {
    // crea pedido propio de un usuario normal
    const email = uniqueEmail()
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'A', lastName: 'B', email, password: 'prueba123' },
    })
    const token = reg.json().data.accessToken
    // Este archivo es dueño de 'toallitas-humedas' (stock determinista)
    const product = (
      await app.inject({ method: 'GET', url: '/api/v1/products/toallitas-humedas' })
    ).json().data
    await app.prisma.product.update({
      where: { id: product.id },
      data: { stockQuantity: 20, reservedQuantity: 0 },
    })
    await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items',
      headers: { authorization: `Bearer ${token}` },
      payload: { productId: product.id, quantity: 1 },
    })
    const order = await app.inject({
      method: 'POST',
      url: '/api/v1/orders',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        shippingAddress: {
          recipientName: 'Prueba Admin',
          phone: '5512345678',
          street: 'Calle',
          exteriorNumber: '1',
          colonia: 'Col',
          municipality: 'Mun',
          state: 'Edo',
          postalCode: '00000',
        },
      },
    })
    const orderNumber = order.json().data.orderNumber

    const illegal = await app.inject({
      method: 'PUT',
      url: `/api/v1/admin/orders/${orderNumber}/status`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { status: 'SHIPPED' },
    })
    expect(illegal.statusCode).toBe(409)

    // PAID manual también ilegal: los pagos solo llegan por webhook
    const manualPaid = await app.inject({
      method: 'PUT',
      url: `/api/v1/admin/orders/${orderNumber}/status`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { status: 'PAID' },
    })
    expect(manualPaid.statusCode).toBe(409)
  })

  it('users list exposes no password hashes', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${adminToken}` },
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.stringify(response.json())).not.toContain('passwordHash')
    expect(response.json().data.users[0]).toHaveProperty('orderCount')
  })
})
