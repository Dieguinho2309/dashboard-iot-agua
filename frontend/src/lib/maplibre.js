import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';

// maplibre-gl v6 resuelve el worker relativo a import.meta.url, que con Vite
// apunta a un archivo inexistente. Aqui le pasamos la URL que Vite si emite.
setWorkerUrl(workerUrl);
