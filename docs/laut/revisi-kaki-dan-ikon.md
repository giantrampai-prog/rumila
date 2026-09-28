# Revisi kontak kaki dan ikon Jelajah Laut

28 September 2026.

## Kaki Agam

Posisi lama memakai tinggi panggul tetap sementara model penyelam dan kapal mempunyai transformasi berbeda. Akibatnya kaki tertanam di dek. Titik terbawah model sekarang diukur setelah skala dan orientasi diterapkan, kemudian ditempatkan pada permukaan papan kapal. Orientasi berdiri mengikuti gerakan naik-turun, pitch, dan roll kapal. Ini berlaku pada persiapan serta sebelum melompat masuk ke air.

Bevel lambung diturunkan agar permukaan lambung tidak menutupi papan dek. Kotak perlengkapan dipindahkan ke sisi kanan belakang Agam, sehingga kedua fin terlihat.

## Ikon biota

16 ikon dibuat terpisah menggunakan GPT Image, mode generate dengan tool bawaan. Gambar bergaya foto natural ini adalah ilustrasi sintetis untuk pendidikan, bukan foto dokumentasi hewan liar. Semua memakai latar biru gelap, satu subjek utuh, detail kulit/sisik/sirip, serta proporsi mata natural.

- Aset yang dipakai aplikasi: `public/laut/ikon/realistic-v1/*.webp` (768 × 512, total sekitar 471 KB).
- Prompt lengkap, ID biota, sumber PNG, dan jalur hasil: `docs/laut/ikon-realistis-v1.json`.
- Ikon memakai `object-contain` agar ekor/sirip tidak terpotong.
- Seluruh 16 gambar telah ditinjau dan diverifikasi termuat di browser.

## Model ikan pemancing

Model prosedural diperbarui dengan tubuh meruncing, mulut berongga, bibir menyatu, gigi tipis melengkung, mata kecil tanpa putih mata kartun, sirip berjari, tekstur pori dan bercak, serta umpan lebih kecil. Kamera memberi ruang untuk seluruh tubuh dan panel informasi, termasuk pada orientasi portrait. Ini model edukasi yang disederhanakan, bukan hasil pemindaian spesimen ilmiah.

## Verifikasi

- 194 pengujian lulus; termasuk kontak kedua kaki pada 24 posisi kapal, batas model, arah normal permukaan, dan anggaran geometri.
- TypeScript, ESLint file terkait, dan build produksi lulus.
- Bukti tampilan di `output/laut/revision-deck-contact.png`, `revision-realistic-icons.png`, dan `revision-mobile.png`.
- Perubahan ini disertakan bersama integrasi rekaman Algenib; lihat `rekaman-algenib/README.md`.
