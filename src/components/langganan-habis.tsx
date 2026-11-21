"use client";

// Layar pengganti saat masa coba / langganan rumah habis dan owner menyalakan kunci akses (lihat lib/akademi/langganan.ts).
// Ditulis untuk anak (yang paling sering melihatnya) sekaligus orang tua: tombol ke Ruang Orang Tua → tab Langganan.
// Di app toko (lib/mode-app.ts) tanpa ajakan membayar: hanya tombol ke Ruang Orang Tua; pembayaran lewat situs web.

import Image from "next/image";
import Link from "next/link";
import { BALOO, NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { useLangganan } from "@/lib/akademi/langganan";
import { useModeApp } from "@/lib/mode-app";

export function LanggananHabis() {
  const { aktifSampai, menunggu } = useLangganan();
  const app = useModeApp();
  const judul = aktifSampai ? (app ? "Masa aktif sudah berakhir" : "Langganan sudah berakhir") : "Masa coba sudah selesai";
  return (
    <div className="bg-dots fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-5 py-8" style={{ fontFamily: NUNITO, color: "#0b2545" }}>
      <div className="anim-fade flex w-full max-w-[440px] flex-col items-center gap-4 rounded-[28px] bg-white px-7 pt-8 pb-7 text-center shadow-[0_6px_0_rgba(11,37,69,.08)]">
        <Image src="/brand/rinoya-logo-r.png" alt="RINOYA Academy" width={1137} height={800} priority className="h-auto w-[140px]" />
        <h1 style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{judul}</h1>
        {menunggu > 0 && !app ? (
          <p className="text-[15px] font-bold text-ink-2">Pembayaranmu sedang kami periksa. Kampus terbuka lagi begitu pembayaran diterima, biasanya di hari yang sama.</p>
        ) : app ? (
          <p className="text-[15px] font-bold text-ink-2">Minta ayah atau bunda mengaktifkan akun rumah supaya kamu bisa belajar dan bermain lagi di kampus.</p>
        ) : (
          <p className="text-[15px] font-bold text-ink-2">Minta ayah atau bunda melanjutkan langganan supaya kamu bisa belajar dan bermain lagi di kampus.</p>
        )}
        <Link href={app ? "/orang-tua" : "/orang-tua?tab=langganan"} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-extrabold text-white" style={{ background: "#0786eb" }}>
          <Icon name={app ? "family_restroom" : "card_membership"} size={20} /> {app ? "Ruang Orang Tua" : "Lanjutkan langganan"}
        </Link>
        <p className="text-[12.5px] font-bold text-ink-3">Rapor dan sertifikat tetap bisa dibuka di Ruang Orang Tua.</p>
      </div>
    </div>
  );
}
