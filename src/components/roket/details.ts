// Detail dunia modul Roket: kompleks peluncuran (pohon, kelapa, pantai & laut, bukit, gedung perakitan,
// gedung kontrol, menara air, tangki, tiang petir, pagar, jalan, mobil, bendera), tekstur roket, burung,
// satelit, dan Bulan (Stasiun Luar Angkasa ada di station.ts). Semua prosedural (tanpa berkas model).

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { worldY, groundY, rng, EARTH_R } from "./terrain-math";
import { weathered } from "./surface-materials";
import { assemblyDetails, controlDetails, tankDetails } from "./facility";
export { groundY, rng, EARTH_R };
export const TAU = Math.PI * 2;

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const std = (color: number, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

/* ---------------- tanah kompleks peluncuran ---------------- */


function groundTexture() {
  return canvasTex(4096, 4096, (g, w, h) => {
    const r = rng(4);
    const S = w / 60; // piksel per unit (piringan radius 30)
    const X = (x: number) => w / 2 + x * S;
    const Z = (z: number) => h / 2 + z * S;
    // latar transparan: rumput, pantai & laut kini berupa medan & air sungguhan (site.ts)
    g.clearRect(0, 0, w, h);
    // jalan aspal
    g.lineCap = "round";
    g.strokeStyle = "rgba(160,150,125,0.9)";
    g.lineWidth = 1.9 * S;
    g.beginPath();
    g.moveTo(X(0), Z(3));
    g.lineTo(X(0), Z(9));
    g.lineTo(X(-10), Z(9));
    g.lineTo(X(-10), Z(30));
    g.moveTo(X(-10), Z(9));
    g.lineTo(X(-22), Z(9));
    g.stroke();
    g.strokeStyle = "#55585f";
    g.lineWidth = 1.4 * S;
    g.beginPath();
    g.moveTo(X(0), Z(3));
    g.lineTo(X(0), Z(9));
    g.lineTo(X(-10), Z(9));
    g.lineTo(X(-10), Z(30));
    g.moveTo(X(-10), Z(9));
    g.lineTo(X(-22), Z(9));
    g.stroke();
    g.strokeStyle = "#f5f1e6";
    g.lineWidth = 0.08 * S;
    g.setLineDash([0.6 * S, 0.6 * S]);
    g.stroke();
    g.setLineDash([]);
    // landasan beton segi delapan + marka
    g.fillStyle = "#c9c6bd";
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + TAU / 16;
      g.lineTo(X(Math.cos(a) * 5.2), Z(Math.sin(a) * 5.2));
    }
    g.closePath();
    g.fill();
    g.save();
    g.clip();
    // pelat beton, noda & bekas bakaran di sekitar parit api
    g.strokeStyle = "rgba(90,88,82,0.35)";
    g.lineWidth = 2;
    for (let k = -5; k <= 5; k++) {
      g.beginPath();
      g.moveTo(X(k), Z(-5.3));
      g.lineTo(X(k), Z(5.3));
      g.moveTo(X(-5.3), Z(k));
      g.lineTo(X(5.3), Z(k));
      g.stroke();
    }
    for (let i = 0; i < 5000; i++) {
      const l = 140 + r() * 70;
      g.fillStyle = `rgba(${l},${l},${l - 6},0.3)`;
      g.fillRect(X((r() - 0.5) * 10.4), Z((r() - 0.5) * 10.4), 1 + r() * 3, 1 + r() * 3);
    }
    for (let i = 0; i < 40; i++) {
      const q = g.createRadialGradient(X((r() - 0.5) * 8), Z((r() - 0.5) * 8), 0, X(0), Z(0), (0.6 + r() * 1.6) * S);
      q.addColorStop(0, "rgba(70,68,64,0.18)");
      q.addColorStop(1, "rgba(70,68,64,0)");
      g.fillStyle = q;
      g.fillRect(0, 0, w, h);
    }
    const burn = g.createRadialGradient(X(0), Z(0), 0.3 * S, X(0), Z(0), 4.2 * S);
    burn.addColorStop(0, "rgba(30,28,26,0.55)");
    burn.addColorStop(1, "rgba(30,28,26,0)");
    g.fillStyle = burn;
    g.beginPath();
    g.ellipse(X(0), Z(0), 5 * S, 2.2 * S, 0, 0, TAU);
    g.fill();
    g.restore();
    // bahu jalan & tepi landasan berkerikil
    g.strokeStyle = "rgba(150,140,120,0.8)";
    g.lineWidth = 0.18 * S;
    g.beginPath();
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * TAU + TAU / 16;
      g.lineTo(X(Math.cos(a) * 5.3), Z(Math.sin(a) * 5.3));
    }
    g.stroke();
    g.strokeStyle = "#f2c230";
    g.lineWidth = 0.1 * S;
    g.beginPath();
    g.arc(X(0), Z(0), 1.2 * S, 0, TAU);
    g.stroke();
    // parit api (hitam, gosong)
    const tr = g.createLinearGradient(X(-4.5), 0, X(4.5), 0);
    tr.addColorStop(0, "#3b3b3f");
    tr.addColorStop(0.5, "#1c1c20");
    tr.addColorStop(1, "#3b3b3f");
    g.fillStyle = tr;
    g.fillRect(X(-4.5), Z(-0.45), 9 * S, 0.9 * S);
    // parkir
    g.fillStyle = "#6b6e76";
    g.fillRect(X(-14), Z(11), 6 * S, 3 * S);
    g.strokeStyle = "#ffffff";
    g.lineWidth = 0.06 * S;
    for (let i = 0; i <= 6; i++) {
      g.beginPath();
      g.moveTo(X(-14 + i), Z(11));
      g.lineTo(X(-14 + i), Z(12.2));
      g.stroke();
    }
  });
}

function buildGround() {
  // stiker jalan & landasan yang menempel mengikuti permukaan medan
  const geo = new THREE.RingGeometry(0.001, 30, 128, 48);
  geo.rotateX(-Math.PI / 2);
  const p = geo.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setY(i, 0.03 + worldY(p.getX(i), p.getZ(i)));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: groundTexture(), roughness: 0.9, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.receiveShadow = true;
  m.renderOrder = 1;
  return m;
}

/* ---------------- pepohonan ---------------- */

/* ---------------- bangunan ---------------- */

/** Menara kisi baja segi empat meruncing (kaki, palang datar, palang silang). */
export function lattice(w0: number, w1: number, h: number, m: THREE.Material, step = 0.5) {
  const parts: THREE.BufferGeometry[] = [];
  const W = (y: number) => w0 + (w1 - w0) * (y / h);
  const up = new THREE.Vector3(0, 1, 0);
  const beam = (a: THREE.Vector3, b: THREE.Vector3, r: number) => {
    const len = a.distanceTo(b);
    const geo = new THREE.CylinderGeometry(r, r, len, 4);
    const q = new THREE.Quaternion().setFromUnitVectors(up, b.clone().sub(a).normalize());
    geo.applyMatrix4(new THREE.Matrix4().compose(a.clone().lerp(b, 0.5), q, new THREE.Vector3(1, 1, 1)));
    parts.push(geo);
  };
  const corner = (y: number, i: number) => {
    const w = W(y) / 2;
    const c = [
      [-w, -w],
      [w, -w],
      [w, w],
      [-w, w],
    ][i];
    return new THREE.Vector3(c[0], y, c[1]);
  };
  for (let i = 0; i < 4; i++) beam(corner(0, i), corner(h, i), 0.022);
  for (let y = 0; y < h - 1e-3; y += step) {
    const y1 = Math.min(h, y + step);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      beam(corner(y1, i), corner(y1, j), 0.01);
      beam(corner(y, i), corner(y1, j), 0.008);
    }
  }
  const g = new THREE.Group();
  g.add(new THREE.Mesh(mergeGeometries(parts, false)!, m));
  parts.forEach((x) => x.dispose());
  return g;
}

function stripesTex(label: string) {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#eef0f2";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#d6dae0";
    for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 3, h);
    // bendera Merah Putih
    // bendera Merah Putih raksasa di dinding gedung
    g.fillStyle = "#e0262b";
    g.fillRect(30, 30, 240, 80);
    g.fillStyle = "#ffffff";
    g.fillRect(30, 110, 240, 80);
    g.strokeStyle = "#b9bec6";
    g.lineWidth = 3;
    g.strokeRect(30, 30, 240, 160);
    g.fillStyle = "#2b3a67";
    g.font = "bold 56px system-ui, sans-serif";
    g.fillText(label, 36, 262);
    // pintu raksasa
    g.fillStyle = "#b7bcc5";
    g.fillRect(300, 180, 160, 332);
    g.strokeStyle = "#9aa0aa";
    for (let y = 190; y < 512; y += 24) {
      g.beginPath();
      g.moveTo(300, y);
      g.lineTo(460, y);
      g.stroke();
    }
  });
}

function windowsTex() {
  return canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = "#e7e2d8";
    g.fillRect(0, 0, w, h);
    for (let y = 16; y < h - 10; y += 34)
      for (let x = 12; x < w - 10; x += 28) {
        g.fillStyle = "#6fa8dc";
        g.fillRect(x, y, 18, 20);
        g.fillStyle = "rgba(255,255,255,0.45)";
        g.fillRect(x, y, 6, 20);
      }
  });
}

/** Bendera Merah Putih berkibar (kain ber-shader) di tiang. */
export function flag(w = 0.8, poleH = 2.4) {
  const tex = canvasTex(64, 40, (c) => {
    c.fillStyle = "#e0262b";
    c.fillRect(0, 0, 64, 20);
    c.fillStyle = "#ffffff";
    c.fillRect(0, 20, 64, 20);
  });
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(w, w * 0.62, 12, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, map: { value: tex } },
    vertexShader: `uniform float uTime; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; float k = uv.x; p.z += sin(uTime * 3.0 + uv.x * 6.0) * 0.075 * k * ${w.toFixed(2)}; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
    fragmentShader: `uniform sampler2D map; varying vec2 vUv; void main(){ gl_FragColor = texture2D(map, vUv); }`,
    side: THREE.DoubleSide,
  });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * (poleH / 2.4), 0.03 * (poleH / 2.4), poleH, 8), std(0xdfe3e8, 0.4, 0.6));
  pole.position.y = poleH / 2;
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.04 * (poleH / 2.4), 8, 6), std(0xd4af37, 0.3, 0.8));
  top.position.y = poleH + 0.03;
  const cloth = new THREE.Mesh(geo, mat);
  cloth.position.set(w / 2, poleH - (w * 0.62) / 2 - 0.05, 0);
  g.add(top);
  g.add(pole, cloth);
  return { group: g, mat };
}

export function buildSite(low: boolean) {
  const g = new THREE.Group();
  g.add(buildGround());
  void low;
  const place = (o: THREE.Object3D, x: number, z: number, ry = 0) => {
    o.position.set(x, worldY(x, z), z);
    o.traverse((c) => ((c as THREE.Mesh).isMesh ? ((c.castShadow = true), (c.receiveShadow = true)) : null));
    o.rotation.y = ry;
    g.add(o);
    return o;
  };
  // Gedung perakitan roket (besar, bergaris, berbendera)
  const vab = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 3.4), [
    std(0xeef0f2),
    std(0xeef0f2),
    std(0x9aa0aa),
    std(0xeef0f2),
    new THREE.MeshStandardMaterial({ map: stripesTex("RINOYA"), roughness: 0.7 }),
    std(0xeef0f2),
  ]);
  vab.position.y = 2.5;
  const vabG = new THREE.Group();
  vabG.add(vab, assemblyDetails());
  place(vabG, -18, 5, 0.3);
  // Gedung kontrol berjendela
  const ctrl = new THREE.Mesh(new THREE.BoxGeometry(3, 1.3, 1.8), new THREE.MeshStandardMaterial({ map: windowsTex(), roughness: 0.7 }));
  ctrl.position.y = 0.65;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 1.9), std(0x8b93a0));
  roof.position.y = 1.35;
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 10, 0, TAU, 0, Math.PI / 2.6), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.4, side: THREE.DoubleSide }));
  dish.rotation.x = Math.PI * 0.75;
  dish.position.set(0.9, 1.9, 0);
  const dishPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55), std(0xcccccc));
  dishPole.position.set(0.9, 1.6, 0);
  const ctrlG = new THREE.Group();
  ctrlG.add(ctrl, roof, dish, dishPole, controlDetails());
  place(ctrlG, -7, 12, 0.1);
  // Menara air
  const wt = new THREE.Group();
  const tank = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 14), std(0xe8eef4, 0.5, 0.2));
  tank.position.y = 3.6;
  wt.add(tank, tankDetails(0.7, 3.6, 4));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.3), std(0x9aa3ae));
    leg.position.set(Math.cos(a) * 0.45, 1.65, Math.sin(a) * 0.45);
    wt.add(leg);
  }
  place(wt, 7, -13);
  // Tangki bahan bakar (bola putih) & pipa
  for (const [x, z] of [
    [4, -10],
    [5.6, -11],
  ]) {
    const t = new THREE.Group();
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 16), std(0xf6f7f9, 0.45, 0.15));
    ball.position.y = 1.4;
    t.add(ball, tankDetails(0.9, 1.4, 6));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), std(0x9aa3ae));
      leg.position.set(Math.cos(a) * 0.75, 0.5, Math.sin(a) * 0.75);
      t.add(leg);
    }
    place(t, x, z);
  }
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7), std(0xb8bec8, 0.5, 0.4));
  pipe.rotation.z = Math.PI / 2;
  pipe.rotation.y = 1.2;
  pipe.position.set(2.2, 0.12, -6.5);
  g.add(pipe);
  // Tiga menara penangkal petir berkisi dengan kabel melengkung di antaranya (seperti landasan sungguhan)
  const steel = weathered(0x8d949c, "metal");
  const tops: THREE.Vector3[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU + 0.5;
    const mx = Math.cos(a) * 7.6,
      mz = Math.sin(a) * 7.6;
    const mast = lattice(0.34, 0.12, 8.5, steel);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.03, 1.4, 6), steel);
    tip.position.y = 9.2;
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3b2f }));
    light.position.y = 8.6;
    const footing = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.65), weathered("#a5a397"));
    footing.position.y = 0.015;
    mast.add(tip, light, footing);
    place(mast, mx, mz);
    tops.push(new THREE.Vector3(mx, worldY(mx, mz) + 9.9, mz));
  }
  const wirePts: THREE.Vector3[] = [];
  const sag = (a: THREE.Vector3, b: THREE.Vector3, depth: number) => {
    for (let k = 0; k < 24; k++) {
      const t0 = k / 24,
        t1 = (k + 1) / 24;
      for (const t of [t0, t1]) wirePts.push(a.clone().lerp(b, t).add(new THREE.Vector3(0, -Math.sin(t * Math.PI) * depth, 0)));
    }
  };
  for (let i = 0; i < 3; i++) sag(tops[i], tops[(i + 1) % 3], 2.2);
  for (const t of tops) {
    const out = t.clone().setY(0).multiplyScalar(1.9);
    sag(t, new THREE.Vector3(out.x, worldY(out.x, out.z), out.z), 0.8);
  }
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(wirePts), new THREE.LineBasicMaterial({ color: 0x3a3d42, transparent: true, opacity: 0.8 })));
  // Pagar kawat berduri (tiang + jaring kawat tembus pandang)
  const fenceR = 9.5;
  const fenceGeo = new THREE.CylinderGeometry(fenceR, fenceR, 0.22, 160, 1, true);
  const fp = fenceGeo.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < fp.count; i++) fp.setY(i, fp.getY(i) + 0.11 + worldY(fp.getX(i), fp.getZ(i)));
  const mesh = canvasTex(64, 64, (c) => {
    c.clearRect(0, 0, 64, 64);
    c.strokeStyle = "rgba(170,178,186,0.9)";
    c.lineWidth = 2;
    for (let k = -64; k < 128; k += 16) {
      c.beginPath();
      c.moveTo(k, 0);
      c.lineTo(k + 64, 64);
      c.moveTo(k + 64, 0);
      c.lineTo(k, 64);
      c.stroke();
    }
    c.fillStyle = "rgba(150,156,164,1)";
    c.fillRect(0, 0, 64, 4);
  });
  mesh.wrapS = mesh.wrapT = THREE.RepeatWrapping;
  mesh.repeat.set(160, 1);
  g.add(new THREE.Mesh(fenceGeo, new THREE.MeshStandardMaterial({ map: mesh, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 })));
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * TAU;
    const x = Math.cos(a) * fenceR,
      z = Math.sin(a) * fenceR;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26), steel);
    post.position.set(x, 0.13 + worldY(x, z), z);
    g.add(post);
  }
  // Mobil & bus kecil di jalan/parkir
  const carColors = [0xff5a4e, 0x2f86ff, 0xffbe0b, 0x3ddc84, 0xffffff];
  const r = rng(33);
  for (let i = 0; i < 6; i++) {
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.26), std(carColors[i % 5], 0.4, 0.3));
    body.position.y = 0.14;
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.24), std(0x9fd0f5, 0.2, 0.5));
    cab.position.set(-0.03, 0.29, 0);
    car.add(body, cab);
    for (const x of [-0.16, 0.16]) for (const z of [-0.14, 0.14]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.034, 12), std(0x222529));
      wheel.rotation.x = Math.PI / 2; wheel.position.set(x, 0.09, z); car.add(wheel);
    }
    for (const z of [-0.085, 0.085]) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.035, 0.045), std(0xe1dbb7, 0.2));
      lamp.position.set(0.253, 0.16, z); car.add(lamp);
    }
    place(car, -13.5 + i * 0.95 + r() * 0.1, 11.6, Math.PI / 2);
  }
  // Bendera Merah Putih di depan gedung kontrol & landasan
  const flags: THREE.ShaderMaterial[] = [];
  for (const [x, z] of [
    [-5, 10.6],
    [-3.2, 4.6],
  ]) {
    const f = flag();
    place(f.group, x, z, 0.5);
    flags.push(f.mat);
  }
  // deretan bendera di sepanjang jalan masuk
  for (let z = 11; z <= 27; z += 2.6) {
    const f = flag(0.55, 1.8);
    place(f.group, -8.9, z, Math.PI / 2);
    flags.push(f.mat);
  }
  // tiang bendera tinggi di dekat landasan
  const big = flag(2.2, 7);
  place(big.group, -5.5, -4.5, 0.4);
  flags.push(big.mat);
  return { group: g, flags };
}

/* ---------------- roket: tekstur & perlengkapan ---------------- */

export function rocketBodyTex(stage: 1 | 2) {
  return canvasTex(1024, 2048, (g, w, h) => {
    g.fillStyle = "#f4f6fa";
    g.fillRect(0, 0, w, h);
    // garis panel
    g.strokeStyle = "rgba(120,130,150,0.35)";
    g.lineWidth = 2;
    for (let y = 0; y < h; y += 96) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    for (let x = 0; x < w; x += 128) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.stroke();
    }
    // paku keling
    g.fillStyle = "rgba(120,130,150,0.4)";
    for (let y = 8; y < h; y += 96) for (let x = 4; x < w; x += 16) g.fillRect(x, y, 3, 3);
    if (stage === 1) {
      // tulisan RINOYA vertikal + bendera
      g.save();
      g.translate(w * 0.25, h * 0.2);
      g.rotate(Math.PI / 2);
      g.fillStyle = "#1f2a4a";
      g.font = "bold 92px system-ui, sans-serif";
      g.fillText("RINOYA", 0, 0);
      g.restore();
      // bendera Merah Putih besar di dua sisi roket
      for (const fx of [w * 0.52, w * 0.02]) {
        g.fillStyle = "#e0262b";
        g.fillRect(fx, h * 0.34, 150, 50);
        g.fillStyle = "#ffffff";
        g.fillRect(fx, h * 0.34 + 50, 150, 50);
        g.strokeStyle = "#aab";
        g.lineWidth = 2;
        g.strokeRect(fx, h * 0.34, 150, 100);
      }
      g.fillStyle = "#1f2a4a";
      g.font = "bold 40px system-ui, sans-serif";
      g.fillText("INDONESIA", w * 0.52, h * 0.34 + 140);
      // bunga es di bagian bawah (tangki oksigen cair sangat dingin)
      const frost = g.createLinearGradient(0, h * 0.55, 0, h);
      frost.addColorStop(0, "rgba(255,255,255,0)");
      frost.addColorStop(1, "rgba(225,238,250,0.9)");
      g.fillStyle = frost;
      g.fillRect(0, h * 0.55, w, h * 0.45);
    } else {
      g.fillStyle = "#ff7a1a";
      g.fillRect(0, h * 0.1, w, 26);
      g.fillStyle = "#1f2a4a";
      g.font = "bold 60px system-ui, sans-serif";
      g.fillText("MISI 01", w * 0.1, h * 0.5);
      g.fillStyle = "#e0262b";
      g.fillRect(w * 0.6, h * 0.36, 120, 40);
      g.fillStyle = "#ffffff";
      g.fillRect(w * 0.6, h * 0.36 + 40, 120, 40);
      g.strokeStyle = "#aab";
      g.strokeRect(w * 0.6, h * 0.36, 120, 80);
    }
  });
}

/** Sirip kisi (grid fin) di puncak tahap pertama. */
export function gridFin() {
  const g = new THREE.Group();
  const m = std(0x3a3f4a, 0.5, 0.6);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.02), m);
  g.add(frame);
  for (let i = -2; i <= 2; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.16, 0.05), m);
    v.position.x = i * 0.045;
    g.add(v);
  }
  return g;
}

/** Kaki pendarat terlipat di dasar tahap pertama. */
export function landingLeg() {
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.08), std(0x2a2f3a, 0.6, 0.4));
  leg.position.y = 0.6;
  const g = new THREE.Group();
  g.add(leg);
  return g;
}

/** Nosel mesin logam (gradasi gelap-panas). */
export function nozzleMaterial() {
  return new THREE.MeshStandardMaterial({
    map: canvasTex(16, 64, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "#8a5a3a");
      gr.addColorStop(0.4, "#4a4e58");
      gr.addColorStop(1, "#23262d");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }),
    roughness: 0.35,
    metalness: 0.8,
    side: THREE.DoubleSide,
  });
}

/* ---------------- langit & angkasa ---------------- */

export function buildBirds(n: number) {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0x2b2b35, side: THREE.DoubleSide });
  const r = rng(71);
  const birds: { l: THREE.Mesh; rr: THREE.Mesh; o: THREE.Group; ph: number }[] = [];
  for (let i = 0; i < n; i++) {
    const o = new THREE.Group();
    const wing = new THREE.BufferGeometry();
    wing.setAttribute("position", new THREE.Float32BufferAttribute([0,0,0, 0.09,0.015,-0.025, 0.24,0,0.018, 0.08,-0.01,0.07], 3));
    wing.setIndex([0,1,2,0,2,3]); wing.computeVertexNormals();
    const l = new THREE.Mesh(wing, mat);
    const rr = new THREE.Mesh(wing, mat);
    rr.rotation.y = Math.PI;
    o.add(l, rr);
    o.position.set((r() - 0.5) * 6, (r() - 0.5) * 1.5, (r() - 0.5) * 4);
    g.add(o);
    birds.push({ l, rr, o, ph: r() * TAU });
  }
  return {
    group: g,
    update(t: number) {
      for (const b of birds) {
        const f = Math.sin(t * 8 + b.ph) * 0.6;
        b.l.rotation.z = f;
        b.rr.rotation.z = -f;
      }
      g.position.set(Math.sin(t * 0.025) * 48, g.position.y + Math.sin(t * .1) * .0005, -24 + Math.cos(t * .025) * 12);
    },
  };
}

export { createSatellite as buildSatellite } from './satellite';

export function buildMoon() {
  const tex = new THREE.TextureLoader().load("/angkasa/tex/2k_moon.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;
  const moon = new THREE.Mesh(new THREE.SphereGeometry(120, 48, 32), new THREE.MeshStandardMaterial({ map: tex, roughness: 1, fog: false }));
  moon.position.set(-2600, 1400, -3400);
  return moon;
}
