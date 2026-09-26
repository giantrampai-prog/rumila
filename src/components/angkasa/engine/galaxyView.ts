// View Bintang & galaksi (PRD §4E; instruksi §3; aset §8): ILUSTRASI 3D Bima Sakti berbentuk spiral berbatang.
// Distribusi titik bervolume (piringan tipis + tonjolan pusat + batang + 4 lengan) dari RNG berbenih → deterministik.
// Dapat diputar dan terbaca dari samping (edge-on: piringan tipis + tonjolan). Titik bukan bintang nyata:
// tidak ada nama/koordinat bintang. Skala tersendiri: 1 unit ≈ 1.000 tahun cahaya (diameter ≈ 100.000 tc).

import * as THREE from "three";
import { getObj } from "@/lib/angkasa/manifest";
import type { AngkasaState } from "@/lib/angkasa/state";
import { starfield } from "./bodies";
import { disposeTree, type EngineCtx, type LabelSpec } from "./core";
import type { ModeView } from "./views";

/** tahun cahaya per unit scene */
export const LY_PER_UNIT = 1000;
const DEG = Math.PI / 180;

/** RNG berbenih (mulberry32) — galaksi yang sama setiap kali dibuka. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Parameter struktur (unit = 1.000 tahun cahaya). Nilai ilustratif mengikuti gambaran umum Bima Sakti. */
export const GALAXY = {
  /** radius piringan (diameter ≈ 100.000 tc) */
  radius: 50,
  /** jarak tata surya ke pusat (≈ 26.000 tc) */
  sunR: 26,
  /** setengah panjang batang */
  barHalf: 12,
  barAngle: 25 * DEG,
  /** sudut kemiringan lengan spiral logaritmik */
  pitch: 13 * DEG,
  armStart: 10,
  arms: 4,
};

/** Sudut lengan ke-k pada radius r (spiral logaritmik yang berpangkal di ujung batang). */
export function armAngle(k: number, r: number) {
  const base = GALAXY.barAngle + (k * Math.PI * 2) / GALAXY.arms;
  return (
    base +
    Math.log(Math.max(r, GALAXY.armStart) / GALAXY.armStart) /
      Math.tan(GALAXY.pitch)
  );
}

/** Perkiraan lokasi tata surya: di lengan minor (k = 1) pada ≈ 26.000 tc dari pusat. */
export function solarLocation(out = new THREE.Vector3()) {
  const th = armAngle(1, GALAXY.sunR) + 0.06;
  return out.set(GALAXY.sunR * Math.cos(th), 0, GALAXY.sunR * Math.sin(th));
}

interface Cloud {
  pos: Float32Array;
  col: Float32Array;
}

/** Bangun distribusi titik galaksi (murni & deterministik). */
export function buildGalaxyPoints(
  count: number,
  seed = 20260926,
): { main: Cloud; bright: Cloud } {
  const rnd = mulberry32(seed);
  const gauss = () => {
    let u = 0;
    while (u === 0) u = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
  };
  const R = GALAXY.radius;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const brightN = Math.round(count / 14);
  const bPos = new Float32Array(brightN * 3);
  const bCol = new Float32Array(brightN * 3);
  let bi = 0;

  const put = (
    i: number,
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
    k: number,
  ) => {
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    col[i * 3] = r * k;
    col[i * 3 + 1] = g * k;
    col[i * 3 + 2] = b * k;
  };

  const nBulge = Math.round(count * 0.14);
  const nBar = Math.round(count * 0.09);
  const nArms = Math.round(count * 0.47);
  let i = 0;

  // Tonjolan pusat: sferoid agak pepat, bintang tua kekuningan.
  for (let n = 0; n < nBulge; n++, i++) {
    const x = gauss() * 3.6;
    const z = gauss() * 3.6;
    const y = gauss() * 2.6;
    const w = rnd();
    put(i, x, y, z, 1.0, 0.8 - w * 0.1, 0.52 - w * 0.12, 0.55 + rnd() * 0.45);
  }
  // Batang: memanjang pada barAngle.
  const ca = Math.cos(GALAXY.barAngle);
  const sa = Math.sin(GALAXY.barAngle);
  for (let n = 0; n < nBar; n++, i++) {
    const u = Math.max(-1, Math.min(1, gauss() * 0.45)) * GALAXY.barHalf;
    const v = gauss() * 2.0;
    const y = gauss() * 0.9;
    put(
      i,
      u * ca - v * sa,
      y,
      u * sa + v * ca,
      1.0,
      0.78,
      0.5,
      0.45 + rnd() * 0.4,
    );
  }
  // Lengan spiral: dua lengan utama (k = 0, 2) lebih padat daripada dua lengan minor (k = 1, 3).
  for (let n = 0; n < nArms; n++, i++) {
    const k = rnd() < 0.64 ? (rnd() < 0.5 ? 0 : 2) : rnd() < 0.5 ? 1 : 3;
    let r = GALAXY.armStart + -Math.log(1 - rnd() * 0.93) * 14;
    if (r > R) r = GALAXY.armStart + rnd() * (R - GALAXY.armStart);
    const spread = 0.9 + r * 0.045;
    const th = armAngle(k, r) + (gauss() * spread) / r;
    const rr = r + gauss() * spread * 0.5;
    const y = gauss() * (0.22 + r * 0.004);
    const x = rr * Math.cos(th);
    const z = rr * Math.sin(th);
    const hii = rnd() < 0.025; // awan gas pembentuk bintang (merah muda), ilustratif
    if (hii) put(i, x, y, z, 1.0, 0.5, 0.68, 0.9);
    else put(i, x, y, z, 0.72, 0.82, 1.0, 0.45 + rnd() * 0.5);
    if (bi < brightN && rnd() < 0.18) {
      bPos.set([x, y, z], bi * 3);
      bCol.set(hii ? [1, 0.55, 0.72] : [0.8, 0.88, 1], bi * 3);
      bi++;
    }
  }
  // Piringan halus: sebaran eksponensial (panjang skala ±12 unit), tipis, sedikit melebar di tepi.
  for (; i < count; i++) {
    let r = -Math.log(1 - rnd() * 0.985) * 12;
    if (r > R) r = rnd() * R;
    const th = rnd() * Math.PI * 2;
    const y = gauss() * (0.3 + r * 0.008);
    const w = Math.max(0, 1 - r / 30);
    put(
      i,
      r * Math.cos(th),
      y,
      r * Math.sin(th),
      0.85 + w * 0.15,
      0.85 - w * 0.05,
      0.92 - w * 0.3,
      0.3 + rnd() * 0.35,
    );
  }
  return {
    main: { pos, col },
    bright: { pos: bPos.slice(0, bi * 3), col: bCol.slice(0, bi * 3) },
  };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function ringTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.strokeStyle = "rgba(255,127,103,1)"; // coral Rumila
  g.lineWidth = 9;
  g.beginPath();
  g.arc(64, 64, 50, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,1)";
  g.beginPath();
  g.arc(64, 64, 9, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const HOME_POS = new THREE.Vector3(0, 48, 70);

export class GalaxyView implements ModeView {
  name = "galaxy";
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.5, 3000);
  controlsConfig = { minDistance: 14, maxDistance: 240, enablePan: false };
  private marker = new THREE.Group();
  private sunPos = solarLocation();
  private textures: THREE.Texture[] = [];

  start(ctx: EngineCtx) {
    this.scene.add(starfield(1200, 900, 11));
    const dot = dotTexture();
    this.textures.push(dot);

    const { main, bright } = buildGalaxyPoints(ctx.lowPower ? 26000 : 52000);
    const mkPoints = (c: Cloud, size: number, opacity: number) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(c.pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(c.col, 3));
      const mat = new THREE.PointsMaterial({
        size,
        map: dot,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      return new THREE.Points(geo, mat);
    };
    const galaxy = new THREE.Group();
    galaxy.name = "milky-way.illustration";
    galaxy.add(
      mkPoints(main, ctx.lowPower ? 0.62 : 0.48, 0.85),
      mkPoints(bright, 1.1, 0.9),
    );

    // pendar pusat (terbatas) agar tonjolan terbaca dari jauh
    const glowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,214,150,0.55)");
      grad.addColorStop(0.4, "rgba(255,190,120,0.16)");
      grad.addColorStop(1, "rgba(255,180,110,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    this.textures.push(glowTex);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    );
    glow.scale.setScalar(20);
    galaxy.add(glow);
    this.scene.add(galaxy);

    // Penanda perkiraan lokasi tata surya: cincin coral + tiang vertikal agar terbaca juga dari samping.
    const ring = ringTexture();
    this.textures.push(ring);
    const ringSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: ring,
        depthTest: false,
        transparent: true,
      }),
    );
    ringSprite.scale.setScalar(2.4);
    ringSprite.renderOrder = 5;
    ringSprite.userData.pickId = "milky-way";
    const pole = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 4, 0),
      ]),
      new THREE.LineBasicMaterial({
        color: 0xff7f67,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
      }),
    );
    pole.renderOrder = 5;
    this.marker.add(ringSprite, pole);
    this.marker.position.copy(this.sunPos);
    this.scene.add(this.marker);

    // Garis putus-putus pusat → tata surya (≈ 26.000 tahun cahaya)
    const dash = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        this.sunPos.clone(),
      ]),
      new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.8,
        gapSize: 0.6,
        transparent: true,
        opacity: 0.55,
        depthTest: false,
      }),
    );
    dash.computeLineDistances();
    dash.renderOrder = 4;
    this.scene.add(dash);

    // Intro: dari atas jauh ke pandangan miring (dilewati saat gerakan berkurang).
    ctx.controls.target.set(0, 0, 0);
    if (ctx.reducedMotion()) {
      this.camera.position.copy(HOME_POS);
    } else {
      this.camera.position.set(0, 190, 6);
      void ctx.flyTo(HOME_POS.clone(), new THREE.Vector3(0, 0, 0), 2200);
    }
  }

  update() {}

  apply(st: AngkasaState) {
    void st;
  }

  scaleNote() {
    const d = getObj("milky-way").keyFacts[0]?.qty.value ?? 100000;
    return `Ilustrasi struktur galaksi — bukan katalog bintang; skala: 1 unit ≈ ${LY_PER_UNIT.toLocaleString("id-ID")} tahun cahaya (diameter ≈ ${d.toLocaleString("id-ID")} tahun cahaya) · Lokasi tata surya perkiraan`;
  }

  pickables() {
    return [this.marker];
  }

  occluders() {
    return [];
  }

  labels(): LabelSpec[] {
    const sun = this.sunPos;
    const dist = getObj("milky-way").keyFacts[1]?.qty.value ?? 26000;
    return [
      {
        id: "gal.sun",
        text: "Perkiraan lokasi tata surya",
        priority: 10,
        kind: "marker",
        alwaysVisible: true,
        world: (v) => v.copy(sun).add(new THREE.Vector3(0, 4.4, 0)),
      },
      {
        id: "gal.center",
        text: "Pusat galaksi",
        priority: 9,
        kind: "note",
        alwaysVisible: true,
        world: (v) => v.set(0, 4.2, 0),
      },
      {
        id: "gal.dist",
        text: `≈ ${dist.toLocaleString("id-ID")} tahun cahaya`,
        priority: 5,
        kind: "note",
        alwaysVisible: true,
        world: (v) =>
          v
            .copy(sun)
            .multiplyScalar(0.5)
            .add(new THREE.Vector3(0, 0.6, 0)),
      },
    ];
  }

  dispose() {
    disposeTree(this.scene);
    for (const t of this.textures) t.dispose();
    this.textures = [];
    this.scene.clear();
  }
}
