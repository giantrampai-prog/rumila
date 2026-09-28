import { describe, expect, it } from 'vitest';
import * as T from 'three';
import { BOAT_DECK_Y, deckPose, modelSole } from '../grounding';

describe('Agam deck contact', () => {
  it('keeps both soles on the deck through heave, pitch and roll', () => {
    const boat = new T.Group(), diver = new T.Group();
    const sole = new T.Vector3(-1.27, 0, 0);
    diver.scale.setScalar(1.1);
    for (let frame = 0; frame < 24; frame++) {
      boat.position.set(3, Math.sin(frame) * 0.05, -2);
      boat.rotation.set(Math.sin(frame * 0.7) * 0.015, 0.2, Math.cos(frame) * 0.02);
      const pose = deckPose(boat, sole, diver.scale, new T.Vector3(2, BOAT_DECK_Y, 0.4));
      diver.position.copy(pose.position); diver.quaternion.copy(pose.rotation);
      diver.updateMatrixWorld(true);
      for (const footZ of [-0.12, 0.12]) {
        const contact = boat.worldToLocal(diver.localToWorld(sole.clone().add(new T.Vector3(0, 0, footZ))));
        expect(contact.y).toBeCloseTo(BOAT_DECK_Y, 10);
      }
    }
  });

  it('measures the transformed model instead of assuming its hip height', () => {
    const model = new T.Group();
    model.add(new T.Mesh(new T.BoxGeometry(1, 2, 1)));
    model.rotation.z = -Math.PI / 2; model.scale.setScalar(1.4); model.position.x = -0.6;
    expect(modelSole(model).x).toBeCloseTo(-2, 10);
  });
});
