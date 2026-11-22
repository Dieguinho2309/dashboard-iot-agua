import { useEffect, useState } from "react";
import { MenuIcon, ActivityIcon, ClockIcon } from "./Icons";
import { isMock } from "../lib/api";

function useClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return now;
}

export default function Header({ onMenu, live, status, error }) {
    const now = useClock();
    const mode = isMock ? "mock" : live ? "live" : status === "error" ? "error" : "connecting";
    const badge = {
        mock: { label: "Modo simulado", short: "Sim", tone: "amber" },
        live: { label: "Sistema activo", short: "Live", tone: "emerald" },
        error: { label: "Sin conexion", short: "Error", tone: "rose" },
        connecting: { label: "Conectando", short: "...", tone: "slate" }
    }[mode];
    const tones = {
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        slate: "border-slate-700 bg-slate-800/60 text-slate-300"
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 bg-[#0b101e]/90 px-4 backdrop-blur sm:px-6">
            <button
                type="button"
                onClick={onMenu}
                className="rounded-lg p-2 text-slate-300 hover:text-white lg:hidden"
                aria-label="Abrir menú"
            >
                <MenuIcon className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
                <h1 className="truncate text-[15px] leading-tight font-bold text-white sm:text-lg">
                    Panel IoT · Universidad del Magdalena
                </h1>
                <p className="hidden truncate text-[11px] text-slate-400 sm:block">
                    Monitoreo de la calidad del agua en tiempo real
                </p>
            </div>

            <span
                role="status"
                aria-label={badge.label}
                title={error ?? badge.label}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold md:hidden ${tones[badge.tone]}`}
            >
                <ActivityIcon className="size-3" />
                {badge.short}
            </span>

            <div className="hidden items-center gap-2 md:flex">
                <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${tones[badge.tone]}`}
                    title={error ?? undefined}
                >
                    <ActivityIcon className="size-3.5" />
                    {badge.label}
                </span>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 font-mono text-[11px] text-slate-300 tabular-nums lg:inline-flex">
                <ClockIcon className="size-3.5 text-slate-400" />
                {now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
        </header>
    );
}
