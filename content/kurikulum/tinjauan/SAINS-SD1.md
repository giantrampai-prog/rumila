# Tinjauan SAINS-SD1.json — 2026-10-25
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; skeptis pada tuntutan yang terlalu cepat dan pada "kuis berbungkus game"). Usia SD 1 = 6–7 tahun: mulai membaca kata pendek, semua instruksi tetap dibacakan (VO).
Validator: bersih — `SAINS-SD1.json: 15 kompetensi`, 0 error, 0 peringatan untuk berkas ini (semua `refs` ada di `cambridge-primary-science-sains-sd1-3.json`, `verified: true`).

Acuan: Cambridge Primary Science 0097 Stage 1 (hanya acuan, bukan afiliasi). Pembanding mutu: golden set dan tinjauan SAINS-TKB (prinsip K4: pemilahan fakta yang tak teramati = kuis).

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| SAINS.SD1.MAKHLUK-HIDUP.01 | 15 (K6 1) | LULUS | Istilah "tidak pernah hidup" sesuai 1Bp.01; jebakan benda bergerak (awan, ombak) dan makhluk diam (jamur, rumput laut) bagus. Prasyarat PAUD tidak bisa dicantumkan (batas brief). |
| SAINS.SD1.MAKHLUK-HIDUP.02 | 15 (K5 1) | LULUS | Satu makanan hanya cocok untuk satu hewan per paket — jawaban tunggal. 1Bp.02 juga menyebut udara dan air; hanya bagian makanan terbukti (dicatat jujur di `note`). |
| SAINS.SD1.BAHAN.01 | 16 | LULUS | Rak bahan baru (kertas, kain, batu) muncul lebih dulu lewat urutan bin — progres nyata dari TKB BAHAN.01. |
| SAINS.SD1.BAHAN.02 | 15 (K6 1) | LULUS | Memilah kata "benda" vs "bahan" berpasangan (kursi–kayu) membuktikan 1Cm.02 secara langsung. Prasyarat BAHAN.01 tepat; idealnya juga TKB BAHAN.01. |
| SAINS.SD1.BAHAN.03 | 15 (K2 1) | LULUS | 1Cp.02 = *mendeskripsikan* bahan menurut sifat; memilah menurut sifat adalah deskripsi itu. Statement memberi dua contoh sifat tetapi tiap paket hanya satu sifat → satu kemampuan. Uji sifat langsung (tekuk, tetesi) akan memperkuat (PO 3). |
| SAINS.SD1.BAHAN.04 | 15 (K8 1) | LULUS | 1Cc.01 = *describe* perubahan oleh aksi fisik. Kartu memuat sebelum–sesudah, bukan nama cara, sehingga anak menalar. Batas atas: masih berbasis kalimat; mode tekan/regang langsung lebih baik. |
| SAINS.SD1.GAYA.01 | 16 | LULUS | Dorong/tarik konkret, dua konteks, ikon arah di rak. Jebakan pintu dihindari. |
| SAINS.SD1.GAYA.02 | 15 (K8 1) | LULUS | Pengaya. Kartu "papan luncur di pasir" diganti "sabun meluncur di lantai basah" (lebih dekat dengan anak Indonesia) — **diterapkan**. |
| SAINS.SD1.BUNYI.01 | 16 | LULUS | Pasangan keadaan (radio menyala/mati, anjing menggonggong/tidur) mencegah hafalan "radio = bunyi". Dua konteks (rumah, jalan: tukang bakso, kentongan). |
| SAINS.SD1.BUNYI.02 | 13 (K4 1, K5 1) | REVISI — **sebagian diterapkan, sisanya menunggu PO** | Draf memakai ikon 🔊🔉🔈 yang mengecil → anak cukup mengurut ukuran ikon (seriasi), bukan memahami 1Ps.02. Ikon diganti 🧒 seragam (diterapkan). Tetap K4 = 1: anak tidak *mendengar* bunyi mengecil; 1Ps.02 = *explore*. |
| SAINS.SD1.LISTRIK.01 | 16 | LULUS | Jebakan alat berbaterai tepat sasaran. |
| SAINS.SD1.BUMI.01 | 15 (K5 1) | LULUS | Pemilahan air/darat sah untuk 1ESp.02; "Bumi sebagian besar air" (1ESp.01) belum terbukti. Paket kedua "dari pesawat" ditambah. |
| SAINS.SD1.MATAHARI.01 | 14 (K4 1) | REVISI — **diterapkan** | Draf hanya mode pilih: peluang tebak 33–50 % per ronde, satu keputusan per ronde. Ditambah paket kelompok "cepat atau lambat" (pasangan benda sama di tempat panas/teduh, 6 keputusan per ronde). Setelah revisi K4 = 2. |
| SAINS.SD1.PENGAMATAN.01 | 15 (K2 1) | LULUS | Kubus dan jengkal = satu kemampuan (satuan tak baku), dinilai mesin (celah/tumpang). Konteks temuan kebun membedakannya dari MAT.TKB. |
| SAINS.SD1.PENGAMATAN.02 | 15 (K7 1) | LULUS | Statement draf menyebut "kebun" padahal paket kedua di kolam — diperluas "kebun atau kolam" (**diterapkan**). |

**Hasil akhir: 14 LULUS, 1 REVISI menunggu PO (BUNYI.02, pengaya).** Revisi yang diterapkan: MATAHARI.01 (paket kelompok baru), BUNYI.02 (ikon seragam), GAYA.02 (kartu), PENGAMATAN.02 (statement), dan konteks kedua untuk semua kompetensi inti.

## Revisi yang diminta

### SAINS.SD1.MATAHARI.01 — diterapkan
- Masalah (K4★ = 1): mode `pilih` dengan 2–3 pilihan per ronde; anak yang menebak acak lolos aturan 70 % dengan peluang besar, dan satu ronde hanya satu keputusan.
- Diterapkan: paket `sd1-sains-cepat-atau-lambat-hangat` (pilah kelompok, 10 kartu berpasangan: es di terik vs es di kulkas, baju dijemur vs di kamar, dst.). Paket pilih tetap sebagai konteks kedua.

### SAINS.SD1.BUNYI.02 — sebagian diterapkan, menunggu PO
- Masalah (K4★ = 1): ikon volume yang mengecil memberi jawaban. Setelah ikon diseragamkan, anak masih menalar dari label jarak, tanpa mendengar.
- Usulan: mode simulasi "dengar-jarak" (bunyi yang sama diputar dengan volume berbeda; anak menaruh pendengar). Sampai ada, kompetensi tetap pengaya.

## Catatan urutan & prasyarat
- Brief membatasi prasyarat SD1 ke SAINS-TKB. Akibatnya MAKHLUK-HIDUP.01, GAYA.01, BUNYI.01, LISTRIK.01, PENGAMATAN.01/.02 tanpa prasyarat, walau secara pedagogis SAINS.PAUD.HIDUP-TAK-HIDUP.01 seharusnya prasyarat MAKHLUK-HIDUP.01.
- Rantai di dalam berkas: BAHAN.01 → .02 / .03 → .04; GAYA.01 → .02; BUNYI.01 → .02; MAKHLUK-HIDUP.01 → .02. Tidak melingkar.
- Tidak ada kompetensi tubuh manusia: 1Bs.02 (indra) dan 1Bs.03 (bagian tubuh luar) sudah dicakup PAUD; 1Bp.04 (persamaan/perbedaan manusia) ditunda ke PO.
- 1Pf.03 (apung/tenggelam), 1Pe.02 (magnet), 1Bs.01 (bagian tumbuhan), 1Bp.03 (kebutuhan tumbuhan) sengaja tidak diulang: sudah ada di TKA/TKB.

## Untuk diputuskan PO
1. **Mode simulasi baru untuk Sains** (urut dampak): dengar-jarak (BUNYI.02), uji sifat bahan tekuk/tetesi (BAHAN.03), tekan/regang (BAHAN.04). Semua kompetensi sudah bisa dimainkan dengan mekanik yang ada; mode ini menaikkan mutu bukti.
2. **1Bp.04** (bagaimana manusia mirip dan berbeda) tidak ditulis: menyentuh tubuh/penampilan anak. Perlu keputusan PO.
3. **Prasyarat lintas jenjang**: izinkan SD1 menunjuk PAUD/TKA (mis. HIDUP-TAK-HIDUP.01, APUNG-TENGGELAM-MAGNET.03) agar peta prasyarat lengkap.
4. **Kurikulum.md vs Cambridge Stage 1**: daftar topik SD 1 di `docs/akademi/kurikulum.md` (siklus air, rantai makanan, tata surya, pencernaan/pernapasan) bukan isi Stage 1. Berkas ini mengikuti Stage 1; rantai makanan ada di SD 3 (3Be.01). Pencernaan/pernapasan = topik tubuh → PO. Mohon `kurikulum.md` diselaraskan.
