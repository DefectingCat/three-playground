import useThree, { THREE } from 'lib/hooks/useThree';
import { GPUPicker } from 'lib/three/MousePicker';
import { useEffect } from 'react';
import { getCanvasRelativePosition } from 'utils';
import generateCubes from 'utils/generateCube';

const MousePick = () => {
  const { three, threeWrapper } = useThree({
    renderOnDemand: false,
    width: window.innerWidth / 2,
  });
  const { three: three2, threeWrapper: tw2 } = useThree({
    renderOnDemand: false,
    width: window.innerWidth / 2,
  });

  useEffect(() => {
    const { cubes, pickingCubes, idToObject } = generateCubes();
    const mousePicker = new GPUPicker(three.renderer, idToObject);
    const pickingScene = new THREE.Scene();
    pickingScene.background = new THREE.Color(0);

    three.scene.add(cubes);
    pickingScene.add(pickingCubes);

    let pickPosition = {
      x: -Infinity,
      y: -Infinity,
    };
    let lastObject: THREE.Object3D | null = null;
    let lastColor: number | null = null;

    const setPickPosition = (e: MouseEvent) => {
      if (!threeWrapper.current) return;
      const canvas = threeWrapper.current.children[0];
      if (!(canvas instanceof HTMLCanvasElement)) return;
      const pos = getCanvasRelativePosition(e, canvas);
      pickPosition.x = pos.x;
      pickPosition.y = pos.y;
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
      if (!(three.camera instanceof THREE.PerspectiveCamera)) return;
      if (lastObject && lastColor != null) {
        if (!(lastObject instanceof THREE.Mesh)) return;
        if (!mousePicker.checkMaterial(lastObject.material)) return;
        lastObject.material.emissive.setHex(lastColor);
        lastObject = null;
        lastColor = null;
      }
      lastObject = mousePicker.pick(pickPosition, pickingScene, three.camera);
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
    three2.camera.position.set(0, 0, 65);

    // three.controls.autoRotate = true;
    // three.controls.autoRotateSpeed = 0.6;

    {
      const light = new THREE.AmbientLight(0xffffff, 0.6);
      three.scene.add(light);
    }

    three.addRenderCallback((time) => {
      three.renderer.render(three.scene, three.camera);
      three.controls.update();
      pickColor(time);
    });
    three2.addRenderCallback((time) => {
      three2.renderer.render(pickingScene, three2.camera);
      three2.controls.update();
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
    <div
      style={{
        display: 'flex',
      }}
    >
      <div ref={threeWrapper}></div>
      <div ref={tw2}></div>
    </div>
  );
};

export default MousePick;
