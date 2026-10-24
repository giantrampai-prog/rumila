# Tinjauan KODE-TKB.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky; skeptis pada tuntutan yang terlalu cepat). Konteks usia TK B = 5–6 tahun.
Validator: bersih (0 error; 15 peringatan di seluruh folder, 9 menyangkut berkas ini):

```
kamus kerangka: 117 kode
✓ content/kurikulum/KODE-TKB.json: 11 kompetensi
! KODE.TKB.ULANGI.01: tidak ada kode acuan kerangka internasional
! KODE.TKB.ULANGI.02: tidak ada kode acuan kerangka internasional
! KODE.TKB.ULANGI.03: tidak ada kode acuan kerangka internasional
! KODE.TKB.PROGRAM-5-8.02: tidak ada kode acuan kerangka internasional
! KODE.TKB.DEBUG-BANYAK.01: tidak ada kode acuan kerangka internasional
! KODE.TKB.DEBUG-BANYAK.02: tidak ada kode acuan kerangka internasional
! KODE.TKB.KONDISI.01: tidak ada kode acuan kerangka internasional
! KODE.TKB.KONDISI.02: tidak ada kode acuan kerangka internasional
! KODE.TKB.DEKOMPOSISI.01: tidak ada kode acuan kerangka internasional
! KODE.TKB.DEKOMPOSISI.02: tidak ada kode acuan kerangka internasional
71 kompetensi, 0 error, 15 peringatan
```

Pembanding: golden set (PAUD) dipakai sebagai batas bawah struktur catatan (aksi teramati, umpan balik, jebakan, knob). 10 dari 11 kompetensi memakai `refs: []`; semuanya menyertakan alasan jujur di `catatan` (kamus Computing 0059 belum punya kode perulangan/kondisi/debugging/dekomposisi terverifikasi), sehingga K5 = 2 menurut tafsir sementara. Satu-satunya kompetensi dengan ref, PROGRAM-5-8.01, memakai `2CT.06` (cocok: "develop precise sets of instructions to complete simple tasks", Stage 2 satu tahun di atas TK B) dan `2P.02` (hanya mirip: "recreate algorithms as programs" — anak tidak diberi algoritma untuk disalin).

Prasyarat lintas berkas yang diperiksa: `KODE.TKA.NAVIGASI.03`, `KODE.TKA.DEBUG.02`, `KODE.TKA.KALAU.01`, `KODE.TKA.URUTAN.01` (ditinjau di KODE-TKA.md), `MAT.TKA.BILANGAN-1-10.02` ("mengambil benda sebanyak angka yang diminta, sampai 10").

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| KODE.TKB.ULANGI.01 | 15 (K8 1) | LULUS | Perkenalan perulangan dengan paksaan mekanik yang bagus (rak 2 blok, jalur 3 maju). Catatan: knob "3 → 5 ulangan" bertentangan dengan statement "ulangi 3 kali" dan dengan .02 yang memang mengajarkan memilih jumlah; tanpa jebakan (maju ditaruh di luar blok ulangi). |
| KODE.TKB.ULANGI.02 | 15 (K6 1) | LULUS | Memilih jumlah ulangan 2–6 supaya tepat di bintang; jebakan "menghitung petak awal" tepat. Bila angka ulangan tampil sebagai lambang bilangan, prasyarat yang hilang adalah `MAT.TKA.BILANGAN-1-10.03` (kartu angka tanpa titik), bukan hanya .02 (kardinalitas). |
| KODE.TKB.ULANGI.03 | 14 (K6 1, K8 1) | LULUS | Menulis ulang "maju maju belok ×2" dengan ulangi; bukti "jalur sama, blok lebih sedikit" terukur. Batas atas TK B (mengenali unit berulang 3 perintah) — prasyarat alami `KODE.TKA.POLA-ABC.01` tidak dicantumkan. Catatan tanpa jebakan/knob. Pengaya. |
| KODE.TKB.PROGRAM-5-8.01 | 15 (K5 1) | LULUS | 5–8 perintah, dua belokan, dinding; disusun penuh sebelum jalan. Jebakan dan knob jelas. 2P.02 hanya mirip. |
| KODE.TKB.PROGRAM-5-8.02 | 14 (K3 1, K8 1) | REVISI | Menunjuk petak robot setelah tiap perintah *sebelum program dijalankan* = menelusuri 5 perintah termasuk belokan di kepala; penulis sendiri menulis "menjadi inti di SD 1". Terlalu cepat untuk 5–6 th bila orientasi harus dipegang mental. |
| KODE.TKB.DEBUG-BANYAK.01 | 15 (K8 1) | LULUS | Dua kesalahan di tempat berbeda, bukti "mengubah tepat dua perintah" — bukti yang baik. Tanpa jebakan/knob. |
| KODE.TKB.DEBUG-BANYAK.02 | 13 (K4 1, K6 1, K8 1) | REVISI | Bila perintah yang sedang dijalankan disorot (lazim pada tombol "langkah"), menyentuh perintah yang membuat robot menabrak hanyalah membaca sorotan — mekanik tidak membuktikan "membaca program, bukan coba-coba". Rantai prasyarat tidak memuat satu pun kompetensi debugging. |
| KODE.TKB.KONDISI.01 | 14 (K4 1, K6 1) | REVISI | Inti unit kondisi, tetapi semantik blok tidak didefinisikan: dengan hanya "kalau ada batu, lompat" (tanpa "kalau tidak, maju") satu program tidak bisa berhasil di tiga jalur dengan batu berpindah, kecuali memakai kalau-di-dalam-ulangi — yang justru isi KONDISI.02 (pengaya, "inti di SD 1"). Urutan .01 ↔ .02 terbalik secara isi. |
| KODE.TKB.KONDISI.02 | 12 (K2 1, K3 1, K4 1, K8 1) | REVISI | Blok kalau di dalam blok ulangi = struktur bersarang; rubrik meletakkan perulangan bersarang di SD 1, penulis juga menulis "inti di SD 1". Statement menggabung dua konstruk dengan "sekaligus"; tidak ada paksaan mekanik (tanpa batas rak, jalur 8 petak bisa diselesaikan tanpa ulangi). |
| KODE.TKB.DEKOMPOSISI.01 | 14 (K4 1, K8 1) | REVISI | Pintu dan dua slot program disediakan game, jadi yang "memecah" adalah game; anak hanya menjalankan dua tugas NAVIGASI berurutan. Mekanik tidak membuktikan dekomposisi. |
| KODE.TKB.DEKOMPOSISI.02 | 15 (K8 1) | LULUS | Mengelompokkan 6 langkah ke 3 tahap; statement jujur ("mengelompokkan", bukan "memecah"). Label tahap wajib ikon + suara (TK B belum membaca) — belum ditulis. Tanpa jebakan (langkah ambigu seperti "tuang adonan ke loyang") dan knob. |

**Hasil: 6 LULUS, 5 REVISI** (PROGRAM-5-8.02, DEBUG-BANYAK.02, KONDISI.01, KONDISI.02, DEKOMPOSISI.01). Dua di antaranya inti (KONDISI.01, DEKOMPOSISI.01). Pola umum: mekanik yang disebut tidak memaksa kemampuan yang diklaim (K4), dan dua kompetensi yang penulis sendiri tandai "inti di SD 1" tetap ditulis sebagai TK B (K3).

## Revisi yang diminta

### KODE.TKB.PROGRAM-5-8.02
- Masalah (K3★ Layak usia = 1): statement: "menunjuk petak tempat robot akan berada setelah tiap perintah **sebelum program dijalankan**". Untuk program 5 perintah yang memuat belokan, anak harus memegang posisi *dan* arah hadap robot di kepala sepanjang lima langkah, tanpa robot bergerak. Memutar perspektif secara mental belum stabil pada 5–6 tahun (pra-operasional). Rubrik tidak menyebut tracing di kolom TK B; penulis sendiri menulis "menjadi inti di SD 1". Status pengaya tidak mengubah kelayakan usia.
- Masalah (K8 Catatan = 1): hanya definisi dan ambang (≥ 4 dari 5). Tanpa jebakan (belokan: anak menunjuk petak sebelah kiri *layar*, bukan kiri robot), tanpa knob, tanpa cara game menampilkan prediksi yang sudah dibuat.
- Usulan (versi TK B yang layak): prediksi **satu langkah ke depan, berselang-seling dengan eksekusi** — anak menunjuk petak tujuan perintah berikutnya, lalu menekan "langkah", robot bergerak, anak menunjuk lagi. Tiap prediksi hanya satu gerakan dari keadaan yang terlihat. Statement: *"Aku bisa menunjuk petak tujuan robot sebelum tiap perintah dijalankan satu per satu"* / *"I can point to where robot will land before each command is run one at a time"*. Catatan: *"Tombol 'langkah' terkunci sampai anak menunjuk. Bukti: ≥ 4 dari 5 prediksi tepat; prediksi setelah perintah belok (robot diam, arah berubah) dihitung tepat bila anak menunjuk petak yang sama. Jebakan: setelah belok, anak menunjuk ke kiri layar, bukan kiri robot — robot tetap ditampilkan dari belakang. Knob: belokan 0 → 1 → 2; panjang 3 → 5."* Versi "seluruh prediksi sebelum dijalankan" dipindahkan ke SD 1 sebagai inti.
- Dampak: DEBUG-BANYAK.02 berprasyarat kompetensi ini; versi satu-langkah justru lebih cocok sebagai prasyaratnya.

### KODE.TKB.DEBUG-BANYAK.02
- Masalah (K4★ Dibuktikan game = 1): bukti yang dicatat: "anak menyentuh perintah yang tepat sebelum dijalankan sampai habis". Dua kemungkinan desain, keduanya lemah: (a) perintah yang sedang dijalankan disorot — maka setelah robot menabrak, menyentuh perintah yang disorot bukan "menemukan", melainkan membaca penanda; (b) tidak disorot — maka anak harus memetakan "tabrakan terjadi di langkah ke-4 → perintah ke-4", dan catatan tidak mengatakan ini. Tombol "jalan" biasa pun menabrak di tempat yang sama; nilai tambah tombol "langkah" tidak dijelaskan. Klaim "mengajarkan membaca program, bukan coba-coba" belum dibuktikan oleh mekanik.
- Masalah (K6 Urutan = 1): prereq hanya PROGRAM-5-8.02 (tracing). Rantainya (PROGRAM-5-8.02 → .01 → TKA.NAVIGASI.03) tidak memuat satu pun kompetensi debugging; `KODE.TKA.DEBUG.02` atau `KODE.TKB.DEBUG-BANYAK.01` seharusnya ada.
- Masalah (K8 Catatan = 1): tanpa jebakan dan knob.
- Usulan (mekanik yang membuktikan membaca program): anak harus **berhenti satu langkah sebelum tabrakan** dan menyentuh perintah berikutnya tanpa menjalankannya. Bukti: perintah yang disentuh adalah perintah penabrak dan robot belum menabrak. Anak yang menekan "langkah" sampai menabrak dicatat sebagai belum (boleh ulang). Dengan cara ini, sorotan perintah aktif boleh tetap ada tanpa membocorkan jawaban. Statement: *"Aku bisa menjalankan program langkah demi langkah dan berhenti untuk menunjuk perintah yang akan membuat robot menabrak dinding"* / *"I can run the program one step at a time and stop to point at the command that would make robot hit the wall"*. Catatan: *"Jebakan: anak menunjuk perintah 'belok' sebelum 'maju' penabrak — hanya 'maju' yang membentur dinding; terima belok sebagai jawaban sebagian dengan umpan balik, bukan sukses. Knob: posisi perintah penabrak ke-3 → ke-6; dinding 1 → 2."* Prereq: `KODE.TKB.PROGRAM-5-8.02` (versi satu-langkah) + `KODE.TKA.DEBUG.02`.

### KODE.TKB.KONDISI.01
- Masalah (K4★ Dibuktikan game = 1): statement dan catatan menyebut satu blok: "kalau ada batu, lompat". Mekanik: satu program harus berhasil di tiga jalur dengan posisi batu berbeda. Coba disusun: jalur 6 petak, batu berpindah antara petak 2–5. Tanpa "kalau tidak, maju" dan tanpa perulangan, program apa pun yang dapat anak susun dari blok maju + blok kalau tidak bisa tepat di bintang pada ketiga jalur, karena lompat yang berhasil memajukan robot satu petak sedangkan kalau yang tidak terpenuhi tidak memajukan apa pun — jumlah langkah berbeda per jalur. Satu-satunya bentuk yang berhasil adalah `ulangi N [kalau batu: lompat, kalau tidak: maju]` — dan itu persis isi KONDISI.02 yang ditulis penulis sebagai pengaya dan "inti di SD 1". Prereq ULANGI.01 memang dicantumkan, tanda penulis sadar perulangan dibutuhkan, tetapi catatan tidak menjelaskan semantik blok, bentuk program yang diharapkan, maupun apa yang terjadi bila "kalau tidak". Mekanik "mungkin tapi lemah": tidak bisa dibangun dari uraian yang ada.
- Masalah (K6 Urutan = 1): karena .01 hanya bisa diselesaikan dengan bentuk yang diajarkan .02, urutan isi .01 ↔ .02 terbalik, dan .02 berprasyarat .01 (melingkar secara konsep, meski tidak melingkar secara id).
- Usulan (desain tanpa perulangan, layak "kondisi sederhana" TK B): jadikan blok kondisi **satu keping kalau-tidak**: ikon "batu? → lompat / kosong → maju" yang selalu memajukan robot tepat satu petak. Program punya slot tetap sebanyak petak (4–6); anak mengganti blok maju dengan keping kondisi pada slot yang ia pilih. Satu program dijalankan di 3 jalur dengan batu berpindah; program hanya berhasil bila semua slot yang mungkin berbatu memakai keping kondisi. Bukti: ketiga jalur sampai bintang. Statement: *"Aku bisa memakai blok 'kalau ada batu lompat, kalau tidak maju' supaya satu program robot berhasil di tiga jalur yang batunya berpindah"* / *"I can use the 'if there is a rock jump, otherwise move' block so one program works on three paths where the rock moves"*. Catatan: *"Keping kondisi selalu menggerakkan robot satu petak (lompat melewati batu atau maju biasa), jadi panjang program = jumlah petak. Batu tidak pernah di petak terakhir. Jebakan: anak hanya memasang kondisi di petak tempat batu terlihat pada jalur pertama; jalur ke-2 dan ke-3 ditampilkan baru setelah program dijalankan. Knob: petak 4 → 6; posisi batu yang mungkin 2 → 3 petak."* Prereq: `KODE.TKA.KALAU.01` saja; lepaskan `ULANGI.01`.
- Catatan `[]` sudah jujur; tidak perlu diubah.

### KODE.TKB.KONDISI.02
- Masalah (K3★ Layak usia = 1): "blok kalau di dalam ulangi" adalah struktur bersarang. Rubrik: TK B boleh "ulangi N kali" dan "kondisi sederhana" sebagai dua hal terpisah; "perulangan bersarang" ada di kolom SD 1. Menaruh kondisi di dalam perulangan menuntut anak membayangkan bahwa isi blok dievaluasi ulang tiap putaran — pengertian yang sama dengan perulangan bersarang. Penulis sendiri: "menjadi inti di SD 1".
- Masalah (K2★ Satu kemampuan = 1): statement "dengan blok ulangi **dan** blok kalau sekaligus" menyebut dua konstruk; kemampuan barunya (menaruh kalau di dalam ulangi) tidak dinyatakan. Sebagaimana ditulis, ia bisa dipenuhi dengan ulangi dan kalau yang berdampingan, bukan bersarang.
- Masalah (K4★ Dibuktikan game = 1): "jalur sampai 8 petak" tanpa batas rak — 8 keping kondisi berjajar menyelesaikannya tanpa ulangi. Tidak ada paksaan mekanik seperti di ULANGI.01.
- Masalah (K8 Catatan = 1): hanya contoh program dan status pengaya.
- Usulan: pindahkan ke SD 1 sebagai inti unit kondisi dengan prereq KONDISI.01 (versi keping kalau-tidak) dan ULANGI.02. Statement: *"Aku bisa menaruh blok kalau ada batu di dalam blok ulangi supaya program 2 blok robot berhasil di jalur 8 petak"* / *"I can put the if-there-is-a-rock block inside a repeat block so the robot's 2-block program works on an 8-square path"*. Catatan harus memuat batas rak (2–3 blok) sebagai paksaan, bukti (ketiga jalur berhasil dengan ≤ 3 blok), jebakan (anak menaruh kalau sebelum ulangi, bukan di dalamnya — tampilkan "mulut" blok ulangi jelas), dan knob (petak 6 → 8, batu 1 → 2). Bila PO memutuskan kalau-di-dalam-ulangi termasuk "kondisi sederhana" TK B (lihat PO), kompetensi ini bisa tetap di TK B sebagai pengaya dengan perbaikan K2, K4, K8 di atas.

### KODE.TKB.DEKOMPOSISI.01
- Masalah (K4★ Dibuktikan game = 1): catatan: "pintu di tengah; program bagian 1 harus berakhir di pintu sebelum bagian 2 boleh disusun". Game sudah menentukan titik pemecahannya (pintu) dan menyediakan dua slot program. Yang anak lakukan adalah dua kali NAVIGASI pendek berurutan — itu sudah dibuktikan PROGRAM-5-8.01. Kemampuan yang diklaim, "memecah misi jadi dua bagian", tidak pernah diputuskan oleh anak; mekanik tidak membedakan anak yang memahami pemecahan dari anak yang mengikuti dua layar.
- Masalah (K8 Catatan = 1): tanpa jebakan dan knob.
- Usulan (anak yang memilih titik pecah): rak hanya muat 4 blok, jalur ke bintang butuh 6–7 perintah, sehingga satu program tidak cukup. Anak menaruh **bendera** di petak mana pun, lalu menyusun program 1 (ke bendera) dan program 2 (bendera ke bintang). Bukti: bendera ditaruh pada petak yang terjangkau ≤ 4 perintah dan sisa jalur ≤ 4 perintah, kedua program sampai. Statement: *"Aku bisa memilih petak persinggahan lalu menyusun dua program pendek supaya robot sampai bintang di jalur yang terlalu panjang untuk satu rak"* / *"I can choose a stopping square and build two short programs so robot reaches the star on a path too long for one rack"*. Catatan: *"Jebakan: bendera ditaruh terlalu dekat start (program 2 jadi terlalu panjang) — tampilkan sisa slot rak saat bendera digeser. Jebakan 2: anak menaruh bendera di bintang (tidak memecah) — bendera di bintang ditolak. Knob: jalur 6 → 8 perintah; rak 4 → 3."* Prereq tetap `KODE.TKB.PROGRAM-5-8.01`.
- Alternatif yang lebih ringan bila PO ingin pintu tetap: beri **dua pintu**, hanya satu yang membuat kedua bagian muat di rak; anak memilih pintu mana yang dituju lebih dulu. Itu sudah keputusan dekomposisi yang teramati.

## Catatan urutan & prasyarat

- **ULANGI**: .01 (pakai ulangi, jumlah tetap) → .02 (pilih jumlah) → .03 (tulis ulang program panjang). Rantai benar. Dua catatan: (a) knob "3 → 5 ulangan" di .01 mendahului .02 — hapus dari .01; (b) .03 mengharuskan melihat unit berulang 3 perintah dalam daftar — tambahkan `KODE.TKA.POLA-ABC.01` sebagai prereq, karena itulah kemampuan mengenali unit pola.
- **ULANGI.02 dan lambang bilangan**: "angka ulangan dipilih dari 2–6". Bila yang tampil lambang bilangan, prereq perlu `MAT.TKA.BILANGAN-1-10.03` (kartu angka tanpa titik); bila tampil titik/jari, .02 cukup. Catatan harus menyebut mana yang dipakai.
- **PROGRAM-5-8**: .01 ← TKA.NAVIGASI.03 (lompatan dari 5 ke 8 perintah dan grid 3×3 → 4×4 wajar untuk satu tahun). .02 (tracing) lihat revisi.
- **DEBUG-BANYAK**: .01 ← TKA.DEBUG.02 + PROGRAM-5-8.01, benar. .02 ← PROGRAM-5-8.02 saja; tambahkan TKA.DEBUG.02 (lihat revisi). Unit ini tidak punya kompetensi "debugging urutan gambar" lanjutan dari TKA.DEBUG.01 — disengaja? Tidak masalah, hanya dicatat.
- **KONDISI**: .01 ← TKA.KALAU.01 + ULANGI.01; .02 ← .01 + ULANGI.02. Secara konsep terbalik (lihat revisi KONDISI.01): .01 hanya bisa diselesaikan dengan bentuk .02. Setelah .01 didesain ulang tanpa perulangan, prereq ULANGI.01 dilepas dan urutan menjadi lurus.
- **DEKOMPOSISI**: .01 ← PROGRAM-5-8.01, .02 ← TKA.URUTAN.01. Tidak ada hubungan antara .01 dan .02 (satu di grid, satu di gambar) — wajar sebagai dua wajah dekomposisi, tetapi .02 yang pengaya dan lebih mudah mungkin sebaiknya mendahului .01 dalam jadwal.
- **Lintas berkas**: 4 prereq ke TK A (NAVIGASI.03, DEBUG.02, KALAU.01, URUTAN.01), 1 ke MAT TK A. Tidak ada prasyarat melingkar. Tidak ada tuntutan nilai tempat, perkalian, fungsi, atau variabel. Yang mendekati batas SD 1: PROGRAM-5-8.02 (tracing penuh) dan KONDISI.02 (bersarang), keduanya dibahas. 7 inti + 4 pengaya; setelah revisi KONDISI.02 pindah ke SD 1, TK B tersisa 10 kompetensi.
- **Persebaran mekanik**: 9 dari 11 hanya `navigasi`. Untuk 5–6 tahun satu tahun penuh di grid robot berisiko jenuh; ULANGI.03 dan DEKOMPOSISI.02 menunjukkan konsep bisa dibawa ke luar grid (urutan gambar, pola). Bukan kriteria rubrik; dicatat untuk PO.

## Untuk diputuskan PO

1. **Tafsir K5 untuk KODE**: 10 dari 11 kompetensi TK B memakai `[]`. Tafsir sementara (`[]` + catatan jujur = 2) membuat K5 tidak lagi membedakan apa pun di berkas ini. Pilihan: kunci tafsir ini di rubrik sampai framework 0059 (Stage 1: algoritma, kesalahan tunggal; Stage 2: perulangan, kondisi) diunduh dari Cambridge Primary support site, lalu peninjauan K5 diulang sekali untuk seluruh track KODE.
2. **Batas "kondisi sederhana" TK B**: apakah kalau-di-dalam-ulangi termasuk "kondisi sederhana" (TK B) atau "perulangan bersarang" (SD 1)? Saya menafsirkan SD 1 (struktur bersarang). Tambahkan satu frasa di tabel usia rubrik agar penulis dan peninjau tidak berbeda tafsir.
3. **Tracing (prediksi posisi)**: tabel usia tidak menyebutnya. Usul: TK B "prediksi satu langkah berikutnya"; SD 1 "menelusuri program utuh sebelum dijalankan".
4. **Semantik blok navigasi seluruh game** (sama dengan PO KODE-TKA butir 4): lompat selalu maju satu petak? Apa akibat lompat di petak kosong? Apakah blok kondisi punya cabang "kalau tidak"? Tiga kompetensi (PAUD.PERINTAH.02, TKA.KALAU.01, TKB.KONDISI.01/.02) bergantung pada keputusan ini; tetapkan sekali di dokumen mekanik `navigasi`.
5. **2P.02**: satu-satunya ref Computing di berkas ini selain 2CT.06, tetapi maknanya (menyalin algoritma yang diberikan menjadi program) belum punya kompetensi. Usul kompetensi TK B baru: "Aku bisa menyusun blok sesuai 4–6 gambar langkah robot yang diberikan" — cocok 2P.02 dan merupakan jembatan alami dari urutan gambar (TK A) ke program.
6. **Label kata tanpa membaca** (DEKOMPOSISI.02: siapkan/campur/panggang): tegaskan prinsip ikon + suara untuk seluruh TK B.
7. **Keseragaman mekanik**: 9/11 kompetensi TK B di grid robot. Pertimbangkan satu kompetensi perulangan di luar grid (mis. pola/irama "ulangi 3 kali" di SENI atau musik) agar konsep tidak melekat pada satu konteks saja.

## Tindak lanjut penulis — 24 Okt 2026

Diterapkan:
- PROGRAM-5-8.02 → prediksi satu langkah berselang-seling dengan tombol 'langkah'; tracing utuh ke SD 1.
- DEBUG-BANYAK.02 → berhenti satu langkah sebelum tabrakan dan menunjuk perintah penyebab tanpa menjalankannya; prereq tambah KODE.TKA.DEBUG.02; blok aktif tidak disorot.
- KONDISI.01 → blok satu keping "kalau batu lompat, kalau tidak maju" (selalu memajukan), rak 4–6 slot, 3 jalur; prereq ULANGI.01 dilepas.
- KONDISI.02 (kalau di dalam ulangi) → dihapus dari TK B, ditulis di SD 1 sebagai inti dengan batas rak.
- DEKOMPOSISI.01 → anak memilih titik bendera sendiri; rak 4 blok, jalur 6–7; bukti = kedua bagian muat.
- ULANGI.01 → knob diluruskan (ulangan tetap 3). ULANGI.02 → prereq MAT.TKA.BILANGAN-1-10.03. ULANGI.03 → prereq KODE.TKA.POLA-ABC.01.
- PROGRAM-5-8.01 → 2P.02 dilepas.
- Semantik seluruh blok navigasi dikunci di `docs/akademi/mekanik-navigasi.md`.

Menunggu PO: tafsir K5 untuk KODE sampai framework 0059 tersedia; baris 'tracing' di tabel usia; satu kompetensi perulangan di luar grid.
