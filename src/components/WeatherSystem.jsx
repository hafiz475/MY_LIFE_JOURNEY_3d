import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function WeatherSystem({ active }) {
    const rainGeo = useRef();

    // Screen Droplets State
    const [drops, setDrops] = useState([]);

    // Manage Screen Droplets spawning
    useEffect(() => {
        if (!active) {
            setDrops([]); // Clear drops if stopped
            return;
        }

        const interval = setInterval(() => {
            const id = Date.now();
            setDrops(prev => [
                ...prev,
                { id, left: Math.random() * 100 } // Random horizontal position
            ]);

            // Cleanup old drops (after 2s animation)
            setTimeout(() => {
                setDrops(prev => prev.filter(d => d.id !== id));
            }, 2000);

        }, 300); // New drop every 300ms

        return () => clearInterval(interval);
    }, [active]);

    // Create Rain Geometry once (Memoized to persist across renders)
    // Fixes the "disappearing rain" bug where array reset to zeros
    const { rainPositions, rainVelocities } = useMemo(() => {
        const count = 1500;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = Math.random() * 40 - 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            velocities[i] = 0.5 + Math.random() * 0.5;
        }

        return { rainPositions: positions, rainVelocities: velocities };
    }, []);

    useFrame((state, delta) => {
        if (!active || !rainGeo.current) return;

        const positions = rainGeo.current.attributes.position.array;

        for (let i = 0; i < 1500; i++) {
            // Move down
            positions[i * 3 + 1] -= rainVelocities[i];

            // Reset if too low
            if (positions[i * 3 + 1] < -10) {
                positions[i * 3 + 1] = 20;
                positions[i * 3] = (Math.random() - 0.5) * 40 + state.camera.position.x;
            }
        }

        rainGeo.current.attributes.position.needsUpdate = true;
    });

    return (
        <group>
            {/* 3D Rain Particles */}
            {active && (
                <points>
                    <bufferGeometry ref={rainGeo}>
                        <bufferAttribute
                            attach="attributes-position"
                            count={1500}
                            itemSize={3}
                            array={rainPositions}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        color="#aaaaaa"
                        size={0.15}
                        transparent
                        opacity={0.8}
                        sizeAttenuation={true}
                    />
                </points>
            )}

            {/* 2D Screen Droplets Overlay */}
            {active && (
                <Html fullscreen style={{ pointerEvents: 'none', overflow: 'hidden' }}>
                    <div className="rain-overlay-container" style={{ width: '100%', height: '100%' }}>
                        {drops.map(d => (
                            <div
                                key={d.id}
                                className="water-drop"
                                style={{ left: `${d.left}%` }}
                            />
                        ))}
                    </div>
                </Html>
            )}
        </group>
    );
}
