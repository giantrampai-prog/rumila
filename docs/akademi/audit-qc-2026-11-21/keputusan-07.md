# Keputusan 07: SAINS SD4–SD5

Sumber butir: docs/akademi/audit-qc-2026-11-21/perbaikan-07-sains-sd4-5.md bagian "Butuh keputusan owner" (8 butir). Semua butir dikerjakan.

## Keputusan yang diambil
| butir | keputusan | perubahan |
|---|---|---|
| sd5-sains-bunyi-alat-musik-kelas p-r11 botol ditiup (SAINS.SD5.BUNYI.01) | Ganti dengan versi gelas dipukul, sesuai catatan kompetensi ("hanya versi pukul") | p-r11 ID/EN: dua gelas dipukul sendok sama kuat, hampir kosong vs hampir penuh → gelas hampir kosong bunyinya "tinggi" (kunci tetap `tinggi`, pilihan tinggi/rendah/pelan). Kata "pelan" sengaja tidak dipakai di soal karena "pelan" ada di pilihan. Searah dengan p-r9 sd5-sains-tinggi-nyaring-bunyi (penuh → rendah) tanpa menyalin kalimatnya. Versi 1.0.0 → 1.0.1 |
| sd5-sains-uji-larut-laboratorium madu & pewarna cair (SAINS.SD5.LARUTAN.01) | Ganti dengan zat padat yang larut | madu → `gulapasir` "gula pasir" (bentuk circle #e0e0e0 skala 0.4 count 6, sama dengan gula di paket SAINS lain). Kaldu bubuk tidak dipakai karena tidak ada emoji tepat (🟫 sudah dipakai tanah). pewarna → "sesendok serbuk pewarna makanan", emoji 🎨 → circle #ff8a80 skala 0.5. Versi 1.0.0 → 1.0.1 |
| sd5-sains-uji-larut-laboratorium kapur tulis (suspensi) | Ganti dengan benda yang jelas tidak larut | kapur → `batubata` "pecahan batu bata" 🧱 → tidak larut (🪨 tidak dipakai karena itu emoji wadah "tidak") |
| sd5-sains-pemburu-dan-penghindar-laut samaran di dua wadah (SAINS.SD5.ADAPTASI.02) | Patuhi catatan kompetensi: buang semua ciri samaran dan lari cepat (macan tutul "lari cepat" juga dikecualikan catatan) | harimau: label → "harimau: cakar tajam untuk mencengkeram mangsa" (🐅 tetap); belalang daun → `landak` 🦔 "landak: duri tajam di punggungnya berdiri saat terancam" → mangsa. Tambahan: emoji wadah pemangsa 🦈 → 🎯 karena sama dengan kartu hiu (membocorkan jawaban). Versi 1.0.1 → 1.0.2 |
| sd4-sains-lampu-menyala, sd4-sains-rangkaian-di-rumah emoji sama menyala/padam (SAINS.SD4.LISTRIK.01) | Biarkan emoji sama (disengaja) dan catat di kompetensi. Membedakan lewat emoji/warna akan membocorkan jawaban (anak cukup melihat gambar), padahal yang dinilai membaca keadaan rangkaian | Catatan SAINS.SD4.LISTRIK.01 ditambah penjelasan bahwa emoji pasangan menyala/padam sengaja sama dan tanpa warna pembeda. Paket tidak diubah |
| sd4-sains-wujud-atau-zat-baru 🕯️ lilin leleh vs sumbu terbakar; sd4-sains-cahaya-di-kota 📺 TV nyala vs mati | Biarkan (pasangan jebakan disengaja: benda sama, keadaan berbeda) dan catat | Catatan SAINS.SD4.WUJUD-ZAT.03 dan SAINS.SD4.CAHAYA.01 ditambah penjelasan. (Catatan: `color` #424242 pada tvmati tidak tampil karena tvnyala tanpa warna; dibiarkan, tidak berbahaya.) |
| sd4-sains-rantai-makanan-susun/-perbaiki rumput laut di "laut lepas" (SAINS.SD4.RANTAI-MAKANAN.01) | Ganti judul (rantai "laut" yang lain sudah memakai fitoplankton, jadi judul diubah supaya variasinya tetap) | s-lautlepas → "Rantai makanan di laut dangkal dekat pantai" / "A shallow coastal sea food chain". Versi susun 1.2.0 → 1.2.1, perbaiki 1.1.0 → 1.1.1 |
| Emoji wadah = emoji kartu: sd4-sains-bertulang-belakang, sd4-sains-hewan-pantai-rangka, sd4-sains-sumber-atau-pantulan, sd4-sains-cahaya-di-kota | Ganti emoji wadah | rangka luar 🦀/🦞 → 🛡️; tubuh lunak 🪱/🦑 → 💧; sumber ☀️ → 🔆 (bukan 💡 karena 💡 dipakai kartu lampu jalan di sumber-atau-pantulan); pantul 🪞 → ↩️. Catatan CAHAYA.01 menyebut aturan ini. Versi: bertulang-belakang 1.0.0 → 1.0.1, hewan-pantai-rangka 1.0.0 → 1.0.1, sumber-atau-pantulan 1.0.1 → 1.0.2, cahaya-di-kota 1.0.0 → 1.0.1 |

Kurikulum diubah: content/kurikulum/SAINS-SD4.json (catatan LISTRIK.01, WUJUD-ZAT.03, CAHAYA.01). Pernyataan dan id tidak diubah.

## Kalimat suara berubah
Dibuat otomatis dengan membandingkan `locale.id` `git show HEAD:<berkas>` dan berkas kerja (11 baris). Perubahan emoji wadah tidak mengubah teks.

| paket | kunci | lama | baru |
|---|---|---|---|
| sd5-sains-bunyi-alat-musik-kelas | p-r11 | Sebuah botol berisi air hampir penuh ditiup di mulutnya. Dibanding botol yang hampir kosong, udara bergetarnya lebih pendek, jadi nadanya… | Dua gelas kaca dipukul dengan sendok yang sama kuatnya: satu hampir kosong, satu hampir penuh air. Gelas yang hampir kosong bunyinya… |
| sd5-sains-uji-larut-laboratorium | i-madu | sesendok madu | (dihapus) |
| sd5-sains-uji-larut-laboratorium | i-pewarna | beberapa tetes pewarna makanan | sesendok serbuk pewarna makanan |
| sd5-sains-uji-larut-laboratorium | i-kapur | serbuk kapur tulis | (dihapus) |
| sd5-sains-uji-larut-laboratorium | i-gulapasir | (baru) | gula pasir |
| sd5-sains-uji-larut-laboratorium | i-batubata | (baru) | pecahan batu bata |
| sd5-sains-pemburu-dan-penghindar-laut | i-harimau | harimau: loreng menyamarkannya saat mengintai | harimau: cakar tajam untuk mencengkeram mangsa |
| sd5-sains-pemburu-dan-penghindar-laut | i-belalang | belalang daun: bentuk dan warnanya seperti daun | (dihapus) |
| sd5-sains-pemburu-dan-penghindar-laut | i-landak | (baru) | landak: duri tajam di punggungnya berdiri saat terancam |
| sd4-sains-rantai-makanan-susun | s-lautlepas | Rantai makanan di laut lepas | Rantai makanan di laut dangkal dekat pantai |
| sd4-sains-rantai-makanan-perbaiki | s-lautlepas | Rantai makanan di laut lepas | Rantai makanan di laut dangkal dekat pantai |

## Butuh fitur baru
| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| (tidak ada) | | | |

## Tidak dikerjakan
| butir | alasan |
|---|---|
| (tidak ada) | Semua 8 butir dikerjakan. |

## Validasi
- `npx tsx packages/schema/src/cli.ts`: 810 paket konten valid.
- `npm run -s akademi:audit`: ERROR 0, WARNING 18 (tidak ada yang menyangkut paket sd4-sains/sd5-sains).
