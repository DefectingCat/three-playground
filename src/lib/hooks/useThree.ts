import RUAThree from 'lib/three';
import { useEffect, useRef } from 'react';

const useThree = () => {
  const three = useRef(new RUAThree());

  const threeWrapper = useRef<HTMLDivElement>(null);

  // Add render's canvas to the DOM.
  useEffect(() => {
    threeWrapper.current?.appendChild(three.current.renderer.domElement);
  }, []);

  // Cleanup
  useEffect(() => {
    const s = three.current;

    return () => {
      s.scene.clear();
    };
  }, []);

  return {
    three: three.current,
    threeWrapper,
    RUAThree,
  };
};

export default useThree;
