// Bangunan Rinoya Resto mengikuti desain pemilik (fasad, interior, denah konsep):
// • Fasad: atap miring satu arah dengan lis gelap & plafon kayu hangat, tiang-tiang kayu, dinding kaca penuh di
//   area makan, pintu masuk bernoren biru tua berlogo bunga (mon), teras & tangga berpegangan, dinding merah
//   bertekstur berjendela bulat dengan taman (bonsai, bambu, lentera batu) dan papan "RINOYA RESTO" menyala.
// • Halaman: parkir mobil berjalur putih (kiri), parkir motor (kanan), taman batu & pinus, lampu taman.
// • Dalam: lantai batu terang, meja kayu dengan kursi berbantal abu-abu, bangku panjang di dinding kiri,
//   lampion kertas menggantung, dapur terbuka dengan meja saji, kasir kayu-batu berlogo, rak "PICK UP",
//   rak pajang bonsai, toilet aksesibel & toilet, area cuci tangan dengan wastafel batu & cermin oval,
//   ruang belakang: prep, cuci, gudang kering, pendingin, ruang staf.
// Bagian bertanda 'grow' naik sesuai kemajuan pembangunan; 'late' muncul saat serah terima.

import * as T from 'three';
import type { RestoState } from '@/lib/resto/sim';
import { carMesh, motorMesh } from './city';
import { Merge, canopy, mat, swayMaterial, type Kit } from '@/components/fruits/garden/build';
import * as GTX from '@/components/fruits/garden/textures';
import { BLD, COUNTER, FLOOR_Y, FRIDGE, LOT, PASS_Z, PICKUP, RICE, ROOMS, STATIONS, STEPS, TABLE_COLS, TABLE_ROWS, TABLE_SLOTS, TERRACE, YARD_Y, roofY } from './layout';

const std = (c: string, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

/* ---------------- tekstur (dibuat sekali) ---------------- */

const texCache = new Map<string, T.CanvasTexture>();
function tex(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat = true) {
  let t = texCache.get(key);
  if (!t) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d')!);
    t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeat) t.wrapS = t.wrapT = T.RepeatWrapping;
    texCache.set(key, t);
  }
  return t;
}
function rep(t: T.Texture, x: number, y: number) {
  const c = t.clone();
  c.repeat.set(x, y);
  c.needsUpdate = true;
  return c;
}
function rnd(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Logo mon bunga plum (lima kelopak bundar dalam lingkaran). */
export function drawMon(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, fg: string) {
  g.strokeStyle = fg;
  g.fillStyle = fg;
  g.lineWidth = R * 0.09;
  g.beginPath();
  g.arc(cx, cy, R * 0.94, 0, Math.PI * 2);
  g.stroke();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    g.beginPath();
    g.arc(cx + Math.cos(a) * R * 0.38, cy + Math.sin(a) * R * 0.38, R * 0.3, 0, Math.PI * 2);
    g.fill();
  }
  g.globalCompositeOperation = 'destination-out';
  g.beginPath();
  g.arc(cx, cy, R * 0.13, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + ((i + 0.5) / 5) * Math.PI * 2;
    g.beginPath();
    g.arc(cx + Math.cos(a) * R * 0.2, cy + Math.sin(a) * R * 0.2, R * 0.035, 0, Math.PI * 2);
    g.fill();
  }
  g.globalCompositeOperation = 'source-over';
}

const TX = {
  stone: () =>
    tex('stone', 256, 256, (g) => {
      g.fillStyle = '#d9d1c4';
      g.fillRect(0, 0, 256, 256);
      const r = rnd(3);
      for (let i = 0; i < 2600; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(90,80,70,.08)' : 'rgba(255,255,255,.12)';
        g.fillRect(r() * 256, r() * 256, 2, 2);
      }
      g.strokeStyle = 'rgba(120,110,95,.35)';
      g.lineWidth = 2;
      for (let i = 0; i <= 256; i += 128) {
        g.beginPath();
        g.moveTo(i, 0);
        g.lineTo(i, 256);
        g.moveTo(0, i);
        g.lineTo(256, i);
        g.stroke();
      }
    }),
  kitchen: () =>
    tex('kitchen', 128, 128, (g) => {
      g.fillStyle = '#a4a8aa';
      g.fillRect(0, 0, 128, 128);
      g.strokeStyle = 'rgba(40,40,40,.25)';
      for (let i = 0; i <= 128; i += 32) {
        g.beginPath();
        g.moveTo(i, 0);
        g.lineTo(i, 128);
        g.moveTo(0, i);
        g.lineTo(128, i);
        g.stroke();
      }
    }),
  wood: () =>
    tex('wood', 256, 256, (g) => {
      const r = rnd(9);
      for (let i = 0; i < 16; i++) {
        g.fillStyle = ['#c08a52', '#b87e48', '#c9955c', '#b3793f'][i % 4];
        g.fillRect(i * 16, 0, 16, 256);
        g.fillStyle = 'rgba(60,30,10,.18)';
        g.fillRect(i * 16, 0, 1.5, 256);
        for (let k = 0; k < 6; k++) {
          g.fillStyle = 'rgba(90,50,20,.08)';
          g.fillRect(i * 16 + r() * 14, r() * 256, 2, 30 + r() * 60);
        }
      }
    }),
  plaster: () =>
    tex('plaster', 128, 128, (g) => {
      g.fillStyle = '#efe8dc';
      g.fillRect(0, 0, 128, 128);
      const r = rnd(5);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.035)' : 'rgba(255,255,255,.06)';
        g.fillRect(r() * 128, r() * 128, 2, 2);
      }
    }),
  red: () =>
    tex('red', 256, 256, (g) => {
      g.fillStyle = '#a8332a';
      g.fillRect(0, 0, 256, 256);
      const r = rnd(7);
      for (let i = 0; i < 4000; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(60,10,5,.14)' : 'rgba(255,160,130,.08)';
        g.fillRect(r() * 256, r() * 256, 2 + r() * 3, 2 + r() * 3);
      }
    }),
  brick: () =>
    tex('brick', 256, 256, (g) => {
      g.fillStyle = '#9a8a7a';
      g.fillRect(0, 0, 256, 256);
      for (let rr = 0; rr < 16; rr++)
        for (let c = -1; c < 8; c++) {
          const x = c * 34 + (rr % 2 ? 17 : 0);
          g.fillStyle = ['#b85a3a', '#a84e32', '#c46a44', '#b0563a'][(rr * 7 + c * 3) & 3];
          g.fillRect(x + 2, rr * 16 + 2, 30, 12);
        }
    }),
  gravel: () =>
    tex('gravel', 128, 128, (g) => {
      g.fillStyle = '#d8d2c6';
      g.fillRect(0, 0, 128, 128);
      const r = rnd(12);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = ['#c8c0b2', '#eae4d8', '#b0a898', '#f6f2ea'][Math.floor(r() * 4)];
        g.beginPath();
        g.arc(r() * 128, r() * 128, 1 + r() * 1.6, 0, Math.PI * 2);
        g.fill();
      }
      g.strokeStyle = 'rgba(150,140,125,.35)';
      for (let y = 6; y < 128; y += 10) {
        g.beginPath();
        g.moveTo(0, y);
        for (let x = 0; x <= 128; x += 8) g.lineTo(x, y + Math.sin(x * 0.15) * 2);
        g.stroke();
      }
    }),
  noren: () =>
    tex(
      'noren',
      256,
      192,
      (g) => {
        g.fillStyle = '#1b2a4e';
        g.fillRect(0, 0, 256, 192);
        drawMon(g, 128, 88, 46, '#f4efe4');
        g.fillStyle = '#2a3a60';
        for (const x of [64, 128, 192]) g.fillRect(x - 1, 40, 2, 152);
      },
      false,
    ),
  sign: () =>
    tex(
      'sign',
      512,
      256,
      (g) => {
        g.clearRect(0, 0, 512, 256);
        g.fillStyle = '#fff4de';
        g.font = '800 92px system-ui, sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('RINOYA', 256, 80);
        g.fillText('RESTO', 256, 186);
      },
      false,
    ),
  monLit: () =>
    tex(
      'monLit',
      256,
      256,
      (g) => {
        g.clearRect(0, 0, 256, 256);
        drawMon(g, 128, 128, 118, '#fff4de');
      },
      false,
    ),
  pickup: () =>
    tex(
      'pickup',
      256,
      64,
      (g) => {
        g.fillStyle = '#c9955c';
        g.fillRect(0, 0, 256, 64);
        g.fillStyle = '#2a1a10';
        g.font = '800 34px system-ui, sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('PICK UP', 128, 34);
      },
      false,
    ),
  counterFront: () =>
    tex(
      'counterFront',
      256,
      128,
      (g) => {
        g.fillStyle = '#c08a52';
        g.fillRect(0, 0, 256, 128);
        g.fillStyle = 'rgba(60,30,10,.15)';
        for (let x = 0; x < 256; x += 12) g.fillRect(x, 0, 1.5, 128);
        drawMon(g, 70, 64, 30, '#2a1a10');
        g.fillStyle = '#2a1a10';
        g.font = '800 26px system-ui, sans-serif';
        g.textBaseline = 'middle';
        g.fillText('RINOYA', 112, 50);
        g.fillText('RESTO', 112, 82);
      },
      false,
    ),
  wcSign: (kind: 'akses' | 'wc') =>
    tex(
      `wc-${kind}`,
      128,
      256,
      (g) => {
        g.fillStyle = '#b8824a';
        g.fillRect(0, 0, 128, 256);
        g.fillStyle = 'rgba(60,30,10,.15)';
        for (let x = 0; x < 128; x += 10) g.fillRect(x, 0, 1.5, 256);
        g.fillStyle = '#1a1a1a';
        g.font = '64px system-ui, "Apple Color Emoji", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(kind === 'akses' ? '♿' : '🚻', 64, 80);
        g.fillRect(96, 110, 8, 60); // gagang pintu
        g.fillStyle = 'rgba(30,20,10,.6)';
        for (let y = 200; y < 240; y += 8) g.fillRect(20, y, 88, 4); // kisi udara
      },
      false,
    ),
};

/* ---------------- pembangun ---------------- */

const plantTex: { bark?: T.Texture; leaf?: T.Texture } = {};

export interface BuiltResto {
  shell: T.Group;
  dyn: T.Group;
  lanterns: T.Object3D[];
  roof: T.Group;
  roofMats: T.Material[];
  tablePos: T.Vector3[];
}

type Tag = 'grow' | 'late' | undefined;

export function buildResto(s: RestoState, built: boolean): BuiltResto {
  const shell = new T.Group();
  const dyn = new T.Group();
  const lanterns: T.Object3D[] = [];
  const roof = new T.Group();
  const roofMats: T.Material[] = [];
  const tablePos: T.Vector3[] = [];
  const r = rnd(77);
  // tanaman realistis (kartu daun bertekstur seperti di Kebun Rinoya), digabung jadi 3 mesh
  const kit: Kit = { bark: new Merge(), leaf: new Merge(), plain: new Merge() };

  /** kotak dengan alas di y (agar bisa "tumbuh" dari bawah). */
  const box = (parent: T.Object3D, w: number, h: number, d: number, mat: T.Material | T.Material[], x: number, y: number, z: number, tag?: Tag, shadow = true) => {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d).translate(0, h / 2, 0), mat);
    m.position.set(x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    if (tag) m.userData.wall = tag;
    parent.add(m);
    return m;
  };
  const late = (o: T.Object3D) => ((o.userData.wall = 'late'), shell.add(o), o);

  const stoneM = std('#bdb5a8', 0.9);
  const plasterM = new T.MeshStandardMaterial({ map: rep(TX.plaster(), 6, 2), roughness: 0.95 });
  const wallM = built ? plasterM : new T.MeshStandardMaterial({ map: rep(TX.brick(), 4, 2), roughness: 0.95 });
  const timberM = std('#8a5a32', 0.6);
  const darkTimber = std('#5a3a22', 0.6);
  const woodM = new T.MeshStandardMaterial({ map: rep(TX.wood(), 1, 1), roughness: 0.6 });
  const glassM = new T.MeshStandardMaterial({ color: '#cfe2ea', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
  const steel = std('#c4c8cc', 0.3, { metalness: 0.75 });
  const stoneTop = std('#cfc8bc', 0.5);
  const cushion = std('#4a4f57', 0.9);
  const oak = std('#c89a64', 0.55);
  const W = BLD.x1 - BLD.x0,
    D = BLD.z1 - BLD.z0,
    cz = (BLD.z0 + BLD.z1) / 2;

  /* ---------- plint, teras, tangga ---------- */
  const GZ = ROOMS.garden.z0;
  box(shell, ROOMS.garden.x0 - BLD.x0 + 0.2, FLOOR_Y, D + 0.4, stoneM, (BLD.x0 - 0.2 + ROOMS.garden.x0) / 2, 0, cz - 0.2);
  box(shell, BLD.x1 - ROOMS.garden.x0 + 0.2, FLOOR_Y, GZ - BLD.z0 + 0.2, stoneM, (ROOMS.garden.x0 + BLD.x1 + 0.2) / 2, 0, (BLD.z0 - 0.2 + GZ) / 2);
  box(shell, TERRACE.x1 - TERRACE.x0, FLOOR_Y, TERRACE.z1 - TERRACE.z0, stoneM, (TERRACE.x0 + TERRACE.x1) / 2, 0, (TERRACE.z0 + TERRACE.z1) / 2);
  const stepZ = (STEPS.z0 + STEPS.z1) / 2;
  box(shell, STEPS.x1 - STEPS.x0, 0.3, (STEPS.z1 - STEPS.z0) / 2, stoneM, (STEPS.x0 + STEPS.x1) / 2, 0, STEPS.z0 + (STEPS.z1 - STEPS.z0) / 4);
  void stepZ;
  if (!s.contractor) return { shell, dyn, lanterns, roof, roofMats, tablePos };

  /* ---------- lantai ---------- */
  const floorAt = (x0: number, x1: number, z0: number, z1: number, m: T.Material) => {
    const f = new T.Mesh(new T.PlaneGeometry(x1 - x0, z1 - z0), m);
    f.rotation.x = -Math.PI / 2;
    f.position.set((x0 + x1) / 2, FLOOR_Y + 0.005, (z0 + z1) / 2);
    f.receiveShadow = true;
    shell.add(f);
  };
  if (built) {
    floorAt(BLD.x0, ROOMS.toilet.x0, ROOMS.dining.z0, BLD.z1, new T.MeshStandardMaterial({ map: rep(TX.stone(), 12, 4), roughness: 0.55 }));
    floorAt(BLD.x0, ROOMS.cuci[1], BLD.z0, ROOMS.dining.z0, new T.MeshStandardMaterial({ map: rep(TX.kitchen(), 16, 4), roughness: 0.7 }));
    floorAt(ROOMS.cuci[1], BLD.x1, BLD.z0, ROOMS.dining.z0, new T.MeshStandardMaterial({ map: rep(TX.kitchen(), 12, 4), color: '#e8e2d8', roughness: 0.7 }));
    floorAt(ROOMS.toilet.x0, BLD.x1, ROOMS.toilet.z0, ROOMS.wash.z1, new T.MeshStandardMaterial({ map: rep(TX.stone(), 3, 3), color: '#efe4d2', roughness: 0.5 }));
  } else floorAt(BLD.x0, BLD.x1, BLD.z0, BLD.z1, std('#a9a59c', 0.95));

  /* ---------- dinding luar (tinggi mengikuti atap miring) ---------- */
  const wallRun = (x0: number, x1: number, z: number, t = 0.22, mat: T.Material = wallM, maxH?: number) => {
    const n = Math.max(1, Math.ceil((x1 - x0) / 2));
    const sw = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const xm = x0 + sw * (i + 0.5);
      box(shell, sw + 0.01, Math.min(maxH ?? 99, roofY(xm) - FLOOR_Y), t, mat, xm, FLOOR_Y, z, 'grow');
    }
  };
  wallRun(BLD.x0, BLD.x1, BLD.z0); // belakang
  box(shell, 0.22, roofY(BLD.x0) - FLOOR_Y, D, wallM, BLD.x0, FLOOR_Y, cz, 'grow'); // kiri
  box(shell, 0.22, roofY(BLD.x1) - FLOOR_Y, ROOMS.garden.z0 - BLD.z0, wallM, BLD.x1, FLOOR_Y, (BLD.z0 + ROOMS.garden.z0) / 2, 'grow'); // kanan
  // fasad depan area makan: kaca penuh dengan tiang kayu
  box(shell, ROOMS.dining.x1 - BLD.x0, 0.3, 0.24, wallM, (BLD.x0 + ROOMS.dining.x1) / 2, FLOOR_Y, BLD.z1, 'grow');
  for (let x = BLD.x0; x <= ROOMS.dining.x1 + 0.01; x += (ROOMS.dining.x1 - BLD.x0) / 10) {
    box(shell, 0.16, roofY(x) - FLOOR_Y, 0.2, timberM, x, FLOOR_Y, BLD.z1, 'grow');
  }
  const glassFront = new T.Mesh(new T.PlaneGeometry(1, 1), glassM);
  glassFront.scale.set(ROOMS.dining.x1 - BLD.x0, roofY((BLD.x0 + ROOMS.dining.x1) / 2) - FLOOR_Y - 0.3, 1);
  glassFront.position.set((BLD.x0 + ROOMS.dining.x1) / 2, FLOOR_Y + 0.3 + glassFront.scale.y / 2, BLD.z1 + 0.02);
  late(glassFront);
  // tiang besar pintu masuk & bilah kayu vertikal
  for (const x of [ROOMS.dining.x1, TERRACE.x1 + 0.2]) box(shell, 0.4, roofY(x) - FLOOR_Y, 0.4, timberM, x, FLOOR_Y, BLD.z1 + 0.1, 'grow');
  for (let x = TERRACE.x1 + 0.45; x < ROOMS.garden.x0 - 0.05; x += 0.16) box(shell, 0.07, roofY(x) - FLOOR_Y, 0.1, timberM, x, FLOOR_Y, BLD.z1 + 0.05, 'grow', false);
  box(shell, ROOMS.garden.x0 - TERRACE.x1, roofY(0) - FLOOR_Y, 0.2, wallM, (TERRACE.x1 + ROOMS.garden.x0) / 2, FLOOR_Y, BLD.z1 - 0.12, 'grow');
  // dinding atas pintu & kaca samping pintu
  box(shell, 5.2, roofY(-4) - FLOOR_Y - 2.6, 0.2, woodM, -4.1, FLOOR_Y + 2.6, BLD.z1, 'grow');
  for (const [x0, x1] of [
    [ROOMS.dining.x1 + 0.2, -5.25],
    [-2.75, TERRACE.x1],
  ]) {
    const g = new T.Mesh(new T.PlaneGeometry(x1 - x0, 2.6), glassM);
    g.position.set((x0 + x1) / 2, FLOOR_Y + 1.3, BLD.z1);
    late(g);
  }
  // dinding muka area cuci tangan & sisi taman: kaca ke arah taman
  const gw = new T.Mesh(new T.PlaneGeometry(BLD.x1 - ROOMS.garden.x0, 3), glassM);
  gw.position.set((ROOMS.garden.x0 + BLD.x1) / 2, FLOOR_Y + 1.5, ROOMS.garden.z0);
  late(gw);
  box(shell, 0.16, 3.2, 0.16, timberM, ROOMS.garden.x0, FLOOR_Y, ROOMS.garden.z0, 'grow');
  const gs = new T.Mesh(new T.PlaneGeometry(BLD.z1 - ROOMS.garden.z0, 3), glassM);
  gs.rotation.y = Math.PI / 2;
  gs.position.set(ROOMS.garden.x0, FLOOR_Y + 1.5, (ROOMS.garden.z0 + BLD.z1) / 2);
  late(gs);

  /* ---------- dinding merah berjendela bulat + taman ---------- */
  {
    const G = ROOMS.garden;
    const w = G.x1 - G.x0,
      h = 8.8;
    const shp = new T.Shape();
    shp.moveTo(0, 0);
    shp.lineTo(w, 0);
    shp.lineTo(w, h);
    shp.lineTo(0, h);
    shp.lineTo(0, 0);
    const hole = new T.Path();
    hole.absarc(w / 2, 2.9, 1.55, 0, Math.PI * 2, true);
    shp.holes.push(hole);
    const geo = new T.ExtrudeGeometry(shp, { depth: 0.45, bevelEnabled: false, curveSegments: 40 });
    const redM = new T.MeshStandardMaterial({ map: rep(TX.red(), 1 / 3, 1 / 3), roughness: 0.95 });
    const redWall = new T.Mesh(geo, built ? redM : wallM);
    redWall.position.set(G.x0, 0, G.z1 - 0.45);
    redWall.castShadow = redWall.receiveShadow = true;
    redWall.userData.wall = 'grow';
    shell.add(redWall);
    box(shell, 0.3, 3.2, G.z1 - G.z0, built ? redM : wallM, G.x1 - 0.15, 0, (G.z0 + G.z1) / 2, 'grow');
    // logo & tulisan menyala di dinding merah
    const lit = (t: T.Texture, sw: number, sh: number, y: number) => {
      const m = new T.Mesh(new T.PlaneGeometry(sw, sh), new T.MeshStandardMaterial({ map: t, transparent: true, emissive: '#ffe8c0', emissiveMap: t, emissiveIntensity: 1.2, roughness: 0.4 }));
      m.position.set((G.x0 + G.x1) / 2, y, G.z1 + 0.03);
      late(m);
    };
    lit(TX.monLit(), 1.5, 1.5, 7.7);
    lit(TX.sign(), 3.6, 1.8, 5.9);
    // cincin cahaya di jendela bulat
    const ring = new T.Mesh(new T.TorusGeometry(1.55, 0.05, 8, 48), std('#ffd9a0', 0.4, { emissive: '#ffb860', emissiveIntensity: 0.8 }));
    ring.position.set((G.x0 + G.x1) / 2, 2.9, G.z1 - 0.2);
    late(ring);
    // taman dalam: kerikil disapu, batu, bonsai pinus, bambu, lentera batu
    const gravel = new T.Mesh(new T.PlaneGeometry(w - 0.4, G.z1 - G.z0 - 0.5), new T.MeshStandardMaterial({ map: rep(TX.gravel(), 3, 2), roughness: 1 }));
    gravel.rotation.x = -Math.PI / 2;
    gravel.position.set((G.x0 + G.x1) / 2, YARD_Y + 0.02, (G.z0 + G.z1) / 2 - 0.2);
    late(gravel);
    bonsai(kit, (G.x0 + G.x1) / 2 + 0.3, G.z0 + 1.6, 1.2, r);
    const rock = new T.Mesh(new T.DodecahedronGeometry(0.6, 1), std('#7a766c', 0.9, { flatShading: true }));
    rock.scale.set(1.3, 0.7, 1);
    rock.position.set((G.x0 + G.x1) / 2 - 1.2, YARD_Y + 0.3, G.z0 + 2.2);
    late(rock);
    late(stoneLantern(G.x1 - 1.0, G.z0 + 1.0));
    for (let i = 0; i < 9; i++) bamboo(kit, G.x0 + 0.4 + (i % 3) * 0.25, G.z0 + 0.4 + Math.floor(i / 3) * 0.3, 3.2 + r() * 1.5, r);
  }

  /* ---------- sekat dalam ---------- */
  const inner = (x0: number, x1: number, z0: number, z1: number, h = 3.2, gaps: [number, number][] = []) => {
    const along = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    const a0 = along ? x0 : z0,
      a1 = along ? x1 : z1;
    const cuts = [a0, ...gaps.flat(), a1];
    for (let i = 0; i < cuts.length; i += 2) {
      const s0 = cuts[i],
        s1 = cuts[i + 1];
      if (s1 - s0 < 0.05) continue;
      if (along) box(shell, s1 - s0, h, 0.14, built ? plasterM : wallM, (s0 + s1) / 2, FLOOR_Y, z0, 'grow');
      else box(shell, 0.14, h, s1 - s0, built ? plasterM : wallM, x0, FLOOR_Y, (s0 + s1) / 2, 'grow');
    }
  };
  const KZ = ROOMS.kitchenZ[1];
  // ruang belakang (cuci, gudang, pendingin, staf) berpintu ke koridor
  inner(ROOMS.cuci[0], BLD.x1, KZ, KZ, 3.2, [
    [-8.4, -7.4],
    [-5.1, -4.1],
    [-2.0, -1.0],
    [1.3, 2.3],
  ]);
  for (const x of [ROOMS.prep[0], ROOMS.cuci[0], ROOMS.gudang[0], ROOMS.pendingin[0], ROOMS.staf[0]]) inner(x, x, BLD.z0, KZ, 3.2, x === ROOMS.prep[0] ? [[-12.6, -11.4]] : []);
  // toilet
  inner(ROOMS.toilet.x0, ROOMS.toilet.x0, ROOMS.toilet.z0, ROOMS.toilet.z1);
  inner(3.3, 3.3, ROOMS.toilet.z0, ROOMS.toilet.z1);
  inner(ROOMS.toilet.x0, BLD.x1, ROOMS.toilet.z1, ROOMS.toilet.z1, 3.2, [
    [1.6, 2.7],
    [3.9, 5.0],
  ]);
  // sekat area makan ↔ tengah: kisi kayu (belakang) & pot tanaman (depan), tengah terbuka
  for (let z = ROOMS.dining.z0 + 0.1; z < -8.6; z += 0.18) box(shell, 0.06, 2.4, 0.08, timberM, ROOMS.dining.x1, FLOOR_Y, z, 'grow', false);

  if (!built) return { shell, dyn, lanterns, roof, roofMats, tablePos };

  /* ---------- atap miring (bisa memudar saat kamera dekat) ---------- */
  {
    const ang = Math.atan2(roofY(BLD.x1) - roofY(BLD.x0), W);
    const top = std('#565a60', 0.5, { metalness: 0.4, transparent: true });
    const soffit = new T.MeshStandardMaterial({ map: rep(TX.wood(), 8, 3), roughness: 0.6, transparent: true });
    const fascia = std('#2a2c30', 0.5, { transparent: true });
    roofMats.push(top, soffit, fascia);
    // atap utama (sampai dinding merah) + atap belakang di atas toilet & ruang staf
    const slabAt = (x0: number, x1: number, z0: number, z1: number) => {
      const w = x1 - x0;
      const slab = new T.Mesh(new T.BoxGeometry(w / Math.cos(ang), 0.32, z1 - z0), [fascia, fascia, top, soffit, fascia, fascia]);
      const xm = (x0 + x1) / 2;
      slab.position.set(xm, roofY(xm) + 0.18, (z0 + z1) / 2);
      slab.rotation.z = ang;
      slab.castShadow = true;
      roof.add(slab);
    };
    slabAt(BLD.x0 - 1.2, ROOMS.garden.x0, BLD.z0 - 1.0, BLD.z1 + 2.2);
    slabAt(ROOMS.garden.x0, BLD.x1 + 0.6, BLD.z0 - 1.0, ROOMS.garden.z0 - 0.1);
    // lampu sorot kecil di plafon teras
    for (let x = BLD.x0 + 0.8; x < ROOMS.garden.x0; x += 2.2) {
      const m = std('#fff2d0', 0.3, { emissive: '#ffd890', emissiveIntensity: 1.4, transparent: true });
      roofMats.push(m);
      const spot = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.03, 10), m);
      spot.position.set(x, roofY(x) - 0.02, BLD.z1 + 0.9);
      roof.add(spot);
    }
    roof.userData.wall = 'late';
    shell.add(roof);
  }

  /* ---------- halaman: parkir, taman, lampu ---------- */
  {
    const white = std('#f2f0e8', 0.7);
    const line = (w: number, d: number, x: number, z: number) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, d), white);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, YARD_Y + 0.012, z);
      late(m);
    };
    const bays = [-21.2, -18.2, -15.2, -12.2];
    for (const x of bays) line(0.1, 4.6, x, 0.7);
    line(9.0, 0.1, -16.7, -1.6);
    const cm = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.25 });
    for (const [x, col, kind] of [
      [-19.7, '#f4f4f2', 'suv'],
      [-16.7, '#1d1f24', 'suv'],
    ] as const) {
      const { mesh } = carMesh(kind, col, cm);
      mesh.rotation.y = Math.PI / 2;
      mesh.position.set(x, YARD_Y, 0.9);
      mesh.castShadow = true;
      late(mesh);
    }
    // parkir motor di depan dinding merah
    for (let i = 0; i < 4; i++) line(0.08, 2.2, ROOMS.garden.x0 + 0.6 + i * 1.5, 1.6);
    for (let i = 0; i < 3; i++) {
      const { mesh } = motorMesh('parkir', rnd(31 + i), cm);
      mesh.rotation.y = Math.PI / 2 + 0.12;
      mesh.position.set(ROOMS.garden.x0 + 1.35 + i * 1.5, YARD_Y, 1.5);
      late(mesh);
    }
    // taman batu & pinus di antara parkir dan tangga
    const bedM = std('#5a4632', 1);
    const bed = new T.Mesh(new T.BoxGeometry(4.2, 0.3, 2.6), [stoneTop, stoneTop, bedM, stoneTop, stoneTop, stoneTop]);
    bed.position.set(-8.6, YARD_Y + 0.15, -0.9);
    late(bed);
    bonsai(kit, -8.2, -1.1, 1.3, r, YARD_Y + 0.3);
    for (let i = 0; i < 3; i++) {
      const rk = new T.Mesh(new T.DodecahedronGeometry(0.35 + r() * 0.2, 1), std('#8a857a', 0.9, { flatShading: true }));
      rk.scale.y = 0.6;
      rk.position.set(-9.8 + i * 0.9, YARD_Y + 0.4, -0.3 - (i % 2) * 0.6);
      late(rk);
    }
    for (let i = 0; i < 7; i++) shrub(kit, -10.3 + r() * 3.4, -1.9 + r() * 1.7, 0.32 + r() * 0.15, r, YARD_Y + 0.3);
    // pot tanaman di kanan tangga & sepanjang kaca area makan
    const planter = (x: number, z: number, w: number, d: number) => {
      const p = new T.Mesh(new T.BoxGeometry(w, 0.5, d), stoneTop);
      p.position.set(x, YARD_Y + 0.25, z);
      late(p);
      const n = Math.max(1, Math.round(w * 1.4));
      for (let i = 0; i < n; i++) shrub(kit, x - w / 2 + 0.3 + (i / n) * (w - 0.4), z + (r() - 0.5) * (d - 0.25), 0.3 + r() * 0.1, r, YARD_Y + 0.5);
    };
    planter(-1.3, -0.5, 1.6, 1.2);
    planter((BLD.x0 + -12) / 2, -2.0, 9.6, 0.5);
    // lampu taman kecil
    for (const [x, z] of [
      [-10.6, 0.5],
      [-6.9, 0.5],
      [-2.0, 0.5],
      [-0.6, -1.4],
      [-21.8, -1.8],
      [-12.2, -1.8],
      [6.4, 0.2],
    ]) {
      const post = new T.Mesh(new T.BoxGeometry(0.16, 0.6, 0.16), std('#2a2c30', 0.5));
      post.position.set(x, YARD_Y + 0.3, z);
      const glow = new T.Mesh(new T.BoxGeometry(0.12, 0.18, 0.12), std('#fff0c8', 0.3, { emissive: '#ffc870', emissiveIntensity: 1.5 }));
      glow.position.set(x, YARD_Y + 0.5, z);
      late(post);
      late(glow);
    }
    // pegangan tangga
    for (const x of [STEPS.x1 + 0.15]) {
      for (const z of [STEPS.z0 - 0.4, STEPS.z1 - 0.2]) {
        const p = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.95, 8), std('#2a2c30', 0.4, { metalness: 0.6 }));
        p.position.set(x, groundAt(z) + 0.47, z);
        late(p);
      }
      const rail = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, STEPS.z1 - STEPS.z0 + 0.3, 8), std('#2a2c30', 0.4, { metalness: 0.6 }));
      rail.rotation.x = Math.PI / 2 - 0.2;
      rail.position.set(x, 0.95 + (FLOOR_Y + YARD_Y) / 2, (STEPS.z0 + STEPS.z1) / 2 - 0.1);
      late(rail);
    }
    // bambu di tepi lahan
    // semak rendah di tepi lahan (di bawah atap — tidak menembus)
    for (let z = -14.4; z < -1.6; z += 1.1) shrub(kit, LOT.x0 + 0.65, z, 0.5 + r() * 0.12, r, YARD_Y);
    // noren di pintu
    const noren = new T.Mesh(new T.PlaneGeometry(2.3, 1.7), new T.MeshStandardMaterial({ map: TX.noren(), side: T.DoubleSide, roughness: 0.9 }));
    noren.position.set(-4.0, FLOOR_Y + 2.55 - 0.85, BLD.z1 + 0.05);
    late(noren);
    const rod = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 2.5, 8), darkTimber);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(-4.0, FLOOR_Y + 2.57, BLD.z1 + 0.05);
    late(rod);
    // lampion di teras
    for (const x of [-5.9, -2.1]) {
      const l = paperLantern(x, FLOOR_Y + 2.9, BLD.z1 + 0.9, 0.34, roofY(x) - 0.1);
      late(l);
      lanterns.push(l);
    }
  }

  /* ---------- lampu hangat dalam ruang ---------- */
  for (const [x, z] of [
    [-16, -6],
    [-9, -6],
    [-3, -7],
  ]) {
    const pl = new T.PointLight('#ffcf8a', 7, 12, 1.8);
    pl.position.set(x, FLOOR_Y + 3.0, z);
    late(pl);
  }

  /* ---------- isi dalam ---------- */
  // dapur: meja stainless sepanjang dinding belakang + kap asap, meja saji dapur terbuka
  box(dyn, ROOMS.dapur[1] - BLD.x0 - 0.5, 0.9, 0.75, steel, (BLD.x0 + ROOMS.dapur[1]) / 2 - 0.05, FLOOR_Y, BLD.z0 + 0.55);
  box(dyn, ROOMS.dapur[1] - BLD.x0 - 1.2, 0.5, 1.0, steel, (BLD.x0 + ROOMS.dapur[1]) / 2, FLOOR_Y + 2.3, BLD.z0 + 0.65, undefined, false);
  box(dyn, ROOMS.prep[1] - BLD.x0 - 0.4, 1.0, 0.55, woodM, (BLD.x0 + ROOMS.prep[1]) / 2, FLOOR_Y, PASS_Z);
  box(dyn, ROOMS.prep[1] - BLD.x0 - 0.3, 0.06, 0.7, stoneTop, (BLD.x0 + ROOMS.prep[1]) / 2, FLOOR_Y + 1.0, PASS_Z);
  for (let i = 0; i < 6; i++) {
    const plate = new T.Mesh(new T.CylinderGeometry(0.16, 0.12, 0.05, 16), std('#1f2f5a', 0.4));
    plate.position.set(-20 + i * 1.8, FLOOR_Y + 1.09, PASS_Z);
    dyn.add(plate);
  }
  // meja prep & area cuci & gudang & staf
  box(dyn, 2.2, 0.9, 1.0, steel, (ROOMS.prep[0] + ROOMS.prep[1]) / 2, FLOOR_Y, -12.4);
  for (const x of [-8.6, -7.0]) {
    box(dyn, 1.2, 0.9, 0.7, steel, x, FLOOR_Y, BLD.z0 + 0.5);
    const sink = new T.Mesh(new T.BoxGeometry(0.8, 0.05, 0.45), std('#6a7076', 0.2, { metalness: 0.8 }));
    sink.position.set(x, FLOOR_Y + 0.93, BLD.z0 + 0.5);
    dyn.add(sink);
  }
  box(dyn, 1.6, 1.6, 0.5, steel, -7.8, FLOOR_Y, -12.0);
  for (const x of [-5.6, -3.6]) {
    box(dyn, 0.5, 2.2, 3.2, woodM, x, FLOOR_Y, -12.6);
    for (let i = 0; i < 5; i++) {
      const sack = new T.Mesh(new T.CapsuleGeometry(0.16, 0.3, 3, 8), std(['#e8dcc0', '#d8c8a0', '#f0e8d4'][i % 3], 0.9));
      sack.rotation.z = Math.PI / 2;
      sack.position.set(x, FLOOR_Y + 0.5 + (i % 3) * 0.6, -13.6 + Math.floor(i / 3) * 1.2 + (i % 2) * 0.5);
      dyn.add(sack);
    }
  }
  for (let i = 0; i < 4; i++) box(dyn, 0.45, 1.9, 0.5, std(['#4a6a8a', '#8a4a4a', '#4a7a5a', '#8a7a4a'][i], 0.5, { metalness: 0.3 }), 0.8 + i * 0.5, FLOOR_Y, BLD.z0 + 0.4);
  box(dyn, 1.6, 0.75, 0.8, oak, 3.8, FLOOR_Y, -12.2);
  // alat yang dibeli
  const look: Record<string, () => T.Object3D> = {
    goreng: () => {
      const g = new T.Group();
      box(g, 1.1, 0.18, 0.6, steel, 0, 0.9, 0);
      const oil = new T.Mesh(new T.BoxGeometry(0.8, 0.02, 0.45), std('#e0a030', 0.2, { emissive: '#7a4a10', emissiveIntensity: 0.3 }));
      oil.position.y = 1.09;
      g.add(oil);
      return g;
    },
    kompor: () => {
      const g = new T.Group();
      box(g, 1.3, 0.08, 0.6, std('#2a2c30', 0.4), 0, 0.9, 0);
      for (const x of [-0.35, 0.35]) {
        const pot = new T.Mesh(new T.CylinderGeometry(0.24, 0.22, 0.32, 16), std('#8a9096', 0.3, { metalness: 0.8 }));
        pot.position.set(x, 1.14, 0);
        g.add(pot);
      }
      return g;
    },
    sushi: () => {
      const g = new T.Group();
      box(g, 0.9, 0.05, 0.45, std('#f0dcb0', 0.6), 0, 0.9, 0);
      const fish = new T.Mesh(new T.BoxGeometry(0.3, 0.06, 0.12), std('#f08a6a', 0.5));
      fish.position.set(0.2, 0.98, 0);
      g.add(fish);
      return g;
    },
    minum: () => {
      const g = new T.Group();
      for (let i = 0; i < 3; i++) {
        const disp = new T.Mesh(new T.CylinderGeometry(0.13, 0.13, 0.45, 14), std(['#6a8a5a', '#c8a060', '#e8e0d0'][i], 0.3, { transparent: true, opacity: 0.85 }));
        disp.position.set(-0.35 + i * 0.35, 1.13, 0);
        g.add(disp);
      }
      return g;
    },
  };
  for (const [id, p] of Object.entries(STATIONS))
    if (s.equipment.includes(id)) {
      const o = look[id]();
      o.position.set(p.x, FLOOR_Y, BLD.z0 + 0.55);
      dyn.add(o);
    }
  if (s.equipment.includes('ricecooker')) {
    const rc = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 0.36, 16), std('#f4f4f4', 0.4));
    rc.position.set(RICE.x, FLOOR_Y + 1.08, -12.4);
    dyn.add(rc);
  }
  if (s.equipment.includes('kulkas'))
    for (const x of [-2.4, -1.4, -0.4]) {
      box(dyn, 0.9, 2.1, 0.8, std('#e8ecf0', 0.3, { metalness: 0.4 }), x, FLOOR_Y, FRIDGE.z);
      const h = new T.Mesh(new T.BoxGeometry(0.04, 0.7, 0.04), steel);
      h.position.set(x + 0.3, FLOOR_Y + 1.3, FRIDGE.z + 0.42);
      dyn.add(h);
    }
  // kasir kayu-batu berlogo + monitor POS
  if (s.equipment.includes('kasir')) {
    const front = new T.MeshStandardMaterial({ map: TX.counterFront(), roughness: 0.6 });
    box(dyn, 2.4, 1.05, 0.7, [woodM, woodM, woodM, woodM, front, woodM], COUNTER.x, FLOOR_Y, COUNTER.z);
    box(dyn, 2.5, 0.07, 0.8, stoneTop, COUNTER.x, FLOOR_Y + 1.05, COUNTER.z);
    const mon = new T.Mesh(new T.BoxGeometry(0.5, 0.35, 0.05), std('#1a1c20', 0.3));
    mon.position.set(COUNTER.x + 0.5, FLOOR_Y + 1.35, COUNTER.z - 0.1);
    mon.rotation.x = -0.25;
    const screen = new T.Mesh(new T.PlaneGeometry(0.44, 0.29), std('#3a6a9a', 0.2, { emissive: '#3a7ac8', emissiveIntensity: 0.6 }));
    screen.position.set(COUNTER.x + 0.5, FLOOR_Y + 1.35, COUNTER.z - 0.07);
    screen.rotation.x = -0.25;
    dyn.add(mon, screen);
    bonsai(kit, COUNTER.x - 0.9, COUNTER.z, 0.35, r, FLOOR_Y + 1.1);
  }
  // rak ambil pesanan "PICK UP" dengan tas kertas
  {
    box(dyn, 0.5, 2.2, 1.8, woodM, PICKUP.x, FLOOR_Y, PICKUP.z);
    for (let i = 0; i < 6; i++) {
      const bag = new T.Mesh(new T.BoxGeometry(0.28, 0.32, 0.18), std('#c9a878', 0.9));
      bag.position.set(PICKUP.x + 0.28, FLOOR_Y + 0.62 + Math.floor(i / 3) * 0.7, PICKUP.z - 0.6 + (i % 3) * 0.6);
      dyn.add(bag);
    }
    const sg = new T.Mesh(new T.PlaneGeometry(1.4, 0.35), new T.MeshStandardMaterial({ map: TX.pickup() }));
    sg.position.set(PICKUP.x + 0.27, FLOOR_Y + 2.45, PICKUP.z);
    sg.rotation.y = Math.PI / 2;
    dyn.add(sg);
  }
  // rak pajang bonsai & keramik
  box(dyn, 0.7, 2.3, 4.0, woodM, -1.0, FLOOR_Y, -7.0);
  for (let i = 0; i < 6; i++) bonsai(kit, -0.62, -8.6 + (i % 3) * 1.5, 0.28, r, FLOOR_Y + 0.8 + Math.floor(i / 3) * 0.8);
  // meja & kursi (kayu ek, bantal abu-abu)
  for (let i = 0; i < Math.min(s.tables, TABLE_SLOTS.length); i++) {
    const [x, z] = TABLE_SLOTS[i];
    const g = new T.Group();
    box(g, 1.4, 0.05, 0.9, oak, 0, 0.72, 0);
    for (const lx of [-0.62, 0.62]) for (const lz of [-0.38, 0.38]) box(g, 0.06, 0.72, 0.06, oak, lx, 0, lz);
    for (const [ccx, ccz] of [
      [-0.35, -0.75],
      [0.35, -0.75],
      [-0.35, 0.75],
      [0.35, 0.75],
    ]) {
      const ch = new T.Group();
      box(ch, 0.44, 0.04, 0.44, oak, 0, 0.42, 0);
      box(ch, 0.4, 0.06, 0.4, cushion, 0, 0.46, 0);
      for (const sx of [-0.19, 0.19]) for (const sz of [-0.19, 0.19]) box(ch, 0.04, 0.42, 0.04, oak, sx, 0, sz);
      for (let k = 0; k < 5; k++) box(ch, 0.035, 0.45, 0.03, oak, -0.18 + k * 0.09, 0.46, 0.2);
      box(ch, 0.44, 0.05, 0.04, oak, 0, 0.9, 0.2);
      ch.position.set(ccx, 0, ccz);
      ch.rotation.y = ccz < 0 ? Math.PI : 0;
      g.add(ch);
    }
    const vase = new T.Mesh(new T.CylinderGeometry(0.04, 0.05, 0.14, 10), std('#1f2f5a', 0.4));
    vase.position.y = 0.84;
    g.add(vase);
    g.position.set(x, FLOOR_Y, z);
    g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
    dyn.add(g);
    tablePos.push(new T.Vector3(x, 0, z));
  }
  // bangku panjang berbantal di dinding kiri
  box(dyn, 0.6, 0.45, 7.4, woodM, BLD.x0 + 0.45, FLOOR_Y, -6.4);
  box(dyn, 0.55, 0.08, 7.3, cushion, BLD.x0 + 0.45, FLOOR_Y + 0.45, -6.4);
  box(dyn, 0.12, 0.6, 7.4, cushion, BLD.x0 + 0.2, FLOOR_Y + 0.5, -6.4);
  // bambu & tanaman di sudut area makan
  for (const [x, z] of [
    [-22.0, -10.2],
    [-22.0, -2.9],
    [-7.3, -3.0],
    [-7.3, -8.0],
  ])
    for (let i = 0; i < 4; i++) bamboo(kit, x + (i % 2) * 0.22, z + Math.floor(i / 2) * 0.22, 2.4 + r() * 0.6, r, FLOOR_Y);
  // lampion kertas di atas meja
  for (const z of TABLE_ROWS)
    for (const x of TABLE_COLS) {
      const l = paperLantern(x, FLOOR_Y + 2.7, z, 0.34, roofY(x) - 0.2);
      dyn.add(l);
      lanterns.push(l);
    }
  // toilet aksesibel & toilet
  for (const [x, grab] of [
    [2.1, true],
    [4.5, false],
  ] as const) {
    const bowl = new T.Mesh(new T.CylinderGeometry(0.2, 0.16, 0.42, 14), std('#f6f6f4', 0.25));
    bowl.scale.z = 1.3;
    bowl.position.set(x, FLOOR_Y + 0.21, -10.0);
    const tank = new T.Mesh(new T.BoxGeometry(0.42, 0.4, 0.18), std('#f6f6f4', 0.25));
    tank.position.set(x, FLOOR_Y + 0.6, -10.35);
    dyn.add(bowl, tank);
    if (grab)
      for (const dx of [-0.45, 0.45]) {
        const bar = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.7, 8), steel);
        bar.rotation.x = Math.PI / 2;
        bar.position.set(x + dx, FLOOR_Y + 0.75, -9.9);
        dyn.add(bar);
      }
    const sink = new T.Mesh(new T.BoxGeometry(0.5, 0.12, 0.35), std('#f6f6f4', 0.25));
    sink.position.set(x + (grab ? 0.8 : -0.7), FLOOR_Y + 0.8, -10.35);
    dyn.add(sink);
  }
  // pintu toilet bertanda
  for (const [x, kind] of [
    [2.15, 'akses'],
    [4.45, 'wc'],
  ] as const) {
    const d = new T.Mesh(new T.PlaneGeometry(1.05, 2.1), new T.MeshStandardMaterial({ map: TX.wcSign(kind), roughness: 0.6 }));
    d.position.set(x, FLOOR_Y + 1.05, ROOMS.toilet.z1 + 0.08);
    dyn.add(d);
  }
  // area cuci tangan: meja batu, wastafel batu, cermin oval, dinding kisi kayu
  {
    const zw = ROOMS.toilet.z1 + 0.45;
    box(dyn, 3.4, 0.14, 0.6, stoneTop, 3.3, FLOOR_Y + 0.8, zw);
    for (let x = 1.6; x < 5.2; x += 0.14) box(dyn, 0.08, 3.0, 0.06, timberM, x, FLOOR_Y, ROOMS.toilet.z1 + 0.12, undefined, false);
    for (const x of [2.5, 4.1]) {
      const basin = new T.Mesh(new T.SphereGeometry(0.24, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std('#b8b2a6', 0.8, { side: T.DoubleSide }));
      basin.position.set(x, FLOOR_Y + 1.1, zw);
      const tap = new T.Mesh(new T.BoxGeometry(0.04, 0.3, 0.04), steel);
      tap.position.set(x, FLOOR_Y + 1.1, zw - 0.25);
      const mirror = new T.Mesh(new T.CapsuleGeometry(0.3, 0.55, 6, 16), std('#aab8c0', 0.05, { metalness: 0.95 }));
      mirror.scale.z = 0.05;
      mirror.position.set(x, FLOOR_Y + 1.9, ROOMS.toilet.z1 + 0.2);
      const frame = new T.Mesh(new T.CapsuleGeometry(0.32, 0.55, 6, 16), std('#1a1a1a', 0.4));
      frame.scale.z = 0.03;
      frame.position.set(x, FLOOR_Y + 1.9, ROOMS.toilet.z1 + 0.18);
      dyn.add(basin, tap, frame, mirror);
    }
  }

  // satukan tanaman
  const uT = { value: 0 };
  for (const m of [
    kit.bark.empty ? null : kit.bark.build(swayMaterial(uT, { map: (plantTex.bark ??= GTX.bark()), roughness: 0.95 })),
    kit.leaf.empty ? null : kit.leaf.build(swayMaterial(uT, { map: (plantTex.leaf ??= GTX.foliageAtlas()), alphaTest: 0.5, side: T.DoubleSide, roughness: 0.8 }, true)),
    kit.plain.empty ? null : kit.plain.build(swayMaterial(uT, { roughness: 0.6 })),
  ])
    if (m) {
      m.castShadow = true;
      m.receiveShadow = true;
      late(m);
    }

  return { shell, dyn, lanterns, roof, roofMats, tablePos };
}

function groundAt(z: number) {
  return z < STEPS.z0 ? FLOOR_Y : z < (STEPS.z0 + STEPS.z1) / 2 ? 0.3 : YARD_Y;
}

/* ---------------- ornamen ---------------- */

function paperLantern(x: number, y: number, z: number, rad: number, ceil: number) {
  const g = new T.Group();
  const body = new T.Mesh(new T.SphereGeometry(rad, 18, 14), std('#fff3dc', 0.7, { emissive: '#ffd08a', emissiveIntensity: 1.1 }));
  body.scale.y = 1.25;
  const capM = std('#2a2420', 0.6);
  const top = new T.Mesh(new T.CylinderGeometry(rad * 0.45, rad * 0.45, 0.06, 14), capM);
  top.position.y = rad * 1.22;
  const bot = top.clone();
  bot.position.y = -rad * 1.22;
  const cord = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, Math.max(0.1, ceil - y), 4), capM);
  cord.position.y = (ceil - y) / 2 + rad * 1.2;
  g.add(body, top, bot, cord);
  g.position.set(x, y, z);
  return g;
}

/** Pinus bonsai: batang meliuk + bantalan daun berlapis (kartu daun bertekstur). */
function bonsai(kit: Kit, x: number, z: number, s: number, r: () => number, y = 0.15) {
  kit.bark.add(new T.CylinderGeometry(0.07 * s, 0.15 * s, 1.1 * s, 7), mat(x + 0.12 * s, y + 0.5 * s, z, 0, 0, 0.25), '#6a4a35');
  const pads: [number, number, number, number][] = [
    [0.35, 1.0, 0, 0.5],
    [-0.42, 0.72, 0.1, 0.42],
    [0.05, 1.35, -0.05, 0.38],
    [0.62, 0.66, -0.1, 0.32],
  ];
  for (const [px, py, pz, pr] of pads) {
    const bx = x + px * s,
      by = y + py * s,
      bz = z + pz * s;
    const len = Math.hypot(px, py - 0.5) * s;
    kit.bark.add(new T.CylinderGeometry(0.025 * s, 0.045 * s, len, 5), mat((x + bx) / 2, (y + 0.5 * s + by) / 2, (z + bz) / 2, 0, 0, -Math.atan2(px, py - 0.5)), '#5a4030');
    canopy(kit, new T.Vector3(bx, by, bz), new T.Vector3(pr * s, pr * s * 0.36, pr * s), Math.max(6, Math.round(22 * s)), 0.32 * s, r, -0.04, 0.002);
  }
}

/** Rumpun bambu: batang beruas + dedaunan di atas. */
function bamboo(kit: Kit, x: number, z: number, h: number, r: () => number, y = 0.15) {
  kit.plain.add(new T.CylinderGeometry(0.03, 0.042, h, 6), mat(x, y + h / 2, z, (r() - 0.5) * 0.06, 0, (r() - 0.5) * 0.06), '#8fa84a', { sway: 0.012, baseY: y });
  for (let k = 1; k < 5; k++) kit.plain.add(new T.CylinderGeometry(0.046, 0.046, 0.03, 6), mat(x, y + (h * k) / 5, z), '#6f8a36');
  canopy(kit, new T.Vector3(x, y + h * 0.78, z), new T.Vector3(0.38, h * 0.22, 0.38), 12, 0.34, r, 0.03, 0.012);
}

/** Semak berdaun rimbun. */
function shrub(kit: Kit, x: number, z: number, rad: number, r: () => number, y = 0.15) {
  canopy(kit, new T.Vector3(x, y + rad * 0.75, z), new T.Vector3(rad, rad * 0.75, rad), Math.max(14, Math.round(rad * 70)), 0.46, r, 0.01, 0.004);
}

function stoneLantern(x: number, z: number) {
  const g = new T.Group();
  const m = std('#a8a298', 0.95);
  const parts: [T.BufferGeometry, number][] = [
    [new T.CylinderGeometry(0.28, 0.34, 0.14, 6), 0.07],
    [new T.CylinderGeometry(0.09, 0.11, 0.55, 8), 0.42],
    [new T.CylinderGeometry(0.26, 0.2, 0.1, 6), 0.74],
  ];
  for (const [geo, y] of parts) {
    const p = new T.Mesh(geo, m);
    p.position.y = y;
    g.add(p);
  }
  const box = new T.Mesh(new T.BoxGeometry(0.3, 0.26, 0.3), m);
  box.position.y = 0.92;
  const glow = new T.Mesh(new T.BoxGeometry(0.16, 0.14, 0.32), std('#ffe0a0', 0.4, { emissive: '#ffc060', emissiveIntensity: 1.6 }));
  glow.position.y = 0.92;
  const cap = new T.Mesh(new T.ConeGeometry(0.34, 0.26, 6), m);
  cap.position.y = 1.18;
  g.add(box, glow, cap);
  g.position.set(x, 0.17, z);
  return g;
}
