import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('pages/Home'));
const HelloCube = lazy(() => import('pages/HelloCube'));
const Corona = lazy(() => import('pages/Corona'));
const Github = lazy(() => import('pages/Github'));
const GLTF = lazy(() => import('pages/GLTF'));
const Around = lazy(() => import('pages/Around'));
const Solar = lazy(() => import('pages/Solar'));
const MousePick = lazy(() => import('pages/MousePick'));
const GPUMousePick = lazy(() => import('pages/GPUMousePick'));

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
  {
    id: 4,
    path: '/around',
    name: 'Around',
    element: <Around />,
  },
  {
    id: 5,
    path: '/solar',
    name: 'Solar',
    element: <Solar />,
  },
  {
    id: 6,
    path: '/pick',
    name: 'MousePick',
    element: <MousePick />,
  },
  {
    id: 7,
    path: '/gpu-pick',
    name: 'GPUMousePick',
    element: <GPUMousePick />,
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
