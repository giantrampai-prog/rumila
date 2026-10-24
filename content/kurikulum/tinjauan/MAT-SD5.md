# Tinjauan MAT-SD5.json — 2026-10-25
Persona: guru matematika SD kelas tinggi (12 tahun mengajar kelas 4–6; acuan Cambridge Primary Stage 5). Konteks usia SD 5 = 10–11 tahun.
Tinjauan diri terpisah dari penulisan; temuan langsung diperbaiki lalu validator dijalankan ulang.

Validator setelah revisi:

```
✓ content/kurikulum/MAT-SD5.json: 20 kompetensi
0 error, 0 peringatan untuk MAT.SD5.* dan 37 paket sd5-mat-*
```

Kamus acuan: `cambridge-primary-maths-mat-sd4-6.json` (51 kode Stage 5, `verified: true`, PDF 0096 hlm. 27–29). Prasyarat menunjuk ke SD4 dan SD5 saja.

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| DESIMAL.01 | 15 (K4 1) | LULUS | Nilai angka desimal dan menyusun 4 + 0,6 + 0,05. |
| DESIMAL.02 | 15 (K6 1) | LULUS | Prasyarat PECAHAN.02 bernomor lebih belakang; urutan di peta pelajaran harus mengikuti graf prasyarat, bukan nomor. |
| DESIMAL.03 | 16 | LULUS | Pembulatan ke bilangan bulat; paket kedua dalam kg. |
| DESIMAL.04 | 15 (K4 1) | LULUS | Geser nilai tempat + konversi satuan. |
| UANG.01 | 13 (K5 1, K6 1, K8 1) → 14 | LULUS (pengaya) | Ref 5Ni.01 hanya mirip (bilangan bulat, bukan uang). Tetap pengaya agar ada konteks uang dan aksi `dagang` di SD5. |
| BULAT.01 | 16 | LULUS | Melewati nol, konteks suhu/lift/kapal selam. |
| OPERASI.01 | 14 (K4 1, K8 1) → 15 | REVISI → LULUS | Paket kedua (generator) memuat soal yang hasil kiri-ke-kanan sama dengan hasil benar (17 × 6 − 2), jadi tidak menguji urutan; dan satu soal dengan langkah antara negatif (2 − 3 + …). Generator kini menolak keduanya. |
| OPERASI.02 | 15 (K2 1) | LULUS | Kali 2 angka dan bagi 1 angka dalam satu kompetensi. |
| FAKTOR.01 | 16 | LULUS | Prima/komposit; paket kedua semua ganjil 51–99. |
| FAKTOR.02 | 16 | LULUS | 1 dan 36 dibuang supaya rak saling lepas. |
| FAKTOR.03 | 15 (K6 1) | LULUS (pengaya) | Uji 4 dan 8. |
| PECAHAN.01 | 16 | LULUS | Pecahan campuran memakai glif ½ ¼ ⅔ ¾ ⅕ supaya kartu pendek. |
| PECAHAN.02 | 16 | LULUS | Pecahan–desimal–persen; pengecoh 4/5 vs 0,4. |
| PECAHAN.03 | 13 (K4 1, K8 1, K7 1) → 15 | REVISI → LULUS | Generator paket kedua menghasilkan "2/5 − 1/5 = 2/10" dan "1/2 + 1/4 = 6/8" karena pecahan soal tersederhanakan otomatis. Diperbaiki: pembilang dan penyebut soal harus relatif prima; soal kembar (a + b vs b + a) ditolak. |
| WAKTU.01 | 14 (K7 1, K8 1) → 15 | REVISI → LULUS | Pengecoh "0 jam 70 menit" janggal; kini "70 menit". Pengecoh desimal (11.20 − 9.45 = 1.75) dipertahankan karena itu salah paham utama. |
| GEOMETRI.01 | 16 | LULUS | Sisi atau sudut; segitiga dicek ketaksamaan segitiga. |
| GEOMETRI.02 | 16 | LULUS | Satu atau dua sudut diketahui. |
| GEOMETRI.03 | 13 (K4 1, K3 1, K8 1) → 14 | REVISI → LULUS (pengaya) | "Persegi panjang 4 × 4" menyebut persegi sebagai persegi panjang; diganti "Bangun 4 × 4 dan 8 × 2 (cm)". Bukti terbaik butuh mekanik `bangun`. |
| DATA.01 | 15 (K8 1) | LULUS | Data dibuat supaya modus ≠ median dan nilai tengah sebelum diurutkan ≠ median. |
| PELUANG.01 | 14 (K4 1, K8 1) | LULUS | Beberapa soal hanya 3 pilihan (lebih mudah ditebak). Ditahan karena "sama besar" adalah konsep intinya. |

**Hasil: 15 LULUS, 5 REVISI (sudah diperbaiki).**

## Catatan untuk PO
- **Dua konteks**: semua 17 kompetensi inti punya dua paket (lihat tinjauan SD4 soal `minContexts`). Pengaya (UANG.01, FAKTOR.03, GEOMETRI.03) satu paket.
- **Bentuk jawaban pecahan**: di SD5 jawaban penjumlahan pecahan ditulis dengan penyebut yang lebih besar (5/10, bukan 1/2) supaya tidak ada dua pilihan yang sama-sama benar; di SD6 jawaban selalu bentuk paling sederhana. Perlu diputuskan apakah anak SD5 juga dituntut menyederhanakan.
- **Celah**: volume balok/kubus, skala peta, dan kecepatan–jarak–waktu (ada di kurikulum.md SD 5) tidak dibuat: volume tidak ada di Stage 5; skala peta masuk SD6 RASIO.01; kecepatan tidak ada di Stage 5–6. Belum ada juga: koordinat dan translasi (5Gp.01–04), jaring kubus (5Gg.05), simetri pola (5Gg.06), grafik garis (5Ss.02), mengalikan desimal (5Nf.10), rasio dan proporsi (5Nf.11).
