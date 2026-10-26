# Umroh Virtual

Modul pembelajaran berbahasa Indonesia ini mengenalkan urutan dari persiapan dan miqat sampai tahallul. Dua pilihan perjalanan adalah dari Madinah melalui Bir Ali atau melalui penerbangan; pilihan putra/putri menyesuaikan petunjuk pakaian, sa'i, dan rambut.

## Menjelajahi lingkungan

Lingkungan memenuhi area utama layar. Panel panduan selebar 330 piksel di desktop dapat ditutup melalui tombol Panduan; tombol utama pelajaran tetap tersedia di bagian bawah, termasuk pada ponsel. Kamera menyediakan Jalan kaki, Ikuti jamaah, dan Lihat kawasan, dengan pilihan cahaya Siang atau Senja. Navigasi berjalan menggunakan WASD/tombol arah atau pad sentuh, sementara geseran mengubah arah pandang. Dialog, perpindahan kamera, dan kehilangan fokus menghentikan input gerak. Peta menampilkan titik kunjungan dari lokasi yang sedang aktif.

Masjid Nabawi tersedia sebagai kunjungan pilihan pada jalur Madinah, melalui persiapan atau peta. Kunjungan ini bukan miqat, bukan rukun, dan tidak menambah tahap umroh. Tombol Kembali ke pelajaran mengembalikan lokasi sesuai tahap tanpa mengubah hitungan latihan. Kunjungan, kamera, suasana cahaya, dan kecepatan tidak mengubah format progres versi 1.

## Cakupan pelajaran

Urutan: persiapan → miqat → perjalanan → masuk Masjidil Haram → tawaf → salat sunah → Zamzam → sa'i → tahallul → selesai.

Tawaf menampilkan tujuh putaran berlawanan arah jarum jam, dengan Ka'bah di sebelah kiri dan lintasan di luar Hijir Ismail. Sa'i menghitung setiap perjalanan satu arah: Safa–Marwah pertama, Marwah–Safa kedua, hingga ketujuh berakhir di Marwah. Tahap miqat mengajarkan niat secara eksplisit; mengganti pakaian atau menekan tombol bukan pengganti niat ibadah.

Salat setelah tawaf dan minum Zamzam dinyatakan sebagai amalan sunah. Tahap-tahap tersebut merupakan bagian alur belajar, bukan penilaian sah/tidaknya umroh. Anjuran berlari kecil bagi putra di bagian sa'i yang bertanda hijau juga tidak diberi skor atau diperlakukan sebagai syarat. Tidak ada penghitungan pahala atau peringkat kesalehan.

## Rujukan dan batas editorial

- [JAWHAR, Panduan Haji dan Umrah](https://www.jawhar.gov.my/haji-dan-umrah/panduan-haji-dan-umrah/), bagian rukun, wajib umrah, miqat, tawaf, sa'i, dan tahallul. Halaman dibaca dan dapat diakses pada 27 Oktober 2026; tautan ini tersedia di antarmuka. Rujukan dipakai untuk urutan ibadah, bukan seluruh aturan layanan/perjalanan dari yurisdiksi lain.
- Kementerian Agama RI, *Tuntunan Manasik Haji dan Umrah 1445 H/2024 M*, halaman cetak 131: salat sunah dua rakaat, pilihan lokasi aman, dan Zamzam. Bagian ini diverifikasi melalui teks terindeks dari publikasi resmi; berkas unduh lengkap tidak dijadikan tautan antarmuka karena aksesnya belum terverifikasi.
- [Kemenag Aceh, Talbiyah Getarkan Jiwa](https://aceh.kemenag.go.id/baca/talbiyah-getarkan-jiwa-l300-semarakkan-asrama?audio=1), untuk pembanding bacaan talbiyah dan makna dari teks terindeks resmi. Bacaan doa adalah teks keagamaan tradisional; penjelasan antarmuka disusun sendiri.

Modul adalah pengantar anak dan keluarga. Bentuk arsitektur, material, dan lingkungan dibuat lebih terperinci untuk membantu mengenal tempat. Model tetap merupakan interpretasi visual: tidak berasal dari survei bangunan, bukan digital twin terukur, dan tidak ditujukan untuk navigasi di lokasi. Tidak ada klaim fotorealistik. Simulasi tidak mewakili praktik ibadah yang benar-benar dilakukan pengguna. Pembimbing manasik tetap diperlukan untuk pendalaman, perbedaan fikih, keadaan kesehatan, haid, dan kebutuhan aksesibilitas. Materi telah dicocokkan dengan sumber di atas tetapi belum memperoleh penelaahan atau pengesahan pembimbing agama khusus untuk produk ini. Tidak ada klaim persetujuan Kemenag atau JAWHAR.

## Asal kode dan aset

Data pelajaran, state machine, tes, dan geometri prosedural modul Rumila ditulis khusus untuk fitur ini. Kode, model, suara, dan gambar dari repositori manasik tanpa izin penggunaan eksplisit tidak disalin. Paket Three.js mengikuti lisensi dependensi yang sudah dipakai Rumila.

Material marmer menggunakan foto tekstur [Marble 01 oleh Rob Tuytel / Poly Haven](https://polyhaven.com/a/marble_01), dengan [lisensi CC0](https://polyhaven.com/license). Berkas diffuse, normal OpenGL, dan roughness beresolusi 1K disimpan di `public/umroh/textures/marble-{diff,nor_gl,rough}.jpg` (sekitar 500 KB total). Atribusi dicantumkan pada informasi modul. Aset diambil dari berkas lokal aplikasi saat runtime; tidak ada permintaan tekstur atau audio ke penyedia eksternal.

Daftar berkas, pembuat, lisensi, serta tautan rujukan arsitektur Masjidil Haram, koridor sa'i, Masjid Nabawi, dan Bir Ali tersedia di [catatan aset](../public/umroh/ASSETS.md). Halaman rujukan arsitektur tidak menjadi sumber model 3D atau gambar yang dibundel; lisensi CC0 di atas hanya berlaku untuk tiga peta tekstur marmer.

## Kontrak state

`src/lib/umroh/index.ts` mengekspor data dan API. `UmrohProgress` versi 1 memuat `route`, `pilgrim`, `stage`, `elapsedSeconds`, dan `count`. Hanya waktu simulasi aktif yang maju; penyimpanan tidak mengukur waktu tutup halaman atau melakukan catch-up.

- `createProgress(route, pilgrim)` memulai dari `persiapan`.
- `completeLesson(progress)` hanya memajukan tahap `lesson`; praktik dan layar akhir tidak dapat dilompati.
- `advancePractice(progress, deltaSeconds)` memajukan tawaf/sa'i, menghitung bagian yang benar-benar selesai, mengabaikan delta negatif/non-finite, dan berhenti pada tujuh. Konstanta `TAWAF_LAP_SECONDS = 10` dan `SAI_LEG_SECONDS = 8` adalah satuan waktu simulasi ternormalisasi, bukan durasi nyata. Antarmuka mengalikan waktu aktif dengan kecepatan pilihan: Normal memakai 0,12 untuk tawaf dan 0,075 untuk sa'i; Dipercepat memakai 0,6 dan 0,3. Normal menjadi bawaan untuk langkah yang mendekati kecepatan berjalan; mode cepat ditandai sebagai gerak dipercepat. Pilihan ini tidak menilai kecepatan ibadah pengguna.
- `finishPractice(progress)` baru memajukan tahap setelah hitungan dan waktu tujuh bagian penuh terpenuhi. Tidak ada perpindahan tahap otomatis saat bagian ketujuh selesai.
- `getPracticeProgress(progress)` menyediakan fraksi keseluruhan, arah dan posisi untuk visualisasi. Posisi sa'i memakai Safa=0 dan Marwah=1, berubah arah di setiap ujung.
- `restart(progress)` menghapus kemajuan dan mempertahankan pilihan perjalanan/pelajar.
- `serializeProgress` dan `parseSavedProgress` menangani penyimpanan versi 1. Parser menolak versi lain, angka tidak valid, tahap/pilihan tidak dikenal, serta waktu/hitungan yang bertentangan. Properti tambahan dibuang. Ini validasi format data lokal, bukan bukti bahwa pengguna pernah mengerjakan ibadah atau pencegah manipulasi oleh pemilik browser.

Semua operasi state mengembalikan data baru ketika berubah. Antarmuka menyimpan kemajuan masing-masing anggota ke `localStorage` dengan kunci `rumila-umroh:<memberId>`, lalu memvalidasinya melalui `parseSavedProgress` saat dibuka kembali. Pemulihan bersifat lokal pada browser dan perangkat yang sama; kemajuan tidak disinkronkan ke akun atau perangkat lain. Jika penyimpanan browser tidak tersedia, sesi tetap berjalan dalam memori. Antarmuka mengelola status jeda dan penanganan kegagalan penyimpanan.

## Verifikasi

`npm test -- src/lib/umroh src/components/umroh/realistic/navigation.test.ts` memeriksa urutan penuh, pencegahan lompatan praktik, batas tujuh, hitungan satu arah sa'i, posisi akhir Marwah, arah tawaf, update parsial, nilai delta tidak valid, restart, round-trip simpan/muat, penolakan data rusak, variasi petunjuk dan penamaan sunah, serta batas dan tabrakan navigasi.
