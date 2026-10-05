import { memo } from "react";
import { Sparkline } from "./Sparkline";
import { DropletIcon, ThermometerIcon, BoltIcon, ArrowUpRightIcon, ArrowDownRightIcon } from "./Icons";
import { evaluate } from "../data/sensors";

const iconByKey = {
    ph: DropletIcon,
    temperature: ThermometerIcon,
    conductivity: BoltIcon
};

const statusStyles = {
    normal: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    warning: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
    danger: "bg-rose-400/10 text-rose-300 ring-rose-400/25",
    unknown: "bg-slate-400/10 text-slate-400 ring-slate-400/25"
};

export const SensorCard = memo(function SensorCard({ sensor, value, history = [] }) {
    const Icon = iconByKey[sensor.key] ?? DropletIcon;
    const { status, percent, label } = evaluate(sensor.key, value);
    const numeric = Number(value) || 0;
    const previous = Number(history[history.length - 2]);
    const delta = Number.isFinite(previous) ? numeric - previous : 0;
    const rising = delta > 0.001;
    const falling = delta < -0.001;

    const bandLeft = ((sensor.ideal[0] - sensor.min) / (sensor.max - sensor.min)) * 100;
    const bandWidth = ((sensor.ideal[1] - sensor.ideal[0]) / (sensor.max - sensor.min)) * 100;

    return (
        <article className="glass-panel group relative overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-0.5">
            <div
                className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundColor: sensor.color }}
            />

            <header className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset"
                        style={{
                            backgroundColor: `color-mix(in oklab, ${sensor.color} 14%, transparent)`,
                            borderColor: `color-mix(in oklab, ${sensor.color} 30%, transparent)`
                        }}
                    >
                        <Icon className="size-5" style={{ color: sensor.color }} />
                    </span>
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-100">{sensor.title}</h3>
                        <p className="truncate text-[11px] text-slate-500">{sensor.description}</p>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ${statusStyles[status]}`}
                >
                    {status === "normal" ? "Óptimo" : status === "warning" ? "Alerta" : status === "danger" ? "Crítico" : "—"}
                </span>
            </header>

            <div className="relative mt-4 flex items-end justify-between gap-3">
                <p className="font-mono text-[28px] leading-none font-semibold text-white tabular-nums">
                    {numeric.toFixed(sensor.decimals)}
                    <span className="ml-1 text-sm font-medium text-slate-400">{sensor.unit}</span>
                </p>

                <span
                    className={`flex items-center gap-0.5 text-xs font-medium tabular-nums ${
                        rising ? "text-emerald-400" : falling ? "text-rose-400" : "text-slate-500"
                    }`}
                >
                    {(rising || falling) &&
                        (rising ? (
                            <ArrowUpRightIcon className="size-3.5" />
                        ) : (
                            <ArrowDownRightIcon className="size-3.5" />
                        ))}
                    {rising || falling ? Math.abs(delta).toFixed(sensor.decimals) : "estable"}
                </span>
            </div>

            <div className="relative mt-3 h-14">
                <Sparkline data={history} stroke={sensor.color} />
            </div>

            <div className="relative mt-3">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800/90">
                    <div
                        className="absolute inset-y-0 rounded-full transition-[width] duration-700 ease-out"
                        style={{
                            width: `${percent}%`,
                            background: `linear-gradient(90deg, color-mix(in oklab, ${sensor.color} 45%, transparent), ${sensor.color})`
                        }}
                    />
                    <div
                        className="absolute inset-y-0 rounded-full bg-emerald-400/25 ring-1 ring-inset ring-emerald-400/40"
                        style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
                    />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono tabular-nums">
                        {sensor.min} {sensor.unit}
                    </span>
                    <span className="font-medium text-slate-400">{sensor.hint}</span>
                    <span className="font-mono tabular-nums">
                        {sensor.max} {sensor.unit}
                    </span>
                </div>
            </div>

            <p className="sr-only">{label}</p>
        </article>
    );
});
