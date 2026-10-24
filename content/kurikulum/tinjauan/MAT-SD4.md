# Tinjauan MAT-SD4.json — 2026-10-25
Persona: guru matematika SD kelas tinggi (12 tahun mengajar kelas 4–6, sekolah berkurikulum internasional; acuan Cambridge Primary Stage 4). Konteks usia SD 4 = 9–10 tahun.
Ini tinjauan diri yang terpisah dari penulisan: draf dibaca ulang dengan rubrik tetap, temuan diperbaiki di berkas yang sama, lalu validator dijalankan ulang.

Validator setelah revisi (berkas ini dan paketnya):

```
✓ content/kurikulum/MAT-SD4.json: 20 kompetensi
0 error, 0 peringatan untuk MAT.SD4.* dan 38 paket sd4-mat-*
```

Kamus acuan: `content/kerangka/cambridge-primary-maths-mat-sd4-6.json` (46 kode Stage 4, semua `verified: true`, dibaca dari PDF framework 0096 hlm. 24–26). Prasyarat hanya menunjuk ke SD4 sendiri, karena SD1–SD3 ditulis agen lain pada saat yang sama. Kompetensi tanpa prasyarat (NILAI-TEMPAT.01, KALI-BAGI.01, POLA-BILANGAN.01, PECAHAN.01, WAKTU.01, GEOMETRI.01/.03, PELUANG.01) perlu disambungkan ke MAT-SD3 setelah berkas itu final.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| NILAI-TEMPAT.01 | 15 (K4 1) | LULUS | Nilai angka menurut tempat. Bukti lewat pilihan 4; tiap pengecoh = geser satu tempat. |
| NILAI-TEMPAT.02 | 16 | LULUS | Menyusun kartu naik dan turun, dua paket. Pengecoh angka sama urutan beda. |
| NILAI-TEMPAT.03 | 14 (K2 1, K5 1) → 16 | REVISI → LULUS | Statement hanya "ribuan" padahal paket kedua membulatkan ratusan. Diperbaiki: "ratusan atau ribuan"; note ref diganti. |
| NILAI-TEMPAT.04 | 16 | LULUS | Menyusun uang pas: aksi produksi jumlah, bukan pilihan. |
| NEGATIF.01 | 16 | LULUS | Urutkan suhu; jebakan −12 vs −5. |
| TAMBAH-KURANG.01 | 15 (K5 1) | LULUS | Kembalian dari 50/100 ribu. 4Ni.02 "tiga angka" cocok bila dibaca dalam ribuan; note menjelaskan. |
| KALI-BAGI.01 | 16 | LULUS | Pilah fakta ke rak hasil; dua rak per produk yang sama mencegah tebak. |
| KALI-BAGI.02 | 14 (K2 1, K4 1) | LULUS | Kali dan bagi dalam satu kompetensi (dua ref). Bisa dipecah nanti bila data telemetri menunjukkan selisih besar. |
| POLA-BILANGAN.01 | 16 | LULUS | Generalisasi genap/ganjil dibuktikan dengan bilangan besar dan tiga suku. |
| POLA-BILANGAN.02 | 15 (K4 1) | LULUS | Barisan linear dan tak linear, termasuk melewati nol. |
| PECAHAN.01 | 16 | LULUS | Rak pecahan senilai, dua paket. |
| PECAHAN.02 | 16 | LULUS | Urutkan; deret campuran 1/8, 1/4, 1/2, 5/8, 3/4 memaksa kesetaraan. |
| WAKTU.01 | 14 (K4 1, K7 1) → 15 | REVISI → LULUS | "12.10 tengah malam" janggal dalam bahasa Indonesia. Diganti "12.10 lewat tengah malam" / "just after midnight". Batas pagi/siang/sore/malam ditulis eksplisit di generator paket kedua. |
| WAKTU.02 | 15 (K2 1) | LULUS | Selang tanpa melewati 60 (sesuai Stage 4) + konversi satuan. Tiga ref, tetapi satu kemampuan "mengolah selang waktu". |
| GEOMETRI.01 | 16 | LULUS | Derajat + jam bulat + pecahan putaran. |
| GEOMETRI.02 | 15 (K4 1) | LULUS | Keliling vs luas; pengecoh selalu memuat satuan salah. |
| GEOMETRI.03 | 13 (K3 1, K4 1, K8 1) → 14 | REVISI → LULUS (pengaya) | Huruf "O" di font Baloo hampir lingkaran (tak hingga garis simetri) → dibuang. Simetri huruf bergantung font; catatan memuat daftar huruf aman. |
| POSISI.01 | 14 (K5 1, K6 1) | LULUS (pengaya) | Navigasi belok 90° = arah dan gerak (4Gp.01), tapi koordinat dan arah mata angin belum ada. Bersinggungan dengan KODE; dijaga `core: false`. |
| DATA.01 | 16 | LULUS | Carroll 2 × 2, dua paket dengan sifat berbeda. |
| PELUANG.01 | 14 (K4 1, K8 1) → 15 | REVISI → LULUS | Paket kedua awalnya 7 dari 12 soal "mustahil" (acak tidak seimbang). Diganti generator yang memutar kelima kategori. Soal koin: "angka" ≠ "heads" → en ditulis "number side up". |

**Hasil: 15 LULUS, 5 REVISI (semua sudah diperbaiki).**

## Pola umum yang perlu PO ketahui

### K4 — bukti lewat pilihan (pilah mode `pilih`)
Sebelas dari dua puluh kompetensi punya minimal satu paket `pilih`. Untuk usia 9–10 tahun soal pilihan tidak lagi "kuis berbungkus" yang dikritik di TK B (anak sudah membaca dan menghitung di kepala), tetapi tetap ada peluang tebak 25%. Penangkalnya: (1) tiap pengecoh dirancang sebagai salah paham yang nyata (geser tempat, keliling-untuk-luas, +10 alih-alih +12), (2) aturan penguasaan (≥ 3 sukses, rasio 0,7 pada 10 terakhir, 2 konteks, 2 hari) membuat lolos karena menebak hampir mustahil (P ≈ 0,4% untuk 7/10 benar pada peluang 25%). Bila mekanik isian angka (ketik/ucap) dibangun, paket `pilih` sebaiknya dipindah ke sana.

### Dua konteks untuk kompetensi inti
`DEFAULT_MASTERY.minContexts = 2` berarti kompetensi tidak bisa "dikuasai" dengan satu paket. Draf pertama hanya punya satu paket per kompetensi; setelah tinjauan, tiap kompetensi inti (18) diberi paket kedua dengan konteks berbeda (bandara vs stasiun, toko elektronik vs toko olahraga, rak ratusan vs ribuan, susun naik vs turun). Pengaya (GEOMETRI.03, POSISI.01) tetap satu paket, sama dengan pola TK B.

### Variasi 10 ronde pada mode `pilih`
Uji simulasi `buatRondeBaru` 10 ronde: semua paket menghasilkan 10 ronde berkunci unik, tetapi pada mode `pilih` kunci ronde ikut memuat urutan pilihan yang diacak, sehingga dari 12 soal rata-rata hanya ±7 soal berbeda yang keluar (sisanya soal sama dengan urutan pilihan lain). Ini sifat mesin (`kunciRonde` = JSON ronde), berlaku juga untuk paket TK; perbaikannya di `packages/mechanics` (kunci `pilih` = `promptKey`), bukan di konten.

## Celah terhadap kurikulum.md SD 4 dan Stage 4
- **Belum ada**: koordinat kuadran pertama (4Gp.02), mengukur sudut dengan busur derajat, diagram garis/batang (4Ss.02 bagian grafik), jaring-jaring bangun ruang (4Gg.06), luas bangun tak beraturan pada petak (4Gg.04), persen (4Nf.06), pecahan sebagai operator (4Nf.03). Penyebab: tidak ada mekanik yang bisa menggambar petak/grafik atau menerima isian.
- **Berbeda dari kurikulum.md**: "pecahan campuran dan desimal satu angka" serta "luas segitiga" ditaruh di SD5–SD6 mengikuti urutan Cambridge Stage 5–6.
