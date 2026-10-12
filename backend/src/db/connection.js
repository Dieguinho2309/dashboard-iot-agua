/**
 * connection.js - Pool de conexiones a PostgreSQL
 *
 * Cambio respecto a la version anterior (node:sqlite):
 *   - Ahora usamos el driver `pg` (node-postgres).
 *   - La cadena de conexion viene de DATABASE_URL (ver .env / config/env.js).
 *   - No se aplica el schema aqui: lo hace el runner de migraciones.
 *
 * Uso:
 *   const pool = getPool()
 *   const { rows } = await pool.query('SELECT NOW()')
 */
import pg from 'pg'
import { config } from '../config/env.js'

const { Pool } = pg

let pool

export function getPool() {
  if (pool) return pool
  pool = new Pool({ connectionString: config.databaseUrl })
  return pool
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}
