// Mesin Petualangan Bawah Laut: dunia laut dari permukaan sampai palung (setiap zona adalah "panggung"
// yang menurun seperti lereng), cahaya & kabut yang meredup mengikuti kedalaman, salju laut, kaustik,
// berkas cahaya matahari; mode Tur (menyelam bernarasi, kamera sinematik kalem) dan mode Jelajah
// (kamera bebas, ketuk biota di dok → kamera terbang ke biota itu).

import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { create } from 'zustand';
import { followAudio } from '@/lib/audio-clock';
import { sfx } from '@/lib/sfx';
import { sharedAudio, unlockAudio } from '@/lib/audio-unlock';
import { LoopMusic } from '@/lib/bgm';
import { BIOTA, TUR_LAUT, TUR_LAUT_AUDIO, depthToY, lautDwell, yToDepth, type LautAudioPart, type LautSet } from '@/lib/laut/misi';
import * as C from './creatures';
import { blackSmoker, boat, coral, diver, rng, rock, seabed, seagrass, SEAGRASS_PUSHERS, submersible } from './props';

export type LautMode = 'jelajah' | 'tur';

interface LautUI {
  mode: LautMode;
  stop: number;
  progress: number;
  playing: boolean;
  finished: boolean;
  focus: string | null;
  depth: number;
}

export const useLaut = create<LautUI>(() => ({ mode: 'jelajah', stop: 0, progress: 0, playing: false, finished: false, focus: null, depth: 0 }));

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/** Pusat tiap panggung (lereng menurun ke arah +x supaya dasar laut tidak saling menutupi). */
const SET_X: Record<LautSet, number> = {
  kapal: 0,
  karang: 0,
  lamun: 40,
  dinding: 70,
  biru: 120,
  redup: 140,
  'kapal-selam': 152,
  senja: 165,
  cahaya: 175,
  ventilasi: 185,
  abisal: 240,
  palung: 300,
  selesai: 300,
  ringkasan: 300,
};

/** Titik melayang penjelajah di akhir adegan i. */
function anchor(i: number) {
  const s = TUR_LAUT[i];
  const d = s.depth[1];
  if (s.id === 'persiapan') return new T.Vector3(2, 1.62, 0);
  if (s.id === 'masuk-laut') return new T.Vector3(0.5, depthToY(d), 4.2);
  const x = SET_X[s.set];
  const floorLift = s.set === 'ventilasi' || s.set === 'abisal' || s.set === 'palung' || s.set === 'selesai' ? 2.6 : 0;
  // kapal selam melayang sedikit sebelum pusat panggung, lampunya menyorot biota di depan
  const back = s.ride === 'kapal-selam' && s.set !== 'selesai' && s.set !== 'ringkasan' ? -5 : 0;
  return new T.Vector3(x + back, depthToY(d) + floorLift, s.set === 'dinding' ? 3 : 0);
}

const partFor = (i: number) => TUR_LAUT_AUDIO.find((p) => i >= p.first && i < p.first + p.cues.length) ?? null;

interface Mover {
  obj: T.Object3D;
  c: T.Vector3;
  r: number;
  sp: number;
  ph: number;
  bob: number;
  /** arah muka model: +x (ikan) */
  face?: boolean;
  tilt?: number;
}

export class LautEngine {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(50, 1, 0.1, 1500);
  private controls: OrbitControls;
  private ro: ResizeObserver;
  private raf = 0;
  private last = performance.now();
  private uTime = C.U.time;

  private sun = new T.DirectionalLight('#fff4dc', 2.4);
  private hemi = new T.HemisphereLight('#bfeaff', '#0b2233', 1);
  private camLight = new T.PointLight('#cfe8ff', 0, 30, 1.2);
  private fog = new T.FogExp2('#2a93c9', 0.02);
  private sky: T.Mesh;
  private water: T.Mesh;
  private rays: T.Mesh[] = [];
  private snow: T.Points;
  private bubbles: T.Points;
  private bubbleT: Float32Array;
  private splash: T.Points;
  private splashT = -1;

  private diver = diver();
  private sub = submersible();
  private boat = boat();
  private animated: T.Object3D[] = [];
  private movers: Mover[] = [];
  private schools: { s: C.School; c: T.Vector3; r: number; sp: number; y: number }[] = [];
  private biota = new Map<string, T.Object3D>();
  /** lamun yang merespon: benda-benda yang menyibakkan helai + jejak posisinya (untuk tegak kembali pelan) */
  private grass: { push: T.Vector4[]; items: { obj: () => T.Object3D | null; r: number; trail: T.Vector3[] }[]; acc: number } | null = null;

  /* tur */
  private idx = 0;
  private t = 0;
  private playing = false;
  /** musik latar tur "Deep Curiosity": pelan di bawah narasi, berulang tanpa putus sampai tur selesai */
  private music = new LoopMusic('/laut/musik-laut.m4a', ['laut-bgm-a', 'laut-bgm-b'], { volume: 0.13, loopStart: 3, loopEnd: 213, fade: 4 });
  private durs = TUR_LAUT.map(lautDwell);
  private audio: HTMLAudioElement | null = null;
  private part: LautAudioPart | null = null;
  private camPos = new T.Vector3(8, 3, 10);
  private camLook = new T.Vector3(0, 1, 0);
  private snap = true;
  private player = new T.Vector3();
  private heading = 0;
  private dive = 0;
  private nextBubble = 0;
  private camRate = 1.6;

  /* jelajah */
  private follow: T.Object3D | null = null;
  private flyK = 1;
  private flyFrom = { p: new T.Vector3(), t: new T.Vector3() };
  private lastUi = 0;

  constructor(private host: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);

    this.scene.fog = this.fog;
    this.sun.position.set(20, 80, 10);
    this.scene.add(this.sun, this.sun.target, this.hemi, new T.AmbientLight('#8fb8d8', 0.12));
    this.camera.add(this.camLight);
    this.scene.add(this.camera);

    this.sky = this.buildSky();
    this.water = this.buildSurface();
    this.snow = this.buildSnow();
    const b = this.buildBubbles();
    this.bubbles = b.points;
    this.bubbleT = b.t;
    this.splash = this.buildSplash();
    this.buildSets();

    this.scene.add(this.diver, this.sub, this.boat);
    this.animated.push(this.boat, this.sub);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 30;

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.home();
    this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------------- permukaan & suasana ---------------- */

  private buildSky() {
    const m = new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `varying vec3 vD; void main(){ float h = vD.y;
        vec3 c = mix(vec3(1.0,0.78,0.55), vec3(0.45,0.72,0.95), smoothstep(0.0, 0.25, h));
        c = mix(c, vec3(0.2,0.48,0.85), smoothstep(0.25, 0.8, h));
        float s = max(0.0, dot(vD, normalize(vec3(-0.6, 0.18, -0.5))));
        c += vec3(1.0,0.8,0.5) * (pow(s, 300.0) * 2.0 + pow(s, 8.0) * 0.35);
        gl_FragColor = vec4(c, 1.0); }`,
    });
    const sky = new T.Mesh(new T.SphereGeometry(900, 32, 16), m);
    this.scene.add(sky);
    // pulau-pulau di cakrawala
    const r = rng(9);
    for (let i = 0; i < 5; i++) {
      const isl = new T.Mesh(new T.SphereGeometry(20 + r() * 25, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: '#3f7a3a', roughness: 1 }));
      isl.scale.y = 0.35 + r() * 0.3;
      const a = -0.9 - r() * 1.6;
      isl.position.set(Math.cos(a) * (220 + r() * 120), -2, Math.sin(a) * (220 + r() * 120));
      this.scene.add(isl);
    }
    return sky;
  }

  private buildSurface() {
    const m = new T.ShaderMaterial({
      side: T.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: this.uTime },
      vertexShader: `uniform float uTime; varying vec3 vW; void main(){ vec3 p = position;
        p.z += sin(p.x*0.35 + uTime*1.2)*0.12 + cos(p.y*0.29 + uTime*0.9)*0.12;
        vec4 w = modelMatrix * vec4(p,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform float uTime; varying vec3 vW;
        void main(){
          vec2 p = vW.xz;
          float r = sin(p.x*0.9 + uTime*1.4 + sin(p.y*0.7))*sin(p.y*1.1 - uTime*1.1);
          if (gl_FrontFacing == (cameraPosition.y > 0.0)) {}
          if (cameraPosition.y > 0.0) {
            vec3 v = normalize(cameraPosition - vW);
            float fres = pow(1.0 - max(v.y, 0.0), 3.0);
            vec3 c = mix(vec3(0.04,0.3,0.5), vec3(0.62,0.8,0.95), fres*0.8);
            c += smoothstep(0.75, 1.0, r) * 0.25;
            gl_FragColor = vec4(c, 0.95);
          } else {
            vec3 c = mix(vec3(0.35,0.78,0.95), vec3(0.85,0.98,1.0), smoothstep(0.2, 1.0, r));
            float d = length(p - cameraPosition.xz);
            gl_FragColor = vec4(c, clamp(1.2 - d/60.0, 0.0, 0.9));
          }
        }`,
    });
    const water = new T.Mesh(new T.PlaneGeometry(1600, 1600, 120, 120), m);
    water.rotation.x = -Math.PI / 2;
    this.scene.add(water);
    return water;
  }

  private buildSnow() {
    const n = 2500;
    const pos = new Float32Array(n * 3);
    const r = rng(4);
    for (let i = 0; i < n; i++) pos.set([(r() - 0.5) * 60, (r() - 0.5) * 60, (r() - 0.5) * 60], i * 3);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    const m = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: this.uTime, uCam: { value: new T.Vector3() }, uAlpha: { value: 0.5 }, uCol: { value: new T.Color('#ffffff') } },
      vertexShader: `uniform float uTime; uniform vec3 uCam; varying float vF;
        void main(){ vec3 p = position; p.y -= uTime * 0.25; p.x += sin(uTime*0.3 + position.z)*0.5;
          p = mod(p - uCam + 30.0, 60.0) - 30.0 + uCam;
          vec4 mv = modelViewMatrix * vec4(p,1.0); vF = clamp(1.0 - (-mv.z)/28.0, 0.0, 1.0);
          gl_PointSize = 60.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform float uAlpha; uniform vec3 uCol; varying float vF; void main(){ float d = length(gl_PointCoord-0.5); if (d>0.5) discard; gl_FragColor = vec4(uCol, (1.0-d*2.0) * uAlpha * vF); }`,
    });
    const p = new T.Points(g, m);
    p.frustumCulled = false;
    this.scene.add(p);
    return p;
  }

  private buildBubbles() {
    const n = 60;
    const pos = new Float32Array(n * 3);
    const t = new Float32Array(n).map((_, i) => i / n);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    const m = new T.PointsMaterial({ size: 0.12, map: C.glow(), color: '#e8fbff', transparent: true, depthWrite: false, opacity: 0.8 });
    const points = new T.Points(g, m);
    points.frustumCulled = false;
    this.scene.add(points);
    return { points, t };
  }

  private buildSplash() {
    const n = 160;
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3));
    const p = new T.Points(g, new T.PointsMaterial({ size: 0.25, map: C.glow(), color: '#ffffff', transparent: true, depthWrite: false, opacity: 0 }));
    p.frustumCulled = false;
    this.scene.add(p);
    return p;
  }

  /* ---------------- panggung-panggung laut ---------------- */

  private addMover(obj: T.Object3D, c: T.Vector3, r: number, sp: number, opts: Partial<Mover> = {}) {
    this.scene.add(obj);
    this.movers.push({ obj, c, r, sp, ph: opts.ph ?? Math.random() * 6.28, bob: opts.bob ?? 0.3, face: opts.face ?? true, tilt: opts.tilt });
    this.animated.push(obj);
    return obj;
  }

  private place(obj: T.Object3D, x: number, y: number, z: number, s = 1, ry = 0) {
    obj.position.set(x, y, z);
    obj.scale.multiplyScalar(s);
    obj.rotation.y = ry;
    this.scene.add(obj);
    if (obj.userData.update) this.animated.push(obj);
    return obj;
  }

  private buildSets() {
    const U = this.uTime;
    const r = rng(12);
    const Y = (d: number) => depthToY(d);

    // --- terumbu karang (±9 m) ---
    {
      const x0 = SET_X.karang,
        fy = Y(9.6);
      const bed = seabed(56, '#cdbb94', U, 0.5, 0.12, 5);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      const colors = ['#ff7f6b', '#ffb03a', '#c77dff', '#ff5ea8', '#6fd6c9', '#ffd84a', '#9a6bff', '#ff8f3a'];
      // gundukan karang (bommie) tempat karang-karang tumbuh
      const mounds: T.Vector3[] = [];
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * 6.28 + r(),
          d = 4 + r() * 12;
        const m = new T.Vector3(x0 + Math.cos(a) * d, fy, Math.sin(a) * d);
        if (Math.hypot(m.x - x0 - 2, m.z - 1.5) < 4.5) m.z -= 6; // anemon ikan badut tetap terlihat
        mounds.push(m);
        this.place(rock(1.0 + r() * 0.7, '#a58f84', r), m.x, fy + 0.1, m.z);
      }
      for (let i = 0; i < 170; i++) {
        const m = mounds[i % mounds.length];
        const a = r() * 6.28,
          d = r() * 3;
        const kind = [0, 1, 4, 3, 0, 4, 1, 2][i % 8];
        const c = coral(kind, colors[(i * 3) % colors.length], r);
        const onTop = d < 1.3;
        this.place(c, m.x + Math.cos(a) * d, fy + (onTop ? 0.9 - d * 0.4 : 0.1), m.z + Math.sin(a) * d, (kind === 2 ? 1 : 1.6) * (0.9 + r() * 0.9), r() * 6);
      }
      for (let i = 0; i < 12; i++) {
        const x = x0 + (r() - 0.5) * 30,
          z = (r() - 0.5) * 30;
        if (Math.hypot(x - x0 - 2, z - 1.5) > 4) this.place(rock(0.5 + r() * 0.8, '#9a8f80', r), x, fy, z);
      }
      const an = this.place(C.anemone('#c9a0ff'), x0 + 2, fy + 0.2, 1.5, 3);
      for (const [ax, az, col] of [
        [-4, 4, '#ff9ec7'],
        [5, -5, '#9ff0c9'],
        [-6, -3, '#ffd27a'],
      ] as const)
        this.place(C.anemone(col), x0 + ax, fy + 0.2, az, 2.4);
      // kawanan ikan karang berwarna (kuning & merah muda)
      for (const [col, hi, n, cx, cz] of [
        ['#ffd21f', '#fff3a0', 30, 4, -3],
        ['#ff7fb0', '#ffc2da', 36, -5, -2],
      ] as const) {
        const spec: C.FishSpec = { ...C.SPECIES['ikan-lentera'], len: 0.2, h: 0.45, emissive: undefined, metal: 0, fin: col, paint: (g, w, h) => { const q = g.createLinearGradient(0, 0, w, 0); q.addColorStop(0, col); q.addColorStop(0.5, hi); q.addColorStop(1, col); g.fillStyle = q; g.fillRect(0, 0, w, h); } };
        const sc = new C.School(spec, n, new T.Vector3(3, 1.2, 3), n);
        this.scene.add(sc.group);
        this.schools.push({ s: sc, c: new T.Vector3(x0 + cx, fy + 2.2, cz), r: 2.5, sp: 0.3, y: r() * 6 });
      }
      const anC = an.position.clone().add(new T.Vector3(0, 0.9, 0));
      this.biota.set('ikan-badut', this.addMover(C.buildFish(C.SPECIES['ikan-badut']), anC, 0.7, 0.9, { bob: 0.15 }));
      this.addMover(C.buildFish(C.SPECIES['ikan-badut']), anC, 0.5, -1.1, { bob: 0.12 });
      this.biota.set('ikan-kupu-kupu', this.addMover(C.buildFish(C.SPECIES['ikan-kupu-kupu']), new T.Vector3(x0 - 2, fy + 2, -1), 2.2, 0.5));
      this.addMover(C.buildFish(C.SPECIES['ikan-kupu-kupu']), new T.Vector3(x0 - 2.5, fy + 2.4, -1.2), 2.6, 0.45);
      this.biota.set('blue-tang', this.addMover(C.buildFish(C.SPECIES['blue-tang']), new T.Vector3(x0 + 1, fy + 2.8, -2), 3, -0.55));
      this.addMover(C.buildFish(C.SPECIES['blue-tang']), new T.Vector3(x0 + 1.4, fy + 3.2, -2), 3.4, -0.5);
      const tur = C.turtle();
      tur.scale.setScalar(1.6);
      this.biota.set('penyu-hijau', this.addMover(tur, new T.Vector3(x0, fy + 4.2, 0), 7, 0.16, { bob: 0.6, tilt: 0.1 }));
      const chromis: C.FishSpec = { ...C.SPECIES['ikan-lentera'], len: 0.16, emissive: undefined, metal: 0, paint: (g, w, h) => { const q = g.createLinearGradient(0, 0, w, 0); q.addColorStop(0, '#2f9bff'); q.addColorStop(0.5, '#9ff0ff'); q.addColorStop(1, '#2f9bff'); g.fillStyle = q; g.fillRect(0, 0, w, h); }, fin: '#7fd8ff' };
      const sch = new C.School(chromis, 40, new T.Vector3(3, 1.5, 3), 3);
      this.scene.add(sch.group);
      this.schools.push({ s: sch, c: new T.Vector3(x0 - 3, fy + 3.5, 3), r: 4, sp: 0.35, y: 0 });
    }

    // --- padang lamun (±16 m) ---
    {
      const x0 = SET_X.lamun,
        fy = Y(17.5);
      const bed = seabed(50, '#dccfae', U, 0.35, 0.08, 7);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      const sg = seagrass(4200, 16, U, 3);
      sg.position.set(x0, fy + 0.05, 0);
      this.scene.add(sg);
      for (let i = 0; i < 8; i++) this.place(rock(0.5 + r(), '#8f8676', r), x0 + (r() - 0.5) * 26, fy, (r() - 0.5) * 26);
      const sh = C.seahorse();
      this.biota.set('kuda-laut', this.place(sh, x0 - 1.5, fy + 0.9, 1.5, 1.6, 0.4));
      const sh2 = this.place(C.seahorse(), x0 + 2.5, fy + 0.7, -1.8, 1.3, -0.6);
      this.biota.set('ikan-kakatua', this.addMover(C.buildFish(C.SPECIES['ikan-kakatua']), new T.Vector3(x0, fy + 1.8, 0), 3.5, 0.4));
      const lion = C.buildFish(C.SPECIES.lionfish);
      this.biota.set('lionfish', this.addMover(lion, new T.Vector3(x0 + 3, fy + 1.4, 2), 0.6, 0.25, { bob: 0.1 }));
      const pari = C.ray(false);
      pari.scale.setScalar(1.4);
      this.biota.set('pari', this.addMover(pari, new T.Vector3(x0 - 1, fy + 0.35, -2), 3, 0.2, { bob: 0.05 }));
      const B = (id: string) => () => this.biota.get(id) ?? null;
      this.grass = {
        push: sg.userData.push as T.Vector4[],
        acc: 0,
        items: [
          { obj: B('pari'), r: 1.6, trail: [] },
          { obj: B('ikan-kakatua'), r: 0.75, trail: [] },
          { obj: B('lionfish'), r: 0.65, trail: [] },
          { obj: () => (this.diver.visible ? this.diver : null), r: 0.95, trail: [] },
          { obj: () => this.camera, r: 0.8, trail: [] },
          { obj: B('kuda-laut'), r: 0.4, trail: [] },
          { obj: () => sh2, r: 0.35, trail: [] },
        ],
      };
    }

    // --- dinding karang (±34 m) ---
    {
      const x0 = SET_X.dinding;
      const wall = new T.PlaneGeometry(44, 48, 60, 64);
      const p = wall.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i),
          y = p.getY(i);
        p.setZ(i, Math.sin(x * 0.4) * 0.8 + Math.sin(y * 0.3 + x * 0.2) * 1.2 + Math.sin(x * 1.7 + y * 1.3) * 0.25);
      }
      wall.computeVertexNormals();
      const wm = new T.Mesh(wall, new T.MeshStandardMaterial({ color: '#9a8c7c', roughness: 1 }));
      wm.rotation.y = 0;
      wm.position.set(x0, Y(28), -4);
      this.scene.add(wm);
      const colors = ['#ff7f6b', '#ffb03a', '#c77dff', '#ff5ea8', '#ffd84a', '#6fd6c9'];
      for (let i = 0; i < 110; i++) {
        const kind = [0, 1, 3, 4, 0, 3][i % 6];
        const c = coral(kind, colors[(i * 5) % colors.length], r);
        c.rotation.x = kind === 3 ? 0 : Math.PI / 2 - 0.4;
        this.place(c, x0 + (r() - 0.5) * 36, Y(28) + (r() - 0.5) * 40, -3.4 + r() * 0.6, 1.2 + r() * 1.2, kind === 3 ? r() * 0.6 - 0.3 : 0);
      }
      const bar = new C.School(C.SPECIES.barakuda, 26, new T.Vector3(6, 2.5, 3), 8);
      this.scene.add(bar.group);
      this.schools.push({ s: bar, c: new T.Vector3(x0 + 2, Y(34) + 3, 5), r: 7, sp: 0.18, y: 0 });
      this.biota.set('barakuda', bar.group);
      this.biota.set('hiu-karang', this.addMover(C.buildFish(C.SPECIES['hiu-karang']), new T.Vector3(x0, Y(34) - 1.5, 6), 9, 0.12, { bob: 0.4 }));
    }

    // --- laut biru (±70 m) ---
    {
      const c = new T.Vector3(SET_X.biru, Y(70), 0);
      const manta = C.ray(true);
      manta.scale.setScalar(1.6);
      this.addMover(manta, c.clone().add(new T.Vector3(0, 2, 0)), 9, 0.1, { bob: 1.2, tilt: 0.25 });
      const tuna = new C.School(C.SPECIES.tuna, 34, new T.Vector3(8, 3, 5), 5);
      this.scene.add(tuna.group);
      this.schools.push({ s: tuna, c: c.clone().add(new T.Vector3(0, -3, 0)), r: 12, sp: 0.22, y: 0 });
      for (let i = 0; i < 6; i++) {
        const j = C.jellyfish('#e8b5ff', false, 0.4);
        this.addMover(j, c.clone().add(new T.Vector3((r() - 0.5) * 14, 2 + r() * 5, (r() - 0.5) * 10)), 0.4, 0.1, { bob: 0.8, face: false });
      }
    }

    // --- laut makin redup (±180 m) ---
    {
      const c = new T.Vector3(SET_X.redup, Y(180), 0);
      const sq = C.squid();
      sq.scale.setScalar(1.5);
      this.biota.set('cumi-cumi', this.addMover(sq, c.clone().add(new T.Vector3(0, 1, -1)), 4, 0.3, { bob: 0.5 }));
      this.addMover(C.squid(), c.clone().add(new T.Vector3(2, -1, 2)), 3, -0.35, { bob: 0.4 });
      for (let i = 0; i < 6; i++) {
        const j = C.jellyfish(i % 2 ? '#ff9ae0' : '#9ad8ff', true, 0.35);
        const o = this.addMover(j, c.clone().add(new T.Vector3((r() - 0.5) * 10, (r() - 0.5) * 5, (r() - 0.5) * 8)), 0.3, 0.1, { bob: 0.6, face: false });
        if (i === 0) this.biota.set('ubur-ubur', o);
      }
    }

    // --- zona senja (±900 m) ---
    {
      const c = new T.Vector3(SET_X.senja, Y(900), 0);
      const lan = new C.School(C.SPECIES['ikan-lentera'], 60, new T.Vector3(8, 4, 6), 11);
      this.scene.add(lan.group);
      this.schools.push({ s: lan, c: c.clone().add(new T.Vector3(3, 1, 0)), r: 5, sp: 0.25, y: 0 });
      this.biota.set('ikan-lentera', lan.group);
      const hat = new C.School(C.SPECIES['ikan-kapak'], 16, new T.Vector3(3, 2, 3), 13);
      this.scene.add(hat.group);
      this.schools.push({ s: hat, c: c.clone().add(new T.Vector3(-3, -1, 2)), r: 3, sp: -0.2, y: 0 });
      for (let i = 0; i < 2; i++) {
        const dg = C.buildFish(C.SPECIES['ikan-naga']);
        const lure = C.glowSprite('#ff4f6a', 0.4);
        lure.position.set(0.3, -0.25, 0);
        dg.add(lure);
        this.addMover(dg, c.clone().add(new T.Vector3(i * 3 - 1, -2 + i * 3, -2)), 4, 0.2 + i * 0.1, { bob: 0.5 });
      }
    }

    // --- cahaya di laut gelap (±1.800 m) ---
    {
      const c = new T.Vector3(SET_X.cahaya, Y(1800), 0);
      const ang = C.anglerfish();
      ang.scale.setScalar(1.4);
      this.biota.set('ikan-pemancing', this.addMover(ang, c.clone().add(new T.Vector3(1, 0.5, 0)), 1.2, 0.15, { bob: 0.3 }));
      const gul = C.gulperEel();
      this.biota.set('belut-gulper', this.addMover(gul, c.clone().add(new T.Vector3(-2, 2.5, -3)), 5, 0.12, { bob: 0.8 }));
      for (let i = 0; i < 4; i++) this.addMover(C.combJelly(), c.clone().add(new T.Vector3((r() - 0.5) * 12, (r() - 0.5) * 6, (r() - 0.5) * 8)), 0.5, 0.1, { bob: 0.6, face: false });
      for (let i = 0; i < 2; i++) this.addMover(C.siphonophore(), c.clone().add(new T.Vector3(-4 + i * 9, 5, -4 + i * 3)), 0.3, 0.05, { bob: 0.4, face: false });
      // plankton bercahaya
      const n = 500;
      const pos = new Float32Array(n * 3),
        col = new Float32Array(n * 3);
      const cc = new T.Color();
      for (let i = 0; i < n; i++) {
        pos.set([c.x + (r() - 0.5) * 30, c.y + (r() - 0.5) * 16, c.z + (r() - 0.5) * 24], i * 3);
        cc.setHSL(0.45 + r() * 0.2, 1, 0.6);
        col.set([cc.r, cc.g, cc.b], i * 3);
      }
      const pg = new T.BufferGeometry();
      pg.setAttribute('position', new T.BufferAttribute(pos, 3));
      pg.setAttribute('color', new T.BufferAttribute(col, 3));
      const pl = new T.Points(pg, new T.PointsMaterial({ size: 0.18, map: C.glow(), vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      pl.userData.update = (t: number) => ((pl.material as T.PointsMaterial).opacity = 0.6 + Math.sin(t * 1.7) * 0.3);
      this.scene.add(pl);
      this.animated.push(pl);
    }

    // --- ventilasi hidrotermal (±2.600 m) ---
    {
      const x0 = SET_X.ventilasi,
        fy = Y(2600) - 1;
      const bed = seabed(60, '#2b2926', U, 0, 0.5, 21);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      for (let i = 0; i < 4; i++) this.place(blackSmoker(3 + r() * 3, U), x0 - 5 + i * 3.5, fy, -4 + (i % 2) * 2);
      for (let i = 0; i < 5; i++) this.place(C.tubeWorms(18, i + 3), x0 - 4 + i * 2.2, fy + 0.1, 1 + (i % 2) * 1.5);
      for (let i = 0; i < 12; i++) this.place(rock(0.5 + r() * 1.2, '#35302b', r), x0 + (r() - 0.5) * 30, fy, (r() - 0.5) * 30);
      for (let i = 0; i < 6; i++) this.addMover(C.crab(), new T.Vector3(x0 - 3 + i * 1.3, fy + 0.25, 2.5), 0.6, 0.15, { bob: 0, tilt: 0 });
      for (let i = 0; i < 14; i++) this.addMover(C.shrimp('#f4ece4', 1.3), new T.Vector3(x0 - 4 + r() * 8, fy + 0.8 + r(), -1 + r() * 3), 0.5 + r(), 0.4, { bob: 0.2 });
    }

    // --- dataran abisal (±3.800 m) ---
    {
      const x0 = SET_X.abisal,
        fy = Y(3800) - 1;
      const bed = seabed(70, '#6f6a62', U, 0, 0.12, 31);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      for (let i = 0; i < 10; i++) this.place(rock(0.3 + r() * 0.6, '#57524b', r), x0 + (r() - 0.5) * 30, fy, (r() - 0.5) * 30);
      for (let i = 0; i < 3; i++) this.place(C.tripodFish(), x0 - 3 + i * 3.5, fy, -2 + (i % 2) * 3, 1.3, r() * 6);
      for (let i = 0; i < 4; i++) this.place(C.seaCucumber(), x0 - 2 + i * 2, fy + 0.1, 2 - (i % 2) * 3, 1.3, r() * 6);
      for (let i = 0; i < 5; i++) this.place(C.brittleStar(i % 2 ? '#e07a2a' : '#d9a05a'), x0 - 5 + i * 2.5, fy + 0.05, 0.5 + (i % 3), 1.2);
    }

    // --- palung (±6.500 m) ---
    {
      const x0 = SET_X.palung,
        fy = Y(6500) - 1;
      const bed = seabed(40, '#4a4a4f', U, 0, 0.2, 41);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      for (const s of [-1, 1]) {
        const w = new T.PlaneGeometry(50, 40, 40, 30);
        const p = w.attributes.position;
        for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 0.5) * 1.2 + Math.sin(p.getY(i) * 0.4 + p.getX(i) * 0.3) * 1.5);
        w.computeVertexNormals();
        const m = new T.Mesh(w, new T.MeshStandardMaterial({ color: '#2e2d31', roughness: 1, side: T.DoubleSide }));
        m.position.set(x0, fy + 15, s * 15);
        m.rotation.x = s * 0.25;
        this.scene.add(m);
      }
      for (let i = 0; i < 3; i++) {
        const sn = C.buildFish(C.SPECIES['ikan-siput-hadal']);
        sn.scale.setScalar(1.4);
        const o = this.addMover(sn, new T.Vector3(x0 + 1, fy + 1 + i * 0.6, -1 + i), 2 + i, 0.12 + i * 0.03, { bob: 0.2 });
        if (i === 0) this.biota.set('ikan-siput-hadal', o);
      }
      this.place(C.amphipods(26), x0 + 2.5, fy + 0.05, 1.5, 1.4);
      for (let i = 0; i < 2; i++) this.place(C.seaCucumber(), x0 - 1.5 + i * 3, fy + 0.1, -1.5 + i * 2.5, 1.2, r() * 6);
    }

    // berkas cahaya matahari dari permukaan (terlihat di zona dangkal)
    const rm = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      side: T.DoubleSide,
      uniforms: { uO: { value: 0.08 } },
      vertexShader: 'varying vec2 vUv; varying float vD; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: `uniform float uO; varying vec2 vUv; varying float vD;
        void main(){ float e = sin(vUv.x * 3.14159); float a = e * e * smoothstep(0.0, 0.6, vUv.y) * smoothstep(2.0, 12.0, vD);
          gl_FragColor = vec4(0.9, 0.98, 1.0, a * uO); }`,
    });
    for (let i = 0; i < 16; i++) {
      const ray = new T.Mesh(new T.PlaneGeometry(2 + r() * 3, 70), rm);
      ray.position.set((r() - 0.3) * 70, -35, (r() - 0.5) * 30);
      ray.rotation.set(0, r() * 3, 0.25);
      this.scene.add(ray);
      this.rays.push(ray);
    }
    // kapal selam parkir menunggu di batas aman
    this.sub.position.copy(anchor(TUR_LAUT.findIndex((s) => s.id === 'batas-aman'))).add(new T.Vector3(2.5, 0, 0));
  }

  /* ---------------- API ---------------- */

  setMode(m: LautMode) {
    useLaut.setState({ mode: m, focus: null });
    this.follow = null;
    if (m === 'tur') {
      unlockAudio();
      this.controls.enabled = false;
      this.go(0);
      this.setPlaying(true);
    } else {
      this.stopAudio();
      this.music.stop(1.2);
      this.playing = false;
      this.controls.enabled = true;
      useLaut.setState({ playing: false, finished: false });
      this.home();
    }
  }

  /** Jelajah: posisi awal di terumbu karang. */
  private home() {
    this.diver.visible = false;
    const c = new T.Vector3(SET_X.karang, depthToY(8), 0);
    const p = c.clone().add(new T.Vector3(7, 2.5, 10));
    if (this.camera.position.lengthSq() === 0) {
      this.camera.position.copy(p);
      this.controls.target.copy(c);
      this.flyGoal = { p, t: c };
    } else this.flyTo(p, c);
    this.placeSub(this.sub.userData.park ?? this.sub.position.clone());
  }

  private placeSub(p: T.Vector3) {
    this.sub.userData.park = this.sub.userData.park ?? p.clone();
    this.sub.position.copy(this.sub.userData.park);
    this.sub.rotation.set(0, 0, 0);
  }

  private flyTo(pos: T.Vector3, target: T.Vector3) {
    this.flyFrom.p.copy(this.camera.position);
    this.flyFrom.t.copy(this.controls.target);
    this.flyK = 0;
    this.flyGoal = { p: pos.clone(), t: target.clone() };
  }
  private flyGoal = { p: new T.Vector3(), t: new T.Vector3() };

  focus(id: string | null) {
    useLaut.setState({ focus: id });
    if (!id) {
      this.follow = null;
      return;
    }
    const obj = this.biota.get(id);
    if (!obj) return;
    this.follow = obj;
    const p = this.worldPos(obj);
    const size: Record<string, number> = { 'hiu-karang': 2.4, barakuda: 2.6, 'penyu-hijau': 1.8, 'belut-gulper': 2, 'ikan-lentera': 2.2, 'ikan-badut': 0.55, 'kuda-laut': 0.7, 'ikan-kupu-kupu': 0.6, 'blue-tang': 0.65, lionfish: 0.75, pari: 1, 'cumi-cumi': 1.1, 'ikan-pemancing': 1.1 };
    const k = size[id] ?? 0.9;
    // kamera di depan-samping biota (menghadap wajahnya), mengikuti arah hadapnya
    const q = new T.Quaternion();
    obj.getWorldQuaternion(q);
    const yaw = new T.Euler().setFromQuaternion(q, 'YXZ').y;
    const off = new T.Vector3(2.0 * k, 0.7 * k + 0.2, 1.8 * k).applyAxisAngle(new T.Vector3(0, 1, 0), obj.parent === this.scene ? yaw : 0);
    this.flyTo(p.clone().add(off), p);
  }

  private worldPos(o: T.Object3D) {
    const sch = this.schools.find((s) => s.s.group === o);
    if (sch) return sch.c.clone().add(new T.Vector3(Math.cos(sch.y) * sch.r, 0, Math.sin(sch.y) * sch.r));
    return o.getWorldPosition(new T.Vector3());
  }

  go(i: number) {
    const from = this.idx;
    this.idx = Math.max(0, Math.min(TUR_LAUT.length - 1, i));
    this.t = 0;
    // lompat antaradegan (bukan urut) → kamera langsung pindah, tidak meluncur jauh
    this.snap = i === 0 || Math.abs(this.idx - from) > 1;
    const p = partFor(this.idx);
    if (p) {
      const a = (this.audio = sharedAudio('laut'));
      if (!a.src.endsWith(p.src)) a.src = p.src;
      this.part = p;
      const seek = () => (a.currentTime = p.cues[this.idx - p.first]);
      if (a.readyState >= 1) seek();
      else a.onloadedmetadata = seek;
      if (this.playing) a.play().catch(() => {});
    } else {
      this.part = null;
      this.stopAudio();
    }
    useLaut.setState({ stop: this.idx, progress: 0, finished: false });
  }

  setPlaying(on: boolean) {
    this.playing = on;
    if (!on) this.audio?.pause();
    else if (this.part) this.audio?.play().catch(() => {});
    if (on) this.music.play();
    else this.music.pause();
    useLaut.setState({ playing: on });
  }

  private stopAudio() {
    this.audio?.pause();
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
    this.camera.fov = w < h ? 62 : 50;
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
    const mode = useLaut.getState().mode;

    // biota bergerak
    for (const m of this.movers) {
      const a = t * m.sp + m.ph;
      m.obj.position.set(m.c.x + Math.cos(a) * m.r, m.c.y + Math.sin(t * 0.7 + m.ph) * m.bob, m.c.z + Math.sin(a) * m.r);
      if (m.face && m.r > 0.05) {
        const dir = Math.sign(m.sp) || 1;
        m.obj.rotation.y = -a - (dir > 0 ? Math.PI / 2 : -Math.PI / 2);
        m.obj.rotation.z = (m.tilt ?? 0) * Math.sin(t * 0.8 + m.ph);
      }
    }
    for (const s of this.schools) {
      s.y += dt * s.sp;
      s.s.group.position.set(s.c.x + Math.cos(s.y) * s.r, s.c.y, s.c.z + Math.sin(s.y) * s.r);
      s.s.update(t, s.y + (s.sp > 0 ? Math.PI / 2 : -Math.PI / 2));
    }
    for (const o of this.animated) o.userData.update?.(t, o.id * 0.37);
    this.pushSeagrass(dt);

    if (mode === 'tur') this.stepTour(dt);
    else this.stepJelajah(dt);

    this.atmosphere(t, dt);
    this.renderer.render(this.scene, this.camera);

    if (now - this.lastUi > 250) {
      this.lastUi = now;
      const d = Math.round(yToDepth(this.camera.position.y));
      if (d !== useLaut.getState().depth) useLaut.setState({ depth: d });
    }
  };

  /** isi pendorong lamun: posisi sekarang + posisi ±0,5 dtk lalu (jari-jari mengecil) supaya helai tegak pelan */
  private pushSeagrass(dt: number) {
    const g = this.grass;
    if (!g) return;
    g.acc += dt;
    const sample = g.acc >= 0.1;
    if (sample) g.acc = 0;
    let k = 0;
    const tmp = new T.Vector3();
    for (const it of g.items) {
      const o = it.obj();
      if (!o) {
        it.trail.length = 0;
        continue;
      }
      o.getWorldPosition(tmp);
      if (sample) {
        it.trail.unshift(tmp.clone());
        if (it.trail.length > 6) it.trail.pop();
      }
      if (k < SEAGRASS_PUSHERS) g.push[k++].set(tmp.x, tmp.y, tmp.z, it.r);
      const old = it.trail[5] ?? it.trail[it.trail.length - 1];
      if (old && old.distanceToSquared(tmp) > 0.04 && k < SEAGRASS_PUSHERS) g.push[k++].set(old.x, old.y, old.z, it.r * 0.6);
    }
    while (k < SEAGRASS_PUSHERS) g.push[k++].set(0, -9999, 0, 0);
  }

  private stepJelajah(dt: number) {
    this.diver.visible = false;
    if (this.flyK < 1) {
      this.flyK = Math.min(1, this.flyK + dt / 2.2);
      const k = smooth(this.flyK);
      const goalT = this.follow ? this.worldPos(this.follow) : this.flyGoal.t;
      const goalP = this.follow ? goalT.clone().add(this.flyGoal.p.clone().sub(this.flyGoal.t)) : this.flyGoal.p;
      this.camera.position.lerpVectors(this.flyFrom.p, goalP, k);
      this.controls.target.lerpVectors(this.flyFrom.t, goalT, k);
    } else if (this.follow) {
      const tgt = this.worldPos(this.follow);
      const d = tgt.sub(this.controls.target).multiplyScalar(Math.min(1, dt * 3));
      this.controls.target.add(d);
      this.camera.position.add(d);
    }
    this.controls.update();
  }

  /** Mode tur: timeline adegan, posisi penjelajah, kamera sinematik. */
  private stepTour(dt: number) {
    const s = TUR_LAUT[this.idx];
    let dur = this.durs[this.idx];
    if (this.playing) {
      if (this.part && this.audio) {
        const k = this.idx - this.part.first;
        const end = this.part.cues[k + 1] ?? this.audio.duration;
        dur = Math.max(1, (Number.isFinite(end) ? end : this.audio.currentTime + 1) - this.part.cues[k]);
        this.t = followAudio(this.t, this.audio.currentTime - this.part.cues[k], dt, !this.audio.paused);
        if (this.audio.ended) this.t = dur;
      } else this.t += dt;
      if (this.t >= dur) {
        if (this.idx < TUR_LAUT.length - 1) this.go(this.idx + 1);
        else {
          this.music.stop(3); // tur selesai: musik mengecil pelan lalu berhenti
          this.setPlaying(false);
          useLaut.setState({ finished: true, progress: 1 });
        }
        return;
      }
    }
    const p = clamp01(this.t / dur);
    if (performance.now() - this.lastUi > 200) useLaut.setState({ progress: p });

    const i = this.idx;
    const prev = i > 0 ? anchor(i - 1) : anchor(0);
    const cur = anchor(i);
    const pos = new T.Vector3();
    const t = this.uTime.value;
    let standing = false;
    if (s.id === 'persiapan') {
      pos.set(2, 1.62, 0);
      standing = true;
    } else if (s.id === 'masuk-laut') {
      // berjalan ke tepi kapal → melompat (langkah lebar) → turun perlahan
      const walk = smooth(p / 0.18),
        jump = clamp01((p - 0.18) / 0.14),
        sink = smooth((p - 0.32) / 0.6);
      if (p < 0.32) {
        pos.set(2, 1.62 + Math.sin(jump * Math.PI) * 1.1 - jump * jump * 2.6, walk * 1.2 + jump * 2);
        standing = true;
        if (jump > 0.95 && this.splashT < 0) {
          this.splashT = 0;
          sfx.splash();
        }
      } else pos.set(2 - sink * 1.5, -1 + (depthToY(4) + 1) * sink, 3.2 + sink);
    } else if (s.set === 'ringkasan') {
      // naik kembali ke permukaan melewati semua zona
      const k = smooth(p / 0.85);
      const path = [...TUR_LAUT.keys()].slice(2, 14).map(anchor).reverse();
      path.push(new T.Vector3(2, -1.5, 3.5));
      const f = k * (path.length - 1);
      const a = Math.floor(f),
        b = Math.min(path.length - 1, a + 1);
      pos.lerpVectors(path[a], path[b], f - a);
    } else {
      const k = smooth(p / 0.45);
      pos.lerpVectors(prev, cur, k);
      // saat melayang, berenang pelan ke kiri-kanan
      pos.x += Math.sin(t * 0.3) * 0.6 * k;
      pos.y += Math.sin(t * 0.5) * 0.2;
    }
    const vel = pos.clone().sub(this.player);
    this.player.copy(pos);
    // kemiringan menukik saat turun, dihaluskan (tidak meloncat antara 0 dan penuh)
    this.dive = T.MathUtils.damp(this.dive, clamp01(-vel.y / Math.max(dt, 1e-3) / 3), 3, dt);
    // arah hadap: ke arah panggung tujuan (bukan goyangan kecil), saat naik ke permukaan menghadap balik
    const dirV = s.set === 'ringkasan' ? new T.Vector3(-1, 0, 0) : cur.clone().sub(prev);
    const face = Math.hypot(dirV.x, dirV.z) > 0.5 ? Math.atan2(-dirV.z, dirV.x) : 0;
    let dh = face - this.heading;
    dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    this.heading += dh * Math.min(1, dt * 1.5);

    // siapa yang tampil: penyelam atau kapal selam
    const inSub = s.ride === 'kapal-selam';
    this.diver.visible = !inSub && !(s.id === 'batas-aman' && p > 0.8);
    this.diver.userData.setTorch?.(s.id === 'makin-redup' || s.id === 'batas-aman' ? 1 : 0);
    if (this.diver.visible) {
      this.diver.position.copy(pos);
      if (standing) this.diver.rotation.set(0, -Math.PI / 2, Math.PI / 2);
      else this.diver.rotation.set(0, this.heading, Math.sin(t * 0.8) * 0.05 - this.dive * 0.35);
      this.diver.userData.stand?.(standing);
      this.diver.userData.update?.(t, standing ? 0 : 1);
    }
    if (inSub) {
      this.sub.position.copy(pos).add(new T.Vector3(0, 0.4, 0));
      this.sub.rotation.set(0, this.heading, Math.sin(t * 0.5) * 0.03 - this.dive * 0.15);
    } else this.placeSub(this.sub.position);
    this.sub.userData.setLights?.(inSub || s.id === 'batas-aman' ? 1 : 0);

    // gelembung dari penyelam
    this.updateBubbles(dt, this.diver.visible && pos.y < -0.5 ? this.diver.localToWorld(new T.Vector3(0.66, -0.05, 0)) : null);
    // napas penyelam: rangkaian gelembung sesekali
    if (this.playing && this.diver.visible && pos.y < -0.5 && t > this.nextBubble) {
      this.nextBubble = t + 2.2 + Math.random() * 1.8;
      for (let b = 0; b < 3; b++) setTimeout(() => sfx.bubble(), b * 90 + Math.random() * 60);
    }

    // kamera
    const lookAt = pos.clone();
    const off = new T.Vector3(3.5, 1.4, 6);
    if (s.id === 'persiapan') {
      off.set(1.2, 0.5, 3.6);
      lookAt.y += 0.2;
    } else if (s.id === 'masuk-laut') off.set(4, 1.2 + (p < 0.32 ? 0.8 : 0), 5.5);
    else if (s.set === 'karang' || s.set === 'lamun') {
      off.set(3, 0.2, 6);
      lookAt.lerp(new T.Vector3(SET_X[s.set], depthToY(s.set === 'karang' ? 9.6 : 17.5) + 1.2, 0), 0.35);
    } else if (s.set === 'dinding') {
      off.set(5.5, 0.8, 6.5);
      lookAt.lerp(new T.Vector3(pos.x - 2, pos.y, -3), 0.35);
    }
    else if (s.set === 'biru') off.set(3, 2, 11);
    else if (inSub) {
      off.set(-1.5, 1.3, 7.5);
      lookAt.add(new T.Vector3(4.5, -0.4, 0));
      if (s.set === 'selesai') {
        off.set(3.6, 0.5, 1.6);
        lookAt.copy(pos).add(new T.Vector3(1.1, 0.45, 0));
      }
      if (s.set === 'ringkasan') off.set(8, 3, 14);
    }
    const want = pos.clone().add(off);
    if (this.snap) {
      this.camPos.copy(want);
      this.camLook.copy(lookAt);
      this.snap = false;
    }
    // kamera makin cepat mengikuti saat penjelajah bergerak cepat — berubah mulus, tidak meloncat
    const speed = vel.length() / Math.max(dt, 1e-3);
    this.camRate = T.MathUtils.damp(this.camRate, s.set === 'ringkasan' ? 4 : 1.6 + Math.min(1, speed / 6) * 2.4, 2, dt);
    const f = 1 - Math.exp(-dt * this.camRate);
    this.camPos.lerp(want, f);
    this.camLook.lerp(lookAt, f);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);

    // percikan air saat masuk laut
    if (this.splashT >= 0) {
      this.splashT += dt;
      const pp = this.splash.geometry.attributes.position as T.BufferAttribute;
      for (let k = 0; k < pp.count; k++) {
        const a = k * 2.4,
          sp = 1 + (k % 7) * 0.4;
        const tt = this.splashT;
        pp.setXYZ(k, 2 + Math.cos(a) * sp * tt * 1.5, Math.max(0, sp * 2.2 * tt - 4.9 * tt * tt), 3.2 + Math.sin(a) * sp * tt * 1.5);
      }
      pp.needsUpdate = true;
      (this.splash.material as T.PointsMaterial).opacity = Math.max(0, 0.9 - this.splashT * 0.7);
      if (this.splashT > 1.4) this.splashT = -1;
    }
  }

  private updateBubbles(dt: number, from: T.Vector3 | null) {
    const pp = this.bubbles.geometry.attributes.position as T.BufferAttribute;
    for (let k = 0; k < pp.count; k++) {
      this.bubbleT[k] += dt * 0.35;
      if (this.bubbleT[k] > 1) {
        this.bubbleT[k] -= 1;
        if (from) pp.setXYZ(k, from.x, from.y, from.z);
        else pp.setXYZ(k, 0, 9999, 0);
      } else if (pp.getY(k) < 9000) pp.setXYZ(k, pp.getX(k) + Math.sin(this.uTime.value * 3 + k) * 0.004, Math.min(-0.1, pp.getY(k) + dt * 1.6), pp.getZ(k));
    }
    pp.needsUpdate = true;
  }

  /** Cahaya, kabut, dan suasana mengikuti kedalaman kamera. */
  private atmosphere(t: number, dt: number) {
    const y = this.camera.position.y;
    const under = y < 0;
    const d = yToDepth(y);
    const L = Math.exp(-d / 45); // cahaya matahari tersisa
    const shallow = new T.Color('#2a93c9'),
      mid = new T.Color('#0b3f6e'),
      deep = new T.Color('#010810');
    const fc = deep.clone().lerp(mid, clamp01(Math.pow(L, 0.35) * 1.2)).lerp(shallow, Math.pow(L, 1.4));
    if (under) {
      this.fog.color.copy(fc);
      this.fog.density = 0.022 + (1 - L) * 0.012;
      this.scene.background = fc;
      this.camera.far = 160;
    } else {
      this.fog.color.set('#cfe6f3');
      this.fog.density = 0.0012;
      this.scene.background = null;
      this.camera.far = 1500;
    }
    this.camera.updateProjectionMatrix();
    this.sky.visible = !under;
    this.sun.intensity = under ? 2.4 * L : 2.6;
    this.hemi.intensity = under ? 0.15 + 1.1 * L : 1.1;
    this.hemi.color.set(under ? '#9fe0ff' : '#dff2ff');
    // cahaya lembut dari kamera supaya biota laut dalam tetap terlihat (tanpa menghapus suasana gelap)
    this.camLight.intensity = under ? (1 - L) * 12 : 0;
    const sm = this.snow.material as T.ShaderMaterial;
    sm.uniforms.uCam.value.copy(this.camera.position);
    sm.uniforms.uAlpha.value = under ? 0.25 + (1 - L) * 0.45 : 0;
    this.snow.visible = under;
    for (const [i, r] of this.rays.entries()) {
      (r.material as T.ShaderMaterial).uniforms.uO.value = under ? 0.16 * clamp01(L * 1.6) : 0;
      r.rotation.z = 0.25 + Math.sin(t * 0.2 + i) * 0.05;
    }
    this.water.visible = d < 70;
    void dt;
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.stopAudio();
    this.music.stop(0.3);
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
  }
}

export const BIOTA_IDS = BIOTA.map((b) => b.id);
