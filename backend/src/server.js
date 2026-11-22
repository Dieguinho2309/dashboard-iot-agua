import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import { getPool, closePool } from './db/connection.js'
import { readingsRouter } from './modules/readings/readings.routes.js'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', async (_req, res) => {
  try {
    await getPool().query('SELECT 1')
    res.json({ status: 'ok', db: 'ok', now: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'error', db: 'down' })
  }
})

app.use('/api/readings', readingsRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err, _req, res, _next) => {
  if (err.status) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error('[error]', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const server = app.listen(config.port, () => {
  console.log(`[api] escuchando en http://localhost:${config.port}`)
})

function shutdown() {
  server.close(() => {
    closePool().finally(() => process.exit(0))
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
