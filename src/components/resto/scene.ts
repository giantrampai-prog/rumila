// Tampilan 3D Rinoya Resto: restoran Jepang isometrik beratap terbuka di jalan bersakura — noren di pintu,
// lampion merah, papan nama, dapur dengan alat yang dibeli, meja kasir, meja makan, dekorasi tema. Saat buka,
// pelanggan (warna per segmen) masuk, antre di kasir, duduk, makanan muncul di meja, makan, lalu pulang; koki
// bekerja di alatnya, pelayan mengantar, petugas kebersihan membersihkan meja. Saat dibangun, dinding naik bertahap.

import * as T from 'three';
import { MENUS } from '@/lib/resto/data';
import type { DayRun, RestoState } from '@/lib/resto/sim';

const std = (c: string, rough = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const emojiCache = new Map<string, T.Texture>();
function emojiTex(e: string) {
  let t = emojiCache.get(e);
  if (!t) {
    t = canvasTex(96, 96, (g) => {
      g.font = '72px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(e, 48, 54);
    });
    emojiCache.set(e, t);
  }
  return t;
}

/** Tokoh bulat sederhana (pelanggan / staf). */
function person(body: string, head = '#f0c8a0', hat?: string) {
  const g = new T.Group();
  const b = new T.Mesh(new T.CapsuleGeometry(0.22, 0.36, 6, 14), std(body, 0.7));
  b.position.y = 0.52;
  const h = new T.Mesh(new T.SphereGeometry(0.2, 16, 12), std(head, 0.6));
  h.position.y = 1.02;
  g.add(b, h);
  for (const s of [-1, 1]) {
    const eye = new T.Mesh(new T.SphereGeometry(0.025, 8, 6), std('#222222', 0.3));
    eye.position.set(s * 0.07, 1.05, 0.18);
    g.add(eye);
  }
  const hair = new T.Mesh(new T.SphereGeometry(0.205, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.2), std('#3a2a1e', 0.7));
  hair.position.y = 1.04;
  hair.rotation.x = -0.25;
  g.add(hair);
  if (hat) {
    const c = new T.Mesh(new T.CylinderGeometry(0.2, 0.22, 0.24, 14), std(hat, 0.6));
    c.position.y = 1.26;
    g.add(c);
  }
  g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
  return g;
}

const SEG_COLOR = { pelajar: '#3f7ac8', pekerja: '#5a5a66', keluarga: '#e8804a' } as const;

interface Actor {
  obj: T.Group;
  pos: T.Vector3;
  target: T.Vector3;
  food: T.Sprite[];
  bubble: T.Sprite | null;
}

export class RestoScene {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(40, 1, 0.1, 200);
  private ro: ResizeObserver;
  private raf = 0;
  private last = performance.now();
  private t = 0;
  private yaw = -0.95;
  private pitch = 0.98;
  private dist = 17;
  private drag: { x: number; y: number } | null = null;
  private pinch = 0;
  private pointers = new Map<number, { x: number; y: number }>();

  private shell = new T.Group(); // dinding, lantai, atap: dibangun ulang saat keadaan berubah
  private dyn = new T.Group(); // alat, meja, dekorasi
  private people = new T.Group();
  private actors = new Map<number, Actor>();
  private staffActors = new Map<string, Actor>();
  private buildK = 0;
  private key = '';
  private textures: T.Texture[] = [];
  private lanterns: T.Object3D[] = [];
  private greet: T.Texture;

  // tata letak lokal (meter game): lebar 10 (x −5…5), dalam 8 (z −4…4); pintu di depan (+z)
  private tablePos: T.Vector3[] = [];
  private readonly counter = new T.Vector3(-2.6, 0, 1.2);
  private readonly door = new T.Vector3(0, 0, 4.6);
  private readonly pass = new T.Vector3(0, 0, -1.6);
  private stationPos: Record<string, T.Vector3> = {
    goreng: new T.Vector3(-3.6, 0, -3.2),
    kompor: new T.Vector3(-1.6, 0, -3.2),
    sushi: new T.Vector3(0.6, 0, -3.2),
    minum: new T.Vector3(2.6, 0, -3.2),
  };

  constructor(private host: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);
    this.scene.background = new T.Color('#bfe6ff');
    this.scene.fog = new T.Fog('#cfeaff', 30, 70);
    const hemi = new T.HemisphereLight('#fff6e8', '#7a9a6a', 1.1);
    const sun = new T.DirectionalLight('#fff1d8', 2.2);
    sun.position.set(8, 16, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    const sc = sun.shadow.camera as T.OrthographicCamera;
    sc.left = sc.bottom = -14;
    sc.right = sc.top = 14;
    this.scene.add(hemi, sun, this.shell, this.dyn, this.people);
    this.greet = canvasTex(256, 96, (g) => {
      g.fillStyle = '#ffffff';
      g.beginPath();
      g.roundRect(4, 4, 248, 70, 30);
      g.fill();
      g.beginPath();
      g.moveTo(110, 72);
      g.lineTo(128, 92);
      g.lineTo(146, 72);
      g.fill();
      g.fillStyle = '#c8342a';
      g.font = '900 30px system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('Irasshaimase!', 128, 40);
    });
    this.textures.push(this.greet);
    this.buildWorld();

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => {
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.drag = { x: e.clientX, y: e.clientY };
    });
    el.addEventListener('pointermove', (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      if (this.pointers.size >= 2) {
        p.x = e.clientX;
        p.y = e.clientY;
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (this.pinch) this.dist = T.MathUtils.clamp(this.dist * (this.pinch / d), 8, 28);
        this.pinch = d;
        return;
      }
      const dx = e.clientX - p.x,
        dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      this.yaw -= dx * 0.006;
      this.pitch = T.MathUtils.clamp(this.pitch + dy * 0.004, 0.35, 1.25);
    });
    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = 0;
      this.drag = null;
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.dist = T.MathUtils.clamp(this.dist * Math.exp(e.deltaY * 0.001), 8, 28);
      },
      { passive: false },
    );
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------------- dunia luar: jalan, trotoar, pohon sakura ---------------- */

  private buildWorld() {
    const ground = new T.Mesh(new T.PlaneGeometry(80, 80), std('#8fc46a', 1));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    const road = new T.Mesh(new T.PlaneGeometry(80, 6), std('#5b5e66', 0.95));
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.01, 10);
    this.scene.add(road);
    for (let x = -38; x < 40; x += 4) {
      const line = new T.Mesh(new T.PlaneGeometry(2, 0.15), std('#f5f1e6', 0.8));
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.02, 10);
      this.scene.add(line);
    }
    const walk = new T.Mesh(new T.BoxGeometry(80, 0.12, 2.4), std('#d8d0c2', 0.9));
    walk.position.set(0, 0.06, 6);
    walk.receiveShadow = true;
    this.scene.add(walk);
    // pohon sakura di trotoar
    const trunkM = std('#6a4a3a', 0.9),
      pink = std('#ffb7d0', 0.8),
      pink2 = std('#ff9ec2', 0.8);
    for (const x of [-12, -8, 8, 12, -16, 16]) {
      const g = new T.Group();
      const tr = new T.Mesh(new T.CylinderGeometry(0.15, 0.22, 2.2, 8), trunkM);
      tr.position.y = 1.1;
      g.add(tr);
      for (let k = 0; k < 6; k++) {
        const b = new T.Mesh(new T.IcosahedronGeometry(0.9 + Math.random() * 0.4, 1), k % 2 ? pink : pink2);
        b.position.set((Math.random() - 0.5) * 1.6, 2.6 + Math.random() * 0.8, (Math.random() - 0.5) * 1.6);
        b.castShadow = true;
        g.add(b);
      }
      g.position.set(x, 0.12, 6.8);
      this.scene.add(g);
    }
    // toko tetangga sederhana
    for (const [x, c] of [
      [-13, '#e8d6b8'],
      [13, '#c8dce8'],
    ] as const) {
      const b = new T.Mesh(new T.BoxGeometry(6, 4.5, 7), std(c, 0.9));
      b.position.set(x, 2.25, -1);
      b.castShadow = b.receiveShadow = true;
      this.scene.add(b);
    }
  }

  /* ---------------- restoran (dibangun ulang saat keadaan berubah) ---------------- */

  private rebuild(s: RestoState) {
    for (const g of [this.shell, this.dyn]) {
      g.traverse((o) => {
        const m = o as T.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      g.clear();
    }
    this.lanterns = [];
    if (!s.location) return;
    const W = 5,
      D = 4,
      H = 3;
    // pondasi & lantai kayu
    const found = new T.Mesh(new T.BoxGeometry(W * 2 + 0.6, 0.2, D * 2 + 0.6), std('#b8b0a4', 0.95));
    found.position.y = 0.1;
    found.receiveShadow = true;
    this.shell.add(found);
    if (!s.contractor) return;
    const floorTex = canvasTex(256, 256, (g) => {
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#c49a6c' : '#b98d60';
        g.fillRect(0, i * 32, 256, 32);
        g.strokeStyle = 'rgba(60,35,15,.3)';
        g.strokeRect(0, i * 32, 256, 32);
      }
    });
    floorTex.wrapS = floorTex.wrapT = T.RepeatWrapping;
    floorTex.repeat.set(3, 3);
    this.textures.push(floorTex);
    const floor = new T.Mesh(new T.BoxGeometry(W * 2, 0.06, D * 2), std('#ffffff', 0.8, { map: floorTex }));
    floor.position.y = 0.23;
    floor.receiveShadow = true;
    this.shell.add(floor);
    // dapur berlantai ubin
    const tile = new T.Mesh(new T.BoxGeometry(W * 2, 0.065, 2.4), std('#e8e4dc', 0.5));
    tile.position.set(0, 0.235, -D + 1.2);
    this.shell.add(tile);
    // dinding (naik sesuai kemajuan pembangunan) — belakang & samping; depan setengah dengan pintu & jendela
    const wallM = std('#f4ecdc', 0.9);
    const woodM = std('#5a3a24', 0.7);
    const wall = (w: number, d: number, x: number, z: number) => {
      const m = new T.Mesh(new T.BoxGeometry(w, H, d).translate(0, H / 2, 0), wallM);
      m.position.set(x, 0.2, z);
      m.castShadow = m.receiveShadow = true;
      m.userData.wall = 'grow';
      this.shell.add(m);
    };
    wall(W * 2, 0.2, 0, -D);
    wall(0.2, D * 2, -W, 0);
    wall(0.2, D * 2, W, 0);
    const front = (w: number, x: number) => {
      const m = new T.Mesh(new T.BoxGeometry(w, 1.0, 0.2).translate(0, 0.5, 0), wallM);
      m.position.set(x, 0.2, D);
      m.userData.wall = 'grow';
      this.shell.add(m);
    };
    front(3.6, -3.2);
    front(3.6, 3.2);
    // tiang kayu gaya Jepang
    for (const x of [-W, -1.4, 1.4, W])
      for (const z of [-D, D]) {
        const p = new T.Mesh(new T.BoxGeometry(0.22, H + 0.3, 0.22).translate(0, (H + 0.3) / 2, 0), woodM);
        p.position.set(x, 0.2, z);
        p.castShadow = true;
        p.userData.wall = 'grow';
        this.shell.add(p);
      }
    const beam = new T.Mesh(new T.BoxGeometry(W * 2 + 0.4, 0.25, 0.25), woodM);
    beam.position.set(0, H + 0.3, D);
    beam.userData.wall = 'late';
    this.shell.add(beam);
    // noren (tirai pintu) biru tua bertuliskan 食
    const noren = canvasTex(256, 128, (g) => {
      g.fillStyle = '#1f2f5a';
      g.fillRect(0, 0, 256, 128);
      g.fillStyle = '#ffffff';
      g.font = '900 72px serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('食', 128, 64);
      g.fillStyle = '#f4ecdc';
      for (const x of [85, 170]) g.fillRect(x, 60, 4, 68);
    });
    this.textures.push(noren);
    const nr = new T.Mesh(new T.PlaneGeometry(2.6, 1.1), new T.MeshStandardMaterial({ map: noren, side: T.DoubleSide, roughness: 0.9 }));
    nr.position.set(0, H - 0.35, D + 0.12);
    nr.userData.wall = 'late';
    this.shell.add(nr);
    // papan nama
    const sign = canvasTex(512, 128, (g) => {
      g.fillStyle = '#3a2416';
      g.beginPath();
      g.roundRect(4, 4, 504, 120, 16);
      g.fill();
      g.strokeStyle = '#d9a441';
      g.lineWidth = 6;
      g.stroke();
      g.fillStyle = '#ffe08a';
      g.font = '900 52px system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(s.name.toUpperCase(), 256, 52);
      g.font = '700 26px serif';
      g.fillStyle = '#ffffff';
      g.fillText('日本料理 · Autentik Jepang', 256, 98);
    });
    this.textures.push(sign);
    const sg = new T.Mesh(new T.PlaneGeometry(4.6, 1.15), new T.MeshStandardMaterial({ map: sign, roughness: 0.6 }));
    sg.position.set(0, H + 1.0, D + 0.15);
    sg.userData.wall = 'late';
    this.shell.add(sg);
    // lampion merah di depan
    for (const x of [-2.2, 2.2]) {
      const l = new T.Mesh(new T.SphereGeometry(0.32, 16, 12), std('#e8322a', 0.5, { emissive: '#ff4a2a', emissiveIntensity: 0.5 }));
      l.scale.y = 1.3;
      l.position.set(x, H - 0.2, D + 0.5);
      l.userData.wall = 'late';
      this.shell.add(l);
      this.lanterns.push(l);
    }
    // perancah saat masih dibangun
    if (!s.handed) {
      const pole = std('#c9a24a', 0.6, { metalness: 0.4 });
      for (let x = -W; x <= W; x += 2.5)
        for (const z of [-D - 0.6, D + 0.6]) {
          const p = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, H + 1, 6), pole);
          p.position.set(x, (H + 1) / 2, z);
          this.shell.add(p);
        }
      return;
    }

    // ---------- isi: alat dapur, kasir, meja, dekorasi ----------
    const counterM = std('#8a5a34', 0.6),
      metal = std('#b8bec8', 0.35, { metalness: 0.7 });
    // meja pass (serah makanan) memanjang di antara dapur & ruang makan
    const pass = new T.Mesh(new T.BoxGeometry(8.6, 0.9, 0.5), counterM);
    pass.position.set(0, 0.68, -1.6);
    pass.castShadow = true;
    this.dyn.add(pass);
    const stationLook: Record<string, () => T.Object3D> = {
      goreng: () => {
        const g = new T.Group();
        const b = new T.Mesh(new T.BoxGeometry(1.2, 0.9, 0.8), metal);
        b.position.y = 0.68;
        const oil = new T.Mesh(new T.BoxGeometry(0.8, 0.05, 0.5), std('#e0a030', 0.2, { emissive: '#7a4a10', emissiveIntensity: 0.3 }));
        oil.position.y = 1.15;
        g.add(b, oil);
        return g;
      },
      kompor: () => {
        const g = new T.Group();
        const b = new T.Mesh(new T.BoxGeometry(1.4, 0.9, 0.8), metal);
        b.position.y = 0.68;
        g.add(b);
        for (const x of [-0.35, 0.35]) {
          const pot = new T.Mesh(new T.CylinderGeometry(0.25, 0.22, 0.35, 16), std('#6a6e74', 0.3, { metalness: 0.8 }));
          pot.position.set(x, 1.3, 0);
          g.add(pot);
        }
        return g;
      },
      sushi: () => {
        const g = new T.Group();
        const b = new T.Mesh(new T.BoxGeometry(1.4, 0.9, 0.8), std('#d8b88a', 0.6));
        b.position.y = 0.68;
        const board = new T.Mesh(new T.BoxGeometry(0.8, 0.05, 0.4), std('#f0dcb0', 0.6));
        board.position.y = 1.15;
        g.add(b, board);
        return g;
      },
      minum: () => {
        const g = new T.Group();
        const b = new T.Mesh(new T.BoxGeometry(1.1, 0.9, 0.7), std('#3f7a6a', 0.6));
        b.position.y = 0.68;
        const pot = new T.Mesh(new T.SphereGeometry(0.18, 12, 10), std('#6a8a5a', 0.4));
        pot.position.y = 1.3;
        g.add(b, pot);
        return g;
      },
    };
    for (const [id, p] of Object.entries(this.stationPos))
      if (s.equipment.includes(id)) {
        const o = stationLook[id]();
        o.position.copy(p);
        o.traverse((x) => ((x as T.Mesh).isMesh ? (x.castShadow = true) : null));
        this.dyn.add(o);
      }
    if (s.equipment.includes('ricecooker')) {
      const rc = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.4, 16), std('#f4f4f4', 0.4));
      rc.position.set(4.2, 1.33, -3.2);
      const tbl = new T.Mesh(new T.BoxGeometry(1, 0.9, 0.7), metal);
      tbl.position.set(4.2, 0.68, -3.2);
      this.dyn.add(tbl, rc);
    }
    if (s.equipment.includes('kulkas')) {
      const k = new T.Mesh(new T.BoxGeometry(0.9, 2.1, 0.8), std('#e8ecf0', 0.3, { metalness: 0.3 }));
      k.position.set(-4.4, 1.28, -2.2);
      k.castShadow = true;
      this.dyn.add(k);
    }
    if (s.equipment.includes('kasir')) {
      const c = new T.Mesh(new T.BoxGeometry(1.6, 1.0, 0.7), counterM);
      c.position.set(this.counter.x, 0.73, this.counter.z - 0.6);
      const reg = new T.Mesh(new T.BoxGeometry(0.4, 0.25, 0.3), std('#2c2f38', 0.4));
      reg.position.set(this.counter.x, 1.36, this.counter.z - 0.6);
      const neko = new T.Mesh(new T.SphereGeometry(0.14, 12, 10), std('#ffffff', 0.5)); // kucing keberuntungan
      neko.position.set(this.counter.x + 0.55, 1.37, this.counter.z - 0.6);
      this.dyn.add(c, reg, neko);
    }
    // meja makan 4 kursi (grid di ruang makan)
    this.tablePos = [];
    const slots: [number, number][] = [];
    for (const z of [0.2, 2.2]) for (const x of [-0.4, 1.6, 3.6]) slots.push([x, z]);
    for (const x of [-4.2]) for (const z of [-0.6, 1.4, 3.2]) slots.push([x, z]);
    for (let i = 0; i < Math.min(s.tables, slots.length); i++) {
      const [x, z] = slots[i];
      const g = new T.Group();
      const top = new T.Mesh(new T.BoxGeometry(1.2, 0.08, 0.9), std('#6a4428', 0.6));
      top.position.y = 0.95;
      const leg = new T.Mesh(new T.CylinderGeometry(0.06, 0.08, 0.7, 8), std('#3a2416', 0.6));
      leg.position.y = 0.58;
      g.add(top, leg);
      for (const [cx, cz] of [
        [-0.45, -0.7],
        [0.45, -0.7],
        [-0.45, 0.7],
        [0.45, 0.7],
      ]) {
        const seat = new T.Mesh(new T.BoxGeometry(0.4, 0.06, 0.4), std('#a86a3a', 0.7));
        seat.position.set(cx, 0.65, cz);
        g.add(seat);
      }
      g.position.set(x, 0.2, z);
      g.traverse((o) => ((o as T.Mesh).isMesh ? (o.castShadow = true) : null));
      this.dyn.add(g);
      this.tablePos.push(new T.Vector3(x, 0, z));
    }
    // dekorasi tema
    if (s.decor === 'kedai' || s.decor === 'taman') {
      for (const x of [-3, 0, 3]) {
        const l = new T.Mesh(new T.SphereGeometry(0.22, 14, 10), std('#e8322a', 0.5, { emissive: '#ff4a2a', emissiveIntensity: 0.6 }));
        l.scale.y = 1.3;
        l.position.set(x, 2.9, 1.2);
        this.dyn.add(l);
        this.lanterns.push(l);
      }
    }
    if (s.decor === 'taman') {
      const pond = new T.Mesh(new T.CircleGeometry(0.8, 24), std('#3a7a9a', 0.1, { metalness: 0.3 }));
      pond.rotation.x = -Math.PI / 2;
      pond.position.set(4.1, 0.28, 3.3);
      this.dyn.add(pond);
      for (let k = 0; k < 2; k++) {
        const koi = new T.Mesh(new T.SphereGeometry(0.1, 8, 6), std(k ? '#ff8a2a' : '#ffffff', 0.4));
        koi.scale.set(1, 0.5, 2);
        koi.position.set(4.1, 0.3, 3.3);
        koi.userData.koi = k;
        this.dyn.add(koi);
      }
      for (let k = 0; k < 5; k++) {
        const bam = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 2.6, 8), std('#7ab04a', 0.6));
        bam.position.set(4.6, 1.5, -0.6 + k * 0.25);
        this.dyn.add(bam);
      }
    }
  }

  /** Samakan tampilan dengan keadaan game (dipanggil setiap render React). */
  sync(s: RestoState) {
    const key = [s.location, s.contractor, s.handed, s.equipment.join(','), s.tables, s.decor, s.name].join('|');
    if (key !== this.key) {
      this.key = key;
      this.rebuild(s);
    }
    const c = s.contractor ? (s.handed ? 1 : 1 - s.buildLeft / Math.max(1, [4, 3, 2][['hemat', 'standar', 'cepat'].indexOf(s.contractor)])) : 0;
    this.buildK = c;
    // staf
    const want = new Set(s.handed ? s.staff.map((m) => m.id) : []);
    for (const [id, a] of this.staffActors)
      if (!want.has(id)) {
        this.people.remove(a.obj);
        this.staffActors.delete(id);
      }
    for (const m of s.handed ? s.staff : []) {
      if (this.staffActors.has(m.id)) continue;
      const colors = { kasir: '#c8342a', koki: '#ffffff', pelayan: '#1f2f5a', kebersihan: '#6aa84f' } as const;
      const o = person(colors[m.role], '#f0c8a0', m.role === 'koki' ? '#ffffff' : m.role === 'pelayan' ? '#1f2f5a' : undefined);
      const home = this.staffHome(m.role, [...this.staffActors.keys()].length);
      o.position.copy(home);
      this.people.add(o);
      this.staffActors.set(m.id, { obj: o, pos: home.clone(), target: home.clone(), food: [], bubble: null });
    }
  }

  private staffHome(role: string, i: number) {
    if (role === 'kasir') return new T.Vector3(this.counter.x, 0.23, this.counter.z - 1.2);
    if (role === 'koki') return this.stationPos[['goreng', 'kompor', 'sushi', 'minum'][i % 4]].clone().add(new T.Vector3(0, 0.23, -0.7));
    if (role === 'pelayan') return new T.Vector3(1.5, 0.23, -1.1);
    return new T.Vector3(4.2, 0.23, -1.0);
  }

  /** Posisi & gerak pelanggan/staf mengikuti simulasi yang sedang berjalan. */
  syncRun(s: RestoState, run: DayRun | null) {
    const seen = new Set<number>();
    if (run) {
      let qi = 0;
      for (const g of run.groups) {
        seen.add(g.id);
        let a = this.actors.get(g.id);
        if (!a) {
          const o = new T.Group();
          for (let k = 0; k < g.size; k++) {
            const p = person(SEG_COLOR[g.seg], ['#f0c8a0', '#d9a47a', '#e8b890'][k % 3]);
            if (g.seg === 'keluarga' && k >= 2) p.scale.setScalar(0.72);
            p.position.set((k % 2) * 0.5 - 0.25, 0, Math.floor(k / 2) * 0.5);
            o.add(p);
          }
          const start = this.door.clone().add(new T.Vector3(0, 0.23, 2.5));
          o.position.copy(start);
          this.people.add(o);
          a = { obj: o, pos: start.clone(), target: start.clone(), food: [], bubble: null };
          this.actors.set(g.id, a);
          const b = new T.Sprite(new T.SpriteMaterial({ map: this.greet, transparent: true, depthWrite: false }));
          b.scale.set(1.6, 0.6, 1);
          b.position.set(0, 2.0, 0);
          b.userData.until = this.t + 2.5;
          o.add(b);
          a.bubble = b;
        }
        if (g.state === 'queue') {
          a.target.set(this.counter.x + 0.2, 0.23, this.counter.z + 0.6 + qi * 0.9);
          qi++;
        } else if (g.state === 'order') a.target.set(this.counter.x + 0.2, 0.23, this.counter.z + 0.3);
        else if (g.state === 'leave') a.target.copy(this.door).add(new T.Vector3(0, 0.23, 3));
        else if (g.table >= 0 && this.tablePos[g.table]) a.target.copy(this.tablePos[g.table]).add(new T.Vector3(0, 0.23, 0.7));
        // makanan di meja
        const showFood = g.state === 'eat';
        if (showFood && !a.food.length && this.tablePos[g.table]) {
          g.items.forEach((it, k) => {
            const m = MENUS.find((x) => x.id === it.menu)!;
            const sp = new T.Sprite(new T.SpriteMaterial({ map: emojiTex(m.emoji), transparent: true }));
            sp.scale.setScalar(0.45);
            sp.position.copy(this.tablePos[g.table]).add(new T.Vector3(-0.4 + (k % 4) * 0.27, 1.35, -0.15 + Math.floor(k / 4) * 0.25));
            this.scene.add(sp);
            a!.food.push(sp);
          });
        }
        if (!showFood && a.food.length) this.clearFood(a);
      }
    }
    for (const [id, a] of this.actors)
      if (!seen.has(id)) {
        this.clearFood(a);
        a.target.copy(this.door).add(new T.Vector3(0, 0.23, 6));
        if (a.obj.position.distanceTo(a.target) < 0.5) {
          this.people.remove(a.obj);
          this.actors.delete(id);
        }
      }
    // staf bergerak: pelayan ke meja yang sedang dilayani, kebersihan ke meja kotor
    if (run) {
      const serving = run.groups.find((g) => g.state === 'wait' && g.items.every((i) => i.done));
      const dirty = run.tables.findIndex((tb) => tb.dirty);
      for (const m of s.staff) {
        const a = this.staffActors.get(m.id);
        if (!a) continue;
        if (m.role === 'pelayan' && serving && this.tablePos[serving.table]) a.target.copy(this.tablePos[serving.table]).add(new T.Vector3(0.8, 0.23, 0));
        else if (m.role === 'kebersihan' && dirty >= 0 && this.tablePos[dirty]) a.target.copy(this.tablePos[dirty]).add(new T.Vector3(-0.8, 0.23, 0));
        else a.target.copy(this.staffHome(m.role, [...this.staffActors.keys()].indexOf(m.id)));
      }
    }
  }

  private clearFood(a: Actor) {
    for (const f of a.food) this.scene.remove(f);
    a.food = [];
  }

  private resize() {
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.fov = w < h ? 55 : 40;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.t += dt;
    // kamera mengorbit restoran
    const d = this.dist;
    this.camera.position.set(Math.sin(this.yaw) * Math.cos(this.pitch) * d, Math.sin(this.pitch) * d, Math.cos(this.yaw) * Math.cos(this.pitch) * d);
    this.camera.lookAt(0, 0.8, 0.5);
    // dinding naik sesuai pembangunan
    this.shell.traverse((o) => {
      if (o.userData.wall === 'grow') o.scale.y = T.MathUtils.damp(o.scale.y, Math.max(0.02, this.buildK), 3, dt);
      else if (o.userData.wall === 'late') o.visible = this.buildK > 0.98;
    });
    for (const [i, l] of this.lanterns.entries()) l.rotation.z = Math.sin(this.t * 1.5 + i) * 0.08;
    this.dyn.traverse((o) => {
      if (o.userData.koi === undefined) return;
      const a = this.t * 0.8 + o.userData.koi * Math.PI;
      o.position.set(4.1 + Math.cos(a) * 0.45, 0.3, 3.3 + Math.sin(a) * 0.45);
      o.rotation.y = -a;
    });
    // tokoh berjalan menuju target
    for (const a of [...this.actors.values(), ...this.staffActors.values()]) {
      const to = a.target.clone().sub(a.obj.position);
      to.y = 0;
      const dd = to.length();
      if (dd > 0.05) {
        const step = Math.min(dd, dt * 2.6);
        a.obj.position.addScaledVector(to.normalize(), step);
        a.obj.rotation.y = Math.atan2(to.x, to.z);
        a.obj.position.y = 0.23 + Math.abs(Math.sin(this.t * 10)) * 0.05;
      } else a.obj.position.y = 0.23;
      if (a.bubble) {
        a.bubble.visible = this.t < (a.bubble.userData.until as number);
      }
    }
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.scene.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
      const mt = m.material as T.Material | T.Material[] | undefined;
      if (Array.isArray(mt)) mt.forEach((x) => x.dispose());
      else mt?.dispose();
    });
    this.textures.forEach((t) => t.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
