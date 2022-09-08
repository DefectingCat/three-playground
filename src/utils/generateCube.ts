import { THREE } from 'lib/hooks/useThree';
import frame from 'assets/images/mouse-picker/frame.png';

const loader = new THREE.TextureLoader();
const texture = loader.load(frame);

function rand(min: number, max?: number) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}

function randomColor() {
  return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}

function generateCubes(num = 100, boxWidth = 1, boxHeight = 1, boxDepth = 1) {
  const group = new THREE.Group();
  const pickingGroup = new THREE.Group();

  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  for (let i = 0; i < num; ++i) {
    const id = i + 1;
    const material = new THREE.MeshStandardMaterial({
      color: randomColor(),
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.1,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
    cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
    cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));

    group.add(cube);

    const pickingMaterial = new THREE.MeshStandardMaterial({
      emissive: new THREE.Color(id),
      color: new THREE.Color(0, 0, 0),
      // specular: new THREE.Color(0, 0, 0),
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
      blending: THREE.NoBlending,
    });
    const pickingCube = new THREE.Mesh(geometry, pickingMaterial);
    pickingCube.position.copy(cube.position);
    pickingCube.rotation.copy(cube.rotation);
    pickingCube.scale.copy(cube.scale);
    pickingGroup.add(pickingCube);
  }

  return {
    cubes: group,
    pickingCubes: pickingGroup,
  };
}

export default generateCubes;
