'use client';

// Dua game edukasi Petualangan ke Dalam Bumi (tanpa skor/bintang — fokus menemukan & memahami):
// 1) Gali Fosil: gosok tanah dengan jari seperti ahli paleontologi → fosil muncul → kartu fakta.
// 2) Susun Lapisan Bumi: pilih lapisan dari luar ke dalam, petunjuk lembut bila keliru.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RoundBtn } from '@/components/angkasa/kid-space';
import { Icon } from '@/components/ui';
import { LAPISAN, TEMUAN } from '@/lib/bumi/misi';
import { sfx } from '@/lib/sfx';

const BALOO = 'var(--ff-baloo), system-ui, sans-serif';
const INK = '#2b1d4e';
type Kind = (typeof TEMUAN)[number]['kind'];

/* ---------------- gambar fosil (kanvas 2D) ---------------- */

function drawFossil(g: CanvasRenderingContext2D, kind: Kind, S: number) {
  const c = S / 2;
  g.save();
  g.lineCap = 'round';
  g.lineJoin = 'round';
  if (kind === 'amonit') {
    g.translate(c, c);
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 300; i++) {
      const a = (i / 300) * Math.PI * 2 * 3.2;
      const r = S * 0.012 * Math.exp(a * 0.165);
      pts.push([Math.cos(a) * r, Math.sin(a) * r, r]);
    }
    for (let i = pts.length - 1; i > 0; i--) {
      const [x, y, r] = pts[i];
      g.fillStyle = i % 2 ? '#c9a27a' : '#bf9670';
      g.beginPath();
      g.arc(x, y, r * 0.45 + 2, 0, 6.3);
      g.fill();
    }
    g.strokeStyle = 'rgba(90,60,30,.55)';
    for (let i = 40; i < pts.length; i += 7) {
      const [x, y, r] = pts[i];
      const a = Math.atan2(y, x);
      g.lineWidth = Math.max(1.5, r * 0.06);
      g.beginPath();
      g.moveTo(x - Math.cos(a) * r * 0.42, y - Math.sin(a) * r * 0.42);
      g.lineTo(x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.42);
      g.stroke();
    }
  } else if (kind === 'trilobit') {
    g.translate(c, c);
    g.fillStyle = '#7a6452';
    g.beginPath();
    g.ellipse(0, -S * 0.22, S * 0.22, S * 0.12, 0, Math.PI, 0);
    g.fill();
    g.strokeStyle = '#5a4838';
    for (let i = 0; i < 10; i++) {
      const w = S * 0.2 * (1 - i * 0.06);
      const y = -S * 0.18 + i * S * 0.036;
      g.fillStyle = i % 2 ? '#7a6452' : '#846c58';
      g.beginPath();
      g.ellipse(0, y, w, S * 0.02, 0, 0, 6.3);
      g.fill();
      g.lineWidth = 2;
      g.stroke();
    }
    g.fillStyle = '#6a5442';
    g.beginPath();
    g.ellipse(0, S * 0.2, S * 0.1, S * 0.06, 0, 0, 6.3);
    g.fill();
    g.fillStyle = '#5a4838';
    g.fillRect(-S * 0.035, -S * 0.3, S * 0.07, S * 0.5);
    g.fillStyle = '#2a2018';
    for (const sx of [-1, 1]) {
      g.beginPath();
      g.arc(sx * S * 0.1, -S * 0.25, S * 0.018, 0, 6.3);
      g.fill();
    }
  } else if (kind === 'daun') {
    g.translate(c, c);
    g.rotate(-0.5);
    g.fillStyle = '#4a4034';
    g.beginPath();
    g.moveTo(0, -S * 0.34);
    g.quadraticCurveTo(S * 0.22, 0, 0, S * 0.34);
    g.quadraticCurveTo(-S * 0.22, 0, 0, -S * 0.34);
    g.fill();
    g.strokeStyle = '#2a241c';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(0, -S * 0.34);
    g.lineTo(0, S * 0.42);
    g.stroke();
    g.lineWidth = 2;
    for (let i = 0; i < 7; i++)
      for (const s of [-1, 1]) {
        const y = -S * 0.24 + i * S * 0.075;
        g.beginPath();
        g.moveTo(0, y);
        g.quadraticCurveTo(s * S * 0.06, y - S * 0.02, s * S * 0.13 * (1 - Math.abs(i - 3) / 5), y - S * 0.06);
        g.stroke();
      }
  } else if (kind === 'ikan') {
    g.translate(c, c);
    g.strokeStyle = '#e0d2b4';
    g.fillStyle = '#e0d2b4';
    g.lineWidth = S * 0.018;
    g.beginPath();
    g.moveTo(-S * 0.3, 0);
    g.quadraticCurveTo(0, -S * 0.03, S * 0.25, 0);
    g.stroke();
    for (let i = 0; i < 12; i++) {
      const x = -S * 0.2 + i * S * 0.035;
      const h = S * 0.13 * Math.sin(((i + 1) / 13) * Math.PI);
      g.lineWidth = S * 0.008;
      g.beginPath();
      g.moveTo(x, 0);
      g.quadraticCurveTo(x + S * 0.02, -h * 0.6, x + S * 0.01, -h);
      g.moveTo(x, 0);
      g.quadraticCurveTo(x + S * 0.02, h * 0.6, x + S * 0.01, h);
      g.stroke();
    }
    g.beginPath();
    g.ellipse(-S * 0.3, 0, S * 0.08, S * 0.06, 0, 0, 6.3);
    g.fill();
    g.fillStyle = '#5a4a3a';
    g.beginPath();
    g.arc(-S * 0.32, -S * 0.015, S * 0.015, 0, 6.3);
    g.fill();
    g.fillStyle = '#e0d2b4';
    g.beginPath();
    g.moveTo(S * 0.25, 0);
    g.lineTo(S * 0.36, -S * 0.09);
    g.lineTo(S * 0.33, 0);
    g.lineTo(S * 0.36, S * 0.09);
    g.closePath();
    g.fill();
  } else if (kind === 'tulang') {
    g.translate(c, c);
    g.rotate(-0.35);
    g.fillStyle = '#ece0c4';
    g.fillRect(-S * 0.26, -S * 0.045, S * 0.52, S * 0.09);
    for (const sx of [-1, 1])
      for (const sy of [-1, 1]) {
        g.beginPath();
        g.arc(sx * S * 0.27, sy * S * 0.05, S * 0.07, 0, 6.3);
        g.fill();
      }
    g.strokeStyle = 'rgba(120,100,70,.4)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(-S * 0.18, 0);
    g.lineTo(S * 0.18, S * 0.01);
    g.stroke();
  } else {
    // geoda: kulit batu abu-abu, rongga penuh kristal ungu
    g.translate(c, c);
    g.fillStyle = '#8a8076';
    g.beginPath();
    g.ellipse(0, 0, S * 0.3, S * 0.26, 0.2, 0, 6.3);
    g.fill();
    g.fillStyle = '#e8e2f2';
    g.beginPath();
    g.ellipse(0, 0, S * 0.25, S * 0.21, 0.2, 0, 6.3);
    g.fill();
    const q = g.createRadialGradient(0, 0, 0, 0, 0, S * 0.22);
    q.addColorStop(0, '#3a1a6a');
    q.addColorStop(0.6, '#8a4ae0');
    q.addColorStop(1, '#c9a2ff');
    g.fillStyle = q;
    g.beginPath();
    g.ellipse(0, 0, S * 0.22, S * 0.18, 0.2, 0, 6.3);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * 6.28;
      const r = S * (0.1 + (i % 3) * 0.03);
      g.beginPath();
      g.moveTo(Math.cos(a) * r, Math.sin(a) * r * 0.82);
      g.lineTo(Math.cos(a + 0.08) * (r + S * 0.04), Math.sin(a + 0.08) * (r + S * 0.04) * 0.82);
      g.lineTo(Math.cos(a - 0.08) * (r + S * 0.04), Math.sin(a - 0.08) * (r + S * 0.04) * 0.82);
      g.fill();
    }
  }
  g.restore();
}

function drawSlab(g: CanvasRenderingContext2D, S: number) {
  const q = g.createLinearGradient(0, 0, S, S);
  q.addColorStop(0, '#b8ab98');
  q.addColorStop(1, '#9a8c78');
  g.fillStyle = q;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.1)';
    g.beginPath();
    g.arc(Math.random() * S, Math.random() * S, 1 + Math.random() * 3, 0, 6.3);
    g.fill();
  }
}

function drawDirt(g: CanvasRenderingContext2D, S: number) {
  g.globalCompositeOperation = 'source-over';
  const q = g.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.75);
  q.addColorStop(0, '#8a5a34');
  q.addColorStop(1, '#6a4224');
  g.fillStyle = q;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 1400; i++) {
    const r = Math.random();
    g.fillStyle = r < 0.4 ? '#5a3a1e' : r < 0.8 ? '#a0703e' : '#8a8078';
    g.beginPath();
    g.arc(Math.random() * S, Math.random() * S, 1 + Math.random() * (r > 0.8 ? 7 : 3), 0, 6.3);
    g.fill();
  }
}

const FOUND_KEY = 'rumila-bumi-fosil';

export function GaliFosil({ onClose }: { onClose: () => void }) {
  const [found, setFound] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FOUND_KEY) ?? '[]');
    } catch {
      return [];
    }
  });
  const [cur, setCur] = useState(() => TEMUAN.find((f) => !found.includes(f.id)) ?? TEMUAN[Math.floor(Math.random() * TEMUAN.length)]);
  const [cleared, setCleared] = useState(0);
  const [done, setDone] = useState(false);
  const base = useRef<HTMLCanvasElement>(null);
  const dirt = useRef<HTMLCanvasElement>(null);
  const [brush, setBrush] = useState<{ x: number; y: number } | null>(null);
  const S = 600;
  const last = useRef({ x: 0, y: 0, down: false, sound: 0, check: 0 });

  useEffect(() => {
    const g = base.current!.getContext('2d')!;
    drawSlab(g, S);
    drawFossil(g, cur.kind, S);
    drawDirt(dirt.current!.getContext('2d')!, S);
    setCleared(0);
    setDone(false);
  }, [cur]);

  const measure = useCallback(() => {
    const d = dirt.current!.getContext('2d')!.getImageData(0, 0, S, S).data;
    let clear = 0,
      n = 0;
    // hanya bagian tengah (tempat fosil) yang dihitung
    for (let y = S * 0.15; y < S * 0.85; y += 10)
      for (let x = S * 0.15; x < S * 0.85; x += 10) {
        n++;
        if (d[(Math.floor(y) * S + Math.floor(x)) * 4 + 3] < 60) clear++;
      }
    return clear / n;
  }, []);

  const finish = useCallback(() => {
    setDone(true);
    const g = dirt.current!.getContext('2d')!;
    g.clearRect(0, 0, S, S);
    sfx.celebrate();
    setFound((f) => {
      const next = f.includes(cur.id) ? f : [...f, cur.id];
      try {
        localStorage.setItem(FOUND_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [cur]);

  const scrub = (e: React.PointerEvent) => {
    if (done) return;
    const r = dirt.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * S,
      y = ((e.clientY - r.top) / r.height) * S;
    setBrush({ x: e.clientX - r.left, y: e.clientY - r.top });
    if (!last.current.down) return;
    const g = dirt.current!.getContext('2d')!;
    g.globalCompositeOperation = 'destination-out';
    const R = S * 0.07;
    const steps = Math.max(1, Math.ceil(Math.hypot(x - last.current.x, y - last.current.y) / (R * 0.3)));
    for (let i = 1; i <= steps; i++) {
      const px = last.current.x + ((x - last.current.x) * i) / steps,
        py = last.current.y + ((y - last.current.y) * i) / steps;
      const q = g.createRadialGradient(px, py, 0, px, py, R);
      // tiap usapan hanya mengangkat sebagian tanah, jadi harus digosok beberapa kali seperti sungguhan
      q.addColorStop(0, 'rgba(0,0,0,.35)');
      q.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = q;
      g.beginPath();
      g.arc(px, py, R, 0, 6.3);
      g.fill();
    }
    last.current.x = x;
    last.current.y = y;
    const now = performance.now();
    if (now - last.current.sound > 90) {
      last.current.sound = now;
      sfx.brush();
    }
    if (now - last.current.check > 350) {
      last.current.check = now;
      const k = measure();
      setCleared(k);
      if (k > 0.72) finish();
    }
  };

  const next = () => {
    sfx.tap();
    const left = TEMUAN.filter((f) => f.id !== cur.id && !found.includes(f.id));
    const pool = left.length ? left : TEMUAN.filter((f) => f.id !== cur.id);
    setCur(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-30 flex flex-col items-center overflow-y-auto bg-[radial-gradient(circle_at_50%_30%,#6a4a30,#2a1a10)] px-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="flex w-full max-w-[640px] items-center justify-between gap-2">
        <div>
          <div className="text-white" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
            Gali Fosil
          </div>
          <div className="text-[13px] font-extrabold text-[#ffd9a0]">Gosok tanahnya pelan-pelan seperti ahli fosil!</div>
        </div>
        <RoundBtn icon="close" label="Tutup" onClick={onClose} />
      </div>

      <div className="relative mt-3 aspect-square w-[min(92vw,58vh,560px)] touch-none overflow-hidden rounded-[28px] shadow-[0_8px_0_rgba(0,0,0,.35)]" style={{ cursor: 'none' }}>
        <canvas ref={base} width={S} height={S} className="absolute inset-0 size-full" />
        <canvas
          ref={dirt}
          width={S}
          height={S}
          className="absolute inset-0 size-full transition-opacity duration-500"
          onPointerDown={(e) => {
            const r = dirt.current!.getBoundingClientRect();
            last.current = { ...last.current, down: true, x: ((e.clientX - r.left) / r.width) * S, y: ((e.clientY - r.top) / r.height) * S };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            scrub(e);
          }}
          onPointerMove={scrub}
          onPointerUp={() => (last.current.down = false)}
          onPointerLeave={() => setBrush(null)}
        />
        {brush && !done && (
          <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[44px] drop-shadow-[0_2px_2px_rgba(0,0,0,.5)]" style={{ left: brush.x, top: brush.y }}>
            🖌️
          </span>
        )}
        {!done && cleared < 0.05 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center">
            <span className="bumi-glow rounded-full bg-black/55 px-4 py-1.5 text-[15px] font-extrabold text-white">👆 Usap di sini</span>
          </div>
        )}
      </div>

      {/* meteran seberapa banyak tanah sudah dibersihkan (bukan skor) */}
      {!done && (
        <div className="mt-3 h-3 w-[min(92vw,58vh,560px)] overflow-hidden rounded-full bg-black/35">
          <div className="h-full rounded-full bg-[#ffbe0b] transition-[width] duration-300" style={{ width: `${Math.min(100, (cleared / 0.72) * 100)}%` }} />
        </div>
      )}

      {done && (
        <div className="bumi-pop mt-3 w-full max-w-[560px] rounded-[24px] bg-white p-4 shadow-[0_6px_0_rgba(0,0,0,.25)]">
          <div className="flex items-center gap-2" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
            <span>🎉</span> Kamu menemukan {cur.name}!
          </div>
          <p className="mt-1 text-[15px] leading-snug font-bold text-[#6b5d80]">{cur.fact}</p>
          <p className="mt-1 text-[13px] leading-snug font-bold text-[#1d6fd6]">
            <Icon name="lightbulb" size={14} className="mr-0.5 align-[-2px]" />
            Ahli fosil menggali dengan sikat & kuas pelan-pelan supaya fosil tidak rusak.
          </p>
          <button onClick={next} className="mt-3 w-full rounded-full py-3 text-white active:scale-95" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: 'linear-gradient(155deg,#ffb347,#ff7a1a 60%)', boxShadow: '0 5px 0 #c85400' }}>
            Gali fosil lain
          </button>
        </div>
      )}

      {/* koleksi temuan */}
      <div className="mt-4 flex w-full max-w-[560px] items-center justify-center gap-2">
        {TEMUAN.map((f) => {
          const has = found.includes(f.id);
          return (
            <div key={f.id} title={has ? f.name : '???'} className="flex size-[52px] items-center justify-center rounded-[14px] text-[26px]" style={{ background: has ? '#fff6e0' : 'rgba(255,255,255,.12)', boxShadow: has ? '0 3px 0 rgba(0,0,0,.3)' : 'inset 0 0 0 2px rgba(255,255,255,.2)' }}>
              {has ? { amonit: '🐚', trilobit: '🪲', daun: '🍃', ikan: '🐟', tulang: '🦴', geoda: '💜' }[f.kind] : '❔'}
            </div>
          );
        })}
      </div>
      <div className="mt-1 text-[12px] font-extrabold text-white/70">
        Koleksi fosil: {found.length} dari {TEMUAN.length}
      </div>
    </div>
  );
}

/* ---------------- Susun Lapisan Bumi ---------------- */

const RADII = [1, 0.955, 0.86, 0.545, 0.19];
const ASK = ['Lapisan mana yang paling luar?', 'Lapisan apa yang ada di bawah kerak bumi?', 'Lalu, lapisan apa berikutnya?', 'Sekarang kita masuk ke inti. Yang mana dulu?', 'Terakhir, lapisan paling dalam?'];
const HINT = [
  'Mulai dari tempat kita berpijak — lapisan paling luar dan paling tipis.',
  'Di bawah kerak ada batuan panas yang bergerak pelan dan menggeser lempeng.',
  'Makin dalam, batuan makin padat karena tekanannya besar.',
  'Cari lapisan logam yang CAIR — ia membantu membuat medan magnet.',
  'Pusat Bumi adalah bola logam yang PADAT.',
];

function halfRing(ro: number, ri: number) {
  const cx = 100,
    cy = 104,
    k = 96;
  const o = ro * k,
    i = ri * k;
  if (ri <= 0) return `M ${cx - o} ${cy} A ${o} ${o} 0 0 1 ${cx + o} ${cy} Z`;
  return `M ${cx - o} ${cy} A ${o} ${o} 0 0 1 ${cx + o} ${cy} L ${cx + i} ${cy} A ${i} ${i} 0 0 0 ${cx - i} ${cy} Z`;
}

export function SusunLapisan({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [seed, setSeed] = useState(0);
  const chips = useMemo(() => {
    void seed;
    const a = [...LAPISAN];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [seed]);
  const done = step >= LAPISAN.length;
  const lastPlaced = step > 0 ? LAPISAN[step - 1] : null;

  const pick = (id: string) => {
    if (done) return;
    if (id === LAPISAN[step].id) {
      sfx.pick();
      if (step === LAPISAN.length - 1) setTimeout(() => sfx.celebrate(), 250);
      setStep(step + 1);
      setHint(false);
    } else {
      sfx.thud();
      setWrong(id);
      setHint(true);
      setTimeout(() => setWrong(null), 450);
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-30 flex flex-col items-center overflow-y-auto bg-[radial-gradient(circle_at_50%_20%,#1b2a6b,#070a1e)] px-3" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="flex w-full max-w-[640px] items-center justify-between gap-2">
        <div>
          <div className="text-white" style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
            Susun Lapisan Bumi
          </div>
          <div className="text-[13px] font-extrabold text-[#9fe7ff]">Susun dari luar sampai ke pusat Bumi</div>
        </div>
        <RoundBtn icon="close" label="Tutup" onClick={onClose} />
      </div>

      <svg viewBox="0 0 200 108" className="mt-4 w-[min(92vw,560px)]" aria-label="Penampang Bumi">
        {LAPISAN.map((ly, i) => {
          const filled = i < step;
          return (
            <path
              key={ly.id}
              d={halfRing(RADII[i], RADII[i + 1] ?? 0)}
              className="bumi-ring"
              fill={filled ? ly.color : 'rgba(255,255,255,.06)'}
              stroke={i === step ? '#ffbe0b' : 'rgba(255,255,255,.35)'}
              strokeWidth={i === step ? 1.4 : 0.6}
              strokeDasharray={filled ? undefined : '2 2'}
            />
          );
        })}
        {!done && <text x="100" y="100" textAnchor="middle" fontSize="7" fontWeight="800" fill="#ffbe0b">?</text>}
      </svg>

      <div className="mt-3 w-full max-w-[560px] text-center">
        {!done ? (
          <>
            <div className="text-white" style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800 }}>
              {ASK[step]}
            </div>
            {hint && <div className="bumi-pop mt-1 rounded-2xl bg-white/10 px-3 py-2 text-[14px] font-bold text-[#ffd9a0]">💡 {HINT[step]}</div>}
          </>
        ) : (
          <div className="bumi-pop rounded-[22px] bg-white p-4 text-left shadow-[0_6px_0_rgba(0,0,0,.3)]">
            <div style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>🎉 Hebat, lapisan Bumi tersusun!</div>
            <p className="mt-1 text-[14px] font-bold text-[#6b5d80]">Dari luar ke dalam: kerak bumi, mantel atas, mantel bawah, inti luar yang cair, dan inti dalam yang padat.</p>
            <button
              onClick={() => {
                sfx.tap();
                setStep(0);
                setSeed((s) => s + 1);
              }}
              className="mt-3 w-full rounded-full py-3 text-white active:scale-95"
              style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: 'linear-gradient(155deg,#c78bff,#8b45f5 60%)', boxShadow: '0 5px 0 #5a1fc0' }}
            >
              Main lagi
            </button>
          </div>
        )}
      </div>

      {lastPlaced && !done && (
        <div key={lastPlaced.id} className="bumi-pop mt-3 flex w-full max-w-[560px] items-center gap-3 rounded-[20px] bg-white/95 p-3">
          <span className="size-10 shrink-0 rounded-full" style={{ background: lastPlaced.color }} />
          <div>
            <div style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1.1 }}>
              {lastPlaced.name} <span className="text-[13px] text-[#8a7a9c]">· {lastPlaced.depth}</span>
            </div>
            <div className="text-[13px] leading-snug font-bold text-[#6b5d80]">{lastPlaced.fact}</div>
          </div>
        </div>
      )}

      {!done && (
        <div className="mt-4 grid w-full max-w-[560px] grid-cols-2 gap-2 sm:grid-cols-3">
          {chips.map((ly) => {
            const used = LAPISAN.findIndex((x) => x.id === ly.id) < step;
            return (
              <button
                key={ly.id}
                disabled={used}
                onClick={() => pick(ly.id)}
                className={`rounded-[18px] px-3 py-3 text-left transition-transform active:scale-95 disabled:opacity-30 ${wrong === ly.id ? 'bumi-shake' : ''}`}
                style={{ background: '#fff', boxShadow: '0 4px 0 rgba(0,0,0,.35)', fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}
              >
                {used ? '✓ ' : ''}
                {ly.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
