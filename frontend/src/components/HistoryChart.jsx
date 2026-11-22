import { useState } from "react";

function formatPointTime(recordedAt, index) {
    if (!recordedAt) return `punto ${index + 1}`;
    const date = new Date(recordedAt);
    if (Number.isNaN(date.getTime())) return "sin hora";
    return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryChart({ readings, sensorKey, sensor, detailed = false }) {
    const [hovered, setHovered] = useState(null);

    const points = readings
        .map((reading) => ({ value: reading.values[sensorKey], recordedAt: reading.recordedAt }))
        .filter((point) => typeof point.value === "number");

    if (points.length < 2) {
        return <div className="grid h-52 place-items-center text-xs text-slate-400">Sin datos suficientes</div>;
    }

    const values = points.map((point) => point.value);
    const width = 800;
    const height = detailed ? 260 : 200;
    const padding = 8;
    const span = sensor.max - sensor.min || 1;
    const yFor = (value) => {
        const bounded = Math.min(sensor.max, Math.max(sensor.min, value));
        return height - padding - ((bounded - sensor.min) / span) * (height - 2 * padding);
    };
    const xFor = (index) => (index / (points.length - 1)) * width;

    const line = values.map((value, index) => `${xFor(index).toFixed(1)},${yFor(value).toFixed(1)}`).join(" ");
    const area = `0,${height} ${line} ${width},${height}`;
    const bandTop = yFor(sensor.optimal[1]);
    const bandBottom = yFor(sensor.optimal[0]);
    const last = values[values.length - 1];

    function handleMove(event) {
        if (!detailed) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width) return;
        const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        setHovered(Math.round(ratio * (points.length - 1)));
    }

    return (
        <div className="relative space-y-2">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className={`w-full ${detailed ? "h-72 cursor-crosshair" : "h-52"}`}
                role="img"
                aria-label={`Historial de ${sensor.title}`}
                onPointerMove={handleMove}
                onPointerLeave={() => setHovered(null)}
            >
                <rect x="0" y={bandTop} width={width} height={bandBottom - bandTop} fill="#22d3ee" opacity="0.08" />
                <polyline points={area} fill={sensor.color} opacity="0.1" />
                <polyline
                    points={line}
                    fill="none"
                    stroke={sensor.color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
                <circle cx={width - 2} cy={yFor(last)} r="3.5" fill={sensor.color} />
                {detailed && hovered !== null && (
                    <>
                        <line
                            x1={xFor(hovered)}
                            y1="0"
                            x2={xFor(hovered)}
                            y2={height}
                            stroke="#94a3b8"
                            strokeDasharray="4 4"
                            vectorEffect="non-scaling-stroke"
                        />
                        <circle cx={xFor(hovered)} cy={yFor(values[hovered])} r="4" fill="#fff" />
                    </>
                )}
            </svg>

            {detailed && hovered !== null && (
                <div
                    className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-md border border-slate-700 bg-[#0b101e]/95 px-2 py-1 text-[11px] text-slate-200 shadow-lg"
                    style={{ left: `${Math.min(88, Math.max(12, (hovered / (points.length - 1)) * 100))}%` }}
                >
                    <span className="font-mono font-semibold">{values[hovered].toFixed(sensor.decimals)}</span>{" "}
                    {sensor.unit} · {formatPointTime(points[hovered].recordedAt, hovered)}
                </div>
            )}

            <div className="flex justify-between text-[11px] text-slate-400">
                <span>{sensor.min}</span>
                <span>
                    óptimo {sensor.optimal[0]}–{sensor.optimal[1]} {sensor.unit}
                </span>
                <span>{sensor.max}</span>
            </div>
        </div>
    );
}
