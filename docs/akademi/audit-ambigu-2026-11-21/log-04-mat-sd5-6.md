# Log 04 — MAT SD5 & SD6 (audit soal ambigu)

Cakupan: 80 paket (40 SD5, 40 SD6), semua soal/kartu/urutan/label rak/instruksi diperiksa; semua kunci jawaban dihitung ulang (tidak ada kunci salah). Kurikulum MAT-SD5/MAT-SD6 tidak diubah. 34 paket diubah, versi patch dinaikkan. Skema: 810 paket valid. Audit: ERROR 0; tidak ada temuan untuk paket sd5-mat/sd6-mat (4 WARNING instruksi-tanpa-perintah milik paket lain).

## Temuan
| jenis (1–6) | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| 2 | sd5-mat-pecahan-toko-kue | r12 / c26 | "0/2" dan "0/4" sama-sama bernilai 0 (dari koordinator) | diperbaiki: c26 → "1/2" (pengecoh "lupa mengurangi") |
| 2 | sd5-mat-tambah-kurang-pecahan | r2 / c6 | "3/9" = "2/6" (dua pengecoh senilai) | diperbaiki: c6 → "3/18" (pembilang dijumlah, penyebut dikali) |
| 2 | sd5-mat-tambah-kurang-pecahan | r8 / c25 | "4/10" = "2/5" | diperbaiki: c25 → "2/10" |
| 2 | sd6-mat-pecahan-beda-penyebut | r4 | "2/12" = "1/6" | diperbaiki: pilihan c14 (1/6) diganti c22 (1/24, salah kalikan penyebut); c14 tetap dipakai r12 |
| 3/4 (judul) | sd5-mat-urut-desimal-persen | s1,s2,s3,s6,s8,s10 (+s9) | judul "lima …" padahal knob steps 3–4 hanya memotong 3–4 kartu (bawaan 4); s9 "Bagian kebun" tunggal untuk beberapa nilai | diperbaiki: "lima" dihapus / "tiap …" (EN ikut) |
| 3/4 (judul) | sd5-mat-urut-nilai-campur | s1–s10 | sama: "lima …" tidak cocok dengan jumlah kartu yang tampil | diperbaiki: "Bagian tiap …", "tiap anak", "katak-katak" (EN ikut) |
| 3/4 (judul) | sd6-mat-urut-desimal-pecahan-persen | s1,s2,s3,s5,s7,s9 | sama; s3 "Bagian kolam" tunggal | diperbaiki |
| 3/4 (judul) | sd6-mat-urut-nilai-rapat | s1,s3,s4,s6,s8,s9,s10 | sama | diperbaiki: "beberapa …" |
| 5 | sd5-mat-melewati-nol | q10 | lift dari −2 naik 6 → 4 hanya benar bila ada lantai 0; banyak gedung di Indonesia tidak punya lantai 0 (B1 → lantai 1) | diperbaiki: "Lantai 0 adalah lobi." ditambahkan |
| 6 | sd5-mat-cari-angka-desimal | instruksi | petunjuk hanya menjelaskan persepuluhan/perseratusan, padahal separuh soal menanyakan puluhan/satuan; tidak menyebut aksi | diperbaiki: sebut puluhan & satuan di kiri koma + "Sentuh angkanya." |
| 6 | sd5-mat-nilai-angka-desimal | instruksi | "Perhatikan tempat angka di belakang koma" menyesatkan untuk "Angka 5 pada 25,18" (jawaban 5, di depan koma) | diperbaiki: "di kiri atau di kanan koma" |
| 3 | sd5-mat-kembalian-ratusan | instruksi | "Hitung kembaliannya" tidak menyuruh memberi uang dari laci (mekanik kembalian) | diperbaiki: "…lalu beri uang kembalian yang tepat…" |
| 3 | sd5-mat-prima-50-sampai-100 | instruksi | tidak menyebut memilah ke rak | diperbaiki: tambah "Taruh tiap kartu di rak prima atau komposit." |
| 3 | sd5-mat-kemasan-bagi-4-dan-8 | instruksi | mekanik pilih, instruksi tidak menyebut aksi | diperbaiki: "Sentuh jawabannya." |
| 4 | sd5-mat-kemasan-bagi-4-dan-8 | q4 | "Jumlah roda mana yang pas?" — "pas" kabur | diperbaiki: "Tiap mobil mainan punya 4 roda. Jumlah roda mana yang pas tanpa sisa?" |
| 4 (label rak) | sd5-mat-uji-bagi-4-dan-8 | b-b4 | "dibagi 4, tidak 8" (tanpa "habis") | diperbaiki: "habis dibagi 4, tidak 8" (EN tetap) |
| 3 | sd5-mat-pecahan-toko-kue | instruksi | tidak menyebut aksi | diperbaiki: "Sentuh hasilnya." |
| 4 | sd5-mat-sudut-gunting | instruksi | "Benda-benda ini" rujukan kabur (tidak ada gambar); "Sentuh sudut x" | diperbaiki: "Di tiap soal, sudut-sudut di sepanjang garis lurus berjumlah 180°. Hitung sudut x, lalu sentuh jawabannya." |
| 4 | sd5-mat-keliling-sama-luas-beda | c28, c29 | "dua-duanya sama/beda" — tidak jelas apa yang sama | diperbaiki: "keliling dan luas sama/beda" (EN ikut) |
| 3 | sd5-mat-modus-dan-median | instruksi | hanya definisi, tanpa aksi | diperbaiki: "Sentuh jawabannya." |
| 3 | sd5-mat-peluang-kantong-dadu | instruksi | tanpa aksi | diperbaiki: "…bandingkan, lalu sentuh jawabannya." |
| 3 | sd6-mat-perkiraan-pabrik | instruksi | tanpa aksi | diperbaiki: "Sentuh jawabannya." |
| 4 | sd6-mat-kpk-dan-fpb | instruksi | instruksi memakai "kelipatan/faktor bersama", soal memakai "persekutuan" | diperbaiki: "kelipatan persekutuan terkecil / faktor persekutuan terbesar" |
| 6 | sd6-mat-uji-bagi-3-9-gudang | instruksi, b-b3 | instruksi menyebut "rak 9 / rak 3 / rak tidak", padahal label rak "habis dibagi 9 / dibagi 3, tidak 9 / tidak habis dibagi 3" | diperbaiki: instruksi tanpa nama rak fiktif, label "habis dibagi 3, tidak 9" |
| 6 | sd6-mat-uji-bagi-3-dan-9 | instruksi, b-b3 | sama | diperbaiki |
| 3 | sd6-mat-pecahan-beda-penyebut-taman | instruksi | tanpa aksi | diperbaiki: "Sentuh hasilnya." |
| 3 | sd6-mat-persen-diskon | instruksi | tanpa aksi | diperbaiki |
| 3 | sd6-mat-persen-toko-buku | instruksi | tanpa aksi | diperbaiki |
| 3 | sd6-mat-huruf-rahasia-brankas | instruksi | tanpa aksi | diperbaiki |
| 3 | sd6-mat-nilai-huruf | instruksi | tanpa aksi | diperbaiki |
| 3 | sd6-mat-suku-jauh | instruksi | tanpa aksi | diperbaiki |
| 3 | sd6-mat-rata-rata-dan-jangkauan | instruksi | tanpa aksi | diperbaiki |
| 3 | sd6-mat-sudut-segitiga-rangka-atap | instruksi | hanya aturan, tanpa aksi | diperbaiki: "Cari sudut yang hilang, lalu sentuh jawabannya." |
| 3 | sd6-mat-tanda-kurung | instruksi | tanpa aksi | diperbaiki: "Sentuh hasilnya." |
| 4 | sd6-mat-kubik-bintang-angkasa | q8 | "Planet mana…" padahal semua soal lain "Bintang bernomor …" | diperbaiki: "Bintang mana yang nomornya bilangan kubik?" |
| 2 | sd5-mat-gudang-kali-bagi, sd5-mat-kali-dua-angka | r3,r4,r5,r8 / r10 | pengecoh "67 sisa 12", "46 sisa 8", "52 sisa 6", "52 sisa 12", "131 sisa 8" secara nilai sama dengan bilangan yang dibagi (sisa ≥ pembagi) | diperbaiki (keputusan koordinator opsi b): gudang c11 → "67 sisa 2", c15 → "46 sisa 2", c19 → "52 sisa 1", c30 → "52 sisa 5"; kali-dua-angka c37 → "131 sisa 1" (EN "r" ikut); tiap soal tetap tepat satu pilihan benar, tanpa pilihan kembar |
| 2 | sd6-mat-jenis-segi-empat | r10 | "1 garis simetri dan diagonal tegak lurus" — trapesium sama kaki khusus bisa punya diagonal tegak lurus | ditolak: kasus sangat khusus, di luar jenjang; definisi umum tetap satu jawaban |
| 5 | sd5-mat-bandingkan-peluang | r12 | "sisi angka" pada koin | ditolak: istilah baku koin Indonesia (angka/gambar) |

## Kalimat suara berubah
| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd5-mat-kembalian-ratusan | instruksi | Pembeli membayar 50 ribu atau 100 ribu. Hitung kembaliannya, termasuk koin 500. | Pembeli membayar 50 ribu atau 100 ribu. Hitung kembaliannya, lalu beri uang kembalian yang tepat, termasuk koin 500. |
| sd5-mat-cari-angka-desimal | instruksi | Temukan angka di tempat yang ditanya: persepuluhan tepat di kanan koma, perseratusan di sebelahnya. | Cari angka di tempat yang ditanya. Puluhan dan satuan ada di kiri koma; persepuluhan tepat di kanan koma, perseratusan di sebelahnya. Sentuh angkanya. |
| sd5-mat-keliling-sama-luas-beda | c28 | dua-duanya sama | keliling dan luas sama |
| sd5-mat-keliling-sama-luas-beda | c29 | dua-duanya beda | keliling dan luas beda |
| sd5-mat-kemasan-bagi-4-dan-8 | instruksi | Habis dibagi 4: lihat dua angka terakhir. Habis dibagi 8: lihat tiga angka terakhir; kalau dua angka terakhir tidak habis dibagi 4, pasti tidak habis dibagi 8. | Habis dibagi 4: lihat dua angka terakhir. Habis dibagi 8: lihat tiga angka terakhir; kalau dua angka terakhir tidak habis dibagi 4, pasti tidak habis dibagi 8. Sentuh jawabannya. |
| sd5-mat-kemasan-bagi-4-dan-8 | q4 | Roda mobil mainan 4 per mobil. Jumlah roda mana yang pas? | Tiap mobil mainan punya 4 roda. Jumlah roda mana yang pas tanpa sisa? |
| sd5-mat-melewati-nol | q10 | Lift di lantai −2 (parkir) naik 6 lantai. Sampai di lantai … | Lantai 0 adalah lobi. Lift di lantai −2 (parkir) naik 6 lantai. Sampai di lantai … |
| sd5-mat-modus-dan-median | instruksi | Modus = nilai yang paling sering muncul. Median = nilai tengah setelah data diurutkan. | Modus = nilai yang paling sering muncul. Median = nilai tengah setelah data diurutkan. Sentuh jawabannya. |
| sd5-mat-nilai-angka-desimal | instruksi | Perhatikan tempat angka di belakang koma, lalu sentuh nilai yang benar. | Perhatikan tempat tiap angka, di kiri atau di kanan koma, lalu sentuh nilai yang benar. |
| sd5-mat-pecahan-toko-kue | instruksi | Ubah ke penyebut yang lebih besar, lalu jumlahkan atau kurangkan pembilangnya. | Ubah ke penyebut yang lebih besar, lalu jumlahkan atau kurangkan pembilangnya. Sentuh hasilnya. |
| sd5-mat-pecahan-toko-kue | c26 | 0/4 | 1/2 |
| sd5-mat-peluang-kantong-dadu | instruksi | Hitung banyak cara tiap kejadian bisa terjadi, lalu bandingkan. | Hitung banyak cara tiap kejadian bisa terjadi, bandingkan, lalu sentuh jawabannya. |
| sd5-mat-prima-50-sampai-100 | instruksi | Semua kartu ganjil! Cari faktornya: kalau hanya 1 dan dirinya, berarti prima. | Semua kartu ganjil! Cari faktornya: kalau hanya 1 dan dirinya, berarti prima. Taruh tiap kartu di rak prima atau komposit. |
| sd5-mat-sudut-gunting | instruksi | Benda-benda ini membentuk garis lurus, jadi sudut-sudutnya berjumlah 180°. Sentuh sudut x. | Di tiap soal, sudut-sudut di sepanjang garis lurus berjumlah 180°. Hitung sudut x, lalu sentuh jawabannya. |
| sd5-mat-tambah-kurang-pecahan | c6 | 3/9 | 3/18 |
| sd5-mat-tambah-kurang-pecahan | c25 | 2/5 | 2/10 |
| sd5-mat-uji-bagi-4-dan-8 | b-b4 | dibagi 4, tidak 8 | habis dibagi 4, tidak 8 |
| sd6-mat-huruf-rahasia-brankas | instruksi | Cari bilangan pengganti huruf supaya kalimatnya benar. Coba periksa dengan memasukkannya kembali. | Cari bilangan pengganti huruf supaya kalimatnya benar. Periksa dengan memasukkannya kembali, lalu sentuh jawabannya. |
| sd6-mat-kpk-dan-fpb | instruksi | KPK = kelipatan bersama terkecil, FPB = faktor bersama terbesar. Sentuh jawaban yang benar. | KPK = kelipatan persekutuan terkecil, FPB = faktor persekutuan terbesar. Sentuh jawaban yang benar. |
| sd6-mat-kubik-bintang-angkasa | q8 | Planet mana yang nomornya bilangan kubik? | Bintang mana yang nomornya bilangan kubik? |
| sd6-mat-nilai-huruf | instruksi | Huruf mewakili sebuah bilangan. Cari bilangannya supaya kalimat matematikanya benar. | Huruf mewakili sebuah bilangan. Cari bilangannya supaya kalimat matematikanya benar. Sentuh jawabannya. |
| sd6-mat-pecahan-beda-penyebut-taman | instruksi | Cari KPK penyebutnya, ubah kedua pecahan, hitung, lalu sederhanakan. | Cari KPK penyebutnya, ubah kedua pecahan, hitung, lalu sederhanakan. Sentuh hasilnya. |
| sd6-mat-perkiraan-pabrik | instruksi | Bulatkan ke angka depan untuk memperkirakan, atau hitung tepat pembagiannya. | Bulatkan ke angka depan untuk memperkirakan, atau hitung tepat pembagiannya. Sentuh jawabannya. |
| sd6-mat-persen-diskon | instruksi | Hitung persen atau pecahan dari jumlahnya. Baca baik-baik: besar diskon atau harga yang dibayar? | Hitung persen atau pecahan dari jumlahnya. Baca baik-baik: besar diskon atau harga yang dibayar? Sentuh jawabannya. |
| sd6-mat-persen-toko-buku | instruksi | Hitung besar diskon, harga bayar, atau persennya. Baca pertanyaannya baik-baik. | Hitung besar diskon, harga bayar, atau persennya. Baca pertanyaannya baik-baik. Sentuh jawabannya. |
| sd6-mat-rata-rata-dan-jangkauan | instruksi | Rata-rata = jumlah semua data dibagi banyak data. Jangkauan = terbesar dikurangi terkecil. | Rata-rata = jumlah semua data dibagi banyak data. Jangkauan = terbesar dikurangi terkecil. Sentuh jawabannya. |
| sd6-mat-sudut-segitiga-rangka-atap | instruksi | Jumlah sudut segitiga 180°. Pada segitiga sama kaki, dua sudut kakinya sama besar. | Jumlah sudut segitiga 180°. Pada segitiga sama kaki, dua sudut kakinya sama besar. Cari sudut yang hilang, lalu sentuh jawabannya. |
| sd6-mat-suku-jauh | instruksi | Cari aturan posisi ke suku (misalnya 3 × posisi + 2), lalu hitung suku yang ditanya. | Cari aturan posisi ke suku (misalnya 3 × posisi + 2), lalu hitung suku yang ditanya. Sentuh jawabannya. |
| sd6-mat-tanda-kurung | instruksi | Kerjakan yang di dalam kurung dulu, lalu kali dan bagi, baru tambah dan kurang. | Kerjakan yang di dalam kurung dulu, lalu kali dan bagi, baru tambah dan kurang. Sentuh hasilnya. |
| sd6-mat-uji-bagi-3-9-gudang | instruksi | Jumlahkan angka-angka nomor barang, angka 0 boleh dilewati. Jumlahnya habis dibagi 9 → rak 9, habis dibagi 3 saja → rak 3, selain itu → rak tidak. | Jumlahkan angka-angka tiap nomor barang (angka 0 boleh dilewati). Jumlahnya habis dibagi 9, hanya habis dibagi 3, atau tidak habis dibagi 3? Taruh di rak yang cocok. |
| sd6-mat-uji-bagi-3-9-gudang | b-b3 | dibagi 3, tidak 9 | habis dibagi 3, tidak 9 |
| sd6-mat-uji-bagi-3-dan-9 | instruksi | Jumlahkan angka-angkanya. Habis dibagi 9 → rak 9; habis dibagi 3 saja → rak 3; selain itu → rak tidak. | Jumlahkan angka-angkanya. Jumlahnya habis dibagi 9, hanya habis dibagi 3, atau tidak habis dibagi 3? Taruh di rak yang cocok. |
| sd6-mat-uji-bagi-3-dan-9 | b-b3 | dibagi 3, tidak 9 | habis dibagi 3, tidak 9 |
| sd5-mat-urut-desimal-persen | s1 | Tinggi lima bibit (cm) | Tinggi bibit (cm) |
| sd5-mat-urut-desimal-persen | s2 | Waktu lari lima anak (detik) | Waktu lari anak-anak (detik) |
| sd5-mat-urut-desimal-persen | s3 | Berat lima paket (kg) | Berat paket (kg) |
| sd5-mat-urut-desimal-persen | s6 | Nilai lima kuis (%) | Nilai kuis (%) |
| sd5-mat-urut-desimal-persen | s8 | Bagian lima botol yang sudah terisi | Bagian tiap botol yang sudah terisi |
| sd5-mat-urut-desimal-persen | s9 | Bagian kebun yang sudah ditanami | Bagian tiap kebun yang sudah ditanami |
| sd5-mat-urut-desimal-persen | s10 | Panjang lima pita (m) | Panjang pita (m) |
| sd5-mat-urut-nilai-campur | s1 | Bagian lima roti yang sudah dimakan | Bagian tiap roti yang sudah dimakan |
| sd5-mat-urut-nilai-campur | s2 | Bagian lima gelas yang sudah terisi | Bagian tiap gelas yang sudah terisi |
| sd5-mat-urut-nilai-campur | s3 | Bagian lima tembok yang sudah dicat | Bagian tiap tembok yang sudah dicat |
| sd5-mat-urut-nilai-campur | s4 | Bagian soal benar di lima tugas | Bagian soal benar di tiap tugas |
| sd5-mat-urut-nilai-campur | s5 | Bagian lima buku yang sudah dibaca | Bagian tiap buku yang sudah dibaca |
| sd5-mat-urut-nilai-campur | s6 | Bagian lima kebun yang sudah dipanen | Bagian tiap kebun yang sudah dipanen |
| sd5-mat-urut-nilai-campur | s7 | Bagian jalan yang sudah ditempuh lima anak | Bagian jalan yang sudah ditempuh tiap anak |
| sd5-mat-urut-nilai-campur | s8 | Kemajuan lima unduhan | Kemajuan tiap unduhan |
| sd5-mat-urut-nilai-campur | s9 | Lompatan lima katak (m) | Lompatan katak-katak (m) |
| sd5-mat-urut-nilai-campur | s10 | Isi baterai lima senter | Isi baterai tiap senter |
| sd6-mat-urut-desimal-pecahan-persen | s1 | Berat lima sampel (kg) | Berat sampel (kg) |
| sd6-mat-urut-desimal-pecahan-persen | s2 | Waktu lima pelari (detik) | Waktu para pelari (detik) |
| sd6-mat-urut-desimal-pecahan-persen | s3 | Bagian kolam yang dicat | Bagian tiap kolam yang dicat |
| sd6-mat-urut-desimal-pecahan-persen | s5 | Diskon lima toko | Diskon di beberapa toko |
| sd6-mat-urut-desimal-pecahan-persen | s7 | Panjang lima paku (cm) | Panjang paku (cm) |
| sd6-mat-urut-desimal-pecahan-persen | s9 | Bagian lima gelas yang sudah terisi | Bagian tiap gelas yang sudah terisi |
| sd6-mat-urut-nilai-rapat | s1 | Hasil lima percobaan | Hasil beberapa percobaan |
| sd6-mat-urut-nilai-rapat | s3 | Kadar gula lima minuman | Kadar gula beberapa minuman |
| sd6-mat-urut-nilai-rapat | s4 | Peluang lima roda putar | Peluang beberapa roda putar |
| sd6-mat-urut-nilai-rapat | s6 | Tinta lima printer | Sisa tinta beberapa printer |
| sd6-mat-urut-nilai-rapat | s8 | Kemiringan lima jalan | Kemiringan beberapa jalan |
| sd6-mat-urut-nilai-rapat | s9 | Diskon lima toko | Diskon di beberapa toko |
| sd6-mat-urut-nilai-rapat | s10 | Isi lima akuarium | Isi beberapa akuarium |
| sd5-mat-gudang-kali-bagi | c11 | 67 sisa 12 | 67 sisa 2 |
| sd5-mat-gudang-kali-bagi | c15 | 46 sisa 8 | 46 sisa 2 |
| sd5-mat-gudang-kali-bagi | c19 | 52 sisa 6 | 52 sisa 1 |
| sd5-mat-gudang-kali-bagi | c30 | 52 sisa 12 | 52 sisa 5 |
| sd5-mat-kali-dua-angka | c37 | 131 sisa 8 | 131 sisa 1 |

Catatan: c26/c6/c25 (label kartu pilihan) dan b-b4/b-b3 (label rak) ikut tercantum karena teksnya berubah.

## Butuh keputusan owner
Tidak ada lagi. Soal pembagian bersisa (MAT.SD5.OPERASI.02) sudah diputuskan koordinator: opsi (b), sudah diterapkan.
