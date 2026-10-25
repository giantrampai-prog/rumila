// Tampilan 3D Rinoya Resto di hook perempatan kota. Bangunan & interior mengikuti desain pemilik (building.ts,
// denah di layout.ts). Saat buka, pelanggan (warna per segmen) datang dari trotoar, naik tangga, antre di kasir,
// duduk, makanan muncul di meja, makan, lalu pulang; koki bekerja di dapur terbuka, pelayan mengantar, petugas
// kebersihan membersihkan meja. Saat dibangun, dinding naik bertahap. Atap memudar saat kamera mendekat.

import * as T from 'three';
import { MENUS } from '@/lib/resto/data';
import type { DayRun, RestoState } from '@/lib/resto/sim';
import { setTrafficLevel, sfx, startTraffic, stopTraffic } from '@/lib/sfx';
import { City } from './city';
import { buildSite, type Site } from './site';
import { buildResto } from './building';
import { AISLE_Z, BLD, CHAIRS, COUNTER, PASS_Z, QUEUE_X, ROOMS, SIDEWALK_IN, STATIONS, groundY, route } from './layout';
import { navFromScene, type NavGrid } from './nav';
import { buildProgress } from '@/lib/resto/sim';
import { buildRealSky } from '@/components/fruits/garden/sky';
import { disposePerson, lookFor, makePerson, posePerson } from './people';

const _sunOff = new T.Vector3(24, 48, 30);
const _ray = new T.Raycaster();
const _ndc = new T.Vector2();
const _ground = new T.Plane(new T.Vector3(0, 1, 0), 0);
/** Tinggi mata orang dewasa di atas lantai (pandangan orang). */
const EYE_H = 1.6;


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

/** Satu orang yang berjalan mengikuti rute (lewat pintu, lorong) lalu berdiri/duduk. */
interface Member {
  obj: T.Group;
  path: T.Vector3[];
  delay: number;
  /** titik yang dihadap saat duduk (tengah meja); null = berdiri */
  face: T.Vector3 | null;
  /** sedang makan (menyuap) */
  eat?: boolean;
  /** staf yang bekerja di tempatnya saat diam (koki memasak, kasir melayani) */
  work?: boolean;
  /** arah hadap saat diam di tempat kerja (radian); koki menghadap kompor, kasir menghadap pelanggan */
  rest?: number;
}

/** Tinggi dudukan kursi makan di atas lantai (building.ts: papan 0.42 + bantal). */
const SEAT_H = 0.5;

interface Actor {
  members: Member[];
  key: string;
  food: T.Sprite[];
  bubble: T.Sprite | null;
}

export class RestoScene {
  private renderer: T.WebGLRenderer;
  private scene = new T.Scene();
  private camera = new T.PerspectiveCamera(40, 1, 0.1, 900);
  private ro: ResizeObserver;
  private raf = 0;
  private last = performance.now();
  private t = 0;
  private yaw = 0.55;
  private pitch = 0.95;
  private dist = 32;
  private target = new T.Vector3(-7, 1, -4);
  private sun!: T.DirectionalLight;
  private sky: T.Object3D | null = null;
  private uTime = { value: 0 };
  static readonly MIN_D = 7;
  static readonly MAX_D = 160;
  private drag: { x: number; y: number } | null = null;
  private pinch = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  /** pandangan orang (ikon diseret ke lantai): kamera di mata, geser = menoleh, ketuk lantai = berjalan */
  private pov: { pos: T.Vector3; path: T.Vector3[]; yaw: number; pitch: number; fov: number } | null = null;
  private povMark: T.Mesh;
  private tapAt: { x: number; y: number; moved: number } | null = null;
  /** dipanggil saat pandangan orang dimulai/selesai (untuk tombol di layar) */
  onPov: ((on: boolean) => void) | null = null;

  private shell = new T.Group(); // dinding, lantai, atap: dibangun ulang saat keadaan berubah
  private dyn = new T.Group(); // alat, meja, dekorasi
  private people = new T.Group();
  private personMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 });
  private actors = new Map<number, Actor>();
  private staffActors = new Map<string, Actor>();
  private buildK = 0;
  private key = '';
  private textures: T.Texture[] = [];
  private lanterns: T.Object3D[] = [];
  private greet: T.Texture;
  private city: City | null = null;
  private cityLoc = '';
  private site: Site | null = null;
  private lastK = -1;
  private lastLeft = -1;
  /** kisi jalur (dibangun ulang bersama geometri) */
  private nav: NavGrid | null = null;

  private tablePos: T.Vector3[] = [];
  private roofMats: T.Material[] = [];
  private roofK = 1;
  private showRoof = true;
  /** pengali kecepatan jalan mengikuti kecepatan jam game (1×/2×) */
  private walkK = 1;

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
    this.scene.fog = new T.Fog('#d4e2ec', 140, 520);
    const hemi = new T.HemisphereLight('#fff6e8', '#7a9a6a', 1.1);
    const sun = new T.DirectionalLight('#fff1d8', 2.2);
    sun.position.set(24, 48, 30);
    this.sun = sun;
    this.sky = buildRealSky(new T.Vector3(24, 48, 30).normalize(), this.uTime);
    this.scene.add(this.sky, sun.target);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    const sc = sun.shadow.camera as T.OrthographicCamera;
    sc.left = sc.bottom = -30;
    sc.right = sc.top = 30;
    sc.far = 160;
    sun.shadow.mapSize.set(2048, 2048);
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
    // penanda lingkaran di lantai saat ikon orang diseret / tujuan berjalan
    this.povMark = new T.Mesh(
      new T.RingGeometry(0.28, 0.42, 32).rotateX(-Math.PI / 2),
      new T.MeshBasicMaterial({ color: '#ffb02e', transparent: true, opacity: 0.9, depthWrite: false }),
    );
    this.povMark.visible = false;
    this.povMark.renderOrder = 5;
    this.scene.add(this.povMark);

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => {
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.drag = { x: e.clientX, y: e.clientY };
      this.tapAt = this.pointers.size === 1 ? { x: e.clientX, y: e.clientY, moved: 0 } : null;
    });
    el.addEventListener('pointermove', (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      if (this.pointers.size >= 2) {
        p.x = e.clientX;
        p.y = e.clientY;
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (this.pinch) {
          if (this.pov) this.pov.fov = T.MathUtils.clamp(this.pov.fov * (this.pinch / d), 35, 95);
          else this.dist = T.MathUtils.clamp(this.dist * (this.pinch / d), RestoScene.MIN_D, RestoScene.MAX_D);
        }
        this.pinch = d;
        return;
      }
      const dx = e.clientX - p.x,
        dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (this.tapAt) this.tapAt.moved += Math.abs(dx) + Math.abs(dy);
      if (this.pov) {
        // menoleh: seret ke kiri = pandangan ikut ke kiri (seperti Street View)
        const k = (this.pov.fov / 70) * 0.005;
        this.pov.yaw += dx * k;
        this.pov.pitch = T.MathUtils.clamp(this.pov.pitch + dy * k, -1.2, 1.2);
        return;
      }
      if (this.pitch > 1.3) {
        // tampilan dari atas: geser peta
        const k = this.dist * 0.0016;
        const cx = Math.cos(this.yaw),
          sx = Math.sin(this.yaw);
        this.target.x = T.MathUtils.clamp(this.target.x - (dx * cx + dy * sx) * k, -90, 90);
        this.target.z = T.MathUtils.clamp(this.target.z - (-dx * sx + dy * cx) * k, -90, 90);
        return;
      }
      this.yaw -= dx * 0.006;
      this.pitch = T.MathUtils.clamp(this.pitch + dy * 0.004, 0.3, 1.25);
    });
    const up = (e: PointerEvent) => {
      // ketukan (tanpa geser) di pandangan orang = berjalan ke titik itu
      if (e.type === 'pointerup' && this.pov && this.tapAt && this.tapAt.moved < 8) {
        const h = this.pick(e.clientX, e.clientY);
        if (h) this.povWalk(h);
      }
      this.tapAt = null;
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
        if (this.pov) this.pov.fov = T.MathUtils.clamp(this.pov.fov * Math.exp(e.deltaY * 0.001), 35, 95);
        else this.dist = T.MathUtils.clamp(this.dist * Math.exp(e.deltaY * 0.001), RestoScene.MIN_D, RestoScene.MAX_D);
      },
      { passive: false },
    );
    document.addEventListener('visibilitychange', this.onVis);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------------- dunia luar: kota padat di sekitar lahan (lihat city.ts) ---------------- */

  private buildWorld(loc = 'kantor') {
    if (this.city && this.cityLoc === loc) return;
    if (this.city) {
      this.scene.remove(this.city.group);
      this.city.dispose();
    }
    this.city = new City(loc);
    this.city.onSound = (k, v) => (k === 'horn-car' ? sfx.horn(v, 'car') : k === 'horn-motor' ? sfx.horn(v, 'motor') : sfx.motorPass(v));
    this.cityLoc = loc;
    startTraffic();
    this.scene.add(this.city.group);
  }

  /* ---------------- restoran (dibangun ulang saat keadaan berubah) ---------------- */

  private rebuild(s: RestoState) {
    for (const g of [this.shell, this.dyn]) {
      g.traverse((o) => {
        const m = o as T.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mt = m.material as T.Material | T.Material[] | undefined;
        if (Array.isArray(mt)) mt.forEach((x) => x.dispose());
        else mt?.dispose();
      });
      g.clear();
    }
    this.lanterns = [];
    this.site = null;
    this.tablePos = [];
    this.roofMats = [];
    if (!s.location) return;
    const b = buildResto(s, s.handed);
    if (b.shell.children.length) this.shell.add(...b.shell.children);
    if (b.dyn.children.length) this.dyn.add(...b.dyn.children);
    this.lanterns = b.lanterns;
    this.tablePos = b.tablePos;
    this.roofMats = b.roofMats;
    // dinding baru mulai dari tinggi kemajuan terakhir lalu naik perlahan
    this.shell.traverse((o) => {
      if (o.userData.wall === 'grow') o.scale.y = Math.max(0.02, this.buildK);
    });
    // lokasi proyek: pagar seng, papan proyek, perancah, katrol, molen, tumpukan bahan, tukang
    if (s.contractor && !s.handed) {
      this.site = buildSite(s, this.textures);
      this.shell.add(this.site.group);
    }
    // kisi jalur dari geometri jadi: orang berjalan mengelilingi meja, kasir, rak, stasiun
    this.nav = s.handed ? navFromScene([this.shell, this.dyn]) : null;
  }

  /* ---------- kontrol kamera (tombol di layar) ---------- */

  setSpeed(k: number) {
    this.walkK = Math.max(1, k);
  }

  /** Buka/pasang atap untuk melihat isi restoran. */
  toggleRoof() {
    this.showRoof = !this.showRoof;
    return this.showRoof;
  }

  zoomBy(f: number) {
    if (this.pov) {
      this.pov.fov = T.MathUtils.clamp(this.pov.fov * f, 35, 95);
      return;
    }
    this.dist = T.MathUtils.clamp(this.dist * f, RestoScene.MIN_D, RestoScene.MAX_D);
  }

  /** Beralih ke pandangan dari atas (peta, bisa digeser) atau kembali ke pandangan miring. */
  toggleTop() {
    this.exitPov();
    if (this.pitch > 1.3) this.resetView();
    else {
      this.pitch = 1.52;
      this.dist = Math.max(this.dist, 70);
    }
    return this.pitch > 1.3;
  }

  /* ---------- pandangan orang: ikon diseret ke lantai (seperti pegman Google Maps) ---------- */

  /** Titik lantai di bawah posisi layar (lantai resto, halaman, atau jalan); null = di luar kanvas / langit. */
  private pick(cx: number, cy: number) {
    const r = this.renderer.domElement.getBoundingClientRect();
    if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
    _ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    _ray.setFromCamera(_ndc, this.camera);
    // titik di bidang lantai tepat di bawah kursor (lantai resto lebih tinggi dari halaman: ulang 3× dengan tinggi
    // lantai di titik itu); dinding & perabot diabaikan, nanti digeser ke sel bebas terdekat
    const p = new T.Vector3();
    _ground.constant = 0;
    for (let k = 0; k < 3; k++) {
      if (!_ray.ray.intersectPlane(_ground, p)) return null;
      _ground.constant = -groundY(p.x, p.z);
    }
    _ground.constant = 0;
    if (Math.abs(p.x) > 90 || Math.abs(p.z) > 90) return null;
    p.y = groundY(p.x, p.z);
    return p;
  }

  /** Tampilkan penanda di lantai selama ikon diseret; false = tidak ada lantai di bawah jari. */
  povHover(cx: number, cy: number) {
    const p = this.pick(cx, cy);
    this.povMark.visible = !!p;
    if (p) this.povMark.position.copy(p).setY(p.y + 0.03);
    return !!p;
  }

  /** Lepas ikon: kamera pindah ke mata orang yang berdiri di titik itu. */
  povAt(cx: number, cy: number) {
    const p = this.pick(cx, cy);
    this.povMark.visible = false;
    if (!p) return false;
    // menghadap ke tengah ruangan tempat ia berdiri (dapur: memandang sepanjang dapur), selain itu ke tengah resto
    const inBld = p.x > BLD.x0 && p.x < BLD.x1 && p.z > BLD.z0 && p.z < BLD.z1;
    const kitchen = inBld && p.z < ROOMS.kitchenZ[1];
    const look = kitchen
      ? new T.Vector3(p.x > (ROOMS.dapur[0] + ROOMS.dapur[1]) / 2 ? ROOMS.dapur[0] : ROOMS.dapur[1], 0, (ROOMS.kitchenZ[0] + ROOMS.kitchenZ[1]) / 2 + 0.6)
      : new T.Vector3(-8, 0, -7);
    const dir = look.sub(p);
    const yaw = dir.lengthSq() > 1 ? Math.atan2(-dir.x, -dir.z) : 0;
    // berdiri di sel bebas terdekat (tidak di dalam meja/dinding)
    const spot = this.nav?.route(p, p, true)?.pop();
    if (spot) p.set(spot.x, groundY(spot.x, spot.z), spot.z);
    this.pov = { pos: p.clone(), path: [], yaw, pitch: kitchen ? -0.12 : -0.05, fov: 75 };
    this.onPov?.(true);
    return true;
  }

  /** Berjalan ke titik yang diketuk lewat kisi jalur (memutari meja, sekat, dinding). */
  private povWalk(dest: T.Vector3) {
    if (!this.pov) return;
    const path = this.nav?.route(this.pov.pos, dest, true) ?? null;
    if (path) {
      this.pov.path = path;
      return;
    }
    // tanpa rute (mis. dapur tertutup meja saji): jalan lurus, berhenti sebelum menabrak meja/dinding
    const from = this.pov.pos;
    const dir = dest.clone().sub(from).setY(0);
    let len = dir.length();
    if (len < 0.1) return;
    dir.normalize();
    for (const h of [0.35, 0.95]) {
      _ray.set(new T.Vector3(from.x, from.y + h, from.z), dir);
      _ray.far = len + 0.4;
      const hit = _ray.intersectObjects([this.shell, this.dyn], true).find((x) => (x.object as T.Mesh).visible);
      if (hit) len = Math.min(len, hit.distance - 0.4);
    }
    _ray.far = Infinity;
    if (len > 0.1) this.pov.path = [from.clone().addScaledVector(dir, len)];
  }

  exitPov() {
    if (!this.pov) return;
    // kamera orbit kembali menyorot titik tempat orang tadi berdiri
    this.target.set(this.pov.pos.x, 1, this.pov.pos.z);
    this.dist = Math.min(this.dist, 22);
    this.pitch = Math.min(this.pitch, 1.0);
    this.pov = null;
    this.povMark.visible = false;
    this.camera.fov = this.host.clientWidth < this.host.clientHeight ? 55 : 40;
    this.camera.updateProjectionMatrix();
    this.onPov?.(false);
  }

  get inPov() {
    return !!this.pov;
  }

  resetView() {
    this.exitPov();
    this.yaw = 0.55;
    this.pitch = 0.95;
    this.dist = 32;
    this.target.set(-7, 1, -4);
  }

  /** Samakan tampilan dengan keadaan game (dipanggil setiap render React). */
  sync(s: RestoState) {
    const key = [s.location, s.contractor, s.handed, s.handed ? '' : s.buildLeft, s.equipment.join(','), s.tables, s.decor, s.name].join('|');
    if (s.location) this.buildWorld(s.location);
    const k0 = buildProgress(s); // berjalan halus mengikuti pekerjaan hari ini
    if (this.lastK < 0) this.buildK = k0; // pertama dibuka: langsung setinggi kemajuan
    if (key !== this.key) {
      this.key = key;
      this.rebuild(s);
    }
    const c = k0;
    if (this.lastLeft >= 0 && s.buildLeft < this.lastLeft && !s.handed) {
      // hari berganti: debu mengepul & bunyi pekerjaan
      this.site?.burst();
      sfx.thud();
    }
    this.lastLeft = s.buildLeft;
    this.lastK = c;
    this.buildK = c;
    // staf
    const want = new Set(s.handed ? s.staff.map((m) => m.id) : []);
    for (const [id, a] of this.staffActors)
      if (!want.has(id)) {
        for (const mm of a.members) this.dropPerson(mm.obj);
        this.staffActors.delete(id);
      }
    for (const m of s.handed ? s.staff : []) {
      if (this.staffActors.has(m.id)) continue;
      const o = makePerson(lookFor(m.role), this.personMat);
      const home = this.staffHome(m.role, this.roleIndex(s, m.id));
      o.position.copy(home);
      this.people.add(o);
      const work = m.role === 'koki' || m.role === 'kasir';
      // koki & pelayan menghadap ke belakang (kompor / meja saji), kasir & kebersihan ke depan
      const rest = m.role === 'koki' || m.role === 'pelayan' ? Math.PI : 0;
      o.rotation.y = rest;
      this.staffActors.set(m.id, { members: [{ obj: o, path: [], delay: 0, face: null, work, rest }], key: 'home', food: [], bubble: null });
    }
  }

  /** Urutan staf di antara rekan seperan (kasir ke-2 berdiri di sebelah kasir ke-1, tidak bertumpuk). */
  private roleIndex(s: RestoState, id: string) {
    const m = s.staff.find((x) => x.id === id);
    return m ? s.staff.filter((x) => x.role === m.role).findIndex((x) => x.id === id) : 0;
  }

  private staffHome(role: string, i: number) {
    // kasir pertama di depan monitor POS, berikutnya bergeser ke kiri sepanjang meja kasir
    if (role === 'kasir') return new T.Vector3(COUNTER.x + 0.5 - (i % 3) * 0.95, 0, COUNTER.z - 0.9);
    if (role === 'koki') return STATIONS[['goreng', 'kompor', 'sushi', 'minum'][i % 4]].clone().add(new T.Vector3(0, 0, 0.7));
    if (role === 'pelayan') return new T.Vector3(-14 + i * 1.2, 0, PASS_Z + 0.55);
    return new T.Vector3(-7.6, 0, -3.4);
  }

  /** Kirim satu orang ke tujuan lewat rute yang benar; `face` = duduk menghadap titik itu. */
  private send(m: Member, dest: T.Vector3, face: T.Vector3 | null = null, delay = 0) {
    const nav = this.nav?.route(m.obj.position, dest) ?? null;
    m.path = nav ?? route(m.obj.position, dest);
    if (process.env.NODE_ENV === 'development') {
      // penghitung untuk pemeriksaan: berapa rute dari kisi vs rute denah cadangan
      const w = globalThis as unknown as { __restoNav?: { grid: number; fallback: number } };
      w.__restoNav ??= { grid: 0, fallback: 0 };
      if (nav) w.__restoNav.grid++;
      else w.__restoNav.fallback++;
    }
    m.face = face;
    m.delay = delay;
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
          const start = SIDEWALK_IN.clone().add(new T.Vector3((Math.random() - 0.5) * 4, 0, 0.6));
          const members: Member[] = [];
          for (let k = 0; k < g.size; k++) {
            const kid = g.seg === 'keluarga' && k >= 2;
            const p = makePerson(lookFor(kid ? 'anak' : g.seg), this.personMat);
            if (kid) p.scale.setScalar(0.64);
            p.position.copy(start).add(new T.Vector3((k % 2) * 0.5 - 0.25, 0, Math.floor(k / 2) * 0.5));
            this.people.add(p);
            members.push({ obj: p, path: [], delay: 0, face: null });
          }
          a = { members, key: '', food: [], bubble: null };
          this.actors.set(g.id, a);
          const b = new T.Sprite(new T.SpriteMaterial({ map: this.greet, transparent: true, depthWrite: false }));
          b.scale.set(1.6, 0.6, 1);
          b.position.set(0, 2.15, 0);
          b.userData.until = this.t + 2.5;
          members[0].obj.add(b);
          a.bubble = b;
        }
        // tujuan baru bila keadaan kelompok berubah (antre maju, pesan, duduk, pulang)
        const seated = (g.state === 'seat' || g.state === 'wait' || g.state === 'eat') && g.table >= 0 && !!this.tablePos[g.table];
        const key = g.state === 'queue' ? `q${qi}` : seated ? `t${g.table}` : g.state;
        if (key !== a.key) {
          a.key = key;
          const lineAt = (bx: number, bz: number) =>
            a!.members.forEach((m, k) => this.send(m, new T.Vector3(bx + (k % 2 ? 0.3 : -0.3), 0, bz + Math.floor(k / 2) * 0.45), null, k * 0.3));
          if (g.state === 'queue') lineAt(QUEUE_X, COUNTER.z + 1.9 + qi * 1.0);
          else if (g.state === 'order') lineAt(COUNTER.x + 0.4, COUNTER.z + 1.0);
          else if (seated) {
            const tp = this.tablePos[g.table];
            // kursi yang paling dekat lorong diisi lebih dulu
            const chairs = [...CHAIRS].sort((p, q) => Math.abs(tp.z + p[1] - AISLE_Z) - Math.abs(tp.z + q[1] - AISLE_Z));
            a.members.forEach((m, k) => {
              const [dx, dz] = chairs[k % chairs.length];
              this.send(m, new T.Vector3(tp.x + dx, 0, tp.z + dz), new T.Vector3(tp.x + dx, 0, tp.z), k * 0.35);
            });
          } else if (g.state === 'leave') this.leave(a);
        }
        for (const m of a.members) m.eat = g.state === 'eat';
        if (g.state === 'queue') qi++;
        // makanan di meja
        const showFood = g.state === 'eat';
        if (showFood && !a.food.length && this.tablePos[g.table]) {
          g.items.forEach((it, k) => {
            const m = MENUS.find((x) => x.id === it.menu)!;
            const sp = new T.Sprite(new T.SpriteMaterial({ map: emojiTex(m.emoji), transparent: true }));
            sp.scale.setScalar(0.45);
            sp.position.copy(this.tablePos[g.table]).add(new T.Vector3(-0.45 + (k % 4) * 0.3, 1.45, -0.15 + Math.floor(k / 4) * 0.25));
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
        if (a.key !== 'leave') {
          a.key = 'leave';
          this.leave(a);
        }
        if (a.members.every((m) => !m.path.length && m.delay <= 0)) {
          for (const m of a.members) this.dropPerson(m.obj);
          this.actors.delete(id);
        }
      }
    // staf bergerak lewat lorong: pelayan ke meja yang dilayani, kebersihan ke meja kotor
    if (run) {
      const serving = run.groups.find((g) => g.state === 'wait' && g.items.every((i) => i.done));
      const dirty = run.tables.findIndex((tb) => tb.dirty);
      for (const m of s.staff) {
        const a = this.staffActors.get(m.id);
        if (!a) continue;
        let key = 'home',
          dest = this.staffHome(m.role, this.roleIndex(s, m.id));
        if (m.role === 'pelayan' && serving && this.tablePos[serving.table]) {
          key = `serve${serving.table}`;
          dest = this.tablePos[serving.table].clone().add(new T.Vector3(1.0, 0, 0));
        } else if (m.role === 'kebersihan' && dirty >= 0 && this.tablePos[dirty]) {
          key = `clean${dirty}`;
          dest = this.tablePos[dirty].clone().add(new T.Vector3(-1.0, 0, 0));
        }
        if (key !== a.key) {
          a.key = key;
          this.send(a.members[0], dest);
        }
      }
    }
  }

  /** Rombongan pulang: satu per satu lewat pintu menuju trotoar. */
  private leave(a: Actor) {
    a.members.forEach((m, k) => this.send(m, SIDEWALK_IN.clone().add(new T.Vector3((Math.random() - 0.5) * 5, 0, 1.2)), null, k * 0.35));
  }

  private dropPerson(o: T.Object3D) {
    this.people.remove(o);
    disposePerson(o);
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
    if (!this.pov) this.camera.fov = w < h ? 55 : 40;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.t += dt;
    const d = this.dist;
    if (this.pov) {
      // pandangan orang: berjalan pelan ke titik yang diketuk, mata di ketinggian orang dewasa
      const v = this.pov;
      let step = dt * 1.8;
      while (v.path.length && step > 0) {
        const to = v.path[0].clone().sub(v.pos).setY(0);
        const dd = to.length();
        if (dd <= step) {
          v.pos.x = v.path[0].x;
          v.pos.z = v.path[0].z;
          v.path.shift();
          step -= dd;
        } else {
          v.pos.addScaledVector(to.normalize(), step);
          step = 0;
        }
      }
      v.pos.y = groundY(v.pos.x, v.pos.z);
      const walking = v.path.length > 0;
      this.povMark.visible = walking;
      if (walking) {
        const end = v.path[v.path.length - 1];
        this.povMark.position.set(end.x, groundY(end.x, end.z) + 0.03, end.z);
      }
      const bob = walking ? Math.sin(this.t * 9) * 0.025 : 0;
      this.camera.position.set(v.pos.x, v.pos.y + EYE_H + bob, v.pos.z);
      this.camera.rotation.set(v.pitch, v.yaw, 0, 'YXZ');
      if (Math.abs(this.camera.fov - v.fov) > 0.01) {
        this.camera.fov = T.MathUtils.damp(this.camera.fov, v.fov, 10, dt);
        this.camera.updateProjectionMatrix();
      }
      this.target.set(v.pos.x, 1, v.pos.z);
    } else {
      // kamera mengorbit restoran
      this.camera.position.set(Math.sin(this.yaw) * Math.cos(this.pitch) * d, Math.sin(this.pitch) * d, Math.cos(this.yaw) * Math.cos(this.pitch) * d).add(this.target);
      this.camera.lookAt(this.target);
    }
    this.uTime.value = this.t;
    // bayangan matahari mengikuti area yang dilihat
    this.sun.target.position.copy(this.target).setY(0);
    this.sun.position.copy(this.sun.target.position).add(_sunOff);
    const sc = this.sun.shadow.camera as T.OrthographicCamera;
    const half = T.MathUtils.clamp(d * 1.1, 24, 70);
    if (sc.right !== half) {
      sc.left = sc.bottom = -half;
      sc.right = sc.top = half;
      sc.updateProjectionMatrix();
    }
    this.city?.update(this.t, dt, this.camera, this.target);
    if (this.city && Math.floor(this.t * 2) !== Math.floor((this.t - dt) * 2)) {
      startTraffic(); // dimulai lagi bila efek suara baru dinyalakan
      setTrafficLevel(this.city.trafficLevel(this.camera));
    }
    if (this.site && this.site.update(this.t, dt, this.buildK)) sfx.clink();
    // dinding naik sesuai pembangunan
    this.shell.traverse((o) => {
      if (o.userData.wall === 'grow') o.scale.y = T.MathUtils.damp(o.scale.y, Math.max(0.02, this.buildK), 3, dt);
      else if (o.userData.wall === 'late') o.visible = this.buildK > 0.98;
    });
    for (const [i, l] of this.lanterns.entries()) l.rotation.z = Math.sin(this.t * 1.5 + i) * 0.08;
    // atap terpasang; bisa dibuka (tombol) untuk melihat isi restoran
    const wantRoof = this.showRoof ? 1 : 0;
    this.roofK = T.MathUtils.damp(this.roofK, wantRoof, 5, dt);
    for (const m of this.roofMats) {
      m.opacity = this.roofK;
      m.depthWrite = this.roofK > 0.95;
      m.visible = this.roofK > 0.02;
    }
    // orang berjalan mengikuti rute; sampai di kursi → duduk menghadap meja
    for (const a of [...this.actors.values(), ...this.staffActors.values()]) {
      for (const m of a.members) {
        const o = m.obj;
        let moved = 0;
        if (m.delay > 0) m.delay -= dt;
        else if (m.path.length) {
          const to = m.path[0].clone().sub(o.position);
          to.y = 0;
          const dd = to.length();
          if (dd < 0.06) m.path.shift();
          else {
            moved = Math.min(dd, dt * 2.4 * this.walkK);
            o.position.addScaledVector(to.normalize(), moved);
            o.rotation.y = T.MathUtils.damp(o.rotation.y, o.rotation.y + Math.atan2(Math.sin(Math.atan2(to.x, to.z) - o.rotation.y), Math.cos(Math.atan2(to.x, to.z) - o.rotation.y)), 12, dt);
          }
        } else if (m.face) o.rotation.y = Math.atan2(m.face.x - o.position.x, m.face.z - o.position.z);
        else if (m.rest != null && a.key === 'home') {
          const dr = Math.atan2(Math.sin(m.rest - o.rotation.y), Math.cos(m.rest - o.rotation.y));
          o.rotation.y = T.MathUtils.damp(o.rotation.y, o.rotation.y + dr, 6, dt);
        }
        o.position.y = groundY(o.position.x, o.position.z);
        const seated = !!m.face && !m.path.length && m.delay <= 0;
        posePerson(o, { t: this.t, dt, moved, seat: seated ? SEAT_H : null, eat: seated && m.eat, work: m.work && !m.path.length });
      }
      if (a.bubble) a.bubble.visible = this.t < (a.bubble.userData.until as number);
    }
    this.renderer.render(this.scene, this.camera);
  };

  private onVis = () => {
    if (document.hidden) stopTraffic();
  };

  dispose() {
    document.removeEventListener('visibilitychange', this.onVis);
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
    this.city?.dispose();
    stopTraffic();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
