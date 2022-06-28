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

export type ThreeProps = {
  rotateInversion?: boolean;
  antialias?: boolean;
  renderOnDemand?: boolean;
};

export const defaultProps = {
  rotateInversion: false,
  antialias: true,
  renderOnDemand: true,
};

class RUAThree {
  tracker = new ResourceTracker();

  scene = new SceneWithTracker(this.tracker);
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  constructor({ rotateInversion, antialias, renderOnDemand }: ThreeProps) {
    this.renderer = new THREE.WebGLRenderer({ antialias });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    // Set controls rotate inversion must be in constructor.
    if (rotateInversion) this.controls.rotateSpeed *= -1;
    this.controls.update();

    this.renderOnDemand = renderOnDemand ?? true;

    this.render = this.render.bind(this);
    this.requestRender = this.requestRender.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    if (this.renderOnDemand) {
      this.controls.addEventListener('change', this.requestRender);
      this.requestRender();
    } else {
      requestAnimationFrame(this.render);
    }

    window.addEventListener('resize', this.onWindowResize);

    process.env.NODE_ENV === 'development' && (this.tracker.debug = true);
  }

  private renderQueue: ((time: DOMHighResTimeStamp) => void)[] = [];
  private renderOnDemand = true;
  private renderRequested = false;

  private time: DOMHighResTimeStamp = 0;
  private render(time: DOMHighResTimeStamp) {
    this.renderRequested = false;
    this.time = time *= 0.001;
    this.renderer.render(this.scene, this.camera);
    this.renderQueue.map((cb) => cb(this.time));

    !this.renderOnDemand && requestAnimationFrame(this.render);
  }

  private requestRender() {
    if (this.renderRequested) return;
    this.renderRequested = true;
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
