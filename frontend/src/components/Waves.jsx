const WIDTH = 2400;
const HEIGHT = 160;

const LAYERS = [
    {
        fill: "#0f2137",
        period: 600,
        amplitude: 26,
        baseline: 0.6,
        opacity: 0.9,
        duration: "26s",
        delay: "-3s"
    },
    {
        fill: "#123049",
        period: 400,
        amplitude: 22,
        baseline: 0.66,
        opacity: 0.85,
        duration: "18s",
        delay: "-7s"
    },
    {
        fill: "#12354a",
        period: 300,
        amplitude: 18,
        baseline: 0.72,
        opacity: 0.7,
        duration: "12s",
        delay: "-2s"
    }
];

function wavePath({ period, amplitude, baseline }) {
    const mid = HEIGHT * baseline;
    const half = period / 2;
    const segments = Math.round(WIDTH / period);

    let d = `M0 ${mid.toFixed(2)}`;

    for (let i = 0; i < segments; i += 1) {
        const x = i * period;
        d += ` C ${(x + half / 2).toFixed(2)} ${(mid - amplitude).toFixed(2)}, ${(x + half * 1.5).toFixed(2)} ${(mid + amplitude).toFixed(2)}, ${(x + period).toFixed(2)} ${mid.toFixed(2)}`;
    }

    d += ` L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;
    return d;
}

export default function Waves({ className = "" }) {
    return (
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`} aria-hidden="true">
            {LAYERS.map((layer) => (
                <svg
                    key={layer.period}
                    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                    preserveAspectRatio="none"
                    className="wave-layer absolute bottom-0 left-0 h-full w-[200%]"
                    style={{
                        animationDuration: layer.duration,
                        animationDelay: layer.delay,
                        opacity: layer.opacity
                    }}
                >
                    <path d={wavePath(layer)} fill={layer.fill} />
                </svg>
            ))}
        </div>
    );
}
