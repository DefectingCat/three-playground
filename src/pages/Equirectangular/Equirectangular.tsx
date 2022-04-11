import { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import background from 'assets/equirectangular-panorama/background.jpg';
import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import Stats from 'stats.js';

const Equirectangular: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);

  const stats = new Stats();

  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => {
    if (loaded === total) setLoading(false);
  };

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.lookAt(0, 0, 0);

  const textureLoader = new THREE.TextureLoader(manager);

  const geometry = new THREE.SphereGeometry(camera.far / 2, 60, 40);
  geometry.scale(-1, 1, 1);
  const texture = textureLoader.load(background);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.FrontSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const cameraParams = {
    isUserInteracting: false,
    onMouseDownMouseX: 0,
    onMouseDownMouseY: 0,
    lon: 0,
    onMouseDownLon: 0,
    lat: 0,
    onMouseDownLat: 0,
    phi: 0,
    theta: 0,
  };

  function onWindowMouseDown(e: MouseEvent) {
    e.preventDefault();

    cameraParams.isUserInteracting = true;
    cameraParams.onMouseDownMouseX = e.clientX;
    cameraParams.onMouseDownMouseY = e.clientY;
    cameraParams.onMouseDownLon = cameraParams.lon;
    cameraParams.onMouseDownLat = cameraParams.lat;
  }
  function onWindowMouseMove(e: MouseEvent) {
    if (cameraParams.isUserInteracting) {
      cameraParams.lon =
        (cameraParams.onMouseDownMouseX - e.clientX) * 0.1 +
        cameraParams.onMouseDownLon;
      cameraParams.lat =
        (e.clientY - cameraParams.onMouseDownMouseY) * 0.1 +
        cameraParams.onMouseDownLat;
    }
  }
  function onWindowMouseUp(e: MouseEvent) {
    cameraParams.isUserInteracting = false;
  }
  function onWindowMouseWheel(e: WheelEvent) {
    camera.fov += e.deltaY * 0.05;
    camera.fov = Math.max(camera.fov, 10);
    camera.fov = Math.min(camera.fov, 75);
    camera.updateProjectionMatrix();
  }

  useEffect(() => {
    document.body.appendChild(stats.dom);

    const renderer = new THREE.WebGLRenderer({
      canvas: ref.current!,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      render();
    }

    function render() {
      if (!cameraParams.isUserInteracting) {
        cameraParams.lon += 0.1;
      }
      cameraParams.lat = Math.max(-85, Math.min(85, cameraParams.lat));
      cameraParams.phi = THREE.MathUtils.degToRad(90 - cameraParams.lat);
      cameraParams.theta = THREE.MathUtils.degToRad(cameraParams.lon);
      const target = new THREE.Vector3(
        500 * Math.sin(cameraParams.phi) * Math.cos(cameraParams.theta),
        500 * Math.cos(cameraParams.phi),
        500 * Math.sin(cameraParams.phi) * Math.sin(cameraParams.theta)
      );
      camera.lookAt(target);

      renderer.render(scene, camera);

      stats.update();
    }

    const clock = new THREE.Clock();
    let delta = 0;
    const interval = 1 / 120;

    function update() {
      requestAnimationFrame(update);

      delta += clock.getDelta();

      if (delta > interval) {
        render();

        delta = delta % interval;
      }
    }
    requestAnimationFrame(update);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousedown', onWindowMouseDown);
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('wheel', onWindowMouseWheel);

    return () => {
      camera.clear();
      mesh.clear();
      scene.clear();
      geometry.dispose();
      texture.dispose();
      material.dispose();
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousedown', onWindowMouseDown);
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('wheel', onWindowMouseWheel);
      stats.dom.remove();
    };
  }, []);

  return (
    <>
      <LoadingScreen loading={loading} />

      <canvas ref={ref}></canvas>
    </>
  );
};

export default Equirectangular;
