# Keputusan 06 — SAINS SD1–SD3 (putaran 2)

Sumber butir: docs/akademi/audit-qc-2026-11-21/perbaikan-06-sains-sd1-3.md (bagian "Butuh keputusan owner") + 8 pasang instruksi kembar.
24 paket diubah (versi patch naik) + content/kurikulum/SAINS-SD2.json (pernyataan dan catatan SAINS.SD2.PENGAMATAN.01).
Validasi skema: 810 paket valid, 0 error. akademi:audit: 0 ERROR total, tidak ada WARNING untuk paket/kompetensi SAINS SD1–SD3 (8 WARNING instruksi-kembar milik kelompok ini sudah hilang).

## Keputusan yang diambil
| butir | keputusan | perubahan |
|---|---|---|
| sd1-sains-dorong-tarik-rumah / GAYA.01 (🗄️ untuk tutup dan buka laci) | Ganti kartu dorong, bukan pakai 🫴 (🫴 sudah jadi ikon rak tarik) | item `tutuplaci` → `pintu` 🚪 "mendorong pintu sampai tertutup" (kunci `i-tutuplaci` → `i-pintu`); warna tambahan pada `bukalaci` dihapus karena tidak perlu lagi |
| sd1-sains-ukur-jengkal-temuan-kebun / PENGAMATAN.01 (kunci yatim, max 8) | Hapus kunci yatim, turunkan batas | hapus `batangtebu`, `bambu`, `batangpisang` (id+en); `knobs.maxSpans.max` 8 → 7 (= item terpanjang, akar 7) |
| sd2-sains-hewan-tumbuh-besar & sd2-sains-perbaiki-hewan-tumbuh-besar / TUMBUH-BESAR.01 (seriasi ukuran) | Samakan skala tahap 2–3 | di 10 urutan kedua paket, `scale` tahap 2 dan 3 = 0.95 (tahap 1 tetap 0.6, tahap 4 tetap 1.3). Anak harus membaca ciri (mulai berlari / kaki panjang, tanduk kecil, dll.) untuk menaruh dua tahap tengah |
| sd2-sains-hitung-kaki-hewan / CIRI-HEWAN.02 (siput "tanpa kaki") | Hapus siput (belut 🐍 tidak dipakai karena ular 🐍 sudah ada di rak yang sama) | item + kunci `i-siput` dihapus; rak tanpa kaki tinggal ular, cacing, ikan (3) |
| sd2-sains-turus-hewan-tepi-hutan / PENGAMATAN.01 (kompetensi serangga, isi mamalia+burung) | Ubah pernyataan jadi "hewan" (paket kembarnya sudah serangga kebun; mengganti isi tepi hutan ke serangga akan membuat dua paket nyaris kembar karena emoji serangga terbatas) | SAINS-SD2.json: pernyataan → "Aku bisa mencatat hewan yang kutemukan, misalnya serangga, dengan turus untuk tiga jenis sekaligus" / "I can record the animals I find, such as insects, with tally marks for three kinds at once"; catatan konteks → "survei serangga kebun sekolah dan hewan tepi hutan (monyet, tupai, burung, rusa, landak)". Paket tidak diubah |
| sd3-sains-kelompok-hewan-penipu / HEWAN.01 (kuda laut 🐠 tidak menipu) | Ganti dengan hewan penipu yang punya emoji jelas | `kudalaut` → `belut` 🐍 #6d4c41 "belut sawah" (rak ikan): bentuknya seperti ular tetapi ikan (kunci `i-kudalaut` → `i-belut`) |
| sd3-sains-fosil-atau-bukan & sd3-sains-temuan-tepi-sungai / FOSIL.01 (warna cokelat = fosil) | Acak hubungan warna–jawaban | fosil-atau-bukan: `tulangdino` tanpa warna; `mainan` 🦖 dan `batukali` 🪨 diberi #8d6e63. Tepi sungai: `gigihiu` dan `amonit` tanpa warna; `ranting` #8d6e63, `jejakkucing` #6d4c41 (lumpur). Kini ada fosil tak berwarna dan bukan-fosil cokelat di kedua paket; label tetap |
| sd3-sains-licin-sampai-kasar & sd3-sains-perbaiki-licin-kasar / GAYA.01 (benda beroda; karpet vs kerikil) | Ganti benda beroda jadi benda yang meluncur; kerikil → amplas | judul urutan: mobil mainan → "Kotak bekal", kelereng (digelindingkan) → "Sandal", truk mainan → "Penghapus papan tulis" (semua "didorong sama kuat"). Semua "jalan berkerikil" 🪨 → "kertas amplas" 🟫 #a1887f; karpet berbulu 🟫 #a1887f → 🟥 supaya tidak kembar dengan amplas dalam satu urutan (dicek otomatis: tak ada gambar kembar di satu urutan) |
| instruksi kembar: sd2-sains-alami-atau-buatan-dapur / sd2-sains-alami-atau-buatan | Bedakan | dapur: "Lihat bahan-bahan di dapur. …"; umum: "Bahan alami diambil langsung dari alam. Bahan buatan dibuat oleh manusia. Taruh tiap bahan ke raknya." |
| instruksi kembar: sd2-sains-aman-dengan-listrik / sd2-sains-aman-listrik-di-luar | Bedakan | rumah: "Saat memakai alat listrik di rumah dan saat bermain, …"; luar: "Di luar rumah ada kabel, gardu listrik, dan petir. …" |
| instruksi kembar: sd2-sains-hitung-kaki-hewan-lain / sd2-sains-hitung-kaki-hewan | Bedakan paket "-lain" (memuat paus, lumba-lumba) | "-lain": "Hewan-hewan lain menunggu! Ada juga yang hidup di laut. Hitung kakinya, …"; paket dasar tetap |
| instruksi kembar: sd2-sains-penyebab-gerak-taman-bermain / sd2-sains-penyebab-gerak | Bedakan keduanya | umum: "Dorongan dan tarikan membuat benda bergerak, berhenti, atau berbelok. Sentuh penyebabnya, …"; taman: "Di taman bermain, angin, air, tangan, dan kaki menggerakkan benda. …" |
| instruksi kembar: sd3-sains-logam-ditarik-magnet-bengkel / sd3-sains-logam-ditarik-magnet | Bedakan keduanya | bengkel: "Di bengkel ada banyak benda logam. …"; umum: "Apakah semua logam ditarik magnet? …" |
| instruksi kembar: sd3-sains-produsen-atau-konsumen / sd3-sains-produsen-konsumen-sawah-laut | Bedakan paket sawah-laut | "Di sawah dan di laut, siapa membuat makanan sendiri dan siapa makan makhluk lain? …"; paket umum tetap |
| instruksi kembar: sd3-sains-tembus-cahaya-di-sekolah / sd3-sains-tembus-pandang-cahaya-tidak | Bedakan keduanya | sekolah: "… benda-benda di sekolah … Cahayanya tembus jelas, tembus buram, atau tidak tembus?"; umum: "… Benda di baliknya terlihat jelas, buram, atau tidak terlihat?" |
| instruksi kembar: sd3-sains-perbaiki-siklus-hidup-air / sd3-sains-perbaiki-siklus-hidup-kebun | Bedakan keduanya + tambah petunjuk konsep (metamorfosis vs membesar) | air: "Ini siklus hidup hewan di air dan tepi air. Ada yang berubah bentuk, ada yang hanya membesar. …"; kebun: "Ini siklus hidup hewan di kebun. Ada yang melewati kepompong, ada yang hanya membesar. …" |

## Kalimat suara berubah
(dibuat otomatis: locale.id tiap paket dibandingkan dengan `git show HEAD:<berkas>`)

| paket | kunci | lama | baru |
|---|---|---|---|
| sd2-sains-alami-atau-buatan-dapur | instruksi | Bahan ini langsung dari alam atau dibuat manusia? Taruh ke raknya. | Lihat bahan-bahan di dapur. Bahan ini langsung dari alam atau dibuat manusia? Taruh ke raknya. |
| sd2-sains-alami-atau-buatan | instruksi | Bahan ini langsung dari alam atau dibuat manusia? Taruh ke raknya. | Bahan alami diambil langsung dari alam. Bahan buatan dibuat oleh manusia. Taruh tiap bahan ke raknya. |
| sd2-sains-aman-dengan-listrik | instruksi | Taruh tiap kebiasaan ke rak aman atau berbahaya. | Saat memakai alat listrik di rumah dan saat bermain, kebiasaan ini aman atau berbahaya? Taruh ke raknya. |
| sd2-sains-aman-listrik-di-luar | instruksi | Taruh tiap kebiasaan ke rak aman atau berbahaya. | Di luar rumah ada kabel, gardu listrik, dan petir. Kebiasaan ini aman atau berbahaya? Taruh ke raknya. |
| sd2-sains-hitung-kaki-hewan-lain | instruksi | Hitung kaki tiap hewan, lalu taruh ke rak yang angkanya sama. | Hewan-hewan lain menunggu! Ada juga yang hidup di laut. Hitung kakinya, lalu taruh ke rak yang angkanya sama. |
| sd2-sains-hitung-kaki-hewan | i-siput | siput | —(dihapus) |
| sd2-sains-penyebab-gerak-taman-bermain | instruksi | Benda tidak bergerak sendiri. Sentuh gambar yang terjadi lebih dulu. | Di taman bermain, angin, air, tangan, dan kaki menggerakkan benda. Sentuh penyebabnya, yang terjadi lebih dulu. |
| sd2-sains-penyebab-gerak | instruksi | Benda tidak bergerak sendiri. Sentuh gambar yang terjadi lebih dulu. | Dorongan dan tarikan membuat benda bergerak, berhenti, atau berbelok. Sentuh penyebabnya, yang terjadi lebih dulu. |
| sd3-sains-logam-ditarik-magnet-bengkel | instruksi | Dekatkan magnet ke tiap benda. Taruh ke rak ditarik atau tidak ditarik. | Di bengkel ada banyak benda logam. Dekatkan magnet ke tiap benda: ditarik atau tidak? Taruh ke raknya. |
| sd3-sains-logam-ditarik-magnet | instruksi | Dekatkan magnet ke tiap benda. Taruh ke rak ditarik atau tidak ditarik. | Apakah semua logam ditarik magnet? Dekatkan magnet ke tiap benda, lalu taruh ke rak ditarik atau tidak ditarik. |
| sd3-sains-produsen-konsumen-sawah-laut | instruksi | Membuat makanan sendiri atau makan makhluk lain? Taruh ke raknya. | Di sawah dan di laut, siapa membuat makanan sendiri dan siapa makan makhluk lain? Taruh ke raknya. |
| sd3-sains-tembus-cahaya-di-sekolah | instruksi | Bayangkan menyinari tiap benda dengan senter. Taruh ke raknya. | Bayangkan menyinari benda-benda di sekolah dengan senter. Cahayanya tembus jelas, tembus buram, atau tidak tembus? Taruh ke raknya. |
| sd3-sains-tembus-pandang-cahaya-tidak | instruksi | Bayangkan menyinari tiap benda dengan senter. Taruh ke raknya. | Bayangkan menyinari tiap benda dengan senter. Benda di baliknya terlihat jelas, buram, atau tidak terlihat? Taruh ke raknya. |
| sd3-sains-perbaiki-siklus-hidup-air | instruksi | Dua tahap tertukar. Tukar sekali supaya siklusnya benar. | Ini siklus hidup hewan di air dan tepi air. Ada yang berubah bentuk, ada yang hanya membesar. Dua tahap tertukar: tukar sekali supaya benar. |
| sd3-sains-perbaiki-siklus-hidup-kebun | instruksi | Dua tahap tertukar. Tukar sekali supaya siklusnya benar. | Ini siklus hidup hewan di kebun. Ada yang melewati kepompong, ada yang hanya membesar. Dua tahap tertukar: tukar sekali supaya benar. |
| sd1-sains-dorong-tarik-rumah | i-tutuplaci | menutup laci | —(dihapus) |
| sd1-sains-dorong-tarik-rumah | i-pintu | —(baru) | mendorong pintu sampai tertutup |
| sd1-sains-ukur-jengkal-temuan-kebun | batangtebu | batang tebu | —(dihapus) |
| sd1-sains-ukur-jengkal-temuan-kebun | bambu | batang bambu | —(dihapus) |
| sd1-sains-ukur-jengkal-temuan-kebun | batangpisang | batang pisang rebah | —(dihapus) |
| sd3-sains-kelompok-hewan-penipu | i-kudalaut | kuda laut | —(dihapus) |
| sd3-sains-kelompok-hewan-penipu | i-belut | —(baru) | belut sawah |
| sd3-sains-licin-sampai-kasar | s-mobil | Mobil mainan didorong sama kuat | Kotak bekal didorong sama kuat |
| sd3-sains-licin-sampai-kasar | s-kelereng | Kelereng digelindingkan sama kuat | Sandal didorong sama kuat |
| sd3-sains-licin-sampai-kasar | kaleng-4 | jalan berkerikil | kertas amplas |
| sd3-sains-licin-sampai-kasar | balok-4 | jalan berkerikil | kertas amplas |
| sd3-sains-licin-sampai-kasar | kotak-sepatu-4 | jalan berkerikil | kertas amplas |
| sd3-sains-perbaiki-licin-kasar | s-mobil | Mobil mainan didorong sama kuat | Kotak bekal didorong sama kuat |
| sd3-sains-perbaiki-licin-kasar | s-kelereng | Kelereng digelindingkan sama kuat | Sandal didorong sama kuat |
| sd3-sains-perbaiki-licin-kasar | s-truk | Truk mainan didorong sama kuat | Penghapus papan tulis didorong sama kuat |
| sd3-sains-perbaiki-licin-kasar | truk-kerikil | jalan berkerikil | kertas amplas |
| sd3-sains-perbaiki-licin-kasar | kardus-kerikil | jalan berkerikil | kertas amplas |
| sd3-sains-perbaiki-licin-kasar | pensil-kerikil | jalan berkerikil | kertas amplas |

Catatan: pernyataan kompetensi SAINS.SD2.PENGAMATAN.01 di kurikulum juga berubah (bukan locale paket); rekam ulang bila pernyataan kompetensi ikut disuarakan.

## Butuh fitur baru
| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| — | — | — | Tidak ada. Butir kelompok ini selesai dengan emoji/bentuk yang sudah ada |

## Tidak dikerjakan
| butir | alasan |
|---|---|
| — | Semua 8 butir keputusan dan 8 pasang instruksi kembar dikerjakan |
