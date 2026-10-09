import type { FastifyInstance } from 'fastify'
import { ApiError } from '../errors.js'
import type { Prisma } from '../../generated/prisma/client.js'

/** Accent-free slug from a Spanish name. */
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)
}

const productAdminSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    slug: { type: 'string' },
    priceCents: { type: 'integer' },
    stockQuantity: { type: 'integer' },
    reservedQuantity: { type: 'integer' },
    available: { type: 'integer' },
    sku: { type: 'string' },
    ivaRate: { type: 'string' },
    isActive: { type: 'boolean' },
    isFeatured: { type: 'boolean' },
    categoryId: { type: 'integer' },
    categoryName: { type: 'string' },
    image: { type: ['string', 'null'] },
    createdAt: { type: 'string' },
  },
  required: ['id', 'name', 'priceCents', 'available', 'isActive'],
}

const productBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    longDescription: { type: ['string', 'null'], maxLength: 5000 },
    priceCents: { type: 'integer', minimum: 100 },
    originalPriceCents: { type: ['integer', 'null'], minimum: 100 },
    categorySlug: { type: 'string', minLength: 1 },
    sku: { type: 'string', minLength: 2, maxLength: 40 },
    brand: { type: ['string', 'null'], maxLength: 100 },
    stockQuantity: { type: 'integer', minimum: 0, maximum: 100000 },
    ivaRate: { type: 'string', enum: ['ZERO', 'EIGHT', 'SIXTEEN'] },
    isActive: { type: 'boolean' },
    isFeatured: { type: 'boolean' },
    imageUrl: { type: ['string', 'null'], maxLength: 500 },
    searchText: { type: 'string' },
  },
  required: ['name', 'description', 'priceCents', 'categorySlug', 'sku'],
  additionalProperties: false,
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

async function serializeAdminProduct(
  fastify: FastifyInstance,
  product: Prisma.ProductGetPayload<{ include: { category: true; images: true } }>
) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceCents: product.priceCents,
    originalPriceCents: product.originalPriceCents,
    stockQuantity: product.stockQuantity,
    reservedQuantity: product.reservedQuantity,
    available: Math.max(0, product.stockQuantity - product.reservedQuantity),
    sku: product.sku,
    ivaRate: product.ivaRate,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    image:
      product.images.find((img) => img.isPrimary)?.imageUrl ?? product.images[0]?.imageUrl ?? null,
    createdAt: product.createdAt,
  }
}

export async function adminRoutes(fastify: FastifyInstance) {
  // ── Dashboard: real aggregates ──────────────────────────────────────────
  fastify.get('/api/v1/admin/dashboard', {
    preHandler: fastify.authenticateAdmin,
    handler: async () => {
      const [products, activeProducts, pendingOrders, paidOrders, users, lowStock, recentOrders] =
        await Promise.all([
          fastify.prisma.product.count(),
          fastify.prisma.product.count({ where: { isActive: true } }),
          fastify.prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
          fastify.prisma.order.findMany({
            where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
            select: { totalCents: true, createdAt: true },
          }),
          fastify.prisma.user.count(),
          fastify.prisma.product.findMany({
            where: { isActive: true, stockQuantity: { lte: 5 } },
            orderBy: { stockQuantity: 'asc' },
            take: 5,
            select: { id: true, name: true, stockQuantity: true, reservedQuantity: true },
          }),
          fastify.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { items: { select: { productName: true } } },
          }),
        ])

      const revenueCents = paidOrders.reduce((sum, order) => sum + order.totalCents, 0)

      return {
        success: true,
        data: {
          products: { total: products, active: activeProducts },
          orders: { pendingPayment: pendingOrders, paidTotal: paidOrders.length },
          users: { total: users },
          revenueCents,
          lowStock: lowStock.map((p) => ({
            ...p,
            available: Math.max(0, p.stockQuantity - p.reservedQuantity),
          })),
          recentOrders: recentOrders.map((order) => ({
            orderNumber: order.orderNumber,
            status: order.status,
            totalCents: order.totalCents,
            createdAt: order.createdAt,
            itemCount: order.items.length,
          })),
        },
      }
    },
  })

  // ── Products: full CRUD (soft delete) ───────────────────────────────────
  fastify.get('/api/v1/admin/products', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          search: { type: 'string' },
          includeInactive: { type: 'boolean', default: true },
        },
      },
    },
    handler: async (request) => {
      const q = request.query as {
        page: number
        limit: number
        search?: string
        includeInactive: boolean
      }
      const where = {
        ...(q.includeInactive ? {} : { isActive: true }),
        ...(q.search
          ? {
              OR: [
                { name: { contains: q.search, mode: 'insensitive' as const } },
                { sku: { contains: q.search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      }

      const [total, products] = await Promise.all([
        fastify.prisma.product.count({ where }),
        fastify.prisma.product.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          include: { category: true, images: true },
        }),
      ])

      return {
        success: true,
        data: {
          products: await Promise.all(products.map((p) => serializeAdminProduct(fastify, p))),
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

  fastify.post('/api/v1/admin/products', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      body: productBodySchema,
      response: {
        201: {
          type: 'object',
          properties: { success: { type: 'boolean' }, data: productAdminSchema },
          required: ['success'],
        },
      },
    },
    handler: async (request, reply) => {
      const body = request.body as Record<string, unknown> & {
        name: string
        categorySlug: string
        sku: string
      }
      const category = await fastify.prisma.category.findUnique({
        where: { slug: body.categorySlug },
      })
      if (!category)
        throw ApiError.badRequest('Categoría no encontrada', { categorySlug: 'No existe' })

      const slug = slugify(body.name)
      const clash = await fastify.prisma.product.findUnique({ where: { slug } })
      if (clash) throw ApiError.conflict('Ya existe un producto con ese nombre (slug duplicado)')

      const skuClash = await fastify.prisma.product.findUnique({ where: { sku: body.sku } })
      if (skuClash) throw ApiError.conflict('Ya existe un producto con ese SKU')

      const product = await fastify.prisma.product.create({
        data: {
          name: body.name,
          slug,
          description: String(body.description),
          longDescription: (body.longDescription as string) ?? null,
          priceCents: body.priceCents as number,
          originalPriceCents: (body.originalPriceCents as number) ?? null,
          categoryId: category.id,
          sku: body.sku,
          brand: (body.brand as string) ?? null,
          stockQuantity: (body.stockQuantity as number) ?? 0,
          ivaRate: (body.ivaRate as 'ZERO' | 'EIGHT' | 'SIXTEEN') ?? 'SIXTEEN',
          isActive: (body.isActive as boolean) ?? true,
          isFeatured: (body.isFeatured as boolean) ?? false,
          searchText: normalizeText(`${body.name} ${body.description}`),
          ...(body.imageUrl
            ? {
                images: {
                  create: {
                    imageUrl: String(body.imageUrl),
                    altText: String(body.name),
                    isPrimary: true,
                  },
                },
              }
            : {}),
        },
        include: { category: true, images: true },
      })

      return reply
        .status(201)
        .send({ success: true, data: await serializeAdminProduct(fastify, product) })
    },
  })

  fastify.put('/api/v1/admin/products/:id', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'integer', minimum: 1 } },
        required: ['id'],
      },
      body: { ...productBodySchema, required: [] },
    },
    handler: async (request) => {
      const { id } = request.params as { id: number }
      const body = request.body as Record<string, unknown>

      const existing = await fastify.prisma.product.findUnique({ where: { id } })
      if (!existing) throw ApiError.notFound('Producto no encontrado')

      let categoryId = existing.categoryId
      if (body.categorySlug) {
        const category = await fastify.prisma.category.findUnique({
          where: { slug: String(body.categorySlug) },
        })
        if (!category) throw ApiError.badRequest('Categoría no encontrada')
        categoryId = category.id
      }

      const product = await fastify.prisma.product.update({
        where: { id },
        data: {
          ...(body.name !== undefined ? { name: String(body.name) } : {}),
          ...(body.description !== undefined ? { description: String(body.description) } : {}),
          ...(body.longDescription !== undefined
            ? { longDescription: body.longDescription as string }
            : {}),
          ...(body.priceCents !== undefined ? { priceCents: body.priceCents as number } : {}),
          ...(body.originalPriceCents !== undefined
            ? { originalPriceCents: body.originalPriceCents as number }
            : {}),
          ...(body.categorySlug ? { category: { connect: { id: categoryId } } } : {}),
          ...(body.sku !== undefined ? { sku: String(body.sku) } : {}),
          ...(body.brand !== undefined ? { brand: body.brand as string } : {}),
          ...(body.stockQuantity !== undefined
            ? { stockQuantity: body.stockQuantity as number }
            : {}),
          ...(body.ivaRate !== undefined
            ? { ivaRate: body.ivaRate as 'ZERO' | 'EIGHT' | 'SIXTEEN' }
            : {}),
          ...(body.isActive !== undefined ? { isActive: body.isActive as boolean } : {}),
          ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured as boolean } : {}),
          ...(body.name !== undefined || body.description !== undefined
            ? {
                searchText: normalizeText(
                  `${body.name ?? existing.name} ${body.description ?? existing.description}`
                ),
              }
            : {}),
          ...(body.imageUrl !== undefined
            ? {
                images: {
                  deleteMany: { isPrimary: true },
                  ...(body.imageUrl
                    ? {
                        create: {
                          imageUrl: String(body.imageUrl),
                          altText: String(body.name ?? existing.name),
                          isPrimary: true,
                        },
                      }
                    : {}),
                },
              }
            : {}),
        },
        include: { category: true, images: true },
      })

      return { success: true, data: await serializeAdminProduct(fastify, product) }
    },
  })

  // Soft delete: order history references products — never hard delete.
  fastify.delete('/api/v1/admin/products/:id', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'integer', minimum: 1 } },
        required: ['id'],
      },
    },
    handler: async (request) => {
      const { id } = request.params as { id: number }
      const existing = await fastify.prisma.product.findUnique({ where: { id } })
      if (!existing) throw ApiError.notFound('Producto no encontrado')
      await fastify.prisma.product.update({
        where: { id },
        data: { isActive: false, isFeatured: false },
      })
      return { success: true }
    },
  })

  // ── Orders: list + status transitions ───────────────────────────────────
  fastify.get('/api/v1/admin/orders', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          status: { type: 'string' },
        },
      },
    },
    handler: async (request) => {
      const q = request.query as { page: number; limit: number; status?: string }
      const where = q.status ? { status: q.status as never } : {}

      const [total, orders] = await Promise.all([
        fastify.prisma.order.count({ where }),
        fastify.prisma.order.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          include: {
            items: true,
            user: { select: { email: true, firstName: true, lastName: true } },
          },
        }),
      ])

      return {
        success: true,
        data: {
          orders: orders.map((order) => ({
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            totalCents: order.totalCents,
            currency: order.currency,
            createdAt: order.createdAt,
            customer: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Invitado',
            customerEmail: order.user?.email ?? order.guestEmail,
            itemCount: order.items.length,
            trackingNumber: order.trackingNumber,
          })),
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

  // Legal order state machine for fulfillment (payments only move via webhooks)
  const FULFILLMENT_TRANSITIONS: Record<string, string[]> = {
    PAID: ['PROCESSING'],
    PROCESSING: ['SHIPPED', 'PAID'], // PAID = rollback if needed
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
  }

  fastify.put('/api/v1/admin/orders/:orderNumber/status', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      params: {
        type: 'object',
        properties: { orderNumber: { type: 'string', minLength: 4 } },
        required: ['orderNumber'],
      },
      body: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
          },
          trackingNumber: { type: 'string', maxLength: 100 },
        },
        required: ['status'],
        additionalProperties: false,
      },
    },
    handler: async (request) => {
      const { orderNumber } = request.params as { orderNumber: string }
      const { status, trackingNumber } = request.body as { status: string; trackingNumber?: string }

      const order = await fastify.prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })
      if (!order) throw ApiError.notFound('Pedido no encontrado')

      const allowed = FULFILLMENT_TRANSITIONS[order.status] ?? []
      if (!allowed.includes(status)) {
        throw ApiError.conflict(
          `Transición inválida: ${order.status} → ${status}. Permitidas: ${
            allowed.join(', ') || 'ninguna'
          } (pagos solo via webhook de Mercado Pago)`
        )
      }

      // Cancelling a PAID order must return the sold stock.
      if (status === 'CANCELLED') {
        await fastify.prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            if (item.productId === null) continue
            await tx.$executeRaw`
              UPDATE "Product"
              SET "stockQuantity" = "stockQuantity" + ${item.quantity},
                  "reservedQuantity" = GREATEST("reservedQuantity" - ${item.quantity}, 0)
              WHERE "id" = ${item.productId}
            `
          }
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED', paymentStatus: 'REFUNDED' },
          })
        })
        return { success: true }
      }

      const updated = await fastify.prisma.order.update({
        where: { id: order.id },
        data: {
          status: status as never,
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        },
      })

      return { success: true, data: { orderNumber: updated.orderNumber, status: updated.status } }
    },
  })

  // ── Users ───────────────────────────────────────────────────────────────
  fastify.get('/api/v1/admin/users', {
    preHandler: fastify.authenticateAdmin,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
      },
    },
    handler: async (request) => {
      const q = request.query as { page: number; limit: number }
      const [total, users] = await Promise.all([
        fastify.prisma.user.count(),
        fastify.prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            emailVerified: true,
            createdAt: true,
            _count: { select: { orders: true } },
          },
        }),
      ])

      return {
        success: true,
        data: {
          users: users.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            orderCount: user._count.orders,
            createdAt: user.createdAt,
          })),
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
}
