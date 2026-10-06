# Dashboard IoT - Calidad del Agua

Panel de control web moderno para la visualización en tiempo real de datos recolectados por un prototipo con ESP32 (pH, temperatura y conductividad eléctrica) ubicado en la Universidad Del Magdalena.

> **Estado actual:** las lecturas son **simuladas**. `nextReading()` en `frontend/src/data/sensors.js` genera valores con `Math.random()` porque el ESP32 todavía no está conectado. No hay backend: el frontend no hace peticiones de red. El backend que recibirá las lecturas reales está en desarrollo.

## Tecnologías
- **Front-end:** React, Vite, Tailwind CSS
- **Mapas:** Leaflet / React-Leaflet
- **Hardware IoT:** ESP32 (Microcontrolador con Wi-Fi integrado para lectura de sensores de pH, temperatura y conductividad)
- **Control de versiones:** Git & GitHub

## Puesta en marcha

```bash
cd frontend
npm install
npm run dev
```

Abre <http://localhost:5173>.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run lint` | ESLint |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build ya generado |

## Estructura

```
proyecto-iot/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # layout: sidebar + header + mapa + tarjetas
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # fijo en escritorio, drawer en móvil
│   │   │   ├── Header.jsx           # barra superior con reloj y estado
│   │   │   ├── MapView.jsx          # mapa Leaflet con teselas oscuras de Esri
│   │   │   ├── SensorCard.jsx       # valor, delta, sparkline y rango óptimo
│   │   │   ├── Sparkline.jsx        # gráfica SVG del historial
│   │   │   └── Icons.jsx            # iconos SVG en línea
│   │   └── data/
│   │       └── sensors.js           # configuración, rangos y simulación
│   └── index.html
└── README.md
```

## Notas de implementación

- **El mapa no necesita API key.** Usa teselas de Esri (`Canvas/World_Dark_Gray_Base`). Se evaluó CARTO pero devolvía teselas vacías con marca de agua.
- **El historial dura ~72 segundos.** Es una ventana deslizante de las últimas 24 lecturas, actualizada cada 3 s. Cuando exista el backend, el historial se podrá pedir al servidor y ampliar la ventana a horas sin tocar `Sparkline.jsx`.
- **Los rangos son valores típicos de estanque, no la especificación del proyecto:** pH 7.0–7.6, temperatura 22–27 °C, conductividad 400–600 µS/cm. Hay que ajustarlos cuando se tengan las fichas técnicas de los sensores.
- **Ramas:** `main` es la versión vigente. `feature/mapa` conserva un diseño alternativo anterior y no se fusionó.

