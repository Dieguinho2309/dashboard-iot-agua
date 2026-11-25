import { sensorConfig } from "./sensors";

const ph = sensorConfig.ph;
const temperature = sensorConfig.temperature;
const conductivity = sensorConfig.conductivity;

function rangeText(sensor) {
    const unit = sensor.unit ? ` ${sensor.unit}` : "";
    const [low, high] = sensor.optimal;
    return `${low.toFixed(sensor.decimals)}–${high.toFixed(sensor.decimals)}${unit}`;
}

export const quickPrompts = [
    "¿Cómo está el pH del estanque?",
    "¿Qué significa la conductividad?",
    "¿Qué pasa si sube la temperatura?",
    "¿Cómo se generan las alertas?"
];

export const initialMessages = [
    {
        id: "welcome",
        role: "assistant",
        text: "Hola. Esta es una proyección del asistente IA de AquaMagdalena. Todavía no hay un modelo conectado: las respuestas son ejemplos de cómo se usará el contexto del proyecto y las lecturas del nodo."
    }
];

export function projectionReply(question) {
    const q = question.toLowerCase();

    if (q.includes("ph") || q.includes("acido") || q.includes("ácido") || q.includes("alcalin")) {
        return `El pH óptimo del prototipo es ${rangeText(ph)}. En la versión final compararé la última lectura con ese rango y explicaré si está por debajo, dentro o por encima.`;
    }

    if (q.includes("conduct")) {
        return `La conductividad estima las sales disueltas en el agua. El rango de referencia es ${rangeText(conductivity)}; fuera de ahí revisaría fertilizantes, escorrentía o vertidos cercanos.`;
    }

    if (q.includes("temper")) {
        return `La temperatura recomendada es ${rangeText(temperature)}. Si sube, revisaría sombra, circulación y oxigenación; si baja, las causas del enfriamiento.`;
    }

    if (q.includes("alerta") || q.includes("evento")) {
        return "Las alertas se generan cuando una lectura sale del rango óptimo. En la versión final el asistente podrá explicar el evento, su duración y una acción recomendada.";
    }

    if (q.includes("simulad") || q.includes("dato") || q.includes("real")) {
        return "Ahora mismo la interfaz puede estar en modo simulado. Esta proyección no analiza datos reales; cuando el ESP32 esté conectado, el backend enviará las lecturas y el asistente las usará como contexto.";
    }

    return "En la versión final responderé con el contexto del proyecto y las lecturas del nodo. Por ahora esto es una proyección: no hay modelo conectado ni análisis de datos reales.";
}
