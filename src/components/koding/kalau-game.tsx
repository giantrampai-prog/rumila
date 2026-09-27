'use client';

// Coding Agam · Kalau… = AGAM PELARI. Tampak samping seperti game lari: Agam berlari ke kanan menuju finis,
// rintangan muncul ACAK setiap kali main (rendah di tanah → lompat, terbang setinggi kepala → merunduk, lubang →
// lompat). Karena susunannya selalu berubah, anak harus membuat program yang "melihat": ulangi sampai finis +
// kalau/kalau tidak. Saat sensor dicek, sorot pindaian di depan Agam menyala. 10 dunia sendiri (skin-kalau.tsx),
// soal di src/lib/koding/kalau.ts.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { KALAU } from '@/lib/koding/kalau';
import { describeList, type Step } from '@/lib/koding/prog';
import { layoutFor, runWorld2, type KalauLevel, type Obst, type RunData } from '@/lib/koding/worlds';
import { sfx } from '@/lib/sfx';
import { ProgGame, type Adapter, type ProgGameConfig } from './prog-game';
import { wait } from './shared';
import { AgamRunner, AgamRunnerFront, KALAU_THEMES } from './skin-kalau';
import type { RunnerTheme, RunPose } from './skin-types';

const ACCENT = '#1f9d55';
const H = 600;
const GROUND = 460;
const CELL = 100;
/** lebar jendela pandang (satuan adegan) */
const VIEW = 1100;
const WORD: Record<string, string> = { lari: 'lari', lompat: 'lompat', merunduk: 'merunduk' };

function Scene({ T, cells, len, x, pose, jumpN, scan, crashAt }: { T: RunnerTheme; cells: (Obst | null)[]; len: number; x: number; pose: RunPose; jumpN: number; scan: { ok: boolean; n: number } | null; crashAt: number | null }) {
  const total = (len + 3) * CELL + VIEW;
  // kamera: Agam di sepertiga kiri layar
  const cam = Math.max(0, Math.min(total - VIEW, x * CELL + 50 - VIEW * 0.3));
  const gaps = cells.map((c, i) => (c === 'gap' ? i : -1)).filter((i) => i >= 0);
  // potongan tanah di antara lubang
  const pieces: [number, number][] = [];
  let from = -VIEW;
  for (const g of gaps) {
    pieces.push([from, g * CELL]);
    from = (g + 1) * CELL;
  }
  pieces.push([from, total]);
  return (
    <svg viewBox={`0 0 ${VIEW} ${H}`} className="block h-full w-full" preserveAspectRatio="xMidYMax slice" role="img" aria-label={`Lintasan ${T.name}`}>
      <defs>{T.defs}</defs>
      {T.sky(VIEW)}
      <g className="run-cam" style={{ transform: `translateX(${-cam * 0.25}px)` }}>
        {T.far(total)}
      </g>
      <g className="run-cam" style={{ transform: `translateX(${-cam * 0.55}px)` }}>
        {T.mid(total)}
      </g>
      <g className="run-cam" style={{ transform: `translateX(${-cam}px)` }}>
        {pieces.map(([a, b]) => (
          <g key={a}>{T.ground(a, b)}</g>
        ))}
        {gaps.map((g) => (
          <g key={`g${g}`}>{T.gap(g * CELL)}</g>
        ))}
        {T.finish(len * CELL + 50)}
        {cells.map((c, i) =>
          c === 'low' ? <g key={i}>{T.low(i * CELL + 50, i)}</g> : c === 'fly' ? <g key={i}>{T.fly(i * CELL + 50, i)}</g> : null,
        )}
        {crashAt !== null && (
          <circle cx={crashAt * CELL + 50} cy={GROUND - 60} r="70" fill="none" stroke="#e04f5f" strokeWidth="8" strokeDasharray="10 12" className="koding-bad" />
        )}
        {/* pindaian sensor di depan Agam */}
        {scan && (
          <path
            key={scan.n}
            d={`M${x * CELL + 90} ${GROUND - 70} L${(x + 1) * CELL + 100} ${GROUND - 150} L${(x + 1) * CELL + 100} ${GROUND + 10} Z`}
            fill={scan.ok ? '#ffd23f' : '#ffffff'}
            opacity="0.45"
            className="run-scan"
          />
        )}
        <g className="run-agam" style={{ transform: `translateX(${x * CELL + 50}px)` }}>
          <g transform={`translate(0 ${GROUND})`}>
            <g key={jumpN} className={pose === 'jump' ? 'run-jump' : undefined}>
              <AgamRunner pose={pose} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

function useKalau(level: KalauLevel | null): Adapter {
  const T = KALAU_THEMES[level?.world ?? 0];
  const [seed, setSeed] = useState(1);
  const cells = level ? layoutFor(level, seed) : [];
  const [x, setX] = useState(0);
  const [pose, setPose] = useState<RunPose>('idle');
  const [jumpN, setJumpN] = useState(0);
  const [scan, setScan] = useState<{ ok: boolean; n: number } | null>(null);
  const [crashAt, setCrashAt] = useState<number | null>(null);
  const scanN = useRef(0);

  const shuffle = useCallback(() => setSeed(1 + Math.floor(Math.random() * 1e9)), []);
  const reset = useCallback(() => {
    setX(0);
    setPose('idle');
    setScan(null);
    setCrashAt(null);
  }, []);
  // soal baru → susunan baru
  useEffect(() => {
    reset();
    shuffle();
  }, [level?.id, reset, shuffle]);

  return {
    stage: level ? (
      <div className="koding-frame relative h-full w-full overflow-hidden rounded-[22px]" style={{ background: T.bg }}>
        <Scene T={T} cells={cells} len={level.len} x={x} pose={pose} jumpN={jumpN} scan={scan} crashAt={crashAt} />
      </div>
    ) : null,
    reset,
    world: () => runWorld2(level!, cells),
    sense(s: Step) {
      setScan({ ok: !!s.ok, n: ++scanN.current });
    },
    async play(s: Step) {
      const d = s.data as RunData;
      setScan(null);
      if (d.move === 'run') {
        setPose('run');
        setX(d.x);
        sfx.step();
        await wait(360);
      } else if (d.move === 'duck') {
        setPose('duck');
        setX(d.x);
        sfx.whoosh();
        await wait(420);
        setPose('run');
      } else if (d.move === 'jump') {
        setPose('jump');
        setJumpN((n) => n + 1);
        setX(d.x);
        sfx.hop(2);
        await wait(620);
        setPose('run');
      } else {
        setPose('run');
        setX(d.x + 0.35);
        await wait(200);
        sfx.thud();
        setPose('bump');
        setCrashAt(d.x + 1);
        setX(d.x);
        await wait(700);
      }
    },
    after(r) {
      setPose(r === 'win' ? 'win' : pose === 'bump' ? 'bump' : 'idle');
      if (r === 'win') sfx.celebrate();
    },
    failSay(r, last) {
      const d = last?.data as RunData | undefined;
      if (r === 'bump' && d?.hit) {
        const w = T.words[d.hit];
        return d.hit === 'fly' ? `Aduh, Agam menabrak ${w}! Yang terbang harus dirunduki.` : `Aduh, Agam tersandung ${w}! Yang di tanah harus dilompati.`;
      }
      if (r === 'short') return 'Programnya habis sebelum finis. Pakai ulangi sampai finis.';
      return null;
    },
    tools: level ? (
      <button onClick={() => (sfx.pick(), shuffle(), reset())} aria-label="Acak rintangan" className="koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5">
        <Icon name="casino" size={24} className="text-[#1f9d55]" />
      </button>
    ) : null,
  };
}

const CFG: ProgGameConfig<KalauLevel> = {
  title: 'Kalau…',
  tool: 'koding-kalau',
  levels: KALAU,
  worlds: KALAU_THEMES.map((t) => ({
    name: t.name,
    bg: t.bg,
    ink: t.ink,
    dark: t.dark,
    vignette: (
      <svg viewBox="0 330 1200 200" className="block h-auto w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <defs>{t.defs}</defs>
        {t.sky(1200)}
        {t.far(1200)}
        {t.mid(1200)}
        {t.ground(0, 700)}
        {t.gap(700)}
        {t.ground(800, 1200)}
        {t.low(450, 1)}
        {t.fly(1000, 2)}
      </svg>
    ),
  })),
  pageBg: (w) => KALAU_THEMES[w].bg,
  dark: (w) => !!KALAU_THEMES[w].dark,
  mascot: (size) => <AgamRunnerFront size={size} />,
  accent: ACCENT,
  paper: 'kalau-paper',
  look: (w) => {
    const words = KALAU_THEMES[w].words;
    return {
      acts: {
        lari: { label: 'lari', icon: <Icon name="directions_run" size={26} />, c: '#3a86ff', d: '#2463c9' },
        lompat: { label: 'lompat', icon: <Icon name="north_east" size={26} />, c: '#e0457b', d: '#a92d5a' },
        merunduk: { label: 'merunduk', icon: <Icon name="south" size={26} />, c: '#8b5cf6', d: '#6a3fd1' },
      },
      conds: [
        { id: 'low', short: words.low },
        { id: 'fly', short: words.fly },
        { id: 'gap', short: words.gap },
      ],
      untilWord: 'finis',
    };
  },
  conds: ['low', 'fly', 'gap'],
  intro: 'Halo, aku Agam si Pelari! Rintangan di lintasanku selalu berpindah tiap kali lari, jadi aku harus bisa MELIHAT dan MEMILIH: kalau ada rintangan, lompat atau merunduk. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!',
  describe: (l) => {
    const words = KALAU_THEMES[l.world].words;
    return describeList(l.solution.main, (a) => WORD[a] ?? a, (c) => `ada ${words[c as Obst]} di depan`, 'finis');
  },
  winTitle: 'Sampai finis!',
  useAdapter: useKalau,
};

export function KalauGame() {
  return <ProgGame cfg={CFG} />;
}
