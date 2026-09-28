# Interior kapsul

Interior dibuat sebagai geometri Three.js di `cabin-interior.ts`, bukan gambar latar. Kabin ini merupakan rancangan edukasi RINOYA, bukan replika atau simulator operasional wahana tertentu.

- Tiga jendela memiliki lubang nyata, bingkai logam, gasket, kaca transparan, dan pengikat. Dunia luar tetap dirender pada pass pertama, kabin pada pass kedua.
- Panel dinding berlapis, ventilasi, lampu, kursi berlapis kain, sabuk, pengunci, rel kursi, serta konsol dan pegangan membentuk interior.
- Layar 768 × 480 menampilkan ketinggian, kecepatan, dan gaya G dari state misi yang sudah ada. Kamera narasi melihat kursi dari depan, konsol, atau indikator tanpa bobot sesuai cue. Pada ponsel, cue gaya G membingkai layar gaya G agar nilainya utuh.
- Material kain memakai peta warna dan relief prosedural. Baju dan sarung tangan POV turut diperhalus; kupola memakai tubuh POV yang sama.
- Boneka bintang memiliki volume, jahitan, wajah, dan tali. Gerak menggantung/melayang tetap mengikuti state gravitasi misi.
- Geometri interior diam digabung per material, pengikat memakai instancing. Layar dan benda bergerak tetap terpisah. Bayangan interior diperbarui terpisah dari pass dunia. Disposal menghapus geometri, material, seluruh peta tekstur, dan shadow map tanpa duplikasi.

## Pemeriksaan

TypeScript, ESLint pada file yang berubah, build produksi, dan suite 215 tes lulus. Review browser dilakukan pada desktop 1280 × 720 dan viewport ponsel 390 × 844: kabin, kursi, konsol gaya G, boneka melayang, jeda/lanjut, pergantian bab serta sinkronisasi popup. Tidak ditemukan error/warning browser pada review akhir. Ini pemeriksaan viewport browser, bukan pengujian perangkat fisik.

Bukti visual lokal tersimpan di `output/roket/qa/kabin-*.png` (direktori output diabaikan Git). Pengukuran draw call di kabin mencakup pass interior; bukan total biaya rendering dunia dan kabin.

## Referensi visual

Rujukan penataan interior modern dan konsol: [Crew Dragon interior](https://www.nasa.gov/image-article/crew-dragon-interior/) dan [Crew Dragon instrument panel](https://www.nasa.gov/image-article/crew-dragon-instrument-panel/). Tidak ada gambar dari sumber tersebut yang disalin menjadi aset aplikasi.
