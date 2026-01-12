import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './LaptopScene.scss';

// 3D Laptop Model Component
function Laptop() {
    const groupRef = useRef();
    const screenRef = useRef();

    // Subtle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 - 0.3;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    // Matte material colors
    const matteGray = new THREE.Color('#2a2a2a');      // Dark matte gray for body
    const matteBlack = new THREE.Color('#1a1a1a');     // Deep matte black for keyboard
    const screenBezel = new THREE.Color('#0f0f0f');    // Almost black for screen bezel
    const silverAccent = new THREE.Color('#4a4a4a');   // Subtle silver accent

    return (
        <group ref={groupRef} position={[0, 0, 0]} rotation={[0.2, -0.3, 0]}>
            {/* Laptop Base / Bottom */}
            <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.2, 0.08, 2.1]} />
                <meshStandardMaterial
                    color={matteGray}
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Keyboard Area (Top of base) */}
            <mesh position={[0, 0.02, 0.15]} receiveShadow>
                <boxGeometry args={[2.9, 0.02, 1.4]} />
                <meshStandardMaterial
                    color={matteBlack}
                    roughness={0.9}
                    metalness={0.05}
                />
            </mesh>

            {/* Trackpad */}
            <mesh position={[0, 0.03, 0.6]} receiveShadow>
                <boxGeometry args={[0.8, 0.01, 0.5]} />
                <meshStandardMaterial
                    color={silverAccent}
                    roughness={0.6}
                    metalness={0.2}
                />
            </mesh>

            {/* Screen Frame / Lid */}
            <group ref={screenRef} position={[0, 1.1, -0.95]} rotation={[-0.15, 0, 0]}>
                {/* Screen Back (Lid exterior) */}
                <mesh position={[0, 0, -0.03]} castShadow>
                    <boxGeometry args={[3.2, 2.1, 0.06]} />
                    <meshStandardMaterial
                        color={matteGray}
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>

                {/* Screen Bezel */}
                <mesh position={[0, 0, 0.01]}>
                    <boxGeometry args={[3.0, 1.95, 0.02]} />
                    <meshStandardMaterial
                        color={screenBezel}
                        roughness={0.95}
                        metalness={0}
                    />
                </mesh>

                {/* Screen Display Area */}
                <mesh position={[0, 0.05, 0.02]}>
                    <planeGeometry args={[2.8, 1.75]} />
                    <meshBasicMaterial color="#111111" />
                </mesh>

                {/* HTML Content on Screen */}
                <Html
                    transform
                    occlude
                    position={[0, 0.05, 0.025]}
                    scale={0.14}
                    className="laptop-screen-content"
                >
                    <div className="screen-wrapper">
                        <div className="screen-header">
                            <div className="window-controls">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                            <span className="tab-title">tech-stack.dev</span>
                        </div>
                        <div className="screen-body">
                            <h1 className="tech-title">My Tech Stack</h1>
                            <div className="tech-grid">
                                <div className="tech-card react">
                                    <span className="tech-icon">⚛️</span>
                                    <span className="tech-name">React</span>
                                    <span className="tech-level">Expert</span>
                                </div>
                                <div className="tech-card node">
                                    <span className="tech-icon">🟢</span>
                                    <span className="tech-name">Node.js</span>
                                    <span className="tech-level">Advanced</span>
                                </div>
                                <div className="tech-card typescript">
                                    <span className="tech-icon">📘</span>
                                    <span className="tech-name">TypeScript</span>
                                    <span className="tech-level">Expert</span>
                                </div>
                                <div className="tech-card mongodb">
                                    <span className="tech-icon">🍃</span>
                                    <span className="tech-name">MongoDB</span>
                                    <span className="tech-level">Advanced</span>
                                </div>
                                <div className="tech-card threejs">
                                    <span className="tech-icon">🎨</span>
                                    <span className="tech-name">Three.js</span>
                                    <span className="tech-level">Intermediate</span>
                                </div>
                                <div className="tech-card nextjs">
                                    <span className="tech-icon">▲</span>
                                    <span className="tech-name">Next.js</span>
                                    <span className="tech-level">Advanced</span>
                                </div>
                            </div>
                            <div className="what-i-build">
                                <h2>What I Build</h2>
                                <ul>
                                    <li>Enterprise chat applications</li>
                                    <li>3D portfolio experiences</li>
                                    <li>CRM integrations</li>
                                    <li>Workflow automation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Html>
            </group>

            {/* Hinge */}
            <mesh position={[0, 0.02, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
                <meshStandardMaterial
                    color={silverAccent}
                    roughness={0.5}
                    metalness={0.3}
                />
            </mesh>
        </group>
    );
}

// Main Scene Component
export default function LaptopScene() {
    return (
        <div className="laptop-scene-container">
            <Canvas
                camera={{ position: [0, 2, 5], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
            >
                {/* Lighting - Premium matte look */}
                <ambientLight intensity={0.4} />
                <spotLight
                    position={[5, 8, 5]}
                    angle={0.4}
                    penumbra={0.8}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <spotLight
                    position={[-5, 5, 3]}
                    angle={0.5}
                    penumbra={1}
                    intensity={0.5}
                    color="#6b21a8"
                />
                <pointLight position={[0, 3, 2]} intensity={0.3} color="#ffffff" />

                {/* The Laptop */}
                <Laptop />

                {/* Subtle reflection/shadow on ground */}
                <ContactShadows
                    position={[0, -0.5, 0]}
                    opacity={0.4}
                    scale={8}
                    blur={2.5}
                    far={4}
                />

                {/* Environment for realistic reflections */}
                <Environment preset="city" />
            </Canvas>

            {/* Title overlay */}
            <div className="scene-overlay">
                <h1 className="scene-title">Software Engineering</h1>
                <p className="scene-subtitle">Crafting Digital Experiences</p>
            </div>
        </div>
    );
}
