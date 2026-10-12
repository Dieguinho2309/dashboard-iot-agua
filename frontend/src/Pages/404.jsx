import { Link } from "react-router";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0b101e] px-6 text-center text-white">
            <h1 className="w-fit bg-linear-to-b from-white to-slate-500 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent sm:text-7xl">
                404
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
                La página que estás buscando no existe. Verifica la URL o regresa al inicio.
            </p>
            <Link
                to="/"
                className="rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
