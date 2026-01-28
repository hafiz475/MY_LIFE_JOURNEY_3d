import { useRef, Suspense, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    Environment,
    useGLTF,
    ContactShadows,
    OrbitControls
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './SoftwareCareerScene.scss';
import UniversalLoader from './UniversalLoader';

// Animated Gaming Laptop - starts open, click to close
function AnimatedLaptop({ isOpen, onLaptopClick }) {
    const groupRef = useRef();
    const { scene } = useGLTF(`${import.meta.env.BASE_URL}assets/models/gaming_laptop.glb`);
    const [currentLidAngle, setCurrentLidAngle] = useState(0); // Start open (native state)
    const targetLidAngle = isOpen ? Math.PI * 0.5 : 0; // isOpen=true means CLOSED (0.5), isOpen=false means OPEN (0)
    const screenRef = useRef(null);
    // Store original position
    const originalPos = useRef({ y: 0, z: 0 });

    // Find the screen reference and store original position
    useLayoutEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.name === 'Cube_1') {
                    screenRef.current = child;
                    originalPos.current.y = child.position.y;
                    originalPos.current.z = child.position.z;
                }
            });
        }
    }, [scene]);

    useFrame(() => {
        // Smooth screen animation
        setCurrentLidAngle(prev => {
            const diff = targetLidAngle - prev;
            if (Math.abs(diff) < 0.005) return targetLidAngle;
            return prev + diff * 0.06;
        });

        // Apply rotation and position adjustment to simulate hinge
        if (screenRef.current) {
            screenRef.current.rotation.x = currentLidAngle;

            // Adjust position to close the gap - move screen down and forward as it closes
            const hingeOffset = 0.15; // Adjust this value to close the gap
            screenRef.current.position.y = originalPos.current.y - Math.sin(currentLidAngle) * hingeOffset;
            screenRef.current.position.z = originalPos.current.z + (1 - Math.cos(currentLidAngle)) * hingeOffset * 0.5;
        }
    });

    return (
        <group
            ref={groupRef}
            position={[0, -1.5, 0]}
            rotation={[0, Math.PI - 0.2, 0]}
            scale={3}
            onClick={onLaptopClick}
            visible={true}
        >
            <primitive object={scene} castShadow receiveShadow />

            {/* Arcade Screen Content - visible AFTER clicking the laptop */}
            {isOpen && currentLidAngle > 0.4 && (
                <Html
                    transform
                    occlude
                    position={[0.5, 0.4, 0.7]}
                    rotation={[0.18, Math.PI, 0]}
                    scale={0.055}
                    className="laptop-screen-content"
                >
                    <div className="neon-arcade-screen">
                        {/* Back to Interests */}
                        <button className="neon-back-icon" onClick={(e) => { e.stopPropagation(); window.location.href = '/room'; }} title="Back to Interests">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="arcade-header">
                            <span className="arcade-icon">🎮</span>
                            <h1>ARCADE</h1>
                            <p>Choose Your Game</p>
                        </div>
                        <div className="neon-game-cards">
                            <div
                                className="neon-game-card pinball"
                                onClick={(e) => { e.stopPropagation(); window.location.href = '/pinball'; }}
                            >
                                <span className="card-icon">🎱</span>
                                <span className="card-label">Pinball</span>
                            </div>
                            <div
                                className="neon-game-card flappy"
                                onClick={(e) => { e.stopPropagation(); window.location.href = '/flappy-bird'; }}
                            >
                                <span className="card-icon">🐦</span>
                                <span className="card-label">Flappy</span>
                            </div>
                            <div
                                className="neon-game-card rubiks"
                                onClick={(e) => { e.stopPropagation(); window.location.href = '/rubiks-cube'; }}
                            >
                                <span className="card-icon">🧊</span>
                                <span className="card-label">Rubik's</span>
                            </div>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

// Simple loading fallback
// Universal Loader

// Main Scene Component - Laptop with bright red wall
export default function SoftwareCareerScene() {
    const navigate = useNavigate();
    const [isLaptopOpen, setIsLaptopOpen] = useState(false);

    return (
        <div className="software-career-scene">
            <Canvas
                camera={{ position: [0, 1, 4], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Matte black background */}
                <color attach="background" args={['#0a0a0a']} />

                {/* Orbit Controls */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={10}
                />

                {/* Simple lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-5, 3, 3]} intensity={0.8} color="#8b5cf6" />
                <pointLight position={[0, -2, 3]} intensity={0.5} color="#ff4444" />

                {/* Strong lights */}
                <spotLight
                    position={[0, 8, 5]}
                    angle={1}
                    penumbra={0.3}
                    intensity={8}
                    color="#ffffff"
                />
                <spotLight
                    position={[0, 5, -2]}
                    angle={1.2}
                    penumbra={0.5}
                    intensity={6}
                    color="#ffffff"
                />

                {/* Matte Black Back Wall */}
                <mesh position={[0, 2, -5]}>
                    <planeGeometry args={[30, 15]} />
                    <meshBasicMaterial color="#1a1a1a" />
                </mesh>

                {/* The Laptop - click to close */}
                <Suspense fallback={<UniversalLoader isCanvas text="Launching Console..." />}>
                    <AnimatedLaptop
                        isOpen={isLaptopOpen}
                        onLaptopClick={() => setIsLaptopOpen(true)}
                    />
                </Suspense>

                <Environment preset="night" />

                <EffectComposer>
                    <Bloom intensity={0.4} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
                    <Vignette eskil={false} offset={0.2} darkness={0.6} />
                </EffectComposer>
            </Canvas>

            {/* Back button overlay */}
            <button className="back-to-room-btn" onClick={() => navigate('/room')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back to Interests</span>
            </button>

            {/* Click to close hint */}
            {!isLaptopOpen && (
                <div className="open-hint">
                    <span>Click laptop to close</span>
                </div>
            )}
        </div>
    );
}

useGLTF.preload(`${import.meta.env.BASE_URL}assets/models/gaming_laptop.glb`);
