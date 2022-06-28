import useThree, { THREE } from 'lib/hooks/useThree';
import corona_bk from 'assets/images/corona/corona_bk.png';
import corona_dn from 'assets/images/corona/corona_dn.png';
import corona_ft from 'assets/images/corona/corona_ft.png';
import corona_lf from 'assets/images/corona/corona_lf.png';
import corona_rt from 'assets/images/corona/corona_rt.png';
import corona_up from 'assets/images/corona/corona_up.png';
import { useEffect } from 'react';
import useStats from 'lib/hooks/useStats';

const manager = new THREE.LoadingManager();
const sky = new THREE.CubeTextureLoader(manager).load([
  corona_ft,
  corona_bk,
  corona_up,
  corona_dn,
  corona_rt,
  corona_lf,
]);

const Corona = () => {
  const { three, threeWrapper } = useThree({
    rotateInversion: true,
    renderOnDemand: false,
  });
  const { stats } = useStats();

  useEffect(() => {
    three.scene.background = sky;

    const update = (time: DOMHighResTimeStamp) => {
      three.controls.update();

      stats.update();
    };

    three.camera.position.set(0, 0, 5);
    three.controls.target.set(0, 0, 0);
    three.controls.autoRotate = true;
    three.controls.autoRotateSpeed = 1;

    three.addRenderCallback(update);

    stats.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={threeWrapper}></div>
    </>
  );
};

export default Corona;
