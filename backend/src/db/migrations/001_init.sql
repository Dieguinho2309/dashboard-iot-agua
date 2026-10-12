-- 001_init.sql - Esquema inicial PostgreSQL 16 (modelo normalizado)
-- Se ejecuta una sola vez mediante el runner (src/db/migrate.js).
-- Idempotente: CREATE ... IF NOT EXISTS + INSERT ... ON CONFLICT.

CREATE TABLE IF NOT EXISTS nodes (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  place      TEXT,
  lat        DOUBLE PRECISION,
  lng        DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensors (
  key         TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  unit        TEXT,
  min_value   DOUBLE PRECISION,
  max_value   DOUBLE PRECISION,
  optimal_min DOUBLE PRECISION,
  optimal_max DOUBLE PRECISION,
  decimals    SMALLINT NOT NULL DEFAULT 2 CHECK (decimals BETWEEN 0 AND 6)
);

CREATE TABLE IF NOT EXISTS readings (
  id          BIGSERIAL PRIMARY KEY,
  node_id     TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source      TEXT NOT NULL DEFAULT 'esp32',
  CONSTRAINT chk_readings_tiempos CHECK (recorded_at <= received_at + INTERVAL '5 minutes')
);

CREATE TABLE IF NOT EXISTS sensor_values (
  id         BIGSERIAL PRIMARY KEY,
  reading_id BIGINT NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  sensor_key TEXT NOT NULL REFERENCES sensors(key),
  value      DOUBLE PRECISION NOT NULL,
  CONSTRAINT uq_sensor_values_reading_key UNIQUE (reading_id, sensor_key)
);

CREATE INDEX IF NOT EXISTS idx_readings_node_recorded ON readings (node_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sv_reading ON sensor_values (reading_id);
CREATE INDEX IF NOT EXISTS idx_sv_key ON sensor_values (sensor_key);

INSERT INTO nodes (id, name, place, lat, lng)
VALUES ('esp32-01', 'Prototipo Estanque Universitario', 'Universidad del Magdalena', 11.22418, -74.18542)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sensors (key, title, unit, min_value, max_value, optimal_min, optimal_max, decimals) VALUES
  ('ph',           'Nivel de pH',          '',       6.5, 8.5,   7.0, 7.6, 1),
  ('temperature',  'Temperatura del agua', 'C',       18,  30,    22,  27,  1),
  ('conductivity', 'Conductividad',        'uS/cm',   300, 800,   400, 600, 0)
ON CONFLICT (key) DO NOTHING;
