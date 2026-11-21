"use client";

// "Siapa yang belajar?": anak di atas (avatar besar), orang tua di bawah (bergembok). Pilih → PIN profil.
// Tablet yang dikunci ke satu anak langsung membuka PIN anak itu.

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MemberAvatar } from "@/components/launcher";
import { BuatPin, LupaPin, MasukPin } from "@/components/pin-pad";
import { Icon } from "@/components/ui";
import { PLAY } from "@/lib/catalog";
import { isOrangTua, perangkatAnak } from "@/lib/profil";
import { signOutAccount } from "@/lib/supabase/family";
import type { Member } from "@/lib/store";

const INK = "#0b2545";
const BALOO = "var(--ff-baloo), system-ui, sans-serif";

type Langkah = { kind: "daftar" } | { kind: "pin"; m: Member } | { kind: "buat"; m: Member } | { kind: "lupa"; m: Member };

export function PilihProfil({ members, onMasuk }: { members: Member[]; onMasuk: (m: Member) => void }) {
  const router = useRouter();
  const terkunci = members.find((m) => m.id === perangkatAnak());
  const [langkah, setLangkah] = useState<Langkah>(() => (terkunci ? (terkunci.pin ? { kind: "pin", m: terkunci } : { kind: "daftar" }) : { kind: "daftar" }));
  const anak = members.filter((m) => !isOrangTua(m));
  const ortu = members.filter(isOrangTua);

  const pilih = (m: Member) => {
    if (m.pin) return setLangkah({ kind: "pin", m });
    // Orang tua wajib punya PIN supaya anak tidak bisa masuk ke profilnya.
    if (isOrangTua(m)) return setLangkah({ kind: "buat", m });
    onMasuk(m);
  };
  const kembali = (
    <button type="button" onClick={() => setLangkah({ kind: "daftar" })} className="text-[14px] font-extrabold text-[#0567c2]">
      {terkunci && langkah.kind === "pin" && langkah.m.id === terkunci.id ? "Bukan aku" : "Kembali"}
    </button>
  );

  if (langkah.kind === "pin")
    return (
      <div className="anim-fade relative flex w-full max-w-[420px] flex-col items-center rounded-[32px] bg-[#eef5fc] px-5 py-6 shadow-[0_0_0_4px_#fff,0_8px_0_4px_rgba(11,37,69,.12),0_24px_48px_rgba(11,37,69,.18)] sm:px-7">
        <MasukPin
          key={langkah.m.id}
          m={langkah.m}
          judul={isOrangTua(langkah.m) ? `PIN ${langkah.m.name}` : `Halo ${langkah.m.name}, ketik PIN-mu`}
          onBenar={() => onMasuk(langkah.m)}
          kiri={kembali}
          onLupa={isOrangTua(langkah.m) ? () => setLangkah({ kind: "lupa", m: langkah.m }) : undefined}
        />
      </div>
    );
  if (langkah.kind === "buat")
    return (
      <div className="anim-fade relative flex w-full max-w-[420px] flex-col items-center rounded-[32px] bg-[#eef5fc] px-5 py-6 shadow-[0_0_0_4px_#fff,0_8px_0_4px_rgba(11,37,69,.12),0_24px_48px_rgba(11,37,69,.18)] sm:px-7">
        <BuatPin m={langkah.m} jenis="angka" judul={`Buat PIN orang tua untuk ${langkah.m.name}`} onSelesai={() => onMasuk(langkah.m)} kiri={kembali} />
      </div>
    );
  if (langkah.kind === "lupa")
    return (
      <div className="anim-fade relative flex w-full justify-center">
        <LupaPin m={langkah.m} onSelesai={() => onMasuk(langkah.m)} onBatal={() => setLangkah({ kind: "pin", m: langkah.m })} />
      </div>
    );

  return (
    <div className="anim-fade relative flex w-full max-w-[860px] flex-col items-center gap-5 pb-16 text-center sm:gap-7">
      <Image src="/brand/rinoya-logo-r.png" alt="RINOYA Academy" width={1137} height={800} priority className="h-auto w-[120px] sm:w-[150px]" />
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-balance" style={{ fontFamily: BALOO, fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 800, color: INK, lineHeight: 1.05 }}>Siapa yang belajar hari ini?</h1>
        <p className="text-[15px] font-bold text-[#3d5675] sm:text-[17px]">Ketuk kartumu untuk mulai</p>
      </div>
      {anak.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {anak.map((m) => (
            <KartuAnak key={m.id} m={m} onPilih={() => pilih(m)} />
          ))}
        </div>
      )}
      {ortu.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-[26px] bg-white/95 p-2 pl-4 shadow-[0_6px_0_rgba(11,37,69,.08)]">
          <span className="flex items-center gap-1.5 pr-1 text-[12px] font-black tracking-[0.12em] text-[#5b6b85] uppercase">
            <Icon name="shield_person" size={18} /> Orang tua
          </span>
          {ortu.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => pilih(m)}
              aria-label={`${m.name}, pakai PIN`}
              className="flex items-center gap-2 rounded-full bg-[#f1f5fb] py-1 pr-3 pl-1 transition-transform active:scale-95"
            >
              <MemberAvatar m={m} size={40} theme="playful" />
              <span className="max-w-[120px] truncate" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, color: INK }}>{m.name}</span>
              <Icon name="lock" size={16} style={{ color: "#5b6b85" }} />
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={async () => {
          await signOutAccount();
          router.replace("/masuk");
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-[13px] font-extrabold text-[#3d5675]"
      >
        <Icon name="logout" size={18} /> Keluar akun rumah
      </button>
    </div>
  );
}

/** Kartu anak: kartu tegak berwarna profil, avatar di lingkaran putih, nama besar, tombol "Ayo belajar". */
function KartuAnak({ m, onPilih }: { m: Member; onPilih: () => void }) {
  const [l, mm, d] = PLAY[m.c];
  return (
    <button
      type="button"
      onClick={onPilih}
      aria-label={`${m.name}${m.pin ? ", pakai PIN" : ""}`}
      className="group relative flex w-[164px] flex-col items-center gap-3 overflow-hidden rounded-[32px] px-3 pt-6 pb-4 transition-transform hover:-translate-y-1 active:translate-y-1 sm:w-[230px] sm:pt-8 sm:pb-5"
      style={{ background: `linear-gradient(165deg, ${l} 0%, ${mm} 70%)`, boxShadow: `0 8px 0 ${d}, 0 18px 30px rgba(11,37,69,.18)` }}
    >
      <span aria-hidden className="absolute -top-8 -right-8 size-24 rounded-full bg-white/20" />
      <span aria-hidden className="absolute -bottom-10 -left-6 size-24 rounded-full bg-white/15" />
      <span className="relative rounded-full bg-white p-1.5 shadow-[0_4px_0_rgba(0,0,0,.12)]">
        <span className="hidden sm:block"><MemberAvatar m={m} size={144} theme="playful" /></span>
        <span className="sm:hidden"><MemberAvatar m={m} size={100} theme="playful" /></span>
      </span>
      <span
        className="relative max-w-full truncate px-1 text-white"
        style={{ fontFamily: BALOO, fontSize: 26, fontWeight: 800, lineHeight: 1.1, textShadow: `0 2px 0 ${d}` }}
      >
        {m.name}
      </span>
      <span className="relative flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-[15px] font-black" style={{ color: d }}>
        {m.pin ? <Icon name="lock" size={16} /> : null} Ayo belajar <Icon name="play_arrow" size={18} />
      </span>
    </button>
  );
}
