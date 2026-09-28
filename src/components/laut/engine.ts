// Mesin Petualangan Bawah Laut: dunia laut dari permukaan sampai palung (setiap zona adalah "panggung"
// yang menurun seperti lereng), cahaya & kabut yang meredup mengikuti kedalaman, salju laut, kaustik,
// berkas cahaya matahari; mode Tur (menyelam bernarasi, kamera sinematik kalem) dan mode Jelajah
// (kamera bebas, ketuk biota di dok → kamera terbang ke biota itu).

import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { create } from 'zustand';
import { sfx } from '@/lib/sfx';
import { unlockAudio } from '@/lib/audio-unlock';
import { LoopMusic } from '@/lib/bgm';
import { BIOTA, TUR_LAUT, depthToY, yToDepth, type LautSet } from '@/lib/laut/misi';
import * as C from './creatures';
import { SeaNarration, type NarrationSource } from '@/lib/laut/narration';
import { chapterAtTime, diveAtTime, SEA_RECORDING, shotAtTime, subLightAtTime } from '@/lib/laut/timeline';
import { tropicalIslands } from './islands';
import { surfaceMaterial } from './realism';
import { BOAT_DECK_Y, deckPose } from './grounding';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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
  line: number;
  source: NarrationSource;
  muted: boolean;
  audioTime: number;
  audioLoading: boolean;
  view: 'cinema' | 'jendela';
}

export const useLaut = create<LautUI>(() => ({ mode: 'jelajah', stop: 0, progress: 0, playing: false, finished: false, focus: null, depth: 0, line: 0, source: 'teks', muted: false, view: 'cinema', audioTime: 0, audioLoading: false }));

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
  'kapal-selam': 45,
  senja: 165,
  cahaya: 175,
  ventilasi: 185,
  abisal: 240,
  palung: 300,
  challenger: 370,
  selesai: 370,
  ringkasan: 370,
};

/** Titik melayang penjelajah di akhir adegan i. */
function anchor(i: number) {
  const s = TUR_LAUT[i];
  const d = s.depth[1];
  if (s.id === 'persiapan') return new T.Vector3(2, BOAT_DECK_Y + 1.375, 0);
  if (s.id === 'masuk-laut') return new T.Vector3(0.5, depthToY(d), 4.2);
  const x = SET_X[s.set];
  const floorLift = s.set === 'ventilasi' || s.set === 'abisal' || s.set === 'palung' || s.set === 'challenger' || s.set === 'selesai' ? 2.6 : 0;
  // kapal selam melayang sedikit sebelum pusat panggung, lampunya menyorot biota di depan
  const back = s.ride === 'kapal-selam' && s.set !== 'selesai' && s.set !== 'ringkasan' ? -5 : 0;
  return new T.Vector3(x + back, depthToY(d) + floorLift, s.set === 'dinding' ? 3 : 0);
}

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
  private pointerStart = new T.Vector2();
  private onPointerDown = (e: PointerEvent) => this.pointerStart.set(e.clientX,e.clientY);
  private onPointerUp = (e: PointerEvent) => {
    if(useLaut.getState().mode !== 'jelajah' || this.pointerStart.distanceTo(new T.Vector2(e.clientX,e.clientY)) > 6)return;
    const rect=this.renderer.domElement.getBoundingClientRect();
    const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),this.camera);
    const hit=ray.intersectObjects(BIOTA.map(b=>this.biota.get(b.id)!).filter(Boolean),true)[0];
    if(hit)for(const [id,root] of this.biota){let o:T.Object3D|null=hit.object;while(o){if(o===root){this.focus(id);return;}o=o.parent;}}
  };
  private last = performance.now();
  private uTime = C.U.time;

  private sun = new T.DirectionalLight('#fff4dc', 2.4);
  private hemi = new T.HemisphereLight('#bfeaff', '#0b2233', 1);
  private camLight = new T.PointLight('#cfe8ff', 0, 30, 1.2);
  private fog = new T.FogExp2('#13788c', 0.02);
  private sky: T.Mesh;
  private water: T.Mesh;
  private rays: T.Mesh[] = [];
  /** latar bawah air: gradasi permukaan terang → horizon → dasar gelap + pendar matahari berkilau */
  private deep!: T.Mesh;
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
  private tourDepth = 0;
  private jumped = false;
  private narration = new SeaNarration();
  private environment: T.WebGLRenderTarget | null = null;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private onVisibility = () => { if (document.hidden && this.playing) this.setPlaying(false); };
  private playing = false;
  /** musik latar tur "Deep Curiosity": pelan di bawah narasi, berulang tanpa putus sampai tur selesai */
  private music = new LoopMusic('/laut/musik-laut.m4a', ['laut-bgm-a', 'laut-bgm-b'], { volume: 0.13, loopStart: 3, loopEnd: 213, fade: 4 });
  private camPos = new T.Vector3(8, 3, 10);
  private camLook = new T.Vector3(0, 1, 0);
  private snap = true;
  private player = new T.Vector3();
  private heading = 0;
  private dive = 0;
  private nextBubble = 0;
  private lastNarrationSeconds = 0;
  private camRate = 1.6;

  /* jelajah */
  private follow: T.Object3D | null = null;
  private flyK = 1;
  private flyFrom = { p: new T.Vector3(), t: new T.Vector3() };
  private lastUi = 0;

  constructor(private host: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFShadowMap;
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048,2048);
    Object.assign(this.sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:1,far:160});
    this.sun.shadow.normalBias = 0.06;
    const pmrem = new T.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.environment = pmrem.fromScene(room,0.06);
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = 0.3;
    room.dispose(); pmrem.dispose();
    document.addEventListener('visibilitychange',this.onVisibility);
    this.renderer.domElement.style.touchAction = 'none';
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener('pointerdown',this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup',this.onPointerUp);

    this.scene.fog = this.fog;
    this.sun.position.set(20, 80, 10);
    this.scene.add(this.sun, this.sun.target, this.hemi, new T.AmbientLight('#8fb8d8', 0.12));
    this.camera.add(this.camLight);
    this.scene.add(this.camera);

    this.sky = this.buildSky();
    this.water = this.buildSurface();
    this.snow = this.buildSnow();
    this.deep = this.buildDeepBackdrop();
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
        vec3 c = mix(vec3(0.72,0.86,0.91), vec3(0.28,0.61,0.83), smoothstep(0.0, 0.25, h));
        c = mix(c, vec3(0.2,0.48,0.85), smoothstep(0.25, 0.8, h));
        float s = max(0.0, dot(vD, normalize(vec3(-0.45, 0.72, -0.4))));
        c += vec3(1.0,0.8,0.5) * (pow(s, 300.0) * 2.0 + pow(s, 8.0) * 0.35);
        gl_FragColor = vec4(c, 1.0); }`,
    });
    const sky = new T.Mesh(new T.SphereGeometry(900, 32, 16), m);
    this.scene.add(sky);
    this.scene.add(tropicalIslands());
    return sky;
  }

  /**
   * Permukaan laut. Dari atas: ombak nyata dari 5 arah (gelombang panjang + riak pendek) dengan normal dihitung
   * dari kemiringan ombak, pantulan langit menurut sudut pandang (Fresnel), warna air hijau-biru yang lebih
   * gelap di lembah ombak, kilau matahari berkelip di jalur matahari, buih tipis di puncak ombak, dan memudar ke
   * warna cakrawala di kejauhan. Dari bawah: jendela Snell + jaring riak cahaya.
   */
  private buildSurface() {
    const WAVES = `
      const int NW = 5;
      vec4 W[NW] = vec4[NW](
        vec4(0.80, 0.60, 0.28, 22.0),
        vec4(-0.45, 0.89, 0.18, 11.0),
        vec4(0.97, -0.24, 0.10, 5.5),
        vec4(-0.70, -0.71, 0.05, 2.8),
        vec4(0.20, 0.98, 0.035, 1.6));
      // tinggi & kemiringan ombak di titik xz (x = arah, z = amplitudo, w = panjang gelombang)
      vec3 waves(vec2 p, float t){
        float h = 0.0; vec2 g = vec2(0.0);
        for (int i = 0; i < NW; i++){
          vec2 d = normalize(W[i].xy); float k = 6.2832 / W[i].w; float w = sqrt(9.8 * k);
          float ph = k * dot(d, p) - w * t * 0.6 + float(i) * 1.7;
          h += W[i].z * sin(ph);
          g += W[i].z * k * cos(ph) * d;
        }
        return vec3(h, g);
      }`;
    const m = new T.ShaderMaterial({
      side: T.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: this.uTime },
      vertexShader: `uniform float uTime; varying vec3 vW; varying float vH; ${WAVES}
        void main(){
          vec4 w = modelMatrix * vec4(position, 1.0);
          float fade = 1.0 - smoothstep(60.0, 260.0, length(w.xz - cameraPosition.xz));
          vec3 wv = waves(w.xz, uTime);
          w.y += wv.x * fade; vH = wv.x;
          vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform float uTime; varying vec3 vW; varying float vH; ${WAVES}
        void main(){
          vec2 p = vW.xz;
          float r = sin(p.x*0.9 + uTime*1.4 + sin(p.y*0.7))*sin(p.y*1.1 - uTime*1.1);
          if (cameraPosition.y > 0.0) {
            vec3 wv = waves(p, uTime);
            // riak halus tambahan untuk kilau
            vec2 fine = vec2(sin(p.x * 3.1 + uTime * 2.3 + sin(p.y * 2.7)), sin(p.y * 3.7 - uTime * 2.1 + sin(p.x * 2.2))) * 0.06;
            vec3 n = normalize(vec3(-wv.y - fine.x, 1.0, -wv.z - fine.y));
            vec3 v = normalize(cameraPosition - vW);
            float dist = length(cameraPosition - vW);
            float fres = 0.025 + 0.70 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
            vec3 rf = reflect(-v, n);
            vec3 sky = mix(vec3(0.64, 0.8, 0.88), vec3(0.27, 0.58, 0.77), smoothstep(0.0, 0.3, rf.y));
            sky = mix(sky, vec3(0.22, 0.48, 0.84), smoothstep(0.3, 0.9, rf.y));
            vec3 deep = vec3(0.02, 0.2, 0.3), shallow = vec3(0.05, 0.42, 0.5);
            vec3 water = mix(deep, shallow, clamp(0.5 + vH * 1.4, 0.0, 1.0));
            vec3 c = mix(water, sky, fres);
            vec3 sun = normalize(vec3(-0.45, 0.72, -0.4));
            float sd = max(dot(rf, sun), 0.0);
            c += vec3(1.0, 0.86, 0.62) * (pow(sd, 240.0) * 1.5 + pow(sd, 45.0) * 0.12);
            // buih tipis di puncak ombak
            float foam = smoothstep(0.3, 0.45, vH + fine.x * 0.8) * (1.0 - smoothstep(40.0, 120.0, dist));
            c = mix(c, vec3(0.93, 0.97, 1.0), foam * 0.55);
            // kejauhan memudar ke warna cakrawala
            c = mix(c, vec3(0.42, 0.64, 0.72), smoothstep(150.0, 700.0, dist) * 0.8);
            gl_FragColor = vec4(c, 0.97);
          } else {
            // dilihat dari bawah: jendela cahaya terang tepat di atas (jendela Snell), di luarnya memantulkan
            // air yang lebih gelap; jaring kilau bergerak seperti riak permukaan asli
            vec3 v = normalize(vW - cameraPosition);
            float win = smoothstep(0.55, 0.9, v.y);
            vec2 q = p * 0.35;
            float c1 = sin(q.x * 1.7 + uTime * 0.9 + sin(q.y * 1.3 + uTime * 0.6));
            float c2 = sin(q.y * 1.9 - uTime * 0.8 + sin(q.x * 1.1 - uTime * 0.5));
            float net = pow(max(0.0, 1.0 - abs(c1 + c2) * 0.6), 3.0);
            vec3 c = mix(vec3(0.12, 0.47, 0.64), vec3(0.78, 0.94, 1.0), win) + net * 0.22 * (0.35 + win) + r * 0.0;
            float d = length(p - cameraPosition.xz);
            gl_FragColor = vec4(c, clamp(1.1 - d / 70.0, 0.0, 0.9));
          }
        }`,
    });
    const water = new T.Mesh(new T.PlaneGeometry(1600, 1600, 256, 256), m);
    water.rotation.x = -Math.PI / 2;
    this.scene.add(water);
    return water;
  }

  private buildDeepBackdrop() {
    const m = new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new T.Color() },
        uHor: { value: new T.Color() },
        uBot: { value: new T.Color() },
        uSun: { value: 1 },
        uTime: this.uTime,
      },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uBot; uniform float uSun; uniform float uTime; varying vec3 vDir;
        void main(){
          vec3 d = normalize(vDir);
          float up = smoothstep(-0.05, 0.95, d.y);
          float down = 1.0 - smoothstep(-0.9, 0.0, d.y);
          vec3 c = mix(uHor, uTop, pow(up, 0.8));
          c = mix(c, uBot, down);
          // jendela cahaya permukaan (Snell) + kilau bergelombang
          float sun = pow(max(d.y, 0.0), 6.0);
          float ripple = 0.88 + 0.12 * sin((d.x + d.z * 0.7) * 9.0 + uTime * 0.9) * sin((d.z - d.x * 0.4) * 7.0 - uTime * 0.7);
          c += vec3(0.75, 0.95, 1.0) * sun * ripple * 0.5 * uSun;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    const mesh = new T.Mesh(new T.SphereGeometry(140, 48, 24), m);
    mesh.renderOrder = -10;
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    return mesh;
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
      const bed = seabed(56, '#cdbb94', U, 0.23, 0.12, 5);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      const colors = ['#b6ac87', '#bd956f', '#8d9490', '#a68986', '#87a391', '#c0b585', '#788b81', '#b08a6b'];
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
        const cx = m.x + Math.cos(a) * d, cz = m.z + Math.sin(a) * d;
        // Keep the opening shot's viewing corridor clear of large foreground sponges.
        if (cx > x0 - 1 && cx < x0 + 7 && cz > 0 && cz < 9) continue;
        const c = coral(kind, colors[(i * 3) % colors.length], r);
        const onTop = d < 1.3;
        this.place(c, cx, fy + (onTop ? 0.9 - d * 0.4 : 0.1), cz, (kind === 2 ? 1 : 1.6) * (0.9 + r() * 0.9), r() * 6);
      }
      for (let i = 0; i < 12; i++) {
        const x = x0 + (r() - 0.5) * 30,
          z = (r() - 0.5) * 30;
        if (Math.hypot(x - x0 - 2, z - 1.5) > 4) this.place(rock(0.5 + r() * 0.8, '#9a8f80', r), x, fy, z);
      }
      const an = this.place(C.anemone('#a7b095'), x0 + 2, fy + 0.2, 1.5, 3);
      for (const [ax, az, col] of [
        [-4, 4, '#bb958d'],
        [5, -5, '#9fb9a0'],
        [-6, -3, '#c1af81'],
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
      const sg = seagrass(7200, 16, U, 3);
      sg.position.set(x0, fy + 0.05, 0);
      this.scene.add(sg);
      for (let i = 0; i < 8; i++) this.place(rock(0.5 + r(), '#8f8676', r), x0 + (r() - 0.5) * 26, fy, (r() - 0.5) * 26);
      const sh = C.seahorse();
      this.biota.set('kuda-laut', this.place(sh, x0 - 1.5, fy + 0.9, 1.5, 1.6, 0.4));
      const sh2 = this.place(C.seahorse(), x0 + 2.5, fy + 0.7, -1.8, 1.3, -0.6);
      this.biota.set('ikan-kakatua', this.addMover(C.buildFish(C.SPECIES['ikan-kakatua']), new T.Vector3(x0, fy + 1.8, 0), 3.5, 0.4));
      const lion = C.lionfish();
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
      const wm = new T.Mesh(wall, surfaceMaterial('#9a8c7c'));
      wm.rotation.y = 0;
      wm.position.set(x0, Y(28), -4);
      this.scene.add(wm);
      const colors = ['#c69578', '#b0a86b', '#ae8897', '#c4927d', '#b5ad82', '#7eada1'];
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
      this.biota.set('manta', this.addMover(manta, c.clone().add(new T.Vector3(0, 2, 0)), 9, 0.1, { bob: 1.2, tilt: 0.25 }));
      const tuna = new C.School(C.SPECIES.tuna, 34, new T.Vector3(8, 3, 5), 5);
      this.scene.add(tuna.group);
      this.biota.set('tuna', tuna.group);
      this.schools.push({ s: tuna, c: c.clone().add(new T.Vector3(0, -3, 0)), r: 12, sp: 0.22, y: 0 });
      for (let i = 0; i < 6; i++) {
        const j = C.jellyfish('#e8b5ff', false, 0.4);
        const jelly = this.addMover(j, c.clone().add(new T.Vector3((r() - 0.5) * 14, 2 + r() * 5, (r() - 0.5) * 10)), 0.4, 0.1, { bob: 0.8, face: false });
        if (i === 0) this.biota.set('ubur-biru', jelly);
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
      for (let i = 0; i < 4; i++) {
        const comb = this.addMover(C.combJelly(), c.clone().add(new T.Vector3((r() - 0.5) * 12, (r() - 0.5) * 6, (r() - 0.5) * 8)), 0.5, 0.1, { bob: 0.6, face: false });
        if (i === 0) this.biota.set('hewan-sisir', comb);
      }
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
      for (let i = 0; i < 4; i++) { const vent=this.place(blackSmoker(3 + r() * 3, U), x0 - 5 + i * 3.5, fy, -4 + (i % 2) * 2); if(i===1)this.biota.set('cerobong',vent); }
      for (let i = 0; i < 5; i++) { const worms=this.place(C.tubeWorms(18, i + 3), x0 - 4 + i * 2.2, fy + 0.1, 1 + (i % 2) * 1.5); if(i===2)this.biota.set('cacing-tabung',worms); }
      for (let i = 0; i < 12; i++) this.place(rock(0.5 + r() * 1.2, '#35302b', r), x0 + (r() - 0.5) * 30, fy, (r() - 0.5) * 30);
      for (let i = 0; i < 6; i++) this.addMover(C.crab(), new T.Vector3(x0 - 3 + i * 1.3, fy + 0.25, 2.5), 0.6, 0.15, { bob: 0, tilt: 0 });
      for (let i = 0; i < 14; i++) this.addMover(C.shrimp('#f4ece4', 1.3), new T.Vector3(x0 - 4 + r() * 8, fy + 0.8 + r(), -1 + r() * 3), 0.5 + r(), 0.4, { bob: 0.2 });
    }

    // --- dataran abisal (±3.800 m) ---
    {
      const x0 = SET_X.abisal,
        fy = Y(4500) - 1;
      const bed = seabed(70, '#6f6a62', U, 0, 0.12, 31);
      bed.position.set(x0, fy, 0);
      this.scene.add(bed);
      for (let i = 0; i < 10; i++) this.place(rock(0.3 + r() * 0.6, '#57524b', r), x0 + (r() - 0.5) * 30, fy, (r() - 0.5) * 30);
      for (let i = 0; i < 3; i++) { const fish=this.place(C.tripodFish(), x0 - 3 + i * 3.5, fy, -2 + (i % 2) * 3, 1.3, r() * 6); if(i===1)this.biota.set('ikan-tripod',fish); }
      for (let i = 0; i < 4; i++) { const cucumber=this.place(C.seaCucumber(), x0 - 2 + i * 2, fy + 0.1, 2 - (i % 2) * 3, 1.3, r() * 6); if(i===1)this.biota.set('teripang',cucumber); }
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
        const m = new T.Mesh(w, surfaceMaterial('#656561'));
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
      this.biota.set('amfipoda', this.place(C.amphipods(26), x0 + 2.5, fy + 0.05, 1.5, 1.4));
      for (let i = 0; i < 2; i++) this.place(C.seaCucumber(), x0 - 1.5 + i * 3, fy + 0.1, -1.5 + i * 2.5, 1.2, r() * 6);
    }

    // Challenger Deep is a separate habitat. No fish are placed at this depth.
    {
      const x0 = SET_X.challenger, fy = Y(10935)-1;
      const bed=seabed(100,'#9a9990',U,0,0.08,61);bed.position.set(x0,fy,0);this.scene.add(bed);
      this.place(C.amphipods(18),x0+2,fy+0.05,1.5,1.4);
      for(let i=0;i<8;i++) this.place(rock(0.2+r()*0.35,'#71746d',r),x0+(r()-0.5)*30,fy,(r()-0.5)*25);
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
      this.narration.pause();
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
    const c = new T.Vector3(SET_X.karang, depthToY(9), 0);
    this.sub.visible = false;
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
      this.home();
      return;
    }
    const obj = this.biota.get(id);
    if (!obj) return;
    this.follow = obj;
    const p = this.inspectionTarget(obj);
    const size: Record<string, number> = { 'hiu-karang': 2.4, barakuda: 2.6, 'penyu-hijau': 1.8, 'belut-gulper': 2, 'ikan-lentera': 2.2, 'ikan-badut': 0.55, 'kuda-laut': 1.15, 'ikan-kupu-kupu': 0.6, 'blue-tang': 0.65, lionfish: 0.9, pari: 1, 'cumi-cumi': 1.6, 'ikan-pemancing': 1.1 };
    const k = id === 'ikan-pemancing' ? (this.camera.aspect < 1 ? 1.9 : 1.5) : size[id] ?? 0.9;
    // kamera di depan-samping biota (menghadap wajahnya), mengikuti arah hadapnya
    const q = new T.Quaternion();
    obj.getWorldQuaternion(q);
    const yaw = new T.Euler().setFromQuaternion(q, 'YXZ').y;
    const off = (id === 'ikan-pemancing'
      ? new T.Vector3(1.25 * k, 0.65 * k + 0.2, 2.5 * k)
      : id === 'cumi-cumi' ? new T.Vector3(.8 * k, .55 * k, 2.5 * k)
      : id === 'kuda-laut' ? new T.Vector3(.3 * k, .35 * k, 2.65 * k)
      : new T.Vector3(2.0 * k, 0.7 * k + 0.2, 1.8 * k))
      .applyAxisAngle(new T.Vector3(0, 1, 0), obj.parent === this.scene ? yaw : 0);
    // Long arms and wide fans must remain visible in a portrait viewport, including while turning.
    if (['cumi-cumi', 'lionfish', 'kuda-laut'].includes(id)) off.multiplyScalar(Math.max(1, 1 / this.camera.aspect));
    this.flyTo(p.clone().add(off), p);
  }

  private inspectionTarget(obj: T.Object3D) {
    const target = this.worldPos(obj);
    // Leave room below the complete lure and tail for the animal information card.
    if (obj === this.biota.get('ikan-pemancing')) target.y -= 0.3;
    return target;
  }

  private worldPos(o: T.Object3D) {
    const sch = this.schools.find((s) => s.s.group === o);
    if (sch) return sch.c.clone().add(new T.Vector3(Math.cos(sch.y) * sch.r, 0, Math.sin(sch.y) * sch.r));
    return o.getWorldPosition(new T.Vector3());
  }

  go(i: number, sequential = false) {
    this.idx = Math.max(0, Math.min(TUR_LAUT.length - 1, i));
    this.jumped = !sequential;
    this.narration.load(TUR_LAUT[this.idx], sequential);
    this.lastNarrationSeconds = 0;
    this.snap = !sequential || this.reducedMotion || this.narration.source === 'rekaman';
    useLaut.setState({ stop: this.idx, progress: 0, line: 0, source: this.narration.source, finished: false, audioTime: this.narration.tick(0).time });
  }

  seekNarration(seconds: number) {
    if (!Number.isFinite(seconds)) return;
    const time = Math.max(0, Math.min(SEA_RECORDING.duration - 0.01, seconds));
    this.go(chapterAtTime(time));
    this.narration.seek(time);
    this.lastNarrationSeconds = this.narration.tick(0).seconds;
    this.snap = true;
    useLaut.setState({ audioTime: time });
  }

  setPlaying(on: boolean) {
    this.playing = on;
    if (on) { this.narration.play(); this.music.play(); }
    else { this.narration.pause(); this.music.pause(); }
    useLaut.setState({ playing: on });
  }
  setMuted(on: boolean) {
    this.narration.setMuted(on);
    useLaut.setState({ muted: on });
  }
  setView(view: 'cinema' | 'jendela') { useLaut.setState({ view }); }

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
    if (useLaut.getState().mode !== 'tur' || this.playing) this.uTime.value += dt;
    const t = this.uTime.value;
    const mode = useLaut.getState().mode;

    // biota bergerak
    for (const m of this.movers) {
      // Hold the inspected animal's swimming heading; fins and tentacles still move.
      // Adjust its orbit phase so releasing focus resumes from the same place without a jump.
      if (mode === 'jelajah' && this.follow === m.obj) m.ph -= dt * m.sp;
      const a = t * m.sp + m.ph;
      m.obj.position.set(m.c.x + Math.cos(a) * m.r, m.c.y + Math.sin(t * 0.7 + m.ph) * m.bob, m.c.z + Math.sin(a) * m.r);
      if (m.face && m.r > 0.05) {
        const dir = Math.sign(m.sp) || 1;
        m.obj.rotation.y = -a - (dir > 0 ? Math.PI / 2 : -Math.PI / 2);
        m.obj.rotation.z = (m.tilt ?? 0) * Math.sin(t * 0.8 + m.ph);
      }
    }
    for (const s of this.schools) {
      if (mode !== 'tur' || this.playing) s.y += dt * s.sp;
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
      const d = Math.round(mode === 'tur' ? this.tourDepth : yToDepth(this.camera.position.y));
      if (process.env.NODE_ENV === 'development') {
        const ui = useLaut.getState();
        Object.assign(this.renderer.domElement.dataset,{drawCalls:String(this.renderer.info.render.calls),triangles:String(this.renderer.info.render.triangles),fps:String(Math.round(1/Math.max(dt,0.001))),chapter:TUR_LAUT[ui.stop].id,shot:shotAtTime(TUR_LAUT[ui.stop].id,ui.audioTime)?.target ?? '',audioTime:String(ui.audioTime)});
      }
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
      const goalT = this.follow ? this.inspectionTarget(this.follow) : this.flyGoal.t;
      const goalP = this.follow ? goalT.clone().add(this.flyGoal.p.clone().sub(this.flyGoal.t)) : this.flyGoal.p;
      this.camera.position.lerpVectors(this.flyFrom.p, goalP, k);
      this.controls.target.lerpVectors(this.flyFrom.t, goalT, k);
    } else if (this.follow) {
      const tgt = this.inspectionTarget(this.follow);
      const d = tgt.sub(this.controls.target).multiplyScalar(Math.min(1, dt * 3));
      this.controls.target.add(d);
      this.camera.position.add(d);
    }
    this.controls.update();
  }

  /** Mode tur: timeline adegan, posisi penjelajah, kamera sinematik. */
  private stepTour(dt: number) {
    const s = TUR_LAUT[this.idx];
    const clock = this.narration.tick(this.playing ? dt : 0);
    if (this.playing && clock.ended) {
      if (this.idx < TUR_LAUT.length - 1) this.go(clock.source === 'rekaman' ? Math.max(this.idx + 1, chapterAtTime(clock.time)) : this.idx + 1, true);
      else { this.setPlaying(false); this.music.stop(2); useLaut.setState({ finished: true, progress: 1, audioTime: clock.time }); }
      return;
    }
    const p = clock.progress;
    const recorded = clock.source === 'rekaman';
    if (performance.now() - this.lastUi > 200) useLaut.setState({ progress: p, line: clock.line, source: clock.source, audioTime: clock.time, audioLoading: clock.loading });

    const i = this.idx;
    const prev = i > 0 && !this.jumped && !recorded ? anchor(i - 1) : anchor(i);
    const cur = anchor(i);
    const pos = new T.Vector3();
    const t = this.uTime.value;
    let standing = false;
    let deckRotation: T.Quaternion | null = null;
    if (s.id === 'persiapan') {
      const onDeck = deckPose(this.boat, this.diver.userData.sole, this.diver.scale, new T.Vector3(2, BOAT_DECK_Y, 0));
      pos.copy(onDeck.position);
      deckRotation = onDeck.rotation;
      standing = true;
    } else if (s.id === 'masuk-laut') {
      // berjalan ke tepi kapal → melompat (langkah lebar) → turun perlahan
      const timing = diveAtTime(recorded ? clock.seconds : p * 31);
      const { walk, jump, sink, standing: onBoat } = timing;
      if (onBoat) {
        const onDeck = deckPose(this.boat, this.diver.userData.sole, this.diver.scale, new T.Vector3(2, BOAT_DECK_Y, walk * 1.2));
        pos.copy(onDeck.position).lerp(new T.Vector3(2, -1, 3.2), jump * jump);
        pos.y += Math.sin(jump * Math.PI) * 1.1;
        deckRotation = onDeck.rotation;
        standing = true;
      } else pos.set(2 - sink * 1.5, -1 + (depthToY(4) + 1) * sink, 3.2 + sink);
      const seconds = recorded ? clock.seconds : p * 31;
      if (this.playing && seconds >= 5 && this.lastNarrationSeconds < 5) {
        this.splashT = 0; sfx.splash();
      }
    } else if (s.set === 'ringkasan') {
      // naik kembali ke permukaan melewati semua zona
      const k = smooth(p / 0.85);
      const path = [...TUR_LAUT.keys()].slice(2, -2).map(anchor).reverse();
      path.push(new T.Vector3(2, -1.5, 3.5));
      const f = k * (path.length - 1);
      const a = Math.floor(f),
        b = Math.min(path.length - 1, a + 1);
      pos.lerpVectors(path[a], path[b], f - a);
    } else {
      const k = recorded || this.jumped ? 1 : smooth(p / 0.28);
      pos.lerpVectors(prev, cur, k);
      // saat melayang, berenang pelan ke kiri-kanan
      pos.x += Math.sin(t * 0.3) * 0.35 * k;
      pos.y += Math.sin(t * 0.5) * 0.2;
    }
    this.tourDepth = s.set === 'ringkasan' ? Math.max(0,s.depth[0]*(1-smooth(p/0.85)))
      : s.id === 'masuk-laut' ? 4 * diveAtTime(recorded ? clock.seconds : p*31).sink
      : T.MathUtils.lerp(s.depth[0],s.depth[1],recorded || this.jumped ? 1 : smooth(p/0.28));
    this.lastNarrationSeconds = recorded ? clock.seconds : p*31;
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
    this.diver.visible = !inSub;
    this.sub.visible = inSub;
    this.diver.userData.setTorch?.(s.id === 'makin-redup' || s.id === 'batas-aman' ? 1 : 0);
    if (this.diver.visible) {
      this.diver.position.copy(pos);
      if (standing && deckRotation) this.diver.quaternion.copy(deckRotation);
      else this.diver.rotation.set(0, this.heading, Math.sin(t * 0.8) * 0.05 - this.dive * 0.35);
      this.diver.userData.stand?.(standing);
      this.diver.userData.update?.(t, standing ? 0 : 1);
    }
    if (inSub) {
      this.sub.position.copy(pos).add(new T.Vector3(0, 0.4, 0));
      this.sub.rotation.set(0, this.heading, Math.sin(t * 0.5) * 0.03 - this.dive * 0.15);
    } else this.placeSub(this.sub.position);
    this.sub.userData.setLights?.(inSub ? subLightAtTime(s.id, clock.time) : 0);

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
      off.set(4.2, 2.1, 6.8);
      lookAt.y += 0.2;
    } else if (s.id === 'masuk-laut') off.set(4, 1.2 + (p < 0.32 ? 0.8 : 0), 5.5);
    else if (s.set === 'karang' || s.set === 'lamun') {
      off.set(3, 2.4, 7);
      lookAt.lerp(new T.Vector3(SET_X[s.set], depthToY(s.set === 'karang' ? 9.6 : 17.5) + 1.2, 0), 0.35);
    } else if (s.set === 'dinding') {
      off.set(5.5, 0.8, 6.5);
      lookAt.lerp(new T.Vector3(pos.x - 2, pos.y, -3), 0.35);
    }
    else if (s.set === 'biru') off.set(3, 2, 11);
    else if (inSub) {
      off.set(1.2, 1.8, 10.5);
      lookAt.add(new T.Vector3(1.5, -0.4, 0));
      if (s.set === 'selesai') {
        off.set(3.6, 0.5, 1.6);
        lookAt.copy(pos).add(new T.Vector3(1.1, 0.45, 0));
      }
      if (s.set === 'ringkasan') off.set(8, 3, 14);
    }
    const timedShot = shotAtTime(s.id, clock.time);
    const subject = timedShot && this.biota.get(timedShot.target);
    if (timedShot && subject) {
      // In observation shots we look out from the expedition, with the animal unobstructed.
      this.sub.visible = false;
      this.diver.visible = false;
      const targetPosition = this.worldPos(subject);
      const portraitFit = this.camera.aspect < 1
        ? (timedShot.target === 'cumi-cumi' ? Math.max(1.25, .85 / this.camera.aspect) : 1.25) : 1;
      const distance = timedShot.distance * portraitFit;
      lookAt.copy(targetPosition);
      off.copy(targetPosition).add(new T.Vector3(distance*0.6,timedShot.elevation ?? distance*0.2,distance)).sub(pos);
    }
    if (s.id === 'masuk-laut' && clock.seconds >= 12 && clock.seconds < 21) {
      lookAt.copy(pos).add(new T.Vector3(0, 14, -2));
      off.set(2, 0.2, 5);
    }
    if (useLaut.getState().view === 'jendela' && inSub) {
      off.set(2.8,0.5,0.2); lookAt.copy(pos).add(new T.Vector3(9,-0.15,0));
      this.sub.visible=false;
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
    const f = 1 - Math.exp(-dt * (timedShot ? 4.5 : this.camRate));
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
    const shallow = new T.Color('#13788c'),
      mid = new T.Color('#0b3f6e'),
      deep = new T.Color('#010810');
    const fc = deep.clone().lerp(mid, clamp01(Math.pow(L, 0.35) * 1.2)).lerp(shallow, Math.pow(L, 1.4));
    if (under) {
      // kabut = warna horizon, jadi benda jauh menyatu dengan air; dangkal sedikit kehijauan, makin dalam makin pekat
      const hor = fc.clone().lerp(new T.Color('#197e83'), 0.35 * Math.pow(L, 2));
      this.fog.color.copy(hor);
      this.fog.density = 0.018 + (1 - L) * 0.018;
      this.scene.background = hor;
      const dm = this.deep.material as T.ShaderMaterial;
      dm.uniforms.uHor.value.copy(hor);
      dm.uniforms.uTop.value.copy(hor).lerp(new T.Color('#9fe3f2'), 0.85 * Math.pow(L, 1.2));
      dm.uniforms.uBot.value.copy(hor).multiplyScalar(0.6);
      dm.uniforms.uSun.value = Math.pow(L, 1.5);
      this.camera.far = 160;
    } else {
      this.fog.color.set('#cfe6f3');
      this.fog.density = 0.0012;
      this.scene.background = null;
      this.camera.far = 1500;
    }
    this.camera.updateProjectionMatrix();
    this.sky.visible = !under;
    this.deep.visible = under;
    this.deep.position.copy(this.camera.position);
    this.sun.intensity = under ? 2.4 * L : 2.6;
    this.hemi.intensity = under ? 0.15 + 1.1 * L : 1.1;
    this.hemi.color.set(under ? '#9fe0ff' : '#dff2ff');
    // cahaya lembut dari kamera supaya biota laut dalam tetap terlihat (tanpa menghapus suasana gelap)
    const ui = useLaut.getState();
    const lamp = ui.mode === 'tur' && TUR_LAUT[ui.stop].id === 'makin-redup'
      ? 0.12 + 0.88 * subLightAtTime('makin-redup', ui.audioTime) : 1;
    this.camLight.intensity = under ? (7 + (1 - L) * 19) * lamp : 0;
    this.scene.environmentIntensity = under ? 0.055 + L * 0.24 : 0.35;
    this.sun.castShadow = !under;
    if(!under) { this.sun.position.copy(this.camera.position).add(new T.Vector3(20,80,10));this.sun.target.position.copy(this.camera.position); }

    const sm = this.snow.material as T.ShaderMaterial;
    sm.uniforms.uCam.value.copy(this.camera.position);
    sm.uniforms.uAlpha.value = under ? 0.25 + (1 - L) * 0.45 : 0;
    this.snow.visible = under;
    for (const [i, r] of this.rays.entries()) {
      (r.material as T.ShaderMaterial).uniforms.uO.value = under ? 0.055 * clamp01(L * 1.6) : 0;
      r.rotation.z = 0.25 + Math.sin(t * 0.2 + i) * 0.05;
    }
    this.water.visible = d < 70;
    void dt;
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.narration.dispose();
    this.music.stop(0.3);
    this.ro.disconnect();
    this.controls.dispose();
    document.removeEventListener('visibilitychange',this.onVisibility);
    this.environment?.dispose();
    const textures = new Set<T.Texture>();
    this.scene.traverse((o) => {
      const m = o as T.Mesh;
      m.geometry?.dispose();
      const mt = m.material as T.Material | T.Material[] | undefined;
      for (const material of Array.isArray(mt) ? mt : mt ? [mt] : []) {
        for (const value of Object.values(material)) if(value instanceof T.Texture) textures.add(value);
        material.dispose();
      }
    });
    textures.forEach(t=>t.dispose());
    this.renderer.dispose();
    this.renderer.domElement.removeEventListener('pointerdown',this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointerup',this.onPointerUp);
    this.renderer.domElement.remove();
  }
}

export const BIOTA_IDS = BIOTA.map((b) => b.id);
