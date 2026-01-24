import { useRef, Suspense, useEffect, useState, useMemo } from 'react';
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
import './LandingScene.scss'; // Reuse the same styles

// Room and Bike Model with Animations and Blinking Notification Lights
function RoomBikeModel() {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/landingscene/room_and_bike.glb');
    const { actions, names } = useAnimations(animations, scene);

    // Refs for blinking lights
    const blinkingLightsRef = useRef([]);

    // Object positions for blinking lights with unique colors
    // These positions are approximated and may need fine-tuning based on model
    const blinkingObjects = useMemo(() => [
        { name: 'Bike', position: [-0.22, 0.7, 2.3], offset: 0, color: '#00FFFF' },           // Cyan
        { name: 'Football', position: [-0.22, 0.5, -0.3], offset: 0.5, color: '#FF6B00' },    // Orange
        { name: 'Laptop', position: [0.64, 0.42, -1.4], offset: 1.0, color: '#00BFFF' },      // Deep Sky Blue
        { name: 'Trophy', position: [-1.18, 0.8, -2.2], offset: 1.5, color: '#FFD700' },     // Gold
        { name: 'Blender_Icon', position: [0.15, 0.9, -2.7], offset: 2.0, color: '#FF6600' }, // Blender Orange
        // Photo frames on wall
        { name: 'PhotoFrame1', position: [-0.9, 1.2, -2.7], offset: 2.5, color: '#FF69B4' }, // Hot Pink
        { name: 'PhotoFrame2', position: [0.1, 1.5, -2.7], offset: 3.0, color: '#9370DB' }, // Medium Purple
        { name: 'PhotoFrame3', position: [1, 1.3, -2.7], offset: 3.5, color: '#00FF7F' }, // Spring Green
        // Switches
        { name: 'Room_Switch', position: [-1.95, 1.48, 0.96], offset: 4.0, color: '#FF4444' }, // Red
        { name: 'Lamp_Switch', position: [1.77, 0.9, -2.7], offset: 4.5, color: '#FFFF00' },  // Yellow
    ], []);

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

            // Enhance trophy appearance - make it golden and shiny
            if (
                name.includes('trophy') ||
                name.includes('award') ||
                name.includes('cup') ||
                name.includes('medal') ||
                name.includes('prize') ||
                name.includes('oscar') ||
                name.includes('figurine') ||
                name.includes('statue')
            ) {
                if (child.isMesh && child.material) {
                    // Create a new golden metallic material for the trophy
                    child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color('#ffd700'), // Gold color
                        metalness: 0.9,
                        roughness: 0.2,
                        emissive: new THREE.Color('#ff8c00'),
                        emissiveIntensity: 0.15,
                    });
                    // child.scale.multiplyScalar(1.1); // Make trophy slightly bigger
                    // console.log('Enhanced trophy:', child.name);
                }
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

    // Blinking animation for all notification lights
    useFrame((state) => {
        blinkingLightsRef.current.forEach((lightMesh, index) => {
            if (lightMesh) {
                const offset = blinkingObjects[index]?.offset || 0;
                const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3 + offset) * 0.4;
                lightMesh.scale.setScalar(0.08 + pulse * 0.05);
                if (lightMesh.material) {
                    lightMesh.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + offset) * 0.5;
                }
            }
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={1}>
            <primitive object={scene} />

            {/* Silver Blinking Notification Lights */}
            {blinkingObjects.map((obj, index) => (
                <mesh
                    key={obj.name}
                    ref={(el) => (blinkingLightsRef.current[index] = el)}
                    position={obj.position}
                >
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial
                        color={obj.color}
                        transparent
                        opacity={0.9}
                        toneMapped={false}
                    />
                </mesh>
            ))}

            {/* Point lights for glow effect on each blinking light */}
            {blinkingObjects.map((obj) => (
                <pointLight
                    key={`light-${obj.name}`}
                    position={obj.position}
                    color={obj.color}
                    intensity={0.5}
                    distance={1.5}
                />
            ))}
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

                {/* Desk/Trophy spotlight for better illumination */}
                <pointLight
                    position={[2, 4, 1]}
                    intensity={15}
                    distance={8}
                    color="#fff8e0"
                    castShadow
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
            </div>
        </div>
    );
}

// Preload model
useGLTF.preload('/assets/models/landingscene/room_and_bike.glb');
