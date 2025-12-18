import React, { useEffect, useState } from 'react';

const Overlay = ({ section }) => {
    const [showName, setShowName] = useState(false);

    useEffect(() => {
        // Show name after 3 seconds (intro starts, name joins the movement)
        const timer = setTimeout(() => {
            setShowName(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="overlay">
            <div className={`name-container ${showName ? 'visible' : ''}`}>
                <h1 className="name-text">J Md Hafizur Rahman</h1>
            </div>

            {/* section indicator logic can go here later */}
        </div>
    );
};

export default Overlay;
