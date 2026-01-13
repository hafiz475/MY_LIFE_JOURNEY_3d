import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    Environment,
    ContactShadows,
    useGLTF,
    useAnimations,
    MeshReflectorMaterial,
    Float,
    OrbitControls
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './AsusLaptopScene.scss';

// ASUS ROG Laptop Model with Open/Close Animation
function AsusLaptop({ isOpen, onAnimationComplete }) {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/asus_rog_laptop.glb');
    const { actions, mixer } = useAnimations(animations, scene);
    const animationRef = useRef(null);
    const prevIsOpen = useRef(isOpen);
    const timeoutRef = useRef(null);

    // Setup animation on mount
    useEffect(() => {
        if (!actions || !actions['monitor_monitor_0Action']) {
            console.log('Available animations:', Object.keys(actions || {}));
            return;
        }

        const action = actions['monitor_monitor_0Action'];
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        animationRef.current = action;

        // Set initial state (closed)
        action.reset();
        action.time = 0;
        action.paused = true;
        action.play();
    }, [actions]);

    // Handle open/close toggle
    useEffect(() => {
        if (!animationRef.current || !mixer) return;

        const action = animationRef.current;
        const duration = action.getClip().duration;

        if (isOpen !== prevIsOpen.current) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Reset and play animation
            action.reset();

            if (isOpen) {
                // Opening: play forward
                action.timeScale = 1;
                action.time = 0;
            } else {
                // Closing: play backward
                action.timeScale = -1;
                action.time = duration;
            }

            action.paused = false;
            action.play();
            prevIsOpen.current = isOpen;

            // Use timeout for completion detection (more reliable than finished event)
            timeoutRef.current = setTimeout(() => {
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }, duration * 1000 + 100); // Animation duration + small buffer
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen, mixer, onAnimationComplete]);

    // Subtle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
            <group
                ref={groupRef}
                position={[0, -0.5, 0]}
                rotation={[0, Math.PI * 0.8, 0]}
                scale={2.5}
            >
                <primitive object={scene} castShadow receiveShadow />
            </group>
        </Float>
    );
}

// Reflective Floor
function ReflectiveFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={40}
                roughness={0.7}
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

// Infinite Space Background Gradient
function SpaceBackground() {
    return (
        <mesh position={[0, 0, -20]}>
            <planeGeometry args={[100, 60]} />
            <meshBasicMaterial color="#020202" />
        </mesh>
    );
}

// Loading Fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#ff3c00',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif'
            }}>
                Loading ASUS ROG...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function AsusLaptopScene() {
    const navigate = useNavigate();
    const [isLaptopOpen, setIsLaptopOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggleLaptop = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsLaptopOpen(!isLaptopOpen);
    };

    const handleAnimationComplete = () => {
        setIsAnimating(false);
    };

    return (
        <div className="asus-scene-container">
            <Canvas
                camera={{ position: [0, 2, 6], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Camera Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                />

                {/* Fog for depth */}
                <fog attach="fog" args={['#000000', 8, 30]} />

                {/* Ambient lighting */}
                <ambientLight intensity={0.3} />

                {/* Main key light - warm orange/red like ROG branding */}
                <spotLight
                    position={[5, 8, 5]}
                    angle={0.4}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    color="#ffffff"
                />

                {/* Accent light - ROG red/orange */}
                <spotLight
                    position={[-6, 5, 2]}
                    angle={0.5}
                    penumbra={1}
                    intensity={1.5}
                    color="#ff3c00"
                />

                {/* Back rim light - cyan accent */}
                <spotLight
                    position={[0, 3, -5]}
                    angle={0.8}
                    penumbra={1}
                    intensity={1}
                    color="#00ffff"
                />

                {/* Fill light */}
                <pointLight position={[3, 2, 4]} intensity={0.5} color="#ffffff" />

                {/* Ground glow */}
                <pointLight position={[0, -1, 2]} intensity={0.4} color="#ff3c00" distance={5} />

                {/* The ASUS ROG Laptop Model */}
                <Suspense fallback={<Loader />}>
                    <AsusLaptop
                        isOpen={isLaptopOpen}
                        onAnimationComplete={handleAnimationComplete}
                    />
                </Suspense>

                {/* Reflective Floor */}
                <ReflectiveFloor />

                {/* Space Background */}
                <SpaceBackground />

                {/* Subtle shadow */}
                <ContactShadows
                    position={[0, -1.49, 0]}
                    opacity={0.7}
                    scale={15}
                    blur={2}
                    far={8}
                />

                {/* Environment for reflections */}
                <Environment preset="night" />

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom
                        intensity={0.4}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.6} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div className="asus-ui-overlay">
                {/* Back Button */}
                <button
                    className="asus-back-button"
                    onClick={() => navigate('/room')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Title */}
                <div className="asus-title">
                    <h1>ASUS ROG</h1>
                    <p>Republic of Gamers</p>
                </div>

                {/* Toggle Button */}
                <button
                    className={`asus-toggle-button ${isAnimating ? 'animating' : ''} ${isLaptopOpen ? 'open' : ''}`}
                    onClick={handleToggleLaptop}
                    disabled={isAnimating}
                >
                    <span className="toggle-icon">
                        {isLaptopOpen ? '📕' : '📖'}
                    </span>
                    <span className="toggle-text">
                        {isAnimating ? 'Animating...' : (isLaptopOpen ? 'Close Laptop' : 'Open Laptop')}
                    </span>
                </button>
            </div>
        </div>
    );
}

// Preload the model
useGLTF.preload('/assets/models/asus_rog_laptop.glb');
