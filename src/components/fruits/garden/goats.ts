// Kandang kambing di pojok kebun: kandang panggung kayu (lantai berkolong, dinding bilah, atap seng
// bergelombang, tangga naik), halaman berpagar kayu dengan pintu yang bisa dibuka, palungan jerami & ember
// air, serta kambing-kambing yang merumput, mengunyah, mengembik, dan bisa dikeluarkan ke padang lalu dipanggil pulang.

import * as T from 'three';

const std = (c: string, rough = 0.85, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

function woodTex(dark = false) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = dark ? '#6b4a2e' : '#9a7652';
  g.fillRect(0, 0, 128, 256);
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 128;
    g.strokeStyle = `rgba(${dark ? '40,24,12' : '70,45,25'},${0.15 + Math.random() * 0.25})`;
    g.lineWidth = 1 + Math.random() * 2;
    g.beginPath();
    g.moveTo(x, 0);
    for (let y = 0; y <= 256; y += 32) g.lineTo(x + Math.sin(y * 0.05 + i) * 3, y);
    g.stroke();
  }
  for (let i = 0; i < 6; i++) {
    g.fillStyle = 'rgba(40,20,10,.35)';
    g.beginPath();
    g.ellipse(Math.random() * 128, Math.random() * 256, 3, 6, 0, 0, 7);
    g.fill();
  }
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.wrapS = t.wrapT = T.RepeatWrapping;
  return t;
}

function tinTex() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d')!;
  for (let x = 0; x < 256; x++) {
    const v = 0.5 + 0.5 * Math.sin((x / 256) * Math.PI * 2 * 12);
    const l = Math.round(120 + v * 70);
    g.fillStyle = `rgb(${l},${l - 4},${l - 10})`;
    g.fillRect(x, 0, 1, 64);
  }
  for (let i = 0; i < 90; i++) {
    g.fillStyle = `rgba(150,80,40,${Math.random() * 0.25})`;
    g.fillRect(Math.random() * 256, Math.random() * 64, 2 + Math.random() * 10, 1 + Math.random() * 4);
  }
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.wrapS = t.wrapT = T.RepeatWrapping;
  return t;
}

/* ---------------- kambing ---------------- */

interface Goat {
  g: T.Group;
  head: T.Group;
  legs: T.Group[];
  tail: T.Object3D;
  pos: T.Vector3;
  heading: number;
  path: T.Vector3[];
  wait: number;
  mode: 'graze' | 'walk' | 'bleat';
  modeT: number;
  inside: boolean;
  ph: number;
}

function goatModel(coat: string, patch: string | null, horns: boolean) {
  const g = new T.Group();
  const fur = std(coat, 0.95);
  const dark = std('#2a2420', 0.6);
  const body = new T.Mesh(new T.SphereGeometry(0.34, 18, 12), fur);
  body.scale.set(0.82, 0.78, 1.45);
  body.position.y = 0.72;
  g.add(body);
  if (patch) {
    const p = new T.Mesh(new T.SphereGeometry(0.2, 12, 10), std(patch, 0.95));
    p.scale.set(1.2, 1, 1.4);
    p.position.set(0.12, 0.82, -0.08);
    g.add(p);
  }
  const neck = new T.Mesh(new T.CylinderGeometry(0.11, 0.15, 0.36, 10), fur);
  neck.position.set(0, 0.92, 0.38);
  neck.rotation.x = 0.7;
  g.add(neck);
  const head = new T.Group();
  head.position.set(0, 1.06, 0.5);
  const skull = new T.Mesh(new T.SphereGeometry(0.13, 14, 12), fur);
  skull.scale.set(0.85, 0.9, 1.1);
  const muzzle = new T.Mesh(new T.SphereGeometry(0.09, 12, 10), fur);
  muzzle.scale.set(0.8, 0.75, 1.3);
  muzzle.position.set(0, -0.07, 0.14);
  const nose = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), std('#4a3a36', 0.5));
  nose.position.set(0, -0.06, 0.25);
  head.add(skull, muzzle, nose);
  for (const s of [-1, 1]) {
    const eye = new T.Mesh(new T.SphereGeometry(0.022, 8, 6), std('#c9a13a', 0.3));
    eye.position.set(s * 0.085, 0.03, 0.06);
    const pupil = new T.Mesh(new T.BoxGeometry(0.02, 0.008, 0.01), dark);
    pupil.position.set(s * 0.1, 0.03, 0.075);
    const ear = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), fur);
    ear.scale.set(1.8, 0.35, 0.7);
    ear.position.set(s * 0.15, 0.0, -0.02);
    ear.rotation.z = s * -0.5;
    head.add(eye, pupil, ear);
    if (horns) {
      const pts: T.Vector3[] = [];
      for (let k = 0; k <= 8; k++) {
        const u = k / 8;
        pts.push(new T.Vector3(s * (0.05 + u * 0.06), 0.1 + Math.sin(u * 2.2) * 0.12, -u * 0.2));
      }
      const horn = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 10, 0.022, 6), std('#8a7a66', 0.6));
      head.add(horn);
    }
  }
  const beard = new T.Mesh(new T.ConeGeometry(0.03, 0.12, 6), std(patch ?? coat, 0.95));
  beard.rotation.x = Math.PI;
  beard.position.set(0, -0.17, 0.12);
  head.add(beard);
  g.add(head);
  const legs: T.Group[] = [];
  for (const [x, z] of [
    [-0.15, 0.3],
    [0.15, 0.3],
    [-0.15, -0.3],
    [0.15, -0.3],
  ]) {
    const leg = new T.Group();
    leg.position.set(x, 0.62, z);
    const upper = new T.Mesh(new T.CylinderGeometry(0.05, 0.04, 0.34, 8), fur);
    upper.position.y = -0.17;
    const lower = new T.Mesh(new T.CylinderGeometry(0.032, 0.03, 0.26, 8), fur);
    lower.position.y = -0.45;
    const hoof = new T.Mesh(new T.CylinderGeometry(0.035, 0.04, 0.05, 8), dark);
    hoof.position.y = -0.6;
    leg.add(upper, lower, hoof);
    g.add(leg);
    legs.push(leg);
  }
  const tail = new T.Mesh(new T.ConeGeometry(0.04, 0.14, 6), fur);
  tail.position.set(0, 0.92, -0.48);
  tail.rotation.x = -0.6;
  g.add(tail);
  g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  return { g, head, legs, tail };
}

/* ---------------- kandang ---------------- */

export class GoatPen {
  group = new T.Group();
  /** titik di luar pintu (dunia) — anak berdiri di sini untuk membuka/menutup */
  readonly door: T.Vector3;
  private gate: T.Group;
  private gateOpen = 0;
  private wantOpen = false;
  out = false;
  private goats: Goat[] = [];
  private textures: T.Texture[] = [];
  /** pintu tertutup = penghalang */
  gateBlock = { x: 0, z: 0, r: 0.9 };
  private onBleat: (vol: number) => void;

  // bingkai lokal: pintu di sisi −x, gubuk di sisi +x
  private readonly W = 10;
  private readonly D = 8;

  constructor(
    private at: T.Vector3,
    obstacles: { x: number; z: number; r: number }[],
    onBleat: (vol: number) => void,
  ) {
    this.onBleat = onBleat;
    this.group.position.copy(at);
    const wt = woodTex(),
      wd = woodTex(true),
      tin = tinTex();
    this.textures.push(wt, wd, tin);
    const plank = new T.MeshStandardMaterial({ map: wt, roughness: 0.9 });
    const post = new T.MeshStandardMaterial({ map: wd, roughness: 0.9 });
    const add = (geo: T.BufferGeometry, m: T.Material, x: number, y: number, z: number, ry = 0) => {
      const mesh = new T.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.rotation.y = ry;
      mesh.castShadow = mesh.receiveShadow = true;
      this.group.add(mesh);
      return mesh;
    };
    const hw = this.W / 2,
      hd = this.D / 2;
    // tanah halaman: tanah bercampur jerami
    const yard = new T.Mesh(new T.PlaneGeometry(this.W, this.D), std('#8a7248', 1));
    yard.rotation.x = -Math.PI / 2;
    yard.position.y = 0.02;
    yard.receiveShadow = true;
    this.group.add(yard);
    for (let i = 0; i < 120; i++) {
      const straw = new T.Mesh(new T.BoxGeometry(0.28, 0.01, 0.02), std('#d8b85a', 0.9));
      straw.position.set((Math.random() - 0.5) * this.W * 0.9, 0.03, (Math.random() - 0.5) * this.D * 0.9);
      straw.rotation.y = Math.random() * 3;
      this.group.add(straw);
    }
    // pagar halaman: tiang & tiga bilah, celah pintu di tengah sisi −x
    const fenceLine = (x0: number, z0: number, x1: number, z1: number) => {
      const len = Math.hypot(x1 - x0, z1 - z0);
      const n = Math.max(1, Math.round(len / 1.25));
      for (let k = 0; k <= n; k++) {
        const u = k / n;
        add(new T.BoxGeometry(0.14, 1.3, 0.14), post, x0 + (x1 - x0) * u, 0.65, z0 + (z1 - z0) * u);
      }
      const ry = -Math.atan2(z1 - z0, x1 - x0);
      for (const y of [0.35, 0.72, 1.08]) add(new T.BoxGeometry(len, 0.1, 0.05), plank, (x0 + x1) / 2, y, (z0 + z1) / 2, ry);
    };
    const gw = 0.95;
    fenceLine(-hw, -hd, hw, -hd);
    fenceLine(-hw, hd, hw, hd);
    fenceLine(hw, -hd, hw, hd);
    fenceLine(-hw, -hd, -hw, -gw);
    fenceLine(-hw, gw, -hw, hd);
    // pintu kayu berengsel (berayun ke luar)
    this.gate = new T.Group();
    this.gate.position.set(-hw, 0, -gw);
    const leaf = new T.Group();
    for (const y of [0.3, 0.65, 1.0]) {
      const b = new T.Mesh(new T.BoxGeometry(0.05, 0.12, gw * 2), plank);
      b.position.set(0, y, gw);
      leaf.add(b);
    }
    for (const z of [0.05, gw * 2 - 0.05]) {
      const s = new T.Mesh(new T.BoxGeometry(0.07, 1.1, 0.08), post);
      s.position.set(0, 0.62, z);
      leaf.add(s);
    }
    const brace = new T.Mesh(new T.BoxGeometry(0.05, 0.1, Math.hypot(gw * 2, 0.7)), plank);
    brace.position.set(0.01, 0.65, gw);
    brace.rotation.x = Math.atan2(0.7, gw * 2);
    leaf.add(brace);
    const latch = new T.Mesh(new T.BoxGeometry(0.08, 0.05, 0.1), std('#3a3a3a', 0.4, { metalness: 0.7 }));
    latch.position.set(-0.04, 0.72, gw * 2 - 0.12);
    leaf.add(latch);
    leaf.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
    this.gate.add(leaf);
    this.group.add(this.gate);

    // kandang panggung di sisi +x: kolong berpenyangga, lantai papan, dinding bilah berjarak, atap seng
    const sx = hw - 2,
      sw = 3.4,
      sd = 6,
      fy = 1.0;
    for (const x of [sx - sw / 2 + 0.15, sx + sw / 2 - 0.15])
      for (const z of [-sd / 2 + 0.15, 0, sd / 2 - 0.15]) add(new T.BoxGeometry(0.18, fy, 0.18), post, x, fy / 2, z);
    add(new T.BoxGeometry(sw, 0.12, sd), plank, sx, fy, 0);
    const wallH = 1.5;
    // dinding belakang & samping: bilah vertikal berjarak (udara mengalir)
    for (let k = 0; k < 14; k++) add(new T.BoxGeometry(0.1, wallH, 0.14), plank, sx + sw / 2 - 0.05, fy + wallH / 2, -sd / 2 + 0.25 + k * ((sd - 0.5) / 13));
    for (const zs of [-1, 1]) for (let k = 0; k < 8; k++) add(new T.BoxGeometry(0.14, wallH, 0.1), plank, sx - sw / 2 + 0.25 + k * ((sw - 0.5) / 7), fy + wallH / 2, zs * (sd / 2 - 0.05));
    // dinding depan setengah tinggi dengan bukaan & tiang sudut
    add(new T.BoxGeometry(0.1, 0.6, sd), plank, sx - sw / 2 + 0.05, fy + 0.3, 0);
    for (const z of [-sd / 2, sd / 2, 0]) add(new T.BoxGeometry(0.16, wallH + 0.6, 0.16), post, sx - sw / 2 + 0.05, fy + (wallH + 0.6) / 2, z);
    // atap seng miring
    const tinMat = new T.MeshStandardMaterial({ map: tin, roughness: 0.45, metalness: 0.55, side: T.DoubleSide });
    tin.repeat.set(3, 1);
    const roof = new T.Mesh(new T.PlaneGeometry(sd + 0.8, sw + 1.2), tinMat);
    roof.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    roof.rotateX(0.28);
    roof.position.set(sx, fy + wallH + 0.55, 0);
    roof.castShadow = roof.receiveShadow = true;
    this.group.add(roof);
    // tangga papan dari halaman ke lantai kandang
    const ramp = add(new T.BoxGeometry(1.8, 0.08, 0.9), plank, sx - sw / 2 - 0.8, fy / 2, 1.8);
    ramp.rotation.z = Math.atan2(fy, 1.8);
    for (let k = 0; k < 5; k++) add(new T.BoxGeometry(0.06, 0.05, 0.9), post, sx - sw / 2 - 1.5 + k * 0.35, 0.15 + k * 0.2, 1.8);
    // palungan jerami & ember air
    add(new T.BoxGeometry(1.6, 0.5, 0.6), plank, -1, 0.25, -hd + 0.7);
    for (let k = 0; k < 40; k++) {
      const hay = new T.Mesh(new T.BoxGeometry(0.3, 0.02, 0.02), std('#e0c060', 0.9));
      hay.position.set(-1 + (Math.random() - 0.5) * 1.4, 0.5 + Math.random() * 0.1, -hd + 0.7 + (Math.random() - 0.5) * 0.45);
      hay.rotation.set(Math.random(), Math.random() * 3, Math.random());
      this.group.add(hay);
    }
    const bucket = add(new T.CylinderGeometry(0.28, 0.22, 0.42, 16, 1, true), std('#8a9098', 0.4, { metalness: 0.6, side: T.DoubleSide }), 1, 0.21, hd - 0.7);
    bucket.castShadow = true;
    const water = new T.Mesh(new T.CircleGeometry(0.27, 16), std('#4a7a90', 0.1));
    water.rotation.x = -Math.PI / 2;
    water.position.set(1, 0.36, hd - 0.7);
    this.group.add(water);
    // tumpukan jerami di samping kandang
    for (let k = 0; k < 3; k++) add(new T.CylinderGeometry(0.55, 0.6, 0.7, 14), std('#d8b85a', 0.95), sx - 0.5 + k * 0.1, 0.35 + k * 0.62, -hd + 1.2);

    // penghalang untuk anak: pagar & kandang
    const ob = (lx: number, lz: number, r: number) => obstacles.push({ x: at.x + lx, z: at.z + lz, r });
    for (let x = -hw; x <= hw; x += 1) {
      ob(x, -hd, 0.55);
      ob(x, hd, 0.55);
    }
    for (let z = -hd; z <= hd; z += 1) {
      ob(hw, z, 0.55);
      if (Math.abs(z) > gw + 0.3) ob(-hw, z, 0.55);
    }
    ob(sx, 0, 1.9);
    this.gateBlock = { x: at.x - hw, z: at.z, r: 1.0 };
    obstacles.push(this.gateBlock);
    this.door = new T.Vector3(at.x - hw - 1.6, 0, at.z);

    // kambing-kambing
    const coats: [string, string | null, boolean][] = [
      ['#f2eee6', null, true],
      ['#9a6a3e', '#f2eee6', true],
      ['#2e2a28', '#f2eee6', false],
      ['#e8dcc4', '#8a5a34', false],
    ];
    coats.forEach(([c, p, h], i) => {
      const m = goatModel(c, p, h);
      const s = i === 3 ? 0.7 : 1; // si kecil (cempe)
      m.g.scale.setScalar(s);
      const pos = this.randomInside();
      m.g.position.copy(pos);
      this.group.add(m.g);
      this.goats.push({ ...m, pos, heading: Math.random() * 6, path: [], wait: Math.random() * 3, mode: 'graze', modeT: 0, inside: true, ph: Math.random() * 6 });
    });
  }

  private randomInside() {
    return new T.Vector3(-this.W / 2 + 0.9 + Math.random() * 4.6, 0, -this.D / 2 + 1 + Math.random() * (this.D - 2));
  }
  private randomOutside() {
    return new T.Vector3(-this.W / 2 - 3 - Math.random() * 5, 0, 1.5 + Math.random() * 7.5);
  }
  private get gateIn() {
    return new T.Vector3(-this.W / 2 + 1.2, 0, 0);
  }
  private get gateOut() {
    return new T.Vector3(-this.W / 2 - 1.4, 0, 0);
  }

  /** Buka kandang & keluarkan kambing, atau panggil pulang lalu tutup pintu. */
  toggle() {
    this.out = !this.out;
    this.wantOpen = true;
    this.goats.forEach((g, i) => {
      g.wait = 0.4 + i * 0.7;
      g.mode = 'walk';
      g.path = this.out ? [this.gateIn, this.gateOut, this.randomOutside()] : [this.gateOut, this.gateIn, this.randomInside()];
    });
    return this.out;
  }

  /** Kambing di dekat titik layar diketuk → mengembik. */
  goatAt(ndc: T.Vector2, cam: T.Camera, aspect: number) {
    const v = new T.Vector3();
    let best: Goat | null = null,
      bd = 0.09;
    for (const g of this.goats) {
      g.g.getWorldPosition(v);
      v.y += 0.8;
      v.project(cam);
      if (v.z > 1) continue;
      const d = Math.hypot((v.x - ndc.x) * aspect, v.y - ndc.y);
      if (d < bd) {
        bd = d;
        best = g;
      }
    }
    if (!best) return false;
    best.mode = 'bleat';
    best.modeT = 0;
    this.onBleat(1);
    return true;
  }

  /** Salah satu kambing mengembik (suara sekitar). */
  bleatRandom() {
    const g = this.goats[Math.floor(Math.random() * this.goats.length)];
    if (g.mode === 'walk') return;
    g.mode = 'bleat';
    g.modeT = 0;
  }

  update(t: number, dt: number) {
    // pintu berayun perlahan; tetap terbuka selama ada kambing yang lewat
    // tetap terbuka selama masih ada kambing yang menuju/lewat pintu
    const passing = this.goats.some((g) => g.path.length > 1);
    if (this.wantOpen && !passing) this.wantOpen = false;
    this.gateOpen = T.MathUtils.damp(this.gateOpen, this.wantOpen ? 1 : 0, 3, dt);
    this.gate.rotation.y = -this.gateOpen * 1.7;
    this.gateBlock.r = this.gateOpen > 0.3 ? 0 : 1.0;

    for (const g of this.goats) {
      g.modeT += dt;
      if (g.wait > 0) {
        g.wait -= dt;
      } else if (g.path.length) {
        const to = g.path[0];
        const dx = to.x - g.pos.x,
          dz = to.z - g.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.2) {
          g.path.shift();
          if (to === this.gateOut || to.x < -this.W / 2) g.inside = false;
          if (!g.path.length) {
            g.inside = g.pos.x > -this.W / 2;
            g.mode = 'graze';
            g.wait = 2 + Math.random() * 4;
          }
        } else {
          g.mode = 'walk';
          const sp = 1.1;
          g.pos.x += (dx / d) * sp * dt;
          g.pos.z += (dz / d) * sp * dt;
          const want = Math.atan2(dx, dz);
          let dh = want - g.heading;
          dh = Math.atan2(Math.sin(dh), Math.cos(dh));
          g.heading += dh * Math.min(1, dt * 5);
        }
      } else if (g.mode !== 'bleat') {
        // selesai merumput → jalan ke tempat lain di area yang sama
        g.path = [g.pos.x > -this.W / 2 ? this.randomInside() : this.randomOutside()];
        g.wait = 0;
      }
      if (g.mode === 'bleat' && g.modeT > 1.3) {
        g.mode = 'graze';
        g.wait = 2 + Math.random() * 3;
      }
      // animasi
      const walking = g.mode === 'walk' && g.wait <= 0 && g.path.length > 0;
      const s = Math.sin(t * 9 + g.ph);
      g.legs[0].rotation.x = walking ? s * 0.5 : 0;
      g.legs[3].rotation.x = walking ? s * 0.5 : 0;
      g.legs[1].rotation.x = walking ? -s * 0.5 : 0;
      g.legs[2].rotation.x = walking ? -s * 0.5 : 0;
      const graze = !walking && g.mode === 'graze';
      const bleat = g.mode === 'bleat';
      const headX = graze ? 1.05 + Math.sin(t * 6 + g.ph) * 0.06 : bleat ? -0.45 : 0.05;
      g.head.rotation.x = T.MathUtils.damp(g.head.rotation.x, headX, 5, dt);
      g.head.position.y = T.MathUtils.damp(g.head.position.y, graze ? 0.72 : 1.06, 5, dt);
      g.head.position.z = T.MathUtils.damp(g.head.position.z, graze ? 0.66 : 0.5, 5, dt);
      g.tail.rotation.z = Math.sin(t * (walking ? 14 : 4) + g.ph) * 0.4;
      g.g.position.set(g.pos.x, walking ? Math.abs(s) * 0.03 : 0, g.pos.z);
      g.g.rotation.y = g.heading;
    }
  }

  dispose() {
    this.textures.forEach((t) => t.dispose());
  }
}
