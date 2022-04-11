import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const FirstProject = lazy(() => import('./pages/FirstProject/FirstProject'));

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
      </Routes>
    </>
  );
}

export default App;
