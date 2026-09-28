# Lingkungan Roket 3D

Pembaruan 28 September 2026 untuk `/roket`. Pratinjau development tanpa login: `/dev/roket` (rute ini tidak tersedia di production).

## Perubahan visual

- Hutan tropis dengan variasi tajuk, batang bercabang, akar, tekstur kulit kayu, semak, dan bilah rumput. Daun mengikuti gerak angin, termasuk pada bayangannya.
- Pohon kelapa memakai pelepah melengkung, detail anak daun, batang miring, dan buah kelapa.
- Pantai berpasir, area pasir basah, batu kapur, dan dasar laut yang tersambung dengan garis pantai.
- Air memakai lima gelombang berpotongan, pantulan langit, kilau matahari, variasi kedalaman, dan buih bergerak di tepi pantai.
- Gedung mendapat rusuk panel, bingkai jendela, kaca, ventilasi, kanopi, serta detail atap. Tangki mendapat tangga inspeksi, katup, sambungan, dan penyangga.
- Roket mendapat geometri silinder yang lebih halus, tekstur lebih rinci, sambungan panel, serta jalur kabel. Jembatan kru mendapat pagar, jendela inspeksi, dan lis panel.
- Cahaya, bayangan, kabut jauh, dan warna material disesuaikan. Tombol Landasan, Pesisir, dan Hutan menyediakan sudut pandang dekat.

## Aset yang dibuat khusus

Seluruh lima tekstur baru dibuat menggunakan **tool GPT Image bawaan**, lalu dikonversi ke WebP dengan alpha tetap dipertahankan. Tidak mengambil foto stok dari internet. Prompt persis dan lokasi sumber tercatat pada [environment-image-prompts.json](./environment-image-prompts.json).

Lokasi aset: [`public/roket/textures/`](../../public/roket/textures/).

| Aset | Ukuran | Pemakaian |
| --- | --- | --- |
| `tropical-leaves.webp` | 1254 × 1254, alpha | Daun pada geometri lipatan tajuk |
| `coconut-frond.webp` | 1024 × 1536, alpha | Pelepah pada permukaan 3D melengkung |
| `bark-albedo.webp` | 1254 × 1254 | Warna dan bump kulit batang |
| `grass-albedo.webp` | 1254 × 1254 | Permukaan rumput pada medan 3D |
| `cumulus.webp` | 1536 × 1024, alpha | Awan jauh |

Total unduhan lima aset: **2.80 MB** sebelum kompresi HTTP. Geometri dunia dibangun di aplikasi; awan jauh dan lembar daun menggunakan tekstur alpha. Ini adalah lingkungan WebGL prosedural dengan material bergambar, bukan hasil pemindaian lokasi atau render path tracing.

## Performa dan arsitektur

`terrain-math.ts` menjadi sumber posisi permukaan untuk objek, vegetasi, dan pantai. Formula garis pantai yang sama dipakai shader laut. `vegetation.ts`, `ocean.ts`, `surface-materials.ts`, dan `facility.ts` memisahkan tanggung jawab dari scene utama.

Vegetasi memakai geometri bersama dan instancing dalam petak 48 unit sehingga petak di luar kamera dapat diabaikan renderer. Hutan jauh memakai tajuk yang lebih ringan dan tidak menghitung bayangan lokal. Perangkat dengan maksimal empat thread CPU atau viewport maksimal 700 px menggunakan jumlah objek dan kepadatan geometri lebih rendah; DPR dibatasi 1.5, dibandingkan 2 untuk desktop. Peta bayangan diperbarui berkala. Geometri, instancing, material, dan tekstur dilepas saat scene ditutup.

## Verifikasi

- ESLint untuk `src/components/roket`: lulus.
- TypeScript untuk seluruh `src`: lulus dengan konfigurasi QA tanpa cache tipe Next.js lama.
- Empat pengujian Vitest: kesinambungan garis pantai, landasan rata, area bebas vegetasi, dan dasar laut di bawah air.
- Build production seluruh aplikasi: lulus, 47 halaman. Build dilakukan pada salinan sementara sumber terkini agar cache `.next-*` lokal dari rute lama tidak ikut diperiksa.
- Pemeriksaan browser: Landasan, Pesisir, Hutan, pilihan bagian roket, serta masuk/jeda/lanjut mode misi, kamera kabin, dan roket saat terbang. Layout ponsel diperiksa pada viewport 390 × 844; ini bukan pengujian pada perangkat ponsel fisik.
- Console browser setelah pemuatan bersih: tidak ada error atau warning yang teramati.

Catatan verifikasi di atas merekam tahap pengembangan lokal. Penggabungan dengan pembaruan GitHub mempertahankan panorama langit, detail hutan pegunungan, suara mesin, dan batas kamera di atas tanah.
