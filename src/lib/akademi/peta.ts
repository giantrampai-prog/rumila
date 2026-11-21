// Peta Petualangan Academy: satu jalur misi per jenjang — fungsi murni, tanpa React/DOM.
//   urutan    = unit diselang-seling antarpelajaran (unit 1 Matematika, unit 1 Coding, unit 1 Sains, unit 2 …),
//               di dalam unit mengikuti urutan file kurikulum; satu misi = satu kompetensi
//   selesai   = pernah menamatkan paket yang memuat kompetensi itu dengan sukses ≥ AMBANG_STIKER, atau sudah dikuasai
//   unit aktif = unit pertama yang masih punya misi belum selesai. Misi di unit aktif boleh dikerjakan dalam urutan
//               bebas; unit sesudahnya terkunci sampai unit aktif tuntas (keputusan PO 25 Okt 2026)
//   sekarang  = misi pertama yang belum selesai di unit aktif (saran "Lanjut")
//   progres   = ronde terjauh yang pernah dimainkan dalam satu sesi paket misi itu / jumlah ronde paket
//   gerbang   = setelah semua misi selesai, latihan pemantapan untuk kompetensi inti yang belum dikuasai
//   semester  = jalur dibagi dua di batas unit (modul) terdekat dengan separuh jumlah misi (Sekolah Tahap 2).
//               Semester 2 otomatis terkunci selama semester 1 belum tuntas karena unit terkunci berurutan.
// Naik jenjang tetap memakai penguasaan: semua kompetensi inti jenjang dikuasai.

import { percobaanUlang } from "./percobaan";
import { LEVEL_IDS, levelIndex, type Competency, type ContentPack, type GameEvent, type LevelId, type TrackId } from "@akademi/schema";
import { AMBANG_STIKER, statusLencana, type StatusLencana } from "./koleksi";
import type { Penguasaan } from "./mastery";
import { sudahDikerjakan, sudahLulus, ruangSemester, type HasilUjian, type JenisUjian } from "./ujian";

export interface MisiPeta {
  /** nomor urut di jalur jenjang, mulai 1 */
  nomor: number;
  kompetensi: Competency;
  selesai: boolean;
  dikuasai: boolean;
  sekarang: boolean;
  terkunci: boolean;
  /** 0..1: bagian paket yang sudah dimainkan (untuk badge persen misi yang belum selesai) */
  progres: number;
}

export interface UnitPeta {
  id: string;
  track: TrackId;
  /** urutan unit (= modul) di dalam pelajarannya, mulai 1 */
  ke: number;
  /** semester tempat modul ini berada */
  semester: 1 | 2;
  nama: Competency["unit"]["nama"];
  misi: MisiPeta[];
  lencana: StatusLencana;
  /** Kuis Modul sudah lulus (selalu true bila peta dibuat tanpa data ujian) */
  kuisLulus: boolean;
}

/** Ujian yang sedang terbuka di jalur jenjang. */
export interface UjianPeta {
  jenis: Exclude<JenisUjian, "penempatan">;
  /** kuis: id unit · semester: "S1"/"S2" · kenaikan: "" */
  ruang: string;
  kompetensiIds: string[];
  unit?: UnitPeta;
  semester?: 1 | 2;
}

export interface Hitungan {
  dikuasai: number;
  total: number;
}

export interface SemesterPeta {
  ke: 1 | 2;
  unit: UnitPeta[];
  selesai: number;
  total: number;
  /** semua misi semester ini selesai */
  tuntas: boolean;
  /** semester sebelumnya belum tuntas */
  terkunci: boolean;
}

export interface PetaJenjang {
  level: LevelId;
  unit: UnitPeta[];
  /** jalur dibagi dua semester (semester 2 bisa kosong bila jenjang hanya punya satu modul) */
  semester: SemesterPeta[];
  /** semester yang sedang berjalan (2 bila semester 1 tuntas) */
  semesterAktif: 1 | 2;
  /** jumlah misi selesai (urutan bebas) / total misi */
  selesai: number;
  total: number;
  inti: Hitungan;
  /** semua kompetensi inti jenjang dikuasai */
  tercapai: boolean;
  sekarang?: MisiPeta;
  /** semua misi selesai tapi pangkat belum: kompetensi inti pertama (urut jalur) yang belum dikuasai */
  pemantapan?: MisiPeta;
  /** ujian yang menunggu dikerjakan (hanya bila peta dibuat dengan data ujian) */
  ujian?: UjianPeta;
  /** status ujian semester per semester (true bila tanpa data ujian) */
  semesterLulus: [boolean, boolean];
  /** Ujian Akhir sudah dikerjakan (true bila tanpa data ujian) */
  kenaikanSelesai: boolean;
  /** jenjang tuntas: inti dikuasai dan Ujian Akhir sudah dikerjakan */
  lulusJenjang: boolean;
}

/** Kompetensi yang punya paket tamat dengan sukses ≥ AMBANG_STIKER. */
export function kompetensiSelesai(events: GameEvent[], paket: ContentPack[]): Set<string> {
  const isi = new Map(paket.map((p) => [p.id, p.competencyIds]));
  const out = new Set<string>();
  for (const e of events) {
    if (e.type !== "activity_end") continue;
    const p = e.payload as { successCount?: unknown; failCount?: unknown };
    const s = typeof p.successCount === "number" ? p.successCount : 0;
    const f = typeof p.failCount === "number" ? p.failCount : 0;
    if (s + f === 0 || s / (s + f) < AMBANG_STIKER) continue;
    for (const c of isi.get(e.activityId) ?? []) out.add(c);
  }
  return out;
}

/** Progres terjauh per kompetensi: ronde dimainkan dalam satu sesi (sessionId + paket) / jumlah ronde paket, maksimal 1. */
export function progresMisi(events: GameEvent[], paket: ContentPack[]): Map<string, number> {
  const idx = new Map(paket.map((p) => [p.id, p]));
  const ronde = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "attempt" || percobaanUlang(e) || !idx.has(e.activityId)) continue;
    const k = `${e.sessionId}|${e.activityId}`;
    ronde.set(k, (ronde.get(k) ?? 0) + 1);
  }
  const out = new Map<string, number>();
  for (const [k, n] of ronde) {
    const p = idx.get(k.slice(k.indexOf("|") + 1))!;
    const nilai = Math.min(1, n / Math.max(1, p.rounds));
    for (const c of p.competencyIds) out.set(c, Math.max(out.get(c) ?? 0, nilai));
  }
  return out;
}

export function petaJenjang(
  peng: Record<string, Penguasaan>,
  selesaiSet: Set<string>,
  kompetensi: Competency[],
  level: LevelId,
  tracks: readonly TrackId[],
  progres: ReadonlyMap<string, number> = new Map(),
  /** hasil ujian anak; tanpa ini peta berjalan seperti sebelum Tahap 3 (tanpa kuis/ujian) */
  ujian?: HasilUjian[],
): PetaJenjang {
  // unit per pelajaran, urut kemunculan
  const perTrack = tracks.map((track) => {
    const map = new Map<string, Competency[]>();
    for (const c of kompetensi) if (c.level === level && c.track === track) (map.get(c.unit.id) ?? map.set(c.unit.id, []).get(c.unit.id)!).push(c);
    return [...map.values()].map((isi, i) => ({ track, ke: i + 1, isi }));
  });
  const terbanyak = Math.max(0, ...perTrack.map((u) => u.length));
  const urutUnit = [];
  for (let i = 0; i < terbanyak; i++) for (const u of perTrack) if (u[i]) urutUnit.push(u[i]);

  let nomor = 0;
  let jumlahSelesai = 0;
  const inti: Hitungan = { dikuasai: 0, total: 0 };
  const pakaiUjian = !!ujian;
  const lulus = (jenis: JenisUjian, ruang: string) => !pakaiUjian || sudahLulus(ujian!, jenis, level, ruang);
  const unit: UnitPeta[] = urutUnit.map(({ track, ke, isi }) => {
    const misi = isi.map((c) => {
      const dikuasai = peng[c.id]?.status === "dikuasai";
      const selesai = dikuasai || selesaiSet.has(c.id);
      const m: MisiPeta = { nomor: ++nomor, kompetensi: c, selesai, dikuasai, sekarang: false, terkunci: false, progres: selesai ? 1 : (progres.get(c.id) ?? 0) };
      if (selesai) jumlahSelesai++;
      if (c.core) {
        inti.total++;
        if (dikuasai) inti.dikuasai++;
      }
      return m;
    });
    const id = isi[0].unit.id;
    return { id, track, ke, semester: 1 as 1 | 2, nama: isi[0].unit.nama, misi, kuisLulus: lulus("kuis", id), lencana: statusLencana(misi.filter((m) => m.kompetensi.core).map((m) => (m.dikuasai ? "dikuasai" : m.selesai ? "berkembang" : "belum"))) };
  });

  const semester = bagiSemester(unit);
  const semesterLulus: [boolean, boolean] = [lulus("semester", ruangSemester(1)), lulus("semester", ruangSemester(2))];
  // Ujian Akhir sekali-jalan: selesai dikerjakan = tuntas, berapa pun nilainya
  const kenaikanSelesai = !pakaiUjian || sudahDikerjakan(ujian!, "kenaikan", level, "");
  const tercapai = inti.total > 0 && inti.dikuasai === inti.total;
  const idsDari = (us: UnitPeta[]) => us.flatMap((u) => u.misi.map((m) => m.kompetensi.id));
  const adaS2 = (semester[1]?.total ?? 0) > 0;

  // unit aktif = unit pertama yang belum tuntas (misi belum selesai, atau Kuis Modul belum lulus)
  const aktif = unit.findIndex((u) => !u.misi.every((m) => m.selesai) || !u.kuisLulus);
  let batas = aktif; // unit dengan indeks > batas terkunci
  let ujianBerikut: UjianPeta | undefined;
  if (aktif >= 0) {
    const u = unit[aktif];
    if (pakaiUjian && u.semester === 2 && !semesterLulus[0]) {
      // semester 1 tuntas tapi Ujian Semester 1 belum: seluruh semester 2 terkunci
      ujianBerikut = { jenis: "semester", ruang: ruangSemester(1), kompetensiIds: idsDari(semester[0].unit), semester: 1 };
      batas = aktif - 1;
    } else if (u.misi.every((m) => m.selesai)) {
      ujianBerikut = { jenis: "kuis", ruang: u.id, kompetensiIds: idsDari([u]), unit: u };
    }
  } else if (pakaiUjian && unit.length) {
    const ke: 1 | 2 = adaS2 ? 2 : 1;
    if (!semesterLulus[ke - 1]) ujianBerikut = { jenis: "semester", ruang: ruangSemester(ke), kompetensiIds: idsDari(semester[ke - 1].unit), semester: ke };
    else if (!kenaikanSelesai && tercapai) ujianBerikut = { jenis: "kenaikan", ruang: "", kompetensiIds: idsDari(unit) };
  }
  if (batas >= 0) for (const u of unit.slice(batas + 1)) for (const m of u.misi) if (!m.selesai) m.terkunci = true;

  const sekarang = aktif >= 0 && batas >= aktif ? unit[aktif].misi.find((m) => !m.selesai) : undefined;
  if (sekarang) sekarang.sekarang = true;
  const semesterAktif: 1 | 2 = semester[0]?.tuntas && semesterLulus[0] && adaS2 ? 2 : 1;

  const pemantapan = !sekarang && !tercapai && (!ujianBerikut || ujianBerikut.jenis === "kenaikan") && (aktif < 0 || !pakaiUjian) ? unit.flatMap((u) => u.misi).find((m) => m.kompetensi.core && !m.dikuasai) : undefined;
  return { level, unit, semester, semesterAktif, selesai: jumlahSelesai, total: nomor, inti, tercapai, sekarang, pemantapan, ujian: ujianBerikut, semesterLulus, kenaikanSelesai, lulusJenjang: tercapai && kenaikanSelesai };
}

/**
 * Bagi deret unit jadi dua semester: batas di akhir unit yang membuat jumlah misi semester 1 paling dekat ke
 * separuh total (semester 1 minimal satu unit). Menulis field `semester` tiap unit.
 */
export function bagiSemester(unit: UnitPeta[]): SemesterPeta[] {
  const total = unit.reduce((n, u) => n + u.misi.length, 0);
  let batas = unit.length ? 1 : 0;
  let terbaik = Infinity;
  let jalan = 0;
  for (let i = 0; i < unit.length; i++) {
    jalan += unit[i].misi.length;
    const selisih = Math.abs(jalan - total / 2);
    if (selisih < terbaik) {
      terbaik = selisih;
      batas = i + 1;
    }
  }
  const bagian: [UnitPeta[], UnitPeta[]] = [unit.slice(0, batas), unit.slice(batas)];
  bagian[1].forEach((u) => (u.semester = 2));
  bagian[0].forEach((u) => (u.semester = 1));
  const out: SemesterPeta[] = [];
  bagian.forEach((isi, i) => {
    const misi = isi.flatMap((u) => u.misi);
    const selesai = misi.filter((m) => m.selesai).length;
    out.push({ ke: (i + 1) as 1 | 2, unit: isi, selesai, total: misi.length, tuntas: misi.length > 0 && selesai === misi.length, terkunci: i === 1 && !out[0].tuntas });
  });
  return out;
}

/** Jenjang berikutnya yang sudah punya kurikulum; undefined bila tidak ada. */
export function jenjangBerikut(level: LevelId, kompetensi: Competency[]): LevelId | undefined {
  const ada = new Set(kompetensi.map((c) => c.level));
  return LEVEL_IDS.slice(levelIndex(level) + 1).find((l) => ada.has(l));
}

/**
 * Paket untuk memainkan satu misi: jenjang sama dulu, lalu paket yang kompetensi pertamanya misi ini,
 * lalu yang paling jarang dimulai (agar pemantapan berganti permainan), lalu id.
 */
export function paketMisi(competencyId: string, paket: ContentPack[], events: GameEvent[], level?: LevelId): ContentPack | undefined {
  const dimulai = new Map<string, number>();
  for (const e of events) if (e.type === "activity_start") dimulai.set(e.activityId, (dimulai.get(e.activityId) ?? 0) + 1);
  return paket
    .filter((p) => p.competencyIds.includes(competencyId))
    .sort(
      (a, b) =>
        Number(a.level !== level) - Number(b.level !== level) ||
        Number(a.competencyIds[0] !== competencyId) - Number(b.competencyIds[0] !== competencyId) ||
        (dimulai.get(a.id) ?? 0) - (dimulai.get(b.id) ?? 0) ||
        a.id.localeCompare(b.id),
    )[0];
}
