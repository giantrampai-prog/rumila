# Revisi geometri laut dan orbit — 28 September 2026

Revisi menanggapi screenshot lamun berbentuk pita lurus, cumi berlengan silinder,
lionfish tanpa sirip lebar, serta aurora berbentuk blok dan satelit sederhana.

## Perubahan

- Lamun: daun 3D melengkung dan berurat, ujung menyempit, variasi tinggi dan
  warna, rumpun berisi sembilan daun, ayunan arus dan respons terhadap biota.
  7.200 daun memakai satu instanced mesh (604.800 segitiga); culling diberi
  ruang untuk perpindahan daun dalam shader.
- Cumi: mantel meruncing, dua sirip, sifon, delapan lengan dan dua tentakel
  penangkap yang lebih panjang. Pengisap mengikuti lengkungan lengan dan
  deformasi arus yang sama. Pigmentasi kulit dibuat prosedural.
- Lionfish: dua kipas sirip dada, jari sirip, 13 duri punggung, rumbai dan
  pola krem-cokelat. Kuda laut: badan melengkung, ekor menggulung, moncong,
  mahkota, lempeng kulit serta sirip kecil yang bergetar.
- Kamera inspeksi menahan arah renang biota yang sedang dipilih, sementara
  sirip/tentakel tetap bergerak dan pengguna dapat mengorbitkan kamera.
  Framing cumi, lionfish dan kuda laut menyesuaikan layar potret.
- Aurora: tiga lembar geometri terlipat dengan serat cahaya vertikal dan
  tepi memudar. Kamera termosfer langsung menghadap tirai.
- Satelit: bus berlapis insulasi, panel bersel, sambungan, radiator, instrumen,
  reflektor parabola serta antena. Satelit ilustratif ditempatkan sekitar
  650 km, dengan sudut eksosfer menghadap ke satelit.

Model tetap merupakan ilustrasi edukasi prosedural, bukan hasil pemindaian
spesimen. Skala antarbenda dan jarak antarzona tetap disederhanakan.
Rekaman Algenib dan seluruh timestamp narasi laut tidak diubah.

## Acuan bentuk

- MBARI, delapan lengan dan dua tentakel penangkap pada sebagian besar cumi:
  https://www.mbari.org/news/a-deep-sea-squid-with-tentacle-tips-that-swim-on-their-own/
- NOAA, identifikasi lionfish dan sirip/duri:
  https://media.fisheries.noaa.gov/dam-migration/lionfish_factsheet.pdf
- NASA, aurora dan bentuk tirai cahaya:
  https://science.nasa.gov/sun/auroras/
  https://science.nasa.gov/earth/earth-observatory/auroras-dancing-in-the-night/

## Verifikasi

`npm test`: 210 pengujian lulus (28 berkas), termasuk normal permukaan,
penutup ujung, jumlah lengan/tentakel, geometri animasi finite, ukuran dan
anggaran mesh, variasi lamun, tirai aurora serta material satelit.

`RUMILA_DIST_DIR=.next-fruits-build npm run build`: lulus, termasuk TypeScript
dan lint. Pemeriksaan browser dilakukan pada detail laut dan orbit, serta
viewport potret 390 × 844. Bukti visual lokal disimpan di `output/laut/`.
Pemeriksaan viewport bukan pengujian performa pada perangkat ponsel fisik.
