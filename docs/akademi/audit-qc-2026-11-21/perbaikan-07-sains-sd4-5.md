# Perbaikan QC 07: SAINS SD4–SD5

Sumber temuan: `temuan-07-sains-sd4-5.md`. Semua path relatif terhadap `content/paket/`. Validasi skema: 810 paket valid. Audit: 0 ERROR/WARNING untuk paket sd4-sains/sd5-sains. ERROR `soal-berulang-satu-sesi` yang tersisa (bayar-koin-*, kasir-kembalian-*, ikan-kolam-sisa, kue-piring-sisa, kolam-ikan-lebih-banyak, piring-kue-lebih-banyak, bagi-ikan-dua-kucing) milik paket MAT agen lain.

## Diterapkan
| keparahan | paket | apa yang diubah |
|---|---|---|
| KRITIS | urutkan/sd5-sains-jalan-makanan, urutkan/sd5-sains-jalan-makanan-perbaiki (1.1.0 → 1.1.1) | Setiap urutan sekarang berupa jalur yang utuh dan bersambung dari organ awalnya sampai anus (mulut → kerongkongan → lambung → usus halus → usus besar → rektum → anus). Organ yang hilang di tengah dilengkapi dengan pola teks yang sama: cerna (+rektum), pisang (+kerongkongan), telur (+lambung), bayam (+usus halus), sate (+lambung), jagung (+kerongkongan, +lambung), ikan (+usus halus), tempe (+kerongkongan, +usus besar), kentang (+usus besar). Titik awal tetap beragam (6 urutan mulai dari mulut, 4 dari kerongkongan, 1 dari lambung), jadi potongan `slice(0,n)` di steps 4/5/6 tetap menghasilkan beberapa susunan organ yang berbeda. Panjang maksimal 7 langkah. Knob tidak diubah. |
| KRITIS | urutkan/sd4-sains-lapisan-bumi (1.1.0 → 1.1.1), urutkan/sd4-sains-lapisan-bumi-tertukar (1.0.0 → 1.0.1) | Semua urutan 3 lapisan (8 per paket) diberi judul baru yang tetap benar walau ada lapisan yang tidak ditampilkan: `s-luarke-lapis`/`t-turun-lapis` "Urutkan dari lapisan paling luar ke paling dalam" dan `s-dalamke-lapis`/`t-naik-lapis` "Urutkan dari lapisan paling dalam ke paling luar". Judul perjalanan (bor/kapsul, "Dari permukaan ke pusat Bumi") hanya dipakai untuk urutan 4 lapisan yang lengkap. Urutan tidak diubah, jadi variasi soal tetap. Instruksi paket tertukar disesuaikan: "…sesuai arah di judul." |
| SEDANG | pilah/sd5-sains-tugas-organ-cerna | usushalus emoji 🌀 → 〰️ |
| SEDANG | pilah/sd5-sains-tugas-bagian-bunga | tangkaiputik ➖ → bentuk rect #81c784 skala 0.6 |
| SEDANG | pilah/sd5-sains-biji-menjelajah-bukit | item teratai diganti `keben` 🌰 "buah keben (butun) bergabus, mengapung di laut" → air. Kartu pletekan: label "buah pletekan pecah sendiri dan melontarkan biji", emoji 💦 → 🪻. Usul 💥 tidak dipakai karena sama dengan emoji wadah "letup" dan akan membocorkan jawaban. |
| SEDANG | pilah/sd5-sains-larut-atau-tidak | gulabatu 🧊 → square #e0e0e0 skala 0.6; gula 🍚 → circle #e0e0e0 skala 0.4 count 6. Warna abu muda dipakai, bukan #ffffff, supaya tidak hilang di kartu putih. |
| SEDANG | pilah/sd4-sains-padat-atau-cair, pilah/sd5-sains-variabel-penyelidikan | gula / banyakgula 🍚 → butiran circle #e0e0e0 skala 0.4 count 6 |
| SEDANG | pilah/sd5-sains-pisah-campuran-sungai | r1 pilihan `magnet, ayak, uap` → `magnet, endap, uap` |
| SEDANG | pilah/sd5-sains-rotasi-revolusi-menara | kali11 1️⃣ → 11 titik (circle #90caf9 count 11). Usul 🎂 tidak dipakai karena membocorkan jawaban soal "umur 11 tahun". satelit 🛰️ → 🌙 |
| SEDANG | pilah/sd5-sains-pemburu-dan-penghindar-laut | kartu bunglon diganti `katak` 🐸 "katak: lidah panjang lengket untuk menangkap serangga" → pemangsa. Usul `color` pada emoji tidak dipakai karena presenter (benda.tsx) tidak mewarnai emoji. |
| SEDANG | pilah/sd5-sains-tumbuhan-bukit-berbunga | tanduk 🦌 → 🌿 |
| SEDANG | pilah/sd5-sains-tertarik-magnet | plastik 🥄 → rect #4fc3f7 skala 0.6 (warna pada emoji tidak tampil); tembaga 🧵 → rect #b87333 width 3 skala 0.6 |
| SEDANG | pilah/sd4-sains-terang-atau-redup | p-r6 ditulis ulang supaya hanya bisa dibaca satu arah |
| KECIL | urutkan/sd5-sains-siklus-tumbuhan-berbunga | stroberi-buah: "bunga yang sudah diserbuki tumbuh jadi stroberi…" |
| KECIL | urutkan/sd5-sains-siklus-tumbuhan-perbaiki | langkah pepaya-buah 🍈 → circle #ffa726 skala 1.1 |
| KECIL | pilah/sd5-sains-pencernaan-hewan-ternak | p-r11 ikan → kambing |
| KECIL | pilah/sd5-sains-tamu-bunga-taman | tangkai 🥢 → rect #66bb6a skala 0.8. Tidak memakai 🌿 karena sudah dipakai untuk "daun" di pilihan yang sama. |
| KECIL | pilah/sd5-sains-tugas-bagian-bunga | label putik "(karpel)" → "(pistil)" |
| KECIL | pilah/sd5-sains-tumbuhan-bukit-berbunga | lumuttembok 🧱 → 🟩, ekorkuda 🎋 → 🌿. Warna tidak dipakai, dan emojinya sama dengan item lain di wadah yang sama, jadi tidak menyesatkan. |
| KECIL | pilah/sd5-sains-tertarik-magnet, pilah/sd5-sains-magnet-gudang-logam, pilah/sd4-sains-konduktor-isolator | emas → circle #ffd54f 0.7; foil → rect #cfd8dc (di dua paket); staples → rect #9e9e9e 0.4; penghapus → rect #f48fb1 0.7; tutupbotol → circle #bdbdbd 0.5 |
| KECIL | pilah/sd5-sains-bumi-bulan-orbit, pilah/sd5-sains-rotasi-revolusi-menara | Emoji kalender diseragamkan: 1 tahun 🗓️, 1 bulan 📅, 1 minggu 7️⃣, 1 hari 🕛. Usul 🌕/☀️ tidak dipakai karena membocorkan jawaban soal Bulan/Matahari. |
| KECIL | pilah/sd5-sains-bumi-bulan-orbit | elips ⬭ → circle #90caf9 width 1.6 |
| KECIL | pilah/sd5-sains-tinggi-nyaring-bunyi | tinggi 🎵 → 🔼, rendah 🎶 → 🔽 |
| KECIL | pilah/sd5-sains-pisah-campuran-sungai | p-r4 tidak lagi menyebut caranya |
| KECIL | urutkan/sd5-sains-siklus-air | keringat-4 "mengalir ke sungai dan danau" |
| KECIL | pilah/sd5-sains-pemburu-dan-penghindar-laut | "zig-zag" → "zigzag" |
| KECIL | pilah/sd4-sains-sumber-atau-pantulan | "mengkilap" → "mengilap" |
| KECIL | pilah/sd4-sains-otot-berpasangan, pilah/sd4-sains-otot-tarik-ulur | "trisep" → "triseps" di label dan di semua soal paket itu supaya ejaannya seragam |
| KECIL | pilah/sd4-sains-tulang-di-tempatnya | dada 🫁 → 🦴 |
| KECIL | pilah/sd4-sains-uji-adil | p-r8 ditulis ulang sesuai usul |
| KECIL | pilah/sd4-sains-siang-malam-bayangan | dekat 🔜 → ↘️ |
| KECIL | pilah/sd4-sains-rangka-bekerja | instruksi tanpa "di taman" |
| SEDANG→aman | pilah/sd5-sains-tamu-bunga-taman | (keputusan yang aman) p-r12 kolibri → burung madu |
| KECIL→aman | pilah/sd5-sains-biji-menjelajah-bukit | (keputusan yang aman) judul "Biji Menjelajah" / "Seeds on the Move" |
| KECIL→aman | urutkan/sd4-sains-lebur-dan-beku-pabrik (1.0.0 → 1.0.1) | (keputusan yang aman) judul "Lebur dan Beku di Sekitar Kita" / "Melting and Freezing All Around" |

Versi patch setiap paket di atas dinaikkan satu kali.

## Kalimat suara berubah (WAJIB lengkap)
Tabel ini dibuat otomatis dengan membandingkan `locale.id` HEAD dan berkas kerja (51 baris).

| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd4-sains-otot-berpasangan | i-trisep | otot belakang lengan atas (trisep) | otot belakang lengan atas (triseps) |
| sd4-sains-otot-berpasangan | p-r3 | Saat biseps mengerut, trisep… | Saat biseps mengerut, triseps… |
| sd4-sains-otot-tarik-ulur | i-trisep | otot belakang lengan atas (trisep) | otot belakang lengan atas (triseps) |
| sd4-sains-otot-tarik-ulur | p-sisir | Siku ditekuk untuk menyisir rambut. Otot trisep… | Siku ditekuk untuk menyisir rambut. Otot triseps… |
| sd4-sains-otot-tarik-ulur | p-trisepkerut | Otot trisep mengerut dan biseps mengendur. Lengan sedang… | Otot triseps mengerut dan biseps mengendur. Lengan sedang… |
| sd4-sains-otot-tarik-ulur | p-bisepkerut | Otot biseps mengerut dan trisep mengendur. Lengan sedang… | Otot biseps mengerut dan triseps mengendur. Lengan sedang… |
| sd4-sains-rangka-bekerja | instruksi | Dengarkan kejadian di taman, lalu sentuh tugas rangka yang paling terlihat di situ. | Dengarkan kejadiannya, lalu sentuh tugas rangka yang paling terlihat di situ. |
| sd4-sains-sumber-atau-pantulan | i-sendok | sendok mengkilap | sendok mengilap |
| sd4-sains-terang-atau-redup | p-r6 | Baterai yang baru diganti baterai lama yang hampir habis. Lampunya jadi… | Baterai baru dilepas, lalu diganti baterai lama yang hampir habis. Lampunya jadi… |
| sd4-sains-uji-adil | p-r8 | Dua mobil-mobilan berbeda diuji, mana yang meluncur lebih jauh dari papan miring, tetapi satu dilepas dari tempat lebih tinggi. Mengapa tidak adil? | Dua mobil-mobilan diuji di papan miring untuk melihat mana yang meluncur lebih jauh, tetapi satu dilepas dari tempat lebih tinggi. Mengapa ujinya tidak adil? |
| sd5-sains-biji-menjelajah-bukit | judul | Biji Menyeberangi Sungai | Biji Menjelajah |
| sd5-sains-biji-menjelajah-bukit | i-teratai | biji teratai lepas dari polongnya dan hanyut di kolam | (dihapus) |
| sd5-sains-biji-menjelajah-bukit | i-pletekan | buah pletekan pecah melontarkan biji saat kena air | buah pletekan pecah sendiri dan melontarkan biji |
| sd5-sains-biji-menjelajah-bukit | i-keben | (baru) | buah keben (butun) bergabus, mengapung di laut |
| sd5-sains-pemburu-dan-penghindar-laut | i-bunglon | bunglon: lidah panjang lengket untuk menangkap serangga | (dihapus) |
| sd5-sains-pemburu-dan-penghindar-laut | i-rusa | rusa: berlari zig-zag saat dikejar | rusa: berlari zigzag saat dikejar |
| sd5-sains-pemburu-dan-penghindar-laut | i-katak | (baru) | katak: lidah panjang lengket untuk menangkap serangga |
| sd5-sains-pencernaan-hewan-ternak | p-r11 | Dokter hewan memeriksa kerbau, ayam, dan ikan. Semuanya punya mulut, lambung, dan usus. Kesimpulannya… | Dokter hewan memeriksa kerbau, ayam, dan kambing. Semuanya punya mulut, lambung, dan usus. Kesimpulannya… |
| sd5-sains-pisah-campuran-sungai | p-r4 | Ampas kopi tubruk ingin dipisahkan dengan cara menunggu ampasnya turun ke dasar gelas. | Ampas kopi tubruk tercampur di gelas. Tidak ada saringan. |
| sd5-sains-tamu-bunga-taman | p-r12 | Burung kolibri mencari bunga berwarna merah menyala. Bagian bunga yang menarik perhatiannya adalah… | Burung madu mencari bunga berwarna merah menyala. Bagian bunga yang menarik perhatiannya adalah… |
| sd5-sains-tugas-bagian-bunga | i-putik | putik (karpel) | putik (pistil) |
| sd4-sains-lapisan-bumi-tertukar | instruksi | Dua lapisan Bumi tertukar. Tukar sekali supaya urutannya benar sesuai arah perjalanan. | Dua lapisan Bumi tertukar. Tukar sekali supaya urutannya benar sesuai arah di judul. |
| sd4-sains-lapisan-bumi-tertukar | t-turun-lapis | (baru) | Urutkan dari lapisan paling luar ke paling dalam |
| sd4-sains-lapisan-bumi-tertukar | t-naik-lapis | (baru) | Urutkan dari lapisan paling dalam ke paling luar |
| sd4-sains-lapisan-bumi | s-luarke-lapis | (baru) | Urutkan dari lapisan paling luar ke paling dalam |
| sd4-sains-lapisan-bumi | s-dalamke-lapis | (baru) | Urutkan dari lapisan paling dalam ke paling luar |
| sd4-sains-lebur-dan-beku-pabrik | judul | Lebur dan Beku di Pabrik | Lebur dan Beku di Sekitar Kita |
| sd5-sains-jalan-makanan-perbaiki | cerna-rektum | (baru) | rektum: sisa ditampung sebentar |
| sd5-sains-jalan-makanan-perbaiki | pisang-kerongkongan | (baru) | kerongkongan: pisang yang sudah lumat didorong turun |
| sd5-sains-jalan-makanan-perbaiki | telur-lambung | (baru) | lambung: telur diaduk dengan cairan asam |
| sd5-sains-jalan-makanan-perbaiki | bayam-usushalus | (baru) | usus halus: sari bayam diserap ke darah |
| sd5-sains-jalan-makanan-perbaiki | sate-lambung | (baru) | lambung: sate diaduk dengan cairan asam |
| sd5-sains-jalan-makanan-perbaiki | jagung-kerongkongan | (baru) | kerongkongan: jagung yang sudah lumat didorong turun |
| sd5-sains-jalan-makanan-perbaiki | jagung-lambung | (baru) | lambung: jagung diaduk dengan cairan asam |
| sd5-sains-jalan-makanan-perbaiki | ikan-usushalus | (baru) | usus halus: sari ikan diserap ke darah |
| sd5-sains-jalan-makanan-perbaiki | tempe-kerongkongan | (baru) | kerongkongan: tempe yang sudah lumat didorong turun |
| sd5-sains-jalan-makanan-perbaiki | tempe-ususbesar | (baru) | usus besar: air diserap dari sisa tempe |
| sd5-sains-jalan-makanan-perbaiki | kentang-ususbesar | (baru) | usus besar: air diserap dari sisa kentang |
| sd5-sains-jalan-makanan | cerna-rektum | (baru) | rektum: sisa ditampung sebentar |
| sd5-sains-jalan-makanan | pisang-kerongkongan | (baru) | kerongkongan: pisang yang sudah lumat didorong turun |
| sd5-sains-jalan-makanan | telur-lambung | (baru) | lambung: telur diaduk dengan cairan asam |
| sd5-sains-jalan-makanan | bayam-usushalus | (baru) | usus halus: sari bayam diserap ke darah |
| sd5-sains-jalan-makanan | sate-lambung | (baru) | lambung: sate diaduk dengan cairan asam |
| sd5-sains-jalan-makanan | jagung-kerongkongan | (baru) | kerongkongan: jagung yang sudah lumat didorong turun |
| sd5-sains-jalan-makanan | jagung-lambung | (baru) | lambung: jagung diaduk dengan cairan asam |
| sd5-sains-jalan-makanan | ikan-usushalus | (baru) | usus halus: sari ikan diserap ke darah |
| sd5-sains-jalan-makanan | tempe-kerongkongan | (baru) | kerongkongan: tempe yang sudah lumat didorong turun |
| sd5-sains-jalan-makanan | tempe-ususbesar | (baru) | usus besar: air diserap dari sisa tempe |
| sd5-sains-jalan-makanan | kentang-ususbesar | (baru) | usus besar: air diserap dari sisa kentang |
| sd5-sains-siklus-air | keringat-4 | air hujan mengalir kembali ke danau | air hujan mengalir ke sungai dan danau |
| sd5-sains-siklus-tumbuhan-berbunga | stroberi-buah | bakal buah jadi stroberi berbiji di kulitnya | bunga yang sudah diserbuki tumbuh jadi stroberi berbiji di kulitnya |

## Ditolak (bukan masalah)
| temuan | alasan |
|---|---|
| (tidak ada) | Semua temuan `perbaiki` terbukti saat dicek ke JSON. Beberapa diterapkan dengan nilai lain dari usul (alasan di tabel Diterapkan): pletekan tidak memakai 💥 karena bocor ke wadah; kali11 tidak memakai 🎂 karena bocor; kalender tidak memakai 🌕/☀️ karena bocor; `color` pada emoji (bunglon, sendok plastik, paku-pakuan) tidak dipakai karena presenter tidak mewarnai emoji. |

## Butuh keputusan owner
| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sd5-sains-bunyi-alat-musik-kelas / SAINS.SD5.BUNYI.01 | Soal botol ditiup (p-r11) bertentangan arah dengan soal gelas dipukul, padahal catatan kompetensi menyebut "hanya versi pukul" | Hapus ronde, atau ganti dengan versi gelas dipukul |
| SEDANG | sd5-sains-uji-larut-laboratorium / SAINS.SD5.LARUTAN.01 | Madu dan pewarna berupa cairan, tidak cocok dengan "butirannya tak tampak" | Ganti dengan kaldu bubuk dan serbuk pewarna |
| SEDANG | sd5-sains-uji-larut-laboratorium / SAINS.SD5.LARUTAN.01 | Kapur tulis membentuk suspensi, jadi ambigu | Ganti dengan pecahan batu bata → tidak |
| SEDANG | sd5-sains-pemburu-dan-penghindar-laut / SAINS.SD5.ADAPTASI.02 | Samaran dipakai di dua wadah (harimau loreng, belalang daun), bertentangan dengan catatan kompetensi | Ganti harimau dengan macan tutul (lari cepat), atau ubah catatan |
| SEDANG | sd4-sains-lampu-menyala, sd4-sains-rangkaian-di-rumah / SAINS.SD4.LISTRIK.01 | Kartu menyala dan padam memakai emoji yang sama. Catatan: `color` tidak mewarnai emoji, jadi usul "#cfd8dc pada kartu padam" tidak akan terlihat | Biarkan (anak membaca label) dan catat di kompetensi, atau ganti emoji/bentuk kartu padam |
| SEDANG | sd4-sains-wujud-atau-zat-baru; sd4-sains-cahaya-di-kota | Pasangan jebakan memakai emoji yang sama (🕯️, 📺) | Sumbu terbakar → 🔥, atau catat bahwa ini disengaja |
| KECIL | sd4-sains-rantai-makanan-susun/-perbaiki / SAINS.SD4.RANTAI-MAKANAN.01 | Rumput laut sebagai produsen "laut lepas" | Fitoplankton, atau judul "laut dangkal" |
| KECIL | sd4-sains-bertulang-belakang, sd4-sains-hewan-pantai-rangka, sd4-sains-sumber-atau-pantulan, sd4-sains-cahaya-di-kota | Emoji wadah sama dengan emoji salah satu kartunya | Ganti emoji wadah (🛡️, 💧, 💡, ↩️) |
