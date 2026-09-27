'use client';

// Sertifikat Coding Agam · Langkah — muncul setelah 100 level selesai. Digambar sebagai SVG (huruf sistem saja,
// supaya hasil simpan gambar sama dengan yang tampil) dan bisa disimpan sebagai PNG atau dibagikan.

import { useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { sfx } from '@/lib/sfx';
import { AgamFront } from './stage';

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '"Trebuchet MS", "Segoe UI", Arial, sans-serif';

const star = (cx: number, cy: number, r: number) => {
  const pts = [];
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rr = k % 2 ? r * 0.45 : r;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return pts.join(' ');
};

function CertSvg({ name, stars, date }: { name: string; stars: number; date: string }) {
  const nameSize = name.length > 22 ? 52 : name.length > 14 ? 64 : 76;
  return (
    <svg viewBox="0 0 1200 850" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full">
      <defs>
        <linearGradient id="cg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7d774" />
          <stop offset="0.5" stopColor="#e2a92b" />
          <stop offset="1" stopColor="#f3c552" />
        </linearGradient>
        <pattern id="cg-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.6" fill="#e9dcc2" />
        </pattern>
      </defs>
      <rect width="1200" height="850" fill="#fffaf0" />
      <rect width="1200" height="850" fill="url(#cg-dots)" />
      {/* bingkai ganda */}
      <rect x="28" y="28" width="1144" height="794" rx="26" fill="none" stroke="#2ec4a6" strokeWidth="14" />
      <rect x="56" y="56" width="1088" height="738" rx="16" fill="none" stroke="#e2a92b" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
      {/* keping puzzle di sudut */}
      {[
        [80, 80, '#3a86ff'],
        [1120, 80, '#8b5cf6'],
        [80, 770, '#8b5cf6'],
        [1120, 770, '#3a86ff'],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x="-26" y="-20" width="52" height="40" rx="9" fill={c as string} />
          <rect x="-10" y="-27" width="20" height="10" rx="5" fill={c as string} />
        </g>
      ))}
      <text x="600" y="120" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="700" fill="#178f78" letterSpacing="6">
        RINOYA ACADEMY · CODING AGAM
      </text>
      <text x="600" y="210" textAnchor="middle" fontFamily={SERIF} fontSize="92" fontWeight="700" fill="#23304a" letterSpacing="10">
        SERTIFIKAT
      </text>
      <text x="600" y="260" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="700" fill="#b07d12">
        Programmer Cilik · Langkah
      </text>
      <text x="600" y="340" textAnchor="middle" fontFamily={SANS} fontSize="28" fill="#5a6478">
        Dengan bangga diberikan kepada
      </text>
      <text x="600" y={345 + nameSize} textAnchor="middle" fontFamily={SERIF} fontSize={nameSize} fontWeight="700" fontStyle="italic" fill="#23304a">
        {name}
      </text>
      <line x1="300" y1={370 + nameSize} x2="900" y2={370 + nameSize} stroke="#e2a92b" strokeWidth="3" />
      <text x="600" y={425 + nameSize} textAnchor="middle" fontFamily={SANS} fontSize="27" fill="#3b4558">
        karena telah menyelesaikan 100 level Langkah
      </text>
      <text x="600" y={463 + nameSize} textAnchor="middle" fontFamily={SANS} fontSize="27" fill="#3b4558">
        dan menyusun perintah seperti seorang programmer hebat.
      </text>
      {/* bintang terkumpul */}
      <g transform={`translate(600 ${525 + nameSize})`}>
        <polygon points={star(-150, 0, 22)} fill="#f2b705" />
        <text x="-118" y="10" fontFamily={SANS} fontSize="28" fontWeight="700" fill="#23304a">
          {stars} dari 300 bintang terkumpul
        </text>
      </g>
      {/* tanggal */}
      <text x="250" y="735" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="700" fill="#23304a">
        {date}
      </text>
      <line x1="140" y1="752" x2="360" y2="752" stroke="#23304a" strokeWidth="2" />
      <text x="250" y="782" textAnchor="middle" fontFamily={SANS} fontSize="20" fill="#5a6478">
        Tanggal
      </text>
      {/* segel emas */}
      <g transform="translate(600 686)">
        <path d="M-34 30 L-48 92 L-20 76 L-6 100 L4 40 Z M34 30 L48 92 L20 76 L6 100 L-4 40 Z" fill="#d9534f" />
        <circle r="62" fill="url(#cg-gold)" stroke="#b07d12" strokeWidth="4" />
        <circle r="50" fill="none" stroke="#fff6d6" strokeWidth="3" strokeDasharray="4 6" />
        <text y="14" textAnchor="middle" fontFamily={SERIF} fontSize="44" fontWeight="700" fill="#7a5410">
          100
        </text>
        <text y="38" textAnchor="middle" fontFamily={SANS} fontSize="13" fontWeight="700" fill="#7a5410" letterSpacing="2">
          LEVEL
        </text>
      </g>
      {/* tanda tangan Agam */}
      <g transform="translate(900 628)">
        <g transform="translate(-52 -22) scale(0.86)">
          <AgamFront size={120} wave={false} />
        </g>
      </g>
      <path d="M840 745 q20 -26 38 0 t40 -4 q14 -18 30 2" fill="none" stroke="#178f78" strokeWidth="3" strokeLinecap="round" />
      <line x1="840" y1="752" x2="1060" y2="752" stroke="#23304a" strokeWidth="2" />
      <text x="950" y="782" textAnchor="middle" fontFamily={SANS} fontSize="20" fill="#5a6478">
        Agam, Robot Guru Coding
      </text>
    </svg>
  );
}

export function Certificate({ name, stars, date, onClose }: { name: string; stars: number; date: string; onClose: () => void }) {
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
      const file = new File([blob], `Sertifikat-Coding-Agam-${name.replace(/\s+/g, '-')}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Sertifikat Coding Agam' }).catch(() => {});
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
      <div ref={box} className="koding-cert w-full max-w-[900px] overflow-hidden rounded-[18px]">
        <CertSvg name={name} stars={stars} date={date} />
      </div>
      <div className="flex w-full max-w-[520px] gap-2">
        <button onClick={onClose} className="koding-round flex-1 rounded-[18px] py-3.5 font-extrabold active:translate-y-0.5">
          Kembali
        </button>
        <button onClick={save} disabled={busy} className="flex flex-[1.4] items-center justify-center gap-2 rounded-[18px] bg-[#22b573] py-3.5 font-extrabold text-white shadow-[0_5px_0_#16804f] active:translate-y-1 disabled:opacity-60">
          <Icon name="download" size={22} /> Simpan sertifikat
        </button>
      </div>
    </div>
  );
}
