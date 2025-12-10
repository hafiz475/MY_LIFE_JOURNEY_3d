// src/data/lifeStory.js
import footballAnim from "../lotties/football.json";
import factoryAnim from "../lotties/factory.json";
import robotAnim from "../lotties/robot.json";
import reactAnim from "../lotties/react.json";
import whatsappAnim from "../lotties/whatsapp.json";
import heartAnim from "../lotties/heart.json";

/**
 * lifeStory array:
 * - key: unique id
 * - title, subtitle, body: text shown as 3D text
 * - position: [x,y,z]  -> tweak these if nodes overlap
 * - icon: Lottie animation JSON import
 *
 * If you don't have the Lottie files yet, remove the `icon` property from each object.
 */
export const lifeStory = [
    {
        key: "intro",
        title: "My Life Story",
        subtitle: "From Screwing Bikes Together to Screwing Up Code",
        body:
            "I’m J Md Hafizur Rahman — born 10 Sep 1997. Grew up where filter coffee meets sea breeze. Childhood dream: footballer. District-level striker with a patched jersey and big dreams.",
        position: [-2.6, 1.6, -2.6],
        icon: footballAnim,
    },
    {
        key: "mechanical",
        title: "Mechanical Engineer",
        subtitle: "Royal Enfield — Kaizen & assembly",
        body:
            "B.E. in Mechanical Engineering (Robotics & Mechatronics). Joined Royal Enfield as Kaizen Coordinator / Supervisor, working on assembly KPIs and process improvements.",
        position: [-0.8, 0.9, -2.1],
        icon: factoryAnim,
    },
    {
        key: "industry4",
        title: "Industry 4.0 Wakeup",
        subtitle: "Robots, connectivity, and a pivot",
        body:
            "Robots and automation showed me the digital future. During a night shift I decided to switch to software — computers, not safety shoes.",
        position: [1.0, 0.6, -1.9],
        icon: robotAnim,
    },
    {
        key: "pivot",
        title: "The Great Pivot",
        subtitle: "From spanners to semicolons",
        body:
            "A friend pulled me into a React internship. I learned HTML/CSS the hard way, then joined Nippon Paint to move billing from paper to tablets.",
        position: [2.6, 0.5, -2.3],
        icon: reactAnim,
    },
    {
        key: "bizmagnets",
        title: "WhatsApp Wizard",
        subtitle: "Building a CRM at Bizmagnets",
        body:
            "Now at Bizmagnets building WhatsApp Business CRM: chatbots, ticketing, automation. Stack: React (frontend), Node.js/Express + MongoDB (backend).",
        position: [1.6, -0.8, -2.8],
        icon: whatsappAnim,
    },
    {
        key: "why",
        title: "Why I Care",
        subtitle: "Systems thinking + front-end craft",
        body:
            "I combine manufacturing discipline with front-end craft — break things, find root cause, and ship reliable UX. Also available for football banter over coffee.",
        position: [-1.4, -1.0, -2.9],
        icon: heartAnim,
    },
];
