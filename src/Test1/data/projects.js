// src/data/projects.js
import firebaseLottie from "../assets/lotties/firebase.json";
import nodeLottie from "../assets/lotties/node.json";
import expressLottie from "../assets/lotties/express.json";
import mongoLottie from "../assets/lotties/mongodb.json";
import awsLottie from "../assets/lotties/aws.json";
import whatsappLottie from "../assets/lotties/whatsapp.json";
import reactLottie from "../assets/lotties/react.json";

export const projects = [
    {
        id: "carzmoto",
        title: "CarzMoto Billing & Service Platform",
        logo: `${import.meta.env.BASE_URL}assets/logos/carz moto.png`, // prefer rename to carzmoto.png (no spaces)
        lotties: [firebaseLottie, nodeLottie, expressLottie, mongoLottie, awsLottie, whatsappLottie],
        summary: `A full billing + product management + WhatsApp PDF delivery system for an auto accessories garage in Chennai.`,
        position: [3.5, 1.2, -2.0],
        rotation: [0, 1.2, 0]
    },
    {
        id: "bizmagnets",
        title: "Bizmagnets WhatsApp CRM",
        logo: `${import.meta.env.BASE_URL}assets/logos/bizmagnets.png`,
        lotties: [whatsappLottie, nodeLottie, mongoLottie],
        summary: `WhatsApp Business CRM: chatbots, automation, ticketing.`,
        position: [-3.2, 1.7, 1.5],
        rotation: [0, 3.4, 0]
    },
    {
        id: "nippon",
        title: "Nippon Paint Digital Billing",
        logo: `${import.meta.env.BASE_URL}assets/logos/nippon.png`,
        lotties: [reactLottie, nodeLottie],
        summary: `Tablet-based billing workflow migration for Nippon Paint.`,
        position: [1.0, 2.0, 3.3],
        rotation: [0, 4.9, 0]
    }
];
