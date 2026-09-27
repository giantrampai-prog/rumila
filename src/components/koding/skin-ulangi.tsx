'use client';

// Gambar game Coding Agam · Ulangi = AGAM PELUKIS. Kanvas dilihat dari atas; Agam memegang alat gambar di titik
// pusatnya dan meninggalkan goresan (seperti kura-kura LOGO). 10 tema kanvas (satu per Level): permukaan nyata
// (kertas, papan tulis, kaca berembun, piring keramik, tembok, aspal, kain batik, layar neon, langit malam, kanvas
// linen), benda-benda di pinggir kanvas, dan goresan khas tiap alat (krayon, kapur, jari, kuas, cat semprot,
// canting, pena cahaya, kembang api, kuas emas). Semua id berawalan ku-, semua angka tetap (tanpa Math.random).

import type { ReactNode } from 'react';
import type { CanvasTheme } from './skin-types';

/* ============ bahan bersama ============ */

/** bulatkan koordinat hitungan supaya server & klien menulis angka yang sama */
const R = (v: number) => +v.toFixed(1);

/** angka semu-acak tetap 0..1 */
const hs = (i: number, k = 0) => ((((i + 1) * 73856093) ^ ((k + 7) * 19349663)) >>> 0) % 1000 / 1000;

type P = [number, number];

/** pecah path d (M/L/H/V/Z, koordinat mutlak) menjadi daftar sub-path berisi titik */
function subpaths(d: string): P[][] {
  const tok = d.match(/[MLHVZmlhvz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const out: P[][] = [];
  let cmd = 'M';
  let cur: P = [0, 0];
  let i = 0;
  const push = (p: P) => {
    if (!out.length) out.push([]);
    out[out.length - 1].push(p);
  };
  while (i < tok.length) {
    const t = tok[i];
    if (/[a-z]/i.test(t)) {
      cmd = t.toUpperCase();
      i++;
      if (cmd === 'Z' && out.length && out[out.length - 1].length) push(out[out.length - 1][0]);
      continue;
    }
    if (cmd === 'M') {
      cur = [+tok[i], +tok[i + 1]];
      out.push([cur]);
      cmd = 'L';
      i += 2;
    } else if (cmd === 'L') {
      cur = [+tok[i], +tok[i + 1]];
      push(cur);
      i += 2;
    } else if (cmd === 'H') {
      cur = [+tok[i], cur[1]];
      push(cur);
      i++;
    } else if (cmd === 'V') {
      cur = [cur[0], +tok[i]];
      push(cur);
      i++;
    } else i++;
  }
  return out;
}

/** titik-titik berjarak tetap di sepanjang goresan; nx, ny = arah tegak lurus garis */
function along(d: string, step: number, fn: (x: number, y: number, nx: number, ny: number, i: number) => ReactNode): ReactNode[] {
  const res: ReactNode[] = [];
  let i = 0;
  for (const sp of subpaths(d))
    for (let s = 1; s < sp.length; s++) {
      const [x0, y0] = sp[s - 1],
        [x1, y1] = sp[s];
      const len = Math.hypot(x1 - x0, y1 - y0);
      if (len < 1) continue;
      const n = Math.max(1, Math.round(len / step));
      for (let j = 0; j < n; j++) {
        const t = (j + 0.5) / n;
        res.push(fn(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, -(y1 - y0) / len, (x1 - x0) / len, i++));
      }
    }
  return res;
}

/**
 * Filter pada garis lurus mendatar/tegak gagal (kotak batasnya setebal 0), jadi setiap goresan berfilter dibungkus
 * bersama persegi tak terlihat seluas goresan + pad. Wilayah filter pun kecil (hemat untuk feTurbulence).
 */
function fx(d: string, filter: string, pad: number, children: ReactNode) {
  const ps = subpaths(d).flat();
  if (!ps.length) return null;
  const xs = ps.map((p) => p[0]),
    ys = ps.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad,
    y0 = Math.min(...ys) - pad;
  return (
    <g filter={`url(#${filter})`}>
      <rect x={R(x0)} y={R(y0)} width={R(Math.max(...xs) + pad - x0)} height={R(Math.max(...ys) + pad - y0)} fill="none" />
      {children}
    </g>
  );
}

/** sifat garis bulat (ujung & sudut) */
const LN = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** filter butiran: noise berwarna tetap dengan alfa = a·noise + b (untuk serat kertas, debu kapur, aspal…) */
const grain = (id: string, freq: number, rgb: [number, number, number], a: number, b: number, oct = 2, seed = 1) => (
  <filter id={id} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={oct} seed={seed} stitchTiles="stitch" />
    <feColorMatrix type="matrix" values={`0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  0 0 0 ${a} ${b}`} />
  </filter>
);

/** filter kabur sederhana (kotak filter diperbesar) */
const blur = (id: string, sd: number) => (
  <filter id={id} x="-0.5" y="-0.5" width="2" height="2">
    <feGaussianBlur stdDeviation={sd} />
  </filter>
);

/** filter "kapur": goresan dilubangi noise (butiran) lalu digeser sedikit supaya tepinya kasar */
const chalkFilter = (id: string, freq: number, a: number, b: number, scale: number, seed: number) => (
  <filter id={id} x="-0.1" y="-0.1" width="1.2" height="1.2" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed={seed} result="n" />
    <feColorMatrix in="n" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${a} ${b}`} result="m" />
    <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
    <feDisplacementMap in="c" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

/** bayangan lembut di bawah benda */
const shade = (cx: number, cy: number, rx: number, ry: number, op = 0.2) => <ellipse cx={R(cx)} cy={R(cy)} rx={R(rx)} ry={R(ry)} fill="#000" opacity={op} />;

/** pita perekat di pojok */
const tape = (x: number, y: number, rot: number, key: string) => (
  <g key={key} transform={`translate(${R(x)} ${R(y)}) rotate(${rot})`}>
    <rect x="-34" y="-11" width="68" height="22" fill="#000" opacity="0.07" transform="translate(1.5 2)" />
    <path d="M-34 -11 L34 -11 L32 -7 L35 -3 L32 1 L35 5 L33 11 L-34 11 L-32 6 L-35 2 L-32 -2 L-35 -6 Z" fill="#f4e9bf" opacity="0.78" />
    <path d="M-30 -7 L30 -7" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
    <path d="M-22 4 L-8 4 M6 2 L24 2" stroke="#c9b77a" strokeOpacity="0.35" strokeWidth="1.2" />
  </g>
);

/** krayon rebah (panjang 104), berujung runcing di kanan */
const crayon = (x: number, y: number, rot: number, c: string, dark: string, key: string) => (
  <g key={key} transform={`translate(${R(x)} ${R(y)}) rotate(${rot})`}>
    {shade(50, 11, 54, 6, 0.18)}
    <rect x="0" y="-8" width="80" height="16" rx="3" fill={c} />
    <path d="M80 -8 L98 -2 Q102 0 98 2 L80 8 Z" fill={c} />
    <path d="M92 -3.5 L98 -2 Q102 0 98 2 L92 3.5 Z" fill={dark} />
    {/* kertas pembungkus bermerek */}
    <rect x="12" y="-8.4" width="58" height="16.8" rx="1" fill={c} />
    <rect x="12" y="-8.4" width="58" height="16.8" rx="1" fill="#fff" opacity="0.22" />
    <path d="M16 -8 V8 M66 -8 V8" stroke={dark} strokeWidth="2.4" />
    <rect x="26" y="-3.4" width="30" height="6.8" rx="3.4" fill="#fff" opacity="0.85" />
    <path d="M30 0 H52" stroke={dark} strokeWidth="1.8" strokeDasharray="4 2" />
    <path d="M2 -5 H94" stroke="#fff" strokeOpacity="0.4" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M2 6 H90" stroke="#000" strokeOpacity="0.16" strokeWidth="2.4" strokeLinecap="round" />
  </g>
);

/** batang kapur kecil (panjang 40) */
const chalkStick = (x: number, y: number, rot: number, c: string, key: string, len = 40) => (
  <g key={key} transform={`translate(${R(x)} ${R(y)}) rotate(${rot})`}>
    {shade(len / 2, 6, len / 2 + 2, 3, 0.2)}
    <rect x="0" y="-5" width={len} height="10" rx="5" fill={c} />
    <rect x="2" y="-4" width={len - 6} height="3" rx="1.5" fill="#fff" opacity="0.55" />
    <ellipse cx={len - 2} cy="0" rx="2.4" ry="4.4" fill="#000" opacity="0.1" />
  </g>
);

/** bentuk gumpalan tak beraturan (lubang plester, noda) */
function blob(cx: number, cy: number, r: number, k: number) {
  const n = 10;
  const p: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.7 + hs(i, k) * 0.45);
    p.push(`${i ? 'L' : 'M'}${R(cx + Math.cos(a) * rr)} ${R(cy + Math.sin(a) * rr * 0.8)}`);
  }
  return p.join(' ') + 'Z';
}

/* ============ 1. Kertas Gambar · krayon ============ */

const kertas: CanvasTheme = {
  name: 'Kertas Gambar',
  bg: '#f3ecdc',
  ink: '#5a4632',
  frame: '#fffdf6',
  dot: '#cbbfa6',
  tool: 'krayon',
  guide: { color: '#8497b8', width: 6, dash: '2 14', opacity: 0.85 },
  defs: (
    <>
      {grain('ku-paper-grain', 0.55, [0.52, 0.45, 0.33], 0.7, -0.3, 3, 4)}
      <radialGradient id="ku-paper-light" cx="0.45" cy="0.4" r="0.8">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
        <stop offset="0.7" stopColor="#fbf6e9" stopOpacity="0" />
        <stop offset="1" stopColor="#e9dcc0" stopOpacity="0.55" />
      </radialGradient>
      {/* serat kertas yang mengintip di sela lilin krayon */}
      <pattern id="ku-paper-tooth" width="9" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
        <circle cx="2" cy="2" r="0.9" fill="#fffdf6" />
        <circle cx="6.5" cy="5" r="1.1" fill="#fffdf6" />
        <rect x="4" y="0.6" width="3" height="0.8" fill="#fffdf6" opacity="0.8" />
      </pattern>
      <filter id="ku-crayon" x="-0.1" y="-0.1" width="1.2" height="1.2">
        <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves="2" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </>
  ),
  surface: (w, h) => (
    <g>
      <rect width={w} height={h} fill="#fffcf3" />
      <rect width={w} height={h} fill="url(#ku-paper-light)" />
      <rect width={w} height={h} fill="#000" filter="url(#ku-paper-grain)" />
      {/* bekas lipatan tipis & noda penghapus */}
      <path d={`M${R(w * 0.62)} 0 L${R(w * 0.66)} ${h}`} stroke="#d9ceb5" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d={`M${R(w * 0.62) + 2} 0 L${R(w * 0.66) + 2} ${h}`} stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" />
      <ellipse cx={R(w * 0.18)} cy={R(h * 0.82)} rx="34" ry="12" fill="#b9a98a" opacity="0.07" transform={`rotate(-14 ${R(w * 0.18)} ${R(h * 0.82)})`} />
    </g>
  ),
  props: (w, h) => (
    <g>
      {tape(4, 4, -38, 't1')}
      {tape(w - 4, 4, 38, 't2')}
      {tape(4, h - 4, 38, 't3')}
      {tape(w - 4, h - 4, -38, 't4')}
      {/* krayon berserakan di bawah kertas */}
      {crayon(12, h + 26, -4, '#e8412c', '#a8261a', 'c1')}
      {crayon(R(w * 0.34), h + 38, 3, '#2f7de1', '#1b4f9c', 'c2')}
      {crayon(R(w * 0.62), h + 24, -7, '#f7c21a', '#b88600', 'c3')}
      {crayon(-54, R(h * 0.3), 84, '#3bb54a', '#1f7a2c', 'c4')}
      {/* penghapus */}
      <g transform={`translate(${w + 30} ${R(h * 0.24)}) rotate(-72)`}>
        {shade(2, 6, 32, 14, 0.18)}
        <rect x="-30" y="-13" width="60" height="26" rx="6" fill="#f7a7b8" />
        <rect x="-30" y="-13" width="26" height="26" rx="6" fill="#6fa7e8" />
        <rect x="-10" y="-13" width="6" height="26" fill="#6fa7e8" />
        <rect x="-28" y="-11" width="56" height="7" rx="3.5" fill="#fff" opacity="0.35" />
        <path d="M26 -8 Q30 0 26 8" stroke="#d98a9c" strokeWidth="2" fill="none" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={w + 18 + i * 7} cy={R(h * 0.24 + 44 + hs(i, 3) * 10)} rx="2.4" ry="1.4" fill="#e79aab" opacity="0.8" />
      ))}
    </g>
  ),
  stroke: (d) =>
    fx(
      d,
      'ku-crayon',
      24,
      <>
        <path d={d} {...LN} stroke="#d93a26" strokeWidth="13" opacity="0.92" />
        <path d={d} {...LN} stroke="#ff6a4c" strokeWidth="7" strokeDasharray="14 5 3 7" opacity="0.55" />
        <path d={d} {...LN} stroke="url(#ku-paper-tooth)" strokeWidth="13" />
      </>,
    ),
};

/* ============ 2. Papan Tulis · kapur ============ */

const papan: CanvasTheme = {
  name: 'Papan Tulis',
  bg: '#1d362b',
  ink: '#eaf5e4',
  dark: true,
  frame: '#7a5230',
  dot: 'rgba(255,255,255,0.22)',
  tool: 'kapur',
  guide: { color: '#e9f1c8', width: 5, dash: '3 13', opacity: 0.5 },
  defs: (
    <>
      <linearGradient id="ku-board" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#386b52" />
        <stop offset="0.5" stopColor="#2c5a44" />
        <stop offset="1" stopColor="#224a37" />
      </linearGradient>
      {grain('ku-board-grain', 0.7, [0.9, 1, 0.92], 1.1, -0.48, 2, 7)}
      {blur('ku-smudge', 9)}
      {chalkFilter('ku-chalk', 0.62, -2.6, 1.9, 3, 5)}
      {blur('ku-dust', 3)}
      <linearGradient id="ku-wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a8744a" />
        <stop offset="0.5" stopColor="#8a5a34" />
        <stop offset="1" stopColor="#6b4224" />
      </linearGradient>
      <pattern id="ku-woodgrain" width="120" height="14" patternUnits="userSpaceOnUse">
        <path d="M0 4 Q30 2 60 5 T120 4 M0 10 Q40 12 80 9 T120 10" stroke="#4a2c14" strokeOpacity="0.28" strokeWidth="1.2" fill="none" />
      </pattern>
      <linearGradient id="ku-felt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8d8f96" />
        <stop offset="1" stopColor="#55585f" />
      </linearGradient>
    </>
  ),
  surface: (w, h) => (
    <g>
      <rect width={w} height={h} fill="url(#ku-board)" />
      <rect width={w} height={h} fill="#000" filter="url(#ku-board-grain)" />
      {/* bekas hapusan: sapuan lengkung debu kapur */}
      <g filter="url(#ku-smudge)" fill="none" stroke="#e8f3e6" strokeLinecap="round">
        <path d={`M${R(w * 0.08)} ${R(h * 0.3)} Q${R(w * 0.3)} ${R(h * 0.12)} ${R(w * 0.55)} ${R(h * 0.28)}`} strokeWidth="46" opacity="0.07" />
        <path d={`M${R(w * 0.45)} ${R(h * 0.78)} Q${R(w * 0.7)} ${R(h * 0.62)} ${R(w * 0.94)} ${R(h * 0.8)}`} strokeWidth="40" opacity="0.06" />
        <path d={`M${R(w * 0.1)} ${R(h * 0.7)} Q${R(w * 0.22)} ${R(h * 0.6)} ${R(w * 0.34)} ${R(h * 0.72)}`} strokeWidth="30" opacity="0.05" />
      </g>
      {/* sisa tulisan lama yang samar */}
      <text x={R(w - 24)} y="46" textAnchor="end" fontSize="34" fontWeight="700" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" fill="#fff" opacity="0.07">
        1 + 1 = 2
      </text>
      <text x="20" y={R(h - 22)} fontSize="30" fontWeight="700" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" fill="#fff" opacity="0.06">
        A B C
      </text>
    </g>
  ),
  props: (w, h) => (
    <g>
      {/* bingkai kayu */}
      <path d={`M-26 -26 H${w + 26} V${h + 26} H-26 Z M0 0 V${h} H${w} V0 Z`} fill="url(#ku-wood)" fillRule="evenodd" />
      <path d={`M-26 -26 H${w + 26} V${h + 26} H-26 Z M0 0 V${h} H${w} V0 Z`} fill="url(#ku-woodgrain)" fillRule="evenodd" />
      <rect x="-2" y="-2" width={w + 4} height={h + 4} fill="none" stroke="#3d2412" strokeOpacity="0.55" strokeWidth="4" />
      <rect x="-25" y="-25" width={w + 50} height={h + 50} fill="none" stroke="#c99a6c" strokeOpacity="0.5" strokeWidth="2" />
      {/* rak kapur */}
      <rect x="-44" y={h + 22} width={w + 88} height="12" rx="3" fill="#b88558" />
      <rect x="-44" y={h + 34} width={w + 88} height="18" rx="3" fill="url(#ku-wood)" />
      <rect x="-44" y={h + 34} width={w + 88} height="18" rx="3" fill="url(#ku-woodgrain)" />
      <ellipse cx={R(w * 0.3)} cy={h + 28} rx="60" ry="4" fill="#f2f5ee" opacity="0.35" filter="url(#ku-dust)" />
      {chalkStick(R(w * 0.18), h + 26, -3, '#fbfbf5', 'k1')}
      {chalkStick(R(w * 0.18) + 50, h + 27, 6, '#fff2a0', 'k2', 28)}
      {chalkStick(R(w * 0.18) + 86, h + 26, -1, '#ffc0d6', 'k3', 34)}
      {/* penghapus papan */}
      <g transform={`translate(${R(w * 0.7)} ${h + 12})`}>
        {shade(40, 16, 46, 5, 0.3)}
        <rect x="0" y="0" width="84" height="18" rx="4" fill="#c98f58" />
        <rect x="2" y="2" width="80" height="6" rx="3" fill="#e3b47f" />
        <rect x="0" y="14" width="84" height="8" rx="2" fill="url(#ku-felt)" />
        <path d="M4 19 H80" stroke="#f0f2ee" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 3" />
      </g>
    </g>
  ),
  stroke: (d) => (
    <g>
      {fx(d, 'ku-dust', 30, <path d={d} {...LN} stroke="#eef6ea" strokeWidth="18" opacity="0.14" />)}
      {fx(d, 'ku-chalk', 20, <path d={d} {...LN} stroke="#fbfdf6" strokeWidth="11" />)}
    </g>
  ),
};

/* ============ 3. Jendela Berembun · jari ============ */

const jendela: CanvasTheme = {
  name: 'Jendela Berembun',
  bg: '#dde7ee',
  ink: '#2c4a63',
  frame: '#f7f7f4',
  dot: 'rgba(70,100,130,0.35)',
  tool: 'jari',
  guide: { color: '#4f6f91', width: 5, dash: '2 12', opacity: 0.7 },
  defs: (
    <>
      <linearGradient id="ku-out-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ecbf2" />
        <stop offset="0.55" stopColor="#cfe8f5" />
        <stop offset="1" stopColor="#f3e2bf" />
      </linearGradient>
      {blur('ku-far', 16)}
      {grain('ku-fog', 0.09, [1, 1, 1], 1.4, -0.35, 3, 12)}
      <radialGradient id="ku-drop" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#dfeef6" stopOpacity="0.5" />
        <stop offset="1" stopColor="#7d9cb3" stopOpacity="0.55" />
      </radialGradient>
      {/* pemandangan tajam di balik bekas usapan (langit di atas, pepohonan di bawah) */}
      <linearGradient id="ku-wipe" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="700">
        <stop offset="0" stopColor="#5fb0ea" />
        <stop offset="0.4" stopColor="#9fd2f0" />
        <stop offset="0.5" stopColor="#8cc47a" />
        <stop offset="0.7" stopColor="#4f9b47" />
        <stop offset="1" stopColor="#2f6f33" />
      </linearGradient>
      {blur('ku-soft', 1.4)}
      <linearGradient id="ku-sash" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d6dde2" />
      </linearGradient>
    </>
  ),
  surface: (w, h) => {
    const drops = Math.min(260, Math.round((w * h) / 1500));
    return (
      <g>
        {/* dunia luar yang kabur */}
        <g filter="url(#ku-far)">
          <rect x="-40" y="-40" width={w + 80} height={h + 80} fill="url(#ku-out-sky)" />
          <circle cx={R(w * 0.8)} cy="80" r="46" fill="#fff4c2" />
          <rect x={R(w * 0.12)} y="300" width="110" height="140" fill="#e98b5d" />
          <path d={`M${R(w * 0.12) - 12} 304 L${R(w * 0.12) + 55} 250 L${R(w * 0.12) + 122} 304 Z`} fill="#b8483b" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle key={i} cx={R((w / 6) * i + hs(i, 1) * 40)} cy={R(380 + hs(i, 2) * 50)} r={R(70 + hs(i, 3) * 40)} fill={i % 2 ? '#5aa44e' : '#3f8a3d'} />
          ))}
          <rect x="-40" y="470" width={w + 80} height={Math.max(0, h - 430)} fill="#4d8b3f" />
        </g>
        {/* embun: lapisan putih susu + gumpalan kabut */}
        <rect width={w} height={h} fill="#eef3f6" opacity="0.66" />
        <rect width={w} height={h} fill="#000" filter="url(#ku-fog)" opacity="0.8" />
        {/* butir-butir air */}
        {Array.from({ length: drops }, (_, i) => {
          const x = R(hs(i, 11) * w),
            y = R(hs(i, 12) * h),
            r = R(1 + hs(i, 13) * hs(i, 14) * 5);
          return (
            <g key={i}>
              <circle cx={x} cy={R(y + r * 0.3)} r={r} fill="#5d7c93" opacity="0.18" />
              <circle cx={x} cy={y} r={r} fill="url(#ku-drop)" />
            </g>
          );
        })}
        {/* tetesan yang meluncur turun meninggalkan jejak bening */}
        {[0.22, 0.51, 0.86].map((f, i) => {
          const x = R(w * f),
            y0 = R(h * (0.08 + hs(i, 20) * 0.3)),
            y1 = R(y0 + 60 + hs(i, 21) * 90);
          return (
            <g key={`t${i}`}>
              <path d={`M${x} ${y0} Q${R(x + 3)} ${R((y0 + y1) / 2)} ${x} ${y1}`} stroke="#b9d9ec" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
              <ellipse cx={x} cy={R(y1 + 3)} rx="4" ry="5" fill="url(#ku-drop)" />
            </g>
          );
        })}
      </g>
    );
  },
  props: (w, h) => (
    <g>
      {/* kusen jendela putih */}
      <path d={`M-34 -34 H${w + 34} V${h + 34} H-34 Z M0 0 V${h} H${w} V0 Z`} fill="url(#ku-sash)" fillRule="evenodd" />
      <rect x="-3" y="-3" width={w + 6} height={h + 6} fill="none" stroke="#9aa7b0" strokeWidth="5" />
      <rect x="-33" y="-33" width={w + 66} height={h + 66} fill="none" stroke="#c2ccd3" strokeWidth="2" />
      {/* ambang jendela & pot tanaman kecil */}
      <rect x="-56" y={h + 26} width={w + 112} height="26" rx="4" fill="#eef1f3" />
      <rect x="-56" y={h + 44} width={w + 112} height="8" rx="3" fill="#b9c3ca" />
      <g transform={`translate(${w - 40} ${h + 30})`}>
        <path d="M-15 -2 L15 -2 L11 18 L-11 18 Z" fill="#d9774a" />
        <rect x="-17" y="-6" width="34" height="7" rx="2" fill="#e88c5d" />
        <ellipse cx="-6" cy="-14" rx="6" ry="12" fill="#5fae4f" transform="rotate(-20 -6 -14)" />
        <ellipse cx="6" cy="-16" rx="6" ry="13" fill="#4c9a42" transform="rotate(18 6 -16)" />
        <ellipse cx="0" cy="-20" rx="5" ry="12" fill="#6fc05c" />
      </g>
      {/* gorden di kiri dengan lipatan */}
      <g className="ka-sway" style={{ animationDuration: '6s' }}>
        <path d={`M-60 -40 H-14 Q-22 ${R(h * 0.4)} -30 ${R(h * 0.62)} Q-20 ${R(h * 0.8)} -16 ${h + 20} H-60 Z`} fill="#d9716e" />
        {[-54, -44, -34, -24].map((x, i) => (
          <path key={x} d={`M${x} -40 Q${x - 4} ${R(h * 0.4)} ${x - 10 + i} ${R(h * 0.62)} Q${x - 4} ${R(h * 0.8)} ${x} ${h + 20}`} stroke={i % 2 ? '#f4a9a5' : '#a84b49'} strokeOpacity="0.55" strokeWidth="4" fill="none" />
        ))}
        <rect x="-60" y={R(h * 0.6)} width="36" height="8" rx="4" fill="#f3d27a" />
      </g>
      {/* gerendel kuningan */}
      <g transform={`translate(${w + 17} ${R(h / 2)})`}>
        <rect x="-8" y="-22" width="16" height="44" rx="4" fill="#caa24a" />
        <rect x="-3" y="-10" width="18" height="8" rx="4" fill="#e6c46a" />
        <circle cx="0" cy="-15" r="2" fill="#8a6a1e" />
        <circle cx="0" cy="15" r="2" fill="#8a6a1e" />
      </g>
    </g>
  ),
  stroke: (d) => (
    <g>
      {/* tepi usapan: embun yang terdorong menumpuk */}
      {fx(d, 'ku-soft', 30, <path d={d} {...LN} stroke="#f7fafc" strokeWidth="31" opacity="0.6" />)}
      {/* kaca bening: pemandangan luar lebih tajam */}
      {fx(d, 'ku-soft', 30, <path d={d} {...LN} stroke="url(#ku-wipe)" strokeWidth="24" opacity="0.9" />)}
      <path d={d} {...LN} stroke="#ffffff" strokeWidth="2.5" opacity="0.35" strokeDasharray="30 18" />
      {along(d, 17, (x, y, nx, ny, i) => {
        const s = i % 2 ? 1 : -1,
          off = 13 + hs(i, 31) * 2.5;
        return <circle key={i} cx={R(x + nx * off * s)} cy={R(y + ny * off * s)} r={R(1.4 + hs(i, 32) * 1.6)} fill="url(#ku-drop)" />;
      })}
    </g>
  ),
};

/* ============ 4. Piring Keramik · kuas biru ============ */

const piring: CanvasTheme = {
  name: 'Piring Keramik',
  bg: '#e5ecf5',
  ink: '#1f3d73',
  frame: '#ffffff',
  dot: '#c3cddc',
  tool: 'kuas',
  guide: { color: '#7488ad', width: 5, dash: '2 12', opacity: 0.8 },
  defs: (
    <>
      <radialGradient id="ku-glaze" cx="0.45" cy="0.4" r="0.75">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.75" stopColor="#f4f6f9" />
        <stop offset="1" stopColor="#dde4ee" />
      </radialGradient>
      {blur('ku-gloss', 10)}
      {blur('ku-rimblur', 3)}
      {blur('ku-wash', 1.6)}
      <radialGradient id="ku-pot" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d3dae4" />
      </radialGradient>
    </>
  ),
  surface: (w, h) => {
    const flower = (x: number, y: number, k: string) => (
      <g key={k} transform={`translate(${R(x)} ${R(y)})`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx="0" cy="-5" rx="2.6" ry="5" fill="#2a55a8" transform={`rotate(${a})`} />
        ))}
        <circle r="2.4" fill="#fff" stroke="#2a55a8" strokeWidth="1.2" />
      </g>
    );
    return (
      <g>
        {/* ubin keramik mengilap */}
        <rect width={w} height={h} fill="url(#ku-glaze)" />
        {/* lekuk tepi piring: bayangan lembut menuju cekungan */}
        <rect x="27" y="27" width={w - 54} height={h - 54} rx="30" fill="none" stroke="#b9c5d6" strokeWidth="7" opacity="0.55" filter="url(#ku-rimblur)" />
        <rect x="30" y="30" width={w - 60} height={h - 60} rx="28" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
        {/* pita biru kobalt di tepi */}
        <rect x="7" y="7" width={w - 14} height={h - 14} rx="18" fill="none" stroke="#2a55a8" strokeWidth="4" />
        <rect x="14" y="14" width={w - 28} height={h - 28} rx="14" fill="none" stroke="#2a55a8" strokeWidth="5" strokeDasharray="0 13" strokeLinecap="round" />
        <rect x="20" y="20" width={w - 40} height={h - 40} rx="12" fill="none" stroke="#3a68bf" strokeWidth="1.4" />
        {flower(19, 19, 'f1')}
        {flower(w - 19, 19, 'f2')}
        {flower(19, h - 19, 'f3')}
        {flower(w - 19, h - 19, 'f4')}
        {/* kilap glasir */}
        <ellipse cx={R(w * 0.28)} cy={R(h * 0.2)} rx={R(w * 0.16)} ry={R(h * 0.05)} fill="#fff" opacity="0.8" filter="url(#ku-gloss)" transform={`rotate(-24 ${R(w * 0.28)} ${R(h * 0.2)})`} />
        <path d={`M${R(w * 0.7)} ${R(h * 0.86)} Q${R(w * 0.8)} ${R(h * 0.82)} ${R(w * 0.86)} ${R(h * 0.72)}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
      </g>
    );
  },
  props: (w, h) => {
    const pot = (x: number, y: number, paint: string, deep: string, k: string) => (
      <g key={k} transform={`translate(${R(x)} ${R(y)})`}>
        {shade(4, 5, 25, 22, 0.16)}
        <circle r="23" fill="url(#ku-pot)" stroke="#b8c3d3" strokeWidth="1.5" />
        <circle r="16" fill={deep} />
        <circle r="14" fill={paint} />
        <ellipse cx="-5" cy="-6" rx="5" ry="3" fill="#fff" opacity="0.45" />
        <path d="M-19 -9 A20 20 0 0 1 -6 -20" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
    return (
      <g>
        {pot(-30, -30, '#2d5fc0', '#173f8a', 'p1')}
        {pot(w + 30, -24, '#e0a62a', '#a8741a', 'p2')}
        {pot(-32, h + 28, '#3a9a6e', '#236b4a', 'p3')}
        {/* kuas lukis bersandar di kanan */}
        <g transform={`translate(${w + 36} ${R(h * 0.3)}) rotate(8)`}>
          {shade(4, 90, 8, 80, 0.14)}
          <rect x="-4" y="30" width="8" height="150" rx="4" fill="#1f3a6b" />
          <rect x="-3" y="34" width="2.5" height="140" rx="1.2" fill="#fff" opacity="0.3" />
          <rect x="-5" y="10" width="10" height="24" rx="2" fill="#c7ccd4" />
          <path d="M-5 11 Q-6 -6 0 -18 Q6 -6 5 11 Z" fill="#2a55a8" />
          <path d="M-2 6 Q-2 -6 0 -14" stroke="#7fa2e6" strokeWidth="1.4" fill="none" />
        </g>
        {/* tetesan cat di meja */}
        <circle cx={R(w * 0.4)} cy={h + 30} r="5" fill="#2a55a8" opacity="0.8" />
        <circle cx={R(w * 0.4) + 12} cy={h + 38} r="2.5" fill="#2a55a8" opacity="0.7" />
      </g>
    );
  },
  stroke: (d) => (
    <g>
      {fx(d, 'ku-wash', 20, <path d={d} {...LN} stroke="#3b6fd0" strokeWidth="15" opacity="0.45" />)}
      <path d={d} {...LN} stroke="#1a4396" strokeWidth="9" opacity="0.92" />
      <path d={d} {...LN} stroke="#0f2e72" strokeWidth="9" opacity="0.35" strokeDasharray="40 22 12 30" />
      <path d={d} {...LN} stroke="#8fb3f2" strokeWidth="2.4" opacity="0.55" transform="translate(-2 -2)" />
    </g>
  ),
};

/* ============ 5. Tembok Mural · cat semprot ============ */

const tembok: CanvasTheme = {
  name: 'Tembok Mural',
  bg: '#efe4d4',
  ink: '#6a3b22',
  frame: '#d9c7b0',
  dot: 'rgba(90,70,50,0.3)',
  tool: 'semprotan',
  guide: { color: '#6b5a48', width: 6, dash: '3 12', opacity: 0.6 },
  defs: (
    <>
      <pattern id="ku-brick" width="100" height="50" patternUnits="userSpaceOnUse">
        <rect width="100" height="50" fill="#c9b8a4" />
        <rect x="2" y="2" width="96" height="21" rx="2" fill="#b4543a" />
        <rect x="-48" y="27" width="96" height="21" rx="2" fill="#a24a32" />
        <rect x="52" y="27" width="96" height="21" rx="2" fill="#bd6245" />
        <path d="M4 5 H94 M-46 30 H46 M54 30 H146" stroke="#fff" strokeOpacity="0.14" strokeWidth="2" />
      </pattern>
      {grain('ku-plaster-grain', 0.45, [0.4, 0.33, 0.25], 0.75, -0.3, 3, 21)}
      <linearGradient id="ku-plaster" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f3ebde" />
        <stop offset="1" stopColor="#e6d8c3" />
      </linearGradient>
      {blur('ku-mist', 7)}
      {/* kabut cat semprot berbintik */}
      <filter id="ku-spray" x="-0.2" y="-0.2" width="1.4" height="1.4" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="31" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 5 -2.2" result="m" />
        <feComposite in="b" in2="m" operator="in" />
      </filter>
      {blur('ku-sprayedge', 1)}
      <linearGradient id="ku-can" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8f969f" />
        <stop offset="0.35" stopColor="#e4e8ec" />
        <stop offset="0.7" stopColor="#b5bcc4" />
        <stop offset="1" stopColor="#7c838c" />
      </linearGradient>
    </>
  ),
  surface: (w, h) => {
    const holes = [
      [w * 0.1, h * 0.84, 40, 1],
      [w * 0.88, h * 0.12, 34, 2],
      [w * 0.72, h * 0.93, 30, 3],
      [w * 0.06, h * 0.18, 22, 4],
    ] as const;
    const hp = holes.map(([x, y, r, k]) => blob(x, y, r, k)).join(' ');
    return (
      <g>
        <rect width={w} height={h} fill="url(#ku-brick)" />
        {/* plester dengan beberapa bagian mengelupas (bata terlihat) */}
        <path d={`M0 0 H${w} V${h} H0 Z ${hp}`} fill="#000" opacity="0.25" fillRule="evenodd" transform="translate(2 3)" />
        <path d={`M0 0 H${w} V${h} H0 Z ${hp}`} fill="url(#ku-plaster)" fillRule="evenodd" />
        <path d={hp} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" transform="translate(-1 -1)" />
        <rect width={w} height={h} fill="#000" filter="url(#ku-plaster-grain)" />
        {/* noda rembesan hujan */}
        <path d={`M${R(w * 0.42)} 0 q6 40 -2 80 q-4 30 4 60`} stroke="#b9a386" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.12" filter="url(#ku-mist)" />
        <path d={`M${R(w * 0.3)} ${h} l14 -26 l10 8 l12 -30`} stroke="#9e8a70" strokeWidth="1.4" fill="none" opacity="0.5" />
      </g>
    );
  },
  props: (w, h) => {
    const can = (x: number, y: number, c: string, k: string, label: string) => (
      <g key={k} transform={`translate(${R(x)} ${R(y)})`}>
        {shade(0, 34, 30, 7, 0.22)}
        <rect x="-26" y="-4" width="52" height="38" fill="url(#ku-can)" />
        <rect x="-26" y="6" width="52" height="18" fill={c} />
        <text x="0" y="19" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily="system-ui, sans-serif">
          {label}
        </text>
        <ellipse cx="0" cy="-4" rx="26" ry="8" fill="#9aa1a9" />
        <ellipse cx="0" cy="-4" rx="22" ry="6" fill={c} />
        <ellipse cx="-7" cy="-6" rx="7" ry="2" fill="#fff" opacity="0.35" />
        <path d="M-18 -2 q-2 12 1 18 M12 0 q2 8 -1 14" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    );
    return (
      <g>
        {can(20, h + 20, '#ff3d7f', 'm1', 'CAT')}
        {can(88, h + 26, '#2ab0e8', 'm2', 'CAT')}
        {can(w - 40, h + 22, '#f6c31c', 'm3', 'CAT')}
        {/* kaleng semprot */}
        <g transform={`translate(${w + 34} ${R(h * 0.36)}) rotate(12)`}>
          {shade(4, 60, 16, 6, 0.2)}
          <rect x="-13" y="-30" width="26" height="86" rx="7" fill="#ff3d7f" />
          <rect x="-13" y="-4" width="26" height="30" fill="#fff" opacity="0.85" />
          <path d="M-9 4 l6 8 l6 -10 l6 12" stroke="#ff3d7f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="-9" y="-28" width="5" height="80" rx="2.5" fill="#fff" opacity="0.35" />
          <path d="M-11 -30 Q0 -44 11 -30 Z" fill="url(#ku-can)" />
          <rect x="-4" y="-46" width="8" height="10" rx="2" fill="#2b2f36" />
          <circle cx="3" cy="-42" r="1.4" fill="#aaa" />
        </g>
        {/* kuas pipih di atas */}
        <g transform={`translate(${R(w * 0.3)} -34) rotate(-6)`}>
          {shade(60, 10, 70, 5, 0.16)}
          <rect x="30" y="-5" width="96" height="10" rx="5" fill="#b87a3e" />
          <rect x="16" y="-9" width="18" height="18" rx="2" fill="url(#ku-can)" />
          <path d="M16 -9 L-6 -8 Q-10 0 -6 8 L16 9 Z" fill="#2ab0e8" />
          <path d="M34 -3 H120" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
        </g>
      </g>
    );
  },
  stroke: (d) => (
    <g>
      {fx(d, 'ku-spray', 40, <path d={d} {...LN} stroke="#ff2e74" strokeWidth="34" />)}
      {fx(d, 'ku-mist', 40, <path d={d} {...LN} stroke="#ff3d7f" strokeWidth="30" opacity="0.28" />)}
      {fx(d, 'ku-sprayedge', 20, <path d={d} {...LN} stroke="#f0226a" strokeWidth="17" />)}
      <path d={d} {...LN} stroke="#ff9cc0" strokeWidth="5" opacity="0.45" />
    </g>
  ),
};

/* ============ 6. Lantai Kapur · kapur trotoar ============ */

const lantai: CanvasTheme = {
  name: 'Lantai Kapur',
  bg: '#e4e6e2',
  ink: '#3a3f47',
  frame: '#5b5f66',
  dot: 'rgba(255,255,255,0.28)',
  tool: 'kapur',
  guide: { color: '#ffffff', width: 5, dash: '3 13', opacity: 0.55 },
  defs: (
    <>
      <linearGradient id="ku-asphalt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7f848b" />
        <stop offset="1" stopColor="#686c73" />
      </linearGradient>
      {grain('ku-asph-dark', 0.8, [0.12, 0.12, 0.14], 2.2, -1.05, 2, 41)}
      {grain('ku-asph-light', 0.9, [0.92, 0.92, 0.9], 2.4, -1.35, 1, 42)}
      {blur('ku-oil', 8)}
      {chalkFilter('ku-chalk2', 0.45, -2.2, 1.55, 4, 44)}
      {blur('ku-dust2', 3.5)}
    </>
  ),
  surface: (w, h) => (
    <g>
      <rect width={w} height={h} fill="url(#ku-asphalt)" />
      <rect width={w} height={h} fill="#000" filter="url(#ku-asph-dark)" />
      <rect width={w} height={h} fill="#000" filter="url(#ku-asph-light)" />
      {/* kerikil kecil */}
      {Array.from({ length: Math.min(90, Math.round((w * h) / 4000)) }, (_, i) => (
        <ellipse key={i} cx={R(hs(i, 51) * w)} cy={R(hs(i, 52) * h)} rx={R(1.5 + hs(i, 53) * 2.5)} ry={R(1.2 + hs(i, 54) * 1.8)} fill={i % 3 ? '#9a9ea4' : '#4c5057'} opacity="0.8" />
      ))}
      {/* retakan & noda oli */}
      <path d={`M${R(w * 0.7)} 0 l-8 40 l12 30 l-10 44 l6 30`} stroke="#3a3d42" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.7" />
      <path d={`M0 ${R(h * 0.6)} l40 6 l28 -10 l30 12`} stroke="#3a3d42" strokeWidth="1.6" fill="none" opacity="0.6" />
      <ellipse cx={R(w * 0.22)} cy={R(h * 0.3)} rx="40" ry="26" fill="#2e3136" opacity="0.25" filter="url(#ku-oil)" />
      {/* bekas gambar kapur lama yang pudar */}
      <circle cx={R(w * 0.84)} cy={R(h * 0.72)} r="34" fill="none" stroke="#8fd3ff" strokeWidth="6" opacity="0.12" />
      <path d={`M${R(w * 0.12)} ${R(h * 0.9)} l14 -14 l14 14`} fill="none" stroke="#fff27a" strokeWidth="5" opacity="0.12" />
    </g>
  ),
  props: (w, h) => {
    const box = (x: number, n: number, c: string) => (
      <g key={n}>
        <rect x={x} y={h + 12} width="40" height="40" fill="none" stroke={c} strokeWidth="3.5" opacity="0.9" />
        <text x={x + 20} y={h + 42} textAnchor="middle" fontSize="24" fontWeight="900" fill={c} opacity="0.9" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive">
          {n}
        </text>
      </g>
    );
    return (
      <g>
        {/* aspal meluas ke bawah: kotak engklek bernomor */}
        <rect x="-60" y={h + 4} width={w + 120} height="56" rx="12" fill="url(#ku-asphalt)" />
        <rect x="-60" y={h + 4} width={w + 120} height="56" rx="12" fill="#000" filter="url(#ku-asph-dark)" />
        {box(-36, 1, '#fff27a')}
        {box(8, 2, '#8fd3ff')}
        {box(52, 3, '#ffb3dc')}
        {box(96, 4, '#b8f59a')}
        {/* ember kapur */}
        <g transform={`translate(${w + 26} -22)`}>
          {shade(4, 6, 30, 28, 0.22)}
          <circle r="28" fill="#3ba0e6" />
          <circle r="22" fill="#1f6fa8" />
          <path d="M-26 -8 A27 27 0 0 1 -6 -26" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" strokeLinecap="round" />
          {chalkStick(-16, -6, 30, '#ffb3dc', 'b1', 26)}
          {chalkStick(-12, 6, -20, '#fff27a', 'b2', 26)}
          {chalkStick(-4, -14, 70, '#b8f59a', 'b3', 24)}
          {chalkStick(2, 4, 10, '#fff', 'b4', 20)}
        </g>
        {chalkStick(-56, 30, 70, '#ff8fc8', 's1', 36)}
        {chalkStick(-50, 90, 110, '#8fd3ff', 's2', 22)}
      </g>
    );
  },
  stroke: (d) => (
    <g>
      {fx(d, 'ku-dust2', 30, <path d={d} {...LN} stroke="#ffb0da" strokeWidth="24" opacity="0.2" />)}
      {fx(d, 'ku-chalk2', 22, <path d={d} {...LN} stroke="#ff8fc8" strokeWidth="16" />)}
      {fx(d, 'ku-chalk2', 22, <path d={d} {...LN} stroke="#ffe0f0" strokeWidth="6" opacity="0.6" />)}
    </g>
  ),
};

/* ============ 7. Kain Batik · canting ============ */

const batik: CanvasTheme = {
  name: 'Kain Batik',
  bg: '#efe3cc',
  ink: '#5a2f12',
  frame: '#f7f1e3',
  dot: '#d8c9ad',
  tool: 'canting',
  guide: { color: '#b08a60', width: 5, dash: '2 12', opacity: 0.75 },
  defs: (
    <>
      <pattern id="ku-weave" width="5" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 1.2 H5 M1.2 0 V5" stroke="#c7b58f" strokeOpacity="0.28" strokeWidth="0.9" />
      </pattern>
      {grain('ku-cotton', 0.35, [0.62, 0.52, 0.36], 0.6, -0.26, 3, 61)}
      {/* motif kawung */}
      <pattern id="ku-kawung" width="36" height="36" patternUnits="userSpaceOnUse">
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} cx="18" cy="9" rx="5.5" ry="8" fill="#9a5a2a" opacity="0.55" transform={`rotate(${a} 18 18)`} />
        ))}
        <circle cx="18" cy="18" r="2" fill="#3b4f8a" opacity="0.6" />
        <circle cx="0" cy="0" r="2.5" fill="#3b4f8a" opacity="0.5" />
        <circle cx="36" cy="36" r="2.5" fill="#3b4f8a" opacity="0.5" />
        <circle cx="0" cy="36" r="2.5" fill="#3b4f8a" opacity="0.5" />
        <circle cx="36" cy="0" r="2.5" fill="#3b4f8a" opacity="0.5" />
      </pattern>
      {blur('ku-soak', 1.8)}
      <linearGradient id="ku-bamboo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e7cf8a" />
        <stop offset="0.5" stopColor="#c9a557" />
        <stop offset="1" stopColor="#8f7133" />
      </linearGradient>
      <radialGradient id="ku-copper" cx="0.35" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#f3b98a" />
        <stop offset="0.6" stopColor="#c0703d" />
        <stop offset="1" stopColor="#7e3f18" />
      </radialGradient>
      <radialGradient id="ku-malam" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#b8763a" />
        <stop offset="1" stopColor="#5e3210" />
      </radialGradient>
    </>
  ),
  surface: (w, h) => (
    <g>
      <rect width={w} height={h} fill="#f8f2e4" />
      <rect width={w} height={h} fill="url(#ku-weave)" />
      <rect width={w} height={h} fill="#000" filter="url(#ku-cotton)" />
      {/* pinggiran bermotif kawung samar */}
      <g opacity="0.3">
        <rect width={w} height="26" fill="url(#ku-kawung)" />
        <rect y={h - 26} width={w} height="26" fill="url(#ku-kawung)" />
        <rect y="26" width="26" height={h - 52} fill="url(#ku-kawung)" />
        <rect x={w - 26} y="26" width="26" height={h - 52} fill="url(#ku-kawung)" />
      </g>
      <rect x="28" y="28" width={w - 56} height={h - 56} fill="none" stroke="#9a5a2a" strokeOpacity="0.3" strokeWidth="1.6" strokeDasharray="6 4" />
      {/* bekas lipatan kain */}
      <path d={`M0 ${R(h * 0.5)} Q${R(w * 0.5)} ${R(h * 0.5 + 6)} ${w} ${R(h * 0.5)}`} stroke="#d8c9a8" strokeOpacity="0.5" strokeWidth="3" fill="none" />
    </g>
  ),
  props: (w, h) => {
    const pole = (y: number, k: string) => (
      <g key={k}>
        {shade(w / 2, y + 9, w / 2 + 50, 5, 0.15)}
        <rect x="-60" y={y - 8} width={w + 120} height="16" rx="8" fill="url(#ku-bamboo)" />
        {[0.1, 0.36, 0.64, 0.9].map((f) => (
          <rect key={f} x={R(-60 + (w + 120) * f)} y={y - 9} width="5" height="18" rx="2" fill="#a88640" />
        ))}
        <path d={`M-54 ${y - 4} H${w + 54}`} stroke="#fff6d8" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
    return (
      <g>
        {/* gawangan: bambu tempat kain dibentangkan */}
        {pole(-26, 'a')}
        {pole(h + 26, 'b')}
        {[0.15, 0.5, 0.85].map((f) => (
          <path key={f} d={`M${R(w * f)} -18 Q${R(w * f + 6)} -8 ${R(w * f)} 2`} stroke="#8a6a3a" strokeWidth="3" fill="none" />
        ))}
        {/* wajan kecil berisi malam cair, masih mengepul */}
        <g transform={`translate(${w + 22} ${h + 16})`}>
          {shade(4, 6, 34, 30, 0.22)}
          <circle r="32" fill="#3b3a38" />
          <circle r="27" fill="url(#ku-malam)" />
          <ellipse cx="-8" cy="-9" rx="9" ry="4" fill="#e3b37a" opacity="0.5" />
          <rect x="30" y="-4" width="22" height="8" rx="4" fill="#3b3a38" />
          <g className="ka-smoke">
            <path d="M-8 -14 q-6 -10 0 -20 q6 -10 0 -20" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          <g className="ka-smoke" style={{ animationDelay: '-2s' }}>
            <path d="M8 -12 q-6 -10 0 -20 q6 -10 0 -20" stroke="#fff" strokeOpacity="0.5" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        </g>
        {/* canting: gagang bambu + nyamplung tembaga + cucuk */}
        <g transform={`translate(${w + 32} ${R(h * 0.3)}) rotate(100)`}>
          {shade(40, 8, 52, 5, 0.16)}
          <rect x="18" y="-4" width="92" height="8" rx="4" fill="url(#ku-bamboo)" />
          <rect x="60" y="-4.5" width="3" height="9" fill="#a88640" />
          <path d="M4 -10 Q-4 -10 -4 0 Q-4 10 4 10 L18 6 L18 -6 Z" fill="url(#ku-copper)" />
          <ellipse cx="3" cy="0" rx="5" ry="6" fill="#5e3210" />
          <path d="M-3 4 Q-12 10 -20 8" stroke="#c0703d" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="-21" cy="8" r="2" fill="#5e3210" />
        </g>
        {/* tetes malam yang jatuh di luar kain */}
        <circle cx="-30" cy={R(h * 0.5)} r="5" fill="#7a4418" />
        <circle cx="-38" cy={R(h * 0.5) + 12} r="2.5" fill="#7a4418" />
      </g>
    );
  },
  stroke: (d) => (
    <g>
      {fx(d, 'ku-soak', 20, <path d={d} {...LN} stroke="#8a4b1c" strokeWidth="15" opacity="0.28" />)}
      <path d={d} {...LN} stroke="#7a3f14" strokeWidth="9" opacity="0.92" />
      <path d={d} {...LN} stroke="#e2a15e" strokeWidth="2.4" opacity="0.5" transform="translate(-1.2 -1.2)" />
      {/* isen-isen: titik-titik canting di kiri-kanan garis */}
      {along(d, 20, (x, y, nx, ny, i) => (
        <g key={i}>
          <circle cx={R(x + nx * 12)} cy={R(y + ny * 12)} r="2.6" fill="#7a3f14" opacity="0.9" />
          <circle cx={R(x - nx * 12)} cy={R(y - ny * 12)} r="2.6" fill="#7a3f14" opacity="0.9" />
        </g>
      ))}
    </g>
  ),
};

/* ============ 8. Layar Neon · pena cahaya ============ */

const NEON = (d: string, c: string, core: string, wide: number) => (
  <g>
    {fx(d, 'ku-glow-big', 40, <path d={d} {...LN} stroke={c} strokeWidth={wide * 2.4} opacity="0.55" />)}
    {fx(d, 'ku-glow-sm', 20, <path d={d} {...LN} stroke={c} strokeWidth={wide} />)}
    <path d={d} {...LN} stroke={core} strokeWidth={R(wide * 0.4)} />
  </g>
);

const neon: CanvasTheme = {
  name: 'Layar Neon',
  bg: '#0a0d1a',
  ink: '#f2f6ff',
  dark: true,
  frame: '#1a1f35',
  dot: 'rgba(90,240,255,0.35)',
  tool: 'pena cahaya',
  guide: { color: '#4df3ff', width: 4, dash: '4 12', opacity: 0.45 },
  defs: (
    <>
      <radialGradient id="ku-screen" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0" stopColor="#141a36" />
        <stop offset="0.7" stopColor="#0b0f22" />
        <stop offset="1" stopColor="#05070f" />
      </radialGradient>
      <pattern id="ku-scan" width="8" height="4" patternUnits="userSpaceOnUse">
        <rect width="8" height="1.6" fill="#000" opacity="0.35" />
      </pattern>
      <pattern id="ku-grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M50 0 V50 M0 50 H50" stroke="#3de8ff" strokeOpacity="0.1" strokeWidth="1.2" />
      </pattern>
      {blur('ku-glow-big', 9)}
      {blur('ku-glow-sm', 2)}
      <linearGradient id="ku-glass-tv" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
        <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </>
  ),
  surface: (w, h) => (
    <g>
      <rect width={w} height={h} fill="url(#ku-screen)" />
      <rect width={w} height={h} fill="url(#ku-grid)" />
      <rect width={w} height={h} fill="url(#ku-scan)" />
      <rect width={w} height={h} fill="url(#ku-glass-tv)" />
      <rect x="1" y="1" width={w - 2} height={h - 2} fill="none" stroke="#3de8ff" strokeOpacity="0.25" strokeWidth="2" />
    </g>
  ),
  props: (w, h) => {
    const cap = (x: number, y: number, rot: number, k: string) => (
      <g key={k} transform={`translate(${R(x)} ${R(y)}) rotate(${rot})`}>
        <rect x="-7" y="-9" width="14" height="18" rx="3" fill="#3b4256" />
        <rect x="-5" y="-7" width="3" height="14" rx="1.5" fill="#8a93a8" />
      </g>
    );
    return (
      <g>
        {/* tabung neon merah muda di atas, biru muda di kiri */}
        {NEON(`M30 -30 H${w - 30}`, '#ff3df2', '#fff0fe', 8)}
        {cap(24, -30, 90, 'c1')}
        {cap(w - 24, -30, 90, 'c2')}
        {NEON(`M-30 40 V${h - 40}`, '#34e7ff', '#effdff', 8)}
        {cap(-30, 34, 0, 'c3')}
        {cap(-30, h - 34, 0, 'c4')}
        {/* hati neon kecil di pojok kanan atas */}
        <g className="ka-glow">{NEON(`M${w + 30} -12 L${w + 16} -26 Q${w + 12} -38 ${w + 22} -40 Q${w + 30} -40 ${w + 30} -32 Q${w + 30} -40 ${w + 38} -40 Q${w + 48} -38 ${w + 44} -26 Z`, '#ffe14d', '#fffbe0', 4)}</g>
        {/* kabel & trafo */}
        <path d={`M-30 ${h - 26} Q-40 ${h + 10} -20 ${h + 30} T30 ${h + 38}`} stroke="#252a3d" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d={`M${w - 18} -30 Q${w + 20} -20 ${w + 34} 20 V${h + 20}`} stroke="#252a3d" strokeWidth="5" fill="none" strokeLinecap="round" />
        <g transform={`translate(40 ${h + 30})`}>
          <rect x="0" y="-12" width="54" height="26" rx="5" fill="#2a3048" stroke="#4a5270" strokeWidth="2" />
          <circle cx="44" cy="1" r="3.5" fill="#3dff8a" className="robi-led" />
          <path d="M8 -4 H32 M8 2 H28 M8 8 H30" stroke="#5a6488" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    );
  },
  stroke: (d) => NEON(d, '#ff3df2', '#fff4fe', 10),
};

/* ============ 9. Langit Kembang Api · kembang api ============ */

const langit: CanvasTheme = {
  name: 'Langit Kembang Api',
  bg: '#0a0f2c',
  ink: '#fff3d6',
  dark: true,
  frame: '#141b45',
  dot: 'rgba(200,210,255,0.3)',
  tool: 'kembang api',
  guide: { color: '#b9c6ff', width: 4, dash: '3 13', opacity: 0.45 },
  defs: (
    <>
      <linearGradient id="ku-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070b26" />
        <stop offset="0.6" stopColor="#171c4f" />
        <stop offset="1" stopColor="#3a2560" />
      </linearGradient>
      {blur('ku-haze', 14)}
      {blur('ku-spark-glow', 6)}
      {blur('ku-spark-sm', 1.2)}
      <radialGradient id="ku-moon" cx="0.4" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#fffbe8" />
        <stop offset="1" stopColor="#e8dcae" />
      </radialGradient>
    </>
  ),
  surface: (w, h) => {
    const n = Math.min(220, Math.round((w * h) / 1800));
    return (
      <g>
        <rect width={w} height={h} fill="#0b1033" />
        <rect width={w} height={h} fill="url(#ku-night)" />
        {/* asap tipis sisa kembang api */}
        <ellipse cx={R(w * 0.3)} cy={R(h * 0.7)} rx={R(w * 0.3)} ry="40" fill="#8b7bc8" opacity="0.12" filter="url(#ku-haze)" />
        <ellipse cx={R(w * 0.75)} cy={R(h * 0.35)} rx={R(w * 0.22)} ry="30" fill="#7b8bd8" opacity="0.1" filter="url(#ku-haze)" />
        {/* bintang */}
        {Array.from({ length: n }, (_, i) => {
          const x = R(hs(i, 71) * w),
            y = R(hs(i, 72) * h),
            r = R(0.6 + hs(i, 73) * hs(i, 73) * 2.2);
          return i % 5 === 0 ? (
            <circle key={i} cx={x} cy={y} r={R(r + 0.5)} fill="#fff" className="ka-twinkle" style={{ animationDelay: `${R(hs(i, 74) * -1.8)}s` }} />
          ) : (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 7 ? '#e8ecff' : '#ffe6b0'} opacity={R(0.4 + hs(i, 75) * 0.5)} />
          );
        })}
        {/* bulan sabit di pojok */}
        <circle cx={w - 44} cy="42" r="30" fill="#fff6c8" opacity="0.15" filter="url(#ku-haze)" />
        <path d={`M${w - 52} 20 A22 22 0 1 0 ${w - 30} 62 A18 18 0 1 1 ${w - 52} 20 Z`} fill="url(#ku-moon)" />
      </g>
    );
  },
  props: (w, h) => {
    const bld: ReactNode[] = [];
    let x = -60,
      i = 0;
    while (x < w + 60) {
      const bw = R(34 + hs(i, 81) * 46),
        bh = R(30 + hs(i, 82) * 28);
      const top = h + 30 - bh;
      bld.push(
        <g key={i}>
          <rect x={x} y={R(top)} width={bw} height={R(bh + 30)} fill={i % 2 ? '#0a0d24' : '#0e1230'} />
          {Array.from({ length: Math.floor(bw / 12) * Math.floor(bh / 14) }, (_, j) => {
            const cols = Math.floor(bw / 12);
            const wx = x + 5 + (j % cols) * 12,
              wy = top + 6 + Math.floor(j / cols) * 14;
            return hs(i * 31 + j, 83) < 0.45 ? <rect key={j} x={R(wx)} y={R(wy)} width="5" height="7" rx="1" fill="#ffd66b" opacity={R(0.55 + hs(j, i) * 0.4)} /> : null;
          })}
        </g>,
      );
      x = R(x + bw + 2);
      i++;
    }
    const sparkler = (sx: number, sy: number, rot: number, k: string) => (
      <g key={k} transform={`translate(${R(sx)} ${R(sy)}) rotate(${rot})`}>
        <path d="M0 0 V70" stroke="#6f6a66" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 0 V34" stroke="#3a3533" strokeWidth="5" strokeLinecap="round" />
        <circle r="14" fill="#ffb347" opacity="0.6" filter="url(#ku-spark-glow)" />
        <circle r="4" fill="#fffbe6" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
          const a = (j / 8) * Math.PI * 2 + hs(j, 84);
          const l = 12 + hs(j, 85) * 12;
          return (
            <path
              key={j}
              d={`M${R(Math.cos(a) * 5)} ${R(Math.sin(a) * 5)} L${R(Math.cos(a) * l)} ${R(Math.sin(a) * l)}`}
              stroke="#ffe08a"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="ka-twinkle"
              style={{ animationDelay: `${R(-hs(j, 86) * 1.8)}s`, animationDuration: '0.6s' }}
            />
          );
        })}
      </g>
    );
    return (
      <g>
        {/* siluet kota di bawah, lengkap dengan jendela menyala dan kubah */}
        {bld}
        <path d={`M${R(w * 0.55)} ${h + 30} V${h + 4} Q${R(w * 0.55) + 22} ${h - 30} ${R(w * 0.55) + 44} ${h + 4} V${h + 30} Z`} fill="#0c1030" />
        <path d={`M${R(w * 0.55) + 22} ${h - 12} V${h - 22}`} stroke="#0c1030" strokeWidth="3" />
        <circle cx={R(w * 0.55) + 22} cy={h - 24} r="2.6" fill="#ffd66b" />
        {sparkler(-34, -30, -30, 's1')}
        {sparkler(w + 34, -30, 30, 's2')}
      </g>
    );
  },
  stroke: (d) => (
    <g>
      {fx(d, 'ku-spark-glow', 40, <path d={d} {...LN} stroke="#ff9d2e" strokeWidth="24" opacity="0.5" />)}
      {fx(d, 'ku-spark-sm', 20, <path d={d} {...LN} stroke="#ffd35a" strokeWidth="8" />)}
      <path d={d} {...LN} stroke="#fffbe6" strokeWidth="2.8" />
      {/* percikan kecil yang berkelip di sepanjang jejak */}
      {along(d, 26, (x, y, nx, ny, i) => {
        const s = i % 2 ? 1 : -1,
          o = 8 + hs(i, 91) * 12;
        const cx = R(x + nx * o * s),
          cy = R(y + ny * o * s),
          r = R(3 + hs(i, 92) * 3);
        return (
          <g key={i} className="ka-twinkle" style={{ animationDelay: `${R(-hs(i, 93) * 1.8)}s`, animationDuration: `${R(0.8 + hs(i, 94) * 0.9)}s` }}>
            <path d={`M${R(cx - r)} ${cy} H${R(cx + r)} M${cx} ${R(cy - r)} V${R(cy + r)}`} stroke="#fff4c2" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r="1.3" fill="#fff" />
          </g>
        );
      })}
    </g>
  ),
};

/* ============ 10. Kanvas Emas · kuas emas ============ */

const emas: CanvasTheme = {
  name: 'Kanvas Emas',
  bg: '#f1e9dc',
  ink: '#5c4212',
  frame: '#c9a24a',
  dot: '#cfc2a4',
  tool: 'kuas emas',
  guide: { color: '#a08b6a', width: 5, dash: '2 12', opacity: 0.75 },
  defs: (
    <>
      <pattern id="ku-linen" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#efe6d1" />
        <path d="M0 1.5 H6 M0 4.5 H6" stroke="#dccfb3" strokeWidth="1.2" />
        <path d="M1.5 0 V6 M4.5 0 V6" stroke="#e6dbc2" strokeWidth="1" />
        <circle cx="4.5" cy="1.5" r="0.7" fill="#f8f2e4" />
      </pattern>
      {grain('ku-linen-grain', 0.3, [0.5, 0.42, 0.28], 0.9, -0.38, 3, 101)}
      <radialGradient id="ku-spot" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#fff8e6" stopOpacity="0.75" />
        <stop offset="0.6" stopColor="#fff8e6" stopOpacity="0" />
        <stop offset="1" stopColor="#6b5530" stopOpacity="0.28" />
      </radialGradient>
      {/* cat emas: kilau logam bergaris yang memantul */}
      <linearGradient id="ku-goldpaint" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="26" y2="20" spreadMethod="reflect">
        <stop offset="0" stopColor="#fff2b0" />
        <stop offset="0.35" stopColor="#e8b422" />
        <stop offset="0.7" stopColor="#a8740a" />
        <stop offset="1" stopColor="#ffd966" />
      </linearGradient>
      <linearGradient id="ku-goldframe" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff0a8" />
        <stop offset="0.3" stopColor="#d9a52a" />
        <stop offset="0.55" stopColor="#f5d470" />
        <stop offset="0.8" stopColor="#a8740a" />
        <stop offset="1" stopColor="#e2b84a" />
      </linearGradient>
      <linearGradient id="ku-goldinner" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#8a5c08" />
        <stop offset="0.5" stopColor="#d9a52a" />
        <stop offset="1" stopColor="#fbe7a0" />
      </linearGradient>
      <linearGradient id="ku-beamlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff6d6" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
      </linearGradient>
    </>
  ),
  surface: (w, h) => (
    <g>
      <rect width={w} height={h} fill="url(#ku-linen)" />
      <rect width={w} height={h} fill="#000" filter="url(#ku-linen-grain)" />
      <rect width={w} height={h} fill="url(#ku-spot)" />
    </g>
  ),
  props: (w, h) => {
    const corner = (x: number, y: number, sx: number, sy: number, k: string) => (
      <g key={k} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
        <path d="M-2 -2 Q-30 -4 -44 -24 Q-50 -40 -36 -46 Q-22 -48 -24 -34 Q-26 -26 -34 -30" stroke="#8a5c08" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-2 -2 Q-30 -4 -44 -24 Q-50 -40 -36 -46 Q-22 -48 -24 -34 Q-26 -26 -34 -30" stroke="#ffe79a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M-2 -2 Q-4 -30 -24 -44" stroke="#8a5c08" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M-2 -2 Q-4 -30 -24 -44" stroke="#ffe79a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="-30" cy="-30" r="7" fill="url(#ku-goldframe)" stroke="#8a5c08" strokeWidth="1.5" />
        <circle cx="-32" cy="-32" r="2.2" fill="#fffbe0" />
      </g>
    );
    const beads: ReactNode[] = [];
    const per = (len: number) => Math.max(1, Math.round(len / 16));
    for (let j = 0, n = per(w); j <= n; j++) {
      const x = R((w / n) * j);
      beads.push(<circle key={`t${j}`} cx={x} cy="-12" r="2.8" fill="#fbe7a0" stroke="#8a5c08" strokeWidth="0.8" />);
      beads.push(<circle key={`b${j}`} cx={x} cy={h + 12} r="2.8" fill="#fbe7a0" stroke="#8a5c08" strokeWidth="0.8" />);
    }
    for (let j = 0, n = per(h); j <= n; j++) {
      const y = R((h / n) * j);
      beads.push(<circle key={`l${j}`} cx="-12" cy={y} r="2.8" fill="#fbe7a0" stroke="#8a5c08" strokeWidth="0.8" />);
      beads.push(<circle key={`r${j}`} cx={w + 12} cy={y} r="2.8" fill="#fbe7a0" stroke="#8a5c08" strokeWidth="0.8" />);
    }
    return (
      <g>
        {/* bayangan bingkai di dinding galeri */}
        <rect x="-50" y="-42" width={w + 108} height={h + 106} rx="4" fill="#000" opacity="0.18" />
        {/* bingkai emas berukir: bingkai luar, jalur manik-manik, bibir dalam */}
        <path d={`M-56 -56 H${w + 56} V${h + 56} H-56 Z M0 0 V${h} H${w} V0 Z`} fill="url(#ku-goldframe)" fillRule="evenodd" />
        <rect x="-54" y="-54" width={w + 108} height={h + 108} fill="none" stroke="#7a5006" strokeWidth="3" />
        <rect x="-44" y="-44" width={w + 88} height={h + 88} fill="none" stroke="#fff3c0" strokeOpacity="0.7" strokeWidth="2" />
        <rect x="-19" y="-19" width={w + 38} height={h + 38} fill="none" stroke="#9a6a0a" strokeWidth="11" />
        {beads}
        <path d={`M-6 -6 H${w + 6} V${h + 6} H-6 Z M0 0 V${h} H${w} V0 Z`} fill="url(#ku-goldinner)" fillRule="evenodd" />
        <rect x="-1" y="-1" width={w + 2} height={h + 2} fill="none" stroke="#5a3a04" strokeOpacity="0.5" strokeWidth="2" />
        {corner(-6, -6, 1, 1, 'k1')}
        {corner(w + 6, -6, -1, 1, 'k2')}
        {corner(-6, h + 6, 1, -1, 'k3')}
        {corner(w + 6, h + 6, -1, -1, 'k4')}
        {/* papan nama kuningan */}
        <g transform={`translate(${R(w / 2)} ${h + 34})`}>
          <rect x="-46" y="-11" width="92" height="22" rx="3" fill="url(#ku-goldinner)" stroke="#7a5006" strokeWidth="1.5" />
          <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#4a3004" fontFamily="Georgia, serif" letterSpacing="1">
            Karya Agam
          </text>
        </g>
        {/* lampu galeri di atas bingkai */}
        <path d={`M${R(w / 2 - 70)} -40 L${R(w / 2 - 150)} ${R(h * 0.5)} L${R(w / 2 + 150)} ${R(h * 0.5)} L${R(w / 2 + 70)} -40 Z`} fill="url(#ku-beamlight)" opacity="0.5" />
        <g transform={`translate(${R(w / 2)} -58)`}>
          <rect x="-4" y="-6" width="8" height="12" fill="#6b5a3a" />
          <path d="M-70 4 Q0 -8 70 4 L64 18 Q0 10 -64 18 Z" fill="url(#ku-goldframe)" stroke="#7a5006" strokeWidth="1.5" />
          <path d="M-60 16 Q0 9 60 16" stroke="#fffbe0" strokeWidth="3" strokeLinecap="round" fill="none" className="ka-glow" />
        </g>
      </g>
    );
  },
  stroke: (d) => (
    <g>
      <path d={d} {...LN} stroke="#5a3a04" strokeWidth="13" opacity="0.22" transform="translate(2 3)" />
      <path d={d} {...LN} stroke="#9a6a0a" strokeWidth="12" />
      <path d={d} {...LN} stroke="url(#ku-goldpaint)" strokeWidth="10" />
      <path d={d} {...LN} stroke="#fffbe0" strokeWidth="2.6" opacity="0.7" strokeDasharray="26 14 8 20" transform="translate(-1.5 -2)" />
    </g>
  ),
};

/* ============ daftar tema (urutan = Level 1..10) ============ */

export const ULANGI_THEMES: CanvasTheme[] = [kertas, papan, jendela, piring, tembok, lantai, batik, neon, langit, emas];

/* ============ Agam Pelukis ============ */

/**
 * Agam tampak atas memegang kuas. Titik (0,0) = UJUNG kuas (goresan keluar tepat di sini); badan di belakangnya,
 * depan = atas. Tetap ada sorot lampu pendek + panah putih supaya anak tahu arah "maju". Topi baret merah menutupi
 * bagian belakang kepala, palet cat di sisi kiri.
 */
export function AgamPainterTop({ bump }: { bump: boolean }) {
  return (
    <g className={bump ? 'robi-bump' : undefined}>
      <defs>
        <radialGradient id="ku-beret-top" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff6b6b" />
          <stop offset="0.6" stopColor="#d9262e" />
          <stop offset="1" stopColor="#8f1119" />
        </radialGradient>
        <radialGradient id="ku-palette-top" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f6dcaa" />
          <stop offset="1" stopColor="#c99a5a" />
        </radialGradient>
      </defs>
      {/* sorot lampu pendek ke depan */}
      <path d="M-9 -8 L-26 -64 L26 -64 L9 -8 Z" fill="url(#ka-beam)" opacity="0.85" />
      {/* panah arah maju */}
      <g className="agam-chev">
        <path d="M-11 -34 L0 -46 L11 -34" fill="none" stroke="#1b2a4e" strokeOpacity="0.55" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 -34 L0 -46 L11 -34" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="0" cy="32" rx="36" ry="20" fill="#000" opacity="0.2" />
      {/* roda rantai */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s < 0 ? -36 : 24} y="12" width="12" height="36" rx="6" fill="#2e3446" />
          {[18, 26, 34, 42].map((y) => (
            <rect key={y} x={s < 0 ? -34.5 : 25.5} y={y} width="9" height="2.6" rx="1.3" fill="#566079" />
          ))}
        </g>
      ))}
      {/* badan */}
      <path d="M-24 44 Q-26 49 -20 49 L20 49 Q26 49 24 44 L22 18 Q20 8 10 7 L-10 7 Q-20 8 -22 18 Z" fill="url(#ka-agam)" stroke="#0f7a66" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M-16 14 Q-18 28 -17 42" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* palet cat di kiri */}
      <path d="M-20 24 L-28 22" stroke="#0f7a66" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(-36 22) rotate(-20)">
        <path d="M-12 -10 Q2 -16 12 -8 Q16 0 10 6 Q6 8 7 12 Q4 17 -6 14 Q-16 10 -15 0 Q-15 -7 -12 -10 Z" fill="url(#ku-palette-top)" stroke="#8a6230" strokeWidth="1.5" />
        <circle cx="4" cy="8" r="2.6" fill="#8a6230" opacity="0.7" />
        <circle cx="-8" cy="-3" r="3" fill="#e8412c" />
        <circle cx="-2" cy="-9" r="3" fill="#f7c21a" />
        <circle cx="6" cy="-6" r="3" fill="#2f7de1" />
        <circle cx="-7" cy="7" r="3" fill="#3bb54a" />
      </g>
      {/* kepala: wajah di sisi depan */}
      <circle cx="0" cy="28" r="15" fill="#f2fbf9" stroke="#0f7a66" strokeWidth="2.6" />
      <rect x="-12" y="15" width="24" height="11" rx="5.5" fill="#1b2a4e" />
      <circle cx="-5.5" cy="20.5" r="3.5" fill="#7df9ff" className="robi-eye" />
      <circle cx="5.5" cy="20.5" r="3.5" fill="#7df9ff" className="robi-eye" />
      <circle cx="-6.5" cy="19.3" r="1.1" fill="#fff" />
      <circle cx="4.5" cy="19.3" r="1.1" fill="#fff" />
      {/* baret merah menutupi belakang kepala */}
      <ellipse cx="2" cy="38" rx="15" ry="9" fill="url(#ku-beret-top)" stroke="#7a0f16" strokeWidth="1.5" />
      <path d="M-8 35 Q0 31 11 34" stroke="#ff9a9a" strokeOpacity="0.6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M5 37 l3 -4" stroke="#7a0f16" strokeWidth="2.6" strokeLinecap="round" />
      {/* lampu antena di punggung */}
      <circle cx="0" cy="46" r="3.2" fill="#ff6b5b" className="robi-led" />
      {/* lengan kanan menggenggam kuas; ujung bulu kuas tepat di (0,0) */}
      <path d="M19 22 L11 12" stroke="#0f7a66" strokeWidth="6" strokeLinecap="round" />
      <path d="M8 9.5 L21 25" stroke="#7a1f2a" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M9 9 L19 21" stroke="#ff8a8a" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.2 5 L8.5 10" stroke="#c7ccd4" strokeWidth="4.6" strokeLinecap="round" />
      <path d="M0 0 Q1 3.5 3 6.6 Q5.4 4.8 6.3 3.6 Q3.4 1.4 0 0 Z" fill="#6b4a2a" stroke="#3b2612" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="11" cy="12.5" r="4.4" fill="#2ec4a6" stroke="#0f7a66" strokeWidth="1.8" />
      <circle cx="0" cy="0" r="2.2" fill="#1b2a4e" />
      <circle cx="0" cy="0" r="4.6" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
    </g>
  );
}

/** Agam tampak depan sebagai pelukis: baret merah, celemek bernoda cat, kuas & palet. */
export function AgamPainterFront({ size = 84, wave = true }: { size?: number; wave?: boolean }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} aria-hidden className={wave ? 'robi-wave' : undefined}>
      <defs>
        <radialGradient id="ku-beret-front" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#ff6b6b" />
          <stop offset="0.6" stopColor="#d9262e" />
          <stop offset="1" stopColor="#8f1119" />
        </radialGradient>
        <linearGradient id="ku-smock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdfaf2" />
          <stop offset="1" stopColor="#e6ddc8" />
        </linearGradient>
      </defs>
      {/* kepala */}
      <rect x="18" y="22" width="84" height="64" rx="30" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <rect x="30" y="36" width="60" height="32" rx="16" fill="#1b2a4e" />
      <circle cx="47" cy="52" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="73" cy="52" r="7" fill="#7df9ff" className="robi-eye" />
      <path d="M50 76 Q60 82 70 76" fill="none" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="74" r="2.5" fill="#e8412c" />
      {/* baret miring */}
      <path d="M14 30 Q18 6 56 4 Q96 4 100 22 Q88 30 56 30 Q28 32 14 30 Z" fill="url(#ku-beret-front)" stroke="#7a0f16" strokeWidth="3" strokeLinejoin="round" />
      <path d="M26 18 Q44 8 64 9" stroke="#ff9a9a" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M58 5 Q60 -1 64 1" stroke="#7a0f16" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* badan bercelemek dengan cipratan cat */}
      <rect x="36" y="88" width="48" height="30" rx="12" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <path d="M40 90 H80 L78 118 H42 Z" fill="url(#ku-smock)" stroke="#c9bb9a" strokeWidth="1.5" />
      <path d="M48 90 Q60 97 72 90" stroke="#c9bb9a" strokeWidth="2" fill="none" />
      <circle cx="50" cy="104" r="3.4" fill="#2f7de1" />
      <circle cx="54" cy="100" r="1.4" fill="#2f7de1" />
      <circle cx="68" cy="110" r="3" fill="#e8412c" />
      <circle cx="72" cy="106" r="1.3" fill="#e8412c" />
      <circle cx="64" cy="99" r="2.2" fill="#f7c21a" />
      {/* lengan kiri terangkat memegang kuas */}
      <rect x="8" y="90" width="24" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" transform="rotate(-35 20 96)" />
      <g transform="rotate(-28 12 86)">
        <rect x="9" y="58" width="5" height="34" rx="2.5" fill="#7a1f2a" />
        <rect x="8.5" y="52" width="6" height="8" rx="1" fill="#c7ccd4" />
        <path d="M8.5 53 Q8 44 11.5 38 Q15 44 14.5 53 Z" fill="#e8412c" stroke="#8f1119" strokeWidth="1" />
      </g>
      {/* lengan kanan memegang palet */}
      <rect x="88" y="92" width="22" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" />
      <g transform="translate(104 104) rotate(-12)">
        <path d="M-14 -8 Q0 -16 13 -8 Q17 0 11 5 Q7 7 8 11 Q4 16 -6 13 Q-16 9 -15 0 Z" fill="#e9c68d" stroke="#8a6230" strokeWidth="1.8" />
        <circle cx="5" cy="7" r="2.4" fill="#8a6230" opacity="0.7" />
        <circle cx="-8" cy="-2" r="3" fill="#e8412c" />
        <circle cx="-1" cy="-8" r="3" fill="#f7c21a" />
        <circle cx="7" cy="-5" r="3" fill="#2f7de1" />
        <circle cx="-7" cy="6" r="2.8" fill="#3bb54a" />
      </g>
      <rect x="38" y="118" width="16" height="10" rx="4" fill="#3b4256" />
      <rect x="66" y="118" width="16" height="10" rx="4" fill="#3b4256" />
    </svg>
  );
}
