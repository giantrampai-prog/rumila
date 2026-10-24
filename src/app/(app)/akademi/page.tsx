"use client";

// Portal murid: tab Hari ini (misi adaptif), Pelajaran (peta jenjang) & Koleksi (stiker, lencana, pangkat). Kerangka + header anak dari shell.

import { useEffect, useState } from "react";
import type { LevelId } from "@akademi/schema";
import { HariIni } from "@/components/akademi/portal/hari-ini";
import { Koleksi } from "@/components/akademi/portal/koleksi";
import { PetaPelajaran } from "@/components/akademi/portal/pelajaran";
import { TabBesar } from "@/components/akademi/portal/bersama";
import { levelAnak } from "@/lib/akademi/konten";
import { useMe } from "@/lib/store";

type Tab = "hari-ini" | "pelajaran" | "koleksi";

export default function AkademiPage() {
  const me = useMe();
  const [tab, setTab] = useState<Tab>("hari-ini");
  const [level, setLevel] = useState<LevelId>("PAUD");
  useEffect(() => setLevel(levelAnak(me.id)), [me.id]);

  return (
    <>
      <TabBesar<Tab>
        value={tab}
        onChange={setTab}
        options={[
          ["hari-ini", "Hari ini", "today"],
          ["pelajaran", "Pelajaran", "map"],
          ["koleksi", "Koleksi", "emoji_events"],
        ]}
      />
      {tab === "hari-ini" ? <HariIni me={me} level={level} /> : tab === "koleksi" ? <Koleksi me={me} level={level} /> : <PetaPelajaran me={me} level={level} />}
    </>
  );
}
