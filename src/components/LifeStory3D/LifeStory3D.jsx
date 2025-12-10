// src/components/LifeStory3D/LifeStory3D.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Html, OrbitControls } from "@react-three/drei";
import Lottie from "lottie-react";
import { lifeStory } from "../../data/lifeStory";
import "./LifeStory3D.scss";

/* CameraRig lerps camera position and keeps it looking at `lookAt` */
function CameraRig({ target = [0, 0, 6], lookAt = [0, 0, 0], damping = 0.08 }) {
    const { camera } = useThree();
    useFrame(() => {
        // lerp camera position
        camera.position.lerp({ x: target[0], y: target[1], z: target[2] }, damping);
        // ensure camera looks at target point
        camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    });
    return null;
}

/* Single story point: 3D Text + tiny Lottie icon above + glowing base */
function StoryPoint({ data, index, activeIndex, onSelect }) {
    const ref = useRef();
    const isActive = index === activeIndex;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            // slow bob / rotation
            ref.current.rotation.y = Math.sin(t / 2 + index * 0.6) * (isActive ? 0.18 : 0.08);
            ref.current.position.y = data.position[1] + Math.sin(t / 1.8 + index) * 0.03;
        }
    });

    return (
        <Float speed={1.2} floatIntensity={isActive ? 0.7 : 0.35} rotationIntensity={0.6}>
            <group ref={ref} position={data.position} onClick={() => onSelect(index)}>
                {/* Lottie icon using Html so animation stays crisp */}
                {data.icon && (
                    <Html position={[0, 0.9, 0]} distanceFactor={6} transform className="life-lottie-wrapper">
                        <div className="life-lottie" aria-hidden>
                            <Lottie animationData={data.icon} loop autoplay />
                        </div>
                    </Html>
                )}

                {/* 3D Title */}
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.16}
                    maxWidth={2.8}
                    anchorX="center"
                    anchorY="bottom"
                    color={index === activeIndex ? "#ff6b6b" : "#ffffff"}
                >
                    {data.title}
                </Text>

                {/* 3D Subtitle */}
                <Text
                    position={[0, 0.22, 0]}
                    fontSize={0.11}
                    maxWidth={2.6}
                    anchorX="center"
                    anchorY="bottom"
                    color={"rgba(255,255,255,0.78)"}
                >
                    {data.subtitle}
                </Text>

                {/* 3D Body */}
                <Text
                    position={[0, -0.08, 0]}
                    fontSize={0.095}
                    maxWidth={2.6}
                    anchorX="center"
                    anchorY="top"
                    color={"rgba(255,255,255,0.92)"}
                >
                    {data.body}
                </Text>

                {/* glowing base */}
                <mesh position={[0, -0.6, 0]}>
                    <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
                    <meshStandardMaterial
                        color={isActive ? "#6be7ff" : "#111217"}
                        emissive={isActive ? "#204c5a" : "#000000"}
                        emissiveIntensity={isActive ? 0.8 : 0.15}
                        roughness={0.4}
                        metalness={0.45}
                    />
                </mesh>
            </group>
        </Float>
    );
}

export default function LifeStory3D() {
    const [active, setActive] = useState(0);
    const [camTarget, setCamTarget] = useState([0, 0, 6]);
    const [lookAt, setLookAt] = useState([0, 0, 0]);

    // update camera target when active changes
    useEffect(() => {
        const current = lifeStory[active];
        if (!current) {
            setCamTarget([0, 0, 6]);
            setLookAt([0, 0, 0]);
            return;
        }
        const [x, y, z] = current.position;
        setCamTarget([x, y + 0.2, z + 2.3]); // pull camera a bit forward
        setLookAt([x, y, z]);
    }, [active]);

    // keyboard nav
    const onKey = useCallback((e) => {
        if (e.key === "ArrowRight") setActive((s) => Math.min(s + 1, lifeStory.length - 1));
        if (e.key === "ArrowLeft") setActive((s) => Math.max(s - 1, 0));
        if (e.key === "Escape") setActive(0);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onKey]);

    return (
        <div className="life-3d-root">
            <div className="life-3d-caption">
                <h2>My Life in 3D</h2>
                <p>Click a node or use ← / → keys</p>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
                <color attach="background" args={["#05070c"]} />
                <fog attach="fog" args={["#05070c", 6, 18]} />

                <ambientLight intensity={0.85} />
                <directionalLight position={[2, 5, 5]} intensity={0.7} />
                <directionalLight position={[-3, -3, -2]} intensity={0.25} />

                <CameraRig target={camTarget} lookAt={lookAt} />

                {/* controls disabled to avoid conflicts with camera rig */}
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

                {lifeStory.map((item, i) => (
                    <StoryPoint key={item.key} data={item} index={i} activeIndex={active} onSelect={setActive} />
                ))}
            </Canvas>

            <div className="life-3d-ui">
                <button className="nav-btn" onClick={() => setActive((s) => Math.max(0, s - 1))}>
                    ← Prev
                </button>

                <div className="dots">
                    {lifeStory.map((s, i) => (
                        <button key={s.key} className={`dot ${i === active ? "on" : ""}`} onClick={() => setActive(i)} />
                    ))}
                </div>

                <button className="nav-btn" onClick={() => setActive((s) => Math.min(lifeStory.length - 1, s + 1))}>
                    Next →
                </button>
            </div>
        </div>
    );
}
