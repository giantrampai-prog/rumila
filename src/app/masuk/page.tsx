"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BALOO, MemberAvatar, NUNITO, PJ, ThemeSwitch } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { CAT, PLAY } from "@/lib/catalog";
import { useHydrated, useRumila, type Member, type Theme } from "@/lib/store";
import { useCloudBoot, verifyPin } from "@/lib/supabase/family";
import { AccountStage, SetupStage } from "./account";

// Layar masuk — acuan: "Family Launcher v2" (pilih profil → PIN → menyiapkan ruang), tema Playful & Modern.

const PI = "#2b1d4e";

type Stage = "pick" | "pin" | "loading";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "ok"] as const;

export default function MasukPage() {
  return (
    <Suspense>
      <Masuk />
    </Suspense>
  );
}

function Masuk() {
  const hydrated = useHydrated();
  const cloud = useCloudBoot();
  // Siap setelah cache lokal pulih DAN status akun dari Supabase diketahui.
  const ready = hydrated && cloud.status !== "loading";
  const members = useRumila((s) => s.members);
  const signIn = useRumila((s) => s.signIn);
  const theme = useRumila((s) => s.theme);
  const setTheme = useRumila((s) => s.setTheme);
  const play = theme === "playful";
  const router = useRouter();
  const params = useSearchParams();
  const [stage, setStage] = useState<Stage>("pick");
  const [who, setWho] = useState<Member | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const enter = useCallback(
    (m: Member) => {
      setWho(m);
      setStage("loading");
      timers.current.push(
        setTimeout(() => {
          signIn(m.id);
          router.replace("/beranda");
        }, 1300),
      );
    },
    [router, signIn],
  );

  const pick = useCallback(
    (m: Member) => {
      if (m.pin) {
        setWho(m);
        setStage("pin");
      } else enter(m);
    },
    [enter],
  );

  // Dari sheet "Siapa yang pakai?": /masuk?id=m2 langsung ke PIN anggota itu.
  const preset = params.get("id");
  useEffect(() => {
    if (!ready || cloud.status !== "ready" || !preset) return;
    const m = members.find((x) => x.id === preset);
    if (m) pick(m);
    // hanya sekali saat halaman dibuka
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, cloud.status]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-5 py-8 ${ready && play ? "bg-dots" : "bg-page"}`}
      style={{ fontFamily: play ? NUNITO : PJ }}
    >
      {ready && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {play ? (
            <>
              <div className="absolute -top-[160px] -left-[140px] size-[460px] rounded-full bg-[#ffd23f] opacity-60 blur-[40px]" />
              <div className="absolute -right-[120px] -bottom-[120px] size-[420px] rounded-full bg-[#7ad7ff] opacity-55 blur-[40px]" />
              <div className="absolute -top-[80px] right-[18%] size-[300px] rounded-full bg-[#ff8fc7] opacity-45 blur-[40px]" />
            </>
          ) : (
            <>
              <div className="absolute -top-[220px] -left-[200px] size-[560px] rounded-full bg-[#FF7F67] opacity-[.14] blur-[100px]" />
              <div className="absolute -right-[180px] -bottom-[180px] size-[520px] rounded-full bg-[#52B8A8] opacity-[.15] blur-[100px]" />
              <div className="absolute -top-[140px] right-[14%] size-[380px] rounded-full bg-[#7884D8] opacity-[.12] blur-[90px]" />
            </>
          )}
        </div>
      )}

      {ready && stage !== "loading" && (
        <div className="absolute top-5 right-5 z-[2]">
          <ThemeSwitch theme={theme} onChange={setTheme} />
        </div>
      )}

      {!ready ? null : cloud.status === "noSession" ? (
        <AccountStage theme={theme} />
      ) : cloud.status === "noFamily" ? (
        <SetupStage theme={theme} email={cloud.email} />
      ) : cloud.status === "error" ? (
        <div className="relative flex max-w-[400px] flex-col items-center gap-3 rounded-[28px] bg-white p-7 text-center">
          <Icon name="cloud_off" size={40} />
          <p className="font-bold">Belum bisa terhubung ke server.</p>
          <p className="text-sm opacity-70">{cloud.error}</p>
          <button onClick={() => location.reload()} className="mt-1 rounded-xl bg-ink px-5 py-3 font-bold text-white">
            Coba lagi
          </button>
        </div>
      ) : stage === "pick" ? (
        <Pick members={members} onPick={pick} theme={theme} />
      ) : stage === "pin" && who ? (
        <Pin member={who} theme={theme} onBack={() => setStage("pick")} onSuccess={() => enter(who)} />
      ) : who ? (
        <Loading member={who} theme={theme} />
      ) : null}
    </div>
  );
}

function Pick({ members, onPick, theme }: { members: Member[]; onPick: (m: Member) => void; theme: Theme }) {
  const play = theme === "playful";
  return (
    <div className="anim-fade relative flex w-full max-w-[1060px] flex-col items-center gap-[30px]">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <Image src="/brand/rumila-logo.png" alt="Rumila" width={340} height={95} priority className="h-auto w-[min(340px,80vw)]" />
        <p className="-mt-1 text-[15px]" style={{ fontWeight: play ? 800 : 500, color: play ? "#8a7a9c" : "#7A8494" }}>
          Rumah digital untuk keluarga bertumbuh bersama
        </p>
        <h1
          style={
            play
              ? { fontSize: 20, fontWeight: 800, color: "#6b5d80" }
              : { fontSize: 22, fontWeight: 700, color: "#1F3044", letterSpacing: "-.02em", marginTop: 10 }
          }
        >
          Siapa yang mau masuk?
        </h1>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-5">
        {members.map((m) => {
          const [tint, , deep] = CAT[m.c];
          const cp = PLAY[m.c];
          return (
            <button
              key={m.id}
              onClick={() => onPick(m)}
              className="flex w-[190px] flex-col items-center gap-4 bg-white px-4 pt-8 transition-transform ease-[cubic-bezier(.3,1.4,.5,1)] hover:-translate-y-2 hover:-rotate-[1.5deg] focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              style={
                play
                  ? {
                      borderRadius: 36,
                      paddingBottom: 26,
                      boxShadow: `0 8px 0 ${cp[0]}aa, 0 24px 40px rgba(43,29,78,.08)`,
                      transitionDuration: "200ms",
                    }
                  : {
                      borderRadius: 28,
                      paddingBottom: 24,
                      border: "1px solid #ece9e3",
                      boxShadow: "0 1px 2px rgba(31,48,68,.04), 0 16px 40px rgba(31,48,68,.06)",
                      transitionDuration: "250ms",
                    }
              }
            >
              <MemberAvatar m={m} size={play ? 120 : 104} theme={theme} />
              <span
                style={
                  play
                    ? { fontFamily: BALOO, fontSize: 28, fontWeight: 800, color: PI, lineHeight: 1 }
                    : { fontSize: 19, fontWeight: 700, color: "#1F3044", lineHeight: 1.1, letterSpacing: "-.015em" }
                }
              >
                {m.name}
              </span>
              <span
                className="flex items-center gap-[5px] rounded-full whitespace-nowrap"
                style={
                  play
                    ? { fontSize: 13, fontWeight: 900, color: cp[2], background: cp[0] + "55", padding: "5px 12px" }
                    : { fontSize: 12, fontWeight: 600, color: deep, background: tint, padding: "5px 11px" }
                }
              >
                <Icon name={m.pin ? "lock" : "bolt"} size={16} />
                {m.admin ? "Admin" : "User"} · {m.pin ? "PIN" : "tanpa PIN"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Pin({ member, theme, onBack, onSuccess }: { member: Member; theme: Theme; onBack: () => void; onSuccess: () => void }) {
  const play = theme === "playful";
  const uc = PLAY[member.c];
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const full = pin.length === 4;

  const press = useCallback((k: string) => {
    if (k === "back") {
      setErr(false);
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (k === "ok") return;
    setErr(false);
    setPin((p) => (p.length >= 4 ? p : p + k));
  }, []);

  // Cek otomatis begitu 4 angka terisi.
  useEffect(() => {
    if (pin.length !== 4) return;
    let alive = true;
    // PIN dicek di server (hash bcrypt) — PIN asli tidak pernah tersimpan di perangkat.
    verifyPin(member.id, pin)
      .catch(() => false)
      .then((ok) => {
        if (!alive) return;
        if (ok) onSuccess();
        else {
          setPin("");
          setErr(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [pin, member.id, onSuccess]);

  // Desktop: ketik langsung dari keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("back");
      else if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press, onBack]);

  return (
    <div
      className="anim-fade relative flex w-full max-w-[400px] flex-col items-center gap-[18px] bg-white px-7 pt-8 pb-7"
      style={
        play
          ? { borderRadius: 40, boxShadow: "0 10px 0 rgba(43,29,78,.1), 0 40px 80px rgba(43,29,78,.15)" }
          : { borderRadius: 32, border: "1px solid #ece9e3", boxShadow: "0 30px 80px rgba(31,48,68,.12)" }
      }
    >
      <button
        onClick={onBack}
        aria-label="Kembali pilih profil"
        className="absolute top-[18px] left-[18px] flex items-center justify-center rounded-[14px]"
        style={
          play
            ? { width: 44, height: 44, background: "#f5f0fa", color: PI }
            : { width: 42, height: 42, background: "#F3F1ED", color: "#1F3044" }
        }
      >
        <Icon name="arrow_back" size={play ? 24 : 22} />
      </button>
      <MemberAvatar m={member} size={play ? 96 : 88} theme={theme} />
      <div className="text-center">
        <h1
          style={
            play
              ? { fontFamily: BALOO, fontSize: 30, fontWeight: 800, color: PI, lineHeight: 1.1 }
              : { fontSize: 24, fontWeight: 700, color: "#1F3044", lineHeight: 1.15, letterSpacing: "-.02em" }
          }
        >
          Halo, {member.name}!
        </h1>
        <p
          role="status"
          style={
            play
              ? { fontSize: 16, fontWeight: 800, color: err ? "#c92a3a" : "#8a7a9c", marginTop: 4 }
              : { fontSize: 14, fontWeight: 500, color: err ? "#B5434A" : "#7A8494", marginTop: 6 }
          }
        >
          {err ? "PIN salah, coba lagi ya" : "Masukkan 4 angka PIN kamu"}
        </p>
      </div>
      <div className={`flex gap-3.5 py-1 ${err ? "animate-[shake_.35s]" : ""}`} aria-label={`${pin.length} dari 4 angka`}>
        {[0, 1, 2, 3].map((i) => {
          const on = i < pin.length;
          return (
            <span
              key={i}
              className="rounded-full transition-all duration-150 ease-[cubic-bezier(.3,1.6,.5,1)]"
              style={
                play
                  ? {
                      width: 22,
                      height: 22,
                      background: on ? uc[1] : "#f1ecf7",
                      boxShadow: on ? `0 3px 0 ${uc[2]}` : "inset 0 2px 0 rgba(43,29,78,.08)",
                      transform: on ? "scale(1.1)" : "scale(1)",
                    }
                  : { width: 14, height: 14, background: on ? "#1F3044" : "#E6E3DD", transform: on ? "scale(1.15)" : "scale(1)" }
              }
            />
          );
        })}
      </div>
      <div className="grid grid-cols-[repeat(3,76px)] gap-3">
        {KEYS.map((k) => {
          const icon = k === "back" || k === "ok";
          const ok = k === "ok";
          const style = play
            ? {
                height: 64,
                borderRadius: 22,
                background: ok ? (full ? uc[1] : "#f5f0fa") : "#fff6e8",
                color: ok ? (full ? "#fff" : "#b3a48f") : PI,
                boxShadow: "0 4px 0 rgba(43,29,78,.12)",
                fontFamily: icon ? undefined : BALOO,
                fontSize: icon ? 28 : 28,
                fontWeight: 800,
              }
            : {
                height: 60,
                borderRadius: 18,
                background: ok ? (full ? "#1F3044" : "#F1EFEA") : "#F6F4F0",
                color: ok ? (full ? "#fff" : "#A7A29A") : "#1F3044",
                fontSize: icon ? 24 : 22,
                fontWeight: 600,
              };
          return (
            <button
              key={k}
              onClick={() => press(k)}
              aria-label={k === "back" ? "Hapus" : ok ? "Masuk" : k}
              disabled={ok && !full}
              className={`transition-[transform,background] duration-100 active:translate-y-[3px] ${icon ? "ms" : ""}`}
              style={style}
            >
              {k === "back" ? "backspace" : ok ? "check" : k}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 13, fontWeight: play ? 800 : 500, color: play ? "#b3a48f" : "#9AA1AC" }}>Bisa ketik PIN dari keyboard</p>
    </div>
  );
}

function Loading({ member, theme }: { member: Member; theme: Theme }) {
  const play = theme === "playful";
  const [grow, setGrow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrow(true), 40);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="anim-fade relative flex flex-col items-center gap-5 text-center" role="status">
      <MemberAvatar m={member} size={play ? 140 : 120} theme={theme} />
      <h1
        style={
          play
            ? { fontFamily: BALOO, fontSize: 34, fontWeight: 800, color: PI, lineHeight: 1.1 }
            : { fontSize: 26, fontWeight: 700, color: "#1F3044", lineHeight: 1.15, letterSpacing: "-.02em" }
        }
      >
        Menyiapkan ruang {member.name}…
      </h1>
      <div
        className="overflow-hidden rounded-full"
        style={
          play
            ? { width: 260, height: 16, background: "#fff", boxShadow: "0 3px 0 rgba(43,29,78,.1)" }
            : { width: 240, height: 6, background: "#ECE9E3" }
        }
      >
        <div
          className="h-full rounded-full transition-[width] duration-[1150ms] ease-[cubic-bezier(.5,0,.3,1)]"
          style={{
            width: grow ? "100%" : "0%",
            background: play ? `linear-gradient(90deg, ${PLAY[member.c][0]}, ${PLAY[member.c][1]})` : CAT[member.c][1],
          }}
        />
      </div>
    </div>
  );
}
