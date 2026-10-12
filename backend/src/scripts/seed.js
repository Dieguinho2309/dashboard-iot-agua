/**
 * seed.js - Datos de prueba para validar el esquema PostgreSQL.
 *
 * Requiere el esquema aplicado (npm run db:migrate).
 * Inserta lecturas con source='seed'. Es re-ejecutable: borra las
 * lecturas de prueba anteriores antes de insertar.
 *
 * Uso: npm run seed
 */
import { getPool, closePool } from '../db/connection.js'

const NODE_ID = 'esp32-01'
const SENSORS = ['ph', 'temperature', 'conductivity']
const SAMPLES = [
  { ph: 7.3, temperature: 23.5, conductivity: 480 },
  { ph: 7.1, temperature: 24.1, conductivity: 505 },
  { ph: 7.6, temperature: 22.8, conductivity: 452 },
  { ph: 6.9, temperature: 26.3, conductivity: 611 },
  { ph: 7.4, temperature: 25.0, conductivity: 523 }
]

async function main() {
  const pool = getPool()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query("DELETE FROM readings WHERE source = 'seed'")

    for (let i = 0; i < SAMPLES.length; i++) {
      const sample = SAMPLES[i]
      const recordedAt = new Date(Date.now() - (SAMPLES.length - i) * 3000)

      const { rows } = await client.query(
        `INSERT INTO readings (node_id, recorded_at, source)
         VALUES ($1, $2, 'seed')
         RETURNING id`,
        [NODE_ID, recordedAt]
      )
      const readingId = rows[0].id

      for (const key of SENSORS) {
        await client.query(
          'INSERT INTO sensor_values (reading_id, sensor_key, value) VALUES ($1, $2, $3)',
          [readingId, key, sample[key]]
        )
      }
    }

    await client.query('COMMIT')
    console.log(`[seed] ${SAMPLES.length} lecturas insertadas (source='seed')`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await closePool()
  }
}

main().catch((err) => {
  console.error(`[seed] ERROR: ${err.message}`)
  process.exit(1)
})
