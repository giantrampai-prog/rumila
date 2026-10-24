# Tinjauan MAT-TKA.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky). Konteks usia TK A = 4–5 tahun.
Validator: bersih (0 error, 15 peringatan — tidak ada yang menyangkut berkas ini):

```
kamus kerangka: 117 kode
✓ content/kurikulum/MAT-TKA.json: 13 kompetensi
71 kompetensi, 0 error, 15 peringatan
```

Pembanding: golden set hanya berisi PAUD. BILANGAN-1-10.01 dan .02 adalah kelanjutan langsung golden (struktur, catatan, knob setara) dan tidak lebih buruk darinya. Prasyarat ke MAT-PAUD dicek ada dan maknanya cocok (tidak ditinjau ulang). Pemeriksaan programatik 71 kompetensi: tidak ada prasyarat hilang, tidak ada siklus.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| MAT.TKA.BILANGAN-1-10.01 | 16 | LULUS | Lanjutan golden; benda tersebar, redup setelah disentuh, knob 6–10. |
| MAT.TKA.BILANGAN-1-10.02 | 16 | LULUS | Kardinalitas sampai 10 lewat pesanan suara; jebakan "ambil semua". |
| MAT.TKA.BILANGAN-1-10.03 | 14 (K5 1, K8 1) | LULUS | Lambang murni, tepat di TK A. Ref EYFS NUMBER-01 tanpa note tidak bicara lambang. Catatan menyebut "kartu pilihan" tanpa aksi dunia-game; harus ditulis sebagai pilah ke rak berlabel supaya tidak diimplementasikan sebagai kuis. |
| MAT.TKA.BILANGAN-1-10.04 | 16 | LULUS | Menelusuri (bukan menulis), toleransi ±25%, pengaya. Sesuai batas "TK A belum menulis rapi". |
| MAT.TKA.BANDING.01 | 16 | LULUS | Selisih 1 sampai 10 = tuntutan TK A yang tepat; strategi dicatat lewat latency. |
| MAT.TKA.BANDING.02 | 16 | LULUS | Seriasi 3 benda, dipindah dari PAUD sesuai tinjauan sebelumnya; beda panjang ≥20%. |
| MAT.TKA.BANDING.03 | 15 (K8 1) | LULUS | Timbangan jungkat-jungkit = umpan balik fisik. Catatan tanpa knob eksplisit dan tanpa beda dengan UKUR-CM.02 (TK B) yang juga memakai timbangan. |
| MAT.TKA.BENTUK-RUANG.01 | 15 (K5 1) | LULUS | Benda nyata berputar pelan, bagus. Ref 1Gg.06 (membedakan 2D vs 3D) tidak dilakukan anak; 2Gg.08 lebih cocok. |
| MAT.TKA.BENTUK-RUANG.02 | 15 (K8 1) | LULUS | Bukti menara 4 tingkat berdiri; tabung tegak sebagai penemuan. Tidak ada knob. |
| MAT.TKA.UKUR-NONSTANDAR.01 | 13 (K3 1, K5 1, K6 1) | REVISI | 10 jengkal tanpa celah/tumpang tindih di usia 4–5 terlalu cepat (Cambridge: satuan tak baku = Stage 2); ref 2Gg.03 yang persis ada di kamus tidak dipakai; prasyarat konsep panjang (PAUD.BANDING.03) hilang. |
| MAT.TKA.UKUR-NONSTANDAR.02 | 12 (K3 1, K4 1, K5 1, K8 1) | REVISI | Perbandingan tak langsung (transitif) lewat bilangan jengkal terlalu cepat untuk 4–5; game tidak memaksa anak mengukur dulu sehingga bisa dijawab dengan mengira-ngira; catatan tanpa jebakan/knob. |
| MAT.TKA.UANG-KENAL.01 | 16 | LULUS | Pengenalan visual pecahan, belum nilai; keputusan "Rp1.000 koin saja" ditulis jelas. |
| MAT.TKA.UANG-KENAL.02 | 15 (K7 1) | LULUS | Harga "3 koin" bergambar = kardinalitas berkulit uang, layak TK A. `en` "one-thousand coins" bisa dibaca "seribu koin"; ganti "Rp1,000 coins". |

**Hasil: 11 LULUS, 2 REVISI.**

## Revisi yang diminta

### MAT.TKA.UKUR-NONSTANDAR.01
- Masalah (K3★ Layak usia = 1): mengukur dengan satuan tak baku menuntut anak (a) meletakkan satuan berulang tanpa celah dan tanpa tumpang tindih, (b) menjaga jejak satuan yang sudah dipakai, (c) menghitungnya, sampai 10. Pada 4–5 tahun koordinasi (a)+(b) sampai 10 ulangan belum stabil; yang lazim di usia ini adalah membandingkan panjang secara langsung (BANDING.02). Acuan kamus menegaskan: Cambridge menaruh "estimate and measure lengths using non-standard or standard units" di **2Gg.03 (Stage 2, 6–7 tahun)**; Stage 1 hanya bahasa panjang (1Gg.02). Tabel usia rubrik tidak menyebut pengukuran sama sekali, jadi tidak ada dasar untuk meloloskannya sebagai inti TK A. "Sedikit terlalu cepat", bukan "jelas tidak sesuai", karena versi pendek (3–5 jengkal) masih masuk akal.
- Masalah (K5 Ref = 1): `1Gg.08` adalah "explore instruments that have **numbered scales**" — jengkal bukan alat berskala; kodenya hanya mirip. `1Gg.02` dipasang tanpa note. Kamus punya kode yang persis: `2Gg.03`.
- Masalah (K6 Urutan = 1): prasyarat hanya BILANGAN-1-10.01. Mengukur panjang mengandaikan anak sudah punya konsep "panjang" sebagai besaran yang dibandingkan — itu `MAT.PAUD.BANDING.03` (lebih panjang/pendek dua benda), dan belum dicantumkan.
- Usulan (pilih A, B, atau keduanya):
  - **A — tetap di TK A sebagai pengaya, dibatasi**: statement *"Aku bisa mengukur panjang benda dengan jengkal Agam, sampai 5 jengkal"* / *"I can measure how long something is in Agam's hand spans, up to 5 spans"*; `core: false`; prereq `["MAT.TKA.BILANGAN-1-10.01", "MAT.PAUD.BANDING.03"]`; refs `2Gg.03` note "pendahulu Stage 2: mengukur dengan satuan tak baku; di TK A ≤5 jengkal" + `1Gg.02` note "bahasa panjang". Catatan: jengkal **menempel otomatis** (snap) ke ujung jengkal sebelumnya sehingga yang diuji adalah iterasi satuan dan menghitung, bukan motorik; celah/tumpang tindih baru jadi knob.
  - **B — versi 10 jengkal tanpa snap pindah ke TK B** sebagai `MAT.TKB.UKUR-NONSTANDAR.01` (inti), menjadi prasyarat `MAT.TKB.UKUR-CM.01` menggantikan rujukan ke TK A. Ini sejalan dengan Cambridge dan menutup lompatan yang saya catat di tinjauan MAT-TKB (dari jengkal langsung ke cm).

### MAT.TKA.UKUR-NONSTANDAR.02
- Masalah (K3★ Layak usia = 1): memilih yang lebih panjang dari dua benda yang **tidak bisa disandingkan** dengan membandingkan bilangan jengkal adalah perbandingan tak langsung (A diukur 7, B diukur 9, maka B lebih panjang) — penalaran transitif yang menurut Piaget stabil pada tahap operasional konkret (6–7 tahun). Untuk 4–5 tahun ini "sedikit terlalu cepat", status pengaya tidak mengubahnya.
- Masalah (K4★ Dibuktikan game = 1): mekanik `simulasi`, `pilah` dan catatan tidak memaksa anak mengukur. Dua benda "satu tegak, satu miring" tetap bisa dikira-kira dengan mata; anak yang memilih benar tanpa pernah menaruh jengkal akan dicatat lulus. Bukti tidak membedakan "membandingkan lewat jengkal" dari "menebak".
- Masalah (K5 Ref = 1): `1Gg.02` tanpa note; kode yang persis untuk inti kompetensi ini adalah `2Gg.03` (lihat .01).
- Masalah (K8 Catatan = 1): dua kalimat, tanpa jebakan dan tanpa knob.
- Usulan: **gabungkan ke .01 sebagai knob** ("setelah 3 sukses, dua benda ditaruh berjauhan dan anak diminta mengukur keduanya") dan hapus kompetensi ini dari TK A; atau pindahkan ke TK B bersama .01 (usulan B) dengan desain yang memaksa mengukur: *"Aku bisa memilih benda yang lebih panjang dari dua benda di tempat berbeda dengan mengukur jengkal masing-masing"* / *"I can choose the longer of two objects in different places by measuring each one in hand spans"*; dua benda berada di ruangan berbeda (tidak bisa disandingkan), tiap hasil ukur tercatat di kartu, tombol pilih baru aktif setelah kedua benda terukur. Bukti: kedua pengukuran benar dan pilihan benar. Jebakan: benda yang tampak lebih panjang karena lebih tebal. Knob: selisih jengkal 3 → 1.

## Catatan urutan & prasyarat

- **Unit BILANGAN-1-10**: alur .01 menghitung → .02 kardinalitas → .03 lambang → .04 menelusuri sudah benar dan tidak melompat. .03 adalah tempat yang tepat untuk lambang murni (sesuai keputusan tinjauan MAT-PAUD). Catatan .03 harus menyebut mekaniknya secara konkret — misalnya *rak berlabel angka 1–10, anak menaruh keranjang berisi N buah ke rak N* (pilah) atau *pembeli menyodorkan kartu pesanan berangka tanpa suara, anak mengambil sebanyak itu* (dagang) — supaya "jumlah kartu pilihan 2 → 4" tidak dibaca pengembang sebagai pilihan ganda.
- **Unit BANDING**: .01 selisih 1 (butuh menghitung dua kelompok) dan .02 seriasi 3 benda tepat dipindah dari PAUD; prasyaratnya ke PAUD.BANDING.01/.03 ada dan cocok. .03 (berat) berprasyarat `[]`; boleh, tetapi `MAT.PAUD.BANDING.02` (bahasa "lebih …" untuk dua benda) layak dicantumkan. Catatan .03 perlu menyebut bedanya dengan `MAT.TKB.UKUR-CM.02` yang juga memakai timbangan (di sini membaca sisi yang turun; di TK B memilih alat).
- **Unit BENTUK-RUANG**: .01 → .02 benar; prasyarat ke PAUD.BENTUK-DASAR.01 (bentuk datar) cocok karena catatan .01 sengaja membedakan bentuk ruang dari bentuk datar.
- **Unit UKUR-NONSTANDAR**: konsep panjang (PAUD.BANDING.03) hilang dari prasyarat .01; .02 melompat ke perbandingan transitif. Bila .01 pindah ke TK B, rantai `MAT.TKB.UKUR-CM.01 → MAT.TKA.UKUR-NONSTANDAR.01` harus diperbarui.
- **Unit UANG-KENAL**: .02 secara struktur adalah BILANGAN-1-10.02 (ambil sebanyak angka) berkulit koin — benar sebagai jembatan ke uang TK B, tetapi catatan belum menulis "beda dengan tetangga" itu. Lompatan besar justru terjadi setelahnya, di TK B (dari "3 koin" ke "Rp7.000" campur pecahan); dibahas di tinjauan MAT-TKB.
- **Lintas track**: `KODE.TKB.ULANGI.02` memakai `MAT.TKA.BILANGAN-1-10.02` sebagai prasyarat — ada dan cocok (memilih berapa kali ulangi = kardinalitas).
- Tidak ada prasyarat hilang atau melingkar. Tidak ada kompetensi yang menuntut membaca kalimat, tambah-kurang simbolik, atau perulangan (batas "belum boleh" TK A terjaga).

## Untuk diputuskan PO

1. **Pengukuran tidak ada di tabel usia rubrik.** Saya menilai dengan acuan Cambridge (satuan tak baku dan baku = Stage 2, 6–7 tahun) dan menurunkan K3 untuk UKUR-NONSTANDAR.01/.02. Mohon rubrik ditambah baris: TK A = membandingkan langsung panjang/berat 2–3 benda; TK B = satuan tak baku ≤10 (jengkal, kubus satuan); SD 1 = penggaris cm. Bila PO memutuskan lain, putusan kedua kompetensi itu perlu ditinjau ulang, tetapi K5 dan K6 tetap gagal.
2. **Keputusan jenjang untuk jengkal**: usulan A (TK A pengaya ≤5, snap) dan/atau B (TK B inti ≤10). Ini memengaruhi MAT-TKB.UKUR-CM.01.
3. **Rp1.000 koin saja** (keputusan di UANG-KENAL.01) perlu ditetapkan proyek-wide; MAT-TKB.UANG-10RB.01 `en` menyebut "1,000 … notes".
4. **Kamus**: untuk benda nyata berbentuk ruang, `2Gg.08` ("Identify 2D and 3D shapes in familiar objects", Stage 2) lebih cocok daripada `1Gg.06` di BENTUK-RUANG.01. Mohon ditegaskan bahwa kode Stage 2 boleh dipakai sebagai "pendahulu" dengan note (sudah lazim di berkas ini untuk Stage 1).
5. **Mekanik `ucap` dan konvensi "bukan kuis"**: beberapa catatan di TK A/TK B menulis "memilih kartu" sebagai cara anak menjawab. Mohon ditetapkan di skill penulis kurikulum: jawaban berupa bilangan ditangkap lewat `ucap`, produksi jumlah (ambil N benda), atau pilah ke rak berlabel — bukan 3–4 kartu pilihan.
