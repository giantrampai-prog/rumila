import * as T from 'three';
import type { Position, Rect, UmrohWorld, WorldResources } from './types';
import { addKaabaSanctuary } from './kaaba';

/** Educational geometry in metres; the court and sa'i route are deliberately compressed.
 * Visual references: alharamain.gov.sa/public/?page=mataf-ar and
 * alharamain.gov.sa/public/?page=safa-marwa-en. No scanned or third-party models.
 */
const COURT_EDGE = 80;
const SAI_END = 75;

function archGeometry(r: WorldResources, width: number, rise: number, band: number, depth: number) {
  const half = width / 2;
  const shape = new T.Shape();
  shape.moveTo(-half - band, 0);
  shape.quadraticCurveTo(-half - band, rise * 0.57, 0, rise + band);
  shape.quadraticCurveTo(half + band, rise * 0.57, half + band, 0);
  shape.lineTo(half, 0);
  shape.quadraticCurveTo(half, rise * 0.53, 0, rise);
  shape.quadraticCurveTo(-half, rise * 0.53, -half, 0);
  shape.closePath();
  return r.keep(new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 }));
}

function column(r: WorldResources, parent: T.Object3D, at: Position, height: number, radius = 0.38) {
  const [x, y, z] = at;
  r.box(parent, [radius * 2.8, 0.25, radius * 2.8], [x, y + 0.125, z], r.mat.marble);
  r.cylinder(parent, radius, radius * 1.07, height - 0.55, [x, y + height / 2, z], r.mat.marble, 12);
  r.cylinder(parent, radius * 1.36, radius, 0.25, [x, y + height - 0.28, z], r.mat.limestone, 12);
  r.box(parent, [radius * 2.9, 0.22, radius * 2.9], [x, y + height - 0.07, z], r.mat.limestone);
  r.cylinder(parent, radius * 1.05, radius * 1.05, 0.065, [x, y + 0.4, z], r.mat.darkGold, 12);
}

function dome(r: WorldResources, parent: T.Object3D, radius: number, at: Position, material: T.Material) {
  const geo = r.keep(new T.SphereGeometry(radius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2));
  return r.mesh(parent, geo, material, at);
}

function minaret(r: WorldResources, group: T.Group, x: number, z: number) {
  const tower = new T.Group();
  tower.position.set(x, 0, z);
  group.add(tower);
  r.box(tower, [6, 18, 6], [0, 9, 0], r.mat.limestone);
  r.box(tower, [6.45, 0.5, 6.45], [0, 18, 0], r.mat.marble);
  r.cylinder(tower, 1.6, 2.4, 27, [0, 31.6, 0], r.mat.marble, 12);
  for (const y of [22, 37, 48]) {
    r.cylinder(tower, 3, 2.15, 0.8, [0, y, 0], r.mat.limestone, 16);
    r.cylinder(tower, 3.05, 3.05, 0.3, [0, y + 0.8, 0], r.mat.marble, 16);
    for (let i = 0; i < 20; i++) {
      const angle = i * Math.PI / 10;
      r.cylinder(tower, 0.07, 0.07, 0.8, [Math.cos(angle) * 2.82, y + 0.48, Math.sin(angle) * 2.82], r.mat.marble, 5);
    }
  }
  r.cylinder(tower, 1.1, 1.6, 12, [0, 48, 0], r.mat.marble, 12);
  r.cylinder(tower, 0.85, 1.15, 5.5, [0, 56, 0], r.mat.limestone, 12);
  dome(r, tower, 1.35, [0, 58.8, 0], r.mat.gold);
  r.cylinder(tower, 0.025, 0.1, 3, [0, 61.3, 0], r.mat.gold, 8);
  const crescent = r.mesh(tower, r.keep(new T.TorusGeometry(0.52, 0.095, 6, 24, Math.PI * 1.6)), r.mat.gold, [0, 63.15, 0]);
  crescent.rotation.z = -Math.PI * 0.3;
  for (let side = 0; side < 4; side++) {
    const window = new T.Group();
    window.rotation.y = side * Math.PI / 2;
    tower.add(window);
    for (const y of [8, 12, 15]) r.box(window, [0.75, 1.7, 0.025], [0, y, 3.02], r.mat.darkStone);
  }
}

function addArcades(r: WorldResources, group: T.Group) {
  const bay = 8;
  const arch = archGeometry(r, 6.65, 2.8, 0.48, 0.85);
  const deepArch = archGeometry(r, 6.65, 2.8, 0.3, 0.55);
  for (let side = 0; side < 4; side++) {
    const wing = new T.Group();
    wing.rotation.y = side * Math.PI / 2;
    group.add(wing);
    r.box(wing, [178, 24, 4], [0, 12, -92], r.mat.plaster);
    for (let level = 0; level < 3; level++) {
      const y = level * 7.1;
      r.box(wing, [168, 0.45, 13], [0, y + 7.0, -85.7], r.mat.marble);
      r.box(wing, [168, 0.28, 1.1], [0, y + 6.73, -79.85], r.mat.limestone);
      for (let i = -10; i <= 10; i++) {
        const x = i * bay;
        column(r, wing, [x, y, -COURT_EDGE], 3.75, 0.39);
        column(r, wing, [x, y, -88], 3.75, 0.34);
        if (i === 10) continue;
        r.mesh(wing, arch, r.mat.limestone, [x + bay / 2, y + 3.53, -COURT_EDGE - 0.43]);
        r.mesh(wing, deepArch, r.mat.marble, [x + bay / 2, y + 3.53, -88.25]);
        if (level > 0) {
          r.box(wing, [6.7, 0.18, 0.24], [x + bay / 2, y + 1.08, -79.95], r.mat.marble);
          for (let bar = 0; bar < 9; bar++)
            r.box(wing, [0.105, 0.82, 0.15], [x + 0.8 + bar * 0.8, y + 0.58, -79.95], r.mat.marble);
        }
      }
    }
    r.box(wing, [168, 0.55, 2], [0, 21.65, -80.25], r.mat.limestone);
    r.box(wing, [168, 0.22, 0.45], [0, 22.85, -80.25], r.mat.marble);
    for (let x = -82; x <= 82; x += 1.1)
      r.box(wing, [0.23, 1.1, 0.32], [x, 22.25, -80.25], r.mat.marble);
    for (let x = -72; x <= 72; x += 24) {
      r.cylinder(wing, 3.3, 3.3, 0.45, [x, 22.1, -86], r.mat.limestone, 24);
      dome(r, wing, 3.3, [x, 22.3, -86], r.mat.marble);
    }
  }
  for (const x of [-83, 83]) for (const z of [-83, 83]) minaret(r, group, x, z);
}

function addClockSkyline(r: WorldResources, group: T.Group) {
  const tower = new T.Group();
  tower.position.set(-29, 0, -125);
  group.add(tower);
  // A legible architectural silhouette beyond the court; scale/location are illustrative.
  for (const x of [-39, -25, 25, 39]) {
    const h = Math.abs(x) > 30 ? 49 : 64;
    r.box(tower, [14, h, 18], [x, h / 2, 3], r.mat.limestone);
    r.box(tower, [15.5, 1.4, 19.5], [x, h, 3], r.mat.darkGold);
    for (let y = 12; y < h - 2; y += 4)
      r.box(tower, [11.5, 1.8, 0.1], [x, y, 12.08], r.mat.glass);
  }
  r.box(tower, [22, 75, 23], [0, 37.5, 0], r.mat.limestone);
  for (let y = 13; y < 73; y += 4.5)
    r.box(tower, [18, 2, 0.12], [0, y, 11.6], r.mat.glass);
  for (const x of [-6, 0, 6]) r.box(tower, [0.75, 68, 0.25], [x, 40, 11.8], r.mat.limestone);
  r.box(tower, [24, 1.4, 25], [0, 76, 0], r.mat.darkGold);
  r.box(tower, [21, 22, 21], [0, 87.7, 0], r.mat.limestone);
  const dialGeo = r.keep(new T.CylinderGeometry(8.2, 8.2, 0.12, 64));
  const ringGeo = r.keep(new T.TorusGeometry(8.4, 0.35, 8, 64));
  for (let side = 0; side < 4; side++) {
    const face = new T.Group();
    face.rotation.y = side * Math.PI / 2;
    tower.add(face);
    const dial = r.mesh(face, dialGeo, r.mat.green, [0, 87, 10.6]);
    dial.rotation.x = Math.PI / 2;
    r.mesh(face, ringGeo, r.mat.gold, [0, 87, 10.72]);
    for (let tick = 0; tick < 12; tick++) {
      const a = tick * Math.PI / 6;
      const mark = r.box(face, [0.35, 1.15, 0.16], [Math.sin(a) * 6.85, 87 + Math.cos(a) * 6.85, 10.82], r.mat.white);
      mark.rotation.z = -a;
    }
    const hour = r.box(face, [0.48, 3.1, 0.18], [-0.84, 88.25, 10.96], r.mat.white);
    hour.rotation.z = Math.PI / 5;
    const minute = r.box(face, [0.3, 5.2, 0.18], [1.25, 89.25, 10.98], r.mat.white);
    minute.rotation.z = -Math.PI / 6;
  }
  r.box(tower, [23, 1.2, 23], [0, 99.5, 0], r.mat.darkGold);
  r.cylinder(tower, 3.9, 8.5, 8, [0, 104, 0], r.mat.limestone, 4);
  r.cylinder(tower, 0.15, 2.8, 14, [0, 115, 0], r.mat.darkGold, 8);
  const crescent = r.mesh(tower, r.keep(new T.TorusGeometry(2.1, 0.34, 8, 36, Math.PI * 1.6)), r.mat.gold, [0, 124, 0]);
  crescent.rotation.z = -Math.PI * 0.3;
}

function addZamzam(r: WorldResources, group: T.Group) {
  const station = new T.Group();
  station.position.set(64, 0, 28);
  station.rotation.y = -Math.PI / 2;
  group.add(station);
  r.box(station, [8, 0.12, 1.7], [0, 0.06, 0], r.mat.limestone);
  for (let i = -2; i <= 2; i++) {
    const x = i * 1.35;
    r.cylinder(station, 0.4, 0.42, 1.03, [x, 0.67, 0], r.mat.plaster, 16);
    r.cylinder(station, 0.43, 0.43, 0.12, [x, 1.24, 0], r.mat.darkGold, 16);
    r.box(station, [0.12, 0.15, 0.23], [x, 0.45, 0.45], r.mat.metal);
    r.box(station, [0.24, 0.52, 0.23], [x + 0.49, 0.83, 0], r.mat.white);
  }
  r.cylinder(station, 0.035, 0.035, 2.1, [-4, 1.05, 0], r.mat.metal, 8);
  r.cylinder(station, 0.035, 0.035, 2.1, [4, 1.05, 0], r.mat.metal, 8);
  r.sign(station, 'ZAMZAM', 'Air minum', [0, 2.2, 0], 3.5);
}

export function createHaramWorld(r: WorldResources): UmrohWorld {
  const group = new T.Group();
  group.name = 'Masjidil-Haram';
  r.floor(group, 196, 196, r.mat.marble);
  // Fine joints retain a human sense of scale, even without distant architecture.
  for (let x = -76; x <= 76; x += 3.2)
    r.box(group, [0.016, 0.006, 156], [x, 0.006, 0], r.mat.limestone);
  for (let z = -76; z <= 76; z += 4)
    r.box(group, [156, 0.006, 0.016], [0, 0.006, z], r.mat.limestone);
  const { blockers, landmarks } = addKaabaSanctuary(r, group);
  addArcades(r, group);
  addClockSkyline(r, group);
  addZamzam(r, group);
  blockers.push(
    { minX: 62.8, maxX: 65.3, minZ: 23.7, maxZ: 32.3 },
  );
  return {
    group,
    spawn: [27, 1.7, 32], lookAt: [0, 5, 0], overview: [53, 49, 64],
    bounds: { minX: -75, maxX: 75, minZ: -75, maxZ: 75 }, blockers,
    landmarks: [
      ...landmarks,
      { id: 'zamzam', label: 'Air Zamzam', position: [58.5, 1.7, 28], lookAt: [64, 1.1, 28] },
    ],
    crowd: { kind: 'tawaf', count: 600, radius: 26, area: { minX: -52, maxX: 52, minZ: -52, maxZ: 52 } },
  };
}

function addHill(r: WorldResources, group: T.Group, z: number, label: string) {
  const hill = new T.Group();
  hill.position.z = z;
  group.add(hill);
  const rock = r.keep(new T.DodecahedronGeometry(1, 1));
  for (let i = 0; i < 18; i++) {
    const a = i * 2.39996;
    const radial = 0.8 + Math.sqrt(i / 18) * 4.4;
    const x = Math.cos(a) * radial;
    const dz = Math.sin(a) * radial * 0.55;
    const y = 0.35 + 1.5 * (1 - radial / 6);
    const mesh = r.mesh(hill, rock, i % 3 === 0 ? r.mat.darkStone : r.mat.limestone, [x, y, dz]);
    mesh.scale.set(1.4 + (i % 4) * 0.2, 0.7 + (i % 3) * 0.3, 1.2 + (i % 5) * 0.14);
    mesh.rotation.set(i * 0.38, i * 1.73, i * 0.24);
  }
  const faceDirection = z < 0 ? 1 : -1;
  const sign = r.sign(hill, label.toUpperCase(), 'Tempat berbalik arah', [0, 4.1, faceDirection * 1.2], 3.8);
  if (faceDirection < 0) sign.rotation.y = Math.PI;
}

export function createSaiWorld(r: WorldResources): UmrohWorld {
  const group = new T.Group();
  group.name = 'Masaa-Safa-Marwah';
  const blockers: Rect[] = [];
  r.floor(group, 26, 178, r.mat.marble);
  r.box(group, [0.45, 0.018, 154], [-6.8, 0.01, 0], r.mat.limestone);
  r.box(group, [0.45, 0.018, 154], [6.8, 0.01, 0], r.mat.limestone);
  for (let z = -80; z <= 80; z += 3.2)
    r.box(group, [19, 0.007, 0.018], [0, 0.006, z], r.mat.limestone);
  for (const x of [-4.5, 0, 4.5]) r.box(group, [0.018, 0.007, 166], [x, 0.006, 0], r.mat.limestone);
  for (const x of [-11.5, 11.5]) {
    r.box(group, [1.5, 10.2, 176], [x, 5.1, 0], r.mat.plaster);
    r.box(group, [0.2, 1.3, 176], [x < 0 ? -10.69 : 10.69, 0.65, 0], r.mat.limestone);
    r.box(group, [1, 0.3, 176], [x < 0 ? -10.4 : 10.4, 5.9, 0], r.mat.limestone);
  }
  r.box(group, [24, 0.6, 176], [0, 10.4, 0], r.mat.plaster);

  const wideArch = archGeometry(r, 17.1, 3.1, 0.36, 0.45);
  const sideArch = archGeometry(r, 5.7, 2, 0.3, 0.32);
  const vault = r.keep(new T.CylinderGeometry(9.1, 9.1, 166, 40, 1, true, Math.PI / 2, Math.PI));
  const vaultMaterial = r.keep(r.mat.plaster.clone());
  vaultMaterial.side = T.DoubleSide;
  const vaultMesh = r.mesh(group, vault, vaultMaterial, [0, 6.2, 0]);
  vaultMesh.rotation.x = Math.PI / 2;
  vaultMesh.scale.z = 0.41;

  for (let z = -78; z <= 78; z += 6) {
    for (const x of [-9, 9]) {
      column(r, group, [x, 0, z], 6.2, 0.45);
      blockers.push({ minX: x - 0.64, maxX: x + 0.64, minZ: z - 0.64, maxZ: z + 0.64 });
      const longitudinal = r.mesh(group, sideArch, r.mat.limestone, [x, 4.0, z + 3]);
      longitudinal.rotation.y = Math.PI / 2;
      const panel = r.box(group, [0.035, 2.3, 2.3], [x < 0 ? -10.72 : 10.72, 3.15, z + 2.6], r.mat.darkGold);
      panel.scale.y = 0.75;
      r.box(group, [0.055, 1.55, 1.95], [x < 0 ? -10.67 : 10.67, 3.15, z + 2.6], r.mat.plaster);
    }
    r.mesh(group, wideArch, r.mat.limestone, [0, 6.17, z - 0.22]);
    for (const x of [-5.5, 5.5]) {
      r.cylinder(group, 0.025, 0.025, 0.9, [x, 7.8, z], r.mat.darkGold, 6);
      r.cylinder(group, 0.34, 0.52, 0.42, [x, 7.17, z], r.mat.gold, 10);
      r.cylinder(group, 0.28, 0.35, 0.35, [x, 6.85, z], r.mat.white, 10);
    }
  }
  for (const x of [-7.85, 7.85]) {
    r.box(group, [0.055, 0.055, 138], [x, 1.08, 0], r.mat.metal);
    r.box(group, [0.045, 0.045, 138], [x, 0.55, 0], r.mat.metal);
    for (let z = -69; z <= 69; z += 3)
      r.cylinder(group, 0.035, 0.035, 1.1, [x, 0.55, z], r.mat.metal, 6);
    blockers.push({ minX: x - 0.09, maxX: x + 0.09, minZ: -69, maxZ: 69 });
  }
  // Two transverse illuminated markers bound the brisk-walking teaching area.
  const markerMaterial = r.keep(r.mat.green.clone());
  markerMaterial.emissive.set('#21e48c');
  markerMaterial.emissiveIntensity = 1.1;
  for (const z of [-20, 20]) {
    r.box(group, [17.4, 0.22, 0.38], [0, 6.15, z], markerMaterial);
    for (const x of [-8.65, 8.65]) r.box(group, [0.16, 4.8, 0.36], [x, 3.75, z], markerMaterial);
    const light = new T.PointLight('#54e9a7', 7, 12, 2);
    light.position.set(0, 5.7, z);
    group.add(light);
    const sign = r.sign(group, 'PENANDA HIJAU', 'Batas area berlari kecil', [0, 5.4, z], 3.6);
    if (z < 0) sign.rotation.y = Math.PI;
  }
  addHill(r, group, -82, 'Safa');
  addHill(r, group, 82, 'Marwah');
  blockers.push(
    { minX: -6.5, maxX: 6.5, minZ: -87, maxZ: -78.3 },
    { minX: -6.5, maxX: 6.5, minZ: 78.3, maxZ: 87 },
  );
  return {
    group, indoor: true,
    spawn: [0, 1.7, -SAI_END], lookAt: [0, 2.5, 0], overview: [0, 7, -66],
    bounds: { minX: -10.2, maxX: 10.2, minZ: -77.5, maxZ: 77.5 }, blockers,
    landmarks: [
      { id: 'safa', label: 'Safa', position: [0, 1.7, -SAI_END], lookAt: [0, 1.8, -82] },
      { id: 'marwah', label: 'Marwah', position: [0, 1.7, SAI_END], lookAt: [0, 1.8, 82] },
      { id: 'green-markers', label: 'Penanda hijau', position: [0, 1.7, -28], lookAt: [0, 5.3, -20] },
    ],
    crowd: { kind: 'sai', count: 180, area: { minX: -6.6, maxX: 6.6, minZ: -74, maxZ: 74 } },
  };
}
