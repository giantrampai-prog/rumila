'use client';

// Coding Agam · Pola — anak melengkapi deretan yang berulang (warna, bentuk, bunyi alat musik, melodi lonceng, dua
// pola sekaligus). Struktur sama dengan Langkah: 10 Level bertema × 10 coding, bintang, peta level, sertifikat.
// Layar soal: pilih kotak "?" lalu ketuk benda di palet; ▶ Jalankan → Agam menyusuri deretan dan menyorot tiap
// benda (benda berbunyi, jadi pola yang lengkap terdengar seperti lagu); kotak yang salah → Agam terpental +
// nomor kotak. Tombol speaker memutar deretan, tombol lampu menjelaskan polanya dan menunjuk jawaban.
// Bintang: 3 tanpa salah & tanpa bantuan, 2 bila sekali, 1 bila lebih.

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { describeUnit, firstProblem, keyOf, POLA, polaStars, same, unitRange, type Fill, type PolaLevel, type Token } from '@/lib/koding/pola';
import { sfx } from '@/lib/sfx';
import { useMe } from '@/lib/store';
import { completeTool, useToolSession } from '@/lib/tool-session';
import { Certificate } from './certificate';
import { playToken, TokenIcon } from './pola-art';
import { PolaStage } from './pola-stage';
import { BALOO, fmtDate, INK, LevelMap, PER_WORLD, summarize, useProgress, wait, WinDialog, withStars } from './shared';
import { AgamFront, WORLD } from './stage';
import './koding.css';

const TOOL = 'koding-pola';
const TOTAL = POLA.length;

const labelOf = (t: Token, l: PolaLevel) => (t.k === 'warna' ? t.c : t.k === 'bentuk' ? (l.focus === 'bentuk' ? t.s : `${t.s} ${t.c}`) : t.k === 'alat' ? t.i : t.n);
const nextEmpty = (l: PolaLevel, fill: Fill, after = -1) => {
  const order = [...l.blanks.filter((i) => i > after), ...l.blanks.filter((i) => i <= after)];
  return order.find((i) => !fill[i]) ?? null;
};

export function PolaGame() {
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  useToolSession(memberId, TOOL, 'coding');
  const router = useRouter();
  const [prog, saveProg] = useProgress(`rumila-koding-pola-${memberId}`);

  const [li, setLi] = useState<number | null>(null);
  const level = li === null ? null : POLA[li];
  const [fill, setFill] = useState<Fill>({});
  const [sel, setSel] = useState<number | null>(null);
  const [agam, setAgam] = useState(0);
  const [bump, setBump] = useState(false);
  const [pop, setPop] = useState<{ i: number; n: number } | null>(null);
  const [bad, setBad] = useState<number | null>(null);
  const [glow, setGlow] = useState<number[]>([]);
  const [tip, setTip] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [listening, setListening] = useState(false);
  const [say, setSay] = useState('');
  const [win, setWin] = useState<number | null>(null);
  const [cert, setCert] = useState(false);
  const [fails, setFails] = useState(0);
  const [helped, setHelped] = useState(false);
  const runId = useRef(0);
  const popN = useRef(0);

  const { doneCount, starTotal, allDone, current } = summarize(POLA, prog);

  const clearMarks = () => {
    setBad(null);
    setGlow([]);
    setTip(null);
  };

  const openLevel = (i: number) => {
    runId.current++;
    sfx.open();
    const l = POLA[i];
    setLi(i);
    setFill({});
    setSel(l.blanks[0]);
    setAgam(0);
    setBump(false);
    setPop(null);
    setWin(null);
    setFails(0);
    setHelped(false);
    setRunning(false);
    setListening(false);
    clearMarks();
    setSay(l.hint);
  };

  const popAt = (i: number, t: Token) => {
    setPop({ i, n: ++popN.current });
    playToken(t);
  };

  const stop = () => {
    runId.current++;
    setRunning(false);
    setListening(false);
    setAgam(0);
    setBump(false);
  };

  /** ketuk kotak: kotak "?" dipilih (ketuk lagi kotak terisi = kosongkan); kotak biasa dibunyikan */
  const onSlot = (i: number) => {
    if (!level || running) return;
    if (!level.blanks.includes(i)) {
      popAt(i, level.seq[i]);
      return;
    }
    if (sel === i && fill[i]) {
      sfx.close();
      setFill((f) => ({ ...f, [i]: undefined }));
      if (bad === i) setBad(null);
      return;
    }
    sfx.tap();
    setSel(i);
    if (fill[i]) popAt(i, fill[i]!);
  };

  const choose = (t: Token) => {
    if (!level || running) return;
    const target = sel ?? nextEmpty(level, fill);
    if (target === null) {
      sfx.thud();
      setSay('Semua kotak sudah terisi. Tekan Jalankan! Atau ketuk kotak yang mau diganti.');
      return;
    }
    const f = { ...fill, [target]: t };
    setFill(f);
    popAt(target, t);
    clearMarks();
    setSel(nextEmpty(level, f, target));
  };

  /** putar deretan (tanpa Agam berjalan); kotak kosong = jeda */
  const listen = async () => {
    if (!level || running || listening) return;
    const id = ++runId.current;
    setListening(true);
    for (let i = 0; i < level.seq.length; i++) {
      if (runId.current !== id) return;
      const t = level.blanks.includes(i) ? fill[i] : level.seq[i];
      if (t) popAt(i, t);
      await wait(level.focus === 'bunyi' ? 520 : 420);
    }
    if (runId.current === id) setListening(false);
  };

  const help = () => {
    if (!level || running) return;
    sfx.pick();
    setHelped(true);
    const wrong = level.blanks.find((i) => fill[i] && !same(fill[i], level.seq[i]));
    if (wrong !== undefined) {
      setGlow([]);
      setTip(null);
      setBad(wrong);
      setSel(wrong);
      setSay(`Kotak nomor ${wrong + 1} sepertinya kurang cocok. Pilih benda lain untuk kotak itu.`);
      return;
    }
    const target = sel ?? nextEmpty(level, fill);
    setBad(null);
    setGlow(unitRange(level));
    if (target === null) {
      setTip(null);
      setSay('Semua kotak sudah benar! Tekan Jalankan.');
      return;
    }
    setSel(target);
    setTip(keyOf(level.seq[target]));
    setSay(`${describeUnit(level)} Benda yang menyala di bawah cocok untuk kotak nomor ${target + 1}.`);
  };

  const go = async () => {
    if (!level || running) return;
    const empty = firstProblem(level, fill);
    if (empty?.kind === 'empty') {
      sfx.thud();
      setSel(empty.i);
      setSay(`Kotak nomor ${empty.i + 1} masih kosong. Pilih bendanya dulu, ya.`);
      return;
    }
    const id = ++runId.current;
    clearMarks();
    setListening(false);
    setRunning(true);
    setSel(null);
    setAgam(0);
    sfx.open();
    await wait(300);
    for (let i = 0; i < level.seq.length; i++) {
      if (runId.current !== id) return;
      setAgam(i);
      await wait(i === 0 ? 120 : 280);
      if (runId.current !== id) return;
      const t = level.blanks.includes(i) ? fill[i]! : level.seq[i];
      if (!same(t, level.seq[i])) {
        // terpental di kotak yang salah
        sfx.thud();
        setBump(true);
        setBad(i);
        await wait(560);
        setBump(false);
        setRunning(false);
        setSel(i);
        const f = fails + 1;
        setFails(f);
        setSay(`Hmm, kotak nomor ${i + 1} belum cocok dengan polanya. ${f >= 2 ? 'Butuh bantuan? Ketuk lampu.' : 'Lihat lagi urutannya, ya.'}`);
        return;
      }
      popAt(i, t);
      await wait(level.focus === 'bunyi' ? 300 : 200);
    }
    if (runId.current !== id) return;
    await wait(250);
    setRunning(false);
    const st = polaStars(fails + (helped ? 1 : 0));
    setSay(st === 3 ? 'Yeay! Polanya lengkap dan terdengar merdu!' : 'Yeay, polanya lengkap!');
    sfx.celebrate();
    setWin(st);
    if (!(prog.stars[level.id] ?? 0)) completeTool(memberId, TOOL, 'coding', `level:${level.id}`);
    saveProg(withStars(POLA, prog, level.id, st));
  };

  if (cert)
    return (
      <Certificate
        game="Pola"
        name={me?.name ?? 'Programmer Cilik'}
        stars={starTotal}
        date={allDone ? fmtDate(prog.certAt ?? new Date().toISOString()) : 'Tanggal selesai'}
        remaining={TOTAL - doneCount}
        onClose={() => setCert(false)}
      />
    );

  if (!level)
    return (
      <LevelMap
        title="Pola"
        list={POLA}
        prog={prog}
        onBack={() => router.back()}
        onOpen={openLevel}
        onCert={() => setCert(true)}
        greeting={
          doneCount === 0
            ? 'Halo, aku Agam! Komputer suka pola: sesuatu yang berulang terus. Bantu aku melengkapi pola warna, bentuk, dan bunyi. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!'
            : allDone
              ? 'Hebat! Kamu sudah menyelesaikan 10 level Pola. Ini sertifikatmu!'
              : `Ayo lanjut ke Level ${Math.floor(current / PER_WORLD) + 1}, coding ${(current % PER_WORLD) + 1}! Tinggal ${TOTAL - doneCount} coding lagi untuk mendapat Sertifikat Programmer Cilik.`
        }
      />
    );

  /* ---------- layar soal ---------- */
  const W = WORLD[level.theme];
  const dark = !!W.dark;
  const lvNo = Math.floor(li! / PER_WORLD) + 1,
    codeNo = (li! % PER_WORLD) + 1;
  const worldEnd = codeNo === PER_WORLD;
  const target = sel ?? nextEmpty(level, fill);
  const nOpt = level.options.length;
  const optCols = nOpt <= 3 ? nOpt : nOpt === 4 ? 4 : 3;
  const pulseFirst = li! < 2 && !Object.values(fill).some(Boolean) && !running;
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden landscape:flex-row" style={{ background: W.bg, color: INK, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <button onClick={() => (stop(), setLi(null))} aria-label="Peta level" className="koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="koding-round min-w-0 truncate rounded-full px-4 py-2 font-extrabold" style={{ fontFamily: BALOO, fontSize: 17 }}>
            Level {lvNo} · {W.name} · coding {codeNo}
          </div>
          <button onClick={listen} disabled={running} aria-label="Dengarkan polanya" className={`koding-round ml-auto flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5 disabled:opacity-50 ${(level.focus === 'bunyi' || level.focus === 'melodi') && !listening && !Object.values(fill).some(Boolean) ? 'koding-pulse' : ''}`}>
            <Icon name={listening ? 'graphic_eq' : 'volume_up'} size={24} className="text-[#3a86ff]" />
          </button>
          <button onClick={help} disabled={running} aria-label="Bantuan" className={`koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5 disabled:opacity-50 ${fails >= 2 && !tip && bad === null ? 'koding-pulse' : ''}`}>
            <Icon name="lightbulb" size={24} className="text-[#e0a100]" />
          </button>
        </div>
        <div className="flex items-end gap-2">
          <AgamFront size={44} />
          <div className="koding-say mb-1 rounded-[18px] px-4 py-2.5 text-[15px] font-bold" style={{ maxWidth: 560 }}>
            {say}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="koding-diorama h-full w-full">
            <PolaStage level={level} fill={fill} sel={running ? null : sel} agam={agam} bump={bump} pop={pop} bad={bad} glow={glow} won={win !== null} onSlot={onSlot} />
          </div>
        </div>
      </div>
      <div className="koding-panel flex w-full shrink-0 flex-col gap-2 self-center p-3 pt-0 landscape:justify-center landscape:self-stretch landscape:pt-3">
        <div className="text-[13px] font-extrabold" style={{ color: dark ? '#e7e4ff' : INK, opacity: 0.8 }}>
          {target === null ? 'Semua kotak terisi · tekan Jalankan' : `Pilih benda untuk kotak nomor ${target + 1}`}
        </div>
        <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `repeat(${optCols}, minmax(0, 132px))` }}>
          {level.options.map((t) => (
            <button
              key={keyOf(t)}
              onClick={() => choose(t)}
              disabled={running}
              className={`pola-opt flex flex-col items-center rounded-[18px] px-1 pb-1.5 pt-1 disabled:opacity-50 ${tip === keyOf(t) || (pulseFirst && same(t, level.seq[level.blanks[0]])) ? 'koding-pulse' : ''}`}
              aria-label={labelOf(t, level)}
            >
              <span className="pola-opt-art">
                <TokenIcon t={t} size={64} />
              </span>
              <span className="-mt-0.5 max-w-full truncate text-[13px] font-extrabold capitalize" style={{ fontFamily: BALOO }}>
                {labelOf(t, level)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {running ? (
            <button onClick={stop} className="flex-1 rounded-[18px] bg-[#e04f5f] py-3.5 text-white shadow-[0_5px_0_#a8323f] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              Berhenti
            </button>
          ) : (
            <button onClick={go} className="flex-1 rounded-[18px] bg-[#22b573] py-3.5 text-white shadow-[0_5px_0_#16804f] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              ▶ Jalankan
            </button>
          )}
          <button
            onClick={() => (sfx.close(), setFill({}), setSel(level.blanks[0]), clearMarks(), setAgam(0))}
            disabled={running}
            aria-label="Kosongkan semua kotak"
            className="koding-round flex w-14 items-center justify-center rounded-[18px] disabled:opacity-40"
          >
            <Icon name="delete" size={24} />
          </button>
        </div>
      </div>

      {win !== null && (
        <WinDialog
          stars={win}
          title={allDone && li === TOTAL - 1 ? '10 level selesai!' : worldEnd ? `Level ${lvNo} selesai!` : 'Polanya lengkap!'}
          message={win === 3 ? 'Sempurna! Semua kotak benar tanpa salah.' : helped && fails === 0 ? 'Benar, dengan sedikit bantuan. Coba lagi sendiri untuk 3 bintang?' : 'Polanya benar! Coba lagi tanpa salah untuk 3 bintang?'}
          unlockNote={worldEnd && li! < TOTAL - 1 ? `Level ${lvNo + 1} · ${WORLD[POLA[li! + 1].theme].name} sekarang terbuka!` : undefined}
          onRetry={() => openLevel(li!)}
          next={
            allDone && li === TOTAL - 1
              ? { label: 'Ambil sertifikat', gold: true, onClick: () => (setWin(null), setLi(null), setCert(true)) }
              : li! < TOTAL - 1
                ? { label: worldEnd ? `Ke Level ${lvNo + 1}` : 'Coding berikutnya', onClick: () => openLevel(li! + 1) }
                : { label: 'Selesai', onClick: () => (setWin(null), setLi(null)) }
          }
        />
      )}
    </div>
  );
}
