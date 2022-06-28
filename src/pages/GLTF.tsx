import useThree, { THREE } from 'lib/hooks/useThree';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();

const GLTF = () => {
  const { three, threeWrapper } = useThree({
    renderOnDemand: false,
  });

  useEffect(() => {
    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 0.6;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      three.scene.add(light);
    }

    const target = new THREE.Object3D();
    {
      const color = 0xffffff;
      const intensity = 0.8;
      const light = new THREE.DirectionalLight(color, intensity);
      light.castShadow = true;
      light.shadow.bias = -0.004;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.position.set(-250, 600, -850);

      target.position.set(-430, 14, -450);
      light.target.add(target);
      three.scene.add(light);
      three.scene.add(light.target);

      target.add(light);
      three.scene.add(target);

      const cam = light.shadow.camera;
      cam.near = 1;
      cam.far = 2000;
      cam.left = -1500;
      cam.right = 1500;
      cam.top = 1500;
      cam.bottom = -1500;
    }

    gltfLoader.load(
      '/assets/cartoon_lowpoly_small_city_free_pack/scene.gltf',
      (gltf) => {
        const root = gltf.scene;
        three.scene.add(root);

        root.traverse((obj) => {
          if (obj.castShadow != null) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        three.frameArea(boxSize * 0.5, boxSize, boxCenter, three.camera);

        three.controls.maxDistance = boxSize * 10;
        three.controls.target.copy(boxCenter);
        three.controls.update();
      }
    );

    three.scene.background = new THREE.Color('#DEFEFF');

    const render = (time: DOMHighResTimeStamp) => {
      three.controls.update();
      target.rotation.y = time * 0.3;
    };

    three.addRenderCallback(render);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={threeWrapper}></div>
    </>
  );
};

export default GLTF;
