"use client";

// Sertifikat jenjang RINOYA Academy: terbit saat pangkat jenjang tercapai (semua kompetensi inti dikuasai).
// - buatKode / snapshotSertifikat: fungsi murni (diuji vitest, tanpa DOM).
// - terbitkan(): cek pangkat, bekukan snapshot, insert ke tabel akademi_certificate, simpan salinan lokal di
//   localStorage["rumila-akademi-sertifikat-<memberId>"]. Gagal kirim (offline / belum ada rumah) → tetap tersimpan
//   lokal dengan pending: true dan dicoba lagi saat `online` atau saat ambilSertifikat().
// - sertifikatAnak(): baca lokal. ambilSertifikat(): tarik dari server lalu gabung ke lokal.
// Hook useSertifikat() memakai React; fungsi lain tidak menyentuh React saat dipanggil.

import { useEffect, useState } from "react";
import { LEVELS, type Competency, type LevelId, type StandardRef, type TrackId } from "@akademi/schema";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";
import type { Json } from "@/lib/supabase/types";
import { eventsAnak } from "./jejak";
import { pangkat } from "./koleksi";
import { KOMPETENSI } from "./konten";
import { proyeksi, type Penguasaan, type Status } from "./mastery";

/* ---------------- kode ---------------- */

/** Huruf/angka yang tidak membingungkan saat dibaca: tanpa 0, O, 1, I. */
export const ALFABET_KODE = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const PANJANG_KODE = 8;
export const POLA_KODE = /^[A-HJ-NP-Z2-9]{8}$/;

/** Kode sertifikat 8 karakter dari ALFABET_KODE; rng mengembalikan [0,1). */
export function buatKode(rng: () => number = Math.random): string {
  let out = "";
  for (let i = 0; i < PANJANG_KODE; i++) {
    const r = Math.min(Math.max(rng(), 0), 0.999999999);
    out += ALFABET_KODE[Math.floor(r * ALFABET_KODE.length)];
  }
  return out;
}

/** Normalisasi kode dari URL/ketikan: huruf besar, tanpa spasi/strip. */
export function rapikanKode(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/* ---------------- snapshot ---------------- */

export interface SnapshotKompetensi {
  id: string;
  track: TrackId;
  unit: { id: string; nama: { id: string; en: string } };
  statement: { id: string; en: string };
  status: Status;
  refs: StandardRef[];
}

export interface SnapshotSertifikat {
  level: LevelId;
  /** Kompetensi inti jenjang ini (semua track) beserta status saat terbit. */
  kompetensi: SnapshotKompetensi[];
  dikuasai: number;
  total: number;
  pangkat: string;
}

/** Bekukan daftar kompetensi inti satu jenjang + statusnya. Urutan mengikuti katalog. */
export function snapshotSertifikat(peng: Record<string, Penguasaan>, kompetensi: Competency[], level: LevelId): SnapshotSertifikat {
  const meta = LEVELS.find((l) => l.id === level);
  const daftar: SnapshotKompetensi[] = [];
  for (const c of kompetensi) {
    if (c.level !== level || !c.core) continue;
    daftar.push({
      id: c.id,
      track: c.track,
      unit: { id: c.unit.id, nama: { id: c.unit.nama.id, en: c.unit.nama.en } },
      statement: { id: c.statement.id, en: c.statement.en },
      status: peng[c.id]?.status ?? "belum",
      refs: c.refs.map((r) => ({ ...r })),
    });
  }
  return {
    level,
    kompetensi: daftar,
    dikuasai: daftar.filter((k) => k.status === "dikuasai").length,
    total: daftar.length,
    pangkat: meta?.pangkat ?? "",
  };
}

/** Parse snapshot dari server/lokal dengan toleransi (kolom asing dibiarkan, yang rusak → null). */
export function bacaSnapshot(v: unknown): SnapshotSertifikat | null {
  if (!v || typeof v !== "object") return null;
  const s = v as Partial<SnapshotSertifikat>;
  if (typeof s.level !== "string" || !Array.isArray(s.kompetensi)) return null;
  return {
    level: s.level as LevelId,
    kompetensi: s.kompetensi.filter((k): k is SnapshotKompetensi => !!k && typeof k === "object" && typeof (k as SnapshotKompetensi).id === "string"),
    dikuasai: typeof s.dikuasai === "number" ? s.dikuasai : 0,
    total: typeof s.total === "number" ? s.total : s.kompetensi.length,
    pangkat: typeof s.pangkat === "string" ? s.pangkat : "",
  };
}

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

type Baris = { id: string; member_id: string; level: string; track: string | null; code: string; snapshot: Json; issued_at: string };

function dariBaris(r: Baris): Sertifikat | null {
  const snapshot = bacaSnapshot(r.snapshot);
  if (!snapshot) return null;
  return { id: r.id, memberId: r.member_id, level: r.level as LevelId, track: r.track, code: r.code, snapshot, issuedAt: new Date(r.issued_at).toISOString() };
}

function keBaris(s: Sertifikat, familyId: string) {
  return { family_id: familyId, member_id: s.memberId, level: s.level, track: s.track, code: s.code, snapshot: s.snapshot as unknown as Json, issued_at: s.issuedAt };
}

/** Kode unik ganda (unique violation Postgres). */
const unikGanda = (e: { code?: string } | null) => e?.code === "23505";

/**
 * Kirim satu sertifikat ke server. Mengembalikan baris final (yang baru atau yang sudah ada di server untuk
 * anak × jenjang yang sama); null bila gagal karena jaringan/izin (biarkan pending).
 */
async function kirimSatu(s: Sertifikat, familyId: string): Promise<Sertifikat | null> {
  const sb = supabase();
  let calon = s;
  for (let coba = 0; coba < 3; coba++) {
    const { data, error } = await sb.from("akademi_certificate").insert(keBaris(calon, familyId)).select("id, member_id, level, track, code, snapshot, issued_at").single();
    if (!error && data) return dariBaris(data as Baris) ?? { ...calon, id: data.id, pending: false };
    if (!unikGanda(error)) {
      console.error("[akademi] kirim sertifikat gagal", error);
      return null;
    }
    // Unik ganda: entah anak × jenjang sudah punya sertifikat (ambil yang ada), entah kodenya kebetulan sama (coba kode baru).
    const { data: ada } = await sb
      .from("akademi_certificate")
      .select("id, member_id, level, track, code, snapshot, issued_at")
      .eq("member_id", s.memberId)
      .eq("level", s.level)
      .limit(10);
    const cocok = (ada ?? []).map((r) => dariBaris(r as Baris)).find((x): x is Sertifikat => !!x && kunciSama(x, s));
    if (cocok) return cocok;
    calon = { ...calon, code: buatKode() };
  }
  return null;
}

/** Tarik semua sertifikat anak dari server, gabung ke lokal (server menang), lalu kirim yang masih pending. */
export async function ambilSertifikat(memberId: string): Promise<Sertifikat[]> {
  if (!adaWindow() || !UUID.test(memberId)) return sertifikatAnak(memberId);
  const { data, error } = await supabase()
    .from("akademi_certificate")
    .select("id, member_id, level, track, code, snapshot, issued_at")
    .eq("member_id", memberId)
    .order("issued_at", { ascending: true });
  if (error) throw error;
  const server = (data ?? []).map((r) => dariBaris(r as Baris)).filter((x): x is Sertifikat => !!x);
  const gabung = sertifikatAnak(memberId).filter((l) => !server.some((s) => kunciSama(s, l)));
  const hasil = [...gabung, ...server];
  simpanLokal(memberId, hasil);
  void kirimTertunda();
  return hasil;
}

let sedangKirim = false;
/** Coba kirim ulang semua sertifikat pending di perangkat ini (dipanggil saat `online` dan setelah ambilSertifikat). */
export async function kirimTertunda(): Promise<void> {
  if (!adaWindow() || sedangKirim) return;
  const fid = useCloud.getState().familyId;
  if (!fid) return;
  sedangKirim = true;
  try {
    for (const m of semuaMemberLokal()) {
      if (!UUID.test(m)) continue;
      for (const s of sertifikatAnak(m)) {
        if (!s.pending) continue;
        const final = await kirimSatu(s, fid);
        if (final) taruhLokal({ ...final, pending: false });
      }
    }
  } finally {
    sedangKirim = false;
  }
}

if (adaWindow()) window.addEventListener("online", () => void kirimTertunda());

/* ---------------- API utama ---------------- */

export class PangkatBelumTercapai extends Error {
  constructor(level: LevelId) {
    super(`Pangkat jenjang ${level} belum tercapai`);
    this.name = "PangkatBelumTercapai";
  }
}

/**
 * Terbitkan sertifikat jenjang untuk anak (sekali per anak × jenjang). Melempar PangkatBelumTercapai bila
 * kompetensi inti jenjang belum semua dikuasai. Bila sudah pernah terbit → mengembalikan yang ada.
 */
export async function terbitkan(memberId: string, level: LevelId): Promise<Sertifikat> {
  const sudah = sertifikatAnak(memberId).find((s) => s.level === level && !s.track && !s.pending);
  if (sudah) return sudah;

  const peng = proyeksi(eventsAnak(memberId), KOMPETENSI);
  const p = pangkat(peng, KOMPETENSI, [level])[0];
  if (!p?.tercapai) throw new PangkatBelumTercapai(level);

  const tertunda = sertifikatAnak(memberId).find((s) => s.level === level && !s.track);
  const baru: Sertifikat = tertunda ?? {
    memberId,
    level,
    track: null,
    code: buatKode(),
    snapshot: snapshotSertifikat(peng, KOMPETENSI, level),
    issuedAt: new Date().toISOString(),
    pending: true,
  };

  const fid = useCloud.getState().familyId;
  if (fid && UUID.test(memberId)) {
    const final = await kirimSatu(baru, fid);
    if (final) {
      const bersih = { ...final, pending: false };
      taruhLokal(bersih);
      return bersih;
    }
  }
  // Offline / belum ada rumah / anggota demo: simpan lokal dulu, kirim saat online.
  taruhLokal(baru);
  return baru;
}

/** URL verifikasi publik untuk satu kode. */
export const URL_VERIFIKASI = (code: string) => `https://rumila.vercel.app/sertifikat/${code}`;
