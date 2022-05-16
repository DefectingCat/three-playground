import { useCallback, useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const geometry = new THREE.BoxGeometry(1, 1, 1);
const matrial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, matrial);

const light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.1);

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  const scene = useRef(new THREE.Scene());
  const camera = useRef(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  camera.current.position.z = 5;

  const renderer = useRef<THREE.WebGLRenderer>(
    new THREE.WebGLRenderer({
      antialias: true,
    })
  );
  renderer.current.setPixelRatio(window.devicePixelRatio);
  renderer.current.setSize(window.innerWidth, window.innerHeight);
  renderer.current.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.current.toneMappingExposure = 1;
  // renderer.current.outputEncoding = THREE.sRGBEncoding;
  renderer.current.shadowMap.enabled = true;
  renderer.current.shadowMap.type = THREE.PCFSoftShadowMap;

  const controls = useRef(
    new OrbitControls(camera.current, renderer.current.domElement)
  );
  controls.current.target.set(0, 0, 0);
  // controls.current.maxPolarAngle = Math.PI / 2;
  // controls.current.enableZoom = false;
  controls.current.enablePan = false;
  controls.current.update();

  /**
   * Render function.
   */
  const render: FrameRequestCallback = useCallback((time) => {
    time *= 0.001;

    renderer.current.render(scene.current, camera.current);

    cube.rotation.x = time;
    cube.rotation.y = time;

    requestAnimationFrame(render);
  }, []);
  requestAnimationFrame(render);

  /**
   * Adjust aspect when window is resized.
   */
  const onWindowResize = useCallback(() => {
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();
    renderer.current.setSize(window.innerWidth, window.innerHeight);

    render(0);
  }, [render]);

  window.addEventListener('resize', onWindowResize);

  useEffect(() => {
    appRef.current?.appendChild(renderer.current.domElement);
  }, []);

  // Add Objects
  useEffect(() => {
    scene.current.add(cube);
    scene.current.add(light);
  }, []);

  // Cleanup
  useEffect(() => {
    const s = scene.current;

    return () => {
      s.clear();
    };
  }, []);

  return <div ref={appRef}></div>;
}

export default App;
