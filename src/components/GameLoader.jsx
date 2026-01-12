import { useEffect, useState } from 'react';
import './GameLoader.scss';

const GAME_CONFIGS = {
    pinball: {
        emoji: '🎱',
        name: 'PINBALL',
        color: '#ff00ff',
        bgGradient: 'linear-gradient(135deg, #1a0a2a 0%, #0a0a1a 100%)'
    },
    flappy: {
        emoji: '🐦',
        name: 'FLAPPY NEON',
        color: '#ffcc00',
        bgGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)'
    },
    rubiks: {
        emoji: '🧊',
        name: "RUBIK'S CUBE",
        color: '#00ffff',
        bgGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 100%)'
    }
};

export default function GameLoader({ gameType, onComplete }) {
    const [progress, setProgress] = useState(0);
    const config = GAME_CONFIGS[gameType] || GAME_CONFIGS.pinball;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete?.(), 200);
                    return 100;
                }
                return p + 5;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="game-loader" style={{ background: config.bgGradient }}>
            <div className="loader-content">
                <div
                    className="game-emoji"
                    style={{
                        textShadow: `0 0 30px ${config.color}, 0 0 60px ${config.color}`
                    }}
                >
                    {config.emoji}
                </div>
                <h1 style={{ color: config.color }}>{config.name}</h1>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                            background: config.color,
                            boxShadow: `0 0 20px ${config.color}`
                        }}
                    />
                </div>
                <p className="loading-text">LOADING...</p>
            </div>
        </div>
    );
}
