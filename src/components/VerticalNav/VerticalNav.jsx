import React from "react";
import "./VerticalNav.scss";
import { sections } from "../../data/sections";

export default function VerticalNav({ index, setIndex }) {
    return (
        <aside className="vertical-nav">
            {sections.map((s, i) => {
                const active = i === index;

                return (
                    <div
                        key={s.key}
                        className={`nav-item ${active ? "active" : ""}`}
                        onClick={() => setIndex(i)}
                    >
                        <span className="label">{s.title}</span>

                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <circle cx="12" cy="12" r="6" />
                        </svg>
                    </div>
                );
            })}
        </aside>
    );
}
