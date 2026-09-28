# Revisi visual Kebun Buah — 28 September 2026

## Pratinjau

- Kebun lengkap: `http://127.0.0.1:3100/dev/buah`
- Burung dari dekat, dapat diputar/zoom, jeda, dan ganti bulu: `http://127.0.0.1:3100/dev/buah/detail`
- Halaman aplikasi: `/buah-buahan`.

Kedua rute `dev` mengembalikan 404 pada build produksi. Publikasi aplikasi mengikuti integrasi Vercel dari branch `main`.

## Perubahan

Material daun, jalan tanah, kayu, batu, genteng, dan bulu dibuat khusus dengan GPT Image bawaan. File WebP berada di `public/fruits/garden/realism/`. Prompt, ukuran hasil asli, dan proses alpha/crop tercatat dalam `prompts.json` dan `feathers-prompt.json`. Rumput dan kulit batang memakai aset Rumila yang sudah tersedia di `public/roket/textures/`.

Vegetasi memakai batang lebih halus, cabang melengkung, kartu daun berlipat dengan atlas transparan, dan bilah rumput 3D yang melengkung. Bayangan daun mengikuti bentuk alpha dan gerakan angin yang sama dengan model terlihat. Tanah mencampur tekstur pada dua skala untuk mengurangi pengulangan.

Burung memakai tubuh dan kepala dengan material bulu, mata berkilau, paruh tertutup, jari kaki, ekor berlapis, bulu sekunder dan primer terpisah, serta sendi pangkal dan ujung sayap. Animasi berpindah halus antara mengepak dan meluncur. Dua palet bulu diulang pada tiga kelompok terbang; ini model ilustratif, bukan identifikasi spesies.

Sumur memiliki dinding terbuka, batu penutup, tiang, penguat, poros/engkol, lilitan tali, ember berbilah, lingkar logam, air beriak, dan genteng melengkung. Bangku memiliki bilah dudukan/punggung, kaki logam, dan baut. Rumah, pagar, bedengan, dan kandang menggunakan material kayu/tanah baru. Karakter tetap mengikuti bentuk ramah anak, dengan detail wajah, jahitan pakaian, topi anyaman, dan keranjang.

Ayam mendapat bulu ekor, material bulu, serta jari kaki. Capung memiliki abdomen beruas, mata, kaki, sayap transparan, dan urat sayap. Kupu-kupu memiliki kontur sayap dan pola warna. Kambing mendapat material bulu, telinga dalam, lubang hidung, dan kuku terbelah. Kolam memakai dasar bertekstur, tepian batu halus, dan koreksi warna air.

## Kinerja dan pemuatan

- Objek statis digabung menurut material. Jerami kandang menjadi satu mesh.
- Ponsel memakai DPR maksimum 1,5, bayangan 2048, serta jumlah burung/rumput lebih rendah. Desktop memakai DPR maksimum 2 dan bayangan 4096.
- Detail mikro material memudar sesuai jarak agar tidak berkelap-kelip.
- Texture canvas tetap berdimensi sama saat gambar selesai dimuat, sehingga sesuai alokasi immutable WebGL2 dan tetap kompatibel dengan source tekstur yang dipakai bersama.
- Respons gambar yang terlambat tidak mengaktifkan lagi texture yang sudah dibuang. Material fallback tetap tersedia jika pemuatan gagal.
- Sumber raster: 1254×1254 untuk daun/bulu; 627×627 untuk masing-masing material dari atlas. Geometri dan shader menambah detail. Aset ini bukan hasil pemindaian fotogrametri.

## Verifikasi

- `npm test`: 184 tes lulus. Delapan tes baru mencakup geometri finite, anggaran mesh/segitiga burung, kelancaran fase animasi, pemuatan tekstur tanpa perubahan dimensi, fallback, dan disposal.
- Tes baru diulang setelah perbaikan bentuk sayap: lulus.
- ESLint folder garden/rute detail dan `git diff --check`: lulus.
- `RUMILA_DIST_DIR=.next-fruits-build npm run build`: lulus setelah semua revisi render.
- HTTP produksi lokal: halaman buah dan enam WebP memberikan 200; rute pratinjau memberikan 404.
- Browser: tur berjalan melewati beberapa tanaman, kartu Apel terbuka, berjalan melalui area rumah/kandang/kolam, interaksi beri makan ikan, putar/zoom/jeda/ganti bulu pada pratinjau burung. Tidak ada error render yang tercatat pada pemeriksaan.
- Tata letak desktop 1280×720 dan viewport ponsel 390×844 sudah diperiksa; album ponsel dapat dibuka/ditutup. Ini pemeriksaan browser, bukan pengukuran pada perangkat fisik.
- Bukti visual lokal: `output/garden-realism/garden-desktop.png`, `bird-detail.png`, dan `mobile.png` (folder output diabaikan Git).

TypeScript kini memeriksa direktori sumber secara eksplisit agar cache build lama dari modul/rute yang sudah dihapus tidak ikut menggagalkan build. Tidak ada perubahan skema, akun, rekaman audio, atau progres server yang diperlukan.
