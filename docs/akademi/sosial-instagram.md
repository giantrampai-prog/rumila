# Kids Academy — Pencapaian di Instagram

Status: usulan, 24 Okt 2026.

## Dua arah

1. **Akun Instagram Rumila** memposting pencapaian anak-anak (seperti sekolah mengumumkan wisudawan).
2. **Orang tua** membagikan ulang, dari postingan Rumila yang menandai mereka, atau dari kartu di aplikasi.

## Izin, bukan asumsi

Data anak adalah data pribadi spesifik (UU PDP). Posting di akun merek tanpa izin tertulis orang tua itu risiko hukum dan risiko reputasi sekaligus.

Di portal wali, menu Privasi & Instagram → per anak:

```
Tampilkan pencapaian [Nama] di Instagram Rumila      [ mati | hidup ]
  Yang ditampilkan:  nama panggilan + avatar          (selalu)
                     foto wajah                       [ mati | hidup ]
  Akun Instagram orang tua untuk ditandai:  @______   (opsional)
Izin bisa dicabut kapan saja; postingan lama ditarik dalam 24 jam.
```

Default **mati**. Tidak ada imbalan di aplikasi untuk menyalakannya.

Yang **tidak pernah** ditampilkan di postingan Rumila: nama lengkap, sekolah, kota, usia pasti, wajah tanpa izin eksplisit, dan peringkat antar anak.

## Apa yang diposting

| Momen | Format | Ritme |
|---|---|---|
| Lencana pelajaran baru | carousel feed "Wisuda minggu ini", semua anak yang dapat lencana minggu itu | mingguan |
| Kenaikan pangkat / sertifikat jenjang | story per anak + menandai akun orang tua | saat terjadi |
| Misi puncak lulus | reel 9:16 dari rekaman upacara pangkat di aplikasi (pipeline video yang sudah ada) | bulanan, kompilasi |
| Streak 30 / 100 hari | story | saat terjadi |

Bukan peringkat, bukan "anak terbaik". Setiap anak yang mencapai tonggak muncul. Yang dirayakan adalah tonggak, bukan perbandingan.

## Mekanisme "orang tua ikut membagikan"

- Saat Rumila memposting story dan **menandai akun orang tua**, Instagram menawarkan "Tambahkan ke story Anda" ke orang tua itu. Satu ketukan, jangkauan dobel, tanpa fitur tambahan di aplikasi.
- Dari aplikasi, kartu yang sama (9:16 dan 1:1) bisa dibagikan lewat Web Share API ke Instagram pribadi mereka, lengkap dengan QR verifikasi.

## Alur produksi (otomatis, disetujui manusia)

```
tabel certificate / reward (mingguan)
  → filter: hanya anak dengan izin hidup
  → render kartu dari template (puppeteer, sama dengan kartu di aplikasi)
  → draf caption ID/EN + tag orang tua
  → antrean "Papan Prestasi" di admin  ──▶ PO setujui
  → Meta Graph API (akun Instagram Business Rumila): terbitkan / jadwalkan
  → catat post_id per anak (untuk penarikan jika izin dicabut)
```

Skill: `akademi-sosial` (menghasilkan antrean mingguan). Pemeriksa otomatis sebelum masuk antrean: tidak ada nama lengkap, tidak ada wajah bila izin foto mati, caption tidak menyebut sekolah/kota.

## Ukuran keberhasilan

- Tiap kartu dan halaman verifikasi membawa tautan dengan penanda sumber (`?src=ig-rumila`, `?src=ig-ortu`).
- Yang diukur: pendaftar baru per sumber, persentase orang tua yang menyalakan izin, persentase story yang dibagikan ulang orang tua.

## Tabel tambahan

```sql
alter table learner add column share_consent jsonb;   -- {ig: bool, face: bool, parent_handle: text, at: timestamptz}
create table social_post (
  id uuid primary key, learner_id uuid, kind text, platform text,
  post_id text, posted_at timestamptz, withdrawn_at timestamptz
);
```
