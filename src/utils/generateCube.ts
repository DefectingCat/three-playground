import { THREE } from 'lib/hooks/useThree';

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

  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  for (let i = 0; i < num; ++i) {
    const material = new THREE.MeshToonMaterial({
      color: randomColor(),
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
    cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
    cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));

    group.add(cube);
  }

  return group;
}

export default generateCubes;
