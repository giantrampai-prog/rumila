"use client";

// Quest dunia 3D → bukti kompetensi. Dunia 3D sudah mencatat "material_complete" per item (buah dilihat, organ dipelajari,
// objek angkasa dibuka) ke store `useRumila`. Lapisan ini mendengarkan aktivitas baru itu dan menerjemahkannya menjadi
// event `attempt` Academy sesuai peta QUEST (docs/akademi/migrasi-menu-lama.md: Petualangan 3D → DUNIA, pelajaran Sains).
// Game tidak perlu tahu id kompetensi; peta inilah yang menentukan (arsitektur §4.2).

import type { Activity } from "@/lib/store";
import { useRumila } from "@/lib/store";
import { uuid } from "@/lib/uuid";
import { catatEvent } from "./jejak";

export interface Quest {
  /** id kompetensi yang dibuktikan */
  competencyId: string;
  /** alat/dunia 3D (toolId di catalog) */
  toolId: string;
  /** judul quest untuk anak */
  judul: { id: string; en: string };
  /** rute dunia */
  href: string;
  /** item (partId) mana yang dihitung; tanpa fungsi = semua item alat itu */
  cocok?: (partId: string) => boolean;
  /** satu bukti = `perItem` item berbeda terkumpul (default 1: tiap item baru = satu bukti sukses) */
  perItem?: number;
}

/**
 * Peta quest. Tahap ini memakai jejak yang sudah dicatat dunia 3D (item dipelajari); "temukan X saat namanya disebut"
 * (instruksi audio di dalam dunia) menyusul saat tiap dunia punya mode quest sendiri. Bawah Laut belum mencatat item.
 */
export const QUEST: Quest[] = [
  {
    competencyId: "SAINS.TKB.TULANG-OTOT-ORGAN.01",
    toolId: "edukasi6",
    judul: { id: "Dokter Kecil: temukan organ", en: "Little Doctor: find the organs" },
    href: "/jelajah-tubuh",
    cocok: (id) => ["heart", "lung_r", "lung_l", "stomach", "brain_l", "brain_r", "brain"].includes(id),
  },
  {
    competencyId: "SAINS.PAUD.HIDUP-TAK-HIDUP.02",
    toolId: "edukasi-buah",
    judul: { id: "Kebun: temukan 3 makhluk hidup", en: "Garden: find 3 living things" },
    href: "/buah-buahan",
    perItem: 3,
  },
  {
    competencyId: "SAINS.TKB.MATAHARI-BUMI-BULAN.01",
    toolId: "angkasa6",
    judul: { id: "Pilot Orbit: Matahari, Bumi, Bulan", en: "Orbit Pilot: Sun, Earth, Moon" },
    href: "/jelajah-angkasa",
    cocok: (id) => ["obj:sun", "obj:earth", "obj:moon"].includes(id),
  },
];

export const questUntuk = (competencyId: string) => QUEST.filter((q) => q.competencyId === competencyId);
export const adaQuest = (competencyId: string) => QUEST.some((q) => q.competencyId === competencyId);

const DIPROSES = "rumila-akademi-quest-diproses";
function sudah(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DIPROSES) ?? "[]"));
  } catch {
    return new Set();
  }
}
function simpanSudah(s: Set<string>) {
  try {
    localStorage.setItem(DIPROSES, JSON.stringify([...s].slice(-5000)));
  } catch {}
}

/** Terjemahkan satu aktivitas selesai menjadi bukti. Dipanggil untuk aktivitas baru saja (idempoten lewat id aktivitas). */
export function prosesAktivitas(a: Activity, sessionId: string) {
  if (a.event !== "material_complete" && a.event !== "exercise_complete") return 0;
  if (!a.partId) return 0;
  const s = sudah();
  if (s.has(a.id)) return 0;
  let n = 0;
  for (const q of QUEST) {
    if (q.toolId !== a.toolId) continue;
    if (q.cocok && !q.cocok(a.partId)) continue;
    const perItem = q.perItem ?? 1;
    // hitung item berbeda yang sudah terkumpul untuk quest ini
    const terkumpul = new Set(
      useRumila
        .getState()
        .activity.filter((x) => x.memberId === a.memberId && x.toolId === q.toolId && x.partId && (x.event === "material_complete" || x.event === "exercise_complete") && (!q.cocok || q.cocok(x.partId)))
        .map((x) => x.partId!),
    ).size;
    if (terkumpul % perItem !== 0) continue;
    catatEvent({
      learnerId: a.memberId,
      sessionId,
      activityId: `quest:${q.toolId}`,
      mechanic: "cari",
      type: "attempt",
      // aktivitas lama (muat dari server / progres sebelum Academy) dihitung sebagai impor, bukan main hari ini
      payload: { itemId: a.partId, correct: true, hintUsed: false, latencyMs: 0, competencyIds: [q.competencyId], detail: { quest: q.judul.id, terkumpul }, imported: Date.now() - a.at > 60000 },
    });
    n++;
  }
  s.add(a.id);
  simpanSudah(s);
  return n;
}

let terpasang = false;
/** Pasang sekali (di shell): aktivitas baru di store → bukti quest. */
export function pasangQuestBukti() {
  if (terpasang || typeof window === "undefined") return;
  terpasang = true;
  const sessionId = uuid();
  let prev = useRumila.getState().activity;
  useRumila.subscribe((st) => {
    if (st.activity === prev) return;
    const lama = new Set(prev.map((x) => x.id));
    const baru = st.activity.filter((x) => !lama.has(x.id));
    prev = st.activity;
    for (const a of baru) prosesAktivitas(a, sessionId);
  });
}
