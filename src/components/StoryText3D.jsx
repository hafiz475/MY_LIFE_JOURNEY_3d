import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Same font as HudText name display
const CAVEAT_URL = "/assets/fonts/Caveat-Regular.ttf";

export default function StoryText3D() {
    const { camera, size } = useThree();
    const groupRef = useRef();

    // Animation State: 0 = Hidden, 1 = Visible
    const animState = useRef(0);
    const [startAnim, setStartAnim] = useState(false);

    // Start animation after camera settles (3 seconds delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setStartAnim(true);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Animate the state value from 0 to 1
        if (startAnim && animState.current < 1) {
            animState.current += delta * 0.4; // Fade in over ~2.5 seconds
            if (animState.current > 1) animState.current = 1;
        }

        // Lock to camera for HUD-like behavior
        groupRef.current.position.copy(camera.position);
        groupRef.current.quaternion.copy(camera.quaternion);

        // Position: Center of screen
        let targetX = 0;
        let targetY = -0.8;
        let targetZ = -4;

        // Mobile adjustments
        if (size.width < 768) {
            targetY = -1.2;
            targetZ = -5;
        }

        // Start position (hidden below)
        const startY = -3.0;

        // Ease out animation
        const t = animState.current;
        const easeT = 1 - Math.pow(1 - t, 3);
        const currentY = THREE.MathUtils.lerp(startY, targetY, easeT);

        groupRef.current.translateX(targetX);
        groupRef.current.translateY(currentY);
        groupRef.current.translateZ(targetZ);
    });

    // Shared text properties
    const titleProps = {
        font: CAVEAT_URL,
        fontSize: 0.25,
        lineHeight: 1,
        letterSpacing: 0.02,
        anchorX: "center",
        anchorY: "middle",
    };

    const bodyProps = {
        font: CAVEAT_URL,
        fontSize: 0.12,
        lineHeight: 1.4,
        letterSpacing: 0.01,
        anchorX: "center",
        anchorY: "middle",
        maxWidth: 3.5,
        textAlign: "center",
    };

    const highlightColor = "#FF6B35";  // Orange highlight
    const textColor = "#ecf0f1";       // Cloud white

    return (
        <group ref={groupRef}>
            {/* Main Title - Same style as name */}
            <Text
                {...titleProps}
                fontSize={0.22}
                position={[0, 0.7, 0]}
            >
                From Torque to TypeScript
                <meshStandardMaterial
                    color="#bdc3c7"
                    roughness={0.5}
                    metalness={0.2}
                />
            </Text>

            {/* Paragraph 1 */}
            <Text
                {...bodyProps}
                position={[0, 0.35, 0]}
            >
                Started as a Mechanical Engineer at Royal Enfield,
                {"\n"}supervising 2,000 motorcycles daily. When Industry 4.0 arrived, I pivoted to code.
                <meshStandardMaterial
                    color={textColor}
                    roughness={0.6}
                    metalness={0.1}
                />
            </Text>

            {/* Paragraph 2 */}
            <Text
                {...bodyProps}
                position={[0, 0, 0]}
            >
                With zero background, I learned React JS,
                {"\n"}built CarzMoto's billing system solo, and now at Bizmagnets,
                {"\n"}I build WhatsApp CRM tools.
                <meshStandardMaterial
                    color={textColor}
                    roughness={0.6}
                    metalness={0.1}
                />
            </Text>

            {/* Paragraph 3 */}
            <Text
                {...bodyProps}
                position={[0, -0.35, 0]}
            >
                From tightening bolts at 72 Nm to debugging at 3 AM with Red Bull and sarcasm.
                <meshStandardMaterial
                    color={textColor}
                    roughness={0.6}
                    metalness={0.1}
                />
            </Text>
        </group>
    );
}
