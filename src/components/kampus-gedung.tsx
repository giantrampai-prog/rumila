// Ilustrasi gedung Kampus RINOYA (SVG kode, tanpa gambar). Semua gedung berdiri di garis tanah bawah
// viewBox, supaya bisa diletakkan berjajar di atas rumput peta kampus.

import type { GedungId } from "@/lib/kampus";

type Props = { className?: string };

/** Gedung Utama = Ruang Kelas: aula bertiang, menara jam, bendera Merah Putih. */
export function GedungUtama({ className }: Props) {
  return (
    <svg viewBox="0 0 240 172" className={className} aria-hidden>
      {/* pohon kiri & kanan */}
      <rect x="10" y="134" width="6" height="38" rx="3" fill="#8a5a2b" />
      <circle cx="13" cy="126" r="16" fill="#1fbf62" />
      <circle cx="21" cy="116" r="10" fill="#6fe39a" />
      <rect x="224" y="134" width="6" height="38" rx="3" fill="#8a5a2b" />
      <circle cx="227" cy="126" r="16" fill="#1fbf62" />
      <circle cx="219" cy="116" r="10" fill="#6fe39a" />
      {/* bendera */}
      <rect x="119" y="2" width="2.5" height="30" rx="1" fill="#5b6b85" />
      <g className="kampus-bendera">
        <rect x="121.5" y="3" width="20" height="6.5" fill="#e8232f" />
        <rect x="121.5" y="9.5" width="20" height="6.5" fill="#ffffff" stroke="#f0e4d2" strokeWidth=".6" />
      </g>
      {/* menara jam */}
      <polygon points="97,46 120,26 143,46" fill="#0567c2" />
      <rect x="101" y="45" width="38" height="52" fill="#fff3df" />
      <circle cx="120" cy="66" r="12" fill="#ffffff" stroke="#0b2545" strokeWidth="2.5" />
      <line x1="120" y1="66" x2="120" y2="58" stroke="#0b2545" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="120" y1="66" x2="126" y2="68" stroke="#fd861d" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="120" cy="66" r="1.8" fill="#0b2545" />
      {/* atap aula */}
      <polygon points="18,98 120,74 222,98" fill="#0786eb" />
      <rect x="18" y="96" width="204" height="10" rx="3" fill="#0567c2" />
      <text x="120" y="93" textAnchor="middle" fontFamily="var(--ff-baloo), system-ui" fontWeight="800" fontSize="10" fill="#ffffff" letterSpacing="1.5">
        RINOYA
      </text>
      {/* badan aula */}
      <rect x="28" y="106" width="184" height="58" fill="#fff3df" />
      {[40, 66, 158, 184].map((x) => (
        <g key={x}>
          <rect x={x} y="114" width="16" height="22" rx="8" fill="#9fd3ff" />
          <rect x={x} y="124" width="16" height="2" fill="#ffffff" opacity=".8" />
          <rect x={x} y="142" width="16" height="16" rx="3" fill="#9fd3ff" />
        </g>
      ))}
      {[32, 58, 84, 148, 174, 200].map((x) => (
        <rect key={x} x={x} y="108" width="6" height="56" rx="2" fill="#ffffff" stroke="#f0e4d2" strokeWidth="1" />
      ))}
      {/* pintu utama */}
      <path d="M104 164 V132 a16 16 0 0 1 32 0 V164 Z" fill="#135385" />
      <line x1="120" y1="118" x2="120" y2="164" stroke="#0b2545" strokeWidth="1.5" />
      <circle cx="115" cy="146" r="1.8" fill="#fdb724" />
      <circle cx="125" cy="146" r="1.8" fill="#fdb724" />
      {/* tangga */}
      <rect x="96" y="164" width="48" height="4" fill="#efe1c8" />
      <rect x="90" y="168" width="60" height="4" fill="#e3d2b4" />
    </svg>
  );
}

/** Laboratorium 3D: observatorium berkubah dengan teleskop. */
function GedungLab({ className }: Props) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden>
      <path d="M118 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#ffe46b" className="kampus-kelip" />
      <path d="M138 40 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5 Z" fill="#ffe46b" className="kampus-kelip kampus-kelip-2" />
      <circle cx="26" cy="30" r="2" fill="#ffe46b" className="kampus-kelip kampus-kelip-2" />
      {/* teleskop */}
      <rect x="86" y="18" width="10" height="38" rx="4" fill="#9a93ff" transform="rotate(38 91 56)" />
      <rect x="84" y="14" width="14" height="8" rx="3" fill="#5b4bff" transform="rotate(38 91 56)" />
      {/* kubah */}
      <path d="M28 80 A52 52 0 0 1 132 80 Z" fill="#2d2f86" />
      <path d="M44 80 A40 46 0 0 1 80 30 A52 52 0 0 0 36 80 Z" fill="#4a4fc0" opacity=".7" />
      <rect x="73" y="30" width="14" height="50" rx="3" fill="#16174f" />
      <rect x="24" y="78" width="112" height="8" rx="3" fill="#16174f" />
      {/* badan */}
      <rect x="30" y="86" width="100" height="54" fill="#e7e9fa" />
      <circle cx="50" cy="104" r="8" fill="#ffe46b" stroke="#5360b3" strokeWidth="2.5" className="kampus-lampu" />
      <circle cx="110" cy="104" r="8" fill="#ffe46b" stroke="#5360b3" strokeWidth="2.5" className="kampus-lampu" />
      <path d="M68 140 V116 a12 12 0 0 1 24 0 V140 Z" fill="#2d2f86" />
      <rect x="62" y="92" width="36" height="12" rx="4" fill="#ffffff" />
      <text x="80" y="101" textAnchor="middle" fontFamily="var(--ff-baloo), system-ui" fontWeight="800" fontSize="9" fill="#2d2f86">
        3D
      </text>
    </svg>
  );
}

/** Lab Komputer: gedung kaca modern dengan antena parabola. */
function GedungKomputer({ className }: Props) {
  const kaca = [
    [38, 64, 1], [62, 64, 0], [86, 64, 1], [110, 64, 0],
    [38, 86, 0], [62, 86, 1], [86, 86, 0], [110, 86, 1],
  ] as const;
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden>
      {/* antena */}
      <rect x="111" y="26" width="3" height="22" fill="#6421c9" />
      <path d="M100 30 a14 14 0 0 0 26 -8 Z" fill="#c78bff" stroke="#6421c9" strokeWidth="2" />
      <circle cx="113" cy="24" r="2.5" fill="#ff4fa3" className="kampus-kelip" />
      <rect x="44" y="34" width="3" height="16" fill="#6421c9" />
      <circle cx="45.5" cy="32" r="3.5" fill="#86d11a" className="kampus-kelip kampus-kelip-2" />
      {/* badan */}
      <rect x="26" y="46" width="108" height="10" rx="4" fill="#6421c9" />
      <rect x="30" y="54" width="100" height="86" fill="#8b45f5" />
      {kaca.map(([x, y, nyala]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="16" height="16" rx="3" fill={nyala ? "#fff7c2" : "#e9d9ff"} className={nyala ? "kampus-lampu" : undefined} />
      ))}
      {/* layar kode */}
      <rect x="42" y="108" width="34" height="22" rx="4" fill="#16174f" />
      <text x="59" y="123" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700" fontSize="10" fill="#5ce8d6">
        {"</>"}
      </text>
      {/* pintu kaca */}
      <rect x="88" y="108" width="30" height="32" rx="3" fill="#c78bff" />
      <line x1="103" y1="108" x2="103" y2="140" stroke="#6421c9" strokeWidth="2" />
      <rect x="84" y="104" width="38" height="5" rx="2" fill="#6421c9" />
    </svg>
  );
}

/** Taman Bermain: perosotan, ayunan, dan bak pasir. */
function GedungTaman({ className }: Props) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden>
      {/* pohon */}
      <rect x="134" y="96" width="6" height="44" rx="3" fill="#8a5a2b" />
      <circle cx="137" cy="88" r="17" fill="#1fbf62" />
      <circle cx="129" cy="78" r="10" fill="#6fe39a" />
      {/* ayunan */}
      <line x1="76" y1="60" x2="64" y2="140" stroke="#c96510" strokeWidth="4" strokeLinecap="round" />
      <line x1="76" y1="60" x2="88" y2="140" stroke="#c96510" strokeWidth="4" strokeLinecap="round" />
      <line x1="122" y1="60" x2="110" y2="140" stroke="#c96510" strokeWidth="4" strokeLinecap="round" />
      <line x1="122" y1="60" x2="134" y2="140" stroke="#c96510" strokeWidth="4" strokeLinecap="round" />
      <rect x="72" y="56" width="54" height="7" rx="3.5" fill="#fd861d" />
      <g className="kampus-ayun">
        <line x1="92" y1="62" x2="92" y2="108" stroke="#5b6b85" strokeWidth="1.6" />
        <line x1="104" y1="62" x2="104" y2="108" stroke="#5b6b85" strokeWidth="1.6" />
        <rect x="88" y="106" width="20" height="5" rx="2.5" fill="#ff4757" />
      </g>
      {/* perosotan */}
      <line x1="14" y1="76" x2="14" y2="140" stroke="#0567c2" strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="76" x2="34" y2="140" stroke="#0567c2" strokeWidth="4" strokeLinecap="round" />
      {[92, 106, 120].map((y) => (
        <line key={y} x1="14" y1={y} x2="34" y2={y} stroke="#0567c2" strokeWidth="3" />
      ))}
      <rect x="10" y="72" width="30" height="8" rx="3" fill="#0786eb" />
      <path d="M36 74 C52 76 52 120 74 136 L74 140 L64 140 C46 124 46 88 36 84 Z" fill="#ffbe0b" />
      {/* bak pasir & bola */}
      <rect x="38" y="128" width="30" height="12" rx="3" fill="#ffe46b" stroke="#d99400" strokeWidth="2" />
      <circle cx="120" cy="134" r="6" fill="#ff4fa3" />
      <path d="M114 134 h12" stroke="#ffffff" strokeWidth="1.6" />
    </svg>
  );
}

/** Musala: kubah hijau dengan bulan sabit dan menara. */
function GedungMusala({ className }: Props) {
  return (
    <svg viewBox="0 0 160 140" className={className} aria-hidden>
      {/* menara */}
      <polygon points="122,36 130,14 138,36" fill="#12904a" />
      <circle cx="130" cy="11" r="2.5" fill="#fdb724" />
      <rect x="123" y="36" width="14" height="104" fill="#fffaf0" stroke="#e7dcc6" strokeWidth="1" />
      <rect x="119" y="54" width="22" height="6" rx="2" fill="#1fbf62" />
      <path d="M127 76 v-6 a3 3 0 0 1 6 0 v6 Z" fill="#0a8a7c" />
      <path d="M127 100 v-6 a3 3 0 0 1 6 0 v6 Z" fill="#0a8a7c" />
      {/* kubah */}
      <rect x="66" y="22" width="2" height="12" fill="#d99400" />
      <circle cx="67" cy="20" r="6" fill="#fdb724" />
      <circle cx="69.5" cy="18.5" r="5" fill="#12904a" />
      <path d="M30 84 C30 52 48 38 67 34 C86 38 104 52 104 84 Z" fill="#12904a" />
      <path d="M40 84 C40 58 52 44 62 38 C50 48 46 64 48 84 Z" fill="#6fe39a" opacity=".55" />
      {/* badan */}
      <rect x="22" y="82" width="90" height="8" rx="3" fill="#1fbf62" />
      <rect x="26" y="90" width="82" height="50" fill="#fffaf0" />
      <path d="M55 140 V114 a12 12 0 0 1 24 0 V140 Z" fill="#0a8a7c" />
      <path d="M34 112 v-10 a6 6 0 0 1 12 0 v10 Z" fill="#5ce8d6" />
      <path d="M88 112 v-10 a6 6 0 0 1 12 0 v10 Z" fill="#5ce8d6" />
    </svg>
  );
}

const PETA: Record<GedungId, (p: Props) => React.ReactElement> = {
  lab: GedungLab,
  komputer: GedungKomputer,
  taman: GedungTaman,
  musala: GedungMusala,
};

export function IlustrasiGedung({ id, className }: { id: GedungId; className?: string }) {
  const G = PETA[id];
  return <G className={className} />;
}
