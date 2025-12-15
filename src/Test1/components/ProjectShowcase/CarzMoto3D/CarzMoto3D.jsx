// src/components/ProjectShowcase/CarzMoto3D/CarzMoto3D.jsx
import React from "react";
import ProjectNode from "../../LifeStory3D/ProjectNode/ProjectNode";

export default function CarzMoto3D({ project, active, onSelect }) {
    return <ProjectNode project={project} active={active} onSelect={onSelect} />;
}
