import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('pages/Home'));
const HelloCube = lazy(() => import('pages/HelloCube'));
const Corona = lazy(() => import('pages/Corona'));
const Github = lazy(() => import('pages/Github'));
const GLTF = lazy(() => import('pages/GLTF'));

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
  {
    id: 2,
    path: '/github',
    name: 'github',
    element: <Github />,
  },
  {
    id: 3,
    path: '/gltf',
    name: 'GLTF',
    element: <GLTF />,
  },
];

function App() {
  return (
    <>
      <Suspense fallback>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          {projects.map((p) => (
            <Route key={p.path} path={p.path} element={p.element}></Route>
          ))}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
