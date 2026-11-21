# QA putaran 3 — TK B (MAT, SAINS, KODE)

Bahan: dump `qa3/dump/{MAT,SAINS,KODE}-TKB.txt`, JSON paket, presenter (`benda.tsx`, `pilah.tsx`, `simulasi.tsx`, `dagang.tsx`), mesin `packages/mechanics/src/{dagang,pilah}.ts`. Temuan yang sudah diputuskan/ditolak di audit 21 Nov tidak diangkat lagi.

Catatan penting untuk TK B: di mode `pilih` label kartu **tidak ditulis** (`pilah.tsx`: label mulai SD1), dan `color` pada emoji hanya jadi latar bila emoji yang sama muncul dengan ≥2 warna di paket. Jadi di TK B gambar harus bisa dipahami sendiri.

## 1. Tabel temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| visual | sains-rak-bahan-dapur | item `sendokkayu` | Emoji 🥄 di semua perangkat adalah sendok logam, padahal kartu masuk rak **kayu** (rak logam ada di binCount 2 bawaan). | diperbaiki: diganti `pintu` 🚪 "pintu dapur kayu" (1.1.2 → 1.1.3) |
| visual | sains-benda-dibuat-dari-apa | item `kacamobil` | 🚗 menggambar mobil utuh (kesan logam) untuk "kaca depan mobil" yang harus masuk rak **kaca**. | diperbaiki: diganti `jendela` 🪟 "kaca jendela" (1.0.3 → 1.0.4) |
| visual | sains-mana-benda-langit | `t-bulan` | "Bulan kecil dan abu-abu", padahal 🌕 tampil kuning dan `color` #263238 diabaikan (hanya satu 🌕). "Kecil" juga cocok untuk Mars (skala 0,8) yang ada di pilihan soal ini. | diperbaiki: "Mana Bulan? Bulan bersinar di langit malam." (1.1.0 → 1.1.1) |
| ambigu | sains-bekerja-dulu-di-taman | `soal-1` (lompat tali), `soal-3` (naik tangga perosotan) | Pilihan memuat paru-paru, yang juga bekerja keras saat melompat/memanjat. Catatan kompetensi sendiri mengakui "lari → jantung juga benar", dan soal-2 (berlari) sudah sengaja tanpa paru. | diperbaiki: `paru` dihapus dari pilihan kedua soal → [kaki, otak] (1.0.3 → 1.0.4) |
| tidak-sesuai | kubus-kue-toko | `croissant` (locale.id) | Ejaan "croissant", padahal keputusan QC 21 Nov menyeragamkan "kroisan" (bayar-rupiah-toko-roti sudah). | diperbaiki: "kroisan" (EN tetap) (1.0.1 → 1.0.2) |
| visual | kubus-kue-toko | `roti-panjang` / `cokelat-batang` | Cokelat batang 10 kubus lebih panjang dari roti panjang (baguette) 8 kubus. | diperbaiki: nilai & lebar ditukar (roti panjang 10, cokelat batang 8) |
| visual | penggaris-kubus-meja | `kunci` / `krayon` | Kunci 4 kubus lebih panjang dari krayon 3 kubus. | diperbaiki: ditukar (krayon 4, kunci 3) (1.0.2 → 1.0.3) |
| ambigu | cari-blok-penabrak | `instruksi` | "Baca programnya" untuk anak TK B yang belum lancar membaca; program berupa blok bergambar. | diperbaiki: "Lihat programnya, …" ID+EN (1.0.1 → 1.0.2) |
| visual | tukar-uang-bank-mini | `goods` | Lembar uang memakai 💵 (dolar AS) dengan warna sembarang; paket kembarannya mesin-tukar-koin sudah memakai `shape: "uang"` + `angka`. | diperbaiki: tiga lembar jadi `shape: "uang"` + angka 2.000/5.000/10.000, warna laci standar (1.2.1 → 1.2.2). Catatan: presenter tukar menggambar lembar dari `visualUang`, bukan dari goods → lihat Butuh kode B |
| tidak-sesuai | hitung-biji-kebun-11-20, hitung-kelereng-11-20 | mesin `hitung` | Kompetensi MAT.TKB.BILANGAN-20.01 = menghitung 11–20 (customerRule.itemsMin 11), tetapi mesin mengundi target 1..itemsMax: contoh ronde seed 11 = 7 daun/kancing, seed 977 = 10 biji/kelereng. | Butuh kode A |
| visual | mesin-tukar-koin, tukar-uang-bank-mini, bayar-rupiah-*, kasir-kembalian-* | presenter dagang | Uang kertas di balon pembeli/laci tetap 💵 dolar dari `visualUang`. | Butuh kode B |
| tidak-sesuai | bayar-rupiah-alat-tulis, bayar-rupiah-toko-roti, kasir-kembalian-toko-mainan, kasir-kembalian-warung | `barangIkutHarga` tidak aktif | Barang yang tampil tidak sesuai `price`-nya: contoh ronde seed 11 alat tulis = kuas (price 7.000) dengan harga Rp3.000; toko roti = bolu (7.000) Rp3.000; kembalian = kelereng (5.000) Rp9.000. Di sesi yang sama barang yang sama bisa muncul dengan harga berbeda. Keempat paket sudah punya tepat satu barang per tingkat harga. | Keputusan K1 |
| visual | sains-lapisan-tulang-otot-organ, sains-pilah-lapisan-tubuh-kelas, sains-rak-bahan-dapur, sains-rak-bahan-halaman, kue-tiga-tahap | ikon rak | Ikon rak sama dengan emoji item sehingga anak bisa mencocokkan gambar, bukan konsep: 🦴/💪/🫀 (tulang paha, otot lengan, jantung), 🦴×3/💪/🫁, 🪵 talenan/🧴 botol/🥛 gelas, 🪵 pagar/🔩 baut, 🥣 "campur tepung dengan telur". | Keputusan K2 |
| visual | sains-lapisan-laut | `sungut` vs `siputpalung` | "ikan berlampu" (rak laut dalam) dan "ikan siput palung" (rak palung) sama-sama 🐟, hanya beda latar. | Keputusan K3 (butuh aset) |
| visual | sains-mana-yang-dari-kayu | item `ember` (mode pilih, tanpa label) | 🪣 di sebagian perangkat tampak seperti ember logam; ia jawaban soal plastik dan pengecoh di dua soal logam (`t-logam2`, kunci). | Keputusan K4 (cek perangkat) |
| tidak-sesuai | tukar-uang-bank-mini | knob `harga` 7–12 (default 12) | Total sampai Rp12.000 dan memakai uang sepuluh ribu, melewati modul "Uang sampai Rp10.000" dan pernyataan kompetensi (lima ribu & dua ribu). Default 12 sekaligus tingkat tersulit. | Keputusan K5 |
| visual | sains-antar-ke-lapisan-laut | pilihan `dalam` 🌊 | Ombak terkesan permukaan laut untuk "laut dalam". | ditolak: tiga gambar tetap jelas beda (karang, ombak/laut, lubang) dan dibacakan; skema belum punya `latar` untuk memaksa latar gelap |
| tidak-sesuai | tebak-petak-angkasa | knob `turns` 1–2 | Catatan kompetensi: "tanpa belok → 1 belok". | ditolak: tebak-petak-berikutnya menutup 0–1; angkasa sebagai lanjutan di kompetensi pengaya |
| visual | jengkal-meja-dapur | item `taplak` 🧣 "syal" | Syal di meja dapur kurang cocok tema. | ditolak: tidak ada emoji taplak; nilai 10 jengkal wajar, tugas tidak terganggu |
| visual | sains-pilah-lapisan-tubuh-kelas | tiga 🦴 beda skala | Tulang belakang, jari, kering tampak sama. | ditolak: ketiganya satu rak (tulang), label tertulis di mode kelompok |

Dicek bersih (tidak ada temuan): semua kunci soal pilih SAINS (cari/mana organ, piring, murah-sehat, air-cahaya, pot layu, lapisan laut, rancang ciri, benda langit, mengitari, siang-malam, senter, bahan), stok-buah/stok-sayur-piktogram (11 soal masing-masing, cocok dengan count), penempatan item ke rak di semua paket kelompok, urutan kue-tiga-tahap-urut dan lanjutkan-hitungan, jam kegiatan (tidak ada jam ganda), perbaiki-dua-belokan (dua blok salah memang belokan).

## 2. Kalimat suara berubah (locale.id)

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sains-rak-bahan-dapur | i-sendokkayu | sendok kayu | (dihapus) |
| sains-rak-bahan-dapur | i-pintu | (tidak ada) | pintu dapur kayu |
| sains-benda-dibuat-dari-apa | i-kacamobil | kaca depan mobil | (dihapus) |
| sains-benda-dibuat-dari-apa | i-jendela | (tidak ada) | kaca jendela |
| sains-mana-benda-langit | t-bulan | Mana Bulan? Bulan kecil dan abu-abu. | Mana Bulan? Bulan bersinar di langit malam. |
| kubus-kue-toko | croissant | croissant | kroisan |
| cari-blok-penabrak | instruksi | Baca programnya, cari blok yang membuat robot menabrak, lalu ganti. | Lihat programnya, cari blok yang membuat robot menabrak, lalu ganti. |

## 3. Butuh kode

- **A. `packages/mechanics/src/dagang.ts` mode `hitung`**: `target = acakInt(r, 1, maxCount)` mengabaikan `customerRule.itemsMin`. Usul: `acakInt(r, Math.min(Math.max(1, rule.itemsMin), maxCount), maxCount)`. Dampak TK B: hitung-biji-kebun-11-20, hitung-kelereng-11-20 (sekarang 1–12, seharusnya 11–12 di default lalu sampai 20). Cek paket hitung jenjang lain yang itemsMin-nya > 1 sebelum mengubah.
- **B. `src/components/akademi/dagang.tsx` `visualUang`**: uang kertas masih `emoji: "💵"` + latar warna. Ganti ke `shape: "uang"` + `angka` (sudah ada di benda.tsx sejak putaran 2) supaya balon pembeli, slot tukar, dan laci menampilkan rupiah, bukan dolar.

## 4. Keputusan

- **K1** bayar-rupiah-alat-tulis, bayar-rupiah-toko-roti, kasir-kembalian-toko-mainan, kasir-kembalian-warung: aktifkan `barangIkutHarga: true`? Keempatnya sudah punya satu barang per tingkat harga, jadi barang selalu sesuai harganya (audit `harga-barang-tak-cocok` bersih). Konsekuensi: tiap harga selalu barang yang sama. Putaran 2 sengaja membiarkannya nonaktif; tidak diubah.
- **K2** Ikon rak sama dengan emoji item (daftar di tabel). Opsi: ganti ikon rak dengan gambar yang tidak dipakai item (mis. rak tulang 💀 dan buang tengkorak, rak organ 🧠…), atau terima sebagai contoh rak (catatan TULANG-OTOT-ORGAN.02 memang meminta "label lapisan organ memuat jantung sejak contoh").
- **K3** sains-lapisan-laut: aset ikan laut dalam berlampu dan ikan siput palung, atau ganti salah satu dengan hewan beremoji beda.
- **K4** sains-mana-yang-dari-kayu: cek 🪣 di iPad/Android target; bila tampak logam, ganti ember dengan 🧴 "botol plastik".
- **K5** tukar-uang-bank-mini: turunkan max/default `harga` ke 10 (sesuai modul) atau terima sebagai pengaya di atas modul.

## 5. Angka

- Paket diperiksa: 95 (MAT 38, SAINS 37, KODE 20)
- Temuan: 20
- Diperbaiki: 9 (8 paket, naik versi patch)
- Butuh kode: 2 · Keputusan: 5
- Ditolak: 4
- `npm run -s akademi:validate`: 810 paket valid, 0 error. `npm run -s akademi:audit`: ERROR 0, WARNING 0.
