//src/components/Plane.jsx

import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Plane() {
  const group = useRef();
  const idleRef = useRef();
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}assets/models/gottfried_freiherr_von_banfields_seaplane.glb`);
  const { actions, names } = useAnimations(animations, group);

  // Track animation state to prevent spamming
  const isSpinning = useRef(false);

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
  }, [scene]);

  // Idle Animation (Floating/Flying feel)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (idleRef.current) {
      // "Wing flapping" (Roll - Rotation X)
      // 4s loop -> freq ~ 1.5
      idleRef.current.rotation.x = Math.sin(t * 1.5) * 0.05; // +/- ~3 deg

      // "1 degree left and right" (Yaw - Rotation Y)
      idleRef.current.rotation.y = Math.cos(t * 1) * 0.02; // +/- ~1 deg
    }
  });

  const handlePlaneClick = (e) => {
    e.stopPropagation(); // Prevent clicking through to other things

    if (isSpinning.current) return;

    isSpinning.current = true;

    // 360 Degree Barrel Roll (Rotation around X axis since plane flies along X)
    gsap.to(group.current.rotation, {
      x: group.current.rotation.x + Math.PI * 2,
      duration: 2, // Faster (2 seconds)
      ease: "power1.inOut",
      onComplete: () => {
        isSpinning.current = false;
        // Reset to keep numbers clean (optional, but good for float precision eventually)
        // group.current.rotation.x = group.current.rotation.x % (Math.PI * 2);
      }
    });
  };

  return (
    <group
      ref={group}
      position={[0, 0, 0]}
      onClick={handlePlaneClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Inner group for Idle Animation Only */}
      <group ref={idleRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
