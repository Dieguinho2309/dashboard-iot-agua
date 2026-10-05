import Header from "./components/Header";
import MapView from "./components/MapView";
import { SensorCard } from "./components/SensorCard";

export default function App() {
    return (
        <div className="min-h-screen bg-[#0b101e] text-slate-300">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <Header />

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="h-[440px] overflow-hidden rounded-lg border border-slate-800 lg:col-span-2">
                        <MapView />
                    </div>

                    <div className="flex flex-col gap-4">
                        <SensorCard title="Nivel de pH" value="7.2" unit="" />
                        <SensorCard title="Temperatura del agua" value="23.4" unit="°C" />
                        <SensorCard title="Conductividad" value="450" unit="µS/cm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
