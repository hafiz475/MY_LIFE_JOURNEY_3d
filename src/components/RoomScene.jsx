import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ParticleEffect from './ParticleEffect';
import LaptopScene from './LaptopScene';
import '../styles/room-scene.scss';

// Football t-shirt content
const footballContent = {
    title: "Football Passion",
    subtitle: "The Beautiful Game",
    storyPoints: [
        "District-level player — the Messi of my small town",
        "Weekend matches with friends on dusty grounds",
        "The pitch has always been my second home"
    ],
    cards: [
        {
            icon: "/assets/2dModels/football_img.png",
            title: "Weekend Warrior",
            description: "Every weekend, the local pitch becomes my battlefield. Rain or shine, the game must go on."
        },
        {
            icon: "/assets/2dModels/chess_img.png",
            title: "Tactical Mind",
            description: "Reading the game, anticipating moves, and finding that perfect through ball. Football is chess at 100 km/h."
        },
        {
            icon: "/assets/2dModels/trophy_img.png",
            title: "Team Leader",
            description: "Captain spirit runs deep. Leading by example, lifting the team when spirits are low."
        },
        {
            icon: "/assets/2dModels/heart_img.png",
            title: "Pure Passion",
            description: "From watching legends on TV to playing under streetlights. This love never fades."
        }
    ]
};

// Royal Enfield content - My Real Story
const royalEnfieldContent = {
    title: "Royal Enfield Era",
    subtitle: "Kaizen, Torque & 2,000 Bullets a Day",
    storyPoints: [
        "B.E. Mechanical Engineering → Robotics & Mechatronics",
        "Kaizen Coordinator + Vehicle Assembly Supervisor",
        "Coordinated with 500+ engineers daily",
        "2,000 motorcycles rolled out every single day",
        "'Torque it properly, macha!' — 17 times per shift 😄"
    ],
    cards: [
        {
            icon: "🏭",
            title: "Production Floor",
            description: "Supervising 2,000 motorcycles daily. Every bolt tightened, every engine tested — zero compromises."
        },
        {
            icon: "/assets/2dModels/kaizen_master.png",
            title: "Kaizen Master",
            description: "Continuous improvement wasn't just a buzzword. It was hunting inefficiencies and making processes bulletproof."
        },
        {
            icon: "/assets/2dModels/mechanical_engineer.png",
            title: "500+ Engineers",
            description: "Coordinating with a massive team across shifts. Communication, leadership, and keeping the line moving."
        },
        {
            icon: "⚡",
            title: "The Pivot",
            description: "Industry 4.0 hit the factory — robots, IoT, data everywhere. That's when I knew: time to learn code."
        }
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

// Software scene component - now uses 3D Laptop
function SoftwareScene({ onBack }) {
    return (
        <div className={`software-cockpit visible`}>
            {/* Back button */}
            <button className="back-to-room" onClick={onBack}>
                <span>← Back to Interests</span>
            </button>

            {/* 3D Laptop Scene */}
            <LaptopScene />
        </div>
    );
}

export default function RoomScene({ onBack }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedShirt, setSelectedShirt] = useState('football');
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    // Check if we're on the /software route
    const showSoftware = location.pathname === '/software';

    // Reset card index when shirt changes
    useEffect(() => {
        setActiveCardIndex(0);
    }, [selectedShirt]);

    // Fade in content after mount
    useEffect(() => {
        const timer = setTimeout(() => setIsContentVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Handle software transition - navigate to /software route
    const handleEnterSoftware = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/software');
        }, 800);
    };

    // Handle back from software - navigate to /room route
    const handleBackFromSoftware = () => {
        setIsTransitioning(false);
        navigate('/room');
    };

    const currentContent = selectedShirt === 'football' ? footballContent : royalEnfieldContent;

    // Show software scene if on /software route
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

                {/* Content Display - No Card Design */}
                <div className={`passion-display ${selectedShirt}`}>
                    <h2 className="passion-title">{currentContent.title}</h2>
                    <h3 className="passion-subtitle">{currentContent.subtitle}</h3>

                    {/* Story Points - Timeline Style */}
                    <div className="story-points">
                        {currentContent.storyPoints.map((point, index) => (
                            <div key={index} className="story-point" style={{ animationDelay: `${0.5 + index * 0.15}s` }}>
                                <span className="point-marker">▹</span>
                                <span className="point-text">{point}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stacked Carousel */}
                    <div className="carousel-container">
                        <div className="carousel-stack">
                            {currentContent.cards.map((card, index) => {
                                // Calculate position relative to active card
                                const position = index - activeCardIndex;
                                let positionClass = '';

                                if (position === 0) positionClass = 'active';
                                else if (position === -1 || (activeCardIndex === 0 && index === currentContent.cards.length - 1)) positionClass = 'prev';
                                else if (position === 1 || (activeCardIndex === currentContent.cards.length - 1 && index === 0)) positionClass = 'next';
                                else if (position < -1) positionClass = 'prev-hidden';
                                else positionClass = 'next-hidden';

                                return (
                                    <div
                                        key={index}
                                        className={`carousel-card ${positionClass}`}
                                        onClick={() => setActiveCardIndex(index)}
                                    >
                                        {/* Animated neon border lines */}
                                        <span className="border-line border-line-top"></span>
                                        <span className="border-line border-line-right"></span>
                                        <span className="border-line border-line-bottom"></span>
                                        <span className="border-line border-line-left"></span>

                                        {/* Card icon - supports both images and emojis */}
                                        {card.icon.startsWith('/') ? (
                                            <img src={card.icon} alt={card.title} className="card-icon-img" />
                                        ) : (
                                            <span className="card-icon">{card.icon}</span>
                                        )}
                                        <h4 className="card-title">{card.title}</h4>
                                        <p className="card-description">{card.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dot Navigation */}
                        <div className="carousel-dots">
                            {currentContent.cards.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === activeCardIndex ? 'active' : ''}`}
                                    onClick={() => setActiveCardIndex(index)}
                                    aria-label={`Go to card ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Software Journey Button - Bottom Center */}
                <div className="software-journey-section">
                    <p className="journey-tagline">
                        Ready to explore my professional side?
                        <span className="css-laptop">
                            <span className="laptop-screen"></span>
                            <span className="laptop-base"></span>
                        </span>
                    </p>
                    <button className="journey-btn" onClick={handleEnterSoftware}>
                        <span className="btn-line btn-line-top"></span>
                        <span className="btn-line btn-line-right"></span>
                        <span className="btn-line btn-line-bottom"></span>
                        <span className="btn-line btn-line-left"></span>
                        <span className="journey-text">EXPLORE SOFTWARE CRAFT</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
