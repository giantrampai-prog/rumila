'use client';

// Layar umum game Coding Agam yang memakai program bertingkat (Ulangi · Agam Pelukis, Kalau… · Agam Pelari,
// Jurus · Dojo Ninja). Bagian yang sama: peta 10 Level × 10 coding, sertifikat, penyusun program + jatah blok,
// tombol Jalankan/Berhenti, bantuan bertahap, dialog menang. Yang berbeda per game datang dari "adapter": panggung
// (kanvas / lintasan lari / dojo), cara menganimasikan tiap langkah, dunia untuk menjalankan program, warna, tema,
// dan kostum Agam.

import { useRouter } from 'next/navigation';
import { useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui';
import { countBlocks, newId, progStars, runWorld, type PBlock, type Program, type ProgLevelBase, type Step, type Stmt, type World } from '@/lib/koding/prog';
import { sfx } from '@/lib/sfx';
import { useMe } from '@/lib/store';
import { completeTool, useToolSession } from '@/lib/tool-session';
import { Certificate } from './certificate';
import { addAt, chainOf, EMPTY, List, lookOf, patch, refuse, removeId, type EditorLook, type RailCtx, type Target } from './program-editor';
import { BALOO, fmtDate, INK, LevelMap, PER_WORLD, summarize, useProgress, wait, WinDialog, withStars, type MapWorld } from './shared';
import './koding.css';

/** yang disediakan tiap game untuk soal yang sedang dibuka */
export interface Adapter {
  /** panggung (kanvas / lintasan / dojo) */
  stage: ReactNode;
  /** kembalikan panggung ke awal (sebelum jalan & setiap program diubah) */
  reset(): void;
  /** dunia baru untuk satu kali jalan */
  world(): World;
  /** animasikan satu langkah aksi; kembalikan lama tunggu (ms) */
  play(step: Step): Promise<void> | void;
  /** setelah jalan selesai (mis. lintasan diacak lagi) */
  after?(result: string): void;
  /** kalimat Agam saat gagal (opsional, menimpa kalimat umum) */
  failSay?(result: string, last: Step | undefined): string | null;
  /** sensor dicek (untuk efek di panggung, mis. pindaian di depan Agam) */
  sense?(step: Step): void;
  /** tombol tambahan di bilah atas (mis. "Lihat Sensei") */
  tools?: ReactNode;
  /** sedang memutar animasi sendiri (mis. peragaan Sensei) → kunci tombol */
  busy?: boolean;
}

export interface ProgGameConfig<L extends ProgLevelBase> {
  title: string;
  tool: string;
  levels: L[];
  worlds: (MapWorld & { name: string })[];
  /** warna halaman soal per Level */
  pageBg: (w: number) => string;
  dark: (w: number) => boolean;
  mascot: (size: number) => ReactNode;
  accent: string;
  paper: string;
  /** tampilan blok; boleh berbeda per Level (mis. nama rintangan tiap tema) */
  look: EditorLook | ((world: number) => EditorLook);
  /** syarat "kalau" yang bisa dipilih (diputar saat diketuk) */
  conds?: string[];
  intro: string;
  /** contoh program untuk bantuan tahap 2 */
  describe: (l: L) => string;
  /** kata sukses di dialog menang */
  winTitle: string;
  useAdapter: (level: L | null, dark: boolean) => Adapter;
}

export function ProgGame<L extends ProgLevelBase>({ cfg }: { cfg: ProgGameConfig<L> }) {
  const { levels, tool, title } = cfg;
  const TOTAL = levels.length;
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  useToolSession(memberId, tool, 'coding');
  const router = useRouter();
  const [prog, saveProg] = useProgress(`rumila-${tool}-${memberId}`);

  const [li, setLi] = useState<number | null>(null);
  const level = li === null ? null : levels[li];
  const dark = level ? cfg.dark(level.world) : false;
  const look = typeof cfg.look === 'function' ? cfg.look(level?.world ?? 0) : cfg.look;
  const ad = cfg.useAdapter(level, dark);
  const [code, setCode] = useState<Program>(EMPTY);
  const [target, setTarget] = useState<Target>('main');
  const [active, setActive] = useState<string | null>(null);
  const [iters, setIters] = useState<Record<string, number>>({});
  const [check, setCheck] = useState<{ id: string; ok: boolean } | null>(null);
  const [bad, setBad] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [say, setSay] = useState('');
  const [win, setWin] = useState<number | null>(null);
  const [cert, setCert] = useState(false);
  const [fails, setFails] = useState(0);
  const [helpStep, setHelpStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const runId = useRef(0);

  const { doneCount, starTotal, allDone, current } = summarize(levels, prog);
  const hasJurus = !!level?.palette.includes('jurus');
  const locked = running || !!ad.busy;

  const clearRun = () => {
    setActive(null);
    setIters({});
    setCheck(null);
  };

  const openLevel = (i: number) => {
    runId.current++;
    sfx.open();
    const l = levels[i];
    setLi(i);
    setCode(EMPTY);
    setTarget(l.palette.includes('jurus') ? 'jurus' : 'main');
    setWin(null);
    setFails(0);
    setHelpStep(0);
    setRevealed(false);
    setBad(null);
    setRunning(false);
    setSay(l.hint);
    clearRun();
  };

  const stop = () => {
    runId.current++;
    setRunning(false);
    clearRun();
    ad.reset();
  };

  const edit = (next: Program) => {
    setCode(next);
    setBad(null);
    if (!running) {
      clearRun();
      ad.reset();
    }
  };

  const used = countBlocks(code);
  const full = !!level && used >= level.limit;

  const add = (b: PBlock) => {
    if (!level || locked) return;
    if (full) {
      sfx.thud();
      setSay(`Jatah blok habis (${level.limit} blok)! Coba buat programnya lebih hemat.`);
      return;
    }
    const why = refuse(code, target, b);
    if (why) {
      sfx.thud();
      setSay(why);
      return;
    }
    sfx.pick();
    const id = newId();
    const s: Stmt =
      b === 'ulangi'
        ? { id, t: 'loop', n: 2, body: [] }
        : b === 'sampai'
          ? { id, t: 'until', body: [] }
          : b === 'kalau'
            ? { id, t: 'if', cond: cfg.conds?.[0] ?? '', then: [], else: [] }
            : b === 'jurus'
              ? { id, t: 'call' }
              : { id, t: 'act', a: b };
    edit(addAt(code, target, s));
    if (s.t === 'loop' || s.t === 'until') setTarget(`${id}/body`);
    if (s.t === 'if') setTarget(`${id}/then`);
  };

  const del = (id: string) => {
    sfx.close();
    const next = removeId(code, id);
    edit(next);
    if (!chainOf(next, target)) setTarget('main');
  };

  const cycle = (id: string) => {
    sfx.tap();
    const cs = cfg.conds ?? [];
    edit(patch(code, id, (s) => (s.t === 'loop' ? { ...s, n: s.n >= 9 ? 2 : s.n + 1 } : s.t === 'if' && cs.length ? { ...s, cond: cs[(cs.indexOf(s.cond) + 1) % cs.length] } : s)));
  };

  const help = () => {
    if (!level || locked) return;
    sfx.pick();
    if (helpStep === 0) {
      setHelpStep(1);
      setSay(`${level.hint} Jatahnya ${level.limit} blok; paling hemat ${level.best} blok.`);
    } else {
      setHelpStep(2);
      setRevealed(true);
      setSay(`Contoh program: ${cfg.describe(level)}.`);
    }
  };

  const go = async () => {
    if (!level || locked) return;
    if (!used) {
      sfx.thud();
      setSay('Susun perintah dulu: ketuk blok di bawah.');
      return;
    }
    const id = ++runId.current;
    setBad(null);
    setRunning(true);
    clearRun();
    ad.reset();
    sfx.open();
    await wait(300);
    const r = runWorld(code, ad.world());
    for (const s of r.steps) {
      if (runId.current !== id) return;
      setActive(s.id);
      setIters(s.iters);
      if (s.kind === 'check') {
        setCheck({ id: s.id, ok: !!s.ok });
        ad.sense?.(s);
        sfx.tap();
        await wait(320);
      } else if (s.kind === 'call') {
        sfx.clink();
        await wait(220);
      } else await ad.play(s);
    }
    if (runId.current !== id) return;
    setRunning(false);
    setCheck(null);
    const last = r.steps.filter((s) => s.kind !== 'check' && s.kind !== 'call').at(-1);
    if (r.result === 'win') {
      const st = progStars(level.best, used, revealed);
      sfx.celebrate();
      setSay('Hore, berhasil!');
      setWin(st);
      if (!(prog.stars[level.id] ?? 0)) completeTool(memberId, tool, 'coding', `level:${level.id}`);
      saveProg(withStars(levels, prog, level.id, st));
      ad.after?.('win');
      return;
    }
    const f = fails + 1;
    setFails(f);
    const nudge = f >= 2 ? ' Butuh bantuan? Ketuk lampu.' : '';
    setActive(null);
    const custom = ad.failSay?.(r.result, last);
    if (r.result === 'bump' && last) setBad(last.id);
    if (r.result !== 'bump') sfx.bounceBack();
    setSay(
      (custom ??
        (r.result === 'bump'
          ? 'Ups, ada yang salah! Periksa blok yang berkedip merah.'
          : r.result === 'stuck'
            ? 'Agam mengulang terus tanpa hasil. Periksa isi blok ulangi atau kalau.'
            : 'Programnya habis, tapi belum selesai.')) + nudge,
    );
    ad.after?.(r.result);
  };

  if (cert)
    return (
      <Certificate
        game={title}
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
        title={title}
        list={levels}
        prog={prog}
        worlds={cfg.worlds}
        mascot={cfg.mascot(84)}
        accent={cfg.accent}
        paper={cfg.paper}
        onBack={() => router.back()}
        onOpen={openLevel}
        onCert={() => setCert(true)}
        greeting={
          doneCount === 0
            ? cfg.intro
            : allDone
              ? `Hebat! Kamu sudah menyelesaikan 10 level ${title}. Ini sertifikatmu!`
              : `Ayo lanjut ke Level ${Math.floor(current / PER_WORLD) + 1}, coding ${(current % PER_WORLD) + 1}! Tinggal ${TOTAL - doneCount} coding lagi untuk mendapat Sertifikat Programmer Cilik.`
        }
      />
    );

  /* ---------- layar soal ---------- */
  const Wd = cfg.worlds[level.world];
  const lvNo = level.world + 1,
    codeNo = (li! % PER_WORLD) + 1;
  const worldEnd = codeNo === PER_WORLD;
  const ctx: RailCtx = { target, setTarget: (t) => (sfx.tap(), setTarget(t)), del, cycle, running, active, iters, check, bad, look: { ...look, dark } };
  const newBlock = level.palette.find((b) => b === 'sampai') ?? level.palette.find((b) => b === 'ulangi' || b === 'kalau' || b === 'jurus');
  const pulseNew = !locked && used === 0 && codeNo <= 2 ? newBlock : null;
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden landscape:flex-row" style={{ background: cfg.pageBg(level.world), color: INK, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <button onClick={() => (stop(), setLi(null))} aria-label="Peta level" className="koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5">
            <Icon name="arrow_back" size={24} />
          </button>
          <div className="min-w-0 truncate rounded-full px-4 py-2 font-extrabold text-white" style={{ fontFamily: BALOO, fontSize: 17, background: cfg.accent, boxShadow: '0 4px 0 rgba(0,0,0,.18)' }}>
            {title} · Level {lvNo} · {Wd.name} · {codeNo}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {ad.tools}
            <button onClick={help} disabled={locked} aria-label="Bantuan" className={`koding-round flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5 disabled:opacity-50 ${fails >= 2 && helpStep < 2 ? 'koding-pulse' : ''}`}>
              <Icon name="lightbulb" size={24} className="text-[#e0a100]" />
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2">
          {cfg.mascot(44)}
          <div className="koding-say mb-1 rounded-[18px] px-4 py-2.5 text-[15px] font-bold" style={{ maxWidth: 620 }}>
            {say}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="h-full w-full">{ad.stage}</div>
        </div>
      </div>
      <div className="koding-panel prog-panel flex w-full shrink-0 flex-col gap-2 self-center p-3 pt-0 landscape:justify-center landscape:self-stretch landscape:pt-3">
        <div className="flex items-center text-[13px] font-extrabold" style={{ color: dark ? '#e7e4ff' : INK }}>
          <span className="opacity-75">{hasJurus ? 'Jurus & program Agam' : 'Program Agam'}</span>
          <span className={`ml-auto rounded-full px-2.5 py-0.5 ${full ? 'bg-[#e04f5f] text-white' : dark ? 'bg-white/15' : 'bg-[#23304a]/10'}`}>
            Blok {used}/{level.limit}
          </span>
        </div>
        {hasJurus && (
          <div className={`prog-rail prog-rail-jurus ${dark ? 'koding-rail-dark' : ''}`} onClick={() => !locked && ctx.setTarget('jurus')}>
            <span className="prog-rail-tag" style={{ background: '#0ea5e9' }}>
              <Icon name="bolt" size={15} /> Jurus
            </span>
            <List l={code.jurus} t="jurus" ctx={ctx} empty="isi jurus di sini" />
          </div>
        )}
        <div className={`prog-rail ${dark ? 'koding-rail-dark' : ''}`} onClick={() => !locked && ctx.setTarget('main')}>
          {hasJurus && (
            <span className="prog-rail-tag" style={{ background: INK }}>
              <Icon name="play_arrow" size={15} /> Program
            </span>
          )}
          <List l={code.main} t="main" ctx={ctx} empty="ketuk blok di bawah" />
        </div>
        <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(level.palette.length, 5)}, minmax(0, 112px))` }}>
          {level.palette.map((b) => {
            const v = lookOf(b, look);
            return (
              <button
                key={b}
                onClick={() => add(b)}
                disabled={locked}
                className={`koding-block flex flex-col items-center justify-center gap-0.5 py-2 text-white disabled:opacity-50 ${full ? 'opacity-60' : ''} ${pulseNew === b ? 'koding-pulse' : ''}`}
                style={{ background: v.c, boxShadow: `0 5px 0 ${v.d}` }}
              >
                <span className="prog-pal-icon">{v.icon}</span>
                <span className="px-1 text-center" style={{ fontFamily: BALOO, fontSize: level.palette.length > 4 ? 13 : 15, fontWeight: 800, lineHeight: 1.1, maxWidth: '100%' }}>
                  {b === 'sampai' ? `sampai ${look.untilWord ?? 'selesai'}` : v.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          {running ? (
            <button onClick={stop} className="flex-1 rounded-[18px] bg-[#e04f5f] py-3.5 text-white shadow-[0_5px_0_#a8323f] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              Berhenti
            </button>
          ) : (
            <button onClick={go} disabled={!!ad.busy} className="flex-1 rounded-[18px] bg-[#22b573] py-3.5 text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              ▶ Jalankan
            </button>
          )}
          <button onClick={() => (sfx.close(), edit(EMPTY), setTarget(hasJurus ? 'jurus' : 'main'))} disabled={locked} aria-label="Hapus semua blok" className="koding-round flex w-14 items-center justify-center rounded-[18px] disabled:opacity-40">
            <Icon name="delete" size={24} />
          </button>
        </div>
      </div>

      {win !== null && (
        <WinDialog
          stars={win}
          title={allDone && li === TOTAL - 1 ? '10 level selesai!' : worldEnd ? `Level ${lvNo} selesai!` : cfg.winTitle}
          message={
            win === 3
              ? `Hebat! Cuma ${used} blok, paling hemat.`
              : revealed && used <= level.best
                ? `Pakai ${used} blok dengan bantuan. Coba lagi sendiri untuk 3 bintang?`
                : `Pakai ${used} blok. Bisa ${level.best} blok untuk 3 bintang?`
          }
          unlockNote={worldEnd && li! < TOTAL - 1 ? `Level ${lvNo + 1} · ${cfg.worlds[lvNo].name} sekarang terbuka!` : undefined}
          onRetry={() => (setWin(null), clearRun(), ad.reset())}
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
