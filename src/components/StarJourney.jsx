import React, { useMemo } from 'react';
import '../styles/star-journey.scss';
import SpaceCube from './SpaceCube/SpaceCube';

// Generate sparse, slow-moving stars
const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
        delay: Math.random() * 5
    }));
};

export default function StarJourney({ onBack }) {
    // Sparse star field - only ~90 stars total (30% of original 300)
    const stars = useMemo(() => generateStars(90), []);

    return (
        <div className="star-journey-wrapper">
            {/* Back Button */}
            <button className="back-button" onClick={onBack}>
                <span className="back-icon">🚀</span>
                <span>Back to Sky</span>
            </button>

            {/* Sparse Star Field - slowly drifting */}
            <div className="star-field">
                {stars.map(star => (
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

            {/* 3D Space Cube Navigation */}
            <SpaceCube />
        </div>
    );
}

