import React from "react";
import "./Hero.scss";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-left">
                <h1 className="hero-title">Hi, I’m Hafiz</h1>
                <p className="hero-subtitle">
                    Senior React Developer crafting animated experiences, 3D UI,
                    and futuristic interfaces powered by React + Three.js.
                </p>

                <div className="hero-badges">
                    <span className="hero-badge">React</span>
                    <span className="hero-badge">Three.js</span>
                    <span className="hero-badge">UX Engineer</span>
                </div>
            </div>

            <div className="hero-right">
                <button className="hero-cta">Download Resume</button>
            </div>
        </section>
    );
}
