import { useRef } from 'react';
import { useGLTF, Html, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function PhoneModel({ onClick, isActive }) {
    const groupRef = useRef();
    const { scene } = useGLTF('/assets/models/phone_free.glb');

    useFrame((state) => {
        if (groupRef.current && !isActive) {
            // Subtle floating animation when not active
            groupRef.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.005;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.02}>
            <group
                ref={groupRef}
                position={[3.2, -1.2, 0.8]}
                rotation={[-Math.PI / 2, 0, -0.2]}
                scale={0.12}
                onClick={onClick}
            >
                <primitive object={scene} />

                {/* Contact Details Screen - Neon Styled */}
                {isActive && (
                    <Html
                        transform
                        occlude
                        position={[0, 0, 0.3]}
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.7}
                        className="phone-screen-content"
                    >
                        <div className="neon-contact-card">
                            <div className="neon-header">
                                <span className="neon-avatar">⚡</span>
                                <h2>CONNECT</h2>
                            </div>
                            <div className="neon-links">
                                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="neon-link wa">
                                    <span className="neon-icon">💬</span>
                                    <span>WhatsApp</span>
                                </a>
                                <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="neon-link li">
                                    <span className="neon-icon">💼</span>
                                    <span>LinkedIn</span>
                                </a>
                                <a href="mailto:your.email@example.com" className="neon-link em">
                                    <span className="neon-icon">📧</span>
                                    <span>Email</span>
                                </a>
                            </div>
                        </div>
                    </Html>
                )}

                {/* Phone glow */}
                <pointLight position={[0, 0, 0.5]} intensity={0.4} color="#ff0066" distance={1.5} />
            </group>
        </Float>
    );
}

// Preload the model
useGLTF.preload('/assets/models/phone_free.glb');
