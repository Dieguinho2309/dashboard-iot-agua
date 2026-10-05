export const node = {
    id: "esp32-01",
    name: "Prototipo Estanque Universitario",
    shortName: "Nodo ESP32",
    place: "Universidad del Magdalena · Sede principal",
    lat: 11.22418,
    lng: -74.18542,
    uptime: "12 d 04 h",
    firmware: "v1.4.2"
};

export const nodePosition = [node.lat, node.lng];

export const sensors = {
    ph: {
        key: "ph",
        title: "Nivel de pH",
        unit: "",
        min: 6.5,
        max: 8.5,
        ideal: [7, 7.6],
        color: "#22d3ee",
        decimals: 1,
        description: "Equilibrio ácido-base del agua",
        hint: "Rango óptimo 7.0 – 7.6"
    },
    temperature: {
        key: "temperature",
        title: "Temperatura",
        unit: "°C",
        min: 18,
        max: 30,
        ideal: [22, 27],
        color: "#f59e0b",
        decimals: 1,
        description: "Temperatura superficial del estanque",
        hint: "Rango óptimo 22 – 27 °C"
    },
    conductivity: {
        key: "conductivity",
        title: "Conductividad",
        unit: " µS/cm",
        min: 300,
        max: 800,
        ideal: [400, 600],
        color: "#a78bfa",
        decimals: 0,
        description: "Sólidos disueltos en el agua",
        hint: "Rango óptimo 400 – 600 µS/cm"
    }
};

export const seed = {
    ph: 7.2,
    temperature: 23.4,
    conductivity: 450
};

export const alerts = [
    {
        id: 1,
        level: "warning",
        title: "Conductividad en ascenso",
        detail: "El valor se aproxima al límite superior del rango.",
        time: "Hace 4 min"
    },
    {
        id: 2,
        level: "info",
        title: "Lectura estable de pH",
        detail: "El nodo mantiene el agua dentro del rango óptimo.",
        time: "Hace 11 min"
    },
    {
        id: 3,
        level: "success",
        title: "Sincronización completada",
        detail: "128 muestras enviadas al servidor por Wi-Fi.",
        time: "Hace 26 min"
    }
];

export function evaluate(sensorKey, value) {
    const sensor = sensors[sensorKey];
    const numeric = Number(value);

    if (!sensor || !Number.isFinite(numeric)) {
        return { status: "unknown", percent: 0, label: "Sin dato" };
    }

    const [low, high] = sensor.ideal;

    if (numeric < low || numeric > high) {
        const distance = numeric < low ? low - numeric : numeric - high;
        const status = distance > (high - low) * 0.6 ? "danger" : "warning";
        return {
            status,
            percent: Math.max(0, Math.min(100, ((numeric - sensor.min) / (sensor.max - sensor.min)) * 100)),
            label: numeric < low ? "Por debajo del óptimo" : "Por encima del óptimo"
        };
    }

    return {
        status: "normal",
        percent: Math.max(0, Math.min(100, ((numeric - sensor.min) / (sensor.max - sensor.min)) * 100)),
        label: "En rango óptimo"
    };
}
