'use client';

// Coding Agam · Jurus = DOJO NINJA, dibuat untuk anak 3–8 tahun: tanpa menyusun program, tanpa tombol Jalankan.
// Sensei Panda memperagakan rangkaian gerakan (gulungan di atas); anak mengetuk tombol gerakan besar dan Agam
// langsung bergerak. Benar → gerakan di gulungan tercentang; salah → Agam oleng, gerakan yang benar menyala
// (kemajuan tidak hilang). Konsep "jurus" (fungsi) dikenalkan bertahap: kartu jurus dari Sensei (satu ketukan =
// banyak gerakan), lalu anak merekam kartunya sendiri. Tangan penunjuk muncul setiap kali ada hal baru.
// Soal di src/lib/koding/jurus-levels.ts, gambar di skin-jurus.tsx.

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { JURUS_SOAL, jurusStars, type JurusSoal } from '@/lib/koding/jurus-levels';
import type { MoveName } from '@/lib/koding/worlds';
import { sfx } from '@/lib/sfx';
import { useMe } from '@/lib/store';
import { completeTool, useToolSession } from '@/lib/tool-session';
import { Certificate } from './certificate';
import { BALOO, fmtDate, INK, LevelMap, PER_WORLD, summarize, useProgress, wait, WinDialog, withStars } from './shared';
import { AgamNinjaFront, JURUS_THEMES, MOVE_ICON, NinjaFigure } from './skin-jurus';
import type { Move, Pose } from './skin-types';
import './koding.css';

const TOOL = 'koding-jurus';
const TOTAL = JURUS_SOAL.length;
const ACCENT = '#c0392b';
const MOVE_COLOR: Record<Move, [string, string]> = {
  pukul: ['#e04f5f', '#a8323f'],
  tendang: ['#f08c00', '#b86800'],
  tangkis: ['#3a86ff', '#2463c9'],
  lompat: ['#22b573', '#16804f'],
  putar: ['#8b5cf6', '#6a3fd1'],
};
const CARD_COLOR = [
  ['#0ea5e9', '#0369a1'],
  ['#d946ef', '#a21caf'],
];
const WORLDS = JURUS_THEMES.map((t) => ({
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
}));

const MoveIcon = ({ m, size = 28 }: { m: Move; size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
    {MOVE_ICON[m]}
  </svg>
);
const moveSfx = (m: string) => (m === 'pukul' ? sfx.thud() : m === 'tendang' ? sfx.whoosh() : m === 'tangkis' ? sfx.clink() : m === 'lompat' ? sfx.hop(3) : sfx.warp());

/** gulungan: tercentang = sudah ditiru, menyala = berikutnya (atau sedang diperagakan), kurung = bagian jurus */
function Scroll({ s, done, hintAt, demo }: { s: JurusSoal; done: number; hintAt: number | null; demo: number | null }) {
  return (
    <div className="jurus-scroll" aria-label="Rangkaian gerakan Sensei">
      {s.target.map((m, i) => {
        const g = s.showGroups ? s.groups.find(([a, len]) => i >= a && i < a + len) : undefined;
        const edge = g ? (i === g[0] ? 'jurus-g-start' : i === g[0] + g[1] - 1 ? 'jurus-g-end' : 'jurus-g-mid') : '';
        return (
          <span key={i} className={`jurus-slot ${edge}`} style={g ? ({ '--g': CARD_COLOR[g[2]][0] } as React.CSSProperties) : undefined}>
            <span
              className={`jurus-chip ${i < done ? 'jurus-chip-done' : ''} ${demo === i || hintAt === i ? 'jurus-chip-demo' : ''}`}
              style={{ background: MOVE_COLOR[m][0], boxShadow: `0 3px 0 ${MOVE_COLOR[m][1]}` }}
              title={m}
            >
              <MoveIcon m={m} size={26} />
              {i < done && <Icon name="check" size={14} className="jurus-chip-tick" />}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function JurusGame() {
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  useToolSession(memberId, TOOL, 'coding');
  const router = useRouter();
  const [prog, saveProg] = useProgress(`rumila-${TOOL}-${memberId}`);
  const { doneCount, starTotal, allDone, current } = summarize(JURUS_SOAL, prog);

  const [li, setLi] = useState<number | null>(null);
  const s = li === null ? null : JURUS_SOAL[li];
  const [i, setI] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [taps, setTaps] = useState(0);
  const [agam, setAgam] = useState<Pose>('siap');
  const [sensei, setSensei] = useState<Pose>('siap');
  const [animN, setAnimN] = useState(0);
  const [cards, setCards] = useState<MoveName[][]>([]);
  const [rec, setRec] = useState<{ c: number; moves: MoveName[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [demo, setDemo] = useState<number | null>(null);
  const [hintAt, setHintAt] = useState<number | null>(null);
  const [say, setSay] = useState('');
  const [win, setWin] = useState<number | null>(null);
  const [cert, setCert] = useState(false);
  const runId = useRef(0);
  const iRef = useRef(0);

  const pose = (who: 'agam' | 'sensei', p: Pose) => {
    (who === 'agam' ? setAgam : setSensei)(p);
    setAnimN((k) => k + 1);
  };

  const playDemo = async (soal: JurusSoal) => {
    const id = ++runId.current;
    setBusy(true);
    pose('sensei', 'hormat');
    await wait(650);
    for (let k = 0; k < soal.target.length; k++) {
      if (runId.current !== id) return;
      setDemo(k);
      pose('sensei', soal.target[k]);
      moveSfx(soal.target[k]);
      await wait(600);
      pose('sensei', 'siap');
      await wait(150);
    }
    if (runId.current !== id) return;
    setDemo(null);
    setBusy(false);
  };

  const openLevel = (k: number) => {
    const soal = JURUS_SOAL[k];
    sfx.open();
    setLi(k);
    setI(0);
    iRef.current = 0;
    setMistakes(0);
    setTaps(0);
    setCards(soal.cards.map((c) => (c.given ? c.moves : [])));
    setRec(null);
    setWin(null);
    setHintAt(soal.id === 'jr1' ? 0 : null);
    setSay(soal.say);
    setAgam('siap');
    void playDemo(soal);
  };

  // keluar dari soal → hentikan peragaan
  useEffect(() => {
    if (li === null) runId.current++;
  }, [li]);

  const finish = (soal: JurusSoal, m: number, t: number) => {
    const st = jurusStars(soal, m, t);
    pose('agam', 'menang');
    pose('sensei', 'hormat');
    sfx.celebrate();
    setSay('Hebat! Jurusmu sempurna!');
    setWin(st);
    if (!(prog.stars[soal.id] ?? 0)) completeTool(memberId, TOOL, 'coding', `level:${soal.id}`);
    saveProg(withStars(JURUS_SOAL, prog, soal.id, st));
  };

  /** lakukan satu gerakan terhadap gulungan; kembalikan benar/salah */
  const doMove = async (soal: JurusSoal, m: MoveName): Promise<boolean> => {
    const at = iRef.current;
    pose('agam', m);
    moveSfx(m);
    if (soal.target[at] === m) {
      iRef.current = at + 1;
      setI(at + 1);
      setHintAt(soal.id === 'jr1' && at + 1 < 2 ? at + 1 : null);
      await wait(480);
      pose('agam', 'siap');
      await wait(90);
      return true;
    }
    await wait(300);
    sfx.bounceBack();
    pose('agam', 'jatuh');
    setHintAt(at);
    await wait(650);
    pose('agam', 'siap');
    return false;
  };

  const tapMove = async (m: MoveName) => {
    if (!s || busy || win !== null) return;
    if (rec) {
      // sedang merekam: gerakan masuk ke kartu, Agam memperagakannya (gulungan tidak berubah)
      if (rec.moves.length >= 6) return;
      setRec({ ...rec, moves: [...rec.moves, m] });
      pose('agam', m);
      moveSfx(m);
      return;
    }
    setBusy(true);
    const t = taps + 1;
    setTaps(t);
    const ok = await doMove(s, m);
    let mm = mistakes;
    if (!ok) {
      mm++;
      setMistakes(mm);
      setSay(`Ups! Yang menyala: ${s.target[iRef.current]}. Coba lagi!`);
    } else setSay(iRef.current < s.target.length ? 'Bagus! Lanjut.' : '');
    setBusy(false);
    if (iRef.current >= s.target.length) finish(s, mm, t);
  };

  const tapCard = async (c: number) => {
    if (!s || busy || rec || win !== null) return;
    const moves = cards[c];
    if (!moves.length) {
      sfx.thud();
      setSay('Kartunya masih kosong. Tekan Rekam dulu!');
      return;
    }
    setBusy(true);
    sfx.clink();
    const t = taps + 1;
    setTaps(t);
    let mm = mistakes;
    for (const m of moves) {
      if (iRef.current >= s.target.length) break;
      const ok = await doMove(s, m);
      if (!ok) {
        mm++;
        setMistakes(mm);
        setSay(s.cards[c].given ? `Ups! Di sini belum waktunya jurus itu. Yang menyala: ${s.target[iRef.current]}.` : 'Ups! Jurus rekamanmu belum sama. Rekam ulang atau ketuk gerakan satu per satu.');
        break;
      }
    }
    setBusy(false);
    if (iRef.current >= s.target.length) finish(s, mm, t);
  };

  const saveRec = () => {
    if (!rec) return;
    if (rec.moves.length < 2) {
      sfx.thud();
      setSay('Jurus butuh minimal 2 gerakan.');
      return;
    }
    sfx.ping();
    setCards((cs) => cs.map((x, k) => (k === rec.c ? rec.moves : x)));
    setRec(null);
    pose('agam', 'siap');
    setSay('Kartu jurus jadi! Ketuk kartunya untuk memakai.');
  };

  const restart = () => {
    if (!s) return;
    runId.current++;
    setBusy(false);
    setDemo(null);
    setI(0);
    iRef.current = 0;
    setMistakes(0);
    setTaps(0);
    setRec(null);
    setHintAt(null);
    setAgam('siap');
    setSensei('siap');
    setWin(null);
  };

  if (cert)
    return (
      <Certificate
        game="Jurus"
        name={me?.name ?? 'Programmer Cilik'}
        stars={starTotal}
        date={allDone ? fmtDate(prog.certAt ?? new Date().toISOString()) : 'Tanggal selesai'}
        remaining={TOTAL - doneCount}
        onClose={() => setCert(false)}
      />
    );

  if (!s)
    return (
      <LevelMap
        title="Jurus"
        list={JURUS_SOAL}
        prog={prog}
        worlds={WORLDS}
        mascot={<AgamNinjaFront />}
        accent={ACCENT}
        paper="jurus-paper"
        onBack={() => router.back()}
        onOpen={openLevel}
        onCert={() => setCert(true)}
        greeting={
          doneCount === 0
            ? 'Halo, aku Agam si Ninja! Lihat Sensei, lalu tiru gerakannya. Nanti kita belajar JURUS: satu ketukan untuk banyak gerakan!'
            : allDone
              ? 'Hebat! Kamu sudah jadi ninja sabuk hitam. Ini sertifikatmu!'
              : `Ayo lanjut ke Level ${Math.floor(current / PER_WORLD) + 1}, coding ${(current % PER_WORLD) + 1}!`
        }
      />
    );

  /* ---------- layar soal ---------- */
  const T = JURUS_THEMES[s.world];
  const dark = !!T.dark;
  const lvNo = s.world + 1,
    codeNo = (li! % PER_WORLD) + 1;
  const worldEnd = codeNo === PER_WORLD;
  // petunjuk tangan untuk hal baru
  const introCard = s.id === 'jr31' && !busy && !rec && s.groups.some(([a]) => a === i);
  const introRec = (s.id === 'jr51' || s.id === 'jr71') && cards.some((c, k) => !c.length && !s.cards[k].given) && !rec;
  const recHint = rec && (s.id === 'jr51' || s.id === 'jr71') ? s.cards[rec.c].moves[rec.moves.length] : null;
  const fig = (who: 'agam' | 'sensei', p: Pose, x: number, flip: boolean) => (
    <g transform={`translate(${x} 470) scale(${flip ? -1 : 1} 1)`}>
      <g key={`${who}-${p}-${animN}`} className={`dojo-fig dojo-${p}`}>
        <NinjaFigure who={who} pose={p} />
      </g>
    </g>
  );

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden landscape:flex-row" style={{ background: T.bg, color: INK, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <button onClick={() => (runId.current++, setLi(null))} aria-label="Peta level" className="koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="min-w-0 truncate rounded-full px-4 py-2 font-extrabold text-white" style={{ fontFamily: BALOO, fontSize: 17, background: ACCENT, boxShadow: '0 4px 0 rgba(0,0,0,.18)' }}>
            Jurus · Level {lvNo} · {T.name} · {codeNo}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => (sfx.pick(), restart(), void playDemo(s))} disabled={busy} aria-label="Lihat Sensei lagi" className="koding-round flex h-11 shrink-0 items-center gap-1 rounded-full px-3 font-extrabold active:translate-y-0.5 disabled:opacity-50">
              <Icon name="visibility" size={22} className="text-[#c0392b]" />
              <span className="hidden text-[14px] sm:inline">Lihat Sensei</span>
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <AgamNinjaFront size={44} />
          <div className="koding-say mb-1 rounded-[18px] px-4 py-2.5 text-[16px] font-bold" style={{ maxWidth: 620 }}>
            {busy && demo !== null ? 'Lihat Sensei baik-baik…' : say}
          </div>
        </div>
        <div className="koding-frame relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px]" style={{ background: T.bg }}>
          <Scroll s={s} done={i} hintAt={hintAt} demo={demo} />
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
      </div>

      <div className="koding-panel flex w-full shrink-0 flex-col gap-3 self-center p-3 pt-0 landscape:justify-center landscape:self-stretch landscape:pt-3">
        {/* kartu jurus */}
        {s.cards.length > 0 && (
          <div className="flex flex-col gap-2">
            {s.cards.map((c, k) => {
              const moves = rec?.c === k ? rec.moves : cards[k];
              return (
                <div key={k} className="flex items-center gap-2">
                  <button
                    onClick={() => void tapCard(k)}
                    disabled={busy || !!rec}
                    className={`jurus-card flex min-h-[64px] flex-1 items-center gap-2 rounded-[18px] px-3 py-2 text-white disabled:opacity-60 ${introCard && k === 0 ? 'tap-hint' : ''}`}
                    style={{ background: CARD_COLOR[k][0], boxShadow: `0 5px 0 ${CARD_COLOR[k][1]}` }}
                    aria-label={`Kartu jurus ${k + 1}`}
                  >
                    <Icon name="bolt" size={30} />
                    <span className="flex flex-wrap items-center gap-1">
                      {moves.length ? (
                        moves.map((m, q) => (
                          <span key={q} className="flex size-9 items-center justify-center rounded-[10px]" style={{ background: MOVE_COLOR[m][0] }}>
                            <MoveIcon m={m} size={24} />
                          </span>
                        ))
                      ) : (
                        <span className="font-extrabold opacity-90" style={{ fontFamily: BALOO }}>
                          {rec?.c === k ? 'Ketuk gerakan di bawah…' : 'Kartu kosong'}
                        </span>
                      )}
                    </span>
                  </button>
                  {!c.given &&
                    (rec?.c === k ? (
                      <div className="flex gap-1.5">
                        <button onClick={saveRec} className="rounded-[14px] bg-[#22b573] px-3 py-3 font-extrabold text-white shadow-[0_4px_0_#16804f] active:translate-y-0.5" style={{ fontFamily: BALOO }}>
                          Selesai
                        </button>
                        <button onClick={() => (setRec(null), pose('agam', 'siap'))} aria-label="Batal merekam" className="koding-round flex w-11 items-center justify-center rounded-[14px]">
                          <Icon name="close" size={22} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => (sfx.pick(), setRec({ c: k, moves: [] }), setSay('Merekam… Lakukan gerakan jurusnya, lalu tekan Selesai.'))}
                        disabled={busy || !!rec}
                        className={`flex items-center gap-1 rounded-[14px] bg-[#e04f5f] px-3 py-3 font-extrabold text-white shadow-[0_4px_0_#a8323f] active:translate-y-0.5 disabled:opacity-50 ${introRec && !cards[k].length ? 'tap-hint' : ''}`}
                        style={{ fontFamily: BALOO }}
                      >
                        <span className="size-3 rounded-full bg-white" />
                        {cards[k].length ? 'Ulang' : 'Rekam'}
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        )}
        {/* tombol gerakan besar */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${s.moves.length}, minmax(0, 1fr))` }}>
          {s.moves.map((m) => {
            const want = rec ? recHint === m : hintAt !== null && s.target[hintAt] === m;
            return (
              <button
                key={m}
                onClick={() => void tapMove(m)}
                disabled={busy && !rec}
                className={`koding-block flex flex-col items-center justify-center gap-1 py-3 text-white disabled:opacity-60 ${want ? 'tap-hint' : ''}`}
                style={{ background: MOVE_COLOR[m][0], boxShadow: `0 6px 0 ${MOVE_COLOR[m][1]}` }}
              >
                <MoveIcon m={m} size={40} />
                <span style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}>{m}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => (sfx.close(), restart())} disabled={busy} className="koding-round flex items-center justify-center gap-1 rounded-[16px] py-2.5 font-extrabold disabled:opacity-50" style={{ color: dark ? INK : undefined }}>
          <Icon name="replay" size={20} /> Ulang dari awal
        </button>
      </div>

      {win !== null && (
        <WinDialog
          stars={win}
          title={allDone && li === TOTAL - 1 ? '10 level selesai!' : worldEnd ? `Level ${lvNo} selesai!` : 'Jurus sempurna!'}
          message={win === 3 ? 'Tanpa salah dan paling cepat!' : mistakes ? `Salah ${mistakes} kali. Coba lagi tanpa salah untuk 3 bintang?` : `Pakai ${taps} ketukan. Pakai kartu jurus supaya lebih cepat!`}
          unlockNote={worldEnd && li! < TOTAL - 1 ? `Level ${lvNo + 1} · ${JURUS_THEMES[lvNo].name} sekarang terbuka!` : undefined}
          onRetry={() => (restart(), void playDemo(s))}
          next={
            allDone && li === TOTAL - 1
              ? { label: 'Ambil sertifikat', gold: true, onClick: () => (setWin(null), setLi(null), setCert(true)) }
              : li! < TOTAL - 1
                ? { label: worldEnd ? `Ke Level ${lvNo + 1}` : 'Berikutnya', onClick: () => openLevel(li! + 1) }
                : { label: 'Selesai', onClick: () => (setWin(null), setLi(null)) }
          }
        />
      )}
    </div>
  );
}
