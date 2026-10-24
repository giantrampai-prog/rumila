# Tinjauan MAT-SD6.json — 2026-10-25
Persona: guru matematika SD kelas tinggi (12 tahun mengajar kelas 4–6, pembina olimpiade tingkat kota; acuan Cambridge Primary Stage 6). Konteks usia SD 6 = 11–12 tahun.
Tinjauan diri terpisah dari penulisan; temuan langsung diperbaiki lalu validator dijalankan ulang.

Validator setelah revisi:

```
✓ content/kurikulum/MAT-SD6.json: 20 kompetensi
0 error, 0 peringatan untuk MAT.SD6.* dan 39 paket sd6-mat-*
```

Kamus acuan: `cambridge-primary-maths-mat-sd4-6.json` (54 kode Stage 6, `verified: true`, PDF 0096 hlm. 30–32).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| BULAT.01 | 14 (K4 1, K8 1) → 15 | REVISI → LULUS | Generator paket kedua menghasilkan soal tanpa bilangan negatif (9 + 29); kini minimal satu bilangan negatif. |
| DESIMAL.01 | 16 | LULUS | Deret rapat campuran; satu deret desimal negatif. |
| DESIMAL.02 | 16 | LULUS | Pembulatan ke persepuluhan; 7,95 → 8,0 melewati bilangan bulat. |
| OPERASI.01 | 14 (K8 1, K4 1) → 15 | REVISI → LULUS | Pola "(… ) : 1" tidak bermakna, dibuang. Pengecoh = hasil bila kurung diabaikan. |
| OPERASI.02 | 15 (K2 1) | LULUS | Perkiraan dan hitung tepat. Pilihan perkiraan terpaut ×10 supaya membulatkan cukup. |
| FAKTOR.01 | 13 (K4 1, K8 1, K3 1) → 15 | REVISI → LULUS | Paket kedua: 5 dari 12 soal ber-FPB 2 (terlalu mudah), KPK sampai 182 (beban hitung, bukan konsep), pasangan kembar (12, 20) dan (20, 12). Kini FPB ≥ 3, KPK ≤ 120, pasangan unik. |
| FAKTOR.02 | 16 | LULUS | Uji 3 dan 9; uji 6 belum punya paket (catatan). |
| FAKTOR.03 | 15 (K6 1) | LULUS (pengaya) | Kubik vs kuadrat. |
| PECAHAN.01 | 16 | LULUS | Sederhanakan dengan FPB. |
| PECAHAN.02 | 13 (K7 1, K8 1, K4 1) → 15 | REVISI → LULUS | Generator paket kedua menghasilkan "1/2 + 1/2" (penyebut sama) dan soal kembar a + b / b + a. Diperbaiki seperti SD5 PECAHAN.03. |
| PECAHAN.03 | 15 (K8 1) | LULUS | Diskon vs harga bayar dibedakan. |
| PECAHAN.04 | 16 | LULUS | Lima rak; 0,05 vs 0,5. |
| RASIO.01 | 15 (K7 1) | LULUS | Generator paket kedua sempat menulis "1000 km" tanpa titik ribuan; kini memakai format ribuan Indonesia. |
| ALJABAR.01 | 16 | LULUS | Hanya + dan − sesuai 6Nc.02. |
| POLA.01 | 16 | LULUS | Linear dan kuadrat ± c. |
| GEOMETRI.01 | 14 (K5 1, K8 1) | LULUS | Lihat keputusan definisi di bawah. "Semua trapesium: minimal sepasang sisi sejajar" diubah ke "tepat sepasang" agar konsisten dengan definisi eksklusif yang dipakai di paket pertama. |
| GEOMETRI.02 | 16 | LULUS | Termasuk siku-siku dan sama kaki. |
| KOORDINAT.01 | 16 | LULUS | Pasangan terbalik (−3, 4) vs (4, −3); koordinat pecahan. |
| DATA.01 | 16 | LULUS | Mean bulat; pengecoh jumlah, median, maksimum. |
| PELUANG.01 | 15 (K4 1) | LULUS | Pecahan peluang tidak disederhanakan; dua soal saling lepas. |

**Hasil: 14 LULUS, 6 REVISI (sudah diperbaiki).** Semua 19 kompetensi inti punya dua paket; pengaya FAKTOR.03 satu paket.

## Keputusan untuk PO
1. **Definisi segi empat**: Cambridge dan banyak buku internasional memakai klasifikasi inklusif (persegi juga persegi panjang dan belah ketupat; trapesium "minimal" sepasang sisi sejajar). Buku SD Indonesia umumnya eksklusif ("tepat sepasang"). Paket ditulis eksklusif dan menghindari soal hierarki. Bila ingin inklusif, GEOMETRI.01 perlu kompetensi baru "hubungan antar segi empat".
2. **Peluang sebagai pecahan**: jawaban 3/6 tidak disederhanakan supaya terlihat "hasil yang diinginkan / semua hasil". Bila ingin bentuk sederhana, ganti label jawaban; logika tidak berubah.
3. **Celah** dibanding kurikulum.md SD 6: luas lingkaran dan volume tabung tidak ada di Cambridge Stage 6 (yang ada: bagian lingkaran 6Gg.02, kapasitas vs volume 6Gg.05), jadi tidak dibuat. Belum ada paket untuk: luas segitiga siku-siku (6Gg.03; sempat direncanakan, dicoret supaya 20 kompetensi), transformasi (6Gp.03–05), jaring-jaring (6Gg.06), simetri putar (6Gg.08), mengalikan/membagi desimal (6Nf.10–11), uji bagi 6. "Soal cerita tingkat olimpiade dasar" sengaja tidak dijadikan kompetensi karena bukan satu kemampuan yang bisa diamati.
