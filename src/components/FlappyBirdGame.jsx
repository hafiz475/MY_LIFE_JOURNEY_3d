import { useEffect, useRef, useState, useCallback } from 'react';
import './FlappyBirdGame.scss';

export default function FlappyBirdGame({ onClose }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const animationRef = useRef(null);

    const gameStateRef = useRef({
        bird: { x: 80, y: 200, vy: 0, radius: 15 },
        pipes: [],
        width: 400,
        height: 500,
        gravity: 0.5,
        flapPower: -9,
        pipeGap: 140,
        pipeWidth: 60,
        pipeSpeed: 3,
        frameCount: 0,
        lastPipeX: 400
    });

    const initGame = useCallback(() => {
        const state = gameStateRef.current;
        state.bird = { x: 80, y: 200, vy: 0, radius: 15 };
        state.pipes = [];
        state.frameCount = 0;
        state.lastPipeX = state.width;
        setScore(0);
    }, []);

    const flap = useCallback(() => {
        if (!gameStarted) {
            setGameStarted(true);
            initGame();
        }
        if (!gameOver) {
            gameStateRef.current.bird.vy = gameStateRef.current.flapPower;
        }
    }, [gameStarted, gameOver, initGame]);

    const spawnPipe = () => {
        const state = gameStateRef.current;
        const minGapY = 80;
        const maxGapY = state.height - state.pipeGap - 80;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        state.pipes.push({
            x: state.width,
            gapY: gapY,
            passed: false
        });
        state.lastPipeX = state.width;
    };

    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const state = gameStateRef.current;
        const { width, height, gravity, pipeGap, pipeWidth, pipeSpeed } = state;
        const bird = state.bird;

        state.frameCount++;

        // Spawn pipes
        if (state.pipes.length === 0 || state.lastPipeX < width - 200) {
            spawnPipe();
        }

        // Update bird
        bird.vy += gravity;
        bird.y += bird.vy;

        // Update pipes
        state.pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;
            if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
                pipe.passed = true;
                setScore(s => s + 1);
            }
        });
        state.pipes = state.pipes.filter(p => p.x > -pipeWidth);
        if (state.pipes.length > 0) {
            state.lastPipeX = state.pipes[state.pipes.length - 1].x;
        }

        // Collision detection
        let collision = false;
        if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
            collision = true;
        }
        state.pipes.forEach(pipe => {
            if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
                if (bird.y - bird.radius < pipe.gapY || bird.y + bird.radius > pipe.gapY + pipeGap) {
                    collision = true;
                }
            }
        });

        if (collision) {
            setGameOver(true);
            return;
        }

        // --- DRAWING ---
        // Background gradient (night sky)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0a0a1a');
        bgGrad.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 30; i++) {
            const sx = (i * 47 + state.frameCount * 0.1) % width;
            const sy = (i * 31) % height;
            ctx.fillRect(sx, sy, 1.5, 1.5);
        }

        // Pipes (neon style)
        state.pipes.forEach(pipe => {
            // Top pipe
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 15;
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
            ctx.fillRect(pipe.x - 5, pipe.gapY - 20, pipeWidth + 10, 20);

            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.gapY + pipeGap, pipeWidth, height - pipe.gapY - pipeGap);
            ctx.fillRect(pipe.x - 5, pipe.gapY + pipeGap, pipeWidth + 10, 20);
            ctx.shadowBlur = 0;
        });

        // Bird (neon circle with trail)
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bird eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(bird.x + 6, bird.y - 4, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(bird.x + bird.radius, bird.y);
        ctx.lineTo(bird.x + bird.radius + 10, bird.y + 3);
        ctx.lineTo(bird.x + bird.radius, bird.y + 6);
        ctx.closePath();
        ctx.fill();

        // Score
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(score, width / 2, 50);

        if (!gameOver) {
            animationRef.current = requestAnimationFrame(gameLoop);
        }
    }, [score, gameOver]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                flap();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [flap]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            animationRef.current = requestAnimationFrame(gameLoop);
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [gameStarted, gameOver, gameLoop]);

    const restartGame = () => {
        setGameOver(false);
        setGameStarted(true);
        initGame();
    };

    return (
        <div className="flappy-game-container">
            <button className="close-button" onClick={onClose}>✕ EXIT</button>
            {!gameStarted ? (
                <div className="game-start-screen">
                    <div className="game-logo">🐦</div>
                    <h1>FLAPPY NEON</h1>
                    <p>Tap SPACE to flap!</p>
                    <button className="start-button" onClick={flap}>▶ START</button>
                </div>
            ) : gameOver ? (
                <div className="game-over-screen">
                    <h1>GAME OVER</h1>
                    <p className="final-score">Score: {score}</p>
                    <button className="start-button" onClick={restartGame}>↻ RETRY</button>
                    <button className="exit-button" onClick={onClose}>EXIT</button>
                </div>
            ) : (
                <div className="canvas-wrapper" onClick={flap}>
                    <canvas ref={canvasRef} width={400} height={500} className="flappy-canvas" />
                </div>
            )}
        </div>
    );
}
