export default function BikePlaceholder({ visible }) {
    return (
        <mesh visible={visible} position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.8, 3]} />
            <meshStandardMaterial color="#222" />
        </mesh>
    );
}
