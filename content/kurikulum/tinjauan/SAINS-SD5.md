# Tinjauan SAINS-SD5.json — 2026-10-25
Persona: Guru sains SD kelas atas (12 tahun mengajar Cambridge Primary Science Stage 4–6; terbiasa menyiapkan anak untuk Progression Test Stage 5). Membaca draf dengan rubrik K1–K8, terpisah dari saat menulis. Usia SD 5 = 10–11 tahun.
Acuan: Cambridge Primary Science 0097, Stage 5 (59 kode Stage 5 di `content/kerangka/cambridge-primary-science-sains-sd4-6.json`, semua `verified: true`). Cambridge hanya acuan.
Validator: bersih untuk berkas ini (0 error, 0 peringatan):

```
✓ content/kurikulum/SAINS-SD5.json: 17 kompetensi
✓ 18 paket sd5-sains-* (pilah 13, urutkan 5)
```

Uji simulasi (10 ronde per paket, jawaban sempurna): 18/18 paket lolos, 10 ronde berbeda tiap paket.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| BUNGA.01 | 13 (K4 0, K1 1) | REVISI — **diterapkan** | Soal r2 "membuat serbuk **sari**" dan r3 "di puncak **putik**" membocorkan jawaban lewat kata yang sama dengan label pilihan: anak bisa benar tanpa paham. |
| BUNGA.02 | 16 | LULUS | Rumput, padi, kaktus berbunga sebagai jebakan; jamur dikeluarkan dengan alasan tepat. |
| SIKLUS-TUMBUHAN.01 | 16 | LULUS | Tiga tumbuhan lokal, siklus ditutup biji baru. |
| SIKLUS-TUMBUHAN.02 | 16 | LULUS | Prediksi dengan variabel air/suhu/cahaya; r8 memisahkan berkecambah dari tumbuh — tepat sasaran 5Bp.04. |
| SIKLUS-TUMBUHAN.03 | 14 (K8 1, fakta 1) | REVISI — **diterapkan** | "Polong teratai mengapung" sebagai contoh penyebaran oleh air lemah secara botani. Diganti buah nipah. |
| PENCERNAAN.01 | 15 (K7 1) | REVISI — **diterapkan** | Emoji lambung 🫃 bermakna "orang hamil" — salah tafsir dan menyentuh topik yang sengaja dihindari. Diganti bentuk bulat. |
| PENCERNAAN.02 | 15 (K7 1) | REVISI — **diterapkan** | Emoji yang sama; diganti. |
| ADAPTASI.01 | 16 | LULUS | Ciri + gunanya di kartu: anak menalar, bukan menghafal habitat. |
| ADAPTASI.02 | 16 | LULUS | Ciri ambigu (lari cepat, warna samaran) dikeluarkan dengan alasan tertulis. |
| LARUTAN.01 | 14 (K5 1, K8 1) | REVISI — **diterapkan** | "Sirup" adalah cairan; acuan 5Cp.01 tentang zat **padat** yang larut. Diganti bubuk oralit (lokal, aman). |
| LARUTAN.02 | 16 | LULUS | Inti 5Cc.02 (larutan tak bisa disaring, harus diuapkan) muncul di 4 ronde; r8 diberi syarat agar jawaban tunggal. |
| SIKLUS-AIR.01 | 16 | LULUS | Tiga konteks termasuk gelas es yang bisa dicoba di rumah. |
| GAYA.01 | 15 (K4 1) | LULUS | Menamai gaya dari kejadian; r8 menguji 5Pf.02 (benda diam tetap dikenai gaya). Diagram gaya belum dinilai. |
| BUNYI.01 | 16 | LULUS | Pilihan mencampur nada dan volume — memaksa anak memisahkan dua sifat. Fisika gelas-dipukul benar (lebih banyak air → lebih rendah). |
| MAGNET.01 | 16 | LULUS | Prasyarat konduktor SD4 dipakai sebagai pembanding "semua logam menghantar, tidak semua logam tertarik". |
| BUMI-ORBIT.01 | 15 (K1 1) | LULUS | Sehari vs setahun sebagai miskonsepsi inti. Arah orbit tidak dinilai (jujur di catatan). |
| PENYELIDIKAN.01 | 16 | LULUS | Tiga penyelidikan × tiga peran variabel; pilihan sama dalam satu penyelidikan. |

**Hasil: 12 LULUS, 5 REVISI (semua diterapkan).**

## Revisi yang diterapkan

### BUNGA.01
- Masalah (K4★): kata kunci di soal sama dengan kata di label pilihan ("serbuk sari" → "kepala sari"; "puncak putik" → "kepala putik"). Ini bukti palsu.
- Diterapkan: r2 → "Bagian di ujung benang yang menghasilkan serbuk kuning halus untuk penyerbukan"; r3 → "Bagian lengket paling atas di tengah bunga yang menangkap serbuk kuning dari bunga lain" (EN disesuaikan). r6–r7 tetap menyebut bagian tetangga (kepala sari, kepala putik) karena yang diuji hubungan struktur, dan pengecohnya sama-sama memuat kata itu (tangkai sari vs tangkai putik).

### SIKLUS-TUMBUHAN.03
- Diterapkan: "polong teratai mengapung di kolam" → "buah nipah mengapung terbawa arus sungai" (contoh penyebaran air yang lazim di pesisir Indonesia).

### PENCERNAAN.01 dan .02
- Diterapkan: emoji 🫃 diganti visual `shape: circle` warna lambung di kedua paket (`sd5-sains-jalan-makanan*`, `sd5-sains-tugas-organ-cerna`).

### LARUTAN.01
- Diterapkan: kartu "sirup" → "bubuk oralit". Minyak goreng tetap sebagai satu-satunya cairan (pengecoh: cair tetapi tidak larut).

## Catatan urutan & prasyarat

- Prasyarat lintas level hanya ke SD4 (track sendiri): LARUTAN.01 ← SD4 WUJUD-ZAT.01; SIKLUS-AIR.01 ← SD4 WUJUD-ZAT.02; MAGNET.01 ← SD4 LISTRIK.02; ADAPTASI.02 ← SD4 RANTAI-MAKANAN.02; BUMI-ORBIT.01 ← SD4 BUMI-ANTARIKSA.03; PENYELIDIKAN.01 ← SD4 PENYELIDIKAN.01.
- Di dalam level: BUNGA.01 → BUNGA.02, SIKLUS-TUMBUHAN.01 → .02/.03; PENCERNAAN.01 → .02; ADAPTASI.01 → .02; LARUTAN.01 → .02. Tidak ada siklus.
- BUNGA.01 tidak berprasyarat; bila SD3 (agen lain) punya "bagian tumbuhan", PO dapat menautkannya.

## Cakupan acuan Stage 5 yang belum ada

5Bp.01 (gizi seimbang — sebagian sudah di TK B), 5Cm.01–02 (model partikel gas; gas umum), 5Cp.02 (sifat air), 5Pf.03 (diagram gaya), 5Pe.03 (kekuatan magnet), 5ESp.01–03 (atmosfer, air tak murni, polusi), 5ESs.02 (musim), TWS penyajian data (grafik garis), Science in Context.

## Untuk diputuskan PO

1. **Istilah "anus"** dipakai sesuai acuan 5Bs.04. Alternatif yang lebih halus di telinga orang tua: "dubur". Keduanya baku; mohon pilih.
2. **Musim karena kemiringan Bumi (5ESs.02)** sengaja ditunda: Indonesia mengenal musim hujan/kemarau, bukan empat musim. Perlu dunia "negara lain" atau simulasi globe miring.
3. **Polusi (5ESp.03)** cocok untuk pilah (mencemari / tidak) dan relevan lokal; ditunda hanya karena jumlah kompetensi. Usul jadi kompetensi ke-18.
4. **`docs/akademi/kurikulum.md`** menaruh "pernapasan dan peredaran darah", "fotosintesis", "cahaya: pemantulan dan pembiasan", "siklus batuan" di SD5; Cambridge menaruhnya di Stage 6 (pernapasan, peredaran, pembiasan, siklus batuan) atau tidak secara eksplisit (fotosintesis). Draf mengikuti Cambridge.
5. **Mesin `pilih`**: sama dengan tinjauan SD4 PO 4 (variasi pertanyaan).

## Tindak lanjut peninjau — 25 Okt 2026

Diterapkan ke `SAINS-SD5.json` (catatan diberi tanda `[Tinjauan 25 Okt 2026]`) dan paket: `sd5-sains-tugas-bagian-bunga`, `sd5-sains-penyebaran-biji`, `sd5-sains-jalan-makanan`, `sd5-sains-jalan-makanan-perbaiki`, `sd5-sains-tugas-organ-cerna`, `sd5-sains-larut-atau-tidak`. Validator dan uji simulasi diulang: bersih.
