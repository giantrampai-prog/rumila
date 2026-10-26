import * as T from 'three';
import type { Rect, UmrohWorld, WorldResources } from './types';

interface Person { x: number; z: number; angle: number; scale: number; phase: number; female: boolean; skin: T.Color }
interface BodyPart { mesh: T.InstancedMesh; position: T.Vector3; scale: T.Vector3; swing: number; color: 'skin' | 'cloth' | 'fixed'; femaleOnly?: boolean; maleOnly?: boolean }
const scratch = new T.Object3D();
const rotation = new T.Quaternion();
const yAxis = new T.Vector3(0, 1, 0);
const translation = new T.Vector3();
const SKINS = ['#b77e57', '#d2a583', '#926040', '#704932', '#d4b190', '#a66c48'];

function foldedCloth(height: number, top: number, bottom: number): T.BufferGeometry {
  const geometry = new T.CylinderGeometry(top, bottom, height, 40, 14, true);
  const p = geometry.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = p.getY(i);
    const angle = Math.atan2(z, x);
    const ripple = .012 * Math.cos(angle * 19 + y * .7) + .006 * Math.sin(angle * 9 - y * 2);
    p.setXYZ(i, x + Math.cos(angle) * ripple, y, (z + Math.sin(angle) * ripple) * .63);
  }
  geometry.computeVertexNormals(); return geometry;
}

/** Human proportions, cloth folds, articulated limbs; batched bodies keep crowds economical. */
export class Pilgrims {
  readonly group = new T.Group();
  private parts: BodyPart[] = [];
  private people: Person[];
  private spec: NonNullable<UmrohWorld['crowd']>;
  private elapsed = 0;
  private main = false;
  private mainPosition = new T.Vector3();
  private mainAngle = 0;
  private mainWalking = false;

  constructor(r: WorldResources, spec: NonNullable<UmrohWorld['crowd']>, main = false, female = false) {
    this.spec = spec; this.main = main;
    const count = main ? 1 : spec.count;
    const random = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    const area: Rect = spec.area ?? { minX: -35, maxX: 35, minZ: -25, maxZ: 25 };
    this.people = Array.from({ length: count }, (_, i) => ({
      x: area.minX + random(i + 3) * (area.maxX - area.minX), z: area.minZ + random(i + 16) * (area.maxZ - area.minZ),
      angle: random(i + 40) * Math.PI * 2, scale: .92 + random(i + 75) * .14, phase: random(i + 98) * Math.PI * 2,
      female: main ? female : random(i + 21) > .63, skin: new T.Color(SKINS[i % SKINS.length]),
    }));
    const skin = r.keep(new T.MeshStandardMaterial({ color: '#ffffff', roughness: .75 }));
    const cloth = r.keep(r.mat.fabric.clone()); cloth.color.set('#ffffff');
    const sandals = r.keep(new T.MeshStandardMaterial({ color: '#413a31', roughness: .84 }));
    const face = r.keep(new T.MeshStandardMaterial({ color: '#30231d', roughness: .9 }));
    const hair = r.keep(new T.MeshStandardMaterial({ color: '#24221f', roughness: 1 }));
    const add = (geo: T.BufferGeometry, mat: T.Material, position: [number, number, number], scale: [number, number, number], color: BodyPart['color'] = 'fixed', swing = 0, only?: 'female' | 'male') => {
      const mesh = new T.InstancedMesh(r.keep(geo), mat, count);
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage); mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.frustumCulled = false; this.group.add(mesh);
      this.parts.push({ mesh, position: new T.Vector3(...position), scale: new T.Vector3(...scale), swing, color, femaleOnly: only === 'female', maleOnly: only === 'male' });
    };
    const sphere = () => new T.SphereGeometry(1, 14, 10);
    // Head narrows towards the jaw; neck and ears retain ordinary adult proportions.
    add(sphere(), skin, [0, 1.60, 0], [.105, .145, .108], 'skin');
    add(new T.SphereGeometry(1, 16, 10, 0, Math.PI * 2, 0, Math.PI * .47), hair, [0, 1.607, -.008], [.108, .148, .112], 'fixed', 0, 'male');
    add(sphere(), skin, [0, 1.50, .032], [.083, .055, .075], 'skin');
    add(new T.CylinderGeometry(.052, .06, .10, 12), skin, [0, 1.43, 0], [1, 1, 1], 'skin');
    add(sphere(), skin, [0, 1.59, .108], [.026, .038, .04], 'skin');
    for (const side of [-1, 1]) {
      add(sphere(), skin, [side * .108, 1.60, 0], [.018, .034, .024], 'skin');
      add(sphere(), face, [side * .037, 1.636, .096], [.013, .007, .006]);
    }
    add(sphere(), skin, [0, 1.21, 0], [.225, .275, .12], 'skin', 0, 'male');
    add(foldedCloth(.78, .225, .255), cloth, [0, .66, 0], [1, 1, 1], 'cloth', 0, 'male');
    add(foldedCloth(.44, .245, .22), cloth, [0, 1.23, 0], [1, 1, 1], 'cloth', 0, 'male');
    // The upper wrap falls over the left shoulder and across the chest.
    add(sphere(), cloth, [-.18, 1.405, -.005], [.103, .073, .149], 'cloth', 0, 'male');
    add(foldedCloth(1.25, .23, .31), cloth, [0, .78, 0], [1, 1, 1], 'cloth', 0, 'female');
    add(sphere(), cloth, [0, 1.60, -.024], [.14, .19, .14], 'cloth', 0, 'female');
    add(foldedCloth(.38, .12, .24), cloth, [0, 1.40, -.03], [1, 1, 1], 'cloth', 0, 'female');
    // A face opening in front of the hood.
    add(sphere(), skin, [0, 1.595, .093], [.083, .112, .045], 'skin', 0, 'female');
    for (const side of [-1, 1]) {
      add(new T.CapsuleGeometry(.058, .23, 4, 10), skin, [side * .272, 1.25, 0], [1, 1, 1], 'skin', side, 'male');
      add(new T.CapsuleGeometry(.048, .22, 4, 10), skin, [side * .288, .98, .025], [1, 1, 1], 'skin', side * 1.5, 'male');
      add(new T.CapsuleGeometry(.07, .45, 4, 10), cloth, [side * .265, 1.11, 0], [1, 1, 1], 'cloth', side, 'female');
      add(sphere(), skin, [side * .285, .82, .035], [.045, .075, .025], 'skin', side * 1.5);
      add(new T.CapsuleGeometry(.065, .27, 4, 10), skin, [side * .105, .255, 0], [1, 1, 1], 'skin', -side * 1.8, 'male');
      add(sphere(), sandals, [side * .105, .055, .04], [.075, .045, .145], 'fixed', -side * 1.8);
    }
    this.update(0, false);
  }

  pose(position: T.Vector3, angle: number, walking: boolean, female: boolean): void {
    this.mainPosition.copy(position); this.mainAngle = angle; this.mainWalking = walking; this.people[0].female = female;
  }
  update(delta: number, animate = true, avoid?: T.Vector3): void {
    if (animate) this.elapsed += delta;
    const area = this.spec.area ?? { minX: -35, maxX: 35, minZ: -25, maxZ: 25 };
    const white = new T.Color('#f3f0e7'), black = new T.Color('#252830'), navy = new T.Color('#303d4b');
    this.people.forEach((p, i) => {
      let x = p.x, z = p.z, angle = p.angle;
      if (this.main) { x = this.mainPosition.x; z = this.mainPosition.z; angle = this.mainAngle; }
      else if (this.spec.kind === 'tawaf') {
        const radius = (this.spec.radius ?? 24) + (i % 9) * 1.35;
        angle = p.angle - this.elapsed * (.023 + (i % 3) * .002);
        x = Math.cos(angle) * radius; z = Math.sin(angle) * radius;
        angle = Math.PI - angle;
      } else if (this.spec.kind === 'sai') {
        const span = area.maxZ - area.minZ;
        const shift = ((p.z - area.minZ + this.elapsed * .85) % (span * 2));
        const outbound = shift < span;
        z = outbound ? area.minZ + shift : area.maxZ - (shift - span);
        angle = outbound ? 0 : Math.PI;
      } else {
        const span = area.maxX - area.minX;
        const shift = ((p.x - area.minX + this.elapsed * .52) % (span * 2));
        const outbound = shift < span;
        x = outbound ? area.minX + shift : area.maxX - (shift - span);
        angle = outbound ? Math.PI / 2 : -Math.PI / 2;
      }
      if (avoid && !this.main) {
        const distance = Math.hypot(x - avoid.x, z - avoid.z);
        if (distance < 1.1) { const a = distance < .001 ? p.angle : Math.atan2(z - avoid.z, x - avoid.x); x = avoid.x + Math.cos(a) * 1.1; z = avoid.z + Math.sin(a) * 1.1; }
      }
      const walking = animate && (!this.main || this.mainWalking);
      const gait = walking ? Math.sin(this.elapsed * 4.5 + p.phase) : 0;
      rotation.setFromAxisAngle(yAxis, angle);
      translation.set(x, 0, z);
      for (const part of this.parts) {
        const hidden = part.femaleOnly && !p.female || part.maleOnly && p.female;
        scratch.position.copy(part.position);
        const swing = gait * part.swing;
        scratch.position.z += swing * .06;
        scratch.position.y += Math.abs(swing) * .012;
        scratch.position.multiplyScalar(p.scale).applyQuaternion(rotation).add(translation);
        scratch.quaternion.copy(rotation);
        if (part.swing) scratch.rotateX(swing * .18);
        scratch.scale.copy(part.scale).multiplyScalar(hidden ? 0 : p.scale);
        scratch.updateMatrix(); part.mesh.setMatrixAt(i, scratch.matrix);
        if (part.color !== 'fixed') part.mesh.setColorAt(i, part.color === 'skin' ? p.skin : p.female ? i % 4 === 0 ? navy : black : white);
      }
    });
    for (const part of this.parts) { part.mesh.instanceMatrix.needsUpdate = true; if (part.mesh.instanceColor) part.mesh.instanceColor.needsUpdate = true; }
  }
  dispose(): void { this.parts.forEach((p) => p.mesh.dispose()); this.group.removeFromParent(); }
}
