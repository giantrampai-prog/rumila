# Tinjauan MAT-SD3.json — 2026-10-25
Persona: guru kelas 3–4 SD (sekolah berkurikulum internasional; acuan Cambridge Primary Stage 3). Konteks usia SD 3 = 8–9 tahun. Lintasan tinjauan terpisah atas draf penulis, membaca statement dan isi paket.
Validator (seluruh repo, 25 Okt 2026): 0 error; tidak ada peringatan untuk MAT.SD3. Kode Stage 3 berasal dari berkas baru `content/kerangka/cambridge-primary-maths-mat-sd1-3.json` (53 butir, `verified: true`, teks dibaca dari PDF framework 0096 v1.1 hlm. 21–23).

```
✓ content/kurikulum/MAT-SD3.json: 20 kompetensi
382 kompetensi, 0 error, 78 peringatan   (peringatan milik berkas lain)
```

Rubrik sama dengan tinjauan TK B (maks 16).

| id | skor draf | putusan | catatan singkat |
|---|---|---|---|
| BILANGAN-1000.01 | 16 | LULUS | Rak 345/354/305/350 berdekatan; kartu regrouping 200+145. |
| BILANGAN-1000.02 | 16 | LULUS | Urutan dari angka yang sama (409, 490, 904, 940). |
| BILANGAN-1000.03 | 12 (K4 1, K2 1, K6 2→1) | REVISI → diterapkan | 3Nc.05 meminta *menyebut* aturan suku-ke-suku; draf hanya melanjutkan barisan (dan urutan maju bisa disortir). Ditambah paket pilah "tebak aturannya" (27,31,35 → +4). Satu urutan draf melewati 1.000 (loncat 20 dari 960) → diganti. |
| BILANGAN-1000.04 | 15 (K2 1) | LULUS | Dua kemampuan (puluhan dan ratusan), satu kode 3Np.05, dua paket terpisah. |
| TAMBAH-KURANG-1000.01 | 15 (K8 1) | LULUS | Kartu "65→100" ditulis dengan panah; perlu dicek anak paham notasinya (diterangkan di instruksi). |
| TAMBAH-KURANG-1000.02 | 14 (K3 1, K8 1) | LULUS | Diperiksa otomatis tepat satu kali menyimpan/meminjam. Kartu 7 karakter (106+346) tampil kecil (~16 px); perlu uji keterbacaan. |
| TAMBAH-KURANG-1000.03 | 16 | LULUS | Kotak di depan, tengah, belakang. |
| KALI-BAGI.01 | 15 (K2 1) | LULUS | Lima tabel dalam satu kompetensi; dua paket (3 & 4; 6, 8, 9). Tabel 7 belum (Stage 4). |
| KALI-BAGI.02 | 16 | LULUS | Jebakan jumlah nol (30/300, 40/400). |
| KALI-BAGI.03 | 15 (K4 1) | LULUS | Tanpa sisa; satu rak berisi pembagi berbeda. |
| PECAHAN.01 | 14 (K8 1, K4 1) | LULUS | Hanya 10 kartu (perlima punya satu padanan persepuluh); ragam ronde cukup lewat subset acak. |
| PECAHAN.02 | 16 | LULUS | Dua jenis urutan; judul menyebut jenisnya. |
| UANG.01 | 15 (K8 1) | LULUS | 3Nm.01 (desimal mata uang) sengaja tidak dipakai: rupiah tanpa desimal. |
| WAKTU.01 | 13 (K4 1, K5 1, K8 1) | REVISI → diterapkan | Catatan draf bilang pagi dan siang tidak dicampur, padahal jadwal siang memuat 12.xx lalu 01.xx. Catatan diluruskan (itu justru inti 12 jam). Tetap pengaya: mengurutkan jam belum sama dengan membaca jadwal. |
| GEOMETRI.01 | 16 | LULUS | Belah ketupat dan persegi panjang sebagai jebakan beraturan. |
| GEOMETRI.02 | 15 (K4 1) | LULUS | Sudut jarum jam tepat (pukul 3 = siku, 6 = lurus). Bentuk jam emoji berbeda antar-perangkat, tetapi sudut jarum tetap. |
| GEOMETRI.03 | 16 | LULUS (pengaya) | Huruf K dan B mendatar tergantung huruf; dipakai huruf kapital tegak. |
| UKUR.01 | 13 (K4 1, K8 1, K1 1) | REVISI → diterapkan | "Sesendok obat" bergambar pil → diganti tabung kecil. Benda yang satuannya bisa ganda (kolam renang: m atau l) sengaja tidak dipakai. |
| UKUR.02 | 15 (K4 1) | LULUS | Luas dan keliling dari larik petak yang sama; keliling dihitung dari sisi luar. |
| DATA.01 | 15 (K7 1) | REVISI → diterapkan | Label rak "bukan kelipatan 5, genap" terpotong → "bukan · genap" + emoji, istilah dijelaskan di instruksi. |

**Hasil: 15 LULUS, 5 REVISI (semua diterapkan).**

## Catatan urutan & prasyarat
- Semua prasyarat menunjuk MAT.SD2.* atau MAT.SD3.*; tidak ada siklus.
- Rantai: SD2 nilai tempat → BILANGAN-1000.01 → .02/.04; SD2 pasangan 100 → TAMBAH-KURANG-1000.01 → UANG.01 (kembalian).
- Tidak menyentuh SD 4 (tabel 7, desimal, luas dengan rumus).

## Untuk diputuskan PO
1. **Daftar topik SD 3 di kurikulum.md** (bilangan besar dan desimal, perkalian multi-digit, persen, rata-rata) jauh di atas Stage 3. Draf mengikuti Stage 3; topik itu sebaiknya ke SD 4–6. Perlu disamakan dengan agen MAT SD4–6.
2. **Peluang (3Sp.01–02), interval waktu (3Gt.04), kapasitas ml/l dengan alat ukur (3Gg.11)** belum ada kompetensinya karena mekanik yang ada tidak bisa membuktikannya tanpa kuis.
3. **Kartu teks panjang** (7 karakter) di rak hasil tiga angka perlu uji keterbacaan pada ponsel; bila terlalu kecil, presenter pilah perlu ukuran kartu untuk teks.
