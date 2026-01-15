import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Html,
    useGLTF,
    OrbitControls,
    Environment,
    ContactShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import './PolyThemeScene.scss';

// The 3D Model inside the sphere
function WorkingModel() {
    const groupRef = useRef();
    const { scene } = useGLTF('/assets/models/landingscene/working.glb');

    // Gentle rotation animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    // Setup shadows for the model
    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1.5, 0]} scale={0.4}>
            <primitive object={scene} />
        </group>
    );
}

// Transparent Glass Sphere enclosure
function GlassSphere() {
    const sphereRef = useRef();

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <mesh ref={sphereRef} position={[0, 0, 0]}>
            <sphereGeometry args={[4, 64, 64]} />
            <meshPhysicalMaterial
                transparent
                opacity={0.2}
                roughness={0.05}
                metalness={0.1}
                transmission={0.85}
                thickness={0.8}
                envMapIntensity={1.5}
                color="#ffffff"
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Transparent floor inside the sphere with shadow reception
function TransparentFloor() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.5, 0]}
            receiveShadow
        >
            <circleGeometry args={[3, 64]} />
            <shadowMaterial
                transparent
                opacity={0.4}
                color="#003344"
            />
        </mesh>
    );
}

// Very bright sun light source inside the sphere
function BrightSun() {
    const sunRef = useRef();

    useFrame((state) => {
        if (sunRef.current) {
            // Subtle pulsing effect
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            sunRef.current.intensity = 4 * pulse;
        }
    });

    return (
        <>
            {/* Main sun directional light for shadows */}
            <directionalLight
                ref={sunRef}
                position={[3, 6, 2]}
                intensity={4}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={20}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                shadow-bias={-0.0001}
                color="#ffffff"
            />

            {/* Visual sun sphere */}
            <mesh position={[3, 6, 2]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial color="#ffffaa" />
            </mesh>

            {/* Sun glow point light */}
            <pointLight
                position={[3, 6, 2]}
                intensity={3}
                distance={15}
                color="#fff5e0"
            />

            {/* Additional fill lights for the sphere interior */}
            <pointLight
                position={[-2, 3, -2]}
                intensity={1}
                distance={10}
                color="#00f9ff"
            />
            <pointLight
                position={[2, 1, 3]}
                intensity={0.8}
                distance={8}
                color="#ffffff"
            />
        </>
    );
}

// Loading Fallback
function Loader() {
    return (
        <Html center>
            <div style={{
                color: '#00f9ff',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 0 20px #00f9ff'
            }}>
                Loading PolyTheme...
            </div>
        </Html>
    );
}

// Main Scene Component
export default function PolyThemeScene() {
    const navigate = useNavigate();

    return (
        <div className="polytheme-scene-container">
            <Canvas
                camera={{ position: [0, 3, 12], fov: 45 }}
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap }
                }}
                dpr={[1, 2]}
            >
                {/* Camera Controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={15}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                    autoRotate
                    autoRotateSpeed={0.5}
                />

                {/* Background color */}
                <color attach="background" args={['#00f9ff']} />

                {/* Ambient lighting */}
                <ambientLight intensity={0.5} />

                {/* Bright sun inside the sphere */}
                <BrightSun />

                {/* The Glass Sphere */}
                <GlassSphere />

                {/* The 3D Model */}
                <Suspense fallback={<Loader />}>
                    <WorkingModel />
                </Suspense>

                {/* Transparent Floor with Shadows */}
                <TransparentFloor />

                {/* Contact Shadows for extra depth */}
                <ContactShadows
                    position={[0, -1.49, 0]}
                    opacity={0.6}
                    scale={8}
                    blur={2.5}
                    far={4}
                    color="#004455"
                />

                {/* Environment for reflections */}
                <Environment preset="sunset" />

                {/* Post-processing */}
                <EffectComposer>
                    <Bloom
                        intensity={0.5}
                        luminanceThreshold={0.3}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.4} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay */}
            <div className="polytheme-ui-overlay">
                {/* Back Button */}
                <button
                    className="polytheme-back-button"
                    onClick={() => navigate('/')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Title */}
                <div className="polytheme-title">
                    <h1>PolyTheme</h1>
                    <p>3D Model Showcase</p>
                </div>
            </div>
        </div>
    );
}

// Preload the model
useGLTF.preload('/assets/models/landingscene/working.glb');
