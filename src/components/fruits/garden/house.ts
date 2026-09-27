// Rumah kebun yang bisa dimasuki: dinding papan berongga dengan pintu yang terbuka sendiri saat didekati,
// atap genteng yang menghilang saat anak di dalam (isi rumah terlihat dari atas), dan interior lengkap:
// tempat tidur untuk istirahat, meja makan & kursi, dapur (tungku, panci, rak toples), lemari, rak buku,
// tikar, lampu gantung yang menyala hangat, jam dinding, dan lukisan.

import * as T from 'three';
import * as TX from './textures';

const std = (c: string, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

export class FarmHouse {
  group = new T.Group();
  private roof = new T.Group();
  private door = new T.Group();
  private doorOpen = 0;
  private lamp: T.PointLight;
  private lampGlow: T.Mesh;
  inside = false;
  private insideK = 0;
  /** tempat anak berbaring (dunia) */
  readonly bedLie: T.Vector3;
  /** titik berdiri di samping tempat tidur (dunia) */
  readonly bedSide: T.Vector3;
  readonly doorPos: T.Vector3;
  private textures: T.Texture[] = [];
  private zzz: T.Sprite[] = [];
  private roofMats: T.Material[] = [];
  private walls: { m: T.MeshStandardMaterial; n: T.Vector3 }[] = [];

  // ukuran dalam (lokal): x ±W, z ±D; pintu di sisi −z
  private readonly W = 3.4;
  private readonly D = 2.6;

  constructor(
    private at: T.Vector3,
    obstacles: { x: number; z: number; r: number }[],
  ) {
    this.group.position.copy(at);
    const plankT = TX.planks(),
      floorT = TX.planks(),
      roofT = TX.roofTiles();
    floorT.repeat.set(3, 3);
    this.textures.push(plankT, floorT, roofT);
    const wall = new T.MeshStandardMaterial({ map: plankT, color: '#f7efe3', roughness: 0.85 });
    const floorM = new T.MeshStandardMaterial({ map: floorT, color: '#b98a5a', roughness: 0.75 });
    const woodD = std('#8a5a3a', 0.7),
      woodL = std('#c79a66', 0.7);
    const add = (geo: T.BufferGeometry, m: T.Material, x: number, y: number, z: number, parent: T.Object3D = this.group, ry = 0) => {
      const mesh = new T.Mesh(geo, m);
      mesh.position.set(x, y, z);
      mesh.rotation.y = ry;
      mesh.castShadow = mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const W = this.W,
      D = this.D,
      H = 2.9,
      t = 0.16;
    // pondasi batu & lantai papan
    add(new T.BoxGeometry(W * 2 + 0.6, 0.12, D * 2 + 0.6), std('#9e958a', 0.95), 0, 0.06, 0);
    add(new T.BoxGeometry(W * 2, 0.04, D * 2), floorM, 0, 0.13, 0);
    // dinding berongga: belakang, kiri, kanan utuh; depan dengan lubang pintu.
    // Tiap sisi punya material sendiri: saat anak di dalam, sisi yang menghalangi kamera jadi tembus pandang.
    const side = (n: T.Vector3) => {
      const m = wall.clone();
      m.transparent = true;
      this.walls.push({ m, n });
      return m;
    };
    add(new T.BoxGeometry(W * 2 + t, H, t), side(new T.Vector3(0, 0, 1)), 0, H / 2, D);
    add(new T.BoxGeometry(t, H, D * 2), side(new T.Vector3(-1, 0, 0)), -W, H / 2, 0);
    add(new T.BoxGeometry(t, H, D * 2), side(new T.Vector3(1, 0, 0)), W, H / 2, 0);
    const dw = 0.6;
    const front = side(new T.Vector3(0, 0, -1));
    add(new T.BoxGeometry(W - dw, H, t), front, -(W + dw) / 2, H / 2, -D);
    add(new T.BoxGeometry(W - dw, H, t), front, (W + dw) / 2, H / 2, -D);
    add(new T.BoxGeometry(dw * 2, H - 2.15, t), front, 0, 2.15 + (H - 2.15) / 2, -D);
    // kusen pintu
    for (const s of [-1, 1]) add(new T.BoxGeometry(0.1, 2.15, 0.22), woodD, s * dw, 1.075, -D);
    add(new T.BoxGeometry(dw * 2 + 0.2, 0.12, 0.22), woodD, 0, 2.18, -D);
    // daun pintu berengsel (berayun ke dalam)
    this.door.position.set(-dw, 0, -D);
    const leaf = new T.Mesh(new T.BoxGeometry(dw * 2 - 0.04, 2.05, 0.07), std('#7a4a2a', 0.65));
    leaf.position.set(dw, 1.08, 0);
    leaf.castShadow = true;
    const knob = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), std('#d9a441', 0.3, { metalness: 0.8 }));
    knob.position.set(dw * 2 - 0.15, 1.05, -0.06);
    this.door.add(leaf, knob);
    for (const y of [0.5, 1.6]) {
      const panel = new T.Mesh(new T.BoxGeometry(dw * 2 - 0.3, 0.7, 0.02), std('#6a3e22', 0.7));
      panel.position.set(dw, y, -0.045);
      this.door.add(panel);
    }
    this.group.add(this.door);
    // jendela di kedua sisi dinding (kaca, kusen putih, pot bunga di luar)
    const glass = std('#9fd0ef', 0.1, { metalness: 0.2, transparent: true, opacity: 0.7 });
    const frameM = std('#ffffff', 0.6);
    const win = (x: number, z: number, ry: number) => {
      const g = new T.Group();
      g.position.set(x, 1.75, z);
      g.rotation.y = ry;
      for (const side of [-1, 1]) {
        const pane = new T.Mesh(new T.PlaneGeometry(1.1, 1), glass);
        pane.position.z = side * (t / 2 + 0.01);
        if (side > 0) pane.rotation.y = Math.PI;
        g.add(pane);
        for (const y of [-0.55, 0.55]) {
          const bar = new T.Mesh(new T.BoxGeometry(1.3, 0.09, 0.05), frameM);
          bar.position.set(0, y, side * (t / 2 + 0.03));
          g.add(bar);
        }
        for (const xx of [-0.6, 0, 0.6]) {
          const bar = new T.Mesh(new T.BoxGeometry(0.07, 1.1, 0.05), frameM);
          bar.position.set(xx, 0, side * (t / 2 + 0.03));
          g.add(bar);
        }
      }
      this.group.add(g);
    };
    win(-2.1, -D, 0);
    win(2.1, -D, 0);
    win(-W, 0.4, Math.PI / 2);
    win(W, -0.2, Math.PI / 2);
    win(1.2, D, 0);
    for (const s of [-1, 1]) {
      add(new T.BoxGeometry(0.9, 0.3, 0.3), std('#b5623a', 0.9), s * 2.1, 1.02, -D - 0.25);
      for (let k = 0; k < 6; k++) add(new T.SphereGeometry(0.1, 6, 4), std(k % 2 ? '#ff5d7a' : '#ffd23f', 0.6), s * 2.1 - 0.35 + k * 0.14, 1.22, -D - 0.25);
    }
    // teras kecil & anak tangga di depan pintu
    add(new T.BoxGeometry(1.6, 0.1, 0.6), std('#a89f94', 0.95), 0, 0.05, -D - 0.45);

    // ---------- atap (menghilang saat anak di dalam) ----------
    const roofM = new T.MeshStandardMaterial({ map: roofT, color: '#ffffff', roughness: 0.7, transparent: true });
    const gableM = new T.MeshStandardMaterial({ map: plankT, color: '#f7efe3', roughness: 0.85, transparent: true });
    const chimM = std('#b8b0a4', 0.9, { transparent: true });
    this.roofMats.push(roofM, gableM, chimM);
    const gable = new T.Shape();
    gable.moveTo(-D - 0.1, 0);
    gable.lineTo(D + 0.1, 0);
    gable.lineTo(0, 1.9);
    gable.closePath();
    for (const s of [-1, 1]) {
      const g = new T.Mesh(new T.ShapeGeometry(gable), gableM);
      g.rotation.y = Math.PI / 2;
      g.position.set(s * W, H, 0);
      g.material.side = T.DoubleSide;
      this.roof.add(g);
    }
    const slope = Math.atan2(1.9, D + 0.1);
    const slab = Math.hypot(1.9, D + 0.1) + 0.4;
    for (const s of [-1, 1]) {
      const r = new T.Mesh(new T.BoxGeometry(W * 2 + 0.8, 0.12, slab), roofM);
      r.position.set(0, H + 0.95, s * (D + 0.1) * 0.5);
      r.rotation.x = s * slope;
      r.castShadow = true;
      this.roof.add(r);
    }
    const ridge = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, W * 2 + 0.8, 8), roofM);
    ridge.rotation.z = Math.PI / 2;
    ridge.position.y = H + 1.92;
    this.roof.add(ridge);
    const chim = new T.Mesh(new T.BoxGeometry(0.6, 1.4, 0.6), chimM);
    chim.position.set(2.2, H + 1.6, 1);
    chim.castShadow = true;
    this.roof.add(chim);
    this.group.add(this.roof);

    // ---------- interior ----------
    const I = new T.Group();
    this.group.add(I);
    // tikar anyaman di tengah
    const rug = add(new T.BoxGeometry(2.4, 0.02, 1.6), std('#c9a36a', 0.95), -0.2, 0.16, -0.3, I);
    rug.receiveShadow = true;
    for (let k = 0; k < 5; k++) add(new T.BoxGeometry(2.3, 0.022, 0.06), std(k % 2 ? '#b5623a' : '#3f7a8a', 0.9), -0.2, 0.17, -0.9 + k * 0.3, I);
    // tempat tidur (sudut belakang kanan)
    const bx = 2.2,
      bz = 1.3;
    add(new T.BoxGeometry(1.4, 0.35, 2.2), woodD, bx, 0.33, bz, I);
    add(new T.BoxGeometry(1.3, 0.22, 2.05), std('#f4f1ea', 0.9), bx, 0.61, bz, I);
    add(new T.BoxGeometry(1.32, 0.08, 1.3), std('#3f7ac8', 0.85), bx, 0.74, bz - 0.35, I);
    add(new T.BoxGeometry(0.9, 0.16, 0.4), std('#ffffff', 0.9), bx, 0.8, bz + 0.72, I);
    add(new T.BoxGeometry(1.5, 1.0, 0.1), woodD, bx, 0.65, bz + 1.12, I);
    add(new T.BoxGeometry(0.5, 0.55, 0.45), woodL, bx - 1.05, 0.43, bz + 0.85, I);
    add(new T.CylinderGeometry(0.08, 0.12, 0.3, 10), std('#e8d9b0', 0.6), bx - 1.05, 0.86, bz + 0.85, I);
    add(new T.ConeGeometry(0.18, 0.2, 12, 1, true), std('#fff4c8', 0.6, { emissive: '#ffd27a', emissiveIntensity: 0.4, side: T.DoubleSide }), bx - 1.05, 1.08, bz + 0.85, I);
    this.bedLie = new T.Vector3(at.x + bx, 0.74, at.z + bz - 0.95);
    this.bedSide = new T.Vector3(at.x + bx - 1.05, 0, at.z + bz - 0.6);
    // lemari pakaian (dinding kanan)
    add(new T.BoxGeometry(0.6, 2.0, 1.2), woodL, W - 0.4, 1.12, -1.3, I);
    for (const s of [-1, 1]) {
      add(new T.BoxGeometry(0.02, 1.8, 0.56), woodD, W - 0.71, 1.12, -1.3 + s * 0.29, I);
      add(new T.SphereGeometry(0.035, 8, 6), std('#d9a441', 0.3, { metalness: 0.8 }), W - 0.73, 1.15, -1.3 + s * 0.06, I);
    }
    // meja makan & kursi (kiri tengah) dengan mangkuk buah
    const tx = -1.6,
      tz = 0.9;
    add(new T.BoxGeometry(1.3, 0.07, 0.8), woodL, tx, 0.82, tz, I);
    for (const [lx, lz] of [
      [-0.58, -0.33],
      [0.58, -0.33],
      [-0.58, 0.33],
      [0.58, 0.33],
    ])
      add(new T.BoxGeometry(0.07, 0.68, 0.07), woodD, tx + lx, 0.47, tz + lz, I);
    add(new T.CylinderGeometry(0.22, 0.14, 0.1, 16), std('#e8e2d6', 0.4), tx, 0.9, tz, I);
    ['#e84a3a', '#ffcf3a', '#6fbf3a', '#ff8c2a'].forEach((c, k) => add(new T.SphereGeometry(0.08, 10, 8), std(c, 0.5), tx - 0.08 + (k % 2) * 0.16, 0.99, tz - 0.05 + Math.floor(k / 2) * 0.1, I));
    for (const s of [-1, 1]) {
      const cz = tz + s * 0.65;
      add(new T.BoxGeometry(0.45, 0.06, 0.45), woodL, tx, 0.5, cz, I);
      for (const [lx, lz] of [
        [-0.19, -0.19],
        [0.19, -0.19],
        [-0.19, 0.19],
        [0.19, 0.19],
      ])
        add(new T.BoxGeometry(0.05, 0.47, 0.05), woodD, tx + lx, 0.28, cz + lz, I);
      add(new T.BoxGeometry(0.45, 0.5, 0.05), woodL, tx, 0.78, cz + s * 0.2, I);
    }
    // dapur: meja dapur, tungku, panci, rak toples (dinding kiri depan)
    add(new T.BoxGeometry(0.7, 0.9, 1.6), woodL, -W + 0.45, 0.6, -1.4, I);
    add(new T.BoxGeometry(0.72, 0.05, 1.62), std('#d8d2c6', 0.5), -W + 0.45, 1.07, -1.4, I);
    add(new T.BoxGeometry(0.5, 0.25, 0.5), std('#8a8078', 0.9), -W + 0.45, 1.22, -1.8, I);
    add(new T.CylinderGeometry(0.2, 0.18, 0.22, 16), std('#6a6e74', 0.35, { metalness: 0.8 }), -W + 0.45, 1.45, -1.8, I);
    add(new T.CylinderGeometry(0.12, 0.12, 0.05, 14), std('#ff8c2a', 0.6, { emissive: '#ff5a1a', emissiveIntensity: 0.6 }), -W + 0.45, 1.36, -1.8, I);
    add(new T.BoxGeometry(0.3, 0.05, 1.3), woodD, -W + 0.2, 1.9, -1.3, I);
    ['#e8b04a', '#c84a3a', '#6fae3a', '#e8e2d6'].forEach((c, k) => add(new T.CylinderGeometry(0.08, 0.08, 0.22, 10), std(c, 0.3, { transparent: true, opacity: 0.85 }), -W + 0.2, 2.04, -1.8 + k * 0.3, I));
    // rak buku (dinding belakang kiri)
    add(new T.BoxGeometry(1.2, 1.6, 0.35), woodD, -2.3, 0.93, D - 0.3, I);
    for (let row = 0; row < 3; row++)
      for (let k = 0; k < 7; k++) add(new T.BoxGeometry(0.1, 0.32, 0.26), std(['#c84a3a', '#3f7ac8', '#e8b04a', '#6fae3a', '#8a5aa8'][(k + row) % 5], 0.7), -2.72 + k * 0.14, 0.45 + row * 0.5, D - 0.33, I);
    // lukisan pemandangan & jam dinding
    const art = new T.Mesh(
      new T.PlaneGeometry(0.9, 0.6),
      new T.MeshStandardMaterial({
        map: (() => {
          const c = document.createElement('canvas');
          c.width = 180;
          c.height = 120;
          const g = c.getContext('2d')!;
          const sky = g.createLinearGradient(0, 0, 0, 120);
          sky.addColorStop(0, '#7cc0ff');
          sky.addColorStop(1, '#dff2ff');
          g.fillStyle = sky;
          g.fillRect(0, 0, 180, 120);
          g.fillStyle = '#5fa04a';
          g.beginPath();
          g.moveTo(0, 90);
          g.quadraticCurveTo(60, 40, 110, 80);
          g.quadraticCurveTo(150, 55, 180, 75);
          g.lineTo(180, 120);
          g.lineTo(0, 120);
          g.fill();
          g.fillStyle = '#ffd23f';
          g.beginPath();
          g.arc(140, 30, 14, 0, 7);
          g.fill();
          g.strokeStyle = '#6b4a2e';
          g.lineWidth = 10;
          g.strokeRect(0, 0, 180, 120);
          const tx2 = new T.CanvasTexture(c);
          tx2.colorSpace = T.SRGBColorSpace;
          this.textures.push(tx2);
          return tx2;
        })(),
      }),
    );
    art.position.set(-0.3, 1.9, D - 0.09);
    art.rotation.y = Math.PI;
    I.add(art);
    add(new T.CylinderGeometry(0.22, 0.22, 0.05, 20), std('#ffffff', 0.5), 0.9, 2.2, D - 0.1, I).rotation.x = Math.PI / 2;
    // lampu gantung hangat
    add(new T.CylinderGeometry(0.01, 0.01, 0.7, 4), std('#333333'), 0, H - 0.35, 0, I);
    this.lampGlow = add(new T.ConeGeometry(0.32, 0.26, 16, 1, true), std('#fff2c8', 0.6, { emissive: '#ffcf70', emissiveIntensity: 0.9, side: T.DoubleSide }), 0, H - 0.8, 0, I);
    this.lamp = new T.PointLight('#ffd9a0', 0, 9, 1.4);
    this.lamp.position.set(0, H - 0.95, 0);
    I.add(this.lamp);
    // "Zzz" saat istirahat
    const zt = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      g.font = '900 52px system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = '#ffffff';
      g.strokeStyle = '#3f5aa8';
      g.lineWidth = 6;
      g.strokeText('Z', 32, 34);
      g.fillText('Z', 32, 34);
      const tx3 = new T.CanvasTexture(c);
      this.textures.push(tx3);
      return tx3;
    })();
    for (let k = 0; k < 3; k++) {
      const s = new T.Sprite(new T.SpriteMaterial({ map: zt, transparent: true, depthWrite: false }));
      s.visible = false;
      this.group.add(s);
      this.zzz.push(s);
    }

    // penghalang: dinding (celah di pintu) & perabot besar
    const ob = (lx: number, lz: number, r: number) => obstacles.push({ x: at.x + lx, z: at.z + lz, r });
    for (let x = -W; x <= W + 0.01; x += 0.6) {
      ob(x, D, 0.35);
      if (Math.abs(x) > 0.9) ob(x, -D, 0.35);
    }
    for (let z = -D; z <= D + 0.01; z += 0.6) {
      ob(-W, z, 0.35);
      ob(W, z, 0.35);
    }
    ob(bx, bz + 0.3, 0.75);
    ob(W - 0.4, -1.3, 0.55);
    ob(tx, tz, 0.75);
    ob(-W + 0.45, -1.4, 0.6);
    ob(-2.3, D - 0.3, 0.45);
    this.doorPos = new T.Vector3(at.x, 0, at.z - D - 1.2);
  }

  /** Perbarui pintu, atap, lampu; kembalikan true bila titik `p` ada di dalam rumah. */
  update(t: number, dt: number, p: T.Vector3, resting: boolean, cam: T.Vector3) {
    const lx = p.x - this.at.x,
      lz = p.z - this.at.z;
    this.inside = Math.abs(lx) < this.W && Math.abs(lz) < this.D;
    const nearDoor = Math.abs(lx) < 1.6 && Math.abs(lz + this.D) < 2.2;
    this.doorOpen = T.MathUtils.damp(this.doorOpen, nearDoor || this.inside ? 1 : 0, 4, dt);
    this.door.rotation.y = -this.doorOpen * 1.5;
    this.insideK = T.MathUtils.damp(this.insideK, this.inside ? 1 : 0, 5, dt);
    for (const m of this.roofMats) m.opacity = 1 - this.insideK;
    this.roof.visible = this.insideK < 0.98;
    const toCam = cam.clone().sub(this.at).setY(0).normalize();
    for (const w of this.walls) {
      const facing = w.n.dot(toCam) > 0.25;
      const target = facing ? 1 - 0.8 * this.insideK : 1;
      w.m.opacity = T.MathUtils.damp(w.m.opacity, target, 6, dt);
      w.m.depthWrite = w.m.opacity > 0.95;
    }
    this.lamp.intensity = 6 * this.insideK + 1.5;
    (this.lampGlow.material as T.MeshStandardMaterial).emissiveIntensity = 0.5 + this.insideK * 0.8;
    this.zzz.forEach((z, i) => {
      z.visible = resting;
      if (!resting) return;
      const k = ((t * 0.5 + i / 3) % 1);
      z.position.set(this.bedLie.x - this.at.x + k * 0.5, 1.1 + k * 1.2, this.bedLie.z - this.at.z + 0.6);
      z.scale.setScalar(0.25 + k * 0.3);
      z.material.opacity = 1 - k;
    });
    return this.inside;
  }

  get openness() {
    return this.doorOpen;
  }

  get insideAmount() {
    return this.insideK;
  }

  dispose() {
    this.textures.forEach((x) => x.dispose());
  }
}
