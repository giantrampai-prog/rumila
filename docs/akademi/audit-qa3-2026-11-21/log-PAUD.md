# QA putaran 3 — PAUD (MAT, SAINS, KODE)

Cakupan: 62 paket PAUD (MAT 22, SAINS 24, KODE 16). Setiap soal pilih, penempatan item ke rak, dan urutan dicek ke JSON. Rendering emoji dicek dengan merender Apple Color Emoji ke PNG, karena kartu PAUD tanpa tulisan dan anak hanya melihat gambar. Mesin `urutkan` (potong "akhir" = n langkah pertama) dan `pilah` (pilih memakai pilihan soal apa adanya; kelompok memfilter item ke bin aktif) juga dibaca.

Setelah perbaikan: `akademi:validate` 810 paket valid; `akademi:audit` ERROR 0, WARNING 0.

## 1. Tabel temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| tidak-sesuai | hitung-anak-ayam-kandang | judul | Judul "Anak Ayam di Kandang", padahal ronde bisa berisi bebek atau kelinci (pola yang sama dengan hitung-ikan-kolam di audit lalu) | diperbaiki: "Berhitung di Kandang" / "Counting in the Coop" |
| tidak-sesuai | hitung-kerang-pantai | judul | "Kerang di Pantai", padahal ronde bisa berisi kepiting atau penyu | diperbaiki: "Berhitung di Pantai" / "Counting on the Beach" |
| tidak-sesuai | kartu-titik-kebun-1-5 | instruksi | "Hitung hewan dan tanaman", padahal jamur bukan tanaman | diperbaiki: "Hitung yang ada di kebun, lalu seret …" (EN ikut) |
| tidak-sesuai | piring-kue-lebih-banyak | en.instruksi, en.tBanyak | Teks EN "cookies", padahal ada kue mangkuk dan donat (ID "kue" umum) | diperbaiki: EN "treats" (ID tidak berubah) |
| visual | kue-bentuk-toko | 3 item warna #fff3e0 | Kue krem hampir putih di atas kartu putih, jadi bentuknya nyaris tak terlihat | diperbaiki: warna jadi #d9a066 (cokelat muda), tetap beda dari cokelat tua dan oranye |
| visual | ular-panjang-pendek | cacing, kadal | 🪱 berbentuk huruf S dan 🦎 miring diagonal, jadi panjangnya tidak terbaca walau sudah di-scaleX. Selain itu cacing tidak berjemur | diperbaiki: 🐈 kucing dan 🐕 anjing (mendatar, wajar berjemur); id/soal disesuaikan |
| visual | pensil-panjang-pendek | kayu | 🪵 berupa dua batang kayu bertumpuk miring, tidak bisa dibaca panjang-pendeknya | diperbaiki: 🚜 "traktor mainan" |
| visual | sains-hitung-kaki-peternakan | merpati, angsa, kelinci, tikus | Instruksi "Lihat kaki hewannya", padahal 🕊️ (terbang) dan 🦢 (berenang) tidak menampakkan kaki, 🐇 duduk, dan kaki 🐁 nyaris tak terlihat. Ini jebakan yang ditulis di catatan kompetensi | diperbaiki: 🦆 bebek, 🦜 burung beo, 🐂 sapi, 🐕 anjing (kaki tampak semua) |
| visual | sains-kandang-dua-empat-kaki | ayam, burung | 🐔 dan 🐦 hanya kepala, jadi kakinya tidak bisa dihitung | diperbaiki: 🐓 dan 🦜 (label tetap "ayam", "burung") |
| visual | sains-kandang-dua-empat-kaki | bin empat | 🐾 ×4: tiap 🐾 sudah berisi beberapa jejak, jadi tampil ±8–16 jejak untuk "empat kaki". Paket kembarnya memakai 🦶 | diperbaiki: 🦶 count 4 |
| visual | sains-siang-malam-di-kebun | i-lampu | 🏮 lampion merah diberi label "lampu teras menyala" | diperbaiki: label "lampion menyala" |
| visual | sains-siang-malam-di-kebun | i-piyama | 🛌 (orang di kasur) diberi label "pakai piyama" | diperbaiki: label "tidur di kasur" |
| ambigu | sains-siang-malam-di-kebun | siram | 🪴 pot tanaman tidak memberi petunjuk siang sama sekali, padahal anak tidak membaca labelnya | diperbaiki: diganti 🌈 "pelangi di langit" (rak siang) |
| visual | sains-siap-keluar-payung-topi | cipratan | 💦 umumnya dibaca sebagai keringat (panas), sehingga mengarah ke topi, padahal kuncinya payung | diperbaiki: item dihapus (masih ada 4 kartu hujan, 5 kartu cerah) |
| visual | sains-suara-siapa-di-kebun | gagak | 🐦 + color #212121: warna diabaikan karena emoji ini hanya punya satu warna, sehingga "gagak" tampil sebagai burung biru | diperbaiki: 🐦‍⬛ (sudah dipakai di sd6-sains-racun-rantai-laut) |
| visual | siang-dan-malam | makan/habis | ✨ untuk "piring kosong" | diperbaiki: 🍽️ |
| ambigu | siang-dan-malam | hari | Dengan steps=3 tampil 🌅 pagi, ☀️ siang, 🌇 sore. Matahari terbit dan terbenam tidak bisa dibedakan anak 3–4 tahun, jadi urutan terbalik juga masuk akal | diperbaiki: 🐓 "pagi, ayam berkokok" → ☀️ "siang terik" → 🌙 "malam" (sore dihapus) |
| ambigu | siang-dan-malam | tidur-siang | 🍚 → 😴 → 🥱 "bangun tidur": menguap lazim terjadi sebelum tidur, jadi 🍚 🥱 😴 juga terbaca benar | diperbaiki: 🍚 makan siang → 🪥 sikat gigi → 😴 tidur siang |
| visual | sains-siap-keluar-payung-topi | hujan & gerimis | Dua 🌧️ tampak kembar (color gerimis diabaikan) | ditolak: keduanya masuk rak yang sama, jadi tidak ada jawaban salah |
| visual | mana-topi-warna | semua item | "Topi pesta" hanya berupa segitiga polos | ditolak: yang diuji warna, dan bentuknya sama untuk semua pilihan |
| tidak-sesuai | mana-dulu-di-rumah vs mana-dulu-alam | es, tunas | Pasangan es batu → air dan tunas → bunga dipakai di dua paket satu kompetensi | ditolak: tidak ambigu (isi kembar di luar lingkup putaran ini) |
| ambigu | sains-senam-tunjuk-tubuh | soal Dina | Soal "bagian tubuh mana yang ia pakai untuk …" menguji fungsi, bukan menunjuk saat nama disebut | ditolak: revisi owner (commit a137123) |
| visual | kebun-bunga-warna | semua | Warna bergantung pada warna emoji | ditolak: sudah diputuskan di audit QC putaran 2 |

## 2. Kalimat suara berubah (locale.id)

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| hitung-anak-ayam-kandang | judul | Anak Ayam di Kandang | Berhitung di Kandang |
| hitung-kerang-pantai | judul | Kerang di Pantai | Berhitung di Pantai |
| kartu-titik-kebun-1-5 | instruksi | Hitung hewan dan tanaman di kebun, lalu seret ke kartu yang titiknya sama banyak. | Hitung yang ada di kebun, lalu seret ke kartu yang titiknya sama banyak. |
| ular-panjang-pendek | cacing | cacing | (dihapus) |
| ular-panjang-pendek | kadal | kadal | (dihapus) |
| ular-panjang-pendek | kucing | (baru) | kucing |
| ular-panjang-pendek | anjing | (baru) | anjing |
| pensil-panjang-pendek | kayu | balok kayu | (dihapus) |
| pensil-panjang-pendek | traktor | (baru) | traktor mainan |
| sains-hitung-kaki-peternakan | i-merpati | merpati | (dihapus) |
| sains-hitung-kaki-peternakan | i-angsa | angsa | (dihapus) |
| sains-hitung-kaki-peternakan | i-kelinci | kelinci | (dihapus) |
| sains-hitung-kaki-peternakan | i-tikus | tikus | (dihapus) |
| sains-hitung-kaki-peternakan | i-bebek | (baru) | bebek |
| sains-hitung-kaki-peternakan | i-beo | (baru) | burung beo |
| sains-hitung-kaki-peternakan | i-sapi | (baru) | sapi |
| sains-hitung-kaki-peternakan | i-anjing | (baru) | anjing |
| sains-siang-malam-di-kebun | i-lampu | lampu teras menyala | lampion menyala |
| sains-siang-malam-di-kebun | i-piyama | pakai piyama | tidur di kasur |
| sains-siang-malam-di-kebun | i-siram | menyiram tanaman pagi | (dihapus) |
| sains-siang-malam-di-kebun | i-pelangi | (baru) | pelangi di langit |
| sains-siap-keluar-payung-topi | i-cipratan | cipratan air hujan | (dihapus) |
| siang-dan-malam | hari-pagi | pagi | pagi, ayam berkokok |
| siang-dan-malam | hari-sore | sore | (dihapus) |
| siang-dan-malam | tidur-siang-bangun | bangun tidur | (dihapus) |
| siang-dan-malam | tidur-siang-gigi | (baru) | sikat gigi |

Paket yang diubah tanpa perubahan teks ID: piring-kue-lebih-banyak (hanya EN), kue-bentuk-toko (warna), sains-kandang-dua-empat-kaki (emoji), sains-suara-siapa-di-kebun (emoji). Versi patch ke-14 paket yang diubah sudah dinaikkan.

## 3. Butuh kode

- Mode pilah `pilih` mengabaikan knob `itemCount`, karena pilihan diambil apa adanya dari soal. Akibatnya knob "2 → 3 pilihan" di sains-payung-atau-topi tidak berlaku: soal layang-layang dan angin bisa muncul di ronde awal, padahal catatan kompetensi menyimpannya untuk ronde lanjut. Hal yang sama berlaku untuk knob 2–4 di mana-bola-warna/mana-topi-warna, 3–6 di sains-mana-bagian-tubuh, dan paket sejenis.

## 4. Keputusan (tidak diubah)

- **sains-lengkapi-tubuh-boneka**: "badan" digambar 👕 (baju). Pengecohnya juga pakaian (🎩 topi, 👟 sepatu), sehingga prinsip "bagian tubuh vs bukan bagian tubuh" kabur. Tidak ada emoji badan/torso, jadi perlu aset atau shape khusus.
- **ular-panjang-pendek**: 🐊 dan 🐛 di Apple juga miring diagonal. Keduanya ada di daftar emoji yang disetujui di keputusan QC sebelumnya, jadi tidak diganti. Perlu cek visual ulang oleh owner (opsi: 🦭 / 🐈 / 🐄 yang mendatar).
- **sains-keranjang-indra-rumah**: 🧦 "kaus kaki bau", 🗑️ "tempat sampah bau", dan 🍋 "lemon asam" hanya bisa dipilah ke indra yang benar lewat labelnya. Anak PAUD tidak membaca, dan gambarnya sendiri (kaus kaki, tempat sampah) lebih dekat ke "dilihat". Ganti dengan benda yang baunya tampak dari gambar, atau pastikan label item dibacakan saat disentuh.
- 🐦‍⬛ (Emoji 15): di Android lama tampil sebagai 🐦 + ⬛. Ini tetap burung, dan soalnya tidak ambigu karena hanya ada satu burung di pilihan.

## 5. Angka

- Paket diperiksa: 62
- Temuan: 27 (18 diperbaiki, 5 ditolak, 3 keputusan, 1 butuh kode)
- Paket diubah: 14
