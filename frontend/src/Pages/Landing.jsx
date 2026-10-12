import { useRef } from "react";
import { Link } from "react-router";
import {
    WavesIcon,
    GraduationIcon,
    DropletIcon,
    ThermometerIcon,
    BoltIcon,
    GithubIcon,
    CpuIcon,
    ActivityIcon,
    LayoutIcon
} from "../components/Icons";
import Waves from "../components/Waves";
import { sensorConfig } from "../data/sensors";

const GITHUB_URL = "https://github.com/Dieguinho2309/dashboard-iot-agua";

const features = [
    {
        key: "ph",
        icon: DropletIcon,
        description: "Detecta variaciones ácidas o alcalinas al instante y avisa cuando el agua sale del rango seguro."
    },
    {
        key: "temperature",
        icon: ThermometerIcon,
        description: "Vigila la temperatura del estanque y su efecto sobre el oxígeno y la vida acuática."
    },
    {
        key: "conductivity",
        icon: BoltIcon,
        description: "Mide sales y minerales disueltos para anticipar contaminación o cambios de calidad."
    }
];

const steps = [
    {
        icon: CpuIcon,
        title: "Sensores en campo",
        description: "Un nodo ESP32 con sondas de pH, temperatura y conductividad envía telemetría de forma continua."
    },
    {
        icon: ActivityIcon,
        title: "Backend y base de datos",
        description: "Una API en Node recibe cada lectura y PostgreSQL la guarda con hora del dispositivo y del servidor."
    },
    {
        icon: LayoutIcon,
        title: "Panel en vivo",
        description: "El dashboard muestra mapa, gráficas por sensor y alertas cuando una medición sale de rango."
    }
];

export default function Landing() {
    const comoFuncionaRef = useRef(null);

    function handleScrollToSection(event) {
        event.preventDefault();
        const target = comoFuncionaRef.current;
        if (!target) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }

    return (
        <div className="min-h-dvh bg-[#0b101e] text-slate-300">
            <header className="absolute  inset-x-0 top-0 z-30">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
                    <Link to="/" className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                        AquaMagdalena
                    </Link>

                    <Link
                        to="/dashboard"
                        className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-white sm:text-sm"
                    >
                        Entrar
                    </Link>
                </nav>
            </header>

            <section className="relative flex min-h-dvh flex-col overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-56 h-136 w-136 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[130px]" />
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pt-24 pb-44 text-center sm:pt-28 sm:pb-64">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-cyan-200">
                        <GraduationIcon className="size-3.5" />
                        Universidad del Magdalena · Proyecto IoT
                    </span>

                    <h1 className="mt-6 bg-linear-to-b from-white to-slate-500 bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent pb-2 sm:text-6xl md:text-7xl lg:text-8xl">
                        AquaMagdalena
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                        Monitoreo de calidad del agua en tiempo real. Sensores ESP32, telemetría continua y alertas
                        inteligentes en un solo panel.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/dashboard"
                            className="rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
                        >
                            Entrar al dashboard
                        </Link>

                        <a
                            href="#como-funciona"
                            onClick={handleScrollToSection}
                            className="cursor-pointer rounded-full border border-slate-700 px-7 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
                        >
                            Conocer el proyecto
                        </a>

                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-slate-400 transition hover:text-white"
                        >
                            <GithubIcon className="size-4" />
                            GitHub
                        </a>
                    </div>
                </div>

                <Waves className="h-32 sm:h-56" />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-linear-to-b from-transparent to-[#0b101e] sm:h-56"
                />
            </section>

            <section className="relative z-10 px-6 py-20 sm:py-28">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Tres mediciones, una sola vista
                        </h2>
                        <p className="mt-3 text-slate-400">
                            Cada lectura se compara automáticamente con el rango óptimo para agua dulce.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 sm:grid-cols-3">
                        {features.map(({ key, icon: Icon, description }) => {
                            const sensor = sensorConfig[key];

                            return (
                                <article
                                    key={key}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700"
                                >
                                    <span
                                        className="grid size-11 place-items-center rounded-xl"
                                        style={{ backgroundColor: `${sensor.color}1f`, color: sensor.color }}
                                    >
                                        <Icon className="size-5" />
                                    </span>

                                    <h3 className="mt-4 text-lg font-semibold text-white">{sensor.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                                    <p className="mt-4 text-xs font-medium" style={{ color: sensor.color }}>
                                        Óptimo {sensor.optimal[0]}–{sensor.optimal[1]} {sensor.unit}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section
                id="como-funciona"
                ref={comoFuncionaRef}
                className="relative z-10 scroll-mt-24 border-t border-slate-800/60 bg-[#0a0e1a] px-6 py-20 sm:py-28"
            >
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">De la sonda al panel</h2>
                        <p className="mt-3 text-slate-400">
                            La telemetría viaja del estanque al navegador en tres pasos.
                        </p>
                    </div>

                    <ol className="mt-12 grid gap-5 sm:grid-cols-3">
                        {steps.map(({ icon: Icon, title, description }, index) => (
                            <li key={title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                                <span className="grid size-11 place-items-center rounded-xl bg-slate-800 text-cyan-300">
                                    <Icon className="size-5" />
                                </span>
                                <span className="mt-4 block font-mono text-xs text-slate-500">
                                    Paso {index + 1}
                                </span>
                                <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20 sm:py-28">
                <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 to-[#0e1b30] p-10 text-center sm:p-14">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Listo para monitorear</h2>
                    <p className="mx-auto mt-3 max-w-xl text-slate-400">
                        Explora el panel con lecturas simuladas mientras el nodo ESP32 entra en línea.
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-8 inline-flex rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
                    >
                        Entrar al dashboard
                    </Link>
                </div>
            </section>

            <footer className="relative z-10 border-t border-slate-800 px-6 py-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
                    <p className="flex items-center gap-2">
                        <WavesIcon className="size-4 text-cyan-400" />
                        AquaMagdalena · Prototipo IoT de calidad del agua
                    </p>
                    <p className="flex items-center gap-2">
                        <GraduationIcon className="size-4 text-slate-600" />
                        Universidad del Magdalena · Diego Ovalle
                    </p>
                    <p className="font-mono">Datos simulados · prototipo académico</p>
                </div>
            </footer>
        </div>
    );
}
