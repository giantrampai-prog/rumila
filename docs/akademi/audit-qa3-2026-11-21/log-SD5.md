# QA putaran 3 — SD5 (MAT, SAINS, KODE)

Sumber: dump `qa3/dump/{MAT,SAINS,KODE}-SD5.txt` dan JSON `content/paket/*/sd5-*.json` (96 paket).
Semua kunci soal pilih, rak kelompok, dan urutan dihitung ulang dengan tangan, termasuk aritmetika MAT, bubble sort, trace kalau/ulangi, dan indeks daftar KODE. **Tidak ada kunci yang salah.**
Ada juga skrip cek tambahan yang mencari emoji kartu yang sama dengan emoji rak, emoji kembar di rak berbeda, dan emoji kembar di satu soal pilih.
Validasi: `npm run -s akademi:validate` → 810 paket valid. `npm run -s akademi:audit` → ERROR 0, WARNING 0.

## 1. Temuan

| jenis | paket | kunci/bagian | masalah | tindakan |
|---|---|---|---|---|
| visual | sd5-sains-siklus-tumbuhan-perbaiki | pepaya-serbuk | Emoji 🦋 (kupu-kupu), tetapi labelnya "ngengat". | diperbaiki: label "kupu-kupu dan ngengat membawa serbuk sari ke kepala putik" (keduanya memang penyerbuk pepaya); EN ikut diubah. 1.0.3 → 1.0.4 |
| visual | sd5-sains-siklus-tumbuhan-perbaiki | kacanghijau-buah | "polong hitam", tetapi emoji 🫛 berwarna hijau. | diperbaiki: "polong tumbuh berisi biji hijau baru"; EN ikut diubah |
| visual | sd5-sains-adaptasi-tiga-wilayah | i-walrus | Kartu "walrus", tetapi emoji 🦭 adalah anjing laut (tanpa gading). | diperbaiki: "anjing laut: lapisan lemak sangat tebal di bawah kulit"; EN "seal: …". 1.0.0 → 1.0.1 |
| visual | sd5-sains-tertarik-magnet | kalengalu | "kaleng minuman aluminium" bergambar 🥤 (gelas kertas bersedotan). | diperbaiki: bentuk kaleng tegak `square` #b0bec5, width 0.6, scale 0.7 (🥫 tidak dipakai karena itu kaleng baja di rak lawan). 1.0.1 → 1.0.2 |
| visual | sd5-sains-penyebaran-biji | karet | Emoji 💥 sama dengan emoji rak "meletup sendiri", jadi jawabannya bocor. | diperbaiki: 🌰 (biji karet). 1.0.0 → 1.0.1 |
| visual | sd5-sains-penyebaran-biji | bakau | Emoji 🌊 sama dengan emoji rak "terbawa air", jadi bocor. | diperbaiki: batang hijau tegak (`square` #6d8b3a, width 0.25), seperti buah bakau yang panjang |
| visual | sd5-sains-biji-menjelajah-bukit | pandan | Emoji 🌊 sama dengan emoji rak "terbawa air", jadi bocor. | diperbaiki: 🍍 (buah pandan laut memang mirip nanas). 1.0.1 → 1.0.2 |
| visual | sd5-sains-larut-atau-tidak | rak tidak / kerikil | Kartu kerikil 🪨 sama dengan emoji rak "tidak larut", jadi bocor. Preseden: keputusan-07 menolak 🪨 untuk kartu karena alasan yang sama. | diperbaiki: emoji rak 🪨 → 👀 ("tetap terlihat"). 1.2.1 → 1.2.2 |
| visual | sd5-sains-berbunga-atau-tidak | rak tidak / paku, suplir | Dua kartu 🌿 sama dengan emoji rak "tidak berbunga" 🌿, jadi bocor. | diperbaiki: emoji rak → 🍂 (sama dengan paket bukit). 1.0.0 → 1.0.1 |
| visual | sd5-sains-tumbuhan-bukit-berbunga | rak bunga / sepatu | Kartu kembang sepatu 🌺 sama dengan emoji rak "bisa berbunga" 🌺. | diperbaiki: emoji rak → 💐. 1.0.1 → 1.0.2 |
| visual | sd5-sains-pemangsa-atau-mangsa | matasamping | Kartu 🐰 hampir sama dengan emoji rak mangsa 🐇, jadi bocor. | diperbaiki: 🐴 (kuda juga bermata di samping). 1.0.1 → 1.0.2 |
| tidak-sesuai | sd5-kode-ulangi-kalau-pasar | judul, instruksi | Judul dan instruksi menyebut "Di pasar, program kasir…", padahal 8 dari 12 soal bukan soal kasir (lampu, x × 2, nilai lulus, hitung angka 1–8, dll.). | diperbaiki: judul "Putaran dengan Syarat" dan instruksi tanpa kasir/pasar; EN ikut diubah. 1.0.0 → 1.0.1 |
| visual | sd5-sains-tamu-bunga-taman | kepalasari 🟡 | Kepala sari yang kuning bisa terasa jadi petunjuk di soal "kaki lebah jadi kuning". | ditolak: warna serbuk memang fakta. Di p-r5 "serbuk kuning" justru jawabannya kepala putik 🟢, jadi warna tidak selalu menunjuk jawaban |
| visual | sd5-sains-siklus-tumbuhan-perbaiki | biji/baru rambutan, durian, nangka (🌰 dan 🌰); padi (🌾 dan 🌾) | Dua tahap dalam satu urutan memakai emoji yang sama. | ditolak: label di bawah gambar membedakan ("biji … ditanam" lawan "ada biji baru"). Biji awal dan biji baru memang sama wujudnya, dan anak SD5 membaca label |
| visual | sd5-sains-adaptasi-tiga-wilayah | rubah 🦊 | Label "bulu putih tebal", tetapi emoji rubah berwarna oranye. | ditolak: tidak ada emoji rubah kutub, dan label sudah jelas |
| visual | sd5-sains-biji-menjelajah-bukit, sd5-sains-tumbuhan-bukit-berbunga | kopi ☕ | Kartu buah atau pohon kopi bergambar secangkir kopi. | ditolak: ☕ penanda kopi yang paling dikenali; tidak ada emoji tanaman kopi |
| visual | sd5-sains-siklus-tumbuhan-perbaiki | biji labu, terong 🫘 | Emoji kacang merah dipakai untuk biji labu dan biji terong. | ditolak: dipakai sebagai lambang umum "biji", dan label menyebut tumbuhannya |

MAT SD5 (40 paket): semua kunci, rak, dan urutan benar. Ini termasuk desimal, pembulatan, kali-bagi 10/100/1.000, melewati nol, urutan operasi, kali-bagi bersusun, prima, kuadrat-segitiga, uji bagi 4/8, pecahan campuran, kesetaraan, pecahan ±, selang waktu, segitiga, sudut garis lurus, keliling-luas, modus-median, dan peluang. Tidak ada temuan.
KODE SD5 (navigasi tidak bisa diverifikasi tangan; audit mesin ERROR 0): selain kasir/pasar, tidak ada temuan.

## 2. Kalimat suara berubah

| paket | kunci locale.id | lama | baru |
|---|---|---|---|
| sd5-sains-siklus-tumbuhan-perbaiki | pepaya-serbuk | ngengat membawa serbuk sari ke kepala putik | kupu-kupu dan ngengat membawa serbuk sari ke kepala putik |
| sd5-sains-siklus-tumbuhan-perbaiki | kacanghijau-buah | polong hitam tumbuh berisi biji hijau baru | polong tumbuh berisi biji hijau baru |
| sd5-sains-adaptasi-tiga-wilayah | i-walrus | walrus: lapisan lemak sangat tebal di bawah kulit | anjing laut: lapisan lemak sangat tebal di bawah kulit |
| sd5-kode-ulangi-kalau-pasar | judul | Putaran Kasir dengan Syarat | Putaran dengan Syarat |
| sd5-kode-ulangi-kalau-pasar | instruksi | Di pasar, program kasir mengulang langkah dan mengecek syarat di setiap putaran: telusuri putaran satu per satu, lalu pilih hasil akhirnya. | Program mengulang langkah dan mengecek syarat di setiap putaran: telusuri putaran satu per satu, lalu pilih hasil akhirnya. |

(Perubahan emoji/bentuk tidak mengubah teks suara.)

## 3. Butuh kode / Keputusan

- Butuh kode: tidak ada.
- Keputusan: `sd5-kode-ulangi-kalau-pasar` masih memakai `world: "pasar"`. Judulnya kini netral, jadi owner perlu memilih: biarkan pasar, atau ganti world. Selain itu, `world` tidak diubah.

## 4. Angka

- Paket diperiksa: 96 (MAT 40, SAINS 34, KODE 22)
- Temuan: 17
- Diperbaiki: 12 (di 10 paket; 5 kalimat suara berubah)
- Ditolak: 5
