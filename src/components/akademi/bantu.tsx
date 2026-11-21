"use client";

// Satu tombol Bantu untuk semua presenter. Dipasang (portal) ke kepala layar aktivitas di sebelah tombol musik,
// jadi posisinya selalu sama; di luar LayarAktivitas (mis. pratinjau) tampil di tempat. Disembunyikan saat ujian.

import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { LencanaSisa, useModeUjian, useSisaBantu, useSlotBantu } from "./mode-ujian";
import { NUNITO } from "./jenis";

export function TombolBantu({ onClick, disabled, label = "Bantu", ikon = "lightbulb" }: { onClick: () => void; disabled?: boolean; label?: string; ikon?: string }) {
  const sisa = useSisaBantu();
  const slot = useSlotBantu();
  const ujian = useModeUjian();
  if (ujian) return null;
  const tombol = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || sisa === 0}
      aria-label={sisa === null ? label : `${label}, sisa ${sisa}`}
      className="relative flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-[16px] bg-[#ffd23f] px-2.5 text-[#0b2545] shadow-[0_4px_0_#d9a90b] active:translate-y-0.5 disabled:opacity-45"
      style={{ fontFamily: NUNITO, fontSize: 15, fontWeight: 800, minWidth: 44 }}
    >
      <Icon name={ikon} size={22} />
      <span className="hidden min-[420px]:inline">{label}</span>
      <LencanaSisa sisa={sisa} />
    </button>
  );
  return slot ? createPortal(tombol, slot) : tombol;
}
