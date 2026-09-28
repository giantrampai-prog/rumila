# Informasi dan kamera Misi Roket

`src/lib/roket/timeline.ts` menjadi sumber bersama untuk kartu informasi,
teks narasi, dan target kamera pada seluruh 21 bab. Kamera mengikuti posisi objek
3D, termasuk astronaut bergerak, tahap yang terlepas, stasiun, dan satelit.
Di dalam kapsul, kamera beralih ke kursi, konsol gaya G, atau boneka.

## Acuan waktu

- Rekaman aktif: `public/roket/voice/misi-02.m4a` (402,080542 detik).
- Awal bab mengikuti `MISI_AUDIO.cues` yang sudah ada.
- Penanda di dalam bab memakai detik lokal. Batas kalimat diperkirakan dari
  naskah, lalu dicocokkan dengan jeda hening rekaman PCM 24 kHz.
- Frasa tanpa jeda yang jelas (meteor, hidup di stasiun) masih merupakan
  perkiraan; ini bukan hasil transkripsi dengan timestamp per kata.
- Hitung mundur tetap memakai `COUNT_ONSETS` yang telah diukur sebelumnya.
- Jika mengganti rekaman, sesuaikan durasi, awal bab, dan penanda frasa bersama.
  Jangan hanya mengganti URL suara.

## Perilaku

Rekaman merupakan jam utama. Jeda menghentikan narasi dan perjalanan;
penggeser memindahkan suara, kartu, dan kamera sekaligus, termasuk ketika jeda.
Pilihan bab dapat digunakan untuk mengulang penjelasan tertentu. Kartu informasi
tetap terlihat ketika suara tersedia; tombol Teks menampilkan kalimat narasi.
Tidak ada suara kedua yang diputar oleh kartu informasi.

Perpindahan kamera menggunakan peredaman berdasarkan waktu bingkai dan mematuhi
preferensi reduced motion. Framing menyediakan ruang untuk informasi di bawah.
Audio yang ditolak browser menampilkan opsi mencoba lagi, tanpa memajukan adegan.

## Verifikasi

Uji `src/lib/roket/timeline.test.ts` memeriksa cakupan setiap bab, batas perpindahan,
seek mundur, referensi kalimat, durasi, dan hitung mundur. Pemeriksaan browser
meliputi tampilan desktop/ponsel, pemutaran, jeda, perpindahan bab, teks, dan seek.
