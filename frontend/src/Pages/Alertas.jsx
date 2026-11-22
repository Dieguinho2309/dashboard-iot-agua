import AppLayout from "../components/AppLayout";
import { ShieldIcon, DropletIcon, ThermometerIcon, BoltIcon } from "../components/Icons";
import { evaluate, sensorConfig, simulation } from "../data/sensors";
import { usePageMeta } from "../hooks/usePageMeta";
import { useReadings } from "../hooks/useReadings";
import { isMock } from "../lib/api";

const ICONS = {
    ph: DropletIcon,
    temperature: ThermometerIcon,
    conductivity: BoltIcon
};

const ADVICE = {
    ph: "Revisar la fuente de agua y evitar contaminacion por acidos o algas.",
    temperature: "Verificar exposicion solar y oxigenacion del agua.",
    conductivity: "Revisar sales, fertilizantes o vertidos cercanos."
};

const keys = Object.keys(sensorConfig);

export default function Alertas() {
    const readings = useReadings();
    const headingRef = usePageMeta("Alertas y eventos");

    const events = [];
    for (const key of keys) {
        const series = readings.history[key];
        series.forEach((value, index) => {
            if (evaluate(key, value).state === "alert") {
                events.push({
                    key,
                    value,
                    ago: (series.length - 1 - index) * simulation.intervalMs
                });
            }
        });
    }
    events.sort((a, b) => a.ago - b.ago);

    return (
        <AppLayout readings={readings}>
            <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-white">Alertas y eventos</h2>
                <p className="mt-1 text-xs text-slate-400">
                    {isMock ? "Eventos ilustrativos · modo simulado" : "Eventos detectados sobre los rangos optimos"}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {keys.map((key) => {
                    const Icon = ICONS[key];
                    const sensor = sensorConfig[key];
                    const current = evaluate(key, readings.values[key]);
                    const count = readings.history[key].filter((value) => evaluate(key, value).state === "alert").length;

                    return (
                        <div key={key} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                            <div className="flex items-center gap-2">
                                <Icon className="size-4 text-cyan-300" />
                                <span className="text-sm font-semibold text-white">{sensor.title}</span>
                            </div>
                            <p className={`mt-2 text-xs ${current.state === "alert" ? "text-amber-300" : "text-emerald-300"}`}>
                                {current.state === "alert" ? "Fuera de rango" : "En rango"}
                            </p>
                            <p className="mt-1 font-mono text-2xl text-white tabular-nums">
                                {Number(readings.values[key]).toFixed(sensor.decimals)}
                                <span className="ml-1 text-xs text-slate-400">{sensor.unit}</span>
                            </p>
                            <p className="mt-2 text-[11px] text-slate-400">
                                {count} evento{count === 1 ? "" : "s"} en la ventana actual
                            </p>
                        </div>
                    );
                })}
            </div>

            <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ShieldIcon className="size-4 text-cyan-300" />
                    Ultimos eventos
                </h3>

                {events.length === 0 ? (
                    <p className="mt-4 text-xs text-slate-400">No hay eventos en la ventana actual.</p>
                ) : (
                    <ul className="mt-4 divide-y divide-slate-800">
                        {events.slice(0, 8).map((event, index) => {
                            const sensor = sensorConfig[event.key];
                            return (
                                <li key={`${event.key}-${index}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
                                    <span className="font-mono text-[11px] text-slate-400">
                                        hace {Math.round(event.ago / 1000)} s
                                    </span>
                                    <span className="text-xs font-semibold text-amber-300">{sensor.title}</span>
                                    <span className="font-mono text-xs text-white tabular-nums">
                                        {Number(event.value).toFixed(sensor.decimals)} {sensor.unit}
                                    </span>
                                    <span className="w-full text-[11px] text-slate-400">{ADVICE[event.key]}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </AppLayout>
    );
}
