import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import gsap from 'gsap';

import Plane from './Plane';
import Football from './Football';
import BikePlaceholder from './BikePlaceholder';

function CameraController({ section }) {
    const { camera } = useThree();

    useEffect(() => {
        if (section === 0) {
            gsap.to(camera.position, {
                x: 0, y: 3, z: 8,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => camera.lookAt(0, 1, 0),
            });
        }

        if (section === 1) {
            gsap.to(camera.position, {
                x: 0, y: 2, z: 4,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => camera.lookAt(0, 0.8, 0),
            });
        }

        if (section === 2) {
            gsap.to(camera.position, {
                x: 2, y: 2, z: 5,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => camera.lookAt(0, 1, 0),
            });
        }
    }, [section]);

    return null;
}

export default function MainScene({ section }) {
    return (
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
            <color attach="background" args={['#eaf1ff']} />

            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />

            <Suspense fallback={null}>
                <CameraController section={section} />

                {/* Scene objects */}
                <Plane visible={section === 0} />
                <Football visible={section === 1} />
                <BikePlaceholder visible={section === 2} />
            </Suspense>
        </Canvas>
    );
}
