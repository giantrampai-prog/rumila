"use client";

// Kartu Pelajar RINOYA: foto, nama, Nomor Induk Siswa, jenjang & pangkat, IPK. Ukuran kartu identitas (85,6 × 54).

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { levelMeta, type LevelId } from "@akademi/schema";
import { BALOO, MemberAvatar } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { useFotoAnak } from "@/lib/akademi/foto";
import { formatIpk, hitungIpk, nomorInduk, tahunMasuk } from "@/lib/akademi/kartu-pelajar";
import { useUjian } from "@/lib/akademi/ujian-klien";
import { WajahKarakter } from "@/components/avatar-karakter";
import { AVATAR_AWAL, bacaAvatar } from "@/lib/avatar";
import { PLAY } from "@/lib/catalog";
import type { Member } from "@/lib/store";

const INK = "#0b2545";
const NAVY = "#135385";

/** Garis kode batang hiasan dari nomor induk (bukan kode yang bisa dipindai). */
function Batang({ kode }: { kode: string }) {
  const bar = [...kode.replace(/\D/g, "")].flatMap((d, i) => [1 + (Number(d) % 3), 1 + ((Number(d) + i) % 2)]);
  return (
    <span aria-hidden className="flex h-5 items-stretch gap-[1.5px]">
      {bar.map((w, i) => (
        <span key={i} style={{ width: w, background: i % 2 ? "transparent" : INK }} />
      ))}
    </span>
  );
}

export function KartuPelajar({ me, level }: { me: Member; level: LevelId }) {
  const ujian = useUjian(me.id);
  const foto = useFotoAnak(me.id);
  const lv = levelMeta(level);
  const ipk = useMemo(() => hitungIpk(ujian), [ujian]);
  const masuk = tahunMasuk(ujian);
  const nis = nomorInduk(me.id, masuk);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[20px] text-left shadow-[0_10px_30px_rgba(11,37,69,.25)]"
      style={{ aspectRatio: "85.6 / 54", background: "linear-gradient(150deg,#ffffff 0%,#f3f9ff 55%,#e3f1fd 100%)", color: INK, containerType: "inline-size" }}
      aria-label={`Kartu Pelajar ${me.name}, nomor induk ${nis}, IPK ${formatIpk(ipk.nilai)}`}
    >
      {/* pita atas */}
      <div className="flex items-center gap-[2cqw] px-[4cqw]" style={{ height: "19%", background: `linear-gradient(90deg, ${NAVY}, #0786eb)` }}>
        <span className="flex aspect-square h-[70%] items-center justify-center rounded-[1.6cqw] bg-white">
          <Image src="/brand/rinoya-mark-r.png" alt="" width={40} height={40} className="h-[80%] w-auto" />
        </span>
        <span className="min-w-0 flex-1 leading-none text-white">
          <span className="block" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: "4.4cqw", letterSpacing: ".06em" }}>
            RINOYA ACADEMY
          </span>
          <span className="block font-extrabold opacity-85" style={{ fontSize: "2.4cqw", letterSpacing: ".18em" }}>
            KARTU PELAJAR
          </span>
        </span>
        <span className="rounded-full bg-[#fdb724] px-[2cqw] py-[.6cqw] font-black" style={{ fontSize: "2.4cqw", color: INK }}>
          {lv.lokal}
        </span>
      </div>

      {/* bintang hiasan */}
      <span aria-hidden className="absolute rounded-full" style={{ right: "-8%", bottom: "-30%", width: "45%", aspectRatio: "1", background: "radial-gradient(circle,#fff3d1 0,#fff3d100 70%)" }} />

      <div className="relative flex gap-[3.5cqw] px-[4cqw] pt-[3.2cqw]" style={{ height: "81%" }}>
        {/* foto */}
        <div className="flex shrink-0 flex-col items-center gap-[1.4cqw]" style={{ width: "25%" }}>
          <div className="w-full overflow-hidden rounded-[2cqw] border-[.6cqw] border-white bg-[#e3f1fd] shadow-[0_2px_0_rgba(11,37,69,.12)]" style={{ aspectRatio: "3 / 4" }}>
            {me.avatar ? (
              <svg viewBox="12 10 76 90" className="size-full" style={{ background: `linear-gradient(160deg, ${PLAY[me.c][0]}, ${PLAY[me.c][1]})` }}>
                <WajahKarakter b={bacaAvatar(me.avatar) ?? AVATAR_AWAL} baju={PLAY[me.c][2]} />
              </svg>
            ) : foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto} alt="" className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center">
                <MemberAvatar m={me} size={64} theme="playful" />
              </span>
            )}
          </div>
          <span className="rounded-full bg-[#fff3d1] px-[1.6cqw] font-black" style={{ fontSize: "2.2cqw", color: "#a34a00" }}>
            ★ {lv.pangkat}
          </span>
        </div>

        {/* data */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ gap: "1.6cqw" }}>
          <div>
            <span className="block font-extrabold text-ink-3 uppercase" style={{ fontSize: "2.2cqw", letterSpacing: ".1em" }}>
              Nama
            </span>
            <span className="block truncate leading-tight" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: "6cqw" }}>
              {me.name}
            </span>
          </div>
          <div className="flex gap-[4cqw]">
            <div className="min-w-0">
              <span className="block font-extrabold text-ink-3 uppercase" style={{ fontSize: "2.2cqw", letterSpacing: ".1em" }}>
                Nomor Induk
              </span>
              <span className="block font-black tabular-nums" style={{ fontSize: "3.6cqw", letterSpacing: ".04em" }}>
                {nis}
              </span>
            </div>
            <div className="min-w-0">
              <span className="block font-extrabold text-ink-3 uppercase" style={{ fontSize: "2.2cqw", letterSpacing: ".1em" }}>
                Jenjang
              </span>
              <span className="block truncate font-black" style={{ fontSize: "3.6cqw" }}>
                {lv.nama}
              </span>
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between gap-[2cqw] pb-[3.4cqw]">
            <div className="flex flex-col gap-[1cqw]">
              <Batang kode={nis} />
              <span className="font-extrabold text-ink-3" style={{ fontSize: "2.1cqw" }}>
                Angkatan {masuk}
              </span>
            </div>
            <div className="rounded-[2.4cqw] px-[3cqw] py-[1.4cqw] text-center text-white" style={{ background: NAVY, boxShadow: "0 .8cqw 0 #0b2545" }}>
              <span className="block font-extrabold opacity-85" style={{ fontSize: "2.2cqw", letterSpacing: ".12em" }}>
                IPK
              </span>
              <span className="block leading-none tabular-nums" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: "7.4cqw" }}>
                {formatIpk(ipk.nilai)}
              </span>
              <span className="block font-bold opacity-85" style={{ fontSize: "2cqw" }}>
                {ipk.nilai === null ? ipk.predikat : `${ipk.predikat} · ${ipk.jumlah} ujian`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Kartu Pelajar dalam jendela di tengah layar. */
export function JendelaKartuPelajar({ me, level, onTutup }: { me: Member; level: LevelId; onTutup: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onTutup();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onTutup]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Kartu Pelajar" className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0b2545]/80 p-4 backdrop-blur-sm" onClick={onTutup}>
      <div className="flex max-h-full w-full max-w-[520px] flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <KartuPelajar me={me} level={level} />
        <p className="text-center text-[13px] font-bold text-white">IPK skala 4 dari nilai Ulangan Modul, Ujian Semester, dan Ujian Akhir.</p>
        <button onClick={onTutup} autoFocus className="inline-flex h-12 items-center gap-1.5 rounded-full bg-white px-6 text-[#0567c2] shadow-[0_4px_0_rgba(11,37,69,.2)]" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800 }}>
          <Icon name="close" size={22} /> Tutup
        </button>
      </div>
    </div>
  );
}
