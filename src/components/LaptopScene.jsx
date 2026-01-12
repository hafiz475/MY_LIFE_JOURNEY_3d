import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import './LaptopScene.scss';

// 3D Gaming Laptop Model Component with Screen Content
function GamingLaptop() {
    const groupRef = useRef();
    const { scene } = useGLTF('/assets/models/gaming_laptop.glb');

    // Subtle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            // Subtle rotation wobble
            groupRef.current.rotation.y = Math.PI - 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
            groupRef.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
        }
    });

    return (
        // Centered position with proper rotation - scaled 30% more
        <group ref={groupRef} position={[0, -1.2, 1]} rotation={[0.15, Math.PI - 0.5, 0]} scale={3.77}>
            <primitive object={scene} castShadow receiveShadow />

            {/* Tech Stack Content on Screen */}
            <Html
                transform
                occlude
                position={[0.12, 0.54, 0.12]}
                rotation={[0.18, Math.PI, 0]}
                scale={0.038}
                className="laptop-screen-content"
            >
                <div className="screen-wrapper">
                    <div className="screen-header">
                        <div className="window-controls">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <span className="tab-title">tech-stack.dev</span>
                    </div>
                    <div className="screen-body">
                        <h1 className="tech-title">My Tech Stack</h1>
                        <div className="tech-grid">
                            <div className="tech-card react">
                                <span className="tech-icon">⚛️</span>
                                <span className="tech-name">React</span>
                                <span className="tech-level">Expert</span>
                            </div>
                            <div className="tech-card node">
                                <span className="tech-icon">🟢</span>
                                <span className="tech-name">Node.js</span>
                                <span className="tech-level">Advanced</span>
                            </div>
                            <div className="tech-card typescript">
                                <span className="tech-icon">📘</span>
                                <span className="tech-name">TypeScript</span>
                                <span className="tech-level">Expert</span>
                            </div>
                            <div className="tech-card mongodb">
                                <span className="tech-icon">🍃</span>
                                <span className="tech-name">MongoDB</span>
                                <span className="tech-level">Advanced</span>
                            </div>
                            <div className="tech-card threejs">
                                <span className="tech-icon">🎨</span>
                                <span className="tech-name">Three.js</span>
                                <span className="tech-level">Intermediate</span>
                            </div>
                            <div className="tech-card nextjs">
                                <span className="tech-icon">▲</span>
                                <span className="tech-name">Next.js</span>
                                <span className="tech-level">Advanced</span>
                            </div>
                        </div>
                        <div className="what-i-build">
                            <h2>What I Build</h2>
                            <ul>
                                <li>Enterprise chat applications</li>
                                <li>3D portfolio experiences</li>
                                <li>CRM integrations</li>
                                <li>Workflow automation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    );
}

// Floor/Desk surface component
function DeskSurface() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
                color="#0a0a0a"
                roughness={0.9}
                metalness={0.05}
            />
        </mesh>
    );
}

// Loading fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#9333ea',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif'
            }}>
                Loading...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function LaptopScene() {
    return (
        <div className="laptop-scene-container">
            <Canvas
                camera={{ position: [0, 1.5, 5], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: true }}
            >
                {/* Lighting - Premium look */}
                <ambientLight intensity={0.4} />
                <spotLight
                    position={[5, 8, 5]}
                    angle={0.4}
                    penumbra={0.8}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <spotLight
                    position={[-5, 5, 3]}
                    angle={0.5}
                    penumbra={1}
                    intensity={0.5}
                    color="#6b21a8"
                />
                <pointLight position={[0, 3, 2]} intensity={0.3} color="#ffffff" />

                {/* The Gaming Laptop Model */}
                <Suspense fallback={<Loader />}>
                    <GamingLaptop />
                </Suspense>

                {/* Desk/Floor Surface */}
                <DeskSurface />

                {/* Subtle shadow on ground */}
                <ContactShadows
                    position={[0, -1.79, 0]}
                    opacity={0.7}
                    scale={12}
                    blur={2.5}
                    far={6}
                />

                {/* Environment for realistic reflections */}
                <Environment preset="city" />

            </Canvas>



            {/* Contact Links - Circular icon buttons */}
            <div className="contact-links-section">
                <div className="contact-links">
                    <a href="mailto:your.email@example.com" className="contact-circle email" target="_blank" rel="noopener noreferrer" title="Email">
                        <span className="contact-icon">✉️</span>
                    </a>
                    <a href="tel:+919876543210" className="contact-circle phone" target="_blank" rel="noopener noreferrer" title="Call">
                        <span className="contact-icon">📞</span>
                    </a>
                    <a href="https://wa.me/919876543210" className="contact-circle whatsapp" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                        <span className="contact-icon">💬</span>
                    </a>
                    <a href="https://linkedin.com/in/yourprofile" className="contact-circle linkedin" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <span className="contact-icon">💼</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

// Preload the model
useGLTF.preload('/assets/models/gaming_laptop.glb');
