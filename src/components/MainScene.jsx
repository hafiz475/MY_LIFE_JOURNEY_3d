// src/components/MainScene.jsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Sky, OrbitControls } from '@react-three/drei';

import Plane from './Plane';
import Clouds from './Clouds';
import CloudGLB from './CloudGLB';

export default function MainScene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
      {/* nice sky gradient */}
      <Sky
        distance={450000}
        sunPosition={[1, 1, 0]}
        inclination={0.49}   // sun height
        azimuth={0.25}
        turbidity={6}
        rayleigh={2}
      />

      {/* subtle fog for depth (optional) */}
      <fog attach="fog" args={['#eaf1ff', 6, 20]} />

      {/* Soft lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

      <Suspense fallback={null}>
        {/* Clouds placed behind plane (z negative) */}
        <CloudGLB count={26} />

        {/* Centered, small plane */}
        <Plane />

      </Suspense>

      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}
