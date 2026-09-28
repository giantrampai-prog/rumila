// Scene 3D "Roket & Astronot": landasan, menara, roket 3 bagian, astronaut, langit yang berubah menurut
// ketinggian, awan, pesawat, ozon, meteor, aurora, Stasiun Luar Angkasa, dan Bumi dari orbit.
// Skala ILUSTRASI: radius Bumi = 1000 unit; ketinggian dipetakan non-linear (km → unit) agar semua lapisan
// sempat terlihat. Semua pose roket/astronaut adalah fungsi murni dari (persinggahan, progres) sehingga
// melompat ke persinggahan mana pun tetap konsisten.

import * as THREE from "three";
import { AgamModel } from "./agam-model";
import { buildStation } from "./station";
import { buildBirds, buildMoon, buildSatellite, buildSite, flag, gridFin, landingLeg, lattice, nozzleMaterial, rocketBodyTex } from "./details";
import { buildCoast, buildCumulus, buildFlora, buildSea, buildTerrain } from "./site";

import { crewAccessDetails, rocketDetails } from "./facility";
import { weathered } from "./surface-materials";

export const EARTH_R = 1000;
/** ketinggian (km) → unit di atas permukaan */
export const altToY = (km: number) => (km <= 0 ? 0 : EARTH_R * Math.pow(km / 6371, 0.72));
/** unit di atas permukaan → km */
export const yToAlt = (y: number) => (y <= 0 ? 0 : 6371 * Math.pow(y / EARTH_R, 1 / 0.72));

const TAU = Math.PI * 2;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const softDot = () =>
  canvasTex(64, 64, (g, w, h) => {
    const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  });

/* ---------------- langit ---------------- */

function skyMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uUp: { value: new THREE.Vector3(0, 1, 0) },
      uZenith: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSpace: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.5, 0.6, 0.3).normalize() },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uUp; uniform vec3 uZenith; uniform vec3 uHorizon; uniform float uSpace; uniform vec3 uSunDir; varying vec3 vDir;
      void main(){ vec3 d = normalize(vDir); float e = dot(d, uUp);
        float k = pow(clamp(1.0 - max(e, 0.0), 0.0, 1.0), 3.0);
        vec3 col = mix(uZenith, uHorizon, k);
        float sun = pow(max(dot(d, uSunDir), 0.0), 900.0) * 3.0 + pow(max(dot(d, uSunDir), 0.0), 12.0) * 0.25 * (1.0 - uSpace);
        col += vec3(1.0, 0.92, 0.75) * sun;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  });
}

const ZENITH: [number, string][] = [
  [0, "#528bb1"],
  [12, "#2159c2"],
  [35, "#0f2f86"],
  [65, "#051448"],
  [100, "#010312"],
];
const HORIZON: [number, string][] = [
  [0, "#c1d2d8"],
  [12, "#9cc6f4"],
  [35, "#5a82d6"],
  [65, "#1f3c8a"],
  [100, "#040a24"],
];
function ramp(stops: [number, string][], km: number, out: THREE.Color) {
  if (km <= stops[0][0]) return out.set(stops[0][1]);
  for (let i = 1; i < stops.length; i++) {
    if (km <= stops[i][0]) {
      const [a, ca] = stops[i - 1];
      const [b, cb] = stops[i];
      return out.set(ca).lerp(new THREE.Color(cb), (km - a) / (b - a));
    }
  }
  return out.set(stops[stops.length - 1][1]);
}

/* ---------------- model ---------------- */

const white = () => new THREE.MeshStandardMaterial({ color: 0xf4f6fa, roughness: 0.45, metalness: 0.1 });
const dark = () => new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.6, metalness: 0.3 });

function tag(o: THREE.Object3D, pick: string) {
  o.traverse((x) => (x.userData.pick = pick));
  return o;
}

/** Semburan api mesin: inti putih-kuning di mulut nosel, memudar oranye-merah ke ujung.
 *  Pakai campuran biasa (bukan aditif) supaya tetap terlihat jelas di langit siang yang terang. */
function flame(len: number, radius: number) {
  const mk = (core: boolean) =>
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPower: { value: 1 } },
      vertexShader: `uniform float uTime; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position;
        float w = 1.0 + 0.08 * sin(uTime * 55.0 + uv.y * 18.0) + 0.05 * sin(uTime * 31.0 + uv.x * 40.0);
        p.xz *= w; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
      fragmentShader: `uniform float uTime; uniform float uPower; varying vec2 vUv;
        void main(){ float y = vUv.y; // 0 = mulut nosel, 1 = ujung api
          float flick = 0.88 + 0.12 * sin(uTime * 47.0 + y * 25.0);
          vec3 hot = vec3(1.0, 0.98, 0.88), mid = vec3(1.0, 0.72, 0.18), tail = vec3(0.95, 0.3, 0.06);
          vec3 col = ${core ? "mix(hot, vec3(1.0,0.9,0.55), y)" : "mix(mix(hot, mid, smoothstep(0.0, 0.35, y)), tail, smoothstep(0.35, 1.0, y))"};
          float a = (1.0 - smoothstep(${core ? "0.3, 0.9" : "0.45, 1.0"}, y)) * smoothstep(0.0, 0.04, y) * flick * uPower;
          gl_FragColor = vec4(col, a * ${core ? "1.0" : "0.85"}); }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  const outerMat = mk(false),
    coreMat = mk(true);
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(radius, len, 28, 1, true), outerMat);
  outer.rotation.x = Math.PI; // ujung runcing ke bawah
  outer.position.y = -len / 2;
  const inner = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.55, len * 0.55, 20, 1, true), coreMat);
  inner.rotation.x = Math.PI;
  inner.position.y = -len * 0.275;
  inner.renderOrder = 2;
  // cahaya menyilaukan di mulut nosel
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d")!;
    const r = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,250,225,1)");
    r.addColorStop(0.35, "rgba(255,190,80,.75)");
    r.addColorStop(1, "rgba(255,120,30,0)");
    x.fillStyle = r;
    x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false }));
  glow.scale.setScalar(radius * 5);
  glow.position.y = -radius * 0.6;
  const light = new THREE.PointLight(0xffa040, 30, 12, 1.6);
  light.position.y = -len * 0.4;
  g.add(outer, inner, glow, light);
  // satu objek "mat" mengendalikan kedua material (waktu & kekuatan)
  const uTime = { value: 0 };
  outerMat.uniforms.uTime = coreMat.uniforms.uTime = uTime;
  const mat = { uniforms: { uTime, uPower: outerMat.uniforms.uPower } };
  coreMat.uniforms.uPower = outerMat.uniforms.uPower;
  glow.onBeforeRender = () => {
    light.intensity = 26 + Math.sin(uTime.value * 40) * 6;
    glow.scale.setScalar(radius * (5 + Math.sin(uTime.value * 33) * 0.4));
  };
  return { group: g, mat };
}

function buildRocket() {
  const rocket = new THREE.Group();
  rocket.name = "rocket";
  const R = 0.32;
  // Tahap pertama (0.3 → 3.6)
  const s1 = new THREE.Group();
  const body1 = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 3.3, 96), new THREE.MeshStandardMaterial({ map: rocketBodyTex(1), roughness: 0.45, metalness: 0.1 }));
  body1.position.y = 1.95;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.005, R * 1.005, 0.25, 32), dark());
  band.position.y = 3.35;
  s1.add(body1, band, rocketDetails(R, 0.3, 3.6));
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.55, 0.32), dark());
    const a = (i / 4) * TAU + Math.PI / 4;
    fin.position.set(Math.cos(a) * (R + 0.14), 0.55, Math.sin(a) * (R + 0.14));
    fin.rotation.y = -a;
    s1.add(fin);
  }
  // sirip kisi di puncak tahap pertama & kaki pendarat terlipat di dasar
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    const gf = gridFin();
    gf.position.set(Math.cos(a) * (R + 0.02), 3.3, Math.sin(a) * (R + 0.02));
    gf.rotation.y = -a + Math.PI / 2;
    s1.add(gf);
    const leg = landingLeg();
    leg.position.set(Math.cos(a + Math.PI / 4) * (R + 0.03), 0, Math.sin(a + Math.PI / 4) * (R + 0.03));
    s1.add(leg);
  }
  const engines = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.07, 0.18, 12, 1, true), nozzleMaterial());
    const a = (i / 8) * TAU;
    const rr = i === 8 ? 0 : 0.19;
    bell.position.set(Math.cos(a) * rr, 0.21, Math.sin(a) * rr);
    engines.add(bell);
  }
  s1.add(tag(engines, "mesin"));
  const f1 = flame(3.8, 0.34);
  f1.group.position.y = 0.12;
  s1.add(f1.group);
  tag(s1, "tahap-1");
  tag(engines, "mesin");
  // Tahap kedua (3.6 → 5.0)
  const s2 = new THREE.Group();
  const body2 = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 1.4, 96), new THREE.MeshStandardMaterial({ map: rocketBodyTex(2), roughness: 0.45, metalness: 0.1 }));
  body2.position.y = 4.3;
  const logo = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.005, R * 1.005, 0.08, 32), new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.5 }));
  logo.position.y = 4.75;
  const bell2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.3, 16, 1, true), nozzleMaterial());
  bell2.position.y = 3.5;
  s2.add(body2, logo, bell2, rocketDetails(R, 3.6, 5.0));
  const f2 = flame(2.6, 0.22);
  f2.group.position.y = 3.35;
  s2.add(f2.group);
  tag(s2, "tahap-2");
  // Kapsul (5.0 → 5.9) + menara penyelamat
  const cap = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, R, 0.9, 64), white());
  cone.position.y = 5.45;
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.06, 64), dark());
  shield.position.y = 5.03;
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.02), new THREE.MeshStandardMaterial({ color: 0x34566b, roughness: 0.12, metalness: 0.65 }));
  win.position.set(0, 5.4, 0.27);
  win.rotation.x = -0.24;
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.02), new THREE.MeshStandardMaterial({ color: 0xc9d2de, roughness: 0.5 }));
  door.position.set(0.25, 5.35, 0);
  door.rotation.set(0, Math.PI / 2, 0.25);
  const escape = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0xff5a4e, roughness: 0.5 }));
  escape.position.y = 6.2;
  escape.name = "escape";
  cap.add(cone, shield, win, door, escape);
  tag(cap, "kapsul");
  rocket.add(s1, s2, cap);
  return { rocket, s1, s2, cap, f1, f2 };
}

function buildTower() {
  const tower = new THREE.Group();
  // baja galvanis abu-abu gelap seperti menara servis landasan sungguhan
  const steel = weathered(0x687276, "metal");
  const grey = weathered(0xa1a9aa, "metal");
  const H = 7.4,
    W = 1.1;
  const frame = lattice(W, W, H, steel, 0.6);
  tower.add(frame);
  // lantai kerja berkisi tiap dua tingkat (di sisi luar, lift tetap terlihat)
  const grate = new THREE.MeshStandardMaterial({ color: 0x42474e, roughness: 0.7, metalness: 0.5 });
  for (let y = 1.2; y < H; y += 1.2) {
    const deck = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, 0.035, 0.34), grate);
    deck.position.set(0, y, W / 2 + 0.05);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, 0.012, 0.012), grey);
    rail.position.set(0, y + 0.12, W / 2 + 0.21);
    tower.add(deck, rail);
  }
  // pipa pengisian bahan bakar & kabel (umbilikal) menjulur di sisi yang menghadap roket
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xd9dde2, roughness: 0.3, metalness: 0.8 });
  for (let k = 0; k < 3; k++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, H - 0.4, 8), pipeMat);
    pipe.position.set(-W / 2 - 0.05, (H - 0.4) / 2, -0.25 + k * 0.18);
    tower.add(pipe);
  }
  // rumah mesin & derek di puncak
  const hut = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, 0.35, W * 0.9), new THREE.MeshStandardMaterial({ color: 0xe8ebee, roughness: 0.6 }));
  hut.position.y = H + 0.17;
  const jib = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.1), steel);
  jib.position.set(-0.5, H + 0.4, 0);
  tower.add(hut, jib);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff2a2a }));
  beacon.position.set(0, H + 0.42, 0);
  beacon.name = "beacon";
  tower.add(beacon);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2), grey);
  rod.position.set(0.3, H + 0.6, 0.3);
  tower.add(rod);
  // lift terbuka (lantai + tiang tipis) agar astronaut di dalamnya tetap terlihat
  const lift = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.6), grey);
  floor.position.y = -0.3;
  lift.add(floor);
  for (const [x, z] of [
    [-0.27, -0.27],
    [0.27, -0.27],
    [-0.27, 0.27],
    [0.27, 0.27],
  ]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.8, 0.03), grey);
    post.position.set(x, 0.1, z);
    lift.add(post);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.6), grey);
  roof.position.y = 0.5;
  lift.add(roof);
  lift.name = "lift";
  tower.add(lift);
  const arm = new THREE.Group();
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.4), grey);
  deck.position.x = -0.75;
  const room = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.6 }));
  room.position.set(-1.35, 0.25, 0);
  arm.add(deck, room, crewAccessDetails());
  arm.position.set(-W / 2, 5.25, 0);
  arm.name = "arm";
  tower.add(arm);
  tower.position.set(2.2, 0, 0);
  tag(tower, "menara");
  return { tower, lift, arm };
}

/** Tempelan kain bergambar (bendera, logo misi). */
function patchTex(kind: "flag" | "mission") {
  return canvasTex(128, kind === "flag" ? 84 : 128, (g, w, h) => {
    if (kind === "flag") {
      g.fillStyle = "#e0262b";
      g.fillRect(0, 0, w, h / 2);
      g.fillStyle = "#ffffff";
      g.fillRect(0, h / 2, w, h / 2);
      g.strokeStyle = "#c9ced8";
      g.lineWidth = 4;
      g.strokeRect(0, 0, w, h);
      return;
    }
    // logo misi RINOYA: lingkaran biru, roket & orbit
    g.fillStyle = "#1f3a8a";
    g.beginPath();
    g.arc(w / 2, h / 2, w / 2 - 2, 0, TAU);
    g.fill();
    g.strokeStyle = "#ffffff";
    g.lineWidth = 5;
    g.beginPath();
    g.ellipse(w / 2, h / 2 + 6, 44, 18, -0.4, 0, TAU);
    g.stroke();
    g.fillStyle = "#ff7a1a";
    g.beginPath();
    g.moveTo(w / 2, 22);
    g.lineTo(w / 2 + 12, 70);
    g.lineTo(w / 2 - 12, 70);
    g.fill();
    g.fillStyle = "#ffffff";
    g.font = "bold 22px system-ui, sans-serif";
    g.textAlign = "center";
    g.fillText("RINOYA", w / 2, h - 18);
  });
}

/** Papan nama di dada (teks biru dongker di atas putih). */
function nameTex(name: string) {
  return canvasTex(256, 96, (g, w, h) => {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#1f2f7a";
    g.lineWidth = 8;
    g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = "#1f2f7a";
    g.font = "900 58px system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(name, w / 2, h / 2 + 3);
  });
}

/**
 * Agam, astronaut cilik Rumila (mengikuti gambar karakter): helm gelembung kaca bening memperlihatkan
 * wajah anak (mata cokelat besar, rambut cokelat), baju putih beraksen oranye & biru dongker, papan nama
 * "AGAM", kotak kendali dada berlampu biru, sabuk & pelindung lutut dongker, sepatu bot putih-oranye,
 * ransel penunjang hidup, bendera Merah Putih di bahu kiri dan logo misi RINOYA di bahu kanan.
 */
export function buildAstronaut() {
  const a = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0xf7f6f2, roughness: 0.7 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xf07a1f, roughness: 0.55 });
  const navy = new THREE.MeshStandardMaterial({ color: 0x1f2f7a, roughness: 0.55 });
  const grey = new THREE.MeshStandardMaterial({ color: 0xb8bec8, roughness: 0.5, metalness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2c2f38, roughness: 0.6 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xe8b48a, roughness: 0.55 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x3b2414, roughness: 0.6 });

  // badan (sedikit gemuk seperti anak) + sabuk dongker
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.17, 8, 24), suit);
  torso.position.y = 0.42;
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.146, 0.146, 0.035, 24), navy);
  belt.position.y = 0.34;
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.02), grey);
  buckle.position.set(0, 0.34, 0.146);
  a.add(torso, belt, buckle);

  // kepala anak di dalam helm: wajah, rambut, mata besar, alis, senyum, pipi, telinga
  const headY = 0.71;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 28, 20), skin);
  head.position.y = headY;
  head.scale.set(1, 1.02, 0.95);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.104, 28, 16, 0, TAU, 0, Math.PI * 0.52), hair);
  hairCap.position.set(0, headY + 0.008, -0.006);
  hairCap.rotation.x = -0.35;
  a.add(head, hairCap);
  // poni bergelombang
  for (let i = 0; i < 6; i++) {
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), hair);
    tuft.position.set(-0.06 + i * 0.024, headY + 0.07 - Math.abs(i - 2.5) * 0.006, 0.065 - Math.abs(i - 2.5) * 0.008);
    tuft.scale.set(1, 0.7, 0.8);
    a.add(tuft);
  }
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const iris = new THREE.MeshStandardMaterial({ color: 0x6b3a1a, roughness: 0.25 });
  const pupil = new THREE.MeshStandardMaterial({ color: 0x120a06, roughness: 0.2 });
  const shine = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (const sx of [-1, 1]) {
    const eye = new THREE.Group();
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), white);
    w.scale.set(1, 1.15, 0.55);
    const ir = new THREE.Mesh(new THREE.SphereGeometry(0.019, 16, 12), iris);
    ir.position.z = 0.009;
    ir.scale.set(1, 1.1, 0.5);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.01, 12, 8), pupil);
    pu.position.z = 0.016;
    pu.scale.set(1, 1.1, 0.5);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 6), shine);
    hl.position.set(0.006, 0.009, 0.02);
    eye.add(w, ir, pu, hl);
    eye.position.set(sx * 0.037, headY + 0.008, 0.083);
    a.add(eye);
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.005, 0.026, 3, 6), hair);
    brow.rotation.z = Math.PI / 2 + sx * 0.18;
    brow.position.set(sx * 0.037, headY + 0.045, 0.088);
    const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.014, 12), new THREE.MeshBasicMaterial({ color: 0xf0907a, transparent: true, opacity: 0.55 }));
    cheek.position.set(sx * 0.058, headY - 0.028, 0.083);
    cheek.rotation.y = sx * 0.5;
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), skin);
    ear.position.set(sx * 0.098, headY, 0);
    ear.scale.set(0.6, 1, 0.8);
    a.add(brow, cheek, ear);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 8), skin);
  nose.position.set(0, headY - 0.012, 0.096);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 6, 16, Math.PI), new THREE.MeshStandardMaterial({ color: 0x8a3a2a }));
  smile.rotation.z = Math.PI;
  smile.position.set(0, headY - 0.036, 0.088);
  a.add(nose, smile);

  // helm: gelembung kaca bening + bingkai putih di belakang + cincin leher & tepi oranye + "telinga" helm
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.155, 36, 24),
    new THREE.MeshPhysicalMaterial({ color: 0xdff4ff, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.16, clearcoat: 1, clearcoatRoughness: 0.03, depthWrite: false }),
  );
  helmet.position.y = headY + 0.01;
  helmet.renderOrder = 3;
  // bingkai putih mengelilingi gelembung (terlihat dari depan) + tudung putih di belakang kepala
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.156, 0.013, 8, 48), suit);
  rim.position.set(0, headY + 0.01, -0.02);
  // separuh bola yang menghadap ke belakang (phi π..2π → z ≤ 0), agak dipipihkan
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.157, 32, 16, Math.PI, Math.PI), suit);
  shell.position.set(0, headY + 0.01, -0.025);
  shell.scale.set(1, 1, 0.55);
  const neck = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 10, 32), grey);
  neck.rotation.x = Math.PI / 2;
  neck.position.y = 0.575;
  const neckTrim = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.008, 6, 32), orange);
  neckTrim.rotation.x = Math.PI / 2;
  neckTrim.position.y = 0.595;
  a.add(helmet, shell, rim, neck, neckTrim);
  for (const sx of [-1, 1]) {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 18), suit);
    pod.rotation.z = Math.PI / 2;
    pod.position.set(sx * 0.158, headY + 0.01, 0);
    const podRing = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.006, 6, 18), orange);
    podRing.rotation.y = Math.PI / 2;
    podRing.position.set(sx * 0.175, headY + 0.01, 0);
    a.add(pod, podRing);
  }
  // kaca pelindung emas (untuk sinar Matahari) dalam posisi terangkat di atas helm
  const sunVisor = new THREE.Mesh(
    new THREE.SphereGeometry(0.162, 32, 16, Math.PI * 0.18, Math.PI * 0.64, 0, Math.PI * 0.3),
    new THREE.MeshPhysicalMaterial({ color: 0xe8a73a, roughness: 0.08, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0x2a1a04 }),
  );
  sunVisor.position.y = headY + 0.01;
  a.add(sunVisor);
  // lampu kecil oranye di dahi helm
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.02), orange);
  lamp.position.set(0, headY - 0.14, 0.1);
  a.add(lamp);

  // pelindung bahu oranye + garis dongker di lengan
  for (const sx of [-1, 1]) {
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10, 0, TAU, 0, Math.PI / 2), orange);
    pad.position.set(sx * 0.16, 0.54, 0);
    pad.scale.set(1, 0.6, 1.1);
    a.add(pad);
  }

  // kotak kendali dada: bodi putih, lampu biru menyala, kenop & pengatur
  const dcm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.085, 0.055), suit);
  dcm.position.set(0, 0.43, 0.15);
  const dcmFrame = new THREE.Mesh(new THREE.BoxGeometry(0.136, 0.091, 0.05), grey);
  dcmFrame.position.set(0, 0.43, 0.145);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.02, 20), new THREE.MeshStandardMaterial({ color: 0x1f4bff, emissive: 0x1a44ff, emissiveIntensity: 0.9 }));
  lens.position.set(0.028, 0.43, 0.179);
  const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.005, 6, 20), dark);
  lensRing.position.set(0.028, 0.43, 0.179);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 16), dark);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(-0.03, 0.43, 0.18);
  a.add(dcmFrame, dcm, lens, lensRing, dial);
  const blue = new THREE.PointLight(0x4a7bff, 0.25, 0.4);
  blue.position.set(0.028, 0.43, 0.2);
  a.add(blue);
  // papan nama AGAM & tali pengikat dongker
  const tag2 = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.036), new THREE.MeshStandardMaterial({ map: nameTex("AGAM"), roughness: 0.6 }));
  tag2.position.set(0, 0.505, 0.153);
  tag2.rotation.x = -0.25;
  a.add(tag2);
  for (const sx of [-1, 1]) {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.16, 0.01), grey);
    strap.position.set(sx * 0.105, 0.45, 0.13);
    strap.rotation.z = sx * -0.12;
    a.add(strap);
    const hose = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 16, Math.PI), grey);
    hose.position.set(sx * 0.09, 0.38, 0.13);
    hose.rotation.set(0, sx * 0.7, Math.PI / 2);
    a.add(hose);
  }

  // ransel penunjang hidup: putih dengan panel oranye di sisi + antena
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.12), suit);
  pack.position.set(0, 0.46, -0.17);
  a.add(pack);
  for (const sx of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.18, 0.08), orange);
    side.position.set(sx * 0.128, 0.46, -0.17);
    a.add(side);
  }
  const packLid = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.04, 0.1), grey);
  packLid.position.set(0, 0.62, -0.17);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.12), dark);
  antenna.position.set(0.1, 0.7, -0.2);
  a.add(packLid, antenna);

  // bendera Merah Putih di bahu kiri & logo misi RINOYA di bahu kanan
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.046), new THREE.MeshStandardMaterial({ map: patchTex("flag"), roughness: 0.8 }));
  flag.position.set(-0.19, 0.47, 0.03);
  flag.rotation.y = -1.25;
  const mission = new THREE.Mesh(new THREE.CircleGeometry(0.028, 20), new THREE.MeshStandardMaterial({ map: patchTex("mission"), roughness: 0.8 }));
  mission.position.set(0.19, 0.47, 0.03);
  mission.rotation.y = 1.25;
  a.add(flag, mission);

  // anggota badan: grup berporos (sarung tangan & sepatu ikut bergerak), gelang dongker, lutut dongker
  const limb = (r: number, len: number, end: THREE.Object3D, leg: boolean) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 14), suit);
    m.position.y = -0.1;
    const band = new THREE.Mesh(new THREE.TorusGeometry(r * 1.03, r * 0.2, 6, 18), navy);
    band.rotation.x = Math.PI / 2;
    band.position.y = -0.1 - len / 2 + 0.01;
    g.add(m, band);
    if (leg) {
      const knee = new THREE.Mesh(new THREE.SphereGeometry(r * 0.85, 14, 10), navy);
      knee.scale.set(1, 1, 0.55);
      knee.position.set(0, -0.1, r * 0.75);
      const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.5, 12, 8), dark);
      kneeCap.scale.set(1, 1, 0.5);
      kneeCap.position.set(0, -0.1, r * 1.12);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(r * 0.5, len * 0.9, 0.01), orange);
      stripe.position.set(-r * 0.95, -0.1, 0);
      stripe.rotation.y = Math.PI / 2;
      g.add(knee, kneeCap, stripe);
    } else {
      const joint = new THREE.Mesh(new THREE.TorusGeometry(r * 1.02, r * 0.16, 6, 16), grey);
      joint.rotation.x = Math.PI / 2;
      joint.position.y = -0.1;
      g.add(joint);
    }
    end.position.y = -0.1 - len / 2 - r * 0.9;
    g.add(end);
    return g;
  };
  const gloveMesh = () => {
    const gl = new THREE.Group();
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.043, 14, 10), suit);
    palm.scale.set(1, 1.1, 0.8);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.04, 0.03, 14), grey);
    cuff.position.y = 0.04;
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.03, 3, 8), dark);
    thumb.position.set(0.035, 0.005, 0.02);
    thumb.rotation.z = -0.6;
    gl.add(palm, cuff, thumb);
    return gl;
  };
  const bootMesh = () => {
    const b = new THREE.Group();
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.07, 0.14), suit);
    upper.geometry.translate(0, 0, 0.022);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.022, 0.15), navy);
    sole.position.set(0, -0.042, 0.022);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.098, 0.012, 0.145), orange);
    trim.position.set(0, -0.022, 0.022);
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.014, 0.05), grey);
    strap.position.set(0, 0.02, 0.05);
    b.add(upper, sole, trim, strap);
    return b;
  };
  const armL = limb(0.046, 0.16, gloveMesh(), false);
  const armR = limb(0.046, 0.16, gloveMesh(), false);
  armL.position.set(-0.185, 0.53, 0);
  armR.position.set(0.185, 0.53, 0);
  const legL = limb(0.06, 0.13, bootMesh(), true);
  const legR = limb(0.06, 0.13, bootMesh(), true);
  legL.position.set(-0.072, 0.27, 0);
  legR.position.set(0.072, 0.27, 0);
  a.add(armL, armR, legL, legR);
  a.scale.setScalar(0.85);
  tag(a, "astronot");
  return { astro: a, armL, armR, legL, legR, helmet, visor: helmet };
}

function aurora() {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAlpha: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uTime; uniform float uAlpha; varying vec2 vUv;
      void main(){ float x = vUv.x * 12.0; float wave = sin(x + uTime * 0.25) * 0.5 + sin(x * 2.3 - uTime * 0.18) * 0.3;
        float bands = pow(0.5 + 0.5 * sin(x * 3.0 + wave * 4.0), 3.0);
        float v = vUv.y; float fade = smoothstep(0.0, 0.15, v) * (1.0 - smoothstep(0.35, 1.0, v));
        vec3 col = mix(vec3(0.2, 1.0, 0.55), vec3(0.65, 0.3, 1.0), smoothstep(0.3, 0.9, v));
        gl_FragColor = vec4(col, bands * fade * uAlpha * 0.75); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.CylinderGeometry(260 + i * 40, 260 + i * 40, 90, 64, 1, true, i * 1.5, 2.4);
    const m = new THREE.Mesh(geo, mat);
    m.position.y = altToY(240) + i * 12;
    g.add(m);
  }
  return { group: g, mat };
}

/* ---------------- scene utama ---------------- */

export interface RocketPose {
  /** ketinggian roket (km) */
  altKm: number;
  /** tahap pertama sudah lepas: detik sejak lepas (null = belum) */
  sepT: number | null;
  /** ketinggian (km) saat tahap pertama lepas */
  sepAltKm: number;
  /** tahap kedua lepas (kapsul sendiri): detik sejak lepas */
  sep2T: number | null;
  sep2AltKm: number;
  /** Stasiun Luar Angkasa: jarak (unit) di atas kapsul; 0 = sudah merapat; null = belum tampak dekat */
  issGap: number | null;
  /** 0 = mesin mati, 1 = tahap 1 menyala, 2 = tahap 2 menyala */
  burn: 0 | 1 | 2;
  /** kekuatan semburan asap/uap di landasan (0–1) */
  steam: number;
  /** astronaut: "pad" berdiri di bawah, "walk" (0–1 perjalanan naik), "inside", "eva" (detik melayang) */
  astro: { state: "pad" | "walk" | "inside" | "eva"; t: number };
  /** lengan akses: 0 = menempel ke kapsul, 1 = diputar menjauh */
  armOpen: number;
}

export class RocketScene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.05, 20000);
  private skyMat = skyMaterial();
  private sky: THREE.Mesh;
  private stars: THREE.Points;
  private starMat: THREE.PointsMaterial;
  private earth: THREE.Mesh;
  private earthClouds: THREE.Mesh;
  private cloudMat: THREE.ShaderMaterial;
  private glow: THREE.Mesh;
  private ozone: THREE.Mesh;
  private pad: THREE.Group;
  private flags: THREE.ShaderMaterial[] = [];
  private birds: ReturnType<typeof buildBirds>;
  private sats: THREE.Group;
  private moon: THREE.Mesh;
  private sun = new THREE.DirectionalLight(0xffefcf, 3.0);
  private hemi = new THREE.HemisphereLight(0xc9e0ef, 0x48533b, 0.55);
  private amb = new THREE.AmbientLight(0xadb9c7, 0.06);
  r: ReturnType<typeof buildRocket>;
  private t: ReturnType<typeof buildTower>;
  a: ReturnType<typeof buildAstronaut>;
  private tether: THREE.Line;
  private clouds: THREE.Group;
  private planes: THREE.Group;
  private iss: THREE.Group;
  /** mode Jelajah: tempat Stasiun dipajang utuh di orbit (null = tidak dipajang) */
  issShowcase: THREE.Vector3 | null = null;
  private aur: ReturnType<typeof aurora>;
  /** col = alfa per partikel, size = ukuran dunia per partikel */
  private smoke: { pts: THREE.Points; pos: Float32Array; col: Float32Array; vel: Float32Array; age: Float32Array; life: Float32Array; size: Float32Array; big: Float32Array };
  private meteors: { line: THREE.Line; vel: THREE.Vector3; age: number; life: number }[] = [];
  /* isyarat gerak */
  private earthGroup!: THREE.Group;
  private earthBase = new THREE.Quaternion();
  private earthSpin = 0;
  private streaks!: THREE.LineSegments;
  private streakData: Float32Array = new Float32Array(0);
  private trail!: { pts: THREE.Points; pos: Float32Array; alpha: Float32Array; size: Float32Array; age: Float32Array; head: number; acc: number };
  private lastRocketY = 0;
  /** laju naik roket (unit/detik, dihaluskan) */
  climb = 0;
  private meteorWait = 0;
  private time = 0;
  private rand = rng(99);
  private dotTex = softDot();
  private tmp = new THREE.Vector3();
  private uTime = { value: 0 };
  shadowsLive = true;
  private sea!: ReturnType<typeof buildSea>;
  private land!: THREE.Group;
  private cumulus!: THREE.Group;
  private denseClouds: THREE.SpriteMaterial | null = null;
  private textures: THREE.Texture[] = [];
  /** ketinggian roket terakhir (km) */
  private rocketKm = 0;
  /** posisi dunia pusat Bumi */
  readonly earthCenter = new THREE.Vector3(0, -EARTH_R, 0);

  constructor(private low: boolean) {
    const s = this.scene;
    // Langit mengikuti kamera
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(9000, 32, 16), this.skyMat);
    this.sky.renderOrder = -10;
    this.sky.frustumCulled = false;
    s.add(this.sky);
    // Bintang
    const n = low ? 1200 : 2400;
    const pos = new Float32Array(n * 3);
    const r = rng(3);
    for (let i = 0; i < n; i++) {
      const u = r() * 2 - 1;
      const th = r() * TAU;
      const q = Math.sqrt(1 - u * u);
      pos.set([8000 * q * Math.cos(th), 8000 * u, 8000 * q * Math.sin(th)], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.starMat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, fog: false });
    this.stars = new THREE.Points(sg, this.starMat);
    this.stars.renderOrder = -9;
    this.stars.frustumCulled = false;
    s.add(this.stars);

    // Bumi (titik landasan menghadap ke atas: Biak, Papua ±136° BT)
    const loader = new THREE.TextureLoader();
    const day = loader.load("/angkasa/tex/2k_earth_daymap.jpg");
    day.colorSpace = THREE.SRGBColorSpace;
    day.anisotropy = 4;
    const earthGroup = new THREE.Group();
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 128, 96), new THREE.MeshStandardMaterial({ map: day, roughness: 0.9 }));
    const cl = loader.load("/angkasa/tex/2k_earth_clouds.jpg");
    // Awan: peta awan Bumi (sebaran besar) + derau fraktal 3D (gumpalan & tepi berserabut halus) supaya tetap
    // tajam dilihat dari orbit dekat (Stasiun, kupola); diterangi Matahari, sisi malam gelap.
    cl.wrapS = THREE.RepeatWrapping;
    this.cloudMat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: cl }, uSun: { value: new THREE.Vector3(0.45, 0.75, 0.3).normalize() }, uOpacity: { value: 0.95 } },
      vertexShader: `varying vec3 vP; varying vec3 vN; varying vec2 vUv;
        void main(){ vP = normalize(position); vN = normalize(mat3(modelMatrix) * normal); vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D uMap; uniform vec3 uSun; uniform float uOpacity; varying vec3 vP; varying vec3 vN; varying vec2 vUv;
        float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float n3(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
        float fbm4(vec3 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * n3(p); p *= 2.07; a *= 0.5; } return v * 1.07; }
        float fbm2(vec3 p){ return (n3(p) * 0.5 + n3(p * 2.07) * 0.25) * 1.33; }
        void main(){
          float base = texture2D(uMap, vUv).r;
          float big = fbm4(vP * 90.0);
          float fine = fbm2(vP * 420.0 + big * 2.0);
          // gumpalan kecil tersebar di mana-mana (seperti awan kumulus di atas laut), menebal di peta awan
          float c = big * 0.72 + fine * 0.28 + base * 0.55;
          float a = smoothstep(0.5, 0.72, c);
          float sunDot = dot(normalize(vN), uSun);
          float lit = clamp(sunDot * 1.1 + 0.25, 0.04, 1.0);
          vec3 col = mix(vec3(0.7, 0.76, 0.86), vec3(1.0), smoothstep(0.55, 0.85, c)) * lit;
          gl_FragColor = vec4(col, a * uOpacity);
        }`,
      transparent: true,
      depthWrite: false,
    });
    this.earthClouds = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R + 1.2, 160, 120), this.cloudMat);
    earthGroup.add(this.earth, this.earthClouds);
    const lon = 136,
      lat = -1;
    const phi = ((lon + 180) / 360) * TAU;
    const theta = ((90 - lat) / 180) * Math.PI;
    const dir = new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta)).normalize();
    earthGroup.quaternion.setFromUnitVectors(dir, new THREE.Vector3(0, 1, 0));
    earthGroup.position.copy(this.earthCenter);
    s.add(earthGroup);
    this.earthGroup = earthGroup;
    this.earthBase.copy(earthGroup.quaternion);
    // Pendar atmosfer dari luar angkasa
    this.glow = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R + altToY(60), 96, 64),
      new THREE.ShaderMaterial({
        uniforms: { uAlpha: { value: 0 } },
        vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: `uniform float uAlpha; varying vec3 vN; varying vec3 vW; void main(){ vec3 V = normalize(cameraPosition - vW); float fr = pow(1.0 - abs(dot(normalize(vN), V)), 3.0); gl_FragColor = vec4(0.35, 0.65, 1.0, fr * uAlpha); }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    );
    this.glow.position.copy(this.earthCenter);
    s.add(this.glow);
    // Lapisan ozon (tipis kebiruan, ilustrasi)
    this.ozone = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R + altToY(25), 96, 64),
      new THREE.MeshBasicMaterial({ color: 0x7f8cff, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide, fog: false }),
    );
    this.ozone.position.copy(this.earthCenter);
    s.add(this.ozone);

    const site = buildSite(low);
    this.pad = site.group;
    this.flags = site.flags;
    s.add(this.pad);
    // medan berbukit, laut, hutan tropis & pohon kelapa, awan kumulus di kejauhan
    this.land = new THREE.Group();
    this.land.add(buildTerrain(low, (t) => this.textures.push(t)));
    this.sea = buildSea(new THREE.Vector3(240, 380, 190), low);
    this.land.add(this.sea.mesh, buildCoast(low));
    this.land.add(buildFlora(low, this.uTime, (t) => this.textures.push(t)));
    s.add(this.land);
    this.cumulus = buildCumulus(low, (t) => this.textures.push(t));
    s.add(this.cumulus);
    // Burung di troposfer bawah
    this.birds = buildBirds(low ? 8 : 16);
    this.birds.group.position.y = altToY(2.5);
    s.add(this.birds.group);
    // Satelit di eksosfer (di atas stasiun)
    this.sats = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const sat = buildSatellite(i + 1);
      const a = (i / 6) * TAU + 0.4;
      // ilustrasi: dirapatkan di atas stasiun agar terlihat saat kamera menatap ke atas
      sat.position.set(Math.cos(a) * (13 + i * 3), altToY(400) + 8 + i * 4, Math.sin(a) * (13 + i * 3));
      sat.scale.setScalar(1.6);
      const blink = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff3b3b : 0x3dff8a }));
      blink.position.set(0, 0.55, 0);
      blink.name = "blink";
      sat.add(blink);
      this.sats.add(sat);
    }
    s.add(this.sats);
    this.moon = buildMoon();
    s.add(this.moon);
    this.t = buildTower();
    s.add(this.t.tower);
    // bendera Merah Putih berkibar di puncak menara
    const towerFlag = flag(0.9, 1.3);
    towerFlag.group.position.set(-0.3, 7.4, -0.3);
    this.t.tower.add(towerFlag.group);
    this.flags.push(towerFlag.mat);
    this.r = buildRocket();
    s.add(this.r.rocket);
    this.a = buildAstronaut();
    // model 3D Agam (Higgsfield) menggantikan astronaut prosedural begitu selesai dimuat
    this.agam = new AgamModel(this.a.astro, (root) => tag(root, "astronot"));
    s.add(this.a.astro);
    this.tether = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xffffff }));
    this.tether.visible = false;
    this.tether.frustumCulled = false;
    s.add(this.tether);

    // Awan troposfer
    this.clouds = new THREE.Group();
    // awan yang ditembus roket: baru tampak setelah roket lepas landas (di landasan langit tetap cerah)
    const cloudMat = new THREE.SpriteMaterial({ map: this.dotTex, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
    this.denseClouds = cloudMat;
    const cr = rng(12);
    for (let i = 0; i < (low ? 50 : 90); i++) {
      const sp = new THREE.Sprite(cloudMat);
      const a = cr() * TAU;
      const d = 6 + cr() * 70;
      const y = altToY(3 + cr() * 6);
      sp.position.set(Math.cos(a) * d, y, Math.sin(a) * d);
      sp.scale.setScalar(2.5 + cr() * 5);
      this.clouds.add(sp);
    }
    // lapisan awan rapat di sekitar jalur roket (terasa "menembus awan")
    for (let i = 0; i < (low ? 24 : 44); i++) {
      const sp = new THREE.Sprite(cloudMat);
      const a = cr() * TAU;
      const d = 2.2 + cr() * 9;
      sp.position.set(Math.cos(a) * d, altToY(4.5 + cr() * 3), Math.sin(a) * d);
      sp.scale.setScalar(2 + cr() * 3.5);
      this.clouds.add(sp);
    }
    s.add(this.clouds);

    // Garis kecepatan: melesat ke bawah di sekitar kamera saat roket melaju
    const N = low ? 80 : 150;
    this.streakData = new Float32Array(N * 3); // x, y, z relatif kamera
    const sr = rng(55);
    for (let i = 0; i < N; i++) {
      const a = sr() * TAU,
        d = 3 + sr() * 22;
      this.streakData.set([Math.cos(a) * d, (sr() - 0.5) * 60, Math.sin(a) * d], i * 3);
    }
    const sg2 = new THREE.BufferGeometry();
    sg2.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 6), 3));
    this.streaks = new THREE.LineSegments(
      sg2,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
    );
    this.streaks.frustumCulled = false;
    s.add(this.streaks);

    // Jejak asap panjang yang tertinggal di belakang roket
    const TN = low ? 160 : 320;
    const tg = new THREE.BufferGeometry();
    const tpos = new Float32Array(TN * 3).fill(-9999),
      talpha = new Float32Array(TN),
      tsize = new Float32Array(TN);
    tg.setAttribute("position", new THREE.BufferAttribute(tpos, 3));
    tg.setAttribute("aAlpha", new THREE.BufferAttribute(talpha, 1));
    tg.setAttribute("aSize", new THREE.BufferAttribute(tsize, 1));
    const tpts = new THREE.Points(
      tg,
      new THREE.ShaderMaterial({
        uniforms: { uScale: { value: 300 } },
        vertexShader: `attribute float aAlpha; attribute float aSize; uniform float uScale; varying float vA;
          void main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.95), smoothstep(0.5, 0.05, d) * vA); }`,
        transparent: true,
        depthWrite: false,
      }),
    );
    tpts.frustumCulled = false;
    s.add(tpts);
    this.trail = { pts: tpts, pos: tpos, alpha: talpha, size: tsize, age: new Float32Array(TN).fill(99), head: 0, acc: 0 };

    // Pesawat di troposfer
    this.planes = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const p = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1, 4, 10), white());
      body.rotation.z = Math.PI / 2;
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 1.4), white());
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.03), new THREE.MeshStandardMaterial({ color: 0xff7a1a }));
      tail.position.set(-0.55, 0.18, 0);
      p.add(body, wing, tail);
      p.userData.phase = i * 0.5;
      p.userData.y = altToY(9 + i * 1.5);
      this.planes.add(p);
    }
    s.add(this.planes);

    // Stasiun luar angkasa ±400 km
    this.iss = buildStation();
    this.iss.visible = false;
    s.add(this.iss);

    this.aur = aurora();
    s.add(this.aur.group);

    // Asap & uap
    const sn = low ? 220 : 420;
    const smokeGeo = new THREE.BufferGeometry();
    const spos = new Float32Array(sn * 3).fill(-9999);
    const scol = new Float32Array(sn); // alfa per partikel
    const ssize = new Float32Array(sn);
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(spos, 3));
    smokeGeo.setAttribute("aAlpha", new THREE.BufferAttribute(scol, 1));
    smokeGeo.setAttribute("aSize", new THREE.BufferAttribute(ssize, 1));
    // Asap putih keabuan yang memudar jadi transparan (bukan hitam).
    const smokePts = new THREE.Points(
      smokeGeo,
      new THREE.ShaderMaterial({
        uniforms: { uScale: { value: 300 } },
        vertexShader: `attribute float aAlpha; attribute float aSize; uniform float uScale; varying float vA;
          void main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, d) * vA;
          gl_FragColor = vec4(vec3(0.93, 0.93, 0.95) - d * 0.25, a); }`,
        transparent: true,
        depthWrite: false,
      }),
    );
    smokePts.frustumCulled = false;
    s.add(smokePts);
    this.smoke = {
      pts: smokePts,
      pos: spos,
      col: scol,
      vel: new Float32Array(sn * 3),
      age: new Float32Array(sn).fill(99),
      life: new Float32Array(sn).fill(1),
      size: ssize,
      big: new Float32Array(sn),
    };

    // Meteor
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array([1, 0.9, 0.7, 0, 0, 0]), 3));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      line.visible = false;
      line.frustumCulled = false;
      s.add(line);
      this.meteors.push({ line, vel: new THREE.Vector3(), age: 1, life: 1 });
    }

    this.sun.position.set(240, 380, 190);
    // bayangan Matahari di sekitar landasan
    this.sun.castShadow = true;
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = sc.bottom = -58;
    sc.right = sc.top = 58;
    sc.near = 150;
    sc.far = 780;
    this.sun.shadow.mapSize.set(low ? 2048 : 4096, low ? 2048 : 4096);
    this.sun.shadow.bias = -0.00008;
    this.sun.shadow.normalBias = 0.012;
    this.sun.shadow.radius = 2;
    s.add(this.sun, this.sun.target, this.hemi, this.amb);
    for (const o of [this.r.rocket, this.t.tower, this.a.astro]) o.traverse((c) => ((c as THREE.Mesh).isMesh ? (c.castShadow = true) : null));
    this.scene.fog = new THREE.FogExp2(0xcfe7ff, 0.004);
  }

  /** Terapkan pose roket & astronaut (fungsi murni dari timeline). */
  applyPose(p: RocketPose) {
    this.rocketKm = p.altKm;
    const y = altToY(p.altKm);
    const { rocket, s1, f1, f2 } = this.r;
    rocket.position.set(0, y, 0);
    // Tahap pertama: jatuh & berputar setelah lepas
    if (p.sepT === null) {
      if (s1.parent !== rocket) {
        rocket.add(s1);
      }
      s1.position.set(0, 0, 0);
      s1.rotation.set(0, 0, 0);
      s1.visible = true;
    } else {
      const t = p.sepT;
      if (s1.parent !== this.scene) this.scene.add(s1);
      const sepY = altToY(p.sepAltKm); // tertinggal di ketinggian saat lepas, lalu jatuh pelan
      s1.position.set(0.3 * t, sepY - 0.6 * t - 0.35 * t * t, 0.15 * t);
      s1.rotation.set(0.12 * t, 0, -0.18 * t);
      s1.visible = t < 14;
    }
    // Tahap kedua lepas: kapsul melanjutkan sendiri, tahap kedua menjauh pelan
    const s2 = this.r.s2;
    if (p.sep2T === null) {
      if (s2.parent !== rocket) rocket.add(s2);
      s2.position.set(0, 0, 0);
      s2.rotation.set(0, 0, 0);
      s2.visible = true;
    } else {
      const t = p.sep2T;
      if (s2.parent !== this.scene) this.scene.add(s2);
      s2.position.set(-0.25 * t, altToY(p.sep2AltKm) - 0.35 * t, -0.2 * t);
      s2.rotation.set(0.05 * t, 0, 0.08 * t);
      s2.visible = t < 25;
    }
    // Stasiun Luar Angkasa mendekat di atas kapsul, lalu merapat
    const esc = this.r.cap.getObjectByName("escape");
    if (esc) esc.visible = p.issGap === null && p.sep2T === null;
    this.iss.visible = p.issGap !== null || !!this.issShowcase;
    if (p.issGap !== null) {
      const port = this.iss.userData.portOffset as THREE.Vector3;
      this.iss.position.set(-port.x, y + 5.92 - port.y + p.issGap, -port.z);
      this.iss.rotation.set(0, 0, 0);
      this.iss.updateMatrixWorld(true);
    }
    f1.group.visible = p.burn === 1;
    f2.group.visible = p.burn === 2;
    // Nyala makin panjang di udara tipis
    const expand = 1 + smooth(10, 120, p.altKm) * 1.4;
    f1.group.scale.set(expand, 1 + smooth(0, 60, p.altKm) * 0.6, expand);
    f2.group.scale.set(expand, 1 + smooth(60, 300, p.altKm), expand);
    // Lengan akses kru
    this.t.arm.rotation.y = p.armOpen * 1.3;
    // Astronaut
    const astro = this.a.astro;
    astro.visible = p.astro.state !== "inside";
    this.tether.visible = p.astro.state === "eva";
    if (p.astro.state === "pad") {
      astro.position.set(3.6, 0, 2.2);
      astro.rotation.set(0, -0.8, 0);
      this.t.lift.position.set(0, 0.3, 0);
      this.walkPose(0);
    } else if (p.astro.state === "walk") {
      const k = p.astro.t;
      const liftY = 5.25 + 0.03;
      if (k < 0.35) {
        const u = k / 0.35;
        astro.position.set(3.6 - 1.4 * u, 0, 2.2 - 2.2 * u);
        astro.rotation.set(0, -2.2, 0);
        this.t.lift.position.set(0, 0.3, 0);
        this.walkPose(u * 10);
      } else if (k < 0.65) {
        const u = smooth(0.35, 0.65, k);
        astro.position.set(2.2, u * liftY, 0);
        astro.rotation.set(0, -Math.PI / 2, 0);
        this.t.lift.position.set(0, 0.3 + u * liftY, 0);
        this.walkPose(0);
      } else {
        const u = (k - 0.65) / 0.35;
        astro.position.set(2.2 - 1.75 * Math.min(1, u * 1.1), liftY, 0);
        astro.rotation.set(0, -Math.PI / 2, 0);
        this.t.lift.position.set(0, 0.3 + liftY, 0);
        this.walkPose(u * 10);
        astro.visible = u < 0.95;
      }
    } else if (p.astro.state === "eva") {
      const t = p.astro.t;
      // Berjalan di luar angkasa dekat panel surya stasiun (atau dekat kapsul bila stasiun belum ada)
      const target = p.issGap !== null ? this.iss.localToWorld((this.iss.userData.panelPoint as THREE.Vector3).clone()) : this.tmp.set(1.6, y + 5.6, 1.1);
      const out = Math.min(1, t / 6);
      const start = new THREE.Vector3(0.4, y + 5.6, 0.3);
      astro.position.lerpVectors(start, target, out).add(new THREE.Vector3(0, Math.sin(t * 0.5) * 0.12, 0));
      astro.rotation.set(Math.sin(t * 0.3) * 0.3, -0.6 + t * 0.05, Math.sin(t * 0.25) * 0.25);
      this.a.armL.rotation.z = 0.9 + Math.sin(t * 0.7) * 0.2;
      this.a.armR.rotation.z = -0.9 - Math.sin(t * 0.6) * 0.2;
      this.a.legL.rotation.x = Math.sin(t * 0.4) * 0.3;
      this.a.legR.rotation.x = -Math.sin(t * 0.4) * 0.3;
      // melayang: lengan setengah terbuka bergoyang pelan, kaki mengayun lambat
      this.agam?.pose({ legL: Math.sin(t * 0.4) * 0.3, legR: -Math.sin(t * 0.4) * 0.3, armL: Math.sin(t * 0.7) * 0.25, armR: -Math.sin(t * 0.6) * 0.25, lower: 0.35 });
      const tp = this.tether.geometry.getAttribute("position") as THREE.BufferAttribute;
      const hook = p.issGap !== null ? this.iss.localToWorld(new THREE.Vector3(1.2, 0, 0.2)) : new THREE.Vector3(0.3, y + 5.35, 0.15);
      tp.setXYZ(0, hook.x, hook.y, hook.z);
      const back = astro.localToWorld(new THREE.Vector3(0, 0.46, -0.2));
      tp.setXYZ(1, back.x, back.y, back.z);
      tp.needsUpdate = true;
    }
    this.steam = p.steam;
    this.burn = p.burn;
    this.rocketY = y;
  }

  private steam = 0;
  private burn: 0 | 1 | 2 = 0;
  private rocketY = 0;
  private agam: AgamModel;

  private walkPose(phase: number) {
    const s = Math.sin(phase * 1.6) * 0.5;
    this.a.legL.rotation.x = s;
    this.a.legR.rotation.x = -s;
    this.a.armL.rotation.x = -s * 0.7;
    this.a.armR.rotation.x = s * 0.7;
    this.a.armL.rotation.z = 0;
    this.a.armR.rotation.z = 0;
    this.agam?.pose({ legL: s, legR: -s, armL: -s * 0.7, armR: s * 0.7, lower: 1 });
  }

  /** Lingkungan menurut ketinggian KAMERA (langit, kabut, bintang, aurora, dll.) + partikel. */
  update(dt: number) {
    this.time += dt;
    if (this.issShowcase) {
      this.iss.visible = true;
      this.iss.position.copy(this.issShowcase);
      this.iss.rotation.set(0.08, 0.5, 0);
    }
    const cam = this.camera;
    const camAlt = yToAlt(cam.position.y);
    this.sky.position.copy(cam.position);
    this.stars.position.copy(cam.position);
    const up = this.tmp.copy(cam.position).sub(this.earthCenter).normalize();
    const u = this.skyMat.uniforms;
    u.uUp.value.copy(up);
    ramp(ZENITH, this.rocketKm < 0.1 && camAlt < 22 ? 0 : camAlt, u.uZenith.value);
    ramp(HORIZON, camAlt, u.uHorizon.value);
    u.uSpace.value = smooth(60, 120, camAlt);
    this.starMat.opacity = smooth(20, 90, camAlt);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color.copy(u.uHorizon.value);
    fog.density = 0.0034 * (1 - smooth(0, 12, camAlt)) + 0.0007 * (1 - smooth(12, 30, camAlt));
    this.hemi.intensity = 0.48 * (1 - smooth(20, 90, camAlt)) + 0.1;
    (this.glow.material as THREE.ShaderMaterial).uniforms.uAlpha.value = smooth(25, 120, camAlt);
    (this.ozone.material as THREE.MeshBasicMaterial).opacity = 0.06 * smooth(8, 20, camAlt) * (1 - smooth(60, 200, camAlt)) + 0.05 * smooth(200, 600, camAlt);
    this.pad.visible = camAlt < 130;
    // dari ketinggian, daratan & laut rinci diganti bola Bumi bertekstur
    this.land.visible = camAlt < 130;
    // The coarse globe otherwise pokes through the curved coastal surface in angular blue patches.
    this.earth.visible = !this.land.visible;
    this.uTime.value = this.time;
    const su = this.sea.mat.uniforms;
    su.uTime.value = this.time;
    su.uSky.value.copy(u.uHorizon.value);
    su.uZenith.value.copy(u.uZenith.value);
    this.cumulus.visible = camAlt < 40;
    if (this.denseClouds) this.denseClouds.opacity = 0.85 * smooth(0.15, 1.2, this.rocketKm);
    /** bayangan hanya perlu dihitung ulang saat kamera dekat tanah */
    this.shadowsLive = camAlt < 40;
    this.clouds.visible = camAlt < 120;
    this.aur.mat.uniforms.uTime.value = this.time;
    this.aur.mat.uniforms.uAlpha.value = smooth(70, 130, camAlt) * (1 - smooth(500, 1200, camAlt));
    this.aur.group.visible = camAlt > 60 && !this.issShowcase;
    this.cloudMat.uniforms.uSun.value.copy(this.sun.position).normalize();
    // awan Bumi dari orbit: baru tampak saat kamera sudah tinggi (di bawah itu ada awan kumulus sendiri)
    this.cloudMat.uniforms.uOpacity.value = 0.95 * smooth(30, 90, camAlt);
    this.earthClouds.visible = camAlt > 30;
    for (const f of this.flags) f.uniforms.uTime.value = this.time;
    const beacon = this.t.tower.getObjectByName("beacon") as THREE.Mesh | undefined;
    if (beacon) beacon.visible = Math.sin(this.time * 3) > 0;
    this.birds.update(this.time);
    this.birds.group.visible = camAlt < 20;
    this.sats.visible = camAlt > 150;
    this.sats.children.forEach((c, i) => (c.rotation.y = this.time * (0.05 + i * 0.01)));
    this.moon.visible = camAlt > 40;
    this.moon.position.copy(cam.position).add(new THREE.Vector3(-2600, 1400, -3400));
    // Pesawat melintas pelan
    for (const p of this.planes.children) {
      const k = ((this.time * 0.02 + (p.userData.phase as number)) % 1) * 2 - 1;
      p.position.set(k * 60, p.userData.y as number, 12 + (p.userData.phase as number) * 20);
    }
    this.r.f1.mat.uniforms.uTime.value = this.time;
    this.r.f2.mat.uniforms.uTime.value = this.time;
    this.updateSmoke(dt);
    this.updateMeteors(dt, camAlt);
    this.updateMotion(dt, camAlt);
  }

  private updateSmoke(dt: number) {
    const s = this.smoke;
    const n = s.age.length;
    const r = this.rand;
    const alt = yToAlt(this.rocketY);
    // laju semburan: uap sebelum lepas landas, asap tebal saat mesin menyala di udara padat
    const air = 1 - smooth(8, 30, alt);
    const rate = (this.steam * 60 + (this.burn ? 220 * air : 0)) * (this.low ? 0.5 : 1);
    let spawn = rate * dt;
    for (let i = 0; i < n; i++) {
      const j = i * 3;
      if (s.age[i] >= s.life[i]) {
        if (spawn < 1 && r() > spawn) continue;
        spawn -= 1;
        s.age[i] = 0;
        const ground = this.rocketY < 3;
        s.big[i] = ground && this.burn ? 1 : 0;
        s.life[i] = ground ? 3 + r() * 3 : 2 + r() * 2;
        s.pos[j] = (r() - 0.5) * 0.4;
        s.pos[j + 1] = this.rocketY + (this.burn ? -1.2 : 0.15);
        s.pos[j + 2] = (r() - 0.5) * 0.4;
        if (!this.burn) {
          // uap kecil dari sisi roket sebelum lepas landas
          s.pos[j] += (r() < 0.5 ? -1 : 1) * 0.35;
          s.life[i] = 1.5 + r();
          s.vel[j] = (s.pos[j] > 0 ? 1 : -1) * (0.3 + r() * 0.4);
          s.vel[j + 1] = 0.4 + r() * 0.5;
          s.vel[j + 2] = (r() - 0.5) * 0.3;
          continue;
        }
        if (ground) {
          const a = r() * TAU;
          const sp = 2 + r() * 4;
          s.vel[j] = Math.cos(a) * sp;
          s.vel[j + 1] = 0.3 + r() * 0.8;
          s.vel[j + 2] = Math.sin(a) * sp;
        } else {
          s.vel[j] = (r() - 0.5) * 0.8;
          s.vel[j + 1] = -2 - r() * 2;
          s.vel[j + 2] = (r() - 0.5) * 0.8;
        }
        continue;
      }
      s.age[i] += dt;
      s.pos[j] += s.vel[j] * dt;
      s.pos[j + 1] += s.vel[j + 1] * dt;
      s.pos[j + 2] += s.vel[j + 2] * dt;
      s.vel[j] *= 0.985;
      s.vel[j + 2] *= 0.985;
      const k = s.age[i] / s.life[i];
      const big = s.big[i];
      s.col[i] = (0.55 + big * 0.3) * Math.sin(Math.PI * Math.min(1, k * 1.2)) * (1 - k * 0.8);
      s.size[i] = 1.2 + big * 1.5 + k * (3.5 + big * 5);
    }
    s.pts.geometry.getAttribute("position").needsUpdate = true;
    s.pts.geometry.getAttribute("aAlpha").needsUpdate = true;
    s.pts.geometry.getAttribute("aSize").needsUpdate = true;
  }

  private updateMeteors(dt: number, camAlt: number) {
    const active = camAlt > 40 && camAlt < 110;
    this.meteorWait -= dt;
    if (active && this.meteorWait <= 0) {
      const m = this.meteors.find((x) => !x.line.visible);
      if (m) {
        const r = this.rand;
        const cam = this.camera.position;
        m.line.position.set(cam.x + (r() - 0.5) * 80, cam.y + 20 + r() * 25, cam.z - 30 - r() * 40);
        m.vel.set((r() - 0.5) * 30, -25 - r() * 15, (r() - 0.5) * 10);
        m.age = 0;
        m.life = 0.9 + r() * 0.6;
        m.line.visible = true;
      }
      this.meteorWait = 0.8 + this.rand() * 1.4;
    }
    for (const m of this.meteors) {
      if (!m.line.visible) continue;
      m.age += dt;
      const k = m.age / m.life;
      if (k >= 1) {
        m.line.visible = false;
        continue;
      }
      m.line.position.addScaledVector(m.vel, dt);
      const tail = m.vel.clone().multiplyScalar(-0.25);
      const p = m.line.geometry.getAttribute("position") as THREE.BufferAttribute;
      p.setXYZ(1, tail.x, tail.y, tail.z);
      p.needsUpdate = true;
      (m.line.material as THREE.LineBasicMaterial).opacity = Math.sin(Math.PI * k);
    }
  }

  /** Isyarat gerak: laju naik, garis kecepatan, jejak asap, Bumi berputar pelan saat di orbit, lampu kedip. */
  private updateMotion(dt: number, camAlt: number) {
    const inst = dt > 0 ? (this.rocketY - this.lastRocketY) / dt : 0;
    this.lastRocketY = this.rocketY;
    this.climb += (Math.max(0, Math.min(inst, 40)) - this.climb) * Math.min(1, dt * 3);
    const alt = yToAlt(this.rocketY);
    // garis kecepatan
    const sp = Math.min(1, this.climb / 2.5);
    const vis = sp * (1 - smooth(90, 160, camAlt)) * (this.burn ? 1 : 0.3);
    const mat = this.streaks.material as THREE.LineBasicMaterial;
    mat.opacity = 0.35 * vis;
    this.streaks.visible = vis > 0.02;
    if (this.streaks.visible) {
      const d = this.streakData,
        p = this.streaks.geometry.getAttribute("position") as THREE.BufferAttribute;
      const cam = this.camera.position;
      const v = 18 + this.climb * 14,
        len = 1.5 + this.climb * 1.6;
      for (let i = 0; i < d.length / 3; i++) {
        d[i * 3 + 1] -= v * dt;
        if (d[i * 3 + 1] < -30) d[i * 3 + 1] += 60;
        const x = cam.x + d[i * 3],
          y = cam.y + d[i * 3 + 1],
          z = cam.z + d[i * 3 + 2];
        p.setXYZ(i * 2, x, y, z);
        p.setXYZ(i * 2 + 1, x, y + len, z);
      }
      p.needsUpdate = true;
    }
    // jejak asap: titik ditinggalkan di bawah nosel, memudar & mengembang pelan
    const t = this.trail;
    const n = t.age.length;
    if (this.burn && alt < 140) {
      t.acc += dt;
      const nozzle = this.rocketY + (this.burn === 1 ? -0.2 : 3.2);
      while (t.acc > 0.03) {
        t.acc -= 0.03;
        const i = t.head;
        t.head = (t.head + 1) % n;
        t.pos[i * 3] = (Math.random() - 0.5) * 0.15;
        t.pos[i * 3 + 1] = nozzle;
        t.pos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
        t.age[i] = 0;
      }
    }
    const thin = 1 - smooth(30, 120, alt);
    for (let i = 0; i < n; i++) {
      t.age[i] += dt;
      const k = t.age[i] / 9;
      t.alpha[i] = k < 1 ? (0.5 * thin + 0.12) * (1 - k) : 0;
      t.size[i] = 0.5 + k * 3 * (0.4 + thin);
    }
    t.pts.geometry.getAttribute("position").needsUpdate = true;
    t.pts.geometry.getAttribute("aAlpha").needsUpdate = true;
    t.pts.geometry.getAttribute("aSize").needsUpdate = true;
    // Bumi berputar pelan di bawah saat mengorbit (terasa bergerak mengelilingi Bumi)
    if (alt > 120) this.earthSpin += dt * 0.012;
    else if (alt < 20) this.earthSpin = 0;
    this.earthGroup.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.earthSpin).multiply(this.earthBase);
    // lampu kedip satelit
    const on = Math.sin(this.time * 4) > 0.3;
    this.sats.traverse((o) => {
      if (o.name === "blink") o.visible = on;
    });
  }

  dispose() {
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>([this.dotTex, ...this.textures]);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) geometries.add(m.geometry);
      for (const mat of Array.isArray(m.material) ? m.material : m.material ? [m.material] : []) materials.add(mat);
      if (m.customDepthMaterial) materials.add(m.customDepthMaterial);
      if (m instanceof THREE.InstancedMesh) m.dispose();
    });
    materials.forEach(m => {
      for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value);
      if (m instanceof THREE.ShaderMaterial) for (const u of Object.values(m.uniforms)) if (u.value instanceof THREE.Texture) textures.add(u.value);
      m.dispose();
    });
    geometries.forEach(g => g.dispose());
    textures.forEach(t => t.dispose());
  }
}
