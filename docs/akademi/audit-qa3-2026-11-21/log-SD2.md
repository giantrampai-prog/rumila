# QA putaran 3 — SD2 (MAT, SAINS, KODE)

Cakupan: 96 paket SD2 (MAT 42, SAINS 34, KODE 20). Semua soal pilih dicek kuncinya, semua item dicek raknya, semua hitungan dihitung ulang (tambah/kurang, kali/bagi, pembulatan, loncat, Carroll, uang, jam, pecahan). Berat batuan dicek terhadap massa jenis × volume (skala³). Hasil: tidak ada kunci salah dan tidak ada hitungan salah.
Pemeriksaan: `npm run -s akademi:validate` → 810 paket valid. `npm run -s akademi:audit` → ERROR 0, WARNING 0.

## 1. Tabel temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| tidak-sesuai | sd2-kode-tahap-game-mini | locale.id i-sketch-the-character-on-paper, i-snap-blocks-so-the-character-moves, i-slow-down-a-character-that-is-too-fast, i-list-the-characters-needed, i-speed-up-a-character-that-is-too-slow | Kata "tokoh" masih dipakai di game. Audit lalu sudah memutuskan "tokoh" diganti "karakter" untuk game | diperbaiki: "tokoh" → "karakter" (5 kalimat), 1.1.2 → 1.1.3 |
| tidak-sesuai | sd2-kode-tahap-game-buah | locale.id i-r-tokoh | Sama: "tentukan tokohnya: keranjang" | diperbaiki: "tentukan karakternya: keranjang", 1.0.1 → 1.0.2 |
| visual | sd2-kode-perangkat-masuk-tampil | item earphone (🎧) | 🎧 itu headphone, bukan earphone. Di sd4 sudah diputuskan diganti jadi "headphone" | diperbaiki: label id "headphone", en "headphones", 1.0.3 → 1.0.4 |
| visual | sd2-sains-alami-atau-buatan | item kapas (☁️) | Kapas digambar sebagai awan. Di SD1 sudah diganti jadi bulatan putih | diperbaiki: shape circle #fafafa (label tetap) |
| visual | sd2-sains-alami-atau-buatan | item kaca (🥛) | Label "kaca" tapi gambarnya segelas susu. Anak bisa mengira itu "susu" lalu menaruhnya di rak alami | diperbaiki: emoji 🪟 (jendela kaca), 1.0.1 → 1.0.2 |
| visual | sd2-sains-bahan-baru-atau-bisa-kembali | item yoghurt (🍶) | 🍶 itu botol dan cangkir sake, bukan yoghurt | diperbaiki: 🫙 (toples), 1.0.1 → 1.0.2 |
| visual | sd2-sains-mana-dulu-bahan-baru | urutan susu, langkah akhir (🍶) | Sama: yoghurt tampil sebagai botol sake | diperbaiki: 🫙, 1.0.0 → 1.0.1 |
| visual | sd2-sains-habitat-sekitar-rumah | item akar (🌾) | "akar rumput" untuk rak "dalam tanah", tapi 🌾 menggambar tangkai padi di atas tanah. Gambarnya menyesatkan | diperbaiki: shape "akar" #8d6e63 (sudah dipakai di sains-susun-tumbuhan-utuh) |
| visual | sd2-sains-habitat-sekitar-rumah | item berudu (⚫ 0.5) | Berudu digambar sebagai titik hitam | diperbaiki: shape "berudu" #3d4f3a skala 0.8, 1.0.1 → 1.0.2 |
| visual | sd2-sains-penyebab-gerak | urutan tembok, langkah akhir (🔙) | 🔙 memuat tulisan Inggris "BACK" | diperbaiki: ↩️ (seperti "bola berbalik arah" di paket kembarnya), 1.0.2 → 1.0.3 |
| visual | sd2-kode-kartu-tugas-kelas | akuarium, langkah "beri makan ikan" (🍤) | 🍤 itu udang goreng tepung, aneh sebagai pakan ikan | diperbaiki: 🦐, 1.0.3 → 1.0.4 |
| visual | sd2-mat-kembalian-loket-stasiun | barang headset (🎧) | Label "headset", sedangkan 🎧 itu headphone | ditolak: di Indonesia "headset" lazim dipakai untuk 🎧. Ini barang dagangan, tidak memengaruhi jawaban. EN sudah "headphones" |
| visual | sd2-sains-sumber-cahaya-rumah | lampu menyala vs lampu mati (💡) | Dikira tampil sama karena warna emoji diabaikan | ditolak: 💡 juga dipakai di rak dengan warna lain, jadi lampu mati tetap digambar dengan latar abu-abu (aturan emojiBedaWarna). Labelnya juga beda |
| visual | sd2-sains-habitat-hewan-dan-tumbuhan | rubah kutub 🦊 / serigala kutub 🐺 #fafafa | Warna putih tidak tergambar karena emojinya cuma satu. Rubah tampil oranye | ditolak: tidak ada emoji rubah atau serigala putih. Labelnya jelas. Item ini sudah pernah diganti di audit lalu (id penguin/anjinglaut) |
| visual | sd2-sains-pola-pengamatan-kebun | urutan baju, roti, gelas, apel, panci | Keempat kartu emojinya sama, urutan hanya terbaca dari teks. 🥛 untuk "air" | ditolak: urutan memang sengaja berbasis catatan tertulis (audit lalu sudah merapikan labelnya). Anak SD2 bisa membaca, dan kartu dibacakan |
| visual | sd2-sains-hewan-tumbuh-besar (+perbaiki) | bebek: 🦆 dewasa untuk "anak bebek kuning" | Gambar tidak menunjukkan anak bebek | ditolak: tidak ada emoji anak bebek, dan 🐤/🐥 sudah dipakai di urutan ayam. Ciri tahap ada di label (sudah diputuskan di audit lalu) |
| visual | sd2-sains-sifat-yang-dibutuhkan | kain pel (🧹) | 🧹 itu sapu, bukan kain pel | ditolak: tidak ada emoji kain pel. Label menentukan, dan raknya tetap "menyerap air" |
| visual | sd2-kode-kartu-langkah | botol minum (🍶) | 🍶 itu botol sake | ditolak: tidak ada emoji botol minum yang lebih baik. Urutan dinilai dari teks kartu, dan ikonnya tidak memengaruhi urutan |
| visual | sd2-mat-cari-segi-banyak-lab / sd2-mat-pilah-segi-banyak | ⬟ ⬠ ⬢ ⬡ ⬣ | Bergantung pada font perangkat | ditolak: sudah diputuskan di sd3 (gambar menentukan). Tidak ada bukti baru |
| ambigu | sd2-mat-kardus-puluhan-gudang | instruksi "Satu kardus berisi sepuluh barang" | Tema kardus tidak tampil di kartu (emoji 📦 dibuang di audit lalu) | ditolak: instruksi tetap benar sebagai gambaran puluhan, dan tidak membuat jawaban ganda |

Dicek dan lolos (contoh): kunci 14 soal kardus puluhan (termasuk 2 puluhan + 15 = 35 dan 5 puluhan + 14 = 64), 14 soal mesin hitung, 30 kartu rak hasil, 14 soal pembulatan + 42 kartu pembulatan (aturan 5 ke atas), katak loncat 5 dari 3 (tidak ada jebakan ≡ 3 mod 5), keluarga bilangan (soal kurang dengan bilangan bersama, mis. 13 − 5 / 13 − 6, masuk rak yang benar), kolom larik sesuai "a baris × b", 14 soal jam, 30 kartu menit, Carroll (49/50), huruf simetri (kunci 15 soal), laci uang cukup untuk semua harga, kaki hewan, penutup tubuh, sumber cahaya, gaya, matahari/bayangan (pagi ke barat, sore ke timur), timbangan batuan konsisten dengan massa jenis, Carroll KODE, masukan/keluaran, tahap game.

## 2. Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd2-kode-tahap-game-mini | i-sketch-the-character-on-paper | gambar sketsa tokoh di kertas | gambar sketsa karakter di kertas |
| sd2-kode-tahap-game-mini | i-snap-blocks-so-the-character-moves | susun blok supaya tokoh bergerak | susun blok supaya karakter bergerak |
| sd2-kode-tahap-game-mini | i-slow-down-a-character-that-is-too-fast | pelankan tokoh yang terlalu cepat | pelankan karakter yang terlalu cepat |
| sd2-kode-tahap-game-mini | i-list-the-characters-needed | tulis daftar tokoh yang dibutuhkan | tulis daftar karakter yang dibutuhkan |
| sd2-kode-tahap-game-mini | i-speed-up-a-character-that-is-too-slow | percepat tokoh yang terlalu lambat | percepat karakter yang terlalu lambat |
| sd2-kode-tahap-game-buah | i-r-tokoh | tentukan tokohnya: keranjang | tentukan karakternya: keranjang |
| sd2-kode-perangkat-masuk-tampil | i-earphone | earphone | headphone |

(Perubahan lain hanya mengganti emoji atau bentuk, tanpa mengubah teks.)

## 3. Butuh kode

- (opsional) Field `latar` sudah ada di `VisualSpec` (benda.tsx), tetapi tidak ada di skema paket (`packages/schema/src/paket.ts`). Akibatnya paket tidak bisa memaksa warna latar untuk emoji yang hanya muncul dengan satu warna (mis. 🦊 "rubah kutub" putih, 🔩 "baut berkarat" cokelat). Kalau `latar` ditambahkan ke skema, kasus seperti ini bisa dibereskan lewat data.

## 4. Keputusan

Tidak ada.

## 5. Angka

- Paket diperiksa: 96 (MAT 42, SAINS 34, KODE 20)
- Temuan: 20
- Diperbaiki: 11 temuan di 9 paket (MAT 0, SAINS 5, KODE 4)
- Ditolak: 9
