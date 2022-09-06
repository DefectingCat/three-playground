import {
  Camera,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Raycaster,
  Scene,
} from 'three';

class MousePicker {
  raycaster = new Raycaster();

  pick(
    normalizePosition: { x: number; y: number },
    scene: Scene,
    camera: Camera
  ) {
    this.raycaster.setFromCamera(normalizePosition, camera);
    // Save closet object
    const intersectObjects = this.raycaster.intersectObjects(scene.children);
    return intersectObjects[0]?.object;
  }

  /**
   * Check material include emissive
   * @param material
   */
  checkMaterial(
    material:
      | MeshStandardMaterial
      | MeshToonMaterial
      | MeshPhongMaterial
      | MeshLambertMaterial
      | null
  ): material is MeshStandardMaterial {
    return (
      material instanceof MeshStandardMaterial ||
      material instanceof MeshToonMaterial ||
      material instanceof MeshPhongMaterial ||
      material instanceof MeshLambertMaterial
    );
  }
}

export default MousePicker;
