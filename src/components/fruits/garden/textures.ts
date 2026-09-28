// Material GPT Image khusus Rumila; tekstur canvas menjadi fallback selama gambar dimuat.

import * as T from 'three';

const rnd = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

function tex(w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, repeat = false, seed = 1) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!, rnd(seed));
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = T.RepeatWrapping;
  return t;
}

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

/** Satu helai daun: elips runcing dengan tulang daun. */
function leafShape(g: CanvasRenderingContext2D, x: number, y: number, len: number, wid: number, ang: number, col: string, vein: string) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(wid, len * 0.25, wid * 0.9, len * 0.7, 0, len);
  g.bezierCurveTo(-wid * 0.9, len * 0.7, -wid, len * 0.25, 0, 0);
  g.fillStyle = col;
  g.fill();
  g.strokeStyle = vein;
  g.lineWidth = Math.max(1, wid * 0.08);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, len * 0.95);
  g.stroke();
  g.restore();
}

/** Atlas daun 1024²: [0] gerombol daun (pohon) · [1] pelepah palem · [2] daun pisang · [3] daun menjari. */
function foliageFallback() {
  return tex(1024, 1024, (g, r) => {
    // [0] kiri atas: gerombol daun rimbun, menyebar dari tengah
    g.save();
    for (let i = 0; i < 110; i++) {
      const a = r() * Math.PI * 2,
        d = r() * 170;
      const x = 256 + Math.cos(a) * d * 0.9,
        y = 256 + Math.sin(a) * d * 0.9;
      const h = 95 + r() * 30,
        l = 22 + r() * 22 + (y < 256 ? 6 : 0);
      leafShape(g, x, y, 58 + r() * 36, 18 + r() * 9, a + Math.PI / 2 + (r() - 0.5) * 0.9, hsl(h, 45 + r() * 20, l), hsl(h, 35, l + 12, 0.8));
    }
    g.restore();

    // [1] kanan atas: pelepah palem — tulang di tengah (bawah→atas), anak daun miring di kedua sisi
    g.save();
    g.translate(512, 0);
    g.strokeStyle = hsl(60, 35, 38);
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(256, 505);
    g.lineTo(256, 8);
    g.stroke();
    for (let i = 0; i < 46; i++) {
      const y = 490 - i * 10.5,
        len = 190 * Math.sin(((i + 3) / 52) * Math.PI) + 20;
      for (const s of [-1, 1]) leafShape(g, 256, y, len, 9 + r() * 3, s * (1.05 + r() * 0.15), hsl(100 + r() * 15, 50, 28 + r() * 14), hsl(80, 30, 45, 0.7));
    }
    g.restore();

    // [2] kiri bawah: daun pisang lebar dengan urat sejajar dan sedikit sobek
    g.save();
    g.translate(0, 512);
    g.beginPath();
    g.moveTo(256, 505);
    g.bezierCurveTo(470, 380, 460, 120, 256, 6);
    g.bezierCurveTo(52, 120, 42, 380, 256, 505);
    g.fillStyle = hsl(98, 52, 34);
    g.fill();
    g.globalCompositeOperation = 'source-atop';
    for (let y = 10; y < 500; y += 7) {
      g.strokeStyle = hsl(95, 45, 30 + r() * 12, 0.6);
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(256, y);
      g.lineTo(40, y - 60);
      g.moveTo(256, y);
      g.lineTo(472, y - 60);
      g.stroke();
    }
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 9; i++) {
      const y = 60 + r() * 400,
        s = r() > 0.5 ? 1 : -1;
      g.beginPath();
      g.moveTo(256 + s * 30, y);
      g.lineTo(256 + s * 260, y - 70);
      g.lineTo(256 + s * 260, y - 58);
      g.closePath();
      g.fill();
    }
    g.globalCompositeOperation = 'source-over';
    g.strokeStyle = hsl(70, 40, 60);
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(256, 505);
    g.lineTo(256, 10);
    g.stroke();
    g.restore();

    // [3] kanan bawah: daun menjari (pepaya / semangka / melon) — 5 cuping
    g.save();
    g.translate(768, 768);
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k - 2) * 0.62;
      g.save();
      g.rotate(a + Math.PI / 2);
      g.beginPath();
      g.moveTo(0, 0);
      g.bezierCurveTo(95, -60, 80, -190, 0, -235);
      g.bezierCurveTo(-80, -190, -95, -60, 0, 0);
      g.fillStyle = hsl(102, 48, 30 + k * 2);
      g.fill();
      g.strokeStyle = hsl(90, 35, 52, 0.8);
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -225);
      g.stroke();
      for (let j = 1; j < 6; j++) {
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(0, -j * 38);
        g.lineTo(50, -j * 38 - 30);
        g.moveTo(0, -j * 38);
        g.lineTo(-50, -j * 38 - 30);
        g.stroke();
      }
      g.restore();
    }
    g.restore();
  });
}

/** Wilayah atlas: [u0, v0, u1, v1] (v dari bawah; kanvas dibalik saat diunggah). */
export const ATLAS: Record<'cluster' | 'frond' | 'banana' | 'palmate', [number, number, number, number]> = {
  cluster: [0, 0.5, 0.5, 1],
  frond: [0.5, 0.5, 1, 1],
  banana: [0, 0, 0.5, 0.5],
  palmate: [0.5, 0, 1, 0.5],
};

/** Rumpun rumput (akar di bawah). */
export const grassTuft = () =>
  tex(
    256,
    256,
    (g, r) => {
      for (let i = 0; i < 38; i++) {
        const x = 128 + (r() - 0.5) * 150,
          h = 120 + r() * 125,
          lean = (r() - 0.5) * 90;
        const l = 40 + r() * 20;
        g.strokeStyle = hsl(80 + r() * 20, 50, l);
        g.lineWidth = 4 + r() * 4;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(x, 256);
        g.quadraticCurveTo(x + lean * 0.3, 256 - h * 0.6, x + lean, 256 - h);
        g.stroke();
      }
    },
    false,
    5,
  );

/** Rumput tanah (diulang). */
const groundGrassFallback = () =>
  tex(
    512,
    512,
    (g, r) => {
      g.fillStyle = hsl(95, 42, 36);
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 9000; i++) {
        const x = r() * 512,
          y = r() * 512;
        g.strokeStyle = hsl(80 + r() * 30, 40 + r() * 25, 26 + r() * 26, 0.7);
        g.lineWidth = 1 + r() * 1.5;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + (r() - 0.5) * 4, y - 5 - r() * 7);
        g.stroke();
      }
      for (let i = 0; i < 60; i++) {
        g.fillStyle = hsl(70 + r() * 30, 35, 30 + r() * 20, 0.18);
        g.beginPath();
        g.arc(r() * 512, r() * 512, 20 + r() * 50, 0, 7);
        g.fill();
      }
    },
    true,
    9,
  );

/** Tanah jalan setapak: tanah padat dengan kerikil. */
const dirtFallback = () =>
  tex(
    512,
    512,
    (g, r) => {
      g.fillStyle = hsl(33, 38, 55);
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 5000; i++) {
        g.fillStyle = hsl(28 + r() * 14, 30 + r() * 20, 38 + r() * 30, 0.35);
        g.fillRect(r() * 512, r() * 512, 2 + r() * 3, 2 + r() * 3);
      }
      for (let i = 0; i < 260; i++) {
        const x = r() * 512,
          y = r() * 512,
          s = 2 + r() * 5;
        g.fillStyle = hsl(30, 10 + r() * 15, 45 + r() * 30);
        g.beginPath();
        g.ellipse(x, y, s, s * 0.7, r() * 3, 0, 7);
        g.fill();
        g.fillStyle = 'rgba(0,0,0,.18)';
        g.beginPath();
        g.ellipse(x + 1, y + 1.5, s, s * 0.5, 0, 0, 7);
        g.fill();
      }
    },
    true,
    13,
  );

/** Kulit kayu (serat vertikal, diulang). */
const barkFallback = () =>
  tex(
    256,
    256,
    (g, r) => {
      g.fillStyle = hsl(28, 30, 30);
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 140; i++) {
        const x = r() * 256;
        g.strokeStyle = hsl(25 + r() * 10, 25 + r() * 15, 18 + r() * 28, 0.7);
        g.lineWidth = 1 + r() * 4;
        g.beginPath();
        g.moveTo(x, 0);
        for (let y = 0; y <= 256; y += 32) g.lineTo(x + Math.sin(y * 0.05 + i) * 4, y);
        g.stroke();
      }
      for (let i = 0; i < 40; i++) {
        g.fillStyle = 'rgba(20,10,0,.35)';
        g.fillRect(r() * 256, r() * 256, 3 + r() * 5, 12 + r() * 20);
      }
    },
    true,
    17,
  );

/** Papan kayu (dinding rumah, kincir, pagar). */
const planksFallback = () =>
  tex(
    256,
    256,
    (g, r) => {
      for (let i = 0; i < 8; i++) {
        g.fillStyle = hsl(32 + r() * 6, 35 + r() * 10, 62 + r() * 10);
        g.fillRect(0, i * 32, 256, 32);
        g.fillStyle = 'rgba(60,35,10,.45)';
        g.fillRect(0, i * 32 + 30, 256, 2);
        for (let k = 0; k < 18; k++) {
          g.strokeStyle = hsl(30, 30, 45 + r() * 15, 0.35);
          g.beginPath();
          const y = i * 32 + 4 + r() * 24;
          g.moveTo(0, y);
          g.bezierCurveTo(80, y + (r() - 0.5) * 6, 170, y + (r() - 0.5) * 6, 256, y);
          g.stroke();
        }
      }
    },
    true,
    19,
  );

/** Genteng tanah liat merah bata. */
const roofTilesFallback = () =>
  tex(
    256,
    256,
    (g, r) => {
      g.fillStyle = hsl(12, 55, 34);
      g.fillRect(0, 0, 256, 256);
      for (let row = 0; row < 8; row++)
        for (let c = 0; c < 9; c++) {
          const x = c * 32 - (row % 2) * 16,
            y = row * 32;
          const grad = g.createLinearGradient(0, y, 0, y + 32);
          const l = 42 + r() * 10;
          grad.addColorStop(0, hsl(12 + r() * 8, 60, l + 8));
          grad.addColorStop(1, hsl(10, 55, l - 12));
          g.fillStyle = grad;
          g.beginPath();
          g.roundRect(x + 1, y + 1, 30, 30, [2, 2, 12, 12]);
          g.fill();
        }
    },
    true,
    23,
  );

/** Batu kali (sumur). */
const stonesFallback = () =>
  tex(
    256,
    256,
    (g, r) => {
      g.fillStyle = hsl(30, 8, 40);
      g.fillRect(0, 0, 256, 256);
      for (let row = 0; row < 8; row++)
        for (let c = 0; c < 6; c++) {
          const x = c * 44 + (row % 2) * 22 - 10,
            y = row * 32;
          g.fillStyle = hsl(30 + r() * 20, 6 + r() * 10, 55 + r() * 18);
          g.beginPath();
          g.roundRect(x + 2, y + 2, 40, 28, 9);
          g.fill();
        }
    },
    true,
    29,
  );

/** Awan lembut (billboard). */
export const cloud = (seed: number) =>
  tex(
    512,
    256,
    (g, r) => {
      for (let i = 0; i < 26; i++) {
        const x = 90 + r() * 330,
          y = 150 - Math.sin(((x - 90) / 330) * Math.PI) * 60 + (r() - 0.5) * 30,
          s = 40 + r() * 55;
        const grad = g.createRadialGradient(x, y, 0, x, y, s);
        grad.addColorStop(0, 'rgba(255,255,255,.85)');
        grad.addColorStop(0.6, 'rgba(250,252,255,.45)');
        grad.addColorStop(1, 'rgba(240,246,255,0)');
        g.fillStyle = grad;
        g.beginPath();
        g.arc(x, y, s, 0, 7);
        g.fill();
      }
    },
    false,
    seed,
  );


/** Keep an immediate fallback and replace it with the app's GPT-generated material when decoded.
 * Late responses never resurrect a texture after its scene has been disposed. */
export function loadGardenMaterial(path: string, fallback: T.Texture) {
  let released = false;
  // WebGL2 texture storage is immutable after its first upload. Keep one canvas and
  // fixed dimensions, including for texture clones sharing this source (house walls).
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(fallback.image as HTMLCanvasElement, 0, 0, canvas.width, canvas.height);
  fallback.image = canvas;
  fallback.userData.assetPath = path;
  fallback.userData.assetStatus = 'loading';
  fallback.addEventListener('dispose', () => { released = true; });
  new T.TextureLoader().load(path, loaded => {
    if (!released) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(loaded.image as HTMLImageElement, 0, 0, canvas.width, canvas.height);
      fallback.needsUpdate = true;
      fallback.userData.assetStatus = 'ready';
    }
    loaded.dispose();
  }, undefined, () => { fallback.userData.assetStatus = 'fallback'; });
  return fallback;
}
const photo = (name: string, fallback: T.Texture) => loadGardenMaterial(`/fruits/garden/realism/${name}.webp`, fallback);
export const foliageAtlas = () => photo('foliage', foliageFallback());
export const groundGrass = () => loadGardenMaterial('/roket/textures/grass-albedo.webp', groundGrassFallback());
export const bark = () => loadGardenMaterial('/roket/textures/bark-albedo.webp', barkFallback());
export const dirt = () => photo('dirt', dirtFallback());
export const planks = () => photo('wood', planksFallback());
export const roofTiles = () => photo('roof', roofTilesFallback());
export const stones = () => photo('stone', stonesFallback());
export const feathers = () => photo('feathers', tex(128, 128, g => { g.fillStyle = '#eee9e0'; g.fillRect(0, 0, 128, 128); }, true));
