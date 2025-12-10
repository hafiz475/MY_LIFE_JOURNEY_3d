import React from "react";
import "./Experience.scss";

export default function Experience() {
    const items = [
        {
            role: "Senior React Developer",
            company: "OneMagnify",
            period: "2023 — Present",
            desc: "Building enterprise dashboards, 3D experiences, performance UI, and internal tooling.",
        },
        {
            role: "Frontend Developer",
            company: "BizMagnets",
            period: "2021 — 2023",
            desc: "Built billing systems, automation tools, PDF workflows, and real-time UI.",
        },
    ];

    return (
        <section className="experience">
            {items.map((item, i) => (
                <div className="exp-item" key={i}>
                    <div className="exp-avatar"></div>

                    <div className="exp-content">
                        <div className="exp-role">{item.role}</div>
                        <div className="exp-company">{item.company}</div>
                        <div className="exp-period">{item.period}</div>
                        <div className="exp-desc">{item.desc}</div>
                    </div>
                </div>
            ))}
        </section>
    );
}
