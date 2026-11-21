# Audit Soal Ambigu — 21 November 2026

Permintaan owner: "cek semua pertanyaan yang ambigu dan gak clear … misal nya itu kan tunjuk hidung nya berarti maksutnya indra penciuman". Semua soal, ronde, dan instruksi untuk anak di PAUD–SD 6 (Matematika, Sains, Coding) ditinjau satu per satu. Pekerjaan dibagi ke 10 peninjau per mapel/jenjang, dan setiap temuan dicek ke JSON aslinya, ke mesin, dan ke presenter.

Lampiran ada di `audit-ambigu-2026-11-21/log-*.md` (tabel temuan, kalimat suara, keputusan per kelompok). Daftar rekam ulang ada di [`audit-ambigu-2026-11-21-suara.md`](audit-ambigu-2026-11-21-suara.md).

## Yang diperiksa per soal
1. Kalimat soal tidak sejalan dengan kompetensi atau tujuan paket. Contoh owner: "Dina mencium bunga yang harum. Tunjuk hidungnya!"
2. Lebih dari satu jawaban masuk akal (pilihan, rak, atau susunan urutan).
3. Perintah tidak menyebut apa yang dilakukan anak, atau tidak cocok dengan mekaniknya.
4. Rujukan kabur ("ini", "itu", "yang tadi" pada ronde yang diacak), atau istilah yang terlalu abstrak dan belum dikenalkan.
5. Jawaban bergantung pada asumsi yang tidak disebut (budaya, musim, satuan, lantai 0, denah).
6. Petunjuk, label rak, atau judul yang menyesatkan atau bertentangan dengan jawaban.

## Angka
| kelompok | temuan | diperbaiki | ditolak (tidak terbukti) |
|---|---|---|---|
| MAT PAUD–TK B | 28 | 21 | 7 |
| MAT SD1–SD2 | 38 | 38 | 0 |
| MAT SD3–SD4 | 24 | 21 | 3 |
| MAT SD5–SD6 | 38 | 36 | 2 |
| SAINS PAUD–TK B | 34 | 28 | 5 |
| SAINS SD1–SD3 | 49 | 47 | 2 |
| SAINS SD4–SD5 | 34 | 32 | 2 |
| SAINS + KODE SD6 | 23 | 21 | 2 |
| KODE PAUD–SD2 | 25 | 20 | 5 |
| KODE SD3–SD5 | 33 | 31 | 2 |
| **Jumlah** | **326** | **295** | **30** |

Satu temuan dicatat sebagai pengembangan karena butuh fitur mesin, yaitu pengecoh jajanan di mode dagang `ambil` (sains-bekal-sehat-pasar). Butir yang tadinya "keputusan owner" diputuskan dan dikerjakan langsung.

Totalnya 263 berkas paket dan 5 berkas kurikulum berubah. Versi patch setiap paket dinaikkan.

## Contoh perbaikan
- **Contoh owner:** "Dina mencium bunga dengan hidung. Tunjuk hidungnya!" Soal sejenis juga diperbaiki: "menghirup wangi bunga" yang jawabannya paru-paru diganti "menghirup udara segar".
- **Perintah yang hilang:** instruksi yang hanya bertanya ("Batu mana yang diinjaknya?") kini menyebut tindakannya, misalnya "Sentuh …" atau "Taruh … di rak …". Instruksi yang bertentangan dengan mekanik juga diganti: "sejajarkan lalu baca ujungnya" padahal benda tidak bisa digeser, "sebutkan" padahal anak menyentuh angka, "pilih" padahal anak menyeret kartu.
- **Ronde merujuk ronde lain:** kalimat seperti "Uji es tadi", "astronaut itu", dan "Rantai yang sama" tidak berlaku karena urutan ronde diacak. Kini setiap soal berdiri sendiri.
- **Dua jawaban benar:**
  - pepaya untuk burung, padahal kelinci juga makan pepaya;
  - toples kaca di rak tembus pandang, padahal juga kedap air;
  - "kelompok berisi 5" yang membuat pengecoh 18 ikut benar;
  - putaran terakhir tukar-tetangga yang bisa dihitung atau tidak;
  - ulangi "…, lalu …" yang bisa terbaca di dalam atau sesudah ulangi;
  - pasangan langkah urutan yang bisa ditukar.
- **Pilihan kembar makna:** 1/3 dan 2/6, 2/5 dan 4/10, serta 1/6 dan 2/12 muncul dalam satu soal. Satu pilihan di tiap pasangan diganti.
- **Asumsi tersembunyi:** "Lantai 0 adalah lobi", "Hari pertamanya Senin", dan posisi pendengar bunyi kini memakai "beberapa langkah dari X", bukan denah kota.
- **Isi dan judul:** paket kotak tersembunyi SD3 dinaikkan ke ratusan. Kegiatan cuaca kini menyebut cuacanya, dan kartu magnet TK A menyebut hasil percobaannya. "pemborong" diganti "pembeli yang mau membeli banyak sekali". Untuk game, "tokoh" diganti "karakter".

## Bug kode yang ditemukan dan diperbaiki
- **Teks label tidak tampil di kartu bergambar** (`benda.tsx`, mode pilah, pilih, dan urutkan). Kartu ber-emoji atau berbentuk hanya menampilkan gambarnya, jadi kartu seperti "senter: tombol digeser ke OFF" tampil sebagai 🔦 saja, dan kartu bernomor tampak kembar.
  - Kini label ditulis di bawah gambar, dan kartu dibuat lebih lebar bila labelnya panjang.
  - Pengecualian: mode pilih di PAUD–TK tetap tanpa tulisan, karena kata di kartu bisa membocorkan jawaban soal "tunjuk X".
  - Label juga tidak ditampilkan di kartu kecil di dalam rak, kartu hitung, dan slot urutan.
- **Larik perkalian digambar sebagai kisi persegi**, jadi 3 × 5 tampil 4 kolom. Field visual baru `kolom` membuat "a baris, tiap baris b" tampil benar (sd2-mat-larik-nampan-kue, sd2-mat-larik-kebun).
- **Mesin dagang:**
  - Mode hitung dan subitasi kini membaca knob `itemsMax`. Sebelumnya hitungan PAUD selalu 1–5 dan subitasi selalu 1–3.
  - Mode bayar kini menghormati knob `pecahan` (jenis uang di laci).
- **Potong tengah tidak dipakai untuk rantai makanan dan siklus air**, karena memotong mata rantai di tengah membuat rantai yang salah, misalnya "padi → ular → elang". Rantai makanan tetap dipotong dari ujung dengan judul yang jujur ("Siapa Dimakan Siapa?"). Siklus air memakai bawaan 5 tahap.

## Pemeriksaan otomatis baru (`akademi:audit`)
- `instruksi-tanpa-perintah` (WARNING): instruksi wajib memuat kata kerja perintah, misalnya sentuh, taruh, susun, pilah, hitung, atau bayar. Saat pertama dijalankan ada 27 instruksi, kini 0.
- `pilihan-kembar-makna` (WARNING): dua pilihan soal yang nilainya sama walau tulisannya beda (pecahan, desimal, persen). Saat pertama dijalankan ada 4 soal, kini 0.

## Suara
**532 kalimat `locale.id` di 237 paket** perlu direkam ulang. Daftarnya ada di [`audit-ambigu-2026-11-21-suara.md`](audit-ambigu-2026-11-21-suara.md). Sampai direkam ulang, kalimat itu dibacakan suara perangkat.

## Status
- `akademi:validate`: 810 paket valid.
- `akademi:index`: diperbarui.
- `akademi:audit`: **0 ERROR, 0 WARNING**.
- vitest: 244/244 lolos.
- tsc: bersih.
- Dicek di peramban: label kartu bergambar (SD4 rangkaian), larik 3 × 5, dan mode pilih PAUD tanpa tulisan.
