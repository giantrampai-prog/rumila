// Lingkungan realistis kompleks peluncuran (Biak, Papua): medan berbukit berhutan tropis, pantai berpasir
// dengan pohon kelapa, laut beriak (pantulan langit, kilau Matahari, buih di bibir pantai), dan peta
// lingkungan langit luar ruang untuk pantulan logam. Skala dunia: 1 unit ≈ 10 m.

import * as THREE from "three";
import { coastX, groundY, rng, terrainH, worldY, fbm, smooth as sstep } from "./terrain-math";
import { terrainMaterial, siteTexture, weathered, type KeepTexture } from "./surface-materials";
export { coastX, terrainH, worldY } from "./terrain-math";
export { buildVegetation as buildFlora } from "./vegetation";
export { buildOcean as buildSea } from "./ocean";

/* ---------------- medan ---------------- */

export function buildTerrain(low: boolean, keep: KeepTexture) {
  const R = 520;
  // lingkaran dengan kepadatan cincin mengikuti jarak (rapat di dekat landasan)
  const rings = low ? 140 : 220,
    segs = low ? 256 : 480;
  const pos: number[] = [],
    col: number[] = [],
    uv: number[] = [];
  const idx: number[] = [];
  const cSand = new THREE.Color("#d8c592"),
    cWet = new THREE.Color("#b09a6a"),
    cGrass = new THREE.Color("#a3a78b"),
    cGrass2 = new THREE.Color("#b6b394"),
    cForest = new THREE.Color("#64715a"),
    cRock = new THREE.Color("#6f6a58"),
    cSea = new THREE.Color("#8c8a6e"),
    tmp = new THREE.Color();
  const radius = (i: number) => R * Math.pow(i / rings, 2.2);
  for (let i = 0; i <= rings; i++) {
    const rr = radius(i);
    for (let j = 0; j < segs; j++) {
      const a = (j / segs) * Math.PI * 2;
      const x = Math.cos(a) * rr,
        z = Math.sin(a) * rr;
      const h = terrainH(x, z);
      pos.push(x, h + groundY(x, z), z);
      uv.push(x / 6, z / 6);
      const s = x - coastX(z);
      const d = rr;
      // warna: pasir di pantai, rumput di dataran, hutan gelap di bukit, batu di lereng terjal
      const hx = terrainH(x + 1, z) - h,
        hz = terrainH(x, z + 1) - h;
      const slope = Math.hypot(hx, hz);
      const n = fbm(x * 0.08, z * 0.08, 3);
      tmp.copy(cGrass).lerp(cGrass2, n);
      tmp.lerp(cForest, sstep(26, 50, d) * sstep(0.4, 2.5, h + (n - 0.5) * 2));
      tmp.lerp(cRock, sstep(0.9, 1.8, slope) * 0.7);
      if (s > -3.2) tmp.lerp(cSand, sstep(-3.2, -2.2, s));
      if (s > -0.6) tmp.lerp(cWet, sstep(-0.6, 0.2, s));
      if (s > 0.2) tmp.lerp(cSea, sstep(0.2, 3, s));
      col.push(tmp.r, tmp.g, tmp.b);
    }
  }
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < segs; j++) {
      const a = i * segs + j,
        b = i * segs + ((j + 1) % segs),
        c = (i + 1) * segs + j,
        e = (i + 1) * segs + ((j + 1) % segs);
      idx.push(a, b, c, b, e, c);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, terrainMaterial(keep));
  m.receiveShadow = true;
  m.name = "terrain";
  return m;
}

/* ---------------- peta lingkungan langit (pantulan) ---------------- */

export function skyEnvScene() {
  const s = new THREE.Scene();
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vD; void main(){ float h = vD.y;
      vec3 sky = mix(vec3(0.78,0.87,0.97), vec3(0.28,0.52,0.9), smoothstep(0.0, 0.7, h));
      vec3 ground = mix(vec3(0.36,0.42,0.26), vec3(0.3,0.36,0.22), smoothstep(0.0, -0.5, h));
      vec3 c = h > 0.0 ? sky : ground;
      float sun = pow(max(dot(vD, normalize(vec3(0.45, 0.72, 0.3))), 0.0), 200.0) * 20.0;
      gl_FragColor = vec4(c + sun, 1.0); }`,
  });
  s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), m));
  return s;
}

/** Small distant photographic cloud cutouts leave a clear blue sky above the launch site. */
export function buildCumulus(low: boolean, keep: KeepTexture) {
  const group = new THREE.Group(), r = rng(515);
  const map = siteTexture("cumulus", keep);
  const material = new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, opacity: 0.88, fog: true });
  for (let i = 0; i < (low ? 8 : 12); i++) {
    const a = r() * Math.PI * 2, d = 150 + r() * 280;
    const cloud = new THREE.Sprite(material);
    const w = 34 + r() * 36;
    cloud.scale.set(w, w * (0.4 + r() * 0.23), 1);
    cloud.position.set(Math.cos(a) * d, 38 + r() * 35, Math.sin(a) * d);
    group.add(cloud);
  }
  return group;
}

/** Tumbled coral-limestone boulders along the beach, batched into a single draw call. */
export function buildCoast(low: boolean) {
  const r = rng(842), g = new THREE.IcosahedronGeometry(1, 2), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const f = 0.86 + fbm(x * 4 + 4, z * 4 + y * 2, 3) * 0.32;
    p.setXYZ(i, x * f, y * f, z * f);
  }
  g.computeVertexNormals();
  const count = low ? 80 : 180;
  const mesh = new THREE.InstancedMesh(g, weathered("#9d9985", "rock"), count);
  const dummy = new THREE.Object3D(), color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const z = -90 + r() * 180, x = coastX(z) - 0.7 - r() * 1.8;
    const s = 0.07 + Math.pow(r(), 2) * 0.45;
    dummy.position.set(x, worldY(x, z) + s * 0.1, z);
    dummy.rotation.set(r(), r() * 6.28, r()); dummy.scale.set(s * 1.6, s * 0.8, s);
    dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, color.setScalar(0.65 + r() * 0.35));
  }
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}
