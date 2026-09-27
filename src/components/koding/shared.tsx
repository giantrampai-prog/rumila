'use client';

// Bagian bersama game Coding Agam (Langkah, Pola, …): progres per anak (localStorage, ikut sinkron akun), peta
// 10 Level × 10 coding dengan jalur berkelok, kartu sertifikat, dan dialog menang berbintang + konfeti.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui';
import type { Theme } from '@/lib/koding/engine';
import { sfx } from '@/lib/sfx';
import { AgamFront, ThemeVignette, THEMES, WORLD } from './stage';

export const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
export const INK = '#23304a';
export const PER_WORLD = 10;

/* ---------------- progres ---------------- */

/** bintang per id soal (bukan per urutan, supaya aman bila daftar soal berubah) + tanggal sertifikat */
export type Progress = { stars: Record<string, number>; certAt?: string };

const loadProg = (key: string): Progress => {
  try {
    const raw = localStorage.getItem(key);
    const p = raw ? JSON.parse(raw) : null;
    if (p?.stars) return p;
  } catch {}
  return { stars: {} };
};

export function useProgress(key: string) {
  const [prog, setProg] = useState<Progress>({ stars: {} });
  useEffect(() => {
    setProg(loadProg(key));
    // progres dari perangkat lain baru tiba (sinkron akun) → muat ulang
    const on = (e: Event) => (e as CustomEvent<string[]>).detail.includes(key) && setProg(loadProg(key));
    window.addEventListener('rumila:saves', on);
    return () => window.removeEventListener('rumila:saves', on);
  }, [key]);
  const save = (p: Progress) => {
    setProg(p);
    try {
      localStorage.setItem(key, JSON.stringify(p));
    } catch {}
  };
  return [prog, save] as const;
}

type Item = { id: string; theme: Theme };

export function summarize(list: Item[], prog: Progress) {
  const total = list.length;
  const doneCount = list.filter((l) => (prog.stars[l.id] ?? 0) > 0).length;
  const starTotal = list.reduce((a, l) => a + (prog.stars[l.id] ?? 0), 0);
  const allDone = doneCount === total;
  const firstOpen = list.findIndex((l) => !((prog.stars[l.id] ?? 0) > 0));
  const current = firstOpen === -1 ? total - 1 : firstOpen;
  const unlocked = (i: number) => i === 0 || (prog.stars[list[i - 1].id] ?? 0) > 0;
  return { total, doneCount, starTotal, allDone, current, unlocked };
}

/** simpan bintang (ambil yang terbaik) + tanggal sertifikat saat semua selesai */
export function withStars(list: Item[], prog: Progress, id: string, st: number): Progress {
  const stars = { ...prog.stars, [id]: Math.max(prog.stars[id] ?? 0, st) };
  const finished = list.every((l) => (stars[l.id] ?? 0) > 0);
  return { ...prog, stars, certAt: prog.certAt ?? (finished ? new Date().toISOString() : undefined) };
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------------- peta level: 10 Level × 10 coding, jalur berkelok ---------------- */

const COLS = 5;
/** posisi (kolom, baris) coding ke-k dalam satu Level; baris ganjil berjalan dari kanan ke kiri */
const cellOf = (k: number) => {
  const r = Math.floor(k / COLS),
    c = k % COLS;
  return { r, c: r % 2 ? COLS - 1 - c : c };
};

function Trail({ rows }: { rows: number }) {
  // jalur putus-putus melewati tengah setiap node, turun tegak di kolom ujung (tidak keluar dari kartu)
  const W = COLS * 100,
    H = rows * 100;
  let d = 'M50 50';
  for (let r = 0; r < rows; r++) {
    const y = r * 100 + 50;
    const endX = r % 2 ? 50 : W - 50;
    d += ` L${endX} ${y}`;
    if (r < rows - 1) d += ` L${endX} ${y + 100}`;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="6" strokeDasharray="10 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function LevelMap({
  title,
  list,
  prog,
  greeting,
  onOpen,
  onCert,
  onBack,
}: {
  title: string;
  list: Item[];
  prog: Progress;
  greeting: ReactNode;
  onOpen: (i: number) => void;
  onCert: () => void;
  onBack: () => void;
}) {
  const { total, doneCount, starTotal, allDone, current, unlocked } = summarize(list, prog);
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (current < 5) return;
    // gulir ke soal yang sedang dikerjakan
    mapRef.current?.querySelector('[data-current="1"]')?.scrollIntoView({ block: 'center' });
  }, [current]);
  return (
    <div ref={mapRef} className="koding-paper fixed inset-0 overflow-y-auto" style={{ color: INK }}>
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-10 sm:px-6" style={{ paddingTop: 'max(14px, env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} aria-label="Kembali" className="koding-round flex size-12 items-center justify-center rounded-full active:translate-y-0.5">
            <Icon name="arrow_back" size={26} />
          </button>
          <div className="flex-1">
            <div className="text-[13px] font-extrabold opacity-60">Coding Agam</div>
            <h1 style={{ fontFamily: BALOO, fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{title}</h1>
          </div>
          <div className="koding-round flex items-center gap-1 rounded-full px-3 py-2 font-extrabold" style={{ fontFamily: BALOO }}>
            <Icon name="star" size={20} className="text-[#f2b705]" /> {starTotal}
          </div>
        </div>
        <div className="mt-4 flex max-w-[760px] items-end gap-3">
          <AgamFront />
          <div className="koding-say mb-3 flex-1 rounded-[18px] px-4 py-3 text-[15px] font-bold">{greeting}</div>
        </div>

        {/* kartu sertifikat & kemajuan */}
        <button
          onClick={() => (allDone ? sfx.celebrate() : sfx.open(), onCert())}
          className={`koding-certcard mt-3 flex w-full max-w-[760px] items-center gap-3 rounded-[20px] p-3 text-left ${allDone ? 'koding-certcard-on' : ''}`}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full" style={{ background: allDone ? '#f2b705' : '#e9dfcb' }}>
            <Icon name="workspace_premium" size={28} className={allDone ? 'text-white' : 'text-[#9b8f78]'} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold" style={{ fontFamily: BALOO, fontSize: 18 }}>
              {allDone ? 'Lihat sertifikatmu' : 'Sertifikat Programmer Cilik'}
            </span>
            {!allDone && <span className="block text-[13px] font-bold opacity-70">Selesaikan {total} coding untuk mendapatkannya · ketuk untuk lihat contoh</span>}
            <span className="mt-1 block h-3 overflow-hidden rounded-full bg-[#e9dfcb]">
              <span className="block h-full rounded-full bg-[#22b573] transition-[width] duration-700" style={{ width: `${(doneCount / total) * 100}%` }} />
            </span>
            <span className="mt-1 block text-[13px] font-bold opacity-70">
              {doneCount} dari {total} coding selesai
            </span>
          </span>
        </button>

        {/* dunia menyesuaikan lebar layar: 1 kolom di HP, 2 di tablet/Fold, 3 di layar lebar */}
        <div className="koding-worlds mt-6">
          {THEMES.map((t, w) => {
            const start = w * PER_WORLD;
            const worldOpen = unlocked(start);
            const W = WORLD[t];
            return (
              <section key={t} className="overflow-hidden rounded-[24px]" style={{ background: W.bg, color: W.ink }}>
                <ThemeVignette theme={t} />
                <div className="p-4 pt-3">
                  {/* judul selalu dua baris dengan tinggi tetap, supaya kotak-kotak di semua kartu sejajar */}
                  <div className="mb-3">
                    <h2 className="truncate" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
                      Level {w + 1} · {W.name}
                    </h2>
                    <div className="mt-0.5 flex items-center gap-1 text-[13px] font-extrabold opacity-75">
                      {worldOpen ? (
                        <>
                          <Icon name="star" size={15} className="text-[#f2b705]" />
                          {list.slice(start, start + PER_WORLD).reduce((a, l) => a + (prog.stars[l.id] ?? 0), 0)}/{PER_WORLD * 3} · {PER_WORLD} coding
                        </>
                      ) : (
                        <>
                          <Icon name="lock" size={15} /> Buka setelah Level {w}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative grid gap-x-2 gap-y-3" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                    <Trail rows={PER_WORLD / COLS} />
                    {Array.from({ length: PER_WORLD }, (_, k) => {
                      const i = start + k;
                      const l = list[i];
                      const { r, c } = cellOf(k);
                      const open = unlocked(i);
                      const st = prog.stars[l.id] ?? 0;
                      const isCur = i === current && !allDone;
                      return (
                        <button
                          key={l.id}
                          data-current={isCur ? '1' : undefined}
                          disabled={!open}
                          onClick={() => onOpen(i)}
                          className={`koding-node flex aspect-square flex-col items-center justify-center rounded-[18px] ${isCur ? 'koding-node-cur' : ''}`}
                          style={{ gridRow: r + 1, gridColumn: c + 1, background: open ? '#fffaf0' : W.dark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.55)', color: open ? INK : W.ink }}
                          aria-label={open ? `Level ${w + 1} coding ${k + 1}, ${st} bintang` : `Level ${w + 1} coding ${k + 1} terkunci`}
                        >
                          {open ? (
                            <>
                              <span style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{k + 1}</span>
                              <span className="mt-1 flex">
                                {[1, 2, 3].map((q) => (
                                  <Icon key={q} name="star" size={13} className={st >= q ? 'text-[#f2b705]' : 'text-[#d8d2c4]'} />
                                ))}
                              </span>
                            </>
                          ) : (
                            <Icon name="lock" size={20} className="opacity-50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- dialog menang ---------------- */

export function WinDialog({
  stars,
  title,
  message,
  unlockNote,
  onRetry,
  next,
}: {
  stars: number;
  title: string;
  message: string;
  unlockNote?: string;
  onRetry: () => void;
  next: { label: string; onClick: () => void; gold?: boolean };
}) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      {stars === 3 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 28 }, (_, k) => (
            <span key={k} className="koding-confetti" style={{ left: `${(k * 37) % 100}%`, background: ['#ffd23f', '#22b573', '#3a86ff', '#ff5a6e', '#8b5cf6'][k % 5], animationDelay: `${(k % 7) * 0.12}s`, animationDuration: `${1.6 + (k % 5) * 0.25}s` }} />
          ))}
        </div>
      )}
      <div className="koding-win relative w-full max-w-[380px] rounded-[26px] bg-[#fffaf0] p-5 text-center" style={{ color: INK }}>
        <div className="flex justify-center gap-1">
          {[1, 2, 3].map((k) => (
            <Icon key={k} name="star" size={54} className={`${stars >= k ? 'text-[#f2b705]' : 'text-[#e2dccd]'} koding-star`} style={{ animationDelay: `${k * 0.15}s` }} />
          ))}
        </div>
        <div className="mt-1" style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 900 }}>
          {title}
        </div>
        <p className="text-[15px] font-bold opacity-75">{message}</p>
        {unlockNote && <p className="mt-2 rounded-[14px] bg-[#e8f7ee] px-3 py-2 text-[14px] font-extrabold text-[#16804f]">{unlockNote}</p>}
        <div className="mt-4 flex gap-2">
          <button onClick={onRetry} className="flex-1 rounded-[16px] bg-[#efe7d6] py-3 font-extrabold active:translate-y-0.5">
            Coba lagi
          </button>
          <button
            onClick={next.onClick}
            className={`flex-1 rounded-[16px] py-3 font-extrabold text-white active:translate-y-0.5 ${next.gold ? 'bg-[#f2b705] shadow-[0_4px_0_#b88a00]' : 'bg-[#22b573] shadow-[0_4px_0_#16804f]'}`}
          >
            {next.label}
          </button>
        </div>
      </div>
    </div>
  );
}
