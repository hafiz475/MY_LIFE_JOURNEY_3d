//src/components/Plane.jsx

import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Plane() {
  const group = useRef();
  const textRef = useRef();
  const { scene, animations } = useGLTF('/assets/models/gottfried_freiherr_von_banfields_seaplane.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    // Center the model properly
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    // 🔹 Make plane smaller (adjust this value only)
    scene.scale.set(1, 1, 1);

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

    // Name Toast Animation
    if (textRef.current) {
      textRef.current.fillOpacity = 0; // Start hidden

      setTimeout(() => {
        gsap.to(textRef.current, {
          fillOpacity: 1,
          duration: 2,
          ease: "power2.out"
        });
      }, 8000);
    }
  }, [scene]);

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={scene} />
      <Text
        ref={textRef}
        position={[0, 1.2, 0]} // Above the plane? Or side? Let's try above for visibility
        rotation={[0, Math.PI / 2, 0]} // Rotate to match plane's sideways orientation? 
        // Plane is rotated (0, PI/2, 0). Camera moves to side.
        // If plane is flying +X (or -X?), and camera is at +Z then moves to +X, +Z...
        // Let's try to make it face the camera mostly.
        // Actually, let's use Billboard to make it always face camera? No, "next to plane" implies attached.
        // Let's stick to standard rotation for now.
        fontSize={0.3}
        color="#B22222" // Aircraft Red
        anchorX="center"
        anchorY="middle"
      >
        J Md Hafizur Rahman
      </Text>
    </group>
  );
}
