// Bagian murni sertifikat (tanpa React/DOM/localStorage) — dipakai aplikasi DAN server penerbit
// (/api/akademi/sertifikat). Server menghitung kelulusan sendiri dari learner_event; aplikasi tidak lagi
// boleh menulis ke tabel akademi_certificate.

import { GameEvent, LEVELS, type Competency, type LevelId, type StandardRef, type TrackId } from "@akademi/schema";
import { pangkat } from "./koleksi";
import { jenjangBerikut } from "./peta";
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
  /** nilai Ujian Kenaikan (0–100) dan predikatnya; kosong pada sertifikat sebelum Tahap 3 */
  nilai?: number;
  predikat?: string;
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
    ...(typeof s.nilai === "number" ? { nilai: s.nilai } : {}),
    ...(typeof s.predikat === "string" ? { predikat: s.predikat } : {}),
  };
}


/** URL verifikasi publik untuk satu kode. */
export const URL_VERIFIKASI = (code: string) => `https://rumila.vercel.app/sertifikat/${code}`;

/* ---------------- kelulusan versi server ---------------- */

export interface BarisEvent {
  id: string;
  member_id: string;
  session_id: string;
  activity_id: string;
  mechanic: string;
  type: string;
  payload: unknown;
  client_at: string;
  created_at: string;
}

/**
 * Baris learner_event → GameEvent untuk dinilai server. Waktu yang dipakai = created_at (jam server saat event
 * diterima), bukan client_at, supaya syarat "dikuasai di beberapa hari" tidak bisa diakali dengan mengubah jam HP.
 * Baris yang tidak lolos skema dibuang.
 */
export function eventDariBaris(rows: BarisEvent[]): GameEvent[] {
  const out: GameEvent[] = [];
  for (const r of rows) {
    const at = new Date(r.created_at);
    if (Number.isNaN(at.getTime())) continue;
    const e = GameEvent.safeParse({
      id: r.id,
      learnerId: r.member_id,
      sessionId: r.session_id,
      activityId: r.activity_id,
      mechanic: r.mechanic,
      type: r.type,
      payload: r.payload && typeof r.payload === "object" ? r.payload : {},
      clientAt: at.toISOString(),
    });
    if (e.success) out.push(e.data);
  }
  return out.sort((a, b) => (a.clientAt < b.clientAt ? -1 : a.clientAt > b.clientAt ? 1 : 0));
}

export interface Kelulusan {
  level: LevelId;
  lulus: boolean;
  dikuasai: number;
  total: number;
  snapshot: SnapshotSertifikat;
  /** jenjang yang dibuka bila lulus; undefined bila sudah jenjang terakhir yang punya kurikulum */
  berikut?: LevelId;
}

/** Nilai kelulusan satu jenjang dari event (fungsi murni; dipakai server penerbit). */
export function nilaiKelulusan(events: GameEvent[], kompetensi: Competency[], level: LevelId): Kelulusan {
  const peng = proyeksi(events, kompetensi);
  const p = pangkat(peng, kompetensi, [level])[0];
  const snapshot = snapshotSertifikat(peng, kompetensi, level);
  return { level, lulus: !!p?.tercapai, dikuasai: snapshot.dikuasai, total: snapshot.total, snapshot, berikut: jenjangBerikut(level, kompetensi) };
}
