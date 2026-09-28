// Lingkungan realistis kompleks peluncuran (Biak, Papua): medan berbukit berhutan tropis, pantai berpasir
// dengan pohon kelapa, laut beriak (pantulan langit, kilau Matahari, buih di bibir pantai), dan peta
// lingkungan langit luar ruang untuk pantulan logam. Skala dunia: 1 unit ≈ 10 m.

import * as THREE from "three";
import { FRUIT_BY_ID } from "@/lib/fruits/catalog";
import { Merge, backdropTree, buildPlant, swayMaterial, type Kit } from "@/components/fruits/garden/build";
import * as TX from "@/components/fruits/garden/textures";
import { groundY, rng } from "./details";

/** Garis pantai (sisi +X): laut di timur landasan. */
export const coastX = (z: number) => 14.5 + Math.sin(z * 0.35) * 0.8 + Math.sin(z * 0.017) * 9 + Math.sin(z * 0.006 + 1) * 14 - 11 * Math.sin(1);

/* ---------------- derau sederhana ---------------- */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  const fx = x - ix,
    fy = y - iy;
  const u = fx * fx * (3 - 2 * fx),
    v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy),
    b = hash(ix + 1, iy),
    c = hash(ix, iy + 1),
    d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number, oct = 5) {
  let s = 0,
    a = 0.5,
    f = 1;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x * f, y * f);
    f *= 2.03;
    a *= 0.5;
  }
  return s;
}
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Tinggi medan (unit) di atas bidang landasan, tanpa lengkung Bumi. Area landasan & gedung datar. */
export function terrainH(x: number, z: number) {
  const d = Math.hypot(x, z);
  const s = x - coastX(z); // > 0 = ke arah laut
  if (s > 0) return -0.35 - Math.min(6, s * 0.09) + fbm(x * 0.05, z * 0.05, 3) * 0.2;
  // bukit berhutan di pedalaman + barisan pegunungan di kejauhan (lengkung Bumi sebagian dikompensasi supaya tampak)
  const hills =
    sstep(24, 70, d) * (1.5 + 34 * Math.pow(fbm(x * 0.014 + 3.1, z * 0.014 - 1.7), 1.7)) +
    sstep(120, 320, d) * 110 * Math.pow(fbm(x * 0.005 + 7, z * 0.005 + 2, 4), 1.4) +
    sstep(50, 300, d) * ((d * d) / 2000) * 0.8;
  const bumps = sstep(18, 30, d) * (fbm(x * 0.15, z * 0.15, 3) - 0.5) * 0.5;
  // menuju pantai: medan melandai ke pasir lalu masuk air
  const k = sstep(-14, -3, s);
  const beach = 0.02 - Math.max(0, s + 2.2) * 0.12;
  return (hills + bumps) * (1 - k) + beach * k;
}

/** Tinggi dunia (dengan lengkung Bumi). */
export const worldY = (x: number, z: number) => terrainH(x, z) + groundY(x, z);

/* ---------------- medan ---------------- */

function detailTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const r = rng(71);
  g.fillStyle = "#b8b8b8";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 16000; i++) {
    const l = 120 + r() * 135;
    g.fillStyle = `rgba(${l},${l},${l},0.55)`;
    g.fillRect(r() * 512, r() * 512, 1 + r() * 2.5, 1 + r() * 4);
  }
  for (let i = 0; i < 120; i++) {
    const l = 150 + r() * 70;
    g.fillStyle = `rgba(${l},${l},${l},0.12)`;
    g.beginPath();
    g.arc(r() * 512, r() * 512, 10 + r() * 50, 0, 7);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildTerrain(low: boolean) {
  const R = 520;
  // lingkaran dengan kepadatan cincin mengikuti jarak (rapat di dekat landasan)
  const rings = low ? 90 : 140,
    segs = low ? 180 : 256;
  const pos: number[] = [],
    col: number[] = [],
    uv: number[] = [];
  const idx: number[] = [];
  const cSand = new THREE.Color("#d8c592"),
    cWet = new THREE.Color("#b09a6a"),
    cGrass = new THREE.Color("#6d9b45"),
    cGrass2 = new THREE.Color("#86a84f"),
    cForest = new THREE.Color("#355f2c"),
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
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, map: detailTex(), roughness: 0.96 });
  // Hutan di bukit & pegunungan: tajuk pohon berbintik (terang di pucuk, gelap di celah), bercak hutan berskala
  // besar, lembah lebih gelap & punggung bukit lebih terang — seperti foto udara hutan tropis. Hanya di luar area
  // landasan; skala tajuk membesar di kejauhan agar tidak berkedip.
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vTW;\nvarying vec3 vTN;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvTW = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvTN = normalize(mat3(modelMatrix) * objectNormal);",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vTW; varying vec3 vTN;
        float th(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float tn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(th(i), th(i + vec2(1.0, 0.0)), f.x), mix(th(i + vec2(0.0, 1.0)), th(i + vec2(1.0, 1.0)), f.x), f.y); }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        {
          vec3 c = diffuseColor.rgb;
          float green = smoothstep(0.0, 0.06, c.g - max(c.r, c.b));      // hanya permukaan berhutan/berumput
          float away = smoothstep(22.0, 40.0, length(vTW.xz));            // bukan area landasan
          float dist = length(cameraPosition - vTW);
          vec2 p = vTW.xz;
          // tajuk pohon: dekat = rinci, jauh = gumpalan lebih besar (tidak berkedip)
          float nearC = tn(p * 0.9) * 0.6 + tn(p * 2.3) * 0.4;
          float farC = tn(p * 0.16) * 0.55 + tn(p * 0.45) * 0.45;
          float crown = mix(nearC, farC, smoothstep(40.0, 140.0, dist));
          float macro = tn(p * 0.025) * 0.6 + tn(p * 0.06) * 0.4;         // petak hutan tua/muda
          float up = clamp(vTN.y, 0.0, 1.0);
          float k = green * away;
          float amp = mix(0.62, 0.9, smoothstep(60.0, 250.0, dist));        // jauh: kontras lebih kuat (kabut meredam)
          c *= mix(1.0, 1.0 - amp * 0.62 + amp * 0.62 * 2.0 * (crown - 0.5) + amp * 0.3, k); // pucuk terang, celah gelap
          c = mix(c, c * vec3(0.78, 1.04, 0.86), k * smoothstep(0.35, 0.75, macro)); // hijau tua kebiruan
          c = mix(c, c * vec3(1.12, 1.08, 0.9), k * smoothstep(0.55, 0.25, macro) * 0.6); // hijau muda kekuningan
          c *= mix(1.0, 0.8 + 0.25 * up, k);                                 // lereng curam lebih gelap
          diffuseColor.rgb = c;
        }`,
      );
  };
  const m = new THREE.Mesh(g, mat);
  m.receiveShadow = true;
  m.name = "terrain";
  return m;
}

/* ---------------- laut ---------------- */

export function buildSea(sunDir: THREE.Vector3) {
  const R = 900;
  const geo = new THREE.RingGeometry(0.1, R, 200, 80);
  geo.rotateX(-Math.PI / 2);
  const p = geo.getAttribute("position") as THREE.BufferAttribute;
  // cincin makin rapat di dekat pusat
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      z = p.getZ(i);
    const d = Math.hypot(x, z) / R;
    const k = Math.pow(d, 2.2) / Math.max(d, 1e-6);
    p.setXYZ(i, x * k, 0, z * k);
    p.setY(i, -0.12 + groundY(x * k, z * k));
  }
  geo.computeBoundingSphere();
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uTime: { value: 0 },
        uSun: { value: sunDir.clone().normalize() },
        uSky: { value: new THREE.Color("#9cc6f4") },
        uZenith: { value: new THREE.Color("#3d8ae6") },
      },
    ]),
    fog: true,
    transparent: true,
    vertexShader: `varying vec3 vW; varying float vShore;
      #include <fog_pars_vertex>
      uniform float uTime;
      float coast(float z){ return 14.5 + sin(z*0.35)*0.8 + sin(z*0.017)*9.0 + sin(z*0.006+1.0)*14.0 - 11.0*sin(1.0); }
      void main(){
        vec3 pos = position;
        vShore = pos.x - coast(pos.z);
        float amp = 0.035 * smoothstep(0.0, 6.0, vShore);
        pos.y += (sin(pos.x*0.9 + uTime*1.3) + sin(pos.z*0.7 - uTime*1.1)) * amp;
        vec4 w = modelMatrix * vec4(pos, 1.0); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `uniform float uTime; uniform vec3 uSun; uniform vec3 uSky; uniform vec3 uZenith; varying vec3 vW; varying float vShore;
      #include <fog_pars_fragment>
      vec2 wave(vec2 p, vec2 d, float f, float s){ float ph = dot(p, d) * f + uTime * s; return d * cos(ph) * f; }
      void main(){
        vec2 p = vW.xz;
        vec2 g = wave(p, normalize(vec2(1.0, 0.3)), 1.7, 1.6) * 0.05 + wave(p, normalize(vec2(0.2, 1.0)), 2.9, 2.1) * 0.035
               + wave(p, normalize(vec2(-0.7, 0.6)), 5.3, 2.8) * 0.02 + wave(p, normalize(vec2(0.9, -0.4)), 9.1, 3.7) * 0.012;
        // riak halus memudar di kejauhan (tidak jadi pola garis dari ketinggian)
        float farK = smoothstep(15.0, 160.0, length(cameraPosition - vW));
        g *= 1.0 - 0.85 * farK;
        vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
        vec3 v = normalize(cameraPosition - vW);
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
        float depth = smoothstep(0.0, 25.0, vShore);
        vec3 water = mix(vec3(0.16, 0.62, 0.64), vec3(0.03, 0.22, 0.38), depth);
        vec3 refl = mix(uSky, uZenith, clamp(reflect(-v, n).y * 2.0, 0.0, 1.0));
        vec3 col = mix(water, refl, fres);
        vec3 h = normalize(uSun + v);
        col += vec3(1.0, 0.95, 0.85) * pow(max(dot(n, h), 0.0), 350.0) * 2.5;
        // buih ombak di bibir pantai
        float foam = smoothstep(1.4, 0.0, vShore) * (0.55 + 0.45 * sin(vShore * 7.0 - uTime * 2.2 + sin(p.y * 0.8)));
        col = mix(col, vec3(0.95, 0.97, 0.98), clamp(foam, 0.0, 1.0) * 0.8);
        float a = mix(0.55, 0.96, smoothstep(0.0, 2.0, vShore));
        gl_FragColor = vec4(col, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
  const m = new THREE.Mesh(geo, mat);
  m.name = "sea";
  return { mesh: m, mat };
}

/* ---------------- hutan & pohon kelapa ---------------- */

/** Pohon dibangun dengan pembuat tanaman Kebun Buah (dalam meter kebun), lalu diperkecil ke skala dunia roket. */
const FLORA_SCALE = 0.42;

export function buildFlora(low: boolean, uTime: { value: number }, keep: (t: THREE.Texture) => void) {
  const kit: Kit = { bark: new Merge(), leaf: new Merge(), plain: new Merge() };
  const r = rng(404);
  const S = FLORA_SCALE;
  const inner = (x: number, z: number) => worldY(x, z) / S;
  const blocked = (x: number, z: number) => {
    const d = Math.hypot(x, z);
    if (d < 21) return true; // landasan, pagar & ruang pandang kamera ke roket
    if (x > -24 && x < -2 && z > 1 && z < 16) return true; // gedung & parkir
    if (Math.abs(x + 10) < 1.6 && z > 7) return true; // jalan masuk
    if (Math.abs(z - 9) < 1.6 && x < 1 && x > -24) return true;
    if (x > 2 && x < 9 && z < -8 && z > -15) return true; // tangki & menara air
    return false;
  };
  // hutan hujan tropis: rapat di bukit, jarang di dataran dekat landasan
  const nTrees = low ? 450 : 900;
  let placed = 0;
  for (let i = 0; i < nTrees * 5 && placed < nTrees; i++) {
    const a = r() * Math.PI * 2;
    const d = 21 + Math.pow(r(), 1.3) * 130;
    const x = Math.cos(a) * d,
      z = Math.sin(a) * d;
    if (blocked(x, z) || x > coastX(z) - 4) continue;
    const dens = d < 30 ? 0.35 : 0.5 + 0.5 * fbm(x * 0.03, z * 0.03, 3);
    if (r() > dens) continue;
    const size = (d < 24 ? 0.9 : 1.1) + r() * 0.9;
    backdropTree(kit, x / S, z / S, inner(x, z) - 0.2, size, 900 + i);
    placed++;
  }
  // pohon kelapa berjajar di sepanjang pantai
  const coconut = FRUIT_BY_ID.get("kelapa")!;
  const nPalm = low ? 36 : 70;
  for (let i = 0; i < nPalm; i++) {
    const z = -110 + r() * 220;
    const x = coastX(z) - 2.2 - r() * 5.5;
    if (blocked(x, z)) continue;
    buildPlant(kit, { fruit: coconut, kind: "palm", zone: coconut.group, x: x / S, z: z / S, y: inner(x, z) - 0.1, reach: 1 }, 3000 + i, false);
  }
  const group = new THREE.Group();
  group.scale.setScalar(S);
  const barkMap = TX.bark(),
    leafMap = TX.foliageAtlas();
  keep(barkMap);
  keep(leafMap);
  const meshes = [
    kit.bark.empty ? null : kit.bark.build(swayMaterial(uTime, { map: barkMap, roughness: 0.95 })),
    kit.leaf.empty ? null : kit.leaf.build(swayMaterial(uTime, { map: leafMap, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8 }, true)),
    kit.plain.empty ? null : kit.plain.build(swayMaterial(uTime, { roughness: 0.8 })),
  ];
  for (const m of meshes) if (m) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }
  return group;
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

/** Awan kumulus lembut di kejauhan (tekstur Kebun Buah). */
export function buildCumulus(low: boolean, keep: (t: THREE.Texture) => void) {
  const g = new THREE.Group();
  const r = rng(515);
  const mats: THREE.SpriteMaterial[] = [];
  for (let k = 0; k < 5; k++) {
    const t = TX.cloud(k + 11);
    keep(t);
    mats.push(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.95 }));
  }
  const n = low ? 36 : 64;
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = 90 + r() * 320;
    const sp = new THREE.Sprite(mats[i % mats.length]);
    const w = 30 + r() * 60;
    sp.scale.set(w, w * 0.5, 1);
    sp.position.set(Math.cos(a) * d, 14 + r() * 22 + d * 0.02, Math.sin(a) * d);
    g.add(sp);
  }
  return g;
}
