'use client';

// Coding Agam · Jurus = DOJO NINJA. Tampak samping: Sensei Panda memperagakan rangkaian gerakan (pukul, tendang,
// tangkis, lompat, putar) yang tertulis di gulungan; anak memprogram Agam si ninja untuk menirunya. Gerakan yang
// berulang dirakit sekali di kotak Jurus lalu dipanggil berkali-kali (jatah blok memaksa memakai jurus).
// Gerakan salah → Agam terjatuh dan gulungan menandai gerakan itu. 10 panggung sendiri (skin-jurus.tsx), soal di
// src/lib/koding/jurus.ts.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { JURUS } from '@/lib/koding/jurus';
import { describeList, type Step } from '@/lib/koding/prog';
import { dojoWorld, type DojoData, type JurusLevel } from '@/lib/koding/worlds';
import { sfx } from '@/lib/sfx';
import { ProgGame, type Adapter, type ProgGameConfig } from './prog-game';
import { wait } from './shared';
import { AgamNinjaFront, JURUS_THEMES, MOVE_ICON, NinjaFigure } from './skin-jurus';
import type { Move, Pose } from './skin-types';

const ACCENT = '#c0392b';
const MOVE_COLOR: Record<Move, [string, string]> = {
  pukul: ['#e04f5f', '#a8323f'],
  tendang: ['#f08c00', '#b86800'],
  tangkis: ['#3a86ff', '#2463c9'],
  lompat: ['#22b573', '#16804f'],
  putar: ['#8b5cf6', '#6a3fd1'],
};
const MoveIcon = ({ m, size = 28 }: { m: Move; size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
    {MOVE_ICON[m]}
  </svg>
);
const moveSfx = (m: string) => (m === 'pukul' ? sfx.thud() : m === 'tendang' ? sfx.whoosh() : m === 'tangkis' ? sfx.clink() : m === 'lompat' ? sfx.hop(3) : sfx.warp());

/** gulungan rangkaian Sensei: gerakan yang sudah ditiru hijau, yang salah merah, yang sedang diperagakan menyala */
function Scroll({ target, done, miss, demo }: { target: Move[]; done: number; miss: number | null; demo: number | null }) {
  return (
    <div className="jurus-scroll" aria-label="Rangkaian gerakan Sensei">
      {target.map((m, i) => (
        <span
          key={i}
          className={`jurus-chip ${i < done ? 'jurus-chip-done' : ''} ${miss === i ? 'koding-bad jurus-chip-miss' : ''} ${demo === i ? 'jurus-chip-demo' : ''}`}
          style={{ background: MOVE_COLOR[m][0], boxShadow: `0 3px 0 ${MOVE_COLOR[m][1]}` }}
          title={m}
        >
          <MoveIcon m={m} size={26} />
          {i < done && <Icon name="check" size={14} className="jurus-chip-tick" />}
        </span>
      ))}
    </div>
  );
}

function useJurus(level: JurusLevel | null): Adapter {
  const T = JURUS_THEMES[level?.world ?? 0];
  const [agam, setAgam] = useState<Pose>('siap');
  const [sensei, setSensei] = useState<Pose>('siap');
  const [n, setN] = useState(0);
  const [done, setDone] = useState(0);
  const [miss, setMiss] = useState<number | null>(null);
  const [demo, setDemo] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const demoId = useRef(0);

  const reset = useCallback(() => {
    setAgam('siap');
    setSensei('siap');
    setDone(0);
    setMiss(null);
  }, []);

  const showDemo = useCallback(async () => {
    if (!level) return;
    const id = ++demoId.current;
    setBusy(true);
    reset();
    setSensei('hormat');
    await wait(700);
    for (let i = 0; i < level.target.length; i++) {
      if (demoId.current !== id) return;
      setDemo(i);
      setSensei(level.target[i]);
      setN((k) => k + 1);
      moveSfx(level.target[i]);
      await wait(620);
      setSensei('siap');
      await wait(160);
    }
    if (demoId.current !== id) return;
    setDemo(null);
    setBusy(false);
  }, [level, reset]);

  // soal baru → Sensei langsung memperagakan
  useEffect(() => {
    demoId.current++;
    setDemo(null);
    setBusy(false);
    reset();
    if (level) void showDemo();
  }, [level?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fig = (who: 'agam' | 'sensei', pose: Pose, x: number, flip: boolean) => (
    <g transform={`translate(${x} 470) scale(${flip ? -1 : 1} 1)`}>
      <g key={`${who}-${pose}-${n}`} className={`dojo-fig dojo-${pose}`}>
        <NinjaFigure who={who} pose={pose} />
      </g>
    </g>
  );

  return {
    stage: level ? (
      <div className="koding-frame relative flex h-full w-full flex-col overflow-hidden rounded-[22px]" style={{ background: T.bg }}>
        <Scroll target={level.target as Move[]} done={done} miss={miss} demo={demo} />
        <div className="min-h-0 flex-1">
          <svg viewBox="80 150 840 360" className="block h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Dojo ${T.name}`}>
            <defs>{T.defs}</defs>
            {T.stage()}
            {fig('sensei', sensei, 300, false)}
            {fig('agam', agam, 700, true)}
            {T.front()}
          </svg>
        </div>
      </div>
    ) : null,
    reset,
    world: () => dojoWorld(level!),
    busy,
    async play(s: Step) {
      const d = s.data as DojoData;
      setAgam(d.move as Pose);
      setN((k) => k + 1);
      moveSfx(d.move);
      if (d.ok) {
        setDone(d.i + 1);
        await wait(560);
        setAgam('siap');
        await wait(120);
      } else {
        setMiss(d.i);
        await wait(420);
        sfx.thud();
        setAgam('jatuh');
        await wait(700);
      }
    },
    after(r) {
      if (r === 'win') {
        setAgam('menang');
        setSensei('hormat');
      }
    },
    failSay(r, last) {
      const d = last?.data as DojoData | undefined;
      if (r === 'bump' && d && level) return `Gerakan ke-${d.i + 1} seharusnya ${level.target[d.i]}, bukan ${d.move}. Lihat lagi gulungannya!`;
      if (r === 'short' && level) return `Baru ${done} dari ${level.target.length} gerakan. Masih ada gerakan Sensei yang belum ditiru.`;
      return null;
    },
    tools: level ? (
      <button onClick={() => (sfx.pick(), void showDemo())} disabled={busy} aria-label="Lihat Sensei memperagakan" className="koding-round flex h-11 shrink-0 items-center gap-1 rounded-full px-3 font-extrabold active:translate-y-0.5 disabled:opacity-50">
        <Icon name="visibility" size={22} className="text-[#c0392b]" />
        <span className="hidden text-[14px] sm:inline">Lihat Sensei</span>
      </button>
    ) : null,
  };
}

const CFG: ProgGameConfig<JurusLevel> = {
  title: 'Jurus',
  tool: 'koding-jurus',
  levels: JURUS,
  worlds: JURUS_THEMES.map((t) => ({
    name: t.name,
    bg: t.bg,
    ink: t.ink,
    dark: t.dark,
    vignette: (
      <svg viewBox="0 150 1000 167" className="block h-auto w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <defs>{t.defs}</defs>
        {t.stage()}
      </svg>
    ),
  })),
  pageBg: (w) => JURUS_THEMES[w].bg,
  dark: (w) => !!JURUS_THEMES[w].dark,
  mascot: (size) => <AgamNinjaFront size={size} />,
  accent: ACCENT,
  paper: 'jurus-paper',
  look: {
    acts: Object.fromEntries(
      (Object.keys(MOVE_COLOR) as Move[]).map((m) => [m, { label: m, icon: <MoveIcon m={m} />, c: MOVE_COLOR[m][0], d: MOVE_COLOR[m][1] }]),
    ),
  },
  intro: 'Halo, aku Agam si Ninja! Sensei Panda akan memperagakan gerakan. Tiru gerakannya dengan program, dan rakit JURUS untuk gerakan yang berulang. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!',
  describe: (l) => `Jurus = [${describeList(l.solution.jurus, (a) => a, (c) => c)}]. Program: ${describeList(l.solution.main, (a) => a, (c) => c)}`,
  winTitle: 'Jurus sempurna!',
  useAdapter: useJurus,
};

export function JurusGame() {
  return <ProgGame cfg={CFG} />;
}
