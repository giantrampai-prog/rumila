import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Position, WorldResources } from './types';

export type Attire = 'ihram' | 'travel';
type Bone = 'body' | 'head' | 'leftUpperArm' | 'rightUpperArm' | 'leftForearm' | 'rightForearm' | 'leftThigh' | 'rightThigh' | 'leftCalf' | 'rightCalf' | 'leftFoot' | 'rightFoot';
type ColorSlot = 'skin' | 'shirt' | 'trousers' | 'dress' | 'scarf' | 'hair' | 'white' | 'fixed';
interface HumanPart {
  mesh: T.InstancedMesh; bone: Bone; color: ColorSlot; female?: boolean; attire?: Attire;
  transforms: Float32Array; colors?: Float32Array; visible: Uint8Array;
}
export interface HumanAppearance { female: boolean; skin: T.Color; shirt: T.Color; trousers: T.Color; dress: T.Color; scarf: T.Color; hair: T.Color }
export interface HumanPose { position: T.Vector3; angle: number; scale: number; gait: number; walking: boolean; seated?: boolean; driving?: boolean; headTurn?: number;
  /** Optional shoulder rotation per arm (negative lifts forward), e.g. staff gesturing. */
  arms?: [number, number]; forearms?: [number, number] }
interface Joint { position: T.Vector3; rotation: T.Quaternion }
const bones: Bone[] = ['body', 'head', 'leftUpperArm', 'rightUpperArm', 'leftForearm', 'rightForearm', 'leftThigh', 'rightThigh', 'leftCalf', 'rightCalf', 'leftFoot', 'rightFoot'];
const axisX = new T.Vector3(1, 0, 0), axisY = new T.Vector3(0, 1, 0);
const WHITE = new T.Color('#f1eee4');
const SKINS = ['#bd8866', '#dcaf8d', '#956549', '#724f39', '#cda888', '#ab7857'];
const SHIRTS = ['#637fa0', '#b9aa8f', '#787b65', '#854f4d', '#526779', '#b7b0a0', '#6d6783', '#647f77'];
const TROUSERS = ['#474d55', '#726958', '#323e4a', '#5c615e'];
const DRESSES = ['#29343d', '#514952', '#3f5951', '#63534a', '#40485d'];
const SCARVES = ['#a89985', '#667a85', '#737361', '#82666e', '#d0c5b0', '#555f70'];
const HAIR = ['#27231f', '#352b22', '#55504a', '#252526', '#5a4636'];
export function humanAppearance(index: number, female: boolean): HumanAppearance {
  return { female, skin: new T.Color(SKINS[index % SKINS.length]), shirt: new T.Color(SHIRTS[index % SHIRTS.length]), trousers: new T.Color(TROUSERS[index % TROUSERS.length]), dress: new T.Color(DRESSES[index % DRESSES.length]), scarf: new T.Color(SCARVES[index % SCARVES.length]), hair: new T.Color(HAIR[index % HAIR.length]) };
}

function transformed(geometry: T.BufferGeometry, position: Position, scale: Position = [1, 1, 1], rotation = 0): T.BufferGeometry {
  geometry.scale(...scale); if (rotation) geometry.rotateZ(rotation); geometry.translate(...position); return geometry;
}
function ellipsoid(position: Position, scale: Position, segments = 12): T.BufferGeometry {
  return transformed(new T.SphereGeometry(1, segments, Math.max(5, Math.round(segments * .55))), position, scale);
}
function combine(geometries: T.BufferGeometry[]): T.BufferGeometry {
  const result = mergeGeometries(geometries)!; geometries.forEach((g) => g.dispose()); return result;
}
/** Elliptical cloth with a tailored silhouette and shallow vertical folds. */
function garment(height: number, top: number, waist: number, hem: number, depth: number, y: number, folds = 13): T.BufferGeometry {
  const geometry = new T.CylinderGeometry(1, 1, height, 24, 8, false);
  const p = geometry.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), py = p.getY(i), angle = Math.atan2(z, x), t = .5 - py / height;
    const radius = t < .55 ? T.MathUtils.lerp(top, waist, t / .55) : T.MathUtils.lerp(waist, hem, (t - .55) / .45);
    const ripple = .002 * Math.cos(angle * Math.min(folds, 7) + t * 2) + .001 * Math.cos(angle * 5 - t * 5);
    p.setXYZ(i, x * (radius + ripple), py + y, z * (radius * depth + ripple));
  }
  geometry.computeVertexNormals(); return geometry;
}
function taperedLimb(top: number, bottom: number, length: number): T.BufferGeometry {
  return transformed(new T.CylinderGeometry(top, bottom, length, 10, 2), [0, -length / 2, 0]);
}
function headSkin(): T.BufferGeometry {
  const head = new T.SphereGeometry(1, 20, 14), p = head.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), jaw = y < -.18 ? 1 + (y + .18) * .23 : 1;
    p.setXYZ(i, p.getX(i) * .100 * jaw, y * .137, p.getZ(i) * .103 + (y < -.3 ? .008 : 0));
  }
  head.computeVertexNormals();
  const items = [head,
    ellipsoid([0, -.055, .079], [.066, .063, .037], 10), // jaw and chin
    ellipsoid([0, .003, .105], [.014, .035, .025], 8), // nasal bridge
    ellipsoid([0, -.021, .125], [.020, .015, .019], 8),
    ellipsoid([0, -.15, -.008], [.047, .072, .048], 10), // neck
  ];
  for (const side of [-1, 1]) {
    items.push(ellipsoid([side * .100, -.006, -.005], [.016, .031, .020], 10));
    items.push(ellipsoid([side * .045, -.026, .078], [.039, .030, .030], 8));
  }
  return combine(items);
}
function hairCap(): T.BufferGeometry {
  const geometry = new T.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI * .58);
  const p = geometry.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const frontHairline = z > .2 ? .063 + .010 * Math.sin(x * 3) : -.04;
    p.setXYZ(i, x * .104, Math.max(frontHairline, y * .143 + .006), z * .108 - .002);
  }
  geometry.computeVertexNormals(); return geometry;
}
/** Continuous oval opening: no discarded triangles or jagged edge across the face. */
function hood(): T.BufferGeometry {
  const positions: number[] = [], uv: number[] = [], indices: number[] = [];
  const rings = 14, sides = 28;
  for (let row = 0; row <= rings; row++) {
    const theta = .82 + (Math.PI - .82) * row / rings;
    for (let col = 0; col <= sides; col++) {
      const phi = col / sides * Math.PI * 2;
      positions.push(.126 * Math.sin(theta) * Math.cos(phi), .165 * Math.sin(theta) * Math.sin(phi) + .005, .138 * Math.cos(theta) - .019);
      uv.push(col / sides, row / rings);
      if (row < rings && col < sides) { const i = row * (sides + 1) + col; indices.push(i, i + sides + 1, i + 1, i + 1, i + sides + 1, i + sides + 2); }
    }
  }
  const geometry = new T.BufferGeometry(); geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}
/** Drapes over the shoulders and chest with clearance above the dress. */
function scarfDrape(): T.BufferGeometry {
  const profile = [[1.51, .112], [1.46, .15], [1.41, .229], [1.36, .253], [1.30, .259], [1.24, .254], [1.18, .243]];
  const geometry = new T.LatheGeometry(profile.slice().reverse().map(([y, radius]) => new T.Vector2(radius, y)), 32);
  const p = geometry.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), fold = .002 * Math.sin(Math.atan2(z, x) * 6 + y * 4);
    p.setXYZ(i, x, y, z * .76 + Math.sign(z) * fold);
  }
  geometry.computeVertexNormals(); return geometry;
}

/** Geometry is shared by the entire crowd. Animation changes joint transforms, not vertices. */
export class HumanBatch {
  readonly group = new T.Group();
  private parts: HumanPart[] = [];
  private joints = Object.fromEntries(bones.map((bone) => [bone, { position: new T.Vector3(), rotation: new T.Quaternion() }])) as Record<Bone, Joint>;
  private transform = new T.Object3D();
  private rootRotation = new T.Quaternion();
  private visible: Uint8Array;
  constructor(r: WorldResources, count: number, seated = false) {
    this.visible = new Uint8Array(count);
    const material = (options: T.MeshStandardMaterialParameters) => r.keep(new T.MeshStandardMaterial(options));
    const skin = material({ color: '#ffffff', roughness: .67 });
    const fabric = r.keep(r.mat.fabric.clone()); fabric.color.set('#ffffff');
    const hair = material({ color: '#ffffff', roughness: .96 });
    const eyes = material({ color: '#c1b6a2', roughness: .68 });
    const dark = material({ color: '#272320', roughness: .74 });
    const lips = material({ color: '#74534b', roughness: .8 });
    const shoe = material({ color: '#302d2a', roughness: .83 });
    const add = (geometry: T.BufferGeometry, mat: T.Material, bone: Bone, color: ColorSlot = 'fixed', female?: boolean, attire?: Attire) => {
      if (seated && attire === 'ihram') { geometry.dispose(); return; }
      const mesh = new T.InstancedMesh(r.keep(geometry), mat, count);
      mesh.name = `human-${bone}-${color}${female === undefined ? '' : female ? '-female' : '-male'}${attire ? '-' + attire : ''}`;
      mesh.instanceMatrix.setUsage(seated ? T.StaticDrawUsage : T.DynamicDrawUsage); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
      const colors = color === 'fixed' ? undefined : new Float32Array(count * 3);
      if (colors) mesh.instanceColor = new T.InstancedBufferAttribute(new Float32Array(count * 3), 3).setUsage(T.DynamicDrawUsage);
      mesh.count = 0;
      this.group.add(mesh); this.parts.push({ mesh, bone, color, female, attire, transforms: new Float32Array(count * 16), colors, visible: new Uint8Array(count) });
    };
    add(headSkin(), skin, 'head', 'skin');
    add(hairCap(), hair, 'head', 'hair', false);
    add(hood(), fabric, 'head', 'scarf', true);
    const eyeWhite: T.BufferGeometry[] = [], iris: T.BufferGeometry[] = [], brows: T.BufferGeometry[] = [];
    for (const side of [-1, 1]) {
      eyeWhite.push(ellipsoid([side * .038, .025, .096], [.014, .0042, .0045], 10));
      iris.push(ellipsoid([side * .038, .025, .101], [.0064, .0042, .002], 8));
      brows.push(transformed(new T.CapsuleGeometry(.0031, .026, 2, 5), [side * .038, .045, .094], [1, 1, 1], side * 1.41));
    }
    add(combine(eyeWhite), eyes, 'head'); add(combine(iris), dark, 'head'); add(combine(brows), hair, 'head', 'hair');
    add(combine([ellipsoid([0, -.057, .116], [.023, .0028, .0025], 10), ellipsoid([0, -.063, .115], [.020, .0028, .003], 10)]), lips, 'head');
    // A broad chest, narrowing waist and overlapping wrap replace the old cylinder body.
    add(garment(.49, .218, .184, .185, .57, 1.177), fabric, 'body', 'shirt', false, 'travel');
    add(combine([
      transformed(new T.BoxGeometry(.028, .42, .006), [0, 1.17, .113]),
      transformed(new T.BoxGeometry(.075, .045, .012), [-.045, 1.407, .072], [1, 1, 1], -.5),
      transformed(new T.BoxGeometry(.075, .045, .012), [.045, 1.407, .072], [1, 1, 1], .5),
      transformed(new T.BoxGeometry(.069, .082, .007), [-.115, 1.245, .116]),
    ]), fabric, 'body', 'shirt', false, 'travel');
    add(transformed(new T.CylinderGeometry(.184, .19, .13, 16), [0, .896, 0], [1, 1, .62]), fabric, 'body', 'trousers', false, 'travel');
    add(garment(.47, .22, .195, .204, .58, 1.175, 15), fabric, 'body', 'white', false, 'ihram');
    add(combine([
      garment(.73, .194, .225, .242, .65, .572, 17),
      transformed(new T.BoxGeometry(.028, .60, .013, 1, 6), [.125, .60, .139], [1, 1, 1], -.11),
      ellipsoid([-.17, 1.397, -.005], [.083, .045, .137], 12),
    ]), fabric, 'body', 'white', false, 'ihram');
    add(seated ? garment(.49, .214, .190, .22, .63, 1.145) : garment(1.27, .214, .203, .295, .63, .755, 15), fabric, 'body', 'dress', true);
    add(scarfDrape(), fabric, 'body', 'scarf', true);
    for (const side of ['left', 'right'] as const) {
      const upper = `${side}UpperArm` as Bone, fore = `${side}Forearm` as Bone;
      add(combine([taperedLimb(.063, .043, .275), ellipsoid([0, -.272, 0], [.044, .046, .044], 10)]), skin, upper, 'skin', false, 'ihram');
      add(combine([taperedLimb(.069, .056, .19), ellipsoid([0, -.013, 0], [.069, .065, .069], 10)]), fabric, upper, 'shirt', false, 'travel');
      add(taperedLimb(.049, .042, .089).translate(0, -.186, 0), skin, upper, 'skin', false, 'travel');
      add(combine([taperedLimb(.074, .058, .275), ellipsoid([0, -.012, 0], [.074, .060, .074], 10)]), fabric, upper, 'dress', true);
      add(taperedLimb(.045, .028, .247), skin, fore, 'skin', false);
      add(taperedLimb(.059, .041, .24), fabric, fore, 'dress', true);
      // Palm, joined fingers and thumb retain the hand silhouette without hundreds of finger meshes.
      add(combine([
        ellipsoid([0, -.281, .007], [.033, .047, .020], 10),
        ellipsoid([0, -.317, .010], [.027, .026, .017], 10),
        ellipsoid([side === 'left' ? .026 : -.026, -.274, .023], [.014, .027, .014], 8),
      ]), skin, fore, 'skin');
      add(combine([taperedLimb(.094, .068, .415), ellipsoid([0, -.415, 0], [.068, .068, .068], 10)]), fabric, `${side}Thigh`, 'trousers', false, 'travel');
      add(taperedLimb(.071, .048, .413), fabric, `${side}Calf`, 'trousers', false, 'travel');
      add(taperedLimb(.066, .039, .405), skin, `${side}Calf`, 'skin', false, 'ihram');
      add(combine([ellipsoid([0, -.015, .045], [.059, .041, .125], 12), ellipsoid([0, -.006, -.040], [.052, .050, .058], 10)]), shoe, `${side}Foot`);
      add(ellipsoid([0, .015, .043], [.049, .030, .091], 10), skin, `${side}Foot`, 'skin', false, 'ihram');
      add(transformed(new T.BoxGeometry(.104, .018, .035), [0, .042, .067]), shoe, `${side}Foot`, 'fixed', false, 'ihram');
    }
    // The seated shape uses bent, joined legs; a draped skirt runs across the lap and down the knees.
    if (seated) {
      add(ellipsoid([0, .875, .21], [.247, .096, .27], 16), fabric, 'body', 'dress', true);
      add(garment(.40, .245, .23, .24, .42, .605).translate(0, 0, .42), fabric, 'body', 'dress', true);
    }
  }

  private setJoint(bone: Bone, x: number, y: number, z: number, rotationX = 0): void {
    this.joints[bone].position.set(x, y, z); this.joints[bone].rotation.setFromAxisAngle(axisX, rotationX);
  }
  private child(bone: Bone, parent: Bone, length: number, rotationX: number): void {
    const joint = this.joints[bone], from = this.joints[parent];
    joint.position.set(0, -length, 0).applyQuaternion(from.rotation).add(from.position);
    joint.rotation.setFromAxisAngle(axisX, rotationX);
  }
  pose(index: number, appearance: HumanAppearance, pose: HumanPose, attire: Attire): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.visible.length) return;
    this.visible[index] = 1;
    const bob = pose.walking && !pose.seated ? Math.cos(pose.gait * 2) * .006 : 0;
    this.setJoint('body', 0, bob, 0); this.setJoint('head', 0, 1.605 + bob, 0);
    this.joints.head.rotation.setFromAxisAngle(axisY, pose.headTurn ?? 0);
    for (const [side, sign] of [['left', -1], ['right', 1]] as const) {
      const stride = pose.walking ? Math.sin(pose.gait) * sign : 0;
      const custom = pose.arms?.[side === 'left' ? 0 : 1];
      const arm = custom ?? (pose.driving ? -.60 : pose.seated ? -.10 : stride * .24);
      this.setJoint(`${side}UpperArm`, sign * .228, 1.375 + bob, -.005, arm);
      const fore = pose.forearms?.[side === 'left' ? 0 : 1];
      this.child(`${side}Forearm`, `${side}UpperArm`, .275, fore ?? (pose.driving ? -2.35 : pose.seated ? -1.24 : arm - .10 - Math.max(0, stride) * .15));
      const leg = pose.driving ? -Math.PI / 2 - .50 : pose.seated ? -Math.PI / 2 + .16 : -stride * .30;
      this.setJoint(`${side}Thigh`, sign * .102, .90 + bob, 0, leg);
      const knee = pose.seated ? .02 : leg + Math.max(0, -stride) * .40;
      this.child(`${side}Calf`, `${side}Thigh`, .415, knee);
      this.child(`${side}Foot`, `${side}Calf`, .413, pose.seated ? 0 : Math.max(-.16, leg * .32));
    }
    // Seat coordinates describe the top of the cushion, rather than the floor.
    const seatOffset = pose.seated ? -.90 : 0;
    this.rootRotation.setFromAxisAngle(axisY, pose.angle);
    for (const part of this.parts) {
      const hidden = part.female !== undefined && part.female !== appearance.female || part.attire !== undefined && part.attire !== attire;
      part.visible[index] = hidden ? 0 : 1;
      if (hidden) continue;
      const joint = this.joints[part.bone], transform = this.transform;
      transform.position.copy(joint.position); transform.position.y += seatOffset;
      transform.position.multiplyScalar(pose.scale).applyQuaternion(this.rootRotation).add(pose.position);
      transform.quaternion.copy(this.rootRotation).multiply(joint.rotation);
      transform.scale.setScalar(pose.scale); transform.updateMatrix(); transform.matrix.toArray(part.transforms, index * 16);
      if (part.colors && part.color !== 'fixed') (part.color === 'white' ? WHITE : appearance[part.color]).toArray(part.colors, index * 3);
    }
  }
  flush(): void {
    for (const part of this.parts) {
      const matrices = part.mesh.instanceMatrix.array, colors = part.mesh.instanceColor?.array;
      let packed = 0;
      for (let index = 0; index < this.visible.length; index++) {
        if (!this.visible[index] || !part.visible[index]) continue;
        // Source slots stay stable when the compact GPU slots change between frames.
        for (let component = 0; component < 16; component++) matrices[packed * 16 + component] = part.transforms[index * 16 + component];
        if (colors && part.colors) for (let component = 0; component < 3; component++) colors[packed * 3 + component] = part.colors[index * 3 + component];
        packed++;
      }
      part.mesh.count = packed; part.mesh.visible = packed > 0;
      part.mesh.instanceMatrix.needsUpdate = true;
      if (part.mesh.instanceColor) part.mesh.instanceColor.needsUpdate = true;
    }
  }
  /** Keep the fallback only until the corresponding textured character is ready. */
  hide(index: number): void {
    if (Number.isInteger(index) && index >= 0 && index < this.visible.length) this.visible[index] = 0;
  }
  dispose(): void { this.parts.forEach((part) => part.mesh.dispose()); this.group.removeFromParent(); }
}
