export default function Sparkline({ data, color, width = 220, height = 40 }) {
    if (!data || data.length < 2) {
        return <div style={{ height }} />;
    }

    const min = Math.min(...data);
    const span = Math.max(...data) - min || 1;

    const points = data.map((value, index) => [
        (index / (data.length - 1)) * width,
        height - 4 - ((value - min) / span) * (height - 8)
    ]);

    const line = points
        .map(([x, y], index) => {
            if (index === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;

            const [prevX, prevY] = points[index - 1];
            const mid = ((prevX + x) / 2).toFixed(1);

            return `C${mid} ${prevY.toFixed(1)},${mid} ${y.toFixed(1)},${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-10 w-full">
            <path d={`${line} L${width} ${height} L0 ${height} Z`} fill={color} fillOpacity="0.12" />
            <path d={line} fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}
