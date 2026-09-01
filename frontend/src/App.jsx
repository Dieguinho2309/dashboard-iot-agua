import { useState } from "react"
import { SensorCard } from "./components/SensorCard"

function app(){
  return(
    <div className="min-h-screen bg-[#121826] text-white p-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4 mb-8 ">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Panel IOT - Universidad Del Magdalena</h1>
          <p className="text-gray-400 mt-1">Monitoreo de calidad del agua en tiempo real</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#1f2937] px-4 py-2 rounded-lg border border-gray-700">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">Sistema Activo</span>
        </div>
      </header>




      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SensorCard
        title="Nivel de ph"
        value="7.2"
        unit=""
        status="normal"
        />
        <SensorCard
        title="Temperatura Del Agua"
        value="23.4"
        unit="°C"
        status="normal"
        />
        <SensorCard
        title="Conductividad"
        value="450"
        unit="µS/cm"
        status="Precaucion"
        />
        
      
      </div>
    </div>
  )
}
export default app