"use client";

// Main satu paket Academy. Paket hanya boleh dimainkan bila misinya terbuka di peta jenjang anak (lihat lib/akademi/akses.ts):
// tautan langsung, halaman pelajaran, dan koleksi stiker tidak bisa melompati kunci modul.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { ActivityRunner, judulPaket } from "@/components/akademi/runner";
import { paketById, useBahasaAnak } from "@/lib/akademi/konten";
import { useAksesAkademi } from "@/lib/akademi/peta-anak";
import { useMe } from "@/lib/store";

export default function AkademiMainPage() {
  const { paket } = useParams<{ paket: string }>();
  const [klien, setKlien] = useState(false);
  useEffect(() => setKlien(true), []);
  if (!klien) return null;
  return <Gerbang paketId={paket} />;
}

function Gerbang({ paketId }: { paketId: string }) {
  const me = useMe();
  const bahasa = useBahasaAnak(me.id);
  const { akses, siap } = useAksesAkademi(me.id);
  const p = paketById(paketId);
  if (!p) return <ActivityRunner paketId={paketId} />;
  const a = akses(p);
  if (a.boleh) return <ActivityRunner paketId={paketId} />;
  if (!siap) return null; // hasil ujian belum ditarik: jangan buru-buru menyatakan terkunci
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-3 rounded-[28px] bg-white p-6 text-center shadow-[0_6px_0_rgba(11,37,69,.08)]">
        <span className="flex size-16 items-center justify-center rounded-full bg-[#ece4d8] text-[#8a7d6b]">
          <Icon name="lock" size={34} />
        </span>
        <p style={{ fontFamily: BALOO, fontSize: 22, fontWeight: 800, color: "#0b2545" }}>{judulPaket(p, bahasa)}</p>
        <p className="text-[15px] font-bold text-[#5b6b85]">{bahasa === "en" ? "This mission is still locked." : "Misi ini masih terkunci."}</p>
        <p className="text-[16px] font-extrabold text-[#0b2545]">{a.alasan}</p>
        <Link
          href="/akademi"
          className="mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-white"
          style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 4px 0 #c85400" }}
        >
          <Icon name="map" size={22} /> {bahasa === "en" ? "Back to the map" : "Ke peta"}
        </Link>
      </div>
    </div>
  );
}
