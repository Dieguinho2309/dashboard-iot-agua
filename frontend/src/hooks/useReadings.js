import { useEffect, useState } from "react";
import { fetchSnapshot } from "../lib/api";
import { nextReading, sensorConfig, simulation } from "../data/sensors";

const keys = Object.keys(sensorConfig);

function initialState() {
    return {
        values: Object.fromEntries(keys.map((key) => [key, nextReading(key)])),
        history: Object.fromEntries(
            keys.map((key) => [key, Array.from({ length: simulation.historyPoints }, () => nextReading(key))])
        ),
        status: "loading",
        error: null
    };
}

export function useReadings() {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        let cancelled = false;

        async function tick() {
            try {
                const snapshot = await fetchSnapshot();
                if (cancelled) return;

                setState({
                    values: snapshot.values,
                    history: Object.fromEntries(
                        keys.map((key) => [
                            key,
                            snapshot.readings
                                .map((reading) => reading.values[key])
                                .filter((value) => typeof value === "number")
                        ])
                    ),
                    status: "ok",
                    error: null
                });
            } catch (err) {
                if (cancelled) return;
                setState((prev) => ({ ...prev, status: "error", error: err.message }));
            }
        }

        tick();
        const id = setInterval(tick, simulation.intervalMs);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    return state;
}
