# QA putaran 3 — TK A (MAT, SAINS, KODE)

Peninjau: agen TKA. Bahan: `dump/{MAT,SAINS,KODE}-TKA.txt`, JSON paket, `benda.tsx`, `pilah.tsx`, `urutkan.tsx`, `packages/mechanics/src/navigasi.ts`. Audit sebelumnya (ambigu & QC 21 Nov) dibaca dulu; butir yang sudah diputuskan di sana tidak diangkat lagi.

Semua kunci soal pilih (SAINS 9 paket pilih, MAT 2 paket pilih) dan penempatan item ke rak dicek satu per satu: **tidak ada kunci atau rak yang salah**. Masalah yang ditemukan ada di visual, istilah, dan peta navigasi.

## 1. Tabel temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| visual | pensil-pendek-ke-panjang | label langkah `pendek/sedang/panjang/terpanjang` | Mode susun menulis label di bawah kartu, jadi kartu berbunyi "pendek", "sedang", "panjang", "paling panjang": urutannya terbaca dari tulisan, bukan dari panjang benda. | diperbaiki: label tiap kartu = nama bendanya (`n-kereta` "kereta", dst.); 4 kunci lama dihapus |
| visual | ular-pendek-ke-panjang | label langkah `pendek/sedang/panjang/terpanjang` | Sama: label membocorkan urutan. | diperbaiki: label = nama hewan (`n-cacing` "cacing", dst.) |
| visual | rak-bentuk-ruang-dapur | item `bilyar` 🎱 | "Bola bilyar" bukan benda dapur, tidak sesuai judul/instruksi "menata dapur". | diperbaiki: 🍅 "tomat" (id `tomat`, rak bola) |
| visual | bayar-koin-kantin-sekolah | goods `nasikuning` 🍛 | 🍛 adalah nasi kari (kuah cokelat), bukan nasi kuning. | diperbaiki: 🍱 "nasi kotak" (id `nasikotak`, harga tetap 5.000) |
| visual | sains-papan-cuaca-kelas | item `mendung` 🌥️ | 🌥️ = matahari di balik awan, padahal soal mendung menyebut "matahari tidak terlihat"; mirip "cerah berawan". Paket saudara (jendela) memakai ☁️. | diperbaiki: ☁️ |
| visual | sains-siklus-kupu-kupu | langkah `telur` (3 urutan) 🍃 | Kartu tahap telur hanya bergambar daun; telurnya tidak terlihat, sehingga tampak seperti tahap "daun". Paket saudara (perbaiki) memakai 🥚 kecil. | diperbaiki: 🥚 scale 0.6 di ketiga urutan |
| ambigu | sains-kegiatan-sesuai-cuaca | item `jashujan` 🧥 #ffee58 | Warna tunggal diabaikan presenter (latar hanya untuk emoji ber-≥2 warna), jadi tampil mantel biasa. Anak yang belum membaca wajar menaruh mantel ke "berangin" (kompetensi CUACA-PAKAIAN.02: jaket saat berangin dingin). | diperbaiki: 🥾 "hujan turun, pakai sepatu bot" (id `sepatubot`) |
| visual | sains-rak-sayur-bagian-tumbuhan | item `lobak` 🥕 #f5f5f5 | Warna tunggal diabaikan: "lobak putih" tampil wortel oranye, kembar dengan kartu wortel. | diperbaiki: bentuk `akar` warna krem #e9e2d0 |
| visual | sains-anak-siapa-di-peternakan | item `bebekmenetas` 🐣 | 🐣 = anak ayam menetas, dilabeli anak bebek; di paket saudara (anak-dan-induk) 🐣 masuk ke ayam. Audit sebelumnya menetapkan anak bebek = 🦆 kecil. | diperbaiki: 🦆 scale 0.5 |
| visual | sains-perbaiki-tumbuhan-utuh | urutan bugenvil, langkah bunga `color` #d81b60 | Label "bunga bugenvil ungu" tetapi latar warnanya merah muda. | diperbaiki: #8e24aa (ungu) |
| ambigu | sains-alat-gerak-hewan-pantai | `instruksi` | Istilah "alat gerak" di atas usia TK A (paket saudara memakai "cara geraknya"). | diperbaiki: "… sesuai cara bergeraknya." |
| tidak-sesuai | cerita-urut-peternakan | urutan anak-ayam, langkah `menetas-telur` 🐓 | "Induk mengerami telur" bergambar ayam jago; yang mengerami ayam betina. | diperbaiki: 🐔 |
| visual | lagu-tiga-nada | item `marakas` 🪇 | Emoji Unicode 15: tampil kotak kosong di Android 13 ke bawah (tidak ada fon emoji bawaan). | diperbaiki: 🪘 "kendang" (id `kendang`, Unicode 13) |
| visual | sains-cari-hewan-air | item `ubur` 🪼 | Emoji Unicode 15, sama seperti di atas; dipakai sebagai jawaban satu soal. | diperbaiki: 🐡 "ikan buntal" (id `buntal`, soal ikut diganti id) |
| visual | perbaiki-urutan-pagi | urutan sisir, langkah `sisir-2` 🪮 | Emoji Unicode 15, sama seperti di atas. | diperbaiki: 💇 (label "sisir rambut" tetap) |
| tidak-sesuai | lompati-batu-jalur-kanan | 6 grid `batu-3-jarak-5*` | Batu di petak ke-3, bintang di ke-5: program terpendek (opt 3) = lompat, lompat, maju, yaitu lompat pertama di petak kosong. Ini bertentangan dengan instruksi "taruh lompat tepat di petak batu" dan bukti kompetensi KALAU.01 (jumlah lompat = jumlah batu); anak yang menuruti instruksi (4 blok) dicatat tidak efisien. Pada knob bawaan (distance 3, rocks 1) grid ini terpilih ±separuh ronde. | diperbaiki: 6 grid dihapus (22 → 16); distance 3 tetap punya grid batu-2-jarak-4 |
| tidak-sesuai | lompati-batu-jalur-atas | 6 grid `naik-batu-3-jarak-5*` | Sama (batu 3 petak di depan, bintang 5 petak). | diperbaiki: 6 grid dihapus (22 → 16) |
| tidak-sesuai | bayar-koin-kantin-sekolah, bayar-koin-warung | harga ronde vs `price` | Contoh ronde: sate (price 1.000) ditagih 2 koin. | ditolak: sudah diputuskan di audit 21 Nov (harga dari knob, `barangIkutHarga` sengaja tidak dipakai di TK) |
| visual | jengkal-sayur-kebun | item `kacang-panjang` 🫛 | 🫛 = polong kapri (pendek), dan Unicode 15. | ditolak untuk isi: tidak ada emoji kacang panjang, dan item ini satu-satunya bernilai 3 jengkal. Masuk "Butuh kode" (fon emoji) |
| visual | pagar-bunga-keliru | palet 🌷 🌺 🌹 | Tiga bunga berwarna merah muda/merah. | ditolak: bentuknya jelas beda; pola ditukar di tengah (knob posisi 0) |
| visual | dari-kebun-ke-meja, hujan-dan-pesta-ulang-tahun | ♨️ "masak nasi", "panggang di oven" | ♨️ = uap panas. | ditolak: dipakai audit sebelumnya untuk "panas/mendidih"; tidak mengubah urutan |
| visual | perbaiki-urutan-pagi | `siram-1` 🪣 "isi gembor dengan air" | Gambar ember, label gembor. | ditolak: label ditetapkan audit ambigu 21 Nov; ember untuk menyiram wajar dan label kartu tidak dibacakan |
| visual | sains-susun-tumbuhan-utuh | 🌳 "daun rimbun", 🌲 "daun jarum di atas" | Emoji pohon utuh dipakai sebagai tahap daun. | ditolak: kartu itu tetap paling atas, tidak menimbulkan susunan benar kedua |
| ambigu | sains-papan-cuaca-kelas, sains-simbol-cuaca-jendela | `instruksi` "pasang simbol" | Mode pilih = sentuh. | ditolak: kata kerja sesuai kompetensi (memasang simbol di papan); audit instruksi-tanpa-perintah lolos |
| tidak-sesuai | jungkat-jungkit-berat | semangka (9) > batu (8) | Batu kecil lebih ringan dari semangka? | ditolak: masuk akal (batu skala 0.8), dan anak membaca sisi timbangan yang turun |
| visual | sains-lapak-panen-bagian-tumbuhan | `kol` dan `sawi` sama-sama 🥬; `ubiungu` 🍠 tanpa ungu | Kartu kembar / warna diabaikan. | ditolak untuk isi: rak jawabannya sama; dicatat di "Butuh kode" (warna tunggal) |
| ambigu | sains-bekal-cuaca-piknik | `instruksi` "benda yang harus dipakai" vs soal gerimis "Bawa apa?" | Payung dibawa, bukan dipakai. | ditolak: soal menyebut "Bawa apa?", satu jawaban jelas |
| ambigu | (pola, 6 paket) sains-darat-air-udara-kebun, sains-darat-air-udara-safari, sains-sirip-sayap-kaki, rak-bentuk-ruang-mainan, sains-rak-sayur-bagian-tumbuhan, sains-kegiatan-sesuai-cuaca | `instruksi` | Instruksi menyebut rak yang baru muncul pada binCount lebih tinggi (udara, sayap, tabung, buah/"tomat ke buah", berangin/"layang-layang ke berangin"), padahal binCount bawaan 2. | keputusan (lihat bagian 3) |

## 2. Kalimat suara berubah (locale.id)

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| pensil-pendek-ke-panjang | pendek | pendek | (dihapus) |
| pensil-pendek-ke-panjang | sedang | sedang | (dihapus) |
| pensil-pendek-ke-panjang | panjang | panjang | (dihapus) |
| pensil-pendek-ke-panjang | terpanjang | paling panjang | (dihapus) |
| pensil-pendek-ke-panjang | n-kereta | (tidak ada) | kereta |
| pensil-pendek-ke-panjang | n-bus | (tidak ada) | bus |
| pensil-pendek-ke-panjang | n-truk | (tidak ada) | truk |
| pensil-pendek-ke-panjang | n-pemadam | (tidak ada) | mobil pemadam |
| pensil-pendek-ke-panjang | n-ambulans | (tidak ada) | ambulans |
| pensil-pendek-ke-panjang | n-keretauap | (tidak ada) | kereta uap |
| pensil-pendek-ke-panjang | n-mobil | (tidak ada) | mobil |
| pensil-pendek-ke-panjang | n-traktor | (tidak ada) | traktor |
| pensil-pendek-ke-panjang | n-bajaj | (tidak ada) | bajaj |
| pensil-pendek-ke-panjang | n-minibus | (tidak ada) | mobil van |
| ular-pendek-ke-panjang | pendek | pendek | (dihapus) |
| ular-pendek-ke-panjang | sedang | sedang | (dihapus) |
| ular-pendek-ke-panjang | panjang | panjang | (dihapus) |
| ular-pendek-ke-panjang | terpanjang | paling panjang | (dihapus) |
| ular-pendek-ke-panjang | n-cacing | (tidak ada) | cacing |
| ular-pendek-ke-panjang | n-buaya | (tidak ada) | buaya |
| ular-pendek-ke-panjang | n-ikan | (tidak ada) | ikan |
| ular-pendek-ke-panjang | n-kadal | (tidak ada) | kadal |
| ular-pendek-ke-panjang | n-ulat | (tidak ada) | ulat |
| ular-pendek-ke-panjang | n-hiu | (tidak ada) | hiu |
| ular-pendek-ke-panjang | n-lumba | (tidak ada) | lumba-lumba |
| ular-pendek-ke-panjang | n-paus | (tidak ada) | paus |
| ular-pendek-ke-panjang | n-anjinglaut | (tidak ada) | anjing laut |
| ular-pendek-ke-panjang | n-berang | (tidak ada) | berang-berang |
| rak-bentuk-ruang-dapur | bilyar | bola bilyar | (dihapus) |
| rak-bentuk-ruang-dapur | tomat | (tidak ada) | tomat |
| bayar-koin-kantin-sekolah | nasikuning | nasi kuning | (dihapus) |
| bayar-koin-kantin-sekolah | nasikotak | (tidak ada) | nasi kotak |
| sains-kegiatan-sesuai-cuaca | i-jashujan | hujan turun, pakai jas hujan | (dihapus) |
| sains-kegiatan-sesuai-cuaca | i-sepatubot | (tidak ada) | hujan turun, pakai sepatu bot |
| sains-alat-gerak-hewan-pantai | instruksi | Lihat hewan di sekitar pantai. Taruh ke papan sirip, sayap, atau kaki sesuai alat geraknya. | Lihat hewan di sekitar pantai. Taruh ke papan sirip, sayap, atau kaki sesuai cara bergeraknya. |
| lagu-tiga-nada | marakas | marakas | (dihapus) |
| lagu-tiga-nada | kendang | (tidak ada) | kendang |
| sains-cari-hewan-air | i-ubur | ubur-ubur | (dihapus) |
| sains-cari-hewan-air | i-buntal | (tidak ada) | ikan buntal |

Paket lain yang diubah (papan-cuaca-kelas, siklus-kupu-kupu, rak-sayur, anak-siapa-di-peternakan, perbaiki-tumbuhan-utuh, cerita-urut-peternakan, perbaiki-urutan-pagi, lompati-batu ×2) hanya berubah emoji/warna/grid; tidak ada kalimat `locale.id` yang berubah. EN diubah sejalan untuk setiap kunci di atas.

## 3. Butuh kode

1. **Soal pilih tidak dibacakan.** `pilah.tsx` mode pilih hanya menulis `t(promptKey)`; `runner.tsx` hanya membacakan instruksi sekali di awal. Rekamannya sudah ada di manifest (mis. "Mana akarnya? Akar ada di dalam tanah."), tetapi tidak dipanggil. Anak TK A belum membaca, padahal instruksinya "Dengarkan, lalu sentuh …", dan beberapa paket bergantian arah soal: sarang-telur-selisih-satu (lebih banyak / lebih sedikit), sains-mana-yang-tenggelam (tenggelam / terapung). Tanpa suara, soal itu jadi tebakan 50%. Usul: bacakan prompt tiap ronde baru (dan saat prompt diketuk) untuk PAUD–TK B.
2. **Label kartu pilah kelompok tidak dibacakan.** Paket sains-hasil-percobaan-bak-air dan sains-percobaan-bak-cuci-dapur berinstruksi "Dengarkan hasilnya", dan paket magnet ×2 bergantung pada label "yang tadi ditarik magnet". Hasil percobaan hanya ada di tulisan. Kartu seperti 🏠 "hujan deras, berteduh di rumah" juga butuh labelnya. Usul: ucapkan label saat kartu diketuk/diangkat di PAUD–TK B.
3. **Emoji Unicode 14–15 tanpa fon emoji bawaan.** Di Android 12–13 (Unicode 14) dan ≤13 (Unicode 15) emoji ini tampil kotak kosong. Sisa di TK A: 🫛 (U15) jengkal-sayur-kebun; U14: 🛟 (rak terapung di hasil-percobaan-bak-air, percobaan-bak-cuci-dapur, tebak-apung-tenggelam), 🫙 menara-dapur, 🫗 cerita-urut-peternakan, 🫳 perbaiki-urutan-pagi, 🫘 sains-biji-sampai-berbunga & sains-perbaiki-tanaman-tumbuh, 🪷 sains-biji-sampai-berbunga & sains-susun-tumbuhan-utuh, 🪺 sains-perbaiki-siklus-ayam. Usul: sertakan fon emoji (mis. subset Noto Color Emoji) di app, atau tambah cek audit "emoji ≥ Unicode 14".
4. **Warna pada emoji tunggal diabaikan** (latar hanya bila emoji yang sama muncul dengan ≥2 warna di paket). Sisa: 🥬 kol #c5e1a5 dan 🍠 ubi ungu #7b1fa2 (lapak-panen), 🥚 telur bebek #c8e6c9 (siklus-ayam, tampil sama dengan telur ayam), 🦆 bebek karet #fff176 (tebak-apung, tampil bebek sungguhan), 🫘 kacang hijau #66bb6a (perbaiki-tanaman-tumbuh). Tidak ada yang mengubah jawaban. Usul: field `latar: true` di skema Visual.

## 4. Keputusan

- **Instruksi menyebut rak yang belum aktif pada binCount bawaan 2.** Daftarnya: sains-darat-air-udara-kebun dan -safari ("darat, air, atau udara"), sains-sirip-sayap-kaki ("sirip, sayap, atau kaki"), rak-bentuk-ruang-mainan ("bola, kubus, atau tabung"), sains-rak-sayur-bagian-tumbuhan ("tomat ke buah", ditambahkan atas keputusan QC putaran 2), dan sains-kegiatan-sesuai-cuaca ("layang-layang ke berangin"). Celengan-pecahan-uang dulu diperbaiki karena alasan yang sama, sedangkan yang lain dibiarkan. Pilihannya: (a) instruksi hanya menyebut rak yang selalu ada (mis. "payung ke hujan, jemur baju ke cerah"); atau (b) biarkan, karena rak tambahan muncul begitu anak naik tingkat. Tidak diubah.

## 5. Angka

- Paket diperiksa: **78** (MAT 24, SAINS 32, KODE 22), semuanya level TKA.
- Temuan: **28** (ditambah 4 butir "Butuh kode").
- Diperbaiki: **17** temuan di **17 paket** (versi patch tiap paket dinaikkan).
- Ditolak: **10**.
- Keputusan: **1** (pola, 6 paket).
- Kalimat `locale.id` berubah: 39 baris (seriasi 2 × [10 baru + 4 dihapus], 1 instruksi, 5 pasang label diganti).
- `npm run -s akademi:validate`: 810 paket valid. `npm run -s akademi:audit`: ERROR 0, WARNING 0.
