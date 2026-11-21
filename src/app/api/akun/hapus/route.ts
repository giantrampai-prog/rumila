// Hapus akun (wajib App Store 5.1.1(v) & Play Store): orang tua menghapus akun login beserta seluruh data rumah yang ia buat.
//
// POST { konfirmasi: "HAPUS" } + header Authorization: Bearer <token sesi Supabase>
//   1. Token diperiksa dengan service role (auth.getUser) → user id pemanggil.
//   2. Berkas di storage milik rumah yang ia buat (documents, foto-anak, bukti-bayar; folder `<family_id>/`) dihapus.
//   3. auth.admin.deleteUser → family.created_by ON DELETE CASCADE menghapus rumah beserta anggota, progres belajar,
//      ujian, sertifikat, langganan, dan pembayaran; family_user lain ikut terhapus (rumah orang lain tetap ada).
// Jawaban: 200 { ok, rumah } · 400 konfirmasi salah · 401 tanpa/sesi tidak sah · 503 belum dikonfigurasi · 500 gagal.

import { jawab, klien, type Admin } from "@/lib/akademi/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = ["documents", "foto-anak", "bukti-bayar"] as const;

/** Semua path berkas di bawah `awalan` (rekursif; list Supabase hanya satu tingkat). */
async function semuaBerkas(admin: Admin, bucket: string, awalan: string, kedalaman = 0): Promise<string[]> {
  if (kedalaman > 4) return [];
  const hasil: string[] = [];
  for (let dari = 0; ; dari += 1000) {
    const { data, error } = await admin.storage.from(bucket).list(awalan, { limit: 1000, offset: dari });
    if (error || !data?.length) break;
    for (const o of data) {
      const path = `${awalan}/${o.name}`;
      // folder tidak punya id/metadata
      if (o.id) hasil.push(path);
      else hasil.push(...(await semuaBerkas(admin, bucket, path, kedalaman + 1)));
    }
    if (data.length < 1000) break;
  }
  return hasil;
}

export async function POST(req: Request) {
  const k = klien(req);
  if (k === "belum_aktif") return jawab(503, { error: "belum_aktif" });
  if (k === "tanpa_sesi") return jawab(401, { error: "tanpa_sesi" });
  const { admin } = k;

  const body = (await req.json().catch(() => null)) as { konfirmasi?: unknown } | null;
  if (body?.konfirmasi !== "HAPUS") return jawab(400, { error: "konfirmasi" });

  const token = req.headers.get("authorization")!.replace(/^Bearer\s+/i, "");
  const { data: u, error: eu } = await admin.auth.getUser(token);
  if (eu || !u.user) return jawab(401, { error: "sesi_tidak_sah" });
  const uid = u.user.id;

  const { data: rumah, error: er } = await admin.from("family").select("id").eq("created_by", uid);
  if (er) {
    console.error("[akun/hapus] baca rumah gagal", er);
    return jawab(500, { error: "gagal" });
  }

  for (const { id } of rumah ?? []) {
    for (const b of BUCKET) {
      const berkas = await semuaBerkas(admin, b, id);
      for (let i = 0; i < berkas.length; i += 100) {
        const { error } = await admin.storage.from(b).remove(berkas.slice(i, i + 100));
        if (error) console.error(`[akun/hapus] hapus berkas ${b} gagal`, error);
      }
    }
  }

  const { error: ed } = await admin.auth.admin.deleteUser(uid);
  if (ed) {
    console.error("[akun/hapus] hapus pengguna gagal", ed);
    return jawab(500, { error: "gagal" });
  }
  return jawab(200, { ok: true, rumah: rumah?.length ?? 0 });
}
