// Lokasi proyek Rinoya Resto selama masa pembangunan. Tahapnya mengikuti kemajuan k (0…1):
// galian & besi tulangan → dinding bata naik (perancah bertingkat ikut naik) → rangka atap kayu.
// Ada pagar seng keliling dengan papan proyek (kontraktor + persen), katrol tali yang mengangkat ember adukan,
// direksi keet dengan gambar kerja & jadwal, molen yang drumnya berputar, tumpukan bata/kayu/semen yang makin habis, dan tukang berhelm yang memalu,
// mengangkut bata dengan gerobak, dan mengaduk semen. Debu mengepul saat hari berganti.

import * as T from 'three';
import { BUILD_STAGES, CONTRACTORS, stageAt } from '@/lib/resto/data';
import type { RestoState } from '@/lib/resto/sim';
import { BLD, FLOOR_Y, LOT, PLAN_ROOMS, groundY, roofY } from './layout';

const std = (c: string, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

const H = 3.4; // tinggi dinding di atas lantai
const YARD_Y_SITE = 0.15;
const BW = BLD.x1 - BLD.x0,
  BCX = (BLD.x0 + BLD.x1) / 2;

function worker(vest: string) {
  const g = new T.Group();
  const body = new T.Mesh(new T.CapsuleGeometry(0.22, 0.36, 6, 12), std(vest, 0.7));
  body.position.y = 0.72;
  const stripe = new T.Mesh(new T.CylinderGeometry(0.235, 0.235, 0.06, 14), std('#f4f4f0', 0.3, { emissive: '#888888', emissiveIntensity: 0.3 }));
  stripe.position.y = 0.78;
  const head = new T.Mesh(new T.SphereGeometry(0.19, 14, 10), std('#d9a47a', 0.6));
  head.position.y = 1.22;
  const helm = new T.Mesh(new T.SphereGeometry(0.23, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), std('#ffcc1a', 0.35));
  helm.position.y = 1.27;
  const brim = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 0.03, 16), std('#ffcc1a', 0.35));
  brim.position.y = 1.27;
  g.add(body, stripe, head, helm, brim);
  const legs: T.Object3D[] = [];
  for (const s of [-1, 1]) {
    const leg = new T.Group();
    const m = new T.Mesh(new T.CapsuleGeometry(0.075, 0.3, 3, 8), std('#3a4a6a', 0.8));
    m.position.y = -0.22;
    leg.add(m);
    leg.position.set(s * 0.1, 0.44, 0);
    g.add(leg);
    legs.push(leg);
  }
  // lengan kanan berporos di bahu (untuk memalu / menyekop)
  const arm = new T.Group();
  const am = new T.Mesh(new T.CapsuleGeometry(0.06, 0.3, 3, 8), std(vest, 0.7));
  am.position.y = -0.2;
  arm.add(am);
  arm.position.set(0.28, 0.95, 0);
  g.add(arm);
  g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  return { g, arm, legs };
}

type Job =
  | { kind: 'hammer'; g: T.Group; arm: T.Object3D; ph: number; hit: boolean; lift?: boolean }
  | { kind: 'carry'; g: T.Group; arm: T.Object3D; legs: T.Object3D[]; a: T.Vector3; b: T.Vector3; ph: number; load: T.Object3D }
  | { kind: 'mix'; g: T.Group; arm: T.Object3D; ph: number };

export interface Site {
  group: T.Group;
  update(t: number, dt: number, k: number): boolean;
  burst(): void;
}

export function buildSite(s: RestoState, keep: T.Texture[]): Site {
  const group = new T.Group();
  const add = <O extends T.Object3D>(o: O) => (group.add(o), o);
  const c = CONTRACTORS.find((x) => x.id === s.contractor);
  const days = c?.days ?? 3;
  const k0 = s.contractor ? 1 - s.buildLeft / days : 0;

  // pagar seng (hoarding) keliling dengan gerbang terbuka di depan
  const zinc = std('#dfe4e8', 0.45, { metalness: 0.5 });
  const blue = std('#2a5ab8', 0.6);
  const hoard = (w: number, x: number, z: number, ry: number) => {
    const m = new T.Mesh(new T.BoxGeometry(w, 2, 0.06), zinc);
    m.position.set(x, 1, z);
    m.rotation.y = ry;
    m.castShadow = true;
    add(m);
    const b = new T.Mesh(new T.BoxGeometry(w, 0.25, 0.07), blue);
    b.position.set(x, 1.9, z);
    b.rotation.y = ry;
    add(b);
  };
  const LW = LOT.x1 - LOT.x0,
    LD = LOT.z1 - LOT.z0;
  const gate0 = -6.2,
    gate1 = -1.8; // gerbang proyek di depan
  hoard(gate0 - LOT.x0, (LOT.x0 + gate0) / 2, LOT.z1 - 0.1, 0);
  hoard(LOT.x1 - gate1, (gate1 + LOT.x1) / 2, LOT.z1 - 0.1, 0);
  hoard(LD, LOT.x0, (LOT.z0 + LOT.z1) / 2, Math.PI / 2);
  hoard(LD, LOT.x1, (LOT.z0 + LOT.z1) / 2, Math.PI / 2);
  hoard(LW, (LOT.x0 + LOT.x1) / 2, LOT.z0, 0);
  // papan proyek
  const board = document.createElement('canvas');
  board.width = 512;
  board.height = 256;
  const g = board.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = '#2a5ab8';
  g.fillRect(0, 0, 512, 64);
  g.fillStyle = '#ffffff';
  g.font = '900 34px system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('PROYEK PEMBANGUNAN', 256, 34);
  g.fillStyle = '#1f2f5a';
  g.font = '900 40px system-ui, sans-serif';
  g.fillText((s.name || 'Rinoya Resto').toUpperCase(), 256, 100);
  g.font = '700 24px system-ui, sans-serif';
  g.fillStyle = '#444444';
  g.fillText(`Kontraktor: ${c?.name ?? '-'}`, 256, 140);
  g.fillStyle = '#e0e0e0';
  g.fillRect(40, 176, 432, 36);
  g.fillStyle = '#34a853';
  g.fillRect(40, 176, 432 * Math.max(0.03, k0), 36);
  g.fillStyle = '#1f2f5a';
  g.font = '900 24px system-ui, sans-serif';
  g.fillText(`Progres ${Math.round(k0 * 100)}%`, 256, 195);
  g.fillStyle = '#c8342a';
  g.font = '800 18px system-ui, sans-serif';
  g.fillText('⚠ Pakai helm! Area proyek', 256, 236);
  const bt = new T.CanvasTexture(board);
  bt.colorSpace = T.SRGBColorSpace;
  keep.push(bt);
  const sign = add(new T.Mesh(new T.PlaneGeometry(2.4, 1.2), new T.MeshStandardMaterial({ map: bt, roughness: 0.6 })));
  sign.position.set(-13, 1.25, LOT.z1 - 0.05);
  // besi tulangan (terlihat di awal)
  const rebar = new T.Group();
  const rodM = std('#7a4a2a', 0.6, { metalness: 0.6 });
  for (let x = BLD.x0; x <= BLD.x1; x += 0.8)
    for (const z of [BLD.z0, BLD.z1]) {
      if (z === BLD.z1 && x > -5.4 && x < -2.6) continue;
      const r = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 1.6, 5), rodM);
      r.position.set(x, FLOOR_Y + 0.8, z);
      rebar.add(r);
    }
  for (let z = BLD.z0; z <= BLD.z1; z += 0.8)
    for (const x of [BLD.x0, BLD.x1]) {
      const r = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 1.6, 5), rodM);
      r.position.set(x, FLOOR_Y + 0.8, z);
      rebar.add(r);
    }
  add(rebar);

  // perancah: tiang + papan pijakan bertingkat (tingkat muncul mengikuti tinggi dinding)
  // perancah bambu (steger bambu) seperti proyek ruko di Indonesia
  const pole = std('#c8b070', 0.75);
  const timber = () => std('#8a6a44', 0.85);
  const plankM = std('#a8804a', 0.85);
  const zs = [BLD.z0 - 0.6, BLD.z1 + 0.6];
  for (let x = BLD.x0; x <= BLD.x1 + 0.01; x += 2.5)
    for (const z of zs) {
      const ph = roofY(x) + 0.8;
      const p = new T.Mesh(new T.CylinderGeometry(0.06, 0.065, ph, 7), pole);
      p.position.set(x, ph / 2, z);
      add(p);
    }
  const levels: T.Object3D[] = [];
  for (const y of [1.1, 2.2, 3.3, 4.4].map((v) => v + FLOOR_Y))
    for (const z of zs) {
      const lv = new T.Group();
      const pl = new T.Mesh(new T.BoxGeometry(BW + 0.4, 0.06, 0.55), plankM);
      const rail = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, BW + 0.4, 5), pole);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, 0.9, z < BLD.z0 ? -0.25 : 0.25);
      lv.add(pl, rail);
      lv.position.set(BCX, y, z);
      lv.userData.y = y;
      add(lv);
      levels.push(lv);
    }
  // rangka atap kayu miring (tahap akhir): kasau melintang & gording memanjang
  const truss = new T.Group();
  const ang = Math.atan2(roofY(BLD.x1) - roofY(BLD.x0), BW);
  for (let x = BLD.x0; x <= BLD.x1 + 0.01; x += 1.4) {
    const r = new T.Mesh(new T.BoxGeometry(0.1, 0.14, BLD.z1 - BLD.z0 + 1.8), timber());
    r.position.set(x, roofY(x), (BLD.z0 + BLD.z1) / 2 + 0.6);
    truss.add(r);
  }
  for (let z = BLD.z0; z <= BLD.z1 + 1; z += 1.6) {
    const pg = new T.Mesh(new T.BoxGeometry(BW + 1, 0.1, 0.1), timber());
    pg.position.set(BCX, roofY(BCX) + 0.1, z);
    pg.rotation.z = ang;
    truss.add(pg);
  }
  truss.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  add(truss);

  // katrol tali di atas perancah depan: tukang di bawah menarik tali, ember adukan naik-turun (cara umum di proyek Indonesia)
  const gawang = new T.Group();
  gawang.position.set(-9.0, 0, BLD.z1 + 0.6);
  const gH = roofY(-9) + 1.2;
  for (const x of [-0.5, 0.5]) {
    const p = new T.Mesh(new T.CylinderGeometry(0.06, 0.07, gH, 7), pole);
    p.position.set(x, gH / 2, 0);
    gawang.add(p);
  }
  const bar = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 1.2, 7), pole);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = gH;
  const wheel = new T.Mesh(new T.TorusGeometry(0.16, 0.04, 6, 14), std('#555a60', 0.4, { metalness: 0.7 }));
  wheel.position.set(0, gH - 0.2, 0.25);
  const rope1 = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 1, 4), std('#c8b27a', 0.9));
  const rope2 = rope1.clone();
  const bucket = new T.Mesh(new T.CylinderGeometry(0.2, 0.15, 0.3, 12), std('#2a2a2a', 0.6));
  gawang.add(bar, wheel, rope1, rope2, bucket);
  gawang.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  add(gawang);

  // direksi keet (bedeng kantor proyek) dengan papan gambar kerja & jadwal di dindingnya
  const keet = new T.Group();
  keet.position.set(-18.6, 0.15, 0.6);
  const kw = new T.Mesh(new T.BoxGeometry(4, 2.4, 2.4), std('#c9b89a', 0.9));
  kw.position.y = 1.4;
  const kroof = new T.Mesh(new T.BoxGeometry(4.4, 0.08, 2.9), zinc);
  kroof.position.y = 2.65;
  kroof.rotation.x = -0.08;
  for (const [x, z] of [
    [-1.9, -1.1],
    [1.9, -1.1],
    [-1.9, 1.1],
    [1.9, 1.1],
  ]) {
    const st = new T.Mesh(new T.BoxGeometry(0.12, 0.3, 0.12), timber());
    st.position.set(x, 0.15, z);
    keet.add(st);
  }
  const kdoor = new T.Mesh(new T.PlaneGeometry(0.8, 1.8), std('#6a4a3a', 0.8));
  kdoor.position.set(1.3, 1.2, 1.21);
  const plan = document.createElement('canvas');
  plan.width = 512;
  plan.height = 256;
  const pg = plan.getContext('2d')!;
  drawBlueprint(pg, 0, 0, 300, 256);
  drawTimeline(pg, 300, 0, 212, 256, days, k0);
  const pt = new T.CanvasTexture(plan);
  pt.colorSpace = T.SRGBColorSpace;
  keep.push(pt);
  const pboard = new T.Mesh(new T.PlaneGeometry(2.2, 1.1), new T.MeshStandardMaterial({ map: pt, roughness: 0.7 }));
  pboard.position.set(-0.6, 1.5, 1.21);
  keet.add(kw, kroof, kdoor, pboard);
  keet.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  add(keet);

  // molen (mesin aduk semen) di pojok depan kanan
  const mixer = new T.Group();
  mixer.position.set(-10.6, 0.15, 1.2);
  const frame = new T.Mesh(new T.BoxGeometry(0.9, 0.5, 0.6), std('#c8342a', 0.6));
  frame.position.y = 0.45;
  const drum = new T.Group();
  const dm = new T.Mesh(new T.CylinderGeometry(0.2, 0.45, 0.9, 12, 1, true), std('#e8742a', 0.5, { side: T.DoubleSide }));
  drum.add(dm);
  const fin = new T.Mesh(new T.BoxGeometry(0.06, 0.8, 0.9), std('#b85a1a', 0.5));
  fin.rotation.x = 0.4;
  drum.add(fin);
  drum.position.set(0, 1.05, 0);
  drum.rotation.z = 0.7;
  const wheelM = std('#222222', 0.8);
  for (const z of [-0.35, 0.35]) {
    const w = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.1, 12), wheelM);
    w.rotation.x = Math.PI / 2;
    w.position.set(-0.3, 0.2, z);
    mixer.add(w);
  }
  mixer.add(frame, drum);
  mixer.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  add(mixer);

  const brickM = std('#b85a3a', 0.9);
  // tumpukan bahan: bata, papan kayu, karung semen, pasir (makin habis seiring kemajuan)
  const piles: T.Object3D[] = [];
  const pileAt = new T.Vector3(-14.2, 0, 1.6);
  for (let i = 0; i < 24; i++) {
    const b = new T.Mesh(new T.BoxGeometry(0.42, 0.2, 0.42), brickM);
    b.position.set(pileAt.x + (i % 3) * 0.44 - 0.1, 0.25 + Math.floor(i / 6) * 0.21, pileAt.z - (Math.floor(i / 3) % 2) * 0.44);
    b.castShadow = true;
    b.userData.need = i / 24;
    add(b);
    piles.push(b);
  }
  for (let i = 0; i < 8; i++) {
    const p = new T.Mesh(new T.BoxGeometry(2.4, 0.08, 0.25), plankM);
    p.position.set(-0.8, 0.2 + i * 0.09, 1.4 + (i % 2) * 0.05);
    p.castShadow = true;
    p.userData.need = i / 8;
    add(p);
    piles.push(p);
  }
  for (let i = 0; i < 6; i++) {
    const bag = new T.Mesh(new T.CapsuleGeometry(0.16, 0.35, 3, 8), std('#d8d0bc', 0.9));
    bag.rotation.z = Math.PI / 2;
    bag.position.set(2.4 + (i % 3) * 0.36, 0.32 + Math.floor(i / 3) * 0.3, 1.8);
    bag.userData.need = i / 6;
    add(bag);
    piles.push(bag);
  }
  const sand = add(new T.Mesh(new T.ConeGeometry(0.9, 0.7, 14), std('#d8b878', 1)));
  sand.position.set(5.2, 0.5, 1.0);

  // tukang
  const jobs: Job[] = [];
  const hammerAt: [number, number, number, number][] = [
    [-15, BLD.z1 - 0.7, Math.PI, 0],
    [-2, BLD.z0 + 0.7, 0, 0],
    [BLD.x0 + 0.7, -8, -Math.PI / 2, 0],
    [BLD.x1 - 0.7, -9, Math.PI / 2, 0],
    [-8, -10.9, 0, 0],
    [-11, BLD.z1 + 0.6, Math.PI, 1], // di atas perancah depan
    [-19, BLD.z0 - 0.6, 0, 1], // di atas perancah belakang
  ];
  hammerAt.forEach(([x, z, ry, lift], i) => {
    const w = worker(i % 2 ? '#ff7a1a' : '#f2d21a');
    w.g.position.set(x, 0, z);
    w.g.rotation.y = ry;
    add(w.g);
    jobs.push({ kind: 'hammer', g: w.g, arm: w.arm, ph: i * 1.3, hit: false, lift: !!lift });
  });
  for (let i = 0; i < 2; i++) {
    const w = worker('#ff7a1a');
    const load = new T.Group();
    const barrow = new T.Mesh(new T.BoxGeometry(0.5, 0.25, 0.7), std('#3a7a4a', 0.5, { metalness: 0.3 }));
    barrow.position.set(0, 0.4, 0.55);
    const bricks = new T.Mesh(new T.BoxGeometry(0.4, 0.15, 0.55), brickM);
    bricks.position.set(0, 0.58, 0.55);
    load.add(barrow, bricks);
    w.g.add(load);
    add(w.g);
    jobs.push({
      kind: 'carry',
      g: w.g,
      arm: w.arm,
      legs: w.legs,
      a: new T.Vector3(-13.6 + i * 0.6, 0, 0.6),
      b: new T.Vector3(i ? -4 : -13, 0, i ? -5.5 : -1.4),
      ph: i * 3,
      load: bricks,
    });
  }
  {
    const w = worker('#f2d21a');
    w.g.position.set(-11.6, 0, 1.2);
    w.g.rotation.y = Math.PI / 2;
    add(w.g);
    jobs.push({ kind: 'mix', g: w.g, arm: w.arm, ph: 0 });
  }

  const puller = worker('#f2d21a');
  puller.g.position.set(-9.0, YARD_Y_SITE, BLD.z1 + 0.95);
  puller.g.rotation.y = Math.PI;
  add(puller.g);

  // debu
  const dustM = new T.MeshBasicMaterial({ color: '#d8ccb4', transparent: true, opacity: 0.5, depthWrite: false });
  const dust: { m: T.Mesh; v: T.Vector3; life: number }[] = [];
  const puff = (x: number, y: number, z: number, n: number, spread = 0.4) => {
    for (let i = 0; i < n; i++) {
      const m = new T.Mesh(new T.SphereGeometry(0.15 + Math.random() * 0.2, 8, 6), dustM.clone());
      m.position.set(x + (Math.random() - 0.5) * spread, y, z + (Math.random() - 0.5) * spread);
      add(m);
      dust.push({ m, v: new T.Vector3((Math.random() - 0.5) * 0.6, 0.4 + Math.random() * 0.6, (Math.random() - 0.5) * 0.6), life: 1 });
    }
  };

  let lastHit = 0;
  return {
    group,
    burst() {
      for (let i = 0; i < 12; i++) puff(BLD.x0 + Math.random() * BW, FLOOR_Y + 0.4, BLD.z0 + Math.random() * (BLD.z1 - BLD.z0), 3, 1);
    },
    update(t, dt, k) {
      let sound = false;
      const wallTop = FLOOR_Y + H * k;
      rebar.visible = k < 0.55;
      for (const lv of levels) lv.visible = (lv.userData.y as number) < wallTop + 0.6;
      truss.visible = k > 0.6;
      truss.scale.y = T.MathUtils.clamp((k - 0.6) / 0.35, 0.05, 1);
      for (const p of piles) p.visible = (p.userData.need as number) >= k * 0.85;
      // katrol: ember naik dari tanah ke lantai kerja lalu turun lagi
      const lift = (Math.sin(t * 0.9) * 0.5 + 0.5) * (gH - 0.9);
      bucket.position.set(0, 0.15 + lift, 0.4);
      rope1.scale.y = gH - 0.2 - (0.3 + lift);
      rope1.position.set(0, (gH - 0.2 + 0.3 + lift) / 2, 0.4);
      rope2.scale.y = gH - 0.3;
      rope2.position.set(0, (gH - 0.2) / 2 + 0.05, 0.1);
      puller.arm.rotation.x = -2.6 + Math.sin(t * 1.8) * 0.5;
      drum.rotation.y += dt * 3;
      // tukang
      for (const j of jobs) {
        if (j.kind === 'hammer') {
          const p = (t * 2.2 + j.ph) % 1;
          j.arm.rotation.x = p < 0.7 ? -2.4 * (p / 0.7) : -2.4 + 2.4 * ((p - 0.7) / 0.3);
          const hit = p < 0.1;
          if (hit && !j.hit && t - lastHit > 0.45) {
            lastHit = t;
            if (Math.random() < 0.5) sound = true;
            if (Math.random() < 0.4) puff(j.g.position.x, j.g.position.y + 0.4, j.g.position.z, 1, 0.2);
          }
          j.hit = hit;
          if (j.lift) {
            const lv = T.MathUtils.clamp(Math.floor((wallTop - FLOOR_Y) / 1.1), 0, 3);
            j.g.position.y = lv > 0 ? FLOOR_Y + lv * 1.1 + 0.03 : groundY(j.g.position.x, j.g.position.z);
          } else j.g.position.y = groundY(j.g.position.x, j.g.position.z);
        } else if (j.kind === 'carry') {
          // bolak-balik: tumpukan → dinding (membawa bata) → kembali (kosong)
          const cycle = 10;
          const p = ((t + j.ph) % cycle) / cycle;
          const go = p < 0.5;
          const f = go ? p * 2 : (1 - p) * 2;
          const e = f < 0.1 ? 0 : f > 0.9 ? 1 : (f - 0.1) / 0.8;
          j.g.position.lerpVectors(j.a, j.b, e);
          j.g.position.y = groundY(j.g.position.x, j.g.position.z);
          const dir = j.b.clone().sub(j.a);
          j.g.rotation.y = Math.atan2(dir.x, dir.z) + (go ? 0 : Math.PI);
          j.load.visible = go;
          const moving = f > 0.1 && f < 0.9;
          const sw = moving ? Math.sin(t * 9) * 0.5 : 0;
          j.legs[0].rotation.x = sw;
          j.legs[1].rotation.x = -sw;
          j.arm.rotation.x = -0.6;
        } else {
          j.arm.rotation.x = -0.8 + Math.sin(t * 3) * 0.7;
        }
      }
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.life -= dt * 0.6;
        d.m.position.addScaledVector(d.v, dt);
        d.m.scale.setScalar(1 + (1 - d.life) * 2);
        (d.m.material as T.MeshBasicMaterial).opacity = Math.max(0, d.life * 0.5);
        if (d.life <= 0) {
          group.remove(d.m);
          d.m.geometry.dispose();
          (d.m.material as T.Material).dispose();
          dust.splice(i, 1);
        }
      }
      return sound;
    },
  };
}

/** Denah (gambar kerja) mengikuti denah konsep: ruang-ruang, pintu masuk, parkir. */
function drawBlueprint(g: CanvasRenderingContext2D, x0: number, y0: number, w: number, h: number) {
  g.fillStyle = '#1f4f9a';
  g.fillRect(x0, y0, w, h);
  g.strokeStyle = 'rgba(255,255,255,.12)';
  g.lineWidth = 1;
  g.beginPath();
  for (let x = x0; x < x0 + w; x += 16) {
    g.moveTo(x, y0);
    g.lineTo(x, y0 + h);
  }
  for (let y = y0; y < y0 + h; y += 16) {
    g.moveTo(x0, y);
    g.lineTo(x0 + w, y);
  }
  g.stroke();
  g.fillStyle = '#ffffff';
  g.font = '800 15px system-ui';
  g.textAlign = 'left';
  g.fillText('GAMBAR KERJA — DENAH', x0 + 10, y0 + 20);
  const k = (w - 20) / 31;
  const X = (x: number) => x0 + 10 + (x + 23.8) * k,
    Z = (z: number) => y0 + 34 + (z + 16.2) * k;
  g.strokeStyle = '#ffffff';
  g.lineWidth = 1.5;
  g.textAlign = 'center';
  for (const [name, a0, a1, b0, b1] of PLAN_ROOMS) {
    g.strokeRect(X(a0), Z(b0), (a1 - a0) * k, (b1 - b0) * k);
    g.font = `700 ${name.length > 8 ? 7 : 8}px system-ui`;
    g.fillText(name, X((a0 + a1) / 2), Z((b0 + b1) / 2) + 3);
  }
  g.font = '700 9px system-ui';
  g.fillText('28 m', X(-8.4), Z(-14.4) - 4);
}

/** Jadwal (timeline) pembangunan: tahap per hari dengan tanda selesai. */
function drawTimeline(g: CanvasRenderingContext2D, x0: number, y0: number, w: number, h: number, days: number, k: number) {
  g.fillStyle = '#fbf7ee';
  g.fillRect(x0, y0, w, h);
  g.fillStyle = '#1f2f5a';
  g.font = '800 16px system-ui';
  g.textAlign = 'left';
  g.fillText(`JADWAL (${days} hari)`, x0 + 12, y0 + 22);
  const cur = stageAt(k);
  BUILD_STAGES.forEach((st, i) => {
    const y = y0 + 48 + i * 50;
    const done = i < cur || k >= 1;
    g.fillStyle = done ? '#34a853' : i === cur ? '#f2a21a' : '#cccccc';
    g.beginPath();
    g.arc(x0 + 22, y, 9, 0, Math.PI * 2);
    g.fill();
    if (i < BUILD_STAGES.length - 1) {
      g.fillStyle = '#cccccc';
      g.fillRect(x0 + 20, y + 10, 4, 30);
    }
    g.fillStyle = '#1f2f5a';
    g.font = `${i === cur ? 800 : 600} 14px system-ui`;
    g.fillText(st, x0 + 38, y + 5);
  });
}
