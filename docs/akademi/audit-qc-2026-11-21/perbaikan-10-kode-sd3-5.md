# Perbaikan QC 10: KODE SD3–SD5

Validasi: `npx tsx packages/schema/src/cli.ts` gives 0 error (810 paket valid). `npm run -s akademi:audit` gives ERROR 0, WARNING 22, and none of the warnings involve the sd3/sd4/sd5-kode packages.

## Diterapkan

| keparahan | paket | apa yang diubah |
|---|---|---|
| KRITIS | sd5-kode-ulangi-dan-kalau (1.0.0→1.0.1) | q3 ID/EN: daftar ditulis sebagai teks berkutip dan syaratnya kini `kalau jawaban == 'benar'` (EN `if answer == 'right'`). Kunci 30 tetap benar. |
| KRITIS (keputusan, aman) | sd3-kode-sunting-kartu-percobaan (1.0.0→1.0.1) | Urutan `unggah`: 🎨 selesaikan → 📲 buka aplikasi → 📋 pilih tugas → ⬆️ tekan unggah → 📸 kamera di aplikasi terbuka → 📷 potret gambarmu → 📤 tekan kirim → ✅ tanda terkirim muncul. "Guru memberi nilai" dihapus. Id dan labelKey tetap; teks dan emoji unggah-5..8 bergeser. |
| SEDANG (keputusan, aman) | sd3-kode-sunting-kartu-percobaan | `cerita-5` → "periksa ejaan ceritamu" 🔍 |
| SEDANG (keputusan, aman) | sd3-kode-sunting-kartu-percobaan | `ban-5` → "masukkan lagi ban dalam lalu pompa" 💨; `ban-7` → "putar roda untuk cek tidak goyang" 🔄 |
| SEDANG (keputusan, aman) | sd3-kode-sunting-kartu-percobaan | `pot-botol-5` → "siram lalu taruh di dekat jendela"; `pot-botol-6` → "tunggu sampai bunga cabai muncul" 🌼; `pot-botol-7` → "tunggu bunganya jadi cabai merah" 🌶️; `pot-botol-8` emoji 🧺. Ini juga menutup temuan KECIL "beberapa minggu", karena jangka waktunya kini tidak disebut. |
| SEDANG (keputusan, aman) | sd3-kode-sunting-kartu-percobaan | `sop-6` → "aduk sampai garam larut" |
| SEDANG (keputusan, aman) | sd3-kode-sunting-kartu-percobaan | `kapal-3` → "petugas memanggil penumpang naik" 📢; `kapal-5` → "cari tempat duduk sesuai tiket"; `kapal-6` → "kapal berangkat setelah semua duduk" 🚢 |
| SEDANG (keputusan, aman) | sd3-kode-sunting-kartu-percobaan | `gunung-6` → "catat yang terjadi selagi busa masih ada" |
| SEDANG (keputusan, aman) | sd3-kode-sunting-algoritma (1.1.0→1.1.1) | `remote-5` → "arahkan remote yang sudah tertutup ke TV" (EN "point the closed remote at the TV") |
| SEDANG | sd3-kode-sunting-algoritma | `pesawat-3` → "lewati pemeriksaan keamanan menuju ruang tunggu" (EN disesuaikan) |
| SEDANG | sd3-kode-sunting-algoritma | emoji `remote-1` 📡 → 🪛 |
| SEDANG (keputusan, aman) | sd3-kode-perjalanan-pesan (1.1.0→1.1.1) | Instruksi ID/EN diganti persis sesuai usul. Urutan `printer` ("Mencetak gambar lewat wifi", tidak lewat internet) dihapus beserta kuncinya; tersisa 9 urutan. |
| SEDANG | sd3-kode-butuh-internet (1.0.0→1.0.1) | "kirim pesan ke teman" → "kirim pesan lewat aplikasi obrolan" (EN "send a message in a chat app") |
| SEDANG | sd4-kode-cari-loker-stasiun (1.0.0→1.0.1) | q1–q8 dan q11 ID/EN: "Loker bernomor:" → "Isi kartu di dalam loker, dari kiri:", dan yang dicari kini "kartu N". q6/q7 juga diberi "dengan membuka loker". Angka dan kunci tidak berubah. |
| KECIL | sd3-kode-sunting-kartu-percobaan | emoji `cerita-1` ⏻ → 🖥️ |
| KECIL | sd3-kode-sunting-kartu-percobaan | `es-lilin-4` → "masukkan ke bagian pembeku kulkas" |
| KECIL | sd3-kode-sunting-algoritma | `pesawat-2` → "lapor dan ambil pas naik pesawat" |
| KECIL | sd3-kode-tebak-kalau-kutub (1.0.0→1.0.1) | Instruksi ID: "bongkahan" → "bongkahan es" |
| KECIL | sd3-kode-tebak-petak-kalau (1.0.0→1.0.1) | Instruksi EN: "where the robot will land" |
| KECIL | sd4-kode-perangkat-kelas (1.0.0→1.0.1) | Instruksi ID: koma diganti titik dua. Instruksi EN ditulis ulang sesuai usul. |
| KECIL | sd4-kode-masukan-proses-keluaran (1.1.0→1.1.1) | `scale: 0.4` ditambahkan di semua langkah s7–s10 |
| KECIL | sd4-kode-perjalanan-pesan (1.2.0→1.2.1) | `scale: 0.4` ditambahkan di semua langkah s6–s10 |
| KECIL | sd4-kode-masukan-proses-keluaran | `s2-3` → "kalau jawaban 7, skor = 1, kalau tidak skor = 0" (EN "if answer is 7, score = 1, else score = 0") |
| KECIL | sd5-kode-jenis-data-lab (1.0.0→1.0.1) | i13 "4 != 4" → "4 > 4" (ID dan EN). Tetap di kotak benar/salah. |
| KECIL | sd5-kode-kalau-belok-tiga-jalur (1.0.0→1.0.1) | Grup `sd5-kalau-5-v6` dan `sd5-kalau-15-v8` dihapus utuh (6 peta). Usul aslinya hanya menghapus 4 peta, tetapi paket ini memakai `semuaGrid` (satu program untuk tiga peta per grup), sehingga grup akan tersisa 1 peta. Kedua grup ini hampir kembar dengan grup 15 dan grup 5 (2 dari 3 peta identik, start dan goal sama). Sisa: 66 peta dalam 22 grup. |

## Kalimat suara berubah (WAJIB lengkap)

| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd4-kode-masukan-proses-keluaran | s2-3 | kalau jawaban 7, skor = skor + 1 | kalau jawaban 7, skor = 1, kalau tidak skor = 0 |
| sd4-kode-cari-loker-stasiun | q1 | Loker bernomor: 12, 5, 9, 3, 17, 6. Cari 3 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 3 ketemu? | Isi kartu di dalam loker, dari kiri: 12, 5, 9, 3, 17, 6. Cari kartu 3 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 3 ketemu? |
| sd4-kode-cari-loker-stasiun | q2 | Loker bernomor: 8, 14, 2, 20, 11. Cari 11 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 11 ketemu? | Isi kartu di dalam loker, dari kiri: 8, 14, 2, 20, 11. Cari kartu 11 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 11 ketemu? |
| sd4-kode-cari-loker-stasiun | q3 | Loker bernomor: 6, 1, 7. Cari 6 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 6 ketemu? | Isi kartu di dalam loker, dari kiri: 6, 1, 7. Cari kartu 6 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 6 ketemu? |
| sd4-kode-cari-loker-stasiun | q4 | Loker bernomor: 4, 9, 4, 2, 9. Cari 9 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 9 ketemu? | Isi kartu di dalam loker, dari kiri: 4, 9, 4, 2, 9. Cari kartu 9 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 9 ketemu? |
| sd4-kode-cari-loker-stasiun | q5 | Loker bernomor: 13, 7, 18, 7, 5, 7. Cari 7 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 7 ketemu? | Isi kartu di dalam loker, dari kiri: 13, 7, 18, 7, 5, 7. Cari kartu 7 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 7 ketemu? |
| sd4-kode-cari-loker-stasiun | q6 | Loker bernomor: 3, 16, 10, 8. Cari 5 satu per satu dari kiri. Berapa loker dibuka sebelum yakin 5 tidak ada? | Isi kartu di dalam loker, dari kiri: 3, 16, 10, 8. Cari kartu 5 dengan membuka loker satu per satu dari kiri. Berapa loker dibuka sebelum yakin kartu 5 tidak ada? |
| sd4-kode-cari-loker-stasiun | q7 | Loker bernomor: 21, 9, 14, 30, 2, 18, 6. Cari 12 satu per satu dari kiri. Berapa loker dibuka sebelum yakin 12 tidak ada? | Isi kartu di dalam loker, dari kiri: 21, 9, 14, 30, 2, 18, 6. Cari kartu 12 dengan membuka loker satu per satu dari kiri. Berapa loker dibuka sebelum yakin kartu 12 tidak ada? |
| sd4-kode-cari-loker-stasiun | q8 | Loker bernomor: 5, 11, 19, 2, 8, 15, 1. Cari 1 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 1 ketemu? | Isi kartu di dalam loker, dari kiri: 5, 11, 19, 2, 8, 15, 1. Cari kartu 1 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 1 ketemu? |
| sd4-kode-cari-loker-stasiun | q11 | Loker bernomor: 10, 20, 30, 40. Cari 30 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai 30 ketemu? | Isi kartu di dalam loker, dari kiri: 10, 20, 30, 40. Cari kartu 30 dengan membuka loker satu per satu dari kiri. Berapa loker yang dibuka sampai kartu 30 ketemu? |
| sd3-kode-sunting-kartu-percobaan | gunung-6 | catat yang terjadi | catat yang terjadi selagi busa masih ada |
| sd3-kode-sunting-kartu-percobaan | unggah-5 | potret gambarmu | kamera di aplikasi terbuka |
| sd3-kode-sunting-kartu-percobaan | unggah-6 | tekan kirim | potret gambarmu |
| sd3-kode-sunting-kartu-percobaan | unggah-7 | tanda terkirim muncul | tekan kirim |
| sd3-kode-sunting-kartu-percobaan | unggah-8 | guru memberi nilai | tanda terkirim muncul |
| sd3-kode-sunting-kartu-percobaan | kapal-3 | kapal merapat | petugas memanggil penumpang naik |
| sd3-kode-sunting-kartu-percobaan | kapal-5 | cari tempat duduk | cari tempat duduk sesuai tiket |
| sd3-kode-sunting-kartu-percobaan | kapal-6 | kapal berlayar | kapal berangkat setelah semua duduk |
| sd3-kode-sunting-kartu-percobaan | ban-5 | masukkan lagi ban dalam | masukkan lagi ban dalam lalu pompa |
| sd3-kode-sunting-kartu-percobaan | ban-7 | pompa ban | putar roda untuk cek tidak goyang |
| sd3-kode-sunting-kartu-percobaan | cerita-5 | simpan berkasnya | periksa ejaan ceritamu |
| sd3-kode-sunting-kartu-percobaan | es-lilin-4 | masukkan ke lemari es beku | masukkan ke bagian pembeku kulkas |
| sd3-kode-sunting-kartu-percobaan | pot-botol-5 | siram sedikit air | siram lalu taruh di dekat jendela |
| sd3-kode-sunting-kartu-percobaan | pot-botol-6 | taruh di dekat jendela | tunggu sampai bunga cabai muncul |
| sd3-kode-sunting-kartu-percobaan | pot-botol-7 | tunggu beberapa minggu | tunggu bunganya jadi cabai merah |
| sd3-kode-sunting-kartu-percobaan | sop-6 | cicipi kuahnya | aduk sampai garam larut |
| sd5-kode-ulangi-dan-kalau | q3 | skor = 0. untuk tiap jawaban di [benar, salah, benar, benar]: kalau benar: skor = skor + 10. Berapa skor? | skor = 0. untuk tiap jawaban di ['benar', 'salah', 'benar', 'benar']: kalau jawaban == 'benar': skor = skor + 10. Berapa skor? |
| sd3-kode-sunting-algoritma | remote-5 | arahkan ke TV | arahkan remote yang sudah tertutup ke TV |
| sd3-kode-sunting-algoritma | pesawat-2 | lapor dan ambil tiket naik | lapor dan ambil pas naik pesawat |
| sd3-kode-sunting-algoritma | pesawat-3 | lewati pemeriksaan keamanan | lewati pemeriksaan keamanan menuju ruang tunggu |
| sd3-kode-butuh-internet | i-send-a-message-to-a-friend | kirim pesan ke teman | kirim pesan lewat aplikasi obrolan |
| sd3-kode-tebak-kalau-kutub | instruksi | Program robot kutub menaruh kalau di dalam ulangi. Sebelum tiap langkah, tunjuk petak tujuannya: ada bongkahan di depan berarti lompat dua petak. | Program robot kutub menaruh kalau di dalam ulangi. Sebelum tiap langkah, tunjuk petak tujuannya: ada bongkahan es di depan berarti lompat dua petak. |
| sd4-kode-perangkat-kelas | instruksi | Di kelas komputer: seret tiap alat ke kelompoknya, memasukkan data ke komputer, mengeluarkan hasil, atau menyimpan data. | Di kelas komputer: seret tiap alat ke kelompoknya: memasukkan data ke komputer, mengeluarkan hasil, atau menyimpan data. |
| sd5-kode-jenis-data-lab | i13 | 4 != 4 | 4 > 4 |
| sd3-kode-perjalanan-pesan | instruksi | Susun perjalanan pesan dari perangkatmu sampai ke perangkat temanmu. | Susun perjalanan pesan atau data lewat internet, dari langkah pertama sampai terakhir. |
| sd3-kode-perjalanan-pesan | t-printer | Mencetak gambar lewat wifi | (dihapus) |
| sd3-kode-perjalanan-pesan | printer-1 | pilih gambar | (dihapus) |
| sd3-kode-perjalanan-pesan | printer-2 | klik cetak | (dihapus) |
| sd3-kode-perjalanan-pesan | printer-3 | data lewat wifi ke router | (dihapus) |
| sd3-kode-perjalanan-pesan | printer-4 | router meneruskan ke printer | (dihapus) |
| sd3-kode-perjalanan-pesan | printer-5 | printer mulai mencetak | (dihapus) |
| sd3-kode-perjalanan-pesan | printer-6 | gambar tercetak di kertas | (dihapus) |

Paket yang hanya berubah di EN, scale, atau peta (tanpa perubahan locale.id): sd3-kode-tebak-petak-kalau, sd4-kode-perjalanan-pesan, sd5-kode-kalau-belok-tiga-jalur.

## Ditolak (bukan masalah)

| temuan | alasan |
|---|---|
| — | Semua temuan yang diperiksa terbukti di JSON. Tidak ada yang ditolak. |

Catatan: pada sd5-kode-kalau-belok-tiga-jalur, perbaikannya menyimpang dari usul peninjau (menghapus 2 grup utuh, bukan 4 peta). Alasannya ada di tabel Diterapkan.

## Butuh keputusan owner

| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sd3-kode-masuk-simpan-keluar, sd3-kode-tiga-tugas-perangkat / KODE.SD3.PERANGKAT.01 | Kotak keluaran berlabel "menampilkan", padahal isinya speaker dan printer | Ganti label menjadi "mengeluarkan" dan sesuaikan instruksi serta teks kompetensi (berkas kurikulum) |
| SEDANG | KODE.SD3.PERANGKAT.01 vs KODE.SD4.PERANGKAT.01 | Kompetensi kembar lintas jenjang | SD4 diubah menjadi "perangkat sekaligus masukan dan keluaran", atau "rantai masukan→proses→keluaran" |
| SEDANG | KODE.SD3.JARINGAN.02 vs KODE.SD5.INTERNET.01 | Kompetensi kembar (butuh internet vs internet putus) | SD5 dinaikkan menjadi "jaringan lokal vs internet" |
| SEDANG | Navigasi KODE SD3/SD4/SD5 | Urutan kesulitan terbalik: SD3 KONDISI/DEBUG/EFISIEN lebih sulit daripada SD4/SD5 | Pindahkan KODE.SD3.KONDISI.01, DEBUG.01, PREDIKSI.01 ke SD5, atau tukar isi |
| SEDANG | sd4-kode-masukan-proses-keluaran / KODE.SD4.IPO.01 | Baris `tampilkan 'pertanyaan'` di awal bentrok dengan konsep keluaran dan tidak terikat variabel | Tulis ulang s2, s4, s5, s7–s10 dengan gaya `x = minta(...)` seperti sd4-kode-ipo-pasar (paket besar) |
| KECIL | sd3-kode-masuk-simpan-keluar, sd4-kode-perangkat-masuk-keluar, sd4-kode-perangkat-kelas | Emoji penyimpanan salah benda (💾 untuk flashdisk, 🗂️, 🧱, 🎴, 🗄️) | Tanpa emoji / 💽 / ikon aset khusus. Pilihan ikon perlu diputuskan |
| KECIL | sd3-kode-tiga-tugas-perangkat | "kaset video" dan "disket" asing bagi anak 2026 | Ganti dengan "SSD eksternal" dan "kartu memori kamera" |
| KECIL | sd4-kode-ipo-pasar | `umur = 2026 - tahun` ditulis mati | Pakai `tahun_ini`, atau ganti urutan umur→bulan→minggu |
| KECIL | sd5-kode-cabang-kalau-taman, sd5-kode-lacak-kalau vs paket jenis data | Notasi boolean campur: Benar/Salah vs True/False | Seragamkan ke True/False (atau sebaliknya) di semua paket SD5 |
| KECIL | sd5-kode-perangkat-terhubung, sd5-kode-terhubung-kota / KODE.SD5.INTERNET.02 | Label "kirim data lewat internet" tidak cocok dengan papan jadwal bus; ATM memakai jaringan bank | Label → "terhubung ke internet"; ATM → "mesin parkir yang mengirim data ke aplikasi" |
| KECIL | lintas paket KODE SD3–SD5 | "game"/"gim" dan "surel"/"email" tidak seragam | Pilih istilah baku dan seragamkan di semua paket |
| KECIL (temuan tambahan) | sd3-kode-sunting-kartu-percobaan, sd3-kode-sunting-algoritma | Mesin `perbaiki` juga menukar pasangan berjarak satu. Beberapa pasangan yang tidak ditandai peninjau masih bisa dibalik dengan wajar, misalnya cerita-3↔4 (ketik judul / ketik isi), sop-4↔5 (rebus / garam), sop-6↔7 (aduk / matikan kompor) | Periksa ulang semua pasangan i↔i+1 dan i↔i+2 di setiap urutan mode perbaiki |
