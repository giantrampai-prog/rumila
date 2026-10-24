# Tinjauan SAINS-TKA.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky; skeptis pada tuntutan yang terlalu cepat). Konteks usia TK A = 4–5 tahun.
Validator: bersih (0 error; tidak ada peringatan untuk berkas ini):

```
✓ content/kurikulum/SAINS-TKA.json: 16 kompetensi
117 kompetensi, 0 error, 26 peringatan
```

Pembanding dan tafsir: sama dengan tinjauan SAINS-PAUD (golden `MAT.PAUD.WARNA.01/.02` sebagai batas bawah; `refs: []` jujur = 2; `cari` hanya sah pada dunia 3D yang ada; `pilah` berdasar fakta yang tak teramati = kuis; mode simulasi baru boleh LULUS dengan tanda **[butuh mode simulasi baru]**).

Pemeriksaan makna kode yang dirujuk (`content/kerangka/eyfs.json`, semuanya ELG Reception usia 5 → dipakai sebagai pendahulu/sejajar untuk 4–5 th):
- `ELG-UW-NATURAL-WORLD-01` "Explore the natural world… making observations… of animals and plants" — cocok untuk pengamatan tumbuhan/hewan (BAGIAN-TUMBUHAN, HEWAN .02, APUNG/MAGNET sebagai "explore").
- `ELG-UW-NATURAL-WORLD-02` "similarities and differences between the natural world around them and contrasting environments" — cocok untuk darat/air/udara (.01); untuk alat gerak (.03) hanya mirip (ciri tubuh, bukan lingkungan) → diganti NW-01.
- `ELG-UW-NATURAL-WORLD-03` "important processes and changes… including the seasons and changing states of matter" — cocok untuk siklus hidup, pertumbuhan, cuaca.
- `ELG-PSED-MANAGING-SELF-03` "…including dressing…" — cocok untuk CUACA-PAKAIAN.02.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| SAINS.TKA.BAGIAN-TUMBUHAN.01 | 16 | LULUS | Reseptif 4 bagian, `cari` di Kebun Buah dengan tanah transparan (aset perlu dibuat, dunia ada). Jebakan bunga vs buah ditangani. |
| SAINS.TKA.BAGIAN-TUMBUHAN.02 | 16 | LULUS | Susun 4 potongan relatif garis tanah, umpan balik fisik (roboh). Mekanik `bangun` lebih tepat daripada `simulasi`. |
| SAINS.TKA.BAGIAN-TUMBUHAN.03 | 12 (K3 1, K4 1) | REVISI — **diterapkan** | "Tebu = batang, brokoli = bunga" adalah fakta yang tidak bisa diamati anak 4–5 th dari sayur di rak; memilahnya = kuis seret. Diubah menjadi memilah hasil panen yang bagiannya terlihat saat dipanen (akar, daun, buah dari Kebun Buah). |
| SAINS.TKA.BAGIAN-TUMBUHAN.04 | 16 | LULUS | 4 gambar pertumbuhan, petunjuk visual progresif, prasyarat urutan 3 gambar PAUD. Pengaya. |
| SAINS.TKA.SIKLUS-HIDUP.01 | 16 | LULUS | Siklus 3 tahap paling sederhana, mode lingkaran, jebakan ukuran. |
| SAINS.TKA.SIKLUS-HIDUP.02 | 16 | LULUS | Metamorfosis 4 tahap, jebakan "ulat anak kupu-kupu" tepat, versi 3 tahap sebagai bantuan. |
| SAINS.TKA.SIKLUS-HIDUP.03 | 13 (K4 1, K6 1) | REVISI — **diterapkan** | Mencocokkan kartu anak–induk tanpa akibat di dunia = kuis; "kecebong–katak" tidak pernah diajarkan (tidak ada siklus katak). Diubah: antar ke induk dengan sambutan/penolakan sebagai umpan balik; kecebong jadi knob. |
| SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01 | 16 | LULUS | Tiga keranjang berlatar; item dua habitat (bebek, katak) disimpan untuk ronde lanjut. Kategori dari pengalaman harian anak, bukan hafalan. |
| SAINS.TKA.HEWAN-DARAT-AIR-UDARA.02 | 16 | LULUS | `cari` di Bawah Laut lapisan dangkal (dunia ada), batas 2 salah, target berbentuk khas. Pengaya. |
| SAINS.TKA.HEWAN-DARAT-AIR-UDARA.03 | 14 (K5 1, K6 1) | LULUS — **perbaikan kecil diterapkan** | Pengamatan tubuh (sirip/sayap/kaki) benar. Ref NW-02 (lingkungan) hanya mirip → NW-01; prasyarat pada pengaya `PAUD.HEWAN-SUARA.03` dilepas (inti tak boleh bergantung pada pengaya). |
| SAINS.TKA.CUACA-PAKAIAN.01 | 16 | LULUS | Papan cuaca 4 simbol **[butuh mode simulasi baru: papan cuaca]**; `pilah` mode pilih sudah cukup sebagai bukti. |
| SAINS.TKA.CUACA-PAKAIAN.02 | 15 (K6 1) | LULUS — **perbaikan kecil diterapkan** | "Topi saat panas, jaket saat dingin" memakai cuaca yang tidak ada di .01 (cerah/mendung/hujan/berangin). Diselaraskan. Lemari **[butuh mode simulasi baru]**; `pilah` cukup. |
| SAINS.TKA.CUACA-PAKAIAN.03 | 15 (K8 1) | LULUS | Kegiatan ↔ cuaca dengan varian adegan dimainkan. Catatan tanpa knob. Pengaya. |
| SAINS.TKA.APUNG-TENGGELAM-MAGNET.01 | 16 | LULUS | Coba dulu, lalu pilah sesuai hasil — bukti kuat, jebakan "besar pasti tenggelam". **[butuh mode simulasi baru: bak air]** |
| SAINS.TKA.APUNG-TENGGELAM-MAGNET.02 | 15 (K8 1) | LULUS | Tebak-lalu-uji dengan kunci tebakan; bukti "skor dari rasio" tanpa ambang (mis. ≥ 4 dari 6). **[butuh mode simulasi baru: bak air]** |
| SAINS.TKA.APUNG-TENGGELAM-MAGNET.03 | 16 | LULUS | Coba dengan magnet lalu pilah; jebakan "berkilau = tertarik" dan koin aluminium ditangani. **[butuh mode simulasi baru: magnet]** |

**Hasil: 14 LULUS, 2 REVISI** (keduanya diterapkan). Kedua REVISI berakar pada pola yang sama: `pilah` kartu berdasarkan fakta yang anak tidak bisa amati (K4), diperbaiki dengan menaruh pengamatan atau akibat ke dalam game.

## Revisi yang diminta

### SAINS.TKA.BAGIAN-TUMBUHAN.03 — diterapkan
- Masalah (K3★ Layak usia = 1): "tebu ke batang, brokoli ke bunga" — anak 4–5 th tidak punya pengalaman melihat tebu sebagai batang tanaman atau brokoli sebagai kuncup bunga; Cambridge Primary Science baru membahas "bagian tumbuhan yang dimakan" di Stage 2–3. Wortel = akar juga baru teramati kalau anak melihatnya dicabut.
- Masalah (K4★ Dibuktikan game = 1): memilah sayur di rak menurut asal bagiannya hanya bisa dilakukan dari ingatan → kuis seret. Tidak ada akibat atau pengamatan di dalam game yang membuktikannya.
- Diterapkan: statement → *"Aku bisa memilah hasil panen ke rak bagian tumbuhan yang terlihat diambil saat dipanen: wortel ke akar, bayam ke daun, mangga ke buah"* / *"I can sort harvested food onto the shelf of the plant part I saw being picked: carrot to roots, spinach to leaves, mango to fruit"*. Mekanik `["simulasi","pilah"]` (panen lalu pilah; **butuh mode simulasi baru: panen**). Buah memakai aset Kebun Buah. Batang (tebu) dan bunga (brokoli) hanya di ronde lanjut dan hanya bila animasi panen memperlihatkan bagiannya. Core tetap `true`.

### SAINS.TKA.SIKLUS-HIDUP.03 — diterapkan
- Masalah (K4★ Dibuktikan game = 1): "tiap anak hewan diseret ke induknya" tanpa akibat di dunia adalah pencocokan kartu; untuk pasangan mirip rupa anak cukup mencocokkan bentuk, untuk pasangan berubah bentuk anak mengingat — tidak ada yang membedakan "tahu" dari "menebak". `cari` tercantum tanpa dunia yang memuat induk–anak.
- Masalah (K6 Urutan = 1): "kecebong dengan katak" tidak punya prasyarat; tidak ada kompetensi siklus katak di kurikulum mana pun. Anak yang memasangkan kecebong ke ikan (jebakan yang penulis tulis sendiri) justru menalar dengan benar dari rupa.
- Diterapkan: statement → *"Aku bisa mengantar anak hewan ke induknya: ulat ke kupu-kupu, anak ayam ke ayam, anak kucing ke kucing"* / *"I can take each baby animal to its parent: caterpillar to butterfly, chick to chicken, kitten to cat"*. Mekanik `["pilah","navigasi"]`; induk benar menyambut, induk salah mundur; bukti ≤ 1 salah per pasangan; kecebong–katak sebagai knob setelah ronde pengantar siklus katak.

### Perbaikan kecil yang diterapkan tanpa mengubah putusan
- **HEWAN-DARAT-AIR-UDARA.03**: prereq `SAINS.PAUD.HEWAN-SUARA.03` (pengaya) dilepas; ref `NW-02` → `NW-01` dengan note "mengamati ciri tubuh hewan (alat gerak)".
- **CUACA-PAKAIAN.02**: statement → *"…jas hujan saat hujan, topi saat cerah, jaket saat berangin dingin"* / *"…raincoat when rainy, hat when sunny, jacket when cold and windy"* agar daftar cuaca sama dengan .01.

## Catatan urutan & prasyarat

- **BAGIAN-TUMBUHAN**: .01 nama → .02 susun → .03 panen/pilah → .04 pertumbuhan. `.01` berprasyarat `PAUD.HIDUP-TAK-HIDUP.01`; bila PO memindah konsep hidup/tak hidup ke TK A (lihat tinjauan PAUD), kompetensi pembuka itu pantas diletakkan di depan unit ini. `.04` berprasyarat `KODE.PAUD.URUTAN.02` — benar; bisa juga `KODE.TKA.URUTAN.01` (4–5 gambar) karena 4 gambar, tetapi tidak wajib.
- **SIKLUS-HIDUP**: ayam (3 tahap) → kupu-kupu (4 tahap) → anak–induk. Urutan tepat; `.03` berprasyarat `.02` benar karena memakai ulat–kupu-kupu.
- **HEWAN-DARAT-AIR-UDARA**: `.03` semula bergantung pada pengaya PAUD; sudah dilepas. `.02` (`cari` Bawah Laut) hanya mengenalkan hewan terumbu — ini menjadi satu-satunya pijakan untuk `TKB.HEWAN-HABITAT.02` (lapisan laut dalam/palung); lihat tinjauan TKB.
- **CUACA-PAKAIAN**: `.01` berprasyarat `PAUD.SIANG-MALAM-CUACA.02` (payung/topi) — tepat. `.02` dan `.03` berprasyarat `.01` — tepat.
- **APUNG-TENGGELAM-MAGNET**: `.03` (magnet) berprasyarat `.01` (apung) — tidak ada ketergantungan isi, hanya kesamaan pola "coba lalu pilah"; boleh dibiarkan. `TKB.BAHAN.01` berprasyarat `.03` — masuk akal (logam dikenal lewat magnet).
- Tidak ada prasyarat melingkar; tidak ada tuntutan membaca kalimat, tambah-kurang simbolik, atau perulangan.
- **Mekanik `simulasi`** dipakai 9 kali di berkas ini; hanya CUACA-PAKAIAN.02 (pilih benda) dan PAUD.SIANG-MALAM.02 yang bisa memakai mode `tombol` yang ada. Mode baru yang dibutuhkan: bak air apung-tenggelam, magnet, papan cuaca, lemari pakaian, panen. `bangun` sudah ada di enum dan cocok untuk BAGIAN-TUMBUHAN.02.

## Untuk diputuskan PO

1. **Daftar mode simulasi baru untuk SAINS**: bak air (2 kompetensi inti), magnet (1 inti), papan cuaca (1 inti), lemari (1 inti), panen (1 inti). Lima mode untuk enam kompetensi inti TK A — perlu diprioritaskan atau sebagian diturunkan ke `pilah` sementara.
2. **Prinsip "pilah berdasar pengamatan vs fakta"**: saya memakainya untuk membedakan HEWAN-DARAT-AIR-UDARA.01 (LULUS, dari pengalaman harian) dari BAGIAN-TUMBUHAN.03 (REVISI, fakta botani). Mohon dituliskan ke rubrik K4 agar penulis dan peninjau konsisten.
3. **Kamus**: `CAMBRIDGE_PRIMARY_SCIENCE` belum punya berkas kerangka; Stage 1 "Plants: parts of a plant", "Living things: life cycles", "Materials: properties (float/sink, magnetic)" akan jadi acuan yang jauh lebih presisi daripada ELG EYFS untuk seluruh berkas ini.
4. **Dunia hewan halaman** (sama dengan PAUD): SIKLUS-HIDUP.03 dan HEWAN-DARAT-AIR-UDARA.01/.03 membayangkan kebun dengan ayam, kucing, sapi. Tanpa dunia itu semuanya `pilah` 2D.

## Tindak lanjut peninjau — 24 Okt 2026

Diterapkan langsung ke `SAINS-TKA.json` (ditandai `[Tinjauan 24 Okt 2026: …]` di catatan):
- BAGIAN-TUMBUHAN.03 → pilah hasil panen yang bagiannya terlihat (akar/daun/buah); mekanik simulasi+pilah.
- SIKLUS-HIDUP.03 → antar anak hewan ke induk dengan sambutan/penolakan; kecebong jadi knob; mekanik pilah+navigasi.
- HEWAN-DARAT-AIR-UDARA.03 → prereq pengaya dilepas; ref NW-01.
- CUACA-PAKAIAN.02 → daftar cuaca diselaraskan dengan .01.

Menunggu PO: prioritas mode simulasi baru; prinsip K4 pengamatan vs fakta di rubrik; kamus Cambridge Primary Science; dunia hewan halaman.
