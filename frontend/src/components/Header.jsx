import { useEffect, useState } from "react";
import { MenuIcon, BellIcon, SearchIcon, ShieldIcon, ActivityIcon, ClockIcon } from "./Icons";

function useClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return now;
}

export default function Header({ onMenu, alertCount = 0 }) {
    const now = useClock();

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/8 bg-hull/85 px-4 backdrop-blur-xl sm:px-6">
            <button
                type="button"
                onClick={onMenu}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/5 hover:text-white lg:hidden"
                aria-label="Abrir menú"
            >
                <MenuIcon className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
                <h1 className="truncate text-[15px] leading-tight font-bold text-white sm:text-lg">
                    Panel IoT · Universidad del Magdalena
                </h1>
                <p className="hidden truncate text-[11px] text-slate-500 sm:block">
                    Monitoreo de la calidad del agua en tiempo real
                </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
                    <ActivityIcon className="size-3.5" />
                    Sistema activo
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-slate-300">
                    <ShieldIcon className="size-3.5 text-cyan-300" />
                    Seguro
                </span>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 font-mono text-[11px] text-slate-300 lg:inline-flex">
                <ClockIcon className="size-3.5 text-slate-500" />
                {now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>

            <button
                type="button"
                className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
                aria-label="Buscar"
            >
                <SearchIcon className="size-5" />
            </button>

            <button
                type="button"
                className="relative rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label={`Alertas${alertCount ? `: ${alertCount} nuevas` : ""}`}
            >
                <BellIcon className="size-5" />
                {alertCount > 0 && (
                    <span className="absolute top-1 right-1 size-2 rounded-full bg-rose-400 ring-2 ring-hull" />
                )}
            </button>

            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-slate-600 to-slate-800 text-[11px] font-bold text-white ring-1 ring-white/10">
                UdeM
            </span>
        </header>
    );
}
