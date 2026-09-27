// Pesawat penjelajah "Rinoya-1" (GLB dari Higgsfield/Meshy) untuk Tur terbang tampilan anak: kamera belakang pesawat.
// Digambar sebagai lapisan kedua di atas tata surya dengan kamera sendiri (ruang pandang), jadi ukurannya selalu pas di
// layar dan tidak pernah menembus planet, walau skala tata surya jauh lebih besar. Cahaya mengikuti arah Matahari yang
// sebenarnya relatif terhadap kamera utama; api mesin menyala saat terbang dan meredup saat singgah.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AgamModel } from "@/components/roket/agam-model";
import { GroundLaunch, GROUND_END } from "./launch";

const URL = "/angkasa/kapal/rinoya-1.glb";

/** Orientasi GLB → ruang pesawat (hidung ke −z, atas +y). GLB Meshy: hidung ke −x, nozel utama di +x. */
const FIT = { yaw: -Math.PI / 2, length: 1.7 };

export class ShipOverlay {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(42, 1, 0.05, 50);
  private rig = new THREE.Group();
  private body = new THREE.Group();
  private flame: THREE.Mesh;
  private glow: THREE.Sprite;
  private sun = new THREE.DirectionalLight(0xfff4e0, 3.2);
  private fill = new THREE.HemisphereLight(0x8aa4ff, 0x1a1420, 0.35);
  private flameU = { uTime: { value: 0 }, uPower: { value: 0 } };
  private t = 0;
  private power = 0;
  private roll = 0;
  private yaw = 0;
  private env: THREE.Texture | null = null;
  ready = false;
  visible = false;
  /* Pembuka: Agam melambai di samping pesawat, masuk kokpit, pesawat berbalik & melesat. */
  private introU: number | null = null;
  private agamHost = new THREE.Group();
  private agam: AgamModel | null = null;
  private agamMats: THREE.Material[] = [];
  private ground: GroundLaunch | null = null;
  private groundMode = false;
  private flash: THREE.Mesh;
  private shipModel: THREE.Object3D | null = null;
  private shipBack = 0.8;
  /** pesawat & Agam siap tampil di pembuka */
  get introReady() {
    return this.ready && !!this.agam?.ready;
  }
  get introOn() {
    return this.introU !== null;
  }
  /** u 0–1 sepanjang pembuka; null = selesai */
  setIntro(u: number | null) {
    this.introU = u;
    if (u !== null && !this.ground) {
      this.ground = new GroundLaunch(this.agamHost);
      if (this.shipModel) this.ground.setShip(this.shipModel.clone(), this.shipBack);
    }
    if (u !== null && !this.agam) {
      this.agam = new AgamModel(
        this.agamHost,
        (root) =>
          root.traverse((o) => {
            const m = o as THREE.Mesh;
            if (!m.isMesh) return;
            const mats = Array.isArray(m.material) ? m.material : [m.material];
            for (const mt of mats) this.agamMats.push(mt);
          }),
        { url: "/roket/agam-astronot.glb", fit: (r) => r.scale.setScalar(0.62 / 1.2) },
      );
    }
    if (u === null) {
      this.groundMode = false;
      if (this.ground) {
        this.ground.dispose();
        this.ground = null;
      }
    }
  }

  constructor(renderer: THREE.WebGLRenderer) {
    this.scene.add(this.rig, this.sun, this.sun.target, this.fill);
    // kilatan putih saat keluar atmosfer (peralihan adegan darat → angkasa)
    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false, depthWrite: false }),
    );
    this.flash.position.z = -1;
    this.flash.renderOrder = 99;
    this.camera.add(this.flash);
    this.scene.add(this.camera);
    this.rig.add(this.body);
    // pantulan lembut untuk material logam/kaca (tanpa latar)
    const pm = new THREE.PMREMGenerator(renderer);
    this.env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    this.scene.environment = this.env;
    this.scene.environmentIntensity = 0.35;

    // api mesin: kerucut aditif dengan gradien (inti putih-biru → ujung jingga), berkedip halus
    const fg = new THREE.ConeGeometry(0.11, 1, 24, 1, true);
    fg.translate(0, -0.5, 0);
    fg.rotateX(-Math.PI / 2); // ujung kerucut ke +z (ke belakang pesawat)
    const fm = new THREE.ShaderMaterial({
      uniforms: this.flameU,
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform float uTime; uniform float uPower; varying vec3 vP;
        void main(){
          float z = clamp(vP.z, 0.0, 1.0);
          float flick = 0.85 + 0.15 * sin(uTime * 38.0 + z * 9.0) * sin(uTime * 23.0);
          vec3 core = vec3(0.75, 0.9, 1.0), hot = vec3(1.0, 0.62, 0.22);
          vec3 c = mix(core, hot, smoothstep(0.05, 0.6, z));
          float a = pow(1.0 - z, 3.0) * uPower * flick * 0.8;
          gl_FragColor = vec4(c * a, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.flame = new THREE.Mesh(fg, fm);
    const gTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(200,225,255,1)");
      gr.addColorStop(0.35, "rgba(255,170,90,.45)");
      gr.addColorStop(1, "rgba(255,120,40,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    this.body.add(this.flame, this.glow);

    new GLTFLoader().load(
      URL,
      (g) => {
        const m = g.scene;
        const holder = new THREE.Group();
        holder.rotation.y = FIT.yaw;
        holder.add(m);
        holder.updateMatrixWorld(true);
        // skala: panjang terbesar = FIT.length, pusat di titik asal (diukur setelah diputar)
        const box = new THREE.Box3().setFromObject(holder);
        const size = box.getSize(new THREE.Vector3());
        const s = FIT.length / Math.max(size.x, size.y, size.z);
        holder.scale.setScalar(s);
        holder.position.copy(box.getCenter(new THREE.Vector3()).multiplyScalar(-s));
        m.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.frustumCulled = false;
        });
        this.body.add(holder);
        // nozel utama di belakang (+z): api & pendar di sana
        const back = (size.z * s) / 2;
        this.flame.position.set(0, 0.02, back * 0.9);
        this.glow.position.set(0, 0.02, back * 0.88);
        this.shipModel = holder;
        this.shipBack = back;
        this.ground?.setShip(holder.clone(), back);
        this.ready = true;
      },
      undefined,
      () => {
        /* gagal dimuat: tur tetap berjalan tanpa pesawat */
      },
    );
  }

  /**
   * @param main kamera utama tata surya
   * @param sunWorld posisi Matahari (dunia)
   * @param thrust 0–1: seberapa kencang terbang (1 saat melesat, ±0,2 saat singgah)
   * @param turn −1…1: arah belokan (memiringkan pesawat)
   */
  /** 1 = sedang terbang (pesawat di tengah bawah), 0 = singgah (menepi ke pojok bawah agar planet terlihat utuh) */
  private center = 1;

  update(dt: number, main: THREE.PerspectiveCamera, sunWorld: THREE.Vector3, thrust: number, turn: number, flying: boolean) {
    this.center += ((flying ? 1 : 0) - this.center) * (1 - Math.exp(-dt * 1.2));
    const side = 1 - this.center;
    this.t += dt;
    const k = 1 - Math.exp(-dt * 3);
    this.power += (thrust - this.power) * k;
    this.roll += (-turn * 0.35 - this.roll) * k;
    this.yaw += (turn * 0.12 - this.yaw) * k;
    this.flameU.uTime.value = this.t;
    this.flameU.uPower.value = 0.25 + this.power * 0.9;
    this.flame.scale.set(1, 1, 0.25 + this.power * 0.75);
    const gs = 0.3 + this.power * 0.35;
    this.glow.scale.set(gs, gs, 1);

    this.camera.fov = main.fov;
    this.camera.aspect = main.aspect;
    this.camera.updateProjectionMatrix();

    if (this.introU !== null) this.introPose(this.introU, main, dt);
    else this.chasePose(side, main);

    // arah Matahari dilihat dari kamera utama → ruang kamera pesawat
    const d = sunWorld.clone().sub(main.position).normalize().applyQuaternion(main.quaternion.clone().invert());
    this.sun.position.copy(this.rig.position).addScaledVector(d, 10);
    this.sun.target.position.copy(this.rig.position);
  }

  private chasePose(side: number, main: THREE.PerspectiveCamera) {
    // di bawah-tengah layar, dilihat sedikit dari atas; melayang pelan
    const portrait = main.aspect < 1;
    const dist = (portrait ? 4.8 / Math.max(0.55, main.aspect) ** 0.5 : 4.6) + side * 1.6;
    // lebar setengah layar pada jarak ini → geser ke kanan bawah saat singgah
    const halfW = Math.tan((main.fov * Math.PI) / 360) * dist * main.aspect;
    this.rig.position.set(side * halfW * 0.55, -0.8 - side * 0.35 - Math.sin(this.t * 0.9) * 0.04, -dist);
    this.body.rotation.set(0.2 + Math.sin(this.t * 0.7) * 0.02, this.yaw - side * 0.5, this.roll + Math.sin(this.t * 0.5) * 0.02);
  }

  /**
   * Pembuka (u 0–1). 0–GROUND_END: adegan darat (lihat launch.ts) — Agam naik, lepas landas, menembus awan.
   * Sesudahnya di angkasa: kilatan memudar, pesawat naik ke posisi kamera belakang di depan Bumi, meliuk pelan
   * saat kamera utama mundur ke tata surya, lalu melesat menjauh.
   */
  private introPose(u: number, main: THREE.PerspectiveCamera, dt: number) {
    this.groundMode = u < GROUND_END;
    if (this.groundMode) {
      this.ground?.update(u, dt, main.aspect, (wave) => {
        const w = Math.sin(this.t * 7) * 0.35;
        const step = wave ? 0 : Math.sin(this.t * 7) * 0.45;
        this.agam?.pose({ legL: step, legR: -step, armL: -step * 0.6, armR: wave ? -2.5 + w : step * 0.6, lower: 1 });
      });
      return;
    }
    const v = (u - GROUND_END) / (1 - GROUND_END);
    const sm = (a: number, b: number) => {
      const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
      return x * x * (3 - 2 * x);
    };
    (this.flash.material as THREE.MeshBasicMaterial).opacity = 1 - sm(0, 0.12);
    const portrait = main.aspect < 1;
    const base = portrait ? 5.4 / Math.max(0.55, main.aspect) ** 0.5 : 5;
    const rise = sm(0, 0.18);
    const away = sm(0.78, 1);
    // meliuk pelan (kiri–kanan) selama kamera mundur
    const weave = Math.sin(v * Math.PI * 2.5) * sm(0.2, 0.3) * (1 - away);
    this.rig.position.set(weave * 0.9, -3 + 2.2 * rise + Math.sin(this.t * 0.9) * 0.04 + away * 0.9, -(base + away * 60));
    this.body.rotation.set(0.2 - 0.25 * (1 - rise), -weave * 0.15, -weave * 0.45 + Math.sin(this.t * 0.5) * 0.02);
    this.power = Math.max(this.power, 0.7 + 0.3 * away);
  }

  render(renderer: THREE.WebGLRenderer) {
    if (this.groundMode && this.ground) {
      // adegan darat menutupi seluruh layar (tata surya di belakangnya belum terlihat)
      this.ground.render(renderer);
      return;
    }
    if (!this.visible || !this.ready) return;
    const ac = renderer.autoClear;
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(this.scene, this.camera);
    renderer.autoClear = ac;
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
    this.env?.dispose();
    this.ground?.dispose();
  }
}
