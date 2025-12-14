// src/components/LifeStory3D/CameraRig.jsx
import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * CameraRig: smooth, slightly slower camera that eases toward cameraTarget
 * cameraTarget, cameraLookAt are arrays [x,y,z]
 * Adjust lerpSpeed to make camera slower/faster (smaller = slower)
 */
export default function CameraRig({ cameraTarget = [0, 1.4, 6.5], cameraLookAt = [0, 1, 0] }) {
    const { camera } = useThree();
    const targetRef = useRef(new THREE.Vector3(...cameraTarget));
    const lookAtRef = useRef(new THREE.Vector3(...cameraLookAt));
    const currentLookAt = useRef(new THREE.Vector3(...cameraLookAt));

    useEffect(() => {
        targetRef.current.set(...cameraTarget);
    }, [cameraTarget]);

    useEffect(() => {
        lookAtRef.current.set(...cameraLookAt);
    }, [cameraLookAt]);

    useFrame((_, delta) => {
        // tweak this value to taste: smaller -> slower
        const lerpSpeed = 3.6;

        // smooth position lerp using exponential smoothing
        const alpha = 1 - Math.exp(-lerpSpeed * delta);
        camera.position.lerp(targetRef.current, alpha);

        // smooth lookAt: lerp the point we want to look at, then camera.lookAt it
        currentLookAt.current.lerp(lookAtRef.current, alpha * 1.1);
        camera.lookAt(currentLookAt.current);
    });

    return null;
}
