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
import { useMe } from "@/lib/store";

export default function AkademiPage() {
  const me = useMe();
  const versi = useProfilAkademiVersi();
  const [hadiah, setHadiah] = useState(false);
  const [level, setLevel] = useState<LevelId>("PAUD");
  useEffect(() => setLevel(levelAnak(me.id)), [me.id, versi]);

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

  return <PetaPetualangan me={me} level={level} onHadiah={() => setHadiah(true)} />;
}
