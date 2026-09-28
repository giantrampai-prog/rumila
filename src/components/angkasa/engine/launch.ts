// Adegan pembuka di darat: landasan Rinoya-1 di Bumi → Agam melambai & naik → pesawat melayang, menegak, lalu
// melesat menembus awan; langit biru menggelap sampai hitam berbintang. Setelah itu tampilan beralih ke angkasa
// (Bumi dari luar, lalu tata surya). Dirender menutupi seluruh layar selama bagian darat berlangsung.

import * as THREE from "three";

const sm = (u: number, a: number, b: number) => {
  const x = Math.min(1, Math.max(0, (u - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** bagian waktu pembuka (0–1 dari seluruh pembuka) */
export const GROUND_END = 0.55;
const BOARD = [0.1, 0.19]; // Agam berjalan & masuk kokpit
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

/** awan: gumpalan lembut bertumpuk, bawah sedikit abu-abu */
function cloudTexture(seed: number) {
  const r = rng(seed);
  return canvasTexture(256, 256, (g) => {
    for (let i = 0; i < 26; i++) {
      const x = 128 + (r() - 0.5) * 150,
        y = 128 + (r() - 0.5) * 70,
        rad = 30 + r() * 55;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      const shade = Math.round(235 - (y - 90) * 0.35);
      gr.addColorStop(0, `rgba(${shade},${shade},${shade + 6},.55)`);
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
    }
  });
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
  private smokeTex: THREE.Texture;
  private ground = new THREE.Group();
  private fog = new THREE.Fog(0xc4d5e2, 40, 650);
  private sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  private t = 0;
  private lastSmoke = 0;
  private owned: { dispose(): void }[] = [];
  private flag: THREE.Mesh | null = null;
  private flagRest: Float32Array | null = null;
  private birds: THREE.Sprite[] = [];

  constructor(private agamHost: THREE.Group) {
    this.scene.fog = this.fog;
    this.sun.position.set(-30, 40, 20);
    this.scene.add(this.sun, new THREE.HemisphereLight(0xcfe6ff, 0x3a5a2a, 1.1));

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
      g.translate(0, -0.5, 0);
      g.rotateX(-Math.PI / 2); // ujung ke +z
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

    // awan yang ditembus: lapisan tebal di tengah (whiteout singkat), sisa-sisa di atas
    const r = rng(7);
    const texes = [cloudTexture(3), cloudTexture(11), cloudTexture(29)];
    this.owned.push(...texes);
    for (let i = 0; i < 110; i++) {
      // (awan rendah tidak perlu: foto panorama sudah punya awan) — lapisan tebal di tengah, sisa tipis di atas
      const band = i < 95 ? [150, 205] : [260, 320];
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texes[i % 3], transparent: true, depthWrite: false, opacity: 0.95, fog: false }),
      );
      const y = band[0] + r() * (band[1] - band[0]);
      const ang = r() * Math.PI * 2;
      const rad = 2 + r() * 34;
      s.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad - 4);
      const sc = 16 + r() * 26;
      s.scale.set(sc, sc * 0.6, 1);
      s.material.rotation = r() * Math.PI;
      this.clouds.push(s);
      this.scene.add(s);
      this.owned.push(s.material);
    }
  }

  private buildGround() {
    const r = rng(5);
    // rumput dari foto yang sama (diulang bercermin agar tidak terlihat sambungan)
    const grass = new THREE.TextureLoader().load("/angkasa/kapal/rumput.jpg", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
    });
    grass.wrapS = grass.wrapT = THREE.MirroredRepeatWrapping;
    grass.repeat.set(70, 140);
    const gm = new THREE.MeshStandardMaterial({ map: grass, roughness: 1, color: 0xf2f2f2 });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(195, 64), gm);
    ground.rotation.x = -Math.PI / 2;
    this.ground.add(ground);

    // landasan: beton bundar dengan cincin oranye & garis
    const padTex = canvasTexture(512, 512, (g) => {
      g.fillStyle = "#9a9a96";
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1800; i++) {
        g.fillStyle = r() < 0.5 ? "rgba(60,60,60,.12)" : "rgba(255,255,255,.08)";
        g.fillRect(r() * 512, r() * 512, 2 + r() * 4, 2 + r() * 4);
      }
      g.strokeStyle = "#ff8a1f";
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
    const pad = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.9 }));
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.01;
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
    this.ground.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        this.owned.push(m.geometry);
        const mt = m.material as THREE.MeshStandardMaterial;
        this.owned.push(mt);
        if (mt.map) this.owned.push(mt.map);
      }
    });
  }

  /** model pesawat (klon dari lapisan pesawat) — hidung ke −z, badan berpusat di titik asal */
  setShip(model: THREE.Object3D, back: number) {
    this.rollG.add(model);
    this.mainFlame.position.set(0, 0.02, back * 0.9);
  }

  private puff(at: THREE.Vector3, spread: number) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.smokeTex, transparent: true, depthWrite: false, opacity: 0.8 }));
    s.position.copy(at);
    const a = Math.random() * Math.PI * 2;
    this.smoke.push({ s, born: this.t, v: new THREE.Vector3(Math.cos(a) * spread, 0.3 + Math.random() * 0.4, Math.sin(a) * spread) });
    this.scene.add(s);
  }

  /** u = kemajuan seluruh pembuka (0–GROUND_END untuk adegan ini) */
  update(u: number, dt: number, aspect: number, agamPose: (wave: boolean) => void) {
    this.t += dt;
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
    const wx = Math.sin(climbK * Math.PI * 3) * 5 * weaveK;
    const wz = Math.sin(climbK * Math.PI * 2 + 1) * 2.5 * weaveK;
    const bank = -Math.cos(climbK * Math.PI * 3) * 0.55 * weaveK; // miring ke arah belokan
    const barrel = sm(u, 0.405, 0.465) * Math.PI * 2;
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
    this.smoke = this.smoke.filter((p) => {
      const age = this.t - p.born;
      if (age > 3.5) {
        this.scene.remove(p.s);
        p.s.material.dispose();
        return false;
      }
      p.s.position.addScaledVector(p.v, dt);
      const sc = 0.8 + age * 1.6;
      p.s.scale.set(sc, sc, 1);
      p.s.material.opacity = 0.75 * (1 - age / 3.5);
      return true;
    });

    // Agam: berdiri di samping pesawat & melambai, lalu berjalan ke pintu kokpit dan masuk
    const board = sm(u, BOARD[0], BOARD[1]);
    this.agamHost.position.set(1.35 - 1.0 * board, 0.9 * sm(u, BOARD[0] + 0.05, BOARD[1]), -0.8 + 0.6 * board);
    // badan sedikit bergoyang (tidak kaku) saat berdiri melambai
    this.agamHost.rotation.set(0, Math.PI - 0.6 - 1.2 * board + Math.sin(this.t * 1.4) * 0.06, Math.sin(this.t * 2.1) * 0.025);
    this.agamHost.scale.setScalar(1 - 0.5 * sm(u, BOARD[0] + 0.05, BOARD[1]));
    agamPose(u < BOARD[0] + 0.02);
    this.agamHost.visible = u < BOARD[1];

    // kamera: di darat menatap landasan dari depan-samping → mengikuti ke atas → di bawah pesawat, menatap ke atas
    const c = this.camera;
    const follow = sm(u, 0.22, 0.34);
    // depan-samping (moncong & kokpit menghadap kamera), maju pelan + goyang halus seperti kamera dipegang
    // mulai dekat ke Agam yang melambai → mundur memperlihatkan pesawat saat Agam naik
    const reveal = sm(u, 0.07, 0.2);
    const groundPos = new THREE.Vector3(
      2.7 + 1.0 * reveal + Math.sin(this.t * 0.6) * 0.05,
      0.75 + 0.5 * reveal + Math.sin(this.t * 0.9) * 0.03,
      -2.9 - 1.9 * reveal,
    );
    const groundLook = new THREE.Vector3(1.3 - 1.6 * reveal, 0.42 + 0.4 * reveal + hover * 1.6, -0.75 + 0.75 * reveal);
    // kamera mengejar dengan sedikit tertinggal di belokan (terasa ngebut & meliuk)
    const chasePos = new THREE.Vector3(wx * 0.7 + 1.3, y - 5.2, wz * 0.7 + 2.4);
    const chaseLook = new THREE.Vector3(wx, y + 6, wz - 0.3);
    c.position.lerpVectors(groundPos, chasePos, follow);
    if (follow > 0) c.position.y = THREE.MathUtils.lerp(groundPos.y + hover * 0.6, chasePos.y, follow);
    const look = groundLook.lerp(chaseLook, follow);
    // getaran kamera saat mesin utama menyala & menembus awan
    const shake = (main * (1 - climbK) * 0.05 + sm(u, 0.4, 0.46) * (1 - sm(u, 0.47, 0.5)) * 0.08) * (aspect < 1 ? 1.3 : 1);
    c.position.x += (Math.random() - 0.5) * shake;
    c.position.y += (Math.random() - 0.5) * shake;
    // arah "atas" layar: normal di darat; saat menatap ke atas pakai −z (agar orientasi stabil), ikut miring saat belok
    this.camUp.set(0, 1 - follow, -follow).normalize();
    c.up.copy(this.camUp);
    c.lookAt(look);
    if (follow > 0) {
      const fwd = look.clone().sub(c.position).normalize();
      c.up.applyAxisAngle(fwd, bank * 0.45 * follow);
      c.lookAt(look);
    }
    // FOV melebar saat ngebut (kesan kecepatan)
    c.fov += climbK * 14 * (1 - sm(u, 0.5, GROUND_END));
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
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    for (const p of this.smoke) p.s.material.dispose();
    this.owned.forEach((o) => o.dispose());
  }
}
