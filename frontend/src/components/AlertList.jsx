import { alerts } from "../data/sensors";
import { BellIcon, ShieldIcon, ActivityIcon, ArrowUpRightIcon } from "./Icons";

const levelStyles = {
    success: { dot: "bg-emerald-400", chip: "text-emerald-300", icon: ActivityIcon },
    info: { dot: "bg-cyan-400", chip: "text-cyan-300", icon: ShieldIcon },
    warning: { dot: "bg-amber-400", chip: "text-amber-300", icon: BellIcon }
};

export default function AlertList() {
    const visible = alerts.slice(0, 3);

    return (
        <section className="glass-panel relative overflow-hidden rounded-2xl">
            <header className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-cyan-400/12 text-cyan-300 ring-1 ring-cyan-400/20">
                        <BellIcon className="size-4" />
                    </span>
                    <div>
                        <h2 className="text-sm font-semibold text-white">Actividad reciente</h2>
                        <p className="text-[11px] text-slate-500">Últimos eventos del nodo</p>
                    </div>
                </div>
                <a
                    href="#"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300 transition hover:text-cyan-200"
                >
                    Ver todo
                    <ArrowUpRightIcon className="size-3.5" />
                </a>
            </header>

            <ul className="divide-y divide-white/6">
                {visible.map((alert) => {
                    const style = levelStyles[alert.level] ?? levelStyles.info;
                    const Icon = style.icon;

                    return (
                        <li key={alert.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/3">
                            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${style.dot} shadow-[0_0_10px_currentColor]`} />
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-1.5 text-[13px] font-medium text-slate-200">
                                    <Icon className={`size-3.5 shrink-0 ${style.chip}`} />
                                    {alert.title}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{alert.detail}</p>
                            </div>
                            <span className="shrink-0 font-mono text-[10px] whitespace-nowrap text-slate-600">{alert.time}</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
