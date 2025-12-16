// src/components/Clouds.jsx
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeCloudTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // clear
  ctx.clearRect(0, 0, size, size);

  // draw a few radial gradients to produce a fluffy cloud texture
  for (let i = 0; i < 8; i++) {
    const x = size * (0.2 + Math.random() * 0.6);
    const y = size * (0.2 + Math.random() * 0.6);
    const r = size * (0.12 + Math.random() * 0.18);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255,255,255,1.0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.encoding = THREE.sRGBEncoding;
  tex.repeat.set(1, 1);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export default function Clouds({ count = 12, zStart = -10, zSpacing = 4 }) {
  const group = useRef();
  const cloudTexture = useMemo(() => makeCloudTexture(), []);

  // create an array of cloud initial data once
  const clouds = useMemo(() => {
    return new Array(count).fill().map((_, i) => {
      const x = (Math.random() - 0.5) * 30;
      const y = 1 + Math.random() * 3;               // vertical spread
      const z = zStart - (i % 4) * zSpacing;        // layered depths
      const sx = 4 + Math.random() * 6;             // horizontal size
      const sy = 2 + Math.random() * 2;             // vertical size
      const speed = 0.01 + Math.random() * 0.02;    // drift speed
      const rot = Math.random() * Math.PI;
      return { x, y, z, sx, sy, speed, rot };
    });
  }, [count, zStart, zSpacing]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const cd = clouds[i];
      child.position.x += cd.speed * delta * 60;      // normalized per-frame motion
      if (child.position.x > 30) child.position.x = -30;
      child.rotation.z += (0.001 + (i % 3) * 0.0008) * delta * 60;
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, c.y, c.z]}
          rotation={[-0.15, 0, c.rot]}
          scale={[c.sx, c.sy, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={cloudTexture}
            transparent={true}
            opacity={0.95}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
