// Mesin 3D Kebun Buah (mode jelajah): anak berjalan di kebun, mendekati tanaman, lalu mengetuk buahnya.
// Tampilan realistis: tajuk dari kartu daun bertekstur, buah 3D asli di tanaman, rumput & tanah bertekstur,
// bayangan matahari, dan pantulan langit. Kamera mengikuti dari belakang-atas dengan gerak kalem.
// Kontrol: joystick, ketuk tanah/tanaman, panah/WASD. Mode tur: anak berjalan sendiri dari buah ke buah.

import * as T from 'three';
import { flag } from '@/components/roket/details';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import type { FruitGroup } from '@/lib/fruits/catalog';
import { GARDEN, ZONE_DIR, ZONE_NAME, buildPlots, plotRadius, type Plot } from '@/lib/fruits/garden';
import { Merge, backdropTree, buildPlant, mat, rnd, swayMaterial, type Kit, type Spot } from './build';
import { FruitHanger } from './fruits';
import * as TX from './textures';
import { BED_POS, Farm, NPC_POS, type BedView } from './farm3d';
import { sfx } from '@/lib/sfx';

export interface GardenCallbacks {
  /** tanaman terdekat dalam jangkauan (null = tidak ada) */
  onNear: (id: string | null) => void;
  /** tiba di tujuan: id buah, atau "plaza" / "zona:<kelompok>" (mode tur) */
  onArrive: (key: string) => void;
}

interface Marker {
  plot: Plot;
  sprite: T.Sprite;
  top: number;
  found: boolean;
  spots: Spot[];
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

const SUN_DIR = new T.Vector3(0.45, 0.72, 0.3).normalize();

/** Tinggi tanah di luar pagar (bukit landai); di dalam kebun datar. */
const groundY = (x: number, z: number) => {
  const out = Math.max(0, Math.max(Math.abs(x), Math.abs(z)) - GARDEN.half - 4);
  return out > 0 ? Math.pow(out, 1.25) * 0.28 * (0.7 + 0.3 * Math.sin(x * 0.08) * Math.cos(z * 0.07)) : 0;
};

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

/** Balon tanda tanya untuk buah yang belum ditemukan. */
/** Balon tanda seru (misi tersedia di Pak Tani). */
const exclaimTex = () =>
  canvasTex(128, 150, (g) => {
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath();
    g.arc(66, 66, 58, 0, 7);
    g.fill();
    g.fillStyle = '#ffbe0b';
    g.beginPath();
    g.arc(64, 62, 58, 0, 7);
    g.fill();
    g.beginPath();
    g.moveTo(50, 112);
    g.lineTo(64, 146);
    g.lineTo(78, 112);
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = '900 82px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('!', 64, 68);
  });

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
    g.fillStyle = '#7a5334';
    g.beginPath();
    g.roundRect(4, 4, 504, 152, 26);
    g.fill();
    g.fillStyle = '#9b6d45';
    g.beginPath();
    g.roundRect(14, 14, 484, 132, 20);
    g.fill();
    for (let i = 0; i < 30; i++) {
      g.strokeStyle = 'rgba(70,40,15,.25)';
      g.beginPath();
      const y = 18 + ((i * 37) % 124);
      g.moveTo(16, y);
      g.lineTo(496, y + ((i % 5) - 2));
      g.stroke();
    }
    g.fillStyle = color;
    g.beginPath();
    g.roundRect(30, 30, 452, 100, 16);
    g.fill();
    g.fillStyle = '#fff';
    g.font = '800 52px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 256, 82);
  });
}

/** Letak papan nama petak di tepi alun-alun. */
const zoneSign = (g: FruitGroup) => {
  const [sx, sz] = ZONE_DIR[g];
  return { x: sx * 4.3, z: sz * 4.3 + (sz < 0 ? -1.8 : 1.8) };
};

export class GardenEngine {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(45, 1, 0.3, 320);
  private clock = new T.Clock();
  private uTime = { value: 0 };
  private host: HTMLElement;
  private cb: GardenCallbacks;
  private raf = 0;
  private active = true;
  private disposed = false;
  private ro: ResizeObserver;
  private sun!: T.DirectionalLight;
  private textures: T.Texture[] = [];

  readonly plots = buildPlots();
  private markers: Marker[] = [];
  private qTex = questionTex();
  private thumbTex = new Map<string, T.Texture>();
  private hanger: FruitHanger;
  private farm!: Farm;
  private exTex = exclaimTex();
  private buildQueue: Marker[] = [];

  // pemain
  private player = new T.Group();
  private parts: { legL: T.Object3D; legR: T.Object3D; armL: T.Object3D; armR: T.Object3D; basket: T.Group } = null!;
  private pos = new T.Vector3();
  private heading = 0;
  private targetHeading: number | null = null;
  private speed = 0;
  private walkPh = 0;
  private lastStep = 0;
  private stick = new T.Vector2();
  private keys = new Set<string>();
  private waypoints: T.Vector3[] = [];
  private arriveKey: string | null = null;
  private faceTo: T.Vector3 | null = null;
  private near: string | null = null;
  private tapRing: T.Mesh;
  private tapT = 1;
  private tour = false;
  private walkPaused = false;
  private focusAt: T.Vector3 | null = null;
  private focusK = 0;

  private camPos = new T.Vector3();
  private camLook = new T.Vector3();
  private portrait = false;

  private windmill!: T.Object3D;
  private flags: T.ShaderMaterial[] = [];
  private clouds: T.Sprite[] = [];
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);
    this.hanger = new FruitHanger(this.scene);

    this.buildSky();
    this.buildLights();
    this.buildGround();
    this.buildPlants();
    this.buildDecor();
    this.buildPlayer();
    // permainan: bedengan Kebun Saya & Pak Tani
    this.farm = new Farm(this.qTex);
    this.scene.add(this.farm.group);
    BED_POS.forEach(([x, z]) => this.obstacles.push({ x, z, r: 1.35 }));
    this.obstacles.push({ x: NPC_POS[0], z: NPC_POS[1], r: 0.55 });

    this.tapRing = new T.Mesh(new T.RingGeometry(0.35, 0.55, 28), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
    this.tapRing.rotation.x = -Math.PI / 2;
    this.scene.add(this.tapRing);

    if (lastPos) this.pos.set(...lastPos);
    else this.pos.set(0, 0, 4.5);
    this.player.position.copy(this.pos);
    this.heading = Math.PI; // menghadap ke kebun (menjauhi kamera)
    this.player.rotation.y = this.heading;
    this.queueFruits();

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.snapCamera();
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKey);
    this.loop();
  }

  private keep<Tx extends T.Texture>(t: Tx) {
    this.textures.push(t);
    return t;
  }

  /* ---------------- langit & cahaya ---------------- */

  private skyMaterial() {
    return new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { sun: { value: SUN_DIR } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 sun; varying vec3 vDir;
        void main(){ float h = vDir.y;
          vec3 top = vec3(0.23,0.52,0.86), mid = vec3(0.55,0.76,0.95), low = vec3(0.86,0.92,0.95);
          vec3 c = mix(low, mid, smoothstep(-0.02, 0.18, h)); c = mix(c, top, smoothstep(0.18, 0.8, h));
          float s = max(0.0, dot(normalize(vDir), sun));
          c += vec3(1.0,0.9,0.7) * (pow(s, 600.0) * 3.0 + pow(s, 12.0) * 0.25);
          gl_FragColor = vec4(c, 1.0); }`,
    });
  }

  private buildSky() {
    const sky = new T.Mesh(new T.SphereGeometry(300, 32, 16), this.skyMaterial());
    sky.frustumCulled = false;
    this.scene.add(sky);
    this.scene.fog = new T.Fog('#cfe3f0', 70, 210);

    // pantulan langit untuk kilau buah & benda
    const pm = new T.PMREMGenerator(this.renderer);
    const env = new T.Scene();
    env.add(new T.Mesh(new T.SphereGeometry(50, 32, 16), this.skyMaterial()));
    const ground = new T.Mesh(new T.CircleGeometry(49, 24), new T.MeshBasicMaterial({ color: '#4d6e33' }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    env.add(ground);
    const rt = pm.fromScene(env, 0.02);
    this.scene.environment = rt.texture;
    this.scene.environmentIntensity = 0.55;
    pm.dispose();

    for (let i = 0; i < 12; i++) {
      const s = new T.Sprite(new T.SpriteMaterial({ map: this.keep(TX.cloud(i + 3)), transparent: true, depthWrite: false, fog: false, opacity: 0.95 }));
      const r = rnd(i + 40);
      const w = 40 + r() * 40;
      s.scale.set(w, w / 2, 1);
      s.position.set((r() - 0.5) * 260, 45 + r() * 25, -80 - r() * 120);
      this.scene.add(s);
      this.clouds.push(s);
    }
  }

  private buildLights() {
    this.scene.add(new T.HemisphereLight('#cfe6ff', '#5b6b3a', 0.55));
    const sun = new T.DirectionalLight('#fff0d8', 2.6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const c = sun.shadow.camera;
    c.left = c.bottom = -24;
    c.right = c.top = 24;
    c.near = 1;
    c.far = 90;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    this.scene.add(sun, sun.target);
    this.sun = sun;
  }

  /* ---------------- tanah, jalan, rumput ---------------- */

  private buildGround() {
    const H = GARDEN.half;
    const size = 300,
      seg = 150;
    const geo = new T.PlaneGeometry(size, size, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position,
      uv = geo.attributes.uv;
    const col = new Float32Array(pos.count * 3);
    const c = new T.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        z = pos.getZ(i);
      pos.setY(i, groundY(x, z));
      uv.setXY(i, x / 6, z / 6);
      // variasi warna besar: petak rumput lebih hijau / lebih kering
      const n = 0.5 + 0.28 * Math.sin(x * 0.11 + Math.cos(z * 0.07) * 2) + 0.22 * Math.sin(z * 0.13 + x * 0.04);
      c.setRGB(0.92 + n * 0.16, 0.95 + n * 0.12, 0.85 + n * 0.1);
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const ground = new T.Mesh(geo, new T.MeshStandardMaterial({ map: this.keep(TX.groundGrass()), vertexColors: true, roughness: 0.95 }));
    ground.receiveShadow = true;
    this.scene.add(ground);

    // jalan tanah bertekstur — salib utama, jalan kecil antarbaris, alun-alun
    const path = new Merge();
    const W = GARDEN.path;
    const plane = (w: number, d: number, x: number, z: number, y: number) => path.add(new T.PlaneGeometry(w, d), mat(x, y, z, -Math.PI / 2), '#ffffff', { uv: [w / 4, d / 4] });
    plane(W * 2, H * 2 + 2, 0, 0, 0.02);
    plane(H * 2 + 2, W * 2, 0, 0, 0.021);
    for (const [sx, sz] of Object.values(ZONE_DIR)) for (let r = 0; r < 5; r++) plane(36, 1.4, sx * 21, sz * (GARDEN.first + r * GARDEN.step) + 2.6, 0.018);
    path.add(new T.CircleGeometry(GARDEN.plaza, 48), mat(0, 0.025, 0, -Math.PI / 2), '#f2e6d4', { uv: [GARDEN.plaza / 2, GARDEN.plaza / 2] });
    const pm = path.build(new T.MeshStandardMaterial({ map: this.keep(TX.dirt()), vertexColors: true, roughness: 1 }));
    pm.receiveShadow = true;
    this.scene.add(pm);

    // batu tepi alun-alun
    const stones = new Merge();
    const r = rnd(3);
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * 6.28;
      if (Math.abs(Math.sin(a)) < 0.2 || Math.abs(Math.cos(a)) < 0.2) continue; // celah jalan
      stones.add(new T.DodecahedronGeometry(0.28 + r() * 0.1, 0), mat(Math.cos(a) * GARDEN.plaza, 0.08, Math.sin(a) * GARDEN.plaza, r(), r(), 0, 1, 0.5, 1), '#a8a29a', { jitter: 0.2 });
    }
    const sm = stones.build(new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
    sm.castShadow = sm.receiveShadow = true;
    this.scene.add(sm);

    // rumpun rumput (kartu silang bertekstur) & bunga liar, menghindari jalan dan tanaman
    const rowLanes = Object.values(ZONE_DIR).flatMap(([sx, sz]) => [0, 1, 2, 3, 4].map((k) => ({ sx, z: sz * (GARDEN.first + k * GARDEN.step) + 2.6 })));
    const inFarm = (x: number, z: number) => (x > 5.4 && x < 16.9 && z > 5.2 && z < 14.7) || Math.hypot(x - NPC_POS[0], z - NPC_POS[1]) < 1;
    const clear = (x: number, z: number) =>
      !inFarm(x, z) &&
      Math.abs(x) > W + 0.4 &&
      Math.abs(z) > W + 0.4 &&
      Math.hypot(x, z) > GARDEN.plaza + 0.6 &&
      !this.plots.some((p) => Math.hypot(p.x - x, p.z - z) < 1.9) &&
      !rowLanes.some((l) => Math.abs(z - l.z) < 0.8 && x * l.sx > 2);
    const tuftCard = () => {
      const a = new T.PlaneGeometry(1, 1).toNonIndexed();
      a.translate(0, 0.5, 0);
      const b = a.clone().rotateY(Math.PI / 2);
      const g = new T.BufferGeometry();
      const pos2 = new Float32Array([...(a.attributes.position.array as Float32Array), ...(b.attributes.position.array as Float32Array)]);
      const uv2 = new Float32Array([...(a.attributes.uv.array as Float32Array), ...(b.attributes.uv.array as Float32Array)]);
      const nor = new Float32Array(pos2.length);
      for (let k = 1; k < nor.length; k += 3) nor[k] = 1;
      g.setAttribute('position', new T.BufferAttribute(pos2, 3));
      g.setAttribute('uv', new T.BufferAttribute(uv2, 2));
      g.setAttribute('normal', new T.BufferAttribute(nor, 3));
      a.dispose();
      b.dispose();
      return g;
    };
    const tufts = new Merge();
    let placed = 0;
    for (let i = 0; i < 12000 && placed < 3800; i++) {
      const x = (r() - 0.5) * 2 * (H - 0.8),
        z = (r() - 0.5) * 2 * (H - 0.8);
      if (!clear(x, z)) continue;
      placed++;
      const s = 0.35 + r() * 0.45;
      const tint = new T.Color().setRGB(0.85 + r() * 0.3, 0.9 + r() * 0.2, 0.8 + r() * 0.2);
      tufts.add(tuftCard(), mat(x, 0, z, 0, r() * 3, 0, s * 1.2, s, s * 1.2), tint, { sway: 0.1, baseY: 0 });
    }
    // tepi jalan lebih rimbun
    for (let i = 0; i < 700; i++) {
      const along = (r() - 0.5) * 2 * (H - 1),
        side = r() > 0.5 ? 1 : -1;
      const [x, z] = r() > 0.5 ? [side * (W + 0.25 + r() * 0.3), along] : [along, side * (W + 0.25 + r() * 0.3)];
      if (Math.hypot(x, z) < GARDEN.plaza + 0.5) continue;
      const s = 0.3 + r() * 0.3;
      tufts.add(tuftCard(), mat(x, 0, z, 0, r() * 3, 0, s * 1.3, s, s * 1.3), '#e6f0c8', { sway: 0.1, baseY: 0 });
    }
    const tm = tufts.build(swayMaterial(this.uTime, { map: this.keep(TX.grassTuft()), alphaTest: 0.45, side: T.DoubleSide, roughness: 1 }, true));
    tm.receiveShadow = true;
    this.scene.add(tm);

    const flowers = new Merge();
    const fc = ['#ff5d7a', '#ffd23f', '#ffffff', '#b58cff', '#ff9f43'];
    for (let i = 0; i < 900; i++) {
      const x = (r() - 0.5) * 2 * (H - 1),
        z = (r() - 0.5) * 2 * (H - 1);
      if (!clear(x, z)) continue;
      const h = 0.25 + r() * 0.2;
      flowers.add(new T.CylinderGeometry(0.008, 0.01, h, 3), mat(x, h / 2, z), '#4f7d35', { sway: 0.12, baseY: 0 });
      const col = fc[i % fc.length];
      for (let k = 0; k < 5; k++) flowers.add(new T.SphereGeometry(0.035, 5, 3), mat(x + Math.cos(k * 1.26) * 0.04, h, z + Math.sin(k * 1.26) * 0.04, 0, 0, 0, 1, 0.4, 1), col, { sway: 0.12, baseY: 0 });
      flowers.add(new T.SphereGeometry(0.02, 5, 3), mat(x, h + 0.01, z), '#f5c542', { sway: 0.12, baseY: 0 });
    }
    this.scene.add(flowers.build(swayMaterial(this.uTime, { roughness: 0.8 })));
  }

  /* ---------------- tanaman & buah ---------------- */

  private buildPlants() {
    const kit: Kit = { bark: new Merge(), leaf: new Merge(), plain: new Merge() };
    this.plots.forEach((p, i) => {
      const { top, spots } = buildPlant(kit, p, i + 1);
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: this.qTex, depthWrite: false, fog: false }));
      sprite.scale.set(0.95, 1.11, 1);
      sprite.position.set(p.x, top + 0.9, p.z);
      sprite.renderOrder = 5;
      this.scene.add(sprite);
      this.markers.push({ plot: p, sprite, top, found: false, spots });
      this.obstacles.push({ x: p.x, z: p.z, r: plotRadius(p) });
    });
    // pohon latar di luar pagar
    const r = rnd(77);
    const H = GARDEN.half;
    for (let i = 0; i < 70; i++) {
      const side = i % 4,
        t = (r() - 0.5) * 2 * (H + 25),
        d = H + 6 + r() * 30;
      const x = side === 0 || side === 1 ? t : side === 2 ? d : -d;
      const z = side === 0 ? -d : side === 1 ? d : t;
      backdropTree(kit, x, z, groundY(x, z) - 0.2, 1.3 + r() * 1.3, i + 500);
    }
    const barkMesh = kit.bark.build(swayMaterial(this.uTime, { map: this.keep(TX.bark()), roughness: 0.95 }));
    const leafMesh = kit.leaf.build(swayMaterial(this.uTime, { map: this.keep(TX.foliageAtlas()), alphaTest: 0.5, side: T.DoubleSide, roughness: 0.8 }, true));
    const plainMesh = kit.plain.build(swayMaterial(this.uTime, { roughness: 0.75 }));
    for (const m of [barkMesh, leafMesh, plainMesh]) {
      m.castShadow = m.receiveShadow = true;
      this.scene.add(m);
    }

    // kilau di sekitar buah yang belum ditemukan
    const n = this.plots.length * 6;
    const pos = new Float32Array(n * 3),
      ph = new Float32Array(n),
      on = new Float32Array(n);
    const rr = rnd(11);
    this.markers.forEach((m, i) => {
      for (let k = 0; k < 6; k++) {
        const j = i * 6 + k,
          a = rr() * 6.28,
          d = 0.9 + rr() * 1.3;
        pos.set([m.plot.x + Math.cos(a) * d, 0.5 + rr() * (m.top - 0.3), m.plot.z + Math.sin(a) * d], j * 3);
        ph[j] = rr() * 6.28;
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
            gl_PointSize = uScale * 0.2 / -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d);
            float star = max(0.0, 1.0 - r*2.0) + max(0.0, 0.06 - abs(d.x)*abs(d.y)*40.0);
            gl_FragColor = vec4(1.0, 0.93, 0.6, star * vA); }`,
      }),
    );
    this.scene.add(this.sparkles);
  }

  /** Buah dipasang bertahap, tanaman terdekat lebih dulu. */
  private queueFruits() {
    this.buildQueue = [...this.markers].sort((a, b) => Math.hypot(a.plot.x - this.pos.x, a.plot.z - this.pos.z) - Math.hypot(b.plot.x - this.pos.x, b.plot.z - this.pos.z));
  }

  /* ---------------- dekorasi ---------------- */

  private buildDecor() {
    const H = GARDEN.half;
    const wood = new Merge(),
      plain = new Merge(),
      stone = new Merge(),
      roof = new Merge();
    const r = rnd(21);

    // pagar kayu keliling
    for (const s of [-1, 1])
      for (let i = -H; i <= H; i += 2.2) {
        if (Math.abs(i) < 3.2) continue; // gerbang di ujung jalan
        wood.add(new T.BoxGeometry(0.18, 1.25, 0.18), mat(i, 0.62, s * H, 0, r() * 0.2), '#e8dccb', { uv: [0.3, 1.5] });
        wood.add(new T.BoxGeometry(0.18, 1.25, 0.18), mat(s * H, 0.62, i, 0, r() * 0.2), '#e8dccb', { uv: [0.3, 1.5] });
      }
    for (const s of [-1, 1])
      for (const y of [0.45, 0.95])
        for (const half of [-1, 1]) {
          const len = H - 3.2;
          wood.add(new T.BoxGeometry(len, 0.12, 0.06), mat(half * (3.2 + len / 2), y, s * H), '#f0e4d2', { uv: [len / 2, 0.2] });
          wood.add(new T.BoxGeometry(0.06, 0.12, len), mat(s * H, y, half * (3.2 + len / 2)), '#f0e4d2', { uv: [len / 2, 0.2] });
        }

    // sumur batu beratap di tengah alun-alun
    stone.add(new T.CylinderGeometry(1.1, 1.2, 0.9, 20, 1, true), mat(0, 0.45, 0), '#ffffff', { uv: [4, 1] });
    stone.add(new T.TorusGeometry(1.12, 0.14, 8, 24), mat(0, 0.92, 0, Math.PI / 2), '#d8d2c8');
    plain.add(new T.CircleGeometry(1.05, 20), mat(0, 0.35, 0, -Math.PI / 2), '#2f5c78');
    for (const s of [-1, 1]) wood.add(new T.BoxGeometry(0.14, 2.3, 0.14), mat(s * 1.05, 1.5, 0), '#c9a98a', { uv: [0.3, 2] });
    roof.add(new T.ConeGeometry(1.75, 1, 4, 1), mat(0, 3.1, 0, 0, Math.PI / 4, 0, 1, 1, 0.75), '#ffffff', { uv: [3, 2] });
    wood.add(new T.CylinderGeometry(0.06, 0.06, 2.1, 8), mat(0, 2.3, 0, 0, 0, Math.PI / 2), '#b99a7a');
    wood.add(new T.CylinderGeometry(0.22, 0.18, 0.35, 10), mat(0, 1.75, 0), '#a88563', { uv: [1, 0.5] });
    this.obstacles.push({ x: 0, z: 0, r: 1.5 });

    // bangku taman
    for (const a of [0.8, 2.35, 3.95, 5.5]) {
      const x = Math.cos(a) * 5.4,
        z = Math.sin(a) * 5.4,
        ry = -a + Math.PI / 2;
      wood.add(new T.BoxGeometry(1.8, 0.08, 0.5), mat(x, 0.48, z, 0, ry, 0), '#d9b58c', { uv: [2, 0.3] });
      wood.add(new T.BoxGeometry(1.8, 0.45, 0.06), mat(x + Math.cos(a) * 0.26, 0.78, z + Math.sin(a) * 0.26, 0, ry, 0), '#d9b58c', { uv: [2, 0.4] });
      for (const s of [-0.75, 0.75]) plain.add(new T.BoxGeometry(0.06, 0.48, 0.45), mat(x + Math.cos(ry) * s, 0.24, z - Math.sin(ry) * s, 0, ry, 0), '#3d3d3d');
    }

    // rumah kebun: dinding papan, atap genteng pelana, jendela, pot bunga
    const hx = 22,
      hz = 14;
    wood.add(new T.BoxGeometry(7, 3.4, 5.4), mat(hx, 1.7, hz), '#f7efe3', { uv: [3, 1.5] });
    plain.add(new T.BoxGeometry(7.3, 0.5, 5.7), mat(hx, 0.25, hz), '#9e958a', { jitter: 0.1 });
    const gable = new T.Shape();
    gable.moveTo(-2.7, 0);
    gable.lineTo(2.7, 0);
    gable.lineTo(0, 2.0);
    gable.closePath();
    const ends = new T.ExtrudeGeometry(gable, { depth: 7, bevelEnabled: false });
    ends.translate(0, 0, -3.5);
    wood.add(ends, mat(hx, 3.4, hz, 0, Math.PI / 2, 0), '#f7efe3', { uv: [0.5, 0.5] });
    const slope = Math.atan2(2.0, 2.7);
    const slab = Math.hypot(2.0, 2.7) + 0.35;
    for (const s of [-1, 1]) roof.add(new T.BoxGeometry(7.8, 0.12, slab), mat(hx, 3.4 + 1.0, hz + s * 1.35, s * slope, 0, 0), '#ffffff', { uv: [4, 2] });
    wood.add(new T.BoxGeometry(1.2, 2.1, 0.08), mat(hx, 1.55, hz - 2.72), '#8a5a3a', { uv: [0.5, 1] });
    for (const s of [-1, 1]) {
      plain.add(new T.BoxGeometry(1.1, 1, 0.06), mat(hx + s * 2.1, 2.1, hz - 2.72), '#9fd0ef');
      wood.add(new T.BoxGeometry(1.3, 0.1, 0.12), mat(hx + s * 2.1, 1.55, hz - 2.76), '#ffffff', { uv: [0.5, 0.1] });
      wood.add(new T.BoxGeometry(1.3, 0.1, 0.12), mat(hx + s * 2.1, 2.65, hz - 2.76), '#ffffff', { uv: [0.5, 0.1] });
      wood.add(new T.BoxGeometry(0.08, 1.1, 0.1), mat(hx + s * 2.1, 2.1, hz - 2.75), '#ffffff', { uv: [0.1, 0.5] });
      plain.add(new T.BoxGeometry(0.9, 0.3, 0.3), mat(hx + s * 2.1, 1.35, hz - 2.95), '#b5623a', { jitter: 0.1 });
      for (let k = 0; k < 6; k++) plain.add(new T.SphereGeometry(0.1, 6, 4), mat(hx + s * 2.1 - 0.35 + k * 0.14, 1.55, hz - 2.95), k % 2 ? '#ff5d7a' : '#ffd23f');
    }
    stone.add(new T.BoxGeometry(0.7, 1.6, 0.7), mat(hx + 2.2, 5.3, hz + 1), '#ffffff', { uv: [1, 2] });
    this.obstacles.push({ x: hx - 2.2, z: hz, r: 2.7 }, { x: hx + 2.2, z: hz, r: 2.7 });
    // peti buah panen di depan rumah
    const crateC = ['#c8342a', '#f2a51c', '#6fae3a'];
    for (let i = 0; i < 3; i++) {
      wood.add(new T.BoxGeometry(0.9, 0.55, 0.65), mat(hx - 3.6 + i * 1.05, 0.28, hz - 4.1, 0, (r() - 0.5) * 0.2), '#e6c9a0', { uv: [1, 0.6] });
      for (let k = 0; k < 6; k++) plain.add(new T.SphereGeometry(0.14, 12, 8), mat(hx - 3.9 + i * 1.05 + (k % 3) * 0.28, 0.6, hz - 4.25 + Math.floor(k / 3) * 0.28), crateC[i], { jitter: 0.08 });
    }
    this.obstacles.push({ x: hx - 2.55, z: hz - 4.1, r: 1.6 });

    // kolam dengan tepian batu
    const px = 12,
      pz = 30;
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * 6.28;
      stone.add(new T.DodecahedronGeometry(0.5 + r() * 0.3, 1), mat(px + Math.cos(a) * 6.5, 0.1, pz + Math.sin(a) * 5.1, r(), r(), 0, 1, 0.55, 1), '#e8e2da', { uv: [0.5, 0.5] });
    }
    const water = new T.ShaderMaterial({
      uniforms: { uTime: this.uTime, sun: { value: SUN_DIR } },
      transparent: true,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `uniform float uTime; uniform vec3 sun; varying vec3 vW;
        void main(){
          vec2 p = vW.xz;
          vec3 n = normalize(vec3(sin(p.x*1.3+uTime*1.1)*0.08 + sin(p.y*2.1-uTime*0.8)*0.05, 1.0, cos(p.y*1.7+uTime*0.9)*0.08 + cos(p.x*2.6+uTime*1.3)*0.04));
          vec3 v = normalize(cameraPosition - vW);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
          vec3 deep = vec3(0.10,0.30,0.32), sky = vec3(0.62,0.80,0.95);
          vec3 c = mix(deep, sky, 0.25 + fres*0.7);
          vec3 h = normalize(sun + v);
          c += vec3(1.0,0.95,0.85) * pow(max(dot(n, h), 0.0), 180.0) * 1.5;
          gl_FragColor = vec4(c, 0.92); }`,
    });
    const pond = new T.Mesh(new T.CircleGeometry(5.8, 40), water);
    pond.rotation.x = -Math.PI / 2;
    pond.scale.set(1.12, 0.88, 1);
    pond.position.set(px, 0.05, pz);
    this.scene.add(pond);
    for (let i = 0; i < 7; i++) plain.add(new T.CircleGeometry(0.42, 14, 0.35, 5.8), mat(px - 3.5 + r() * 7, 0.08, pz - 2.5 + r() * 5, -Math.PI / 2, 0, r() * 6), '#4f8f37', { jitter: 0.1 });
    for (let i = 0; i < 16; i++) {
      const a = r() * 6.28;
      plain.add(new T.CylinderGeometry(0.015, 0.02, 1.2 + r() * 0.5, 4), mat(px + Math.cos(a) * 6.9, 0.6, pz + Math.sin(a) * 5.4, (r() - 0.5) * 0.2, 0, (r() - 0.5) * 0.2), '#6d8a3a', { sway: 0.05 });
    }
    this.obstacles.push({ x: px - 2.6, z: pz, r: 4.4 }, { x: px + 2.6, z: pz, r: 4.4 });

    // kincir angin
    const wx = 34,
      wz = 30;
    wood.add(new T.CylinderGeometry(1, 1.8, 8, 10), mat(wx, 4, wz), '#faf3e8', { uv: [3, 3] });
    roof.add(new T.ConeGeometry(1.5, 2, 10), mat(wx, 9, wz), '#ffffff', { uv: [3, 1] });
    wood.add(new T.BoxGeometry(1, 1.8, 0.1), mat(wx, 0.9, wz - 1.72), '#8a5a3a', { uv: [0.5, 1] });
    this.obstacles.push({ x: wx, z: wz, r: 2.2 });
    const mill = new T.Group();
    const bladeMat = new T.MeshStandardMaterial({ map: this.keep(TX.planks()), color: '#f2e8da', roughness: 0.85 });
    for (let i = 0; i < 4; i++) {
      const b = new T.Mesh(new T.BoxGeometry(0.9, 4.2, 0.06), bladeMat);
      b.position.y = 2.3;
      b.castShadow = true;
      const arm = new T.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      arm.add(b);
      mill.add(arm);
    }
    mill.add(new T.Mesh(new T.SphereGeometry(0.35, 12, 8), new T.MeshStandardMaterial({ color: '#6b4a31' })));
    mill.position.set(wx, 7.6, wz - 1.6);
    this.scene.add(mill);
    this.windmill = mill;

    // orang-orangan sawah
    const sx = 30,
      sz = 20;
    wood.add(new T.BoxGeometry(0.12, 2.4, 0.12), mat(sx, 1.2, sz), '#c9a98a');
    wood.add(new T.BoxGeometry(1.8, 0.1, 0.1), mat(sx, 1.9, sz), '#c9a98a');
    plain.add(new T.BoxGeometry(0.8, 0.9, 0.35), mat(sx, 1.7, sz), '#3b6fb6', { jitter: 0.1 });
    plain.add(new T.SphereGeometry(0.32, 14, 10), mat(sx, 2.5, sz), '#e2c17a', { jitter: 0.15 });
    plain.add(new T.ConeGeometry(0.72, 0.36, 18), mat(sx, 2.9, sz), '#d8b561', { jitter: 0.15 });
    this.obstacles.push({ x: sx, z: sz, r: 0.6 });

    // papan nama petak + gerbang utama
    const signs: [string, string, FruitGroup][] = [
      [ZONE_NAME.sehari, '#e8701a', 'sehari'],
      [ZONE_NAME.nusantara, '#1b9e55', 'nusantara'],
      [ZONE_NAME.toko, '#7a3fd6', 'toko'],
    ];
    for (const [text, color, grp] of signs) {
      const { x, z } = zoneSign(grp);
      for (const o of [-1.1, 1.1]) wood.add(new T.BoxGeometry(0.14, 2.2, 0.14), mat(x + o, 1.1, z), '#b99a7a', { uv: [0.2, 2] });
      const tex = signTex(text, color);
      this.textures.push(tex);
      for (const back of [false, true]) {
        const board = new T.Mesh(new T.PlaneGeometry(2.9, 0.9), new T.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
        board.position.set(x, 1.95, z + (back ? -0.08 : 0.08));
        if (back) board.rotation.y = Math.PI;
        board.castShadow = true;
        this.scene.add(board);
      }
    }
    const gz = -H;
    for (const s of [-1, 1]) wood.add(new T.BoxGeometry(0.45, 4.6, 0.45), mat(s * 3, 2.3, gz), '#b99a7a', { uv: [0.5, 3] });
    wood.add(new T.BoxGeometry(7.2, 0.4, 0.5), mat(0, 4.7, gz), '#b99a7a', { uv: [4, 0.3] });
    const gateTex = signTex('Kebun Buah Rumila', '#e8701a');
    this.textures.push(gateTex);
    const gate = new T.Mesh(new T.PlaneGeometry(5.4, 1.6), new T.MeshStandardMaterial({ map: gateTex, roughness: 0.9 }));
    gate.position.set(0, 3.9, gz + 0.3);
    this.scene.add(gate);
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

    const add = (m: Merge, material: T.Material) => {
      const mesh = m.build(material);
      mesh.castShadow = mesh.receiveShadow = true;
      this.scene.add(mesh);
    };
    add(wood, swayMaterial(this.uTime, { map: this.keep(TX.planks()), roughness: 0.85 }));
    add(plain, swayMaterial(this.uTime, { roughness: 0.7 }));
    add(stone, new T.MeshStandardMaterial({ map: this.keep(TX.stones()), vertexColors: true, roughness: 0.95 }));
    add(roof, new T.MeshStandardMaterial({ map: this.keep(TX.roofTiles()), vertexColors: true, roughness: 0.7 }));

    // kupu-kupu
    const wingM = ['#ffb627', '#ff6b8b', '#8fd3ff', '#ffffff', '#b58cff'].map((c) => new T.MeshStandardMaterial({ color: c, side: T.DoubleSide, roughness: 0.6 }));
    for (let i = 0; i < 10; i++) {
      const g = new T.Group();
      const wings: T.Object3D[] = [];
      for (const s of [-1, 1]) {
        const w = new T.Mesh(new T.CircleGeometry(0.11, 8), wingM[i % 5]);
        w.geometry.translate(0.1, 0, 0);
        w.scale.x = s;
        const piv = new T.Group();
        piv.add(w);
        g.add(piv);
        wings.push(piv);
      }
      const p = this.plots[(i * 5 + 2) % this.plots.length];
      g.position.set(p.x, 1.5, p.z);
      this.scene.add(g);
      this.butterflies.push({ g, wings, c: new T.Vector3(p.x + 1.5, 1.2 + r(), p.z + 1.5), ph: r() * 6.28, r: 1.5 + r() * 2 });
    }
  }

  /* ---------------- pemain (anak petani bercaping & keranjang) ---------------- */

  private buildPlayer() {
    const std = (c: string, rough = 0.7) => new T.MeshStandardMaterial({ color: c, roughness: rough });
    const skin = std('#e9b98a', 0.6),
      shirt = std('#ff7a1a'),
      pants = std('#2f6fd6', 0.8),
      shoe = std('#4a3222'),
      hair = std('#2b1a10', 0.5),
      hat = std('#dcc07a', 0.9),
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
      const l = new T.Mesh(new T.CapsuleGeometry(0.1, 0.38, 6, 12), pants);
      l.position.y = -0.28;
      const s = new T.Mesh(new T.SphereGeometry(0.12, 12, 8), shoe);
      s.scale.set(1, 0.6, 1.4);
      s.position.set(0, -0.55, 0.05);
      leg.add(l, s);
    }
    const body = add(new T.Mesh(new T.CapsuleGeometry(0.26, 0.34, 8, 16), shirt));
    body.position.y = 0.98;
    const strap = std('#2f6fd6', 0.8);
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
      const a = new T.Mesh(new T.CapsuleGeometry(0.075, 0.3, 6, 10), shirt);
      a.position.y = -0.2;
      const h = new T.Mesh(new T.SphereGeometry(0.085, 12, 8), skin);
      h.position.y = -0.42;
      arm.add(a, h);
      arm.rotation.z = x < 0 ? -0.12 : 0.12;
    }

    const head = add(new T.Mesh(new T.SphereGeometry(0.33, 24, 16), skin));
    head.position.y = 1.62;
    const hr = new T.Mesh(new T.SphereGeometry(0.345, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
    hr.position.y = 1.64;
    hr.rotation.x = -0.25;
    P.add(hr);
    for (const x of [-0.12, 0.12]) {
      const e = new T.Mesh(new T.SphereGeometry(0.045, 12, 8), dark);
      e.position.set(x, 1.64, 0.29);
      e.scale.set(1, 1.3, 0.6);
      const c = new T.Mesh(new T.CircleGeometry(0.06, 12), std('#f59a9a'));
      c.position.set(x * 1.5, 1.54, 0.3);
      P.add(e, c);
    }
    const smile = new T.Mesh(new T.TorusGeometry(0.07, 0.016, 6, 12, Math.PI), dark);
    smile.position.set(0, 1.53, 0.31);
    smile.rotation.z = Math.PI;
    P.add(smile);
    // caping (topi petani anyaman)
    const brim = new T.Mesh(new T.ConeGeometry(0.72, 0.32, 28, 1, true), hat);
    brim.material.side = T.DoubleSide;
    brim.position.y = 1.98;
    P.add(brim);
    const band = new T.Mesh(new T.TorusGeometry(0.3, 0.03, 6, 20), std('#d2232a'));
    band.rotation.x = Math.PI / 2;
    band.position.y = 1.9;
    P.add(band);

    // keranjang rotan di punggung — terisi buah setiap kali menemukan buah baru
    const basket = new T.Group();
    const bk = new T.Mesh(new T.CylinderGeometry(0.3, 0.22, 0.42, 16, 1, true), std('#a8743f', 0.95));
    bk.material.side = T.DoubleSide;
    const bottom = new T.Mesh(new T.CircleGeometry(0.22, 16), std('#7a5230'));
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.2;
    const rim = new T.Mesh(new T.TorusGeometry(0.3, 0.03, 6, 20), std('#7a5230'));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.21;
    basket.add(bk, bottom, rim);
    basket.position.set(0, 1.08, -0.38);
    basket.rotation.x = -0.15;
    P.add(basket);

    P.traverse((o) => {
      if ((o as T.Mesh).isMesh) o.castShadow = true;
    });
    P.scale.setScalar(1.15);
    this.scene.add(P);
    this.parts = { legL, legR, armL, armR, basket };
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
      }
    });
    this.sparkleOn.needsUpdate = true;
    this.setBasket(count);
  }

  /** Buah terbang dari tanaman ke keranjang (saat baru ditemukan). */
  pick(id: string) {
    const m = this.markers.find((k) => k.plot.fruit.id === id);
    if (!m) return;
    const mesh = new T.Mesh(new T.SphereGeometry(0.2, 16, 12), new T.MeshStandardMaterial({ color: m.plot.fruit.color, roughness: 0.4, emissive: m.plot.fruit.color, emissiveIntensity: 0.2 }));
    const from = (m.spots[0]?.p ?? new T.Vector3(m.plot.x, 2, m.plot.z)).clone();
    mesh.position.copy(from);
    this.scene.add(mesh);
    this.fly.push({ mesh, from, t: 0 });
  }

  setStick(x: number, y: number) {
    this.stick.set(x, y);
    if (this.stick.lengthSq() > 0.01 && !this.tour) this.clearRoute();
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
    if (this.tour) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new T.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
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
    // bedengan & Pak Tani
    const extras: [string, number, number, number][] = [...BED_POS.map(([x, z], i) => [`bed:${i}`, x, z, 0.8] as [string, number, number, number]), ['npc', NPC_POS[0], NPC_POS[1], 1.6]];
    let bestKey: string | null = null,
      bk = 0.12 * (this.portrait ? 1.6 : 1);
    for (const [key, x, z, h] of extras) {
      v.set(x, h, z).project(this.camera);
      if (v.z > 1) continue;
      const d = Math.hypot((v.x - ndc.x) * this.camera.aspect, v.y - ndc.y);
      if (d < bk) {
        bk = d;
        bestKey = key;
      }
    }
    if (bestKey) return this.walkToKey(bestKey);
    const ray = new T.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hit = new T.Vector3();
    if (ray.ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), 0), hit)) {
      const lim = GARDEN.half - 1;
      hit.x = T.MathUtils.clamp(hit.x, -lim, lim);
      hit.z = T.MathUtils.clamp(hit.z, -lim, lim);
      this.waypoints = [hit.clone()];
      this.arriveKey = null;
      this.faceTo = null;
      sfx.tap();
      this.tapRing.position.set(hit.x, 0.06, hit.z);
      this.tapT = 0;
    }
  }

  walkToPlot(p: Plot) {
    const dir = new T.Vector3(this.pos.x - p.x, 0, this.pos.z - p.z);
    if (dir.lengthSq() < 0.01) dir.set(0, 0, 1);
    dir.normalize().multiplyScalar(p.reach);
    this.waypoints = [new T.Vector3(p.x + dir.x, 0, p.z + dir.z)];
    this.arriveKey = p.fruit.id;
    this.faceTo = new T.Vector3(p.x, 0, p.z);
    if (Math.hypot(this.pos.x - p.x, this.pos.z - p.z) < p.reach + 0.6) this.arrive();
  }

  /** Jalan ke bedengan ("bed:i") atau Pak Tani ("npc"); berdiri di sisi depan (menghadap kamera). */
  walkToKey(key: string) {
    const [x, z] = key === 'npc' ? NPC_POS : BED_POS[+key.slice(4)];
    const stand = new T.Vector3(x, 0, z + (key === 'npc' ? 1.8 : 2.1));
    this.waypoints = [stand];
    this.arriveKey = key;
    this.faceTo = new T.Vector3(x, 0, z);
    sfx.tap();
    if (Math.hypot(this.pos.x - x, this.pos.z - z) < 2.6) this.arrive();
  }

  setBeds(views: BedView[]) {
    this.farm.setBeds(views);
  }

  waterFx(i: number) {
    this.farm.water(i);
  }

  /** Buah hasil panen terbang dari bedengan ke keranjang. */
  harvestFx(i: number, color: string) {
    const mesh = new T.Mesh(new T.SphereGeometry(0.2, 16, 12), new T.MeshStandardMaterial({ color, roughness: 0.4, emissive: color, emissiveIntensity: 0.2 }));
    const from = this.farm.bedWorld(i);
    mesh.position.copy(from);
    this.scene.add(mesh);
    this.fly.push({ mesh, from, t: 0 });
  }

  setMissionAvailable(on: boolean) {
    this.farm.setNpcBubble(on ? this.exTex : null);
  }

  /** Mode tur: kontrol anak dinonaktifkan, anak berjalan sendiri. */
  setTour(on: boolean) {
    this.tour = on;
    this.walkPaused = false;
    this.focusAt = null;
    this.clearRoute();
    this.stick.set(0, 0);
    this.keys.clear();
  }

  /** Tur: berjalan ke buah (id), "plaza", atau "zona:<kelompok>" lewat lorong antarkolom. */
  tourTo(key: string) {
    let stand: T.Vector3, face: T.Vector3;
    if (key === 'plaza') {
      stand = new T.Vector3(0, 0, 3.6);
      face = new T.Vector3(0, 0, 0);
    } else if (key.startsWith('zona:')) {
      const s = zoneSign(key.slice(5) as FruitGroup);
      stand = new T.Vector3(s.x, 0, s.z + 2.4);
      face = new T.Vector3(s.x, 0, s.z);
    } else {
      const p = this.plots.find((q) => q.fruit.id === key);
      if (!p) return;
      stand = new T.Vector3(p.x, 0, p.z + p.reach + 0.2);
      face = new T.Vector3(p.x, 0, p.z);
    }
    this.focusAt = null;
    this.waypoints = this.route(this.pos, stand);
    this.arriveKey = key;
    this.faceTo = face;
    if (this.pos.distanceTo(stand) < 0.4) this.arrive();
  }

  setWalkPaused(p: boolean) {
    this.walkPaused = p;
  }

  /** Kamera mendekat ke tanaman/papan yang sedang dibahas (null = kembali mengikuti anak). */
  focus(key: string | null) {
    if (!key) {
      this.focusAt = null;
      return;
    }
    const m = this.markers.find((k) => k.plot.fruit.id === key);
    if (m) this.focusAt = new T.Vector3(m.plot.x, Math.min(m.top * 0.55, 2.2), m.plot.z);
    else if (key.startsWith('zona:')) {
      const s = zoneSign(key.slice(5) as FruitGroup);
      this.focusAt = new T.Vector3(s.x, 1.8, s.z);
    } else this.focusAt = new T.Vector3(0, 1.5, 0);
  }

  /** Rute lewat lorong di antara kolom tanaman (tidak menembus pohon). */
  private route(from: T.Vector3, to: T.Vector3) {
    if (Math.abs(from.z - to.z) < 0.6) return [to.clone()];
    const corridors = [-1, 1].flatMap((s) => [0, 1, 2, 3, 4, 5].map((c) => s * (GARDEN.first / 2 + c * GARDEN.step)));
    const mid = (from.x + to.x) / 2;
    const xc = corridors.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
    return [new T.Vector3(xc, 0, from.z), new T.Vector3(xc, 0, to.z), to.clone()];
  }

  private clearRoute() {
    this.waypoints = [];
    this.arriveKey = null;
    this.faceTo = null;
  }

  private arrive() {
    const key = this.arriveKey,
      face = this.faceTo;
    this.waypoints = [];
    this.arriveKey = null;
    this.faceTo = null;
    if (face) this.targetHeading = Math.atan2(face.x - this.pos.x, face.z - this.pos.z);
    if (key) this.cb.onArrive(key);
  }

  private setBasket(n: number) {
    const b = this.parts.basket;
    const want = Math.min(12, Math.ceil(n / 4));
    if (want === this.basketFruits) return;
    b.children.filter((c) => c.userData.fruit).forEach((c) => b.remove(c));
    const cols = this.plots.map((p) => p.fruit.color);
    for (let i = 0; i < want; i++) {
      const s = new T.Mesh(new T.SphereGeometry(0.1, 10, 8), new T.MeshStandardMaterial({ color: cols[(i * 7) % cols.length], roughness: 0.45 }));
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
    if (this.tour) return;
    const k = e.key.toLowerCase();
    if (!['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) return;
    if (e.type === 'keydown') {
      this.keys.add(k);
      this.clearRoute();
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
    return this.portrait ? new T.Vector3(0, 14, 11.5) : new T.Vector3(0, 10.5, 11);
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
    const next = this.buildQueue.shift();
    if (next) this.hanger.build(next.plot.fruit, next.plot.kind, next.spots);
    this.renderer.render(this.scene, this.camera);
  };

  private step(dt: number) {
    const t = this.uTime.value;
    const move = new T.Vector2(this.stick.x, this.stick.y);
    if (this.keys.size) {
      move.set(0, 0);
      if (this.keys.has('arrowleft') || this.keys.has('a')) move.x -= 1;
      if (this.keys.has('arrowright') || this.keys.has('d')) move.x += 1;
      if (this.keys.has('arrowup') || this.keys.has('w')) move.y += 1;
      if (this.keys.has('arrowdown') || this.keys.has('s')) move.y -= 1;
    }
    if (this.tour) move.set(0, 0);
    let want = 0;
    const dir = new T.Vector3();
    const target = this.waypoints[0];
    if (move.lengthSq() > 0.01) {
      dir.set(move.x, 0, -move.y);
      want = Math.min(1, move.length());
      dir.normalize();
    } else if (target && !this.walkPaused) {
      dir.subVectors(target, this.pos).setY(0);
      const d = dir.length();
      if (d < 0.3) {
        this.waypoints.shift();
        if (!this.waypoints.length) this.arrive();
      } else {
        dir.divideScalar(d);
        want = this.waypoints.length > 1 ? 1 : Math.min(1, d / 1.2 + 0.35);
      }
    }
    const MAX = this.tour ? 7 : 6.2;
    this.speed = T.MathUtils.damp(this.speed, want * MAX, 8, dt);
    if (want > 0) {
      this.targetHeading = null;
      const h = Math.atan2(dir.x, dir.z);
      let dh = h - this.heading;
      dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      this.heading += dh * Math.min(1, dt * 10);
    } else if (this.targetHeading !== null) {
      let dh = this.targetHeading - this.heading;
      dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      this.heading += dh * Math.min(1, dt * 6);
    }
    if (this.speed > 0.05 && want > 0) {
      this.pos.addScaledVector(dir, this.speed * dt);
      this.collide();
      // mode bebas: tiba di tanaman begitu cukup dekat
      if (!this.tour && this.arriveKey && this.faceTo && Math.hypot(this.pos.x - this.faceTo.x, this.pos.z - this.faceTo.z) < 2.55) this.arrive();
    }
    this.player.position.copy(this.pos);
    this.player.rotation.y = this.heading;

    // animasi jalan / diam
    const P = this.parts;
    const k = this.speed / MAX;
    this.walkPh += dt * (4 + this.speed * 1.6);
    // langkah kaki di rumput (dua langkah per ayunan)
    const stepIdx = Math.floor(this.walkPh / Math.PI);
    if (stepIdx !== this.lastStep && this.speed > 1.5) sfx.step();
    this.lastStep = stepIdx;
    const sw = Math.sin(this.walkPh) * 0.75 * k;
    P.legL.rotation.x = sw;
    P.legR.rotation.x = -sw;
    P.armL.rotation.x = -sw * 0.9;
    P.armR.rotation.x = sw * 0.9;
    this.player.position.y = Math.abs(Math.cos(this.walkPh)) * 0.07 * k + Math.sin(t * 2) * 0.012 * (1 - k);
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
    let nearId: string | null = near?.fruit.id ?? null;
    if (!this.tour) {
      BED_POS.forEach(([x, z], i) => {
        const d = Math.hypot(x - this.pos.x, z - this.pos.z);
        if (d < Math.min(nd, 2.8)) {
          nd = d;
          nearId = `bed:${i}`;
        }
      });
      const dn = Math.hypot(NPC_POS[0] - this.pos.x, NPC_POS[1] - this.pos.z);
      if (dn < Math.min(nd, 2.8)) nearId = 'npc';
    }
    if (nearId !== this.near) {
      this.near = nearId;
      this.cb.onNear(nearId);
    }

    // penanda melayang & membesar saat didekati
    for (const m of this.markers) {
      const isNear = m.plot.fruit.id === this.near;
      const s = (m.found ? 1.15 : 0.95) * (isNear ? 1.25 : 1);
      const cur = m.sprite.scale.x;
      const ns = cur + (s - cur) * Math.min(1, dt * 8);
      m.sprite.scale.set(ns, ns * 1.17, 1);
      m.sprite.position.y = m.top + 0.9 + Math.sin(t * 2 + m.plot.x * 0.3) * 0.12;
      // balon yang terlalu dekat kamera (mis. pohon tetangga saat kamera mendekat di tur) memudar & hilang,
      // supaya tidak menutupi layar seperti gambar raksasa
      const dc = m.sprite.position.distanceTo(this.camera.position);
      const op = T.MathUtils.smoothstep(dc, 4.5, 8.5);
      m.sprite.material.opacity = op;
      m.sprite.visible = op > 0.02;
    }

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

    this.farm.update(t, dt);
    // dunia hidup
    this.windmill.rotation.z -= dt * 0.6;
    for (const c of this.clouds) {
      c.position.x += dt * 0.9;
      if (c.position.x > 150) c.position.x = -150;
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

    // matahari & bayangan mengikuti anak
    this.sun.position.copy(this.pos).addScaledVector(SUN_DIR, 45);
    this.sun.target.position.copy(this.pos);

    // kamera: ikuti anak dengan halus; saat tur membahas buah, mendekat ke tanamannya
    this.focusK = T.MathUtils.damp(this.focusK, this.focusAt ? 1 : 0, 2, dt);
    const off = this.camOffset().multiplyScalar(1 - this.focusK * 0.38);
    const want2 = new T.Vector3().copy(this.pos).add(off);
    const look = new T.Vector3().copy(this.pos).add(new T.Vector3(0, 0.8, -2));
    if (this.focusAt) {
      const fl = this.focusAt.clone();
      // di layar tegak kartu info menutup bagian bawah → pandang sedikit ke depan agar tanaman di atas kartu
      if (this.portrait) fl.add(new T.Vector3(0, -1.2, 2.2));
      look.lerp(fl, this.focusK);
      want2.x = T.MathUtils.lerp(want2.x, fl.x, this.focusK * 0.5);
    }
    const f = 1 - Math.exp(-dt * 2.5);
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
    this.hanger.dispose();
    this.scene.traverse((o) => {
      const m = o as T.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mt = m.material as T.Material | T.Material[] | undefined;
      if (Array.isArray(mt)) mt.forEach((x) => x.dispose());
      else if (mt) mt.dispose();
    });
    this.textures.forEach((t) => t.dispose());
    this.qTex.dispose();
    this.thumbTex.forEach((t) => t.dispose());
    this.scene.environment?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
