# AquaMagdalena — Dashboard IoT de calidad del agua

Panel web para monitorear **pH, temperatura y conductividad eléctrica** de un estanque en la Universidad del Magdalena. Incluye mapa, historial por rangos, alertas por umbrales y una API Express + PostgreSQL preparada para recibir las lecturas del ESP32.

**Demo en vivo:** <https://dashboard-iot-agua.vercel.app> · **Repositorio:** <https://github.com/Dieguinho2309/dashboard-iot-agua>

**Requisitos:** Node 24 / npm 11. PostgreSQL 16 solo si vas a levantar la API.

> **Estado actual:** el ESP32 todavía no está conectado. Por defecto el frontend corre en **modo simulado**: `nextReading()` en `frontend/src/data/sensors.js` genera valores de forma continua con `Math.random()`. La API real existe, pero solo se usa si defines `VITE_API_URL`. La interfaz indica en todo momento si los datos son simulados o reales.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19, React Router 8 |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Mapas | MapLibre GL 6 + OpenFreeMap (sin API key) |
| Fuentes | @fontsource/inter (subset latin, local) |
| Lint | ESLint 10 |
| API | Node 24, Express 5, CORS, dotenv |
| Base de datos | PostgreSQL 16 (entorno Docker previsto; aún sin `compose` en el repo) |
| Driver BD | `pg` 8 |

## Puesta en marcha

### Solo frontend (modo simulado)

```bash
cd frontend
npm install
npm run dev
```

Abre <http://localhost:5173>. No hacen falta variables de entorno ni base de datos.

### Con la API real (opcional)

```bash
cd backend
npm install
copy .env.example .env        # en macOS/Linux: cp .env.example .env
# Ajusta DATABASE_URL y CORS_ORIGIN en backend/.env
npm run db:migrate
npm run seed                  # inserta 5 lecturas de prueba (el nodo ya existe tras la migración)
npm run dev                   # API en http://localhost:3001
```

Luego, en otra terminal:

```bash
cd frontend
# Crea frontend/.env.local con: VITE_API_URL=http://localhost:3001
npm run dev
```

Si `VITE_API_URL` no existe, el frontend sigue en modo simulado. `CORS_ORIGIN` debe coincidir con el origen del frontend.

## Comandos

Desde `frontend/`:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | ESLint |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build ya generado |

Desde `backend/`:

| Comando | Qué hace |
|---|---|
| `npm run dev` | API con recarga automática (`node --watch`) |
| `npm start` | API en modo normal |
| `npm run db:migrate` | Aplica migraciones SQL |
| `npm run seed` | Carga lecturas de prueba (`source='seed'`) |

No hay tests automatizados todavía; se esperan hasta conectar el ESP32. La verificación actual es `lint` + `build` y pruebas manuales de rutas/endpoints.

## Estructura

```text
proyecto-iot/
├── backend/
│   ├── .env.example
│   └── src/
│       ├── config/env.js
│       ├── db/
│       │   ├── migrations/001_init.sql
│       │   ├── connection.js
│       │   ├── migrate.js
│       │   └── schema.sql
│       ├── middleware/errors.js
│       ├── modules/readings/
│       │   ├── readings.routes.js
│       │   ├── readings.service.js
│       │   └── readings.repository.js
│       ├── scripts/seed.js
│       └── server.js
├── frontend/
│   ├── public/robots.txt
│   ├── vercel.json
│   └── src/
│       ├── data/sensors.js
│       ├── lib/{api.js,maplibre.js}
│       ├── Pages/{Landing,Dashboard,Historial,SensorDetalle,Alertas,404}.jsx
│       ├── components/{MapView,Panel,SensorCard,HistoryChart,...}.jsx
│       ├── hooks/{useReadings,useHistory,usePageMeta}.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── AGENTS.md
└── README.md
```

## Rutas de la interfaz

| Ruta | Contenido |
|---|---|
| `/` | Landing del proyecto |
| `/dashboard` | Mapa + tarjetas de los tres sensores |
| `/historial` | Selector `1 h / 24 h / 7 d`; al tocar una tarjeta abre su detalle |
| `/historial/:sensorKey?range=...` | Detalle del sensor: gráfica con crosshair, estadísticas, eventos, últimas lecturas y export CSV |
| `/alertas` | Eventos derivados de los rangos óptimos |
| `*` | Página 404 |

La marca **AquaMagdalena** del sidebar vuelve a `/dashboard`; el icono de casa del header lleva al landing.

## API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado de la API y conexión a PostgreSQL |
| `POST` | `/api/readings` | Guarda una lectura |
| `GET` | `/api/readings/latest?nodeId=esp32-01` | Última lectura |
| `GET` | `/api/readings/history?hours=24&limit=96` | Historial; `hours` opcional (1–168) |

Ejemplo de lectura:

```json
{
  "nodeId": "esp32-01",
  "recordedAt": "2026-11-22T10:30:00Z",
  "values": { "ph": 7.3, "temperature": 24.1, "conductivity": 480 }
}
```

`recordedAt` es opcional (si falta se usa la hora del servidor). El modelo distingue `recorded_at` (hora del ESP32) de `received_at` (hora de recepción).

## Notas de implementación

- **El mapa no necesita API key.** Usa MapLibre GL con teselas de OpenFreeMap y tiene toggle claro/oscuro. Las coordenadas del nodo están en `frontend/src/data/sensors.js`; MapLibre espera `[lng, lat]`.
- **Historial:** el dashboard mantiene una ventana deslizante de 24 lecturas cada 3 s (~72 s). La vista `/historial` pide series de 1 h, 24 h o 7 d al backend (o las simula) y el rango viaja en la URL, así que sobrevive al botón *atrás*.
- **Rangos de referencia:** pH 7.0–7.6, temperatura 22–27 °C, conductividad 400–600 µS/cm. Son valores típicos de agua dulce, no la especificación final de los sensores.
- **UI:** accesible (foco y título por ruta, cierre con Escape, estados de error con reintento) y con code-splitting; MapLibre solo carga en `/dashboard`.
- **Deploy:** Vercel sirve solo el frontend; configurar Root Directory `frontend`, build `npm run build` y output `dist/`. `frontend/vercel.json` reescribe las rutas SPA a `index.html`. El backend/PostgreSQL/Ollama deben desplegarse por separado.

## Pendiente

- Cliente HTTP del ESP32 y definición de pines/firmware.
- Integración de IA (`/api/chat` con Ollama/RAG), aún en diseño.
- Tests automatizados y despliegue del backend/PostgreSQL.

## Autor

Diego Ovalle · Universidad del Magdalena · <https://github.com/Dieguinho2309/dashboard-iot-agua>
