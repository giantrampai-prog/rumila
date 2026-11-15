"use client";

// Rasa kampus (Sekolah Tahap 5): kartu "Kelas hari ini" di beranda anak + kunci Laboratorium 3D.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { levelMeta, type LevelId } from "@akademi/schema";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { TRACK_SLICE } from "@/components/akademi/portal/bersama";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, PAKET, levelAnak, peranAkademi, useProfilAkademiVersi } from "@/lib/akademi/konten";
import { keadaanLab, SYARAT_LAB, type KeadaanLab } from "@/lib/akademi/lab";
import { proyeksi } from "@/lib/akademi/mastery";
import { kompetensiSelesai, petaJenjang, progresMisi } from "@/lib/akademi/peta";
import { NAMA_UJIAN } from "@/lib/akademi/ujian";
import { ambilUjian, useUjian } from "@/lib/akademi/ujian-klien";
import { canonicalToolId } from "@/lib/catalog";
import { useRumila, type Member } from "@/lib/store";

function useLevel(memberId: string): LevelId {
  const versi = useProfilAkademiVersi();
  const [lv, setLv] = useState<LevelId>("PAUD");
  useEffect(() => setLv(levelAnak(memberId)), [memberId, versi]);
  return lv;
}

/** Keadaan kunci tiap dunia Laboratorium 3D untuk satu anggota. Dewasa/admin: semua terbuka. */
export function useLab(me: Member): (toolId: string) => KeadaanLab {
  const events = useEvents(me.id);
  const ujian = useUjian(me.id);
  const level = useLevel(me.id);
  const activity = useRumila((s) => s.activity);
  const dewasa = me.admin || peranAkademi(me.id) === "dewasa";
  const selesai = useMemo(() => kompetensiSelesai(events, PAKET), [events]);
  return (toolId) => {
    if (dewasa) return { terbuka: true };
    const pernah = activity.some((a) => a.memberId === me.id && canonicalToolId(a.toolId) === toolId);
    return keadaanLab(toolId, { level, selesai, ujian, pernah, kompetensi: KOMPETENSI });
  };
}

/** Kartu Kampus: jenjang, semester, progres, dan tombol ke kelas berikutnya. */
export function KartuKampus({ me }: { me: Member }) {
  const events = useEvents(me.id);
  const ujian = useUjian(me.id);
  const level = useLevel(me.id);
  const lab = useLab(me);
  useEffect(() => {
    ambilUjian(me.id).catch(() => {});
  }, [me.id]);
  const peta = useMemo(
    () => petaJenjang(proyeksi(events, KOMPETENSI), kompetensiSelesai(events, PAKET), KOMPETENSI, level, TRACK_SLICE, progresMisi(events, PAKET), ujian),
    [events, level, ujian],
  );
  const lv = levelMeta(level);
  const sm = peta.semester[peta.semesterAktif - 1];
  const persen = sm?.total ? Math.round((sm.selesai / sm.total) * 100) : 0;
  const labTerbuka = Object.keys(SYARAT_LAB).filter((id) => lab(id).terbuka).length;
  const tugas = peta.sekarang
    ? { judul: `Misi ${peta.sekarang.nomor}`, sub: peta.sekarang.kompetensi.unit.nama.id, ikon: "play_arrow" }
    : peta.ujian
      ? { judul: NAMA_UJIAN[peta.ujian.jenis], sub: peta.ujian.unit?.nama.id ?? (peta.ujian.semester ? `Semester ${peta.ujian.semester}` : lv.nama), ikon: "quiz" }
      : peta.lulusJenjang
        ? { judul: "Jenjang tuntas", sub: "Ambil sertifikatmu", ikon: "workspace_premium" }
        : { judul: "Pemantapan", sub: "Latihan kemampuan inti", ikon: "fitness_center" };

  return (
    <section className="flex flex-col gap-3 rounded-[26px] bg-white p-4 shadow-[0_5px_0_rgba(11,37,69,.08)]" aria-label={`Kampus: ${lv.lokal}, semester ${peta.semesterAktif}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] text-white" style={{ background: "linear-gradient(155deg,#5fb8ff,#0786eb 65%)", boxShadow: "0 3px 0 #0567c2" }}>
          <Icon name="school" size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-black tracking-[0.1em] text-[#fd861d] uppercase">Kampus RINOYA</p>
          <p className="leading-tight" style={{ fontFamily: BALOO, fontSize: 21, fontWeight: 800, color: "#0b2545" }}>
            {lv.lokal} · Semester {peta.semesterAktif}
          </p>
        </div>
        <span className="text-right text-[12px] font-extrabold text-ink-3">
          Lab 3D
          <span className="block text-[15px] text-[#0b2545]">
            {labTerbuka}/{Object.keys(SYARAT_LAB).length}
          </span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#f1e6d6]" aria-label={`Semester ${peta.semesterAktif}: ${persen}%`}>
        <span className="block h-full rounded-full bg-[#0786eb]" style={{ width: `${persen}%` }} />
      </div>
      <Link href="/akademi" className="flex items-center gap-3 rounded-[20px] p-2.5 pr-4 text-[#0b2545] transition-transform active:scale-[.98]" style={{ background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 4px 0 #c85400" }}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
          <Icon name={tugas.ikon} size={28} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-black uppercase opacity-80">Kelas hari ini</span>
          <span className="block truncate leading-tight" style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>
            {tugas.judul} · {tugas.sub}
          </span>
        </span>
        <Icon name="arrow_forward" size={26} />
      </Link>
    </section>
  );
}
