"use client";

// Mode ujian: presenter permainan menyembunyikan semua tombol bantuan (Bantu, Lihat lagi) selama ujian.

import { createContext, useContext } from "react";

const ModeUjian = createContext(false);
export const ModeUjianProvider = ModeUjian.Provider;
export const useModeUjian = () => useContext(ModeUjian);

/** Sisa jatah Bantu dalam satu permainan (null = tanpa batas, mis. pratinjau). Diisi runner. */
const SisaBantu = createContext<number | null>(null);
export const SisaBantuProvider = SisaBantu.Provider;
export const useSisaBantu = () => useContext(SisaBantu);

/** Lencana angka sisa Bantu di pojok tombol; tombol induk wajib `relative`. */
export function LencanaSisa({ sisa }: { sisa: number | null }) {
  if (sisa === null) return null;
  return (
    <span aria-hidden className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: sisa > 0 ? "#e0732a" : "#9aa6b8", boxShadow: "0 0 0 2px #fff" }}>
      {sisa}
    </span>
  );
}
