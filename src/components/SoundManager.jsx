import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const SoundManager = forwardRef(({ isRaining, showBirds, section }, ref) => {
    // Refs for Audio objects (initialized lazily)
    const engineAudio = useRef(null);
    const rainAudio = useRef(null);
    const thunderAudio = useRef(null);
    const birdsAudio = useRef(null);

    const hasInteracted = useRef(false);

    // Initialize Audio Objects Logic
    useEffect(() => {
        engineAudio.current = new Audio(`${import.meta.env.BASE_URL}assets/sounds/plane_engine.mp3`);
        rainAudio.current = new Audio(`${import.meta.env.BASE_URL}assets/sounds/rain.mp3`);
        thunderAudio.current = new Audio(`${import.meta.env.BASE_URL}assets/sounds/thunder.mp3`);
        birdsAudio.current = new Audio(`${import.meta.env.BASE_URL}assets/sounds/birds.mp3`);

        // --- Setup Properties ---

        // Plane Engine: Loop, Volume 0.4
        engineAudio.current.loop = true;
        engineAudio.current.volume = 0.4;

        // Rain: Loop, Volume 0.6
        rainAudio.current.loop = true;
        rainAudio.current.volume = 0.6;

        // Birds: NO LOOP (We handle manually for natural effect), Volume 0.5
        birdsAudio.current.loop = false;
        birdsAudio.current.volume = 0.5;

        // Thunder: One-shot, Volume 1.0
        thunderAudio.current.volume = 1.0;

        // Attempt to play engine immediately
        const playEngine = () => {
            if (engineAudio.current) {
                engineAudio.current.play().catch(e => {
                    console.log("Autoplay blocked, waiting for interaction...");
                });
            }
        };
        playEngine();

        // Interaction Listener (Unlock Audio)
        const handleInteraction = () => {
            if (hasInteracted.current) return;
            hasInteracted.current = true;

            // Ensure engine is playing
            if (engineAudio.current && engineAudio.current.paused) {
                engineAudio.current.play().catch(e => console.error("Engine play failed:", e));
            }

            // Resume contextual sounds if needed
            if (isRaining && rainAudio.current && rainAudio.current.paused) {
                rainAudio.current.play().catch(() => { });
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            // Cleanup
            if (engineAudio.current) engineAudio.current.pause();
            if (rainAudio.current) rainAudio.current.pause();
            if (birdsAudio.current) birdsAudio.current.pause();
        };
    }, []);

    // Manage Rain
    useEffect(() => {
        if (!rainAudio.current) return;

        if (isRaining) {
            rainAudio.current.play().catch(() => { });
        } else {
            rainAudio.current.pause();
            rainAudio.current.currentTime = 0;
        }
    }, [isRaining]);

    // Manage Birds (Natural Looping)
    useEffect(() => {
        if (!birdsAudio.current) return;

        let birdTimeout;

        const playRandomBird = () => {
            if (!showBirds || !birdsAudio.current) return;

            // Random pitch shift equivalent? (Not easily possible with vanilla Audio without WebAudio API context, 
            // but we can vary volume slightly for realism if desired, keeping it simple for now)

            birdsAudio.current.currentTime = 0;
            birdsAudio.current.play()
                .then(() => {
                    // When it ends, wait a random time before playing again
                    birdsAudio.current.onended = () => {
                        const delay = Math.random() * 2000 + 500; // 500ms to 2500ms delay
                        birdTimeout = setTimeout(playRandomBird, delay);
                    };
                })
                .catch(e => {
                    // If blocked/failed, retry shortly
                    birdTimeout = setTimeout(playRandomBird, 1000);
                });
        };

        if (showBirds) {
            playRandomBird();
        } else {
            clearTimeout(birdTimeout);
            if (birdsAudio.current) {
                birdsAudio.current.pause();
                birdsAudio.current.onended = null;
            }
        }

        return () => {
            clearTimeout(birdTimeout);
            if (birdsAudio.current) birdsAudio.current.onended = null;
        };
    }, [showBirds]);

    // Expose Thunder method to parent
    useImperativeHandle(ref, () => ({
        playThunder: () => {
            if (thunderAudio.current) {
                thunderAudio.current.currentTime = 0;
                thunderAudio.current.play().catch(e => console.error("Thunder failed:", e));
            }
        },
        fadeEngineOut: () => {
            // Placeholder: could implement gradual volume reduction here
        }
    }));

    return null;
});

export default SoundManager;
