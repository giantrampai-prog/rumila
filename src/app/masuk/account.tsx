"use client";

// Tahap sebelum pilih profil: masuk/daftar akun rumah (Supabase Auth) dan buat rumah baru.

import Image from "next/image";
import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { CAT, MEMBER_COLORS, PLAY, type ColorKey } from "@/lib/catalog";
import { friendlyError, supabase } from "@/lib/supabase/client";
import { createFamily, signOutAccount } from "@/lib/supabase/family";
import type { Theme } from "@/lib/store";

const PI = "#2b1d4e";
const NV = "#1F3044";

function useLook(theme: Theme) {
  const play = theme === "playful";
  const card: CSSProperties = play
    ? { borderRadius: 40, boxShadow: "0 10px 0 rgba(43,29,78,.1), 0 40px 80px rgba(43,29,78,.15)" }
    : { borderRadius: 32, border: "1px solid #ece9e3", boxShadow: "0 30px 80px rgba(31,48,68,.12)" };
  const title: CSSProperties = play
    ? { fontFamily: BALOO, fontSize: 30, fontWeight: 800, color: PI, lineHeight: 1.1 }
    : { fontSize: 24, fontWeight: 700, color: NV, letterSpacing: "-.02em" };
  const input: CSSProperties = {
    height: 50,
    borderRadius: 14,
    border: `1.5px solid ${play ? "#e6def0" : "#dfe2e7"}`,
    padding: "0 14px",
    fontSize: 15,
    fontWeight: play ? 700 : 500,
    color: play ? PI : NV,
    background: "#fff",
    outline: "none",
    width: "100%",
  };
  const primary: CSSProperties = play
    ? { height: 54, borderRadius: 18, background: "#ff7a1a", color: "#fff", fontWeight: 900, fontSize: 17, boxShadow: "0 4px 0 #d95a00" }
    : { height: 52, borderRadius: 14, background: NV, color: "#fff", fontWeight: 700, fontSize: 15 };
  const muted = play ? "#8a7a9c" : "#7A8494";
  return { play, card, title, input, primary, muted, ink: play ? PI : NV };
}

function Field({ label, children, muted }: { label: string; children: ReactNode; muted: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span style={{ fontSize: 13, fontWeight: 700, color: muted }}>{label}</span>
      {children}
    </label>
  );
}

function ErrorLine({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="rounded-xl px-3 py-2 text-sm font-semibold" style={{ background: "#FDE2E3", color: "#B5434A" }}>
      {msg}
    </p>
  );
}

/* ---------------- Masuk / Daftar akun ---------------- */

/** Domain internal untuk akun berbasis nama pengguna (Supabase Auth hanya mengenal email). */
const USERNAME_DOMAIN = "rumila.local";
const isUsername = (v: string) => !v.includes("@");
/** "rumila" → "rumila@rumila.local"; email biasa dibiarkan. */
export const toLoginEmail = (v: string) => (isUsername(v) ? `${v.trim().toLowerCase()}@${USERNAME_DOMAIN}` : v.trim());
/** Kebalikannya, untuk ditampilkan: "rumila@rumila.local" → "rumila". */
export const displayLogin = (email: string | null) => (email?.endsWith("@" + USERNAME_DOMAIN) ? email.split("@")[0] : email);

export function AccountStage({ theme }: { theme: Theme }) {
  const L = useLook(theme);
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState<"" | "email" | "username">("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    const login = email.trim();
    if (isUsername(login) && !/^[a-z0-9._-]{3,30}$/i.test(login)) {
      setErr("Nama pengguna 3–30 karakter: huruf, angka, titik, strip, atau garis bawah.");
      return;
    }
    setBusy(true);
    try {
      const sb = supabase();
      if (mode === "masuk") {
        const { error } = await sb.auth.signInWithPassword({ email: toLoginEmail(login), password });
        if (error) throw error;
      } else {
        const { data, error } = await sb.auth.signUp({
          email: toLoginEmail(login),
          password,
          options: { emailRedirectTo: `${window.location.origin}/masuk` },
        });
        if (error) throw error;
        // Tanpa sesi = Supabase masih mewajibkan konfirmasi email.
        if (!data.session) setSent(isUsername(login) ? "username" : "email");
      }
    } catch (e) {
      setErr(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="anim-fade relative flex w-full max-w-[420px] flex-col items-center gap-5 bg-white px-7 pt-8 pb-7 text-center"
      style={L.card}
    >
      <Image src="/brand/rinoya-logo.png" alt="Rinoya Academy" width={240} height={78} priority className="h-auto w-[240px]" />
      {sent ? (
        <>
          <Icon name={sent === "email" ? "mark_email_read" : "info"} size={48} style={{ color: L.play ? "#12b8a6" : "#52B8A8" }} />
          <h1 style={L.title}>{sent === "email" ? "Cek email kamu" : "Satu langkah lagi"}</h1>
          <p style={{ color: L.muted, fontWeight: 600, lineHeight: 1.5 }}>
            {sent === "email" ? (
              <>
                Kami kirim tautan konfirmasi ke <b style={{ color: L.ink }}>{email}</b>. Buka tautannya, lalu kamu akan kembali ke sini
                untuk membuat rumah.
              </>
            ) : (
              <>
                Akun <b style={{ color: L.ink }}>{email}</b> dibuat, tapi server masih mewajibkan konfirmasi email. Untuk masuk pakai nama
                pengguna, matikan &ldquo;Confirm email&rdquo; di Supabase (Authentication → Sign In / Providers → Email), lalu masuk lagi.
              </>
            )}
          </p>
          <button
            onClick={() => setSent("")}
            className="w-full"
            style={{ ...L.primary, background: "transparent", color: L.ink, boxShadow: "none" }}
          >
            Kembali
          </button>
        </>
      ) : (
        <>
          <div>
            <h1 style={L.title}>{mode === "masuk" ? "Masuk ke rumahmu" : "Bikin akun rumah"}</h1>
            <p className="mt-1.5" style={{ color: L.muted, fontWeight: 600, fontSize: 14 }}>
              {mode === "masuk" ? "Satu akun untuk seluruh keluarga." : "Nanti tiap anggota punya profil sendiri."}
            </p>
          </div>
          <form onSubmit={submit} className="flex w-full flex-col gap-3.5">
            <Field label="Nama pengguna atau email" muted={L.muted}>
              <input
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={L.input}
                placeholder="Nama pengguna atau email"
              />
            </Field>
            <Field label="Kata sandi" muted={L.muted}>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "masuk" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={L.input}
                placeholder="Minimal 6 karakter"
              />
            </Field>
            <ErrorLine msg={err} />
            <button
              type="submit"
              disabled={busy}
              className="mt-1 transition-transform active:translate-y-[3px] disabled:opacity-60"
              style={L.primary}
            >
              {busy ? "Sebentar…" : mode === "masuk" ? "Masuk" : "Daftar"}
            </button>
          </form>
          <p style={{ fontSize: 14, fontWeight: 600, color: L.muted }}>
            {mode === "masuk" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => {
                setMode(mode === "masuk" ? "daftar" : "masuk");
                setErr("");
              }}
              className="font-bold underline underline-offset-2"
              style={{ color: L.ink }}
            >
              {mode === "masuk" ? "Daftar gratis" : "Masuk"}
            </button>
          </p>
        </>
      )}
    </div>
  );
}

/* ---------------- Buat rumah ---------------- */

export function SetupStage({ theme, email }: { theme: Theme; email: string | null }) {
  const L = useLook(theme);
  const [family, setFamily] = useState("");
  const [name, setName] = useState("");
  const [c, setC] = useState<ColorKey>("indigo");
  const [pin, setPinVal] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ok = family.trim() && name.trim() && (pin === "" || /^\d{4}$/.test(pin));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    setErr("");
    setBusy(true);
    try {
      await createFamily(family.trim(), name.trim(), c, pin || null);
    } catch (e) {
      setErr(friendlyError(e));
      setBusy(false);
    }
  };

  return (
    <div className="anim-fade relative flex w-full max-w-[460px] flex-col gap-5 bg-white px-7 pt-8 pb-7" style={L.card}>
      <div className="text-center">
        <h1 style={L.title}>Buat rumah keluargamu</h1>
        <p className="mt-1.5" style={{ color: L.muted, fontWeight: 600, fontSize: 14 }}>
          Kamu jadi <b style={{ color: L.ink }}>Admin</b> dan bisa menambah anggota setelah ini.
        </p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3.5">
        <Field label="Nama rumah" muted={L.muted}>
          <div className="flex items-center gap-2" style={{ ...L.input, padding: "0 14px" }}>
            <span style={{ color: L.muted, fontWeight: 700 }}>Rumah</span>
            <input
              required
              maxLength={40}
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              placeholder="Pratama"
              className="min-w-0 flex-1 bg-transparent outline-none"
              aria-label="Nama rumah"
            />
          </div>
        </Field>
        <Field label="Nama panggilanmu" muted={L.muted}>
          <input
            required
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={L.input}
            placeholder="Misal: Ayah, Bunda, Mama"
          />
        </Field>
        <div className="flex flex-col gap-2">
          <span style={{ fontSize: 13, fontWeight: 700, color: L.muted }}>Warna profil</span>
          <div className="flex gap-2.5" role="radiogroup" aria-label="Warna profil">
            {MEMBER_COLORS.map((k) => {
              const main = L.play ? PLAY[k][1] : CAT[k][1];
              return (
                <button
                  type="button"
                  key={k}
                  role="radio"
                  aria-checked={c === k}
                  aria-label={`Warna ${k}`}
                  onClick={() => setC(k)}
                  className="size-9 rounded-full"
                  style={{ background: main, boxShadow: c === k ? `0 0 0 3px #fff, 0 0 0 5px ${main}` : "none" }}
                />
              );
            })}
          </div>
        </div>
        <Field label="PIN profil (opsional, 4 angka)" muted={L.muted}>
          <input
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={pin}
            onChange={(e) => setPinVal(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{ ...L.input, letterSpacing: pin ? ".5em" : undefined }}
            placeholder="Kunci profilmu dari anak-anak"
          />
        </Field>
        <ErrorLine msg={err} />
        <button
          type="submit"
          disabled={!ok || busy}
          className="mt-1 transition-transform active:translate-y-[3px] disabled:opacity-50"
          style={L.primary}
        >
          {busy ? "Menyiapkan rumah…" : "Masukkan ke rumah"}
        </button>
      </form>
      <p className="text-center" style={{ fontSize: 13, fontWeight: 600, color: L.muted }}>
        Masuk sebagai {displayLogin(email) ?? "akun ini"} ·{" "}
        <button onClick={() => signOutAccount()} className="font-bold underline underline-offset-2" style={{ color: L.ink }}>
          ganti akun
        </button>
      </p>
    </div>
  );
}
