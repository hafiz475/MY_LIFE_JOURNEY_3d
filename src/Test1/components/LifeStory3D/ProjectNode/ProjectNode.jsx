// src/components/LifeStory3D/ProjectNode/ProjectNode.jsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ProjectNode: smaller planet + logo plane + subtle ring
 */
export default function ProjectNode({ project, active = false, onSelect = () => { } }) {
    let logoTexture = null;
    try {
        if (project.logo) logoTexture = useLoader(THREE.TextureLoader, project.logo);
    } catch (e) {
        logoTexture = null;
    }

    const planetColor = active ? "#ffffff" : "#fbfdff";

    return (
        <group position={project.position} rotation={project.rotation} onClick={() => onSelect(project.id)} name={`project-${project.id}`}>
            {/* planet */}
            <mesh>
                <sphereGeometry args={[0.38, 32, 32]} />
                <meshStandardMaterial color={planetColor} metalness={0.06} roughness={0.08} />
            </mesh>

            {/* subtle glow ring (torus) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <torusGeometry args={[0.62, 0.02, 8, 120]} />
                <meshStandardMaterial color={"#e6f6ff"} emissive={"#e6f6ff"} emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>

            {/* logo plane */}
            <group position={[0, 0.48, 0]}>
                <mesh>
                    <planeGeometry args={[0.66, 0.30]} />
                    <meshStandardMaterial
                        map={logoTexture}
                        transparent
                        opacity={logoTexture ? 1 : 0.92}
                        color={logoTexture ? undefined : "#f3f4f6"}
                    />
                </mesh>
            </group>

            {/* small summary card */}
            <group position={[0, -0.6, 0]}>
                <mesh>
                    <boxGeometry args={[0.82, 0.2, 0.02]} />
                    <meshStandardMaterial color={"#fbfdff"} metalness={0.02} roughness={0.06} />
                </mesh>
            </group>
        </group>
    );
}
