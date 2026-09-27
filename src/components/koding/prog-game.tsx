'use client';

// Layar game Coding Agam yang memakai program bertingkat: Ulangi (blok ulangi N kali), Kalau… (ulangi sampai
// bintang + kalau/kalau tidak) dan Jurus (merakit jurus sendiri lalu memanggilnya). Struktur sama dengan Langkah:
// 10 Level bertema × 10 coding, peta, bintang, sertifikat. Papan & robot memakai panggung Langkah.
//
// Menyusun program: ketuk blok di palet → masuk ke tempat yang sedang dipilih (kotak bergaris kuning). Blok ulangi /
// kalau / sampai bintang membuka tempat baru di dalamnya; ketuk kotak lain untuk pindah tempat. Ketuk ×N untuk
// mengganti jumlah ulangan, ketuk sensor untuk mengganti syarat "kalau", ketuk blok biasa untuk menghapusnya.
// Ada jatah blok per soal, jadi program harus hemat. Saat berjalan, blok yang sedang dikerjakan menyala dan blok
// ulangi menunjukkan putaran ke berapa.

import { useRouter } from 'next/navigation';
import { useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui';
import { DX, DY, parse, type Cmd, type Dir } from '@/lib/koding/engine';
import { COND_TEXT, CONDS, countBlocks, newId, progStars, runProg, type PBlock, type Program, type ProgLevel, type Stmt } from '@/lib/koding/prog';
import { sfx } from '@/lib/sfx';
import { useMe } from '@/lib/store';
import { completeTool, useToolSession } from '@/lib/tool-session';
import { Certificate } from './certificate';
import { BALOO, fmtDate, INK, LevelMap, PER_WORLD, summarize, useProgress, wait, WinDialog, withStars } from './shared';
import { AgamFront, Stage, WORLD } from './stage';
import './koding.css';

export interface ProgGameConfig {
  title: string;
  tool: string;
  levels: ProgLevel[];
  /** sapaan pertama di peta */
  intro: string;
}

/* ---------------- tampilan blok ---------------- */

const CMD: Record<Cmd, { label: string; icon: string; c: string; d: string }> = {
  maju: { label: 'maju', icon: 'arrow_upward', c: '#3a86ff', d: '#2463c9' },
  kiri: { label: 'belok kiri', icon: 'turn_left', c: '#8b5cf6', d: '#6a3fd1' },
  kanan: { label: 'belok kanan', icon: 'turn_right', c: '#8b5cf6', d: '#6a3fd1' },
};
const PAL: Record<Exclude<PBlock, Cmd>, { label: string; icon: string; c: string; d: string }> = {
  ulangi: { label: 'ulangi', icon: 'repeat', c: '#f59e0b', d: '#b87300' },
  sampai: { label: 'sampai ⭐', icon: 'all_inclusive', c: '#f97316', d: '#bf4f06' },
  kalau: { label: 'kalau', icon: 'alt_route', c: '#16a34a', d: '#0f7a36' },
  jurus: { label: 'jurus', icon: 'bolt', c: '#0ea5e9', d: '#0369a1' },
};
const COND_SHORT: Record<string, string> = { depan: 'rintangan di depan', kanan: 'kanan terbuka', kiri: 'kiri terbuka' };

/* ---------------- ubah pohon program ---------------- */

/** tempat blok baru masuk: 'main' | 'jurus' | '<id>/body' | '<id>/then' | '<id>/else' */
type Target = string;

function mapLists(p: Program, fn: (key: Target, l: Stmt[]) => Stmt[]): Program {
  const walk = (key: Target, l: Stmt[]): Stmt[] =>
    fn(
      key,
      l.map((s) => {
        if (s.t === 'loop' || s.t === 'until') return { ...s, body: walk(`${s.id}/body`, s.body) };
        if (s.t === 'if') return { ...s, then: walk(`${s.id}/then`, s.then), else: walk(`${s.id}/else`, s.else) };
        return s;
      }),
    );
  return { main: walk('main', p.main), jurus: walk('jurus', p.jurus) };
}
const addAt = (p: Program, t: Target, s: Stmt) => mapLists(p, (k, l) => (k === t ? [...l, s] : l));
const removeId = (p: Program, id: string) => mapLists(p, (_, l) => l.filter((s) => s.id !== id));
const patch = (p: Program, id: string, f: (s: Stmt) => Stmt) => mapLists(p, (_, l) => l.map((s) => (s.id === id ? f(s) : s)));

/** rantai jenis wadah dari akar sampai tempat t (untuk aturan bersarang) */
function chainOf(p: Program, t: Target): { root: 'main' | 'jurus'; kinds: Stmt['t'][] } | null {
  const find = (l: Stmt[], kinds: Stmt['t'][]): Stmt['t'][] | null => {
    for (const s of l) {
      const here = [...kinds, s.t];
      if (s.t === 'loop' || s.t === 'until') {
        if (t === `${s.id}/body`) return here;
        const r = find(s.body, here);
        if (r) return r;
      } else if (s.t === 'if') {
        if (t === `${s.id}/then` || t === `${s.id}/else`) return here;
        const r = find(s.then, here) ?? find(s.else, here);
        if (r) return r;
      }
    }
    return null;
  };
  if (t === 'main') return { root: 'main', kinds: [] };
  if (t === 'jurus') return { root: 'jurus', kinds: [] };
  const m = find(p.main, []);
  if (m) return { root: 'main', kinds: m };
  const j = find(p.jurus, []);
  return j ? { root: 'jurus', kinds: j } : null;
}

/** boleh menaruh blok b di tempat t? (ulangi tidak di dalam ulangi, sampai bintang hanya di program utama, kalau maks 2 lapis, jurus tidak memanggil dirinya) */
function allowed(p: Program, t: Target, b: PBlock): boolean {
  const ch = chainOf(p, t);
  if (!ch) return false;
  if (b === 'ulangi') return !ch.kinds.includes('loop') && !ch.kinds.includes('until');
  if (b === 'sampai') return ch.root === 'main' && ch.kinds.length === 0;
  if (b === 'kalau') return ch.kinds.filter((k) => k === 'if').length < 2;
  if (b === 'jurus') return ch.root === 'main';
  return true;
}

/* ---------------- rel program ---------------- */

type RailCtx = {
  target: Target;
  setTarget: (t: Target) => void;
  del: (id: string) => void;
  cycle: (id: string) => void;
  running: boolean;
  active: string | null;
  iters: Record<string, number>;
  check: { id: string; ok: boolean } | null;
  bad: string | null;
  dark: boolean;
};

function Slot({ t, ctx, empty }: { t: Target; ctx: RailCtx; empty?: string }) {
  const on = ctx.target === t && !ctx.running;
  return (
    <button
      onClick={(e) => (e.stopPropagation(), ctx.setTarget(t))}
      disabled={ctx.running}
      className={`prog-slot ${on ? 'prog-slot-on' : ''}`}
      aria-label={on ? 'Blok baru masuk ke sini' : 'Pilih tempat ini'}
    >
      {empty && on ? <span className="px-1 text-[12px] font-extrabold opacity-70">{empty}</span> : <Icon name="add" size={18} />}
    </button>
  );
}

function List({ l, t, ctx, empty }: { l: Stmt[]; t: Target; ctx: RailCtx; empty?: string }) {
  return (
    <>
      {l.map((s) => (
        <Block key={s.id} s={s} ctx={ctx} />
      ))}
      <Slot t={t} ctx={ctx} empty={l.length ? undefined : empty} />
    </>
  );
}

function Box({ s, ctx, color, head, children }: { s: Stmt; ctx: RailCtx; color: string; head: ReactNode; children: ReactNode }) {
  const lit = ctx.active === s.id;
  return (
    <div
      data-id={s.id}
      className={`prog-box ${lit ? 'prog-box-lit' : ''} ${ctx.bad === s.id ? 'koding-bad' : ''}`}
      style={{ borderColor: color, background: `${color}1f` }}
      onClick={(e) => {
        e.stopPropagation();
        if (!ctx.running) ctx.setTarget(`${s.id}/${s.t === 'if' ? 'then' : 'body'}`);
      }}
    >
      <div className="flex items-center gap-1 rounded-t-[10px] px-1.5 py-1 text-white" style={{ background: color }}>
        {head}
        {!ctx.running && (
          <button onClick={(e) => (e.stopPropagation(), ctx.del(s.id))} aria-label="Hapus blok ini" className="ml-auto flex size-6 items-center justify-center rounded-full bg-black/15">
            <Icon name="close" size={15} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Block({ s, ctx }: { s: Stmt; ctx: RailCtx }) {
  if (s.t === 'cmd' || s.t === 'call') {
    const b = s.t === 'cmd' ? CMD[s.c] : PAL.jurus;
    return (
      <button
        data-id={s.id}
        onClick={(e) => (e.stopPropagation(), !ctx.running && ctx.del(s.id))}
        className={`koding-block koding-block-sm touch-none select-none ${ctx.active === s.id ? 'koding-active' : ''} ${ctx.bad === s.id ? 'koding-bad' : ''}`}
        style={{ background: b.c, boxShadow: `0 3px 0 ${b.d}` }}
        aria-label={`${b.label}. Ketuk untuk menghapus`}
      >
        <Icon name={b.icon} size={20} />
      </button>
    );
  }
  if (s.t === 'loop') {
    const it = ctx.iters[s.id];
    return (
      <Box s={s} ctx={ctx} color={PAL.ulangi.c} head={
        <>
          <Icon name="repeat" size={17} />
          <span className="text-[13px] font-extrabold">ulangi</span>
          <button onClick={(e) => (e.stopPropagation(), !ctx.running && ctx.cycle(s.id))} className="prog-count" aria-label={`Ulangi ${s.n} kali. Ketuk untuk mengganti`}>
            {it ? `${it}/${s.n}` : `${s.n}×`}
          </button>
        </>
      }>
        <div className="prog-body">
          <List l={s.body} t={`${s.id}/body`} ctx={ctx} empty="isi di sini" />
        </div>
      </Box>
    );
  }
  if (s.t === 'until') {
    const it = ctx.iters[s.id];
    return (
      <Box s={s} ctx={ctx} color={PAL.sampai.c} head={
        <>
          <Icon name="all_inclusive" size={17} />
          <span className="text-[13px] font-extrabold">ulangi sampai ⭐</span>
          {it ? <span className="prog-count">{it}</span> : null}
        </>
      }>
        <div className="prog-body">
          <List l={s.body} t={`${s.id}/body`} ctx={ctx} empty="isi di sini" />
        </div>
      </Box>
    );
  }
  const chk = ctx.check?.id === s.id ? ctx.check.ok : null;
  return (
    <Box s={s} ctx={ctx} color={PAL.kalau.c} head={
      <>
        <Icon name="alt_route" size={17} />
        <span className="text-[13px] font-extrabold">kalau</span>
        <button onClick={(e) => (e.stopPropagation(), !ctx.running && ctx.cycle(s.id))} className="prog-count" aria-label={`Syarat: ${COND_TEXT[s.cond]}. Ketuk untuk mengganti`}>
          {COND_SHORT[s.cond]}
        </button>
        {chk !== null && <span className={`prog-check ${chk ? 'bg-white text-[#16804f]' : 'bg-[#23304a] text-white'}`}>{chk ? 'ya' : 'tidak'}</span>}
      </>
    }>
      <div className={`prog-body ${chk === true ? 'prog-branch-on' : ''}`}>
        <List l={s.then} t={`${s.id}/then`} ctx={ctx} empty="kalau ya" />
      </div>
      <div className="px-2 text-[12px] font-extrabold" style={{ color: ctx.dark ? '#bff5cf' : '#0f7a36' }}>
        kalau tidak
      </div>
      <div className={`prog-body ${chk === false ? 'prog-branch-on' : ''}`}>
        <List l={s.else} t={`${s.id}/else`} ctx={ctx} empty="kalau tidak" />
      </div>
    </Box>
  );
}

/* ---------------- permainan ---------------- */

const EMPTY: Program = { main: [], jurus: [] };

export function ProgGame({ cfg }: { cfg: ProgGameConfig }) {
  const { levels, tool, title } = cfg;
  const TOTAL = levels.length;
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  useToolSession(memberId, tool, 'coding');
  const router = useRouter();
  const [prog, saveProg] = useProgress(`rumila-${tool}-${memberId}`);

  const [li, setLi] = useState<number | null>(null);
  const level = li === null ? null : levels[li];
  const [code, setCode] = useState<Program>(EMPTY);
  const [target, setTarget] = useState<Target>('main');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rot, setRot] = useState(0);
  const [bump, setBump] = useState(false);
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

  const resetAgam = (l: ProgLevel) => {
    const p = parse(l);
    setPos(p.start);
    setRot(l.dir * 90);
    setBump(false);
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
    resetAgam(l);
  };

  const stop = () => {
    runId.current++;
    setRunning(false);
    if (level) resetAgam(level);
  };

  const edit = (next: Program) => {
    setCode(next);
    setBad(null);
    if (level && !running) resetAgam(level);
  };

  const used = countBlocks(code);
  const full = !!level && used >= level.limit;

  const add = (b: PBlock) => {
    if (!level || running) return;
    if (full) {
      sfx.thud();
      setSay(`Jatah blok habis (${level.limit} blok)! Coba buat programnya lebih hemat.`);
      return;
    }
    if (!allowed(code, target, b)) {
      sfx.thud();
      setSay(
        b === 'ulangi'
          ? 'Blok ulangi tidak bisa dimasukkan ke dalam ulangi. Ketuk tempat lain dulu.'
          : b === 'sampai'
            ? 'Ulangi sampai bintang hanya bisa di program utama, di luar blok lain.'
            : b === 'jurus'
              ? 'Jurus dipanggil dari program utama, bukan dari dalam jurus.'
              : 'Kalau-nya sudah terlalu dalam. Ketuk tempat lain dulu.',
      );
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
            ? { id, t: 'if', cond: 'depan', then: [], else: [] }
            : b === 'jurus'
              ? { id, t: 'call' }
              : { id, t: 'cmd', c: b };
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
    edit(
      patch(code, id, (s) => (s.t === 'loop' ? { ...s, n: s.n >= 9 ? 2 : s.n + 1 } : s.t === 'if' ? { ...s, cond: CONDS[(CONDS.indexOf(s.cond) + 1) % CONDS.length] } : s)),
    );
  };

  const help = () => {
    if (!level || running) return;
    sfx.pick();
    if (helpStep === 0) {
      setHelpStep(1);
      setSay(`${level.hint} Jatahnya ${level.limit} blok; paling hemat ${level.best} blok.`);
    } else {
      setHelpStep(2);
      setRevealed(true);
      setSay(`Contoh program: ${level.tip}.`);
    }
  };

  const go = async () => {
    if (!level || running) return;
    if (!used) {
      sfx.thud();
      setSay('Susun perintah dulu: ketuk blok di bawah.');
      return;
    }
    const id = ++runId.current;
    setBad(null);
    setRunning(true);
    resetAgam(level);
    sfx.open();
    await wait(250);
    const r = runProg(level, code);
    let turn = level.dir * 90;
    let lastDir: Dir = level.dir;
    for (const s of r.steps) {
      if (runId.current !== id) return;
      setActive(s.id);
      setIters(s.iters);
      if (s.kind === 'check') {
        setCheck({ id: s.id, ok: !!s.ok });
        sfx.tap();
        await wait(300);
      } else if (s.kind === 'call') {
        sfx.clink();
        await wait(220);
      } else if (s.kind === 'turn') {
        turn += (s.dir - lastDir + 4) % 4 === 1 ? 90 : -90;
        lastDir = s.dir;
        setRot(turn);
        sfx.whoosh();
        await wait(340);
      } else if (s.kind === 'move') {
        setPos({ x: s.x, y: s.y });
        sfx.hop(0);
        await wait(360);
      } else {
        setPos({ x: s.x + DX[s.dir] * 0.28, y: s.y + DY[s.dir] * 0.28 });
        await wait(160);
        sfx.thud();
        setBump(true);
        setPos({ x: s.x, y: s.y });
        await wait(520);
        setBump(false);
      }
    }
    if (runId.current !== id) return;
    setRunning(false);
    setCheck(null);
    if (r.result === 'win') {
      const st = progStars(level, used, revealed);
      sfx.celebrate();
      setSay('Hore, Agam sampai di bintang!');
      setWin(st);
      if (!(prog.stars[level.id] ?? 0)) completeTool(memberId, tool, 'coding', `level:${level.id}`);
      saveProg(withStars(levels, prog, level.id, st));
      return;
    }
    const f = fails + 1;
    setFails(f);
    const nudge = f >= 2 ? ' Butuh bantuan? Ketuk lampu.' : '';
    const last = r.steps[r.steps.length - 1];
    setActive(null);
    if (r.result === 'bump') {
      setBad(last.id);
      setSay(`Aduh, Agam menabrak! Periksa blok yang berkedip merah.${nudge}`);
    } else if (r.result === 'stuck') {
      sfx.bounceBack();
      setSay(`Agam berputar-putar terus dan tidak sampai. Periksa isi blok ulangi atau kalau.${nudge}`);
    } else {
      sfx.bounceBack();
      setSay(`Programnya habis, tapi Agam belum sampai di bintang.${nudge}`);
    }
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
  const W = WORLD[level.theme];
  const dark = !!W.dark;
  const lvNo = Math.floor(li! / PER_WORLD) + 1,
    codeNo = (li! % PER_WORLD) + 1;
  const worldEnd = codeNo === PER_WORLD;
  const ctx: RailCtx = { target, setTarget: (t) => (sfx.tap(), setTarget(t)), del, cycle, running, active, iters, check, bad, dark };
  const newBlock = level.palette.find((b) => b === 'ulangi' || b === 'sampai' || b === 'kalau' || b === 'jurus');
  const pulseNew = !running && used === 0 && codeNo <= 2 ? (level.palette.includes('sampai') ? 'sampai' : newBlock) : null;
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
          <button onClick={help} disabled={running} aria-label="Bantuan" className={`koding-round ml-auto flex size-11 shrink-0 items-center justify-center rounded-full active:translate-y-0.5 disabled:opacity-50 ${fails >= 2 && helpStep < 2 ? 'koding-pulse' : ''}`}>
            <Icon name="lightbulb" size={24} className="text-[#e0a100]" />
          </button>
        </div>
        <div className="flex items-end gap-2">
          <AgamFront size={44} />
          <div className="koding-say mb-1 rounded-[18px] px-4 py-2.5 text-[15px] font-bold" style={{ maxWidth: 620 }}>
            {say}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="koding-diorama h-full w-full">
            <Stage level={level} pos={pos} rot={rot} bump={bump} won={win !== null} />
          </div>
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
          <div className={`prog-rail prog-rail-jurus ${dark ? 'koding-rail-dark' : ''}`} onClick={() => !running && ctx.setTarget('jurus')}>
            <span className="prog-rail-tag" style={{ background: PAL.jurus.c }}>
              <Icon name="bolt" size={15} /> Jurus
            </span>
            <List l={code.jurus} t="jurus" ctx={ctx} empty="isi jurus di sini" />
          </div>
        )}
        <div className={`prog-rail ${dark ? 'koding-rail-dark' : ''}`} onClick={() => !running && ctx.setTarget('main')}>
          {hasJurus && (
            <span className="prog-rail-tag" style={{ background: INK }}>
              <Icon name="play_arrow" size={15} /> Program
            </span>
          )}
          <List l={code.main} t="main" ctx={ctx} empty="ketuk blok di bawah" />
        </div>
        <div className="grid justify-center gap-2" style={{ gridTemplateColumns: `repeat(${level.palette.length}, minmax(0, 118px))` }}>
          {level.palette.map((b) => {
            const v = b === 'maju' || b === 'kiri' || b === 'kanan' ? CMD[b] : PAL[b];
            return (
              <button
                key={b}
                onClick={() => add(b)}
                disabled={running}
                className={`koding-block flex flex-col items-center justify-center gap-0.5 py-2 text-white disabled:opacity-50 ${full ? 'opacity-60' : ''} ${pulseNew === b ? 'koding-pulse' : ''}`}
                style={{ background: v.c, boxShadow: `0 5px 0 ${v.d}` }}
              >
                <Icon name={v.icon} size={26} />
                <span className="px-1 text-center" style={{ fontFamily: BALOO, fontSize: level.palette.length > 4 ? 13 : 15, fontWeight: 800, lineHeight: 1.1, maxWidth: '100%' }}>
                  {v.label}
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
            <button onClick={go} className="flex-1 rounded-[18px] bg-[#22b573] py-3.5 text-white shadow-[0_5px_0_#16804f] active:translate-y-1" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 900 }}>
              ▶ Jalankan
            </button>
          )}
          <button onClick={() => (sfx.close(), edit(EMPTY), setTarget('main'))} disabled={running} aria-label="Hapus semua blok" className="koding-round flex w-14 items-center justify-center rounded-[18px] disabled:opacity-40">
            <Icon name="delete" size={24} />
          </button>
        </div>
      </div>

      {win !== null && (
        <WinDialog
          stars={win}
          title={allDone && li === TOTAL - 1 ? '10 level selesai!' : worldEnd ? `Level ${lvNo} selesai!` : 'Agam sampai!'}
          message={
            win === 3
              ? `Hebat! Cuma ${used} blok, paling hemat.`
              : revealed && used <= level.best
                ? `Pakai ${used} blok dengan bantuan. Coba lagi sendiri untuk 3 bintang?`
                : `Pakai ${used} blok. Bisa ${level.best} blok untuk 3 bintang?`
          }
          unlockNote={worldEnd && li! < TOTAL - 1 ? `Level ${lvNo + 1} · ${WORLD[levels[li! + 1].theme].name} sekarang terbuka!` : undefined}
          onRetry={() => (setWin(null), resetAgam(level))}
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
