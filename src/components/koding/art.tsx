'use client';

// Gambar 10 tema Coding Agam (satu tema per Level). Tiap tema punya: ubin bertekstur, rintangan padat "#",
// rintangan cair "~", hiasan kecil di kotak kosong (beberapa bergerak: kupu-kupu, kepiting, ikan, gelembung,
// bara), dan warna halaman. Semua digambar dengan gradasi + bayangan supaya terasa nyata, dalam satuan kotak
// 100×100 (X, Y = pojok kiri atas kotak).

import type { ReactNode } from 'react';
import type { Theme } from '@/lib/koding/engine';

/** angka semu-acak tetap per kotak (dekorasi tidak berubah tiap render) */
export const h = (x: number, y: number, k = 0) => (((x * 73856093) ^ (y * 19349663) ^ (k * 83492791)) >>> 0) % 1000 / 1000;

type Draw = (X: number, Y: number, x: number, y: number) => ReactNode;

export interface ThemeArt {
  name: string;
  /** warna halaman, tinta judul, bingkai papan */
  bg: string;
  ink: string;
  frame: string;
  dark?: boolean;
  tile: [string, string];
  /** id pola tekstur ubin (didefinisikan di defs) */
  tex: string;
  defs: ReactNode;
  solid: Draw;
  liquid: Draw;
  decor: Draw;
  /** peluang kotak di luar peta digambar sebagai "~" */
  outLiquid: number;
}

const shadow = (X: number, Y: number, rx = 34, ry = 10, cy = 76, op = 0.22) => <ellipse cx={X + 50} cy={Y + cy} rx={rx} ry={ry} fill="#000" opacity={op} />;

/* ---------- bahan bersama ---------- */

export const COMMON_DEFS = (
  <>
    <linearGradient id="ka-bevel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
      <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.14" />
    </linearGradient>
    <radialGradient id="ka-rock" cx="0.38" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#d5d9dd" />
      <stop offset="0.55" stopColor="#9aa1a8" />
      <stop offset="1" stopColor="#636a72" />
    </radialGradient>
    <radialGradient id="ka-water" cx="0.35" cy="0.3" r="0.9">
      <stop offset="0" stopColor="#8fdcff" />
      <stop offset="0.6" stopColor="#3fa9e3" />
      <stop offset="1" stopColor="#1f7fc0" />
    </radialGradient>
    <radialGradient id="ka-agam" cx="0.35" cy="0.3" r="0.85">
      <stop offset="0" stopColor="#7ff0d6" />
      <stop offset="0.55" stopColor="#2ec4a6" />
      <stop offset="1" stopColor="#15907a" />
    </radialGradient>
    <linearGradient id="ka-beam" gradientUnits="userSpaceOnUse" x1="0" y1="-32" x2="0" y2="-120">
      <stop offset="0" stopColor="#fff3a0" stopOpacity="0.75" />
      <stop offset="1" stopColor="#fff3a0" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="ka-leaf" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#8fd65f" />
      <stop offset="0.6" stopColor="#4c9e32" />
      <stop offset="1" stopColor="#2c6a1d" />
    </radialGradient>
  </>
);

const Rock: Draw = (X, Y, x, y) => (
  <g>
    {shadow(X, Y, 36, 11, 72)}
    <path
      d={`M${X + 14} ${Y + 66} Q${X + 12} ${Y + 40} ${X + 32} ${Y + 26} Q${X + 52} ${Y + 14} ${X + 70} ${Y + 26} Q${X + 88} ${Y + 40} ${X + 86} ${Y + 66} Q${X + 50} ${Y + 76} ${X + 14} ${Y + 66} Z`}
      fill="url(#ka-rock)"
    />
    <path d={`M${X + 30} ${Y + 38} Q${X + 44} ${Y + 26} ${X + 60} ${Y + 30}`} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />
    <path d={`M${X + 52} ${Y + 48} l8 10 l-4 8`} fill="none" stroke="#5a6068" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
    {h(x, y, 9) < 0.5 && <ellipse cx={X + 36} cy={Y + 58} rx="7" ry="4" fill="#6e9b3a" opacity="0.7" />}
  </g>
);

const Water = (X: number, Y: number, extra?: ReactNode) => (
  <g>
    <rect x={X + 3} y={Y + 3} width="94" height="94" rx="16" fill="url(#ka-water)" />
    <path d={`M${X + 16} ${Y + 38} q10 -7 20 0 t20 0 t20 0 M${X + 26} ${Y + 64} q10 -7 20 0 t20 0`} fill="none" stroke="#e6f7ff" strokeWidth="4" strokeLinecap="round" className="ka-shimmer" />
    {extra}
  </g>
);

/* ---------- 1. Kebun ---------- */

const kebun: ThemeArt = {
  name: 'Kebun',
  bg: '#e8f5d6',
  ink: '#2f5a14',
  frame: '#fffaf0',
  tile: ['#9bd66a', '#8ccc5a'],
  tex: 'ka-tex-grass',
  outLiquid: 0.15,
  defs: (
    <pattern id="ka-tex-grass" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M4 30 l2 -9 l2 9 M18 14 l2 -8 l2 8 M27 31 l1.5 -7 l1.5 7" stroke="#4f9a2c" strokeOpacity="0.45" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="24" r="1.4" fill="#fff" opacity="0.25" />
    </pattern>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.55 ? (
      <g>
        {shadow(X, Y, 38, 11, 76)}
        <circle cx={X + 32} cy={Y + 56} r="22" fill="url(#ka-leaf)" />
        <circle cx={X + 68} cy={Y + 56} r="22" fill="url(#ka-leaf)" />
        <circle cx={X + 50} cy={Y + 38} r="26" fill="url(#ka-leaf)" />
        <path d={`M${X + 38} ${Y + 26} q8 -6 16 -2`} stroke="#c9f59a" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
        <circle cx={X + 40} cy={Y + 34} r="4.5" fill="#e8384f" />
        <circle cx={X + 62} cy={Y + 50} r="4.5" fill="#e8384f" />
        <circle cx={X + 30} cy={Y + 58} r="4" fill="#e8384f" />
        <circle cx={X + 39} cy={Y + 33} r="1.5" fill="#fff" />
      </g>
    ) : (
      Rock(X, Y, x, y)
    ),
  liquid: (X, Y) =>
    Water(
      X,
      Y,
      <g>
        <path d={`M${X + 62} ${Y + 58} a13 13 0 1 1 1 0 l-1 -12 z`} fill="#4fae3b" />
        <circle cx={X + 60} cy={Y + 50} r="4" fill="#ff9ecb" />
      </g>,
    ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 20 + h(x, y, 3) * 56,
      py = Y + 22 + h(x, y, 4) * 52;
    if (r < 0.06)
      return (
        <g className="ka-flutter" style={{ animationDelay: `${h(x, y, 6) * -3}s` }}>
          <g className="ka-flap">
            <ellipse cx={px - 7} cy={py} rx="8" ry="6" fill="#ffb13b" />
            <ellipse cx={px + 7} cy={py} rx="8" ry="6" fill="#ffb13b" />
            <circle cx={px - 7} cy={py} r="2.5" fill="#6b3a00" />
            <circle cx={px + 7} cy={py} r="2.5" fill="#6b3a00" />
          </g>
          <rect x={px - 1.5} y={py - 7} width="3" height="14" rx="1.5" fill="#3b2a1a" />
        </g>
      );
    if (r < 0.26) {
      const petal = ['#fff', '#ffd9ec', '#fff3a6'][Math.floor(h(x, y, 5) * 3)];
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={px} cy={py - 5} rx="3.2" ry="5" fill={petal} transform={`rotate(${a} ${px} ${py})`} />
          ))}
          <circle cx={px} cy={py} r="3" fill="#ffc21a" />
        </g>
      );
    }
    return null;
  },
};

/* ---------- 2. Pantai ---------- */

const pantai: ThemeArt = {
  name: 'Pantai',
  bg: '#fcf1d8',
  ink: '#7a5412',
  frame: '#fffaf0',
  tile: ['#f4dea4', '#eed392'],
  tex: 'ka-tex-sand',
  outLiquid: 1,
  defs: (
    <>
      <pattern id="ka-tex-sand" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="6" r="1.2" fill="#b98a3e" opacity="0.35" />
        <circle cx="17" cy="11" r="1" fill="#fff" opacity="0.45" />
        <circle cx="10" cy="20" r="1.3" fill="#b98a3e" opacity="0.3" />
        <circle cx="22" cy="22" r="0.9" fill="#8a6428" opacity="0.3" />
      </pattern>
      <linearGradient id="ka-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4cc3e6" />
        <stop offset="1" stopColor="#1e88c7" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.3 ? (
      // istana pasir
      <g>
        {shadow(X, Y, 34, 9, 80)}
        <rect x={X + 20} y={Y + 44} width="60" height="34" rx="4" fill="#e2bf6f" />
        <rect x={X + 36} y={Y + 26} width="28" height="26" rx="3" fill="#e9c97e" />
        <path d={`M${X + 20} ${Y + 44} h8 v-6 h8 v6 h8 v-6 h8 v6 h8 v-6 h8 v6 h4`} fill="#e9c97e" />
        <rect x={X + 45} y={Y + 58} width="10" height="20" rx="5" fill="#b8903f" />
        <path d={`M${X + 50} ${Y + 26} v-14 l12 5 l-12 5`} fill="#ff5a5a" stroke="#8a6428" strokeWidth="1.5" />
      </g>
    ) : (
      <g>
        {Rock(X, Y, x, y)}
        <circle cx={X + 40} cy={Y + 50} r="3" fill="#f4efe4" />
        <circle cx={X + 47} cy={Y + 54} r="2.5" fill="#f4efe4" />
        <circle cx={X + 64} cy={Y + 44} r="2.5" fill="#f4efe4" />
      </g>
    ),
  liquid: (X, Y) => (
    <g>
      <rect x={X + 1} y={Y + 1} width="98" height="98" rx="14" fill="url(#ka-sea)" />
      <path d={`M${X + 8} ${Y + 30} q12 -8 24 0 t24 0 t24 0 t20 0`} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" className="ka-wave" />
      <path d={`M${X + 14} ${Y + 62} q12 -8 24 0 t24 0 t24 0`} fill="none" stroke="#bdeeff" strokeWidth="4" strokeLinecap="round" className="ka-shimmer" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 22 + h(x, y, 3) * 54,
      py = Y + 24 + h(x, y, 4) * 50;
    if (r < 0.07)
      return (
        <g className="ka-crab" style={{ animationDelay: `${h(x, y, 6) * -4}s` }}>
          <ellipse cx={px} cy={py} rx="11" ry="8" fill="#e8472e" />
          <circle cx={px - 12} cy={py - 7} r="4.5" fill="#e8472e" />
          <circle cx={px + 12} cy={py - 7} r="4.5" fill="#e8472e" />
          <circle cx={px - 4} cy={py - 7} r="2.4" fill="#fff" />
          <circle cx={px + 4} cy={py - 7} r="2.4" fill="#fff" />
          <circle cx={px - 4} cy={py - 7} r="1.2" fill="#000" />
          <circle cx={px + 4} cy={py - 7} r="1.2" fill="#000" />
        </g>
      );
    if (r < 0.16)
      return (
        <path
          d={[...Array(10)].map((_, k) => {
            const a = -Math.PI / 2 + (k * Math.PI) / 5,
              rr = k % 2 ? 4 : 10;
            return `${k ? 'L' : 'M'}${(px + Math.cos(a) * rr).toFixed(1)} ${(py + Math.sin(a) * rr).toFixed(1)}`;
          }).join(' ') + 'Z'}
          fill="#ff8a4c"
          stroke="#e0602a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      );
    if (r < 0.28) return <path d={`M${px - 8} ${py + 5} q8 -18 16 0 z M${px - 4} ${py + 4} l4 -12 l4 12`} fill="#fbd3c2" stroke="#e39c83" strokeWidth="1.5" />;
    return null;
  },
};

/* ---------- 3. Hutan ---------- */

const hutan: ThemeArt = {
  name: 'Hutan',
  bg: '#dfeed3',
  ink: '#244a18',
  frame: '#f6f1e2',
  tile: ['#86b25a', '#7aa54f'],
  tex: 'ka-tex-forest',
  outLiquid: 0.12,
  defs: (
    <>
      <pattern id="ka-tex-forest" width="40" height="40" patternUnits="userSpaceOnUse">
        <ellipse cx="8" cy="10" rx="4" ry="2" fill="#6b4a22" opacity="0.35" transform="rotate(30 8 10)" />
        <ellipse cx="28" cy="26" rx="4" ry="2" fill="#c98a2e" opacity="0.35" transform="rotate(-20 28 26)" />
        <ellipse cx="16" cy="32" rx="3" ry="1.6" fill="#3f6b22" opacity="0.4" />
        <circle cx="33" cy="8" r="1.4" fill="#e8f5c8" opacity="0.3" />
      </pattern>
      <radialGradient id="ka-canopy" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#6fbf45" />
        <stop offset="0.6" stopColor="#2f7a26" />
        <stop offset="1" stopColor="#1b4d17" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.28 ? (
      // tunggul pohon
      <g>
        {shadow(X, Y, 30, 9, 74)}
        <ellipse cx={X + 50} cy={Y + 62} rx="28" ry="12" fill="#6b4524" />
        <rect x={X + 22} y={Y + 44} width="56" height="18" fill="#7a5130" />
        <ellipse cx={X + 50} cy={Y + 44} rx="28" ry="12" fill="#d9ad73" />
        <ellipse cx={X + 50} cy={Y + 44} rx="19" ry="8" fill="none" stroke="#b9854a" strokeWidth="2" />
        <ellipse cx={X + 50} cy={Y + 44} rx="9" ry="4" fill="none" stroke="#b9854a" strokeWidth="2" />
      </g>
    ) : (
      // pohon besar dilihat dari atas
      <g>
        {shadow(X, Y, 42, 14, 70, 0.28)}
        <circle cx={X + 34} cy={Y + 56} r="24" fill="url(#ka-canopy)" />
        <circle cx={X + 66} cy={Y + 54} r="24" fill="url(#ka-canopy)" />
        <circle cx={X + 50} cy={Y + 34} r="28" fill="url(#ka-canopy)" />
        <circle cx={X + 42} cy={Y + 28} r="9" fill="#8fd65f" opacity="0.5" />
        <circle cx={X + 64} cy={Y + 48} r="6" fill="#8fd65f" opacity="0.4" />
      </g>
    ),
  liquid: (X, Y, x, y) =>
    Water(
      X,
      Y,
      <g>
        <ellipse cx={X + 26 + h(x, y, 7) * 40} cy={Y + 52} rx="8" ry="5" fill="#9aa1a8" />
        <ellipse cx={X + 70} cy={Y + 78} rx="6" ry="4" fill="#9aa1a8" />
      </g>,
    ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 22 + h(x, y, 3) * 54,
      py = Y + 26 + h(x, y, 4) * 48;
    if (r < 0.16)
      return (
        <g>
          <rect x={px - 3} y={py} width="6" height="10" rx="2" fill="#f3e6cf" />
          <path d={`M${px - 11} ${py + 1} Q${px} ${py - 16} ${px + 11} ${py + 1} Z`} fill="#e23b2e" />
          <circle cx={px - 4} cy={py - 5} r="2" fill="#fff" />
          <circle cx={px + 4} cy={py - 2} r="1.6" fill="#fff" />
        </g>
      );
    if (r < 0.3) return <path d={`M${px - 9} ${py} q9 -10 18 0 q-9 10 -18 0 z M${px - 9} ${py} l18 0`} fill="#d99a3a" stroke="#9c6a1f" strokeWidth="1.2" transform={`rotate(${h(x, y, 5) * 180} ${px} ${py})`} />;
    return null;
  },
};

/* ---------- 4. Sawah ---------- */

const sawah: ThemeArt = {
  name: 'Sawah',
  bg: '#eef3d6',
  ink: '#4d5a12',
  frame: '#fffaf0',
  tile: ['#c9a36a', '#bf985e'],
  tex: 'ka-tex-dirt',
  outLiquid: 0.85,
  defs: (
    <>
      <pattern id="ka-tex-dirt" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="7" r="1.6" fill="#7a5a30" opacity="0.4" />
        <circle cx="21" cy="15" r="1.2" fill="#f3dfb8" opacity="0.5" />
        <path d="M10 24 l5 -3 l4 2" stroke="#7a5a30" strokeOpacity="0.35" strokeWidth="1.3" fill="none" />
      </pattern>
      <linearGradient id="ka-paddy" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9ccfd4" />
        <stop offset="1" stopColor="#5e9fa6" />
      </linearGradient>
      <linearGradient id="ka-straw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="1" stopColor="#c99a2e" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.4 ? (
      // orang-orangan sawah
      <g>
        {shadow(X, Y, 20, 7, 84)}
        <rect x={X + 47} y={Y + 30} width="6" height="54" fill="#7a5130" />
        <rect x={X + 20} y={Y + 42} width="60" height="6" rx="3" fill="#7a5130" />
        <path d={`M${X + 34} ${Y + 40} h32 l-4 28 h-24 z`} fill="#3a78c2" />
        <path d={`M${X + 34} ${Y + 40} h32 v6 h-32 z`} fill="#2d5f9c" />
        <circle cx={X + 50} cy={Y + 30} r="11" fill="#f3d9a4" />
        <path d={`M${X + 30} ${Y + 26} Q${X + 50} ${Y + 6} ${X + 70} ${Y + 26} Z`} fill="#d9a441" />
        <ellipse cx={X + 50} cy={Y + 26} rx="22" ry="4" fill="#c28f2c" />
        <path d={`M${X + 20} ${Y + 44} l-5 6 M${X + 80} ${Y + 44} l5 6`} stroke="#e8c867" strokeWidth="3" strokeLinecap="round" />
      </g>
    ) : (
      // tumpukan jerami
      <g>
        {shadow(X, Y, 36, 10, 78)}
        <path d={`M${X + 14} ${Y + 76} Q${X + 16} ${Y + 22} ${X + 50} ${Y + 18} Q${X + 84} ${Y + 22} ${X + 86} ${Y + 76} Z`} fill="url(#ka-straw)" />
        {[26, 38, 50, 62, 74].map((dx) => (
          <path key={dx} d={`M${X + dx} ${Y + 74} Q${X + dx + 2} ${Y + 44} ${X + 50} ${Y + 22}`} stroke="#b98a28" strokeWidth="1.6" fill="none" opacity="0.6" />
        ))}
        <path d={`M${X + 20} ${Y + 56} Q${X + 50} ${Y + 64} ${X + 80} ${Y + 56}`} stroke="#8a5a1a" strokeWidth="3" fill="none" />
      </g>
    ),
  liquid: (X, Y) => (
    // petak sawah berair dengan barisan padi
    <g>
      <rect x={X + 1} y={Y + 1} width="98" height="98" rx="10" fill="url(#ka-paddy)" />
      <path d={`M${X + 10} ${Y + 20} l30 -8`} stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" className="ka-shimmer" />
      {[22, 50, 78].map((dy) =>
        [18, 42, 66, 90].map((dx) => (
          <g key={`${dx}-${dy}`} className="ka-sway" style={{ animationDelay: `${(dx + dy) * -0.02}s` }}>
            <path d={`M${X + dx - 6} ${Y + dy + 8} l-2 -14 M${X + dx - 6} ${Y + dy + 8} l2 -16 M${X + dx - 6} ${Y + dy + 8} l6 -12`} stroke="#3f9a2c" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          </g>
        )),
      )}
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 22 + h(x, y, 3) * 54,
      py = Y + 26 + h(x, y, 4) * 48;
    if (r < 0.07)
      return (
        <g className="ka-hop" style={{ animationDelay: `${h(x, y, 6) * -3}s` }}>
          <ellipse cx={px} cy={py} rx="9" ry="7" fill="#5fb13f" />
          <circle cx={px - 4} cy={py - 6} r="3.2" fill="#5fb13f" />
          <circle cx={px + 4} cy={py - 6} r="3.2" fill="#5fb13f" />
          <circle cx={px - 4} cy={py - 6} r="1.4" fill="#111" />
          <circle cx={px + 4} cy={py - 6} r="1.4" fill="#111" />
        </g>
      );
    if (r < 0.3) return <path d={`M${px} ${py + 6} l-4 -10 M${px} ${py + 6} l0 -12 M${px} ${py + 6} l4 -10`} stroke="#6f9a2e" strokeWidth="2" strokeLinecap="round" />;
    return null;
  },
};

/* ---------- 5. Kota ---------- */

const CAR = ['#e63946', '#2a9df4', '#f4a300', '#2bb673', '#ffffff'];
const kota: ThemeArt = {
  name: 'Kota',
  bg: '#e6e9ee',
  ink: '#2b3445',
  frame: '#f7f7f9',
  tile: ['#cdd1d7', '#c2c7ce'],
  tex: 'ka-tex-paving',
  outLiquid: 0.1,
  defs: (
    <pattern id="ka-tex-paving" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M0 25 h50 M25 0 v25 M0 25 v25 M50 25 v25 M12 25 v25" stroke="#9aa2ad" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <circle cx="8" cy="10" r="1" fill="#fff" opacity="0.5" />
    </pattern>
  ),
  solid: (X, Y, x, y) => {
    const r = h(x, y, 1);
    if (r < 0.45) {
      // mobil parkir dilihat dari atas
      const c = CAR[Math.floor(h(x, y, 8) * CAR.length)];
      const vertical = h(x, y, 9) < 0.5;
      return (
        <g transform={vertical ? undefined : `rotate(90 ${X + 50} ${Y + 50})`}>
          {shadow(X, Y, 22, 38, 52, 0.25)}
          <rect x={X + 29} y={Y + 10} width="42" height="80" rx="13" fill={c} stroke="#00000033" strokeWidth="1.5" />
          <rect x={X + 33} y={Y + 24} width="34" height="15" rx="5" fill="#1f2a3a" />
          <rect x={X + 33} y={Y + 64} width="34" height="12" rx="5" fill="#1f2a3a" />
          <rect x={X + 35} y={Y + 42} width="30" height="20" rx="4" fill={c} />
          <path d={`M${X + 36} ${Y + 26} l10 0`} stroke="#fff" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
          <rect x={X + 33} y={Y + 11} width="8" height="4" rx="2" fill="#fff6c2" />
          <rect x={X + 59} y={Y + 11} width="8" height="4" rx="2" fill="#fff6c2" />
          <rect x={X + 33} y={Y + 85} width="8" height="4" rx="2" fill="#ff5a5a" />
          <rect x={X + 59} y={Y + 85} width="8" height="4" rx="2" fill="#ff5a5a" />
        </g>
      );
    }
    if (r < 0.75)
      // kerucut lalu lintas
      return (
        <g>
          {shadow(X, Y, 24, 8, 80)}
          <rect x={X + 24} y={Y + 70} width="52" height="10" rx="3" fill="#d85a12" />
          <path d={`M${X + 34} ${Y + 72} L${X + 46} ${Y + 18} h8 L${X + 66} ${Y + 72} Z`} fill="#ff7a1a" />
          <path d={`M${X + 39} ${Y + 52} h22 l2 8 h-26 z M${X + 43} ${Y + 34} h14 l1.5 7 h-17 z`} fill="#fff" />
          <path d={`M${X + 47} ${Y + 22} l-6 46`} stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
        </g>
      );
    // pohon dalam pot bundar
    return (
      <g>
        {shadow(X, Y, 34, 10, 78)}
        <circle cx={X + 50} cy={Y + 52} r="34" fill="#9aa1a8" />
        <circle cx={X + 50} cy={Y + 52} r="28" fill="#6b4a2a" />
        <circle cx={X + 50} cy={Y + 46} r="26" fill="url(#ka-leaf)" />
        <circle cx={X + 42} cy={Y + 38} r="8" fill="#a6e07a" opacity="0.5" />
      </g>
    );
  },
  liquid: (X, Y) => (
    // air mancur
    <g>
      {shadow(X, Y, 40, 10, 82)}
      <circle cx={X + 50} cy={Y + 50} r="42" fill="#b9bec6" />
      <circle cx={X + 50} cy={Y + 50} r="35" fill="url(#ka-water)" />
      <circle cx={X + 50} cy={Y + 50} r="10" fill="#d7dbe0" />
      <g className="ka-fountain">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle key={a} cx={+(X + 50 + Math.cos((a * Math.PI) / 180) * 20).toFixed(1)} cy={+(Y + 50 + Math.sin((a * Math.PI) / 180) * 20).toFixed(1)} r="3" fill="#e6f7ff" />
        ))}
      </g>
      <circle cx={X + 50} cy={Y + 50} r="4" fill="#e6f7ff" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    if (r < 0.08)
      return (
        <g>
          <circle cx={X + 50} cy={Y + 50} r="16" fill="#6d737c" />
          <circle cx={X + 50} cy={Y + 50} r="13" fill="none" stroke="#8b919a" strokeWidth="2" />
          <path d={`M${X + 40} ${Y + 50} h20 M${X + 50} ${Y + 40} v20`} stroke="#8b919a" strokeWidth="2" />
        </g>
      );
    if (r < 0.2) {
      const px = X + 24 + h(x, y, 3) * 52,
        py = Y + 26 + h(x, y, 4) * 48;
      return <path d={`M${px - 8} ${py} q8 -9 16 0 q-8 9 -16 0 z`} fill="#e0a12e" transform={`rotate(${h(x, y, 5) * 180} ${px} ${py})`} />;
    }
    return null;
  },
};

/* ---------- 6. Salju ---------- */

const salju: ThemeArt = {
  name: 'Salju',
  bg: '#e3eef8',
  ink: '#1f4a6e',
  frame: '#bcd3e6',
  tile: ['#fbfdff', '#e6eff8'],
  tex: 'ka-tex-snow',
  outLiquid: 0.3,
  defs: (
    <>
      <pattern id="ka-tex-snow" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="8" r="1.6" fill="#c7d9ea" />
        <circle cx="20" cy="18" r="1.2" fill="#b6cde2" />
        <circle cx="14" cy="4" r="0.9" fill="#fff" />
      </pattern>
      <radialGradient id="ka-snowball" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#c6d8ea" />
      </radialGradient>
      <linearGradient id="ka-ice" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d6f0fc" />
        <stop offset="1" stopColor="#8ecbeb" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.35 ? (
      // boneka salju
      <g>
        {shadow(X, Y, 26, 8, 84)}
        <circle cx={X + 50} cy={Y + 66} r="19" fill="url(#ka-snowball)" />
        <circle cx={X + 50} cy={Y + 40} r="14" fill="url(#ka-snowball)" />
        <circle cx={X + 50} cy={Y + 20} r="10" fill="url(#ka-snowball)" />
        <rect x={X + 40} y={Y + 4} width="20" height="10" rx="2" fill="#2b2b36" />
        <rect x={X + 36} y={Y + 12} width="28" height="4" rx="2" fill="#2b2b36" />
        <circle cx={X + 46} cy={Y + 19} r="1.6" fill="#222" />
        <circle cx={X + 54} cy={Y + 19} r="1.6" fill="#222" />
        <path d={`M${X + 50} ${Y + 22} l10 3 l-10 1 z`} fill="#ff7a1a" />
        <path d={`M${X + 38} ${Y + 31} Q${X + 50} ${Y + 36} ${X + 62} ${Y + 31}`} stroke="#d83a3a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx={X + 50} cy={Y + 40} r="1.8" fill="#333" />
        <circle cx={X + 50} cy={Y + 47} r="1.8" fill="#333" />
      </g>
    ) : (
      // cemara bersalju
      <g>
        {shadow(X, Y, 30, 8, 82)}
        <rect x={X + 45} y={Y + 68} width="10" height="14" rx="2" fill="#6b4524" />
        <path d={`M${X + 50} ${Y + 6} L${X + 76} ${Y + 42} L${X + 64} ${Y + 42} L${X + 84} ${Y + 72} L${X + 16} ${Y + 72} L${X + 36} ${Y + 42} L${X + 24} ${Y + 42} Z`} fill="#1f6b4a" />
        <path d={`M${X + 50} ${Y + 6} L${X + 76} ${Y + 42} L${X + 64} ${Y + 42} L${X + 84} ${Y + 72} L${X + 50} ${Y + 72} Z`} fill="#17553a" />
        <path d={`M${X + 50} ${Y + 6} L${X + 62} ${Y + 24} Q${X + 50} ${Y + 30} ${X + 38} ${Y + 24} Z M${X + 30} ${Y + 50} Q${X + 50} ${Y + 58} ${X + 70} ${Y + 50} L${X + 66} ${Y + 44} Q${X + 50} ${Y + 50} ${X + 34} ${Y + 44} Z`} fill="#fff" />
      </g>
    ),
  liquid: (X, Y) => (
    <g>
      <rect x={X + 3} y={Y + 3} width="94" height="94" rx="16" fill="url(#ka-ice)" />
      <path d={`M${X + 30} ${Y + 18} l12 22 l-8 14 l16 26 M${X + 42} ${Y + 40} l24 -8 l10 18 M${X + 34} ${Y + 54} l-14 6`} fill="none" stroke="#5a9fc9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${X + 14} ${Y + 16} l18 0 M${X + 70} ${Y + 80} l12 0`} stroke="#fff" strokeWidth="4" strokeLinecap="round" className="ka-shimmer" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 24 + h(x, y, 3) * 50,
      py = Y + 24 + h(x, y, 4) * 50;
    if (r < 0.12)
      return (
        <g fill="#c3d6e8">
          <ellipse cx={px - 6} cy={py} rx="3.5" ry="5" />
          <ellipse cx={px + 5} cy={py - 12} rx="3.5" ry="5" />
          <ellipse cx={px - 6} cy={py - 24} rx="3.5" ry="5" />
        </g>
      );
    if (r < 0.26)
      return (
        <g className="ka-twinkle" style={{ animationDelay: `${h(x, y, 6) * -2}s` }} stroke="#9cc3e4" strokeWidth="2" strokeLinecap="round">
          <path d={`M${px - 6} ${py} h12 M${px} ${py - 6} v12 M${px - 4} ${py - 4} l8 8 M${px + 4} ${py - 4} l-8 8`} />
        </g>
      );
    return null;
  },
};

/* ---------- 7. Gurun ---------- */

const gurun: ThemeArt = {
  name: 'Gurun',
  bg: '#fbead2',
  ink: '#7a4a12',
  frame: '#fffaf0',
  tile: ['#efc88a', '#e8bd79'],
  tex: 'ka-tex-dune',
  outLiquid: 0.1,
  defs: (
    <>
      <pattern id="ka-tex-dune" width="60" height="30" patternUnits="userSpaceOnUse">
        <path d="M0 10 q15 -6 30 0 t30 0 M0 24 q15 -6 30 0 t30 0" stroke="#c98f3e" strokeOpacity="0.35" strokeWidth="1.6" fill="none" />
      </pattern>
      <linearGradient id="ka-cactus" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2f7d3c" />
        <stop offset="0.45" stopColor="#58b061" />
        <stop offset="1" stopColor="#2a6b33" />
      </linearGradient>
      <radialGradient id="ka-redrock" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#e3a06a" />
        <stop offset="1" stopColor="#9a5328" />
      </radialGradient>
    </>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.3 ? (
      <g>
        {shadow(X, Y, 36, 10, 74)}
        <path d={`M${X + 16} ${Y + 70} L${X + 24} ${Y + 32} L${X + 46} ${Y + 22} L${X + 72} ${Y + 28} L${X + 84} ${Y + 70} Z`} fill="url(#ka-redrock)" />
        <path d={`M${X + 24} ${Y + 44} h52 M${X + 20} ${Y + 58} h60`} stroke="#8a4520" strokeOpacity="0.4" strokeWidth="2" />
      </g>
    ) : (
      <g>
        {shadow(X, Y, 26, 8, 80)}
        <rect x={X + 41} y={Y + 14} width="18" height="66" rx="9" fill="url(#ka-cactus)" />
        <path d={`M${X + 41} ${Y + 52} h-10 a7 7 0 0 1 -7 -7 v-16`} fill="none" stroke="url(#ka-cactus)" strokeWidth="12" strokeLinecap="round" />
        <path d={`M${X + 59} ${Y + 42} h10 a7 7 0 0 0 7 -7 v-12`} fill="none" stroke="url(#ka-cactus)" strokeWidth="12" strokeLinecap="round" />
        {[22, 34, 46, 58, 70].map((dy) => (
          <path key={dy} d={`M${X + 41} ${Y + dy} l-4 -2 M${X + 59} ${Y + dy} l4 -2`} stroke="#f4f0d0" strokeWidth="1.4" />
        ))}
        <circle cx={X + 50} cy={Y + 13} r="5" fill="#ff6fa0" />
      </g>
    ),
  liquid: (X, Y) =>
    Water(
      X,
      Y,
      <g>
        <path d={`M${X + 8} ${Y + 8} q20 4 30 22 M${X + 8} ${Y + 8} q4 20 22 30 M${X + 8} ${Y + 8} q26 -4 36 6`} stroke="#3f9a3a" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx={X + 10} cy={Y + 10} r="5" fill="#7a5130" />
      </g>,
    ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 24 + h(x, y, 3) * 52,
      py = Y + 26 + h(x, y, 4) * 48;
    if (r < 0.2)
      return (
        <g fill="#b98a4e">
          <ellipse cx={px} cy={py} rx="5" ry="3.4" />
          <ellipse cx={px + 9} cy={py + 4} rx="3" ry="2" />
        </g>
      );
    return null;
  },
};

/* ---------- 8. Bawah Laut ---------- */

const laut: ThemeArt = {
  name: 'Bawah Laut',
  bg: '#cfe9f2',
  ink: '#0f4a63',
  frame: '#1b6f8f',
  tile: ['#a6d6d8', '#98ccce'],
  tex: 'ka-tex-caustic',
  outLiquid: 0.25,
  defs: (
    <>
      <pattern id="ka-tex-caustic" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M4 14 q10 -8 20 0 q8 8 18 -2 M10 44 q12 -10 22 -2 q10 8 22 -4" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" />
        <circle cx="46" cy="30" r="1.4" fill="#e9dcae" opacity="0.7" />
      </pattern>
      <radialGradient id="ka-jelly" cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffd6f2" stopOpacity="0.95" />
        <stop offset="1" stopColor="#d86bc2" stopOpacity="0.85" />
      </radialGradient>
      <linearGradient id="ka-deep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1f6f96" />
        <stop offset="1" stopColor="#0f3f5e" />
      </linearGradient>
    </>
  ),
  solid: (X, Y, x, y) =>
    h(x, y, 1) < 0.55 ? (
      // karang bercabang
      <g>
        {shadow(X, Y, 32, 9, 80)}
        {(() => {
          const c = ['#ff6f61', '#ff9f43', '#c56cf0'][Math.floor(h(x, y, 8) * 3)];
          return (
            <g stroke={c} strokeWidth="9" strokeLinecap="round" fill="none" className="ka-sway" style={{ animationDelay: `${h(x, y, 6) * -3}s` }}>
              <path d={`M${X + 50} ${Y + 80} V${Y + 44} M${X + 50} ${Y + 58} Q${X + 30} ${Y + 52} ${X + 28} ${Y + 30} M${X + 50} ${Y + 50} Q${X + 70} ${Y + 44} ${X + 72} ${Y + 22} M${X + 50} ${Y + 44} V${Y + 16} M${X + 30} ${Y + 42} l-8 -6 M${X + 70} ${Y + 34} l8 -4`} />
            </g>
          );
        })()}
      </g>
    ) : (
      <g>
        {Rock(X, Y, x, y)}
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <path key={k} d={`M${X + 50} ${Y + 36} q${-12 + k * 4} -10 ${-16 + k * 5} -18`} stroke="#ff8fb8" strokeWidth="3.5" strokeLinecap="round" fill="none" className="ka-sway" />
        ))}
      </g>
    ),
  liquid: (X, Y, x, y) => (
    // ubur-ubur di perairan dalam
    <g>
      <rect x={X + 3} y={Y + 3} width="94" height="94" rx="16" fill="url(#ka-deep)" />
      <g className="ka-bob" style={{ animationDelay: `${h(x, y, 6) * -3}s` }}>
        <path d={`M${X + 28} ${Y + 48} Q${X + 30} ${Y + 18} ${X + 50} ${Y + 18} Q${X + 70} ${Y + 18} ${X + 72} ${Y + 48} Q${X + 50} ${Y + 42} ${X + 28} ${Y + 48} Z`} fill="url(#ka-jelly)" />
        {[34, 44, 56, 66].map((dx) => (
          <path key={dx} d={`M${X + dx} ${Y + 46} q-4 10 0 18 t0 18`} stroke="#f3a6de" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ))}
        <ellipse cx={X + 42} cy={Y + 28} rx="6" ry="3" fill="#fff" opacity="0.6" />
      </g>
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 24 + h(x, y, 3) * 50,
      py = Y + 26 + h(x, y, 4) * 48;
    if (r < 0.1) {
      const c = ['#ffb703', '#fb8500', '#4cc9f0'][Math.floor(h(x, y, 5) * 3)];
      return (
        <g className="ka-swim" style={{ animationDelay: `${h(x, y, 6) * -5}s` }}>
          <ellipse cx={px} cy={py} rx="11" ry="6" fill={c} />
          <path d={`M${px + 9} ${py} l9 -6 v12 z`} fill={c} />
          <path d={`M${px - 2} ${py - 6} v12`} stroke="#fff" strokeWidth="2.5" />
          <circle cx={px - 6} cy={py - 1.5} r="1.6" fill="#111" />
        </g>
      );
    }
    if (r < 0.2)
      return (
        <g className="ka-bubble" style={{ animationDelay: `${h(x, y, 6) * -3}s` }} fill="none" stroke="#fff" strokeWidth="1.8" opacity="0.8">
          <circle cx={px} cy={py} r="4" />
          <circle cx={px + 6} cy={py - 10} r="2.5" />
          <circle cx={px - 2} cy={py - 18} r="1.8" />
        </g>
      );
    if (r < 0.28) return <path d={`M${px} ${py + 8} q-6 -10 0 -18 q6 -8 0 -16`} stroke="#3f9a5a" strokeWidth="4" strokeLinecap="round" fill="none" className="ka-sway" />;
    return null;
  },
};

/* ---------- 9. Gunung Berapi ---------- */

const gunung: ThemeArt = {
  name: 'Gunung Berapi',
  bg: '#2b1f1d',
  ink: '#ffd9c2',
  frame: '#3d2b27',
  dark: true,
  tile: ['#6b5a52', '#5f4f48'],
  tex: 'ka-tex-basalt',
  outLiquid: 0.45,
  defs: (
    <>
      <pattern id="ka-tex-basalt" width="44" height="44" patternUnits="userSpaceOnUse">
        <path d="M4 10 l10 6 l-2 10 M28 4 l6 12 l10 2 M20 34 l10 -4 l8 8" stroke="#2e2320" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
        <circle cx="36" cy="30" r="1.2" fill="#ff8a3d" opacity="0.5" />
      </pattern>
      <radialGradient id="ka-lava" cx="0.45" cy="0.45" r="0.7">
        <stop offset="0" stopColor="#fff2a8" />
        <stop offset="0.35" stopColor="#ffb52e" />
        <stop offset="0.75" stopColor="#ff5a14" />
        <stop offset="1" stopColor="#b3200e" />
      </radialGradient>
      <radialGradient id="ka-basalt" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#7d6d66" />
        <stop offset="1" stopColor="#2e2522" />
      </radialGradient>
    </>
  ),
  solid: (X, Y) => (
    <g>
      {shadow(X, Y, 38, 11, 74, 0.35)}
      <path d={`M${X + 14} ${Y + 68} Q${X + 10} ${Y + 38} ${X + 34} ${Y + 24} Q${X + 54} ${Y + 12} ${X + 72} ${Y + 26} Q${X + 90} ${Y + 42} ${X + 86} ${Y + 68} Q${X + 50} ${Y + 78} ${X + 14} ${Y + 68} Z`} fill="url(#ka-basalt)" />
      <path d={`M${X + 34} ${Y + 40} l10 8 l-4 12 M${X + 58} ${Y + 32} l6 14`} stroke="#ff7a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" className="ka-glow" />
      <path d={`M${X + 30} ${Y + 32} Q${X + 44} ${Y + 22} ${X + 58} ${Y + 26}`} stroke="#fff" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  ),
  liquid: (X, Y) => (
    <g>
      <rect x={X + 2} y={Y + 2} width="96" height="96" rx="16" fill="url(#ka-lava)" className="ka-glow" />
      <path d={`M${X + 16} ${Y + 30} l14 6 l8 -8 M${X + 60} ${Y + 64} l12 -6 l10 8 M${X + 30} ${Y + 72} l10 -4`} stroke="#7a1a0a" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      <circle cx={X + 66} cy={Y + 32} r="5" fill="#fff2a8" className="ka-bubble" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 24 + h(x, y, 3) * 50,
      py = Y + 26 + h(x, y, 4) * 48;
    if (r < 0.14) return <circle cx={px} cy={py} r="3" fill="#ffb52e" className="ka-glow" style={{ animationDelay: `${h(x, y, 6) * -2}s` }} />;
    if (r < 0.24)
      return (
        <g className="ka-smoke" style={{ animationDelay: `${h(x, y, 6) * -4}s` }} fill="#cfc4bf" opacity="0.5">
          <circle cx={px} cy={py} r="6" />
          <circle cx={px + 6} cy={py - 8} r="5" />
        </g>
      );
    return null;
  },
};

/* ---------- 10. Bulan ---------- */

const bulan: ThemeArt = {
  name: 'Bulan',
  bg: '#0e1030',
  ink: '#e7e4ff',
  frame: '#1c1f4a',
  dark: true,
  tile: ['#a7a7b4', '#9b9ba9'],
  tex: 'ka-tex-moon',
  outLiquid: 0.3,
  defs: (
    <>
      <pattern id="ka-tex-moon" width="48" height="48" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="14" r="5" fill="#7f7f8e" opacity="0.35" />
        <circle cx="11" cy="13" r="5" fill="none" stroke="#d4d4de" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="36" cy="34" r="3" fill="#7f7f8e" opacity="0.35" />
        <circle cx="30" cy="8" r="1" fill="#e6e6ee" opacity="0.6" />
      </pattern>
      <radialGradient id="ka-crater" cx="0.55" cy="0.6" r="0.6">
        <stop offset="0" stopColor="#1b1b26" />
        <stop offset="0.7" stopColor="#4a4a58" />
        <stop offset="1" stopColor="#8a8a98" />
      </radialGradient>
      <radialGradient id="ka-moonrock" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#dcdce4" />
        <stop offset="1" stopColor="#5d5d6b" />
      </radialGradient>
    </>
  ),
  solid: (X, Y) => (
    <g>
      {shadow(X, Y, 36, 10, 74, 0.35)}
      <path d={`M${X + 16} ${Y + 66} Q${X + 14} ${Y + 36} ${X + 36} ${Y + 24} Q${X + 58} ${Y + 14} ${X + 74} ${Y + 30} Q${X + 88} ${Y + 46} ${X + 84} ${Y + 66} Q${X + 50} ${Y + 76} ${X + 16} ${Y + 66} Z`} fill="url(#ka-moonrock)" />
      <circle cx={X + 40} cy={Y + 44} r="8" fill="#6e6e7c" />
      <circle cx={X + 64} cy={Y + 56} r="5" fill="#6e6e7c" />
      <circle cx={X + 58} cy={Y + 34} r="3.5" fill="#6e6e7c" />
    </g>
  ),
  liquid: (X, Y) => (
    // kawah dalam
    <g>
      <ellipse cx={X + 50} cy={Y + 52} rx="42" ry="38" fill="#c4c4d0" />
      <ellipse cx={X + 50} cy={Y + 54} rx="36" ry="32" fill="url(#ka-crater)" />
      <path d={`M${X + 20} ${Y + 40} Q${X + 50} ${Y + 14} ${X + 80} ${Y + 40}`} stroke="#fff" strokeOpacity="0.35" strokeWidth="3" fill="none" />
    </g>
  ),
  decor: (X, Y, x, y) => {
    const r = h(x, y, 2);
    const px = X + 24 + h(x, y, 3) * 50,
      py = Y + 26 + h(x, y, 4) * 48;
    if (r < 0.12)
      return (
        <g fill="#83838f">
          <rect x={px - 9} y={py - 4} width="7" height="11" rx="2" />
          <rect x={px + 3} y={py - 16} width="7" height="11" rx="2" />
          <path d={`M${px - 9} ${py - 1} h7 M${px - 9} ${py + 3} h7 M${px + 3} ${py - 13} h7 M${px + 3} ${py - 9} h7`} stroke="#6a6a76" strokeWidth="1" />
        </g>
      );
    if (r < 0.2) return <circle cx={px} cy={py} r="6" fill="#7f7f8e" opacity="0.5" stroke="#d4d4de" strokeOpacity="0.5" />;
    return null;
  },
};

export const ART: Record<Theme, ThemeArt> = { kebun, pantai, hutan, sawah, kota, salju, gurun, laut, gunung, bulan };
