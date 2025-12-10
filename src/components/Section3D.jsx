// src/components/Section3D.jsx
import React from 'react';
import { Html } from '@react-three/drei';

export default function Section3D({
    position = [0, 0, 0],
    title,
    subtitle,
    body,
    className,
    index,
    activeIndex
}) {
    const isActive = index === activeIndex;

    return (
        <group position={position}>
            <Html center className={`section-card ${className}`} transform occlude>
                <div className={`card ${isActive ? 'active' : ''}`}>
                    <div className="card-head">
                        <div className="card-icon" aria-hidden>
                            {/* tiny animated spark */}
                            <svg viewBox="0 0 24 24"><path d="M12 2l1.5 4L18 8l-4 2-1.5 4L9 10 5 8l4.5-2L12 2z" /></svg>
                        </div>
                        <div className="card-head-text">
                            <h2 className="title">{title}</h2>
                            <p className="subtitle">{subtitle}</p>
                        </div>
                    </div>

                    <p className="body">{body}</p>
                </div>
            </Html>
        </group>
    );
}
