"use client";

// Peta jenjang anak + pemeriksa akses paket, untuk halaman di luar peta (pelajaran, koleksi, /akademi/main/<id>).

import { useEffect, useMemo, useState } from "react";
import type { ContentPack, LevelId } from "@akademi/schema";
import { TRACK_SLICE } from "@/components/akademi/portal/bersama";
import { aksesPaket, type Akses } from "./akses";
import { useEvents } from "./jejak";
import { KOMPETENSI, PAKET, levelAnak, useBahasaAnak } from "./konten";
import { proyeksi } from "./mastery";
import { kompetensiSelesai, petaJenjang, progresMisi, type PetaJenjang } from "./peta";
import { ambilUjian, useUjian } from "./ujian-klien";

const INDEKS = new Map(KOMPETENSI.map((c) => [c.id, c]));

/** Peta jenjang aktif anak dan fungsi akses paket. `siap` = hasil ujian dari server sudah ditarik (atau gagal/offline). */
export function useAksesAkademi(memberId: string): { peta: PetaJenjang; level: LevelId; siap: boolean; akses: (p: ContentPack) => Akses } {
  const events = useEvents(memberId);
  const bahasa = useBahasaAnak(memberId);
  const ujian = useUjian(memberId);
  const [siap, setSiap] = useState(false);
  const [level, setLevel] = useState<LevelId>(() => levelAnak(memberId));
  useEffect(() => {
    setLevel(levelAnak(memberId));
    setSiap(false);
    ambilUjian(memberId)
      .catch((e) => console.error("[akademi] ambil ujian gagal", e))
      .finally(() => setSiap(true));
  }, [memberId]);
  const peta = useMemo(
    () => petaJenjang(proyeksi(events, KOMPETENSI), kompetensiSelesai(events, PAKET), KOMPETENSI, level, TRACK_SLICE, progresMisi(events, PAKET), ujian),
    [events, level, ujian],
  );
  const akses = useMemo(() => (p: ContentPack) => aksesPaket(p, peta, INDEKS, bahasa === "en" ? "en" : "id"), [peta, bahasa]);
  return { peta, level, siap, akses };
}
