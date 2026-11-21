# Log audit ambigu — MAT SD3 & SD4 (agen 03)

Cakupan: 80 paket (40 kompetensi MAT.SD3.* dan MAT.SD4.*), semua soal/ronde/instruksi/label rak/judul urutan ditinjau dan kunci jawaban dihitung ulang (pilih, pilah, urutkan). Tidak ada kunci jawaban yang salah. Berkas kurikulum tidak diubah.
Validasi: schema `810 paket konten valid`; akademi:audit ERROR 0, tidak ada temuan (ERROR/WARNING) untuk paket sd3-mat-*/sd4-mat-*.

## Temuan
| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 4 | sd3-mat-barisan-loncat-tetap | j-loncat-* (8 judul) | "Loncat 4 dari 27" tidak menyebut arah, padahal judul lain "Mundur …"; kompetensinya "maju atau mundur" | diperbaiki → "Maju 4 dari 27" dst. (EN "Forward …") |
| 3 | sd3-mat-bulatkan-puluhan-tiga-angka | instruksi | tidak menyebut tugas (membulatkan, menaruh di rak); aturan "kurang dari 5" tidak disebut | diperbaiki |
| 3 | sd3-mat-bulatkan-ratusan | instruksi | sama: tanpa perintah taruh di rak, tanpa aturan turun | diperbaiki |
| 4 | sd3-mat-kotak-es-kutub | instruksi | "tambah atau kurang yang bisa membukanya" kabur | diperbaiki → "hitungan tambah atau kurang apa yang bisa menemukannya" |
| 1 | sd3-mat-kotak-es-kutub | semua soal q1–q12 | kompetensi "sampai 1.000, misalnya □ + 250 = 600", tetapi semua soal di bawah 100 (□ + 30 = 90) | keputusan owner |
| 4 | sd3-mat-rak-bagi-sampai-seratus | instruksi | "berapa kali tiga menjadi 75" janggal | diperbaiki → "3 dikali berapa supaya jadi 75?" |
| 3 | sd3-mat-segi-banyak-beraturan | instruksi | "Pilah tiap bangun" tanpa menyebut rak | diperbaiki → "Taruh tiap bangun di rak beraturan atau tidak beraturan." |
| judul | sd3-mat-jadwal-tertukar | j6 | judul "Sore di rumah" tetapi diawali 13.30 makan siang | diperbaiki → "Siang dan sore di rumah" |
| judul | sd3-mat-urut-jadwal-digital | j-jadwal-siang | "Jadwal siang" berisi kegiatan sampai 17.25 dan satu urutan 14.05–16.50 (sama dengan "Jadwal sore") | diperbaiki → "Jadwal siang dan sore" |
| 3 | sd3-mat-sudut-jarum-jam | instruksi | tidak menyebut taruh di rak | diperbaiki |
| 4 | sd3-mat-sudut-jarum-jam | label rak | "< siku" / "> siku": simbol belum tentu dibaca anak SD3 dan dibaca TTS janggal; beda dengan paket kembarnya | diperbaiki → "lebih kecil dari siku", "sudut siku", "lebih besar dari siku" |
| 6 | sd3-mat-lipat-huruf-dan-kata | instruksi | "Sentuh yang kedua bagiannya pas" bertentangan dengan q7/q8 (jawaban = huruf yang TIDAK pernah pas) | diperbaiki → "Periksa apakah kedua bagiannya pas, lalu sentuh jawaban yang sesuai pertanyaan." |
| 3 | sd3-mat-simetri-dua-arah | instruksi | hanya pertanyaan, tanpa perintah taruh di rak | diperbaiki |
| 2/5 | sd4-mat-soal-cerita-kota | q5, q6, q12 | "dibagi ke kelompok berisi 5" berarti tiap kelompok tepat 5, jadi 18 kelompok penuh (pengecoh) juga masuk akal; "supaya semua dapat" kabur | diperbaiki → "Satu kelompok paling banyak 5 siswa … supaya semua siswa kebagian?" |
| 3 | sd4-mat-genap-ganjil-tiga-bilangan | instruksi | tanpa perintah taruh di rak | diperbaiki |
| 4 | sd4-mat-jam-24-stasiun | instruksi | "sentuh jawaban yang sama" kabur | diperbaiki → "yang menunjukkan waktu yang sama" |
| 5 | sd4-mat-durasi-dan-jadwal | q12 | "4 hari mulai hari Senin": apakah Senin terhitung? (Kamis vs Jumat) | diperbaiki → "selama 4 hari. Hari pertamanya Senin." |
| 5 | sd4-mat-lama-waktu-sekolah | q12 | "6 hari mulai hari Minggu": sama (Jumat vs Sabtu) | diperbaiki → "Hari pertamanya Minggu." |
| 4 | sd4-mat-keliling-dan-luas | q9 | "Luas keduanya" bisa dibaca luas masing-masing | diperbaiki → "Jumlah luas kedua kamar …" |
| 5 | sd4-mat-ukur-lapangan | q1, q2 (+ c1, c5) | panjang lebih pendek dari lebar (88 cm², lebar 11 → panjang 8; 72, lebar 9 → 8) | diperbaiki → lebar 8 cm, jawaban 11 cm / 9 cm; pengecoh baru 80 cm (88−8), 64 cm (72−8); 19/17 cm (jumlah) dan 16 cm tetap |
| 4 | sd4-mat-diagram-carroll-kelipatan | b-b5-b3, b-k5-k3 | "bukan keduanya" bisa dibaca "tidak dua-duanya" (cocok juga untuk kelipatan 5 bukan 3); "&" dibaca TTS janggal | diperbaiki → "bukan kelipatan 5, bukan kelipatan 3"; "kelipatan 5 dan 3" |
| 5 | sd3-mat-segi-banyak-beraturan | item "segi lima", "segi enam" | nama saja tidak menjamin beraturan; bergantung gambar ⬟/⬡ (beraturan) | ditolak (gambar menentukan; menambah "beraturan" membocorkan jawaban) |
| 5 | sd3-mat-simetri-dua-arah, sd3-mat-lipat-huruf-dan-kata | huruf K | simetri mendatar K bergantung huruf (font) | ditolak (sengaja sebagai jebakan di catatan kompetensi; SD4 sudah menghindari K) |
| 2 | sd4-mat-keliling-dan-luas | q10 "Mana yang lebih luas?" | jawaban "sama luas" | ditolak (pilihan "sama luas" tersedia, satu jawaban) |

Diperiksa tanpa temuan: semua kunci jawaban paket pilih (SD3: peti ratusan, ember kerang, toko kue, kotak es, kotak pensil, panen, ukur sisi, lipat huruf, satuan; SD4: nilai tempat ×2, soal cerita ×2, barisan ×2, jam 24 ×2, durasi ×2, keliling/luas ×2, peluang ×2), semua rak pilah (menyimpan/meminjam satu kali, pembulatan, Carroll, pecahan senilai, simetri, sudut), semua urutan (tidak ada nilai kembar dalam satu urutan), paket dagang.

## Kalimat suara berubah
| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd3-mat-barisan-loncat-tetap | j-loncat-4-dari-27 | Loncat 4 dari 27 | Maju 4 dari 27 |
| sd3-mat-barisan-loncat-tetap | j-loncat-3-dari-58 | Loncat 3 dari 58 | Maju 3 dari 58 |
| sd3-mat-barisan-loncat-tetap | j-loncat-6-dari-30 | Loncat 6 dari 30 | Maju 6 dari 30 |
| sd3-mat-barisan-loncat-tetap | j-loncat-30-dari-140 | Loncat 30 dari 140 | Maju 30 dari 140 |
| sd3-mat-barisan-loncat-tetap | j-loncat-10-dari-385 | Loncat 10 dari 385 | Maju 10 dari 385 |
| sd3-mat-barisan-loncat-tetap | j-loncat-9-dari-18 | Loncat 9 dari 18 | Maju 9 dari 18 |
| sd3-mat-barisan-loncat-tetap | j-loncat-100-dari-75 | Loncat 100 dari 75 | Maju 100 dari 75 |
| sd3-mat-barisan-loncat-tetap | j-loncat-20-dari-860 | Loncat 20 dari 860 | Maju 20 dari 860 |
| sd3-mat-bulatkan-puluhan-tiga-angka | instruksi | Lihat angka satuannya saja. 5 ke atas naik ke puluhan berikutnya. | Bulatkan ke puluhan terdekat. Lihat angka satuannya: 5 ke atas naik ke puluhan berikutnya, kurang dari 5 tetap. Taruh di rak hasilnya. |
| sd3-mat-bulatkan-ratusan | instruksi | Lihat angka puluhannya. Puluhan 5 ke atas naik ke ratusan berikutnya. | Bulatkan ke ratusan terdekat. Lihat angka puluhannya: 5 ke atas naik ke ratusan berikutnya, kurang dari 5 tetap. Taruh di rak hasilnya. |
| sd3-mat-kotak-es-kutub | instruksi | Kotak □ menyembunyikan satu bilangan. Pikirkan: tambah atau kurang yang bisa membukanya? Sentuh bilangannya. | Kotak □ menyembunyikan satu bilangan. Pikirkan: hitungan tambah atau kurang apa yang bisa menemukannya? Sentuh bilangannya. |
| sd3-mat-rak-bagi-sampai-seratus | instruksi | 75 ÷ 3 artinya berapa kali tiga menjadi 75. Taruh tiap kartu di rak hasilnya. | 75 ÷ 3 artinya: 3 dikali berapa supaya jadi 75? Taruh tiap kartu di rak hasilnya. |
| sd3-mat-segi-banyak-beraturan | instruksi | Beraturan artinya semua sisi sama panjang dan semua sudut sama besar. Pilah tiap bangun. | Beraturan artinya semua sisi sama panjang dan semua sudut sama besar. Taruh tiap bangun di rak beraturan atau tidak beraturan. |
| sd3-mat-jadwal-tertukar | j6 | Sore di rumah | Siang dan sore di rumah |
| sd3-mat-urut-jadwal-digital | j-jadwal-siang | Jadwal siang | Jadwal siang dan sore |
| sd3-mat-sudut-jarum-jam | instruksi | Lihat sudut di antara dua jarum jam. Bandingkan dengan sudut siku seperti pojok buku. | Lihat sudut di antara dua jarum jam. Bandingkan dengan sudut siku seperti pojok buku, lalu taruh tiap jam di raknya. |
| sd3-mat-sudut-jarum-jam | b-kurang-siku | < siku | lebih kecil dari siku |
| sd3-mat-sudut-jarum-jam | b-siku | siku | sudut siku |
| sd3-mat-sudut-jarum-jam | b-lebih-siku | > siku | lebih besar dari siku |
| sd3-mat-lipat-huruf-dan-kata | instruksi | Bayangkan garis lipat tegak (dari atas ke bawah) dan garis lipat mendatar (dari kiri ke kanan). Sentuh yang kedua bagiannya pas. | Bayangkan garis lipat tegak (dari atas ke bawah) dan garis lipat mendatar (dari kiri ke kanan). Periksa apakah kedua bagiannya pas, lalu sentuh jawaban yang sesuai pertanyaan. |
| sd3-mat-simetri-dua-arah | instruksi | Bayangkan garis lipat tegak (dari atas ke bawah), lalu garis lipat mendatar (dari kiri ke kanan). Di garis mana kedua bagian huruf pas? | Bayangkan garis lipat tegak (dari atas ke bawah), lalu garis lipat mendatar (dari kiri ke kanan). Di garis mana kedua bagian huruf pas? Taruh tiap huruf di raknya. |
| sd4-mat-soal-cerita-kota | q5 | 91 siswa dibagi ke kelompok berisi 5. Paling sedikit berapa kelompok supaya semua dapat? | Ada 91 siswa. Satu kelompok paling banyak 5 siswa. Paling sedikit berapa kelompok supaya semua siswa kebagian? |
| sd4-mat-soal-cerita-kota | q6 | 71 siswa dibagi ke kelompok berisi 6. Paling sedikit berapa kelompok supaya semua dapat? | Ada 71 siswa. Satu kelompok paling banyak 6 siswa. Paling sedikit berapa kelompok supaya semua siswa kebagian? |
| sd4-mat-soal-cerita-kota | q12 | 74 siswa dibagi ke kelompok berisi 5. Paling sedikit berapa kelompok supaya semua dapat? | Ada 74 siswa. Satu kelompok paling banyak 5 siswa. Paling sedikit berapa kelompok supaya semua siswa kebagian? |
| sd4-mat-genap-ganjil-tiga-bilangan | instruksi | Lihat angka satuan tiap bilangan. Tanpa menghitung, apakah hasilnya genap atau ganjil? | Lihat angka satuan tiap bilangan. Tanpa menghitung, apakah hasilnya genap atau ganjil? Taruh di raknya. |
| sd4-mat-jam-24-stasiun | instruksi | Ubah waktunya ke format lain, lalu sentuh jawaban yang sama. | Ubah waktunya ke format lain, lalu sentuh jawaban yang menunjukkan waktu yang sama. |
| sd4-mat-durasi-dan-jadwal | q12 | Pameran dibuka 4 hari mulai hari Senin. Hari terakhirnya … | Pameran dibuka selama 4 hari. Hari pertamanya Senin. Hari terakhirnya … |
| sd4-mat-lama-waktu-sekolah | q12 | Lomba berlangsung 6 hari mulai hari Minggu. Hari terakhirnya … | Lomba berlangsung 6 hari. Hari pertamanya Minggu. Hari terakhirnya … |
| sd4-mat-keliling-dan-luas | q9 | Dua kamar: 3 m × 4 m dan 2 m × 4 m. Luas keduanya … | Dua kamar: 3 m × 4 m dan 2 m × 4 m. Jumlah luas kedua kamar … |
| sd4-mat-ukur-lapangan | q1 | Luas kertas 88 cm² dan lebarnya 11 cm. Panjangnya … | Luas kertas 88 cm² dan lebarnya 8 cm. Panjangnya … |
| sd4-mat-ukur-lapangan | c1 | 8 cm | 80 cm |
| sd4-mat-ukur-lapangan | q2 | Luas kertas 72 cm² dan lebarnya 9 cm. Panjangnya … | Luas kertas 72 cm² dan lebarnya 8 cm. Panjangnya … |
| sd4-mat-ukur-lapangan | c5 | 63 cm | 64 cm |
| sd4-mat-diagram-carroll-kelipatan | b-k5-k3 | kelipatan 5 & 3 | kelipatan 5 dan 3 |
| sd4-mat-diagram-carroll-kelipatan | b-b5-b3 | bukan keduanya | bukan kelipatan 5, bukan kelipatan 3 |
| sd3-mat-kotak-es-kutub | q1 | Beruang kutub menutup satu bilangan dengan es: □ + 30 = 90. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: □ + 300 = 900. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c1 | 60 | 600 |
| sd3-mat-kotak-es-kutub | c2 | 120 | 1.200 |
| sd3-mat-kotak-es-kutub | c3 | 70 | 700 |
| sd3-mat-kotak-es-kutub | c4 | 59 | 590 |
| sd3-mat-kotak-es-kutub | q2 | Beruang kutub menutup satu bilangan dengan es: 45 − □ = 20. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: 450 − □ = 200. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c5 | 25 | 250 |
| sd3-mat-kotak-es-kutub | c6 | 65 | 650 |
| sd3-mat-kotak-es-kutub | c7 | 35 | 350 |
| sd3-mat-kotak-es-kutub | c8 | 24 | 240 |
| sd3-mat-kotak-es-kutub | q3 | Beruang kutub menutup satu bilangan dengan es: □ − 12 = 30. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: □ − 120 = 300. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c9 | 42 | 420 |
| sd3-mat-kotak-es-kutub | c10 | 18 | 180 |
| sd3-mat-kotak-es-kutub | c11 | 52 | 520 |
| sd3-mat-kotak-es-kutub | c12 | 41 | 410 |
| sd3-mat-kotak-es-kutub | q4 | Beruang kutub menutup satu bilangan dengan es: 8 + □ = 50. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: 80 + □ = 500. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c13 | 58 | 580 |
| sd3-mat-kotak-es-kutub | q5 | Beruang kutub menutup satu bilangan dengan es: □ + 25 = 60. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: □ + 250 = 600. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c14 | 85 | 850 |
| sd3-mat-kotak-es-kutub | c15 | 45 | 450 |
| sd3-mat-kotak-es-kutub | c16 | 34 | 340 |
| sd3-mat-kotak-es-kutub | q6 | Beruang kutub menutup satu bilangan dengan es: 70 − □ = 35. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: 700 − □ = 350. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c17 | 105 | 1.050 |
| sd3-mat-kotak-es-kutub | q7 | Beruang kutub menutup satu bilangan dengan es: □ − 40 = 15. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: □ − 400 = 150. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c18 | 55 | 550 |
| sd3-mat-kotak-es-kutub | c19 | 54 | 540 |
| sd3-mat-kotak-es-kutub | q8 | Beruang kutub menutup satu bilangan dengan es: 16 + □ = 41. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: 160 + □ = 410. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c20 | 57 | 570 |
| sd3-mat-kotak-es-kutub | q9 | Beruang kutub menutup satu bilangan dengan es: 100 − □ = 64. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: 1.000 − □ = 640. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c21 | 36 | 360 |
| sd3-mat-kotak-es-kutub | c22 | 164 | 1.640 |
| sd3-mat-kotak-es-kutub | c23 | 46 | 460 |
| sd3-mat-kotak-es-kutub | q10 | Beruang kutub menutup satu bilangan dengan es: □ + 9 = 52. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: □ + 90 = 520. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c24 | 43 | 430 |
| sd3-mat-kotak-es-kutub | c25 | 61 | 610 |
| sd3-mat-kotak-es-kutub | c26 | 53 | 530 |
| sd3-mat-kotak-es-kutub | q11 | Beruang kutub menutup satu bilangan dengan es: □ − 18 = 7. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: □ − 180 = 70. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c27 | 11 | 110 |
| sd3-mat-kotak-es-kutub | q12 | Beruang kutub menutup satu bilangan dengan es: 33 + □ = 80. Bilangan di balik □? | Beruang kutub menutup satu bilangan dengan es: 330 + □ = 800. Bilangan di balik □? |
| sd3-mat-kotak-es-kutub | c28 | 47 | 470 |
| sd3-mat-kotak-es-kutub | c29 | 113 | 1.130 |

## Butuh keputusan owner
| paket/kompetensi | masalah | opsi |
|---|---|---|
| — | tidak ada (butir sd3-mat-kotak-es-kutub sudah diputuskan koordinator: opsi a, diperbaiki) | — |
