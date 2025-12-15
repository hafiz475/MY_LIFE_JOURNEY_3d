// src/data/lifeStory.js
import football from "../assets/lotties/football.json";
import factory from "../assets/lotties/factory.json";
import robot from "../assets/lotties/robot.json";
import reactLottie from "../assets/lotties/react.json";
import whatsapp from "../assets/lotties/whatsapp.json";
import heart from "../assets/lotties/heart.json";

/**
 * lifeStory - six story points (positions precomputed in SpiralRibbon)
 * Each item.icon is the imported JSON object (suitable for lottie-react's animationData)
 */
export const lifeStory = [
    {
        id: "intro",
        title: "My Life Story: From Screwing Bikes Together to Screwing Up Code",
        subtitle: "Born to Kick Balls, Ended Up Kicking Bugs",
        icon: football,
        position: [1.2, 0.25, -1.8],
        rotation: [0, 0.55, 0],
        text: `I’m J Md Hafizur Rahman, born 10 September 1997 in a part of India that smells like filter coffee and sea breeze.
Childhood dream? Footballer.
District-level player — basically the Messi of my small town, except nobody paid me and my jersey had more holes than cloth.
Life had other ideas, and football slowly turned into debugging.`
    },

    {
        id: "mech",
        title: "Mechanical Engineer",
        subtitle: "Royal Enfield — Kaizen, Torque & 2,000 Bullets a Day",
        icon: factory,
        position: [-1.4, 0.45, -1.2],
        rotation: [0, 1.72, 0],
        text: `Studied B.E. Mechanical Engineering specializing in Robotics & Mechatronics.
Joined Royal Enfield as Kaizen Coordinator & Vehicle Assembly Supervisor.
Daily job: manage 500 engineers, monitor KPIs, ensure 2,000 bullets roll out perfectly,
and shout “Torque it properly, macha!” at least 17 times per shift.`
    },

    {
        id: "i4",
        title: "Industry 4.0 Wakeup",
        subtitle: "When Robots Started Listening to the Internet",
        icon: robot,
        position: [-2.1, 0.75, 0.4],
        rotation: [0, 2.72, 0],
        text: `Factory shifted into robotics, IoT dashboards, remote-controlled systems.
My mechanical degree suddenly felt vintage.
One night mid-shift I watched robots being configured through an internet dashboard.
For the first time I thought:
"Damn… computers are taking over. Maybe I should too."`
    },

    {
        id: "pivot",
        title: "The Great Pivot",
        subtitle: "From Spanners to Semicolons",
        icon: reactLottie,
        position: [-0.6, 1.05, 2.0],
        rotation: [0, 4.05, 0],
        text: `Zero computer science background.
Got dragged into a React JS internship by my school friend Isswariya.
First month felt like punishment for skipping HTML in 10th standard.
Two months later — hired by Nippon Paint for their digital billing transformation project.
Small team. Big learning. Too much pani puri.`
    },

    {
        id: "biz",
        title: "WhatsApp Wizard — Bizmagnets",
        subtitle: "From Torque Specs to 3 AM Debugging",
        icon: whatsapp,
        position: [1.5, 1.3, 1.4],
        rotation: [0, 5.0, 0],
        text: `Two years at Bizmagnets building a complete WhatsApp Business CRM:
chatbots, ticketing, team inboxes, automation flows.
Tech: React JS, Node.js, Express, MongoDB.
From tightening bolts at 72 Nm to tightening bugs at 3 a.m. with Red Bull.`
    },

    {
        id: "care",
        title: "Why I Care",
        subtitle: "Systems Thinking with a Front-End Heart",
        icon: heart,
        position: [2.3, 1.6, -0.2],
        rotation: [0, 5.9, 0],
        text: `Mechanical engineering taught me discipline & process.
Coding taught me creativity & problem solving.
I like breaking things, understanding why they broke,
and rebuilding them clean and strong.`
    }
];
