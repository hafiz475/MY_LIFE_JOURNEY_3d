export default function SceneNeon() {
    return (
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
            <color attach="background" args={['#050505']} />

            <ambientLight intensity={0.4} />

            <Suspense fallback={null}>
                <CameraRig />
                <NeonSign />
            </Suspense>
        </Canvas>
    );
}
