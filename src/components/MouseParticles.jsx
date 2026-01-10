import { useEffect, useRef } from 'react';

/**
 * Antigravity-style Particle Field Effect
 * Particles continuously pulse/wave outward from cursor like a jellyfish
 * Creates breathing/ripple effect with radially-oriented particles
 */
export default function MouseParticles() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Particle configuration
        const PARTICLE_COUNT = 350;
        const PARTICLE_COLOR = '#4a9eff'; // Soft blue like Antigravity
        const MOUSE_RADIUS = 200; // How far the pulse reaches
        const PULSE_SPEED = 0.04; // Speed of the pulsing wave
        const PULSE_STRENGTH = 80; // How far particles push out
        const WAVE_LAYERS = 3; // Multiple ripple waves

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Initialize particles in a grid-like pattern with randomness
        const initParticles = () => {
            particlesRef.current = [];
            const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (canvas.width / canvas.height)));
            const rows = Math.ceil(PARTICLE_COUNT / cols);
            const cellWidth = canvas.width / cols;
            const cellHeight = canvas.height / rows;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (particlesRef.current.length >= PARTICLE_COUNT) break;

                    // Base position with randomness
                    const baseX = j * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * cellWidth * 0.7;
                    const baseY = i * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * cellHeight * 0.7;

                    particlesRef.current.push({
                        baseX,
                        baseY,
                        x: baseX,
                        y: baseY,
                        size: Math.random() * 2 + 1.5,
                        baseRotation: Math.random() * Math.PI,
                        rotation: Math.random() * Math.PI,
                        alpha: Math.random() * 0.5 + 0.3,
                        phaseOffset: Math.random() * Math.PI * 2, // Random phase for organic feel
                    });
                }
            }
        };

        // Animation loop
        const animate = () => {
            timeRef.current += PULSE_SPEED;

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            particlesRef.current.forEach(particle => {
                // Calculate distance and angle from mouse
                const dx = particle.baseX - mouseX;
                const dy = particle.baseY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);

                // Calculate displacement based on pulsing wave
                let totalDisplacement = 0;

                if (distance < MOUSE_RADIUS && mouseX > 0) {
                    // Create multiple pulsing waves radiating outward
                    for (let wave = 0; wave < WAVE_LAYERS; wave++) {
                        // Each wave has different phase
                        const wavePhase = timeRef.current * 2 + wave * (Math.PI * 2 / WAVE_LAYERS);

                        // Wave pulse based on distance from cursor - creates ripple
                        const normalizedDist = distance / MOUSE_RADIUS;
                        const wavePosition = (Math.sin(wavePhase - normalizedDist * 4) + 1) / 2;

                        // Displacement is strongest close to cursor, fades at edge
                        const distanceFalloff = 1 - normalizedDist;
                        const waveStrength = wavePosition * distanceFalloff * (PULSE_STRENGTH / WAVE_LAYERS);

                        totalDisplacement += waveStrength;
                    }

                    // Add subtle breathing/pulsing to the void size
                    const breathe = Math.sin(timeRef.current * 1.5 + particle.phaseOffset * 0.3) * 10;
                    totalDisplacement += breathe * (1 - distance / MOUSE_RADIUS);
                }

                // Apply displacement in radial direction (away from cursor)
                particle.x = particle.baseX + Math.cos(angle) * totalDisplacement;
                particle.y = particle.baseY + Math.sin(angle) * totalDisplacement;

                // Rotate particles to point radially (away from cursor) when affected
                if (distance < MOUSE_RADIUS && mouseX > 0) {
                    // Smoothly interpolate rotation towards radial direction
                    const targetRotation = angle + Math.PI / 2;
                    const rotationSpeed = 0.15;
                    particle.rotation += (targetRotation - particle.rotation) * rotationSpeed;
                } else {
                    // Return to base rotation when not affected
                    particle.rotation += (particle.baseRotation - particle.rotation) * 0.02;
                }

                // Draw particle as a small dash/line
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.globalAlpha = particle.alpha;
                ctx.fillStyle = PARTICLE_COLOR;

                // Draw as a small elongated shape (dash-like)
                ctx.beginPath();
                ctx.ellipse(0, 0, particle.size * 2.2, particle.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        // Track mouse movement
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        // Initialize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
}
