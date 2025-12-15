// src/components/Shared/useScrollSnap.js
import { useEffect, useRef } from "react";

/**
 * Simple scroll snap hook that calls onNext/onPrev when user scrolls.
 * For Phase 1 it's lightweight and non-intrusive.
 */
export default function useScrollSnap({ onNext = () => { }, onPrev = () => { }, enabled = true }) {
    const last = useRef(0);
    useEffect(() => {
        if (!enabled) return;
        let ticking = false;
        const handler = (e) => {
            if (ticking) return;
            ticking = true;
            const delta = e.deltaY;
            if (Math.abs(delta) > 30) {
                if (delta > 0) onNext();
                else onPrev();
            }
            setTimeout(() => (ticking = false), 300);
        };
        window.addEventListener("wheel", handler, { passive: true });
        return () => window.removeEventListener("wheel", handler);
    }, [onNext, onPrev, enabled]);
}
