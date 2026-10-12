import '../lib/maplibre';
import { useEffect, useRef, useState } from 'react';
import { Map as MapGL, NavigationControl, Marker, Popup } from 'maplibre-gl';
import { node } from '../data/sensors';

const POSITRON_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
const DARK_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

const LABEL_LAYERS = [
    'label_other',
    'label_village',
    'label_town',
    'label_state',
    'label_city',
    'label_city_capital',
    'label_country_3',
    'label_country_2',
    'label_country_1',
    'highway-name-path',
    'highway-name-minor',
    'highway-name-major',
    'airport'
];

/** Look L3: paleta clara gris-azulada sobre el estilo Positron de OpenFreeMap. */
const PALETTE = {
    background: '#ccd6df',
    park: '#c6d2c9',
    water: '#b6c8d6',
    waterway: '#9db6c7',
    waterName: '#2f5f86',
    residential: '#c4cfd9',
    wood: '#bcc9c2',
    building: '#c9d3dc',
    buildingOutline: '#b3bfca',
    roadMinor: '#dde4ea',
    roadPath: '#ced7df',
    roadCasing: '#a9b6c2',
    roadInner: '#f4f7fa',
    label: '#2a3646',
    labelHalo: '#f1f5f9'
};

function buildOverrides(p) {
    const overrides = {
        background: { 'background-color': p.background },
        park: { 'fill-color': p.park },
        water: { 'fill-color': p.water },
        waterway: { 'line-color': p.waterway },
        landuse_residential: { 'fill-color': p.residential },
        landcover_wood: { 'fill-color': p.wood },
        building: { 'fill-color': p.building, 'fill-outline-color': p.buildingOutline },
        highway_minor: { 'line-color': p.roadMinor },
        highway_path: { 'line-color': p.roadPath },
        highway_major_casing: { 'line-color': p.roadCasing },
        highway_major_subtle: { 'line-color': p.roadMinor },
        highway_major_inner: { 'line-color': p.roadInner },
        highway_motorway_casing: { 'line-color': p.roadCasing },
        highway_motorway_bridge_casing: { 'line-color': p.roadCasing },
        tunnel_motorway_casing: { 'line-color': p.roadCasing },
        waterway_line_label: { 'text-color': p.waterName },
        water_name_point_label: { 'text-color': p.waterName },
        water_name_line_label: { 'text-color': p.waterName }
    };

    for (const id of LABEL_LAYERS) {
        overrides[id] = { 'text-color': p.label, 'text-halo-color': p.labelHalo };
    }

    return overrides;
}

let stylePromise;

/** Descarga (una sola vez) el style de Positron y le aplica la paleta clara. */
function buildLightStyle() {
    if (!stylePromise) {
        stylePromise = fetch(POSITRON_STYLE_URL).then((res) => {
            if (!res.ok) throw new Error(`No se pudo cargar el estilo del mapa (${res.status})`);
            return res.json();
        });
    }

    return stylePromise.then((style) => {
        const overrides = buildOverrides(PALETTE);
        const layers = style.layers.map((layer) => {
            const paint = overrides[layer.id];
            if (!paint) return layer;
            return { ...layer, paint: { ...layer.paint, ...paint } };
        });

        return { ...style, layers };
    });
}

/** Vineta para "asentar" el mapa claro en la tarjeta oscura. */
function MapVignette() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_12px_rgba(11,16,30,0.55)]"
        />
    );
}

export default function MapView() {
    const containerRef = useRef(null);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let map;

        const init = async () => {
            const style = dark ? DARK_STYLE_URL : await buildLightStyle();
            if (cancelled || !containerRef.current) return;

            map = new MapGL({
                container: containerRef.current,
                style,
                center: [node.lng, node.lat],
                zoom: 16,
                attributionControl: false
            });

            map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

            const el = document.createElement('span');
            el.className = 'pulse-marker';

            const popup = new Popup({ offset: 18 }).setHTML(
                `<p style="font-weight:600">${node.name}</p><p style="margin-top:2px;color:#94a3b8">${node.place}</p>`
            );

            new Marker({ element: el }).setLngLat([node.lng, node.lat]).setPopup(popup).addTo(map);
        };

        init();

        return () => {
            cancelled = true;
            if (map) map.remove();
        };
    }, [dark]);

    return (
        <div className="relative h-full w-full">
            <div ref={containerRef} className="h-full w-full" />

            {!dark && <MapVignette />}

            <button
                type="button"
                onClick={() => setDark((value) => !value)}
                className="absolute bottom-3 left-3 z-10 rounded-lg border border-slate-700/60 bg-[#0b101e]/80 px-3 py-1.5 text-[11px] font-semibold text-slate-200 backdrop-blur transition hover:border-cyan-400/50 hover:text-white"
            >
                {dark ? 'Tema claro' : 'Tema oscuro'}
            </button>
        </div>
    );
}
