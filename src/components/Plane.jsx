import { useGLTF } from '@react-three/drei';

export default function Plane({ visible }) {
    const { scene } = useGLTF('/assets/models/basic_plane.glb');

    return (
        <primitive
            object={scene}
            visible={visible}
            scale={1}
            position={[0, 0, 0]}
        />
    );
}
