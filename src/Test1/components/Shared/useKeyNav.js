// src/components/Shared/useKeyNav.js
import { useEffect } from "react";

/**
 * Simple keyboard navigation hook. Callbacks for left/right/home.
 */
export default function useKeyNav({ onLeft = () => { }, onRight = () => { }, onHome = () => { } }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "ArrowLeft") onLeft();
            if (e.key === "ArrowRight") onRight();
            if (e.key === "Home" || e.key === "h" || e.key === "H") onHome();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onLeft, onRight, onHome]);
}
