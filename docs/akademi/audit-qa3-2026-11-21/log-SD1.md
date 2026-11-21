# QA putaran 3 — SD1 (MAT, SAINS, KODE)

Cakupan: 84 paket SD1 (MAT 34, SAINS 30, KODE 20) diperiksa dari dump lalu dicek ke JSON asli. 12 paket diubah, versi patch dinaikkan. Kurikulum dan kode tidak disentuh.
Pemeriksaan: `npm run -s akademi:validate` → 810 paket valid; `npm run -s akademi:audit` → ERROR 0, WARNING 0.

## 1. Tabel temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| tidak-sesuai / visual | sd1-mat-jam-setengah-pagi | i-jam-pukul-6 … i-jam-10t30 (10 kartu jam jarum) | Label di bawah kartu jam jarum menulis waktunya ("jam pukul 6" → rak "pukul 6", "jam 6.30"). Label ini membocorkan jawaban, jadi anak tidak perlu membaca jarum jam padahal itu inti kompetensi WAKTU.01. Kartu digital sudah menguji pengubahan 6.30 → setengah 7. | diperbaiki: label jam jarum jadi "jam" / "clock". Instruksi ID ditambah "Lihat kedua jarumnya." supaya sejalan dengan EN ("Look at both hands") |
| tidak-sesuai / visual | sd1-mat-jam-setengah-siang | i-jam-pukul-1 … i-jam-5t30 (10 kartu) | Sama: label "jam pukul 3" / "jam 3.30" membocorkan jawaban. | diperbaiki: sama seperti paket pagi |
| ambigu | sd1-mat-urut-ringan-berat | s-batu-besar (urutan berat-7: pensil → batu → sepeda → gajah) | "batu" dengan 🪨 (bongkahan) bisa lebih berat daripada sepeda (±12 kg), jadi urutan batu–sepeda tidak tunggal. | diperbaiki: "batu sekepal tangan" / "fist-sized stone" |
| visual | sd1-sains-rak-tujuh-bahan-rumah | item sendokkayu | "sendok kayu" memakai 🥄, yang tampil sebagai sendok logam perak. `color` #a1887f tidak digambar karena 🥄 hanya muncul dengan satu warna, jadi gambarnya mengarah ke rak logam. | diperbaiki: 🥢 "sumpit kayu" / "wooden chopsticks", warna dihapus |
| visual | sd1-sains-makan-hewan-peternakan | item tulip (i-tulip) | Label "bunga melati" (putih), tetapi 🌼 tampil sebagai bunga kuning. | diperbaiki: label "bunga kuning" / "yellow flower" |
| visual | sd1-sains-benda-atau-bahan-sekolah | item cobek | "cobek" bergambar 🥣 (mangkuk sereal dengan sendok), tidak terlihat seperti cobek batu. | diperbaiki: 🗿 "patung" (benda dari bahan batu, sejalan dengan catatan kompetensi), warna dihapus |
| tidak-sesuai (tema) | sd1-sains-gerak-taman-kota | item keretaluncur, bin luncur | "kereta luncur menuruni bukit salju" (🛷) tidak ada di taman kota Indonesia dan asing bagi anak. Rak meluncur juga berikon 🛷. | diperbaiki: 📦 "anak duduk di kardus, meluncur di rumput miring". Ikon rak diganti 🛝 |
| ambigu | sd1-sains-bunyi-dekat-jauh-jalan | pesawat-2 / pesawat-3 | "parkiran bandara" vs "jalan dekat bandara": jalan dekat bandara bisa lebih dekat ke landasan daripada parkiran, jadi urutannya tidak pasti. | diperbaiki: pesawat-3 "anak di pasar di tengah kota" |
| visual | sd1-sains-ukur-kubus-temuan-kebun | item daunpisang | "sobekan daun pisang" bergambar 🌱 (kecambah), padahal paket jengkal kembarannya memakai 🍃. | diperbaiki: emoji 🍃 (teks tetap) |
| tidak-sesuai (judul) | sd1-sains-ukur-jengkal-temuan-kebun | judul | "Ukur Batang dan Daun dengan Jengkal", padahal sebagian besar temuannya sayur dan buah (timun, wortel, terong, ubi, jagung, nanas). | diperbaiki: "Ukur Temuan Kebun dengan Jengkal" / "Measure Garden Finds in Spans" |
| ambigu | sd1-kode-sambungan-perangkat | instruksi | "Perangkat ini …" padahal satu ronde berisi 6–10 kartu, jadi rujukannya kabur. | diperbaiki: "Tiap perangkat tersambung dengan kabel atau tanpa kabel? Taruh di kotak yang cocok." |
| ambigu | sd1-kode-tukar-langkah-taman | urutan kolase (kolase-1, kolase-2) | "susun potongannya" ↔ "oles lem di belakangnya" sama-sama masuk akal bila ditukar (mode perbaiki menukar pasangan berdampingan). | diperbaiki: gambar bentuk di kertas warna (✏️) → gunting mengikuti gambarnya (✂️) → oles lem → tempel → tunggu kering → pajang |
| ambigu | sd1-kode-algoritma-di-kota | urutan sepeda: pakai helm ↔ duduk di sadel | Kedua langkah tampak bisa ditukar. | ditolak: helm sebelum naik adalah aturan keselamatan baku yang diajarkan, sejalan dengan putusan lama "tutup keran/keringkan" |
| ambigu | sd1-kode-tukar-langkah-taman | urutan perahu: pakai pelampung ↔ naik ke perahu | Kedua langkah tampak bisa ditukar. | ditolak: alasan keselamatan sama (pelampung dipakai sebelum naik) |
| tidak-sesuai (tema) | sd1-mat-dobel-etalase-kue | judul | Judul "Kue Dobel di Etalase", tetapi kartunya hanya angka (emoji 🧁 dibuang di audit lalu karena membuat pilihan kembar). | ditolak: judul hanya bingkai cerita; tidak menyesatkan soal; mengembalikan gambar kue mengulang masalah yang sudah diperbaiki |
| ambigu (istilah) | sd1-mat-panen-sisa-kebun | instruksi "bedeng" | Istilah kebun yang mungkin asing. | ditolak: dipakai juga di paket PAUD (bedeng-sayur-selang-seling) dan dijelaskan konteksnya ("ditutup daun") |
| visual | sd1-sains-menyerap-air-atau-tidak | jashujan 🧥, sepatubot 🥾 | Mantel 🧥 dan sepatu gunung 🥾 tidak tampak dari plastik/karet. | ditolak: tidak ada emoji jas hujan/sepatu bot karet. Labelnya tertulis jelas di bawah gambar |
| visual | sd1-sains-berbunyi-atau-diam(-jalan), sd1-sains-cepat-atau-lambat-hangat | burung kicau/tidur 🐦, radio, es batu 🧊, dst. | Pasangan kartu bergambar sama, tetapi jawabannya berbeda. | ditolak: disengaja oleh catatan kompetensi (keadaan dibedakan lewat label, mencegah hafalan). Label tampil di bawah gambar, dan audit `item-sama-beda-jawaban` lolos |

## 2. Kalimat suara berubah (locale.id)

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd1-mat-jam-setengah-pagi | i-jam-pukul-6 | jam pukul 6 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-6t30 | jam 6.30 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-pukul-7 | jam pukul 7 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-7t30 | jam 7.30 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-pukul-8 | jam pukul 8 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-8t30 | jam 8.30 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-pukul-9 | jam pukul 9 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-9t30 | jam 9.30 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-pukul-10 | jam pukul 10 | jam |
| sd1-mat-jam-setengah-pagi | i-jam-10t30 | jam 10.30 | jam |
| sd1-mat-jam-setengah-pagi | instruksi | Setengah 7 artinya setengah jalan menuju pukul 7, yaitu 6.30. Taruh tiap jam di raknya. | Lihat kedua jarumnya. Setengah 7 artinya setengah jalan menuju pukul 7, yaitu 6.30. Taruh tiap jam di raknya. |
| sd1-mat-jam-setengah-siang | i-jam-pukul-1 | jam pukul 1 | jam |
| sd1-mat-jam-setengah-siang | i-jam-1t30 | jam 1.30 | jam |
| sd1-mat-jam-setengah-siang | i-jam-pukul-2 | jam pukul 2 | jam |
| sd1-mat-jam-setengah-siang | i-jam-2t30 | jam 2.30 | jam |
| sd1-mat-jam-setengah-siang | i-jam-pukul-3 | jam pukul 3 | jam |
| sd1-mat-jam-setengah-siang | i-jam-3t30 | jam 3.30 | jam |
| sd1-mat-jam-setengah-siang | i-jam-pukul-4 | jam pukul 4 | jam |
| sd1-mat-jam-setengah-siang | i-jam-4t30 | jam 4.30 | jam |
| sd1-mat-jam-setengah-siang | i-jam-pukul-5 | jam pukul 5 | jam |
| sd1-mat-jam-setengah-siang | i-jam-5t30 | jam 5.30 | jam |
| sd1-mat-jam-setengah-siang | instruksi | Setengah 4 artinya setengah jalan menuju pukul 4, yaitu 3.30. Taruh tiap jam di raknya. | Lihat kedua jarumnya. Setengah 4 artinya setengah jalan menuju pukul 4, yaitu 3.30. Taruh tiap jam di raknya. |
| sd1-mat-urut-ringan-berat | s-batu-besar | batu | batu sekepal tangan |
| sd1-sains-rak-tujuh-bahan-rumah | i-sendokkayu | sendok kayu | sumpit kayu |
| sd1-sains-makan-hewan-peternakan | i-tulip | bunga melati | bunga kuning |
| sd1-sains-benda-atau-bahan-sekolah | i-cobek | cobek | patung |
| sd1-sains-gerak-taman-kota | i-keretaluncur | kereta luncur menuruni bukit salju | anak duduk di kardus, meluncur di rumput miring |
| sd1-sains-bunyi-dekat-jauh-jalan | pesawat-3 | anak di jalan dekat bandara | anak di pasar di tengah kota |
| sd1-sains-ukur-jengkal-temuan-kebun | judul | Ukur Batang dan Daun dengan Jengkal | Ukur Temuan Kebun dengan Jengkal |
| sd1-kode-sambungan-perangkat | instruksi | Perangkat ini tersambung dengan kabel atau tanpa kabel? Taruh di kotak yang cocok. | Tiap perangkat tersambung dengan kabel atau tanpa kabel? Taruh di kotak yang cocok. |
| sd1-kode-tukar-langkah-taman | kolase-1 | gunting kertas warna | gambar bentuk di kertas warna |
| sd1-kode-tukar-langkah-taman | kolase-2 | susun potongannya | gunting mengikuti gambarnya |

Jumlah: 32 kalimat di 12 paket. Teks baru "jam" dipakai 20 kunci, jadi cukup satu rekaman.

## 3. Butuh kode

- (usul audit, tidak wajib) `color` pada item ber-emoji tidak digambar bila emoji itu hanya muncul dengan satu warna dalam paket. Akibatnya ada paket yang mengandalkan warna untuk menyampaikan bahan, misalnya 🥄 #a1887f "sendok kayu" dan 🥾 #ffd600 "sepatu bot karet". Aturan audit WARNING "warna-emoji-tak-tampil" bisa menangkap kasus seperti ini lebih awal.

## 4. Keputusan

- sd1-mat-gabung-harta-pantai: barang 🐢 "anak penyu" ditumpuk sebagai "harta pantai". Penyu satwa dilindungi, jadi mengumpulkannya kurang pantas dijadikan contoh. Usulan: ganti dengan 🪨 "batu pantai" atau 🦪 "tiram". Tidak diubah.
- sd1-mat-jam-setengah-pagi/-siang: setelah label jam jarum dinetralkan, anak hanya membaca jarum emoji 🕕/🕡 dkk. Perlu dicek di perangkat bahwa jarum terbaca di ukuran kartu, terutama di Android. Belum dicek di peramban.

## 5. Angka

| | jumlah |
|---|---|
| paket diperiksa | 84 (MAT 34, SAINS 30, KODE 20) |
| temuan | 18 |
| diperbaiki | 12 (12 paket berubah) |
| ditolak | 6 |
| keputusan owner | 2 |
| kalimat locale.id berubah | 32 |
