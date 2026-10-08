import type { FastifyInstance } from 'fastify'
import { ApiError } from '../errors.js'
import { cancelPendingOrder, createOrderFromCart, type MexicanAddress } from '../services/orders.js'

const addressSchema = {
  type: 'object',
  properties: {
    recipientName: { type: 'string', minLength: 3, maxLength: 120 },
    phone: { type: 'string', pattern: '^[0-9]{10}$', maxLength: 10 },
    street: { type: 'string', minLength: 2, maxLength: 160 },
    exteriorNumber: { type: 'string', minLength: 1, maxLength: 20 },
    interiorNumber: { type: ['string', 'null'], maxLength: 20 },
    colonia: { type: 'string', minLength: 2, maxLength: 120 },
    municipality: { type: 'string', minLength: 2, maxLength: 120 },
    state: { type: 'string', minLength: 2, maxLength: 120 },
    postalCode: { type: 'string', pattern: '^[0-9]{5}$' },
    references: { type: ['string', 'null'], maxLength: 300 },
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
}

const orderItemJsonSchema = {
  type: 'object',
  properties: {
    productName: { type: 'string' },
    productSku: { type: ['string', 'null'] },
    quantity: { type: 'integer' },
    unitPriceCents: { type: 'integer' },
    totalPriceCents: { type: 'integer' },
    ivaRate: { type: 'string' },
  },
  required: ['productName', 'quantity', 'unitPriceCents', 'totalPriceCents'],
}

// NOTE: Fastify response schemas are WHITELISTS (fast-json-stringify):
// anything undeclared is stripped from the payload. Declare every field.
const orderJsonSchema = {
  type: 'object',
  properties: {
    orderNumber: { type: 'string' },
    status: {
      type: 'string',
      enum: [
        'PENDING_PAYMENT',
        'PAID',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'EXPIRED',
        'REFUNDED',
      ],
    },
    paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED'] },
    paymentMethod: { type: ['string', 'null'] },
    subtotalCents: { type: 'integer' },
    ivaCents: { type: 'integer' },
    shippingCents: { type: 'integer' },
    discountCents: { type: 'integer' },
    totalCents: { type: 'integer' },
    currency: { type: 'string' },
    expiresAt: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
    shippingAddress: { type: 'object', additionalProperties: true },
    items: { type: 'array', items: orderItemJsonSchema },
  },
  required: ['orderNumber', 'status', 'subtotalCents', 'totalCents', 'items'],
}

const createdOrderResponse = {
  type: 'object',
  properties: { success: { type: 'boolean' }, data: orderJsonSchema },
  required: ['success', 'data'],
}

function serializeOrder(order: {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string | null
  subtotalCents: number
  ivaCents: number
  shippingCents: number
  discountCents: number
  totalCents: number
  currency: string
  expiresAt: Date | null
  createdAt: Date
  shippingAddressSnapshot: unknown
  items: unknown[]
}) {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotalCents: order.subtotalCents,
    ivaCents: order.ivaCents,
    shippingCents: order.shippingCents,
    discountCents: order.discountCents,
    totalCents: order.totalCents,
    currency: order.currency,
    expiresAt: order.expiresAt,
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddressSnapshot,
    items: order.items,
  }
}

export async function orderRoutes(fastify: FastifyInstance) {
  // ── POST /orders — create from cart (reserves stock) ────────────────────
  fastify.post('/api/v1/orders', {
    preHandler: fastify.authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          shippingAddress: addressSchema,
        },
        required: ['shippingAddress'],
        additionalProperties: false,
      },
      response: { 201: createdOrderResponse },
    },
    handler: async (request, reply) => {
      const { shippingAddress } = request.body as { shippingAddress: MexicanAddress }
      const order = await createOrderFromCart(fastify, request.user.sub, shippingAddress)
      return reply.status(201).send({ success: true, data: serializeOrder(order) })
    },
  })

  // ── GET /orders — history ───────────────────────────────────────────────
  fastify.get('/api/v1/orders', {
    preHandler: fastify.authenticate,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                orders: { type: 'array', items: orderJsonSchema },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                  required: ['page', 'limit', 'total', 'totalPages'],
                },
              },
              required: ['orders'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request) => {
      const q = request.query as { page: number; limit: number }
      const where = { userId: request.user.sub }

      const [total, orders] = await Promise.all([
        fastify.prisma.order.count({ where }),
        fastify.prisma.order.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          include: { items: true },
        }),
      ])

      return {
        success: true,
        data: {
          orders: orders.map(serializeOrder),
          pagination: {
            page: q.page,
            limit: q.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / q.limit)),
          },
        },
      }
    },
  })

  // ── GET /orders/:orderNumber — detail (owner only) ──────────────────────
  fastify.get('/api/v1/orders/:orderNumber', {
    preHandler: fastify.authenticate,
    schema: {
      params: {
        type: 'object',
        properties: { orderNumber: { type: 'string', minLength: 4 } },
        required: ['orderNumber'],
      },
    },
    handler: async (request) => {
      const { orderNumber } = request.params as { orderNumber: string }
      const order = await fastify.prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })
      if (!order || order.userId !== request.user.sub)
        throw ApiError.notFound('Pedido no encontrado')
      return { success: true, data: serializeOrder(order) }
    },
  })

  // ── POST /orders/:orderNumber/cancel — release reservation ──────────────
  fastify.post('/api/v1/orders/:orderNumber/cancel', {
    preHandler: fastify.authenticate,
    schema: {
      params: {
        type: 'object',
        properties: { orderNumber: { type: 'string', minLength: 4 } },
        required: ['orderNumber'],
      },
    },
    handler: async (request) => {
      const { orderNumber } = request.params as { orderNumber: string }
      const order = await cancelPendingOrder(fastify, request.user.sub, orderNumber)
      return { success: true, data: serializeOrder(order) }
    },
  })
}
