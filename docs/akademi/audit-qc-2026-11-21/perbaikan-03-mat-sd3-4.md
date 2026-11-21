# Perbaikan 03 — MAT SD3–SD4

Sumber: temuan-03-mat-sd3-4.md. Semua paket yang diubah naik versi patch (1.0.0 → 1.0.1; sd3-mat-urut-jadwal-digital 1.1.0 → 1.1.1). Validasi skema: 810 paket valid. Audit: ERROR 0, WARNING 18 (instruksi-kembar/terlalu-panjang, semuanya sudah ada sebelumnya; tidak ada yang disebabkan perubahan ini; tidak ada `ronde-kurang-item`).

## Diterapkan
| keparahan | paket | apa yang diubah |
|---|---|---|
| KRITIS | sd4-mat-jam-24-bandara | Instruksi ID/EN: aturan "+12" dibatasi pukul 1 siang–11 malam; "pukul 12 siang tetap 12". |
| SEDANG | sd4-mat-kembalian-toko-buku | Instruksi ID/EN disesuaikan dengan mesin (dibayar dengan selembar uang terkecil yang cukup, bukan "50/100 ribu"); `knobs.itemsMax.keterangan` disesuaikan. Harga tidak diubah, kode mesin tidak disentuh. |
| SEDANG | sd4-mat-kembalian-toko-mainan | Instruksi ID/EN: "Pembeli membayar dengan selembar uang yang cukup. Hitung maju …". |
| SEDANG | sd3-mat-lipat-huruf-dan-kata | Instruksi ID/EN: menyebut garis lipat tegak (atas ke bawah) dan mendatar (kiri ke kanan) secara tegas. |
| SEDANG | sd3-mat-simetri-dua-arah | Instruksi ID/EN sama arahnya. Lambang ↕/↔ usulan peninjau tidak dipakai (akan dibacakan TTS dengan aneh); diganti keterangan "(dari atas ke bawah)/(dari kiri ke kanan)". |
| SEDANG | sd3-mat-segi-banyak-beraturan | Label "segi lima beraturan"/"segi enam beraturan" → "segi lima"/"segi enam" (EN "pentagon"/"hexagon") agar jawaban tidak bocor. |
| SEDANG | sd3-mat-urut-pecahan | Barisan `satuan-10-5-4-3` → `satuan-8-6-4-3` (1/8, 1/6, 1/4, 1/3) dan `satuan-10-5-4-2` → `satuan-6-5-3-2` (1/6, 1/5, 1/3, 1/2); kunci locale baru s-1per8, s-1per6. Tidak ada lagi awalan kembar pada steps 3 atau 4. (1/6, 1/8 sudah dipakai di paket kembaran pita-pecahan.) Instruksi ID/EN kini menjelaskan kedua aturan (penyebut sama dan pembilang 1). |
| KECIL | sd3-mat-pita-pecahan-tertukar | Instruksi ID/EN menjelaskan aturan pembilang 1 dan penyebut sama. |
| SEDANG | sd4-mat-genap-ganjil-tiga-bilangan | i10 "33 + 51 − 52", i12 "40 + 92 − 76" (ID/EN; kunci genap tetap); judul "Genap atau Ganjil: Dua dan Tiga Bilangan" / EN "Even or Odd: Two and Three Numbers". |
| SEDANG | sd4-mat-bayar-pas-toko-elektronik | 🧮 kalkulator → 📷 "kamera saku" (id/labelKey `kamera`, harga 92.000 tetap); 🪭 "kipas angin kecil" → 🖨️ "printer kecil" (id/labelKey `printer`, harga 64.000 tetap); label earphone → "headphone". |
| SEDANG | sd4-mat-kembalian-toko-buku | Label barang 🧮 "kalkulator" → "sempoa" (EN "abacus"), harga tetap, sehingga gambar cocok. |
| SEDANG | sd4-mat-garis-simetri-bangun-laut | Kartu dua-14 "angka 8" → "persegi panjang 6 × 3 cm" (rak dua); emoji 🏠 dihapus dari satu-9 (label saja). |
| SEDANG | sd4-mat-garis-simetri-huruf | Item i21 "segitiga sama kaki": gambar `shape:"triangle"` (beserta scale/color) dihapus, label saja. Usulan `width: 0.6` tidak efektif: Bentuk segitiga digambar sebagai SVG viewBox 100×100 dengan aspek dipertahankan (benda.tsx), jadi lebar kecil hanya mengecilkan, tidak merampingkan. |
| SEDANG | sd4-mat-urut-dari-terbesar | Judul barisan s5 "Kata dalam lima buku tebal — dari terbesar" (EN "Words in five thick books"). |
| KECIL | sd3-mat-bulatkan-puluhan-tiga-angka | Instruksi: "pulang" → "naik". |
| KECIL | sd3-mat-bulatkan-ratusan | Instruksi ID/EN: "Puluhan 5 ke atas naik ke ratusan berikutnya." |
| KECIL | sd3-mat-ember-kerang-genap-ratusan | Judul "Ember Kerang Pas Ratusan" / EN "Shell Buckets to the Hundreds". |
| KECIL | sd3-mat-barisan-loncat-tetap | Judul barisan "Mundur 5 dari 1.000" (EN "1,000"). |
| KECIL | sd3-mat-rak-pasangan-ratusan | 10 label "…→1000" → "…→1.000" (EN "…→1,000"). |
| KECIL | sd3-mat-panen-dibagi-rata | Instruksi ID/EN ditulis ulang. |
| KECIL | sd3-mat-carroll-kelipatan-lima | Instruksi tanpa singkatan "Kel."; 4 label rak "kelipatan 5, genap" dst. (EN "multiple of 5, even" dst.); emoji keempat rak dihapus (🖐️/✋ hampir sama). |
| KECIL | sd3-mat-ukur-sisi-beraturan | q9 "Papan tulis persegi panjang 3 m × 1 m itu …" (EN sepadan); kunci c29 tetap benar. |
| KECIL | sd3-mat-pilih-satuan-ukur | Emoji galon 🫙 → 💧; label gunung → "jarak jalan kaki ke puncak gunung" (temuan `keputusan`, tapi aman: hanya memperjelas, rak km tetap). |
| KECIL | sd3-mat-urut-jadwal-digital | Barisan 8: 13.10 pulang sekolah → 13.25 makan siang → 13.45 salat zuhur → 14.00 tidur siang → 17.25 mandi sore. Barisan 11: makan siang 13.50, tidur siang 13.55. Barisan 7: usulan peninjau (08.35 → 09.15 olahraga) merusak urutan (08.45 membaca sesudahnya), jadi dipakai 07.10 upacara → 07.45 masuk kelas → 07.50 pelajaran matematika → 08.35 olahraga → 09.45 membaca buku. Id/labelKey langkah disesuaikan dengan jamnya. |
| KECIL | sd4-mat-urut-bilangan-besar | Judul barisan s5 "Nomor undian lima peserta" (EN "Raffle numbers of five players"). |
| KECIL | sd4-mat-urut-suhu-di-bawah-nol | Judul s3 "Suhu di lima tempat"; s9 "Kota-kota yang sangat dingin" (EN s9 tetap "Very cold towns"). |
| KECIL | sd4-mat-urut-suhu-stasiun-cuaca | Judul s1 "Suhu di lima tempat", s3 "Suhu di lima kota", s9 "Suhu lima danau" (EN sepadan). |
| KECIL | sd4-mat-bayar-pas-toko-olahraga | "tali skipping" → "tali lompat"; "botol minum" (🥤) → "minuman gelas" (EN "cup drink"). |
| KECIL | sd4-mat-barisan-jalan-angka | q5 → "−7, −2, 3, 8", kunci r5 c13 → c15 ("tambah 5"). |
| KECIL | sd4-mat-diagram-carroll | Rak "≤ 50" → "50 atau kurang"; sekalian "> 50" → "lebih dari 50" (ID/EN) agar tidak ada lambang yang dibacakan TTS. |
| KECIL | sd4-mat-kotak-undian | q1–q12 ID: "Kotak berisi 10 bola kuning dan 1 bola biru. …"; EN tata bahasa jamak dibetulkan ("10 yellow balls and 1 blue ball"). |
| KECIL | sd4-mat-lama-waktu-sekolah | Judul "Lama Waktu Kegiatan" / EN "How Long Activities Take". |
| KECIL | sd4-mat-sudut-lancip-siku-tumpul | i12 "¼ putaran". |

## Kalimat suara berubah (WAJIB lengkap)
| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd4-mat-bayar-pas-toko-elektronik | earphone | earphone | headphone |
| sd4-mat-bayar-pas-toko-elektronik | kalkulator | kalkulator | (dihapus) |
| sd4-mat-bayar-pas-toko-elektronik | kamera | (baru) | kamera saku |
| sd4-mat-bayar-pas-toko-elektronik | kipas | kipas angin kecil | (dihapus) |
| sd4-mat-bayar-pas-toko-elektronik | printer | (baru) | printer kecil |
| sd4-mat-bayar-pas-toko-olahraga | botol | botol minum | minuman gelas |
| sd4-mat-bayar-pas-toko-olahraga | tali | tali skipping | tali lompat |
| sd4-mat-kembalian-toko-buku | instruksi | Pembeli membayar dengan uang 50 ribu atau 100 ribu: berikan kembalian yang pas. | Pembeli membayar dengan selembar uang yang cukup. Berikan kembalian yang pas. |
| sd4-mat-kembalian-toko-buku | kalkulator | kalkulator | sempoa |
| sd4-mat-kembalian-toko-mainan | instruksi | Pembeli membayar 50 ribu atau 100 ribu. Hitung maju dari harga sampai uang pembeli, lalu beri kembaliannya. | Pembeli membayar dengan selembar uang yang cukup. Hitung maju dari harga sampai uang pembeli, lalu beri kembaliannya. |
| sd3-mat-bulatkan-puluhan-tiga-angka | instruksi | Lihat angka satuannya saja. 5 ke atas pulang ke puluhan berikutnya. | Lihat angka satuannya saja. 5 ke atas naik ke puluhan berikutnya. |
| sd3-mat-bulatkan-ratusan | instruksi | Lihat angka puluhannya. 50 ke atas pulang ke ratusan berikutnya. | Lihat angka puluhannya. Puluhan 5 ke atas naik ke ratusan berikutnya. |
| sd3-mat-carroll-kelipatan-lima | b-bukan-ganjil | bukan · ganjil | bukan kelipatan 5, ganjil |
| sd3-mat-carroll-kelipatan-lima | b-bukan-genap | bukan · genap | bukan kelipatan 5, genap |
| sd3-mat-carroll-kelipatan-lima | b-kelt-5-ganjil | kel. 5 · ganjil | kelipatan 5, ganjil |
| sd3-mat-carroll-kelipatan-lima | b-kelt-5-genap | kel. 5 · genap | kelipatan 5, genap |
| sd3-mat-carroll-kelipatan-lima | instruksi | Kel. 5 = kelipatan 5 (satuannya 0 atau 5); bukan = bukan kelipatan 5. Genap bersatuan 0, 2, 4, 6, 8. Taruh di kotak yang cocok dua-duanya. | Kelipatan 5 bersatuan 0 atau 5. Genap bersatuan 0, 2, 4, 6, 8. Taruh di kotak yang cocok untuk keduanya. |
| sd3-mat-ember-kerang-genap-ratusan | judul | Ember Kerang Pas Seratus | Ember Kerang Pas Ratusan |
| sd3-mat-lipat-huruf-dan-kata | instruksi | Bayangkan melipat huruf atau kata dari atas ke bawah (tegak) dan dari kiri ke kanan (mendatar). Sentuh yang kedua bagiannya pas. | Bayangkan garis lipat tegak (dari atas ke bawah) dan garis lipat mendatar (dari kiri ke kanan). Sentuh yang kedua bagiannya pas. |
| sd3-mat-panen-dibagi-rata | instruksi | Bagi hasil panen sama rata. Pikirkan berapa kali pembaginya menjadi bilangan itu, lalu sentuh jawabannya. | Bagi hasil panen sama rata. Pikirkan: pembaginya dikali berapa supaya jadi bilangan itu? Sentuh jawabannya. |
| sd3-mat-rak-pasangan-ratusan | i-550ke1000 | 550→1000 | 550→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-650ke1000 | 650→1000 | 650→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-700ke1000 | 700→1000 | 700→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-750ke1000 | 750→1000 | 750→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-850ke1000 | 850→1000 | 850→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-940ke1000 | 940→1000 | 940→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-955ke1000 | 955→1000 | 955→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-965ke1000 | 965→1000 | 965→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-975ke1000 | 975→1000 | 975→1.000 |
| sd3-mat-rak-pasangan-ratusan | i-985ke1000 | 985→1000 | 985→1.000 |
| sd3-mat-segi-banyak-beraturan | i-segi-enam-beraturan | segi enam beraturan | segi enam |
| sd3-mat-segi-banyak-beraturan | i-segi-lima-beraturan | segi lima beraturan | segi lima |
| sd3-mat-simetri-dua-arah | instruksi | Bayangkan melipat huruf dari atas ke bawah, lalu dari kiri ke kanan. Di mana kedua bagiannya pas? | Bayangkan garis lipat tegak (dari atas ke bawah), lalu garis lipat mendatar (dari kiri ke kanan). Di garis mana kedua bagian huruf pas? |
| sd3-mat-ukur-sisi-beraturan | q9 | Papan tulis persegi panjang 8 × 3 dm itu … | Papan tulis persegi panjang 3 m × 1 m itu … |
| sd4-mat-barisan-jalan-angka | q5 | Aturan barisan −7, −3, 1, 5 adalah … | Aturan barisan −7, −2, 3, 8 adalah … |
| sd4-mat-diagram-carroll | b-ganjil-besar | ganjil, > 50 | ganjil, lebih dari 50 |
| sd4-mat-diagram-carroll | b-ganjil-kecil | ganjil, ≤ 50 | ganjil, 50 atau kurang |
| sd4-mat-diagram-carroll | b-genap-besar | genap, > 50 | genap, lebih dari 50 |
| sd4-mat-diagram-carroll | b-genap-kecil | genap, ≤ 50 | genap, 50 atau kurang |
| sd4-mat-garis-simetri-bangun-laut | i14 | angka 8 | persegi panjang 6 × 3 cm |
| sd4-mat-genap-ganjil-tiga-bilangan | i10 | 33 − 52 + 51 | 33 + 51 − 52 |
| sd4-mat-genap-ganjil-tiga-bilangan | i12 | 40 − 76 + 92 | 40 + 92 − 76 |
| sd4-mat-genap-ganjil-tiga-bilangan | judul | Genap Ganjil Tiga Bilangan | Genap atau Ganjil: Dua dan Tiga Bilangan |
| sd4-mat-jam-24-bandara | instruksi | Ubah waktu ke format yang lain. Ingat: siang, sore, dan malam ditambah 12. | Ubah waktu ke format yang lain. Ingat: pukul 1 siang sampai 11 malam ditambah 12. Pukul 12 siang tetap 12. |
| sd4-mat-kotak-undian | q1 | Kotak berisi bola 7 biru. Diambil satu bola: biru. | Kotak berisi 7 bola biru. Diambil satu bola: biru. |
| sd4-mat-kotak-undian | q10 | Kotak berisi bola 8 kuning dan 4 biru. Diambil satu bola: merah. | Kotak berisi 8 bola kuning dan 4 bola biru. Diambil satu bola: merah. |
| sd4-mat-kotak-undian | q11 | Kotak berisi bola 4 hijau. Diambil satu bola: hijau. | Kotak berisi 4 bola hijau. Diambil satu bola: hijau. |
| sd4-mat-kotak-undian | q12 | Kotak berisi bola 7 kuning dan 1 biru. Diambil satu bola: kuning. | Kotak berisi 7 bola kuning dan 1 bola biru. Diambil satu bola: kuning. |
| sd4-mat-kotak-undian | q2 | Kotak berisi bola 10 kuning dan 1 biru. Diambil satu bola: kuning. | Kotak berisi 10 bola kuning dan 1 bola biru. Diambil satu bola: kuning. |
| sd4-mat-kotak-undian | q3 | Kotak berisi bola 2 kuning dan 2 hijau. Diambil satu bola: kuning. | Kotak berisi 2 bola kuning dan 2 bola hijau. Diambil satu bola: kuning. |
| sd4-mat-kotak-undian | q4 | Kotak berisi bola 11 kuning dan 1 merah. Diambil satu bola: merah. | Kotak berisi 11 bola kuning dan 1 bola merah. Diambil satu bola: merah. |
| sd4-mat-kotak-undian | q5 | Kotak berisi bola 5 kuning dan 7 merah. Diambil satu bola: biru. | Kotak berisi 5 bola kuning dan 7 bola merah. Diambil satu bola: biru. |
| sd4-mat-kotak-undian | q6 | Kotak berisi bola 6 hijau. Diambil satu bola: hijau. | Kotak berisi 6 bola hijau. Diambil satu bola: hijau. |
| sd4-mat-kotak-undian | q7 | Kotak berisi bola 6 biru dan 1 merah. Diambil satu bola: biru. | Kotak berisi 6 bola biru dan 1 bola merah. Diambil satu bola: biru. |
| sd4-mat-kotak-undian | q8 | Kotak berisi bola 9 merah dan 9 hijau. Diambil satu bola: hijau. | Kotak berisi 9 bola merah dan 9 bola hijau. Diambil satu bola: hijau. |
| sd4-mat-kotak-undian | q9 | Kotak berisi bola 10 biru dan 1 hijau. Diambil satu bola: hijau. | Kotak berisi 10 bola biru dan 1 bola hijau. Diambil satu bola: hijau. |
| sd4-mat-lama-waktu-sekolah | judul | Lama Waktu di Sekolah | Lama Waktu Kegiatan |
| sd4-mat-sudut-lancip-siku-tumpul | i12 | ¼ putar | ¼ putaran |
| sd3-mat-barisan-loncat-tetap | j-mundur-5-dari-1000 | Mundur 5 dari 1000 | Mundur 5 dari 1.000 |
| sd3-mat-pita-pecahan-tertukar | instruksi | Pita harus urut dari yang terpanjang. Makin banyak potongan, makin kecil tiap potong, jadi 1/10 lebih kecil dari 1/2. Dua kartu tertukar: tukar kembali. | Pita harus urut dari yang terpanjang. Pembilang 1: penyebut besar, bagian kecil, jadi 1/10 lebih kecil dari 1/2. Penyebut sama: pembilang besar, bagian besar. Dua kartu tertukar: tukar kembali. |
| sd3-mat-urut-jadwal-digital | k-jadwal-11-13t50 | 13.50 tidur siang | 13.50 makan siang |
| sd3-mat-urut-jadwal-digital | k-jadwal-11-13t55 | 13.55 makan siang | 13.55 tidur siang |
| sd3-mat-urut-jadwal-digital | k-jadwal-7-07t50 | (baru) | 07.50 pelajaran matematika |
| sd3-mat-urut-jadwal-digital | k-jadwal-7-08t30 | 08.30 pelajaran matematika | (dihapus) |
| sd3-mat-urut-jadwal-digital | k-jadwal-7-08t45 | 08.45 membaca buku | (dihapus) |
| sd3-mat-urut-jadwal-digital | k-jadwal-7-09t45 | (baru) | 09.45 membaca buku |
| sd3-mat-urut-jadwal-digital | k-jadwal-8-13t15 | 13.15 tidur siang | (dihapus) |
| sd3-mat-urut-jadwal-digital | k-jadwal-8-13t25 | (baru) | 13.25 makan siang |
| sd3-mat-urut-jadwal-digital | k-jadwal-8-13t45 | 13.45 makan siang | 13.45 salat zuhur |
| sd3-mat-urut-jadwal-digital | k-jadwal-8-13t50 | 13.50 salat zuhur | (dihapus) |
| sd3-mat-urut-jadwal-digital | k-jadwal-8-14t00 | (baru) | 14.00 tidur siang |
| sd3-mat-urut-pecahan | instruksi | Satu kue dibagi makin banyak, potongannya makin kecil. Susun dari yang terkecil. | Bandingkan besar bagiannya. Penyebut sama: pembilang besar, bagian besar. Pembilang 1: penyebut besar, bagian kecil. Susun dari yang terkecil. |
| sd3-mat-urut-pecahan | s-1per6 | (baru) | 1/6 |
| sd3-mat-urut-pecahan | s-1per8 | (baru) | 1/8 |
| sd4-mat-urut-bilangan-besar | s5 | Harga lima sepeda (rupiah) | Nomor undian lima peserta |
| sd4-mat-urut-dari-terbesar | s5 | Halaman lima buku tebal — dari terbesar | Kata dalam lima buku tebal — dari terbesar |
| sd4-mat-urut-suhu-di-bawah-nol | s3 | Lima lemari pendingin | Suhu di lima tempat |
| sd4-mat-urut-suhu-di-bawah-nol | s9 | Kota paling dingin di dunia | Kota-kota yang sangat dingin |
| sd4-mat-urut-suhu-stasiun-cuaca | s1 | Kulkas dan freezer | Suhu di lima tempat |
| sd4-mat-urut-suhu-stasiun-cuaca | s3 | Malam di kutub | Suhu di lima kota |
| sd4-mat-urut-suhu-stasiun-cuaca | s9 | Danau beku | Suhu lima danau |
| sd3-mat-pilih-satuan-ukur | i-jalan-mendaki-gunung | jalan mendaki gunung | jarak jalan kaki ke puncak gunung |

## Ditolak (bukan masalah)
| temuan | alasan |
|---|---|
| sd4-mat-bulatkan-ratusan, sd4-mat-pecahan-senilai-pizza: ronde hanya 3 kartu | Mesin pilah sudah diperbaiki koordinator; audit tidak lagi melaporkan `ronde-kurang-item` untuk kedua paket. Stok tidak ditambah. |
| sd4-mat-garis-simetri-huruf i21: usul `width: 0.6` | Masalahnya benar, tapi usulannya tidak bekerja (SVG mempertahankan aspek). Diperbaiki dengan cara lain (gambar dihapus), lihat Diterapkan. |
| sd3-mat-urut-jadwal-digital barisan 7: usul "09.15 olahraga" | Usulan merusak urutan naik (08.45 membaca buku sesudahnya). Diperbaiki dengan susunan lain, lihat Diterapkan. |

## Butuh keputusan owner
| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sd3-mat-jadwal-tertukar (MAT.SD3.WAKTU.01) | Kegiatan siang/sore ditulis 12 jam ("01.30 makan siang"), bertentangan dengan SD4 jam-24. Catatan kompetensi SENGAJA memakai 12 jam ("jadwal siang memakai jam 12-an lalu 01-an (12 jam)"), dan paket kembaran urut-jadwal-digital justru 24 jam. | (a) Ubah catatan WAKTU.01 ke 24 jam dan tambah 12 pada jadwal j3, j6, j10, j12 (s11–s15, s26–s30, s46–s50, s56–s60); (b) pertahankan 12 jam tetapi tambahkan keterangan "siang/sore" pada kartu. |
| SEDANG | sd3-mat-segi-banyak-beraturan | Emoji 🔷/🔶 untuk belah ketupat bisa tampak seperti persegi diputar (beraturan). Skema Bentuk belum punya rombus. | Tambah `shape: "rhombus"` di skema + benda.tsx (perlu kode), atau hapus emoji (label saja). |
| SEDANG | sd3-mat-kotak-tersembunyi (MAT.SD3.TAMBAH-KURANG-1000.03) | Semua soal hanya sampai 25 (tingkat SD1–SD2), padahal modul sampai 1.000. | Tulis ulang kartu dengan bilangan ratusan (□+250=600, 700−□=420, …) dan rak ratusan. |
| SEDANG | MAT.SD4.TAMBAH-KURANG.01 (kurikulum MAT-SD4) | Pernyataan dan catatan kompetensi masih "kembalian dari Rp50.000 atau Rp100.000", sedangkan mesin membayar dengan uang terkecil yang lebih besar dari harga (barang < Rp20.000 dibayar 10/20 ribu). Instruksi paket sudah disesuaikan dengan mesin; teks kompetensi belum. Juga praktis sama dengan MAT.SD3.UANG.01. | (a) Naikkan harga barang < Rp20.000 ke Rp21.000–49.000 (komik 28000, buku gambar 22000, penggaris 21000, gunting 24000; bola 27000, yoyo 22000, balon 23000) sehingga mesin selalu membayar 50/100 ribu sesuai kompetensi; (b) ubah teks kompetensi; (c) naikkan tingkat SD4 (harga tidak bulat, 2–3 barang) atau gabungkan dengan SD3. |
| KECIL | sd4-mat-rak-hasil-kali vs sd3-mat-tabel-* | Kartu SD4 identik dengan SD3; kemajuan tipis. | Isi SD4 dengan hasil berpasangan ≥ 3 (36, 24, 40) plus tabel 7, atau ganti ke fakta bagi. |
