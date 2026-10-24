# Tinjauan KODE-SD3.json — 2026-10-25
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge). Konteks usia SD 3 = 8–9 tahun, membaca lancar kalimat pendek.
Validator: bersih untuk berkas ini (0 error; 9 peringatan "tidak ada kode acuan kerangka internasional").

Acuan: Cambridge Primary Computing (0059) Stage 3, hanya sebagai referensi. Kamus baru `content/kerangka/cambridge-primary-computing-kode-sd1-3.json` menambah `3MD.03` (verified: dikutip dengan kodenya di halaman Cambridge Community) dan dipakai di DATA.01. Baris Progression Grid Stage 3 "Follow, understand, edit and correct linear algorithms" dikutip tanpa kode, jadi hanya disebut di `catatan` ALGORITMA.01.

Prasyarat: hanya ke KODE SD 1–SD 3.

## Putaran 1 (draf)

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| ALGORITMA.01 | 15 (K5 1) | LULUS | Perbaiki satu tukar pada 7–8 kartu bertulisan; tukar boleh berjarak satu. |
| KONDISI.01 | 13 (K4 1) | REVISI | Peta terbuka: BFS gabungan menemukan urutan maju/lompat/belok tanpa kalau yang lolos di ketiga peta (jalan memutar lewat petak kosong). Kalau tidak benar-benar dibutuhkan. |
| DEBUG.01 | 16 | LULUS | Dua kesalahan di dua keping berbeda; generator memastikan tidak ada perbaikan satu perubahan (termasuk mengganti satu keping dengan ulangi apa pun). |
| PREDIKSI.01 | 15 (K8 1) | LULUS | Prediksi langkah ketika kalau dievaluasi ulang tiap putaran. Pengaya. |
| EFISIEN.01 | 12 (K1 1, K4 1) | REVISI | Statement menjanjikan "program 10–16 perintah", padahal lompat di petak kosong membuat jalur hanya 7–10 perintah; di peta terbuka ada program 6 blok dengan satu ulangi, jadi "dua pola" tidak terbukti. |
| DATA.01 | 14 (K2 1, K6 1) | LULUS | 3MD.03 cocok. Keterampilannya serumpun dengan MAT TK B DATA.01 (turus); yang baru hanya volume, kecepatan, dan "di perangkat". Jujur ditandai pengaya. |
| JARINGAN.01 | 15 (K5 1) | LULUS | Empat urutan perjalanan pesan, 5–6 langkah; "server" dijelaskan di kartu. |
| JARINGAN.02 | 15 (K5 1) | LULUS | Pilah butuh/tanpa internet; kegiatan abu-abu (game daring/luring) dihindari. |
| PERANGKAT.01 | 15 (K5 1) | LULUS | Masuk/simpan/tampil; knob binCount 2 mengulang SD 2. |
| POLA.01 | 15 (K5 1) | LULUS | Mode cipta, depth `cipta`. Pengaya. |

## Perbaikan yang sudah dikerjakan (putaran 2)

- KONDISI.01: petak di luar jalur kini berdinding (koridor), dan tiap kelompok tiga peta dipilih dengan BFS gabungan sampai **tidak ada** urutan maju/lompat/belok tanpa kalau yang lolos di ketiganya. 21 kelompok lolos. Catatan diperbarui. → LULUS (16).
- EFISIEN.01: statement diganti menjadi "memakai dua blok ulangi untuk dua pola berbeda di satu jalur supaya program muat di 6 blok"; peta dibuat koridor, bagian lurus 5–6 petak, dan generator mencoba semua program ≤ 6 blok: yang lolos selalu memakai dua ulangi. 32 peta. → LULUS (15).

**Hasil akhir: 10 LULUS.**

## Catatan urutan & prasyarat

- ALGORITMA.01 ← SD2.ALGORITMA.01; KONDISI.01 ← SD2.KONDISI.01; DEBUG.01 ← SD2.DEBUG.01 + SD2.KONDISI.01; PREDIKSI.01 ← SD1.PREDIKSI.01 + SD2.KONDISI.01; EFISIEN.01 ← SD2.ULANGI.01 + SD2.EFISIEN.01.
- DATA.01 ← SD2.DATA.01 (serumpun: data kategori). JARINGAN.02 ← JARINGAN.01. PERANGKAT.01 ← SD2.PERANGKAT.01.

## Untuk diputuskan PO

1. **Kode teks pertama (Python/JS), fungsi berparameter, list, proyek aplikasi** (topik SD 3) tidak bisa dibuktikan dengan enam mekanik yang ada. Perlu mekanik baru (mis. editor blok→teks); tidak ditulis.
2. Dekomposisi dengan bendera tidak dipakai di SD 3: `nilaiNavigasi` membandingkan **total** blok kedua rak (+ bendera) dengan `rackSlots`, padahal presenter membatasi `rackSlots` **per rak**. Akibatnya jawaban benar di paket TK B `bendera-dua-program` dinilai salah (dicoba: program 3 + bendera + 3 blok, rak 4 → `benar: false`, `benderaTepat: true`). Perlu perbaikan di `packages/mechanics/src/navigasi.ts` (di luar wewenang batch ini).
3. DATA.01 tumpang tindih dengan MAT TK B DATA.01; bila PO ingin KODE murni, ganti dengan mekanik tabel/basis data bercabang saat tersedia.
