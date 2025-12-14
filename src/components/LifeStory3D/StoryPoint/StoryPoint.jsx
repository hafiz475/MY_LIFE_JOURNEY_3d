// src/components/LifeStory3D/StoryPoint/StoryPoint.jsx
import React from "react";
import { Text, Html } from "@react-three/drei";
import LottieFallback from "../../Shared/LottieFallback";
import "./StoryPoint.scss";

export default function StoryPoint({ item, active = false, onSelect = () => { } }) {
    const plateColor = active ? "#ffffff" : "#fbfdff";
    const accent = active ? "rgba(6, 95, 212, 0.08)" : "rgba(15,23,42,0.02)";

    return (
        <group position={item.position} rotation={item.rotation} name={`story-${item.id}`} onClick={() => onSelect(item.id)}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.45, 0.52, 0.04]} />
                <meshStandardMaterial color={plateColor} metalness={0.03} roughness={0.08} />
            </mesh>

            <mesh position={[0, 0.28, 0.03]}>
                <boxGeometry args={[1.05, 0.06, 0.02]} />
                <meshStandardMaterial color={accent} transparent opacity={0.9} />
            </mesh>

            <Text position={[-0.62, 0.10, 0.05]} font="/fonts/Inter-Bold.woff" fontSize={0.075} maxWidth={1.05} anchorX="left" anchorY="top" color="#0f172a">
                {item.title}
            </Text>

            <Text position={[-0.62, -0.02, 0.05]} font="/fonts/Inter-Regular.woff" fontSize={0.045} maxWidth={1.05} anchorX="left" anchorY="top" color={"rgba(15,23,42,0.7)"}>
                {item.subtitle}
            </Text>

            <Html position={[-0.62, -0.18, 0.05]} transform occlude>
                <div className={`story-body ${active ? "active" : ""}`}>{item.text.trim().slice(0, 140)}{item.text.length > 140 ? "…" : ""}</div>
            </Html>

            <Html position={[0.65, 0.12, 0.05]} distanceFactor={5} transform>
                <div style={{ width: 54, height: 54 }}>
                    <LottieFallback src={item.icon} style={{ width: "100%", height: "100%" }} />
                </div>
            </Html>
        </group>
    );
}
