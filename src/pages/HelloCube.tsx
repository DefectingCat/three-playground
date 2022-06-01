import useThree, { THREE } from "lib/hooks/useThree";
import { useEffect } from "react";

const HelloCube = () => {
  const { three, threeWrapper } = useThree();

  useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    const light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.1);

    const rotateCube = (time: DOMHighResTimeStamp) => {
      cube.rotation.x = time;
      cube.rotation.y = time;
    };

    three.camera.position.set(0, 0, 5);
    three.controls.target.set(0, 0, 0);

    three.scene.add(cube);
    three.scene.add(light);
    three.tracker.track(geometry);
    three.tracker.track(material);

    three.addRenderCallback(rotateCube);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={threeWrapper} className="cursor-move"></div>;
};

export default HelloCube;
