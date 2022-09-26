import { useThree, THREE } from 'rua-three';
import { InitFn } from 'rua-three/lib/esm/hooks/useThree';

const init: InitFn = ({ scene, camera, controls, addRenderCallback }) => {
  // {
  //   const skyColor = '#fff'; // light blue
  //   const intensity = 0.6;
  //   const light = new THREE.HemisphereLight(skyColor, undefined, intensity);
  //   three.scene.add(light);
  // }
  {
    const light = new THREE.AmbientLight('#fff', 0.6);
    scene.add(light);
  }

  {
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({
      color: '#7e7e7e',
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.rotateX(Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);
  }

  const material = new THREE.MeshPhongMaterial({
    color: '#4d4d4d',
    specular: '#fdfdfd',
    emissive: 'rgb(0,0,0)',
  });
  const target = new THREE.Object3D();
  // {
  //   const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
  //   const sphere = new THREE.Mesh(sphereGeo, material);
  //   sphere.castShadow = true;
  //   sphere.receiveShadow = true;
  //   sphere.position.set(0, 2, 0);
  //   three.scene.add(sphere);
  // }
  {
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const box = new THREE.Mesh(boxGeo, material);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(0, 2, 0);
    box.add(target);
    scene.add(box);
  }

  {
    const sphereGeo = new THREE.SphereGeometry(0.5, 32, 16);
    const sphere = new THREE.Mesh(sphereGeo, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(-2, 0, 0);

    // target.position.set(0, 2, 0);
    target.add(sphere);
  }

  const light = new THREE.SpotLight('rgb(255,255,255)', 1, 0, 0.3);
  light.position.set(7.822, 7.432, 1.905);
  // scene.add(new THREE.SpotLightHelper(light));
  light.castShadow = true;
  scene.add(light);

  camera.position.set(0, 8, 18);
  controls.maxPolarAngle = Math.PI / 2;

  const render = (time: number) => {
    controls.update();
    target.rotation.y = time;
  };

  addRenderCallback(render);

  // eslint-disable-next-line react-hooks/exhaustive-deps
};

const Around = () => {
  const { ref } = useThree({
    init,
  });

  return (
    <>
      <canvas ref={ref}></canvas>
    </>
  );
};

export default Around;
