// Server penerbit sertifikat jenjang RINOYA Academy (Sekolah Tahap 1).
//
// POST { memberId, level }  + header Authorization: Bearer <token sesi Supabase>
//   1. Baca anggota & status siswa memakai token pemanggil (RLS memastikan pemanggil anggota rumah itu).
//   2. Jenjang yang diminta harus jenjang aktif anak di akademi_siswa (tidak bisa meluluskan jenjang lain).
//   3. Baca seluruh learner_event anak, hitung ulang kelulusan di server (waktu = created_at server).
//   4. Lulus → tulis sertifikat (nomor resmi diisi trigger) dan naikkan jenjang, keduanya dengan kunci service_role.
// Jawaban: 200 { sertifikat, levelBaru } · 422 { error: "belum_lulus", dikuasai, total } · 409 jenjang beda ·
//          401/403 tidak berhak · 503 penerbit belum dikonfigurasi (SUPABASE_SERVICE_ROLE_KEY kosong).

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LevelId } from "@akademi/schema";
import { KOMPETENSI } from "@/lib/akademi/katalog";
import { buatKode, eventDariBaris, nilaiKelulusan, type BarisEvent } from "@/lib/akademi/sertifikat-inti";
import { predikat } from "@/lib/akademi/ujian";
import type { Database, Json } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KOLOM = "id, member_id, level, track, code, snapshot, issued_at, nomor, status";
const HALAMAN = 1000;
const MAKS_EVENT = 60_000;

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publik = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const rahasia = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publik || !rahasia) return json(503, { error: "penerbit_belum_aktif" });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json(401, { error: "tanpa_sesi" });

  const body = (await req.json().catch(() => null)) as { memberId?: unknown; level?: unknown } | null;
  const memberId = typeof body?.memberId === "string" ? body.memberId : "";
  const lv = LevelId.safeParse(body?.level);
  if (!UUID.test(memberId) || !lv.success) return json(400, { error: "permintaan_tidak_valid" });
  const level = lv.data;

  const opsi = { auth: { persistSession: false, autoRefreshToken: false } };
  const pemanggil = createClient<Database>(url, publik, { ...opsi, global: { headers: { Authorization: `Bearer ${token}` } } });
  const admin = createClient<Database>(url, rahasia, opsi);

  // 1. pemanggil berhak atas anggota ini (RLS member: hanya rumah sendiri)
  const { data: member, error: eMember } = await pemanggil.from("member").select("id, family_id").eq("id", memberId).maybeSingle();
  if (eMember) return json(401, { error: "sesi_tidak_sah" });
  if (!member) return json(403, { error: "tidak_berhak" });

  // 2. jenjang aktif siswa
  const { data: siswa } = await admin.from("akademi_siswa").select("level").eq("member_id", memberId).maybeSingle();

  // sudah pernah terbit → kembalikan apa adanya (idempoten), jenjang tidak diubah lagi
  const { data: ada } = await admin.from("akademi_certificate").select(KOLOM).eq("member_id", memberId).eq("level", level).is("track", null).maybeSingle();
  if (ada) return json(200, { sertifikat: ada, levelBaru: siswa?.level && siswa.level !== level ? siswa.level : undefined });

  if (siswa && siswa.level !== level) return json(409, { error: "jenjang_beda", levelAktif: siswa.level });

  // 3. hitung ulang dari seluruh catatan belajar anak
  const rows: BarisEvent[] = [];
  for (let dari = 0; dari < MAKS_EVENT; dari += HALAMAN) {
    const { data, error } = await admin
      .from("learner_event")
      .select("id, member_id, session_id, activity_id, mechanic, type, payload, client_at, created_at")
      .eq("member_id", memberId)
      .order("created_at", { ascending: true })
      .range(dari, dari + HALAMAN - 1);
    if (error) {
      console.error("[sertifikat] baca learner_event gagal", error);
      return json(500, { error: "galat" });
    }
    rows.push(...((data ?? []) as BarisEvent[]));
    if (!data || data.length < HALAMAN) break;
  }
  const hasil = nilaiKelulusan(eventDariBaris(rows), KOMPETENSI, level);
  if (!hasil.lulus) return json(422, { error: "belum_lulus", dikuasai: hasil.dikuasai, total: hasil.total });

  // Ujian Akhir (sekali-jalan) wajib sudah dikerjakan; nilainya dibekukan apa adanya (<75 = predikat "Cukup")
  const { data: kenaikan } = await admin.from("akademi_ujian").select("nilai").eq("member_id", memberId).eq("jenis", "kenaikan").eq("level", level).order("created_at", { ascending: true }).limit(1);
  const nilaiAkhir = kenaikan?.[0]?.nilai;
  if (nilaiAkhir === undefined) return json(422, { error: "belum_ujian_kenaikan", dikuasai: hasil.dikuasai, total: hasil.total });
  hasil.snapshot.nilai = nilaiAkhir;
  hasil.snapshot.predikat = predikat(nilaiAkhir);
  const { data: semuaUjian } = await admin.from("akademi_ujian").select("jenis, ruang, nilai, lulus").eq("member_id", memberId).eq("level", level).or("lulus.eq.true,jenis.eq.kenaikan");
  const terbaikUjian = new Map<string, { jenis: string; ruang: string; nilai: number }>();
  for (const u of semuaUjian ?? []) {
    const k = `${u.jenis}|${u.ruang}`;
    if ((terbaikUjian.get(k)?.nilai ?? -1) < u.nilai) terbaikUjian.set(k, { jenis: u.jenis, ruang: u.ruang, nilai: u.nilai });
  }
  hasil.snapshot.ujian = [...terbaikUjian.values()];

  // 4. terbitkan (kode unik; coba ulang bila kebetulan sama)
  let terbit: unknown = null;
  for (let coba = 0; coba < 4 && !terbit; coba++) {
    const { data, error } = await admin
      .from("akademi_certificate")
      .insert({ family_id: member.family_id, member_id: memberId, level, track: null, code: buatKode(), snapshot: hasil.snapshot as unknown as Json })
      .select(KOLOM)
      .single();
    if (!error) terbit = data;
    else if (error.code !== "23505") {
      console.error("[sertifikat] insert gagal", error);
      return json(500, { error: "galat" });
    } else {
      // unik ganda: mungkin permintaan lain sudah menerbitkan anak × jenjang ini
      const { data: lain } = await admin.from("akademi_certificate").select(KOLOM).eq("member_id", memberId).eq("level", level).is("track", null).maybeSingle();
      if (lain) terbit = lain;
    }
  }
  if (!terbit) return json(500, { error: "galat" });

  // naik jenjang
  let levelBaru: string | undefined;
  if (hasil.berikut) {
    const sekarang = new Date().toISOString();
    const { error } = await admin
      .from("akademi_siswa")
      .upsert({ member_id: memberId, family_id: member.family_id, level: hasil.berikut, semester: 1, sumber: "naik", level_sejak: sekarang, updated_at: sekarang }, { onConflict: "member_id" });
    if (error) console.error("[sertifikat] naik jenjang gagal", error);
    else levelBaru = hasil.berikut;
  }

  return json(200, { sertifikat: terbit, levelBaru });
}
