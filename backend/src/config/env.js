/**
 * env.js - Configuracion centralizada (evita hardcodear valores)
 * Carga automaticamente backend/.env si existe (dotenv).
 */
import 'dotenv/config'

export const config = {
  // HTTP
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // PostgreSQL
  databaseUrl:
    process.env.DATABASE_URL || 'postgres://aqua:aqua@localhost:5432/aqua',

  // Ollama (IA)
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:7b-instruct'
}
