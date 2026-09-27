'use client';

// Dunia Coding Agam · Pola: "Pabrik & Toko". Sepuluh tema ruangan dalam yang ceria (toko bunga, pabrik permen,
// toko kue, pasar buah, pabrik mainan, panggung musik, akuarium, studio lukis, pesta ulang tahun, karnaval malam)
// supaya Pola terasa beda dari dunia alam di art.tsx. Tiap tema: lantai bertekstur, perabot padat "#", genangan /
// kolam bundar "~", hiasan kecil (beberapa bergerak), dan warna halaman. Satuan kotak 100×100 (X, Y = pojok kiri
// atas kotak). Juga Agam versi pekerja pabrik/toko: celemek belang merah muda, topi kertas, pemindai & papan catatan.

import { h, type ThemeArt } from './art';

/** bulatkan koordinat hitungan supaya SVG server & klien sama */
const f = (v: number) => +v.toFixed(1);

const shadow = (X: number, Y: number, rx = 34, ry = 10, cy = 76, op = 0.22) => <ellipse cx={X + 50} cy={Y + cy} rx={rx} ry={ry} fill="#000" opacity={op} />;

/** pilih satu dari daftar secara semu-acak tetap per kotak */
const pick = <T,>(arr: readonly T[], x: number, y: number, k: number): T => arr[Math.floor(h(x, y, k) * arr.length) % arr.length];

/** titik hiasan semu-acak di dalam kotak */
const spot = (X: number, Y: number, x: number, y: number) => ({ px: f(X + 24 + h(x, y, 3) * 52), py: f(Y + 26 + h(x, y, 4) * 48) });

/** jeda animasi berbeda tiap kotak supaya tidak bergerak serempak */
const delay = (x: number, y: number, s: number) => ({ animationDelay: `${f(h(x, y, 6) * -s)}s` });

/** jalur bintang bersudut n */
const starPath = (cx: number, cy: number, ro: number, ri: number, n = 5) =>
  [...Array(n * 2)]
    .map((_, k) => {
      const a = -Math.PI / 2 + (k * Math.PI) / n,
        r = k % 2 ? ri : ro;
      return `${k ? 'L' : 'M'}${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;
    })
    .join(' ') + 'Z';

/** bunga lima kelopak dilihat dari atas */
const bloom = (cx: number, cy: number, r: number, fill: string, key?: string | number) => (
  <g key={key}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={cx} cy={f(cy - r * 0.6)} rx={f(r * 0.42)} ry={f(r * 0.62)} fill={fill} stroke="#00000018" strokeWidth="0.8" transform={`rotate(${a} ${f(cx)} ${f(cy)})`} />
    ))}
    <circle cx={cx} cy={cy} r={f(r * 0.36)} fill="#ffc21a" />
    <circle cx={f(cx - r * 0.12)} cy={f(cy - r * 0.12)} r={f(r * 0.13)} fill="#fff" opacity="0.75" />
  </g>
);

/** kilau bintang empat sudut (lampu, kaca, gula) */
const sparkle = (px: number, py: number, r: number, fill: string) => (
  <path d={`M${px} ${f(py - r)} Q${f(px + r * 0.18)} ${f(py - r * 0.18)} ${f(px + r)} ${py} Q${f(px + r * 0.18)} ${f(py + r * 0.18)} ${px} ${f(py + r)} Q${f(px - r * 0.18)} ${f(py + r * 0.18)} ${f(px - r)} ${py} Q${f(px - r * 0.18)} ${f(py - r * 0.18)} ${px} ${f(py - r)} Z`} fill={fill} />
);

const RAINBOW = ['#ff5f8f', '#ffb627', '#4cc9f0', '#7bd389', '#b388ff', '#ff7a45'] as const;

/* ---------- 1. Toko Bunga ---------- */

const FLOWER = ['#ff7aa8', '#ffd23f', '#ff8a5b', '#c59bff', '#ffffff', '#ff5a6e'] as const;
const TULIP = ['#ff4f6d', '#ffcf3a', '#ff8fc0', '#b57bff', '#ff8a3d'] as const;

const bunga: ThemeArt = {
  name: 'Toko Bunga',
  bg: '#fdecef',
  ink: '#8a2f4a',
  frame: '#fff8f4',
  tile: ['#e8a07c', '#df9370'],
  tex: 'kp-tex-terracotta',
  outLiquid: 0.12,
  defs: (
    <>
      <pattern id="kp-tex-terracotta" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M0 1 h50 M1 0 v50" stroke="#fff1e4" strokeOpacity="0.6" strokeWidth="2" fill="none" />
        <path d="M0 3 h50 M3 0 v50" stroke="#a9563a" strokeOpacity="0.22" strokeWidth="1" fill="none" />
        <circle cx="16" cy="18" r="1.4" fill="#a4553a" opacity="0.35" />
        <circle cx="34" cy="38" r="1.1" fill="#fff" opacity="0.3" />
        <circle cx="40" cy="26" r="0.9" fill="#a4553a" opacity="0.3" />
        <ellipse cx="38" cy="13" rx="3.2" ry="1.8" fill="#ff8fb1" opacity="0.55" transform="rotate(30 38 13)" />
        <ellipse cx="14" cy="38" rx="2.6" ry="1.5" fill="#fff" opacity="0.4" transform="rotate(-40 14 38)" />
      </pattern>
      <linearGradient id="kp-pot" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a9492a" />
        <stop offset="0.38" stopColor="#ee9868" />
        <stop offset="0.75" stopColor="#c45c34" />
        <stop offset="1" stopColor="#93391f" />
      </linearGradient>
      <linearGradient id="kp-zinc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7f8b97" />
        <stop offset="0.35" stopColor="#e8eef3" />
        <stop offset="0.7" stopColor="#aab5bf" />
        <stop offset="1" stopColor="#77838e" />
      </linearGradient>
      <linearGradient id="kp-planter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c28b56" />
        <stop offset="1" stopColor="#8a5a32" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    const c1 = pick(FLOWER, x, y, 8),
      c2 = pick(FLOWER, x, y, 9);
    if (r < 0.4)
      // pot tanah liat berisi bunga
      return (
        <g>
          {shadow(X, Y, 30, 9, 83)}
          <path d={`M${X + 28} ${Y + 58} h44 l-6 24 q-16 4 -32 0 z`} fill="url(#kp-pot)" />
          <path d={`M${X + 33} ${Y + 63} l3 15`} stroke="#fff" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
          <path d={`M${X + 40} ${Y + 50} Q${X + 30} ${Y + 44} ${X + 24} ${Y + 32} M${X + 50} ${Y + 52} V${Y + 28} M${X + 58} ${Y + 50} Q${X + 70} ${Y + 42} ${X + 74} ${Y + 30}`} stroke="#3f8a2c" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx={X + 36} cy={Y + 44} rx="12" ry="5.5" fill="url(#ka-leaf)" transform={`rotate(-32 ${X + 36} ${Y + 44})`} />
          <ellipse cx={X + 64} cy={Y + 44} rx="12" ry="5.5" fill="url(#ka-leaf)" transform={`rotate(32 ${X + 64} ${Y + 44})`} />
          <rect x={X + 24} y={Y + 51} width="52" height="10" rx="4" fill="url(#kp-pot)" />
          <rect x={X + 24} y={Y + 51} width="52" height="10" rx="4" fill="url(#ka-bevel)" />
          {bloom(X + 50, Y + 25, 11, c1)}
          {bloom(X + 25, Y + 31, 9, c2)}
          {bloom(X + 74, Y + 29, 9, c1)}
        </g>
      );
    if (r < 0.72)
      // ember seng berisi tulip
      return (
        <g>
          {shadow(X, Y, 28, 8, 83)}
          <ellipse cx={X + 50} cy={Y + 46} rx="21" ry="4.5" fill="#34404a" />
          {[
            [30, 20],
            [42, 12],
            [56, 14],
            [70, 22],
            [50, 26],
          ].map(([tx, ty], i) => (
            <g key={i}>
              <path d={`M${X + 50} ${Y + 50} Q${X + (tx + 50) / 2} ${Y + 36} ${X + tx} ${Y + ty + 6}`} stroke="#3f8a2c" strokeWidth="2.6" fill="none" />
              <path d={`M${X + tx - 7} ${Y + ty - 2} q0 11 7 11 q7 0 7 -11 l-3.5 3 l-3.5 -5 l-3.5 5 z`} fill={pick(TULIP, x, y, 10 + i)} stroke="#00000022" strokeWidth="1" />
              <path d={`M${X + tx - 4} ${Y + ty + 1} q0 5 3 6`} stroke="#fff" strokeOpacity="0.5" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </g>
          ))}
          <ellipse cx={X + 40} cy={Y + 44} rx="9" ry="3.5" fill="url(#ka-leaf)" transform={`rotate(-20 ${X + 40} ${Y + 44})`} />
          <path d={`M${X + 28} ${Y + 46} h44 l-5 34 q-17 4 -34 0 z`} fill="url(#kp-zinc)" />
          <path d={`M${X + 29} ${Y + 58} h42 M${X + 31} ${Y + 70} h38`} stroke="#6d7985" strokeOpacity="0.45" strokeWidth="2" />
          <path d={`M${X + 28} ${Y + 46} q22 7 44 0`} stroke="#c9d2da" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d={`M${X + 27} ${Y + 52} q-6 2 -5 8 M${X + 73} ${Y + 52} q6 2 5 8`} stroke="#6d7985" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    // bak tanaman kayu dilihat dari atas
    return (
      <g>
        {shadow(X, Y, 40, 12, 72, 0.2)}
        <rect x={X + 12} y={Y + 20} width="76" height="58" rx="7" fill="url(#kp-planter)" />
        <rect x={X + 12} y={Y + 20} width="76" height="58" rx="7" fill="url(#ka-bevel)" />
        <path d={`M${X + 12} ${Y + 34} h76 M${X + 12} ${Y + 64} h76`} stroke="#6b4222" strokeOpacity="0.35" strokeWidth="1.5" />
        <rect x={X + 18} y={Y + 26} width="64" height="46" rx="4" fill="#5a3a24" />
        {[0, 1, 2, 3].map((i) =>
          [0, 1].map((j) => (
            <g key={`${i}-${j}`}>
              <ellipse cx={X + 26 + i * 16} cy={Y + 42 + j * 18} rx="7" ry="3.5" fill="url(#ka-leaf)" transform={`rotate(${(i + j) % 2 ? 35 : -35} ${X + 26 + i * 16} ${Y + 42 + j * 18})`} />
              {bloom(X + 28 + i * 15, Y + 38 + j * 18, 6.5, pick(FLOWER, x + i, y + j, 11))}
            </g>
          )),
        )}
        {[16, 84].map((dx) => (
          <circle key={dx} cx={X + dx} cy={Y + 24} r="1.6" fill="#d9b78a" />
        ))}
      </g>
    );
  },
  liquid: (X, Y, x, y) => (
    // kolam teratai kecil di tengah toko
    <g>
      {shadow(X, Y, 42, 10, 88, 0.16)}
      <circle cx={X + 50} cy={Y + 50} r="44" fill="#ecdccd" stroke="#c9a88c" strokeWidth="2.5" />
      <circle cx={X + 50} cy={Y + 50} r="40" fill="none" stroke="#d6bea8" strokeWidth="5" strokeDasharray="11 4" />
      <circle cx={X + 50} cy={Y + 50} r="35" fill="url(#ka-water)" />
      <path d={`M${X + 26} ${Y + 40} q8 -6 16 0 t16 0 M${X + 40} ${Y + 72} q8 -6 16 0`} fill="none" stroke="#e6f7ff" strokeWidth="3.5" strokeLinecap="round" className="ka-shimmer" />
      <g className="ka-bob" style={delay(x, y, 3)}>
        <path d={`M${X + 36} ${Y + 62} a11 11 0 1 1 1 0 l-1 -10 z`} fill="#4fae3b" stroke="#2f7a24" strokeWidth="1" />
        <path d={`M${X + 66} ${Y + 44} a9 9 0 1 1 1 0 l-1 -8 z`} fill="#5dbb46" stroke="#2f7a24" strokeWidth="1" />
        {bloom(X + 35, Y + 50, 8, '#ffb3cf')}
      </g>
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.05)
      // kepik berjalan
      return (
        <g className="ka-crab" style={delay(x, y, 4)}>
          <ellipse cx={px} cy={py} rx="8" ry="9" fill="#e8384f" />
          <path d={`M${px} ${py - 8} v17`} stroke="#3a1a1a" strokeWidth="1.4" />
          <circle cx={px} cy={py - 9} r="4" fill="#2b2230" />
          <circle cx={px - 3.5} cy={py - 2} r="1.8" fill="#2b2230" />
          <circle cx={px + 3.5} cy={py + 3} r="1.8" fill="#2b2230" />
          <circle cx={px - 3} cy={py + 5} r="1.4" fill="#2b2230" />
          <circle cx={px - 3} cy={py - 5} r="1.4" fill="#fff" opacity="0.7" />
        </g>
      );
    if (r < 0.3) {
      // kelopak berguguran
      const c = pick(['#ff9ec0', '#ffd0e1', '#fff3a6', '#ffffff'], x, y, 5);
      return (
        <g fill={c} stroke="#00000014" strokeWidth="0.8">
          {[0, 1, 2].map((k) => (
            <ellipse key={k} cx={f(px + (h(x, y, 20 + k) - 0.5) * 30)} cy={f(py + (h(x, y, 30 + k) - 0.5) * 26)} rx="4.2" ry="2.4" transform={`rotate(${f(h(x, y, 40 + k) * 180)} ${f(px + (h(x, y, 20 + k) - 0.5) * 30)} ${f(py + (h(x, y, 30 + k) - 0.5) * 26)})`} />
          ))}
        </g>
      );
    }
    if (r < 0.38) return <path d={`M${px - 8} ${py} q8 -9 16 0 q-8 9 -16 0 z M${px - 8} ${py} h16`} fill="#6fbf45" stroke="#3f8a2c" strokeWidth="1" transform={`rotate(${f(h(x, y, 5) * 180)} ${px} ${py})`} />;
    return null;
  },
};

/* ---------- 2. Pabrik Permen ---------- */

const permen: ThemeArt = {
  name: 'Pabrik Permen',
  bg: '#fcecf8',
  ink: '#7a2c86',
  frame: '#fff8fd',
  tile: ['#ffd3e6', '#d9ecff'],
  tex: 'kp-tex-candy',
  outLiquid: 0.18,
  defs: (
    <>
      <pattern id="kp-tex-candy" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect x="0" y="0" width="8" height="22" fill="#fff" opacity="0.42" />
        <rect x="8" y="0" width="1.5" height="22" fill="#ff8fc0" opacity="0.18" />
        <circle cx="15" cy="6" r="1" fill="#fff" opacity="0.6" />
      </pattern>
      <radialGradient id="kp-globe" cx="0.36" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="0.5" stopColor="#e8f6ff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#9cc9e6" stopOpacity="0.6" />
      </radialGradient>
      <linearGradient id="kp-candyred" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c8243e" />
        <stop offset="0.4" stopColor="#ff6b7d" />
        <stop offset="1" stopColor="#b51d38" />
      </linearGradient>
      <radialGradient id="kp-syrup" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ffd6ef" />
        <stop offset="0.55" stopColor="#ff7cc0" />
        <stop offset="1" stopColor="#c23a8a" />
      </radialGradient>
      <linearGradient id="kp-jar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#bfe3f5" stopOpacity="0.75" />
        <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#a8d4ec" stopOpacity="0.75" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.4) {
      // mesin permen karet
      const balls: [number, number][] = [
        [-12, -8],
        [0, -12],
        [12, -6],
        [-14, 5],
        [-2, 1],
        [10, 8],
        [-6, 13],
        [5, 15],
        [15, 4],
      ];
      return (
        <g>
          {shadow(X, Y, 26, 8, 86)}
          <path d={`M${X + 34} ${Y + 60} h32 l6 24 h-44 z`} fill="url(#kp-candyred)" />
          <rect x={X + 30} y={Y + 58} width="40" height="8" rx="3" fill="#e0304c" />
          <rect x={X + 42} y={Y + 68} width="16" height="11" rx="3" fill="#dfe5ea" stroke="#9aa6b2" strokeWidth="1.2" />
          <circle cx={X + 50} cy={Y + 73.5} r="3" fill="#8a96a2" />
          <circle cx={X + 50} cy={Y + 36} r="25" fill="#eaf6ff" opacity="0.5" />
          {balls.map(([dx, dy], i) => (
            <g key={i}>
              <circle cx={X + 50 + dx} cy={Y + 36 + dy} r="6" fill={pick(RAINBOW, x + i, y, 12)} />
              <circle cx={X + 48 + dx} cy={Y + 34 + dy} r="1.8" fill="#fff" opacity="0.7" />
            </g>
          ))}
          <circle cx={X + 50} cy={Y + 36} r="25" fill="url(#kp-globe)" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2" />
          <path d={`M${X + 34} ${Y + 26} Q${X + 40} ${Y + 16} ${X + 50} ${Y + 15}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
          <rect x={X + 42} y={Y + 8} width="16" height="6" rx="3" fill="url(#kp-candyred)" />
          <circle cx={X + 50} cy={Y + 7} r="3.5" fill="#e0304c" />
        </g>
      );
    }
    if (r < 0.72) {
      // tiang permen lolipop raksasa
      const c = pick(RAINBOW, x, y, 8);
      return (
        <g>
          {shadow(X, Y, 22, 7, 86)}
          <ellipse cx={X + 50} cy={Y + 84} rx="15" ry="4" fill="#e7dbe9" stroke="#bda7c2" strokeWidth="1.2" />
          <rect x={X + 47} y={Y + 44} width="6" height="40" rx="3" fill="#fff" stroke="#e4d6e6" strokeWidth="1" />
          {[48, 56, 64, 72, 80].map((dy) => (
            <path key={dy} d={`M${X + 47} ${Y + dy + 3} l6 -4`} stroke="#ff5f8f" strokeWidth="2.4" />
          ))}
          <circle cx={X + 50} cy={Y + 32} r="24" fill={c} />
          <path
            d={`M${X + 50} ${Y + 32} m0 -3 a3 3 0 0 1 3 3 a6 6 0 0 1 -6 6 a9 9 0 0 1 -9 -9 a12 12 0 0 1 12 -12 a15 15 0 0 1 15 15 a18 18 0 0 1 -18 18 a21 21 0 0 1 -21 -21`}
            fill="none"
            stroke="#fff"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx={X + 50} cy={Y + 32} r="24" fill="url(#ka-bevel)" />
          <ellipse cx={X + 40} cy={Y + 18} rx="7" ry="3.5" fill="#fff" opacity="0.55" transform={`rotate(-30 ${X + 40} ${Y + 18})`} />
          <path d={`M${X + 44} ${Y + 56} l-8 -5 l0 10 z M${X + 56} ${Y + 56} l8 -5 l0 10 z`} fill="#7bd389" />
          <circle cx={X + 50} cy={Y + 56} r="3.5" fill="#56b56b" />
        </g>
      );
    }
    // toples kaca berisi permen bungkus
    return (
      <g>
        {shadow(X, Y, 28, 8, 86)}
        <rect x={X + 26} y={Y + 30} width="48" height="54" rx="12" fill="#f4fbff" opacity="0.5" />
        {[
          [36, 72],
          [50, 74],
          [64, 72],
          [42, 60],
          [58, 60],
          [50, 48],
          [36, 46],
          [64, 47],
        ].map(([dx, dy], i) => {
          const c = pick(RAINBOW, x, y + i, 13);
          return (
            <g key={i} transform={`rotate(${((i * 37) % 80) - 40} ${X + dx} ${Y + dy})`}>
              <path d={`M${X + dx - 11} ${Y + dy - 4} l5 4 l-5 4 z M${X + dx + 11} ${Y + dy - 4} l-5 4 l5 4 z`} fill={c} opacity="0.85" />
              <ellipse cx={X + dx} cy={Y + dy} rx="6.5" ry="5" fill={c} />
              <ellipse cx={X + dx - 2} cy={Y + dy - 2} rx="2.2" ry="1.3" fill="#fff" opacity="0.7" />
            </g>
          );
        })}
        <rect x={X + 26} y={Y + 30} width="48" height="54" rx="12" fill="url(#kp-jar)" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2" />
        <path d={`M${X + 32} ${Y + 40} v34`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <rect x={X + 30} y={Y + 20} width="40" height="12" rx="4" fill="#ff8fc0" />
        <rect x={X + 30} y={Y + 20} width="40" height="12" rx="4" fill="url(#ka-bevel)" />
        <rect x={X + 44} y={Y + 13} width="12" height="8" rx="3" fill="#ff5f8f" />
        <path d={`M${X + 30} ${Y + 26} h40`} stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
      </g>
    );
  },
  liquid: (X, Y, x, y) => (
    // kolam sirup stroberi
    <g>
      <path d={`M${X + 12} ${Y + 50} Q${X + 10} ${Y + 16} ${X + 44} ${Y + 14} Q${X + 82} ${Y + 10} ${X + 88} ${Y + 44} Q${X + 92} ${Y + 84} ${X + 54} ${Y + 88} Q${X + 14} ${Y + 90} ${X + 12} ${Y + 50} Z`} fill="#b3307e" opacity="0.35" transform={`translate(0 4)`} />
      <path d={`M${X + 12} ${Y + 50} Q${X + 10} ${Y + 16} ${X + 44} ${Y + 14} Q${X + 82} ${Y + 10} ${X + 88} ${Y + 44} Q${X + 92} ${Y + 84} ${X + 54} ${Y + 88} Q${X + 14} ${Y + 90} ${X + 12} ${Y + 50} Z`} fill="url(#kp-syrup)" />
      <path d={`M${X + 34} ${Y + 50} a16 14 0 1 1 16 14 a10 8 0 0 1 -8 -10`} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3.5" strokeLinecap="round" className="ka-shimmer" />
      <path d={`M${X + 24} ${Y + 30} q8 -8 18 -8`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
      <g className="ka-bubble" style={delay(x, y, 3)}>
        <circle cx={X + 66} cy={Y + 64} r="4" fill="#ffd6ef" stroke="#fff" strokeWidth="1.2" />
        <circle cx={X + 72} cy={Y + 54} r="2.5" fill="#ffd6ef" stroke="#fff" strokeWidth="1" />
      </g>
      <g className="ka-bob" style={delay(x, y, 2.6)}>
        <circle cx={X + 30} cy={Y + 66} r="7" fill="#7bd389" stroke="#fff" strokeWidth="2" />
        <circle cx={X + 28} cy={Y + 64} r="2" fill="#fff" opacity="0.8" />
      </g>
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.26)
      // taburan meses warna-warni
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const sx = f(px + (h(x, y, 20 + k) - 0.5) * 34),
              sy = f(py + (h(x, y, 30 + k) - 0.5) * 30);
            return <rect key={k} x={f(sx - 3.5)} y={f(sy - 1.3)} width="7" height="2.6" rx="1.3" fill={RAINBOW[(k + Math.floor(r * 20)) % RAINBOW.length]} transform={`rotate(${f(h(x, y, 40 + k) * 180)} ${sx} ${sy})`} />;
          })}
        </g>
      );
    if (r < 0.36) {
      // permen bungkus terjatuh
      const c = pick(RAINBOW, x, y, 5);
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 90 - 45)} ${px} ${py})`}>
          <path d={`M${px - 13} ${py - 5} l6 5 l-6 5 z M${px + 13} ${py - 5} l-6 5 l6 5 z`} fill={c} opacity="0.8" />
          <ellipse cx={px} cy={py} rx="8" ry="6" fill={c} />
          <path d={`M${px - 4} ${py - 5} l-2 10 M${px + 2} ${py - 6} l-2 12`} stroke="#fff" strokeWidth="1.8" opacity="0.7" />
        </g>
      );
    }
    if (r < 0.44)
      return (
        <g className="ka-twinkle" style={delay(x, y, 2)}>
          {sparkle(px, py, 7, '#ffffff')}
        </g>
      );
    return null;
  },
};

/* ---------- 3. Toko Kue ---------- */

const ICING = ['#ff9ec5', '#8a5132', '#a7e8cf', '#fff1b8', '#c9a6ff'] as const;

const kue: ThemeArt = {
  name: 'Toko Kue',
  bg: '#fdf2e4',
  ink: '#7a4520',
  frame: '#fffaf2',
  tile: ['#fff7ec', '#f2cfb6'],
  tex: 'kp-tex-bakery',
  outLiquid: 0.12,
  defs: (
    <>
      <pattern id="kp-tex-bakery" width="36" height="36" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="8" r="1.1" fill="#c99564" opacity="0.35" />
        <circle cx="24" cy="14" r="1.4" fill="#fff" opacity="0.55" />
        <circle cx="14" cy="28" r="0.9" fill="#b37a4a" opacity="0.35" />
        <circle cx="30" cy="30" r="1" fill="#fff" opacity="0.45" />
        <path d="M18 4 l2 1.5" stroke="#d98aa8" strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round" />
      </pattern>
      <radialGradient id="kp-dome" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="0.75" stopColor="#e9f4fb" stopOpacity="0.22" />
        <stop offset="1" stopColor="#bcd6e6" stopOpacity="0.55" />
      </radialGradient>
      <linearGradient id="kp-sponge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f7d7a0" />
        <stop offset="1" stopColor="#d9a864" />
      </linearGradient>
      <linearGradient id="kp-steel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3f5f8" />
        <stop offset="0.5" stopColor="#c7ced6" />
        <stop offset="1" stopColor="#8e98a4" />
      </linearGradient>
      <radialGradient id="kp-ovenglow" cx="0.5" cy="0.6" r="0.7">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="0.6" stopColor="#ff9b3d" />
        <stop offset="1" stopColor="#8a3a14" />
      </radialGradient>
      <radialGradient id="kp-batter" cx="0.42" cy="0.38" r="0.7">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="0.7" stopColor="#fbe7c2" />
        <stop offset="1" stopColor="#e9c894" />
      </radialGradient>
      <radialGradient id="kp-bowl" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#bfeaf0" />
        <stop offset="0.6" stopColor="#7fcad6" />
        <stop offset="1" stopColor="#4a9eac" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.4) {
      // etalase kue bertudung kaca
      const ic = pick(ICING, x, y, 8);
      return (
        <g>
          {shadow(X, Y, 30, 8, 86)}
          <path d={`M${X + 44} ${Y + 68} h12 l3 12 h-18 z`} fill="#e8e0ec" />
          <ellipse cx={X + 50} cy={Y + 81} rx="16" ry="3.5" fill="#d6cbdb" />
          <ellipse cx={X + 50} cy={Y + 68} rx="31" ry="6" fill="#f7f2f9" stroke="#cdbfd4" strokeWidth="1.5" />
          <rect x={X + 28} y={Y + 46} width="44" height="20" rx="3" fill="url(#kp-sponge)" />
          <path d={`M${X + 28} ${Y + 56} h44`} stroke="#fff1f6" strokeWidth="3" />
          <rect x={X + 27} y={Y + 38} width="46" height="11" rx="5" fill={ic} />
          <path d={`M${X + 29} ${Y + 47} q3 7 6 0 q3 5 6 0 q3 8 6 0 q3 5 6 0 q3 7 6 0 q3 5 6 0 q3 6 5 0`} fill={ic} />
          <ellipse cx={X + 50} cy={Y + 39} rx="23" ry="4" fill={ic} />
          <ellipse cx={X + 50} cy={Y + 39} rx="23" ry="4" fill="#fff" opacity="0.25" />
          {[36, 50, 64].map((dx) => (
            <circle key={dx} cx={X + dx} cy={Y + 36} r="3.8" fill="#e8243e" />
          ))}
          {[36, 50, 64].map((dx) => (
            <circle key={dx} cx={X + dx - 1.2} cy={Y + 34.8} r="1.1" fill="#fff" opacity="0.8" />
          ))}
          <path d={`M${X + 18} ${Y + 68} Q${X + 18} ${Y + 16} ${X + 50} ${Y + 16} Q${X + 82} ${Y + 16} ${X + 82} ${Y + 68} Z`} fill="url(#kp-dome)" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2" />
          <path d={`M${X + 26} ${Y + 56} Q${X + 24} ${Y + 30} ${X + 40} ${Y + 22}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
          <circle cx={X + 50} cy={Y + 13} r="4.5" fill="#dfe5ea" stroke="#aab5bf" strokeWidth="1.2" />
        </g>
      );
    }
    if (r < 0.7)
      // oven roti yang menyala
      return (
        <g>
          {shadow(X, Y, 38, 8, 87)}
          <rect x={X + 14} y={Y + 16} width="72" height="68" rx="8" fill="url(#kp-steel)" stroke="#8e98a4" strokeWidth="1.5" />
          <rect x={X + 14} y={Y + 16} width="72" height="16" rx="7" fill="#606a78" />
          {[28, 42, 56].map((dx) => (
            <g key={dx}>
              <circle cx={X + dx} cy={Y + 24} r="4.2" fill="#e6eaef" />
              <path d={`M${X + dx} ${Y + 24} l0 -3.2`} stroke="#3b4250" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ))}
          <circle cx={X + 74} cy={Y + 24} r="2.8" fill="#ff5a3c" className="ka-glow" />
          <rect x={X + 22} y={Y + 36} width="56" height="4" rx="2" fill="#e6eaef" stroke="#8e98a4" strokeWidth="1" />
          <rect x={X + 22} y={Y + 44} width="56" height="32" rx="6" fill="#2a1a12" />
          <rect x={X + 24} y={Y + 46} width="52" height="28" rx="5" fill="url(#kp-ovenglow)" className="ka-glow" />
          <path d={`M${X + 26} ${Y + 66} h48`} stroke="#5a3a24" strokeWidth="1.5" />
          <ellipse cx={X + 38} cy={Y + 61} rx="9" ry="5" fill="#c9793a" />
          <ellipse cx={X + 60} cy={Y + 61} rx="10" ry="5.5" fill="#b8662c" />
          <path d={`M${X + 34} ${Y + 59} l3 -2 M${X + 39} ${Y + 60} l3 -2 M${X + 56} ${Y + 59} l3 -2 M${X + 62} ${Y + 60} l3 -2`} stroke="#f3cd92" strokeWidth="1.4" strokeLinecap="round" />
          <path d={`M${X + 28} ${Y + 50} l10 0`} stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
          <rect x={X + 20} y={Y + 84} width="8" height="3" rx="1.5" fill="#606a78" />
          <rect x={X + 72} y={Y + 84} width="8" height="3" rx="1.5" fill="#606a78" />
        </g>
      );
    // keranjang roti dilihat dari atas
    return (
      <g>
        {shadow(X, Y, 38, 12, 70, 0.2)}
        <ellipse cx={X + 50} cy={Y + 52} rx="38" ry="30" fill="#c98b4a" />
        {[-24, -12, 0, 12, 24].map((d) => (
          <path key={d} d={`M${X + 50 + d} ${Y + 23} v58`} stroke="#9a6430" strokeOpacity="0.5" strokeWidth="1.5" />
        ))}
        <ellipse cx={X + 50} cy={Y + 52} rx="38" ry="30" fill="none" stroke="#a86e36" strokeWidth="4" />
        <ellipse cx={X + 50} cy={Y + 52} rx="31" ry="23" fill="#8a5a2c" />
        <path d={`M${X + 22} ${Y + 40} L${X + 50} ${Y + 30} L${X + 40} ${Y + 64} Z`} fill="#fff" />
        <path d={`M${X + 28} ${Y + 38} l14 -5 M${X + 26} ${Y + 46} l20 -8 M${X + 30} ${Y + 54} l14 -6`} stroke="#ff6b7d" strokeWidth="2.6" opacity="0.8" />
        <ellipse cx={X + 56} cy={Y + 46} rx="24" ry="7" fill="#d98a3c" transform={`rotate(-22 ${X + 56} ${Y + 46})`} />
        <path d={`M${X + 44} ${Y + 52} l4 -6 M${X + 52} ${Y + 49} l4 -6 M${X + 60} ${Y + 45} l4 -6 M${X + 68} ${Y + 42} l4 -6`} stroke="#f7d7a0" strokeWidth="2" strokeLinecap="round" />
        <circle cx={X + 60} cy={Y + 64} r="10" fill="#c9793a" />
        <circle cx={X + 57} cy={Y + 61} r="3.5" fill="#f3cd92" opacity="0.6" />
        <path d={`M${X + 34} ${Y + 66} q6 -10 14 -2 q-2 6 -8 6 q-4 0 -6 -4 z`} fill="#e8a24c" stroke="#b8662c" strokeWidth="1.2" />
      </g>
    );
  },
  liquid: (X, Y, x, y) => (
    // baskom adonan krim dengan pengocok
    <g>
      {shadow(X, Y, 40, 9, 88, 0.18)}
      <circle cx={X + 50} cy={Y + 50} r="43" fill="url(#kp-bowl)" />
      <circle cx={X + 50} cy={Y + 50} r="43" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" />
      <circle cx={X + 50} cy={Y + 50} r="35" fill="url(#kp-batter)" />
      <path d={`M${X + 50} ${Y + 50} m-4 0 a4 4 0 0 1 8 0 a8 8 0 0 1 -16 0 a12 12 0 0 1 24 0 a16 16 0 0 1 -32 0`} fill="none" stroke="#e2bf86" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d={`M${X + 26} ${Y + 32} q10 -10 22 -10`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" className="ka-shimmer" />
      <g transform={`rotate(${f(h(x, y, 7) * 60 - 30)} ${X + 50} ${Y + 50})`}>
        <rect x={X + 47} y={Y + 2} width="6" height="24" rx="3" fill="#ff8fc0" />
        {[6, 10, 14].map((rx) => (
          <ellipse key={rx} cx={X + 50} cy={Y + 40} rx={rx / 2} ry="14" fill="none" stroke="#b8c2cc" strokeWidth="1.6" />
        ))}
      </g>
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.1)
      // kue kering cokelat
      return (
        <g>
          <circle cx={px} cy={py} r="9" fill="#d9a05a" stroke="#b37a3a" strokeWidth="1.2" />
          {[
            [-3, -3],
            [3, 1],
            [-2, 4],
            [4, -4],
          ].map(([dx, dy], k) => (
            <circle key={k} cx={px + dx} cy={py + dy} r="1.6" fill="#5a3218" />
          ))}
        </g>
      );
    if (r < 0.3)
      // remah & taburan gula
      return (
        <g>
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={f(px + (h(x, y, 20 + k) - 0.5) * 30)} cy={f(py + (h(x, y, 30 + k) - 0.5) * 24)} r={k % 2 ? 1.8 : 2.6} fill={k % 2 ? '#e8b77a' : '#c98b4a'} />
          ))}
          <rect x={px + 6} y={py - 8} width="6" height="2.4" rx="1.2" fill={pick(RAINBOW, x, y, 5)} transform={`rotate(40 ${px + 9} ${py - 7})`} />
        </g>
      );
    if (r < 0.37)
      // stroberi
      return (
        <g>
          <path d={`M${px - 7} ${py - 3} Q${px - 8} ${py + 6} ${px} ${py + 10} Q${px + 8} ${py + 6} ${px + 7} ${py - 3} Q${px} ${py - 7} ${px - 7} ${py - 3} Z`} fill="#e8243e" />
          <path d={`M${px - 5} ${py - 4} l5 3 l5 -3 l-2 -3 l-3 2 l-3 -2 z`} fill="#4fae3b" />
          {[
            [-3, 1],
            [2, 2],
            [0, 6],
          ].map(([dx, dy], k) => (
            <circle key={k} cx={px + dx} cy={py + dy} r="0.9" fill="#ffe08a" />
          ))}
        </g>
      );
    return null;
  },
};

/* ---------- 4. Pasar Buah ---------- */

const buah: ThemeArt = {
  name: 'Pasar Buah',
  bg: '#f4f5dc',
  ink: '#5a4a14',
  frame: '#fffbee',
  tile: ['#e8cf98', '#dfc386'],
  tex: 'kp-tex-weave',
  outLiquid: 0.14,
  defs: (
    <>
      <pattern id="kp-tex-weave" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="12" height="12" fill="#fff" opacity="0.13" />
        <rect x="12" y="12" width="12" height="12" fill="#fff" opacity="0.13" />
        <path d="M0 4 h12 M0 8 h12 M16 0 v12 M20 0 v12 M12 16 h12 M12 20 h12 M4 12 v12 M8 12 v12" stroke="#9c7136" strokeOpacity="0.32" strokeWidth="1.2" fill="none" />
        <path d="M0 12 h24 M12 0 v24" stroke="#86602a" strokeOpacity="0.28" strokeWidth="1" fill="none" />
      </pattern>
      <linearGradient id="kp-crate" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dcb277" />
        <stop offset="1" stopColor="#a8753e" />
      </linearGradient>
      <radialGradient id="kp-orange" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffd08a" />
        <stop offset="0.55" stopColor="#ff9a1f" />
        <stop offset="1" stopColor="#d96a0a" />
      </radialGradient>
      <radialGradient id="kp-apple" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ff9a9a" />
        <stop offset="0.55" stopColor="#e8303e" />
        <stop offset="1" stopColor="#9e1422" />
      </radialGradient>
      <radialGradient id="kp-lime" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#d9f59a" />
        <stop offset="0.55" stopColor="#7cc63a" />
        <stop offset="1" stopColor="#4a8a1e" />
      </radialGradient>
      <radialGradient id="kp-melon" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#8fd65f" />
        <stop offset="0.6" stopColor="#3f9a2c" />
        <stop offset="1" stopColor="#1f5a16" />
      </radialGradient>
      <radialGradient id="kp-tub" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#e8eef3" />
        <stop offset="0.6" stopColor="#a8b6c2" />
        <stop offset="1" stopColor="#6d7c8a" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.45) {
      // peti kayu penuh buah dilihat dari atas
      const fruit = pick(['kp-orange', 'kp-apple', 'kp-lime'], x, y, 8);
      return (
        <g>
          {shadow(X, Y, 40, 12, 74, 0.22)}
          <rect x={X + 11} y={Y + 11} width="78" height="78" rx="5" fill="url(#kp-crate)" />
          <rect x={X + 11} y={Y + 11} width="78" height="78" rx="5" fill="url(#ka-bevel)" />
          <path d={`M${X + 11} ${Y + 17} h78 M${X + 11} ${Y + 83} h78`} stroke="#8a5a2a" strokeOpacity="0.4" strokeWidth="1.5" />
          <rect x={X + 18} y={Y + 18} width="64" height="64" rx="3" fill="#6b4524" />
          {[32, 50, 68].map((cy) =>
            [32, 50, 68].map((cx) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={X + cx} cy={Y + cy} r="9.5" fill={`url(#${fruit})`} />
                <circle cx={X + cx - 3} cy={Y + cy - 3} r="2.2" fill="#fff" opacity="0.6" />
              </g>
            )),
          )}
          <path d={`M${X + 50} ${Y + 41} l1 -3 M${X + 32} ${Y + 59} l1 -3`} stroke="#5a3a1a" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx={X + 55} cy={Y + 40} rx="4.5" ry="2.2" fill="#4fae3b" transform={`rotate(-30 ${X + 55} ${Y + 40})`} />
          {[
            [15, 15],
            [85, 15],
            [15, 85],
            [85, 85],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={X + dx} cy={Y + dy} r="1.5" fill="#5a3a1a" opacity="0.6" />
          ))}
          <g transform={`rotate(-8 ${X + 30} ${Y + 86})`}>
            <rect x={X + 20} y={Y + 80} width="22" height="12" rx="2" fill="#fffdf2" stroke="#c9b28a" strokeWidth="1" />
            <path d={`M${X + 24} ${Y + 86} h14`} stroke="#e8303e" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>
      );
    }
    if (r < 0.72)
      // tumpukan semangka + sepotong
      return (
        <g>
          {shadow(X, Y, 38, 10, 80)}
          {[
            [36, 58, -18],
            [64, 60, 14],
            [50, 38, 0],
          ].map(([cx, cy, a]) => (
            <g key={cx} transform={`rotate(${a} ${X + cx} ${Y + cy})`}>
              <ellipse cx={X + cx} cy={Y + cy} rx="21" ry="16" fill="url(#kp-melon)" />
              <path d={`M${X + cx - 18} ${Y + cy - 4} q18 -6 36 0 M${X + cx - 19} ${Y + cy + 4} q19 6 38 0 M${X + cx - 12} ${Y + cy - 11} q12 -4 24 0`} stroke="#1f5a16" strokeWidth="2.6" fill="none" opacity="0.7" />
              <ellipse cx={X + cx - 8} cy={Y + cy - 7} rx="6" ry="3" fill="#fff" opacity="0.3" />
            </g>
          ))}
          <path d={`M${X + 56} ${Y + 86} a16 16 0 0 1 30 -10 z`} fill="#3f9a2c" />
          <path d={`M${X + 58.5} ${Y + 84} a13 13 0 0 1 24.5 -8 z`} fill="#ff4f5e" />
          {[
            [66, 80],
            [72, 78],
            [70, 83],
          ].map(([sx, sy]) => (
            <ellipse key={sx + sy} cx={X + sx} cy={Y + sy} rx="1" ry="1.6" fill="#2b1a1a" />
          ))}
        </g>
      );
    // keranjang anyaman berisi pisang
    return (
      <g>
        {shadow(X, Y, 38, 12, 72, 0.2)}
        <circle cx={X + 50} cy={Y + 52} r="36" fill="#c98b4a" />
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <path key={a} d={`M${X + 14} ${Y + 52} h72`} stroke="#9a6430" strokeOpacity="0.45" strokeWidth="1.5" transform={`rotate(${a} ${X + 50} ${Y + 52})`} />
        ))}
        <circle cx={X + 50} cy={Y + 52} r="36" fill="none" stroke="#a86e36" strokeWidth="5" />
        <circle cx={X + 50} cy={Y + 52} r="36" fill="none" stroke="#e0b077" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx={X + 50} cy={Y + 52} r="28" fill="#8a5a2c" />
        {[
          [0, 0],
          [4, 8],
          [-2, 16],
        ].map(([dx, dy], i) => (
          <g key={i}>
            <path d={`M${X + 28 + dx} ${Y + 36 + dy} Q${X + 50 + dx} ${Y + 62 + dy} ${X + 74 + dx} ${Y + 38 + dy} Q${X + 52 + dx} ${Y + 52 + dy} ${X + 28 + dx} ${Y + 36 + dy} Z`} fill="#ffd84a" stroke="#c9a012" strokeWidth="1.2" />
            <path d={`M${X + 34 + dx} ${Y + 42 + dy} Q${X + 50 + dx} ${Y + 54 + dy} ${X + 66 + dx} ${Y + 44 + dy}`} stroke="#fff6b8" strokeWidth="1.6" fill="none" opacity="0.7" />
            <circle cx={X + 28 + dx} cy={Y + 36 + dy} r="2" fill="#5a3a1a" />
          </g>
        ))}
        <path d={`M${X + 72} ${Y + 38} l6 -5`} stroke="#6b8a2a" strokeWidth="4" strokeLinecap="round" />
        <circle cx={X + 40} cy={Y + 72} r="7" fill="url(#kp-apple)" />
        <circle cx={X + 38} cy={Y + 70} r="1.8" fill="#fff" opacity="0.6" />
      </g>
    );
  },
  liquid: (X, Y, x, y) => (
    // bak cuci buah dengan apel & lemon terapung
    <g>
      {shadow(X, Y, 42, 10, 88, 0.18)}
      <circle cx={X + 50} cy={Y + 50} r="44" fill="url(#kp-tub)" />
      <circle cx={X + 50} cy={Y + 50} r="41" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx={X + 50} cy={Y + 50} r="36" fill="url(#ka-water)" />
      <path d={`M${X + 24} ${Y + 44} q8 -6 16 0 t16 0 t16 0`} fill="none" stroke="#e6f7ff" strokeWidth="3.5" strokeLinecap="round" className="ka-shimmer" />
      <g className="ka-bob" style={delay(x, y, 3)}>
        <circle cx={X + 36} cy={Y + 62} r="9" fill="url(#kp-apple)" />
        <circle cx={X + 33} cy={Y + 59} r="2.2" fill="#fff" opacity="0.6" />
        <path d={`M${X + 36} ${Y + 53} l1 -4`} stroke="#5a3a1a" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="ka-bob" style={delay(x + 1, y, 3)}>
        <ellipse cx={X + 64} cy={Y + 64} rx="10" ry="7.5" fill="#ffe14a" stroke="#d9b20a" strokeWidth="1" />
        <circle cx={X + 61} cy={Y + 61} r="2" fill="#fff" opacity="0.6" />
        <circle cx={X + 60} cy={Y + 32} r="7" fill="url(#kp-orange)" />
      </g>
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.14) return <path d={`M${px - 9} ${py} q9 -10 18 0 q-9 10 -18 0 z M${px - 9} ${py} h18`} fill="#6fbf45" stroke="#3f8a2c" strokeWidth="1.2" transform={`rotate(${f(h(x, y, 5) * 180)} ${px} ${py})`} />;
    if (r < 0.22)
      // sepasang ceri
      return (
        <g>
          <path d={`M${px - 5} ${py + 4} Q${px - 2} ${py - 10} ${px + 3} ${py - 12} M${px + 6} ${py + 5} Q${px + 5} ${py - 6} ${px + 3} ${py - 12}`} stroke="#4a7a1e" strokeWidth="1.6" fill="none" />
          <circle cx={px - 5} cy={py + 5} r="5" fill="url(#kp-apple)" />
          <circle cx={px + 6} cy={py + 6} r="5" fill="url(#kp-apple)" />
          <ellipse cx={px + 7} cy={py - 11} rx="4" ry="2" fill="#6fbf45" />
        </g>
      );
    if (r < 0.3)
      // anggur
      return (
        <g>
          {[
            [0, -8],
            [-5, -3],
            [5, -3],
            [-3, 3],
            [3, 3],
            [0, 8],
          ].map(([dx, dy], k) => (
            <circle key={k} cx={px + dx} cy={py + dy} r="3.6" fill="#8e44c9" stroke="#5e2a8a" strokeWidth="0.8" />
          ))}
          <path d={`M${px} ${py - 11} l2 -4`} stroke="#5a3a1a" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    if (r < 0.36)
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 40 - 20)} ${px} ${py})`}>
          <rect x={px - 8} y={py - 5} width="16" height="10" rx="2" fill="#fffdf2" stroke="#c9b28a" strokeWidth="1" />
          <path d={`M${px - 5} ${py} h10`} stroke="#2bb673" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    return null;
  },
};

/* ---------- 5. Pabrik Mainan ---------- */

const BLOCK = ['#ff5f6d', '#3fa9f5', '#ffc93c', '#5ccf7a', '#a87bff'] as const;

/** balok huruf dengan sisi atas & samping (tampak miring) */
const toyBlock = (bx: number, by: number, s: number, c: string, letter: string) => (
  <g>
    <path d={`M${bx} ${by} l7 -7 h${s} l-7 7 z`} fill={c} />
    <path d={`M${bx} ${by} l7 -7 h${s} l-7 7 z`} fill="#fff" opacity="0.4" />
    <path d={`M${bx + s} ${by} l7 -7 v${s} l-7 7 z`} fill={c} />
    <path d={`M${bx + s} ${by} l7 -7 v${s} l-7 7 z`} fill="#000" opacity="0.2" />
    <rect x={bx} y={by} width={s} height={s} fill={c} />
    <rect x={bx + 3} y={by + 3} width={s - 6} height={s - 6} rx="3" fill="#fff" opacity="0.28" />
    <text x={bx + s / 2} y={by + s * 0.74} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize={s * 0.62} fontWeight="900" fill="#fff" stroke="#00000033" strokeWidth="1">
      {letter}
    </text>
  </g>
);

const mainan: ThemeArt = {
  name: 'Pabrik Mainan',
  bg: '#eaf2ff',
  ink: '#27407a',
  frame: '#fbfcff',
  tile: ['#ffc4d0', '#bfe4ff'],
  tex: 'kp-tex-foam',
  outLiquid: 0.14,
  defs: (
    <>
      <pattern id="kp-tex-foam" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M0 1 h19 a6 6 0 0 1 12 0 h19 M1 0 v19 a6 6 0 0 0 0 12 v19" stroke="#fff" strokeOpacity="0.65" strokeWidth="2" fill="none" />
        <circle cx="12" cy="14" r="0.9" fill="#000" opacity="0.12" />
        <circle cx="36" cy="22" r="0.8" fill="#000" opacity="0.1" />
        <circle cx="22" cy="38" r="0.9" fill="#000" opacity="0.12" />
        <circle cx="40" cy="42" r="1" fill="#fff" opacity="0.5" />
        <circle cx="28" cy="10" r="0.8" fill="#fff" opacity="0.5" />
      </pattern>
      <radialGradient id="kp-teddy" cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#e8b27a" />
        <stop offset="0.6" stopColor="#c07a3e" />
        <stop offset="1" stopColor="#8a5226" />
      </radialGradient>
      <linearGradient id="kp-toybox" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5fb8ff" />
        <stop offset="1" stopColor="#2a7fd4" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.4) {
      // tumpukan balok huruf
      const k = Math.floor(h(x, y, 8) * BLOCK.length);
      return (
        <g>
          {shadow(X, Y, 38, 9, 84)}
          {toyBlock(X + 16, Y + 52, 30, BLOCK[k % 5], 'A')}
          {toyBlock(X + 49, Y + 52, 30, BLOCK[(k + 1) % 5], 'B')}
          {toyBlock(X + 33, Y + 19, 30, BLOCK[(k + 2) % 5], 'C')}
        </g>
      );
    }
    if (r < 0.7) {
      // boneka beruang duduk
      const bow = pick(['#ff4f6d', '#3fa9f5', '#ffc93c'], x, y, 9);
      return (
        <g>
          {shadow(X, Y, 30, 8, 86)}
          <ellipse cx={X + 50} cy={Y + 64} rx="21" ry="19" fill="url(#kp-teddy)" />
          <ellipse cx={X + 50} cy={Y + 68} rx="12" ry="11" fill="#f3d2a8" />
          <ellipse cx={X + 28} cy={Y + 60} rx="7" ry="12" fill="url(#kp-teddy)" transform={`rotate(25 ${X + 28} ${Y + 60})`} />
          <ellipse cx={X + 72} cy={Y + 60} rx="7" ry="12" fill="url(#kp-teddy)" transform={`rotate(-25 ${X + 72} ${Y + 60})`} />
          {[36, 64].map((dx) => (
            <g key={dx}>
              <circle cx={X + dx} cy={Y + 80} r="9" fill="url(#kp-teddy)" />
              <circle cx={X + dx} cy={Y + 81} r="5" fill="#f3d2a8" />
            </g>
          ))}
          <circle cx={X + 34} cy={Y + 20} r="8" fill="url(#kp-teddy)" />
          <circle cx={X + 66} cy={Y + 20} r="8" fill="url(#kp-teddy)" />
          <circle cx={X + 34} cy={Y + 20} r="4" fill="#f3d2a8" />
          <circle cx={X + 66} cy={Y + 20} r="4" fill="#f3d2a8" />
          <circle cx={X + 50} cy={Y + 34} r="18" fill="url(#kp-teddy)" />
          <ellipse cx={X + 50} cy={Y + 41} rx="9" ry="7" fill="#f3d2a8" />
          <ellipse cx={X + 50} cy={Y + 38} rx="3.5" ry="2.6" fill="#3a2418" />
          <path d={`M${X + 50} ${Y + 41} v3 M${X + 46} ${Y + 45} q4 3 8 0`} stroke="#3a2418" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx={X + 43} cy={Y + 30} r="2.6" fill="#1a1a22" />
          <circle cx={X + 57} cy={Y + 30} r="2.6" fill="#1a1a22" />
          <circle cx={X + 42.2} cy={Y + 29.2} r="0.9" fill="#fff" />
          <circle cx={X + 56.2} cy={Y + 29.2} r="0.9" fill="#fff" />
          <path d={`M${X + 50} ${Y + 52} l-9 -5 v10 z M${X + 50} ${Y + 52} l9 -5 v10 z`} fill={bow} />
          <circle cx={X + 50} cy={Y + 52} r="3" fill={bow} stroke="#00000033" strokeWidth="1" />
          <path d={`M${X + 40} ${Y + 24} q6 -6 14 -4`} stroke="#fff" strokeOpacity="0.3" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    }
    // peti mainan terbuka
    return (
      <g>
        {shadow(X, Y, 38, 9, 86)}
        <path d={`M${X + 18} ${Y + 44} l8 -26 h48 l8 26 z`} fill="#1f6fbf" />
        <path d={`M${X + 22} ${Y + 42} l6 -20 h44 l6 20 z`} fill="#154f8a" />
        <circle cx={X + 38} cy={Y + 40} r="11" fill="#ff5f6d" />
        <path d={`M${X + 27} ${Y + 40} q11 -8 22 0`} stroke="#fff" strokeWidth="3" fill="none" />
        <circle cx={X + 35} cy={Y + 35} r="2.5" fill="#fff" opacity="0.7" />
        <path d={`M${X + 62} ${Y + 44} l4 -18`} stroke="#ffc93c" strokeWidth="3" strokeLinecap="round" />
        <path d={starPath(X + 66, Y + 24, 8, 3.6)} fill="#ffe14a" stroke="#e0a100" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x={X + 48} y={Y + 32} width="10" height="12" rx="2" fill="#5ccf7a" />
        <rect x={X + 16} y={Y + 44} width="68" height="40" rx="5" fill="url(#kp-toybox)" />
        {[26, 40, 54, 68].map((dx) => (
          <rect key={dx} x={X + dx} y={Y + 44} width="6" height="40" fill="#fff" opacity="0.18" />
        ))}
        <rect x={X + 16} y={Y + 44} width="68" height="40" rx="5" fill="url(#ka-bevel)" />
        <rect x={X + 14} y={Y + 42} width="72" height="7" rx="3.5" fill="#ffc93c" />
        <path d={starPath(X + 50, Y + 66, 10, 4.5)} fill="#ffe14a" stroke="#e0a100" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
    );
  },
  liquid: (X, Y, x, y) => {
    // kolam bola warna-warni
    const balls: [number, number][] = [[0, 0]];
    [
      [11, 6, 0],
      [21, 12, 0.3],
      [30, 17, 0.1],
    ].forEach(([rr, n, off]) => {
      for (let k = 0; k < n; k++) {
        const a = ((k + off) / n) * Math.PI * 2;
        balls.push([f(Math.cos(a) * rr), f(Math.sin(a) * rr)]);
      }
    });
    const s = Math.floor(h(x, y, 8) * 6);
    return (
      <g>
        {shadow(X, Y, 42, 10, 88, 0.18)}
        <circle cx={X + 50} cy={Y + 50} r="45" fill="#ff8fab" />
        <circle cx={X + 50} cy={Y + 50} r="41" fill="none" stroke="#7cc6ff" strokeWidth="8" strokeDasharray="21.5 21.5" />
        <circle cx={X + 50} cy={Y + 50} r="45" fill="url(#ka-bevel)" />
        <circle cx={X + 50} cy={Y + 50} r="37" fill="#3a3f6e" />
        {balls.map(([dx, dy], i) => (
          <g key={i}>
            <circle cx={f(X + 50 + dx)} cy={f(Y + 50 + dy)} r="5.8" fill={RAINBOW[(i + s) % RAINBOW.length]} />
            <circle cx={f(X + 48.4 + dx)} cy={f(Y + 48.4 + dy)} r="1.7" fill="#fff" opacity="0.75" />
          </g>
        ))}
      </g>
    );
  },
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    const c = pick(BLOCK, x, y, 5);
    if (r < 0.1)
      // mobil mainan kecil dilihat dari atas
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 360)} ${px} ${py})`}>
          <rect x={px - 7} y={py - 11} width="14" height="22" rx="5" fill={c} stroke="#00000033" strokeWidth="1" />
          <rect x={px - 5} y={py - 6} width="10" height="5" rx="2" fill="#1f2a3a" />
          <rect x={px - 9} y={py - 8} width="3" height="5" rx="1" fill="#2b2b36" />
          <rect x={px + 6} y={py - 8} width="3" height="5" rx="1" fill="#2b2b36" />
          <rect x={px - 9} y={py + 3} width="3" height="5" rx="1" fill="#2b2b36" />
          <rect x={px + 6} y={py + 3} width="3" height="5" rx="1" fill="#2b2b36" />
        </g>
      );
    if (r < 0.2)
      // bata mainan
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 90)} ${px} ${py})`}>
          <rect x={px - 10} y={py - 6} width="20" height="12" rx="2" fill={c} />
          {[-5, 5].map((dx) =>
            [-2, 2].map((dy) => (
              <g key={`${dx}${dy}`}>
                <circle cx={px + dx} cy={py + dy * 1.2} r="2.4" fill={c} stroke="#00000033" strokeWidth="0.8" />
                <circle cx={px + dx - 0.6} cy={py + dy * 1.2 - 0.6} r="0.8" fill="#fff" opacity="0.7" />
              </g>
            )),
          )}
        </g>
      );
    if (r < 0.26)
      return (
        <g className="ka-hop" style={delay(x, y, 3)}>
          <circle cx={px} cy={py} r="7" fill={c} />
          <path d={`M${px - 7} ${py} q7 -5 14 0`} stroke="#fff" strokeWidth="2" fill="none" />
          <circle cx={px - 2.5} cy={py - 2.5} r="1.8" fill="#fff" opacity="0.7" />
        </g>
      );
    if (r < 0.32) return <path d={starPath(px, py, 7, 3)} fill="#ffe14a" stroke="#e0a100" strokeWidth="1.2" strokeLinejoin="round" />;
    return null;
  },
};

/* ---------- 6. Panggung Musik ---------- */

/** not musik (satu atau dua) */
const note = (px: number, py: number, c: string, double: boolean) =>
  double ? (
    <g fill={c} stroke={c}>
      <ellipse cx={px - 7} cy={py + 6} rx="4.6" ry="3.4" transform={`rotate(-20 ${px - 7} ${py + 6})`} stroke="none" />
      <ellipse cx={px + 7} cy={py + 3} rx="4.6" ry="3.4" transform={`rotate(-20 ${px + 7} ${py + 3})`} stroke="none" />
      <path d={`M${px - 3} ${py + 5} V${py - 12} M${px + 11} ${py + 2} V${py - 15}`} strokeWidth="2" fill="none" />
      <path d={`M${px - 3} ${py - 12} L${px + 11} ${py - 15} v4 L${px - 3} ${py - 8} Z`} strokeWidth="0.5" />
    </g>
  ) : (
    <g fill={c} stroke={c}>
      <ellipse cx={px} cy={py + 6} rx="5" ry="3.6" transform={`rotate(-20 ${px} ${py + 6})`} stroke="none" />
      <path d={`M${px + 4.5} ${py + 5} V${py - 13} q8 3 6 11`} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );

const musik: ThemeArt = {
  name: 'Panggung Musik',
  bg: '#fdeedd',
  ink: '#6a2d14',
  frame: '#fff6ea',
  tile: ['#c8844c', '#bc7842'],
  tex: 'kp-tex-stage',
  outLiquid: 0.12,
  defs: (
    <>
      <pattern id="kp-tex-stage" width="100" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 0.5 h100 M0 20.5 h100" stroke="#6b3a18" strokeOpacity="0.45" strokeWidth="1.6" fill="none" />
        <path d="M0 2 h100 M0 22 h100" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.2" fill="none" />
        <path d="M34 0 v20 M82 20 v20" stroke="#6b3a18" strokeOpacity="0.45" strokeWidth="1.6" />
        <path d="M6 10 q20 -3 40 0 t40 0 M50 31 q14 -3 28 0" stroke="#8a4f22" strokeOpacity="0.25" strokeWidth="1" fill="none" />
        <circle cx="30" cy="5" r="1" fill="#4a2a10" opacity="0.5" />
        <circle cx="38" cy="5" r="1" fill="#4a2a10" opacity="0.5" />
        <circle cx="78" cy="25" r="1" fill="#4a2a10" opacity="0.5" />
        <circle cx="86" cy="25" r="1" fill="#4a2a10" opacity="0.5" />
      </pattern>
      <linearGradient id="kp-speaker" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a4f60" />
        <stop offset="1" stopColor="#1b1e28" />
      </linearGradient>
      <radialGradient id="kp-cone" cx="0.42" cy="0.38" r="0.7">
        <stop offset="0" stopColor="#6b7184" />
        <stop offset="0.7" stopColor="#2b2f3c" />
        <stop offset="1" stopColor="#12141c" />
      </radialGradient>
      <radialGradient id="kp-drumhead" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e2ddd4" />
      </radialGradient>
      <linearGradient id="kp-drumshell" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9e1b2e" />
        <stop offset="0.35" stopColor="#ff5a6e" />
        <stop offset="1" stopColor="#8a1426" />
      </linearGradient>
      <radialGradient id="kp-spot" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff6c2" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff6c2" stopOpacity="0" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.38)
      // pengeras suara
      return (
        <g>
          {shadow(X, Y, 30, 8, 86)}
          <rect x={X + 24} y={Y + 12} width="52" height="72" rx="7" fill="url(#kp-speaker)" stroke="#12141c" strokeWidth="1.5" />
          <rect x={X + 24} y={Y + 12} width="52" height="72" rx="7" fill="url(#ka-bevel)" />
          <circle cx={X + 50} cy={Y + 28} r="8" fill="#12141c" />
          <circle cx={X + 50} cy={Y + 28} r="6" fill="url(#kp-cone)" />
          <circle cx={X + 50} cy={Y + 58} r="19" fill="#12141c" />
          <circle cx={X + 50} cy={Y + 58} r="17" fill="url(#kp-cone)" />
          <circle cx={X + 50} cy={Y + 58} r="17" fill="none" stroke="#8a90a2" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx={X + 50} cy={Y + 58} r="6" fill="#3b4050" />
          <circle cx={X + 48} cy={Y + 56} r="2" fill="#fff" opacity="0.35" />
          <circle cx={X + 68} cy={Y + 78} r="2.2" fill="#4cf0ff" className="ka-glow" />
          {[18, 82].map((dx) => (
            <rect key={dx} x={X + dx - 3} y={Y + 84} width="6" height="3" rx="1.5" fill="#12141c" />
          ))}
        </g>
      );
    if (r < 0.7)
      // gendang senar dengan dua stik
      return (
        <g>
          {shadow(X, Y, 34, 9, 84)}
          <path d={`M${X + 18} ${Y + 44} v24 a32 12 0 0 0 64 0 v-24 z`} fill="url(#kp-drumshell)" />
          {[26, 40, 60, 74].map((dx) => (
            <rect key={dx} x={X + dx - 2} y={Y + 50} width="4" height="18" rx="2" fill="#e8ecf0" stroke="#8e98a4" strokeWidth="0.8" />
          ))}
          <path d={`M${X + 18} ${Y + 66} a32 12 0 0 0 64 0`} stroke="#d9dee4" strokeWidth="3" fill="none" />
          <ellipse cx={X + 50} cy={Y + 44} rx="32" ry="12" fill="#d9dee4" />
          <ellipse cx={X + 50} cy={Y + 44} rx="29" ry="10" fill="url(#kp-drumhead)" />
          <ellipse cx={X + 44} cy={Y + 42} rx="10" ry="3" fill="#fff" opacity="0.8" />
          <path d={`M${X + 22} ${Y + 18} L${X + 58} ${Y + 42} M${X + 78} ${Y + 16} L${X + 46} ${Y + 40}`} stroke="#e8b87a" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx={X + 58} cy={Y + 42} r="3" fill="#f3d2a8" />
          <circle cx={X + 46} cy={Y + 40} r="3" fill="#f3d2a8" />
        </g>
      );
    // keyboard di atas penyangga
    return (
      <g>
        {shadow(X, Y, 40, 8, 86)}
        <path d={`M${X + 26} ${Y + 84} L${X + 74} ${Y + 58} M${X + 74} ${Y + 84} L${X + 26} ${Y + 58}`} stroke="#3b4050" strokeWidth="5" strokeLinecap="round" />
        <rect x={X + 8} y={Y + 32} width="84" height="28" rx="5" fill="#2b2f3c" />
        <rect x={X + 8} y={Y + 32} width="84" height="28" rx="5" fill="url(#ka-bevel)" />
        <rect x={X + 12} y={Y + 36} width="22" height="5" rx="2" fill="#4cf0ff" opacity="0.7" className="ka-glow" />
        {[42, 50, 58, 66, 74, 82].map((dx) => (
          <circle key={dx} cx={X + dx} cy={Y + 38.5} r="2" fill={dx % 16 ? '#ff5a6e' : '#ffd23f'} />
        ))}
        <rect x={X + 12} y={Y + 44} width="76" height="14" rx="1.5" fill="#fffdf6" />
        {[...Array(12)].map((_, k) => (
          <path key={k} d={`M${f(X + 12 + ((k + 1) * 76) / 13)} ${Y + 44} v14`} stroke="#b8b0a0" strokeWidth="0.8" />
        ))}
        {[0, 1, 3, 4, 5, 7, 8, 10, 11].map((k) => (
          <rect key={k} x={f(X + 12 + ((k + 1) * 76) / 13 - 2)} y={Y + 44} width="4" height="8" rx="1" fill="#1b1e28" />
        ))}
      </g>
    );
  },
  liquid: (X, Y) => (
    // karpet bundar di bawah lampu sorot
    <g>
      {shadow(X, Y, 42, 9, 86, 0.14)}
      <circle cx={X + 50} cy={Y + 50} r="45" fill="#b82a44" />
      <circle cx={X + 50} cy={Y + 50} r="45" fill="none" stroke="#ffd23f" strokeWidth="3" strokeDasharray="2 5" />
      <circle cx={X + 50} cy={Y + 50} r="38" fill="#e04f5f" />
      <circle cx={X + 50} cy={Y + 50} r="33" fill="none" stroke="#ffd23f" strokeWidth="2.5" />
      <circle cx={X + 50} cy={Y + 50} r="28" fill="#c8324a" />
      <path d={starPath(X + 50, Y + 50, 18, 8)} fill="#ffd23f" stroke="#e0a100" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={X + 50} cy={Y + 50} r="45" fill="url(#kp-spot)" className="ka-glow" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    const c = pick(['#7a3fd0', '#e0304c', '#1f7fc0', '#2b2f3c'], x, y, 5);
    if (r < 0.28)
      return (
        <g className="ka-bob" style={delay(x, y, 2.6)}>
          {note(px, py, c, h(x, y, 7) < 0.4)}
        </g>
      );
    if (r < 0.34)
      // pick gitar
      return <path d={`M${px - 7} ${py - 6} Q${px} ${py - 10} ${px + 7} ${py - 6} Q${px + 6} ${py + 4} ${px} ${py + 9} Q${px - 6} ${py + 4} ${px - 7} ${py - 6} Z`} fill={pick(RAINBOW, x, y, 7)} stroke="#00000033" strokeWidth="1" transform={`rotate(${f(h(x, y, 8) * 360)} ${px} ${py})`} />;
    if (r < 0.4)
      return (
        <g className="ka-twinkle" style={delay(x, y, 2)}>
          {sparkle(px, py, 6, '#ffe14a')}
        </g>
      );
    return null;
  },
};

/* ---------- 7. Akuarium ---------- */

const FISH = ['#ff9f43', '#ffd23f', '#ff6f91', '#4cf0ff', '#9b8cff'] as const;

/** ikan kecil menghadap kiri */
const fish = (px: number, py: number, c: string, s = 1) => (
  <g>
    <ellipse cx={px} cy={py} rx={10 * s} ry={5.5 * s} fill={c} />
    <path d={`M${f(px + 8 * s)} ${py} l${f(8 * s)} ${f(-6 * s)} v${f(12 * s)} z`} fill={c} />
    <path d={`M${f(px - 1 * s)} ${f(py - 5 * s)} v${f(10 * s)}`} stroke="#fff" strokeWidth={f(2 * s)} opacity="0.85" />
    <circle cx={f(px - 5 * s)} cy={f(py - 1.2 * s)} r={f(1.5 * s)} fill="#111" />
  </g>
);

const akuarium: ThemeArt = {
  name: 'Akuarium',
  bg: '#071f36',
  ink: '#d2f1ff',
  frame: '#0d3150',
  dark: true,
  tile: ['#1b5a80', '#185379'],
  tex: 'kp-tex-glassfloor',
  outLiquid: 0.22,
  defs: (
    <>
      <pattern id="kp-tex-glassfloor" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M4 16 q10 -8 20 0 q8 8 18 -2 M12 46 q12 -10 22 -2 q10 8 22 -4" stroke="#8ff0ff" strokeOpacity="0.28" strokeWidth="2" fill="none" />
        <path d="M0 0.5 h60 M0.5 0 v60" stroke="#bff6ff" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        <circle cx="46" cy="30" r="1.3" fill="#e6fdff" opacity="0.6" />
        <circle cx="20" cy="30" r="0.9" fill="#e6fdff" opacity="0.4" />
      </pattern>
      <linearGradient id="kp-tank" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fe0ff" />
        <stop offset="0.6" stopColor="#1f9ad0" />
        <stop offset="1" stopColor="#0f5f8f" />
      </linearGradient>
      <radialGradient id="kp-sphere" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#bdf3ff" stopOpacity="0.9" />
        <stop offset="0.6" stopColor="#2aa6d6" stopOpacity="0.85" />
        <stop offset="1" stopColor="#0d4a78" stopOpacity="0.95" />
      </radialGradient>
      <radialGradient id="kp-pedestal" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#5a7a94" />
        <stop offset="1" stopColor="#1c3348" />
      </radialGradient>
      <radialGradient id="kp-touch" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#7fe8f5" />
        <stop offset="0.6" stopColor="#2fb2c8" />
        <stop offset="1" stopColor="#157a90" />
      </radialGradient>
      <radialGradient id="kp-jellyglow" cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffe2f6" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ff7ad0" stopOpacity="0.8" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.45) {
      // akuarium kaca berisi ikan
      const c = pick(FISH, x, y, 8),
        c2 = pick(FISH, x, y, 9);
      return (
        <g>
          {shadow(X, Y, 40, 8, 86, 0.35)}
          <rect x={X + 10} y={Y + 16} width="80" height="68" rx="6" fill="#2b3a4e" />
          <rect x={X + 14} y={Y + 24} width="72" height="56" rx="3" fill="url(#kp-tank)" />
          <path d={`M${X + 14} ${Y + 70} q18 -6 36 -2 t36 -2 v14 h-72 z`} fill="#f3d9a4" />
          <circle cx={X + 30} cy={Y + 74} r="3" fill="#ff9ecb" />
          <circle cx={X + 70} cy={Y + 75} r="4" fill="#9aa1a8" />
          <g className="ka-sway" style={delay(x, y, 3)}>
            <path d={`M${X + 24} ${Y + 72} q-5 -10 0 -20 q5 -10 0 -18 M${X + 30} ${Y + 72} q5 -8 1 -16`} stroke="#3fcf6a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
          <g className="ka-sway" style={delay(x + 2, y, 3)}>
            <path d={`M${X + 76} ${Y + 72} q4 -10 -1 -22`} stroke="#2fae55" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
          <g className="ka-swim" style={delay(x, y, 5)}>
            {fish(X + 48, Y + 44, c)}
          </g>
          <g className="ka-swim" style={delay(x + 3, y, 5)}>
            {fish(X + 64, Y + 58, c2, 0.7)}
          </g>
          <g className="ka-bubble" style={delay(x, y, 3)} fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.8">
            <circle cx={X + 36} cy={Y + 50} r="2.5" />
            <circle cx={X + 38} cy={Y + 40} r="1.6" />
          </g>
          <path d={`M${X + 18} ${Y + 64} L${X + 34} ${Y + 28}`} stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
          <rect x={X + 10} y={Y + 16} width="80" height="8" rx="3" fill="#1c2838" />
          <rect x={X + 30} y={Y + 18} width="40" height="3" rx="1.5" fill="#bff6ff" className="ka-glow" />
        </g>
      );
    }
    if (r < 0.75)
      // alas karang bundar dengan anemon
      return (
        <g>
          {shadow(X, Y, 36, 10, 80, 0.35)}
          <circle cx={X + 50} cy={Y + 54} r="34" fill="url(#kp-pedestal)" stroke="#8fe8ff" strokeOpacity="0.35" strokeWidth="2" />
          <circle cx={X + 50} cy={Y + 54} r="29" fill="#e8d3a0" opacity="0.35" />
          <g stroke={pick(['#ff6f61', '#ff9f43', '#c56cf0'], x, y, 8)} strokeWidth="7" strokeLinecap="round" fill="none" className="ka-sway" style={delay(x, y, 3)}>
            <path d={`M${X + 40} ${Y + 70} V${Y + 46} M${X + 40} ${Y + 58} Q${X + 26} ${Y + 52} ${X + 26} ${Y + 36} M${X + 40} ${Y + 50} Q${X + 52} ${Y + 44} ${X + 52} ${Y + 28}`} />
          </g>
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <path key={k} d={`M${X + 66} ${Y + 64} q${-10 + k * 3.5} -9 ${-14 + k * 4.5} -16`} stroke="#ff8fd0" strokeWidth="3" strokeLinecap="round" fill="none" className="ka-sway" style={delay(x + k, y, 3)} />
          ))}
          <circle cx={X + 66} cy={Y + 64} r="5" fill="#ff5ab8" />
          <g className="ka-swim" style={delay(x, y, 5)}>
            <ellipse cx={X + 64} cy={Y + 40} rx="7" ry="4" fill="#ff8a1f" />
            <path d={`M${X + 62} ${Y + 36} v8 M${X + 66} ${Y + 36} v8`} stroke="#fff" strokeWidth="1.6" />
            <path d={`M${X + 70} ${Y + 40} l5 -4 v8 z`} fill="#ff8a1f" />
          </g>
        </g>
      );
    // bola kaca berisi ubur-ubur
    return (
      <g>
        {shadow(X, Y, 28, 7, 86, 0.35)}
        <path d={`M${X + 32} ${Y + 86} l4 -12 h28 l4 12 z`} fill="#2b3a4e" />
        <rect x={X + 34} y={Y + 72} width="32" height="6" rx="3" fill="#3f5670" />
        <circle cx={X + 50} cy={Y + 44} r="31" fill="url(#kp-sphere)" />
        <g className="ka-bob" style={delay(x, y, 3)}>
          <path d={`M${X + 36} ${Y + 44} Q${X + 37} ${Y + 24} ${X + 50} ${Y + 24} Q${X + 63} ${Y + 24} ${X + 64} ${Y + 44} Q${X + 50} ${Y + 40} ${X + 36} ${Y + 44} Z`} fill="url(#kp-jellyglow)" className="ka-glow" />
          {[40, 46, 54, 60].map((dx) => (
            <path key={dx} d={`M${X + dx} ${Y + 43} q-3 6 0 12 t0 10`} stroke="#ffc2ea" strokeWidth="2" fill="none" strokeLinecap="round" />
          ))}
        </g>
        <circle cx={X + 50} cy={Y + 44} r="31" fill="none" stroke="#dffaff" strokeOpacity="0.6" strokeWidth="2" />
        <path d={`M${X + 30} ${Y + 36} Q${X + 34} ${Y + 20} ${X + 48} ${Y + 16}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
    );
  },
  liquid: (X, Y, x, y) => (
    // kolam sentuh berisi bintang laut
    <g>
      {shadow(X, Y, 42, 9, 88, 0.3)}
      <rect x={X + 4} y={Y + 4} width="92" height="92" rx="22" fill="#3f5670" />
      <rect x={X + 4} y={Y + 4} width="92" height="92" rx="22" fill="url(#ka-bevel)" />
      <rect x={X + 11} y={Y + 11} width="78" height="78" rx="16" fill="url(#kp-touch)" />
      <path d={starPath(X + 36, Y + 60, 13, 5)} fill="#ff8a4c" stroke="#d9602a" strokeWidth="1.5" strokeLinejoin="round" transform={`rotate(${f(h(x, y, 7) * 72)} ${X + 36} ${Y + 60})`} />
      <circle cx={X + 66} cy={Y + 36} r="7" fill="#7a4ac9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d={`M${X + 66} ${Y + 27} v-4`} stroke="#9b6ce0" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} ${X + 66} ${Y + 36})`} />
      ))}
      <path d={`M${X + 20} ${Y + 30} q8 -6 16 0 t16 0 M${X + 50} ${Y + 76} q8 -6 16 0`} fill="none" stroke="#e6fdff" strokeWidth="3" strokeLinecap="round" className="ka-shimmer" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.12)
      return (
        <g className="ka-bubble" style={delay(x, y, 3)} fill="none" stroke="#bff6ff" strokeWidth="1.8" opacity="0.85">
          <circle cx={px} cy={py} r="4" />
          <circle cx={px + 6} cy={py - 10} r="2.5" />
          <circle cx={px - 2} cy={py - 18} r="1.8" />
        </g>
      );
    if (r < 0.22)
      return (
        <g className="ka-twinkle" style={delay(x, y, 2)}>
          {sparkle(px, py, 6, '#bff6ff')}
        </g>
      );
    if (r < 0.28)
      return (
        <g className="ka-swim" style={delay(x, y, 5)} opacity="0.85">
          {fish(px, py, pick(FISH, x, y, 5), 0.8)}
        </g>
      );
    if (r < 0.34)
      // kerang
      return (
        <g>
          <path d={`M${px - 8} ${py + 4} Q${px} ${py - 14} ${px + 8} ${py + 4} Z`} fill="#ffd6c2" stroke="#e39c83" strokeWidth="1.2" />
          <path d={`M${px} ${py + 4} v-12 M${px - 4} ${py + 4} l-1 -9 M${px + 4} ${py + 4} l1 -9`} stroke="#e39c83" strokeWidth="1" />
        </g>
      );
    return null;
  },
};

/* ---------- 8. Studio Lukis ---------- */

const PAINT = ['#ff4f6d', '#3fa9f5', '#ffc93c', '#5ccf7a', '#a87bff', '#ff8a3d'] as const;

const lukis: ThemeArt = {
  name: 'Studio Lukis',
  bg: '#fbf4e8',
  ink: '#4a3a6a',
  frame: '#fffdf8',
  tile: ['#ecd4ab', '#e3c89b'],
  tex: 'kp-tex-paintwood',
  outLiquid: 0.14,
  defs: (
    <>
      <pattern id="kp-tex-paintwood" width="100" height="50" patternUnits="userSpaceOnUse">
        <path d="M0 0.5 h100 M0 25.5 h100 M60 0 v25 M20 25 v25" stroke="#a87a44" strokeOpacity="0.4" strokeWidth="1.4" fill="none" />
        <path d="M4 12 q24 -3 48 0 M66 14 q14 -2 30 0 M26 38 q30 -3 60 0" stroke="#b88a52" strokeOpacity="0.3" strokeWidth="1" fill="none" />
        <circle cx="38" cy="8" r="2.2" fill="#3fa9f5" opacity="0.45" />
        <circle cx="41" cy="11" r="0.9" fill="#3fa9f5" opacity="0.45" />
        <circle cx="78" cy="36" r="2.6" fill="#ff4f6d" opacity="0.4" />
        <circle cx="74" cy="40" r="1" fill="#ff4f6d" opacity="0.4" />
        <circle cx="10" cy="44" r="1.8" fill="#ffc93c" opacity="0.55" />
      </pattern>
      <linearGradient id="kp-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fd3ff" />
        <stop offset="1" stopColor="#e8f7ff" />
      </linearGradient>
      <radialGradient id="kp-can" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#f3f5f8" />
        <stop offset="0.6" stopColor="#b8c2cc" />
        <stop offset="1" stopColor="#7a8691" />
      </radialGradient>
      <radialGradient id="kp-stool" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#e0b077" />
        <stop offset="1" stopColor="#9a6430" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.4) {
      // kuda-kuda lukis dengan kanvas
      const sunny = h(x, y, 8) < 0.5;
      return (
        <g>
          {shadow(X, Y, 30, 7, 87)}
          <path d={`M${X + 50} ${Y + 10} V${Y + 84}`} stroke="#8a5a2c" strokeWidth="4" strokeLinecap="round" />
          <path d={`M${X + 50} ${Y + 10} L${X + 24} ${Y + 86} M${X + 50} ${Y + 10} L${X + 76} ${Y + 86}`} stroke="#b8804a" strokeWidth="5" strokeLinecap="round" />
          <rect x={X + 20} y={Y + 16} width="60" height="46" rx="2" fill="#fffdf6" stroke="#d8cbb4" strokeWidth="1.5" />
          {sunny ? (
            <g>
              <rect x={X + 24} y={Y + 20} width="52" height="38" fill="url(#kp-sky)" />
              <circle cx={X + 64} cy={Y + 30} r="6" fill="#ffd23f" />
              <path d={`M${X + 24} ${Y + 58} V${Y + 46} Q${X + 36} ${Y + 34} ${X + 50} ${Y + 46} Q${X + 62} ${Y + 38} ${X + 76} ${Y + 48} V${Y + 58} Z`} fill="#5ccf7a" />
              <path d={`M${X + 30} ${Y + 30} q3 -3 6 0 q3 -3 6 0`} stroke="#fff" strokeWidth="2" fill="none" />
            </g>
          ) : (
            <g>
              <rect x={X + 24} y={Y + 20} width="52" height="38" fill="#fff6e8" />
              <circle cx={X + 38} cy={Y + 34} r="10" fill="#ff4f6d" opacity="0.85" />
              <rect x={X + 48} y={Y + 26} width="20" height="20" fill="#3fa9f5" opacity="0.85" transform={`rotate(12 ${X + 58} ${Y + 36})`} />
              <path d={`M${X + 30} ${Y + 54} L${X + 42} ${Y + 42} L${X + 54} ${Y + 54} Z`} fill="#ffc93c" />
              <path d={`M${X + 56} ${Y + 52} q8 -8 16 0`} stroke="#5ccf7a" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}
          <rect x={X + 16} y={Y + 62} width="68" height="6" rx="2" fill="#a06a36" />
          <rect x={X + 16} y={Y + 62} width="68" height="6" rx="2" fill="url(#ka-bevel)" />
          <rect x={X + 60} y={Y + 58} width="14" height="4" rx="2" fill="#ff8a3d" />
        </g>
      );
    }
    if (r < 0.72)
      // tiga kaleng cat terbuka dilihat dari atas
      return (
        <g>
          {shadow(X, Y, 38, 12, 70, 0.2)}
          {[
            [34, 36, 16],
            [66, 34, 14],
            [52, 66, 17],
          ].map(([cx, cy, rr], i) => {
            const c = pick(PAINT, x + i, y, 8);
            return (
              <g key={i}>
                <circle cx={X + cx} cy={Y + cy + 3} r={rr} fill="#000" opacity="0.18" />
                <circle cx={X + cx} cy={Y + cy} r={rr} fill="url(#kp-can)" />
                <circle cx={X + cx} cy={Y + cy} r={rr - 3} fill={c} />
                <circle cx={X + cx} cy={Y + cy} r={rr - 3} fill="url(#ka-bevel)" />
                <ellipse cx={X + cx - 4} cy={Y + cy - 4} rx="4" ry="2.4" fill="#fff" opacity="0.45" />
                <path d={`M${X + cx + rr - 2} ${Y + cy - 3} q4 2 2 8 q-2 3 -3 -1 z`} fill={c} />
              </g>
            );
          })}
          <g transform={`rotate(-35 ${X + 52} ${Y + 66})`}>
            <rect x={X + 49} y={Y + 32} width="6" height="30" rx="3" fill="#c8844c" />
            <rect x={X + 48} y={Y + 58} width="8" height="6" fill="#c9d2da" />
          </g>
        </g>
      );
    // bangku bundar dengan palet cat
    return (
      <g>
        {shadow(X, Y, 36, 11, 72, 0.22)}
        <circle cx={X + 50} cy={Y + 52} r="34" fill="url(#kp-stool)" />
        <circle cx={X + 50} cy={Y + 52} r="34" fill="none" stroke="#7a4a20" strokeOpacity="0.4" strokeWidth="2" />
        <circle cx={X + 50} cy={Y + 52} r="24" fill="none" stroke="#7a4a20" strokeOpacity="0.2" strokeWidth="1.5" />
        <path d={`M${X + 24} ${Y + 50} Q${X + 22} ${Y + 26} ${X + 50} ${Y + 26} Q${X + 78} ${Y + 26} ${X + 78} ${Y + 50} Q${X + 78} ${Y + 72} ${X + 56} ${Y + 72} Q${X + 48} ${Y + 72} ${X + 50} ${Y + 64} Q${X + 52} ${Y + 58} ${X + 44} ${Y + 60} Q${X + 26} ${Y + 66} ${X + 24} ${Y + 50} Z`} fill="#f6dfb4" stroke="#c49a5e" strokeWidth="1.5" />
        <circle cx={X + 40} cy={Y + 52} r="4.5" fill="url(#kp-stool)" />
        {[
          [34, 38],
          [48, 33],
          [62, 35],
          [71, 47],
          [66, 61],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={X + cx} cy={Y + cy} r="5" fill={PAINT[i]} />
            <circle cx={X + cx - 1.5} cy={Y + cy - 1.5} r="1.4" fill="#fff" opacity="0.6" />
          </g>
        ))}
        <g transform={`rotate(30 ${X + 50} ${Y + 50})`}>
          <rect x={X + 20} y={Y + 76} width="40" height="4" rx="2" fill="#2b2f3c" />
          <path d={`M${X + 60} ${Y + 75} h5 l6 3 l-6 3 h-5 z`} fill="#3fa9f5" />
        </g>
      </g>
    );
  },
  liquid: (X, Y) => (
    // tumpahan cat warna-warni
    <g>
      <path d={`M${X + 14} ${Y + 42} Q${X + 12} ${Y + 14} ${X + 40} ${Y + 16} Q${X + 58} ${Y + 18} ${X + 60} ${Y + 36} Q${X + 62} ${Y + 58} ${X + 38} ${Y + 64} Q${X + 16} ${Y + 66} ${X + 14} ${Y + 42} Z`} fill="#3fa9f5" />
      <path d={`M${X + 44} ${Y + 58} Q${X + 44} ${Y + 36} ${X + 66} ${Y + 38} Q${X + 88} ${Y + 40} ${X + 86} ${Y + 62} Q${X + 86} ${Y + 86} ${X + 62} ${Y + 86} Q${X + 44} ${Y + 84} ${X + 44} ${Y + 58} Z`} fill="#ff5f8f" />
      <path d={`M${X + 20} ${Y + 76} Q${X + 18} ${Y + 62} ${X + 34} ${Y + 62} Q${X + 48} ${Y + 64} ${X + 46} ${Y + 78} Q${X + 44} ${Y + 90} ${X + 32} ${Y + 88} Q${X + 20} ${Y + 88} ${X + 20} ${Y + 76} Z`} fill="#ffc93c" />
      <path d={`M${X + 44} ${Y + 58} Q${X + 50} ${Y + 50} ${X + 56} ${Y + 42}`} stroke="#a87bff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
      <circle cx={X + 82} cy={Y + 22} r="5" fill="#5ccf7a" />
      <circle cx={X + 76} cy={Y + 30} r="2.5" fill="#5ccf7a" />
      <circle cx={X + 12} cy={Y + 88} r="3" fill="#ff5f8f" />
      <path d={`M${X + 24} ${Y + 30} q6 -8 16 -8 M${X + 56} ${Y + 50} q6 -4 12 -4 M${X + 26} ${Y + 70} q3 -3 8 -3`} stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.65" className="ka-shimmer" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    const c = pick(PAINT, x, y, 5);
    if (r < 0.24)
      // cipratan cat
      return (
        <g fill={c}>
          <circle cx={px} cy={py} r="5" />
          {[0, 1, 2, 3].map((k) => {
            const a = h(x, y, 20 + k) * Math.PI * 2,
              d = 8 + h(x, y, 30 + k) * 6;
            return <circle key={k} cx={f(px + Math.cos(a) * d)} cy={f(py + Math.sin(a) * d)} r={f(1.2 + h(x, y, 40 + k) * 1.8)} />;
          })}
        </g>
      );
    if (r < 0.32)
      // krayon
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 360)} ${px} ${py})`}>
          <rect x={px - 10} y={py - 3} width="16" height="6" rx="1.5" fill={c} />
          <rect x={px - 6} y={py - 3} width="6" height="6" fill="#fff" opacity="0.35" />
          <path d={`M${px + 6} ${py - 3} l6 3 l-6 3 z`} fill={c} />
        </g>
      );
    if (r < 0.38)
      // kuas
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 360)} ${px} ${py})`}>
          <rect x={px - 12} y={py - 1.8} width="16" height="3.6" rx="1.8" fill="#c8844c" />
          <rect x={px + 4} y={py - 2.4} width="4" height="4.8" fill="#c9d2da" />
          <path d={`M${px + 8} ${py - 2.4} q6 2.4 0 4.8 z`} fill={c} />
        </g>
      );
    return null;
  },
};

/* ---------- 9. Pesta Ulang Tahun ---------- */

const PARTY = ['#ff5f8f', '#3fa9f5', '#ffc93c', '#5ccf7a', '#a87bff'] as const;

/** balon bergradasi dengan simpul */
const balloon = (cx: number, cy: number, c: string, key?: number) => (
  <g key={key}>
    <ellipse cx={cx} cy={cy} rx="12" ry="15" fill={c} />
    <ellipse cx={cx} cy={cy} rx="12" ry="15" fill="url(#ka-bevel)" />
    <ellipse cx={cx - 4} cy={cy - 6} rx="3.2" ry="5" fill="#fff" opacity="0.55" transform={`rotate(20 ${cx - 4} ${cy - 6})`} />
    <path d={`M${cx - 2.5} ${cy + 17} l2.5 -3 l2.5 3 z`} fill={c} />
  </g>
);

const pesta: ThemeArt = {
  name: 'Pesta Ulang Tahun',
  bg: '#fff0f6',
  ink: '#8a2352',
  frame: '#fffafd',
  tile: ['#ffe3ef', '#e2f0ff'],
  tex: 'kp-tex-balloon',
  outLiquid: 0.12,
  defs: (
    <>
      <pattern id="kp-tex-balloon" width="56" height="56" patternUnits="userSpaceOnUse">
        <ellipse cx="14" cy="14" rx="5" ry="6.2" fill="#ff8fc0" opacity="0.32" />
        <path d="M14 20 q-2 4 1 8" stroke="#ff8fc0" strokeOpacity="0.32" strokeWidth="1" fill="none" />
        <ellipse cx="42" cy="40" rx="5" ry="6.2" fill="#7cc6ff" opacity="0.32" />
        <path d="M42 46 q2 4 -1 8" stroke="#7cc6ff" strokeOpacity="0.32" strokeWidth="1" fill="none" />
        <circle cx="40" cy="12" r="1.6" fill="#ffc93c" opacity="0.5" />
        <circle cx="12" cy="44" r="1.4" fill="#a87bff" opacity="0.4" />
        <circle cx="28" cy="28" r="1" fill="#fff" opacity="0.7" />
      </pattern>
      <radialGradient id="kp-punch" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#ffb3c6" />
        <stop offset="0.6" stopColor="#ff4f7a" />
        <stop offset="1" stopColor="#c21d4a" />
      </radialGradient>
      <radialGradient id="kp-crystal" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#dff1fb" />
        <stop offset="1" stopColor="#a8cfe6" />
      </radialGradient>
      <radialGradient id="kp-flame" cx="0.5" cy="0.6" r="0.6">
        <stop offset="0" stopColor="#fffbe0" />
        <stop offset="0.5" stopColor="#ffd23f" />
        <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.4) {
      // kotak kado berpita
      const k = Math.floor(h(x, y, 8) * PARTY.length);
      const c = PARTY[k],
        rb = PARTY[(k + 2) % PARTY.length];
      return (
        <g>
          {shadow(X, Y, 34, 8, 86)}
          <rect x={X + 22} y={Y + 44} width="56" height="40" rx="4" fill={c} />
          {[
            [30, 54],
            [66, 58],
            [32, 74],
            [68, 76],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={X + dx} cy={Y + dy} r="3.5" fill="#fff" opacity="0.45" />
          ))}
          <rect x={X + 22} y={Y + 44} width="56" height="40" rx="4" fill="url(#ka-bevel)" />
          <rect x={X + 18} y={Y + 34} width="64" height="13" rx="4" fill={c} />
          <rect x={X + 18} y={Y + 34} width="64" height="13" rx="4" fill="#fff" opacity="0.2" />
          <rect x={X + 46} y={Y + 34} width="8" height="50" fill={rb} />
          <rect x={X + 18} y={Y + 44} width="64" height="3" fill="#000" opacity="0.1" />
          <path d={`M${X + 50} ${Y + 34} C${X + 34} ${Y + 14} ${X + 24} ${Y + 30} ${X + 50} ${Y + 34} Z M${X + 50} ${Y + 34} C${X + 66} ${Y + 14} ${X + 76} ${Y + 30} ${X + 50} ${Y + 34} Z`} fill={rb} stroke="#00000022" strokeWidth="1" />
          <path d={`M${X + 48} ${Y + 36} l-8 12 M${X + 52} ${Y + 36} l8 12`} stroke={rb} strokeWidth="4" strokeLinecap="round" />
          <circle cx={X + 50} cy={Y + 34} r="4.5" fill={rb} stroke="#00000022" strokeWidth="1" />
        </g>
      );
    }
    if (r < 0.7) {
      // meja bundar dengan kue & lilin
      const cake = pick(['#ff9ec5', '#fff1b8', '#a7e8cf', '#c9a6ff'], x, y, 9);
      return (
        <g>
          {shadow(X, Y, 42, 12, 70, 0.2)}
          <circle cx={X + 50} cy={Y + 52} r="40" fill="#fff" />
          <circle cx={X + 50} cy={Y + 52} r="40" fill="none" stroke="#ff8fc0" strokeWidth="5" strokeDasharray="6 4" />
          <circle cx={X + 50} cy={Y + 52} r="40" fill="url(#ka-bevel)" />
          {[
            [20, 40],
            [80, 64],
          ].map(([dx, dy]) => (
            <g key={dx}>
              <circle cx={X + dx} cy={Y + dy} r="7" fill="#e8f4ff" stroke="#9cc9e6" strokeWidth="1.2" />
              <path d={`M${X + dx - 3} ${Y + dy} l3 -3 l3 3 z`} fill="#ffc93c" />
            </g>
          ))}
          <circle cx={X + 50} cy={Y + 52} r="23" fill={cake} stroke="#00000018" strokeWidth="1.5" />
          <circle cx={X + 50} cy={Y + 52} r="19" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="1 5" strokeLinecap="round" />
          <circle cx={X + 50} cy={Y + 52} r="23" fill="url(#ka-bevel)" />
          {[0, 72, 144, 216, 288].map((a) => {
            const cx = f(X + 50 + Math.cos(((a - 90) * Math.PI) / 180) * 11),
              cy = f(Y + 52 + Math.sin(((a - 90) * Math.PI) / 180) * 11);
            return (
              <g key={a}>
                <circle cx={cx} cy={cy} r="2.6" fill={PARTY[a / 72]} stroke="#fff" strokeWidth="1" />
                <circle cx={cx} cy={cy} r="6" fill="url(#kp-flame)" className="ka-glow" style={{ animationDelay: `${-a / 200}s` }} />
              </g>
            );
          })}
        </g>
      );
    }
    // seikat balon diikat pemberat
    const k = Math.floor(h(x, y, 8) * PARTY.length);
    return (
      <g>
        {shadow(X, Y, 18, 5, 88)}
        <rect x={X + 43} y={Y + 80} width="14" height="8" rx="3" fill="#a87bff" />
        <g className="ka-bob" style={delay(x, y, 2.6)}>
          <path d={`M${X + 50} ${Y + 80} Q${X + 40} ${Y + 62} ${X + 32} ${Y + 44} M${X + 50} ${Y + 80} Q${X + 60} ${Y + 58} ${X + 66} ${Y + 38} M${X + 50} ${Y + 80} Q${X + 48} ${Y + 66} ${X + 50} ${Y + 56}`} stroke="#8a90a2" strokeWidth="1.3" fill="none" />
          {balloon(X + 32, Y + 28, PARTY[k])}
          {balloon(X + 66, Y + 22, PARTY[(k + 1) % 5])}
          {balloon(X + 50, Y + 40, PARTY[(k + 3) % 5])}
        </g>
      </g>
    );
  },
  liquid: (X, Y, x, y) => (
    // mangkuk punch dengan es & jeruk
    <g>
      {shadow(X, Y, 40, 9, 88, 0.18)}
      <circle cx={X + 50} cy={Y + 50} r="43" fill="url(#kp-crystal)" />
      <circle cx={X + 50} cy={Y + 50} r="43" fill="none" stroke="#9cc9e6" strokeWidth="3" strokeDasharray="6 5" />
      <circle cx={X + 50} cy={Y + 50} r="35" fill="url(#kp-punch)" />
      {[
        [34, 38, 20],
        [62, 62, -15],
        [58, 34, 40],
      ].map(([cx, cy, a]) => (
        <rect key={cx} x={X + cx - 5} y={Y + cy - 5} width="10" height="10" rx="2" fill="#fff" opacity="0.6" transform={`rotate(${a} ${X + cx} ${Y + cy})`} />
      ))}
      <g className="ka-bob" style={delay(x, y, 3)}>
        <circle cx={X + 38} cy={Y + 64} r="8" fill="#ffb627" />
        <circle cx={X + 38} cy={Y + 64} r="6" fill="#ffe08a" />
        <path d={`M${X + 32} ${Y + 64} h12 M${X + 38} ${Y + 58} v12 M${X + 34} ${Y + 60} l8 8 M${X + 42} ${Y + 60} l-8 8`} stroke="#ffb627" strokeWidth="1" />
      </g>
      <path d={`M${X + 26} ${Y + 40} q8 -6 16 0 t16 0`} fill="none" stroke="#ffe0ea" strokeWidth="3" strokeLinecap="round" className="ka-shimmer" />
      <path d={`M${X + 60} ${Y + 50} L${X + 88} ${Y + 20}`} stroke="#c9d2da" strokeWidth="4" strokeLinecap="round" />
      <circle cx={X + 58} cy={Y + 52} r="7" fill="#dfe5ea" stroke="#9aa6b2" strokeWidth="1.2" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.26)
      // konfeti
      return (
        <g>
          {[0, 1, 2, 3, 4].map((k) => {
            const sx = f(px + (h(x, y, 20 + k) - 0.5) * 36),
              sy = f(py + (h(x, y, 30 + k) - 0.5) * 30),
              c = PARTY[(k + Math.floor(r * 30)) % PARTY.length];
            return k % 2 ? <circle key={k} cx={sx} cy={sy} r="2.4" fill={c} /> : <rect key={k} x={f(sx - 3)} y={f(sy - 1.8)} width="6" height="3.6" rx="0.8" fill={c} transform={`rotate(${f(h(x, y, 40 + k) * 180)} ${sx} ${sy})`} />;
          })}
        </g>
      );
    if (r < 0.34)
      // pita keriting
      return <path d={`M${px - 14} ${py} q4 -8 8 0 t8 0 t8 0 t8 0`} stroke={pick(PARTY, x, y, 5)} strokeWidth="2.6" fill="none" strokeLinecap="round" transform={`rotate(${f(h(x, y, 7) * 180)} ${px} ${py})`} />;
    if (r < 0.4) {
      // topi pesta
      const c = pick(PARTY, x, y, 5);
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 60 - 30)} ${px} ${py})`}>
          <path d={`M${px - 9} ${py + 9} L${px} ${py - 11} L${px + 9} ${py + 9} Z`} fill={c} />
          <path d={`M${px - 5} ${py} l9 3 M${px - 7} ${py + 5} l13 3`} stroke="#fff" strokeWidth="2" opacity="0.7" />
          <circle cx={px} cy={py - 12} r="3" fill="#ffe14a" />
        </g>
      );
    }
    return null;
  },
};

/* ---------- 10. Karnaval Malam ---------- */

const karnaval: ThemeArt = {
  name: 'Karnaval Malam',
  bg: '#120c2c',
  ink: '#ffe7a3',
  frame: '#20184a',
  dark: true,
  tile: ['#3b3163', '#352b5b'],
  tex: 'kp-tex-fair',
  outLiquid: 0.14,
  defs: (
    <>
      <pattern id="kp-tex-fair" width="64" height="64" patternUnits="userSpaceOnUse">
        <circle cx="14" cy="16" r="6" fill="#ff5fb8" opacity="0.12" />
        <circle cx="14" cy="16" r="2" fill="#ff9ad6" opacity="0.35" />
        <circle cx="46" cy="42" r="7" fill="#ffd23f" opacity="0.1" />
        <circle cx="46" cy="42" r="2.2" fill="#ffe89a" opacity="0.35" />
        <circle cx="50" cy="10" r="5" fill="#4cf0ff" opacity="0.1" />
        <circle cx="20" cy="50" r="1" fill="#fff" opacity="0.25" />
        <circle cx="34" cy="26" r="0.9" fill="#fff" opacity="0.2" />
      </pattern>
      <linearGradient id="kp-pole" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b8860b" />
        <stop offset="0.45" stopColor="#ffe89a" />
        <stop offset="1" stopColor="#a87400" />
      </linearGradient>
      <radialGradient id="kp-horse" cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d9cfe6" />
      </radialGradient>
      <radialGradient id="kp-warm" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#fff6c2" />
        <stop offset="0.7" stopColor="#ffc93c" />
        <stop offset="1" stopColor="#ff8a1f" />
      </radialGradient>
      <radialGradient id="kp-fount" cx="0.5" cy="0.5" r="0.55">
        <stop offset="0" stopColor="#e6fdff" />
        <stop offset="0.45" stopColor="#4cf0ff" />
        <stop offset="0.8" stopColor="#b35cff" />
        <stop offset="1" stopColor="#5a2a9e" />
      </radialGradient>
      <linearGradient id="kp-cartglass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff6d6" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffd98a" stopOpacity="0.7" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.38) {
      // kuda korsel pada tiang emas
      const mane = pick(['#ff5fb8', '#4cf0ff', '#ffd23f', '#a87bff'], x, y, 8);
      return (
        <g>
          {shadow(X, Y, 26, 7, 88, 0.4)}
          <ellipse cx={X + 50} cy={Y + 86} rx="20" ry="4" fill="#5a4a8a" stroke="#ffd23f" strokeWidth="1.5" />
          <rect x={X + 48} y={Y + 4} width="4" height="82" rx="2" fill="url(#kp-pole)" />
          <g className="ka-bob" style={delay(x, y, 2.6)}>
            <path d={`M${X + 34} ${Y + 58} l-6 14 M${X + 40} ${Y + 60} l2 14 M${X + 62} ${Y + 58} l8 12 M${X + 66} ${Y + 56} l-2 14`} stroke="#e8e0f2" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx={X + 50} cy={Y + 52} rx="22" ry="11" fill="url(#kp-horse)" />
            <path d={`M${X + 64} ${Y + 48} L${X + 70} ${Y + 30} Q${X + 72} ${Y + 24} ${X + 80} ${Y + 26} L${X + 84} ${Y + 32} Q${X + 80} ${Y + 36} ${X + 74} ${Y + 36} L${X + 70} ${Y + 50} Z`} fill="url(#kp-horse)" />
            <path d={`M${X + 68} ${Y + 30} q-6 6 -4 16 M${X + 72} ${Y + 26} q-8 4 -8 12`} stroke={mane} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d={`M${X + 28} ${Y + 50} q-8 2 -8 14`} stroke={mane} strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx={X + 77} cy={Y + 29} r="1.4" fill="#2b2230" />
            <path d={`M${X + 42} ${Y + 42} h16 l-2 12 h-12 z`} fill="#e0304c" />
            <path d={`M${X + 42} ${Y + 42} h16`} stroke="#ffd23f" strokeWidth="2" />
            <rect x={X + 48} y={Y + 38} width="4" height="18" fill="url(#kp-pole)" />
          </g>
          <circle cx={X + 50} cy={Y + 5} r="4" fill="#ffd23f" className="ka-twinkle" />
        </g>
      );
    }
    if (r < 0.7)
      // gerobak berondong jagung
      return (
        <g>
          {shadow(X, Y, 36, 8, 88, 0.4)}
          <path d={`M${X + 18} ${Y + 24} Q${X + 50} ${Y + 4} ${X + 82} ${Y + 24} Z`} fill="#e0304c" />
          {[30, 50, 70].map((dx) => (
            <path key={dx} d={`M${X + dx - 5} ${Y + 20 - (dx === 50 ? 6 : 0)} L${X + dx} ${Y + 24} L${X + dx + 5} ${Y + 20 - (dx === 50 ? 6 : 0)}`} fill="#fff" opacity="0.9" />
          ))}
          <path d={`M${X + 18} ${Y + 24} h64`} stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
          <rect x={X + 24} y={Y + 26} width="52" height="26" rx="3" fill="url(#kp-cartglass)" stroke="#ffd23f" strokeWidth="2" />
          {[
            [32, 44],
            [40, 40],
            [48, 45],
            [56, 39],
            [64, 44],
            [70, 40],
            [36, 36],
            [60, 34],
            [46, 34],
          ].map(([dx, dy], i) => (
            <g key={i} fill="#fffbe8" stroke="#e8c867" strokeWidth="0.8">
              <circle cx={X + dx} cy={Y + dy} r="3.2" />
              <circle cx={X + dx + 2.5} cy={Y + dy - 2} r="2.4" />
            </g>
          ))}
          <rect x={X + 26} y={Y + 46} width="48" height="5" fill="#ffd98a" opacity="0.6" />
          <rect x={X + 20} y={Y + 52} width="60" height="26" rx="4" fill="#e0304c" />
          {[26, 38, 50, 62].map((dx) => (
            <rect key={dx} x={X + dx} y={Y + 52} width="6" height="26" fill="#fff" opacity="0.85" />
          ))}
          <rect x={X + 20} y={Y + 52} width="60" height="26" rx="4" fill="url(#ka-bevel)" />
          {[30, 70].map((dx) => (
            <g key={dx}>
              <circle cx={X + dx} cy={Y + 82} r="7" fill="#2b2230" stroke="#ffd23f" strokeWidth="2" />
              <circle cx={X + dx} cy={Y + 82} r="2" fill="#ffd23f" />
            </g>
          ))}
        </g>
      );
    // loket karcis berlampu
    return (
      <g>
        {shadow(X, Y, 34, 8, 88, 0.4)}
        <rect x={X + 22} y={Y + 32} width="56" height="54" rx="3" fill="#2f6fd6" />
        <rect x={X + 22} y={Y + 32} width="56" height="54" rx="3" fill="url(#ka-bevel)" />
        <rect x={X + 30} y={Y + 44} width="40" height="22" rx="4" fill="url(#kp-warm)" className="ka-glow" />
        <path d={`M${X + 50} ${Y + 44} v22`} stroke="#2f6fd6" strokeWidth="2" />
        <rect x={X + 26} y={Y + 66} width="48" height="5" rx="2" fill="#ffd23f" />
        <rect x={X + 36} y={Y + 74} width="28" height="9" rx="2" fill="#1f4fa6" />
        <text x={X + 50} y={Y + 81} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7" fontWeight="900" fill="#ffe7a3">
          TIKET
        </text>
        <path d={`M${X + 16} ${Y + 34} L${X + 50} ${Y + 10} L${X + 84} ${Y + 34} Z`} fill="#e0304c" />
        <path d={`M${X + 50} ${Y + 10} L${X + 36} ${Y + 34} h10 z M${X + 50} ${Y + 10} L${X + 56} ${Y + 34} h10 z`} fill="#fff" opacity="0.9" />
        <path d={`M${X + 16} ${Y + 34} h68`} stroke="#ffd23f" strokeWidth="2.5" strokeLinecap="round" />
        {[18, 29, 40, 51, 62, 73, 84].map((dx, i) => (
          <circle key={dx} cx={X + dx - 1} cy={Y + 37} r="2.6" fill="#fff6c2" className="ka-twinkle" style={{ animationDelay: `${(i % 2) * -0.9}s` }} />
        ))}
        <path d={starPath(X + 50, Y + 8, 5, 2.2)} fill="#ffd23f" />
      </g>
    );
  },
  liquid: (X, Y) => (
    // air mancur bercahaya pelangi
    <g>
      {shadow(X, Y, 42, 10, 88, 0.4)}
      <circle cx={X + 50} cy={Y + 50} r="44" fill="#4a3a7a" stroke="#ffd23f" strokeOpacity="0.6" strokeWidth="2" />
      {[...Array(12)].map((_, k) => {
        const a = (k / 12) * Math.PI * 2;
        return <circle key={k} cx={f(X + 50 + Math.cos(a) * 40)} cy={f(Y + 50 + Math.sin(a) * 40)} r="2.4" fill={k % 2 ? '#ff9ad6' : '#fff6c2'} className="ka-twinkle" style={{ animationDelay: `${(k % 3) * -0.6}s` }} />;
      })}
      <circle cx={X + 50} cy={Y + 50} r="35" fill="url(#kp-fount)" className="ka-glow" />
      <g className="ka-fountain">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle key={a} cx={f(X + 50 + Math.cos((a * Math.PI) / 180) * 20)} cy={f(Y + 50 + Math.sin((a * Math.PI) / 180) * 20)} r="3" fill="#ffffff" />
        ))}
      </g>
      <circle cx={X + 50} cy={Y + 50} r="9" fill="#d9cfe6" stroke="#ffd23f" strokeWidth="1.5" />
      <circle cx={X + 50} cy={Y + 50} r="4" fill="#e6fdff" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const { px, py } = spot(X, Y, x, y);
    if (r < 0.2)
      // kilau lampu
      return (
        <g className="ka-twinkle" style={delay(x, y, 2)}>
          {sparkle(px, py, 7, pick(['#fff6c2', '#ff9ad6', '#8ff0ff'], x, y, 5))}
          <circle cx={px + 10} cy={py + 8} r="1.6" fill="#fff6c2" />
        </g>
      );
    if (r < 0.28)
      // berondong jagung tercecer
      return (
        <g fill="#fffbe8" stroke="#e8c867" strokeWidth="0.8">
          <circle cx={px} cy={py} r="3.2" />
          <circle cx={px + 2.5} cy={py - 2} r="2.3" />
          <circle cx={px + 10} cy={py + 5} r="2.8" />
          <circle cx={px - 8} cy={py + 6} r="2.5" />
        </g>
      );
    if (r < 0.34)
      // sobekan karcis
      return (
        <g transform={`rotate(${f(h(x, y, 7) * 60 - 30)} ${px} ${py})`}>
          <path d={`M${px - 10} ${py - 6} h20 v4 a2 2 0 0 0 0 4 v4 h-20 v-4 a2 2 0 0 0 0 -4 z`} fill="#ffd23f" />
          <path d={`M${px - 4} ${py - 6} v12`} stroke="#e0304c" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      );
    if (r < 0.4)
      // gelang lampu
      return <circle cx={px} cy={py} r="7" fill="none" stroke={pick(['#4cf0ff', '#ff5fb8', '#7bffb0'], x, y, 5)} strokeWidth="2.5" className="ka-glow" style={delay(x, y, 2)} />;
    return null;
  },
};

export const POLA_THEMES: ThemeArt[] = [bunga, permen, kue, buah, mainan, musik, akuarium, lukis, pesta, karnaval];

/* ---------- Agam pekerja pabrik & toko ---------- */

/**
 * Agam tampak atas versi Pola (depan = atas). Tetap dengan sorot lampu kuning & panah putih di depan (Agam
 * menyorot tiap benda), tapi berkostum: celemek belang merah muda-putih, topi koki kertas di kepala, papan catatan
 * di tangan kiri dan pemindai kuning di tangan kanan.
 */
export function AgamWorkerTop({ bump }: { bump: boolean }) {
  return (
    <g className={bump ? 'robi-bump' : undefined}>
      {/* sorot lampu ke depan */}
      <path d="M-17 -32 L-42 -120 L42 -120 L17 -32 Z" fill="url(#ka-beam)" />
      {/* panah arah maju */}
      <g className="agam-chev">
        <path d="M-15 -60 L0 -77 L15 -60" fill="none" stroke="#1b2a4e" strokeOpacity="0.55" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-15 -60 L0 -77 L15 -60" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="0" cy="8" rx="40" ry="36" fill="#000" opacity="0.2" />
      {/* roda rantai */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s < 0 ? -45 : 31} y="-26" width="14" height="58" rx="7" fill="#2e3446" />
          {[-18, -8, 2, 12, 22].map((y) => (
            <rect key={y} x={s < 0 ? -43 : 33} y={y} width="10" height="3" rx="1.5" fill="#566079" />
          ))}
        </g>
      ))}
      {/* badan */}
      <path d="M-30 30 Q-32 36 -25 37 L25 37 Q32 36 30 30 L27 -20 Q25 -35 12 -37 L-12 -37 Q-25 -35 -27 -20 Z" fill="url(#ka-agam)" stroke="#0f7a66" strokeWidth="4" strokeLinejoin="round" />
      {/* celemek belang di bagian depan badan */}
      <path d="M-24 -16 L-22 -30 Q-18 -34 -10 -34 L10 -34 Q18 -34 22 -30 L24 -16 Z" fill="#fff" />
      {[-18, -10, -2, 6, 14].map((sx) => (
        <rect key={sx} x={sx} y="-33.5" width="4" height="17.5" fill="#ff7aa8" />
      ))}
      <path d="M-24 -16 L-22 -30 Q-18 -34 -10 -34 L10 -34 Q18 -34 22 -30 L24 -16 Z" fill="none" stroke="#e0507f" strokeWidth="2" strokeLinejoin="round" />
      {/* tali celemek diikat pita di belakang */}
      <path d="M-27 12 Q-28 24 -8 30 M27 12 Q28 24 8 30" stroke="#ff7aa8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M0 30 l-9 -5 v10 z M0 30 l9 -5 v10 z" fill="#ff7aa8" stroke="#e0507f" strokeWidth="1" strokeLinejoin="round" />
      {/* bemper & lampu depan */}
      <path d="M-17 -36 Q0 -41 17 -36" stroke="#ffd23f" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="-17" cy="-30" r="4.5" fill="#fff8c4" stroke="#e0a100" strokeWidth="1.5" />
      <circle cx="17" cy="-30" r="4.5" fill="#fff8c4" stroke="#e0a100" strokeWidth="1.5" />
      {/* kepala: wajah di sisi depan */}
      <circle cx="0" cy="3" r="21" fill="#f2fbf9" stroke="#0f7a66" strokeWidth="3" />
      <rect x="-16" y="-15" width="32" height="15" rx="7.5" fill="#1b2a4e" />
      <circle cx="-7" cy="-7.5" r="4.6" fill="#7df9ff" className="robi-eye" />
      <circle cx="7" cy="-7.5" r="4.6" fill="#7df9ff" className="robi-eye" />
      <circle cx="-8.3" cy="-9" r="1.5" fill="#fff" />
      <circle cx="5.7" cy="-9" r="1.5" fill="#fff" />
      {/* topi koki kertas (dilihat dari atas: kembung, berlipit, pita merah muda) */}
      <circle cx="0" cy="15" r="12.5" fill="#e4ecef" />
      <circle cx="0" cy="14.5" r="11" fill="#ffffff" />
      <path d="M-7 10 Q0 6 7 10 M-9 15.5 Q0 12 9 15.5 M-7 21 Q0 18 7 21" stroke="#c9d6dc" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M-11 8.5 A12.5 12.5 0 0 1 11 8.5" stroke="#ff7aa8" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <circle cx="-3.5" cy="11" r="2.6" fill="#fff" opacity="0.9" />
      {/* lampu status di belakang */}
      <circle cx="0" cy="33" r="3.5" fill="#ff6b5b" className="robi-led" />
      {/* papan catatan di tangan kiri */}
      <g transform="rotate(-12 -34 -36)">
        <rect x="-44" y="-50" width="20" height="26" rx="3" fill="#b8804a" stroke="#7a4a20" strokeWidth="1.5" />
        <rect x="-41" y="-45" width="14" height="18" rx="1" fill="#fffdf6" />
        <path d="M-39 -41 h10 M-39 -37 h8 M-39 -33 h10 M-39 -29 h6" stroke="#8a96a2" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M-40 -41 l1 1 l2 -2" stroke="#2bb673" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <rect x="-38" y="-52" width="8" height="5" rx="1.5" fill="#c9d2da" stroke="#7a8691" strokeWidth="1" />
      </g>
      {/* pemindai kuning di tangan kanan, kaca merah menghadap depan */}
      <g transform="rotate(10 34 -36)">
        <rect x="28" y="-50" width="13" height="22" rx="4" fill="#ffc93c" stroke="#c98a0a" strokeWidth="1.5" />
        <rect x="29.5" y="-52" width="10" height="5" rx="2" fill="#ff5a5a" className="ka-glow" />
        <rect x="31" y="-42" width="7" height="6" rx="1.5" fill="#1b2a4e" />
        <circle cx="34.5" cy="-32" r="1.8" fill="#2bb673" />
      </g>
    </g>
  );
}

/** Agam tampak depan versi Pola: celemek belang merah muda, topi kertas, memegang papan catatan & melambai. */
export function AgamWorkerFront({ size = 84, wave = true }: { size?: number; wave?: boolean }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} aria-hidden className={wave ? 'robi-wave' : undefined}>
      {/* kepala */}
      <rect x="18" y="22" width="84" height="64" rx="30" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <rect x="30" y="36" width="60" height="32" rx="16" fill="#1b2a4e" />
      <circle cx="47" cy="52" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="73" cy="52" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="45" cy="49.5" r="2" fill="#fff" />
      <circle cx="71" cy="49.5" r="2" fill="#fff" />
      <path d="M50 76 Q60 82 70 76" fill="none" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="30" cy="72" rx="5" ry="3" fill="#ff9ec0" opacity="0.7" />
      <ellipse cx="90" cy="72" rx="5" ry="3" fill="#ff9ec0" opacity="0.7" />
      {/* topi kertas belang (topi penjaga toko) dengan lampu status sebagai pompon */}
      <path d="M26 28 Q30 8 60 6 Q90 8 94 28 Z" fill="#fff" stroke="#e0507f" strokeWidth="2.5" strokeLinejoin="round" />
      {[
        [38, 16],
        [50, 9],
        [62, 8],
        [74, 12],
      ].map(([sx, sy]) => (
        <path key={sx} d={`M${sx} ${sy} L${sx - 2} 28`} stroke="#ff7aa8" strokeWidth="5" />
      ))}
      <rect x="22" y="24" width="76" height="8" rx="4" fill="#ff7aa8" stroke="#e0507f" strokeWidth="2" />
      <circle cx="60" cy="7" r="6" fill="#ff6b5b" className="robi-led" />
      {/* badan & celemek */}
      <rect x="36" y="88" width="48" height="30" rx="12" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <path d="M44 86 h32 v4 q6 2 6 10 v14 q0 6 -6 6 h-32 q-6 0 -6 -6 v-14 q0 -8 6 -10 z" fill="#fff" stroke="#e0507f" strokeWidth="2" />
      {[48, 56, 64, 72].map((sx) => (
        <rect key={sx} x={sx - 2} y="88" width="4" height="31" fill="#ff7aa8" />
      ))}
      <rect x="49" y="104" width="22" height="10" rx="3" fill="#fff" stroke="#e0507f" strokeWidth="1.5" />
      <path d="M53 104 v-6" stroke="#ffc93c" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 86 L40 82 M76 86 L80 82" stroke="#ff7aa8" strokeWidth="3" strokeLinecap="round" />
      {/* lengan kiri melambai */}
      <rect x="8" y="90" width="24" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" transform="rotate(-35 20 96)" />
      {/* lengan kanan memegang papan catatan */}
      <rect x="84" y="92" width="16" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" />
      <g transform="rotate(6 100 100)">
        <rect x="90" y="84" width="22" height="30" rx="3" fill="#b8804a" stroke="#7a4a20" strokeWidth="1.5" />
        <rect x="93" y="89" width="16" height="22" rx="1" fill="#fffdf6" />
        <path d="M96 94 h10 M96 99 h8 M96 104 h10" stroke="#8a96a2" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M95 94 l1 1 l2 -2" stroke="#2bb673" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <rect x="96" y="82" width="10" height="5" rx="1.5" fill="#c9d2da" stroke="#7a8691" strokeWidth="1" />
      </g>
      {/* kaki */}
      <rect x="38" y="118" width="16" height="10" rx="4" fill="#3b4256" />
      <rect x="66" y="118" width="16" height="10" rx="4" fill="#3b4256" />
    </svg>
  );
}
