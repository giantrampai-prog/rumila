'use client';

// Coding Agam · Ulangi = AGAM PELUKIS. Tampak atas: Agam memegang alat gambar (krayon, kapur, kuas, canting, …) dan
// menggambar garis di kanvas mengikuti pola putus-putus (garis, persegi, tangga, pagar, ular, jendela, plus, kincir).
// Blok ulangi membuat gambar yang panjang jadi program pendek. Menggores di luar pola = salah (kuas berhenti,
// garis merah). 10 kanvas sendiri (skin-ulangi.tsx), soal di src/lib/koding/ulangi.ts.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { describeList, type Step } from '@/lib/koding/prog';
import { ULANGI } from '@/lib/koding/ulangi';
import { paintWorld, segKey, type PaintData, type UlangiLevel } from '@/lib/koding/worlds';
import { sfx } from '@/lib/sfx';
import { COMMON_DEFS } from './art';
import { ProgGame, type Adapter, type ProgGameConfig } from './prog-game';
import { wait } from './shared';
import { AgamPainterFront, AgamPainterTop, ULANGI_THEMES } from './skin-ulangi';
import type { CanvasTheme } from './skin-types';

const ACCENT = '#e8590c';
const WORD: Record<string, string> = { maju: 'maju', kiri: 'belok kiri', kanan: 'belok kanan' };
/** tepi kanvas di luar titik grid (satuan papan) */
const M = 70;

const seg = (k: string) => {
  const [p, q] = k.split(':').map((t) => t.split(',').map(Number));
  return `M${p[0] * 100 + M} ${p[1] * 100 + M} L${q[0] * 100 + M} ${q[1] * 100 + M}`;
};

function Canvas({ level, T, pos, rot, drawn, fresh, wrong, bump, won }: { level: UlangiLevel; T: CanvasTheme; pos: { x: number; y: number }; rot: number; drawn: string[]; fresh: string | null; wrong: string | null; bump: boolean; won: boolean }) {
  const w = (level.cols - 1) * 100 + M * 2,
    h = (level.rows - 1) * 100 + M * 2;
  const P = 60;
  return (
    <svg viewBox={`${-P} ${-P} ${w + P * 2} ${h + P * 2}`} className="block h-full w-full" role="img" aria-label={`Kanvas ${T.name}`}>
      <defs>
        {COMMON_DEFS}
        {T.defs}
      </defs>
      <rect x={-14} y={-10} width={w + 28} height={h + 28} rx="22" fill="#000" opacity="0.18" />
      <rect x={-12} y={-12} width={w + 24} height={h + 24} rx="20" fill={T.frame} />
      <g>{T.surface(w, h)}</g>
      {/* titik grid */}
      {Array.from({ length: level.rows }, (_, y) =>
        Array.from({ length: level.cols }, (_, x) => <circle key={`${x}-${y}`} cx={x * 100 + M} cy={y * 100 + M} r="5" fill={T.dot} />),
      )}
      {/* pola yang harus digambar */}
      <g fill="none" stroke={T.guide.color} strokeWidth={T.guide.width} strokeDasharray={T.guide.dash} strokeOpacity={T.guide.opacity} strokeLinecap="round">
        {level.target.map((k) => (
          <path key={k} d={seg(k)} />
        ))}
      </g>
      {/* goresan Agam */}
      {drawn.map((k) => (
        <g key={k} className={k === fresh ? 'paint-new' : undefined}>
          {T.stroke(seg(k))}
        </g>
      ))}
      {wrong && <path d={seg(wrong)} stroke="#e04f5f" strokeWidth="12" strokeLinecap="round" strokeDasharray="4 16" fill="none" className="koding-bad" />}
      {won && (
        <g className="ka-twinkle" fill="#ffd23f">
          {[0.1, 0.35, 0.65, 0.9].map((f, i) => (
            <path key={i} d={`M${w * f} ${i % 2 ? -26 : h + 26} l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 z`} />
          ))}
        </g>
      )}
      <g>{T.props(w, h)}</g>
      <g className="robi-move" style={{ transform: `translate(${pos.x * 100 + M}px, ${pos.y * 100 + M}px)` }}>
        <g className="robi-turn" style={{ transform: `rotate(${rot}deg)` }}>
          <g transform="scale(0.72)">
            <AgamPainterTop bump={bump} />
          </g>
        </g>
      </g>
    </svg>
  );
}

function useUlangi(level: UlangiLevel | null): Adapter {
  const T = ULANGI_THEMES[level?.world ?? 0];
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rot, setRot] = useState(0);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const [won, setWon] = useState(false);
  const dirRef = useRef(0);

  const reset = useCallback(() => {
    if (!level) return;
    setPos(level.start);
    setRot(level.dir * 90);
    dirRef.current = level.dir;
    setDrawn([]);
    setFresh(null);
    setWrong(null);
    setBump(false);
    setWon(false);
  }, [level]);
  useEffect(reset, [reset]);

  return {
    stage: level ? (
      <div className="koding-frame h-full w-full overflow-hidden rounded-[22px]" style={{ background: T.bg }}>
        <Canvas level={level} T={T} pos={pos} rot={rot} drawn={drawn} fresh={fresh} wrong={wrong} bump={bump} won={won} />
      </div>
    ) : null,
    reset,
    world: () => paintWorld(level!),
    async play(s: Step) {
      const d = s.data as PaintData;
      if (s.kind === 'turn') {
        const turn = (d.dir - dirRef.current + 4) % 4 === 1 ? 90 : -90;
        dirRef.current = d.dir;
        setRot((r) => r + turn);
        sfx.whoosh();
        await wait(320);
      } else if (s.kind === 'paint') {
        const key = segKey(d.from!.x, d.from!.y, d.x, d.y);
        setPos({ x: d.x, y: d.y });
        setDrawn((l) => (l.includes(key) ? l : [...l, key]));
        setFresh(key);
        sfx.brush();
        await wait(400);
      } else {
        const DX = [0, 1, 0, -1],
          DY = [-1, 0, 1, 0];
        const f = d.from ?? { x: d.x, y: d.y };
        const nx = f.x + DX[d.dir],
          ny = f.y + DY[d.dir];
        setWrong(segKey(f.x, f.y, nx, ny));
        setPos({ x: f.x + DX[d.dir] * 0.3, y: f.y + DY[d.dir] * 0.3 });
        await wait(180);
        sfx.thud();
        setBump(true);
        setPos(f);
        await wait(560);
        setBump(false);
      }
    },
    after(r) {
      if (r === 'win') setWon(true);
    },
    failSay(r) {
      if (r === 'bump') return `Ups, ${T.tool} Agam keluar dari pola! Periksa blok yang berkedip merah.`;
      if (r === 'short') return 'Gambarnya belum lengkap. Tambah perintah lagi, ya.';
      return null;
    },
  };
}

const CFG: ProgGameConfig<UlangiLevel> = {
  title: 'Ulangi',
  tool: 'koding-ulangi',
  levels: ULANGI,
  worlds: ULANGI_THEMES.map((t) => ({
    name: t.name,
    bg: t.bg,
    ink: t.ink,
    dark: t.dark,
    vignette: (
      <svg viewBox="0 0 600 100" className="block h-auto w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <defs>{t.defs}</defs>
        {t.surface(600, 100)}
        {t.stroke('M60 70 L160 70 L160 30 L260 30 L260 70 L360 70 L360 30 L460 30 L460 70 L540 70')}
      </svg>
    ),
  })),
  pageBg: (w) => ULANGI_THEMES[w].bg,
  dark: (w) => !!ULANGI_THEMES[w].dark,
  mascot: (size) => <AgamPainterFront size={size} />,
  accent: ACCENT,
  paper: 'ulangi-paper',
  look: {
    acts: {
      maju: { label: 'maju', icon: <Icon name="arrow_upward" size={26} />, c: '#3a86ff', d: '#2463c9' },
      kiri: { label: 'belok kiri', icon: <Icon name="turn_left" size={26} />, c: '#8b5cf6', d: '#6a3fd1' },
      kanan: { label: 'belok kanan', icon: <Icon name="turn_right" size={26} />, c: '#8b5cf6', d: '#6a3fd1' },
    },
  },
  intro: 'Halo, aku Agam si Pelukis! Aku bisa menggambar kalau diberi perintah. Ikuti garis putus-putusnya, dan pakai blok ULANGI supaya programnya pendek. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!',
  describe: (l) => describeList(l.solution.main, (a) => WORD[a] ?? a, (c) => c),
  winTitle: 'Gambarnya jadi!',
  useAdapter: useUlangi,
};

export function UlangiGame() {
  return <ProgGame cfg={CFG} />;
}
