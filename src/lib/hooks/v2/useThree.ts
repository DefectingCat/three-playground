import RUAThree, { defaultProps, ThreeProps } from 'lib/three';
import { useEffect, useRef } from 'react';

type Props = {
  renderFn: (three: RUAThree) => void;
} & ThreeProps;

const useThree = (props: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const three = useRef<RUAThree>();

  // Cleanup
  useEffect(() => {
    const threeProps = {
      ...defaultProps,
      canvas: ref.current,
    };
    three.current = new RUAThree(
      props ? { ...threeProps, ...props } : threeProps
    );

    props.renderFn(three.current);

    return () => {
      three.current?.clear();
    };
  }, []);

  return {
    three: three.current,
    ref,
  };
};

export default useThree;
export { THREE } from 'lib/three';
