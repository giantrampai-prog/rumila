// Adegan pembuka di darat: landasan Rinoya-1 di Bumi → Agam melambai & naik → pesawat melayang, menegak, lalu
// melesat menembus awan; langit biru menggelap sampai hitam berbintang. Setelah itu tampilan beralih ke angkasa
// (Bumi dari luar, lalu tata surya). Dirender menutupi seluruh layar selama bagian darat berlangsung.

import * as THREE from "three";
import { LaunchEnvironment } from "./launch-environment";

const sm = (u: number, a: number, b: number) => {
  const x = Math.min(1, Math.max(0, (u - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** bagian waktu pembuka (0–1 dari seluruh pembuka) */
export const GROUND_END = 0.55;
const BOARD = [0.1, 0.188]; // Agam berjalan ke samping pesawat, melompat naik, lalu masuk kokpit
/** tahapan naik: jalan → lompat ke atas pesawat → turun ke kursi kokpit */
const WALK_END = 0.145,
  JUMP_END = 0.172;
// titik-titik di ruang adegan (pesawat di titik asal, moncong ke −z; kokpit di atas-depan)
const AGAM_START = new THREE.Vector3(1.35, 0, -0.8);
const AGAM_SIDE = new THREE.Vector3(0.95, 0, -0.5);
const AGAM_TOP = new THREE.Vector3(0.1, 1.02, -0.45);
const AGAM_SEAT = new THREE.Vector3(0.05, 0.42, -0.42);
const lerpAngle = (a: number, b: number, t: number) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};
const HOVER = [0.2, 0.27]; // mesin samping: naik pelan
const PITCH = [0.26, 0.31]; // moncong menegak, mesin utama menyala
const CLIMB = [0.3, GROUND_END]; // melesat naik menembus awan

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Kekuatan suara mesin, angin & turbin sepanjang pembuka (sama dengan animasi) — untuk engineSound(). */
export function launchAudio(u: number) {
  const hover = sm(u, HOVER[0], HOVER[1]);
  const main = sm(u, 0.27, 0.32);
  const inSpace = sm(u, GROUND_END - 0.02, GROUND_END + 0.02);
  const spool = sm(u, BOARD[1] - 0.01, HOVER[0] + 0.01) * (1 - 0.5 * inSpace);
  const thrust = Math.max(hover * 0.32 * (1 - main), main) * (1 - 0.8 * inSpace);
  // angin: makin kencang saat menanjak, paling keras menembus awan, hilang di udara tipis
  const wind = (sm(u, 0.3, 0.37) * 0.75 + sm(u, 0.4, 0.44) * 0.25 * (1 - sm(u, 0.46, 0.5))) * (1 - sm(u, 0.49, GROUND_END));
  return { thrust, wind, spool };
}

export class GroundLaunch {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
  private sky: THREE.Mesh;
  private skyU = {
    // warna diambil dari tepi atas foto panorama agar langit 3D menyambung mulus
    uHorizon: { value: new THREE.Color("#529ee6") },
    uZenith: { value: new THREE.Color("#3894df") },
    uSpace: { value: 0 },
  };
  private ship = new THREE.Group();
  private shipBody = new THREE.Group();
  /** guling di sumbu moncong (barrel roll) */
  private rollG = new THREE.Group();
  private camUp = new THREE.Vector3(0, 1, 0);
  private mainFlame: THREE.Mesh;
  private sideFlames: THREE.Mesh[] = [];
  private flameU = { uTime: { value: 0 }, uPower: { value: 0 } };
  private sideU = { uTime: { value: 0 }, uPower: { value: 0 } };
  private clouds: THREE.Sprite[] = [];
  private smoke: { s: THREE.Sprite; born: number; v: THREE.Vector3 }[] = [];
  private smokeCursor = 0;
  private shadowActorsReady = false;
  private disposed = false;
  private cloudReady = false;
  get ready() { return this.landscape.ready && this.cloudReady; }
  private smokeTex: THREE.Texture;
  private ground = new THREE.Group();
  private landscape: LaunchEnvironment;
  private fog = new THREE.Fog(0xc4d5e2, 40, 650);
  private sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  private t = 0;
  private lastSmoke = 0;
  private owned: { dispose(): void }[] = [];
  private flag: THREE.Mesh | null = null;
  private flagRest: Float32Array | null = null;
  private birds: THREE.Sprite[] = [];

  constructor(private agamHost: THREE.Group, low = false, environment?: THREE.Texture) {
    this.landscape = new LaunchEnvironment(low);
    this.scene.environment = environment ?? null;
    this.scene.environmentIntensity = 0.22;
    this.scene.fog = this.fog;
    this.sun.position.set(-30, 40, 20);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.setScalar(low ? 1024 : 2048);
    Object.assign(this.sun.shadow.camera, {left:-14,right:14,top:14,bottom:-14,near:1,far:100});
    this.sun.shadow.bias = -.00015;
    this.sun.shadow.normalBias = .016;
    this.sun.shadow.camera.updateProjectionMatrix();
    this.scene.add(this.sun, new THREE.HemisphereLight(0xcfe6ff, 0x3a5a2a, 0.65));

    // langit: gradien horizon → zenit, menggelap ke hitam saat keluar atmosfer; bintang muncul
    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyU,
      vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uHorizon; uniform vec3 uZenith; uniform float uSpace; varying vec3 vD;
        float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
        void main(){
          float y = clamp(vD.y, -0.2, 1.0);
          vec3 day = mix(uHorizon, uZenith, pow(max(y, 0.0), 0.55));
          vec3 space = mix(vec3(0.02,0.03,0.08), vec3(0.0), max(y,0.0));
          vec3 c = mix(day, space, uSpace);
          vec3 cell = floor(vD * 420.0);
          float st = step(0.9965, h(cell)) * smoothstep(0.55, 1.0, uSpace);
          gl_FragColor = vec4(c + st, 1.0);
          #include <colorspace_fragment>
        }`,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMat);
    this.sky.renderOrder = -10;
    this.scene.add(this.sky);
    this.owned.push(this.sky.geometry, skyMat);

    this.buildGround();

    // pesawat (model diisi setelah GLB dimuat) + api mesin
    this.ship.add(this.shipBody);
    this.shipBody.add(this.rollG);
    this.scene.add(this.ship, this.agamHost);
    const flameMat = (u: typeof this.flameU) =>
      new THREE.ShaderMaterial({
        uniforms: u,
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform float uTime; uniform float uPower; varying vec3 vP;
          void main(){
            float z = clamp(vP.z, 0.0, 1.0);
            float flick = 0.82 + 0.18 * sin(uTime * 41.0 + z * 11.0) * sin(uTime * 27.0);
            vec3 c = mix(vec3(0.78,0.9,1.0), vec3(1.0,0.6,0.2), smoothstep(0.05, 0.6, z));
            float a = pow(1.0 - z, 2.4) * uPower * flick;
            gl_FragColor = vec4(c * a, a);
          }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        fog: false,
      });
    const cone = (r: number) => {
      const g = new THREE.ConeGeometry(r, 1, 20, 1, true);
      g.rotateX(Math.PI / 2);
      g.translate(0, 0, 0.5); // pangkal di nozel; ujung menyempit ke +z
      this.owned.push(g);
      return g;
    };
    const mm = flameMat(this.flameU);
    this.mainFlame = new THREE.Mesh(cone(0.2), mm);
    this.rollG.add(this.mainFlame);
    const sm2 = flameMat(this.sideU);
    for (const x of [-0.72, 0.72]) {
      const f = new THREE.Mesh(cone(0.09), sm2);
      f.rotation.x = Math.PI / 2; // semburan ke bawah
      f.position.set(x, -0.12, 0.25);
      this.sideFlames.push(f);
      this.rollG.add(f);
    }
    this.owned.push(mm, sm2);

    // asap landasan
    this.smokeTex = canvasTexture(64, 64, (g) => {
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(235,235,235,.7)");
      gr.addColorStop(1, "rgba(235,235,235,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
    });
    this.owned.push(this.smokeTex);
    for(let i=0;i<80;i++) {
      const s=new THREE.Sprite(new THREE.SpriteMaterial({map:this.smokeTex,transparent:true,depthWrite:false,opacity:0}));
      s.visible=false;this.scene.add(s);this.smoke.push({s,born:-100,v:new THREE.Vector3()});
    }

    // awan yang ditembus: lapisan tebal di tengah (whiteout singkat), sisa-sisa di atas
    const r = rng(7);
    const cloud = new THREE.TextureLoader().load('/angkasa/kapal/realism/cumulus.webp', t => {
      if (this.disposed) t.dispose();
      this.cloudReady = true;
    }, undefined, () => { this.cloudReady = true; });
    cloud.colorSpace = THREE.SRGBColorSpace;
    const texes = [cloud];
    this.owned.push(...texes);
    for (let i = 0; i < 110; i++) {
      // (awan rendah tidak perlu: foto panorama sudah punya awan) — lapisan tebal di tengah, sisa tipis di atas
      const band = i < 95 ? [150, 205] : [260, 320];
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: cloud, transparent: true, depthWrite: false, opacity: 0.95, fog: false }),
      );
      const y = band[0] + r() * (band[1] - band[0]);
      const ang = r() * Math.PI * 2;
      const rad = 2 + r() * 34;
      s.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad - 4);
      const sc = 16 + r() * 26;
      s.scale.set(sc, sc * 0.6, 1);
      s.material.rotation = (r() - .5) * .16;
      this.clouds.push(s);
      this.scene.add(s);
      this.owned.push(s.material);
    }
  }

  private buildGround() {
    const r = rng(5);
    this.ground.add(this.landscape.group);

    // landasan: beton bundar dengan cincin oranye & garis
    const padTex = canvasTexture(2048, 2048, (g) => {
      g.scale(4,4);
      g.fillStyle = "#9c9e97";
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 26000; i++) {
        g.fillStyle = r() < 0.5 ? "rgba(60,60,60,.12)" : "rgba(255,255,255,.08)";
        g.fillRect(r() * 512, r() * 512, 0.15 + r() * 0.55, 0.15 + r() * 0.55);
      }
      // Expansion joints and fine aggregate are sized for a six-meter pad.
      g.strokeStyle = "rgba(52,59,56,.27)"; g.lineWidth = .55;
      for(const t of [86,171,341,426]) {g.beginPath();g.moveTo(t,0);g.lineTo(t,512);g.moveTo(0,t);g.lineTo(512,t);g.stroke();}
      g.strokeStyle = "#d49b46";
      g.lineWidth = 16;
      g.beginPath();
      g.arc(256, 256, 190, 0, Math.PI * 2);
      g.stroke();
      g.strokeStyle = "rgba(255,255,255,.85)";
      g.lineWidth = 10;
      g.beginPath();
      g.arc(256, 256, 120, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "rgba(255,255,255,.85)";
      g.font = "bold 120px system-ui, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("R1", 256, 262);
    });
    const pad = new THREE.Mesh(new THREE.CircleGeometry(3.2, 128), new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.9 }));
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.01;
    pad.receiveShadow = true;
    padTex.anisotropy = 8;
    this.ground.add(pad);

    // tiang bendera Merah Putih di tepi landasan
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.6, roughness: 0.4 }));
    pole.position.set(-3.6, 1.6, -1.8);
    const flagTex = canvasTexture(64, 42, (g) => {
      g.fillStyle = "#e0161e";
      g.fillRect(0, 0, 64, 21);
      g.fillStyle = "#ffffff";
      g.fillRect(0, 21, 64, 21);
    });
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6, 14, 4), new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide, roughness: 0.8 }));
    flag.position.set(-3.6 + 0.46, 2.9, -1.8);
    this.flag = flag;
    this.flagRest = Float32Array.from(flag.geometry.getAttribute("position").array as Float32Array);
    pole.castShadow = flag.castShadow = true;
    this.ground.add(pole, flag);

    // burung: siluet kecil mengepakkan sayap, melintas pelan di langit
    const birdTex = canvasTexture(64, 32, (g) => {
      g.strokeStyle = "rgba(30,34,40,.85)";
      g.lineWidth = 4;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(4, 10);
      g.quadraticCurveTo(18, 4, 32, 18);
      g.quadraticCurveTo(46, 4, 60, 10);
      g.stroke();
    });
    this.owned.push(birdTex);
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Sprite(new THREE.SpriteMaterial({ map: birdTex, transparent: true, depthWrite: false }));
      b.position.set(-30 + i * 4 + r() * 3, 12 + r() * 6, 28 + r() * 10);
      b.scale.set(1.1, 0.55, 1);
      this.birds.push(b);
      this.owned.push(b.material);
      this.scene.add(b);
    }

    // latar foto panorama (gunung api, laut, pohon kelapa, hanggar) sebagai dinding melengkung di kejauhan,
    // menghadap arah pandang kamera darat; horizon foto (±26% dari bawah) tepat setinggi mata
    const R = 200,
      arc = 2.62, // ±150°
      H = (R * arc) / 3, // foto 3:1
      eye = 1.0;
    const pano = new THREE.TextureLoader().load("/angkasa/kapal/latar-landasan.webp", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.repeat.x = -1; // dilihat dari dalam silinder: balik agar tidak tercermin
      t.offset.x = 1;
      t.needsUpdate = true;
    });
    const center = -0.69; // arah pandang kamera darat (atan2 x, z)
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R, H, 96, 1, true, center - arc / 2, arc),
      new THREE.MeshBasicMaterial({ map: pano, side: THREE.BackSide, fog: false, depthWrite: false }),
    );
    wall.position.y = eye - 0.258 * H + H / 2;
    wall.renderOrder = -5;
    this.ground.add(wall);
    this.owned.push(pano);
    this.scene.add(this.ground);
    // Landscape owns its own instanced geometry and shader resources.
    for (const o of this.ground.children.filter(o => o !== this.landscape.group)) {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        this.owned.push(m.geometry);
        const mt = m.material as THREE.MeshStandardMaterial;
        this.owned.push(mt);
        if (mt.map) this.owned.push(mt.map);
      }
    }
  }

  /** model pesawat (klon dari lapisan pesawat) — hidung ke −z, badan berpusat di titik asal */
  setShip(model: THREE.Object3D, back: number) {
    this.rollG.add(model);
    this.mainFlame.position.set(0, 0.02, back * 0.9);
  }

  private puff(at: THREE.Vector3, spread: number) {
    const p=this.smoke[this.smokeCursor++ % this.smoke.length];
    p.s.visible=true; p.s.position.copy(at); p.born=this.t;
    const a=Math.random()*Math.PI*2;
    p.v.set(Math.cos(a)*spread,.3+Math.random()*.4,Math.sin(a)*spread);

  }

  /** u = kemajuan seluruh pembuka (0–GROUND_END untuk adegan ini) */
  update(u: number, dt: number, aspect: number, agamPose: (mode: "wave" | "walk" | "jump") => void) {
    this.t += dt;
    this.landscape.update(this.t);
    if (!this.shadowActorsReady && this.agamHost.children.length) {
      this.agamHost.traverse(o=>{if((o as THREE.Mesh).isMesh)o.castShadow=true;});
      this.shadowActorsReady=true;
    }
    // bendera berkibar (gelombang berjalan dari tiang ke ujung)
    if (this.flag && this.flagRest) {
      const pos = this.flag.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = this.flagRest[i * 3] + 0.45; // 0 di tiang
        const yv = this.flagRest[i * 3 + 1];
        pos.setZ(i, Math.sin(x * 7 - this.t * 6 + yv * 2) * 0.07 * x);
        pos.setY(i, yv - x * x * 0.05);
      }
      pos.needsUpdate = true;
      this.flag.geometry.computeVertexNormals();
    }
    // burung melintas & mengepak
    this.birds.forEach((b, i) => {
      b.position.x += dt * (2.2 + i * 0.15);
      if (b.position.x > 40) b.position.x = -40;
      b.position.y += Math.sin(this.t * 1.3 + i) * dt * 0.3;
      b.scale.y = 0.55 * (0.35 + 0.65 * Math.abs(Math.sin(this.t * 7 + i * 1.7)));
    });
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1 ? 62 : 50;
    this.camera.updateProjectionMatrix();

    const hover = sm(u, HOVER[0], HOVER[1]);
    const pitch = sm(u, PITCH[0], PITCH[1]);
    const climbK = Math.min(1, Math.max(0, (u - CLIMB[0]) / (CLIMB[1] - CLIMB[0])));
    // ketinggian: melayang ±2 m, lalu melesat makin cepat (sampai ±420 m di ruang adegan)
    const y = 0.56 + hover * 1.8 + 420 * Math.pow(climbK, 2.1);
    // Manuver ala wahana 4D selama menanjak: meliuk kiri-kanan (S), lalu satu guling penuh saat menembus awan tebal.
    const weaveK = sm(u, 0.33, 0.37) * (1 - sm(u, 0.5, GROUND_END));
    const wx = Math.sin(climbK * Math.PI * 2) * 2.2 * weaveK;
    const wz = Math.sin(climbK * Math.PI * 2 + 1) * 1.2 * weaveK;
    const bank = -Math.cos(climbK * Math.PI * 2) * 0.22 * weaveK; // miring ke arah belokan
    const barrel = 0; // Stabilized flight: no full-screen barrel roll.
    this.ship.position.set(wx, y, wz);
    this.shipBody.rotation.set(pitch * (Math.PI / 2) * 0.96, 0, 0);
    this.rollG.rotation.z = bank + barrel + Math.sin(this.t * 1.3) * 0.02 * hover;

    // mesin
    const side = hover * (1 - sm(u, 0.3, 0.36));
    this.sideU.uPower.value = side * (0.8 + 0.2 * Math.sin(this.t * 30));
    this.sideU.uTime.value = this.flameU.uTime.value = this.t;
    for (const f of this.sideFlames) f.scale.set(1, 1, 0.3 + side * 0.9);
    const main = sm(u, 0.27, 0.32);
    this.flameU.uPower.value = main * 1.1;
    this.mainFlame.scale.set(1 + main * 0.4, 1 + main * 0.4, 0.3 + main * (1.6 + climbK * 2));

    // asap di landasan saat mesin menyala
    if ((side > 0.2 || (main > 0.1 && climbK < 0.08)) && this.t - this.lastSmoke > 0.05) {
      this.lastSmoke = this.t;
      this.puff(new THREE.Vector3((Math.random() - 0.5) * 1.2, 0.2, (Math.random() - 0.5) * 1.2), 1.2 + main * 2);
    }
    this.smoke.forEach((p) => {
      if (!p.s.visible) return;
      const age = this.t - p.born;
      if (age > 3.5) {
        p.s.visible=false;
        return;
      }
      p.s.position.addScaledVector(p.v, dt);
      const sc = 0.8 + age * 1.6;
      p.s.scale.set(sc, sc, 1);
      p.s.material.opacity = 0.75 * (1 - age / 3.5);
    });

    // Agam: melambai → berjalan ke samping pesawat (menghadap arah jalan) → melompat naik ke atas kokpit →
    // turun ke kursi (tertutup kaca kokpit yang gelap). Tidak mengecil: ukurannya tetap.
    const walk = sm(u, BOARD[0], WALK_END);
    const jump = Math.min(1, Math.max(0, (u - WALK_END) / (JUMP_END - WALK_END)));
    const sink = sm(u, JUMP_END, BOARD[1]);
    const ap = this.agamHost.position;
    if (u < WALK_END) ap.lerpVectors(AGAM_START, AGAM_SIDE, walk);
    else if (u < JUMP_END) {
      const e = jump * jump * (3 - 2 * jump);
      ap.lerpVectors(AGAM_SIDE, AGAM_TOP, e);
      ap.y += Math.sin(Math.PI * jump) * 0.35; // lengkung lompatan
    } else ap.lerpVectors(AGAM_TOP, AGAM_SEAT, sink);
    const faceCam = 2.57,
      faceWalk = Math.atan2(AGAM_SIDE.x - AGAM_START.x, AGAM_SIDE.z - AGAM_START.z),
      faceShip = Math.atan2(AGAM_TOP.x - AGAM_SIDE.x, AGAM_TOP.z - AGAM_SIDE.z);
    let yaw = lerpAngle(faceCam, faceWalk, sm(u, BOARD[0], BOARD[0] + 0.012));
    if (u >= WALK_END - 0.008) yaw = lerpAngle(faceWalk, faceShip, sm(u, WALK_END - 0.008, WALK_END + 0.004));
    if (u >= JUMP_END) yaw = lerpAngle(faceShip, Math.PI, sink); // duduk menghadap depan (moncong −z → Agam menghadap −z)
    const sway = u < BOARD[0] ? Math.sin(this.t * 1.4) * 0.06 : 0;
    this.agamHost.rotation.set(0, yaw + sway, u < BOARD[0] ? Math.sin(this.t * 2.1) * 0.025 : 0);
    this.agamHost.scale.setScalar(1);
    agamPose(u < BOARD[0] ? "wave" : u < WALK_END ? "walk" : "jump");
    this.agamHost.visible = u < BOARD[1] + 0.002;

    // kamera: di darat menatap landasan dari depan-samping → mengikuti ke atas → di bawah pesawat, menatap ke atas
    const c = this.camera;
    const follow = sm(u, 0.22, 0.34);
    // depan-samping (moncong & kokpit menghadap kamera), maju pelan + goyang halus seperti kamera dipegang
    // mulai dekat ke Agam yang melambai → mundur memperlihatkan pesawat saat Agam naik
    // kamera tetap dekat & mengikuti Agam sampai ia masuk kokpit, baru mundur memperlihatkan pesawat
    const reveal = sm(u, 0.185, 0.245);
    const follow0 = sm(u, BOARD[0], BOARD[1]);
    const ag = this.agamHost.position;
    const groundPos = new THREE.Vector3(
      2.55 - 0.6 * follow0 + 1.15 * reveal + Math.sin(this.t * 0.6) * 0.05,
      0.8 + 0.35 * follow0 + 0.1 * reveal + Math.sin(this.t * 0.9) * 0.03,
      -2.7 - 0.2 * follow0 - 1.9 * reveal,
    );
    // kamera ikut naik separuh saja saat Agam melompat (tidak mendongak berlebihan)
    const lookAgam = new THREE.Vector3(ag.x, ag.y * 0.45 + 0.45, ag.z);
    const groundLook = lookAgam.lerp(new THREE.Vector3(-0.3, 0.8, 0), reveal);
    groundLook.y += hover * 1.6;
    if (aspect < 1) {
      // Fit both Agam and the ship in portrait instead of cropping the cockpit at the right edge.
      groundLook.x *= .55;
      groundPos.sub(groundLook).multiplyScalar(Math.min(1.65,1/Math.sqrt(aspect))).add(groundLook);
    }
    // kamera mengejar dengan sedikit tertinggal di belokan (terasa ngebut & meliuk)
    const chasePos = new THREE.Vector3(wx * 0.7 + 1.3, y - 5.2, wz * 0.7 + 2.4);
    const chaseLook = new THREE.Vector3(wx, y + 6, wz - 0.3);
    c.position.lerpVectors(groundPos, chasePos, follow);
    if (follow > 0) c.position.y = THREE.MathUtils.lerp(groundPos.y + hover * 0.6, chasePos.y, follow);
    const look = groundLook.lerp(chaseLook, follow);
    // getaran kamera saat mesin utama menyala & menembus awan
    const shake = (main * (1 - climbK) * 0.05 + sm(u, 0.4, 0.46) * (1 - sm(u, 0.47, 0.5)) * 0.08) * (aspect < 1 ? .35 : .55);
    c.position.x += Math.sin(this.t * 13.7) * .35 * shake;
    c.position.y += Math.sin(this.t * 17.3 + .8) * .25 * shake;
    // arah "atas" layar: normal di darat; saat menatap ke atas pakai −z (agar orientasi stabil), ikut miring saat belok
    this.camUp.set(0, 1 - follow, -follow).normalize();
    c.up.copy(this.camUp);
    c.lookAt(look);
    if (follow > 0) {
      const fwd = look.clone().sub(c.position).normalize();
      c.up.applyAxisAngle(fwd, bank * 0.2 * follow);
      c.lookAt(look);
    }
    // FOV melebar saat ngebut (kesan kecepatan)
    c.fov += climbK * 7 * (1 - sm(u, 0.5, GROUND_END));
    c.updateProjectionMatrix();
    this.sky.position.copy(c.position);

    // langit menggelap sesuai ketinggian; kabut tipis mengikuti warna langit
    const space = sm(y, 230, 400);
    this.skyU.uSpace.value = space;
    this.fog.color.set(0xc4d5e2).lerp(new THREE.Color(0x05070f), space);
    this.fog.far = 650 + space * 2000;
    this.sun.intensity = 2.6 + space * 0.8;
    this.ground.visible = y < 260;
  }

  render(renderer: THREE.WebGLRenderer) {
    const exposure = renderer.toneMappingExposure;
    renderer.toneMappingExposure = .92;
    renderer.render(this.scene, this.camera);
    renderer.toneMappingExposure = exposure;
  }

  dispose() {
    this.disposed = true;
    for (const p of this.smoke) p.s.material.dispose();
    this.landscape.dispose();
    this.sun.shadow.dispose();
    new Set(this.owned).forEach((o) => o.dispose());
  }
}
