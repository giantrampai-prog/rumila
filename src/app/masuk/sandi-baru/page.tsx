"use client";

// Tujuan tautan email "buat kata sandi baru" (Supabase Auth resetPasswordForEmail, dikirim lewat SMTP Resend
// kampus@pulaurinoya.com). Template email mengirim ?token_hash=…&type=recovery ke domain Academy (bukan ke
// *.supabase.co), lalu halaman ini memanggil verifyOtp. Tautan lama (#access_token dari /auth/v1/verify) tetap
// dilayani lewat sesi yang dibaca supabase-js. Lalu kata sandi baru disimpan dengan updateUser.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { friendlyError, supabase } from "@/lib/supabase/client";
import { ErrorLine, Field, useLook } from "../account";

type Tahap = "cek" | "siap" | "gagal" | "selesai";

/** Pesan error yang ditaruh Supabase di hash/query saat tautan tidak sah (mis. otp_expired). */
function errorDariUrl(): string | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.hash.replace(/^#/, "") || window.location.search);
  const kode = p.get("error_code") || p.get("error");
  if (!kode) return null;
  if (/expired/i.test(kode) || /expired/i.test(p.get("error_description") || "")) return "Tautannya sudah kedaluwarsa atau sudah dipakai.";
  return p.get("error_description") || "Tautannya tidak sah.";
}

export default function SandiBaru() {
  const L = useLook("playful");
  const [tahap, setTahap] = useState<Tahap>("cek");
  const [alasan, setAlasan] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [sandi, setSandi] = useState("");
  const [ulang, setUlang] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const tokenDipakai = useRef(false);

  useEffect(() => {
    const salahUrl = errorDariUrl();
    if (salahUrl) {
      setAlasan(salahUrl);
      setTahap("gagal");
      return;
    }
    const sb = supabase();
    let selesai = false;
    // Tautan baru (template email): ?token_hash=…&type=recovery langsung ke domain Academy, diverifikasi di sini.
    const q = new URLSearchParams(window.location.search);
    const tokenHash = q.get("token_hash");
    if (tokenHash) {
      if (tokenDipakai.current) return;
      tokenDipakai.current = true;
      sb.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" }).then(({ data, error }) => {
        selesai = true;
        if (error || !data.session) {
          setAlasan(/expired|invalid/i.test(error?.message ?? "") ? "Tautannya sudah kedaluwarsa atau sudah dipakai." : "Tautannya tidak sah.");
          setTahap("gagal");
          return;
        }
        setEmail(data.session.user.email ?? null);
        setTahap("siap");
        history.replaceState(null, "", window.location.pathname);
      });
      return;
    }
    const siap = (mail: string | null | undefined) => {
      if (selesai) return;
      selesai = true;
      setEmail(mail ?? null);
      setTahap("siap");
      // Token di URL tidak perlu terlihat/tersimpan di riwayat.
      if (window.location.hash) history.replaceState(null, "", window.location.pathname);
    };
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) siap(session.user.email);
    });
    sb.auth.getSession().then(({ data }) => {
      if (data.session) siap(data.session.user.email);
    });
    const t = setTimeout(() => {
      if (selesai) return;
      selesai = true;
      setAlasan("Tautannya sudah kedaluwarsa, sudah dipakai, atau dibuka di browser lain.");
      setTahap("gagal");
    }, 6000);
    return () => {
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, []);

  const simpan = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (sandi.length < 6) return setErr("Kata sandi minimal 6 karakter.");
    if (sandi !== ulang) return setErr("Kedua kata sandi belum sama.");
    setBusy(true);
    const { error } = await supabase().auth.updateUser({ password: sandi });
    setBusy(false);
    if (error) setErr(/different from the old/i.test(error.message) ? "Kata sandi baru harus berbeda dari yang lama." : friendlyError(error));
    else setTahap("selesai");
  };

  return (
    <div className="bg-dots fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-5 py-8" style={{ fontFamily: NUNITO }}>
      <div className="anim-fade relative flex w-full max-w-[420px] flex-col items-center gap-5 bg-white px-7 pt-8 pb-7 text-center" style={L.card}>
        <Image src="/brand/rinoya-logo-r.png" alt="RINOYA Academy" width={1137} height={800} priority className="h-auto w-[160px]" />
        {tahap === "cek" && (
          <p role="status" style={{ color: L.muted, fontWeight: 700 }}>
            Memeriksa tautan…
          </p>
        )}
        {tahap === "gagal" && (
          <>
            <Icon name="link_off" size={44} style={{ color: "#c0283a" }} />
            <h1 style={L.title}>Tautan tidak bisa dipakai</h1>
            <p style={{ color: L.muted, fontWeight: 600, lineHeight: 1.5 }}>{alasan} Minta tautan baru dari halaman masuk, lalu buka dari email yang terbaru.</p>
            <Link href="/masuk" className="flex w-full items-center justify-center" style={L.primary}>
              Kembali ke halaman masuk
            </Link>
          </>
        )}
        {tahap === "siap" && (
          <>
            <div>
              <h1 style={L.title}>Buat kata sandi baru</h1>
              <p className="mt-1.5" style={{ color: L.muted, fontWeight: 600, fontSize: 14 }}>
                Untuk akun rumah {email ? <b style={{ color: L.ink }}>{email}</b> : "kamu"}.
              </p>
            </div>
            <form onSubmit={simpan} className="flex w-full flex-col gap-3.5">
              <Field label="Kata sandi baru" muted={L.muted}>
                <input type="password" required minLength={6} autoComplete="new-password" value={sandi} onChange={(e) => setSandi(e.target.value)} style={L.input} placeholder="Minimal 6 karakter" />
              </Field>
              <Field label="Ulangi kata sandi baru" muted={L.muted}>
                <input type="password" required minLength={6} autoComplete="new-password" value={ulang} onChange={(e) => setUlang(e.target.value)} style={L.input} />
              </Field>
              <ErrorLine msg={err} />
              <button type="submit" disabled={busy} className="mt-1 transition-transform active:translate-y-[3px] disabled:opacity-60" style={L.primary}>
                {busy ? "Menyimpan…" : "Simpan kata sandi"}
              </button>
            </form>
          </>
        )}
        {tahap === "selesai" && (
          <>
            <Icon name="check_circle" size={48} style={{ color: "#12b8a6" }} />
            <h1 style={L.title}>Kata sandi tersimpan</h1>
            <p style={{ color: L.muted, fontWeight: 600, lineHeight: 1.5 }}>
              Pakai kata sandi baru ini untuk masuk dan untuk membuat PIN baru kalau lupa PIN orang tua.
            </p>
            <Link href="/masuk" className="flex w-full items-center justify-center" style={L.primary}>
              Lanjut ke rumah
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
