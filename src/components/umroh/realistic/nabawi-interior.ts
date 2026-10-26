import * as T from 'three';
import type { Position, Rect, UmrohWorld, WorldResources } from './types';

/** Original, interpretive interiors, in metres, rather than a surveyed visitor route.
 * Rawdah is represented as a prayer area between the minbar and chamber boundary.
 * Salam is viewed exclusively from outside an opaque-backed grille. No chamber
 * interior, graves, bodies, or representation of the Prophet is constructed.
 * Reference: https://www.nusuk.sa/rawdah/ (accessed 27 October 2026).
 */
interface InteriorKit {
  r: WorldResources;
  geometry: Map<string, T.BufferGeometry>;
  carpet: T.MeshStandardMaterial;
  carpetBorder: T.MeshStandardMaterial;
  screenBacking: T.MeshStandardMaterial;
  lamp: T.MeshStandardMaterial;
}

const UP = new T.Vector3(0, 1, 0);

function kit(r: WorldResources): InteriorKit {
  const carpet = r.keep(r.mat.carpet.clone());
  carpet.color.set('#245b46');
  const carpetBorder = r.keep(r.mat.fabric.clone());
  carpetBorder.color.set('#a99668');
  carpetBorder.roughness = 1;
  const screenBacking = r.keep(r.mat.green.clone());
  screenBacking.color.set('#112d27');
  screenBacking.metalness = 0;
  screenBacking.roughness = 0.98;
  const lamp = r.keep(new T.MeshStandardMaterial({
    color: '#fff2d1', emissive: '#ffe3a4', emissiveIntensity: 1.2, roughness: 0.5,
  }));
  return { r, geometry: new Map(), carpet, carpetBorder, screenBacking, lamp };
}

function geometry(k: InteriorKit, key: string, make: () => T.BufferGeometry): T.BufferGeometry {
  let value = k.geometry.get(key);
  if (!value) { value = k.r.keep(make()); k.geometry.set(key, value); }
  return value;
}

function mesh(k: InteriorKit, parent: T.Object3D, key: string, make: () => T.BufferGeometry, material: T.Material, at: Position = [0, 0, 0]): T.Mesh {
  return k.r.mesh(parent, geometry(k, key, make), material, at);
}

function rod(k: InteriorKit, parent: T.Object3D, from: Position, to: Position, radius: number, material: T.Material) {
  const start = new T.Vector3(...from), end = new T.Vector3(...to);
  const vector = end.clone().sub(start);
  const object = mesh(k, parent, 'rod', () => new T.CylinderGeometry(1, 1, 1, 6), material);
  object.position.copy(start).add(end).multiplyScalar(0.5);
  object.scale.set(radius, vector.length(), radius);
  object.quaternion.setFromUnitVectors(UP, vector.normalize());
  return object;
}

function archBand(k: InteriorKit, width: number, rise: number, band: number, depth: number): T.BufferGeometry {
  return geometry(k, `arch:${width}:${rise}:${band}:${depth}`, () => {
    const half = width / 2;
    const shape = new T.Shape();
    shape.moveTo(-half - band, 0);
    shape.quadraticCurveTo(-half - band, rise * 0.6, 0, rise + band);
    shape.quadraticCurveTo(half + band, rise * 0.6, half + band, 0);
    shape.lineTo(half, 0);
    shape.quadraticCurveTo(half, rise * 0.56, 0, rise);
    shape.quadraticCurveTo(-half, rise * 0.56, -half, 0);
    shape.closePath();
    return depth <= 0.01
      ? new T.ShapeGeometry(shape, 5)
      : new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 });
  });
}

function rosette(k: InteriorKit, parent: T.Object3D, at: Position, size = 1, material: T.Material = k.r.mat.gold) {
  const group = new T.Group();
  group.position.set(...at);
  group.scale.setScalar(size);
  parent.add(group);
  mesh(k, group, 'rosette-ring', () => new T.TorusGeometry(0.3, 0.022, 5, 20), material);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const petal = k.r.box(group, [0.055, 0.25, 0.035], [Math.sin(angle) * 0.16, Math.cos(angle) * 0.16, 0.005], material);
    petal.rotation.z = -angle;
  }
  return group;
}

function column(k: InteriorKit, group: T.Group, blockers: Rect[], x: number, z: number) {
  const { r } = k;
  r.box(group, [1.05, 0.22, 1.05], [x, 0.11, z], r.mat.marble);
  r.cylinder(group, 0.42, 0.46, 0.7, [x, 0.56, z], r.mat.limestone, 16);
  r.cylinder(group, 0.33, 0.4, 4.2, [x, 2.98, z], r.mat.marble, 16);
  for (const y of [0.97, 1.12, 4.93]) r.cylinder(group, 0.42, 0.42, 0.09, [x, y, z], r.mat.gold, 16);
  r.cylinder(group, 0.58, 0.35, 0.38, [x, 5.18, z], r.mat.darkGold, 12);
  r.box(group, [1.2, 0.25, 1.2], [x, 5.48, z], r.mat.limestone);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const leaf = mesh(k, group, 'capital-leaf', () => new T.SphereGeometry(1, 8, 6), r.mat.gold,
      [x + Math.cos(angle) * 0.44, 5.21, z + Math.sin(angle) * 0.44]);
    leaf.scale.set(0.095, 0.21, 0.065);
    leaf.rotation.y = -angle;
  }
  blockers.push({ minX: x - 0.56, maxX: x + 0.56, minZ: z - 0.56, maxZ: z + 0.56 });
}

function lamp(k: InteriorKit, group: T.Group, x: number, z: number, top = 8.05) {
  const { r } = k;
  r.cylinder(group, 0.025, 0.025, 1.25, [x, top - 0.625, z], r.mat.darkGold, 6);
  r.cylinder(group, 0.3, 0.65, 0.33, [x, top - 1.4, z], r.mat.gold, 12);
  r.cylinder(group, 0.45, 0.31, 0.55, [x, top - 1.8, z], k.lamp, 12);
  r.cylinder(group, 0.34, 0.46, 0.1, [x, top - 2.12, z], r.mat.gold, 12);
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    rod(k, group, [x + Math.cos(angle) * 0.47, top - 1.52, z + Math.sin(angle) * 0.47],
      [x + Math.cos(angle) * 0.32, top - 2.08, z + Math.sin(angle) * 0.32], 0.018, r.mat.darkGold);
  }
}

function ceiling(k: InteriorKit, group: T.Group, width: number, depth: number) {
  const { r } = k;
  r.box(group, [width, 0.28, depth], [0, 8.72, 0], r.mat.plaster);
  const half = width / 2;
  for (let z = -depth / 2 + 2; z < depth / 2; z += 4) {
    r.box(group, [width, 0.16, 0.24], [0, 8.48, z], r.mat.limestone);
    for (let x = -half + 3; x < half; x += 6) {
      r.box(group, [5.55, 0.045, 3.45], [x, 8.54, z], k.carpetBorder);
      r.box(group, [5.31, 0.055, 3.21], [x, 8.49, z], r.mat.plaster);
      const ornament = rosette(k, group, [x, 8.44, z], 1.55, r.mat.darkGold);
      ornament.rotation.x = Math.PI / 2;
    }
  }
}

/** Decorative brass pattern only: deliberately no invented Arabic inscriptions. */
function grille(k: InteriorKit, group: T.Group, at: Position, length: number, rotation: number) {
  const { r } = k;
  const screen = new T.Group();
  screen.position.set(...at);
  screen.rotation.y = rotation;
  group.add(screen);
  // This solid surface is the limit of the model, not a window into the chamber.
  r.box(screen, [length + 0.25, 8.2, 0.32], [0, 4.1, -0.19], k.screenBacking);
  r.box(screen, [length + 0.4, 0.58, 0.55], [0, 0.29, 0], r.mat.limestone);
  for (const y of [0.66, 1.02, 5.68, 6.82]) r.box(screen, [length, 0.12, 0.16], [0, y, 0.13], r.mat.gold);
  r.box(screen, [length + 0.3, 0.28, 0.55], [0, 7.05, 0], r.mat.limestone);
  r.box(screen, [length + 0.4, 0.18, 0.65], [0, 7.28, 0], r.mat.gold);
  const bays = Math.round(length / 3);
  const bay = length / bays;
  for (let i = 0; i <= bays; i++) {
    const x = -length / 2 + i * bay;
    r.box(screen, [0.19, 6.4, 0.24], [x, 3.6, 0.13], r.mat.darkGold);
    for (const y of [1.0, 5.7]) r.box(screen, [0.36, 0.28, 0.3], [x, y, 0.15], r.mat.gold);
    if (i === bays) continue;
    const center = x + bay / 2;
    for (let bar = 1; bar < 11; bar++) r.box(screen, [0.04, 4.5, 0.06], [x + bar * bay / 11, 3.34, 0.18], r.mat.gold);
    for (const y of [1.6, 2.45, 3.3, 4.15, 5]) r.box(screen, [bay - 0.15, 0.045, 0.06], [center, y, 0.2], r.mat.darkGold);
    for (const y of [2.03, 3.73, 6.25]) rosette(k, screen, [center, y, 0.25], y > 6 ? 1.12 : 0.8);
    for (const xOffset of [-0.72, 0.72]) {
      const diamond = r.box(screen, [0.55, 0.55, 0.04], [center + xOffset, 4.58, 0.23], r.mat.darkGold);
      diamond.rotation.z = Math.PI / 4;
      const inset = r.box(screen, [0.43, 0.43, 0.045], [center + xOffset, 4.58, 0.26], k.screenBacking);
      inset.rotation.z = Math.PI / 4;
    }
  }
}

function prayerCarpet(k: InteriorKit, group: T.Group) {
  const { r } = k;
  const carpet = r.floor(group, 22.4, 30.4, k.carpet);
  carpet.position.set(-0.5, 0.012, 0);
  for (const x of [-11.42, 10.42]) r.box(group, [0.15, 0.009, 30.1], [x, 0.019, 0], k.carpetBorder);
  for (let z = -14.4; z <= 14.5; z += 1.45) {
    r.box(group, [21.8, 0.008, 0.055], [-0.5, 0.021, z], k.carpetBorder);
    for (let x = -10.5; x < 10.3; x += 1.05) {
      const ornament = r.mesh(group, archBand(k, 0.57, 0.38, 0.025, 0.008), k.carpetBorder, [x, 0.023, z + 0.19]);
      ornament.rotation.x = -Math.PI / 2;
    }
  }
}

function mihrab(k: InteriorKit, group: T.Group) {
  const { r } = k;
  const niche = new T.Group();
  niche.position.set(0, 0, -16.35);
  group.add(niche);
  r.box(niche, [4.8, 6.2, 0.38], [0, 3.1, -0.1], r.mat.marble);
  r.box(niche, [2.4, 4.5, 0.08], [0, 2.5, 0.13], k.screenBacking);
  r.mesh(niche, archBand(k, 2.2, 1.65, 0.25, 0.2), r.mat.gold, [0, 3.15, 0.17]);
  for (const x of [-1.35, 1.35]) {
    r.cylinder(niche, 0.12, 0.15, 3.1, [x, 1.62, 0.3], r.mat.darkGold, 12);
    r.box(niche, [0.43, 0.18, 0.45], [x, 3.21, 0.3], r.mat.gold);
  }
  r.box(niche, [4.9, 0.3, 0.65], [0, 6.3, 0], r.mat.limestone);
  r.box(niche, [4.6, 0.15, 0.6], [0, 6.55, 0], r.mat.gold);
  for (const x of [-1.8, 1.8]) for (const y of [1.1, 2.6, 4.1, 5.55]) rosette(k, niche, [x, y, 0.2], 0.57);
}

function minbar(k: InteriorKit, group: T.Group, blockers: Rect[]) {
  const { r } = k;
  const x = -6.8;
  for (let step = 0; step < 12; step++) {
    const height = (step + 1) * 0.18;
    r.box(group, [1.65, height, 0.27], [x, height / 2, -12.25 - step * 0.25], r.mat.marble);
    r.box(group, [1.69, 0.025, 0.08], [x, height + 0.015, -12.12 - step * 0.25], r.mat.darkGold);
  }
  for (const side of [-1, 1]) {
    const railX = x + side * 0.89;
    rod(k, group, [railX, 0.95, -12.1], [railX, 3.05, -15.1], 0.06, r.mat.gold);
    for (let post = 0; post < 7; post++) {
      const z = -12.1 - post * 0.5;
      const height = 1 + post * 0.35;
      r.cylinder(group, 0.045, 0.045, 0.8, [railX, height - 0.4, z], r.mat.darkGold, 8);
    }
    for (const z of [-15.7, -14.65]) r.cylinder(group, 0.07, 0.09, 2.8, [railX, 3.5, z], r.mat.gold, 12);
  }
  r.box(group, [1.9, 0.18, 1.3], [x, 2.13, -15.3], r.mat.marble);
  r.box(group, [2.05, 0.22, 1.55], [x, 4.96, -15.2], r.mat.limestone);
  const roof = mesh(k, group, 'minbar-roof', () => new T.ConeGeometry(1.35, 1.65, 4), r.mat.green, [x, 5.88, -15.2]);
  roof.rotation.y = Math.PI / 4;
  r.cylinder(group, 0.025, 0.075, 0.65, [x, 6.98, -15.2], r.mat.gold, 8);
  blockers.push({ minX: -8.1, maxX: -5.5, minZ: -16.4, maxZ: -11.8 });
}

export function createRawdahWorld(r: WorldResources): UmrohWorld {
  const k = kit(r), group = new T.Group();
  group.name = 'Rawdah — ruang belajar ziarah';
  const blockers: Rect[] = [];
  r.floor(group, 27, 36, r.mat.marble);
  prayerCarpet(k, group);
  for (const x of [-12.75, 12.75]) r.box(group, [0.5, 8.7, 36], [x, 4.35, 0], r.mat.plaster);
  for (const z of [-17.5, 17.5]) r.box(group, [26, 8.7, 0.5], [0, 4.35, z], r.mat.plaster);
  ceiling(k, group, 26, 35);

  const xs = [-9, -3, 3, 9], zs = [-10, -2, 6, 14];
  for (const x of xs) for (const z of zs) column(k, group, blockers, x, z);
  for (const z of zs) for (let i = 0; i < xs.length - 1; i++) {
    r.mesh(group, archBand(k, 5.0, 2.12, 0.28, 0.45), r.mat.limestone, [(xs[i] + xs[i + 1]) / 2, 5.46, z - 0.225]);
    r.mesh(group, archBand(k, 4.96, 2.1, 0.065, 0.47), r.mat.gold, [(xs[i] + xs[i + 1]) / 2, 5.46, z - 0.235]);
  }
  for (const x of xs) for (let i = 0; i < zs.length - 1; i++) {
    const arc = r.mesh(group, archBand(k, 7.0, 2.17, 0.3, 0.45), r.mat.plaster, [x - 0.225, 5.46, (zs[i] + zs[i + 1]) / 2]);
    arc.rotation.y = Math.PI / 2;
  }
  for (const x of [-6, 0, 6]) for (const z of [-6, 2, 10]) lamp(k, group, x, z);
  for (const z of [-6, 8]) {
    const glow = new T.PointLight('#ffe6bd', 17, 20, 2);
    glow.position.set(0, 6.3, z);
    group.add(glow);
  }
  mihrab(k, group);
  minbar(k, group, blockers);
  grille(k, group, [11.9, 0, 0], 29, -Math.PI / 2);
  blockers.push(
    { minX: 11.35, maxX: 13.5, minZ: -18, maxZ: 18 },
    { minX: -2.5, maxX: 2.5, minZ: -17.5, maxZ: -15.9 },
  );
  return {
    group, indoor: true,
    spawn: [0, 1.68, 13], lookAt: [0, 3.2, -13], overview: [0, 5.4, 12],
    bounds: { minX: -11.8, maxX: 10.8, minZ: -15.2, maxZ: 15.9 }, blockers,
    landmarks: [
      { id: 'rawdah-prayer', label: 'Area Rawdah', position: [0, 1.68, 9], lookAt: [0, 3, -12] },
      { id: 'rawdah-mihrab', label: 'Mihrab', position: [0, 1.68, -11.6], lookAt: [0, 3, -16.2] },
      { id: 'rawdah-minbar', label: 'Minbar', position: [-4.5, 1.68, -9.2], lookAt: [-6.8, 3, -14.7] },
      { id: 'rawdah-arcades', label: 'Pilar dan lengkung', position: [0, 1.68, 1], lookAt: [-3, 5.5, -2] },
    ],
    crowd: { kind: 'walk', count: 22, area: { minX: -1.4, maxX: 1.4, minZ: -8, maxZ: 10 } },
  };
}

export function createSalamWorld(r: WorldResources): UmrohWorld {
  const k = kit(r), group = new T.Group();
  group.name = 'Ziarah salam — sisi luar kisi';
  const blockers: Rect[] = [{ minX: 3.15, maxX: 6, minZ: -20, maxZ: 20 }];
  r.floor(group, 11, 42, r.mat.marble);
  r.box(group, [0.4, 8.7, 42], [-5.1, 4.35, 0], r.mat.plaster);
  r.box(group, [11, 8.7, 0.5], [0, 4.35, 20.5], r.mat.plaster);
  r.box(group, [11, 8.7, 0.5], [0, 4.35, -20.5], r.mat.plaster);
  for (const x of [-3.2, 2.65]) r.box(group, [0.1, 0.01, 39], [x, 0.01, 0], r.mat.darkGold);
  for (let z = -19; z <= 19; z += 2.1) r.box(group, [9.4, 0.008, 0.018], [-0.4, 0.009, z], r.mat.limestone);
  ceiling(k, group, 11, 41);
  grille(k, group, [4.15, 0, 0], 39, -Math.PI / 2);
  for (let z = -18; z <= 18; z += 6) {
    column(k, group, blockers, -4.05, z);
    // Matching pilasters lie within the closed boundary, away from the public aisle.
    r.box(group, [0.65, 5.6, 0.75], [3.85, 2.8, z], r.mat.marble);
    r.box(group, [0.95, 0.25, 1.1], [3.85, 5.5, z], r.mat.gold);
    r.mesh(group, archBand(k, 7.05, 2.1, 0.3, 0.4), r.mat.limestone, [-0.1, 5.46, z - 0.2]);
    if (z > -18) lamp(k, group, -0.3, z - 3);
    const wallPanel = rosette(k, group, [-4.86, 3.5, z + 2.7], 1.5, r.mat.darkGold);
    wallPanel.rotation.y = Math.PI / 2;
  }
  for (const z of [-10, 8]) {
    const glow = new T.PointLight('#ffe9c8', 13, 17, 2);
    glow.position.set(-0.5, 6.3, z);
    group.add(glow);
  }
  return {
    group, indoor: true,
    spawn: [-1.2, 1.68, 13], lookAt: [4.15, 2.8, 0], overview: [-1.2, 4.9, 12],
    bounds: { minX: -3.1, maxX: 2.75, minZ: -17, maxZ: 17 }, blockers,
    landmarks: [
      { id: 'salam-grille', label: 'Sisi luar kisi ziarah', position: [0.6, 1.68, -2], lookAt: [4.15, 2.4, -2] },
      { id: 'salam-aisle', label: 'Lorong ziarah', position: [-1.2, 1.68, 13], lookAt: [-0.5, 2.2, -15] },
      { id: 'salam-architecture', label: 'Arsitektur lorong', position: [-0.8, 1.68, -10], lookAt: [3.8, 5.5, -6] },
    ],
    crowd: { kind: 'walk', count: 18, area: { minX: -2.3, maxX: 1.3, minZ: -13, maxZ: 13 } },
  };
}
