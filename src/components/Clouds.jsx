// src/components/Clouds.jsx
import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function makeCloudTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < 8; i++) {
    const x = size * (0.2 + Math.random() * 0.6);
    const y = size * (0.2 + Math.random() * 0.6);
    const r = size * (0.12 + Math.random() * 0.18);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  tex.needsUpdate = true;
  return tex;
}

export default function Clouds({ count = 14 }) {
  const group = useRef();
  const { camera } = useThree();
  const texture = useMemo(makeCloudTexture, []);

  // Create cloud layers with depth-based parallax
  const clouds = useMemo(() => {
    return new Array(count).fill().map(() => {
      const depth = Math.random(); // 0 (far) → 1 (near)
      return {
        baseX: (Math.random() - 0.5) * 30,
        y: 1 + Math.random() * 3,
        z: -6 - depth * 10,               // farther clouds deeper
        scaleX: 4 + depth * 6,
        scaleY: 2 + depth * 3,
        drift: 0.005 + depth * 0.015,     // near clouds drift faster
        parallax: 0.15 + depth * 0.35,    // near clouds respond more
        rot: Math.random() * Math.PI,
      };
    });
  }, [count]);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    group.current.children.forEach((cloud, i) => {
      const c = clouds[i];

      // Time-based drift
      cloud.position.x =
        c.baseX +
        Math.sin(t * 0.1) * 0.5 +
        t * c.drift * 10;

      // Camera-based parallax (very subtle)
      cloud.position.x += camera.position.x * c.parallax;
      cloud.position.y += camera.position.y * c.parallax * 0.2;

      // Wrap clouds
      if (cloud.position.x > 30) cloud.position.x = -30;

      // Gentle rotation
      cloud.rotation.z = c.rot + Math.sin(t * 0.05) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={[c.baseX, c.y, c.z]}
          scale={[c.scaleX, c.scaleY, 1]}
          rotation={[-0.15, 0, c.rot]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.95}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
