import { useEffect, useState, Suspense } from 'react';
import './styles/main.scss';
import MainScene from './components/MainScene';
import Overlay from './components/Overlay';

function App() {
  const [section, setSection] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [isLanding, setIsLanding] = useState(false); // Landing animation in progress
  const [isDark, setIsDark] = useState(false); // Dark transition screen
  const maxSection = 1; // Only 0 and 1 via scroll, 2 via Land button

  // Called from MainScene when rain starts
  const handleRainStart = () => {
    setCanScroll(true);
  };

  // Called when Land button is clicked
  const handleLand = () => {
    setIsLanding(true);

    // After 3s landing animation, go dark
    setTimeout(() => {
      setIsDark(true);

      // After 2s dark, show Scene 3
      setTimeout(() => {
        setSection(2);
        setIsLanding(false);

        // Fade out dark after scene loads
        setTimeout(() => setIsDark(false), 500);
      }, 2000);
    }, 3000);
  };

  useEffect(() => {
    let locked = false;

    const onWheel = (e) => {
      if (!canScroll) return;
      if (locked) return;
      if (isLanding) return; // Block scroll during landing

      if (e.deltaY > 0) {
        // Can only scroll to section 1, not 2
        setSection((s) => Math.min(s + 1, maxSection));
      } else {
        setSection((s) => Math.max(s - 1, 0));
      }

      locked = true;
      setTimeout(() => (locked = false), 1200);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [canScroll, isLanding]);

  return (
    <div className="app-container">
      <Suspense fallback={null}>
        <MainScene
          section={section}
          onRainStart={handleRainStart}
          isLanding={isLanding}
        />
      </Suspense>
      <Overlay section={section} onLand={handleLand} />

      {/* Scroll Prompt - section 0 only */}
      {canScroll && section === 0 && (
        <div className="scroll-prompt">
          <span>Scroll to continue</span>
          <div className="scroll-arrow">↓</div>
        </div>
      )}

      {/* Dark Transition Overlay */}
      <div className={`dark-overlay ${isDark ? 'active' : ''}`} />
    </div>
  );
}

export default App;
