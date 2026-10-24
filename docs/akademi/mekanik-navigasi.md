# Mekanik Navigasi — semantik blok (dikunci)

Berlaku untuk semua kompetensi yang memakai mekanik `navigasi` (Robot ke bintang). Ditetapkan 24 Okt 2026 setelah tinjauan KODE PAUD–TK B. Perubahan di sini berarti meninjau ulang kompetensi yang memakainya.

| Blok | Arti | Catatan |
|---|---|---|
| `maju` | robot pindah 1 petak ke arah hadap | menabrak dinding atau batu = tersandung, program berhenti, boleh diubah tanpa penalti |
| `lompat` | robot pindah **2 petak** ke arah hadap, melewati petak di depannya | satu-satunya cara melewati batu; di petak kosong tetap 2 petak, sehingga bisa meleset dari bintang. Ini yang membuat "lompat semua" gagal |
| `kiri` / `kanan` | robot berputar 90° di tempat, relatif terhadap arah hadap robot | PAUD–TK A: robot selalu ditampilkan dari belakang agar kiri anak = kiri robot |
| `ulangi N` | mengulang isi blok N kali | TK B: N dipilih 2–6, isi 1–2 blok; bersarang hanya di SD 1 ke atas |
| `kalau batu → lompat, kalau tidak → maju` | satu keping dengan dua cabang bawaan; selalu memajukan robot | TK B. Blok `kalau` bebas (cabang dipilih sendiri) baru di SD 1 |
| `bendera` | titik pecah program; bagian 1 harus berakhir di bendera | TK B dekomposisi |

Mode eksekusi:
- **Langsung** (PAUD): tiap tombol dijalankan seketika. Tidak ada rak program.
- **Program** (TK A ke atas): blok disusun di rak, lalu tombol jalan. Rak punya batas slot; batas itulah yang memaksa perulangan dan dekomposisi, bukan instruksi.
- **Langkah** (TK B pengaya): menjalankan satu blok per ketukan, tanpa menyorot blok aktif, untuk prediksi dan debugging.

Bukti yang dicatat mesin: sampai bintang / meleset / tersandung, jumlah blok vs optimal, jumlah perubahan sebelum sukses, jumlah lompat vs jumlah batu, prediksi benar per langkah.
