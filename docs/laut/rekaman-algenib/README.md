# Narasi Algenib — 28 September 2026

Rekaman dan timestamp dikirim oleh pemilik aplikasi: `suara-jelajah-Algenib.wav` dan `timestamp-dongeng.txt`. Sumber WAV tidak diubah. Semua 1.274 kata cocok dengan naskah 17 bab aplikasi.

## Berkas yang dipakai

- `public/laut/voice/v2/algenib-20260928.m4a`: AAC mono 64 kbps, 24 kHz, sekitar 4,7 MB. Dikompresi dari WAV PCM 16-bit mono, 14.370.608 frame / 24.000 Hz = 598,775333 detik. Tidak dipotong, diubah tempo, atau diubah pitch. Sebagian decoder menampilkan tambahan padding AAC sekitar 0,094 detik; pemutar menunggu akhir media agar kata penutup tidak terpotong.
- `public/laut/voice/v2/manifest.json`: satu sumber audio untuk semua bab; `start`/`end` absolut, `cues` paragraf relatif terhadap awal bab.
- `public/laut/voice/v2/algenib-20260928.vtt`: 58 paragraf dengan timestamp absolut.
- `timestamp-dongeng.txt`: salinan timestamp asli, presisi satu detik.
- `bab-dan-timestamp.txt`: pemetaan bab dan paragraf untuk peninjauan.

## Sinkronisasi

`HTMLAudioElement.currentTime` menjadi acuan cerita, subtitle, posisi penjelajah, dan kamera. Jeda/buffering tidak menggerakkan cerita. Pergantian bab otomatis memakai elemen dan berkas yang sama tanpa jeda atau seek ulang. Tombol peta, sebelumnya/berikutnya, serta slider mencari posisi pada berkas ini. Bisu tetap menjalankan jam audio. Tab disembunyikan akan menjeda tur. Bila berkas gagal dimuat, aplikasi menyediakan mode baca bersama.

Panggung bab muncul pada awal timestamp bab. Kamera kemudian berpindah saat subjek disebut: ikan badut 01:31, penyu 01:41, kuda laut 02:02, manta 03:27, ikan pemancing 05:12, hewan sisir 05:24, ventilasi 05:46, ikan tripod 06:54, dan ikan siput hadal 07:37. Daftar lengkap berada di `src/lib/laut/timeline.ts`.

Agam berjalan dan melompat mengikuti hitungan di 00:39–00:44; percikan air pada kata “byur” di 00:44. Pandangan mengarah ke permukaan pada 00:51. Lampu kapal menyala pada 04:14. Adegan penutup dimulai 09:21. Semua timing mengikuti presisi timestamp kiriman, bukan estimasi kecepatan baca.

## Memperbarui

Jalankan dari akar aplikasi:

```sh
node --import tsx scripts/import-sea-recording.ts
```

Skrip memeriksa setiap kata dan urutan timestamp sebelum membentuk manifest, VTT, dan daftar bab. Jika memakai rekaman baru, perbarui sumber audio, frame/sample-rate durasi, timestamp, dan cue aksi/kamera secara bersamaan. Manifest dibundel saat build agar klik pertama langsung menggunakan rekaman; perubahan membutuhkan build/deploy baru.

## Verifikasi rilis

204 pengujian lulus, termasuk kecocokan seluruh kata/timestamp, perpindahan 17 bab, seek maju/mundur, buffering, jeda, bisu, kegagalan audio, dan akhir rekaman dengan padding AAC. Semua awal bab diuji lewat slider di browser; pergantian otomatis, layar selesai, serta ulang dari awal juga diperiksa. Tampilan desktop dan ponsel ditinjau. Bukti lokal disimpan di `output/laut/`.
