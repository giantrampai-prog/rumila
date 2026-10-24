# Tinjauan KODE-SD5.json — 2026-10-25
Persona: Guru Computing SD (sekolah Cambridge, Stage 3–6). Konteks usia SD 5 = 10–11 tahun.
Catatan proses: penulis dan peninjau agen yang sama, dua putaran terpisah; tinjauan agen lain tetap disarankan.

Validator (bagian berkas ini): 0 error, 10 peringatan — 9× "tidak ada kode acuan kerangka internasional", 1× "ref CAMBRIDGE_PRIMARY_COMPUTING:5CS.01 belum terverifikasi" (INTERNET.02; teks kamus terpotong).

Kode Stage 5 di kamus hanya `5CS.01` dan `5DC.07`. Inti Stage 5 adalah selection ("Follow, understand, edit and correct algorithms that contain selection" — terbaca tanpa kode), jadi seluruh unit KONDISI memakai `refs: []` dengan catatan.

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| KONDISI.01 | 15 (K5 1) | LULUS | Solver memastikan untuk tiap kelompok 3 jalur: tidak ada program ≤ 5 keping tanpa `kalau` yang lolos. Kunci desain: jumlah batu di segmen pertama sama di ketiga jalur (letak berbeda) supaya angka ulangan sebelum belok tunggal. |
| KONDISI.02 | 15 (K4 1) | LULUS | Banyak soal dua pilihan (peluang tebak 50%); karena itu `mastery` dinaikkan { minSuccess 5, minRatioLast10 0.8 }. Tetap lebih lemah dari soal tiga pilihan. |
| KONDISI.03 | 16 | LULUS | Item batas 90/89/75/74; jebakan "95 juga ≥ 75" menguji urutan cek dari atas. |
| DEBUG.01 | 16 | LULUS | Bug utama "maju padahal perlu kalau" lolos di jalur tanpa batu dan gagal di yang lain: persis statement. Diverifikasi perbaikan satu blok ada. |
| ULANGI-KONDISI.01 | 16 | LULUS | |
| LIST.01 | 16 | LULUS | Pilihan "error (tidak ada)" muncul di 5 soal, hanya satu yang jawabannya error, jadi bukan petunjuk. |
| TIPE-DATA.01 | 15 (K3 1) | LULUS | `5 > 3` sebagai boolean melompat ke ekspresi; dibiarkan sebagai jebakan pengaya. |
| URUT.01 | 16 | LULUS | Jawaban dihitung kode (tidak ada salah hitung manual). Dua soal "satu putaran" kebetulan sudah urut penuh; pengecohnya otomatis diganti. |
| INTERNET.01 | 16 | LULUS | `5DC.07` cocok langsung. |
| INTERNET.02 | 13 (K2 1, K5 1) | LULUS | Ref belum terverifikasi; "kirim data lewat internet" vs "bekerja sendiri" lebih sempit dari 5CS.01 (skala perangkat). Pengaya. |
| AMAN.01 | 16 | LULUS | Instruksi menutup dengan tindakan (jangan balas, tunjukkan ke orang dewasa). |

**Hasil akhir: 11 LULUS.** Revisi besar terjadi di tingkat rancangan (dua kompetensi dikeluarkan, lihat bawah). 9 inti, 2 pengaya.

## Dikeluarkan dari draf
- **DEKOMPOSISI dengan bendera + ulangi** (navigasi). Saat menguji, ditemukan `nilaiNavigasi` menghitung `blocks` dari program gabungan (bagian 1 + bendera + bagian 2) lalu membandingkannya dengan `rackSlots`, padahal presenter membatasi tiap rak terpisah. Akibatnya paket bendera dengan `rackSlots` tidak pernah dinilai benar. Paket TK B `bendera-dua-program` (rackSlots 4, jalur 6–7) tampaknya terkena. Tidak diperbaiki di sini (bukan berkas saya) — lihat butir PO.
- **Prediksi langkah dengan kalau** (navigasi `langkah` + `prediksi`). `nilaiNavigasi` tidak memakai `prediksiBenar` untuk `benar`; ronde selalu benar bila program bawaan sampai bintang. Bukti terlalu lemah untuk kompetensi tracing; diganti soal telusur di pilah (ULANGI-KONDISI.01).

## Untuk diputuskan PO
1. **Bug bendera**: perbaiki `nilaiNavigasi` agar `rakBeres` memeriksa tiap bagian (`j.bendera.bagian`) terhadap `rackSlots`, lalu kompetensi dekomposisi SD bisa ditulis.
2. **Prediksi**: jadikan `prediksiBenar / prediksiTotal ≥ ambang` bagian dari `benar` untuk paket `prediksi: true` (berdampak juga ke TK B PROGRAM-5-8.02).
3. **Kalau bebas**: `mekanik-navigasi.md` menyebut "blok kalau bebas (cabang dipilih sendiri) baru di SD 1", tetapi mesin hanya punya keping tetap "batu? lompat : maju". Selection yang lebih kaya di SD 5 karena itu dibuktikan lewat pilah.
