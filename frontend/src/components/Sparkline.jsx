export function Sparkline({
    data = [],
    stroke = "#22d3ee",
    width = 260,
    height = 56,
    className = ""
}) {
    const clean = data.filter((n) => Number.isFinite(n));

    if (clean.length < 2) {
        return <div className={`h-14 ${className}`} aria-hidden="true" />;
    }

    const min = Math.min(...clean);
    const max = Math.max(...clean);
    const range = max - min || 1;
    const pad = 5;
    const usable = height - pad * 2;

    const coords = clean.map((value, index) => {
        const x = (index / (clean.length - 1)) * width;
        const y = pad + usable - ((value - min) / range) * usable;
        return [x, y];
    });

    const toSmooth = (points) =>
        points
            .map(([x, y], index) => {
                if (index === 0) return `M ${x.toFixed(2)} ${y.toFixed(2)}`;
                const [px, py] = points[index - 1];
                const cx = (px + x) / 2;
                return `C ${cx.toFixed(2)} ${py.toFixed(2)}, ${cx.toFixed(2)} ${y.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`;
            })
            .join(" ");

    const line = toSmooth(coords);
    const area = `${line} L ${width} ${height} L 0 ${height} Z`;
    const last = coords[coords.length - 1];

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className={`w-full ${className}`}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`spark-fill-${stroke.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity="0.34" />
                    <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                </linearGradient>
            </defs>

            <path d={area} fill={`url(#spark-fill-${stroke.replace("#", "")})`} />
            <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            <circle cx={last[0]} cy={last[1]} r="3.2" fill={stroke} />
            <circle cx={last[0]} cy={last[1]} r="6.5" fill={stroke} opacity="0.22" />
        </svg>
    );
}
