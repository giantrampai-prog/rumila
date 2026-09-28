// POV di dalam kapsul: kabin berjendela (dunia 3D di luar terlihat lewat lubang jendela), kursi, konsol
// dengan layar hidup (ketinggian, kecepatan, gaya G), astronaut, dan boneka "indikator gravitasi" yang
// menjuntai saat ada gravitasi terasa dan melayang saat tanpa bobot.
// Dirender sesudah dunia: dunia digambar dari posisi kapsul dengan orientasi kamera kabin yang sama,
// lalu kabin digambar di atasnya (bagian jendela sengaja kosong).

import * as THREE from "three";

const TAU = Math.PI * 2;

export interface CabinState {
  altKm: number;
  speedKmh: number;
  g: number;
  /** 0 = gravitasi terasa (boneka menjuntai), 1 = tanpa bobot (melayang) */
  float: number;
  t: number;
}

function quilt() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e9ecf1";
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "#c9ced8";
  g.lineWidth = 3;
  for (let i = 0; i <= 256; i += 64) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i, 256);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i);
    g.lineTo(256, i);
    g.stroke();
  }
  g.fillStyle = "#b9c0cc";
  for (let x = 32; x < 256; x += 64) for (let y = 32; y < 256; y += 64) g.fillRect(x - 3, y - 3, 6, 6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 2);
  return t;
}

class Screen {
  canvas = document.createElement("canvas");
  tex: THREE.CanvasTexture;
  mesh: THREE.Mesh;
  private last = "";
  constructor(w: number, h: number) {
    this.canvas.width = 256;
    this.canvas.height = 160;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: this.tex, toneMapped: false }));
  }
  draw(title: string, value: string, bar: number | null, color: string) {
    const key = title + value + (bar === null ? "" : bar.toFixed(2));
    if (key === this.last) return;
    this.last = key;
    const g = this.canvas.getContext("2d")!;
    g.fillStyle = "#07121f";
    g.fillRect(0, 0, 256, 160);
    g.strokeStyle = "#1d3b5c";
    g.lineWidth = 6;
    g.strokeRect(3, 3, 250, 154);
    g.fillStyle = "#7fb4e8";
    g.font = "bold 22px system-ui, sans-serif";
    g.fillText(title, 16, 34);
    g.fillStyle = color;
    g.font = "bold 46px system-ui, sans-serif";
    g.fillText(value, 16, 92);
    if (bar !== null) {
      g.fillStyle = "#12263d";
      g.fillRect(16, 116, 224, 22);
      g.fillStyle = color;
      g.fillRect(16, 116, 224 * Math.min(1, bar), 22);
    }
    this.tex.needsUpdate = true;
  }
}

/** Paha, lutut, dan sarung tangan astronaut dari sudut pandang matanya sendiri. */
export function povBody() {
  const g = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0xf1f0ea, roughness: 0.8 });
  // warna baju Agam: putih, aksen biru dongker (lutut, gelang) & oranye (garis), sarung tangan putih
  const grey = new THREE.MeshStandardMaterial({ color: 0x1f2f7a, roughness: 0.6 });
  const red = new THREE.MeshStandardMaterial({ color: 0xf07a1f, roughness: 0.6 });
  const glove = new THREE.MeshStandardMaterial({ color: 0xf2f2f0, roughness: 0.75 });
  const legs: THREE.Group[] = [];
  const hands: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.3, 6, 14), suit);
    thigh.rotation.x = Math.PI / 2;
    thigh.position.z = 0.2;
    const knee = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.014, 6, 18), grey);
    knee.position.z = 0.36;
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.077, 0.008, 6, 18), red);
    stripe.position.z = 0.1;
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.2, 6, 12), suit);
    shin.position.set(0, -0.12, 0.42);
    leg.add(thigh, knee, stripe, shin);
    leg.position.set(sx * 0.1, -0.28, -0.1);
    g.add(leg);
    legs.push(leg);
    const hand = new THREE.Group();
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.06, 14), grey);
    cuff.rotation.x = Math.PI / 2;
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.1), glove);
    palm.position.z = 0.07;
    // lengan baju: menyambung dari sarung tangan ke bahu (keluar layar) — tangan tidak melayang terpisah
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.55, 6, 14), suit);
    sleeve.rotation.x = Math.PI / 2;
    sleeve.position.set(0, -0.02, -0.33);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 18), grey);
    ring.position.z = -0.06;
    hand.add(cuff, palm, sleeve, ring);
    for (let k = 0; k < 4; k++) {
      const fg = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.04, 3, 6), glove);
      fg.rotation.x = Math.PI / 2;
      fg.position.set(-0.03 + k * 0.02, 0, 0.14);
      hand.add(fg);
    }
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.03, 3, 6), glove);
    thumb.position.set(-sx * 0.05, 0, 0.07);
    thumb.rotation.z = Math.PI / 2;
    hand.add(thumb);
    g.add(hand);
    hands.push(hand);
  }
  return {
    group: g,
    update(f: number, gForce: number, t: number) {
      const sink = f < 0.5 ? Math.min(0.02, (gForce - 1) * 0.008) : 0;
      legs.forEach((leg, i) => {
        const sx = i ? 1 : -1;
        leg.position.set(sx * 0.1, -0.28 - sink + f * (0.04 + Math.sin(t * 0.5 + i) * 0.03), -0.1);
        leg.rotation.set(f * Math.sin(t * 0.4 + i) * 0.15, sx * f * 0.1, 0);
      });
      hands.forEach((hand, i) => {
        const sx = i ? 1 : -1;
        // duduk: tangan di atas lutut; melayang: tangan terangkat ke depan (seperti menyapa)
        hand.position.set(sx * (0.34 - f * 0.1), -0.34 - sink + f * (0.32 + Math.sin(t * 0.7 + i) * 0.04), 0.14 + f * 0.1);
        hand.rotation.set(-0.2 - f * 0.9, 0, sx * f * Math.sin(t * 0.6) * 0.3);
      });
    },
  };
}

export class Cabin {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(72, 1, 0.01, 50);
  /** tubuh sendiri yang terlihat dari mata astronaut (POV): paha, lutut, sarung tangan */
  private pov = povBody();
  private toy = new THREE.Group();
  private string: THREE.Line;
  private anchor = new THREE.Vector3(0.28, 0.66, 0.5);
  private screens: Screen[] = [];
  private disposables: { dispose(): void }[] = [];

  constructor() {
    const s = this.scene;
    // Dinding kabin: kerucut terpotong dari potongan-potongan; bagian depan-atas dikosongkan untuk jendela.
    const wall = new THREE.MeshStandardMaterial({ map: quilt(), roughness: 0.85, side: THREE.DoubleSide });
    const segs = 16,
      rows = 5,
      r0 = 1.05,
      r1 = 0.55,
      y0 = -0.6,
      y1 = 0.95;
    const pos: number[] = [];
    const uv: number[] = [];
    const WIN = [15, 0, 1]; // tiga jendela di depan (arah +Z, arah pandang kamera)
    const isWindow = (i: number, j: number) => j >= 1 && j <= 3 && WIN.includes(i);
    for (let i = 0; i < segs; i++) {
      for (let j = 0; j < rows; j++) {
        if (isWindow(i, j)) continue;
        const a0 = (i / segs) * TAU,
          a1 = ((i + 1) / segs) * TAU;
        const h0 = y0 + ((y1 - y0) * j) / rows,
          h1 = y0 + ((y1 - y0) * (j + 1)) / rows;
        const ra = r0 + ((r1 - r0) * j) / rows,
          rb = r0 + ((r1 - r0) * (j + 1)) / rows;
        const P = (a: number, r: number, h: number) => [Math.sin(a) * r, h, Math.cos(a) * r];
        const q = [P(a0, ra, h0), P(a1, ra, h0), P(a1, rb, h1), P(a0, rb, h1)];
        for (const k of [0, 1, 2, 0, 2, 3]) pos.push(...q[k]);
        const U = [
          [i / segs, j / rows],
          [(i + 1) / segs, j / rows],
          [(i + 1) / segs, (j + 1) / rows],
          [i / segs, (j + 1) / rows],
        ];
        for (const k of [0, 1, 2, 0, 2, 3]) uv.push(...U[k]);
      }
    }
    const wg = new THREE.BufferGeometry();
    wg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    wg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    wg.computeVertexNormals();
    s.add(new THREE.Mesh(wg, wall));
    // atap & lantai
    const cap = new THREE.Mesh(new THREE.CircleGeometry(r1, 32), wall);
    cap.rotation.x = Math.PI / 2;
    cap.position.y = y1;
    const floor = new THREE.Mesh(new THREE.CircleGeometry(r0, 32), new THREE.MeshStandardMaterial({ color: 0x9aa3b0, roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = y0;
    s.add(cap, floor);
    // bingkai jendela
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b3240, roughness: 0.5, metalness: 0.4 });
    for (const i of WIN) {
      for (const j of [1, 4]) {
        const a = ((i + 0.5) / segs) * TAU;
        const h = y0 + ((y1 - y0) * j) / rows;
        const r = r0 + ((r1 - r0) * j) / rows;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.04), frameMat);
        bar.position.set(Math.sin(a) * r, h, Math.cos(a) * r);
        bar.rotation.y = a;
        s.add(bar);
      }
      const a = (i / segs) * TAU;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.96, 0.04), frameMat);
      const r = r0 + ((r1 - r0) * 2.5) / rows;
      post.position.set(Math.sin(a) * r, y0 + ((y1 - y0) * 2.5) / rows, Math.cos(a) * r);
      post.rotation.set(-Math.atan((r0 - r1) / (y1 - y0)), a, 0); // ikut kemiringan dinding
      s.add(post);
    }
    // Konsol & layar di bawah jendela
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x3a4252, roughness: 0.6, metalness: 0.3 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.34), consoleMat);
    desk.position.set(0, -0.44, 0.66);
    desk.rotation.set(-0.5, 0, 0);
    s.add(desk);
    for (let k = 0; k < 3; k++) {
      const sc = new Screen(0.3, 0.19);
      sc.mesh.position.set(-0.3 + k * 0.3, -0.36, 0.62 - Math.abs(k - 1) * 0.05);
      sc.mesh.lookAt(0, 0.14, -0.22); // menghadap mata astronaut
      s.add(sc.mesh);
      this.screens.push(sc);
      this.disposables.push(sc.tex, sc.mesh.geometry, sc.mesh.material as THREE.Material);
    }
    // Tombol-tombol kecil berwarna
    const btnGeo = new THREE.BoxGeometry(0.03, 0.012, 0.03);
    const colors = [0xff5a4e, 0xffbe0b, 0x3ddc84, 0x2f86ff];
    for (let k = 0; k < 16; k++) {
      const b = new THREE.Mesh(btnGeo, new THREE.MeshStandardMaterial({ color: colors[k % 4], emissive: colors[k % 4], emissiveIntensity: 0.4 }));
      b.position.set(-0.42 + (k % 8) * 0.12, -0.5 - Math.floor(k / 8) * 0.04, 0.56 + Math.floor(k / 8) * 0.03);
      s.add(b);
    }
    // Tiga kursi (astronaut di kursi tengah)
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x23324a, roughness: 0.7 });
    for (const x of [-0.42, 0, 0.42]) {
      const seat = new THREE.Group();
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.5, 0.06), seatMat);
      back.position.set(0, 0.05, -0.18);
      back.rotation.x = -0.55;
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.34), seatMat);
      base.position.set(0, -0.2, 0);
      seat.add(back, base);
      seat.position.set(x, -0.2, -0.05);
      seat.rotation.y = 0.18;
      s.add(seat);
    }
    // POV: kamera di mata astronaut; yang terlihat hanya kaki & tangannya sendiri
    s.add(this.pov.group);
    // Boneka (bintang kecil berwajah) tergantung dari atap
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffbe0b, roughness: 0.8 }));
    for (let k = 0; k < 5; k++) {
      const arm = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.06, 8), body.material);
      const a = (k / 5) * TAU;
      arm.position.set(Math.sin(a) * 0.05, Math.cos(a) * 0.05, 0);
      arm.rotation.z = -a;
      this.toy.add(arm);
    }
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2b1d4e });
    for (const x of [-0.015, 0.015]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), eyeMat);
      eye.position.set(x, 0.01, 0.043);
      this.toy.add(eye);
    }
    this.toy.add(body);
    s.add(this.toy);
    this.string = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 12 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: 0xffffff }));
    this.string.frustumCulled = false;
    s.add(this.string);
    // Cahaya kabin
    const lamp = new THREE.PointLight(0xfff2dc, 2.2, 4, 1.5);
    lamp.position.set(0, 0.8, -0.2);
    s.add(lamp, new THREE.AmbientLight(0xb8c6de, 0.55), new THREE.HemisphereLight(0xdfe9ff, 0x3a3f4a, 0.35));
    // Kamera: di belakang-kanan kepala astronaut, menatap konsol & jendela
    this.camera.position.set(0, 0.14, -0.22);
    this.camera.lookAt(0, 0.02, 0.9);
  }

  resize(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  private focusPoint = new THREE.Vector3(0, 0.02, 0.9);

  focus(target: string, blend: number) {
    const point = target === "boneka" ? this.toy.position.clone()
      : target === "kursi" ? new THREE.Vector3(-0.3, -0.3, 0.3)
      : target === "konsol" ? new THREE.Vector3(0.2, -0.36, 0.62)
      : new THREE.Vector3(0, 0.02, 0.9);
    this.focusPoint.lerp(point, blend);
    this.camera.lookAt(this.focusPoint);
    const fov = target === "boneka" ? 48 : target === "konsol" ? 58 : 72;
    this.camera.fov += (fov - this.camera.fov) * blend;
    this.camera.updateProjectionMatrix();
  }

  update(c: CabinState) {
    const f = c.float;
    // Tubuh sendiri (POV): duduk tertekan saat gaya G besar; saat tanpa bobot kaki & tangan melayang pelan
    this.pov.update(f, c.g, c.t);
    // Boneka: menjuntai lurus (bergoyang kecil) atau melayang bebas dengan tali kendur
    const hang = new THREE.Vector3(this.anchor.x + Math.sin(c.t * 1.4) * 0.02 * (1 - f), this.anchor.y - 0.26, this.anchor.z + Math.cos(c.t * 1.1) * 0.015 * (1 - f));
    const fl = new THREE.Vector3(this.anchor.x + Math.sin(c.t * 0.35) * 0.18, this.anchor.y - 0.2 + Math.sin(c.t * 0.5) * 0.08, this.anchor.z + Math.cos(c.t * 0.28) * 0.14);
    const p = hang.lerp(fl, f);
    this.toy.position.copy(p);
    this.toy.rotation.set(f * c.t * 0.4, f * c.t * 0.3 + Math.sin(c.t) * 0.2, f * c.t * 0.2);
    const sp = this.string.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let k = 0; k < sp.count; k++) {
      const u = k / (sp.count - 1);
      const x = this.anchor.x + (p.x - this.anchor.x) * u;
      const y = this.anchor.y + (p.y - this.anchor.y) * u;
      const z = this.anchor.z + (p.z - this.anchor.z) * u;
      // tali kendur saat melayang: melengkung ke samping
      const slack = f * Math.sin(Math.PI * u) * 0.08;
      sp.setXYZ(k, x + slack * Math.sin(c.t * 0.4), y + slack * 0.5, z + slack * Math.cos(c.t * 0.3));
    }
    sp.needsUpdate = true;
    // Layar
    const km = c.altKm;
    this.screens[0].draw("KETINGGIAN", km < 1 ? `${Math.round(km * 1000)} m` : `${Math.round(km).toLocaleString("id-ID")} km`, Math.min(1, km / 400), "#7cf2c2");
    this.screens[1].draw("KECEPATAN", `${Math.round(c.speedKmh).toLocaleString("id-ID")}`, Math.min(1, c.speedKmh / 28000), "#ffd166");
    this.screens[2].draw("GAYA G", `${c.g.toFixed(1)} g`, Math.min(1, c.g / 4), c.g > 2.5 ? "#ff7a6b" : c.g < 0.2 ? "#b18cff" : "#7fb4e8");
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) {
        (mat as THREE.MeshStandardMaterial).map?.dispose();
        mat.dispose();
      }
    });
    this.disposables.forEach((d) => d.dispose());
  }
}
