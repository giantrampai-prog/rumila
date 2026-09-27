'use client';

// Antarmuka permainan Kebun Buah: status bedengan (disimpan per anggota), pilih benih, lembar misi
// Pak Tani, dan album stiker buah.

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { FRUITS, FRUIT_BY_ID, FRUIT_GROUPS, type Fruit } from '@/lib/fruits/catalog';
import { FRUIT_ARTWORK } from '@/lib/fruits/artwork';
import { BED_COUNT, MISSIONS, advanceBed, bedStatus, emptyBed, nextMission, type Bed, type Mission } from '@/lib/fruits/farm';
import { sfx } from '@/lib/sfx';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

/* ---------------- penyimpanan per anggota ---------------- */

interface FarmState {
  beds: Bed[];
  mission: string | null;
  recent: string[];
  done: number;
  /** stiker dari misi (id buah yang menyelesaikan misi) */
  stars: string[];
}

const blank = (): FarmState => ({ beds: Array.from({ length: BED_COUNT }, emptyBed), mission: null, recent: [], done: 0, stars: [] });

export function useFarm(memberId: string) {
  const key = `rumila-kebun-main-${memberId}`;
  const [st, setSt] = useState<FarmState>(blank);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key) ?? 'null') as FarmState | null;
      if (raw && Array.isArray(raw.beds)) setSt({ ...blank(), ...raw, beds: Array.from({ length: BED_COUNT }, (_, i) => raw.beds[i] ?? emptyBed()) });
    } catch {}
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(st));
    } catch {}
  }, [key, st]);
  // tanaman tumbuh mengikuti waktu (juga saat anak sedang di tempat lain)
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      setSt((s) => {
        let changed = false;
        const beds = s.beds.map((b) => {
          const n = advanceBed(b, now);
          if (n !== b) {
            changed = true;
            sfx.grow();
          }
          return n;
        });
        return changed ? { ...s, beds } : s;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, []);
  return [st, setSt] as const;
}

export const missionById = (id: string | null) => (id ? (MISSIONS.find((m) => m.id === id) ?? null) : null);
export { nextMission };

/* ---------------- tombol aksi di dekat bedengan / Pak Tani ---------------- */

export function NearAction({ icon, label, sub, tone, disabled, onClick, thumb }: { icon: string; label: string; sub: string; tone: string; disabled?: boolean; onClick: () => void; thumb?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="garden-bob pointer-events-auto flex items-center gap-2 rounded-full bg-white p-2 pr-5 shadow-[0_6px_0_rgba(43,29,78,.18)] active:scale-95 disabled:opacity-90"
    >
      <span className="relative flex size-[64px] items-center justify-center overflow-hidden rounded-full text-white" style={{ background: tone }}>
        {thumb ? <Image src={thumb} alt="" width={64} height={64} unoptimized /> : <Icon name={icon} size={36} />}
      </span>
      <span className="text-left">
        <span className="block text-[13px] font-extrabold text-[#8a7a9c]">{sub}</span>
        <span className="block" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1 }}>
          {label}
        </span>
      </span>
    </button>
  );
}

export function bedAction(b: Bed, now: number) {
  const s = bedStatus(b, now);
  const name = b.fruit ? FRUIT_BY_ID.get(b.fruit)?.name : '';
  if (s.empty) return { icon: 'potted_plant', label: 'Tanam', sub: 'Bedengan kosong', tone: 'linear-gradient(155deg,#6fe39a,#1fbf62 60%)' };
  if (s.ripe) return { icon: 'agriculture', label: 'Panen!', sub: `${name} sudah berbuah`, tone: 'linear-gradient(155deg,#ffe46b,#ffbe0b 60%)', thumb: FRUIT_ARTWORK[b.fruit!]?.thumb };
  if (s.thirsty) return { icon: 'water_drop', label: 'Siram', sub: `${name} haus`, tone: 'linear-gradient(155deg,#7cc0ff,#2f86ff 60%)' };
  return { icon: 'hourglass_top', label: `Tumbuh… ${Math.ceil(s.left)} dtk`, sub: `${name}: tunggu sebentar`, tone: 'linear-gradient(155deg,#b8e0a0,#6fae3a 60%)', disabled: true };
}

/* ---------------- lembar bawah umum ---------------- */

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-[rgba(43,29,78,.4)] p-3 sm:items-center" onClick={onClose}>
      <div className="garden-pop relative max-h-[86dvh] w-full max-w-[600px] overflow-y-auto rounded-[30px] bg-white p-4 shadow-[0_8px_0_rgba(43,29,78,.15)]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Tutup" className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-[#f5f0fa] text-[#2b1d4e] active:scale-90">
          <Icon name="close" size={26} />
        </button>
        <div className="pr-12" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1.1 }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

/** Pilih benih: buah yang sudah ditemukan (awal permainan: 3 benih pemula). */
export function SeedPicker({ found, onPick, onClose }: { found: Set<string>; onPick: (id: string) => void; onClose: () => void }) {
  const starter = ['pisang', 'semangka', 'stroberi'];
  const list = FRUITS.filter((f) => found.has(f.id) || starter.includes(f.id));
  return (
    <Sheet title="Pilih benih" onClose={onClose}>
      <p className="mt-1 text-[14px] font-bold text-[#8a7a9c]">Benih baru didapat dari buah yang sudah kamu temukan di kebun.</p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {list.map((f) => (
          <button key={f.id} onClick={() => onPick(f.id)} className="flex flex-col items-center gap-1 rounded-[16px] bg-[#fff8ec] p-1.5 active:scale-95">
            <Image src={FRUIT_ARTWORK[f.id].thumb} alt="" width={72} height={72} unoptimized className="aspect-square w-full object-contain" />
            <span className="text-center text-[12px] leading-tight font-extrabold text-[#2b1d4e]">{f.name}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/** Lembar misi dari Pak Tani. */
export function MissionSheet({ mission, done, onAccept, onSwap, onClose }: { mission: Mission; done: number; onAccept: () => void; onSwap: () => void; onClose: () => void }) {
  return (
    <Sheet title="Pak Tani" onClose={onClose}>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#e3f5e8] text-[40px]">👨‍🌾</span>
        <div className="relative flex-1 rounded-[20px] bg-[#fff8dc] p-3 text-[17px] leading-snug font-extrabold text-[#5a4410]">
          <span className="flex items-center gap-2">
            <Icon name={mission.icon} size={22} className="shrink-0 text-[#d99400]" />
            {mission.text}
          </span>
        </div>
      </div>
      {done > 0 && <p className="mt-2 text-[13px] font-bold text-[#8a7a9c]">Kamu sudah membantu Pak Tani {done} kali. Terima kasih!</p>}
      <div className="mt-4 flex gap-2">
        <button onClick={onSwap} className="flex h-14 flex-1 items-center justify-center gap-1.5 rounded-[18px] bg-[#f5f0fa] text-[#2b1d4e] active:scale-95" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}>
          <Icon name="refresh" size={24} />
          Misi lain
        </button>
        <button
          onClick={onAccept}
          className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-[18px] text-white active:scale-95"
          style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, background: 'linear-gradient(155deg,#6fe39a,#1fbf62 60%)', boxShadow: '0 4px 0 #12904a' }}
        >
          <Icon name="travel_explore" size={26} />
          Siap, aku cari!
        </button>
      </div>
    </Sheet>
  );
}

/** Pemberitahuan singkat di tengah atas (misi selesai / petunjuk). */
export function Toast({ text, good }: { text: string; good?: boolean }) {
  return (
    <div className="garden-pop pointer-events-none absolute inset-x-0 top-[92px] z-20 flex justify-center px-4">
      <span className="rounded-[20px] px-4 py-2.5 text-center text-[16px] font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,.15)]" style={{ background: good ? '#1fbf62' : '#6b5d80', maxWidth: 520 }}>
        {text}
      </span>
    </div>
  );
}

/** Album stiker: buah yang sudah ditemukan jadi stiker; yang belum tampak sebagai bayangan. */
export function Album({ found, stars, onOpen, onClose, onCatalog }: { found: Set<string>; stars: string[]; onOpen: (f: Fruit) => void; onClose: () => void; onCatalog: () => void }) {
  const [hint, setHint] = useState<string | null>(null);
  const groups = FRUIT_GROUPS.filter((g) => g.id !== 'all');
  return (
    <Sheet title={`Album Buah · ${found.size}/${FRUITS.length}`} onClose={onClose}>
      <p className="mt-1 text-[14px] font-bold text-[#8a7a9c]">Temukan buah di kebun untuk mengisi stikernya. Tanda 🤝 = buah yang membantu misi Pak Tani.</p>
      <button onClick={onCatalog} className="mt-2 flex items-center gap-1.5 rounded-full bg-[#f5f0fa] px-3 py-1.5 text-[13px] font-extrabold text-[#5b4bff] active:scale-95">
        <Icon name="grid_view" size={18} />
        Katalog semua buah
      </button>
      {groups.map((g) => (
        <div key={g.id} className="mt-4">
          <div className="mb-2 text-[15px] font-extrabold text-[#6b5d80]">{g.name}</div>
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
            {FRUITS.filter((f) => f.group === g.id).map((f, i) => {
              const got = found.has(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    if (got) onOpen(f);
                    else {
                      sfx.tap();
                      setHint(f.id);
                      window.setTimeout(() => setHint((h) => (h === f.id ? null : h)), 1400);
                    }
                  }}
                  className={`relative flex flex-col items-center gap-1 rounded-[16px] p-1.5 active:scale-95 ${hint === f.id ? 'animate-bounce' : ''}`}
                  style={{ background: got ? '#fff8ec' : '#f1eef6', transform: got ? `rotate(${((i % 5) - 2) * 1.5}deg)` : undefined, boxShadow: got ? '0 3px 0 rgba(43,29,78,.08)' : undefined }}
                >
                  <Image
                    src={FRUIT_ARTWORK[f.id].thumb}
                    alt=""
                    width={72}
                    height={72}
                    unoptimized
                    className="aspect-square w-full object-contain"
                    style={got ? { filter: 'drop-shadow(0 0 0 #fff) drop-shadow(0 2px 0 #fff)' } : { filter: 'brightness(0) opacity(.18)' }}
                  />
                  <span className="text-center text-[11.5px] leading-tight font-extrabold" style={{ color: got ? INK : '#a99cb8' }}>
                    {got ? f.name : hint === f.id ? 'Belum ketemu' : '?'}
                  </span>
                  {stars.includes(f.id) && <span className="absolute -top-1.5 -right-1.5 text-[18px]">🤝</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </Sheet>
  );
}
