import type { FastifyInstance } from 'fastify'
import argon2 from 'argon2'
import { ApiError } from '../errors.js'
import {
  clearRefreshCookie,
  setRefreshCookie,
  signRefreshToken,
  verifyRefreshToken,
} from '../plugins/auth.js'
import {
  generateToken,
  hashToken,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../services/mailer.js'
import { env } from '../config/env.js'

type PublicUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN'
  phone: string | null
  emailVerified: boolean
  createdAt: Date
}

function toPublicUser(user: {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN'
  phone: string | null
  emailVerified: boolean
  createdAt: Date
}): PublicUser {
  // Whitelist: passwordHash and token hashes must never leave the server.
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  }
}

const publicUserSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string', enum: ['USER', 'ADMIN'] },
    phone: { type: ['string', 'null'] },
    emailVerified: { type: 'boolean' },
    createdAt: { type: 'string' },
  },
  required: ['id', 'firstName', 'lastName', 'email', 'role', 'emailVerified'],
}

const credentialsSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8, maxLength: 128 },
  },
  required: ['email', 'password'],
}

const PASSWORD_PATTERN = '^(?=.*[A-Za-z])(?=.*\\d).{8,128}$'

function authRateLimit() {
  return { rateLimit: { max: 10, timeWindow: '1 minute' } }
}

export async function authRoutes(fastify: FastifyInstance) {
  // ── POST /auth/register ─────────────────────────────────────────────────
  fastify.post('/api/v1/auth/register', {
    config: authRateLimit(),
    schema: {
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 1, maxLength: 100 },
          lastName: { type: 'string', minLength: 1, maxLength: 100 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', pattern: PASSWORD_PATTERN },
        },
        required: ['firstName', 'lastName', 'email', 'password'],
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: publicUserSchema,
                accessToken: { type: 'string' },
              },
              required: ['user', 'accessToken'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request, reply) => {
      const { firstName, lastName, email, password } = request.body as {
        firstName: string
        lastName: string
        email: string
        password: string
      }

      const existing = await fastify.prisma.user.findUnique({ where: { email } })
      if (existing) {
        // 409 enables email enumeration on register — accepted tradeoff for
        // UX; login/forgot stay generic so enumeration there is not possible.
        throw ApiError.conflict('Ya existe una cuenta con este correo')
      }

      const passwordHash = await argon2.hash(password)
      const { token, tokenHash } = generateToken()

      const user = await fastify.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
          emailVerificationTokenHash: tokenHash,
        },
      })

      await sendVerificationEmail(email, token).catch((error) => {
        // Email failure must not block registration; log and continue.
        request.log.error({ error }, 'verification email failed')
      })

      const accessToken = fastify.jwt.sign({ sub: user.id, role: user.role, type: 'access' })
      setRefreshCookie(reply, signRefreshToken(fastify, user.id))

      return reply.status(201).send({
        success: true,
        data: { user: toPublicUser(user), accessToken },
      })
    },
  })

  // ── POST /auth/login ────────────────────────────────────────────────────
  fastify.post('/api/v1/auth/login', {
    config: authRateLimit(),
    schema: {
      body: credentialsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: { user: publicUserSchema, accessToken: { type: 'string' } },
              required: ['user', 'accessToken'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string }

      const user = await fastify.prisma.user.findUnique({ where: { email } })

      // Timing-safe: always run one argon2 verification, even with no user.
      const hash = user?.passwordHash ?? DUMMY_HASH
      const valid = await argon2.verify(hash, password).catch(() => false)

      if (!user || !valid || !user.isActive) {
        throw ApiError.unauthorized('Credenciales incorrectas')
      }

      const accessToken = fastify.jwt.sign({ sub: user.id, role: user.role, type: 'access' })
      setRefreshCookie(reply, signRefreshToken(fastify, user.id))

      return {
        success: true,
        data: { user: toPublicUser(user), accessToken },
      }
    },
  })

  // ── POST /auth/logout ───────────────────────────────────────────────────
  fastify.post('/api/v1/auth/logout', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: { success: { type: 'boolean' } },
          required: ['success'],
        },
      },
    },
    handler: async (_request, reply) => {
      clearRefreshCookie(reply)
      return { success: true }
    },
  })

  // ── POST /auth/refresh ──────────────────────────────────────────────────
  fastify.post('/api/v1/auth/refresh', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: { accessToken: { type: 'string' } },
              required: ['accessToken'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request, reply) => {
      const token = request.cookies['refresh_token']
      if (!token) throw ApiError.unauthorized()

      let userId: number
      try {
        userId = verifyRefreshToken(fastify, token).sub
      } catch {
        throw ApiError.unauthorized()
      }

      const user = await fastify.prisma.user.findUnique({ where: { id: userId } })
      if (!user || !user.isActive) throw ApiError.unauthorized()

      // Rotate the refresh cookie on every use.
      const accessToken = fastify.jwt.sign({ sub: user.id, role: user.role, type: 'access' })
      setRefreshCookie(reply, signRefreshToken(fastify, user.id))

      return { success: true, data: { accessToken } }
    },
  })

  // ── GET /auth/me ────────────────────────────────────────────────────────
  fastify.get('/api/v1/auth/me', {
    preHandler: fastify.authenticate,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: publicUserSchema,
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request) => {
      const user = await fastify.prisma.user.findUnique({
        where: { id: request.user.sub },
      })
      if (!user || !user.isActive) throw ApiError.unauthorized()
      return { success: true, data: toPublicUser(user) }
    },
  })

  // ── POST /auth/forgot-password ──────────────────────────────────────────
  fastify.post('/api/v1/auth/forgot-password', {
    config: authRateLimit(),
    schema: {
      body: {
        type: 'object',
        properties: { email: { type: 'string', format: 'email' } },
        required: ['email'],
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: { success: { type: 'boolean' } },
          required: ['success'],
        },
      },
    },
    handler: async (request, reply) => {
      const { email } = request.body as { email: string }
      const user = await fastify.prisma.user.findUnique({ where: { email } })

      if (user) {
        const { token, tokenHash } = generateToken()
        await fastify.prisma.user.update({
          where: { id: user.id },
          data: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          },
        })
        await sendPasswordResetEmail(email, token).catch((error) => {
          request.log.error({ error }, 'reset email failed')
        })
      }

      // Always 200 — never reveal whether the account exists.
      return { success: true }
    },
  })

  // ── POST /auth/reset-password ───────────────────────────────────────────
  fastify.post('/api/v1/auth/reset-password', {
    config: authRateLimit(),
    schema: {
      body: {
        type: 'object',
        properties: {
          token: { type: 'string', minLength: 32 },
          password: { type: 'string', pattern: PASSWORD_PATTERN },
        },
        required: ['token', 'password'],
        additionalProperties: false,
      },
      response: {
        200: {
          type: 'object',
          properties: { success: { type: 'boolean' } },
          required: ['success'],
        },
      },
    },
    handler: async (request) => {
      const { token, password } = request.body as { token: string; password: string }

      const user = await fastify.prisma.user.findUnique({
        where: { passwordResetTokenHash: hashToken(token) },
      })

      if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
        throw ApiError.badRequest('El enlace de restablecimiento es inválido o ha expirado')
      }

      await fastify.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await argon2.hash(password),
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
        },
      })

      return { success: true }
    },
  })

  // ── GET /auth/verify-email ──────────────────────────────────────────────
  fastify.get('/api/v1/auth/verify-email', {
    schema: {
      querystring: {
        type: 'object',
        properties: { token: { type: 'string', minLength: 32 } },
        required: ['token'],
      },
    },
    handler: async (_request, reply) => {
      const { token } = _request.query as { token: string }
      const user = await fastify.prisma.user.findUnique({
        where: { emailVerificationTokenHash: hashToken(token) },
      })

      if (!user) {
        throw ApiError.badRequest('El enlace de verificación es inválido')
      }

      await fastify.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, emailVerificationTokenHash: null },
      })

      return { success: true }
    },
  })
}

// Pre-computed hash of a random string — used to equalize login timing
// when the account does not exist (constant-ish response time).
const DUMMY_HASH = await argon2.hash(randomDummy())

function randomDummy() {
  return 'dummy-password-for-timing-' + Math.random().toString(36).slice(2)
}
