import { useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function PhoneModel({ onClick }) {
    const groupRef = useRef();
    const dotRef = useRef();
    const { scene } = useGLTF('/assets/models/phone_free.glb');

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle floating animation
            groupRef.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.005;
        }
        // Pulsing dot animation
        if (dotRef.current) {
            const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
            dotRef.current.scale.setScalar(pulse);
            dotRef.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.02}>
            <group
                ref={groupRef}
                position={[1.6, -1.2, 0.6]}
                rotation={[-Math.PI / 2, 0, -0.1]}
                scale={0.12}
                onClick={onClick}
            >
                <primitive object={scene} />

                {/* Pulsing indicator dot */}
                <mesh ref={dotRef} position={[0, 0, 0.4]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                </mesh>

                {/* Glow ring around the dot */}
                <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.2, 0.35, 32]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
                </mesh>

                {/* Phone glow */}
                <pointLight position={[0, 0, 0.5]} intensity={0.4} color="#00ffff" distance={1.5} />
            </group>
        </Float>
    );
}

// Preload the model
useGLTF.preload('/assets/models/phone_free.glb');
