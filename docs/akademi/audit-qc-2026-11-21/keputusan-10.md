# Keputusan QC 10: KODE SD3–SD5 (putaran 2)

Validasi akhir: `npx tsx packages/schema/src/cli.ts` gives 810 paket valid and 0 kurikulum errors. `npm run -s akademi:audit` gives ERROR 0, WARNING 0 (whole repo at the time of the run).
Peta navigasi baru diverifikasi dengan pemecah sendiri (scratchpad/k10/verify.ts, v3.ts), tidak hanya dengan audit:
- paket program: program terpendek = rak (tidak ada program ≤ rak−1)
- paket semuaGrid: ada program bersama ≤ 11 keping dengan kalau, dan tidak ada tanpa kalau
- paket debug: tidak ada perbaikan dengan ubahan lebih sedikit dari `fixes`, perbaikan `fixes` ubahan ada. SD5: program awal lolos di ≥1 jalur dan gagal di jalur lain.
Tidak ada peta kembar terhadap semua paket navigasi lain.

## Keputusan yang diambil

| butir | keputusan | perubahan |
|---|---|---|
| Label "menampilkan" vs "mengeluarkan" (SD3 PERANGKAT.01) | Pakai "mengeluarkan" | sd3-kode-masuk-simpan-keluar, sd3-kode-tiga-tugas-perangkat: `bin-keluar` diganti menjadi "mengeluarkan" (EN "giving out"); instruksi ID/EN dan keterangan knob disesuaikan. KODE-SD3 PERANGKAT.01: statement ID/EN ("…dan untuk mengeluarkan data") dan catatan. |
| Kompetensi kembar SD3/SD4 PERANGKAT.01 | SD4 dinaikkan ke "masukan saja / keluaran saja / masukan sekaligus keluaran" | KODE-SD4 PERANGKAT.01: statement baru, prereq KODE.SD3.PERANGKAT.01, catatan baru. sd4-kode-perangkat-masuk-keluar dan sd4-kode-perangkat-kelas ditulis ulang. Bin masukan/keluaran/keduanya. Kotak penyimpanan dihapus di SD4 karena sudah dipelajari di SD3. Item jebakan: layar sentuh, headset bermikrofon, printer-scanner, papan tulis interaktif, speaker pintar, stik game bergetar, jam tangan pintar. binCount default 3. |
| Kompetensi kembar SD3 JARINGAN.02 ↔ SD5 INTERNET.01 | SD5 dinaikkan ke "butuh internet / cukup jaringan lokal (Wi-Fi rumah, Bluetooth) / tanpa jaringan" | KODE-SD5 INTERNET.01: statement baru, prereq ditambah KODE.SD3.JARINGAN.02, catatan baru. sd5-kode-internet-putus dan sd5-kode-internet-putus-rumah ditulis ulang. Skenario: internet putus tetapi router Wi-Fi masih menyala. 3 bin × 6 item. binCount 2→3, itemCount 6→9. |
| Urutan kesulitan navigasi terbalik | SD3 tetap. SD4 dan SD5 dipersulit, karena SD3 sudah satu langkah di atas SD2. Kalau SD3 disederhanakan, SD3 jadi di bawah SD2. | **SD4 ULANGI.01**: empat ruas, empat ulangi + tiga belokan, rak 11. Sebelumnya dua ruas, rak 5, kembar dengan SD1. Paket: sd4-kode-dua-ulangi-belok, sd4-kode-ulangi-jalan-kota, masing-masing 18 peta. **SD4 ULANGI.02**: tiga ruas dengan pola berbeda ([maju], [lompat], [maju, lompat], [lompat, maju]), rak 9–11. Sebelumnya satu pola, kembar dengan SD2. Paket: sd4-kode-ulangi-batu-sungai, sd4-kode-ulangi-maju-lompat, masing-masing 18 peta. **SD4 DEBUG.01**: dua bug di program empat ruas berisi ulangi + kalau. Sebelumnya satu bug tanpa kalau. Paket: sd4-kode-perbaiki-ulangi, sd4-kode-satu-bug-batu-pantai, masing-masing 18 peta. **SD4 DEBUG.02**: tiga bug di program empat ruas ulangi + kalau. Paket: sd4-kode-dua-bug-ulangi, sd4-kode-dua-bug-batu-kutub, masing-masing 16 peta. **SD5 KONDISI.01**: kalau di dalam empat ulangi, tiga belokan, tiga peta, rak 11. Sebelumnya satu belokan, rak 5. Paket: sd5-kode-kalau-belok-tiga-jalur, sd5-kode-kalau-tiga-lorong-gudang, masing-masing 14 grup × 3. **SD5 DEBUG.01**: satu bug di program empat ruas, tiga peta; program awal lolos di satu jalur dan gagal di jalur lain. Paket: sd5-kode-perbaiki-kalau, sd5-kode-perbaiki-kalau-laut, masing-masing 14 grup × 3. Semua peta adalah koridor berdinding. Commands, judul, dan instruksi ID/EN disesuaikan. Knob filter (distance/rocks) diganti knob dokumentasi `panjang`/`batu`, sehingga kumpulan soal tidak menyempit. Kurikulum SD4 ULANGI.01/.02, DEBUG.01/.02 dan SD5 KONDISI.01/DEBUG.01: statement, prereq (merujuk SD3), dan catatan diperbarui. Tangga baru: KONDISI 1 → 2 → 3 belokan (SD2/SD3/SD5). DEBUG: SD3 2 bug/3 ruas → SD4 2 bug/4 ruas → 3 bug/4 ruas → SD5 1 bug/4 ruas/3 peta → SD6 2 bug/3 peta. ULANGI: SD3 2 pola → SD4 4 ulangi / 3 pola. |
| Paket IPO sd4-kode-masukan-proses-keluaran | Tulis ulang dengan gaya `x = minta('…')` | Sepuluh urutan, masing-masing 4 baris, ditulis ulang. `tampilkan` hanya ada di baris terakhir sebagai keluaran. Tiap baris memakai variabel baris sebelumnya. Judul s5/s6/s7/s8/s9/s10 berganti karena programnya berubah. Instruksi ID/EN disesuaikan. Catatan KODE.SD4.IPO.01 diperbarui. |
| `umur = 2026 - tahun` (sd4-kode-ipo-pasar s2) | Ganti urutan, tanpa tahun yang ditulis mati | s2 → "Umur dalam jam": `umur = minta('Berapa tahun umurmu?')` → `hari = umur * 365` → `jam = hari * 24` → `tampilkan jam` |
| Emoji penyimpanan | Bentuk + warna untuk benda yang tidak punya emoji tepat | sd3-kode-masuk-simpan-keluar: flashdisk 💾 → shape rect #2563eb; kartu memori 🗂️ → shape square #f59e0b. hard disk tetap 💽. Di SD4, penyimpanan dihapus (butir kembar di atas), jadi 🧱/🎴/🗄️/💾 ikut hilang. |
| Kaset video / disket (sd3-kode-tiga-tugas-perangkat) | Ganti dengan "SSD eksternal" dan "kartu memori kamera" | Item `kaset` → `ssd` (shape rect #475569), `disket` → `kartu-kamera` (shape square #f59e0b). Kunci locale lama dihapus. |
| Benar/True | Kode bergaya program memakai True/False | sd5-kode-cabang-kalau-taman q4: `cerah = Salah` → `cerah = False`. sd5-kode-lacak-kalau q7: `hujan = Benar` → `hujan = True`. Teks biasa (instruksi, bin "benar/salah") tetap memakai "benar/salah". Di sd5-kode-ulangi-dan-kalau, 'benar' adalah string berkutip, bukan boolean. |
| Label INTERNET.02 + ATM | Label "terhubung ke internet". ATM diganti. | sd5-kode-perangkat-terhubung dan sd5-kode-terhubung-kota: `bin-kirim` diganti menjadi "terhubung ke internet" (EN "connected to the internet"), dan instruksi menjadi "…terhubung ke internet untuk mengirim atau menerima data…". i4 ATM → "mesin parkir yang mengirim data ke aplikasi". Di terhubung-kota, i6 "mesin pembayaran kartu di toko" (masalahnya sama: jaringan bank) → "kamera lalu lintas yang siarannya bisa dilihat di internet". KODE.SD5.INTERNET.02: statement dan catatan. |
| Istilah game/email | "game" dan "email" | sd4-kode-perjalanan-pesan: s9 dan s9-3 "gim" → "game". sd3-kode-perjalanan-pesan: t-surel, surel-1/3/4/5/6 "surel" → "email". sd3-kode-sunting-algoritma: t-surel, surel-2 → "email". "tetikus"/"papan ketik" di SD4 hilang karena paketnya ditulis ulang. Id/labelKey `surel-*` tetap. |
| Pasangan bebas tukar (sd3-kode-sunting-kartu-percobaan) | Semua pasangan i↔i+1 dan i↔i+2 diperiksa. Langkah yang bisa dibalik ditulis ulang sampai urutannya tunggal. | gunung: ditulis ulang 8 langkah. Botol kosong → soda → cuka "ke atas soda kue" → busa → amati → tulis hasil → bacakan catatan → tepuk tangan. Ini juga menutup soda↔cuka dan "catat selagi busa ada" ↔ "amati sampai berhenti". unggah-1 → "buka kunci layar tablet" (sebelumnya "selesaikan gambar" ↔ "buka aplikasi"). nasi-goreng-4/5/6: "ke tumisan bawang", "ke atas nasi", "aduk di atas api…" (kecap↔nasi, aduk↔matikan kompor). lari-4 → "petugas memeriksa nomor di bajumu". ban-3 → "celupkan ban dalam ke air untuk mencari lubang". cerita-3/4/5: judul dan isi digabung, "periksa ejaan", lalu "perbaiki kata yang salah" (sebelumnya cerita-3↔4). sop-1..6: "isi panci" → "didihkan" → "ke air mendidih" → "rebus sampai empuk" → "garam ke sayur yang sudah empuk" → "aduk selagi kompor menyala" (sebelumnya sop-4↔5, sop-6↔7, potong↔cuci). |
| Pasangan bebas tukar (sd3-kode-sunting-algoritma) | Sama | pohon-5 → "siram tanah timbunannya". video-tugas-7 → "simpan video yang sudah dipotong" (sebelumnya simpan↔potong). Urutan lain diperiksa dan sudah tunggal. |

## Kalimat suara berubah

Semua nilai locale.id yang berubah, ditambah, atau dihapus dibandingkan `git show HEAD`. Tabel dibuat otomatis. Teks statement kurikulum juga berubah: KODE.SD3.PERANGKAT.01, KODE.SD4.PERANGKAT.01, ULANGI.01, ULANGI.02, DEBUG.01, DEBUG.02, KODE.SD5.INTERNET.01, INTERNET.02, KONDISI.01, DEBUG.01.

| paket | kunci | lama | baru |
|---|---|---|---|
| sd4-kode-dua-bug-batu-kutub | instruksi | Robot tersesat di padang es: jalankan programnya, lihat di mana ia menyimpang, perbaiki, jalankan lagi, lalu temukan kesalahan kedua. Ubah tepat dua keping. | Robot tersesat di padang es: jalankan programnya, lihat di mana ia menyimpang, perbaiki, jalankan lagi, lalu cari kesalahan berikutnya. Ubah tepat tiga keping. |
| sd4-kode-dua-bug-batu-kutub | judul | Dua Keping Salah di Es | Tiga Keping Salah di Es |
| sd4-kode-dua-bug-ulangi | instruksi | Ada dua bagian yang salah di program ini: jalankan, amati di mana robot menyimpang, lalu perbaiki tepat dua bagian. | Ada tiga bagian yang salah di program empat ruas ini: jalankan, amati di mana robot menyimpang, perbaiki, lalu ulangi sampai tepat tiga bagian diperbaiki. |
| sd4-kode-dua-bug-ulangi | judul | Dua Kesalahan Tersembunyi | Tiga Kesalahan Tersembunyi |
| sd4-kode-dua-ulangi-belok | instruksi | Rak hanya muat lima keping: pakai dua blok ulangi dan satu belokan supaya robot sampai bintang. | Jalan taman punya empat ruas dan rak hanya muat sebelas keping: pakai empat blok ulangi dan tiga belokan supaya robot sampai bintang. |
| sd4-kode-dua-ulangi-belok | judul | Rak Lima Keping: Dua Ulangi | Rak Sebelas Keping: Empat Ulangi |
| sd4-kode-perbaiki-ulangi | instruksi | Program robot hampir benar: cari satu bagian yang salah, angka ulangan, isi ulangi, atau belokan, lalu ganti satu itu saja. | Program empat ruas ini punya dua bagian yang salah: angka ulangan, isi ulangi, atau belokan. Cari keduanya lalu ganti dua bagian itu saja. |
| sd4-kode-perbaiki-ulangi | judul | Ulangi yang Keliru | Dua Ulangi yang Keliru |
| sd4-kode-satu-bug-batu-pantai | instruksi | Robot belum sampai ke bintang di pantai berbatu: cari satu keping yang salah, angka ulangan, isi ulangi, atau belokan, lalu ganti keping itu saja. | Robot belum sampai ke bintang di pantai berbatu: cari dua keping yang salah, angka ulangan, isi ulangi, atau belokan, lalu ganti dua keping itu saja. |
| sd4-kode-satu-bug-batu-pantai | judul | Satu Keping Salah di Pantai | Dua Keping Salah di Pantai |
| sd4-kode-ulangi-batu-sungai | instruksi | Lihat jalur batu di sungai: dua perintah apa yang terus berulang? Masukkan keduanya ke satu blok ulangi. | Jalur batu di sungai punya tiga ruas dengan pola berbeda. Temukan pola tiap ruas, tulis tiap pola dengan satu blok ulangi, dan belok di antaranya. |
| sd4-kode-ulangi-batu-sungai | judul | Batu Pijakan di Sungai | Tiga Pola Batu di Sungai |
| sd4-kode-ulangi-jalan-kota | instruksi | Antar robot lewat jalan di antara gedung: rak hanya lima keping, jadi pakai dua blok ulangi dan satu belokan. | Antar robot lewat jalan di antara gedung: jalannya berbelok tiga kali dan rak hanya sebelas keping, jadi pakai empat blok ulangi. |
| sd4-kode-ulangi-jalan-kota | judul | Jalan Kota Berbelok | Jalan Kota Berbelok Tiga Kali |
| sd4-kode-ulangi-maju-lompat | instruksi | Batu muncul dengan jarak yang sama: temukan dua perintah yang berulang, lalu masukkan ke satu blok ulangi. | Di tiap ruas, batu muncul dengan pola yang berbeda: temukan perintah yang berulang di tiap ruas, masukkan ke blok ulangi, lalu belok ke ruas berikutnya. |
| sd4-kode-ulangi-maju-lompat | judul | Batu Berjarak Sama | Pola Berganti di Tiap Ruas |
| sd5-kode-kalau-belok-tiga-jalur | instruksi | Letak batu berbeda di tiap jalur: susun satu program lima keping dengan ulangi dan kalau yang lolos di ketiganya. | Letak batu berbeda di tiap jalur, dan tiap jalur berbelok tiga kali. Susun satu program sebelas keping: empat ulangi berisi kalau dan tiga belokan, yang lolos di ketiganya. |
| sd5-kode-kalau-belok-tiga-jalur | judul | Satu Program, Tiga Jalur Berbelok | Satu Program, Tiga Jalur Empat Ruas |
| sd5-kode-kalau-tiga-lorong-gudang | instruksi | Batu di tiga lorong gudang letaknya berbeda: hitung ulangan sebelum belok, taruh kalau di dalam ulangi, dan pakai paling banyak lima keping supaya lolos di ketiganya. | Batu di tiga lorong gudang letaknya berbeda dan lorongnya berbelok tiga kali: hitung ulangan tiap ruas, taruh kalau di dalam ulangi, dan pakai paling banyak sebelas keping supaya lolos di ketiganya. |
| sd3-kode-masuk-simpan-keluar | bin-keluar | menampilkan | mengeluarkan |
| sd3-kode-masuk-simpan-keluar | instruksi | Perangkat ini untuk memasukkan, menyimpan, atau menampilkan data? Taruh di kotaknya. | Perangkat ini untuk memasukkan, menyimpan, atau mengeluarkan data? Taruh di kotaknya. |
| sd3-kode-tiga-tugas-perangkat | bin-keluar | menampilkan | mengeluarkan |
| sd3-kode-tiga-tugas-perangkat | i-disket | disket | (dihapus) |
| sd3-kode-tiga-tugas-perangkat | i-kaset | kaset video | (dihapus) |
| sd3-kode-tiga-tugas-perangkat | instruksi | Perangkat ini untuk memasukkan data, menyimpan data, atau menampilkan data? Taruh di kotaknya. | Perangkat ini untuk memasukkan data, menyimpan data, atau mengeluarkan data? Taruh di kotaknya. |
| sd3-kode-tiga-tugas-perangkat | i-kartu-kamera | (baru) | kartu memori kamera |
| sd3-kode-tiga-tugas-perangkat | i-ssd | (baru) | SSD eksternal |
| sd4-kode-perangkat-kelas | bin-keluaran | keluaran | keluaran saja |
| sd4-kode-perangkat-kelas | bin-masukan | masukan | masukan saja |
| sd4-kode-perangkat-kelas | bin-simpan | penyimpanan | (dihapus) |
| sd4-kode-perangkat-kelas | i1 | 👆 sensor sidik jari | sensor sidik jari untuk absen |
| sd4-kode-perangkat-kelas | i10 | 🖨️ printer 3D | pengeras suara aula |
| sd4-kode-perangkat-kelas | i11 | 📢 pengeras suara aula | televisi kelas |
| sd4-kode-perangkat-kelas | i12 | 📺 televisi kelas | getar HP saat ada pesan |
| sd4-kode-perangkat-kelas | i13 | 📳 getar HP saat ada pesan | papan tulis interaktif yang bisa disentuh |
| sd4-kode-perangkat-kelas | i14 | 💿 CD/DVD | tablet kelas berlayar sentuh |
| sd4-kode-perangkat-kelas | i15 | 🗄️ SSD | printer-scanner di ruang guru |
| sd4-kode-perangkat-kelas | i16 | 💽 hard disk eksternal | headset bermikrofon untuk kelas daring |
| sd4-kode-perangkat-kelas | i17 | 🎴 kartu microSD | speaker pintar yang menjawab pertanyaan |
| sd4-kode-perangkat-kelas | i18 | 🗃️ server penyimpanan sekolah | (dihapus) |
| sd4-kode-perangkat-kelas | i2 | 🖊️ pena digital | pena digital |
| sd4-kode-perangkat-kelas | i3 | 📄 pemindai dokumen (scanner) | pemindai dokumen (scanner) |
| sd4-kode-perangkat-kelas | i4 | 🚶 sensor gerak | sensor gerak di pintu |
| sd4-kode-perangkat-kelas | i5 | 🔲 touchpad laptop | touchpad laptop |
| sd4-kode-perangkat-kelas | i6 | 🎛️ panel tombol mesin | kamera dokumen |
| sd4-kode-perangkat-kelas | i7 | 📸 kamera dokumen | bel listrik sekolah |
| sd4-kode-perangkat-kelas | i8 | 🔔 bel listrik sekolah | papan tulisan LED berjalan |
| sd4-kode-perangkat-kelas | i9 | 🪧 papan tulisan LED berjalan | printer 3D |
| sd4-kode-perangkat-kelas | instruksi | Di kelas komputer: seret tiap alat ke kelompoknya: memasukkan data ke komputer, mengeluarkan hasil, atau menyimpan data. | Di kelas komputer: seret tiap alat ke kelompoknya: masukan saja, keluaran saja, atau masukan sekaligus keluaran. |
| sd4-kode-perangkat-kelas | bin-keduanya | (baru) | masukan dan keluaran |
| sd4-kode-perangkat-masuk-keluar | bin-keluaran | keluaran | keluaran saja |
| sd4-kode-perangkat-masuk-keluar | bin-masukan | masukan | masukan saja |
| sd4-kode-perangkat-masuk-keluar | bin-simpan | penyimpanan | (dihapus) |
| sd4-kode-perangkat-masuk-keluar | i1 | ⌨️ papan ketik | keyboard |
| sd4-kode-perangkat-masuk-keluar | i10 | 🖥️ monitor | headphone tanpa mikrofon |
| sd4-kode-perangkat-masuk-keluar | i11 | 🎧 headphone | proyektor |
| sd4-kode-perangkat-masuk-keluar | i12 | 📽️ proyektor | lampu LED robot |
| sd4-kode-perangkat-masuk-keluar | i13 | 💡 lampu LED robot | layar sentuh tablet |
| sd4-kode-perangkat-masuk-keluar | i14 | 💾 flashdisk | headset bermikrofon |
| sd4-kode-perangkat-masuk-keluar | i15 | 🗂️ kartu memori | jam tangan pintar berlayar sentuh |
| sd4-kode-perangkat-masuk-keluar | i16 | 🧱 hard disk | stik game yang bisa bergetar |
| sd4-kode-perangkat-masuk-keluar | i2 | 🖱️ tetikus | mouse |
| sd4-kode-perangkat-masuk-keluar | i3 | 🎤 mikrofon | mikrofon |
| sd4-kode-perangkat-masuk-keluar | i4 | 📷 kamera web | kamera web |
| sd4-kode-perangkat-masuk-keluar | i5 | 🕹️ joystick | joystick tanpa getar |
| sd4-kode-perangkat-masuk-keluar | i6 | 🌡️ sensor suhu | sensor suhu |
| sd4-kode-perangkat-masuk-keluar | i7 | 🔍 pemindai barcode | printer |
| sd4-kode-perangkat-masuk-keluar | i8 | 🖨️ printer | speaker |
| sd4-kode-perangkat-masuk-keluar | i9 | 🔊 speaker | monitor |
| sd4-kode-perangkat-masuk-keluar | instruksi | Seret tiap perangkat ke kelompoknya: memasukkan data ke komputer, mengeluarkan hasil, atau menyimpan data. | Seret tiap perangkat ke kelompoknya: hanya memasukkan data, hanya mengeluarkan hasil, atau sekaligus memasukkan dan mengeluarkan. |
| sd4-kode-perangkat-masuk-keluar | judul | Masuk, Keluar, Simpan | Masuk, Keluar, atau Keduanya |
| sd4-kode-perangkat-masuk-keluar | bin-keduanya | (baru) | masukan dan keluaran |
| sd4-kode-perangkat-masuk-keluar | i17 | (baru) | speaker pintar yang menjawab perintah suara |
| sd5-kode-cabang-kalau-taman | q4 | cerah = Salah. kalau cerah: tampil 'main layangan', kalau tidak: tampil 'main di dalam'. Apa yang tampil? | cerah = False. kalau cerah: tampil 'main layangan', kalau tidak: tampil 'main di dalam'. Apa yang tampil? |
| sd5-kode-internet-putus-rumah | bin-bisa | tetap bisa | (dihapus) |
| sd5-kode-internet-putus-rumah | bin-tidak | tidak bisa | (dihapus) |
| sd5-kode-internet-putus-rumah | i1 | membaca buku digital yang sudah diunduh | mencetak foto ke printer di kamar ayah lewat Wi-Fi rumah |
| sd5-kode-internet-putus-rumah | i10 | ikut kelas video daring | memperbarui aplikasi di HP |
| sd5-kode-internet-putus-rumah | i11 | memperbarui aplikasi di HP | menonton film secara streaming |
| sd5-kode-internet-putus-rumah | i12 | menonton film secara streaming | main game daring bersama teman di kota lain |
| sd5-kode-internet-putus-rumah | i13 | mengunduh game baru | membaca buku digital yang sudah diunduh |
| sd5-kode-internet-putus-rumah | i14 | bermain game daring bersama teman | menyalakan senter HP |
| sd5-kode-internet-putus-rumah | i2 | menonton film yang sudah diunduh | mengirim lagu ke HP ibu lewat Bluetooth |
| sd5-kode-internet-putus-rumah | i3 | menyalakan senter HP | menyambungkan headphone Bluetooth ke laptop |
| sd5-kode-internet-putus-rumah | i4 | menggambar di aplikasi gambar | menyalin foto dari HP ke laptop lewat Wi-Fi rumah |
| sd5-kode-internet-putus-rumah | i5 | merekam suara dengan HP | memakai mouse Bluetooth di laptop |
| sd5-kode-internet-putus-rumah | i6 | memasang alarm di HP | main game berdua di dua tablet lewat Wi-Fi rumah |
| sd5-kode-internet-putus-rumah | i7 | bermain catur melawan komputer di laptop | mengirim pesan di aplikasi obrolan |
| sd5-kode-internet-putus-rumah | i8 | mengirim pesan di aplikasi obrolan | melihat ramalan cuaca terbaru |
| sd5-kode-internet-putus-rumah | i9 | melihat ramalan cuaca terbaru | ikut kelas video daring |
| sd5-kode-internet-putus-rumah | instruksi | Wi-Fi di rumah sedang mati dan HP tidak punya kuota: seret tiap kegiatan ke 'tetap bisa' atau 'tidak bisa'. | Paket internet rumah habis, tetapi router Wi-Fi tetap menyala dan HP tidak punya kuota. Seret tiap kegiatan: cukup jaringan rumah, butuh internet, atau tidak butuh jaringan? |
| sd5-kode-internet-putus-rumah | bin-internet | (baru) | butuh internet |
| sd5-kode-internet-putus-rumah | bin-lokal | (baru) | cukup Wi-Fi rumah atau Bluetooth |
| sd5-kode-internet-putus-rumah | bin-tanpa | (baru) | tidak butuh jaringan |
| sd5-kode-internet-putus-rumah | i15 | (baru) | menggambar di aplikasi gambar |
| sd5-kode-internet-putus-rumah | i16 | (baru) | merekam suara dengan HP |
| sd5-kode-internet-putus-rumah | i17 | (baru) | memasang alarm di HP |
| sd5-kode-internet-putus-rumah | i18 | (baru) | bermain catur melawan komputer di laptop |
| sd5-kode-internet-putus | bin-bisa | tetap bisa | (dihapus) |
| sd5-kode-internet-putus | bin-tidak | tidak bisa | (dihapus) |
| sd5-kode-internet-putus | i1 | memotret dengan kamera HP | mencetak tugas ke printer lewat Wi-Fi rumah |
| sd5-kode-internet-putus | i10 | menonton video streaming | mencari di mesin pencari |
| sd5-kode-internet-putus | i11 | mencari di mesin pencari | membuka peta daring untuk rute |
| sd5-kode-internet-putus | i12 | membuka peta daring untuk rute | mengunggah tugas ke kelas daring |
| sd5-kode-internet-putus | i13 | membayar dengan dompet digital | memotret dengan kamera HP |
| sd5-kode-internet-putus | i14 | mengunggah tugas ke kelas daring | memakai kalkulator di HP |
| sd5-kode-internet-putus | i2 | memakai kalkulator di HP | mengirim foto ke HP adik lewat Bluetooth |
| sd5-kode-internet-putus | i3 | membuka foto di galeri | memutar lagu dari HP ke speaker Bluetooth |
| sd5-kode-internet-putus | i4 | menulis catatan di laptop | memindahkan berkas ke laptop kakak lewat Wi-Fi rumah |
| sd5-kode-internet-putus | i5 | mendengar lagu yang sudah diunduh | mengetik di tablet dengan keyboard Bluetooth |
| sd5-kode-internet-putus | i6 | bermain game luring yang sudah terpasang | main game berdua lewat Bluetooth dengan HP di sebelahmu |
| sd5-kode-internet-putus | i7 | mencetak lewat kabel USB | panggilan video dengan nenek di kota lain |
| sd5-kode-internet-putus | i8 | panggilan video dengan nenek | mengirim email |
| sd5-kode-internet-putus | i9 | mengirim email | menonton video streaming |
| sd5-kode-internet-putus | instruksi | Internet di rumah sedang putus: seret tiap kegiatan ke 'tetap bisa' atau 'tidak bisa'. | Internet sedang putus, tetapi router Wi-Fi rumah masih menyala dan Bluetooth bisa dipakai. Seret tiap kegiatan: cukup jaringan rumah, butuh internet, atau tidak butuh jaringan? |
| sd5-kode-internet-putus | bin-internet | (baru) | butuh internet |
| sd5-kode-internet-putus | bin-lokal | (baru) | cukup Wi-Fi rumah atau Bluetooth |
| sd5-kode-internet-putus | bin-tanpa | (baru) | tidak butuh jaringan |
| sd5-kode-internet-putus | i15 | (baru) | membuka foto di galeri |
| sd5-kode-internet-putus | i16 | (baru) | menulis catatan di laptop |
| sd5-kode-internet-putus | i17 | (baru) | mendengar lagu yang sudah diunduh dari speaker HP |
| sd5-kode-internet-putus | i18 | (baru) | main game luring yang sudah terpasang |
| sd5-kode-lacak-kalau | q7 | hujan = Benar. kalau hujan: tampil 'bawa payung', kalau tidak: tampil 'pakai topi'. Apa yang tampil? | hujan = True. kalau hujan: tampil 'bawa payung', kalau tidak: tampil 'pakai topi'. Apa yang tampil? |
| sd5-kode-perangkat-terhubung | bin-kirim | kirim data lewat internet | terhubung ke internet |
| sd5-kode-perangkat-terhubung | i4 | mesin ATM | mesin parkir yang mengirim data ke aplikasi |
| sd5-kode-perangkat-terhubung | instruksi | Seret tiap benda: apakah ia mengirim data lewat internet, atau bekerja sendiri tanpa internet? | Seret tiap benda: apakah ia terhubung ke internet untuk mengirim atau menerima data, atau bekerja sendiri tanpa internet? |
| sd5-kode-terhubung-kota | bin-kirim | kirim data lewat internet | terhubung ke internet |
| sd5-kode-terhubung-kota | i6 | mesin pembayaran kartu di toko | kamera lalu lintas yang siarannya bisa dilihat di internet |
| sd5-kode-terhubung-kota | instruksi | Di kota ada banyak benda listrik: seret tiap benda, apakah ia mengirim data lewat internet, atau bekerja sendiri tanpa internet? Ingat, memakai listrik belum tentu memakai internet. | Di kota ada banyak benda listrik: seret tiap benda, apakah ia terhubung ke internet untuk mengirim atau menerima data, atau bekerja sendiri tanpa internet? Ingat, memakai listrik belum tentu memakai internet. |
| sd3-kode-perjalanan-pesan | surel-1 | tulis surel | tulis email |
| sd3-kode-perjalanan-pesan | surel-3 | surel lewat wifi ke router | email lewat wifi ke router |
| sd3-kode-perjalanan-pesan | surel-4 | surel lewat internet ke server surel | email lewat internet ke server email |
| sd3-kode-perjalanan-pesan | surel-5 | surel sampai di laptop guru | email sampai di laptop guru |
| sd3-kode-perjalanan-pesan | surel-6 | guru membaca surel | guru membaca email |
| sd3-kode-perjalanan-pesan | t-surel | Mengirim surel ke guru | Mengirim email ke guru |
| sd3-kode-sunting-algoritma | pohon-5 | siram air | siram tanah timbunannya |
| sd3-kode-sunting-algoritma | surel-2 | buka aplikasi surel | buka aplikasi email |
| sd3-kode-sunting-algoritma | t-surel | Mengirim surel | Mengirim email |
| sd3-kode-sunting-algoritma | video-tugas-7 | simpan videonya | simpan video yang sudah dipotong |
| sd3-kode-sunting-kartu-percobaan | ban-3 | cari lubangnya | celupkan ban dalam ke air untuk mencari lubang |
| sd3-kode-sunting-kartu-percobaan | cerita-3 | ketik judul cerita | ketik judul dan isi cerita |
| sd3-kode-sunting-kartu-percobaan | cerita-4 | ketik isi cerita | periksa ejaan ceritamu |
| sd3-kode-sunting-kartu-percobaan | cerita-5 | periksa ejaan ceritamu | perbaiki kata yang salah |
| sd3-kode-sunting-kartu-percobaan | gunung-1 | taruh botol kecil di nampan | siapkan botol kosong di atas nampan |
| sd3-kode-sunting-kartu-percobaan | gunung-2 | masukkan dua sendok soda kue | masukkan dua sendok soda kue ke botol |
| sd3-kode-sunting-kartu-percobaan | gunung-3 | tuang cuka ke dalam botol | tuang cuka ke atas soda kue |
| sd3-kode-sunting-kartu-percobaan | gunung-5 | amati busanya sampai berhenti | amati busa sampai berhenti |
| sd3-kode-sunting-kartu-percobaan | gunung-6 | catat yang terjadi selagi busa masih ada | tulis hasil pengamatanmu |
| sd3-kode-sunting-kartu-percobaan | gunung-7 | cuci botol dan nampan | bacakan catatanmu di depan kelas |
| sd3-kode-sunting-kartu-percobaan | gunung-8 | simpan alat di lemari | teman-teman bertepuk tangan |
| sd3-kode-sunting-kartu-percobaan | lari-4 | berdiri di garis start | petugas memeriksa nomor di bajumu |
| sd3-kode-sunting-kartu-percobaan | nasi-goreng-4 | masukkan nasi | masukkan nasi ke tumisan bawang |
| sd3-kode-sunting-kartu-percobaan | nasi-goreng-5 | tuang kecap | tuang kecap ke atas nasi |
| sd3-kode-sunting-kartu-percobaan | nasi-goreng-6 | aduk sampai rata | aduk di atas api sampai warnanya rata |
| sd3-kode-sunting-kartu-percobaan | sop-1 | cuci sayurannya | isi panci dengan air |
| sd3-kode-sunting-kartu-percobaan | sop-2 | potong wortel dan kentang | nyalakan kompor sampai air mendidih |
| sd3-kode-sunting-kartu-percobaan | sop-3 | masukkan ke panci berisi air | masukkan potongan wortel dan kentang ke air mendidih |
| sd3-kode-sunting-kartu-percobaan | sop-4 | rebus sampai empuk | rebus sampai sayurnya empuk |
| sd3-kode-sunting-kartu-percobaan | sop-5 | tambahkan garam | tambahkan garam ke sayur yang sudah empuk |
| sd3-kode-sunting-kartu-percobaan | sop-6 | aduk sampai garam larut | aduk selagi kompor menyala |
| sd3-kode-sunting-kartu-percobaan | unggah-1 | selesaikan gambar tugasmu | buka kunci layar tablet |
| sd4-kode-ipo-pasar | s2 | Umur lima tahun lagi | Umur dalam jam |
| sd4-kode-ipo-pasar | s2-1 | tahun = minta('Tahun berapa kamu lahir?') | umur = minta('Berapa tahun umurmu?') |
| sd4-kode-ipo-pasar | s2-2 | umur = 2026 - tahun | hari = umur * 365 |
| sd4-kode-ipo-pasar | s2-3 | nanti = umur + 5 | jam = hari * 24 |
| sd4-kode-ipo-pasar | s2-4 | tampilkan nanti | tampilkan jam |
| sd4-kode-masukan-proses-keluaran | instruksi | Susun baris program supaya berjalan benar: minta masukan dulu, olah, lalu tampilkan hasilnya. | Susun baris program supaya berjalan benar: minta masukan dulu dengan baris minta, olah, lalu tampilkan hasilnya. |
| sd4-kode-masukan-proses-keluaran | s1-1 | minta angka pertama | pertama = minta('Angka pertama?') |
| sd4-kode-masukan-proses-keluaran | s1-2 | minta angka kedua | kedua = minta('Angka kedua?') |
| sd4-kode-masukan-proses-keluaran | s10 | Bagi permen berdua | Bagi sisa permen berdua |
| sd4-kode-masukan-proses-keluaran | s10-1 | tampilkan 'Ada berapa permen?' | permen = minta('Ada berapa permen?') |
| sd4-kode-masukan-proses-keluaran | s10-2 | permen = angka dari pengguna | sisa = permen - 2 |
| sd4-kode-masukan-proses-keluaran | s10-3 | bagian = permen / 2 | bagian = sisa / 2 |
| sd4-kode-masukan-proses-keluaran | s2-1 | tampilkan soal 3 + 4 = ? | jawaban = minta('Berapa 3 + 4?') |
| sd4-kode-masukan-proses-keluaran | s2-2 | minta jawaban | selisih = jawaban - 7 |
| sd4-kode-masukan-proses-keluaran | s2-3 | kalau jawaban 7, skor = 1, kalau tidak skor = 0 | kalau selisih == 0: pesan = 'Hebat!', kalau tidak: pesan = 'Coba lagi' |
| sd4-kode-masukan-proses-keluaran | s2-4 | tampilkan skor | tampilkan pesan |
| sd4-kode-masukan-proses-keluaran | s3-1 | c = suhu °C dari pengguna | c = minta('Suhu dalam °C?') |
| sd4-kode-masukan-proses-keluaran | s3-4 | tampilkan f dalam °F | tampilkan f |
| sd4-kode-masukan-proses-keluaran | s4-1 | tampilkan 'Siapa namamu?' | nama = minta('Siapa namamu?') |
| sd4-kode-masukan-proses-keluaran | s4-2 | nama = jawaban pengguna | sapa = 'Halo, ' + nama |
| sd4-kode-masukan-proses-keluaran | s4-3 | sapa = 'Halo, ' + nama | sapa = sapa + '!' |
| sd4-kode-masukan-proses-keluaran | s5 | Luas persegi | Luas empat ubin |
| sd4-kode-masukan-proses-keluaran | s5-1 | tampilkan 'Panjang sisi?' | sisi = minta('Panjang sisi ubin (cm)?') |
| sd4-kode-masukan-proses-keluaran | s5-2 | sisi = angka dari pengguna | luas = sisi * sisi |
| sd4-kode-masukan-proses-keluaran | s5-3 | luas = sisi * sisi | empat = luas * 4 |
| sd4-kode-masukan-proses-keluaran | s5-4 | tampilkan luas | tampilkan empat |
| sd4-kode-masukan-proses-keluaran | s6 | Rata-rata tiga nilai | Rata-rata dua nilai |
| sd4-kode-masukan-proses-keluaran | s6-1 | minta nilai n1, n2, n3 | n1 = minta('Nilai pertama?') |
| sd4-kode-masukan-proses-keluaran | s6-2 | jumlah = n1 + n2 + n3 | n2 = minta('Nilai kedua?') |
| sd4-kode-masukan-proses-keluaran | s6-3 | rata = jumlah / 3 | rata = (n1 + n2) / 2 |
| sd4-kode-masukan-proses-keluaran | s7 | Umur tahun depan | Umur tahun depan dalam bulan |
| sd4-kode-masukan-proses-keluaran | s7-1 | tampilkan 'Berapa umurmu?' | umur = minta('Berapa umurmu?') |
| sd4-kode-masukan-proses-keluaran | s7-2 | umur = angka dari pengguna | depan = umur + 1 |
| sd4-kode-masukan-proses-keluaran | s7-3 | umur = umur + 1 | bulan = depan * 12 |
| sd4-kode-masukan-proses-keluaran | s7-4 | tampilkan umur | tampilkan bulan |
| sd4-kode-masukan-proses-keluaran | s8 | Uang jajan seminggu | Tabungan seminggu |
| sd4-kode-masukan-proses-keluaran | s8-1 | tampilkan 'Uang jajan sehari?' | harian = minta('Uang jajan sehari?') |
| sd4-kode-masukan-proses-keluaran | s8-2 | harian = angka dari pengguna | seminggu = harian * 7 |
| sd4-kode-masukan-proses-keluaran | s8-3 | seminggu = harian * 7 | tabung = seminggu / 2 |
| sd4-kode-masukan-proses-keluaran | s8-4 | tampilkan seminggu | tampilkan tabung |
| sd4-kode-masukan-proses-keluaran | s9 | Menit jadi detik | Jarak lari keliling lapangan |
| sd4-kode-masukan-proses-keluaran | s9-1 | tampilkan 'Berapa menit?' | putaran = minta('Berapa putaran?') |
| sd4-kode-masukan-proses-keluaran | s9-2 | m = angka dari pengguna | meter = putaran * 400 |
| sd4-kode-masukan-proses-keluaran | s9-3 | d = m * 60 | km = meter / 1000 |
| sd4-kode-masukan-proses-keluaran | s9-4 | tampilkan d detik | tampilkan km |
| sd4-kode-perjalanan-pesan | s9 | Bermain gim daring | Bermain game daring |
| sd4-kode-perjalanan-pesan | s9-3 | server gim menerima perintah | server game menerima perintah |

## Butuh fitur baru

| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| sd3-kode-masuk-simpan-keluar | usb-flash-drive, memory-card | ikon aset penyimpanan | ikon flashdisk dan kartu memori (sementara shape rect/square berwarna) |
| sd3-kode-tiga-tugas-perangkat | ssd, kartu-kamera | ikon aset penyimpanan | ikon SSD eksternal dan kartu memori kamera (sementara shape rect/square) |
| sd4-kode-perangkat-kelas | i5 touchpad laptop | ikon aset | ikon touchpad (sementara shape square) |
| sd4-kode-perangkat-masuk-keluar | i10 headphone vs i14 headset bermikrofon | ikon aset | ikon headset bermikrofon yang berbeda dari 🎧 (sekarang keduanya 🎧, dibedakan lewat label) |

Tidak ada paket di kelompok ini yang memakai `potong: "tengah"`, belah-ketupat, atau koin/uang.

## Tidak dikerjakan

| butir | alasan |
|---|---|
| Pindahkan KODE.SD3.KONDISI.01/DEBUG.01/PREDIKSI.01 ke SD5 | Id kompetensi tidak boleh diubah. Masalah urutan diselesaikan dengan mempersulit SD4/SD5 (lihat atas). Isi SD3 tidak diubah. |
| Naikkan versi minor untuk paket yang ditulis ulang total | Brief meminta kenaikan patch. Semua paket naik satu patch dari HEAD. |
