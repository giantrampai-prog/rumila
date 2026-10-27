# Umroh Virtual: asal aset

## Tekstur yang disertakan

Ketiga berkas berikut merupakan peta material **Marble 01**, dibuat oleh **Rob Tuytel** dan diterbitkan oleh **Poly Haven**. Masing-masing berukuran 1024 × 1024 piksel; jumlah ukuran berkas 507.107 byte. Nama berkas lokal disederhanakan untuk aplikasi.

| Berkas lokal | Peta material |
| --- | --- |
| `textures/marble-diff.jpg` | Diffuse / warna permukaan |
| `textures/marble-nor_gl.jpg` | Normal OpenGL |
| `textures/marble-rough.jpg` | Roughness / kekasaran permukaan |

- Sumber dan pembuat: [Marble 01 — Rob Tuytel / Poly Haven](https://polyhaven.com/a/marble_01).
- Lisensi aset: [CC0 menurut Poly Haven](https://polyhaven.com/license), [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
- Sumber dan lisensi diperiksa pada 27 Oktober 2026. Atribusi ini dicantumkan sebagai catatan asal aset, walaupun CC0 tidak mewajibkannya.
- Berkas dilayani dari `/umroh/textures/` milik aplikasi; tidak diunduh dari Poly Haven saat pengguna membuka modul.

Catatan lisensi ini berlaku untuk berkas tekstur tersebut. Tidak ada klaim bahwa foto referensi, logo, teks situs sumber, atau keseluruhan kode Rumila berada di bawah CC0.

## Model manusia bertekstur

Model pria menggunakan **Muslim and hajj man**, karya **Mostafa 1001 / Mostafa Ebrahim**, dari [halaman resmi Fab](https://www.fab.com/listings/90d395a5-a805-4193-855c-61179178b3be). Model dan tekstur diunduh gratis melalui tautan resmi setelah persetujuan EULA Fab oleh pengguna pada 27 Oktober 2026. Lisensi aset yang tercantum pada halaman dan dialog unduhan adalah [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). [Halaman asli pembuat di Sketchfab](https://sketchfab.com/3d-models/free-hajj-man-animated-a8806a0125274befb8d021e16c727fdf) mengarahkan unduhan ke Fab.

| Berkas lokal | Penggunaan | Ukuran | Segitiga | Animasi |
| --- | --- | ---: | ---: | --- |
| `models/man-ihram.glb` | Pria dengan dua kain ihram, tanpa kopiah | 3.923.460 byte | 24.089 | `idle`, `walk` |
| `models/man-travel.glb` | Pria dengan pakaian perjalanan dari model sumber | 2.405.704 byte | 24.783 | `idle`, `walk`, `seated`, `driving` |

Berkas tersebut merupakan adaptasi Rumila: pakaian dipisah menjadi dua varian, kopiah dihapus pada varian ihram, serta geometri dan tekstur dioptimalkan untuk browser dan dikonversi ke GLB. Tinggi dinormalisasi ke 1,76 m. Proporsi tubuh, wajah, UV, tekstur kulit/pakaian, dan animasi berjalan berasal dari model berlisensi tersebut. Tekstur kulit dibatasi ke 2K dan tekstur lainnya ke 1K. Tepi rumbai kain ihram memakai mask alpha yang dipulihkan dari latar hitam pada tekstur sumber, sehingga latar tersebut tidak terlihat sebagai kotak hitam. Pose duduk (`seated`) dan mengemudi (`driving`) ditambahkan untuk varian perjalanan. Angka ekspor dicatat dalam `models/manifest.json`.

Model pria digunakan untuk jamaah utama, kerumunan, dan penumpang. Runtime membagikan geometri/material dan menginstansikan hasil animasi; tekstur sumber tetap digunakan. Model bukan pemindaian fotogrametri; metadata Fab menyatakan “Scanned: No”. Model perempuan masih menggunakan geometri prosedural Rumila.

Atribusi pembuat, judul, sumber, lisensi, dan perubahan juga tersedia melalui tombol **Tentang panduan** di dalam modul. Berkas GLB dilayani dari `/umroh/models/` milik aplikasi, tanpa mengambil model dari Fab saat runtime. CC BY 4.0 berlaku pada model sumber beserta materi adaptasinya; lisensi itu tidak diberlakukan pada keseluruhan kode atau aset Rumila lainnya.

### Reproduksi ekspor

Ekspor menggunakan Blender 4.5 LTS dan `scripts/umroh/prepare-human-assets.py`, dijalankan dari akar repositori. Unduh berkas sumber resmi `hajj_man.blend` secara terpisah dari Fab; berkas sumber besar tersebut tidak dibundel dalam aplikasi. Skrip membaca mesh/rig/material dari sumber dan tidak mengaktifkan skrip tertanam di dalam berkas Blender.

```sh
blender --background --disable-autoexec --python scripts/umroh/prepare-human-assets.py -- \
  --source /path/to/hajj_man.blend --output public/umroh/models
```

Sumber Blender yang digunakan berukuran 150.851.748 byte, dengan SHA-256:

```text
94f4d97f960741f8bf7855279dcc57103beed4a88b13ec96f18f081a59129a53  hajj_man.blend
```

## Geometri dan rujukan arsitektur

Bangunan dan lingkungan dibentuk dengan geometri prosedural yang ditulis untuk Rumila. Model manusia bertekstur dari pihak ketiga dijelaskan di bagian sebelumnya. Foto dan materi pada halaman referensi berikut digunakan untuk mengenali ciri tempat; berkasnya tidak disertakan sebagai aset aplikasi.

- [Al Haramain — Mataf](https://alharamain.gov.sa/public/?page=mataf-ar): pelataran tawaf dan lingkungan Ka'bah.
- [Al Haramain — Safa and Marwa](https://alharamain.gov.sa/public/?page=safa-marwa-en): koridor sa'i.
- [Al Haramain — Umbrellas](https://alharamain.gov.sa/public/?page=umbrellas-en): payung halaman Masjid Nabawi.
- [Al Haramain — Nabawi architecture](https://alharamain.gov.sa/public/?page=nabawi-architecture-en): ciri arsitektur Masjid Nabawi.
- [Saudi Press Agency — Prophet's Holy Mosque's Huge Convertible Umbrellas](https://www.spa.gov.sa/w1720120): bentuk dan ukuran acuan payung.
- [Visit Madinah — Al Miqat Mosque](https://visitmadinahsa.com/sa-en/destinations/Al-Miqat----Mosque): Masjid Bir Ali / Dzulhulaifah.
- [Nusuk — Rawdah](https://www.nusuk.sa/rawdah/): rujukan resmi mengenai area Rawdah di antara minbar dan kamar Nabi. Halaman dibaca pada 27 Oktober 2026; foto, teks penjelasan, dan model dari situs tidak disalin ke aplikasi.

Interior Rawdah dan lorong salam dibuat dari geometri asli di `nabawi-interior.ts`. Pilar, lengkung, karpet, lampu, isyarat mihrab/minbar, serta pola geometris kisi adalah interpretasi visual untuk pembelajaran. Pola dekoratif tidak meniru tulisan Arab. Tampilan salam dibatasi pada sisi luar kisi dengan permukaan belakang tertutup; bagian dalam kamar, makam, jenazah, dan figur Nabi tidak dimodelkan. Tidak ada aset baru yang diunduh untuk kedua interior ini.

Rumah, taksi, pesawat, terminal, kabin kereta, dan Stasiun Madinah dibuat dari geometri asli di `itinerary.ts` serta `travel.ts`. Nama Garuda Indonesia, Haramain, dan Uber ditulis sebagai teks biasa untuk mengenali kendaraan dalam skenario; tidak ada berkas logo atau model kendaraan dari operator yang disalin. Bentuk kendaraan dan bangunan merupakan interpretasi visual, bukan model bersertifikat atau denah operasional. Koneksi stasiun di Terminal 1 Jeddah merujuk pada [King Abdulaziz International Airport](https://www.kaia.sa/About-KAIA) dan [Saudi Press Agency](https://www.spa.gov.sa/en/w2586844).

Pesawat Garuda pada apron dan saat terbang memakai model geometri asli yang sama dari `aircraft.ts`; kabin dan langit dibuat di `travel.ts` serta `flight.ts`. Fuselage, sayap, mesin, roda pendaratan, dan kokpit dimodelkan dengan kode. Tulisan Garuda Indonesia, corak biru–toska pada ekor, serta awan dibuat secara prosedural dengan Canvas, bukan tekstur, logo, atau model yang diambil dari operator maupun pihak ketiga. Corak tersebut merupakan rekonstruksi visual untuk mengenali pesawat dalam skenario, bukan aset resmi maskapai.

Halaman referensi bukan sumber model 3D berlisensi CC0. Bentuk, jarak, arah pandang, dan kepadatan jamaah dalam aplikasi disederhanakan untuk pembelajaran. Lingkungan ini bukan hasil survei, digital twin terukur, atau petunjuk navigasi di lokasi sebenarnya. Rujukan materi ibadah dan batas editorial dicatat di `docs/umroh-virtual.md`.

## Detail Ka’bah dan landmark tawaf

`realistic/kaaba.ts` membuat geometri Ka’bah, pintu, bingkai Hajar Aswad, Hijir Ismail/Mizab, Maqam Ibrahim, serta lampu hijau dari kode asli Rumila. Tekstur anyaman hitam, bordir geometris, dan ukiran pintu dihasilkan secara lokal dengan Canvas; tidak ada foto atau model milik pihak lain yang dibundel. Pola sulaman merupakan penyederhanaan dekoratif, bukan salinan kaligrafi kiswah. Marmer tetap memakai tiga peta CC0 yang disebut di atas.

Orientasi dan proporsi dicocokkan dengan [Saudipedia — Grand Mosque](https://saudipedia.com/en/grand-mosque), [ukuran sisi Ka’bah](https://saudipedia.com/en/a-list-of-the-dimensions-of-the-four-sides-of-the-holy-kaaba), [Al Haramain — Black Stone](https://alharamain.gov.sa/public/?page=The_Black_Stone-en), [Hijr](https://alharamain.gov.sa/public/?page=hijr-en&site=ur), [Mizab](https://alharamain.gov.sa/public/?page=mizab-ar), [Shadhrawan](https://alharamain.gov.sa/public/?page=shadrawan-ar), dan [SPA — Hijr Ismail](https://www.spa.gov.sa/fr/N2537986), diperiksa pada 27 Oktober 2026. Sumber tersebut menjadi rujukan bentuk dan posisi, bukan lisensi aset yang dapat didistribusikan.
