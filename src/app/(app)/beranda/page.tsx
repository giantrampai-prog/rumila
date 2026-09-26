"use client";

import { AppIcon, BALOO } from "@/components/launcher";
import { MascotBubble, WorldCard, useLastTool } from "@/components/kid";
import { useOpenTool } from "@/components/shell";
import { Icon } from "@/components/ui";
import { FOLDERS } from "@/lib/catalog";
import { can, useMe } from "@/lib/store";

export default function Beranda() {
  const me = useMe();
  const openTool = useOpenTool();
  const last = useLastTool();

  const allowed = FOLDERS.filter((f) => can(me, f.id));
  // Dunia yang terakhir dimainkan tampil paling depan dan paling besar.
  const featured = last ? allowed.find((f) => f.id === last.folder) : undefined;
  const worlds = featured ? [featured, ...allowed.filter((f) => f !== featured)] : allowed;

  return (
    <>
      <div className="flex flex-wrap items-end gap-3">
        <MascotBubble>{last ? <>Lanjut main {last.name}, yuk!</> : <>Mau main apa hari ini?</>}</MascotBubble>
        {last && (
          <button
            onClick={() => openTool(last)}
            className="ml-auto flex h-16 items-center gap-3 rounded-[22px] bg-white pr-5 pl-2 shadow-[0_4px_0_rgba(43,29,78,.08)] transition-transform active:scale-95"
          >
            <AppIcon t={last} size={48} theme="playful" />
            <span style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: "#2b1d4e" }}>Main lagi</span>
            <Icon name="play_arrow" size={28} className="text-[#ff7a1a]" />
          </button>
        )}
      </div>

      <section className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {worlds.map((f) => (
          <WorldCard key={f.id} f={f} big={f === featured} />
        ))}
      </section>

      {allowed.length === 0 && (
        <MascotBubble>Belum ada dunia yang dibuka. Minta ayah atau ibu membukanya, ya.</MascotBubble>
      )}
    </>
  );
}
