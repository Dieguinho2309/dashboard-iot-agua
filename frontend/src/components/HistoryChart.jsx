export default function HistoryChart({ readings, sensorKey, sensor }) {
    const values = readings
        .map((reading) => reading.values[sensorKey])
        .filter((value) => typeof value === "number");

    if (values.length < 2) {
        return <div className="grid h-52 place-items-center text-xs text-slate-400">Sin datos suficientes</div>;
    }

    const width = 800;
    const height = 200;
    const padding = 8;
    const span = sensor.max - sensor.min || 1;
    const yFor = (value) => {
        const bounded = Math.min(sensor.max, Math.max(sensor.min, value));
        return height - padding - ((bounded - sensor.min) / span) * (height - 2 * padding);
    };
    const xFor = (index) => (index / (values.length - 1)) * width;

    const points = values.map((value, index) => `${xFor(index).toFixed(1)},${yFor(value).toFixed(1)}`).join(" ");
    const area = `0,${height} ${points} ${width},${height}`;
    const bandTop = yFor(sensor.optimal[1]);
    const bandBottom = yFor(sensor.optimal[0]);
    const last = values[values.length - 1];

    return (
        <div className="space-y-2">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="h-52 w-full"
                role="img"
                aria-label={`Historial de ${sensor.title}`}
            >
                <rect x="0" y={bandTop} width={width} height={bandBottom - bandTop} fill="#22d3ee" opacity="0.08" />
                <polyline points={area} fill={sensor.color} opacity="0.1" />
                <polyline
                    points={points}
                    fill="none"
                    stroke={sensor.color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
                <circle cx={width - 2} cy={yFor(last)} r="3.5" fill={sensor.color} />
            </svg>

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
