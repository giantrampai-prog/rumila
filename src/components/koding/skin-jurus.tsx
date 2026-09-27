'use client';

// Gambar game Coding Agam · Jurus (dojo ninja, tampak samping). Isi: 10 tema panggung (satu per Level), tokoh
// Agam-ninja & Sensei Panda dengan 9 pose, Agam-ninja tampak depan untuk sapaan, dan ikon kecil tiap gerakan
// untuk blok program. Panggung 1000 × 600 satuan, lantai di y = 470; tokoh digambar menghadap KANAN dengan kaki
// di titik (0,0). Semua deterministik (tanpa Math.random), id gradien/pola berawalan kj-.

import type { ReactNode } from 'react';
import type { DojoTheme, Move, Pose } from './skin-types';

/** bulatkan koordinat hasil hitungan supaya teks SVG sama di server & klien */
const f = (v: number) => +v.toFixed(1);
/** angka semu-acak tetap (0..1) untuk sebaran bintang, salju, rumput, dsb. */
const hh = (a: number, b = 0) => ((((a * 73856093) ^ (b * 19349663)) >>> 0) % 1000) / 1000;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const FLOOR = 470;

/* ============================== bahan bersama panggung ============================== */

/** titik hilang lantai (garis papan/tikar menyempit ke arah dinding) */
const VP = { x: 500, y: 140 };
/** garis perspektif lantai: memanjang dari dinding ke depan */
function persp(step: number, stroke: string, op: number, w = 2, y0 = FLOOR) {
  const k = (y0 - VP.y) / (600 - VP.y);
  let d = '';
  for (let xb = -900; xb <= 1900; xb += step) d += `M${f(VP.x + (xb - VP.x) * k)} ${y0} L${xb} 600 `;
  return <path d={d} stroke={stroke} strokeOpacity={op} strokeWidth={w} fill="none" />;
}
/** garis melintang lantai (makin ke depan makin renggang) */
const rows = (ys: number[], stroke: string, op: number, w = 2) => <path d={ys.map((y) => `M0 ${y} H1000`).join(' ')} stroke={stroke} strokeOpacity={op} strokeWidth={w} fill="none" />;
/** cahaya lembut di lantai tempat para tokoh berdiri + bayangan tepi depan */
const floorLight = (op = 0.45, y0 = FLOOR) => (
  <g>
    <ellipse cx="500" cy="515" rx="440" ry="62" fill="url(#kj-glow)" opacity={op} />
    <rect x="0" y={y0} width="1000" height={600 - y0} fill="url(#kj-shade)" />
  </g>
);
/** bayangan dinding di dekat lantai (sudut ruangan) */
const wallFoot = (y0 = FLOOR) => <rect x="0" y={y0 - 90} width="1000" height="90" fill="url(#kj-wallfoot)" />;

const BASE_DEFS = (
  <>
    <radialGradient id="kj-glow">
      <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="kj-warm">
      <stop offset="0" stopColor="#fff2b0" stopOpacity="0.9" />
      <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="kj-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0" />
      <stop offset="0.55" stopColor="#000" stopOpacity="0.05" />
      <stop offset="1" stopColor="#000" stopOpacity="0.3" />
    </linearGradient>
    <linearGradient id="kj-wallfoot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.2" />
    </linearGradient>
    <linearGradient id="kj-ray" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  </>
);

/** kepingan salju 6 lengan */
function flake(cx: number, cy: number, r: number, stroke: string, w: number, op = 1) {
  const d = range(6)
    .map((i) => {
      const a = (i * Math.PI) / 3;
      const x = cx + Math.cos(a) * r,
        y = cy + Math.sin(a) * r;
      const mx = cx + Math.cos(a) * r * 0.6,
        my = cy + Math.sin(a) * r * 0.6;
      const b1 = a + 0.6,
        b2 = a - 0.6;
      return `M${f(cx)} ${f(cy)} L${f(x)} ${f(y)} M${f(mx)} ${f(my)} L${f(mx + Math.cos(b1) * r * 0.28)} ${f(my + Math.sin(b1) * r * 0.28)} M${f(mx)} ${f(my)} L${f(mx + Math.cos(b2) * r * 0.28)} ${f(my + Math.sin(b2) * r * 0.28)}`;
    })
    .join(' ');
  return <path d={d} stroke={stroke} strokeWidth={w} strokeLinecap="round" fill="none" opacity={op} />;
}

/** bintang 5 sudut berpusat (cx, cy) */
function starPath(cx: number, cy: number, r: number, inner = 0.45) {
  return (
    range(10)
      .map((i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? r * inner : r;
        return `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
      })
      .join(' ') + ' Z'
  );
}

/** ledakan runcing (tanda kena pukul/tendang) */
function burstPath(cx: number, cy: number, r: number, n = 9) {
  return (
    range(n * 2)
      .map((i) => {
        const a = (i * Math.PI) / n;
        const rr = i % 2 ? r * 0.5 : r * (0.85 + hh(i, n) * 0.3);
        return `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`;
      })
      .join(' ') + ' Z'
  );
}

/** gumpalan awan dari beberapa lingkaran */
function cloud(cx: number, cy: number, s: number, fill: string, op = 1) {
  return (
    <g opacity={op}>
      <ellipse cx={cx} cy={cy + 8 * s} rx={62 * s} ry={16 * s} fill={fill} />
      <circle cx={cx - 34 * s} cy={cy} r={20 * s} fill={fill} />
      <circle cx={cx - 8 * s} cy={cy - 14 * s} r={28 * s} fill={fill} />
      <circle cx={cx + 24 * s} cy={cy - 6 * s} r={23 * s} fill={fill} />
      <circle cx={cx + 46 * s} cy={cy + 4 * s} r={15 * s} fill={fill} />
    </g>
  );
}

/* ================================ 1. Dojo Kayu ================================ */

const shoji = (x0: number, x1: number) => {
  const w = x1 - x0;
  const cols = Math.round(w / 48);
  const vx = range(cols - 1).map((i) => f(x0 + ((i + 1) * w) / cols));
  return (
    <g>
      <rect x={x0} y="92" width={w} height="290" fill="url(#kj-dk-paper)" />
      <ellipse cx={(x0 + x1) / 2} cy="220" rx={w * 0.45} ry="120" fill="url(#kj-warm)" opacity="0.55" />
      <path d={vx.map((x) => `M${x} 92 V382`).join(' ') + ' ' + [150, 208, 266, 324].map((y) => `M${x0} ${y} H${x1}`).join(' ')} stroke="#8a5a2b" strokeWidth="4" />
      <rect x={x0} y="92" width={w} height="290" fill="none" stroke="#6e4520" strokeWidth="9" />
    </g>
  );
};

const paperLantern = (x: number, y: number, key: string) => (
  <g key={key}>
    <path d={`M${x} 40 V${y - 44}`} stroke="#3b2412" strokeWidth="2.5" />
    <rect x={x - 12} y={y - 48} width="24" height="8" rx="2" fill="#2b1a0c" />
    <g className="ka-glow">
      <ellipse cx={x} cy={y} rx="34" ry="42" fill="url(#kj-dk-lantern)" />
      <path d={`M${x - 32} ${y - 14} Q${x} ${y - 20} ${x + 32} ${y - 14} M${x - 34} ${y} Q${x} ${y - 5} ${x + 34} ${y} M${x - 31} ${y + 15} Q${x} ${y + 10} ${x + 31} ${y + 15}`} stroke="#b4541f" strokeWidth="2" fill="none" opacity="0.6" />
      <ellipse cx={x - 12} cy={y - 16} rx="8" ry="14" fill="#fff" opacity="0.35" />
    </g>
    <rect x={x - 12} y={y + 40} width="24" height="8" rx="2" fill="#2b1a0c" />
    <path d={`M${x - 4} ${y + 48} v14 M${x} ${y + 48} v18 M${x + 4} ${y + 48} v14`} stroke="#c0392b" strokeWidth="2" />
  </g>
);

const dojoKayu: DojoTheme = {
  name: 'Dojo Kayu',
  bg: '#f3e6cf',
  ink: '#5a3a1a',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-dk-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f7ecd5" />
        <stop offset="1" stopColor="#e6cfa4" />
      </linearGradient>
      <linearGradient id="kj-dk-post" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6a421d" />
        <stop offset="0.45" stopColor="#a8723c" />
        <stop offset="1" stopColor="#5c3818" />
      </linearGradient>
      <linearGradient id="kj-dk-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8f5d2d" />
        <stop offset="1" stopColor="#5b3616" />
      </linearGradient>
      <linearGradient id="kj-dk-paper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fffbf0" />
        <stop offset="1" stopColor="#f0e2c2" />
      </linearGradient>
      <linearGradient id="kj-dk-tatami" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d5cd8a" />
        <stop offset="1" stopColor="#b3a75a" />
      </linearGradient>
      <linearGradient id="kj-dk-panel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9a6634" />
        <stop offset="1" stopColor="#6b431e" />
      </linearGradient>
      <radialGradient id="kj-dk-lantern" cx="0.42" cy="0.38" r="0.7">
        <stop offset="0" stopColor="#fff6cf" />
        <stop offset="0.5" stopColor="#ffbf5a" />
        <stop offset="1" stopColor="#d9722a" />
      </radialGradient>
      <pattern id="kj-dk-rush" width="7" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 2.5 H7" stroke="#857a36" strokeWidth="1" opacity="0.35" />
      </pattern>
      <pattern id="kj-dk-grain" width="60" height="24" patternUnits="userSpaceOnUse">
        <path d="M0 8 Q15 5 30 8 T60 8 M0 18 Q20 15 40 18 T60 17" stroke="#3e240e" strokeWidth="1.2" fill="none" opacity="0.25" />
      </pattern>
    </>
  ),
  stage: () => (
    <g>
      {/* dinding plester & langit-langit kayu */}
      <rect width="1000" height={FLOOR} fill="url(#kj-dk-wall)" />
      <rect width="1000" height="44" fill="url(#kj-dk-beam)" />
      <path d={range(21).map((i) => `M${i * 50} 0 V44`).join(' ')} stroke="#3e240e" strokeWidth="2" opacity="0.35" />
      <rect y="44" width="1000" height="26" fill="url(#kj-dk-post)" />
      <rect y="44" width="1000" height="26" fill="url(#kj-dk-grain)" />
      <rect y="70" width="1000" height="5" fill="#000" opacity="0.15" />
      {/* jendela shoji kiri & kanan */}
      {shoji(48, 318)}
      {shoji(682, 952)}
      {/* ceruk tengah: gulungan kaligrafi & rak */}
      <rect x="350" y="84" width="300" height="300" fill="#efdcb6" />
      <rect x="350" y="84" width="300" height="300" fill="url(#kj-wallfoot)" opacity="0.6" />
      <path d="M500 84 V100" stroke="#3b2412" strokeWidth="2" />
      <circle cx="500" cy="86" r="3" fill="#3b2412" />
      <g>
        <rect x="446" y="100" width="108" height="226" rx="3" fill="#5f7d4c" />
        <rect x="456" y="112" width="88" height="200" fill="#fbf4e2" />
        <path d="M468 206 A34 34 0 1 1 505 240" stroke="#1c1c1c" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.88" />
        <path d="M478 210 A24 24 0 0 1 500 184" stroke="#1c1c1c" strokeWidth="3" fill="none" opacity="0.25" />
        <rect x="520" y="276" width="14" height="14" rx="2" fill="#c0392b" />
        <rect x="438" y="96" width="124" height="8" rx="4" fill="#3b2412" />
        <rect x="438" y="322" width="124" height="9" rx="4.5" fill="#3b2412" />
      </g>
      <rect x="350" y="370" width="300" height="16" fill="url(#kj-dk-post)" />
      {/* bonsai di rak */}
      <g>
        <path d="M392 370 l6 -18 h28 l6 18 z" fill="#3d5a80" />
        <path d="M412 352 q-4 -18 6 -30 q-10 -8 -4 -20" stroke="#5b3616" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="400" cy="318" rx="22" ry="12" fill="#4c7d33" />
        <ellipse cx="428" cy="304" rx="20" ry="11" fill="#5e9440" />
        <ellipse cx="414" cy="292" rx="16" ry="9" fill="#6fa84c" />
      </g>
      {/* gendang taiko kecil */}
      <g>
        <ellipse cx="600" cy="366" rx="30" ry="6" fill="#000" opacity="0.2" />
        <path d="M572 318 Q566 342 572 366 H628 Q634 342 628 318 Z" fill="#8a3a1c" />
        <ellipse cx="600" cy="318" rx="28" ry="9" fill="#f3e3c3" stroke="#3b2412" strokeWidth="3" />
        {[578, 592, 608, 622].map((x) => (
          <circle key={x} cx={x} cy="330" r="2" fill="#d9b25a" />
        ))}
      </g>
      {/* tiang kayu */}
      {[18, 332, 640, 954].map((x) => (
        <g key={x}>
          <rect x={x} y="70" width="30" height={FLOOR - 70} fill="url(#kj-dk-post)" />
          <rect x={x} y="70" width="30" height={FLOOR - 70} fill="url(#kj-dk-grain)" />
        </g>
      ))}
      {/* panel kayu bawah (koshi-ita) */}
      <rect y="384" width="1000" height="86" fill="url(#kj-dk-panel)" />
      <path d={range(26).map((i) => `M${i * 40 + 12} 388 V470`).join(' ')} stroke="#4a2c12" strokeWidth="2" opacity="0.45" />
      <rect y="384" width="1000" height="6" fill="#c08a4e" />
      {wallFoot()}
      {/* sinar matahari dari shoji jatuh ke lantai */}
      <path d="M60 382 L310 382 L420 600 L130 600 Z M690 382 L940 382 L900 600 L620 600 Z" fill="#fff6d6" opacity="0.14" />
      {/* lantai tatami */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-dk-tatami)" />
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-dk-rush)" />
      <rect y={FLOOR - 4} width="1000" height="8" fill="#3b2412" />
      {persp(260, '#2f3a22', 0.75, 5)}
      {rows([510, 575], '#2f3a22', 0.7, 5)}
      {floorLight(0.5)}
      {/* lampion kertas */}
      {paperLantern(190, 158, 'l1')}
      {paperLantern(810, 158, 'l2')}
    </g>
  ),
  front: () => (
    <g>
      {/* bantal duduk (zabuton) & cangkir teh di pojok depan */}
      <g>
        <ellipse cx="90" cy="590" rx="92" ry="14" fill="#000" opacity="0.2" />
        <path d="M6 566 Q90 548 176 566 Q182 580 176 592 Q90 606 6 592 Q0 580 6 566 Z" fill="#7a2f45" />
        <path d="M22 572 Q90 560 160 572" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" fill="none" />
        <circle cx="90" cy="578" r="4" fill="#e6b35a" />
      </g>
      <g>
        <ellipse cx="930" cy="592" rx="54" ry="9" fill="#000" opacity="0.2" />
        <path d="M886 560 h40 q0 30 -20 30 q-20 0 -20 -30 z" fill="#3d5a80" />
        <path d="M934 572 h26 q0 18 -13 18 q-13 0 -13 -18 z" fill="#5d7ea6" />
        <path d="M893 566 q10 4 26 0" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" fill="none" />
        <path d="M906 552 q-6 -10 2 -18 M920 552 q-6 -12 2 -20" stroke="#fff" strokeWidth="2.5" fill="none" className="ka-smoke" opacity="0.7" />
      </g>
    </g>
  ),
};

/* ================================ 2. Arena Silat ================================ */

const kendang = (x: number, y: number, s: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="36" rx="58" ry="8" fill="#000" opacity="0.22" />
    <path d="M-50 -12 Q0 -30 50 -8 L46 28 Q0 38 -46 24 Z" fill="url(#kj-sl-drum)" />
    <ellipse cx="-48" cy="6" rx="10" ry="19" fill="#f1dcb0" stroke="#5a2e0e" strokeWidth="3" />
    <ellipse cx="48" cy="10" rx="8" ry="19" fill="#e8d09c" stroke="#5a2e0e" strokeWidth="3" />
    <path d="M-40 -10 L-20 26 L0 -14 L20 30 L40 -8" stroke="#e8c27a" strokeWidth="2.5" fill="none" />
    <path d="M-30 -14 Q0 -24 34 -10" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" fill="none" />
  </g>
);

const umbul = (x: number, c1: string, c2: string, delay: number) => (
  <g className="ka-sway" style={{ animationDelay: `${delay}s` }}>
    <path d={`M${x} ${FLOOR} Q${x - 4} 250 ${x + 26} 110`} stroke="#6b4a24" strokeWidth="5" fill="none" />
    <path d={`M${x + 2} 400 Q${x - 2} 250 ${x + 26} 112 Q${x + 34} 200 ${x + 30} 300 Q${x + 26} 360 ${x + 2} 400 Z`} fill={c1} />
    <path d={`M${x + 8} 380 Q${x + 6} 250 ${x + 26} 140 Q${x + 28} 230 ${x + 24} 300 Z`} fill={c2} opacity="0.85" />
    <circle cx={x + 26} cy="106" r="5" fill="#e8b92f" />
  </g>
);

const batikBanner = (x: number, key: string) => (
  <g key={key}>
    <rect x={x - 38} y="92" width="76" height="8" rx="4" fill="#5a2e0e" />
    <path d={`M${x - 32} 100 H${x + 32} V318 L${x + 22} 332 L${x + 12} 318 L${x} 332 L${x - 12} 318 L${x - 22} 332 L${x - 32} 318 Z`} fill="url(#kj-sl-batik)" />
    <path d={`M${x - 32} 100 H${x + 32} V122 H${x - 32} Z M${x - 32} 296 H${x + 32} V318 H${x - 32} Z`} fill="#a8431b" />
    <path d={`M${x - 32} 111 H${x + 32} M${x - 32} 307 H${x + 32}`} stroke="#f3d9a4" strokeWidth="2" strokeDasharray="4 4" />
    <rect x={x - 32} y="100" width="14" height="218" fill="#000" opacity="0.12" />
  </g>
);

const arenaSilat: DojoTheme = {
  name: 'Arena Silat',
  bg: '#fbe9d0',
  ink: '#6b2d0c',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-sl-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffd08a" />
        <stop offset="1" stopColor="#fff0d2" />
      </linearGradient>
      <linearGradient id="kj-sl-wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4a250c" />
        <stop offset="0.5" stopColor="#8a4d1f" />
        <stop offset="1" stopColor="#3e1f09" />
      </linearGradient>
      <linearGradient id="kj-sl-roof" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b1d08" />
        <stop offset="1" stopColor="#6b3a15" />
      </linearGradient>
      <linearGradient id="kj-sl-drum" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b56a2c" />
        <stop offset="1" stopColor="#6d3510" />
      </linearGradient>
      <radialGradient id="kj-sl-gong" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffe9a6" />
        <stop offset="0.5" stopColor="#d9a43a" />
        <stop offset="1" stopColor="#8a5a14" />
      </radialGradient>
      <pattern id="kj-sl-batik" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="22" height="22" fill="#7a3b12" />
        <path d="M0 11 Q5.5 3 11 11 T22 11" stroke="#f3d9a4" strokeWidth="3" fill="none" />
        <circle cx="5.5" cy="17" r="1.6" fill="#f3d9a4" />
        <circle cx="16.5" cy="5" r="1.2" fill="#e8a33c" />
      </pattern>
      <pattern id="kj-sl-weave" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="#d8b46c" />
        <rect width="14" height="14" fill="#c99b52" />
        <rect x="14" y="14" width="14" height="14" fill="#c99b52" />
        <path d="M0 7 H14 M14 21 H28 M21 0 V14 M7 14 V28" stroke="#a87632" strokeWidth="1.5" opacity="0.6" />
      </pattern>
    </>
  ),
  stage: () => (
    <g>
      {/* langit sore & bukit di balik pendopo */}
      <rect width="1000" height={FLOOR} fill="url(#kj-sl-sky)" />
      <circle cx="760" cy="250" r="60" fill="#fff4c9" opacity="0.8" />
      <path d="M0 330 Q140 250 300 310 Q430 250 560 300 Q720 240 860 300 Q940 280 1000 300 V470 H0 Z" fill="#a9c77f" />
      <path d="M0 370 Q180 320 360 360 Q520 320 700 362 Q860 330 1000 356 V470 H0 Z" fill="#7fa95a" />
      {[70, 180, 820, 930].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 370 v-40`} stroke="#5a3a1a" strokeWidth="5" />
          <circle cx={x} cy={322 - (i % 2) * 8} r={26 + (i % 2) * 6} fill="#5f8f3e" />
          <circle cx={x - 10} cy={312 - (i % 2) * 8} r="12" fill="#7cae55" />
        </g>
      ))}
      {/* umbul-umbul melambai */}
      {umbul(212, '#d9362b', '#fff', 0)}
      {umbul(768, '#e8b92f', '#d9362b', -1.2)}
      {/* pagar bambu rendah */}
      <rect y="410" width="1000" height="10" fill="#b98a4a" />
      <path d={range(42).map((i) => `M${i * 24 + 6} 404 V470`).join(' ')} stroke="#caa062" strokeWidth="9" />
      <path d={range(42).map((i) => `M${i * 24 + 3} 406 V470`).join(' ')} stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      {wallFoot()}
      {/* atap joglo & balok berukir */}
      <path d="M0 0 H1000 V70 H0 Z" fill="url(#kj-sl-roof)" />
      <path d={range(34).map((i) => `M${i * 30} 10 V70`).join(' ')} stroke="#2a1405" strokeWidth="3" opacity="0.5" />
      <rect y="70" width="1000" height="24" fill="#6d3510" />
      <path d={range(26).map((i) => `M${i * 40} 94 L${i * 40 + 20} 74 L${i * 40 + 40} 94`).join(' ')} fill="#d9a43a" stroke="#8a5a14" strokeWidth="1.5" />
      <rect y="94" width="1000" height="6" fill="#3b1d08" />
      {/* tiang saka */}
      {[40, 330, 670, 960].map((x) => (
        <g key={x}>
          <rect x={x - 16} y="100" width="32" height={FLOOR - 100} fill="url(#kj-sl-wood)" />
          <rect x={x - 22} y="100" width="44" height="14" rx="3" fill="#d9a43a" />
          <rect x={x - 24} y={FLOOR - 22} width="48" height="22" rx="4" fill="#cfc2a8" />
          <rect x={x - 24} y={FLOOR - 22} width="48" height="6" rx="3" fill="#fff" opacity="0.35" />
        </g>
      ))}
      {/* kain batik bergantung */}
      {batikBanner(170, 'b1')}
      {batikBanner(500, 'b2')}
      {batikBanner(830, 'b3')}
      {/* gong di kanan */}
      <g>
        <path d="M858 300 V470 M962 300 V470" stroke="#6d3510" strokeWidth="9" />
        <rect x="848" y="292" width="124" height="14" rx="5" fill="#8a4d1f" />
        <path d="M896 306 v14 M924 306 v14" stroke="#3b1d08" strokeWidth="3" />
        <circle cx="910" cy="370" r="46" fill="url(#kj-sl-gong)" stroke="#7a4c10" strokeWidth="3" />
        <circle cx="910" cy="370" r="14" fill="#e8b94a" stroke="#7a4c10" strokeWidth="2" />
        <circle cx="905" cy="364" r="5" fill="#fff" opacity="0.6" />
      </g>
      {/* kendang di kiri */}
      {kendang(110, 430, 0.9, 'k1')}
      {/* tikar anyaman */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-sl-weave)" />
      <rect y={FLOOR - 3} width="1000" height="6" fill="#6d3510" />
      {persp(180, '#7a4c1a', 0.25, 2)}
      {/* lingkaran gelanggang */}
      <ellipse cx="500" cy="528" rx="430" ry="46" fill="none" stroke="#c0392b" strokeWidth="7" />
      <ellipse cx="500" cy="528" rx="416" ry="40" fill="none" stroke="#fff4d6" strokeWidth="3" />
      <ellipse cx="500" cy="528" rx="70" ry="10" fill="none" stroke="#c0392b" strokeWidth="4" opacity="0.8" />
      {floorLight(0.4)}
    </g>
  ),
  front: () => (
    <g>
      {kendang(940, 562, 1.1, 'kf')}
      {/* hiasan janur di pojok kiri atas */}
      <g className="ka-wave">
        <path d="M0 0 Q40 60 20 150" stroke="#e8d25a" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M18 40 q30 10 42 40 M24 80 q28 8 36 38 M22 118 q22 8 26 34" stroke="#f3e27c" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M12 60 q-10 16 -12 40" stroke="#c9b43a" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </g>
  ),
};

/* ================================ 3. Taman Bambu ================================ */

const bamboo = (x: number, top: number, w: number, c: string, key: string) => (
  <g key={key}>
    <rect x={x - w / 2} y={top} width={w} height={FLOOR - top + 4} fill={c} />
    <rect x={x - w / 2 + w * 0.18} y={top} width={w * 0.18} height={FLOOR - top} fill="#fff" opacity="0.3" />
    {range(Math.floor((FLOOR - top) / 70)).map((i) => (
      <rect key={i} x={x - w / 2 - 1.5} y={FLOOR - 50 - i * 70} width={w + 3} height="5" rx="2.5" fill="#2e5a21" opacity="0.55" />
    ))}
  </g>
);

const leafTuft = (x: number, y: number, s: number, flip: number, key: string, delay = 0) => (
  <g key={key} className="ka-sway" style={{ animationDelay: `${delay}s` }}>
    {[-40, -10, 20, 50].map((a, i) => (
      <path
        key={a}
        d="M0 0 Q18 -8 44 0 Q18 8 0 0 Z"
        fill={i % 2 ? '#5f9e3f' : '#3f7d2c'}
        transform={`translate(${x} ${y}) scale(${flip * s} ${s}) rotate(${a})`}
      />
    ))}
  </g>
);

const stoneLantern = (x: number, key: string) => (
  <g key={key}>
    <ellipse cx={x} cy={FLOOR} rx="44" ry="8" fill="#000" opacity="0.25" />
    <rect x={x - 26} y={FLOOR - 16} width="52" height="16" rx="3" fill="url(#kj-tb-stone)" />
    <rect x={x - 9} y={FLOOR - 84} width="18" height="70" fill="url(#kj-tb-stone)" />
    <rect x={x - 28} y={FLOOR - 98} width="56" height="16" rx="3" fill="url(#kj-tb-stone)" />
    <rect x={x - 22} y={FLOOR - 140} width="44" height="42" rx="3" fill="url(#kj-tb-stone)" />
    <rect x={x - 12} y={FLOOR - 132} width="24" height="26" rx="2" fill="#ffcf5a" className="ka-glow" />
    <circle cx={x} cy={FLOOR - 119} r="30" fill="url(#kj-warm)" opacity="0.6" className="ka-glow" />
    <path d={`M${x - 44} ${FLOOR - 140} Q${x} ${FLOOR - 176} ${x + 44} ${FLOOR - 140} Z`} fill="url(#kj-tb-stone)" />
    <circle cx={x} cy={FLOOR - 166} r="7" fill="#8f958f" />
    <path d={`M${x - 20} ${FLOOR - 150} q10 -8 24 -8`} stroke="#6f8f55" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
  </g>
);

const tamanBambu: DojoTheme = {
  name: 'Taman Bambu',
  bg: '#e4f2dc',
  ink: '#24502a',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-tb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dff2e0" />
        <stop offset="0.7" stopColor="#c7e3bd" />
        <stop offset="1" stopColor="#b0d49f" />
      </linearGradient>
      <linearGradient id="kj-tb-deck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c99a62" />
        <stop offset="1" stopColor="#8f6034" />
      </linearGradient>
      <linearGradient id="kj-tb-stone" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a9ada6" />
        <stop offset="0.5" stopColor="#c9ccc4" />
        <stop offset="1" stopColor="#7d827a" />
      </linearGradient>
      <linearGradient id="kj-tb-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
      </linearGradient>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-tb-sky)" />
      <circle cx="760" cy="110" r="48" fill="#fffbe8" opacity="0.9" />
      <circle cx="760" cy="110" r="90" fill="url(#kj-glow)" opacity="0.6" />
      {/* hutan bambu jauh (pucat) */}
      {range(26).map((i) => {
        const x = f(i * 40 + hh(i, 3) * 26);
        return <rect key={i} x={x} y={f(40 + hh(i, 4) * 80)} width={f(7 + hh(i, 5) * 6)} height="440" fill="#8fbf86" opacity={f(0.35 + hh(i, 6) * 0.25)} />;
      })}
      <rect y="220" width="1000" height="250" fill="url(#kj-tb-mist)" />
      {/* bambu tengah */}
      {[
        [34, -10, 26],
        [88, 20, 20],
        [150, -30, 30],
        [212, 60, 16],
        [790, 50, 18],
        [856, -20, 28],
        [918, 10, 22],
        [972, -30, 30],
      ].map(([x, t, w], i) => bamboo(x, t, w, i % 2 ? '#6aa84a' : '#57963b', `bb${i}`))}
      {leafTuft(160, 90, 1.3, 1, 'lt1', 0)}
      {leafTuft(40, 170, 1.1, 1, 'lt2', -0.8)}
      {leafTuft(210, 190, 1, 1, 'lt3', -1.6)}
      {leafTuft(850, 110, 1.3, -1, 'lt4', -0.4)}
      {leafTuft(970, 200, 1.1, -1, 'lt5', -1.2)}
      {leafTuft(790, 180, 1, -1, 'lt6', -2)}
      {/* pagar bambu rendah */}
      <path d="M0 400 H1000 M0 430 H1000" stroke="#b3a05e" strokeWidth="7" />
      <path d={range(50).map((i) => `M${i * 21 + 5} 392 V470`).join(' ')} stroke="#cdb976" strokeWidth="6" />
      <path d="M0 402 H1000" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" />
      {wallFoot()}
      {stoneLantern(120, 's1')}
      {stoneLantern(890, 's2')}
      {/* dek kayu */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-tb-deck)" />
      {persp(70, '#5e3b1b', 0.55, 2.5)}
      {rows([500, 548], '#5e3b1b', 0.2, 2)}
      <rect y={FLOOR - 2} width="1000" height="7" fill="#6b4524" />
      {floorLight(0.4)}
    </g>
  ),
  front: () => (
    <g>
      {/* ranting bambu rendah di pojok */}
      <g className="ka-sway">
        <path d="M-10 600 Q30 540 110 520" stroke="#4d8a33" strokeWidth="7" fill="none" strokeLinecap="round" />
        {[
          [40, 560, -30],
          [70, 538, -10],
          [100, 524, 15],
          [60, 552, 40],
        ].map(([x, y, a]) => (
          <path key={`${x}-${y}`} d="M0 0 Q20 -9 52 0 Q20 9 0 0 Z" fill="#5f9e3f" transform={`translate(${x} ${y}) rotate(${a})`} />
        ))}
      </g>
      {leafTuft(1000, 30, 1.2, -1, 'fl1', -0.6)}
    </g>
  ),
};

/* ================================ 4. Kuil Awan ================================ */

const redPillar = (x: number, key: string) => (
  <g key={key}>
    <rect x={x - 18} y="120" width="36" height={FLOOR - 120} fill="url(#kj-ka-pillar)" />
    <rect x={x - 24} y="118" width="48" height="14" rx="3" fill="url(#kj-ka-gold)" />
    <rect x={x - 25} y={FLOOR - 24} width="50" height="24" rx="4" fill="url(#kj-ka-gold)" />
    <path d={`M${x - 18} 210 H${x + 18} M${x - 18} 380 H${x + 18}`} stroke="#e8b94a" strokeWidth="4" />
  </g>
);

const kuilAwan: DojoTheme = {
  name: 'Kuil Awan',
  bg: '#fdeef0',
  ink: '#7a2330',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-ka-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffc6d3" />
        <stop offset="0.55" stopColor="#ffe3c2" />
        <stop offset="1" stopColor="#fff6e6" />
      </linearGradient>
      <linearGradient id="kj-ka-pillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8e1b25" />
        <stop offset="0.4" stopColor="#e0444f" />
        <stop offset="1" stopColor="#7a141d" />
      </linearGradient>
      <linearGradient id="kj-ka-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff0a8" />
        <stop offset="0.5" stopColor="#f2b82f" />
        <stop offset="1" stopColor="#b57a10" />
      </linearGradient>
      <linearGradient id="kj-ka-roof" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a2340" />
        <stop offset="1" stopColor="#5d3a5e" />
      </linearGradient>
      <linearGradient id="kj-ka-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c2413f" />
        <stop offset="1" stopColor="#7e1f24" />
      </linearGradient>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-ka-sky)" />
      <circle cx="500" cy="200" r="150" fill="url(#kj-warm)" opacity="0.7" />
      <circle cx="500" cy="200" r="54" fill="#fff4d0" opacity="0.9" />
      {/* awan jauh bergerak pelan */}
      <g className="ka-wave">
        {cloud(170, 250, 1.2, '#fff', 0.85)}
        {cloud(820, 230, 1.4, '#fff', 0.85)}
        {cloud(480, 330, 1.1, '#fff', 0.7)}
      </g>
      <g className="ka-wave" style={{ animationDelay: '-1.4s' }}>
        {cloud(80, 380, 1.5, '#fff', 0.95)}
        {cloud(330, 400, 1.3, '#ffeef2', 0.95)}
        {cloud(660, 390, 1.5, '#fff', 0.95)}
        {cloud(930, 380, 1.3, '#ffeef2', 0.95)}
      </g>
      {/* pagar merah rendah */}
      <rect y="408" width="1000" height="10" fill="#b8262f" />
      <rect y="440" width="1000" height="7" fill="#b8262f" />
      <path d={range(26).map((i) => `M${i * 40 + 20} 418 V470`).join(' ')} stroke="#d63a43" strokeWidth="7" />
      <path d={range(26).map((i) => `M${i * 40 + 20} 408 v-8`).join(' ')} stroke="#f2b82f" strokeWidth="9" strokeLinecap="round" />
      {/* tiang merah */}
      {[60, 250, 750, 940].map((x) => redPillar(x, `p${x}`))}
      {/* balok & atap berujung emas */}
      <rect y="110" width="1000" height="22" fill="#b8262f" />
      <rect y="110" width="1000" height="5" fill="url(#kj-ka-gold)" />
      <rect y="128" width="1000" height="4" fill="#7a141d" />
      <path d="M-40 0 H1040 V70 Q1020 90 1060 110 Q980 100 900 96 H100 Q20 100 -60 110 Q-20 90 -40 70 Z" fill="url(#kj-ka-roof)" />
      <path d={range(40).map((i) => `M${i * 28 - 20} 0 V92`).join(' ')} stroke="#241428" strokeWidth="6" opacity="0.5" />
      <path d="M-60 110 Q20 100 100 96 H900 Q980 100 1060 110" stroke="url(#kj-ka-gold)" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* lonceng emas */}
      {[150, 420, 580, 850].map((x, i) => (
        <g key={x} className="ka-wave" style={{ animationDelay: `${-i * 0.5}s` }}>
          <path d={`M${x} 132 V156`} stroke="#7a141d" strokeWidth="2.5" />
          <path d={`M${x - 12} 180 Q${x - 12} 156 ${x} 156 Q${x + 12} 156 ${x + 12} 180 Z`} fill="url(#kj-ka-gold)" />
          <circle cx={x} cy="183" r="4" fill="#b57a10" />
          <path d={`M${x} 188 v14`} stroke="#d63a43" strokeWidth="3" />
        </g>
      ))}
      {wallFoot()}
      {/* lantai kayu merah berpernis */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-ka-floor)" />
      {persp(90, '#5a1016', 0.45, 2)}
      <rect y={FLOOR - 3} width="1000" height="7" fill="url(#kj-ka-gold)" />
      <ellipse cx="500" cy="530" rx="120" ry="18" fill="none" stroke="#f2b82f" strokeWidth="4" opacity="0.7" />
      {floorLight(0.35)}
    </g>
  ),
  front: () => (
    <g className="ka-wave" style={{ animationDelay: '-0.7s' }}>
      {cloud(40, 590, 1.3, '#fff', 0.95)}
      {cloud(150, 610, 1.1, '#fff5f7', 0.9)}
      {cloud(880, 600, 1.2, '#fff', 0.95)}
      {cloud(990, 580, 1, '#fff5f7', 0.9)}
    </g>
  ),
};

/* ================================ 5. Panggung Tari ================================ */

const curtain = (side: 1 | -1) => {
  const x0 = side > 0 ? 0 : 1000;
  const folds = range(5).map((i) => {
    const a = i * 30,
      b = i * 18;
    const X = (v: number) => x0 + side * v;
    return <path key={i} d={`M${X(a)} 0 H${X(a + 30)} Q${X(a + 22)} 260 ${X(b + 18)} 470 H${X(b)} Q${X(a - 4)} 260 ${X(a)} 0 Z`} fill={i % 2 ? '#a3122a' : '#c81d38'} opacity="0.9" />;
  });
  return (
    <g>
      <path d={`M${x0} 0 H${x0 + side * 170} Q${x0 + side * 120} 230 ${x0 + side * 70} 300 Q${x0 + side * 110} 400 ${x0 + side * 90} 470 H${x0} Z`} fill="url(#kj-pt-curtain)" />
      {folds}
      <path d={`M${x0 + side * 40} 40 Q${x0 + side * 60} 180 ${x0 + side * 66} 300`} stroke="#ff8b9b" strokeOpacity="0.35" strokeWidth="6" fill="none" />
      <circle cx={x0 + side * 72} cy="300" r="12" fill="url(#kj-pt-gold)" />
      <path d={`M${x0 + side * 72} 312 q${side * -6} 24 0 40`} stroke="#e8b94a" strokeWidth="4" fill="none" />
    </g>
  );
};

const panggungTari: DojoTheme = {
  name: 'Panggung Tari',
  bg: '#1e1330',
  ink: '#ffe9c7',
  dark: true,
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-pt-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#170c26" />
        <stop offset="1" stopColor="#3a2257" />
      </linearGradient>
      <linearGradient id="kj-pt-curtain" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6e0a1c" />
        <stop offset="1" stopColor="#b5162f" />
      </linearGradient>
      <linearGradient id="kj-pt-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff0a8" />
        <stop offset="1" stopColor="#c48a14" />
      </linearGradient>
      <linearGradient id="kj-pt-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff6d0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff6d0" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="kj-pt-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6a3f22" />
        <stop offset="1" stopColor="#2e1a0e" />
      </linearGradient>
      <radialGradient id="kj-pt-pool">
        <stop offset="0" stopColor="#fff3c4" stopOpacity="0.75" />
        <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
      </radialGradient>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-pt-wall)" />
      {/* bintang-bintang di layar belakang */}
      {range(22).map((i) => (
        <circle key={i} cx={f(200 + hh(i, 1) * 600)} cy={f(110 + hh(i, 2) * 250)} r={f(1.5 + hh(i, 3) * 2)} fill="#ffe9a8" className={i % 3 ? undefined : 'ka-twinkle'} style={{ animationDelay: `${f(-hh(i, 4) * 2)}s` }} opacity="0.7" />
      ))}
      <path d="M200 420 Q500 380 800 420" stroke="#8a5bc4" strokeOpacity="0.3" strokeWidth="3" fill="none" />
      {/* sorot lampu ke dua tokoh */}
      <path d="M270 70 L340 70 L420 470 L180 470 Z" fill="url(#kj-pt-beam)" />
      <path d="M660 70 L730 70 L820 470 L580 470 Z" fill="url(#kj-pt-beam)" />
      {curtain(1)}
      {curtain(-1)}
      {/* rangka lampu & valans berumbai */}
      <rect width="1000" height="18" fill="#0d0716" />
      {[305, 695].map((x) => (
        <g key={x}>
          <rect x={x - 18} y="16" width="36" height="46" rx="6" fill="#2d2d3a" transform={`rotate(${x < 500 ? -8 : 8} ${x} 30)`} />
          <ellipse cx={x} cy="66" rx="16" ry="6" fill="#fff6d0" className="ka-glow" />
        </g>
      ))}
      <path d={`M0 0 H1000 V70 ${range(10)
        .map((i) => `Q${1000 - i * 100 - 50} 108 ${1000 - (i + 1) * 100} 70`)
        .join(' ')} Z`} fill="url(#kj-pt-curtain)" />
      <path d={range(10)
        .map((i) => `M${i * 100} 70 Q${i * 100 + 50} 108 ${(i + 1) * 100} 70`)
        .join(' ')} stroke="url(#kj-pt-gold)" strokeWidth="6" fill="none" />
      <path d={range(50).map((i) => `M${i * 20 + 10} ${f(72 + 76 * (((i * 20 + 10) % 100) / 100) * (1 - ((i * 20 + 10) % 100) / 100))} v10`).join(' ')} stroke="#e8b94a" strokeWidth="3" />
      {wallFoot()}
      {/* lantai panggung kayu */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-pt-floor)" />
      {persp(60, '#1a0d05', 0.6, 2)}
      <ellipse cx="300" cy="490" rx="150" ry="28" fill="url(#kj-pt-pool)" />
      <ellipse cx="700" cy="490" rx="150" ry="28" fill="url(#kj-pt-pool)" />
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-shade)" />
    </g>
  ),
  front: () => (
    <g>
      {/* bibir panggung & lampu kaki */}
      <rect y="572" width="1000" height="28" fill="#1a0d05" />
      <rect y="572" width="1000" height="5" fill="url(#kj-pt-gold)" />
      {range(12).map((i) => (
        <g key={i}>
          <ellipse cx={i * 84 + 38} cy="584" rx="14" ry="6" fill="#fff3c4" className="ka-glow" style={{ animationDelay: `${-i * 0.3}s` }} />
          <ellipse cx={i * 84 + 38} cy="580" rx="36" ry="12" fill="url(#kj-pt-pool)" opacity="0.6" />
        </g>
      ))}
    </g>
  ),
};

/* ================================ 6. Sirkus ================================ */

const sirkus: DojoTheme = {
  name: 'Sirkus',
  bg: '#fff0e0',
  ink: '#7a1f1f',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-sk-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a0d14" stopOpacity="0.55" />
        <stop offset="0.5" stopColor="#3a0d14" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="kj-sk-sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0d49a" />
        <stop offset="1" stopColor="#d4a760" />
      </linearGradient>
      <linearGradient id="kj-sk-seat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6d1a22" />
        <stop offset="1" stopColor="#3e0d13" />
      </linearGradient>
      <linearGradient id="kj-sk-pole" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8a8f99" />
        <stop offset="0.5" stopColor="#e6e9ee" />
        <stop offset="1" stopColor="#707580" />
      </linearGradient>
      <pattern id="kj-sk-dust" width="30" height="20" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="5" r="1.4" fill="#a8783a" opacity="0.4" />
        <circle cx="21" cy="13" r="1.1" fill="#fff" opacity="0.5" />
      </pattern>
    </>
  ),
  stage: () => (
    <g>
      {/* kanvas tenda bergaris yang menyatu di puncak tiang */}
      <rect width="1000" height={FLOOR} fill="#fff3dc" />
      {range(18)
        .filter((i) => i % 2 === 0)
        .map((i) => (
          <path key={i} d={`M500 -60 L${-400 + i * 100} ${FLOOR} L${-300 + i * 100} ${FLOOR} Z`} fill="#d8343a" />
        ))}
      <rect width="1000" height={FLOOR} fill="url(#kj-sk-top)" />
      {/* tiang tengah & ayunan trapeze */}
      <rect x="494" y="0" width="12" height="340" fill="url(#kj-sk-pole)" />
      {[
        [230, 150],
        [770, 170],
      ].map(([x, y]) => (
        <g key={x} className="ka-wave">
          <path d={`M${x - 30} 0 L${x - 30} ${y} M${x + 30} 0 L${x + 30} ${y}`} stroke="#6b4a24" strokeWidth="3" />
          <rect x={x - 36} y={y - 4} width="72" height="8" rx="4" fill="url(#kj-sk-pole)" />
        </g>
      ))}
      {/* untaian bendera segitiga */}
      {[
        [90, 0.0],
        [150, -1],
      ].map(([y, dl], j) => (
        <g key={j} className="ka-wave" style={{ animationDelay: `${dl}s` }}>
          <path d={`M0 ${y} Q250 ${y + 60} 500 ${y} Q750 ${y + 60} 1000 ${y}`} stroke="#6b4a24" strokeWidth="2.5" fill="none" />
          {range(20).map((i) => {
            const x = i * 50 + 25;
            const u = (x % 500) / 500;
            const yy = y + 4 * 60 * u * (1 - u) * 0.5;
            return <path key={i} d={`M${x - 14} ${f(yy)} L${x + 14} ${f(yy)} L${x} ${f(yy + 26)} Z`} fill={['#ffd23f', '#2ec4a6', '#3d7be0', '#ff8a3d'][(i + j) % 4]} />;
          })}
        </g>
      ))}
      {/* bintang hiasan */}
      {[
        [120, 250],
        [880, 240],
        [360, 220],
        [640, 230],
      ].map(([x, y], i) => (
        <path key={i} d={starPath(x, y, 16)} fill="#ffd23f" stroke="#c48a14" strokeWidth="2" className="ka-twinkle" style={{ animationDelay: `${-i * 0.45}s` }} />
      ))}
      {/* tribun penonton */}
      <path d="M0 330 Q500 290 1000 330 V440 H0 Z" fill="url(#kj-sk-seat)" />
      {range(3).map((r) =>
        range(30).map((i) => {
          const x = i * 34 + 10 + (r % 2) * 17;
          const u = x / 1000;
          const y = 348 + r * 28 - 80 * u * (1 - u);
          return <circle key={`${r}-${i}`} cx={f(x)} cy={f(y)} r="8" fill={['#f2c9a0', '#8d5a3b', '#d9a47a', '#5a3a28'][(i + r) % 4]} opacity="0.85" />;
        }),
      )}
      <path d="M0 330 Q500 290 1000 330" stroke="#ffd23f" strokeWidth="5" fill="none" />
      <rect y="430" width="1000" height="40" fill="#8a1d26" />
      {wallFoot()}
      {/* arena serbuk kayu & tepi cincin */}
      <rect y="436" width="1000" height={600 - 436} fill="url(#kj-sk-sand)" />
      <rect y="436" width="1000" height={600 - 436} fill="url(#kj-sk-dust)" />
      <ellipse cx="500" cy="525" rx="470" ry="84" fill="#f6dca6" />
      <ellipse cx="500" cy="525" rx="470" ry="84" fill="url(#kj-sk-dust)" />
      <path d="M30 525 A470 84 0 0 1 970 525" stroke="#d8343a" strokeWidth="18" fill="none" />
      <path d="M30 525 A470 84 0 0 1 970 525" stroke="#fff" strokeWidth="18" fill="none" strokeDasharray="36 36" />
      <path d="M36 518 A464 80 0 0 1 964 518" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" fill="none" />
      <ellipse cx="500" cy="515" rx="440" ry="60" fill="url(#kj-glow)" opacity="0.5" />
      <path d={starPath(500, 540, 26, 0.45)} fill="#ffd23f" opacity="0.5" transform="translate(0 540) scale(1 0.35) translate(0 -540)" />
    </g>
  ),
  front: () => (
    <g>
      {/* tepi depan cincin sirkus */}
      <path d="M30 525 A470 84 0 0 0 970 525" stroke="#b8262f" strokeWidth="22" fill="none" />
      <path d="M30 525 A470 84 0 0 0 970 525" stroke="#fff" strokeWidth="22" fill="none" strokeDasharray="40 40" />
      <path d="M34 516 A466 80 0 0 0 966 516" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" />
    </g>
  ),
};

/* ================================ 7. Kapal Bajak Laut ================================ */

const barrel = (x: number, y: number, s: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="2" rx="34" ry="7" fill="#000" opacity="0.25" />
    <path d="M-26 0 Q-34 -34 -26 -68 H26 Q34 -34 26 0 Z" fill="url(#kj-kb-barrel)" />
    <path d="M-30 -12 H30 M-31 -56 H31" stroke="#4a4a52" strokeWidth="5" />
    <ellipse cx="0" cy="-68" rx="26" ry="6" fill="#9c6b3a" stroke="#4a2c12" strokeWidth="2" />
    <path d="M-16 -60 Q-20 -34 -16 -6" stroke="#fff" strokeOpacity="0.25" strokeWidth="5" fill="none" />
  </g>
);

const kapalBajakLaut: DojoTheme = {
  name: 'Kapal Bajak Laut',
  bg: '#dff1fb',
  ink: '#123c5a',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-kb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6cc4ef" />
        <stop offset="1" stopColor="#d9f1fb" />
      </linearGradient>
      <linearGradient id="kj-kb-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b93c9" />
        <stop offset="1" stopColor="#15608f" />
      </linearGradient>
      <linearGradient id="kj-kb-hull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a5a2e" />
        <stop offset="1" stopColor="#5b3818" />
      </linearGradient>
      <linearGradient id="kj-kb-deck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b98450" />
        <stop offset="1" stopColor="#7a4f28" />
      </linearGradient>
      <linearGradient id="kj-kb-mast" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5b3818" />
        <stop offset="0.5" stopColor="#a8723c" />
        <stop offset="1" stopColor="#4a2c12" />
      </linearGradient>
      <linearGradient id="kj-kb-sail" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="1" stopColor="#e3d5b5" />
      </linearGradient>
      <linearGradient id="kj-kb-barrel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6b431e" />
        <stop offset="0.45" stopColor="#b07a42" />
        <stop offset="1" stopColor="#5b3616" />
      </linearGradient>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-kb-sky)" />
      <circle cx="620" cy="90" r="40" fill="#fff7c8" />
      <circle cx="620" cy="90" r="90" fill="url(#kj-warm)" opacity="0.6" />
      <g className="ka-wave">
        {cloud(420, 120, 0.9, '#fff', 0.9)}
        {cloud(860, 70, 0.8, '#fff', 0.85)}
      </g>
      {/* laut & pulau jauh */}
      <rect y="300" width="1000" height="80" fill="url(#kj-kb-sea)" />
      <path d="M700 302 Q740 280 790 302 Z" fill="#6aa84a" />
      <path d="M745 290 q-2 -26 6 -40 M751 250 q-18 -4 -26 8 M751 250 q18 -6 26 4 M751 250 q-6 -14 -18 -16 M751 250 q10 -14 22 -12" stroke="#3f7d2c" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="ka-wave">
        <path d={range(12).map((i) => `M${i * 90 + (i % 2) * 30} ${322 + (i % 3) * 16} q12 -6 24 0 t24 0`).join(' ')} stroke="#bfeaff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* burung camar */}
      <g className="ka-flutter">
        <path d="M460 200 q10 -10 20 0 q10 -10 20 0 M530 170 q8 -8 16 0 q8 -8 16 0" stroke="#23304a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* tiang layar kiri: tali, layar, sarang gagak, bendera */}
      <path d="M150 40 L30 380 M150 40 L290 380 M150 150 L60 380 M150 150 L250 380" stroke="#4a2c12" strokeWidth="2.5" opacity="0.8" />
      <path d={range(7).map((i) => `M${f(150 - (i + 1) * 15)} ${f(40 + (i + 1) * 42)} H${f(150 + (i + 1) * 17)}`).join(' ')} stroke="#4a2c12" strokeWidth="1.5" opacity="0.5" />
      <rect x="138" y="20" width="24" height={FLOOR - 20} fill="url(#kj-kb-mast)" />
      <path d="M40 90 Q150 70 262 90 Q280 170 262 250 Q150 230 40 250 Q22 170 40 90 Z" fill="url(#kj-kb-sail)" stroke="#bda884" strokeWidth="3" />
      <path d="M40 90 Q150 70 262 90 M40 250 Q150 230 262 250" stroke="#6b4a24" strokeWidth="6" fill="none" />
      <path d="M150 124 l-14 30 h28 z" fill="#c0392b" opacity="0.85" />
      <circle cx="150" cy="176" r="16" fill="#c0392b" opacity="0.85" />
      <path d="M120 40 h60 l-6 18 h-48 z" fill="#6b431e" />
      <g className="ka-sway" style={{ transformOrigin: '0% 100%' }}>
        <path d="M162 22 Q200 12 236 24 Q220 38 236 54 Q200 44 162 52 Z" fill="#1f2230" />
        <circle cx="198" cy="34" r="8" fill="#fff" />
        <circle cx="195" cy="33" r="2" fill="#1f2230" />
        <circle cx="201" cy="33" r="2" fill="#1f2230" />
        <path d="M188 46 L208 40 M188 40 L208 46" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* tiang layar kanan (lebih kecil) */}
      <path d="M860 90 L760 380 M860 90 L970 380" stroke="#4a2c12" strokeWidth="2.5" opacity="0.8" />
      <rect x="850" y="70" width="20" height={FLOOR - 70} fill="url(#kj-kb-mast)" />
      <path d="M780 130 Q860 116 940 130 Q954 190 940 250 Q860 236 780 250 Q766 190 780 130 Z" fill="url(#kj-kb-sail)" stroke="#bda884" strokeWidth="3" />
      <path d="M780 130 Q860 116 940 130 M780 250 Q860 236 940 250" stroke="#6b4a24" strokeWidth="5" fill="none" />
      {/* dinding lambung (bulwark) */}
      <rect y="360" width="1000" height="110" fill="url(#kj-kb-hull)" />
      <path d={range(5).map((i) => `M0 ${382 + i * 20} H1000`).join(' ')} stroke="#3e240e" strokeWidth="2" opacity="0.4" />
      <rect y="352" width="1000" height="14" rx="4" fill="#a8723c" />
      <rect y="352" width="1000" height="4" fill="#fff" opacity="0.25" />
      {[330, 670].map((x) => (
        <g key={x}>
          <rect x={x - 22} y="390" width="44" height="34" rx="4" fill="#2b1a0c" />
          <circle cx={x} cy="407" r="10" fill="#3a3d48" />
          <circle cx={x} cy="407" r="5" fill="#15161c" />
        </g>
      ))}
      {wallFoot()}
      {barrel(60, FLOOR, 1, 'br1')}
      {barrel(956, FLOOR, 0.9, 'br2')}
      {/* peti harta */}
      <g>
        <ellipse cx="880" cy={FLOOR} rx="40" ry="6" fill="#000" opacity="0.25" />
        <rect x="848" y="432" width="64" height="38" rx="3" fill="#8a4d1f" />
        <path d="M848 432 Q880 406 912 432 Z" fill="#a8622a" />
        <path d="M848 432 H912 M864 420 V470 M896 420 V470" stroke="#d9a43a" strokeWidth="4" />
        <circle cx="880" cy="428" r="3" fill="#fff7c8" className="ka-twinkle" />
      </g>
      {/* geladak kayu */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-kb-deck)" />
      {persp(64, '#4a2c12', 0.55, 2.5)}
      {rows([496, 530, 578], '#4a2c12', 0.15, 2)}
      {floorLight(0.4)}
    </g>
  ),
  front: () => (
    <g>
      {/* pagar tali di depan geladak */}
      {[16, 984].map((x) => (
        <g key={x}>
          <rect x={x - 10} y="520" width="20" height="80" rx="4" fill="url(#kj-kb-mast)" />
          <circle cx={x} cy="520" r="11" fill="#a8723c" />
        </g>
      ))}
      <path d="M16 530 Q250 590 500 578 Q750 590 984 530" stroke="#8a6a3c" strokeWidth="7" fill="none" />
      <path d="M16 530 Q250 590 500 578 Q750 590 984 530" stroke="#d8bd84" strokeWidth="7" fill="none" strokeDasharray="6 6" />
      {/* pelampung */}
      <g transform="translate(90 560)">
        <circle r="28" fill="none" stroke="#fff" strokeWidth="14" />
        <circle r="28" fill="none" stroke="#e04f3f" strokeWidth="14" strokeDasharray="22 22" />
      </g>
    </g>
  ),
};

/* ================================ 8. Istana Es ================================ */

const icePillar = (x: number, key: string) => (
  <g key={key}>
    <rect x={x - 26} y="70" width="52" height={FLOOR - 70} fill="url(#kj-ie-pillar)" />
    <path d={`M${x - 14} 80 V${FLOOR - 10}`} stroke="#fff" strokeOpacity="0.7" strokeWidth="6" />
    <path d={`M${x + 12} 90 V${FLOOR - 40}`} stroke="#fff" strokeOpacity="0.3" strokeWidth="3" />
    <rect x={x - 34} y="66" width="68" height="18" rx="6" fill="#e9f6ff" />
    <rect x={x - 34} y={FLOOR - 20} width="68" height="20" rx="6" fill="#e9f6ff" />
    <path d={`M${x - 30} 84 l6 18 l6 -18 l5 12 l5 -12 l6 22 l6 -22 l5 10 l5 -10`} fill="#e9f6ff" />
  </g>
);

const istanaEs: DojoTheme = {
  name: 'Istana Es',
  bg: '#e8f4fc',
  ink: '#1d4f7a',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-ie-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfe8fa" />
        <stop offset="1" stopColor="#a9d2ef" />
      </linearGradient>
      <linearGradient id="kj-ie-pillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8fc4e8" stopOpacity="0.9" />
        <stop offset="0.35" stopColor="#e8f7ff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#6aa9d6" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="kj-ie-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e3f3ff" />
        <stop offset="1" stopColor="#96c7ea" />
      </linearGradient>
      <radialGradient id="kj-ie-night" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#3b4f9a" />
        <stop offset="1" stopColor="#1a2458" />
      </radialGradient>
      <pattern id="kj-ie-brick" width="120" height="60" patternUnits="userSpaceOnUse">
        <path d="M0 1 H120 M0 31 H120 M60 1 V31 M1 31 V60" stroke="#fff" strokeWidth="2" opacity="0.55" fill="none" />
      </pattern>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-ie-wall)" />
      <rect width="1000" height={FLOOR} fill="url(#kj-ie-brick)" />
      {/* jendela bulat berkepingan salju */}
      {[
        [500, 190, 84],
        [215, 220, 54],
        [785, 220, 54],
      ].map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r + 12} fill="#e9f6ff" />
          <circle cx={x} cy={y} r={r} fill="url(#kj-ie-night)" />
          {range(8).map((i) => (
            <circle key={i} cx={f(x + (hh(i, x) - 0.5) * r * 1.3)} cy={f(y + (hh(i, y) - 0.5) * r * 1.3)} r="1.8" fill="#fff" className="ka-twinkle" style={{ animationDelay: `${f(-hh(i, 7) * 2)}s` }} />
          ))}
          {flake(x, y, r * 0.82, '#dff3ff', r > 60 ? 6 : 4.5)}
          <circle cx={x} cy={y} r={r * 0.16} fill="#dff3ff" />
          <circle cx={x} cy={y} r={r + 12} fill="none" stroke="#9fcdee" strokeWidth="3" />
        </g>
      ))}
      {/* tiang es */}
      {[60, 360, 640, 940].map((x) => icePillar(x, `ip${x}`))}
      {/* balok atas & juntaian es */}
      <rect width="1000" height="70" fill="#dff1fd" />
      <rect y="60" width="1000" height="10" fill="#b5daf3" />
      <path d={`M0 70 ${range(40)
        .map((i) => {
          const x = i * 25;
          return `L${x + 6} 70 L${x + 12} ${f(84 + hh(i, 11) * 34)} L${x + 18} 70`;
        })
        .join(' ')} L1000 70 Z`} fill="#eef8ff" />
      <path d="M0 30 Q500 10 1000 30" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" fill="none" />
      {/* timbunan salju di kaki dinding */}
      <path d="M0 470 Q60 430 130 456 Q200 440 260 470 Z M740 470 Q800 440 870 454 Q940 430 1000 450 V470 Z" fill="#fff" />
      {wallFoot()}
      {/* lantai es mengilap + pantulan tiang */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-ie-floor)" />
      {[60, 360, 640, 940].map((x) => (
        <rect key={x} x={x - 22} y={FLOOR} width="44" height="80" fill="#fff" opacity="0.25" />
      ))}
      {persp(120, '#fff', 0.7, 2)}
      {rows([500, 545], '#fff', 0.5, 2)}
      {[
        [180, 520],
        [470, 560],
        [820, 505],
        [620, 585],
      ].map(([x, y], i) => (
        <path key={i} d={starPath(x, y, 9, 0.25)} fill="#fff" className="ka-twinkle" style={{ animationDelay: `${-i * 0.5}s` }} />
      ))}
      {floorLight(0.5)}
    </g>
  ),
  front: () => (
    <g>
      {/* salju melayang (hanya di pinggir, tengah dibiarkan kosong) */}
      {range(26).map((i) => {
        const left = i % 2 === 0;
        const x = left ? hh(i, 21) * 190 : 860 + hh(i, 22) * 140;
        const y = 20 + hh(i, 23) * 560;
        return <circle key={i} cx={f(x)} cy={f(y)} r={f(2 + hh(i, 24) * 3)} fill="#fff" className="ka-twinkle" style={{ animationDelay: `${f(-hh(i, 25) * 1.8)}s` }} />;
      })}
      {range(8).map((i) => {
        const x = 200 + hh(i, 31) * 650;
        const y = 480 + hh(i, 32) * 110;
        return <circle key={`b${i}`} cx={f(x)} cy={f(y)} r="2.5" fill="#fff" className="ka-twinkle" style={{ animationDelay: `${f(-hh(i, 33) * 1.8)}s` }} />;
      })}
    </g>
  ),
};

/* ================================ 9. Puncak Air Terjun ================================ */

const pine = (x: number, y: number, s: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-5" y="-20" width="10" height="24" fill="#5b3a1a" />
    <path d="M0 -130 L34 -60 H18 L42 -20 H-42 L-18 -60 H-34 Z" fill="#2f6b3a" />
    <path d="M0 -130 L-34 -60 H-18 L-42 -20 H0 Z" fill="#3f8a4a" />
  </g>
);

const puncakAirTerjun: DojoTheme = {
  name: 'Puncak Air Terjun',
  bg: '#e2f4f7',
  ink: '#1f5a52',
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-at-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fd2ee" />
        <stop offset="1" stopColor="#e8f7fb" />
      </linearGradient>
      <linearGradient id="kj-at-cliff" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6d7d86" />
        <stop offset="1" stopColor="#8e9ea6" />
      </linearGradient>
      <linearGradient id="kj-at-fall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a8e2f7" />
        <stop offset="0.5" stopColor="#f2fcff" />
        <stop offset="1" stopColor="#8fd3ee" />
      </linearGradient>
      <linearGradient id="kj-at-rock" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b3a78f" />
        <stop offset="1" stopColor="#7a6d58" />
      </linearGradient>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-at-sky)" />
      <g className="ka-wave">
        {cloud(170, 90, 0.9, '#fff', 0.9)}
        {cloud(860, 120, 1, '#fff', 0.85)}
      </g>
      {/* gunung jauh */}
      <path d="M0 330 L120 200 L220 290 L330 170 L420 260 L500 230 L600 280 L700 160 L820 270 L920 200 L1000 260 V470 H0 Z" fill="#a8c6d6" />
      <path d="M330 170 L300 205 L318 200 L330 214 L345 198 L360 205 Z M700 160 L672 192 L690 188 L702 200 L716 186 L730 192 Z" fill="#fff" />
      {/* tebing & air terjun di tengah belakang */}
      <path d="M360 120 Q400 100 440 112 L560 112 Q600 100 640 120 L660 380 H340 Z" fill="url(#kj-at-cliff)" />
      <path d="M380 140 l20 60 M620 150 l-16 70 M400 260 l24 40 M600 260 l-20 50" stroke="#55646c" strokeWidth="3" opacity="0.5" />
      <path d="M440 112 H560 L566 360 H434 Z" fill="url(#kj-at-fall)" />
      <g className="ka-shimmer">
        <path d="M456 120 V350 M478 118 V356 M500 120 V352 M522 118 V356 M544 120 V350" stroke="#fff" strokeWidth="4" strokeDasharray="30 18" opacity="0.8" />
      </g>
      {/* pelangi di kabut */}
      {['#ff6b6b', '#ffb23f', '#ffe45c', '#6fd36f', '#5bb5f5', '#9b7bf0'].map((c, i) => {
        const r = 300 - i * 11;
        return <path key={c} d={`M${500 - r} 390 A${r} ${r} 0 0 1 ${500 + r} 390`} stroke={c} strokeWidth="11" fill="none" opacity="0.42" />;
      })}
      <g className="ka-smoke">
        {cloud(500, 360, 1.1, '#fff', 0.9)}
      </g>
      {cloud(420, 380, 0.9, '#fff', 0.85)}
      {cloud(590, 378, 0.9, '#fff', 0.85)}
      {/* bukit hijau & pinus */}
      <path d="M0 380 Q160 330 330 390 Q500 360 670 390 Q840 330 1000 370 V470 H0 Z" fill="#7fb468" />
      {pine(60, 440, 1.1, 'p1')}
      {pine(140, 460, 1.3, 'p2')}
      {pine(230, 430, 0.8, 'p3')}
      {pine(790, 430, 0.8, 'p4')}
      {pine(880, 460, 1.3, 'p5')}
      {pine(960, 440, 1.1, 'p6')}
      <g className="ka-flutter">
        <path d="M250 150 q8 -8 16 0 q8 -8 16 0 M300 180 q6 -6 12 0 q6 -6 12 0" stroke="#2c4a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      {/* tepi rumput di puncak tebing */}
      <path d={`M0 ${FLOOR + 6} ${range(51)
        .map((i) => `L${i * 20} ${f(FLOOR - 6 - hh(i, 41) * 14)} L${i * 20 + 10} ${FLOOR + 2}`)
        .join(' ')} L1000 ${FLOOR + 6} Z`} fill="#5f9e45" />
      {/* lantai batu datar */}
      <rect y={FLOOR + 4} width="1000" height={600 - FLOOR - 4} fill="url(#kj-at-rock)" />
      <path d="M80 500 l40 20 l-10 30 M300 520 l30 -8 l20 26 M620 510 l-24 22 l14 30 M860 500 l20 30 l40 6" stroke="#5e5242" strokeWidth="3" fill="none" opacity="0.5" />
      {persp(150, '#5e5242', 0.12, 2, FLOOR + 4)}
      <rect y={FLOOR + 4} width="1000" height="10" fill="#4d7d38" opacity="0.5" />
      {floorLight(0.45, FLOOR + 4)}
    </g>
  ),
  front: () => (
    <g>
      {/* sinar matahari dari pojok kiri atas */}
      <path d="M0 0 L150 0 L0 190 Z M0 0 L60 0 L0 260 Z" fill="url(#kj-ray)" opacity="0.5" />
      {/* rumput & bunga di pojok bawah */}
      {[
        [30, 1],
        [120, 0.8],
        [900, 0.9],
        [975, 1.1],
      ].map(([x, s], i) => (
        <g key={i} className="ka-sway" style={{ animationDelay: `${-i * 0.6}s` }}>
          <path d={`M${x - 20 * s} 600 Q${x - 18 * s} ${600 - 40 * s} ${x - 30 * s} ${600 - 60 * s} M${x} 600 Q${x + 2 * s} ${600 - 50 * s} ${x - 4 * s} ${600 - 76 * s} M${x + 18 * s} 600 Q${x + 20 * s} ${600 - 36 * s} ${x + 32 * s} ${600 - 56 * s}`} stroke="#4d8a33" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx={f(x - 4 * s)} cy={f(600 - 80 * s)} r={f(8 * s)} fill={['#ff8fb1', '#ffd23f', '#ffffff', '#b28dff'][i]} />
          <circle cx={f(x - 4 * s)} cy={f(600 - 80 * s)} r={f(3 * s)} fill="#e0a100" />
        </g>
      ))}
    </g>
  ),
};

/* ================================ 10. Stadion Angkasa ================================ */

const stadionAngkasa: DojoTheme = {
  name: 'Stadion Angkasa',
  bg: '#0b1030',
  ink: '#e6f0ff',
  dark: true,
  defs: (
    <>
      {BASE_DEFS}
      <linearGradient id="kj-sa-space" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070a24" />
        <stop offset="1" stopColor="#231a5e" />
      </linearGradient>
      <radialGradient id="kj-sa-nebula">
        <stop offset="0" stopColor="#c05bff" stopOpacity="0.45" />
        <stop offset="1" stopColor="#c05bff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kj-sa-nebula2">
        <stop offset="0" stopColor="#35d6ff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#35d6ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kj-sa-planet" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffd6a0" />
        <stop offset="0.6" stopColor="#e0864a" />
        <stop offset="1" stopColor="#7a3a1e" />
      </radialGradient>
      <radialGradient id="kj-sa-moon" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#e6ecf5" />
        <stop offset="1" stopColor="#7d8aa3" />
      </radialGradient>
      <linearGradient id="kj-sa-stand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c2150" />
        <stop offset="1" stopColor="#0e1233" />
      </linearGradient>
      <linearGradient id="kj-sa-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c366e" />
        <stop offset="1" stopColor="#121838" />
      </linearGradient>
    </>
  ),
  stage: () => (
    <g>
      <rect width="1000" height={FLOOR} fill="url(#kj-sa-space)" />
      <ellipse cx="250" cy="150" rx="260" ry="120" fill="url(#kj-sa-nebula)" />
      <ellipse cx="760" cy="230" rx="240" ry="110" fill="url(#kj-sa-nebula2)" />
      {range(70).map((i) => (
        <circle
          key={i}
          cx={f(hh(i, 51) * 1000)}
          cy={f(hh(i, 52) * 300)}
          r={f(0.8 + hh(i, 53) * 1.8)}
          fill="#fff"
          opacity={f(0.5 + hh(i, 54) * 0.5)}
          className={i % 4 === 0 ? 'ka-twinkle' : undefined}
          style={i % 4 === 0 ? { animationDelay: `${f(-hh(i, 55) * 1.8)}s` } : undefined}
        />
      ))}
      {/* planet bercincin & bulan */}
      <g className="ka-bob">
        <ellipse cx="830" cy="110" rx="92" ry="20" fill="none" stroke="#ffd6a0" strokeWidth="6" opacity="0.5" transform="rotate(-14 830 110)" />
        <circle cx="830" cy="110" r="50" fill="url(#kj-sa-planet)" />
        <path d="M784 96 Q830 86 876 100 M782 118 Q830 110 878 124" stroke="#fff" strokeOpacity="0.25" strokeWidth="5" fill="none" />
        <path d="M738 110 A92 20 0 0 0 922 110" stroke="#ffd6a0" strokeWidth="6" fill="none" transform="rotate(-14 830 110)" opacity="0.9" />
      </g>
      <circle cx="150" cy="90" r="26" fill="url(#kj-sa-moon)" />
      <circle cx="142" cy="84" r="5" fill="#8b97ad" opacity="0.6" />
      <circle cx="158" cy="98" r="3.5" fill="#8b97ad" opacity="0.6" />
      {/* cincin neon besar di belakang */}
      {[
        [230, '#35d6ff'],
        [262, '#ff4fd8'],
      ].map(([ry, c], i) => (
        <g key={i}>
          <ellipse cx="500" cy="300" rx={Number(ry) * 1.9} ry={Number(ry) * 0.26} fill="none" stroke={String(c)} strokeWidth="14" opacity="0.18" />
          <ellipse cx="500" cy="300" rx={Number(ry) * 1.9} ry={Number(ry) * 0.26} fill="none" stroke={String(c)} strokeWidth="4" className="ka-glow" style={{ animationDelay: `${-i * 0.6}s` }} />
        </g>
      ))}
      {/* hologram bintang */}
      <g className="ka-bob">
        <path d={starPath(500, 170, 40)} fill="#35d6ff" opacity="0.25" />
        <path d={starPath(500, 170, 40)} fill="none" stroke="#9ff0ff" strokeWidth="3" />
        <path d="M470 230 L530 230 L515 260 L485 260 Z" fill="#35d6ff" opacity="0.15" />
      </g>
      {/* tribun melengkung dengan lampu penonton */}
      <path d="M0 340 Q500 300 1000 340 V470 H0 Z" fill="url(#kj-sa-stand)" />
      {range(3).map((r) =>
        range(34).map((i) => {
          const x = i * 30 + 12 + (r % 2) * 15;
          const u = x / 1000;
          const y = 380 + r * 26 - 80 * u * (1 - u);
          const c = ['#35d6ff', '#ff4fd8', '#ffd23f', '#7df9a8'][(i + r * 2) % 4];
          return <circle key={`${r}-${i}`} cx={f(x)} cy={f(y - 24)} r="3" fill={c} opacity="0.85" className={(i + r) % 5 === 0 ? 'ka-twinkle' : undefined} />;
        }),
      )}
      <path d="M0 340 Q500 300 1000 340" stroke="#35d6ff" strokeWidth="4" fill="none" />
      <rect y="440" width="1000" height="30" fill="#0b0f2a" />
      <rect y="440" width="1000" height="3" fill="#ff4fd8" className="ka-glow" />
      {/* lantai logam bergaris neon */}
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-sa-floor)" />
      {persp(100, '#35d6ff', 0.35, 2)}
      {rows([492, 522, 562], '#35d6ff', 0.25, 2)}
      <ellipse cx="500" cy="530" rx="190" ry="30" fill="none" stroke="#ff4fd8" strokeWidth="4" opacity="0.7" />
      <ellipse cx="500" cy="530" rx="120" ry="18" fill="none" stroke="#35d6ff" strokeWidth="3" opacity="0.6" />
      <rect y={FLOOR - 3} width="1000" height="6" fill="#35d6ff" />
      <rect y={FLOOR - 8} width="1000" height="16" fill="#35d6ff" opacity="0.2" />
      <ellipse cx="500" cy="510" rx="420" ry="50" fill="url(#kj-glow)" opacity="0.18" />
      <rect y={FLOOR} width="1000" height={600 - FLOOR} fill="url(#kj-shade)" />
    </g>
  ),
  front: () => (
    <g>
      {/* pagar neon depan */}
      <rect y="586" width="1000" height="14" fill="#0b0f2a" />
      <path d="M0 586 H1000" stroke="#ff4fd8" strokeWidth="4" className="ka-glow" />
      <path d="M0 586 H1000" stroke="#ff4fd8" strokeWidth="12" opacity="0.2" />
      {/* drone kamera kecil */}
      <g className="ka-bob">
        <rect x="900" y="60" width="50" height="18" rx="8" fill="#3a4478" />
        <path d="M896 58 H954" stroke="#9aa6d6" strokeWidth="3" />
        <path d="M886 54 H910 M940 54 H964" stroke="#c9d2f5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="925" cy="82" r="6" fill="#35d6ff" />
        <circle cx="938" cy="68" r="2.5" fill="#ff4f6b" className="ka-twinkle" />
      </g>
    </g>
  ),
};

export const JURUS_THEMES: DojoTheme[] = [dojoKayu, arenaSilat, tamanBambu, kuilAwan, panggungTari, sirkus, kapalBajakLaut, istanaEs, puncakAirTerjun, stadionAngkasa];

/* ================================ tokoh: Agam-ninja & Sensei Panda ================================ */

type Pt = [number, number];
/**
 * Kerangka pose (koordinat dunia; kaki di 0,0; x+ = depan/kanan; y- = atas). Badan berporos di pinggul (hip) dan
 * dimiringkan tilt derajat (positif = condong ke depan). Lengan: [siku, kepalan]; kaki: [lutut, telapak].
 */
interface Rig {
  hip: Pt;
  tilt: number;
  armB: [Pt, Pt];
  armF: [Pt, Pt];
  legB: [Pt, Pt];
  legF: [Pt, Pt];
  /** kemiringan kepala tambahan */
  head?: number;
  /** kepala menoleh ke belakang (pose putar) */
  headFlip?: boolean;
  /** kedua lengan di depan kepala (pose tangkis) */
  armsFront?: boolean;
  /** sudut telapak kaki depan (pose tendang) */
  footF?: number;
  /** seluruh badan terangkat (pose lompat) */
  lift?: number;
  face?: 'dizzy' | 'happy';
}

const RIGS: Record<Pose, Rig> = {
  siap: { hip: [0, -58], tilt: 6, armF: [[24, -80], [38, -100]], armB: [[14, -74], [30, -86]], legB: [[-14, -30], [-26, 0]], legF: [[18, -32], [24, 0]] },
  hormat: { hip: [-8, -62], tilt: 48, head: 10, armF: [[27, -62], [29, -39]], armB: [[22, -63], [22, -40]], legB: [[-9, -31], [-10, 0]], legF: [[-4, -31], [-2, 0]] },
  pukul: { hip: [-4, -56], tilt: 12, armF: [[30, -93], [56, -93]], armB: [[-14, -80], [2, -70]], legB: [[-24, -32], [-44, 0]], legF: [[22, -34], [32, 0]] },
  tendang: { hip: [-12, -64], tilt: -16, footF: -62, armF: [[-2, -90], [14, -102]], armB: [[-42, -90], [-60, -80]], legB: [[-8, -32], [-12, 0]], legF: [[18, -78], [50, -92]] },
  lompat: { hip: [0, -64], tilt: 4, lift: -60, armF: [[20, -116], [28, -138]], armB: [[-16, -118], [-22, -140]], legB: [[20, -48], [2, -28]], legF: [[28, -58], [16, -32]] },
  putar: { hip: [0, -62], tilt: 0, headFlip: true, armF: [[26, -102], [50, -104]], armB: [[-22, -102], [-46, -104]], legB: [[-2, -31], [-4, 0]], legF: [[22, -44], [10, -22]] },
  tangkis: { hip: [-4, -58], tilt: 4, armsFront: true, armB: [[22, -94], [12, -124]], armF: [[14, -88], [32, -118]], legB: [[-18, -30], [-28, 0]], legF: [[16, -32], [22, 0]] },
  jatuh: { hip: [-6, -54], tilt: -24, head: -10, face: 'dizzy', armF: [[-2, -104], [12, -118]], armB: [[-42, -94], [-58, -108]], legB: [[-4, -26], [-18, 0]], legF: [[16, -30], [26, 0]] },
  menang: { hip: [0, -62], tilt: 0, face: 'happy', armF: [[24, -118], [34, -142]], armB: [[-20, -82], [-6, -66]], legB: [[-8, -31], [-12, 0]], legF: [[8, -31], [14, 0]] },
};

/** putar titik (x, y) sebesar t derajat searah jarum jam (sama dengan rotate() SVG) */
const rot = (t: number, [x, y]: Pt): Pt => {
  const r = (t * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
};
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const P = (p: Pt) => `${f(p[0])} ${f(p[1])}`;

interface Look {
  /** kain gi: garis tepi, isi, isi sisi belakang (lebih gelap), kilau */
  gi: { o: string; m: string; back: string; hl: string };
  giFill: string;
  lapel: string;
  hand: (p: Pt, big: boolean, key: string) => ReactNode;
  foot: { fill: string; o: string };
  head: (face: Rig['face']) => ReactNode;
}

/** lengan/kaki: garis tepi + isi + kilau di sisi atas */
function limb(pts: Pt[], w: number, o: string, m: string, hl: string) {
  const d = 'M' + pts.map(P).join(' L');
  return (
    <g>
      <path d={d} fill="none" stroke={o} strokeWidth={w + 4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={m} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={hl} strokeWidth={f(w * 0.28)} strokeLinecap="round" strokeLinejoin="round" opacity="0.55" transform="translate(-1.5 -2)" />
    </g>
  );
}

function footShape(knee: Pt, ft: Pt, look: Look, angle?: number) {
  const a = angle ?? (ft[1] > -2 ? 0 : (Math.atan2(ft[1] - knee[1], ft[0] - knee[0]) * 180) / Math.PI - 90);
  return (
    <g transform={`translate(${P(ft)}) rotate(${f(a)})`}>
      <rect x="-7" y="-9" width="22" height="10" rx="5" fill={look.foot.fill} stroke={look.foot.o} strokeWidth="2" />
      <rect x="-3" y="-7.5" width="12" height="3" rx="1.5" fill="#fff" opacity="0.18" />
    </g>
  );
}

/** kepala Agam tampak samping (menghadap kanan), berpusat di 0,0 */
function agamHead(face: Rig['face']) {
  return (
    <g>
      {/* ekor ikat kepala berkibar ke belakang */}
      <g className="ka-sway">
        <path d="M-24 -14 C-34 -22 -44 -10 -58 -16" stroke="#b81d2c" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M-24 -12 C-34 -4 -44 4 -54 -2" stroke="#e03a45" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      {/* antena */}
      <path d="M-4 -21 L-9 -36" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-10" cy="-39" r="5.5" fill="#ff6b5b" className="robi-led" />
      <rect x="-25" y="-23" width="50" height="45" rx="18" fill="url(#kj-f-agam)" stroke="#178f78" strokeWidth="3" />
      <path d="M-16 -14 Q-19 0 -15 12" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* baut telinga */}
      <circle cx="-7" cy="2" r="6.5" fill="#d8e2e8" stroke="#178f78" strokeWidth="2.5" />
      <circle cx="-7" cy="2" r="2" fill="#178f78" />
      {/* kaca visor & mata */}
      <rect x="3" y="-11" width="24" height="20" rx="10" fill="#1b2a4e" />
      {face === 'dizzy' ? (
        <path d="M16 -1 m-5 0 a5 5 0 1 1 5 5 a3 3 0 1 1 -3 -3" stroke="#7df9ff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : face === 'happy' ? (
        <path d="M11 1 Q16 -6 21 1" stroke="#7df9ff" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="16" cy="-1" r="5.2" fill="#7df9ff" className="robi-eye" />
          <circle cx="14.5" cy="-2.8" r="1.6" fill="#fff" />
        </>
      )}
      <path d="M7 -9 Q12 -11 18 -10" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={face === 'dizzy' ? 'M13 15 q3 -3 6 0 q3 3 5 0' : 'M13 13 Q18 17 22 12'} stroke="#178f78" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* ikat kepala merah + simpul */}
      <path d="M-18 -21 L18 -21 L24.5 -12 L-24.5 -12 Z" fill="#e03a45" />
      <path d="M-18 -21 L18 -21" stroke="#ff8c8c" strokeWidth="2" />
      <path d="M-24.5 -12 L24.5 -12" stroke="#a3151f" strokeWidth="2" />
      <rect x="-29" y="-21" width="9" height="11" rx="3" fill="#c42534" />
    </g>
  );
}

/** kepala Sensei Panda tampak samping */
function pandaHead(face: Rig['face']) {
  return (
    <g>
      <circle cx="-12" cy="-19" r="8.5" fill="#1f1f24" />
      <circle cx="-12" cy="-19" r="4" fill="#3a3a44" />
      <circle cx="0" cy="0" r="23" fill="url(#kj-f-fur)" stroke="#2a2a30" strokeWidth="2.5" />
      <circle cx="3" cy="-22" r="7.5" fill="#1f1f24" />
      {/* moncong & hidung */}
      <ellipse cx="19" cy="7" rx="10" ry="7.5" fill="#fbfbfb" stroke="#2a2a30" strokeWidth="2" />
      <ellipse cx="27" cy="3.5" rx="4" ry="3" fill="#1f1f24" />
      <path d="M20 12 q4 2 8 -1" stroke="#2a2a30" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* bercak mata */}
      <ellipse cx="10" cy="-4" rx="7" ry="9.5" fill="#1f1f24" transform="rotate(-22 10 -4)" />
      {face === 'dizzy' ? (
        <path d="M11 -4 m-3.5 0 a3.5 3.5 0 1 1 3.5 3.5 a2 2 0 1 1 -2 -2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      ) : face === 'happy' ? (
        <path d="M7 -3 Q11 -8 15 -3" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="12" cy="-4" r="3" fill="#fff" className="robi-eye" />
          <circle cx="12.8" cy="-4" r="1.6" fill="#1f1f24" />
        </>
      )}
      {/* alis & jenggot abu-abu */}
      <path d="M2 -15 Q10 -18 19 -12" stroke="#b9bcc2" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M10 14 Q14 22 10 32 Q7 26 4 34 Q2 24 -2 22 Q4 20 10 14 Z" fill="#c9ccd2" stroke="#9a9ea6" strokeWidth="1.5" />
      <ellipse cx="-4" cy="-10" rx="7" ry="4" fill="#fff" opacity="0.6" />
    </g>
  );
}

const AGAM_LOOK: Look = {
  gi: { o: '#9aa6b4', m: '#f6f8fa', back: '#dfe5ec', hl: '#ffffff' },
  giFill: 'url(#kj-f-giw)',
  lapel: '#b8c2ce',
  hand: (p, big, key) => <circle key={key} cx={f(p[0])} cy={f(p[1])} r={big ? 8.5 : 7} fill="url(#kj-f-agam)" stroke="#178f78" strokeWidth="2.5" />,
  foot: { fill: '#3b4256', o: '#23283a' },
  head: agamHead,
};

const SENSEI_LOOK: Look = {
  gi: { o: '#132652', m: '#2f56a3', back: '#244587', hl: '#7fa3ea' },
  giFill: 'url(#kj-f-gib)',
  lapel: '#6f95e0',
  hand: (p, big, key) => (
    <g key={key}>
      <circle cx={f(p[0])} cy={f(p[1])} r={big ? 8.5 : 7} fill="#1f1f24" stroke="#000" strokeWidth="1.5" />
      <circle cx={f(p[0] - 2)} cy={f(p[1] - 2.5)} r="2.2" fill="#fff" opacity="0.25" />
    </g>
  ),
  foot: { fill: '#1f1f24', o: '#000' },
  head: pandaHead,
};

const FIG_DEFS = {
  agam: (
    <defs>
      <radialGradient id="kj-f-agam" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#7ff0d6" />
        <stop offset="0.55" stopColor="#2ec4a6" />
        <stop offset="1" stopColor="#15907a" />
      </radialGradient>
      <linearGradient id="kj-f-giw" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#dfe5ec" />
        <stop offset="0.45" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e9eef3" />
      </linearGradient>
    </defs>
  ),
  sensei: (
    <defs>
      <radialGradient id="kj-f-fur" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#f1f2f4" />
        <stop offset="1" stopColor="#c9ced6" />
      </radialGradient>
      <linearGradient id="kj-f-gib" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#23468c" />
        <stop offset="0.45" stopColor="#3d68bf" />
        <stop offset="1" stopColor="#2a4f99" />
      </linearGradient>
    </defs>
  ),
};

/** garis gerak dua lapis (gelap tipis + putih) supaya terlihat di panggung terang maupun gelap */
const motion = (d: string, w = 5, key?: string) => (
  <g key={key}>
    <path d={d} stroke="#23304a" strokeOpacity="0.28" strokeWidth={w + 4} fill="none" strokeLinecap="round" />
    <path d={d} stroke="#fff" strokeOpacity="0.95" strokeWidth={w} fill="none" strokeLinecap="round" />
  </g>
);

const burst = (cx: number, cy: number, r: number) => (
  <g>
    <path d={burstPath(cx, cy, r)} fill="#ffd23f" stroke="#ff8a1f" strokeWidth="3" strokeLinejoin="round" />
    <path d={burstPath(cx, cy, r * 0.5, 7)} fill="#fff8d0" />
  </g>
);

const twinkleStar = (x: number, y: number, r: number, delay: number, key: string) => (
  <path key={key} d={starPath(x, y, r)} fill="#ffd23f" stroke="#e0a100" strokeWidth="2" strokeLinejoin="round" className="ka-twinkle" style={{ animationDelay: `${delay}s` }} />
);

/**
 * Tokoh tampak samping menghadap kanan, kaki di (0,0), tinggi ±150. who = 'agam' (robot ninja berikat kepala merah,
 * gi putih) atau 'sensei' (panda bijak, gi biru tua). Tiap pose dibuat berbeda jelas bentuknya + efek khas:
 * pukul (lengan lurus + ledakan), tendang (kaki tinggi + busur), lompat (melayang, garis gerak), putar (cincin
 * pusaran, kepala menoleh), tangkis (lengan bersilang + perisai), jatuh (miring + bintang pusing), menang (tinju ke atas).
 */
export function NinjaFigure({ who, pose }: { who: 'agam' | 'sensei'; pose: Pose }) {
  const R = RIGS[pose];
  const L = who === 'agam' ? AGAM_LOOK : SENSEI_LOOK;
  const lift = R.lift ?? 0;
  const up = (p: Pt): Pt => [p[0], p[1] + lift];
  const hip = up(R.hip);
  const shoulder = add(hip, rot(R.tilt, [2, -38]));
  const headC = add(hip, rot(R.tilt, [3, -66]));
  const arm = (a: [Pt, Pt], back: boolean) => (
    <g>
      {limb([shoulder, up(a[0]), up(a[1])], 11, L.gi.o, back ? L.gi.back : L.gi.m, L.gi.hl)}
      {L.hand(up(a[1]), !back && pose === 'pukul', 'h')}
    </g>
  );
  const leg = (l: [Pt, Pt], back: boolean, angle?: number) => (
    <g>
      {limb([hip, up(l[0]), up(l[1])], 15, L.gi.o, back ? L.gi.back : L.gi.m, L.gi.hl)}
      {footShape(up(l[0]), up(l[1]), L, angle)}
    </g>
  );
  const fistF = up(R.armF[1]);
  const footF = up(R.legF[1]);

  return (
    <g>
      {FIG_DEFS[who]}
      {/* bayangan di lantai (tetap di tanah walau melompat) */}
      <ellipse cx="0" cy="0" rx={lift ? 30 : 46} ry={lift ? 6 : 9} fill="#000" opacity={lift ? 0.14 : 0.22} />

      {/* efek di belakang badan */}
      {pose === 'putar' && (
        <g>
          {motion('M-66 -86 A68 18 0 0 1 66 -86', 4)}
          {motion('M-48 -34 A50 12 0 0 1 48 -34', 3.5)}
        </g>
      )}
      {pose === 'tendang' && (
        <g>
          {motion('M-8 -14 Q46 -18 62 -96', 6)}
          {motion('M4 -8 Q40 -4 54 -58', 3)}
        </g>
      )}
      {pose === 'lompat' && <g>{[-14, 4, 22].map((x, i) => motion(`M${x} ${-62 + i * 6} V${-22 + i * 4}`, 4, `m${x}`))}</g>}

      {leg(R.legB, true)}
      {!R.armsFront && arm(R.armB, true)}
      {leg(R.legF, false, R.footF)}

      {/* badan (gi + sabuk), digambar tegak lalu dimiringkan di pinggul */}
      <g transform={`translate(${P(hip)}) rotate(${R.tilt})`}>
        <path d="M-16 8 L-18 -34 Q-18 -47 -5 -47 L6 -47 Q19 -47 18 -34 L17 8 Q0 12 -16 8 Z" fill={L.giFill} stroke={L.gi.o} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M9 -46 Q7 -28 -1 -7" stroke={L.lapel} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M-12 -38 Q-13 -18 -11 2" stroke={L.gi.hl} strokeOpacity="0.5" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="-18.5" y="-8" width="37" height="8" rx="2.5" fill="#1d1d22" />
        <rect x="-18" y="-7.5" width="36" height="2" rx="1" fill="#fff" opacity="0.18" />
        <rect x="12" y="-9.5" width="9" height="10" rx="2.5" fill="#26262c" />
        <g className={pose === 'putar' || pose === 'lompat' ? 'ka-sway' : undefined}>
          <path d="M16 0 L21 13 M15 0 L13 14" stroke="#1d1d22" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </g>

      {/* kepala */}
      <g transform={`translate(${P(headC)}) rotate(${R.tilt + (R.head ?? 0)})${R.headFlip ? ' scale(-1 1)' : ''}`}>{L.head(R.face)}</g>

      {R.armsFront && arm(R.armB, true)}
      {arm(R.armF, false)}

      {/* efek di depan badan */}
      {pose === 'pukul' && (
        <g>
          {motion('M8 -106 H34', 3.5)}
          {motion('M10 -80 H36', 3.5)}
          {burst(fistF[0] + 14, fistF[1], 17)}
        </g>
      )}
      {pose === 'tendang' && burst(footF[0] + 14, footF[1] - 8, 13)}
      {pose === 'putar' && (
        <g>
          {motion('M66 -86 A68 18 0 0 1 -60 -80', 4)}
          <path d="M-60 -80 l10 -9 l2 13 z" fill="#fff" stroke="#23304a" strokeOpacity="0.3" strokeWidth="1.5" />
          {motion('M48 -34 A50 12 0 0 1 -44 -30', 3.5)}
        </g>
      )}
      {pose === 'tangkis' && (
        <g>
          <path d="M46 -150 Q66 -112 46 -76" stroke="#7df9ff" strokeWidth="12" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
          <path d="M46 -150 Q66 -112 46 -76" stroke="#7df9ff" strokeWidth="4" fill="none" strokeLinecap="round" className="ka-glow" />
          <path d="M56 -140 Q70 -112 56 -86" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      )}
      {pose === 'jatuh' && (
        <g>
          <ellipse cx={f(headC[0])} cy={f(headC[1] - 38)} rx="30" ry="8" fill="none" stroke="#ffd23f" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
          {twinkleStar(headC[0] - 28, headC[1] - 40, 8, 0, 's1')}
          {twinkleStar(headC[0] + 4, headC[1] - 48, 9, -0.6, 's2')}
          {twinkleStar(headC[0] + 28, headC[1] - 36, 7, -1.2, 's3')}
        </g>
      )}
      {pose === 'menang' && (
        <g>
          {twinkleStar(fistF[0] - 22, fistF[1] - 14, 7, 0, 'w1')}
          {twinkleStar(fistF[0] + 22, fistF[1] - 6, 8, -0.7, 'w2')}
          {twinkleStar(fistF[0] + 6, fistF[1] - 30, 6, -1.3, 'w3')}
        </g>
      )}
      {pose === 'hormat' && <path d={`M${f(headC[0] + 30)} ${f(headC[1] - 22)} q8 -6 4 -14 M${f(headC[0] + 38)} ${f(headC[1] - 12)} q9 -2 10 -10`} stroke="#ffd23f" strokeWidth="3" fill="none" strokeLinecap="round" className="ka-twinkle" />}
    </g>
  );
}

/* ================================ Agam-ninja tampak depan ================================ */

/** Agam tampak depan berkostum ninja (ikat kepala merah, gi putih, sabuk hitam), satu tinju terangkat. */
export function AgamNinjaFront({ size = 84, wave = true }: { size?: number; wave?: boolean }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} aria-hidden className={wave ? 'robi-wave' : undefined}>
      <defs>
        <linearGradient id="kj-nf-gi" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e3e8ee" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe5ec" />
        </linearGradient>
        <radialGradient id="kj-nf-head" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#7ff0d6" />
          <stop offset="0.55" stopColor="#2ec4a6" />
          <stop offset="1" stopColor="#15907a" />
        </radialGradient>
      </defs>
      <line x1="60" y1="22" x2="60" y2="8" stroke="#178f78" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="7" fill="#ff6b5b" className="robi-led" />
      {/* ekor ikat kepala */}
      <path d="M100 32 C108 34 112 44 118 46" stroke="#b81d2c" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M100 32 C110 28 114 36 119 34" stroke="#e03a45" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="18" y="20" width="84" height="66" rx="30" fill="url(#kj-nf-head)" stroke="#178f78" strokeWidth="5" />
      {/* ikat kepala */}
      <path d="M29 24 L91 24 L99.5 37 L20.5 37 Z" fill="#e03a45" />
      <path d="M29 24 H91" stroke="#ff8c8c" strokeWidth="2" />
      <rect x="95" y="26" width="10" height="11" rx="3" fill="#c42534" />
      <rect x="30" y="40" width="60" height="30" rx="15" fill="#1b2a4e" />
      <circle cx="47" cy="55" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="73" cy="55" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="45" cy="52.5" r="2" fill="#fff" />
      <circle cx="71" cy="52.5" r="2" fill="#fff" />
      <path d="M50 77 Q60 83 70 77" fill="none" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
      {/* lengan: kiri meninju ke atas, kanan di samping */}
      <path d="M40 96 L24 94 L16 72" stroke="#aeb8c4" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 96 L24 94 L16 72" stroke="#f6f8fa" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="67" r="7.5" fill="url(#kj-nf-head)" stroke="#178f78" strokeWidth="3" />
      <path d="M80 96 L96 104 L100 112" stroke="#aeb8c4" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 96 L96 104 L100 112" stroke="#f6f8fa" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="101" cy="115" r="6.5" fill="url(#kj-nf-head)" stroke="#178f78" strokeWidth="3" />
      {/* badan: gi putih + sabuk hitam */}
      <rect x="36" y="86" width="48" height="33" rx="12" fill="url(#kj-nf-gi)" stroke="#aeb8c4" strokeWidth="3.5" />
      <path d="M48 87 L60 103 L72 87" fill="none" stroke="#b8c2ce" strokeWidth="3" strokeLinejoin="round" />
      <rect x="37" y="104" width="46" height="7" rx="2" fill="#1d1d22" />
      <rect x="55" y="102.5" width="10" height="10" rx="2.5" fill="#26262c" />
      <path d="M58 112 L55 120 M62 112 L66 120" stroke="#1d1d22" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="38" y="118" width="16" height="10" rx="4" fill="#3b4256" />
      <rect x="66" y="118" width="16" height="10" rx="4" fill="#3b4256" />
    </svg>
  );
}

/* ================================ ikon gerakan (blok program) ================================ */

const W = { stroke: '#fff', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

/** piktogram putih 48×48 untuk tiap gerakan; terbaca di ukuran 32px di atas blok berwarna */
export const MOVE_ICON: Record<Move, ReactNode> = {
  pukul: (
    <g>
      {/* pergelangan + kepalan menghadap kanan + garis hantam */}
      <rect x="3" y="19" width="10" height="12" rx="3" fill="#fff" opacity="0.85" />
      <rect x="10" y="13" width="23" height="23" rx="7" fill="#fff" />
      <path d="M26 14 V35 M19 14 V35" stroke="#000" strokeOpacity="0.22" strokeWidth="2" />
      <path d="M11 29 Q18 27 22 31" stroke="#000" strokeOpacity="0.22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M38 13 L45 8 M39 24 H47 M38 35 L45 40" {...W} strokeWidth="3.5" />
    </g>
  ),
  tendang: (
    <g>
      {/* busur tendangan + kaki terangkat */}
      <path d="M6 42 Q8 14 34 8" {...W} strokeWidth="3" strokeDasharray="4 5" opacity="0.75" />
      <path d="M12 44 L22 30 L36 20" {...W} strokeWidth="8" />
      <rect x="31" y="11" width="15" height="9" rx="4.5" fill="#fff" transform="rotate(-40 38 16)" />
      <path d="M40 30 L46 34 M42 24 L47 24" {...W} strokeWidth="3" />
    </g>
  ),
  lompat: (
    <g>
      {/* panah ke atas + kaki menekuk */}
      <path d="M13 17 L24 5 L35 17" {...W} strokeWidth="5" />
      <path d="M24 7 V27" {...W} strokeWidth="5" />
      <path d="M24 28 L15 33 L19 41 M24 28 L33 33 L29 41" {...W} strokeWidth="4.5" />
      <path d="M12 46 H36" {...W} strokeWidth="2.5" opacity="0.6" />
    </g>
  ),
  putar: (
    <g>
      {/* panah melingkar */}
      <path d="M24 9 A15 15 0 1 1 9 24" {...W} strokeWidth="5" />
      <path d="M2 23 L9 12 L16 23 Z" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="4" fill="#fff" />
    </g>
  ),
  tangkis: (
    <g>
      {/* dua lengan bersilang + perisai */}
      <path d="M9 9 Q24 1 39 9" {...W} strokeWidth="3" opacity="0.7" />
      <path d="M12 42 L34 16" {...W} strokeWidth="8" />
      <path d="M36 42 L14 16" stroke="#000" strokeOpacity="0.2" strokeWidth="12" strokeLinecap="round" />
      <path d="M36 42 L14 16" {...W} strokeWidth="8" />
      <circle cx="35" cy="14" r="5.5" fill="#fff" />
      <circle cx="13" cy="14" r="5.5" fill="#fff" />
    </g>
  ),
};
