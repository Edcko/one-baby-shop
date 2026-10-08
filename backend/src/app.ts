import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import cookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env, corsOrigins } from './config/env.js'
import { errorHandler } from './plugins/errors.js'
import prismaPlugin from './plugins/prisma.js'
import authPlugin from './plugins/auth.js'
import { healthRoutes } from './routes/health.js'
import { productRoutes } from './routes/products.js'
import { categoryRoutes } from './routes/categories.js'
import { authRoutes } from './routes/auth.js'
import { cartRoutes } from './routes/cart.js'
import { orderRoutes } from './routes/orders.js'
import { addressRoutes } from './routes/addresses.js'

/** App factory — separate from the server entry so tests can build isolated instances. */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'test' ? 'warn' : 'info',
    },
  })

  await app.register(helmet)
  // Cookies travel cross-origin (5173 → 3001) with credentials.
  // NOTE: default methods are GET/HEAD/POST only — PUT/PATCH/DELETE (cart!)
  // must be declared or the browser preflight rejects them.
  await app.register(cors, {
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
  await app.register(cookie)

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
  await app.register(authPlugin)
  await errorHandler(app)

  await app.register(healthRoutes)
  await app.register(productRoutes)
  await app.register(categoryRoutes)
  await app.register(authRoutes)
  await app.register(cartRoutes)
  await app.register(orderRoutes)
  await app.register(addressRoutes)

  return app
}
