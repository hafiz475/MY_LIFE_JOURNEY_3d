import React, { useState, useEffect } from 'react';
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

// Software content for the scroll section
const softwareContent = {
    title: "Software Craft",
    subtitle: "Building Digital Experiences",
    skills: [
        { name: "React", icon: "⚛️" },
        { name: "Node.js", icon: "🟢" },
        { name: "TypeScript", icon: "📘" },
        { name: "MongoDB", icon: "🍃" },
        { name: "Next.js", icon: "▲" },
        { name: "Three.js", icon: "🎮" }
    ]
};

export default function RoomScene({ onBack }) {
    const [selectedShirt, setSelectedShirt] = useState('football');
    const [showSoftware, setShowSoftware] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);

    // Fade in content after mount
    useEffect(() => {
        const timer = setTimeout(() => setIsContentVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Handle scroll to software section
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        if (scrollTop > 100 && !showSoftware) {
            setShowSoftware(true);
        } else if (scrollTop <= 50 && showSoftware) {
            setShowSoftware(false);
        }
    };

    const currentContent = selectedShirt === 'football' ? footballContent : royalEnfieldContent;

    return (
        <div className="room-scene-wrapper" onScroll={handleScroll}>
            {/* Back Button */}
            <button className="back-button" onClick={onBack}>
                <span className="back-icon">🚀</span>
                <span>Back to Sky</span>
            </button>

            {/* Light Bulb at Ceiling */}
            <div className="light-bulb-container">
                <div className="light-cord"></div>
                <div className="light-bulb">
                    <div className="bulb-glow"></div>
                    <div className="bulb-shape">💡</div>
                </div>
                <div className="light-cone"></div>
            </div>

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

            {/* Wooden Floor */}
            <div className="wooden-floor"></div>

            {/* Scroll Indicator */}
            {!showSoftware && (
                <div className="scroll-hint">
                    <span>Scroll for Software</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            )}

            {/* Software Section (appears on scroll) */}
            <div className={`software-section ${showSoftware ? 'visible' : ''}`}>
                <h2 className="software-title">{softwareContent.title}</h2>
                <h3 className="software-subtitle">{softwareContent.subtitle}</h3>
                <div className="skills-grid">
                    {softwareContent.skills.map((skill, index) => (
                        <div key={index} className="skill-item">
                            <span className="skill-icon">{skill.icon}</span>
                            <span className="skill-name">{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
