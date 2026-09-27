'use client';

// Panggung & maskot Coding Agam: robot Agam (tampak atas untuk panggung, tampak depan untuk sapaan) dan
// diorama kotak-kotak per dunia — Kebun, Pantai, Salju, Gurun, Luar Angkasa — dengan rintangan khas tiap dunia.

import type { ReactNode } from 'react';
import { parse, type Level, type Theme } from '@/lib/koding/engine';

export const WORLD: Record<Theme, { name: string; tile: [string, string]; bg: string; ink: string; frame: string }> = {
  kebun: { name: 'Kebun', tile: ['#a5d86f', '#94cf5f'], bg: '#e9f5d8', ink: '#2f5a14', frame: '#fffaf0' },
  pantai: { name: 'Pantai', tile: ['#f6e3ad', '#f0d993'], bg: '#fdf3dc', ink: '#7a5412', frame: '#fffaf0' },
  salju: { name: 'Salju', tile: ['#fbfdff', '#e3edf7'], bg: '#e3eef8', ink: '#1f4a6e', frame: '#bcd3e6' },
  gurun: { name: 'Gurun', tile: ['#f2cf94', '#ebc27f'], bg: '#fbead2', ink: '#7a4a12', frame: '#fffaf0' },
  angkasa: { name: 'Luar Angkasa', tile: ['#34306b', '#2c2860'], bg: '#1c1a44', ink: '#e7e4ff', frame: '#141236' },
};
export const THEMES: Theme[] = ['kebun', 'pantai', 'salju', 'gurun', 'angkasa'];

/** Agam tampak atas: bodi bulat, visor bermata di sisi depan (atas), roda di kiri-kanan. */
function AgamTop({ bump }: { bump: boolean }) {
  return (
    <g className={bump ? 'robi-bump' : undefined}>
      <ellipse cx="0" cy="6" rx="36" ry="34" fill="#000" opacity="0.18" />
      <rect x="-44" y="-20" width="12" height="40" rx="5" fill="#3b4256" />
      <rect x="32" y="-20" width="12" height="40" rx="5" fill="#3b4256" />
      <circle r="34" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <path d="M-24 -14 Q0 -40 24 -14 L20 -8 Q0 -26 -20 -8 Z" fill="#1b2a4e" />
      <circle cx="-9" cy="-19" r="4.5" fill="#7df9ff" className="robi-eye" />
      <circle cx="9" cy="-19" r="4.5" fill="#7df9ff" className="robi-eye" />
      <circle cx="0" cy="6" r="7" fill="#178f78" />
      <circle cx="0" cy="6" r="3.5" fill="#ffd23f" />
      <path d="M-10 26 L0 34 L10 26" fill="none" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** Agam tampak depan, melambai. */
export function AgamFront({ size = 84, wave = true }: { size?: number; wave?: boolean }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} aria-hidden className={wave ? 'robi-wave' : undefined}>
      <line x1="60" y1="22" x2="60" y2="8" stroke="#178f78" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="7" fill="#ff6b5b" className="robi-led" />
      <rect x="18" y="20" width="84" height="66" rx="30" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <rect x="30" y="34" width="60" height="34" rx="17" fill="#1b2a4e" />
      <circle cx="47" cy="51" r="7" fill="#7df9ff" className="robi-eye" />
      <circle cx="73" cy="51" r="7" fill="#7df9ff" className="robi-eye" />
      <path d="M50 76 Q60 82 70 76" fill="none" stroke="#178f78" strokeWidth="4" strokeLinecap="round" />
      <rect x="36" y="88" width="48" height="30" rx="12" fill="#2ec4a6" stroke="#178f78" strokeWidth="5" />
      <circle cx="60" cy="103" r="6" fill="#ffd23f" />
      <rect x="8" y="90" width="24" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" transform="rotate(-35 20 96)" />
      <rect x="88" y="90" width="24" height="12" rx="6" fill="#2ec4a6" stroke="#178f78" strokeWidth="4" />
      <rect x="38" y="118" width="16" height="10" rx="4" fill="#3b4256" />
      <rect x="66" y="118" width="16" height="10" rx="4" fill="#3b4256" />
    </svg>
  );
}

/** angka semu-acak tetap per kotak (supaya dekorasi tidak berubah tiap render) */
const h = (x: number, y: number, k = 0) => (((x * 73856093) ^ (y * 19349663) ^ (k * 83492791)) >>> 0) % 1000 / 1000;

function Solid({ theme, X, Y, x, y }: { theme: Theme; X: number; Y: number; x: number; y: number }) {
  const shadow = <ellipse cx={X + 50} cy={Y + 74} rx="34" ry="10" fill="#000" opacity="0.15" />;
  if (theme === 'angkasa')
    return (
      <g>
        <circle cx={X + 50} cy={Y + 52} r="36" fill="#8a7e74" />
        <path d={`M${X + 22} ${Y + 40} Q${X + 40} ${Y + 18} ${X + 70} ${Y + 26}`} fill="none" stroke="#a3988d" strokeWidth="6" strokeLinecap="round" />
        <circle cx={X + 38} cy={Y + 50} r="9" fill="#6f655c" />
        <circle cx={X + 64} cy={Y + 64} r="6" fill="#6f655c" />
        <circle cx={X + 60} cy={Y + 40} r="4" fill="#6f655c" />
      </g>
    );
  if (theme === 'salju')
    // pohon cemara bersalju
    return (
      <g>
        {shadow}
        <rect x={X + 45} y={Y + 64} width="10" height="14" rx="2" fill="#7a5230" />
        <path d={`M${X + 50} ${Y + 10} L${X + 78} ${Y + 50} L${X + 64} ${Y + 50} L${X + 84} ${Y + 70} L${X + 16} ${Y + 70} L${X + 36} ${Y + 50} L${X + 22} ${Y + 50} Z`} fill="#2f7d5b" />
        <path d={`M${X + 50} ${Y + 10} L${X + 64} ${Y + 30} Q${X + 50} ${Y + 36} ${X + 36} ${Y + 30} Z M${X + 30} ${Y + 50} Q${X + 50} ${Y + 58} ${X + 70} ${Y + 50} L${X + 64} ${Y + 50} Q${X + 50} ${Y + 52} ${X + 36} ${Y + 50} Z`} fill="#ffffff" />
      </g>
    );
  if (theme === 'gurun')
    // kaktus
    return (
      <g>
        {shadow}
        <rect x={X + 42} y={Y + 18} width="16" height="58" rx="8" fill="#3f9b4f" />
        <path d={`M${X + 42} ${Y + 50} h-10 a6 6 0 0 1 -6 -6 v-14`} fill="none" stroke="#3f9b4f" strokeWidth="11" strokeLinecap="round" />
        <path d={`M${X + 58} ${Y + 42} h10 a6 6 0 0 0 6 -6 v-10`} fill="none" stroke="#3f9b4f" strokeWidth="11" strokeLinecap="round" />
        <path d={`M${X + 50} ${Y + 24} v44`} stroke="#2f7a3c" strokeWidth="2.5" />
        <circle cx={X + 50} cy={Y + 17} r="5" fill="#ff7aa8" />
      </g>
    );
  if (theme === 'kebun' && h(x, y, 1) < 0.45)
    // semak
    return (
      <g>
        {shadow}
        <circle cx={X + 34} cy={Y + 54} r="20" fill="#3f8f2f" />
        <circle cx={X + 66} cy={Y + 54} r="20" fill="#3f8f2f" />
        <circle cx={X + 50} cy={Y + 38} r="24" fill="#4ea63a" />
        <circle cx={X + 40} cy={Y + 32} r="4" fill="#ff5a6e" />
        <circle cx={X + 62} cy={Y + 46} r="4" fill="#ff5a6e" />
      </g>
    );
  // batu
  return (
    <g>
      <ellipse cx={X + 50} cy={Y + 62} rx="38" ry="12" fill="#000" opacity="0.15" />
      <path d={`M${X + 16} ${Y + 64} Q${X + 20} ${Y + 26} ${X + 50} ${Y + 22} Q${X + 82} ${Y + 26} ${X + 84} ${Y + 64} Z`} fill="#9aa1a8" />
      <path d={`M${X + 30} ${Y + 40} Q${X + 44} ${Y + 30} ${X + 58} ${Y + 34}`} fill="none" stroke="#c9ced3" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Liquid({ theme, X, Y }: { theme: Theme; X: number; Y: number }) {
  if (theme === 'salju')
    // kolam es tipis yang retak
    return (
      <g>
        <rect x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill="#9fd3f0" />
        <rect x={X + 10} y={Y + 10} width="80" height="80" rx="10" fill="#bfe4f7" />
        <path d={`M${X + 30} ${Y + 20} l12 22 l-8 14 l16 24 M${X + 42} ${Y + 42} l24 -8 l10 18`} fill="none" stroke="#6fb3d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${X + 16} ${Y + 18} l14 0`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  // air (kolam, laut, oasis)
  const deep = theme === 'pantai' ? '#4aa9e0' : '#5bb8ea';
  return (
    <g>
      <rect x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill={deep} />
      {theme === 'gurun' && <rect x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill="none" stroke="#7cc46a" strokeWidth="8" />}
      <path d={`M${X + 16} ${Y + 40} q12 -9 24 0 t24 0 t24 0 M${X + 16} ${Y + 66} q12 -9 24 0 t24 0 t24 0`} fill="none" stroke="#d6f1ff" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Decor({ theme, X, Y, x, y }: { theme: Theme; X: number; Y: number; x: number; y: number }) {
  const r = h(x, y, 2);
  if (r > 0.3) return null;
  const px = X + 18 + h(x, y, 3) * 60,
    py = Y + 18 + h(x, y, 4) * 60;
  if (theme === 'kebun')
    return r < 0.12 ? (
      <g>
        <circle cx={px} cy={py} r="5" fill="#fff" />
        <circle cx={px} cy={py} r="2.2" fill="#ffc93c" />
      </g>
    ) : (
      <path d={`M${px} ${py + 8} l4 -12 l4 12 l4 -9 l3 9`} fill="none" stroke="#6fae3a" strokeWidth="3" strokeLinecap="round" />
    );
  if (theme === 'pantai') return <path d={`M${px - 7} ${py + 4} q7 -14 14 0 z`} fill="#f7b7a3" stroke="#e08c73" strokeWidth="2" />;
  if (theme === 'salju') return <circle cx={px} cy={py} r="3" fill="#c9dcec" />;
  if (theme === 'gurun') return <ellipse cx={px} cy={py} rx="5" ry="3" fill="#d4a562" />;
  return <circle cx={px} cy={py} r="2.5" fill="#fff" opacity="0.7" />;
}

export function Stage({ level, pos, rot, bump, won }: { level: Level; pos: { x: number; y: number }; rot: number; bump: boolean; won: boolean }) {
  const p = parse(level);
  const W = WORLD[level.theme];
  const cells: ReactNode[] = [];
  for (let y = 0; y < p.h; y++)
    for (let x = 0; x < p.w; x++) {
      const c = p.cell(x, y);
      const X = x * 100,
        Y = y * 100;
      cells.push(<rect key={`t${x}-${y}`} x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill={W.tile[(x + y) % 2]} />);
      if (c === '~') cells.push(<Liquid key={`w${x}-${y}`} theme={level.theme} X={X} Y={Y} />);
      else if (c === '#') cells.push(<Solid key={`r${x}-${y}`} theme={level.theme} X={X} Y={Y} x={x} y={y} />);
      else if (c === '.') cells.push(<Decor key={`d${x}-${y}`} theme={level.theme} X={X} Y={Y} x={x} y={y} />);
    }
  return (
    <svg viewBox={`-6 -6 ${p.w * 100 + 12} ${p.h * 100 + 12}`} className="block h-full w-full" role="img" aria-label="Panggung Agam">
      <rect x="-6" y="-6" width={p.w * 100 + 12} height={p.h * 100 + 12} rx="22" fill={W.frame} />
      {cells}
      <circle cx={p.start.x * 100 + 50} cy={p.start.y * 100 + 50} r="30" fill="none" stroke={level.theme === 'salju' ? '#9bb8d0' : '#fff'} strokeOpacity="0.8" strokeWidth="5" strokeDasharray="8 8" />
      <g transform={`translate(${p.goal.x * 100 + 50} ${p.goal.y * 100 + 50})`}>
        <circle r="38" fill="#ffd23f" opacity="0.28" className="goal-pulse" />
        <path d="M0 -30 L9 -9 L31 -8 L14 6 L20 28 L0 16 L-20 28 L-14 6 L-31 -8 L-9 -9 Z" fill={won ? '#ffb000' : '#ffd23f'} stroke="#e0a100" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <g className="robi-move" style={{ transform: `translate(${pos.x * 100 + 50}px, ${pos.y * 100 + 50}px)` }}>
        <g className="robi-turn" style={{ transform: `rotate(${rot}deg)` }}>
          <AgamTop bump={bump} />
        </g>
      </g>
    </svg>
  );
}
