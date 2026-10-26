import * as T from 'three';
import type { Position, Rect, UmrohWorld, WorldResources } from './types';

/*
 * Original architectural reconstructions, measured in metres. These are recognisable,
 * walkable learning environments, not surveyed replicas or live visitor directions.
 * References: alharamain.gov.sa/public/?page=umbrellas-en and nabawi-architecture-en;
 * SPA w1720120 (14.4/15.3 m open umbrellas, 21.7 m closed);
 * visitmadinahsa.com/sa-en/destinations/Al-Miqat----Mosque.
 * No reference photographs or third-party models are embedded in these worlds.
 */

interface Kit {
  r: WorldResources;
  cache: Map<string, T.BufferGeometry>;
  cloth: T.MeshStandardMaterial;
  leaves: T.MeshStandardMaterial;
}

const UP = new T.Vector3(0, 1, 0);

function kit(r: WorldResources): Kit {
  const cloth = r.keep(r.mat.fabric.clone());
  cloth.side = T.DoubleSide;
  const leaves = r.keep(r.mat.green.clone());
  leaves.side = T.DoubleSide;
  leaves.roughness = 0.94;
  return { r, cache: new Map(), cloth, leaves };
}

function geometry(k: Kit, key: string, make: () => T.BufferGeometry): T.BufferGeometry {
  let value = k.cache.get(key);
  if (!value) {
    value = k.r.keep(make());
    k.cache.set(key, value);
  }
  return value;
}

function mesh(k: Kit, parent: T.Object3D, key: string, make: () => T.BufferGeometry, material: T.Material, at: Position = [0, 0, 0]): T.Mesh {
  const object = k.r.mesh(parent, geometry(k, key, make), material, at);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function rod(k: Kit, parent: T.Object3D, from: Position, to: Position, radius: number, material: T.Material): void {
  const start = new T.Vector3(...from);
  const end = new T.Vector3(...to);
  const vector = end.clone().sub(start);
  const object = mesh(k, parent, 'rod', () => new T.CylinderGeometry(1, 1, 1, 6), material);
  object.position.copy(start).add(end).multiplyScalar(0.5);
  object.scale.set(radius, vector.length(), radius);
  object.quaternion.setFromUnitVectors(UP, vector.normalize());
}

function archOutline(path: T.Path, width: number, height: number, bottom = 0): void {
  const spring = bottom + height * 0.61;
  path.moveTo(-width / 2, bottom);
  path.lineTo(width / 2, bottom);
  path.lineTo(width / 2, spring);
  path.quadraticCurveTo(width * 0.47, bottom + height * 0.88, 0, bottom + height);
  path.quadraticCurveTo(-width * 0.47, bottom + height * 0.88, -width / 2, spring);
  path.closePath();
}

function arch(k: Kit, parent: T.Object3D, at: Position, width: number, height: number, frameMaterial: T.Material, filled = true): void {
  if (filled) {
    const inset = mesh(k, parent, 'arch-inset', () => {
      const shape = new T.Shape();
      archOutline(shape, 1, 1);
      return new T.ShapeGeometry(shape, 12);
    }, k.r.mat.darkStone, [at[0], at[1], at[2] - 0.11]);
    inset.scale.set(width, height, 1);
  }
  const frame = mesh(k, parent, 'arch-frame', () => {
    const shape = new T.Shape();
    archOutline(shape, 1, 1);
    const opening = new T.Path();
    archOutline(opening, 0.84, 0.9, 0.035);
    shape.holes.push(opening);
    return new T.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 12 });
  }, frameMaterial, at);
  frame.scale.set(width, height, 0.35);
}

function finial(k: Kit, parent: T.Object3D, at: Position, scale = 1): void {
  const group = new T.Group();
  group.position.set(...at);
  group.scale.setScalar(scale);
  k.r.cylinder(group, 0.045, 0.07, 1.8, [0, 0.9, 0], k.r.mat.gold, 8);
  k.r.sphere(group, [0.18, 0.18, 0.18], [0, 0.5, 0], k.r.mat.gold);
  const crescent = mesh(k, group, 'crescent', () => new T.TorusGeometry(0.39, 0.075, 8, 24, Math.PI * 1.5), k.r.mat.gold, [0, 2.02, 0]);
  crescent.rotation.z = Math.PI / 4;
  parent.add(group);
}

function dome(k: Kit, parent: T.Object3D, at: Position, radius: number, rise: number, material: T.Material, ribs = 0): void {
  k.r.cylinder(parent, radius, radius, 0.65, [at[0], at[1] + 0.32, at[2]], k.r.mat.limestone, 32);
  const object = mesh(k, parent, 'dome', () => new T.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), material, [at[0], at[1] + 0.65, at[2]]);
  object.scale.set(radius, rise, radius);
  if (ribs) {
    for (let index = 0; index < ribs; index += 1) {
      const angle = index / ribs * Math.PI * 2;
      const points: T.Vector3[] = [];
      for (let step = 0; step <= 12; step += 1) {
        const phi = step / 12 * Math.PI / 2;
        points.push(new T.Vector3(Math.sin(phi) * radius * Math.cos(angle), Math.cos(phi) * rise + 0.65, Math.sin(phi) * radius * Math.sin(angle)));
      }
      mesh(k, parent, `dome-rib-${radius}-${rise}-${index}`, () => new T.TubeGeometry(new T.CatmullRomCurve3(points), 12, 0.035, 4, false), material, at);
    }
  }
  finial(k, parent, [at[0], at[1] + rise + 0.65, at[2]], radius > 5 ? 1.25 : 0.6);
}

function minaret(k: Kit, parent: T.Object3D, x: number, z: number, height = 49): void {
  const group = new T.Group();
  group.position.set(x, 0, z);
  const scale = height / 49;
  group.scale.setScalar(scale);
  const { r } = k;
  r.box(group, [5.2, 11, 5.2], [0, 5.5, 0], r.mat.limestone);
  for (const y of [1, 9.8, 11.3]) r.box(group, [5.55, 0.35, 5.55], [0, y, 0], r.mat.marble);
  r.cylinder(group, 1.48, 2.15, 16, [0, 19.4, 0], r.mat.plaster, 8);
  r.cylinder(group, 1.08, 1.4, 10, [0, 33.3, 0], r.mat.limestone, 16);
  r.cylinder(group, 0.8, 1.05, 5.5, [0, 41.4, 0], r.mat.plaster, 16);
  for (const [y, radius] of [[12, 2.9], [27.4, 2.3], [38.5, 1.85]] as const) {
    r.cylinder(group, radius, radius - 0.45, 0.8, [0, y, 0], r.mat.marble, 16);
    r.cylinder(group, radius, radius, 0.16, [0, y + 1.25, 0], r.mat.gold, 24);
    for (let index = 0; index < 16; index += 1) {
      const angle = index / 16 * Math.PI * 2;
      r.cylinder(group, 0.065, 0.075, 0.95, [Math.cos(angle) * (radius - 0.11), y + 0.72, Math.sin(angle) * (radius - 0.11)], r.mat.limestone, 5);
    }
  }
  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * Math.PI * 2;
    const window = r.box(group, [0.4, 2.9, 0.07], [Math.sin(angle) * 1.62, 21.8, Math.cos(angle) * 1.62], r.mat.darkStone);
    window.rotation.y = angle;
  }
  r.cylinder(group, 1.12, 1.12, 0.4, [0, 43.8, 0], r.mat.gold, 16);
  r.cylinder(group, 0.07, 1.12, 3.6, [0, 45.7, 0], r.mat.green, 24);
  finial(k, group, [0, 47.5, 0], 0.8);
  parent.add(group);
}

function palm(k: Kit, parent: T.Object3D, x: number, z: number, height = 8): void {
  const group = new T.Group();
  group.position.set(x, 0, z);
  k.r.cylinder(group, 0.19, 0.35, height, [0, height / 2, 0], k.r.mat.wood, 10);
  for (let index = 0; index < 10; index += 1) {
    const ring = mesh(k, group, 'palm-trunk-ring', () => new T.TorusGeometry(0.27, 0.035, 4, 10), k.r.mat.wood, [0, height * (0.12 + index * 0.075), 0]);
    ring.rotation.x = Math.PI / 2;
  }
  for (let index = 0; index < 11; index += 1) {
    const frond = mesh(k, group, 'palm-frond', () => {
      const vertices: number[] = [];
      const indices: number[] = [];
      // Tapered, bent fronds with a central ridge, not ellipsoid foliage blobs.
      for (let segment = 0; segment <= 12; segment += 1) {
        const t = segment / 12;
        const width = Math.sin(Math.PI * t) * 0.5;
        const y = Math.sin(t * Math.PI) * 0.8 - t * t * 1.0;
        vertices.push(-width, y, t * 4.7, 0, y + 0.12, t * 4.7, width, y, t * 4.7);
        if (segment < 12) {
          const i = segment * 3;
          indices.push(i, i + 3, i + 1, i + 1, i + 3, i + 4, i + 1, i + 4, i + 2, i + 2, i + 4, i + 5);
        }
      }
      const result = new T.BufferGeometry();
      result.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
      result.setIndex(indices);
      result.computeVertexNormals();
      return result;
    }, k.leaves, [0, height, 0]);
    frond.rotation.y = index / 11 * Math.PI * 2;
    frond.rotation.x = index % 2 ? -0.18 : 0.12;
    const scale = 0.84 + index % 3 * 0.1;
    frond.scale.setScalar(scale);
  }
  parent.add(group);
}

function canopyGeometry(): T.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const rings = 8;
  const sectors = 64;
  for (let ring = 0; ring <= rings; ring += 1) {
    const t = Math.max(0.001, ring / rings);
    for (let sector = 0; sector <= sectors; sector += 1) {
      const angle = sector / sectors * Math.PI * 2;
      const reach = 12.75 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
      const x = Math.cos(angle) * reach * t;
      const z = Math.sin(angle) * reach * t;
      const y = 15.3 - 2.1 * Math.pow(t, 0.7) - 0.6 * Math.cos(4 * angle) * t * t + 0.13 * Math.cos(16 * angle) * t;
      positions.push(x, y, z);
      uvs.push(x / 25.5 + 0.5, z / 25.5 + 0.5);
      if (ring < rings && sector < sectors) {
        const i = ring * (sectors + 1) + sector;
        indices.push(i, i + sectors + 1, i + 1, i + 1, i + sectors + 1, i + sectors + 2);
      }
    }
  }
  const result = new T.BufferGeometry();
  result.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  result.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
  result.setIndex(indices);
  result.computeVertexNormals();
  return result;
}

function foldedGeometry(): T.BufferGeometry {
  const profile = [[10.9, 0.65], [12.3, 1.15], [15.8, 0.98], [19.7, 0.45], [21.4, 0.1]];
  const vertices: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const sectors = 48;
  profile.forEach(([height, baseRadius], level) => {
    for (let sector = 0; sector <= sectors; sector += 1) {
      const angle = sector / sectors * Math.PI * 2;
      const radius = baseRadius * (1 + 0.16 * Math.cos(angle * 12));
      vertices.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      uv.push(sector / sectors, level / (profile.length - 1));
      if (level < profile.length - 1 && sector < sectors) {
        const i = level * (sectors + 1) + sector;
        indices.push(i, i + 1, i + sectors + 1, i + 1, i + sectors + 2, i + sectors + 1);
      }
    }
  });
  const result = new T.BufferGeometry();
  result.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
  result.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  result.setIndex(indices);
  result.computeVertexNormals();
  return result;
}

function umbrella(k: Kit, parent: T.Object3D, x: number, z: number, folded: boolean, lower = false): void {
  const group = new T.Group();
  group.position.set(x, 0, z);
  const { r } = k;
  r.box(group, [1.28, 0.55, 1.28], [0, 0.275, 0], r.mat.darkStone);
  r.box(group, [0.95, 4.2, 0.95], [0, 2.5, 0], r.mat.limestone);
  r.cylinder(group, 0.27, 0.38, 10, [0, 9.3, 0], r.mat.limestone, 12);
  for (const y of [0.7, 2.9, 4.5, 10.8]) r.cylinder(group, 0.56, 0.56, 0.16, [0, y, 0], r.mat.gold, 12);
  // Four lanterns and characteristic mist fans around the column at human scale.
  for (let side = 0; side < 4; side += 1) {
    const angle = side * Math.PI / 2;
    const xSide = Math.cos(angle);
    const zSide = Math.sin(angle);
    r.box(group, [0.27, 1.15, 0.27], [xSide * 0.67, 5.25, zSide * 0.67], r.mat.gold);
    r.box(group, [0.19, 0.88, 0.19], [xSide * 0.67, 5.25, zSide * 0.67], r.mat.white);
    const fan = mesh(k, group, 'umbrella-fan', () => new T.CylinderGeometry(0.4, 0.4, 0.17, 16), r.mat.metal, [xSide * 0.7, 3.6, zSide * 0.7]);
    fan.quaternion.setFromUnitVectors(UP, new T.Vector3(xSide, 0, zSide));
  }
  if (folded) {
    mesh(k, group, 'umbrella-folded', foldedGeometry, k.cloth);
    r.cylinder(group, 0.035, 0.12, 0.3, [0, 21.55, 0], r.mat.gold, 8);
    for (let index = 0; index < 12; index += 1) {
      const angle = index / 12 * Math.PI * 2;
      const points = [[11, 0.68], [12.3, 1.2], [15.8, 1.02], [19.7, 0.48], [21.4, 0.12]].map(([y, radius]) => new T.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
      mesh(k, group, `folded-rib-${index}`, () => new T.TubeGeometry(new T.CatmullRomCurve3(points), 16, 0.025, 4, false), r.mat.darkGold);
    }
  } else {
    const canopy = new T.Group();
    canopy.position.y = lower ? -0.9 : 0;
    mesh(k, canopy, 'umbrella-canopy', canopyGeometry, k.cloth);
    r.cylinder(canopy, 0.04, 0.15, 0.7, [0, 15.65, 0], r.mat.gold, 8);
    for (let index = 0; index < 16; index += 1) {
      const angle = index / 16 * Math.PI * 2;
      const reach = 12.75 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
      const points: T.Vector3[] = [];
      for (let step = 0; step <= 8; step += 1) {
        const t = step / 8;
        const y = 15.3 - 2.1 * Math.pow(t, 0.7) - 0.6 * Math.cos(4 * angle) * t * t + 0.13 * Math.cos(16 * angle) * t - 0.07;
        points.push(new T.Vector3(Math.cos(angle) * reach * t, y, Math.sin(angle) * reach * t));
      }
      mesh(k, canopy, `open-rib-${index}`, () => new T.TubeGeometry(new T.CatmullRomCurve3(points), 12, 0.055, 4, false), r.mat.darkGold);
      const tip = points[points.length - 1];
      rod(k, canopy, [0, 10.9, 0], [tip.x * 0.58, 13.35, tip.z * 0.58], 0.06, r.mat.metal);
    }
    group.add(canopy);
  }
  parent.add(group);
}

function door(k: Kit, parent: T.Object3D, x: number, z: number, gold = true): void {
  const { r } = k;
  const panel = gold ? r.mat.darkGold : r.mat.wood;
  r.box(parent, [2.55, 3.8, 0.14], [x, 1.92, z], panel);
  for (const side of [-1, 1]) {
    r.box(parent, [0.035, 3.55, 0.09], [x + side * 1.08, 1.92, z + 0.1], r.mat.gold);
    for (const y of [0.65, 1.7, 2.75]) {
      r.box(parent, [0.91, 0.87, 0.08], [x + side * 0.6, y, z + 0.1], gold ? r.mat.gold : r.mat.darkGold);
      r.box(parent, [0.72, 0.66, 0.08], [x + side * 0.6, y, z + 0.15], panel);
      const ornament = r.box(parent, [0.26, 0.26, 0.07], [x + side * 0.6, y, z + 0.21], r.mat.gold);
      ornament.rotation.z = Math.PI / 4;
    }
    r.sphere(parent, [0.05, 0.1, 0.04], [x + side * 0.15, 1.65, z + 0.25], r.mat.gold);
  }
}

function pavingLines(k: Kit, parent: T.Object3D, width: number, depth: number, zCenter: number, spacing = 8): void {
  // Long marble inlays create perspective cues at eye height; the marble shader supplies fine joints.
  for (let x = -width / 2; x <= width / 2; x += spacing) k.r.box(parent, [0.055, 0.008, depth], [x, 0.012, zCenter], k.r.mat.darkStone);
  for (let z = zCenter - depth / 2; z <= zCenter + depth / 2; z += spacing) k.r.box(parent, [width, 0.008, 0.055], [0, 0.013, z], k.r.mat.darkStone);
}

function planter(k: Kit, parent: T.Object3D, blockers: Rect[], x: number, z: number, height = 8): void {
  k.r.box(parent, [3.8, 0.45, 3.8], [x, 0.225, z], k.r.mat.limestone);
  k.r.box(parent, [3.25, 0.08, 3.25], [x, 0.48, z], k.r.mat.sand);
  palm(k, parent, x, z, height);
  blockers.push({ minX: x - 2.1, maxX: x + 2.1, minZ: z - 2.1, maxZ: z + 2.1 });
}

function placeSign(k: Kit, parent: T.Object3D, title: string, subtitle: string, at: Position, width: number): void {
  k.r.sign(parent, title, subtitle, at, width);
  k.r.cylinder(parent, 0.045, 0.045, at[1] - 0.2, [at[0], (at[1] - 0.2) / 2, at[2]], k.r.mat.darkGold, 6);
}

export function createNabawiWorld(r: WorldResources): UmrohWorld {
  const k = kit(r);
  const group = new T.Group();
  group.name = 'Masjid Nabawi — pelataran selatan';
  const blockers: Rect[] = [{ minX: -94, maxX: 94, minZ: -47, maxZ: 4.4 }];
  const ground = r.floor(group, 320, 310, r.mat.marble);
  ground.position.z = 32;
  pavingLines(k, group, 224, 112, 56, 8);

  // Broad limestone wall, deep portico and human-sized timber/gold doors.
  r.box(group, [182, 14.5, 38], [0, 7.25, -24], r.mat.limestone);
  r.box(group, [185, 0.45, 40], [0, 14.62, -24], r.mat.marble);
  r.box(group, [182.8, 0.2, 39], [0, 15.02, -24], r.mat.darkGold);
  r.box(group, [182, 1.1, 1.1], [0, 15.62, -4.3], r.mat.limestone);
  r.box(group, [185, 1.15, 8], [0, 10.6, -0.55], r.mat.limestone);
  r.box(group, [186, 0.23, 8.5], [0, 11.27, -0.55], r.mat.marble);
  for (let index = -11; index <= 11; index += 1) {
    const x = index * 7.65;
    arch(k, group, [x, 0.06, -4.7], 5.25, 8.8, r.mat.marble);
    door(k, group, x, -4.56);
    // Glazed lattice above the door sits inside the pointed recess.
    for (const dx of [-0.72, 0, 0.72]) r.box(group, [0.065, 2.25, 0.08], [x + dx, 5.4, -4.45], r.mat.gold);
    for (const y of [4.45, 5.1, 5.75, 6.4]) r.box(group, [2.2, 0.065, 0.08], [x, y, -4.44], r.mat.gold);
    arch(k, group, [x, 0.04, 3.2], 6.55, 10.3, r.mat.limestone, false);
    const colX = x - 3.53;
    r.box(group, [0.95, 0.7, 0.95], [colX, 0.35, 2.8], r.mat.darkStone);
    r.cylinder(group, 0.36, 0.44, 6.8, [colX, 4.05, 2.8], r.mat.marble, 16);
    for (const y of [0.82, 6.95, 7.5]) r.box(group, [0.9, 0.25, 0.9], [colX, y, 2.8], r.mat.gold);
    r.box(group, [1.14, 1.4, 1.14], [colX, 8.05, 2.8], r.mat.limestone);
    arch(k, group, [x, 11.85, -4.25], 2.1, 2.65, r.mat.marble);
    for (const side of [-1, 1]) r.box(group, [0.25, 1.9, 0.38], [x + side * 2.8, 13.15, -4.05], r.mat.marble);
    // Repeated small merlons, with triangular teeth rather than a flat roof silhouette.
    for (const offset of [-2.4, 0, 2.4]) {
      r.box(group, [0.78, 0.58, 0.7], [x + offset, 16.42, -4.3], r.mat.marble);
      const tooth = mesh(k, group, 'nabawi-parapet-tooth', () => new T.ConeGeometry(0.54, 0.55, 4), r.mat.marble, [x + offset, 16.98, -4.3]);
      tooth.rotation.y = Math.PI / 4;
    }
  }
  // The historic green dome stays off-centre and clearly visible down the central avenue.
  r.box(group, [19.5, 3.7, 19.5], [29, 16.6, -15], r.mat.plaster);
  r.cylinder(group, 8.8, 9.3, 2.3, [29, 19.6, -15], r.mat.plaster, 32);
  dome(k, group, [29, 20.75, -15], 8.8, 10.2, r.mat.green, 24);
  // Other roof domes provide a layered roofline without implying an exact dome count.
  for (const x of [-62, -38, -14, 64]) dome(k, group, [x, 15.5, -23], 6.6, 3.6, r.mat.plaster);
  minaret(k, group, -88, -8, 50);
  minaret(k, group, 88, -8, 50);
  minaret(k, group, -65, -39, 47);
  minaret(k, group, 50, -32, 43);

  // The open canopies use the documented 25.5 m square footprint. Closed ones
  // preserve the vista toward the dome while showing their pleated 21.7 m form.
  for (const x of [-70, -43, 43, 70]) {
    for (let row = 0; row < 3; row += 1) {
      const z = 22 + row * 27;
      umbrella(k, group, x, z, false, (Math.round(x) + row) % 2 === 0);
      blockers.push({ minX: x - 0.95, maxX: x + 0.95, minZ: z - 0.95, maxZ: z + 0.95 });
    }
  }
  for (const x of [-15, 15]) {
    for (const z of [24, 52, 80]) {
      umbrella(k, group, x, z, true);
      blockers.push({ minX: x - 0.95, maxX: x + 0.95, minZ: z - 0.95, maxZ: z + 0.95 });
    }
  }
  for (const x of [-103, 103]) {
    for (const z of [12, 35, 58, 81, 104]) planter(k, group, blockers, x, z, 8.5 + z % 3);
    r.box(group, [1, 1.15, 130], [x + Math.sign(x) * 4, 0.575, 52], r.mat.limestone);
  }
  // Low background volumes ensure the plaza meets a city edge, never a floating platform.
  for (const side of [-1, 1]) {
    for (let index = 0; index < 5; index += 1) {
      const x = side * (116 + (index % 2) * 5);
      const z = index * 29 - 4;
      const height = 16 + index % 3 * 5;
      r.box(group, [18, height, 25], [x, height / 2, z], r.mat.limestone);
      for (let level = 0; level < 4; level += 1) {
        for (let bay = -2; bay <= 2; bay += 1) r.box(group, [0.07, 1.7, 1.35], [x - side * 9.04, 3 + level * 3.2, z + bay * 3.4], r.mat.glass);
      }
    }
  }
  placeSign(k, group, 'MASJID NABAWI', 'Madinah · ziarah sebelum perjalanan umroh', [-7.8, 2.45, 66], 4.7);

  return {
    group,
    spawn: [2.5, 1.68, 73],
    lookAt: [21, 12.5, -10],
    overview: [101, 63, 130],
    bounds: { minX: -96, maxX: 96, minZ: 5.2, maxZ: 106 },
    blockers,
    landmarks: [
      { id: 'nabawi-dome', label: 'Kubah Hijau', position: [24, 1.68, 36], lookAt: [29, 26, -15] },
      { id: 'nabawi-umbrellas', label: 'Pelataran payung', position: [-32, 1.68, 62], lookAt: [-43, 13.2, 49] },
      { id: 'nabawi-arcade', label: 'Serambi Nabawi', position: [-9, 1.68, 12], lookAt: [-15, 5.2, -4] },
      { id: 'nabawi-plaza', label: 'Halaman utama', position: [2.5, 1.68, 73], lookAt: [21, 12.5, -10] },
    ],
    crowd: { kind: 'walk', count: 105, area: { minX: -12, maxX: 12, minZ: 9, maxZ: 94 } },
  };
}

function spiralMinaret(k: Kit, parent: T.Object3D, x: number, z: number): void {
  const group = new T.Group();
  group.position.set(x, 0, z);
  const { r } = k;
  r.box(group, [8, 13, 8], [0, 6.5, 0], r.mat.plaster);
  r.cylinder(group, 2.35, 3.45, 30, [0, 28, 0], r.mat.plaster, 20);
  // Three rising bands describe Bir Ali's distinctive spiral profile.
  const spiral = new T.CatmullRomCurve3(Array.from({ length: 151 }, (_, index) => {
    const t = index / 150;
    const angle = t * Math.PI * 6;
    const radius = 3.6 - t * 1.1;
    return new T.Vector3(Math.cos(angle) * radius, 12.5 + t * 31, Math.sin(angle) * radius);
  }));
  mesh(k, group, 'birali-spiral', () => new T.TubeGeometry(spiral, 150, 0.38, 8, false), r.mat.limestone);
  r.cylinder(group, 3.25, 2.45, 0.8, [0, 43.6, 0], r.mat.limestone, 20);
  r.cylinder(group, 2.85, 2.85, 1.5, [0, 44.7, 0], r.mat.plaster, 20);
  r.cylinder(group, 1.4, 1.7, 6.5, [0, 48.7, 0], r.mat.plaster, 16);
  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * Math.PI * 2;
    const opening = r.box(group, [0.55, 2.6, 0.09], [Math.sin(angle) * 1.56, 48.9, Math.cos(angle) * 1.56], r.mat.darkStone);
    opening.rotation.y = angle;
  }
  dome(k, group, [0, 52, 0], 1.7, 2.6, r.mat.plaster);
  parent.add(group);
}

function crenellations(k: Kit, parent: T.Object3D, width: number, y: number, z: number): void {
  for (let x = -width / 2; x <= width / 2; x += 1.8) {
    k.r.box(parent, [1.05, 1.1, 0.9], [x, y, z], k.r.mat.plaster);
    k.r.box(parent, [0.63, 0.35, 0.9], [x, y + 0.7, z], k.r.mat.plaster);
  }
}

export function createBirAliWorld(r: WorldResources): UmrohWorld {
  const k = kit(r);
  const group = new T.Group();
  group.name = 'Bir Ali — miqat Dzulhulaifah';
  const blockers: Rect[] = [
    { minX: -55, maxX: 55, minZ: -47, maxZ: -3.4 },
    { minX: -55, maxX: -42, minZ: -12, maxZ: 65 },
    { minX: 42, maxX: 55, minZ: -12, maxZ: 65 },
  ];
  const ground = r.floor(group, 220, 220, r.mat.paving);
  ground.position.z = 24;
  const plaza = r.floor(group, 83, 75, r.mat.marble);
  plaza.position.set(0, 0.008, 31);
  pavingLines(k, group, 80, 68, 31, 5);
  r.box(group, [108, 11.5, 39], [0, 5.75, -25], r.mat.plaster);
  r.box(group, [110, 0.5, 40], [0, 11.6, -25], r.mat.limestone);
  r.box(group, [109, 1.2, 1], [0, 12.2, -5.2], r.mat.plaster);
  crenellations(k, group, 107, 13.3, -5.2);
  // The portico is deliberately open in front of the shaded door recesses.
  r.box(group, [91, 0.65, 7], [0, 10.5, -1], r.mat.plaster);
  for (let index = -6; index <= 6; index += 1) {
    const x = index * 6.6;
    arch(k, group, [x, 0.04, -5.1], 4.9, 8.7, r.mat.limestone);
    door(k, group, x, -4.96, false);
    arch(k, group, [x, 0.03, 2.25], 5.8, 10.3, r.mat.plaster, false);
    for (const side of [-1, 1]) {
      r.box(group, [0.56, 5.75, 0.7], [x + side * 3.0, 2.9, 1.9], r.mat.limestone);
      r.box(group, [0.9, 0.3, 1], [x + side * 3.0, 5.9, 1.9], r.mat.plaster);
    }
    dome(k, group, [x, 11.85, -10], 2.7, 3.1, r.mat.plaster);
    blockers.push({ minX: x - 3.42, maxX: x - 2.58, minZ: 1.2, maxZ: 2.7 });
    blockers.push({ minX: x + 2.58, maxX: x + 3.42, minZ: 1.2, maxZ: 2.7 });
  }
  r.box(group, [17, 4.5, 17], [0, 13.9, -23], r.mat.plaster);
  dome(k, group, [0, 16.15, -23], 7.5, 8.5, r.mat.plaster, 20);
  spiralMinaret(k, group, -46, -25);

  // Side galleries enclose a garden court; their arches face the walkable plaza.
  for (const side of [-1, 1]) {
    const wing = new T.Group();
    wing.position.set(side * 48, 0, 26);
    wing.rotation.y = -side * Math.PI / 2;
    r.box(wing, [77, 7.8, 12], [0, 3.9, -6], r.mat.plaster);
    r.box(wing, [78, 0.4, 12.5], [0, 8.0, -6], r.mat.limestone);
    crenellations(k, wing, 76, 8.8, 0);
    for (let index = -5; index <= 5; index += 1) {
      arch(k, wing, [index * 6.7, 0.04, 0.04], 4.35, 6.9, r.mat.limestone);
      if (index % 2 === 0) door(k, wing, index * 6.7, 0.15, false);
      else {
        for (let bar = -2; bar <= 2; bar += 1) r.box(wing, [0.065, 3.4, 0.07], [index * 6.7 + bar * 0.5, 2.5, 0.23], r.mat.darkGold);
      }
    }
    group.add(wing);
  }
  for (const x of [-31, 31]) {
    for (const z of [12, 29, 46, 63]) planter(k, group, blockers, x, z, 8.2 + (z % 3) * 0.7);
  }
  // A low shaded water point and benches provide recognisable miqat services.
  r.box(group, [7, 1.1, 2.2], [27, 0.55, 4.2], r.mat.limestone);
  r.box(group, [7.3, 0.13, 2.4], [27, 1.16, 4.2], r.mat.marble);
  for (let index = -2; index <= 2; index += 1) {
    r.cylinder(group, 0.25, 0.25, 0.6, [27 + index * 1.1, 1.53, 4.2], r.mat.metal, 12);
    r.box(group, [0.12, 0.16, 0.26], [27 + index * 1.1, 1.1, 5.45], r.mat.metal);
  }
  blockers.push({ minX: 23.1, maxX: 30.9, minZ: 2.8, maxZ: 5.8 });
  for (const x of [-21, 21]) {
    for (const z of [20, 52]) {
      r.box(group, [4.3, 0.15, 0.85], [x, 0.53, z], r.mat.limestone);
      for (const offset of [-1.65, 1.65]) r.box(group, [0.3, 0.45, 0.65], [x + offset, 0.24, z], r.mat.plaster);
      blockers.push({ minX: x - 2.45, maxX: x + 2.45, minZ: z - 0.75, maxZ: z + 0.75 });
    }
  }
  placeSign(k, group, 'MIQAT BIR ALI', 'Dzulhulaifah · bersiap niat umroh', [-8, 2.3, 41], 4.2);
  const wallSign = r.sign(group, 'MASJID DZULHULAIFAH', 'Miqat bagi perjalanan dari Madinah', [0, 6.1, 2.8], 8.5);
  wallSign.castShadow = false;

  return {
    group,
    spawn: [1.5, 1.68, 52],
    lookAt: [-3, 7.2, -3],
    overview: [79, 48, 98],
    bounds: { minX: -40.5, maxX: 40.5, minZ: -2.6, maxZ: 66 },
    blockers,
    landmarks: [
      { id: 'birali-courtyard', label: 'Halaman Bir Ali', position: [1.5, 1.68, 52], lookAt: [-3, 7.2, -3] },
      { id: 'birali-portico', label: 'Serambi miqat', position: [0, 1.68, 10], lookAt: [0, 4.2, -5] },
      { id: 'birali-minaret', label: 'Menara Bir Ali', position: [-16, 1.68, 33], lookAt: [-46, 29, -25] },
      { id: 'birali-palms', label: 'Taman kurma', position: [23, 1.68, 38], lookAt: [31, 7, 29] },
    ],
    crowd: { kind: 'walk', count: 56, area: { minX: -17, maxX: 17, minZ: 7, maxZ: 59 } },
  };
}
