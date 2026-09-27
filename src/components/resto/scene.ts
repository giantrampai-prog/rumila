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
import { AISLE_Z, CHAIRS, COUNTER, PASS_Z, QUEUE_X, SIDEWALK_IN, STATIONS, groundY, route } from './layout';
import { buildRealSky } from '@/components/fruits/garden/sky';

const _sunOff = new T.Vector3(24, 48, 30);

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

/** Satu orang yang berjalan mengikuti rute (lewat pintu, lorong) lalu berdiri/duduk. */
interface Member {
  obj: T.Group;
  path: T.Vector3[];
  delay: number;
  /** titik yang dihadap saat duduk (tengah meja); null = berdiri */
  face: T.Vector3 | null;
}

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
  private city: City | null = null;
  private cityLoc = '';
  private site: Site | null = null;
  private lastK = -1;

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
        if (this.pinch) this.dist = T.MathUtils.clamp(this.dist * (this.pinch / d), RestoScene.MIN_D, RestoScene.MAX_D);
        this.pinch = d;
        return;
      }
      const dx = e.clientX - p.x,
        dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
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
        this.dist = T.MathUtils.clamp(this.dist * Math.exp(e.deltaY * 0.001), RestoScene.MIN_D, RestoScene.MAX_D);
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
    this.dist = T.MathUtils.clamp(this.dist * f, RestoScene.MIN_D, RestoScene.MAX_D);
  }

  /** Beralih ke pandangan dari atas (peta, bisa digeser) atau kembali ke pandangan miring. */
  toggleTop() {
    if (this.pitch > 1.3) this.resetView();
    else {
      this.pitch = 1.52;
      this.dist = Math.max(this.dist, 70);
    }
    return this.pitch > 1.3;
  }

  resetView() {
    this.yaw = 0.55;
    this.pitch = 0.95;
    this.dist = 32;
    this.target.set(-7, 1, -4);
  }

  /** Samakan tampilan dengan keadaan game (dipanggil setiap render React). */
  sync(s: RestoState) {
    const key = [s.location, s.contractor, s.handed, s.handed ? '' : s.buildLeft, s.equipment.join(','), s.tables, s.decor, s.name].join('|');
    if (s.location) this.buildWorld(s.location);
    const k0 = s.contractor ? (s.handed ? 1 : 1 - s.buildLeft / Math.max(1, [4, 3, 2][['hemat', 'standar', 'cepat'].indexOf(s.contractor)])) : 0;
    if (this.lastK < 0) this.buildK = k0; // pertama dibuka: langsung setinggi kemajuan
    if (key !== this.key) {
      this.key = key;
      this.rebuild(s);
    }
    const c = k0;
    if (this.lastK >= 0 && c > this.lastK + 0.01 && !s.handed) {
      // hari berganti: debu mengepul & bunyi pekerjaan
      this.site?.burst();
      sfx.thud();
    }
    this.lastK = c;
    this.buildK = c;
    // staf
    const want = new Set(s.handed ? s.staff.map((m) => m.id) : []);
    for (const [id, a] of this.staffActors)
      if (!want.has(id)) {
        for (const mm of a.members) this.people.remove(mm.obj);
        this.staffActors.delete(id);
      }
    for (const m of s.handed ? s.staff : []) {
      if (this.staffActors.has(m.id)) continue;
      const colors = { kasir: '#c8342a', koki: '#ffffff', pelayan: '#1f2f5a', kebersihan: '#6aa84f' } as const;
      const o = person(colors[m.role], '#f0c8a0', m.role === 'koki' ? '#ffffff' : m.role === 'pelayan' ? '#1f2f5a' : undefined);
      const home = this.staffHome(m.role, [...this.staffActors.keys()].length);
      o.position.copy(home);
      this.people.add(o);
      this.staffActors.set(m.id, { members: [{ obj: o, path: [], delay: 0, face: null }], key: 'home', food: [], bubble: null });
    }
  }

  private staffHome(role: string, i: number) {
    if (role === 'kasir') return new T.Vector3(COUNTER.x, 0, COUNTER.z - 0.9);
    if (role === 'koki') return STATIONS[['goreng', 'kompor', 'sushi', 'minum'][i % 4]].clone().add(new T.Vector3(0, 0, 1.0));
    if (role === 'pelayan') return new T.Vector3(-14 + i * 1.2, 0, PASS_Z + 0.55);
    return new T.Vector3(-7.6, 0, -3.4);
  }

  /** Kirim satu orang ke tujuan lewat rute yang benar; `face` = duduk menghadap titik itu. */
  private send(m: Member, dest: T.Vector3, face: T.Vector3 | null = null, delay = 0) {
    m.path = route(m.obj.position, dest);
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
            const p = person(SEG_COLOR[g.seg], ['#f0c8a0', '#d9a47a', '#e8b890'][k % 3]);
            if (g.seg === 'keluarga' && k >= 2) p.scale.setScalar(0.72);
            p.position.copy(start).add(new T.Vector3((k % 2) * 0.5 - 0.25, 0, Math.floor(k / 2) * 0.5));
            this.people.add(p);
            members.push({ obj: p, path: [], delay: 0, face: null });
          }
          a = { members, key: '', food: [], bubble: null };
          this.actors.set(g.id, a);
          const b = new T.Sprite(new T.SpriteMaterial({ map: this.greet, transparent: true, depthWrite: false }));
          b.scale.set(1.6, 0.6, 1);
          b.position.set(0, 2.0, 0);
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
          for (const m of a.members) this.people.remove(m.obj);
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
          dest = this.staffHome(m.role, [...this.staffActors.keys()].indexOf(m.id));
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
    this.camera.position.set(Math.sin(this.yaw) * Math.cos(this.pitch) * d, Math.sin(this.pitch) * d, Math.cos(this.yaw) * Math.cos(this.pitch) * d).add(this.target);
    this.camera.lookAt(this.target);
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
        if (m.delay > 0) {
          m.delay -= dt;
          continue;
        }
        if (m.path.length) {
          const to = m.path[0].clone().sub(o.position);
          to.y = 0;
          const dd = to.length();
          if (dd < 0.06) m.path.shift();
          else {
            o.position.addScaledVector(to.normalize(), Math.min(dd, dt * 2.4 * this.walkK));
            o.rotation.y = T.MathUtils.damp(o.rotation.y, o.rotation.y + Math.atan2(Math.sin(Math.atan2(to.x, to.z) - o.rotation.y), Math.cos(Math.atan2(to.x, to.z) - o.rotation.y)), 12, dt);
            o.position.y = groundY(o.position.x, o.position.z) + Math.abs(Math.sin(this.t * 9 + o.id)) * 0.05;
          }
        } else if (m.face) {
          o.rotation.y = Math.atan2(m.face.x - o.position.x, m.face.z - o.position.z);
          o.position.y = groundY(o.position.x, o.position.z) - 0.16; // duduk
        } else o.position.y = groundY(o.position.x, o.position.z);
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
