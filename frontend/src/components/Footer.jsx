import { WavesIcon, GraduationIcon } from "./Icons";
import { node } from "../data/sensors";

export default function Footer() {
    return (
        <footer className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-slate-800 px-1 pt-5 pb-6 text-[11px] text-slate-500 sm:flex-row">
            <p className="flex items-center gap-2">
                <WavesIcon className="size-4 text-cyan-400" />
                AquaMagdalena · Prototipo IoT de calidad del agua
            </p>

            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <GraduationIcon className="size-4 text-slate-600" />
                {node.place} · Diego Ovalle
            </p>

            <p className="font-mono text-slate-600">Datos simulados · prototipo académico</p>
        </footer>
    );
}