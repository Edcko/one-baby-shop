import 'dotenv/config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app'

/**
 * Integration tests — require a running PostgreSQL (see docker-compose.yml
 * or the local setup in README). Uses fastify.inject(): no TCP needed.
 */

const TEST_PORT_ENV = {
  ...process.env,
  NODE_ENV: 'test',
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgresql://babyshop:babyshop_dev@localhost:5432/babyshop?schema=public',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'test-secret-access-0123456789',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'test-secret-refresh-0123456789',
}

// Re-import env AFTER setting test values would be complex; instead the app
// reads process.env at import time, so we mutate before importing.
Object.assign(process.env, TEST_PORT_ENV)

let app: Awaited<ReturnType<typeof buildApp>>

beforeAll(async () => {
  app = await buildApp()
})

afterAll(async () => {
  await app.close()
})

describe('GET /health', () => {
  it('reports ok with database up', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' })
    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.status).toBe('ok')
    expect(body.database).toBe('up')
  })
})

describe('GET /api/v1/products', () => {
  it('lists active products with pagination', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?limit=5' })
    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.success).toBe(true)
    expect(body.data.products.length).toBeLessThanOrEqual(5)
    expect(body.data.pagination).toMatchObject({
      page: 1,
      limit: 5,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    })
  })

  it('exposes money in centavos (Int), never decimals', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?limit=1' })
    const product = response.json().data.products[0]
    expect(Number.isInteger(product.priceCents)).toBe(true)
  })

  it('filters by category slug', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/products?category=higiene',
    })
    const body = response.json()
    expect(body.success).toBe(true)
    for (const product of body.data.products) {
      expect(product.category.slug).toBe('higiene')
    }
  })

  it('searches accent-insensitively (biberon finds Biberón)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/products?search=biberon',
    })
    const body = response.json()
    expect(body.data.pagination.total).toBeGreaterThanOrEqual(1)
    expect(body.data.products[0].name).toContain('Biberón')
  })

  it('sorts by price ascending', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/products?sort=price&order=asc&limit=50',
    })
    const prices = response.json().data.products.map((p: { priceCents: number }) => p.priceCents)
    const sorted = [...prices].sort((a: number, b: number) => a - b)
    expect(prices).toEqual(sorted)
  })

  it('rejects min > max price with 400 envelope', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/products?minPriceCents=5000&maxPriceCents=1000',
    })
    expect(response.statusCode).toBe(400)
    const body = response.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('VALIDATION_ERROR')
  })

  it('rejects limit over 100 with schema validation', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?limit=500' })
    expect(response.statusCode).toBe(400)
    expect(response.json().error).toBe('VALIDATION_ERROR')
  })
})

describe('GET /api/v1/products/:idOrSlug', () => {
  it('finds by slug', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products/panales-premium' })
    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.data.slug).toBe('panales-premium')
    expect(body.data.ivaRate).toBe('SIXTEEN')
  })

  it('finds by numeric id', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products/1' })
    expect(response.statusCode).toBe(200)
    expect(response.json().success).toBe(true)
  })

  it('returns the documented 404 envelope for unknown products', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products/no-existe-xyz' })
    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      success: false,
      error: 'NOT_FOUND',
      message: 'El producto solicitado no existe',
    })
  })
})

describe('GET /api/v1/categories', () => {
  it('lists categories with product counts', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/categories' })
    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.data.categories.length).toBeGreaterThanOrEqual(5)
    for (const category of body.data.categories) {
      expect(typeof category.productCount).toBe('number')
    }
  })
})
