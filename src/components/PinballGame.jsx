import { useEffect, useRef, useState, useCallback } from 'react';
import './PinballGame.scss';

export default function PinballGame({ onClose }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const animationRef = useRef(null);
    const gameStateRef = useRef({
        ball: { x: 0, y: 0, vx: 0, vy: 0, radius: 10 },
        leftPaddle: { angle: 0, isPressed: false },
        rightPaddle: { angle: 0, isPressed: false },
        bumpers: [],
        obstacles: []
    });

    // Initialize game
    const initGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;

        // Reset ball
        gameStateRef.current.ball = {
            x: width / 2,
            y: height - 150,
            vx: (Math.random() - 0.5) * 4,
            vy: -8,
            radius: 12
        };

        // Create bumpers
        gameStateRef.current.bumpers = [
            { x: width * 0.25, y: height * 0.25, radius: 30, points: 100 },
            { x: width * 0.75, y: height * 0.25, radius: 30, points: 100 },
            { x: width * 0.5, y: height * 0.35, radius: 35, points: 150 },
            { x: width * 0.3, y: height * 0.45, radius: 25, points: 75 },
            { x: width * 0.7, y: height * 0.45, radius: 25, points: 75 },
        ];

        // Create obstacles (triangles represented as circles for simplicity)
        gameStateRef.current.obstacles = [
            { x: 50, y: height - 200, radius: 20 },
            { x: width - 50, y: height - 200, radius: 20 },
        ];
    }, []);

    // Game loop
    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const state = gameStateRef.current;
        const ball = state.ball;

        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Draw border glow
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        ctx.shadowBlur = 0;

        // Apply gravity
        ball.vy += 0.25;

        // Apply friction
        ball.vx *= 0.995;

        // Update ball position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.x - ball.radius < 20) {
            ball.x = 20 + ball.radius;
            ball.vx = Math.abs(ball.vx) * 0.8;
        }
        if (ball.x + ball.radius > width - 20) {
            ball.x = width - 20 - ball.radius;
            ball.vx = -Math.abs(ball.vx) * 0.8;
        }
        if (ball.y - ball.radius < 20) {
            ball.y = 20 + ball.radius;
            ball.vy = Math.abs(ball.vy) * 0.8;
        }

        // Check ball out (lose life)
        if (ball.y > height + 50) {
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameOver(true);
                    return 0;
                }
                // Reset ball
                ball.x = width / 2;
                ball.y = height - 150;
                ball.vx = (Math.random() - 0.5) * 4;
                ball.vy = -8;
                return newLives;
            });
        }

        // Draw and check bumper collisions
        state.bumpers.forEach((bumper, i) => {
            const dx = ball.x - bumper.x;
            const dy = ball.y - bumper.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ball.radius + bumper.radius) {
                // Collision detected
                const angle = Math.atan2(dy, dx);
                ball.vx = Math.cos(angle) * 10;
                ball.vy = Math.sin(angle) * 10;
                setScore(prev => prev + bumper.points);

                // Flash effect
                bumper.flash = 10;
            }

            // Draw bumper
            const gradient = ctx.createRadialGradient(
                bumper.x, bumper.y, 0,
                bumper.x, bumper.y, bumper.radius
            );

            if (bumper.flash > 0) {
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(1, '#ef4444');
                bumper.flash--;
            } else {
                gradient.addColorStop(0, '#ef4444');
                gradient.addColorStop(1, '#7f1d1d');
            }

            ctx.beginPath();
            ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = bumper.flash > 0 ? 30 : 15;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw paddles
        const paddleY = height - 80;
        const paddleWidth = 80;
        const paddleHeight = 15;

        // Left paddle
        ctx.save();
        ctx.translate(70, paddleY);
        ctx.rotate(state.leftPaddle.isPressed ? -0.4 : 0.2);
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillRect(0, -paddleHeight / 2, paddleWidth, paddleHeight);
        ctx.restore();

        // Right paddle
        ctx.save();
        ctx.translate(width - 70, paddleY);
        ctx.rotate(state.rightPaddle.isPressed ? 0.4 : -0.2);
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillRect(-paddleWidth, -paddleHeight / 2, paddleWidth, paddleHeight);
        ctx.restore();
        ctx.shadowBlur = 0;

        // Paddle collision detection (simplified)
        if (ball.y > paddleY - 20 && ball.y < paddleY + 20) {
            // Left paddle
            if (ball.x > 50 && ball.x < 150 && state.leftPaddle.isPressed) {
                ball.vy = -Math.abs(ball.vy) * 1.1;
                ball.vx -= 3;
                setScore(prev => prev + 10);
            }
            // Right paddle
            if (ball.x > width - 150 && ball.x < width - 50 && state.rightPaddle.isPressed) {
                ball.vy = -Math.abs(ball.vy) * 1.1;
                ball.vx += 3;
                setScore(prev => prev + 10);
            }
        }

        // Draw ball
        const ballGradient = ctx.createRadialGradient(
            ball.x - 3, ball.y - 3, 0,
            ball.x, ball.y, ball.radius
        );
        ballGradient.addColorStop(0, '#ffffff');
        ballGradient.addColorStop(0.5, '#fca5a5');
        ballGradient.addColorStop(1, '#ef4444');

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ballGradient;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw score
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${score}`, 30, 50);

        ctx.textAlign = 'right';
        ctx.fillText(`LIVES: ${'❤️'.repeat(lives)}`, width - 30, 50);

        if (!gameOver) {
            animationRef.current = requestAnimationFrame(gameLoop);
        }
    }, [score, lives, gameOver]);

    // Handle keyboard input
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                gameStateRef.current.leftPaddle.isPressed = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                gameStateRef.current.rightPaddle.isPressed = true;
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                gameStateRef.current.leftPaddle.isPressed = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                gameStateRef.current.rightPaddle.isPressed = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameStarted, gameOver]);

    // Start game loop
    useEffect(() => {
        if (gameStarted && !gameOver) {
            initGame();
            animationRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameStarted, gameOver, initGame, gameLoop]);

    const startGame = () => {
        setScore(0);
        setLives(3);
        setGameOver(false);
        setGameStarted(true);
    };

    const restartGame = () => {
        setScore(0);
        setLives(3);
        setGameOver(false);
        initGame();
        animationRef.current = requestAnimationFrame(gameLoop);
    };

    return (
        <div className="pinball-game-container">
            <button className="close-button" onClick={onClose}>
                ✕ EXIT
            </button>

            {!gameStarted ? (
                <div className="game-start-screen">
                    <div className="game-logo">🎮</div>
                    <h1>PINBALL</h1>
                    <p>Classic Arcade Experience</p>
                    <div className="controls-info">
                        <p><strong>Controls:</strong></p>
                        <p>← or A = Left Paddle</p>
                        <p>→ or D = Right Paddle</p>
                    </div>
                    <button className="start-button" onClick={startGame}>
                        ▶ START GAME
                    </button>
                </div>
            ) : gameOver ? (
                <div className="game-over-screen">
                    <h1>GAME OVER</h1>
                    <p className="final-score">Final Score: {score}</p>
                    <button className="start-button" onClick={restartGame}>
                        ↻ PLAY AGAIN
                    </button>
                    <button className="exit-button" onClick={onClose}>
                        EXIT TO MENU
                    </button>
                </div>
            ) : (
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={600}
                    className="pinball-canvas"
                />
            )}
        </div>
    );
}
