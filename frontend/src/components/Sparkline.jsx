import { useId } from "react";

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex) {
    const value = parseInt(hex.slice(1), 16);
    return [value >> 16, (value >> 8) & 255, value & 255];
}

function mixColor(a, b, t) {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0")}`;
}

/** Color de la escala para un valor absoluto (interpola entre stops). */
function colorAt(stops, value) {
    if (value <= stops[0].value) return stops[0].color;

    const last = stops[stops.length - 1];
    if (value >= last.value) return last.color;

    for (let i = 0; i < stops.length - 1; i += 1) {
        const a = stops[i];
        const b = stops[i + 1];
        if (value >= a.value && value <= b.value) {
            const t = (value - a.value) / (b.value - a.value || 1);
            return mixColor(a.color, b.color, t);
        }
    }

    return last.color;
}

/**
 * Mini grafico de linea. Si recibe `stops` (valor -> color), pinta la linea y
 * el area con un degradado vertical por valor absoluto (el pH se pone verde en
 * el rango optimo y vira a naranja/rojo hacia los extremos). Sin `stops` usa un
 * color plano.
 */
export default function Sparkline({ data, color = "#22d3ee", stops, width = 220, height = 40 }) {
    const rawId = useId();
    const gradientId = `spark-${rawId.replace(/:/g, "")}`;

    if (!data || data.length < 2) {
        return <div style={{ height }} />;
    }

    const min = Math.min(...data);
    const span = Math.max(...data) - min || 1;

    const yFor = (value) => height - 4 - ((value - min) / span) * (height - 8);

    const points = data.map((value, index) => [(index / (data.length - 1)) * width, yFor(value)]);

    const line = points
        .map(([x, y], index) => {
            if (index === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;

            const [prevX, prevY] = points[index - 1];
            const mid = ((prevX + x) / 2).toFixed(1);

            return `C${mid} ${prevY.toFixed(1)},${mid} ${y.toFixed(1)},${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");

    const gradientStops = stops
        ? (() => {
              // Rango de valores que cubre el alto del grafico (y=0 .. y=height).
              const topValue = min + ((height - 4) / (height - 8)) * span;
              const bottomValue = min - (4 / (height - 8)) * span;

              const inner = stops
                  .filter((stop) => stop.value > bottomValue && stop.value < topValue)
                  .map((stop) => ({ offset: clamp(yFor(stop.value) / height, 0, 1), color: stop.color }));

              return [
                  { offset: 0, color: colorAt(stops, topValue) },
                  ...inner,
                  { offset: 1, color: colorAt(stops, bottomValue) }
              ].sort((a, b) => a.offset - b.offset);
          })()
        : null;

    const stroke = gradientStops ? `url(#${gradientId})` : color;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-10 w-full">
            {gradientStops && (
                <defs>
                    <linearGradient
                        id={gradientId}
                        gradientUnits="userSpaceOnUse"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={height}
                    >
                        {gradientStops.map((stop, index) => (
                            <stop key={index} offset={stop.offset} stopColor={stop.color} />
                        ))}
                    </linearGradient>
                </defs>
            )}
            <path d={`${line} L${width} ${height} L0 ${height} Z`} fill={stroke} fillOpacity="0.12" />
            <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" />
        </svg>
    );
}
