"use client";

// Portal murid: satu Peta Petualangan berjenjang (jenjang → pelajaran → unit → misi), plus layar Hadiah
// (stiker, lencana, pangkat). Rapor untuk wali ditautkan dari peta. Kerangka + header anak dari shell.

import { useEffect, useState } from "react";
import type { LevelId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { Koleksi } from "@/components/akademi/portal/koleksi";
import { PetaPetualangan } from "@/components/akademi/portal/peta";
import { levelAnak, useProfilAkademiVersi } from "@/lib/akademi/konten";
import Link from "next/link";
import { sinkronSiswa, sudahBelajar } from "@/lib/akademi/siswa";
import { useUjian } from "@/lib/akademi/ujian-klien";
import { useMe } from "@/lib/store";

export default function AkademiPage() {
  const me = useMe();
  const versi = useProfilAkademiVersi();
  const [hadiah, setHadiah] = useState(false);
  const ujian = useUjian(me.id);
  // Tes Penempatan ditawarkan selama anak belum pernah menjawab soal apa pun dan belum ikut tes.
  const [baru, setBaru] = useState(false);
  useEffect(() => setBaru(!sudahBelajar(me.id)), [me.id]);
  const perluPenempatan = baru && !ujian.some((h) => h.jenis === "penempatan");
  const [level, setLevel] = useState<LevelId>("PAUD");
  useEffect(() => setLevel(levelAnak(me.id)), [me.id, versi]);
  // Jenjang aktif dipegang server (akademi_siswa); jenjang lokal disamakan setiap portal dibuka.
  useEffect(() => void sinkronSiswa(me.id), [me.id]);

  if (hadiah)
    return (
      <>
        <button
          onClick={() => setHadiah(false)}
          className="flex h-12 items-center gap-1.5 self-start rounded-full bg-white pr-4 pl-3 text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.1)] transition-transform active:scale-95"
          style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800 }}
        >
          <Icon name="map" size={24} /> Kembali ke peta
        </button>
        <Koleksi me={me} level={level} onKeMisi={() => setHadiah(false)} />
      </>
    );

  return (
    <>
      {perluPenempatan && (
        <Link
          href="/akademi/penempatan"
          className="flex items-center gap-3 rounded-[24px] bg-white p-3 pr-4 shadow-[0_4px_0_rgba(11,37,69,.08)] transition-transform active:scale-[.98]"
          style={{ color: "#0b2545" }}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#e4f1fd] text-[#0567c2]">
            <Icon name="explore" size={28} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-none" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>
              Tes Penempatan
            </span>
            <span className="mt-1 block text-[13px] font-bold text-ink-3">10 soal untuk menentukan jenjang awal</span>
          </span>
          <Icon name="arrow_forward" size={26} />
        </Link>
      )}
      <PetaPetualangan me={me} level={level} onHadiah={() => setHadiah(true)} />
    </>
  );
}
