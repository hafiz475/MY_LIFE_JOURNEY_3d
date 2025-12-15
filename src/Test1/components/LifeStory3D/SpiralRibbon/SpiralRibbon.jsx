// src/components/LifeStory3D/SpiralRibbon/SpiralRibbon.jsx
import React, { useMemo } from "react";
import * as THREE from "three";

export default function SpiralRibbon({
    turns = 1.1,
    points = 120,
    innerRadius = 1.2,
    height = 1.6,
    thickness = 0.06,
    color = "#f3f4f6",
    position = [0, 0.5, 0],
}) {
    const curve = useMemo(() => {
        class HelixCurve extends THREE.Curve {
            constructor(scale = 1) { super(); this.scale = scale; }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const theta = t * Math.PI * 2 * turns;
                const radius = innerRadius + t * 0.9;
                const x = Math.cos(theta) * radius;
                const y = t * height;
                const z = Math.sin(theta) * radius;
                return optionalTarget.set(x * this.scale, y * this.scale, z * this.scale);
            }
        }
        return new HelixCurve();
    }, [turns, innerRadius, height]);

    const geometry = useMemo(() => new THREE.TubeGeometry(curve, points, thickness, 8, false), [curve, points, thickness]);

    return (
        <group position={position} name="SpiralRibbon">
            <mesh geometry={geometry}>
                <meshStandardMaterial color={color} metalness={0.03} roughness={0.06} transparent opacity={0.95} />
            </mesh>
        </group>
    );
}
