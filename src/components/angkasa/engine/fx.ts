// Efek visual tata surya untuk tampilan anak (dekoratif, bukan data ilmiah):
// langit galaksi, bintang berkelip & bintang jatuh, korona Matahari, sabuk asteroid,
// atmosfer bercahaya, jejak orbit memudar, ekor komet partikel, dan intro kamera sinematik.
// Jumlah partikel diturunkan otomatis di perangkat lemah (ctx.lowPower).

import * as THREE from "three";
import { LEARNING, orbitAngle } from "@/lib/angkasa/sim";
import { atmosphereMaterial, canvasTex, lumpyGeometry, rng, type Body } from "./bodies";
import type { EngineCtx } from "./core";

const TAU = Math.PI * 2;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------------- langit galaksi ---------------- */

/** Langit galaksi digambar di shader (noise halus): pita Bima Sakti + nebula warna, tanpa tekstur/sambungan. */
function sky(low: boolean) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uOct: { value: low ? 3 : 5 } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 vDir; uniform int uOct;
      float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float noise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
      float fbm(vec3 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 6; i++){ if (i >= uOct) break; v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
      void main(){
        vec3 d = normalize(vDir);
        // pita galaksi di sekitar bidang miring
        vec3 n = normalize(vec3(0.25, 1.0, 0.35));
        float band = exp(-pow(dot(d, n) / 0.34, 2.0));
        float cloud = fbm(d * 3.0 + 2.0);
        float fine = fbm(d * 9.0 - 5.0);
        float dust = smoothstep(0.45, 0.75, fbm(d * 6.0 + 11.0));
        vec3 purple = vec3(0.30, 0.16, 0.55), blue = vec3(0.10, 0.22, 0.55), pink = vec3(0.55, 0.18, 0.42), warm = vec3(0.55, 0.40, 0.25);
        vec3 col = mix(blue, purple, cloud);
        col = mix(col, pink, smoothstep(0.55, 0.8, fbm(d * 2.0 - 7.0)) * 0.6);
        col += warm * pow(band, 3.0) * 0.35;
        float glow = band * (0.35 + 0.65 * cloud) * (0.6 + 0.4 * fine) * (1.0 - dust * 0.6);
        // nebula lemah di luar pita
        float neb = smoothstep(0.58, 0.85, fbm(d * 1.6 + 30.0)) * 0.35;
        vec3 base = vec3(0.008, 0.01, 0.03);
        gl_FragColor = vec4(base + col * (glow * 1.5 + neb * 0.9), 1.0);
      }`,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1400, 48, 24), mat);
  mesh.renderOrder = -3;
  mesh.frustumCulled = false;
  mesh.name = "fx.sky";
  return mesh;
}

/* ---------------- bintang berkelip ---------------- */

function twinkleStars(count: number) {
  const r = rng(77);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = r() * 2 - 1;
    const th = r() * TAU;
    const s = Math.sqrt(1 - u * u);
    const R = 700 + r() * 300;
    pos.set([R * s * Math.cos(th), R * u, R * s * Math.sin(th)], i * 3);
    size[i] = 1.5 + Math.pow(r(), 3) * 4;
    phase[i] = r() * TAU;
    const warm = r();
    col.set([0.85 + warm * 0.15, 0.9, 1 - warm * 0.2], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio, 2) } },
    vertexShader: `attribute float aSize; attribute float aPhase; uniform float uTime; uniform float uPR; varying vec3 vC; varying float vA;
      void main(){ vC = color; float tw = 0.55 + 0.45 * sin(uTime * (1.2 + fract(aPhase) * 2.0) + aPhase * 7.0);
        vA = tw; gl_PointSize = aSize * uPR * (0.7 + 0.5 * tw); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ vec2 p = gl_PointCoord - 0.5; float d = length(p);
      float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC, a * vA); }`,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.renderOrder = -2;
  pts.frustumCulled = false;
  return { pts, mat };
}

/* ---------------- bintang jatuh ---------------- */

class ShootingStars {
  group = new THREE.Group();
  private items: { line: THREE.Line; vel: THREE.Vector3; life: number; age: number }[] = [];
  private wait = 2;
  private r = rng(5);
  constructor() {
    for (let i = 0; i < 2; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array([1, 1, 1, 0, 0, 0]), 3));
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      line.visible = false;
      line.frustumCulled = false;
      this.group.add(line);
      this.items.push({ line, vel: new THREE.Vector3(), life: 1, age: 1 });
    }
  }
  private spawn(it: (typeof this.items)[number], camera: THREE.Camera) {
    const r = this.r;
    // Muncul di depan kamera (arah pandang ± acak), jauh di belakang tata surya.
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const side = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
    const up = new THREE.Vector3().crossVectors(side, fwd).normalize();
    const start = camera.position
      .clone()
      .add(fwd.clone().multiplyScalar(260))
      .add(side.clone().multiplyScalar((r() - 0.5) * 320))
      .add(up.clone().multiplyScalar(40 + r() * 110));
    it.vel
      .copy(side)
      .multiplyScalar(r() < 0.5 ? -1 : 1)
      .add(up.clone().multiplyScalar(-0.45 - r() * 0.3))
      .normalize()
      .multiplyScalar(260 + r() * 140);
    it.line.position.copy(start);
    it.age = 0;
    it.life = 0.7 + r() * 0.5;
    it.line.visible = true;
  }
  update(dt: number, camera: THREE.Camera) {
    this.wait -= dt;
    if (this.wait <= 0) {
      const free = this.items.find((i) => !i.line.visible);
      if (free) this.spawn(free, camera);
      this.wait = 3 + this.r() * 5;
    }
    for (const it of this.items) {
      if (!it.line.visible) continue;
      it.age += dt;
      const k = it.age / it.life;
      if (k >= 1) {
        it.line.visible = false;
        continue;
      }
      it.line.position.addScaledVector(it.vel, dt);
      const tail = it.vel.clone().multiplyScalar(-0.12 * Math.min(1, k * 4));
      const p = it.line.geometry.getAttribute("position") as THREE.BufferAttribute;
      p.setXYZ(0, 0, 0, 0);
      p.setXYZ(1, tail.x, tail.y, tail.z);
      p.needsUpdate = true;
      (it.line.material as THREE.LineBasicMaterial).opacity = Math.sin(Math.PI * k);
    }
  }
}

/* ---------------- korona Matahari ---------------- */

function sunCorona(sun: Body) {
  const r = sun.radius;
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: canvasTex(256, 256, (g, w, h) => {
        const grad = g.createRadialGradient(w / 2, h / 2, w * 0.1, w / 2, h / 2, w / 2);
        grad.addColorStop(0, "rgba(255,200,110,0.55)");
        grad.addColorStop(0.35, "rgba(255,140,50,0.18)");
        grad.addColorStop(1, "rgba(255,110,30,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, w, h);
      }),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  halo.scale.setScalar(r * 8);
  const rays = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: canvasTex(512, 512, (g, w, h) => {
        const rr = rng(9);
        g.translate(w / 2, h / 2);
        g.globalCompositeOperation = "lighter";
        for (let i = 0; i < 48; i++) {
          const a = rr() * TAU;
          const len = w * (0.22 + rr() * 0.28);
          const wd = 2 + rr() * 6;
          g.save();
          g.rotate(a);
          const grad = g.createLinearGradient(0, 0, len, 0);
          grad.addColorStop(0, "rgba(255,210,140,0.35)");
          grad.addColorStop(1, "rgba(255,160,60,0)");
          g.fillStyle = grad;
          g.beginPath();
          g.moveTo(w * 0.08, -wd);
          g.lineTo(len, 0);
          g.lineTo(w * 0.08, wd);
          g.fill();
          g.restore();
        }
      }),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
    }),
  );
  rays.scale.setScalar(r * 6.5);
  halo.renderOrder = rays.renderOrder = -1;
  sun.axisFrame.add(halo, rays);
  return { halo, rays };
}

/* ---------------- sabuk asteroid ---------------- */

function asteroidBelt(count: number) {
  const r = rng(13);
  const geo = lumpyGeometry(7, 0.45, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0x8c8176, roughness: 1, metalness: 0, flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const inner = LEARNING.distance(2.15);
  const outer = LEARNING.distance(3.3);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const a = r() * TAU;
    const d = inner + (outer - inner) * Math.pow(r(), 0.8);
    p.set(Math.cos(a) * d, (r() - 0.5) * 0.7, -Math.sin(a) * d);
    e.set(r() * TAU, r() * TAU, r() * TAU);
    q.setFromEuler(e);
    const k = 0.012 + Math.pow(r(), 3) * 0.045;
    s.set(k, k * (0.6 + r() * 0.5), k);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.name = "fx.asteroidBelt";
  return mesh;
}

/* ---------------- atmosfer bercahaya ---------------- */

const GLOW: Record<string, [number, number]> = {
  mars: [0xff9a6a, 0.55],
  jupiter: [0xffd9a8, 0.5],
  saturn: [0xf5e2b0, 0.45],
  uranus: [0x9ff0ff, 0.7],
  neptune: [0x5a8cff, 0.7],
};

/* ---------------- ekor komet ---------------- */

class CometTail {
  pts: THREE.Points;
  private pos: Float32Array;
  private col: Float32Array;
  private vel: Float32Array;
  private age: Float32Array;
  private life: Float32Array;
  private r = rng(31);
  private tmp = new THREE.Vector3();
  constructor(
    private comet: Body,
    private n: number,
  ) {
    this.pos = new Float32Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.age = new Float32Array(n).map(() => this.r() * 2);
    this.life = new Float32Array(n).map(() => 1.2 + this.r() * 1.4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(this.col, 3));
    const dot = canvasTex(64, 64, (g, w, h) => {
      const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    });
    this.pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.09,
        map: dot,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.pts.frustumCulled = false;
    this.pts.name = "fx.cometTail";
  }
  update(dt: number) {
    const c = this.comet.orbitAnchor.getWorldPosition(this.tmp);
    // Ekor selalu menjauhi Matahari (di titik asal).
    const away = c.clone().normalize();
    for (let i = 0; i < this.n; i++) {
      this.age[i] += dt;
      const j = i * 3;
      if (this.age[i] >= this.life[i]) {
        this.age[i] = 0;
        this.pos[j] = c.x + (this.r() - 0.5) * 0.08;
        this.pos[j + 1] = c.y + (this.r() - 0.5) * 0.08;
        this.pos[j + 2] = c.z + (this.r() - 0.5) * 0.08;
        const sp = 0.9 + this.r() * 1.1;
        this.vel[j] = away.x * sp + (this.r() - 0.5) * 0.25;
        this.vel[j + 1] = away.y * sp + (this.r() - 0.5) * 0.25;
        this.vel[j + 2] = away.z * sp + (this.r() - 0.5) * 0.25;
      }
      this.pos[j] += this.vel[j] * dt;
      this.pos[j + 1] += this.vel[j + 1] * dt;
      this.pos[j + 2] += this.vel[j + 2] * dt;
      const f = Math.max(0, 1 - this.age[i] / this.life[i]);
      this.col[j] = 0.55 * f;
      this.col[j + 1] = 0.8 * f;
      this.col[j + 2] = 1.0 * f;
    }
    this.pts.geometry.getAttribute("position").needsUpdate = true;
    this.pts.geometry.getAttribute("color").needsUpdate = true;
  }
}

/* ---------------- gabungan ---------------- */

export class SolarFx {
  private objs: THREE.Object3D[] = [];
  private disposables: { dispose(): void }[] = [];
  private stars: ReturnType<typeof twinkleStars>;
  private shooting = new ShootingStars();
  private corona: ReturnType<typeof sunCorona> | null = null;
  private belt: THREE.InstancedMesh;
  private tail: CometTail | null = null;
  private trails: { mat: THREE.ShaderMaterial; body: Body }[] = [];
  private time = 0;
  /* intro kamera */
  private introT = 0;
  private introDur = 5;
  introDone = false;

  constructor(
    private scene: THREE.Scene,
    private bodies: Map<string, Body>,
    private ctx: EngineCtx,
    orbits: THREE.Object3D[],
  ) {
    const low = ctx.lowPower;
    // Latar bintang lama disembunyikan; diganti langit galaksi + bintang berkelip.
    const old = scene.getObjectByName("starfield");
    if (old) old.visible = false;
    const s = sky(low);
    this.stars = twinkleStars(low ? 500 : 1100);
    this.belt = asteroidBelt(low ? 450 : 1100);
    this.add(s, this.stars.pts, this.shooting.group, this.belt);

    const sun = bodies.get("sun");
    if (sun) this.corona = sunCorona(sun);

    for (const [id, [color, strength]] of Object.entries(GLOW)) {
      const b = bodies.get(id);
      if (!b) continue;
      const geo = new THREE.SphereGeometry(1.1, 48, 32);
      const mat = atmosphereMaterial(new THREE.Color(color), { value: new THREE.Vector3() }, strength);
      const atm = new THREE.Mesh(geo, mat);
      atm.scale.setScalar(b.radius);
      atm.name = `${id}.fxGlow`;
      b.axisFrame.add(atm);
      this.disposables.push(geo, mat);
    }

    const comet = bodies.get("comet-example");
    if (comet) {
      this.tail = new CometTail(comet, low ? 140 : 280);
      this.add(this.tail.pts);
    }

    // Jejak orbit: terang tepat di belakang planet, memudar ke depan.
    for (const o of orbits) {
      const id = o.userData.orbitOf as string | undefined;
      const body = id ? bodies.get(id) : undefined;
      const line = o as THREE.LineLoop;
      if (!body || !line.geometry) continue;
      const geo = line.geometry;
      const n = geo.getAttribute("position").count;
      geo.setAttribute("aT", new THREE.BufferAttribute(new Float32Array(n).map((_, i) => i / n), 1));
      const old = line.material as THREE.LineBasicMaterial;
      const mat = new THREE.ShaderMaterial({
        uniforms: { uAngle: { value: 0 }, uColor: { value: old.color.clone() }, uBase: { value: old.opacity } },
        vertexShader: `attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uAngle; uniform vec3 uColor; uniform float uBase; varying float vT;
          void main(){ float a = vT * 6.2831853; float d = mod(uAngle - a + 12.5663706, 6.2831853);
            float trail = exp(-d * 1.4); gl_FragColor = vec4(mix(uColor, vec3(1.0), trail * 0.5), uBase * 0.35 + trail * 0.85); }`,
        transparent: true,
        depthWrite: false,
      });
      line.material = mat;
      this.disposables.push(old, mat);
      this.trails.push({ mat, body });
    }
  }

  private add(...o: THREE.Object3D[]) {
    for (const x of o) {
      this.scene.add(x);
      this.objs.push(x);
    }
  }

  /** Intro: kamera meluncur dari jauh ke tampilan tata surya. true selama intro berjalan. */
  intro(dt: number, camera: THREE.PerspectiveCamera, cancel: boolean) {
    if (this.introDone) return false;
    if (cancel || this.ctx.reducedMotion()) {
      this.introDone = true;
      this.ctx.controls.enabled = true;
      return false;
    }
    this.introT = Math.min(1, this.introT + dt / this.introDur);
    const k = ease(this.introT);
    const end = new THREE.Vector3(0, 26, 46);
    const start = new THREE.Vector3(0, 180, 420);
    const pos = start.lerp(end, k);
    // Sedikit memutar mengelilingi Matahari sambil turun.
    pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), (1 - k) * 0.35);
    camera.position.copy(pos);
    this.ctx.controls.target.set(0, 0, 0);
    this.ctx.controls.enabled = false;
    if (this.introT >= 1) {
      this.introDone = true;
      this.ctx.controls.enabled = true;
    }
    return !this.introDone;
  }

  update(dt: number, camera: THREE.Camera, days: number) {
    this.time += dt;
    this.stars.mat.uniforms.uTime.value = this.time;
    this.shooting.update(dt, camera);
    if (this.corona) {
      const p = 1 + Math.sin(this.time * 0.6) * 0.04;
      this.corona.halo.scale.setScalar(this.bodies.get("sun")!.radius * 8 * p);
      this.corona.rays.material.rotation = this.time * 0.01;
      this.corona.rays.material.opacity = 0.65 + Math.sin(this.time * 0.9) * 0.15;
    }
    // Sabuk asteroid mengorbit pelan (periode ±4,6 tahun, sama arahnya dengan planet).
    this.belt.rotation.y = (days / 1680) * TAU;
    this.tail?.update(dt);
    for (const t of this.trails) t.mat.uniforms.uAngle.value = ((orbitAngle(t.body.obj, days) % TAU) + TAU) % TAU;
  }

  dispose() {
    for (const o of this.objs) {
      this.scene.remove(o);
      o.traverse((x) => {
        const m = x as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((q) => q.dispose());
        else if (mat) {
          (mat as THREE.MeshBasicMaterial).map?.dispose();
          mat.dispose();
        }
      });
    }
    this.disposables.forEach((d) => d.dispose());
    this.ctx.controls.enabled = true;
  }
}
