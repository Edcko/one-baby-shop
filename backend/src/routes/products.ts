import type { FastifyInstance } from 'fastify'
import type { Prisma, Product } from '../../generated/prisma/client.js'
import { ApiError } from '../errors.js'
import { normalizeSearch } from '../utils/search.js'

const productInclude = {
  category: { select: { slug: true, name: true } },
  images: { orderBy: [{ isPrimary: 'desc' as const }, { sortOrder: 'asc' as const }] },
  _count: { select: { reviews: { where: { isApproved: true } } } },
  reviews: { where: { isApproved: true }, select: { rating: true } },
} satisfies Prisma.ProductInclude

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>

function averageRating(product: ProductWithRelations): number | null {
  const ratings = product.reviews.map((r: { rating: number }) => r.rating)
  if (ratings.length === 0) return null
  return ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
}

/** Serializes a product for the API. Money is ALWAYS in centavos (Int). */
function serializeProduct(
  product: Product & {
    category: { slug: string; name: string } | null
    images?: { imageUrl: string; altText: string | null; isPrimary: boolean }[]
    _count?: { reviews: number }
  },
  rating: number | null
) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    longDescription: product.longDescription,
    priceCents: product.priceCents,
    originalPriceCents: product.originalPriceCents,
    ivaRate: product.ivaRate,
    sku: product.sku,
    brand: product.brand,
    category: product.category
      ? { slug: product.category.slug, name: product.category.name }
      : null,
    // Available = physical stock minus async-payment reservations (OXXO/SPEI)
    available: Math.max(0, product.stockQuantity - product.reservedQuantity),
    stockQuantity: product.stockQuantity,
    isFeatured: product.isFeatured,
    image:
      product.images?.find((img) => img.isPrimary)?.imageUrl ??
      product.images?.[0]?.imageUrl ??
      null,
    rating,
    reviewCount: product._count?.reviews ?? 0,
    createdAt: product.createdAt,
  }
}

const productJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    slug: { type: 'string' },
    description: { type: 'string' },
    longDescription: { type: ['string', 'null'] },
    priceCents: { type: 'integer' },
    originalPriceCents: { type: ['integer', 'null'] },
    ivaRate: { type: 'string', enum: ['ZERO', 'EIGHT', 'SIXTEEN'] },
    sku: { type: 'string' },
    brand: { type: ['string', 'null'] },
    category: {
      type: ['object', 'null'],
      properties: {
        slug: { type: 'string' },
        name: { type: 'string' },
      },
    },
    available: { type: 'integer' },
    stockQuantity: { type: 'integer' },
    isFeatured: { type: 'boolean' },
    image: { type: ['string', 'null'] },
    rating: { type: ['number', 'null'] },
    reviewCount: { type: 'integer' },
    createdAt: { type: 'string' },
  },
  required: ['id', 'name', 'slug', 'priceCents', 'available', 'category'],
}

const productListSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        products: { type: 'array', items: productJsonSchema },
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
      required: ['products', 'pagination'],
    },
  },
  required: ['success', 'data'],
}

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/products', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 12 },
          category: { type: 'string', minLength: 1 },
          search: { type: 'string', minLength: 1 },
          minPriceCents: { type: 'integer', minimum: 0 },
          maxPriceCents: { type: 'integer', minimum: 0 },
          featured: { type: 'boolean' },
          sort: { type: 'string', enum: ['name', 'price', 'createdAt'], default: 'createdAt' },
          order: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        },
      },
      response: { 200: productListSchema },
    },
    handler: async (request) => {
      const q = request.query as {
        page: number
        limit: number
        category?: string
        search?: string
        minPriceCents?: number
        maxPriceCents?: number
        featured?: boolean
        sort: 'name' | 'price' | 'createdAt'
        order: 'asc' | 'desc'
      }

      if (
        q.minPriceCents !== undefined &&
        q.maxPriceCents !== undefined &&
        q.minPriceCents > q.maxPriceCents
      ) {
        throw ApiError.badRequest('minPriceCents no puede ser mayor que maxPriceCents')
      }

      const where = {
        isActive: true,
        ...(q.category ? { category: { slug: q.category } } : {}),
        ...(q.featured !== undefined ? { isFeatured: q.featured } : {}),
        ...(q.search
          ? {
              OR: [
                { name: { contains: q.search, mode: 'insensitive' as const } },
                // Accent-insensitive: "biberon" must match "Biberón"
                { searchText: { contains: normalizeSearch(q.search) } },
              ],
            }
          : {}),
        ...(q.minPriceCents !== undefined || q.maxPriceCents !== undefined
          ? {
              priceCents: {
                ...(q.minPriceCents !== undefined ? { gte: q.minPriceCents } : {}),
                ...(q.maxPriceCents !== undefined ? { lte: q.maxPriceCents } : {}),
              },
            }
          : {}),
      }

      const sortColumn =
        q.sort === 'name'
          ? { name: q.order }
          : q.sort === 'price'
            ? { priceCents: q.order }
            : { createdAt: q.order }

      const [total, products] = await Promise.all([
        fastify.prisma.product.count({ where }),
        fastify.prisma.product.findMany({
          where,
          orderBy: sortColumn,
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          include: productInclude,
        }),
      ])

      // Aggregate rating here (avg of approved reviews) to avoid raw SQL group-by
      const data = products.map((product: ProductWithRelations) =>
        serializeProduct(product, averageRating(product))
      )

      return {
        success: true,
        data: {
          products: data,
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

  fastify.get('/api/v1/products/:idOrSlug', {
    schema: {
      params: {
        type: 'object',
        properties: { idOrSlug: { type: 'string', minLength: 1 } },
        required: ['idOrSlug'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: productJsonSchema,
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async (request) => {
      const { idOrSlug } = request.params as { idOrSlug: string }
      const numericId = Number(idOrSlug)

      const product = await fastify.prisma.product.findFirst({
        where: {
          isActive: true,
          ...(Number.isInteger(numericId) && numericId > 0
            ? { id: numericId }
            : { slug: idOrSlug }),
        },
        include: productInclude,
      })

      if (!product) throw ApiError.notFound('El producto solicitado no existe')

      return {
        success: true,
        data: serializeProduct(product, averageRating(product)),
      }
    },
  })
}
