import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';
import './App.css';
import checker from 'assets/checker.png';

const stats = new Stats();
document.body.appendChild(stats.dom);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 10, 20);

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const planeSize = 40;

const loader = new THREE.TextureLoader();
const texture = loader.load(checker);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;

const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -0.5;
scene.add(mesh);

scene.add(new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 1));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

const objLoader = new GLTFLoader();
let windmill: THREE.Group | null = null;
objLoader.load('/windmill_001.glb', (e) => {
  windmill = e.scene;
  scene.add(windmill);
});

function App() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: ref.current! });
    const controls = new OrbitControls(camera, ref.current!);
    controls.target.set(0, 5, 0);
    controls.update();

    function resizeRenderToDisplaySize(renderer: THREE.WebGLRenderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render() {
      stats.begin();
      if (resizeRenderToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      if (windmill) windmill.rotateY(0.01);

      renderer.render(scene, camera);
      stats.end();

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    return () => {
      texture.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      light.dispose();
    };
  }, []);

  return (
    <div className="App">
      <canvas ref={ref}></canvas>
    </div>
  );
}

export default App;
