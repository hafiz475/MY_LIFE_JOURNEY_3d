import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { moveCamera } from './CameraRig';

export default function BasicPlane() {
    const { scene } = useGLTF('/assets/models/basic_plane.glb');
    const { camera } = useThree();

    scene.traverse((c) => {
        if (c.isMesh) c.castShadow = true;
    });

    const handleClick = () => {
        moveCamera(camera, [0, 3, 8], [0, 1, 0]);
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
