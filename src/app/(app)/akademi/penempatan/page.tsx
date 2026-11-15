"use client";

// Tes Penempatan (Sekolah Tahap 3): sekali saat anak mulai Academy. Pilih jenjang perkiraan → 10 soal kompetensi
// inti jenjang itu. Lulus (≥70) → jenjang awal anak (dicatat server). Belum lulus → tawarkan jenjang di bawahnya;
// sampai PAUD tetap belum lulus → mulai dari PAUD.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ACTIVE_LEVELS, LEVELS, levelIndex, type LevelId } from "@akademi/schema";
import { LayarUjian } from "@/components/akademi/ujian";
import { BALOO, INK } from "@/components/akademi/jenis";
import { Icon } from "@/components/ui";
import { KOMPETENSI } from "@/lib/akademi/konten";
import { cakupanUjian } from "@/lib/akademi/ruang-ujian";
import type { HasilUjian } from "@/lib/akademi/ujian";
import { useMe } from "@/lib/store";

const ADA = ACTIVE_LEVELS.filter((l) => KOMPETENSI.some((c) => c.level === l));

export default function PenempatanPage() {
  const me = useMe();
  const router = useRouter();
  const [level, setLevel] = useState<LevelId | null>(null);
  const [hasil, setHasil] = useState<HasilUjian | null>(null);
  const ids = useMemo(() => (level ? (cakupanUjian("penempatan", level, "", KOMPETENSI) ?? []) : []), [level]);
  const bawah = level ? ADA.filter((l) => levelIndex(l) < levelIndex(level)).at(-1) : undefined;

  const Kotak = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-dvh items-center justify-center p-5" style={{ background: "linear-gradient(180deg,#e4f1fd,#fff6e8)", fontFamily: BALOO, color: INK }}>
      <div className="w-full max-w-[460px] rounded-[28px] bg-white p-6 text-center shadow-[0_8px_0_rgba(11,37,69,.12)]">{children}</div>
    </div>
  );

  if (!level)
    return (
      <Kotak>
        <span className="mx-auto flex size-16 items-center justify-center rounded-[20px] bg-[#e4f1fd] text-[#0567c2]">
          <Icon name="explore" size={36} />
        </span>
        <h1 className="mt-3 text-[28px] font-extrabold">Tes Penempatan</h1>
        <p className="mt-1 text-[15px] font-bold text-[#6b7a90]" style={{ fontFamily: "var(--ff-nunito), system-ui" }}>
          Pilih jenjang yang paling mendekati kelas {me.name} di sekolah. Tes 10 soal ini menentukan jenjang awal di RINOYA Academy.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {LEVELS.filter((l) => ADA.includes(l.id)).map((l) => (
            <button key={l.id} onClick={() => setLevel(l.id)} className="rounded-[16px] bg-[#f6f8fb] px-2 py-3 active:scale-95">
              <span className="block text-[18px] font-extrabold">{l.lokal}</span>
              <span className="block text-[11px] font-bold text-[#6b7a90]">usia {l.usia[0]}–{l.usia[1]}</span>
            </button>
          ))}
        </div>
        <Link href="/akademi" className="mt-4 inline-block text-[14px] font-extrabold text-[#6b7a90]">
          Nanti saja
        </Link>
      </Kotak>
    );

  if (hasil?.lulus)
    return (
      <Kotak>
        <Icon name="verified" size={56} className="text-[#22a06b]" />
        <h1 className="mt-2 text-[26px] font-extrabold">Selamat datang di {LEVELS.find((l) => l.id === level)?.lokal}!</h1>
        <p className="mt-1 text-[15px] font-bold text-[#6b7a90]">Nilai tes {hasil.nilai}. Jenjang awalmu sudah ditetapkan.</p>
        <button onClick={() => router.push("/akademi")} className="mt-5 w-full rounded-[18px] bg-[#22b573] py-3.5 text-[19px] font-extrabold text-white shadow-[0_5px_0_#16804f]">
          Mulai belajar
        </button>
      </Kotak>
    );

  if (hasil)
    return (
      <Kotak>
        <Icon name="trending_down" size={52} className="text-[#fd861d]" />
        <h1 className="mt-2 text-[24px] font-extrabold">Nilai {hasil.nilai}, belum cukup untuk {LEVELS.find((l) => l.id === level)?.lokal}</h1>
        {bawah ? (
          <button
            onClick={() => {
              setHasil(null);
              setLevel(bawah);
            }}
            className="mt-5 w-full rounded-[18px] py-3.5 text-[19px] font-extrabold text-white"
            style={{ background: "linear-gradient(155deg,#5fb8ff,#0786eb 65%)", boxShadow: "0 5px 0 #0567c2" }}
          >
            Coba tes {LEVELS.find((l) => l.id === bawah)?.lokal}
          </button>
        ) : (
          <button
            onClick={() => router.push("/akademi")}
            className="mt-5 w-full rounded-[18px] bg-[#22b573] py-3.5 text-[19px] font-extrabold text-white shadow-[0_5px_0_#16804f]"
          >
            Mulai dari PAUD
          </button>
        )}
      </Kotak>
    );

  return <LayarUjian key={level} jenis="penempatan" level={level} ruang="" kompetensiIds={ids} judul={LEVELS.find((l) => l.id === level)?.nama ?? level} kembaliKe="/akademi" onSelesai={setHasil} />;
}
