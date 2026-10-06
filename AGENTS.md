# AGENTS.md — AquaMagdalena

Dashboard IoT de calidad del agua. ESP32 (pH, temperatura, conductividad) en la Universidad del Magdalena.
Autor: Diego Ovalle · Repo: github.com/Dieguinho2309/dashboard-iot-agua

---

## Cómo trabajar con este usuario

- Habla y escribe en español. Responde siempre en español, incluidos comentarios de código, mensajes de commit y documentación.
- Está aprendiendo backend y frontend a la vez. Quiere entender el *porqué* de cada decisión, no solo recibir el arreglo. Cuando algo falle, explica la causa antes de aplicar el parche.
- Quiere escribir el código él mismo. Dale la estructura de carpetas, los nombres de archivo, el contrato de datos y pistas. No le entregues el archivo completo a la primera; si se traba, desbloquea.
- Quiere volverse independiente. No lo tomes de la mano: prefiere entender el criterio a que le resuelvas todo.
- Cero "efecto IA" en el diseño. Nada de glassmorphism, halos decorativos, iconos dentro de las tarjetas, animaciones de entrada ni hovers sin función. Si agregas algo puramente decorativo, probably sobra.
- Verifica antes de afirmar. No digas "funciona" sin ejecutarlo. En este proyecto eso significa: npm run lint, npm run build, y una captura con Chrome headless.
- Pregunta antes de sobre-ingenierizar. Este es un prototipo académico de 3 sensores. Docker, microservicios, CQRS, autenticación y MQTT son premature.

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| UI | React / React DOM | 19.2.8 |
| Build | Vite | 8.2.2 |
| Estilos | Tailwind CSS (v4, sin tailwind.config.js) | 4.3.3 |
| Mapas | Leaflet + react-leaflet | 1.9.4 / 5.0.0 |
| Lint | ESLint | 10.9.0 |
| Runtime | Node | v24.19.0 (npm 11.17.0) |
| Base de datos (futura) | node:sqlite — módulo nativo, cero dependencias npm | — |

---

## Comandos

Todos desde frontend/:

`ash
npm run dev       # servidor de desarrollo
npm run lint      # ESLint
npm run build     # build de producción → dist/
npm run preview   # sirve el build
`

No hay framework de tests. Decisión del usuario: se esperan hasta conectar el ESP32. No añadas uno sin que lo pida.

---

## Estructura

`
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
`

Ramas:
- main — versión vigente.
- feature/mapa — diseño alternativo anterior (glassmorphism, KPI, AlertList). Archivado, no fusionar. Tiene 23 iconos y componentes que main no usa; consúltalo con git show feature/mapa:<ruta> solo como referencia.