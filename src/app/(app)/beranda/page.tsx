"use client";

import Link from "next/link";
import { KartuKampus, PetaKampus, useGedungKampus } from "@/components/kampus";
import { AppIcon, BALOO } from "@/components/launcher";
import { useLastTool } from "@/components/kid";
import { InstallBanner } from "@/components/pwa";
import { useOpenTool } from "@/components/shell";
import { Icon } from "@/components/ui";
import { can, useMe } from "@/lib/store";

const INK = "#0b2545";

/** Beranda = gerbang Kampus RINOYA: Gedung Utama (Ruang Kelas) lalu gedung-gedung lain di peta kampus. */
export default function Beranda() {
  const me = useMe();
  const openTool = useOpenTool();
  const last = useLastTool();
  const kelas = can(me, "edukasi");
  const gedung = useGedungKampus(me);

  return (
    <>
      <InstallBanner />
      {last && (
        <button
          onClick={() => openTool(last)}
          className="flex items-center gap-3 rounded-[22px] bg-white p-2.5 pr-3 text-left shadow-[0_4px_0_rgba(11,37,69,.06)] transition-transform active:scale-[.98]"
        >
          <AppIcon t={last} size={48} theme="playful" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-extrabold text-ink-3">Lanjut main</span>
            <span className="block truncate" style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1.15 }}>
              {last.name}
            </span>
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-[#0b2545]" style={{ background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 3px 0 #c85400" }}>
            <Icon name="play_arrow" size={28} />
          </span>
        </button>
      )}

      {kelas && <KartuKampus me={me} />}
      <PetaKampus me={me} />
      {!kelas && gedung.length === 0 && <p className="text-[15px] font-bold text-ink-3">Kampus belum dibuka untukmu. Minta ayah atau ibu membukanya, ya.</p>}

      <Link href="/orang-tua" className="inline-flex items-center gap-1.5 self-center rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-ink-3 shadow-[0_2px_0_rgba(11,37,69,.08)] transition-transform active:scale-95">
        <Icon name="lock" size={18} /> Ruang Orang Tua
      </Link>
    </>
  );
}
