import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'stats.js';
import checker from 'assets/checker.png';
import corona_bk from 'assets/first-project/skybox/corona_bk.png';
import corona_dn from 'assets/first-project/skybox/corona_dn.png';
import corona_ft from 'assets/first-project/skybox/corona_ft.png';
import corona_lf from 'assets/first-project/skybox/corona_lf.png';
import corona_rt from 'assets/first-project/skybox/corona_rt.png';
import corona_up from 'assets/first-project/skybox/corona_up.png';
import style from './FirstProject.module.css';
import LoadingScreen from 'components/LoadingScreen/LoadingScreen';

function FirstProject() {
  const ref = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);

  const stats = new Stats();

  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => {
    if (loaded === total) setLoading(false);
  };

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 22);

  const sky = new THREE.CubeTextureLoader(manager).load([
    corona_ft,
    corona_bk,
    corona_up,
    corona_dn,
    corona_rt,
    corona_lf,
  ]);
  scene.background = sky;

  const planeSize = 40;

  const texture = new THREE.TextureLoader(manager).load(checker);
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
  mesh.position.set(0, -0.1, 0);
  mesh.receiveShadow = true;
  scene.add(mesh);

  scene.add(new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.1));

  const light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(15, 20, 10);
  light.angle = Math.PI / 4;
  light.penumbra = 0.1;
  light.decay = 2;
  light.distance = 400;

  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 500;
  light.shadow.camera.far = 4000;
  light.shadow.camera.fov = 30;
  light.shadow.focus = 1;
  light.target.position.set(0, 5, 0);
  scene.add(light);
  scene.add(light.target);

  let military: THREE.Group | null = null;
  const pivotPoint = new THREE.Object3D();
  new GLTFLoader(manager).load(
    require('assets/first-project/military-base/military-base.glb'),
    (e) => {
      military = e.scene;
      military.receiveShadow = true;
      military.castShadow = true;
      military.position.set(0, 0.2, 0);
      scene.add(military);

      const box = new THREE.Box3().setFromObject(military);
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());
      console.log(boxSize);
      console.log(boxCenter);

      military.add(pivotPoint);
      pivotPoint.add(light);
    }
  );

  const sphereGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x6ed3cf });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(0, 7, 0);
  sphereMesh.receiveShadow = true;
  sphereMesh.castShadow = true;
  scene.add(sphereMesh);

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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, ref.current!);
    controls.target.set(0, 5, 0);
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.update();

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      render();
    }

    function render() {
      renderer.render(scene, camera);

      const time = Date.now() * 0.0005;
      sphereMesh.position.x = Math.cos(time * 10) * 0.5;
      sphereMesh.position.y = Math.cos(time * 7) * 0.3 + 7;
      sphereMesh.position.z = Math.cos(time * 8) * 0.4;

      pivotPoint.rotateY(0.05);

      stats.update();
    }

    const clock = new THREE.Clock();
    let delta = 0;
    const interval = 1 / 120;

    function update() {
      requestAnimationFrame(update);

      delta += clock.getDelta();

      if (delta > interval) {
        // The draw or time dependent code are here
        render();

        delta = delta % interval;
      }
    }
    requestAnimationFrame(update);

    window.addEventListener('resize', onWindowResize);

    return () => {
      scene.clear();
      camera.clear();
      sky.dispose();
      mesh.clear();
      texture.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      pivotPoint.clear();
      military?.clear();
      light.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      sphereMesh.clear();
      stats.dom.remove();
      window.removeEventListener('resize', onWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={style.App}>
        <LoadingScreen loading={loading} />

        <canvas ref={ref}></canvas>
      </div>
    </>
  );
}

export default FirstProject;
