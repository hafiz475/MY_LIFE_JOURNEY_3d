import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import BentoHUD from "./components/BentoHUD/BentoHUD";
import VerticalNav from "./components/VerticalNav/VerticalNav";
import Section3D from "./components/Section3D/Section3D";
import Hero from "./components/Hero/Hero";
import Experience from "./components/Experience/Experience";
import { sections } from "./data/sections";
import "./styles/main.scss";

export default function App() {
  const [index, setIndex] = useState(0);

  return (
    <div className="app">
      {/* HUD */}
      <BentoHUD index={index} setIndex={setIndex} />

      {/* Vertical Navigation */}
      <VerticalNav index={index} setIndex={setIndex} />

      {/* Hero section (outside Canvas) */}
      <Hero />

      {/* Experience section (optional, below Hero) */}
      <Experience />

      {/* 3D Canvas */}
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 5], fov: 42 }}>
          {sections.map((s, i) => (
            <Section3D
              key={s.key}
              index={i}
              activeIndex={index}
              position={s.position || [0, 0, 0]}
              title={s.title}
              subtitle={s.subtitle}
              body={s.body}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}
