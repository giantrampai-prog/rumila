'use client';

// Panggung & maskot Coding Agam: robot Agam (tampak atas untuk panggung, tampak depan untuk sapaan) dan
// papan kotak-kotak bertema (10 tema, gambarnya di art.tsx) yang selalu memenuhi bingkai.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { parse, THEME_ORDER, type Level, type Theme } from '@/lib/koding/engine';
import { ART, COMMON_DEFS, type ThemeArt } from './art';

export const WORLD = ART;
export const THEMES: Theme[] = THEME_ORDER;

/**
 * Agam tampak atas (depan = atas, ikut diputar sesuai arah hadap). Supaya anak langsung tahu Agam menghadap ke
 * mana: sorot lampu kuning + panah putih di kotak depannya (ke sanalah "maju" berjalan), wajah bermata besar di
 * sisi depan kepala, bemper & lampu depan, badan meruncing ke depan seperti mobil mainan, antena di belakang.
 */
export function AgamTop({ bump }: { bump: boolean }) {
  return (
    <g className={bump ? 'robi-bump' : undefined}>
      {/* sorot lampu ke kotak depan */}
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
      {/* badan meruncing ke depan */}
      <path d="M-30 30 Q-32 36 -25 37 L25 37 Q32 36 30 30 L27 -20 Q25 -35 12 -37 L-12 -37 Q-25 -35 -27 -20 Z" fill="url(#ka-agam)" stroke="#0f7a66" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-20 -28 Q-22 -6 -21 20" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" fill="none" />
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
      <path d="M-6 5 Q0 10 6 5" stroke="#0f7a66" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* antena di belakang */}
      <path d="M0 24 L0 31" stroke="#0f7a66" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="0" cy="33" r="4.5" fill="#ff6b5b" className="robi-led" />
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
export const tileAt = (theme: Theme | ThemeArt, X: number, Y: number, k: number, key: string) => {
  const A = typeof theme === 'string' ? ART[theme] : theme;
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
export function ThemeVignette({ theme, art }: { theme?: Theme; art?: ThemeArt }) {
  const A = art ?? ART[theme!];
  // digambar setelah terpasang di peramban: koordinat pecahan bisa beda format antara server & klien
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div style={{ aspectRatio: '6 / 1', background: A.frame }} />;
  const cells: ReactNode[] = [];
  for (let x = 0; x < 6; x++) {
    const X = x * 100;
    cells.push(tileAt(A, X, 0, x, `t${x}`));
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
