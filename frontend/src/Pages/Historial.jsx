import { useState } from "react";
import { Link } from "react-router";
import AppLayout from "../components/AppLayout";
import HistoryChart from "../components/HistoryChart";
import { sensorConfig } from "../data/sensors";
import { useHistory } from "../hooks/useHistory";
import { useReadings } from "../hooks/useReadings";
import { isMock } from "../lib/api";

const RANGES = [
    { hours: 1, label: "1 h" },
    { hours: 24, label: "24 h" },
    { hours: 168, label: "7 d" }
];

const keys = Object.keys(sensorConfig);

export default function Historial() {
    const [hours, setHours] = useState(24);
    const readings = useReadings();
    const history = useHistory(hours);

    return (
        <AppLayout readings={readings}>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">Historial y tendencias</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        {isMock ? "Series ilustrativas · modo simulado" : "Series temporales del nodo"}
                    </p>
                </div>

                <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/40 p-1">
                    {RANGES.map((range) => (
                        <button
                            key={range.hours}
                            type="button"
                            onClick={() => setHours(range.hours)}
                            aria-pressed={hours === range.hours}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                hours === range.hours
                                    ? "bg-cyan-500/15 text-cyan-200"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {history.status === "error" && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                    {history.error}
                </p>
            )}

            {history.status === "loading" && (
                <p className="text-xs text-slate-400" role="status">
                    Cargando historial...
                </p>
            )}

            <div className="grid gap-5 xl:grid-cols-2">
                {keys.map((key) => (
                    <Link
                        key={key}
                        to={`/historial/${key}?range=${hours}`}
                        aria-label={`Ver detalle de ${sensorConfig[key].title}`}
                        className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 transition hover:border-cyan-500/50 hover:bg-slate-900/70"
                    >
                        <div className="flex items-baseline justify-between gap-2">
                            <h3 className="text-sm font-semibold text-white">{sensorConfig[key].title}</h3>
                            <span className="font-mono text-[11px] text-slate-400">{sensorConfig[key].unit}</span>
                        </div>
                        <div className="mt-3">
                            <HistoryChart
                                readings={history.readings}
                                sensorKey={key}
                                sensor={sensorConfig[key]}
                            />
                        </div>
                        <span className="mt-3 block text-[11px] text-cyan-300">Ver detalle →</span>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
