# Log audit ambigu 01 — MAT PAUD, TK A, TK B

Cakupan: 42 kompetensi, 84 paket (MAT-PAUD 22, MAT-TKA 24, MAT-TKB 38). Diverifikasi ke JSON asli + presenter (src/components/akademi/*.tsx) + mesin (packages/mechanics/src) untuk cocok-tidaknya perintah dengan aksi anak. 21 paket diubah (versi patch naik), kurikulum tidak diubah. Validasi skema: 810 valid. Audit akhir: ERROR 0, WARNING 0 (seluruh repo saat dijalankan); tidak ada temuan untuk paket kelompok ini (2 WARNING instruksi-tanpa-perintah lama di lengkapi-koin-* ikut hilang).

## Temuan

| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 3 | jam-kegiatan-peternakan | instruksi | Menyuruh "jarum panjang ke 12", padahal di mode jam-putar hanya jarum pendek yang bisa diputar (jarum panjang tetap di 12) | diperbaiki: bagian jarum panjang dihapus |
| 6, 3 | penggaris-kubus-meja | instruksi | "Sejajarkan ujung benda… lalu baca nomor di ujung yang lain": anak tidak bisa menggeser benda, dan saat knob offset=1 (benda mulai di kubus ke-2) membaca nomor ujung justru salah; bertentangan dengan bantuan presenter "hitung kubus tepat di bawah benda, bukan angka di ujungnya" | diperbaiki: "Hitung kubus yang ada tepat di bawah benda, lalu sentuh angka jumlahnya." |
| 3, 6, 4 | kubus-kue-toko | instruksi | "letakkan kue… mulai dari kubus pertama… sebutkan": benda tidak bisa dipindah, jawaban lewat strip angka (bukan ucap), offset=1 membuat "mulai dari kubus pertama" menyesatkan; "kue" padahal ada permen, ceri, cokelat | diperbaiki: "Di toko kue, hitung kubus yang ada tepat di bawah jajanan itu, lalu sentuh angkanya." |
| 3 | jengkal-benda-kelas, jengkal-sayur-kebun, jengkal-meja-dapur, jengkal-tali-halaman | instruksi | "sebutkan berapa jengkal": anak tidak mengucapkan, melainkan menyentuh angka di strip | diperbaiki: "…lalu sentuh angka jumlah jengkalnya/jumlahnya" (EN ikut) |
| 3 | jungkat-jungkit-berat | instruksi | "Taruh dua benda di timbangan": benda diletakkan otomatis oleh presenter, anak hanya memilih | diperbaiki: "Dua benda ada di timbangan. Lihat sisi yang turun, lalu sentuh benda yang lebih berat." |
| 6 | lengkapi-koin-lima-kantin, lengkapi-koin-lima-pasar | instruksi | "supaya pas lima" padahal knob target 5–10 (pengaya pasangan 10: harga 10 koin) — instruksi bertentangan dengan harga yang diucapkan presenter | diperbaiki: "taruh koin tambahan … supaya pas dengan harganya" ("tambahkan" juga tidak dikenali audit sebagai perintah) |
| 6, 3 | celengan-pecahan-uang | instruksi | "celengan koin … tiap koin dan uang dua ribu": pada binCount default 2 hanya ada koin 500 dan 1.000 (uang dua ribu tidak muncul); "celengan koin" padahal ada uang kertas | diperbaiki: "Robot punya beberapa celengan: masukkan tiap uang ke celengan yang gambarnya sama." |
| 4 | pensil-pendek-ke-panjang | instruksi | "mobil-mobilan" padahal urutan berisi kereta, bus, traktor, bajaj, dll. | diperbaiki: "kendaraan mainan" |
| 4 | kotak-mainan-warna | instruksi | "merapikan balok mainan" padahal ada bola dan bintang mainan | diperbaiki: "merapikan mainan" |
| 6 | stok-buah-piktogram | instruksi | "rak yang diminta pembeli" padahal yang meminta bergantian tukang antar dan pembeli borongan | diperbaiki: "sentuh rak yang diminta" |
| 4 | stok-buah-piktogram, stok-sayur-piktogram | tSedikit, tBanyak | "Rak mana yang paling sedikit/banyak" — bisa dibaca jumlah rak, bukan isi rak | diperbaiki: "Rak mana yang isinya paling sedikit/banyak, …" (11 soal tiap paket dicek: kunci benar) |
| judul | kebun-buah-besar-kecil | judul | "Buah Besar Kecil" padahal ada daun, jamur, labu | diperbaiki: "Besar Kecil di Kebun" |
| judul | hitung-ikan-kolam | judul | "Ikan di Kolam" padahal ronde bisa katak/bebek | diperbaiki: "Hewan di Kolam" |
| judul | hitung-bunga-taman | judul | "Bunga di Taman" padahal ronde bisa kupu-kupu | diperbaiki: "Hitung di Taman" |
| judul | gabung-bebek-kolam | judul | "Bebek Berkumpul" padahal ronde bisa katak/angsa | diperbaiki: "Berkumpul di Kolam" |
| judul | hitung-biji-kebun-11-20 | judul | "Biji di Kebun" padahal ronde bisa daun | diperbaiki: "Biji dan Daun di Kebun" |
| judul | hitung-kelereng-11-20 | judul | "Kelereng Tumpah" padahal ronde bisa kancing | diperbaiki: "Kelereng dan Kancing Tumpah" |
| 5 | bayar-koin-kantin-sekolah, bayar-koin-warung, bayar-rupiah-alat-tulis, bayar-rupiah-toko-roti, kasir-kembalian-warung, kasir-kembalian-toko-mainan | goods/barangIkutHarga | Harga ronde dari knob, barang diundi lepas dari price-nya (contoh: sate price 1.000 tampil berharga 2 koin; satu barang bisa berganti harga antar ronde) | diputuskan koordinator: dibiarkan (price di JSON tidak ditampilkan; yang tampil harga ronde) |
| 3 | bayar-rupiah-toko-roti, bayar-rupiah-alat-tulis | knob pecahan | Mesin bayar tidak membaca knob `pecahan`; laci selalu berisi seribu, dua ribu, lima ribu. Instruksi "gabungan seribu, dua ribu, lima ribu" jadi sesuai, tetapi knob 1→3 tidak berpengaruh | ditolak (teks benar); mesin dikerjakan koordinator |
| 6 | hitung-* (PAUD/TK A/TK B), jari-pembeli-jeruk, jari-pembeli-kue | knob itemsMax | Mesin hitung/subitasi membaca `maxCount`, paket memberi `itemsMax` → knob tak berpengaruh (PAUD hitung selalu 1–5, subitasi selalu 1–3 walau default 2) | diteruskan ke koordinator (kode) |
| 4 | stok-buah/sayur-piktogram | tBanyak | Istilah "pemborong/diborong" belum dikenal anak TK B | diperbaiki (keputusan koordinator): "Ada pembeli yang mau membeli banyak sekali. Rak mana yang isinya paling banyak, supaya dibeli semua?" |
| 4 | lanjutkan-hitungan-sampai-10/-20 | instruksi | "angka ini" | ditolak: angka tempat robot berdiri tampil di layar + judul "Lanjutkan dari N" |
| 2 | bentuk-di-rumah, bentuk-di-taman | soal pilih | Dicek 23 soal: tiap soal tepat satu benda yang cocok bentuknya | ditolak (bersih) |
| 2 | mana-bola-warna, mana-topi-warna, kolam-ikan-/piring-kue-lebih-banyak, baju-beruang/kebun-buah-besar-kecil, pensil-/ular-panjang-pendek, keranjang-jeruk-/sarang-telur-selisih-satu | soal pilih | Dicek: satu jawaban benar per soal, prompt sesuai kompetensi | ditolak (bersih) |
| 4 | kolam-ikan-lebih-banyak | instruksi | "Kucing robot" (kucing milik robot vs robot kucing) | ditolak: tidak memengaruhi tugas |
| judul | baju-beruang-besar-kecil | judul | "Baju Beruang" padahal ada mangkuk dan bola | ditolak: instruksi sudah netral ("barang yang diminta"), tema tetap persiapan beruang |
| 5 | jam-dinding-kelas | instruksi | "pukul berapa sekarang" | ditolak: "sekarang" merujuk jam di layar |

## Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| kebun-buah-besar-kecil | judul | Buah Besar Kecil | Besar Kecil di Kebun |
| kotak-mainan-warna | instruksi | Bantu robot merapikan balok mainan: masukkan tiap mainan ke kotak yang warnanya sama. | Bantu robot merapikan mainan: masukkan tiap mainan ke kotak yang warnanya sama. |
| hitung-biji-kebun-11-20 | judul | Biji di Kebun | Biji dan Daun di Kebun |
| hitung-kelereng-11-20 | judul | Kelereng Tumpah | Kelereng dan Kancing Tumpah |
| gabung-bebek-kolam | judul | Bebek Berkumpul | Berkumpul di Kolam |
| lengkapi-koin-lima-kantin | instruksi | Teman robot menunjukkan koinnya sekejap: tambahkan koin dari laci supaya pas lima. | Teman robot menunjukkan koinnya sekejap: taruh koin tambahan dari laci supaya pas dengan harganya. |
| lengkapi-koin-lima-pasar | instruksi | Pembeli menunjukkan koinnya sebentar lalu menggenggamnya: tambahkan koin supaya pas lima. | Pembeli menunjukkan koinnya sebentar lalu menggenggamnya: taruh koin tambahan supaya pas dengan harganya. |
| jam-kegiatan-peternakan | instruksi | Dengar pukul berapa kegiatan robot di peternakan, lalu putar jarum pendek ke angka itu dan jarum panjang ke 12. | Dengar pukul berapa kegiatan robot di peternakan, lalu putar jarum pendek ke angka itu. |
| jengkal-meja-dapur | instruksi | Ukur benda di meja dengan jengkalmu, rapat tanpa celah, lalu sebutkan berapa jengkal. | Ukur benda di meja dengan jengkalmu, rapat tanpa celah, lalu sentuh angka jumlah jengkalnya. |
| jengkal-tali-halaman | instruksi | Taruh jengkalmu satu per satu tanpa celah dan tanpa tumpang tindih, lalu sebutkan jumlahnya. | Taruh jengkalmu satu per satu tanpa celah dan tanpa tumpang tindih, lalu sentuh angka jumlahnya. |
| kubus-kue-toko | instruksi | Di toko kue, letakkan kue di atas penggaris kubus mulai dari kubus pertama, lalu sebutkan berapa kubus panjangnya. | Di toko kue, hitung kubus yang ada tepat di bawah jajanan itu, lalu sentuh angkanya. |
| penggaris-kubus-meja | instruksi | Sejajarkan ujung benda dengan kubus nomor satu, lalu baca nomor di ujung yang lain. | Hitung kubus yang ada tepat di bawah benda, lalu sentuh angka jumlahnya. |
| stok-buah-piktogram | instruksi | Lihat piktogram stok buah, lalu sentuh rak yang diminta pembeli. | Lihat piktogram stok buah, lalu sentuh rak yang diminta. |
| stok-buah-piktogram | tBanyak | Pemborong datang. Rak mana yang paling banyak, supaya diborong? | Ada pembeli yang mau membeli banyak sekali. Rak mana yang isinya paling banyak, supaya dibeli semua? |
| stok-buah-piktogram | tSedikit | Tukang antar datang. Rak mana yang paling sedikit, supaya diisi? | Tukang antar datang. Rak mana yang isinya paling sedikit, supaya diisi? |
| stok-sayur-piktogram | tBanyak | Pemborong datang. Rak mana yang paling banyak, supaya diborong? | Ada pembeli yang mau membeli banyak sekali. Rak mana yang isinya paling banyak, supaya dibeli semua? |
| stok-sayur-piktogram | tSedikit | Tukang antar datang. Rak mana yang paling sedikit, supaya diisi? | Tukang antar datang. Rak mana yang isinya paling sedikit, supaya diisi? |
| hitung-bunga-taman | judul | Bunga di Taman | Hitung di Taman |
| hitung-ikan-kolam | judul | Ikan di Kolam | Hewan di Kolam |
| pensil-pendek-ke-panjang | instruksi | Robot menjajarkan mobil-mobilan. Susun dari yang paling pendek ke yang paling panjang. | Robot menjajarkan kendaraan mainan. Susun dari yang paling pendek ke yang paling panjang. |
| jungkat-jungkit-berat | instruksi | Taruh dua benda di timbangan, lihat sisi yang turun, lalu sentuh benda yang lebih berat. | Dua benda ada di timbangan. Lihat sisi yang turun, lalu sentuh benda yang lebih berat. |
| jengkal-benda-kelas | instruksi | Ukur benda-benda di kelas: tempelkan jengkal tanganmu dari ujung ke ujung tanpa celah, lalu sebutkan berapa jengkal. | Ukur benda-benda di kelas: tempelkan jengkal tanganmu dari ujung ke ujung tanpa celah, lalu sentuh angka jumlah jengkalnya. |
| jengkal-sayur-kebun | instruksi | Tempelkan jengkal tanganmu dari ujung ke ujung, lalu sebutkan berapa jengkal panjangnya. | Tempelkan jengkal tanganmu dari ujung ke ujung, lalu sentuh angka jumlah jengkalnya. |
| celengan-pecahan-uang | instruksi | Robot punya celengan koin: masukkan tiap koin dan uang dua ribu ke celengan yang gambarnya sama. | Robot punya beberapa celengan: masukkan tiap uang ke celengan yang gambarnya sama. |

## Butuh keputusan owner

| paket/kompetensi | masalah | opsi |
|---|---|---|
| MAT.TKA.UANG-KENAL.02, MAT.TKB.UANG-10RB.02/.03 — 6 paket bayar/kembalian | Barang diacak lepas dari price-nya | DIPUTUSKAN koordinator: dibiarkan |
| Mesin dagang hitung/subitasi (kode) | Knob `itemsMax` tidak dibaca (mesin membaca `maxCount`) | DIAMBIL koordinator (kode) |
| Mesin dagang bayar (kode) | Knob `pecahan` tidak dibaca | DIAMBIL koordinator (kode) |
| MAT.TKB.DATA.03 (stok-buah/sayur-piktogram) | Istilah "pemborong / diborong" | SELESAI: diganti "pembeli yang mau membeli banyak sekali … dibeli semua" (ID+EN), versi tetap 1.1.1 (sudah dinaikkan sesi ini) |
