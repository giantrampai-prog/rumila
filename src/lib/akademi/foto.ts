"use client";

// Foto anak untuk buku sertifikat. Diunggah orang tua di Ruang Orang Tua (ber-PIN) ke bucket PRIVAT `foto-anak`
// (path <family_id>/foto-anak/<member_id>.jpg). Dipotong persegi & dikecilkan di perangkat (720 px, JPEG) sebelum
// diunggah. Ditampilkan lewat signed URL berumur pendek; TIDAK pernah tampil di halaman verifikasi publik.
// Anggota demo (id bukan UUID) / belum punya rumah: foto disimpan lokal sebagai data URL.

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";

const BUCKET = "foto-anak";
const SISI = 720;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EVENT = "rumila:foto-anak";
const LOKAL = (id: string) => `rinoya-foto-anak-${id}`;

const lokasi = (memberId: string) => {
  const fid = useCloud.getState().familyId;
  return fid && UUID.test(memberId) ? `${fid}/foto-anak/${memberId}.jpg` : null;
};

/** Potong tengah jadi persegi & kecilkan → JPEG. */
async function siapkan(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(bmp.width, bmp.height);
  const c = document.createElement("canvas");
  c.width = c.height = Math.min(SISI, s);
  c.getContext("2d")!.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, c.width, c.height);
  return new Promise((ok, gagal) => c.toBlob((b) => (b ? ok(b) : gagal(new Error("gagal_kompres"))), "image/jpeg", 0.88));
}

const cache = new Map<string, { url: string; sampai: number }>();
const umumkan = (id: string) => window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));

export async function unggahFoto(memberId: string, file: File): Promise<void> {
  if (!/^image\//.test(file.type)) throw new Error("Berkas harus gambar (JPG/PNG).");
  const blob = await siapkan(file);
  const path = lokasi(memberId);
  if (!path) {
    const url = await new Promise<string>((ok) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result));
      r.readAsDataURL(blob);
    });
    try {
      localStorage.setItem(LOKAL(memberId), url);
    } catch {
      throw new Error("Penyimpanan perangkat penuh.");
    }
  } else {
    const { error } = await supabase().storage.from(BUCKET).upload(path, blob, { upsert: true, contentType: "image/jpeg", cacheControl: "60" });
    if (error) throw new Error(/bucket/i.test(error.message) ? "Penyimpanan foto belum disiapkan di server." : error.message);
  }
  cache.delete(memberId);
  umumkan(memberId);
}

export async function hapusFoto(memberId: string): Promise<void> {
  const path = lokasi(memberId);
  if (path) await supabase().storage.from(BUCKET).remove([path]);
  try {
    localStorage.removeItem(LOKAL(memberId));
  } catch {}
  cache.delete(memberId);
  umumkan(memberId);
}

export async function urlFoto(memberId: string): Promise<string | null> {
  const ada = cache.get(memberId);
  if (ada && ada.sampai > Date.now()) return ada.url;
  const path = lokasi(memberId);
  if (!path) {
    try {
      return localStorage.getItem(LOKAL(memberId));
    } catch {
      return null;
    }
  }
  const { data, error } = await supabase().storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  cache.set(memberId, { url: data.signedUrl, sampai: Date.now() + 50 * 60_000 });
  return data.signedUrl;
}

/** URL foto anak (null = belum ada). */
export function useFotoAnak(memberId: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!memberId) return setUrl(null);
    let batal = false;
    const muat = () => void urlFoto(memberId).then((u) => !batal && setUrl(u));
    muat();
    const segar = (e: Event) => (e as CustomEvent).detail === memberId && muat();
    window.addEventListener(EVENT, segar);
    return () => {
      batal = true;
      window.removeEventListener(EVENT, segar);
    };
  }, [memberId]);
  return url;
}
