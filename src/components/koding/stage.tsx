'use client';

// Panggung & maskot Coding Agam: robot Agam (tampak atas untuk panggung, tampak depan untuk sapaan) dan
// papan kotak-kotak bertema (10 tema, gambarnya di art.tsx) yang selalu memenuhi bingkai.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { parse, THEME_ORDER, type Level, type Theme } from '@/lib/koding/engine';
import { ART, COMMON_DEFS } from './art';

export const WORLD = ART;
export const THEMES: Theme[] = THEME_ORDER;

/** Agam tampak atas: bodi bulat, visor bermata di sisi depan (atas), roda di kiri-kanan. */
function AgamTop({ bump }: { bump: boolean }) {
  return (
    <g className={bump ? 'robi-bump' : undefined}>
      <ellipse cx="0" cy="6" rx="36" ry="34" fill="#000" opacity="0.18" />
      <rect x="-44" y="-20" width="12" height="40" rx="5" fill="#3b4256" />
      <rect x="32" y="-20" width="12" height="40" rx="5" fill="#3b4256" />
      <circle r="34" fill="url(#ka-agam)" stroke="#178f78" strokeWidth="5" />
      <ellipse cx="-12" cy="-4" rx="10" ry="16" fill="#fff" opacity="0.18" transform="rotate(30 -12 -4)" />
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

/**
 * Papan selalu memenuhi bingkai di semua level. Ukuran kotak seragam (paling besar seperlima sisi terpendek
 * bingkai); ruang sisa diisi kotak tambahan di sekeliling peta yang berisi rintangan khas dunia (semak/batu,
 * laut, cemara/es, kaktus, asteroid). Di mesin, luar peta memang dinding, jadi aturan & solusi tidak berubah.
 */
const MIN_CELLS = 5;
const PAD = 6;

type StageProps = { level: Level; pos: { x: number; y: number }; rot: number; bump: boolean; won: boolean };

export function Stage(props: StageProps) {
  const p = parse(props.level);
  const W = WORLD[props.level.theme];
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const aw = Math.max(0, size.w - PAD * 2),
    ah = Math.max(0, size.h - PAD * 2);
  const t0 = Math.min(aw / p.w, ah / p.h, Math.min(aw, ah) / MIN_CELLS, 120);
  const cols = t0 > 0 ? Math.max(p.w, Math.floor(aw / t0)) : p.w,
    rows = t0 > 0 ? Math.max(p.h, Math.floor(ah / t0)) : p.h;
  const tile = Math.floor(Math.min(aw / cols, ah / rows));
  return (
    <div ref={box} className="koding-frame flex h-full w-full items-center justify-center overflow-hidden rounded-[22px]" style={{ background: W.frame }}>
      {tile > 0 && (
        <div style={{ width: tile * cols, height: tile * rows }}>
          <Board {...props} cols={cols} rows={rows} />
        </div>
      )}
    </div>
  );
}

/** kotak di luar peta: selalu rintangan (padat atau cair sesuai tema), supaya jelas tidak bisa dilewati */
const outside = (theme: Theme, X: number, Y: number, x: number, y: number) => {
  const A = ART[theme];
  return hash(x, y) < A.outLiquid ? A.liquid(X, Y, x, y) : A.solid(X, Y, x, y);
};
const hash = (x: number, y: number) => (((x * 2654435761) ^ (y * 40503)) >>> 0) % 1000 / 1000;

/** ubin: warna dasar + tekstur tema + kilap tepi atas */
const tileAt = (theme: Theme, X: number, Y: number, k: number, key: string) => {
  const A = ART[theme];
  return (
    <g key={key}>
      <rect x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill={A.tile[k % 2]} />
      <rect x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill={`url(#${A.tex})`} />
      <rect x={X + 2} y={Y + 2} width="96" height="96" rx="14" fill="url(#ka-bevel)" />
    </g>
  );
};

function Board({ level, pos, rot, bump, won, cols, rows }: StageProps & { cols: number; rows: number }) {
  const p = parse(level);
  // peta asli di tengah papan
  const ox = Math.floor((cols - p.w) / 2),
    oy = Math.floor((rows - p.h) / 2);
  const A = ART[level.theme];
  const cells: ReactNode[] = [];
  for (let gy = 0; gy < rows; gy++)
    for (let gx = 0; gx < cols; gx++) {
      const x = gx - ox,
        y = gy - oy;
      const X = gx * 100,
        Y = gy * 100;
      const inside = x >= 0 && y >= 0 && x < p.w && y < p.h;
      cells.push(tileAt(level.theme, X, Y, gx + gy, `t${gx}-${gy}`));
      const c = inside ? p.cell(x, y) : null;
      const art = c === null ? outside(level.theme, X, Y, gx, gy) : c === '~' ? A.liquid(X, Y, gx, gy) : c === '#' ? A.solid(X, Y, gx, gy) : c === '.' ? A.decor(X, Y, gx, gy) : null;
      if (art) cells.push(<g key={`a${gx}-${gy}`}>{art}</g>);
    }
  const cx = (x: number) => (x + ox) * 100 + 50,
    cy = (y: number) => (y + oy) * 100 + 50;
  return (
    <svg viewBox={`0 0 ${cols * 100} ${rows * 100}`} className="block h-full w-full" role="img" aria-label="Panggung Agam">
      <defs>
        {COMMON_DEFS}
        {A.defs}
      </defs>
      {cells}
      <circle cx={cx(p.start.x)} cy={cy(p.start.y)} r="30" fill="none" stroke={level.theme === 'salju' ? '#9bb8d0' : '#fff'} strokeOpacity="0.8" strokeWidth="5" strokeDasharray="8 8" />
      <g transform={`translate(${cx(p.goal.x)} ${cy(p.goal.y)})`}>
        <circle r="38" fill="#ffd23f" opacity="0.28" className="goal-pulse" />
        <path d="M0 -30 L9 -9 L31 -8 L14 6 L20 28 L0 16 L-20 28 L-14 6 L-31 -8 L-9 -9 Z" fill={won ? '#ffb000' : '#ffd23f'} stroke="#e0a100" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <g className="robi-move" style={{ transform: `translate(${cx(pos.x)}px, ${cy(pos.y)}px)` }}>
        <g className="robi-turn" style={{ transform: `rotate(${rot}deg)` }}>
          <AgamTop bump={bump} />
        </g>
      </g>
    </svg>
  );
}

/** potongan pemandangan tema untuk kartu Level di peta: 6 kotak berisi rintangan & hiasan khas */
export function ThemeVignette({ theme }: { theme: Theme }) {
  const A = ART[theme];
  // digambar setelah terpasang di peramban: koordinat pecahan bisa beda format antara server & klien
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div style={{ aspectRatio: '6 / 1', background: A.frame }} />;
  const cells: ReactNode[] = [];
  for (let x = 0; x < 6; x++) {
    const X = x * 100;
    cells.push(tileAt(theme, X, 0, x, `t${x}`));
    const art = x === 1 || x === 4 ? A.solid(X, 0, x + 3, 7) : x === 2 ? A.liquid(X, 0, x, 7) : A.decor(X, 0, x * 5, 3) ?? A.decor(X, 0, x + 11, 1);
    if (art) cells.push(<g key={`a${x}`}>{art}</g>);
  }
  return (
    <svg viewBox="0 0 600 100" className="block h-auto w-full" aria-hidden preserveAspectRatio="xMidYMid slice" style={{ background: A.frame }}>
      <defs>
        {COMMON_DEFS}
        {A.defs}
      </defs>
      {cells}
    </svg>
  );
}
