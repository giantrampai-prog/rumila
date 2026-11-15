// QR dibuat di aplikasi (pustaka qrcode, tanpa layanan luar): tetap tampil saat offline dan saat dicetak.

import QRCode from "qrcode";

export function KodeQR({ teks, ukuran = 96, warna = "#14233f", className = "" }: { teks: string; ukuran?: number | string; warna?: string; className?: string }) {
  const qr = QRCode.create(teks, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const d = qr.modules.data;
  let jalur = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (d[y * n + x]) jalur += `M${x} ${y}h1v1h-1z`;
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={ukuran} height={ukuran} className={className} role="img" aria-label={`QR ${teks}`} shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      <path d={jalur} fill={warna} />
    </svg>
  );
}
