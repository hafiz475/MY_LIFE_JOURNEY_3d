// // src/App.jsx
// import React from "react";
// import LifeStory3D from "./components/LifeStory3D";
// import "./styles/main.scss"; // your global styles (optional)
// export default function App() {
//   return (
//     <div className="app">
//       <LifeStory3D />
//     </div>
//   );
// }

import { Suspense } from 'react';
import './styles/main.scss';  // Import your SCSS
import Scene from './components/Scene';

function App() {
  return (
    <div className="app-container">
      <Suspense fallback={<div>Loading 3D scene...</div>}>
        <Scene />
      </Suspense>
    </div>
  );
}

export default App;