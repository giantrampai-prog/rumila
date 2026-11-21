# Perbaikan 04 — MAT SD5 & SD6

Sumber: temuan-04-mat-sd5-6.md. Semua temuan dicek ulang ke JSON aslinya; semuanya terbukti. Hasil validasi: skema `810 paket konten valid`, 0 error. Audit: ERROR 0, WARNING 22 (tidak ada yang menyangkut paket di bawah).

## Diterapkan

| keparahan | paket | apa yang diubah |
|---|---|---|
| SEDANG | sd5-mat-urut-nilai-campur (1.0.0 → 1.0.1) | s5 "Bagian gambar yang diwarnai" → "Panjang lima krayon (cm)" (EN ikut diubah) |
| SEDANG | sd5-mat-urut-nilai-campur | s1, s2 (deret berisi 90%, sebelumnya bersatuan cm) → "Bagian lima roti yang sudah dimakan" / "Bagian lima gelas yang sudah terisi" (EN ikut diubah) |
| SEDANG | sd5-mat-urut-nilai-campur | s3 "Baterai lima ponsel" → "Berat lima kantong beras (kg)". Saya tidak memakai usulan "semangka" karena 0,6 kg tidak masuk akal untuk semangka (EN ikut diubah) |
| SEDANG | sd5-mat-urut-desimal-persen (1.0.0 → 1.0.1) | s8 "Isi lima botol (liter)" → "Bagian lima botol yang sudah terisi" (EN ikut diubah) |
| SEDANG | sd6-mat-urut-desimal-pecahan-persen (1.0.0 → 1.0.1) | s9 "Isi lima gelas (liter)" → "Bagian lima gelas yang sudah terisi" (EN ikut diubah) |
| SEDANG | sd5-mat-kembalian-toko-buku (1.0.0 → 1.0.1) | label barang 🧮 "kalkulator" → "sempoa" / EN "abacus". Id barang tetap `kalkulator` |
| SEDANG | sd6-mat-sudut-segitiga-rangka-atap (1.0.0 → 1.0.1) | Ini temuan `keputusan`, tetapi aman diterapkan sebagian: ditambah 2 soal sama kaki yang menuntut sifat "dua sudut kaki sama besar". r13 "sudut puncak 40°, tiap sudut kaki …" ✓70° (c28), pengecoh 140° (c48 baru), 50° (c27), 40° (c24). r14 "satu sudut kaki 65°, sudut puncak …" ✓50° (c27), pengecoh 115° (c49 baru), 65° (c4), 130° (c25). Dengan tambahan ini instruksi sama kaki menjadi relevan, jadi instruksinya tidak diubah |
| KECIL | sd6-mat-persen-toko-buku (1.0.0 → 1.0.1) | pengecoh c4 Rp100.001 → Rp199.950 (200.000 − 50), c37 Rp14.001 → Rp19.970 (20.000 − 30). EN sepadan |
| KECIL | sd6-mat-sifat-segi-empat (1.0.0 → 1.0.1) | c6 → "sisi berhadapan sama panjang" / EN "opposite sides equal in length" |
| KECIL | sd6-mat-sederhanakan-pecahan-resep (1.0.0 → 1.0.1) | instruksi ditulis ulang (FPB langsung memberi bentuk paling sederhana). EN sepadan |
| KECIL | sd5-mat-kembalian-toko-buku | instruksi "lalu ke uangnya" → "lalu ke uang yang dibayar". EN "to the note" → "to the money paid" |
| KECIL | sd5-mat-kembalian-ratusan (1.1.0 → 1.1.1) | barang 🧃 jus buah → 🧦 "kaus kaki" / EN "socks", harga tetap 23500. Id/labelKey `jus` → `kaos-kaki` |
| KECIL | sd5-mat-jadwal-kereta-lewat-60 (1.0.0 → 1.0.1) | judul → "Lewat Pergantian Jam" / EN "Across the Hour" |
| KECIL | sd6-mat-empat-kuadran (1.0.0 → 1.0.1) | tambah item i15 "(4, −3)" → k4, sesuai janji jebakan pasangan terbalik di keterangan knob |
| KECIL | sd6-mat-uji-bagi-3-9-gudang (1.0.0 → 1.0.1) | tambah item → `tidak`: i18 4.105 (jumlah angka 10), i19 7.000 (7), i20 2.311 (7). Kunci rak lama sudah dicek ulang, semuanya benar |
| KECIL | sd5-mat-modus-median-turnamen (1.0.0 → 1.0.1) | q7 data → 7, 18, 9, 17, 18 (median 17 = c16, modus 18 = c3 jadi pengecoh). q12 data → 17, 7, 7, 18, 2, 15, 9. Kunci diganti ke c6 "9", pilihan [c6, c3, c9, c7], dan 7 (modus) tetap jadi pengecoh |
| KECIL | sd6-mat-pecahan-beda-penyebut (1.0.0 → 1.0.1) | q3 3/5 + 1/4 → 3/5 + 1/3. Item c8–c11 (hanya dipakai r3) diberi label baru: ✓14/15, pengecoh 4/8 (jumlahkan atas dan bawah), 4/15 (jumlahkan pembilang, kalikan penyebut), 8/15 (hanya satu pecahan yang diubah). Tidak ada item baru; tidak bentrok dengan label lain di paket |

## Kalimat suara berubah (WAJIB lengkap)

| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd5-mat-urut-nilai-campur | s1 | Panjang lima ulat (cm) | Bagian lima roti yang sudah dimakan |
| sd5-mat-urut-nilai-campur | s2 | Hujan lima hari (cm) | Bagian lima gelas yang sudah terisi |
| sd5-mat-urut-nilai-campur | s3 | Baterai lima ponsel | Berat lima kantong beras (kg) |
| sd5-mat-urut-nilai-campur | s5 | Bagian gambar yang diwarnai | Panjang lima krayon (cm) |
| sd5-mat-urut-desimal-persen | s8 | Isi lima botol (liter) | Bagian lima botol yang sudah terisi |
| sd6-mat-urut-desimal-pecahan-persen | s9 | Isi lima gelas (liter) | Bagian lima gelas yang sudah terisi |
| sd5-mat-kembalian-toko-buku | kalkulator | kalkulator | sempoa |
| sd5-mat-kembalian-toko-buku | instruksi | Pembeli membayar Rp50.000 atau Rp100.000. Lengkapi dulu ratusannya ke ribuan, lalu ke puluhan ribu, lalu ke uangnya. Beri kembalian yang tepat. | Pembeli membayar Rp50.000 atau Rp100.000. Lengkapi dulu ratusannya ke ribuan, lalu ke puluhan ribu, lalu ke uang yang dibayar. Beri kembalian yang tepat. |
| sd5-mat-kembalian-ratusan | jus (dihapus) | jus buah | (dihapus) |
| sd5-mat-kembalian-ratusan | kaos-kaki (baru) | (baru) | kaus kaki |
| sd6-mat-sudut-segitiga-rangka-atap | q13 (baru) | (baru) | Segitiga sama kaki, sudut puncaknya 40°. Tiap sudut kakinya … |
| sd6-mat-sudut-segitiga-rangka-atap | c48 (baru) | (baru) | 140° |
| sd6-mat-sudut-segitiga-rangka-atap | q14 (baru) | (baru) | Segitiga sama kaki, satu sudut kakinya 65°. Sudut puncaknya … |
| sd6-mat-sudut-segitiga-rangka-atap | c49 (baru) | (baru) | 115° |
| sd6-mat-persen-toko-buku | c4 | Rp100.001 | Rp199.950 |
| sd6-mat-persen-toko-buku | c37 | Rp14.001 | Rp19.970 |
| sd6-mat-sifat-segi-empat | c6 | sisi berhadapan sama | sisi berhadapan sama panjang |
| sd6-mat-sederhanakan-pecahan-resep | instruksi | Bagi pembilang dan penyebut dengan FPB-nya sampai tidak bisa dibagi lagi. Taruh di rak bentuk paling sederhana. | Bagi pembilang dan penyebut dengan FPB-nya, maka pecahan langsung menjadi paling sederhana. Taruh di raknya. |
| sd5-mat-jadwal-kereta-lewat-60 | judul | Jadwal Kereta Malam | Lewat Pergantian Jam |
| sd6-mat-empat-kuadran | i15 (baru) | (baru) | (4, −3) |
| sd6-mat-uji-bagi-3-9-gudang | i18 (baru) | (baru) | 4.105 |
| sd6-mat-uji-bagi-3-9-gudang | i19 (baru) | (baru) | 7.000 |
| sd6-mat-uji-bagi-3-9-gudang | i20 (baru) | (baru) | 2.311 |
| sd5-mat-modus-median-turnamen | q7 | Skor permainan: 7, 18, 9, 17, 17. Mediannya … | Skor permainan: 7, 18, 9, 17, 18. Mediannya … |
| sd5-mat-modus-median-turnamen | q12 | Skor permainan: 17, 7, 7, 18, 2, 15, 5. Mediannya … | Skor permainan: 17, 7, 7, 18, 2, 15, 9. Mediannya … |
| sd6-mat-pecahan-beda-penyebut | q3 | 3/5 + 1/4 = … | 3/5 + 1/3 = … |
| sd6-mat-pecahan-beda-penyebut | c8 | 17/20 | 14/15 |
| sd6-mat-pecahan-beda-penyebut | c9 | 4/9 | 4/8 |
| sd6-mat-pecahan-beda-penyebut | c10 | 4/20 | 4/15 |
| sd6-mat-pecahan-beda-penyebut | c11 | 7/20 | 8/15 |

## Ditolak (bukan masalah)

| temuan | alasan |
|---|---|
| KECIL sd6-mat-sudut-segitiga-rangka-atap `instruksi` (hapus kalimat sama kaki) | Tidak diterapkan karena syaratnya ("bila soal sama kaki tidak ditambah") tidak terpenuhi. Paket ini sekarang punya soal sama kaki r13/r14, jadi instruksi lama sudah tepat |

## Butuh keputusan owner

| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sd5-mat-urut-nilai-campur / MAT.SD5.DESIMAL.02 | Tujuh dari sepuluh deret hanya memakai satu bentuk bilangan, jadi isinya tumpang tindih dengan sd5-mat-urut-desimal-persen | Ganti minimal 4 deret satu bentuk dengan deret campuran, mis. "1/10 → 25% → 0,4 → 3/5 → 80%". Catatan: knob steps default 4 membuang kartu ke-5, jadi campuran harus sudah ada di 4 kartu pertama |
| SEDANG | sd5-mat-cari-angka-desimal / MAT.SD5.DESIMAL.01 | 8 dari 12 soal menanyakan tempat satuan/puluhan, bukan angka di belakang koma | Ubah ≥4 soal menjadi persepuluhan (usulan q5, q9, q10, q12 di laporan) |
| SEDANG | sd6-mat-sudut-segitiga / MAT.SD6.GEOMETRI.02 | Soal sama kaki selalu memberi dua sudut, jadi sifat sudut kaki tidak pernah dipakai. Paket rangka-atap sudah diberi 2 soal sama kaki | Ubah r5/r9/r10 menjadi "satu sudut kaki X°" atau "sudut puncak X°" |
| KECIL | sd5-mat-tambah-kurang-pecahan vs sd5-mat-pecahan-toko-kue / MAT.SD5.PECAHAN.03 | 4 soal identik di kedua paket | Ganti di salah satu paket (usulan di laporan: 3/8 + 1/2, 5/6 − 1/3, 1/4 + 5/8, 9/10 − 1/5) |
| KECIL | sd5-mat-sudut-garis-lurus vs sd5-mat-sudut-gunting / MAT.SD5.GEOMETRI.02 | Isi kedua paket hampir sama dan ada soal kembar. Nama "gunting" juga tidak cocok dengan isinya | Beri konteks pembeda (gunting terbuka / jarum jam) atau ganti soal kembar |
