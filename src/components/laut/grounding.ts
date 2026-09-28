import * as T from 'three';

/** Top of the deck boards, in the boat's local coordinate system. */
export const BOAT_DECK_Y = 0.787;
export const DIVER_STANDING_ROTATION = new T.Quaternion().setFromEuler(new T.Euler(0, -Math.PI / 2, Math.PI / 2));

/** The diver's model points along +X when swimming; its sole is the lowest X. */
export function modelSole(root: T.Object3D): T.Vector3 {
  root.updateMatrixWorld(true);
  root.traverse(o => { if (o instanceof T.SkinnedMesh) o.skeleton.update(); });
  return new T.Vector3(new T.Box3().setFromObject(root, true).min.x, 0, 0);
}

/** Keep the sole on a moving deck instead of assuming a fixed world-space hip height. */
export function deckPose(boat: T.Object3D, sole: T.Vector3, scale: T.Vector3, deckPosition: T.Vector3) {
  boat.updateWorldMatrix(true, false);
  const rotation = boat.getWorldQuaternion(new T.Quaternion()).multiply(DIVER_STANDING_ROTATION);
  const position = boat.localToWorld(deckPosition.clone())
    .sub(sole.clone().multiply(scale).applyQuaternion(rotation));
  return { position, rotation };
}
