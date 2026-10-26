import type { UmrohPilgrim, UmrohRoute, UmrohStage, UmrohStageContent } from "./types";

/** Original learning copy. References and editorial scope: docs/umroh-virtual.md. */
export const STAGES: readonly UmrohStageContent[] = [
  {
    id: "persiapan", title: "Bersiap untuk umroh", subtitle: "Kenali pakaian dan bekalmu",
    instruction: "Siapkan pakaian ihram, kebersihan diri, dan bekal perjalanan bersama pendamping.",
    detail: "Mengenakan pakaian ihram adalah persiapan. Keadaan ihram dimulai dengan niat, bukan hanya karena berganti pakaian.",
    action: "Aku sudah bersiap", kind: "lesson",
  },
  {
    id: "miqat", title: "Niat di miqat", subtitle: "Awal keadaan ihram",
    instruction: "Niatkan umroh di dalam hati sebelum melewati batas miqat.",
    detail: "Miqat adalah batas untuk memulai ihram. Tombol ini hanya menandai pelajaran; niat ibadah adalah niatmu sendiri.",
    action: "Aku memahami niat ihram", kind: "lesson",
    dua: { arabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً", latin: "Labbaika Allāhumma ‘umratan.", meaning: "Ya Allah, aku memenuhi panggilan-Mu untuk berumroh." },
  },
  {
    id: "perjalanan", title: "Menuju Makkah", subtitle: "Talbiyah dan menjaga ihram",
    instruction: "Kenali bacaan talbiyah sambil mengikuti perjalanan menuju Masjidil Haram.",
    detail: "Selama ihram, jaga larangannya, termasuk memakai wewangian serta memotong kuku atau rambut. Tanyakan keadaan khusus kepada pembimbing.",
    action: "Lanjut ke Masjidil Haram", kind: "lesson",
    dua: {
      arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
      latin: "Labbaikallāhumma labbaik. Labbaika lā syarīka laka labbaik. Innal-ḥamda wan-ni‘mata laka wal-mulk. Lā syarīka lak.",
      meaning: "Aku memenuhi panggilan-Mu, ya Allah. Tiada sekutu bagi-Mu. Segala puji, nikmat, dan kerajaan adalah milik-Mu.",
    },
  },
  {
    id: "masuk", title: "Masuk Masjidil Haram", subtitle: "Bersiap menuju titik awal tawaf",
    instruction: "Masuk dengan tenang, jaga kebersihan, lalu cari penanda Hajar Aswad.",
    detail: "Sebelum tawaf, pastikan suci dan aurat tertutup. Garis bercahaya pada model adalah penunjuk belajar, bukan gambaran tanda yang selalu ada di lokasi.",
    action: "Mulai pelajaran tawaf", kind: "lesson",
  },
  {
    id: "tawaf", title: "Tawaf tujuh putaran", subtitle: "Ka'bah berada di sebelah kiri",
    instruction: "Ikuti lintasan berlawanan arah jarum jam hingga tujuh putaran lengkap.",
    detail: "Mulai dan akhiri di garis Hajar Aswad, mengitari bagian luar Hijir Ismail. Tidak perlu berdesakan untuk menyentuh Hajar Aswad.",
    action: "Lanjut setelah 7 putaran", kind: "tawaf",
  },
  {
    id: "salat", title: "Salat sunah setelah tawaf", subtitle: "Dua rakaat bila memungkinkan",
    instruction: "Kenali salat sunah dua rakaat setelah tawaf.",
    detail: "Bisa di belakang Maqam Ibrahim atau tempat aman lain di Masjidil Haram. Ini amalan sunah, bukan rukun umroh; jangan menghalangi orang tawaf.",
    action: "Aku memahami salat sunah", kind: "lesson",
  },
  {
    id: "zamzam", title: "Minum air Zamzam", subtitle: "Mengenal amalan sunah",
    instruction: "Kenali anjuran minum Zamzam sebelum menuju tempat sa'i.",
    detail: "Minum Zamzam adalah amalan sunah. Setelah itu, perjalanan belajar berlanjut ke Safa.",
    action: "Menuju Safa", kind: "lesson",
  },
  {
    id: "sai", title: "Sa'i Safa–Marwah", subtitle: "Tujuh perjalanan satu arah",
    instruction: "Mulai di Safa. Safa ke Marwah dihitung satu; kembali ke Safa dihitung dua.",
    detail: "Lanjutkan hingga perjalanan ketujuh berakhir di Marwah. Satu perjalanan bukan satu kali pergi-pulang.",
    action: "Lanjut setelah 7 perjalanan", kind: "sai",
  },
  {
    id: "tahallul", title: "Tahallul", subtitle: "Setelah tawaf dan sa'i selesai",
    instruction: "Kenali mencukur atau memendekkan rambut untuk mengakhiri ihram umroh.",
    detail: "Pemotongan rambut dilakukan setelah sa'i. Di sini kita mempelajari urutannya bersama pendamping.",
    action: "Aku memahami tahallul", kind: "lesson",
  },
  {
    id: "selesai", title: "Perjalanan belajar selesai", subtitle: "Miqat · tawaf · sa'i · tahallul",
    instruction: "Ceritakan kembali urutan umroh kepada pendampingmu.",
    detail: "Simulasi membantu mengenal urutan. Menyelesaikan permainan tidak menggantikan pelaksanaan ibadah atau bimbingan manasik.",
    action: "Belajar lagi", kind: "finish",
  },
];

export const UMROH_SOURCES = [
  { label: "JAWHAR · Panduan Haji dan Umrah", url: "https://www.jawhar.gov.my/haji-dan-umrah/panduan-haji-dan-umrah/" },
] as const;

export function getStageContent(stage: UmrohStage, route: UmrohRoute, pilgrim: UmrohPilgrim): UmrohStageContent {
  const base = STAGES.find((item) => item.id === stage)!;
  const content = { ...base, ...(base.dua ? { dua: { ...base.dua } } : {}) };
  if (stage === "persiapan") {
    content.detail = pilgrim === "putra"
      ? "Putra mengenal dua helai kain ihram: izar dan rida. Berganti pakaian belum berarti mulai ihram; niatlah pada waktunya."
      : "Putri mengenakan pakaian yang menutup aurat; tidak harus putih. Saat ihram, tidak memakai niqab atau sarung tangan. Niat tetap menjadi awal ihram.";
  }
  if (stage === "miqat") {
    content.subtitle = route === "madinah" ? "Dari Madinah melalui Bir Ali" : "Bersiap sebelum pesawat melintasi miqat";
    content.instruction = route === "madinah"
      ? "Dari Madinah, kenali miqat Bir Ali (Dzulhulaifah). Niatkan umroh sebelum melanjutkan perjalanan melewati miqat."
      : "Siapkan ihram lebih awal. Ikuti arahan pembimbing dan pengumuman awak pesawat agar berniat sebelum melewati miqat.";
  }
  if (stage === "sai") {
    content.detail += pilgrim === "putra"
      ? " Putra mengenal anjuran berlari kecil di antara penanda hijau jika mampu dan aman; ini sunah."
      : " Putri tetap berjalan biasa di antara penanda hijau.";
  }
  if (stage === "tahallul") {
    content.instruction = pilgrim === "putra"
      ? "Setelah sa'i, putra mencukur atau memendekkan rambut; mencukur lebih utama."
      : "Setelah sa'i, putri memendekkan rambut, bukan mencukur habis.";
  }
  return content;
}
