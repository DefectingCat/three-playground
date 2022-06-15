import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ResourceTracker, { Disposable } from 'lib/three/ResourceTracker';

class SceneWithTracker extends THREE.Scene {
  constructor(private tracker: ResourceTracker<Disposable>) {
    super();
  }

  add(...object: THREE.Object3D<THREE.Event>[]): this {
    super.add(...object);
    this.tracker.track(...object);
    return this;
  }
}

class RUAThree {
  tracker = new ResourceTracker();

  scene = new SceneWithTracker(this.tracker);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  controls = new OrbitControls(this.camera, this.renderer.domElement);

  constructor() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls.update();

    // Callback needs to be bound to the correct 'this'.
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);

    window.addEventListener('resize', this.onWindowResize);

    process.env.NODE_ENV === 'development' && (this.tracker.debug = true);
  }

  private renderQueue: ((time: DOMHighResTimeStamp) => void)[] = [];

  private time: DOMHighResTimeStamp = 0;
  private render(time: DOMHighResTimeStamp) {
    this.time = time *= 0.001;

    this.renderer.render(this.scene, this.camera);

    this.renderQueue.map((cb) => cb(this.time));

    requestAnimationFrame(this.render);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.render(this.time);
  }

  addRenderCallback(cb: (time: DOMHighResTimeStamp) => void) {
    this.renderQueue.push(cb);
  }

  clear() {
    this.tracker.dispose();
    this.scene.clear();
  }
}

export default RUAThree;
export { THREE };
