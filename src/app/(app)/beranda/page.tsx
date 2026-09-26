"use client";

import { AppIcon, BALOO } from "@/components/launcher";
import { WorldCard, useLastTool } from "@/components/kid";
import { useOpenTool } from "@/components/shell";
import { Icon } from "@/components/ui";
import { FOLDERS } from "@/lib/catalog";
import { can, useMe } from "@/lib/store";

const INK = "#2b1d4e";

export default function Beranda() {
  const me = useMe();
  const openTool = useOpenTool();
  const last = useLastTool();
  const allowed = FOLDERS.filter((f) => can(me, f.id));

  return (
    <>
      {last && (
        <button
          onClick={() => openTool(last)}
          className="flex items-center gap-3 rounded-[22px] bg-white p-2.5 pr-3 text-left shadow-[0_4px_0_rgba(43,29,78,.06)] transition-transform active:scale-[.98]"
        >
          <AppIcon t={last} size={48} theme="playful" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-extrabold text-ink-3">Lanjut main</span>
            <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1.15 }}>
              {last.name}
            </span>
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(155deg,#ffb347,#ff7a1a 60%)", boxShadow: "0 3px 0 #c85400" }}>
            <Icon name="play_arrow" size={28} />
          </span>
        </button>
      )}

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Mau main apa?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {allowed.map((f) => (
            <WorldCard key={f.id} f={f} />
          ))}
        </div>
        {allowed.length === 0 && <p className="text-[15px] font-bold text-ink-3">Belum ada dunia yang dibuka. Minta ayah atau ibu membukanya, ya.</p>}
      </section>
    </>
  );
}
