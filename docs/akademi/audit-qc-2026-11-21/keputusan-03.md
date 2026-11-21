# Keputusan 03 — MAT SD3–SD4

Validasi skema: 810 paket valid. Audit: ERROR 0; tidak ada temuan (ERROR/WARNING) untuk paket atau kompetensi MAT SD3/SD4. Sisa WARNING (2 harga-barang-tak-cocok, 1 instruksi-kembar, 1 instruksi-terlalu-panjang) milik kelompok lain.

## Keputusan yang diambil
| butir | keputusan | perubahan |
|---|---|---|
| sd3-mat-jadwal-tertukar (MAT.SD3.WAKTU.01): jam 12 vs jam 24 | Opsi (a): pakai jam 24, sama dengan paket kembaran sd3-mat-urut-jadwal-digital dan jadwal sekolah di Indonesia. SD4 WAKTU.01 tetap mengajarkan konversi 12 ↔ 24 jam. | Paket 1.0.0 → 1.0.1: s11–s15, s26–s30, s46–s50, s56–s60 (ID/EN) ditambah 12 jam (mis. "01.30 makan siang" → "13.30 makan siang"). Instruksi ID/EN menambah "Ingat: 13.05 sesudah 12.50." Catatan kurikulum WAKTU.01 ditulis ulang (jam 24, jebakan 13.10 vs 12.50; kalimat "pagi dan siang tidak dicampur" dihapus). |
| sd3-mat-segi-banyak-beraturan: emoji 🔷/🔶 untuk belah ketupat | Gambar yang menyesatkan dibuang sekarang; bentuk belah ketupat dicatat di "Butuh fitur baru". | Item `ketupat` tanpa emoji (label saja). Item `ketupat-kecil` dihapus (duplikat yang hanya berbeda gambar; sisa 12 item ≥ itemCount max 9). Versi 1.0.1 → 1.0.2. |
| sd3-mat-kotak-tersembunyi (MAT.SD3.TAMBAH-KURANG-1000.03): bilangan hanya sampai 25 | Tulis ulang ke ratusan sampai 1.000 sesuai unit. | 10 rak baru (150, 240, 280, 350, 380, 420, 460, 530, 610, 750), masing-masing 4 kartu: □+a=b, a+□=b, c−□=d, □−e=f (mis. □+250=400, 600−□=450, □−80=70, 1.000−□=650). Semua bilangan dicek otomatis. Instruksi ID/EN baru. Pernyataan kompetensi: contoh jadi "□ + 250 = 600" dan "sampai 1.000"; catatan diperbarui. Versi 1.0.0 → 1.0.1. |
| MAT.SD4.TAMBAH-KURANG.01: kembar dengan SD3 UANG.01, teks Rp50.000/100.000 tidak cocok dengan mesin | Bedakan kedalaman: SD4 = belanja 2–3 barang (dua jenis), total Rp21.000–Rp99.000, sehingga mesin (selembar uang terkecil yang lebih besar dari total) SELALU membayar 50 ribu atau 100 ribu. SD3 tetap 1–2 barang dibayar 10–100 ribu. | Kurikulum SD4: pernyataan "Aku bisa memberi kembalian yang tepat dari Rp50.000 atau Rp100.000 untuk belanja dua atau tiga barang" (EN sepadan); catatan menjelaskan perilaku mesin dan beda dengan SD3. sd4-mat-kembalian-toko-buku & -toko-mainan: knob itemsMax 2 → 3 (default 2), customerRule itemsMin 2/itemsMax 3/kindsMax 2/maxTotal 99.000; harga barang diatur ulang 9.000–48.000 sehingga dua barang termurah > Rp20.000 dan dua termahal ≤ Rp99.000; instruksi ID/EN "…membayar dengan selembar uang 50 ribu atau 100 ribu…". Toko buku: "tas sekolah" (96.000, terlalu mahal untuk dipasangkan) → 📓 "buku tulis" 13.000 (id/labelKey `tulis`). Simulasi 3.000 ronde/knob: dibayar hanya 50.000/100.000; total 21.000–99.000; kembalian maks 50.000. Paket tidak memakai knob `harga`, jadi harga ronde = jumlah `price` barang (setiap tingkat bayar 50/100 ribu punya ≥4 barang/pasangan). Versi 1.0.1 → 1.0.2. |
| sd4-mat-rak-hasil-kali vs sd3-mat-tabel-*: kemajuan tipis | Isi SD4 hanya rak yang punya DUA fakta berbeda (bukan sekadar tukar urutan), sesuai pernyataan KALI-BAGI.01. | Rak 16, 18, 24, 30, 36, 40 (h48 yang hanya 6 × 8 dibuang, h16 masuk); tiap rak 3–4 kartu (2 × 9, 3 × 6, 9 × 2, 6 × 3 …), 22 kartu. Instruksi ID/EN: "Tiap rak punya dua perkalian berbeda yang hasilnya sama, misalnya 3 × 8 dan 4 × 6." Versi 1.0.0 → 1.0.1. Tabel 7 tidak ditambahkan: fakta tabel 7 (1–10) tidak punya pasangan berbeda berhasil sama, jadi tidak melatih kompetensi ini (tabel 7 sudah ada di sd4-mat-rak-hasil-kali-besar). |
| Instruksi kembar sd3-mat-tabel-tiga-empat vs sd3-mat-tabel-enam-delapan-sembilan | Dibedakan sesuai isi. | Tiga-empat: "Kartu ini memakai tabel 3 dan 4. Ingat: 3 × 7 sama dengan 7 × 3. …"; enam-delapan-sembilan: "Kartu ini memakai tabel 6, 8, dan 9. Ingat: 6 × 9 sama dengan 9 × 6, dan 8 × 8 tidak punya pasangan tukar. …" (EN sepadan). Versi 1.0.0 → 1.0.1. |
| Instruksi kembar sd4-mat-urut-suhu-di-bawah-nol vs sd4-mat-urut-suhu-stasiun-cuaca | Dibedakan sesuai isi (yang kedua berisi suhu minus berdekatan seperti −23/−21/−20). | Di-bawah-nol: "Suhu di bawah nol lebih dingin dari 0°C. Makin besar angka sesudah tanda minus, makin dingin. …"; stasiun-cuaca: "Catatan stasiun cuaca punya suhu minus yang berdekatan. −23°C lebih dingin dari −20°C. …" (EN sepadan). Versi 1.0.1 → 1.0.2. |

Teks kurikulum yang berubah (bukan locale paket, tapi bisa tampil/dibacakan di rapor): MAT.SD3.TAMBAH-KURANG-1000.03 statement ID "Aku bisa menemukan bilangan yang disembunyikan kotak dalam kalimat tambah atau kurang sampai 1.000, misalnya □ + 250 = 600"; MAT.SD4.TAMBAH-KURANG.01 statement ID "Aku bisa memberi kembalian yang tepat dari Rp50.000 atau Rp100.000 untuk belanja dua atau tiga barang". Catatan MAT.SD3.WAKTU.01 juga berubah.

## Kalimat suara berubah
| paket | kunci | lama | baru |
|---|---|---|---|
| sd3-mat-jadwal-tertukar | instruksi | Dua kegiatan dalam jadwal tertukar. Bandingkan jamnya dulu, lalu menitnya. Tukar keduanya supaya urut dari yang paling awal. | Dua kegiatan dalam jadwal tertukar. Bandingkan jamnya dulu, lalu menitnya. Ingat: 13.05 sesudah 12.50. Tukar keduanya supaya urut dari yang paling awal. |
| sd3-mat-jadwal-tertukar | s11 | 02.10 pemanasan | 14.10 pemanasan |
| sd3-mat-jadwal-tertukar | s12 | 02.25 latihan menendang | 14.25 latihan menendang |
| sd3-mat-jadwal-tertukar | s13 | 02.55 istirahat minum | 14.55 istirahat minum |
| sd3-mat-jadwal-tertukar | s14 | 03.05 pertandingan kecil | 15.05 pertandingan kecil |
| sd3-mat-jadwal-tertukar | s15 | 03.50 beres-beres | 15.50 beres-beres |
| sd3-mat-jadwal-tertukar | s26 | 01.30 makan siang | 13.30 makan siang |
| sd3-mat-jadwal-tertukar | s27 | 02.00 tidur siang | 14.00 tidur siang |
| sd3-mat-jadwal-tertukar | s28 | 03.15 mengerjakan PR | 15.15 mengerjakan PR |
| sd3-mat-jadwal-tertukar | s29 | 04.10 bermain di luar | 16.10 bermain di luar |
| sd3-mat-jadwal-tertukar | s30 | 05.30 mandi sore | 17.30 mandi sore |
| sd3-mat-jadwal-tertukar | s46 | 03.05 setel gitar | 15.05 setel gitar |
| sd3-mat-jadwal-tertukar | s47 | 03.20 latihan kunci | 15.20 latihan kunci |
| sd3-mat-jadwal-tertukar | s48 | 03.45 belajar lagu | 15.45 belajar lagu |
| sd3-mat-jadwal-tertukar | s49 | 04.15 tampil di depan | 16.15 tampil di depan |
| sd3-mat-jadwal-tertukar | s50 | 04.30 selesai | 16.30 selesai |
| sd3-mat-jadwal-tertukar | s56 | 01.05 ganti baju | 13.05 ganti baju |
| sd3-mat-jadwal-tertukar | s57 | 01.20 pemanasan | 13.20 pemanasan |
| sd3-mat-jadwal-tertukar | s58 | 01.50 lomba lari | 13.50 lomba lari |
| sd3-mat-jadwal-tertukar | s59 | 02.15 pembagian hadiah | 14.15 pembagian hadiah |
| sd3-mat-jadwal-tertukar | s60 | 02.40 foto bersama | 14.40 foto bersama |
| sd3-mat-segi-banyak-beraturan | i-belah-ketupat-kecil | belah ketupat kecil | (dihapus) |
| sd3-mat-kotak-tersembunyi | instruksi | Kotak menyembunyikan satu bilangan. Cari bilangannya, lalu taruh kartu di rak itu. | Kotak menyembunyikan satu bilangan ratusan. Pakai pasangan tambah dan kurang untuk mencarinya, lalu taruh kartu di rak bilangan itu. |
| sd3-mat-kotak-tersembunyi | b-6 | 6 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-7 | 7 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-8 | 8 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-9 | 9 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-12 | 12 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-13 | 13 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-14 | 14 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-15 | 15 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-16 | 16 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-18 | 18 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp9s15 | □+9=15 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-9pkotaks15 | 9+□=15 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-12mkotaks6 | 12−□=6 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm5s1 | □−5=1 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp9s16 | □+9=16 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-9pkotaks16 | 9+□=16 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-10mkotaks3 | 10−□=3 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm3s4 | □−3=4 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp3s11 | □+3=11 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-3pkotaks11 | 3+□=11 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-14mkotaks6 | 14−□=6 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm6s2 | □−6=2 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp6s15 | □+6=15 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-6pkotaks15 | 6+□=15 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-17mkotaks8 | 17−□=8 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm8s1 | □−8=1 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp7s19 | □+7=19 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-7pkotaks19 | 7+□=19 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-19mkotaks7 | 19−□=7 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm7s5 | □−7=5 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp4s17 | □+4=17 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-4pkotaks17 | 4+□=17 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-18mkotaks5 | 18−□=5 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm5s8 | □−5=8 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp5s19 | □+5=19 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-5pkotaks19 | 5+□=19 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-23mkotaks9 | 23−□=9 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm9s5 | □−9=5 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp3s18 | □+3=18 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-3pkotaks18 | 3+□=18 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-20mkotaks5 | 20−□=5 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm5s10 | □−5=10 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp7s23 | □+7=23 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-7pkotaks23 | 7+□=23 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-25mkotaks9 | 25−□=9 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm9s7 | □−9=7 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakp3s21 | □+3=21 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-3pkotaks21 | 3+□=21 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-21mkotaks3 | 21−□=3 | (dihapus) |
| sd3-mat-kotak-tersembunyi | i-kotakm3s15 | □−3=15 | (dihapus) |
| sd3-mat-kotak-tersembunyi | b-150 | (baru) | 150 |
| sd3-mat-kotak-tersembunyi | i-kotakp250s400 | (baru) | □+250=400 |
| sd3-mat-kotak-tersembunyi | i-250pkotaks400 | (baru) | 250+□=400 |
| sd3-mat-kotak-tersembunyi | i-600mkotaks450 | (baru) | 600−□=450 |
| sd3-mat-kotak-tersembunyi | i-kotakm80s70 | (baru) | □−80=70 |
| sd3-mat-kotak-tersembunyi | b-240 | (baru) | 240 |
| sd3-mat-kotak-tersembunyi | i-kotakp360s600 | (baru) | □+360=600 |
| sd3-mat-kotak-tersembunyi | i-360pkotaks600 | (baru) | 360+□=600 |
| sd3-mat-kotak-tersembunyi | i-900mkotaks660 | (baru) | 900−□=660 |
| sd3-mat-kotak-tersembunyi | i-kotakm150s90 | (baru) | □−150=90 |
| sd3-mat-kotak-tersembunyi | b-280 | (baru) | 280 |
| sd3-mat-kotak-tersembunyi | i-kotakp420s700 | (baru) | □+420=700 |
| sd3-mat-kotak-tersembunyi | i-420pkotaks700 | (baru) | 420+□=700 |
| sd3-mat-kotak-tersembunyi | i-500mkotaks220 | (baru) | 500−□=220 |
| sd3-mat-kotak-tersembunyi | i-kotakm90s190 | (baru) | □−90=190 |
| sd3-mat-kotak-tersembunyi | b-350 | (baru) | 350 |
| sd3-mat-kotak-tersembunyi | i-kotakp450s800 | (baru) | □+450=800 |
| sd3-mat-kotak-tersembunyi | i-450pkotaks800 | (baru) | 450+□=800 |
| sd3-mat-kotak-tersembunyi | i-1000mkotaks650 | (baru) | 1.000−□=650 |
| sd3-mat-kotak-tersembunyi | i-kotakm200s150 | (baru) | □−200=150 |
| sd3-mat-kotak-tersembunyi | b-380 | (baru) | 380 |
| sd3-mat-kotak-tersembunyi | i-kotakp520s900 | (baru) | □+520=900 |
| sd3-mat-kotak-tersembunyi | i-520pkotaks900 | (baru) | 520+□=900 |
| sd3-mat-kotak-tersembunyi | i-640mkotaks260 | (baru) | 640−□=260 |
| sd3-mat-kotak-tersembunyi | i-kotakm180s200 | (baru) | □−180=200 |
| sd3-mat-kotak-tersembunyi | b-420 | (baru) | 420 |
| sd3-mat-kotak-tersembunyi | i-kotakp180s600 | (baru) | □+180=600 |
| sd3-mat-kotak-tersembunyi | i-180pkotaks600 | (baru) | 180+□=600 |
| sd3-mat-kotak-tersembunyi | i-700mkotaks280 | (baru) | 700−□=280 |
| sd3-mat-kotak-tersembunyi | i-kotakm320s100 | (baru) | □−320=100 |
| sd3-mat-kotak-tersembunyi | b-460 | (baru) | 460 |
| sd3-mat-kotak-tersembunyi | i-kotakp340s800 | (baru) | □+340=800 |
| sd3-mat-kotak-tersembunyi | i-340pkotaks800 | (baru) | 340+□=800 |
| sd3-mat-kotak-tersembunyi | i-900mkotaks440 | (baru) | 900−□=440 |
| sd3-mat-kotak-tersembunyi | i-kotakm260s200 | (baru) | □−260=200 |
| sd3-mat-kotak-tersembunyi | b-530 | (baru) | 530 |
| sd3-mat-kotak-tersembunyi | i-kotakp270s800 | (baru) | □+270=800 |
| sd3-mat-kotak-tersembunyi | i-270pkotaks800 | (baru) | 270+□=800 |
| sd3-mat-kotak-tersembunyi | i-1000mkotaks470 | (baru) | 1.000−□=470 |
| sd3-mat-kotak-tersembunyi | i-kotakm130s400 | (baru) | □−130=400 |
| sd3-mat-kotak-tersembunyi | b-610 | (baru) | 610 |
| sd3-mat-kotak-tersembunyi | i-kotakp190s800 | (baru) | □+190=800 |
| sd3-mat-kotak-tersembunyi | i-190pkotaks800 | (baru) | 190+□=800 |
| sd3-mat-kotak-tersembunyi | i-850mkotaks240 | (baru) | 850−□=240 |
| sd3-mat-kotak-tersembunyi | i-kotakm410s200 | (baru) | □−410=200 |
| sd3-mat-kotak-tersembunyi | b-750 | (baru) | 750 |
| sd3-mat-kotak-tersembunyi | i-kotakp150s900 | (baru) | □+150=900 |
| sd3-mat-kotak-tersembunyi | i-150pkotaks900 | (baru) | 150+□=900 |
| sd3-mat-kotak-tersembunyi | i-1000mkotaks250 | (baru) | 1.000−□=250 |
| sd3-mat-kotak-tersembunyi | i-kotakm350s400 | (baru) | □−350=400 |
| sd4-mat-kembalian-toko-buku | instruksi | Pembeli membayar dengan selembar uang yang cukup. Berikan kembalian yang pas. | Pembeli membeli dua atau tiga barang dan membayar dengan selembar uang 50 ribu atau 100 ribu. Lihat total harganya, lalu berikan kembalian yang pas. |
| sd4-mat-kembalian-toko-buku | tas | tas sekolah | (dihapus) |
| sd4-mat-kembalian-toko-buku | tulis | (baru) | buku tulis |
| sd4-mat-kembalian-toko-mainan | instruksi | Pembeli membayar dengan selembar uang yang cukup. Hitung maju dari harga sampai uang pembeli, lalu beri kembaliannya. | Pembeli membeli dua atau tiga mainan dan membayar dengan selembar uang 50 ribu atau 100 ribu. Hitung maju dari total harga sampai uang pembeli, lalu beri kembaliannya. |
| sd4-mat-rak-hasil-kali | instruksi | Taruh tiap kartu perkalian di rak hasilnya. Satu rak bisa berisi beberapa perkalian. | Tiap rak punya dua perkalian berbeda yang hasilnya sama, misalnya 3 × 8 dan 4 × 6. Taruh tiap kartu di rak hasilnya. |
| sd4-mat-rak-hasil-kali | b-h18 | 18 | (dihapus) |
| sd4-mat-rak-hasil-kali | b-h24 | 24 | (dihapus) |
| sd4-mat-rak-hasil-kali | b-h30 | 30 | (dihapus) |
| sd4-mat-rak-hasil-kali | b-h36 | 36 | (dihapus) |
| sd4-mat-rak-hasil-kali | b-h40 | 40 | (dihapus) |
| sd4-mat-rak-hasil-kali | b-h48 | 48 | (dihapus) |
| sd4-mat-rak-hasil-kali | b-18 | (baru) | 18 |
| sd4-mat-rak-hasil-kali | i-2x9 | (baru) | 2 × 9 |
| sd4-mat-rak-hasil-kali | i-9x2 | (baru) | 9 × 2 |
| sd4-mat-rak-hasil-kali | i-3x6 | (baru) | 3 × 6 |
| sd4-mat-rak-hasil-kali | i-6x3 | (baru) | 6 × 3 |
| sd4-mat-rak-hasil-kali | b-24 | (baru) | 24 |
| sd4-mat-rak-hasil-kali | i-3x8 | (baru) | 3 × 8 |
| sd4-mat-rak-hasil-kali | i-8x3 | (baru) | 8 × 3 |
| sd4-mat-rak-hasil-kali | i-4x6 | (baru) | 4 × 6 |
| sd4-mat-rak-hasil-kali | i-6x4 | (baru) | 6 × 4 |
| sd4-mat-rak-hasil-kali | b-30 | (baru) | 30 |
| sd4-mat-rak-hasil-kali | i-5x6 | (baru) | 5 × 6 |
| sd4-mat-rak-hasil-kali | i-6x5 | (baru) | 6 × 5 |
| sd4-mat-rak-hasil-kali | i-3x10 | (baru) | 3 × 10 |
| sd4-mat-rak-hasil-kali | i-10x3 | (baru) | 10 × 3 |
| sd4-mat-rak-hasil-kali | b-36 | (baru) | 36 |
| sd4-mat-rak-hasil-kali | i-4x9 | (baru) | 4 × 9 |
| sd4-mat-rak-hasil-kali | i-9x4 | (baru) | 9 × 4 |
| sd4-mat-rak-hasil-kali | i-6x6 | (baru) | 6 × 6 |
| sd4-mat-rak-hasil-kali | b-40 | (baru) | 40 |
| sd4-mat-rak-hasil-kali | i-5x8 | (baru) | 5 × 8 |
| sd4-mat-rak-hasil-kali | i-8x5 | (baru) | 8 × 5 |
| sd4-mat-rak-hasil-kali | i-4x10 | (baru) | 4 × 10 |
| sd4-mat-rak-hasil-kali | i-10x4 | (baru) | 10 × 4 |
| sd4-mat-rak-hasil-kali | b-16 | (baru) | 16 |
| sd4-mat-rak-hasil-kali | i-2x8 | (baru) | 2 × 8 |
| sd4-mat-rak-hasil-kali | i-8x2 | (baru) | 8 × 2 |
| sd4-mat-rak-hasil-kali | i-4x4 | (baru) | 4 × 4 |
| sd3-mat-tabel-tiga-empat | instruksi | Ingat: 6 × 4 sama dengan 4 × 6. Taruh tiap kartu perkalian di rak hasilnya. | Kartu ini memakai tabel 3 dan 4. Ingat: 3 × 7 sama dengan 7 × 3. Taruh tiap kartu di rak hasilnya. |
| sd3-mat-tabel-enam-delapan-sembilan | instruksi | Ingat: 6 × 4 sama dengan 4 × 6. Taruh tiap kartu perkalian di rak hasilnya. | Kartu ini memakai tabel 6, 8, dan 9. Ingat: 6 × 9 sama dengan 9 × 6, dan 8 × 8 tidak punya pasangan tukar. Taruh tiap kartu di rak hasilnya. |
| sd4-mat-urut-suhu-di-bawah-nol | instruksi | Susun kartu suhu dari yang paling dingin sampai yang paling hangat. | Suhu di bawah nol lebih dingin dari 0°C. Makin besar angka sesudah tanda minus, makin dingin. Susun dari yang paling dingin sampai yang paling hangat. |
| sd4-mat-urut-suhu-stasiun-cuaca | instruksi | Susun kartu suhu dari yang paling dingin sampai yang paling hangat. | Catatan stasiun cuaca punya suhu minus yang berdekatan. −23°C lebih dingin dari −20°C. Susun dari yang paling dingin sampai yang paling hangat. |

## Butuh fitur baru
| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| sd3-mat-segi-banyak-beraturan | item `ketupat` (label "belah ketupat") | shape `belah-ketupat` | `"shape": "belah-ketupat", "color": "#6ab0e8"` dengan sudut jelas tidak siku (mis. 60°/120°) supaya tidak tampak seperti persegi diputar; boleh menambah lagi item kedua (belah ketupat lain warna/ukuran) |
| sd4-mat-kembalian-toko-buku, sd4-mat-kembalian-toko-mainan (dan sd3-mat-kembalian-toko-kue) | mode kembalian | presenter menampilkan harga satuan tiap barang (bukan hanya total) | Supaya anak benar-benar menjumlahkan 2–3 barang sebelum menghitung kembalian (kedalaman SD4). Saat ini balon hanya menampilkan total `ronde.harga`; usul opsi paket mis. `"tampilHarga": "satuan"` yang menampilkan "📕 Rp23.000 × 2, 📗 Rp18.000" dan menyembunyikan total. Catatan: instruksi sd3-mat-kembalian-toko-kue ("Jumlahkan harganya") juga mengandaikan fitur ini. |

## Tidak dikerjakan
| butir | alasan |
|---|---|
| (tidak ada) | Semua butir keputusan kelompok MAT SD3–SD4 dikerjakan. Belah ketupat hanya sebagian (emoji dibuang); gambar menunggu shape baru, lihat "Butuh fitur baru". |
