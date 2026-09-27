'use client';

// Panggung Coding Agam · Pola (Pabrik Pola): benda-benda lewat di BAN BERJALAN di tengah lantai pabrik/toko bertema
// (10 tema sendiri di skin-pola.tsx). Agam berapron berjalan di jalur pemeriksa di bawah ban dan menyorot tiap benda
// dengan lampunya; benda yang disorot melompat kecil sambil berbunyi.
// Deretan dibagi ke beberapa baris (dibaca kiri → kanan seperti tulisan) supaya benda tetap besar di layar mana pun.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Fill, PolaLevel } from '@/lib/koding/pola';
import { COMMON_DEFS, h, type ThemeArt } from './art';
import { TOKEN_DEFS, TokenArt } from './pola-art';
import { AgamWorkerTop } from './skin-pola';
import { tileAt } from './stage';

const PADX = 20;
const PADT = 16;
/** tinggi satu baris: kotak benda 100 + jalur Agam 64 */
const ROW = 164;

export type PolaStageProps = {
  level: PolaLevel;
  /** tema Level ini (skin Pola) */
  art: ThemeArt;
  fill: Fill;
  sel: number | null;
  agam: number;
  bump: boolean;
  pop: { i: number; n: number } | null;
  bad: number | null;
  glow: number[];
  won: boolean;
  onSlot: (i: number) => void;
};

/** jumlah kolom yang membuat benda paling besar di bingkai ini */
function layout(n: number, aw: number, ah: number) {
  const opts: { c: number; r: number; t: number }[] = [];
  for (let c = Math.min(n, 3); c <= n; c++) {
    const r = Math.ceil(n / c);
    // baris terakhir jangan terlalu pendek (lebih mudah dibaca)
    if (r > 1 && n - (r - 1) * c < Math.ceil(c / 2)) continue;
    opts.push({ c, r, t: Math.min(aw / (c * 100 + PADX * 2), ah / (r * ROW + PADT + 6)) });
  }
  // pola paling mudah dibaca dalam satu baris: pakai baris sesedikit mungkin selama benda masih ≥ 72 px
  const best = opts.reduce((a, b) => (b.t > a.t ? b : a));
  const few = opts.filter((o) => o.t >= 0.72).sort((a, b) => a.r - b.r || b.t - a.t)[0] ?? best;
  return { ...few, t: Math.min(few.t, 1.35) };
}

export function PolaStage(props: PolaStageProps) {
  const W = props.art;
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="koding-frame relative h-full w-full overflow-hidden rounded-[22px]" style={{ background: W.frame }}>
      {size.w > 0 && size.h > 0 && <Board {...props} aw={size.w} ah={size.h} />}
    </div>
  );
}

function Board({ level, art, fill, sel, agam, bump, pop, bad, glow, won, onSlot, aw, ah }: PolaStageProps & { aw: number; ah: number }) {
  const A = art;
  const n = level.seq.length;
  const { c: cols, r: rows, t } = layout(n, aw, ah);
  const VW = aw / t,
    VH = ah / t;
  const pw = cols * 100 + PADX * 2,
    ph = rows * ROW + PADT + 6;
  const px = (VW - pw) / 2,
    py = (VH - ph) / 2;
  const blanks = new Set(level.blanks);
  const glowSet = new Set(glow);

  // dasar papan: ubin tema sejajar dengan kolom deretan + hiasan di luar panel
  const bg: ReactNode[] = [];
  const x0 = ((px + PADX) % 100) - 100,
    y0 = (py % 100) - 100;
  for (let Y = y0, gy = 0; Y < VH; Y += 100, gy++)
    for (let X = x0, gx = 0; X < VW; X += 100, gx++) {
      bg.push(tileAt(A, X, Y, gx + gy, `t${gx}-${gy}`));
      const inPanel = X + 100 > px - 4 && X < px + pw + 4 && Y + 100 > py - 4 && Y < py + ph + 12;
      if (inPanel) continue;
      const r = h(gx, gy, 5);
      const art = r < 0.2 ? A.solid(X, Y, gx, gy) : r < 0.55 ? A.decor(X, Y, gx, gy) : null;
      if (art) bg.push(<g key={`a${gx}-${gy}`}>{art}</g>);
    }

  const slotXY = (i: number) => ({ x: px + PADX + (i % cols) * 100, y: py + PADT + Math.floor(i / cols) * ROW });
  const ag = slotXY(Math.max(0, Math.min(n - 1, agam)));
  const dark = !!A.dark;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 block h-full w-full" role="img" aria-label="Deretan pola">
      <defs>
        {COMMON_DEFS}
        {A.defs}
        {TOKEN_DEFS}
        <linearGradient id="pl-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe4ea" />
          <stop offset="0.5" stopColor="#c3cad3" />
          <stop offset="1" stopColor="#a9b1bc" />
        </linearGradient>
        <radialGradient id="pl-roller" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#e9edf1" />
          <stop offset="0.6" stopColor="#8e98a4" />
          <stop offset="1" stopColor="#4b535e" />
        </radialGradient>
        <pattern id="pl-grate" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#8a939e" />
          <circle cx="7" cy="7" r="3.2" fill="#5d6570" />
        </pattern>
        <pattern id="pl-hazard" width="20" height="7" patternUnits="userSpaceOnUse">
          <rect width="20" height="7" fill="#ffc21a" />
          <path d="M0 7 L7 0 H12 L5 7 Z M10 7 L17 0 H20 V2 L15 7 Z" fill="#23262c" />
        </pattern>
      </defs>
      {bg}
      {/* rangka ban berjalan: kaki besi, ban karet yang bergerak, rol di kedua ujung, jalur pemeriksa Agam */}
      <rect x={px} y={py + 10} width={pw} height={ph} rx="24" fill="#000" opacity="0.18" />
      <rect x={px} y={py} width={pw} height={ph} rx="24" fill="url(#pl-steel)" stroke="#5b6472" strokeWidth="3" />
      <rect x={px + 6} y={py + 6} width={pw - 12} height={ph - 12} rx="19" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
      {Array.from({ length: rows }, (_, r) => {
        const cnt = Math.min(cols, n - r * cols);
        const by = py + PADT + r * ROW;
        const bx = px + PADX - 8;
        const bw = cnt * 100 + 16;
        const ly = by + 106;
        return (
          <g key={`lane${r}`}>
            {/* ban karet */}
            <rect x={bx} y={by + 10} width={bw} height="84" rx="42" fill="#2b2f36" />
            <rect x={bx + 4} y={by + 14} width={bw - 8} height="76" rx="38" fill="#3a3f48" />
            <line x1={bx + 40} y1={by + 52} x2={bx + bw - 40} y2={by + 52} stroke="#4c525c" strokeWidth="70" strokeDasharray="4 22" className="pola-belt" />
            {[bx + 42, bx + bw - 42].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy={by + 52} r="30" fill="url(#pl-roller)" stroke="#23262c" strokeWidth="2" />
                <circle cx={cx} cy={by + 52} r="7" fill="#9aa3ad" stroke="#5b6472" strokeWidth="2" />
              </g>
            ))}
            {/* jalur pemeriksa: pelat berlubang + garis kuning-hitam */}
            <rect x={px + PADX + 2} y={ly} width={cnt * 100 - 4} height="50" rx="10" fill="url(#pl-grate)" stroke="#6b7480" strokeWidth="2" />
            <rect x={px + PADX + 2} y={ly} width={cnt * 100 - 4} height="7" fill="url(#pl-hazard)" />
          </g>
        );
      })}
      {level.seq.map((tok, i) => {
        const { x, y } = slotXY(i);
        const isBlank = blanks.has(i);
        const shown = isBlank ? fill[i] : tok;
        const isSel = isBlank && sel === i;
        const isBad = bad === i;
        const popping = pop?.i === i;
        const ok = won;
        return (
          <g key={i} onClick={() => onSlot(i)} style={{ cursor: 'pointer' }} className={isBad ? 'pola-bad' : undefined}>
            <rect x={x + 5} y={y + 7} width="90" height="90" rx="20" fill="#000" opacity="0.1" />
            <rect
              x={x + 5}
              y={y + 4}
              width="90"
              height="90"
              rx="20"
              fill={isBlank && !shown ? (dark ? 'rgba(255,255,255,.08)' : '#f3ecdc') : '#fffdf7'}
              stroke={isBad ? '#e04f5f' : isSel ? '#ffb000' : glowSet.has(i) || ok ? '#f2b705' : isBlank ? (dark ? 'rgba(255,255,255,.45)' : '#bfae8a') : dark ? 'rgba(0,0,0,.2)' : '#e8dec8'}
              strokeWidth={isBad || isSel ? 5 : glowSet.has(i) ? 5 : isBlank ? 3 : 1.5}
              strokeDasharray={isBlank && !isSel && !isBad ? '9 7' : undefined}
              className={isSel ? 'pola-sel' : glowSet.has(i) ? 'pola-glow' : undefined}
            />
            <text x={x + 16} y={y + 22} fontFamily="var(--ff-baloo), system-ui, sans-serif" fontSize="14" fontWeight="800" fill={isBlank && !shown && dark ? 'rgba(255,255,255,.55)' : '#a89c84'}>
              {i + 1}
            </text>
            {shown ? (
              <g key={popping ? `p${pop!.n}` : 's'} className={popping ? 'pola-pop' : undefined}>
                <g transform={`translate(${x + 11} ${y + 9}) scale(0.78)`}>
                  <TokenArt t={shown} />
                </g>
              </g>
            ) : (
              <text x={x + 50} y={y + 66} textAnchor="middle" fontFamily="var(--ff-baloo), system-ui, sans-serif" fontSize="48" fontWeight="900" fill={isSel ? '#ffb000' : dark ? 'rgba(255,255,255,.5)' : '#c9b994'} className={isSel ? 'pola-q' : undefined}>
                ?
              </text>
            )}
          </g>
        );
      })}
      <g className="robi-move" style={{ transform: `translate(${ag.x + 50}px, ${ag.y + 131}px)` }} pointerEvents="none">
        <g transform="scale(0.6)">
          <AgamWorkerTop bump={bump} />
        </g>
      </g>
    </svg>
  );
}
