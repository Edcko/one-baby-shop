import type { FastifyInstance } from 'fastify'
import type { Prisma } from '../../generated/prisma/client.js'
import { ApiError } from '../errors.js'

/**
 * Server-side cart for authenticated users.
 * Guests keep a localStorage cart; on login the client POSTs /cart/merge
 * once and replaces its state with the server response.
 */

const cartInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      stockQuantity: true,
      reservedQuantity: true,
      isActive: true,
      images: { orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }] },
    },
  },
} satisfies Prisma.CartItemInclude

type CartLine = Prisma.CartItemGetPayload<{ include: typeof cartInclude }>

function serializeCart(items: CartLine[]) {
  return items.map((line) => ({
    productId: line.productId,
    name: line.product.name,
    slug: line.product.slug,
    priceCents: line.product.priceCents,
    image:
      line.product.images.find((img) => img.isPrimary)?.imageUrl ??
      line.product.images[0]?.imageUrl ??
      null,
    quantity: line.quantity,
    // available for THIS line = stock - reserved (global reservations)
    available: Math.max(0, line.product.stockQuantity - line.product.reservedQuantity),
  }))
}

const cartResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'integer' },
              name: { type: 'string' },
              slug: { type: 'string' },
              priceCents: { type: 'integer' },
              image: { type: ['string', 'null'] },
              quantity: { type: 'integer' },
              available: { type: 'integer' },
            },
            required: ['productId', 'name', 'priceCents', 'quantity', 'available'],
          },
        },
      },
      required: ['items'],
    },
  },
  required: ['success', 'data'],
}

async function readCart(fastify: FastifyInstance, userId: number) {
  const items = await fastify.prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: cartInclude,
  })
  return { success: true, data: { items: serializeCart(items) } }
}

/** Loads an active product or throws 404. */
async function loadActiveProduct(fastify: FastifyInstance, productId: number) {
  const product = await fastify.prisma.product.findFirst({
    where: { id: productId, isActive: true },
  })
  if (!product) throw ApiError.notFound('El producto solicitado no existe')
  return product
}

export async function cartRoutes(fastify: FastifyInstance) {
  // ── GET /cart ───────────────────────────────────────────────────────────
  fastify.get('/api/v1/cart', {
    preHandler: fastify.authenticate,
    schema: { response: { 200: cartResponseSchema } },
    handler: async (request) => readCart(fastify, request.user.sub),
  })

  // ── PUT /cart/items — set absolute quantity (0 removes) ─────────────────
  fastify.put('/api/v1/cart/items', {
    preHandler: fastify.authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          productId: { type: 'integer', minimum: 1 },
          quantity: { type: 'integer', minimum: 0, maximum: 99 },
        },
        required: ['productId', 'quantity'],
        additionalProperties: false,
      },
      response: { 200: cartResponseSchema },
    },
    handler: async (request) => {
      const { productId, quantity } = request.body as { productId: number; quantity: number }
      const userId = request.user.sub

      const product = await loadActiveProduct(fastify, productId)
      const available = product.stockQuantity - product.reservedQuantity

      if (quantity === 0) {
        await fastify.prisma.cartItem.deleteMany({ where: { userId, productId } })
        return readCart(fastify, userId)
      }

      if (quantity > available) {
        throw ApiError.conflict(`Solo hay ${Math.max(0, available)} unidades disponibles`)
      }

      await fastify.prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId } },
        update: { quantity },
        create: { userId, productId, quantity },
      })

      return readCart(fastify, userId)
    },
  })

  // ── POST /cart/merge — fold the guest cart into the user cart ───────────
  fastify.post('/api/v1/cart/merge', {
    preHandler: fastify.authenticate,
    schema: {
      body: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            maxItems: 50,
            items: {
              type: 'object',
              properties: {
                productId: { type: 'integer', minimum: 1 },
                quantity: { type: 'integer', minimum: 1, maximum: 99 },
              },
              required: ['productId', 'quantity'],
              additionalProperties: false,
            },
          },
        },
        required: ['items'],
        additionalProperties: false,
      },
      response: { 200: cartResponseSchema },
    },
    handler: async (request) => {
      const { items } = request.body as { items: { productId: number; quantity: number }[] }
      const userId = request.user.sub

      if (items.length > 0) {
        // Lock the involved cart rows + validate in one transaction: the
        // merged quantity caps at availability (never blocks login on a
        // stale guest cart entry).
        await fastify.prisma.$transaction(async (tx) => {
          for (const item of items) {
            const product = await tx.product.findFirst({
              where: { id: item.productId, isActive: true },
            })
            if (!product) continue // product vanished — drop the guest line

            const existing = await tx.cartItem.findUnique({
              where: { userId_productId: { userId, productId: item.productId } },
            })
            const desired = (existing?.quantity ?? 0) + item.quantity
            const available = Math.max(0, product.stockQuantity - product.reservedQuantity)
            const quantity = Math.min(desired, available, 99)

            if (quantity <= 0) continue

            await tx.cartItem.upsert({
              where: { userId_productId: { userId, productId: item.productId } },
              update: { quantity },
              create: { userId, productId: item.productId, quantity },
            })
          }
        })
      }

      return readCart(fastify, userId)
    },
  })

  // ── DELETE /cart — clear ────────────────────────────────────────────────
  fastify.delete('/api/v1/cart', {
    preHandler: fastify.authenticate,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: { success: { type: 'boolean' } },
          required: ['success'],
        },
      },
    },
    handler: async (request) => {
      await fastify.prisma.cartItem.deleteMany({ where: { userId: request.user.sub } })
      return { success: true }
    },
  })
}
