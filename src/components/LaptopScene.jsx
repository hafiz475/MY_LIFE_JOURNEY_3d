import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    Environment,
    ContactShadows,
    useGLTF,
    MeshReflectorMaterial,
    Float,
    OrbitControls,
    useTexture
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import PhoneModel from './PhoneModel';
import woodenTexture from '../assets/wallpaper/laptop_wooden_texture.png';
import pantherWallpaper from '../assets/wallpaper/black-panther-home wallpaper.jpg';
import './LaptopScene.scss';

// 3D Gaming Laptop Model Component with Screen Content
function GamingLaptop() {
    const groupRef = useRef();
    const { scene } = useGLTF(`${import.meta.env.BASE_URL}assets/models/gaming_laptop.glb`);

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
                    position={[0.5, 0.4, 0.7]}
                    rotation={[0.18, Math.PI, 0]}
                    scale={0.055}
                    className="laptop-screen-content"
                >
                    <div className="neon-arcade-screen">
                        {/* Back to Interests - Neon Icon at top left */}
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
            </group>
        </Float>
    );
}

// Reflective Floor/Desk surface component with wooden texture
function ReflectiveFloor() {
    const texture = useTexture(woodenTexture);

    // Configure texture repeat for larger floor
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[200, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={20}
                roughness={0.8}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#8b7355"
                metalness={0.2}
                mirror={0.3}
                map={texture}
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

// Storm Window Component - with lightning, rain and clouds
function StormWindow() {
    const groupRef = useRef();
    const lightningRef = useRef();
    const skyFlashRef = useRef();
    const roomLightRef = useRef();
    const [lightningActive, setLightningActive] = useState(false);
    const lastFlashTime = useRef(0);

    // Lightning flash animation - more frequent and dramatic
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Trigger lightning every 2-4 seconds randomly
        if (time - lastFlashTime.current > 2 + Math.random() * 2) {
            lastFlashTime.current = time;

            // First flash
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 150);

            // Double flash effect
            setTimeout(() => {
                setLightningActive(true);
                setTimeout(() => setLightningActive(false), 100);
            }, 200);

            // Sometimes triple flash
            if (Math.random() < 0.4) {
                setTimeout(() => {
                    setLightningActive(true);
                    setTimeout(() => setLightningActive(false), 80);
                }, 350);
            }
        }

        // Update all lightning lights
        const intensity = lightningActive ? 1 : 0;
        if (lightningRef.current) {
            lightningRef.current.intensity = lightningActive ? 80 : 0;
        }
        if (skyFlashRef.current) {
            skyFlashRef.current.material.opacity = lightningActive ? 0.95 : 0;
        }
        if (roomLightRef.current) {
            roomLightRef.current.intensity = lightningActive ? 50 : 0;
        }
    });

    return (
        <group ref={groupRef} position={[3.5, 0.8, -7.8]}>
            {/* Window Frame */}
            <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[2.6, 2.5, 0.15]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
            </mesh>

            {/* Window Glass - dark stormy sky visible */}
            <mesh position={[0, 0, 0.1]}>
                <planeGeometry args={[2.2, 2.1]} />
                <meshStandardMaterial
                    color="#0a1525"
                    transparent
                    opacity={0.85}
                    roughness={0.1}
                    metalness={0.3}
                    emissive="#0a1520"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Sky flash - bright white flash behind clouds during lightning */}
            <mesh ref={skyFlashRef} position={[0, 0, 0.09]}>
                <planeGeometry args={[2.2, 2.1]} />
                <meshBasicMaterial
                    color="#e8f0ff"
                    transparent
                    opacity={0}
                />
            </mesh>

            {/* Storm Clouds - dark layered clouds */}
            <mesh position={[0, 0.6, 0.12]}>
                <planeGeometry args={[2, 0.8]} />
                <meshBasicMaterial
                    color="#1a1a2e"
                    transparent
                    opacity={0.9}
                />
            </mesh>
            <mesh position={[-0.4, 0.5, 0.13]}>
                <circleGeometry args={[0.4, 32]} />
                <meshBasicMaterial color="#151525" transparent opacity={0.85} />
            </mesh>
            <mesh position={[0.3, 0.7, 0.13]}>
                <circleGeometry args={[0.35, 32]} />
                <meshBasicMaterial color="#1a1a30" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.6, 0.45, 0.13]}>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="#151528" transparent opacity={0.85} />
            </mesh>

            {/* Lightning Bolt - Zigzag shape visible during flash */}
            {lightningActive && (
                <group position={[0.1, 0, 0.14]}>
                    {/* Main bolt */}
                    <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.2]}>
                        <planeGeometry args={[0.08, 0.3]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0.08, 0.25, 0]} rotation={[0, 0, -0.4]}>
                        <planeGeometry args={[0.06, 0.25]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]}>
                        <planeGeometry args={[0.07, 0.3]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -0.2]}>
                        <planeGeometry args={[0.05, 0.25]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[0.05, -0.4, 0]} rotation={[0, 0, 0.1]}>
                        <planeGeometry args={[0.04, 0.2]} />
                        <meshBasicMaterial color="#f0f8ff" />
                    </mesh>
                    {/* Glow around bolt */}
                    <mesh position={[0.05, 0.1, -0.01]}>
                        <planeGeometry args={[0.5, 1.2]} />
                        <meshBasicMaterial color="#a8c8ff" transparent opacity={0.3} />
                    </mesh>
                </group>
            )}

            {/* Rain streaks - multiple thin lines */}
            {[...Array(15)].map((_, i) => (
                <mesh key={i} position={[(i - 7) * 0.15, -0.3 + (i % 4) * 0.12, 0.14]}>
                    <planeGeometry args={[0.012, 0.25 + (i % 3) * 0.08]} />
                    <meshBasicMaterial
                        color="#6a8fc5"
                        transparent
                        opacity={0.5 + (i % 3) * 0.1}
                    />
                </mesh>
            ))}

            {/* Window dividers (cross pattern) */}
            <mesh position={[0, 0, 0.16]}>
                <boxGeometry args={[0.08, 2.2, 0.03]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.16]}>
                <boxGeometry args={[2.3, 0.08, 0.03]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Window sill */}
            <mesh position={[0, -1.15, 0.2]}>
                <boxGeometry args={[2.7, 0.12, 0.35]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Lightning Light from window - illuminates the scene */}
            <pointLight
                ref={lightningRef}
                position={[0, 0, 3]}
                color="#c8e0ff"
                intensity={0}
                distance={25}
                decay={1.5}
            />

            {/* Room-filling lightning light - for dramatic effect */}
            <pointLight
                ref={roomLightRef}
                position={[-3, 2, 5]}
                color="#d8e8ff"
                intensity={0}
                distance={30}
                decay={1}
            />

            {/* Ambient storm glow */}
            <pointLight
                position={[0, 0.3, 0.5]}
                color="#1a2a4a"
                intensity={0.5}
                distance={4}
                decay={2}
            />
        </group>
    );
}

// Lightning Flash Effect - creates dramatic room illumination
function LightningReflection() {
    const lightRef = useRef();
    const spotRef = useRef();
    const lastFlashTime = useRef(0);
    const [flashActive, setFlashActive] = useState(false);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Sync with storm window - same timing
        if (time - lastFlashTime.current > 2 + Math.random() * 2) {
            lastFlashTime.current = time;

            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 150);

            setTimeout(() => {
                setFlashActive(true);
                setTimeout(() => setFlashActive(false), 100);
            }, 200);
        }

        if (lightRef.current) {
            lightRef.current.intensity = flashActive ? 30 : 0;
        }
        if (spotRef.current) {
            spotRef.current.intensity = flashActive ? 40 : 0;
        }
    });

    return (
        <group>
            {/* Main reflection light on laptop */}
            <pointLight
                ref={lightRef}
                position={[2, 1, 2]}
                color="#d0e0ff"
                intensity={0}
                distance={15}
                decay={1.5}
            />
            {/* Spotlight for dramatic floor/desk reflection */}
            <spotLight
                ref={spotRef}
                position={[4, 5, 0]}
                angle={0.8}
                penumbra={1}
                color="#b8d0ff"
                intensity={0}
                distance={20}
                decay={1}
            />
        </group>
    );
}

// Batman Neon Logo Component - Dark Knight Style
function BatmanNeonLogo() {
    const groupRef = useRef();

    // Pulsing glow animation
    useFrame((state) => {
        if (groupRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.85;
            groupRef.current.children.forEach(child => {
                if (child.material && child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = pulse;
                }
            });
        }
    });

    // Accurate Batman Dark Knight logo shape
    const batShape = new THREE.Shape();
    const s = 0.5; // scale

    // Starting from center top (head)
    // Head left ear
    batShape.moveTo(0 * s, 0.3 * s);
    batShape.lineTo(-0.15 * s, 0.6 * s);  // Left ear tip
    batShape.lineTo(-0.25 * s, 0.25 * s); // Left ear base

    // Left wing - upper curve going out
    batShape.lineTo(-0.5 * s, 0.35 * s);
    batShape.quadraticCurveTo(-1.2 * s, 0.5 * s, -2.0 * s, 0.15 * s);

    // Left wing tip - sharp point
    batShape.lineTo(-2.5 * s, 0 * s);  // Sharp wing tip

    // Left wing - lower edge going back in
    batShape.lineTo(-1.8 * s, -0.1 * s);
    batShape.quadraticCurveTo(-1.2 * s, -0.15 * s, -0.8 * s, -0.25 * s);

    // Left bottom scallop
    batShape.quadraticCurveTo(-0.5 * s, -0.5 * s, -0.25 * s, -0.35 * s);

    // Center bottom point
    batShape.lineTo(0 * s, -0.55 * s);  // Bottom center point

    // Right bottom scallop
    batShape.lineTo(0.25 * s, -0.35 * s);
    batShape.quadraticCurveTo(0.5 * s, -0.5 * s, 0.8 * s, -0.25 * s);

    // Right wing - lower edge
    batShape.quadraticCurveTo(1.2 * s, -0.15 * s, 1.8 * s, -0.1 * s);

    // Right wing tip - sharp point
    batShape.lineTo(2.5 * s, 0 * s);  // Sharp wing tip

    // Right wing - upper curve
    batShape.lineTo(2.0 * s, 0.15 * s);
    batShape.quadraticCurveTo(1.2 * s, 0.5 * s, 0.5 * s, 0.35 * s);

    // Right ear
    batShape.lineTo(0.25 * s, 0.25 * s);
    batShape.lineTo(0.15 * s, 0.6 * s);  // Right ear tip
    batShape.lineTo(0 * s, 0.3 * s);     // Back to start

    const extrudeSettings = {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2
    };

    return (
        <group ref={groupRef} position={[3.5, 3.2, -7.85]} rotation={[0, 0, 0]}>
            {/* Batman logo - glowing yellow/gold */}
            <mesh>
                <extrudeGeometry args={[batShape, extrudeSettings]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffd700"
                    emissiveIntensity={0.9}
                    metalness={0.4}
                    roughness={0.1}
                />
            </mesh>

            {/* Glow light */}
            <pointLight
                position={[0, 0, 0.8]}
                color="#ffd700"
                intensity={3}
                distance={5}
                decay={2}
            />
        </group>
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

// Phone Overlay Component with Slide to Close
function PhoneOverlay({ currentTime, onClose }) {
    const [showHint, setShowHint] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const containerRef = useRef(null);

    // Show hint after 3 seconds for 2 seconds
    useEffect(() => {
        const showTimer = setTimeout(() => {
            setShowHint(true);
            const hideTimer = setTimeout(() => {
                setShowHint(false);
            }, 2000);
            return () => clearTimeout(hideTimer);
        }, 3000);
        return () => clearTimeout(showTimer);
    }, []);

    // Handle drag start
    const handleDragStart = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    // Handle drag move
    const handleDragMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const newPos = Math.max(0, Math.min(clientX - container.left - 25, container.width - 50));
        setSliderPosition(newPos);

        // If slid more than 80%, close
        if (newPos > container.width - 80) {
            onClose();
        }
    };

    // Handle drag end
    const handleDragEnd = () => {
        setIsDragging(false);
        setSliderPosition(0); // Reset position
    };

    return (
        <div
            className="phone-overlay-container"
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
        >
            {/* Phone Device Frame */}
            <div className="phone-device">
                {/* Phone Notch */}
                <div className="phone-notch"></div>

                {/* Phone Screen with Black Panther Wallpaper */}
                <div
                    className="phone-screen-content"
                    style={{ backgroundImage: `url(${pantherWallpaper})` }}
                >
                    {/* Time Display */}
                    <div className="phone-time-section">
                        <span className="phone-clock">{currentTime || '12:00'}</span>
                        <span className="phone-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>

                    {/* Icons Only Grid */}
                    <div className="phone-icons-grid">
                        <a href="https://wa.me/918015662012" target="_blank" rel="noopener noreferrer" className="phone-icon-btn whatsapp">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>

                        <a href="https://linkedin.com/in/md-hafizur-rahman" target="_blank" rel="noopener noreferrer" className="phone-icon-btn linkedin">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>

                        <a href="mailto:hafizurrahman2020@gmail.com" className="phone-icon-btn email">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </a>

                        <a href="tel:+918015662012" className="phone-icon-btn call">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </a>
                    </div>

                    {/* Slide to Back - iPhone style */}
                    <div className="slide-back-container">
                        {/* Hint Animation */}
                        <div className={`slide-hint ${showHint ? 'visible' : ''}`}>
                            Slide to go back to Desk →
                        </div>

                        {/* Slider Track */}
                        <div className="slide-track" ref={containerRef}>
                            <span className="slide-text">← Back to Desk</span>
                            <div
                                className={`slide-thumb ${isDragging ? 'dragging' : ''}`}
                                ref={sliderRef}
                                style={{ transform: `translateX(${sliderPosition}px)` }}
                                onMouseDown={handleDragStart}
                                onTouchStart={handleDragStart}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                    <path d="M15.59 16.59L20.17 12 15.59 7.41 17 6l6 6-6 6-1.41-1.41z" opacity="0.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
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
                {/* OrbitControls - Rotation only, no zoom */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    minAzimuthAngle={-Math.PI / 10}
                    maxAzimuthAngle={Math.PI / 10}
                />

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

                {/* Batman Neon Logo on Wall */}
                <BatmanNeonLogo />

                {/* Storm Window with Lightning - below Batman logo */}
                <StormWindow />

                {/* Lightning Reflection on Laptop */}
                <LightningReflection />

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

            {/* Phone Full Screen Overlay - Phone Frame with Black Panther Wallpaper */}
            {phoneActive && (
                <PhoneOverlay
                    currentTime={currentTime}
                    onClose={() => setPhoneActive(false)}
                />
            )}
        </div>
    );
}

// Preload the model
useGLTF.preload(`${import.meta.env.BASE_URL}assets/models/gaming_laptop.glb`);
