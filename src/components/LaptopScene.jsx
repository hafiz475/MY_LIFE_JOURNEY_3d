import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    Environment,
    ContactShadows,
    useGLTF,
    MeshReflectorMaterial,
    Float,
    OrbitControls
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
                    style={{ backgroundImage: `url('/src/assets/wallpaper/black-panther-home wallpaper.jpg')` }}
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
useGLTF.preload('/assets/models/gaming_laptop.glb');
