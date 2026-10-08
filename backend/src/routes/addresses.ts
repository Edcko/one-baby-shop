import type { FastifyInstance } from 'fastify'
import { ApiError } from '../errors.js'

const addressJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    recipientName: { type: 'string' },
    phone: { type: 'string' },
    street: { type: 'string' },
    exteriorNumber: { type: 'string' },
    interiorNumber: { type: ['string', 'null'] },
    colonia: { type: 'string' },
    municipality: { type: 'string' },
    state: { type: 'string' },
    postalCode: { type: 'string' },
    references: { type: ['string', 'null'] },
    isDefault: { type: 'boolean' },
  },
  required: ['id', 'street', 'colonia', 'municipality', 'state', 'postalCode'],
}

export async function addressRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/user/addresses', {
    preHandler: fastify.authenticate,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: { addresses: { type: 'array', items: addressJsonSchema } },
              required: ['addresses'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request) => {
      const addresses = await fastify.prisma.address.findMany({
        where: { userId: request.user.sub },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      })
      // Address rows keep fiscal columns private until invoicing ships (F9):
      // only shipping-relevant fields cross the wire.
      return {
        success: true,
        data: {
          addresses: addresses.map((a) => ({
            id: a.id,
            recipientName: a.recipientName,
            phone: a.phone,
            street: a.street,
            exteriorNumber: a.exteriorNumber,
            interiorNumber: a.interiorNumber,
            colonia: a.colonia,
            municipality: a.municipality,
            state: a.state,
            postalCode: a.postalCode,
            references: a.references,
            isDefault: a.isDefault,
          })),
        },
      }
    },
  })

  fastify.post('/api/v1/user/addresses', {
    preHandler: fastify.authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          recipientName: { type: 'string', minLength: 3, maxLength: 120 },
          phone: { type: 'string', pattern: '^[0-9]{10}$' },
          street: { type: 'string', minLength: 2, maxLength: 160 },
          exteriorNumber: { type: 'string', minLength: 1, maxLength: 20 },
          interiorNumber: { type: ['string', 'null'], maxLength: 20 },
          colonia: { type: 'string', minLength: 2, maxLength: 120 },
          municipality: { type: 'string', minLength: 2, maxLength: 120 },
          state: { type: 'string', minLength: 2, maxLength: 120 },
          postalCode: { type: 'string', pattern: '^[0-9]{5}$' },
          references: { type: ['string', 'null'], maxLength: 300 },
          isDefault: { type: 'boolean' },
        },
        required: [
          'recipientName',
          'phone',
          'street',
          'exteriorNumber',
          'colonia',
          'municipality',
          'state',
          'postalCode',
        ],
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: { success: { type: 'boolean' }, data: addressJsonSchema },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request, reply) => {
      const body = request.body as Record<string, string | boolean | null>

      if (body.isDefault === true) {
        // Only one default address per user.
        await fastify.prisma.address.updateMany({
          where: { userId: request.user.sub, isDefault: true },
          data: { isDefault: false },
        })
      }

      const address = await fastify.prisma.address.create({
        data: {
          userId: request.user.sub,
          recipientName: String(body.recipientName),
          phone: String(body.phone),
          street: String(body.street),
          exteriorNumber: String(body.exteriorNumber),
          interiorNumber: (body.interiorNumber as string) ?? null,
          colonia: String(body.colonia),
          municipality: String(body.municipality),
          state: String(body.state),
          postalCode: String(body.postalCode),
          references: (body.references as string) ?? null,
          isDefault: body.isDefault === true,
        },
      })

      return reply.status(201).send({
        success: true,
        data: {
          id: address.id,
          recipientName: address.recipientName,
          phone: address.phone,
          street: address.street,
          exteriorNumber: address.exteriorNumber,
          interiorNumber: address.interiorNumber,
          colonia: address.colonia,
          municipality: address.municipality,
          state: address.state,
          postalCode: address.postalCode,
          references: address.references,
          isDefault: address.isDefault,
        },
      })
    },
  })

  fastify.delete('/api/v1/user/addresses/:id', {
    preHandler: fastify.authenticate,
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'integer', minimum: 1 } },
        required: ['id'],
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: number }
      const existing = await fastify.prisma.address.findFirst({
        where: { id, userId: request.user.sub },
      })
      if (!existing) throw ApiError.notFound('Dirección no encontrada')
      await fastify.prisma.address.delete({ where: { id } })
      return reply.status(204).send()
    },
  })
}
