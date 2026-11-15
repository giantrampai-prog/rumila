"use client";

// Hasil ujian di aplikasi: salinan lokal localStorage["rumila-akademi-ujian-<memberId>"] + tarik dari tabel
// akademi_ujian (server menang). Nilai resmi dihitung server (/api/akademi/ujian) dari jawaban yang tercatat.
// Anggota demo (id bukan UUID) dan keadaan offline: hasil disimpan lokal sebagai pending; pending dikirim ulang
// saat online. Server bisa menolak pending (mis. tunggu besok) → salinan pending dibuang.

import { useEffect, useState } from "react";
import type { LevelId } from "@akademi/schema";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";
import { kirimAntrean } from "./jejak";
import { setLevelAnak } from "./konten";
import type { HasilUjian, JenisUjian } from "./ujian";

const PREFIX = "rumila-akademi-ujian-";
const EVENT = "rumila:akademi-ujian";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const adaWindow = () => typeof window !== "undefined";

export function ujianAnak(memberId: string): HasilUjian[] {
  if (!adaWindow()) return [];
  try {
    const arr = JSON.parse(localStorage.getItem(PREFIX + memberId) ?? "[]") as unknown;
    return Array.isArray(arr) ? (arr as HasilUjian[]).filter((h) => h && typeof h.sessionId === "string") : [];
  } catch {
    return [];
  }
}

function simpan(memberId: string, daftar: HasilUjian[]) {
  if (!adaWindow()) return;
  try {
    localStorage.setItem(PREFIX + memberId, JSON.stringify(daftar));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: memberId }));
}

function taruh(memberId: string, h: HasilUjian) {
  simpan(memberId, [...ujianAnak(memberId).filter((x) => x.sessionId !== h.sessionId), h]);
}

export function useUjian(memberId: string): HasilUjian[] {
  const [daftar, setDaftar] = useState<HasilUjian[]>(() => ujianAnak(memberId));
  useEffect(() => {
    setDaftar(ujianAnak(memberId));
    const segar = (e: Event) => {
      if ((e as CustomEvent).detail === memberId) setDaftar(ujianAnak(memberId));
    };
    window.addEventListener(EVENT, segar);
    return () => window.removeEventListener(EVENT, segar);
  }, [memberId]);
  return daftar;
}

const terhubung = (memberId: string) => adaWindow() && UUID.test(memberId) && !!useCloud.getState().familyId;

/** Tarik hasil ujian dari server, gabung dengan pending lokal. */
export async function ambilUjian(memberId: string): Promise<HasilUjian[]> {
  if (!terhubung(memberId)) return ujianAnak(memberId);
  const { data, error } = await supabase()
    .from("akademi_ujian")
    .select("jenis, level, ruang, session_id, benar, total, nilai, lulus, created_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const server: HasilUjian[] = (data ?? []).map((r) => ({ jenis: r.jenis as JenisUjian, level: r.level as LevelId, ruang: r.ruang, sessionId: r.session_id, benar: r.benar, total: r.total, nilai: r.nilai, lulus: r.lulus, at: r.created_at }));
  const pending = ujianAnak(memberId).filter((h) => h.pending && !server.some((s) => s.sessionId === h.sessionId));
  simpan(memberId, [...server, ...pending]);
  if (pending.length) void kirimTertunda(memberId);
  return [...server, ...pending];
}

export type HasilKirim = { ok: true; hasil: HasilUjian; levelBaru?: LevelId } | { ok: false; alasan: string };

async function minta(memberId: string, h: Pick<HasilUjian, "jenis" | "level" | "ruang" | "sessionId">): Promise<HasilKirim> {
  try {
    await kirimAntrean();
    const { data } = await supabase().auth.getSession();
    const token = data.session?.access_token;
    if (!token) return { ok: false, alasan: "tanpa_sesi" };
    const res = await fetch("/api/akademi/ujian", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ memberId, jenis: h.jenis, level: h.level, ruang: h.ruang, sessionId: h.sessionId }),
    });
    const j = (await res.json().catch(() => ({}))) as { ujian?: HasilUjian; levelBaru?: LevelId; error?: string };
    if (res.ok && j.ujian) return { ok: true, hasil: j.ujian, levelBaru: j.levelBaru };
    return { ok: false, alasan: j.error ?? `http_${res.status}` };
  } catch {
    return { ok: false, alasan: "jaringan" };
  }
}

const sementara = (a: string) => a === "jaringan" || a === "penerbit_belum_aktif" || a === "galat" || a.startsWith("http_5");

/**
 * Serahkan hasil ujian. `lokal` = hitungan di perangkat (dipakai bila offline / anggota demo, ditandai pending).
 * Mengembalikan hasil resmi server bila ada.
 */
export async function serahkanUjian(memberId: string, lokal: HasilUjian): Promise<HasilKirim> {
  if (!terhubung(memberId)) {
    const h = { ...lokal, pending: !UUID.test(memberId) ? false : true };
    taruh(memberId, h);
    if (h.jenis === "penempatan" && (h.lulus || h.level === "PAUD")) setLevelAnak(memberId, h.level);
    return { ok: true, hasil: h };
  }
  // jawaban terakhir perlu sampai ke server dulu; beri jeda singkat bila antrean baru saja terkirim
  let r = await minta(memberId, lokal);
  if (!r.ok && r.alasan === "belum_lengkap") {
    await new Promise((ok) => setTimeout(ok, 2500));
    r = await minta(memberId, lokal);
  }
  if (r.ok) {
    taruh(memberId, { ...r.hasil, pending: false });
    if (r.levelBaru) setLevelAnak(memberId, r.levelBaru);
    return r;
  }
  if (sementara(r.alasan)) {
    const h = { ...lokal, pending: true };
    taruh(memberId, h);
    return { ok: true, hasil: h };
  }
  return r;
}

let sedang = false;
async function kirimTertunda(memberId: string) {
  if (sedang) return;
  sedang = true;
  try {
    for (const h of ujianAnak(memberId).filter((x) => x.pending)) {
      const r = await minta(memberId, h);
      if (r.ok) {
        taruh(memberId, { ...r.hasil, pending: false });
        if (r.levelBaru) setLevelAnak(memberId, r.levelBaru);
      } else if (!sementara(r.alasan)) simpan(memberId, ujianAnak(memberId).filter((x) => x.sessionId !== h.sessionId));
    }
  } finally {
    sedang = false;
  }
}
