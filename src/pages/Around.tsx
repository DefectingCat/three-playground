import useThree, { THREE } from 'lib/hooks/useThree';
import { useEffect } from 'react';

const Around = () => {
  const { three, threeWrapper } = useThree({
    renderOnDemand: false,
  });

  useEffect(() => {
    {
      const skyColor = '#fff'; // light blue
      const intensity = 0.6;
      const light = new THREE.HemisphereLight(skyColor, undefined, intensity);
      three.scene.add(light);
    }

    {
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshStandardMaterial({
        color: '#7e7e7e',
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeometry, material);
      plane.rotateX(Math.PI / 2);
      plane.receiveShadow = true;
      three.scene.add(plane);
    }

    const material = new THREE.MeshPhongMaterial({
      color: '#4d4d4d',
      specular: '#fdfdfd',
      emissive: 'rgb(0,0,0)',
    });
    const target = new THREE.Object3D();
    {
      const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
      const sphere = new THREE.Mesh(sphereGeo, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(0, 2, 0);
      three.scene.add(sphere);
    }

    {
      const sphereGeo = new THREE.SphereGeometry(0.5, 32, 16);
      const sphere = new THREE.Mesh(sphereGeo, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(-2, 0, 0);

      target.position.set(0, 2, 0);
      target.add(sphere);
      three.scene.add(target);
    }

    const light = new THREE.SpotLight('rgb(255,255,255)', 1, 0, 0.3);
    light.position.set(7.822, 7.432, 1.905);
    // three.scene.add(new THREE.SpotLightHelper(light));
    light.castShadow = true;
    three.scene.add(light);

    three.camera.position.set(0, 8, 18);
    three.controls.maxPolarAngle = Math.PI / 2;

    const render = (time: DOMHighResTimeStamp) => {
      three.controls.update();
      target.rotation.y = time;
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

export default Around;
