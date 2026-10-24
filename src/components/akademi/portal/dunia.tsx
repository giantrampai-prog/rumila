"use client";

// Tab Dunia: enam dunia 3D rumila yang sudah ada, dipakai sebagai jelajah bebas (mekanik "cari & kumpulkan").
// Quest per dunia menyusul (lihat docs/akademi/migrasi-menu-lama.md); untuk sekarang cukup pintu masuk yang jelas.

import { AppIcon } from "@/components/launcher";
import { useOpenTool } from "@/components/shell";
import { Icon } from "@/components/ui";
import { PLAY, getFolder, type Tool } from "@/lib/catalog";
import { can, type Member } from "@/lib/store";
import { BALOO } from "@/components/launcher";
import { INK } from "./bersama";

/** pelajaran yang nanti memakai dunia ini sebagai latar quest */
const PELAJARAN: Record<string, string> = {
  angkasa6: "Sains · Angkasa",
  angkasa3: "Sains · Roket",
  edukasi6: "Sains · Tubuh",
  "edukasi-buah": "Matematika & Sains · Kebun",
  "petualangan-laut": "Sains · Laut",
  "petualangan-bumi": "Sains · Bumi",
};

export function Dunia({ me }: { me: Member }) {
  const openTool = useOpenTool();
  const folder = getFolder("angkasa");
  const dunia: Tool[] = folder?.items ?? [];
  const boleh = can(me, "angkasa");
  const [l, m, d] = PLAY.space;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-[24px] p-4 text-white" style={{ background: `linear-gradient(155deg, ${l}, ${m} 65%)`, boxShadow: `0 5px 0 ${d}` }}>
        <div aria-hidden className="absolute -right-10 -bottom-14 size-40 rounded-full bg-white/15" />
        <div style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>Jelajah bebas</div>
        <p className="mt-1 text-[13px] font-extrabold text-white/85">Enam dunia 3D untuk dijelajahi. Temuanmu di sini nanti ikut masuk ke Rapor.</p>
      </div>

      {!boleh && (
        <p className="rounded-[18px] bg-white px-4 py-3 text-[14px] font-bold text-ink-3 shadow-[0_4px_0_rgba(43,29,78,.08)]">
          Dunia 3D belum dibuka untukmu. Minta Ayah atau Ibu membukanya di pengaturan profil.
        </p>
      )}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {dunia.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => openTool(t)}
              disabled={!boleh}
              className="flex w-full items-center gap-3 rounded-[22px] bg-white p-3 text-left shadow-[0_4px_0_rgba(43,29,78,.08)] transition-transform active:scale-[.98] disabled:opacity-50"
            >
              <AppIcon t={t} size={60} theme="playful" />
              <span className="min-w-0 flex-1">
                <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1.1 }}>{t.name}</span>
                <span className="mt-0.5 block text-[12px] font-extrabold text-ink-3">{PELAJARAN[t.id] ?? "Sains"}</span>
                <span className="mt-0.5 block text-[13px] font-bold text-ink-2 line-clamp-2">{t.desc}</span>
              </span>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(155deg,#ffb347,#ff7a1a 60%)", boxShadow: "0 3px 0 #c85400" }}>
                <Icon name="play_arrow" size={26} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
