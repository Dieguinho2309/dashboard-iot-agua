import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { getPool, closePool } from './connection.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(__dirname, 'migrations')

export async function runMigrations() {
  const pool = getPool()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version    TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  const { rows } = await pool.query('SELECT version FROM schema_migrations')
  const applied = new Set(rows.map((r) => r.version))

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const version = file.replace(/\.sql$/, '')
    if (applied.has(version)) continue

    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version])
      await client.query('COMMIT')
      console.log(`[migrate] aplicada ${version}`)
    } catch (err) {
      await client.query('ROLLBACK')
      throw new Error(`Migracion ${version} fallida: ${err.message}`)
    } finally {
      client.release()
    }
  }

  if (files.length === 0) console.log('[migrate] no hay migraciones')
}

// Ejecucion directa: node src/db/migrate.js
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  runMigrations()
    .then(() => closePool())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`[migrate] ERROR: ${err.message}`)
      process.exit(1)
    })
}
