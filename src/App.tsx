import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const FirstProject = lazy(() => import('./pages/FirstProject/FirstProject'));
const Equirectangular = lazy(
  () => import('./pages/Equirectangular/Equirectangular')
);

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
      </Routes>
    </>
  );
}

export default App;
