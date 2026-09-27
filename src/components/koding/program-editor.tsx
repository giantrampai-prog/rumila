'use client';

// Penyusun program bertingkat Coding Agam (dipakai Ulangi, Kalau…, Jurus). Blok dari palet masuk ke tempat yang
// sedang dipilih (kotak bergaris kuning). Blok ulangi / kalau / sampai membuka tempat baru di dalamnya; ketuk
// kotak lain untuk pindah tempat. Ketuk ×N untuk mengganti jumlah ulangan, ketuk syarat untuk mengganti syarat
// "kalau", ketuk blok aksi untuk menghapusnya. Saat program berjalan, blok yang sedang dikerjakan menyala, blok
// ulangi menunjukkan putarannya dan blok kalau menunjukkan jawaban sensornya (ya/tidak).

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui';
import type { PBlock, Program, Stmt } from '@/lib/koding/prog';

/** tampilan blok aksi di palet & program */
export type BlockLook = { label: string; icon: ReactNode; c: string; d: string };

export interface EditorLook {
  /** aksi dunia: maju/lompat/pukul … */
  acts: Record<string, BlockLook>;
  /** teks syarat "kalau" (pendek, di kepala blok) */
  conds?: { id: string; short: string }[];
  /** kata untuk "ulangi sampai …" */
  untilWord?: string;
  /** warna tempel rel (mengikuti tema game) */
  dark?: boolean;
}

export const STRUCT_LOOK: Record<'ulangi' | 'sampai' | 'kalau' | 'jurus', BlockLook> = {
  ulangi: { label: 'ulangi', icon: <Icon name="repeat" size={26} />, c: '#f59e0b', d: '#b87300' },
  sampai: { label: 'sampai…', icon: <Icon name="all_inclusive" size={26} />, c: '#f97316', d: '#bf4f06' },
  kalau: { label: 'kalau', icon: <Icon name="alt_route" size={26} />, c: '#16a34a', d: '#0f7a36' },
  jurus: { label: 'jurus', icon: <Icon name="bolt" size={26} />, c: '#0ea5e9', d: '#0369a1' },
};
export const isStruct = (b: PBlock): b is keyof typeof STRUCT_LOOK => b in STRUCT_LOOK;
export const lookOf = (b: PBlock, look: EditorLook): BlockLook => (isStruct(b) ? STRUCT_LOOK[b] : look.acts[b]);

/* ---------------- ubah pohon program ---------------- */

/** tempat blok baru masuk: 'main' | 'jurus' | '<id>/body' | '<id>/then' | '<id>/else' */
export type Target = string;
export const EMPTY: Program = { main: [], jurus: [] };

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
export const addAt = (p: Program, t: Target, s: Stmt) => mapLists(p, (k, l) => (k === t ? [...l, s] : l));
export const removeId = (p: Program, id: string) => mapLists(p, (_, l) => l.filter((s) => s.id !== id));
export const patch = (p: Program, id: string, f: (s: Stmt) => Stmt) => mapLists(p, (_, l) => l.map((s) => (s.id === id ? f(s) : s)));

/** rantai jenis wadah dari akar sampai tempat t (untuk aturan bersarang) */
export function chainOf(p: Program, t: Target): { root: 'main' | 'jurus'; kinds: Stmt['t'][] } | null {
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

/** alasan blok b tidak boleh di tempat t (null = boleh) */
export function refuse(p: Program, t: Target, b: PBlock): string | null {
  const ch = chainOf(p, t);
  if (!ch) return 'Pilih tempatnya dulu.';
  if (b === 'ulangi' && (ch.kinds.includes('loop') || ch.kinds.includes('until'))) return 'Blok ulangi tidak bisa dimasukkan ke dalam ulangi. Ketuk tempat lain dulu.';
  if (b === 'sampai' && !(ch.root === 'main' && ch.kinds.length === 0)) return 'Ulangi sampai selesai hanya bisa di program utama, di luar blok lain.';
  if (b === 'kalau' && ch.kinds.filter((k) => k === 'if').length >= 2) return 'Kalau-nya sudah terlalu dalam. Ketuk tempat lain dulu.';
  if (b === 'jurus' && ch.root !== 'main') return 'Jurus dipanggil dari program utama, bukan dari dalam jurus.';
  return null;
}

/* ---------------- rel program ---------------- */

export type RailCtx = {
  target: Target;
  setTarget: (t: Target) => void;
  del: (id: string) => void;
  cycle: (id: string) => void;
  running: boolean;
  active: string | null;
  iters: Record<string, number>;
  check: { id: string; ok: boolean } | null;
  bad: string | null;
  look: EditorLook;
};

function Slot({ t, ctx, empty }: { t: Target; ctx: RailCtx; empty?: string }) {
  const on = ctx.target === t && !ctx.running;
  return (
    <button onClick={(e) => (e.stopPropagation(), ctx.setTarget(t))} disabled={ctx.running} className={`prog-slot ${on ? 'prog-slot-on' : ''}`} aria-label={on ? 'Blok baru masuk ke sini' : 'Pilih tempat ini'}>
      {empty && on ? <span className="px-1 text-[12px] font-extrabold opacity-70">{empty}</span> : <Icon name="add" size={18} />}
    </button>
  );
}

export function List({ l, t, ctx, empty }: { l: Stmt[]; t: Target; ctx: RailCtx; empty?: string }) {
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
  return (
    <div
      data-id={s.id}
      className={`prog-box ${ctx.active === s.id ? 'prog-box-lit' : ''} ${ctx.bad === s.id ? 'koding-bad' : ''}`}
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
  if (s.t === 'act' || s.t === 'call') {
    const b = s.t === 'act' ? ctx.look.acts[s.a] : STRUCT_LOOK.jurus;
    return (
      <button
        data-id={s.id}
        onClick={(e) => (e.stopPropagation(), !ctx.running && ctx.del(s.id))}
        className={`koding-block koding-block-sm touch-none select-none ${ctx.active === s.id ? 'koding-active' : ''} ${ctx.bad === s.id ? 'koding-bad' : ''}`}
        style={{ background: b.c, boxShadow: `0 3px 0 ${b.d}` }}
        aria-label={`${b.label}. Ketuk untuk menghapus`}
      >
        <span className="prog-mini">{b.icon}</span>
      </button>
    );
  }
  if (s.t === 'loop') {
    const it = ctx.iters[s.id];
    return (
      <Box
        s={s}
        ctx={ctx}
        color={STRUCT_LOOK.ulangi.c}
        head={
          <>
            <Icon name="repeat" size={17} />
            <span className="text-[13px] font-extrabold">ulangi</span>
            <button onClick={(e) => (e.stopPropagation(), !ctx.running && ctx.cycle(s.id))} className="prog-count" aria-label={`Ulangi ${s.n} kali. Ketuk untuk mengganti`}>
              {it ? `${it}/${s.n}` : `${s.n}×`}
            </button>
          </>
        }
      >
        <div className="prog-body">
          <List l={s.body} t={`${s.id}/body`} ctx={ctx} empty="isi di sini" />
        </div>
      </Box>
    );
  }
  if (s.t === 'until') {
    const it = ctx.iters[s.id];
    return (
      <Box
        s={s}
        ctx={ctx}
        color={STRUCT_LOOK.sampai.c}
        head={
          <>
            <Icon name="all_inclusive" size={17} />
            <span className="text-[13px] font-extrabold">ulangi sampai {ctx.look.untilWord ?? 'selesai'}</span>
            {it ? <span className="prog-count">{it}</span> : null}
          </>
        }
      >
        <div className="prog-body">
          <List l={s.body} t={`${s.id}/body`} ctx={ctx} empty="isi di sini" />
        </div>
      </Box>
    );
  }
  const chk = ctx.check?.id === s.id ? ctx.check.ok : null;
  const cond = ctx.look.conds?.find((c) => c.id === s.cond);
  return (
    <Box
      s={s}
      ctx={ctx}
      color={STRUCT_LOOK.kalau.c}
      head={
        <>
          <Icon name="alt_route" size={17} />
          <span className="text-[13px] font-extrabold">kalau ada</span>
          <button onClick={(e) => (e.stopPropagation(), !ctx.running && ctx.cycle(s.id))} className="prog-count" aria-label={`Syarat: ${cond?.short}. Ketuk untuk mengganti`}>
            {cond?.short ?? s.cond}
          </button>
          {chk !== null && <span className={`prog-check ${chk ? 'bg-white text-[#16804f]' : 'bg-[#23304a] text-white'}`}>{chk ? 'ya' : 'tidak'}</span>}
        </>
      }
    >
      <div className={`prog-body ${chk === true ? 'prog-branch-on' : ''}`}>
        <List l={s.then} t={`${s.id}/then`} ctx={ctx} empty="kalau ya" />
      </div>
      <div className="px-2 text-[12px] font-extrabold" style={{ color: ctx.look.dark ? '#bff5cf' : '#0f7a36' }}>
        kalau tidak
      </div>
      <div className={`prog-body ${chk === false ? 'prog-branch-on' : ''}`}>
        <List l={s.else} t={`${s.id}/else`} ctx={ctx} empty="kalau tidak" />
      </div>
    </Box>
  );
}
