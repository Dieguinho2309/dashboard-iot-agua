-- schema.sql - PostgreSQL 16 (modelo normalizado)
--
-- FUENTE EJECUTABLE: src/db/migrations/001_init.sql
--   (lo aplica: npm run db:migrate)
-- Este archivo es la version de referencia legible del esquema.
-- Si cambias el esquema, crea una migracion nueva (002_....sql) y
-- actualiza este archivo para que sigan en sync.
--
-- Modelo:
--   nodes         -> un dispositivo ESP32 (por ahora solo 'esp32-01')
--   sensors       -> catalogo de sensores (clave, unidad, rangos)
--   readings      -> un instante de lectura de un nodo
--   sensor_values -> un valor por sensor en una lectura (EAV normalizado)
--
-- recorded_at = hora que indica el ESP32
-- received_at = hora en que llega al servidor
-- Agregar un sensor nuevo = fila en sensors + fila en sensor_values (sin ALTER TABLE)

-- Nodos (dispositivos ESP32)
CREATE TABLE IF NOT EXISTS nodes (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  place      TEXT,
  lat        DOUBLE PRECISION,
  lng        DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Catalogo de sensores: fuente de verdad de tipo, unidad y rangos
CREATE TABLE IF NOT EXISTS sensors (
  key         TEXT PRIMARY KEY,          -- 'ph' | 'temperature' | 'conductivity'
  title       TEXT NOT NULL,
  unit        TEXT,
  min_value   DOUBLE PRECISION,          -- extremo inferior de la barra
  max_value   DOUBLE PRECISION,          -- extremo superior de la barra
  optimal_min DOUBLE PRECISION,          -- rango recomendado para agua dulce
  optimal_max DOUBLE PRECISION,
  decimals    SMALLINT NOT NULL DEFAULT 2 CHECK (decimals BETWEEN 0 AND 6)
);

-- Lectura (instante)
CREATE TABLE IF NOT EXISTS readings (
  id          BIGSERIAL PRIMARY KEY,
  node_id     TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source      TEXT NOT NULL DEFAULT 'esp32',
  CONSTRAINT chk_readings_tiempos CHECK (recorded_at <= received_at + INTERVAL '5 minutes')
);

-- Valores por sensor (un valor por fila)
CREATE TABLE IF NOT EXISTS sensor_values (
  id         BIGSERIAL PRIMARY KEY,
  reading_id BIGINT NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  sensor_key TEXT NOT NULL REFERENCES sensors(key),
  value      DOUBLE PRECISION NOT NULL,
  CONSTRAINT uq_sensor_values_reading_key UNIQUE (reading_id, sensor_key)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_readings_node_recorded ON readings (node_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sv_reading ON sensor_values (reading_id);
CREATE INDEX IF NOT EXISTS idx_sv_key ON sensor_values (sensor_key);

-- Semilla: un solo nodo (el ESP32 actual) y los 3 sensores.
-- ON CONFLICT DO NOTHING => idempotente, se puede aplicar varias veces.
INSERT INTO nodes (id, name, place, lat, lng)
VALUES ('esp32-01', 'Prototipo Estanque Universitario', 'Universidad del Magdalena', 11.22418, -74.18542)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sensors (key, title, unit, min_value, max_value, optimal_min, optimal_max, decimals) VALUES
  ('ph',           'Nivel de pH',          '',       6.5, 8.5,   7.0, 7.6, 1),
  ('temperature',  'Temperatura del agua', 'C',       18,  30,    22,  27,  1),
  ('conductivity', 'Conductividad',        'uS/cm',   300, 800,   400, 600, 0)
ON CONFLICT (key) DO NOTHING;
