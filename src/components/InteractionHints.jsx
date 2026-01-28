import React, { useEffect, useState } from 'react';
import './InteractionHints.scss';

export default function InteractionHints({ visible }) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            setIsExiting(false);

            const timer = setTimeout(() => {
                setIsExiting(true);
                // Wait for fade-out animation before unmounting
                const unmountTimer = setTimeout(() => {
                    setShouldRender(false);
                }, 1000);
                return () => clearTimeout(unmountTimer);
            }, 6000); // Increased to 6 seconds

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!shouldRender) return null;

    return (
        <div className={`interaction-hints-wrapper ${isExiting ? 'exit' : ''}`}>
            {/* Cloud Hint - Kept at the top */}
            <div className="hint-cloud">
                <div className="hint-item">
                    <div className="hint-icon">
                        <svg fill="#ecf0f1" width="48px" height="48px" viewBox="-4 0 16 16" id="thunderbolt-16px" xmlns="http://www.w3.org/2000/svg">
                            <path id="Path_25" data-name="Path 25" d="M-8,1l-2,5h3l-5,9,1-7h-2l1-7h4m1,5h.005M-8,0h-4a1,1,0,0,0-.99.859l-1,7a1,1,0,0,0,.235.8A1,1,0,0,0-13,9h.847l-.837,5.859a1,1,0,0,0,.671,1.089A1.01,1.01,0,0,0-12,16a1,1,0,0,0,.874-.514l4.972-8.951A.987.987,0,0,0-6,6a1,1,0,0,0-1-1H-8.523l1.451-3.629a1,1,0,0,0-.1-.932A1,1,0,0,0-8,0Zm0,2h0Z" transform="translate(14)"></path>
                        </svg>
                    </div>
                    <div className="hint-text">Click cloud for lightning</div>
                </div>
            </div>

            {/* Plane Hint - Positioned near the plane */}
            <div className="hint-plane">
                <div className="hint-arrow">↓</div>
                <div className="hint-item">
                    <div className="hint-icon">
                        <svg width="48px" height="48px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="rotateIconTitle" stroke="#ecf0f1" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" fill="none">
                            <title id="rotateIconTitle">Rotate</title>
                            <path d="M22 12l-3 3-3-3"></path>
                            <path d="M2 12l3-3 3 3"></path>
                            <path d="M19.016 14v-1.95A7.05 7.05 0 0 0 8 6.22"></path>
                            <path d="M16.016 17.845A7.05 7.05 0 0 1 5 12.015V10"></path>
                            <path strokeLinecap="round" d="M5 10V9"></path>
                            <path strokeLinecap="round" d="M19 15v-1"></path>
                        </svg>
                    </div>
                    <div className="hint-text">Click plane for flip 360 degree</div>
                </div>
            </div>
        </div>
    );
}
