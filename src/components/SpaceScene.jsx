import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Star particle component
function Stars({ count = 500 }) {
  const mesh = useRef();
  
  // Generate star positions and sizes
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread stars in a sphere around the camera
      const radius = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Vary star sizes
      sizes[i] = 0.5 + Math.random() * 1.5;
      
      // Subtle color variations (cool tones)
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        // White-ish
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.8) {
        // Blue-ish
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1;
      } else {
        // Purple/pink-ish
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }
    }
    
    return { positions, sizes, colors };
  }, [count]);

  // Slow rotation animation
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.02;
      mesh.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Larger "bright" stars
function BrightStars({ count = 50 }) {
  const mesh = useRef();
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 30 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, [count]);

  // Gentle twinkle
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001;
      // Twinkle effect via size variation
      const time = state.clock.elapsedTime;
      mesh.current.material.size = 0.3 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#ffffff"
        sizeAttenuation={true}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Nebula glow (subtle ambient color)
function NebulaGlow() {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, -50]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial
        color="#1a0a2e"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function SpaceScene() {
  const { camera } = useThree();
  
  // Set camera for space view
  useMemo(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Dark background */}
      <color attach="background" args={['#050510']} />
      
      {/* Very subtle ambient light */}
      <ambientLight intensity={0.1} />
      
      {/* Stars */}
      <Stars count={600} />
      <BrightStars count={80} />
      
      {/* Distant nebula glow */}
      <NebulaGlow />
      
      {/* Soft point light for celestial feel */}
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#8080ff" />
      <pointLight position={[-10, -10, 10]} intensity={0.2} color="#ff80c0" />
    </>
  );
}
