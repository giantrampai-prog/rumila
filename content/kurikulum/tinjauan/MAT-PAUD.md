# Tinjauan MAT-PAUD.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky). Konteks usia PAUD = 3–4 tahun.
Validator: bersih (0 error, 4 peringatan — 1 menyangkut berkas ini):

```
✓ content/kurikulum/MAT-PAUD.json: 11 kompetensi
! MAT.PAUD.WARNA-BENTUK.02: tidak ada kode acuan kerangka internasional
19 kompetensi, 0 error, 4 peringatan
```

Pembanding: 4 dari 11 kompetensi (BILANGAN-1-5.01, .02, WARNA-BENTUK.01, .02) adalah salinan kata per kata dari golden set; golden adalah batas bawah mutu, jadi keempatnya lulus, tetapi catatan strukturalnya tetap saya tulis di bawah.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| MAT.PAUD.BILANGAN-1-5.01 | 16 | LULUS | = golden. Menunjuk satu per satu, jebakan dan knob jelas. |
| MAT.PAUD.BILANGAN-1-5.02 | 16 | LULUS | = golden. Kardinalitas lewat pesanan "3 jeruk"; beda dengan .01 ditulis. |
| MAT.PAUD.BILANGAN-1-5.03 | 13 (K1 1, K4 1, K6 1) | REVISI | "langsung tahu" = kata kerja mental; cara jawab (memilih kotak angka) butuh kenal lambang yang baru diajarkan di .04 (pengaya). |
| MAT.PAUD.BILANGAN-1-5.04 | 12 (K4 1, K5 1, K6 1, K8 1) | REVISI | Kartu angka selalu bertitik, jadi game tidak bisa membedakan "cocokkan lambang" dari "cocokkan titik"; prasyarat kardinalitas (.02) hilang; ref EYFS tanpa catatan. |
| MAT.PAUD.BANDING.01 | 14 (K3 1, K5 1) | REVISI | Rubrik menempatkan "membandingkan" di TK A; knob sampai selisih 1 (4 vs 5) memaksa menghitung dua kelompok. Ref 1Ss.03 (statistik) meleset; 1Np.03 lebih tepat. |
| MAT.PAUD.BANDING.02 | 15 (K5 1) | LULUS | Besar/kecil dua benda, umpan balik fisik (baju-beruang). Ref 1Gg.02 bicara panjang, bukan besar; perlu catatan lebih jujur. |
| MAT.PAUD.BANDING.03 | 13 (K3 1, K6 1, K8 1) | REVISI | Seriasi 3 benda belum tahap 3–4 tahun (rubrik: PAUD belum "membandingkan", apalagi mengurutkan); melompat dari besar/kecil ke urutan panjang tanpa kompetensi "lebih panjang dari dua benda". |
| MAT.PAUD.BENTUK-DASAR.01 | 16 | LULUS | Kotak-pos = umpan balik fisik; rotasi sebagai knob; warna diacak. Kompetensi terbaik di berkas ini. |
| MAT.PAUD.BENTUK-DASAR.02 | 16 | LULUS | Dari bentuk abstrak ke benda nyata; jebakan benda dua-bentuk dihindari. |
| MAT.PAUD.WARNA-BENTUK.01 | 16 | LULUS | = golden. Memilah 1 ciri, benda beragam bentuk. |
| MAT.PAUD.WARNA-BENTUK.02 | 15 (K5 1) | LULUS | = golden. `refs: []` jujur, tetapi rubrik hanya memberi 2 untuk `[]` pada SENI/KARAKTER; kamus perlu dilengkapi (lihat PO). |

**Hasil: 7 LULUS, 4 REVISI.**

## Revisi yang diminta

### MAT.PAUD.BILANGAN-1-5.03
- Masalah (K1★ Teramati = 1): "Aku bisa langsung tahu ada 1, 2, atau 3 benda" — "tahu" adalah kata kerja mental. Yang bisa dicatat game adalah *apa yang anak lakukan* setelah benda disembunyikan, dan itu hanya ada di catatan, bukan di statement.
- Masalah (K4★ Dibuktikan game = 1): catatan menyuruh anak "memilih kotak angka". Anak 3–4 tahun belum tentu kenal lambang 1–3; pengenalan lambang baru datang di .04 dan .04 itu pengaya (`core: false`). Jadi kompetensi inti bergantung pada kemampuan pengaya yang tidak dijadikan prasyarat. Mekanik yang ditulis (`cari`, `pilah`) juga tidak menggambarkan "tampil sekejap lalu pilih"; itu tugas stimulus–jawaban, yaitu kuis berbungkus.
- Masalah (K6 Urutan = 1): kalau cara jawab tetap kotak angka, prasyaratnya harus .04; kalau tidak, cara jawab harus diganti.
- Usulan statement: *"Aku bisa menunjukkan berapa benda (1, 2, atau 3) yang tadi muncul sebentar, tanpa menghitung satu per satu"* / *"I can show how many objects (1, 2 or 3) just flashed by, without counting one by one"*.
- Usulan cara jawab tanpa lambang: anak mengangkat kartu jari / menyentuh piring yang berisi jumlah yang sama (jumlah ke jumlah), atau mengucapkan angkanya (`ucap`). Mekanik: `ucap` + `pilah`. Tetap pakai latency pendek sebagai pembeda subitising vs menghitung. Dengan ini prereq cukup .01 dan tidak perlu .04.
- Alternatif yang lebih "tanpa kuis": di `dagang`, pembeli mengacungkan 2 jari sekejap lalu menurunkan tangan; anak memberi 2 buah. Jumlah yang diberikan + waktu respons jadi bukti.

### MAT.PAUD.BILANGAN-1-5.04
- Masalah (K4★ Dibuktikan game = 1): catatan menyatakan "kartu angka selalu disertai titik-titik jumlahnya di PAUD". Kalau begitu anak dapat mencocokkan titik-ke-benda tanpa pernah melihat lambangnya, dan game tidak bisa membedakan keduanya. Yang terbukti adalah "mencocokkan jumlah dengan jumlah", bukan "dengan kartu angkanya" seperti bunyi statement. Statement dan bukti tidak sejalan.
- Masalah (K6 Urutan = 1): mencocokkan kelompok 4 benda dengan kartu "4" mengandaikan anak tahu kelompok itu "empat" sebagai keseluruhan (kardinalitas) — itu kompetensi .02, tetapi prereq hanya .01.
- Masalah (K5 Ref = 1): `EYFS ELG-MATH-NUMBER-01` ("deep understanding of numbers to 10, including composition") dipasang tanpa `note`; kaitannya dengan pengenalan lambang jauh. 1Ni.01 dengan catatan "hanya mencocokkan, belum menulis" sudah benar.
- Masalah (K8 Catatan = 1): tidak ada jebakan dan knob, padahal justru di sini knob-nya penting (titik ada → titik memudar → titik hilang).
- Usulan A (pertahankan maksud "lambang"): statement tetap, tetapi catatan diganti: *"Knob: 3 tahap — kartu bertitik; titik memudar setelah 2 benar berturut; kartu lambang saja. Kompetensi dicatat tercapai hanya pada tahap kartu lambang saja. Jebakan: kartu '3' dan '5' bertitik mirip bila titik disusun acak — susun titik seperti dadu."* Tambah prereq `MAT.PAUD.BILANGAN-1-5.02`. Ganti ref EYFS menjadi `[]` atau tambahkan note "hanya acuan umum; EYFS tidak punya butir lambang".
- Usulan B (jujur pada usia): ubah statement jadi *"Aku bisa mencocokkan kelompok 1 sampai 5 benda dengan kartu yang titiknya sama banyak"* / *"I can match a group of 1 to 5 objects to the card with the same number of dots"*, dan pindahkan pengenalan lambang murni ke TK A sebagai kompetensi inti. Saya cenderung ke B: ini pengaya, dan TK A adalah tempat lambang menurut tabel usia rubrik.

### MAT.PAUD.BANDING.01
- Masalah (K3★ Layak usia = 1): tabel usia rubrik menempatkan "membandingkan" di kolom TK A. Pada 3–4 tahun yang bisa dituntut adalah memilih yang *jelas* lebih banyak secara perseptual (3 vs 5). Statement "dua kelompok benda sampai 5" tanpa batas selisih mencakup 4 vs 5, dan catatan memang menurunkan knob ke selisih 1 — pada titik itu anak harus menghitung kedua kelompok lalu membandingkan kata bilangan; itu tuntutan TK A. Jebakan "benda lebih besar tapi lebih sedikit" juga sengaja melawan persepsi, yang justru belum stabil di usia ini (Piaget: konservasi jumlah belum ada).
- Masalah (K5 Ref = 1): `1Ss.03` adalah "describe data … more, less, most or least" dalam konteks statistik; yang cocok untuk membandingkan kuantitas adalah `1Np.03` ("Understand the relative size of quantities to compare and order numbers from 0 to 20"). ELG-MATH-PATTERNS-02 sudah tepat.
- Usulan statement: *"Aku bisa memilih kelompok yang jelas lebih banyak dari dua kelompok benda sampai 5"* / *"I can choose which of two groups of up to 5 objects clearly has more"*. Catatan: *"Selisih tetap ≥ 2 di PAUD (1 vs 3, 2 vs 4, 2 vs 5, 3 vs 5). Knob hanya tata letak (berjajar → acak) dan jenis benda, bukan selisih. Selisih 1 dan jebakan ukuran-vs-jumlah pindah ke MAT.TKA.BANDING.01."* Ref: ganti `1Ss.03` → `1Np.03`, note "pendahulu: membandingkan kuantitas; di PAUD dua kelompok ≤5 dengan selisih jelas".

### MAT.PAUD.BANDING.03
- Masalah (K3★ Layak usia = 1): mengurutkan tiga benda menurut panjang adalah seriasi. Seriasi, meski hanya 3 benda, menuntut anak memegang dua relasi sekaligus (lebih panjang dari A, lebih pendek dari C); itu tahap 5–6 tahun menurut Piaget dan di tabel rubrik bahkan "membandingkan" baru masuk TK A. Penulis sendiri mengakui "mengurutkan 3 lebih sulit daripada membandingkan 2". Status pengaya tidak mengubah kelayakan usia.
- Masalah (K6 Urutan = 1): prereq-nya BANDING.02 (besar/kecil), padahal yang dibutuhkan adalah "lebih panjang/pendek dari dua benda". Kompetensi itu tidak ada di berkas, padahal nama unit menyebut "panjang pendek". Terjadi lompatan dari *besar/kecil 2 benda* langsung ke *urutan 3 panjang*.
- Masalah (K8 Catatan = 1): tidak ada jebakan (mis. benda beda warna/tebal yang mengalihkan) dan tidak ada knob.
- Usulan: pecah menjadi dua.
  1. Pengganti di PAUD (inti): *"Aku bisa memilih benda yang lebih panjang atau lebih pendek dari dua benda sejenis"* / *"I can choose the longer or the shorter of two similar objects"*; prereq `[]`; ref `1Gg.02` (cocok: long/longer/short/shorter); mekanik `pilah`, `rawat` (ular panjang ke kandang panjang); catatan: benda sejajar di garis dasar sama, rasio ≥ 1,5, knob menurunkan rasio ke 1,25.
  2. Pindahkan "mengurutkan 3 benda pendek → panjang" ke TK A sebagai `MAT.TKA.BANDING.xx` dengan prereq kompetensi nomor 1 di atas. Kalau PO tetap ingin ada versi PAUD, batasi ke superlatif tunggal: *"Aku bisa menunjuk yang paling panjang dari 3 benda"* — itu masih satu relasi, bukan seriasi.

## Catatan urutan & prasyarat

- **Unit BILANGAN-1-5**: alur ideal 3–4 tahun adalah .01 menghitung → .02 kardinalitas → .03 subitising (jawab tanpa lambang) → .04 lambang (pengaya). Saat ini .03 diam-diam memakai lambang (perlu .04) dan .04 tidak memakai .02; keduanya dibahas di atas. Setelah revisi, prereq .03 = [.01], prereq .04 = [.02].
- **Unit BANDING**: nama unit menjanjikan tiga perbandingan (banyak–sedikit, besar–kecil, panjang–pendek) tetapi hanya dua yang punya kompetensi dasar; "panjang–pendek dua benda" hilang dan diganti langsung seriasi. Tambahkan kompetensi itu (usulan di BANDING.03).
- **Unit BANDING.01** bergantung pada BILANGAN-1-5.01 — benar, tetapi bila selisih dibatasi ≥ 2 (perseptual), prereq ini sebetulnya tidak wajib; boleh tetap dicantumkan.
- **Unit WARNA-BENTUK**: penomoran terbalik — .01 (memilah) berprasyarat .02 (menunjuk nama warna). Ini terbawa dari golden sehingga tidak saya jadikan alasan REVISI, tetapi pembaca kurikulum akan membaca .01 lebih dulu. Unit id-nya "WARNA-BENTUK" sementara nama unit "Warna dasar" dan isinya warna saja; bentuk ada di unit BENTUK-DASAR. Perlu konsistensi (lihat PO).
- **Lintas track**: `KODE.PAUD.POLA.01` memakai `MAT.PAUD.WARNA-BENTUK.02` sebagai prereq — konsisten dengan berkas ini.
- Tidak ada prasyarat melingkar. Tidak ada kompetensi yang menuntut membaca atau menulis angka (baik).

## Untuk diputuskan PO

1. **Tafsir tabel usia untuk "membandingkan"**: rubrik meletakkannya di TK A. Saya menafsirkan perbandingan *perseptual* dengan selisih jelas (BANDING.01 setelah revisi, BANDING.02) masih boleh di PAUD, dan perbandingan yang butuh menghitung (selisih 1) serta seriasi (BANDING.03) tidak. Kalau PO ingin tafsir lebih ketat, BANDING.02 juga harus turun; kalau lebih longgar, BANDING.01 bisa lulus dengan membatasi knob saja. Mohon ditegaskan di rubrik.
2. **Nasib lambang angka di PAUD** (BILANGAN-1-5.04): pilih usulan A (lambang dengan knob titik memudar) atau B (titik saja di PAUD, lambang di TK A). Ini keputusan jenjang, bukan peninjau.
3. **Kamus kerangka kurang** untuk: pengenalan nama warna (WARNA-BENTUK.02 `refs: []`), besar/kecil (BANDING.02 terpaksa memakai 1Gg.02 yang isinya panjang), dan pengenalan lambang di usia dini. EYFS *Development Matters* (3- and 4-year-olds: "Link numerals and amounts up to 5", "Compare quantities using 'more than', 'fewer than'", "Make comparisons between objects relating to size, length…") akan menutup ketiganya, tetapi dokumen itu non-statutory dan belum ada di `content/kerangka`. Mohon diputuskan apakah boleh ditambahkan sebagai framework ke-5.
4. **Rubrik K5 untuk `[]` di track MAT/KODE**: rubrik hanya memberi skor 2 untuk `[]` pada SENI/KARAKTER. Golden set sendiri memakai `[]` di MAT. Mohon rubrik atau golden diselaraskan.
5. **Nama unit WARNA-BENTUK** vs isi (warna saja) dan penomoran terbalik .01/.02 — ada di golden, jadi perubahan harus lewat PO.

## Tindak lanjut penulis — 24 Okt 2026

Diterapkan:
- BILANGAN-1-5.03 → jumlah-ke-jumlah tanpa lambang (pembeli acungkan jari sekejap), prereq .02, mekanik dagang/cari.
- BILANGAN-1-5.04 → kartu angka selalu bertitik di PAUD; lambang murni jadi kompetensi terpisah di TK A. Prereq .02, note ref diisi.
- BANDING.01 → "jelas lebih banyak", selisih tetap ≥ 2; ref 1Ss.03 diganti 1Np.03. Selisih 1 ke TK A.
- BANDING.03 → diganti "lebih panjang/pendek dari dua benda" (inti, ref 1Gg.02). Seriasi 3 benda ke TK A.
- BANDING.02 → note ref 1Gg.02 diluruskan (bicara panjang, pendahulu terdekat).
- WARNA-BENTUK → unit WARNA; penomoran dibalik mengikuti perkembangan (.01 tunjuk warna, .02 kelompokkan). Golden set dan paket ikut diubah.

Menunggu keputusan PO: tafsir "membandingkan" di rubrik; penambahan EYFS Development Matters ke kamus; rubrik K5 untuk `refs: []` di MAT.
