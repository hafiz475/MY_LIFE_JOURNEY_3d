import Spline from '@splinetool/react-spline';
import './LaptopScene.scss';

// Main Scene Component using Spline
export default function LaptopScene() {
    return (
        <div className="laptop-scene-container">
            {/* Spline 3D Scene */}
            <Spline
                scene="https://prod.spline.design/2sS2nXzpNA3Plkzn/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Title overlay */}
            <div className="scene-overlay">
                <h1 className="scene-title">Software Engineering</h1>
                <p className="scene-subtitle">Crafting Digital Experiences</p>
            </div>
        </div>
    );
}
