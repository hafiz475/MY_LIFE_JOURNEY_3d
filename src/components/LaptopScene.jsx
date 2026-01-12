import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    Environment,
    ContactShadows,
    useGLTF,
    MeshReflectorMaterial,
    Float
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import './LaptopScene.scss';

// 3D Gaming Laptop Model Component with Screen Content
function GamingLaptop() {
    const groupRef = useRef();
    const { scene } = useGLTF('/assets/models/gaming_laptop.glb');

    // Subtle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            // Subtle rotation wobble - rotated 10 degrees anti-clockwise
            groupRef.current.rotation.y = Math.PI - 0.325 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
            groupRef.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
        }
    });

    return (
        // Centered position with proper rotation - scaled 30% more
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={groupRef} position={[0, -1.2, 1]} rotation={[0.15, Math.PI - 0.325, 0]} scale={3.77}>
                <primitive object={scene} castShadow receiveShadow />

                {/* Game Launch Screen Content */}
                <Html
                    transform
                    occlude
                    position={[0.19, 0.54, 0.12]}
                    rotation={[0.18, Math.PI, 0]}
                    scale={0.038}
                    className="laptop-screen-content"
                >
                    <div className="screen-wrapper game-screen">
                        <div className="screen-header">
                            <div className="window-controls">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                            <span className="tab-title">arcade.dev</span>
                        </div>
                        <div className="screen-body game-body">
                            <div className="game-content">
                                <div className="game-icon">🎮</div>
                                <h1 className="game-title">ARCADE</h1>
                                <p className="game-subtitle">Classic Pinball Experience</p>
                                <button
                                    className="play-button"
                                    onClick={() => {
                                        window.location.href = '/pinball';
                                    }}
                                >
                                    <span className="play-icon">▶</span>
                                    <span className="play-text">PLAY PINBALL</span>
                                </button>
                                <div className="game-stats">
                                    <div className="stat">
                                        <span className="stat-value">∞</span>
                                        <span className="stat-label">High Score</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">3</span>
                                        <span className="stat-label">Lives</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Html>
            </group>
        </Float>
    );
}

// Reflective Floor/Desk surface component
function ReflectiveFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.5}
                mirror={0.5}
            />
        </mesh>
    );
}

// Back Wall component
function BackWall() {
    return (
        <mesh position={[0, 4, -8]} receiveShadow>
            <planeGeometry args={[40, 15]} />
            <meshStandardMaterial
                color="#0a0a0a"
                roughness={0.9}
                metalness={0.1}
            />
        </mesh>
    );
}

// Loading fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#9333ea',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif'
            }}>
                Loading...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function LaptopScene() {
    return (
        <div className="laptop-scene-container">
            <Canvas
                camera={{ position: [0, 1.5, 5], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Fog for depth */}
                <fog attach="fog" args={['#080808', 5, 25]} />

                {/* Improved Lighting */}
                <ambientLight intensity={0.2} />

                {/* Main key light */}
                <spotLight
                    position={[5, 10, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                    color="#ffffff"
                />

                {/* Purple accent light */}
                <spotLight
                    position={[-6, 6, 2]}
                    angle={0.5}
                    penumbra={1}
                    intensity={1.5}
                    color="#8b5cf6"
                />

                {/* Cyan rim light from back */}
                <spotLight
                    position={[0, 3, -8]}
                    angle={0.8}
                    penumbra={1}
                    intensity={1}
                    color="#06b6d4"
                />

                {/* Fill light */}
                <pointLight position={[2, 2, 4]} intensity={0.5} color="#ffffff" />

                {/* Keyboard glow effect */}
                <pointLight position={[0, -0.5, 2]} intensity={0.3} color="#f97316" distance={3} />

                {/* The Gaming Laptop Model */}
                <Suspense fallback={<Loader />}>
                    <GamingLaptop />
                </Suspense>

                {/* Reflective Floor Surface */}
                <ReflectiveFloor />

                {/* Back Wall */}
                <BackWall />

                {/* Subtle shadow on ground */}
                <ContactShadows
                    position={[0, -1.79, 0]}
                    opacity={0.8}
                    scale={15}
                    blur={2}
                    far={8}
                />



                {/* High quality environment for reflections */}
                <Environment preset="night" />

                {/* Post-processing effects */}
                <EffectComposer>
                    <Bloom
                        intensity={0.3}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>

            </Canvas>


            {/* Contact Links - Circular icon buttons */}
            <div className="contact-links-section">
                <div className="contact-links">
                    <a href="mailto:your.email@example.com" className="contact-circle email" target="_blank" rel="noopener noreferrer" title="Email">
                        <span className="contact-icon">✉️</span>
                    </a>
                    <a href="tel:+919876543210" className="contact-circle phone" target="_blank" rel="noopener noreferrer" title="Call">
                        <span className="contact-icon">📞</span>
                    </a>
                    <a href="https://wa.me/919876543210" className="contact-circle whatsapp" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                        <span className="contact-icon">💬</span>
                    </a>
                    <a href="https://linkedin.com/in/yourprofile" className="contact-circle linkedin" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <span className="contact-icon">💼</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

// Preload the model
useGLTF.preload('/assets/models/gaming_laptop.glb');
