import { buildSeries, nextReading, sensorConfig, simulation } from "../data/sensors";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const isMock = API_URL === "";

const keys = Object.keys(sensorConfig);

export const HISTORY_RANGES = [
    { hours: 1, label: "1 h", points: 60, stepMs: 60 * 1000 },
    { hours: 24, label: "24 h", points: 96, stepMs: 15 * 60 * 1000 },
    { hours: 168, label: "7 d", points: 84, stepMs: 2 * 60 * 60 * 1000 }
];

const RANGES = Object.fromEntries(HISTORY_RANGES.map((range) => [range.hours, range]));

let mockState = null;

function advanceMock() {
    if (!mockState) {
        mockState = Object.fromEntries(keys.map((key) => [key, buildSeries(key, simulation.historyPoints)]));
    } else {
        mockState = Object.fromEntries(
            keys.map((key) => {
                const series = mockState[key];
                return [key, [...series.slice(1), nextReading(key, series[series.length - 1])]];
            })
        );
    }

    return {
        values: Object.fromEntries(keys.map((key) => [key, mockState[key][mockState[key].length - 1]])),
        readings: Array.from({ length: simulation.historyPoints }, (_, index) =>
            Object.fromEntries(keys.map((key) => [key, mockState[key][index]]))
        )
    };
}

export async function fetchSnapshot() {
    if (isMock) {
        return { ...advanceMock(), source: "mock" };
    }

    const [latestResponse, historyResponse] = await Promise.all([
        fetch(`${API_URL}/api/readings/latest`),
        fetch(`${API_URL}/api/readings/history?limit=${simulation.historyPoints}`)
    ]);

    if (!latestResponse.ok) throw new Error(`Ultima lectura no disponible (${latestResponse.status})`);
    if (!historyResponse.ok) throw new Error(`Historial no disponible (${historyResponse.status})`);

    const latest = await latestResponse.json();
    const history = await historyResponse.json();

    return {
        values: latest.values,
        readings: history.readings.map((reading) => reading.values),
        source: "api"
    };
}

export async function fetchHistory(hours) {
    const range = RANGES[hours] ?? RANGES[24];

    if (isMock) {
        const series = Object.fromEntries(keys.map((key) => [key, buildSeries(key, range.points)]));
        const now = Date.now();
        return Array.from({ length: range.points }, (_, index) => ({
            recordedAt: new Date(now - (range.points - 1 - index) * range.stepMs).toISOString(),
            values: Object.fromEntries(keys.map((key) => [key, series[key][index]]))
        }));
    }

    const response = await fetch(`${API_URL}/api/readings/history?hours=${hours}&limit=${range.points}`);
    if (!response.ok) throw new Error(`Historial no disponible (${response.status})`);

    const data = await response.json();
    return data.readings;
}
