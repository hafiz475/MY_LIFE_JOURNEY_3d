import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Local Font Path (served from public/assets/fonts)
const CAVEAT_URL = `${import.meta.env.BASE_URL}assets/fonts/Caveat-Regular.ttf`;

export default function HudText() {
    const { camera, size } = useThree();
    const groupRef = useRef();

    // Animation State
    // 0 = Hidden (Below), 1 = Visible (In Position)
    const animState = useRef(0);
    const [startAnim, setStartAnim] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStartAnim(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Animate the state value from 0 to 1
        if (startAnim && animState.current < 1) {
            animState.current += delta * 0.5; // Slide up over ~2 seconds
            if (animState.current > 1) animState.current = 1;
        }

        // --- HUD LOCKING LOGIC ---
        // Lock rotation/position base to camera
        groupRef.current.position.copy(camera.position);
        groupRef.current.quaternion.copy(camera.quaternion);

        // --- POSITION INTERPOLATION ---

        // Target (Visible) Offset
        let targetX = 1.2;
        let targetY = -0.6;
        let targetZ = -3;

        const isMobile = size.width < 768;
        const isTablet = size.width < 1100;

        // Mobile Adjustments: Center and Below Plane
        if (isMobile) {
            targetX = 0;   // Perfectly centered
            targetY = -1.8; // Lower down (below plane)
            targetZ = -5;  // Push back slightly
        } else if (isTablet) {
            // Tablet Adjustments: Keep on right but safer distance from edge
            targetX = 0.7;
            targetY = -0.8;
            targetZ = -4;
        }

        // Start (Hidden) Offset: Lower down
        const startY = -4.0;

        // Current Y based on animation state (Smooth Ease Out)
        // t is 0..1
        const t = animState.current;
        const easeT = 1 - Math.pow(1 - t, 3); // Cubic ease out

        const currentY = THREE.MathUtils.lerp(startY, targetY, easeT);

        // Apply offsets in Local Space
        groupRef.current.translateX(targetX);
        groupRef.current.translateY(currentY); // Animate Y
        groupRef.current.translateZ(targetZ);
    });

    // Shared TextProps for consistency
    const textProps = {
        font: CAVEAT_URL,
        fontSize: 0.25,
        lineHeight: 1,
        letterSpacing: 0.02,
        extrusion: 0.02, // 3D Depth
        anchorX: "left",
        anchorY: "middle",
    };

    return (
        <group ref={groupRef}>
            {/* Hi! */}
            <Text
                {...textProps}
                fontSize={0.5}
                position={[0, 0.1, 0]} // Center within the group
                anchorX="center"
            >
                Hi!
                <meshStandardMaterial
                    color="#ecf0f1"
                    roughness={0.6}
                    metalness={0.1}
                />
            </Text>
        </group>
    );
}
