import fp from 'fastify-plugin'
import fjwt from '@fastify/jwt'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../config/env.js'

/**
 * Two-token model:
 * - Access token: 15 min, returned in JSON, kept by the client in MEMORY only
 *   (never localStorage — XSS must not be able to steal a bearer token).
 * - Refresh token: 7 days, Set-Cookie httpOnly + sameSite=lax + path scoped
 *   to /api/v1/auth so the cookie is sent ONLY to auth endpoints.
 */
export const ACCESS_TTL = '15m'
export const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days
export const REFRESH_COOKIE = 'refresh_token'

export interface AccessTokenPayload {
  sub: number
  role: 'USER' | 'ADMIN'
  type: 'access'
}

export interface RefreshTokenPayload {
  sub: number
  type: 'refresh'
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AccessTokenPayload | RefreshTokenPayload
    user: AccessTokenPayload
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    authenticateAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export default fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fjwt, {
      secret: env.JWT_ACCESS_SECRET,
      sign: { expiresIn: ACCESS_TTL },
    })

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
        if (request.user.type !== 'access') throw new Error('wrong token type')
      } catch {
        return reply.status(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Token de autenticación inválido o expirado',
        })
      }
    })

    fastify.decorate('authenticateAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
        if (request.user.type !== 'access') throw new Error('wrong token type')
        if (request.user.role !== 'ADMIN') throw new Error('forbidden')
      } catch {
        return reply.status(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'No tienes permisos para acceder a este recurso',
        })
      }
    })
  },
  { name: 'auth' }
)

/** Signs a refresh JWT with its own secret. Kept here so secrets stay in one module. */
export function signRefreshToken(fastify: FastifyInstance, userId: number) {
  // @fastify/jwt supports per-call secrets; refresh uses the dedicated one.
  return fastify.jwt.sign(
    { sub: userId, type: 'refresh' },
    {
      expiresIn: REFRESH_TTL_SECONDS,
      key: env.JWT_REFRESH_SECRET,
    }
  )
}

export function verifyRefreshToken(fastify: FastifyInstance, token: string) {
  const payload = fastify.jwt.verify<RefreshTokenPayload>(token, {
    key: env.JWT_REFRESH_SECRET,
  })
  if (payload.type !== 'refresh') throw new Error('wrong token type')
  return payload
}
