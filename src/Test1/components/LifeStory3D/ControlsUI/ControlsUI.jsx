// src/components/LifeStory3D/ControlsUI/ControlsUI.jsx
import React from "react";
import "./ControlsUI.scss";

export default function ControlsUI({ onPrev = () => { }, onNext = () => { } }) {
    return (
        <div className="controls-ui">
            <button onClick={onPrev} className="ctrl">Prev</button>
            <button onClick={onNext} className="ctrl">Next</button>
        </div>
    );
}
