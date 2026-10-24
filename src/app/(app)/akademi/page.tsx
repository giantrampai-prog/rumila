"use client";

// Portal murid: tab Hari ini (misi adaptif) & Pelajaran (peta jenjang). Kerangka + header anak dari shell.

import { useEffect, useState } from "react";
import type { LevelId } from "@akademi/schema";
import { HariIni } from "@/components/akademi/portal/hari-ini";
import { PetaPelajaran } from "@/components/akademi/portal/pelajaran";
import { TabBesar } from "@/components/akademi/portal/bersama";
import { levelAnak } from "@/lib/akademi/konten";
import { useMe } from "@/lib/store";

type Tab = "hari-ini" | "pelajaran";

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
        ]}
      />
      {tab === "hari-ini" ? <HariIni me={me} level={level} /> : <PetaPelajaran me={me} level={level} />}
    </>
  );
}
