"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KartuKampus } from "@/components/kampus";
import { peranAkademi } from "@/lib/akademi/konten";
import { AppIcon, BALOO } from "@/components/launcher";
import { WorldCard, useLastTool } from "@/components/kid";
import { InstallBanner } from "@/components/pwa";
import { useOpenTool } from "@/components/shell";
import { Icon } from "@/components/ui";
import { FOLDERS } from "@/lib/catalog";
import { can, useMe } from "@/lib/store";

const INK = "#0b2545";

export default function Beranda() {
  const me = useMe();
  const openTool = useOpenTool();
  const last = useLastTool();
  // Anak Academy: beranda dibuka dengan kartu Kampus; dunia lain jadi "Jam istirahat".
  const [anakAkademi, setAnakAkademi] = useState(false);
  useEffect(() => setAnakAkademi(!me.admin && peranAkademi(me.id) === "anak" && can(me, "edukasi")), [me]);
  // Petualangan 3D (dunia unggulan) tampil paling depan.
  const allowed = FOLDERS.filter((f) => can(me, f.id)).sort((a, b) => Number(b.id === "angkasa") - Number(a.id === "angkasa"));

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

      {anakAkademi && <KartuKampus me={me} />}

      <section className="flex flex-col gap-3">
        <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>{anakAkademi ? "Jam istirahat" : "Mau main apa?"}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {allowed.map((f) => (
            <WorldCard key={f.id} f={f} />
          ))}
        </div>
        {allowed.length === 0 && <p className="text-[15px] font-bold text-ink-3">Belum ada dunia yang dibuka. Minta ayah atau ibu membukanya, ya.</p>}
      </section>

      <Link href="/orang-tua" className="inline-flex items-center gap-1.5 self-center rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-ink-3 shadow-[0_2px_0_rgba(11,37,69,.08)] transition-transform active:scale-95">
        <Icon name="lock" size={18} /> Ruang Orang Tua
      </Link>
    </>
  );
}
