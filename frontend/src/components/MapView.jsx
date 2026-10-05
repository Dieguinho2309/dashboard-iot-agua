import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { node } from '../data/sensors';

const position = [node.lat, node.lng];

const nodeMarker = L.divIcon({
    className: 'node-marker',
    html: '<span></span>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
});

export default function MapView() {
    return (
        <MapContainer center={position} zoom={16} scrollWheelZoom className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> · HERE · Garmin · &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                maxNativeZoom={16}
            />

            <Marker position={position} icon={nodeMarker}>
                <Popup>
                    <p className="text-sm font-semibold text-white">{node.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{node.place}</p>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
