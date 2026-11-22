import { Router } from 'express'
import { createReading, getLatest, getHistory } from './readings.service.js'

export const readingsRouter = Router()

function nodeIdFrom(req) {
  return typeof req.query.nodeId === 'string' ? req.query.nodeId : null
}

readingsRouter.post('/', async (req, res, next) => {
  try {
    const reading = await createReading(req.body)
    res.status(201).json(reading)
  } catch (err) {
    next(err)
  }
})

readingsRouter.get('/latest', async (req, res, next) => {
  try {
    const latest = await getLatest(nodeIdFrom(req))
    if (!latest) {
      res.status(404).json({ error: 'Sin lecturas registradas' })
      return
    }
    res.json(latest)
  } catch (err) {
    next(err)
  }
})

readingsRouter.get('/history', async (req, res, next) => {
  try {
    const requested = Number(req.query.limit)
    const limit = Number.isInteger(requested) && requested > 0 ? Math.min(requested, 200) : 24
    const requestedHours = Number(req.query.hours)
    const hours = Number.isInteger(requestedHours) && requestedHours > 0 ? Math.min(requestedHours, 168) : null
    res.json({ readings: await getHistory(nodeIdFrom(req), limit, hours) })
  } catch (err) {
    next(err)
  }
})
