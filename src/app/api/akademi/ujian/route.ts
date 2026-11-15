// Server penilai ujian RINOYA Academy (Sekolah Tahap 3).
//
// POST { memberId, jenis, level, ruang, sessionId } + Authorization: Bearer <token>
//   - Nilai dihitung dari event "attempt" sesi ujian itu di learner_event (jawaban memakai Bantu dihitung salah).
//     Soal yang dihitung = JUMLAH_SOAL[jenis] pertama; kurang dari itu → 422 belum_lengkap.
//   - Soal harus dari paket yang memuat kompetensi cakupan ujian.
//   - Satu sesi = satu hasil (idempoten). Gagal hari ini → baru boleh mengulang besok (WIB).
//   - Efek: Ujian Semester 1 lulus → akademi_siswa.semester = 2. Tes Penempatan lulus (atau tes PAUD) → jenjang awal.
// Jawaban: 200 { ujian, levelBaru? } · 409 jenjang_beda / sudah_lulus / tunggu_besok / penempatan_ditutup ·
//          422 belum_lengkap / ruang_tidak_dikenal · 401/403 · 503 belum_aktif.

import { JENIS_UJIAN, JUMLAH_SOAL, bolehMengulang, lulusDari, nilaiDari, type HasilUjian, type JenisUjian } from "@/lib/akademi/ujian";
import { cakupanUjian } from "@/lib/akademi/ruang-ujian";
import { KOMPETENSI, PAKET } from "@/lib/akademi/katalog";
import { UUID, anggotaMilik, jawab, klien, semuaEvent } from "@/lib/akademi/server";
import { LevelId } from "@akademi/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KOLOM = "id, member_id, jenis, level, ruang, session_id, benar, total, nilai, lulus, created_at";
type BarisUjian = { jenis: string; level: string; ruang: string; session_id: string; benar: number; total: number; nilai: number; lulus: boolean; created_at: string };
const keHasil = (r: BarisUjian): HasilUjian => ({ jenis: r.jenis as JenisUjian, level: r.level as LevelId, ruang: r.ruang, sessionId: r.session_id, benar: r.benar, total: r.total, nilai: r.nilai, lulus: r.lulus, at: r.created_at });

export async function POST(req: Request) {
  const k = klien(req);
  if (k === "belum_aktif") return jawab(503, { error: "penerbit_belum_aktif" });
  if (k === "tanpa_sesi") return jawab(401, { error: "tanpa_sesi" });
  const { pemanggil, admin } = k;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const memberId = typeof body?.memberId === "string" ? body.memberId : "";
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
  const jenis = JENIS_UJIAN.find((j) => j === body?.jenis);
  const lv = LevelId.safeParse(body?.level);
  const ruang = typeof body?.ruang === "string" ? body.ruang : "";
  if (!UUID.test(memberId) || !UUID.test(sessionId) || !jenis || !lv.success) return jawab(400, { error: "permintaan_tidak_valid" });
  const level = lv.data;

  const member = await anggotaMilik(pemanggil, memberId);
  if (typeof member === "number") return jawab(member, { error: member === 401 ? "sesi_tidak_sah" : "tidak_berhak" });

  // sesi yang sama sudah dinilai → kembalikan apa adanya
  const { data: ada } = await admin.from("akademi_ujian").select(KOLOM).eq("session_id", sessionId).maybeSingle();
  if (ada) {
    if (ada.member_id !== memberId) return jawab(403, { error: "tidak_berhak" });
    return jawab(200, { ujian: keHasil(ada) });
  }

  const cakupan = cakupanUjian(jenis, level, ruang, KOMPETENSI);
  if (!cakupan?.length) return jawab(422, { error: "ruang_tidak_dikenal" });

  const { data: siswa } = await admin.from("akademi_siswa").select("level, sumber, semester").eq("member_id", memberId).maybeSingle();
  if (jenis === "penempatan") {
    const { count: sertifikat } = await admin.from("akademi_certificate").select("id", { count: "exact", head: true }).eq("member_id", memberId);
    const { count: lulusTes } = await admin.from("akademi_ujian").select("id", { count: "exact", head: true }).eq("member_id", memberId).eq("jenis", "penempatan").eq("lulus", true);
    if (siswa?.sumber === "naik" || (sertifikat ?? 0) > 0 || (lulusTes ?? 0) > 0) return jawab(409, { error: "penempatan_ditutup" });
  } else if (!siswa || siswa.level !== level) {
    return jawab(409, { error: "jenjang_beda", levelAktif: siswa?.level });
  }

  const { data: riwayat } = await admin.from("akademi_ujian").select(KOLOM).eq("member_id", memberId).eq("jenis", jenis).eq("level", level).eq("ruang", ruang);
  const boleh = bolehMengulang((riwayat ?? []).map(keHasil), jenis, level, ruang);
  if (!boleh.boleh) return jawab(409, { error: boleh.besok ? "tunggu_besok" : "sudah_lulus" });

  const rows = await semuaEvent(admin, memberId, sessionId);
  if (!rows) return jawab(500, { error: "galat" });
  const sah = new Set(cakupan);
  const isiPaket = new Map(PAKET.map((p) => [p.id, p.competencyIds]));
  const jawaban = rows.filter((r) => r.type === "attempt");
  const n = JUMLAH_SOAL[jenis];
  if (jawaban.length < n) return jawab(422, { error: "belum_lengkap", terjawab: jawaban.length, perlu: n });
  const dihitung = jawaban.slice(0, n);
  if (dihitung.some((r) => !(isiPaket.get(r.activity_id) ?? []).some((c) => sah.has(c)))) return jawab(422, { error: "soal_di_luar_cakupan" });
  const benar = dihitung.filter((r) => {
    const p = (r.payload ?? {}) as { correct?: unknown; hintUsed?: unknown };
    return p.correct === true && p.hintUsed !== true;
  }).length;
  const nilai = nilaiDari(benar, n);
  const lulus = lulusDari(jenis, nilai);

  const { data: baru, error } = await admin
    .from("akademi_ujian")
    .insert({ family_id: member.family_id, member_id: memberId, jenis, level, ruang, session_id: sessionId, benar, total: n, nilai, lulus })
    .select(KOLOM)
    .single();
  if (error || !baru) {
    console.error("[ujian] simpan gagal", error);
    return jawab(500, { error: "galat" });
  }

  let levelBaru: string | undefined;
  const sekarang = new Date().toISOString();
  if (lulus && jenis === "semester" && ruang === "S1") await admin.from("akademi_siswa").update({ semester: 2, updated_at: sekarang }).eq("member_id", memberId);
  // Penempatan: lulus → jenjang itu; belum lulus di jenjang terendah → tetap mulai dari jenjang itu
  if (jenis === "penempatan" && (lulus || level === "PAUD")) {
    const { error: e } = await admin.from("akademi_siswa").upsert({ member_id: memberId, family_id: member.family_id, level, semester: 1, sumber: "awal", level_sejak: sekarang, updated_at: sekarang }, { onConflict: "member_id" });
    if (!e) levelBaru = level;
  }
  return jawab(200, { ujian: keHasil(baru), levelBaru });
}
