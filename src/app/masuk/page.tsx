"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BALOO, MemberAvatar, NUNITO, PJ } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { CAT, PLAY } from "@/lib/catalog";
import { useHydrated, useRumila, type Member, type Theme } from "@/lib/store";
import { useCloudBoot } from "@/lib/supabase/family";
import { AccountStage, SetupStage } from "./account";

// Layar masuk: akun → langsung ke beranda (tanpa pilih profil & PIN).

const PI = "#2b1d4e";


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
  // Satu tema saja: tampilan anak (Playful).
  const theme: Theme = "playful";
  const play = theme === "playful";
  const meId = useRumila((s) => s.meId);
  const router = useRouter();
  // Tanpa pilih profil & PIN: setelah akun masuk langsung ke beranda
  // (profil terakhir dipakai, atau Admin). Ganti profil lewat avatar di beranda.
  const who = members.find((m) => m.id === meId) ?? members.find((m) => m.admin) ?? members[0] ?? null;
  const whoId = who?.id;
  useEffect(() => {
    if (!ready || cloud.status !== "ready" || !whoId) return;
    signIn(whoId);
    router.replace("/beranda");
  }, [ready, cloud.status, whoId, signIn, router]);

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
      ) : who ? (
        <Loading member={who} theme={theme} />
      ) : null}
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
