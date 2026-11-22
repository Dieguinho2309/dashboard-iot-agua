export const node = {
    id: "esp32-01",
    name: "Prototipo Estanque Universitario",
    shortName: "Nodo ESP32",
    place: "Universidad del Magdalena",
    lat: 11.22418,
    lng: -74.18542,
    uptime: "12 d 04 h",
    firmware: "v1.4.2"
};

/**
 * min / max  -> limites del sensor (extremos de la barra)
 * optimal    -> rango recomendado para agua dulce
 * spread     -> variacion que usa la simulacion de lecturas
 */
export const sensorConfig = {
    ph: {
        title: "Nivel de pH",
        unit: "",
        min: 6.5,
        max: 8.5,
        optimal: [7, 7.6],
        decimals: 1,
        color: "#22d3ee",
        start: 7.3,
        spread: 0.5
    },
    temperature: {
        title: "Temperatura del agua",
        unit: "°C",
        min: 18,
        max: 30,
        optimal: [22, 27],
        decimals: 1,
        color: "#f59e0b",
        start: 23.5,
        spread: 2
    },
    conductivity: {
        title: "Conductividad",
        unit: "µS/cm",
        min: 300,
        max: 800,
        optimal: [400, 600],
        decimals: 0,
        color: "#a78bfa",
        start: 480,
        spread: 70
    }
};

export const sensorInfo = {
    ph: {
        description: "Mide que tan acido o alcalino es el agua.",
        range: "Para agua dulce el rango optimo del prototipo es 7.0 - 7.6.",
        causes: "Puede bajar por lluvia acida, materia organica o vertidos; subir por algas y fotosintesis intensa.",
        action: "Revisa la fuente, evita contaminacion y confirma siempre con un laboratorio."
    },
    temperature: {
        description: "Influye en el oxigeno disuelto y en el metabolismo de la vida acuatica.",
        range: "El rango recomendado del prototipo es 22 - 27 C.",
        causes: "Exposicion solar directa, escasa circulacion o descargas termicas.",
        action: "Verifica sombreado, circulacion y aireacion antes de tomar decisiones."
    },
    conductivity: {
        description: "Estima la cantidad de sales disueltas en el agua.",
        range: "El rango optimo del prototipo es 400 - 600 uS/cm.",
        causes: "Fertilizantes, escorrentia, salinidad o vertidos domesticos.",
        action: "Revisa entradas de agua y drenajes; considera un recambio parcial si procede."
    }
};

export const simulation = {
    intervalMs: 3000,
    historyPoints: 24
};

/** Genera una lectura simulada continua a partir de la anterior. */
export function nextReading(key, previous) {
    const { start, spread, decimals, min, max } = sensorConfig[key];
    const base = typeof previous === "number" ? previous : start;
    const drift = (Math.random() - 0.5) * spread;
    const pull = (start - base) * 0.08;
    const value = Math.min(max, Math.max(min, base + drift + pull));
    return Number(value.toFixed(decimals));
}

/** Serie simulada con variacion gradual, util para el historial de la demo. */
export function buildSeries(key, count) {
    const series = [];
    let value = sensorConfig[key].start;
    for (let index = 0; index < count; index += 1) {
        value = nextReading(key, value);
        series.push(value);
    }
    return series;
}

/**
 * Compara una lectura contra el rango optimo.
 * Devuelve el estado y las medidas para pintar la barra (en porcentaje).
 */
export function evaluate(key, value) {
    const sensor = sensorConfig[key];
    const [low, high] = sensor.optimal;
    const span = sensor.max - sensor.min;
    const reading = Number(value);

    return {
        state: reading < low || reading > high ? "alert" : "ok",
        percent: Math.max(0, Math.min(100, ((reading - sensor.min) / span) * 100)),
        bandStart: ((low - sensor.min) / span) * 100,
        bandWidth: ((high - low) / span) * 100
    };
}

/**
 * Escala de color del pH (V2): rojo en los extremos, verde en el rango optimo.
 * Se usa para pintar el sparkline por valor.
 */
const PH_SCALE = [
    { value: 6.5, color: "#ef4444" },
    { value: 6.8, color: "#f97316" },
    { value: 7.0, color: "#10b981" },
    { value: 7.6, color: "#10b981" },
    { value: 7.8, color: "#f97316" },
    { value: 8.5, color: "#ef4444" }
];

/** Stops de color (valor -> color) para el sparkline. Solo pH tiene degradado. */
export function colorStops(key) {
    return key === "ph" ? PH_SCALE : null;
}
