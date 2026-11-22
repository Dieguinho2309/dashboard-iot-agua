import { getPool } from '../../db/connection.js'

export async function findNode(nodeId) {
  const { rows } = await getPool().query(
    'SELECT id, name, place, lat, lng FROM nodes WHERE id = $1',
    [nodeId]
  )
  return rows[0] ?? null
}

export async function insertReading({ nodeId, recordedAt, values }) {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')

    const { rows } = await client.query(
      `INSERT INTO readings (node_id, recorded_at, source)
       VALUES ($1, $2, 'esp32')
       RETURNING id, recorded_at, received_at`,
      [nodeId, recordedAt]
    )

    const readingId = rows[0].id
    for (const [key, value] of Object.entries(values)) {
      await client.query(
        'INSERT INTO sensor_values (reading_id, sensor_key, value) VALUES ($1, $2, $3)',
        [readingId, key, value]
      )
    }

    await client.query('COMMIT')
    return rows[0]
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function findLatest(nodeId) {
  const { rows } = await getPool().query(
    `SELECT r.id, r.node_id, r.recorded_at, r.received_at, r.source,
            n.name, n.place, n.lat, n.lng,
            json_object_agg(sv.sensor_key, sv.value) AS values
     FROM readings r
     JOIN nodes n ON n.id = r.node_id
     JOIN sensor_values sv ON sv.reading_id = r.id
     WHERE ($1::text IS NULL OR r.node_id = $1)
     GROUP BY r.id, n.id
     ORDER BY r.recorded_at DESC
     LIMIT 1`,
    [nodeId]
  )
  return rows[0] ?? null
}

export async function findHistory(nodeId, limit, hours) {
  const { rows } = await getPool().query(
    `SELECT r.recorded_at, json_object_agg(sv.sensor_key, sv.value) AS values
     FROM readings r
     JOIN sensor_values sv ON sv.reading_id = r.id
     WHERE ($1::text IS NULL OR r.node_id = $1)
       AND ($3::int IS NULL OR r.recorded_at >= NOW() - ($3::int * INTERVAL '1 hour'))
     GROUP BY r.id
     ORDER BY r.recorded_at DESC
     LIMIT $2`,
    [nodeId, limit, hours]
  )
  return rows.reverse()
}
