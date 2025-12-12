import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function CameraRig({ cameraTarget, cameraLookAt }) {
    const { camera } = useThree();

    // Placeholder refs
    const targetRef = useRef(cameraTarget);
    const lookAtRef = useRef(cameraLookAt);

    useFrame(() => {
        // Later: add smooth lerping / spline tweening
        // For now: direct assignment (non-animated)
        if (cameraTarget) {
            camera.position.set(...cameraTarget);
        }
        if (cameraLookAt) {
            camera.lookAt(...cameraLookAt);
        }
    });

    return null;
}
