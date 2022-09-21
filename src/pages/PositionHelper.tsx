import useThree, { InitFn, THREE } from 'lib/hooks/v2/useThree';

const init: InitFn = ({ scene, camera }) => {
  camera.position.set(0, 2, 2);

  {
    const light = new THREE.AmbientLight('#fff');
    scene.add(light);
  }

  // these helpers will make it easy to position the boxes
  // We can rotate the lon helper on its Y axis to the longitude
  const lonHelper = new THREE.Object3D();
  scene.add(lonHelper);
  // We rotate the latHelper on its X axis to the latitude
  const latHelper = new THREE.Object3D();
  lonHelper.add(latHelper);
  // The position helper moves the object to the edge of the sphere
  const positionHelper = new THREE.Object3D();
  positionHelper.position.z = 1;
  latHelper.add(positionHelper);
  // Used to move the center of the cube so it scales from the position Z axis
  const originHelper = new THREE.Object3D();
  originHelper.position.z = 0.5;
  positionHelper.add(originHelper);
  const lonFudge = Math.PI * 0.5;
  const latFudge = Math.PI * -0.135;
  {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // adjust the helpers to point to the latitude and longitude
    lonHelper.rotation.y = THREE.MathUtils.degToRad(0 + -180) + lonFudge;
    latHelper.rotation.x = THREE.MathUtils.degToRad(0 + -60) + latFudge;

    // use the world matrix of the origin helper to
    // position this geometry
    positionHelper.scale.set(
      0.005,
      0.005,
      // THREE.MathUtils.lerp(0.01, 0.5, amount)
      0.005
    );
    originHelper.updateWorldMatrix(true, false);
    geometry.applyMatrix4(originHelper.matrixWorld);
    const material = new THREE.MeshBasicMaterial({ color: 'red' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  {
    const material = new THREE.MeshStandardMaterial({
      wireframe: true,
    });
    const spGeo = new THREE.SphereGeometry(1, 64, 32);
    const sphere = new THREE.Mesh(spGeo, material);
    scene.add(sphere);
  }
};

const PositionHelper = () => {
  const { ref } = useThree({
    init,
  });

  return (
    <>
      <canvas ref={ref}></canvas>
    </>
  );
};

export default PositionHelper;
