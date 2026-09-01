export function SensorCard({
    title = "Nivel de ph",
    value = "7,2",
    unit = "",
    status = "Normal"
}){
    return(
        <div className="bg-slate-800 p-5 rounded-xl border border-gray-700 w-full min-w-0">
            <span className="text-gray-400 text-sm">{title}</span>
            <div className="text-3xl font-bold mt-2 text-white">
                {value}{unit}
            </div>
        </div>
    );
}