// Kehidupan di Kebun Buah: kawanan burung yang terbang berputar & sesekali meluncur, ayam yang berjalan
// sambil mematuk, capung di sekitar sumur, dan daun yang berguguran pelan di sekitar anak.

import * as T from 'three';
import { rnd } from './build';

interface Bird {
  g: T.Group;
  wl: T.Object3D;
  wr: T.Object3D;
  ph: number;
  r: number;
  h: number;
  sp: number;
  c: T.Vector2;
}

interface Chicken {
  g: T.Group;
  head: T.Object3D;
  legs: T.Object3D[];
  target: T.Vector2;
  wait: number;
  peck: number;
}

interface Fly {
  g: T.Group;
  wings: T.Object3D[];
  c: T.Vector3;
  ph: number;
  hover: number;
  pos: T.Vector3;
  to: T.Vector3;
}

const std = (c: string, rough = 0.8) => new T.MeshStandardMaterial({ color: c, roughness: rough });

function bird(dark: T.Material, light: T.Material) {
  const g = new T.Group();
  const body = new T.Mesh(new T.SphereGeometry(0.12, 10, 8), dark);
  body.scale.set(0.8, 0.7, 1.9);
  const head = new T.Mesh(new T.SphereGeometry(0.075, 10, 8), dark);
  head.position.set(0, 0.04, 0.22);
  const beak = new T.Mesh(new T.ConeGeometry(0.025, 0.08, 6), light);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.03, 0.31);
  const tail = new T.Mesh(new T.ConeGeometry(0.07, 0.2, 4), dark);
  tail.rotation.x = -Math.PI / 2;
  tail.scale.set(1, 1, 0.25);
  tail.position.set(0, 0, -0.27);
  g.add(body, head, beak, tail);
  const wingShape = new T.Shape();
  wingShape.moveTo(0, 0.07);
  wingShape.quadraticCurveTo(0.25, 0.1, 0.46, -0.02);
  wingShape.quadraticCurveTo(0.25, -0.06, 0, -0.08);
  const wg = new T.ShapeGeometry(wingShape, 6);
  wg.rotateX(-Math.PI / 2);
  const mk = (s: number) => {
    const piv = new T.Group();
    const w = new T.Mesh(wg, new T.MeshStandardMaterial({ color: '#3a3430', roughness: 0.8, side: T.DoubleSide }));
    w.scale.x = s;
    piv.add(w);
    piv.position.set(s * 0.05, 0.03, 0.02);
    g.add(piv);
    return piv;
  };
  return { g, wl: mk(-1), wr: mk(1) };
}

function chicken(white: boolean) {
  const g = new T.Group();
  const feather = std(white ? '#f4efe6' : '#b86a2c', 0.9);
  const red = std('#d7261e', 0.6);
  const yellow = std('#f0b020', 0.6);
  const body = new T.Mesh(new T.SphereGeometry(0.2, 14, 10), feather);
  body.scale.set(0.85, 0.85, 1.15);
  body.position.y = 0.3;
  const tail = new T.Mesh(new T.ConeGeometry(0.12, 0.22, 8), white ? feather : std('#2a2622', 0.8));
  tail.position.set(0, 0.42, -0.2);
  tail.rotation.x = -0.9;
  g.add(body, tail);
  for (const s of [-1, 1]) {
    const wing = new T.Mesh(new T.SphereGeometry(0.12, 10, 8), feather);
    wing.scale.set(0.35, 0.7, 1);
    wing.position.set(s * 0.16, 0.32, -0.02);
    g.add(wing);
  }
  const head = new T.Group();
  head.position.set(0, 0.46, 0.17);
  const skull = new T.Mesh(new T.SphereGeometry(0.1, 12, 10), feather);
  const comb = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), red);
  comb.scale.set(0.5, 1, 1.4);
  comb.position.set(0, 0.1, 0.01);
  const wattle = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), red);
  wattle.position.set(0, -0.07, 0.07);
  const beak = new T.Mesh(new T.ConeGeometry(0.03, 0.08, 6), yellow);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, -0.01, 0.12);
  head.add(skull, comb, wattle, beak);
  for (const s of [-1, 1]) {
    const eye = new T.Mesh(new T.SphereGeometry(0.015, 6, 6), std('#111111', 0.3));
    eye.position.set(s * 0.06, 0.02, 0.07);
    head.add(eye);
  }
  g.add(head);
  const legs: T.Object3D[] = [];
  for (const s of [-1, 1]) {
    const leg = new T.Group();
    const shin = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.14), yellow);
    shin.position.y = -0.07;
    const foot = new T.Mesh(new T.BoxGeometry(0.06, 0.01, 0.07), yellow);
    foot.position.set(0, -0.14, 0.02);
    leg.add(shin, foot);
    leg.position.set(s * 0.07, 0.15, 0);
    g.add(leg);
    legs.push(leg);
  }
  g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  g.scale.setScalar(1.2);
  return { g, head, legs };
}

function dragonfly() {
  const g = new T.Group();
  const body = new T.Mesh(new T.CylinderGeometry(0.012, 0.006, 0.26, 6), std('#1f8aa8', 0.3));
  body.rotation.x = Math.PI / 2;
  const head = new T.Mesh(new T.SphereGeometry(0.025, 8, 6), std('#1b5f78', 0.3));
  head.position.z = 0.14;
  g.add(body, head);
  const wm = new T.MeshStandardMaterial({ color: '#e8f6ff', transparent: true, opacity: 0.45, side: T.DoubleSide, roughness: 0.2 });
  const wings: T.Object3D[] = [];
  for (const z of [0.05, 0.0])
    for (const s of [-1, 1]) {
      const piv = new T.Group();
      const w = new T.Mesh(new T.PlaneGeometry(0.16, 0.035), wm);
      w.position.x = s * 0.08;
      w.rotation.x = -Math.PI / 2;
      piv.add(w);
      piv.position.z = z;
      g.add(piv);
      wings.push(piv);
    }
  return { g, wings };
}

export class GardenLife {
  group = new T.Group();
  private birds: Bird[] = [];
  private chickens: Chicken[] = [];
  private flies: Fly[] = [];
  private leaves: T.InstancedMesh;
  private leafData: { p: T.Vector3; v: T.Vector3; rot: T.Euler; spin: T.Vector3 }[] = [];
  private m = new T.Matrix4();
  private q = new T.Quaternion();

  constructor(
    private coop: T.Vector2,
    well: T.Vector3,
    private blocked: (x: number, z: number) => boolean,
  ) {
    const r = rnd(808);
    // kawanan burung
    const dark = std('#3b332d', 0.8),
      light = std('#e0a640', 0.5);
    for (let f = 0; f < 3; f++) {
      const c = new T.Vector2((r() - 0.5) * 50, (r() - 0.5) * 50);
      for (let i = 0; i < 6; i++) {
        const b = bird(dark, light);
        b.g.scale.setScalar(1.3);
        this.group.add(b.g);
        this.birds.push({ ...b, ph: f * 2 + i * 0.16, r: 14 + f * 6 + (r() - 0.5) * 2, h: 11 + f * 3 + r() * 2, sp: (0.12 + f * 0.03) * (f % 2 ? -1 : 1), c });
      }
    }
    // ayam di dekat kandang
    for (let i = 0; i < 5; i++) {
      const ck = chicken(i % 2 === 0);
      ck.g.position.set(coop.x + (r() - 0.5) * 3, 0, coop.y + (r() - 0.5) * 3);
      this.group.add(ck.g);
      this.chickens.push({ ...ck, target: new T.Vector2(ck.g.position.x, ck.g.position.z), wait: r() * 3, peck: 0 });
    }
    // capung di sekitar sumur
    for (let i = 0; i < 3; i++) {
      const d = dragonfly();
      this.group.add(d.g);
      const c = well.clone().add(new T.Vector3(0, 1.2, 0));
      this.flies.push({ ...d, c, ph: r() * 6, hover: 0, pos: c.clone(), to: c.clone() });
    }
    // daun berguguran
    const lg = new T.PlaneGeometry(0.16, 0.1);
    lg.translate(0, 0, 0);
    this.leaves = new T.InstancedMesh(lg, new T.MeshStandardMaterial({ color: '#b0a040', side: T.DoubleSide, roughness: 0.8 }), 70);
    const col = new T.Color();
    for (let i = 0; i < 70; i++) {
      this.leafData.push({ p: new T.Vector3(0, -10, 0), v: new T.Vector3(), rot: new T.Euler(r() * 6, r() * 6, r() * 6), spin: new T.Vector3(r() * 3, r() * 3, r() * 3) });
      this.leaves.setColorAt(i, col.setHSL(0.12 + r() * 0.12, 0.6, 0.35 + r() * 0.2));
    }
    this.leaves.frustumCulled = false;
    this.group.add(this.leaves);
  }

  update(t: number, dt: number, around: T.Vector3) {
    // burung: terbang berputar, sesekali meluncur (sayap terbentang)
    for (const b of this.birds) {
      const a = t * b.sp + b.ph;
      const x = b.c.x + Math.cos(a) * b.r,
        z = b.c.y + Math.sin(a) * b.r;
      b.g.position.set(x, b.h + Math.sin(t * 0.7 + b.ph) * 1.2, z);
      b.g.rotation.set(0, -a + (b.sp > 0 ? Math.PI : 0), (b.sp > 0 ? -1 : 1) * 0.25);
      const glide = Math.sin(t * 0.4 + b.ph) > 0.3;
      const f = glide ? 0.05 + Math.sin(t * 2 + b.ph) * 0.05 : Math.sin(t * 13 + b.ph * 5) * 0.7;
      b.wl.rotation.z = f;
      b.wr.rotation.z = -f;
    }
    // ayam: jalan ke titik acak di dekat kandang, berhenti & mematuk
    for (const c of this.chickens) {
      const p = c.g.position;
      const d = Math.hypot(c.target.x - p.x, c.target.y - p.z);
      if (c.wait > 0) {
        c.wait -= dt;
        c.peck += dt;
        c.head.rotation.x = Math.max(0, Math.sin(c.peck * 9)) * 0.9;
        c.legs.forEach((l) => (l.rotation.x = 0));
        if (c.wait <= 0) {
          for (let k = 0; k < 6; k++) {
            const nx = this.coop.x + (Math.random() - 0.5) * 7,
              nz = this.coop.y + (Math.random() - 0.5) * 7;
            if (!this.blocked(nx, nz)) {
              c.target.set(nx, nz);
              break;
            }
          }
        }
      } else if (d < 0.1) {
        c.wait = 1.5 + Math.random() * 3;
        c.peck = 0;
      } else {
        const sp = 0.7;
        const dx = (c.target.x - p.x) / d,
          dz = (c.target.y - p.z) / d;
        p.x += dx * sp * dt;
        p.z += dz * sp * dt;
        const want = Math.atan2(dx, dz);
        let dh = want - c.g.rotation.y;
        dh = Math.atan2(Math.sin(dh), Math.cos(dh));
        c.g.rotation.y += dh * Math.min(1, dt * 6);
        const s = Math.sin(t * 14 + p.x);
        c.legs[0].rotation.x = s * 0.6;
        c.legs[1].rotation.x = -s * 0.6;
        c.head.rotation.x = Math.sin(t * 14) * 0.15;
        p.y = Math.abs(s) * 0.02;
      }
    }
    // capung: melesat pendek lalu diam melayang
    for (const f of this.flies) {
      f.hover -= dt;
      if (f.hover <= 0) {
        f.to.set(f.c.x + (Math.random() - 0.5) * 5, f.c.y + (Math.random() - 0.3) * 1.2, f.c.z + (Math.random() - 0.5) * 5);
        f.hover = 0.8 + Math.random() * 1.8;
      }
      const prev = f.pos.clone();
      f.pos.lerp(f.to, 1 - Math.exp(-dt * 4));
      f.g.position.copy(f.pos);
      const v = f.pos.clone().sub(prev);
      if (v.lengthSq() > 1e-6) f.g.rotation.y = Math.atan2(v.x, v.z);
      f.wings.forEach((w, i) => (w.rotation.z = Math.sin(t * 60 + i) * 0.5));
    }
    // daun: jatuh berputar di sekitar anak, lalu muncul lagi di atas
    for (let i = 0; i < this.leafData.length; i++) {
      const L = this.leafData[i];
      if (L.p.y < 0.05) {
        if (L.p.y > -5) L.p.y -= dt * 0.02; // sebentar tergeletak di tanah
        if (L.p.y < 0.03 && Math.random() < dt * 0.25) {
          L.p.set(around.x + (Math.random() - 0.5) * 30, 4 + Math.random() * 4, around.z + (Math.random() - 0.5) * 30);
          L.v.set((Math.random() - 0.5) * 0.4, -0.35 - Math.random() * 0.25, (Math.random() - 0.5) * 0.4);
        }
      } else {
        L.p.x += (L.v.x + Math.sin(t * 1.3 + i) * 0.5) * dt;
        L.p.z += (L.v.z + Math.cos(t * 1.1 + i) * 0.3) * dt;
        L.p.y += L.v.y * dt;
        L.rot.x += L.spin.x * dt;
        L.rot.y += L.spin.y * dt;
        L.rot.z += L.spin.z * dt;
        if (L.p.y < 0.05) {
          L.p.y = 0.03;
          L.rot.set(-Math.PI / 2, L.rot.y, 0);
        }
      }
      this.q.setFromEuler(L.rot);
      this.m.compose(L.p, this.q, new T.Vector3(1, 1, 1));
      this.leaves.setMatrixAt(i, this.m);
    }
    this.leaves.instanceMatrix.needsUpdate = true;
  }
}
