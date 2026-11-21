# Keputusan 04 — MAT SD5 & SD6

Validasi skema: 808 paket valid. Error yang tersisa ada di paket PAUD milik agen lain (pensil-panjang-pendek, ular-panjang-pendek). akademi:audit: tidak ada ERROR/WARNING untuk paket SD5/SD6 MAT. instruksi-kembar di kelompok ini sudah hilang (sisa 1 milik kelompok lain).

## Keputusan yang diambil

| butir | keputusan | perubahan |
|---|---|---|
| sd5-mat-urut-nilai-campur / DESIMAL.02: deret hanya satu bentuk | Kesepuluh deret dibuat campuran (pecahan, desimal satu angka, persen). Bentuk sudah bercampur di 3 kartu pertama, jadi tetap campuran dengan knob steps minimum 3 atau default 4. Deret satu bentuk tetap ada di sd5-mat-urut-desimal-persen | 1.0.1 → 1.0.2. Seluruh judul dan kartu s1–s10 ditulis ulang dengan konteks "bagian dari keseluruhan" (roti, gelas, tembok, soal benar, buku, kebun, jalan, unduhan, baterai senter) dan satu deret lompatan katak memakai pecahan campuran (0,8 · 1 1/4 · 1,5 · 1 3/4 · 2,1). Urutan sudah dicek: naik tegas, tanpa nilai kembar |
| sd5-mat-cari-angka-desimal / DESIMAL.01: terlalu banyak soal satuan/puluhan | q5, q9, q10, q12 diubah dari satuan ke persepuluhan. Sekarang 8 dari 12 soal bertanya angka di belakang koma | 1.0.0 → 1.0.1. Kunci baru: q5 92,85 → 8 (c7), q9 41,82 → 8 (c7), q10 56,17 → 1 (c1), q12 85,62 → 6 (c9). EN ikut diubah |
| sd6-mat-sudut-segitiga / GEOMETRI.02: sifat sudut kaki tidak dipakai | r5, r9, r10 ditulis ulang supaya anak harus memakai "dua sudut kaki sama besar". Instruksi menyebut sifat itu | 1.0.0 → 1.0.1. r5 "satu sudut kaki 72°, sudut puncak …" ✓36°, pengecoh 108° (c37 baru, lupa satu sudut kaki), 54°, 216°. r9 "sudut puncak 110°, tiap sudut kaki …" ✓35°, pengecoh 70° (lupa membagi dua), 45°, 125° (c38 baru). r10 "satu sudut kaki 25°, sudut puncak …" ✓130°, pengecoh 155° (c39 baru), 310°, 140°. Item c20 (46°) tidak dipakai lagi, jadi dihapus |
| sd5-mat-tambah-kurang-pecahan vs sd5-mat-pecahan-toko-kue: 4 soal kembar | Soal kembar diganti di toko-kue. Paket dapur tetap | toko-kue 1.0.0 → 1.0.1. r1 9/10 − 1/5 ✓7/10 (pengecoh 8/5, 8/10, 11/10). r3 5/6 − 1/3 ✓3/6 (4/3, 4/6, 7/6). r8 1/2 + 3/10 ✓8/10 (4/12, 4/10, 2/10). r10 1/4 + 5/8 ✓7/8 (6/12, 6/8, 3/8). Item c1, c2, c27 tidak dipakai lagi, jadi dihapus |
| sd5-mat-sudut-garis-lurus vs sd5-mat-sudut-gunting: paket kembar, nama tidak cocok | sd5-mat-sudut-gunting diberi konteks benda nyata yang membentuk garis lurus: tangga, cabang jalan, kipas lipat, pintu, jarum jam, kue bolu, jalan raya, tongkat, sapu, gunting bersilang (2 soal), martabak. Soal kembar diganti | 1.0.0 → 1.0.1. Judul baru "Garis Lurus di Sekitar Kita", instruksi baru, 12 soal ditulis ulang. r9 65° → 72° (✓108°, 288°, 18°, 118°). r10 132° → 136° (✓44°, 224°, 34°, 54°). Garis lurus paket asli tetap |
| Instruksi kembar sd5-mat-setara-persen-lapangan / sd6-mat-setara-dua-desimal-pasar / sd6-mat-setara-dua-desimal | Ketiganya dibedakan sesuai isi. Isi paket pasar juga ditulis ulang: rak lamanya 1/5, 3/5, 9/10 (tingkat SD5, desimal satu angka) sehingga tidak melatih desimal dua angka | Lapangan (SD5) tetap. Lab 1.0.0 → 1.0.1: instruksi "Teliti angka nolnya: 0,05 berbeda dengan 0,5 …". Pasar 1.0.0 → 1.0.1: rak 7/20, 3/25, 9/20, 3/20, 1/25, kartu 0,35/35%/35/100 · 0,12/12%/12/100 · 0,45/45%/45/100 · 0,15/15%/6/40 · 0,04/4%/4/100. Instruksi menyuruh mengubah rak ke perseratus dulu ("misalnya 1/4 = 25/100"). Catatan kompetensi MAT.SD6.PECAHAN.04 di MAT-SD6.json diperbarui |
| Instruksi kembar sd6-mat-rasio-pasar / sd6-mat-rasio-resep-dan-peta | Pasar berisi rasio bagian dan setara, jadi instruksi tetap "kalikan atau bagi kedua bagian". Resep-dan-peta berisi harga satuan, kecepatan, dan skala, jadi instruksinya diganti ke strategi nilai satu bagian | resep-dan-peta 1.0.0 → 1.0.1: "Cari dulu nilai untuk satu bagian, misalnya harga 1 pensil atau jarak 1 cm di peta, lalu kalikan. Sentuh jawabannya." |
| Instruksi kembar sd6-mat-uji-bagi-3-9-gudang / sd6-mat-uji-bagi-3-dan-9 | Gudang berisi nomor 4 angka yang banyak memuat 0, jadi instruksinya menyebut nomor barang dan angka 0. Paket "Jumlah Angka Ajaib" tetap | gudang 1.0.1 → 1.0.2: "Jumlahkan angka-angka nomor barang, angka 0 boleh dilewati. Jumlahnya habis dibagi 9 → rak 9, habis dibagi 3 saja → rak 3, selain itu → rak tidak." |

## Kalimat suara berubah

| paket | kunci | lama | baru |
|---|---|---|---|
| sd5-mat-cari-angka-desimal | q5 | Pada 92,85, angka di tempat satuan adalah … | Pada 92,85, angka di tempat persepuluhan adalah … |
| sd5-mat-cari-angka-desimal | q9 | Pada 41,82, angka di tempat satuan adalah … | Pada 41,82, angka di tempat persepuluhan adalah … |
| sd5-mat-cari-angka-desimal | q10 | Pada 56,17, angka di tempat satuan adalah … | Pada 56,17, angka di tempat persepuluhan adalah … |
| sd5-mat-cari-angka-desimal | q12 | Pada 85,62, angka di tempat satuan adalah … | Pada 85,62, angka di tempat persepuluhan adalah … |
| sd5-mat-pecahan-toko-kue | q1 | 3/4 − 1/8 = … | 9/10 − 1/5 = … |
| sd5-mat-pecahan-toko-kue | c1 | 5/8 | (dihapus) |
| sd5-mat-pecahan-toko-kue | c2 | 2/4 | (dihapus) |
| sd5-mat-pecahan-toko-kue | q3 | 5/6 − 1/2 = … | 5/6 − 1/3 = … |
| sd5-mat-pecahan-toko-kue | q8 | 1/4 + 3/8 = … | 1/2 + 3/10 = … |
| sd5-mat-pecahan-toko-kue | q10 | 1/2 − 1/6 = … | 1/4 + 5/8 = … |
| sd5-mat-pecahan-toko-kue | c27 | 0/6 | (dihapus) |
| sd5-mat-pecahan-toko-kue | c34 | (baru) | 7/10 |
| sd5-mat-pecahan-toko-kue | c35 | (baru) | 8/5 |
| sd5-mat-pecahan-toko-kue | c36 | (baru) | 8/10 |
| sd5-mat-pecahan-toko-kue | c37 | (baru) | 11/10 |
| sd5-mat-pecahan-toko-kue | c38 | (baru) | 4/3 |
| sd5-mat-pecahan-toko-kue | c39 | (baru) | 7/6 |
| sd5-mat-pecahan-toko-kue | c40 | (baru) | 6/8 |
| sd5-mat-pecahan-toko-kue | c41 | (baru) | 3/8 |
| sd5-mat-pecahan-toko-kue | c42 | (baru) | 4/10 |
| sd5-mat-sudut-gunting | judul | Sudut di Garis Lurus II | Garis Lurus di Sekitar Kita |
| sd5-mat-sudut-gunting | instruksi | Ingat: sudut-sudut di garis lurus berjumlah 180°. Sentuh sudut x. | Benda-benda ini membentuk garis lurus, jadi sudut-sudutnya berjumlah 180°. Sentuh sudut x. |
| sd5-mat-sudut-gunting | q1 | Dua sudut bersebelahan di garis lurus: 54° dan x. x = … | Tangga bersandar di lantai datar, sudutnya dengan lantai 54°. Sudut di sisi lainnya x = … |
| sd5-mat-sudut-gunting | q2 | Dua sudut bersebelahan di garis lurus: 165° dan x. x = … | Jalan lurus punya cabang. Sudut antara cabang dan jalan 165°. Sudut di sebelahnya x = … |
| sd5-mat-sudut-gunting | q3 | Tiga sudut di garis lurus: 36°, 49°, dan x. x = … | Kipas lipat terbuka setengah lingkaran, terbagi jadi 36°, 49°, dan x. x = … |
| sd5-mat-sudut-gunting | q4 | Dua sudut bersebelahan di garis lurus: 50° dan x. x = … | Pintu terbuka membentuk sudut 50° dengan dinding yang lurus. Sudut di sisi lainnya x = … |
| sd5-mat-sudut-gunting | q5 | Dua sudut bersebelahan di garis lurus: 148° dan x. x = … | Pukul 6.00 jarum jam membentuk garis lurus. Jarum detik membaginya jadi 148° dan x. x = … |
| sd5-mat-sudut-gunting | q6 | Tiga sudut di garis lurus: 27°, 37°, dan x. x = … | Setengah kue bolu bundar dipotong jadi tiga: 27°, 37°, dan x. x = … |
| sd5-mat-sudut-gunting | q7 | Tiga sudut di garis lurus: 36°, 48°, dan x. x = … | Dua jalan kecil bertemu di tepi jalan raya yang lurus: 36°, 48°, dan x. x = … |
| sd5-mat-sudut-gunting | q8 | Tiga sudut di garis lurus: 38°, 53°, dan x. x = … | Dua tongkat ditancapkan di satu titik di tanah datar: 38°, 53°, dan x. x = … |
| sd5-mat-sudut-gunting | q9 | Dua sudut bersebelahan di garis lurus: 65° dan x. x = … | Sapu bersandar di lantai, sudutnya dengan lantai 72°. Sudut di sisi lainnya x = … |
| sd5-mat-sudut-gunting | c32 | 115° | 108° |
| sd5-mat-sudut-gunting | c33 | 295° | 288° |
| sd5-mat-sudut-gunting | c34 | 125° | 118° |
| sd5-mat-sudut-gunting | q10 | Dua sudut bersebelahan di garis lurus: 132° dan x. x = … | Gunting terbuka: dua bilahnya bersilang dan satu sudutnya 136°. Sudut di sebelahnya x = … |
| sd5-mat-sudut-gunting | c35 | 48° | 44° |
| sd5-mat-sudut-gunting | c36 | 228° | 224° |
| sd5-mat-sudut-gunting | q11 | Tiga sudut di garis lurus: 28°, 52°, dan x. x = … | Setengah martabak bundar dipotong jadi tiga: 28°, 52°, dan x. x = … |
| sd5-mat-sudut-gunting | q12 | Dua sudut bersebelahan di garis lurus: 119° dan x. x = … | Gunting terbuka: dua bilahnya bersilang dan satu sudutnya 119°. Sudut di sebelahnya x = … |
| sd5-mat-sudut-gunting | c45 | (baru) | 18° |
| sd5-mat-sudut-gunting | c46 | (baru) | 34° |
| sd5-mat-sudut-gunting | c47 | (baru) | 54° |
| sd6-mat-rasio-resep-dan-peta | instruksi | Kalikan atau bagi kedua bagian rasio dengan bilangan yang sama. Sentuh jawabannya. | Cari dulu nilai untuk satu bagian, misalnya harga 1 pensil atau jarak 1 cm di peta, lalu kalikan. Sentuh jawabannya. |
| sd6-mat-setara-dua-desimal-pasar | instruksi | Taruh tiap desimal, persen, atau pecahan di rak pecahan yang nilainya sama. | Ubah dulu pecahan di rak menjadi perseratus, misalnya 1/4 = 25/100. Lalu taruh desimal, persen, atau pecahan yang nilainya sama di rak itu. |
| sd6-mat-setara-dua-desimal-pasar | b-seperlima | 1/5 | (dihapus) |
| sd6-mat-setara-dua-desimal-pasar | b-tigaperlima | 3/5 | (dihapus) |
| sd6-mat-setara-dua-desimal-pasar | b-sembilanpersepuluh | 9/10 | (dihapus) |
| sd6-mat-setara-dua-desimal-pasar | i1 | 0,2 | 0,35 |
| sd6-mat-setara-dua-desimal-pasar | i2 | 20% | 35% |
| sd6-mat-setara-dua-desimal-pasar | i3 | 0,20 | 35/100 |
| sd6-mat-setara-dua-desimal-pasar | i4 | 0,6 | 0,12 |
| sd6-mat-setara-dua-desimal-pasar | i5 | 60% | 12% |
| sd6-mat-setara-dua-desimal-pasar | i6 | 0,60 | 12/100 |
| sd6-mat-setara-dua-desimal-pasar | i7 | 0,35 | 0,45 |
| sd6-mat-setara-dua-desimal-pasar | i8 | 35% | 45% |
| sd6-mat-setara-dua-desimal-pasar | i9 | 35/100 | 45/100 |
| sd6-mat-setara-dua-desimal-pasar | i10 | 0,9 | 0,15 |
| sd6-mat-setara-dua-desimal-pasar | i11 | 90% | 15% |
| sd6-mat-setara-dua-desimal-pasar | i12 | 0,90 | 6/40 |
| sd6-mat-setara-dua-desimal-pasar | i13 | 0,12 | 0,04 |
| sd6-mat-setara-dua-desimal-pasar | i14 | 12% | 4% |
| sd6-mat-setara-dua-desimal-pasar | i15 | 12/100 | 4/100 |
| sd6-mat-setara-dua-desimal-pasar | b-sembilanperduapuluh | (baru) | 9/20 |
| sd6-mat-setara-dua-desimal-pasar | b-tigaperduapuluh | (baru) | 3/20 |
| sd6-mat-setara-dua-desimal-pasar | b-satuperduapuluhlima | (baru) | 1/25 |
| sd6-mat-setara-dua-desimal | instruksi | Taruh tiap desimal, persen, atau pecahan di rak pecahan yang nilainya sama. | Teliti angka nolnya: 0,05 berbeda dengan 0,5. Taruh tiap desimal, persen, atau pecahan di rak yang nilainya sama. |
| sd6-mat-sudut-segitiga | instruksi | Jumlah sudut segitiga selalu 180°. Cari sudut yang hilang, lalu sentuh jawabannya. | Jumlah sudut segitiga selalu 180°. Pada segitiga sama kaki, dua sudut kakinya sama besar. Cari sudut yang hilang, lalu sentuh jawabannya. |
| sd6-mat-sudut-segitiga | q5 | Segitiga sama kaki punya sudut 72° dan 72°. Sudut ketiganya … | Segitiga sama kaki, satu sudut kakinya 72°. Sudut puncaknya … |
| sd6-mat-sudut-segitiga | c20 | 46° | (dihapus) |
| sd6-mat-sudut-segitiga | q9 | Segitiga sama kaki punya sudut 110° dan 35°. Sudut ketiganya … | Segitiga sama kaki, sudut puncaknya 110°. Tiap sudut kakinya … |
| sd6-mat-sudut-segitiga | q10 | Segitiga sama kaki punya sudut 25° dan 25°. Sudut ketiganya … | Segitiga sama kaki, satu sudut kakinya 25°. Sudut puncaknya … |
| sd6-mat-sudut-segitiga | c37 | (baru) | 108° |
| sd6-mat-sudut-segitiga | c38 | (baru) | 125° |
| sd6-mat-sudut-segitiga | c39 | (baru) | 155° |
| sd6-mat-uji-bagi-3-9-gudang | instruksi | Jumlahkan angka-angkanya: habis dibagi 9 → rak 9, habis dibagi 3 saja → rak 3, selain itu → rak tidak. | Jumlahkan angka-angka nomor barang, angka 0 boleh dilewati. Jumlahnya habis dibagi 9 → rak 9, habis dibagi 3 saja → rak 3, selain itu → rak tidak. |
| sd5-mat-urut-nilai-campur | s1-2 | 2/5 | 30% |
| sd5-mat-urut-nilai-campur | s1-3 | 1/2 | 0,4 |
| sd5-mat-urut-nilai-campur | s1-4 | 0,8 | 1/2 |
| sd5-mat-urut-nilai-campur | s2-2 | 0,3 | 1/4 |
| sd5-mat-urut-nilai-campur | s2-3 | 0,6 | 0,3 |
| sd5-mat-urut-nilai-campur | s2-4 | 3/4 | 60% |
| sd5-mat-urut-nilai-campur | s2-5 | 90% | 3/4 |
| sd5-mat-urut-nilai-campur | s3 | Berat lima kantong beras (kg) | Bagian lima tembok yang sudah dicat |
| sd5-mat-urut-nilai-campur | s3-1 | 0,6 | 15% |
| sd5-mat-urut-nilai-campur | s3-2 | 5,2 | 0,2 |
| sd5-mat-urut-nilai-campur | s3-3 | 7,1 | 1/4 |
| sd5-mat-urut-nilai-campur | s3-4 | 8,5 | 0,7 |
| sd5-mat-urut-nilai-campur | s3-5 | 11,5 | 4/5 |
| sd5-mat-urut-nilai-campur | s4 | Nilai lima tugas | Bagian soal benar di lima tugas |
| sd5-mat-urut-nilai-campur | s4-1 | 40% | 2/5 |
| sd5-mat-urut-nilai-campur | s4-2 | 59% | 45% |
| sd5-mat-urut-nilai-campur | s4-3 | 78% | 0,5 |
| sd5-mat-urut-nilai-campur | s4-4 | 81% | 3/5 |
| sd5-mat-urut-nilai-campur | s4-5 | 97% | 95% |
| sd5-mat-urut-nilai-campur | s5 | Panjang lima krayon (cm) | Bagian lima buku yang sudah dibaca |
| sd5-mat-urut-nilai-campur | s5-1 | 1,5 | 0,3 |
| sd5-mat-urut-nilai-campur | s5-2 | 3,3 | 1/3 |
| sd5-mat-urut-nilai-campur | s5-3 | 6,2 | 40% |
| sd5-mat-urut-nilai-campur | s5-4 | 8,6 | 0,6 |
| sd5-mat-urut-nilai-campur | s5-5 | 9 | 7/10 |
| sd5-mat-urut-nilai-campur | s6 | Tinggi lima tunas (cm) | Bagian lima kebun yang sudah dipanen |
| sd5-mat-urut-nilai-campur | s6-1 | 0,9 | 5% |
| sd5-mat-urut-nilai-campur | s6-2 | 4,6 | 0,1 |
| sd5-mat-urut-nilai-campur | s6-3 | 7,9 | 1/5 |
| sd5-mat-urut-nilai-campur | s6-4 | 9,3 | 0,5 |
| sd5-mat-urut-nilai-campur | s6-5 | 11,8 | 55% |
| sd5-mat-urut-nilai-campur | s7 | Isi lima ember | Bagian jalan yang sudah ditempuh lima anak |
| sd5-mat-urut-nilai-campur | s7-1 | 2% | 1/10 |
| sd5-mat-urut-nilai-campur | s7-2 | 42% | 0,2 |
| sd5-mat-urut-nilai-campur | s7-3 | 90% | 25% |
| sd5-mat-urut-nilai-campur | s7-4 | 92% | 1/2 |
| sd5-mat-urut-nilai-campur | s7-5 | 99% | 0,9 |
| sd5-mat-urut-nilai-campur | s8 | Kemajuan unduhan | Kemajuan lima unduhan |
| sd5-mat-urut-nilai-campur | s8-1 | 9% | 8% |
| sd5-mat-urut-nilai-campur | s8-2 | 10% | 0,1 |
| sd5-mat-urut-nilai-campur | s8-3 | 52% | 1/4 |
| sd5-mat-urut-nilai-campur | s8-4 | 61% | 52% |
| sd5-mat-urut-nilai-campur | s8-5 | 66% | 0,6 |
| sd5-mat-urut-nilai-campur | s9-1 | 0,5 | 0,8 |
| sd5-mat-urut-nilai-campur | s9-2 | 4,7 | 1 1/4 |
| sd5-mat-urut-nilai-campur | s9-3 | 6,1 | 1,5 |
| sd5-mat-urut-nilai-campur | s9-4 | 9,8 | 1 3/4 |
| sd5-mat-urut-nilai-campur | s9-5 | 10,4 | 2,1 |
| sd5-mat-urut-nilai-campur | s10 | Hasil panen lima petak | Isi baterai lima senter |
| sd5-mat-urut-nilai-campur | s10-1 | 1,1 | 1/4 |
| sd5-mat-urut-nilai-campur | s10-2 | 1,2 | 30% |
| sd5-mat-urut-nilai-campur | s10-3 | 2,8 | 0,5 |
| sd5-mat-urut-nilai-campur | s10-4 | 4 | 3/5 |
| sd5-mat-urut-nilai-campur | s10-5 | 10,1 | 85% |

## Butuh fitur baru

| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| (tidak ada) | | | |

## Tidak dikerjakan

| butir | alasan |
|---|---|
| (tidak ada) | Semua butir sudah dikerjakan. Paket dagang SD5 (kembalian) tidak memakai knob `harga`, jadi aturan harga per tingkat tidak berlaku |
