import { Object3D } from 'three';

export abstract class Disposable {
  dispose() {}
}

class ResourceTracker<T extends Disposable> {
  resources = new Set<T | Object3D>();

  track(...object: (T | Object3D)[]) {
    object.forEach(this.resources.add, this.resources);

    console.log('track', object);
  }

  untrack(object: T | Object3D) {
    this.resources.delete(object);
  }

  dispose() {
    this.resources.forEach((resource) => {
      if (resource instanceof Object3D) {
        if (resource.parent) resource.parent.remove(resource);
      } else {
        resource.dispose();

        console.log('dispose', resource);
      }
    });
  }
}

export default ResourceTracker;
