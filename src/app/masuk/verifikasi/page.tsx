"use client";

// Tujuan tautan email konfirmasi akun, tautan masuk, dan ganti email. Template email (supabase/templates)
// mengirim ?token_hash=…&type=… ke domain Academy, bukan ke *.supabase.co; halaman ini memanggil verifyOtp
// lalu kembali ke /masuk (buat rumah atau pilih profil). Reset kata sandi punya halaman sendiri: /masuk/sandi-baru.

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";
import { useLook } from "../account";

const JENIS: Record<string, { tipe: EmailOtpType; ok: string }> = {
  signup: { tipe: "email", ok: "Akun terkonfirmasi" },
  email: { tipe: "email", ok: "Akun terkonfirmasi" },
  magiclink: { tipe: "email", ok: "Berhasil masuk" },
  invite: { tipe: "invite", ok: "Undangan diterima" },
  email_change: { tipe: "email_change", ok: "Email akun diganti" },
};

export default function Verifikasi() {
  const L = useLook("playful");
  const router = useRouter();
  const [tahap, setTahap] = useState<"cek" | "ok" | "gagal">("cek");
  const [judul, setJudul] = useState("");
  const sudah = useRef(false);

  useEffect(() => {
    if (sudah.current) return;
    sudah.current = true;
    const q = new URLSearchParams(window.location.search);
    const token = q.get("token_hash");
    const j = JENIS[q.get("type") ?? ""];
    if (!token || !j) {
      setTahap("gagal");
      return;
    }
    supabase()
      .auth.verifyOtp({ token_hash: token, type: j.tipe })
      .then(({ error }) => {
        history.replaceState(null, "", window.location.pathname);
        if (error) return setTahap("gagal");
        setJudul(j.ok);
        setTahap("ok");
        setTimeout(() => router.replace("/masuk"), 1500);
      });
  }, [router]);

  return (
    <div className="bg-dots fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-5 py-8" style={{ fontFamily: NUNITO }}>
      <div className="anim-fade relative flex w-full max-w-[420px] flex-col items-center gap-5 bg-white px-7 pt-8 pb-7 text-center" style={L.card}>
        <Image src="/brand/rinoya-logo-r.png" alt="RINOYA Academy" width={1137} height={800} priority className="h-auto w-[160px]" />
        {tahap === "cek" && (
          <p role="status" style={{ color: L.muted, fontWeight: 700 }}>
            Memeriksa tautan…
          </p>
        )}
        {tahap === "ok" && (
          <>
            <Icon name="check_circle" size={48} style={{ color: "#12b8a6" }} />
            <h1 style={L.title}>{judul}</h1>
            <p style={{ color: L.muted, fontWeight: 600 }}>Sebentar, kami antar ke rumahmu…</p>
          </>
        )}
        {tahap === "gagal" && (
          <>
            <Icon name="link_off" size={44} style={{ color: "#c0283a" }} />
            <h1 style={L.title}>Tautan tidak bisa dipakai</h1>
            <p style={{ color: L.muted, fontWeight: 600, lineHeight: 1.5 }}>
              Tautannya sudah kedaluwarsa atau sudah dipakai. Masuk lagi atau minta tautan baru dari halaman masuk.
            </p>
            <Link href="/masuk" className="flex w-full items-center justify-center" style={L.primary}>
              Ke halaman masuk
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
