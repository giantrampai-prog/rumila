# Eval skill peninjau

Tujuan: memastikan peninjau **menolak** kompetensi buruk dan **meloloskan** golden set. Jalankan tiap kali SKILL.md atau rubrik.md berubah.

Kasus di `kasus/`: tiap berkas JSON adalah `KurikulumFile` kecil dengan `_harapan` per id (`LULUS` / `REVISI`) dan `_alasan`. Peninjau dijalankan pada berkas itu; hasil dibandingkan dengan `_harapan`.

Lulus eval bila: semua `_harapan` cocok, dan tiap REVISI menyebut kriteria rubrik yang sama dengan `_alasan`.
