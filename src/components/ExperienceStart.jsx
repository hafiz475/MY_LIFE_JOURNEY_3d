import './ExperienceStart.scss';

export default function ExperienceStart({ onStart }) {
    return (
        <div className="experience-start">
            <div className="start-content">
                <h1>J Md Hafizur Rahman</h1>
                <p>Immersive Audio Experience Ready</p>
                <button onClick={onStart}>
                    Enter Cockpit
                </button>
            </div>
        </div>
    );
}
