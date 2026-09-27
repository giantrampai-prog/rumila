'use client';

// Sertifikat Coding Agam (Langkah, Pola, …). Sebelum 100 coding selesai hanya bisa dilihat sebagai pratinjau bercap
// "CONTOH" (tanpa tombol simpan); setelah selesai tampil bersih dan bisa disimpan. Gaya sertifikat resmi: kertas gading,
// bingkai navy + pita guilloche emas, lambang laurel, segel emas bergerigi, nomor sertifikat. Digambar sebagai SVG dan bisa
// disimpan sebagai PNG atau dibagikan.

import { useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { sfx } from '@/lib/sfx';
import { AgamFront } from './stage';

// Huruf sistem saja (supaya hasil simpan PNG sama dengan yang tampil). Di Apple tampil Didot + Snell Roundhand; di perangkat
// lain jatuh ke serif biasa.
const DISPLAY = 'Didot, "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, "Times New Roman", serif';
const SERIF = 'Baskerville, "Baskerville Old Face", Georgia, "Times New Roman", serif';
const SCRIPT = '"Snell Roundhand", "Apple Chancery", "Great Vibes", "Brush Script MT", Georgia, serif';
const SANS = '"Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", Arial, sans-serif';

const NAVY = '#14233f';
const INK = '#3a4356';
const MUTED = '#7a7466';
const GOLD = '#b8892b';

const W = 1200;
const H = 850;

const polyStar = (cx: number, cy: number, r: number, inner: number, n: number) => {
  const pts = [];
  for (let k = 0; k < n * 2; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / n;
    const rr = k % 2 ? inner : r;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return pts.join(' ');
};

// pita guilloche: tiga gelombang sinus yang saling menjalin di sepanjang satu sisi bingkai
const wave = (x1: number, y1: number, x2: number, y2: number, phase: number, amp = 6, period = 22) => {
  const horiz = y1 === y2;
  const len = horiz ? x2 - x1 : y2 - y1;
  const pts: string[] = [];
  for (let t = 0; t <= len; t += 2) {
    const o = Math.sin((t / period) * Math.PI * 2 + phase) * amp;
    pts.push(horiz ? `${(x1 + t).toFixed(1)},${(y1 + o).toFixed(1)}` : `${(x1 + o).toFixed(1)},${(y1 + t).toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
};

// nomor sertifikat stabil dari nama + tanggal
const serialOf = (game: string, name: string, date: string) => {
  let h = 2166136261;
  for (const ch of game + '|' + name + '|' + date) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const n = (h >>> 0).toString(36).toUpperCase().padStart(6, '0').slice(-6);
  const year = date.match(/\d{4}/)?.[0] ?? new Date().getFullYear();
  return `RA/CA-${game[0].toUpperCase()}/${year}/${n}`;
};

// hiasan sudut (digambar untuk kiri-atas, dicerminkan untuk sudut lain)
function Corner({ x, y, sx, sy }: { x: number; y: number; sx: number; sy: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`} fill="none" stroke="url(#cg-gold)" strokeLinecap="round">
      <path d="M0 70 L0 0 L70 0" strokeWidth="2.4" />
      <path d="M10 56 L10 10 L56 10" strokeWidth="1" />
      <path d="M10 10 C 30 14, 38 30, 26 38 C 16 44, 8 32, 18 26" strokeWidth="1.6" />
      <path d="M70 0 C 86 0, 92 10, 104 6 M0 70 C 0 86, 10 92, 6 104" strokeWidth="1.2" />
      <polygon points="0,-7 7,0 0,7 -7,0" fill="url(#cg-gold)" stroke="none" />
      <circle cx="10" cy="10" r="2.6" fill="url(#cg-gold)" stroke="none" />
    </g>
  );
}

// ranting laurel di sisi kiri lambang (dicerminkan untuk kanan)
function Laurel({ side }: { side: 1 | -1 }) {
  const leaves = [];
  for (let i = 0; i < 7; i++) {
    const a = ((110 + i * 19) * Math.PI) / 180;
    const x = Math.cos(a) * 44;
    const y = Math.sin(a) * 44;
    const rot = (a * 180) / Math.PI + 90;
    leaves.push(<ellipse key={i} cx={x} cy={y} rx="4.2" ry="10" transform={`rotate(${rot + 28} ${x} ${y})`} fill="url(#cg-gold)" />);
  }
  return <g transform={`scale(${side} 1)`}>{leaves}</g>;
}

function CertSvg({ game, name, stars, date, locked }: { game: string; name: string; stars: number; date: string; locked?: boolean }) {
  const nameSize = name.length > 24 ? 60 : name.length > 16 ? 74 : 92;
  const serial = locked ? `RA/CA-${game[0].toUpperCase()}/—/——————` : serialOf(game, name, date);
  const band = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
  // tepi pita guilloche
  const B0 = 40;
  const B1 = 60;
  const mid = (B0 + B1) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full">
      <defs>
        <linearGradient id="cg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8761d" />
          <stop offset="0.35" stopColor="#e9c46a" />
          <stop offset="0.55" stopColor="#f7e3a1" />
          <stop offset="0.75" stopColor="#c9962f" />
          <stop offset="1" stopColor="#9a6a17" />
        </linearGradient>
        <radialGradient id="cg-seal" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset="0.45" stopColor="#e2b04a" />
          <stop offset="1" stopColor="#9a6a17" />
        </radialGradient>
        <linearGradient id="cg-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdfaf2" />
          <stop offset="1" stopColor="#f5eddb" />
        </linearGradient>
        <radialGradient id="cg-vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#c9a86a" stopOpacity="0.22" />
        </radialGradient>
        <path id="cg-ring" d="M-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
      </defs>

      {/* kertas */}
      <rect width={W} height={H} fill="url(#cg-paper)" />
      {/* roset guilloche samar di tengah */}
      <g transform="translate(600 440)" fill="none" stroke="#c9a44c" strokeOpacity="0.1" strokeWidth="1">
        {Array.from({ length: 36 }, (_, i) => (
          <ellipse key={i} rx="300" ry="118" transform={`rotate(${i * 5})`} />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <ellipse key={`b${i}`} rx="150" ry="64" transform={`rotate(${i * 7.5})`} />
        ))}
      </g>
      <rect width={W} height={H} fill="url(#cg-vignette)" />

      {/* bingkai: pita navy luar, pita guilloche emas, garis tipis dalam */}
      <rect x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke={NAVY} strokeWidth="12" />
      <rect x={B0} y={B0} width={W - B0 * 2} height={H - B0 * 2} fill="none" stroke="url(#cg-gold)" strokeWidth="2" />
      <rect x={B1} y={B1} width={W - B1 * 2} height={H - B1 * 2} fill="none" stroke="url(#cg-gold)" strokeWidth="2" />
      <g fill="none" stroke="url(#cg-gold)" strokeWidth="1" strokeOpacity="0.85">
        {band.map((ph, i) => (
          <g key={i}>
            <path d={wave(B1, mid, W - B1, mid, ph)} />
            <path d={wave(B1, H - mid, W - B1, H - mid, ph)} />
            <path d={wave(mid, B1, mid, H - B1, ph)} />
            <path d={wave(W - mid, B1, W - mid, H - B1, ph)} />
          </g>
        ))}
      </g>
      {/* kotak sudut pita */}
      {[
        [B0, B0],
        [W - B1, B0],
        [B0, H - B1],
        [W - B1, H - B1],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={B1 - B0} height={B1 - B0} fill={NAVY} stroke="url(#cg-gold)" strokeWidth="2" />
          <polygon points={polyStar(x + 10, y + 10, 7, 3, 4)} fill="url(#cg-gold)" />
        </g>
      ))}
      <rect x="74" y="74" width={W - 148} height={H - 148} fill="none" stroke={NAVY} strokeOpacity="0.35" strokeWidth="1" />
      <Corner x={84} y={84} sx={1} sy={1} />
      <Corner x={W - 84} y={84} sx={-1} sy={1} />
      <Corner x={84} y={H - 84} sx={1} sy={-1} />
      <Corner x={W - 84} y={H - 84} sx={-1} sy={-1} />

      {/* lambang: laurel + lencana </> */}
      <g transform="translate(600 132)">
        <Laurel side={1} />
        <Laurel side={-1} />
        <circle r="30" fill={NAVY} stroke="url(#cg-gold)" strokeWidth="3" />
        <circle r="24" fill="none" stroke="url(#cg-gold)" strokeWidth="0.8" />
        <text y="7" textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" fill="url(#cg-gold)">
          {'</>'}
        </text>
      </g>

      <text x="600" y="204" textAnchor="middle" fontFamily={SANS} fontSize="17" fontWeight="600" fill={NAVY} letterSpacing="9">
        RINOYA ACADEMY
      </text>
      <text x="600" y="286" textAnchor="middle" fontFamily={DISPLAY} fontSize="80" fontWeight="700" fill={NAVY} letterSpacing="16">
        SERTIFIKAT
      </text>
      {/* sub-judul diapit garis & belah ketupat */}
      <g>
        <line x1="330" y1="318" x2="428" y2="318" stroke="url(#cg-gold)" strokeWidth="1.5" />
        <polygon points="436,318 442,312 448,318 442,324" fill="url(#cg-gold)" />
        <text x="600" y="325" textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" fill={GOLD} letterSpacing="7">
          PROGRAMMER CILIK
        </text>
        <polygon points="752,318 758,312 764,318 758,324" fill="url(#cg-gold)" />
        <line x1="772" y1="318" x2="870" y2="318" stroke="url(#cg-gold)" strokeWidth="1.5" />
      </g>

      <text x="600" y="380" textAnchor="middle" fontFamily={SERIF} fontSize="22" fontStyle="italic" fill={MUTED}>
        Dengan bangga diberikan kepada
      </text>
      <text x="600" y="466" textAnchor="middle" fontFamily={SCRIPT} fontSize={nameSize} fill={NAVY}>
        {name}
      </text>
      {/* garis nama dengan ujung meruncing */}
      <g transform="translate(600 494)">
        <path d="M-300 0 Q -150 -2.2 0 -2.2 Q 150 -2.2 300 0 Q 150 2.2 0 2.2 Q -150 2.2 -300 0 Z" fill="url(#cg-gold)" />
        <polygon points="0,-7 7,0 0,7 -7,0" fill="url(#cg-gold)" />
      </g>

      <text x="600" y="532" textAnchor="middle" fontFamily={SERIF} fontSize="21" fill={INK}>
        atas keberhasilannya menyelesaikan seluruh program {game} dari Coding Agam
      </text>
      <text x="600" y="561" textAnchor="middle" fontFamily={SERIF} fontSize="21" fill={INK}>
        dengan ketekunan, ketelitian, dan cara berpikir seorang programmer.
      </text>

      {/* capaian */}
      <g fontFamily={SANS} textAnchor="middle">
        {[
          [430, '10', 'LEVEL'],
          [600, '100', 'CODING'],
          [770, `${stars}/300`, 'BINTANG'],
        ].map(([x, v, l]) => (
          <g key={l as string}>
            <text x={x as number} y="602" fontFamily={DISPLAY} fontSize="26" fontWeight="700" fill={NAVY}>
              {v}
            </text>
            <text x={x as number} y="620" fontSize="11" fontWeight="700" fill={GOLD} letterSpacing="3">
              {l}
            </text>
          </g>
        ))}
        <line x1="515" y1="584" x2="515" y2="620" stroke="url(#cg-gold)" strokeWidth="1" />
        <line x1="685" y1="584" x2="685" y2="620" stroke="url(#cg-gold)" strokeWidth="1" />
      </g>

      {/* tanggal terbit */}
      <g textAnchor="middle">
        <text x="290" y="712" fontFamily={SERIF} fontSize="22" fill={NAVY}>
          {date}
        </text>
        <line x1="180" y1="726" x2="400" y2="726" stroke={NAVY} strokeWidth="1.2" />
        <text x="290" y="748" fontFamily={SANS} fontSize="12" fontWeight="700" fill={MUTED} letterSpacing="3">
          TANGGAL TERBIT
        </text>
      </g>

      {/* segel emas bergerigi dengan pita */}
      <g transform="translate(600 706)">
        <path d="M-30 40 L-52 118 L-30 104 L-16 126 L0 52 Z" fill={NAVY} />
        <path d="M30 40 L52 118 L30 104 L16 126 L0 52 Z" fill="#1f3560" />
        <path d="M-30 40 L-44 92 M30 40 L44 92" stroke="url(#cg-gold)" strokeWidth="2" />
        <polygon points={polyStar(0, 0, 70, 63, 36)} fill="url(#cg-seal)" stroke="#8a5d12" strokeWidth="1" />
        <circle r="57" fill="none" stroke="#8a5d12" strokeWidth="1.5" />
        <circle r="37" fill="url(#cg-gold)" stroke="#8a5d12" strokeWidth="1.5" />
        <text fontFamily={SANS} fontSize="9.5" fontWeight="700" fill="#6b470c" >
          <textPath href="#cg-ring" textLength="292" lengthAdjust="spacing">
            {`RINOYA ACADEMY ★ CODING AGAM ★ ${game.toUpperCase()} ★`}
          </textPath>
        </text>
        <text y="8" textAnchor="middle" fontFamily={DISPLAY} fontSize="30" fontWeight="700" fill="#5a3b08">
          100
        </text>
        <text y="22" textAnchor="middle" fontFamily={SANS} fontSize="8" fontWeight="700" fill="#5a3b08" letterSpacing="2">
          CODING
        </text>
      </g>

      {/* tanda tangan Agam */}
      <g textAnchor="middle">
        <g transform="translate(1000 648)">
          <AgamFront size={58} wave={false} />
        </g>
        <text x="900" y="714" fontFamily={SCRIPT} fontSize="40" fill={NAVY}>
          Agam
        </text>
        <line x1="790" y1="726" x2="1010" y2="726" stroke={NAVY} strokeWidth="1.2" />
        <text x="900" y="748" fontFamily={SANS} fontSize="12" fontWeight="700" fill={MUTED} letterSpacing="3">
          ROBOT GURU CODING
        </text>
      </g>

      <text x="290" y="768" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fontWeight="600" fill={MUTED} letterSpacing="1.5">
        No. {serial}
      </text>

      {locked && (
        // cap pratinjau: tulisan samar berulang + stempel tinta
        <g pointerEvents="none">
          <g transform="rotate(-24 600 425)" fill="#b3261e" fillOpacity="0.06" fontFamily={SANS} fontWeight="800" fontSize="60" letterSpacing="10">
            {[-2, -1, 0, 1, 2, 3].map((r) =>
              [-1, 0, 1].map((c) => (
                <text key={`${r}-${c}`} x={600 + c * 560 + (r % 2) * 280} y={425 + r * 190} textAnchor="middle">
                  CONTOH
                </text>
              )),
            )}
          </g>
          <g transform="rotate(-7 600 566)" opacity="0.8">
            <rect x="400" y="518" width="400" height="96" rx="10" fill="#fff8f0" fillOpacity="0.6" stroke="#b3261e" strokeWidth="4.5" />
            <rect x="411" y="529" width="378" height="74" rx="6" fill="none" stroke="#b3261e" strokeWidth="1.5" />
            <text x="600" y="578" textAnchor="middle" fontFamily={SANS} fontSize="44" fontWeight="800" fill="#b3261e" letterSpacing="12">
              CONTOH
            </text>
            <text x="600" y="597" textAnchor="middle" fontFamily={SANS} fontSize="11.5" fontWeight="700" fill="#b3261e" letterSpacing="3">
              PRATINJAU · SELESAIKAN 100 CODING
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

export function Certificate({ game, name, stars, date, onClose, remaining = 0 }: { game: string; name: string; stars: number; date: string; onClose: () => void; remaining?: number }) {
  const locked = remaining > 0;
  const box = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const toPng = async (): Promise<Blob | null> => {
    const svg = box.current?.querySelector('svg');
    if (!svg) return null;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 2400;
    c.height = 1700;
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return new Promise((r) => c.toBlob(r, 'image/png'));
  };

  const save = async () => {
    setBusy(true);
    sfx.pick();
    try {
      const blob = await toPng();
      if (!blob) return;
      const file = new File([blob], `Sertifikat-Coding-Agam-${game}-${name.replace(/\s+/g, '-')}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Sertifikat Coding Agam · ${game}` }).catch(() => {});
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="koding-paper fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 overflow-y-auto p-4">
      <div ref={box} className="koding-cert w-full max-w-[1000px] overflow-hidden rounded-[6px]">
        <CertSvg game={game} name={name} stars={stars} date={date} locked={locked} />
      </div>
      {locked && (
        <p className="koding-say max-w-[560px] rounded-[18px] px-4 py-3 text-center text-[15px] font-bold">
          Ini contoh sertifikatmu. Tinggal <b>{remaining} coding</b> lagi, lalu sertifikat asli tanpa cap bisa disimpan!
        </p>
      )}
      <div className="flex w-full max-w-[520px] gap-2">
        <button onClick={onClose} className="koding-round flex-1 rounded-[18px] py-3.5 font-extrabold active:translate-y-0.5">
          Kembali
        </button>
        {!locked && (
        <button onClick={save} disabled={busy} className="flex flex-[1.4] items-center justify-center gap-2 rounded-[18px] bg-[#22b573] py-3.5 font-extrabold text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60">
          <Icon name="download" size={22} /> Simpan sertifikat
        </button>
        )}
      </div>
    </div>
  );
}
