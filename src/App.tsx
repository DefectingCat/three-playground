import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('pages/Home'));
const HelloCube = lazy(() => import('pages/HelloCube'));

function App() {
  return (
    <>
      <Suspense fallback>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/hello-cube" element={<HelloCube />}></Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
