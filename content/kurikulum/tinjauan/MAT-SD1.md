# Tinjauan MAT-SD1.json — 2026-10-25
Persona: guru kelas awal SD (12 tahun mengajar kelas 1–2, sekolah berkurikulum internasional; acuan Cambridge Primary Stage 1). Konteks usia SD 1 = 6–7 tahun. Peninjauan dilakukan sebagai lintasan terpisah atas draf penulis, dengan membaca juga isi paket konten (bukan hanya statement).
Validator (seluruh repo, 25 Okt 2026): 0 error; tidak ada peringatan untuk MAT.SD1.

```
✓ content/kurikulum/MAT-SD1.json: 17 kompetensi
382 kompetensi, 0 error, 78 peringatan   (peringatan milik berkas lain)
```

Pembanding: MAT-TKB.json dan tinjauannya. Prasyarat ke MAT-TKB/TKA/PAUD dicek ada. Rubrik sama dengan tinjauan TK B (K1 Teramati★, K2 Satu kemampuan★, K3 Layak usia★, K4 Dibuktikan game★, K5 Ref, K6 Urutan, K7 Dwibahasa, K8 Catatan; maks 16).

| id | skor draf | putusan | catatan singkat |
|---|---|---|---|
| BILANGAN-100.01 | 13 (K4 1, K6 1) | REVISI → diterapkan | Menyusun kartu "loncat 10 dari 3" bisa dikerjakan dengan mengurutkan naik saja tanpa paham loncat 10. Ditambah urutan mundur dan paket pilah "jalan katak" (jebakan 40, 41, 43). Ref 1Nc.04 hanya sampai 20; perluasan ke 100 mengikuti daftar topik SD 1 dan dicatat di note. |
| BILANGAN-100.02 | 15 (K8 1) | LULUS | Laci dibatasi 10 koin seribu sehingga harga belasan ribu memaksa satu lembar sepuluh ribu: bukti puluhan + satuan yang bersih. Draf memuat harga Rp20.000 padahal instruksi "belasan" → diganti. |
| BILANGAN-100.03 | 15 (K8 1) | LULUS | Kartu tidak berurutan, ada 0. |
| BILANGAN-100.04 | 16 | LULUS | Kartu angka + kumpulan benda (dipasangkan). 0 genap. |
| TAMBAH-KURANG-20.01 | 15 (K4 1) | LULUS | Lengkapi 10 hanya punya 9 soal berbeda (1–9); satu ronde pasti berulang. Diimbangi paket pilah "kurang berapa supaya 10". |
| TAMBAH-KURANG-20.02 | 14 (K4 1, K8 1) | LULUS | "Menghitung maju dari yang lebih besar" tidak bisa dibedakan dari menghitung semua oleh mesin gabung (hanya angka akhir). Latency dicatat di event; strategi diajarkan lewat instruksi. |
| TAMBAH-KURANG-20.03 | 16 | LULUS | Produksi jumlah, kotak tertutup. |
| TAMBAH-KURANG-20.04 | 15 (K3 1) | LULUS | Hampir-dobel di ambang usia; ditandai pengaya (`core: false`). |
| PECAHAN.01 | 15 (K4 1) | LULUS | Setengah sebagai operator lewat rak; 1Nf.01 (dua bagian sama vs tidak sama) belum tercakup karena mesin belum bisa menggambar potongan bangun. |
| BANGUN.01 | 16 | LULUS | Segitiga terbalik, ketupat, irisan pizza sebagai jebakan. Label rak "ada sisi lengkung" dipendekkan agar tidak terpotong. |
| BANGUN.02 | 15 (K4 1) | LULUS | Emoji benda ruang tampak "bergambar 3D", sehingga sebagian anak bisa memilah dari gaya gambar. Diterima untuk SD 1. |
| UKUR.01 | 12 (K4 1, K1 1, K8 2→1) | REVISI → diterapkan | Draf mempertemukan semangka dan kucing (berat bisa sama) → urutan ambigu. Kelompok setara diperluas (semangka, batu, kucing tidak pernah bersama). |
| UKUR.02 | 15 (K5 1) | LULUS | Kapasitas akhirnya masuk (catatan tinjauan TK B). Ref 1Gg.05 hanya "bahasa kapasitas"; mengurutkan wajar. |
| WAKTU.01 | 16 | LULUS | Jebakan "setengah 4 = 3.30" khas bahasa Indonesia; label `en` "half past 3" sudah setara. |
| WAKTU.02 | 15 (K8 1) | LULUS | Nama bulan panjang → kartu diperkecil (`scale`). |
| DATA.01 | 14 (K7 1, K8 1) | REVISI → diterapkan | Label rak "bukan merah, bersudut" terpotong di layar ponsel. Diganti "lain · bersudut" + instruksi "lain = warna lain". |
| POLA.01 | 14 (K2 1, K5 1) | LULUS (pengaya) | Pola ABB/AAB di draf membuat palet berisi id ganda (mesin pola menyalin unit ke palet) → diganti satuan AB/ABC dengan unsur berbeda. 1Nc.06 hanya "bahasa barisan benda"; dibuat pengaya. |

**Hasil: 14 LULUS, 3 REVISI (semua diterapkan).**

## Catatan urutan & prasyarat
- Rantai bilangan: TKB.BILANGAN-20.02/.03 → .02 puluhan-satuan & .03 urut → .04 genap-ganjil; .01 loncat 10 bertumpu pada hitung maju TKB.
- Tambah-kurang: TKB.TAMBAH-KURANG-10.03 → .01 pasangan 10 → .02 jumlah ≤ 20 → .04 dobel; .03 sisa bertumpu TKB .02. PECAHAN.01 memakai dobel (.04) sebagai strategi.
- Tidak ada prasyarat ke level lain selain MAT PAUD–TK B. Tidak ada siklus.
- Simbol + dan − mulai dipakai di kartu (10+7, 6+7); TK B belum memakainya. Wajar untuk SD 1 (1Ni.05).

## Untuk diputuskan PO
1. **Rentang bilangan SD 1.** `docs/akademi/kurikulum.md` menulis "bilangan sampai 100 dan nilai tempat", tetapi Cambridge Stage 1 berhenti di 20 dan TK B sudah mencakup sebagian besar Stage 1. Draf ini mengikuti Stage 1 (0–20) dan hanya loncat 10 yang sampai 100. Bila SD 1 harus sampai 100, nilai tempat 2 angka (MAT.SD2.BILANGAN-100.01) perlu ditarik turun.
2. **Perkalian larik, jam seperempat, kg/liter, grafik batang** di daftar topik SD 1 tidak dimasukkan: menurut acuan Stage 1–2 itu Stage 2 atau lebih. Perlu konfirmasi bahwa daftar topik boleh diselaraskan ke acuan.
3. **Bukti strategi (hitung maju, dobel)** hanya bisa dilihat dari latency; mesin belum merekam proses. Perlu keputusan apakah latency dipakai untuk penguasaan.
4. **1Nf.01** (dibagi dua sama/tidak sama) butuh presenter yang bisa menggambar bangun terpotong; saat ini tidak bisa dibuktikan.
