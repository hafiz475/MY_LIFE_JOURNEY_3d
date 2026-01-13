import { useRef, Suspense, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    Environment,
    useGLTF
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './SoftwareCareerScene.scss';

// Animated Gaming Laptop - starts closed, can be opened
function AnimatedLaptop({ isOpen, onLaptopClick }) {
    const groupRef = useRef();
    const { scene } = useGLTF('/assets/models/gaming_laptop.glb');
    const [currentLidAngle, setCurrentLidAngle] = useState(Math.PI * 0.5); // Start closed
    const targetLidAngle = isOpen ? 0 : Math.PI * 0.5; // isOpen=true means OPENED (0), isOpen=false means CLOSED (0.5)
    const screenRef = useRef(null);
    const [isReady, setIsReady] = useState(false); // Hide until closed state is applied

    // Apply closed state and then show the model
    useLayoutEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.name === 'Cube_1') {
                    screenRef.current = child;
                    // Apply closed state first
                    child.rotation.x = Math.PI * 0.5;
                }
            });
            // Now that closed state is applied, make visible
            setIsReady(true);
        }
    }, [scene]);

    const firstFrame = useRef(true);

    useFrame(() => {
        // On FIRST frame, force the closed state
        if (firstFrame.current && screenRef.current) {
            screenRef.current.rotation.x = Math.PI * 0.5;
            firstFrame.current = false;
            setIsReady(true);
            return;
        }

        if (!isReady) return;

        // Smooth screen animation
        setCurrentLidAngle(prev => {
            const diff = targetLidAngle - prev;
            if (Math.abs(diff) < 0.005) return targetLidAngle;
            return prev + diff * 0.06;
        });

        // Apply rotation to the screen/monitor
        if (screenRef.current) {
            screenRef.current.rotation.x = currentLidAngle;
        }
    });

    return (
        <group
            ref={groupRef}
            position={[0, -1.5, 0]}
            rotation={[0, Math.PI - 0.2, 0]}
            scale={3}
            onClick={onLaptopClick}
            visible={isReady} // Hide until ready
        >
            <primitive object={scene} castShadow receiveShadow />

            {/* Arcade Screen Content - only visible when fully open */}
            {isOpen && currentLidAngle < 0.1 && (
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
                        <button className="neon-back-icon" onClick={() => { window.location.href = '/room'; }} title="Back to Interests">
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
                                onClick={() => { window.location.href = '/pinball'; }}
                            >
                                <span className="card-icon">🎱</span>
                                <span className="card-label">Pinball</span>
                            </div>
                            <div
                                className="neon-game-card flappy"
                                onClick={() => { window.location.href = '/flappy-bird'; }}
                            >
                                <span className="card-icon">🐦</span>
                                <span className="card-label">Flappy</span>
                            </div>
                            <div
                                className="neon-game-card rubiks"
                                onClick={() => { window.location.href = '/rubiks-cube'; }}
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
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#ff6b6b',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif'
            }}>
                Loading...
            </div>
        </Html>
    );
}

// Main Scene Component - Minimal: just laptop in empty space
export default function SoftwareCareerScene() {
    const navigate = useNavigate();
    const [isLaptopOpen, setIsLaptopOpen] = useState(false);

    // Laptop stays closed initially - no auto-open

    return (
        <div className="software-career-scene">
            <Canvas
                camera={{ position: [0, 1, 4], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >

                {/* Dark void background */}
                <color attach="background" args={['#0a0000']} />

                {/* Simple lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-5, 3, 3]} intensity={0.8} color="#8b5cf6" />
                <pointLight position={[0, -2, 3]} intensity={0.5} color="#ff4444" />

                {/* Strong lights to illuminate the red wall and floor */}
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
                <pointLight position={[0, 3, -3]} intensity={5} color="#ff4444" distance={20} />
                <pointLight position={[-5, 2, 0]} intensity={3} color="#ff6666" distance={15} />
                <pointLight position={[5, 2, 0]} intensity={3} color="#ff6666" distance={15} />

                {/* FULL BRIGHTNESS Matte Red Back Wall */}
                <mesh position={[0, 2, -5]}>
                    <planeGeometry args={[30, 15]} />
                    <meshBasicMaterial color="#ff3333" />
                </mesh>

                {/* FULL BRIGHTNESS Matte Red Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
                    <planeGeometry args={[30, 20]} />
                    <meshBasicMaterial color="#dd2222" />
                </mesh>

                {/* The Laptop - click to open */}
                <Suspense fallback={<Loader />}>
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

            {/* Opening hint */}
            {!isLaptopOpen && (
                <div className="open-hint">
                    <span>Opening laptop...</span>
                </div>
            )}
        </div>
    );
}

useGLTF.preload('/assets/models/gaming_laptop.glb');
