import React from "react";
// import { Text } from "@react-three/drei"; // later
// import Lottie from "../Shared/LottieFallback"; // later

export default function StoryPoint({ item, active, onSelect }) {
    /**
     item = {
        id,
        title,
        subtitle,
        text,
        icon,
        position: [x,y,z],
        rotation: [rx,ry,rz]
     }
    */

    return (
        <group
            position={item.position}
            rotation={item.rotation}
            onClick={() => onSelect(item.id)}
        >
            {/* Lottie Crest Placeholder */}
            {/* <Lottie src={item.icon} /> */}

            {/* 3D Text Placeholder */}
            {/* <Text>{item.title}</Text> */}

            {/* For now: placeholder box */}
            <mesh>
                <boxGeometry args={[0.6, 0.4, 0.1]} />
                <meshStandardMaterial color={active ? "orange" : "white"} />
            </mesh>
        </group>
    );
}
