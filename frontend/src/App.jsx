import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MapView from "./components/MapView";
import { SensorCard } from "./components/SensorCard";
import AlertList from "./components/AlertList";
import Footer from "./components/Footer";
import { SparkIcon, WavesIcon, ClockIcon, ShieldIcon } from "./components/Icons";
import { sensors, seed, node, evaluate } from "./data/sensors";

const MAX_POINTS = 24;
const TICK_MS = 3000;

function randomAround(base, spread) {
    return Number((base + (Math.random() - 0.5) * spread).toFixed(2));
}

function buildHistory(base, spread) {
    return Array.from({ length: MAX_POINTS }, () => Number((base + (Math.random() - 0.5) * spread).toFixed(2)));
}

function Kpi({ icon: Icon, label, value, hint, accent, delay }) {
    return (
        <div
            className="glass-panel animate-fade-up flex items-center gap-3.5 rounded-2xl p-4"
            style={{ animationDelay: delay }}
        >
            <span
                className="grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset"
                style={{
                    color: accent,
                    backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                    borderColor: `color-mix(in oklab, ${accent} 26%, transparent)`
                }}
            >
                <Icon className="size-5" />
            </span>
            <div className="min-w-0">
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="truncate text-lg leading-tight font-bold text-white">{value}</p>
                <p className="truncate text-[10px] text-slate-600">{hint}</p>
            </div>
        </div>
    );
}

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [readings, setReadings] = useState({
        ph: seed.ph,
        temperature: seed.temperature,
        conductivity: seed.conductivity
    });
    const [history, setHistory] = useState(() => ({
        ph: buildHistory(seed.ph, 0.5),
        temperature: buildHistory(seed.temperature, 2),
        conductivity: buildHistory(seed.conductivity, 40)
    }));

    useEffect(() => {
        const id = setInterval(() => {
            const nextPh = randomAround(7.3, 0.5);
            const nextTemp = randomAround(23.5, 2);
            const nextCond = Math.round(randomAround(480, 70));

            setReadings({ ph: nextPh, temperature: nextTemp, conductivity: nextCond });
            setHistory((prev) => ({
                ph: [...prev.ph.slice(1), nextPh],
                temperature: [...prev.temperature.slice(1), nextTemp],
                conductivity: [...prev.conductivity.slice(1), nextCond]
            }));
        }, TICK_MS);

        return () => clearInterval(id);
    }, []);

    const quality = useMemo(() => {
        const results = Object.keys(sensors).map((key) => evaluate(key, readings[key]));
        const worst = results.some((r) => r.status === "danger")
            ? "Crítico"
            : results.some((r) => r.status === "warning")
              ? "Con alertas"
              : "Óptima";
        const score = Math.round(
            results.reduce((acc, r) => acc + (r.status === "normal" ? 100 : r.status === "warning" ? 60 : 25), 0) / results.length
        );
        return { worst, score };
    }, [readings]);

    const samples = Math.round(MAX_POINTS * (readings.ph ? 1 : 0) * 12);

    return (
        <div className="grid-haze flex min-h-dvh bg-abyss text-slate-300">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onMenu={() => setMenuOpen(true)} alertCount={1} />

                <main className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
                    <section className="grid gap-5 xl:grid-cols-12">
                        <div
                            className="glass-panel animate-fade-up h-[420px] rounded-2xl p-1.5 sm:h-[500px] xl:col-span-8"
                            style={{ animationDelay: "60ms" }}
                        >
                            <MapView readings={readings} />
                        </div>

                        <div className="grid content-start gap-4 sm:grid-cols-3 xl:col-span-4 xl:grid-cols-1">
                            {Object.values(sensors).map((sensor, index) => (
                                <div
                                    key={sensor.key}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${140 + index * 80}ms` }}
                                >
                                    <SensorCard sensor={sensor} value={readings[sensor.key]} history={history[sensor.key]} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-3">
                        <Kpi
                            icon={ShieldIcon}
                            label="Calidad general"
                            value={`${quality.score}% · ${quality.worst}`}
                            hint="Índice compuesto de las 3 variables"
                            accent={quality.score > 90 ? "#34d399" : quality.score > 70 ? "#fbbf24" : "#fb7185"}
                            delay="220ms"
                        />
                        <Kpi
                            icon={SparkIcon}
                            label="Muestras hoy"
                            value={`${samples.toLocaleString("es-CO")}`}
                            hint="Lecturas enviadas por el nodo"
                            accent="#22d3ee"
                            delay="280ms"
                        />
                        <Kpi
                            icon={WavesIcon}
                            label="Ubicación del sensor"
                            value={node.shortName}
                            hint={`${node.lat.toFixed(3)}, ${node.lng.toFixed(3)}`}
                            accent="#a78bfa"
                            delay="340ms"
                        />
                    </section>

                    <section className="grid gap-5 lg:grid-cols-5">
                        <div className="animate-fade-up lg:col-span-3" style={{ animationDelay: "400ms" }}>
                            <AlertList />
                        </div>

                        <div
                            className="animate-fade-up glass-panel relative overflow-hidden rounded-2xl p-5 lg:col-span-2"
                            style={{ animationDelay: "460ms" }}
                        >
                            <div className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-cyan-500/12 blur-3xl" />
                            <h2 className="relative flex items-center gap-2 text-sm font-semibold text-white">
                                <ClockIcon className="size-4 text-cyan-300" />
                                Resumen de la estación
                            </h2>
                            <p className="relative mt-2 text-[12px] leading-relaxed text-slate-400">
                                El prototipo se encuentra instalado en el estanque del campus y reporta lecturas cada 3 segundos
                                vía Wi-Fi. El sistema evalúa pH, temperatura y conductividad contra los rangos recomendados
                                para agua dulce.
                            </p>
                            <dl className="relative mt-4 grid grid-cols-2 gap-3 text-[11px]">
                                <div className="rounded-xl bg-white/4 px-3 py-2">
                                    <dt className="text-slate-500">Intervalo</dt>
                                    <dd className="font-mono text-slate-200">3 s</dd>
                                </div>
                                <div className="rounded-xl bg-white/4 px-3 py-2">
                                    <dt className="text-slate-500">Sensores</dt>
                                    <dd className="font-mono text-slate-200">3 activos</dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </div>
    );
}
