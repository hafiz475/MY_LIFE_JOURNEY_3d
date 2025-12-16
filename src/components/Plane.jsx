//src/components/Plane.jsx

import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Plane() {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/models/basic_plane.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    // Center the model properly
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    // 🔹 Make plane smaller (adjust this value only)
    scene.scale.set(0.25, 0.25, 0.25);

    // Keep your preferred rotation
    scene.rotation.set(0, Math.PI / 2, 0);

    // Improve texture quality
    scene.traverse((child) => {
      if (child.isMesh && child.material.map) {
        child.material.map.encoding = THREE.sRGBEncoding;
        child.material.map.anisotropy = 16;
      }
    });

    // Play animation only if you want (optional)
    if (names.length > 0) {
      actions[names[0]].play();
    }
  }, [scene]);

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}
