# Golden set

Contoh yang dinyatakan **standar emas** oleh Product Owner. Semua skill AI diberi berkas ini sebagai acuan gaya dan mutu; eval membandingkan keluaran baru dengan ini.

- `kompetensi.json` — 5 kompetensi PAUD (3 Matematika, 2 Coding). Perhatikan: satu kalimat, aksi teramati, `catatan` menjelaskan jebakan dan beda dengan kompetensi tetangga.
- `paket-*.json` — 5 paket konten, satu per mekanik yang sudah ada skemanya (dagang, pilah ×2, urutkan, navigasi). Perhatikan: instruksi satu kalimat yang bisa dibacakan, knob punya keterangan, item dibangkitkan dari seed bukan ditulis satu per satu.

Validasi: `npm run akademi:validate`.

Status: ditulis Claude 24 Okt 2026, **belum diratifikasi PO**. Ubah apa pun yang tidak sesuai selera; berkas ini adalah sumber kebenaran gaya.
