'use client';

// Gambar benda Coding Agam · Pola: bunga, bola, mobil, ikan (berwarna), permen berbentuk, alat musik (gendang,
// lonceng, marakas, gong) dan lonceng tangan do–la. Semua dalam kotak 100×100, bergradasi + bayangan + kilap supaya
// terasa nyata. Tiap benda juga punya bunyi (playToken): warna/bentuk = bilah marimba bernada, alat = bunyinya
// sendiri, lonceng tangan = nadanya — jadi pola yang lengkap terdengar sebagai lagu.

import { Fragment, type ReactNode } from 'react';
import type { Color, Note, Shape, Token } from '@/lib/koding/pola';
import { sfx } from '@/lib/sfx';

export const HUE: Record<Color, [string, string, string]> = {
  merah: ['#ff8a80', '#e53935', '#9e1b1b'],
  oranye: ['#ffcc80', '#fb8c00', '#b35400'],
  kuning: ['#fff59d', '#fdd835', '#b88f00'],
  hijau: ['#a5d6a7', '#43a047', '#1b5e20'],
  biru: ['#90caf9', '#1e88e5', '#0d47a1'],
  ungu: ['#ce93d8', '#8e24aa', '#4a148c'],
};
const NOTE_COLOR: Record<Note, Color> = { do: 'merah', re: 'oranye', mi: 'kuning', sol: 'hijau', la: 'biru' };
const NOTE_HZ: Record<Note, number> = { do: 523.25, re: 587.33, mi: 659.25, sol: 783.99, la: 880 };
const COLOR_HZ: Record<Color, number> = { merah: 523.25, oranye: 587.33, kuning: 659.25, hijau: 783.99, biru: 880, ungu: 1046.5 };
const SHAPE_HZ: Record<Shape, number> = { lingkaran: 523.25, kotak: 587.33, segitiga: 659.25, bintang: 783.99, hati: 880, ketupat: 1046.5 };

export function playToken(t: Token, at = 0) {
  if (t.k === 'warna') sfx.marimba(COLOR_HZ[t.c], at);
  else if (t.k === 'bentuk') sfx.marimba(SHAPE_HZ[t.s], at);
  else if (t.k === 'nada') sfx.handbell(NOTE_HZ[t.n], at);
  else if (t.i === 'gendang') sfx.drum(at);
  else if (t.i === 'lonceng') sfx.cowbell(at);
  else if (t.i === 'marakas') sfx.shaker(at);
  else sfx.gong(at);
}

/** gradasi bersama (dipasang sekali di tiap <svg> yang menggambar benda) */
export const TOKEN_DEFS = (
  <>
    {(Object.keys(HUE) as Color[]).map((c) => (
      <Fragment key={c}>
        <radialGradient id={`pl-${c}`} cx="0.36" cy="0.3" r="0.78">
          <stop offset="0" stopColor={HUE[c][0]} />
          <stop offset="0.55" stopColor={HUE[c][1]} />
          <stop offset="1" stopColor={HUE[c][2]} />
        </radialGradient>
        <linearGradient id={`pv-${c}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={HUE[c][2]} />
          <stop offset="0.35" stopColor={HUE[c][1]} />
          <stop offset="0.55" stopColor={HUE[c][0]} />
          <stop offset="0.8" stopColor={HUE[c][1]} />
          <stop offset="1" stopColor={HUE[c][2]} />
        </linearGradient>
      </Fragment>
    ))}
    <linearGradient id="pl-wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#5d3517" />
      <stop offset="0.4" stopColor="#b9753d" />
      <stop offset="0.6" stopColor="#d49a5f" />
      <stop offset="1" stopColor="#6b3d1b" />
    </linearGradient>
    <radialGradient id="pl-skin" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stopColor="#fffaf0" />
      <stop offset="1" stopColor="#e6d3ae" />
    </radialGradient>
    <radialGradient id="pl-gold" cx="0.35" cy="0.3" r="0.85">
      <stop offset="0" stopColor="#fff2b0" />
      <stop offset="0.45" stopColor="#e9b93c" />
      <stop offset="1" stopColor="#8a5d12" />
    </radialGradient>
    <radialGradient id="pl-bronze" cx="0.4" cy="0.35" r="0.75">
      <stop offset="0" stopColor="#f6d58c" />
      <stop offset="0.5" stopColor="#c28a35" />
      <stop offset="0.85" stopColor="#8a5a1c" />
      <stop offset="1" stopColor="#5e3a10" />
    </radialGradient>
    <linearGradient id="pl-glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#bfe3ff" />
      <stop offset="1" stopColor="#27415f" />
    </linearGradient>
  </>
);

const Shadow = ({ cy = 86, rx = 28, op = 0.2 }: { cy?: number; rx?: number; op?: number }) => <ellipse cx="50" cy={cy} rx={rx} ry={rx * 0.22} fill="#000" opacity={op} />;
const Gloss = ({ x = 40, y = 33, rx = 10, ry = 6, rot = -30 }: { x?: number; y?: number; rx?: number; ry?: number; rot?: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity="0.6" transform={`rotate(${rot} ${x} ${y})`} />
);

const SHAPE_PATH: Record<Shape, string> = {
  lingkaran: 'M50 18 a31 31 0 1 1 -0.01 0 Z',
  kotak: 'M30 20 H70 Q80 20 80 30 V70 Q80 80 70 80 H30 Q20 80 20 70 V30 Q20 20 30 20 Z',
  segitiga: 'M50 15 Q54 15 56 19 L84 72 Q87 80 78 80 L22 80 Q13 80 16 72 L44 19 Q46 15 50 15 Z',
  bintang: (() => {
    const p: string[] = [];
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const r = k % 2 ? 15 : 35;
      p.push(`${(50 + Math.cos(a) * r).toFixed(1)} ${(52 + Math.sin(a) * r).toFixed(1)}`);
    }
    return `M${p.join(' L')} Z`;
  })(),
  hati: 'M50 82 C22 64 13 45 22 31 C30 18 45 20 50 33 C55 20 70 18 78 31 C87 45 78 64 50 82 Z',
  ketupat: 'M50 14 Q53 14 55 17 L81 47 Q84 50 81 53 L55 83 Q53 86 50 86 Q47 86 45 83 L19 53 Q16 50 19 47 L45 17 Q47 14 50 14 Z',
};

function Candy({ s, c }: { s: Shape; c: Color }) {
  return (
    <g>
      <Shadow cy={88} rx={26} />
      <path d={SHAPE_PATH[s]} fill={HUE[c][2]} transform="translate(0 3)" />
      <path d={SHAPE_PATH[s]} fill={`url(#pl-${c})`} stroke={HUE[c][2]} strokeWidth="2" strokeLinejoin="round" />
      <path d={SHAPE_PATH[s]} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" transform="translate(50 50) scale(0.84) translate(-50 -50)" />
      <Gloss x={s === 'segitiga' ? 44 : 38} y={s === 'hati' ? 34 : s === 'segitiga' ? 44 : 34} rx={s === 'segitiga' ? 6 : 9} ry={5} />
    </g>
  );
}

function Ball({ c }: { c: Color }) {
  return (
    <g>
      <Shadow cy={84} rx={26} />
      <circle cx="50" cy="50" r="31" fill={`url(#pl-${c})`} />
      {/* garis bola pantai */}
      <path d="M50 19 Q34 50 50 81" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="6" />
      <path d="M50 19 Q66 50 50 81" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="6" />
      <circle cx="50" cy="50" r="31" fill="none" stroke={HUE[c][2]} strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="50" cy="21" r="4" fill="#fff" stroke={HUE[c][2]} strokeWidth="1" />
      <Gloss x={38} y={33} rx={11} ry={6} />
    </g>
  );
}

function Flower({ c }: { c: Color }) {
  return (
    <g>
      <Shadow cy={84} rx={30} op={0.15} />
      <ellipse cx="24" cy="70" rx="16" ry="7" fill="url(#pl-hijau)" transform="rotate(-30 24 70)" />
      <ellipse cx="77" cy="72" rx="16" ry="7" fill="url(#pl-hijau)" transform="rotate(28 77 72)" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <ellipse cx="50" cy="29" rx="13" ry="21" fill={`url(#pl-${c})`} stroke={HUE[c][2]} strokeOpacity="0.45" strokeWidth="1.2" />
          <path d="M50 44 L50 16" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="50" cy="50" r="12" fill="url(#pl-gold)" stroke="#8a5d12" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={50 + Math.cos((a * Math.PI) / 180) * 6} cy={50 + Math.sin((a * Math.PI) / 180) * 6} r="1.6" fill="#7a4f0e" />
      ))}
    </g>
  );
}

function Car({ c }: { c: Color }) {
  return (
    <g>
      <rect x="24" y="16" width="52" height="76" rx="16" fill="#000" opacity="0.18" transform="translate(3 4)" />
      {[
        [22, 24],
        [70, 24],
        [22, 66],
        [70, 66],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="9" height="16" rx="3" fill="#23262e" />
      ))}
      <rect x="26" y="12" width="48" height="78" rx="15" fill={`url(#pv-${c})`} stroke={HUE[c][2]} strokeWidth="1.5" />
      {/* kaca depan, atap, kaca belakang */}
      <path d="M32 34 Q50 27 68 34 L65 46 Q50 42 35 46 Z" fill="url(#pl-glass)" />
      <rect x="35" y="46" width="30" height="22" rx="5" fill={HUE[c][1]} />
      <rect x="35" y="46" width="30" height="22" rx="5" fill="#fff" opacity="0.12" />
      <path d="M35 68 Q50 72 65 68 L66 77 Q50 80 34 77 Z" fill="url(#pl-glass)" opacity="0.9" />
      <circle cx="33" cy="16" r="3.5" fill="#fff8c4" stroke="#caa62a" strokeWidth="1" />
      <circle cx="67" cy="16" r="3.5" fill="#fff8c4" stroke="#caa62a" strokeWidth="1" />
      <rect x="29" y="85" width="9" height="3.5" rx="1.5" fill="#d42020" />
      <rect x="62" y="85" width="9" height="3.5" rx="1.5" fill="#d42020" />
      <path d="M40 22 Q50 19 60 22" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Fish({ c }: { c: Color }) {
  return (
    <g>
      <Shadow cy={82} rx={24} op={0.12} />
      <path d="M22 50 L6 34 Q9 50 6 66 Z" fill={HUE[c][1]} stroke={HUE[c][2]} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 34 Q50 16 64 30" fill={HUE[c][1]} stroke={HUE[c][2]} strokeWidth="1.5" />
      <ellipse cx="48" cy="50" rx="31" ry="20" fill={`url(#pl-${c})`} stroke={HUE[c][2]} strokeWidth="1.5" />
      <path d="M38 34 Q33 50 38 66 M50 31 Q45 50 50 69" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" />
      <path d="M44 58 Q52 66 58 58" fill={HUE[c][0]} opacity="0.7" />
      <circle cx="66" cy="45" r="6" fill="#fff" />
      <circle cx="67.5" cy="45" r="3.2" fill="#1b2433" />
      <circle cx="68.5" cy="44" r="1" fill="#fff" />
      <path d="M77 53 Q74 56 71 54" stroke={HUE[c][2]} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Gloss x={46} y={40} rx={9} ry={4} rot={-10} />
    </g>
  );
}

function Drum() {
  return (
    <g>
      <Shadow cy={88} rx={30} />
      <path d="M22 32 Q18 58 24 82 Q50 90 76 82 Q82 58 78 32 Z" fill="url(#pl-wood)" />
      {/* tali kendang */}
      <path d="M26 36 L34 80 L42 36 L50 82 L58 36 L66 80 L74 36" fill="none" stroke="#f2e2c0" strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
      <ellipse cx="50" cy="82" rx="26" ry="7" fill="#4a2a10" />
      <ellipse cx="50" cy="32" rx="28" ry="10" fill="#6b3d1b" />
      <ellipse cx="50" cy="31" rx="25" ry="8" fill="url(#pl-skin)" />
      <ellipse cx="44" cy="29" rx="8" ry="2.5" fill="#fff" opacity="0.6" />
    </g>
  );
}

function Bell() {
  return (
    <g>
      <Shadow cy={88} rx={24} />
      <path d="M46 14 Q50 8 54 14" fill="none" stroke="#6b470c" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 16 Q31 17 30 44 Q29 66 18 76 L82 76 Q71 66 70 44 Q69 17 50 16 Z" fill="url(#pl-gold)" stroke="#8a5d12" strokeWidth="1.5" />
      <path d="M22 72 L78 72" stroke="#8a5d12" strokeOpacity="0.5" strokeWidth="2" />
      <ellipse cx="50" cy="77" rx="32" ry="5" fill="#b8860b" stroke="#8a5d12" strokeWidth="1.5" />
      <circle cx="50" cy="84" r="6" fill="url(#pl-gold)" stroke="#6b470c" strokeWidth="1.2" />
      <path d="M40 26 Q35 40 36 58" stroke="#fff" strokeOpacity="0.65" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Maracas() {
  const one = (rot: number, c: Color) => (
    <g transform={`rotate(${rot} 50 60)`}>
      <rect x="46" y="48" width="8" height="40" rx="4" fill="url(#pl-wood)" />
      <ellipse cx="50" cy="34" rx="16" ry="20" fill={`url(#pl-${c})`} stroke={HUE[c][2]} strokeWidth="1.2" />
      <path d="M35 30 Q50 38 65 30 M36 42 Q50 50 64 42" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2.5" />
      <ellipse cx="44" cy="24" rx="4" ry="6" fill="#fff" opacity="0.55" />
    </g>
  );
  return (
    <g>
      <Shadow cy={90} rx={28} />
      {one(-24, 'merah')}
      {one(22, 'hijau')}
    </g>
  );
}

function Gong() {
  return (
    <g>
      <Shadow cy={92} rx={32} op={0.18} />
      <rect x="12" y="14" width="7" height="78" rx="3" fill="url(#pl-wood)" />
      <rect x="81" y="14" width="7" height="78" rx="3" fill="url(#pl-wood)" />
      <rect x="8" y="10" width="84" height="8" rx="4" fill="#7a2e1a" />
      <path d="M36 18 L42 30 M64 18 L58 30" stroke="#3b2a1a" strokeWidth="1.6" />
      <circle cx="50" cy="56" r="27" fill="url(#pl-bronze)" stroke="#5e3a10" strokeWidth="1.5" />
      <circle cx="50" cy="56" r="19" fill="none" stroke="#5e3a10" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="50" cy="56" r="9" fill="url(#pl-gold)" stroke="#6b470c" strokeWidth="1.2" />
      <ellipse cx="46" cy="52" rx="3" ry="2" fill="#fff" opacity="0.7" />
      <path d="M32 44 Q36 36 44 33" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function HandBell({ n }: { n: Note }) {
  const c = NOTE_COLOR[n];
  const k = { do: 1, re: 0.95, mi: 0.9, sol: 0.85, la: 0.8 }[n];
  return (
    <g transform={`translate(50 54) scale(${k}) translate(-50 -54)`}>
      <Shadow cy={90} rx={26} />
      {/* gagang */}
      <rect x="45" y="6" width="10" height="22" rx="4" fill="#fffaf0" stroke="#c9bfa8" strokeWidth="1.2" />
      <rect x="42" y="26" width="16" height="6" rx="3" fill="#d9d0bd" />
      <path d="M50 30 Q30 31 29 55 Q28 72 18 80 L82 80 Q72 72 71 55 Q70 31 50 30 Z" fill={`url(#pl-${c})`} stroke={HUE[c][2]} strokeWidth="1.5" />
      <ellipse cx="50" cy="81" rx="32" ry="5" fill={HUE[c][2]} />
      <path d="M37 40 Q33 50 34 64" stroke="#fff" strokeOpacity="0.6" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <text x="52" y="69" textAnchor="middle" fontFamily="var(--ff-baloo), system-ui, sans-serif" fontSize="19" fontWeight="900" fill="#fff" stroke={HUE[c][2]} strokeWidth="4" strokeLinejoin="round" paintOrder="stroke">
        {n}
      </text>
    </g>
  );
}

export function TokenArt({ t }: { t: Token }): ReactNode {
  if (t.k === 'bentuk') return <Candy s={t.s} c={t.c} />;
  if (t.k === 'nada') return <HandBell n={t.n} />;
  if (t.k === 'alat') return t.i === 'gendang' ? <Drum /> : t.i === 'lonceng' ? <Bell /> : t.i === 'marakas' ? <Maracas /> : <Gong />;
  if (t.o === 'bunga') return <Flower c={t.c} />;
  if (t.o === 'mobil') return <Car c={t.c} />;
  if (t.o === 'ikan') return <Fish c={t.c} />;
  if (t.o === 'permen') return <Candy s="lingkaran" c={t.c} />;
  return <Ball c={t.c} />;
}

/** benda sebagai ikon mandiri (tombol palet) */
export function TokenIcon({ t, size = 64 }: { t: Token; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <defs>{TOKEN_DEFS}</defs>
      <TokenArt t={t} />
    </svg>
  );
}
