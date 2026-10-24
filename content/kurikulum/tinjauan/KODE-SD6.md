# Tinjauan KODE-SD6.json — 2026-10-25
Persona: Guru Computing SD (sekolah Cambridge, Stage 3–6; pernah menyiapkan anak ke Lower Secondary). Konteks usia SD 6 = 11–12 tahun.
Catatan proses: penulis dan peninjau agen yang sama, dua putaran terpisah; tinjauan agen lain tetap disarankan.

Validator (bagian berkas ini): 0 error, 10 peringatan "tidak ada kode acuan kerangka internasional" (FLOWCHART.01/.02, KONDISI-GABUNG.01, DEBUG.01, AI.01/.02, SANDI.01, API.01, GIT.01, CARI-BAGI-DUA.01). Tiga kompetensi memakai kode terverifikasi: `6CT.05`, `6P.02`, `6CS.08`.

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| SUBRUTIN.01 | 15 (K8 1→2) | LULUS setelah revisi | Draf soal `def naik(): skor = skor + 10` salah di Python sungguhan (perlu `global`). Diganti kalimat "Fungsi naik() menambah 10 ke skor". |
| SUBRUTIN.02 | 14 (K4 1, K5 1) | LULUS | Anak memilih bagian yang dijadikan prosedur, belum menyusun prosedur sendiri; `6P.02` hanya sebagian. Butuh mekanik blok prosedur. |
| FLOWCHART.01 | 16 | LULUS | Bin memakai glif ⬭ ▱ ▭ ◇ sebagai emoji; perlu cek visual. |
| FLOWCHART.02 | 14 (K4 1) | LULUS | Diagram alir ditulis sebagai rangkaian panah, bukan gambar. Membuktikan penelusuran, tetapi Stage 6 menekankan diagram visual. |
| KONDISI-GABUNG.01 | 15 (K8 1→2) | LULUS setelah revisi | Rancangan awal berupa satu aturan per paket (kelompok); diganti mode pilih dengan 12 aturan berbeda dan tepat satu kandidat yang memenuhi, supaya dan/atau/bukan semua teruji. |
| DEBUG.01 | 16 | LULUS | Solver: tidak ada perbaikan satu blok yang cukup; 16 kelompok × 3 jalur. |
| AI.01 | 14 (K2 1→2) | LULUS setelah revisi | Draf memuat "menandai email sampah" yang bisa aturan atau belajar → ambigu, diganti "mengenali lagu dari potongan suaranya". |
| AI.02 | 15 (K1 1→2) | LULUS setelah revisi | Draf berbunyi "Aku bisa menjelaskan …" padahal bukti hanya memilih penjelasan dari tiga; statement diganti "memilih penjelasan tepat …". Pengaya. |
| SANDI.01 | 16 | LULUS | Contoh kata sandi kuat dikarang dan disebut "contoh", bukan untuk dipakai. |
| ROBOT.01 | 15 (K3 1) | LULUS | Lebih ke literasi daripada coding; cocok dengan strand Computer Systems. Pengaya. |
| API.01 | 14 (K4 1) | LULUS | Lima urutan berpola sama; setelah dua ronde anak bisa menghafal pola. Pengaya. |
| GIT.01 | 14 (K3 1) | LULUS | Istilah git (pull, branch, commit, push) dalam kurung. "uji lalu commit" adalah aturan tim, bukan hukum git; dicatat di catatan. Pengaya. |
| CARI-BAGI-DUA.01 | 16 | LULUS | Aturan tengah-kiri dikunci di instruksi; jawaban dihitung kode. |

**Hasil akhir: 13 LULUS** (4 setelah revisi). 9 inti, 4 pengaya.

## Catatan urutan & prasyarat
- SUBRUTIN.01 ← SD4.VARIABEL.02; FLOWCHART.02 ← FLOWCHART.01 + SD5.ULANGI-KONDISI.01; KONDISI-GABUNG.01 ← SD5.KONDISI.03; DEBUG.01 ← SD5.DEBUG.01; CARI-BAGI-DUA.01 ← SD5.URUT.01 + SD4.CARI.01; SANDI.01 ← SD5.AMAN.01. Tidak ada siklus (validator).
- Topik kurikulum.md SD 6 yang belum tercakup: "Proyek akhir: aplikasi atau game utuh" — tidak bisa dibuktikan dengan enam mekanik yang ada.

## Untuk diputuskan PO
1. **Mekanik prosedur** (navigasi dengan blok "jurus" yang didefinisikan sekali lalu dipanggil) akan membuat SUBRUTIN.02 sungguh `6P.02` dan memberi KODE SD 6 tugas `cipta`.
2. **Presenter diagram alir** bergambar untuk FLOWCHART.02.
3. **Ref Stage 6**: lengkapi kamus dari framework 0059 resmi; 10 kompetensi menunggu kode.
