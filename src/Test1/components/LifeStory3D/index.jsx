// src/components/LifeStory3D/index.jsx
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import HeroHub from "./HeroHub/HeroHub";
import StoryPoint from "./StoryPoint/StoryPoint";
import TechNode from "./TechNode/TechNode";
import ProjectNode from "./ProjectNode/ProjectNode";
import SpiralRibbon from "./SpiralRibbon/SpiralRibbon";
import HomeOverlay from "./HomeOverlay/HomeOverlay";
import ControlsUI from "./ControlsUI/ControlsUI";
import "./index.scss";

import { lifeStory } from "../../data/lifeStory";
import { techStack } from "../../data/techStack";
import { projects } from "../../data/projects";

export default function LifeStory3D() {
    const [activeStoryIndex, setActiveStoryIndex] = useState(null); // index into lifeStory
    const [activeProjectIndex, setActiveProjectIndex] = useState(null);
    const [cameraTarget, setCameraTarget] = useState([0, 1.4, 6.5]);
    const [cameraLookAt, setCameraLookAt] = useState([0, 1, 0]);

    const focusStoryByIndex = (index) => {
        if (index == null || index < 0 || index >= lifeStory.length) return;
        const item = lifeStory[index];
        setActiveStoryIndex(index);
        setActiveProjectIndex(null);
        setCameraTarget([item.position[0], item.position[1] + 0.28, item.position[2] + 1.6]); // closer for mobile-friendly framing
        setCameraLookAt(item.position);
    };

    const focusProjectByIndex = (index) => {
        if (index == null || index < 0 || index >= projects.length) return;
        const p = projects[index];
        setActiveProjectIndex(index);
        setActiveStoryIndex(null);
        setCameraTarget([p.position[0], p.position[1] + 0.35, p.position[2] + 1.6]);
        setCameraLookAt(p.position);
    };

    const selectStory = (id) => {
        const idx = lifeStory.findIndex((d) => d.id === id);
        if (idx === -1) return;
        focusStoryByIndex(idx);
    };

    const selectProject = (id) => {
        const idx = projects.findIndex((d) => d.id === id);
        if (idx === -1) return;
        focusProjectByIndex(idx);
    };

    const goHome = () => {
        setActiveStoryIndex(null);
        setActiveProjectIndex(null);
        setCameraTarget([0, 1.4, 6.5]);
        setCameraLookAt([0, 1, 0]);
    };

    // Prev / Next behavior: if a story is active, navigate stories; if a project is active, navigate projects; else navigate stories.
    const onPrev = () => {
        if (activeProjectIndex != null) {
            const next = (activeProjectIndex - 1 + projects.length) % projects.length;
            focusProjectByIndex(next);
            return;
        }
        const base = activeStoryIndex != null ? activeStoryIndex : 0;
        const prev = (base - 1 + lifeStory.length) % lifeStory.length;
        focusStoryByIndex(prev);
    };

    const onNext = () => {
        if (activeProjectIndex != null) {
            const next = (activeProjectIndex + 1) % projects.length;
            focusProjectByIndex(next);
            return;
        }
        const base = activeStoryIndex != null ? activeStoryIndex : -1;
        const next = base === -1 ? 0 : (base + 1) % lifeStory.length;
        focusStoryByIndex(next);
    };

    return (
        <div className="lifescene-root">
            <Canvas camera={{ position: [0, 1.4, 6.5], fov: 50 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[2, 5, 2]} intensity={0.6} />
                <CameraRig cameraTarget={cameraTarget} cameraLookAt={cameraLookAt} />

                <HeroHub position={[0, 1, 0]} />

                <SpiralRibbon />

                {lifeStory.map((item, i) => (
                    <StoryPoint key={item.id} item={item} active={activeStoryIndex === i} onSelect={selectStory} />
                ))}

                {techStack.map((tech, i) => (
                    <TechNode key={tech.id} tech={tech} angle={(i / techStack.length) * Math.PI * 2} radius={tech.orbit.radius} height={tech.orbit.height} onSelect={() => { }} />
                ))}

                {projects.map((p, i) => (
                    <ProjectNode key={p.id} project={p} active={activeProjectIndex === i} onSelect={selectProject} />
                ))}
            </Canvas>

            <HomeOverlay activeSection={activeProjectIndex != null ? projects[activeProjectIndex].id : (activeStoryIndex != null ? lifeStory[activeStoryIndex].id : null)} onHome={goHome} />
            <ControlsUI onPrev={onPrev} onNext={onNext} />
        </div>
    );
}
