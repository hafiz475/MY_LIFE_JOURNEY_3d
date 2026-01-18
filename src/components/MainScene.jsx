import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Sky } from '@react-three/drei';
import gsap from 'gsap';

import Plane from './Plane';
import CloudStream from './CloudStream';
import HudText from './HudText';
import StoryText3D from './StoryText3D';
import Birds from './Birds';
import WeatherSystem from './WeatherSystem';
import SoundManager from './SoundManager';
import SpaceScene from './SpaceScene';
import * as THREE from 'three';

function SceneContent({ section, onRainStart, isLanding, isStoryDone, hasStarted }) {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;
  const isTablet = size.width < 1100;

  // Thunder Refs
  const lightRef = useRef();
  const [isRaining, setIsRaining] = useState(false);
  const [showClouds, setShowClouds] = useState(true);
  const [showBirds, setShowBirds] = useState(false);

  // Plane Ref for animation
  const planeRef = useRef();

  // Camera Target for smooth LookAt
  const camTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Sky State (Scene 0 defaults)
  const [skyState, setSkyState] = useState({
    turbidity: 6,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    sunPosition: [1, 1, 0], // High sun
  });

  // After 3 seconds, move plane back 20% (when name appears)
  useEffect(() => {
    if (!hasStarted) return;
    const moveBackTimer = setTimeout(() => {
      if (planeRef.current) {
        gsap.to(planeRef.current.position, {
          z: -1.5,
          duration: 2,
          ease: "power2.inOut"
        });
      }
    }, 100);
    return () => clearTimeout(moveBackTimer);
  }, [hasStarted]);

  // Landing animation: plane descends when isLanding is true
  useEffect(() => {
    if (isLanding && planeRef.current) {
      // Plane descends
      gsap.to(planeRef.current.position, {
        y: -8,
        duration: 3,
        ease: "power2.in"
      });
      // Camera follows down
      gsap.to(camera.position, {
        y: -5,
        duration: 3,
        ease: "power2.in"
      });
      // Look down towards ground
      gsap.to(camTarget.current, {
        y: -10,
        duration: 3,
        ease: "power2.in"
      });
    }
  }, [isLanding, camera]);

  // Thunder Loop (Section 0 only)
  useEffect(() => {
    if (section !== 0 || !hasStarted) return;

    let intervalId;
    // First thunder at 3s
    const firstTimer = setTimeout(() => {
      triggerThunder();
      // Then repeats every 6s (3+6=9, 9+6=15...)
      intervalId = setInterval(triggerThunder, 6000);
    }, 500);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalId);
    };
  }, [section, hasStarted]);

  // Rain Logic - Only automatic in Section 0
  useEffect(() => {
    if (section !== 0 || !hasStarted) {
      setIsRaining(false);
      return;
    }

    // Start rain after 12 seconds
    const startTimer = setTimeout(() => {
      setIsRaining(true);
      if (onRainStart) onRainStart();

      // Stop after 15s duration (optional, but requested previously)
      const stopTimer = setTimeout(() => {
        setIsRaining(false);
      }, 15000);
      return () => clearTimeout(stopTimer);
    }, 12000);

    return () => clearTimeout(startTimer);
  }, [section, onRainStart, hasStarted]);

  // Plane Rotation Loop (Sections 0 & 1)
  useEffect(() => {
    // Enable for both Scene 0 (Intro) and Scene 1 (Sunset)
    if (section > 1 || !hasStarted) return;

    const performRotation = () => {
      if (!planeRef.current) return;
      // Barrel Roll (Rotate around X axis because plane faces X)
      gsap.to(planeRef.current.rotation, {
        x: "+=" + (Math.PI * 2), // Full 360 spin
        duration: 6,
        ease: "power1.inOut"
      });
    };

    let intervalId;
    // Start after 12 seconds
    const startTimer = setTimeout(() => {
      performRotation();
      // Repeat every 18 seconds (6s rotation + 12s wait)
      intervalId = setInterval(performRotation, 18000);
    }, 12000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalId);

      // Fix for "Stuck" plane: Kill tween AND smoothly rotate back to 0
      if (planeRef.current) {
        gsap.killTweensOf(planeRef.current.rotation);
        gsap.to(planeRef.current.rotation, {
          x: 0,
          duration: 1, // Quick adjustment to level flight
          ease: "power2.out"
        });
      }
    };
  }, [section, hasStarted]);

  // Track if we have left the intro (to avoid running reverse anim on mount)
  const hasLeftIntro = useRef(false);

  // Handle Section Changes (Camera & Lighting)
  useEffect(() => {

    const tl = gsap.timeline();

    if (section === 1) {
      hasLeftIntro.current = true; // Mark that we've left intro

      // --- SCENE 2: Sunset / Under Wing ---

      // Animate Sun Position to horizon
      const sunPosObj = { x: skyState.sunPosition[0], y: skyState.sunPosition[1], z: skyState.sunPosition[2] };
      gsap.to(sunPosObj, {
        x: 100,
        y: 0, // Horizon
        z: 0, // Centered
        duration: 3,
        onUpdate: () => setSkyState(prev => ({
          ...prev,
          sunPosition: [sunPosObj.x, sunPosObj.y, sunPosObj.z],
          turbidity: 10,
          rayleigh: 4
        }))
      });

      // Camera: Behind and under the wing, front of plane visible
      // x: negative = behind plane (plane faces +X)
      // y: negative = below
      // z: positive = to the side (under left wing)
      tl.to(camera.position, {
        x: isMobile ? -3.5 : (isTablet ? -3.8 : -4),
        y: isMobile ? -0.5 : (isTablet ? -0.6 : -0.8),
        z: isMobile ? 1.2 : (isTablet ? 1.8 : 2.5),
        duration: 3,
        ease: "power2.inOut"
      });

      // Look At: Forward Horizon (+X) - plane front visible in frame
      tl.to(camTarget.current, {
        x: 100,
        y: 0.5,   // Slightly up to keep horizon in view
        z: 0,
        duration: 3,
        ease: "power2.inOut"
      }, "<");

      // Stop clouds and show birds 6s after text appears (3.5s delay + 6s = 9.5s)
      const transitionTimer = setTimeout(() => {
        setShowClouds(false);
        setShowBirds(true);
      }, 9500);

      return () => clearTimeout(transitionTimer);
    } else if (section === 0) {
      // --- BACK TO SCENE 0 (Intro) ---
      // Reverse animation: Go back to the flight position

      const targetX = isMobile ? 0 : 2;

      // Kill previous animations to prevent conflicts
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(camTarget.current);

      // Reset plane position when going back to section 0
      if (planeRef.current && hasLeftIntro.current) {
        gsap.killTweensOf(planeRef.current.position);
        gsap.to(planeRef.current.position, {
          x: 0,
          y: 0,
          z: -1.5, // Same position as after intro
          duration: 3,
          ease: "power2.inOut"
        });
      }

      // Reset Sun Position using proxy object (arrays can't be animated directly)
      const sunProxy = { x: skyState.sunPosition[0], y: skyState.sunPosition[1], z: skyState.sunPosition[2] };
      gsap.to(sunProxy, {
        x: 1, y: 1, z: 0, // High sun position
        duration: 3,
        onUpdate: () => setSkyState(prev => ({
          ...prev,
          sunPosition: [sunProxy.x, sunProxy.y, sunProxy.z],
          turbidity: 6,
          rayleigh: 2
        }))
      });

      // Move Camera back to "Intro End" position
      tl.to(camera.position, {
        x: targetX,
        y: 1.5,
        z: 6,
        duration: 3, // Matched to forward transition speed
        ease: "power2.inOut"
      });

      // Reset LookAt to center forward
      tl.to(camTarget.current, {
        x: 0,
        y: 0,
        z: 0,
        duration: 3,
        ease: "power2.inOut"
      }, "<");

      // Delay cloud appearance to let sunset stay visible during move
      const reverseTimer = setTimeout(() => {
        setShowClouds(true);
        setShowBirds(false);
      }, 3000);

      return () => clearTimeout(reverseTimer);
    }

  }, [section]);

  // ORIGINAL Intro Animation (Scene 0) - runs once on mount
  useEffect(() => {
    if (!hasStarted) return;
    // Initial Camera position (lower and centered)
    camera.position.set(0, -2, 8);
    camTarget.current.set(0, 0, 0);

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

  }, [hasStarted]); // Run when hasStarted becomes true

  // Update Camera LookAt every frame
  useFrame(() => {
    camera.lookAt(camTarget.current);
  });

  // Responsive adjustments
  useEffect(() => {
    camera.fov = isMobile ? 60 : 45;
    camera.updateProjectionMatrix();
  }, [isMobile, camera]);

  const soundRef = useRef();

  const triggerThunder = () => {
    // Play Sound
    if (soundRef.current) soundRef.current.playThunder();

    if (lightRef.current) {
      gsap.killTweensOf(lightRef.current);
      gsap.to(lightRef.current, {
        intensity: 8,
        duration: 0.1,
        yoyo: true,
        repeat: 14,
        onComplete: () => { lightRef.current.intensity = 1.2; }
      });
    }
  };

  // Section 2 = Space scene
  if (section === 2) {
    return <SpaceScene />;
  }

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={skyState.sunPosition}
        turbidity={skyState.turbidity}
        rayleigh={skyState.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49} // We control sun via sunPosition
        azimuth={0.25}
      />

      <fog attach="fog" args={['#eaf1ff', 6, 20]} />

      <ambientLight intensity={0.5} />
      <directionalLight ref={lightRef} position={[5, 10, 5]} intensity={1.2} castShadow />

      {hasStarted && (
        <>
          <SoundManager
            ref={soundRef}
            isRaining={isRaining}
            showBirds={showBirds}
            section={section}
          />
          <Suspense fallback={null}>
            <CloudStream active={showClouds} maxClouds={24} onCloudClick={triggerThunder} section={section} />
            {showBirds && <Birds />}
            <WeatherSystem active={isRaining} />
            <group ref={planeRef}>
              <Plane />
            </group>
            {section === 0 && <HudText />}
            {section === 1 && <StoryText3D isStoryDone={isStoryDone} />}
          </Suspense>
        </>
      )}
    </>
  );
}

export default function MainScene({ section, onRainStart, isLanding, isStoryDone, hasStarted }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
      <SceneContent section={section} onRainStart={onRainStart} isLanding={isLanding} isStoryDone={isStoryDone} hasStarted={hasStarted} />
    </Canvas>
  );
}
