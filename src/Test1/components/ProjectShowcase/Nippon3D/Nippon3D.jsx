// src/components/ProjectShowcase/Nippon3D/Nippon3D.jsx
import React from "react";
import ProjectNode from "../../LifeStory3D/ProjectNode/ProjectNode";

export default function Nippon3D({ project, active, onSelect }) {
    return <ProjectNode project={project} active={active} onSelect={onSelect} />;
}
