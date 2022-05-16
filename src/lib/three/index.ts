import * as THREE from 'three';


class RUAThree {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  render = new THREE.WebGLRenderer({});

}

export default RUAThree;
