import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

export function moveCamera(camera, targetPos, lookAt = [0, 0, 0]) {
    gsap.to(camera.position, {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
            camera.lookAt(...lookAt);
        }
    });
}

export default function CameraRig() {
    const { camera } = useThree();
    camera.lookAt(0, 0, 0);
    return null;
}
