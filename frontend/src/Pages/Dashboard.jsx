import { Suspense, lazy, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { SensorCard } from "../components/SensorCard";
import Footer from "../components/Footer";
import { sensorConfig, simulation, nextReading } from "../data/sensors";

// El mapa (maplibre-gl) es lo mas pesado: se carga en su propio chunk.
const MapView = lazy(() => import("../components/MapView"));

const keys = Object.keys(sensorConfig);

function buildHistory() {
    return Object.fromEntries(keys.map((key) => [key, Array.from({ length: simulation.historyPoints }, () => nextReading(key))]));
}

export default function Dashboard() {
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

                <main className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
                    <div className="grid gap-5 xl:grid-cols-12">
                        <div className="h-72 overflow-hidden rounded-lg border border-slate-800 sm:h-105 xl:col-span-8 xl:h-125">
                            <Suspense
                                fallback={
                                    <div className="grid h-full w-full place-items-center text-xs text-slate-500">
                                        Cargando mapa...
                                    </div>
                                }
                            >
                                <MapView />
                            </Suspense>
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
                    <Footer />
                </main>
            </div>
        </div>
    );
}
