import { useRef, Suspense, useState, useEffect } from 'react';
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
    const { scene, nodes } = useGLTF('/assets/models/gaming_laptop.glb');
    const [currentLidAngle, setCurrentLidAngle] = useState(Math.PI * 0.5); // Start closed (90 degrees)
    const targetLidAngle = isOpen ? 0 : Math.PI * 0.5; // 0 = open, positive = closed
    const screenRef = useRef(null);

    // Find the monitor/screen - Cube_1
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.name === 'Cube_1') {
                    screenRef.current = child;
                    // Apply closed state immediately (screen folded onto keyboard)
                    child.rotation.x = Math.PI * 0.5;
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

                {/* Strong light to illuminate the red wall */}
                <spotLight
                    position={[0, 5, 2]}
                    angle={0.8}
                    penumbra={0.5}
                    intensity={3}
                    color="#ffffff"
                    target-position={[0, 0, -5]}
                />
                <pointLight position={[0, 2, -3]} intensity={2} color="#ff6666" distance={15} />

                {/* Matte Red Back Wall */}
                <mesh position={[0, 2, -5]} receiveShadow>
                    <planeGeometry args={[30, 15]} />
                    <meshStandardMaterial
                        color="#cc0000"
                        roughness={0.95}
                        metalness={0}
                    />
                </mesh>

                {/* Dark Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
                    <planeGeometry args={[30, 20]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.9}
                        metalness={0.1}
                    />
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
