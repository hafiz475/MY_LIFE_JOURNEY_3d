import React from "react";
import Lottie from "lottie-react";

export default function LottieFallback({ src, style = {}, loop = true }) {
    if (!src) return null;

    return (
        <Lottie
            animationData={src}
            loop={loop}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                ...style
            }}
        />
    );
}
