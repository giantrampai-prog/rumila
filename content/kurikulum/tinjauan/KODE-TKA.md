# Tinjauan KODE-TKA.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky; skeptis pada tuntutan yang terlalu cepat). Konteks usia TK A = 4–5 tahun.
Validator: bersih (0 error; 15 peringatan di seluruh folder, 2 menyangkut berkas ini):

```
kamus kerangka: 117 kode
✓ content/kurikulum/KODE-TKA.json: 11 kompetensi
! KODE.TKA.DEBUG.01: tidak ada kode acuan kerangka internasional
! KODE.TKA.KALAU.01: tidak ada kode acuan kerangka internasional
71 kompetensi, 0 error, 15 peringatan
```

Pembanding: golden set memuat KODE.PAUD.URUTAN.01/.02 dan KODE.PAUD.PERINTAH.01; ketiganya adalah prasyarat langsung berkas ini dan dipakai sebagai batas bawah mutu (struktur catatan: aksi teramati, umpan balik, jebakan, knob). Golden juga memakai `CAMBRIDGE_EY 2Mn.04` untuk menyusun gambar dan `CAMBRIDGE_PRIMARY_COMPUTING 2CT.06` (dengan note "pendahulu") untuk perintah maju; saya mengikuti pola itu untuk K5.

Tafsir K5 untuk track KODE (sementara, menunggu PO): `refs: []` dengan penjelasan jujur di `catatan` = 2. Kode yang maknanya cocok = 2 walau stage lebih tinggi, asal note menyebut "pendahulu". Kode yang hanya mirip maknanya = 1.

Pemeriksaan makna kode yang dirujuk (kamus `content/kerangka`):
- `CAMBRIDGE_EY 2Mn.04` (EY2, 4–5 th): "Use ordinal numbers from 1st to 10th in practical contexts, for example, to talk about a sequence of events or activities" — cocok untuk URUTAN.01/.02.
- `CAMBRIDGE_EY 2Ms.09` (EY2): "Copy and create simple repeating patterns of repeating units (e.g. [red, blue, yellow] …) and say what would come next" — cocok untuk POLA-ABC.01/.03 (unit tiga disebut eksplisit).
- `CAMBRIDGE_EY 3Ms.09` (EY3, 5–6 th): "identifying errors in patterns of colour, shape or size" — cocok untuk POLA-ABC.02; satu stage di atas, tetapi rubrik memang mengizinkan debugging 1 langkah di TK A.
- `CAMBRIDGE_PRIMARY_COMPUTING 2CT.06` (Stage 2, 6–7 th): "develop precise sets of instructions to complete simple tasks" — makna cocok untuk menyusun program maju/belok; dua stage di atas, note "pendahulu" jujur.
- `CAMBRIDGE_PRIMARY_COMPUTING 2P.02` (Stage 2): "Know how to recreate algorithms as programs" — hanya mirip: anak di NAVIGASI.03 tidak diberi algoritma untuk disalin menjadi program; ia merancang keduanya sekaligus.
- `CAMBRIDGE_PRIMARY_MATHS 1Gp.01` (Stage 1, 5–6 th): "Use familiar language to describe position and direction" — hanya mirip untuk NAVIGASI.02: anak memilih perintah belok, bukan mendeskripsikan arah dengan bahasa.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| KODE.TKA.URUTAN.01 | 16 | LULUS | 4–5 gambar, animasi sebagai umpan balik, jebakan pasangan yang bisa bertukar, knob jelas. Setara golden. |
| KODE.TKA.URUTAN.02 | 14 (K4 1, K8 1) | REVISI | Menempel label suara "pertama/lalu/terakhir" pada gambar = soal mencocokkan dengan drag; tidak ada akibat dalam game yang membuktikan anak memahami kata itu. Catatan tanpa bukti, jebakan, knob. |
| KODE.TKA.NAVIGASI.01 | 16 | LULUS | Program disusun di rak lalu dijalankan (beda jelas dari eksekusi langsung PAUD). Bukti "tepat sampai, tidak kurang tidak lewat". |
| KODE.TKA.NAVIGASI.02 | 15 (K5 1) | LULUS | Belok kiri/kanan relatif robot, tampilan dari belakang; jebakan "Robot menghadap bawah" dihindari. 1Gp.01 hanya mirip (describe vs memberi perintah). |
| KODE.TKA.NAVIGASI.03 | 15 (K5 1) | LULUS | Maju+belok ≤5 perintah, grid 3×3, satu belokan; efisiensi dicatat tetapi bukan syarat — tepat untuk 4–5 th. 2P.02 hanya mirip. |
| KODE.TKA.POLA-ABC.01 | 16 | LULUS | ABCABC + 2–3 slot kosong, distraktor ketiga wajib, jebakan "anak melanjutkan AB". Prereq AB dan bentuk lengkap. |
| KODE.TKA.POLA-ABC.02 | 16 | LULUS | Memperbaiki satu unsur salah dalam 8 unsur; dinilai dari hasil akhir. Catatan: "satu tertukar" perlu ditegaskan = satu unsur diganti, bukan dua unsur bertukar tempat (itu dua kesalahan). |
| KODE.TKA.POLA-ABC.03 | 15 (K8 1) | LULUS | Cipta ABC dari 3 benda pilihan; aturan benar jelas. Catatan tanpa jebakan (anak hanya memakai 2 dari 3 benda → pola AB; atau ABB yang sah menurut 2Ms.09 tetapi bukan ABC) dan tanpa knob (jumlah slot). |
| KODE.TKA.DEBUG.01 | 15 (K8 1) | LULUS | Debugging 1 langkah pada urutan gambar; `refs: []` dengan alasan jujur (1CT.02 belum terverifikasi). Bukti kurang tegas dibanding DEBUG.02: tidak disebut "tepat satu pertukaran", sehingga anak yang menyusun ulang semua gambar ikut lolos. |
| KODE.TKA.DEBUG.02 | 15 (K5 1) | LULUS | Program 3–5 perintah, satu salah; bukti "mengubah tepat satu perintah" — ini contoh bukti yang baik. 2CT.06 untuk debugging hanya mirip; tidak konsisten dengan DEBUG.01 yang jujur memakai `[]`. |
| KODE.TKA.KALAU.01 | 14 (K4 1, K8 1) | REVISI | Benih kondisi tanpa blok "kalau" — layak TK A. Tetapi mekanik tidak membuktikan "maju untuk petak kosong": bila lompat di petak kosong tidak berakibat apa-apa, strategi "lompat di semua petak" lolos. Catatan tidak menetapkan akibat lompat salah tempat, tanpa jebakan dan knob. |

**Hasil: 9 LULUS, 2 REVISI** (URUTAN.02 pengaya, KALAU.01 inti). Keduanya perbaikan mekanik/catatan, bukan perombakan isi.

## Revisi yang diminta

### KODE.TKA.URUTAN.02
- Masalah (K4★ Dibuktikan game = 1): catatan: "kata dibacakan dan ditempel sebagai label suara". Anak menyeret tiga keping suara ke gambar yang sudah ia susun; game mencocokkan posisi. Itu soal mencocokkan berbungkus drag — rubrik K4: "mekanik mungkin tapi lemah". Tidak ada akibat dalam dunia game yang hanya terjadi bila anak memang memahami "pertama/lalu/terakhir"; bandingkan URUTAN.01 yang hasilnya dimainkan sebagai animasi sehingga kesalahan terlihat sendiri.
- Masalah (K8 Catatan = 1): tidak ada bukti yang dicatat, jebakan, atau knob. Dengan 4–5 gambar ada 2–3 keping "lalu" — catatan tidak menyebut bagaimana keping "lalu" disediakan (satu keping yang bisa dipakai berulang, atau tiga keping?).
- Usulan (mekanik): jadikan label fungsional — label menggerakkan narasi. Setelah anak menempel, tokoh menceritakan urutan memakai kata yang dipilih dan animasi berjalan mengikuti label: adegan "pertama" dimainkan dulu, adegan "terakhir" menutup cerita. Bila "terakhir" ditempel pada gambar ke-2, cerita berhenti di sana dan gambar sisanya meredup; anak melihat ceritanya terpotong dan memperbaiki. Bukti: narasi utuh sampai gambar terakhir pada percobaan ≤ 2. Jebakan: anak menempel "pertama" pada gambar yang paling ia suka, bukan yang paling awal — variasikan gambar awal yang tidak mencolok. Knob: 3 → 5 gambar; keping "lalu" satu yang bisa diulang → beberapa keping.
- Usulan statement (tetap satu kemampuan, menyebut akibat yang teramati): *"Aku bisa menempel kata pertama, lalu, dan terakhir pada gambar supaya tokoh menceritakan urutannya dengan benar"* / *"I can put the words first, then, and last on the pictures so the character tells the sequence correctly"*.
- Ref 2Mn.04 sudah tepat (EY2, bahasa ordinal dalam urutan kejadian); tidak perlu diubah.

### KODE.TKA.KALAU.01
- Masalah (K4★ Dibuktikan game = 1): statement menuntut dua pilihan yang benar — "lompat untuk petak berbatu **dan** maju untuk petak kosong". Mekanik yang dicatat hanya membuktikan bagian pertama: bila lompat di petak kosong membuat robot mendarat biasa saja (sesuai umpan balik ramah di PAUD.PERINTAH.02), anak yang mengisi rak dengan lompat semua tetap sampai di bintang. Game tidak bisa membedakan anak yang memilih perintah sesuai keadaan dari anak yang memakai satu perintah untuk semua. Rubrik K4: mekanik "mungkin tapi lemah".
- Masalah (K8 Catatan = 1): tidak ada jebakan dan knob eksplisit; "jalur lurus 4–5 petak, 1–2 batu" adalah spesifikasi, bukan knob yang disebut sebagai knob. Jebakan yang pasti muncul: anak menghitung petak termasuk petak awal robot sehingga lompat meleset satu petak (jebakan yang sama ditulis penulis di TKB.ULANGI.02; di sini justru hilang).
- Usulan (mekanik, pilih salah satu dan tulis di catatan):
  - A. Lompat di petak kosong berakibat: robot mendarat terlalu jauh (melompati dua petak) sehingga melewati bintang atau menabrak; dengan begitu "lompat semua" gagal dan bukti = sampai bintang.
  - B. Lompat tidak berakibat, tetapi bukti dihitung: jumlah blok lompat dalam program = jumlah batu, dan tiap lompat berada tepat pada posisi batu. Mengganti lebih dari jumlah batu dicatat sebagai belum.
- Usulan catatan: *"Benih kondisi tanpa blok 'kalau': batu terlihat sebelum program disusun; anak menaruh lompat pada posisi yang tepat. Lompat di petak kosong membuat robot melompati dua petak (A), jadi 'lompat semua' tidak lolos. Bukti: sampai bintang dengan jumlah lompat = jumlah batu. Jebakan: anak menghitung petak awal robot sebagai langkah pertama — tandai petak awal dengan warna lain. Knob: panjang 4 → 5 petak, batu 1 → 2, batu di petak ke-2 (mudah) → petak ke-4 (harus menghitung). Blok 'kalau ada batu' baru di TK B."*
- Statement tidak perlu berubah; en sudah setara.

## Catatan urutan & prasyarat

- **URUTAN**: PAUD.URUTAN.02 (3 gambar) → TKA.URUTAN.01 (4–5 gambar) → .02 (bahasa urutan). Rantai benar, tidak melompat.
- **DEBUG.01** berprasyarat URUTAN.01 (4–5 gambar) padahal ia sendiri memakai 3–4 gambar. Prasyarat yang lebih tepat dan membuka debugging lebih awal dalam tahun ajaran: `KODE.PAUD.URUTAN.02` (3 gambar). Tidak menggagalkan, tetapi mengubah jadwal.
- **NAVIGASI**: .01 (maju, disusun dulu) → .02 (belok) → .03 (gabungan, grid 3×3) → DEBUG.02. Rantai benar. KALAU.01 cabang paralel dari NAVIGASI.01 + PAUD.PERINTAH.02 — tepat, tidak butuh belok.
- **Kiri/kanan**: NAVIGASI.02 adalah tempat pertama kiri/kanan dituntut di seluruh kurikulum; tidak ada kompetensi MAT-TKA (BENTUK-RUANG hanya bola/kubus/tabung) atau DUNIA tentang kiri/kanan tubuh sendiri. Penulis menyiasati dengan tampilan robot dari belakang — cukup untuk 4–5 th. Tetapi bila kelak ada kompetensi "kiri/kanan tubuhku", ia harus menjadi prasyarat di sini (lihat PO).
- **POLA-ABC**: PAUD.POLA.01 + MAT.PAUD.BENTUK-DASAR.01 → .01 → .02; .01 + PAUD.POLA.02 (cipta AB) → .03. Lengkap. .02 memakai kode EY3 — satu stage di atas; dapat diterima karena rubrik mengizinkan debugging 1 langkah di TK A, tetapi .02 sebaiknya dimainkan di paruh kedua tahun.
- **Konsistensi ref dalam unit DEBUG**: .01 memakai `[]` dengan alasan jujur, .02 memakai 2CT.06 "pendahulu" untuk hal yang sama (memperbaiki satu kesalahan). Samakan: `[]` untuk keduanya, atau keduanya menunjuk 1CT.02 begitu terverifikasi.
- **2P.02** dipakai di NAVIGASI.03 (dan diulang di TKB.PROGRAM-5-8.01) tetapi maknanya "recreate algorithms as programs" — menyalin algoritma yang diberikan menjadi program. Tidak ada kompetensi TK A/TK B yang melakukan itu. Lepaskan dari NAVIGASI.03, atau buat kompetensi yang benar-benar cocok (lihat PO).
- Tidak ada prasyarat melingkar. Tidak ada kompetensi yang menuntut membaca, tambah-kurang simbolik, atau perulangan. 8 inti + 3 pengaya.

## Untuk diputuskan PO

1. **Kamus Cambridge Primary Computing**: 4 kode terverifikasi, semua Stage 1–2, tanpa kode debugging/kondisi. Dua kompetensi berkas ini memakai `[]` (DEBUG.01, KALAU.01) dan tiga memakai 2CT.06 sebagai "pendahulu" dua stage di atas. Tafsir sementara (`[]` + catatan jujur = 2) saya pakai; mohon dikunci di rubrik K5 (tambahkan "KODE" di samping SENI/KARAKTER) atau dibatalkan setelah framework 0059 diunduh dari support site.
2. **2P.02 "recreate algorithms as programs"**: kode ini terverifikasi tetapi belum ada kompetensi yang cocok maknanya. Usul kompetensi baru TK B (bukan TK A): anak diberi algoritma berupa 4–6 gambar langkah robot, lalu menyusunnya menjadi blok — itu yang dimaksud 2P.02. Kalau tidak diinginkan, lepaskan 2P.02 dari NAVIGASI.03 dan PROGRAM-5-8.01.
3. **Kiri/kanan tubuh sendiri** belum punya rumah (MAT? DUNIA?). NAVIGASI.02 memakainya dengan mitigasi visual. Putuskan apakah perlu kompetensi prasyarat tersendiri.
4. **Semantik "lompat" seluruh game**: PAUD.PERINTAH.02, TKA.KALAU.01, dan TKB.KONDISI.01 bergantung pada satu aturan — lompat selalu maju satu petak? Apa akibat lompat di petak kosong? Keputusan ini menentukan apakah KALAU.01 dan KONDISI.01 bisa dibuktikan; sebaiknya ditetapkan sekali di dokumen desain mekanik `navigasi`, bukan per kompetensi.
5. **Label kata tanpa membaca** (URUTAN.02 di sini, DEKOMPOSISI.02 di TK B): tegaskan prinsip desain bahwa semua label kata di TK A/TK B berupa ikon + suara, karena rubrik melarang membaca kalimat di TK A dan tidak mengizinkannya di TK B.

## Tindak lanjut penulis — 24 Okt 2026

Diterapkan:
- URUTAN.02 → label (ikon + suara) menggerakkan narasi robot; statement, bukti, jebakan, knob diperbarui.
- KALAU.01 → semantik lompat = 2 petak dikunci di `docs/akademi/mekanik-navigasi.md`; bukti = sampai bintang dan jumlah lompat = jumlah batu; jebakan & knob ditambah.
- DEBUG.01 → prereq ke KODE.PAUD.URUTAN.02; bukti "tepat satu pertukaran"; knob. DEBUG.02 → refs dikosongkan agar konsisten (2CT.06 bukan debugging).
- NAVIGASI.03 → 2P.02 dilepas. NAVIGASI.02 → note 1Gp.01 diluruskan sebagai pendahulu terdekat.
- POLA-ABC.03 → jebakan & knob.

Menunggu PO: rumah untuk kiri/kanan tubuh (MAT/DUNIA); kompetensi baru untuk 2P.02 (menyalin algoritma bergambar).
