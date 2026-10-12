import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./Pages/Landing";
import NotFound from "./Pages/404";

// El dashboard (y su mapa con maplibre) se carga aparte, solo al entrar.
const Dashboard = lazy(() => import("./Pages/Dashboard"));

function RouteFallback() {
    return (
        <div className="grid min-h-dvh place-items-center bg-[#0b101e] text-sm text-slate-400">
            Cargando...
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
