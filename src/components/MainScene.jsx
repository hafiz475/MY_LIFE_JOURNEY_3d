import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Sky, CameraShake } from '@react-three/drei';
import gsap from 'gsap';

import Plane from './Plane';
import CloudStream from './CloudStream';
import HudText from './HudText';
import WeatherSystem from './WeatherSystem';

function SceneContent({ section }) {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  // Thunder Refs
  const lightRef = useRef();
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [isRaining, setIsRaining] = useState(false);

  // Start rain after 12 seconds automatically, stop after 15s duration
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsRaining(true);

      // Stop rain after 15 seconds
      const stopTimer = setTimeout(() => {
        setIsRaining(false);
      }, 15000);

      return () => clearTimeout(stopTimer);
    }, 12000);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    // Initial Camera Intro Animation (3 seconds)
    // Setup initial position (e.g., lower and centered)
    camera.position.set(0, -2, 8);

    const tl = gsap.timeline();

    // Animation 1: Move Up (5s)
    tl.to(camera.position, {
      y: 1.5,
      z: 6,
      duration: 5,
      ease: "power1.inOut"
    });

    // Animation 2: Move Right slightly (5s) - ONLY ON DESKTOP
    tl.to(camera.position, {
      x: isMobile ? 0 : 2,
      duration: 5,
      ease: "power1.inOut"
    });

  }, [camera]);

  // Responsive adjustments for the plane or camera based on aspect ratio
  useEffect(() => {
    if (isMobile) {
      camera.fov = 60;
    } else {
      camera.fov = 45;
    }
    camera.updateProjectionMatrix();
  }, [isMobile, camera]);

  const triggerThunder = () => {
    // 1. Flash Light (3 seconds of chaos)
    if (lightRef.current) {
      // Flash brightness up then down repeatedly for ~2s
      gsap.killTweensOf(lightRef.current);
      gsap.to(lightRef.current, {
        intensity: 8,
        duration: 0.1,
        yoyo: true,
        repeat: 14, // ~1.5s
        onComplete: () => {
          lightRef.current.intensity = 1.2; // Reset
        }
      });
    }

    // 2. Camera Shake (1.5 seconds)
    setShakeIntensity(3); // Higher shake
    setTimeout(() => setShakeIntensity(0), 1500); // Stop after 1.5s
  };

  return (
    <>
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
      <ambientLight intensity={0.5} />
      <directionalLight ref={lightRef} position={[5, 10, 5]} intensity={1.2} castShadow />

      <Suspense fallback={null}>
        {/* Clouds placed behind plane (z negative) */}
        <CloudStream maxClouds={24} onCloudClick={triggerThunder} />

        {/* Weather: Rain */}
        <WeatherSystem active={isRaining} />

        {/* Centered, small plane */}
        <Plane />
        <HudText />
      </Suspense>

      {/* Camera Shake (controlled by intensity) */}
      <CameraShake
        maxYaw={0.1}
        maxPitch={0.1}
        maxRoll={0.1}
        yawFrequency={10}
        pitchFrequency={10}
        rollFrequency={10}
        intensity={shakeIntensity}
      />
    </>
  );
}

export default function MainScene({ section }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
      <SceneContent section={section} />
    </Canvas>
  );
}
