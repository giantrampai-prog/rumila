import * as T from 'three';
import { Merge, mat } from './build';
import { detailed } from './materials';

/** A cambered feather, root at zero and tip along +z, with a raised central shaft. */
export function featherGeometry(length: number, width: number) {
  const p: number[] = [], uv: number[] = [], ix: number[] = [];
  for (let row = 0; row <= 8; row++) {
    const t = row / 8, w = width * Math.pow(Math.sin(Math.PI * t), 0.65);
    for (let k = -1; k <= 1; k++) {
      p.push(k * w * (k < 0 ? 0.42 : 0.58), Math.sin(t * Math.PI) * length * 0.07 + (k === 0 ? width * 0.11 : 0), t * length);
      uv.push((k + 1) / 2, t);
    }
    if (row < 8) { const a = row * 3; ix.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5); }
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(ix); g.computeVertexNormals();
  return g;
}

/** Small garden birds: chestnut munia and yellow-vented bulbul inspired plumage, not species identification. */
export function buildGardenBird(variant = 0, plumage?: T.Texture) {
  const g = new T.Group(); g.name = 'Burung kebun berbulu';
  const feathers = detailed(new T.MeshStandardMaterial({ map: plumage ?? null, bumpMap: plumage ?? null, bumpScale: 0.0005, vertexColors: true, roughness: 0.88, side: T.DoubleSide }), 'feather');
  const microFeather = feathers.onBeforeCompile;
  feathers.onBeforeCompile = (s, renderer) => {
    microFeather.call(feathers, s, renderer);
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vFeatherUv;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvFeatherUv=uv;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vFeatherUv;').replace('#include <color_fragment>', `#include <color_fragment>
      float barbs=sin((vFeatherUv.y+abs(vFeatherUv.x-0.5)*0.22)*540.0);
      float featherFade=1.0-smoothstep(1.0,7.0,length(vViewPosition));
      diffuseColor.rgb*=1.0+barbs*0.075*featherFade;
      diffuseColor.rgb+=vec3(0.015)*(1.0-smoothstep(0.01,0.035,abs(vFeatherUv.x-0.5)))*featherFade;`);
  };
  feathers.customProgramCacheKey = () => 'garden-flight-feather-v2';
  const bodyFeathers = detailed(new T.MeshStandardMaterial({ map: plumage ?? null, bumpMap: plumage ?? null, bumpScale: 0.001, vertexColors: true, roughness: 0.89 }), 'feather');
  const back = variant % 2 ? '#a1967c' : '#ac8468';
  const chest = variant % 2 ? '#e9e1c9' : '#e1bf90';
  const flight = variant % 2 ? '#453f37' : '#49372d';
  const body = new Merge();
  body.add(new T.SphereGeometry(1, 24, 16), mat(0, 0, 0, -0.16, 0, 0, 0.105, 0.105, 0.21), back);
  body.add(new T.SphereGeometry(1, 20, 14), mat(0, -0.038, 0.06, -0.15, 0, 0, 0.093, 0.078, 0.145), chest);
  body.add(new T.SphereGeometry(0.078, 24, 16), mat(0, 0.075, 0.176, 0, 0, 0, 0.95, 1, 1.12), variant % 2 ? '#4c453b' : '#554334');
  for (const s of [-1, 1]) {
    body.add(new T.SphereGeometry(1, 16, 10), mat(s * 0.06, 0.055, 0.207, 0, 0, 0, 0.012, 0.027, 0.033), '#d4c7a6');
    body.add(new T.CapsuleGeometry(0.009, 0.075, 4, 6), mat(s * 0.05, -0.083, -0.09, -0.8), '#8c7961');
    for (let toe = -1; toe <= 1; toe++) body.add(new T.CapsuleGeometry(0.003, 0.038, 3, 5), mat(s * 0.05 + toe * 0.009, -0.104, -0.05, Math.PI / 2, toe * 0.3), '#514538');
  }
  // Coverts overlap in the direction of growth, following the rounded back.
  for (let row = 0; row < 3; row++) for (let side = -2; side <= 2; side++) {
    body.add(featherGeometry(0.1, 0.04), mat(side * 0.032, 0.087 - Math.abs(side) * 0.008, 0.1 - row * 0.045, 0, Math.PI, side * 0.1), row % 2 ? back : '#85715a');
  }
  g.add(body.build(bodyFeathers));
  const face = new Merge();
  face.add(new T.ConeGeometry(0.024, 0.068, 14), mat(0, 0.064, 0.279, Math.PI / 2 + 0.16, 0, 0, 1, 1, 0.65), '#b5a182');
  face.add(new T.ConeGeometry(0.014, 0.066, 12), mat(0, 0.053, 0.279, Math.PI / 2 - 0.16, 0, 0, 1, 1, 0.55), '#8d816b');
  for (const s of [-1, 1]) {
    face.add(new T.SphereGeometry(0.011, 14, 10), mat(s * 0.065, 0.09, 0.218, 0, 0, 0, 0.65, 1, 1), '#171614');
    face.add(new T.SphereGeometry(0.0025, 8, 6), mat(s * 0.073, 0.094, 0.222), '#ffffff');
  }
  g.add(face.build(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.3 })));
  const tail = new T.Group(), tailParts = new Merge();
  for (let i = -3; i <= 3; i++) tailParts.add(featherGeometry(0.19 - Math.abs(i) * 0.012, 0.042), mat(i * 0.011, 0, 0, -0.08, Math.PI + i * 0.075), i % 2 ? flight : back);
  tail.add(tailParts.build(feathers)); tail.position.set(0, -0.015, -0.15); g.add(tail);
  const wing = (side: number) => {
    const pivot = new T.Group(), outer = new T.Group(), root = new Merge(), tips = new Merge();
    root.add(new T.SphereGeometry(1, 16, 10), mat(0.085, 0, -0.015, 0, 0.2, 0, 0.13, 0.022, 0.093), back);
    for (let i = 0; i < 9; i++) root.add(featherGeometry(0.16 - i * 0.004, 0.038), mat(0.025 + i * 0.022, -0.004, 0.016, 0, Math.PI - 0.23), i % 2 ? flight : back);
    // Distal wing coverts bridge wrist and primary feathers; the fan widens aft.
    tips.add(new T.SphereGeometry(1, 14, 10), mat(0.065, 0, -0.04, 0, 0.38, 0, 0.105, 0.014, 0.055), back);
    for (let i = 0; i < 9; i++) tips.add(featherGeometry(0.22 + Math.sin(i / 8 * Math.PI) * 0.055, 0.052), mat(0.025 + i * 0.009, -0.008, 0.025 - i * 0.014, 0, 1.55 + i * 0.11), i % 2 ? flight : '#6a5c4c');
    for (let i = 0; i < 7; i++) tips.add(featherGeometry(0.12, 0.043), mat(0.015 + i * 0.017, 0.017, 0.012 - i * 0.013, 0, 1.9 + i * 0.08), back);
    for (let i = 0; i < 8; i++) root.add(featherGeometry(0.088, 0.038), mat(0.018 + i * 0.025, 0.022, 0.032, 0, Math.PI - 0.3), '#9d8a6e');
    root.add(new T.SphereGeometry(1, 12, 8), mat(0.18, 0, 0.02, 0, 0, -0.1, 0.1, 0.018, 0.024), back);
    pivot.add(root.build(feathers)); outer.add(tips.build(feathers)); outer.position.set(0.20, 0, -0.01); pivot.add(outer);
    pivot.scale.x = side; pivot.position.set(side * 0.075, 0.028, 0.02); g.add(pivot);
    return { pivot, outer };
  };
  const left = wing(-1), right = wing(1);
  g.traverse(o => { if (o instanceof T.Mesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { g, wl: left.pivot, wr: right.pivot, tipL: left.outer, tipR: right.outer, tail };
}

export function birdFlightPose(t: number, phase: number) {
  // Blend flight and gliding smoothly; wings flex later at their tips.
  const glide = T.MathUtils.smoothstep(Math.sin(t * 0.55 + phase), 0.05, 0.65);
  const cycle = t * 14.5 + phase * 4.7;
  return { flap: Math.sin(cycle) * 0.64 * (1 - glide) + 0.08 * glide,
    flex: Math.sin(cycle - 0.65) * 0.32 * (1 - glide), tail: Math.sin(t * 1.4 + phase) * 0.08 };
}
