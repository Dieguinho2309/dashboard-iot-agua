import { useEffect, useState } from "react";
import { fetchHistory } from "../lib/api";

export function useHistory(hours) {
    const [state, setState] = useState({ hours: null, readings: [], status: "loading", error: null });

    useEffect(() => {
        let cancelled = false;

        fetchHistory(hours)
            .then((readings) => {
                if (!cancelled) setState({ hours, readings, status: "ok", error: null });
            })
            .catch((err) => {
                if (!cancelled) setState({ hours, readings: [], status: "error", error: err.message });
            });

        return () => {
            cancelled = true;
        };
    }, [hours]);

    const stale = state.hours !== hours;

    return {
        readings: stale ? [] : state.readings,
        status: stale ? "loading" : state.status,
        error: stale ? null : state.error
    };
}
