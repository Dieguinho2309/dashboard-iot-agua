import * as repository from './readings.repository.js'

const SENSOR_KEYS = new Set(['ph', 'temperature', 'conductivity'])

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

export function validateReading(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'Cuerpo invalido')
  }

  const nodeId = body.nodeId ?? body.node_id
  if (typeof nodeId !== 'string' || !nodeId.trim()) {
    throw httpError(400, 'nodeId requerido')
  }

  const rawValues = body.values
  if (!rawValues || typeof rawValues !== 'object' || Array.isArray(rawValues)) {
    throw httpError(400, 'values requerido')
  }

  const values = {}
  for (const [key, raw] of Object.entries(rawValues)) {
    if (!SENSOR_KEYS.has(key)) throw httpError(400, `Sensor no soportado: ${key}`)
    const value = Number(raw)
    if (!Number.isFinite(value)) throw httpError(400, `Valor invalido para ${key}`)
    values[key] = value
  }
  if (Object.keys(values).length === 0) {
    throw httpError(400, 'Sin valores de sensores')
  }

  const recordedAt = body.recordedAt ? new Date(body.recordedAt) : new Date()
  if (Number.isNaN(recordedAt.getTime())) {
    throw httpError(400, 'recordedAt invalido')
  }
  if (recordedAt.getTime() > Date.now() + 5 * 60 * 1000) {
    throw httpError(400, 'recordedAt demasiado en el futuro')
  }

  return { nodeId: nodeId.trim(), recordedAt: recordedAt.toISOString(), values }
}

export async function createReading(body) {
  const data = validateReading(body)

  const node = await repository.findNode(data.nodeId)
  if (!node) throw httpError(404, 'Nodo no encontrado')

  const reading = await repository.insertReading(data)
  return {
    id: reading.id,
    nodeId: data.nodeId,
    recordedAt: reading.recorded_at,
    receivedAt: reading.received_at,
    values: data.values
  }
}

export async function getLatest(nodeId) {
  return repository.findLatest(nodeId)
}

export async function getHistory(nodeId, limit) {
  return repository.findHistory(nodeId, limit)
}
