# Tinjauan KODE-SD1.json — 2026-10-25
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; skeptis pada tuntutan yang terlalu cepat). Konteks usia SD 1 = 6–7 tahun, baru mulai membaca: semua label wajib ikon + suara.
Validator: bersih untuk berkas ini (0 error; 8 peringatan "tidak ada kode acuan kerangka internasional").

Acuan: Cambridge Primary Computing (0059) Stage 1, hanya sebagai referensi. Kamus baru punya dua kode Stage 1 terverifikasi (`1DC.03`, `1CS.06`); keduanya dipakai dan cocok makna. `1CT.01`/`1CT.02` ada di kamus tetapi `verified: false`, jadi sengaja tidak dipakai; kesejajarannya ditulis di `catatan`. Delapan peringatan adalah refs kosong yang jujur (K5 = 2 menurut tafsir TK B).

Prasyarat lintas berkas: hanya ke KODE TK B (`ULANGI.02`, `ULANGI.03`, `KONDISI.01`, `PROGRAM-5-8.02`, `DEBUG-BANYAK.01`, `DEKOMPOSISI.02`).

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

## Putaran 1 (draf)

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| ALGORITMA.01 | 14 (K4 1, K6 1) | REVISI | Paket: "gosok gigi" punya dua langkah yang bisa bertukar (kumur ↔ bilas sikat); "roti selai" juga (ambil roti ↔ buka selai). Satu jawaban benar jadi tidak tunggal. Prasyarat alami (TK A URUTAN.01) di luar wewenang berkas; TKB.DEKOMPOSISI.02 hanya mirip. |
| ALGORITMA.02 | 14 (K4 1, K8 1) | REVISI | Urutan "mencuci piring" (buang sisa ↔ basahi) tidak tunggal → anak yang benar bisa dinilai salah. |
| POLA.01 | 15 (K5 1) | LULUS | Pola berbahan keping perintah; satuan dipilih dari 8 satuan bermakna (tanpa kiri-kanan berdampingan). Pengaya. |
| ULANGI.01 | 16 | LULUS | Rak 5 + jalur L dengan A, B ≥ 3; generator mencoba semua program ≤ 5 blok: yang lolos selalu memakai dua ulangi. |
| KONDISI.01 | 16 | LULUS | Usulan tinjauan TK B dilaksanakan. Semua program ≤ 2 blok dicoba; kelompok yang bisa lolos dengan `ulangi [lompat]` dibuang. |
| PREDIKSI.01 | 15 (K8 1) | LULUS | Prediksi per langkah dengan isi ulangi berulang. Catatan sudah memuat jebakan; knob `turns` hanya dokumentasi. |
| DEBUG.01 | 14 (K4 1) | REVISI | Kasus "angka ulangan terlalu besar di blok terakhir" tidak pernah gagal: robot berhenti di bintang sebelum ulangan selesai, jadi program "salah" justru berhasil. |
| DATA.01 | 15 (K5 1) | LULUS | Ya/tidak dengan pertanyaan tetap per paket; dua paket (listrik, roda). |
| PERANGKAT.01 | 14 (K4 1) | LULUS bersyarat | 1DC.03 cocok. Emoji tidak bisa menampilkan kabel, sehingga label menyebut "berkabel"/"tanpa kabel" dan anak bisa mencocokkan kata. Bukti lemah sampai ada gambar yang memperlihatkan kabel (lihat PO). |
| PERANGKAT.02 | 13 (K4 1, K8 1) | REVISI | Label "robot penyedot debu", "robot pemotong rumput" membocorkan jawaban (kata "robot"). |

## Perbaikan yang sudah dikerjakan (putaran 2)

- ALGORITMA.01: langkah "bilas sikat gigi" dan "ambil dua roti" dihapus; kedua urutan kini 5 langkah yang tidak bisa bertukar. → LULUS (15, K6 1 tetap karena batas prasyarat).
- ALGORITMA.02: urutan "mencuci piring" dihapus; tinggal 5 urutan berantai ketat. → LULUS (15).
- DEBUG.01: kesalahan angka di blok terakhir hanya boleh *kurang* dari seharusnya; generator kini memastikan program salah benar-benar gagal di peta dan program benar tidak melewati bintang di tengah jalan. → LULUS (16).
- PERANGKAT.02: label robot diganti tanpa kata "robot" ("penyedot debu yang jalan sendiri", "lengan mesin otomatis di pabrik", "kendaraan penjelajah planet Mars"); pengecoh "robot-robotan dari kardus" tetap sebagai jebakan yang disengaja. → LULUS (15).

**Hasil akhir: 9 LULUS, 1 LULUS bersyarat (PERANGKAT.01).**

## Catatan urutan & prasyarat

- ALGORITMA: .01 (susun) → .02 (perbaiki satu tukar). Prasyarat terbaik ke TK A URUTAN.01/DEBUG.01, tetapi aturan batch ini hanya mengizinkan SD 1 menunjuk KODE TK B, jadi dipakai `TKB.DEKOMPOSISI.02` (mengelompokkan langkah).
- ULANGI.01 ← TKB.ULANGI.02; KONDISI.01 ← TKB.KONDISI.01 + TKB.ULANGI.02; PREDIKSI.01 ← TKB.PROGRAM-5-8.02 + TKB.ULANGI.02; DEBUG.01 ← TKB.DEBUG-BANYAK.01 + TKB.ULANGI.02. Tidak ada lompatan.
- PERANGKAT.01/.02 tanpa prasyarat (pengenalan dunia nyata, tidak bergantung keterampilan program).

## Untuk diputuskan PO

1. **Perulangan bersarang (topik SD 1 di kurikulum.md) belum bisa dimainkan.** Mesin `jalankan()` sudah mendukung ulangi di dalam ulangi, tetapi rak di `src/components/akademi/navigasi.tsx` menolak menaruh keping ulangi di dalam ulangi (`cmd !== "ulangi"`) dan tidak menggambar isi bersarang. Kompetensi bersarang sengaja tidak ditulis; ULANGI.01 memakai "dua ulangi berurutan" sebagai pengganti sementara.
2. **Fungsi/jurus, variabel (skor, nyawa), event, animasi** (topik SD 1) belum punya mekanik pembukti. Perlu mekanik baru sebelum kompetensinya ditulis.
3. PERANGKAT.01 butuh aset gambar yang memperlihatkan kabel, supaya label bisa netral ("mouse", "headphone") dan anak benar-benar menilai sambungannya.
4. Kode Stage 1 lain (CT, P, MD) perlu diambil dari Cambridge Primary support site untuk mengisi 8 refs kosong.
