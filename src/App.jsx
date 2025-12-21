import { useEffect, useState, Suspense } from 'react';
import './styles/main.scss';
import MainScene from './components/MainScene';
import Overlay from './components/Overlay';

function App() {
  const [section, setSection] = useState(0);
  const [canScroll, setCanScroll] = useState(false); // Disabled until rain ends
  const maxSection = 2; // 0=Plane, 1=Football, 2=Bike (later)

  // Called from MainScene when rain starts - scroll can now be enabled
  const handleRainStart = () => {
    setCanScroll(true);
  };

  useEffect(() => {
    let locked = false;

    const onWheel = (e) => {
      // Block scroll if not allowed yet
      if (!canScroll) return;
      if (locked) return;

      if (e.deltaY > 0) {
        setSection((s) => Math.min(s + 1, maxSection));
      } else {
        setSection((s) => Math.max(s - 1, 0));
      }

      locked = true;
      setTimeout(() => (locked = false), 1200); // debounce
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [canScroll]);

  return (
    <div className="app-container">
      <Suspense fallback={null}>
        <MainScene section={section} onRainStart={handleRainStart} />
      </Suspense>
      <Overlay section={section} />

      {/* Scroll Prompt - shows when scroll is enabled, only in section 0 */}
      {canScroll && section === 0 && (
        <div className="scroll-prompt">
          <span>Scroll to continue</span>
          <div className="scroll-arrow">↓</div>
        </div>
      )}
    </div>
  );
}

export default App;
