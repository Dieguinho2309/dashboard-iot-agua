import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;



export default function MapView(){
    const position = [11.22569,-74.18605]
    return( 
        <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: "100%", minHeight: "450px", width: "100%" }}
        >
        <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
            <Popup>
            Prototipo IoT - Calidad del Agua
            </Popup>
        </Marker>
        </MapContainer>
    );
}
