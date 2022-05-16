import { useEffect } from 'react';
import useThree from 'lib/hooks/useThree';

function App() {
  const { three, threeWrapper, RUAThree } = useThree();

  useEffect(() => {
    const geometry = new RUAThree.THREE.BoxGeometry(1, 1, 1);
    const matrial = new RUAThree.THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new RUAThree.THREE.Mesh(geometry, matrial);

    const light = new RUAThree.THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.1);

    const rotateCube = (time: DOMHighResTimeStamp) => {
      cube.rotation.x = time;
      cube.rotation.y = time;
    };

    three.camera.position.set(0, 0, 5);
    three.controls.target.set(0, 0, 0);

    three.scene.add(cube);
    three.scene.add(light);

    three.addRenderCallback(rotateCube);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={threeWrapper} className="cursor-move"></div>;
}

export default App;
