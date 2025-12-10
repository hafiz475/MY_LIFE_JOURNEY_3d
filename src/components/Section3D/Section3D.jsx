import React from "react";
import "./Section3D.scss";
import { Html } from "@react-three/drei";

export default function Section3D({
    index,
    activeIndex,
    position = [0, 0, 0],
    title,
    subtitle,
    body,
}) {
    const active = index === activeIndex;

    return (
        <group position={position}>
            <Html center className={`section-card ${active ? "active" : ""}`}>
                <div className={`card ${active ? "active" : ""}`}>
                    <div className="card-head">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2l1.5 4L18 8l-4 2-1.5 4L9 10 5 8l4.5-2L12 2z" />
                            </svg>
                        </div>

                        <div className="card-head-text">
                            <div className="title">{title}</div>
                            <div className="subtitle">{subtitle}</div>
                        </div>
                    </div>

                    <p className="body">{body}</p>
                </div>
            </Html>
        </group>
    );
}
