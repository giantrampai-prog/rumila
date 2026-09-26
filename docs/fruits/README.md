# Kebun Buah 3D · Rumila

Modul `/buah-buahan`, dibuka dari Edukasi → Buah-buahan. Katalog berisi 48 buah yang umum dikenal atau dijual di Indonesia, termasuk pilihan Nusantara. Pengelompokan membantu penjelajahan; bukan klaim asal geografis atau ketersediaan di semua daerah.

## Naskah narasi

- `public/fruits/narasi/narasi-buah.txt`: semua naskah beserta panduan suara.
- `public/fruits/narasi/narasi-buah.csv`: 50 baris, yaitu 48 buah, pembuka, dan penutup. Kolom: `id`, `nama`, `nama_berkas_audio`, `naskah`.
- `public/fruits/narasi/per-buah/<id>.txt`: hanya teks yang dibacakan, tanpa instruksi produksi.
- `public/fruits/narasi/panduan-suara.txt`: arahan gaya suara untuk Google Voice.

Narasi buah 47–71 kata, sekitar 25–40 detik menurut tempo dan jeda. Gunakan satu karakter suara hangat, ceria, dan alami. Jangan baca judul, nama berkas, atau instruksi produksi. Pembuka dan penutup adalah materi tambahan; tidak diputar otomatis oleh modul.

Contoh alur produksi:
1. Ambil panduan suara, lalu naskah satu buah.
2. Generate suara menggunakan layanan Google yang kamu pilih.
3. Dengarkan dan cek pengucapan nama buah serta jeda ajakan mengamati.
4. Ekspor MP3, WAV, atau M4A, maksimal 20 MB per berkas. Nama berkas yang disarankan ada di CSV.
5. Setelah penyimpanan server diaktifkan, buka buah terkait lewat profil admin → Unggah rekaman → pilih berkas. Pemilihan buah menentukan tujuan; nama berkas unggahan tidak harus persis sama.

Teks utama bersumber dari `src/lib/fruits/catalog.ts`; sapaan dan ajakan khusus tiap buah dari `src/lib/fruits/narration.ts`. Setelah revisi jalankan `node --import tsx scripts/fruits/export-narration.ts` lalu `python3 scripts/fruits/pack-narration.py` untuk menyamakan berkas unduhan dan paket ZIP.

## Tampilan dan model

- Three.js: model 3D asli yang dapat diputar, diperbesar, direset, serta dibuka memenuhi viewport, termasuk pada browser dalam aplikasi. Keyboard: panah untuk memutar, `+`/`-` untuk zoom, `0` untuk reset.
- Model adalah ilustrasi parametrik orisinal untuk pengenalan bentuk, bukan pemindaian fotorealistis. Warna buah alami, terpisah dari warna antarmuka.
- Bentuk khas meliputi pisang melengkung, rambut rambutan, duri durian, rusuk belimbing, mahkota nanas, sisik buah naga, dan gerombol anggur.
- Halaman awal katalog penuh: empat kartu per baris di desktop, dua di ponsel/tablet kecil. Pencarian dan filter dipertahankan ketika kembali dari detail.
- Klik kartu membuka detail dengan tab Putar 3D dan Foto asli. URL `?buah=<id>` dapat dibagikan.
- Satu renderer hanya pada detail 3D. DPR maksimal 2; geometri dan tekstur lama dilepas saat berganti. Permukaan memakai bump/roughness 1024 px untuk pori, sisik, serat, dan kerutan.
- 48 foto asli tersimpan lokal; WebP 480 px untuk kartu dan hingga 1280 px untuk detail. Kredit, tautan sumber, dan lisensi per foto tersedia pada detail dan `PHOTO_CREDITS.md`. Thumbnail model PNG dipertahankan untuk fallback WebGL.
- Tidak ada putaran otomatis sebelum dipilih pengguna. Render berhenti saat tab tersembunyi. Pengguna masih dapat membaca teks saat WebGL tidak tersedia.
- Klik kartu atau navigasi buah memulai rekaman otomatis jika tersedia. Membuka tautan langsung tidak memaksa autoplay. Jika browser memblokir autoplay, kontrol Putar tetap tersedia. Rekaman berhenti saat buah/profil/halaman berubah atau tab disembunyikan.
- Pencarian nama Indonesia, Inggris, serta alias kelengkeng dan duwet. Detail: keterangan, warna kulit dan daging, rasa, biji, fakta, dan narasi.

Regenerasi thumbnail: `node --import tsx scripts/fruits/export-models.ts`, lalu Blender background menjalankan `scripts/fruits/render-thumbnails.py`. GLB perantara masuk `output/fruits/models`, tidak dikirim ke klien. Geometri runtime dan thumbnail berasal dari sumber model yang sama.

## Penyimpanan suara

Migrasi siap: `supabase/migrations/20260926080000_rumila_fruit_audio.sql`.

**Status:** penerapan ke Supabase terhubung menunggu persetujuan eksplisit. Review persetujuan otomatis menolak perubahan skema/aturan akses langsung di proyek produksi/shared. Tidak ada bucket atau policy yang diterapkan oleh tugas ini sebelum persetujuan.

Desain penyimpanan:
- Bucket `fruit-audio`, privat, batas 20 MB, MIME audio saja.
- Objek `{family_id}/fruits/{fruit_id}.{mp3|wav|m4a}`; ID buah harus ada dalam daftar.
- RLS memeriksa keanggotaan keluarga memakai `is_family_user` dan `family_of_path` yang sudah digunakan Rumila.
- Pemutar memakai URL bertanda tangan dengan masa berlaku satu jam; diperbarui setelah 50 menit.
- Tombol unggah tersedia di profil admin. Batas keamanan server mengikuti akun keluarga Rumila: beberapa profil memakai satu identitas Supabase Auth. Ini bukan autentikasi admin terpisah di server.
- Unggahan baru mengganti berkas dengan nama/ekstensi sama. Jika ada beberapa format, rekaman dengan waktu pembaruan terbaru digunakan.
- Tidak ada policy delete dan tidak ada perubahan bucket dokumen keuangan.
- `public/fruits/audio/manifest.json` menyediakan alternatif rekaman bawaan aplikasi; kosong sampai ada rekaman sungguhan. Hanya path audio buah lokal yang diterima.

Belum ada suara Google yang dipasang. Status di aplikasi harus tetap jujur ketika audio belum tersedia. Jangan memasukkan contoh bunyi uji sebagai narasi anak.

## Validasi

- `npx vitest run src/lib/fruits/__tests__`: semua model punya koordinat/normal finite, terpusat, ukuran konsisten, dan anggaran kurang dari 100.000 segitiga; validasi signature, ukuran, dan path unggahan.
- `npx tsc --noEmit` serta ESLint file modul.
- QA browser: grid empat kolom desktop, dua kolom ponsel, pencarian, pemilihan buah, tab foto asli, tampilan memenuhi viewport, detail cerita, dan unduhan naskah.
- Autoplay diverifikasi memakai fixture audio lokal sementara: pemutar berjalan setelah klik buah, lalu berhenti saat kembali ke katalog. Fixture dihapus setelah pemeriksaan.
- 48 foto detail, 48 thumbnail foto, 48 naskah, dan 48 fallback model diperiksa tersedia dan dapat dibaca.
- Unggahan server menunggu penerapan migrasi dan verifikasi sesudah persetujuan.

## Rujukan isi

- Kementerian Pertanian, “Kekayaan Buah Tropis Nusantara dari Indonesia untuk Dunia”: https://www.pertanian.go.id/home/?act=view&id=1838&show=news
- Royal Horticultural Society, buah-buahan: https://www.rhs.org.uk/fruit

Ciri buah disederhanakan untuk anak. Bentuk, warna, ukuran, biji, dan rasa dapat bervariasi menurut jenis serta kematangan. Narasi tidak membuat klaim kesehatan atau menjanjikan manfaat medis.
