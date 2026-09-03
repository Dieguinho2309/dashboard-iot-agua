export function SensorCard({
    title,
    value,
    unit,
    status
}){
    return(
        <div className="bg-slate-800 p-5 rounded-xl border border-gray-700 w-full min-w-0 overflow-hidden">
            <span className="text-gray-400 text-sm break-words">{title}</span>
            <div className="text-3xl font-bold mt-2 text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {value}{unit}
            </div>
        </div>
    );
}