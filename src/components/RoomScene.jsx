import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import Lottie from 'lottie-react';
import footballAnimation from '../assets/lotties/football.json';
import '../styles/room-scene.scss';

// Football t-shirt content
const footballContent = {
    title: "Football Passion",
    subtitle: "The Beautiful Game",
    description: "Football isn't just a sport—it's a way of life. From weekend matches with friends to watching legendary games, the pitch has always been my second home.",
    highlights: [
        "Weekend warrior on the local pitch",
        "Tactical mind for the beautiful game",
        "Team player with leadership spirit",
        "Never-ending passion for the sport"
    ]
};

// Royal Enfield content
const royalEnfieldContent = {
    title: "Royal Enfield",
    subtitle: "The Torque Life",
    description: "There's nothing quite like the thump of a Royal Enfield engine. The open road, the wind, and the machine that connects you to every mile traveled.",
    highlights: [
        "Weekend road trips explorer",
        "Mechanical soul & DIY enthusiast",
        "Brotherhood of riders",
        "Freedom on two wheels"
    ]
};

// Software content
const softwareContent = {
    title: "Software Engineering",
    subtitle: "Crafting Digital Experiences",
    description: "From frontend magic to backend architecture, I build robust and scalable applications that solve real-world problems.",
    skills: [
        { name: "React", level: "Expert" },
        { name: "Node.js", level: "Advanced" },
        { name: "TypeScript", level: "Expert" },
        { name: "MongoDB", level: "Advanced" },
        { name: "Three.js", level: "Intermediate" },
        { name: "Next.js", level: "Advanced" }
    ],
    projects: [
        "Built enterprise chat applications",
        "Created 3D portfolio experiences",
        "Developed CRM integrations",
        "Automated workflow systems"
    ]
};

// Hologram 3D Model
function HologramModel() {
    const { scene } = useGLTF('/assets/models/looking_glass_hologram_technology_meet_art.glb');
    const modelRef = React.useRef();

    useFrame((state) => {
        if (modelRef.current) {
            modelRef.current.rotation.y += 0.005;
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={2}
            position={[0, -0.5, 0]}
        />
    );
}

// Software Scene Component
function SoftwareScene({ onBack }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`software-cockpit ${isVisible ? 'visible' : ''}`}>
            {/* Back button */}
            <button className="back-to-room" onClick={onBack}>
                <span>← Back to Interests</span>
            </button>

            {/* 3D Hologram Canvas */}
            <div className="hologram-container">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
                        <pointLight position={[-5, 5, 5]} intensity={1} color="#ff00ff" />
                        <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffffff" />
                        <HologramModel />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Software Content */}
            <div className="software-content">
                <h1 className="software-title">{softwareContent.title}</h1>
                <h2 className="software-subtitle">{softwareContent.subtitle}</h2>
                <p className="software-description">{softwareContent.description}</p>

                <div className="skills-section">
                    <h3>Tech Stack</h3>
                    <div className="skills-list">
                        {softwareContent.skills.map((skill, index) => (
                            <div key={index} className="skill-tag">
                                <span className="skill-name">{skill.name}</span>
                                <span className="skill-level">{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="projects-section">
                    <h3>What I Build</h3>
                    <ul className="projects-list">
                        {softwareContent.projects.map((project, index) => (
                            <li key={index}>{project}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function RoomScene({ onBack }) {
    const [selectedShirt, setSelectedShirt] = useState('football');
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showSoftware, setShowSoftware] = useState(false);

    // Fade in content after mount
    useEffect(() => {
        const timer = setTimeout(() => setIsContentVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Handle cockpit enter
    const handleEnterCockpit = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowSoftware(true);
        }, 800);
    };

    // Handle back from software
    const handleBackFromSoftware = () => {
        setShowSoftware(false);
        setIsTransitioning(false);
    };

    const currentContent = selectedShirt === 'football' ? footballContent : royalEnfieldContent;

    // Show software scene
    if (showSoftware) {
        return <SoftwareScene onBack={handleBackFromSoftware} />;
    }

    return (
        <div className={`room-scene-wrapper ${isTransitioning ? 'fade-out' : ''}`}>
            {/* Back Button */}
            <button className="back-button" onClick={onBack}>
                <span className="back-icon">🚀</span>
                <span>Back to Sky</span>
            </button>

            {/* Main Content Area */}
            <div className={`room-content ${isContentVisible ? 'visible' : ''}`}>
                {/* T-Shirts Display */}
                <div className="tshirts-wall">
                    <div
                        className={`tshirt-item ${selectedShirt === 'football' ? 'active' : ''}`}
                        onClick={() => setSelectedShirt('football')}
                    >
                        <div className="hanger"></div>
                        <img
                            src="/assets/2dModels/football_tshirt.png"
                            alt="Football Jersey"
                            className="tshirt-image"
                        />
                        <span className="tshirt-label">Football</span>
                    </div>

                    <div
                        className={`tshirt-item ${selectedShirt === 'enfield' ? 'active' : ''}`}
                        onClick={() => setSelectedShirt('enfield')}
                    >
                        <div className="hanger"></div>
                        <img
                            src="/assets/2dModels/RE_tshirt.png"
                            alt="Royal Enfield"
                            className="tshirt-image"
                        />
                        <span className="tshirt-label">Royal Enfield</span>
                    </div>
                </div>

                {/* Content Panel */}
                <div className={`content-panel ${selectedShirt}`}>
                    <h2 className="content-title">{currentContent.title}</h2>
                    <h3 className="content-subtitle">{currentContent.subtitle}</h3>
                    <p className="content-description">{currentContent.description}</p>
                    <ul className="content-highlights">
                        {currentContent.highlights.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Football Lottie at side */}
            <div className="football-lottie">
                <Lottie
                    animationData={footballAnimation}
                    loop={true}
                    style={{ width: 120, height: 120 }}
                />
            </div>

            {/* Enter Cockpit Button */}
            <button className="enter-cockpit-btn" onClick={handleEnterCockpit}>
                <div className="cockpit-btn-content">
                    <span className="cockpit-icon">🚀</span>
                    <span className="cockpit-text">Enter Cockpit</span>
                    <span className="cockpit-subtext">Explore my Software Journey</span>
                </div>
                <div className="cockpit-btn-glow"></div>
            </button>
        </div>
    );
}
