import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import corona_bk from 'assets/first-project/skybox/corona_bk.png';
import corona_dn from 'assets/first-project/skybox/corona_dn.png';
import corona_ft from 'assets/first-project/skybox/corona_ft.png';
import corona_lf from 'assets/first-project/skybox/corona_lf.png';
import corona_rt from 'assets/first-project/skybox/corona_rt.png';
import corona_up from 'assets/first-project/skybox/corona_up.png';
import GUI from 'lil-gui';

const gui = new GUI();

class AxisGridHelper {
  private grid: THREE.GridHelper;
  private axes: THREE.AxesHelper;
  private _visible: boolean;

  constructor(node: THREE.Mesh | THREE.Object3D, units = 10) {
    const axes = new THREE.AxesHelper();
    if (!Array.isArray(axes.material)) axes.material.depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    if (!Array.isArray(grid.material)) grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.grid.visible = false;
    this.axes.visible = false;
    this._visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

const SolarSystem: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => {
    if (loaded === total) setLoading(false);
  };

  const stats = new Stats();

  const objects: (THREE.Mesh | THREE.Object3D)[] = [];

  const scene = new THREE.Scene();
  const sky = new THREE.CubeTextureLoader(manager).load([
    corona_ft,
    corona_bk,
    corona_up,
    corona_dn,
    corona_rt,
    corona_lf,
  ]);
  scene.background = sky;

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 20, 10);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
  });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 15;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
    shininess: 100,
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 5;
  earthOrbit.add(moonOrbit);

  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  const light = new THREE.PointLight(0xffffff, 3);
  scene.add(light);

  useEffect(() => {
    document.body.appendChild(stats.dom);

    const renderer = new THREE.WebGLRenderer({
      canvas: ref.current!,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, ref.current!);
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.update();

    function makeAxisGrid(
      node: THREE.Mesh | THREE.Object3D,
      label: string,
      units?: number
    ) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, 'visible').name(label);
    }

    makeAxisGrid(solarSystem, 'solarSystem', 26);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthOrbit, 'earthOrbit');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    makeAxisGrid(moonMesh, 'moonMesh');

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      render(0);
    }

    const render: FrameRequestCallback = (time) => {
      console.log(time * 0.001);

      time *= 0.001;

      objects.forEach((o) => {
        o.rotation.y = time;
      });

      renderer.render(scene, camera);

      stats.update();

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.body.removeChild(stats.dom);
      scene.clear();
      sky.dispose();
      camera.clear();
      renderer.clear();
      controls.dispose();
      light.dispose();
      earthOrbit.clear();
      earthMesh.clear();
      moonOrbit.clear();
      moonMesh.clear();
      sunMesh.clear();
      solarSystem.clear();
      sphereGeometry.dispose();
      earthMaterial.dispose();
      moonMaterial.dispose();
      sunMaterial.dispose();
      gui.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoadingScreen loading={loading} />

      <canvas ref={ref}></canvas>
    </>
  );
};

export default SolarSystem;
