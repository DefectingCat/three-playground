import { Canvas } from '@react-three/fiber';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const FirstProject = lazy(() => import('./pages/FirstProject/FirstProject'));
const Equirectangular = lazy(
  () => import('./pages/Equirectangular/Equirectangular')
);
const Skybox = lazy(() => import('./pages/Skybox/Skybox'));
const ThreeFiber = lazy(() => import('./pages/ThreeFiber/ThreeFiber'));

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/first-project"
          element={
            <Suspense fallback>
              <FirstProject />
            </Suspense>
          }
        />
        <Route
          path="/equirectangular"
          element={
            <Suspense fallback>
              <Equirectangular />
            </Suspense>
          }
        />
        <Route
          path="/skybox"
          element={
            <Suspense fallback>
              <Skybox />
            </Suspense>
          }
        />
        <Route
          path="/three-fiber"
          element={
            <Suspense fallback>
              <div style={{ width: '100vw', height: '100vh' }}>
                <Canvas
                  flat
                  linear
                  camera={{ aspect: window.innerWidth / window.innerHeight }}
                >
                  <ThreeFiber />
                </Canvas>
              </div>
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
