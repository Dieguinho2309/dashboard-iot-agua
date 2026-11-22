import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./Pages/Landing";
import NotFound from "./Pages/404";

// Cada pagina pesada se carga aparte; el mapa solo entra con el dashboard.
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Historial = lazy(() => import("./Pages/Historial"));
const SensorDetalle = lazy(() => import("./Pages/SensorDetalle"));
const Alertas = lazy(() => import("./Pages/Alertas"));

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
                    <Route path="/historial" element={<Historial />} />
                    <Route path="/historial/:sensorKey" element={<SensorDetalle />} />
                    <Route path="/alertas" element={<Alertas />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
