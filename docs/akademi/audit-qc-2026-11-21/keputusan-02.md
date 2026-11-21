# Keputusan owner — Kelompok 02 (MAT SD1, SD2)

## Keputusan yang diambil
| butir | keputusan | perubahan |
|---|---|---|
| sd1-mat-jam-setengah-siang: kartu digital 01.00–05.30 terbaca dini hari (MAT.SD1.WAKTU.01) | Tidak mengajarkan format 24 jam di SD1. Kartu digital ditulis tanpa nol di depan (1.00, 1.30 … 5.30), sama dengan label jam "jam 1.30" dan pernyataan kompetensi "pukul 3.30". | 10 nilai locale id+en (`i-0Xt00/30`), versi 1.0.1 → 1.0.2. Catatan kompetensi WAKTU.01 diperbarui (contoh 3.30, alasan tanpa nol depan). |
| sd1-mat-datar-atau-ruang, sd1-mat-rak-mainan-datar-ruang: bangun datar selalu shape, bangun ruang selalu emoji (MAT.SD1.BANGUN.02) | Gaya gambar dicampur: bangun datar kini juga berupa emoji benda pipih nyata. 🃏 tidak dipakai (kartu remi/judi). Instruksi diganti dari "bisa dipegang" (kertas juga bisa dipegang) menjadi pipih vs tebal. | datar-atau-ruang 1.0.0→1.0.1: shape bintang diganti ⭐ "stiker bintang", tambah 📄 "selembar kertas"; datar kini 4 shape + 3 emoji (🔶 ⭐ 📄). rak-mainan 1.0.0→1.0.1: shape bintang kuning diganti ⭐ "stiker bintang kuning", tambah 📄 "kertas lipat"; ikon rak datar 📄→🟥 supaya tidak membocorkan jawaban. Catatan BANGUN.02 diperbarui. |
| sd1-mat-urut-isi-wadah, sd1-mat-wadah-halaman-isi: 🏊 orang berenang, bukan kolam (MAT.SD1.UKUR.02) | Kolam renang dihapus. Wadah besar memakai 🛁 bak mandi atau 🛢️ "tong air". Bak mandi dan tong air yang isinya mirip tidak pernah muncul dalam satu urutan. | urut-isi-wadah 1.0.0→1.0.1: ditulis ulang menjadi 9 urutan berbeda dengan 4 langkah dari sendok<gelas<teko<ember<(bak mandi / tong air). wadah-halaman-isi 1.0.0→1.0.1: 5 urutan yang memuat kolam (wadah-3/5/6/10/12) diganti kombinasi baru dari sendok<cangkir<mangkuk<panci<ember<tong; semua 12 urutan tetap berbeda. Catatan UKUR.02 diperbarui. |
| sd1-mat-belanja-ringan-berat: 🎃 labu Halloween | Diganti 🍉 "semangka" (3–6 kg: lebih berat dari kelapa, lebih ringan dari kambing). Tidak bentrok dengan barang lain. | id/kunci `labu`/`s-labu` → `semangka`/`s-semangka` di 6 urutan, versi 1.0.0→1.0.1. |
| sd2-mat-bayar-lima-puluh-ribu: 🧃 kotak jus Rp16.000 | Diganti 📐 "set penggaris" Rp16.000 (perlengkapan sekolah, harga wajar). | barang `jus` → `penggaris`, kunci `g-kotak-jus` → `g-set-penggaris`, versi 1.0.1→1.0.2. |
| sd2-mat-kembalian-loket-stasiun: harga kelipatan 5.000, catatan kompetensi menyebut 10.000 (MAT.SD2.UANG.02) | Catatan kompetensi disesuaikan menjadi kelipatan 5.000. Hitung maju dengan lima ribuan masih cocok untuk SD2 dan pernyataan "harga puluhan ribu" tetap terpenuhi. Paket sd2-mat-kembalian-puluhan-ribu (kelipatan 10.000) menjadi tahap awalnya. | Hanya catatan MAT.SD2.UANG.02 di MAT-SD2.json. Paket tidak diubah. |
| sd1-mat-bagi-dua-piknik: mesin bagi dibatasi 12, kompetensi menyebut 20 (MAT.SD1.PECAHAN.01) | Batasan diterima. Jumlah 14–20 sudah dilatih oleh sd1-mat-rak-setengah-piring (rak s1–s10). | Hanya catatan PECAHAN.01: simulasi bagi sampai 12, pilah rak setengah untuk 14–20. |
| Tambahan: instruksi sd2-mat-larik-nampan-kue terlalu panjang (29 kata) | Kata pembuka "Di nampan," dihapus, kalimat dirapatkan (26 kata). | id+en, versi 1.0.0→1.0.1. |
| Tambahan: instruksi sd2-mat-tabel-dua-lima-kecil dan sd2-mat-tabel-lima-sepuluh sama persis | Masing-masing menyebut loncatannya. | dua-lima: "Hitung loncat dua-dua atau lima-lima kalau perlu. …"; lima-sepuluh: "Hitung loncat lima-lima atau sepuluh-sepuluh kalau perlu. …" (id+en), versi masing-masing 1.0.0→1.0.1. |

## Kalimat suara berubah
| paket | kunci | lama | baru |
|---|---|---|---|
| sd1-mat-datar-atau-ruang | instruksi | Bangun datar tipis seperti gambar. Bangun ruang bisa dipegang dan punya isi. Pilah semuanya. | Bangun datar pipih seperti selembar kertas. Bangun ruang tebal, bisa digenggam, dan punya isi. Pilah semuanya. |
| sd1-mat-datar-atau-ruang | i-bintang | bintang | (dihapus) |
| sd1-mat-datar-atau-ruang | i-stiker-bintang | (tidak ada) | stiker bintang |
| sd1-mat-datar-atau-ruang | i-kertas | (tidak ada) | selembar kertas |
| sd1-mat-jam-setengah-siang | i-01t00 | 01.00 | 1.00 |
| sd1-mat-jam-setengah-siang | i-01t30 | 01.30 | 1.30 |
| sd1-mat-jam-setengah-siang | i-02t00 | 02.00 | 2.00 |
| sd1-mat-jam-setengah-siang | i-02t30 | 02.30 | 2.30 |
| sd1-mat-jam-setengah-siang | i-03t00 | 03.00 | 3.00 |
| sd1-mat-jam-setengah-siang | i-03t30 | 03.30 | 3.30 |
| sd1-mat-jam-setengah-siang | i-04t00 | 04.00 | 4.00 |
| sd1-mat-jam-setengah-siang | i-04t30 | 04.30 | 4.30 |
| sd1-mat-jam-setengah-siang | i-05t00 | 05.00 | 5.00 |
| sd1-mat-jam-setengah-siang | i-05t30 | 05.30 | 5.30 |
| sd1-mat-rak-mainan-datar-ruang | instruksi | Bangun datar hanya bisa digambar di kertas. Bangun ruang bisa digenggam dan punya isi. Pilah tiap barang di toko. | Bangun datar pipih seperti stiker. Bangun ruang tebal, bisa digenggam, dan punya isi. Pilah tiap barang di toko. |
| sd1-mat-rak-mainan-datar-ruang | i-bintang-kuning | bintang kuning | (dihapus) |
| sd1-mat-rak-mainan-datar-ruang | i-stiker-bintang | (tidak ada) | stiker bintang kuning |
| sd1-mat-rak-mainan-datar-ruang | i-kertas-lipat | (tidak ada) | kertas lipat |
| sd1-mat-belanja-ringan-berat | s-labu | labu besar | (dihapus) |
| sd1-mat-belanja-ringan-berat | s-semangka | (tidak ada) | semangka |
| sd1-mat-urut-isi-wadah | s-kolam-renang | kolam renang | (dihapus) |
| sd1-mat-urut-isi-wadah | s-tong | (tidak ada) | tong air |
| sd1-mat-wadah-halaman-isi | s-kolam | kolam renang | (dihapus) |
| sd2-mat-bayar-lima-puluh-ribu | g-kotak-jus | kotak jus | (dihapus) |
| sd2-mat-bayar-lima-puluh-ribu | g-set-penggaris | (tidak ada) | set penggaris |
| sd2-mat-larik-nampan-kue | instruksi | Di nampan, 3 × 5 artinya 3 baris dan tiap baris 5 kue, sama dengan 5 + 5 + 5. Taruh tiap nampan dan kartu tambah di rak perkaliannya. | 3 × 5 artinya 3 baris, tiap baris 5 kue, sama dengan 5 + 5 + 5. Taruh tiap nampan dan kartu tambah di rak perkaliannya. |
| sd2-mat-tabel-dua-lima-kecil | instruksi | Hitung loncat kalau perlu. Taruh tiap kartu perkalian di rak hasilnya. | Hitung loncat dua-dua atau lima-lima kalau perlu. Taruh tiap kartu perkalian di rak hasilnya. |
| sd2-mat-tabel-lima-sepuluh | instruksi | Hitung loncat kalau perlu. Taruh tiap kartu perkalian di rak hasilnya. | Hitung loncat lima-lima atau sepuluh-sepuluh kalau perlu. Taruh tiap kartu perkalian di rak hasilnya. |

## Butuh fitur baru
| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| sd1-mat-datar-atau-ruang | item `ketupat` (emoji 🔶) | shape `belah-ketupat` | `shape: "belah-ketupat"` dengan `color`. Opsional: emoji 🔶 juga ikut mencampur gaya gambar, jadi boleh dibiarkan. |
| sd1-mat-rak-mainan-datar-ruang | item `belah-ketupat-biru` (emoji 🔷) | shape `belah-ketupat` | `shape: "belah-ketupat", color: "#3f7fe0"`. Opsional, sama seperti di atas. |

## Tidak dikerjakan
| butir | alasan |
|---|---|
| (tidak ada) | Semua butir sudah ditindaklanjuti. Butir mesin bagi-12 diputuskan "terima batasan", jadi hanya catatan yang diubah. |

## Validasi
- `npx tsx packages/schema/src/cli.ts`: 810 paket valid, 0 error.
- `npm run akademi:audit`: ERROR 0. Tidak ada WARNING untuk paket kelompok 02 (instruksi-kembar dan instruksi-terlalu-panjang yang tersisa milik paket lain).
