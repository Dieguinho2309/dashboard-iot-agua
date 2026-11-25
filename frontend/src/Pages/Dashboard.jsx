import { Suspense, lazy } from "react";
import AppLayout from "../components/AppLayout";
import AiFab from "../components/AiFab";
import { SensorCard } from "../components/SensorCard";
import { sensorConfig } from "../data/sensors";
import { usePageMeta } from "../hooks/usePageMeta";
import { useReadings } from "../hooks/useReadings";

// El mapa (maplibre-gl) es lo mas pesado: se carga en su propio chunk.
const MapView = lazy(() => import("../components/MapView"));

const keys = Object.keys(sensorConfig);

export default function Dashboard() {
    const readings = useReadings();
    const headingRef = usePageMeta("Panel principal");

    return (
        <AppLayout readings={readings}>
            <h2 ref={headingRef} tabIndex={-1} className="sr-only">Panel principal</h2>

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
                            value={readings.values[key]}
                            history={readings.history[key]}
                        />
                    ))}
                </div>
            </div>

            <AiFab />
        </AppLayout>
    );
}
