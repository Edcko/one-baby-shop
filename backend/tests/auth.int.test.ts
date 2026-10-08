import 'dotenv/config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app'

Object.assign(process.env, {
  NODE_ENV: 'test',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'test-secret-access-0123456789',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'test-secret-refresh-0123456789',
})

function getSetCookie(response: { headers: Record<string, unknown> }): string {
  const raw = response.headers['set-cookie']
  return Array.isArray(raw) ? raw.join('; ') : String(raw ?? '')
}

let app: Awaited<ReturnType<typeof buildApp>>

const uniqueEmail = () => `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

beforeAll(async () => {
  app = await buildApp()
})

afterAll(async () => {
  await app.close()
})

describe('POST /api/v1/auth/register', () => {
  it('creates a user and returns tokens (auto-login)', async () => {
    const email = uniqueEmail()
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'María', lastName: 'López', email, password: 'corazon123' },
    })
    expect(response.statusCode).toBe(201)
    const body = response.json()
    expect(body.success).toBe(true)
    expect(body.data.user.email).toBe(email)
    expect(body.data.user.role).toBe('USER')
    expect(typeof body.data.accessToken).toBe('string')
    // Password hash must never leak
    expect(JSON.stringify(body)).not.toContain('passwordHash')
    // Refresh token in httpOnly cookie scoped to auth paths
    const setCookie = getSetCookie(response)
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Path=/api/v1/auth')
  })

  it('rejects weak passwords (min 8, letter+number)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'A', lastName: 'B', email: uniqueEmail(), password: 'short' },
    })
    expect(response.statusCode).toBe(400)
    expect(response.json().error).toBe('VALIDATION_ERROR')
  })

  it('rejects duplicate email with 409', async () => {
    const email = uniqueEmail()
    const payload = { firstName: 'A', lastName: 'B', email, password: 'corazon123' }
    await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload })
    const second = await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload })
    expect(second.statusCode).toBe(409)
  })
})

describe('POST /api/v1/auth/login', () => {
  it('logs in with valid credentials', async () => {
    const email = uniqueEmail()
    const password = 'corazon123'
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'Juan', lastName: 'Pérez', email, password },
    })
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json().data.user.email).toBe(email)
  })

  it('rejects wrong password with generic 401 (no user enumeration)', async () => {
    const email = uniqueEmail()
    await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'A', lastName: 'B', email, password: 'corazon123' },
    })
    const wrong = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password: 'incorrecta99' },
    })
    expect(wrong.statusCode).toBe(401)
    expect(wrong.json()).toEqual({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Credenciales incorrectas',
    })
    // Same envelope for non-existent account
    const ghost = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'noexiste@example.com', password: 'incorrecta99' },
    })
    expect(ghost.json()).toEqual(wrong.json())
  })
})

describe('GET /api/v1/auth/me', () => {
  it('returns the session user with a valid access token', async () => {
    const email = uniqueEmail()
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'Ana', lastName: 'García', email, password: 'corazon123' },
    })
    const { accessToken } = reg.json().data
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { authorization: `Bearer ${accessToken}` },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json().data.email).toBe(email)
  })

  it('rejects missing token with 401 envelope', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/auth/me' })
    expect(response.statusCode).toBe(401)
    expect(response.json().error).toBe('UNAUTHORIZED')
  })
})

describe('POST /api/v1/auth/refresh', () => {
  it('rotates the refresh cookie and returns a new access token', async () => {
    const email = uniqueEmail()
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'Luis', lastName: 'Hernández', email, password: 'corazon123' },
    })
    const cookie = getSetCookie(reg).split(';')[0]
    expect(cookie).toBeTruthy()

    const refreshed = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: { cookie },
    })
    expect(refreshed.statusCode).toBe(200)
    expect(typeof refreshed.json().data.accessToken).toBe('string')
    // Rotation: new Set-Cookie issued
    expect(refreshed.headers['set-cookie']).toBeTruthy()
  })

  it('rejects refresh without cookie', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/auth/refresh' })
    expect(response.statusCode).toBe(401)
  })

  it('rejects an access token used as refresh (type confusion)', async () => {
    const email = uniqueEmail()
    const reg = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { firstName: 'Elsa', lastName: 'Ríos', email, password: 'corazon123' },
    })
    const { accessToken } = reg.json().data
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: { cookie: `refresh_token=${accessToken}` },
    })
    expect(response.statusCode).toBe(401)
  })
})

describe('POST /api/v1/auth/logout', () => {
  it('clears the refresh cookie', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/auth/logout' })
    expect(response.statusCode).toBe(200)
    const setCookie = getSetCookie(response)
    expect(setCookie).toContain('refresh_token=;')
  })
})

describe('POST /api/v1/auth/forgot-password', () => {
  it('always returns 200 (never reveals account existence)', async () => {
    const known = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      payload: { email: uniqueEmail() },
    })
    const unknown = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      payload: { email: 'fantasma@example.com' },
    })
    expect(known.statusCode).toBe(200)
    expect(unknown.statusCode).toBe(200)
    expect(known.json()).toEqual(unknown.json())
  })
})

describe('POST /api/v1/auth/reset-password', () => {
  it('rejects invalid tokens with 400', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/reset-password',
      payload: { token: 'a'.repeat(64), password: 'nuevaclave1' },
    })
    expect(response.statusCode).toBe(400)
  })
})
