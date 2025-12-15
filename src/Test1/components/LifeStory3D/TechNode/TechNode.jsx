// src/components/LifeStory3D/TechNode/TechNode.jsx
import React from "react";
import { Html } from "@react-three/drei";

/**
 * TechNode - shows a small colored orb and an optional icon (HTML img)
 * Props:
 *  - tech: { id, name, icon, lottie, orbit, color }
 *  - angle, radius, height
 */
export default function TechNode({ tech, angle = 0, radius = 2.4, height = 0.6, onSelect = () => { } }) {
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height;

    const color = tech.color || "#a5b4fc";

    return (
        <group position={[x, y, z]} onClick={() => onSelect(tech.id)} name={`tech-${tech.id}`}>
            {/* colored marker sphere */}
            <mesh>
                <sphereGeometry args={[0.10, 12, 12]} />
                <meshStandardMaterial color={color} metalness={0.12} roughness={0.28} />
            </mesh>

            {/* small icon thumbnail using Html — crisp at any distance */}
            {tech.icon && (
                <Html position={[0, 0.22, 0]} distanceFactor={4} center>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 20px rgba(12,16,24,0.06)",
                        border: "1px solid rgba(15,23,42,0.04)",
                    }}>
                        <img src={tech.icon} alt={tech.name} style={{ width: 26, height: 26, objectFit: "contain" }} />
                    </div>
                </Html>
            )}
        </group>
    );
}
