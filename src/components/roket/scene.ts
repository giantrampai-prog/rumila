// Scene 3D "Roket & Astronot": landasan, menara, roket 3 bagian, astronaut, langit yang berubah menurut
// ketinggian, awan, pesawat, ozon, meteor, aurora, Stasiun Luar Angkasa, dan Bumi dari orbit.
// Skala ILUSTRASI: radius Bumi = 1000 unit; ketinggian dipetakan non-linear (km → unit) agar semua lapisan
// sempat terlihat. Semua pose roket/astronaut adalah fungsi murni dari (persinggahan, progres) sehingga
// melompat ke persinggahan mana pun tetap konsisten.

import * as THREE from "three";
import { buildBirds, buildMoon, buildSatellite, buildSite, buildStation, flag, gridFin, landingLeg, nozzleMaterial, rocketBodyTex } from "./details";

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
        gl_FragColor = vec4(col, 1.0); }`,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  });
}

const ZENITH: [number, string][] = [
  [0, "#3d8ae6"],
  [12, "#2159c2"],
  [35, "#0f2f86"],
  [65, "#051448"],
  [100, "#010312"],
];
const HORIZON: [number, string][] = [
  [0, "#cfe7ff"],
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

function flame(len: number, radius: number) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPower: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uTime; uniform float uPower; varying vec2 vUv;
      void main(){ float y = vUv.y; float flick = 0.85 + 0.15 * sin(uTime * 40.0 + y * 20.0);
        vec3 core = vec3(1.0, 0.97, 0.85); vec3 edge = vec3(1.0, 0.45, 0.1);
        vec3 col = mix(edge, core, smoothstep(0.2, 1.0, y));
        float a = smoothstep(0.0, 0.5, y) * flick * uPower; gl_FragColor = vec4(col * 1.4, a); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(radius, len, 24, 1, true), mat);
  outer.rotation.x = Math.PI; // ujung runcing ke bawah
  outer.position.y = -len / 2;
  const inner = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.5, len * 0.6, 16, 1, true), mat);
  inner.rotation.x = Math.PI;
  inner.position.y = -len * 0.3;
  g.add(outer, inner);
  return { group: g, mat };
}

function buildRocket() {
  const rocket = new THREE.Group();
  rocket.name = "rocket";
  const R = 0.32;
  // Tahap pertama (0.3 → 3.6)
  const s1 = new THREE.Group();
  const body1 = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 3.3, 48), new THREE.MeshStandardMaterial({ map: rocketBodyTex(1), roughness: 0.45, metalness: 0.1 }));
  body1.position.y = 1.95;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.005, R * 1.005, 0.25, 32), dark());
  band.position.y = 3.35;
  s1.add(body1, band);
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
  const f1 = flame(2.4, 0.3);
  f1.group.position.y = 0.12;
  s1.add(f1.group);
  tag(s1, "tahap-1");
  tag(engines, "mesin");
  // Tahap kedua (3.6 → 5.0)
  const s2 = new THREE.Group();
  const body2 = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 1.4, 48), new THREE.MeshStandardMaterial({ map: rocketBodyTex(2), roughness: 0.45, metalness: 0.1 }));
  body2.position.y = 4.3;
  const logo = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.005, R * 1.005, 0.08, 32), new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.5 }));
  logo.position.y = 4.75;
  const bell2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.3, 16, 1, true), nozzleMaterial());
  bell2.position.y = 3.5;
  s2.add(body2, logo, bell2);
  const f2 = flame(1.8, 0.2);
  f2.group.position.y = 3.35;
  s2.add(f2.group);
  tag(s2, "tahap-2");
  // Kapsul (5.0 → 5.9) + menara penyelamat
  const cap = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, R, 0.9, 32), white());
  cone.position.y = 5.45;
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.06, 32), dark());
  shield.position.y = 5.03;
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.02), new THREE.MeshStandardMaterial({ color: 0x2b6cff, emissive: 0x16357a, roughness: 0.2, metalness: 0.6 }));
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
  const red = new THREE.MeshStandardMaterial({ color: 0xd9483b, roughness: 0.6, metalness: 0.2 });
  const grey = new THREE.MeshStandardMaterial({ color: 0x9aa3ae, roughness: 0.7 });
  const H = 7.4,
    W = 1.1;
  for (const [x, z] of [
    [-W / 2, -W / 2],
    [W / 2, -W / 2],
    [-W / 2, W / 2],
    [W / 2, W / 2],
  ]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, H, 0.07), red);
    post.position.set(x, H / 2, z);
    tower.add(post);
  }
  for (let y = 0.6; y < H; y += 0.6) {
    for (const [w, d, x, z] of [
      [W, 0.05, 0, -W / 2],
      [W, 0.05, 0, W / 2],
      [0.05, W, -W / 2, 0],
      [0.05, W, W / 2, 0],
    ]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), red);
      b.position.set(x, y, z);
      tower.add(b);
    }
  }
  // lift (kotak abu) & lengan akses kru
  // palang silang tiap tingkat + lampu merah di puncak
  for (let y = 0.3; y < H; y += 0.6) {
    for (const [x, z, ry] of [
      [0, -W / 2, 0],
      [0, W / 2, 0],
      [-W / 2, 0, Math.PI / 2],
      [W / 2, 0, Math.PI / 2],
    ]) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(W, 0.6), 0.03, 0.03), red);
      d.position.set(x, y, z);
      d.rotation.set(0, ry, Math.atan2(0.6, W));
      tower.add(d);
    }
  }
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff2a2a }));
  beacon.position.set(0, H + 0.15, 0);
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
  const rail = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
  rail.position.set(-0.75, 0.18, 0.2);
  const rail2 = rail.clone();
  rail2.position.z = -0.2;
  const room = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.6 }));
  room.position.set(-1.35, 0.25, 0);
  arm.add(deck, rail, rail2, room);
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
    // logo misi RUMILA: lingkaran biru, roket & orbit
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
    g.fillText("RUMILA", w / 2, h - 18);
  });
}

/** Astronaut berbaju antariksa detail: helm berkaca emas & lampu, kotak kendali dada, ransel, selang,
 *  sarung tangan & sepatu abu-abu, sambungan siku/lutut, bendera Merah Putih di bahu, logo misi RUMILA. */
export function buildAstronaut() {
  const a = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0xf5f4ee, roughness: 0.75 });
  const grey = new THREE.MeshStandardMaterial({ color: 0xa9b0bb, roughness: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x5b6270, roughness: 0.5, metalness: 0.3 });
  const glove = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.8 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.135, 0.18, 8, 20), suit);
  torso.position.y = 0.42;
  // helm: cangkang putih + kaca emas memantul + lampu & kamera di kiri-kanan
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.135, 32, 20), suit);
  helmet.position.y = 0.69;
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.118, 32, 20, Math.PI * 0.12, Math.PI * 0.76, Math.PI * 0.2, Math.PI * 0.5),
    new THREE.MeshPhysicalMaterial({ color: 0xe8a73a, roughness: 0.05, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0x3a2508 }),
  );
  visor.position.set(0, 0.69, 0.03);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 28), grey);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.575;
  a.add(helmet, visor, ring);
  for (const sx of [-1, 1]) {
    const lampBox = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.045, 0.05), suit);
    lampBox.position.set(sx * 0.13, 0.72, 0.04);
    const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.014, 12), new THREE.MeshBasicMaterial({ color: 0xfffbe6 }));
    lamp.position.set(sx * 0.13, 0.72, 0.066);
    a.add(lampBox, lamp);
  }
  // kotak kendali di dada + tombol + selang
  const dcm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.06), suit);
  dcm.position.set(0, 0.46, 0.15);
  a.add(dcm);
  for (let k = 0; k < 4; k++) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.02, 8), dark);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(-0.05 + k * 0.033, 0.47, 0.185);
    a.add(knob);
  }
  for (const sx of [-1, 1]) {
    const hose = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.009, 6, 16, Math.PI), dark);
    hose.position.set(sx * 0.07, 0.4, 0.14);
    hose.rotation.set(0, sx * 0.6, Math.PI / 2);
    a.add(hose);
  }
  // ransel penunjang hidup (oksigen, pendingin) + antena
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.13), suit);
  pack.position.set(0, 0.47, -0.17);
  const packLid = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.1), grey);
  packLid.position.set(0, 0.64, -0.17);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.12), dark);
  antenna.position.set(0.1, 0.72, -0.2);
  a.add(pack, packLid, antenna);
  // bendera Merah Putih di bahu kiri & logo misi di dada kanan
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.05), new THREE.MeshStandardMaterial({ map: patchTex("flag"), roughness: 0.8 }));
  flag.position.set(-0.155, 0.53, 0.035);
  flag.rotation.y = -1.1;
  const mission = new THREE.Mesh(new THREE.CircleGeometry(0.03, 20), new THREE.MeshStandardMaterial({ map: patchTex("mission"), roughness: 0.8 }));
  mission.position.set(0.075, 0.535, 0.132);
  a.add(flag, mission);
  // anggota badan: grup berporos (sarung tangan & sepatu ikut bergerak)
  const limb = (r: number, len: number, end: THREE.Mesh, jointY: number) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 12), suit);
    m.position.y = -0.1;
    const joint = new THREE.Mesh(new THREE.TorusGeometry(r * 1.02, r * 0.18, 6, 16), grey);
    joint.rotation.x = Math.PI / 2;
    joint.position.y = jointY;
    end.position.y = -0.1 - len / 2 - r * 0.9;
    g.add(m, joint, end);
    return g;
  };
  const gloveMesh = () => new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), glove);
  const bootMesh = () => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.13), grey);
    b.geometry.translate(0, 0, 0.02);
    return b;
  };
  const armL = limb(0.045, 0.16, gloveMesh(), -0.1);
  const armR = limb(0.045, 0.16, gloveMesh(), -0.1);
  armL.position.set(-0.18, 0.53, 0);
  armR.position.set(0.18, 0.53, 0);
  const legL = limb(0.056, 0.14, bootMesh(), -0.1);
  const legR = limb(0.056, 0.14, bootMesh(), -0.1);
  legL.position.set(-0.07, 0.27, 0);
  legR.position.set(0.07, 0.27, 0);
  a.add(torso, armL, armR, legL, legR);
  a.scale.setScalar(0.85);
  tag(a, "astronot");
  return { astro: a, armL, armR, legL, legR, helmet, visor };
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
        gl_FragColor = vec4(col, bands * fade * uAlpha * 0.45); }`,
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
  private glow: THREE.Mesh;
  private ozone: THREE.Mesh;
  private pad: THREE.Group;
  private flags: THREE.ShaderMaterial[] = [];
  private birds: ReturnType<typeof buildBirds>;
  private sats: THREE.Group;
  private moon: THREE.Mesh;
  private sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  private hemi = new THREE.HemisphereLight(0xbfdcff, 0x3a5a2a, 0.9);
  private amb = new THREE.AmbientLight(0x8899bb, 0.15);
  r: ReturnType<typeof buildRocket>;
  private t: ReturnType<typeof buildTower>;
  a: ReturnType<typeof buildAstronaut>;
  private tether: THREE.Line;
  private clouds: THREE.Group;
  private planes: THREE.Group;
  private iss: THREE.Group;
  private aur: ReturnType<typeof aurora>;
  /** col = alfa per partikel, size = ukuran dunia per partikel */
  private smoke: { pts: THREE.Points; pos: Float32Array; col: Float32Array; vel: Float32Array; age: Float32Array; life: Float32Array; size: Float32Array; big: Float32Array };
  private meteors: { line: THREE.Line; vel: THREE.Vector3; age: number; life: number }[] = [];
  private meteorWait = 0;
  private time = 0;
  private rand = rng(99);
  private dotTex = softDot();
  private tmp = new THREE.Vector3();
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
    this.earthClouds = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R + 1.2, 96, 64),
      new THREE.MeshStandardMaterial({ alphaMap: cl, color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false }),
    );
    earthGroup.add(this.earth, this.earthClouds);
    const lon = 136,
      lat = -1;
    const phi = ((lon + 180) / 360) * TAU;
    const theta = ((90 - lat) / 180) * Math.PI;
    const dir = new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta)).normalize();
    earthGroup.quaternion.setFromUnitVectors(dir, new THREE.Vector3(0, 1, 0));
    earthGroup.position.copy(this.earthCenter);
    s.add(earthGroup);
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
      sat.position.set(Math.cos(a) * (9 + i * 3), altToY(400) + 30 + i * 11, Math.sin(a) * (9 + i * 3));
      sat.scale.setScalar(2.6);
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
    s.add(this.a.astro);
    this.tether = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xffffff }));
    this.tether.visible = false;
    this.tether.frustumCulled = false;
    s.add(this.tether);

    // Awan troposfer
    this.clouds = new THREE.Group();
    const cloudMat = new THREE.SpriteMaterial({ map: this.dotTex, color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false });
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
    s.add(this.clouds);

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

    this.sun.position.set(300, 500, 200);
    s.add(this.sun, this.hemi, this.amb);
    this.scene.fog = new THREE.FogExp2(0xcfe7ff, 0.004);
  }

  /** Terapkan pose roket & astronaut (fungsi murni dari timeline). */
  applyPose(p: RocketPose) {
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
    this.iss.visible = p.issGap !== null;
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

  private walkPose(phase: number) {
    const s = Math.sin(phase * 1.6) * 0.5;
    this.a.legL.rotation.x = s;
    this.a.legR.rotation.x = -s;
    this.a.armL.rotation.x = -s * 0.7;
    this.a.armR.rotation.x = s * 0.7;
    this.a.armL.rotation.z = 0;
    this.a.armR.rotation.z = 0;
  }

  /** Lingkungan menurut ketinggian KAMERA (langit, kabut, bintang, aurora, dll.) + partikel. */
  update(dt: number) {
    this.time += dt;
    const cam = this.camera;
    const camAlt = yToAlt(cam.position.y);
    this.sky.position.copy(cam.position);
    this.stars.position.copy(cam.position);
    const up = this.tmp.copy(cam.position).sub(this.earthCenter).normalize();
    const u = this.skyMat.uniforms;
    u.uUp.value.copy(up);
    ramp(ZENITH, camAlt, u.uZenith.value);
    ramp(HORIZON, camAlt, u.uHorizon.value);
    u.uSpace.value = smooth(60, 120, camAlt);
    this.starMat.opacity = smooth(20, 90, camAlt);
    const fog = this.scene.fog as THREE.FogExp2;
    fog.color.copy(u.uHorizon.value);
    fog.density = 0.012 * (1 - smooth(0, 25, camAlt));
    this.hemi.intensity = 0.9 * (1 - smooth(20, 90, camAlt)) + 0.1;
    (this.glow.material as THREE.ShaderMaterial).uniforms.uAlpha.value = smooth(25, 120, camAlt);
    (this.ozone.material as THREE.MeshBasicMaterial).opacity = 0.06 * smooth(8, 20, camAlt) * (1 - smooth(60, 200, camAlt)) + 0.05 * smooth(200, 600, camAlt);
    this.pad.visible = camAlt < 80;
    this.clouds.visible = camAlt < 120;
    this.aur.mat.uniforms.uTime.value = this.time;
    this.aur.mat.uniforms.uAlpha.value = smooth(70, 130, camAlt) * (1 - smooth(500, 1200, camAlt));
    this.aur.group.visible = camAlt > 60;
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

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) {
        (mat as THREE.MeshStandardMaterial).map?.dispose();
        (mat as THREE.MeshStandardMaterial).alphaMap?.dispose();
        mat.dispose();
      }
    });
    this.dotTex.dispose();
  }
}
