# Tinjauan SAINS-SD4.json — 2026-10-25
Persona: Guru sains SD kelas atas (12 tahun mengajar Cambridge Primary Science Stage 4–6 di sekolah internasional Jakarta; skeptis pada kuis hafalan yang menyamar sebagai "permainan"). Pembaca draf ini tidak sama dengan penulisnya: draf ditulis dulu, lalu dibaca ulang dengan rubrik K1–K8 tanpa menimbang niat penulis. Usia SD 4 = 9–10 tahun.
Acuan: Cambridge Primary Science 0097, Stage 4 (kamus `content/kerangka/cambridge-primary-science-sains-sd4-6.json`, 63 kode Stage 4, semua `verified: true` dari salinan PDF framework resmi). Cambridge hanya acuan, bukan afiliasi.
Validator: bersih untuk berkas ini (0 error, 0 peringatan; semua `refs` ada di kamus dan terverifikasi):

```
✓ content/kurikulum/SAINS-SD4.json: 17 kompetensi
✓ 18 paket sd4-sains-* (pilah 12, urutkan 6)
```

Uji simulasi (logika `packages/mechanics`, 10 ronde `buatRondeBaru` per paket, jawaban sempurna): 18/18 paket menghasilkan 10 ronde berbeda dan dinilai benar. Paket `pilih` hanya memunculkan ±6 pertanyaan berbeda dalam 10 ronde (lihat PO 4).

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| RANGKA-OTOT.01 | 14 (K4 1, K1 1) | LULUS | Pilah tulang ke daerah tubuh. Masih mengingat nama, tetapi memang itu tuntutan 4Bs.01 ("identify"). Lebih kuat bila nanti ada model tubuh (`cari`). |
| RANGKA-OTOT.02 | 13 (K4 1, K8 1) | REVISI — **diterapkan** | Ronde ubur-ubur ("tubuh lembek di pasir → memberi bentuk") juga sah dijawab "menopang". Satu jawaban tidak tunggal = cacat bukti. Ronde dibuang; 7 ronde tersisa. |
| RANGKA-OTOT.03 | 15 (K4 1) | LULUS | Otot berpasangan lewat gerakan konkret. Saran presenter: animasi lengan sesudah jawaban supaya akibatnya teramati. |
| VERTEBRATA.01 | 16 | LULUS | Tiga wadah, jebakan kura-kura dan ular tepat. Siput sengaja dikeluarkan — keputusan benar. |
| RANTAI-MAKANAN.01 | 16 | LULUS | Lima rantai, susun + perbaiki. Mekanik `perbaiki` memberi bukti kedua dari konteks berbeda (minContexts 2 terpenuhi dalam satu kompetensi). |
| RANTAI-MAKANAN.02 | 15 (K1 1) | LULUS | Klasifikasi herbivora/karnivora/omnivora menuntut pengetahuan makanan hewan, bukan pengamatan. Sesuai 4Be.03; dapat diterima di SD4. |
| WUJUD-ZAT.01 | 16 | LULUS | Label wadah memuat sifat, jebakan bubuk sesuai 4Cp.02 persis. |
| WUJUD-ZAT.02 | 14 (K8 1, K7 1) | REVISI — **diterapkan** | Langkah "partikel merapat dan berbaris" saat air membeku salah untuk air (es lebih renggang daripada air cair). Diganti "partikel berhenti berpindah, hanya bergetar di tempat". |
| WUJUD-ZAT.03 | 16 | LULUS | Pasangan jebakan dalam satu kumpulan (lilin meleleh vs sumbu terbakar) — contoh K4 yang baik untuk pilah. |
| LISTRIK.01 | 16 | LULUS | Keadaan rangkaian sebagai kartu; jebakan "kedua kabel di kutub yang sama" bagus. |
| LISTRIK.02 | 16 | LULUS | Bingkai percobaan (dijepit di celah) dan wadah berlabel akibat. Pensil dikeluarkan dengan alasan benar. |
| LISTRIK.03 | 15 (K4 1) | LULUS | Prediksi sah hanya bila lampu disembunyikan sampai anak memilih — dicatat untuk presenter; tanpa itu menjadi kuis. |
| CAHAYA.01 | 16 | LULUS | Bulan, cermin, pemantul sepeda sebagai jebakan. |
| BUMI-ANTARIKSA.01 | 15 (K5 1) | LULUS | Inti dipecah dua melebihi acuan; catatan jujur menyebutnya. |
| BUMI-ANTARIKSA.02 | 14 (K1 1, K4 1) | LULUS | Hafalan urutan planet. Acuan 4ESs.02 memang "name the planets"; knob 4 → 8 membuatnya bertahap. |
| BUMI-ANTARIKSA.03 | 16 | LULUS | Arah bayangan pagi/sore dan miskonsepsi "Matahari mengitari Bumi" sebagai pengecoh. |
| PENYELIDIKAN.01 | 16 | LULUS | Ronde berpasangan (diubah / dibuat sama) dengan "yang diukur" sebagai pengecoh — jawaban tunggal. Prompt r8 sempat ambigu (yang diuji tidak disebut); sudah ditulis ulang sebelum tinjauan ini. |

**Hasil: 15 LULUS, 2 REVISI (keduanya diterapkan).**

## Revisi yang diterapkan

### RANGKA-OTOT.02
- Masalah (K4★): pada ronde "ubur-ubur tanpa rangka, tubuhnya lembek" dua tugas sah (memberi bentuk dan menopang). Mesin `pilih` hanya menerima satu `correct`, jadi anak yang menalar benar bisa dinilai salah.
- Diterapkan: ronde dibuang; catatan diperbarui (7 ronde, bukti ≥ 6/7). Ronde "bentuk" kini hanya kerangka museum (tanpa beban).

### WUJUD-ZAT.02
- Masalah (K8/fakta): air adalah pengecualian — saat membeku partikelnya tersusun lebih renggang (es mengapung). "Merapat" mengajarkan hal yang keliru dan akan bertabrakan dengan 5Cp.02 di SD5 ("expands when it solidifies").
- Diterapkan: label langkah → "partikel berhenti berpindah, hanya bergetar di tempat" / "the particles stop moving around and just vibrate in place".

## Catatan urutan & prasyarat

- Semua prasyarat menunjuk ke dalam SD4 (tidak ada rujukan ke SD1–3 yang sedang ditulis agen lain). Akibatnya SD4 tampak "berdiri sendiri"; bila SD3 sudah final, PO dapat menambah prasyarat lintas level (mis. VERTEBRATA ← kelompok hewan SD3).
- Rantai di dalam unit: RANGKA .01 → .02/.03; RANTAI .01 → .02; WUJUD .01 → .02 → .03; LISTRIK .01 → .02/.03. Tidak ada siklus.
- Kompetensi SD4 dipakai sebagai prasyarat oleh SD5 (LARUTAN, SIKLUS-AIR, MAGNET, ADAPTASI.02, BUMI-ORBIT, PENYELIDIKAN) dan SD6 (JARING-MAKANAN, PERUBAHAN-ZAT, LISTRIK, CAHAYA, BATUAN).

## Cakupan acuan Stage 4 yang belum ada

Belum dibuat kompetensi: 4Bp.01–02, 4Bp.04 (obat, penyakit menular, gerak dan kesehatan), 4Be.01–02 (habitat; sebagian sudah di TK B), 4Cm.02–03, 4Pf.01–04 (energi — terlalu abstrak untuk pilah tanpa simulasi), 4Ps.01 (diagram sinar), 4ESp.02–03 (gunung api, gempa), 4ESs.04, sebagian besar TWS (tabel/grafik, kunci determinasi 4TWSc.02), dan seluruh Science in Context.

## Untuk diputuskan PO

1. **Acuan Cambridge vs `docs/akademi/kurikulum.md`.** Daftar topik SD4 di kurikulum.md memuat bagian bunga (Cambridge Stage 5), batuan/tanah/pelapukan (Stage 6), rangkaian paralel (Stage 6), dan "suhu dan kalor" (tidak ada di Stage 4). Draf ini mengikuti Stage 4 sesuai arahan; topik itu muncul di SD5/SD6. Mohon kurikulum.md diselaraskan atau keputusan sebaliknya.
2. **Kesehatan (4Bp.01 obat, 4Bp.02 vaksin).** Belum ditulis; menyangkut pesan kesehatan yang akan dibaca orang tua (pemakaian obat, vaksin). Perlu arahan nada dan apakah ingin ditinjau tenaga kesehatan.
3. **Semua kompetensi `core: true`.** Semuanya objektif Cambridge Stage 4, tetapi 17 kompetensi inti untuk satu lencana cukup berat. PO boleh menandai pengaya (calon: BUMI-ANTARIKSA.02 urutan planet, RANGKA-OTOT.03).
4. **Mesin `pilih` kurang bervariasi.** `buatRondeBaru` membedakan ronde dari urutan pilihan yang diacak, sehingga pertanyaan yang sama bisa muncul lagi dengan urutan berbeda (±6 pertanyaan berbeda per 10 ronde walau paket punya 8). Usul teknis: kunci ronde mode `pilih` = `promptKey`. Di luar wewenang penulis konten.
5. **Mekanik baru yang dibutuhkan.** Diagram sinar (4Ps.01), energi (4Pf), dan prediksi rangkaian yang benar-benar "menyala setelah dipilih" butuh mode simulasi rangkaian. Saat ini bukti prediksi bergantung pada presenter menyembunyikan hasil.

## Tindak lanjut peninjau — 25 Okt 2026

Diterapkan langsung ke `SAINS-SD4.json` dan paket terkait: RANGKA-OTOT.02 (ronde ambigu dibuang, catatan diberi tanda `[Tinjauan 25 Okt 2026]`), WUJUD-ZAT.02 (label partikel membeku diperbaiki di `sd4-sains-mencair-dan-membeku`). Validator dan uji simulasi dijalankan ulang: bersih.
