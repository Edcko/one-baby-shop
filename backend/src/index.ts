import 'dotenv/config'
import { buildApp } from './app.js'
import { env } from './config/env.js'

const app = await buildApp()

try {
  await app.listen({ port: env.PORT, host: env.HOST })
  console.log(`🚀 One Baby Shop API listening on http://${env.HOST}:${env.PORT}`)
  console.log(`📚 OpenAPI docs at http://localhost:${env.PORT}/docs`)

  // Expiry sweeper: releases stock from abandoned OXXO/SPEI reservations.
  // Webhooks get lost; this is the safety net.
  const { sweepExpiredOrders } = await import('./services/webhooks.js')
  const runSweep = async () => {
    const expired = await sweepExpiredOrders(app).catch((error) => {
      app.log.error({ error }, 'sweep failed')
      return 0
    })
    if (expired > 0) app.log.info({ expired }, 'expired pending orders swept')
  }
  await runSweep()
  setInterval(runSweep, 15 * 60 * 1000).unref()
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
