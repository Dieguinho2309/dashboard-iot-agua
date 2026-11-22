# AGENTS.md - AquaMagdalena

Dashboard IoT de calidad del agua. ESP32 (pH, temperatura, conductividad) en la Universidad del Magdalena.
Autor: Diego Ovalle - Repo: github.com/Dieguinho2309/dashboard-iot-agua

---


## Stack

| Capa | Tecnologia | Version |
|---|---|---|
| UI | React / React DOM | 19.2.8 |
| Build | Vite | 8.2.2 |
| Estilos | Tailwind CSS v4 | 4.3.3 |
| Mapas | MapLibre GL + OpenFreeMap | 6.14.0 |
| Fuentes | @fontsource/inter | 5.x |
| Lint | ESLint | 10.9.0 |
| Runtime | Node | v24.19.0 (npm 11.17.0) |
| BD | PostgreSQL | 16 (Docker) |
| Driver BD | pg (node-postgres) | 8.x |

---

## Comandos

Desde frontend/:
- npm run dev
- npm run lint
- npm run build
- npm run preview

Desde backend/:
- npm install
- npm run db:migrate
- npm run seed
- npm run dev / npm start

No hay tests. Se esperan hasta conectar el ESP32. Verificar con lint + build y smoke manual de rutas/endpoints.

---

## Estado

- Modo simulado por defecto: frontend/src/data/sensors.js:nextReading() (random walk continuo) y buildSeries()
- Backend API Express 5 implementado en backend/ (routes/service/repository + pg). Postgres 16 previsto en Docker; sin compose en el repo
- Frontend usa la API solo si existe VITE_API_URL; si no, modo simulado con fallback
- ESP32 sin conectar; firmware/pines no definidos todavia
- Mapa: MapLibre GL (look L3, toggle claro/oscuro) + OpenFreeMap, todo en frontend/src/components/MapView.jsx
- Dashboard: 24 puntos x 3s = ~72 segundos
- Vistas: /historial con selector 1 h / 24 h / 7 d y detalle por sensor en /historial/:sensorKey?range=... ; /alertas con eventos por rango
- Footer y badge de estado dinamicos: "Datos simulados" o "Datos en vivo"/"Sin conexion"
- IA (/api/chat, Ollama, RAG) diferida: el usuario quiere definirla mejor antes de implementarla

---

## Decisiones clave

- Estado de sensor calculado con evaluate(), no prop "status"
- Header sin busqueda, campana, avatar; icono de casa lleva al landing
- Sidebar con 3 items (Panel Principal, Historial, Alertas); la marca AquaMagdalena vuelve a /dashboard
- Footer dentro de main con flex column
- mt-auto funciona porque main es flex flex-1 flex-col
- El rango del historial se guarda en ?range= para sobrevivir al back
- Panel.jsx unifica el estilo de tarjetas; ErrorBoundary evita que una vista rota tumbe la app

---

## Backend

Arquitectura modular 3 capas: routes/service/repository.
Endpoints: POST /api/readings, GET /api/readings/latest, GET /api/readings/history (+ GET /api/health).
Sin token X-API-Key ni zod: validacion manual en readings.service.js (usuario eligio backend minimo).
Pendiente: HTTPClient del ESP32 y la IA (/api/chat con Ollama/RAG, aun sin definir).

BD: PostgreSQL 16 en Docker. Modelo normalizado nodes/sensors/readings/sensor_values.
Migraciones en backend/src/db/migrations (runner: npm run db:migrate).
Separar recorded_at (hora ESP32) y received_at (hora servidor).

---

## Notas rapidas

- Paginas en frontend/src/Pages/; worker MapLibre en frontend/src/lib/maplibre.js
- Code-splitting: React.lazy de Dashboard, Historial, SensorDetalle, Alertas y MapView; maplibre-gl solo carga en /dashboard
- git branch -vv NO dice ramas remotas; usar git ls-remote --heads origin
- main es la version vigente; feature/mapa queda sin fusionar (diseno alternativo)
- fijar autor con git config user.name "Dieguinho2309" y git config user.email "odiegoandres@gmail.com" (3 commits iniciales dicen "Dieguito:b", mismo email; no reescribir historial publico)
- glob que solo busca md/jsx/css no ve .svg/.png
- PowerShell 5.1 distorsiona caracteres no-ASCII; evita cadenas con acentos
- Si push rechazado: git fetch origin; comparar con origin/main

---
