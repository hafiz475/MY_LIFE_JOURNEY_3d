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
function RoomBikeModel({ isNightMode, onToggleNight }) {
    const navigate = useNavigate();
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/landingscene/room_and_bike.glb');
    const { actions, names } = useAnimations(animations, scene);
    const [hovered, setHovered] = useState(false);

    // Refs for blinking lights
    const blinkingLightsRef = useRef([]);

    // Object positions for blinking lights - silver color, smaller size
    // Removed PhotoFrame3 as requested
    const blinkingObjects = useMemo(() => [
        { name: 'Bike', position: [-0.22, 0.7, 2.3], offset: 0, isSwitch: false, targetShirt: 'enfield' },
        { name: 'Football', position: [-0.22, 0.5, -0.3], offset: 0.5, isSwitch: false, targetShirt: 'football' },
        { name: 'Laptop', position: [0.64, 0.42, -1.4], offset: 1.0, isSwitch: false, targetShirt: 'fullstack' },
        { name: 'Trophy', position: [-1.18, 0.8, -2.2], offset: 1.5, isSwitch: false, targetShirt: 'football' },
        { name: 'Blender_Icon', position: [0.15, 0.9, -2.7], offset: 2.0, isSwitch: false, targetShirt: 'blender' },
        // Photo frames on wall
        { name: 'PhotoFrame1', position: [-0.9, 1.2, -2.7], offset: 2.5, isSwitch: false, targetShirt: 'fullstack' },
        { name: 'PhotoFrame2', position: [0.1, 1.5, -2.7], offset: 3.0, isSwitch: false, targetShirt: 'fullstack' },
        // Switches - clickable to toggle day/night
        { name: 'Room_Switch', position: [-1.95, 1.48, 0.96], offset: 4.0, isSwitch: true },
        { name: 'Lamp_Switch', position: [1.77, 0.9, -2.7], offset: 4.5, isSwitch: true },
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
                }
            }
        });

        // Play all available animations
        names.forEach((name) => {
            if (actions[name]) {
                actions[name].play();
            }
        });
    }, [scene, actions, names]);

    // Change cursor on hover over all interactive pips
    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered]);

    // Blinking animation for all notification lights - vibrant silver glow
    useFrame((state) => {
        blinkingLightsRef.current.forEach((lightMesh, index) => {
            if (lightMesh && lightMesh.material) {
                const offset = blinkingObjects[index]?.offset || 0;
                const pulse = Math.sin(state.clock.elapsedTime * 3.5 + offset);

                // Pulsate both opacity and emissive intensity for maximum visibility
                lightMesh.material.opacity = 0.6 + pulse * 0.4;
                lightMesh.material.emissiveIntensity = 2.0 + pulse * 1.5;
            }
        });
    });

    const handlePipClick = (obj) => {
        if (obj.isSwitch) {
            if (onToggleNight) onToggleNight();
        } else if (obj.targetShirt) {
            navigate('/room', { state: { shirt: obj.targetShirt } });
        }
    };

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={1}>
            <primitive object={scene} />

            {/* Silver Blinking Notification Lights - smaller size, no emissive */}
            {blinkingObjects.map((obj, index) => (
                <mesh
                    key={obj.name}
                    ref={(el) => (blinkingLightsRef.current[index] = el)}
                    position={obj.position}
                    onClick={() => handlePipClick(obj)}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <sphereGeometry args={[0.035, 16, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#00f2ff"
                        emissiveIntensity={2}
                        transparent
                        opacity={0.8}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>
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
            <div className="scene-loader-container">
                <div className="spinner"></div>
                <div className="loader-text">Loading Scene</div>
            </div>
        </Html>
    );
}

// Main Scene Component
export default function RoomBikeScene() {
    const navigate = useNavigate();
    const [isNightMode, setIsNightMode] = useState(false);

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
    };

    return (
        <div className="landing-scene-container">
            <Canvas
                camera={{ position: [5.5, 4, 5.5], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Camera Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    minDistance={3}
                    maxDistance={25}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    target={[0, 1.5, 0]}
                />

                {/* Background color - changes based on day/night */}
                <color attach="background" args={[isNightMode ? '#1a1525' : '#c9a0af']} />

                {/* Ambient lighting - dimmer at night */}
                <ambientLight
                    intensity={isNightMode ? 0.15 : 0.4}
                    color={isNightMode ? '#404060' : '#fff5f8'}
                />

                {/* Main Directional Sun Light - only visible during day */}
                {!isNightMode && (
                    <directionalLight
                        position={[8, 15, 5]}
                        intensity={1.2}
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
                )}

                {/* Moon light - subtle blue light at night */}
                {isNightMode && (
                    <directionalLight
                        position={[-5, 12, 8]}
                        intensity={0.3}
                        color="#8090ff"
                    />
                )}

                {/* Secondary fill light - dimmer at night */}
                <directionalLight
                    position={[-5, 8, -5]}
                    intensity={isNightMode ? 0.1 : 0.3}
                    color={isNightMode ? '#303050' : '#ffeef5'}
                />

                {/* Hemisphere light - adjusted for day/night */}
                <hemisphereLight
                    args={[
                        isNightMode ? '#303050' : '#ffd0e0',
                        isNightMode ? '#101020' : '#8b6070',
                        isNightMode ? 0.15 : 0.2
                    ]}
                />

                {/* Ceiling Lamp Light - only on at night, positioned at ceiling lamp */}
                {isNightMode && (
                    <>
                        <pointLight
                            position={[0.1, 1.62, -1]}
                            intensity={10}
                            distance={10}
                            color="#ffddaa"
                            castShadow
                        />
                        {/* Secondary warm glow from lamp */}
                        {/* <pointLight
                            position={[1.6, 0.9, -2.3]}
                            intensity={3}
                            distance={6}
                            color="#ffcc88"
                        /> */}
                    </>
                )}

                {/* Desk/Trophy spotlight - dimmer at night */}
                <pointLight
                    position={[2, 4, 1]}
                    intensity={isNightMode ? 3 : 7}
                    distance={8}
                    color={isNightMode ? '#404060' : '#fff8e0'}
                    castShadow
                />

                {/* Gradient Background */}
                {!isNightMode && <GradientBackground />}

                {/* Models */}
                <Suspense fallback={<Loader />}>
                    <RoomBikeModel
                        isNightMode={isNightMode}
                        onToggleNight={toggleNightMode}
                    />
                </Suspense>

                {/* Transparent Shadow Floor */}
                <ShadowFloor />

                {/* Environment for subtle reflections */}
                <Environment preset={isNightMode ? "night" : "sunset"} />

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom
                        intensity={isNightMode ? 1.5 : 0.4}
                        luminanceThreshold={isNightMode ? 0.2 : 0.6}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={isNightMode ? 0.6 : 0.3} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div className="landing-ui-overlay">
                {/* Back Button */}
                <button
                    className="landing-back-button"
                    onClick={() => navigate('/starFishIsland')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    </svg>
                    Back to Sea
                </button>
            </div>
        </div>
    );
}

// Preload model
useGLTF.preload('/assets/models/landingscene/room_and_bike.glb');
