"use client";

// "Siapa yang belajar?": anak di atas (avatar besar), orang tua di bawah (bergembok). Pilih → PIN profil.
// Tablet yang dikunci ke satu anak langsung membuka PIN anak itu.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MemberAvatar } from "@/components/launcher";
import { BuatPin, LupaPin, MasukPin } from "@/components/pin-pad";
import { Icon } from "@/components/ui";
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
      <div className="anim-fade relative flex w-full max-w-[380px] flex-col items-center">
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
      <div className="anim-fade relative flex w-full max-w-[380px] flex-col items-center">
        <BuatPin m={langkah.m} jenis="angka" judul={`Buat PIN orang tua untuk ${langkah.m.name}`} onSelesai={() => onMasuk(langkah.m)} kiri={kembali} />
      </div>
    );
  if (langkah.kind === "lupa")
    return (
      <div className="anim-fade relative flex w-full justify-center">
        <LupaPin m={langkah.m} onSelesai={() => onMasuk(langkah.m)} onBatal={() => setLangkah({ kind: "pin", m: langkah.m })} />
      </div>
    );

  const Kartu = ({ m, besar }: { m: Member; besar: boolean }) => (
    <button
      type="button"
      onClick={() => pilih(m)}
      className="flex flex-col items-center gap-2 rounded-[24px] p-2 transition-transform active:scale-95"
      aria-label={`${m.name}${m.pin ? ", pakai PIN" : ""}`}
    >
      <span className="relative">
        <MemberAvatar m={m} size={besar ? 104 : 68} theme="playful" />
        {!besar && (
          <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-white text-[#5b6b85] shadow-[0_2px_0_rgba(11,37,69,.15)]">
            <Icon name="lock" size={16} />
          </span>
        )}
      </span>
      <span className="max-w-[120px] truncate" style={{ fontFamily: BALOO, fontSize: besar ? 20 : 16, fontWeight: 800, color: INK }}>
        {m.name}
      </span>
    </button>
  );

  return (
    <div className="anim-fade relative flex w-full max-w-[640px] flex-col items-center gap-6 text-center">
      <h1 style={{ fontFamily: BALOO, fontSize: 36, fontWeight: 800, color: INK, lineHeight: 1.05 }}>Siapa yang belajar?</h1>
      {anak.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-3">
          {anak.map((m) => (
            <Kartu key={m.id} m={m} besar />
          ))}
        </div>
      )}
      {ortu.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-black tracking-[0.12em] text-ink-3 uppercase">Orang tua</span>
          <div className="flex flex-wrap justify-center gap-3">
            {ortu.map((m) => (
              <Kartu key={m.id} m={m} besar={false} />
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={async () => {
          await signOutAccount();
          router.replace("/masuk");
        }}
        className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-ink-3"
      >
        <Icon name="logout" size={18} /> Keluar akun rumah
      </button>
    </div>
  );
}
