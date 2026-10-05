import Sparkline from "./Sparkline";
import { evaluate } from "../data/sensors";

function DeltaArrow({ up }) {
    return (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden="true">
            <path d={up ? "M6 2 10 8H2z" : "M6 10 2 4h8z"} />
        </svg>
    );
}

export function SensorCard({ sensorKey, sensor, value, history }) {
    const { state, percent, bandStart, bandWidth } = evaluate(sensorKey, value);

    const previous = Number(history[history.length - 2]);
    const delta = Number.isFinite(previous) ? Number(value) - previous : 0;
    const up = delta > 0;
    const moved = Math.abs(delta) > 10 ** -sensor.decimals / 2;

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-slate-400">{sensor.title}</span>
                <span className={`text-xs ${state === "ok" ? "text-emerald-400" : "text-amber-400"}`}>
                    {state === "ok" ? "En rango" : "Fuera de rango"}
                </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold text-white tabular-nums">
                    {Number(value).toFixed(sensor.decimals)}
                </span>
                <span className="text-sm text-slate-400">{sensor.unit}</span>

                <span
                    className={`ml-auto flex items-center gap-0.5 text-xs tabular-nums ${
                        moved ? (up ? "text-emerald-400" : "text-rose-400") : "text-slate-600"
                    }`}
                >
                    {moved && <DeltaArrow up={up} />}
                    {moved ? Math.abs(delta).toFixed(sensor.decimals) : "estable"}
                </span>
            </div>

            <div className="mt-2">
                <Sparkline data={history} color={sensor.color} />
            </div>

            <div className="relative h-1.5 rounded bg-slate-800">
                <div
                    className="absolute inset-y-0 rounded bg-slate-600"
                    style={{ left: `${bandStart}%`, width: `${bandWidth}%` }}
                />
                <div
                    className="absolute inset-y-[-2px] w-0.5 rounded bg-white"
                    style={{ left: `${percent}%` }}
                />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{sensor.min}</span>
                <span>
                    óptimo {sensor.optimal[0]}–{sensor.optimal[1]} {sensor.unit}
                </span>
                <span>{sensor.max}</span>
            </div>
        </div>
    );
}
