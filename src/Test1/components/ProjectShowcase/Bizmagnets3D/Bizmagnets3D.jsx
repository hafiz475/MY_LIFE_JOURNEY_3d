// src/components/ProjectShowcase/Bizmagnets3D/Bizmagnets3D.jsx
import React from "react";
import ProjectNode from "../../LifeStory3D/ProjectNode/ProjectNode";

export default function Bizmagnets3D({ project, active, onSelect }) {
    return <ProjectNode project={project} active={active} onSelect={onSelect} />;
}
