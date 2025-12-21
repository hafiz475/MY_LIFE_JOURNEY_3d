import React, { useEffect, useState } from 'react';

const Overlay = ({ section, onLand }) => {
    const [visible, setVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        setVisible(false);
        setContentVisible(false);

        // Fade in container immediately
        const containerTimer = setTimeout(() => setVisible(true), 500);

        // For Scene 2: delay content by 3 seconds (after camera settles)
        const contentTimer = setTimeout(() => {
            if (section === 1) {
                setContentVisible(true);
            } else {
                setContentVisible(true); // Other scenes show immediately
            }
        }, section === 1 ? 3500 : 500); // 3.5s for Scene 2, 0.5s for others

        return () => {
            clearTimeout(containerTimer);
            clearTimeout(contentTimer);
        };
    }, [section]);

    // Scene 2: Sunset Story - Centered with Name Font Style
    if (section === 1) {
        return (
            <>
                {/* Land Button - Always visible immediately */}
                <button className="land-button" onClick={onLand}>
                    <span className="land-icon">🛬</span>
                    <span>Land</span>
                </button>

                {/* Story Content - Delayed by 3 seconds */}
                <div className={`story-centered ${contentVisible ? 'visible' : ''}`}>
                    <h1 className="story-main-title">From Torque to TypeScript</h1>

                    <div className="story-content">
                        <p>
                            Started as a <span className="highlight">Mechanical Engineer</span> at Royal Enfield,
                            supervising 2,000 motorcycles daily. When Industry 4.0 arrived, I pivoted to code.
                        </p>
                        <p>
                            With zero background, I learned <span className="highlight">React JS</span>,
                            built CarzMoto's billing system solo, and now at <span className="highlight">Bizmagnets</span>,
                            I build WhatsApp CRM tools.
                        </p>
                        <p>
                            From tightening bolts at 72 Nm to debugging at 3 AM with Red Bull and sarcasm.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // Scene 3: Skills - Centered, Same Name Font Style
    if (section === 2) {
        return (
            <div className={`skills-overlay-centered ${visible ? 'visible' : ''}`}>
                <h1 className="skills-main-title">Skills & Achievements</h1>

                <div className="skills-categories">
                    <div className="skill-category">
                        <h3 className="category-title software">💻 Software</h3>
                        <div className="category-items">
                            <span>React JS</span>
                            <span>Node.js</span>
                            <span>MongoDB</span>
                            <span>Firebase</span>
                            <span>AWS S3</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3 className="category-title projects">🚀 Projects</h3>
                        <div className="category-items">
                            <span>CarzMoto Billing</span>
                            <span>Bizmagnets CRM</span>
                            <span>WhatsApp Automation</span>
                            <span>Nippon Paint</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3 className="category-title mechanical">⚙️ Mechanical</h3>
                        <div className="category-items">
                            <span>Kaizen & Lean</span>
                            <span>Production KPIs</span>
                            <span>Vehicle Assembly</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3 className="category-title football">⚽ Football</h3>
                        <div className="category-items">
                            <span>District-Level Player</span>
                            <span>Team Coordination</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Scene 1: Name handled by HudText
    return null;
};

export default Overlay;
