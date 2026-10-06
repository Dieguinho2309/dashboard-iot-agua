import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MapView from "./components/MapView";
import { SensorCard } from "./components/SensorCard";
import { sensorConfig, simulation, nextReading } from "./data/sensors";

const keys = Object.keys(sensorConfig);

function buildHistory() {
    return Object.fromEntries(keys.map((key) => [key, Array.from({ length: simulation.historyPoints }, () => nextReading(key))]));
}

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
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
        <div className="flex min-h-dvh bg-[#0b101e] text-slate-300">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onMenu={() => setMenuOpen(true)} />

                <main className="flex-1 p-4 sm:p-6">
                    <div className="grid gap-5 xl:grid-cols-12">
                        <div className="h-[420px] overflow-hidden rounded-lg border border-slate-800 sm:h-[500px] xl:col-span-8">
                            <MapView />
                        </div>

                        <div className="flex flex-col gap-4 xl:col-span-4">
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
                </main>
            </div>
        </div>
    );
}
