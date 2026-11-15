"use client";

// Status siswa Academy di server (tabel akademi_siswa, Sekolah Tahap 1): jenjang aktif anak dipegang server.
// - sinkronSiswa(): server menang. Ada baris → jenjang lokal disamakan. Belum ada baris → jenjang lokal didaftarkan
//   sekali sebagai jenjang awal (akademi_atur_jenjang_awal).
// - aturJenjangAwal(): wali memilih jenjang awal; server menolak ("jenjang_terkunci") bila anak sudah belajar.
// - Naik jenjang hanya lewat server penerbit sertifikat (lihat sertifikat.ts). Anggota demo (id bukan UUID) tetap lokal.

import type { LevelId } from "@akademi/schema";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";
import { eventsAnak } from "./jejak";
import { levelAnak, setLevelAnak } from "./konten";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const terhubung = (memberId: string) => typeof window !== "undefined" && UUID.test(memberId) && !!useCloud.getState().familyId;

/** Anak sudah punya catatan belajar (jawaban) → jenjang tidak boleh dipilih ulang. */
export const sudahBelajar = (memberId: string) => eventsAnak(memberId).some((e) => e.type === "attempt");

const sedang = new Map<string, Promise<LevelId | null>>();

/** Samakan jenjang lokal dengan server. Mengembalikan jenjang server, atau null bila offline / anggota demo. */
export function sinkronSiswa(memberId: string): Promise<LevelId | null> {
  if (!terhubung(memberId)) return Promise.resolve(null);
  const jalan = sedang.get(memberId);
  if (jalan) return jalan;
  const p = (async () => {
    try {
      const { data, error } = await supabase().from("akademi_siswa").select("level").eq("member_id", memberId).maybeSingle();
      if (error) throw error;
      if (data) {
        const lv = data.level as LevelId;
        if (levelAnak(memberId) !== lv) setLevelAnak(memberId, lv);
        return lv;
      }
      const r = await supabase().rpc("akademi_atur_jenjang_awal", { p_member: memberId, p_level: levelAnak(memberId) });
      if (r.error) throw r.error;
      return (r.data?.level as LevelId) ?? null;
    } catch (e) {
      console.error("[akademi] sinkron status siswa gagal", e);
      return null;
    } finally {
      sedang.delete(memberId);
    }
  })();
  sedang.set(memberId, p);
  return p;
}

export type HasilAturJenjang = { ok: true } | { ok: false; alasan: "terkunci" | "galat" };

/** Wali memilih jenjang awal anak. Anak yang sudah belajar → ditolak (jenjang naik lewat kelulusan). */
export async function aturJenjangAwal(memberId: string, level: LevelId): Promise<HasilAturJenjang> {
  if (sudahBelajar(memberId)) return { ok: false, alasan: "terkunci" };
  if (!terhubung(memberId)) {
    setLevelAnak(memberId, level);
    return { ok: true };
  }
  const { data, error } = await supabase().rpc("akademi_atur_jenjang_awal", { p_member: memberId, p_level: level });
  if (error) return { ok: false, alasan: /jenjang_terkunci/.test(error.message) ? "terkunci" : "galat" };
  setLevelAnak(memberId, (data?.level as LevelId) ?? level);
  return { ok: true };
}
