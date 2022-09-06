import useThree, { THREE } from 'lib/hooks/useThree';
import MousePicker from 'lib/three/MousePicker';
import { useEffect, useRef } from 'react';
import { getCanvasRelativePosition } from 'utils';
import generateCubes from 'utils/generateCube';

const mousePicker = new MousePicker();

const MousePick = () => {
  const { three, threeWrapper } = useThree({
    renderOnDemand: false,
  });

  useEffect(() => {
    let pickPosition = {
      x: 0,
      y: 0,
    };
    let lastObject: THREE.Object3D | null = null;
    let lastColor: number | null = null;

    const setPickPosition = (e: MouseEvent) => {
      if (!threeWrapper.current) return;
      const canvas = threeWrapper.current.children[0];
      if (!(canvas instanceof HTMLCanvasElement)) return;
      const pos = getCanvasRelativePosition(e, canvas);
      pickPosition.x = (pos.x / canvas.width) * 2 - 1;
      pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
    };

    function clearPickPosition() {
      // 对于触屏，不像鼠标总是能有一个位置坐标，
      // 如果用户不在触摸屏幕，我们希望停止拾取操作。
      // 因此，我们选取一个特别的值，表明什么都没选中
      pickPosition = {
        x: -Infinity,
        y: -Infinity,
      };
    }

    function pickColor(time: DOMHighResTimeStamp) {
      if (lastObject && lastColor) {
        if (!(lastObject instanceof THREE.Mesh)) return;
        if (!mousePicker.checkMaterial(lastObject.material)) return;
        lastObject.material.emissive.setHex(lastColor);
        lastObject = null;
      }
      lastObject = mousePicker.pick(pickPosition, three.scene, three.camera);
      console.log(lastObject);
      if (!lastObject) return;
      if (!(lastObject instanceof THREE.Mesh)) return;
      if (!mousePicker.checkMaterial(lastObject.material)) return;
      lastColor = lastObject.material.emissive.getHex();
      lastObject.material.emissive.setHex(
        (time * 8) % 2 > 1 ? 0xffff00 : 0xff0000
      );
    }

    three.scene.background = new THREE.Color('#DEFEFF');
    three.camera.position.set(0, 0, 65);

    const cubes = generateCubes();
    three.controls.autoRotate = true;
    three.controls.autoRotateSpeed = 0.6;

    {
      const light = new THREE.AmbientLight(0xffffff, 0.6);
      three.scene.add(light);
    }

    three.scene.add(cubes);

    three.addRenderCallback((time) => {
      three.controls.update();
      pickColor(time);
    });

    threeWrapper.current?.addEventListener('mousemove', setPickPosition);
    threeWrapper.current?.addEventListener('mouseout', clearPickPosition);
    threeWrapper.current?.addEventListener('mouseleve', clearPickPosition);

    const wrapper = threeWrapper.current;
    return () => {
      wrapper?.removeEventListener('mousemove', setPickPosition);
      wrapper?.removeEventListener('mouseout', clearPickPosition);
      wrapper?.removeEventListener('mouseleve', clearPickPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={threeWrapper}></div>
    </>
  );
};

export default MousePick;
