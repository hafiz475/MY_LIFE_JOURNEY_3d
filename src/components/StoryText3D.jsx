import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Same font as HudText name display
const CAVEAT_URL = "/assets/fonts/Caveat-Regular.ttf";

export default function StoryText3D({ isStoryDone }) {
    const { camera, size } = useThree();
    const groupRef = useRef();

    // Animation State: 0 = Hidden, 1 = Visible
    const animState = useRef(0);
    const [startAnim, setStartAnim] = useState(false);

    // Start animation after camera settles (3.5 seconds delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setStartAnim(true);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    // Opacity Refs for Cross-fade
    const storyOpacity = useRef(1);
    const hiOpacity = useRef(0);

    // Material Refs
    const storyMat1 = useRef();
    const storyMat1_Prefix = useRef(); // For "I'm"
    const storyMat2 = useRef();
    const storyMat3 = useRef();
    const hiMat = useRef();

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Animate the state value from 0 to 1 (Initial Scale/Move In)
        if (startAnim && animState.current < 1) {
            animState.current += delta * 0.4;
            if (animState.current > 1) animState.current = 1;
        }

        // --- CROSS FADE LOGIC ---
        // Target Opacities
        const storyTarget = isStoryDone ? 0 : 1;
        const hiTarget = isStoryDone ? 1 : 0;

        // Lerp opacity values (Smooth fade over ~1.5s)
        storyOpacity.current = THREE.MathUtils.lerp(storyOpacity.current, storyTarget, delta * 2);
        hiOpacity.current = THREE.MathUtils.lerp(hiOpacity.current, hiTarget, delta * 2);

        // Apply to Materials
        if (storyMat1.current) storyMat1.current.opacity = storyOpacity.current;
        if (storyMat1_Prefix.current) storyMat1_Prefix.current.opacity = storyOpacity.current;
        if (storyMat2.current) storyMat2.current.opacity = hiOpacity.current;
        if (storyMat3.current) storyMat3.current.opacity = hiOpacity.current;
        if (hiMat.current) hiMat.current.opacity = hiOpacity.current;

        // Lock to camera for HUD-like behavior
        groupRef.current.position.copy(camera.position);
        groupRef.current.quaternion.copy(camera.quaternion);

        // Position: MATCHING HUD TEXT (from HudText.jsx)
        let targetX = 1.2;
        let targetY = -0.6;
        let targetZ = -3;

        const isNarrow = size.width < 1100;

        // Narrow screen adjustments (Tablet & Mobile)
        if (isNarrow) {
            targetX = 0;   // Centered
            targetY = size.width < 768 ? -1.0 : -1.2; // Higher on phone, middle on tablet
            targetZ = -5;
        }

        // Start position (hidden below)
        const startY = -4.0;

        // Ease out animation
        const t = animState.current;
        const easeT = 1 - Math.pow(1 - t, 3);
        const currentY = THREE.MathUtils.lerp(startY, targetY, easeT);

        groupRef.current.translateX(targetX);
        groupRef.current.translateY(currentY);
        groupRef.current.translateZ(targetZ);
    });

    const isNarrowUI = size.width < 1100;

    const textProps = {
        font: CAVEAT_URL,
        fontSize: isNarrowUI ? 0.13 : 0.15, // Slightly smaller for tablets/mobile
        lineHeight: 1.2,
        letterSpacing: 0.02,
        anchorX: "center",
        anchorY: "middle",
        textAlign: "center",
    };

    return (
        <group ref={groupRef}>
            {/* Light to illuminate the text */}
            <pointLight position={[0, 1, 2]} intensity={2} distance={5} decay={2} color="#ffffff" />

            {/* --- PHASE 1: NAME (Initially Visible) --- */}
            <group position={[0, 0, 0]}>
                {/* "I'm" - Smaller, lighter, aligned left above name */}
                <Text
                    font={CAVEAT_URL}
                    fontSize={isNarrowUI ? 0.16 : 0.18}
                    position={[isNarrowUI ? 0 : -1.7, 0.25, 0]}
                    anchorX={isNarrowUI ? "center" : "left"}
                    anchorY="middle"
                >
                    I'm
                    <meshStandardMaterial ref={storyMat1_Prefix} transparent color="#bdc3c7" roughness={0.5} metalness={0.2} />
                </Text>

                {/* Name - Larger, aligned left below "I'm" */}
                <Text
                    font={CAVEAT_URL}
                    fontSize={isNarrowUI ? 0.25 : 0.3}
                    position={[isNarrowUI ? 0 : -1.7, 0, 0]}
                    anchorX={isNarrowUI ? "center" : "left"}
                    anchorY="middle"
                >
                    J Md Hafizur Rahman
                    <meshStandardMaterial ref={storyMat1} transparent color="#ffffff" roughness={0.5} metalness={0.2} />
                </Text>
            </group>

            {/* --- PHASE 2: BIO (Visible after 6s) --- */}
            <group position={[0, 0, 0]}>
                <Text {...textProps} fontSize={0.22} position={[0, 0.4, 0]}>
                    From Torque to TypeScript
                    <meshStandardMaterial ref={hiMat} transparent opacity={0} color="#ffffff" roughness={0.5} metalness={0.2} />
                </Text>
                <Text {...textProps} position={[0, 0.1, 0]}>
                    Started as a Mechanical Engineer at Royal Enfield
                    <meshStandardMaterial ref={storyMat2} transparent opacity={0} color="#ffffff" roughness={0.6} metalness={0.1} />
                </Text>
                <Text {...textProps} position={[0, -0.1, 0]}>
                    Now crafting WhatsApp CRM tools at Bizmagnets
                    <meshStandardMaterial ref={storyMat3} transparent opacity={0} color="#ffffff" roughness={0.6} metalness={0.1} />
                </Text>
            </group>
        </group>
    );
}
