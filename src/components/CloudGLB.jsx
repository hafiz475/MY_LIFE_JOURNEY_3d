// src/components/CloudGLB.jsx
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function CloudGLB({ count = 28 }) {
  const { scene } = useGLTF('/assets/models/cloud.glb');
  const group = useRef();

  const spawnRangeX = 20;   // left/right spawn boundary
  const centerGap = 3;      // keep +/- centerGap clear for plane silhouette

  // initialize cloud data with mixed sizes
  const clouds = useMemo(() => {
    return new Array(count).fill().map((_, i) => {
      // pick size tier probabilistically
      const r = Math.random();
      let scale, speed, yMin, yMax, zMin, zMax;
      if (r < 0.33) {
        // big (slower, farther)
        scale = 1.6 + Math.random() * 0.7;
        speed = 0.08 + Math.random() * 0.08;
        yMin = 2.2; yMax = 4.6;
        zMin = -2; zMax = -10;
      } else if (r < 0.66) {
        // medium
        scale = 1.0 + Math.random() * 0.5;
        speed = 0.14 + Math.random() * 0.12;
        yMin = 1.6; yMax = 3.8;
        zMin = -1; zMax = -8;
      } else {
        // small (faster, nearer)
        scale = 0.55 + Math.random() * 0.4;
        speed = 0.22 + Math.random() * 0.18;
        yMin = 1.1; yMax = 3.0;
        zMin = -0.5; zMax = -6;
      }

      // pick x ensuring outside center gap
      let x;
      do {
        x = (Math.random() * 2 - 1) * spawnRangeX;
      } while (Math.abs(x) < centerGap);

      const y = yMin + Math.random() * (yMax - yMin);
      const z = zMin + Math.random() * (zMax - zMin);

      return {
        baseX: x,
        x,
        y,
        z,
        scale,
        speed,
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    if (!group.current) return;

    group.current.children.forEach((mesh, i) => {
      const c = clouds[i];

      // move left (clouds go behind the plane visually)
      mesh.position.x -= c.speed * delta;

      // gentle bob so clouds aren't static (very subtle)
      mesh.position.y = c.y + Math.sin((i + Date.now() * 0.0001) * 0.5) * 0.03;

      // when off left side, wrap to right
      if (mesh.position.x < -spawnRangeX - 2) {
        mesh.position.x = spawnRangeX + Math.random() * 2;
        // randomize vertical and depth a bit on respawn
        mesh.position.y = (Math.random() * (3.5 - 1.2)) + 1.2;
        mesh.position.z = -0.5 - Math.random() * 9.5;
      }
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => {
        const clone = scene.clone(true);

        // soften material per mesh (Pixar-like)
        clone.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color.setScalar(1.08);   // slightly brighter
            child.material.roughness = 1;
            child.material.metalness = 0;
            child.material.transparent = true;
            child.material.opacity = 0.98;
            child.material.depthWrite = false;
            child.material.side = THREE.DoubleSide;
          }
        });

        // apply initial transforms
        clone.position.set(c.x, c.y, c.z);
        clone.scale.set(c.scale, c.scale, c.scale);

        return <primitive key={i} object={clone} />;
      })}
    </group>
  );
}

useGLTF.preload('/assets/models/cloud.glb');
