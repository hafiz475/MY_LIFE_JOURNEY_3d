import React, { useState, useEffect, useCallback } from 'react';
import Lottie from 'lottie-react';
import '../../styles/space-cube.scss';

// Cube face definitions
const FACES = ['front', 'top', 'bottom', 'left', 'right', 'back'];

// Rotation values for each face
const ROTATIONS = {
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
    right: { x: 0, y: -90 },
    left: { x: 0, y: 90 },
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 }
};

// Navigation mapping: from current face, which faces are reachable
const NAVIGATION = {
    front: { up: 'top', down: 'bottom', left: 'left', right: 'right' },
    top: { up: 'back', down: 'front', left: 'left', right: 'right' },
    bottom: { up: 'front', down: 'back', left: 'left', right: 'right' },
    left: { up: 'top', down: 'bottom', left: 'back', right: 'front' },
    right: { up: 'top', down: 'bottom', left: 'front', right: 'back' },
    back: { up: 'top', down: 'bottom', left: 'right', right: 'left' }
};

export default function SpaceCube() {
    const [currentFace, setCurrentFace] = useState('front');
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    const [spaceBoyLottie, setSpaceBoyLottie] = useState(null);

    // Load the Lottie animation from public folder
    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}assets/lotties/space boy developer (1).json`)
            .then(res => res.json())
            .then(data => setSpaceBoyLottie(data))
            .catch(err => console.error('Failed to load Lottie:', err));
    }, []);
    const navigateTo = useCallback((direction) => {
        if (isAnimating) return;

        const nextFace = NAVIGATION[currentFace][direction];
        if (!nextFace) return;

        setIsAnimating(true);
        setRotation(ROTATIONS[nextFace]);
        setCurrentFace(nextFace);

        setTimeout(() => setIsAnimating(false), 800);
    }, [currentFace, isAnimating]);

    // Scroll handler
    useEffect(() => {
        let scrollLocked = false;
        let touchStartY = 0;
        let touchStartX = 0;

        const handleWheel = (e) => {
            if (scrollLocked || isAnimating) return;

            e.preventDefault();
            scrollLocked = true;

            // Determine direction based on scroll
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                // Vertical scroll
                if (e.deltaY > 30) {
                    navigateTo('down');
                } else if (e.deltaY < -30) {
                    navigateTo('up');
                }
            } else {
                // Horizontal scroll
                if (e.deltaX > 30) {
                    navigateTo('right');
                } else if (e.deltaX < -30) {
                    navigateTo('left');
                }
            }

            setTimeout(() => scrollLocked = false, 1000);
        };

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
            if (scrollLocked || isAnimating) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Vertical swipe
                if (Math.abs(deltaY) > 50) {
                    scrollLocked = true;
                    if (deltaY > 0) navigateTo('down');
                    else navigateTo('up');
                    setTimeout(() => scrollLocked = false, 1000);
                }
            } else {
                // Horizontal swipe
                if (Math.abs(deltaX) > 50) {
                    scrollLocked = true;
                    if (deltaX > 0) navigateTo('right');
                    else navigateTo('left');
                    setTimeout(() => scrollLocked = false, 1000);
                }
            }
        };

        const container = document.querySelector('.star-journey-wrapper');
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [navigateTo, isAnimating]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isAnimating) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    navigateTo('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    navigateTo('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateTo('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateTo('right');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigateTo, isAnimating]);

    const cubeStyle = {
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
    };

    return (
        <div className="space-cube-container">
            <div className="cube-wrapper" style={cubeStyle}>
                {/* FRONT - Space Boy Developer */}
                <div className="cube-face front">
                    <div className="lottie-container">
                        {spaceBoyLottie && (
                            <Lottie
                                animationData={spaceBoyLottie}
                                loop={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        )}
                    </div>
                    <h2 className="face-title">Welcome!</h2>
                    <p className="face-subtitle">Explore my universe by scrolling</p>
                </div>

                {/* TOP - Tech Stack */}
                <div className="cube-face top">
                    <h2 className="face-title">💻 Tech Stack</h2>
                    <div className="tech-grid">
                        <span className="tech-tag">JavaScript</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">Node.js</span>
                        <span className="tech-tag">Express</span>
                        <span className="tech-tag">MongoDB</span>
                        <span className="tech-tag">Firebase</span>
                        <span className="tech-tag">Three.js</span>
                        <span className="tech-tag">AWS</span>
                    </div>
                </div>

                {/* BOTTOM - Contact */}
                <div className="cube-face bottom">
                    <h2 className="face-title">📬 Let's Connect</h2>
                    <div className="contact-links">
                        <a href="mailto:hafiz@example.com" className="contact-link">
                            <span className="link-icon">✉️</span>
                            <span>Email Me</span>
                        </a>
                        <a href="https://github.com/hafiz475" target="_blank" rel="noopener noreferrer" className="contact-link">
                            <span className="link-icon">🐙</span>
                            <span>GitHub</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                            <span className="link-icon">💼</span>
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>

                {/* LEFT - Life Story */}
                <div className="cube-face left">
                    <h2 className="face-title">📖 My Journey</h2>
                    <p className="story-text">
                        From Mechanical Engineer at Royal Enfield to Full-Stack Developer.
                        I traded torque specs for TypeScript and factory floors for React components.
                        A football-loving engineer who found his true calling in code.
                    </p>
                </div>

                {/* RIGHT - Projects */}
                <div className="cube-face right">
                    <h2 className="face-title">🚀 Projects</h2>
                    <div className="projects-list">
                        <div className="project-item">
                            <span className="project-icon">💬</span>
                            <span className="project-name">Bizmagnets CRM</span>
                        </div>
                        <div className="project-item">
                            <span className="project-icon">🤖</span>
                            <span className="project-name">WhatsApp Chatbots</span>
                        </div>
                        <div className="project-item">
                            <span className="project-icon">🎨</span>
                            <span className="project-name">This Portfolio</span>
                        </div>
                    </div>
                </div>

                {/* BACK - Fun Facts */}
                <div className="cube-face back">
                    <h2 className="face-title">🎯 Fun Facts</h2>
                    <div className="facts-list">
                        <div className="fact-item">
                            <span className="fact-emoji">⚽</span>
                            <span>District-level footballer</span>
                        </div>
                        <div className="fact-item">
                            <span className="fact-emoji">🏍️</span>
                            <span>Managed 2000+ Bullets/day at RE</span>
                        </div>
                        <div className="fact-item">
                            <span className="fact-emoji">☕</span>
                            <span>Powered by filter coffee</span>
                        </div>
                        <div className="fact-item">
                            <span className="fact-emoji">🌙</span>
                            <span>Peak debugging: 3 AM</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Hint */}
            <div className="cube-nav-hint">
                Scroll or use arrow keys to explore ↑↓←→
            </div>

            {/* Face Indicator */}
            <div className="face-indicator">
                {FACES.map((face) => (
                    <div
                        key={face}
                        className={`indicator-dot ${currentFace === face ? 'active' : ''}`}
                        title={face}
                    />
                ))}
            </div>
        </div>
    );
}
