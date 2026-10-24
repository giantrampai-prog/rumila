# Tinjauan KODE-PAUD.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky; skeptis pada tuntutan yang terlalu cepat). Konteks usia PAUD = 3–4 tahun.
Validator: bersih (0 error, 4 peringatan — 3 menyangkut berkas ini):

```
✓ content/kurikulum/KODE-PAUD.json: 8 kompetensi
! KODE.PAUD.URUTAN.01: ref CAMBRIDGE_PRIMARY_COMPUTING:1CT.01 belum terverifikasi terhadap dokumen resmi
! KODE.PAUD.URUTAN.02: ref CAMBRIDGE_PRIMARY_COMPUTING:1CT.02 belum terverifikasi terhadap dokumen resmi
! KODE.PAUD.SEBAB-AKIBAT.01: tidak ada kode acuan kerangka internasional
19 kompetensi, 0 error, 4 peringatan
```

Pembanding: 2 dari 8 kompetensi (URUTAN.01, PERINTAH.01) adalah salinan kata per kata dari golden set, jadi lulus sebagai batas bawah mutu. Catatan: `content/kerangka/README.md` menyatakan butir `verified: false` (1CT.01, 1CT.02) "jangan dipakai validator sampai dikonfirmasi"; keduanya tetap dipakai di berkas ini, dengan catatan jujur. Saya nilai sebagai K5 = 1, bukan 0.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| KODE.PAUD.URUTAN.01 | 15 (K5 1) | LULUS | = golden. 3 gambar, animasi sebagai umpan balik. Ref 1CT.01 belum terverifikasi; 2Mn.04 (ordinal 1st–10th, EY2) hanya mirip. |
| KODE.PAUD.URUTAN.02 | 14 (K3 1, K5 1) | REVISI | Ini debugging 1 langkah; tabel usia rubrik meletakkannya di TK A. Penulis sendiri menulis "jadi inti di TK A". |
| KODE.PAUD.POLA.01 | 15 (K6 1) | LULUS | Pola AB dengan ≥3 ulangan, suara ikut berpola, distraktor ditunda. Prereq warna ada tetapi prereq bentuk (BENTUK-DASAR.01) tidak, padahal statement menyebut "dua bentuk". |
| KODE.PAUD.POLA.02 | 15 (K8 1) | LULUS | Cipta AB dari 2 benda pilihan; hasil disimpan di dunia. Catatan tanpa jebakan/knob (AABB, 6 slot langsung). |
| KODE.PAUD.PERINTAH.01 | 15 (K5 1) | LULUS | = golden. Hanya "maju", grid lurus, eksekusi langkah demi langkah. Ref 2CT.06 adalah Stage 2 (6–7 th), hanya pendahulu. |
| KODE.PAUD.PERINTAH.02 | 13 (K3 1, K5 1, K8 1) | REVISI | "Program 2–4 perintah" dengan rintangan di tengah jalur = merencanakan 4 langkah dan menghitung posisi batu; itu TK A ("urutan 3–5 langkah"). |
| KODE.PAUD.SEBAB-AKIBAT.01 | 12 (K2 1, K4 1, K5 1, K8 1) | REVISI | Dua kemampuan ("menebak, lalu mengecek"); dengan kabel terlihat tugasnya menjadi menelusuri garis, tanpa kabel tebakan pertama hanya untung-untungan. |
| KODE.PAUD.SEBAB-AKIBAT.02 | 13 (K4 1, K6 1, K8 1) | REVISI | Perilaku "minta tolong" sulit dibuktikan tanpa tombol bantuan yang dipandu (= tutorial, bukan bukti); prereq ke SEBAB-AKIBAT.01 tidak punya hubungan logis. |

**Hasil: 4 LULUS, 4 REVISI.**

## Revisi yang diminta

### KODE.PAUD.URUTAN.02
- Masalah (K3★ Layak usia = 1): "menemukan satu gambar yang salah tempat" adalah debugging satu langkah. Tabel usia rubrik: PAUD boleh "urutan 2–3 langkah"; "debugging 1 langkah" baru masuk kolom TK A. Untuk menemukan yang salah, anak harus memegang urutan yang benar di kepala *sambil* membandingkannya dengan urutan yang disajikan — dua representasi sekaligus, yang pada 3–4 tahun belum stabil. Catatan penulis sendiri: "Pengaya di PAUD, jadi inti di TK A". Status pengaya tidak mengubah kelayakan usia.
- Masalah (K5 Ref = 1): `1CT.02` berstatus `verified: false`; README kamus melarang pemakaiannya sebelum dikonfirmasi. Catatan sudah jujur, tetapi kode tidak boleh menjadi satu-satunya acuan.
- Usulan: pindahkan utuh ke `KODE.TKA.URUTAN.xx` sebagai inti (statement dan catatan sudah bagus untuk 4–5 tahun). Isi slot .02 di PAUD dengan prasyarat yang justru hilang (lihat Catatan urutan): *"Aku bisa memilih gambar yang terjadi lebih dulu dari dua gambar kegiatan"* / *"I can pick which of two pictures of an activity happens first"*; `depth: ["pakai"]`, `prereq: []`, mekanik `urutkan`, `cerita`; ref `CAMBRIDGE_EY 1Mn.04` (EY1, "ordinal numbers 1st to at least 3rd in practical contexts") dengan note "di PAUD hanya 'lebih dulu/sesudah', tanpa istilah ordinal". Lalu URUTAN.01 (3 gambar) berprasyarat kompetensi 2-gambar ini.

### KODE.PAUD.PERINTAH.02
- Masalah (K3★ Layak usia = 1): statement masih di jalur lurus, tetapi catatan menetapkan "Program 2–4 perintah" yang disusun lalu dijalankan. Agar lompat jatuh tepat di batu, anak harus menghitung berapa "maju" sebelum "lompat" (mis. maju, maju, lompat, maju) — itu merencanakan urutan 4 langkah dengan penalaran posisi. Tabel usia: PAUD "mengikuti 1 perintah"; "urutan 3–5 langkah, perintah maju/belok" adalah TK A. Umpan balik "tersandung lalu program bisa diubah" memang ramah, tetapi yang terjadi di 3–4 tahun adalah coba-coba acak sampai animasi benar, bukan memilih perintah untuk keadaan.
- Masalah (K5 Ref = 1): `2CT.06` adalah Stage 2 (usia 6–7) dan isinya "precise sets of instructions"; untuk PAUD hanya pendahulu jauh. Catatan "pendahulu" tanpa penjelasan.
- Masalah (K8 Catatan = 1): tidak ada jebakan (mis. anak menekan lompat terus karena lebih lucu) dan tidak ada knob.
- Usulan A (tetap di PAUD): ubah menjadi eksekusi langsung, satu perintah sekali tekan — *"Aku bisa menekan lompat, bukan maju, saat robot berdiri tepat di depan batu"* / *"I can press jump instead of forward when robot is standing right in front of a rock"*. Catatan: *"Mode langsung: setiap tekan tombol, robot bergerak seketika; tidak ada program yang disusun dulu. Batu selalu persis di kotak depan robot saat keputusan diminta. Jebakan: anak menekan lompat terus — lompat di kotak kosong membuat robot mendarat biasa saja tanpa hadiah, jadi tidak diperkuat. Knob: jumlah batu 1–2, jarak antar batu."* Ref: `[]` dengan catatan jujur (lihat PO) atau tetap 2CT.06 dengan note "pendahulu jauh (Stage 2)".
- Usulan B: pindahkan versi "program 2–4 perintah" ke `KODE.TKA.PERINTAH.xx`, dengan prereq versi langsung di atas.

### KODE.PAUD.SEBAB-AKIBAT.01
- Masalah (K2★ Satu kemampuan = 1): "menebak alat mana yang menyala … lalu mengeceknya" adalah dua tindakan terpisah (memprediksi dan menguji) yang digabung dengan "lalu". Kalau UI mewajibkan menunjuk dulu sebelum tombol aktif, maka "mengecek" otomatis dan yang diukur hanya prediksi; kalau tidak diwajibkan, game tidak bisa tahu anak "menebak" apa.
- Masalah (K4★ Dibuktikan game = 1): catatan mengatakan "kabelnya terlihat". Dengan kabel terlihat, anak menelusuri garis dari tombol ke alat — itu mekanik `telusur`/persepsi, bukan sebab-akibat. Tanpa kabel, tebakan pertama adalah untung-untungan 1 dari 3; yang bermakna hanya tebakan *setelah* pernah menekan (ingat akibat tombol). Statement tidak menentukan yang mana, sehingga mekanik tidak membuktikan satu hal yang jelas. Mekanik `cari` juga tidak relevan di papan tombol.
- Masalah (K5 Ref = 1): `refs: []` dengan catatan jujur. Kamus memang tidak punya kode; tetapi rubrik hanya memberi 2 untuk `[]` pada SENI/KARAKTER. Bukan kesalahan penulis — lihat PO.
- Masalah (K8 Catatan = 1): tanpa jebakan dan knob.
- Usulan statement (satu kemampuan, teramati, tanpa kabel): *"Aku bisa menunjuk alat yang akan menyala sebelum menekan tombol yang sudah pernah kucoba"* / *"I can point to the device that will turn on before pressing a button I have tried before"*. Catatan: *"Putaran 1: anak bebas menekan 3 tombol, melihat akibatnya (tanpa penilaian). Putaran 2: sebelum menekan, anak wajib menunjuk alat; yang dicatat adalah kecocokan tunjukan dengan akibat pada tombol yang sudah pernah ditekan. Tanpa kabel terlihat. Jebakan: warna tombol = warna alat (anak mencocokkan warna, bukan mengingat akibat); buat warnanya tidak berpasangan. Knob: jumlah tombol 2–3, jeda antara putaran 1 dan 2."* Mekanik: `simulasi` saja (atau `simulasi` + `cerita`). Hapus `cari`.
- Kalau PO ingin mempertahankan "kabel terlihat", itu kompetensi lain: *"Aku bisa mengikuti kabel dari tombol sampai ke alatnya"* dengan mekanik `telusur` — dan lebih cocok di SAINS daripada KODE.

### KODE.PAUD.SEBAB-AKIBAT.02
- Masalah (K4★ Dibuktikan game = 1): perilaku yang dicatat adalah "menekan tombol bantuan, bukan menekan sembarang tombol berulang". Anak 3–4 tahun tidak akan tahu tombol bantuan ada kecuali tombolnya menyala/berkedip atau tokoh mengajak — dan begitu dipandu, yang terekam adalah kepatuhan pada tutorial, bukan kompetensi "minta tolong saat alat tidak bekerja". Catatan tidak menjelaskan bagaimana membedakan keduanya, juga tidak mendefinisikan ambang (berapa kali coba sebelum dianggap "tidak minta tolong").
- Masalah (K6 Urutan = 1): prereq `KODE.PAUD.SEBAB-AKIBAT.01` (memprediksi alat yang menyala) tidak punya hubungan sebab-akibat pedagogis dengan "minta tolong lewat tombol bantuan". Prasyarat yang sebenarnya adalah anak sudah pernah dikenalkan tombol bantuan, dan itu bukan kompetensi.
- Masalah (K8 Catatan = 1): ada pengecualian yang baik ("jangan dinilai gagal bila mencoba 2–3 kali dulu") tetapi tanpa jebakan dan knob.
- Usulan: tegaskan bukti dan ambang dalam catatan — *"Tombol bantuan dikenalkan sekali di onboarding dunia (bukan di sesi ini) dan tidak pernah berkedip. Situasi macet muncul di akhir mini-game lain. Dicatat tercapai bila anak menekan bantuan setelah ≤ 5 ketukan sia-sia; tidak tercapai bila > 10 ketukan atau anak keluar dari layar. Jebakan: tombol bantuan terlalu dekat tombol yang 'macet' sehingga tertekan tak sengaja — jauhkan. Knob: jumlah ketukan sia-sia sebelum tokoh memberi isyarat halus (lihat ke arah tombol tanpa bicara)."* Ganti prereq menjadi `[]`. Ref `1UWd.04` sudah tepat (EY1, usia 3–4).
- Pertimbangan track (lihat PO): ini kebiasaan digital / adab, bukan sebab-akibat dan bukan koding. Lebih cocok di unit "Adab perangkat" (KARAKTER atau DUNIA) bersama 1UWd.03 (minta izin sebelum memakai perangkat).

## Catatan urutan & prasyarat

- **Unit URUTAN**: melompat langsung ke 3 gambar. Prasyarat alami untuk 3–4 tahun adalah 2 gambar ("mana yang lebih dulu"), yang tidak ada. Setelah URUTAN.02 dipindah ke TK A, slotnya bisa diisi kompetensi 2-gambar ini (lihat usulan URUTAN.02), dan URUTAN.01 berprasyarat padanya.
- **Unit POLA**: POLA.01 berprasyarat `MAT.PAUD.WARNA-BENTUK.02` (nama warna) tetapi statement juga menyebut "dua bentuk"; konsistennya tambahkan `MAT.PAUD.BENTUK-DASAR.01` (diskriminasi bentuk). Atau, lebih bersih: karena melanjutkan pola hanya butuh *membedakan*, bukan *menamai*, hapus prereq warna dan biarkan `[]`. POLA.01 → POLA.02 (pakai → cipta) sudah benar.
- **Unit PERINTAH**: PERINTAH.01 berprasyarat URUTAN.01 — masuk akal (urutan punya akibat sebelum memberi urutan perintah). PERINTAH.02 berprasyarat .01 — benar, tetapi lompatan tuntutannya terlalu besar (lihat revisi).
- **Unit SEBAB-AKIBAT**: .02 berprasyarat .01 tanpa hubungan isi; ganti `[]`. Unit ini juga bisa dipertanyakan letaknya di track KODE (lihat PO).
- **Lintas track**: hanya POLA.01 yang menunjuk MAT; tidak ada prasyarat melingkar; tidak ada kompetensi yang menuntut membaca atau "kalau-maka" eksplisit (PERINTAH.02 mendekati, dibahas di atas).

## Untuk diputuskan PO

1. **Kamus Cambridge Primary Computing belum layak dipakai**: hanya 4 kode terverifikasi, semuanya Stage 1–2 (usia 5–7), dan dua kode Stage 1 yang paling relevan (1CT.01, 1CT.02) `verified: false`. README kamus sendiri melarang pemakaiannya. Pilihan: (a) unduh *Curriculum Framework 0059* dari support site dengan akun sekolah dan verifikasi, atau (b) izinkan `[]` dengan catatan jujur untuk seluruh track KODE PAUD–TK A sampai kamus siap (dan ubah rubrik K5 agar `[]` bernilai 2 untuk KODE juga). Saat ini 5 dari 8 kompetensi kena K5 = 1 karena ini, bukan karena penulis.
2. **Tempat unit SEBAB-AKIBAT**: .01 (prediksi masukan→keluaran) lebih dekat ke SAINS/scientific thinking (UWs), .02 (minta tolong) ke adab perangkat digital (UWd, 1UWd.03–04). Kalau PO ingin KODE PAUD tetap 4 unit, unit ke-4 yang lebih khas koding untuk 3–4 tahun adalah "Perintah tunggal & akibatnya" (tekan satu tombol, robot melakukan satu aksi; cocokkan simbol tombol dengan aksi) — itu benih "simbol = instruksi".
3. **Tafsir "mengikuti 1 perintah" (PAUD) vs "memberi 1–3 perintah maju"** (PERINTAH.01, golden): golden meloloskannya, jadi saya ikut. Tetapi batas antara PERINTAH.01 (3 perintah maju, lulus) dan PERINTAH.02 (4 perintah dengan rintangan, tidak lulus) perlu ditegaskan di rubrik: usul tambahkan ke kolom PAUD "memberi perintah tunggal berulang di jalur lurus, eksekusi langsung".
4. **Cambridge EY 1Mn.04** (EY1 ordinal 1st–3rd) belum dipakai padahal itu satu-satunya kode usia 3–4 untuk urutan di kamus; URUTAN.01 memakai 2Mn.04 (EY2). Pertimbangkan menukar.

## Tindak lanjut penulis — 24 Okt 2026

Diterapkan:
- URUTAN → .01 baru "mana yang lebih dulu dari 2 gambar" (ref 1Mn.04 EY1); 3 gambar jadi .02; debugging 1 langkah dihapus dari PAUD, ditulis di TK A. Ref 1CT.01/1CT.02 (belum terverifikasi) tidak lagi dirujuk.
- POLA.01 → hanya dua warna; prereq WARNA.01 saja. POLA.02 → catatan jebakan & knob.
- PERINTAH.02 → eksekusi langsung, batu tepat di depan robot; versi program ke TK A. Ref 2CT.06 dilepas (terlalu jauh).
- SEBAB-AKIBAT.01 → satu tindakan ("menunjuk sebelum menekan tombol yang sudah dicoba"), tanpa kabel, mekanik simulasi saja.
- SEBAB-AKIBAT.02 → prereq dilepas, ambang ≤ 5 ketukan, tombol tidak berkedip.

Menunggu keputusan PO: letak unit SEBAB-AKIBAT (KODE vs SAINS/adab perangkat); kamus Computing 0059 via akun sekolah; tambahan baris PAUD di rubrik untuk "perintah tunggal, eksekusi langsung".
