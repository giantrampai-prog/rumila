"use client";

// Status langganan rumah (RPC akademi_status_langganan) untuk gerbang akses di AppShell. Dibaca saat aplikasi
// dibuka, tiap 10 menit, dan saat tab kembali aktif. Gagal baca / offline / anggota demo = TIDAK dikunci
// (lebih baik anak tetap belajar daripada terkunci karena sinyal jelek).

import { useEffect } from "react";
import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StatusLangganan = { terkunci: boolean; trialSampai: string | null; aktifSampai: string | null; menunggu: number };
export const useLangganan = create<StatusLangganan>()(() => ({ terkunci: false, trialSampai: null, aktifSampai: null, menunggu: 0 }));

export async function muatLangganan(): Promise<void> {
  const fid = useCloud.getState().familyId;
  if (!fid || !UUID.test(fid)) return useLangganan.setState({ terkunci: false });
  const { data, error } = await supabase().rpc("akademi_status_langganan", { fid });
  if (error || !data || typeof data !== "object") return;
  const d = data as { terkunci?: boolean; trial_sampai?: string; aktif_sampai?: string | null; menunggu?: number };
  useLangganan.setState({ terkunci: !!d.terkunci, trialSampai: d.trial_sampai ?? null, aktifSampai: d.aktif_sampai ?? null, menunggu: d.menunggu ?? 0 });
}

/** Pasang pembaca status langganan (sekali di AppShell). */
export function usePantauLangganan() {
  const fid = useCloud((s) => s.familyId);
  useEffect(() => {
    void muatLangganan();
    const t = setInterval(() => void muatLangganan(), 10 * 60_000);
    const fokus = () => document.visibilityState === "visible" && void muatLangganan();
    document.addEventListener("visibilitychange", fokus);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", fokus);
    };
  }, [fid]);
}

/** Halaman yang tetap terbuka saat langganan habis: bayar, rapor, sertifikat, piagam. */
export const BEBAS_KUNCI = ["/orang-tua", "/akademi/rapor", "/akademi/sertifikat", "/akademi/piagam"];
export const bebasKunci = (path: string) => BEBAS_KUNCI.some((r) => path.startsWith(r));
