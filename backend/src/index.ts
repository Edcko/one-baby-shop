import 'dotenv/config'
import { buildApp } from './app.js'
import { env } from './config/env.js'

const app = await buildApp()

try {
  await app.listen({ port: env.PORT, host: env.HOST })
  console.log(`🚀 One Baby Shop API listening on http://${env.HOST}:${env.PORT}`)
  console.log(`📚 OpenAPI docs at http://localhost:${env.PORT}/docs`)
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
