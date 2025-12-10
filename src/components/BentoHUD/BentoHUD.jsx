// BentoHUD.jsx
import React from "react";
import "./BentoHUD.scss";
import { sections } from "../../data/sections"; // adjust path if needed

export default function BentoHUD({ index, setIndex }) {
    return (
        <nav className="bento-hud" aria-label="Site sections">
            <div className="bento-left">
                <div className="bento-title">{sections[index].title}</div>
                <div className="bento-sub">{sections[index].subtitle}</div>
            </div>

            <ul className="bento-list" role="tablist">
                {sections.map((s, i) => {
                    const active = i === index;
                    return (
                        <li key={s.key} className={`bento-item ${active ? "active" : ""}`}>
                            <button
                                className="bento-btn"
                                onClick={() => setIndex(i)}
                                aria-pressed={active}
                                aria-label={s.title}
                                type="button"
                            >
                                <svg viewBox="0 0 24 24" className="bento-icon" aria-hidden>
                                    {/* small dot icon - you can replace per-section */}
                                    <circle cx="12" cy="12" r="6" />
                                </svg>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
