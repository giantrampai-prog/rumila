'use client';

// Panggung Coding Agam · Pola: deretan benda di atas papan (dasar bertema seperti Langkah). Agam berjalan di jalur
// di bawah deretan dan menyorot tiap benda dengan lampunya; benda yang disorot melompat kecil sambil berbunyi.
// Deretan dibagi ke beberapa baris (dibaca kiri → kanan seperti tulisan) supaya benda tetap besar di layar mana pun.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Fill, PolaLevel } from '@/lib/koding/pola';
import { COMMON_DEFS, h } from './art';
import { TOKEN_DEFS, TokenArt } from './pola-art';
import { AgamTop, tileAt, WORLD } from './stage';

const PADX = 20;
const PADT = 16;
/** tinggi satu baris: kotak benda 100 + jalur Agam 64 */
const ROW = 164;

export type PolaStageProps = {
  level: PolaLevel;
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
  return (
    <div ref={box} className="koding-frame relative h-full w-full overflow-hidden rounded-[22px]" style={{ background: W.frame }}>
      {size.w > 0 && size.h > 0 && <Board {...props} aw={size.w} ah={size.h} />}
    </div>
  );
}

function Board({ level, fill, sel, agam, bump, pop, bad, glow, won, onSlot, aw, ah }: PolaStageProps & { aw: number; ah: number }) {
  const A = WORLD[level.theme];
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
      bg.push(tileAt(level.theme, X, Y, gx + gy, `t${gx}-${gy}`));
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
      </defs>
      {bg}
      {/* panel deretan */}
      <rect x={px} y={py + 8} width={pw} height={ph} rx="28" fill="#000" opacity="0.16" />
      <rect x={px} y={py} width={pw} height={ph} rx="28" fill={A.frame} opacity="0.95" stroke={dark ? 'rgba(255,255,255,.12)' : 'rgba(35,48,74,.1)'} strokeWidth="2" />
      {Array.from({ length: rows }, (_, r) => {
        const cnt = Math.min(cols, n - r * cols);
        const ly = py + PADT + r * ROW + 106;
        return (
          <g key={`lane${r}`}>
            <rect x={px + PADX + 4} y={ly} width={cnt * 100 - 8} height="50" rx="25" fill={dark ? 'rgba(255,255,255,.09)' : 'rgba(35,48,74,.1)'} />
            <line x1={px + PADX + 30} y1={ly + 25} x2={px + PADX + cnt * 100 - 30} y2={ly + 25} stroke={dark ? 'rgba(255,255,255,.35)' : '#fff'} strokeOpacity="0.8" strokeWidth="4" strokeDasharray="10 14" strokeLinecap="round" />
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
          <AgamTop bump={bump} />
        </g>
      </g>
    </svg>
  );
}
