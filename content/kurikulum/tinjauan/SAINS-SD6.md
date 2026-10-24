# Tinjauan SAINS-SD6.json — 2026-10-25
Persona: Guru sains SD kelas atas (12 tahun mengajar Cambridge Primary Science Stage 4–6, pembimbing Checkpoint Stage 6), ditambah sudut pandang wali murid untuk unit kesehatan. Membaca draf dengan rubrik K1–K8, terpisah dari saat menulis. Usia SD 6 = 11–12 tahun.
Acuan: Cambridge Primary Science 0097, Stage 6 (59 kode Stage 6 di `content/kerangka/cambridge-primary-science-sains-sd4-6.json`, semua `verified: true`). Cambridge hanya acuan.
Validator: bersih untuk berkas ini (0 error, 0 peringatan):

```
✓ content/kurikulum/SAINS-SD6.json: 18 kompetensi
✓ 20 paket sd6-sains-* (pilah 11, urutkan 9)
```

Uji simulasi (10 ronde per paket, jawaban sempurna): 20/20 paket lolos.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| PERNAPASAN.01 | 15 (K1 1) | LULUS | Dua arah (masuk/keluar). Urutan organ dalam tak teramati; sesuai 6Bs.02 dan diterima di SD6. |
| SIRKULASI.01 | 15 (K1 1) | LULUS | Dua lingkaran + perbaiki. Label memuat yang diangkut (oksigen, sari makanan, karbon dioksida) — fungsi 6Bs.01 ikut terbukti. |
| PENYAKIT.01 | 16 | LULUS | Contoh Indonesia (3M demam berdarah, merebus air, kelambu); bahasa tanpa menyalahkan. Cairan tubuh hanya lewat contoh netral. |
| JARING-MAKANAN.01 | 16 | LULUS | Jalur dari satu jaring sawah, dimulai Matahari — naik jelas dari SD4. |
| JARING-MAKANAN.02 | 13 (K4 1, K8 1) | REVISI — **diterapkan** | r6 "bila katak mati, ular…" — di jaring sawah ular juga memakan tikus, jadi "tetap sama" bisa dibela. |
| PERUBAHAN-ZAT.01 | 16 | LULUS | Naik dari SD4: melarutkan dan mencampur termasuk perubahan yang bisa dibalik, dikaitkan ke cara pisah SD5. |
| PERUBAHAN-ZAT.02 | 14 (K4 1, K8 1) | REVISI — **diterapkan** | Kartu "korek api digesek lalu panas" juga memperlihatkan cahaya dan gas — buktinya tidak tunggal, padahal catatan menjanjikan tunggal. |
| PERUBAHAN-ZAT.03 | 16 | LULUS | Definisi singkat di label; "uap putih di atas teh" (pengembunan) dikeluarkan dengan alasan benar. |
| MASSA-BERAT.01 | 16 | LULUS | r8 memakai angka (2 kg tetap 2 kg); bahasa sehari-hari "berat badan 30 kg" tidak dinilai salah — bijak. |
| APUNG-TENGGELAM.01 | 15 (K4 1) | LULUS | Pasangan terkendali satu variabel. Dua pilihan per ronde (peluang tebak 50%); mastery 0,7/10 bukti cukup menahan. |
| CAHAYA.01 | 16 | LULUS | Danau tenang (pantul walau ada air) dan kaca pembesar (bias) sebagai jebakan. |
| LISTRIK.01 | 15 (K5 1) | LULUS | Seri vs paralel dari uraian. 6Pe.01 (simbol) dicantumkan sebagai ref kedua padahal belum dinilai — catatan jujur; ref dipertahankan karena uraian rangkaian adalah representasi. |
| BATUAN.01 | 16 | LULUS | Kartu nama + ciri teramati = kunci determinasi sederhana. |
| BATUAN.02 | 16 | LULUS | Fosil tubuh dan fosil jejak. |
| BATUAN.03 | 16 | LULUS | Siklus lengkap + dua jalan pintas, istilah acuan sebagai label. |
| TANAH.01 | 16 | LULUS | Kartu berupa hasil uji (dikepal, disiram, dicium) — klasifikasi dari pengamatan. |
| TATA-SURYA.01 | 15 (K1 1) | LULUS | Fase Bulan susun + perbaiki; tugas pengamatan luring disarankan. Orientasi emoji (belahan utara) dicatat. |
| PENYELIDIKAN.01 | 16 | LULUS | Hasil janggal dari percobaan yang dikenal sejak SD4–5; angka dibuat jelas tanpa hitung rata-rata. |

**Hasil: 16 LULUS, 2 REVISI (keduanya diterapkan).**

## Revisi yang diterapkan

### JARING-MAKANAN.02
- Diterapkan: r6 → "Di kolam ini ular hanya memakan katak. Bila katak mati karena racun, ular kemungkinan…" (EN disesuaikan). Jawaban "berkurang" kini tunggal.

### PERUBAHAN-ZAT.02
- Diterapkan: kartu korek api → "batu gamping tohor disiram air menjadi panas" (reaksi eksoterm yang lazim di Indonesia, bukti suhu saja). Catatan diberi tanda tinjauan.

## Catatan urutan & prasyarat

- Prasyarat lintas level hanya ke SD4/SD5 (track sendiri): JARING-MAKANAN.01 ← SD4 RANTAI-MAKANAN.01; PERUBAHAN-ZAT.01 ← SD4 WUJUD-ZAT.03 + SD5 LARUTAN.02; PERUBAHAN-ZAT.03 ← SD5 SIKLUS-AIR.01; MASSA-BERAT.01 dan APUNG-TENGGELAM.01 ← SD5 GAYA.01; CAHAYA.01 ← SD4 CAHAYA.01; LISTRIK.01 ← SD4 LISTRIK.03; BATUAN.01 ← SD4 BUMI-ANTARIKSA.01; TATA-SURYA.01 ← SD5 BUMI-ORBIT.01; PENYELIDIKAN.01 ← SD5 PENYELIDIKAN.01.
- Di dalam level: PERNAPASAN → SIRKULASI; JARING .01 → .02; PERUBAHAN-ZAT .01 → .02; BATUAN .01 → .02/.03 dan → TANAH.01. Tidak ada siklus.

## Topik sensitif — sengaja TIDAK ditulis

- **6Bs.03** "Name the parts of the human reproductive system" dan **6Bp.01** "Describe the physical changes that take place during puberty in humans" (juga "Pubertas dan perubahan tubuh" di `docs/akademi/kurikulum.md` SD6). Kode tetap ada di kamus kerangka sebagai catatan, tetapi tidak dipakai kompetensi mana pun. Ini keputusan PO (lihat `produksi-konten.md`: "materi tubuh/pubertas").

## Cakupan acuan Stage 6 yang belum ada

6Bp.04 (pertahanan tubuh), 6Cp.02–03 (gas bermassa; konduktivitas sebagai sifat), 6Cc.02 (suhu dan melarut), 6Pf.03–04 (diagram gaya), 6Pe.01 penuh (simbol rangkaian), 6ESs.01 sebagian, TWS grafik sebar, Science in Context.

## Untuk diputuskan PO

1. **Reproduksi dan pubertas (6Bs.03, 6Bp.01)**: tulis atau tidak, dengan bahasa apa, dan apakah memerlukan persetujuan wali per anak / mode wali-saja. Mohon arahan sebelum agen mana pun menulisnya.
2. **Aset diagram**: LISTRIK.01 (diagram bersimbol), JARING-MAKANAN.01 (gambar jaring utuh), CAHAYA.01 (sinar) akan jauh lebih kuat dengan gambar. Saat ini hanya emoji + teks.
3. **Mekanik baru**: "gambar panah" untuk diagram gaya (5Pf.03, 6Pf.03) dan diagram sinar (6Ps.01) — dua objektif Stage 5–6 yang tidak bisa dibuktikan dengan enam mekanik yang ada.
4. **`docs/akademi/kurikulum.md` SD6** menyebut "energi terbarukan", "mesin sederhana: tuas, katrol, bidang miring", "sel dan mikroskop", "galaksi" — tidak ada di Cambridge Stage 6. Bila PO tetap menginginkannya, perlu kompetensi tanpa ref Cambridge (atau acuan KURMER).
5. **Mesin `pilih`**: sama dengan tinjauan SD4 PO 4.

## Tindak lanjut peninjau — 25 Okt 2026

Diterapkan ke `SAINS-SD6.json` (catatan bertanda `[Tinjauan 25 Okt 2026]`) dan paket `sd6-sains-racun-di-rantai-makanan`, `sd6-sains-tanda-reaksi-kimia`. Validator dan uji simulasi diulang: bersih.
