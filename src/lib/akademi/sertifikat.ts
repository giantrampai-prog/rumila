"use client";

// Sertifikat jenjang RINOYA Academy: terbit saat pangkat jenjang tercapai (semua kompetensi inti dikuasai).
// - Fungsi murni (kode, snapshot, nilai kelulusan) ada di ./sertifikat-inti (dipakai juga oleh server).
// - terbitkan(): cek cepat di perangkat, lalu minta SERVER (/api/akademi/sertifikat) menerbitkan. Server menghitung
//   ulang kelulusan dari learner_event, menulis sertifikat bernomor resmi, dan menaikkan jenjang di akademi_siswa.
//   Aplikasi tidak bisa menulis tabel sertifikat sendiri (Sekolah Tahap 1, 15 Nov 2026).
//   Gagal karena jaringan → disimpan lokal pending: true (cap "menunggu sinkron", belum bisa diverifikasi) dan
//   dicoba lagi saat `online` atau saat ambilSertifikat(). Salinan lokal: localStorage["rumila-akademi-sertifikat-<memberId>"].
// - sertifikatAnak(): baca lokal. ambilSertifikat(): tarik dari server lalu gabung ke lokal.
// Hook useSertifikat() memakai React; fungsi lain tidak menyentuh React saat dipanggil.

import { useEffect, useState } from "react";
import type { LevelId } from "@akademi/schema";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";
import { eventsAnak } from "./jejak";
import { pangkat } from "./koleksi";
import { KOMPETENSI, setLevelAnak } from "./konten";
import { proyeksi } from "./mastery";
import { bacaSnapshot, buatKode, snapshotSertifikat, type SnapshotSertifikat } from "./sertifikat-inti";

export * from "./sertifikat-inti";

/* ---------------- penyimpanan lokal ---------------- */

export interface Sertifikat {
  /** id baris di server; kosong bila masih pending. */
  id?: string;
  memberId: string;
  level: LevelId;
  track: string | null;
  code: string;
  snapshot: SnapshotSertifikat;
  issuedAt: string;
  /** Belum sampai ke server (offline / belum punya rumah). */
  pending?: boolean;
  /** Nomor resmi dari server, mis. RA/2026/TKB/000128. */
  nomor?: string | null;
  status?: "sah" | "dicabut";
}

const PREFIX = "rumila-akademi-sertifikat-";
export const KUNCI_SERTIFIKAT = (memberId: string) => PREFIX + memberId;
export const EVENT_SERTIFIKAT = "rumila:akademi-sertifikat";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const adaWindow = () => typeof window !== "undefined";

/** Sertifikat anak dari salinan lokal (termasuk yang pending). */
export function sertifikatAnak(memberId: string): Sertifikat[] {
  if (!adaWindow()) return [];
  try {
    const raw = localStorage.getItem(KUNCI_SERTIFIKAT(memberId));
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? (arr as Sertifikat[]).filter((s) => s && typeof s.code === "string" && typeof s.level === "string") : [];
  } catch {
    return [];
  }
}

function simpanLokal(memberId: string, daftar: Sertifikat[]) {
  if (!adaWindow()) return;
  try {
    localStorage.setItem(KUNCI_SERTIFIKAT(memberId), JSON.stringify(daftar));
  } catch (e) {
    console.error("[akademi] simpan sertifikat lokal gagal", e);
  }
  umumkan(memberId);
}

const kunciSama = (a: Pick<Sertifikat, "level" | "track">, b: Pick<Sertifikat, "level" | "track">) => a.level === b.level && (a.track ?? "") === (b.track ?? "");

/** Masukkan/ganti satu sertifikat di salinan lokal (kunci: level + track). */
function taruhLokal(s: Sertifikat) {
  const daftar = sertifikatAnak(s.memberId).filter((x) => !kunciSama(x, s));
  daftar.push(s);
  simpanLokal(s.memberId, daftar);
}

function semuaMemberLokal(): string[] {
  if (!adaWindow()) return [];
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
    }
  } catch {}
  return out;
}

/* ---------------- emitter + hook ---------------- */

type Pendengar = (memberId: string) => void;
const pendengar = new Set<Pendengar>();
function umumkan(memberId: string) {
  for (const fn of pendengar) {
    try {
      fn(memberId);
    } catch (e) {
      console.error("[akademi] pendengar sertifikat gagal", e);
    }
  }
  if (adaWindow()) window.dispatchEvent(new CustomEvent(EVENT_SERTIFIKAT, { detail: memberId }));
}

/** Hook: sertifikat anak (lokal), ikut berubah saat terbitkan()/ambilSertifikat(). */
export function useSertifikat(memberId: string): Sertifikat[] {
  const [daftar, setDaftar] = useState<Sertifikat[]>(() => sertifikatAnak(memberId));
  useEffect(() => {
    setDaftar(sertifikatAnak(memberId));
    const segar = (id: string) => {
      if (id === memberId) setDaftar(sertifikatAnak(memberId));
    };
    pendengar.add(segar);
    return () => {
      pendengar.delete(segar);
    };
  }, [memberId]);
  return daftar;
}

/* ---------------- server ---------------- */

const KOLOM = "id, member_id, level, track, code, snapshot, issued_at, nomor, status";
type Baris = { id: string; member_id: string; level: string; track: string | null; code: string; snapshot: unknown; issued_at: string; nomor?: string | null; status?: string };

export function dariBaris(r: Baris): Sertifikat | null {
  const snapshot = bacaSnapshot(r.snapshot);
  if (!snapshot) return null;
  return {
    id: r.id,
    memberId: r.member_id,
    level: r.level as LevelId,
    track: r.track,
    code: r.code,
    snapshot,
    issuedAt: new Date(r.issued_at).toISOString(),
    nomor: r.nomor ?? null,
    status: r.status === "dicabut" ? "dicabut" : "sah",
  };
}

/** Jawaban server penerbit. */
export type HasilTerbit =
  | { ok: true; sertifikat: Sertifikat; levelBaru?: LevelId }
  | { ok: false; alasan: "belum_lulus"; dikuasai: number; total: number }
  | { ok: false; alasan: "jenjang_beda" | "tidak_berhak" | "jaringan" | "belum_aktif" | "galat" };

/** Minta server menerbitkan sertifikat anak × jenjang. Tidak pernah melempar. */
export async function mintaTerbit(memberId: string, level: LevelId): Promise<HasilTerbit> {
  try {
    const { data } = await supabase().auth.getSession();
    const token = data.session?.access_token;
    if (!token) return { ok: false, alasan: "tidak_berhak" };
    const res = await fetch("/api/akademi/sertifikat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ memberId, level }),
    });
    const j = (await res.json().catch(() => ({}))) as { sertifikat?: Baris; levelBaru?: LevelId; error?: string; dikuasai?: number; total?: number };
    if (res.ok && j.sertifikat) {
      const s = dariBaris(j.sertifikat);
      return s ? { ok: true, sertifikat: s, levelBaru: j.levelBaru } : { ok: false, alasan: "galat" };
    }
    if (res.status === 422) return { ok: false, alasan: "belum_lulus", dikuasai: j.dikuasai ?? 0, total: j.total ?? 0 };
    if (res.status === 409) return { ok: false, alasan: "jenjang_beda" };
    if (res.status === 401 || res.status === 403) return { ok: false, alasan: "tidak_berhak" };
    if (res.status === 503) return { ok: false, alasan: "belum_aktif" };
    return { ok: false, alasan: "galat" };
  } catch {
    return { ok: false, alasan: "jaringan" };
  }
}

function terapkan(h: Extract<HasilTerbit, { ok: true }>) {
  const bersih = { ...h.sertifikat, pending: false };
  taruhLokal(bersih);
  if (h.levelBaru) setLevelAnak(bersih.memberId, h.levelBaru);
  return bersih;
}

/** Tarik semua sertifikat anak dari server, gabung ke lokal (server menang), lalu kirim yang masih pending. */
export async function ambilSertifikat(memberId: string): Promise<Sertifikat[]> {
  if (!adaWindow() || !UUID.test(memberId)) return sertifikatAnak(memberId);
  const { data, error } = await supabase().from("akademi_certificate").select(KOLOM).eq("member_id", memberId).order("issued_at", { ascending: true });
  if (error) throw error;
  const server = (data ?? []).map((r) => dariBaris(r as Baris)).filter((x): x is Sertifikat => !!x);
  const gabung = sertifikatAnak(memberId).filter((l) => !server.some((s) => kunciSama(s, l)));
  const hasil = [...gabung, ...server];
  simpanLokal(memberId, hasil);
  void kirimTertunda();
  return hasil;
}

let sedangKirim = false;
/** Minta ulang penerbitan untuk sertifikat pending di perangkat ini (saat `online` dan setelah ambilSertifikat). */
export async function kirimTertunda(): Promise<void> {
  if (!adaWindow() || sedangKirim) return;
  if (!useCloud.getState().familyId) return;
  sedangKirim = true;
  try {
    for (const m of semuaMemberLokal()) {
      if (!UUID.test(m)) continue;
      for (const s of sertifikatAnak(m)) {
        if (!s.pending) continue;
        const h = await mintaTerbit(m, s.level);
        if (h.ok) terapkan(h);
        // Server menolak (belum lulus menurut catatan server / jenjang beda): buang salinan pending yang tidak sah.
        else if (h.alasan === "belum_lulus" || h.alasan === "jenjang_beda") simpanLokal(m, sertifikatAnak(m).filter((x) => !kunciSama(x, s)));
      }
    }
  } finally {
    sedangKirim = false;
  }
}

if (adaWindow()) window.addEventListener("online", () => void kirimTertunda());

/* ---------------- API utama ---------------- */

export class PangkatBelumTercapai extends Error {
  constructor(level: LevelId, pesan?: string) {
    super(pesan ?? `Pangkat jenjang ${level} belum tercapai`);
    this.name = "PangkatBelumTercapai";
  }
}

/**
 * Terbitkan sertifikat jenjang untuk anak (sekali per anak × jenjang) lewat server. Melempar PangkatBelumTercapai
 * bila kompetensi inti belum semua dikuasai (menurut perangkat atau menurut server). Bila sudah pernah terbit →
 * mengembalikan yang ada. Lulus = jenjang anak dinaikkan server dan salinan lokal ikut diperbarui.
 */
export async function terbitkan(memberId: string, level: LevelId): Promise<Sertifikat> {
  const sudah = sertifikatAnak(memberId).find((s) => s.level === level && !s.track && !s.pending);
  if (sudah) return sudah;

  const peng = proyeksi(eventsAnak(memberId), KOMPETENSI);
  const p = pangkat(peng, KOMPETENSI, [level])[0];
  if (!p?.tercapai) throw new PangkatBelumTercapai(level);

  const cadangan: Sertifikat = sertifikatAnak(memberId).find((s) => s.level === level && !s.track) ?? {
    memberId,
    level,
    track: null,
    code: buatKode(),
    snapshot: snapshotSertifikat(peng, KOMPETENSI, level),
    issuedAt: new Date().toISOString(),
    pending: true,
  };

  if (useCloud.getState().familyId && UUID.test(memberId)) {
    const h = await mintaTerbit(memberId, level);
    if (h.ok) return terapkan(h);
    if (h.alasan === "belum_lulus")
      throw new PangkatBelumTercapai(level, `Menurut catatan server baru ${h.dikuasai} dari ${h.total} kompetensi inti dikuasai.`);
    if (h.alasan === "jenjang_beda" || h.alasan === "tidak_berhak") throw new Error(`Sertifikat ditolak server: ${h.alasan}`);
  }
  // Offline / server penerbit belum aktif / anggota demo: simpan lokal dulu (belum bisa diverifikasi).
  taruhLokal(cadangan);
  return cadangan;
}
