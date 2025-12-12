import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import StoryPoint from "./StoryPoint";
import TechNode from "./TechNode";
import ProjectNode from "./ProjectNode";
import HomeOverlay from "./HomeOverlay";
import ControlsUI from "./ControlsUI";

// Data
import { lifeStory } from "../../data/lifeStory";
import { techStack } from "../../data/techStack";
import { projects } from "../../data/projects";

export default function LifeStory3D() {
    const [activeStory, setActiveStory] = useState(null);
    const [activeProject, setActiveProject] = useState(null);
    const [cameraTarget, setCameraTarget] = useState([0, 0, 6]);
    const [cameraLookAt, setCameraLookAt] = useState([0, 0, 0]);

    const selectStory = (id) => {
        const item = lifeStory.find((d) => d.id === id);
        if (!item) return;
        setActiveStory(id);
        setCameraTarget([item.position[0], item.position[1] + 0.3, item.position[2] + 2]);
        setCameraLookAt(item.position);
    };

    const selectProject = (id) => {
        const item = projects.find((d) => d.id === id);
        if (!item) return;
        setActiveProject(id);
        setCameraTarget([item.position[0], item.position[1] + 0.4, item.position[2] + 2]);
        setCameraLookAt(item.position);
    };

    const goHome = () => {
        setActiveStory(null);
        setActiveProject(null);
        setCameraTarget([0, 1.4, 6.5]);
        setCameraLookAt([0, 1, 0]);
    };

    return (
        <>
            <Canvas camera={{ position: [0, 1.4, 6.5], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <CameraRig cameraTarget={cameraTarget} cameraLookAt={cameraLookAt} />

                {/* STORY POINTS */}
                {lifeStory.map((item) => (
                    <StoryPoint
                        key={item.id}
                        item={item}
                        active={activeStory === item.id}
                        onSelect={selectStory}
                    />
                ))}

                {/* TECH STACK ORBIT */}
                {techStack.map((tech, i) => (
                    <TechNode
                        key={tech.id}
                        tech={tech}
                        angle={(i / techStack.length) * Math.PI * 2}
                        radius={tech.orbit.radius}
                        height={tech.orbit.height}
                        onSelect={() => { }}
                    />
                ))}

                {/* PROJECT PLANETS */}
                {projects.map((p) => (
                    <ProjectNode
                        key={p.id}
                        project={p}
                        active={activeProject === p.id}
                        onSelect={selectProject}
                    />
                ))}
            </Canvas>

            <HomeOverlay activeSection={activeStory || activeProject} onHome={goHome} />
            <ControlsUI />
        </>
    );
}
