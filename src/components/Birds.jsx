import { useFrame, useGraph } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

function Bird({ position, speed, factor, phase, scale, scene, animations }) {
    const group = useRef();
    // Clone the scene for each bird instance to allow independent animation
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // Play the first animation found
        const actionNames = Object.keys(actions);
        if (actionNames.length > 0) {
            const action = actions[actionNames[0]];
            action.reset().fadeIn(0.5).play();
            // Randomize start time to desync animations
            action.time = Math.random() * action.getClip().duration;
        }
    }, [actions]);

    useFrame((state, delta) => {
        if (!group.current) return;

        // Movement: Fly backward (-X)
        group.current.position.x -= speed * delta * 60;
        group.current.position.y += Math.sin(state.clock.elapsedTime * factor + phase) * 0.01;
        group.current.position.z += Math.cos(state.clock.elapsedTime * factor + phase) * 0.01;

        // Loop back
        if (group.current.position.x < -35) {
            group.current.position.x = 35;
            // Randomize Y and Z slightly when reseting
            group.current.position.y = -2 + Math.random() * 2; // Lower altitude
            group.current.position.z = -12 + Math.random() * 24; // Range from -12 to +12 (Left and Right)
        }
    });

    return (
        <group ref={group} position={position} dispose={null}>
            <group rotation={[0, -Math.PI / 2, 0]} scale={[scale, scale, scale]}>
                <primitive object={clone} />
            </group>
        </group>
    );
}

export default function Birds() {
    const birdsCount = 10;
    const { scene, animations } = useGLTF('/assets/models/low_poly_bird_animated.glb');

    const birds = useMemo(() => {
        return new Array(birdsCount).fill().map((_, i) => ({
            position: [
                25 + Math.random() * 15,
                -2 + Math.random() * 2,
                -10 - Math.random() * 10   // Further left (Negative Z)
            ],
            speed: 0.12 + Math.random() * 0.08,
            factor: 0.6 + Math.random() * 0.4,
            phase: Math.random() * Math.PI,
            scale: 0.05 + Math.random() * 0.03 // Adjusted scale for likely larger GLB model
        }));
    }, []);

    return (
        <group name="birds-flock">
            {birds.map((props, i) => (
                <Bird key={i} {...props} scene={scene} animations={animations} />
            ))}
        </group>
    );
}

useGLTF.preload('/assets/models/low_poly_bird_animated.glb');
