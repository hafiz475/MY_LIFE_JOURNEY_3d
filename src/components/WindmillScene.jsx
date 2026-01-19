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

// Sailing Boats - animated boats moving in the sea
function SailingBoats() {
    const boat1Ref = useRef();
    const boat2Ref = useRef();
    const { scene: boatScene } = useGLTF('/assets/models/landingscene/boat_from_poly_by_google.glb');
    const { scene: cruiseScene } = useGLTF('/assets/models/landingscene/cruise_ship_-_toofan.glb');

    // Setup shadows
    useEffect(() => {
        [boatScene, cruiseScene].forEach(scene => {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        });
    }, [boatScene, cruiseScene]);

    // Animate boats sailing in circular patterns
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Boat 1 - larger circular path, slower
        if (boat1Ref.current) {
            const radius1 = 35;
            const speed1 = 0.075;
            boat1Ref.current.position.x = Math.sin(t * speed1) * radius1;
            boat1Ref.current.position.z = Math.cos(t * speed1) * radius1;
            // Face direction of travel
            boat1Ref.current.rotation.y = -t * speed1 + Math.PI / 2;
            // Gentle bobbing
            boat1Ref.current.position.y = -3.5 + Math.sin(t * 2) * 0.1;
        }

        // Cruise ship - even larger path, slowest
        if (boat2Ref.current) {
            const radius2 = 50;
            const speed2 = 0.04;
            boat2Ref.current.position.x = Math.cos(t * speed2 + Math.PI) * radius2;
            boat2Ref.current.position.z = Math.sin(t * speed2 + Math.PI) * radius2;
            // Face direction of travel
            boat2Ref.current.rotation.y = t * speed2;
            // Gentle bobbing
            boat2Ref.current.position.y = -3.4 + Math.sin(t * 1.5) * 0.15;
        }
    });

    return (
        <>
            {/* Small sailing boat */}
            <primitive
                ref={boat1Ref}
                object={boatScene.clone()}
                position={[35, -3.5, 0]}
                scale={0.016}
            />
            {/* Cruise ship */}
            <primitive
                ref={boat2Ref}
                object={cruiseScene.clone()}
                position={[30, -3.4, 0]}
                scale={0.02}
            />
        </>
    );
}

// Shark Fin - animated shark swimming in the sea
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

    // Animate shark swimming erratically
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (sharkRef.current) {
            // Figure-8 pattern for more interesting movement
            const speed = 0.3;
            const radius = 25;
            sharkRef.current.position.x = Math.sin(t * speed) * radius;
            sharkRef.current.position.z = Math.sin(t * speed * 2) * (radius * 0.5) + 30;
            // Face direction of travel
            const nextX = Math.sin((t + 0.1) * speed) * radius;
            const nextZ = Math.sin((t + 0.1) * speed * 2) * (radius * 0.5) + 30;
            sharkRef.current.rotation.y = Math.atan2(nextX - sharkRef.current.position.x, nextZ - sharkRef.current.position.z);
            // Slight up/down movement
            sharkRef.current.position.y = -3.7 + Math.sin(t * 4) * 0.05;
        }
    });

    return (
        <primitive
            ref={sharkRef}
            object={scene}
            position={[0, -3.7, 30]}
            scale={0.04}
        />
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
                opacity={0.85}
                roughness={0.6}
                metalness={0}
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
    const [isSeaplaneLanded, setIsSeaplaneLanded] = useState(false);

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
                onCreated={({ camera }) => {
                    // Reset camera position and rotation when scene is created
                    camera.position.set(0, 3, 12);
                    camera.rotation.set(0, 0, 0);
                    camera.updateProjectionMatrix();
                }}
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
                    target={[0, 0, 0]}
                />

                {/* Background color - cyan */}
                <color attach="background" args={['#00f9ff']} />

                {/* Ambient lighting */}
                <ambientLight intensity={0.5} />

                {/* Bright sun for shadows */}
                <BrightSun />

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

                {/* Parked boats near the shore */}
                <ParkedBoats />

                {/* Sailing boats in the sea */}
                <SailingBoats />

                {/* Shark fin swimming in the sea */}
                <SharkFin />

                {/* Shoreline foam waves at the edge */}
                <ShorelineFoam />

                {/* Animated Clouds drifting across the sky */}
                <AnimatedClouds />

                {/* Cute Toon Trees around the windmill */}
                <ToonTrees />

                {/* Welcome Sign */}
                <WelcomeSign />

                {/* Animated Seaplane - Click to takeoff and go back to home */}
                <SeaplaneLanding onTakeoffComplete={() => navigate('/')} onLanded={() => setIsSeaplaneLanded(true)} />


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
