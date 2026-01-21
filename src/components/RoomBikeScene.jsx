import { useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
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
import './LandingScene.scss'; // Reuse the same styles

// Room and Bike Model with Animations
function RoomBikeModel() {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/landingscene/room_and_bike.glb');
    const { actions, names } = useAnimations(animations, scene);

    useEffect(() => {
        // Center the model
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);
        scene.position.y += box.getSize(new THREE.Vector3()).y / 2;

        // Enable shadows on all meshes and hide annotation hotspots
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            // Hide annotation hotspots (numbered markers 1, 2, 3, etc.)
            const name = child.name.toLowerCase();
            if (
                name.includes('hotspot') ||
                name.includes('annotation') ||
                name.includes('marker') ||
                name.includes('label') ||
                name.includes('point') ||
                /^\d+$/.test(child.name) ||
                name.includes('sphere') && child.geometry?.type === 'SphereGeometry'
            ) {
                child.visible = false;
            }
        });

        // Play all available animations
        console.log('Available room_and_bike animations:', names);
        names.forEach((name) => {
            if (actions[name]) {
                actions[name].play();
            }
        });
    }, [scene, actions, names]);

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={1}>
            <primitive object={scene} />
        </group>
    );
}


// Transparent Shadow-Catching Floor
function ShadowFloor() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.01, 0]}
            receiveShadow
        >
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.4} color="#4a3040" />
        </mesh>
    );
}

// Gradient Background Sphere
function GradientBackground() {
    const meshRef = useRef();

    useEffect(() => {
        if (meshRef.current) {
            // Create a gradient texture
            const canvas = document.createElement('canvas');
            canvas.width = 2;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // Create vertical gradient matching reference (pink/purple tones)
            const gradient = ctx.createLinearGradient(0, 0, 0, 512);
            gradient.addColorStop(0, '#d4a5b9');    // Top - soft pink
            gradient.addColorStop(0.5, '#c8a0b0'); // Middle - dusty rose
            gradient.addColorStop(1, '#b89aa8');   // Bottom - muted purple

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 2, 512);

            const texture = new THREE.CanvasTexture(canvas);
            meshRef.current.material.map = texture;
            meshRef.current.material.needsUpdate = true;
        }
    }, []);

    return (
        <mesh ref={meshRef} position={[0, 0, -30]}>
            <planeGeometry args={[120, 80]} />
            <meshBasicMaterial side={THREE.DoubleSide} />
        </mesh>
    );
}

// Loading Fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#8b5a7a',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
                Loading Scene...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function RoomBikeScene() {
    const navigate = useNavigate();

    return (
        <div className="landing-scene-container">
            <Canvas
                camera={{ position: [10, 8, 10], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Camera Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    minDistance={5}
                    maxDistance={25}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    target={[0, 1.5, 0]}
                />

                {/* Background color */}
                <color attach="background" args={['#c9a0af']} />

                {/* Ambient lighting for base illumination */}
                <ambientLight intensity={0.6} color="#fff5f8" />

                {/* Main Directional Sun Light - pointing down for shadows */}
                <directionalLight
                    position={[8, 15, 5]}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-15}
                    shadow-camera-right={15}
                    shadow-camera-top={15}
                    shadow-camera-bottom={-15}
                    shadow-camera-near={0.5}
                    shadow-camera-far={50}
                    shadow-bias={-0.0001}
                    color="#fff8f0"
                />

                {/* Secondary fill light */}
                <directionalLight
                    position={[-5, 8, -5]}
                    intensity={0.5}
                    color="#ffeef5"
                />

                {/* Hemisphere light for natural sky/ground lighting */}
                <hemisphereLight
                    args={['#ffd0e0', '#8b6070', 0.4]}
                />

                {/* Gradient Background */}
                <GradientBackground />

                {/* Models */}
                <Suspense fallback={<Loader />}>
                    <RoomBikeModel />
                </Suspense>

                {/* Transparent Shadow Floor */}
                <ShadowFloor />

                {/* Environment for subtle reflections */}
                <Environment preset="sunset" />

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom
                        intensity={0.15}
                        luminanceThreshold={0.8}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.3} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div className="landing-ui-overlay">
                {/* Back Button */}
                <button
                    className="landing-back-button"
                    onClick={() => navigate('/')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Title */}
                <div className="landing-title">
                    <h1>Room & Bike Scene</h1>
                    <p>Low Poly Interior</p>
                </div>
            </div>
        </div>
    );
}

// Preload model
useGLTF.preload('/assets/models/landingscene/room_and_bike.glb');
