# Perbaikan 02 — MAT SD1 & SD2

Sumber: temuan-02-mat-sd1-2.md. Semua berkas diubah lewat skrip JSON (indent 2, Unicode apa adanya; format bolak-balik sudah dicek identik dengan aslinya). Validasi skema: 810 paket valid, 0 error. Audit: ERROR 0. Ada dua WARNING di paket MAT SD2 yang tidak ada di laporan, jadi tidak disentuh: `instruksi-kembar` sd2-mat-tabel-dua-lima-kecil/sd2-mat-tabel-lima-sepuluh dan `instruksi-terlalu-panjang` sd2-mat-larik-nampan-kue (29 kata).

Catatan: `src/lib/akademi/katalog.generated.ts` masih memuat isi lama (misalnya urutan "lewati akhir pekan"). Berkas itu menunggu `akademi:index` dari koordinator.

## Diterapkan

| keparahan | paket | apa yang diubah |
|---|---|---|
| SEDANG | sd1-mat-sisi-bentuk-kota 1.0.0→1.0.1 | Label ⚠️ "rambu peringatan" → "tanda awas" (EN "warning symbol"); bin tetap `tiga` |
| SEDANG | sd1-mat-urutan-hari 1.0.0→1.0.1 | Urutan `lewat-sabtu`, `lewat-minggu`, `lewat-jumat` dihapus beserta 3 kunci judulnya (ID+EN); masih tersisa 7 urutan "Mulai hari …" |
| SEDANG | sd1-mat-rak-puluhan-satuan 1.1.0→1.1.1 | Kartu kembar `b20` ("10+10") dihapus; rak 20 tetap punya a20, c20, n20 |
| SEDANG | sd1-mat-jam-setengah-siang 1.0.0→1.0.1 | (temuan `keputusan`, aman karena hanya judul) Judul "Jam Setengah: Siang" → "Jam Setengah: Pukul 1 sampai 6" (EN "Half Past: 1 to 6 o'clock"); kartu digital tidak diubah |
| SEDANG | sd1-mat-urut-ringan-berat 1.0.0→1.0.1 | Label "batu besar" → "batu" (EN "big rock" → "stone"); urutan berat-7 tetap |
| SEDANG | sd2-mat-huruf-simetris 1.0.0→1.0.1 | Item `huruf-k` dan kunci `i-k` dihapus; masih ada 15 simetris dan 10 tidak simetris |
| KECIL | sd1-mat-sisa-kelereng-20 1.0.0→1.0.1 | Barang "kancing" 🟡 → "kelereng kuning" (EN "yellow marbles"), jadi instruksi "kelereng" berlaku untuk dua barang itu |
| KECIL | sd1-mat-jam-setengah-pagi 1.0.0→1.0.1 | Contoh di instruksi "Setengah 4 … 3.30" → "Setengah 7 … 6.30" (ID+EN) |
| KECIL | sd1-mat-bayar-puluhan-satuan 1.0.0→1.0.1 | "kaos" → "kaus"; EN instruksi → "The price is between 11,000 and 19,000. Use one ten-thousand note, then add enough thousand coins." |
| KECIL | sd2-mat-bayar-lima-puluh-ribu 1.0.0→1.0.1 | "kaos" → "kaus"; "kotak pensil" ✏️ → "krayon" 🖍️ (EN "crayons"), harga tetap 12.000. Dipilih "krayon" karena 🖍️ memang krayon, bukan pensil warna. |
| KECIL | sd2-mat-genap-dua-puluh-koin 1.0.0→1.0.1 | "kotak pensil" ✏️ → "krayon" 🖍️ (EN "crayons"); (temuan `keputusan`, aman karena hanya judul) judul → "Lengkapi Dua Puluh Koin" |
| KECIL | sd1-mat-genap-sepuluh-koin 1.0.0→1.0.1 | (temuan `keputusan`, aman karena hanya judul) Judul "Genap Sepuluh Koin" → "Lengkapi Sepuluh Koin"; EN tetap "Make Ten Coins" |
| KECIL | sd2-mat-rumah-es-keluarga 1.0.0→1.0.1 | Judul → "Pondok Keluarga Bilangan"; instruksi "rumah es/rumahnya" → "pondok/pondoknya"; EN → "Number Family Huts" / "hut". Emoji 🛖 dan id paket tetap. |
| KECIL | sd2-mat-kembalian-puluhan-ribu 1.1.0→1.1.1 | "sepeda roda tiga" → "sepeda" (EN "tricycle" → "bicycle"); harga tetap |
| KECIL | sd2-mat-penggaris-hasil-kebun 1.0.0→1.0.1 | Judul "Mengukur Hasil Kebun" → "Mengukur di Kebun" (EN "Measuring in the Garden") |
| KECIL | sd2-mat-bayar-pas-toko-kue 1.0.0→1.0.1 | "croissant" → "kroisan" (EN tetap) |
| KECIL | sd1-mat-pola-tangan-bintang 1.0.0→1.0.1 | Knob `distractor` default 1 → 0, keterangan "pengecoh di palet: 0 → 1" (searah dengan paket saudaranya) |
| KECIL | sd2-mat-urut-seperempat-setengah 1.0.0→1.0.1 | `pecahan-2` disisipi "2/4" sesudah 1/4 (1/4, 2/4, ¾, 2/2); `pecahan-8` ditambah "1" di akhir (¼, 1/2, 3/4, 1). Dengan steps 3, urutannya tetap benar. |

## Kalimat suara berubah (WAJIB lengkap)

| paket | kunci locale.id | teks lama | teks baru |
|---|---|---|---|
| sd1-mat-sisi-bentuk-kota | i-rambu-peringatan | rambu peringatan | tanda awas |
| sd1-mat-urutan-hari | j-mulai-hari-sabtu-lewati-akhir-pekan | Mulai hari Sabtu, lewati akhir pekan | (dihapus) |
| sd1-mat-urutan-hari | j-mulai-hari-minggu-lewati-akhir-pekan | Mulai hari Minggu, lewati akhir pekan | (dihapus) |
| sd1-mat-urutan-hari | j-mulai-hari-jumat-lewati-akhir-pekan | Mulai hari Jumat, lewati akhir pekan | (dihapus) |
| sd1-mat-jam-setengah-siang | judul | Jam Setengah: Siang | Jam Setengah: Pukul 1 sampai 6 |
| sd1-mat-urut-ringan-berat | s-batu-besar | batu besar | batu |
| sd2-mat-huruf-simetris | i-k | K | (dihapus) |
| sd1-mat-sisa-kelereng-20 | g-kancing | kancing | kelereng kuning |
| sd1-mat-jam-setengah-pagi | instruksi | Setengah 4 artinya setengah jalan menuju pukul 4, yaitu 3.30. Taruh tiap jam di raknya. | Setengah 7 artinya setengah jalan menuju pukul 7, yaitu 6.30. Taruh tiap jam di raknya. |
| sd1-mat-bayar-puluhan-satuan | g-kaos | kaos | kaus |
| sd2-mat-bayar-lima-puluh-ribu | g-kaos | kaos | kaus |
| sd2-mat-bayar-lima-puluh-ribu | g-kotak-pensil | kotak pensil | krayon |
| sd2-mat-genap-dua-puluh-koin | g-kotak-pensil | kotak pensil | krayon |
| sd2-mat-genap-dua-puluh-koin | judul | Genap Dua Puluh Koin | Lengkapi Dua Puluh Koin |
| sd1-mat-genap-sepuluh-koin | judul | Genap Sepuluh Koin | Lengkapi Sepuluh Koin |
| sd2-mat-rumah-es-keluarga | judul | Rumah Es Keluarga Bilangan | Pondok Keluarga Bilangan |
| sd2-mat-rumah-es-keluarga | instruksi | Tiap rumah es dihuni tiga bilangan. Kalimat tambah dan kurang yang memakai tiga bilangan itu satu keluarga. Antar ke rumahnya. | Tiap pondok dihuni tiga bilangan. Kalimat tambah dan kurang yang memakai tiga bilangan itu satu keluarga. Antar ke pondoknya. |
| sd2-mat-kembalian-puluhan-ribu | g-sepeda-roda-tiga | sepeda roda tiga | sepeda |
| sd2-mat-penggaris-hasil-kebun | judul | Mengukur Hasil Kebun | Mengukur di Kebun |
| sd2-mat-bayar-pas-toko-kue | g-croissant | croissant | kroisan |

## Ditolak (bukan masalah)

| temuan | alasan |
|---|---|
| sd1-mat-carroll-merah-bulat: ronde hanya 3 benda padahal `itemCount.min` 4 | Mesin pilah sudah diperbaiki koordinator. Simulasi dengan binCount 2 dan itemCount 4 (seed 1, 2, 3, 11) selalu memberi 4 benda, dan audit tidak melaporkan `ronde-kurang-item` untuk paket ini. Stok tidak ditambah. |

## Butuh keputusan owner

| keparahan | paket/kompetensi | masalah | opsi |
|---|---|---|---|
| SEDANG | sd1-mat-jam-setengah-siang (MAT.SD1.WAKTU.01) | Judul sudah dinetralkan. Kartu digital 01.00–05.30 dalam format 24 jam tetap berarti dini hari. | Biarkan (judul netral), atau ganti kartu digital ke 13.00–17.30 (berarti mengajarkan format 24 jam di SD1) |
| SEDANG | sd1-mat-datar-atau-ruang, sd1-mat-rak-mainan-datar-ruang (MAT.SD1.BANGUN.02) | Bangun datar selalu berupa shape polos dan bangun ruang selalu berupa emoji benda, jadi anak bisa memilah dari gaya gambar | Tambah benda datar nyata berupa emoji (📄 kertas, 🃏 kartu, 🪧 papan nama) dan/atau bangun ruang berupa shape; ganti sebagian item |
| KECIL | sd1-mat-urut-isi-wadah, sd1-mat-wadah-halaman-isi (MAT.SD1.UKUR.02) | 🏊 adalah orang berenang, bukan kolam | Ganti dengan 🛢️ "tong air" atau 🛁 (perlu cek ulang urutan isi), atau label "kolam renang besar" |
| KECIL | sd1-mat-belanja-ringan-berat | 🎃 labu Halloween asing bagi anak | Ganti dengan 🍉 "semangka" (berat di antara kelapa dan kambing); cek bentrok dengan barang lain |
| KECIL | sd2-mat-bayar-lima-puluh-ribu | 🧃 kotak jus Rp16.000 tidak realistis dan bukan perlengkapan sekolah | Usulan krayon sudah dipakai untuk menggantikan "kotak pensil". Barang pengganti lain: 📏 "penggaris" / 📐 "set penggaris" Rp16.000 |
| KECIL | sd2-mat-kembalian-loket-stasiun (MAT.SD2.UANG.02) | Harga kelipatan 5.000, sedangkan catatan kompetensi menyebut kelipatan 10.000 | Selaraskan catatan kompetensi, atau biarkan sebagai tingkat lanjut |
| KECIL | sd1-mat-bagi-dua-piknik (MAT.SD1.PECAHAN.01) | Mesin bagi dibatasi 12, sedangkan kompetensi menyebut sampai 20 | Terima batasan ini (paket rak-setengah menutup 14–20), atau perluas mesin |
