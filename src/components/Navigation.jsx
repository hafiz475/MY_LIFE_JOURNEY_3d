import React from 'react';

const sectionLabels = ['Intro', 'Story', 'Skills'];

const Navigation = ({ section, onNavigate, isLanding }) => {
    // Don't show during landing animation
    if (isLanding) return null;

    const handleClick = (targetSection) => {
        // Only allow navigation if not currently animating
        if (!isLanding) {
            onNavigate(targetSection);
        }
    };

    // Determine theme based on current section
    const isSpaceSection = section === 2;

    return (
        <nav className={`section-nav ${isSpaceSection ? 'space-theme' : 'light-theme'}`}>
            {sectionLabels.map((label, index) => (
                <button
                    key={index}
                    className={`nav-dot ${section === index ? 'active' : ''}`}
                    onClick={() => handleClick(index)}
                    aria-label={`Go to ${label}`}
                    title={label}
                >
                    <span className="nav-dot-inner" />
                    <span className="nav-label">{label}</span>
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
