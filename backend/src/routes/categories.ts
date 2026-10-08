import type { FastifyInstance } from 'fastify'

export async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/categories', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                categories: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      slug: { type: 'string' },
                      productCount: { type: 'integer' },
                    },
                    required: ['id', 'name', 'slug', 'productCount'],
                  },
                },
              },
              required: ['categories'],
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: async () => {
      const categories = await fastify.prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: { where: { isActive: true } } } },
        },
      })

      return {
        success: true,
        data: {
          categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            productCount: category._count.products,
          })),
        },
      }
    },
  })
}
