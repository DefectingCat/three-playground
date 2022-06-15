import RUAThree, { defaultProps, ThreeProps } from 'lib/three';
import { useEffect, useRef } from 'react';

const useThree = (props?: ThreeProps) => {
  const { rotateInversion } = props ? props : defaultProps;
  const three = useRef(
    new RUAThree({
      rotateInversion,
    })
  );

  const threeWrapper = useRef<HTMLDivElement>(null);

  // Add render's canvas to the DOM.
  useEffect(() => {
    threeWrapper.current?.appendChild(three.current.renderer.domElement);
  }, []);

  // Cleanup
  useEffect(() => {
    const s = three.current;

    return () => {
      s.clear();
    };
  }, []);

  return {
    three: three.current,
    threeWrapper,
  };
};

export default useThree;
export { THREE } from 'lib/three';
