import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    useGLTF,
    useAnimations,
    OrbitControls,
    Environment
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './IslandScene.scss';

// Clickable House with blinking effect
function ClickableHouse({ onClick }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Blinking animation
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime();
            // Pulsing glow effect
            const pulse = Math.sin(t * 2.5) * 0.5 + 0.5;
            meshRef.current.material.opacity = hovered ? 0.7 : 0.4 + pulse * 0.2;
            meshRef.current.scale.setScalar(1 + pulse * 0.1);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[1, 4, -0.5]}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => {
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = 'auto';
            }}
        >
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial
                color="#ffdd44"
                emissive="#ffaa00"
                emissiveIntensity={0.6}
                transparent
                opacity={0.5}
                depthWrite={false}
            />
        </mesh>
    );
}

// Clickable Plane with blinking effect
function ClickablePlane({ onClick }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Blinking animation
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime();
            const pulse = Math.sin(t * 2.5 + 1.5) * 0.5 + 0.5;
            meshRef.current.material.opacity = hovered ? 0.7 : 0.4 + pulse * 0.2;
            meshRef.current.scale.setScalar(1 + pulse * 0.1);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[-6, 1, 5]}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => {
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = 'auto';
            }}
        >
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshStandardMaterial
                color="#44ddff"
                emissive="#00aaff"
                emissiveIntensity={0.6}
                transparent
                opacity={0.5}
                depthWrite={false}
            />
        </mesh>
    );
}

// Island with Boat Model
function IslandModel({ onHouseClick, onPlaneClick }) {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/landingscene/island_boat.glb');
    const { actions, names } = useAnimations(animations, scene);

    useEffect(() => {
        // Center the model
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);
        scene.position.y += box.getSize(new THREE.Vector3()).y / 2;

        // Enable shadows on all meshes
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Play all available animations
        console.log('Available island animations:', names);
        names.forEach((name) => {
            if (actions[name]) {
                actions[name].play();
            }
        });
    }, [scene, actions, names]);

    return (
        <group ref={groupRef} position={[0, -1, 0]} scale={0.3}>
            <primitive object={scene} />
            {/* Clickable hotspots */}
            <ClickableHouse onClick={onHouseClick} />
            <ClickablePlane onClick={onPlaneClick} />
        </group>
    );
}

// Static Clouds (no animation for performance)
function StaticClouds() {
    const { scene } = useGLTF('/assets/models/cloud.glb');
    const groupRef = useRef();
    const cloudsInitialized = useRef(false);

    useEffect(() => {
        if (!groupRef.current || cloudsInitialized.current) return;
        cloudsInitialized.current = true;

        // Create static clouds at fixed positions near the house
        const cloudPositions = [
            { x: -4, y: 3, z: -3, scale: 0.8 },
            { x: 5, y: 3.5, z: -2, scale: 1.0 },
            { x: -6, y: 4, z: 3, scale: 0.7 },
            { x: 7, y: 3, z: 4, scale: 0.9 },
            { x: 0, y: 4.5, z: -6, scale: 1.1 },
            { x: -3, y: 3.2, z: 5, scale: 0.6 },
        ];

        cloudPositions.forEach((pos) => {
            const clone = scene.clone(true);

            clone.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.setScalar(1.15);
                    child.material.roughness = 1;
                    child.material.metalness = 0;
                    child.material.transparent = true;
                    child.material.opacity = 0.95;
                    child.material.depthWrite = false;
                }
            });

            clone.position.set(pos.x, pos.y, pos.z);
            clone.scale.set(pos.scale, pos.scale, pos.scale);
            groupRef.current.add(clone);
        });
    }, [scene]);

    return <group ref={groupRef} />;
}

// Sky Gradient Background matching reference
function SkyBackground() {
    const meshRef = useRef();

    useEffect(() => {
        if (meshRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = 2;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // Light blue gradient matching the reference image
            const gradient = ctx.createLinearGradient(0, 0, 0, 512);
            gradient.addColorStop(0, '#b8d4e8');
            gradient.addColorStop(0.3, '#c5dced');
            gradient.addColorStop(0.6, '#d4e6f2');
            gradient.addColorStop(1, '#e8f0f5');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 2, 512);

            const texture = new THREE.CanvasTexture(canvas);
            meshRef.current.material.map = texture;
            meshRef.current.material.needsUpdate = true;
        }
    }, []);

    return (
        <mesh ref={meshRef} position={[0, 5, -50]}>
            <planeGeometry args={[150, 100]} />
            <meshBasicMaterial side={THREE.DoubleSide} />
        </mesh>
    );
}

// Loading Fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#4a7c9b',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 2px 10px rgba(255,255,255,0.5)'
            }}>
                Loading Island...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function IslandScene() {
    const navigate = useNavigate();

    const handleHouseClick = () => {
        navigate('/landing');
    };

    const handlePlaneClick = () => {
        navigate(-1); // Go back
    };

    return (
        <div className="island-scene-container">
            <Canvas
                camera={{ position: [8, 4, 8], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Camera Controls - limited orbit, no zoom */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minAzimuthAngle={-Math.PI / 6}
                    maxAzimuthAngle={Math.PI / 6}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 2.5}
                    target={[0, 0.5, 0]}
                />

                {/* Background color - light blue sky */}
                <color attach="background" args={['#c0dae8']} />

                {/* Ambient lighting */}
                <ambientLight intensity={0.7} color="#e8f4ff" />

                {/* Main Sun Light */}
                <directionalLight
                    position={[10, 20, 8]}
                    intensity={1.8}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                    shadow-camera-near={0.5}
                    shadow-camera-far={60}
                    shadow-bias={-0.0001}
                    color="#fff8e8"
                />

                {/* Secondary fill light */}
                <directionalLight
                    position={[-8, 10, -8]}
                    intensity={0.4}
                    color="#e0f0ff"
                />

                {/* Hemisphere light for natural sky/ground bounce */}
                <hemisphereLight
                    args={['#87ceeb', '#4a7c59', 0.5]}
                />

                {/* Sky Background */}
                <SkyBackground />

                {/* Static Clouds - closer to house, no animation */}
                <StaticClouds />

                {/* Island Model with clickable elements */}
                <Suspense fallback={<Loader />}>
                    <IslandModel
                        onHouseClick={handleHouseClick}
                        onPlaneClick={handlePlaneClick}
                    />
                </Suspense>

                {/* Environment for reflections on water */}
                <Environment preset="city" />

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom
                        intensity={0.15}
                        luminanceThreshold={0.8}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.2} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div className="island-ui-overlay">
                {/* Back Button */}
                <button
                    className="island-back-button"
                    onClick={() => navigate('/')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Title */}
                <div className="island-title">
                    <h1>Island Scene</h1>
                    <p>Choose your destination</p>
                </div>

                {/* Navigation Hotspot Buttons */}
                <div className="island-nav-hotspots">
                    <button
                        className="island-hotspot island-hotspot-house"
                        onClick={handleHouseClick}
                    >
                        <span className="hotspot-icon">🏠</span>
                        <span className="hotspot-label">Enter Studio</span>
                    </button>
                    <button
                        className="island-hotspot island-hotspot-plane"
                        onClick={handlePlaneClick}
                    >
                        <span className="hotspot-icon">✈️</span>
                        <span className="hotspot-label">Board Plane</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Preload models
useGLTF.preload('/assets/models/landingscene/island_boat.glb');
useGLTF.preload('/assets/models/cloud.glb');
