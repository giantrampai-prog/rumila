# Log 10 — KODE SD3–SD5 (64 paket)

Peta navigasi tidak diubah (hanya judul/instruksi), audit tetap bersih untuk semua paket kelompok ini.

## Temuan

| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 4, 6 | sd3-kode-tebak-kalau-kutub | instruksi | "bongkahan es" padahal papan menampilkan 🪨 batu; "tunjuk" padahal UI "ketuk petak"; tidak dijelaskan tebakan saat blok belok (robot tetap di petak) | diperbaiki |
| 3, 5 | sd3-kode-tebak-petak-kalau | instruksi | "ada batu" tanpa letak (di depan); kasus tanpa batu dan blok belok tidak dijelaskan; "tunjuk" vs UI "ketuk" | diperbaiki |
| 4, 6 | sd4-kode-ulangi-jalan-kota | instruksi | "jalan di antara gedung" padahal dinding tampil sebagai pohon 🌳 | diperbaiki |
| 6 | sd4-kode-ulangi-batu-sungai | instruksi | "jalur batu di sungai" mengesankan batu pijakan, padahal batu 🪨 harus dilompati | diperbaiki |
| 4, 6 | sd5-kode-perbaiki-kalau-laut | judul, instruksi | "kapal selam" padahal yang bergerak robot Agam | diperbaiki |
| 2, 5 | sd3-kode-sunting-algoritma | pesan-makanan-4 | "bayar pesanan" bisa juga di pintu (bayar di tempat), jadi tukar dengan "restoran memasak"/"kurir mengantar" tampak benar | diperbaiki ("bayar pesanan di aplikasi") |
| 5 | sd3-kode-rute-data-internet | cuaca-6 | "gambar awan hujan muncul" mengandaikan ramalan pasti hujan | diperbaiki |
| 4 | sd3-kode-tiga-tugas-perangkat | i-trackball | istilah "trackball" asing untuk SD3 | diperbaiki ("trackball (mouse bola)") |
| 2 | sd4-kode-perangkat-kelas | i7 | "bel listrik sekolah" wajar dikira masukan (ada tombolnya) → dua kotak | diperbaiki ("bel sekolah yang berbunyi otomatis") |
| 4 | sd4-kode-perangkat-kelas | instruksi | dua titik dua berturut-turut, kalimat sulit diikuti | diperbaiki |
| 3 | sd4-kode-cari-loker-stasiun | instruksi | tidak menyebut tindakan "pilih" | diperbaiki |
| 4 | sd4-kode-cari-loker-stasiun | q9 | "Berapa tiket yang dicek?" tanpa titik berhenti | diperbaiki |
| 3 | sd4-kode-cari-satu-satu | instruksi | tidak menyebut tindakan "pilih" | diperbaiki |
| 6 | sd4-kode-jalan-data-kota | instruksi | "lewat router dan internet" menyiratkan urutan router→internet, bertentangan dengan urutan "Menyalakan lampu dari jauh" dan "Siaran langsung" (internet→router) | diperbaiki |
| 4 | sd4-kode-lacak-variabel | q8 | print() belum dikenalkan (paket lain memakai tampilkan) | diperbaiki (tampilkan()) |
| 4 | sd4-kode-variabel-toko-kue | q11 | print() belum dikenalkan | diperbaiki (tampilkan()) |
| 2 | sd4-kode-ulangi-variabel-kebun | q7 | "…, lalu pot = pot - 3" bisa dibaca di dalam atau sesudah ulangi | diperbaiki ("tiap putaran: … lalu …") |
| 2 | sd4-kode-ulangi-variabel-kebun | q12 | sama; bacaan "sesudah ulangi" memberi 9 dan 9 ada di pilihan | diperbaiki |
| 2 | sd4-kode-ulangi-variabel | q11 | sama; bacaan "sesudah ulangi" memberi 6 dan 6 ada di pilihan | diperbaiki |
| 6 | sd5-kode-cabang-kalau-taman | instruksi | "mengecek satu syarat" padahal q13 punya dua kalau | diperbaiki |
| 6 | sd5-kode-indeks-daftar | instruksi | "pilih isinya" padahal sebagian soal menanyakan len atau indeks | diperbaiki |
| 3, 6 | sd5-kode-jenis-data | instruksi | menyebut tiga jenis padahal binCount default 2 (kotak benar/salah tidak tampil) | diperbaiki (instruksi tanpa daftar kotak) |
| 4 | sd5-kode-perangkat-terhubung | i6 | "meteran listrik pintar" tidak menjelaskan data apa yang dikirim | diperbaiki |
| 2 | sd5-kode-tukar-kue | q9–q13 | "Berapa putaran … sampai urut" bisa dihitung termasuk putaran pemeriksaan tanpa tukar (+1, ada di pilihan) | diperbaiki ("Setelah berapa putaran … sudah urut") |
| 2 | sd5-kode-tukar-tetangga | q9–q12 | sama | diperbaiki |
| 3 | sd5-kode-tukar-tetangga | instruksi | tidak menyebut sampai ujung dan tindakan "pilih" | diperbaiki |
| 3, 6 | sd3 masuk-simpan-keluar, sd3 tiga-tugas-perangkat, sd4 perangkat-kelas, sd4 perangkat-masuk-keluar, sd5 bendera-angin-pantai, sd5 cabang-nilai, sd5 jenis-data-lab, sd5 internet-putus(-rumah) | instruksi | instruksi menyebut tiga kotak; bila knob binCount turun ke 2 satu kotak hilang (default 3, jadi tidak tampak pada ronde biasa) | diperbaiki (keputusan koordinator: knob binCount min 2→3, keterangan knob diperbarui) |
| 4 | semua paket navigasi bertema (kutub, laut, gudang, kota, sungai) | instruksi | papan selalu rumput + pohon + 🪨 + Agam; tema dunia hanya latar. Teks yang menyebut benda di papan sudah diperbaiki; tema umum ("padang es", "lorong gudang") dibiarkan | diperbaiki (keputusan koordinator: teks netral seperti sekarang, kode tidak diubah) |
| 4 | sd3-kode-sunting-algoritma (game), sd3-kode-rute-data-internet (game-5), sd4-kode-perjalanan-pesan | label kartu | "tokoh" dipakai untuk karakter game (bukan nama orang) | diperbaiki (keputusan koordinator: game-3, game-5 sunting-algoritma; game-5 rute-data-internet; s9-5 perjalanan-pesan → "karakter"; "tokoh kartun" di sd4-kode-rahasia-di-taman bukan karakter game, dibiarkan) |
| 2 | sd4-kode-masukan-proses-keluaran | Kalkulator tambah, Rata-rata | dua baris minta() bisa ditukar dan program tetap benar | diperbaiki (keputusan koordinator: s1 dan s6 kini satu baris minta, baris berikutnya bergantung padanya; catatan KODE.SD4.IPO.01 di content/kurikulum/KODE-SD4.json diselaraskan) |
| 5 | sd3-kode-butuh-internet | i-send-a-photo-to-uncle | "kirim foto ke paman" secara teknis bisa lewat Bluetooth | ditolak (SD3, bin tanpa jaringan lokal) |
| 2 | sd4-kode-perangkat-kelas | i1 | "sensor sidik jari untuk absen" — mesin absen juga berbunyi | ditolak (labelnya sensor, masukan) |
| — | semua soal pilih SD4–5 (variabel, cari, kalau, ulangi-kalau, indeks, tukar) | kunci | dihitung ulang satu per satu | semua kunci benar, tidak ada pilihan ganda benar |
| 4 | sd4-kode-masukan-proses-keluaran, sd5-kode-cabang-kalau-taman, sd5-kode-lacak-kalau, sd5-kode-indeks-daftar, sd5-kode-indeks-rak-gudang, sd5-kode-jenis-data, sd5-kode-jenis-data-lab | instruksi | sintaks bergaya Python (==, True/False, append, len) belum dijelaskan saat pertama muncul | diperbaiki (keputusan koordinator: penjelasan singkat di instruksi paket kompetensi pertama yang memakainya; semua ≤ 40 kata) |
| — | urutan perbaiki/susun SD3–4 (sunting, perjalanan, rute, IPO, jalan-data) | pasangan bertetangga/berjarak satu | diperiksa untuk urutan ganda | hanya pesan-makanan yang diperbaiki |

## Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd3-kode-tebak-kalau-kutub | instruksi | Program robot kutub menaruh kalau di dalam ulangi. Sebelum tiap langkah, tunjuk petak tujuannya: ada bongkahan es di depan berarti lompat dua petak. | Program robot kutub menaruh kalau di dalam ulangi. Sebelum tiap langkah, ketuk petak tujuannya: ada batu di depan berarti lompat dua petak, blok belok berarti robot tetap di petaknya. |
| sd3-kode-tebak-petak-kalau | instruksi | Sebelum tiap langkah, tunjuk petak tujuan robot: ada batu berarti lompat dua petak. | Sebelum tiap langkah, ketuk petak tujuan robot: ada batu di depan berarti lompat dua petak, tanpa batu maju satu petak, dan blok belok berarti robot tetap di petaknya. |
| sd4-kode-ulangi-batu-sungai | instruksi | Jalur batu di sungai punya tiga ruas dengan pola berbeda. Temukan pola tiap ruas, tulis tiap pola dengan satu blok ulangi, dan belok di antaranya. | Jalur di tepi sungai ini punya tiga ruas dengan pola batu yang berbeda. Temukan pola tiap ruas, tulis tiap pola dengan satu blok ulangi, dan belok di antaranya. |
| sd4-kode-ulangi-jalan-kota | instruksi | Antar robot lewat jalan di antara gedung: jalannya berbelok tiga kali dan rak hanya sebelas keping, jadi pakai empat blok ulangi. | Antar robot lewat jalan kota: jalannya berbelok tiga kali dan rak hanya sebelas keping, jadi pakai empat blok ulangi. |
| sd5-kode-perbaiki-kalau-laut | judul | Kapal Selam yang Tersangkut | Robot Tersangkut di Laut |
| sd5-kode-perbaiki-kalau-laut | instruksi | Program kapal selam lolos di satu jalur laut tetapi tersangkut di jalur lain: jalankan di ketiga jalur, cari penyebabnya, lalu ganti tepat satu keping. | Program robot lolos di satu jalur laut tetapi tersangkut di jalur lain: jalankan di ketiga jalur, cari penyebabnya, lalu ganti tepat satu keping. |
| sd3-kode-tiga-tugas-perangkat | i-trackball | trackball | trackball (mouse bola) |
| sd4-kode-cari-loker-stasiun | instruksi | Di stasiun, barang dicari dengan membuka satu per satu dari kiri dan berhenti saat ketemu. Kalau tidak ada, semuanya dibuka. Hitung berapa yang dibuka. | Di stasiun, barang dicari dengan membuka satu per satu dari kiri dan berhenti saat ketemu. Kalau tidak ada, semuanya dibuka. Hitung berapa yang dibuka, lalu pilih jawabannya. |
| sd4-kode-cari-loker-stasiun | q9 | Tiket kereta tujuan: Bogor, Depok, Cikini, Bekasi, Serpong. Petugas mencari tiket Bekasi dari depan, satu per satu. Berapa tiket yang dicek? | Tiket kereta tujuan: Bogor, Depok, Cikini, Bekasi, Serpong. Petugas mencari tiket Bekasi dari depan, satu per satu. Berapa tiket yang dicek sampai tiket Bekasi ketemu? |
| sd4-kode-cari-satu-satu | instruksi | Komputer mencari dengan membuka kartu satu per satu dari kiri sampai ketemu: hitung berapa kartu yang dibuka. | Komputer mencari dengan membuka kartu satu per satu dari kiri sampai ketemu: hitung berapa kartu yang dibuka, lalu pilih jawabannya. |
| sd4-kode-lacak-variabel | q8 | suhu = 20; suhu = suhu + 5; print(suhu + 1).  Angka berapa yang tampil? | suhu = 20; suhu = suhu + 5; tampilkan(suhu + 1).  Angka berapa yang tampil? |
| sd4-kode-perangkat-kelas | instruksi | Di kelas komputer: seret tiap alat ke kelompoknya: masukan saja, keluaran saja, atau masukan sekaligus keluaran. | Di kelas komputer, seret tiap alat ke kelompoknya: masukan saja, keluaran saja, atau masukan sekaligus keluaran. |
| sd4-kode-perangkat-kelas | i7 | bel listrik sekolah | bel sekolah yang berbunyi otomatis |
| sd4-kode-ulangi-variabel | q11 | a = 1; ulangi 2 kali: a = a + 1, lalu a = a * 2.  Berapa a? | a = 1; ulangi 2 kali, tiap putaran: a = a + 1 lalu a = a * 2.  Berapa a? |
| sd4-kode-ulangi-variabel-kebun | q7 | pot = 10; ulangi 3 kali: pot = pot + 1, lalu pot = pot - 3.  Berapa pot? | pot = 10; ulangi 3 kali, tiap putaran: pot = pot + 1 lalu pot = pot - 3.  Berapa pot? |
| sd4-kode-ulangi-variabel-kebun | q12 | a = 1; ulangi 3 kali: a = a * 2, lalu a = a + 1.  Berapa a? | a = 1; ulangi 3 kali, tiap putaran: a = a * 2 lalu a = a + 1.  Berapa a? |
| sd4-kode-variabel-toko-kue | q11 | n = 10; n = n - 3; print(n * 2).  Angka berapa yang tampil? | n = 10; n = n - 3; tampilkan(n * 2).  Angka berapa yang tampil? |
| sd5-kode-cabang-kalau-taman | instruksi | Program taman bermain mengecek satu syarat: kalau benar, cabang pertama dijalankan; kalau salah, cabang 'kalau tidak'. Perhatikan tanda >, >=, <, == lalu pilih hasilnya. | Program taman bermain mengecek syarat: kalau benar, cabang pertama dijalankan; kalau salah, cabang 'kalau tidak'. Perhatikan tanda >, >=, <, == (artinya 'sama dengan?'). True = benar, False = salah. Lalu pilih hasilnya. |
| sd5-kode-indeks-daftar | instruksi | Indeks daftar mulai dari 0: hitung posisinya dengan teliti, lalu pilih isinya. | Indeks daftar mulai dari 0: hitung posisinya dengan teliti, lalu pilih jawabannya. append = tambahkan di ujung daftar, len = banyak isi daftar. |
| sd5-kode-jenis-data | instruksi | Lihat tanda kutipnya: seret tiap nilai ke jenis datanya, angka, teks, atau benar/salah. | Lihat tanda kutip dan bentuknya: seret tiap nilai ke kotak jenis datanya. True = benar, False = salah. |
| sd5-kode-perangkat-terhubung | i6 | meteran listrik pintar | meteran listrik pintar yang mengirim catatan pemakaian ke kantor listrik |
| sd5-kode-tukar-kue | q9 | Kue berjajar dengan ukuran: 3, 1, 2. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Kue berjajar dengan ukuran: 3, 1, 2. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-kue | q10 | Kue berjajar dengan ukuran: 2, 3, 1. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Kue berjajar dengan ukuran: 2, 3, 1. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-kue | q11 | Kue berjajar dengan ukuran: 4, 3, 2, 1. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Kue berjajar dengan ukuran: 4, 3, 2, 1. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-kue | q12 | Kue berjajar dengan ukuran: 1, 2, 4, 3. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Kue berjajar dengan ukuran: 1, 2, 4, 3. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-kue | q13 | Kue berjajar dengan ukuran: 5, 1, 2, 3, 4. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Kue berjajar dengan ukuran: 5, 1, 2, 3, 4. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-tetangga | instruksi | Satu putaran: bandingkan dua angka bersebelahan dari kiri ke kanan dan tukar bila yang kiri lebih besar. | Satu putaran: bandingkan dua angka bersebelahan dari kiri ke kanan dan tukar bila yang kiri lebih besar. Jalankan sampai ujung kanan, lalu pilih jawabannya. |
| sd5-kode-tukar-tetangga | q9 | Mulai: 2, 1, 3. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Mulai: 2, 1, 3. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-tetangga | q10 | Mulai: 3, 2, 1. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Mulai: 3, 2, 1. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-tetangga | q11 | Mulai: 4, 1, 2, 3. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Mulai: 4, 1, 2, 3. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd5-kode-tukar-tetangga | q12 | Mulai: 2, 3, 4, 1. Berapa putaran tukar-tetangga sampai semuanya urut dari kecil? | Mulai: 2, 3, 4, 1. Setelah berapa putaran tukar-tetangga semuanya sudah urut dari kecil? |
| sd3-kode-rute-data-internet | cuaca-6 | gambar awan hujan muncul | ramalan cuaca muncul di layar |
| sd3-kode-sunting-algoritma | pesan-makanan-4 | bayar pesanan | bayar pesanan di aplikasi |
| sd4-kode-jalan-data-kota | instruksi | Data berjalan dari perangkat pengirim, lewat router dan internet, sampai ke penerima: susun langkah perjalanannya dari awal sampai akhir. | Data berjalan dari perangkat pengirim sampai ke penerima dan melewati router serta internet: susun langkah perjalanannya dari awal sampai akhir. |
| sd5-kode-indeks-rak-gudang | instruksi | Rak gudang dicatat sebagai daftar dan indeksnya mulai dari 0, jadi barang pertama ada di indeks 0. Hitung posisinya dengan teliti lalu pilih jawabannya. | Rak gudang dicatat sebagai daftar dan indeksnya mulai dari 0. append = tambahkan di ujung daftar, len = banyak isi daftar. Hitung posisinya dengan teliti lalu pilih jawabannya. |
| sd5-kode-jenis-data-lab | instruksi | Di laboratorium, tiap catatan punya jenis data: angka, teks (bertanda kutip), atau benar/salah (hasil perbandingan). Seret tiap nilai ke jenisnya. | Di laboratorium, tiap catatan punya jenis data: angka, teks (bertanda kutip), atau benar/salah (hasil perbandingan; == artinya 'sama dengan?'). Seret tiap nilai ke jenisnya. |
| sd5-kode-lacak-kalau | instruksi | Cek syaratnya: benar atau salah? Ikuti cabang yang sesuai, lalu pilih hasilnya. | Cek syaratnya: benar atau salah? == artinya 'sama dengan?', True = benar, False = salah. Ikuti cabang yang sesuai, lalu pilih hasilnya. |
| sd3-kode-rute-data-internet | game-5 | tokohmu melompat di layar teman | karaktermu melompat di layar teman |
| sd3-kode-sunting-algoritma | game-3 | tokoh muncul di layar | karakter game muncul di layar |
| sd3-kode-sunting-algoritma | game-5 | tokoh mengambil koin | karakter mengambil koin |
| sd4-kode-masukan-proses-keluaran | instruksi | Susun baris program supaya berjalan benar: minta masukan dulu dengan baris minta, olah, lalu tampilkan hasilnya. | Susun baris program supaya berjalan benar: minta masukan dulu dengan baris minta, olah, lalu tampilkan hasilnya. Tanda == artinya 'sama dengan?'. |
| sd4-kode-masukan-proses-keluaran | s1-1 | pertama = minta('Angka pertama?') | angka = minta('Angka berapa?') |
| sd4-kode-masukan-proses-keluaran | s1-2 | kedua = minta('Angka kedua?') | tambahan = angka + 5 |
| sd4-kode-masukan-proses-keluaran | s1-3 | hasil = pertama + kedua | hasil = angka + tambahan |
| sd4-kode-masukan-proses-keluaran | s6-1 | n1 = minta('Nilai pertama?') | nilai = minta('Berapa nilai ulanganmu?') |
| sd4-kode-masukan-proses-keluaran | s6-2 | n2 = minta('Nilai kedua?') | bonus = nilai + 10 |
| sd4-kode-masukan-proses-keluaran | s6-3 | rata = (n1 + n2) / 2 | rata = (nilai + bonus) / 2 |
| sd4-kode-perjalanan-pesan | s9-5 | tokohmu melompat di layar temanmu | karaktermu melompat di layar temanmu |

## Butuh keputusan owner

Tidak ada lagi: kelima butir sudah diputuskan koordinator dan dikerjakan (lihat Temuan).
