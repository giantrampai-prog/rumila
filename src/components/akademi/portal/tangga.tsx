"use client";

// Tangga jenjang bergambar: jalur mendaki dari taman (Early Years) lewat langit & laut (Primary 1–3)
// sampai angkasa (Primary 4–6). Tiap jenjang = medali berlambang pangkatnya; teks hanya label kecil.

import { useMemo } from "react";
import { LEVELS, levelIndex, type LevelId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { KOMPETENSI } from "@/lib/akademi/konten";
import "../akademi.css";

/** Lambang + warna medali per jenjang (urut PAUD → SD6). */
const LAMBANG: Record<LevelId, { ikon: string; warna: [string, string] }> = {
  PAUD: { ikon: "eco", warna: ["#7fdc6a", "#2f9e44"] },
  TKA: { ikon: "star", warna: ["#ffe066", "#f2a705"] },
  TKB: { ikon: "explore", warna: ["#ffb072", "#e8590c"] },
  SD1: { ikon: "flight", warna: ["#74c0fc", "#1c7ed6"] },
  SD2: { ikon: "sailing", warna: ["#63e6be", "#0c8599"] },
  SD3: { ikon: "shield", warna: ["#b197fc", "#6741d9"] },
  SD4: { ikon: "anchor", warna: ["#91a7ff", "#3b5bdb"] },
  SD5: { ikon: "rocket_launch", warna: ["#ff8fab", "#d6336c"] },
  SD6: { ikon: "workspace_premium", warna: ["#ffe46b", "#e67700"] },
};

const JARAK = 100; // px antar-jenjang
const ATAS = 104; // ruang judul
const BAWAH = 64;
const posX = (i: number) => 50 + 27 * Math.sin(i * 1.2 + 0.3); // persen lebar

const BINTANG = [
  [8, 3], [22, 7], [37, 2], [61, 5], [78, 9], [91, 4], [13, 14], [47, 12], [70, 16], [88, 19], [5, 24], [30, 21], [58, 25], [95, 28],
] as const;

export function TanggaJenjang({ level }: { level: LevelId }) {
  const ada = useMemo(() => new Set(KOMPETENSI.map((c) => c.level)), []);
  const idx = levelIndex(level);
  const n = LEVELS.length;
  const H = ATAS + BAWAH + JARAK * (n - 1);
  const titik = LEVELS.map((lv, i) => ({ lv, x: posX(i), y: H - BAWAH - i * JARAK }));

  const jalur = (sampai: number) =>
    titik
      .slice(0, sampai + 1)
      .map((t, i, a) => {
        if (i === 0) return `M ${t.x} ${t.y}`;
        const p = a[i - 1];
        const ym = (p.y + t.y) / 2;
        return `C ${p.x} ${ym} ${t.x} ${ym} ${t.x} ${t.y}`;
      })
      .join(" ");

  return (
    <section
      aria-label="Tangga jenjang"
      className="relative overflow-hidden rounded-[24px] shadow-[0_4px_0_rgba(11,37,69,.08)]"
      style={{
        height: H,
        background: "linear-gradient(to top, #c8f2b4 0%, #e6f9c9 14%, #bfe6ff 34%, #8ccaff 52%, #4566c4 68%, #1f2d6e 82%, #121a45 100%)",
      }}
    >
      {/* angkasa: bintang & planet */}
      {BINTANG.map(([x, y], i) => (
        <span key={i} aria-hidden className="absolute rounded-full bg-white" style={{ left: `${x}%`, top: `${y}%`, width: i % 3 ? 3 : 5, height: i % 3 ? 3 : 5, opacity: i % 2 ? 0.6 : 0.95 }} />
      ))}
      <span aria-hidden className="absolute rounded-full" style={{ right: "7%", top: 70, width: 46, height: 46, background: "radial-gradient(circle at 35% 35%, #ffd8a8, #f08c00)" }} />
      <span aria-hidden className="absolute rounded-full border-[3px] border-[#ffe8cc]/70" style={{ right: "calc(7% - 12px)", top: 88, width: 70, height: 14, transform: "rotate(-14deg)" }} />

      {/* langit: awan */}
      {[
        [6, 46, 70],
        [64, 40, 90],
        [30, 55, 60],
      ].map(([x, y, w], i) => (
        <span key={i} aria-hidden className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: w, height: w * 0.38 }}>
          <span className="absolute inset-x-0 bottom-0 h-[60%] rounded-full bg-white/85" />
          <span className="absolute bottom-[25%] left-[20%] size-[55%] rounded-full bg-white/85" style={{ height: w * 0.3, width: w * 0.3 }} />
          <span className="absolute bottom-[25%] left-[45%] rounded-full bg-white/85" style={{ height: w * 0.38, width: w * 0.38 }} />
        </span>
      ))}

      {/* taman: bukit */}
      <svg aria-hidden className="absolute inset-x-0 bottom-0 w-full" height={120} viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 22 Q 22 6 48 20 T 100 14 V40 H0 Z" fill="#94d982" />
        <path d="M0 30 Q 30 18 60 30 T 100 26 V40 H0 Z" fill="#69c25a" />
      </svg>

      {/* jalur */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none">
        <path d={jalur(n - 1)} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={12} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={jalur(n - 1)} fill="none" stroke="#ffffff" strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {idx > 0 && <path d={jalur(idx)} fill="none" stroke="#fdb724" strokeWidth={10} strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
      </svg>

      <h2 className="absolute left-4 top-3.5 text-white drop-shadow" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>
        Tangga jenjang
      </h2>

      {titik.map(({ lv, x, y }, i) => {
        const lewat = i < idx;
        const kini = i === idx;
        const segera = !ada.has(lv.id);
        const { ikon, warna } = LAMBANG[lv.id];
        const ukuran = kini ? 76 : 62;
        const redup = !lewat && !kini;
        return (
          <div
            key={lv.id}
            role="img"
            aria-label={`${lv.nama} · ${lv.lokal} · Pangkat ${lv.pangkat}${kini ? " · kamu di sini" : lewat ? " · selesai" : segera ? " · segera hadir" : " · terkunci"}`}
            title={`${lv.nama} · Pangkat ${lv.pangkat}`}
            className="absolute flex flex-col items-center"
            style={{ left: `${x}%`, top: y, transform: "translate(-50%, -50%)" }}
          >
            <span className="relative rounded-full bg-[#eef3fb]">
              {kini && (
                <span className="akademi-bounce absolute -top-9 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#0567c2] shadow-md">
                  <Icon name="flag" size={20} />
                </span>
              )}
              <span
                className={`flex items-center justify-center rounded-full border-4 text-white ${kini ? "akademi-denyut border-white" : "border-white/90"}`}
                style={{
                  width: ukuran,
                  height: ukuran,
                  background: `radial-gradient(circle at 32% 28%, ${warna[0]}, ${warna[1]})`,
                  boxShadow: `0 5px 0 ${warna[1]}aa, 0 8px 18px rgba(11,37,69,.25)`,
                  filter: redup ? `grayscale(${segera ? 0.85 : 0.55}) brightness(${segera ? 1.05 : 0.95})` : undefined,
                  opacity: segera ? 0.7 : 1,
                }}
              >
                <Icon name={ikon} size={kini ? 40 : 32} />
              </span>
              {(lewat || redup) && (
                <span
                  className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white"
                  style={lewat ? { background: "#fdb724", color: "#0b2545" } : { background: "#5b6b85", color: "#fff" }}
                >
                  <Icon name={lewat ? "check" : segera ? "hourglass_empty" : "lock"} size={14} />
                </span>
              )}
            </span>
            <span
              className="mt-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-black shadow-sm"
              style={kini ? { background: "#0567c2", color: "#fff" } : { background: "rgba(255,255,255,.9)", color: "#0b2545" }}
            >
              {lv.lokal}
            </span>
          </div>
        );
      })}
    </section>
  );
}
