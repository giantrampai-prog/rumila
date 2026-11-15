# Audit Konten Academy — 15 November 2026

Dijalankan dengan `npm run akademi:audit` (skrip `scripts/akademi-audit.ts`). Penjaga cepat di `src/lib/akademi/__tests__/katalog.test.ts`.

## Cakupan
- 402 kompetensi (27 berkas kurikulum), 577 paket permainan, **230.800 ronde** dibuat dan diperiksa (400 per paket).
- Setiap ronde: bisa dibuat tanpa error; jawaban kunci disusun lalu dinilai mesin harus **benar**; pilihan tidak tampak kembar; jawaban ada di pilihan / di rentang strip; stok cukup; peta robot terpecahkan dalam batas keping rak (pemecah memperhitungkan blok ulangi & mode bendera).
- Setiap sesi 10 ronde: soal tidak berulang.
- Kurikulum: id & pernyataan kompetensi unik, prasyarat valid, nama modul tidak kembar, setiap kompetensi punya permainan, setiap modul bisa disusun Ulangan Modulnya.
- Paket: id & judul (ID/EN) unik, item tidak kembar, dua item yang tampak sama tidak boleh berjawaban beda, paket dengan tugas + tingkat + isi sama dianggap dobel.

## Temuan & perbaikan
| Temuan | Jumlah | Perbaikan |
|---|---|---|
| Kompetensi tanpa permainan (8 di antaranya **inti**: PAUD, TK A, TK B tidak bisa lulus) | 11 | 11 paket Sains baru; 3 pernyataan kompetensi yang menyebut dunia 3D diumumkan |
| Judul paket kembar antarjenjang | 17 | Judul ID/EN paket jenjang lebih tinggi diganti agar unik |
| Paket dobel (tugas, tingkat, isi identik, beda latar saja) | 6 pasang | Dijadikan berjenjang/berbeda isi: tukar uang (Bank Mini + uang 10 ribu), uang (koin vs uang kertas), bentuk (ukuran beda), jam (1–6 vs 1–12), tombol (2 vs 3 pasang, alat bengkel) |
| Soal tak bisa dijawab / kunci dinilai salah / pilihan kembar / peta tak terpecahkan / soal berulang | 0 | — (temuan awal "peta melebihi slot" dan "label kembar" ternyata salah alarm pemeriksa, sudah diperbaiki di skrip) |

## Paket baru
sains-lengkapi-tubuh-boneka (PAUD) · sains-temukan-makhluk-hidup (PAUD) · sains-beri-makan-makhluk-hidup (PAUD) · sains-cari-hewan-air (TK A) · sains-simbol-cuaca-jendela (TK A) · sains-hasil-percobaan-bak-air (TK A) · sains-hasil-percobaan-magnet (TK A) · sains-rawat-tanaman-berbunga (TK B) · sains-lapisan-laut (TK B) · sains-putar-bumi-siang (TK B) · sains-intip-tembus-pandang (TK B)

## Sisa (bukan dobel/bug, catatan pengembangan)
- **228 kompetensi hanya punya 1 permainan** → Ulangan Modul memakai permainan yang sama dengan latihan (soal tetap acak & tidak berulang). Per jenjang: KODE PAUD 3, KODE SD1 9, KODE SD2 10, KODE SD3 10, KODE SD4 11, KODE SD5 11, KODE SD6 13, KODE TKA 2, KODE TKB 4, MAT PAUD 3, MAT SD1 12, MAT SD2 18, MAT SD3 16, MAT SD4 2, MAT SD5 3, MAT SD6 1, MAT TKA 4, MAT TKB 5, SAINS PAUD 8, SAINS SD1 2, SAINS SD2 3, SAINS SD3 3, SAINS SD4 16, SAINS SD5 16, SAINS SD6 16, SAINS TKA 13, SAINS TKB 14.
- **16 kelompok instruksi sama** pada paket varian dengan isi berbeda (mis. dua lembar latihan perkalian) — wajar.
- **Suara**: 45 kalimat baru (11 paket baru + instruksi Celengan) belum direkam Aoede; sementara dibacakan suara perangkat.
