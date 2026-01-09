import { useEffect, useRef } from 'react';

// Simple Simplex Noise implementation for organic movement
class SimplexNoise {
    constructor() {
        this.p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) this.p[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
        }
        this.perm = new Uint8Array(512);
        for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
    }

    noise2D(x, y) {
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;

        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;

        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;

        const i1 = x0 > y0 ? 1 : 0;
        const j1 = x0 > y0 ? 0 : 1;

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;

        const ii = i & 255;
        const jj = j & 255;

        const grad = (hash, x, y) => {
            const h = hash & 7;
            const u = h < 4 ? x : y;
            const v = h < 4 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
        };

        let n0 = 0, n1 = 0, n2 = 0;

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            n0 = t0 * t0 * grad(this.perm[ii + this.perm[jj]], x0, y0);
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            n1 = t1 * t1 * grad(this.perm[ii + i1 + this.perm[jj + j1]], x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            n2 = t2 * t2 * grad(this.perm[ii + 1 + this.perm[jj + 1]], x2, y2);
        }

        return 70 * (n0 + n1 + n2);
    }
}

// Particle class with noise-based organic movement
class Particle {
    constructor(canvas, noise) {
        this.canvas = canvas;
        this.noise = noise;

        // Random position across screen
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Home position (where particle settles when not influenced)
        this.homeX = this.x;
        this.homeY = this.y;

        // Velocity
        this.vx = 0;
        this.vy = 0;

        // Unique noise offset for each particle
        this.noiseOffsetX = Math.random() * 1000;
        this.noiseOffsetY = Math.random() * 1000;

        // Visual properties - small dashes
        this.length = 4 + Math.random() * 6;
        this.width = 1.5;
        this.alpha = 0.5 + Math.random() * 0.5;
        this.rotation = Math.random() * Math.PI * 2;

        // Influence radius - how far from mouse the particle gets affected
        this.influenceStrength = 0.5 + Math.random() * 0.5;
    }

    update(mouseX, mouseY, time, isMouseInCanvas) {
        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Noise-based flow field movement (always active - creates the organic drift)
        const noiseScale = 0.002;
        const noiseTime = time * 0.0003;

        const noiseX = this.noise.noise2D(
            this.x * noiseScale + this.noiseOffsetX + noiseTime,
            this.y * noiseScale + noiseTime
        );
        const noiseY = this.noise.noise2D(
            this.x * noiseScale + noiseTime,
            this.y * noiseScale + this.noiseOffsetY + noiseTime
        );

        // Flow field force (creates the organic jelly-like drift)
        const flowForce = 0.15;
        this.vx += noiseX * flowForce;
        this.vy += noiseY * flowForce;

        // Mouse attraction/influence
        if (isMouseInCanvas && distance < 400) {
            const influence = (1 - distance / 400) * this.influenceStrength;

            // Attract toward mouse
            this.vx += (dx / distance) * influence * 0.8;
            this.vy += (dy / distance) * influence * 0.8;

            // Add swirl effect around mouse
            const swirlStrength = 0.3 * influence;
            this.vx += (-dy / distance) * swirlStrength;
            this.vy += (dx / distance) * swirlStrength;
        }

        // Gentle pull back toward home position (prevents particles from escaping)
        const homeForce = 0.002;
        this.vx += (this.homeX - this.x) * homeForce;
        this.vy += (this.homeY - this.y) * homeForce;

        // Apply friction
        this.vx *= 0.96;
        this.vy *= 0.96;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < -50) this.x = this.canvas.width + 50;
        if (this.x > this.canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = this.canvas.height + 50;
        if (this.y > this.canvas.height + 50) this.y = -50;

        // Rotate dash to point in direction of movement
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.3) {
            const targetRotation = Math.atan2(this.vy, this.vx);
            // Smooth rotation interpolation
            let diff = targetRotation - this.rotation;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            this.rotation += diff * 0.15;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw dash with rounded ends
        ctx.beginPath();
        ctx.moveTo(-this.length / 2, 0);
        ctx.lineTo(this.length / 2, 0);
        ctx.strokeStyle = `rgba(70, 150, 255, ${this.alpha})`;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = 'rgba(70, 150, 255, 0.6)';
        ctx.shadowBlur = 6;
        ctx.stroke();

        ctx.restore();
    }
}

export default function ParticleEffect() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const noiseRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, inCanvas: false });
    const animationRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        noiseRef.current = new SimplexNoise();

        const particleCount = 150;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Reinitialize particles on resize
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(new Particle(canvas, noiseRef.current));
            }

            // Initialize mouse to center
            mouseRef.current = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                inCanvas: true
            };
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse tracking
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
            mouseRef.current.inCanvas = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.inCanvas = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        // Touch support
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                mouseRef.current.x = e.touches[0].clientX;
                mouseRef.current.y = e.touches[0].clientY;
                mouseRef.current.inCanvas = true;
            }
        };
        window.addEventListener('touchmove', handleTouchMove);

        // Animation loop
        const animate = () => {
            timeRef.current += 16; // ~60fps

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw all particles
            particlesRef.current.forEach(particle => {
                particle.update(
                    mouseRef.current.x,
                    mouseRef.current.y,
                    timeRef.current,
                    mouseRef.current.inCanvas
                );
                particle.draw(ctx);
            });

            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchmove', handleTouchMove);
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
                zIndex: 1
            }}
        />
    );
}
