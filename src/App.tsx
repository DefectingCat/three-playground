import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('pages/Home'));
const HelloCube = lazy(() => import('pages/HelloCube'));
const Corona = lazy(() => import('pages/Corona'));

export const projects = [
  {
    id: 0,
    path: '/hello-cube',
    name: 'Hello cube',
    element: <HelloCube />,
  },
  {
    id: 1,
    path: '/corona',
    name: 'corona',
    element: <Corona />,
  },
];

function App() {
  return (
    <>
      <Suspense fallback>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          {projects.map((p) => (
            <Route path={p.path} element={p.element}></Route>
          ))}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
