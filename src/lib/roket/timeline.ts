import { MISI, MISI_AUDIO, dwellSeconds } from "./misi";

export type MissionTarget = "landasan" | "roket" | "menara" | "astronaut" | "helm" | "kapsul" | "mesin" | "tahap-1" | "tahap-2" | "awan" | "ozon" | "meteor" | "orbit" | "bumi" | "aurora" | "stasiun" | "panel-surya" | "satelit" | "kabin" | "kursi" | "konsol" | "boneka" | "kupola";
export interface MissionCue {
  /** Detik lokal dalam bab rekaman misi-02; bukan timer UI. */
  at: number;
  line: number;
  target: MissionTarget;
  title: string;
  info: string;
  icon: string;
}
const cue = (at: number, line: number, target: MissionTarget, title: string, info: string, icon = "rocket_launch"): MissionCue => ({ at, line, target, title, info, icon });

// Batas kalimat mengikuti jeda rekaman Sulafat misi-02 (402,08 detik).
// Beberapa topik di tengah kalimat memakai perkiraan posisi frasa; lihat docs/roket/TIMELINE.md.
export const MISSION_CUES: Record<string, readonly MissionCue[]> = {
  landasan: [
    cue(0, 0, "landasan", "Petualangan dimulai!", "Kita bersiap di landasan peluncuran di tepi pantai Biak, Papua.", "explore"),
    cue(11.82, 1, "roket", "Kenali roket kita", "Roket membawa kapsul, astronaut, dan bahan bakar menuju angkasa."),
    cue(17.1, 1, "menara", "Menara peluncuran", "Menara dan jembatannya membantu astronaut masuk ke kapsul.", "cell_tower"),
    cue(22.38, 2, "roket", "Siap berangkat?", "Ikuti perjalanan dari landasan, menembus atmosfer, sampai ke orbit!"),
  ],
  "tujuan-misi": [
    cue(0, 0, "astronaut", "Kenapa menjadi astronaut?", "Astronaut menjelajah dan mencari jawaban tentang Bumi dan angkasa.", "person"),
    cue(3.74, 1, "stasiun", "Laboratorium di angkasa", "Di stasiun, astronaut mempelajari tanaman dan tubuh saat terasa tanpa bobot.", "science"),
    cue(15.74, 2, "bumi", "Mengamati rumah kita", "Dari orbit, astronaut mempelajari Bumi dan bersiap untuk perjalanan lebih jauh.", "public"),
  ],
  "baju-antariksa": [
    cue(0, 0, "astronaut", "Ini astronaut kita!", "Latihan di kolam besar membantu astronaut berlatih bergerak di angkasa.", "person"),
    cue(9.26, 1, "astronaut", "Baju pelindung istimewa", "Baju antariksa menyediakan udara, menjaga tekanan, dan melindungi tubuh.", "shield"),
    cue(17.74, 2, "helm", "Pelindung mata astronaut", "Lapisan pada kaca helm membantu mengurangi silau Matahari.", "visibility"),
  ],
  "naik-kapsul": [
    cue(0, 0, "astronaut", "Naik menuju kapsul", "Ikuti astronaut naik menara dan menyeberangi jembatan.", "cell_tower"),
    cue(6.57, 1, "kapsul", "Rumah kecil di puncak roket", "Astronaut menempati kapsul. Sebagian besar bagian roket lain membawa bahan bakar.", "radio_button_checked"),
  ],
  "dalam-kapsul": [
    cue(0, 0, "kabin", "Yuk, masuk ke kapsul!", "Ada kursi, layar kendali, dan jendela untuk melihat ke luar.", "window"),
    cue(9.39, 1, "kursi", "Pasang sabuk pengaman", "Kursi khusus menopang tubuh astronaut selama peluncuran.", "airline_seat_recline_normal"),
    cue(18.39, 2, "boneka", "Perhatikan bonekanya", "Di landasan, gravitasi menarik boneka sehingga talinya menjuntai.", "star"),
  ],
  "hitung-mundur": [
    cue(0, 0, "menara", "Jembatan menjauh", "Jembatan akses bergerak menjauh agar roket siap meluncur.", "cell_tower"),
    cue(5.83, 1, "roket", "Hitung bersama!", "Sepuluh… sembilan… delapan… bersiap meluncur!", "timer"),
  ],
  "lepas-landas": [
    cue(0, 0, "mesin", "Mesin roket menyala!", "Gas panas disemburkan ke bawah dengan kuat.", "local_fire_department"),
    cue(5.74, 1, "roket", "Roket terdorong ke atas", "Gas bergerak ke bawah, roket terdorong ke atas. Mirip balon yang dilepas!"),
  ],
  "gaya-g": [
    cue(0, 0, "kursi", "Tubuh terasa lebih berat", "Saat roket mempercepat lajunya, kursi menekan tubuh astronaut.", "airline_seat_recline_normal"),
    cue(6.7, 1, "konsol", "Lihat layar gaya G", "Angka pada layar menunjukkan besarnya gaya yang dirasakan astronaut.", "speed"),
  ],
  troposfer: [
    cue(0, 0, "awan", "Troposfer: rumah cuaca", "Awan, hujan, angin, dan sebagian besar kegiatan kita berada di lapisan terbawah.", "cloud"),
    cue(10.09, 1, "awan", "Udara makin tipis", "Di troposfer, suhu umumnya turun saat kita naik lebih tinggi.", "thermostat"),
  ],
  stratosfer: [
    cue(0, 0, "ozon", "Ozon melindungi Bumi", "Lapisan ozon menyerap banyak sinar ultraviolet dari Matahari.", "shield"),
    cue(9.89, 1, "ozon", "Langit makin gelap", "Udara semakin tipis, sehingga lebih sedikit cahaya tersebar ke mata kita.", "layers"),
  ],
  mesosfer: [
    cue(0, 0, "roket", "Mesosfer yang dingin", "Di bagian atas mesosfer, suhu dapat mendekati −90 °C.", "thermostat"),
    cue(9.63, 1, "meteor", "Kilatan meteor!", "Banyak batu angkasa kecil berpijar dan hancur saat memasuki atmosfer.", "auto_awesome"),
  ],
  "pisah-tahap": [
    cue(0, 0, "tahap-1", "Tahap pertama dilepas", "Setelah bahan bakarnya habis, tahap pertama berpisah agar roket lebih ringan.", "view_day"),
    cue(5.56, 1, "tahap-2", "Giliran tahap kedua", "Mesin tahap kedua melanjutkan dorongan menuju orbit.", "local_fire_department"),
  ],
  "garis-karman": [
    cue(0, 0, "roket", "Melewati 100 kilometer", "Garis Kármán sering dipakai sebagai batas awal luar angkasa.", "flag"),
    cue(10.03, 1, "orbit", "Selamat datang di angkasa", "Langit tampak gelap. Di bawah kita, atmosfer menyelimuti Bumi.", "auto_awesome"),
  ],
  gravitasi: [
    cue(0, 0, "bumi", "Gravitasi masih ada", "Tarikan gravitasi Bumi tetap bekerja di luar angkasa.", "public"),
    cue(9.31, 1, "kapsul", "Melaju sangat cepat", "Untuk mengorbit rendah, kapsul bergerak ke samping sekitar 28.000 km/jam.", "speed"),
    cue(17.03, 2, "orbit", "Jatuh mengelilingi Bumi", "Orbit terjadi saat gerak ke samping dan tarikan gravitasi membuat lintasan mengelilingi Bumi.", "orbit"),
  ],
  "tanpa-bobot": [
    cue(0, 0, "boneka", "Wah, bonekanya melayang!", "Kapsul dan boneka jatuh bersama-sama sambil mengorbit Bumi.", "star"),
    cue(6.25, 1, "kabin", "Terasa tanpa bobot", "Astronaut ikut jatuh bersama kapsul, sehingga tidak terasa ditekan ke kursi.", "person"),
  ],
  termosfer: [
    cue(0, 0, "orbit", "Termosfer", "Udara di sini sangat tipis. Kita semakin dekat dengan stasiun angkasa.", "layers"),
    cue(3.7, 1, "aurora", "Cahaya aurora menari", "Partikel dari Matahari berinteraksi dengan gas atmosfer dan menghasilkan cahaya.", "auto_awesome"),
    cue(10.08, 1, "stasiun", "Stasiun di depan kita!", "Lihat laboratorium besar tempat astronaut tinggal dan bekerja.", "satellite_alt"),
  ],
  merapat: [
    cue(0, 0, "kapsul", "Pelan-pelan… merapat", "Kapsul mendekat dan menyambungkan pintunya dengan stasiun.", "radio_button_checked"),
    cue(5.86, 1, "stasiun", "Rumah yang mengorbit", "Stasiun mengelilingi Bumi sekitar 90 menit sekali, dengan banyak matahari terbit setiap hari.", "satellite_alt"),
  ],
  kupola: [
    cue(0, 0, "kupola", "Bumi dari jendela kupola", "Laut, awan, dan daratan terlihat melalui jendela pengamatan stasiun.", "public"),
    cue(10.3, 1, "kupola", "Hidup di stasiun", "Kantong tidur diikat agar tetap di tempat. Minuman disimpan dalam kantong khusus.", "bedtime"),
  ],
  bertugas: [
    cue(0, 0, "panel-surya", "Sayap penghasil listrik", "Panel surya mengubah energi cahaya Matahari menjadi listrik untuk stasiun.", "solar_power"),
    cue(9.52, 1, "astronaut", "Bertugas di luar stasiun", "Baju antariksa melindungi astronaut. Tali pengaman menjaganya tetap terhubung.", "person"),
    cue(14.96, 1, "bumi", "Atmosfer yang tipis", "Garis bercahaya di tepi Bumi memperlihatkan lapisan udara yang melindungi rumah kita.", "public"),
  ],
  eksosfer: [
    cue(0, 0, "orbit", "Eksosfer: lapisan terluar", "Di lapisan ini partikel udara sangat berjauhan.", "layers"),
    cue(7.59, 1, "satelit", "Satelit membantu kita", "Ada satelit pengamat cuaca, penunjuk arah, dan komunikasi.", "satellite_alt"),
  ],
  penutup: [
    cue(0, 0, "orbit", "Misi berhasil!", "Kita telah menjelajahi lapisan atmosfer, gravitasi, dan orbit.", "verified"),
    cue(8.44, 1, "bumi", "Bawa pulang ceritamu", "Ceritakan penemuan favoritmu kepada Ayah dan Ibu. Sampai jumpa!", "public"),
  ],
};

export const MISSION_AUDIO_DURATION = 402.080542;
export const missionDurations = () => MISI.map((stop, i) => {
  const part = MISI_AUDIO.find(p => i >= p.first && i < p.first + p.cues.length);
  if (!part) return dwellSeconds(stop);
  const k = i - part.first;
  return (part.cues[k + 1] ?? MISSION_AUDIO_DURATION) - part.cues[k];
});
const recordedDurations = missionDurations();

/** One lookup drives both the information card and camera, including paused seeks. */
export function missionCueAt(stop: number, seconds: number, duration = recordedDurations[stop]) {
  const chapter = MISI[stop] ?? MISI[0];
  const cues = MISSION_CUES[chapter.id];
  const local = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const scaled = duration > 0 ? local / duration * recordedDurations[stop] : 0;
  let index = 0;
  while (index + 1 < cues.length && scaled >= cues[index + 1].at) index++;
  return { ...cues[index], key: `${chapter.id}:${index}`, caption: chapter.lines[cues[index].line] };
}
