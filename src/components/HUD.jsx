// src/components/HUD.jsx
import React from 'react';
import { sections } from '../data/sections';

const ICONS = {
    hero: (
        <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden>
            <path d="M12 2c.7 0 1.4.2 2 .6 1.7 1 2.6 3 2 5-.4 1.3-1.5 2.6-3 3.4L12 16l-1-4.0C9.5 10.6 8.4 9.3 8 8c-.6-2 0-4 2-5C10.6 2.2 11.3 2 12 2z" />
        </svg>
    ),
    factory: (
        <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden>
            <path d="M3 13v6h18v-6l-6 2v-6l-4 2-4-2v6zM6 2v6l6-2 6 2V2H6z" />
        </svg>
    ),
    pivot: (
        <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden>
            <path d="M8 5v14l11-7L8 5zM4 6v12H2V6h2z" />
        </svg>
    ),
    nippon: (
        <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden>
            <path d="M12 2l5 5-7 7-5-5L12 2zm-8 16v4h20v-4H4z" />
        </svg>
    ),
    bizmagnets: (
        <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden>
            <path d="M21 6h-2v9H7v2a1 1 0 0 1-1 1H3V6h18zM5 4h14a1 1 0 0 1 1 1v.5L12 11 4 5.5V5a1 1 0 0 1 1-1z" />
        </svg>
    ),
};

export default function HUD({ index, setIndex }) {
    return (
        <nav className="hud" aria-label="Section navigation">
            <div className="hud-left">
                <div className="hud-title">{sections[index].title}</div>
                <div className="hud-subtitle">{sections[index].subtitle}</div>
            </div>

            <div className="hud-right">
                <ul className="icon-list" role="tablist" aria-label="Sections">
                    {sections.map((s, i) => {
                        const isActive = i === index;
                        const iconEl = ICONS[s.key] || ICONS.hero;
                        return (
                            <li key={s.key} className={`icon-item ${isActive ? 'active' : ''}`}>
                                <button
                                    className="icon-btn"
                                    onClick={() => setIndex(i)}
                                    aria-pressed={isActive}
                                    aria-label={s.title}
                                    title={s.title}
                                    type="button"
                                >
                                    <span className="icon-wrap" aria-hidden>
                                        {iconEl}
                                        <span className="icon-ring" />
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
