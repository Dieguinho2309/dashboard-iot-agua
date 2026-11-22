import { useState } from "react";
import { Link } from "react-router";
import AppLayout from "../components/AppLayout";
import HistoryChart from "../components/HistoryChart";
import { sensorConfig } from "../data/sensors";
import { useHistory } from "../hooks/useHistory";
import { usePageMeta } from "../hooks/usePageMeta";
import { useReadings } from "../hooks/useReadings";
import { HISTORY_RANGES, isMock } from "../lib/api";

const keys = Object.keys(sensorConfig);

export default function Historial() {
    const [hours, setHours] = useState(24);
    const readings = useReadings();
    const history = useHistory(hours);
    const headingRef = usePageMeta("Historial y tendencias");

    return (
        <AppLayout readings={readings}>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-white">Historial y tendencias</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        {isMock ? "Series ilustrativas · modo simulado" : "Series temporales del nodo"}
                    </p>
                </div>

                <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/40 p-1">
                    {HISTORY_RANGES.map((range) => (
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
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                    <span>{history.error}</span>
                    <button
                        type="button"
                        onClick={history.reload}
                        className="rounded-md border border-rose-400/40 px-3 py-1.5 font-semibold transition hover:bg-rose-400/10"
                    >
                        Reintentar
                    </button>
                </div>
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
                        className={`rounded-lg border border-slate-800 bg-slate-900/40 p-4 transition hover:border-cyan-500/50 hover:bg-slate-900/70 ${
                            history.stale ? "opacity-60" : ""
                        }`}
                        aria-busy={history.reloading}
                    >
                        {history.reloading && (
                            <div className="mb-2 h-1 animate-pulse rounded bg-cyan-500/30 motion-reduce:animate-none" aria-hidden="true" />
                        )}
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
