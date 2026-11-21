# QA putaran 3 — SD4 (MAT, SAINS, KODE)

Cakupan: 96 paket (MAT 40, SAINS 34, KODE 22). Saya menghitung ulang kunci setiap soal pilih, menempatkan ulang setiap item ke raknya, dan memeriksa setiap urutan susun/perbaiki. Hasilnya: tidak ada kunci, hitungan, atau penempatan rak yang salah. Ini mencakup nilai tempat, pembulatan, perkalian, soal cerita (termasuk pembulatan ke atas), genap/ganjil, barisan, pecahan senilai/urut, jam 12↔24, durasi, sudut, keliling/luas, simetri, Carroll, peluang, trace variabel/ulangi, pencarian linear, rangkaian seri, rantai makanan, dan planet.
Validasi: `akademi:validate` → 810 paket valid; `akademi:audit` → ERROR 0, WARNING 0.

## 1. Temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| tidak-sesuai | sd4-mat-urut-suhu-di-bawah-nol | s10 (judul urutan) | "Percobaan es dan garam" berisi −30°C. Campuran es + garam dapur hanya sampai sekitar −21°C, jadi −30°C mustahil dicapai dengan cara itu. | diperbaiki: "Lima ruang pendingin" / "Five cold rooms" (versi 1.0.2 → 1.0.3) |
| tidak-sesuai | sd4-mat-urut-suhu-stasiun-cuaca | s5 (judul urutan) | "Gudang es krim" berisi 9°C dan 14°C. Es krim di gudang bersuhu itu akan meleleh. Kasusnya sejenis dengan judul suhu yang sudah dinetralkan di audit QC. | diperbaiki: "Ruangan di pabrik es krim" / "Rooms in an ice cream factory" |
| tidak-sesuai | sd4-mat-urut-suhu-stasiun-cuaca | s7 (judul urutan) | "Laboratorium pendingin" berisi 15°C. | diperbaiki: "Ruangan di laboratorium" / "Rooms in a laboratory" |
| tidak-sesuai | sd4-mat-urut-suhu-stasiun-cuaca | s10 (judul urutan) | "Kapal di laut kutub" berisi 8°C dan 15°C, tidak masuk akal untuk laut kutub. | diperbaiki: "Kapal berlayar ke kutub" / "A ship sailing to the pole" (versi 1.0.2 → 1.0.3) |
| visual | sd4-sains-makanan-hewan-sungai | items[gagak].emoji | 🐦‍⬛ adalah emoji gabungan (ZWJ). Di perangkat lama ia tampil sebagai 🐦 + ⬛. Masalah yang sama sudah diperbaiki di PAUD (sains-suara-siapa-di-kebun). | diperbaiki: 🐦 (label "burung gagak" tetap; di paket ini tidak ada 🐦 lain) (versi 1.0.0 → 1.0.1) |
| visual | sd4-sains-otot-berpasangan | biseps/trisep/ototmenarik | Tiga kartu memakai 💪 yang sama. | ditolak: labelnya berbeda dan dibaca (SD4 berlabel). Preseden keputusan owner untuk emoji kembar LISTRIK.01: biarkan. Lihat "Butuh kode" soal warna pembeda. |
| visual | sd4-kode-perangkat-masuk-keluar | i10 vs i14 | 🎧 dipakai untuk "headphone tanpa mikrofon" (keluaran) dan "headset bermikrofon" (keduanya). | ditolak: ini jebakan yang sengaja ada di catatan kompetensi PERANGKAT.01, jadi label yang membedakan |
| visual | sd4-mat-urut-suhu-stasiun-cuaca | s2 "Puncak bersalju" (9°C, 10°C), s6 "Pagi musim dingin" (−22…11°C) | Konteksnya agak longgar. | ditolak: judul EN jamak ("Snowy peaks", "Winter mornings") sehingga beberapa tempat/hari masih masuk akal; tidak mustahil |
| ambigu | sd4-kode-rahasia-di-taman | i1 "tokoh kartun favoritmu" | Ada kata "tokoh". | ditolak: koordinator audit-ambigu memutuskan "dibiarkan" (log-10). Dicatat di Keputusan karena brief putaran ini melarang "tokoh". |
| ambigu | sd4-sains-putaran-bumi-pantai | instruksi "Seharian di pantai…" | Dua ronde bola bumi + senter tidak terjadi di pantai. | ditolak: instruksi ini sudah ditulis ulang di audit-ambigu (log-07), dan sebagian besar ronde memang di pantai |

## 2. Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd4-mat-urut-suhu-di-bawah-nol | s10 | Percobaan es dan garam | Lima ruang pendingin |
| sd4-mat-urut-suhu-stasiun-cuaca | s5 | Gudang es krim | Ruangan di pabrik es krim |
| sd4-mat-urut-suhu-stasiun-cuaca | s7 | Laboratorium pendingin | Ruangan di laboratorium |
| sd4-mat-urut-suhu-stasiun-cuaca | s10 | Kapal di laut kutub | Kapal berlayar ke kutub |

(Ganti emoji gagak tidak mengubah teks.)

## 3. Butuh kode

- `color` pada emoji yang hanya muncul dengan satu warna di paket tidak digambar (lihat `emojiBedaWarna` di benda.tsx: latar warna hanya muncul bila emoji yang sama tampil dengan ≥ 2 warna). Akibatnya `color=#ffe0b2` pada trisep dan belakangpaha di sd4-sains-otot-tarik-ulur tidak terlihat: biseps dan triseps tetap 💪 yang sama persis. Supaya warna pembeda terlihat, perlu field `latar` di skema paket, atau aturan latar diubah supaya juga berlaku untuk emoji yang sama dengan dan tanpa warna.

## 4. Keputusan

- Brief putaran 3 melarang "tokoh", sedangkan keputusan audit-ambigu membiarkan "tokoh kartun favoritmu" di sd4-kode-rahasia-di-taman (i1). Owner perlu memilih: tetap, atau ganti "karakter kartun favoritmu" / "favourite cartoon character" (mengubah satu kalimat suara).

## 5. Angka

- Paket diperiksa: 96 (MAT 40, SAINS 34, KODE 22)
- Temuan: 10
- Diperbaiki: 5 (di 3 paket)
- Ditolak: 5 (1 di antaranya dicatat juga di Keputusan)
