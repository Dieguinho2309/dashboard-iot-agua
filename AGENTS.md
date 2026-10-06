# AGENTS.md - AquaMagdalena

Dashboard IoT de calidad del agua. ESP32 (pH, temperatura, conductividad) en la Universidad del Magdalena.
Autor: Diego Ovalle - Repo: github.com/Dieguinho2309/dashboard-iot-agua

---

## Como trabajar con este usuario

- Habla y escribe en espa?ol. Responde siempre en espa?ol, incluidos comentarios de codigo, mensajes de commit y documentacion.
- Esta aprendiendo backend y frontend a la vez. Quiere entender el "por que" de cada decision, no solo recibir el arreglo.
- Quiere escribir el codigo el mismo. Dale estructura, nombres de archivo, contrato y pistas.
- Verifica antes de afirmar: npm run lint, npm run build y captura con Chrome headless.
- Cero efecto IA en el diseno: sin glassmorphism, halos, iconos en tarjetas, animaciones de entrada ni hovers sin funcion.

---

## Stack

| Capa | Tecnologia | Version |
|---|---|---|
| UI | React / React DOM | 19.2.8 |
| Build | Vite | 8.2.2 |
| Estilos | Tailwind CSS v4 | 4.3.3 |
| Mapas | Leaflet + react-leaflet | 1.9.4 / 5.0.0 |
| Lint | ESLint | 10.9.0 |
| Runtime | Node | v24.19.0 (npm 11.17.0) |
| BD futura | node:sqlite | nativo, sin dependencias |

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
- Sin backend
- ESP32 sin conectar
- Mapa: Esri Canvas/World_Dark_Gray_Base (CARTO devolvia tiles vacios)
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
Endpoints: POST /api/readings, GET /api/latest, GET /api/history
Fases: 1) sqlite sin HTTP -> 2) capas -> 3) endpoints -> 4) proxy+fetch -> 5) ESP32 HTTPClient -> 6) estados loading/error

Importante: PRAGMA journal_mode = WAL. Separar recorded_at y received_at.

---

## Notas rapidas

- git branch -vv NO dice ramas remotas; usar git ls-remote --heads origin
- glob que solo busca md/jsx/css no ve .svg/.png
- PowerShell 5.1 distorsiona caracteres no-ASCII; evita cadenas con acentos
- Si push rechazado: git fetch origin; comparar con origin/main

---