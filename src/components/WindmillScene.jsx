import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    useGLTF,
    useAnimations,
    OrbitControls,
    Environment,
    ContactShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './WindmillScene.scss';
import { useMemo } from 'react';

// The Windmill 3D Model with Animation
function WindmillModel() {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/landingscene/working2.glb');
    const { actions } = useAnimations(animations, scene);

    // Play all animations on mount
    useEffect(() => {
        if (actions) {
            // Play all available animations
            Object.values(actions).forEach(action => {
                if (action) {
                    action.play();
                }
            });
        }
    }, [actions]);

    // Gentle rotation animation for the whole model
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    // Setup shadows for the model
    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]} scale={0.5}>
            <primitive object={scene} />
        </group>
    );
}

// Lime Green Floor
function GrassFloor() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3.75, 0]}
            receiveShadow
        >
            <circleGeometry args={[18, 64]} />
            <meshStandardMaterial
                color="#32CD32"
                roughness={0.8}
                metalness={0}
            />
        </mesh>
    );
}

// Animated Water - stylized low-poly water around the island
function AnimatedWater() {
    const waterRef = useRef();

    // Create water geometry - a ring around the island (hole in middle)
    const waterGeometry = useMemo(() => {
        // Inner radius = island size (20), outer radius = water extent
        const geo = new THREE.RingGeometry(20, 150, 64, 20);
        return geo;
    }, []);

    // Animate water waves
    useFrame((state) => {
        if (waterRef.current) {
            const positions = waterRef.current.geometry.attributes.position;
            const time = state.clock.elapsedTime;

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);

                // Create gentle wave pattern
                const wave1 = Math.sin(x * 0.05 + time * 0.5) * 0.15;
                const wave2 = Math.cos(y * 0.05 + time * 0.3) * 0.1;

                positions.setZ(i, wave1 + wave2);
            }
            positions.needsUpdate = true;
        }
    });

    return (
        <mesh
            ref={waterRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3.9, 0]}
            receiveShadow
        >
            <primitive object={waterGeometry} attach="geometry" />
            <meshStandardMaterial
                color="#1E90FF"
                transparent
                opacity={0.9}
                roughness={0.1}
                metalness={0.4}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Shoreline Foam - animated waves at the edge where water meets land
function ShorelineFoam() {
    const foamRef = useRef();
    const materialRef = useRef();

    // Animate foam opacity for wave effect
    useFrame((state) => {
        if (materialRef.current) {
            const time = state.clock.elapsedTime;
            // Pulsing opacity to simulate waves washing up
            const wave = (Math.sin(time * 2) + 1) * 0.5; // 0 to 1
            materialRef.current.opacity = 0.4 + wave * 0.4; // 0.4 to 0.8
        }
        if (foamRef.current) {
            // Subtle scale pulsing
            const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
            foamRef.current.scale.set(scale, scale, 1);
        }
    });

    return (
        <mesh
            ref={foamRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3.72, 0]}
        >
            <ringGeometry args={[17.5, 21, 64]} />
            <meshStandardMaterial
                ref={materialRef}
                color="#ffffff"
                transparent
                opacity={0.6}
                roughness={1}
                metalness={0}
            />
        </mesh>
    );
}

// Animated Clouds - More clouds for a fuller sky
function AnimatedClouds() {
    const { scene } = useGLTF('/assets/models/cloud.glb');
    const groupRef = useRef();
    const cloudsRef = useRef([]);

    // Cloud positions and animation data - 12 clouds for a fuller sky
    const cloudData = useMemo(() => [
        { startX: -20, y: 6, z: -8, speed: 0.3, scale: 1.2 },
        { startX: -25, y: 7, z: -4, speed: 0.25, scale: 0.9 },
        { startX: -30, y: 5.5, z: 0, speed: 0.35, scale: 1.0 },
        { startX: -22, y: 8, z: 4, speed: 0.28, scale: 0.8 },
        { startX: -28, y: 6.5, z: 8, speed: 0.32, scale: 1.1 },
        { startX: -18, y: 7.5, z: -12, speed: 0.22, scale: 0.7 },
        // Additional clouds
        { startX: -15, y: 5, z: 10, speed: 0.33, scale: 0.85 },
        { startX: -35, y: 9, z: -6, speed: 0.2, scale: 1.3 },
        { startX: -12, y: 6.5, z: 6, speed: 0.38, scale: 0.75 },
        { startX: -40, y: 7, z: -2, speed: 0.27, scale: 1.0 },
        { startX: -8, y: 8.5, z: -10, speed: 0.24, scale: 0.65 },
        { startX: -32, y: 5.8, z: 12, speed: 0.31, scale: 0.95 },
    ], []);

    useEffect(() => {
        if (!groupRef.current) return;

        // Clear existing clouds
        while (groupRef.current.children.length > 0) {
            groupRef.current.remove(groupRef.current.children[0]);
        }
        cloudsRef.current = [];

        // Create cloud instances
        cloudData.forEach((data, index) => {
            const clone = scene.clone(true);

            clone.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.setScalar(1.1);
                    child.material.roughness = 1;
                    child.material.metalness = 0;
                    child.material.transparent = true;
                    child.material.opacity = 0.95;
                    child.material.depthWrite = false;
                }
            });

            clone.position.set(data.startX, data.y, data.z);
            clone.scale.setScalar(data.scale);
            groupRef.current.add(clone);
            cloudsRef.current.push({ mesh: clone, ...data });
        });
    }, [scene, cloudData]);

    // Animate clouds drifting across the sky
    useFrame((state, delta) => {
        cloudsRef.current.forEach((cloud) => {
            cloud.mesh.position.x += cloud.speed * delta * 3;

            // Add gentle bobbing motion
            cloud.mesh.position.y = cloud.y + Math.sin(state.clock.elapsedTime * 0.5 + cloud.z) * 0.2;

            // Reset cloud position when it goes off screen
            if (cloud.mesh.position.x > 25) {
                cloud.mesh.position.x = -25 - Math.random() * 10;
            }
        });
    });

    return <group ref={groupRef} />;
}

// Cute Toon Trees - 3 trees positioned around the windmill
function ToonTrees() {
    const { scene } = useGLTF('/assets/models/landingscene/cute_toon_tree.glb');
    const groupRef = useRef();

    // Tree positions around the windmill
    const treePositions = useMemo(() => [
        { x: -5, y: -3.75, z: 3, scale: 0.6, rotation: 0.3 },
        { x: 4, y: -3.75, z: -4, scale: 0.5, rotation: -0.5 },
        { x: 6, y: -3.75, z: 2, scale: 0.55, rotation: 0.8 },
    ], []);

    useEffect(() => {
        if (!groupRef.current) return;

        // Clear existing trees
        while (groupRef.current.children.length > 0) {
            groupRef.current.remove(groupRef.current.children[0]);
        }

        // Create tree instances
        treePositions.forEach((pos) => {
            const clone = scene.clone(true);

            clone.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            clone.position.set(pos.x, pos.y, pos.z);
            clone.scale.setScalar(pos.scale);
            clone.rotation.y = pos.rotation;
            groupRef.current.add(clone);
        });
    }, [scene, treePositions]);

    return <group ref={groupRef} />;
}

// Animated Seaplane - Starts from camera, makes one big smooth arc around windmill, lands gracefully
function SeaplaneLanding() {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/gottfried_freiherr_von_banfields_seaplane.glb');
    const { actions } = useAnimations(animations, scene);
    const startTimeRef = useRef(null);
    const hasLandedRef = useRef(false);

    // Landing animation duration
    const FLIGHT_DURATION = 18; // 18 seconds total (slower)

    // Starting position (opposite quadrant - far side)
    const START_POS = { x: -12, y: 5, z: -12 };
    // Landing position (next to the windmill)
    const END_POS = { x: -3, y: -3.5, z: 2 };

    // Enable shadows on the model
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Play propeller animation if available
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.play();
                }
            });
        }
    }, [scene, actions]);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Initialize start time
        if (startTimeRef.current === null) {
            startTimeRef.current = state.clock.elapsedTime;
        }

        const elapsed = state.clock.elapsedTime - startTimeRef.current;
        const progress = Math.min(elapsed / FLIGHT_DURATION, 1);

        if (progress < 1) {
            // Ultra-smooth easing function (ease in-out quintic)
            const easeProgress = progress < 0.5
                ? 16 * Math.pow(progress, 5)
                : 1 - Math.pow(-2 * progress + 2, 5) / 2;

            // One big arc - starts from far side, sweeps around windmill toward camera
            // Angle goes from 0 (front/far) sweeping around
            const startAngle = 0; // Start from far side (negative z)
            const endAngle = startAngle + Math.PI * 1.3; // ~1.3 rotations for smooth arc
            const currentAngle = startAngle + (endAngle - startAngle) * easeProgress;

            // Radius starts large and shrinks as it approaches landing
            const startRadius = 14;
            const endRadius = 4;
            const currentRadius = startRadius + (endRadius - startRadius) * easeProgress;

            // Calculate position on the arc
            const arcX = Math.sin(currentAngle) * currentRadius;
            const arcZ = Math.cos(currentAngle) * currentRadius;

            // Height - smooth descent from START to END
            const heightProgress = Math.pow(easeProgress, 1.5); // Slower initial descent
            const currentY = START_POS.y + (END_POS.y - START_POS.y) * heightProgress;

            // Blend towards exact landing position in the last 20%
            const landingBlend = progress > 0.8 ? (progress - 0.8) / 0.2 : 0;
            const smoothLandingBlend = landingBlend * landingBlend * (3 - 2 * landingBlend); // smoothstep

            const finalX = arcX * (1 - smoothLandingBlend) + END_POS.x * smoothLandingBlend;
            const finalZ = arcZ * (1 - smoothLandingBlend) + END_POS.z * smoothLandingBlend;
            const finalY = currentY * (1 - smoothLandingBlend) + END_POS.y * smoothLandingBlend;

            groupRef.current.position.set(finalX, finalY, finalZ);

            // Calculate direction of movement for rotation
            const deltaAngle = 0.05;
            const nextAngle = currentAngle + deltaAngle;
            const nextRadius = currentRadius - deltaAngle * (startRadius - endRadius) / (endAngle - startAngle);
            const nextX = Math.sin(nextAngle) * nextRadius;
            const nextZ = Math.cos(nextAngle) * nextRadius;

            // Face the direction of travel
            const dirX = nextX - arcX;
            const dirZ = nextZ - arcZ;
            const targetRotation = Math.atan2(dirX, dirZ);

            // Smooth rotation - face movement direction
            groupRef.current.rotation.y = targetRotation;

            // Gentle banking into turns (reduces as landing approaches)
            const bankAmount = 0.12 * (1 - easeProgress);
            groupRef.current.rotation.z = Math.sin(currentAngle * 2) * bankAmount;

            // Slight pitch during descent (nose slightly down, levels out on landing)
            groupRef.current.rotation.x = -0.08 * (1 - easeProgress);
        } else {
            // Landed - set final position perfectly
            if (!hasLandedRef.current) {
                hasLandedRef.current = true;
                groupRef.current.position.set(END_POS.x, END_POS.y, END_POS.z);
                groupRef.current.rotation.set(0, Math.PI * 0.5, 0); // Face forward when parked
            }
        }
    });

    return (
        <group ref={groupRef} position={[START_POS.x, START_POS.y, START_POS.z]} scale={0.6}>
            <primitive object={scene} />
        </group>
    );
}

// Snow Mountain in the background
function SnowMountain() {
    const { scene } = useGLTF('/assets/models/landingscene/snow_mountain.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <group position={[-15, -3.75, -20]} scale={2} rotation={[0, 0.5, 0]}>
            <primitive object={scene} />
        </group>
    );
}

// Very bright sun light source for shadows
function BrightSun() {
    const sunRef = useRef();

    useFrame((state) => {
        if (sunRef.current) {
            // Subtle pulsing effect
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            sunRef.current.intensity = 4 * pulse;
        }
    });

    return (
        <>
            {/* Main sun directional light for shadows */}
            <directionalLight
                ref={sunRef}
                position={[10, 15, 10]}
                intensity={4}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-bias={-0.0001}
                color="#ffffff"
            />

            {/* Visual sun sphere */}
            <mesh position={[3, 6, 2]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial color="#ffffaa" />
            </mesh>

            {/* Sun glow point light */}
            <pointLight
                position={[3, 6, 2]}
                intensity={3}
                distance={15}
                color="#fff5e0"
            />

            {/* Additional fill lights */}
            <pointLight
                position={[-2, 3, -2]}
                intensity={1}
                distance={10}
                color="#00f9ff"
            />
            <pointLight
                position={[2, 1, 3]}
                intensity={0.8}
                distance={8}
                color="#ffffff"
            />
        </>
    );
}

// Loading Fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#00f9ff',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 0 20px #00f9ff'
            }}>
                Loading Windmill...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function WindmillScene() {
    const navigate = useNavigate();
    const [autoRotateEnabled, setAutoRotateEnabled] = useState(false);

    // Delay auto-rotate for 6 seconds so user can watch plane takeoff
    useEffect(() => {
        const timer = setTimeout(() => {
            setAutoRotateEnabled(true);
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="windmill-scene-container">
            <Canvas
                camera={{ position: [0, 3, 12], fov: 45 }}
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap }
                }}
                dpr={[1, 2]}
            >
                {/* Camera Controls - delayed auto-rotate */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={15}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                    autoRotate={autoRotateEnabled}
                    autoRotateSpeed={0.5}
                />

                {/* Background color - cyan */}
                <color attach="background" args={['#00f9ff']} />

                {/* Ambient lighting */}
                <ambientLight intensity={0.5} />

                {/* Bright sun for shadows */}
                <BrightSun />

                {/* The 3D Model */}
                <Suspense fallback={<Loader />}>
                    <WindmillModel />
                </Suspense>

                {/* Green Grass Floor */}
                <GrassFloor />

                {/* Animated Water around the island */}
                <AnimatedWater />

                {/* Shoreline foam waves at the edge */}
                <ShorelineFoam />

                {/* Animated Clouds drifting across the sky */}
                <AnimatedClouds />

                {/* Cute Toon Trees around the windmill */}
                <ToonTrees />

                {/* Animated Seaplane - circles and lands */}
                <SeaplaneLanding />


                {/* Snow Mountain in background */}
                <SnowMountain />

                {/* Environment for reflections */}
                <Environment preset="sunset" />

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom
                        intensity={0.5}
                        luminanceThreshold={0.3}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.4} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div className="windmill-ui-overlay">
                {/* Back Button */}
                <button
                    className="windmill-back-button"
                    onClick={() => navigate('/')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Title */}
                <div className="windmill-title">
                    <h1>Windmill</h1>
                    <p>3D Model Showcase</p>
                </div>
            </div>
        </div>
    );
}

// Preload all models
useGLTF.preload('/assets/models/landingscene/working2.glb');
useGLTF.preload('/assets/models/cloud.glb');
useGLTF.preload('/assets/models/landingscene/cute_toon_tree.glb');
useGLTF.preload('/assets/models/gottfried_freiherr_von_banfields_seaplane.glb');
useGLTF.preload('/assets/models/landingscene/snow_mountain.glb');
