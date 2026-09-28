// POV di dalam kapsul: kabin berjendela (dunia 3D di luar terlihat lewat lubang jendela), kursi, konsol
// dengan layar hidup (ketinggian, kecepatan, gaya G), astronaut, dan boneka "indikator gravitasi" yang
// menjuntai saat ada gravitasi terasa dan melayang saat tanpa bobot.
// Dirender sesudah dunia: dunia digambar dari posisi kapsul dengan orientasi kamera kabin yang sama,
// lalu kabin digambar di atasnya (bagian jendela sengaja kosong).

import * as THREE from "three";

import { buildCabinInterior, cabinFabric, disposeCabin, plushStar, rounded, tube } from "./cabin-interior";

export interface CabinState {
  altKm: number;
  speedKmh: number;
  g: number;
  /** 0 = gravitasi terasa (boneka menjuntai), 1 = tanpa bobot (melayang) */
  float: number;
  t: number;
}

class Screen {
  canvas = document.createElement("canvas");
  tex: THREE.CanvasTexture;
  mesh: THREE.Mesh;
  private last = "";
  constructor(w: number, h: number) {
    this.canvas.width = 768;
    this.canvas.height = 480;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 4;
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: this.tex, toneMapped: false }));
  }
  draw(title: string, value: string, bar: number | null, color: string) {
    const key = title + value + (bar === null ? "" : bar.toFixed(2));
    if (key === this.last) return;
    this.last = key;
    const g = this.canvas.getContext("2d")!;
    g.fillStyle = "#08131e"; g.fillRect(0, 0, 768, 480);
    const glow = g.createLinearGradient(0, 0, 0, 480);
    glow.addColorStop(0, "#162a38"); glow.addColorStop(1, "#071019");
    g.fillStyle = glow; g.fillRect(4, 4, 760, 472);
    g.fillStyle = "#91abae"; g.font = "500 20px system-ui";
    g.fillText("R1  /  TELEMETRI KAPSUL", 30, 38);
    g.fillStyle = "#7bd3b1"; g.beginPath(); g.arc(713, 31, 5, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#d2dfdf"; g.font = "600 36px system-ui"; g.fillText(title, 30, 110);
    g.strokeStyle = "#29424b"; g.lineWidth = 2; g.beginPath(); g.moveTo(30, 136); g.lineTo(738, 136); g.stroke();
    g.fillStyle = color; g.font = `500 ${value.length > 9 ? 72 : 96}px system-ui`;
    g.fillText(value, 30, 259);
    g.fillStyle = "#819ba4"; g.font = "24px system-ui";
    g.fillText(title === "KECEPATAN" ? "KILOMETER PER JAM" : title === "GAYA G" ? "GAYA YANG DIRASAKAN AWAK" : "DARI PERMUKAAN BUMI", 33, 301);
    const v = Math.max(0, Math.min(1, bar ?? 0));
    for (let i = 0; i < 40; i++) {
      g.fillStyle = i / 40 < v ? color : "#21323e"; g.fillRect(32 + i * 17.5, 347, 12, 27);
    }
    g.fillStyle = "#66838d"; g.font = "20px system-ui";
    g.fillText("SIMULASI PENERBANGAN", 32, 439);
    g.textAlign = "right"; g.fillText("RINOYA", 730, 439); g.textAlign = "left";
    this.tex.needsUpdate = true;
  }
}

/** Paha, lutut, dan sarung tangan astronaut dari sudut pandang matanya sendiri. */
export function povBody() {
  const g = new THREE.Group();
  const suit = cabinFabric(0xcbd0cc, 3);
  // warna baju Agam: putih, aksen biru dongker (lutut, gelang) & oranye (garis), sarung tangan putih
  const grey = cabinFabric(0x293b4e, 3);
  const red = new THREE.MeshStandardMaterial({ color: 0xf07a1f, roughness: 0.6 });
  const glove = cabinFabric(0xd3d5ca, 2);
  const legs: THREE.Group[] = [];
  const hands: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.3, 10, 28), suit);
    thigh.rotation.x = Math.PI / 2;
    thigh.position.z = 0.2;
    const knee = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.014, 6, 18), grey);
    knee.position.z = 0.36;
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.077, 0.008, 6, 18), red);
    stripe.position.z = 0.1;
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.2, 10, 28), suit);
    shin.position.set(0, -0.12, 0.42);
    leg.add(thigh, knee, stripe, shin);
    leg.position.set(sx * 0.1, -0.28, -0.1);
    g.add(leg);
    legs.push(leg);
    const hand = new THREE.Group();
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.06, 32), grey);
    cuff.rotation.x = Math.PI / 2;
    const palm = rounded(hand, [0.088, 0.034, 0.10], [0, 0, 0.07], glove, 0.016);
    // lengan baju: menyambung dari sarung tangan ke bahu (keluar layar) — tangan tidak melayang terpisah
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.55, 10, 24), suit);
    sleeve.rotation.x = Math.PI / 2;
    sleeve.position.set(0, -0.02, -0.33);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 18), grey);
    ring.position.z = -0.06;
    hand.add(cuff, palm, sleeve, ring);
    for (let j = 0; j < 3; j++) {
      const fold = new THREE.Mesh(new THREE.TorusGeometry(0.057, 0.0025, 6, 24), suit);
      fold.position.z = -0.105 - j * 0.024; hand.add(fold);
    }
    for (const side of [-1, 1]) tube(hand, [new THREE.Vector3(side * 0.033, 0.02, 0.035), new THREE.Vector3(side * 0.034, 0.02, 0.07), new THREE.Vector3(side * 0.028, 0.019, 0.11)], 0.001, grey);
    const patch = rounded(leg, [0.10, 0.008, 0.085], [0, 0.072, 0.29], grey, 0.014);
    patch.rotation.x = -0.04;
    for (let k = 0; k < 4; k++) {
      const fg = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.04, 8, 16), glove);
      fg.rotation.x = Math.PI / 2;
      fg.position.set(-0.03 + k * 0.02, 0, 0.14);
      hand.add(fg);
    }
    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.03, 8, 16), glove);
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
  camera = new THREE.PerspectiveCamera(68, 1, 0.01, 50);
  /** tubuh sendiri yang terlihat dari mata astronaut (POV): paha, lutut, sarung tangan */
  private pov = povBody();
  private toy = plushStar();
  private string: THREE.Line;
  private anchor = new THREE.Vector3(0.28, 0.80, 0.58);
  private screens: Screen[] = [];

  constructor() {
    const mounts = buildCabinInterior(this.scene);
    mounts.forEach(mount => {
      const screen = new Screen(0.302, 0.189);
      screen.mesh.position.set(0, 0.017, 0.032);
      mount.add(screen.mesh);
      this.screens.push(screen);
    });
    this.scene.add(this.pov.group, this.toy);
    this.string = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 24 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: 0xaab6b7 }));
    this.string.frustumCulled = false;
    this.scene.add(this.string);
    this.camera.position.set(0, 0.19, -0.42);
    this.camera.lookAt(0, -0.09, 0.9);
  }

  resize(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  private focusPoint = new THREE.Vector3(0, -0.09, 0.9);

  focus(target: string, blend: number) {
    // Move beside the neighboring seat so its harness is visible from the front.
    const seatView = target === "kursi";
    const portrait = this.camera.aspect < 0.8;
    const point = target === "boneka" ? this.toy.position.clone()
      : seatView ? new THREE.Vector3(-0.58, -0.16, -0.035)
      : target === "konsol" ? new THREE.Vector3(portrait ? 0.33 : 0, -0.18, portrait ? 0.625 : 0.68)
      : new THREE.Vector3(0, -0.09, 0.9);
    const eye = seatView ? new THREE.Vector3(-0.10, 0.12, 0.48) : new THREE.Vector3(0, 0.19, -0.42);
    this.camera.position.lerp(eye, blend);
    this.focusPoint.lerp(point, blend);
    this.camera.lookAt(this.focusPoint);
    // On a phone, frame the G-force display discussed by this cue instead of cropping its value.
    const base = target === "boneka" ? 44 : seatView ? 70 : target === "konsol" ? 54 : 68;
    const fov = portrait && target === "konsol" ? 68 : base;
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
    disposeCabin(this.scene);
  }
}
