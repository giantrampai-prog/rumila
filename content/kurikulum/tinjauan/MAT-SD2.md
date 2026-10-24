# Tinjauan MAT-SD2.json — 2026-10-25
Persona: guru kelas 2–3 SD (sekolah berkurikulum internasional; acuan Cambridge Primary Stage 2). Konteks usia SD 2 = 7–8 tahun. Lintasan tinjauan terpisah atas draf penulis, membaca statement dan isi paket.
Validator (seluruh repo, 25 Okt 2026): 0 error; tidak ada peringatan untuk MAT.SD2.

```
✓ content/kurikulum/MAT-SD2.json: 21 kompetensi
382 kompetensi, 0 error, 78 peringatan   (peringatan milik berkas lain)
```

Rubrik sama dengan tinjauan TK B (maks 16).

| id | skor draf | putusan | catatan singkat |
|---|---|---|---|
| BILANGAN-100.01 | 16 | LULUS | Rak berpasangan 47/74 dan kartu regrouping 30+17 — bukti nilai tempat yang kuat. |
| BILANGAN-100.02 | 15 (K8 1) | LULUS | Pasangan angka tertukar di tiap urutan. |
| BILANGAN-100.03 | 13 (K4 1, K6 1) | REVISI → diterapkan | Sama dengan SD 1: urutan maju bisa diselesaikan dengan mengurutkan naik. Ditambah paket pilah "katak loncat 5 dari 3" dengan jebakan kelipatan 5. |
| BILANGAN-100.04 | 16 | LULUS | Aturan 5 ke atas ada di instruksi. |
| TAMBAH-KURANG-100.01 | 15 (K2 1) | LULUS | Dua kemampuan (pasangan 20 dan pasangan puluhan ke 100) dalam satu statement; keduanya satu kode 2Ni.03 sehingga diterima. |
| TAMBAH-KURANG-100.02 | 16 | LULUS | Generator memeriksa otomatis bahwa tidak ada soal menyimpan/meminjam. |
| TAMBAH-KURANG-100.03 | 16 | LULUS | Keluarga fakta sebagai rumah — aksi memilah, bukan kuis. |
| KALI-BAGI.01 | 15 (K4 1) | LULUS | Larik hanya 4, 6, 9, 12, 16, 20 karena presenter menata benda dalam kolom = akar dibulatkan ke atas; 8 dan 10 tidak tampil rapi. Konvensi a × b = a baris tiap baris b ditulis di instruksi. |
| KALI-BAGI.02 | 16 | LULUS | Satu rak menampung beberapa fakta (20 = 2 × 10 = 4 × 5). |
| KALI-BAGI.03 | 15 (K4 1) | LULUS | Pembagian sebagai kartu simbol; "berbagi" fisik belum (mode simulasi `bagi` hanya untuk dua piring dan bertema ikan). |
| PECAHAN.01 | 16 | LULUS | Satu bentuk per nilai di tiap urutan supaya tidak ada dua kartu senilai (urutan tak tunggal). |
| PECAHAN.02 | 16 | LULUS | Seperempat sebagai bagian satu anak dari empat. |
| UANG.01 | 15 (K8 1) | LULUS | Draf memakai emoji botol bayi untuk "botol minum" → diganti kotak jus. |
| UANG.02 | 15 (K8 1) | LULUS | Uang yang dibayar = pecahan terkecil yang melebihi harga (aturan mesin), jadi kadang 20.000 atau 50.000, tidak selalu 100.000; statement disesuaikan ("uang yang dibayarkan"). |
| WAKTU.01 | 14 (K3 1, K4 1) | LULUS | Tanpa jam analog bermenit (presenter jam hanya jam bulat), bukti menit lewat kartu "→4" dan jam digital. Lemah untuk bagian "analogue clocks" 2Gt.02. |
| WAKTU.02 | 15 (K5 1) | LULUS (pengaya) | 2Gt.01 juga meminta membandingkan, tidak hanya mengurutkan. |
| GEOMETRI.01 | 15 (K8 1) | LULUS | Segi lima/enam memakai glyph ⬟ ⬢ — perlu dicek tampil di perangkat uji. |
| GEOMETRI.02 | 15 (K7 1) | REVISI → diterapkan | Label rak "punya garis simetri" terpotong di ponsel → "simetris / tidak simetris". |
| GEOMETRI.03 | 15 (K6 1) | LULUS | Navigasi: kanan = seperempat searah jarum jam. Tanpa prasyarat MAT (prasyarat ada di KODE, track lain). Optimal tiap grid dihitung dengan `optimal()` mesin. |
| UKUR.01 | 14 (K6 1, K8 1) | LULUS | Penggaris kubus presenter berisi 12 kubus → panjang ≤ 11. Knob offset dikunci 1 (selalu tidak mulai dari ujung). |
| DATA.01 | 16 | LULUS | 50 dan 49 sebagai jebakan batas. |

**Hasil: 19 LULUS, 2 REVISI (diterapkan).** Jumlah kompetensi 21, sedikit di atas sasaran 12–20; WAKTU.02 dan GEOMETRI.02 dijadikan pengaya.

## Catatan urutan & prasyarat
- Prasyarat menunjuk MAT.SD1.* dan satu ke MAT.TKB.UKUR-NONSTANDAR.02 (penggaris kubus), semuanya ada. Tidak ada siklus.
- KALI-BAGI.01 bertumpu pada dobel SD 1 (penjumlahan berulang); .02 bertumpu pada loncat 2/5/10 (BILANGAN-100.03).
- Tidak ada menyimpan/meminjam (sesuai 2Ni.04); itu masuk SD 3.

## Untuk diputuskan PO
1. **Daftar topik SD 2 di kurikulum.md** menyebut bilangan sampai 1.000, perkalian 1–10, pecahan setara, keliling, sudut lancip/tumpul — semua itu Stage 3 menurut acuan. Draf mengikuti Stage 2 dan memindahkan topik tersebut ke SD 3. Mohon konfirmasi.
2. **Jam analog bermenit** butuh mode presenter baru (jarum panjang per 5 menit); saat ini hanya kartu.
3. **Glyph segi lima/enam** (⬟ ⬠ ⬢ ⬡ ⬣) bukan emoji berwarna; perlu uji tampilan di Android/iOS lama atau aset gambar.
