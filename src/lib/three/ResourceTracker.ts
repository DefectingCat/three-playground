import { Object3D } from 'three';

export abstract class Disposable {
  dispose() {}
}

class ResourceTracker<T extends Disposable> {
  resources = new Set<T | Object3D>();
  private debugMode = false;

  track(...object: (T | Object3D)[]) {
    object.forEach(this.resources.add, this.resources);
    if (this.debugMode)
      console.log('>>> Resource trakcer: add resource', object);
  }

  untrack(object: T | Object3D) {
    this.resources.delete(object);
    if (this.debugMode)
      console.log('>>> Resource trakcer: delete resource', object);
  }

  dispose() {
    this.resources.forEach((resource) => {
      if (resource instanceof Object3D) {
        if (resource.parent) resource.parent.remove(resource);
        if (this.debugMode)
          console.log('>>> Resource trakcer: remove', resource);
      } else {
        resource.dispose();
        if (this.debugMode)
          console.log('>>> Resource trakcer: dispose', resource);
      }
    });
  }

  set debug(enable: boolean) {
    this.debugMode = enable;
  }
  get debug() {
    return this.debugMode;
  }
}

export default ResourceTracker;
