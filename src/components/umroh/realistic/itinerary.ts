import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Position, Rect, UmrohWorld, WorldResources } from './types';
import { createSeatedPassengers, StandingPeople } from './pilgrims';
import { createGarudaAircraft } from './aircraft';

/** Original, human-scale travel environments. Operator names are plain text, not copied logos. */
export interface Kit { r: WorldResources; geometries: Map<string, T.BufferGeometry>; materials: Map<string, T.MeshStandardMaterial> }
type TaxiKind = 'taxi' | 'uber';
const UP = new T.Vector3(0, 1, 0);

export function kit(r: WorldResources): Kit { return { r, geometries: new Map(), materials: new Map() }; }
export function color(k: Kit, name: string, value: string, options: T.MeshStandardMaterialParameters = {}): T.MeshStandardMaterial {
  let result = k.materials.get(name);
  if (!result) { result = k.r.keep(new T.MeshStandardMaterial({ color: value, roughness: 0.72, ...options })); k.materials.set(name, result); }
  return result;
}
export function geo(k: Kit, key: string, make: () => T.BufferGeometry): T.BufferGeometry {
  let result = k.geometries.get(key);
  if (!result) { result = k.r.keep(make()); k.geometries.set(key, result); }
  return result;
}
export function beam(k: Kit, parent: T.Object3D, a: Position, b: Position, radius: number, material = k.r.mat.metal): void {
  const from = new T.Vector3(...a), to = new T.Vector3(...b), delta = to.clone().sub(from);
  const object = k.r.mesh(parent, geo(k, 'unit-rod', () => new T.CylinderGeometry(1, 1, 1, 8)), material);
  object.position.copy(from).add(to).multiplyScalar(0.5);
  object.scale.set(radius, delta.length(), radius);
  object.quaternion.setFromUnitVectors(UP, delta.normalize());
}
export function textPlate(k: Kit, parent: T.Object3D, text: string, at: Position, width: number, ink = '#ffffff', background = 'transparent'): T.Mesh {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tidak dapat membuat papan perjalanan.');
  if (background !== 'transparent') { ctx.fillStyle = background; ctx.fillRect(0, 0, 1024, 192); }
  ctx.fillStyle = ink; ctx.font = '600 106px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 512, 103, 980);
  const map = k.r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace;
  const material = k.r.keep(new T.MeshStandardMaterial({ map, transparent: background === 'transparent', side: T.DoubleSide, depthWrite: background !== 'transparent', roughness: 0.65 }));
  material.userData.keepUV = true;
  const object = k.r.mesh(parent, geo(k, 'text-plate', () => new T.PlaneGeometry(1, 192 / 1024)), material, at);
  object.scale.setScalar(width); object.castShadow = false;
  return object;
}
export function palm(k: Kit, parent: T.Object3D, x: number, z: number, height = 7): void {
  k.r.cylinder(parent, 0.16, 0.31, height, [x, height / 2, z], k.r.mat.wood, 10);
  const leaf = color(k, 'leaf', '#3c6747', { side: T.DoubleSide, roughness: 0.95 });
  for (let index = 0; index < 9; index += 1) {
    const object = k.r.mesh(parent, geo(k, 'palm-frond', () => {
      const points: number[] = [], indices: number[] = [];
      for (let i = 0; i <= 10; i += 1) {
        const t = i / 10, width = Math.sin(t * Math.PI) * 0.42, y = Math.sin(t * Math.PI) * 0.6 - t * t * 0.8;
        points.push(-width, y, t * 3.7, 0, y + 0.1, t * 3.7, width, y, t * 3.7);
        if (i < 10) { const j = i * 3; indices.push(j, j + 3, j + 1, j + 1, j + 3, j + 4, j + 1, j + 4, j + 2, j + 2, j + 4, j + 5); }
      }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(points, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
    }), leaf, [x, height, z]);
    object.rotation.y = index / 9 * Math.PI * 2; object.rotation.x = index % 2 ? -0.12 : 0.15;
  }
}
export function luggage(k: Kit, parent: T.Object3D, at: Position, size = 1, material = k.r.mat.green): void {
  const bag = new T.Group(); bag.position.set(...at); bag.scale.setScalar(size);
  k.r.box(bag, [0.47, 0.68, 0.29], [0, 0.4, 0], material);
  for (const x of [-0.15, -0.05, 0.05, 0.15]) k.r.box(bag, [0.018, 0.58, 0.02], [x, 0.4, 0.155], k.r.mat.darkStone);
  for (const x of [-0.18, 0.18]) k.r.sphere(bag, [0.045, 0.045, 0.045], [x, 0.055, 0], k.r.mat.black);
  for (const x of [-0.1, 0.1]) k.r.cylinder(bag, 0.012, 0.012, 0.35, [x, 0.86, 0], k.r.mat.metal, 6);
  k.r.box(bag, [0.23, 0.04, 0.04], [0, 1.04, 0], k.r.mat.black); parent.add(bag);
}
export function seat(k: Kit, parent: T.Object3D, x: number, z: number, upholstery: T.Material, facing = 0): void {
  const group = new T.Group(); group.position.set(x, 0, z); group.rotation.y = facing;
  k.r.box(group, [0.47, 0.12, 0.5], [0, 0.5, 0], upholstery);
  const back = k.r.box(group, [0.48, 0.73, 0.12], [0, 0.93, 0.25], upholstery); back.rotation.x = -0.08;
  k.r.sphere(group, [0.23, 0.13, 0.065], [0, 1.3, 0.28], upholstery);
  k.r.box(group, [0.08, 0.39, 0.09], [0, 0.23, 0], k.r.mat.metal);
  for (const dx of [-0.27, 0.27]) k.r.box(group, [0.06, 0.055, 0.43], [dx, 0.72, 0], k.r.mat.darkStone);
  parent.add(group);
}
export function bench(k: Kit, parent: T.Object3D, x: number, z: number, count = 4): void {
  const fabric = color(k, 'terminal-seat', '#3a454b');
  for (let index = 0; index < count; index += 1) seat(k, parent, x + (index - (count - 1) / 2) * 0.63, z, fabric);
}
export function roof(k: Kit, parent: T.Object3D, width: number, length: number, base: number, rise: number, at: Position = [0, 0, 0]): void {
  const material = color(k, 'roof-lining', '#dfdfda', { side: T.DoubleSide });
  const object = k.r.mesh(parent, geo(k, `roof-${width}-${length}-${base}-${rise}`, () => {
    const positions: number[] = [], indices: number[] = [];
    for (let j = 0; j <= 1; j += 1) {
      for (let i = 0; i <= 32; i += 1) {
        const t = i / 32; positions.push((t - 0.5) * width, base + Math.sin(t * Math.PI) * rise, (j - 0.5) * length);
        if (j === 0 && i < 32) indices.push(i, i + 33, i + 1, i + 1, i + 33, i + 34);
      }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
  }), material, at);
  object.receiveShadow = true;
  const rib = geo(k, `roof-rib-${width}-${base}-${rise}`, () => {
    const points = Array.from({ length: 33 }, (_, i) => new T.Vector3((i / 32 - 0.5) * width, base + Math.sin(i / 32 * Math.PI) * rise - 0.15, 0));
    return new T.TubeGeometry(new T.CatmullRomCurve3(points), 32, 0.11, 6, false);
  });
  for (let z = -length / 2; z <= length / 2; z += 8) k.r.mesh(parent, rib, k.r.mat.metal, [at[0], at[1], at[2] + z]);
}
function vehicle(k: Kit, parent: T.Object3D, kind: TaxiKind, at: Position, rotation: number): T.Group {
  const { r } = k, group = new T.Group(); group.position.set(...at); group.rotation.y = rotation;
  const paint = color(k, `taxi-${kind}`, kind === 'taxi' ? '#268fca' : '#1c2126', { metalness: 0.35, roughness: 0.28 });
  // Nearly clear glass so the sky and street read through the windscreen.
  const glass = color(k, 'car-glass', '#c9e1ea', { transparent: true, opacity: 0.08, metalness: 0.1, roughness: 0.05, depthWrite: false });
  const trim = color(k, 'taxi-inner-trim', '#454b4d', { roughness: 0.88 });
  const headlining = color(k, 'taxi-headlining', '#bbbcb5', { roughness: 0.98 });
  // A hollow passenger compartment: painted bodywork must not fill the cabin.
  r.box(group, [1.75, 0.12, 4.3], [0, 0.3, 0], r.mat.darkStone);
  r.box(group, [1.82, 0.47, 1.02], [0, 0.64, -1.74], paint);
  r.box(group, [1.82, 0.44, 0.66], [0, 0.63, 1.91], paint);
  r.sphere(group, [0.91, 0.15, 0.54], [0, 0.86, -1.74], paint);
  r.sphere(group, [0.9, 0.13, 0.34], [0, 0.86, 1.91], paint);
  for (const side of [-1, 1]) {
    r.box(group, [0.14, 0.57, 4.25], [side * 0.86, 0.65, 0], paint);
    r.box(group, [0.035, 0.46, 2.35], [side * 0.775, 0.77, 0.18], trim);
    r.box(group, [0.13, 0.075, 0.5], [side * 0.71, 0.79, 0.75], trim);
    r.box(group, [0.12, 0.075, 0.45], [side * 0.71, 0.79, -0.38], trim);
  }
  // Roof with a panoramic glass panel over the cabin, framed by the headlining.
  // A slim front header keeps most of the sky open above the windscreen.
  r.box(group, [1.5, 0.08, 0.14], [0, 1.57, -0.87], paint); r.box(group, [1.5, 0.1, 0.32], [0, 1.57, 1.18], paint);
  for (const side of [-1, 1]) r.box(group, [0.14, 0.1, 2.28], [side * 0.68, 1.57, 0.2], paint);
  r.box(group, [1.22, 0.02, 1.84], [0, 1.6, 0.13], glass);
  r.box(group, [1.47, 0.02, 0.12], [0, 1.515, -0.87], headlining); r.box(group, [1.47, 0.025, 0.3], [0, 1.507, 1.2], headlining);
  for (const side of [-1, 1]) r.box(group, [0.14, 0.025, 2.18], [side * 0.67, 1.507, 0.2], headlining);
  r.box(group, [1.72, 0.13, 1.1], [0, 0.96, -1.66], paint);
  for (const side of [-1, 1]) {
    for (const z of [-1.4, 1.4]) {
      const wheel = r.cylinder(group, 0.32, 0.32, 0.2, [side * 0.93, 0.34, z], r.mat.black, 20); wheel.rotation.z = Math.PI / 2;
      const rim = r.cylinder(group, 0.2, 0.2, 0.215, [side * 0.93, 0.34, z], r.mat.metal, 12); rim.rotation.z = Math.PI / 2;
    }
    r.box(group, [0.05, 0.49, 1.88], [side * 0.78, 1.27, 0.2], glass);
    r.box(group, [0.075, 0.58, 0.075], [side * 0.79, 1.28, 0.32], paint);
    beam(k, group, [side * 0.75, 1.55, -0.91], [side * 0.86, 0.94, -1.35], 0.035, paint);
    beam(k, group, [side * 0.75, 1.55, 1.28], [side * 0.86, 0.96, 1.68], 0.055, paint);
    r.box(group, [0.045, 0.04, 0.21], [side * 0.938, 0.88, 0.5], r.mat.metal);
    r.box(group, [0.22, 0.14, 0.27], [side * 1.01, 1.02, -1.04], paint);
    const wordmark = textPlate(k, group, kind === 'taxi' ? 'TAKSI' : 'Uber', [side * 0.924, 0.71, -0.1], 1.18);
    wordmark.rotation.y = side * Math.PI / 2;
  }
  const windscreen = r.box(group, [1.52, 0.69, 0.02], [0, 1.26, -1.1], glass); windscreen.rotation.x = -0.53;
  const rear = r.box(group, [1.52, 0.58, 0.02], [0, 1.27, 1.45], glass); rear.rotation.x = 0.53;
  for (const side of [-1, 1]) {
    r.box(group, [0.51, 0.12, 0.06], [side * 0.57, 0.75, -2.27], r.mat.white);
    r.box(group, [0.5, 0.13, 0.06], [side * 0.58, 0.73, 2.27], color(k, 'tail-lamp', '#a12626'));
  }
  r.box(group, [0.74, 0.16, 0.06], [0, 0.53, -2.28], r.mat.black);
  r.box(group, [0.44, 0.11, 0.02], [0, 0.48, -2.32], r.mat.white);
  if (kind === 'taxi') {
    r.box(group, [0.55, 0.17, 0.24], [0, 1.7, 0.1], r.mat.white);
    textPlate(k, group, 'TAKSI', [0, 1.71, -0.025], 0.47, '#116f9c');
  }
  // Interior seen from the front passenger seat: contoured seats with separate
  // headrests, a shaped dashboard with instruments, mirror, visors and belts.
  const upholstery = color(k, 'taxi-upholstery', '#2f3437', { roughness: 0.92 });
  const stitch = color(k, 'taxi-seat-centre', '#3d4448', { roughness: 0.95 });
  const dash = color(k, 'taxi-dash', '#24282b', { roughness: 0.8 });
  const rounded = geo(k, 'car-rounded', () => new RoundedBoxGeometry(1, 1, 1, 2, 0.12));
  const soft = (size: Position, at: Position, material: T.Material, tilt = 0) => { const mesh = k.r.mesh(group, rounded, material, at); mesh.scale.set(...size); mesh.rotation.x = tilt; return mesh; };
  const driverX = kind === 'taxi' ? 0.42 : -0.42, passengerX = -driverX;
  for (const x of [-0.42, 0.42]) {
    soft([0.5, 0.14, 0.52], [x, 0.56, -0.2], upholstery);
    soft([0.3, 0.05, 0.42], [x, 0.635, -0.2], stitch);
    soft([0.5, 0.62, 0.14], [x, 0.93, 0.1], upholstery, -0.18);
    soft([0.3, 0.5, 0.05], [x, 0.94, 0.03], stitch, -0.18);
    soft([0.26, 0.19, 0.11], [x, 1.38, 0.2], upholstery, -0.1);
    for (const dx of [-0.07, 0.07]) r.cylinder(group, 0.009, 0.009, 0.1, [x + dx, 1.26, 0.19], r.mat.metal, 6);
  }
  soft([1.42, 0.18, 0.56], [0, 0.52, 1.05], upholstery);
  soft([1.42, 0.62, 0.14], [0, 0.9, 1.45], upholstery, 0.12);
  // Centre console with gear selector between the front seats.
  soft([0.22, 0.28, 0.75], [0, 0.6, -0.35], dash);
  r.box(group, [0.05, 0.12, 0.05], [0, 0.8, -0.45], r.mat.black);
  // Dashboard, glove box and the instrument hood in front of the driver.
  soft([1.62, 0.26, 0.5], [0, 0.94, -0.92], dash);
  soft([1.55, 0.1, 0.32], [0, 1.08, -1.02], dash, 0.25);
  soft([0.5, 0.12, 0.05], [passengerX, 0.84, -0.66], color(k, 'taxi-glovebox', '#2c3134'));
  soft([0.38, 0.12, 0.2], [driverX, 1.12, -0.82], dash);
  const gauge = color(k, 'taxi-gauge', '#0e1a22', { emissive: '#4fb3ff', emissiveIntensity: 0.55 });
  for (const dx of [-0.08, 0.08]) { const dial = r.cylinder(group, 0.055, 0.055, 0.01, [driverX + dx, 1.1, -0.71], gauge, 18); dial.rotation.x = Math.PI / 2 - 0.3; }
  for (const x of [-0.6, -0.2, 0.2, 0.6]) r.box(group, [0.12, 0.05, 0.02], [x, 1.0, -0.665], r.mat.metal);
  r.box(group, [0.25, 0.16, 0.025], [0, 1.05, -0.68], color(k, 'screen', '#284557', { emissive: '#3a77a0', emissiveIntensity: 0.45 }));
  if (kind === 'taxi') {
    // Fare meter on the dashboard.
    const meter = textPlate(k, group, 'Rp 86.500', [0.02, 1.155, -0.79], 0.22, '#ff5a3c', '#120b08'); meter.rotation.x = -0.25;
  } else {
    // Phone holder showing the route.
    r.box(group, [0.09, 0.16, 0.012], [-0.16, 1.17, -0.75], color(k, 'phone-map', '#cfe3d4', { emissive: '#7fbf95', emissiveIntensity: 0.35 }));
  }
  // Rear-view mirror and sun visors.
  r.box(group, [0.26, 0.07, 0.02], [0, 1.47, -0.84], color(k, 'mirror', '#9bb0b8', { metalness: 0.9, roughness: 0.1 }));
  r.box(group, [0.02, 0.05, 0.02], [0, 1.52, -0.84], dash);
  // Visors folded flat against the headlining.
  for (const x of [-0.42, 0.42]) r.box(group, [0.4, 0.012, 0.1], [x, 1.5, -0.87], headlining);
  // Inner door panels with arm rests and handles.
  for (const side of [-1, 1]) for (const z of [-0.3, 0.75]) {
    soft([0.05, 0.42, 0.85], [side * 0.79, 0.86, z], trim);
    r.box(group, [0.03, 0.03, 0.12], [side * 0.765, 0.98, z - 0.25], r.mat.metal);
  }
  const steering = r.mesh(group, geo(k, 'steering', () => new T.TorusGeometry(0.17, 0.022, 7, 20)), r.mat.black, [driverX, 1.09, -0.58]); steering.rotation.x = -0.35;
  r.cylinder(group, 0.04, 0.04, 0.03, [driverX, 1.09, -0.58], dash, 12);
  const driver = createSeatedPassengers(r, [{ position: [driverX, .625, -.2], angle: Math.PI, driving: true }]);
  driver.name = 'Pengemudi'; group.add(driver);
  parent.add(group); return group;
}

/** Local -Z points forward; at is the vehicle's ground origin. */
export function addTaxiVehicle(r: WorldResources, parent: T.Object3D, kind: TaxiKind, at: Position = [0, 0, 0], rotation = 0): T.Group {
  return vehicle(kit(r), parent, kind, at, rotation);
}

/** The flight aircraft at the original apron footprint. `at` is ground level. */
export function addGarudaAircraft(r: WorldResources, parent: T.Object3D, at: Position = [0, 0, 0], scale = 1, rotation = 0): T.Group {
  const k = kit(r), group = new T.Group(); group.name = 'Garuda Indonesia — parked';
  group.position.set(...at); group.scale.setScalar(scale); group.rotation.y = rotation;
  const aircraft = createGarudaAircraft(r);
  // Preserve this helper's former ~39 m length / 35 m span so its callers and
  // the terminal's boarding bridge keep their existing clearance.
  aircraft.scale.setScalar(.6); aircraft.position.y = 3.85;
  delete aircraft.userData.dynamic; group.add(aircraft);
  const tyre = color(k, 'aircraft-tyre', '#20252a', { roughness: .95 });
  const hub = color(k, 'aircraft-wheel-hub', '#b8c0c6', { metalness: .7, roughness: .38 });
  const wheel = (x: number, y: number, z: number, radius: number, width: number) => {
    const rubber = r.cylinder(group, radius, radius, width, [x, y, z], tyre, 24); rubber.rotation.z = Math.PI / 2;
    const rim = r.cylinder(group, radius * .53, radius * .53, width + .012, [x, y, z], hub, 16); rim.rotation.z = Math.PI / 2;
  };
  // Paired nose wheels and two four-wheel main bogies. Each tyre touches the
  // local y=0 ground; the nacelles remain more than one metre above the apron.
  beam(k, group, [0, .45, -14.7], [0, 2.45, -14.7], .09);
  beam(k, group, [0, 1, -14.7], [0, 2.55, -13.6], .055);
  for (const x of [-.19, .19]) wheel(x, .38, -14.7, .38, .19);
  for (const side of [-1, 1]) {
    const x = side * 3.1;
    beam(k, group, [x, .65, 4.2], [x, 3.65, 3.6], .13);
    beam(k, group, [side * 1.9, 2.9, 2.7], [x, 1.45, 4], .075);
    r.box(group, [.24, .18, 1.65], [x, .6, 4.2], hub);
    for (const dx of [-.32, .32]) for (const dz of [-.58, .58]) wheel(x + dx, .53, 4.2 + dz, .53, .29);
  }
  parent.add(group); return group;
}

interface WarnaRumah { dinding: string; aksen: string; atap: string; pagar: string }
const WARNA_RUMAH: WarnaRumah[] = [
  { dinding: '#f1e7d3', aksen: '#b98a5e', atap: '#8e4a35', pagar: '#2b2f33' },
  { dinding: '#e7eef0', aksen: '#6f8fa3', atap: '#5d5f66', pagar: '#2b2f33' },
  { dinding: '#f3e1cb', aksen: '#c6764d', atap: '#9a5338', pagar: '#3a3026' },
  { dinding: '#e4ecdf', aksen: '#7d9a6e', atap: '#6b4a3a', pagar: '#2b2f33' },
  { dinding: '#f6eee2', aksen: '#a7896b', atap: '#7a3f31', pagar: '#30363b' },
];

/**
 * Rumah tapak satu lantai khas perumahan Indonesia, menghadap +Z (jalan). Lebar kavling 12 m:
 * atap pelana genteng + lisplang, teras berkeramik dua tiang, carport berkanopi, jendela berkusen & teralis,
 * roster, pagar besi berpilar dengan pagar geser, taman kecil, dan got bertutup beton di depan.
 * `utama` menambah perabot teras, nomor rumah, dan detail yang terlihat dari dekat.
 */
function rumahPerumahan(k: Kit, parent: T.Object3D, x: number, z: number, rotasi: number, w: WarnaRumah, utama: boolean, nomor: string): void {
  const r = k.r, g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = rotasi; parent.add(g);
  const dinding = color(k, 'dinding-' + w.dinding, w.dinding), aksen = color(k, 'aksen-' + w.aksen, w.aksen);
  const atap = color(k, 'atap-' + w.atap, w.atap, { roughness: .7 }), pagar = color(k, 'pagar-' + w.pagar, w.pagar, { roughness: .45, metalness: .5 });
  const kusen = color(k, 'kusen', '#5a3a26'), keramik = color(k, 'keramik-teras', '#d9cfc0', { roughness: .35 });
  const conblock = color(k, 'conblock', '#9a948a'), rumput = color(k, 'rumput-taman', '#6f9a56'), bata = color(k, 'pilar-bata', '#d6c5ab');
  const putih = color(k, 'lisplang', '#f4f1ea'), daun = color(k, 'daun-pucuk', '#4f8a3c'), pucuk = color(k, 'pucuk-merah', '#b5473a');
  const kaca = r.mat.glass;
  // badan rumah & lantai
  r.box(g, [12, 3.2, 7.4], [0, 1.6, -5.6], dinding);
  r.box(g, [12, .35, 7.6], [0, .17, -5.6], aksen);
  r.box(g, [7, .16, 3.6], [-2.5, .08, -.1], keramik);
  r.box(g, [5, .06, 13.4], [3.5, .03, 4.8], conblock);
  r.box(g, [7, .05, 9.8], [-2.5, .03, 6.6], rumput);
  // atap pelana: dua bidang miring + segitiga depan + lisplang
  const tinggi = 2.1, setengah = 6.7, sudut = Math.atan2(tinggi, setengah), panjang = Math.hypot(tinggi, setengah) + .1;
  for (const sisi of [-1, 1]) {
    const bidang = r.box(g, [panjang, .16, 8.8], [sisi * setengah / 2, 3.2 + tinggi / 2 + .08, -5.3], atap); bidang.rotation.z = -sisi * sudut;
    for (let n = 1; n < 8; n++) { const baris = r.box(g, [panjang, .05, .05], [sisi * setengah / 2, 3.2 + tinggi / 2 + .19, -9.5 + n * 1.05], atap); baris.rotation.z = -sisi * sudut; }
    const lis = r.box(g, [panjang, .26, .06], [sisi * setengah / 2, 3.2 + tinggi / 2 - .02, -.88], putih); lis.rotation.z = -sisi * sudut;
  }
  const segitiga = geo(k, 'gevel-rumah', () => { const sh = new T.Shape(); sh.moveTo(-6, 0); sh.lineTo(6, 0); sh.lineTo(0, tinggi); sh.closePath(); return new T.ExtrudeGeometry(sh, { depth: .12, bevelEnabled: false }); });
  const gevel = new T.Mesh(segitiga, dinding); gevel.position.set(0, 3.2, -1.98); gevel.castShadow = gevel.receiveShadow = true; g.add(gevel);
  r.box(g, [1.6, .5, .08], [0, 4.05, -1.84], color(k, 'roster', '#cdbf9f'));
  for (let n = 0; n < 5; n++) r.box(g, [.18, .18, .1], [-.56 + n * .28, 4.05, -1.8], color(k, 'roster-lubang', '#5d5243'));
  // teras: dak, tiang, lampu
  r.box(g, [7.2, .22, 3.8], [-2.5, 3.0, -.05], dinding);
  r.box(g, [7.2, .14, .08], [-2.5, 2.9, 1.86], aksen);
  for (const tx of [-5.7, .7]) { r.box(g, [.32, 2.9, .32], [tx, 1.45, 1.55], dinding); r.box(g, [.4, .55, .4], [tx, .27, 1.55], bata); }
  r.sphere(g, [.12, .12, .12], [-1.6, 2.7, -1.74], color(k, 'lampu-teras', '#fff3cf', { emissive: '#ffd98a', emissiveIntensity: .8 }));
  // pintu kayu panel & jendela berkusen + teralis + roster
  r.box(g, [1.1, 2.25, .12], [-1.6, 1.25, -1.86], kusen);
  r.box(g, [.9, 2.08, .06], [-1.6, 1.2, -1.78], color(k, 'daun-pintu', '#7a4e2f'));
  for (const py of [.7, 1.6]) r.box(g, [.7, .7, .03], [-1.6, py, -1.74], color(k, 'panel-pintu', '#6b4228'));
  r.sphere(g, [.04, .04, .04], [-1.25, 1.15, -1.72], r.mat.gold);
  for (const [wx, lebar] of [[-4.2, 1.9], [3.6, 1.7]] as const) {
    r.box(g, [lebar + .16, 1.5, .14], [wx, 1.65, -1.86], kusen);
    r.box(g, [lebar, 1.32, .06], [wx, 1.65, -1.79], kaca);
    r.box(g, [.06, 1.34, .08], [wx, 1.65, -1.75], kusen);
    for (let t = -lebar / 2 + .15; t < lebar / 2; t += .22) r.box(g, [.025, 1.4, .025], [wx + t, 1.65, -1.66], pagar);
    r.box(g, [lebar + .16, .3, .1], [wx, 2.62, -1.82], color(k, 'roster', '#cdbf9f'));
    r.box(g, [lebar + .3, .08, .25], [wx, .86, -1.72], aksen);
  }
  // carport berkanopi
  const kanopi = r.box(g, [5.2, .06, 8.2], [3.5, 2.75, 2.3], color(k, 'kanopi', '#6c757d', { roughness: .4, metalness: .3 })); kanopi.rotation.x = .04;
  for (const cx of [1.1, 5.9]) r.box(g, [.1, 2.7, .1], [cx, 1.35, 6.2], pagar);
  r.box(g, [5, .1, .1], [3.5, 2.6, 6.2], pagar);
  // pagar depan: dinding rendah, pilar, besi, pagar geser terbuka
  for (const [px] of [[-5.85], [-.95], [5.85]] as const) { r.box(g, [.45, 1.75, .45], [px, .88, 11.5], bata); r.box(g, [.55, .1, .55], [px, 1.8, 11.5], dinding); }
  r.box(g, [4.7, .55, .25], [-3.4, .28, 11.5], bata);
  for (let px = -5.5; px <= -1.3; px += .16) r.box(g, [.035, 1.05, .035], [px, 1.08, 11.5], pagar);
  r.box(g, [4.7, .05, .05], [-3.4, 1.58, 11.5], pagar);
  for (let px = -5.3; px <= -1.1; px += .14) r.box(g, [.03, 1.45, .03], [px, .8, 11.2], pagar);
  r.box(g, [4.6, .06, .06], [-3.2, 1.52, 11.2], pagar); r.box(g, [4.6, .06, .06], [-3.2, .1, 11.2], pagar);
  // tanaman: pucuk merah di balik pagar, pohon mangga, pot di teras
  for (let px = -5.4; px <= -1.6; px += .55) { r.sphere(g, [.32, .34, .32], [px, .55, 10.8], daun); r.sphere(g, [.22, .16, .22], [px + .1, .82, 10.75], pucuk); }
  r.cylinder(g, .08, .12, 2, [-5.2, 1, 9.4], kusen);
  for (const [dx, dy, dz, s] of [[0, 2.4, 0, .85], [.45, 2.15, .25, .65], [-.4, 2.25, -.25, .7], [.1, 2.75, -.15, .6]] as const) r.sphere(g, [s, s * .85, s], [-5.2 + dx, dy, 9.4 + dz], color(k, 'daun-mangga', '#3f7a35'));
  // got & tutup beton di depan pagar
  r.box(g, [12, .03, .6], [0, .01, 12.6], color(k, 'got', '#3a4146'));
  r.box(g, [5, .08, .66], [3.5, .05, 12.6], conblock);
  r.box(g, [12, .18, .12], [0, .09, 12.95], color(k, 'kanstin', '#c9c4ba'));
  if (!utama) return;
  // perabot teras & nomor rumah
  const rotan = color(k, 'rotan', '#6b4426', { roughness: .8 }), bantal = color(k, 'bantal-kursi', '#c9b48f');
  for (const kx of [-4.7, -3.1]) {
    for (const [lx, lz] of [[-.25, -.85], [.25, -.85], [-.25, -.35], [.25, -.35]] as const) r.box(g, [.05, .4, .05], [kx + lx, .2, lz], rotan);
    r.box(g, [.62, .06, .58], [kx, .42, -.6], rotan); r.box(g, [.54, .07, .5], [kx, .48, -.6], bantal);
    r.box(g, [.62, .5, .05], [kx, .7, -.88], rotan);
  }
  r.cylinder(g, .26, .26, .04, [-3.9, .5, -.6], color(k, 'kaca-meja', '#b9d4d8'));
  r.cylinder(g, .04, .06, .48, [-3.9, .25, -.6], rotan);
  for (const [px, pz] of [[-5.4, 1.1], [.3, 1.1], [-.1, -1.3]] as const) { r.cylinder(g, .22, .17, .4, [px, .36, pz], color(k, 'pot', '#a5532f')); r.sphere(g, [.34, .4, .34], [px, .78, pz], daun); }
  r.box(g, [.7, .5, .3], [-.4, .41, -1.55], kusen);
  textPlate(k, g, nomor, [-.95, 1.35, 11.74], .44, '#ffffff', '#1f3a55');
}

export function createHomeWorld(r: WorldResources): UmrohWorld {
  const k = kit(r), group = new T.Group(); group.name = 'Rumah di perumahan, Indonesia';
  r.floor(group, 220, 220, r.mat.paving);
  // jalan perumahan, kanstin, garis tepi
  r.box(group, [140, .025, 7], [0, .02, 17.5], r.mat.asphalt);
  for (const z of [14.15, 20.85]) r.box(group, [140, .16, .3], [0, .08, z], color(k, 'kanstin', '#c9c4ba'));
  rumahPerumahan(k, group, 0, 0, 0, WARNA_RUMAH[0], true, 'B2 / 17');
  for (const [i, x] of [[1, -12.4], [2, 12.4], [3, -24.8], [4, 24.8]] as const) rumahPerumahan(k, group, x, 0, 0, WARNA_RUMAH[i], false, '');
  for (const [i, x] of [[2, -18.6], [0, -6.2], [3, 6.2], [1, 18.6]] as const) rumahPerumahan(k, group, x, 35, Math.PI, WARNA_RUMAH[i], false, '');
  // tiang listrik & kabel
  const tiang = color(k, 'tiang-listrik', '#8d9196');
  for (const tx of [-15, 9]) { r.cylinder(group, .1, .14, 8, [tx, 4, 13.9], tiang); r.box(group, [1.4, .08, .08], [tx, 7.4, 13.9], tiang); }
  r.box(group, [24, .02, .02], [-3, 7.3, 13.75], color(k, 'kabel', '#1d1f22'));
  r.box(group, [24, .02, .02], [-3, 7.0, 13.75], color(k, 'kabel', '#1d1f22'));
  // koper di teras, taksi di jalan
  luggage(k, group, [.2, .16, .35], 1.1);
  luggage(k, group, [.85, .16, .55], .85, r.mat.darkStone);
  vehicle(k, group, 'taxi', [4.8, 0, 17.4], Math.PI / 2);
  // keluarga yang mengantar di teras, menghadap jalan
  const keluarga = new StandingPeople(r, [
    { position: [-3.1, 0, .5], angle: .25, female: true, colors: { dress: '#5f6f86', scarf: '#d7b7a3' } },
    { position: [-.6, 0, 1.15], angle: -.2, female: false, scale: .72, colors: { shirt: '#e0a43a', trousers: '#3d4a5c' }, pose: { arms: [0, -2.5], forearms: [0, -.5] } },
  ]);
  group.add(keluarga.group);
  return {
    group, spawn: [-1.8, 1.68, 9.2], lookAt: [-1.6, 1.5, -1.5], overview: [22, 15, 30],
    guide: { position: [-1.9, 0, .7], heading: 0 },
    bounds: { minX: -11.5, maxX: 11.5, minZ: -1.4, maxZ: 22 },
    blockers: [
      { minX: -6.2, maxX: 6.2, minZ: -9.5, maxZ: -1.75 },
      { minX: -5.95, maxX: -5.45, minZ: 1.3, maxZ: 1.8 }, { minX: .5, maxX: .95, minZ: 1.3, maxZ: 1.8 },
      { minX: -6.2, maxX: -.7, minZ: 11.05, maxZ: 11.75 }, { minX: 5.6, maxX: 6.2, minZ: 11.2, maxZ: 11.75 },
      { minX: -5.5, maxX: -4.9, minZ: 9.1, maxZ: 9.7 },
      { minX: -4.95, maxX: -2.85, minZ: -1, maxZ: -.25 },
      { minX: -.1, maxX: 1.2, minZ: .1, maxZ: .9 },
      { minX: 2.1, maxX: 7.5, minZ: 16.1, maxZ: 18.7 },
      { minX: -6.6, maxX: -6.2, minZ: -9, maxZ: 12 }, { minX: 6.2, maxX: 6.6, minZ: -9, maxZ: 12 },
    ],
    landmarks: [
      { id: 'home-porch', label: 'Teras rumah', position: [-1.6, 1.62, 6.2], lookAt: [-1.7, 1.35, -.6] },
      { id: 'home-luggage', label: 'Koper siap', position: [2.2, 1.5, 3.4], lookAt: [.3, .6, .4] },
      { id: 'home-taxi', label: 'Taksi', position: [.8, 1.68, 10.2], lookAt: [4.8, .9, 17.4] },
    ],
  };
}

/** Repeating 3 m facade cell: one storey, one window bay. Batching maps UVs in metres / 3. */
function facadeMaterial(k: Kit, name: string, style: 'tower' | 'arched' | 'shophouse'): T.MeshStandardMaterial {
  let material = k.materials.get('facade-' + name);
  if (material) return material;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Fasad tidak tersedia.');
  if (style === 'tower') {
    ctx.fillStyle = '#9fb3bf'; ctx.fillRect(0, 0, 128, 128);
    const glass = ctx.createLinearGradient(0, 0, 0, 128); glass.addColorStop(0, '#5f8197'); glass.addColorStop(1, '#29495d');
    ctx.fillStyle = glass; ctx.fillRect(6, 10, 116, 96);
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(6, 10, 116, 18);
    ctx.fillStyle = '#c9d3d8'; ctx.fillRect(62, 10, 4, 96);
  } else if (style === 'arched') {
    ctx.fillStyle = '#e4d6bd'; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#5b4a3a'; ctx.beginPath(); ctx.moveTo(40, 112); ctx.lineTo(40, 52); ctx.arc(64, 52, 24, Math.PI, 0); ctx.lineTo(88, 112); ctx.fill();
    ctx.fillStyle = '#a07d55'; for (let x = 44; x < 88; x += 8) ctx.fillRect(x, 50, 3, 62);
    ctx.fillStyle = '#d2c2a5'; ctx.fillRect(0, 118, 128, 10);
  } else {
    ctx.fillStyle = '#e9e2d6'; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#334a57'; ctx.fillRect(18, 26, 38, 60); ctx.fillRect(72, 26, 38, 60);
    ctx.fillStyle = '#b6532f'; ctx.fillRect(0, 0, 128, 10);
    ctx.fillStyle = '#cfc6b6'; ctx.fillRect(0, 100, 128, 6);
  }
  const map = k.r.keep(new T.CanvasTexture(canvas)); map.colorSpace = T.SRGBColorSpace; map.wrapS = map.wrapT = T.RepeatWrapping; map.anisotropy = 4;
  material = k.r.keep(new T.MeshStandardMaterial({ map, roughness: style === 'tower' ? .35 : .85, metalness: style === 'tower' ? .25 : 0 }));
  k.materials.set('facade-' + name, material); return material;
}

/** Simple saloon, MPV or bus, merged to a handful of meshes. */
function trafficVehicle(k: Kit, paint: string, type: 'car' | 'mpv' | 'bus'): T.Group {
  const { r } = k, car = new T.Group(); car.userData.dynamic = true;
  const body = color(k, 'traffic-' + paint, paint, { metalness: .45, roughness: .3 });
  const glass = color(k, 'traffic-glass', '#1d2a33', { metalness: .4, roughness: .15 });
  const length = type === 'bus' ? 11.5 : type === 'mpv' ? 4.7 : 4.4, width = type === 'bus' ? 2.5 : 1.8;
  if (type === 'bus') {
    r.box(car, [width, 2.6, length], [0, 1.75, 0], body);
    for (const side of [-1, 1]) r.box(car, [.02, .9, length - 1.2], [side * (width / 2 + .005), 2.3, .2], glass);
    r.box(car, [width - .2, 1, .02], [0, 2.3, -length / 2 - .005], glass);
  } else {
    r.box(car, [width, .62, length], [0, .62, 0], body);
    const cabin = r.box(car, [width - .18, .52, length * (type === 'mpv' ? .62 : .48)], [0, 1.18, type === 'mpv' ? .2 : .1], glass); void cabin;
    r.box(car, [width - .16, .06, length * (type === 'mpv' ? .6 : .46)], [0, 1.46, type === 'mpv' ? .2 : .1], body);
  }
  for (const side of [-1, 1]) for (const z of [-length * .34, length * .34]) {
    const wheel = r.cylinder(car, type === 'bus' ? .5 : .33, type === 'bus' ? .5 : .33, .24, [side * (width / 2 - .08), type === 'bus' ? .5 : .33, z], r.mat.black, 14); wheel.rotation.z = Math.PI / 2;
  }
  const head = color(k, 'headlight', '#fffbe8', { emissive: '#fff6d5', emissiveIntensity: .8 }), tail = color(k, 'taillight', '#7a1010', { emissive: '#ff2a1a', emissiveIntensity: .9 });
  for (const side of [-1, 1]) { r.box(car, [.35, .12, .05], [side * (width / 2 - .3), .78, -length / 2], head); r.box(car, [.35, .12, .05], [side * (width / 2 - .3), .8, length / 2], tail); }
  r.batch(car); return car;
}

interface Traffic { car: T.Group; base: number; lane: number; drift: number; oncoming: boolean }

function street(k: Kit, group: T.Group, kind: TaxiKind, returning: boolean): Traffic[] {
  const { r } = k, jakarta = kind === 'taxi';
  const ground = r.floor(group, 1600, 1600, jakarta ? color(k, 'verge-grass', '#5f7b4a', { roughness: 1 }) : r.mat.sand); ground.position.y = -0.02;
  // Our carriageway, a planted median with a concrete barrier, and the opposite carriageway.
  r.box(group, [18, 0.04, 1800], [0, 0, -450], r.mat.asphalt);
  r.box(group, [14, 0.04, 1800], [-23, 0, -450], r.mat.asphalt);
  for (const x of [-8.6, -2.9, 2.9, 8.6]) {
    if (Math.abs(x) > 8) r.box(group, [0.11, 0.02, 1800], [x, 0.035, -450], r.mat.white);
    else for (let z = 250; z > -1000; z -= 14) r.box(group, [0.12, 0.02, 5.3], [x, 0.035, z], r.mat.white);
  }
  for (const x of [-29.6, -16.4]) r.box(group, [0.11, 0.02, 1800], [x, 0.035, -450], r.mat.white);
  for (let z = 250; z > -1000; z -= 14) r.box(group, [0.12, 0.02, 5.3], [-23, 0.035, z], r.mat.white);
  r.box(group, [6, 0.25, 1800], [-12.5, .12, -450], jakarta ? color(k, 'median-grass', '#4f6e3c', { roughness: 1 }) : r.mat.paving);
  for (const x of [-9.7, -15.3]) {
    r.box(group, [.5, .45, 1800], [x, .23, -450], color(k, 'barrier', '#cfcbc2', { roughness: .9 }));
    r.box(group, [.22, .4, 1800], [x, .62, -450], color(k, 'barrier', '#cfcbc2', { roughness: .9 }));
  }
  const tower = facadeMaterial(k, 'tower', 'tower'), low = facadeMaterial(k, jakarta ? 'shophouse' : 'arched', jakarta ? 'shophouse' : 'arched');
  const random = (() => { let v = jakarta ? 41 : 87; return () => { v = (Math.imul(v, 1664525) + 1013904223) >>> 0; return v / 4294967296; }; })();
  for (const side of [-1, 1]) {
    r.box(group, [4.5, 0.15, 1200], [side * (side > 0 ? 11.7 : 34), 0.05, -330], r.mat.paving);
    for (let i = 0; i < 26; i += 1) {
      const z = 170 - i * 44 - random() * 12, near = i % 2 === 0;
      // Row of low shops near the road; towers stand further back in Jakarta.
      const x = side * ((side > 0 ? 24 : 46) + (near ? 0 : 18) + random() * 8);
      const height = jakarta ? (near ? 7 + Math.round(random() * 2) * 3 : 36 + Math.round(random() * 22) * 3) : 9 + Math.round(random() * 3) * 3;
      const width = near ? 12 : 18 + random() * 8;
      r.box(group, [width, height, near ? 20 : 22], [x, height / 2, z], jakarta && !near ? tower : low);
      if (jakarta && !near) r.box(group, [width * .8, 2.4, 18], [x, height + 1.2, z], color(k, 'roof-plant', '#8f979b'));
      if (!jakarta) for (const dx of [-width / 2 + .4, width / 2 - .4]) r.box(group, [.8, .6, 20], [x + dx, height + .3, z], r.mat.limestone);
    }
    for (let z = 240; z > -1000; z -= 32) {
      const vx = side > 0 ? 11.6 : -33.4;
      if (jakarta) {
        // Rain trees and angsana along the verge.
        const trunkH = 3.2 + random() * 1.5;
        r.cylinder(group, .22, .32, trunkH, [vx, trunkH / 2, z], r.mat.wood, 8);
        const leaf = color(k, 'canopy-' + (Math.round(z) % 3 + 3) % 3, ['#3d5f32', '#4a6b37', '#36552c'][(Math.round(z) % 3 + 3) % 3], { roughness: 1 });
        for (let j = 0; j < 4; j++) r.sphere(group, [2.4 + random(), 1.5 + random() * .6, 2.4 + random()], [vx + (random() - .5) * 2.4, trunkH + 1 + random() * .8, z + (random() - .5) * 2.4], leaf);
      } else palm(k, group, vx, z + 17, 8);
    }
  }
  // Street lights with curved arms over both carriageways.
  for (let z = 230; z > -1000; z -= 42) {
    r.cylinder(group, 0.11, 0.16, 10, [-12.5, 5, z], r.mat.metal, 10);
    for (const side of [-1, 1]) {
      beam(k, group, [-12.5, 9.6, z], [-12.5 + side * 4.5, 10.2, z], .07);
      r.box(group, [1.1, .18, .4], [-12.5 + side * 4.9, 10.05, z], color(k, 'lamp-head', '#3a3f43'));
      r.box(group, [.9, .04, .3], [-12.5 + side * 4.9, 9.95, z], color(k, 'lamp-glow', '#fff3cf', { emissive: '#ffe6a8', emissiveIntensity: .6 }));
    }
  }
  // Overhead direction signs: green in Indonesia, blue in Saudi Arabia.
  const signTitle = jakarta ? returning ? 'Jakarta Pusat · Cengkareng' : 'Bandara Soekarno–Hatta' : returning ? 'Stasiun Haramain' : 'Masjid Nabawi · المسجد النبوي';
  const signSub = jakarta ? returning ? 'Keluar tol berikutnya  ↗' : 'Terminal 1 · 2 · 3   ↑' : returning ? 'Haramain Station  ↑' : 'Central Area  ↑';
  for (const z of [-60, -330, -640]) {
    for (const x of [-10.4, 10]) r.cylinder(group, .2, .25, 7.6, [x, 3.8, z], r.mat.metal, 10);
    beam(k, group, [-10.4, 7.4, z], [10, 7.4, z], .18);
    const board = textPlate(k, group, signTitle, [2, 8.9, z + .2], 13, '#ffffff', jakarta ? '#0b6b3a' : '#1f4f9b');
    board.scale.set(13, 13 * 1.6, 1);
    textPlate(k, group, signSub, [2, 8.05, z + .25], 9, '#ffffff', jakarta ? '#0b6b3a' : '#1f4f9b');
  }
  r.sign(group, jakarta ? returning ? 'JAKARTA · MENUJU RUMAH' : 'BANDARA SOEKARNO–HATTA' : returning ? 'STASIUN HARAMAIN' : 'MADINAH · MASJID NABAWI', jakarta ? 'Perjalanan dengan taksi' : 'Perjalanan bersama Uber', [16, 4.5, -170], 7);
  r.cylinder(group, 0.15, 0.15, 3.7, [16, 1.85, -170], r.mat.metal, 10);
  // Traffic in both directions; cars ride with the scenery and drift relative to it.
  const paints = jakarta ? ['#f2f2f0', '#1c1f22', '#9aa3a8', '#7a1f22', '#2b4f7a', '#d9d5cc', '#3d4a3f'] : ['#f2f2f0', '#c9c2b2', '#1c1f22', '#9aa3a8', '#b8a07a'];
  const traffic: Traffic[] = [];
  for (let i = 0; i < 22; i++) {
    const oncoming = i % 3 === 0, type = i % 7 === 3 ? 'bus' : i % 4 === 1 ? 'mpv' : 'car';
    const car = trafficVehicle(k, paints[i % paints.length], type);
    if (oncoming) car.rotation.y = Math.PI;
    group.add(car);
    // The taxi drives in the middle lane, so traffic uses the lanes either side of it.
    const lane = oncoming ? (i % 2 ? -26.5 : -19.5) : i % 2 ? -5.75 : 5.75;
    traffic.push({ car, base: 120 - i * 37, lane, drift: oncoming ? 0 : (i % 5 - 2) * .045, oncoming });
  }
  return traffic;
}

export function createTaxiWorld(r: WorldResources, kind: TaxiKind, returning = false): UmrohWorld {
  const k = kit(r), group = new T.Group(), scenery = new T.Group();
  group.name = kind === 'taxi' ? 'Taksi — perjalanan Indonesia' : 'Uber — perjalanan Madinah';
  scenery.name = 'Pemandangan jalan bergerak'; scenery.userData.dynamic = true;
  const traffic = street(k, scenery, kind, returning); group.add(scenery);
  vehicle(k, group, kind, [0, 0, 0], 0);
  const distance = 220, span = 820, passengerSeat = kind === 'taxi' ? -0.42 : 0.42;
  return {
    // The learner rides in the front passenger seat (left in Indonesia, right in Saudi Arabia).
    group, spawn: [passengerSeat, 1.2, -0.12], lookAt: [passengerSeat * 0.6, 5, -60], overview: [5.4, 3.2, 5.8], indoor: true,
    bounds: { minX: passengerSeat - 0.1, maxX: passengerSeat + 0.1, minZ: -0.2, maxZ: 0.05 }, blockers: [],
    motion: { group: scenery, axis: 'z', distance },
    landmarks: [
      { id: 'taxi-front', label: 'Pemandangan jalan', position: [passengerSeat, 1.2, -0.12], lookAt: [passengerSeat * 0.6, 5, -60] },
      { id: 'taxi-side', label: 'Jendela samping', position: [passengerSeat, 1.2, -0.12], lookAt: [passengerSeat * 40, 3, -12] },
      { id: 'taxi-sky', label: 'Langit lewat atap kaca', position: [passengerSeat, 1.2, -0.12], lookAt: [passengerSeat, 12, -8] },
    ],
    animate(frame) {
      // Same-direction cars keep pace with the taxi and slowly overtake or fall back;
      // oncoming cars close at twice the speed. Positions wrap around the viewpoint.
      const travelled = frame.travel * distance;
      for (const t of traffic) {
        const along = t.oncoming ? t.base + travelled * 1.1 : t.base - travelled * (1 + t.drift);
        const sceneZ = along + travelled;
        const wrapped = ((sceneZ + 400) % span + span) % span - 400 - travelled;
        t.car.position.set(t.lane, 0, wrapped);
      }
    },
  };
}

function railLandscape(k: Kit, group: T.Group): void {
  const { r } = k, ground = r.floor(group, 3000, 4000, r.mat.sand); ground.position.set(0, -1.5, -800);
  for (const x of [-6, 6]) {
    r.box(group, [3.3, 0.18, 3600], [x, -1.33, -700], r.mat.darkStone);
    for (const rail of [-0.75, 0.75]) r.box(group, [0.075, 0.13, 3600], [x + rail, -1.15, -700], r.mat.metal);
    for (let z = 300; z > -2300; z -= 3.5) r.box(group, [2.3, 0.12, 0.19], [x, -1.24, z], r.mat.limestone);
  }
  for (let z = 300; z > -2300; z -= 75) {
    for (const x of [-10, 10]) r.cylinder(group, 0.1, 0.14, 7.5, [x, 2.25, z], r.mat.metal, 8);
    beam(k, group, [-10, 6, z], [10, 6, z], 0.09);
  }
  for (const side of [-1, 1]) {
    const terrain = new T.PlaneGeometry(650, 3500, 32, 72); terrain.rotateX(-Math.PI / 2);
    const positions = terrain.getAttribute('position');
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i), z = positions.getZ(i);
      const envelope = Math.max(0, 1 - Math.abs(x) / 330);
      const height = (0.6 + Math.sin(x * 0.022 + z * 0.014) * 0.35 + Math.cos(z * 0.027 - x * 0.04) * 0.22) * envelope * 95;
      positions.setY(i, Math.max(0, height));
    }
    terrain.computeVertexNormals();
    r.mesh(group, r.keep(terrain), color(k, `mountain-${side}`, side > 0 ? '#99826a' : '#ac9272'), [side * 390, -1.5, -900]);
  }
  for (let index = 0; index < 9; index += 1) {
    const z = 100 - index * 180;
    r.box(group, [7, 3.1, 11], [40 + index % 3 * 14, 0.1, z], r.mat.limestone);
    r.cylinder(group, 1.3, 1.3, 3.2, [48 + index % 3 * 14, 0.1, z], r.mat.white, 12);
  }
}

export function createHaramainWorld(r: WorldResources): UmrohWorld {
  const k = kit(r), group = new T.Group(), scenery = new T.Group(); group.name = 'Haramain — menuju Madinah';
  scenery.name = 'Lintasan Haramain bergerak'; scenery.userData.dynamic = true; railLandscape(k, scenery); group.add(scenery);
  r.floor(group, 3.45, 25, r.mat.carpet);
  const upholstery = color(k, 'haramain-seat', '#61564c');
  for (const side of [-1, 1]) {
    r.box(group, [0.13, 0.92, 25], [side * 1.7, 0.46, 0], r.mat.plaster);
    r.box(group, [0.13, 0.53, 25], [side * 1.7, 2.5, 0], r.mat.plaster);
    r.box(group, [0.42, 0.12, 24.6], [side * 1.45, 2.46, 0], r.mat.limestone);
    r.box(group, [0.44, 0.08, 24.6], [side * 1.43, 2.08, 0], r.mat.metal);
    for (let z = -10.5; z <= 10.5; z += 3.5) {
      r.box(group, [0.15, 1.45, 0.16], [side * 1.7, 1.6, z], r.mat.plaster);
      if (z < 10.5) r.box(group, [0.025, 1.21, 3.24], [side * 1.67, 1.57, z + 1.75], r.mat.glass);
    }
    for (let z = -9; z <= 9; z += 1.25) for (const x of [0.85, 1.38]) seat(k, group, side * x, z, upholstery);
  }
  roof(k, group, 3.44, 25, 2.57, 0.38);
  const light = color(k, 'train-light', '#fff7de', { emissive: '#fff2d0', emissiveIntensity: 0.85 });
  for (const x of [-0.46, 0.46]) r.box(group, [0.055, 0.025, 24], [x, 2.89, 0], light);
  for (const z of [-12, 12]) {
    r.box(group, [3.45, 2.8, 0.12], [0, 1.4, z], r.mat.plaster);
    r.box(group, [0.85, 2.05, 0.08], [0, 1.025, z + (z < 0 ? 0.08 : -0.08)], r.mat.darkStone);
    r.box(group, [0.64, 0.83, 0.08], [0, 1.35, z + (z < 0 ? 0.13 : -0.13)], r.mat.glass);
  }
  r.sign(group, 'HARAMAIN · MADINAH', 'Jeddah Airport → Madinah', [0, 2.42, -11.85], 2.5);
  return {
    group, spawn: [0, 1.65, 7.6], lookAt: [-1.3, 1.55, -1.5], overview: [0, 2.3, 10.5], indoor: true,
    bounds: { minX: -0.48, maxX: 0.48, minZ: -10.7, maxZ: 10.7 }, blockers: [],
    motion: { group: scenery, axis: 'z', distance: 900 },
    landmarks: [
      { id: 'train-window', label: 'Pemandangan gurun', position: [0, 1.65, 7.6], lookAt: [-20, 1.5, -20] },
      { id: 'train-aisle', label: 'Lorong kereta', position: [0, 1.65, 9.8], lookAt: [0, 1.65, -10] },
      { id: 'train-front', label: 'Tujuan Madinah', position: [0, 1.65, -8.8], lookAt: [0, 2.2, -11.8] },
    ],
  };
}

function stationTrain(k: Kit, parent: T.Object3D, x: number, z: number): void {
  const { r } = k;
  for (let index = 0; index < 3; index += 1) {
    const center = z - index * 25;
    r.box(parent, [3.2, 2.85, 24], [x, 1.75, center], r.mat.white);
    r.box(parent, [3.25, 0.38, 24], [x, 0.6, center], r.mat.darkGold);
    for (const side of [-1, 1]) {
      for (let i = -4; i <= 4; i += 1) r.box(parent, [0.05, 1, 1.8], [x + side * 1.63, 2, center + i * 2.3], r.mat.glass);
      r.box(parent, [0.06, 0.1, 23.8], [x + side * 1.64, 2.9, center], r.mat.gold);
    }
  }
  r.sphere(parent, [1.58, 1.48, 4.3], [x, 1.7, z + 12], r.mat.white);
  r.box(parent, [2.1, 0.83, 0.14], [x, 2.36, z + 14.8], r.mat.darkStone);
  const plate = textPlate(k, parent, 'HARAMAIN', [x + 1.66, 1.14, z + 3], 5.8, '#896d3f'); plate.rotation.y = Math.PI / 2;
}

export function createMadinahStationWorld(r: WorldResources): UmrohWorld {
  const k = kit(r), group = new T.Group(), blockers: Rect[] = [];
  group.name = 'Stasiun Haramain Madinah'; r.floor(group, 190, 260, r.mat.paving);
  const hall = r.floor(group, 86, 105, r.mat.marble); hall.position.y = 0.01;
  roof(k, group, 88, 112, 12.5, 5.5);
  for (const x of [-28, 0, 28]) {
    for (const z of [-38, -10, 18, 46]) {
      r.cylinder(group, 0.48, 0.75, 10.3, [x, 5.15, z], r.mat.darkGold, 12);
      for (const side of [-1, 1]) {
        beam(k, group, [x, 8.3, z], [x + side * 7, 14.8, z], 0.18, r.mat.gold);
        beam(k, group, [x, 8.3, z], [x, 14.7, z + side * 8], 0.18, r.mat.gold);
      }
      blockers.push({ minX: x - 1, maxX: x + 1, minZ: z - 1, maxZ: z + 1 });
    }
  }
  for (const z of [-50, 52]) {
    for (let x = -42; x <= 42; x += 7) {
      r.box(group, [0.12, 10.5, 0.18], [x, 5.25, z], r.mat.darkGold);
      if (x < 42) r.box(group, [6.8, 10.2, 0.05], [x + 3.5, 5.1, z], r.mat.glass);
    }
  }
  for (const x of [-25, -32]) {
    r.box(group, [3.4, 0.12, 185], [x, -0.1, -35], r.mat.darkStone);
    for (const rail of [-0.75, 0.75]) r.box(group, [0.08, 0.12, 185], [x + rail, 0, -35], r.mat.metal);
  }
  stationTrain(k, group, -32, -11);
  r.box(group, [0.16, 0.025, 96], [-21.2, 0.035, -1], r.mat.gold);
  blockers.push({ minX: -39, maxX: -22.4, minZ: -56, maxZ: 51 });
  for (let z = -28; z <= 28; z += 14) {
    bench(k, group, 16, z, 5);
    blockers.push({ minX: 14.1, maxX: 17.9, minZ: z - 0.55, maxZ: z + 0.65 });
  }
  r.sign(group, 'المدينة المنورة · MADINAH', 'Stasiun Haramain · selamat datang', [5, 6.2, -39], 22);
  const exitSign = r.sign(group, 'KELUAR · TAKSI / UBER', 'Lanjutkan perjalanan menuju Masjid Nabawi', [9, 4.3, 43], 12); exitSign.rotation.y = Math.PI;
  r.box(group, [120, 0.035, 12], [0, 0.02, 70], r.mat.asphalt);
  vehicle(k, group, 'uber', [10, 0.05, 69], Math.PI / 2);
  for (const x of [-56, -39, 39, 56]) palm(k, group, x, 63, 8.2);
  for (const side of [-1, 1]) {
    for (let index = 0; index < 5; index += 1) {
      const x = side * (55 + index * 12), height = 8 + index % 3 * 4;
      r.box(group, [10, height, 15], [x, height / 2, 95 + index % 2 * 10], r.mat.limestone);
    }
  }
  return {
    group, spawn: [-15, 1.68, 17], lookAt: [4, 5, -36], overview: [39, 17, 45], indoor: true,
    bounds: { minX: -20.6, maxX: 39, minZ: -44, maxZ: 49 }, blockers,
    landmarks: [
      { id: 'station-hall', label: 'Aula Madinah', position: [-15, 1.68, 17], lookAt: [4, 5, -36] },
      { id: 'station-train', label: 'Peron Haramain', position: [-18.6, 1.68, -8], lookAt: [-32, 2, -11] },
      { id: 'station-exit', label: 'Keluar menuju Uber', position: [9, 1.68, 37], lookAt: [10, 1.6, 70] },
      { id: 'station-roof', label: 'Atap stasiun', position: [7, 1.68, 4], lookAt: [0, 14, -10] },
    ],
    crowd: { kind: 'walk', count: 38, area: { minX: 3, maxX: 12, minZ: -33, maxZ: 36 } },
  };
}
