import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env, corsOrigins } from './config/env.js'
import { errorHandler } from './plugins/errors.js'
import prismaPlugin from './plugins/prisma.js'
import { healthRoutes } from './routes/health.js'
import { productRoutes } from './routes/products.js'
import { categoryRoutes } from './routes/categories.js'

/** App factory — separate from the server entry so tests can build isolated instances. */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'test' ? 'warn' : 'info',
    },
  })

  await app.register(helmet)
  await app.register(cors, { origin: corsOrigins })
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'One Baby Shop API',
        description:
          'E-commerce API para el mercado mexicano. Dinero en centavos (Int) siempre. Moneda MXN.',
        version: '0.1.0',
      },
      servers: [{ url: `http://localhost:${env.PORT}`, description: 'development' }],
    },
  })
  await app.register(swaggerUi, { routePrefix: '/docs' })

  await app.register(prismaPlugin)
  await errorHandler(app)

  await app.register(healthRoutes)
  await app.register(productRoutes)
  await app.register(categoryRoutes)

  return app
}
