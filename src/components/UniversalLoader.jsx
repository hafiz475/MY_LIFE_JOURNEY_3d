import React from 'react';
import { useProgress, Html } from '@react-three/drei';
import './UniversalLoader.scss';

export default function UniversalLoader({ text, isCanvas = false, mode = "page", color }) {
    const { progress } = useProgress();

    // Mapping for colors if not provided but mode is section
    // In section mode, we often want to inherit from the parent's CSS variables,
    // but we can also pass a color explicitly.
    const style = {};
    if (color) {
        style['--loader-color'] = color;
        // Generate a subtle glow based on the color if possible, 
        // or just use the color itself with opacity.
        style['--loader-glow'] = `${color}66`; // Adding 66 for ~40% opacity
    }

    const content = (
        <div className={`universal-loader-container mode-${mode}`} style={style}>
            <div className="loader-content">
                <div className="loader-orbit">
                    <div className="loader-planet"></div>
                </div>
                <div className="loader-text-wrapper">
                    <p className="loader-text">
                        {text || "Initializing..."}
                    </p>
                    <div className="progress-percentage">
                        {Math.round(progress)}%
                    </div>
                </div>
                <div className="loading-bar-container">
                    <div
                        className="loading-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );

    if (isCanvas) {
        return <Html fullscreen>{content}</Html>;
    }

    return content;
}
