import { Suspense, lazy, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { SensorCard } from "../components/SensorCard";
import Footer from "../components/Footer";
import { sensorConfig } from "../data/sensors";
import { useReadings } from "../hooks/useReadings";
import { isMock } from "../lib/api";

// El mapa (maplibre-gl) es lo mas pesado: se carga en su propio chunk.
const MapView = lazy(() => import("../components/MapView"));

const keys = Object.keys(sensorConfig);

export default function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { values, history, status, error } = useReadings();
    const live = !isMock && status === "ok";

    return (
        <div className="flex min-h-dvh bg-[#0b101e] text-slate-300">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} live={live} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onMenu={() => setMenuOpen(true)} live={live} status={status} error={error} />

                <main className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
                    <div className="grid gap-5 xl:grid-cols-12">
                        <div className="h-72 overflow-hidden rounded-lg border border-slate-800 sm:h-105 xl:col-span-8 xl:h-125">
                            <Suspense
                                fallback={
                                    <div className="grid h-full w-full place-items-center text-xs text-slate-400">
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
                                    value={values[key]}
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
