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

No hay tests. Se esperan hasta conectar el ESP32.

---

## Estado

- Lecturas simuladas (Math.random) en frontend/src/data/sensors.js:nextReading()
- Backend: API modular en backend/ (Postgres 16 en Docker)
- ESP32 sin conectar
- Mapa: MapLibre GL (look L3, toggle claro/oscuro) + OpenFreeMap, todo en frontend/src/components/MapView.jsx
- Historial: 24 puntos x 3s = ~72 segundos
- Footer: "Datos simulados - prototipo academico"

---

## Decisiones clave

- Estado de sensor calculado con evaluate(), no prop "status"
- Header sin busqueda, campana, avatar
- Sidebar con un solo item (Panel Principal)
- Footer dentro de main con flex column
- mt-auto funciona porque main es flex flex-1 flex-col

---

## Backend plan

Arquitectura modular 3 capas: routes/service/repository.
Endpoints: POST /api/readings, GET /api/latest, GET /api/history (+ GET /api/health, POST /api/chat)
Fases: 1) Postgres + migraciones -> 2) capas -> 3) endpoints -> 4) proxy+fetch -> 5) ESP32 HTTPClient -> 6) estados loading/error

BD: PostgreSQL 16 en Docker. Modelo normalizado nodes/sensors/readings/sensor_values.
Migraciones en backend/src/db/migrations (runner: npm run db:migrate).
Separar recorded_at (hora ESP32) y received_at (hora servidor).

---

## Notas rapidas

- Paginas en frontend/src/Pages/; worker MapLibre en frontend/src/lib/maplibre.js
- Code-splitting: React.lazy de Dashboard y MapView; maplibre-gl solo carga en /dashboard
- git branch -vv NO dice ramas remotas; usar git ls-remote --heads origin
- glob que solo busca md/jsx/css no ve .svg/.png
- PowerShell 5.1 distorsiona caracteres no-ASCII; evita cadenas con acentos
- Si push rechazado: git fetch origin; comparar con origin/main

---
