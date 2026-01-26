// src/components/LifeStory3D/HeroHub/HeroHub.jsx
import React from "react";
import { Text, Html } from "@react-three/drei";
import "./HeroHub.scss";

export default function HeroHub({ name = "J Md Hafizur Rahman", position = [0, 1, 0] }) {
    return (
        <group position={position} name="HeroHub">
            <mesh name="hub-core">
                <sphereGeometry args={[0.5, 48, 48]} />
                <meshStandardMaterial metalness={0.18} roughness={0.10} envMapIntensity={0.6} color={"#fbfdff"} />
            </mesh>

            {/* thin glass ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
                <torusGeometry args={[0.82, 0.02, 16, 120]} />
                <meshStandardMaterial transparent opacity={0.78} roughness={0.03} metalness={0.12} color={"#e6f6ff"} />
            </mesh>

            {/* small accent dot near the hub */}
            <mesh position={[0.78, 0.18, 0.22]}>
                <sphereGeometry args={[0.035, 12, 12]} />
                <meshStandardMaterial emissive={"#61dafb"} emissiveIntensity={0.9} color={"#ffffff"} />
            </mesh>

            <Text position={[0, 0.95, 0]} font={`${import.meta.env.BASE_URL}assets/fonts/Inter-Bold.woff`} fontSize={0.12} maxWidth={2.2} textAlign="center" anchorX="center" anchorY="middle" color="#0f172a">
                {name}
            </Text>

            <Html position={[0, 0.78, 0]} center>
                <div className="hub-subtitle">Full-stack engineer • React · Node · Systems</div>
            </Html>
        </group>
    );
}
