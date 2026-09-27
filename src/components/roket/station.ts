// Stasiun Luar Angkasa Internasional (prosedural, mengikuti bentuk aslinya; 1 unit ≈ 12 m).
// Sumbu: x = rangka utama (kiri–kanan), +z = arah terbang (depan), −y = menghadap Bumi.
// Bagian: rangka utama bertekstur + sendi putar, 8 sayap panel surya (tiap sayap dua lembar dengan tiang di
// tengah), radiator besar & radiator kecil, modul bertekanan (Destiny, Harmony, Columbus, Kibo + modul atas +
// teras luar, Unity, Tranquility + Kupola, airlock Quest, Zarya, Zvezda bersayap), lengan robot Canadarm2,
// dan pesawat Soyuz yang menempel. Tanpa logo lembaga antariksa. Jaring digabung per bahan agar ringan.

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { canvasTex, rng } from "./details";

/* ---------------- tekstur ---------------- */

function line(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
}
function curve(g: CanvasRenderingContext2D, [x, y]: number[], c: number[]) {
  g.beginPath();
  g.moveTo(x, y);
  g.bezierCurveTo(c[0], c[1], c[2], c[3], c[4], c[5]);
  g.stroke();
}

function arrayTex() {
  // sel surya tembaga-jingga, garis sel gelap, kilap lembut
  return canvasTex(256, 1024, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0);
    grd.addColorStop(0, "#b8561f");
    grd.addColorStop(0.5, "#d9743a");
    grd.addColorStop(1, "#a94d1b");
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    const r = rng(11);
    for (let y = 0; y < h; y += 16)
      for (let x = 0; x < w; x += 32) {
        g.fillStyle = `rgba(${120 + r() * 60},${50 + r() * 30},${20 + r() * 15},${0.25 + r() * 0.2})`;
        g.fillRect(x + 1, y + 1, 30, 14);
      }
    g.strokeStyle = "rgba(40,18,8,0.55)";
    g.lineWidth = 1.2;
    for (let y = 0; y <= h; y += 16) line(g, 0, y, w, y);
    for (let x = 0; x <= w; x += 32) line(g, x, 0, x, h);
    g.fillStyle = "rgba(255,255,255,0.08)";
    g.fillRect(w * 0.15, 0, w * 0.18, h);
  });
}

function hullTex(seed: number, base: string, seam: string) {
  // kulit modul berpanel: sambungan, panel terang/gelap, paku keling
  return canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    const r = rng(seed);
    for (let x = 0; x < w; x += 64)
      for (let y = 0; y < h; y += 42) {
        const k = r();
        g.fillStyle = k < 0.3 ? "rgba(255,255,255,0.18)" : k < 0.5 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.04)";
        g.fillRect(x + 2, y + 2, 60, 38);
      }
    g.strokeStyle = seam;
    g.lineWidth = 2;
    for (let x = 0; x <= w; x += 64) line(g, x, 0, x, h);
    for (let y = 0; y <= h; y += 42) line(g, 0, y, w, y);
    g.fillStyle = "rgba(60,64,70,0.5)";
    for (let i = 0; i < 160; i++) g.fillRect(r() * w, r() * h, 2, 2);
    // pegangan kuning untuk berjalan di luar
    g.fillStyle = "#d9b43a";
    for (let i = 0; i < 10; i++) g.fillRect(r() * w, r() * h, 14, 3);
  });
}

function mliTex() {
  // selimut termal putih berjahit (modul Rusia & simpul)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#ece8de";
    g.fillRect(0, 0, w, h);
    const r = rng(5);
    for (let i = 0; i < 400; i++) {
      g.fillStyle = `rgba(0,0,0,${r() * 0.05})`;
      g.fillRect(r() * w, r() * h, 6, 6);
    }
    g.strokeStyle = "rgba(150,140,120,0.35)";
    g.lineWidth = 1;
    for (let d = -h; d < w; d += 24) line(g, d, 0, d + h, h);
    for (let d = 0; d < w + h; d += 24) line(g, d, 0, d - h, h);
  });
}

function trussTex() {
  // rangka: kotak-kotak perangkat (ORU), panel perak, kabel
  return canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = "#c9cdd2";
    g.fillRect(0, 0, w, h);
    const r = rng(8);
    for (let i = 0; i < 70; i++) {
      const bw = 16 + r() * 50,
        bh = 12 + r() * 40;
      const v = 150 + Math.floor(r() * 90);
      g.fillStyle = `rgb(${v},${v + 3},${v + 8})`;
      g.fillRect(r() * w, r() * h, bw, bh);
    }
    g.strokeStyle = "rgba(60,64,70,0.6)";
    g.lineWidth = 2;
    for (let x = 0; x <= w; x += 64) line(g, x, 0, x, h);
    g.strokeStyle = "rgba(40,40,40,0.35)";
    for (let i = 0; i < 6; i++) curve(g, [0, r() * h], [w * 0.3, r() * h, w * 0.6, r() * h, w, r() * h]);
  });
}

function radiatorTex() {
  return canvasTex(128, 512, (g, w, h) => {
    g.fillStyle = "#f4f5f7";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(120,130,140,0.35)";
    g.lineWidth = 1;
    for (let y = 0; y < h; y += 10) line(g, 0, y, w, y);
    g.strokeStyle = "rgba(90,100,110,0.6)";
    g.lineWidth = 3;
    for (const y of [h / 3, (2 * h) / 3]) line(g, 0, y, w, y);
  });
}

/* ---------------- perakit: kumpulkan bentuk per bahan, lalu gabung ---------------- */

class Kit {
  private parts = new Map<THREE.Material, THREE.BufferGeometry[]>();
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  add(geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0]) {
    this.m.compose(new THREE.Vector3(...pos), this.q.setFromEuler(this.e.set(...rot)), new THREE.Vector3(1, 1, 1));
    geo.applyMatrix4(this.m);
    const list = this.parts.get(mat) ?? [];
    list.push(geo);
    this.parts.set(mat, list);
  }
  box(w: number, h: number, d: number, mat: THREE.Material, pos: [number, number, number], rot?: [number, number, number]) {
    this.add(new THREE.BoxGeometry(w, h, d), mat, pos, rot);
  }
  /** tabung dengan sumbu x / y / z */
  tube(r: number, len: number, axis: "x" | "y" | "z", mat: THREE.Material, pos: [number, number, number], seg = 24, r2 = r) {
    const rot: [number, number, number] = axis === "x" ? [0, 0, Math.PI / 2] : axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
    this.add(new THREE.CylinderGeometry(r2, r, len, seg), mat, pos, rot);
  }
  /** batang tipis dari a ke b */
  rod(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
    const len = a.distanceTo(b);
    const geo = new THREE.CylinderGeometry(r, r, len, 6);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    this.m.compose(mid, q, new THREE.Vector3(1, 1, 1));
    geo.applyMatrix4(this.m);
    const list = this.parts.get(mat) ?? [];
    list.push(geo);
    this.parts.set(mat, list);
  }
  build() {
    const g = new THREE.Group();
    for (const [mat, list] of this.parts) {
      const merged = mergeGeometries(list, false);
      if (merged) g.add(new THREE.Mesh(merged, mat));
      list.forEach((x) => x.dispose());
    }
    return g;
  }
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/* ---------------- stasiun ---------------- */

export function buildStation() {
  const k = new Kit();
  const tArr = arrayTex();
  tArr.wrapS = tArr.wrapT = THREE.RepeatWrapping;
  const tHull = hullTex(3, "#cdd1d6", "rgba(110,116,124,0.7)");
  const tHullJ = hullTex(9, "#d6d9dd", "rgba(120,126,134,0.7)");
  const tMli = mliTex();
  const tTruss = trussTex();
  const tRad = radiatorTex();

  const solar = new THREE.MeshStandardMaterial({ map: tArr, roughness: 0.32, metalness: 0.55, emissive: 0x2a1004, side: THREE.DoubleSide });
  const hull = new THREE.MeshStandardMaterial({ map: tHull, roughness: 0.45, metalness: 0.55 });
  const hullJ = new THREE.MeshStandardMaterial({ map: tHullJ, roughness: 0.45, metalness: 0.55 });
  const mli = new THREE.MeshStandardMaterial({ map: tMli, roughness: 0.85 });
  const truss = new THREE.MeshStandardMaterial({ map: tTruss, roughness: 0.55, metalness: 0.5 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xc7ccd2, roughness: 0.35, metalness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x3a3f47, roughness: 0.5, metalness: 0.4 });
  const rad = new THREE.MeshStandardMaterial({ map: tRad, roughness: 0.7, metalness: 0.1, side: THREE.DoubleSide });
  const white = new THREE.MeshStandardMaterial({ color: 0xf1f1ee, roughness: 0.6 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd4a441, roughness: 0.3, metalness: 0.9 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x0d1b2a, roughness: 0.05, metalness: 0.9, emissive: 0x08131f });
  const soyuzGreen = new THREE.MeshStandardMaterial({ color: 0x6f7d5a, roughness: 0.8 });
  const russianWing = new THREE.MeshStandardMaterial({ color: 0x1d2a4a, roughness: 0.3, metalness: 0.6, emissive: 0x050a18, side: THREE.DoubleSide });

  /* rangka utama (Integrated Truss): segmen kotak bertekstur + bagian kisi terbuka + sendi putar */
  const T = 0.34; // tebal rangka
  k.box(5.2, T, T, truss, [0, 0, 0]); // S0–S1–P1
  for (const s of [-1, 1]) {
    k.tube(0.2, 0.16, "x", metal, [s * 2.7, 0, 0], 20); // sendi putar sayap (SARJ)
    k.box(0.9, T * 0.95, T * 0.95, truss, [s * 3.25, 0, 0]); // S3/S4
    k.box(0.28, T * 0.8, T * 0.8, truss, [s * 3.85, 0, 0]); // S5
    k.box(0.75, T * 0.95, T * 0.95, truss, [s * 4.35, 0, 0]); // S6
    // kisi terbuka di S5 (rusuk & silang)
    for (const x of [3.72, 3.98])
      for (const [y, z] of [
        [T / 2, T / 2],
        [-T / 2, T / 2],
        [T / 2, -T / 2],
        [-T / 2, -T / 2],
      ])
        k.rod(V(s * x, y, z), V(s * (x + 0.13), -y, z), 0.012, metal);
  }
  // tepi rangka tengah (rusuk memanjang)
  for (const [y, z] of [
    [T / 2, T / 2],
    [-T / 2, T / 2],
    [T / 2, -T / 2],
    [-T / 2, -T / 2],
  ])
    k.box(9.4, 0.025, 0.025, metal, [0, y, z]);

  /* 8 sayap panel surya: 4 modul daya (x = ±3.25, ±4.35), tiap modul 2 sayap (depan & belakang) */
  const WING = 2.9, // panjang sayap (≈35 m)
    BLANKET = 0.36, // lebar satu lembar (≈4.5 m)
    GAP = 0.07; // celah tiang di tengah
  const panelUV = (geo: THREE.BufferGeometry, rep: number) => {
    const uv = geo.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * rep);
    return geo;
  };
  for (const x of [-4.35, -3.25, 3.25, 4.35])
    for (const s of [-1, 1]) {
      const zc = s * (T / 2 + 0.12 + WING / 2);
      const tilt = 0.12 * s; // sedikit miring mengejar Matahari
      for (const side of [-1, 1]) {
        const cx = x + side * (GAP / 2 + BLANKET / 2);
        const geo = panelUV(new THREE.PlaneGeometry(BLANKET, WING, 1, 1), 3);
        k.add(geo, solar, [cx, 0.02 + side * 0.01, zc], [-Math.PI / 2 + tilt, 0, 0]);
      }
      // tiang (mast) berkisi di tengah sayap + kotak lipat di pangkal & ujung
      k.box(0.05, 0.05, WING, metal, [x, 0.03, zc]);
      k.box(BLANKET * 2 + GAP, 0.08, 0.12, dark, [x, 0.02, s * (T / 2 + 0.1)]);
      k.box(BLANKET * 2 + GAP, 0.05, 0.08, metal, [x, 0.02, s * (T / 2 + 0.14 + WING)]);
    }
  // radiator kecil panel surya (putih) di tiap modul daya
  for (const x of [-3.8, 3.8]) k.add(new THREE.PlaneGeometry(0.26, 0.9), rad, [x, -0.1, -0.62], [-Math.PI / 2 + 0.5, 0, 0]);

  /* radiator besar (3 lembar tiap sisi) di rangka S1/P1, membentang ke belakang */
  for (const s of [-1, 1])
    for (let i = 0; i < 3; i++) {
      k.add(new THREE.PlaneGeometry(0.3, 1.15), rad, [s * (1.35 + i * 0.34), 0.06, -T / 2 - 0.66], [-Math.PI / 2 + 0.25, 0, 0]);
    }
  for (const s of [-1, 1]) k.box(1.05, 0.05, 0.05, metal, [s * 1.69, 0.04, -T / 2 - 0.08]);

  /* modul bertekanan di bawah rangka (y = −0.55) */
  const Y = -0.55;
  const R = 0.18;
  // Destiny (lab), tepat di bawah rangka, tersambung dengan penyangga
  k.tube(R, 0.72, "z", hull, [0, Y, 0.05], 28);
  k.rod(V(-0.12, -T / 2, 0), V(-0.1, Y + R, 0.05), 0.02, metal);
  k.rod(V(0.12, -T / 2, 0), V(0.1, Y + R, 0.05), 0.02, metal);
  // Harmony (simpul 2) + pelabuhan depan
  k.tube(R + 0.01, 0.6, "z", mli, [0, Y, 0.72], 28);
  k.tube(0.1, 0.16, "z", metal, [0, Y, 1.09], 20, 0.13);
  k.tube(0.12, 0.05, "z", dark, [0, Y, 1.18], 20);
  // Columbus (kiri) + rak muatan luar
  k.tube(R + 0.01, 0.58, "x", hull, [-0.5, Y, 0.72], 28);
  k.box(0.14, 0.22, 0.22, dark, [-0.86, Y, 0.72]);
  k.box(0.1, 0.1, 0.1, gold, [-0.86, Y + 0.14, 0.72]);
  // Kibo (kanan): modul besar + modul logistik tegak di atasnya + teras luar di ujung
  k.tube(R + 0.005, 0.93, "x", hullJ, [0.68, Y, 0.72], 28);
  k.tube(R, 0.34, "y", hullJ, [0.84, Y + 0.3, 0.72], 28);
  k.box(0.46, 0.1, 0.42, metal, [1.38, Y - 0.02, 0.72]);
  for (const [dx, dz] of [
    [-0.12, -0.12],
    [0.08, -0.1],
    [-0.1, 0.1],
    [0.12, 0.12],
  ])
    k.box(0.12, 0.1, 0.12, dx > 0 ? gold : truss, [1.38 + dx, Y + 0.08, 0.72 + dz]);
  // Unity (simpul 1) di belakang Destiny
  k.tube(R + 0.01, 0.46, "z", mli, [0, Y, -0.55], 28);
  // Tranquility (simpul 3, kiri) + Kupola menghadap Bumi
  k.tube(R + 0.01, 0.56, "x", mli, [-0.46, Y, -0.55], 28);
  k.add(new THREE.CylinderGeometry(0.1, 0.14, 0.1, 6), metal, [-0.46, Y - R - 0.05, -0.55], [Math.PI, 0, 0]);
  k.add(new THREE.CircleGeometry(0.08, 6), glass, [-0.46, Y - R - 0.101, -0.55], [Math.PI / 2, 0, 0]);
  // Quest (airlock, kanan)
  k.tube(0.15, 0.24, "x", mli, [0.33, Y, -0.55], 24);
  k.tube(0.12, 0.18, "x", mli, [0.53, Y, -0.55], 24);
  // Zarya & Zvezda (segmen Rusia) memanjang ke belakang
  k.tube(0.05, 0.14, "z", metal, [0, Y, -0.85], 16);
  k.tube(0.17, 1.05, "z", mli, [0, Y, -1.43], 28);
  k.tube(0.12, 0.14, "z", mli, [0, Y, -2.02], 24, 0.17);
  k.tube(0.17, 1.0, "z", mli, [0, Y, -2.58], 28, 0.14);
  k.tube(0.1, 0.12, "z", metal, [0, Y, -3.14], 16);
  // sayap surya Zvezda (biru tua)
  for (const s of [-1, 1]) {
    k.box(0.02, 0.02, 0.2, metal, [s * 0.28, Y, -2.5]);
    k.add(new THREE.PlaneGeometry(1.0, 0.28), russianWing, [s * 0.9, Y, -2.5], [-Math.PI / 2 + 0.2, 0, 0]);
  }
  // Soyuz menempel di bawah Zarya: modul orbit bulat, kapsul, modul mesin + sayap
  k.add(new THREE.SphereGeometry(0.1, 20, 14), soyuzGreen, [0, Y - 0.32, -1.3]);
  k.tube(0.1, 0.14, "y", soyuzGreen, [0, Y - 0.48, -1.3], 20, 0.06);
  k.tube(0.11, 0.2, "y", mli, [0, Y - 0.65, -1.3], 20);
  for (const s of [-1, 1]) k.add(new THREE.PlaneGeometry(0.42, 0.12), russianWing, [s * 0.33, Y - 0.68, -1.3], [-Math.PI / 2, 0, 0]);
  k.tube(0.04, 0.1, "y", metal, [0, Y - 0.22, -1.3], 12);

  /* lengan robot Canadarm2 di atas rangka */
  const base = V(0.5, T / 2 + 0.04, 0.12);
  const elbow = V(0.2, 0.95, 0.35);
  const wrist = V(-0.55, 0.7, 0.6);
  k.box(0.26, 0.08, 0.26, metal, [base.x, base.y - 0.02, base.z]);
  k.rod(base, elbow, 0.035, white);
  k.rod(elbow, wrist, 0.035, white);
  for (const p of [base, elbow, wrist]) k.add(new THREE.SphereGeometry(0.055, 12, 10), metal, [p.x, p.y, p.z]);
  k.tube(0.03, 0.12, "y", dark, [wrist.x, wrist.y - 0.08, wrist.z], 12);

  /* antena parabola di rangka tengah */
  k.add(new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.6), metal, [-0.9, T / 2 + 0.2, 0.05], [0.4, 0, 0]);
  k.rod(V(-0.9, T / 2, 0.05), V(-0.9, T / 2 + 0.18, 0.05), 0.012, metal);

  const g = k.build();
  // lubang merapat menghadap Bumi di bawah Harmony (tempat kapsul menempel)
  const port = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.16, 24), metal);
  port.position.set(0, Y - R - 0.08, 0.72);
  g.add(port);
  g.userData.portOffset = new THREE.Vector3(0, Y - R - 0.16, 0.72); // titik sambung relatif pusat stasiun
  g.userData.panelPoint = new THREE.Vector3(3.25, 0.12, 1.1); // panel yang diperiksa saat berjalan di luar
  return g;
}
