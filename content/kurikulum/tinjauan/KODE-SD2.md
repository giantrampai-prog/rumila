# Tinjauan KODE-SD2.json — 2026-10-25
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge). Konteks usia SD 2 = 7–8 tahun, sudah membaca kalimat pendek.
Validator: bersih untuk berkas ini (0 error; 8 peringatan "tidak ada kode acuan kerangka internasional").

Acuan: Cambridge Primary Computing (0059) Stage 2, hanya sebagai referensi. Kode terverifikasi yang tersedia: `2CT.06` (dipakai di PROGRAM.01 dan ALGORITMA.01, cocok makna), `2P.02` (tidak dipakai: tidak ada mekanik yang menyodorkan algoritma untuk disalin menjadi program). Delapan refs kosong dijelaskan di `catatan`.

Prasyarat: hanya ke KODE SD 1 dan SD 2.

## Putaran 1 (draf)

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| PROGRAM.01 | 15 (K8 1) | LULUS | 20 peta 5×5, jalur terpendek 9–12 dihitung BFS; rak = terpendek + 2 sehingga tidak memaksa ulangi. |
| EFISIEN.01 | 15 (K5 1) | LULUS | Tiap peta punya dua arah berangkat (lurus dulu vs belok dulu) yang panjangnya beda ≥ 2; rak = jalan terpendek. Pengaya. |
| ULANGI.01 | 14 (K6 1) | REVISI | Inti tetapi berprasyarat SD1.POLA.01 yang pengaya; anak yang melewati pengaya terkunci dari inti. |
| KONDISI.01 | 16 | LULUS | Jalur L, tiga peta per kelompok dengan jumlah batu per bagian sama (angka ulangan bermakna). Semua program ≤ 5 blok dicoba: yang lolos selalu memakai kalau dan ulangi. |
| DEBUG.01 | 16 | LULUS | Tiga kesalahan di awal/tengah/akhir; generator memastikan tidak ada perbaikan dengan 1 atau 2 perubahan (anak yang benar tidak ditolak karena "ubah tepat 3"). |
| ALGORITMA.01 | 15 (K8 1) | LULUS | Kartu bertulisan 6–7 langkah. Diperiksa per urutan: tidak ada dua kartu yang wajar bertukar. |
| POLA.01 | 15 (K5 1) | LULUS | Mode perbaiki pada keping perintah. Pengaya. |
| DATA.01 | 15 (K5 1) | LULUS | Carroll 2×2 roda × mesin; tiap kotak ≥ 3 kendaraan, tanpa kendaraan abu-abu (pesawat, helikopter dihindari). |
| PERANGKAT.01 | 14 (K4 1) | REVISI | "kamera" ambigu: kamera biasa juga menyimpan foto, bertabrakan dengan kotak "menyimpan" di SD 3. |
| DEKOMPOSISI.01 | 15 (K5 1) | LULUS | Empat tahap rancang/buat/uji/perbaiki; langkah ambigu dihindari. Pengaya; menyentuh topik "proyek game mini" tanpa mengklaim membuat game. |

## Perbaikan yang sudah dikerjakan (putaran 2)

- ULANGI.01: prasyarat SD1.POLA.01 dilepas; tinggal SD1.ULANGI.01. → LULUS (16).
- PERANGKAT.01: "kamera" diganti "kamera laptop" (masukan murni). → LULUS (15).

**Hasil akhir: 10 LULUS.**

## Catatan urutan & prasyarat

- PROGRAM.01 ← SD1.PREDIKSI.01 (menelusuri program sebelum menyusun program panjang); EFISIEN.01 ← PROGRAM.01.
- ULANGI.01 ← SD1.ULANGI.01; KONDISI.01 ← SD1.KONDISI.01 + SD1.ULANGI.01; DEBUG.01 ← SD1.DEBUG.01.
- ALGORITMA.01 ← SD1.ALGORITMA.02; DATA.01 ← SD1.DATA.01; PERANGKAT.01 ← SD1.PERANGKAT.01 (lemah, hanya serumpun); DEKOMPOSISI.01 ← SD1.ALGORITMA.01.

## Untuk diputuskan PO

1. **Koordinat (x, y)** dan **pencarian & pengurutan** (topik SD 2) belum punya mekanik: grid navigasi tidak berlabel koordinat, dan urutkan tidak membatasi cara menukar (tidak bisa membuktikan algoritma pengurutan). Tidak ditulis.
2. **Pseudocode** hanya terwakili sebagai menyusun kartu langkah bertulisan (ALGORITMA.01); menulis langkah sendiri butuh mekanik `ucap`/ketik.
3. `2P.02` (algoritma → program) akan cocok bila navigasi bisa menampilkan rute bergambar panah yang harus diterjemahkan ke blok.
