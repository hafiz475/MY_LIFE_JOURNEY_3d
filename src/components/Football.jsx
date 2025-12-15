import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useThree } from '@react-three/fiber';
import { moveCamera } from './CameraRig';

export default function Football() {
    const { scene } = useGLTF('/assets/models/football.glb');
    const ref = useRef();
    const { camera } = useThree();

    scene.traverse((c) => {
        if (c.isMesh) c.castShadow = true;
    });

    const handleClick = () => {
        // roll forward
        gsap.to(ref.current.position, {
            z: 0,
            duration: 1.5,
            ease: 'power2.out'
        });

        gsap.to(ref.current.rotation, {
            x: "+=6",
            duration: 1.5,
            ease: 'power2.out'
        });

        moveCamera(camera, [0, 2, 6], [0, 1, 0]);
    };

    return (
        <primitive
            ref={ref}
            object={scene}
            scale={0.6}
            position={[0, 0.5, -5]}
            onClick={handleClick}
        />
    );
}
