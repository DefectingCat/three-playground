import { useThree, THREE, InitFn } from 'rua-three';

const init: InitFn = ({ scene, camera }) => {
  camera.position.set(0, 5, 0);
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject);
};

const Curve = () => {
  const { ref } = useThree({
    init,
  });

  return (
    <>
      <canvas ref={ref}></canvas>
    </>
  );
};

export default Curve;
