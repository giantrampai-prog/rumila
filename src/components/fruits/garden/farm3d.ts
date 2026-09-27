// Tampilan 3D permainan Kebun Buah: 6 bedengan "Kebun Saya" dengan tahap tumbuh (biji → tunas → tanaman
// kecil → berbunga → berbuah, memakai model buah asli), ikon status (haus / tumbuh / siap panen), lebah di
// bunga, siraman air, dan Pak Tani pemberi misi di alun-alun.

import * as T from 'three';
import { FRUIT_BY_ID } from '@/lib/fruits/catalog';
import { BED_COUNT } from '@/lib/fruits/farm';
import { plantKind, type PlantKind } from '@/lib/fruits/garden';
import { createFruitModel } from '@/lib/fruits/models';
import { Merge, buildPlant, type Kit } from './build';
import { anchorFor, fruitSize } from './fruits';

export interface PlantMats {
  bark: T.Material;
  leaf: T.Material;
  plain: T.Material;
}

const LOW = new Set<PlantKind>(['vine', 'pineapple', 'bush']);
/** Skala tanaman asli (seperti di kebun) per tahap: 2 tanaman muda, 3 berbunga, 4 berbuah. */
const SCALE_TALL = [0, 0, 0.3, 0.46, 0.58];
const SCALE_LOW = [0, 0, 0.55, 0.8, 0.95];
const seedOf = (id: string) => [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 9973;

export const BED_POS: [number, number][] = Array.from({ length: BED_COUNT }, (_, i) => [7.5 + (i % 3) * 3.6, 8.6 + Math.floor(i / 3) * 3.8]);
export const NPC_POS: [number, number] = [3.1, -3.0];

export interface BedView {
  fruit: string | null;
  stage: number;
  thirsty: boolean;
  growing: boolean;
  ripe: boolean;
  progress: number;
}

const std = (c: T.ColorRepresentation, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

function canvasTex(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return { c, g: c.getContext('2d')!, t };
}

/** Ikon status bedengan (digambar ulang saat berubah). */
function drawStatus(g: CanvasRenderingContext2D, v: BedView | null) {
  g.clearRect(0, 0, 128, 150);
  if (!v || (!v.fruit && v !== null && false)) return;
  const bubble = (fill: string) => {
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath();
    g.arc(66, 66, 56, 0, 7);
    g.fill();
    g.fillStyle = fill;
    g.beginPath();
    g.arc(64, 62, 56, 0, 7);
    g.fill();
    g.beginPath();
    g.moveTo(50, 110);
    g.lineTo(64, 144);
    g.lineTo(78, 110);
    g.fill();
  };
  if (!v?.fruit) {
    // bedengan kosong: tanda tambah (ajak menanam)
    bubble('#ffffff');
    g.strokeStyle = '#1fbf62';
    g.lineWidth = 12;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(64, 38);
    g.lineTo(64, 86);
    g.moveTo(40, 62);
    g.lineTo(88, 62);
    g.stroke();
    return;
  }
  if (v.ripe) {
    bubble('#ffbe0b');
    g.fillStyle = '#fff';
    g.font = '900 64px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('★', 64, 66);
    return;
  }
  if (v.thirsty) {
    bubble('#ffffff');
    // tetes air
    g.fillStyle = '#2f86ff';
    g.beginPath();
    g.moveTo(64, 28);
    g.bezierCurveTo(92, 64, 92, 92, 64, 94);
    g.bezierCurveTo(36, 92, 36, 64, 64, 28);
    g.fill();
    return;
  }
  // sedang tumbuh: cincin progres hijau
  bubble('#ffffff');
  g.strokeStyle = '#e6efe0';
  g.lineWidth = 12;
  g.beginPath();
  g.arc(64, 62, 36, 0, 7);
  g.stroke();
  g.strokeStyle = '#1fbf62';
  g.beginPath();
  g.arc(64, 62, 36, -Math.PI / 2, -Math.PI / 2 + v.progress * Math.PI * 2);
  g.stroke();
  g.fillStyle = '#1b9e55';
  g.beginPath();
  g.ellipse(58, 66, 8, 14, -0.6, 0, 7);
  g.ellipse(72, 62, 8, 14, 0.6, 0, 7);
  g.fill();
}

/** Tokoh petani sederhana (berbaju hijau, bercaping) untuk Pak Tani. */
function farmer() {
  const g = new T.Group();
  const skin = std('#d9a47a', 0.6),
    shirt = std('#2f9e5a', 0.7),
    pants = std('#5b4636', 0.8),
    hat = std('#dcc07a', 0.9),
    dark = std('#1d1d1d', 0.3);
  for (const x of [-0.14, 0.14]) {
    const l = new T.Mesh(new T.CapsuleGeometry(0.1, 0.42, 6, 12), pants);
    l.position.set(x, 0.33, 0);
    g.add(l);
  }
  const body = new T.Mesh(new T.CapsuleGeometry(0.28, 0.4, 8, 16), shirt);
  body.position.y = 1.0;
  const head = new T.Mesh(new T.SphereGeometry(0.3, 20, 14), skin);
  head.position.y = 1.62;
  const brim = new T.Mesh(new T.ConeGeometry(0.72, 0.3, 24, 1, true), hat);
  brim.material.side = T.DoubleSide;
  brim.position.y = 1.95;
  const mous = new T.Mesh(new T.CapsuleGeometry(0.03, 0.14, 4, 8), std('#3b2a1e'));
  mous.rotation.z = Math.PI / 2;
  mous.position.set(0, 1.55, 0.28);
  g.add(body, head, brim, mous);
  for (const x of [-0.11, 0.11]) {
    const e = new T.Mesh(new T.SphereGeometry(0.04, 10, 8), dark);
    e.position.set(x, 1.66, 0.26);
    g.add(e);
  }
  const arms: T.Group[] = [];
  for (const x of [-0.34, 0.34]) {
    const a = new T.Group();
    a.position.set(x, 1.2, 0);
    const m = new T.Mesh(new T.CapsuleGeometry(0.08, 0.34, 6, 10), shirt);
    m.position.y = -0.2;
    const h = new T.Mesh(new T.SphereGeometry(0.09, 10, 8), skin);
    h.position.y = -0.44;
    a.add(m, h);
    g.add(a);
    arms.push(a);
  }
  // cangkul di tangan kanan
  const hoe = new T.Group();
  const stick = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 1.5, 6), std('#8a5a34'));
  const blade = new T.Mesh(new T.BoxGeometry(0.28, 0.2, 0.03), std('#9aa0a8', 0.4, { metalness: 0.6 }));
  blade.position.set(0.1, -0.72, 0);
  hoe.add(stick, blade);
  hoe.position.set(0.5, 0.9, 0.1);
  hoe.rotation.z = 0.1;
  g.add(hoe);
  g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  g.scale.setScalar(1.1);
  g.userData.arms = arms;
  return g;
}

export class Farm {
  group = new T.Group();
  npc: T.Group;
  private npcBubble: T.Sprite;
  private slots: { root: T.Group; plant: T.Group; status: { c: HTMLCanvasElement; g: CanvasRenderingContext2D; t: T.CanvasTexture }; sprite: T.Sprite; key: string; bees: T.Group[]; top: number }[] = [];
  private fruitProto = new Map<string, T.Object3D>();
  private drops: { p: T.Points; t: number; x: number; z: number }[] = [];
  private beeMat = std('#ffcc1a', 0.5);
  private leaf = std('#4f9a3a', 0.7);
  private leaf2 = std('#66b24a', 0.7);
  private stem = std('#5f8a3a', 0.7);

  constructor(
    qTex: T.Texture,
    private mats: PlantMats,
  ) {
    const wood = std('#8a5a34', 0.9),
      soil = std('#5c3a22', 1);
    BED_POS.forEach(([x, z]) => {
      const root = new T.Group();
      root.position.set(x, 0, z);
      const bed = new T.Mesh(new T.BoxGeometry(2.3, 0.22, 2.3), soil);
      bed.position.y = 0.11;
      bed.receiveShadow = true;
      root.add(bed);
      for (const [dx, dz, w, d] of [
        [0, 1.2, 2.5, 0.12],
        [0, -1.2, 2.5, 0.12],
        [1.2, 0, 0.12, 2.5],
        [-1.2, 0, 0.12, 2.5],
      ]) {
        const b = new T.Mesh(new T.BoxGeometry(w, 0.3, d), wood);
        b.position.set(dx, 0.15, dz);
        b.castShadow = true;
        root.add(b);
      }
      // alur tanah
      for (let k = -1; k <= 1; k++) {
        const f = new T.Mesh(new T.BoxGeometry(2.1, 0.04, 0.14), std('#4a2e1a', 1));
        f.position.set(0, 0.235, k * 0.6);
        root.add(f);
      }
      const plant = new T.Group();
      plant.position.y = 0.22;
      root.add(plant);
      const status = canvasTex(128, 150);
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: status.t, depthWrite: false, fog: false, transparent: true }));
      sprite.scale.set(0.9, 1.05, 1);
      sprite.position.y = 2.4;
      sprite.renderOrder = 5;
      root.add(sprite);
      this.group.add(root);
      this.slots.push({ root, plant, status, sprite, key: '', bees: [], top: 1 });
      drawStatus(status.g, null);
      status.t.needsUpdate = true;
    });
    // papan "Kebun Saya"
    const signC = canvasTex(512, 160);
    const sg = signC.g;
    sg.fillStyle = '#7a5334';
    sg.beginPath();
    sg.roundRect(4, 4, 504, 152, 26);
    sg.fill();
    sg.fillStyle = '#1fbf62';
    sg.beginPath();
    sg.roundRect(26, 26, 460, 108, 18);
    sg.fill();
    sg.fillStyle = '#fff';
    sg.font = '800 60px system-ui, sans-serif';
    sg.textAlign = 'center';
    sg.textBaseline = 'middle';
    sg.fillText('Kebun Saya', 256, 82);
    signC.t.needsUpdate = true;
    const sign = new T.Group();
    for (const o of [-1.1, 1.1]) {
      const post = new T.Mesh(new T.BoxGeometry(0.14, 2.1, 0.14), wood);
      post.position.set(o, 1.05, 0);
      sign.add(post);
    }
    const board = new T.Mesh(new T.PlaneGeometry(2.9, 0.9), new T.MeshStandardMaterial({ map: signC.t, roughness: 0.9 }));
    board.position.set(0, 1.9, 0.08);
    sign.add(board);
    sign.position.set(11, 0, 6.2);
    this.group.add(sign);

    // Pak Tani
    this.npc = farmer();
    this.npc.position.set(NPC_POS[0], 0, NPC_POS[1]);
    this.npc.rotation.y = 0.3;
    this.group.add(this.npc);
    this.npcBubble = new T.Sprite(new T.SpriteMaterial({ map: qTex, depthWrite: false, fog: false, transparent: true, color: '#ffffff' }));
    this.npcBubble.scale.set(0.9, 1.05, 1);
    this.npcBubble.position.set(NPC_POS[0], 3.1, NPC_POS[1]);
    this.npcBubble.renderOrder = 5;
    this.group.add(this.npcBubble);
  }

  /** Tanda "!" di atas Pak Tani bila ada misi yang bisa diambil. */
  setNpcBubble(tex: T.Texture | null) {
    this.npcBubble.visible = !!tex;
    if (tex) {
      this.npcBubble.material.map = tex;
      this.npcBubble.material.needsUpdate = true;
    }
  }

  private proto(id: string) {
    let p = this.fruitProto.get(id);
    if (!p) {
      const f = FRUIT_BY_ID.get(id)!;
      p = createFruitModel(f, 'lite');
      const box = new T.Box3().setFromObject(p);
      p.userData.top = box.max.y;
      p.userData.k = Math.min(fruitSize(f), 0.42) / 2.6;
      this.fruitProto.set(id, p);
    }
    return p;
  }

  /** Bangun ulang tanaman di bedengan bila tahap/jenis berubah; perbarui ikon status. */
  setBeds(views: BedView[]) {
    views.forEach((v, i) => {
      const s = this.slots[i];
      const key = `${v.fruit}:${v.stage}`;
      if (key !== s.key) {
        s.key = key;
        // geometri tanaman milik bedengan ini dibuang; model buah & material dipakai bersama
        s.plant.traverse((o) => (o.userData.own ? (o as T.Mesh).geometry.dispose() : null));
        s.plant.clear();
        s.plant.rotation.set(0, 0, 0);
        s.plant.userData.bend = 0;
        s.bees.forEach((b) => s.root.remove(b));
        s.bees = [];
        if (v.fruit) this.buildStage(s.plant, v.fruit, v.stage, s);
      }
      drawStatus(s.status.g, v);
      s.status.t.needsUpdate = true;
      s.sprite.position.y = v.fruit ? (v.stage < 2 ? [1.1, 1.3][v.stage] : s.top + 0.75) : 1.4;
    });
  }

  private buildStage(g: T.Group, fruitId: string, stage: number, slot: (typeof this.slots)[number]) {
    const add = (m: T.Mesh) => {
      m.castShadow = true;
      g.add(m);
      return m;
    };
    if (stage === 0) {
      const mound = add(new T.Mesh(new T.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), std('#6b4a31', 1)));
      mound.scale.y = 0.45;
      const seed = add(new T.Mesh(new T.SphereGeometry(0.06, 10, 8), std('#c8a06a', 0.6)));
      seed.position.y = 0.12;
      seed.scale.set(1, 0.7, 1.3);
      return;
    }
    if (stage === 1) {
      const h = 0.35;
      const stem = add(new T.Mesh(new T.CylinderGeometry(0.042, 0.065, h, 8), this.stem));
      stem.position.y = h / 2;
      for (const s of [-1, 1]) {
        const l = add(new T.Mesh(new T.SphereGeometry(0.16, 12, 8), this.leaf2));
        l.scale.set(1, 0.18, 0.55);
        l.position.set(s * 0.14, h, 0);
        l.rotation.z = s * 0.4;
      }
      g.userData.bend = 0.12;
      return;
    }
    // tahap 2–4: tanaman ASLI sesuai jenis buah (sama seperti di kebun), makin besar tiap tahap
    const f = FRUIT_BY_ID.get(fruitId)!;
    const kind = plantKind(f);
    const sc = (LOW.has(kind) ? SCALE_LOW : SCALE_TALL)[stage];
    const kit: Kit = { bark: new Merge(), leaf: new Merge(), plain: new Merge() };
    const res = buildPlant(kit, { fruit: f, kind, zone: f.group, x: 0, z: 0, reach: 1 }, seedOf(fruitId), false);
    const plant = new T.Group();
    plant.scale.setScalar(sc);
    for (const [m, mt] of [
      [kit.bark, this.mats.bark],
      [kit.leaf, this.mats.leaf],
      [kit.plain, this.mats.plain],
    ] as const) {
      if (m.empty) continue;
      const mesh = m.build(mt);
      mesh.castShadow = true;
      mesh.userData.own = true;
      plant.add(mesh);
    }
    g.add(plant);
    slot.top = res.top * sc;
    g.userData.bend = LOW.has(kind) ? 0.05 : 0.035;
    const spots = res.spots.slice(0, stage === 4 ? 7 : 9);
    if (stage === 3) {
      // bunga di tempat buah nanti tumbuh + lebah
      const petal = std('#ffffff', 0.5),
        mid = std('#ffd23f', 0.5),
        pink = std('#ffb3cf', 0.5);
      spots.forEach((sp, k) => {
        const fl = new T.Group();
        for (let p = 0; p < 5; p++) {
          const pe = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), k % 3 ? petal : pink);
          pe.scale.set(1, 0.35, 0.6);
          pe.position.set(Math.cos((p / 5) * Math.PI * 2) * 0.06, 0, Math.sin((p / 5) * Math.PI * 2) * 0.06);
          fl.add(pe);
        }
        fl.add(new T.Mesh(new T.SphereGeometry(0.035, 8, 6), mid));
        fl.position.copy(sp.p).multiplyScalar(sc);
        fl.scale.setScalar(1.3);
        g.add(fl);
      });
      const R = Math.max(0.5, slot.top * 0.35);
      for (let k = 0; k < 2; k++) {
        const bee = new T.Group();
        const body = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), this.beeMat);
        body.scale.set(1.4, 1, 1);
        const stripe = new T.Mesh(new T.TorusGeometry(0.055, 0.012, 6, 12), std('#1d1d1d'));
        stripe.rotation.y = Math.PI / 2;
        const wings: T.Mesh[] = [];
        for (const s of [-1, 1]) {
          const w = new T.Mesh(new T.CircleGeometry(0.05, 10), new T.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.7, side: T.DoubleSide }));
          w.position.set(0, 0.05, s * 0.04);
          w.rotation.x = -Math.PI / 2;
          bee.add(w);
          wings.push(w);
        }
        bee.add(body, stripe);
        bee.userData = { wings, ph: k * Math.PI, r: R + 0.3, h: slot.top * 0.7 + 0.2 };
        slot.root.add(bee);
        slot.bees.push(bee);
      }
    }
    if (stage === 4) {
      // buah asli menggantung/tergeletak di titik buah tanaman itu (dibesarkan sedikit agar jelas di bedengan)
      const p = this.proto(fruitId);
      const box = new T.Box3().setFromObject(p);
      const anchor = anchorFor(kind, f);
      const shiftY = anchor === 'hang' ? -box.max.y : anchor === 'ground' ? -box.min.y : 0;
      const k = (fruitSize(f) / 2.6) * 1.35;
      for (const sp of spots) {
        const pivot = new T.Group();
        pivot.position.copy(sp.p);
        pivot.quaternion.copy(sp.q);
        pivot.scale.setScalar(k * (sp.s ?? 1));
        const c = p.clone();
        c.position.y = shiftY;
        c.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
        pivot.add(c);
        plant.add(pivot);
      }
    }
  }

  /** Siraman: tetes air jatuh dari atas bedengan. */
  water(i: number) {
    const [x, z] = BED_POS[i];
    const n = 70;
    const pos = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) pos.set([x + (Math.random() - 0.5) * 1.6, 2.2 + Math.random() * 1.2, z + (Math.random() - 0.5) * 1.6], k * 3);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    const p = new T.Points(g, new T.PointsMaterial({ color: '#7cc4ff', size: 0.09, transparent: true, opacity: 0.9, depthWrite: false }));
    this.group.add(p);
    this.drops.push({ p, t: 0, x, z });
  }

  bedWorld(i: number) {
    const [x, z] = BED_POS[i];
    return new T.Vector3(x, 1.2, z);
  }

  update(t: number, dt: number) {
    // seluruh tanaman di bedengan bergoyang pelan tertiup angin (daunnya juga bergoyang lewat material)
    this.slots.forEach((s, i) => {
      const b = (s.plant.userData.bend as number) ?? 0;
      s.plant.rotation.z = Math.sin(t * 1.3 + i * 1.7) * b;
      s.plant.rotation.x = Math.cos(t * 1.05 + i * 2.3) * b * 0.6;
    });
    for (const s of this.slots)
      for (const b of s.bees) {
        const u = b.userData as { wings: T.Mesh[]; ph: number; r: number; h: number };
        const a = t * 1.6 + u.ph;
        b.position.set(Math.cos(a) * u.r, u.h + Math.sin(t * 3 + u.ph) * 0.15, Math.sin(a) * u.r);
        b.rotation.y = -a;
        const f = Math.sin(t * 60) * 0.6;
        u.wings[0].rotation.y = f;
        u.wings[1].rotation.y = -f;
      }
    this.drops = this.drops.filter((d) => {
      d.t += dt;
      const pa = d.p.geometry.attributes.position as T.BufferAttribute;
      for (let k = 0; k < pa.count; k++) {
        let y = pa.getY(k) - dt * 5;
        if (y < 0.25) y = 2.2 + Math.random() * 0.4;
        pa.setY(k, y);
      }
      pa.needsUpdate = true;
      (d.p.material as T.PointsMaterial).opacity = Math.max(0, 0.9 - Math.max(0, d.t - 1.2) * 1.5);
      if (d.t > 1.9) {
        this.group.remove(d.p);
        d.p.geometry.dispose();
        (d.p.material as T.Material).dispose();
        return false;
      }
      return true;
    });
    const arms = this.npc.userData.arms as T.Group[];
    arms[0].rotation.z = -0.1 + Math.sin(t * 2) * 0.05;
    this.npc.position.y = Math.sin(t * 2) * 0.01;
    this.npcBubble.position.y = 3.1 + Math.sin(t * 2.4) * 0.12;
  }
}
