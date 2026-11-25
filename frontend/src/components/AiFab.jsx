import { Link } from "react-router";
import { SparkIcon } from "./Icons";

export default function AiFab() {
    return (
        <Link
            to="/ai-chat"
            aria-label="Abrir la proyección del asistente IA"
            title="Asistente IA · proyección"
            className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/50 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:right-6 sm:bottom-6"
        >
            <SparkIcon className="size-5" />
            <span className="hidden sm:inline">Asistente IA</span>
            <span className="hidden rounded-full bg-slate-950/20 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase sm:inline">
                Proyección
            </span>
        </Link>
    );
}
