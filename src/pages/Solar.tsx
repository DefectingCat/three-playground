import { useEffect } from 'react';
import useThree, { THREE } from 'lib/hooks/useThree';
import corona_bk from 'assets/images/corona/corona_bk.png';
import corona_dn from 'assets/images/corona/corona_dn.png';
import corona_ft from 'assets/images/corona/corona_ft.png';
import corona_lf from 'assets/images/corona/corona_lf.png';
import corona_rt from 'assets/images/corona/corona_rt.png';
import corona_up from 'assets/images/corona/corona_up.png';
import sunMaterial from 'assets/images/solar/sun.jpg';
import earthMaterial from 'assets/images/solar/earth.jpeg';

const manager = new THREE.LoadingManager();
const sky = new THREE.CubeTextureLoader(manager).load([
  corona_ft,
  corona_bk,
  corona_up,
  corona_dn,
  corona_rt,
  corona_lf,
]);
const sunMap = new THREE.TextureLoader(manager).load(sunMaterial);
const earthMap = new THREE.TextureLoader(manager).load(earthMaterial);

const Solar = () => {
  const { three, threeWrapper } = useThree({
    renderOnDemand: false,
  });
  const { scene } = three;

  useEffect(() => {
    three.camera.position.set(0, 10, 50);
    three.camera.lookAt(0, 0, 0);
    scene.background = sky;
    const position = new THREE.Vector3();

    {
      const light = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(light);
    }

    const solar = new THREE.Object3D();
    const sunLight = new THREE.PointLight(0xffffff, 3);

    const sunGeo = new THREE.SphereGeometry(10, 64, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      map: sunMap,
      emissiveMap: sunMap,
    });
    const sun = new THREE.Mesh(sunGeo, sunMaterial);
    sun.position.set(0, 0, 0);
    sun.add(solar);
    sun.add(sunLight);
    scene.add(sun);

    const earthGeo = new THREE.SphereGeometry(3, 32, 16);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: earthMap,
      emissiveMap: earthMap,
    });
    const earth = new THREE.Mesh(earthGeo, earthMaterial);
    solar.add(earth);
    earth.position.set(-50, 0, 0);

    const render = (time: DOMHighResTimeStamp) => {
      three.controls.update();
      solar.rotation.y = time * 0.5;
      earth.rotation.y = time;
      earth.getWorldPosition(position);
      three.controls.target = position;
    };

    three.addRenderCallback(render);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={threeWrapper}></div>
    </>
  );
};

export default Solar;
