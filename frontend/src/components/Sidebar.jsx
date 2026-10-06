import { WavesIcon, LayoutIcon, CloseIcon, CpuIcon, WifiIcon } from "./Icons";
import { node } from "../data/sensors";

const navItems = [{ label: "Panel Principal", icon: LayoutIcon, active: true }];

export default function Sidebar({ open, onClose }) {
    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[270px] shrink-0 flex-col border-r border-slate-800 bg-[#0a0f1c] transition-transform duration-300 lg:static lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center gap-3 px-5 py-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 text-white">
                        <WavesIcon className="size-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] leading-tight font-bold text-white">AquaMagdalena</p>
                        <p className="truncate text-[11px] text-slate-500">Calidad del agua · IoT</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-white lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <CloseIcon className="size-5" />
                    </button>
                </div>

                <p className="px-5 pb-2 text-[10px] font-semibold tracking-[0.14em] text-slate-600 uppercase">Navegación</p>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                    {navItems.map(({ label, icon: Icon, active }) => (
                        <a
                            key={label}
                            href="#"
                            onClick={onClose}
                            aria-current={active ? "page" : undefined}
                            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                                active ? "bg-cyan-500/15 text-cyan-200" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-cyan-400" />}
                            <Icon className={`size-5 shrink-0 ${active ? "text-cyan-300" : "text-slate-500"}`} />
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="p-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                        <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                                <CpuIcon className="size-4 text-cyan-300" />
                                {node.shortName}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
                                <span className="size-1.5 rounded-full bg-emerald-400" />
                                Online
                            </span>
                        </div>

                        <dl className="mt-3 space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between">
                                <dt className="text-slate-500">Estado</dt>
                                <dd className="flex items-center gap-1 text-slate-300">
                                    <WifiIcon className="size-3 text-emerald-400" /> Conectado
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-slate-500">Uptime</dt>
                                <dd className="font-mono text-slate-300 tabular-nums">{node.uptime}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-slate-500">Firmware</dt>
                                <dd className="font-mono text-slate-300">{node.firmware}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </aside>
        </>
    );
}
