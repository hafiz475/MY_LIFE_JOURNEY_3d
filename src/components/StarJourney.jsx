import React, { useState, useRef, useEffect, useMemo } from 'react';
import '../styles/star-journey.scss';

// Life story sections data
const journeySections = [
    {
        id: 1,
        title: "The Beginning",
        subtitle: "From Kicking Balls to Kicking Bugs",
        content: "Born 10 September 1997, Tamil Nadu. District-level footballer who dreamed of becoming the next Messi. Life had other plans — football slowly turned into debugging.",
        icon: "⚽",
        color: "#50FA7B"
    },
    {
        id: 2,
        title: "Royal Enfield Era",
        subtitle: "Kaizen, Torque & 2,000 Bullets a Day",
        content: "B.E. Mechanical Engineering → Kaizen Coordinator at Royal Enfield. Monitored KPIs, coordinated 500 engineers, ensured 2,000 motorcycles rolled out daily.",
        icon: "🏍️",
        color: "#FFB86C"
    },
    {
        id: 3,
        title: "Industry 4.0 Wakeup",
        subtitle: "When Robots Started Listening",
        content: "Factory shifted to IoT, robots, data dashboards. Watching robots being configured remotely, I realized: computers are taking over. Maybe I should too.",
        icon: "🤖",
        color: "#8BE9FD"
    },
    {
        id: 4,
        title: "The Great Pivot",
        subtitle: "From Spanners to Semicolons",
        content: "Zero CS background. Friend dragged me into React JS internship. Cried over centering divs. Then it clicked. Hired by Nippon Paint for digital billing project.",
        icon: "🔄",
        color: "#FF79C6"
    },
    {
        id: 5,
        title: "CarzMoto Project",
        subtitle: "Solo Full-Stack Build",
        content: "Built complete billing system: React UI, Node.js API, MongoDB, AWS S3, Firebase Auth, WhatsApp PDF sharing. Deployed on DigitalOcean. Every line — me alone.",
        icon: "🚗",
        color: "#61DAFB"
    },
    {
        id: 6,
        title: "Bizmagnets Era",
        subtitle: "WhatsApp Wizard",
        content: "2 years building WhatsApp Business CRM: chatbots, ticketing, team inboxes, automation flows. React + Node + MongoDB daily. From torque specs to 3 AM debugging.",
        icon: "💬",
        color: "#BD93F9"
    },
    {
        id: 7,
        title: "Why I Care",
        subtitle: "Systems Thinking + Craftsmanship",
        content: "Mechanical taught me process & discipline. Coding taught me creativity & UX. I like breaking things, understanding why, and rebuilding them stronger.",
        icon: "❤️",
        color: "#FF6B6B"
    }
];

// Generate random stars
const generateStars = (count, layer) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${layer}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: layer === 'near' ? 2 + Math.random() * 2 :
            layer === 'mid' ? 1 + Math.random() * 1.5 :
                0.5 + Math.random() * 1,
        opacity: layer === 'near' ? 0.9 : layer === 'mid' ? 0.6 : 0.3,
        delay: Math.random() * 3
    }));
};

export default function StarJourney({ onBack }) {
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    // Generate star layers once
    const stars = useMemo(() => ({
        far: generateStars(150, 'far'),
        mid: generateStars(100, 'mid'),
        near: generateStars(50, 'near')
    }), []);

    // Handle scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let scrollTimeout;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

            setScrollProgress(progress);
            setIsScrolling(true);

            // Calculate active section
            const sectionIndex = Math.floor(progress * journeySections.length);
            setActiveSection(Math.min(sectionIndex, journeySections.length - 1));

            // Reset scrolling state
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    return (
        <div className="star-journey-wrapper">
            {/* Back Button */}
            <button className="back-button" onClick={onBack}>
                <span className="back-icon">🚀</span>
                <span>Back to Sky</span>
            </button>

            {/* Progress Indicator */}
            <div className="journey-progress">
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ height: `${scrollProgress * 100}%` }}
                    />
                </div>
                <div className="progress-dots">
                    {journeySections.map((section, i) => (
                        <div
                            key={section.id}
                            className={`progress-dot ${i === activeSection ? 'active' : ''} ${i < activeSection ? 'passed' : ''}`}
                            style={{ '--dot-color': section.color }}
                            title={section.title}
                        />
                    ))}
                </div>
            </div>

            {/* Star Layers */}
            <div className={`star-field ${isScrolling ? 'warping' : ''}`}>
                {/* Far stars - slowest parallax */}
                <div
                    className="star-layer far"
                    style={{ transform: `translateY(${scrollProgress * -50}px)` }}
                >
                    {stars.far.map(star => (
                        <div
                            key={star.id}
                            className="star"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                opacity: star.opacity,
                                animationDelay: `${star.delay}s`
                            }}
                        />
                    ))}
                </div>

                {/* Mid stars - medium parallax */}
                <div
                    className="star-layer mid"
                    style={{ transform: `translateY(${scrollProgress * -150}px)` }}
                >
                    {stars.mid.map(star => (
                        <div
                            key={star.id}
                            className="star"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                opacity: star.opacity,
                                animationDelay: `${star.delay}s`
                            }}
                        />
                    ))}
                </div>

                {/* Near stars - fastest parallax + warp effect */}
                <div
                    className="star-layer near"
                    style={{ transform: `translateY(${scrollProgress * -300}px)` }}
                >
                    {stars.near.map(star => (
                        <div
                            key={star.id}
                            className={`star ${isScrolling ? 'streaking' : ''}`}
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: isScrolling ? `${star.size * 8}px` : `${star.size}px`,
                                opacity: star.opacity,
                                animationDelay: `${star.delay}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Fixed Center Title - stays visible */}
            <div className={`journey-center-title ${scrollProgress > 0.05 ? 'faded' : ''}`}>
                <h1>My Journey</h1>
                <p>Scroll to explore</p>
            </div>

            {/* Scrollable Content */}
            <div className="journey-scroll-container" ref={containerRef}>
                <div className="journey-content">
                    {/* Intro spacer - just space, title is fixed */}
                    <div className="journey-spacer intro">
                        <div className="journey-title">
                            <div className="scroll-indicator">
                                <span>↓</span>
                            </div>
                        </div>
                    </div>

                    {/* Journey Sections */}
                    {journeySections.map((section, index) => {
                        const sectionProgress = scrollProgress * journeySections.length;
                        const distanceFromActive = Math.abs(index - sectionProgress);
                        const isNear = distanceFromActive < 1.5;
                        const scale = isNear ? 1 - (distanceFromActive * 0.1) : 0.8;
                        const opacity = isNear ? 1 - (distanceFromActive * 0.3) : 0.3;

                        return (
                            <div
                                key={section.id}
                                className={`journey-section ${index === activeSection ? 'active' : ''}`}
                                style={{
                                    '--section-color': section.color,
                                    transform: `scale(${scale})`,
                                    opacity: opacity
                                }}
                            >
                                <div className="section-glow" />
                                <div className="section-content">
                                    <div className="section-number">{String(section.id).padStart(2, '0')}</div>
                                    <div className="section-icon">{section.icon}</div>
                                    <h2 className="section-title">{section.title}</h2>
                                    <h3 className="section-subtitle">{section.subtitle}</h3>
                                    <p className="section-text">{section.content}</p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Outro spacer */}
                    <div className="journey-spacer outro">
                        <div className="journey-end">
                            <h2>The Journey Continues...</h2>
                            <p>Thanks for traveling with me ✨</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
