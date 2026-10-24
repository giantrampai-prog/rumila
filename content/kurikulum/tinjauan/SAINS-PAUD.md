# Tinjauan SAINS-PAUD.json — 2026-10-24
Persona: Pedagog usia dini (15 tahun TK–SD awal, sekolah Cambridge; acuan tahap Piaget/Vygotsky; skeptis pada tuntutan yang terlalu cepat). Konteks usia PAUD = 3–4 tahun.
Validator: bersih (0 error; 26 peringatan di seluruh folder, 3 menyangkut berkas ini — semuanya `refs: []` pada unit TUBUH-PANCAINDRA):

```
✓ content/kurikulum/SAINS-PAUD.json: 12 kompetensi
! SAINS.PAUD.TUBUH-PANCAINDRA.01: tidak ada kode acuan kerangka internasional
! SAINS.PAUD.TUBUH-PANCAINDRA.02: tidak ada kode acuan kerangka internasional
! SAINS.PAUD.TUBUH-PANCAINDRA.03: tidak ada kode acuan kerangka internasional
117 kompetensi, 0 error, 26 peringatan
```

Pembanding: golden set tidak memuat SAINS; batas bawah mutu diambil dari `MAT.PAUD.WARNA.01` (menunjuk saat nama disebut; `cari`+`ucap`) dan `MAT.PAUD.WARNA.02` (memilah 1 ciri; `pilah`+`cari`). Pola struktur catatan golden (aksi teramati, jebakan, beda dengan tetangga, knob) dipenuhi hampir semua kompetensi di berkas ini — kualitas catatan penulis baik.

Tafsir yang dipakai (sementara, menunggu PO — sama dengan tinjauan KODE-TKA):
- **K5 `refs: []`** dengan penjelasan jujur di catatan = 2. Semua ref EYFS di berkas ini adalah ELG Reception (usia 5) yang dipakai sebagai "pendahulu" untuk usia 3–4; makna kode cocok, note jujur → 2.
- **K4 dan mekanik `cari`**: `cari` berarti bukti dari dunia 3D yang sudah ada (Kebun Buah 48 buah, Jelajah Tubuh, Bawah Laut, Angkasa). Kompetensi yang hanya bisa dibuktikan lewat `cari` pada dunia yang belum ada (hewan halaman) dinilai K4 = 1. Bila `pilah` (mode pilih) ikut tercantum dan memadai, K4 tetap 2 dan `cari` cukup dilepas.
- **K4 dan `pilah` berbasis fakta**: memilah menurut ciri yang bisa diamati/dialami anak di game = bukti; memilah menurut fakta yang baru diajarkan tanpa akibat di dunia game = kuis berbungkus seret (K4 ≤ 1). Prinsip ini juga dipakai di TKA/TKB.
- **Simulasi**: mode yang ada = jam, timbangan, jengkal, kubus, turus, taksir, tombol, alat, bagi, menara, bantuan, telusur. Kompetensi yang menuntut mode baru boleh LULUS, ditandai **[butuh mode simulasi baru]**.

Kolom skor: total /16, lalu kriteria yang tidak mendapat 2 (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan).

| id | skor | putusan | catatan singkat |
|---|---|---|---|
| SAINS.PAUD.TUBUH-PANCAINDRA.01 | 16 | LULUS | Reseptif, 6 bagian besar, `cari` di Jelajah Tubuh lapisan kulit (dunia ada). Setara golden WARNA.01. `[]` jujur. |
| SAINS.PAUD.TUBUH-PANCAINDRA.02 | 16 | LULUS | Puzzle tubuh 4 potongan dengan umpan balik fisik (tokoh jatuh lucu). Mekanik `bangun` lebih tepat daripada `simulasi` (lihat catatan). |
| SAINS.PAUD.TUBUH-PANCAINDRA.03 | 15 (K3 1) | REVISI — **diterapkan** | Memilah benda ke 4 indra termasuk "lidah" adalah pemilahan menurut fungsi abstrak; anak 3–4 th menyebut "mulut", dan "kue → lidah" vs "kue → hidung" ambigu. Dipersempit ke 3 indra yang bisa dialami di game (mata, telinga, hidung). |
| SAINS.PAUD.HEWAN-SUARA.01 | 15 (K4 1) | REVISI — **diterapkan** | Mekanik `cari` tanpa dunia 3D hewan halaman (penulis sendiri mengakui). Bukti yang nyata adalah `pilah` mode pilih pada adegan 2D. Mekanik diganti. |
| SAINS.PAUD.HEWAN-SUARA.02 | 16 | LULUS | Suara diputar tanpa petunjuk visual, hewan diam — bukti sah. `cari` dilepas (minor, diterapkan). |
| SAINS.PAUD.HEWAN-SUARA.03 | 16 | LULUS | Pengamatan ciri (hitung kaki ≤ 4 dengan menunjuk), prasyarat BILANGAN-1-5.01 benar, pengaya. `cari` dilepas (minor, diterapkan). |
| SAINS.PAUD.SIANG-MALAM-CUACA.01 | 16 | LULUS | Pilah 1 ciri dengan petunjuk visual kuat; item ambigu (makan) dihindari. Varian simulasi pasang matahari/bulan **[butuh mode simulasi baru]**, tetapi `pilah` sudah cukup. |
| SAINS.PAUD.SIANG-MALAM-CUACA.02 | 16 | LULUS | Melihat langit → menekan payung/topi: mode simulasi `tombol` yang ada sudah cukup. Bukan "kalau-maka" simbolik (lihat PO 1). |
| SAINS.PAUD.SIANG-MALAM-CUACA.03 | 16 | LULUS | Urutan 3 gambar perubahan alam, prasyarat KODE.PAUD.URUTAN.02 tepat, paket `mana-dulu-alam` sudah ada. Pengaya. |
| SAINS.PAUD.HIDUP-TAK-HIDUP.01 | 15 (K3 1) | REVISI — **menunggu PO** | Konsep "hidup/tak hidup" yang memasukkan tumbuhan belum stabil pada 3–4 th (animisme Piaget: yang bergerak dianggap hidup, yang diam dianggap mati; penulis sendiri menulis jebakan ini). Yang bisa dituntut: memilah hewan dari benda. Perlu keputusan jenjang. |
| SAINS.PAUD.HIDUP-TAK-HIDUP.02 | 16 | LULUS | `cari` di Bawah Laut / Kebun Buah (dunia ada), pengecoh tak hidup disebut, batas 1 salah. Secara praktis anak lulus dengan menyentuh hewan saja — tidak masalah untuk pengaya. |
| SAINS.PAUD.HIDUP-TAK-HIDUP.03 | 16 | LULUS | Pendekatan paling tepat untuk usia ini: ciri "butuh makan/minum" dialami lewat akibat (ayam makan, bunga mekar). Mekanik `rawat` lebih jujur daripada `simulasi` **[butuh mode simulasi baru]**; `cari` butuh kebun dengan ayam/bunga/batu yang belum ada. |

**Hasil: 9 LULUS, 3 REVISI** (2 diterapkan, 1 menunggu PO). Catatan penulis secara umum di atas golden set: hampir semua memuat aksi teramati, jebakan, beda dengan tetangga, dan knob.

## Revisi yang diminta

### SAINS.PAUD.TUBUH-PANCAINDRA.03 — diterapkan
- Masalah (K3★ Layak usia = 1): statement menuntut 4 kategori fungsional (mata, telinga, hidung, lidah). Tabel usia: PAUD "memilah 1 ciri" — ciri di sini bukan perseptual tetapi "indra mana yang dipakai", yang menuntut anak membayangkan dirinya memakai benda itu. Dengan 3 indra yang bisa dialami langsung di game (benda bersinar, berbunyi, berbau) tuntutan itu masih wajar; "lidah" tidak bisa dialami di game dan anak 3–4 th menyebut "mulut", sementara "kue" juga bisa dicium (penulis mencatat jebakan ini sendiri).
- Diterapkan: statement → *"Aku bisa memilah benda ke indra yang memakainya: pelangi ke mata, lonceng ke telinga, bunga ke hidung"* / *"I can sort things to the sense that uses them: a rainbow to the eyes, a bell to the ears, a flower to the nose"*. Catatan: 3 keranjang, umpan balik keranjang "memakai" bendanya, lidah/kulit sebagai knob ronde lanjut, penamaan "lidah/kulit" ditegaskan di TK A.

### SAINS.PAUD.HEWAN-SUARA.01 — diterapkan
- Masalah (K4★ Dibuktikan game = 1): mekanik `cari` + `ucap`, tetapi tidak ada dunia 3D yang memuat kucing/ayam/sapi/kambing/bebek/burung. Catatan penulis: "belum ada dunia 3D hewan halaman; sementara dunia 2D kebun-pasar". Bukti yang sebenarnya tersedia adalah `pilah` mode pilih (sentuh satu hewan di adegan).
- Diterapkan: `mechanics` → `["pilah","ucap"]`; catatan menyebut mode pilih dan syarat kapan `cari` boleh ditambahkan kembali (bila dunia hewan halaman dibuat). Hal yang sama diterapkan ringan pada .02 (→ `["pilah"]`) dan .03 (→ `["pilah"]`) karena keduanya sudah memuat `pilah`; putusannya tetap LULUS.

### SAINS.PAUD.HIDUP-TAK-HIDUP.01 — menunggu PO (tidak diubah)
- Masalah (K3★ Layak usia = 1): "kucing dan pohon hidup, batu dan bola tak hidup" menuntut anak 3–4 th menggolongkan tumbuhan sebagai hidup dan benda bergerak (mobil) sebagai tak hidup. Keduanya justru ciri animisme usia pra-operasional; Cambridge Primary Science menempatkan "ciri makhluk hidup" di Stage 1 (5–6 th), EYFS ELG hanya menuntut "mengamati hewan dan tumbuhan". Catatan penulis mengakui jebakan utamanya tepat di situ — artinya kompetensi ini mengukur konsep yang memang belum ada, bukan kesalahan desain item.
- Usulan A (jenjang): statement PAUD → *"Aku bisa memilah hewan dari benda: kucing dan ayam ke keranjang hewan, batu dan bola ke keranjang benda"* / *"I can sort animals from objects: cat and chicken to the animal basket, rock and ball to the object basket"*; prereq tetap `MAT.PAUD.WARNA.02`; ref NW-01. Konsep "tumbuhan juga hidup; hidup = butuh makan/minum, tumbuh" naik ke TK A sebagai kompetensi pembuka unit BAGIAN-TUMBUHAN (atau unit baru HIDUP-TAK-HIDUP di TK A). `.03` (memberi makan/minum) tetap di PAUD sebagai jembatan pengalaman, bahkan layak jadi `.01`.
- Usulan B (bertahan di PAUD): batasi item hidup hanya hewan dan item tak hidup hanya benda diam (batu, bola, cangkir), tanpa pohon dan tanpa mobil, dan ubah nama kategori menjadi "hewan / benda". Secara isi ini sama dengan A, hanya tanpa memindah id.
- Konsekuensi lintas berkas: `SAINS.TKA.BAGIAN-TUMBUHAN.01` memakai .01 ini sebagai prereq; `SAINS.TKB.MAKANAN-SEHAT.01` memakai .03. Keduanya tetap berlaku pada usulan A/B. Nama unit "Hidup / tak hidup" perlu disesuaikan — karena itu PO.

## Catatan urutan & prasyarat

- **TUBUH-PANCAINDRA**: .01 reseptif → .02 pasang bagian → .03 fungsi indra. Urutan benar, prereq lengkap. `.02` memakai `simulasi` untuk umpan balik "tokoh bergerak/jatuh"; itu bukan mode simulasi yang ada — mekanik `bangun` (menyusun potongan ke posisi) lebih tepat dan tidak butuh mode baru. Saran, bukan syarat.
- **HEWAN-SUARA**: urutan benar (nama → suara → ciri). `.03` pengaya berprasyarat `MAT.PAUD.BILANGAN-1-5.01` — tepat dan dijelaskan. Catatan: `SAINS.TKA.HEWAN-DARAT-AIR-UDARA.03` (inti) semula bergantung pada `.03` ini (pengaya); sudah diluruskan di berkas TKA.
- **SIANG-MALAM-CUACA**: `.02` berprasyarat `.01` (siang/malam) padahal isinya cuaca; prasyarat yang lebih logis sebenarnya tidak ada di PAUD (tidak ada "mengenal hujan/cerah" reseptif). Tidak melompat secara berarti karena hujan/cerah adalah pengalaman harian; dibiarkan. `.03` berprasyarat `KODE.PAUD.URUTAN.02` (3 gambar) — benar.
- **HIDUP-TAK-HIDUP**: `.02` dan `.03` berprasyarat `.01`; bila PO memilih usulan A, prereq `.03` cukup `[]` dan `.02` cukup `.03`.
- Tidak ada prasyarat melingkar. Tidak ada tuntutan membaca, menulis, menghitung > 5, atau dua ciri sekaligus. Tidak ada nama tokoh di statement/catatan.
- **Mekanik `cari` tanpa dunia**: HEWAN-SUARA.01–.03 (hewan halaman) dan HIDUP-TAK-HIDUP.03 (kebun dengan ayam/bunga/batu). Yang pertama sudah diluruskan; yang kedua dicatat (lihat PO 3).

## Untuk diputuskan PO

1. **Tafsir "kalau-maka" di tabel usia PAUD**: SIANG-MALAM-CUACA.02 (hujan → payung) saya loloskan karena ini pilihan berdasarkan persepsi langsung dan pengalaman harian, bukan aturan simbolik seperti blok "kalau" di KODE. Mohon ditegaskan di rubrik supaya peninjau lain konsisten.
2. **Jenjang "hidup / tak hidup"** (HIDUP-TAK-HIDUP.01): usulan A (hewan vs benda di PAUD, konsep penuh di TK A) atau B. Menyangkut nama unit dan id lintas berkas.
3. **Dunia hewan halaman**: tiga kompetensi PAUD dan beberapa di TKA/TKB membayangkan kebun/halaman dengan ayam, kucing, sapi, bunga, batu, mobil mainan. Belum ada dunia 3D-nya. Putuskan: (a) buat dunia "Halaman Rumah" 3D, atau (b) semua kompetensi hewan halaman memakai `pilah` 2D dan `cari` hanya untuk Bawah Laut/Kebun Buah/Jelajah Tubuh/Angkasa (konsisten dengan yang saya terapkan).
4. **Mekanik `rawat`**: ada di `MECHANIC_IDS` tetapi belum ada paket/skemanya. HIDUP-TAK-HIDUP.03 (memberi makan/minum) adalah pemakaian paling alami; bila `rawat` tidak akan dibangun, kompetensi itu butuh mode simulasi baru ("beri makan").
5. **Kamus kerangka untuk tubuh/pancaindra**: `refs: []` pada 3 kompetensi karena EYFS tidak punya ELG khusus dan Cambridge Early Years "Understanding the World" belum ada di kamus. `CAMBRIDGE_PRIMARY_SCIENCE` sudah ada di enum `FRAMEWORK_IDS` tetapi berkas `content/kerangka/cambridge-primary-science.json` belum ada; menambahkannya akan menutup hampir semua `[]` di track SAINS (termasuk 8 di TKB).
6. **Rubrik K5 untuk `[]` di track SAINS**: rubrik hanya memberi 2 untuk SENI/KARAKTER; saya memakai tafsir KODE-TKA (jujur = 2). Mohon rubrik diselaraskan.

## Tindak lanjut peninjau — 24 Okt 2026

Diterapkan langsung ke `SAINS-PAUD.json` (ditandai `[Tinjauan 24 Okt 2026: …]` di catatan):
- TUBUH-PANCAINDRA.03 → 3 indra (mata, telinga, hidung); lidah/kulit jadi knob.
- HEWAN-SUARA.01 → `mechanics` `["pilah","ucap"]`; .02 → `["pilah"]`; .03 → `["pilah"]`.

Menunggu PO: HIDUP-TAK-HIDUP.01 (jenjang); tafsir kalau-maka; dunia hewan halaman; mekanik `rawat`; kamus Cambridge Primary Science; rubrik K5.
