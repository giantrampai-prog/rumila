// Mesin 3D Kebun Buah (mode jelajah): anak berjalan di kebun, mendekati tanaman, lalu mengetuk buahnya.
// Kamera mengikuti dari belakang-atas dengan gerak kalem (tanpa putar/goyang yang memusingkan).
// Kontrol: joystick (kiri bawah), ketuk tanah untuk berjalan ke sana, ketuk tanaman untuk menghampirinya,
// dan tombol panah/WASD di keyboard.

import * as T from 'three';
import { flag } from '@/components/roket/details';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { GARDEN, ZONE_DIR, ZONE_NAME, buildPlots, plotRadius, type Plot } from '@/lib/fruits/garden';
import { Merge, buildPlant, mat, rnd, swayMaterial } from './build';

export interface GardenCallbacks {
  /** tanaman terdekat dalam jangkauan (null = tidak ada) */
  onNear: (id: string | null) => void;
  /** tiba di tanaman yang diketuk */
  onArrive: (id: string) => void;
}

interface Marker {
  plot: Plot;
  sprite: T.Sprite;
  top: number;
  found: boolean;
}

interface Butterfly {
  g: T.Group;
  wings: T.Object3D[];
  c: T.Vector3;
  ph: number;
  r: number;
}

/** Posisi pemain disimpan antarkunjungan (kembali dari detail tidak mengulang dari alun-alun). */
let lastPos: [number, number, number] | null = null;

const SKY_TOP = new T.Color('#6ec3f5');
const SKY_LOW = new T.Color('#dff3ff');

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

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Balon tanda tanya untuk buah yang belum ditemukan. */
const questionTex = () =>
  canvasTex(128, 150, (g) => {
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath();
    g.arc(66, 66, 58, 0, 7);
    g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(64, 62, 58, 0, 7);
    g.fill();
    g.beginPath();
    g.moveTo(50, 112);
    g.lineTo(64, 146);
    g.lineTo(78, 112);
    g.fill();
    g.fillStyle = '#ff7a1a';
    g.font = '900 82px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('?', 64, 68);
  });

/** Papan kayu bertulisan (nama petak, gerbang). */
function signTex(text: string, color: string) {
  return canvasTex(512, 160, (g) => {
    g.fillStyle = '#b07a45';
    roundRect(g, 4, 4, 504, 152, 30);
    g.fill();
    g.fillStyle = '#c98f55';
    roundRect(g, 16, 16, 480, 128, 22);
    g.fill();
    g.fillStyle = color;
    roundRect(g, 28, 28, 456, 104, 18);
    g.fill();
    g.fillStyle = '#fff';
    g.font = '800 54px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 256, 82);
  });
}

export class GardenEngine {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(45, 1, 0.3, 260);
  private clock = new T.Clock();
  private uTime = { value: 0 };
  private host: HTMLElement;
  private cb: GardenCallbacks;
  private raf = 0;
  private active = true;
  private disposed = false;
  private ro: ResizeObserver;

  readonly plots = buildPlots();
  private markers: Marker[] = [];
  private qTex = questionTex();
  private thumbTex = new Map<string, T.Texture>();

  // pemain
  private player = new T.Group();
  private parts: { legL: T.Object3D; legR: T.Object3D; armL: T.Object3D; armR: T.Object3D; body: T.Object3D; basket: T.Group } = null!;
  private pos = new T.Vector3();
  private heading = 0;
  private speed = 0;
  private walkPh = 0;
  private stick = new T.Vector2();
  private keys = new Set<string>();
  private target: T.Vector3 | null = null;
  private targetPlot: Plot | null = null;
  private near: string | null = null;
  private tapRing: T.Mesh;
  private tapT = 1;

  private camPos = new T.Vector3();
  private camLook = new T.Vector3();
  private portrait = false;

  private windmill!: T.Object3D;
  private water!: T.ShaderMaterial;
  private flags: T.ShaderMaterial[] = [];
  private clouds: T.Object3D[] = [];
  private butterflies: Butterfly[] = [];
  private sparkles!: T.Points;
  private sparkleOn!: T.BufferAttribute;
  private fly: { mesh: T.Mesh; from: T.Vector3; t: number }[] = [];
  private basketFruits = 0;
  private obstacles: { x: number; z: number; r: number }[] = [];

  constructor(host: HTMLElement, cb: GardenCallbacks) {
    this.host = host;
    this.cb = cb;
    this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);

    this.scene.fog = new T.Fog(SKY_LOW, 55, 150);
    this.scene.add(new T.HemisphereLight('#d8efff', '#6f9a45', 1.15));
    const sun = new T.DirectionalLight('#fff1d6', 1.9);
    sun.position.set(30, 60, 25);
    this.scene.add(sun);

    this.buildSky();
    this.buildGround();
    this.buildPlants();
    this.buildDecor();
    this.buildPlayer();

    this.tapRing = new T.Mesh(new T.RingGeometry(0.35, 0.55, 28), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
    this.tapRing.rotation.x = -Math.PI / 2;
    this.scene.add(this.tapRing);

    if (lastPos) this.pos.set(...lastPos);
    else this.pos.set(0, 0, 4.5);
    this.player.position.copy(this.pos);
    this.heading = Math.PI; // menghadap ke kebun (menjauhi kamera)
    this.player.rotation.y = this.heading;

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.snapCamera();
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKey);
    this.loop();
  }

  /* ---------------- dunia ---------------- */

  private buildSky() {
    const geo = new T.SphereGeometry(200, 24, 12);
    const m = new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { top: { value: SKY_TOP }, low: { value: SKY_LOW } },
      vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 low; varying float h; void main(){ gl_FragColor = vec4(mix(low, top, smoothstep(-0.02, 0.45, h)), 1.0); }',
    });
    this.scene.add(new T.Mesh(geo, m));

    // awan empuk yang melayang pelan
    const white = new T.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, emissive: '#ffffff', emissiveIntensity: 0.25 });
    const r = rnd(7);
    for (let i = 0; i < 11; i++) {
      const c = new Merge();
      for (let k = 0; k < 5; k++) c.add(new T.IcosahedronGeometry(2.2 + r() * 1.6, 1), mat((k - 2) * 2.4, r() * 1.2, r() * 1.5, 0, 0, 0, 1, 0.7, 1), '#ffffff');
      const mesh = c.build(white);
      mesh.matrixAutoUpdate = true;
      mesh.position.set((r() - 0.5) * 160, 26 + r() * 10, -30 - r() * 90);
      this.scene.add(mesh);
      this.clouds.push(mesh);
    }
  }

  private buildGround() {
    const H = GARDEN.half;
    // rumput bergelombang lembut dengan warna belang (lebih hidup daripada satu warna)
    const size = 240,
      seg = 120;
    const geo = new T.PlaneGeometry(size, size, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const a = new T.Color('#79c257'),
      b = new T.Color('#5faa45'),
      c = new T.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        z = pos.getZ(i);
      const out = Math.max(0, Math.max(Math.abs(x), Math.abs(z)) - H - 4);
      pos.setY(i, out > 0 ? Math.pow(out, 1.25) * 0.28 * (0.7 + 0.3 * Math.sin(x * 0.08) * Math.cos(z * 0.07)) : 0);
      const n = 0.5 + 0.25 * Math.sin(x * 0.21 + Math.cos(z * 0.13) * 2) + 0.25 * Math.sin(z * 0.19 + x * 0.05);
      // belang potongan rumput (seperti lapangan yang dirawat)
      const stripe = Math.floor((x + 200) / 4) % 2 ? 0.04 : 0;
      c.copy(a).lerp(b, n).offsetHSL(0, 0, stripe - (out > 0 ? 0.04 : 0));
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    this.scene.add(new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 })));

    // jalan tanah: salib utama + jalan kecil antarbaris tanaman + alun-alun bundar
    const path = new Merge();
    const dirt = '#d9b27a';
    const W = GARDEN.path;
    path.add(new T.PlaneGeometry(W * 2, H * 2 + 2), mat(0, 0.02, 0, -Math.PI / 2), dirt, 0, 0, 0.05);
    path.add(new T.PlaneGeometry(H * 2 + 2, W * 2), mat(0, 0.021, 0, -Math.PI / 2), dirt, 0, 0, 0.05);
    path.add(new T.CircleGeometry(GARDEN.plaza, 40), mat(0, 0.025, 0, -Math.PI / 2), '#e3c290');
    path.add(new T.RingGeometry(GARDEN.plaza - 0.4, GARDEN.plaza, 40), mat(0, 0.028, 0, -Math.PI / 2), '#c79c63');
    // jalan setapak di depan tiap baris tanaman
    for (const [sx, sz] of Object.values(ZONE_DIR))
      for (let r = 0; r < 5; r++) {
        const zz = sz * (GARDEN.first + r * GARDEN.step + GARDEN.step / 2);
        path.add(new T.PlaneGeometry(36, 1.3), mat(sx * 21, 0.018, zz, -Math.PI / 2), '#cfa46c', 0, 0, 0.06);
      }
    // batu pijakan di alun-alun
    const r = rnd(3);
    for (let i = 0; i < 26; i++) {
      const ang = r() * 6.28,
        d = 2 + r() * (GARDEN.plaza - 3);
      path.add(new T.CircleGeometry(0.3 + r() * 0.25, 7), mat(Math.cos(ang) * d, 0.032, Math.sin(ang) * d, -Math.PI / 2), '#cdb08a');
    }
    this.scene.add(path.build(new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 })));
  }

  private buildPlants() {
    const plant = new Merge(),
      fruit = new Merge();
    this.plots.forEach((p, i) => {
      const top = buildPlant({ plant, fruit }, p, i + 1);
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: this.qTex, depthWrite: false }));
      sprite.scale.set(1.1, 1.29, 1);
      sprite.position.set(p.x, top + 1, p.z);
      sprite.renderOrder = 5;
      this.scene.add(sprite);
      this.markers.push({ plot: p, sprite, top, found: false });
      this.obstacles.push({ x: p.x, z: p.z, r: plotRadius(p) });
    });
    this.scene.add(plant.build(swayMaterial(this.uTime, { roughness: 0.85, flatShading: true })));
    this.scene.add(fruit.build(swayMaterial(this.uTime, { roughness: 0.42 })));

    // kilau di sekitar buah yang belum ditemukan
    const n = this.plots.length * 6;
    const pos = new Float32Array(n * 3),
      ph = new Float32Array(n),
      on = new Float32Array(n);
    const r = rnd(11);
    this.markers.forEach((m, i) => {
      for (let k = 0; k < 6; k++) {
        const j = i * 6 + k,
          a = r() * 6.28,
          d = 0.8 + r() * 1.2;
        pos.set([m.plot.x + Math.cos(a) * d, 0.6 + r() * (m.top - 0.3), m.plot.z + Math.sin(a) * d], j * 3);
        ph[j] = r() * 6.28;
        on[j] = 1;
      }
    });
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('aPh', new T.BufferAttribute(ph, 1));
    this.sparkleOn = new T.BufferAttribute(on, 1);
    g.setAttribute('aOn', this.sparkleOn);
    this.sparkles = new T.Points(
      g,
      new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        uniforms: { uTime: this.uTime, uScale: { value: 300 } },
        vertexShader: `attribute float aPh; attribute float aOn; uniform float uTime; uniform float uScale; varying float vA;
          void main(){ vec3 p = position; p.y += sin(uTime*0.8 + aPh)*0.25;
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            vA = aOn * pow(max(0.0, sin(uTime*2.2 + aPh*3.0)), 3.0);
            gl_PointSize = uScale * 0.22 / -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d);
            float star = max(0.0, 1.0 - r*2.0) + max(0.0, 0.06 - abs(d.x)*abs(d.y)*40.0);
            gl_FragColor = vec4(1.0, 0.93, 0.55, star * vA); }`,
      }),
    );
    this.scene.add(this.sparkles);
  }

  private buildDecor() {
    const H = GARDEN.half;
    const deco = new Merge();
    const r = rnd(21);
    const wood = '#a8743f';

    // pagar keliling
    for (const s of [-1, 1])
      for (let i = -H; i <= H; i += 2.2) {
        if (Math.abs(i) < 3.2) continue; // gerbang di ujung jalan
        deco.add(new T.BoxGeometry(0.22, 1.2, 0.22), mat(i, 0.6, s * H), wood);
        deco.add(new T.BoxGeometry(0.22, 1.2, 0.22), mat(s * H, 0.6, i), wood);
      }
    for (const s of [-1, 1])
      for (const y of [0.45, 0.9])
        for (const half of [-1, 1]) {
          const len = H - 3.2;
          deco.add(new T.BoxGeometry(len, 0.12, 0.08), mat(half * (3.2 + len / 2), y, s * H), '#c08a50');
          deco.add(new T.BoxGeometry(0.08, 0.12, len), mat(s * H, y, half * (3.2 + len / 2)), '#c08a50');
        }

    // pepohonan & bukit di luar pagar (latar)
    for (let i = 0; i < 90; i++) {
      const side = i % 4,
        t = (r() - 0.5) * 2 * (H + 20),
        d = H + 5 + r() * 22;
      const x = side === 0 ? t : side === 1 ? t : side === 2 ? d : -d;
      const z = side === 0 ? -d : side === 1 ? d : t;
      const y = Math.pow(Math.max(0, Math.max(Math.abs(x), Math.abs(z)) - H - 4), 1.25) * 0.28 * 0.7;
      const s = 1.2 + r() * 1.4;
      deco.add(new T.CylinderGeometry(0.25 * s, 0.35 * s, 2 * s, 6), mat(x, y + s, z), '#7a5030');
      deco.add(new T.ConeGeometry(1.5 * s, 3.8 * s, 7), mat(x, y + 3.6 * s, z, 0, r() * 3, 0), r() > 0.5 ? '#3f8a3a' : '#357a34', 0, 0, 0.12);
    }

    // bunga-bunga & rumput liar (hindari jalan dan tanaman)
    const flowerC = ['#ff6b8b', '#ffd23f', '#ffffff', '#b58cff', '#ff9f43'];
    const clear = (x: number, z: number) =>
      Math.abs(x) > GARDEN.path + 0.6 && Math.abs(z) > GARDEN.path + 0.6 && Math.hypot(x, z) > GARDEN.plaza + 0.5 && !this.plots.some((p) => Math.hypot(p.x - x, p.z - z) < 2.2);
    for (let i = 0; i < 1400; i++) {
      const x = (r() - 0.5) * 2 * (H - 1),
        z = (r() - 0.5) * 2 * (H - 1);
      if (!clear(x, z)) continue;
      if (i % 4 === 0) {
        deco.add(new T.CylinderGeometry(0.02, 0.02, 0.4, 3), mat(x, 0.2, z), '#3f8a35', 0.08, 0);
        deco.add(new T.IcosahedronGeometry(0.11, 0), mat(x, 0.42, z), flowerC[i % 5], 0.08, 0);
      } else deco.add(new T.ConeGeometry(0.09, 0.5 + r() * 0.3, 3), mat(x, 0.25, z, (r() - 0.5) * 0.4, r() * 3, 0), r() > 0.5 ? '#4f9a3a' : '#66b24a', 0.12, 0);
    }

    // sumur di alun-alun
    deco.add(new T.CylinderGeometry(1.1, 1.2, 0.9, 14, 1, true), mat(0, 0.45, 0), '#b9b2a6', 0, 0, 0.1);
    deco.add(new T.TorusGeometry(1.12, 0.14, 6, 18), mat(0, 0.92, 0, Math.PI / 2), '#a39b8f');
    deco.add(new T.CircleGeometry(1.05, 16), mat(0, 0.5, 0, -Math.PI / 2), '#3d8fd1');
    for (const s of [-1, 1]) deco.add(new T.BoxGeometry(0.16, 2.2, 0.16), mat(s * 1.05, 1.5, 0), wood);
    deco.add(new T.ConeGeometry(1.7, 1, 4), mat(0, 3, 0, 0, Math.PI / 4, 0, 1, 1, 0.75), '#d9534f');
    deco.add(new T.CylinderGeometry(0.06, 0.06, 2, 6), mat(0, 2.3, 0, 0, 0, Math.PI / 2), wood);
    deco.add(new T.CylinderGeometry(0.22, 0.18, 0.35, 8), mat(0, 1.7, 0), '#8a5a34');
    this.obstacles.push({ x: 0, z: 0, r: 1.5 });

    // bangku di alun-alun
    for (const a of [0.8, 2.35, 3.95, 5.5]) {
      const x = Math.cos(a) * 5.2,
        z = Math.sin(a) * 5.2;
      deco.add(new T.BoxGeometry(1.8, 0.12, 0.55), mat(x, 0.5, z, 0, -a + Math.PI / 2, 0), '#b07a45');
      deco.add(new T.BoxGeometry(1.8, 0.5, 0.1), mat(x + Math.cos(a) * 0.28, 0.8, z + Math.sin(a) * 0.28, 0, -a + Math.PI / 2, 0), '#b07a45');
    }

    // petak tenggara: rumah kebun, kolam, kincir angin, orang-orangan sawah
    const hx = 22,
      hz = 14;
    deco.add(new T.BoxGeometry(7, 3.6, 5.5), mat(hx, 1.8, hz), '#f4e3c3');
    deco.add(new T.BoxGeometry(7.2, 0.4, 5.7), mat(hx, 0.2, hz), '#c9a47a');
    deco.add(new T.CylinderGeometry(0.01, 4.7, 2.6, 4, 1), mat(hx, 4.9, hz, 0, Math.PI / 4, 0, 1.18, 1, 0.92), '#d9534f', 0, 0, 0.06);
    deco.add(new T.BoxGeometry(1.3, 2.2, 0.1), mat(hx, 1.1, hz - 2.78), '#8a5a34');
    for (const s of [-1, 1]) {
      deco.add(new T.BoxGeometry(1.2, 1.1, 0.1), mat(hx + s * 2.2, 2.1, hz - 2.78), '#8fd3ff');
      deco.add(new T.BoxGeometry(1.4, 0.14, 0.16), mat(hx + s * 2.2, 1.5, hz - 2.8), '#fff');
      deco.add(new T.BoxGeometry(0.5, 0.35, 0.4), mat(hx + s * 2.2, 1.3, hz - 3), '#c0703f'); // pot bunga
      deco.add(new T.IcosahedronGeometry(0.28, 0), mat(hx + s * 2.2, 1.6, hz - 3), '#ff6b8b');
    }
    deco.add(new T.BoxGeometry(0.7, 1.4, 0.7), mat(hx + 2.2, 6, hz + 1), '#b9b2a6'); // cerobong
    this.obstacles.push({ x: hx - 2.2, z: hz, r: 2.6 }, { x: hx + 2.2, z: hz, r: 2.6 });
    // peti buah di depan rumah
    for (let i = 0; i < 3; i++) {
      deco.add(new T.BoxGeometry(0.9, 0.6, 0.7), mat(hx - 3.5 + i * 1.05, 0.3, hz - 4), '#c08a50');
      const fc = ['#e8463a', '#ffb627', '#7bc043'][i];
      for (let k = 0; k < 4; k++) deco.add(new T.SphereGeometry(0.16, 7, 5), mat(hx - 3.75 + i * 1.05 + (k % 2) * 0.35, 0.68, hz - 4.15 + Math.floor(k / 2) * 0.3), fc);
    }
    this.obstacles.push({ x: hx - 2.45, z: hz - 4, r: 1.5 });

    // kolam
    const px = 12,
      pz = 30;
    deco.add(new T.CircleGeometry(5.6, 28), mat(px, 0.03, pz, -Math.PI / 2, 0, 0, 1.3, 1, 1), '#c9b28a');
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * 6.28;
      deco.add(new T.DodecahedronGeometry(0.45 + r() * 0.3, 0), mat(px + Math.cos(a) * 6.4, 0.15, pz + Math.sin(a) * 5, r(), r(), 0, 1, 0.6, 1), '#9e978c');
    }
    this.water = new T.ShaderMaterial({
      uniforms: { uTime: this.uTime },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime; varying vec2 vUv;
        void main(){ vec2 p = vUv*8.0; float w = sin(p.x*1.7 + uTime*0.9) * sin(p.y*1.3 - uTime*0.7) + sin((p.x+p.y)*2.1 + uTime*1.3)*0.5;
          vec3 c = mix(vec3(0.24,0.62,0.86), vec3(0.45,0.8,0.95), smoothstep(-0.4, 1.2, w));
          c += smoothstep(1.05, 1.4, w) * 0.35;
          gl_FragColor = vec4(c, 1.0); }`,
    });
    const pond = new T.Mesh(new T.CircleGeometry(5.2, 32), this.water);
    pond.rotation.x = -Math.PI / 2;
    pond.scale.set(1.25, 1, 1);
    pond.position.set(px, 0.06, pz);
    this.scene.add(pond);
    for (let i = 0; i < 5; i++) deco.add(new T.CircleGeometry(0.55, 10, 0.4, 5.6), mat(px - 3 + r() * 6, 0.08, pz - 2 + r() * 4, -Math.PI / 2, 0, r() * 6), '#5aa843');
    this.obstacles.push({ x: px - 2.5, z: pz, r: 4.4 }, { x: px + 2.5, z: pz, r: 4.4 });

    // kincir angin
    const wx = 34,
      wz = 30;
    deco.add(new T.CylinderGeometry(1, 1.8, 8, 8), mat(wx, 4, wz), '#f2e8d8');
    deco.add(new T.ConeGeometry(1.5, 2, 8), mat(wx, 9, wz), '#d9534f');
    deco.add(new T.BoxGeometry(1, 1.8, 0.1), mat(wx, 0.9, wz - 1.72), '#8a5a34');
    this.obstacles.push({ x: wx, z: wz, r: 2.2 });
    const mill = new T.Group();
    const blade = new T.MeshStandardMaterial({ color: '#fdf6ea', roughness: 0.8, flatShading: true });
    for (let i = 0; i < 4; i++) {
      const b = new T.Mesh(new T.BoxGeometry(0.9, 4.2, 0.08), blade);
      b.position.y = 2.2;
      const arm = new T.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      arm.add(b);
      mill.add(arm);
    }
    mill.add(new T.Mesh(new T.SphereGeometry(0.35, 10, 8), new T.MeshStandardMaterial({ color: '#8a5a34' })));
    mill.position.set(wx, 7.6, wz - 1.6);
    this.scene.add(mill);
    this.windmill = mill;

    // orang-orangan sawah
    const sx = 30,
      sz = 20;
    deco.add(new T.BoxGeometry(0.12, 2.4, 0.12), mat(sx, 1.2, sz), wood);
    deco.add(new T.BoxGeometry(1.8, 0.12, 0.12), mat(sx, 1.9, sz), wood);
    deco.add(new T.BoxGeometry(0.8, 0.9, 0.4), mat(sx, 1.7, sz), '#3f7fd1');
    deco.add(new T.SphereGeometry(0.34, 10, 8), mat(sx, 2.55, sz), '#e8c872');
    deco.add(new T.CylinderGeometry(0.75, 0.75, 0.06, 14), mat(sx, 2.8, sz), '#d9b25a');
    deco.add(new T.CylinderGeometry(0.3, 0.36, 0.35, 12), mat(sx, 2.98, sz), '#d9b25a');
    this.obstacles.push({ x: sx, z: sz, r: 0.6 });

    // papan nama petak di sudut alun-alun + gerbang utama
    const signs: [string, string, number, number][] = [
      [ZONE_NAME.sehari, '#ff7a1a', -1, -1],
      [ZONE_NAME.nusantara, '#1fbf62', 1, -1],
      [ZONE_NAME.toko, '#8b45f5', -1, 1],
    ];
    for (const [text, color, sx2, sz2] of signs) {
      const x = sx2 * 4.3,
        z = sz2 * 4.3 + (sz2 < 0 ? -1.8 : 1.8);
      for (const o of [-1.1, 1.1]) deco.add(new T.BoxGeometry(0.16, 2.2, 0.16), mat(x + sx2 * 0 + o, 1.1, z), wood);
      const board = new T.Mesh(new T.PlaneGeometry(2.9, 0.9), new T.MeshStandardMaterial({ map: signTex(text, color), roughness: 0.9 }));
      board.position.set(x, 1.95, z + 0.1);
      this.scene.add(board);
      const back = new T.Mesh(new T.PlaneGeometry(2.9, 0.9), new T.MeshStandardMaterial({ map: signTex(text, color), roughness: 0.9 }));
      back.position.set(x, 1.95, z - 0.1);
      back.rotation.y = Math.PI;
      this.scene.add(back);
    }
    // gerbang "Kebun Buah Rumila" di ujung utara jalan
    const gz = -H;
    for (const s of [-1, 1]) deco.add(new T.BoxGeometry(0.5, 4.6, 0.5), mat(s * 3, 2.3, gz), wood);
    deco.add(new T.BoxGeometry(7.2, 0.4, 0.5), mat(0, 4.7, gz), wood);
    const gate = new T.Mesh(new T.PlaneGeometry(5.4, 1.6), new T.MeshStandardMaterial({ map: signTex('Kebun Buah Rumila', '#ff7a1a'), roughness: 0.9 }));
    gate.position.set(0, 3.9, gz + 0.3);
    this.scene.add(gate);
    // bendera Merah Putih di alun-alun dan gerbang
    for (const [x, z, h] of [
      [-5.8, -5.8, 5],
      [3.6, gz, 6],
      [-3.6, gz, 6],
    ] as const) {
      const f = flag(1.3, h);
      f.group.position.set(x, 0, z);
      this.scene.add(f.group);
      this.flags.push(f.mat);
    }

    this.scene.add(deco.build(swayMaterial(this.uTime, { roughness: 0.9, flatShading: true })));

    // kupu-kupu
    const wingM = ['#ffb627', '#ff6b8b', '#8fd3ff', '#ffffff', '#b58cff'].map((c) => new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }));
    for (let i = 0; i < 9; i++) {
      const g = new T.Group();
      const wings: T.Object3D[] = [];
      for (const s of [-1, 1]) {
        const w = new T.Mesh(new T.CircleGeometry(0.16, 6), wingM[i % 5]);
        w.geometry.translate(0.14, 0, 0);
        w.scale.x = s;
        const piv = new T.Group();
        piv.add(w);
        g.add(piv);
        wings.push(piv);
      }
      const p = this.plots[(i * 5 + 2) % this.plots.length];
      g.position.set(p.x, 1.5, p.z);
      this.scene.add(g);
      this.butterflies.push({ g, wings, c: new T.Vector3(p.x + 1.5, 1.4 + r(), p.z + 1.5), ph: r() * 6.28, r: 1.5 + r() * 2 });
    }
  }

  /* ---------------- pemain (anak petani bertopi caping & keranjang) ---------------- */

  private buildPlayer() {
    const std = (c: string, rough = 0.7) => new T.MeshStandardMaterial({ color: c, roughness: rough });
    const skin = std('#f1c27d'),
      shirt = std('#ff7a1a'),
      pants = std('#2f86ff'),
      shoe = std('#5b3a24'),
      hair = std('#3b2417'),
      hat = std('#e8c872', 0.9),
      dark = std('#1d1d1d', 0.3);
    const P = this.player;
    const add = <G extends T.Object3D>(o: G, parent: T.Object3D = P) => (parent.add(o), o);

    const legL = add(new T.Group()),
      legR = add(new T.Group());
    for (const [leg, x] of [
      [legL, -0.14],
      [legR, 0.14],
    ] as const) {
      leg.position.set(x, 0.62, 0);
      const l = new T.Mesh(new T.CapsuleGeometry(0.1, 0.38, 4, 8), pants);
      l.position.y = -0.28;
      const s = new T.Mesh(new T.SphereGeometry(0.12, 10, 6), shoe);
      s.scale.set(1, 0.6, 1.4);
      s.position.set(0, -0.55, 0.05);
      leg.add(l, s);
    }
    const body = add(new T.Mesh(new T.CapsuleGeometry(0.26, 0.34, 6, 12), shirt));
    body.position.y = 0.98;
    // kerah & kancing overall
    const strap = std('#2f86ff');
    for (const x of [-0.12, 0.12]) {
      const s = new T.Mesh(new T.BoxGeometry(0.07, 0.5, 0.06), strap);
      s.position.set(x, 1.02, 0.24);
      P.add(s);
    }
    const bib = new T.Mesh(new T.BoxGeometry(0.34, 0.24, 0.06), strap);
    bib.position.set(0, 0.86, 0.24);
    P.add(bib);

    const armL = add(new T.Group()),
      armR = add(new T.Group());
    for (const [arm, x] of [
      [armL, -0.33],
      [armR, 0.33],
    ] as const) {
      arm.position.set(x, 1.2, 0);
      const a = new T.Mesh(new T.CapsuleGeometry(0.075, 0.3, 4, 8), shirt);
      a.position.y = -0.2;
      const h = new T.Mesh(new T.SphereGeometry(0.085, 10, 8), skin);
      h.position.y = -0.42;
      arm.add(a, h);
      arm.rotation.z = x < 0 ? -0.12 : 0.12;
    }

    const head = add(new T.Mesh(new T.SphereGeometry(0.33, 20, 14), skin));
    head.position.y = 1.62;
    const hr = new T.Mesh(new T.SphereGeometry(0.345, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
    hr.position.y = 1.64;
    hr.rotation.x = -0.25;
    P.add(hr);
    for (const x of [-0.12, 0.12]) {
      const e = new T.Mesh(new T.SphereGeometry(0.045, 10, 8), dark);
      e.position.set(x, 1.64, 0.29);
      e.scale.set(1, 1.3, 0.6);
      const c = new T.Mesh(new T.CircleGeometry(0.06, 12), std('#ff9e9e'));
      c.position.set(x * 1.5, 1.54, 0.3);
      P.add(e, c);
    }
    const smile = new T.Mesh(new T.TorusGeometry(0.07, 0.016, 6, 12, Math.PI), dark);
    smile.position.set(0, 1.53, 0.31);
    smile.rotation.z = Math.PI;
    P.add(smile);
    // caping (topi petani)
    const brim = new T.Mesh(new T.ConeGeometry(0.72, 0.32, 20, 1, true), hat);
    brim.material.side = T.DoubleSide;
    brim.position.y = 1.98;
    P.add(brim);
    const band = new T.Mesh(new T.TorusGeometry(0.3, 0.03, 6, 20), std('#e0262b'));
    band.rotation.x = Math.PI / 2;
    band.position.y = 1.9;
    P.add(band);

    // keranjang di punggung — terisi buah setiap kali menemukan buah baru
    const basket = new T.Group();
    const bk = new T.Mesh(new T.CylinderGeometry(0.3, 0.22, 0.42, 12, 1, true), std('#b07a45', 0.95));
    bk.material.side = T.DoubleSide;
    const bottom = new T.Mesh(new T.CircleGeometry(0.22, 12), std('#8a5a34'));
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.2;
    const rim = new T.Mesh(new T.TorusGeometry(0.3, 0.03, 6, 16), std('#8a5a34'));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.21;
    basket.add(bk, bottom, rim);
    basket.position.set(0, 1.08, -0.38);
    basket.rotation.x = -0.15;
    P.add(basket);

    // bayangan bulat lembut
    const shadow = new T.Mesh(
      new T.CircleGeometry(0.5, 20),
      new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'varying vec2 vUv; void main(){ float d = length(vUv-0.5)*2.0; gl_FragColor = vec4(0.1,0.2,0.05, 0.35*(1.0-smoothstep(0.3,1.0,d))); }',
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.04;
    P.add(shadow);

    P.scale.setScalar(1.15);
    this.scene.add(P);
    this.parts = { legL, legR, armL, armR, body, basket };
  }

  /* ---------------- API untuk antarmuka ---------------- */

  setDiscovered(ids: Set<string>) {
    let count = 0;
    this.markers.forEach((m, i) => {
      const found = ids.has(m.plot.fruit.id);
      if (found) count++;
      if (found === m.found) return;
      m.found = found;
      for (let k = 0; k < 6; k++) this.sparkleOn.setX(i * 6 + k, found ? 0 : 1);
      if (found) this.useThumb(m);
      else {
        m.sprite.material.map = this.qTex;
        m.sprite.material.needsUpdate = true;
        m.sprite.scale.set(1.1, 1.29, 1);
      }
    });
    this.sparkleOn.needsUpdate = true;
    this.setBasket(count);
  }

  /** Buah terbang dari tanaman ke keranjang (saat baru ditemukan). */
  pick(id: string) {
    const m = this.markers.find((k) => k.plot.fruit.id === id);
    if (!m) return;
    const mesh = new T.Mesh(new T.SphereGeometry(0.22, 12, 9), new T.MeshStandardMaterial({ color: m.plot.fruit.color, roughness: 0.4, emissive: m.plot.fruit.color, emissiveIntensity: 0.25 }));
    const from = new T.Vector3(m.plot.x, Math.min(m.top - 0.6, 2.4), m.plot.z);
    mesh.position.copy(from);
    this.scene.add(mesh);
    this.fly.push({ mesh, from, t: 0 });
  }

  setStick(x: number, y: number) {
    this.stick.set(x, y);
    if (this.stick.lengthSq() > 0.01) this.clearTarget();
  }

  setActive(on: boolean) {
    this.active = on;
    if (on) {
      this.clock.getDelta();
      this.resize();
    }
  }

  /** Ketuk layar: tanaman → jalan ke tanaman; tanah → jalan ke titik itu. */
  tap(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new T.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    // tanaman: cari yang paling dekat di layar (penanda, tajuk, atau pangkal)
    let best: Plot | null = null,
      bestD = 0.13 * (this.portrait ? 1.6 : 1);
    const v = new T.Vector3();
    for (const m of this.markers) {
      for (const h of [m.top + 0.9, m.top * 0.6, 0.4]) {
        v.set(m.plot.x, h, m.plot.z).project(this.camera);
        if (v.z > 1) continue;
        const d = Math.hypot((v.x - ndc.x) * this.camera.aspect, v.y - ndc.y);
        if (d < bestD) {
          bestD = d;
          best = m.plot;
        }
      }
    }
    if (best) return this.walkToPlot(best);
    const ray = new T.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hit = new T.Vector3();
    if (ray.ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), 0), hit)) {
      const lim = GARDEN.half - 1;
      hit.x = T.MathUtils.clamp(hit.x, -lim, lim);
      hit.z = T.MathUtils.clamp(hit.z, -lim, lim);
      this.target = hit.clone();
      this.targetPlot = null;
      this.tapRing.position.set(hit.x, 0.06, hit.z);
      this.tapT = 0;
    }
  }

  walkToPlot(p: Plot) {
    const dir = new T.Vector3(this.pos.x - p.x, 0, this.pos.z - p.z);
    if (dir.lengthSq() < 0.01) dir.set(0, 0, 1);
    dir.normalize().multiplyScalar(p.reach);
    this.target = new T.Vector3(p.x + dir.x, 0, p.z + dir.z);
    this.targetPlot = p;
    if (this.pos.distanceTo(this.target) < 0.4 || Math.hypot(this.pos.x - p.x, this.pos.z - p.z) < p.reach + 0.6) this.arrive();
  }

  private clearTarget() {
    this.target = null;
    this.targetPlot = null;
  }

  private arrive() {
    const p = this.targetPlot;
    this.clearTarget();
    if (!p) return;
    this.heading = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
    this.cb.onArrive(p.fruit.id);
  }

  private setBasket(n: number) {
    const b = this.parts.basket;
    const want = Math.min(12, Math.ceil(n / 4));
    if (want === this.basketFruits) return;
    b.children.filter((c) => c.userData.fruit).forEach((c) => b.remove(c));
    const cols = this.plots.map((p) => p.fruit.color);
    for (let i = 0; i < want; i++) {
      const s = new T.Mesh(new T.SphereGeometry(0.1, 8, 6), new T.MeshStandardMaterial({ color: cols[(i * 7) % cols.length], roughness: 0.5 }));
      const a = i * 2.4;
      s.position.set(Math.cos(a) * 0.14 * (i % 3 ? 1 : 0.4), 0.2 + Math.floor(i / 5) * 0.08, Math.sin(a) * 0.14 * (i % 3 ? 1 : 0.4));
      s.userData.fruit = true;
      b.add(s);
    }
    this.basketFruits = want;
  }

  private useThumb(m: Marker) {
    const id = m.plot.fruit.id;
    const ready = this.thumbTex.get(id);
    const apply = (t: T.Texture) => {
      m.sprite.material.map = t;
      m.sprite.material.needsUpdate = true;
      m.sprite.scale.set(1.35, 1.35 * 1.17, 1);
    };
    if (ready) return apply(ready);
    const img = new Image();
    img.onload = () => {
      if (this.disposed) return;
      const t = canvasTex(160, 188, (g) => {
        g.fillStyle = 'rgba(0,0,0,.18)';
        g.beginPath();
        g.arc(82, 82, 74, 0, 7);
        g.fill();
        g.fillStyle = '#fff';
        g.beginPath();
        g.arc(80, 78, 74, 0, 7);
        g.fill();
        g.beginPath();
        g.moveTo(62, 142);
        g.lineTo(80, 184);
        g.lineTo(98, 142);
        g.fill();
        g.save();
        g.beginPath();
        g.arc(80, 78, 64, 0, 7);
        g.clip();
        g.drawImage(img, 16, 14, 128, 128);
        g.restore();
        g.strokeStyle = '#1fbf62';
        g.lineWidth = 8;
        g.beginPath();
        g.arc(80, 78, 70, 0, 7);
        g.stroke();
      });
      this.thumbTex.set(id, t);
      if (m.found) apply(t);
    };
    img.src = FRUIT_ARTWORK[id]?.thumb ?? '';
  }

  /* ---------------- loop ---------------- */

  private onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (!['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) return;
    if (e.type === 'keydown') {
      this.keys.add(k);
      this.clearTarget();
    } else this.keys.delete(k);
  };

  private resize() {
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.portrait = w < h;
    this.camera.fov = this.portrait ? 58 : 45;
    this.camera.updateProjectionMatrix();
    (this.sparkles.material as T.ShaderMaterial).uniforms.uScale.value = h * this.renderer.getPixelRatio() * 0.9;
  }

  private camOffset() {
    return this.portrait ? new T.Vector3(0, 15, 11.5) : new T.Vector3(0, 12, 11.5);
  }

  private snapCamera() {
    this.camPos.copy(this.pos).add(this.camOffset());
    this.camLook.copy(this.pos).add(new T.Vector3(0, 0.8, -2));
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    if (!this.active || document.hidden) {
      this.clock.getDelta();
      return;
    }
    const dt = Math.min(0.05, this.clock.getDelta());
    this.uTime.value += dt;
    this.step(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private step(dt: number) {
    const t = this.uTime.value;
    // arah gerak: joystick / keyboard / tujuan ketukan (relatif layar: atas = menjauh dari kamera)
    const move = new T.Vector2(this.stick.x, this.stick.y);
    if (this.keys.size) {
      move.set(0, 0);
      if (this.keys.has('arrowleft') || this.keys.has('a')) move.x -= 1;
      if (this.keys.has('arrowright') || this.keys.has('d')) move.x += 1;
      if (this.keys.has('arrowup') || this.keys.has('w')) move.y += 1;
      if (this.keys.has('arrowdown') || this.keys.has('s')) move.y -= 1;
    }
    let want = 0;
    const dir = new T.Vector3();
    if (move.lengthSq() > 0.01) {
      dir.set(move.x, 0, -move.y);
      want = Math.min(1, move.length());
      dir.normalize();
    } else if (this.target) {
      dir.subVectors(this.target, this.pos).setY(0);
      const d = dir.length();
      if (d < 0.25) {
        if (this.targetPlot) this.arrive();
        else this.clearTarget();
      } else {
        dir.divideScalar(d);
        want = Math.min(1, d / 1.2 + 0.35);
      }
    }
    const MAX = 6.2;
    this.speed = T.MathUtils.damp(this.speed, want * MAX, 8, dt);
    if (want > 0) {
      const h = Math.atan2(dir.x, dir.z);
      let dh = h - this.heading;
      dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      this.heading += dh * Math.min(1, dt * 10);
    }
    if (this.speed > 0.05) {
      const fwd = new T.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
      this.pos.addScaledVector(want > 0 ? dir : fwd, this.speed * dt);
      this.collide();
      // tiba di tanaman lebih awal bila sudah cukup dekat (tidak perlu tepat di titik)
      const tp = this.targetPlot;
      if (tp && Math.hypot(this.pos.x - tp.x, this.pos.z - tp.z) < tp.reach + 0.15) this.arrive();
    }
    this.player.position.copy(this.pos);
    this.player.rotation.y = this.heading;

    // animasi jalan / diam
    const P = this.parts;
    const k = this.speed / MAX;
    this.walkPh += dt * (4 + this.speed * 1.6);
    const sw = Math.sin(this.walkPh) * 0.75 * k;
    P.legL.rotation.x = sw;
    P.legR.rotation.x = -sw;
    P.armL.rotation.x = -sw * 0.9;
    P.armR.rotation.x = sw * 0.9;
    const bob = Math.abs(Math.cos(this.walkPh)) * 0.07 * k + Math.sin(t * 2) * 0.012 * (1 - k);
    this.player.position.y = bob;
    P.basket.rotation.z = Math.sin(this.walkPh) * 0.08 * k;

    // tanaman terdekat
    let near: Plot | null = null,
      nd = 3.4;
    for (const m of this.markers) {
      const d = Math.hypot(m.plot.x - this.pos.x, m.plot.z - this.pos.z);
      if (d < nd) {
        nd = d;
        near = m.plot;
      }
    }
    const nearId = near?.fruit.id ?? null;
    if (nearId !== this.near) {
      this.near = nearId;
      this.cb.onNear(nearId);
    }

    // penanda melayang & membesar saat didekati
    for (const m of this.markers) {
      const isNear = m.plot.fruit.id === this.near;
      const base = m.found ? 1.35 : 1.1;
      const s = base * (isNear ? 1.25 : 1);
      const cur = m.sprite.scale.x;
      const ns = cur + (s - cur) * Math.min(1, dt * 8);
      m.sprite.scale.set(ns, ns * 1.17, 1);
      m.sprite.position.y = m.top + 1 + Math.sin(t * 2 + m.plot.x * 0.3) * 0.15;
    }

    // efek ketukan tanah
    if (this.tapT < 1) {
      this.tapT = Math.min(1, this.tapT + dt * 1.8);
      (this.tapRing.material as T.MeshBasicMaterial).opacity = 0.9 * (1 - this.tapT);
      this.tapRing.scale.setScalar(0.6 + this.tapT * 1.2);
    }

    // buah terbang ke keranjang
    const basketW = new T.Vector3();
    P.basket.getWorldPosition(basketW);
    this.fly = this.fly.filter((f) => {
      f.t += dt * 1.3;
      const e = Math.min(1, f.t);
      f.mesh.position.lerpVectors(f.from, basketW, e);
      f.mesh.position.y += Math.sin(e * Math.PI) * 2.2;
      f.mesh.scale.setScalar(1 - e * 0.5);
      if (e >= 1) {
        this.scene.remove(f.mesh);
        f.mesh.geometry.dispose();
        (f.mesh.material as T.Material).dispose();
        return false;
      }
      return true;
    });

    // dunia hidup: kincir, awan, bendera, kupu-kupu
    this.windmill.rotation.z -= dt * 0.6;
    for (const c of this.clouds) {
      c.position.x += dt * 0.8;
      if (c.position.x > 100) c.position.x = -100;
    }
    for (const f of this.flags) f.uniforms.uTime.value = t;
    for (const b of this.butterflies) {
      const a = t * 0.35 + b.ph;
      b.g.position.set(b.c.x + Math.cos(a) * b.r, b.c.y + Math.sin(t * 1.3 + b.ph) * 0.35, b.c.z + Math.sin(a * 1.3) * b.r);
      b.g.rotation.y = -a;
      const flap = Math.sin(t * 16 + b.ph) * 0.9;
      b.wings[0].rotation.y = flap;
      b.wings[1].rotation.y = -flap;
    }

    // kamera mengikuti dengan halus (kalem)
    const want2 = new T.Vector3().copy(this.pos).add(this.camOffset());
    const look = new T.Vector3().copy(this.pos).add(new T.Vector3(0, 0.8, -2));
    const f = 1 - Math.exp(-dt * 3);
    this.camPos.lerp(want2, f);
    this.camLook.lerp(look, f);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
  }

  private collide() {
    const lim = GARDEN.half - 1;
    this.pos.x = T.MathUtils.clamp(this.pos.x, -lim, lim);
    this.pos.z = T.MathUtils.clamp(this.pos.z, -lim, lim);
    const me = 0.4;
    for (const o of this.obstacles) {
      const dx = this.pos.x - o.x,
        dz = this.pos.z - o.z;
      const d = Math.hypot(dx, dz),
        min = o.r + me;
      if (d < min && d > 1e-4) {
        this.pos.x = o.x + (dx / d) * min;
        this.pos.z = o.z + (dz / d) * min;
      }
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    lastPos = [this.pos.x, 0, this.pos.z];
    this.ro.disconnect();
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('keyup', this.onKey);
    this.scene.traverse((o) => {
      const m = o as T.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as T.Material | T.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) {
        const mm = mat as T.MeshStandardMaterial;
        mm.map?.dispose();
        mat.dispose();
      }
    });
    this.qTex.dispose();
    this.thumbTex.forEach((t) => t.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
