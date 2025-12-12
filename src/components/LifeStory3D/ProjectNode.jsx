import React from "react";

export default function ProjectNode({ project, active, onSelect }) {
    /**
     project = {
       id,
       title,
       logo,
       lotties[],
       summary,
       position: [x,y,z],
       rotation: [rx,ry,rz]
     }
    */

    return (
        <group
            position={project.position}
            rotation={project.rotation}
            onClick={() => onSelect(project.id)}
        >
            {/* Placeholder planet */}
            <mesh>
                <sphereGeometry args={[0.5, 24, 24]} />
                <meshStandardMaterial color={active ? "gold" : "white"} />
            </mesh>
        </group>
    );
}
