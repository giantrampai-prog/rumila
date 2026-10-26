import { createProgress, parseSavedProgress } from "./state";
import type { UmrohPilgrim, UmrohProgress } from "./types";

export const JOURNEY_CHAPTER_IDS = [
  "rumah", "taxi_cgk", "cgk", "garuda_jed", "jeddah", "haramain",
  "madinah_station", "uber_nabawi", "nabawi", "rawdah", "salam", "umroh",
  "makkah_jed", "jeddah_pulang", "garuda_cgk", "cgk_pulang", "taxi_rumah", "rumah_selesai",
] as const;

export type JourneyChapterId = (typeof JOURNEY_CHAPTER_IDS)[number];
export type ChapterId = JourneyChapterId;

export interface JourneyChapter {
  readonly id: JourneyChapterId;
  readonly title: string;
  readonly subtitle: string;
  readonly instruction: string;
  readonly detail: string;
  readonly action: string;
  readonly icon: string;
  readonly location: string;
  readonly kind: "lesson" | "travel" | "umroh" | "finish";
  /** Active simulation seconds, independent of the duration in the story. */
  readonly durationSeconds?: number;
  /** Narrative duration only; never a live timetable or a booking promise. */
  readonly storyMinutes?: number;
}

export const JOURNEY_CHAPTERS: readonly JourneyChapter[] = [
  {
    id: "rumah", title: "Bersiap dari rumah", subtitle: "Perjalanan umroh dimulai di Indonesia",
    instruction: "Siapkan koper, dokumen perjalanan, dan kebutuhan pribadi bersama keluarga.",
    detail: "Kita berangkat melalui Jeddah, berkunjung ke Madinah, lalu umroh di Makkah. Periksa dokumen dan koper bersama keluarga sebelum kendaraan datang.",
    action: "Naik Bluebird", icon: "home", location: "Rumah · Indonesia", kind: "lesson",
  },
  {
    id: "taxi_cgk", title: "Bluebird menuju bandara", subtitle: "Dari rumah ke Soekarno–Hatta",
    instruction: "Duduk dengan tertib, gunakan sabuk pengaman, dan ikuti perjalanan menuju bandara.",
    detail: "Pastikan koper ikut terbawa dan simpan dokumen di tempat yang mudah dijangkau. Perhatikan petunjuk menuju terminal keberangkatan.",
    action: "Masuk terminal CGK", icon: "local_taxi", location: "Jalan menuju CGK", kind: "travel", durationSeconds: 14,
  },
  {
    id: "cgk", title: "Berangkat dari CGK", subtitle: "Bandara Soekarno–Hatta",
    instruction: "Kenali alur check-in, pemeriksaan keamanan, imigrasi, lalu ruang tunggu keberangkatan.",
    detail: "Cocokkan dokumen dan bagasi saat check-in. Setelah pemeriksaan, temukan gerbang pada boarding pass dan perhatikan pengumuman petugas.",
    action: "Naik pesawat Garuda", icon: "flight_takeoff", location: "Bandara Soekarno–Hatta · CGK", kind: "lesson",
  },
  {
    id: "garuda_jed", title: "Terbang ke Jeddah", subtitle: "Garuda · cerita penerbangan 9 jam",
    instruction: "Kenali suasana kabin, dengarkan arahan awak, dan ikuti penerbangan menuju Arab Saudi.",
    detail: "Dalam cerita ini penerbangan berlangsung 9 jam. Gunakan waktu untuk beristirahat dan mengenal tujuan kita: Madinah terlebih dahulu, kemudian umroh dari Bir Ali.",
    action: "Tiba di Jeddah", icon: "flight", location: "Kabin Garuda · CGK → JED", kind: "travel", durationSeconds: 20, storyMinutes: 540,
  },
  {
    id: "jeddah", title: "Tiba di Jeddah", subtitle: "Bandara King Abdulaziz",
    instruction: "Ikuti pemeriksaan kedatangan, ambil koper, lalu kenali arah menuju stasiun kereta bandara.",
    detail: "Stasiun Haramain terhubung dengan Terminal 1 Bandara King Abdulaziz. Ikuti petunjuk menuju stasiun, periksa tiket kereta, dan pastikan semua koper ikut terbawa.",
    action: "Naik kereta Haramain", icon: "luggage", location: "Bandara King Abdulaziz · JED", kind: "lesson",
  },
  {
    id: "haramain", title: "Kereta menuju Madinah", subtitle: "Haramain dari stasiun bandara Jeddah",
    instruction: "Temukan tempat duduk dan ikuti perjalanan kereta menuju Madinah.",
    detail: "Haramain menghubungkan stasiun bandara Jeddah dengan Madinah. Waktu perjalanan dalam cerita sekitar 1 jam 45 menit. Letakkan koper dengan aman dan bersiap ketika mendekati stasiun tujuan.",
    action: "Turun di Madinah", icon: "train", location: "Haramain · Jeddah → Madinah", kind: "travel", durationSeconds: 18, storyMinutes: 105,
  },
  {
    id: "madinah_station", title: "Stasiun Madinah", subtitle: "Bersiap menuju kawasan Masjid Nabawi",
    instruction: "Turun dengan tertib, periksa koper, dan menuju titik penjemputan bersama rombongan.",
    detail: "Kendaraan berikutnya adalah Uber. Cocokkan identitas kendaraan dan pengemudi bersama pendamping, lalu masukkan koper sebelum berangkat.",
    action: "Naik Uber", icon: "train", location: "Stasiun Haramain · Madinah", kind: "lesson",
  },
  {
    id: "uber_nabawi", title: "Menuju Masjid Nabawi", subtitle: "Perjalanan Uber di Madinah",
    instruction: "Ikuti perjalanan dari stasiun menuju kawasan Masjid Nabawi.",
    detail: "Gunakan sabuk pengaman dan turun di tempat yang diperbolehkan. Setelah turun, periksa barang dan berjalan bersama rombongan menuju halaman masjid.",
    action: "Jelajahi Masjid Nabawi", icon: "local_taxi", location: "Madinah · menuju Masjid Nabawi", kind: "travel", durationSeconds: 12,
  },
  {
    id: "nabawi", title: "Mengenal Masjid Nabawi", subtitle: "Kunjungan di Madinah sebelum umroh",
    instruction: "Kenali halaman, payung peneduh, dan ruang salat dengan tenang dan tertib.",
    detail: "Kunjungan Masjid Nabawi bukan rukun umroh dan bukan miqat. Raudhah dan jalur salam dipelajari terpisah. Saat menuju Makkah dari Madinah, miqat kita adalah Bir Ali.",
    action: "Pelajari kunjungan Raudhah", icon: "mosque", location: "Masjid Nabawi · Madinah", kind: "lesson",
  },
  {
    id: "rawdah", title: "Mengenal Raudhah", subtitle: "Area ibadah di Masjid Nabawi",
    instruction: "Pelajari kunjungan Raudhah: siapkan jadwal dan kode masuk melalui Nusuk, lalu ikuti arahan petugas.",
    detail: "Raudhah adalah area antara rumah Nabi dan mimbar, berbeda dari ruang makam. Ketentuan Nusuk saat diperiksa tidak memperbolehkan anak masuk Raudhah. Periksa kelayakan, jadwal, dan kode masuk terbaru; ikuti jalur yang ditunjukkan petugas.",
    action: "Pelajari adab salam", icon: "self_improvement", location: "Raudhah · Masjid Nabawi", kind: "lesson",
  },
  {
    id: "salam", title: "Salam dengan tertib", subtitle: "Mengenal ziarah di luar ruang makam",
    instruction: "Pelajari adab menyampaikan salam kepada Nabi Muhammad ﷺ serta Abu Bakar dan Umar dengan tenang.",
    detail: "Jalur salam berbeda dari Raudhah. Tetap di sisi luar pembatas ruang makam; pengunjung tidak masuk ke dalamnya. Ikuti jalur yang diizinkan petugas sesuai ketentuan pengunjung, jaga suara, dan beri ruang bagi jamaah lain.",
    action: "Bersiap umroh di Bir Ali", icon: "menu_book", location: "Area salam · Masjid Nabawi", kind: "lesson",
  },
  {
    id: "umroh", title: "Rangkaian umroh", subtitle: "Dari miqat sampai tahallul",
    instruction: "Ikuti panduan ihram dan niat, menuju Makkah, tawaf tujuh putaran, sa’i tujuh perjalanan, lalu tahallul.",
    detail: "Perjalanan baru memakai miqat Bir Ali dari Madinah. Panduan membedakan rukun umroh dan amalan sunah. Selesaikan seluruh pelajaran umroh sebelum melanjutkan cerita pulang.",
    action: "Mulai perjalanan pulang", icon: "mosque", location: "Bir Ali → Makkah", kind: "umroh",
  },
  {
    id: "makkah_jed", title: "Makkah menuju Jeddah", subtitle: "Perjalanan darat ke bandara",
    instruction: "Setelah rangkaian umroh selesai, rapikan barang dan ikuti perjalanan menuju bandara Jeddah.",
    detail: "Tujuan berikutnya adalah Bandara King Abdulaziz di Jeddah. Pastikan dokumen dan barang bawaan siap sebelum meninggalkan Makkah bersama rombongan.",
    action: "Masuk bandara Jeddah", icon: "directions_bus", location: "Makkah → Bandara Jeddah", kind: "travel", durationSeconds: 16,
  },
  {
    id: "jeddah_pulang", title: "Bersiap pulang dari Jeddah", subtitle: "Keberangkatan Garuda menuju Indonesia",
    instruction: "Periksa dokumen, check-in, serahkan bagasi, lalu ikuti pemeriksaan dan petunjuk menuju gerbang.",
    detail: "Pastikan barang bawaan sesuai ketentuan maskapai dan bandara. Cocokkan tujuan CGK pada boarding pass, lalu perhatikan gerbang dan waktu naik pesawat di layar keberangkatan.",
    action: "Naik Garuda ke CGK", icon: "flight_takeoff", location: "Bandara King Abdulaziz · JED", kind: "lesson",
  },
  {
    id: "garuda_cgk", title: "Terbang pulang ke Indonesia", subtitle: "Garuda · Jeddah menuju CGK",
    instruction: "Ikuti penerbangan pulang, gunakan sabuk pengaman saat diminta, dan bersiap mendarat di Indonesia.",
    detail: "Penerbangan pulang dalam cerita berlangsung 9 jam. Beristirahatlah dan ikuti arahan awak kabin. Saat mendarat, periksa barang pribadi sebelum meninggalkan kursi.",
    action: "Tiba di Soekarno–Hatta", icon: "flight_land", location: "Kabin Garuda · JED → CGK", kind: "travel", durationSeconds: 20, storyMinutes: 540,
  },
  {
    id: "cgk_pulang", title: "Kembali di Soekarno–Hatta", subtitle: "Kedatangan di Indonesia",
    instruction: "Ikuti pemeriksaan kedatangan, ambil koper, dan menuju tempat penjemputan yang ditentukan.",
    detail: "Periksa kembali barang bersama keluarga. Dalam cerita ini kita melanjutkan perjalanan pulang dengan Bluebird dari area penjemputan bandara.",
    action: "Naik Bluebird ke rumah", icon: "luggage", location: "Bandara Soekarno–Hatta · CGK", kind: "lesson",
  },
  {
    id: "taxi_rumah", title: "Bluebird menuju rumah", subtitle: "Perjalanan terakhir dari CGK",
    instruction: "Duduk dengan nyaman, gunakan sabuk pengaman, dan ikuti perjalanan pulang bersama keluarga.",
    detail: "Sesampainya di rumah, pastikan semua barang sudah diturunkan sebelum berpamitan kepada pengemudi. Bawa koper masuk bersama keluarga.",
    action: "Tiba kembali di rumah", icon: "local_taxi", location: "CGK → rumah", kind: "travel", durationSeconds: 14,
  },
  {
    id: "rumah_selesai", title: "Sampai kembali di rumah", subtitle: "Perjalanan belajar pulang-pergi selesai",
    instruction: "Ingat kembali urutan perjalanan, adab berkunjung, dan rangkaian umroh bersama keluarga atau pembimbing.",
    detail: "Kamu telah mengikuti perjalanan dari Indonesia, berkunjung ke Madinah, mempelajari umroh di Makkah, lalu pulang. Ceritakan kembali perbedaan kunjungan Nabawi, Raudhah, salam, dan rangkaian umroh.",
    action: "Ulangi perjalanan", icon: "home", location: "Rumah · Indonesia", kind: "finish",
  },
];

export interface JourneyProgress {
  version: 2;
  chapter: JourneyChapterId;
  /** Active seconds in the current travel chapter; zero in other chapter kinds. */
  travelSeconds: number;
  umroh: UmrohProgress;
}

const UMROH_INDEX = JOURNEY_CHAPTER_IDS.indexOf("umroh");

export function getJourneyChapter(id: JourneyChapterId): JourneyChapter {
  const chapter = JOURNEY_CHAPTERS.find((item) => item.id === id);
  if (!chapter) throw new RangeError("Unknown journey chapter");
  return chapter;
}

export function createJourneyProgress(pilgrim: UmrohPilgrim = "putra"): JourneyProgress {
  return { version: 2, chapter: "rumah", travelSeconds: 0, umroh: createProgress("madinah", pilgrim) };
}

/** The caller supplies active, unpaused seconds. Time while away is never replayed. */
export function advanceJourneyTravel(progress: JourneyProgress, delta: number): JourneyProgress {
  const chapter = getJourneyChapter(progress.chapter);
  if (chapter.kind !== "travel" || !chapter.durationSeconds || !Number.isFinite(delta) || delta <= 0) return progress;
  const travelSeconds = Math.round(Math.min(chapter.durationSeconds, progress.travelSeconds + delta) * 1e6) / 1e6;
  return travelSeconds === progress.travelSeconds ? progress : { ...progress, travelSeconds };
}

/** Travel and the complete nested ritual must finish before acknowledging the next chapter. */
export function nextJourneyChapter(progress: JourneyProgress): JourneyProgress {
  const chapter = getJourneyChapter(progress.chapter);
  if (chapter.kind === "finish"
    || (chapter.kind === "travel" && progress.travelSeconds < (chapter.durationSeconds ?? Infinity))
    || (chapter.kind === "umroh" && progress.umroh.stage !== "selesai")) return progress;
  const next = JOURNEY_CHAPTER_IDS[JOURNEY_CHAPTER_IDS.indexOf(progress.chapter) + 1];
  return next ? { ...progress, chapter: next, travelSeconds: 0 } : progress;
}

/** Updates are confined to the ritual chapter; the selected route remains unchanged. */
export function updateJourneyUmroh(progress: JourneyProgress, umroh: UmrohProgress): JourneyProgress {
  if (progress.chapter !== "umroh" || umroh.route !== progress.umroh.route || umroh === progress.umroh) return progress;
  const validated = parseSavedProgress(JSON.stringify(umroh));
  return validated ? { ...progress, umroh: validated } : progress;
}

/** Supports version 2 and preserves valid version-1 practice progress when migrating. */
export function parseJourneyProgress(raw: string | null | undefined): JourneyProgress | null {
  if (typeof raw !== "string" || raw.length > 8192) return null;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const saved = value as Record<string, unknown>;
  if (saved.version === 1) {
    const umroh = parseSavedProgress(raw);
    return umroh ? { version: 2, chapter: "umroh", travelSeconds: 0, umroh } : null;
  }
  if (saved.version !== 2 || !JOURNEY_CHAPTER_IDS.some((id) => id === saved.chapter)
    || typeof saved.travelSeconds !== "number" || !Number.isFinite(saved.travelSeconds) || saved.travelSeconds < 0) return null;
  const umroh = parseSavedProgress(JSON.stringify(saved.umroh));
  if (!umroh) return null;
  const chapterId = saved.chapter as JourneyChapterId;
  const chapter = getJourneyChapter(chapterId);
  const index = JOURNEY_CHAPTER_IDS.indexOf(chapterId);
  if (chapter.kind === "travel") {
    if (!chapter.durationSeconds || saved.travelSeconds > chapter.durationSeconds) return null;
  } else if (saved.travelSeconds !== 0) return null;
  if (index < UMROH_INDEX && (umroh.stage !== "persiapan" || umroh.route !== "madinah")) return null;
  if (index > UMROH_INDEX && umroh.stage !== "selesai") return null;
  return { version: 2, chapter: chapterId, travelSeconds: saved.travelSeconds, umroh };
}

export function serializeJourneyProgress(progress: JourneyProgress): string {
  return JSON.stringify(progress);
}
