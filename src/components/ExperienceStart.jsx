import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './ExperienceStart.scss';

export default function ExperienceStart({ onStart, onExitComplete }) {
    const tagline = "BORN TO BUILD. FORGED IN CODE.";
    const [isExiting, setIsExiting] = useState(false);
    const containerRef = useRef();

    // Generate grid for particles
    const rows = 6;
    const cols = 10;
    const totalParticles = rows * cols;
    const particles = Array.from({ length: totalParticles });

    const handleEnter = () => {
        setIsExiting(true);
        onStart(); // Start scene immediately

        // Final Exit Animation
        const tl = gsap.timeline({
            onComplete: () => {
                onExitComplete(); // Unmount component after animation
            }
        });

        // 1. Content fades/shrinks slowly (Cinematic 1s)
        tl.to('.start-content', {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.inOut"
        });

        // 2. Explode Particles (Happens after content fades)
        tl.to('.bg-particle', {
            scale: 0,
            opacity: 0,
            duration: 2,
            stagger: {
                amount: 0.5,
                grid: [rows, cols],
                from: "center"
            },
            ease: "power3.out"
        }, "-=0.5"); // Slight overlap for smoothness, but mostly after
    };

    return (
        <div className={`experience-start ${isExiting ? 'exiting' : ''}`} ref={containerRef}>
            {/* Particle Grid */}
            <div className="particle-container">
                {particles.map((_, i) => (
                    <div key={i} className="bg-particle" />
                ))}
            </div>

            <div className="start-content">
                <h1 className="animated-tagline">
                    {tagline.split("").map((char, index) => (
                        <span key={index} className="char">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </h1>
                <p className="music-tagline">
                    Immersive Audio Experience Ready
                    <span className="sound-waves">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </p>
                <button onClick={handleEnter}>
                    <span className="btn-line btn-line-top"></span>
                    <span className="btn-line btn-line-right"></span>
                    <span className="btn-line btn-line-bottom"></span>
                    <span className="btn-line btn-line-left"></span>
                    Enter Cockpit
                </button>
            </div>
        </div>
    );
}
