import { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './styles/main.scss';
import MainScene from './components/MainScene';
import Overlay from './components/Overlay';
import ExperienceStart from './components/ExperienceStart';
import RoomScene from './components/RoomScene';
import PinballGame from './components/PinballGame';
import FlappyBirdGame from './components/FlappyBirdGame';
import RubiksCubeGame from './components/RubiksCubeGame';
import GameLoader from './components/GameLoader';
import SoftwareCareerScene from './components/SoftwareCareerScene';
import AsusLaptopScene from './components/AsusLaptopScene';
import LandingScene from './components/LandingScene';
import IslandScene from './components/IslandScene';
import PolyThemeScene from './components/PolyThemeScene';
import WindmillScene from './components/WindmillScene';
import RoomBikeScene from './components/RoomBikeScene';

// Main Experience Component - combines intro, flight, and sunset on single page
function MainExperience() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [section, setSection] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isStoryDone, setIsStoryDone] = useState(false);

  const handleStart = () => {
    // Don't hide intro yet - let animation play
    setHasStarted(true);
  };

  const handleExitComplete = () => {
    // Hide intro after animation completes
    setShowIntro(false);
  };

  const handleRainStart = () => {
    setCanScroll(true);
  };

  // Handle scroll to switch from section 0 to section 1
  useEffect(() => {
    if (!hasStarted || section !== 0) return;

    let locked = false;

    const onWheel = (e) => {
      if (!canScroll) return;
      if (locked) return;

      if (e.deltaY > 0) {
        setSection(1);
        setCanScroll(false);
      }

      locked = true;
      setTimeout(() => (locked = false), 1200);
    };

    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (!canScroll) return;
      if (locked) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Swipe up (deltaY > 0) to continue
      if (deltaY > 50) {
        setSection(1);
        setCanScroll(false);
        locked = true;
        setTimeout(() => (locked = false), 1200);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [hasStarted, canScroll, section]);

  // Handle scroll back from section 1 to section 0
  useEffect(() => {
    if (!hasStarted || section !== 1) return;

    let locked = false;

    const onWheel = (e) => {
      if (locked) return;

      // Scroll up (negative deltaY) goes back to section 0
      if (e.deltaY < 0) {
        setSection(0);
        setCanScroll(true); // Re-enable scroll for section 0
      }

      locked = true;
      setTimeout(() => (locked = false), 1200);
    };

    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (locked) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Swipe down (deltaY < 0) to go back
      if (deltaY < -50) {
        setSection(0);
        setCanScroll(true);
        locked = true;
        setTimeout(() => (locked = false), 1200);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [hasStarted, section]);

  // Story timing for section 1
  useEffect(() => {
    if (section !== 1) return;
    const timer = setTimeout(() => setIsStoryDone(true), 9500);
    return () => clearTimeout(timer);
  }, [section]);

  const handleLand = () => {
    setIsLanding(true);

    setTimeout(() => {
      setIsDark(true);

      setTimeout(() => {
        navigate('/starFishIsland');
      }, 2000);
    }, 3000);
  };

  // Show intro screen before starting (no 3D scene yet)
  if (!hasStarted) {
    return (
      <ExperienceStart
        onStart={handleStart}
        onExitComplete={handleExitComplete}
      />
    );
  }

  // Show main experience - with intro overlay if still transitioning
  return (
    <div className="app-container">
      <Suspense fallback={null}>
        <MainScene
          section={section}
          onRainStart={handleRainStart}
          isLanding={isLanding}
          isStoryDone={isStoryDone}
          hasStarted={hasStarted}
        />
      </Suspense>

      {/* Intro overlay on top of 3D scene during transition */}
      {showIntro && (
        <ExperienceStart
          onStart={handleStart}
          onExitComplete={handleExitComplete}
        />
      )}

      {section === 0 && canScroll && (
        <div className="scroll-prompt">
          <span>Scroll to continue</span>
          <div className="scroll-arrow">↓</div>
        </div>
      )}

      {section === 1 && (
        <Overlay section={1} onLand={handleLand} onBack={() => { }} isStoryDone={isStoryDone} />
      )}

      <div className={`dark-overlay ${isDark ? 'active' : ''}`} />
    </div>
  );
}

// Room Scene Wrapper with back navigation
function RoomSceneWrapper() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/myHouse');
  };

  return <RoomScene onBack={handleBack} />;
}

// Pinball Game Wrapper with back navigation
function PinballGameWrapper() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <GameLoader gameType="pinball" onComplete={() => setLoading(false)} />;
  }

  return <PinballGame onClose={() => navigate(-1)} />;
}

// Flappy Bird Game Wrapper
function FlappyBirdGameWrapper() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <GameLoader gameType="flappy" onComplete={() => setLoading(false)} />;
  }

  return <FlappyBirdGame onClose={() => navigate(-1)} />;
}

// Rubik's Cube Game Wrapper
function RubiksCubeGameWrapper() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <GameLoader gameType="rubiks" onComplete={() => setLoading(false)} />;
  }

  return <RubiksCubeGame onClose={() => navigate(-1)} />;
}

// Software Career Scene Wrapper
function SoftwareCareerWrapper() {
  return <SoftwareCareerScene />;
}

// ASUS Laptop Scene Wrapper
function AsusSceneWrapper() {
  return <AsusLaptopScene />;
}

// Landing Scene Wrapper
function LandingSceneWrapper() {
  return <LandingScene />;
}

// Island Scene Wrapper
function IslandSceneWrapper() {
  return <IslandScene />;
}

// PolyTheme Scene Wrapper
function PolyThemeSceneWrapper() {
  return <PolyThemeScene />;
}

// Windmill Scene Wrapper
function WindmillSceneWrapper() {
  return <WindmillScene />;
}

// Room Bike Scene Wrapper
function RoomBikeSceneWrapper() {
  return <RoomBikeScene />;
}

// Main App with Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainExperience />} />
      <Route path="/room" element={<RoomSceneWrapper />} />
      <Route path="/software" element={<RoomSceneWrapper />} />
      <Route path="/softwareCareer" element={<SoftwareCareerWrapper />} />
      <Route path="/pinball" element={<PinballGameWrapper />} />
      <Route path="/flappy-bird" element={<FlappyBirdGameWrapper />} />
      <Route path="/rubiks-cube" element={<RubiksCubeGameWrapper />} />
      <Route path="/asus" element={<AsusSceneWrapper />} />
      <Route path="/landing" element={<LandingSceneWrapper />} />
      <Route path="/island" element={<IslandSceneWrapper />} />
      <Route path="/polyTheme" element={<PolyThemeSceneWrapper />} />
      <Route path="/starFishIsland" element={<WindmillSceneWrapper />} />
      <Route path="/myHouse" element={<RoomBikeSceneWrapper />} />
    </Routes>
  );
}

export default App;
