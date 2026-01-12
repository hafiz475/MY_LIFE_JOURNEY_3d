import { useRef, Suspense, useState, useEffect } from 'react';
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
import PhoneModel from './PhoneModel';
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
            <group ref={groupRef} position={[0, -1.2, 1]} rotation={[0.05, Math.PI - 0.325, 0]} scale={3.77}>
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
                    <div className="neon-arcade-screen">
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
    const [phoneActive, setPhoneActive] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    // Update time every minute
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="laptop-scene-container">
            <Canvas
                camera={{ position: [0, 1.5, 5], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
                style={{ display: phoneActive ? 'none' : 'block' }}
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

                {/* Phone Model with Contact Details */}
                <Suspense fallback={null}>
                    <PhoneModel
                        onClick={() => setPhoneActive(true)}
                    />
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

            {/* Phone Full Screen Overlay */}
            {phoneActive && (
                <div className="phone-fullscreen-overlay">
                    <div className="phone-frame">
                        <div className="phone-notch"></div>
                        <div className="phone-screen">
                            <div className="phone-status-bar">
                                <span className="status-time">{currentTime || '12:00'}</span>
                                <div className="status-icons">
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M2 22h2V12H2v10zm4 0h2V9H6v13zm4 0h2V6h-2v16zm4 0h2V3h-2v19z" />
                                    </svg>
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                                    </svg>
                                    <svg className="status-icon battery" viewBox="0 0 24 24" fill="currentColor" width="20" height="16">
                                        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="phone-time-large">{currentTime || '12:00'}</div>
                            <div className="phone-icons">
                                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="phone-app whatsapp">
                                    <svg className="app-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    <span className="app-name">WhatsApp</span>
                                </a>
                                <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="phone-app linkedin">
                                    <svg className="app-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    <span className="app-name">LinkedIn</span>
                                </a>
                                <a href="mailto:your.email@example.com" className="phone-app email">
                                    <svg className="app-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span className="app-name">Email</span>
                                </a>
                                <a href="tel:+919876543210" className="phone-app phone">
                                    <svg className="app-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                    <span className="app-name">Call</span>
                                </a>
                            </div>
                            <div className="phone-dock">
                                <button className="back-btn" onClick={() => setPhoneActive(false)}>
                                    ← Back to Desk
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Links - Circular icon buttons */}
            {!phoneActive && (
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
            )}
        </div>
    );
}

// Preload the model
useGLTF.preload('/assets/models/gaming_laptop.glb');
