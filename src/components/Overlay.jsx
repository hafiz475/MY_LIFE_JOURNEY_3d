import React, { useEffect, useState } from 'react';
import StarJourney from './StarJourney';

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

    // Scene 3: Star Journey - Immersive Life Story Experience
    if (section === 2) {
        return <StarJourney onBack={onBack} />;
    }

    // Scene 1: Name handled by HudText
    return null;
};

export default Overlay;

