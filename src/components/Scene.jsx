import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import Model from './Model';

export default function Scene() {
    return (
        <Canvas
            shadows
            camera={{ position: [3, 2, 5], fov: 45 }}
        >
            <color attach="background" args={['#e8f0ff']} />

            {/* Lights */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                castShadow
            />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#cfcfcf" />
            </mesh>

            <Suspense fallback={null}>
                <Model />
                <Environment preset="park" />
            </Suspense>

            <OrbitControls />
        </Canvas>
    );
}
