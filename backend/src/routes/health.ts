import type { FastifyInstance } from 'fastify'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            database: { type: 'string' },
          },
          required: ['status'],
        },
      },
    },
    handler: async () => {
      let database = 'up'
      try {
        await fastify.prisma.$queryRaw`SELECT 1`
      } catch {
        database = 'down'
      }
      return { status: 'ok', timestamp: new Date().toISOString(), database }
    },
  })
}
