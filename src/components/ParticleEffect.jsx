import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Simplex 3D noise GLSL function
const simplexNoiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// Vertex shader - where the magic happens
const vertexShader = `
${simplexNoiseGLSL}

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

attribute float aRandom;

varying float vAlpha;
varying vec2 vDirection;

void main() {
    vec3 pos = position;
    
    // Time-based flow field using noise
    float noiseFreq = 0.3;
    float noiseSpeed = 0.15;
    
    // Multiple layers of noise for complexity
    float n1 = snoise(vec3(pos.xy * noiseFreq, uTime * noiseSpeed));
    float n2 = snoise(vec3(pos.xy * noiseFreq * 2.0, uTime * noiseSpeed * 1.3 + 100.0));
    
    // Flow direction from noise (like a vector field)
    float flowX = snoise(vec3(pos.xy * 0.5, uTime * 0.1));
    float flowY = snoise(vec3(pos.xy * 0.5 + 50.0, uTime * 0.1 + 50.0));
    
    // Apply flow displacement
    pos.x += flowX * 0.3;
    pos.y += flowY * 0.3;
    
    // Mouse influence - attract toward cursor
    vec2 mousePos = (uMouse / uResolution) * 2.0 - 1.0;
    mousePos.x *= uResolution.x / uResolution.y;
    
    vec2 toMouse = mousePos - pos.xy;
    float dist = length(toMouse);
    float influence = smoothstep(1.5, 0.0, dist) * 0.4;
    
    pos.xy += toMouse * influence;
    
    // Pass direction for fragment shader (for pill rotation)
    vDirection = normalize(vec2(flowX, flowY) + toMouse * influence * 2.0);
    
    // Alpha based on movement
    vAlpha = 0.6 + n1 * 0.2;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size with depth attenuation
    gl_PointSize = (4.0 + aRandom * 2.0) * (1.0 / -mvPosition.z);
}
`;

// Fragment shader - draw the pill/dash shape
const fragmentShader = `
varying float vAlpha;
varying vec2 vDirection;

void main() {
    // Create pill/dash shape
    vec2 uv = gl_PointCoord - 0.5;
    
    // Rotate UV based on flow direction
    float angle = atan(vDirection.y, vDirection.x);
    float c = cos(angle);
    float s = sin(angle);
    uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    
    // Pill shape - stretched circle
    float stretch = 2.5;
    float dist = length(vec2(uv.x * stretch, uv.y));
    
    // Soft edges
    float alpha = smoothstep(0.5, 0.3, dist) * vAlpha;
    
    // Purple/violet color for white background
    vec3 color = vec3(0.42, 0.13, 0.66); // Purple #6b21a8
    
    gl_FragColor = vec4(color, alpha);
}
`;

export default function ParticleEffect() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const materialRef = useRef(null);
    const animationRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (!containerRef.current) return;

        // Clean up any existing canvas (for React Strict Mode)
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // Setup Three.js scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.z = 2;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Style the canvas for absolute positioning - use cssText to ensure it applies
        renderer.domElement.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
        `;

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create particles - full screen coverage
        const particleCount = 3000;
        const positions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount);

        // Distribute particles across full view with extra margin for edge coverage
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 6;     // x: wider spread for edge coverage
            positions[i * 3 + 1] = (Math.random() - 0.5) * 4; // y: taller spread
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5; // z (shallow depth)
            randoms[i] = Math.random();
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        // Shader material
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        materialRef.current = material;

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Mouse tracking
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = window.innerHeight - e.clientY; // Flip Y
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Handle resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            material.uniforms.uResolution.value.set(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Update uniforms
            material.uniforms.uTime.value = elapsedTime;
            material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

            // Subtle camera drift
            camera.position.x = Math.sin(elapsedTime * 0.1) * 0.05;
            camera.position.y = Math.cos(elapsedTime * 0.15) * 0.05;

            renderer.render(scene, camera);
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5
            }}
        />
    );
}
