import { FC } from 'react';
import { useThree } from '@react-three/fiber';

const ThreeFiber: FC = () => {
  const camera = useThree((s) => s.camera);
  camera.position.set(0, 5, 5);
  camera.lookAt(0, 0, 0);

  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]}></boxGeometry>
        <meshPhongMaterial color="hotpink"></meshPhongMaterial>
      </mesh>
    </>
  );
};

export default ThreeFiber;
