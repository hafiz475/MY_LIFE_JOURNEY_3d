// src/data/techStack.js
import javascript from "../../assets/lotties/javascript.json";
import typescript from "../../assets/lotties/typescript.json";
import reactLottie from "../../assets/lotties/react.json";

import node from "../../assets/lotties/node.json";
import express from "../../assets/lotties/express.json";
import mongodb from "../../assets/lotties/mongodb.json";
import firebase from "../../assets/lotties/firebase.json";

import aws from "../../assets/lotties/aws.json";
import cloudflare from "../../assets/lotties/cloudflare.json";
import digitalocean from "../../assets/lotties/digitalocean.json";

export const techStack = [
    { id: "javascript", name: "JavaScript", icon: `${import.meta.env.BASE_URL}assets/logos/javascript.svg`, lottie: javascript, color: "#f7df1e", orbit: { radius: 1.8, speed: 1.2, height: 0.3 } },
    { id: "typescript", name: "TypeScript", icon: `${import.meta.env.BASE_URL}assets/logos/typescript.svg`, lottie: typescript, color: "#3178c6", orbit: { radius: 1.8, speed: 1.1, height: 0.35 } },
    { id: "react", name: "React", icon: `${import.meta.env.BASE_URL}assets/logos/react.svg`, lottie: reactLottie, color: "#61dafb", orbit: { radius: 1.8, speed: 1.25, height: 0.25 } },

    { id: "node", name: "Node.js", icon: `${import.meta.env.BASE_URL}assets/logos/node.svg`, lottie: node, color: "#88cc66", orbit: { radius: 2.4, speed: 0.8, height: 0.6 } },
    { id: "express", name: "Express", icon: `${import.meta.env.BASE_URL}assets/logos/express.svg`, lottie: express, color: "#6b7280", orbit: { radius: 2.4, speed: 0.75, height: 0.55 } },
    { id: "mongodb", name: "MongoDB", icon: `${import.meta.env.BASE_URL}assets/logos/mongo.svg`, lottie: mongodb, color: "#4db33d", orbit: { radius: 2.4, speed: 0.82, height: 0.65 } },
    { id: "firebase", name: "Firebase", icon: `${import.meta.env.BASE_URL}assets/logos/firebase.svg`, lottie: firebase, color: "#ffcb2b", orbit: { radius: 2.4, speed: 0.78, height: 0.7 } },

    { id: "aws", name: "AWS / S3", icon: `${import.meta.env.BASE_URL}assets/logos/aws.svg`, lottie: aws, color: "#ff9900", orbit: { radius: 3.2, speed: 0.4, height: 1.0 } },
    { id: "cloudflare", name: "Cloudflare", icon: `${import.meta.env.BASE_URL}assets/logos/cloudflare.svg`, lottie: cloudflare, color: "#f38020", orbit: { radius: 3.2, speed: 0.45, height: 1.1 } },
    { id: "digitalocean", name: "DigitalOcean", icon: `${import.meta.env.BASE_URL}assets/logos/digitalocean.svg`, lottie: digitalocean, color: "#0083ff", orbit: { radius: 3.2, speed: 0.38, height: 1.2 } }
];
