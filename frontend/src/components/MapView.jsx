import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { nodePosition, node } from "../data/sensors";
import { MapPinIcon, ClockIcon, WavesIcon, DropletIcon } from "./Icons";

const sensorIcon = L.divIcon({
    className: "sensor-marker",
    html: '<span class="sensor-marker__pulse"></span><span class="sensor-marker__core"></span>',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -18]
});

function MapChrome() {
    const map = useMap();

    useEffect(() => {
        map.attributionControl.setPrefix(false);
    }, [map]);

    return null;
}

export default function MapView({ readings = {} }) {
    const overlay = useMemo(
        () =>
            "pointer-events-none absolute inset-0 z-[400] rounded-2xl shadow-[inset_0_0_120px_40px_rgba(6,11,22,0.85)]",
        []
    );

    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <MapContainer
                center={nodePosition}
                zoom={16}
                zoomControl
                scrollWheelZoom
                className="h-full w-full"
            >
                <TileLayer
                    attribution={
                        '&copy; <a href="https://www.esri.com/">Esri</a> · HERE · Garmin · ' +
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    maxNativeZoom={16}
                    maxZoom={19}
                    keepBuffer={3}
                />

                <Marker position={nodePosition} icon={sensorIcon}>
                    <Popup>
                        <div className="p-3.5">
                            <div className="flex items-start gap-2.5">
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25">
                                    <MapPinIcon className="size-4" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[13px] leading-tight font-semibold text-white">{node.name}</p>
                                    <p className="text-[10px] text-slate-400">{node.place}</p>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-1.5">
                                <div className="rounded-lg bg-white/5 px-2 py-1.5">
                                    <p className="text-[9px] tracking-wide text-slate-400 uppercase">pH</p>
                                    <p className="font-mono text-[13px] font-semibold text-cyan-300 tabular-nums">
                                        {Number(readings.ph ?? 0).toFixed(1)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white/5 px-2 py-1.5">
                                    <p className="text-[9px] tracking-wide text-slate-400 uppercase">Temp.</p>
                                    <p className="font-mono text-[13px] font-semibold text-amber-300 tabular-nums">
                                        {Number(readings.temperature ?? 0).toFixed(1)}°C
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center gap-3 border-t border-white/8 pt-2 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="size-3" /> En vivo
                                </span>
                                <span className="flex items-center gap-1">
                                    <WavesIcon className="size-3" />
                                    {Number(readings.conductivity ?? 0).toFixed(0)} µS/cm
                                </span>
                                <span className="ml-auto flex items-center gap-1 text-emerald-400">
                                    <DropletIcon className="size-3" /> OK
                                </span>
                            </div>
                        </div>
                    </Popup>
                </Marker>

                <MapChrome />
            </MapContainer>

            <div className={overlay} />

            <div className="pointer-events-none absolute top-3 left-3 z-500 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0f1c]/85 px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur">
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                    </span>
                    Monitoreo en vivo
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0a0f1c]/85 px-3 py-1.5 font-mono text-[11px] text-slate-300 backdrop-blur">
                    <MapPinIcon className="size-3.5 text-cyan-400" />
                    {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                </span>
            </div>

            <div className="pointer-events-none absolute right-3 bottom-8 z-500 hidden rounded-xl border border-white/10 bg-[#0a0f1c]/85 px-3 py-2 backdrop-blur sm:block">
                <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-300 uppercase">Calidad del agua</p>
                <ul className="space-y-1 text-[10px] text-slate-400">
                    <li className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-400" /> Óptimo
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-400" /> Alerta
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-rose-400" /> Crítico
                    </li>
                </ul>
            </div>
        </div>
    );
}
