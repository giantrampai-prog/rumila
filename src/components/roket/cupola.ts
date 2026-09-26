// POV astronaut di kupola Stasiun Luar Angkasa: jendela bundar besar menghadap Bumi dikelilingi 8 jendela
// trapesium, layar data stasiun, laptop, tas bertali, foto keluarga, mug, dan kaki + sarung tangan sendiri.
// Seperti kabin: dunia digambar dulu dari posisi kupola, lalu interior ini di atasnya (lubang jendela kosong).

import * as THREE from "three";
import { povBody } from "./cabin";

const TAU = Math.PI * 2;

function tex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const panelTex = () =>
  tex(256, 256, (g) => {
    g.fillStyle = "#e6e8ec";
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#c7ccd4";
    for (let i = 0; i < 60; i++) g.fillRect((i * 37) % 250, (i * 71) % 250, 6, 6); // baut & lubang
    g.strokeStyle = "#b8bec8";
    g.lineWidth = 3;
    g.strokeRect(8, 8, 240, 240);
    g.fillStyle = "#9aa3b0";
    g.fillRect(20, 200, 90, 30);
    g.fillRect(140, 30, 90, 20);
  });

class DataScreen {
  canvas = document.createElement("canvas");
  tex: THREE.CanvasTexture;
  last = "";
  constructor() {
    this.canvas.width = 320;
    this.canvas.height = 220;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
  }
  draw(nextSunrise: number) {
    const m = Math.floor(nextSunrise / 60),
      s = Math.floor(nextSunrise % 60);
    const key = `${m}:${s}`;
    if (key === this.last) return;
    this.last = key;
    const g = this.canvas.getContext("2d")!;
    g.fillStyle = "#081523";
    g.fillRect(0, 0, 320, 220);
    g.fillStyle = "#7fb4e8";
    g.font = "bold 20px system-ui, sans-serif";
    g.fillText("STASIUN LUAR ANGKASA", 16, 30);
    g.fillStyle = "#cfe3ff";
    g.font = "16px system-ui, sans-serif";
    g.fillText("Ketinggian", 16, 70);
    g.fillText("Kecepatan", 16, 120);
    g.fillText("Matahari terbit berikutnya", 16, 170);
    g.fillStyle = "#7cf2c2";
    g.font = "bold 26px system-ui, sans-serif";
    g.fillText("408 km", 16, 96);
    g.fillStyle = "#ffd166";
    g.fillText("27.600 km/jam", 16, 146);
    g.fillStyle = "#ff9e7a";
    g.fillText(`00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`, 16, 200);
    // gambar Bumi kecil
    g.fillStyle = "#1b4f9c";
    g.beginPath();
    g.arc(262, 150, 44, 0, TAU);
    g.fill();
    g.fillStyle = "#4e9a4a";
    g.beginPath();
    g.ellipse(250, 140, 16, 10, 0.4, 0, TAU);
    g.fill();
    g.strokeStyle = "#7fb4e8";
    g.lineWidth = 2;
    g.beginPath();
    g.ellipse(262, 150, 58, 18, -0.3, 0, TAU);
    g.stroke();
    this.tex.needsUpdate = true;
  }
}

export class Cupola {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(78, 1, 0.01, 50);
  private pov = povBody();
  private data = new DataScreen();

  constructor() {
    const s = this.scene;
    const wall = new THREE.MeshStandardMaterial({ map: panelTex(), roughness: 0.8, side: THREE.DoubleSide });
    const frame = new THREE.MeshStandardMaterial({ color: 0x3a4150, roughness: 0.4, metalness: 0.6 });
    // Jendela depan: pelat segi delapan berlubang bundar besar
    const R = 0.9,
      zF = 0.95;
    const oct = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + TAU / 16;
      const x = Math.cos(a) * R,
        y = Math.sin(a) * R;
      if (i === 0) oct.moveTo(x, y);
      else oct.lineTo(x, y);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.52, 0, TAU, true);
    oct.holes.push(hole);
    const front = new THREE.Mesh(new THREE.ShapeGeometry(oct, 48), wall);
    front.position.z = zF;
    s.add(front);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.035, 10, 64), frame);
    rim.position.z = zF - 0.01;
    s.add(rim);
    // 8 panel trapesium miring berjendela (bingkai = cincin antara trapesium luar & dalam)
    const Rb = 1.45,
      zB = 0.25;
    const pos: number[] = [];
    for (let i = 0; i < 8; i++) {
      const a0 = (i / 8) * TAU + TAU / 16,
        a1 = ((i + 1) / 8) * TAU + TAU / 16;
      const A = new THREE.Vector3(Math.cos(a0) * R, Math.sin(a0) * R, zF);
      const B = new THREE.Vector3(Math.cos(a1) * R, Math.sin(a1) * R, zF);
      const C = new THREE.Vector3(Math.cos(a1) * Rb, Math.sin(a1) * Rb, zB);
      const D = new THREE.Vector3(Math.cos(a0) * Rb, Math.sin(a0) * Rb, zB);
      const ctr = A.clone().add(B).add(C).add(D).multiplyScalar(0.25);
      const inner = [A, B, C, D].map((v) => v.clone().lerp(ctr, 0.28));
      const outer = [A, B, C, D];
      for (let k = 0; k < 4; k++) {
        const o0 = outer[k],
          o1 = outer[(k + 1) % 4],
          i0 = inner[k],
          i1 = inner[(k + 1) % 4];
        for (const v of [o0, o1, i1, o0, i1, i0]) pos.push(v.x, v.y, v.z);
      }
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    pg.computeVertexNormals();
    s.add(new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ color: 0xd9dde3, roughness: 0.7, side: THREE.DoubleSide })));
    // Dinding belakang (tabung) di sekeliling astronaut
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(Rb, Rb, 1.6, 24, 1, true), wall);
    tube.rotation.x = Math.PI / 2;
    tube.position.z = zB - 0.8;
    s.add(tube);
    // Lampu strip
    for (const a of [0.9, TAU / 2 - 0.9]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: 0xf4f8ff }));
      strip.position.set(Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0.5);
      strip.rotation.z = a + Math.PI / 2;
      s.add(strip);
    }
    // Layar data stasiun (kiri)
    const ds = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.42), new THREE.MeshBasicMaterial({ map: this.data.tex, toneMapped: false }));
    ds.position.set(-0.95, 0.35, 0.35);
    ds.lookAt(0, 0, -0.3);
    const dsFrame = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.03), new THREE.MeshStandardMaterial({ color: 0x22262e }));
    dsFrame.position.copy(ds.position);
    dsFrame.quaternion.copy(ds.quaternion);
    dsFrame.translateZ(-0.02);
    s.add(dsFrame, ds);
    // Laptop (kanan bawah)
    const lap = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.3), new THREE.MeshStandardMaterial({ color: 0xb9bec6, metalness: 0.6, roughness: 0.3 }));
    const lid = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.27),
      new THREE.MeshBasicMaterial({
        toneMapped: false,
        map: tex(256, 170, (g) => {
          const gr = g.createLinearGradient(0, 0, 0, 170);
          gr.addColorStop(0, "#07142a");
          gr.addColorStop(1, "#1b4f9c");
          g.fillStyle = gr;
          g.fillRect(0, 0, 256, 170);
          g.fillStyle = "#4e9a4a";
          g.beginPath();
          g.arc(128, 200, 110, Math.PI, TAU);
          g.fill();
          g.fillStyle = "#ffffff";
          g.font = "bold 20px system-ui, sans-serif";
          g.fillText("Jaga Bumi kita", 60, 50);
        }),
      }),
    );
    lid.position.set(0, 0.14, -0.15);
    lid.rotation.x = -0.25;
    lap.add(base, lid);
    lap.position.set(0.72, -0.45, 0.3);
    lap.rotation.set(0, -0.6, 0.2);
    s.add(lap);
    // Foto keluarga (kanan atas)
    const photo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.2),
      new THREE.MeshBasicMaterial({
        map: tex(200, 154, (g) => {
          g.fillStyle = "#fff8ee";
          g.fillRect(0, 0, 200, 154);
          g.fillStyle = "#bfe3ff";
          g.fillRect(10, 10, 180, 110);
          const person = (x: number, h: number, c: string) => {
            g.fillStyle = c;
            g.beginPath();
            g.arc(x, 120 - h - 12, 12, 0, TAU);
            g.fill();
            g.fillRect(x - 12, 120 - h, 24, h);
          };
          person(55, 55, "#ff7a1a");
          person(100, 60, "#5b4bff");
          person(140, 35, "#12b8a6");
          g.fillStyle = "#2b1d4e";
          g.font = "bold 18px system-ui, sans-serif";
          g.fillText("Rumah selalu di hati", 14, 144);
        }),
      }),
    );
    photo.position.set(0.95, 0.45, 0.35);
    photo.lookAt(0, 0.1, -0.3);
    s.add(photo);
    // Tas penyimpanan bertali biru & mug
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.9 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x2f5fb8, roughness: 0.8 });
    for (const [x, y] of [
      [-0.95, -0.35],
      [0.98, -0.1],
    ]) {
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.2), bagMat);
      bag.position.set(x, y, 0.2);
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.03, 0.21), strapMat);
      strap.position.set(x, y + 0.05, 0.2);
      s.add(bag, strap);
    }
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.11, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    mug.position.set(-0.7, -0.62, 0.45);
    s.add(mug);
    // Kaki & tangan astronaut (melayang di depan jendela)
    s.add(this.pov.group);
    // Cahaya
    s.add(new THREE.AmbientLight(0xd8e4f5, 0.7), new THREE.HemisphereLight(0xffffff, 0x445066, 0.5));
    const lamp = new THREE.PointLight(0xf4f8ff, 1.5, 4, 1.5);
    lamp.position.set(0, 0.8, 0.2);
    s.add(lamp);
    // Mata astronaut, memandang ke jendela bundar (Bumi)
    this.camera.position.set(0, 0.12, -0.45);
    this.camera.lookAt(0, 0.02, 0.95);
  }

  resize(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  update(t: number) {
    this.pov.update(1, 0, t); // di stasiun: melayang
    this.data.draw(23 * 60 + 17 - (t % (23 * 60)));
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
  }
}
