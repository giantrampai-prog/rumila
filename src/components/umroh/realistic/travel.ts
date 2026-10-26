import * as T from 'three';
import type { UmrohWorld, WorldResources } from './types';

function seat(r: WorldResources, parent: T.Object3D, x: number, z: number, fabric: T.Material) {
  r.box(parent, [.49, .12, .52], [x, .5, z], fabric);
  const back = r.box(parent, [.5, .75, .14], [x, .94, z + .25], fabric); back.rotation.x = -.08;
  r.sphere(parent, [.24, .16, .085], [x, 1.33, z + .29], fabric);
  r.box(parent, [.4, .08, .38], [x, .4, z], r.mat.metal);
  r.box(parent, [.065, .35, .065], [x, .21, z], r.mat.metal);
  for (const dx of [-.28, .28]) r.box(parent, [.065, .075, .45], [x + dx, .72, z + .02], r.mat.black);
  r.box(parent, [.21, .13, .015], [x, .98, z + .34], r.mat.black);
}

export function createCabinWorld(r: WorldResources): UmrohWorld {
  const group = new T.Group();
  const blue = r.keep(new T.MeshStandardMaterial({ color: '#313e52', roughness: .93 }));
  r.floor(group, 6.5, 42, r.mat.carpet);
  for (const side of [-1, 1]) {
    r.box(group, [.18, 1.7, 42], [side * 3.05, .85, 0], r.mat.plaster);
    r.box(group, [.4, .2, 42], [side * 2.87, 1.65, 0], r.mat.white);
    r.box(group, [.72, .55, 41], [side * 2.5, 2.65, 0], r.mat.white);
    const pane = r.keep(new T.MeshStandardMaterial({ color: '#9ac1d0', emissive: '#6b8b9d', emissiveIntensity: .45, roughness: .1 }));
    for (let z = -18; z <= 18; z += 1.5) {
      r.sphere(group, [.06, .36, .25], [side * 2.96, 2.03, z], r.mat.darkStone);
      r.sphere(group, [.065, .29, .20], [side * 2.9, 2.03, z], pane);
      r.box(group, [.72, .025, .012], [side * 2.5, 2.38, z], r.mat.darkGold);
    }
    for (let z = -16; z <= 16; z += 1.12) for (const x of [1.02, 1.6, 2.18]) seat(r, group, side * x, z, blue);
  }
  // Continuous curved fuselage above the cabin, seen from the passenger aisle.
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let j = 0; j <= 1; j++) for (let i = 0; i <= 32; i++) {
    const theta = i / 32 * Math.PI;
    positions.push(Math.cos(theta) * 3.12, 1.55 + Math.sin(theta) * 1.9, j ? 21 : -21); uvs.push(i / 32, j);
  }
  for (let i = 0; i < 32; i++) { const a = i, b = i + 33; indices.push(a, b, a + 1, b, b + 1, a + 1); }
  const roof = new T.BufferGeometry(); roof.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); roof.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); roof.setIndex(indices); roof.computeVertexNormals();
  const lining = r.keep(r.mat.plaster.clone()); lining.side = T.DoubleSide; r.mesh(group, roof, lining);
  const lightMat = r.keep(new T.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffe8bd', emissiveIntensity: 1.5 }));
  for (const x of [-.65, .65]) r.box(group, [.09, .025, 39], [x, 3.24, 0], lightMat);
  r.box(group, [6, 3.5, .2], [0, 1.75, -20], r.mat.plaster);
  r.box(group, [.9, 2.1, .23], [0, 1.05, -19.96], r.mat.darkStone);
  r.sign(group, 'BERSIAP SEBELUM MIQAT', 'Ikuti pengumuman awak pesawat', [0, 2.7, -19.7], 3.7);
  return { group, spawn: [0, 1.67, 11], lookAt: [0, 1.65, -10], overview: [0, 3, 19], indoor: true,
    bounds: { minX: -.5, maxX: .5, minZ: -18.5, maxZ: 18.5 }, blockers: [],
    landmarks: [{ id: 'cabin-front', label: 'Depan kabin', position: [0, 1.67, -15], lookAt: [0, 1.8, 14] }, { id: 'cabin-aisle', label: 'Lorong kabin', position: [0, 1.67, 12], lookAt: [0, 1.67, -12] }] };
}

export function createJourneyWorld(r: WorldResources): UmrohWorld {
  const group = new T.Group();
  r.floor(group, 1500, 1500, r.mat.sand);
  r.box(group, [14, .03, 1200], [0, .02, -420], r.mat.asphalt);
  for (const x of [-6.5, 6.5]) r.box(group, [.12, .02, 1200], [x, .05, -420], r.mat.white);
  for (let z = 0; z > -800; z -= 12) r.box(group, [.15, .02, 5], [0, .055, z], r.mat.white);
  for (let side = -1; side <= 1; side += 2) {
    const terrain = new T.PlaneGeometry(400, 1100, 48, 80); terrain.rotateX(-Math.PI / 2);
    const p = terrain.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const ridge = Math.max(0, 1 - Math.abs(x / 210));
      const folds = Math.sin(x * .031 + z * .019) * .45 + Math.cos(z * .025 - x * .04) * .3 + Math.sin(z * .081 + x * .059) * .12;
      p.setY(i, Math.max(0, (folds + .48) * 115 * ridge));
    }
    terrain.computeVertexNormals();
    const rock = r.keep(new T.MeshStandardMaterial({ color: side > 0 ? '#8c7963' : '#a18b6f', roughness: 1 }));
    r.mesh(group, terrain, rock, [side * 255, -.1, -430]);
  }
  // Bus interior opens onto a long desert highway through the windscreen.
  r.box(group, [2.6, .14, 8], [0, .15, 1], r.mat.darkStone);
  r.box(group, [2.7, .17, 8.2], [0, 2.65, 1], r.mat.plaster);
  for (const side of [-1, 1]) {
    r.box(group, [.13, .9, 8], [side * 1.3, .65, 1], r.mat.plaster);
    for (let z = -2.5; z <= 4.5; z += 1.2) r.box(group, [.08, 1.5, .1], [side * 1.3, 1.8, z], r.mat.black);
  }
  const upholstery = r.keep(new T.MeshStandardMaterial({ color: '#504a40', roughness: .92 }));
  for (let z = 0; z < 4; z += 1.1) for (const x of [-.76, .76]) seat(r, group, x, z, upholstery);
  r.box(group, [2.5, .35, .8], [0, .9, -2.8], r.mat.black);
  for (const x of [-1.25, 1.25]) r.box(group, [.12, 1.5, .18], [x, 1.85, -2.8], r.mat.black);
  const wheel = r.mesh(group, new T.TorusGeometry(.23, .025, 8, 24), r.mat.black, [-.73, 1.2, -2.45]); wheel.rotation.x = .6;
  r.sign(group, 'مكة المكرمة  ·  MAKKAH', 'Perjalanan setelah miqat', [-5, 5, -70], 11);
  r.cylinder(group, .11, .11, 5, [-5, 2.5, -70], r.mat.metal);
  return { group, spawn: [0, 1.9, -.6], lookAt: [0, 1.8, -80], overview: [7, 4, 8], indoor: true,
    bounds: { minX: -.34, maxX: .34, minZ: -1.6, maxZ: 4 }, blockers: [],
    landmarks: [{ id: 'bus-front', label: 'Pemandangan perjalanan', position: [0, 1.9, -1], lookAt: [0, 2, -80] }, { id: 'bus-aisle', label: 'Dalam bus', position: [0, 1.9, 3.6], lookAt: [0, 1.7, -5] }] };
}

export function createTahallulWorld(r: WorldResources): UmrohWorld {
  const group = new T.Group();
  r.floor(group, 18, 15);
  r.box(group, [18, 4, .22], [0, 2, -7], r.mat.plaster);
  for (const side of [-1, 1]) r.box(group, [.22, 4, 15], [side * 9, 2, 0], r.mat.plaster);
  r.box(group, [18, .2, 15], [0, 4.05, 0], r.mat.plaster);
  const mirror = r.keep(new T.MeshStandardMaterial({ color: '#8faaa7', metalness: .9, roughness: .13 }));
  const seatMat = r.keep(new T.MeshStandardMaterial({ color: '#3c3230', roughness: .55 }));
  for (const x of [-5, 0, 5]) {
    r.box(group, [3.4, 2, .12], [x, 2, -6.8], r.mat.darkGold);
    r.box(group, [3.16, 1.76, .14], [x, 2, -6.72], mirror);
    r.box(group, [3.7, .1, .7], [x, .9, -6.5], r.mat.darkStone);
    r.cylinder(group, .55, .55, .08, [x, .07, -4.4], r.mat.metal);
    r.cylinder(group, .12, .14, .5, [x, .34, -4.4], r.mat.metal);
    r.box(group, [.8, .17, .8], [x, .68, -4.4], seatMat);
    r.box(group, [.8, .85, .17], [x, 1.12, -4.74], seatMat);
    for (const side of [-1, 1]) r.box(group, [.1, .12, .7], [x + side * .48, .96, -4.4], seatMat);
    r.box(group, [.5, .06, .3], [x, .28, -3.85], r.mat.metal);
    for (let k = 0; k < 3; k++) r.box(group, [.4, .09, .3], [x - 1.1, 1 + k * .09, -6.4], r.mat.white);
    r.cylinder(group, .07, .07, .25, [x + .8, 1.07, -6.4], r.mat.white);
  }
  r.sign(group, 'TAHALLUL', 'Memendekkan atau mencukur rambut setelah sa’i', [0, 3.45, -6.7], 7);
  const lamp = r.keep(new T.MeshStandardMaterial({ color: '#fff4d8', emissive: '#fff0d1', emissiveIntensity: 1.2 }));
  for (const x of [-5, 0, 5]) r.box(group, [1.7, .04, .3], [x, 3.89, -2], lamp);
  return { group, spawn: [2.5, 1.67, 3], lookAt: [0, 1.2, -4.4], overview: [7, 3.5, 6], indoor: true,
    bounds: { minX: -8, maxX: 8, minZ: -2.9, maxZ: 6 }, blockers: [],
    landmarks: [{ id: 'haircut', label: 'Tempat tahallul', position: [1.7, 1.67, -1.7], lookAt: [0, 1.2, -4.4] }, { id: 'room', label: 'Lihat ruangan', position: [6.5, 1.67, 4.5], lookAt: [0, 1.6, -5] }] };
}
