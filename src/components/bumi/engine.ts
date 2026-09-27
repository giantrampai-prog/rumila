// Mesin Petualangan ke Dalam Bumi. Setiap "lokasi" adalah panggung terpisah (bukit & mulut gua, penampang
// tanah, gua kapur, sungai bawah tanah, dinding fosil, gua kristal, terowongan bor kapsul, lautan besi cair,
// inti dalam, gunung api, luar angkasa + Bumi terbelah). Pindah lokasi = layar meredup sebentar (seperti
// turun ke kedalaman berikutnya). Mode Tur: 16 adegan bernarasi; mode Jelajah: kamera bebas + dok karakter.

import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { create } from 'zustand';
import { sfx } from '@/lib/sfx';
import { SegmentPlayer, loadBuffer, unlockAudioContext } from '@/lib/segment-player';
import { LAPISAN, TUR_BUMI, TUR_BUMI_AUDIO, bumiDwell, type BumiAudioPart, type BumiSet } from '@/lib/bumi/misi';
import * as P from './props';

export type BumiMode = 'jelajah' | 'tur';

interface BumiUI {
  mode: BumiMode;
  stop: number;
  progress: number;
  playing: boolean;
  finished: boolean;
  focus: string | null;
  /** kedalaman (meter); -1 = di luar angkasa */
  depth: number;
  loading: boolean;
}

export const useBumi = create<BumiUI>(() => ({ mode: 'jelajah', stop: 0, progress: 0, playing: false, finished: false, focus: null, depth: 0, loading: false }));

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const V = (x: number, y: number, z: number) => new T.Vector3(x, y, z);

type Loc = 'surf' | 'tanah' | 'gua' | 'sungai' | 'fosil' | 'kristal' | 'tunnel' | 'luar' | 'dalam' | 'gunung' | 'space';

const LOC_X: Record<Loc, number> = { surf: 0, tanah: 200, gua: 400, sungai: 600, fosil: 800, kristal: 1000, tunnel: 1200, luar: 1400, dalam: 1600, gunung: 1800, space: 3000 };
const C = (l: Loc) => V(LOC_X[l], 0, 0);

const SET_LOC: Record<BumiSet, Loc> = {
  permukaan: 'surf',
  'mulut-gua': 'surf',
  tanah: 'tanah',
  'gua-kapur': 'gua',
  sungai: 'sungai',
  fosil: 'fosil',
  kristal: 'kristal',
  kerak: 'tunnel',
  moho: 'tunnel',
  'mantel-atas': 'tunnel',
  'mantel-bawah': 'tunnel',
  'inti-luar': 'luar',
  'inti-dalam': 'dalam',
  magnet: 'space',
  selesai: 'space',
  ringkasan: 'space',
};

/** Kedalaman yang ditampilkan saat menjelajah bebas di tiap lokasi. */
const LOC_DEPTH: Record<Loc, number> = { surf: 0, tanah: 1, gua: 30, sungai: 120, fosil: 500, kristal: 2000, tunnel: 20000, luar: 4000000, dalam: 6000000, gunung: 3000, space: -1 };

interface Env {
  bg: string;
  fog: string;
  density: number;
  hemi: [string, string, number];
  sun: number;
  far: number;
  exposure: number;
  lights: { p: T.Vector3; c: string; i: number; d: number }[];
}

const ENV: Record<Loc, Env> = {
  surf: { bg: '#f6c89a', fog: '#f3d2b0', density: 0.012, hemi: ['#ffe2c0', '#4a5a30', 1.2], sun: 2.6, far: 700, exposure: 1.05, lights: [] },
  tanah: { bg: '#1a120c', fog: '#1a120c', density: 0.03, hemi: ['#ffe8cc', '#2a1a10', 0.9], sun: 1.4, far: 120, exposure: 1.1, lights: [{ p: V(0, 1, 4), c: '#ffd9a0', i: 14, d: 14 }] },
  gua: {
    bg: '#0d0b10',
    fog: '#120f16',
    density: 0.045,
    hemi: ['#9fb4d8', '#2a2018', 0.5],
    sun: 0,
    far: 120,
    exposure: 1.2,
    lights: [
      { p: V(-4, 3, -3), c: '#ffc27a', i: 18, d: 14 },
      { p: V(4, 2.5, 2), c: '#8fc8ff', i: 12, d: 12 },
      { p: V(3, 0.6, -3), c: '#6fe0ff', i: 6, d: 6 },
    ],
  },
  sungai: {
    bg: '#06100f',
    fog: '#0a1716',
    density: 0.05,
    hemi: ['#8fd8d0', '#101814', 0.55],
    sun: 0,
    far: 120,
    exposure: 1.2,
    lights: [
      { p: V(-10, 2.5, 0), c: '#7fe8ff', i: 12, d: 14 },
      { p: V(2, 2.5, 0), c: '#ffc27a', i: 12, d: 14 },
    ],
  },
  fosil: { bg: '#18120c', fog: '#1c150e', density: 0.035, hemi: ['#ffe2b8', '#2a1c10', 0.75], sun: 0, far: 120, exposure: 1.15, lights: [{ p: V(-5, 3, 3), c: '#ffd29a', i: 16, d: 16 }, { p: V(6, 3, 3), c: '#ffd29a', i: 16, d: 16 }] },
  kristal: {
    bg: '#0c0716',
    fog: '#140a22',
    density: 0.04,
    hemi: ['#d7b8ff', '#1a1026', 0.6],
    sun: 0,
    far: 120,
    exposure: 1.25,
    lights: [
      { p: V(-3, 2, -2), c: '#b07aff', i: 16, d: 12 },
      { p: V(3, 1.5, -1), c: '#7fd8ff', i: 12, d: 10 },
      { p: V(0, 4, 3), c: '#ffffff', i: 8, d: 14 },
    ],
  },
  tunnel: { bg: '#120806', fog: '#1a0a06', density: 0.02, hemi: ['#ffc8a0', '#402010', 1.3], sun: 0, far: 150, exposure: 1.1, lights: [{ p: V(2, 1, 3), c: '#ffd0a0', i: 25, d: 12 }] },
  luar: { bg: '#5a1c02', fog: '#8a3a08', density: 0.035, hemi: ['#ffcf7a', '#6a1a00', 1.3], sun: 0, far: 150, exposure: 1.05, lights: [{ p: V(0, -3, 3), c: '#ffb03a', i: 20, d: 20 }] },
  dalam: { bg: '#6a2a02', fog: '#a04a0a', density: 0.028, hemi: ['#fff0b0', '#7a2a00', 1.3], sun: 0, far: 150, exposure: 1.0, lights: [{ p: V(0, -5, 2), c: '#fff0b0', i: 40, d: 30 }] },
  gunung: { bg: '#f0a070', fog: '#e8a07a', density: 0.012, hemi: ['#ffd0a0', '#3a2a20', 1.1], sun: 2.2, far: 700, exposure: 1.05, lights: [{ p: V(0, -3, 2), c: '#ff6a1a', i: 30, d: 14 }] },
  space: { bg: '#02030a', fog: '#02030a', density: 0, hemi: ['#d0e0ff', '#303050', 1.3], sun: 2, far: 2000, exposure: 1.05, lights: [] },
};

/** Titik pandang awal kamera per lokasi (mode Jelajah). */
const HOME: Record<Loc, { p: T.Vector3; t: T.Vector3 }> = {
  surf: { p: V(4, 2.4, 9), t: V(0, 1.2, -3) },
  tanah: { p: V(0.5, 0.6, 6.5), t: V(0, 0, -0.5) },
  gua: { p: V(5, 2.2, 7), t: V(0, 1.6, -1) },
  sungai: { p: V(-2, 1.8, 5), t: V(-6, 0.5, 0) },
  fosil: { p: V(0, 1.8, 6), t: V(0, 2, -2) },
  kristal: { p: V(3, 1.8, 5), t: V(0, 0.8, -1.5) },
  tunnel: { p: V(3.1, 1.3, 3.0), t: V(0, 0.1, 0) },
  luar: { p: V(4, 1.5, 6), t: V(0, 0, 0) },
  dalam: { p: V(5, 2, 7), t: V(0, -4, 0) },
  gunung: { p: V(0, 4, 20), t: V(0, 0, 0) },
  space: { p: V(-22, 14, -34), t: V(0, 0, 0) },
};

const partFor = (i: number) => TUR_BUMI_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length) ?? null;
const locOf = (i: number) => SET_LOC[TUR_BUMI[i].set];

/** Lapisan yang sedang disorot pada adegan ringkasan (0 kerak … 4 inti dalam). */
export const ringkasanLayer = (p: number) => Math.min(LAPISAN.length - 1, Math.max(0, Math.floor((p - 0.12) / 0.13)));

/* ---------------- shader bersama ---------------- */

const NOISE = `
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<5;i++){ s+=a*vn(p); p*=2.03; a*=0.5; } return s; }`;

export class BumiEngine {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(55, 1, 0.05, 700);
  private controls: OrbitControls;
  private ro: ResizeObserver;
  private raf = 0;
  private last = performance.now();
  private uTime = { value: 0 };
  private fadeEl: HTMLDivElement;

  private hemi = new T.HemisphereLight('#fff', '#333', 1);
  private sun = new T.DirectionalLight('#fff1d8', 2);
  private pool: T.PointLight[] = [];
  private fog = new T.FogExp2('#000', 0.02);

  private groups = new Map<Loc, T.Group>();
  private loc: Loc = 'gua';
  private agam = P.explorer();
  private pod = P.capsule();
  private raftM = P.raft();
  private animated: T.Object3D[] = [];
  private things = new Map<string, { loc: Loc; obj: T.Object3D; dist: number }>();

  // lokasi khusus yang dianimasikan
  private tunnelMat!: T.ShaderMaterial;
  private debris!: T.Points;
  private waves: T.Mesh[] = [];
  private flyBats: { o: T.Object3D; ph: number }[] = [];
  private ants: { o: T.Object3D; path: T.CatmullRomCurve3; ph: number; sp: number }[] = [];
  private drips!: T.Points;
  private wind!: T.Points;
  private windSeed: Float32Array = new Float32Array(0);
  private cutFaces: T.MeshBasicMaterial[] = [];
  private cutHi = -2;
  private aurora: T.Mesh[] = [];

  /* tur */
  private idx = 0;
  private t = 0;
  private playing = false;
  private durs = TUR_BUMI.map(bumiDwell);
  private player = new SegmentPlayer();
  private buf: AudioBuffer | null = null;
  private part: BumiAudioPart | null = null;
  private done = false;
  private pending = false;
  private camPos = V(0, 2, 6);
  private camLook = V(0, 1, 0);
  private snap = true;
  private nextStep = 0;
  private nextRumble = 0;
  private nextDrip = 0;

  /* peredup antar-lokasi */
  private fade = 0;
  private fadeDir = 0;
  private onDark: (() => void) | null = null;

  /* jelajah */
  private flyK = 1;
  private flyFrom = { p: V(0, 0, 0), t: V(0, 0, 0) };
  private flyGoal = { p: V(0, 0, 0), t: V(0, 0, 0) };
  private lastUi = 0;

  constructor(private host: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);
    this.fadeEl = document.createElement('div');
    Object.assign(this.fadeEl.style, { position: 'absolute', inset: '0', background: '#000', opacity: '0', pointerEvents: 'none' });
    host.appendChild(this.fadeEl);

    this.scene.fog = this.fog;
    this.scene.add(this.hemi, this.sun, this.sun.target, new T.AmbientLight('#ffffff', 0.08));
    // jumlah lampu tetap (tidak memicu kompilasi ulang shader saat pindah lokasi)
    for (let i = 0; i < 3; i++) {
      const l = new T.PointLight('#fff', 0, 10, 1.5);
      this.pool.push(l);
      this.scene.add(l);
    }
    this.scene.add(this.camera);

    this.buildSurface();
    this.buildTanah();
    this.buildGua();
    this.buildSungai();
    this.buildFosil();
    this.buildKristal();
    this.buildTunnel();
    this.buildCore();
    this.buildGunung();
    this.buildSpace();

    this.agam.root.scale.setScalar(1.45);
    this.scene.add(this.agam.root, this.pod, this.raftM, this.agam.lamp!, this.agam.lamp!.target);
    this.raftM.visible = false;
    this.things.set('geo-explorer', { loc: 'tunnel', obj: this.pod, dist: 4 });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 0.6;
    this.controls.maxDistance = 14;

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();

    // kompilasi semua shader di awal supaya tidak tersendat saat pertama kali masuk lokasi
    try {
      this.renderer.compile(this.scene, this.camera);
    } catch {}
    this.enter('gua');
    this.home(true);
    this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------------- pembantu ---------------- */

  private group(l: Loc) {
    let g = this.groups.get(l);
    if (!g) {
      g = new T.Group();
      g.position.copy(C(l));
      this.scene.add(g);
      this.groups.set(l, g);
    }
    return g;
  }

  private add(l: Loc, o: T.Object3D, x = 0, y = 0, z = 0, s = 1, ry = 0) {
    o.position.set(x, y, z);
    if (s !== 1) o.scale.multiplyScalar(s);
    if (ry) o.rotation.y = ry;
    this.group(l).add(o);
    if (o.userData.update) this.animated.push(o);
    return o;
  }

  private thing(id: string, l: Loc, o: T.Object3D, dist: number) {
    this.things.set(id, { loc: l, obj: o, dist });
  }

  private tex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]) {
    const t = P.canvasTex(w, h, draw);
    if (repeat) {
      t.wrapS = t.wrapT = T.RepeatWrapping;
      t.repeat.set(...repeat);
    }
    return t;
  }

  /** Tekstur berbintik (batu/tanah). */
  private speckle(base: string, dots: string[], n: number, repeat: [number, number], seed = 1) {
    const r = P.rng(seed);
    return this.tex(
      256,
      256,
      (g, w, h) => {
        g.fillStyle = base;
        g.fillRect(0, 0, w, h);
        for (let i = 0; i < n; i++) {
          g.fillStyle = dots[i % dots.length];
          g.globalAlpha = 0.12 + r() * 0.3;
          g.beginPath();
          g.arc(r() * w, r() * h, 0.6 + r() * r() * 3.5, 0, 6.3);
          g.fill();
        }
        g.globalAlpha = 1;
      },
      repeat,
    );
  }

  /** Kubah gua (setengah bola dari dalam) dengan permukaan bergelombang. */
  private caveDome(l: Loc, radius: number, flat: number, color: string, seed: number) {
    const r = P.rng(seed);
    const g = new T.SphereGeometry(radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = g.attributes.position;
    const ph = [r() * 6, r() * 6, r() * 6];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      const k = 1 + Math.sin(x * 0.9 + ph[0]) * 0.05 + Math.sin(z * 1.3 + y + ph[1]) * 0.05 + Math.sin((x + z) * 2.7 + ph[2]) * 0.025;
      p.setXYZ(i, x * k, y * k * flat, z * k);
    }
    g.computeVertexNormals();
    const m = new T.Mesh(g, new T.MeshStandardMaterial({ color, roughness: 0.95, side: T.BackSide, map: this.speckle('#ffffff', ['#8a7a6a', '#b0a090', '#6a5a4a'], 1400, [6, 3], seed) }));
    this.add(l, m);
    const fl = new T.Mesh(new T.CircleGeometry(radius * 1.02, 64), new T.MeshStandardMaterial({ color: new T.Color(color).multiplyScalar(0.7), roughness: 1, map: this.speckle('#ffffff', ['#6a5a4a', '#9a8a7a'], 1600, [8, 8], seed + 1) }));
    fl.rotation.x = -Math.PI / 2;
    this.add(l, fl);
    return (x: number, z: number) => {
      const d = Math.min(radius * 0.98, Math.hypot(x, z));
      return Math.sqrt(radius * radius - d * d) * flat;
    };
  }

  /* ---------------- lokasi: bukit & mulut gua ---------------- */

  private buildSurface() {
    const l: Loc = 'surf';
    const r = P.rng(3);
    const sky = new T.Mesh(
      new T.SphereGeometry(400, 32, 16),
      new T.ShaderMaterial({
        side: T.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `varying vec3 vD; void main(){ float h = vD.y;
          vec3 c = mix(vec3(1.0,0.72,0.45), vec3(0.98,0.85,0.7), smoothstep(0.0, 0.12, h));
          c = mix(c, vec3(0.45,0.66,0.92), smoothstep(0.12, 0.7, h));
          float s = max(0.0, dot(vD, normalize(vec3(0.7, 0.08, -0.6))));
          c += vec3(1.0,0.75,0.4) * (pow(s, 400.0) * 3.0 + pow(s, 10.0) * 0.4);
          gl_FragColor = vec4(c, 1.0); }`,
      }),
    );
    this.add(l, sky);
    const grass = new T.MeshStandardMaterial({ color: '#7fae4a', roughness: 1, map: this.speckle('#ffffff', ['#5a8a30', '#9ac860', '#4a7a28'], 900, [30, 30], 5) });
    const ground = new T.Mesh(new T.CircleGeometry(160, 48), grass);
    ground.rotation.x = -Math.PI / 2;
    this.add(l, ground);
    // bukit kapur berselimut hutan, dengan mulut gua
    const hill = new T.Mesh(new T.SphereGeometry(14, 48, 24), new T.MeshStandardMaterial({ color: '#6f9a44', roughness: 1, map: grass.map }));
    hill.scale.set(1.3, 0.75, 1);
    this.add(l, hill, 0, -3, -18.2);
    for (let i = 0; i < 60; i++) {
      const a = Math.PI * (0.05 + r() * 0.9),
        d = 6 + r() * 14;
      const x = Math.cos(a) * d * 1.4,
        z = -18 - Math.sin(a) * d * 0.6 + 8;
      if (Math.abs(x) < 3 && z > -8) continue;
      const hy = Math.max(0, -3 + 0.75 * Math.sqrt(Math.max(0, 196 - (x / 1.3) ** 2 - (z + 18.2) ** 2)));
      this.add(l, this.tree(r), x, hy - 0.2, z, 0.8 + r() * 0.8);
    }
    for (let i = 0; i < 30; i++) {
      const a = r() * 6.28,
        d = 12 + r() * 50;
      const x = Math.cos(a) * d,
        z = Math.sin(a) * d;
      if (z < -2 && Math.abs(x) < 20) continue;
      this.add(l, this.tree(r), x, 0, z, 0.9 + r());
    }
    // mulut gua: lubang gelap + bingkai batu kapur
    const mouth = new T.Mesh(new T.CircleGeometry(2.3, 40, 0, Math.PI), new T.MeshBasicMaterial({ color: '#050403' }));
    mouth.scale.set(1, 1.15, 1);
    this.add(l, mouth, 0, 0, -5.25);
    const inner = new T.Mesh(new T.CylinderGeometry(2.3, 2.3, 6, 32, 1, true, -Math.PI / 2, Math.PI), new T.MeshStandardMaterial({ color: '#3a342c', roughness: 1, side: T.BackSide }));
    inner.rotation.x = Math.PI / 2;
    inner.scale.set(1, 1, 1.15);
    this.add(l, inner, 0, 0, -8.2);
    for (let i = 0; i < 16; i++) {
      const a = (i / 15) * Math.PI;
      const rk = P.rock(0.5 + r() * 0.5, '#c9bca6', r, 0.8);
      this.add(l, rk, Math.cos(a) * 2.6, Math.sin(a) * 2.8, -5 + r() * 0.3);
    }
    // perlengkapan ekspedisi di atas peti
    const crate = new T.Mesh(new T.BoxGeometry(0.9, 0.5, 0.6), new T.MeshStandardMaterial({ color: '#a8743a', roughness: 0.9 }));
    this.add(l, crate, 1.5, 0.25, 1.2, 1, -0.3);
    const rope = new T.Mesh(new T.TorusGeometry(0.16, 0.05, 8, 20), new T.MeshStandardMaterial({ color: '#ff9a2a', roughness: 0.9 }));
    rope.rotation.x = Math.PI / 2;
    this.add(l, rope, 1.3, 0.55, 1.1);
    const map = new T.Mesh(
      new T.PlaneGeometry(0.4, 0.3),
      new T.MeshStandardMaterial({
        map: this.tex(128, 96, (g, w, h) => {
          g.fillStyle = '#f2e2b8';
          g.fillRect(0, 0, w, h);
          g.strokeStyle = '#a0522d';
          g.lineWidth = 3;
          g.setLineDash([6, 5]);
          g.beginPath();
          g.moveTo(10, 80);
          g.bezierCurveTo(40, 20, 70, 90, 110, 20);
          g.stroke();
          g.fillStyle = '#d02020';
          g.font = 'bold 22px sans-serif';
          g.fillText('X', 100, 30);
        }),
      }),
    );
    map.rotation.x = -Math.PI / 2;
    map.rotation.z = 0.3;
    this.add(l, map, 1.75, 0.51, 1.25);
    const lamp = new T.Mesh(new T.CylinderGeometry(0.05, 0.06, 0.28, 12), new T.MeshStandardMaterial({ color: '#2c2f38' }));
    lamp.rotation.z = Math.PI / 2;
    this.add(l, lamp, 1.7, 0.56, 1.0);
    const helmet = new T.Mesh(new T.SphereGeometry(0.16, 20, 10, 0, 6.3, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: '#ffc21a', roughness: 0.35 }));
    this.add(l, helmet, -1.4, 0, 1.4);
    // bendera Merah Putih kecil di tiang
    const pole = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 2.2), new T.MeshStandardMaterial({ color: '#dddddd', metalness: 0.6, roughness: 0.3 }));
    this.add(l, pole, -2.2, 1.1, 0.4);
    const flag = new T.Mesh(
      new T.PlaneGeometry(0.7, 0.46, 12, 1),
      new T.MeshStandardMaterial({
        side: T.DoubleSide,
        map: this.tex(64, 42, (g, w, h) => {
          g.fillStyle = '#e0262b';
          g.fillRect(0, 0, w, h / 2);
          g.fillStyle = '#fff';
          g.fillRect(0, h / 2, w, h / 2);
        }),
      }),
    );
    flag.geometry.translate(0.35, 0, 0);
    flag.userData.update = (t: number) => {
      const pp = flag.geometry.attributes.position as T.BufferAttribute;
      for (let i = 0; i < pp.count; i++) pp.setZ(i, Math.sin(pp.getX(i) * 6 - t * 4) * 0.05 * pp.getX(i));
      pp.needsUpdate = true;
    };
    this.add(l, flag, -2.2, 1.95, 0.4);
  }

  private tree(r: () => number) {
    const g = new T.Group();
    const trunk = new T.Mesh(new T.CylinderGeometry(0.12, 0.18, 1.6, 8), new T.MeshStandardMaterial({ color: '#6a4a2a', roughness: 1 }));
    trunk.position.y = 0.8;
    g.add(trunk);
    const leaf = new T.MeshStandardMaterial({ color: ['#3f7a2a', '#4f8a30', '#2f6a24'][Math.floor(r() * 3)], roughness: 1, flatShading: true });
    for (let i = 0; i < 3; i++) {
      const b = new T.Mesh(new T.IcosahedronGeometry(0.8 + r() * 0.4, 1), leaf);
      b.position.set((r() - 0.5) * 0.8, 1.9 + r() * 0.6, (r() - 0.5) * 0.8);
      g.add(b);
    }
    return g;
  }

  /* ---------------- lokasi: penampang tanah ---------------- */

  private buildTanah() {
    const l: Loc = 'tanah';
    const r = P.rng(21);
    // dinding penampang: humus gelap di atas → tanah cokelat → tanah liat kemerahan → batuan
    const face = this.tex(1024, 640, (g, w, h) => {
      const q = g.createLinearGradient(0, 0, 0, h);
      q.addColorStop(0, '#3a2414');
      q.addColorStop(0.28, '#5a3a20');
      q.addColorStop(0.62, '#8a5a34');
      q.addColorStop(0.85, '#9a7a5a');
      q.addColorStop(1, '#7a7068');
      g.fillStyle = q;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) {
        const y = r() * h;
        g.fillStyle = y > h * 0.8 ? '#5a5048' : r() < 0.5 ? '#2a1a0e' : '#b08a60';
        g.globalAlpha = 0.25 + r() * 0.4;
        g.beginPath();
        g.ellipse(r() * w, y, 1 + r() * (y > h * 0.75 ? 16 : 4), 1 + r() * (y > h * 0.75 ? 10 : 3), r() * 3, 0, 6.3);
        g.fill();
      }
      g.globalAlpha = 1;
      // lorong cacing & sarang semut
      g.strokeStyle = 'rgba(40,24,12,.6)';
      g.lineCap = 'round';
      g.lineWidth = 10;
      for (let k = 0; k < 4; k++) {
        g.beginPath();
        let x = 100 + k * 250,
          y = 40;
        g.moveTo(x, y);
        for (let s = 0; s < 6; s++) {
          x += (r() - 0.5) * 120;
          y += 40 + r() * 40;
          g.lineTo(x, y);
        }
        g.stroke();
      }
      g.fillStyle = 'rgba(40,24,12,.7)';
      for (const [cx, cy] of [
        [700, 260],
        [800, 330],
        [640, 360],
      ]) {
        g.beginPath();
        g.ellipse(cx, cy, 46, 22, 0, 0, 6.3);
        g.fill();
      }
      g.lineWidth = 7;
      g.strokeStyle = 'rgba(40,24,12,.7)';
      g.beginPath();
      g.moveTo(760, 20);
      g.lineTo(720, 140);
      g.lineTo(700, 260);
      g.lineTo(800, 330);
      g.lineTo(640, 360);
      g.stroke();
    });
    const wall = new T.Mesh(new T.BoxGeometry(10, 6, 1.2), [
      new T.MeshStandardMaterial({ color: '#4a3020' }),
      new T.MeshStandardMaterial({ color: '#4a3020' }),
      new T.MeshStandardMaterial({ color: '#4a3020' }),
      new T.MeshStandardMaterial({ color: '#4a3020' }),
      new T.MeshStandardMaterial({ map: face, roughness: 1 }),
      new T.MeshStandardMaterial({ color: '#4a3020' }),
    ]);
    this.add(l, wall, 0, 0, -1.2);
    const top = 3;
    // rumput & tanaman di atas
    const grass = new T.Mesh(new T.BoxGeometry(10.1, 0.12, 1.3), new T.MeshStandardMaterial({ color: '#5a9a34', roughness: 1 }));
    this.add(l, grass, 0, top + 0.05, -1.2);
    const blade = new T.MeshStandardMaterial({ color: '#6fb040', side: T.DoubleSide });
    for (let i = 0; i < 260; i++) {
      const b = new T.Mesh(new T.PlaneGeometry(0.04, 0.2 + r() * 0.25), blade);
      b.position.set((r() - 0.5) * 9.8, top + 0.2, -1.2 + (r() - 0.5) * 1.1);
      b.rotation.set((r() - 0.5) * 0.4, r() * 3, (r() - 0.5) * 0.4);
      this.group(l).add(b);
    }
    for (let i = 0; i < 7; i++) this.add(l, P.mushroom(['#d8452a', '#e8c080', '#b0703a'][i % 3], r), -4 + i * 1.3 + r() * 0.4, top + 0.1, -0.8 + r() * 0.3, 1.6);
    // akar-akar menjuntai di depan penampang
    const rootMat = new T.MeshStandardMaterial({ color: '#c8a070', roughness: 0.9 });
    for (let i = 0; i < 9; i++) {
      const x0 = -4.2 + i * 1.05;
      const pts = [V(x0, top, -0.55)];
      for (let s = 1; s < 6; s++) pts.push(V(x0 + (r() - 0.5) * 0.6, top - s * (0.35 + r() * 0.25), -0.55 + r() * 0.1));
      this.group(l).add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 30, 0.035 - i * 0.001, 6), rootMat));
      for (let b = 0; b < 3; b++) {
        const s = pts[1 + b];
        const bp = [s, s.clone().add(V((r() - 0.5) * 0.6, -0.4, 0.02))];
        this.group(l).add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(bp), 6, 0.012, 5), rootMat));
      }
    }
    // cacing tanah di lorong
    for (const [x, y, s] of [
      [-3.1, 1.6, 3],
      [1.2, 0.4, 2.6],
      [-0.6, 2.2, 2.2],
    ] as const) {
      const w = this.add(l, P.worm(), x, y, -0.5, s);
      if (x === -3.1) this.thing('cacing-tanah', l, w, 1.4);
    }
    // semut berjalan menyusuri lorong sarang
    const nest = [V(2.3, 3, -0.52), V(2.1, 2.2, -0.52), V(1.9, 1.2, -0.52), V(2.4, 0.9, -0.52), V(1.4, 0.6, -0.52)];
    const path = new T.CatmullRomCurve3(nest);
    for (let i = 0; i < 9; i++) {
      const a = P.ant();
      a.scale.setScalar(2.4);
      this.group(l).add(a);
      this.ants.push({ o: a, path, ph: i / 9, sp: 0.04 + r() * 0.02 });
      if (i === 0) this.thing('semut-tanah', l, a, 0.9);
    }
    // batu-batu di lapisan bawah & lantai
    for (let i = 0; i < 10; i++) this.add(l, P.rock(0.2 + r() * 0.3, '#8a8078', r), (r() - 0.5) * 9, -2.5 + r() * 0.6, -0.55);
    const floor = new T.Mesh(new T.PlaneGeometry(40, 20), new T.MeshStandardMaterial({ color: '#3a2a1c', roughness: 1, map: this.speckle('#ffffff', ['#6a5a4a', '#2a1a10'], 500, [8, 4], 22) }));
    floor.rotation.x = -Math.PI / 2;
    this.add(l, floor, 0, -3, 4);
  }

  /* ---------------- lokasi: gua kapur ---------------- */

  private buildGua() {
    const l: Loc = 'gua';
    const r = P.rng(31);
    const ceil = this.caveDome(l, 15, 0.5, '#b8a78c', 31);
    // stalaktit menggantung & stalagmit tumbuh di bawahnya
    let first = true;
    for (let i = 0; i < 70; i++) {
      const a = r() * 6.28,
        d = 1.5 + r() * 11;
      const x = Math.cos(a) * d,
        z = Math.sin(a) * d;
      const h = 0.5 + r() * 2.2;
      const st = P.dripstone(h, r, true);
      this.add(l, st, x, ceil(x, z) + 0.2, z);
      if (first && Math.abs(x + 2) < 3 && z < 0 && z > -5) {
        this.thing('stalaktit', l, st, 3);
        first = false;
      }
      if (r() < 0.55) {
        const sg = P.dripstone(0.4 + r() * 1.4, r, false);
        this.add(l, sg, x + (r() - 0.5) * 0.2, 0, z + (r() - 0.5) * 0.2);
      }
    }
    // stalaktit & stalagmit utama dekat jalur (untuk fokus) + tiang batu
    const bigT = P.dripstone(2.4, r, true);
    this.add(l, bigT, -2.5, ceil(-2.5, -3) + 0.2, -3, 1.3);
    this.thing('stalaktit', l, bigT, 3.2);
    const bigM = P.dripstone(1.8, r, false);
    this.add(l, bigM, -2.5, 0, -3, 1.4);
    this.thing('stalagmit', l, bigM, 3);
    for (const [x, z] of [
      [5, -5],
      [-6, 3],
    ]) {
      const col = new T.Mesh(new T.CylinderGeometry(0.35, 0.6, ceil(x, z) + 0.2, 14, 8), new T.MeshStandardMaterial({ color: '#d8c092', roughness: 0.6 }));
      this.add(l, col, x, (ceil(x, z) + 0.2) / 2, z);
    }
    // kolam kecil jernih
    const pool = new T.Mesh(new T.CircleGeometry(2.4, 40), new T.MeshStandardMaterial({ color: '#1f6f7a', roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.85 }));
    pool.rotation.x = -Math.PI / 2;
    this.add(l, pool, 3, 0.03, -3);
    // kelelawar tidur bergelantungan
    for (let i = 0; i < 9; i++) {
      const x = -4 + (i % 3) * 0.45 + r() * 0.2,
        z = -1.5 - Math.floor(i / 3) * 0.45;
      const b = P.bat();
      b.scale.setScalar(2);
      this.add(l, b, x, ceil(x, z) - 0.25, z, 1, r() * 6);
      if (i === 4) this.thing('kelelawar-gua', l, b, 1.6);
    }
    for (let i = 0; i < 5; i++) {
      const b = P.flyingBat();
      b.scale.setScalar(2);
      this.group(l).add(b);
      this.flyBats.push({ o: b, ph: i * 1.3 });
    }
    // tetesan air
    const n = 40;
    const g = new T.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const seeds = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const a = r() * 6.28,
        d = 1 + r() * 9;
      seeds.set([Math.cos(a) * d, Math.sin(a) * d, r(), 0.5 + r()], i * 4);
    }
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    this.drips = new T.Points(g, new T.PointsMaterial({ size: 0.06, map: P.glow(), color: '#cfefff', transparent: true, depthWrite: false }));
    this.drips.userData.seeds = seeds;
    this.drips.userData.ceil = ceil;
    this.drips.frustumCulled = false;
    this.group(l).add(this.drips);
  }

  /* ---------------- lokasi: sungai bawah tanah ---------------- */

  private buildSungai() {
    const l: Loc = 'sungai';
    const r = P.rng(41);
    const len = 70;
    const tun = new T.CylinderGeometry(5, 5, len, 48, 30, true);
    const p = tun.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i),
        x = p.getX(i),
        z = p.getZ(i);
      const k = 1 + Math.sin(y * 0.4 + Math.atan2(z, x) * 3) * 0.08 + Math.sin(y * 1.3 + x) * 0.04;
      p.setXYZ(i, x * k, y, z * k);
    }
    tun.computeVertexNormals();
    const tm = new T.Mesh(tun, new T.MeshStandardMaterial({ color: '#6a6458', roughness: 0.9, side: T.BackSide, map: this.speckle('#ffffff', ['#4a4438', '#8a8070'], 600, [8, 10], 41) }));
    tm.rotation.z = Math.PI / 2;
    this.add(l, tm, 0, 1.2, 0);
    const water = new T.Mesh(
      new T.PlaneGeometry(len, 7, 1, 1),
      new T.ShaderMaterial({
        transparent: true,
        uniforms: { uTime: this.uTime },
        vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
        fragmentShader: `uniform float uTime; varying vec3 vW; ${NOISE}
          void main(){ vec2 q = vW.xz * vec2(0.5, 1.2) + vec2(-uTime * 0.6, 0.0);
            float n = fbm(q) ; float hl = smoothstep(0.62, 0.8, fbm(q * 2.0 + n));
            vec3 c = mix(vec3(0.02,0.14,0.16), vec3(0.08,0.32,0.34), n) + hl * vec3(0.5,0.85,0.9);
            gl_FragColor = vec4(c, 0.92); }`,
      }),
    );
    water.rotation.x = -Math.PI / 2;
    this.add(l, water, 0, 0, 0);
    // tepian berbatu
    for (let i = 0; i < 50; i++) {
      const side = i % 2 ? 1 : -1;
      this.add(l, P.rock(0.3 + r() * 0.6, '#7a7266', r), -30 + r() * 60, 0.05, side * (2.8 + r() * 1.2));
    }
    // salamander gua pucat di atas batu
    for (const [x, z, ry] of [
      [-10, 2.7, 0.6],
      [-4, -2.7, 2.6],
      [3, 2.6, -0.4],
    ]) {
      this.add(l, P.rock(0.6, '#8a8276', r, 0.4), x, 0.1, z);
      const s = P.salamander();
      s.scale.setScalar(2.4);
      this.add(l, s, x, 0.42, z, 1, ry);
      if (x === -4) this.thing('salamander-gua', l, s, 1.4);
    }
    // bintik mineral berkilau di dinding
    const n = 400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = 0.2 + r() * 2.7;
      pos.set([-30 + r() * 60, 1.2 + Math.sin(a) * 4.7, Math.cos(a) * 4.7], i * 3);
    }
    const pg = new T.BufferGeometry();
    pg.setAttribute('position', new T.BufferAttribute(pos, 3));
    this.group(l).add(new T.Points(pg, new T.PointsMaterial({ size: 0.07, map: P.glow(), color: '#bff4ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false })));
  }

  /* ---------------- lokasi: dinding batuan berlapis & fosil ---------------- */

  private buildFosil() {
    const l: Loc = 'fosil';
    const r = P.rng(51);
    const bands = ['#c9a878', '#a8805a', '#d8c098', '#8a6a4a', '#b89870', '#6a5040', '#1c1a18', '#c0a080', '#9a7a58', '#d0b890'];
    const face = this.tex(1024, 512, (g, w, h) => {
      let y = 0;
      let i = 0;
      while (y < h) {
        const bh = 20 + r() * 50;
        g.fillStyle = bands[i % bands.length];
        g.beginPath();
        g.moveTo(0, y);
        for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 6);
        g.lineTo(w, h);
        g.lineTo(0, h);
        g.fill();
        y += bh;
        i++;
      }
      for (let k = 0; k < 3000; k++) {
        g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.15)' : 'rgba(255,255,255,.12)';
        g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 2);
      }
    });
    const wallG = new T.PlaneGeometry(34, 12, 80, 30);
    const p = wallG.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.6) * 0.25 + Math.sin(p.getY(i) * 2.1 + p.getX(i)) * 0.06);
    wallG.computeVertexNormals();
    const wall = new T.Mesh(wallG, new T.MeshStandardMaterial({ map: face, roughness: 0.95 }));
    this.add(l, wall, 0, 5, -2.4);
    const floor = new T.Mesh(new T.PlaneGeometry(40, 20), new T.MeshStandardMaterial({ color: '#8a7058', roughness: 1, map: this.speckle('#ffffff', ['#6a5040', '#a88a6a'], 600, [8, 4], 52) }));
    floor.rotation.x = -Math.PI / 2;
    this.add(l, floor, 0, 0, 6);
    const ceilM = new T.Mesh(new T.PlaneGeometry(40, 20), new T.MeshStandardMaterial({ color: '#4a3a2a', roughness: 1 }));
    ceilM.rotation.x = Math.PI / 2;
    this.add(l, ceilM, 0, 8, 6);
    // fosil-fosil menempel di dinding
    const amm = P.ammonite();
    amm.scale.setScalar(2);
    this.add(l, amm, -6, 2.4, -2.2);
    this.thing('fosil-ammonit', l, amm, 2.2);
    const amm2 = P.ammonite(0xb0906a);
    amm2.scale.setScalar(1.2);
    this.add(l, amm2, 7.5, 3.3, -2.2);
    const tri = P.trilobite();
    tri.rotation.x = Math.PI / 2;
    tri.scale.setScalar(3);
    this.add(l, tri, -1.5, 1.4, -2.1);
    this.thing('trilobit', l, tri, 2.2);
    const leaf = P.leafFossil();
    leaf.scale.setScalar(3);
    this.add(l, leaf, 2.5, 2.6, -2.05, 1);
    leaf.rotation.z = 0.5;
    const bn = P.bone();
    bn.scale.setScalar(2.5);
    this.add(l, bn, 5, 1.1, -2.05);
    bn.rotation.z = 0.3;
    // tumpukan batu bara hitam di dekat lapisan hitam
    const coal = new T.Group();
    for (let i = 0; i < 9; i++) {
      const c = P.rock(0.18 + r() * 0.2, '#1a1a1c', r, 0.8);
      (c.material as T.MeshStandardMaterial).roughness = 0.35;
      (c.material as T.MeshStandardMaterial).metalness = 0.3;
      c.position.set((r() - 0.5) * 0.9, 0.1 + (i > 5 ? 0.2 : 0), (r() - 0.5) * 0.6);
      coal.add(c);
    }
    this.add(l, coal, 9.5, 0, -1.2);
    this.thing('batu-bara', l, coal, 2.4);
    for (let i = 0; i < 16; i++) this.add(l, P.rock(0.2 + r() * 0.4, '#9a8068', r), (r() - 0.5) * 30, 0.05, -1.6 + r() * 1.5);
  }

  /* ---------------- lokasi: gua kristal ---------------- */

  private buildKristal() {
    const l: Loc = 'kristal';
    const r = P.rng(61);
    const ceil = this.caveDome(l, 11, 0.55, '#6a5a78', 61);
    const cols = ['#b58cff', '#ff8fd8', '#9b5cf0', '#6fd8ff', '#c9a2ff'];
    for (let i = 0; i < 60; i++) {
      const a = r() * 6.28,
        d = 3 + r() * 7;
      const x = Math.cos(a) * d,
        z = Math.sin(a) * d;
      const up = r() < 0.6;
      const c = P.cluster(cols[i % cols.length], 3 + Math.floor(r() * 4), r, 0.8 + r() * 1.2);
      if (up) this.add(l, c, x, 0, z);
      else {
        c.rotation.x = Math.PI;
        this.add(l, c, x, ceil(x, z) + 0.1, z);
      }
    }
    // kuarsa besar
    const q = P.cluster('#eef6ff', 7, r, 2.2);
    this.add(l, q, -1.8, 0, -3);
    this.thing('kristal-kuarsa', l, q, 3);
    // geoda terbelah di atas batu
    this.add(l, P.rock(0.8, '#5a4e62', r, 0.6), 2.2, 0.2, -1.4);
    const gd = P.geode(r);
    gd.rotation.x = -0.9;
    this.add(l, gd, 2.2, 0.85, -1.2, 1.2);
    this.thing('geoda', l, gd, 1.8);
    // pirit (emas palsu)
    this.add(l, P.pyrite(r), 0.8, 0, -0.2, 1.8);
    // obsidian: kaca vulkanik hitam mengilap
    const obs = P.rock(0.55, '#0c0c10', r, 0.9);
    const om = obs.material as T.MeshStandardMaterial;
    om.roughness = 0.05;
    om.metalness = 0.4;
    om.envMapIntensity = 2;
    this.add(l, obs, -3.4, 0.35, -0.4);
    this.thing('obsidian', l, obs, 2);
    for (let i = 0; i < 14; i++) this.add(l, P.rock(0.2 + r() * 0.5, '#4a3e52', r), (r() - 0.5) * 16, 0.05, (r() - 0.5) * 16);
    // kilau melayang
    const n = 160;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pos.set([(r() - 0.5) * 14, r() * 5, (r() - 0.5) * 14], i * 3);
    const pg = new T.BufferGeometry();
    pg.setAttribute('position', new T.BufferAttribute(pos, 3));
    const sp = new T.Points(pg, new T.PointsMaterial({ size: 0.08, map: P.glow(), color: '#e8d8ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    sp.userData.update = (t: number) => ((sp.material as T.PointsMaterial).opacity = 0.5 + Math.sin(t * 2) * 0.35);
    this.add(l, sp);
  }

  /* ---------------- lokasi: terowongan bor (kerak → mantel) ---------------- */

  private buildTunnel() {
    const l: Loc = 'tunnel';
    this.tunnelMat = new T.ShaderMaterial({
      side: T.BackSide,
      uniforms: {
        uTime: this.uTime,
        uScroll: { value: 0 },
        uMix: { value: 0 },
        uBand: { value: 999 },
        uGlow: { value: 0 },
        uA: { value: new T.Color('#8a6a4a') },
        uB: { value: new T.Color('#5a4a3a') },
        uA2: { value: new T.Color('#5a2a10') },
        uB2: { value: new T.Color('#ff6a1a') },
      },
      vertexShader: 'varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime, uScroll, uMix, uBand, uGlow; uniform vec3 uA, uB, uA2, uB2; varying vec2 vUv; varying vec3 vP; ${NOISE}
        void main(){
          vec2 q = vec2(vUv.x * 14.0, vP.y * 0.35 + uScroll);
          float s = fbm(vec2(q.x * 0.15, q.y * 2.5 + fbm(q) * 1.5));
          vec3 crust = mix(uB, uA, smoothstep(0.3, 0.7, s)) * (0.75 + 0.5 * vn(q * 6.0));
          vec2 fq = q * 0.5 + vec2(0.0, uTime * 0.04);
          float f = fbm(fq + fbm(fq + uTime * 0.02) * 2.0);
          vec3 mantle = mix(uA2, uB2, smoothstep(0.25, 0.85, f)) + uB2 * pow(f, 3.0) * uGlow;
          vec3 c = mix(crust, mantle, uMix);
          float lit = 0.35 + 0.65 * exp(-abs(vP.y) * 0.07);
          c *= mix(lit, 1.0, uMix * 0.6);
          c += vec3(1.0, 0.75, 0.35) * exp(-pow((vP.y - uBand) * 1.3, 2.0)) * 1.4;
          gl_FragColor = vec4(c, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const tube = new T.Mesh(new T.CylinderGeometry(5, 5, 90, 64, 40, true), this.tunnelMat);
    this.add(l, tube);
    // serpihan batu/bara yang melintas ke atas (kesan menembus ke bawah)
    const n = 360;
    const r = P.rng(71);
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = r() * 6.28,
        d = 1.6 + r() * 3.1;
      pos.set([Math.cos(a) * d, (r() - 0.5) * 60, Math.sin(a) * d], i * 3);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    this.debris = new T.Points(g, new T.PointsMaterial({ size: 0.09, map: P.glow(), color: '#d8c0a0', transparent: true, depthWrite: false }));
    this.debris.frustumCulled = false;
    this.add(l, this.debris);
    // gelombang gempa yang merambat (mantel bawah)
    for (let i = 0; i < 3; i++) {
      const w = new T.Mesh(new T.TorusGeometry(4.6, 0.12, 8, 64), new T.MeshBasicMaterial({ color: '#bfe4ff', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
      w.rotation.x = Math.PI / 2;
      this.waves.push(w);
      this.add(l, w);
    }
  }

  /* ---------------- lokasi: inti luar (besi cair) & inti dalam ---------------- */

  private liquidSphere(l: Loc, radius: number, a: string, b: string) {
    const m = new T.ShaderMaterial({
      side: T.BackSide,
      fog: false,
      uniforms: { uTime: this.uTime, uA: { value: new T.Color(a) }, uB: { value: new T.Color(b) } },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime; uniform vec3 uA, uB; varying vec3 vN; ${NOISE}
        void main(){ float ang = atan(vN.z, vN.x); vec2 q = vec2(ang * 3.0 + vN.y * 4.0 + uTime * 0.12, vN.y * 6.0 - uTime * 0.05);
          float f = fbm(q + fbm(q * 1.5 - uTime * 0.08) * 2.5);
          vec3 c = mix(uA, uB, smoothstep(0.3, 0.8, f)) + uB * pow(f, 4.0) * 1.2;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    this.add(l, new T.Mesh(new T.SphereGeometry(radius, 48, 32), m));
  }

  /** Aliran pusaran berbentuk spiral (arus konveksi di inti luar). */
  private swirl(l: Loc, n: number, color: string, spread: number) {
    const r = P.rng(81);
    const g = new T.BufferGeometry();
    const seed = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) seed.set([2 + r() * spread, (r() - 0.5) * 24, r() * 6.28, 0.2 + r() * 0.5], i * 4);
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('seed', new T.BufferAttribute(seed, 4));
    const m = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: { uTime: this.uTime, uCol: { value: new T.Color(color) }, uTex: { value: P.glow() } },
      vertexShader: `attribute vec4 seed; uniform float uTime; varying float vA;
        void main(){ float a = seed.z + uTime * seed.w; float y = mod(seed.y + uTime * seed.w * 1.5 + 12.0, 24.0) - 12.0;
          float rr = seed.x * (1.0 + 0.15 * sin(y * 0.5 + seed.z));
          vec3 p = vec3(cos(a) * rr, y, sin(a) * rr);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); vA = smoothstep(12.0, 8.0, abs(y));
          gl_PointSize = 90.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: 'uniform vec3 uCol; uniform sampler2D uTex; varying float vA; void main(){ gl_FragColor = vec4(uCol, texture2D(uTex, gl_PointCoord).a * vA * 0.8); }',
    });
    const pts = new T.Points(g, m);
    pts.frustumCulled = false;
    this.add(l, pts);
  }

  private buildCore() {
    // inti luar: lautan besi-nikel cair berpusar
    this.liquidSphere('luar', 34, '#7a2a02', '#ffb02a');
    this.swirl('luar', 1400, '#ffd070', 14);
    const iron = new T.Group();
    const metal = new T.MeshStandardMaterial({ color: '#ffb050', emissive: '#ff7a10', emissiveIntensity: 0.9, metalness: 0.9, roughness: 0.2 });
    const blobs: T.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const b = new T.Mesh(new T.SphereGeometry(0.25 + (i % 3) * 0.1, 24, 16), metal);
      iron.add(b);
      blobs.push(b);
    }
    iron.add(P.glowSprite('#ffb030', 1.4, 0.5));
    iron.userData.update = (t: number) =>
      blobs.forEach((b, i) => {
        const a = t * (0.6 + i * 0.1) + i;
        b.position.set(Math.cos(a) * 0.45, Math.sin(t * 0.9 + i * 2) * 0.35, Math.sin(a * 1.3) * 0.4);
        b.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.15);
      });
    this.add('luar', iron, 2.5, 0.4, -1.5);
    this.thing('besi-cair', 'luar', iron, 2.6);

    // inti dalam: bola besi-nikel padat berpijar di tengah lautan cair
    this.liquidSphere('dalam', 40, '#a04a06', '#ffd060');
    this.swirl('dalam', 700, '#fff0a0', 18);
    const core = new T.Mesh(
      new T.IcosahedronGeometry(8, 6),
      new T.ShaderMaterial({
        uniforms: { uTime: this.uTime },
        vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: `uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV; ${NOISE}
          void main(){ vec2 q = vec2(atan(vP.z, vP.x) * 4.0, vP.y * 0.9);
            // pola kristal besi: sel-sel terang dengan retakan lebih gelap
            float f = fbm(q * 1.6 + uTime * 0.02); float cr = smoothstep(0.02, 0.0, abs(fbm(q * 3.0) - 0.5) - 0.01);
            vec3 c = mix(vec3(1.0,0.62,0.12), vec3(1.0,0.95,0.7), smoothstep(0.35, 0.75, f));
            c *= 1.0 - cr * 0.08;
            float rim = pow(1.0 - max(dot(vN, vV), 0.0), 2.0);
            c += vec3(1.0,0.85,0.5) * rim * 0.6;
            gl_FragColor = vec4(c, 1.0); }`,
      }),
    );
    core.rotation.x = Math.PI / 2;
    core.userData.update = (t: number) => (core.rotation.z = t * 0.03);
    this.add('dalam', core, 0, -11, 0);
    this.add('dalam', P.glowSprite('#fff4c0', 30, 0.8), 0, -11, 0);
  }

  /* ---------------- lokasi: gunung api (lava & magma) ---------------- */

  private buildGunung() {
    const l: Loc = 'gunung';
    const r = P.rng(91);
    const sky = new T.Mesh(
      new T.SphereGeometry(400, 32, 16),
      new T.ShaderMaterial({
        side: T.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vD; void main(){ float h = vD.y; vec3 c = mix(vec3(1.0,0.62,0.4), vec3(0.35,0.4,0.7), smoothstep(0.0, 0.6, h)); gl_FragColor = vec4(c,1.0); }',
      }),
    );
    this.add(l, sky);
    // lempeng tanah terpotong: sisi depan memperlihatkan dapur magma & saluran ke kawah
    const strata = this.tex(512, 256, (g, w, h) => {
      const cs = ['#6a5a48', '#7a6450', '#5a4a3a', '#4a3a2e', '#3a2c22'];
      for (let i = 0; i < 5; i++) {
        g.fillStyle = cs[i];
        g.fillRect(0, (i * h) / 5, w, h / 5 + 1);
      }
      for (let i = 0; i < 900; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.08)';
        g.fillRect(r() * w, r() * h, 2, 2);
      }
    });
    const slab = new T.Mesh(new T.BoxGeometry(40, 8, 30), [
      new T.MeshStandardMaterial({ map: strata }),
      new T.MeshStandardMaterial({ map: strata }),
      new T.MeshStandardMaterial({ color: '#6a7a40', roughness: 1 }),
      new T.MeshStandardMaterial({ color: '#3a2c22' }),
      new T.MeshStandardMaterial({ map: strata, roughness: 1 }),
      new T.MeshStandardMaterial({ map: strata }),
    ]);
    this.add(l, slab, 0, -4, -15);
    const cone = new T.Mesh(new T.CylinderGeometry(1.2, 9, 7, 48, 8, true), new T.MeshStandardMaterial({ color: '#5a4a40', roughness: 1, flatShading: true, side: T.DoubleSide }));
    const cp = cone.geometry.attributes.position;
    for (let i = 0; i < cp.count; i++) cp.setX(i, cp.getX(i) * (1 + (r() - 0.5) * 0.06));
    cone.geometry.computeVertexNormals();
    this.add(l, cone, 0, 3.5, -10);
    const hot = new T.MeshStandardMaterial({ color: '#ff5a10', emissive: '#ff4a00', emissiveIntensity: 1.6, roughness: 0.6 });
    const crater = new T.Mesh(new T.CircleGeometry(1.15, 24), hot);
    crater.rotation.x = -Math.PI / 2;
    this.add(l, crater, 0, 6.9, -10);
    this.add(l, P.glowSprite('#ff7a2a', 5, 0.8), 0, 7.4, -10);
    // aliran lava di lereng depan
    const lavaMat = new T.ShaderMaterial({
      uniforms: { uTime: this.uTime },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime; varying vec2 vUv; ${NOISE}
        void main(){ float f = fbm(vec2(vUv.x * 4.0, vUv.y * 10.0 + uTime * 0.6)); float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
          vec3 c = mix(vec3(0.25,0.05,0.02), vec3(1.0,0.45,0.05), f * edge) + vec3(1.0,0.8,0.3) * pow(f, 4.0) * edge;
          gl_FragColor = vec4(c, 1.0); }`,
    });
    const lavaPts = [V(0.3, 6.9, -8.9), V(0.8, 5, -6.9), V(1.6, 3, -4.8), V(2.2, 1, -2.8), V(3.2, 0.05, -0.5)];
    const curve = new T.CatmullRomCurve3(lavaPts);
    const lava = new T.Mesh(new T.TubeGeometry(curve, 40, 0.35, 8), lavaMat);
    lava.scale.set(1, 0.4, 1);
    lava.position.y = 0.1;
    this.add(l, lava, 0, 0, 0);
    lava.scale.set(1, 1, 1);
    const pool = new T.Mesh(new T.CircleGeometry(1.4, 24), lavaMat);
    pool.rotation.x = -Math.PI / 2;
    this.add(l, pool, 3.3, 0.06, -0.2);
    this.thing('lava', l, pool, 3.2);
    // dapur magma di bawah tanah (terlihat di penampang depan)
    const mag = new T.Mesh(new T.SphereGeometry(3, 32, 20), lavaMat);
    mag.scale.set(1.6, 0.8, 1);
    this.add(l, mag, 0, -5, -2);
    const conduit = new T.Mesh(new T.CylinderGeometry(0.5, 0.7, 4.4, 16), lavaMat);
    this.add(l, conduit, 0, -2.3, -0.3);
    this.thing('magma', l, mag, 5.5);
    for (let i = 0; i < 20; i++) {
      const a = r() * 6.28,
        d = 12 + r() * 30;
      this.add(l, this.tree(r), Math.cos(a) * d, 0, -15 + Math.sin(a) * d * 0.4 - 5, 0.8 + r() * 0.6);
    }
  }

  /* ---------------- lokasi: luar angkasa (Bumi terbelah & medan magnet) ---------------- */

  private buildSpace() {
    const l: Loc = 'space';
    const r = P.rng(101);
    const n = 3000;
    const sp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = V(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(700 + r() * 200);
      sp.set([v.x, v.y, v.z], i * 3);
    }
    const sg = new T.BufferGeometry();
    sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    this.add(l, new T.Points(sg, new T.PointsMaterial({ size: 1.6, color: '#ffffff', sizeAttenuation: false, fog: false })));
    const sunS = P.glowSprite('#fff2c0', 120);
    this.add(l, sunS, 600, 60, 80);
    const R = 12;
    // permukaan Bumi (seperempat dibuang agar lapisan dalam terlihat)
    const surf = this.tex(1024, 512, (g, w, h) => {
      const q = g.createLinearGradient(0, 0, 0, h);
      q.addColorStop(0, '#e8f4ff');
      q.addColorStop(0.1, '#2a6ac8');
      q.addColorStop(0.5, '#1a5ab8');
      q.addColorStop(0.9, '#2a6ac8');
      q.addColorStop(1, '#f0f8ff');
      g.fillStyle = q;
      g.fillRect(0, 0, w, h);
      for (let c = 0; c < 7; c++) {
        const cx = r() * w,
          cy = h * (0.25 + r() * 0.5);
        for (let i = 0; i < 40; i++) {
          g.fillStyle = r() < 0.7 ? '#4a8a3a' : '#b89a5a';
          g.beginPath();
          g.arc(cx + (r() - 0.5) * 160, cy + (r() - 0.5) * 90, 10 + r() * 26, 0, 6.3);
          g.fill();
        }
      }
      g.fillStyle = 'rgba(255,255,255,.35)';
      for (let i = 0; i < 90; i++) {
        g.beginPath();
        g.ellipse(r() * w, r() * h, 20 + r() * 50, 5 + r() * 8, 0, 0, 6.3);
        g.fill();
      }
    });
    const earth = new T.Group();
    earth.add(new T.Mesh(new T.SphereGeometry(R, 64, 40, 0, Math.PI * 1.5), new T.MeshStandardMaterial({ map: surf, roughness: 0.7, side: T.DoubleSide })));
    // dua bidang potong berisi cincin lapisan
    for (const k of [0, 1]) {
      const mat = new T.MeshBasicMaterial({ map: this.layerTex(-1), side: T.DoubleSide });
      this.cutFaces.push(mat);
      const f = new T.Mesh(new T.CircleGeometry(R, 96, k === 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI), mat);
      if (k === 1) f.rotation.y = Math.PI / 2;
      earth.add(f);
    }
    // lapisan udara: bola sisi-belakang bercahaya di tepi (tidak menutupi penampang)
    const atmo = new T.Mesh(
      new T.SphereGeometry(R * 1.12, 48, 32),
      new T.ShaderMaterial({
        side: T.BackSide,
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float k = pow(max(0.0, -dot(vN, vV)), 3.0); gl_FragColor = vec4(0.35, 0.65, 1.0, k * 0.9); }',
      }),
    );
    earth.add(atmo);
    earth.userData.update = (t: number) => {
      earth.children[0].rotation.y = 0;
      void t;
    };
    this.add(l, earth);
    this.thing('bumi', l, earth, 30);

    // garis medan magnet (dipol, sedikit miring), berdenyut mengalir
    const field = new T.Group();
    const fm = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: { uTime: this.uTime, uO: { value: 0.5 } },
      vertexShader: 'attribute float along; varying float vA; void main(){ vA = along; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform float uTime; uniform float uO; varying float vA; void main(){ float p = pow(fract(vA * 3.0 - uTime * 0.25), 6.0); gl_FragColor = vec4(0.45, 0.85, 1.0, (0.22 + p * 0.8) * uO); }',
    });
    for (const L of [16, 20, 26, 34, 46]) {
      for (let k = 0; k < 10; k++) {
        const phi = (k / 10) * Math.PI * 2;
        const th0 = Math.asin(Math.sqrt(R / L));
        const pts: number[] = [];
        const along: number[] = [];
        for (let s = 0; s <= 80; s++) {
          const th = th0 + (Math.PI - 2 * th0) * (s / 80);
          const rr = L * Math.sin(th) ** 2;
          pts.push(rr * Math.sin(th) * Math.cos(phi), rr * Math.cos(th), rr * Math.sin(th) * Math.sin(phi));
          along.push(s / 80);
        }
        const g = new T.BufferGeometry();
        g.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
        g.setAttribute('along', new T.Float32BufferAttribute(along, 1));
        field.add(new T.Line(g, fm));
      }
    }
    field.rotation.z = 0.19;
    field.userData.mat = fm;
    this.add(l, field);
    this.groups.get(l)!.userData.field = field;
    // aurora di sekitar kutub
    for (const s of [1, -1]) {
      const a = new T.Mesh(new T.TorusGeometry(R * Math.sin(0.35), 0.5, 8, 48), new T.MeshBasicMaterial({ color: '#5aff9a', transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false }));
      a.quaternion.setFromUnitVectors(V(0, 0, 1), V(-Math.sin(0.19), Math.cos(0.19), 0));
      this.aurora.push(a);
      // kutub magnet ikut miring ±11°
      this.add(l, a, -Math.sin(0.19) * s * R * Math.cos(0.35), s * R * Math.cos(0.35) * Math.cos(0.19), 0);
    }
    // angin matahari yang dibelokkan medan magnet
    const wn = 700;
    this.windSeed = new Float32Array(wn * 4);
    for (let i = 0; i < wn; i++) {
      const a = r() * 6.28,
        d = Math.sqrt(r()) * 38;
      this.windSeed.set([Math.cos(a) * d, Math.sin(a) * d, r() * 240, 0.6 + r() * 0.6], i * 4);
    }
    const wg = new T.BufferGeometry();
    wg.setAttribute('position', new T.BufferAttribute(new Float32Array(wn * 3), 3));
    this.wind = new T.Points(wg, new T.PointsMaterial({ size: 2.4, map: P.glow(), color: '#ffcf6a', transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.8 }));
    this.wind.frustumCulled = false;
    this.add(l, this.wind);
  }

  /** Tekstur penampang Bumi: cincin lapisan (ukuran mendekati nyata, kerak dipertebal agar terlihat). */
  private layerTex(hi: number) {
    const radii = [1, 0.955, 0.86, 0.545, 0.19];
    return P.canvasTex(1024, 1024, (g, w) => {
      const c = w / 2;
      LAPISAN.forEach((ly, i) => {
        const on = hi === i;
        const q = g.createRadialGradient(c, c, radii[i + 1] ? radii[i + 1] * c : 0, c, c, radii[i] * c);
        const base = new T.Color(ly.color);
        const dim = hi >= 0 && !on ? 0.45 : 1;
        const lite = base.clone().lerp(new T.Color('#ffffff'), on ? 0.45 : 0.15).multiplyScalar(dim);
        q.addColorStop(0, '#' + lite.getHexString());
        q.addColorStop(1, '#' + base.clone().multiplyScalar((on ? 1.1 : 0.85) * dim).getHexString());
        g.fillStyle = q;
        g.beginPath();
        g.arc(c, c, radii[i] * c, 0, 6.3);
        g.fill();
        if (on) {
          g.strokeStyle = '#ffffff';
          g.lineWidth = 10;
          g.stroke();
        }
      });
    });
  }

  /* ---------------- API ---------------- */

  setMode(m: BumiMode) {
    useBumi.setState({ mode: m, focus: null });
    if (m === 'tur') {
      unlockAudioContext();
      this.controls.enabled = false;
      this.loadAudio();
      this.go(0);
      this.setPlaying(true);
    } else {
      this.player.stop();
      this.playing = false;
      this.controls.enabled = true;
      useBumi.setState({ playing: false, finished: false });
      this.travel('gua', () => this.home(true));
    }
  }

  private loadAudio() {
    const p = TUR_BUMI_AUDIO[0];
    if (!p || this.buf) return;
    useBumi.setState({ loading: true });
    void loadBuffer(p.src).then((b) => {
      this.buf = b;
      useBumi.setState({ loading: false });
      if (this.pending) this.startSegment();
    });
  }

  private range(i: number) {
    const p = partFor(i)!;
    const k = i - p.first;
    return { from: Math.max(0, p.cues[k] - 0.03), to: (p.cues[k + 1] ?? this.buf?.duration ?? p.cues[k] + 20) - 0.1 };
  }

  private startSegment() {
    if (!this.buf || !this.part) return;
    this.pending = false;
    const rg = this.range(this.idx);
    this.player.play(this.buf, rg.from, rg.to, () => (this.done = true));
    if (!this.playing) this.player.pause();
  }

  /** Jelajah: posisi awal di lokasi saat ini. */
  private home(snap = false) {
    const h = HOME[this.loc];
    const c = C(this.loc);
    const p = h.p.clone().add(c),
      t = h.t.clone().add(c);
    if (snap) {
      this.camera.position.copy(p);
      this.controls.target.copy(t);
      this.flyK = 1;
    } else this.flyTo(p, t);
    this.agam.root.visible = false;
    this.raftM.visible = false;
    this.parkPod();
  }

  private parkPod() {
    this.pod.position.copy(C('tunnel'));
    this.pod.rotation.set(0, 0.5, 0);
    this.pod.scale.setScalar(0.62);
    this.pod.visible = true;
  }

  private flyTo(pos: T.Vector3, target: T.Vector3) {
    this.flyFrom.p.copy(this.camera.position);
    this.flyFrom.t.copy(this.controls.target);
    this.flyK = 0;
    this.flyGoal = { p: pos.clone(), t: target.clone() };
  }

  /** Pindah lokasi: layar meredup → ganti panggung & suasana → terang kembali. */
  private travel(l: Loc, then?: () => void) {
    if (l === this.loc && this.fadeDir === 0) {
      then?.();
      return;
    }
    this.fadeDir = 1;
    this.onDark = () => {
      this.enter(l);
      then?.();
    };
  }

  private enter(l: Loc) {
    this.loc = l;
    for (const [k, g] of this.groups) g.visible = k === l;
    const e = ENV[l];
    this.scene.background = new T.Color(e.bg);
    this.fog.color.set(e.fog);
    this.fog.density = e.density;
    this.hemi.color.set(e.hemi[0]);
    this.hemi.groundColor.set(e.hemi[1]);
    this.hemi.intensity = e.hemi[2];
    this.sun.intensity = e.sun;
    const c = C(l);
    this.sun.position.copy(c).add(l === 'space' ? V(600, 60, 80) : V(20, 30, 10));
    this.sun.target.position.copy(c);
    this.camera.far = e.far;
    this.camera.updateProjectionMatrix();
    this.renderer.toneMappingExposure = e.exposure;
    this.pool.forEach((pl, i) => {
      const d = e.lights[i];
      pl.intensity = d ? d.i : 0;
      if (d) {
        pl.position.copy(c).add(d.p);
        pl.color.set(d.c);
        pl.distance = d.d;
      }
    });
    this.agam.setLamp(l === 'surf' || l === 'gunung' || l === 'space' ? 0 : 1);
    this.pod.visible = l === 'tunnel' || l === 'luar' || l === 'dalam';
    this.controls.maxDistance = l === 'space' ? 90 : l === 'gunung' ? 40 : 14;
    this.snap = true;
    if (useBumi.getState().mode === 'jelajah') useBumi.setState({ depth: LOC_DEPTH[l] });
  }

  focus(id: string | null) {
    useBumi.setState({ focus: id });
    if (!id) {
      this.flyTo(HOME[this.loc].p.clone().add(C(this.loc)), HOME[this.loc].t.clone().add(C(this.loc)));
      return;
    }
    const th = this.things.get(id);
    if (!th) return;
    const aim = () => {
      const p = th.obj.getWorldPosition(V(0, 0, 0));
      const view = HOME[th.loc].p.clone().add(C(th.loc));
      const dir = view.sub(p);
      dir.y = 0;
      dir.normalize();
      const cam = p.clone().add(dir.multiplyScalar(th.dist)).add(V(0, th.dist * 0.3, 0));
      return { cam, p };
    };
    if (th.loc !== this.loc) {
      this.travel(th.loc, () => {
        const a = aim();
        this.camera.position.copy(a.cam);
        this.controls.target.copy(a.p);
        this.flyK = 1;
      });
    } else {
      const a = aim();
      this.flyTo(a.cam, a.p);
    }
  }

  go(i: number) {
    const prevLoc = this.loc;
    this.idx = Math.max(0, Math.min(TUR_BUMI.length - 1, i));
    this.t = 0;
    this.done = false;
    this.player.stop();
    const l = locOf(this.idx);
    if (i === 0) {
      this.enter(l);
      this.fade = 1;
      this.fadeDir = -1;
    } else if (l !== prevLoc) this.travel(l);
    this.part = partFor(this.idx);
    if (this.part) {
      if (this.buf) this.startSegment();
      else this.pending = true;
    }
    useBumi.setState({ stop: this.idx, progress: 0, finished: false });
  }

  setPlaying(on: boolean) {
    this.playing = on;
    if (!on) this.player.pause();
    else if (this.part && !this.pending && !this.done) this.player.resume();
    useBumi.setState({ playing: on });
  }

  /** Untuk pratinjau pengembangan: lompat ke lokasi tertentu. */
  jump(l: Loc) {
    this.travel(l, () => this.home(true));
  }

  /* ---------------- loop ---------------- */

  private resize() {
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.fov = w < h ? 68 : 55;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (document.hidden) return;
    this.uTime.value += dt;
    const t = this.uTime.value;
    const mode = useBumi.getState().mode;

    // peredup antar-lokasi
    if (this.fadeDir > 0) {
      this.fade = Math.min(1, this.fade + dt / 0.35);
      if (this.fade >= 1) {
        const cb = this.onDark;
        this.onDark = null;
        cb?.();
        this.fadeDir = -1;
      }
    } else if (this.fadeDir < 0) {
      this.fade = Math.max(0, this.fade - dt / 0.6);
      if (this.fade <= 0) this.fadeDir = 0;
    }
    this.fadeEl.style.opacity = String(this.fade);

    for (const o of this.animated) o.userData.update?.(t, o.id * 0.37);
    this.animateLoc(t, dt, mode === 'tur');

    if (mode === 'tur') this.stepTour(dt);
    else this.stepJelajah(dt);

    this.renderer.render(this.scene, this.camera);
  };

  /** Animasi lingkungan lokasi aktif. */
  private animateLoc(t: number, dt: number, tour: boolean) {
    const l = this.loc;
    if (l === 'tanah')
      for (const a of this.ants) {
        const k = (a.ph + t * a.sp) % 1;
        const p = a.path.getPointAt(k);
        const tan = a.path.getTangentAt(k);
        a.o.position.copy(p).sub(C('tanah'));
        a.o.rotation.set(0, 0, Math.atan2(tan.y, tan.x));
      }
    if (l === 'gua') {
      for (const b of this.flyBats) {
        const a = t * 0.5 + b.ph;
        b.o.position.set(Math.cos(a) * (6 + Math.sin(b.ph) * 2), 3.5 + Math.sin(a * 2) * 0.6, Math.sin(a) * 5);
        b.o.rotation.y = -a;
        b.o.userData.flap?.(t + b.ph);
      }
      const pp = this.drips.geometry.attributes.position as T.BufferAttribute;
      const sd = this.drips.userData.seeds as Float32Array;
      const ceil = this.drips.userData.ceil as (x: number, z: number) => number;
      for (let i = 0; i < pp.count; i++) {
        const x = sd[i * 4],
          z = sd[i * 4 + 1];
        const top = ceil(x, z) - 0.8;
        const k = (sd[i * 4 + 2] + t * 0.18 * sd[i * 4 + 3]) % 1;
        pp.setXYZ(i, x, top - top * k * k, z);
      }
      pp.needsUpdate = true;
      if (t > this.nextDrip) {
        this.nextDrip = t + 1.5 + Math.random() * 2.5;
        if (tour || useBumi.getState().mode === 'jelajah') sfx.drip();
      }
    }
    if (l === 'space') {
      const pp = this.wind.geometry.attributes.position as T.BufferAttribute;
      const s = this.windSeed;
      for (let i = 0; i < pp.count; i++) {
        const y0 = s[i * 4],
          z0 = s[i * 4 + 1];
        const x = 120 - ((s[i * 4 + 2] + t * 18 * s[i * 4 + 3]) % 240);
        const b = x < 22 ? Math.sqrt(40 * (22 - x)) : 0;
        const d = Math.hypot(y0, z0) || 0.01;
        const e = Math.sqrt(d * d + b * b);
        pp.setXYZ(i, x, (y0 / d) * e, (z0 / d) * e);
      }
      pp.needsUpdate = true;
      for (const a of this.aurora) (a.material as T.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 1.7 + a.position.y) * 0.25;
    }
    void dt;
  }

  private stepJelajah(dt: number) {
    if (this.flyK < 1) {
      this.flyK = Math.min(1, this.flyK + dt / 1.8);
      const k = smooth(this.flyK);
      this.camera.position.lerpVectors(this.flyFrom.p, this.flyGoal.p, k);
      this.controls.target.lerpVectors(this.flyFrom.t, this.flyGoal.t, k);
    }
    // kapsul di terowongan tetap mengebor pelan
    if (this.loc === 'tunnel') {
      this.tunnelLook('kerak', 0.3, dt);
      this.pod.userData.update?.(this.uTime.value, 1);
    }
    if (this.loc === 'luar' || this.loc === 'dalam') {
      this.pod.position.copy(C(this.loc)).add(V(0, Math.sin(this.uTime.value * 0.8) * 0.2, 0));
      this.pod.userData.update?.(this.uTime.value, 0.2);
    }
    this.controls.update();
  }

  /** Warna & gerak dinding terowongan sesuai lapisan. */
  private tunnelLook(set: BumiSet, p: number, dt: number) {
    const u = this.tunnelMat.uniforms;
    const col = (k: string, c: string) => (u[k].value as T.Color).set(c);
    let speed = 3,
      mix = 0,
      glow = 0,
      band = 999,
      debris = '#d8c0a0';
    if (set === 'kerak') {
      col('uA', '#9a7a58');
      col('uB', '#5a4a3a');
    } else if (set === 'moho') {
      // kerak (cokelat) berganti batuan mantel (peridotit kehijauan yang panas)
      col('uA2', '#4a4a20');
      col('uB2', '#e8702a');
      mix = smooth((p - 0.35) / 0.3);
      band = -18 + p * 36;
      glow = 0.3;
      speed = 2.5;
    } else if (set === 'mantel-atas') {
      col('uA2', '#5a1a08');
      col('uB2', '#ff6a1a');
      mix = 1;
      glow = 0.8;
      speed = 1.4;
      debris = '#ffb070';
    } else {
      col('uA2', '#3a0a04');
      col('uB2', '#c83a14');
      mix = 1;
      glow = 0.5;
      speed = 1.8;
      debris = '#ff8a50';
    }
    u.uMix.value = mix;
    u.uGlow.value = glow;
    u.uBand.value = band;
    u.uScroll.value -= dt * speed * 0.35;
    (this.debris.material as T.PointsMaterial).color.set(debris);
    const pp = this.debris.geometry.attributes.position as T.BufferAttribute;
    for (let i = 0; i < pp.count; i++) {
      let y = pp.getY(i) + dt * speed * 3;
      if (y > 30) y -= 60;
      pp.setY(i, y);
    }
    pp.needsUpdate = true;
    // gelombang gempa melintas (mantel bawah)
    this.waves.forEach((w, i) => {
      const on = set === 'mantel-bawah';
      const k = ((this.uTime.value * 0.35 + i / 3) % 1) * 2 - 1;
      w.position.y = k * 20;
      (w.material as T.MeshBasicMaterial).opacity = on ? 0.7 * (1 - Math.abs(k)) : 0;
    });
  }

  /** Mode tur: timeline adegan, posisi Agam/kapsul, kamera sinematik. */
  private stepTour(dt: number) {
    const s = TUR_BUMI[this.idx];
    const rg = this.part ? this.range(this.idx) : null;
    const dur = rg ? Math.max(1, rg.to - rg.from) : this.durs[this.idx];
    if (this.playing && this.fadeDir <= 0) {
      if (this.part) this.t = this.done ? dur : this.pending ? 0 : this.player.playing ? this.player.position() - rg!.from : this.t;
      else this.t += dt;
      if (this.t >= dur) {
        if (this.idx < TUR_BUMI.length - 1) this.go(this.idx + 1);
        else {
          this.setPlaying(false);
          useBumi.setState({ finished: true, progress: 1 });
        }
        return;
      }
    }
    const p = clamp01(this.t / dur);
    const now = performance.now();
    if (now - this.lastUi > 200) {
      this.lastUi = now;
      const d = this.loc === 'space' ? -1 : Math.round(s.depth[0] + (s.depth[1] - s.depth[0]) * smooth(p));
      useBumi.setState({ progress: p, depth: d });
    }
    const t = this.uTime.value;
    const c = C(this.loc);
    const a = this.agam;
    let walk = 0;
    let camP = V(0, 2, 6),
      look = V(0, 1, 0);
    a.root.visible = false;
    this.raftM.visible = false;

    const place = (x: number, y: number, z: number, ry: number) => {
      a.root.visible = true;
      a.root.position.set(c.x + x, c.y + y, c.z + z);
      a.root.rotation.set(0, ry, 0);
    };

    switch (s.id) {
      case 'persiapan': {
        place(0, 0, 2, 0.25);
        const o = 0.5 - p * 0.9;
        camP = V(Math.sin(o) * 3.6 + 0.4, 1.3, 2 + Math.cos(o) * 3.6);
        look = V(0.4, 0.9, 1.6);
        a.armR.rotation.z = 0;
        break;
      }
      case 'mulut-gua': {
        const k = smooth(p / 0.85);
        const z = 2 - k * 8;
        walk = p < 0.85 ? 1 : 0;
        place(0, 0, z, Math.PI);
        a.setLamp(smooth((p - 0.3) / 0.15));
        camP = V(0.9, 1.5, z + 3.4);
        look = V(0, 1.1, z - 3);
        break;
      }
      case 'lapisan-tanah': {
        place(-1.8, -3, 1.2, -0.5);
        const k = smooth(p);
        camP = V(0.6 - k * 1.2, 3.2 - k * 3.4, 6 - k * 0.5);
        look = V(0.2 - k * 0.6, 2.6 - k * 3, -0.6);
        break;
      }
      case 'gua-kapur': {
        const k = smooth(p / 0.7);
        walk = p < 0.7 ? 1 : 0;
        const x = -6 + k * 5,
          z = 5 - k * 5;
        place(x, 0, z, Math.atan2(1, -1) + (p > 0.7 ? Math.sin(t * 0.5) * 0.5 : 0));
        // akhir adegan: menatap kelelawar yang bergelantungan
        const bat = smooth((p - 0.72) / 0.2);
        camP = V(x + 3.2 - bat * 1.5, 1.7 + bat * 1.5, z + 3.2 - bat * 2);
        look = V(x - 1, 1.6 + bat * 3, z - 2.5);
        break;
      }
      case 'sungai-bawah-tanah': {
        const x = -22 + smooth(p) * 26;
        this.raftM.visible = true;
        this.raftM.position.set(c.x + x, c.y + 0.12 + Math.sin(t * 1.4) * 0.05, c.z);
        this.raftM.rotation.set(Math.sin(t * 1.1) * 0.03, -Math.PI / 2, Math.sin(t * 0.9) * 0.04);
        (this.raftM.userData.paddle as T.Object3D).rotation.x = Math.sin(t * 2) * 0.5;
        place(x, 0.02, 0, Math.PI / 2);
        a.legL.rotation.x = a.legR.rotation.x = -1.2;
        a.root.position.y -= 0.25;
        camP = V(x + 3.4, 1.4, 2.4);
        look = V(x - 1.5, 0.6, 0);
        break;
      }
      case 'batuan-fosil': {
        const x = -9 + smooth(p) * 17;
        walk = 1;
        place(x, 0, 0.8, Math.PI / 2);
        camP = V(x + 1.2, 2, 5.6);
        look = V(x - 0.8, 2.1, -2);
        break;
      }
      case 'kristal': {
        place(0, 0, 0.6, Math.sin(t * 0.4) * 0.6 + Math.PI);
        const o = -0.6 + p * 1.4;
        camP = V(Math.sin(o) * 4.2, 1.6 + Math.sin(p * 3) * 0.3, Math.cos(o) * 4.2 + 0.6);
        look = V(0, 1.0, -1.2);
        if (Math.random() < dt * 0.4) sfx.clink();
        break;
      }
      case 'kerak-bumi':
      case 'moho':
      case 'mantel-atas':
      case 'mantel-bawah': {
        this.tunnelLook(s.set, p, dt);
        this.pod.scale.setScalar(0.62);
        this.pod.position.copy(c).add(V(Math.sin(t * 7) * 0.02, Math.sin(t * 1.3) * 0.08, 0));
        this.pod.rotation.set(0, 0.5 + Math.sin(t * 0.3) * 0.2, 0);
        this.pod.userData.update?.(t, 1);
        const o = t * 0.12;
        camP = V(Math.sin(o) * 3.7, 0.9 + Math.sin(t * 0.4) * 0.3, Math.cos(o) * 3.7);
        look = V(0, 0, 0);
        if (this.playing && t > this.nextRumble) {
          this.nextRumble = t + 0.5;
          sfx.rumble(0.5);
        }
        break;
      }
      case 'inti-luar': {
        this.pod.scale.setScalar(0.8);
        this.pod.position.copy(c).add(V(0, Math.sin(t * 0.8) * 0.25, 0));
        this.pod.rotation.set(Math.sin(t * 0.5) * 0.08, t * 0.2, Math.sin(t * 0.4) * 0.08);
        this.pod.userData.update?.(t, 0.2);
        const o = 0.4 + p * 1.2;
        camP = V(Math.sin(o) * 5.5, 1.2, Math.cos(o) * 5.5);
        look = V(0, 0, 0);
        break;
      }
      case 'inti-dalam': {
        const k = smooth(p);
        this.pod.position.copy(c).add(V(0, 1 - k * 1.2, 0));
        this.pod.rotation.set(0, t * 0.15, 0);
        this.pod.userData.update?.(t, 0.2);
        camP = V(4.5 - k * 1, 2.2 - k * 0.8, 6.5 - k * 1.5);
        look = V(0, -1.2 - k * 1.8, 0);
        break;
      }
      case 'medan-magnet': {
        const o = -2.3 + p * 0.9;
        camP = V(Math.cos(o) * 70, 22 - p * 8, Math.sin(o) * 70);
        look = V(8, 0, 0);
        break;
      }
      case 'misi-selesai': {
        const o = -2.4 + p * 0.5;
        camP = V(Math.cos(o) * 42, 14, Math.sin(o) * 42);
        look = V(0, -2, 0);
        break;
      }
      default: {
        // ringkasan: dekat ke penampang Bumi, lapisan disorot satu per satu
        const o = -2.36 + Math.sin(p * 3) * 0.15;
        camP = V(Math.cos(o) * 30, 8, Math.sin(o) * 30);
        look = V(-2, 0, -2);
      }
    }
    // cincin lapisan yang disorot
    const hi = s.set === 'ringkasan' ? ringkasanLayer(p) : -1;
    if (hi !== this.cutHi && this.loc === 'space') {
      this.cutHi = hi;
      const tx = this.layerTex(hi);
      for (const m of this.cutFaces) {
        m.map?.dispose();
        m.map = tx;
        m.needsUpdate = true;
      }
    }
    const field = this.groups.get('space')?.userData.field as T.Group | undefined;
    if (field) (field.userData.mat as T.ShaderMaterial).uniforms.uO.value = s.set === 'magnet' ? 1 : s.set === 'selesai' ? 0.5 : 0.15;

    // lampu kepala mengikuti Agam (lampu tetap ada di adegan; hanya intensitasnya berubah)
    const lamp = a.lamp!;
    if (a.root.visible) {
      a.lens.getWorldPosition(lamp.position);
      lamp.target.position.copy(lamp.position).add(V(0, -0.5, 3).applyEuler(a.root.rotation));
    } else lamp.intensity = 0;
    if (a.root.visible) {
      a.update(t, walk);
      if (s.id === 'sungai-bawah-tanah') a.legL.rotation.x = a.legR.rotation.x = -1.2;
      if (walk && t > this.nextStep) {
        this.nextStep = t + 0.42;
        sfx.step();
      }
    }
    camP.add(c);
    look.add(c);
    if (this.snap) {
      this.camPos.copy(camP);
      this.camLook.copy(look);
      this.snap = false;
    }
    const f = 1 - Math.exp(-dt * 2.2);
    this.camPos.lerp(camP, f);
    this.camLook.lerp(look, f);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.player.stop();
    this.ro.disconnect();
    this.controls.dispose();
    this.scene.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
      const mt = m.material as T.Material | T.Material[] | undefined;
      if (Array.isArray(mt)) mt.forEach((x) => x.dispose());
      else mt?.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.fadeEl.remove();
  }
}
