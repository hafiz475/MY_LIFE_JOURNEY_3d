import React from "react";

export default function TechNode({ tech, angle, radius, height, onSelect }) {
    /**
     tech = {
       id,
       name,
       icon,
       lottie,
       orbit: { radius, speed, height }
     }
    */

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = height;

    return (
        <group
            position={[x, y, z]}
            onClick={() => onSelect(tech.id)}
        >
            {/* Placeholder sphere (replace with icon plane + Lottie later) */}
            <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color={"#4fd1c5"} />
            </mesh>
        </group>
    );
}
