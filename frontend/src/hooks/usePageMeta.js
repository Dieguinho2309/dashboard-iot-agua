import { useEffect, useRef } from "react";

export function usePageMeta(title) {
    const headingRef = useRef(null);

    useEffect(() => {
        document.title = `${title} · AquaMagdalena`;
        if (headingRef.current) headingRef.current.focus();
    }, [title]);

    return headingRef;
}
