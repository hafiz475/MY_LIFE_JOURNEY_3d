import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function CloudStream({ maxClouds = 20, onCloudClick, section = 0, active = true }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}assets/models/cloud.glb`);
  const group = useRef();
  const clouds = useRef([]);

  const GLOBAL_SPEED = 0.4;
  const SPAWN_X = 22;      // off-screen right
  const DESPAWN_X = -22;  // off-screen left

  function spawnCloud() {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color.setScalar(1.08); // brighter
        child.material.roughness = 1;
        child.material.metalness = 0;
        child.material.transparent = true;
        child.material.opacity = 0.97;
        child.material.depthWrite = false;
      }
    });

    const sizeTier = Math.random();
    let scale, speed, y;

    if (sizeTier < 0.33) {
      // big cloud
      scale = 1.8 + Math.random() * 0.6;
      speed = 0.06 + Math.random() * 0.06;
      y = 3 + Math.random() * 2;
    } else if (sizeTier < 0.66) {
      // medium
      scale = 1.1 + Math.random() * 0.5;
      speed = 0.1 + Math.random() * 0.1;
      y = 2 + Math.random() * 2;
    } else {
      // small
      scale = 0.6 + Math.random() * 0.4;
      speed = 0.16 + Math.random() * 0.14;
      y = 1.3 + Math.random() * 1.6;
    }

    // Scene 0: clouds only on left side (negative Z)
    // Scene 1+: clouds on both sides
    let zSide;
    if (section === 0) {
      zSide = -1; // Only left side
    } else {
      zSide = Math.random() > 0.5 ? 1 : -1; // Both sides
    }
    const zOffset = 1 + Math.random() * 8;

    clone.position.set(
      SPAWN_X,
      y,
      zSide * zOffset
    );

    clone.scale.set(scale, scale, scale);

    return { mesh: clone, speed };
  }

  useFrame((_, delta) => {
    if (!group.current) return;

    // spawn new clouds if needed
    if (active && clouds.current.length < maxClouds) {
      const cloud = spawnCloud();
      clouds.current.push(cloud);
      group.current.add(cloud.mesh);
    }

    // update clouds
    clouds.current = clouds.current.filter((c) => {
      c.mesh.position.x -= c.speed * delta * 60 * GLOBAL_SPEED;

      // natural slight vertical drift
      c.mesh.position.y += Math.sin(performance.now() * 0.0005) * 0.002;

      if (c.mesh.position.x < DESPAWN_X) {
        group.current.remove(c.mesh);
        return false; // destroy cloud
      }
      return true;
    });
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        // Thunder Trigger
        e.stopPropagation();
        if (onCloudClick) onCloudClick();
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    />
  );
}

useGLTF.preload(`${import.meta.env.BASE_URL}assets/models/cloud.glb`);
