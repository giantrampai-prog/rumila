# Umroh Virtual

Modul pembelajaran berbahasa Indonesia ini mengikuti perjalanan dari rumah di Indonesia, kunjungan Madinah, umroh di Makkah, hingga kembali ke rumah melalui Jeddah. Perjalanan baru memakai miqat Bir Ali dari Madinah. Progres lama tetap dapat dilanjutkan, termasuk jalur miqat melalui penerbangan yang dipilih pada versi sebelumnya. Pilihan putra/putri menyesuaikan petunjuk pakaian, sa'i, dan rambut.

## Perjalanan pulang-pergi Indonesia

`src/lib/umroh/journey.ts` membungkus modul ibadah dengan 18 bab cerita: rumah → Bluebird ke CGK → bandara CGK → Garuda ke Jeddah → kedatangan Jeddah → Haramain → stasiun Madinah → Uber ke Nabawi → Masjid Nabawi → Raudhah → salam → rangkaian umroh → Makkah ke bandara Jeddah → keberangkatan Jeddah → Garuda ke CGK → kedatangan CGK → Bluebird ke rumah → rumah kembali. Kepulangan melalui Jeddah, tanpa memutar kembali ke Madinah. Perjalanan baru memakai jalur umroh dari Madinah melalui Bir Ali.

Nama Bluebird, Garuda, dan Uber adalah nama operator dalam skenario yang diminta, bukan integrasi pemesanan, transaksi, kerja sama, atau jaminan tersedianya layanan. Dua penerbangan memakai waktu cerita 9 jam; waktu cerita kereta adalah sekitar 1 jam 45 menit. Angka tersebut bukan jadwal langsung. Tujuh adegan perjalanan berlangsung 12–20 detik aktif agar perjalanan dapat dipelajari dalam satu sesi; durasi tidak merepresentasikan waktu tempuh nyata. Nomor penerbangan, gerbang, terminal kedatangan, serta ketentuan bagasi tidak disimulasikan sebagai informasi operasional.

Nabawi, Raudhah, dan salam merupakan bab kunjungan dalam cerita, bukan tambahan rukun umroh. Raudhah adalah area ibadah yang berbeda dari ruang makam. Adegan salam berada di sisi luar pembatas dan tidak memberi akses ke dalam ruang makam; tidak ada penggambaran Nabi atau bagian dalam makam. Ketentuan kunjungan dan jalur pengunjung mengikuti Nusuk serta petugas, termasuk perbedaan akses yang berlaku. Bagian Raudhah menggambarkan kunjungan edukatif jamaah dewasa: FAQ Nusuk pada pemeriksaan 27 Oktober 2026 menyatakan anak tidak diperbolehkan masuk Raudhah, sementara anak dapat berkunjung ke Masjid Nabawi. Mengikuti simulasi ini tidak menerbitkan izin atau menjanjikan akses.

Rujukan cerita dan kunjungan:

- [Nusuk — Raudhah](https://www.nusuk.sa/rawdah/): pemesanan jadwal, kode masuk, ketentuan pengunjung, dan perbedaan akses Raudhah dengan Masjid Nabawi. Ketentuan dapat berubah; aplikasi meminta pengguna memeriksa informasi resmi sebelum kunjungan nyata.
- [Al Haramain — Al-Masjid Al-Nabawi](https://alharamain.gov.sa/public/?page=masjid-nabawi-en): Raudhah berada antara rumah Nabi dan mimbar; ruang makam diterangkan sebagai tempat tersendiri. Batas visualisasi salam ditetapkan di luar ruang makam.
- [SPA — Haramain High-Speed Railway Station at King Abdulaziz Airport](https://www.spa.gov.sa/en/w2586844), 15 Mei 2026: stasiun terhubung dengan Terminal 1, jaringan menuju Madinah, dan waktu acuan sekitar 1 jam 45 menit. Ini rujukan koneksi transportasi, bukan jadwal keberangkatan yang dipesan.

`JourneyProgress` versi 2 memuat `chapter`, `travelSeconds`, dan objek `umroh` versi 1. `createJourneyProgress(pilgrim)` dimulai dari rumah dengan umroh tahap persiapan dan jalur Madinah. `advanceJourneyTravel` hanya menambah detik aktif pada bab perjalanan, mengabaikan delta tidak valid, dan membatasi waktu pada durasi bab. `nextJourneyChapter` memerlukan perjalanan selesai sebelum berpindah; antarmuka dapat menuntaskan durasi transportasi melalui tombol Singkatkan perjalanan. Kemudahan ini tidak tersedia untuk tawaf atau sa'i: bab umroh tetap terkunci sampai tahap internal `selesai`. Berakhirnya animasi tidak otomatis mengganti bab. `updateJourneyUmroh` hanya menerima pembaruan yang valid selama bab umroh, tanpa mengganti jalur.

`parseJourneyProgress` memvalidasi versi, bab, waktu, data umroh, serta hubungan keduanya. Sebelum bab umroh, tahap internal wajib `persiapan` dan jalurnya Madinah; setelah bab umroh, tahap wajib `selesai`. Waktu perjalanan harus nol di bab lain. Progres versi 1 yang valid dimigrasikan ke bab `umroh` tanpa mengulang tawaf atau sa'i, termasuk hitungan parsial, pilihan putra/putri, dan jalur pesawat lama. Progres lama yang sudah `selesai` tetap ditempatkan pada bab umroh agar pengguna dapat melanjutkan cerita pulang. Jalur pesawat hasil migrasi tetap valid saat disimpan ulang dan selama kepulangan. Parser tidak menganggap data lokal sebagai bukti ibadah atau pencegah manipulasi oleh pemilik browser.

Tes `src/lib/umroh/__tests__/journey.test.ts` mencakup urutan pulang-pergi, penguncian ketujuh bab perjalanan, batas waktu, delta tidak valid, kewajiban menuntaskan dua praktik tujuh bagian dan tahallul sebelum pulang, imutabilitas, pemulihan perjalanan terputus, migrasi setiap tahap versi 1 pada dua jalur, serta penolakan kontradiksi bab/waktu/tahap/jalur. Bagian kontrak state di bawah menjelaskan mesin umroh versi 1 yang tetap dipakai sebagai bagian internal perjalanan versi 2.

## Menjelajahi lingkungan

Lingkungan memenuhi area utama layar. Panel panduan selebar 330 piksel di desktop dapat ditutup melalui tombol Panduan; tombol utama pelajaran tetap tersedia di bagian bawah, termasuk pada ponsel. Kamera menyediakan Jalan kaki, Ikuti jamaah, dan Lihat kawasan, dengan pilihan cahaya Siang atau Senja. Navigasi berjalan menggunakan WASD/tombol arah atau pad sentuh, sementara geseran mengubah arah pandang. Dialog, perpindahan kamera, dan kehilangan fokus menghentikan input gerak. Peta menampilkan titik kunjungan dari lokasi yang sedang aktif.

Masjid Nabawi, Raudhah, dan salam hadir sebagai tiga bab kunjungan sebelum umroh dalam perjalanan baru. Selama bab umroh, peta juga menawarkan tur tambahan Kunjungi kembali Masjid Nabawi. Tombol Kembali ke perjalanan mengembalikan lokasi sesuai tahap tanpa mengubah hitungan latihan. Kunjungan tersebut bukan miqat, bukan rukun, dan tidak menambah tahap ritual. Tur tambahan, kamera, suasana cahaya, serta kecepatan merupakan pengaturan sesi yang tidak disimpan dalam progres perjalanan versi 2.

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

Semua operasi state mengembalikan data baru ketika berubah. Antarmuka menyimpan `JourneyProgress` versi 2 untuk masing-masing anggota ke `localStorage` dengan kunci yang tetap sama, `rumila-umroh:<memberId>`. Saat dibuka kembali, `parseJourneyProgress` memvalidasi versi 2 atau memigrasikan data versi 1; `parseSavedProgress` tetap memvalidasi objek umroh di dalamnya. Melanjutkan simpanan mempertahankan bab dan hitungan dengan animasi dijeda. Memilih Mulai dari rumah membuat perjalanan baru melalui Madinah, sambil mempertahankan pilihan putra/putri. Pemulihan bersifat lokal pada browser dan perangkat yang sama; kemajuan tidak disinkronkan ke akun atau perangkat lain. Jika penyimpanan browser tidak tersedia, sesi tetap berjalan dalam memori. Antarmuka mengelola status jeda dan penanganan kegagalan penyimpanan.

## Verifikasi

`npm test -- src/lib/umroh src/components/umroh/realistic/navigation.test.ts` memeriksa urutan penuh, pencegahan lompatan praktik, batas tujuh, hitungan satu arah sa'i, posisi akhir Marwah, arah tawaf, update parsial, nilai delta tidak valid, restart, round-trip simpan/muat, penolakan data rusak, variasi petunjuk dan penamaan sunah, serta batas dan tabrakan navigasi.
