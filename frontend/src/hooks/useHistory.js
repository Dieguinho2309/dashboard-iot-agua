import { useCallback, useEffect, useState } from "react";
import { fetchHistory } from "../lib/api";

export function useHistory(hours) {
    const [state, setState] = useState({ hours: null, readings: [], status: "loading", error: null });
    const [nonce, setNonce] = useState(0);

    useEffect(() => {
        let cancelled = false;

        fetchHistory(hours)
            .then((readings) => {
                if (!cancelled) setState({ hours, readings, status: "ok", error: null });
            })
            .catch((err) => {
                if (!cancelled) {
                    setState((prev) => ({ ...prev, status: "error", error: err.message }));
                }
            });

        return () => {
            cancelled = true;
        };
    }, [hours, nonce]);

    const stale = state.hours !== hours;
    const reload = useCallback(() => {
        setState((prev) => ({ ...prev, status: "loading", error: null }));
        setNonce((value) => value + 1);
    }, []);

    return {
        readings: state.readings,
        status: stale ? "loading" : state.status,
        error: stale ? null : state.error,
        stale,
        reloading: stale || state.status === "loading",
        reload
    };
}
