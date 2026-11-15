// Bantuan bersama route server Academy (/api/akademi/*): klien Supabase pemanggil & service role, cek anggota,
// baca seluruh event anak. HANYA dipakai di route handler (butuh SUPABASE_SERVICE_ROLE_KEY).

import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { BarisEvent } from "./sertifikat-inti";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const jawab = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export type Admin = SupabaseClient<Database>;

/** Klien untuk satu permintaan: `pemanggil` (token pengguna, kena RLS) dan `admin` (service role). null = belum dikonfigurasi. */
export function klien(req: Request): { pemanggil: Admin; admin: Admin } | "belum_aktif" | "tanpa_sesi" {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publik = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const rahasia = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publik || !rahasia) return "belum_aktif";
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return "tanpa_sesi";
  const opsi = { auth: { persistSession: false, autoRefreshToken: false } };
  return {
    pemanggil: createClient<Database>(url, publik, { ...opsi, global: { headers: { Authorization: `Bearer ${token}` } } }),
    admin: createClient<Database>(url, rahasia, opsi),
  };
}

/** Anggota yang boleh diakses pemanggil (RLS member), atau kode galat HTTP. */
export async function anggotaMilik(pemanggil: Admin, memberId: string): Promise<{ id: string; family_id: string } | 401 | 403> {
  const { data, error } = await pemanggil.from("member").select("id, family_id").eq("id", memberId).maybeSingle();
  if (error) return 401;
  return data ?? 403;
}

const HALAMAN = 1000;
const MAKS_EVENT = 60_000;

/** Seluruh event anak (atau satu sesi), urut created_at. */
export async function semuaEvent(admin: Admin, memberId: string, sessionId?: string): Promise<BarisEvent[] | null> {
  const rows: BarisEvent[] = [];
  for (let dari = 0; dari < MAKS_EVENT; dari += HALAMAN) {
    let q = admin
      .from("learner_event")
      .select("id, member_id, session_id, activity_id, mechanic, type, payload, client_at, created_at")
      .eq("member_id", memberId);
    if (sessionId) q = q.eq("session_id", sessionId);
    const { data, error } = await q.order("created_at", { ascending: true }).range(dari, dari + HALAMAN - 1);
    if (error) {
      console.error("[akademi] baca learner_event gagal", error);
      return null;
    }
    rows.push(...((data ?? []) as BarisEvent[]));
    if (!data || data.length < HALAMAN) break;
  }
  return rows;
}
