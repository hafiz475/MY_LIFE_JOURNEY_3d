import React, { useEffect, useState } from 'react';

const Overlay = ({ section, onLand, onBack, isStoryDone }) => {
    const [visible, setVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [landButtonVisible, setLandButtonVisible] = useState(false);

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

    // Show Land button after 6 seconds when isStoryDone becomes true in section 1
    useEffect(() => {
        if (section === 1 && isStoryDone) {
            const landButtonTimer = setTimeout(() => {
                setLandButtonVisible(true);
            }, 6000); // 6 second delay

            return () => clearTimeout(landButtonTimer);
        } else {
            setLandButtonVisible(false);
        }
    }, [section, isStoryDone]);

    // Scene 2: Sunset Story - Land Button appears 6 seconds after "Hi" appears (isStoryDone)
    if (section === 1) {
        return landButtonVisible ? (
            <button className="land-button" onClick={onLand}>
                <span className="land-icon">🛬</span>
                <span>Land</span>
            </button>
        ) : null;
    }

    // Scene 3: Space Galaxy - Skills Showcase
    if (section === 2) {
        return (
            <>
                {/* Back Button */}
                <button className="back-button" onClick={onBack}>
                    <span className="back-icon">🚀</span>
                    <span>Back to Sky</span>
                </button>

                <div className={`space-skills-overlay ${visible ? 'visible' : ''}`}>
                    <div className="space-skills-scroll">
                        <h1 className="space-title">✦ Skills & Achievements ✦</h1>

                        <div className="constellation-grid">
                            <div className="skill-constellation software">
                                <div className="constellation-icon">💻</div>
                                <h3>Software</h3>
                                <div className="skill-stars">
                                    <span>React JS</span>
                                    <span>Node.js</span>
                                    <span>MongoDB</span>
                                    <span>Firebase</span>
                                    <span>AWS S3</span>
                                </div>
                            </div>

                            <div className="skill-constellation projects">
                                <div className="constellation-icon">🚀</div>
                                <h3>Projects</h3>
                                <div className="skill-stars">
                                    <span>CarzMoto Billing</span>
                                    <span>Bizmagnets CRM</span>
                                    <span>WhatsApp Automation</span>
                                    <span>Nippon Paint</span>
                                </div>
                            </div>

                            <div className="skill-constellation mechanical">
                                <div className="constellation-icon">⚙️</div>
                                <h3>Mechanical</h3>
                                <div className="skill-stars">
                                    <span>Kaizen & Lean</span>
                                    <span>Production KPIs</span>
                                    <span>Vehicle Assembly</span>
                                </div>
                            </div>

                            <div className="skill-constellation football">
                                <div className="constellation-icon">⚽</div>
                                <h3>Football</h3>
                                <div className="skill-stars">
                                    <span>District-Level Player</span>
                                    <span>Team Coordination</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Scene 1: Name handled by HudText
    return null;
};

export default Overlay;
