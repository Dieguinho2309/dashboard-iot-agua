import { useState,useEffect } from "react";
import MapView from "./components/MapView"
import { SensorCard } from "./components/SensorCard";



export default function app(){

  // como no hemos conectado con el backend pues vamos a hacer que varien los valores de las cards

  const [ph, setPh] = useState(7.2);
  const [temp, setTemp] = useState(23.4);
  const [conductividad, setConductividad] = useState(450);

  useEffect(() => {
    const intervalo = setInterval(() =>{
      const nuevoPh = (7.0 + Math.random() * 0.5).toFixed(1); 
      const nuevaTemp = (23.0 + Math.random() * 2).toFixed(1);
      const nuevaCond = Math.floor(440 + Math.random() * 30);

      setPh(nuevoPh);
      setTemp(nuevaTemp);
      setConductividad(nuevaCond);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  return(
    <div className="flex h-screen bg-[#0B101E] text-slate-300 font-sans overflow-hidden">
      <aside className="w-64 bg-[#111827] border-r border-slate-800 p-4">
        <div className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <span></span> AquaMagdalena
        </div>
        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 bg-blue-600/20 text-blue-400 p-3 rounded-lg font-medium transition-colors"> Panel Principal </a>
          <a href="#" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white p-3 rounded-lg transition-colors">
      Analíticas
    </a>
    <a href="#" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white p-3 rounded-lg transition-colors">
      Registros
    </a>
    <a href="#" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white p-3 rounded-lg transition-colors">
      Alertas
    </a>
    <a href="#" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white p-3 rounded-lg transition-colors">
      Configuración
    </a>
        </nav>

        <div className="mt-auto p-3 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 block mb-1">Nodo ESP32</span>
          <div className="text-green-400 font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Conectado
          </div>
        </div>
        
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 flex justify-between items-center px-6 bg-[#0B101E]">
          <div>
            <h1 className="text-white font-bold text-lg">Panel IoT - Universidad Del Magdalena</h1>
            <span className="text-xs text-slate-500">Monitoreo de la calidad del agua en tiempo real</span>
          </div>

          <div>
            <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-sm border border-green-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Sistema Activo
            </span>
          </div>
        </header>

        <div className="p-6 grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-[#151D2C] border border-slate-800 rounded-xl h-[450px] overflow-hidden relative z-0">
            <MapView/>
          </div>

          <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
            <SensorCard title="Nivel de pH" value={ph} unit="" />
            <SensorCard title="Temperatura del Agua" value={temp} unit="°C" />
            <SensorCard title="Conductividad (EC)" value={conductividad} unit="µS/cm" />
          </div>

        </div>

      </main>
    </div>
  );
}
