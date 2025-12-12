import React from "react";
import "./ControlsUI.scss";

export default function ControlsUI({ onPrev, onNext }) {
    return (
        <div className="controls-ui">
            <button onClick={onPrev}>Prev</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
}
