# Gambar buah khusus Rumila

## Sumber dan format

Seluruh 48 gambar dibuat dengan tool GPT Image bawaan (`image_gen.imagegen`) pada 26 September 2026. Satu generasi untuk setiap jenis buah; tidak ada gambar internet yang dipakai sebagai input atau aset katalog.

- Prompt bersama dan 48 subjek: `gpt-image-prompts.json`.
- Asli PNG persegi 1254 × 1254: `output/fruits/gpt-image/originals/<id>.png` (lokal, folder output tidak masuk Git).
- Aset aplikasi WebP: `public/fruits/artwork/gpt-v1/<id>.webp`.
- Thumbnail WebP 512 × 512: `public/fruits/artwork/gpt-v1/thumbs/<id>.webp`.
- Manifest aplikasi: `src/lib/fruits/artwork-manifest.json`.
- Pengemasan: `python3 scripts/fruits/publish-artwork.py`. Skrip memeriksa seluruh 48 file sebelum menulis, dan hanya mengubah format serta resolusi.

Gaya: latar krem, pencahayaan studio lembut, sudut tiga perempat, fokus pada tekstur alami, buah utuh disertai potongan atau buah terkupas. Tanpa tulisan, logo, tangan, atau properti dekoratif. Antarmuka menyebutnya **Gambar buah**, dengan keterangan asal GPT Image; bukan dokumentasi fotografi buah sungguhan.

## Hubungan dengan 3D

`reference-look.ts` menentukan warna varietas yang tampak di setiap gambar. `models.ts` membentuk buah utuh dan ciri pengenalnya; `skin.ts` memberikan albedo, relief dan kekasaran permukaan. Setiap model menyimpan `referenceId` yang sama dengan aset gambarnya.

Penyesuaian meliputi kelapa tua cokelat berserat, pola semangka, jaring melon, bercak kuning-hijau mangga, kulit salak, rambut rambutan berujung hijau, bintil leci, kelopak manggis, duri durian dan sirsak, serta lapisan lilin anggur/plum. Warna organik terpisah dari warna tema antarmuka.

Model merupakan geometri parametrik interaktif yang disesuaikan dengan gambar acuan. Ini bukan hasil pemindaian atau rekonstruksi otomatis image-to-3D. Tampilan 3D memperlihatkan buah utuh; potongan, daging dan biji terlihat pada tab Gambar buah. Ukuran model dinormalisasi untuk penjelajahan, bukan perbandingan skala antarbuah.

## Pemeliharaan

Untuk mengganti gambar, gunakan GPT Image dengan prompt bersama yang sama, simpan versi baru, lalu periksa bentuk, warna, kulit, daging dan biji. Sesuaikan model serta palet referensinya jika varietas berubah. Jangan mengembalikan foto stok atau gambar yang diunduh dari internet sebagai fallback.
