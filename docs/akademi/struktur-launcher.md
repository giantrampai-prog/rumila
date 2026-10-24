# Rumila Kids Academy — Struktur Menu

Status: usulan, 24 Okt 2026 (revisi: bukan aplikasi keluarga, melainkan akademi).

## Posisi produk

**Rumila Kids Academy**: akademi anak usia 3–12 berbasis game, kurikulum mengacu Cambridge Early Years dan Cambridge Primary, dwibahasa Indonesia–Inggris, dengan laporan dan sertifikat per jenjang. Bukan launcher, bukan aplikasi keluarga. Analoginya sekolah internasional: ada **murid** dan ada **portal wali**.

Modul rumila lama yang bukan akademi (Keluarga, Kesehatan, Keuangan, Al-Qur'an, Kiblat, Tasbih, Catur) **keluar dari produk ini**. Boleh hidup sebagai aplikasi terpisah atau dipensiunkan; tidak muncul di menu akademi.

## Tiga pintu

```
Layar masuk akademi
├─ Murid   (pilih avatar, tanpa PIN)   → PORTAL MURID
├─ Wali    (PIN / login)               → PORTAL WALI
└─ Admin   (internal Rumila)           → ADMIN AKADEMI
```

## Portal murid

Lima tab bawah. PAUD–TK: ikon besar + suara, teks minimal. SD: ikon + teks.

| Tab | Isi |
|---|---|
| **Hari ini** | 3 misi pilihan mesin adaptif · lanjutkan quest · stiker baru · streak |
| **Pelajaran** | 8 mata pelajaran → level murid di pelajaran itu → topik → aktivitas. Tampilan seperti peta jenjang PAUD…SD 6 |
| **Dunia** | 6 dunia 3D (Angkasa, Roket, Klinik, Kebun & Pasar, Laut, Tambang). Jelajah bebas terbuka, quest sesuai level |
| **Koleksi** | stiker, lencana pelajaran, pangkat, sertifikat jenjang, katalog temuan |
| **Teman** | main bareng saudara/teman satu akun: Ular Tangga, kartu memori 2 pemain, misi bersama mingguan |

Tidak ada angka nilai, tidak ada peringkat, tidak ada tombol ke media sosial.

## Portal wali

Meniru parent portal sekolah internasional. Gaya daftar, bisa beberapa anak.

| Menu | Isi |
|---|---|
| **Rapor** | per anak: radar 8 pelajaran, level per pelajaran, kompetensi dengan status belum / berkembang / dikuasai beserta kode acuan Cambridge, rapor semester PDF |
| **Sertifikat** | lencana, pangkat, sertifikat jenjang; lihat, cetak, verifikasi; tombol **Bagikan** (kartu 9:16 / 1:1 → Instagram pribadi) |
| **Rencana belajar** | rekomendasi "mainkan ini minggu ini", target menit per hari, jadwal pengingat |
| **Waktu layar** | batas harian per anak, jam boleh main, laporan pemakaian |
| **Privasi & Instagram** | saklar "Tampilkan pencapaian di Instagram Rumila", saklar foto wajah, akun IG wali untuk ditandai, riwayat postingan & tombol Tarik |
| **Langganan** | paket, tagihan, metode bayar, tambah anak |
| **Pengaturan** | profil anak & avatar, bahasa antarmuka (ID/EN), PIN, perangkat, hapus akun |

Laporan mingguan otomatis ke WA/email wali: ringkasan rapor + pencapaian baru.

## Admin akademi (internal, hanya tim Rumila)

| Menu | Isi |
|---|---|
| **Papan Prestasi** | antrean mingguan postingan Instagram: kartu, caption, tag; Setujui / Tolak / Jadwalkan; daftar post terbit & tarik |
| **Studio konten** | kurikulum, paket konten, quest, aset, publikasi versi (lihat `produksi-konten.md`) |
| **Telemetri** | item terlalu mudah / sukar, titik berhenti, waktu reaksi |
| **Murid & wali** | daftar tenant, status langganan, dukungan |

## Mata pelajaran dan Cambridge

Enam pelajaran mengacu langsung ke kerangka Cambridge/CEFR: Matematika, Sains, Bahasa Inggris, Coding (Cambridge ICT Starters / Computing), Bahasa Indonesia (sebagai first language setara English, acuan Kurikulum Merdeka), Dunia & Budaya (Cambridge Global Perspectives untuk usia SD atas). Dua pelajaran adalah **pelajaran khas sekolah**, seperti sekolah Cambridge di Indonesia yang menambah Islamic Studies: **Seni & Musik** dan **Karakter & Agama**. Keduanya masuk rapor dan lencana, tetapi di sertifikat jenjang dicantumkan sebagai "pelajaran tambahan", bukan "mengacu Cambridge".

## Izin per anak

Izin per tab dan per dunia, diatur wali. Contoh: anak PAUD cukup Hari ini, Dunia (Kebun, Laut), Koleksi.

## Peta rute

```
/masuk                        pilih peran & profil
/murid                        Hari ini
/murid/pelajaran              peta jenjang
/murid/pelajaran/[pelajaran]  topik & aktivitas
/murid/dunia/[dunia]          scene 3D + quest
/murid/koleksi
/murid/teman
/wali                         rapor (anak pertama)
/wali/[anak]/rapor | sertifikat | rencana | waktu | privasi
/wali/langganan | pengaturan
/admin/papan | studio | telemetri | murid
/sertifikat/[kode]            publik, verifikasi
```

## Transisi dari rumila sekarang

1. Layar masuk diganti: pilih peran murid / wali, bukan daftar anggota keluarga.
2. Folder Game, Coding Agam, Petualangan 3D, Edukasi dilebur ke portal murid (lihat `migrasi-menu-lama.md`).
3. Folder Doa Harian & Ibadah: Doa Harian, Hafalan Surat, Asmaul Husna jadi konten pelajaran Karakter & Agama; Al-Qur'an, Kiblat, Tasbih keluar dari produk.
4. Folder Keluarga, Kesehatan, dan tabel `fin_*` keluar dari produk ini.
5. Portal wali dibangun baru; Admin akademi dibangun bersama Studio.
