export default function Header() {
    return (
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
                <h1 className="text-2xl font-bold text-white">Panel IoT · Universidad del Magdalena</h1>
                <p className="mt-1 text-sm text-slate-400">Monitoreo de la calidad del agua en tiempo real</p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Sistema activo
            </span>
        </header>
    );
}
