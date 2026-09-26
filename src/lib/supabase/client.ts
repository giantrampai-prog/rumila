"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Satu klien Supabase untuk seluruh app (sesi akun disimpan di localStorage oleh supabase-js).

let client: SupabaseClient<Database> | null = null;

export function supabase(): SupabaseClient<Database> {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diisi di .env.local");
  client = createClient<Database>(url, key, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}

/** Pesan error Supabase → bahasa yang ramah. */
export function friendlyError(e: unknown): string {
  const msg = typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  if (/Invalid login credentials/i.test(msg)) return "Nama pengguna/email atau kata sandi belum cocok.";
  if (/Email not confirmed/i.test(msg))
    return 'Akun belum dikonfirmasi. Pakai email: cek kotak masuk. Pakai nama pengguna: matikan "Confirm email" di Supabase.';
  if (/User already registered/i.test(msg)) return "Email ini sudah terdaftar. Coba masuk saja.";
  if (/Password should be at least/i.test(msg)) return "Kata sandi minimal 6 karakter.";
  if (/email address .* is invalid|email_address_invalid/i.test(msg)) return "Server menolak alamat ini. Coba pakai email asli.";
  if (/Signups not allowed/i.test(msg)) return "Pendaftaran akun baru sedang ditutup di server.";
  if (/rate limit/i.test(msg)) return "Terlalu sering mencoba. Tunggu sebentar, ya.";
  if (/Failed to fetch|NetworkError/i.test(msg)) return "Koneksi internet bermasalah. Coba lagi.";
  return msg;
}
