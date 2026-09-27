'use client';

// Rinoya Resto – Autentik Jepang (PRD v1.1): game simulasi restoran Jepang. Pop-up pembuka ala game
// pertanian (apa game ini, cara main, risiko, Koin Resto, sapaan Jepang), Sensei Hana sebagai mentor, panel
// kayu bergaya Hay Day untuk tiap keputusan bisnis, restoran 3D hidup saat buka, dan laporan harian.

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { useMe } from '@/lib/store';
import { sfx } from '@/lib/sfx';
import {
  BUILD_STAGES,
  BUILD_STAGE_NOTE,
  CANDIDATES,
  CHANNELS,
  CONTRACTORS,
  DECOR,
  EQUIPMENT,
  LOCATIONS,
  MENUS,
  ROLE_EMOJI,
  ROLE_NAME,
  SEGMENT_NAME,
  STORAGE_CAP,
  TABLE_COST,
  TRAINING_COST,
  TRAINING_NAME,
  TRAIN_ATTR,
  VENDORS,
  recipeCost,
  stageAt,
  stagesOnDay,
  type Role,
  type Segment,
} from '@/lib/resto/data';
import * as S from '@/lib/resto/sim';
import type { RestoScene } from './scene';
import './resto.css';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#3a2416';
const WOOD = 'linear-gradient(180deg,#b9824a,#8a5a2e)';
const CREAM = '#fff6e4';
const n = (x: number) => Math.round(x).toLocaleString('id-ID');

type Panel = null | 'lokasi' | 'kontraktor' | 'bangun' | 'bahan' | 'menu' | 'tim' | 'promo' | 'uang' | 'buka' | 'laporan' | 'intro' | 'gambar';

/* ---------------- tombol & panel bergaya kayu ---------------- */

function Btn({ children, onClick, tone = 'green', disabled, big }: { children: React.ReactNode; onClick: () => void; tone?: 'green' | 'orange' | 'red' | 'blue' | 'cream'; disabled?: boolean; big?: boolean }) {
  const bg = {
    green: ['linear-gradient(180deg,#8fe05a,#4caf2a)', '#2e7d1a', '#fff'],
    orange: ['linear-gradient(180deg,#ffc050,#ff8a1a)', '#c85a00', '#fff'],
    red: ['linear-gradient(180deg,#ff7a6a,#e0402a)', '#a02a1a', '#fff'],
    blue: ['linear-gradient(180deg,#7cc8ff,#2f86ff)', '#1a5fd1', '#fff'],
    cream: [CREAM, '#c9a27a', INK],
  }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[16px] px-4 font-extrabold transition-transform active:scale-95 disabled:opacity-45 ${big ? 'h-14 text-[20px]' : 'h-11 text-[16px]'}`}
      style={{ background: bg[0], boxShadow: `0 4px 0 ${bg[1]}`, color: bg[2], fontFamily: BALOO, textShadow: tone === 'cream' ? undefined : '0 1px 1px rgba(0,0,0,.25)' }}
    >
      {children}
    </button>
  );
}

function Sheet({ title, emoji, children, onClose }: { title: string; emoji: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="pointer-events-auto fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-2 sm:items-center sm:p-4" onClick={onClose}>
      <div className="resto-pop flex max-h-[88dvh] w-full max-w-[720px] flex-col rounded-[28px] p-2" style={{ background: WOOD, boxShadow: '0 8px 0 #5a3418' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-white" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, textShadow: '0 2px 0 rgba(0,0,0,.3)' }}>
            {emoji} {title}
          </span>
          <button onClick={onClose} aria-label="Tutup" className="flex size-10 items-center justify-center rounded-full bg-[#e0402a] text-white shadow-[0_3px_0_#a02a1a] active:scale-90">
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="overflow-y-auto rounded-[22px] p-3" style={{ background: CREAM, color: INK }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[14px] bg-white/80 px-3 py-2">
      <Icon name={icon} size={22} className="text-[#c8342a]" />
      <div>
        <div className="text-[11px] font-bold opacity-70">{label}</div>
        <div className="text-[16px] font-extrabold" style={{ fontFamily: BALOO }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ---------------- pop-up pembuka ---------------- */

const INTRO = [
  {
    emoji: '🏮',
    title: 'Selamat datang di Rinoya Resto!',
    body: 'Kamu jadi pemilik restoran Jepang. Mulai dari tanah kosong, bangun restoranmu, masak ramen & sushi, lalu buat pelanggan senang. Aku Sensei Hana, aku akan menemanimu!',
  },
  {
    emoji: '🗺️',
    title: 'Tugasmu sebagai pemilik',
    list: ['Pilih lokasi yang cocok dengan pelanggan', 'Pilih kontraktor & bangun restoran', 'Beli alat dapur, meja, dan dekorasi', 'Belanja bahan ke pemasok (vendor)', 'Atur menu & harga', 'Rekrut dan latih tim', 'Promosikan restoranmu', 'Buka, layani pelanggan, lalu baca laporan'],
  },
  {
    emoji: '⚠️',
    title: 'Hati-hati, ada risikonya!',
    list: [
      'Uang bisa habis kalau belanja terlalu banyak — sisakan cadangan.',
      'Bahan bisa kedaluwarsa & terbuang kalau dipesan kebanyakan.',
      'Pelanggan pergi kalau antre terlalu lama, meja penuh, atau stok habis.',
      'Promo bikin ramai, tapi untung per porsi jadi lebih kecil.',
      'Harga di bawah biaya bahan = rugi di setiap porsi!',
      'Ramai belum tentu untung. Selalu baca laporanmu.',
    ],
  },
  {
    emoji: '🪙',
    title: 'Koin Resto',
    body: 'Uangnya pura-pura: modal awal 30.000 Koin Resto. Koin tidak bisa dibeli dengan uang sungguhan. Kalau kehabisan, ada “hibah belajar” satu kali — restoranmu tidak akan bangkrut selamanya, kamu selalu bisa memperbaiki.',
  },
  {
    emoji: '🇯🇵',
    title: 'Belajar sapaan Jepang',
    list: ['Irasshaimase! = Selamat datang!', 'Arigatou gozaimasu = Terima kasih banyak', 'Itadakimasu = diucapkan sebelum makan', 'Oishii! = Enak!'],
  },
];

function Intro({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const c = INTRO[i];
  const last = i === INTRO.length - 1;
  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-3">
      <div key={i} className="resto-pop w-full max-w-[520px] rounded-[30px] p-2" style={{ background: WOOD, boxShadow: '0 8px 0 #5a3418' }}>
        <div className="rounded-[24px] p-5 text-center" style={{ background: CREAM, color: INK }}>
          <div className="resto-bounce text-[72px] leading-none">{c.emoji}</div>
          <h2 className="mt-2" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800 }}>
            {c.title}
          </h2>
          {c.body && <p className="mt-2 text-[16px] leading-snug font-bold opacity-85">{c.body}</p>}
          {c.list && (
            <ul className="mt-3 space-y-1.5 text-left">
              {c.list.map((t, k) => (
                <li key={k} className="flex items-start gap-2 rounded-[12px] bg-white px-3 py-2 text-[15px] leading-snug font-bold">
                  <span className="text-[#c8342a]">{i === 1 ? `${k + 1}.` : '•'}</span>
                  {t}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {INTRO.map((_, k) => (
              <span key={k} className="h-2.5 rounded-full transition-all" style={{ width: k === i ? 26 : 10, background: k === i ? '#ff8a1a' : '#e3cfb2' }} />
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {i > 0 && (
              <Btn tone="cream" onClick={() => setI(i - 1)}>
                Kembali
              </Btn>
            )}
            <Btn
              tone={last ? 'green' : 'orange'}
              big
              onClick={() => {
                if (last) {
                  sfx.celebrate();
                  onDone();
                } else setI(i + 1);
              }}
            >
              {last ? 'Ayo mulai!' : 'Lanjut'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- penyimpanan ---------------- */

function useGame(memberId: string) {
  const key = `rumila-resto-${memberId}`;
  const ref = useRef<S.RestoState | null>(null);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  if (!ref.current) {
    let g: S.RestoState | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) g = JSON.parse(raw);
    } catch {}
    ref.current = g && g.v === 1 ? g : S.newGame(Math.floor(Math.random() * 1e6));
    if (ref.current.phase === 'open') ref.current.phase = 'prep';
  }
  const save = useCallback(() => {
    try {
      localStorage.setItem(key, JSON.stringify(ref.current));
    } catch {}
  }, [key]);
  return { g: ref.current!, bump, save, reset: () => ((ref.current = S.newGame(Math.floor(Math.random() * 1e6))), save(), bump()) };
}

/* ---------------- permainan ---------------- */

export function RestoGame() {
  const me = useMe();
  const memberId = me?.id ?? 'dev';
  const { g, bump, save, reset } = useGame(memberId);
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<RestoScene | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [topView, setTopView] = useState(false);
  const [toast, setToast] = useState<{ text: string; good: boolean } | null>(null);
  const [intro, setIntro] = useState(false);
  const run = useRef<S.DayRun | null>(null);
  const [speed, setSpeed] = useState(1);
  const [report, setReport] = useState<S.DayReport | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem('rumila-resto-intro')) setIntro(true);
    } catch {}
    let alive = true;
    import('./scene').then(({ RestoScene }) => {
      if (!alive || !host.current) return;
      scene.current = new RestoScene(host.current);
      scene.current.sync(g);
    });
    return () => {
      alive = false;
      scene.current?.dispose();
      scene.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scene.current?.sync(g);
  });

  const say = (text: string, good = true) => {
    setToast({ text, good });
    window.setTimeout(() => setToast((t) => (t?.text === text ? null : t)), 2600);
  };

  /** Jalankan perintah bisnis; tampilkan hasilnya; simpan. */
  const act = (fn: () => S.Result, okSound: () => void = () => sfx.coin()) => {
    const r = fn();
    if (r.ok) {
      okSound();
      if (r.msg) say(r.msg, true);
    } else {
      sfx.thud();
      say(r.msg, false);
    }
    save();
    bump();
    return r.ok;
  };

  // jam restoran berjalan saat buka
  useEffect(() => {
    if (g.phase !== 'open' || !run.current) return;
    let raf = 0,
      last = performance.now(),
      lastUi = 0,
      seenEvents = run.current.events.length;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const r = run.current;
      if (!r || speed === 0) return;
      const mins = dt * speed; // 1 detik nyata = 1 menit virtual
      for (let k = 0; k < Math.ceil(mins / 0.2); k++) S.stepDay(g, r, mins / Math.ceil(mins / 0.2));
      scene.current?.syncRun(g, r);
      if (r.events.length !== seenEvents) {
        const e = r.events[r.events.length - 1];
        seenEvents = r.events.length;
        if (e.kind === 'bayar') sfx.coin();
        else if (e.kind === 'pergi' || e.kind === 'stok') sfx.thud();
        else if (e.kind === 'keliru') sfx.chop();
      }
      if (r.done) {
        const rep = S.closeDay(g, r);
        run.current = null;
        scene.current?.syncRun(g, null);
        save();
        setReport(rep);
        setPanel('laporan');
        if (rep.result > 0) sfx.celebrate();
        bump();
        return;
      }
      if (now - lastUi > 250) {
        lastUi = now;
        bump();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.phase, speed]);

  const checks = S.checklist(g);
  const nextCheck = checks.find((c) => !c.ok);
  const mentor = useMemo(() => {
    if (g.phase === 'plan' && !g.location) return 'Pertama, pilih lokasi. Lihat siapa pelanggannya dan berapa sewanya, ya!';
    if (g.phase === 'plan') return 'Sekarang pilih kontraktor untuk membangun restoranmu. Bandingkan harga, lama, dan mutunya.';
    if (g.phase === 'build') return `Restoran sedang dibangun (${g.buildLeft} hari lagi). Tekan “Lanjut hari”. Ingat, sewa tetap dibayar tiap hari.`;
    if (g.phase === 'prep' && nextCheck) {
      const tips: Record<string, string> = {
        kasir: 'Beli meja kasir & kulkas bahan di Toko Alat dulu.',
        meja: 'Pelanggan butuh tempat duduk. Beli minimal 2 meja.',
        menu: 'Aktifkan minimal 2 menu di Menu. Pastikan alat dapurnya sudah dibeli!',
        stok: 'Belanja bahan untuk menu aktif. Vendor biasa datang besok; Kilat datang hari ini tapi lebih mahal.',
        tim: 'Rekrut kasir, koki, pelayan, dan petugas kebersihan di Tim.',
        kas: 'Uang cadangan kurang. Kurangi belanja atau pakai hibah belajar di Keuangan.',
      };
      return tips[nextCheck.id] ?? 'Lengkapi persiapan, lalu buka restoranmu!';
    }
    if (g.phase === 'prep') return 'Semua siap! Tekan “Buka Resto!” dan sambut pelanggan dengan Irasshaimase!';
    if (g.phase === 'open') return 'Restoran buka! Perhatikan antrean, meja, dan stok. Kamu bisa jeda kapan saja.';
    return 'Baca laporan hari ini, lalu pilih satu hal untuk diperbaiki besok.';
  }, [g.phase, g.location, g.buildLeft, nextCheck]);

  const clock = run.current ? run.current.clock : 0;
  const hh = 10 + Math.floor(Math.min(360, clock) / 60),
    mm = Math.floor(Math.min(360, clock) % 60);
  const l = LOCATIONS.find((x) => x.id === g.location);

  return (
    <div className="theme-play fixed inset-0 overflow-hidden select-none" style={{ background: '#bfe6ff', fontFamily: 'var(--ff-nunito), system-ui, sans-serif', color: INK }}>
      <div ref={host} className="absolute inset-0" />

      {/* HUD atas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2 sm:p-3" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
        <div className="pointer-events-auto flex items-center gap-2">
          <button aria-label="Keluar" onClick={() => router.push('/beranda/game')} className="flex size-12 items-center justify-center rounded-full bg-white shadow-[0_4px_0_rgba(0,0,0,.2)] active:scale-90">
            <Icon name="arrow_back" size={26} />
          </button>
          <div className="rounded-[16px] px-3 py-1.5 text-white" style={{ background: WOOD, boxShadow: '0 3px 0 #5a3418' }}>
            <div style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, lineHeight: 1 }}>{g.name}</div>
            <div className="text-[12px] font-bold opacity-90">
              Hari {g.day} · {l ? l.name : 'belum ada lokasi'}
            </div>
          </div>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_3px_0_rgba(0,0,0,.18)]" title="Reputasi">
            <span>❤️</span>
            <b style={{ fontFamily: BALOO }}>{g.reputation}</b>
          </div>
          <button onClick={() => setPanel('uang')} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_3px_0_rgba(0,0,0,.18)] active:scale-95">
            <span>🪙</span>
            <b style={{ fontFamily: BALOO, fontSize: 17 }}>{n(g.cash)}</b>
          </button>
          <button aria-label="Petunjuk" onClick={() => setIntro(true)} className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_3px_0_rgba(0,0,0,.18)] active:scale-90">
            <Icon name="help" size={24} />
          </button>
        </div>
      </div>

      {/* Sensei Hana */}
      {g.phase !== 'open' && (
        <div className="pointer-events-none absolute left-2 flex max-w-[min(92vw,460px)] items-end gap-2 sm:left-3" style={{ top: 78 }}>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-[34px] shadow-[0_3px_0_rgba(0,0,0,.18)]">👩‍🍳</span>
          <div className="resto-pop rounded-[18px] rounded-bl-md bg-white px-3.5 py-2 shadow-[0_3px_0_rgba(0,0,0,.12)]">
            <div className="text-[12px] font-extrabold text-[#c8342a]">Sensei Hana</div>
            <div className="text-[15px] leading-snug font-bold">{mentor}</div>
          </div>
        </div>
      )}

      {/* jam & kecepatan saat buka */}
      {g.phase === 'open' && run.current && (
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 rounded-[18px] px-3 py-2 text-white" style={{ top: 70, background: WOOD, boxShadow: '0 4px 0 #5a3418' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800 }}>
              {String(hh).padStart(2, '0')}.{String(mm).padStart(2, '0')}
            </span>
            {[0, 1, 2].map((sp) => (
              <button key={sp} onClick={() => setSpeed(sp)} className="flex h-9 min-w-9 items-center justify-center rounded-full px-2 font-extrabold active:scale-90" style={{ background: speed === sp ? '#ffc050' : 'rgba(255,255,255,.25)', color: speed === sp ? INK : '#fff' }}>
                {sp === 0 ? <Icon name="pause" size={20} /> : `${sp}×`}
              </button>
            ))}
          </div>
          <div className="mt-1 flex gap-3 text-[13px] font-bold">
            <span>😊 {run.current.stats.served} dilayani</span>
            <span>🚶 {run.current.stats.lostQueue + run.current.stats.lostSeat + run.current.stats.lostStock} pergi</span>
            <span>🪙 {n(run.current.stats.gross - run.current.stats.discount)}</span>
          </div>
        </div>
      )}
      {g.phase === 'open' && run.current && run.current.events.length > 0 && (
        <div className="pointer-events-none absolute left-2 max-w-[70vw] rounded-full bg-black/55 px-3 py-1.5 text-[13px] font-bold text-white" style={{ top: 150 }}>
          {run.current.events[run.current.events.length - 1].text}
        </div>
      )}

      {/* kontrol kamera: perbesar, perkecil, pandangan dari atas, kembali */}
      <div className="pointer-events-auto absolute right-2 flex flex-col gap-2 sm:right-3" style={{ top: '38%' }}>
        {(
          [
            ['add', 'Perbesar', () => scene.current?.zoomBy(0.75)],
            ['remove', 'Perkecil', () => scene.current?.zoomBy(1.33)],
            [topView ? 'view_in_ar' : 'satellite_alt', topView ? 'Pandangan miring' : 'Lihat dari atas', () => setTopView(!!scene.current?.toggleTop())],
            ['center_focus_strong', 'Kembali ke resto', () => (scene.current?.resetView(), setTopView(false))],
          ] as const
        ).map(([icon, label, fn]) => (
          <button
            key={label}
            aria-label={label}
            title={label}
            onClick={() => (sfx.tap(), fn())}
            className="flex size-11 items-center justify-center rounded-full bg-white/90 text-[#3a2416] shadow-[0_3px_0_rgba(0,0,0,.25)] active:scale-90"
          >
            <Icon name={icon} size={24} />
          </button>
        ))}
      </div>

      {/* dok bawah: aksi sesuai fase */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-2 sm:p-3" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
        {g.phase === 'plan' && (
          <div className="pointer-events-auto">
            <Btn big tone="orange" onClick={() => (sfx.open(), setPanel(g.location ? 'kontraktor' : 'lokasi'))}>
              {g.location ? '🏗️ Pilih kontraktor' : '🗺️ Pilih lokasi'}
            </Btn>
          </div>
        )}
        {g.phase === 'build' && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-[20px] p-2" style={{ background: WOOD, boxShadow: '0 4px 0 #5a3418' }}>
            <span className="px-2 text-white" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}>
              🏗️ {BUILD_STAGES[stageAt(1 - g.buildLeft / (CONTRACTORS.find((c) => c.id === g.contractor)?.days ?? 3))]} · {g.buildLeft} hari lagi
            </span>
            <Btn tone="cream" onClick={() => (sfx.open(), setPanel('gambar'))}>
              📐 Gambar kerja
            </Btn>
            <Btn tone="green" onClick={() => act(() => S.advanceDay(g), () => sfx.whoosh())}>
              Lanjut hari ▶
            </Btn>
          </div>
        )}
        {(g.phase === 'prep' || g.phase === 'review') && (
          <>
            <div className="pointer-events-auto flex flex-wrap items-end justify-center gap-2 rounded-[24px] p-2" style={{ background: WOOD, boxShadow: '0 5px 0 #5a3418' }}>
              {(
                [
                  ['bangun', '🛠️', 'Toko Alat'],
                  ['bahan', '🧺', 'Bahan'],
                  ['menu', '🍜', 'Menu'],
                  ['tim', '👥', 'Tim'],
                  ['promo', '📣', 'Promosi'],
                  ['uang', '🪙', 'Keuangan'],
                ] as const
              ).map(([id, e, label]) => (
                <button
                  key={id}
                  onClick={() => (sfx.open(), setPanel(id))}
                  className="flex w-[64px] flex-col items-center gap-0.5 rounded-[16px] py-1.5 active:scale-90 sm:w-[76px]"
                  style={{ background: CREAM, boxShadow: '0 3px 0 #c9a27a' }}
                >
                  <span className="text-[28px] leading-none">{e}</span>
                  <span className="text-[12px] font-extrabold">{label}</span>
                </button>
              ))}
            </div>
            <div className="pointer-events-auto flex gap-2">
              <Btn tone="cream" onClick={() => act(() => S.advanceDay(g), () => sfx.whoosh())}>
                Lanjut hari ▶
              </Btn>
              <Btn
                big
                tone={S.canOpen(g) ? 'green' : 'orange'}
                onClick={() => {
                  if (!S.canOpen(g)) {
                    sfx.open();
                    setPanel('buka');
                    return;
                  }
                  run.current = S.openDay(g);
                  sfx.celebrate();
                  save();
                  bump();
                }}
              >
                🏮 Buka Resto!
              </Btn>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div className="resto-pop pointer-events-none fixed left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-[15px] font-extrabold text-white shadow-lg" style={{ bottom: 170, background: toast.good ? '#2e9d4a' : '#d0402a' }}>
          {toast.text}
        </div>
      )}

      {intro && (
        <Intro
          onDone={() => {
            setIntro(false);
            try {
              localStorage.setItem('rumila-resto-intro', '1');
            } catch {}
          }}
        />
      )}

      {/* ---------- panel keputusan ---------- */}
      {panel === 'lokasi' && (
        <Sheet title="Pilih lokasi" emoji="🗺️" onClose={() => setPanel(null)}>
          <p className="mb-2 text-[14px] font-bold opacity-80">Tidak ada lokasi yang selalu paling bagus. Pilih yang cocok dengan pelanggan & menumu.</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {LOCATIONS.map((x) => (
              <div key={x.id} className="flex flex-col gap-1.5 rounded-[18px] bg-white p-3 shadow-[0_3px_0_#e3cfb2]">
                <div style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>{x.name}</div>
                <div className="text-[13px] font-bold">Sewa {x.rent}/hari · Deposit {n(x.deposit)}</div>
                <div className="text-[13px] font-bold">Maks {x.maxSeats} kursi</div>
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(x.mix) as Segment[]).map((sg) => (
                    <span key={sg} className="rounded-full bg-[#fff0d8] px-2 py-0.5 text-[12px] font-extrabold">
                      {SEGMENT_NAME[sg]} {Math.round(x.mix[sg] * 100)}%
                    </span>
                  ))}
                </div>
                <div className="text-[13px] leading-snug">{x.note}</div>
                <div className="rounded-[10px] bg-[#f5f0fa] p-2 text-[12px] italic leading-snug">{x.npc}</div>
                <Btn tone="green" onClick={() => act(() => S.chooseLocation(g, x.id)) && setPanel('kontraktor')}>
                  Sewa di sini
                </Btn>
              </div>
            ))}
          </div>
        </Sheet>
      )}

      {panel === 'gambar' && <GambarPanel g={g} onClose={() => setPanel(null)} />}

      {panel === 'kontraktor' && (
        <Sheet title="Pilih kontraktor" emoji="🏗️" onClose={() => setPanel(null)}>
          <p className="mb-2 text-[14px] font-bold opacity-80">Bayar DP 40% sekarang, sisa 60% saat bangunan selesai. Sisa itu jadi “komitmen” — uangnya tidak boleh dipakai belanja lain.</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {CONTRACTORS.map((c) => (
              <div key={c.id} className="flex flex-col gap-1 rounded-[18px] bg-white p-3 shadow-[0_3px_0_#e3cfb2]">
                <div style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>{c.name}</div>
                <div className="text-[14px] font-bold">🪙 {n(c.cost)}</div>
                <div className="text-[14px] font-bold">⏱️ {c.days} hari</div>
                <div className="text-[14px] font-bold">⭐ Mutu {c.quality}/100</div>
                <div className="text-[13px]">Garansi {c.warranty} hari buka. {c.note}</div>
                <Btn tone="green" onClick={() => act(() => S.signContract(g, c.id), () => sfx.celebrate()) && setPanel(null)}>
                  Setujui kontrak
                </Btn>
              </div>
            ))}
          </div>
        </Sheet>
      )}

      {panel === 'bangun' && (
        <Sheet title="Toko Alat & Meja" emoji="🛠️" onClose={() => setPanel(null)}>
          <p className="mb-2 text-[14px] font-bold opacity-80">Alat adalah investasi: dibeli sekali, bukan biaya bahan. Setiap menu butuh alatnya sendiri.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EQUIPMENT.map((e) => {
              const own = g.equipment.includes(e.id);
              return (
                <div key={e.id} className="flex items-center justify-between gap-2 rounded-[16px] bg-white p-2.5 shadow-[0_2px_0_#e3cfb2]">
                  <div>
                    <div className="text-[15px] font-extrabold">{e.name}</div>
                    <div className="text-[12px] opacity-75">{e.note}</div>
                  </div>
                  {own ? <span className="rounded-full bg-[#dff5d8] px-3 py-1 text-[13px] font-extrabold text-[#2e7d1a]">✓ Punya</span> : <Btn onClick={() => act(() => S.buyEquipment(g, e.id))}>🪙 {n(e.cost)}</Btn>}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-[16px] bg-white p-3">
            <div>
              <div className="text-[15px] font-extrabold">🪑 Meja makan (4 kursi)</div>
              <div className="text-[12px] opacity-75">
                Punya {g.tables} meja = {g.tables * 4} kursi · maks {l?.maxSeats ?? 0} kursi di lokasi ini
              </div>
            </div>
            <Btn onClick={() => act(() => S.buyTables(g, 1))}>+1 · 🪙 {TABLE_COST}</Btn>
          </div>
          <div className="mt-3 text-[15px] font-extrabold">🎋 Dekorasi</div>
          <div className="mt-1 grid gap-2 sm:grid-cols-3">
            {DECOR.map((d) => (
              <button key={d.id} onClick={() => act(() => S.setDecor(g, d.id))} className="rounded-[16px] bg-white p-2.5 text-left shadow-[0_2px_0_#e3cfb2]" style={g.decor === d.id ? { boxShadow: 'inset 0 0 0 3px #ff8a1a' } : undefined}>
                <div className="text-[14px] font-extrabold">{d.name}</div>
                <div className="text-[12px] opacity-75">{d.note}</div>
                <div className="text-[12px] font-bold">🪙 {n(d.cost)} · daya tarik +{Math.round((d.appeal - 1) * 100)}%</div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] opacity-70">Dekorasi menambah sedikit daya tarik, tapi tidak bisa menutupi makanan kurang enak atau antrean panjang.</p>
        </Sheet>
      )}

      {panel === 'bahan' && <BahanPanel g={g} act={act} onClose={() => setPanel(null)} />}

      {panel === 'menu' && (
        <Sheet title="Menu & harga" emoji="🍜" onClose={() => setPanel(null)}>
          <p className="mb-2 text-[14px] font-bold opacity-80">Kontribusi = harga − biaya bahan. Itu yang tersisa untuk membayar gaji, sewa, dan lainnya.</p>
          <div className="grid gap-2">
            {MENUS.map((m) => {
              const st = g.menu[m.id];
              const pc = S.portionCost(g, m);
              const margin = st.price - pc.cost;
              const can = S.stationOwned(g, m);
              return (
                <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-[16px] bg-white p-2.5 shadow-[0_2px_0_#e3cfb2]">
                  <span className="text-[34px]">{m.emoji}</span>
                  <div className="min-w-[150px] flex-1">
                    <div className="text-[15px] font-extrabold">
                      {m.name} <span className="text-[12px] opacity-60">{m.jp}</span>
                    </div>
                    <div className="text-[12px] opacity-75">{m.desc}</div>
                    <div className="text-[12px] font-bold">
                      Bahan {pc.cost}
                      {pc.est ? ' (perkiraan)' : ''} · Kontribusi <span style={{ color: margin > 0 ? '#2e7d1a' : '#d0402a' }}>{margin}</span>/porsi · stok {S.portionsAvailable(g, m)} porsi
                    </div>
                    {!can && <div className="text-[12px] font-extrabold text-[#d0402a]">Butuh alat: {S.stationName(m.station)}</div>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Btn tone="cream" onClick={() => act(() => S.setMenu(g, m.id, { price: st.price - 5 }), () => sfx.tap())}>
                      −
                    </Btn>
                    <span className="w-12 text-center text-[16px] font-extrabold" style={{ fontFamily: BALOO }}>
                      {st.price}
                    </span>
                    <Btn tone="cream" onClick={() => act(() => S.setMenu(g, m.id, { price: st.price + 5 }), () => sfx.tap())}>
                      +
                    </Btn>
                  </div>
                  <Btn tone={st.active ? 'green' : 'cream'} onClick={() => act(() => S.setMenu(g, m.id, { active: !st.active }), () => sfx.pick())}>
                    {st.active ? 'Aktif ✓' : 'Aktifkan'}
                  </Btn>
                </div>
              );
            })}
          </div>
        </Sheet>
      )}

      {panel === 'tim' && (
        <Sheet title="Tim restoran" emoji="👥" onClose={() => setPanel(null)}>
          <p className="mb-2 text-[14px] font-bold opacity-80">Isi keempat peran. Training ({TRAINING_COST} koin) menambah +10 kemampuan utama, maks 80, sekali sehari per orang.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CANDIDATES.map((c) => {
              const m = g.staff.find((x) => x.id === c.id);
              const p = m ?? c;
              return (
                <div key={c.id} className="rounded-[16px] bg-white p-2.5 shadow-[0_2px_0_#e3cfb2]" style={m ? { boxShadow: 'inset 0 0 0 3px #4caf2a' } : undefined}>
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-extrabold">
                      {ROLE_EMOJI[c.role]} {c.name} · {ROLE_NAME[c.role]}
                    </div>
                    <div className="text-[13px] font-bold">🪙 {c.wage}/hari</div>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[12px] font-bold">
                    {(
                      [
                        ['speed', 'Cepat'],
                        ['accuracy', 'Teliti'],
                        ['friendly', 'Ramah'],
                        ['clean', 'Bersih'],
                      ] as const
                    ).map(([k, label]) => (
                      <div key={k} className="flex items-center gap-1">
                        <span className="w-12">{label}</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#f0e4d2]">
                          <span className="block h-full rounded-full" style={{ width: `${p[k]}%`, background: TRAIN_ATTR[c.role] === k ? '#ff8a1a' : '#8fbf5a' }} />
                        </span>
                        <span className="w-6 text-right">{p[k]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m ? (
                      <>
                        <Btn tone="blue" onClick={() => act(() => S.train(g, c.id), () => sfx.grow())}>
                          🎓 Latih
                        </Btn>
                        <Btn tone="red" onClick={() => act(() => S.fire(g, c.id), () => sfx.close())}>
                          Keluarkan
                        </Btn>
                      </>
                    ) : (
                      <Btn onClick={() => act(() => S.hire(g, c.id), () => sfx.pick())}>Rekrut</Btn>
                    )}
                  </div>
                  {m && <div className="mt-1 text-[11px] opacity-70">{TRAINING_NAME[c.role as Role]}</div>}
                </div>
              );
            })}
          </div>
        </Sheet>
      )}

      {panel === 'promo' && (
        <Sheet title="Promosi hari ini" emoji="📣" onClose={() => setPanel(null)}>
          <p className="mb-2 text-[14px] font-bold opacity-80">Promo mengundang pelanggan baru, tapi pastikan dapur, meja & stok siap. Diskon memperkecil untung per porsi!</p>
          <PromoPanel g={g} act={act} />
        </Sheet>
      )}

      {panel === 'uang' && (
        <Sheet title="Keuangan" emoji="🪙" onClose={() => setPanel(null)}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat label="Uang di kas" value={n(g.cash)} icon="account_balance_wallet" />
            <Stat label="Uang bebas dipakai" value={n(S.freeCash(g))} icon="savings" />
            <Stat label="Komitmen kontrak" value={n(S.commitments(g))} icon="handshake" />
            <Stat label="Deposit (ditahan)" value={n(g.deposit)} icon="lock" />
            <Stat label="Biaya tetap/hari" value={n(S.fixedDaily(g))} icon="receipt_long" />
            <Stat label="Nilai stok" value={n(g.batches.reduce((a, b) => a + b.qty * b.unitCost, 0))} icon="inventory_2" />
          </div>
          {S.freeCash(g) < S.fixedDaily(g) * 2 && !g.grantUsed && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-[16px] bg-[#fff0d8] p-3">
              <span className="text-[14px] font-bold">Uang menipis? Hibah belajar 3.000 koin bisa dipakai sekali.</span>
              <Btn onClick={() => act(() => S.takeGrant(g), () => sfx.celebrate())}>Pakai hibah</Btn>
            </div>
          )}
          <div className="mt-3 text-[15px] font-extrabold">📒 Catatan uang terakhir</div>
          <div className="mt-1 divide-y divide-[#f0e4d2] rounded-[14px] bg-white">
            {g.ledger
              .slice(-12)
              .reverse()
              .map((e, k) => (
                <div key={k} className="flex justify-between px-3 py-1.5 text-[13px]">
                  <span>
                    Hari {e.day} · {e.reason}
                  </span>
                  <b style={{ color: e.amount >= 0 ? '#2e7d1a' : '#d0402a' }}>
                    {e.amount >= 0 ? '+' : ''}
                    {n(e.amount)}
                  </b>
                </div>
              ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Btn tone="red" onClick={() => confirm('Mulai ulang restoran dari awal?') && (reset(), setPanel(null))}>
              Mulai ulang
            </Btn>
          </div>
        </Sheet>
      )}

      {panel === 'buka' && (
        <Sheet title="Cek sebelum buka" emoji="✅" onClose={() => setPanel(null)}>
          <div className="grid gap-1.5">
            {checks.map((c) => (
              <button key={c.id} onClick={() => !c.ok && setPanel(c.go === 'uang' ? 'uang' : (c.go as Panel))} className="flex items-center gap-2 rounded-[14px] bg-white p-2.5 text-left text-[15px] font-bold">
                <span className="text-[22px]">{c.ok ? '✅' : '❌'}</span>
                <span className="flex-1">{c.label}</span>
                {!c.ok && <Icon name="chevron_right" />}
              </button>
            ))}
          </div>
          {g.phase === 'review' && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[14px] bg-[#fff0d8] p-2.5 text-[14px] font-bold">
              <span className="flex-1">🌙 Hari ini restoran sudah buka. Resto bisa buka lagi besok — tekan “Lanjut hari”.</span>
              <Btn tone="green" onClick={() => (act(() => S.advanceDay(g), () => sfx.whoosh()), setPanel(null))}>
                Lanjut hari ▶
              </Btn>
            </div>
          )}
        </Sheet>
      )}

      {panel === 'laporan' && report && <ReportPanel r={report} onClose={() => setPanel(null)} onNext={() => (act(() => S.advanceDay(g), () => sfx.whoosh()), setPanel(null))} />}
    </div>
  );
}

/* ---------------- panel belanja bahan ---------------- */

function BahanPanel({ g, act, onClose }: { g: S.RestoState; act: (fn: () => S.Result, s?: () => void) => boolean; onClose: () => void }) {
  const active = MENUS.filter((m) => g.menu[m.id].active);
  const last = g.reports[g.reports.length - 1];
  const short = S.shortMenus(g);
  const [vendor, setVendor] = useState(short.length ? 'kilat' : 'segar');
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(MENUS.map((m) => [m.id, active.some((a) => a.id === m.id) ? Math.max(10, Math.round((last?.sold[m.id] ?? 20) * 1.2 / 5) * 5) : 0])));
  const v = VENDORS.find((x) => x.id === vendor)!;
  const units = MENUS.reduce((a, m) => a + recipeCost(m) * (qty[m.id] ?? 0), 0);
  const cost = Math.round(units * v.mult);
  return (
    <Sheet title="Belanja bahan" emoji="🧺" onClose={onClose}>
      <p className="mb-2 text-[14px] font-bold opacity-80">Pesan secukupnya: kebanyakan → bahan kedaluwarsa & terbuang; kekurangan → pelanggan batal pesan.</p>
      {short.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-2 rounded-[14px] bg-[#ffe3d8] p-2.5 text-[13px] font-bold text-[#8a2a1a]">
          <span className="flex-1">
            ⚠️ Belum bisa buka: stok {short.map((m) => `${m.emoji} ${m.name} (${S.portionsAvailable(g, m)}/${S.MIN_OPEN_PORTIONS})`).join(', ')} kurang.
            {S.hasPendingOrder(g) ? ' Pesanan sebelumnya baru datang besok.' : ''} Vendor <b>Kilat</b> datang hari ini.
          </span>
          <Btn
            tone="orange"
            onClick={() => {
              setVendor('kilat');
              setQty(Object.fromEntries(MENUS.map((m) => [m.id, short.some((x) => x.id === m.id) ? Math.max(10, Math.ceil((S.MIN_OPEN_PORTIONS * 2 - S.portionsAvailable(g, m)) / 5) * 5) : 0])));
            }}
          >
            Isi kekurangan
          </Btn>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-3">
        {VENDORS.map((x) => (
          <button key={x.id} onClick={() => setVendor(x.id)} className="rounded-[16px] bg-white p-2.5 text-left shadow-[0_2px_0_#e3cfb2]" style={vendor === x.id ? { boxShadow: 'inset 0 0 0 3px #ff8a1a' } : undefined}>
            <div className="text-[15px] font-extrabold">{x.name}</div>
            <div className="text-[12px] font-bold">
              Harga ×{x.mult} · mutu {x.quality} · min {x.min}
            </div>
            <div className="text-[12px]">
              {x.sameDay ? 'Datang hari ini' : 'Datang besok pagi'} · tahan {x.shelf} hari
            </div>
            <div className="text-[12px] opacity-75">{x.note}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-1.5">
        {MENUS.map((m) => (
          <div key={m.id} className="flex items-center gap-2 rounded-[14px] bg-white p-2" style={{ opacity: g.menu[m.id].active ? 1 : 0.55 }}>
            <span className="text-[26px]">{m.emoji}</span>
            <span className="flex-1 text-[14px] font-extrabold">
              {m.name}
              <span className="block text-[11px] font-bold opacity-70">
                stok sekarang {S.portionsAvailable(g, m)} porsi{last ? ` · kemarin terjual ${last.sold[m.id] ?? 0}` : ''}
              </span>
            </span>
            <Btn tone="cream" onClick={() => setQty({ ...qty, [m.id]: Math.max(0, (qty[m.id] ?? 0) - 5) })}>
              −
            </Btn>
            <span className="w-10 text-center font-extrabold" style={{ fontFamily: BALOO, fontSize: 18 }}>
              {qty[m.id] ?? 0}
            </span>
            <Btn tone="cream" onClick={() => setQty({ ...qty, [m.id]: (qty[m.id] ?? 0) + 5 })}>
              +
            </Btn>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[16px] bg-[#fff0d8] p-3">
        <div className="text-[14px] font-bold">
          {units} unit bahan · kulkas {S.stockTotal(g)}/{STORAGE_CAP}
          <div style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>Total 🪙 {n(cost)}</div>
          {cost > 0 && cost < v.min && <div className="text-[12px] font-extrabold text-[#d0402a]">Belum mencapai belanja minimum {v.min}</div>}
        </div>
        <Btn big onClick={() => act(() => S.placeOrder(g, vendor, qty), () => sfx.coin()) && onClose()}>
          Pesan bahan
        </Btn>
      </div>
    </Sheet>
  );
}

/* ---------------- panel promosi ---------------- */

function PromoPanel({ g, act }: { g: S.RestoState; act: (fn: () => S.Result, s?: () => void) => boolean }) {
  const cur = g.campaign && g.campaign.day === g.day ? g.campaign : null;
  const [disc, setDisc] = useState(cur?.discount ?? 0);
  const active = MENUS.filter((m) => g.menu[m.id].active);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[14px] font-extrabold">Diskon:</span>
        {[0, 0.1, 0.2, 0.3].map((d) => (
          <Btn key={d} tone={disc === d ? 'orange' : 'cream'} onClick={() => setDisc(d)}>
            {d ? `${d * 100}%` : 'Tanpa'}
          </Btn>
        ))}
      </div>
      {active.length > 0 && (
        <div className="mt-2 rounded-[14px] bg-white p-2 text-[13px] font-bold">
          {active.map((m) => {
            const p = Math.round(g.menu[m.id].price * (1 - disc));
            const c = S.portionCost(g, m).cost;
            return (
              <div key={m.id}>
                {m.emoji} {m.name}: harga jadi {p}, sisa per porsi <span style={{ color: p - c > 0 ? '#2e7d1a' : '#d0402a' }}>{p - c}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <div key={c.id} className="flex flex-col gap-1 rounded-[16px] bg-white p-2.5 shadow-[0_2px_0_#e3cfb2]" style={cur?.channel === c.id ? { boxShadow: 'inset 0 0 0 3px #4caf2a' } : undefined}>
            <div className="text-[15px] font-extrabold">{c.name}</div>
            <div className="text-[12px] font-bold">
              🪙 {c.cost}/hari · jangkauan {c.reach} orang
            </div>
            <div className="text-[12px] opacity-75">
              Cocok: {(Object.keys(c.seg) as Segment[]).sort((a, b) => c.seg[b] - c.seg[a]).slice(0, 2).map((s) => SEGMENT_NAME[s]).join(', ')}
            </div>
            <Btn onClick={() => act(() => S.setCampaign(g, c.id, disc), () => sfx.celebrate())}>{cur?.channel === c.id ? 'Aktif ✓' : 'Pakai hari ini'}</Btn>
          </div>
        ))}
      </div>
      {cur && (
        <div className="mt-2">
          <Btn tone="cream" onClick={() => act(() => S.setCampaign(g, null), () => sfx.close())}>
            Batalkan promosi
          </Btn>
        </div>
      )}
    </>
  );
}

/* ---------------- laporan harian ---------------- */

function ReportPanel({ r, onClose, onNext }: { r: S.DayReport; onClose: () => void; onNext: () => void }) {
  const [detail, setDetail] = useState(false);
  const line = (label: string, v: number, sign = '') => (
    <div className="flex justify-between py-0.5 text-[14px]">
      <span>{label}</span>
      <b>
        {sign}
        {n(v)}
      </b>
    </div>
  );
  return (
    <Sheet title={`Laporan hari ${r.day}`} emoji="📊" onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 text-center">
        {(
          [
            ['Penjualan', r.netSales, '#2f86ff'],
            ['Hasil usaha', r.result, r.result >= 0 ? '#2e7d1a' : '#d0402a'],
            ['Uang tersedia', r.cashEnd, INK],
          ] as const
        ).map(([label, v, c]) => (
          <div key={label} className="rounded-[16px] bg-white p-2 shadow-[0_2px_0_#e3cfb2]">
            <div className="text-[12px] font-bold opacity-70">{label}</div>
            <div style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: c }}>{n(v)}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[13px] font-bold sm:grid-cols-4">
        <span className="rounded-[12px] bg-white px-2 py-1.5">🚶 Datang {r.arrivals}</span>
        <span className="rounded-[12px] bg-white px-2 py-1.5">😊 Dilayani {r.served}</span>
        <span className="rounded-[12px] bg-white px-2 py-1.5">⏱️ Tunggu {r.avgWait} mnt</span>
        <span className="rounded-[12px] bg-white px-2 py-1.5">⭐ Puas {r.satisfaction}/100</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {r.findings.map((f, k) => (
          <div key={k} className="flex items-start gap-2 rounded-[14px] p-2.5 text-[14px] font-bold" style={{ background: f.good ? '#dff5d8' : '#fff0d8' }}>
            <Icon name={f.icon} size={22} className={f.good ? 'text-[#2e7d1a]' : 'text-[#c85a00]'} />
            {f.text}
          </div>
        ))}
        {!r.findings.length && <div className="rounded-[14px] bg-white p-2.5 text-[14px] font-bold">Hari berjalan lancar. Coba ubah satu hal kecil besok dan lihat hasilnya!</div>}
      </div>
      <button onClick={() => setDetail(!detail)} className="mt-3 text-[14px] font-extrabold text-[#2f86ff] underline">
        {detail ? 'Tutup perhitungan' : 'Lihat perhitungan'}
      </button>
      {detail && (
        <div className="mt-1 rounded-[14px] bg-white p-3">
          {line('Penjualan kotor', r.grossSales)}
          {line('Diskon promo', r.discount, '−')}
          {line('Refund', r.refunds, '−')}
          {line('= Penjualan bersih (omzet)', r.netSales)}
          {line('Biaya bahan terjual (HPP)', r.hpp, '−')}
          {line('= Kontribusi', r.contribution)}
          {line('Bahan terbuang (waste)', r.waste, '−')}
          {line('Upah tim', r.wages, '−')}
          {line('Sewa', r.rent, '−')}
          {line('Listrik & air', r.utility, '−')}
          {line('Promosi', r.marketing, '−')}
          {line('Training', r.training, '−')}
          {line('= Hasil usaha', r.result)}
          <p className="mt-2 text-[12px] opacity-70">Penjualan bukan untung! Belanja bahan mengurangi uang di kas, tapi baru menjadi biaya saat bahannya terjual (HPP). Ini angka simulasi, bukan pembukuan usaha sungguhan.</p>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <Btn big onClick={onNext}>
          Hari berikutnya ▶
        </Btn>
      </div>
    </Sheet>
  );
}

/* ---------------- gambar kerja (denah) & jadwal pembangunan ---------------- */

function GambarPanel({ g, onClose }: { g: S.RestoState; onClose: () => void }) {
  const c = CONTRACTORS.find((x) => x.id === g.contractor);
  const days = c?.days ?? 3;
  const doneDays = g.handed ? days : days - g.buildLeft;
  const k = doneDays / days;
  const cur = g.handed ? BUILD_STAGES.length : stageAt(k);
  return (
    <Sheet title="Gambar kerja & jadwal" emoji="📐" onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[18px] p-2" style={{ background: '#1f4f9a' }}>
          <div className="px-1 pb-1 text-[13px] font-extrabold text-white">DENAH RESTORAN · 10 m × 8 m</div>
          <svg viewBox="0 0 220 180" className="w-full" fill="none" stroke="#fff">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="220" height="180" fill="url(#grid)" stroke="none" />
            <path d="M92 150H20V20H200V150H128" strokeWidth="4" />
            <path d="M92 150A36 36 0 0 1 128 114" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M20 58H200" strokeWidth="1.5" strokeDasharray="5 4" />
            {[34, 70, 106, 150].map((x) => (
              <rect key={x} x={x} y="28" width="28" height="16" strokeWidth="1.5" />
            ))}
            <rect x="30" y="90" width="32" height="14" strokeWidth="1.5" />
            {[
              [110, 74],
              [150, 74],
              [110, 108],
              [150, 108],
              [35, 118],
            ].map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="26" height="18" strokeWidth="1.5" />
            ))}
            <g fill="#fff" stroke="none" fontSize="9" fontWeight="700" fontFamily="system-ui">
              <text x="24" y="54">DAPUR</text>
              <text x="30" y="86">KASIR</text>
              <text x="118" y="70">RUANG MAKAN</text>
              <text x="88" y="174">PINTU + NOREN</text>
              <text x="100" y="14">10 m</text>
              <text x="4" y="90" transform="rotate(-90 8 90)">8 m</text>
            </g>
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[14px] font-extrabold">
            Kontraktor {c?.name ?? '-'} · {days} hari · progres {Math.round(k * 100)}%
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#e3cfb2]">
            <div className="h-full rounded-full bg-[#34a853] transition-all" style={{ width: `${Math.max(3, k * 100)}%` }} />
          </div>
          {Array.from({ length: days }, (_, i) => i + 1).map((j) => {
            const done = j <= doneDays;
            const now = j === doneDays + 1 && !g.handed;
            return (
              <div key={j} className="flex gap-2 rounded-[14px] bg-white p-2 shadow-[0_2px_0_#e3cfb2]">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                  style={{ background: done ? '#34a853' : now ? '#f2a21a' : '#bbb' }}
                >
                  {done ? '✓' : `H${j}`}
                </div>
                <div>
                  <div className="text-[14px] font-extrabold">
                    Hari {j}: {stagesOnDay(j, days).join(' + ')}
                  </div>
                  <div className="text-[12px] opacity-75">{done ? 'Selesai' : now ? 'Sedang dikerjakan' : 'Menunggu'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid gap-1">
        {BUILD_STAGES.map((st, i) => (
          <div key={st} className="text-[13px]">
            <b style={{ color: i < cur ? '#2a8a3a' : i === cur ? '#c8741a' : INK }}>
              {i < cur ? '✓' : i === cur ? '▶' : '•'} {st}:
            </b>{' '}
            {BUILD_STAGE_NOTE[i]}
          </div>
        ))}
      </div>
    </Sheet>
  );
}
