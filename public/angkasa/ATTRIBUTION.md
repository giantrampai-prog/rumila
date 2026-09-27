# Aset Jelajah Angkasa 3D — asal, lisensi, dan ukuran

Diperiksa: 26 September 2026.

## Tekstur planet (runtime)

| Berkas | Objek | Dimensi | Ukuran | Jenis citra (ditampilkan di aplikasi) |
|---|---|---|---|---|
| `tex/2k_sun.jpg` · `lo/lo_sun.jpg` | Matahari | 2048×1024 · 1024×512 | 822 KB · 169 KB | Peta ilustratif fotosfer, bukan foto sesaat |
| `tex/2k_mercury.jpg` · `lo/…` | Merkurius | 2048×1024 · 1024×512 | 873 KB · 181 KB | Peta warna permukaan (dirangkai dari data misi) |
| `tex/2k_venus_atmosphere.jpg` · `lo/…` | Venus | 2048×1024 · 1024×512 | 230 KB · 53 KB | Awan (tampilan atmosfer) |
| `tex/2k_venus_surface.jpg` | Venus | 2048×1024 | 885 KB | Peta permukaan hasil radar, bukan warna alami |
| `tex/2k_earth_daymap.jpg` · `lo/…` | Bumi | 2048×1024 · 1024×512 | 463 KB · 100 KB | Peta warna permukaan (mozaik citra satelit) |
| `tex/2k_earth_nightmap.jpg` · `lo/…` | Bumi | 2048×1024 · 1024×512 | 255 KB · 49 KB | Lampu malam (lapisan ilustratif; hanya di sisi malam) |
| `tex/2k_earth_clouds.jpg` · `lo/…` | Bumi | 2048×1024 · 1024×512 | 966 KB · 230 KB | Awan (satu citra gabungan, bukan cuaca saat ini) |
| `tex/2k_moon.jpg` · `lo/…` | Bulan | 2048×1024 · 1024×512 | 1.054 KB · 219 KB | Peta warna permukaan |
| `tex/2k_mars.jpg` · `lo/…` | Mars | 2048×1024 · 1024×512 | 751 KB · 138 KB | Peta warna permukaan |
| `tex/2k_jupiter.jpg` · `lo/…` | Jupiter | 2048×1024 · 1024×512 | 499 KB · 107 KB | Peta awan, warna mendekati alami |
| `tex/2k_saturn.jpg` · `lo/…` | Saturnus | 2048×1024 · 1024×512 | 200 KB · 49 KB | Peta awan, warna mendekati alami |
| `tex/2k_saturn_ring_alpha.png` | Cincin Saturnus | 2048×125 | 12 KB | Profil kecerahan & opasitas radial |
| `tex/2k_uranus.jpg` · `lo/…` | Uranus | 2048×1024 · 1024×512 | 78 KB · 20 KB | Warna rata ilustratif berbasis citra |
| `tex/2k_neptune.jpg` · `lo/…` | Neptunus | 2048×1024 · 1024×512 | 242 KB · 32 KB | Warna ilustratif berbasis citra Voyager 2 |

- **Sumber:** Solar System Scope — https://www.solarsystemscope.com/textures/ (berbasis data NASA).
- **Lisensi:** Creative Commons Attribution 4.0 International (CC BY 4.0). Atribusi ditampilkan di panel setiap objek ("Tekstur: Solar System Scope (CC BY 4.0), berbasis data NASA").
- Berkas `tex4k/4k_*.jpg` (4096×2048, JPEG q68–80, 0,8–3,3 MB) diperkecil dengan `sips` dari versi 8K Solar System Scope (Matahari, Jupiter, Saturnus: dari versi 4K sumber). Diunduh 28 September 2026. Hanya dimuat untuk satu objek yang sedang dilihat dari dekat, lalu dilepas dari memori GPU saat pindah objek. Uranus & Neptunus tidak tersedia di atas 2K.
- Berkas `lo/` adalah turunan 1024×512 (diperkecil dengan `sips`) untuk paket pembuka tata surya; `tex/` dimuat saat objek didekati.
- Color space: peta warna = sRGB; peta awan dipakai sebagai alpha (linear).

## Aset prosedural (dibuat oleh kode, tanpa berkas)

| Objek | Generator | Label di aplikasi |
|---|---|---|
| Titan | `titanTexture()` di `src/components/angkasa/engine/bodies.ts` | Ilustrasi kabut atmosfer |
| Pluto | `plutoTexture()` | Ilustrasi prosedural (warna mengikuti citra New Horizons secara umum) |
| Contoh asteroid / contoh komet | `lumpyGeometry()` + `rockTexture()` (seed tetap) | Ilustrasi benda kecil, bukan objek nyata |
| Latar bintang | `starfield()` (seed tetap) | Dekoratif, tanpa nama/koordinat bintang nyata |
| Bima Sakti | `galaxyView.ts` (seed tetap) | Ilustrasi struktur galaksi, bukan katalog bintang |
| Struktur Bumi & Saturnus | `structureView.ts` | Kode warna pendidikan / model interpretasi |

Semua generator deterministik (seed tetap), sehingga hasilnya sama di setiap perangkat.
