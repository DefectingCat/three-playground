import useStats from 'lib/hooks/useStats';
import useThree, { THREE } from 'lib/hooks/useThree';
import { useEffect } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
// @ts-ignore
import module from 'assets/github/DefectingCat-2021.stl';
// import bg from 'assets/images/github/matcap-porcelain-white.jpg';

const manager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader();

const loader = new STLLoader(manager);

const Github = () => {
  const { three, threeWrapper } = useThree();
  const { stats } = useStats();

  useEffect(() => {
    loader.load(
      module,
      (geometry) => {
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          // envMap: textureLoader.load(bg),
          // metalness: 0.25,
          // roughness: 0.1,
          // opacity: 1.0,
          // transparent: true,
          // transmission: 0.99,
          // clearcoat: 1.0,
          // clearcoatRoughness: 0.25,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.geometry.computeVertexNormals();
        mesh.geometry.center();
        mesh.castShadow = true;
        mesh.rotation.x = -1.5;
        mesh.position.set(0, 0, 0);
        three.scene.add(mesh);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log(error);
      }
    );

    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial());
    plane.rotateX(-Math.PI / 2);
    plane.position.y = -30;
    plane.receiveShadow = true;
    three.scene.add(plane);

    // const target = new THREE.Mesh(
    //   new THREE.BoxGeometry(),
    //   new THREE.MeshBasicMaterial()
    // );
    const target = new THREE.Object3D();
    target.position.set(0, 10, 0);

    const light = new THREE.SpotLight();
    light.position.set(0, 70, 70);
    light.angle = 0.4;
    light.castShadow = true;
    light.penumbra = 0.3;
    light.target.add(target);
    three.scene.add(light);
    three.scene.add(light.target);

    target.add(light);
    three.scene.add(target);

    // const spotLightHelper = new THREE.SpotLightHelper(light);
    // three.scene.add(spotLightHelper);

    three.scene.add(new THREE.AmbientLight(0x222222));

    three.camera.position.set(0, 0, 100);
    three.controls.target.set(0, 0, 0);
    three.controls.enableDamping = true;
    three.controls.maxPolarAngle = Math.PI * 0.5;
    three.controls.maxDistance = 200;
    three.controls.minDistance = 50;

    const render = (time: DOMHighResTimeStamp) => {
      three.controls.update();
      target.rotation.y = time;

      stats.update();
    };

    three.addRenderCallback(render);
  }, []);

  return (
    <>
      <div ref={threeWrapper}></div>
    </>
  );
};

export default Github;
