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

export const simulation = {
    intervalMs: 3000,
    historyPoints: 24
};

/** Genera una lectura simulada alrededor del valor central del sensor. */
export function nextReading(key) {
    const { start, spread, decimals } = sensorConfig[key];
    const value = start + (Math.random() - 0.5) * spread;
    return Number(value.toFixed(decimals));
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
