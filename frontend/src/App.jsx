import { useEffect, useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import { SensorCard } from "./components/SensorCard";
import { sensorConfig, simulation, nextReading } from "./data/sensors";

const keys = Object.keys(sensorConfig);

function buildHistory() {
    return Object.fromEntries(keys.map((key) => [key, Array.from({ length: simulation.historyPoints }, () => nextReading(key))]));
}

export default function App() {
    const [readings, setReadings] = useState(() => Object.fromEntries(keys.map((key) => [key, nextReading(key)])));
    const [history, setHistory] = useState(buildHistory);

    useEffect(() => {
        const id = setInterval(() => {
            const next = Object.fromEntries(keys.map((key) => [key, nextReading(key)]));

            setReadings(next);
            setHistory((prev) => Object.fromEntries(keys.map((key) => [key, [...prev[key].slice(1), next[key]]])));
        }, simulation.intervalMs);

        return () => clearInterval(id);
    }, []);

    return (
        <div className="min-h-screen bg-[#0b101e] text-slate-300">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <Header />

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="h-[440px] overflow-hidden rounded-lg border border-slate-800 lg:col-span-2">
                        <MapView />
                    </div>

                    <div className="flex flex-col gap-4">
                        {keys.map((key) => (
                            <SensorCard
                                key={key}
                                sensorKey={key}
                                sensor={sensorConfig[key]}
                                value={readings[key]}
                                history={history[key]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
