import { useEffect, useRef, useState, useCallback } from 'react';
import './PinballGame.scss';

export default function PinballGame({ onClose }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const animationRef = useRef(null);

    // Game state stored in a ref for smooth performance and physics access
    const gameStateRef = useRef({
        ball: { x: 0, y: 0, vx: 0, vy: 0, radius: 10, history: [], active: false, color: '#ffffff', launched: false },
        leftPaddle: { x: 70, y: 0, angle: 0.2, targetAngle: 0.2, isPressed: false, width: 80, height: 16 },
        rightPaddle: { x: 0, y: 0, angle: -0.2, targetAngle: -0.2, isPressed: false, width: 80, height: 16 },
        plunger: { power: 0, isCharging: false },
        bumpers: [],
        slingshots: [],
        particles: [],
        popups: [],
        shake: 0,
        width: 400,
        height: 600,
        laneWidth: 50,
        margin: 20,
        maxSpeed: 16,
        friction: 0.994,
        gravity: 0.32
    });

    // Initialize game
    const initGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const state = gameStateRef.current;

        const { width, height, laneWidth, margin } = state;
        // Reset ball to plunger lane
        state.ball = {
            x: width - laneWidth / 2 - margin,
            y: height - 100,
            vx: 0,
            vy: 0,
            radius: 10,
            history: [],
            active: false,
            launched: false,
            color: '#ffffff'
        };

        // Paddle positions
        state.leftPaddle.y = height - 80;
        state.rightPaddle.x = width - state.laneWidth - margin - 70;
        state.rightPaddle.y = height - 80;

        // Create colorful bumpers
        const bumperColors = ['#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff8800'];
        state.bumpers = [
            { x: (width - state.laneWidth) * 0.25, y: height * 0.2, radius: 28, points: 100, flash: 0, color: bumperColors[0] },
            { x: (width - state.laneWidth) * 0.75, y: height * 0.2, radius: 28, points: 100, flash: 0, color: bumperColors[1] },
            { x: (width - state.laneWidth) * 0.5, y: height * 0.32, radius: 35, points: 200, flash: 0, color: bumperColors[2] },
            { x: (width - state.laneWidth) * 0.3, y: height * 0.45, radius: 25, points: 75, flash: 0, color: bumperColors[3] },
            { x: (width - state.laneWidth) * 0.7, y: height * 0.45, radius: 25, points: 75, flash: 0, color: bumperColors[4] },
        ];

        // Create slingshots
        state.slingshots = [
            { points: [{ x: 30, y: height - 250 }, { x: 80, y: height - 200 }, { x: 30, y: height - 150 }], flash: 0, color: '#ff00ff' },
            { points: [{ x: width - state.laneWidth - 30, y: height - 250 }, { x: width - state.laneWidth - 80, y: height - 200 }, { x: width - state.laneWidth - 30, y: height - 150 }], flash: 0, color: '#00ffff' }
        ];

        state.particles = [];
        state.popups = [];
        state.shake = 0;
        state.plunger.power = 0;
        state.plunger.isCharging = false;
    }, []);

    const createParticles = (x, y, color, count = 10) => {
        for (let i = 0; i < count; i++) {
            gameStateRef.current.particles.push({
                x, y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 1.0, color, size: Math.random() * 4 + 2
            });
        }
    };

    const createPopup = (x, y, text, color) => {
        gameStateRef.current.popups.push({ x, y, vy: -2, life: 1.0, text, color });
    };

    // Physics step
    const updatePhysics = (dt) => {
        const state = gameStateRef.current;
        const ball = state.ball;
        const { width, height, laneWidth, margin, friction, gravity, maxSpeed } = state;

        if (state.plunger.isCharging) {
            state.plunger.power = Math.min(state.plunger.power + 0.02, 1);
        }

        // Paddle animation
        state.leftPaddle.targetAngle = state.leftPaddle.isPressed ? -0.6 : 0.3;
        state.rightPaddle.targetAngle = state.rightPaddle.isPressed ? 0.6 : -0.3;
        state.leftPaddle.angle += (state.leftPaddle.targetAngle - state.leftPaddle.angle) * 0.35;
        state.rightPaddle.angle += (state.rightPaddle.targetAngle - state.rightPaddle.angle) * 0.35;

        if (ball.active) {
            ball.vy += gravity;
            ball.vx *= friction;
            ball.vy *= friction;
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Terminal velocity cap
            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            if (speed > maxSpeed) {
                ball.vx = (ball.vx / speed) * maxSpeed;
                ball.vy = (ball.vy / speed) * maxSpeed;
            }

            const margin = 20;
            const playAreaRight = width - laneWidth - margin;

            // --- Extended Barrel & Center Exit Logic ---
            const inLaunchTunnel = !ball.launched;

            if (inLaunchTunnel) {
                // Determine if ball has reached the center exit (top-center)
                if (ball.x < width / 2 && ball.y < 150) {
                    ball.launched = true;
                }

                if (ball.y >= 150) {
                    // Inside vertical lane - block by both left and right walls
                    if (ball.x < playAreaRight + ball.radius) {
                        ball.x = playAreaRight + ball.radius;
                        ball.vx = Math.abs(ball.vx) * 0.4;
                    }
                    if (ball.x > width - margin - ball.radius) {
                        ball.x = width - margin - ball.radius;
                        ball.vx = -Math.abs(ball.vx) * 0.4;
                    }
                } else {
                    // Inside curved tunnel (Top-Right quadrant)
                    const centerX = width / 2;
                    const centerY = 150;
                    const outerRadius = width / 2 - margin;
                    const innerRadius = width / 2 - laneWidth - margin;

                    const dx = ball.x - centerX;
                    const dy = ball.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Constrain between outer and inner rails
                    if (dist > outerRadius - ball.radius) {
                        const angle = Math.atan2(dy, dx);
                        ball.x = centerX + Math.cos(angle) * (outerRadius - ball.radius);
                        ball.y = centerY + Math.sin(angle) * (outerRadius - ball.radius);
                        const normalX = Math.cos(angle);
                        const normalY = Math.sin(angle);
                        const dot = ball.vx * normalX + ball.vy * normalY;
                        ball.vx = (ball.vx - 2 * dot * normalX) * 0.6;
                        ball.vy = (ball.vy - 2 * dot * normalY) * 0.6;
                    } else if (dist < innerRadius + ball.radius && ball.x > width / 2) {
                        // Inner rail blocks until we reach the center exit
                        const angle = Math.atan2(dy, dx);
                        ball.x = centerX + Math.cos(angle) * (innerRadius + ball.radius);
                        ball.y = centerY + Math.sin(angle) * (innerRadius + ball.radius);
                        const normalX = Math.cos(angle);
                        const normalY = Math.sin(angle);
                        const dot = ball.vx * normalX + ball.vy * normalY;
                        ball.vx = (ball.vx - 2 * dot * normalX) * 0.6;
                        ball.vy = (ball.vy - 2 * dot * normalY) * 0.6;
                    }

                    // Force horizontal movement through curve
                    if (ball.vx > -2 && ball.y < 120) ball.vx -= 0.5;
                }
            } else {
                // Ball in playfield - lane wall blocks re-entry
                if (ball.y >= 120 && ball.x + ball.radius > playAreaRight) {
                    ball.x = playAreaRight - ball.radius;
                    ball.vx = -Math.abs(ball.vx) * 0.4;
                }

                // Top curve inner rail blocks re-entry for launched ball
                if (ball.y < 150 && ball.x > width / 2) {
                    const centerX = width / 2;
                    const centerY = 150;
                    const innerRadius = width / 2 - laneWidth - margin;
                    const dx = ball.x - centerX;
                    const dy = ball.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < innerRadius + ball.radius) {
                        const angle = Math.atan2(dy, dx);
                        ball.x = centerX + Math.cos(angle) * (innerRadius + ball.radius);
                        ball.y = centerY + Math.sin(angle) * (innerRadius + ball.radius);
                        const normalX = Math.cos(angle);
                        const normalY = Math.sin(angle);
                        const dot = ball.vx * normalX + ball.vy * normalY;
                        ball.vx = (ball.vx - 2 * dot * normalX) * 0.6;
                        ball.vy = (ball.vy - 2 * dot * normalY) * 0.6;
                    }
                }
            }

            // Fail-safe: if ball is in lane but falls back down, reset it to plunger
            if (!ball.launched && ball.y > height - 80 && ball.vy > 0 && ball.x > playAreaRight) {
                ball.active = false;
                ball.vx = 0;
                ball.vy = 0;
                ball.y = height - 100;
                ball.x = width - laneWidth / 2;
                return; // Early exit, no life lost
            }

            // Margin collisions (Left, Top)
            if (ball.x < margin + ball.radius) {
                ball.x = margin + ball.radius;
                ball.vx = Math.abs(ball.vx) * 0.4;
            }
            if (ball.y < margin + ball.radius) {
                ball.y = margin + ball.radius;
                ball.vy = Math.abs(ball.vy) * 0.4;
            }

            // Top curve guidance - subtle "vacuum" effect
            if (ball.y < 180) {
                const centerX = width / 2;
                const centerY = 150;
                const outerRadius = width / 2 - margin;
                const dx = ball.x - centerX;
                const dy = ball.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > outerRadius) {
                    const angle = Math.atan2(dy, dx);
                    ball.x = centerX + Math.cos(angle) * (outerRadius - ball.radius);
                    ball.y = centerY + Math.sin(angle) * (outerRadius - ball.radius);
                    const normalX = Math.cos(angle);
                    const normalY = Math.sin(angle);
                    const dot = ball.vx * normalX + ball.vy * normalY;
                    ball.vx = (ball.vx - 2 * dot * normalX) * 0.65;
                    ball.vy = (ball.vy - 2 * dot * normalY) * 0.65;

                    // Nudge towards center if launching
                    if (!ball.launched || ball.vx > 0) {
                        ball.vx -= 0.15;
                    }
                }
            }

            // Bumper collisions
            state.bumpers.forEach(bumper => {
                const dx = ball.x - bumper.x;
                const dy = ball.y - bumper.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < ball.radius + bumper.radius) {
                    const angle = Math.atan2(dy, dx);
                    const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                    const reflectionSpeed = Math.min(Math.max(currentSpeed * 1.05, 10), maxSpeed);
                    ball.vx = Math.cos(angle) * reflectionSpeed;
                    ball.vy = Math.sin(angle) * reflectionSpeed;
                    ball.x = bumper.x + Math.cos(angle) * (ball.radius + bumper.radius + 1);
                    ball.y = bumper.y + Math.sin(angle) * (ball.radius + bumper.radius + 1);
                    bumper.flash = 20;
                    state.shake = 5;
                    ball.color = bumper.color;
                    setScore(s => s + bumper.points);
                    createParticles(ball.x, ball.y, bumper.color, 8);
                    createPopup(bumper.x, bumper.y - bumper.radius, `+${bumper.points}`, bumper.color);
                }
            });

            // Slingshot collisions
            state.slingshots.forEach(s => {
                const centerX = (s.points[0].x + s.points[1].x + s.points[2].x) / 3;
                const centerY = s.points[1].y;
                const dx = ball.x - centerX;
                const dy = ball.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 40) {
                    const angle = dx > 0 ? 0 : Math.PI;
                    ball.vx = Math.cos(angle) * 12;
                    ball.vy = -4;
                    s.flash = 12;
                    ball.color = s.color;
                    setScore(s => s + 50);
                    createParticles(ball.x, ball.y, s.color, 6);
                }
            });

            // Paddle collisions
            const checkPaddle = (paddle, isLeft) => {
                const dx = ball.x - paddle.x;
                const dy = ball.y - paddle.y;
                const cos = Math.cos(-paddle.angle);
                const sin = Math.sin(-paddle.angle);
                const rx = dx * cos - dy * sin;
                const ry = dx * sin + dy * cos;
                const minX = isLeft ? 0 : -paddle.width;
                const maxX = isLeft ? paddle.width : 0;

                if (ry > -paddle.height && ry < paddle.height && rx > minX - 12 && rx < maxX + 12) {
                    const kickPower = Math.abs(paddle.angle - paddle.targetAngle) * 40;
                    const nCos = Math.cos(paddle.angle);
                    const nSin = Math.sin(paddle.angle);
                    const bounceY = -Math.abs(ball.vy) - 4 - kickPower;
                    ball.vx = (-rx * nSin + bounceY * nCos) * 0.9;
                    ball.vy = (rx * nCos + bounceY * nSin) * 0.9;
                    ball.y = paddle.y - 18;
                    ball.color = '#ffffff';
                    if (kickPower > 2) {
                        state.shake = 3;
                        createParticles(ball.x, ball.y, '#ffffff', 4);
                    }
                    setScore(s => s + 10);
                }
            };
            checkPaddle(state.leftPaddle, true);
            checkPaddle(state.rightPaddle, false);
        } else {
            ball.y = height - 100 + state.plunger.power * 5;
        }

        // Trails/History
        ball.history.unshift({ x: ball.x, y: ball.y, color: ball.color });
        if (ball.history.length > 12) ball.history.pop();

        state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.04; });
        state.particles = state.particles.filter(p => p.life > 0);
        state.popups.forEach(p => { p.y += p.vy; p.life -= 0.02; });
        state.popups = state.popups.filter(p => p.life > 0);

        state.shake *= 0.9;
        state.bumpers.forEach(b => b.flash *= 0.85);
        state.slingshots.forEach(s => s.flash *= 0.85);
    };

    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const state = gameStateRef.current;
        const { width, height, laneWidth, margin } = state;

        for (let i = 0; i < 6; i++) updatePhysics(1 / 60 / 6);

        ctx.save();
        if (state.shake > 0.5) ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
        for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
        for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

        // --- DRAWING RAILS ---
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;

        // 1. Outer Frame (Playfield + Barrel Outer)
        ctx.beginPath();
        ctx.moveTo(width - margin, height);
        ctx.lineTo(width - margin, 150);
        ctx.arc(width / 2, 150, width / 2 - margin, 0, Math.PI, true);
        ctx.lineTo(margin, height);
        ctx.stroke();

        // 2. Extended Barrel Inner Wall
        ctx.beginPath();
        ctx.moveTo(width - laneWidth - margin, height);
        ctx.lineTo(width - laneWidth - margin, 150);
        // Barrel Curve (to center)
        ctx.arc(width / 2, 150, width / 2 - laneWidth - margin, 0, -Math.PI / 2, true);
        ctx.stroke();

        // 3. Playfield Upper Left Inner Rail
        ctx.beginPath();
        ctx.arc(width / 2, 150, width / 2 - laneWidth - margin, -Math.PI / 2, -Math.PI, true);
        ctx.stroke();

        // Plunger lane wall glow
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.beginPath(); ctx.moveTo(width - laneWidth - margin, 150); ctx.lineTo(width - laneWidth - margin, height); ctx.stroke();

        // Plunger
        const plungerX = width - laneWidth / 2 - margin;
        const plungerY = height - 40;
        const compress = state.plunger.power * 40;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(plungerX - 12, plungerY + compress, 24, 80);
        ctx.strokeStyle = '#444';
        for (let i = 0; i < 8; i++) {
            const sy = plungerY + compress + i * 10;
            ctx.beginPath(); ctx.moveTo(plungerX - 8, sy); ctx.lineTo(plungerX + 8, sy + 4); ctx.stroke();
        }

        // Trails
        state.ball.history.forEach((pos, i) => {
            const alpha = (1 - i / state.ball.history.length) * 0.35;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, state.ball.radius * (1 - i / 15), 0, Math.PI * 2);
            ctx.fillStyle = pos.color.length > 7 ? pos.color : `${pos.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            if (pos.color === '#ffffff') ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
        });

        // Bumpers
        state.bumpers.forEach(b => {
            const flash = b.flash / 20;
            const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
            grad.addColorStop(0, flash > 0.1 ? '#ffffff' : b.color);
            grad.addColorStop(1, '#000000');
            ctx.beginPath(); ctx.arc(b.x, b.y, b.radius + flash * 6, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = b.radius / 1.2 + flash * 25;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Slingshots
        state.slingshots.forEach(s => {
            ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y); ctx.lineTo(s.points[1].x, s.points[1].y); ctx.lineTo(s.points[2].x, s.points[2].y); ctx.closePath();
            ctx.shadowColor = s.color; ctx.shadowBlur = s.flash > 1 ? 15 : 4;
            ctx.fillStyle = s.flash > 1 ? '#ffffff' : 'rgba(0,0,0,0.6)';
            ctx.strokeStyle = s.color; ctx.lineWidth = 2;
            ctx.stroke(); ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Paddles
        const drawP = (p, c) => {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
            ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 12;
            const rx = p.x < (width - laneWidth) / 2 ? 0 : -p.width;
            ctx.fillRect(rx, -p.height / 2, p.width, p.height);
            ctx.restore();
        };
        drawP(state.leftPaddle, '#ff00ff');
        drawP(state.rightPaddle, '#00ffff');

        // Ball
        const ball = state.ball;
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        const bGrad = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 2, ball.x, ball.y, ball.radius);
        bGrad.addColorStop(0, '#ffffff'); bGrad.addColorStop(1, ball.color);
        ctx.fillStyle = bGrad; ctx.shadowColor = ball.color; ctx.shadowBlur = 15; ctx.fill();
        ctx.shadowBlur = 0;

        state.particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); });
        ctx.globalAlpha = 1;
        state.popups.forEach(p => { ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.font = 'bold 15px monospace'; ctx.fillText(p.text, p.x, p.y); });
        ctx.globalAlpha = 1;
        ctx.restore();

        // Power Meter
        if (state.plunger.isCharging) {
            const h = state.plunger.power * 80;
            const grad = ctx.createLinearGradient(0, height - 50, 0, height - 130);
            grad.addColorStop(0, '#00ff00'); grad.addColorStop(0.5, '#ffff00'); grad.addColorStop(1, '#ff0000');
            ctx.fillStyle = grad; ctx.fillRect(width - 35, height - 50, 20, -h);
            ctx.strokeStyle = '#fff'; ctx.strokeRect(width - 35, height - 130, 20, 80);
        }

        ctx.fillStyle = '#fff'; ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'left'; ctx.fillText(`SCORE: ${score}`, 30, 45);
        ctx.textAlign = 'right'; ctx.fillText(`LIVES: ${'❤️'.repeat(lives)}`, width - 30, 45);

        if (ball.y > height + 20) handleLifeLost();
        else if (!gameOver) animationRef.current = requestAnimationFrame(gameLoop);
    }, [score, lives, gameOver]);

    const handleLifeLost = () => {
        setLives(prev => {
            const next = prev - 1;
            if (next <= 0) { setGameOver(true); return 0; }
            initGame();
            animationRef.current = requestAnimationFrame(gameLoop);
            return next;
        });
    };

    useEffect(() => {
        if (!gameStarted || gameOver) return;
        const down = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') gameStateRef.current.leftPaddle.isPressed = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') gameStateRef.current.rightPaddle.isPressed = true;
            if (e.key === ' ' && !gameStateRef.current.ball.active) gameStateRef.current.plunger.isCharging = true;
        };
        const up = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') gameStateRef.current.leftPaddle.isPressed = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') gameStateRef.current.rightPaddle.isPressed = false;
            if (e.key === ' ' && gameStateRef.current.plunger.isCharging) {
                const s = gameStateRef.current;
                s.plunger.isCharging = false;
                if (!s.ball.active) {
                    // Increased launch velocity for guaranteed exit
                    const launchPower = s.plunger.power * 35 + 18;
                    s.ball.vx = -2; // Slight left push to help navigate curve
                    s.ball.vy = -launchPower;
                    s.ball.active = true;
                    s.ball.launched = false;
                    s.shake = 8;
                    s.ball.color = '#ffffff';
                    const { width, laneWidth, margin } = s;
                    s.ball.x = width - laneWidth / 2 - margin;
                    s.ball.y = s.height - 110; // Start slightly higher
                }
                s.plunger.power = 0;
            }
        };
        window.addEventListener('keydown', down); window.addEventListener('keyup', up);
        return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
    }, [gameStarted, gameOver]);

    useEffect(() => {
        if (gameStarted && !gameOver) { initGame(); animationRef.current = requestAnimationFrame(gameLoop); }
        return () => cancelAnimationFrame(animationRef.current);
    }, [gameStarted, gameOver, initGame, gameLoop]);

    return (
        <div className="pinball-game-container">
            <button className="close-button" onClick={onClose}>✕ EXIT</button>
            {!gameStarted ? (
                <div className="game-start-screen">
                    <div className="game-logo">🎮</div>
                    <h1 style={{ color: '#00ffff', textShadow: '0 0 20px #ff00ff' }}>SPACE PINBALL</h1>
                    <p>Hold SPACE to launch!</p>
                    <div className="controls-info">
                        <p><strong>Controls:</strong></p>
                        <p>Left: ← or A | Right: → or D</p>
                        <p>Plunger: SPACE</p>
                    </div>
                    <button className="start-button" onClick={() => setGameStarted(true)}>▶ START MISSION</button>
                </div>
            ) : gameOver ? (
                <div className="game-over-screen">
                    <h1 style={{ color: '#ff00ff' }}>MISSION OVER</h1>
                    <p className="final-score">Final Score: {score}</p>
                    <button className="start-button" onClick={() => initGame() || setGameOver(false)}>↻ REBOOT</button>
                    <button className="exit-button" onClick={onClose}>EXIT</button>
                </div>
            ) : (
                <div className="canvas-wrapper">
                    <canvas ref={canvasRef} width={400} height={600} className="pinball-canvas" />
                </div>
            )}
        </div>
    );
}
