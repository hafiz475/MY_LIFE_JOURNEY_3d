import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, OrbitControls } from '@react-three/drei';

import CameraRig from './CameraRig';
import Football from './Football';
import BasicPlane from './BasicPlane';

export default function SceneFootball() {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 4, 10], fov: 45 }}
        >
            <color attach="background" args={['#e9f1ff']} />

            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

            <Suspense fallback={null}>
                <CameraRig />
                <BasicPlane />
                <Football />
                <Environment preset="city" />
            </Suspense>

            <OrbitControls enablePan={false} />
        </Canvas>
    );
}
