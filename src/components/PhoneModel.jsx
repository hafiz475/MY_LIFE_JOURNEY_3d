import { useRef } from 'react';
import { useGLTF, Html, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function PhoneModel({ onClick, isActive }) {
    const groupRef = useRef();
    const { scene } = useGLTF('/assets/models/phone_free.glb');

    useFrame((state) => {
        if (groupRef.current && !isActive) {
            // Subtle floating animation when not active
            groupRef.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
            <group
                ref={groupRef}
                position={[2.5, -0.8, 1.5]}
                rotation={[0.1, -0.3, 0]}
                scale={0.8}
                onClick={onClick}
            >
                <primitive object={scene} />

                {/* Contact Details Screen */}
                {isActive && (
                    <Html
                        transform
                        occlude
                        position={[0, 0.15, 0.02]}
                        rotation={[0, 0, 0]}
                        scale={0.15}
                        className="phone-screen-content"
                    >
                        <div className="phone-contact-screen">
                            <div className="contact-header">
                                <div className="avatar">👨‍💻</div>
                                <h2>CONTACT ME</h2>
                            </div>
                            <div className="contact-links">
                                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp">
                                    <span className="icon">💬</span>
                                    <span className="text">WhatsApp</span>
                                </a>
                                <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="contact-link linkedin">
                                    <span className="icon">💼</span>
                                    <span className="text">LinkedIn</span>
                                </a>
                                <a href="mailto:your.email@example.com" className="contact-link email">
                                    <span className="icon">📧</span>
                                    <span className="text">Email</span>
                                </a>
                            </div>
                            <p className="instruction">Click anywhere to close</p>
                        </div>
                    </Html>
                )}

                {/* Phone glow */}
                <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#00ffff" distance={2} />
            </group>
        </Float>
    );
}

// Preload the model
useGLTF.preload('/assets/models/phone_free.glb');
