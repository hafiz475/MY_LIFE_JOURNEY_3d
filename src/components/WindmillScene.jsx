import { useRef, Suspense, useEffect, useState, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
import { useMemo, useCallback } from 'react';

// Day/Night Context for sharing state across components
const DayNightContext = createContext({
    isNight: false,
    nightProgress: 0, // 0 = full day, 1 = full night
    isTransitioning: false,
});

// Cycle constants
const DAY_DURATION = 24; // seconds of full daytime
const NIGHT_DURATION = 24; // seconds of full nighttime
const TRANSITION_DURATION = 12; // seconds for day-to-night or night-to-day transition
const TOTAL_CYCLE = DAY_DURATION + TRANSITION_DURATION + NIGHT_DURATION + TRANSITION_DURATION; // 72 seconds total
const AUTO_LIGHTNING_INTERVAL = 3; // seconds between automatic lightning during night

// The Windmill 3D Model with Animation - Clickable to go to /landing
function WindmillModel({ onClick, isLanded }) {
    const groupRef = useRef();
    const starLightRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/landingscene/working2.glb');
    const { actions } = useAnimations(animations, scene);
    const [hovered, setHovered] = useState(false);

    // Play all animations on mount
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.play();
                }
            });
        }
    }, [actions]);

    // Gentle rotation around base 45° position + pulsing notification light
    useFrame((state) => {
        if (groupRef.current) {
            // Base rotation: 45° clockwise (+Math.PI/4) + gentle sway
            groupRef.current.rotation.y = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        // Pulsing notification light effect - matching PhoneModel style
        if (starLightRef.current) {
            const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
            starLightRef.current.scale.setScalar(pulse);
            if (starLightRef.current.material) {
                starLightRef.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
            }
        }
    });

    // Setup shadows for the model
    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Change cursor on hover
    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered]);

    return (
        <group
            ref={groupRef}
            position={[2, 0, 0]}
            scale={0.5}
        >
            <primitive object={scene} />
            {/* Pulsing notification light at windmill entrance - only shows after plane lands */}
            {isLanded && (
                <mesh
                    ref={starLightRef}
                    position={[-2.7, -6.7, -1.5]}
                    onClick={onClick}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.9} />
                </mesh>
            )}

        </group>
    );
}

// Stepping Stone Path - small stones leading from windmill entrance
function SteppingStonePath() {
    // Stone positions - creating a winding path from windmill entrance
    const stonePositions = useMemo(() => [
        // Near windmill entrance
        { x: 0.5, z: 2.5, scale: 0.25, rotation: 0.3 },
        { x: 0.2, z: 3.2, scale: 0.3, rotation: 0.8 },
        { x: 0.7, z: 3.8, scale: 0.22, rotation: 1.2 },
        { x: 0.3, z: 4.5, scale: 0.28, rotation: 0.5 },
        { x: 0.8, z: 5.1, scale: 0.24, rotation: 1.8 },
        // Middle section
        { x: 0.4, z: 5.8, scale: 0.26, rotation: 2.1 },
        { x: 0.9, z: 6.4, scale: 0.23, rotation: 0.9 },
        { x: 0.5, z: 7.0, scale: 0.27, rotation: 1.5 },
        { x: 1.0, z: 7.6, scale: 0.25, rotation: 2.5 },
        { x: 0.6, z: 8.2, scale: 0.22, rotation: 0.4 },
        // Further out
        { x: 1.1, z: 8.8, scale: 0.24, rotation: 1.1 },
        { x: 0.7, z: 9.4, scale: 0.26, rotation: 2.3 },
    ], []);

    return (
        <group position={[0, -3.72, -2]}>
            {stonePositions.map((stone, index) => (
                <mesh
                    key={index}
                    position={[stone.x, 0.02, stone.z]}
                    rotation={[-Math.PI / 2, 0, stone.rotation]}
                    receiveShadow
                >
                    <circleGeometry args={[stone.scale, 6]} />
                    <meshStandardMaterial
                        color="#d4c9b0"
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Parked Boats - stationary boats near the shore
function ParkedBoats() {
    const lancha1 = useGLTF('/assets/models/landingscene/lancha_low_poly.glb');
    const lancha2 = useGLTF('/assets/models/landingscene/lancha_2_low_poly.glb');

    // Setup shadows
    useEffect(() => {
        [lancha1.scene, lancha2.scene].forEach(scene => {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        });
    }, [lancha1.scene, lancha2.scene]);

    return (
        <>
            {/* Lancha 1 - parked near shore left side */}
            <primitive
                object={lancha1.scene.clone()}
                position={[-8, -3.6, 8]}
                scale={0.008 / 1.5}
                rotation={[0, Math.PI * 0.3, 0]}
            />
            {/* Lancha 2 - parked near shore right side */}
            <primitive
                object={lancha2.scene.clone()}
                position={[10, -3.6, 1]}
                scale={0.008 / 1.5}
                rotation={[0, -Math.PI * 0.4, 0]}
            />
        </>
    );
}

// Sailing Boats - 2 small animated boats moving in the sea
function SailingBoats() {
    const boat1Ref = useRef();
    const boat2Ref = useRef();
    const { scene: boatScene } = useGLTF('/assets/models/landingscene/boat_from_poly_by_google.glb');

    // Setup shadows
    useEffect(() => {
        boatScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [boatScene]);

    // Animate boats sailing in circular patterns
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Boat 1 - circular path clockwise
        if (boat1Ref.current) {
            const radius1 = 28;
            const speed1 = 0.08;
            boat1Ref.current.position.x = Math.sin(t * speed1) * radius1;
            boat1Ref.current.position.z = Math.cos(t * speed1) * radius1;
            // Face direction of travel
            boat1Ref.current.rotation.y = -t * speed1 + Math.PI / 2;
            // Gentle bobbing
            boat1Ref.current.position.y = -3.5 + Math.sin(t * 2) * 0.1;
        }

        // Boat 2 - circular path counter-clockwise, offset position
        if (boat2Ref.current) {
            const radius2 = 32;
            const speed2 = 0.06;
            boat2Ref.current.position.x = Math.cos(t * speed2 + Math.PI) * radius2;
            boat2Ref.current.position.z = -Math.sin(t * speed2 + Math.PI) * radius2;
            // Face direction of travel (opposite direction)
            boat2Ref.current.rotation.y = t * speed2 + Math.PI / 2;
            // Gentle bobbing
            boat2Ref.current.position.y = -3.5 + Math.sin(t * 1.8 + 1) * 0.1;
        }
    });

    return (
        <>
            {/* Small sailing boat 1 */}
            <primitive
                ref={boat1Ref}
                object={boatScene.clone()}
                position={[28, -3.5, 0]}
                scale={0.016}
            />
            {/* Small sailing boat 2 */}
            <primitive
                ref={boat2Ref}
                object={boatScene.clone()}
                position={[-32, -3.5, 0]}
                scale={0.014}
            />
        </>
    );
}

// Cruise Ships - 2 large cruise ships sailing in the sea
function CruiseShips() {
    const cruise1Ref = useRef();
    const cruise2Ref = useRef();
    const { scene: cruiseScene } = useGLTF('/assets/models/landingscene/cruise_ship_-_toofan.glb');

    // Setup shadows
    useEffect(() => {
        cruiseScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [cruiseScene]);

    // Animate cruise ships sailing in circular patterns
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Cruise 1 - large circular path, slow
        if (cruise1Ref.current) {
            const radius1 = 45;
            const speed1 = 0.04;
            cruise1Ref.current.position.x = Math.sin(t * speed1 + Math.PI / 4) * radius1;
            cruise1Ref.current.position.z = Math.cos(t * speed1 + Math.PI / 4) * radius1;
            // Face direction of travel
            cruise1Ref.current.rotation.y = -t * speed1 + Math.PI / 2;
            // Gentle bobbing
            cruise1Ref.current.position.y = -3.4 + Math.sin(t * 1.5) * 0.15;
        }

        // Cruise 2 - opposite direction, offset position
        if (cruise2Ref.current) {
            const radius2 = 55;
            const speed2 = 0.03;
            cruise2Ref.current.position.x = Math.cos(t * speed2) * radius2;
            cruise2Ref.current.position.z = -Math.sin(t * speed2) * radius2;
            // Face direction of travel
            cruise2Ref.current.rotation.y = t * speed2;
            // Gentle bobbing
            cruise2Ref.current.position.y = -3.4 + Math.sin(t * 1.2 + 2) * 0.12;
        }
    });

    return (
        <>
            {/* Cruise ship 1 */}
            <primitive
                ref={cruise1Ref}
                object={cruiseScene.clone()}
                position={[45, -3.4, 0]}
                scale={0.02}
            />
            {/* Cruise ship 2 */}
            <primitive
                ref={cruise2Ref}
                object={cruiseScene.clone()}
                position={[-55, -3.4, 0]}
                scale={0.018}
            />
        </>
    );
}

// Shark Fin - animated shark swimming in the sea (visible in front of island)
function SharkFin() {
    const sharkRef = useRef();
    const { scene } = useGLTF('/assets/models/landingscene/shark_fin_from_poly_by_google.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
    }, [scene]);

    // Animate shark swimming in the water visible from camera
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (sharkRef.current) {
            // Swimming pattern in front of the island (visible from camera)
            const speed = 0.2;
            const radius = 12;
            // Swim in front of the island (positive Z - towards camera)
            sharkRef.current.position.x = Math.sin(t * speed) * radius - 8;
            sharkRef.current.position.z = Math.cos(t * speed) * 6 + 22;
            // Face direction of travel
            const nextX = Math.sin((t + 0.1) * speed) * radius - 8;
            const nextZ = Math.cos((t + 0.1) * speed) * 6 + 22;
            sharkRef.current.rotation.y = Math.atan2(nextX - sharkRef.current.position.x, nextZ - sharkRef.current.position.z);
            // Slight up/down movement to simulate swimming
            sharkRef.current.position.y = -3.75 + Math.sin(t * 3) * 0.1;
        }
    });

    return (
        <primitive
            ref={sharkRef}
            object={scene}
            position={[-8, -3.75, 22]}
            scale={0.15}
        />
    );
}

// Eagle - flies forever with spiral descent and takeoff pattern
function Eagle() {
    const eagleRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/low_poly_eagle.glb');
    const { actions } = useAnimations(animations, scene);

    // Play flying animation
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.play();
                }
            });
        }

        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
    }, [actions, scene]);

    // Spiral flight pattern - descends while tightening spiral, then ascends while expanding
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (!eagleRef.current) return;

        // Spiral cycle: 20 seconds total (10s descent, 10s ascent)
        const CYCLE_DURATION = 20;
        const cycleTime = t % CYCLE_DURATION;
        const cycleProgress = cycleTime / CYCLE_DURATION; // 0 to 1

        // Spiral parameters
        const MIN_RADIUS = 8;   // Tightest spiral (close to center but not inside mountain)
        const MAX_RADIUS = 25;  // Widest spiral
        const MIN_HEIGHT = 3;   // Lowest altitude
        const MAX_HEIGHT = 12;  // Highest altitude

        // Create smooth sine wave for radius and height (0->1->0 pattern)
        // First half (0-0.5): descending spiral (radius shrinks, height drops)
        // Second half (0.5-1): ascending spiral (radius expands, height rises)
        const spiralProgress = Math.sin(cycleProgress * Math.PI); // 0->1->0

        // Radius: starts large, shrinks to minimum at middle, expands back
        const currentRadius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (1 - spiralProgress);

        // Height: starts high, drops to minimum at middle, rises back
        const currentHeight = MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * (1 - spiralProgress);

        // Circular motion with varying radius
        const rotationSpeed = 0.4;
        const angle = t * rotationSpeed;

        // Offset the center slightly to avoid mountain (mountain is at z: -20)
        const centerOffsetZ = 5; // Shift center forward to avoid mountain

        eagleRef.current.position.x = Math.sin(angle) * currentRadius;
        eagleRef.current.position.z = Math.cos(angle) * currentRadius + centerOffsetZ;
        eagleRef.current.position.y = currentHeight + Math.sin(t * 2) * 0.3; // Gentle bobbing

        // Face direction of travel
        eagleRef.current.rotation.y = -angle + Math.PI;

        // Banking: more banking during tight spiral, less during wide
        const bankAmount = 0.1 + (spiralProgress * 0.15);
        eagleRef.current.rotation.z = Math.sin(angle) * bankAmount;

        // Pitch: nose down during descent, nose up during ascent
        const pitchAmount = cycleProgress < 0.5 ? -0.1 : 0.1;
        eagleRef.current.rotation.x = pitchAmount * spiralProgress;
    });

    return (
        <primitive
            ref={eagleRef}
            object={scene}
            position={[20, 8, 0]}
            scale={0.15}
        />
    );
}

// Flying Birds - animated flock of 5 birds flying across the scene
function FlyingBirds() {
    const groupRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/birds.glb');
    const { actions } = useAnimations(animations, scene);

    // Play bird flying animations
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.play();
                }
            });
        }

        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
    }, [actions, scene]);

    // Constants for flight pattern
    const FLIGHT_DURATION = 12; // 12 seconds to cross
    const START_X = -50;
    const END_X = 50;
    const TOTAL_DISTANCE = END_X - START_X; // 100 units

    // Animate birds flying from left to right in 12 seconds, then reset
    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.elapsedTime;

        // Calculate position based on 12-second cycle
        const cycleTime = t % FLIGHT_DURATION;
        const progress = cycleTime / FLIGHT_DURATION;

        // Linear movement from left to right
        const currentX = START_X + progress * TOTAL_DISTANCE;

        groupRef.current.position.x = currentX;

        // Gentle up/down wave motion
        groupRef.current.position.y = 6 + Math.sin(t * 0.5) * 0.5;

        // Keep facing right (direction of flight)
        groupRef.current.rotation.y = Math.PI / 2;
    });

    return (
        <group ref={groupRef} position={[-50, 6, 0]} scale={0.5}>
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

// Scene Background - transitions sky color between day and night
function SceneBackground() {
    const { scene } = useThree();
    const { nightProgress } = useContext(DayNightContext);

    useFrame(() => {
        // Interpolate between day cyan and night dark blue
        const dayColor = new THREE.Color('#00f9ff');
        const nightColor = new THREE.Color('#0a0a2e');
        const currentColor = dayColor.clone().lerp(nightColor, nightProgress);
        scene.background = currentColor;
    });

    return null;
}

// Rain Particles - appears during night
function Rain() {
    const { nightProgress } = useContext(DayNightContext);
    const rainRef = useRef();
    const rainCount = 1000;

    // Create rain drop positions
    const rainPositions = useMemo(() => {
        const positions = new Float32Array(rainCount * 3);
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;     // x
            positions[i * 3 + 1] = Math.random() * 30;          // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        }
        return positions;
    }, []);

    useFrame(() => {
        if (!rainRef.current || nightProgress < 0.3) return;

        const positions = rainRef.current.geometry.attributes.position.array;
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3 + 1] -= 0.5; // Fall speed
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = 30;
            }
        }
        rainRef.current.geometry.attributes.position.needsUpdate = true;
    });

    if (nightProgress < 0.3) return null;

    return (
        <points ref={rainRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={rainCount}
                    array={rainPositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#aaddff"
                size={0.15}
                transparent
                opacity={nightProgress * 0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Thunder Effect - lightning flash when clouds are clicked + automatic every 3 seconds at night
function Thunder({ onFlash }) {
    const { nightProgress } = useContext(DayNightContext);
    const [isFlashing, setIsFlashing] = useState(false);
    const lightRef = useRef();
    const lastAutoFlashRef = useRef(0);

    const triggerThunder = useCallback(() => {
        if (nightProgress < 0.5 || isFlashing) return;

        setIsFlashing(true);
        if (onFlash) onFlash();

        // Flash sequence
        setTimeout(() => setIsFlashing(false), 100);
        setTimeout(() => setIsFlashing(true), 150);
        setTimeout(() => setIsFlashing(false), 250);
        setTimeout(() => setIsFlashing(true), 300);
        setTimeout(() => setIsFlashing(false), 400);
    }, [nightProgress, isFlashing, onFlash]);

    // Expose trigger function
    useEffect(() => {
        window.triggerThunder = triggerThunder;
        return () => { delete window.triggerThunder; };
    }, [triggerThunder]);

    // Automatic lightning every 3 seconds during night
    useFrame((state) => {
        if (nightProgress >= 0.8 && !isFlashing) {
            const now = state.clock.elapsedTime;
            if (now - lastAutoFlashRef.current >= AUTO_LIGHTNING_INTERVAL) {
                lastAutoFlashRef.current = now;
                triggerThunder();
            }
        }
    });

    if (nightProgress < 0.5) return null;

    return (
        <>
            {isFlashing && (
                <>
                    <ambientLight intensity={5} color="#ffffff" />
                    <pointLight
                        ref={lightRef}
                        position={[0, 20, 0]}
                        intensity={100}
                        color="#ffffff"
                        distance={200}
                    />
                </>
            )}
        </>
    );
}

// Moon - appears during night
function Moon() {
    const { nightProgress } = useContext(DayNightContext);
    const moonRef = useRef();

    useFrame((state) => {
        if (moonRef.current) {
            // Gentle glow pulsing
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            moonRef.current.scale.setScalar(0.8 * pulse);
        }
    });

    if (nightProgress < 0.3) return null;

    return (
        <group position={[8, 12, -10]}>
            {/* Moon sphere */}
            <mesh ref={moonRef}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial color="#ffffd0" />
            </mesh>
            {/* Moon glow */}
            <pointLight
                intensity={2 * nightProgress}
                distance={30}
                color="#ffffd0"
            />
        </group>
    );
}

// Animated Water - stylized low-poly water around the island (higher waves at night)
function AnimatedWater() {
    const waterRef = useRef();
    const materialRef = useRef();
    const { nightProgress } = useContext(DayNightContext);

    // Create water geometry - a ring around the island (hole in middle)
    const waterGeometry = useMemo(() => {
        // Inner radius = island size (20), outer radius = water extent
        const geo = new THREE.RingGeometry(20, 150, 64, 20);
        return geo;
    }, []);

    // Animate water waves - higher during night
    useFrame((state) => {
        if (waterRef.current) {
            const positions = waterRef.current.geometry.attributes.position;
            const time = state.clock.elapsedTime;

            // Wave intensity increases during night (0.15 to 0.6)
            const waveMultiplier = 1 + nightProgress * 3;

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);

                // Create wave pattern - stronger during night
                const wave1 = Math.sin(x * 0.05 + time * (0.5 + nightProgress * 0.5)) * 0.15 * waveMultiplier;
                const wave2 = Math.cos(y * 0.05 + time * (0.3 + nightProgress * 0.4)) * 0.1 * waveMultiplier;

                positions.setZ(i, wave1 + wave2);
            }
            positions.needsUpdate = true;
        }

        // Darken water color at night
        if (materialRef.current) {
            const dayColor = new THREE.Color('#1E90FF');
            const nightColor = new THREE.Color('#0a3060');
            materialRef.current.color.copy(dayColor).lerp(nightColor, nightProgress);
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
                ref={materialRef}
                color="#1E90FF"
                transparent
                opacity={0.85}
                roughness={0.6}
                metalness={0}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Shoreline Foam - animated waves at the edge where water meets land (higher at night)
function ShorelineFoam() {
    const foamRef = useRef();
    const materialRef = useRef();
    const { nightProgress } = useContext(DayNightContext);

    // Animate foam opacity for wave effect
    useFrame((state) => {
        if (materialRef.current) {
            const time = state.clock.elapsedTime;
            // Pulsing opacity - more intense at night
            const waveSpeed = 2 + nightProgress * 2;
            const wave = (Math.sin(time * waveSpeed) + 1) * 0.5; // 0 to 1
            materialRef.current.opacity = 0.4 + wave * (0.4 + nightProgress * 0.3);
        }
        if (foamRef.current) {
            // Scale pulsing - larger waves at night
            const scaleAmount = 0.02 + nightProgress * 0.04;
            const scale = 1 + Math.sin(state.clock.elapsedTime * (1.5 + nightProgress)) * scaleAmount;
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

// Animated Clouds - More clouds for a fuller sky (stormy at night, clickable for thunder)
function AnimatedClouds() {
    const { scene } = useGLTF('/assets/models/cloud.glb');
    const groupRef = useRef();
    const cloudsRef = useRef([]);
    const { nightProgress } = useContext(DayNightContext);

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

    // Handle cloud click for thunder
    const handleCloudClick = useCallback(() => {
        if (nightProgress > 0.5 && window.triggerThunder) {
            window.triggerThunder();
        }
    }, [nightProgress]);

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

    // Animate clouds drifting across the sky + change color at night
    useFrame((state, delta) => {
        const dayColor = new THREE.Color(1.1, 1.1, 1.1); // White-ish
        const nightColor = new THREE.Color(0.3, 0.3, 0.35); // Dark stormy gray

        cloudsRef.current.forEach((cloud) => {
            cloud.mesh.position.x += cloud.speed * delta * 3;

            // Add gentle bobbing motion
            cloud.mesh.position.y = cloud.y + Math.sin(state.clock.elapsedTime * 0.5 + cloud.z) * 0.2;

            // Reset cloud position when it goes off screen
            if (cloud.mesh.position.x > 25) {
                cloud.mesh.position.x = -25 - Math.random() * 10;
            }

            // Darken clouds at night
            cloud.mesh.traverse((child) => {
                if (child.isMesh && child.material) {
                    const currentColor = dayColor.clone().lerp(nightColor, nightProgress);
                    child.material.color.copy(currentColor);
                }
            });
        });
    });

    return (
        <group
            ref={groupRef}
            onClick={handleCloudClick}
            onPointerOver={() => { if (nightProgress > 0.5) document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        />
    );
}

// Cute Toon Trees - 3 trees positioned around the windmill
function ToonTrees() {
    const { scene } = useGLTF('/assets/models/landingscene/cute_toon_tree.glb');
    const groupRef = useRef();

    // Tree positions around the windmill
    const treePositions = useMemo(() => [
        { x: -5, y: -3.75, z: 3, scale: 0.6, rotation: 0.3 },
        { x: 4, y: -3.75, z: -4, scale: 0.5, rotation: -0.5 },
        { x: 6, y: -3.75, z: 5, scale: 0.55, rotation: 0.8 },
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

// Animated Seaplane - Lands, then can takeoff when sphere is clicked
function SeaplaneLanding({ onTakeoffComplete, onLanded }) {
    const groupRef = useRef();
    const starLightRef = useRef();
    const { scene, animations } = useGLTF('/assets/models/gottfried_freiherr_von_banfields_seaplane.glb');
    const { actions } = useAnimations(animations, scene);
    const startTimeRef = useRef(null);
    const hasLandedRef = useRef(false);
    const [isLanded, setIsLanded] = useState(false);
    const [isTakingOff, setIsTakingOff] = useState(false);
    const takeoffStartRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    // Landing animation duration
    const FLIGHT_DURATION = 18;
    const TAKEOFF_PHASE1 = 3; // 3 seconds straight up
    const TAKEOFF_PHASE2 = 3; // 3 seconds at 30 degrees

    // Starting position (opposite quadrant - far side)
    const START_POS = { x: -12, y: 5, z: -12 };
    // Landing position (next to the windmill)
    const END_POS = { x: -3, y: -3.5, z: 2 };

    // Enable shadows on the model and reset rotation
    useEffect(() => {
        // Reset all rotation on the scene to fix orientation after navigation
        scene.rotation.set(0, 0, 0);
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            // Reset any child rotations that might have been affected
            if (child.rotation) {
                // Only reset if not the root scene (to preserve intended rotations)
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

    // Change cursor when hovering over landed plane
    useEffect(() => {
        if (isLanded && hovered) {
            document.body.style.cursor = 'pointer';
        } else if (!hovered) {
            document.body.style.cursor = 'auto';
        }
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered, isLanded]);

    const handleClick = () => {
        if (hasLandedRef.current && !isTakingOff) {
            setIsTakingOff(true);
            takeoffStartRef.current = null;
        }
    };

    useFrame((state) => {
        if (!groupRef.current) return;

        // Blinking star when landed
        if (starLightRef.current && isLanded && !isTakingOff) {
            const blink = (Math.sin(state.clock.elapsedTime * 4) + 1) * 0.5;
            starLightRef.current.scale.setScalar(0.05 + blink * 0.03);
        }

        // Takeoff animation - Phase 1: horizontal, Phase 2: 30 degree climb
        if (isTakingOff) {
            if (takeoffStartRef.current === null) {
                takeoffStartRef.current = state.clock.elapsedTime;
            }
            const takeoffElapsed = state.clock.elapsedTime - takeoffStartRef.current;

            if (takeoffElapsed <= TAKEOFF_PHASE1) {
                // Phase 1: Go horizontally forward for 3 seconds (along X axis - plane faces this way)
                const phase1Progress = takeoffElapsed / TAKEOFF_PHASE1;
                const eased = 1 - Math.pow(1 - phase1Progress, 2);
                const newX = END_POS.x + eased * 10; // Move forward along X (positive direction)
                groupRef.current.position.set(newX, END_POS.y, END_POS.z);
                groupRef.current.rotation.set(0, Math.PI * 0.5, 0); // Keep facing forward
            } else if (takeoffElapsed <= TAKEOFF_PHASE1 + TAKEOFF_PHASE2) {
                // Phase 2: Climb at 30 degrees for 3 seconds
                const phase2Elapsed = takeoffElapsed - TAKEOFF_PHASE1;
                const phase2Progress = phase2Elapsed / TAKEOFF_PHASE2;
                const eased = 1 - Math.pow(1 - phase2Progress, 2);

                const phase1EndX = END_POS.x + 10;
                const angle30 = Math.PI / 6; // 30 degrees

                // Fly forward (X) and up at 30 degrees
                const distance = eased * 25;
                const newY = END_POS.y + Math.sin(angle30) * distance;
                const newX = phase1EndX + Math.cos(angle30) * distance;

                groupRef.current.position.set(newX, newY, END_POS.z);
                groupRef.current.rotation.set(0, Math.PI * 0.5, angle30); // Bank/pitch for climb
            } else {
                // Done - navigate
                if (onTakeoffComplete) {
                    onTakeoffComplete();
                }
            }
            return;
        }

        // Landing animation
        if (startTimeRef.current === null) {
            startTimeRef.current = state.clock.elapsedTime;
        }

        const elapsed = state.clock.elapsedTime - startTimeRef.current;
        const progress = Math.min(elapsed / FLIGHT_DURATION, 1);

        if (progress < 1) {
            const easeProgress = progress < 0.5
                ? 16 * Math.pow(progress, 5)
                : 1 - Math.pow(-2 * progress + 2, 5) / 2;

            const startAngle = 0;
            const endAngle = startAngle + Math.PI * 1.3;
            const currentAngle = startAngle + (endAngle - startAngle) * easeProgress;

            const startRadius = 14;
            const endRadius = 4;
            const currentRadius = startRadius + (endRadius - startRadius) * easeProgress;

            const arcX = Math.sin(currentAngle) * currentRadius;
            const arcZ = Math.cos(currentAngle) * currentRadius;

            const heightProgress = Math.pow(easeProgress, 1.5);
            const currentY = START_POS.y + (END_POS.y - START_POS.y) * heightProgress;

            const landingBlend = progress > 0.8 ? (progress - 0.8) / 0.2 : 0;
            const smoothLandingBlend = landingBlend * landingBlend * (3 - 2 * landingBlend);

            const finalX = arcX * (1 - smoothLandingBlend) + END_POS.x * smoothLandingBlend;
            const finalZ = arcZ * (1 - smoothLandingBlend) + END_POS.z * smoothLandingBlend;
            const finalY = currentY * (1 - smoothLandingBlend) + END_POS.y * smoothLandingBlend;

            groupRef.current.position.set(finalX, finalY, finalZ);

            const deltaAngle = 0.05;
            const nextAngle = currentAngle + deltaAngle;
            const nextRadius = currentRadius - deltaAngle * (startRadius - endRadius) / (endAngle - startAngle);
            const nextX = Math.sin(nextAngle) * nextRadius;
            const nextZ = Math.cos(nextAngle) * nextRadius;

            const dirX = nextX - arcX;
            const dirZ = nextZ - arcZ;
            const targetRotation = Math.atan2(dirX, dirZ);

            groupRef.current.rotation.y = targetRotation;
            const bankAmount = 0.12 * (1 - easeProgress);
            groupRef.current.rotation.z = Math.sin(currentAngle * 2) * bankAmount;
            groupRef.current.rotation.x = -0.08 * (1 - easeProgress);
        } else {
            if (!hasLandedRef.current) {
                hasLandedRef.current = true;
                setIsLanded(true);
                groupRef.current.position.set(END_POS.x, END_POS.y, END_POS.z);
                groupRef.current.rotation.set(0, Math.PI * 0.5, 0);
                // Notify parent that plane has landed
                if (onLanded) onLanded();
            }
        }
    });

    return (
        <group
            ref={groupRef}
            position={[START_POS.x, START_POS.y, START_POS.z]}
            scale={0.78}
        >
            <primitive object={scene} />
            {/* Pulsing cyan notification light when landed - only sphere is clickable */}
            {isLanded && !isTakingOff && (
                <>
                    <mesh
                        ref={starLightRef}
                        position={[0, 0.7, 0]}
                        onClick={handleClick}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                    >
                        <sphereGeometry args={[2, 2, 2]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.9} />
                    </mesh>
                    {/* Glow ring */}
                    <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[0.18, 0.32, 32]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
                    </mesh>
                    <pointLight position={[0, 1.5, 0]} color="#00ffff" intensity={3} distance={4} />
                </>
            )}
        </group>
    );
}

// Welcome Sign - wooden sign board with text
function WelcomeSign() {
    const { scene } = useGLTF('/assets/models/landingscene/low_poly_sign_board__stylized_wooden_sign.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <group position={[2, -3.75, 3]} scale={0.35} rotation={[0, 0.5 + Math.PI, 0]}>
            <primitive object={scene} />
            {/* Text overlay on the sign */}
            <Html
                position={[0, 2.5, 0.1]}
                center
                transform
                occlude
                style={{
                    width: '100px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}
            >
                <div style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '14px',
                    fontWeight: '700',
                    background: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transform: 'scaleX(-1)',
                }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #00CED1 0%, #FF69B4 50%, #FF6B6B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Welcome to<br />
                        Starfish Island!
                    </span>
                </div>
            </Html>
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

// Very bright sun light source for shadows (fades at night)
function BrightSun() {
    const sunRef = useRef();
    const sunMeshRef = useRef();
    const { nightProgress } = useContext(DayNightContext);

    useFrame((state) => {
        if (sunRef.current) {
            // Subtle pulsing effect + fade at night
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            const dayIntensity = 4 * pulse;
            const nightIntensity = 0.5;
            sunRef.current.intensity = dayIntensity * (1 - nightProgress) + nightIntensity * nightProgress;
        }
        // Fade sun sphere at night
        if (sunMeshRef.current) {
            sunMeshRef.current.material.opacity = 1 - nightProgress;
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

            {/* Visual sun sphere - fades at night */}
            {nightProgress < 0.8 && (
                <mesh ref={sunMeshRef} position={[3, 6, 2]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshBasicMaterial color="#ffffaa" transparent opacity={1 - nightProgress} />
                </mesh>
            )}

            {/* Sun glow point light - fades at night */}
            <pointLight
                position={[3, 6, 2]}
                intensity={3 * (1 - nightProgress)}
                distance={15}
                color="#fff5e0"
            />

            {/* Additional fill lights - dim at night */}
            <pointLight
                position={[-2, 3, -2]}
                intensity={(1 - nightProgress * 0.8)}
                distance={10}
                color="#00f9ff"
            />
            <pointLight
                position={[2, 1, 3]}
                intensity={0.8 * (1 - nightProgress * 0.7)}
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
    const [isSeaplaneLanded, setIsSeaplaneLanded] = useState(false);

    // Day/Night cycle state
    const [nightProgress, setNightProgress] = useState(0);
    const [isNight, setIsNight] = useState(false);
    const startTimeRef = useRef(null);

    // Delay auto-rotate for 6 seconds so user can watch plane takeoff
    useEffect(() => {
        const timer = setTimeout(() => {
            setAutoRotateEnabled(true);
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    // Day/Night cycle effect
    useEffect(() => {
        let animationId;

        const updateCycle = () => {
            if (startTimeRef.current === null) {
                startTimeRef.current = Date.now();
            }

            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const cycleTime = elapsed % TOTAL_CYCLE;

            // Calculate night progress
            // Phase 1: 0-24s = Full Day (nightProgress: 0)
            // Phase 2: 24-36s = Transition Day->Night (nightProgress: 0->1)
            // Phase 3: 36-60s = Full Night (nightProgress: 1)
            // Phase 4: 60-72s = Transition Night->Day (nightProgress: 1->0)

            const phase1End = DAY_DURATION; // 24s
            const phase2End = DAY_DURATION + TRANSITION_DURATION; // 36s
            const phase3End = DAY_DURATION + TRANSITION_DURATION + NIGHT_DURATION; // 60s
            // phase4End = TOTAL_CYCLE = 72s

            if (cycleTime < phase1End) {
                // Phase 1: Full day
                setNightProgress(0);
                setIsNight(false);
            } else if (cycleTime < phase2End) {
                // Phase 2: Transitioning day -> night (12 seconds)
                const transitionProgress = (cycleTime - phase1End) / TRANSITION_DURATION;
                setNightProgress(transitionProgress);
                setIsNight(false);
            } else if (cycleTime < phase3End) {
                // Phase 3: Full night
                setNightProgress(1);
                setIsNight(true);
            } else {
                // Phase 4: Transitioning night -> day (12 seconds)
                const transitionProgress = (cycleTime - phase3End) / TRANSITION_DURATION;
                setNightProgress(1 - transitionProgress);
                setIsNight(transitionProgress < 0.5);
            }

            animationId = requestAnimationFrame(updateCycle);
        };

        updateCycle();
        return () => cancelAnimationFrame(animationId);
    }, []);

    const dayNightValue = useMemo(() => ({
        isNight,
        nightProgress,
        isTransitioning: nightProgress > 0 && nightProgress < 1,
    }), [isNight, nightProgress]);

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
                onCreated={({ camera }) => {
                    camera.position.set(0, 3, 12);
                    camera.rotation.set(0, 0, 0);
                    camera.updateProjectionMatrix();
                }}
            >
                <DayNightContext.Provider value={dayNightValue}>
                    {/* Camera Controls - always enabled for orbit */}
                    <OrbitControls
                        makeDefault
                        enabled={true}
                        enableZoom={true}
                        enableRotate={true}
                        enablePan={false}
                        minDistance={5}
                        maxDistance={15}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2}
                        autoRotate={autoRotateEnabled}
                        autoRotateSpeed={0.5}
                        target={[0, 0, 0]}
                    />

                    {/* Dynamic background color */}
                    <SceneBackground />

                    {/* Ambient lighting - dimmer at night */}
                    <ambientLight intensity={0.5 - nightProgress * 0.3} />

                    {/* Bright sun for shadows */}
                    <BrightSun />

                    {/* Moon at night */}
                    <Moon />

                    {/* Rain at night */}
                    <Rain />

                    {/* Thunder effect */}
                    <Thunder />

                    {/* The 3D Model - Click to go to /landing */}
                    <Suspense fallback={<Loader />}>
                        <WindmillModel onClick={() => navigate('/landing')} isLanded={isSeaplaneLanded} />
                    </Suspense>

                    {/* Green Grass Floor */}
                    <GrassFloor />

                    {/* Stepping Stone Path from windmill entrance */}
                    <SteppingStonePath />

                    {/* Animated Water around the island */}
                    <AnimatedWater />

                    {/* Parked boats near the shore - always visible */}
                    <ParkedBoats />

                    {/* Sailing boats in the sea - only during day */}
                    {nightProgress < 0.5 && <SailingBoats />}

                    {/* Cruise ships in the sea - only during day */}
                    {nightProgress < 0.5 && <CruiseShips />}

                    {/* Shark fin swimming in the sea - only during day */}
                    {nightProgress < 0.5 && <SharkFin />}

                    {/* Shoreline foam waves at the edge */}
                    <ShorelineFoam />

                    {/* Animated Clouds drifting across the sky */}
                    <AnimatedClouds />

                    {/* Eagle flying around island - only during day */}
                    {nightProgress < 0.5 && <Eagle />}

                    {/* Flying birds across the scene - only during day */}
                    {nightProgress < 0.5 && <FlyingBirds />}

                    {/* Cute Toon Trees around the windmill */}
                    <ToonTrees />

                    {/* Welcome Sign */}
                    <WelcomeSign />

                    {/* Animated Seaplane - Click to takeoff and go back to home */}
                    <SeaplaneLanding onTakeoffComplete={() => navigate('/')} onLanded={() => setIsSeaplaneLanded(true)} />

                    {/* Snow Mountain in background */}
                    <SnowMountain />

                    {/* Environment for reflections */}
                    <Environment preset={nightProgress > 0.5 ? "night" : "sunset"} />

                    {/* Post-processing */}
                    <EffectComposer>
                        <Bloom
                            intensity={0.5 + nightProgress * 0.3}
                            luminanceThreshold={0.3 - nightProgress * 0.1}
                            luminanceSmoothing={0.9}
                        />
                        <Vignette eskil={false} offset={0.1} darkness={0.4 + nightProgress * 0.3} />
                    </EffectComposer>
                </DayNightContext.Provider>
            </Canvas>
        </div>
    );
}

// Preload all models
useGLTF.preload('/assets/models/landingscene/working2.glb');
useGLTF.preload('/assets/models/cloud.glb');
useGLTF.preload('/assets/models/landingscene/cute_toon_tree.glb');
useGLTF.preload('/assets/models/gottfried_freiherr_von_banfields_seaplane.glb');
useGLTF.preload('/assets/models/landingscene/snow_mountain.glb');
useGLTF.preload('/assets/models/landingscene/low_poly_sign_board__stylized_wooden_sign.glb');
useGLTF.preload('/assets/models/landingscene/lancha_low_poly.glb');
useGLTF.preload('/assets/models/landingscene/lancha_2_low_poly.glb');
useGLTF.preload('/assets/models/landingscene/boat_from_poly_by_google.glb');
useGLTF.preload('/assets/models/landingscene/cruise_ship_-_toofan.glb');
useGLTF.preload('/assets/models/landingscene/shark_fin_from_poly_by_google.glb');
useGLTF.preload('/assets/models/low_poly_eagle.glb');
useGLTF.preload('/assets/models/birds.glb');
