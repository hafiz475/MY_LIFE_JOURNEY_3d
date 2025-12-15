import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { moveCamera } from './CameraRig';

export default function NeonSign() {
    const { scene } = useGLTF('/assets/models/bullet_neon_sign__motorbike_neon_sign_board.glb');
    const { camera } = useThree();

    scene.traverse((c) => {
        if (c.isMesh) {
            c.material.emissive = new THREE.Color('#00ffff');
            c.material.emissiveIntensity = 3;
            c.material.toneMapped = false;
        }
    });

    const handleClick = () => {
        moveCamera(camera, [0, 2, 4], [0, 1, 0]);
    };

    return (
        <primitive
            object={scene}
            scale={1}
            position={[0, 0, 0]}
            onClick={handleClick}
        />
    );
}
