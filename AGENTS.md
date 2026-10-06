# AGENTS.md — AquaMagdalena

Dashboard IoT de calidad del agua. ESP32 (pH, temperatura, conductividad) en la Universidad del Magdalena.
Autor: Diego Ovalle · Repo: `github.com/Dieguinho2309/dashboard-iot-agua`

---

## Cómo trabajar con este usuario

- **Habla y escribe en español.** Responde siempre en español, incluidos comentarios de código, mensajes de commit y documentación.
- **Está aprendiendo backend y frontend a la vez.** Quiere entender el *porqué* de cada decisión, no solo recibir el arreglo. Cuando algo falle, explica la causa antes de aplicar el parche.
- **Quiere escribir el código él mismo.** Dale la estructura de carpetas, los nombres de archivo, el contrato de datos y pistas. No le entregues el archivo completo a la primera; si se traba, desbloquea.
- **Quiere volverse independiente.** No lo tomes de la mano: prefiere entender el criterio a que le resuelvas todo.
- **Cero "efecto IA" en el diseño.** Nada de glassmorphism, halos decorativos, iconos dentro de las tarjetas, animaciones de entrada ni hovers sin función. Si agregas algo puramente decorativo, probably sobra.
- **Verifica antes de afirmar.** No digas "funciona" sin ejecutarlo. En este proyecto eso significa: `npm run lint`, `npm run build`, y una captura con Chrome headless.
- **Pregunta antes de sobre-ingenierizar.** Este es un prototipo académico de 3 sensores. Docker, microservicios, CQRS, autenticación y MQTT son premature.

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| UI | React / React DOM | 19.2.8 |
| Build | Vite | 8.2.2 |
| Estilos | Tailwind CSS (v4, sin `tailwind.config.js`) | 4.3.3 |
| Mapas | Leaflet + react-leaflet | 1.9.4 / 5.0.0 |
| Lint | ESLint | 10.9.0 |
| Runtime | Node | v24.19.0 (npm 11.17.0) |
| Base de datos (futura) | `node:sqlite` — módulo nativo, **cero dependencias npm** | — |

---

## Comandos

Todos desde `frontend/`:

```bash
npm run dev       # servidor de desarrollo
npm run lint      # ESLint
npm run build     # build de producción → dist/
npm run preview   # sirve el build
```

**No hay framework de tests.** Decisión del usuario: se esperan hasta conectar el ESP32. No añadas uno sin que lo pida.

---

## Estructura

```
proyecto-iot/
├── AGENTS.md                  ← este archivo
├── README.md                  ← documentación del proyecto
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    ├── public/                favicon.svg, icons.svg
    └── src/
        ├── main.jsx           punto de entrada, StrictMode
        ├── index.css          tema oscuro + overrides de Leaflet
        ├── App.jsx            layout: Sidebar + Header + mapa + cards + Footer
        ├── components/
        │   ├── Sidebar.jsx    fijo en escritorio, drawer en móvil
        │   ├── Header.jsx     h-16, sticky, borde inferior, reloj
        │   ├── Footer.jsx
        │   ├── MapView.jsx    Leaflet + teselas Esri
        │   ├── SensorCard.jsx valor, delta, sparkline, rango óptimo
        │   ├── Sparkline.jsx  gráfica SVG del historial
        │   └── Icons.jsx      iconos SVG en línea
        └── data/
            └── sensors.js     node, sensorConfig, simulation, nextReading, evaluate
```

Ramas:
- **`main`** — versión vigente.
- **`feature/mapa`** — diseño alternativo anterior (glassmorphism, KPI, AlertList). **Archivado, no fusionar.** Tiene 23 iconos y componentes que `main` no usa; consúltalo con `git show feature/mapa:<ruta>` solo como referencia.

---

## Estado actual

**Las lecturas son simuladas.** `nextReading()` en `frontend/src/data/sensors.js` devuelve `start + (Math.random() - 0.5) * spread`.

- **No hay backend.** El frontend no hace ninguna petición de red.
- **El ESP32 no está conectado.** Toda la cadena de hardware está sin probar.
- `node.uptime` (`"12 d 04 h"`) y `node.firmware` (`"v1.4.2"`) son **valores inventados**; hay que reemplazarlos con los reales.
- `node.lat` / `node.lng` están fijos en la sede de Unimag (11.22418, -74.18542).
- El polling vive en el `useEffect` raíz de `App.jsx`: cada 3 s (`simulation.intervalMs`) genera lecturas nuevas y desliza la ventana de historial.
- El historial dura **~72 segundos**: 24 puntos (`simulation.historyPoints`) × 3 s.

---

## Decisiones tomadas — no revertir sin motivo

**Mapa: Esri, no CARTO.** `Canvas/World_Dark_Gray_Base`. CARTO se probó y devolvía teselas idénticas de 2513 bytes con marca de agua. Esri es oscuro, real y **no requiere API key**. No vuelvas a intentar CARTO.

**Sin iconos en las tarjetas, sin halos, sin animaciones de entrada, sin hovers decorativos.** Petición explícita del usuario. El color por sensor sí es funcional y se mantiene. El `Sparkline`, la flecha de delta y la barra de rango óptimo también se mantienen.

**Header recortado:** conserva hamburguesa (móvil), título, subtítulo, pills "Sistema activo" y "Seguro", y reloj en vivo. **Sin** búsqueda, **sin** campana, **sin** avatar, y sin el prop `alertCount`. Decisión del usuario: eliminar controles que no hacen nada.

**Sidebar con un solo item:** "Panel Principal". Los otros cuatro eran enlaces `href="#"` muertos. El `<nav>` y el label "Navegación" están listos para crecer.

**El estado del sensor no se pasa como prop.** `SensorCard` calcula `ok`/`alert` llamando a `evaluate()` en `data/sensors.js`. No reintroduzcas un prop `status`.

**Tokens de color:** `bg-[#0b101e]` (fondo), `bg-[#0a0f1c]` (sidebar), `border-slate-800` (bordes). Son valores arbitrados a propósito: la versión anterior usaba `bg-hull`/`bg-abyss` del `@theme` y **esos tokens ya no existen**. No los uses.

**El footer lleva "Datos simulados" en la propia interfaz**, igual que el README. Es la señal de honestidad más difícil de ignorar para quien abra el proyecto.

---

## Deuda conocida

Ordenada por lo que bloquea la próxima feature. **No arregles esto todavía** hasta que exista el backend: los tres primeros puntos se reescriben solos cuando haya datos reales.

| # | Problema | Dónde | Nota |
|---|---|---|---|
| 1 | **El historial no guarda timestamps.** Es `number[]`, no `{ t, value }[]`. El eje X es "la lectura número i-23", no tiempo. Con muestreo irregular **miente sobre el tiempo sin avisar** | `App.jsx` (`setHistory`) | El más importante. Al conectar el ESP32, pasar a pedir historial al servidor |
| 2 | El polling vive en el componente raíz | `App.jsx` | Se reescribe cuando `nextReading()` sea un `fetch` |
| 3 | `sensorConfig` mezcla tres cosas: UI (`title`/`color`/`decimals`), dominio (`min`/`max`/`optimal`) y simulación (`start`/`spread`). **`start` y `spread` son solo del simulador** | `data/sensors.js` | Al conectar el equipo, `spread` viajaría como si fuera metadata del sensor |
| 4 | `position` se calcula a nivel de módulo, así que el marcador **no puede moverse** aunque cambien las coordenadas | `MapView.jsx` | Pasar a prop o estado |
| 5 | No hay estados `loading` / `ok` / `error`. Ahora `nextReading()` no puede fallar, así que nada lo contempla | todo | Necesario cuando haya red |
| 6 | Sin error boundary: un error de render deja la app en blanco | `main.jsx` | |
| 7 | Sin guarda de request en vuelo: si el ESP32 publica más rápido que 3 s, se pierden lecturas | `App.jsx` | |
| 8 | El drawer no cierra con `Escape` ni maneja foco. El `Sparkline` no tiene etiqueta accesible | `Sidebar.jsx`, `Sparkline.jsx` | |
| 9 | Sin tests | — | El usuario decidió esperar al ESP32 |

---

## Backend: arquitectura decidida y plan por fases

**Stack:** Node + Express + SQLite. **Transporte:** HTTP POST (no MQTT). Un solo lenguaje con el frontend; la DB es un archivo, sin servidor que instalar.

**Arquitectura: monolith modular, 3 capas por módulo.** Organiza por *funcionalidad*, no por capa técnica:

```
backend/src/
├── server.js                    # solo conecta y escucha. Nunca crece.
├── config/env.js                # lee process.env una vez y lo valida
├── db/
│   ├── schema.sql               # solo SQL, legible sin ruido de JS
│   └── connection.js            # abre la BD y aplica el esquema
├── middleware/errors.js         # UN lugar que formatea todos los errores
└── modules/readings/
    ├── readings.routes.js       # HTTP: parsear, validar forma, responder
    ├── readings.service.js      # reglas de negocio
    └── readings.repository.js   # SQL. Solo SQL.
```

**Regla que sostiene todo:** cada capa solo habla con la de abajo. La ruta no sabe SQL, el servicio no sabe que existe HTTP, el repositorio no sabe qué es Express. Por eso cambiar de SQLite a Postgres toca **un solo archivo**.

**Flujo de una petición:** ESP32 → `routes` (valida la forma del JSON) → `service` (reglas: ¿el pH está en 7.0–7.6?) → `repository` (`INSERT`) → SQLite. La respuesta sube por el mismo camino.

**Por qué no hexagonal ni CQRS:** agregan indirección que resuelve problemas que este proyecto **todavía no tiene** (auditoría, concurrencia, múltiples adaptadores). Con 3 sensores y un solo API REST, leerás más abstracción que lógica.

**Endpoints previstos:** `POST /api/readings` (el ESP32 publica) · `GET /api/latest` · `GET /api/history`.

**Fases, cada una verificable de forma independiente:**

| Fase | Qué | Cómo se verifica |
|---|---|---|
| 1 | SQLite con `node:sqlite`, **sin HTTP** | `node src/scripts/seed.js` |
| 2 | Las 3 capas | `curl` contra `/api/readings` |
| 3 | `GET /api/latest` y `/api/history` | `curl` |
| 4 | Proxy de Vite + `fetch` en vez de `Math.random()` | navegador con datos reales |
| 5 | El ESP32 manda con `HTTPClient` | la lectura aparece sola |
| 6 | Estados `loading` / `error` / sin conexión | desconectar el WiFi |

`node:sqlite` **ya fue verificado** en Node v24.19.0: funciona sin flag y sin dependencias. La Fase 1 no necesita `npm install` de nada.

En la Fase 1 el usuario escribe `schema.sql` (SQL puro, es donde sabe mejor); el asistente pone el resto del andamiaje.

---

## Trampas ya pisadas

**Git**
- `git branch -vv` muestra el *tracking configurado*, **no** qué ramas existen en el remoto. Una rama puede estar en GitHub sin tracking local. Para eso, `git ls-remote --heads origin`.
- Editar un archivo desde la web de GitHub crea un commit que tu máquina no tiene → el siguiente push se rechaza con `fetch first`. **Fusiona, nunca fuerces**: `git merge origin/main` y luego push.
- Diagnóstico de divergencia: `git log origin/main..main` (lo que tienes tú) y `git log main..origin/main` (lo que está allá).

**Auditoría de archivos**
- Un glob `*.{js,jsx,css,html,json,md}` **no encuentra `.svg` ni `.png`**. Ya se dejaron 3 assets muertos de plantilla sin ver por eso. Cuando audites, lista el árbol de git (`git ls-tree -r --name-only HEAD`), no confíes en globs.

**Tailwind**
- `mt-auto` **solo empuja dentro de un padre flex vertical**. Poner el `Footer` dentro de un `main` que no sea `flex flex-col` deja el footer pegado bajo las cards en vez de al fondo de la pantalla.

**Sparkline**
- El eje Y se autoescala al `min`/`max` de la ventana, no al rango del sensor. Es deliberado (el pH apenas varía y si no, la línea se ve recta), pero implica que **no se pueden leer valores absolutos del gráfico**.
- `preserveAspectRatio="none"` estira el gráfico al ancho de la tarjeta y **deforma el grosor del trazo**. Visible si la card se vuelve muy ancha.
- La guarda `span || 1` evita `NaN` cuando el sensor está plano. No la quites.

**Backend**
- **Sin `PRAGMA journal_mode = WAL`, SQLite lanza `SQLITE_BUSY: database is locked`** en cuanto el ESP32 escribe mientras el navegador consulta. Cuesta una tarde entera de depuración.
- `recorded_at` (hora del dispositivo) y `received_at` (hora del servidor) van en columnas separadas a propósito: los relojes de los microcontroladores se desalinean. Si guardas solo una, tu gráfica miente y no sabes por qué.
- `recorded_at` es `INTEGER` (epoch ms), no texto. Ordenar y comparar fechas como texto es lento y frágil.

**Hardware / red (Fase 5)**
- Fallos que **no son culpa del código** y que ninguna，直到頂 documentación avisa: firewall de Windows, la IP local cambia al reiniciar el router, y el *AP isolation* de algunos routers que aíslan clientes entre sí.
- Por eso la Fase 4 va antes que la 5: si el frontend ya habla con el backend por HTTP, un fallo del ESP32 se separa de un fallo de red en un minuto.
- `HTTPClient` viene en el core de Arduino. Para MQTT habría que instalar `PubSubClient` y montar un broker — razón de sobra para usar HTTP primero.

**PowerShell 5.1 (este entorno)**
- Daño la codificación: los caracteres no-ASCII (`·`, `á`) se deforman al comparar cadenas. Compara con texto plano o verifica vía `git show`.
- Trata el `stderr` de git como error: `git push ... 2>&1` produce `NativeCommandError` aunque el push funcione. Filtra la salida en vez de confiar en `$?`.
- **Se come las comillas** al pasar argumentos a ejecutables nativos. Usa escape `\"` dentro de cadenas con comillas dobles.
- Ejecuta `npm` con `workdir` en `frontend/`: la raíz del repo **no tiene** `package.json` y da `ENOENT`.

---

## Flujo de trabajo esperado

1. Antes de escribir código, explica el **porqué** del diseño.
2. Da la estructura de carpetas y los nombres de archivo.
3. Que el usuario escriba lo que pueda.
4. Que lo ejecute y te pegue el error tal cual sale.
5. Explica **por qué** falló, no solo el arreglo.
6. Verifica con `lint` + `build` + captura headless antes de dar algo por terminado.
7. Commits en Conventional Commits, en español: `feat:`, `fix:`, `chore:`, `docs:`.