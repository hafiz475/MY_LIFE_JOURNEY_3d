import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Model() {
    const { scene } = useGLTF('/assets/models/garden_swing_chair_3d_model.glb');

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    scene.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(0.5 / maxAxis); // 👈 adjust 0.5 → 0.35 if needed
    scene.position.y -= (size.y * scene.scale.y) / 2;

    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return <primitive object={scene} />;
}
