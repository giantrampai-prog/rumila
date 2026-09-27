'use client';

// Petualangan ke Dalam Bumi 3D (tampilan anak): mode Jelajah (ketuk karakter di dok → kamera pindah ke
// lokasinya), mode Tur (16 adegan dari kaki bukit sampai inti Bumi, narasi, meteran kedalaman, rangkuman
// lapisan) dan dua game edukasi (Gali Fosil & Susun Lapisan Bumi).

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { installAudioUnlock } from '@/lib/audio-unlock';
import { KARAKTER, LAPISAN, TUR_BUMI, TUR_BUMI_AUDIO, fmtDepth } from '@/lib/bumi/misi';
import { sfx } from '@/lib/sfx';
import { BumiEngine, ringkasanLayer, useBumi } from './engine';
import { GaliFosil, SusunLapisan } from './games';
import './bumi.css';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

/** Meteran kedalaman di sisi kanan (skala logaritmik: 1 m … 6.371 km). */
function DepthMeter() {
  const depth = useBumi((s) => s.depth);
  if (depth < 0) return null;
  const k = Math.min(1, Math.log10(1 + depth) / Math.log10(6371001));
  return (
    <div className="pointer-events-none absolute top-[40%] right-2 flex -translate-y-1/2 flex-col items-center gap-1 sm:right-4" aria-label={`Kedalaman ${fmtDepth(depth)}`}>
      <div className="relative h-[38vh] max-h-[300px] w-3 overflow-hidden rounded-full bg-white/20">
        <div className="absolute inset-x-0 top-0 rounded-full" style={{ height: `${k * 100}%`, background: 'linear-gradient(#7fd05a,#8a5a34 25%,#9a7a58 45%,#ff6a1a 70%,#ffe27a)' }} />
      </div>
      <span className="rounded-full bg-black/55 px-2.5 py-1 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}>
        {fmtDepth(depth)}
      </span>
    </div>
  );
}

function KarakterCard({ id }: { id: string }) {
  const b = KARAKTER.find((x) => x.id === id)!;
  return (
    <div className="bumi-pop pointer-events-auto mx-auto flex w-full max-w-[620px] items-center gap-3 rounded-[26px] bg-white/95 p-3 shadow-[0_6px_0_rgba(0,0,0,.25)]">
      <div className="relative h-[84px] w-[118px] shrink-0 overflow-hidden rounded-[18px] sm:h-[96px] sm:w-[136px]">
        <Image src={b.img} alt="" fill sizes="136px" unoptimized className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1 }}>{b.name}</div>
        <p className="mt-1 text-[14px] leading-snug font-extrabold text-[#6b5d80] sm:text-[15px]">{b.desc}</p>
        <p className="mt-1 text-[13px] leading-snug font-bold text-[#c2410c]">
          <Icon name="lightbulb" size={14} className="mr-0.5 align-[-2px]" />
          {b.fact}
        </p>
      </div>
    </div>
  );
}

function Dock({ onPick }: { onPick: (id: string) => void }) {
  const focus = useBumi((s) => s.focus);
  return (
    <div className="pointer-events-auto -mx-3 overflow-x-auto px-3 pb-1">
      <div className="mx-auto flex w-max gap-2">
        {KARAKTER.map((b) => {
          const on = focus === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onPick(b.id)}
              aria-pressed={on}
              className="flex w-[84px] shrink-0 flex-col items-center gap-1 rounded-[20px] p-1.5 transition-transform active:scale-90"
              style={on ? { background: 'rgba(255,255,255,.22)', boxShadow: 'inset 0 0 0 3px #ffbe0b' } : undefined}
            >
              <span className="relative block h-[48px] w-[70px] overflow-hidden rounded-[14px] shadow-[0_3px_0_rgba(0,0,0,.3)]">
                <Image src={b.img} alt="" fill sizes="70px" unoptimized className="object-cover" />
              </span>
              <span className="text-center text-white" style={{ fontFamily: BALOO, fontSize: 12.5, fontWeight: 800, lineHeight: 1.05, textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>
                {b.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Adegan "Misi selesai": panel penemuan kita. */
function Temuan() {
  return (
    <div className="bumi-pop pointer-events-auto mx-auto w-full max-w-[560px] rounded-[26px] border-2 border-[#ffbe0b]/60 bg-[#1a0f08]/85 p-3 text-white backdrop-blur">
      <div className="mb-2 text-center" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800 }}>
        Penemuan Kami
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
        {KARAKTER.map((b) => (
          <div key={b.id} className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
            <Image src={b.img} alt={b.name} fill sizes="80px" unoptimized className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Adegan "Ringkasan": tangga lapisan Bumi, lapisan yang sedang disebut menyala. */
function Ringkasan() {
  const progress = useBumi((s) => s.progress);
  const cur = ringkasanLayer(progress);
  return (
    <div className="pointer-events-none absolute top-1/2 left-2 w-[min(78vw,320px)] -translate-y-1/2 rounded-[20px] bg-[#0b0a1e]/80 p-2.5 text-white backdrop-blur sm:left-4">
      {LAPISAN.map((z, i) => (
        <div key={z.id} className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 transition-colors" style={i === cur ? { background: '#ffbe0b', color: INK } : undefined}>
          <span className="size-3.5 shrink-0 rounded-full" style={{ background: z.color }} />
          <span className="text-[13px] font-extrabold">{z.name}</span>
          <span className="ml-auto text-[11px] font-extrabold opacity-80">{z.depth}</span>
        </div>
      ))}
    </div>
  );
}

type Game = 'fosil' | 'lapisan' | null;

function GameMenu({ onPick, onClose }: { onPick: (g: Exclude<Game, null>) => void; onClose: () => void }) {
  const card = (g: Exclude<Game, null>, emoji: string, title: string, desc: string, bg: string) => (
    <button
      onClick={() => {
        sfx.open();
        onPick(g);
      }}
      className="flex w-full items-center gap-3 rounded-[22px] p-3 text-left text-white transition-transform active:scale-95"
      style={{ background: bg, boxShadow: '0 5px 0 rgba(0,0,0,.3)' }}
    >
      <span className="flex size-[64px] shrink-0 items-center justify-center rounded-[18px] bg-white/25 text-[38px]">{emoji}</span>
      <span>
        <span className="block" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
          {title}
        </span>
        <span className="mt-1 block text-[14px] leading-snug font-bold opacity-90">{desc}</span>
      </span>
    </button>
  );
  return (
    <div className="pointer-events-auto fixed inset-0 z-20 flex items-end justify-center bg-black/45 p-3 sm:items-center" onClick={onClose}>
      <div className="bumi-pop w-full max-w-[460px] rounded-[28px] bg-white p-4" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="mb-3 text-center" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
          Main & Belajar
        </div>
        <div className="flex flex-col gap-2.5">
          {card('fosil', '🦴', 'Gali Fosil', 'Gosok tanah pelan-pelan dan temukan fosil purba.', 'linear-gradient(155deg,#c08a4a,#8a5a2a)')}
          {card('lapisan', '🌍', 'Susun Lapisan Bumi', 'Susun lapisan Bumi dari kerak sampai inti.', 'linear-gradient(155deg,#ff9a3a,#d9542c)')}
        </div>
      </div>
    </div>
  );
}

function TourOverlay({ engine, onGames }: { engine: BumiEngine; onGames: () => void }) {
  const { stop, progress, playing, finished, loading } = useBumi();
  const s = TUR_BUMI[stop];
  const caption = TUR_BUMI_AUDIO.length === 0 ? s.lines[Math.min(s.lines.length - 1, Math.floor(progress * s.lines.length))] : null;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }} aria-hidden>
        {TUR_BUMI.map((m, i) => (
          <span key={m.id} className="h-1 flex-1 rounded-full" style={{ background: i < stop ? 'rgba(255,255,255,.85)' : i === stop ? '#ffbe0b' : 'rgba(255,255,255,.2)' }} />
        ))}
      </div>
      <div className="absolute inset-x-0 flex items-start justify-between gap-2 px-3 sm:px-5" style={{ top: 'max(20px, calc(env(safe-area-inset-top) + 12px))' }}>
        <div className="flex flex-col items-start gap-1">
          <span className="rounded-full bg-white/95 px-4 py-1.5 shadow-[0_3px_0_rgba(0,0,0,.2)]" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
            {s.title}
          </span>
          <span className="rounded-full bg-[#2a1a10]/75 px-3 py-0.5 text-[13px] font-extrabold text-[#ffd9a0]">{s.label}</span>
        </div>
        <div className="pointer-events-auto">
          <RoundBtn icon="close" label="Keluar" onClick={() => engine.setMode('jelajah')} />
        </div>
      </div>
      {s.set !== 'permukaan' && s.set !== 'ringkasan' && <DepthMeter />}
      {s.set === 'ringkasan' && <Ringkasan />}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-3" style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}>
        {s.set === 'selesai' && <Temuan />}
        {caption && playing && <p className="max-w-[640px] rounded-2xl bg-black/55 px-4 py-2 text-center text-[15px] font-bold text-white sm:text-[17px]">{caption}</p>}
        <div className="pointer-events-auto flex w-full max-w-[640px] items-center justify-start gap-3">
          {!finished && <RoundBtn icon={playing ? 'pause' : 'play_arrow'} label={playing ? 'Jeda' : 'Lanjut'} tone="orange" onClick={() => engine.setPlaying(!playing)} />}
          {loading && <span className="rounded-full bg-black/50 px-3 py-1 text-[13px] font-bold text-white">Memuat suara…</span>}
        </div>
      </div>
      {finished && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center gap-6 bg-black/25">
          <RoundBtn
            icon="replay"
            label="Ulangi"
            tone="orange"
            onClick={() => {
              engine.go(0);
              engine.setPlaying(true);
            }}
          />
          <RoundBtn icon="sports_esports" label="Main game" tone="purple" onClick={onGames} />
          <RoundBtn icon="check" label="Selesai" tone="purple" onClick={() => engine.setMode('jelajah')} />
        </div>
      )}
    </div>
  );
}

export function BumiSpace() {
  const host = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<BumiEngine | null>(null);
  const [menu, setMenu] = useState(false);
  const [game, setGame] = useState<Game>(null);
  const mode = useBumi((s) => s.mode);
  const focus = useBumi((s) => s.focus);
  const router = useRouter();

  useEffect(() => {
    installAudioUnlock();
    useBumi.setState({ mode: 'jelajah', focus: null, playing: false, finished: false, stop: 0, progress: 0, depth: 30, loading: false });
    const e = new BumiEngine(host.current!);
    setEngine(e);
    if (process.env.NODE_ENV === 'development') (window as unknown as { __bumi?: BumiEngine }).__bumi = e;
    return () => e.dispose();
  }, []);

  const openGames = () => {
    if (mode === 'tur') engine?.setMode('jelajah');
    setMenu(true);
  };

  return (
    <div className="theme-play fixed inset-0 overflow-hidden bg-[#120d0a]" style={{ fontFamily: 'var(--ff-nunito), system-ui, sans-serif' }}>
      <div ref={host} className="absolute inset-0" />
      {engine &&
        (mode === 'tur' ? (
          <TourOverlay engine={engine} onGames={openGames} />
        ) : (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-start justify-between gap-2">
              <RoundBtn icon={focus ? 'arrow_back' : 'home'} label={focus ? 'Kembali' : 'Keluar'} onClick={() => (focus ? engine.focus(null) : router.push('/beranda/angkasa'))} />
              <div className="flex gap-3">
                <RoundBtn icon="sports_esports" label="Game" tone="purple" onClick={openGames} />
                <RoundBtn icon="explore" label="Mulai Tur" tone="orange" onClick={() => engine.setMode('tur')} />
              </div>
            </div>
            <DepthMeter />
            <div className="flex flex-col gap-3">
              {focus && <KarakterCard key={focus} id={focus} />}
              <Dock onPick={(id) => engine.focus(id)} />
            </div>
          </div>
        ))}
      {menu && (
        <GameMenu
          onClose={() => setMenu(false)}
          onPick={(g) => {
            setMenu(false);
            setGame(g);
          }}
        />
      )}
      {game === 'fosil' && <GaliFosil onClose={() => setGame(null)} />}
      {game === 'lapisan' && <SusunLapisan onClose={() => setGame(null)} />}
    </div>
  );
}
