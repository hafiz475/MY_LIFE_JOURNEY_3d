import React from "react";
import "./HomeOverlay.scss";

export default function HomeOverlay({ onHome, activeSection }) {
    return (
        <div className="home-overlay">
            <button className="home-btn" onClick={onHome}>
                Home
            </button>

            <div className="section-label">
                {activeSection}
            </div>
        </div>
    );
}
