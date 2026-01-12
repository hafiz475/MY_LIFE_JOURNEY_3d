import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import './RubiksCubeGame.scss';

// Single cubie component
function Cubie({ position, colors }) {
    const meshRef = useRef();
    const materials = colors.map(color =>
        new THREE.MeshStandardMaterial({
            color: color || '#1a1a1a',
            metalness: 0.1,
            roughness: 0.3
        })
    );

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            {materials.map((mat, i) => (
                <primitive key={i} attach={`material-${i}`} object={mat} />
            ))}
        </mesh>
    );
}

// Full Rubik's Cube
function RubiksCube({ cubeState, rotatingFace, rotationAngle }) {
    const groupRef = useRef();
    const faceGroupRef = useRef();

    // Generate positions for all 27 cubies
    const cubies = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                // Determine colors based on position
                const colors = [
                    x === 1 ? '#ff0000' : null,   // Right - Red
                    x === -1 ? '#ff8800' : null,  // Left - Orange
                    y === 1 ? '#ffffff' : null,   // Top - White
                    y === -1 ? '#ffff00' : null,  // Bottom - Yellow
                    z === 1 ? '#00ff00' : null,   // Front - Green
                    z === -1 ? '#0000ff' : null   // Back - Blue
                ];
                cubies.push({ position: [x, y, z], colors });
            }
        }
    }

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.x = 0.3;
            groupRef.current.rotation.y += 0.002;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={groupRef}>
                {cubies.map((cubie, i) => (
                    <Cubie key={i} position={cubie.position} colors={cubie.colors} />
                ))}
            </group>
        </Float>
    );
}

export default function RubiksCubeGame({ onClose }) {
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const timerRef = useRef(null);

    const startGame = useCallback(() => {
        setGameStarted(true);
        setIsPlaying(true);
        setMoves(0);
        setTimer(0);
        timerRef.current = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
    }, []);

    const stopGame = useCallback(() => {
        setIsPlaying(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRotation = (face) => {
        if (!isPlaying) return;
        setMoves(m => m + 1);
        // In a full implementation, this would trigger the cube rotation animation
    };

    return (
        <div className="rubiks-game-container">
            <button className="close-button" onClick={onClose}>✕ EXIT</button>

            {!gameStarted ? (
                <div className="game-start-screen">
                    <div className="game-logo">🧊</div>
                    <h1>RUBIK'S CUBE</h1>
                    <p>Solve the puzzle!</p>
                    <div className="controls-info">
                        <p>Drag to rotate view</p>
                        <p>Click faces to twist</p>
                    </div>
                    <button className="start-button" onClick={startGame}>▶ START</button>
                </div>
            ) : (
                <>
                    <div className="game-hud">
                        <div className="stat">
                            <span className="label">TIME</span>
                            <span className="value">{formatTime(timer)}</span>
                        </div>
                        <div className="stat">
                            <span className="label">MOVES</span>
                            <span className="value">{moves}</span>
                        </div>
                    </div>

                    <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
                        <RubiksCube />
                        <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>

                    <div className="controls-panel">
                        <div className="face-buttons">
                            {['R', 'L', 'U', 'D', 'F', 'B'].map(face => (
                                <button
                                    key={face}
                                    className="face-btn"
                                    onClick={() => handleRotation(face)}
                                >
                                    {face}
                                </button>
                            ))}
                        </div>
                        <button className="shuffle-btn" onClick={() => setMoves(0)}>
                            🔀 SHUFFLE
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
