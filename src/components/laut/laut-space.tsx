'use client';

// Petualangan Bawah Laut 3D (tampilan anak): mode Jelajah (lihat terumbu karang, ketuk karakter biota di dok
// → kamera menghampirinya) dan mode Menyelam (tur 16 adegan dari kapal sampai palung, narasi suara,
// meteran kedalaman, rangkuman penemuan & zona laut).

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { installAudioUnlock } from '@/lib/audio-unlock';
import { BIOTA, TUR_LAUT, TUR_LAUT_AUDIO, ZONA_LAUT } from '@/lib/laut/misi';
import { LautEngine, useLaut } from './engine';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';

const fmt = (d: number) => d.toLocaleString('id-ID');

/** Meteran kedalaman di sisi kanan. */
function DepthMeter() {
  const depth = useLaut((s) => s.depth);
  const k = Math.min(1, Math.log10(1 + depth) / Math.log10(7000));
  return (
    <div className="pointer-events-none absolute top-[38%] right-2 flex -translate-y-1/2 flex-col items-center gap-1 sm:right-4" aria-label={`Kedalaman ${depth} meter`}>
      <div className="relative h-[40vh] max-h-[320px] w-3 overflow-hidden rounded-full bg-white/20">
        <div className="absolute inset-x-0 top-0 rounded-full" style={{ height: `${k * 100}%`, background: 'linear-gradient(#7fe0ff,#1d6fd6 50%,#1b2a6b)' }} />
      </div>
      <span className="rounded-full bg-black/45 px-2.5 py-1 text-white" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800 }}>
        {depth > 0 ? `${fmt(depth)} m` : '0 m'}
      </span>
    </div>
  );
}

function BiotaCard({ id }: { id: string }) {
  const b = BIOTA.find((x) => x.id === id)!;
  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-[620px] items-center gap-3 rounded-[26px] bg-white/95 p-3 shadow-[0_6px_0_rgba(0,0,0,.25)]">
      <div className="relative h-[84px] w-[118px] shrink-0 overflow-hidden rounded-[18px] sm:h-[96px] sm:w-[136px]">
        <Image src={b.img} alt="" fill sizes="136px" unoptimized className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1 }}>{b.name}</div>
        <p className="mt-1 text-[14px] leading-snug font-extrabold text-[#6b5d80] sm:text-[15px]">{b.desc}</p>
        <p className="mt-1 text-[13px] leading-snug font-bold text-[#1d6fd6]">
          <Icon name="lightbulb" size={14} className="mr-0.5 align-[-2px]" />
          {b.fact}
        </p>
      </div>
    </div>
  );
}

function Dock({ onPick }: { onPick: (id: string) => void }) {
  const focus = useLaut((s) => s.focus);
  return (
    <div className="pointer-events-auto -mx-3 overflow-x-auto px-3 pb-1">
      <div className="mx-auto flex w-max gap-2">
        {BIOTA.map((b) => {
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
    <div className="garden-pop pointer-events-auto mx-auto w-full max-w-[560px] rounded-[26px] border-2 border-[#7fe0ff]/60 bg-[#0b2a4a]/85 p-3 text-white backdrop-blur">
      <div className="mb-2 text-center" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800 }}>
        Penemuan Kami
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
        {BIOTA.map((b) => (
          <div key={b.id} className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
            <Image src={b.img} alt={b.name} fill sizes="80px" unoptimized className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Adegan "Ringkasan": tangga zona laut, zona yang sedang dilewati menyala. */
function Ringkasan() {
  const depth = useLaut((s) => s.depth);
  const cur = depth <= 0 ? 0 : depth <= 10 ? 1 : depth <= 20 ? 2 : depth <= 40 ? 3 : depth <= 200 ? 4 : depth <= 1000 ? 5 : depth <= 2000 ? 6 : depth <= 3000 ? 7 : depth <= 6000 ? 8 : 9;
  return (
    <div className="pointer-events-none absolute top-1/2 left-2 w-[min(78vw,330px)] -translate-y-1/2 rounded-[20px] bg-[#06203a]/80 p-2.5 text-white backdrop-blur sm:left-4">
      {ZONA_LAUT.map((z, i) => (
        <div key={z.name} className="flex items-center gap-2 rounded-[10px] px-2 py-1 transition-colors" style={i === cur ? { background: '#ffbe0b', color: INK } : undefined}>
          <span className="w-[92px] shrink-0 text-[11px] font-extrabold opacity-80">{z.depth}</span>
          <span className="text-[13px] font-extrabold">{z.name}</span>
        </div>
      ))}
    </div>
  );
}

function TourOverlay({ engine }: { engine: LautEngine }) {
  const { stop, progress, playing, finished } = useLaut();
  const s = TUR_LAUT[stop];
  const caption = TUR_LAUT_AUDIO.length === 0 ? s.lines[Math.min(s.lines.length - 1, Math.floor(progress * s.lines.length))] : null;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 flex gap-1 px-3" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }} aria-hidden>
        {TUR_LAUT.map((m, i) => (
          <span key={m.id} className="h-1 flex-1 rounded-full" style={{ background: i < stop ? 'rgba(255,255,255,.85)' : i === stop ? '#ffbe0b' : 'rgba(255,255,255,.2)' }} />
        ))}
      </div>
      <div className="absolute inset-x-0 flex items-start justify-between gap-2 px-3 sm:px-5" style={{ top: 'max(20px, calc(env(safe-area-inset-top) + 12px))' }}>
        <div className="flex flex-col items-start gap-1">
          <span className="rounded-full bg-white/95 px-4 py-1.5 shadow-[0_3px_0_rgba(0,0,0,.2)]" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
            {s.title}
          </span>
          <span className="rounded-full bg-[#0b2a4a]/75 px-3 py-0.5 text-[13px] font-extrabold text-[#9fe7ff]">{s.label}</span>
        </div>
        <div className="pointer-events-auto">
          <RoundBtn icon="close" label="Keluar" onClick={() => engine.setMode('jelajah')} />
        </div>
      </div>
      {s.set !== 'kapal' && <DepthMeter />}
      {s.set === 'ringkasan' && <Ringkasan />}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-3" style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}>
        {s.set === 'selesai' && <Temuan />}
        {caption && playing && <p className="max-w-[640px] rounded-2xl bg-black/50 px-4 py-2 text-center text-[15px] font-bold text-white sm:text-[17px]">{caption}</p>}
        <div className="pointer-events-auto flex w-full max-w-[640px] justify-start">
          {!finished && <RoundBtn icon={playing ? 'pause' : 'play_arrow'} label={playing ? 'Jeda' : 'Lanjut'} tone="orange" onClick={() => engine.setPlaying(!playing)} />}
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
          <RoundBtn icon="check" label="Selesai" tone="purple" onClick={() => engine.setMode('jelajah')} />
        </div>
      )}
    </div>
  );
}

export function LautSpace() {
  const host = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<LautEngine | null>(null);
  const mode = useLaut((s) => s.mode);
  const focus = useLaut((s) => s.focus);
  const router = useRouter();

  useEffect(() => {
    installAudioUnlock();
    useLaut.setState({ mode: 'jelajah', focus: null, playing: false, finished: false, stop: 0, progress: 0, depth: 0 });
    const e = new LautEngine(host.current!);
    setEngine(e);
    if (process.env.NODE_ENV === 'development') (window as unknown as { __laut?: LautEngine }).__laut = e;
    return () => e.dispose();
  }, []);

  return (
    <div className="theme-play fixed inset-0 overflow-hidden bg-[#0b3f6e]" style={{ fontFamily: 'var(--ff-nunito), system-ui, sans-serif' }}>
      <div ref={host} className="absolute inset-0" />
      {engine &&
        (mode === 'tur' ? (
          <TourOverlay engine={engine} />
        ) : (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-start justify-between gap-2">
              <RoundBtn icon={focus ? 'arrow_back' : 'home'} label={focus ? 'Kembali' : 'Keluar'} onClick={() => (focus ? engine.focus(null) : router.push('/beranda/angkasa'))} />
              <RoundBtn icon="scuba_diving" label="Menyelam!" tone="orange" onClick={() => engine.setMode('tur')} />
            </div>
            <DepthMeter />
            <div className="flex flex-col gap-3">
              {focus && <BiotaCard id={focus} />}
              <Dock onPick={(id) => engine.focus(id)} />
            </div>
          </div>
        ))}
    </div>
  );
}
