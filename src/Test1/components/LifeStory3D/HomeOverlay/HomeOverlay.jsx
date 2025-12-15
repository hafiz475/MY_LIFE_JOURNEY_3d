// src/components/LifeStory3D/HomeOverlay/HomeOverlay.jsx
import React from "react";
import "./HomeOverlay.scss";

export default function HomeOverlay({ onHome = () => { }, activeSection = null }) {
    return (
        <div className="home-overlay">
            <div className="left">
                <button className="home-btn" onClick={onHome}>Home</button>
            </div>

            <div className="center">
                <div className="small-hint">ArcHub · Orbits</div>
            </div>

            <div className="right">
                <div className="active-label">{activeSection || "Overview"}</div>
            </div>
        </div>
    );
}
