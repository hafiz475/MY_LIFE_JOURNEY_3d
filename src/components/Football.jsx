import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Football({ visible }) {
    const { scene } = useGLTF('/assets/models/football.glb');
    const ref = useRef();

    useEffect(() => {
        if (visible && ref.current) {
            gsap.fromTo(
                ref.current.position,
                { z: -5 },
                { z: 0, duration: 1.2, ease: 'power2.out' }
            );

            gsap.fromTo(
                ref.current.rotation,
                { x: 0 },
                { x: Math.PI * 2, duration: 1.2, ease: 'power2.out' }
            );
        }
    }, [visible]);

    return (
        <primitive
            ref={ref}
            object={scene}
            visible={visible}
            scale={0.6}
            position={[0, 0.5, 0]}
        />
    );
}
