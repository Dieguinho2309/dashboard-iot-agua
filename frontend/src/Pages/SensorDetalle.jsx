import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router";
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

function parseRange(value) {
    const hours = Number(value);
    return [1, 24, 168].includes(hours) ? hours : 24;
}

function formatValue(value, sensor) {
    return Number(value).toFixed(sensor.decimals);
}

function computeStats(values, sensor) {
    const [low, high] = sensor.optimal;
    const inRange = values.filter((value) => value >= low && value <= high).length;
    return {
        last: values[values.length - 1],
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((total, value) => total + value, 0) / values.length,
        change: values[values.length - 1] - values[0],
        inRangePct: Math.round((inRange / values.length) * 100)
    };
}

export default function SensorDetalle() {
    const { sensorKey } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const hours = parseRange(searchParams.get("range"));
    const readings = useReadings();
    const history = useHistory(hours);
    const sensor = sensorConfig[sensorKey];

    const points = useMemo(
        () =>
            history.readings
                .map((reading) => ({ value: reading.values[sensorKey], recordedAt: reading.recordedAt }))
                .filter((point) => typeof point.value === "number"),
        [history.readings, sensorKey]
    );
    const values = useMemo(() => points.map((point) => point.value), [points]);
    const stats = useMemo(
        () => (sensor && values.length ? computeStats(values, sensor) : null),
        [sensor, values]
    );

    if (!sensor) {
        return (
            <AppLayout readings={readings}>
                <div className="grid flex-1 place-items-center rounded-lg border border-slate-800 bg-slate-900/40 p-10 text-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Sensor no encontrado</h2>
                        <p className="mt-2 text-xs text-slate-400">
                            La clave &quot;{sensorKey}&quot; no existe en el catalogo.
                        </p>
                        <Link to="/historial" className="mt-4 inline-block text-xs text-cyan-300 hover:text-white">
                            Volver al historial
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const rangeLabel = RANGES.find((range) => range.hours === hours).label;

    return (
        <AppLayout readings={readings}>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <Link to={`/historial?range=${hours}`} className="text-xs text-cyan-300 hover:text-white">
                        ← Volver al historial
                    </Link>
                    <h2 className="mt-2 text-xl font-semibold text-white">{sensor.title} · detalle</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        {isMock ? "Datos simulados" : "Datos reales"} · periodo {rangeLabel}
                    </p>
                </div>

                <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/40 p-1">
                    {RANGES.map((range) => (
                        <button
                            key={range.hours}
                            type="button"
                            onClick={() => setSearchParams({ range: String(range.hours) })}
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

            {stats && (
                <div className="space-y-5">
                    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                        <HistoryChart
                            readings={history.readings}
                            sensorKey={sensorKey}
                            sensor={sensor}
                            detailed
                        />
                    </section>

                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {[
                            { label: "Ultimo", value: `${formatValue(stats.last, sensor)} ${sensor.unit}` },
                            { label: "Minimo", value: `${formatValue(stats.min, sensor)} ${sensor.unit}` },
                            { label: "Maximo", value: `${formatValue(stats.max, sensor)} ${sensor.unit}` },
                            { label: "Promedio", value: `${formatValue(stats.avg, sensor)} ${sensor.unit}` },
                            {
                                label: "Variacion",
                                value: `${stats.change >= 0 ? "+" : ""}${formatValue(stats.change, sensor)} ${sensor.unit}`
                            },
                            { label: "Tiempo en rango", value: `${stats.inRangePct}%` }
                        ].map((item) => (
                            <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                                <p className="text-[11px] text-slate-400">{item.label}</p>
                                <p className="mt-1 font-mono text-sm font-semibold text-white">{item.value}</p>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </AppLayout>
    );
}
