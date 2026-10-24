# Kids Academy — Nasib Menu Rumila yang Sudah Ada

Status: usulan, 24 Okt 2026. Acuan: `src/lib/catalog.ts`, `src/lib/education.ts`.

Tiga nasib: **ISI** (jadi aktivitas/konten akademi), **DUNIA** (jadi scene pack tempat quest berjalan), **KELUAR** (bukan bagian Kids Academy; hidup sebagai aplikasi terpisah atau dipensiunkan).

## Coding Agam → ISI, pelajaran Coding (reuse tertinggi)

| Menu lama | Mekanik | Level | Catatan |
|---|---|---|---|
| Pola | Pola & ritme | PAUD–TK A | 10 level × 10 jadi knob kesulitan, bukan level manual |
| Langkah | Navigasi | TK A | Agam ke bintang sudah persis mekanik Navigasi |
| Ulangi | Navigasi + Urutkan | TK B | perulangan |
| Kalau… | Navigasi | TK B–SD 1 | kondisi |
| Jurus | Navigasi + Bangun | SD 1 | fungsi |
| Detektif Bug (rencana) | Urutkan | TK B–SD 2 | debugging, konten baru |
| Studio Animasi (rencana) | Bangun | SD 1–SD 2 | event & animasi, konten baru |

Progres lama di `game_save` diimpor sekali sebagai evidence awal supaya anak tidak mulai dari nol.

## Petualangan 3D → DUNIA, pelajaran Sains (dan lintas pelajaran)

| Menu lama | Jadi dunia | Quest pertama | Pelajaran |
|---|---|---|---|
| Jelajah Angkasa | Angkasa | Pilot Orbit | SA SD 1, SD 4 |
| Roket & Astronot | Landasan Roket | Bengkel Roket, Tangki Bahan Bakar | SA SD 1, MA SD 1 (pecahan) |
| Jelajah Tubuh | Klinik | Dokter Kecil | SA TK B, SD 2 |
| Kebun Buah | Kebun & Pasar | Pasar Buah, Petani Pola | MA PAUD–SD 1, SA PAUD |
| Bawah Laut | Laut | Katalog Ekspedisi, Rantai Makanan | SA TK A–SD 2 |
| Dalam Bumi | Tambang | Penambang Kristal | SA SD 2, SD 4 |

Eksplorasi bebas yang sekarang ada tetap dipertahankan sebagai mekanik **Cari & kumpulkan**. Yang ditambahkan adalah quest dan pencatatan evidence.

## Game → campuran

| Menu lama | Nasib | Mekanik / pelajaran |
|---|---|---|
| Rinoya Resto | ISI | Dagang + Simulasi; MA SD 1–SD 3 (uang, porsi, laba rugi) |
| Ular Tangga | ISI ringan | tab Teman di portal murid; opsional catat MA PAUD–TK (menghitung dadu, bilangan 1–100) |
| Puzzle Gambar (rencana) | ISI | Bangun; SA/DU (gambar hewan, tempat) |
| Tebak Kata (rencana) | ISI | Ucap & dengar; BI, EN |
| Kartu Memori (rencana) | ISI | Cari & kumpulkan; kosakata BI/EN/SA |
| Labirin (rencana) | ISI | Navigasi; KO, MA (arah, koordinat) |
| Warnai Gambar (rencana) | ISI | Telusur; SE |
| Balap Hitung (rencana) | diubah | ini "soal berkedok game"; ganti jadi Dagang/Simulasi, atau simpan sebagai mode latihan opsional di luar jalur sertifikat |
| Catur | KELUAR | bukan kurikulum; bisa dipertimbangkan ulang sebagai logika di tab Teman |

## Doa Harian & Ibadah → sebagian ISI, sebagian KELUAR

| Menu lama | Nasib | Mekanik / pelajaran |
|---|---|---|
| Doa Harian (10 doa) | ISI | Cerita bercabang "Hari Agam" + Ucap & dengar; KA PAUD–TK B. 10 doa yang ada = paket konten pertama |
| Hafalan Surat | ISI | Ucap & dengar; KA TK B–SD 6 (Al-Fatihah sampai juz 30) |
| Asmaul Husna | ISI | Pola & ritme / Cari & kumpulkan; KA SD 2–SD 4 |
| Al-Qur'an, Arah Kiblat, Tasbih Digital | KELUAR | alat ibadah, bukan kurikulum akademi |

## Edukasi (19 kategori) → dilebur ke pelajaran

Kategori ini sebagian besar masih `planned`, dan daftar topiknya sudah hampir sama dengan `kurikulum.md`. Tidak ada yang dibuang, hanya dipindah rumahnya:

| Kategori lama | Pelajaran |
|---|---|
| Profesi, Kendaraan, Bendera & Negara, Provinsi Indonesia, Benda & Tempat Sekitar, Budaya Indonesia | DU |
| Buah-buahan, Hewan, Sayuran & Tumbuhan, Tubuh Manusia, Alam & Cuaca | SA |
| Huruf & Membaca | BI |
| Angka & Berhitung, Warna & Bentuk, Waktu & Kalender | MA |
| Bahasa Inggris | EN |
| Musik & Alat Musik, Seni & Menggambar | SE |
| Emosi & Kebiasaan Baik | KA |

Folder "Edukasi" sebagai menu hilang; isinya muncul sebagai topik di peta jenjang.

## Keluarga & Kesehatan → KELUAR

Kalender, tugas rumah, galeri, daftar belanja, tumbuh kembang, minum air, jam tidur, dan tabel keuangan `fin_*` bukan bagian Kids Academy. Bila masih diinginkan, jadi aplikasi terpisah dengan akun yang sama.

## Dampak ke tampilan

- **Murid** masuk ke portal murid: Hari ini, Pelajaran, Dunia, Koleksi, Teman.
- **Wali** masuk ke portal wali: Rapor, Sertifikat, Rencana belajar, Waktu layar, Privasi & Instagram, Langganan, Pengaturan.
- Lihat `struktur-launcher.md`.

## Urutan migrasi

1. Coding Agam dipasang `catatBukti` → evidence pertama mengalir tanpa mengubah tampilan game.
2. Kebun Buah ditambah quest Pasar Buah (mekanik Dagang pertama).
3. Doa Harian dibungkus jadi "Hari Agam".
4. Dunia 3D lain menyusul satu per satu, masing-masing satu quest dulu.
5. Folder Edukasi diganti Peta Jenjang.
