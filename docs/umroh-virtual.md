# Umroh Virtual

Modul pembelajaran berbahasa Indonesia ini mengenalkan urutan dari persiapan dan miqat sampai tahallul. Dua pilihan perjalanan adalah dari Madinah melalui Bir Ali atau melalui penerbangan; pilihan putra/putri menyesuaikan petunjuk pakaian, sa'i, dan rambut.

## Cakupan pelajaran

Urutan: persiapan → miqat → perjalanan → masuk Masjidil Haram → tawaf → salat sunah → Zamzam → sa'i → tahallul → selesai.

Tawaf menampilkan tujuh putaran berlawanan arah jarum jam, dengan Ka'bah di sebelah kiri dan lintasan di luar Hijir Ismail. Sa'i menghitung setiap perjalanan satu arah: Safa–Marwah pertama, Marwah–Safa kedua, hingga ketujuh berakhir di Marwah. Tahap miqat mengajarkan niat secara eksplisit; mengganti pakaian atau menekan tombol bukan pengganti niat ibadah.

Salat setelah tawaf dan minum Zamzam dinyatakan sebagai amalan sunah. Tahap-tahap tersebut merupakan bagian alur belajar, bukan penilaian sah/tidaknya umroh. Anjuran berlari kecil bagi putra di bagian sa'i yang bertanda hijau juga tidak diberi skor atau diperlakukan sebagai syarat. Tidak ada penghitungan pahala atau peringkat kesalehan.

## Rujukan dan batas editorial

- [JAWHAR, Panduan Haji dan Umrah](https://www.jawhar.gov.my/haji-dan-umrah/panduan-haji-dan-umrah/), bagian rukun, wajib umrah, miqat, tawaf, sa'i, dan tahallul. Halaman dibaca dan dapat diakses pada 27 Oktober 2026; tautan ini tersedia di antarmuka. Rujukan dipakai untuk urutan ibadah, bukan seluruh aturan layanan/perjalanan dari yurisdiksi lain.
- Kementerian Agama RI, *Tuntunan Manasik Haji dan Umrah 1445 H/2024 M*, halaman cetak 131: salat sunah dua rakaat, pilihan lokasi aman, dan Zamzam. Bagian ini diverifikasi melalui teks terindeks dari publikasi resmi; berkas unduh lengkap tidak dijadikan tautan antarmuka karena aksesnya belum terverifikasi.
- [Kemenag Aceh, Talbiyah Getarkan Jiwa](https://aceh.kemenag.go.id/baca/talbiyah-getarkan-jiwa-l300-semarakkan-asrama?audio=1), untuk pembanding bacaan talbiyah dan makna dari teks terindeks resmi. Bacaan doa adalah teks keagamaan tradisional; penjelasan antarmuka disusun sendiri.

Modul adalah pengantar anak dan keluarga. Denah, jarak, lama perjalanan, dan bentuk bangunan disederhanakan; bukan navigasi lapangan atau rekonstruksi arsitektur berskala. Simulasi tidak mewakili praktik ibadah yang benar-benar dilakukan pengguna. Pembimbing manasik tetap diperlukan untuk pendalaman, perbedaan fikih, keadaan kesehatan, haid, dan kebutuhan aksesibilitas. Materi telah dicocokkan dengan sumber di atas tetapi belum memperoleh penelaahan atau pengesahan pembimbing agama khusus untuk produk ini. Tidak ada klaim persetujuan Kemenag atau JAWHAR.

## Asal kode dan aset

Data pelajaran, state machine, tes, dan model geometri prosedural modul Rumila ditulis khusus untuk fitur ini. Kode, model, suara, dan gambar dari repositori manasik yang tidak mempunyai izin penggunaan eksplisit tidak disalin. Kandidat publik sebelumnya hanya dipakai untuk menilai ruang lingkup kebutuhan. Paket Three.js mengikuti lisensi dependensi yang sudah dipakai Rumila. Tidak ada unduhan audio eksternal dalam data pelajaran ini.

## Kontrak state

`src/lib/umroh/index.ts` mengekspor data dan API. `UmrohProgress` versi 1 memuat `route`, `pilgrim`, `stage`, `elapsedSeconds`, dan `count`. Hanya waktu simulasi aktif yang maju; penyimpanan tidak mengukur waktu tutup halaman atau melakukan catch-up.

- `createProgress(route, pilgrim)` memulai dari `persiapan`.
- `completeLesson(progress)` hanya memajukan tahap `lesson`; praktik dan layar akhir tidak dapat dilompati.
- `advancePractice(progress, deltaSeconds)` memajukan tawaf/sa'i, menghitung bagian yang benar-benar selesai, mengabaikan delta negatif/non-finite, dan berhenti pada tujuh. Durasi simulasi: `TAWAF_LAP_SECONDS = 10`, `SAI_LEG_SECONDS = 8`; durasi ini bukan ukuran ibadah nyata.
- `finishPractice(progress)` baru memajukan tahap setelah hitungan dan waktu tujuh bagian penuh terpenuhi. Tidak ada perpindahan tahap otomatis saat bagian ketujuh selesai.
- `getPracticeProgress(progress)` menyediakan fraksi keseluruhan, arah dan posisi untuk visualisasi. Posisi sa'i memakai Safa=0 dan Marwah=1, berubah arah di setiap ujung.
- `restart(progress)` menghapus kemajuan dan mempertahankan pilihan perjalanan/pelajar.
- `serializeProgress` dan `parseSavedProgress` menangani penyimpanan versi 1. Parser menolak versi lain, angka tidak valid, tahap/pilihan tidak dikenal, serta waktu/hitungan yang bertentangan. Properti tambahan dibuang. Ini validasi format data lokal, bukan bukti bahwa pengguna pernah mengerjakan ibadah atau pencegah manipulasi oleh pemilik browser.

Semua operasi state mengembalikan data baru ketika berubah. Antarmuka menyimpan kemajuan masing-masing anggota ke `localStorage` dengan kunci `rumila-umroh:<memberId>`, lalu memvalidasinya melalui `parseSavedProgress` saat dibuka kembali. Pemulihan bersifat lokal pada browser dan perangkat yang sama; kemajuan tidak disinkronkan ke akun atau perangkat lain. Jika penyimpanan browser tidak tersedia, sesi tetap berjalan dalam memori. Antarmuka mengelola status jeda dan penanganan kegagalan penyimpanan.

## Verifikasi

`npm test -- src/lib/umroh` memeriksa urutan penuh, pencegahan lompatan praktik, batas tujuh, hitungan satu arah sa'i, posisi akhir Marwah, arah tawaf, update parsial, nilai delta tidak valid, restart, round-trip simpan/muat, penolakan data rusak, serta variasi petunjuk dan penamaan sunah.
