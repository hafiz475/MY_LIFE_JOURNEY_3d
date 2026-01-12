import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import './RubiksCubeGame.scss';

// Color constants
const COLORS = {
    R: '#ff0000',  // Right - Red
    L: '#ff8800',  // Left - Orange
    U: '#ffffff',  // Up - White
    D: '#ffff00',  // Down - Yellow
    F: '#00ff00',  // Front - Green
    B: '#0000ff'   // Back - Blue
};

// Initial solved cube state - 6 faces, each with 9 stickers
const createSolvedCube = () => ({
    R: Array(9).fill('R'),
    L: Array(9).fill('L'),
    U: Array(9).fill('U'),
    D: Array(9).fill('D'),
    F: Array(9).fill('F'),
    B: Array(9).fill('B')
});

// Rotate a face clockwise
const rotateFace = (face) => {
    return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
};

// Rotate a face counter-clockwise
const rotateFaceCCW = (face) => {
    return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
};

// Apply a move to the cube state
const applyMove = (cube, move) => {
    const newCube = JSON.parse(JSON.stringify(cube));
    const ccw = move.includes("'");
    const face = move.replace("'", "");

    // Rotate the face itself
    newCube[face] = ccw ? rotateFaceCCW(cube[face]) : rotateFace(cube[face]);

    // Rotate adjacent stickers
    const temp = [];
    switch (face) {
        case 'R':
            if (!ccw) {
                temp[0] = cube.F[2]; temp[1] = cube.F[5]; temp[2] = cube.F[8];
                newCube.F[2] = cube.D[2]; newCube.F[5] = cube.D[5]; newCube.F[8] = cube.D[8];
                newCube.D[2] = cube.B[6]; newCube.D[5] = cube.B[3]; newCube.D[8] = cube.B[0];
                newCube.B[6] = cube.U[2]; newCube.B[3] = cube.U[5]; newCube.B[0] = cube.U[8];
                newCube.U[2] = temp[0]; newCube.U[5] = temp[1]; newCube.U[8] = temp[2];
            } else {
                temp[0] = cube.F[2]; temp[1] = cube.F[5]; temp[2] = cube.F[8];
                newCube.F[2] = cube.U[2]; newCube.F[5] = cube.U[5]; newCube.F[8] = cube.U[8];
                newCube.U[2] = cube.B[6]; newCube.U[5] = cube.B[3]; newCube.U[8] = cube.B[0];
                newCube.B[6] = cube.D[2]; newCube.B[3] = cube.D[5]; newCube.B[0] = cube.D[8];
                newCube.D[2] = temp[0]; newCube.D[5] = temp[1]; newCube.D[8] = temp[2];
            }
            break;
        case 'L':
            if (!ccw) {
                temp[0] = cube.F[0]; temp[1] = cube.F[3]; temp[2] = cube.F[6];
                newCube.F[0] = cube.U[0]; newCube.F[3] = cube.U[3]; newCube.F[6] = cube.U[6];
                newCube.U[0] = cube.B[8]; newCube.U[3] = cube.B[5]; newCube.U[6] = cube.B[2];
                newCube.B[8] = cube.D[0]; newCube.B[5] = cube.D[3]; newCube.B[2] = cube.D[6];
                newCube.D[0] = temp[0]; newCube.D[3] = temp[1]; newCube.D[6] = temp[2];
            } else {
                temp[0] = cube.F[0]; temp[1] = cube.F[3]; temp[2] = cube.F[6];
                newCube.F[0] = cube.D[0]; newCube.F[3] = cube.D[3]; newCube.F[6] = cube.D[6];
                newCube.D[0] = cube.B[8]; newCube.D[3] = cube.B[5]; newCube.D[6] = cube.B[2];
                newCube.B[8] = cube.U[0]; newCube.B[5] = cube.U[3]; newCube.B[2] = cube.U[6];
                newCube.U[0] = temp[0]; newCube.U[3] = temp[1]; newCube.U[6] = temp[2];
            }
            break;
        case 'U':
            if (!ccw) {
                temp[0] = cube.F[0]; temp[1] = cube.F[1]; temp[2] = cube.F[2];
                newCube.F[0] = cube.R[0]; newCube.F[1] = cube.R[1]; newCube.F[2] = cube.R[2];
                newCube.R[0] = cube.B[0]; newCube.R[1] = cube.B[1]; newCube.R[2] = cube.B[2];
                newCube.B[0] = cube.L[0]; newCube.B[1] = cube.L[1]; newCube.B[2] = cube.L[2];
                newCube.L[0] = temp[0]; newCube.L[1] = temp[1]; newCube.L[2] = temp[2];
            } else {
                temp[0] = cube.F[0]; temp[1] = cube.F[1]; temp[2] = cube.F[2];
                newCube.F[0] = cube.L[0]; newCube.F[1] = cube.L[1]; newCube.F[2] = cube.L[2];
                newCube.L[0] = cube.B[0]; newCube.L[1] = cube.B[1]; newCube.L[2] = cube.B[2];
                newCube.B[0] = cube.R[0]; newCube.B[1] = cube.R[1]; newCube.B[2] = cube.R[2];
                newCube.R[0] = temp[0]; newCube.R[1] = temp[1]; newCube.R[2] = temp[2];
            }
            break;
        case 'D':
            if (!ccw) {
                temp[0] = cube.F[6]; temp[1] = cube.F[7]; temp[2] = cube.F[8];
                newCube.F[6] = cube.L[6]; newCube.F[7] = cube.L[7]; newCube.F[8] = cube.L[8];
                newCube.L[6] = cube.B[6]; newCube.L[7] = cube.B[7]; newCube.L[8] = cube.B[8];
                newCube.B[6] = cube.R[6]; newCube.B[7] = cube.R[7]; newCube.B[8] = cube.R[8];
                newCube.R[6] = temp[0]; newCube.R[7] = temp[1]; newCube.R[8] = temp[2];
            } else {
                temp[0] = cube.F[6]; temp[1] = cube.F[7]; temp[2] = cube.F[8];
                newCube.F[6] = cube.R[6]; newCube.F[7] = cube.R[7]; newCube.F[8] = cube.R[8];
                newCube.R[6] = cube.B[6]; newCube.R[7] = cube.B[7]; newCube.R[8] = cube.B[8];
                newCube.B[6] = cube.L[6]; newCube.B[7] = cube.L[7]; newCube.B[8] = cube.L[8];
                newCube.L[6] = temp[0]; newCube.L[7] = temp[1]; newCube.L[8] = temp[2];
            }
            break;
        case 'F':
            if (!ccw) {
                temp[0] = cube.U[6]; temp[1] = cube.U[7]; temp[2] = cube.U[8];
                newCube.U[6] = cube.L[8]; newCube.U[7] = cube.L[5]; newCube.U[8] = cube.L[2];
                newCube.L[2] = cube.D[0]; newCube.L[5] = cube.D[1]; newCube.L[8] = cube.D[2];
                newCube.D[0] = cube.R[6]; newCube.D[1] = cube.R[3]; newCube.D[2] = cube.R[0];
                newCube.R[0] = temp[0]; newCube.R[3] = temp[1]; newCube.R[6] = temp[2];
            } else {
                temp[0] = cube.U[6]; temp[1] = cube.U[7]; temp[2] = cube.U[8];
                newCube.U[6] = cube.R[0]; newCube.U[7] = cube.R[3]; newCube.U[8] = cube.R[6];
                newCube.R[0] = cube.D[2]; newCube.R[3] = cube.D[1]; newCube.R[6] = cube.D[0];
                newCube.D[0] = cube.L[2]; newCube.D[1] = cube.L[5]; newCube.D[2] = cube.L[8];
                newCube.L[2] = temp[2]; newCube.L[5] = temp[1]; newCube.L[8] = temp[0];
            }
            break;
        case 'B':
            if (!ccw) {
                temp[0] = cube.U[0]; temp[1] = cube.U[1]; temp[2] = cube.U[2];
                newCube.U[0] = cube.R[2]; newCube.U[1] = cube.R[5]; newCube.U[2] = cube.R[8];
                newCube.R[2] = cube.D[8]; newCube.R[5] = cube.D[7]; newCube.R[8] = cube.D[6];
                newCube.D[6] = cube.L[0]; newCube.D[7] = cube.L[3]; newCube.D[8] = cube.L[6];
                newCube.L[0] = temp[2]; newCube.L[3] = temp[1]; newCube.L[6] = temp[0];
            } else {
                temp[0] = cube.U[0]; temp[1] = cube.U[1]; temp[2] = cube.U[2];
                newCube.U[0] = cube.L[6]; newCube.U[1] = cube.L[3]; newCube.U[2] = cube.L[0];
                newCube.L[0] = cube.D[6]; newCube.L[3] = cube.D[7]; newCube.L[6] = cube.D[8];
                newCube.D[6] = cube.R[8]; newCube.D[7] = cube.R[5]; newCube.D[8] = cube.R[2];
                newCube.R[2] = temp[0]; newCube.R[5] = temp[1]; newCube.R[8] = temp[2];
            }
            break;
        default:
            break;
    }
    return newCube;
};

// Shuffle cube with random moves
const shuffleCube = (cube, numMoves = 20) => {
    const moves = ['R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'"];
    let newCube = JSON.parse(JSON.stringify(cube));
    let lastMove = '';

    for (let i = 0; i < numMoves; i++) {
        let move;
        do {
            move = moves[Math.floor(Math.random() * moves.length)];
        } while (move[0] === lastMove[0]); // Avoid same face twice

        newCube = applyMove(newCube, move);
        lastMove = move;
    }
    return newCube;
};

// Single cubie component
function Cubie({ position, colors }) {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            {colors.map((color, i) => (
                <meshStandardMaterial
                    key={i}
                    attach={`material-${i}`}
                    color={color || '#1a1a1a'}
                    metalness={0.1}
                    roughness={0.3}
                />
            ))}
        </mesh>
    );
}

// Full Rubik's Cube
function RubiksCube({ cubeState }) {
    const groupRef = useRef();

    // Generate cubies based on state
    const getCubieColors = (x, y, z) => {
        return [
            x === 1 ? COLORS[cubeState.R[((1 - y) * 3 + (1 - z))]] : null,   // Right
            x === -1 ? COLORS[cubeState.L[((1 - y) * 3 + (z + 1))]] : null,  // Left
            y === 1 ? COLORS[cubeState.U[((1 - z) * 3 + (x + 1))]] : null,   // Up
            y === -1 ? COLORS[cubeState.D[((z + 1) * 3 + (x + 1))]] : null,  // Down
            z === 1 ? COLORS[cubeState.F[((1 - y) * 3 + (x + 1))]] : null,   // Front
            z === -1 ? COLORS[cubeState.B[((1 - y) * 3 + (1 - x))]] : null   // Back
        ];
    };

    const cubies = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                cubies.push({ position: [x, y, z], colors: getCubieColors(x, y, z) });
            }
        }
    }

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.x = 0.3;
            groupRef.current.rotation.y += 0.003;
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
    const [cubeState, setCubeState] = useState(createSolvedCube());
    const timerRef = useRef(null);

    const startGame = useCallback(() => {
        const shuffled = shuffleCube(createSolvedCube(), 20);
        setCubeState(shuffled);
        setGameStarted(true);
        setIsPlaying(true);
        setMoves(0);
        setTimer(0);
        timerRef.current = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
    }, []);

    const handleShuffle = useCallback(() => {
        const shuffled = shuffleCube(cubeState, 20);
        setCubeState(shuffled);
        setMoves(0);
    }, [cubeState]);

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
        setCubeState(prev => applyMove(prev, face));
        setMoves(m => m + 1);
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
                        <p>Click R/L/U/D/F/B to twist faces</p>
                        <p>Add ' for counter-clockwise</p>
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
                        <RubiksCube cubeState={cubeState} />
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
                        <div className="face-buttons ccw">
                            {["R'", "L'", "U'", "D'", "F'", "B'"].map(face => (
                                <button
                                    key={face}
                                    className="face-btn ccw"
                                    onClick={() => handleRotation(face)}
                                >
                                    {face}
                                </button>
                            ))}
                        </div>
                        <button className="shuffle-btn" onClick={handleShuffle}>
                            🔀 SHUFFLE
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
