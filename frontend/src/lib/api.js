import { nextReading, sensorConfig, simulation } from "../data/sensors";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const isMock = API_URL === "";

function mockReading() {
    return Object.fromEntries(Object.keys(sensorConfig).map((key) => [key, nextReading(key)]));
}

export async function fetchSnapshot() {
    if (isMock) {
        return {
            values: mockReading(),
            readings: Array.from({ length: simulation.historyPoints }, mockReading),
            source: "mock"
        };
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
