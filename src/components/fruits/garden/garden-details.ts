import * as T from 'three';
import { Merge, mat } from './build';
import { detailed, riverRock } from './materials';
import * as TX from './textures';

/** Real construction details at the hub, shared/batched by material. */
export function buildGardenHub(keep: <Tt extends T.Texture>(t: Tt) => Tt, time: { value: number }) {
  const group = new T.Group(), wood = new Merge(), stone = new Merge(), metal = new Merge(), tiles = new Merge();
  const woodMap = keep(TX.planks()), stoneMap = keep(TX.stones()), roofMap = keep(TX.roofTiles());
  // Thick, open well wall, individual coping stones and a dark inner lining.
  stone.add(new T.CylinderGeometry(1.14, 1.19, 0.86, 64, 1, true), mat(0, 0.44, 0), '#dfdcd2', { uv: [3, 1] });
  for (let i = 0; i < 20; i++) {
    const a = i * Math.PI / 10;
    stone.add(riverRock(1, i), mat(Math.cos(a) * 1.065, 0.93, Math.sin(a) * 1.065, 0, -a, 0, 0.19, 0.11, 0.20), '#b0ada0');
  }
  const inside = new T.Mesh(new T.CylinderGeometry(0.95, 0.93, 0.7, 64, 1, true), detailed(new T.MeshStandardMaterial({ map: stoneMap, color: '#657161', roughness: 0.91, side: T.BackSide }), 'stone'));
  inside.position.y = 0.53; inside.receiveShadow = true; group.add(inside);
  // Posts, brackets, winding axle and a rope hanging into the bucket.
  for (const side of [-1, 1]) {
    wood.add(new T.BoxGeometry(0.16, 2.7, 0.16), mat(side * 1.1, 1.4, 0), '#d3c5ae', { uv: [0.2, 2] });
    for (const z of [-0.42, 0.42]) wood.add(new T.BoxGeometry(0.09, 0.6, 0.09), mat(side * 1.1, 2.54, z, Math.sign(z) * 0.62), '#ae997b');
    metal.add(new T.BoxGeometry(0.22, 0.16, 0.23), mat(side * 1.1, 0.3, 0), '#4b514f');
    metal.add(new T.TorusGeometry(0.075, 0.025, 8, 18), mat(side * 1.1, 2.24, 0, 0, Math.PI / 2), '#505658');
  }
  wood.add(new T.CylinderGeometry(0.063, 0.063, 2.65, 20), mat(0, 2.24, 0, 0, 0, Math.PI / 2), '#97836a');
  metal.add(new T.BoxGeometry(0.04, 0.33, 0.05), mat(1.36, 2.1, 0), '#535953');
  wood.add(new T.CylinderGeometry(0.035, 0.035, 0.2, 12), mat(1.44, 1.95, 0, 0, 0, Math.PI / 2), '#a58d6c');
  for (let i = 0; i < 12; i++) wood.add(new T.TorusGeometry(0.08, 0.012, 5, 16), mat(-0.14 + i * 0.024, 2.24, 0, 0, Math.PI / 2), '#cab990');
  wood.add(new T.CylinderGeometry(0.012, 0.012, 0.69, 8), mat(0, 1.88, 0.08), '#c6b58d');
  // Bucket made of staves with a wire handle and metal hoops.
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8;
    wood.add(new T.BoxGeometry(0.074, 0.34, 0.034), mat(Math.sin(a) * 0.18, 1.37, Math.cos(a) * 0.18 + 0.08, Math.cos(a) * 0.08, a, -Math.sin(a) * 0.08), '#aa9373');
  }
  for (const y of [1.23, 1.51]) metal.add(new T.TorusGeometry(0.193, 0.012, 6, 24), mat(0, y, 0.08, Math.PI / 2), '#5c6461');
  metal.add(new T.TorusGeometry(0.19, 0.009, 6, 24, Math.PI), mat(0, 1.53, 0.08), '#686e68');
  // Gabled roof with actual terracotta courses; individual curved tiles silhouette the eaves.
  for (const side of [-1, 1]) {
    wood.add(new T.BoxGeometry(2.9, 0.08, 1.36), mat(0, 2.98, side * 0.57, side * 0.47), '#826e57');
    for (let row = 0; row < 5; row++) for (let col = 0; col < 12; col++) {
      const z = side * (0.10 + row * 0.255), y = 3.27 - row * 0.13;
      const tile = new T.CylinderGeometry(0.14, 0.135, 0.37, 12, 1, true, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2);
      const uv = tile.attributes.uv;
      for (let v = 0; v < uv.count; v++) uv.setXY(v, 0.35 + uv.getX(v) * 0.08, 0.46 + uv.getY(v) * 0.07);
      tiles.add(tile, mat(-1.43 + col * 0.26, y, z, side * 0.47), '#ded0ba');
    }
  }
  for (let i = 0; i < 13; i++) tiles.add(new T.CylinderGeometry(0.11, 0.105, 0.26, 12, 1, true, -Math.PI / 2, Math.PI).rotateX(-Math.PI / 2).rotateY(Math.PI / 2), mat(-1.5 + i * 0.25, 3.32, 0), '#cebaa0');
  // Bench seats and backrests are separate timber slats with bolts and steel legs.
  for (const a of [0.8, 2.35, 3.95, 5.5]) {
    const x = Math.cos(a) * 5.4, z = Math.sin(a) * 5.4, ry = -a + Math.PI / 2;
    const at = (lx: number, y: number, lz: number) => mat(x + Math.cos(ry) * lx + Math.sin(ry) * lz, y, z - Math.sin(ry) * lx + Math.cos(ry) * lz, 0, ry);
    for (let slat = 0; slat < 4; slat++) wood.add(new T.BoxGeometry(1.8, 0.065, 0.108), at(0, 0.49, -0.18 + slat * 0.12), '#d3bf9f', { uv: [1.6, 0.12] });
    for (let slat = 0; slat < 3; slat++) wood.add(new T.BoxGeometry(1.8, 0.105, 0.055), at(0, 0.67 + slat * 0.12, -0.245), '#c8b08f', { uv: [1.6, 0.13] });
    for (const s of [-0.73, 0.73]) {
      for (const dz of [-0.19, 0.19]) metal.add(new T.BoxGeometry(0.055, 0.46, 0.055), at(s, 0.23, dz), '#49504b');
      metal.add(new T.BoxGeometry(0.05, 0.77, 0.05), at(s, 0.49, -0.255), '#49504b');
      metal.add(new T.BoxGeometry(0.06, 0.05, 0.48), at(s, 0.44, 0), '#424946');
      for (let slat = 0; slat < 4; slat++) metal.add(new T.SphereGeometry(0.011, 6, 4), at(s, 0.526, -0.18 + slat * 0.12), '#95968b');
    }
  }
  for (const [parts, material] of [
    [wood, detailed(new T.MeshStandardMaterial({ map: woodMap, vertexColors: true, roughness: 0.8 }), 'wood')],
    [stone, detailed(new T.MeshStandardMaterial({ map: stoneMap, vertexColors: true, roughness: 0.9 }), 'stone')],
    [tiles, detailed(new T.MeshStandardMaterial({ map: roofMap, vertexColors: true, roughness: 0.88, side: T.DoubleSide }), 'stone')],
    [metal, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.44, metalness: 0.65 })],
  ] as const) { const m = parts.build(material); m.castShadow = m.receiveShadow = true; group.add(m); }
  const waterMat = new T.MeshPhysicalMaterial({ color: '#234339', metalness: 0.18, roughness: 0.14, clearcoat: 1 });
  waterMat.onBeforeCompile = s => {
    s.uniforms.uGardenTime = time;
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGardenTime;')
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal=normalize(normal+vec3(sin(vViewPosition.x*16.0+uGardenTime)*0.04,cos(vViewPosition.y*17.0-uGardenTime)*0.04,0.0));');
  };
  const water = new T.Mesh(new T.CircleGeometry(0.94, 64), waterMat); water.rotation.x = -Math.PI / 2; water.position.y = 0.29; group.add(water);
  return group;
}

/** Clothing seams, woven caping and face detail retain the friendly existing characters. */
export function dressGardener(person: T.Group, adult = false) {
  const seams = new Merge(), straw = new Merge(), details = new Merge();
  const hatY = adult ? 1.95 : 1.98;
  for (let row = 0; row < 24; row++) {
    const radius = 0.05 + row * 0.028;
    straw.add(new T.TorusGeometry(radius, 0.004, 3, 40), mat(0, hatY + 0.16 - radius * 0.445, 0, Math.PI / 2), row % 3 ? '#b7a16e' : '#e0cca0');
  }
  for (const side of [-1, 1]) {
    details.add(new T.SphereGeometry(1, 16, 10), mat(side * 0.312, 1.61, 0, 0, 0, 0, 0.055, 0.077, 0.036), adult ? '#c6946f' : '#d5a581');
    details.add(new T.SphereGeometry(0.017, 10, 8), mat(side * 0.13, 1.14, 0.274), '#b7a06a');
    seams.add(new T.CapsuleGeometry(0.004, 0.27, 3, 6), mat(side * 0.14, 0.37, 0.09), adult ? '#796956' : '#63809b');
  }
  details.add(new T.SphereGeometry(1, 16, 10), mat(0, 1.605, 0.322, 0, 0, 0, 0.037, 0.045, 0.033), adult ? '#d4a47b' : '#e4b68e');
  if (!adult) {
    seams.add(new T.BoxGeometry(0.18, 0.12, 0.012), mat(0, 0.92, 0.284), '#57789b');
    for (let row = 0; row < 12; row++) {
      const r = 0.235 + row * 0.005;
      straw.add(new T.TorusGeometry(r, 0.007, 4, 32), mat(0, 0.90 + row * 0.026, -0.38, Math.PI / 2 - 0.15), '#a88e61');
    }
  }
  for (const [parts, material] of [[straw, detailed(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }), 'woven')], [seams, detailed(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.94 }), 'cloth')], [details, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.62 })]] as const) {
    const m = parts.build(material); m.castShadow = true; person.add(m);
  }
}
