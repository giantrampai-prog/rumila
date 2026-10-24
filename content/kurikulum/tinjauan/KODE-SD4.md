# Tinjauan KODE-SD4.json — 2026-10-25
Persona: Guru Computing SD (sekolah Cambridge, mengajar Stage 3–6; skeptis pada soal yang bisa ditebak dan pada "coding" yang sebenarnya hanya hafalan istilah). Konteks usia SD 4 = 9–10 tahun, sudah lancar membaca kalimat pendek.
Catatan proses: ditulis dan ditinjau oleh agen yang sama dalam dua putaran terpisah (draf → tinjauan kritis → perbaikan). Ini lebih lemah daripada peninjau terpisah yang diminta `produksi-konten.md`; tinjauan oleh agen lain tetap disarankan sebelum PO menyetujui.

Validator (bagian berkas ini): 0 error, 7 peringatan, semuanya "tidak ada kode acuan kerangka internasional" (VARIABEL.01, IPO.01, PERANGKAT.01, CARI.01, JARINGAN.01, AMAN.01, DEBUG.02); tidak ada ref belum terverifikasi.

Kamus baru: `content/kerangka/cambridge-primary-computing-kode-sd4-6.json` (7 kode Stage 4–6 dari halaman Cambridge Community, 6 verified, 5CS.01 tidak). Stage 4 hanya punya `4P.02` (repetition) dan `4P.03` (iteration) yang berkode; butir progresi Stage 4 "edit and correct algorithms that use iteration" terbaca tanpa kode sehingga tidak dipakai sebagai ref.

Skor /16 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan). Tafsir K5 sama dengan KODE-TKB: `[]` + alasan jujur = 2.

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| ULANGI.01 | 16 | LULUS | Rak 5 keping vs jalur 7–13 blok: ulangi dipaksa mekanik, bukan instruksi. 33 peta, diverifikasi `optimal()` > rak dan solusi ≤ 5 keping ada. |
| ULANGI.02 | 15 (K8 1→2) | LULUS setelah revisi | Draf: varian "lompat-maju + satu maju di ekor" ternyata bisa diselesaikan 4 blok tanpa ulangi (lompat dua kali di ujung) sehingga rak 4 tidak memaksa. Dibuang; tersisa 20 peta, semua lolos uji "lompat terus / maju terus gagal". |
| DEBUG.01 | 15 (K4 1) | LULUS | Satu mutasi; tiap peta diverifikasi punya perbaikan satu blok. Risiko: anak memutar angka ulangan sampai berhasil (coba-coba). Mesin mencatat `runs`; tidak menjadi syarat. |
| DEBUG.02 | 16 | LULUS | Diverifikasi: tidak ada perbaikan satu blok yang cukup, jadi "tepat dua" memang perlu. Pengaya. |
| VARIABEL.01 | 14 (K3 1→2, K8 1→2) | LULUS setelah revisi | Draf memakai `*` tanpa penjelasan; anak SD 4 Indonesia mengenal "×". Instruksi kini menyebut "* artinya dikali". |
| VARIABEL.02 | 15 (K5 1) | LULUS | `4P.03` hanya mirip (menelusuri, bukan menulis program). Soal terbalik "ulangi berapa kali supaya x = 20" bagus. |
| IPO.01 | 14 (K4 1→2, K7 1→2) | LULUS setelah revisi | (a) Knob `steps 3` memotong baris "tampilkan" sehingga ronde tidak lagi masukan-proses-keluaran: knob dikunci 4. (b) "minta suhu dalam °C" tidak menamai `c` padahal baris berikut memakai `c`: diganti "c = suhu °C dari pengguna". |
| PERANGKAT.01 | 16 | LULUS | Layar sentuh sengaja dikeluarkan (masukan sekaligus keluaran). |
| CARI.01 | 16 | LULUS | Pengecoh "nilai target dikira posisi" tepat sasaran. Jembatan ke bagi dua SD 6. |
| JARINGAN.01 | 15 (K6 1) | LULUS | Tanpa prasyarat; wajar sebagai pintu strand jaringan, tetapi PO perlu tahu SD 1–3 (agen lain) mungkin sudah punya "kabel / tanpa kabel" yang semestinya jadi prasyarat. |
| AMAN.01 | 16 | LULUS | Konteks "kepada orang tak dikenal" dikunci di instruksi supaya "nama panggilan di game" tidak ambigu. |

**Hasil akhir: 11 LULUS** (3 setelah revisi). 9 inti, 2 pengaya.

## Catatan urutan & prasyarat
- Prasyarat hanya menunjuk ke dalam SD4–SD6 track KODE (sesuai batas tugas). Akibatnya 6 kompetensi SD 4 tidak berprasyarat; setelah KODE-SD1..3 selesai, sambungkan ULANGI.01 ← perulangan SD 1–3, VARIABEL.01 ← variabel SD 1, JARINGAN.01 ← "kabel / tanpa kabel".
- ULANGI.01 → ULANGI.02, DEBUG.01 → DEBUG.02, VARIABEL.01 → VARIABEL.02. CARI.01 ← ULANGI.01 (pencarian = perulangan yang berhenti saat ketemu).
- Persebaran mekanik: 4 navigasi, 5 pilah, 2 urutkan. Kurikulum SD 4 menyebut "Python dasar: variabel, input, output" — dibuktikan lewat membaca/menelusuri kode (pilah), bukan mengetik kode: tidak ada mekanik ketik.

## Untuk diputuskan PO
1. **Teks pada kartu**: presenter pilah/urutkan hanya menampilkan label bila kartu tanpa emoji, dengan ukuran huruf = 0,6 × ukuran kartu × `scale`. Semua paket SD 4–6 memakai kartu teks dengan `scale` 0,34–0,5 agar huruf ±15–20 px. Ini memakai `scale` untuk tipografi, bukan makna besar/kecil. Belum dicek visual (katalog belum di-index). Lebih baik presenter punya mode "kartu teks" resmi.
2. **Ketik kode**: SD 4 versi kurikulum.md menulis "Python dasar". Mekanik yang ada membuktikan membaca/menelusuri, bukan menulis. Perlu mekanik baru (mis. `bangun` blok teks) bila menulis kode menjadi syarat lencana.
