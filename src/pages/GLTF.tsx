import useStats from 'lib/hooks/useStats';
import useThree, { THREE } from 'lib/hooks/useThree';
import { useEffect } from 'react';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function frameArea(
  sizeToFitOnScreen: number,
  boxSize: number,
  boxCenter: Vector3,
  camera: THREE.PerspectiveCamera
) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

const gltfLoader = new GLTFLoader();

const GLTF = () => {
  const { three, threeWrapper } = useThree();
  const { stats } = useStats();

  useEffect(() => {
    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 0.6;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      three.scene.add(light);
    }

    {
      const color = 0xffffff;
      const intensity = 0.8;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(5, 10, 2);
      three.scene.add(light);
      three.scene.add(light.target);
    }

    gltfLoader.load(
      '/assets/cartoon_lowpoly_small_city_free_pack/scene.gltf',
      (gltf) => {
        const root = gltf.scene;
        three.scene.add(root);

        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        console.log(box, boxSize, boxCenter);

        frameArea(boxSize * 0.5, boxSize, boxCenter, three.camera);

        three.controls.maxDistance = boxSize * 10;
        three.controls.target.copy(boxCenter);
        three.controls.update();
      }
    );

    three.controls.enableDamping = true;

    const render = (time: DOMHighResTimeStamp) => {
      three.controls.update();
      stats.update();
    };

    three.addRenderCallback(render);

    return () => {};
  }, []);

  return (
    <>
      <div ref={threeWrapper}></div>
    </>
  );
};

export default GLTF;
