"use client";

// Kampus RINOYA: Gedung Utama (jenjang + kelas hari ini), peta kampus berisi gedung-gedung, halaman tiap
// gedung, dan kunci Laboratorium 3D. Semua konten berada di bawah satu Academy.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { levelMeta, type LevelId } from "@akademi/schema";
import { GedungUtama, IlustrasiGedung } from "@/components/kampus-gedung";
import { useOpenTool } from "@/components/shell";
import { JendelaKartuPelajar } from "@/components/akademi/kartu-pelajar";
import "./kampus.css";
import { AppIcon, BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { TRACK_SLICE, TRACK_IKON, TRACK_WARNA, trackMeta } from "@/components/akademi/portal/bersama";
import { useEvents } from "@/lib/akademi/jejak";
import { KOMPETENSI, PAKET, levelAnak, peranAkademi, useProfilAkademiVersi } from "@/lib/akademi/konten";
import { keadaanLab, type KeadaanLab } from "@/lib/akademi/lab";
import { proyeksi } from "@/lib/akademi/mastery";
import { kompetensiSelesai, petaJenjang, progresMisi } from "@/lib/akademi/peta";
import { NAMA_UJIAN } from "@/lib/akademi/ujian";
import { ambilUjian, useUjian } from "@/lib/akademi/ujian-klien";
import { PLAY, canonicalToolId } from "@/lib/catalog";
import { GEDUNG, isiGedung, type Gedung } from "@/lib/kampus";
import { can, useMe, useRumila, useUI, type Member } from "@/lib/store";

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

const INK = "#0b2545";

function Awan() {
  return (
    <>
      <span aria-hidden className="kampus-awan" style={{ top: 18, left: "8%", width: 56 }} />
      <span aria-hidden className="kampus-awan" style={{ top: 44, right: "12%", width: 44, animationDuration: "46s" }} />
    </>
  );
}

/** Gedung Utama (Ruang Kelas): jenjang, semester, progres, dan tombol ke kelas berikutnya. */
export function KartuKampus({ me }: { me: Member }) {
  const events = useEvents(me.id);
  const ujian = useUjian(me.id);
  const level = useLevel(me.id);
  useEffect(() => {
    ambilUjian(me.id).catch(() => {});
  }, [me.id]);
  const peta = useMemo(
    () => petaJenjang(proyeksi(events, KOMPETENSI), kompetensiSelesai(events, PAKET), KOMPETENSI, level, TRACK_SLICE, progresMisi(events, PAKET), ujian),
    [events, level, ujian],
  );
  const lv = levelMeta(level);
  const [kartu, setKartu] = useState(false);
  const sm = peta.semester[peta.semesterAktif - 1];
  const persen = sm?.total ? Math.round((sm.selesai / sm.total) * 100) : 0;
  const tugas = peta.sekarang
    ? { judul: `Misi ${peta.sekarang.nomor}`, sub: peta.sekarang.kompetensi.unit.nama.id, ikon: "play_arrow" }
    : peta.ujian
      ? { judul: NAMA_UJIAN[peta.ujian.jenis], sub: peta.ujian.unit?.nama.id ?? (peta.ujian.semester ? `Semester ${peta.ujian.semester}` : lv.nama), ikon: "quiz" }
      : peta.lulusJenjang
        ? { judul: "Jenjang tuntas", sub: "Ambil sertifikatmu", ikon: "workspace_premium" }
        : { judul: "Pemantapan", sub: "Latihan kemampuan inti", ikon: "fitness_center" };

  return (
    <section
      className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_5px_0_rgba(11,37,69,.08)] md:flex-row"
      aria-label={`Gedung Utama Kampus RINOYA: ${lv.lokal}, semester ${peta.semesterAktif}`}
    >
      <Link href="/akademi" aria-label="Masuk Gedung Utama: Ruang Kelas" className="kampus-langit kampus-kavling relative block shrink-0 overflow-hidden md:w-[46%]">
        <Awan />
        <span className="absolute top-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black tracking-[0.1em] text-[#a34a00] uppercase shadow-[0_2px_0_rgba(11,37,69,.08)]">Gedung Utama</span>
        <GedungUtama className="kampus-gedung relative mx-auto block w-full max-w-[270px] px-4 pt-8 md:max-w-[360px]" />
        <div className="kampus-rumput -mt-1 h-11" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-black tracking-[0.1em] text-[#a34a00] uppercase">Kampus RINOYA · Ruang Kelas</p>
            <p className="leading-tight" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
              {lv.lokal} · Semester {peta.semesterAktif}
            </p>
          </div>
          <span className="shrink-0 rounded-[14px] bg-[#fff3d1] px-3 py-1.5 text-right text-[11px] font-extrabold text-ink-3">
            Pangkat
            <span className="block text-[15px] text-[#0b2545]">{lv.pangkat}</span>
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
        <nav className="flex flex-wrap gap-2" aria-label="Pelajaran">
          {TRACK_SLICE.map((t) => {
            const [, m, d] = PLAY[TRACK_WARNA[t]];
            return (
              <Link key={t} href={`/akademi/pelajaran/${t}`} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-extrabold text-white transition-transform active:scale-95" style={{ background: m, boxShadow: `0 3px 0 ${d}` }}>
                <Icon name={TRACK_IKON[t]} size={18} /> {trackMeta(t).nama.id}
              </Link>
            );
          })}
          <Link href="/akademi/rapor" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#e3f1fd] px-3 text-[13px] font-extrabold text-[#0567c2] transition-transform active:scale-95">
            <Icon name="assignment" size={18} /> Rapor
          </Link>
          <button onClick={() => setKartu(true)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#fff3d1] px-3 text-[13px] font-extrabold text-[#a34a00] transition-transform active:scale-95">
            <Icon name="badge" size={18} /> Kartu Pelajar
          </button>
        </nav>
        {kartu && <JendelaKartuPelajar me={me} level={level} onTutup={() => setKartu(false)} />}
      </div>
    </section>
  );
}

/** Gedung yang tampil untuk anggota ini: punya izin dan sudah berisi. */
export function useGedungKampus(me: Member) {
  return useMemo(() => GEDUNG.map((g) => ({ g, isi: isiGedung(g, (k) => can(me, k)) })).filter((x) => x.isi.length > 0), [me]);
}

function keteranganGedung(g: Gedung, jumlah: number, terbuka: number) {
  if (g.id === "lab") return `${terbuka} dari ${jumlah} terbuka`;
  if (g.id === "komputer") return `${jumlah} modul Agam`;
  if (g.id === "taman") return `${jumlah} permainan`;
  return jumlah === 1 ? "1 kegiatan" : `${jumlah} kegiatan`;
}

/** Peta kampus: gedung-gedung berjajar di atas rumput dengan jalan setapak yang menyambung. */
export function PetaKampus({ me }: { me: Member }) {
  const daftar = useGedungKampus(me);
  const lab = useLab(me);
  if (!daftar.length) return null;
  const kolom = daftar.length >= 4 ? "md:grid-cols-4" : daftar.length === 3 ? "md:grid-cols-3" : "";
  return (
    <section aria-label="Peta kampus" className="kampus-langit relative overflow-hidden rounded-[28px] shadow-[0_5px_0_rgba(11,37,69,.08)]">
      <Awan />
      <h2 className="relative px-4 pt-3.5" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>
        Gedung kampus
      </h2>
      <div className={`relative grid grid-cols-2 ${kolom}`}>
        {daftar.map(({ g, isi }) => {
          const terbuka = isi.filter((t) => lab(t.id).terbuka).length;
          const ket = keteranganGedung(g, isi.length, terbuka);
          return (
            <Link key={g.id} href={g.href} aria-label={`${g.nama}: ${ket}`} className="kampus-kavling group flex flex-col">
              <IlustrasiGedung id={g.id} className="kampus-gedung relative mx-auto -mb-px block w-full max-w-[220px] px-3 pt-2" />
              <div className="kampus-rumput flex flex-col items-center px-2 pt-2 pb-12">
                <span className="relative z-10 flex max-w-full flex-col items-center rounded-[14px] bg-white px-3 py-1.5 text-center shadow-[0_3px_0_rgba(11,37,69,.12)]">
                  <span className="truncate leading-tight" style={{ fontFamily: BALOO, fontSize: 16, fontWeight: 800, color: INK }}>
                    {g.nama}
                  </span>
                  <span className="text-[11.5px] font-extrabold text-ink-3">{ket}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Halaman satu gedung: papan gedung bergambar + petak kegiatan. */
export function GedungView({ g }: { g: Gedung }) {
  const me = useMe();
  const openTool = useOpenTool();
  const lab = useLab(me);
  const showToast = useUI((s) => s.showToast);
  const isi = useMemo(() => isiGedung(g, (k) => can(me, k)), [g, me]);
  const [, m, d] = PLAY[g.c];

  return (
    <>
      <div className="kampus-langit relative flex items-end overflow-hidden rounded-[28px] shadow-[0_5px_0_rgba(11,37,69,.08)]">
        <Awan />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2 self-center p-4 sm:p-5">
          <span className="self-start rounded-full px-3 py-0.5 text-[11px] font-black tracking-[0.1em] text-white uppercase" style={{ background: m, boxShadow: `0 2px 0 ${d}` }}>
            {g.peran}
          </span>
          <h1 style={{ fontFamily: BALOO, fontSize: 28, fontWeight: 800, lineHeight: 1.05, color: INK }}>{g.nama}</h1>
          <p className="text-[14px] font-bold text-ink-2">{g.desc}</p>
        </div>
        <div className="relative w-[44%] max-w-[260px] shrink-0">
          <IlustrasiGedung id={g.id} className="relative -mb-px block w-full" />
          <div className="kampus-rumput h-9" />
        </div>
      </div>

      {isi.length === 0 ? (
        <p className="rounded-[22px] bg-white p-5 text-[15px] font-bold text-ink-3">Gedung ini sedang disiapkan. Minta ayah atau ibu membuka menunya, ya.</p>
      ) : (
        <section className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 md:grid-cols-6">
          {isi.map((t) => {
            const k = lab(t.id);
            return (
              <button
                key={t.id}
                onClick={() => (k.terbuka ? openTool(t) : showToast(`Laboratorium ini terbuka setelah modul ${k.syarat}.`))}
                aria-label={k.terbuka ? t.name : `${t.name}, terkunci: tuntaskan modul ${k.syarat}`}
                className="flex flex-col items-center gap-1.5 rounded-[20px] p-1.5 transition-transform active:scale-95"
                style={k.terbuka ? undefined : { filter: "grayscale(.75)", opacity: 0.7 }}
              >
                <span className="relative">
                  {!k.terbuka && (
                    <span className="absolute -right-1.5 -bottom-1.5 z-10 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#5b6b85] text-white">
                      <Icon name="lock" size={15} />
                    </span>
                  )}
                  <span className="sm:hidden">
                    <AppIcon t={t} size={64} theme="playful" />
                  </span>
                  <span className="hidden sm:block">
                    <AppIcon t={t} size={76} theme="playful" />
                  </span>
                </span>
                <span className="text-center leading-tight" style={{ fontFamily: BALOO, fontSize: 14, fontWeight: 800, color: INK }}>
                  {t.name}
                </span>
                {!k.terbuka && <span className="text-center text-[11px] leading-tight font-bold text-ink-3">{k.syarat}</span>}
              </button>
            );
          })}
        </section>
      )}
    </>
  );
}
