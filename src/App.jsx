import { useEffect, useState, Suspense } from 'react';
import './styles/main.scss';
import MainScene from './components/MainScene';
import Overlay from './components/Overlay';

function App() {
  const [section, setSection] = useState(0);
  const maxSection = 2; // 0=Plane, 1=Football, 2=Bike (later)

  useEffect(() => {
    let locked = false;

    const onWheel = (e) => {
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
  }, []);

  return (
    <div className="app-container">
      <Suspense fallback={null}>
        <MainScene section={section} />
      </Suspense>
      <Overlay section={section} />
    </div>
  );
}

export default App;
