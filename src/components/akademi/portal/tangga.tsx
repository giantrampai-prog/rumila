"use client";

// Tangga jenjang mini di kartu jenjang Peta: deret 9 medali berlambang pangkat (PAUD → SD 6) dengan garis progres.
// Lambang juga dipakai medali besar di kartu jenjang.

import { LEVELS, levelIndex, type LevelId } from "@akademi/schema";
import { Icon } from "@/components/ui";

/** Lambang + warna medali per jenjang (urut PAUD → SD6). */
export const LAMBANG: Record<LevelId, { ikon: string; warna: [string, string] }> = {
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

export function TanggaMini({ level }: { level: LevelId }) {
  const idx = levelIndex(level);
  const n = LEVELS.length;
  return (
    <ol className="relative flex items-center justify-between" aria-label="Tangga jenjang">
      <span aria-hidden className="absolute inset-x-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#fff0da]" />
      <span aria-hidden className="absolute left-3 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#fdb724]" style={{ width: `calc((100% - 24px) * ${idx / (n - 1)})` }} />
      {LEVELS.map((lv, i) => {
        const lewat = i < idx;
        const kini = i === idx;
        const { ikon, warna } = LAMBANG[lv.id];
        const ukuran = kini ? 38 : 28;
        return (
          <li
            key={lv.id}
            className="relative flex items-center justify-center rounded-full border-2 border-white text-white"
            aria-label={`${lv.nama} · ${lv.lokal} · Pangkat ${lv.pangkat}${kini ? " · kamu di sini" : lewat ? " · selesai" : " · terkunci"}`}
            title={`${lv.lokal} · ${lv.pangkat}`}
            style={{
              width: ukuran,
              height: ukuran,
              background: lewat || kini ? `radial-gradient(circle at 32% 28%, ${warna[0]}, ${warna[1]})` : "#e9e1d4",
              color: lewat || kini ? "#fff" : "#b3a691",
              boxShadow: kini ? `0 0 0 3px ${warna[0]}88, 0 3px 0 ${warna[1]}` : undefined,
            }}
          >
            <Icon name={ikon} size={kini ? 22 : 15} />
          </li>
        );
      })}
    </ol>
  );
}
