import corona_bk from 'assets/images/corona/corona_bk.png';
import corona_dn from 'assets/images/corona/corona_dn.png';
import corona_ft from 'assets/images/corona/corona_ft.png';
import corona_lf from 'assets/images/corona/corona_lf.png';
import corona_rt from 'assets/images/corona/corona_rt.png';
import corona_up from 'assets/images/corona/corona_up.png';
import useThree, { THREE } from 'lib/hooks/useThree';
import { useCallback, useEffect, useRef } from 'react';

const manager = new THREE.LoadingManager();
const sky = new THREE.CubeTextureLoader(manager).load([
  corona_ft,
  corona_bk,
  corona_up,
  corona_dn,
  corona_rt,
  corona_lf,
]);

const HelloCube = () => {
  const { three, threeWrapper } = useThree({
    renderOnDemand: false,
  });

  useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    const light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.1);

    const rotateCube = (time: DOMHighResTimeStamp) => {
      cube.rotation.x = time;
      cube.rotation.y = time;
      three.controls.update();
    };

    three.scene.background = sky;
    three.camera.position.set(0, 0, 5);
    three.controls.target.set(0, 0, 0);
    three.controls.autoRotate = true;
    three.controls.autoRotateSpeed = 1;

    three.scene.add(cube);
    three.scene.add(light);
    three.tracker.track(geometry);
    three.tracker.track(material);

    three.addRenderCallback(rotateCube);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastID = useRef<NodeJS.Timeout>();
  const handleDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      three.controls.autoRotate = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      clearTimeout(lastID.current);
      lastID.current = setTimeout(() => {
        three.controls.autoRotate = true;
      }, 999);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      ref={threeWrapper}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      className="cursor-move"
    ></div>
  );
};

export default HelloCube;
