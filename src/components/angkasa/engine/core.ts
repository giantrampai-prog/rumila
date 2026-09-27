// Inti mesin 3D Jelajah Angkasa: satu renderer dipakai bergantian oleh beberapa "view" (scene per skala).
// Tanggung jawab: loop, jam simulasi, kontrol kamera, fly-to yang bisa dibatalkan, picking tap vs drag,
// label mengikuti anchor (dengan occlusion & anti-tabrakan), cache tekstur, context loss, dispose.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SimClock } from "@/lib/angkasa/sim";

export interface LabelSpec {
  id: string;
  text: string;
  /** posisi dunia anchor (dihitung ulang tiap frame setelah seluruh transform) */
  world: (out: THREE.Vector3) => THREE.Vector3;
  /** makin besar makin diprioritaskan saat bertabrakan */
  priority: number;
  /** label boleh diklik untuk memilih objek/bagian ini */
  pickId?: string;
  kind?: "object" | "part" | "note" | "marker";
  /** jangan disembunyikan walau tertutup (mis. penanda) */
  alwaysVisible?: boolean;
}

export interface ControlsConfig {
  enableRotate?: boolean;
  enablePan?: boolean;
  enableZoom?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export interface EngineCtx {
  renderer: THREE.WebGLRenderer;
  clock: SimClock;
  loadTexture: (
    url: string,
    opts?: { color?: boolean },
  ) => Promise<THREE.Texture>;
  flyTo: (
    pos: THREE.Vector3,
    target: THREE.Vector3,
    ms?: number,
  ) => Promise<boolean>;
  /** setengah sudut pandang efektif (memperhitungkan panel yang menutupi viewer) */
  fitHalfFov: () => number;
  controls: OrbitControls;
  reducedMotion: () => boolean;
  lowPower: boolean;
  /** beri tahu UI ada perubahan status aset */
  assetStatus: (key: string, status: "loading" | "ready" | "error") => void;
}

export interface View {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  controlsConfig: ControlsConfig;
  /** dipanggil sekali saat view aktif */
  start(ctx: EngineCtx): void;
  update(dt: number, ctx: EngineCtx): void;
  /** mesh yang bisa dipilih: userData.pickId atau userData.proxyFor */
  pickables(): THREE.Object3D[];
  /** mesh padat yang bisa menutupi label */
  occluders(): THREE.Object3D[];
  labels(): LabelSpec[];
  onResize?(w: number, h: number): void;
  /** render tambahan (mis. inset) setelah render utama */
  afterRender?(renderer: THREE.WebGLRenderer): void;
  dispose(): void;
}

export type EngineStatus = "ok" | "no-webgl" | "context-lost";

export interface EngineCallbacks {
  onPick: (id: string) => void;
  onStatus: (s: EngineStatus) => void;
  onAsset: (key: string, status: "loading" | "ready" | "error") => void;
  /** input pengguna membatalkan tur kamera */
  onUserInput?: () => void;
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export class AngkasaEngine {
  readonly clock = new SimClock();
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  private view: View | null = null;
  private raf = 0;
  private last = 0;
  private width = 1;
  private height = 1;
  private textures = new Map<string, Promise<THREE.Texture>>();
  private ownedTextures = new Set<THREE.Texture>();
  private flight: {
    token: number;
    from: [THREE.Vector3, THREE.Vector3];
    to: [THREE.Vector3, THREE.Vector3];
    t0: number;
    ms: number;
    done: (ok: boolean) => void;
  } | null = null;
  private flightToken = 0;
  private labelEls = new Map<string, HTMLButtonElement>();
  private ray = new THREE.Raycaster();
  private down: {
    x: number;
    y: number;
    id: number;
    cancelled: boolean;
  } | null = null;
  private pointers = new Set<number>();
  private ctx!: EngineCtx;
  private frameTimes: number[] = [];
  private dprCap = 2;
  private resizeObs: ResizeObserver | null = null;
  reducedMotion = false;
  paused = false;

  constructor(
    private host: HTMLDivElement,
    private labelLayer: HTMLDivElement,
    private cb: EngineCallbacks,
  ) {}

  init(): boolean {
    if (!webglAvailable()) {
      this.cb.onStatus("no-webgl");
      return false;
    }
    const lowPower =
      typeof navigator !== "undefined" &&
      ((navigator.hardwareConcurrency ?? 8) <= 4 ||
        /Android|iPhone|iPad/i.test(navigator.userAgent));
    this.dprCap = lowPower ? 1.5 : 2;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.dprCap));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setClearColor(0x05070f, 1);
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.touchAction = "none";
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.host.appendChild(this.renderer.domElement);

    const cam = new THREE.PerspectiveCamera(45, 1, 0.01, 5000);
    this.controls = new OrbitControls(cam, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.addEventListener("start", () => {
      // Input baru membatalkan fly-to yang sedang berjalan.
      if (this.flight) this.cancelFlight();
      this.cb.onUserInput?.();
    });

    const el = this.renderer.domElement;
    el.addEventListener("webglcontextlost", this.onContextLost, false);
    el.addEventListener("webglcontextrestored", this.onContextRestored, false);
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("pointercancel", this.onPointerCancel);

    this.ctx = {
      renderer: this.renderer,
      clock: this.clock,
      loadTexture: (url, opts) => this.loadTexture(url, opts),
      flyTo: (pos, target, ms) => this.flyTo(pos, target, ms),
      fitHalfFov: () => this.fitHalfFov(),
      controls: this.controls,
      reducedMotion: () => this.reducedMotion,
      lowPower,
      assetStatus: (k, s) => this.cb.onAsset(k, s),
    };

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(this.host);
    this.resize();
    document.addEventListener("visibilitychange", this.onVisibility);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
    this.cb.onStatus("ok");
    return true;
  }

  /* ---------------- view ---------------- */

  setView(view: View) {
    this.cancelFlight();
    if (this.view) {
      this.view.dispose();
    }
    this.view = view;
    this.controls.object = view.camera;
    const c = view.controlsConfig;
    this.controls.enableRotate = c.enableRotate ?? true;
    this.controls.enablePan = c.enablePan ?? false;
    this.controls.enableZoom = c.enableZoom ?? true;
    this.controls.minDistance = c.minDistance ?? 0.1;
    this.controls.maxDistance = c.maxDistance ?? 500;
    this.controls.minPolarAngle = c.minPolarAngle ?? 0;
    this.controls.maxPolarAngle = c.maxPolarAngle ?? Math.PI;
    view.start(this.ctx);
    view.onResize?.(this.width, this.height);
    this.resizeCamera();
    this.controls.update();
    // bersihkan label view lama
    for (const [, el] of this.labelEls) el.remove();
    this.labelEls.clear();
  }

  getView() {
    return this.view;
  }

  getCtx() {
    return this.ctx;
  }

  /* ---------------- loop ---------------- */

  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    if (!this.view || this.paused) return;
    this.clock.tick(dt);
    this.stepFlight(now);
    this.view.update(dt, this.ctx);
    this.controls.update();
    this.renderer.setScissorTest(false);
    this.renderer.setViewport(0, 0, this.width, this.height);
    this.renderer.render(this.view.scene, this.view.camera);
    this.view.afterRender?.(this.renderer);
    this.updateLabels();
    this.adaptQuality(dt);
  };

  /** Kualitas adaptif: turunkan pixel ratio bila fps rendah terus-menerus. */
  private adaptQuality(dt: number) {
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 90) return;
    const avg =
      this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes = [];
    const pr = this.renderer.getPixelRatio();
    if (avg > 1 / 28 && pr > 1) {
      this.renderer.setPixelRatio(Math.max(1, pr - 0.25));
      this.resize();
    }
  }

  /** fps rata-rata terbaru (untuk laporan performa) */
  measureFps(ms = 2000): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0;
      const t0 = performance.now();
      const step = () => {
        frames++;
        if (performance.now() - t0 < ms) requestAnimationFrame(step);
        else resolve((frames * 1000) / (performance.now() - t0));
      };
      requestAnimationFrame(step);
    });
  }

  private onVisibility = () => {
    // Tab tersembunyi: hentikan loop; saat kembali, langkah waktu dibatasi (tidak ada loncatan).
    this.paused = document.visibilityState !== "visible";
    this.last = performance.now();
  };

  /* ---------------- ukuran ---------------- */

  private resize() {
    const w = Math.max(1, this.host.clientWidth);
    const h = Math.max(1, this.host.clientHeight);
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = w + "px";
    this.renderer.domElement.style.height = h + "px";
    this.resizeCamera();
    this.view?.onResize?.(w, h);
  }

  /** Lebar (px) viewer yang tertutup panel mengambang kiri/kanan: objek dipusatkan di area yang terlihat. */
  private inset = { left: 0, right: 0 };
  setFrameInset(left: number, right: number) {
    if (left === this.inset.left && right === this.inset.right) return;
    this.inset = { left, right };
    this.resizeCamera();
  }

  /** Setengah sudut pandang efektif untuk membingkai objek (area terlihat, bukan seluruh kanvas). */
  fitHalfFov() {
    const cam = this.view?.camera;
    if (!(cam instanceof THREE.PerspectiveCamera)) return (45 * Math.PI) / 360;
    const v = (cam.fov * Math.PI) / 360;
    const freeW = Math.max(
      120,
      this.width - this.inset.left - this.inset.right,
    );
    const h = Math.atan(Math.tan(v) * (freeW / Math.max(1, this.height)));
    return Math.min(v, h);
  }

  private resizeCamera() {
    const cam = this.view?.camera;
    if (!cam) return;
    const aspect = this.width / this.height;
    if (cam instanceof THREE.PerspectiveCamera) {
      cam.aspect = aspect;
      const shift = (this.inset.left - this.inset.right) / 2;
      if (shift && this.width > 0)
        cam.setViewOffset(
          this.width,
          this.height,
          -shift,
          0,
          this.width,
          this.height,
        );
      else cam.clearViewOffset();
    } else {
      const hh = (cam.top - cam.bottom) / 2;
      cam.left = -hh * aspect;
      cam.right = hh * aspect;
    }
    cam.updateProjectionMatrix();
  }

  size() {
    return { width: this.width, height: this.height };
  }

  /* ---------------- tekstur ---------------- */

  loadTexture(
    url: string,
    opts: { color?: boolean } = {},
  ): Promise<THREE.Texture> {
    const key = url + (opts.color === false ? "#linear" : "");
    const hit = this.textures.get(key);
    if (hit) return hit;
    this.cb.onAsset(url, "loading");
    const p = new Promise<THREE.Texture>((resolve, reject) => {
      new THREE.TextureLoader().load(
        url,
        (t) => {
          t.colorSpace =
            opts.color === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
          t.anisotropy = Math.min(
            8,
            this.renderer.capabilities.getMaxAnisotropy(),
          );
          this.ownedTextures.add(t);
          this.cb.onAsset(url, "ready");
          resolve(t);
        },
        undefined,
        () => {
          this.textures.delete(key); // izinkan coba lagi
          this.cb.onAsset(url, "error");
          reject(new Error("Gagal memuat " + url));
        },
      );
    });
    this.textures.set(key, p);
    return p;
  }

  /* ---------------- fly-to ---------------- */

  flyTo(pos: THREE.Vector3, target: THREE.Vector3, ms = 900): Promise<boolean> {
    this.cancelFlight();
    const cam = this.view!.camera;
    const token = ++this.flightToken;
    if (this.reducedMotion || ms <= 0) {
      cam.position.copy(pos);
      this.controls.target.copy(target);
      this.controls.update();
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      this.flight = {
        token,
        from: [cam.position.clone(), this.controls.target.clone()],
        to: [pos.clone(), target.clone()],
        t0: performance.now(),
        ms,
        done: resolve,
      };
    });
  }

  /** Target fly-to bisa bergerak (objek sedang mengorbit): perbarui tujuan tanpa memulai ulang. */
  retargetFlight(pos: THREE.Vector3, target: THREE.Vector3) {
    if (!this.flight) return;
    this.flight.to[0].copy(pos);
    this.flight.to[1].copy(target);
  }

  isFlying() {
    return !!this.flight;
  }

  cancelFlight() {
    if (!this.flight) return;
    const f = this.flight;
    this.flight = null;
    f.done(false);
  }

  private stepFlight(now: number) {
    const f = this.flight;
    if (!f || !this.view) return;
    const t = Math.min(1, (now - f.t0) / f.ms);
    const k = easeInOut(t);
    this.view.camera.position.lerpVectors(f.from[0], f.to[0], k);
    this.controls.target.lerpVectors(f.from[1], f.to[1], k);
    if (t >= 1) {
      this.flight = null;
      f.done(true);
    }
  }

  /* ---------------- picking: tap vs drag ---------------- */

  private onPointerDown = (e: PointerEvent) => {
    this.pointers.add(e.pointerId);
    if (this.pointers.size > 1) {
      // pinch/multi-touch membatalkan pemilihan
      if (this.down) this.down.cancelled = true;
      return;
    }
    this.down = {
      x: e.clientX,
      y: e.clientY,
      id: e.pointerId,
      cancelled: false,
    };
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.down || this.down.id !== e.pointerId) return;
    if (Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 6)
      this.down.cancelled = true;
  };

  private onPointerUp = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    const d = this.down;
    this.down = null;
    if (!d || d.cancelled || d.id !== e.pointerId) return;
    const id = this.pickAt(e.clientX, e.clientY);
    if (id) this.cb.onPick(id);
  };

  private onPointerCancel = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    this.down = null;
  };

  /** Kembalikan id objek/bagian di titik layar; objek terlihat terdepan menang atas proxy di belakangnya. */
  pickAt(clientX: number, clientY: number): string | null {
    if (!this.view) return null;
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - r.left) / r.width) * 2 - 1,
      -((clientY - r.top) / r.height) * 2 + 1,
    );
    this.ray.setFromCamera(ndc, this.view.camera);
    const hits = this.ray.intersectObjects(this.view.pickables(), true);
    for (const h of hits) {
      let o: THREE.Object3D | null = h.object;
      while (o) {
        if (o.userData.pickId) return o.userData.pickId as string;
        if (o.userData.proxyFor) return o.userData.proxyFor as string;
        o = o.parent;
      }
    }
    return null;
  }

  /* ---------------- label ---------------- */

  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();

  private updateLabels() {
    const view = this.view!;
    const specs = view.labels();
    const cam = view.camera;
    const occluders = view.occluders();
    const seen = new Set<string>();
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const camPos = cam.getWorldPosition(this.tmp2);
    const sorted = [...specs].sort((a, b) => b.priority - a.priority);

    for (const s of sorted) {
      seen.add(s.id);
      let el = this.labelEls.get(s.id);
      if (!el) {
        el = document.createElement("button");
        el.type = "button";
        el.className = "ak-label";
        el.dataset.kind = s.kind ?? "object";
        el.dataset.id = s.id;
        el.tabIndex = -1; // navigasi keyboard lewat daftar, bukan label melayang
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          const pid = el!.dataset.pick;
          if (pid) this.cb.onPick(pid);
        });
        this.labelLayer.appendChild(el);
        this.labelEls.set(s.id, el);
      }
      if (el.textContent !== s.text) el.textContent = s.text;
      if (s.pickId) el.dataset.pick = s.pickId;
      else delete el.dataset.pick;

      const world = s.world(this.tmp.set(0, 0, 0));
      const p = world.clone().project(cam);
      const behind = p.z > 1 || p.z < -1;
      const x = ((p.x + 1) / 2) * this.width;
      const y = ((1 - p.y) / 2) * this.height;
      let visible =
        !behind &&
        x > -40 &&
        x < this.width + 40 &&
        y > -20 &&
        y < this.height + 20;

      // occlusion: anchor tertutup benda padat
      if (visible && !s.alwaysVisible && occluders.length) {
        const dir = world.clone().sub(camPos);
        const dist = dir.length();
        this.ray.set(camPos, dir.normalize());
        this.ray.far = dist - 0.02;
        const hit = this.ray.intersectObjects(occluders, false)[0];
        this.ray.far = Infinity;
        if (hit) visible = false;
      }
      // anti-tabrakan (lebar perkiraan)
      if (visible) {
        const w = Math.min(180, s.text.length * 7.2 + 18);
        const box = { x: x - 4, y: y - 12, w, h: 24 };
        if (
          placed.some(
            (b) =>
              box.x < b.x + b.w &&
              box.x + box.w > b.x &&
              box.y < b.y + b.h &&
              box.y + box.h > b.y,
          )
        )
          visible = false;
        else placed.push(box);
      }
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      el.style.opacity = visible ? "1" : "0";
      el.style.pointerEvents = visible && s.pickId ? "auto" : "none";
    }
    for (const [id, el] of this.labelEls) {
      if (!seen.has(id)) {
        el.remove();
        this.labelEls.delete(id);
      }
    }
  }

  /* ---------------- context loss & dispose ---------------- */

  private onContextLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(this.raf);
    this.cb.onStatus("context-lost");
  };

  private onContextRestored = () => {
    // Tekstur harus diunggah ulang: kosongkan cache agar view memuat lagi.
    this.textures.clear();
    this.cb.onStatus("ok");
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
    if (this.view) {
      const v = this.view;
      this.view = null;
      this.setView(v);
    }
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.cancelFlight();
    this.resizeObs?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    const el = this.renderer?.domElement;
    if (el) {
      el.removeEventListener("webglcontextlost", this.onContextLost);
      el.removeEventListener("webglcontextrestored", this.onContextRestored);
      el.removeEventListener("pointerdown", this.onPointerDown);
      el.removeEventListener("pointermove", this.onPointerMove);
      el.removeEventListener("pointerup", this.onPointerUp);
      el.removeEventListener("pointercancel", this.onPointerCancel);
    }
    this.view?.dispose();
    this.view = null;
    this.controls?.dispose();
    for (const t of this.ownedTextures) t.dispose();
    this.ownedTextures.clear();
    this.textures.clear();
    for (const [, l] of this.labelEls) l.remove();
    this.labelEls.clear();
    this.renderer?.dispose();
    el?.remove();
  }
}

/** Dispose semua geometri & material milik sebuah subtree (tekstur cache engine TIDAK di-dispose di sini). */
export function disposeTree(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose();
  });
}
