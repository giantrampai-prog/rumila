// DIBUAT OTOMATIS oleh scripts/akademi-index.ts — jangan diedit.
// Sumber: content/kurikulum/*.json (9 berkas) dan content/paket/**/*.json (173 berkas).
// Perbarui dengan: npm run -s akademi:index

export const KURIKULUM_RAW = [
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "KODE.PAUD.URUTAN.01",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "URUTAN",
          "nama": {
            "id": "Urutan kegiatan",
            "en": "Sequencing"
          }
        },
        "statement": {
          "id": "Aku bisa memilih gambar mana yang terjadi lebih dulu dari 2 gambar kegiatan",
          "en": "I can choose which of 2 pictures of an activity happens first"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "1Mn.04",
            "note": "mulai memakai urutan pertama/berikutnya dalam konteks praktis (EY1)"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan",
          "cerita"
        ],
        "catatan": "Tahap sebelum 3 gambar: dua gambar (telur → ayam, biji → tunas, bola bersih → kotor), anak menyentuh yang terjadi lebih dulu. Umpan balik: dimainkan sebagai animasi dua adegan. Jebakan: pasangan yang bisa dibolak-balik (makan → main vs main → makan); pakai pasangan sebab-akibat jelas."
      },
      {
        "id": "KODE.PAUD.URUTAN.02",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "URUTAN",
          "nama": {
            "id": "Urutan kegiatan",
            "en": "Sequencing"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 3 gambar kegiatan sehari-hari menjadi urutan yang benar",
          "en": "I can put 3 pictures of a daily routine in the right order"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Mn.04",
            "note": "urutan kejadian (EY2); kode Cambridge Primary Computing 1CT.01 belum terverifikasi sehingga tidak dirujuk"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan",
          "cerita"
        ],
        "catatan": "Dasar algoritma: urutan punya akibat. Gambar harus punya petunjuk visual jelas (gelap → terang, piring penuh → kosong). Mulai 3 langkah; knob naik ke 4. Umpan balik: setelah disusun, urutan dimainkan sebagai animasi; kalau salah, kejadiannya terlihat lucu (sarapan sebelum bangun)."
      },
      {
        "id": "KODE.PAUD.POLA.01",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "POLA",
          "nama": {
            "id": "Pola AB",
            "en": "AB patterns"
          }
        },
        "statement": {
          "id": "Aku bisa melanjutkan pola AB dari dua warna, misalnya merah biru merah biru",
          "en": "I can continue an AB pattern of two colours, such as red blue red blue"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.WARNA.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "1Ms.06",
            "note": "mengenali pola di lingkungan (EY1)"
          },
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Ms.09",
            "note": "menyalin dan membuat pola berulang sederhana (EY2); di PAUD hanya melanjutkan unit AB"
          }
        ],
        "core": true,
        "mechanics": [
          "pola",
          "pilah"
        ],
        "catatan": "Pola ditampilkan minimal 3 ulangan (ABABAB) lalu dua slot kosong. Suara ikut berpola (tinggi-rendah) untuk anak yang lebih peka bunyi. Jebakan: distraktor warna ketiga; baru dimunculkan setelah 3 sukses. Knob: panjang pola tampil, jumlah slot kosong 1–2."
      },
      {
        "id": "KODE.PAUD.POLA.02",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "POLA",
          "nama": {
            "id": "Pola AB",
            "en": "AB patterns"
          }
        },
        "statement": {
          "id": "Aku bisa membuat pola AB sendiri dari dua benda pilihanku",
          "en": "I can make my own AB pattern from two objects I choose"
        },
        "depth": [
          "cipta"
        ],
        "prereq": [
          "KODE.PAUD.POLA.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Ms.09",
            "note": "membuat pola berulang (EY2)"
          }
        ],
        "core": false,
        "mechanics": [
          "pola",
          "bangun"
        ],
        "catatan": "Anak memilih 2 benda dari 4, lalu mengisi 6 slot. Benar bila ABABAB atau BABABA. Hasil disimpan sebagai hiasan di dunia (kalung, pagar) supaya ada alasan membuat. Pengaya karena 'cipta' belum wajib di PAUD. Jebakan: anak mengisi AAB tanpa sadar; tampilkan pola yang baru dibuat dimainkan sebagai lagu dua nada supaya kesalahan terdengar. Knob: jumlah slot 4–6."
      },
      {
        "id": "KODE.PAUD.PERINTAH.01",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "PERINTAH",
          "nama": {
            "id": "Memberi perintah",
            "en": "Giving commands"
          }
        },
        "statement": {
          "id": "Aku bisa menyuruh robot maju satu sampai tiga langkah untuk sampai ke bintang",
          "en": "I can tell robot to move forward one to three steps to reach the star"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_COMPUTING",
            "code": "2CT.06",
            "note": "pendahulu: instruksi presisi untuk tugas sederhana (Stage 2); di PAUD hanya perintah maju"
          }
        ],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Hanya perintah 'maju', tanpa belok. Grid lurus 1×4 sampai 1×5. Umpan balik: robot bergerak langkah demi langkah saat program dijalankan, bukan melompat. Jebakan: anak menekan maju terus; kalau lewat bintang, robot berhenti di ujung dan menggeleng, bukan 'salah'. Kamus belum punya kode computing usia 3–4."
      },
      {
        "id": "KODE.PAUD.PERINTAH.02",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "PERINTAH",
          "nama": {
            "id": "Memberi perintah",
            "en": "Giving commands"
          }
        },
        "statement": {
          "id": "Aku bisa menekan lompat, bukan maju, saat batu tepat di depan robot",
          "en": "I can press jump instead of forward when a rock is right in front of robot"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.PERINTAH.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Eksekusi langsung: tiap tombol dijalankan seketika, tanpa menyusun program. Batu selalu tepat satu petak di depan robot saat muncul, jadi yang diuji hanya memilih perintah yang tepat untuk keadaan. Versi 'susun 2–4 perintah dulu lalu jalankan' ditulis di TK A. Umpan balik: maju ke batu = tersandung dan tertawa, boleh coba lagi."
      },
      {
        "id": "KODE.PAUD.SEBAB-AKIBAT.01",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "SEBAB-AKIBAT",
          "nama": {
            "id": "Sebab akibat",
            "en": "Cause and effect"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk alat yang akan menyala sebelum menekan tombol yang sudah pernah kucoba",
          "en": "I can point to the device that will turn on before pressing a button I have tried before"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [],
        "core": true,
        "mechanics": [
          "simulasi"
        ],
        "catatan": "Papan 3 tombol warna dan 3 alat (lampu, kipas, radio) tanpa kabel terlihat. Putaran 1: anak bebas menekan dan melihat akibatnya (tidak dinilai). Putaran 2: sebelum menekan tombol yang sama, anak menunjuk alat yang akan menyala; itulah bukti. Satu tindakan yang dicatat: tunjukan sebelum tekan. Knob: jumlah pasangan 2–3, pemetaan diacak per sesi."
      },
      {
        "id": "KODE.PAUD.SEBAB-AKIBAT.02",
        "track": "KODE",
        "level": "PAUD",
        "unit": {
          "id": "SEBAB-AKIBAT",
          "nama": {
            "id": "Sebab akibat",
            "en": "Cause and effect"
          }
        },
        "statement": {
          "id": "Aku bisa meminta tolong tokoh lewat tombol bantuan saat alat di dunia tidak bekerja",
          "en": "I can ask robot for help with the help button when something in the world does not work"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "1UWd.04",
            "note": "minta tolong saat perangkat digital bermasalah (EY1)"
          }
        ],
        "core": false,
        "mechanics": [
          "simulasi",
          "cerita"
        ],
        "catatan": "Kebiasaan digital: alat 'macet' disengaja. Tombol bantuan tampil tetap, tidak berkedip dan tidak dipandu. Bukti sukses: menekan bantuan setelah ≤ 5 ketukan sia-sia; > 5 ketukan dicatat sebagai belum. Pengaya. Peninjau mencatat unit ini lebih dekat ke adab perangkat daripada koding; menunggu keputusan PO."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "KODE.TKA.URUTAN.01",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "URUTAN",
          "nama": {
            "id": "Urutan 3–5 langkah",
            "en": "Sequencing 3–5 steps"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 4 sampai 5 gambar kegiatan menjadi urutan yang benar",
          "en": "I can put 4 to 5 pictures of an activity in the right order"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Mn.04",
            "note": "urutan kejadian dengan ordinal (EY2)"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan",
          "cerita"
        ],
        "catatan": "Dari 3 ke 4–5 gambar. Urutan dimainkan sebagai animasi setelah disusun. Jebakan: dua gambar yang bisa bertukar tanpa salah (pakai baju, pakai sepatu); hindari di TK A. Knob: 4 → 5 gambar, petunjuk visual kuat → halus."
      },
      {
        "id": "KODE.TKA.URUTAN.02",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "URUTAN",
          "nama": {
            "id": "Urutan 3–5 langkah",
            "en": "Sequencing 3–5 steps"
          }
        },
        "statement": {
          "id": "Aku bisa menempel kata pertama, lalu, dan terakhir pada gambar supaya tokoh menceritakan urutannya dengan benar",
          "en": "I can put the words first, then, and last on the pictures so the character tells the sequence correctly"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.URUTAN.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Mn.04",
            "note": "bahasa urutan pertama/berikutnya/terakhir"
          }
        ],
        "core": false,
        "mechanics": [
          "cerita",
          "urutkan"
        ],
        "catatan": "Label = ikon + suara, bukan tulisan. Label menggerakkan narasi: tokoh bercerita mengikuti label; 'terakhir' ditempel di gambar ke-2 membuat cerita terpotong dan gambar sisa meredup, jadi kesalahan terlihat di dalam game. Bukti: narasi utuh 3 adegan. Jebakan: 'lalu' bisa dipakai dua kali pada 4 gambar; di TK A pakai 3 gambar. Knob: 3 → 4 gambar (dua 'lalu'). Pengaya."
      },
      {
        "id": "KODE.TKA.NAVIGASI.01",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "NAVIGASI",
          "nama": {
            "id": "Robot ke bintang",
            "en": "Robot to the star"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 2 sampai 4 perintah maju lalu menjalankannya supaya robot sampai di bintang",
          "en": "I can build 2 to 4 forward commands and then run them so robot reaches the star"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.PERINTAH.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_COMPUTING",
            "code": "2CT.06",
            "note": "pendahulu: instruksi presisi untuk tugas sederhana"
          }
        ],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Beda dari PAUD: perintah disusun dulu di rak, baru tombol jalan. Jalur masih lurus. Bukti: program tepat sampai bintang, tidak kurang dan tidak lewat. Knob: jarak 2 → 4."
      },
      {
        "id": "KODE.TKA.NAVIGASI.02",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "NAVIGASI",
          "nama": {
            "id": "Robot ke bintang",
            "en": "Robot to the star"
          }
        },
        "statement": {
          "id": "Aku bisa memakai perintah belok kiri atau kanan supaya robot menghadap ke bintang",
          "en": "I can use the turn left or turn right command so robot faces the star"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.NAVIGASI.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gp.01",
            "note": "pendahulu terdekat: bahasa arah; di sini anak memilih perintah belok, bukan mendeskripsikan"
          }
        ],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Kiri/kanan relatif terhadap robot, bukan layar; robot ditampilkan dari belakang supaya kiri anak = kiri robot. Jebakan: robot menghadap ke bawah layar; hindari di TK A. Knob: belok 1 → 2 kali."
      },
      {
        "id": "KODE.TKA.NAVIGASI.03",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "NAVIGASI",
          "nama": {
            "id": "Robot ke bintang",
            "en": "Robot to the star"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun program maju dan belok sampai 5 perintah untuk mencapai bintang di grid 3×3",
          "en": "I can build a program of up to 5 forward and turn commands to reach the star on a 3×3 grid"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.NAVIGASI.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_COMPUTING",
            "code": "2CT.06",
            "note": "pendahulu: instruksi presisi; 2P.02 dilepas karena anak tidak menyalin algoritma yang diberikan"
          }
        ],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Gabungan maju dan belok. Jalur punya satu belokan. Bukti: sampai bintang; efisiensi (jumlah perintah = optimal) dicatat tapi tidak jadi syarat di TK A. Knob: grid 3×3, belokan 1 → 2."
      },
      {
        "id": "KODE.TKA.POLA-ABC.01",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "POLA-ABC",
          "nama": {
            "id": "Pola ABC",
            "en": "ABC patterns"
          }
        },
        "statement": {
          "id": "Aku bisa melanjutkan pola ABC dari tiga warna atau tiga bentuk",
          "en": "I can continue an ABC pattern of three colours or three shapes"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.POLA.01",
          "MAT.PAUD.BENTUK-DASAR.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Ms.09",
            "note": "pola berulang unit tiga"
          }
        ],
        "core": true,
        "mechanics": [
          "pola",
          "pilah"
        ],
        "catatan": "Pola tampil 2 ulangan penuh (ABCABC) lalu 2–3 slot kosong. Jebakan: anak melanjutkan AB; distraktor ketiga wajib ada. Knob: warna → bentuk, slot kosong 2 → 3."
      },
      {
        "id": "KODE.TKA.POLA-ABC.02",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "POLA-ABC",
          "nama": {
            "id": "Pola ABC",
            "en": "ABC patterns"
          }
        },
        "statement": {
          "id": "Aku bisa memperbaiki satu bagian yang salah dalam pola AB atau ABC",
          "en": "I can fix the one part that is wrong in an AB or ABC pattern"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.POLA-ABC.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "3Ms.09",
            "note": "mengenali kesalahan dalam pola warna/bentuk (EY3)"
          }
        ],
        "core": true,
        "mechanics": [
          "pola"
        ],
        "catatan": "Pola 8 unsur, satu tertukar. Memperbaiki = menyentuh yang salah lalu memilih pengganti; dinilai dari hasil akhir. Jebakan: kesalahan di ujung lebih sulit dilihat daripada di tengah; mulai dari tengah."
      },
      {
        "id": "KODE.TKA.POLA-ABC.03",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "POLA-ABC",
          "nama": {
            "id": "Pola ABC",
            "en": "ABC patterns"
          }
        },
        "statement": {
          "id": "Aku bisa membuat pola ABC sendiri dari tiga benda pilihanku",
          "en": "I can make my own ABC pattern from three objects I choose"
        },
        "depth": [
          "cipta"
        ],
        "prereq": [
          "KODE.TKA.POLA-ABC.01",
          "KODE.PAUD.POLA.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_EY",
            "code": "2Ms.09",
            "note": "membuat pola berulang"
          }
        ],
        "core": false,
        "mechanics": [
          "pola",
          "bangun"
        ],
        "catatan": "Benar bila unit tiga berulang penuh minimal 2 kali, dalam urutan apa pun. Hasil jadi hiasan dunia. Jebakan: anak memakai hanya dua dari tiga benda (jadi AB); pola dimainkan sebagai tiga nada supaya terdengar. Knob: slot 6 → 9. Pengaya."
      },
      {
        "id": "KODE.TKA.DEBUG.01",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "DEBUG",
          "nama": {
            "id": "Debugging satu langkah",
            "en": "Debugging one step"
          }
        },
        "statement": {
          "id": "Aku bisa memperbaiki urutan 3 sampai 4 kegiatan yang satu gambarnya tertukar",
          "en": "I can fix a 3 to 4 step sequence in which one picture is in the wrong place"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.02"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "urutkan",
          "cerita"
        ],
        "catatan": "Dipindah dari PAUD sesuai tinjauan. Robot sudah menyusun 3–4 gambar, satu salah tempat; anak menukarnya. Bukti: urutan benar dengan tepat satu pertukaran; lebih dari satu pertukaran dicatat belum. Jebakan: menukar dua gambar yang sama-sama benar. Kamus belum punya kode computing terverifikasi untuk 'mengenali satu kesalahan dalam algoritma'; refs kosong. Knob: 3 → 4 gambar, posisi salah tengah → ujung."
      },
      {
        "id": "KODE.TKA.DEBUG.02",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "DEBUG",
          "nama": {
            "id": "Debugging satu langkah",
            "en": "Debugging one step"
          }
        },
        "statement": {
          "id": "Aku bisa memperbaiki satu perintah yang salah supaya program robot sampai di bintang",
          "en": "I can fix the one wrong command so the robot's program reaches the star"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.NAVIGASI.03"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Program 3–5 perintah sudah tersusun, satu salah (belok kiri seharusnya kanan, atau maju kurang). Anak menjalankan, melihat robot meleset, mengganti satu perintah. Bukti: sampai bintang dengan mengubah tepat satu perintah. Knob: posisi perintah salah awal → akhir. Refs kosong seperti .01: 2CT.06 bukan tentang debugging."
      },
      {
        "id": "KODE.TKA.KALAU.01",
        "track": "KODE",
        "level": "TKA",
        "unit": {
          "id": "KALAU",
          "nama": {
            "id": "Perintah sesuai keadaan",
            "en": "The right command for the situation"
          }
        },
        "statement": {
          "id": "Aku bisa memilih lompat untuk petak berbatu dan maju untuk petak kosong saat menyusun program robot",
          "en": "I can choose jump for rocky squares and forward for empty squares when building the robot's program"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.NAVIGASI.01",
          "KODE.PAUD.PERINTAH.02"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Benih kondisi tanpa blok 'kalau': batu terlihat sebelum program disusun; anak menaruh lompat tepat di posisi batu. Semantik (lihat docs/akademi/mekanik-navigasi.md): lompat selalu berpindah 2 petak, jadi lompat di petak kosong membuat robot melewati satu petak dan bisa meleset dari bintang; strategi 'lompat semua' gagal. Bukti: sampai bintang dan jumlah lompat = jumlah batu. Jebakan: menghitung petak awal sebagai langkah. Jalur lurus 4–5 petak. Knob: 1 → 2 batu, posisi batu awal → akhir."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "KODE.TKB.ULANGI.01",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "ULANGI",
          "nama": {
            "id": "Perulangan",
            "en": "Repeat loops"
          }
        },
        "statement": {
          "id": "Aku bisa memakai blok ulangi 3 kali untuk mengganti tiga perintah maju yang sama",
          "en": "I can use a repeat 3 times block instead of three identical forward commands"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.NAVIGASI.03"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Perkenalan perulangan: rak hanya muat 2 blok, jalur butuh 3 maju; satu-satunya jalan adalah blok ulangi 3. Jumlah ulangan tetap 3 di kompetensi ini (variasi jumlah ada di .02). Kamus belum punya kode perulangan terverifikasi; refs kosong. Knob: arah jalur (kanan → atas), rak 2 → 1 blok."
      },
      {
        "id": "KODE.TKB.ULANGI.02",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "ULANGI",
          "nama": {
            "id": "Perulangan",
            "en": "Repeat loops"
          }
        },
        "statement": {
          "id": "Aku bisa memilih berapa kali blok ulangi harus dijalankan supaya robot sampai tepat di bintang",
          "en": "I can choose how many times the repeat block should run so robot lands exactly on the star"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKB.ULANGI.01",
          "MAT.TKA.BILANGAN-1-10.03"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Angka ulangan dipilih dari 2–6; jalur 2–6 petak. Bukti: tepat di bintang, tidak lewat. Jebakan: anak memilih jumlah petak termasuk petak awal. Knob: isi blok 1 perintah → 2 perintah (maju, belok)."
      },
      {
        "id": "KODE.TKB.ULANGI.03",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "ULANGI",
          "nama": {
            "id": "Perulangan",
            "en": "Repeat loops"
          }
        },
        "statement": {
          "id": "Aku bisa membuat program lebih pendek dengan blok ulangi tanpa mengubah jalan robot",
          "en": "I can make a program shorter with a repeat block without changing the robot's path"
        },
        "depth": [
          "cipta"
        ],
        "prereq": [
          "KODE.TKB.ULANGI.02",
          "KODE.TKA.POLA-ABC.01"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Program panjang (maju maju belok maju maju belok) diberikan; anak menulis ulang dengan ulangi. Bukti: jalur sama, jumlah blok lebih sedikit. Pengaya."
      },
      {
        "id": "KODE.TKB.PROGRAM-5-8.01",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "PROGRAM-5-8",
          "nama": {
            "id": "Program 5–8 perintah",
            "en": "Programs of 5–8 commands"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun program 5 sampai 8 perintah maju dan belok sebelum dijalankan, sampai bintang di grid 4×4",
          "en": "I can build a program of 5 to 8 forward and turn commands before running it, to reach the star on a 4×4 grid"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.NAVIGASI.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_COMPUTING",
            "code": "2CT.06",
            "note": "instruksi presisi; 2P.02 dilepas karena tidak ada algoritma yang disalin"
          }
        ],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Dua belokan, satu dinding. Program disusun penuh sebelum jalan; tidak ada eksekusi langsung. Jebakan: belok dua kali ke arah yang sama; dinding mencegah jalan pintas. Knob: panjang 5 → 8, dinding 0 → 2."
      },
      {
        "id": "KODE.TKB.PROGRAM-5-8.02",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "PROGRAM-5-8",
          "nama": {
            "id": "Program 5–8 perintah",
            "en": "Programs of 5–8 commands"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk petak tujuan robot sebelum tiap perintah dijalankan satu per satu",
          "en": "I can point to the square robot will land on before each command is run one at a time"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKB.PROGRAM-5-8.01"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Prediksi satu langkah, berselang-seling dengan tombol 'langkah': tunjuk → jalankan → tunjuk. Bukti: tepat ≥ 4 dari 5 prediksi. Tracing program utuh di kepala ditulis di SD 1. Jebakan: setelah belok, 'maju' mengarah ke arah baru. Knob: tanpa belok → 1 belok. Pengaya."
      },
      {
        "id": "KODE.TKB.DEBUG-BANYAK.01",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "DEBUG-BANYAK",
          "nama": {
            "id": "Debugging beberapa langkah",
            "en": "Debugging several steps"
          }
        },
        "statement": {
          "id": "Aku bisa memperbaiki dua perintah yang salah dalam program robot supaya sampai di bintang",
          "en": "I can fix the two wrong commands in the robot's program so it reaches the star"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.DEBUG.02",
          "KODE.TKB.PROGRAM-5-8.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Program 6–8 perintah, dua salah di tempat berbeda. Bukti: sampai bintang dengan mengubah tepat dua perintah; mengganti lebih dari dua dicatat sebagai belum. Kamus belum punya kode debugging terverifikasi."
      },
      {
        "id": "KODE.TKB.DEBUG-BANYAK.02",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "DEBUG-BANYAK",
          "nama": {
            "id": "Debugging beberapa langkah",
            "en": "Debugging several steps"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk perintah yang akan membuat robot menabrak dinding sebelum perintah itu dijalankan",
          "en": "I can point to the command that will make robot hit the wall before that command is run"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKB.PROGRAM-5-8.02",
          "KODE.TKA.DEBUG.02"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Anak menjalankan program langkah demi langkah dan harus berhenti tepat satu langkah sebelum tabrakan, lalu menunjuk perintah berikutnya tanpa menjalankannya. Perintah aktif tidak disorot. Bukti: tunjukan tepat sebelum tabrakan; membiarkan robot menabrak dicatat belum. Jebakan: berhenti terlalu dini. Knob: posisi perintah penabrak awal → akhir. Pengaya."
      },
      {
        "id": "KODE.TKB.KONDISI.01",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "KONDISI",
          "nama": {
            "id": "Kondisi dengan rintangan",
            "en": "Conditions with obstacles"
          }
        },
        "statement": {
          "id": "Aku bisa memakai blok kalau batu lompat, kalau tidak maju supaya satu program berhasil di 3 jalur yang batunya berpindah",
          "en": "I can use an if rock then jump, else forward block so one program works on 3 paths where the rock moves"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.KALAU.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi"
        ],
        "catatan": "Blok kondisi satu keping dengan dua cabang bawaan ('batu? lompat / kosong? maju'), selalu memajukan robot. Rak tetap 4–6 slot, jalur 4–6 petak, dijalankan di 3 jalur dengan posisi batu berbeda; tanpa blok kalau, salah satu jalur gagal. Bukti: ketiga jalur berhasil dengan satu program. Kalau di dalam ulangi (bersarang) ditulis di SD 1. Kamus belum punya kode kondisi; refs kosong. Knob: 1 → 2 batu."
      },
      {
        "id": "KODE.TKB.DEKOMPOSISI.01",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "DEKOMPOSISI",
          "nama": {
            "id": "Memecah tugas",
            "en": "Breaking tasks down"
          }
        },
        "statement": {
          "id": "Aku bisa memilih titik bendera supaya jalur ke bintang terbagi jadi dua program yang masing-masing muat di rak 4 blok",
          "en": "I can choose where to put the flag so the path to the star splits into two programs that each fit a 4-block rack"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKB.PROGRAM-5-8.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "navigasi",
          "urutkan"
        ],
        "catatan": "Rak muat 4 blok, jalur butuh 6–7 perintah, jadi harus dipecah. Anak menaruh bendera sendiri (titik pecah), lalu menyusun program ke bendera dan dari bendera ke bintang. Bukti: bendera terjangkau ≤ 4 blok dan sisa ≤ 4 blok. Bendera di tempat salah membuat salah satu bagian tidak muat; itu umpan baliknya. Kamus belum punya kode dekomposisi terverifikasi. Knob: jalur 6 → 7, bendera bebas → 2 pilihan."
      },
      {
        "id": "KODE.TKB.DEKOMPOSISI.02",
        "track": "KODE",
        "level": "TKB",
        "unit": {
          "id": "DEKOMPOSISI",
          "nama": {
            "id": "Memecah tugas",
            "en": "Breaking tasks down"
          }
        },
        "statement": {
          "id": "Aku bisa mengelompokkan 6 gambar langkah membuat kue ke 3 tahap: siapkan, campur, panggang",
          "en": "I can group 6 picture steps of baking a cake into 3 stages: prepare, mix, bake"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.TKA.URUTAN.01"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "pilah",
          "urutkan"
        ],
        "catatan": "Dekomposisi di luar grid: langkah kecil dimasukkan ke tahap besarnya. Bukti: tiap tahap berisi 2 langkah yang benar. Pengaya."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "MAT.PAUD.BILANGAN-1-5.01",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BILANGAN-1-5",
          "nama": {
            "id": "Bilangan 1–5",
            "en": "Numbers 1–5"
          }
        },
        "statement": {
          "id": "Aku bisa menghitung 1 sampai 5 benda dengan menunjuk satu per satu",
          "en": "I can count 1 to 5 objects by pointing to each one"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01",
            "note": "langkah awal menuju pemahaman bilangan sampai 10"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.01",
            "note": "pendahulu: korespondensi satu-satu, di sini dibatasi 1–5"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "pilah",
          "cari"
        ],
        "catatan": "Aksi teramati: anak menyentuh benda satu per satu sambil jumlahnya bertambah. Jebakan: menghitung dua kali benda yang sama; item harus menyebar, bukan bertumpuk. Knob: jumlah benda 1–5."
      },
      {
        "id": "MAT.PAUD.BILANGAN-1-5.02",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BILANGAN-1-5",
          "nama": {
            "id": "Bilangan 1–5",
            "en": "Numbers 1–5"
          }
        },
        "statement": {
          "id": "Aku bisa mengambil benda sebanyak angka yang diminta, sampai 5",
          "en": "I can take as many objects as the number asked for, up to 5"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BILANGAN-1-5.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01",
            "note": "kardinalitas: berhenti pada jumlah yang diminta"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.01",
            "note": "pendahulu"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "pilah"
        ],
        "catatan": "Beda dengan .01: anak berhenti sendiri pada jumlah yang diminta (kardinalitas). Pembeli di Pasar Buah minta '3 jeruk'. Jebakan: anak mengambil semua yang ada. Knob: jumlah diminta 1–5, jumlah tersedia lebih banyak dari yang diminta."
      },
      {
        "id": "MAT.PAUD.BILANGAN-1-5.03",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BILANGAN-1-5",
          "nama": {
            "id": "Bilangan 1–5",
            "en": "Numbers 1–5"
          }
        },
        "statement": {
          "id": "Aku bisa mengambil benda sebanyak jari yang diacungkan sekejap, sampai 3",
          "en": "I can take as many objects as the fingers held up for a moment, up to 3"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BILANGAN-1-5.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-02",
            "note": "subitising; di PAUD dibatasi sampai 3"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.02",
            "note": "pendahulu: mengenali jumlah dalam pola tanpa menghitung"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "cari"
        ],
        "catatan": "Subitising tanpa lambang angka: pembeli mengacungkan 1–3 jari selama ±1 detik lalu menurunkan tangan; anak mengambil buah sebanyak itu. Jawaban jumlah-ke-jumlah, bukan pilih kotak angka. Latency pendek membedakan subitising dari menghitung. Jebakan: jari harus jelas terpisah. Knob: lama tampil 0,7–1,5 detik, maksimum 2–3."
      },
      {
        "id": "MAT.PAUD.BILANGAN-1-5.04",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BILANGAN-1-5",
          "nama": {
            "id": "Bilangan 1–5",
            "en": "Numbers 1–5"
          }
        },
        "statement": {
          "id": "Aku bisa mencocokkan kelompok 1 sampai 5 benda dengan kartu angka yang ada titik-titiknya",
          "en": "I can match a group of 1 to 5 objects to the number card that has matching dots"
        },
        "depth": [
          "kenal",
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BILANGAN-1-5.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01",
            "note": "komposisi bilangan lewat titik; lambang baru diperkenalkan"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.01",
            "note": "pendahulu: membaca lambang bilangan; di PAUD lambang selalu ditemani titik"
          }
        ],
        "core": false,
        "mechanics": [
          "pilah",
          "dagang"
        ],
        "catatan": "Pengaya. Di PAUD kartu angka selalu bertitik, jadi yang dibuktikan adalah mencocokkan jumlah ke jumlah dengan lambang ikut terlihat. Kompetensi 'mencocokkan ke lambang tanpa titik' ditulis di TK A sebagai kompetensi terpisah, bukan knob, supaya buktinya tidak tercampur. Jebakan: kartu 4 titik vs 5 titik mirip; susunan titik tetap seperti dadu."
      },
      {
        "id": "MAT.PAUD.BANDING.01",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BANDING",
          "nama": {
            "id": "Banyak sedikit, besar kecil, panjang pendek",
            "en": "More and fewer, big and small, long and short"
          }
        },
        "statement": {
          "id": "Aku bisa memilih kelompok yang jelas lebih banyak dari dua kelompok benda sampai 5",
          "en": "I can choose which of two groups of up to 5 objects clearly has more"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BILANGAN-1-5.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-PATTERNS-02",
            "note": "membandingkan jumlah; di PAUD sampai 5 dengan selisih jelas"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Np.03",
            "note": "pendahulu: ukuran relatif kuantitas"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "dagang"
        ],
        "catatan": "Perbandingan perseptual: selisih minimal 2 (1 vs 3, 2 vs 4, 3 vs 5), benda sejenis dan seukuran, tersusun rapi sejajar. Selisih 1 (4 vs 5) memaksa menghitung dua kelompok dan ditulis di TK A. Aksi: anak memberi piring yang lebih banyak ke tokoh yang lapar. Knob: hanya susunan (rapi → agak tersebar), bukan selisih."
      },
      {
        "id": "MAT.PAUD.BANDING.02",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BANDING",
          "nama": {
            "id": "Banyak sedikit, besar kecil, panjang pendek",
            "en": "More and fewer, big and small, long and short"
          }
        },
        "statement": {
          "id": "Aku bisa memilih benda yang lebih besar atau lebih kecil dari dua benda sejenis",
          "en": "I can choose the bigger or the smaller of two similar objects"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.02",
            "note": "pendahulu terdekat; kamus belum punya kode besar/kecil, 1Gg.02 bicara panjang"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "rawat"
        ],
        "catatan": "Aksi teramati: beri baju yang lebih besar ke beruang besar, mangkuk kecil ke anak kucing. Instruksi menyebut 'lebih besar' atau 'lebih kecil' bergantian. Jebakan: beda ukuran harus jelas (rasio ≥ 1,5) di awal."
      },
      {
        "id": "MAT.PAUD.BANDING.03",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BANDING",
          "nama": {
            "id": "Banyak sedikit, besar kecil, panjang pendek",
            "en": "More and fewer, big and small, long and short"
          }
        },
        "statement": {
          "id": "Aku bisa memilih benda yang lebih panjang atau lebih pendek dari dua benda sejenis",
          "en": "I can choose the longer or the shorter of two similar objects"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BANDING.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.02",
            "note": "bahasa panjang-pendek; di PAUD hanya dua benda"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "bangun"
        ],
        "catatan": "Dua benda sejenis (ular, pensil, kereta) sejajar di garis dasar yang sama, beda panjang jelas (rasio ≥ 1,5). Instruksi bergantian 'lebih panjang' / 'lebih pendek'. Mengurutkan 3 benda (seriasi) ditulis di TK A. Jebakan: benda tidak sejajar membuat panjang tidak terbaca."
      },
      {
        "id": "MAT.PAUD.BENTUK-DASAR.01",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BENTUK-DASAR",
          "nama": {
            "id": "Bentuk dasar",
            "en": "Basic shapes"
          }
        },
        "statement": {
          "id": "Aku bisa memasukkan lingkaran, segitiga, dan kotak ke lubang yang bentuknya sama",
          "en": "I can post circles, triangles, and squares into the hole of the same shape"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.01",
            "note": "pendahulu: memilah bentuk 2D; di PAUD tanpa menyebut jumlah sisi"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "bangun"
        ],
        "catatan": "Mekanik kotak-pos: bentuk hanya masuk ke lubang yang cocok, jadi umpan balik fisik. Jebakan: segitiga yang diputar; di awal orientasi sama dengan lubang, knob menambah rotasi. Warna bentuk diacak supaya anak memilah bentuk, bukan warna."
      },
      {
        "id": "MAT.PAUD.BENTUK-DASAR.02",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "BENTUK-DASAR",
          "nama": {
            "id": "Bentuk dasar",
            "en": "Basic shapes"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan benda berbentuk lingkaran, segitiga, atau kotak di sekitar robot",
          "en": "I can find things shaped like a circle, triangle, or square around robot"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BENTUK-DASAR.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.01",
            "note": "pendahulu"
          }
        ],
        "core": true,
        "mechanics": [
          "cari"
        ],
        "catatan": "Dari bentuk abstrak ke benda nyata: jam dinding, atap rumah, jendela. Instruksi audio menyebut satu bentuk per putaran. Jebakan: benda dengan dua bentuk (rumah = kotak + segitiga); hindari di PAUD."
      },
      {
        "id": "MAT.PAUD.WARNA.01",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "WARNA",
          "nama": {
            "id": "Warna dasar",
            "en": "Basic colours"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk benda berwarna merah, biru, kuning, atau hijau saat namanya disebut",
          "en": "I can point to the red, blue, yellow, or green object when its name is said"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [],
        "refs": [],
        "core": true,
        "mechanics": [
          "cari",
          "ucap"
        ],
        "catatan": "Pengenalan nama warna (reseptif) sebelum memilah. Instruksi audio: 'Mana yang merah?'. Empat benda sejenis beda warna. Belum ada kode kerangka internasional untuk pengenalan warna; dibiarkan kosong daripada memaksakan."
      },
      {
        "id": "MAT.PAUD.WARNA.02",
        "track": "MAT",
        "level": "PAUD",
        "unit": {
          "id": "WARNA",
          "nama": {
            "id": "Warna dasar",
            "en": "Basic colours"
          }
        },
        "statement": {
          "id": "Aku bisa mengelompokkan benda menurut warnanya: merah, biru, kuning, hijau",
          "en": "I can sort objects by colour: red, blue, yellow, green"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.WARNA.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ss.02",
            "note": "pendahulu: mengorganisasi data kategorikal dengan benda nyata"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "cari"
        ],
        "catatan": "Empat warna dasar saja. Benda harus beragam bentuk supaya anak memilah berdasar warna, bukan bentuk. Mulai 2 keranjang, knob naik ke 4. Kamus belum punya kode EY untuk mengelompokkan warna; 1Ss.02 dipakai sebagai pendahulu."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "MAT.TKA.BILANGAN-1-10.01",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BILANGAN-1-10",
          "nama": {
            "id": "Bilangan 1–10",
            "en": "Numbers 1–10"
          }
        },
        "statement": {
          "id": "Aku bisa menghitung 1 sampai 10 benda dengan menunjuk satu per satu",
          "en": "I can count 1 to 10 objects by pointing to each one"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BILANGAN-1-5.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.01",
            "note": "pendahulu; di TK A dibatasi 10"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "pilah",
          "cari"
        ],
        "catatan": "Lanjutan PAUD 1–5. Benda tersebar acak, bukan berbaris, supaya anak harus melacak mana yang sudah dihitung. Jebakan: menghitung ulang; tandai benda yang sudah disentuh dengan redup. Knob: jumlah 6–10, susunan rapi → tersebar."
      },
      {
        "id": "MAT.TKA.BILANGAN-1-10.02",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BILANGAN-1-10",
          "nama": {
            "id": "Bilangan 1–10",
            "en": "Numbers 1–10"
          }
        },
        "statement": {
          "id": "Aku bisa mengambil benda sebanyak angka yang diminta, sampai 10",
          "en": "I can take as many objects as the number asked for, up to 10"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.01",
          "MAT.PAUD.BILANGAN-1-5.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01",
            "note": "kardinalitas sampai 10"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.01",
            "note": "pendahulu"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "pilah"
        ],
        "catatan": "Pembeli minta '7 jeruk' lewat suara; yang tersedia 10–12. Jebakan: anak mengambil semua. Knob: jumlah diminta 6–10, jenis buah dalam satu pesanan 1–2."
      },
      {
        "id": "MAT.TKA.BILANGAN-1-10.03",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BILANGAN-1-10",
          "nama": {
            "id": "Bilangan 1–10",
            "en": "Numbers 1–10"
          }
        },
        "statement": {
          "id": "Aku bisa mencocokkan kelompok 1 sampai 10 benda dengan kartu angka tanpa titik",
          "en": "I can match a group of 1 to 10 objects to its number card without dots"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.01",
          "MAT.PAUD.BILANGAN-1-5.04"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.01",
            "note": "membaca lambang bilangan 0–20; di TK A sampai 10, hanya membaca"
          },
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "dagang"
        ],
        "catatan": "Lambang murni, kelanjutan kartu bertitik di PAUD. Cara jawab: memilah kelompok benda ke rak berlabel angka 1–10 (bukan memilih dari 3–4 kartu). Kartu 6 dan 9 rawan tertukar; tampilkan garis bawah. Knob: rentang 1–5 → 1–10, rak 5 → 10."
      },
      {
        "id": "MAT.TKA.BILANGAN-1-10.04",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BILANGAN-1-10",
          "nama": {
            "id": "Bilangan 1–10",
            "en": "Numbers 1–10"
          }
        },
        "statement": {
          "id": "Aku bisa menelusuri angka 1 sampai 5 dengan jari mengikuti panah",
          "en": "I can trace the numerals 1 to 5 with my finger following the arrows"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.01",
            "note": "pendahulu: menulis lambang; di TK A hanya menelusuri"
          }
        ],
        "core": false,
        "mechanics": [
          "telusur"
        ],
        "catatan": "Pengaya motorik halus, bukan tulisan rapi. Toleransi lebar jalur ±25% tinggi angka, arah goresan mengikuti panah berurutan. Hasil telusuran jadi 'mantra' yang membuka peti. Knob: lebar jalur, panah ditampilkan → disembunyikan."
      },
      {
        "id": "MAT.TKA.BANDING.01",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BANDING",
          "nama": {
            "id": "Membandingkan dan mengurutkan",
            "en": "Comparing and ordering"
          }
        },
        "statement": {
          "id": "Aku bisa memilih kelompok yang lebih banyak dari dua kelompok sampai 10, meski selisihnya satu",
          "en": "I can choose which of two groups of up to 10 objects has more, even when the difference is one"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BANDING.01",
          "MAT.TKA.BILANGAN-1-10.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-PATTERNS-02"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Np.03",
            "note": "pendahulu: ukuran relatif kuantitas"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "pilah"
        ],
        "catatan": "Selisih 1 memaksa menghitung kedua kelompok atau memasangkan satu-satu; keduanya dibolehkan dan dicatat sebagai strategi berbeda (latency). Jebakan: benda besar tapi sedikit; dipakai sejak awal di TK A. Knob: selisih 2 → 1, susunan sejajar → acak."
      },
      {
        "id": "MAT.TKA.BANDING.02",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BANDING",
          "nama": {
            "id": "Membandingkan dan mengurutkan",
            "en": "Comparing and ordering"
          }
        },
        "statement": {
          "id": "Aku bisa mengurutkan 3 benda dari paling pendek ke paling panjang",
          "en": "I can put 3 objects in order from shortest to longest"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BANDING.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.02",
            "note": "short, shorter, shortest"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan",
          "bangun"
        ],
        "catatan": "Seriasi 3 benda sejenis sejajar di garis dasar; dipindah dari PAUD sesuai tinjauan. Jebakan: anak mengurutkan dua ujung lalu menaruh tengah sembarang; beda panjang antar benda minimal 20%. Knob: 3 → 4 benda sebagai pengaya."
      },
      {
        "id": "MAT.TKA.BANDING.03",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BANDING",
          "nama": {
            "id": "Membandingkan dan mengurutkan",
            "en": "Comparing and ordering"
          }
        },
        "statement": {
          "id": "Aku bisa memilih benda yang lebih berat dari dua benda dengan melihat timbangan jungkat-jungkit",
          "en": "I can choose the heavier of two objects by looking at a balance scale"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.04",
            "note": "bahasa heavy, light; di TK A hanya dua benda dengan timbangan"
          }
        ],
        "core": false,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Berat tidak terlihat; anak menaruh dua benda di timbangan, melihat sisi yang turun, lalu memilih. Jebakan: benda besar tapi ringan (balon vs batu) sengaja dipakai setelah 3 sukses. Pengaya."
      },
      {
        "id": "MAT.TKA.BENTUK-RUANG.01",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BENTUK-RUANG",
          "nama": {
            "id": "Bentuk ruang",
            "en": "3D shapes"
          }
        },
        "statement": {
          "id": "Aku bisa memilah bola, kubus, dan tabung ke rak yang bentuknya sama",
          "en": "I can sort balls, cubes, and cylinders onto the shelf with the same shape"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.BENTUK-DASAR.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.03",
            "note": "pendahulu: memilah bentuk 3D; tanpa menyebut sisi/rusuk"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Gg.08",
            "note": "pendahulu: mengenali bentuk 3D pada benda sehari-hari"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "bangun"
        ],
        "catatan": "Benda nyata berbentuk ruang (bola sepak, dadu, kaleng), bukan bentuk abstrak, supaya beda dari bentuk datar di PAUD. Jebakan: kaleng dilihat dari atas tampak lingkaran; benda ditampilkan berputar pelan. Knob: 2 → 3 rak."
      },
      {
        "id": "MAT.TKA.BENTUK-RUANG.02",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "BENTUK-RUANG",
          "nama": {
            "id": "Bentuk ruang",
            "en": "3D shapes"
          }
        },
        "statement": {
          "id": "Aku bisa memilih bentuk yang bisa ditumpuk, bukan yang menggelinding, saat membangun menara",
          "en": "I can choose shapes that stack, not ones that roll, when building a tower"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BENTUK-RUANG.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.03",
            "note": "sifat bentuk 3D: menggelinding / menumpuk"
          }
        ],
        "core": false,
        "mechanics": [
          "bangun",
          "simulasi"
        ],
        "catatan": "Fisika sederhana: bola di atas kubus jatuh, kubus di atas tabung berdiri bertahan. Bukti: menara 4 tingkat berdiri. Jebakan: tabung bisa ditumpuk jika tegak; itu sengaja jadi penemuan, bukan penalti. Pengaya."
      },
      {
        "id": "MAT.TKA.UKUR-NONSTANDAR.01",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "UKUR-NONSTANDAR",
          "nama": {
            "id": "Mengukur dengan jengkal dan langkah",
            "en": "Measuring with hands and steps"
          }
        },
        "statement": {
          "id": "Aku bisa mengukur panjang benda dengan jengkal tangan, sampai 5 jengkal",
          "en": "I can measure how long something is in hand spans, up to 5 spans"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.01",
          "MAT.PAUD.BANDING.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Gg.03",
            "note": "pendahulu (Stage 2): mengukur dengan satuan tak baku; di TK A ≤ 5 jengkal dengan bantuan"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.02"
          }
        ],
        "core": false,
        "mechanics": [
          "simulasi",
          "bangun"
        ],
        "catatan": "Pengaya TK A; versi 10 jengkal tanpa bantuan jadi inti di TK B. Jengkal menempel otomatis (snap) ke ujung jengkal sebelumnya, jadi anak hanya mengulang dan menghitung. Bukti: jumlah jengkal yang disebut sama dengan yang terpasang. Knob: panjang 2 → 5 jengkal; lanjutan 'pilih benda yang lebih panjang dari jumlah jengkalnya' hanya sebagai knob akhir, bukan kompetensi sendiri."
      },
      {
        "id": "MAT.TKA.UANG-KENAL.01",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "UANG-KENAL",
          "nama": {
            "id": "Mengenal uang",
            "en": "Knowing money"
          }
        },
        "statement": {
          "id": "Aku bisa memilah koin dan uang kertas rupiah ke laci yang gambarnya sama",
          "en": "I can sort rupiah coins and notes into the drawer with the matching picture"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nm.01",
            "note": "mengenali uang mata uang setempat"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "dagang"
        ],
        "catatan": "Pecahan: koin Rp500, Rp1.000; kertas Rp2.000, Rp5.000, Rp10.000. Pengenalan visual, belum nilai. Jebakan: Rp1.000 koin vs kertas lama; pakai koin saja untuk Rp1.000. Knob: 2 → 5 laci."
      },
      {
        "id": "MAT.TKA.UANG-KENAL.02",
        "track": "MAT",
        "level": "TKA",
        "unit": {
          "id": "UANG-KENAL",
          "nama": {
            "id": "Mengenal uang",
            "en": "Knowing money"
          }
        },
        "statement": {
          "id": "Aku bisa membayar barang dengan koin seribuan sebanyak harganya, sampai 5 koin",
          "en": "I can pay for an item with Rp1,000 coins matching its price, up to 5 coins"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.UANG-KENAL.01",
          "MAT.TKA.BILANGAN-1-10.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nm.01"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.01",
            "note": "menghitung koin"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang"
        ],
        "catatan": "Harga tertulis sebagai '3 koin' dengan gambar, belum 'Rp3.000'. Bukti: jumlah koin di nampan sama dengan harga. Jebakan: anak menaruh semua koin. Knob: harga 1 → 5 koin, koin di laci lebih banyak dari harga. Beda dengan BILANGAN-1-10.02: di sini jumlah yang diminta tidak disebut, tetapi dibaca dari label harga bergambar koin; jembatan dari jumlah ke nilai uang."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "MAT.TKB.BILANGAN-20.01",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "BILANGAN-20",
          "nama": {
            "id": "Bilangan sampai 20",
            "en": "Numbers to 20"
          }
        },
        "statement": {
          "id": "Aku bisa menghitung sampai 20 benda dengan menunjuk satu per satu",
          "en": "I can count up to 20 objects by pointing to each one"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.01"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "cari"
        ],
        "catatan": "Benda 11–20 tersebar; anak boleh mengelompokkan dulu. Jebakan: kehilangan jejak di atas 12; benda yang sudah disentuh meredup. Knob: 11 → 20, susunan."
      },
      {
        "id": "MAT.TKB.BILANGAN-20.02",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "BILANGAN-20",
          "nama": {
            "id": "Bilangan sampai 20",
            "en": "Numbers to 20"
          }
        },
        "statement": {
          "id": "Aku bisa mencocokkan kelompok 11 sampai 20 benda dengan kartu angkanya",
          "en": "I can match a group of 11 to 20 objects to its number card"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.BILANGAN-20.01",
          "MAT.TKA.BILANGAN-1-10.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.01",
            "note": "membaca bilangan 0–20"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "dagang"
        ],
        "catatan": "Belum nilai tempat: 14 dikenali sebagai lambang utuh. Cara jawab: memilah kelompok ke rak berlabel 11–20. Jebakan: 12 vs 21; rak berurutan sehingga posisi membantu. Knob: 11–15 → 11–20."
      },
      {
        "id": "MAT.TKB.BILANGAN-20.03",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "BILANGAN-20",
          "nama": {
            "id": "Bilangan sampai 20",
            "en": "Numbers to 20"
          }
        },
        "statement": {
          "id": "Aku bisa melanjutkan hitungan dari angka mana pun sampai 20 dengan menyusun kartu berikutnya, misalnya 8, 9, 10",
          "en": "I can count on from any number up to 20 by laying the next cards, for example 8, 9, 10"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.BILANGAN-20.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.04",
            "note": "count on in ones from any number"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan",
          "pola",
          "ucap"
        ],
        "catatan": "Robot berdiri di petak 7; petak di depannya kosong tanpa angka. Anak menyusun kartu 8, 9, 10, … dari tumpukan acak (atau mengucapkannya bila ucap aktif). Bukti: tidak mulai dari 1 dan urutan benar. Jebakan: setelah 9 memilih 01. Knob: titik mulai 2 → 15, panjang 3 → 6."
      },
      {
        "id": "MAT.TKB.BILANGAN-20.04",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "BILANGAN-20",
          "nama": {
            "id": "Bilangan sampai 20",
            "en": "Numbers to 20"
          }
        },
        "statement": {
          "id": "Aku bisa menaksir jumlah benda sampai 20 dengan menggeser penanda di garis bilangan, meleset paling banyak 3",
          "en": "I can estimate how many objects there are, up to 20, by sliding a marker on a number line, within 3 of the real number"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.BILANGAN-20.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nc.03",
            "note": "estimate up to 20 and check by counting"
          }
        ],
        "core": false,
        "mechanics": [
          "dagang",
          "cari"
        ],
        "catatan": "Pembeli minta 'sekitar segini' sambil menunjuk keranjang penuh; benda tampil 2 detik, anak menggeser penanda di garis 0–20, lalu dihitung bersama sebagai umpan balik. Bukti dari posisi penanda saja. Jebakan: benda bertumpuk tampak lebih sedikit. Knob: lama tampil 3 → 1,5 detik, jumlah 8 → 20. Pengaya."
      },
      {
        "id": "MAT.TKB.TAMBAH-KURANG-10.01",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "TAMBAH-KURANG-10",
          "nama": {
            "id": "Tambah dan kurang sampai 10",
            "en": "Adding and subtracting to 10"
          }
        },
        "statement": {
          "id": "Aku bisa menggabungkan dua kelompok benda dan menyebut jumlahnya, sampai 10",
          "en": "I can put two groups of objects together and say how many there are, up to 10"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.02",
          "MAT.TKA.BILANGAN-1-10.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.02",
            "note": "addition as combining two sets"
          },
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-01"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "bangun",
          "ucap"
        ],
        "catatan": "Konkret: dua pembeli menaruh buah di satu keranjang; anak menggeser penanda di strip 1–10 (atau mengucapkan bila ucap aktif), bukan memilih dari beberapa kartu. Belum simbol '+'. Jebakan: anak menyebut jumlah kelompok terakhir saja. Knob: 2+2 → 6+4."
      },
      {
        "id": "MAT.TKB.TAMBAH-KURANG-10.02",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "TAMBAH-KURANG-10",
          "nama": {
            "id": "Tambah dan kurang sampai 10",
            "en": "Adding and subtracting to 10"
          }
        },
        "statement": {
          "id": "Aku bisa menunjukkan sisa benda setelah beberapa diambil dengan menaruh jumlah yang sama, sampai 10",
          "en": "I can show how many objects are left after some are taken away by placing the same number, up to 10"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.TAMBAH-KURANG-10.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.03",
            "note": "subtraction as take away"
          }
        ],
        "core": true,
        "mechanics": [
          "rawat",
          "dagang"
        ],
        "catatan": "Produksi jumlah, bukan kuis: 7 ikan di kolam, 3 ditangkap, kolam tertutup kabut; anak menaruh pelet makanan sebanyak ikan yang tersisa. Belum simbol '−'. Jebakan: menaruh sebanyak yang diambil. Knob: pengurang 1 → 5, kolam terlihat → tertutup."
      },
      {
        "id": "MAT.TKB.TAMBAH-KURANG-10.03",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "TAMBAH-KURANG-10",
          "nama": {
            "id": "Tambah dan kurang sampai 10",
            "en": "Adding and subtracting to 10"
          }
        },
        "statement": {
          "id": "Aku bisa langsung melengkapi menjadi 5: kalau sudah ada 2, aku menambah 3 tanpa menghitung",
          "en": "I can instantly make 5: if there are already 2, I add 3 without counting"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.TAMBAH-KURANG-10.01",
          "MAT.PAUD.BILANGAN-1-5.03"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-MATH-NUMBER-03",
            "note": "number bonds to 5"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.04",
            "note": "pendahulu: komplemen 10"
          }
        ],
        "core": true,
        "mechanics": [
          "pola",
          "dagang"
        ],
        "catatan": "Pembeli menunjukkan koinnya sekejap (±1 detik) lalu menggenggamnya; harga 5 koin; anak menambahkan koin dari laci sebanyak kekurangannya. Bukti: jumlah tambahan tepat dan latency < 3 detik; koin tidak terlihat sehingga tidak bisa dihitung maju. Knob: pasangan 5 → pasangan 10 sebagai pengaya."
      },
      {
        "id": "MAT.TKB.TAMBAH-KURANG-10.04",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "TAMBAH-KURANG-10",
          "nama": {
            "id": "Tambah dan kurang sampai 10",
            "en": "Adding and subtracting to 10"
          }
        },
        "statement": {
          "id": "Aku bisa membagi 2, 4, 6, atau 8 benda menjadi dua bagian sama banyak",
          "en": "I can share 2, 4, 6, or 8 objects into two equal groups"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.TAMBAH-KURANG-10.01",
          "MAT.TKA.BANDING.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Nf.02",
            "note": "setengah dari sekumpulan benda"
          },
          {
            "framework": "EYFS",
            "code": "ELG-MATH-PATTERNS-03",
            "note": "membagi sama rata"
          }
        ],
        "core": false,
        "mechanics": [
          "pilah",
          "rawat"
        ],
        "catatan": "Dua anak kucing, 6 ikan; bagi adil. Bukti: kedua piring sama. Benih setengah. Pengaya."
      },
      {
        "id": "MAT.TKB.UANG-10RB.01",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "UANG-10RB",
          "nama": {
            "id": "Uang sampai Rp10.000",
            "en": "Money up to Rp10,000"
          }
        },
        "statement": {
          "id": "Aku bisa menukar satu uang lima ribu dengan lima koin seribu, dan satu uang dua ribu dengan dua koin seribu",
          "en": "I can swap one Rp5,000 note for five Rp1,000 coins, and one Rp2,000 note for two Rp1,000 coins"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.UANG-KENAL.02",
          "MAT.TKA.BILANGAN-1-10.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Nm.01",
            "note": "pendahulu (Stage 2): nilai uang; di TK B hanya 1.000, 2.000, 5.000"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang",
          "pilah"
        ],
        "catatan": "Jembatan dari 'jumlah koin' (TK A) ke 'nilai pecahan'. Mesin tukar: anak menaruh satu lembar, mesin mengeluarkan koin, anak menyusun koin di cetakan nilai. Bukti: tukar dua arah benar. Jebakan: dua ribu dianggap dua koin? benar; lima ribu dianggap lima lembar? salah. Knob: satu arah → dua arah."
      },
      {
        "id": "MAT.TKB.UANG-10RB.02",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "UANG-10RB",
          "nama": {
            "id": "Uang sampai Rp10.000",
            "en": "Money up to Rp10,000"
          }
        },
        "statement": {
          "id": "Aku bisa membayar barang sampai Rp10.000 dengan gabungan uang seribu, dua ribu, dan lima ribu",
          "en": "I can pay for an item up to Rp10,000 using a mix of Rp1,000 coins and Rp2,000 and Rp5,000 notes"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.UANG-10RB.01",
          "MAT.TKB.TAMBAH-KURANG-10.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Nm.01",
            "note": "pendahulu: nilai & notasi uang"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Nm.02",
            "note": "pendahulu: kombinasi koin/uang kertas"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang"
        ],
        "catatan": "Harga ribuan bulat, ditulis 'Rp7.000' dengan gambar. Lebih dari satu kombinasi benar (5+2 atau 2+2+2+1). Jebakan: membayar lebih tanpa kembalian dianggap belum. Knob: harga 2 → 10 ribu, pecahan tersedia 1 jenis → 3 jenis."
      },
      {
        "id": "MAT.TKB.UANG-10RB.03",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "UANG-10RB",
          "nama": {
            "id": "Uang sampai Rp10.000",
            "en": "Money up to Rp10,000"
          }
        },
        "statement": {
          "id": "Aku bisa memberi kembalian yang benar dari Rp10.000 untuk barang seharga ribuan bulat",
          "en": "I can give the correct change from Rp10,000 for an item priced in whole thousands"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.UANG-10RB.02",
          "MAT.TKB.TAMBAH-KURANG-10.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ni.03",
            "note": "selisih"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Nm.01",
            "note": "pendahulu: nilai uang"
          }
        ],
        "core": true,
        "mechanics": [
          "dagang"
        ],
        "catatan": "Anak jadi kasir: pembeli bayar Rp10.000 untuk barang Rp7.000. Strategi hitung maju (7 → 10) ditampilkan sebagai bantuan pertama kali. Knob: harga 9 → 5 ribu. Berada di batas atas usia; dicatat sebagai inti yang boleh dikuasai di akhir TK B."
      },
      {
        "id": "MAT.TKB.JAM-BULAT.01",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "JAM-BULAT",
          "nama": {
            "id": "Jam bulat",
            "en": "O'clock"
          }
        },
        "statement": {
          "id": "Aku bisa membaca jam bulat pada jam dinding, misalnya pukul 3",
          "en": "I can read o'clock times on a wall clock, for example 3 o'clock"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.03",
          "MAT.TKB.BILANGAN-20.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gt.03",
            "note": "time to the hour; half hour ditunda ke SD 1"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Jarum panjang selalu di 12; anak memilih kartu 'pukul N'. Jebakan: jarum pendek vs panjang; jarum pendek diberi warna berbeda di awal. Knob: angka jam 1–6 → 1–12, warna bantuan hilang."
      },
      {
        "id": "MAT.TKB.JAM-BULAT.02",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "JAM-BULAT",
          "nama": {
            "id": "Jam bulat",
            "en": "O'clock"
          }
        },
        "statement": {
          "id": "Aku bisa memutar jarum jam ke jam bulat yang diminta untuk kegiatan",
          "en": "I can turn the clock hands to the o'clock time asked for the activity"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.JAM-BULAT.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gt.03"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gt.01",
            "note": "bahasa waktu: pagi, siang, malam"
          }
        ],
        "core": false,
        "mechanics": [
          "simulasi"
        ],
        "catatan": "Kebalikan .01: dari kata ke jam. 'sekolah pukul 7'; anak memutar jarum pendek. Pengaya."
      },
      {
        "id": "MAT.TKB.UKUR-NONSTANDAR.01",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "UKUR-NONSTANDAR",
          "nama": {
            "id": "Mengukur dengan satuan tak baku",
            "en": "Measuring with non-standard units"
          }
        },
        "statement": {
          "id": "Aku bisa mengukur panjang benda dengan jengkal tangan tanpa celah dan tumpang tindih, sampai 10 jengkal",
          "en": "I can measure how long something is in hand spans with no gaps or overlaps, up to 10 spans"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.UKUR-NONSTANDAR.01",
          "MAT.TKA.BILANGAN-1-10.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Gg.03",
            "note": "pendahulu (Stage 2): mengukur dengan satuan tak baku"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.02"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "bangun"
        ],
        "catatan": "Tanpa snap: anak menaruh jengkal sendiri. Celah/tumpang tindih terdeteksi dan ditunjukkan sebagai salah ukur, bukan salah hitung. Bukti: jumlah jengkal benar dan tanpa celah. Knob: panjang 4 → 10 jengkal, garis bayang bantu → hilang."
      },
      {
        "id": "MAT.TKB.UKUR-NONSTANDAR.02",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "UKUR-NONSTANDAR",
          "nama": {
            "id": "Mengukur dengan satuan tak baku",
            "en": "Measuring with non-standard units"
          }
        },
        "statement": {
          "id": "Aku bisa mengukur panjang benda dengan penggaris kubus dan menyebut jumlah kubusnya, sampai 10",
          "en": "I can measure an object with a cube ruler and say how many cubes long it is, up to 10"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.UKUR-NONSTANDAR.01",
          "MAT.TKB.BILANGAN-20.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Gg.04",
            "note": "pendahulu (Stage 2): mengukur dengan satuan baku"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "2Gg.12",
            "note": "pendahulu: skala sebagai garis bilangan"
          }
        ],
        "core": false,
        "mechanics": [
          "simulasi",
          "bangun"
        ],
        "catatan": "Penggaris berupa deretan kubus bernomor; tiap kubus satu satuan. Anak menyejajarkan ujung benda ke kubus pertama dan membaca nomor di ujung lain. Jebakan: mulai dari kubus ke-2. Penggaris cm dan pembulatan ditulis di SD 1. Pengaya."
      },
      {
        "id": "MAT.TKB.UKUR-NONSTANDAR.03",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "UKUR-NONSTANDAR",
          "nama": {
            "id": "Mengukur dengan satuan tak baku",
            "en": "Measuring with non-standard units"
          }
        },
        "statement": {
          "id": "Aku bisa memilih dan memakai alat yang tepat: penggaris kubus untuk panjang, timbangan untuk berat",
          "en": "I can choose and use the right tool: the cube ruler for length, the balance for weight"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.UKUR-NONSTANDAR.02",
          "MAT.TKA.BANDING.03"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Gg.08",
            "note": "memilih alat ukur yang sesuai"
          }
        ],
        "core": false,
        "mechanics": [
          "rawat",
          "simulasi"
        ],
        "catatan": "Hewan di klinik butuh diukur ('seberapa panjang ular?', 'seberapa berat kelinci?'); anak memilih alat lalu memakainya; alat salah memberi hasil yang jelas tidak menjawab (penggaris di kelinci: angka tapi tak bisa dicatat). Minimal 6 putaran diacak, bukan pencocokan 1:1. Kapasitas (gelas ukur) belum ada di kurikulum; menunggu PO. Pengaya."
      },
      {
        "id": "MAT.TKB.DATA.01",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "DATA",
          "nama": {
            "id": "Turus dan piktogram",
            "en": "Tallies and pictograms"
          }
        },
        "statement": {
          "id": "Aku bisa mencatat tiap hewan yang lewat dengan satu turus di baris hewan itu",
          "en": "I can record each animal that passes with one tally mark in that animal's row"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.01"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ss.02",
            "note": "mencatat data kategorikal dengan turus/daftar"
          }
        ],
        "core": true,
        "mechanics": [
          "cari",
          "simulasi"
        ],
        "catatan": "Hewan lewat satu per satu (kucing, bebek, kambing); anak menyentuh baris yang benar, turus muncul. Bukti: jumlah turus per baris sama dengan hewan yang lewat. Jebakan: dua hewan lewat berdekatan; jeda minimal 2 detik di awal. Knob: 3 → 4 jenis, jeda."
      },
      {
        "id": "MAT.TKB.DATA.02",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "DATA",
          "nama": {
            "id": "Turus dan piktogram",
            "en": "Tallies and pictograms"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun gambar buah menjadi piktogram, satu kolom untuk tiap jenis",
          "en": "I can arrange fruit pictures into a pictogram, one column for each kind"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKA.BILANGAN-1-10.01",
          "MAT.PAUD.WARNA.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ss.02",
            "note": "merepresentasikan data dengan gambar"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "bangun"
        ],
        "catatan": "Sekeranjang buah campur; anak menumpuk tiap buah di kolomnya dari bawah. Bukti: tiap kolom hanya satu jenis dan rapat dari bawah. Knob: 2 → 4 kolom, 6 → 15 buah."
      },
      {
        "id": "MAT.TKB.DATA.03",
        "track": "MAT",
        "level": "TKB",
        "unit": {
          "id": "DATA",
          "nama": {
            "id": "Turus dan piktogram",
            "en": "Tallies and pictograms"
          }
        },
        "statement": {
          "id": "Aku bisa memakai piktogram stok untuk memilih rak yang paling sedikit untuk diisi dan paling banyak untuk diborong",
          "en": "I can use the stock pictogram to pick the shelf with the fewest to restock and the one with the most for a bulk buyer"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.TKB.DATA.02"
        ],
        "refs": [
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ss.03",
            "note": "describe data: more, less, most, least"
          },
          {
            "framework": "CAMBRIDGE_PRIMARY_MATHS",
            "code": "1Ss.01"
          }
        ],
        "core": true,
        "mechanics": [
          "rawat",
          "dagang"
        ],
        "catatan": "Bukan pertanyaan audio: situasi game yang menuntut membaca piktogram. Putaran bergantian: tukang antar minta rak paling sedikit diisi; pemborong minta kolom paling banyak. Bukti: rak yang dipilih benar. Jebakan: dua kolom hampir sama. Knob: 3 → 4 kolom, selisih 2 → 1."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "SAINS.PAUD.TUBUH-PANCAINDRA.01",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "TUBUH-PANCAINDRA",
          "nama": {
            "id": "Anggota tubuh dan pancaindra",
            "en": "Body parts and the five senses"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk mata, hidung, telinga, mulut, tangan, atau kaki pada tokoh saat namanya disebut",
          "en": "I can point to the eyes, nose, ears, mouth, hands, or feet on a character when the name is said"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [],
        "refs": [],
        "core": true,
        "mechanics": [
          "cari",
          "ucap"
        ],
        "catatan": "Pengenalan nama bagian tubuh (reseptif). Dunia: Jelajah Tubuh, lapisan kulit; instruksi audio 'Mana hidungnya?', anak menyentuh bagian itu pada tubuh 3D (cari). Variasi ucap: tokoh menunjuk bagian, anak menyebut namanya. Jebakan: tangan vs jari, mulut vs gigi — mulai 6 bagian besar. Knob: jumlah bagian 4 → 8 (tambah perut, lutut). Kamus belum punya kode untuk bagian tubuh (EYFS tidak punya ELG khusus; Cambridge EY UWs belum ada di kamus), dibiarkan kosong."
      },
      {
        "id": "SAINS.PAUD.TUBUH-PANCAINDRA.02",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "TUBUH-PANCAINDRA",
          "nama": {
            "id": "Anggota tubuh dan pancaindra",
            "en": "Body parts and the five senses"
          }
        },
        "statement": {
          "id": "Aku bisa memasang kepala, badan, tangan, dan kaki ke tempatnya pada tubuh tokoh yang belum lengkap",
          "en": "I can put the head, body, arms, and legs in the right place on a character that is not complete"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.TUBUH-PANCAINDRA.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "pilah",
          "simulasi"
        ],
        "catatan": "Aksi teramati: anak menyeret potongan bagian tubuh ke siluet; benar bila posisinya sesuai (kepala di atas, kaki di bawah, tangan di sisi badan). Simulasi: setelah lengkap, tokoh bergerak; kalau kaki di kepala, tokoh jatuh lucu. Jebakan: tangan dan kaki tertukar karena bentuk mirip — beri tangan jari terbuka, kaki bersepatu. Knob: potongan 4 → 6 (tambah mata, mulut). Tanpa kode kerangka yang cocok."
      },
      {
        "id": "SAINS.PAUD.TUBUH-PANCAINDRA.03",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "TUBUH-PANCAINDRA",
          "nama": {
            "id": "Anggota tubuh dan pancaindra",
            "en": "Body parts and the five senses"
          }
        },
        "statement": {
          "id": "Aku bisa memilah benda ke indra yang memakainya: pelangi ke mata, lonceng ke telinga, bunga ke hidung",
          "en": "I can sort things to the sense that uses them: a rainbow to the eyes, a bell to the ears, a flower to the nose"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.TUBUH-PANCAINDRA.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "pilah",
          "cari"
        ],
        "catatan": "Pilah dengan 3 keranjang berlabel gambar indra (mata, telinga, hidung). Tiga indra ini yang bisa dialami langsung di game: benda bersinar/berwarna, benda berbunyi (diputar suaranya saat disentuh), benda berbau (tokoh mengendus). Item harus jelas satu indra dominan: pelangi, lampu kelap-kelip, kunang-kunang → mata; lonceng, genderang, bel sepeda → telinga; bunga, sabun, parfum → hidung. Umpan balik: keranjang yang benar 'memakai' bendanya (mata membesar melihat pelangi, telinga bergetar mendengar lonceng). Jebakan: benda yang bisa dilihat dan didengar sekaligus (burung) — hindari di ronde awal. Beda dengan .01: di sini anak menghubungkan indra dengan fungsinya, bukan sekadar menunjuk. Knob: 3 indra → 4 (tambah mulut/lidah: kue, permen) → 5 (kulit/tangan: es batu, bulu halus) hanya di ronde lanjut; 'lidah' dan 'kulit' sebagai nama indra ditegaskan di TK A. Tanpa kode kerangka yang cocok di kamus. [Tinjauan 24 Okt 2026: dipersempit dari 4 indra ke 3; 'kue ke lidah' dipindah ke knob.]"
      },
      {
        "id": "SAINS.PAUD.HEWAN-SUARA.01",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "HEWAN-SUARA",
          "nama": {
            "id": "Hewan di sekitar dan suaranya",
            "en": "Animals around us and their sounds"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk kucing, ayam, sapi, kambing, bebek, atau burung saat namanya disebut",
          "en": "I can point to the cat, chicken, cow, goat, duck, or bird when its name is said"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati hewan di sekitar; langkah pertama sebelum menggambar/menceritakan"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "ucap"
        ],
        "catatan": "Pengenalan nama hewan halaman (reseptif). Mekanik pilah mode pilih: enam hewan di satu adegan kebun/halaman 2D, instruksi audio 'Mana sapinya?', anak menyentuh satu hewan. Variasi ucap: tokoh menyorot hewan, anak menyebut namanya. Jebakan: bebek vs ayam, kambing vs sapi kecil — beda ukuran dan warna harus jelas. Knob: jumlah hewan di adegan 3 → 6. Catatan aset: belum ada dunia 3D hewan halaman, jadi mekanik `cari` tidak dipakai di sini; bila dunia itu dibuat, tambahkan `cari` (hewan laut dari Bawah Laut bisa jadi varian). [Tinjauan 24 Okt 2026: `cari` diganti `pilah` karena tidak ada dunia 3D yang memuat hewan ini.]"
      },
      {
        "id": "SAINS.PAUD.HEWAN-SUARA.02",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "HEWAN-SUARA",
          "nama": {
            "id": "Hewan di sekitar dan suaranya",
            "en": "Animals around us and their sounds"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan hewan yang bersuara dengan mendengar suaranya saja, misalnya meong untuk kucing",
          "en": "I can find the animal that is making a sound just by listening to it, for example meow for the cat"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.HEWAN-SUARA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati hewan lewat indra pendengaran"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah"
        ],
        "catatan": "Aksi teramati: suara hewan diputar tanpa petunjuk visual (semua hewan diam), anak menyentuh hewan yang bersuara. Bukti sah hanya bila hewan tidak beranimasi saat suaranya diputar. Jebakan: anak menyentuh hewan favorit, bukan yang bersuara — acak urutan. Varian pilah: kartu suara (ikon pengeras) diseret ke hewannya. Knob: 3 → 6 hewan, suara mirip (kambing vs sapi) di ronde lanjut. Mekanik pilah mode pilih pada adegan 2D; `cari` baru relevan bila dunia 3D hewan halaman ada. [Tinjauan 24 Okt 2026: `cari` dilepas.]"
      },
      {
        "id": "SAINS.PAUD.HEWAN-SUARA.03",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "HEWAN-SUARA",
          "nama": {
            "id": "Hewan di sekitar dan suaranya",
            "en": "Animals around us and their sounds"
          }
        },
        "statement": {
          "id": "Aku bisa memilah hewan menurut jumlah kakinya: dua kaki atau empat kaki",
          "en": "I can sort animals by how many legs they have: two legs or four legs"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.HEWAN-SUARA.01",
          "MAT.PAUD.BILANGAN-1-5.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati ciri tubuh hewan"
          }
        ],
        "core": false,
        "mechanics": [
          "pilah"
        ],
        "catatan": "Pengamatan ciri tubuh, bukan hafalan nama. Dua keranjang berlabel gambar 2 kaki / 4 kaki. Item: ayam, bebek, burung (2); kucing, sapi, kambing, anjing (4). Anak boleh menghitung kaki dengan menunjuk (prasyarat BILANGAN-1-5.01). Jebakan: hewan digambar dari samping sehingga kaki tertutup — pakai pose yang memperlihatkan semua kaki. Pengaya. Knob: 4 → 8 hewan; ikan (0 kaki) sebagai pengecoh di ronde lanjut. [Tinjauan 24 Okt 2026: `cari` dilepas; tidak ada dunia 3D hewan halaman.]"
      },
      {
        "id": "SAINS.PAUD.SIANG-MALAM-CUACA.01",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "SIANG-MALAM-CUACA",
          "nama": {
            "id": "Siang / malam, hujan / cerah",
            "en": "Day / night, rain / sunshine"
          }
        },
        "statement": {
          "id": "Aku bisa memilah gambar kegiatan ke siang atau malam: bermain di luar ke siang, tidur ke malam",
          "en": "I can sort pictures of activities into day or night: playing outside to day, sleeping to night"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "pendahulu: perubahan alam sehari-hari (siang–malam) sebelum musim"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "simulasi"
        ],
        "catatan": "Dua keranjang: langit siang (matahari) dan langit malam (bulan, bintang). Item harus punya petunjuk visual kuat: lampu menyala, piyama, matahari di jendela. Jebakan: makan bisa siang atau malam — hindari item ambigu. Varian simulasi: anak memasang matahari atau bulan di langit sesuai kegiatan yang sedang terjadi. Knob: 4 → 8 gambar."
      },
      {
        "id": "SAINS.PAUD.SIANG-MALAM-CUACA.02",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "SIANG-MALAM-CUACA",
          "nama": {
            "id": "Siang / malam, hujan / cerah",
            "en": "Day / night, rain / sunshine"
          }
        },
        "statement": {
          "id": "Aku bisa memilih payung saat langit hujan dan topi saat langit cerah sebelum tokoh keluar rumah",
          "en": "I can choose the umbrella when the sky is rainy and the hat when the sky is sunny before the character goes out"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.SIANG-MALAM-CUACA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "pendahulu: mengamati perubahan cuaca"
          },
          {
            "framework": "EYFS",
            "code": "ELG-PSED-MANAGING-SELF-03",
            "note": "berpakaian sesuai kebutuhan"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Simulasi tombol: langit di jendela berubah (hujan/cerah), anak menekan payung atau topi; tokoh keluar dan hasilnya terlihat (basah kuyup kalau salah, tidak dihukum). Satu kemampuan: membaca cuaca dari langit lalu memilih alat. Jebakan: anak selalu memilih payung — acak urutan dan beri ronde cerah lebih dulu. Knob: 2 cuaca → 3 (tambah berangin dengan layang-layang)."
      },
      {
        "id": "SAINS.PAUD.SIANG-MALAM-CUACA.03",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "SIANG-MALAM-CUACA",
          "nama": {
            "id": "Siang / malam, hujan / cerah",
            "en": "Day / night, rain / sunshine"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 3 gambar langit menjadi urutan yang benar: cerah, mendung, lalu hujan",
          "en": "I can put 3 pictures of the sky in the right order: sunny, cloudy, then rainy"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses dan perubahan di alam sekitar"
          }
        ],
        "core": false,
        "mechanics": [
          "urutkan"
        ],
        "catatan": "Urutan perubahan alam, bukan urutan kegiatan: awan datang → langit gelap → hujan turun. Umpan balik: setelah disusun, langit beranimasi; kalau terbalik, hujan turun dari langit cerah terlihat aneh. Jebakan: anak menyusun mendung → cerah → hujan; beri petunjuk visual awan makin tebal. Pengaya. Knob: 3 → 4 gambar (tambah pelangi setelah hujan)."
      },
      {
        "id": "SAINS.PAUD.HIDUP-TAK-HIDUP.01",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "HIDUP-TAK-HIDUP",
          "nama": {
            "id": "Hidup / tak hidup",
            "en": "Living / non-living"
          }
        },
        "statement": {
          "id": "Aku bisa memilah benda ke keranjang hidup atau tak hidup: kucing dan pohon hidup, batu dan bola tak hidup",
          "en": "I can sort things into living or non-living baskets: a cat and a tree are living, a rock and a ball are non-living"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.WARNA.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati makhluk hidup di sekitar; dasar sebelum membedakan lingkungan"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "cari"
        ],
        "catatan": "Dua keranjang berlabel ikon (daun bertunas / batu). Item hidup: kucing, ayam, pohon, bunga, ikan; tak hidup: batu, bola, mobil mainan, cangkir. Jebakan utama: benda yang bergerak (mobil, robot) dianggap hidup, tumbuhan yang diam dianggap tak hidup — pastikan ada pohon/bunga di sisi hidup dan mobil di sisi tak hidup sejak awal. Knob: 4 → 8 item; boneka hewan sebagai pengecoh di ronde lanjut."
      },
      {
        "id": "SAINS.PAUD.HIDUP-TAK-HIDUP.02",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "HIDUP-TAK-HIDUP",
          "nama": {
            "id": "Hidup / tak hidup",
            "en": "Living / non-living"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan 3 makhluk hidup di dunia, bukan benda, misalnya ikan di Bawah Laut atau pohon di Kebun Buah",
          "en": "I can find 3 living things in the world, not objects, for example a fish in the Undersea or a tree in the Fruit Garden"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.HIDUP-TAK-HIDUP.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "menjelajah alam sekitar dan mengamati hewan serta tumbuhan"
          }
        ],
        "core": false,
        "mechanics": [
          "cari"
        ],
        "catatan": "Mekanik cari di dunia 3D: Bawah Laut (ikan, penyu, karang hidup) atau Kebun Buah (pohon, buah di pohon). Dunia harus menyediakan benda tak hidup sebagai pengecoh yang bisa disentuh: jangkar, botol, batu, pagar. Bukti: 3 sentuhan pada makhluk hidup dengan paling banyak 1 kesalahan. Jebakan: karang dianggap batu — untuk PAUD jangan jadikan karang target. Pengaya. Knob: 3 → 5 target, jumlah pengecoh."
      },
      {
        "id": "SAINS.PAUD.HIDUP-TAK-HIDUP.03",
        "track": "SAINS",
        "level": "PAUD",
        "unit": {
          "id": "HIDUP-TAK-HIDUP",
          "nama": {
            "id": "Hidup / tak hidup",
            "en": "Living / non-living"
          }
        },
        "statement": {
          "id": "Aku bisa memberi makan hanya pada makhluk hidup di kebun, bukan pada batu atau mainan",
          "en": "I can feed only the living things in the garden, not the rocks or toys"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.HIDUP-TAK-HIDUP.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "ciri makhluk hidup: butuh makan dan minum"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "cari"
        ],
        "catatan": "Simulasi: anak memegang ember makanan/air dan menyentuh benda di kebun. Makhluk hidup bereaksi (ayam makan, bunga mekar); batu dan mobil mainan tidak bereaksi dan makanan terbuang. Bukti: ember diberikan ke semua yang hidup tanpa memberi ke yang tak hidup. Beda dengan .01: anak menerapkan ciri 'butuh makan/minum', bukan sekadar memilah kartu. Jebakan: boneka kelinci — tampilkan jahitan/kancing supaya jelas mainan. Knob: 3 → 6 sasaran."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "SAINS.TKA.BAGIAN-TUMBUHAN.01",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "BAGIAN-TUMBUHAN",
          "nama": {
            "id": "Bagian tumbuhan: akar, batang, daun, bunga",
            "en": "Plant parts: roots, stem, leaves, flower"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk akar, batang, daun, atau bunga pada tumbuhan saat namanya disebut",
          "en": "I can point to the roots, stem, leaves, or flower on a plant when the name is said"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [
          "SAINS.PAUD.HIDUP-TAK-HIDUP.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati tumbuhan dan bagian-bagiannya"
          }
        ],
        "core": true,
        "mechanics": [
          "cari",
          "ucap"
        ],
        "catatan": "Pengenalan nama bagian tumbuhan. Dunia: Kebun Buah — pohon 3D dengan akar terlihat (tanah transparan). Instruksi audio 'Mana akarnya?'; anak menyentuh bagian itu. Variasi ucap: tokoh menyorot bagian, anak menyebut namanya. Jebakan: batang vs dahan, bunga vs buah — di tahap ini bunga dan buah tidak muncul bersamaan. Knob: 4 bagian → 5 (tambah buah)."
      },
      {
        "id": "SAINS.TKA.BAGIAN-TUMBUHAN.02",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "BAGIAN-TUMBUHAN",
          "nama": {
            "id": "Bagian tumbuhan: akar, batang, daun, bunga",
            "en": "Plant parts: roots, stem, leaves, flower"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun potongan akar, batang, daun, dan bunga menjadi satu tumbuhan utuh",
          "en": "I can put the pieces of roots, stem, leaves, and flower together into one whole plant"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.BAGIAN-TUMBUHAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Aksi teramati: anak menyeret 4 potongan ke posisi yang benar relatif terhadap garis tanah: akar di bawah tanah, batang di atas tanah, daun di batang, bunga di pucuk. Umpan balik simulasi: tumbuhan yang benar berdiri dan bergoyang; akar di atas membuat tumbuhan roboh. Jebakan: akar ditaruh di atas tanah. Knob: tumbuhan berbeda (bunga matahari, pohon mangga); potongan 4 → 5."
      },
      {
        "id": "SAINS.TKA.BAGIAN-TUMBUHAN.03",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "BAGIAN-TUMBUHAN",
          "nama": {
            "id": "Bagian tumbuhan: akar, batang, daun, bunga",
            "en": "Plant parts: roots, stem, leaves, flower"
          }
        },
        "statement": {
          "id": "Aku bisa memilah hasil panen ke rak bagian tumbuhan yang terlihat diambil saat dipanen: wortel ke akar, bayam ke daun, mangga ke buah",
          "en": "I can sort harvested food onto the shelf of the plant part I saw being picked: carrot to roots, spinach to leaves, mango to fruit"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.BAGIAN-TUMBUHAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati tumbuhan yang dimakan"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Bukti harus dari pengamatan, bukan hafalan: sebelum memilah, anak melihat (atau melakukan) panennya — wortel dicabut dari tanah dengan akar terlihat, bayam dipetik daunnya, mangga dipetik dari dahan di Kebun Buah (aset 48 buah 3D). Lalu hasil panen ditaruh ke 3 rak berlabel gambar bagian tumbuhan. Item ronde awal: wortel, singkong, lobak (akar); bayam, kangkung, selada (daun); mangga, jeruk, pisang (buah). Jebakan: kentang dan bawang (bagian yang membengkak) — jangan dipakai. Varian dagang: pembeli minta 'sayur dari daun'. Knob: 2 rak → 3; 4 → 8 item; rak batang (tebu) dan bunga (brokoli, kembang kol) hanya di ronde lanjut dan hanya bila animasi panen memperlihatkan bagian itu. Butuh mode simulasi baru (panen). [Tinjauan 24 Okt 2026: dipersempit dari akar/batang/daun/bunga (tebu, brokoli = fakta yang tak teramati anak 4–5 th) ke bagian yang terlihat saat panen; buah memakai aset Kebun Buah.]"
      },
      {
        "id": "SAINS.TKA.BAGIAN-TUMBUHAN.04",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "BAGIAN-TUMBUHAN",
          "nama": {
            "id": "Bagian tumbuhan: akar, batang, daun, bunga",
            "en": "Plant parts: roots, stem, leaves, flower"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 4 gambar pertumbuhan tanaman menjadi urutan yang benar: biji, tunas, berdaun, berbunga",
          "en": "I can put 4 pictures of a growing plant in the right order: seed, sprout, leafy plant, flowering plant"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.02",
          "SAINS.TKA.BAGIAN-TUMBUHAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses dan perubahan: pertumbuhan tumbuhan"
          }
        ],
        "core": false,
        "mechanics": [
          "urutkan"
        ],
        "catatan": "Jembatan ke siklus hidup: bagian tumbuhan muncul bertahap. Gambar harus punya petunjuk visual progresif (tinggi bertambah, daun bertambah). Umpan balik: setelah disusun, tanaman tumbuh dalam animasi cepat; urutan salah membuat tanaman mengecil lagi. Jebakan: tunas vs berdaun mirip — bedakan jumlah daun 2 vs banyak. Pengaya. Knob: 3 → 4 gambar."
      },
      {
        "id": "SAINS.TKA.SIKLUS-HIDUP.01",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "SIKLUS-HIDUP",
          "nama": {
            "id": "Siklus hidup kupu-kupu dan ayam",
            "en": "Life cycles of the butterfly and the chicken"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 3 gambar siklus hidup ayam menjadi urutan yang benar: telur, anak ayam, ayam dewasa",
          "en": "I can put 3 pictures of the chicken life cycle in the right order: egg, chick, grown chicken"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "KODE.PAUD.URUTAN.02",
          "SAINS.PAUD.HEWAN-SUARA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses dan perubahan pada makhluk hidup"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan"
        ],
        "catatan": "Siklus paling sederhana (3 tahap, bentuk berubah sedikit). Urutkan mode siklus: setelah ayam dewasa, panah kembali ke telur supaya anak melihat lingkaran. Umpan balik: animasi menetas. Jebakan: anak ayam dan ayam dewasa tertukar bila ukurannya sama — jaga perbedaan ukuran dan warna kuning vs cokelat. Knob: 3 tahap → 4 (tambah telur retak)."
      },
      {
        "id": "SAINS.TKA.SIKLUS-HIDUP.02",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "SIKLUS-HIDUP",
          "nama": {
            "id": "Siklus hidup kupu-kupu dan ayam",
            "en": "Life cycles of the butterfly and the chicken"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun 4 gambar siklus hidup kupu-kupu menjadi urutan yang benar: telur, ulat, kepompong, kupu-kupu",
          "en": "I can put 4 pictures of the butterfly life cycle in the right order: egg, caterpillar, chrysalis, butterfly"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.SIKLUS-HIDUP.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses dan perubahan pada makhluk hidup: metamorfosis"
          }
        ],
        "core": true,
        "mechanics": [
          "urutkan"
        ],
        "catatan": "Lebih sulit dari ayam: bentuk berubah total (metamorfosis), 4 tahap. Jebakan utama: ulat ditaruh setelah kupu-kupu karena anak mengira ulat anak kupu-kupu yang 'lahir' — tampilkan telur di daun dan kepompong menggantung. Mode siklus: panah kembali dari kupu-kupu ke telur. Knob: 4 tahap; versi 3 tahap (tanpa telur) sebagai bantuan."
      },
      {
        "id": "SAINS.TKA.SIKLUS-HIDUP.03",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "SIKLUS-HIDUP",
          "nama": {
            "id": "Siklus hidup kupu-kupu dan ayam",
            "en": "Life cycles of the butterfly and the chicken"
          }
        },
        "statement": {
          "id": "Aku bisa mengantar anak hewan ke induknya: ulat ke kupu-kupu, anak ayam ke ayam, anak kucing ke kucing",
          "en": "I can take each baby animal to its parent: caterpillar to butterfly, chick to chicken, kitten to cat"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.SIKLUS-HIDUP.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "perubahan makhluk hidup dari muda ke dewasa"
          }
        ],
        "core": false,
        "mechanics": [
          "pilah",
          "navigasi"
        ],
        "catatan": "Pilah dengan akibat di dunia: tiap anak hewan diseret (atau diarahkan lewat petak, navigasi) ke induknya; induk yang benar menyambut (animasi mengeram/menjilat), induk yang salah mundur dan anak hewan kembali ke tempat semula. Campur pasangan yang mirip rupa (anak ayam–ayam, anak kucing–kucing, anak bebek–bebek) dengan yang berubah bentuk (ulat–kupu-kupu dari .02) supaya anak tidak hanya mencocokkan rupa. Bukti: semua pasangan diantar dengan paling banyak 1 percobaan salah per pasangan. Jebakan: ulat diantar ke ayam karena 'ayam makan ulat' — induk ayam tidak boleh bereaksi mematuk. Pengaya. Knob: 3 → 6 pasangan; kecebong–katak hanya setelah siklus katak diperlihatkan (ronde pengantar), karena belum ada kompetensi siklus katak. [Tinjauan 24 Okt 2026: kecebong–katak dilepas dari statement (tanpa prasyarat), `cari` diganti akibat di dunia.]"
      },
      {
        "id": "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "HEWAN-DARAT-AIR-UDARA",
          "nama": {
            "id": "Hewan darat, air, udara",
            "en": "Land, water, and air animals"
          }
        },
        "statement": {
          "id": "Aku bisa memilah hewan ke darat, air, atau udara: sapi ke darat, ikan ke air, burung ke udara",
          "en": "I can sort animals into land, water, or air: cow to land, fish to water, bird to air"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.HEWAN-SUARA.01",
          "MAT.PAUD.WARNA.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-02",
            "note": "persamaan dan perbedaan lingkungan tempat hewan hidup"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "cari"
        ],
        "catatan": "Tiga keranjang berlatar: padang rumput, laut, langit. Item tahap awal harus tegas: sapi, kambing, kucing (darat); ikan, gurita, penyu (air); burung, kupu-kupu, lebah (udara). Jebakan: bebek dan katak hidup di dua tempat — simpan untuk ronde lanjut sebagai 'boleh dua keranjang' atau hindari. Knob: 2 keranjang → 3; 4 → 9 hewan."
      },
      {
        "id": "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.02",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "HEWAN-DARAT-AIR-UDARA",
          "nama": {
            "id": "Hewan darat, air, udara",
            "en": "Land, water, and air animals"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan 3 hewan air yang disebutkan di Bawah Laut, misalnya penyu, gurita, dan ikan badut",
          "en": "I can find 3 named water animals in the Undersea world, for example a turtle, an octopus, and a clownfish"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "menjelajah dan mengamati hewan di lingkungan air"
          }
        ],
        "core": false,
        "mechanics": [
          "cari",
          "ucap"
        ],
        "catatan": "Mekanik cari di dunia 3D Bawah Laut, lapisan terumbu (dangkal) untuk TK A. Instruksi audio menyebut satu hewan; anak berenang mendekat dan menyentuhnya. Bukti: 3 hewan ditemukan dalam batas waktu longgar, paling banyak 2 sentuhan salah. Variasi ucap: hewan disorot, anak menyebut namanya. Jebakan: ikan badut vs ikan lain berwarna oranye — pilih target yang bentuknya khas. Pengaya. Knob: 3 → 5 hewan, kedalaman lapisan."
      },
      {
        "id": "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.03",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "HEWAN-DARAT-AIR-UDARA",
          "nama": {
            "id": "Hewan darat, air, udara",
            "en": "Land, water, and air animals"
          }
        },
        "statement": {
          "id": "Aku bisa memilah hewan menurut alat geraknya: sirip, sayap, atau kaki",
          "en": "I can sort animals by what they move with: fins, wings, or legs"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati ciri tubuh hewan (alat gerak)"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "cari"
        ],
        "catatan": "Beda dengan .01: anak mengamati tubuh hewan, bukan tempat tinggalnya. Tiga rak berlabel ikon sirip, sayap, kaki. Jebakan: burung punya sayap dan kaki — aturan: pilih alat gerak utama; mulai dengan hewan satu jawaban jelas (ikan, kupu-kupu, kucing), burung di ronde lanjut. Knob: 2 → 3 rak; 4 → 9 hewan. [Tinjauan 24 Okt 2026: prasyarat pada pengaya PAUD.HEWAN-SUARA.03 dilepas (kompetensi inti tidak boleh bergantung pada pengaya); ref NW-02 (lingkungan) diganti NW-01 (pengamatan ciri tubuh).]"
      },
      {
        "id": "SAINS.TKA.CUACA-PAKAIAN.01",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "CUACA-PAKAIAN",
          "nama": {
            "id": "Cuaca dan pakaian yang sesuai",
            "en": "Weather and suitable clothes"
          }
        },
        "statement": {
          "id": "Aku bisa memasang simbol cuaca yang cocok dengan langit di jendela: cerah, mendung, hujan, atau berangin",
          "en": "I can place the weather symbol that matches the sky in the window: sunny, cloudy, rainy, or windy"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [
          "SAINS.PAUD.SIANG-MALAM-CUACA.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "mengamati cuaca sebagai perubahan di alam sekitar"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Papan cuaca harian (simulasi): langit di jendela beranimasi, anak memilih simbol dan memasangnya di papan. Berangin ditandai pohon bergoyang dan daun beterbangan. Jebakan: mendung vs hujan — hujan harus terlihat tetesnya. Knob: 2 → 4 cuaca; tambah 'dingin/berkabut' sebagai pengaya."
      },
      {
        "id": "SAINS.TKA.CUACA-PAKAIAN.02",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "CUACA-PAKAIAN",
          "nama": {
            "id": "Cuaca dan pakaian yang sesuai",
            "en": "Weather and suitable clothes"
          }
        },
        "statement": {
          "id": "Aku bisa memilih pakaian untuk tokoh sesuai cuaca: jas hujan saat hujan, topi saat cerah, jaket saat berangin dingin",
          "en": "I can choose clothes for the character to match the weather: raincoat when rainy, hat when sunny, jacket when cold and windy"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.CUACA-PAKAIAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "cuaca dan akibatnya pada kegiatan sehari-hari"
          },
          {
            "framework": "EYFS",
            "code": "ELG-PSED-MANAGING-SELF-03",
            "note": "berpakaian sesuai kebutuhan diri"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Simulasi lemari: cuaca ditampilkan, anak memasangkan 1–2 benda ke tokoh dari 4–6 pilihan. Tokoh keluar rumah dan bereaksi (menggigil, kepanasan, basah) tanpa kata 'salah'. Bukti: pilihan cocok dengan cuaca; sandal saat hujan dihitung keliru. Jebakan: anak memilih pakaian favorit — acak posisi. Knob: 1 → 2 benda per ronde; 3 → 4 cuaca. Cuaca yang dipakai = cuaca yang dikenal di .01 (cerah, mendung, hujan, berangin); 'dingin' muncul sebagai sifat angin, bukan cuaca tersendiri. [Tinjauan 24 Okt 2026: 'panas/dingin' diselaraskan dengan daftar cuaca .01.]"
      },
      {
        "id": "SAINS.TKA.CUACA-PAKAIAN.03",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "CUACA-PAKAIAN",
          "nama": {
            "id": "Cuaca dan pakaian yang sesuai",
            "en": "Weather and suitable clothes"
          }
        },
        "statement": {
          "id": "Aku bisa memilih kegiatan yang cocok dengan cuaca: main layang-layang saat berangin, berteduh saat hujan",
          "en": "I can choose the activity that fits the weather: flying a kite when windy, sheltering when rainy"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.CUACA-PAKAIAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "akibat cuaca pada kegiatan"
          }
        ],
        "core": false,
        "mechanics": [
          "pilah",
          "simulasi"
        ],
        "catatan": "Pilah: kartu kegiatan diseret ke papan cuaca yang cocok (menjemur baju → cerah, main layang-layang → berangin, berteduh/pakai payung → hujan). Varian simulasi: anak memilih kegiatan, lalu adegan dimainkan (layang-layang tak terbang saat tak ada angin). Pengaya. Jebakan: bermain di dalam rumah cocok untuk semua cuaca — jangan jadikan item."
      },
      {
        "id": "SAINS.TKA.APUNG-TENGGELAM-MAGNET.01",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "APUNG-TENGGELAM-MAGNET",
          "nama": {
            "id": "Apung / tenggelam, magnet menarik / tidak",
            "en": "Float / sink, magnetic / not magnetic"
          }
        },
        "statement": {
          "id": "Aku bisa memilah benda ke rak terapung atau tenggelam setelah mencobanya di bak air",
          "en": "I can sort objects onto the floats or sinks shelf after trying them in the water tub"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "MAT.PAUD.WARNA.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "menjelajah benda di sekitar lewat percobaan dan pengamatan"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Simulasi bak air: anak menjatuhkan benda satu per satu, melihat hasilnya, lalu menaruhnya di rak terapung/tenggelam. Bukti: rak sesuai hasil percobaan yang baru dilihat anak. Benda: bola plastik, daun, gabus, kayu (apung); batu, sendok logam, koin, kelereng (tenggelam). Jebakan: benda besar dianggap pasti tenggelam — sertakan kayu besar yang terapung. Knob: 4 → 8 benda."
      },
      {
        "id": "SAINS.TKA.APUNG-TENGGELAM-MAGNET.02",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "APUNG-TENGGELAM-MAGNET",
          "nama": {
            "id": "Apung / tenggelam, magnet menarik / tidak",
            "en": "Float / sink, magnetic / not magnetic"
          }
        },
        "statement": {
          "id": "Aku bisa menebak benda mana yang akan terapung sebelum memasukkannya ke bak air",
          "en": "I can predict which object will float before putting it into the water tub"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.APUNG-TENGGELAM-MAGNET.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "membuat perkiraan lalu mengamati hasilnya"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Langkah ilmiah: menebak dulu, baru menguji. Anak menaruh benda di kolom tebakan (apung/tenggelam), menekan 'coba', lalu bak menguji semuanya. Bukti: tebakan benar untuk benda yang bahannya sudah pernah dicoba di .01 (generalisasi: kayu terapung, logam tenggelam) — benda baru tetapi bahan sama. Tebakan meleset tidak dihukum keras: skor dari rasio. Beda dengan .01: di sini anak memilah sebelum melihat hasil. Knob: 3 → 6 benda; porsi bahan baru."
      },
      {
        "id": "SAINS.TKA.APUNG-TENGGELAM-MAGNET.03",
        "track": "SAINS",
        "level": "TKA",
        "unit": {
          "id": "APUNG-TENGGELAM-MAGNET",
          "nama": {
            "id": "Apung / tenggelam, magnet menarik / tidak",
            "en": "Float / sink, magnetic / not magnetic"
          }
        },
        "statement": {
          "id": "Aku bisa memilah benda yang tertarik magnet dari yang tidak setelah mencobanya dengan magnet",
          "en": "I can sort objects that a magnet pulls from those it does not, after testing them with the magnet"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.APUNG-TENGGELAM-MAGNET.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "menjelajah benda lewat percobaan"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Simulasi: anak menyeret magnet mendekati benda; benda logam besi melompat menempel, yang lain diam. Lalu benda ditaruh ke rak 'tertarik' / 'tidak'. Benda tertarik: paku, klip kertas, sendok besi, kaleng; tidak: pensil kayu, penghapus, koin tembaga/aluminium dihindari (membingungkan), gelas plastik. Jebakan: semua yang berkilau dianggap tertarik — sertakan kertas emas/koin aluminium hanya di ronde lanjut dengan catatan. Knob: 4 → 8 benda. Ide pengaya untuk PO: 'mengambil hanya benda logam dari tumpukan dengan magnet' (cari+simulasi)."
      }
    ]
  },
  {
    "versi": "0.1.0",
    "kompetensi": [
      {
        "id": "SAINS.TKB.TULANG-OTOT-ORGAN.01",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "TULANG-OTOT-ORGAN",
          "nama": {
            "id": "Tulang, otot, organ utama",
            "en": "Bones, muscles, main organs"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan jantung, paru-paru, perut, atau otak di dalam tubuh 3D saat namanya disebut",
          "en": "I can find the heart, lungs, stomach, or brain inside the 3D body when the name is said"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [
          "SAINS.PAUD.TUBUH-PANCAINDRA.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "cari",
          "ucap"
        ],
        "catatan": "Dunia: Jelajah Tubuh, lapisan organ. Instruksi audio 'Mana paru-parunya?'; anak memutar tubuh 3D dan menyentuh organ itu. Variasi ucap: organ berdenyut/menyala, anak menyebut namanya. Jebakan: perut (lambung) vs usus, jantung di kiri vs tengah — mulai 4 organ besar. Knob: 4 → 6 organ (tambah usus, ginjal). Kamus belum punya kode untuk organ tubuh (Cambridge Primary Science 1 'parts of the human body' belum ada di kamus; EYFS tidak punya ELG khusus) — dibiarkan kosong."
      },
      {
        "id": "SAINS.TKB.TULANG-OTOT-ORGAN.02",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "TULANG-OTOT-ORGAN",
          "nama": {
            "id": "Tulang, otot, organ utama",
            "en": "Bones, muscles, main organs"
          }
        },
        "statement": {
          "id": "Aku bisa memasang tulang, otot, dan organ ke lapisan tubuh 3D yang tepat",
          "en": "I can place bones, muscles, and organs on the correct layer of the 3D body"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.TULANG-OTOT-ORGAN.01",
          "SAINS.PAUD.TUBUH-PANCAINDRA.02"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "pilah",
          "simulasi"
        ],
        "catatan": "Pilah tiga lapisan Jelajah Tubuh: potongan (tengkorak, tulang paha, otot lengan, otot betis, jantung, paru-paru) diseret ke lapisan tulang / otot / organ; bila lapisan benar, potongan 'menempel' di posisinya. Bukti: lapisan benar; posisi persis boleh dibantu magnet-snap. Jebakan: jantung dianggap otot (benar secara ilmiah tetapi di sini dihitung organ) — label lapisan organ memuat jantung sejak contoh. Knob: 3 → 6 potongan; mode tanpa bayangan posisi."
      },
      {
        "id": "SAINS.TKB.TULANG-OTOT-ORGAN.03",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "TULANG-OTOT-ORGAN",
          "nama": {
            "id": "Tulang, otot, organ utama",
            "en": "Bones, muscles, main organs"
          }
        },
        "statement": {
          "id": "Aku bisa menyentuh bagian tubuh 3D yang akan bekerja sebelum tokoh bergerak: otot kaki sebelum lari, paru-paru sebelum menarik napas",
          "en": "I can touch the 3D body part that is about to work before the character moves: leg muscles before running, lungs before breathing in"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.TULANG-OTOT-ORGAN.01"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "cari",
          "simulasi"
        ],
        "catatan": "Ronde pengantar: tokoh melakukan kegiatan (lari, angkat tas, tarik napas, makan, membaca) dan bagian yang bekerja menyala di Jelajah Tubuh — ini pengajaran, belum bukti. Ronde bukti: kegiatan diumumkan ('Sekarang tokoh akan lari'), anak menyentuh bagian tubuh 3D (cari) SEBELUM animasi jalan; lalu kegiatan dimainkan dan bagian yang sebenarnya menyala, sehingga cocok/tidaknya terlihat sendiri. Bukti sah hanya bila sentuhan dibuat sebelum animasi. Jebakan: lari → jantung juga benar; terima satu dari dua jawaban yang ditandai sah. Pengaya. Knob: 3 → 5 kegiatan. Ide lain untuk PO: 'tulang melindungi organ' (tengkorak–otak, rusuk–jantung). Tanpa kode kerangka di kamus. [Tinjauan 24 Okt 2026: dari pilah kartu (mencocokkan fakta) menjadi tebak-lalu-lihat di tubuh 3D.]"
      },
      {
        "id": "SAINS.TKB.MAKANAN-SEHAT.01",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "MAKANAN-SEHAT",
          "nama": {
            "id": "Makanan sehat dan tidak sehat",
            "en": "Healthy and unhealthy food"
          }
        },
        "statement": {
          "id": "Aku bisa memilah makanan ke piring sehari-hari atau toples sesekali: buah dan sayur ke piring, permen dan soda ke toples",
          "en": "I can sort food into the everyday plate or the sometimes jar: fruit and vegetables to the plate, sweets and soda to the jar"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.PAUD.HIDUP-TAK-HIDUP.03"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-PSED-MANAGING-SELF-03",
            "note": "memahami pentingnya memilih makanan sehat"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "dagang"
        ],
        "catatan": "Bahasa 'sehari-hari' vs 'sesekali', bukan 'baik/buruk', supaya anak tidak merasa bersalah. Dua wadah berlabel gambar. Item sehari-hari: pisang, wortel, nasi, telur, ikan, susu, air putih; sesekali: permen, keripik, soda, kue krim. Jebakan: jus kemasan manis dikira buah — pakai buah utuh dari aset Kebun Buah (48 buah 3D). Knob: 4 → 10 item; 2 → 3 wadah (tambah 'kadang': roti manis)."
      },
      {
        "id": "SAINS.TKB.MAKANAN-SEHAT.02",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "MAKANAN-SEHAT",
          "nama": {
            "id": "Makanan sehat dan tidak sehat",
            "en": "Healthy and unhealthy food"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun piring makan dengan nasi, lauk, sayur, dan buah dari pilihan yang tersedia",
          "en": "I can build a meal plate with rice, a protein, vegetables, and fruit from the choices available"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.MAKANAN-SEHAT.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-PSED-MANAGING-SELF-03",
            "note": "memilih makanan sehat untuk diri sendiri"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "dagang"
        ],
        "catatan": "Simulasi piring 'Isi Piringku': empat bagian piring bergambar samar; anak menyeret satu item ke tiap bagian dari meja berisi 8–10 pilihan termasuk pengecoh (permen, soda). Bukti: tiap bagian terisi dengan kelompok yang tepat; pengecoh tidak di piring. Jebakan: buah ditaruh di bagian sayur — bagian berikon warna berbeda. Knob: 3 → 4 bagian; jumlah pengecoh."
      },
      {
        "id": "SAINS.TKB.MAKANAN-SEHAT.03",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "MAKANAN-SEHAT",
          "nama": {
            "id": "Makanan sehat dan tidak sehat",
            "en": "Healthy and unhealthy food"
          }
        },
        "statement": {
          "id": "Aku bisa memilih bekal sehari-hari di pasar: buah atau sayur, bukan permen, walau permen paling murah",
          "en": "I can choose an everyday snack at the market: fruit or vegetables, not sweets, even though sweets are the cheapest"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.MAKANAN-SEHAT.01",
          "MAT.TKA.UANG-KENAL.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-PSED-MANAGING-SELF-03"
          }
        ],
        "core": false,
        "mechanics": [
          "dagang"
        ],
        "catatan": "Dagang lintas pelajaran: pedagang menjual buah dari Kebun Buah, sayur potong (wortel, timun), dan jajanan; anak punya 5 koin. Kemampuan yang dinilai di sini hanya SATU: isi keranjang termasuk kelompok sehari-hari. Membayar pas adalah konteks dari MAT.TKA.UANG-KENAL.02 dan dicatat terpisah sebagai bukti Matematika, bukan syarat lulus kompetensi ini. Jebakan: permen paling murah — godaan sengaja; jus kemasan manis dikira buah. Pengaya. Knob: uang 3 → 5 koin; jumlah jajanan pengecoh. [Tinjauan 24 Okt 2026: 'dengan uang terbatas' dilepas dari statement supaya satu kemampuan; bahasa 'sehat' diganti 'sehari-hari' konsisten dengan .01.]"
      },
      {
        "id": "SAINS.TKB.KEBUTUHAN-TUMBUHAN.01",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "KEBUTUHAN-TUMBUHAN",
          "nama": {
            "id": "Apa yang tumbuhan butuhkan",
            "en": "What plants need"
          }
        },
        "statement": {
          "id": "Aku bisa memilah apa yang dibutuhkan tumbuhan dari yang tidak: air, cahaya, tanah ke pot; mainan, permen ke luar",
          "en": "I can sort what a plant needs from what it does not: water, light, soil go to the pot; toys, sweets go out"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.BAGIAN-TUMBUHAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01",
            "note": "mengamati kebutuhan tumbuhan"
          },
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses pertumbuhan"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "rawat"
        ],
        "catatan": "Pilah dengan akibat, bukan kartu diam: kartu (ember air, matahari, tanah/pot, udara/angin, mainan, permen, selimut, TV) diseret ke pot tanaman atau keranjang 'tidak perlu'. Pot bereaksi pada yang dibutuhkan (tanah basah, daun condong ke cahaya, tunas sedikit naik) dan menolak yang tidak (mainan menggelinding keluar, permen tak terserap). Ronde 1 eksplorasi bebas; bukti diambil dari ronde 2: semua kebutuhan masuk pot, pengecoh ke keranjang, paling banyak 1 salah. Udara boleh masuk kebutuhan sejak awal dengan ikon angin tipis. Jebakan: anak memberi 'susu' karena anak butuh susu — pengecoh yang baik untuk ronde lanjut. Knob: 4 → 8 kartu. Mekanik rawat = merawat makhluk hidup (sama dengan PAUD.HIDUP-TAK-HIDUP.03). [Tinjauan 24 Okt 2026: `cari` (tak ada dunia) diganti `rawat`; umpan balik pot ditambahkan supaya bukan kuis seret.]"
      },
      {
        "id": "SAINS.TKB.KEBUTUHAN-TUMBUHAN.02",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "KEBUTUHAN-TUMBUHAN",
          "nama": {
            "id": "Apa yang tumbuhan butuhkan",
            "en": "What plants need"
          }
        },
        "statement": {
          "id": "Aku bisa membuat tanaman tumbuh berbunga dengan memberinya air dan cahaya yang cukup setiap hari",
          "en": "I can make a plant grow and flower by giving it enough water and light every day"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.KEBUTUHAN-TUMBUHAN.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses dan perubahan: pertumbuhan tumbuhan"
          },
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-01"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi"
        ],
        "catatan": "Simulasi merawat 5–7 'hari' singkat: tiap hari anak memilih siram/tidak dan tirai buka/tutup; tanaman tumbuh bila keduanya terpenuhi, layu bila salah satu kurang dua hari berturut-turut. Satu kemampuan: memenuhi kebutuhan tumbuhan. Bukti: tanaman berbunga di akhir dengan paling banyak 1 hari lalai. Jebakan: menyiram berlebihan — pada knob lanjut, air berlebih membuat daun menguning. Knob: jumlah hari 5 → 7; tambah variabel air berlebih."
      },
      {
        "id": "SAINS.TKB.KEBUTUHAN-TUMBUHAN.03",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "KEBUTUHAN-TUMBUHAN",
          "nama": {
            "id": "Apa yang tumbuhan butuhkan",
            "en": "What plants need"
          }
        },
        "statement": {
          "id": "Aku bisa menunjuk tanaman yang akan layu sebelum hari berganti, misalnya yang disimpan di tempat gelap",
          "en": "I can point to the plant that will wilt before the day changes, for example the one kept in the dark"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.KEBUTUHAN-TUMBUHAN.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "memperkirakan perubahan berdasar kebutuhan"
          }
        ],
        "core": false,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Prediksi: tiga pot sama, satu kondisi berbeda (di lemari gelap / tidak disiram / tanpa tanah), anak menunjuk yang akan layu sebelum animasi hari berjalan. Bukti sah hanya bila tebakan dibuat sebelum perubahan terlihat. Jebakan: anak menunggu animasi — tombol 'tebak' mengunci dulu. Pengaya. Knob: 1 → 2 pot bermasalah; kondisi makin halus (sedikit cahaya vs gelap)."
      },
      {
        "id": "SAINS.TKB.HEWAN-HABITAT.01",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "HEWAN-HABITAT",
          "nama": {
            "id": "Hewan dan habitatnya",
            "en": "Animals and their habitats"
          }
        },
        "statement": {
          "id": "Aku bisa mengantar tiap hewan ke habitatnya: unta ke gurun, beruang kutub ke es, monyet ke hutan, ikan badut ke terumbu",
          "en": "I can take each animal to its habitat: camel to the desert, polar bear to the ice, monkey to the forest, clownfish to the reef"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-02",
            "note": "persamaan dan perbedaan lingkungan yang kontras: gurun, kutub, hutan, laut"
          }
        ],
        "core": true,
        "mechanics": [
          "pilah",
          "navigasi"
        ],
        "catatan": "Lebih halus dari darat/air/udara: empat habitat kontras dengan latar jelas. Pilah ke 4 panel habitat, atau navigasi: anak mengarahkan hewan melewati petak menuju habitatnya. Item: unta, kadal (gurun); beruang kutub, penguin (es); monyet, harimau (hutan); ikan badut, penyu (terumbu). Jebakan: penguin dikira hidup di hutan karena 'burung' — tampilkan es di kartu. Knob: 2 → 4 habitat; 4 → 8 hewan."
      },
      {
        "id": "SAINS.TKB.HEWAN-HABITAT.02",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "HEWAN-HABITAT",
          "nama": {
            "id": "Hewan dan habitatnya",
            "en": "Animals and their habitats"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan hewan yang tinggal di lapisan laut yang diminta di Bawah Laut: terumbu, laut dalam, atau palung",
          "en": "I can find an animal that lives in the asked ocean layer in the Undersea world: reef, deep sea, or trench"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.HEWAN-HABITAT.01",
          "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.02"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-02",
            "note": "lingkungan yang kontras di dalam satu dunia: dangkal–dalam"
          }
        ],
        "core": false,
        "mechanics": [
          "cari",
          "navigasi"
        ],
        "catatan": "Mekanik cari di dunia 3D Bawah Laut penuh (terumbu sampai palung). Instruksi: 'Cari hewan yang tinggal di laut dalam yang gelap'; anak menyelam ke lapisan itu dan menyentuh hewan yang memang berasal dari sana (ikan lentera, bukan ikan badut). Bukti: hewan yang disentuh termasuk daftar lapisan itu. Jebakan: hewan berenang melintas lapisan — kunci hewan pada lapisannya untuk aktivitas ini. Pengaya. Knob: 2 → 3 lapisan."
      },
      {
        "id": "SAINS.TKB.HEWAN-HABITAT.03",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "HEWAN-HABITAT",
          "nama": {
            "id": "Hewan dan habitatnya",
            "en": "Animals and their habitats"
          }
        },
        "statement": {
          "id": "Aku bisa memakaikan ciri tubuh yang cocok supaya hewan betah di tempat hidupnya: bulu tebal di es, sirip di air, warna hijau daun di hutan",
          "en": "I can give an animal the body feature that fits where it lives: thick fur on the ice, fins in the water, leaf-green colour in the forest"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.HEWAN-HABITAT.01",
          "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.03"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-02",
            "note": "mengaitkan ciri makhluk hidup dengan lingkungannya"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Awal adaptasi lewat percobaan, bukan hafalan: hewan netral ditaruh di habitat, anak memilih satu ciri dari 3–4 kartu dan 'memakaikannya'; akibat terlihat — tanpa bulu tebal hewan menggigil di es, tanpa sirip hewan megap-megap di air, dengan warna hijau hewan tersembunyi dari burung pemangsa di hutan (tanpa warna hijau ia tertangkap). Bukti: ciri yang dipilih membuat hewan betah pada 3 habitat dengan paling banyak 1 percobaan salah per habitat. Ketiga ciri ini bisa dialami/diamati anak 5–6 th; punuk unta (menyimpan cadangan) hanya di ronde lanjut dengan VO singkat, karena tidak bisa diamati akibatnya. Jebakan: anak memakaikan semua ciri sekaligus — satu ciri per ronde. Knob: 3 → 5 pasangan (tambah kaki berselaput–rawa, punuk–gurun). Butuh mode simulasi baru (pakaikan ciri). [Tinjauan 24 Okt 2026: dari pilah kartu ciri→panel (fakta) menjadi percobaan dengan akibat; punuk dipindah ke knob.]"
      },
      {
        "id": "SAINS.TKB.MATAHARI-BUMI-BULAN.01",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "MATAHARI-BUMI-BULAN",
          "nama": {
            "id": "Matahari, Bumi, Bulan",
            "en": "Sun, Earth, Moon"
          }
        },
        "statement": {
          "id": "Aku bisa menemukan Matahari, Bumi, atau Bulan di Jelajah Angkasa saat namanya disebut",
          "en": "I can find the Sun, the Earth, or the Moon in the Space world when its name is said"
        },
        "depth": [
          "kenal"
        ],
        "prereq": [],
        "refs": [],
        "core": true,
        "mechanics": [
          "cari",
          "ucap"
        ],
        "catatan": "Dunia: Jelajah Angkasa. Instruksi audio 'Mana Bumi?'; anak mengarahkan pandangan/terbang dan menyentuh benda langit itu. Pengecoh: Mars (merah), bintang lain. Variasi ucap: benda disorot, anak menyebut namanya. Jebakan: Bulan vs Bumi dari jauh sama-sama bulat — jaga skala dan warna (biru-hijau vs abu). Knob: 3 target → 5 (tambah Mars, bintang). Kamus belum punya kode untuk benda langit (EYFS ELG tidak spesifik; Cambridge Primary Science 'Earth in space' belum ada di kamus) — dibiarkan kosong."
      },
      {
        "id": "SAINS.TKB.MATAHARI-BUMI-BULAN.02",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "MATAHARI-BUMI-BULAN",
          "nama": {
            "id": "Matahari, Bumi, Bulan",
            "en": "Sun, Earth, Moon"
          }
        },
        "statement": {
          "id": "Aku bisa menyusun model tata surya kecil: Bulan mengitari Bumi, Bumi mengitari Matahari",
          "en": "I can build a small model: the Moon goes around the Earth, and the Earth goes around the Sun"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.MATAHARI-BUMI-BULAN.01"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "simulasi",
          "urutkan"
        ],
        "catatan": "Simulasi: Matahari diam di tengah; anak menaruh Bumi pada lintasan besar dan Bulan pada lintasan kecil di sekitar Bumi, lalu menekan jalan. Bukti: kedua benda pada lintasan yang benar (Bulan tidak langsung mengitari Matahari). Umpan balik: bila Bulan ditaruh di lintasan besar, Bulan 'tersesat' jauh dari Bumi. Satu kemampuan: menata susunan pusat–pengiring. Pengaya. Knob: lintasan berlabel bayangan → tanpa bayangan. Ide lain untuk PO: mengurutkan ukuran Matahari > Bumi > Bulan (urutkan). Tanpa kode kerangka di kamus."
      },
      {
        "id": "SAINS.TKB.MATAHARI-BUMI-BULAN.03",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "MATAHARI-BUMI-BULAN",
          "nama": {
            "id": "Matahari, Bumi, Bulan",
            "en": "Sun, Earth, Moon"
          }
        },
        "statement": {
          "id": "Aku bisa memutar Bumi sampai kota yang diminta menjadi siang, yaitu menghadap Matahari",
          "en": "I can turn the Earth until the asked city is in daytime, facing the Sun"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.MATAHARI-BUMI-BULAN.01",
          "SAINS.PAUD.SIANG-MALAM-CUACA.01"
        ],
        "refs": [
          {
            "framework": "EYFS",
            "code": "ELG-UW-NATURAL-WORLD-03",
            "note": "proses dan perubahan di alam: siang–malam sebagai akibat putaran Bumi"
          }
        ],
        "core": true,
        "mechanics": [
          "simulasi"
        ],
        "catatan": "Simulasi: bola Bumi dengan penanda rumah/kota dan lampu Matahari tetap; anak memutar Bumi sampai penanda berada di sisi terang (siang) atau gelap (malam) sesuai permintaan. Bukti: penanda di belahan yang benar saat tombol 'pas' ditekan. Jebakan: anak memindahkan Matahari — Matahari dikunci. Knob: siang saja → siang/malam bergantian; 1 → 2 penanda ('rumah siang, rumah seberang malam')."
      },
      {
        "id": "SAINS.TKB.BAHAN.01",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "BAHAN",
          "nama": {
            "id": "Bahan: kayu, logam, plastik, kaca",
            "en": "Materials: wood, metal, plastic, glass"
          }
        },
        "statement": {
          "id": "Aku bisa memilah benda menurut bahannya: kayu, logam, plastik, atau kaca",
          "en": "I can sort objects by their material: wood, metal, plastic, or glass"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKA.APUNG-TENGGELAM-MAGNET.03"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "pilah",
          "cari"
        ],
        "catatan": "Empat rak berlabel contoh bahan (balok kayu, paku, botol plastik, gelas kaca). Item: sendok kayu, kursi kayu, kaleng, kunci, ember plastik, mainan plastik, jendela, toples kaca. Jebakan: benda yang dicat (kayu dicat merah dianggap plastik) — tampilkan serat kayu; kaca vs plastik bening dibedakan pantulan dan 'denting' saat disentuh. Varian cari: temukan 3 benda logam di dapur. Knob: 2 → 4 rak; 4 → 8 benda. Kamus belum punya kode untuk bahan (Cambridge Primary Science 1 'Materials' belum ada di kamus; EYFS NW-03 hanya menyentuh perubahan wujud) — dibiarkan kosong."
      },
      {
        "id": "SAINS.TKB.BAHAN.02",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "BAHAN",
          "nama": {
            "id": "Bahan: kayu, logam, plastik, kaca",
            "en": "Materials: wood, metal, plastic, glass"
          }
        },
        "statement": {
          "id": "Aku bisa memilah benda yang tembus pandang dari yang tidak setelah mencoba melihat lewat benda itu",
          "en": "I can sort objects that I can see through from those I cannot, after trying to look through them"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.BAHAN.01"
        ],
        "refs": [],
        "core": true,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Simulasi: benda diseret ke depan gambar tokoh; bila tembus pandang, tokoh masih terlihat. Lalu benda ditaruh ke rak tembus pandang / tidak. Bukti: rak sesuai hasil yang dilihat. Item tembus: gelas kaca, botol plastik bening, jendela; tidak: papan kayu, kaleng, ember plastik buram. Poin sains: plastik bisa dua-duanya, kaca hampir selalu tembus — kaitkan dengan .01. Jebakan: kaca berwarna. Knob: 4 → 8 benda. Tanpa kode kerangka di kamus."
      },
      {
        "id": "SAINS.TKB.BAHAN.03",
        "track": "SAINS",
        "level": "TKB",
        "unit": {
          "id": "BAHAN",
          "nama": {
            "id": "Bahan: kayu, logam, plastik, kaca",
            "en": "Materials: wood, metal, plastic, glass"
          }
        },
        "statement": {
          "id": "Aku bisa memilih bahan yang tepat untuk benda yang kubangun: kaca untuk jendela, kayu untuk kursi, logam untuk paku",
          "en": "I can choose the right material for something I build: glass for the window, wood for the chair, metal for the nail"
        },
        "depth": [
          "pakai"
        ],
        "prereq": [
          "SAINS.TKB.BAHAN.01",
          "SAINS.TKB.BAHAN.02"
        ],
        "refs": [],
        "core": false,
        "mechanics": [
          "simulasi",
          "pilah"
        ],
        "catatan": "Simulasi membangun rumah kecil: tiap bagian (jendela, kursi, paku, ember) minta bahan; anak memilih dari 4 bahan. Umpan balik: jendela kayu membuat ruangan gelap, kursi kaca pecah saat tokoh duduk, paku plastik bengkok — konsekuensi lucu, bukan 'salah'. Bukti: bahan sesuai sifat yang sudah dipelajari (.02 tembus pandang untuk jendela). Jebakan: ember boleh plastik atau logam — tandai dua jawaban sah. Pengaya. Knob: 3 → 5 bagian. Tanpa kode kerangka di kamus."
      }
    ]
  }
] as const;

export const PAKET_RAW: unknown[] = [
  {
    "id": "bayar-koin-kantin-sekolah",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKA.UANG-KENAL.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Jajan di Kantin",
        "instruksi": "Robot jajan di kantin: lihat harga koinnya, lalu bayar dengan koin seribu sebanyak itu.",
        "pisanggoreng": "pisang goreng",
        "tahu": "tahu goreng",
        "bakwan": "bakwan",
        "tehmanis": "teh manis",
        "nasikuning": "nasi kuning"
      },
      "en": {
        "judul": "Canteen Snacks",
        "instruksi": "Robot buys a snack at the canteen: read the coin price, then pay with that many thousand coins.",
        "pisanggoreng": "fried banana",
        "tahu": "fried tofu",
        "bakwan": "veggie fritter",
        "tehmanis": "sweet tea",
        "nasikuning": "yellow rice"
      }
    },
    "knobs": {
      "harga": {
        "min": 1,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "harga dalam koin seribu; koin di laci selalu lebih banyak dari harga"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kantin",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "bayar",
    "goods": [
      {
        "id": "tahu",
        "labelKey": "tahu",
        "price": 1000,
        "emoji": "🍢"
      },
      {
        "id": "bakwan",
        "labelKey": "bakwan",
        "price": 2000,
        "emoji": "🥟"
      },
      {
        "id": "pisanggoreng",
        "labelKey": "pisanggoreng",
        "price": 3000,
        "emoji": "🍌"
      },
      {
        "id": "tehmanis",
        "labelKey": "tehmanis",
        "price": 4000,
        "emoji": "🧋"
      },
      {
        "id": "nasikuning",
        "labelKey": "nasikuning",
        "price": 5000,
        "emoji": "🍛"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 5000,
      "kindsMax": 1
    }
  },
  {
    "id": "bayar-koin-warung",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKA.UANG-KENAL.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Koin di Warung",
        "instruksi": "Lihat harga di label koin, lalu taruh koin seribu di nampan sebanyak itu.",
        "permen": "permen",
        "roti": "roti",
        "susu": "susu kotak",
        "jeruk": "jeruk",
        "eskrim": "es krim"
      },
      "en": {
        "judul": "Coins at the Shop",
        "instruksi": "Look at the coin price tag, then put that many thousand coins on the tray.",
        "permen": "candy",
        "roti": "bread",
        "susu": "milk carton",
        "jeruk": "orange",
        "eskrim": "ice cream"
      }
    },
    "knobs": {
      "harga": {
        "min": 1,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "harga dalam koin seribu; koin di laci selalu lebih banyak dari harga"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "warung",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "bayar",
    "goods": [
      {
        "id": "permen",
        "labelKey": "permen",
        "price": 1000,
        "emoji": "🍬"
      },
      {
        "id": "roti",
        "labelKey": "roti",
        "price": 2000,
        "emoji": "🍞"
      },
      {
        "id": "susu",
        "labelKey": "susu",
        "price": 3000,
        "emoji": "🧃"
      },
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "price": 4000,
        "emoji": "🍊"
      },
      {
        "id": "eskrim",
        "labelKey": "eskrim",
        "price": 5000,
        "emoji": "🍦"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 5000,
      "kindsMax": 1
    }
  },
  {
    "id": "bayar-rupiah-alat-tulis",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.UANG-10RB.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Beli Alat Tulis",
        "instruksi": "Robot beli alat tulis: lihat harganya, lalu bayar pas dengan uang di laci.",
        "pensil": "pensil",
        "penghapus": "penghapus",
        "buku": "buku tulis",
        "krayon": "krayon",
        "tas": "tas pensil"
      },
      "en": {
        "judul": "Buying Stationery",
        "instruksi": "Robot buys school supplies: read the price, then pay exactly with the money in the drawer.",
        "pensil": "pencil",
        "penghapus": "eraser",
        "buku": "notebook",
        "krayon": "crayons",
        "tas": "pencil case"
      }
    },
    "knobs": {
      "harga": {
        "min": 2,
        "max": 10,
        "default": 3,
        "step": 1,
        "keterangan": "harga dalam ribuan bulat: 2 → 10"
      },
      "pecahan": {
        "min": 1,
        "max": 3,
        "default": 1,
        "step": 1,
        "keterangan": "jenis pecahan yang tersedia di laci: 1 → 3 (seribu, dua ribu, lima ribu)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-alat-tulis",
    "currency": "IDR",
    "denominations": [
      1000,
      2000,
      5000
    ],
    "priceLabel": "rupiah",
    "mode": "bayar",
    "goods": [
      {
        "id": "penghapus",
        "labelKey": "penghapus",
        "price": 2000,
        "emoji": "🩹"
      },
      {
        "id": "pensil",
        "labelKey": "pensil",
        "price": 3000,
        "emoji": "✏️"
      },
      {
        "id": "buku",
        "labelKey": "buku",
        "price": 6000,
        "emoji": "📒"
      },
      {
        "id": "krayon",
        "labelKey": "krayon",
        "price": 8000,
        "emoji": "🖍️"
      },
      {
        "id": "tas",
        "labelKey": "tas",
        "price": 9000,
        "emoji": "👝"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 10000,
      "kindsMax": 1
    }
  },
  {
    "id": "bayar-rupiah-toko-roti",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.UANG-10RB.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bayar di Toko Roti",
        "instruksi": "Lihat harga rotinya, lalu bayar pas dengan gabungan uang seribu, dua ribu, dan lima ribu.",
        "donat": "donat",
        "roti": "roti tawar",
        "kuecangkir": "kue cangkir",
        "bolu": "bolu",
        "tart": "kue tart"
      },
      "en": {
        "judul": "Paying at the Bakery",
        "instruksi": "Read the bread price, then pay exactly using thousand, two-thousand and five-thousand money.",
        "donat": "doughnut",
        "roti": "loaf",
        "kuecangkir": "cupcake",
        "bolu": "sponge cake",
        "tart": "tart"
      }
    },
    "knobs": {
      "harga": {
        "min": 2,
        "max": 10,
        "default": 3,
        "step": 1,
        "keterangan": "harga dalam ribuan bulat: 2 → 10"
      },
      "pecahan": {
        "min": 1,
        "max": 3,
        "default": 1,
        "step": 1,
        "keterangan": "jenis pecahan yang tersedia di laci: 1 → 3 (seribu, dua ribu, lima ribu)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-roti",
    "currency": "IDR",
    "denominations": [
      1000,
      2000,
      5000
    ],
    "priceLabel": "rupiah",
    "mode": "bayar",
    "goods": [
      {
        "id": "donat",
        "labelKey": "donat",
        "price": 2000,
        "emoji": "🍩"
      },
      {
        "id": "roti",
        "labelKey": "roti",
        "price": 4000,
        "emoji": "🍞"
      },
      {
        "id": "kuecangkir",
        "labelKey": "kuecangkir",
        "price": 5000,
        "emoji": "🧁"
      },
      {
        "id": "bolu",
        "labelKey": "bolu",
        "price": 7000,
        "emoji": "🍰"
      },
      {
        "id": "tart",
        "labelKey": "tart",
        "price": 10000,
        "emoji": "🎂"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 10000,
      "kindsMax": 1
    }
  },
  {
    "id": "gabung-bebek-kolam",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bebek Berkumpul",
        "instruksi": "Bebek dari dua sisi berkumpul di kolam: geser penanda ke jumlah semua bebek.",
        "bebek": "bebek",
        "katak": "katak",
        "angsa": "angsa"
      },
      "en": {
        "judul": "Ducks Gather",
        "instruksi": "Ducks from both sides gather in the pond: slide the marker to how many ducks there are in all.",
        "bebek": "ducks",
        "katak": "frogs",
        "angsa": "swans"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 2,
        "max": 6,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah terbesar tiap kelompok; mulai 2+2, naik ke 6+4"
      },
      "target": {
        "min": 10,
        "max": 10,
        "default": 10,
        "step": 1,
        "keterangan": "jumlah gabungan tidak melebihi 10"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kolam",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "gabung",
    "goods": [
      {
        "id": "bebek",
        "labelKey": "bebek",
        "price": 1000,
        "emoji": "🦆"
      },
      {
        "id": "katak",
        "labelKey": "katak",
        "price": 1000,
        "emoji": "🐸"
      },
      {
        "id": "angsa",
        "labelKey": "angsa",
        "price": 1000,
        "emoji": "🦢"
      }
    ],
    "customerRule": {
      "itemsMin": 2,
      "itemsMax": 6,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1,
      "target": 10
    }
  },
  {
    "id": "gabung-keranjang-buah",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Satu Keranjang Bersama",
        "instruksi": "Dua pembeli menaruh buah di satu keranjang: geser penanda ke jumlah semuanya.",
        "jeruk": "jeruk",
        "apel": "apel",
        "mangga": "mangga"
      },
      "en": {
        "judul": "One Shared Basket",
        "instruksi": "Two customers put fruit into one basket: slide the marker to how many there are altogether.",
        "jeruk": "oranges",
        "apel": "apples",
        "mangga": "mangoes"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 2,
        "max": 6,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah terbesar tiap kelompok; mulai 2+2, naik ke 6+4"
      },
      "target": {
        "min": 10,
        "max": 10,
        "default": 10,
        "step": 1,
        "keterangan": "jumlah gabungan tidak melebihi 10"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "gabung",
    "goods": [
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "price": 1000,
        "emoji": "🍊"
      },
      {
        "id": "apel",
        "labelKey": "apel",
        "price": 1000,
        "emoji": "🍎"
      },
      {
        "id": "mangga",
        "labelKey": "mangga",
        "price": 1000,
        "emoji": "🥭"
      }
    ],
    "customerRule": {
      "itemsMin": 2,
      "itemsMax": 6,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1,
      "target": 10
    }
  },
  {
    "id": "hitung-anak-ayam-kandang",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Anak Ayam di Kandang",
        "instruksi": "Sentuh anak ayam satu per satu sambil menghitung, lalu geser penanda ke jumlahnya.",
        "anakayam": "anak ayam",
        "bebek": "bebek",
        "kelinci": "kelinci"
      },
      "en": {
        "judul": "Chicks in the Coop",
        "instruksi": "Touch each chick one at a time as you count, then slide the marker to the number.",
        "anakayam": "chicks",
        "bebek": "ducks",
        "kelinci": "rabbits"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 1,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah benda terbanyak yang harus dihitung"
      },
      "kinds": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "satu jenis benda per putaran; benda disebar, tidak bertumpuk"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "hitung",
    "goods": [
      {
        "id": "anakayam",
        "labelKey": "anakayam",
        "price": 1000,
        "emoji": "🐥"
      },
      {
        "id": "bebek",
        "labelKey": "bebek",
        "price": 1000,
        "emoji": "🦆"
      },
      {
        "id": "kelinci",
        "labelKey": "kelinci",
        "price": 1000,
        "emoji": "🐰"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 5,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1
    }
  },
  {
    "id": "hitung-biji-kebun-11-20",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Biji di Kebun",
        "instruksi": "Biji dan daun berserakan di kebun: sentuh satu per satu sambil menghitung, lalu geser penanda.",
        "biji": "biji",
        "daun": "daun"
      },
      "en": {
        "judul": "Seeds in the Garden",
        "instruksi": "Seeds and leaves are scattered in the garden: touch each as you count, then slide the marker.",
        "biji": "seeds",
        "daun": "leaves"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 11,
        "max": 20,
        "default": 12,
        "step": 1,
        "keterangan": "jumlah benda yang dihitung; boleh dikelompokkan dulu, yang sudah disentuh meredup"
      },
      "kinds": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "satu jenis benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "hitung",
    "goods": [
      {
        "id": "biji",
        "labelKey": "biji",
        "price": 1000,
        "emoji": "🌰"
      },
      {
        "id": "daun",
        "labelKey": "daun",
        "price": 1000,
        "emoji": "🍃"
      }
    ],
    "customerRule": {
      "itemsMin": 11,
      "itemsMax": 20,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1
    }
  },
  {
    "id": "hitung-bunga-taman",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bunga di Taman",
        "instruksi": "Bunga di taman tersebar: sentuh satu per satu sambil menghitung, lalu geser penanda ke jumlahnya.",
        "tulip": "tulip",
        "matahari": "bunga matahari",
        "kupu": "kupu-kupu"
      },
      "en": {
        "judul": "Flowers in the Park",
        "instruksi": "The garden flowers are scattered: touch each one as you count, then slide the marker to the number.",
        "tulip": "tulips",
        "matahari": "sunflowers",
        "kupu": "butterflies"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 6,
        "max": 10,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah benda yang dihitung; benda tersebar acak, yang sudah disentuh meredup"
      },
      "kinds": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "satu jenis benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "hitung",
    "goods": [
      {
        "id": "tulip",
        "labelKey": "tulip",
        "price": 1000,
        "emoji": "🌷"
      },
      {
        "id": "matahari",
        "labelKey": "matahari",
        "price": 1000,
        "emoji": "🌻"
      },
      {
        "id": "kupu",
        "labelKey": "kupu",
        "price": 1000,
        "emoji": "🦋"
      }
    ],
    "customerRule": {
      "itemsMin": 6,
      "itemsMax": 10,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1
    }
  },
  {
    "id": "hitung-ikan-kolam",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ikan di Kolam",
        "instruksi": "Ikannya tersebar: sentuh satu per satu sambil menghitung, lalu geser penanda ke jumlahnya.",
        "ikan": "ikan",
        "katak": "katak",
        "bebek": "bebek"
      },
      "en": {
        "judul": "Fish in the Pond",
        "instruksi": "The fish are scattered: touch each one as you count, then slide the marker to the number.",
        "ikan": "fish",
        "katak": "frogs",
        "bebek": "ducks"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 6,
        "max": 10,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah benda yang dihitung; benda tersebar acak, yang sudah disentuh meredup"
      },
      "kinds": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "satu jenis benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kolam",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "hitung",
    "goods": [
      {
        "id": "ikan",
        "labelKey": "ikan",
        "price": 1000,
        "emoji": "🐟"
      },
      {
        "id": "katak",
        "labelKey": "katak",
        "price": 1000,
        "emoji": "🐸"
      },
      {
        "id": "bebek",
        "labelKey": "bebek",
        "price": 1000,
        "emoji": "🦆"
      }
    ],
    "customerRule": {
      "itemsMin": 6,
      "itemsMax": 10,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1
    }
  },
  {
    "id": "hitung-kelereng-11-20",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kelereng Tumpah",
        "instruksi": "Kelereng robot tumpah: sentuh satu per satu sambil menghitung, lalu geser penanda ke jumlahnya.",
        "kelereng": "kelereng",
        "kancing": "kancing"
      },
      "en": {
        "judul": "Spilled Marbles",
        "instruksi": "The robot's marbles spilled: touch each one as you count, then slide the marker to the number.",
        "kelereng": "marbles",
        "kancing": "buttons"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 11,
        "max": 20,
        "default": 12,
        "step": 1,
        "keterangan": "jumlah benda yang dihitung; boleh dikelompokkan dulu, yang sudah disentuh meredup"
      },
      "kinds": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "satu jenis benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "hitung",
    "goods": [
      {
        "id": "kelereng",
        "labelKey": "kelereng",
        "price": 1000,
        "emoji": "🔵"
      },
      {
        "id": "kancing",
        "labelKey": "kancing",
        "price": 1000,
        "emoji": "🟤"
      }
    ],
    "customerRule": {
      "itemsMin": 11,
      "itemsMax": 20,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1
    }
  },
  {
    "id": "hitung-kerang-pantai",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kerang di Pantai",
        "instruksi": "Sentuh kerang satu per satu sambil menghitung, lalu geser penanda ke jumlahnya.",
        "kerang": "kerang",
        "kepiting": "kepiting",
        "bintang": "bintang laut"
      },
      "en": {
        "judul": "Shells on the Beach",
        "instruksi": "Touch each shell one at a time as you count, then slide the marker to the number.",
        "kerang": "shells",
        "kepiting": "crabs",
        "bintang": "starfish"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 1,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah benda terbanyak yang harus dihitung"
      },
      "kinds": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "satu jenis benda per putaran; benda disebar, tidak bertumpuk"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pantai",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "hitung",
    "goods": [
      {
        "id": "kerang",
        "labelKey": "kerang",
        "price": 1000,
        "emoji": "🐚"
      },
      {
        "id": "kepiting",
        "labelKey": "kepiting",
        "price": 1000,
        "emoji": "🦀"
      },
      {
        "id": "bintang",
        "labelKey": "bintang",
        "price": 1000,
        "emoji": "⭐"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 5,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1
    }
  },
  {
    "id": "ikan-kolam-sisa",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ikan yang Tersisa",
        "instruksi": "Beberapa ikan ditangkap lalu kolam berkabut: taruh pelet sebanyak ikan yang tersisa.",
        "ikan": "ikan",
        "pelet": "pelet"
      },
      "en": {
        "judul": "Fish Left Over",
        "instruksi": "Some fish were caught and the pond fogged up: put down one pellet for each fish left.",
        "ikan": "fish",
        "pelet": "pellets"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 5,
        "max": 10,
        "default": 7,
        "step": 1,
        "keterangan": "jumlah awal benda"
      },
      "pengurang": {
        "min": 1,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "berapa yang diambil; kolam terlihat → tertutup kabut diatur presenter"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kolam",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "sisa",
    "goods": [
      {
        "id": "ikan",
        "labelKey": "ikan",
        "price": 1000,
        "emoji": "🐟"
      },
      {
        "id": "pelet",
        "labelKey": "pelet",
        "price": 1000,
        "emoji": "🟤"
      }
    ],
    "customerRule": {
      "itemsMin": 5,
      "itemsMax": 10,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1,
      "target": 10
    }
  },
  {
    "id": "jari-pembeli-jeruk",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Berapa Jari Pembeli?",
        "instruksi": "Lihat cepat jari pembeli, lalu ambil jeruk sebanyak jarinya.",
        "jeruk": "jeruk",
        "apel": "apel"
      },
      "en": {
        "judul": "How Many Fingers?",
        "instruksi": "Look quickly at the customer's fingers, then take that many oranges.",
        "jeruk": "oranges",
        "apel": "apples"
      }
    },
    "knobs": {
      "flashMs": {
        "min": 700,
        "max": 1500,
        "default": 1000,
        "step": 100,
        "keterangan": "lama jari pembeli terlihat (ms); makin pendek makin mengandalkan subitising"
      },
      "itemsMax": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jari terbanyak yang diacungkan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "subitasi",
    "goods": [
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "price": 1000,
        "emoji": "🍊"
      },
      {
        "id": "apel",
        "labelKey": "apel",
        "price": 1000,
        "emoji": "🍎"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 3,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1,
      "flashMs": 1000
    }
  },
  {
    "id": "jari-pembeli-kue",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Jari Pembeli Kue",
        "instruksi": "Pembeli kue mengacungkan jari sebentar: ambil kue sebanyak jarinya.",
        "donat": "donat",
        "kuecangkir": "kue cangkir"
      },
      "en": {
        "judul": "Cake Buyer's Fingers",
        "instruksi": "The cake customer holds up fingers for a moment: take that many cakes.",
        "donat": "doughnuts",
        "kuecangkir": "cupcakes"
      }
    },
    "knobs": {
      "flashMs": {
        "min": 700,
        "max": 1500,
        "default": 1000,
        "step": 100,
        "keterangan": "lama jari pembeli terlihat (ms); makin pendek makin mengandalkan subitising"
      },
      "itemsMax": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jari terbanyak yang diacungkan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-kue",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "subitasi",
    "goods": [
      {
        "id": "donat",
        "labelKey": "donat",
        "price": 1000,
        "emoji": "🍩"
      },
      {
        "id": "kuecangkir",
        "labelKey": "kuecangkir",
        "price": 1000,
        "emoji": "🧁"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 3,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1,
      "flashMs": 1000
    }
  },
  {
    "id": "kasir-kembalian-toko-mainan",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.UANG-10RB.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kasir Toko Mainan",
        "instruksi": "Robot jadi kasir toko mainan: pembeli bayar sepuluh ribu, beri kembalian yang pas.",
        "kelereng": "kelereng",
        "yoyo": "yoyo",
        "balon": "balon",
        "mobil": "mobil-mobilan",
        "boneka": "boneka"
      },
      "en": {
        "judul": "Toy Shop Cashier",
        "instruksi": "Robot is the toy-shop cashier: the customer pays ten thousand, give the right change.",
        "kelereng": "marbles",
        "yoyo": "yo-yo",
        "balon": "balloon",
        "mobil": "toy car",
        "boneka": "doll"
      }
    },
    "knobs": {
      "harga": {
        "min": 5,
        "max": 9,
        "default": 9,
        "step": 1,
        "keterangan": "harga barang (ribuan); kembalian kecil dulu (harga 9) lalu makin besar (harga 5)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-mainan",
    "currency": "IDR",
    "denominations": [
      1000,
      2000,
      5000
    ],
    "priceLabel": "rupiah",
    "mode": "kembalian",
    "goods": [
      {
        "id": "kelereng",
        "labelKey": "kelereng",
        "price": 5000,
        "emoji": "🔵"
      },
      {
        "id": "yoyo",
        "labelKey": "yoyo",
        "price": 6000,
        "emoji": "🪀"
      },
      {
        "id": "balon",
        "labelKey": "balon",
        "price": 7000,
        "emoji": "🎈"
      },
      {
        "id": "mobil",
        "labelKey": "mobil",
        "price": 8000,
        "emoji": "🚗"
      },
      {
        "id": "boneka",
        "labelKey": "boneka",
        "price": 9000,
        "emoji": "🧸"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 10000,
      "kindsMax": 1
    }
  },
  {
    "id": "kasir-kembalian-warung",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.UANG-10RB.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kembalian di Warung",
        "instruksi": "Pembeli bayar sepuluh ribu: hitung maju dari harganya, lalu beri kembalian yang pas.",
        "sabun": "sabun",
        "susu": "susu",
        "roti": "roti",
        "telur": "telur",
        "minyak": "minyak goreng"
      },
      "en": {
        "judul": "Change at the Shop",
        "instruksi": "The customer pays ten thousand: count on from the price, then give the right change.",
        "sabun": "soap",
        "susu": "milk",
        "roti": "bread",
        "telur": "eggs",
        "minyak": "cooking oil"
      }
    },
    "knobs": {
      "harga": {
        "min": 5,
        "max": 9,
        "default": 9,
        "step": 1,
        "keterangan": "harga barang (ribuan); kembalian kecil dulu (harga 9) lalu makin besar (harga 5)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "warung",
    "currency": "IDR",
    "denominations": [
      1000,
      2000,
      5000
    ],
    "priceLabel": "rupiah",
    "mode": "kembalian",
    "goods": [
      {
        "id": "sabun",
        "labelKey": "sabun",
        "price": 5000,
        "emoji": "🧼"
      },
      {
        "id": "susu",
        "labelKey": "susu",
        "price": 6000,
        "emoji": "🥛"
      },
      {
        "id": "roti",
        "labelKey": "roti",
        "price": 7000,
        "emoji": "🍞"
      },
      {
        "id": "telur",
        "labelKey": "telur",
        "price": 8000,
        "emoji": "🥚"
      },
      {
        "id": "minyak",
        "labelKey": "minyak",
        "price": 9000,
        "emoji": "🫙"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 10000,
      "kindsMax": 1
    }
  },
  {
    "id": "kue-piring-sisa",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kue yang Tersisa",
        "instruksi": "Beberapa kue dibeli lalu piring ditutup: taruh lilin sebanyak kue yang tersisa.",
        "kue": "kue",
        "lilin": "lilin"
      },
      "en": {
        "judul": "Cakes Left Over",
        "instruksi": "Some cakes were bought and the plate was covered: put down one candle for each cake left.",
        "kue": "cakes",
        "lilin": "candles"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 5,
        "max": 10,
        "default": 7,
        "step": 1,
        "keterangan": "jumlah awal benda"
      },
      "pengurang": {
        "min": 1,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "berapa yang diambil; kolam terlihat → tertutup kabut diatur presenter"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-kue",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "sisa",
    "goods": [
      {
        "id": "kue",
        "labelKey": "kue",
        "price": 1000,
        "emoji": "🧁"
      },
      {
        "id": "lilin",
        "labelKey": "lilin",
        "price": 1000,
        "emoji": "🕯️"
      }
    ],
    "customerRule": {
      "itemsMin": 5,
      "itemsMax": 10,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 1,
      "target": 10
    }
  },
  {
    "id": "lengkapi-koin-lima-kantin",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Genap Lima di Kantin",
        "instruksi": "Teman robot menunjukkan koinnya sekejap: tambahkan koin dari laci supaya genap lima.",
        "nasikuning": "nasi kuning",
        "eskrim": "es krim"
      },
      "en": {
        "judul": "Make Five at the Canteen",
        "instruksi": "The robot's friend flashes their coins: add coins from the drawer to make exactly five.",
        "nasikuning": "yellow rice",
        "eskrim": "ice cream"
      }
    },
    "knobs": {
      "flashMs": {
        "min": 700,
        "max": 1500,
        "default": 1000,
        "step": 100,
        "keterangan": "lama koin pembeli terlihat sebelum digenggam (ms)"
      },
      "target": {
        "min": 5,
        "max": 10,
        "default": 5,
        "step": 5,
        "keterangan": "harga target: pasangan 5 → pasangan 10 sebagai pengaya"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kantin",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "lengkapi",
    "goods": [
      {
        "id": "nasikuning",
        "labelKey": "nasikuning",
        "price": 5000,
        "emoji": "🍛"
      },
      {
        "id": "eskrim",
        "labelKey": "eskrim",
        "price": 5000,
        "emoji": "🍦"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 5000,
      "kindsMax": 1,
      "flashMs": 1000,
      "target": 5
    }
  },
  {
    "id": "lengkapi-koin-lima-pasar",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Genap Lima di Pasar",
        "instruksi": "Pembeli menunjukkan koinnya sebentar lalu menggenggamnya: tambahkan koin supaya pas lima.",
        "mangga": "mangga",
        "nanas": "nanas"
      },
      "en": {
        "judul": "Make Five at the Market",
        "instruksi": "The customer flashes their coins then hides them: add coins to make exactly five.",
        "mangga": "mango",
        "nanas": "pineapple"
      }
    },
    "knobs": {
      "flashMs": {
        "min": 700,
        "max": 1500,
        "default": 1000,
        "step": 100,
        "keterangan": "lama koin pembeli terlihat sebelum digenggam (ms)"
      },
      "target": {
        "min": 5,
        "max": 10,
        "default": 5,
        "step": 5,
        "keterangan": "harga target: pasangan 5 → pasangan 10 sebagai pengaya"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "lengkapi",
    "goods": [
      {
        "id": "mangga",
        "labelKey": "mangga",
        "price": 5000,
        "emoji": "🥭"
      },
      {
        "id": "nanas",
        "labelKey": "nanas",
        "price": 5000,
        "emoji": "🍍"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 5000,
      "kindsMax": 1,
      "flashMs": 1000,
      "target": 5
    }
  },
  {
    "id": "mesin-tukar-koin",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.UANG-10RB.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mesin Tukar Koin",
        "instruksi": "Masukkan uang kertas ke mesin tukar, lalu susun koin seribu sebanyak nilainya.",
        "duaribu": "uang dua ribu",
        "limaribu": "uang lima ribu"
      },
      "en": {
        "judul": "Coin Exchange Machine",
        "instruksi": "Put the note into the change machine, then lay out thousand coins worth the same.",
        "duaribu": "2,000 note",
        "limaribu": "5,000 note"
      }
    },
    "knobs": {
      "harga": {
        "min": 5,
        "max": 10,
        "default": 5,
        "step": 5,
        "keterangan": "total uang yang ditukar (ribuan): sampai Rp5.000 dulu, lalu sampai Rp10.000; 1–3 lembar"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pasar",
    "currency": "IDR",
    "denominations": [
      1000,
      2000,
      5000,
      10000
    ],
    "priceLabel": "rupiah",
    "mode": "tukar",
    "goods": [
      {
        "id": "lembar-2000",
        "labelKey": "duaribu",
        "price": 2000,
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "lembar-5000",
        "labelKey": "limaribu",
        "price": 5000,
        "emoji": "💵",
        "color": "#6d4c41"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 3,
      "payExact": true,
      "maxTotal": 10000,
      "kindsMax": 1
    }
  },
  {
    "id": "pasar-buah-6-10",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pasar Buah Ramai",
        "instruksi": "Pembeli minta banyak buah: dengarkan, lalu ambil tepat sebanyak itu.",
        "jeruk": "jeruk",
        "mangga": "mangga",
        "pisang": "pisang",
        "apel": "apel"
      },
      "en": {
        "judul": "Busy Fruit Market",
        "instruksi": "The customer wants lots of fruit: listen, then take exactly that many.",
        "jeruk": "oranges",
        "mangga": "mangoes",
        "pisang": "bananas",
        "apel": "apples"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 6,
        "max": 10,
        "default": 7,
        "step": 1,
        "keterangan": "jumlah yang diminta; tersedia 10–12"
      },
      "kinds": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jenis barang dalam satu pesanan: 1 → 2"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "ambil",
    "goods": [
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "price": 1000,
        "emoji": "🍊"
      },
      {
        "id": "mangga",
        "labelKey": "mangga",
        "price": 1000,
        "emoji": "🥭"
      },
      {
        "id": "pisang",
        "labelKey": "pisang",
        "price": 1000,
        "emoji": "🍌"
      },
      {
        "id": "apel",
        "labelKey": "apel",
        "price": 1000,
        "emoji": "🍎"
      }
    ],
    "customerRule": {
      "itemsMin": 6,
      "itemsMax": 10,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 2
    }
  },
  {
    "id": "sains-bekal-sehat-pasar",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "SAINS.TKB.MAKANAN-SEHAT.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bekal Sehat dari Pasar",
        "instruksi": "Robot menyiapkan bekal sehat: dengarkan pesanan, lalu masukkan buah atau sayur sebanyak itu ke keranjang.",
        "pisang": "pisang",
        "apel": "apel",
        "wortel": "wortel",
        "timun": "timun",
        "jeruk": "jeruk"
      },
      "en": {
        "judul": "Healthy Lunchbox from the Market",
        "instruksi": "Robot packs a healthy lunch: listen to the order, then put that many fruits or vegetables in the basket.",
        "pisang": "bananas",
        "apel": "apples",
        "wortel": "carrots",
        "timun": "cucumbers",
        "jeruk": "oranges"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 1,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah bekal yang diminta per pesanan, setara uang 3 → 5 koin"
      },
      "kinds": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jenis bekal dalam satu pesanan: 1 → 2"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "ambil",
    "goods": [
      {
        "id": "pisang",
        "labelKey": "pisang",
        "price": 1000,
        "emoji": "🍌"
      },
      {
        "id": "apel",
        "labelKey": "apel",
        "price": 1000,
        "emoji": "🍎"
      },
      {
        "id": "wortel",
        "labelKey": "wortel",
        "price": 1000,
        "emoji": "🥕"
      },
      {
        "id": "timun",
        "labelKey": "timun",
        "price": 1000,
        "emoji": "🥒"
      },
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "price": 1000,
        "emoji": "🍊"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 5,
      "payExact": true,
      "maxTotal": 5000,
      "kindsMax": 2
    }
  },
  {
    "id": "toko-mainan-6-10",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Toko Mainan",
        "instruksi": "Pembeli toko mainan menyebut jumlahnya: ambil mainan tepat sebanyak itu.",
        "bola": "bola",
        "boneka": "boneka beruang",
        "mobil": "mobil-mobilan",
        "balon": "balon"
      },
      "en": {
        "judul": "Toy Shop",
        "instruksi": "The toy-shop customer says a number: take exactly that many toys.",
        "bola": "balls",
        "boneka": "teddy bears",
        "mobil": "toy cars",
        "balon": "balloons"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 6,
        "max": 10,
        "default": 7,
        "step": 1,
        "keterangan": "jumlah yang diminta; tersedia 10–12"
      },
      "kinds": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jenis barang dalam satu pesanan: 1 → 2"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-mainan",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "ambil",
    "goods": [
      {
        "id": "bola",
        "labelKey": "bola",
        "price": 1000,
        "emoji": "⚽"
      },
      {
        "id": "boneka",
        "labelKey": "boneka",
        "price": 1000,
        "emoji": "🧸"
      },
      {
        "id": "mobil",
        "labelKey": "mobil",
        "price": 1000,
        "emoji": "🚗"
      },
      {
        "id": "balon",
        "labelKey": "balon",
        "price": 1000,
        "emoji": "🎈"
      }
    ],
    "customerRule": {
      "itemsMin": 6,
      "itemsMax": 10,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 2
    }
  },
  {
    "id": "tukar-uang-bank-mini",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.TKB.UANG-10RB.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bank Mini",
        "instruksi": "Robot jadi teller bank mini: tukar uang kertas pembeli dengan koin seribu yang nilainya sama.",
        "duaribu": "uang dua ribu",
        "limaribu": "uang lima ribu"
      },
      "en": {
        "judul": "Mini Bank",
        "instruksi": "Robot is the mini-bank teller: swap the customer's note for thousand coins worth the same.",
        "duaribu": "2,000 note",
        "limaribu": "5,000 note"
      }
    },
    "knobs": {
      "harga": {
        "min": 5,
        "max": 10,
        "default": 5,
        "step": 5,
        "keterangan": "total uang yang ditukar (ribuan): sampai Rp5.000 dulu, lalu sampai Rp10.000; 1–3 lembar"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "bank-mini",
    "currency": "IDR",
    "denominations": [
      1000,
      2000,
      5000,
      10000
    ],
    "priceLabel": "rupiah",
    "mode": "tukar",
    "goods": [
      {
        "id": "lembar-2000",
        "labelKey": "duaribu",
        "price": 2000,
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "lembar-5000",
        "labelKey": "limaribu",
        "price": 5000,
        "emoji": "💵",
        "color": "#6d4c41"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 3,
      "payExact": true,
      "maxTotal": 10000,
      "kindsMax": 1
    }
  },
  {
    "id": "warung-sayur-1-5",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Warung Sayur",
        "instruksi": "Pembeli datang ke warung sayur: dengarkan, lalu ambil sayur sebanyak yang diminta.",
        "wortel": "wortel",
        "jagung": "jagung",
        "tomat": "tomat",
        "timun": "timun"
      },
      "en": {
        "judul": "Vegetable Stall",
        "instruksi": "A customer comes to the veggie stall: listen, then take as many as they ask for.",
        "wortel": "carrots",
        "jagung": "corn",
        "tomat": "tomatoes",
        "timun": "cucumbers"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 1,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah yang diminta; sayur yang tersedia selalu lebih banyak dari yang diminta"
      },
      "kinds": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jenis sayur dalam satu pesanan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "warung",
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "priceLabel": "koin",
    "mode": "ambil",
    "goods": [
      {
        "id": "wortel",
        "labelKey": "wortel",
        "price": 1000,
        "emoji": "🥕"
      },
      {
        "id": "jagung",
        "labelKey": "jagung",
        "price": 1000,
        "emoji": "🌽"
      },
      {
        "id": "tomat",
        "labelKey": "tomat",
        "price": 1000,
        "emoji": "🍅"
      },
      {
        "id": "timun",
        "labelKey": "timun",
        "price": 1000,
        "emoji": "🥒"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 5,
      "payExact": true,
      "maxTotal": 20000,
      "kindsMax": 2
    }
  },
  {
    "id": "batu-di-depan-robot",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.PAUD.PERINTAH.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Batu di Depan Robot",
        "instruksi": "Kalau ada batu di depan robot tekan 'lompat', kalau kosong tekan 'maju'."
      },
      "en": {
        "judul": "Rock Ahead",
        "instruksi": "If there is a rock in front of robot press 'jump', if it is empty press 'forward'."
      }
    },
    "knobs": {
      "rocks": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah batu di jalur; tiap batu tepat satu petak di depan robot saat robot tiba"
      },
      "distance": {
        "min": 1,
        "max": 4,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah perintah terpendek"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "langsung",
    "commands": [
      "maju",
      "lompat"
    ],
    "grids": [
      {
        "id": "batu-awal-2",
        "w": 4,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 1
      },
      {
        "id": "batu-awal-3",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-tengah-3",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-tengah-4",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-5",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "batu-awal-2-papan-5x1-00",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 1
      },
      {
        "id": "batu-awal-3-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-tengah-3-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-tengah-4-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-5-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "batu-awal-2-papan-5x1-00-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 1
      },
      {
        "id": "batu-awal-3-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-tengah-3-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-tengah-4-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-5-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "batu-awal-2-papan-5x1-10",
        "w": 5,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 1
      }
    ]
  },
  {
    "id": "batu-di-jalan-kebun",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.PAUD.PERINTAH.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Batu di Jalan Kebun",
        "instruksi": "Robot jalan ke atas kebun: lompat kalau ada batu di depannya, maju kalau kosong."
      },
      "en": {
        "judul": "Rocks on the Garden Path",
        "instruksi": "Robot walks up the garden: jump when a rock is right in front, step forward when it is clear."
      }
    },
    "knobs": {
      "rocks": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah batu di jalur; tiap batu tepat satu petak di depan robot saat robot tiba"
      },
      "distance": {
        "min": 1,
        "max": 4,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah perintah terpendek"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun",
    "execMode": "langsung",
    "commands": [
      "maju",
      "lompat"
    ],
    "grids": [
      {
        "id": "atas-batu-awal-2",
        "w": 2,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 1
      },
      {
        "id": "atas-batu-awal-3",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 2
      },
      {
        "id": "atas-batu-tengah-3",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 2
      },
      {
        "id": "atas-batu-tengah-4",
        "w": 2,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "atas-dua-batu-5",
        "w": 2,
        "h": 7,
        "start": {
          "x": 0,
          "y": 6,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "atas-batu-awal-2-cermin-datar",
        "w": 2,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 1
      },
      {
        "id": "atas-batu-awal-3-cermin-datar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 2
      },
      {
        "id": "atas-batu-tengah-3-cermin-datar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 2
      },
      {
        "id": "atas-batu-tengah-4-cermin-datar",
        "w": 2,
        "h": 6,
        "start": {
          "x": 1,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "atas-dua-batu-5-cermin-datar",
        "w": 2,
        "h": 7,
        "start": {
          "x": 1,
          "y": 6,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "atas-batu-awal-2-papan-3x4-00",
        "w": 3,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 1
      },
      {
        "id": "atas-batu-awal-3-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 2
      },
      {
        "id": "atas-batu-tengah-3-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 2
      },
      {
        "id": "atas-batu-tengah-4-papan-3x6-00",
        "w": 3,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "atas-dua-batu-5-papan-3x7-00",
        "w": 3,
        "h": 7,
        "start": {
          "x": 0,
          "y": 6,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "atas-batu-awal-2-cermin-datar-papan-3x4-00",
        "w": 3,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 1
      }
    ]
  },
  {
    "id": "belok-dua-kali-taman",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.NAVIGASI.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Belok Dua Kali",
        "instruksi": "Lihat ke mana robot menghadap, lalu susun belok dan maju supaya sampai bintang."
      },
      "en": {
        "judul": "Turn Twice",
        "instruksi": "Check which way robot is facing, then arrange turn and forward blocks to reach the star."
      }
    },
    "knobs": {
      "turns": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah belokan yang dibutuhkan: 1 → 2"
      },
      "distance": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah perintah terpendek"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "taman",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "kanan-maju-2",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kiri-maju-2",
        "w": 4,
        "h": 3,
        "start": {
          "x": 3,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "putar-balik-jauh",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "naik-lalu-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "naik-lalu-kiri",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "putar-balik-jauh-cermin-tegak",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "putar-balik-jauh-putar-kanan",
        "w": 2,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-maju-2-putar-kiri",
        "w": 3,
        "h": 4,
        "start": {
          "x": 2,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kiri-maju-2-putar-kiri",
        "w": 3,
        "h": 4,
        "start": {
          "x": 2,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "naik-lalu-kanan-putar-kiri",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "putar-balik-jauh-putar-kanan-cermin-datar",
        "w": 2,
        "h": 4,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "naik-lalu-kanan-putar-kiri-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-maju-2-papan-5x3-00",
        "w": 5,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kiri-maju-2-papan-5x3-00",
        "w": 5,
        "h": 3,
        "start": {
          "x": 3,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "putar-balik-jauh-papan-5x2-00",
        "w": 5,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "naik-lalu-kanan-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      }
    ]
  },
  {
    "id": "belok-menghadap-bintang",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.NAVIGASI.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Menghadap Bintang",
        "instruksi": "Robot belum menghadap bintang: pakai blok kiri atau kanan, lalu maju."
      },
      "en": {
        "judul": "Face the Star",
        "instruksi": "Robot is not facing the star yet: use a left or right block, then forward."
      }
    },
    "knobs": {
      "turns": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah belokan yang dibutuhkan: 1 → 2"
      },
      "distance": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah perintah terpendek"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "kiri-lalu-maju",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kanan-lalu-maju",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kiri-dari-utara",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "putar-balik-ke-timur",
        "w": 3,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "naik-jauh-lalu-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kiri-lalu-maju-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "putar-balik-ke-timur-cermin-datar",
        "w": 3,
        "h": 2,
        "start": {
          "x": 2,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "naik-jauh-lalu-kanan-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kiri-lalu-maju-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "putar-balik-ke-timur-cermin-tegak",
        "w": 3,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kiri-lalu-maju-cermin-tegak-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "putar-balik-ke-timur-cermin-tegak-cermin-datar",
        "w": 3,
        "h": 2,
        "start": {
          "x": 2,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "putar-balik-ke-timur-putar-kanan",
        "w": 2,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "naik-jauh-lalu-kanan-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "naik-jauh-lalu-kanan-cermin-datar-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "putar-balik-ke-timur-cermin-tegak-putar-kanan",
        "w": 2,
        "h": 3,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      }
    ]
  },
  {
    "id": "bendera-dua-program",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.DEKOMPOSISI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Singgah di Bendera",
        "instruksi": "Rak cuma muat empat blok: taruh bendera di tengah jalan, lalu buat program ke bendera dan dari bendera ke bintang."
      },
      "en": {
        "judul": "Stop at the Flag",
        "instruksi": "The rack holds only four blocks: plant a flag mid-way, then program to the flag and from the flag to the star."
      }
    },
    "knobs": {
      "distance": {
        "min": 6,
        "max": 7,
        "default": 6,
        "step": 1,
        "keterangan": "panjang jalur: 6 → 7 perintah, tiap bagian harus ≤ 4 blok termasuk bendera"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan",
      "bendera"
    ],
    "grids": [
      {
        "id": "enam-naik-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-kanan-naik",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "tujuh-kanan-naik",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "rackSlots": 4
      },
      {
        "id": "tujuh-naik-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "rackSlots": 4
      },
      {
        "id": "enam-naik-kanan-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-kanan-naik-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "tujuh-naik-kanan-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "rackSlots": 4
      },
      {
        "id": "tujuh-kanan-naik-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "rackSlots": 4
      },
      {
        "id": "enam-naik-kanan-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-kanan-naik-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-naik-kanan-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-kanan-naik-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-naik-kanan-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "enam-kanan-naik-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 4
      },
      {
        "id": "tujuh-kanan-naik-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "rackSlots": 4
      },
      {
        "id": "tujuh-naik-kanan-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "rackSlots": 4
      }
    ]
  },
  {
    "id": "berhenti-sebelum-tabrak",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.DEBUG-BANYAK.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Berhenti Sebelum Tabrak",
        "instruksi": "Jalankan program selangkah demi selangkah dan berhenti tepat sebelum robot menabrak, lalu tunjuk blok penabraknya."
      },
      "en": {
        "judul": "Stop Before the Crash",
        "instruksi": "Run the program one step at a time and stop right before robot crashes, then point to the crashing block."
      }
    },
    "knobs": {
      "posisi": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "letak perintah penabrak: 0 = awal program, 1 = akhir program"
      },
      "distance": {
        "min": 5,
        "max": 8,
        "default": 5,
        "step": 1,
        "keterangan": "panjang program yang diberikan"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "langkah",
    "prediksi": true,
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "tabrak-dinding-awal",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 0,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-tengah",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 3,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-tepi-akhir",
        "w": 5,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-setelah-belok",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-awal-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 3,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-setelah-belok-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-tengah-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [
          {
            "x": 3,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-tepi-akhir-cermin-tegak",
        "w": 5,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-awal-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-setelah-belok-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [
          {
            "x": 2,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-awal-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 3
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-setelah-belok-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-tengah-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-tepi-akhir-putar-kiri",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-dinding-tengah-cermin-tegak-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tabrak-tepi-akhir-cermin-tegak-putar-kiri",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      }
    ]
  },
  {
    "id": "grid-3x3-dua-belokan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.NAVIGASI.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Memutari Tembok Taman",
        "instruksi": "Ada tembok di taman: susun program maju dan belok supaya robot memutar sampai bintang."
      },
      "en": {
        "judul": "Around the Garden Wall",
        "instruksi": "There is a wall in the park: build a forward-and-turn program so robot goes around to the star."
      }
    },
    "knobs": {
      "turns": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah belokan di jalur: 1 → 2 (tembok memaksa belokan kedua)"
      },
      "distance": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah perintah terpendek, maksimal 5"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "taman",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "tembok-tengah-kiri",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tembok-tengah-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-kanan-naik",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [
          {
            "x": 0,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tanpa-tembok-satu-belok",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-kanan-naik-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tanpa-tembok-satu-belok-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tembok-tengah-kiri-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tembok-tengah-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tembok-tengah-kanan-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-kanan-naik-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tembok-tengah-kanan-putar-kanan-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-kanan-naik-putar-kanan-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [
          {
            "x": 0,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-kanan-naik-putar-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [
          {
            "x": 2,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-kanan-naik-putar-kanan-putar-balik",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tanpa-tembok-satu-belok-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tanpa-tembok-satu-belok-cermin-datar-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      }
    ]
  },
  {
    "id": "grid-3x3-satu-belokan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.NAVIGASI.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Maju Lalu Belok",
        "instruksi": "Susun maju dan belok di rak supaya robot sampai bintang, lalu tekan jalan."
      },
      "en": {
        "judul": "Forward, Then Turn",
        "instruksi": "Arrange forward and turn blocks on the rack so robot reaches the star, then press go."
      }
    },
    "knobs": {
      "turns": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah belokan di jalur: 1 → 2 (tembok memaksa belokan kedua)"
      },
      "distance": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah perintah terpendek, maksimal 5"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "pojok-ke-pojok",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-lalu-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-lalu-naik",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "satu-naik-satu-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "dari-kanan-ke-kiri",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "pojok-ke-pojok-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "satu-naik-satu-kanan-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-lalu-naik-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-lalu-kanan-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "satu-naik-satu-kanan-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "naik-lalu-kanan-putar-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "satu-naik-satu-kanan-putar-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "pojok-ke-pojok-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "naik-lalu-kanan-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-lalu-naik-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "satu-naik-satu-kanan-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      }
    ]
  },
  {
    "id": "grid-4x4-dua-belokan",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.PROGRAM-5-8.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Program Delapan Blok",
        "instruksi": "Susun seluruh program dulu, maju dan belok sampai delapan blok, baru tekan jalan."
      },
      "en": {
        "judul": "Eight-Block Program",
        "instruksi": "Build the whole program first, forward and turns up to eight blocks, then press go."
      }
    },
    "knobs": {
      "distance": {
        "min": 5,
        "max": 8,
        "default": 5,
        "step": 1,
        "keterangan": "panjang program terpendek: 5 → 8"
      },
      "walls": {
        "min": 0,
        "max": 2,
        "default": 0,
        "step": 1,
        "keterangan": "jumlah dinding: 0 → 2 (dinding mencegah jalan pintas)"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "satu-dinding-5",
        "w": 4,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 2
        },
        "walls": [
          {
            "x": 1,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "dua-dinding-6",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "satu-dinding-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 0,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "tanpa-dinding-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "satu-dinding-5-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 2,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 2
        },
        "walls": [
          {
            "x": 2,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "dua-dinding-6-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "satu-dinding-8-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 3,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "tanpa-dinding-8-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "tanpa-dinding-8-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "satu-dinding-5-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 2,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "tanpa-dinding-8-putar-kanan-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "satu-dinding-5-putar-kiri-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 1,
          "dir": "W"
        },
        "goal": {
          "x": 2,
          "y": 3
        },
        "walls": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 5
      },
      {
        "id": "dua-dinding-6-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "satu-dinding-8-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 1,
            "y": 3
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "dua-dinding-6-cermin-datar-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "satu-dinding-8-cermin-datar-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 8
      }
    ]
  },
  {
    "id": "grid-4x4-tembok-taman",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.PROGRAM-5-8.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tembok di Taman Luas",
        "instruksi": "Lihat tembok dan arah robot, lalu susun program utuh sebelum dijalankan."
      },
      "en": {
        "judul": "Wall in the Big Garden",
        "instruksi": "Look at the walls and the robot's direction, then build the whole program before running it."
      }
    },
    "knobs": {
      "distance": {
        "min": 5,
        "max": 8,
        "default": 5,
        "step": 1,
        "keterangan": "panjang program terpendek: 5 → 8"
      },
      "walls": {
        "min": 0,
        "max": 2,
        "default": 0,
        "step": 1,
        "keterangan": "jumlah dinding: 0 → 2 (dinding mencegah jalan pintas)"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "taman",
    "execMode": "program",
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "balik-arah-6",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "dinding-kiri-6",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 2
        },
        "walls": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "memutar-dinding-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 3,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "jalan-panjang-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 2
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "dinding-kiri-6-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 2
        },
        "walls": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "memutar-dinding-8-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 0,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "balik-arah-6-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "jalan-panjang-8-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "dinding-kiri-6-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "memutar-dinding-8-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [
          {
            "x": 2,
            "y": 3
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "dinding-kiri-6-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 3
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "memutar-dinding-8-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "balik-arah-6-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "jalan-panjang-8-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      },
      {
        "id": "balik-arah-6-cermin-tegak-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 6
      },
      {
        "id": "jalan-panjang-8-cermin-tegak-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "rocks": [],
        "optimal": 8
      }
    ]
  },
  {
    "id": "kalau-batu-tiga-jalur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.KONDISI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kalau Ada Batu",
        "instruksi": "Satu program harus berhasil di tiga jalur yang batunya pindah-pindah: pakai blok 'kalau batu lompat, kalau tidak maju'."
      },
      "en": {
        "judul": "If There's a Rock",
        "instruksi": "One program must work on three paths where the rock moves: use the 'if rock jump, else forward' block."
      }
    },
    "knobs": {
      "rocks": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah batu per jalur; posisinya berpindah di tiga jalur satu kelompok"
      },
      "distance": {
        "min": 2,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah perintah terpendek per jalur"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "semuaGrid": true,
    "commands": [
      "maju",
      "lompat",
      "kalau",
      "ulangi"
    ],
    "grids": [
      {
        "id": "empat-batu-1",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat"
      },
      {
        "id": "empat-batu-2",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat"
      },
      {
        "id": "empat-batu-3",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat"
      },
      {
        "id": "lima-batu-2",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima"
      },
      {
        "id": "lima-batu-3",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima"
      },
      {
        "id": "lima-batu-4",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima"
      },
      {
        "id": "empat-batu-1-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v1"
      },
      {
        "id": "empat-batu-2-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v1"
      },
      {
        "id": "empat-batu-3-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v1"
      },
      {
        "id": "lima-batu-2-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v2"
      },
      {
        "id": "lima-batu-3-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v2"
      },
      {
        "id": "lima-batu-4-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v2"
      },
      {
        "id": "empat-batu-1-papan-7x1-10",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v3"
      },
      {
        "id": "empat-batu-2-papan-7x1-10",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v3"
      },
      {
        "id": "empat-batu-3-papan-7x1-10",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v3"
      },
      {
        "id": "lima-batu-2-papan-8x1-10",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v4"
      },
      {
        "id": "lima-batu-3-papan-8x1-10",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v4"
      },
      {
        "id": "lima-batu-4-papan-8x1-10",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 5,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v4"
      },
      {
        "id": "empat-batu-1-papan-6x2-00",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v5"
      },
      {
        "id": "empat-batu-2-papan-6x2-00",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v5"
      },
      {
        "id": "empat-batu-3-papan-6x2-00",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v5"
      },
      {
        "id": "lima-batu-2-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v6"
      },
      {
        "id": "lima-batu-3-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v6"
      },
      {
        "id": "lima-batu-4-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v6"
      },
      {
        "id": "empat-batu-1-papan-6x2-01",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 1
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v7"
      },
      {
        "id": "empat-batu-2-papan-6x2-01",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v7"
      },
      {
        "id": "empat-batu-3-papan-6x2-01",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 1
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v7"
      },
      {
        "id": "lima-batu-2-papan-7x2-01",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v8"
      },
      {
        "id": "lima-batu-3-papan-7x2-01",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v8"
      },
      {
        "id": "lima-batu-4-papan-7x2-01",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v8"
      },
      {
        "id": "empat-batu-1-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v1-v1"
      },
      {
        "id": "empat-batu-2-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v1-v1"
      },
      {
        "id": "empat-batu-3-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v1-v1"
      },
      {
        "id": "lima-batu-2-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v2-v2"
      },
      {
        "id": "lima-batu-3-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v2-v2"
      },
      {
        "id": "lima-batu-4-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v2-v2"
      },
      {
        "id": "empat-batu-1-papan-7x1-10-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v3-v3"
      },
      {
        "id": "empat-batu-2-papan-7x1-10-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v3-v3"
      },
      {
        "id": "empat-batu-3-papan-7x1-10-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v3-v3"
      },
      {
        "id": "lima-batu-2-papan-8x1-10-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v4-v4"
      },
      {
        "id": "lima-batu-3-papan-8x1-10-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v4-v4"
      },
      {
        "id": "lima-batu-4-papan-8x1-10-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 5,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v4-v4"
      },
      {
        "id": "empat-batu-1-papan-6x2-00-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v5-v5"
      },
      {
        "id": "empat-batu-2-papan-6x2-00-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 4,
        "group": "empat-v5-v5"
      },
      {
        "id": "empat-batu-3-papan-6x2-00-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 2,
        "rackSlots": 4,
        "group": "empat-v5-v5"
      },
      {
        "id": "lima-batu-2-papan-7x2-00-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v6-v6"
      },
      {
        "id": "lima-batu-3-papan-7x2-00-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v6-v6"
      },
      {
        "id": "lima-batu-4-papan-7x2-00-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 5,
        "group": "lima-v6-v6"
      }
    ]
  },
  {
    "id": "kalau-dua-batu-tiga-jalur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.KONDISI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Dua Batu Pindah-Pindah",
        "instruksi": "Dua batu di tiap jalur dan letaknya berbeda-beda: susun satu program dengan blok kalau yang lolos di ketiganya."
      },
      "en": {
        "judul": "Two Moving Rocks",
        "instruksi": "Two rocks on each path in different places: build one program with the if-block that passes all three."
      }
    },
    "knobs": {
      "rocks": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah batu per jalur; posisinya berpindah di tiga jalur satu kelompok"
      },
      "distance": {
        "min": 2,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah perintah terpendek per jalur"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "bukit",
    "execMode": "program",
    "semuaGrid": true,
    "commands": [
      "maju",
      "lompat",
      "kalau",
      "ulangi"
    ],
    "grids": [
      {
        "id": "enam-batu-1-3",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "enam"
      },
      {
        "id": "enam-batu-2-4",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam"
      },
      {
        "id": "enam-batu-1-4",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam"
      },
      {
        "id": "naik-enam-batu-1-3",
        "w": 2,
        "h": 8,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik"
      },
      {
        "id": "naik-enam-batu-2-4",
        "w": 2,
        "h": 8,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik"
      },
      {
        "id": "naik-enam-batu-2-5",
        "w": 2,
        "h": 8,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik"
      },
      {
        "id": "naik-enam-batu-1-3-cermin-datar",
        "w": 2,
        "h": 8,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v1"
      },
      {
        "id": "naik-enam-batu-2-4-cermin-datar",
        "w": 2,
        "h": 8,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v1"
      },
      {
        "id": "naik-enam-batu-2-5-cermin-datar",
        "w": 2,
        "h": 8,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v1"
      },
      {
        "id": "naik-enam-batu-1-3-putar-kanan",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v2"
      },
      {
        "id": "naik-enam-batu-2-4-putar-kanan",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v2"
      },
      {
        "id": "naik-enam-batu-2-5-putar-kanan",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v2"
      },
      {
        "id": "enam-batu-1-3-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "enam-v3"
      },
      {
        "id": "enam-batu-2-4-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v3"
      },
      {
        "id": "enam-batu-1-4-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v3"
      },
      {
        "id": "naik-enam-batu-1-3-papan-3x8-00",
        "w": 3,
        "h": 8,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v4"
      },
      {
        "id": "naik-enam-batu-2-4-papan-3x8-00",
        "w": 3,
        "h": 8,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v4"
      },
      {
        "id": "naik-enam-batu-2-5-papan-3x8-00",
        "w": 3,
        "h": 8,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v4"
      },
      {
        "id": "enam-batu-1-3-papan-9x1-10",
        "w": 9,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 7,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "enam-v5"
      },
      {
        "id": "enam-batu-2-4-papan-9x1-10",
        "w": 9,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 7,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v5"
      },
      {
        "id": "enam-batu-1-4-papan-9x1-10",
        "w": 9,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 7,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v5"
      },
      {
        "id": "naik-enam-batu-1-3-papan-3x8-10",
        "w": 3,
        "h": 8,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v6"
      },
      {
        "id": "naik-enam-batu-2-4-papan-3x8-10",
        "w": 3,
        "h": 8,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v6"
      },
      {
        "id": "naik-enam-batu-2-5-papan-3x8-10",
        "w": 3,
        "h": 8,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v6"
      },
      {
        "id": "enam-batu-1-3-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "enam-v7"
      },
      {
        "id": "enam-batu-2-4-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v7"
      },
      {
        "id": "enam-batu-1-4-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v7"
      },
      {
        "id": "naik-enam-batu-1-3-papan-2x9-00",
        "w": 2,
        "h": 9,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v8"
      },
      {
        "id": "naik-enam-batu-2-4-papan-2x9-00",
        "w": 2,
        "h": 9,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v8"
      },
      {
        "id": "naik-enam-batu-2-5-papan-2x9-00",
        "w": 2,
        "h": 9,
        "start": {
          "x": 0,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v8"
      },
      {
        "id": "naik-enam-batu-1-3-papan-3x8-00-cermin-datar",
        "w": 3,
        "h": 8,
        "start": {
          "x": 2,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v4-v1"
      },
      {
        "id": "naik-enam-batu-2-4-papan-3x8-00-cermin-datar",
        "w": 3,
        "h": 8,
        "start": {
          "x": 2,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v4-v1"
      },
      {
        "id": "naik-enam-batu-2-5-papan-3x8-00-cermin-datar",
        "w": 3,
        "h": 8,
        "start": {
          "x": 2,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v4-v1"
      },
      {
        "id": "naik-enam-batu-1-3-papan-2x9-00-cermin-datar",
        "w": 2,
        "h": 9,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 4
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v8-v2"
      },
      {
        "id": "naik-enam-batu-2-4-papan-2x9-00-cermin-datar",
        "w": 2,
        "h": 9,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v8-v2"
      },
      {
        "id": "naik-enam-batu-2-5-papan-2x9-00-cermin-datar",
        "w": 2,
        "h": 9,
        "start": {
          "x": 1,
          "y": 7,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v8-v2"
      },
      {
        "id": "naik-enam-batu-1-3-putar-kanan-cermin-tegak",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v2-v3"
      },
      {
        "id": "naik-enam-batu-2-4-putar-kanan-cermin-tegak",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v2-v3"
      },
      {
        "id": "naik-enam-batu-2-5-putar-kanan-cermin-tegak",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v2-v3"
      },
      {
        "id": "enam-batu-1-3-papan-8x2-00-cermin-tegak",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "enam-v7-v4"
      },
      {
        "id": "enam-batu-2-4-papan-8x2-00-cermin-tegak",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v7-v4"
      },
      {
        "id": "enam-batu-1-4-papan-8x2-00-cermin-tegak",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "enam-v7-v4"
      },
      {
        "id": "naik-enam-batu-1-3-papan-3x8-00-putar-kanan",
        "w": 8,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v4-v5"
      },
      {
        "id": "naik-enam-batu-2-4-papan-3x8-00-putar-kanan",
        "w": 8,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v4-v5"
      },
      {
        "id": "naik-enam-batu-2-5-papan-3x8-00-putar-kanan",
        "w": 8,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v4-v5"
      },
      {
        "id": "naik-enam-batu-1-3-papan-3x8-10-putar-kanan",
        "w": 8,
        "h": 3,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ],
        "optimal": 3,
        "rackSlots": 6,
        "group": "naik-v6-v6"
      },
      {
        "id": "naik-enam-batu-2-4-papan-3x8-10-putar-kanan",
        "w": 8,
        "h": 3,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v6-v6"
      },
      {
        "id": "naik-enam-batu-2-5-papan-3x8-10-putar-kanan",
        "w": 8,
        "h": 3,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ],
        "optimal": 4,
        "rackSlots": 6,
        "group": "naik-v6-v6"
      }
    ]
  },
  {
    "id": "lompati-batu-jalur-atas",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.KALAU.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mendaki Bukit Berbatu",
        "instruksi": "Robot mendaki bukit berbatu: taruh 'lompat' hanya di petak batu, sisanya 'maju'."
      },
      "en": {
        "judul": "Climbing the Rocky Hill",
        "instruksi": "Robot climbs a rocky hill: put 'jump' only on the rock squares, 'forward' for the rest."
      }
    },
    "knobs": {
      "rocks": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah batu di jalur: 1 → 2"
      },
      "distance": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah perintah terpendek"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "bukit",
    "execMode": "program",
    "commands": [
      "maju",
      "lompat"
    ],
    "grids": [
      {
        "id": "naik-batu-1-jarak-3",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 2
      },
      {
        "id": "naik-batu-2-jarak-4",
        "w": 2,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-batu-3-jarak-5",
        "w": 2,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-dua-batu-jarak-5",
        "w": 2,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-dua-batu-jarak-6",
        "w": 2,
        "h": 7,
        "start": {
          "x": 0,
          "y": 6,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 4
      },
      {
        "id": "naik-batu-1-jarak-3-cermin-datar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 2
      },
      {
        "id": "naik-batu-2-jarak-4-cermin-datar",
        "w": 2,
        "h": 6,
        "start": {
          "x": 1,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-batu-3-jarak-5-cermin-datar",
        "w": 2,
        "h": 6,
        "start": {
          "x": 1,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-dua-batu-jarak-5-cermin-datar",
        "w": 2,
        "h": 6,
        "start": {
          "x": 1,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-dua-batu-jarak-6-cermin-datar",
        "w": 2,
        "h": 7,
        "start": {
          "x": 1,
          "y": 6,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 2
          }
        ],
        "optimal": 4
      },
      {
        "id": "naik-batu-1-jarak-3-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 2
      },
      {
        "id": "naik-batu-2-jarak-4-papan-3x6-00",
        "w": 3,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 3
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-batu-3-jarak-5-papan-3x6-00",
        "w": 3,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-dua-batu-jarak-5-papan-3x6-00",
        "w": 3,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 3
      },
      {
        "id": "naik-dua-batu-jarak-6-papan-3x7-00",
        "w": 3,
        "h": 7,
        "start": {
          "x": 0,
          "y": 6,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 2
          }
        ],
        "optimal": 4
      },
      {
        "id": "naik-batu-1-jarak-3-cermin-datar-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 3
          }
        ],
        "optimal": 2
      }
    ]
  },
  {
    "id": "lompati-batu-jalur-kanan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.KALAU.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lompat di Petak Batu",
        "instruksi": "Lihat di mana batunya: taruh 'lompat' tepat di situ dan 'maju' di petak kosong, lalu jalan."
      },
      "en": {
        "judul": "Jump at the Rock",
        "instruksi": "See where the rock is: put 'jump' right there and 'forward' for the empty squares, then go."
      }
    },
    "knobs": {
      "rocks": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah batu di jalur: 1 → 2"
      },
      "distance": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah perintah terpendek"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "lompat"
    ],
    "grids": [
      {
        "id": "batu-1-jarak-3",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-2-jarak-4",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "batu-3-jarak-5",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-1-3",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-2-4",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4
      },
      {
        "id": "batu-1-jarak-3-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-2-jarak-4-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "batu-3-jarak-5-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-1-3-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-2-4-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4
      },
      {
        "id": "batu-1-jarak-3-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          }
        ],
        "optimal": 2
      },
      {
        "id": "batu-2-jarak-4-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "batu-3-jarak-5-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-1-3-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ],
        "optimal": 3
      },
      {
        "id": "dua-batu-2-4-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ],
        "optimal": 4
      },
      {
        "id": "batu-1-jarak-3-papan-6x1-10",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [
          {
            "x": 2,
            "y": 0
          }
        ],
        "optimal": 2
      }
    ]
  },
  {
    "id": "perbaiki-dua-belokan",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.DEBUG-BANYAK.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Dua Belokan Keliru",
        "instruksi": "Ada dua blok yang salah di program robot: temukan keduanya dan ganti, jangan lebih."
      },
      "en": {
        "judul": "Two Wrong Turns",
        "instruksi": "Two blocks in the robot's program are wrong: find both and change them, no more than two."
      }
    },
    "knobs": {
      "distance": {
        "min": 6,
        "max": 8,
        "default": 6,
        "step": 1,
        "keterangan": "panjang program yang benar: 6 → 8"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "debug": true,
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "dua-salah-6",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-7",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-6b",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-6-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-7-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-8-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-6b-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-7-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-8-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-7-cermin-tegak-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-8-cermin-tegak-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-6-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-8-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-6b-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "dua-salah-6-cermin-datar-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 2
      }
    ]
  },
  {
    "id": "perbaiki-dua-langkah",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.DEBUG-BANYAK.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Meleset Dua Kali",
        "instruksi": "Program ini meleset dua kali: jalankan, perhatikan, lalu perbaiki tepat dua blok."
      },
      "en": {
        "judul": "Missed Twice",
        "instruksi": "This program goes wrong twice: run it, watch closely, then fix exactly two blocks."
      }
    },
    "knobs": {
      "distance": {
        "min": 6,
        "max": 8,
        "default": 6,
        "step": 1,
        "keterangan": "panjang program yang benar: 6 → 8"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "taman",
    "execMode": "program",
    "debug": true,
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "maju-jadi-belok-6",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "belok-jadi-maju-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-8",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-7",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "maju-jadi-belok-6-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "belok-jadi-maju-8-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-8-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-7-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "belok-jadi-maju-8-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-8-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "belok-jadi-maju-8-putar-kanan-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-8-putar-kanan-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 3
        },
        "walls": [],
        "rocks": [],
        "optimal": 8,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-7-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "campur-7-cermin-tegak-putar-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 7,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "maju-jadi-belok-6-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      },
      {
        "id": "maju-jadi-belok-6-cermin-datar-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 0,
          "dir": "W"
        },
        "goal": {
          "x": 0,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 2
      }
    ]
  },
  {
    "id": "perbaiki-satu-belokan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.DEBUG.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Satu Belokan Keliru",
        "instruksi": "Program robot sudah ada tapi satu blok salah: jalankan, lihat melesetnya, lalu ganti satu blok."
      },
      "en": {
        "judul": "One Wrong Turn",
        "instruksi": "The robot's program is ready but one block is wrong: run it, watch it miss, then change one block."
      }
    },
    "knobs": {
      "distance": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "panjang program yang benar"
      },
      "posisi": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = perintah salah di awal/tengah, 1 = di akhir (dipilih presenter dari id grid)"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "debug": true,
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "kiri-harusnya-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "kanan-harusnya-kiri",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-awal",
        "w": 3,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-akhir",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-akhir-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-awal-cermin-tegak",
        "w": 3,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "kiri-harusnya-kanan-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "kanan-harusnya-kiri-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-akhir-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-awal-putar-kiri",
        "w": 2,
        "h": 3,
        "start": {
          "x": 1,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-awal-putar-kiri-cermin-datar",
        "w": 2,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-akhir-putar-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 1
      },
      {
        "id": "kiri-harusnya-kanan-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-awal-papan-4x2-00",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-akhir-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-harusnya-maju-akhir-cermin-datar-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 1
      }
    ]
  },
  {
    "id": "perbaiki-satu-langkah",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.DEBUG.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Satu Blok Keliru",
        "instruksi": "Robot meleset karena satu blok keliru: temukan dan ganti blok itu supaya sampai bintang."
      },
      "en": {
        "judul": "One Wrong Block",
        "instruksi": "Robot misses because one block is wrong: find it and change it so he reaches the star."
      }
    },
    "knobs": {
      "distance": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "panjang program yang benar"
      },
      "posisi": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = perintah salah di awal/tengah, 1 = di akhir (dipilih presenter dari id grid)"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "taman",
    "execMode": "program",
    "debug": true,
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "lurus-belok-nyasar",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "lurus-belok-di-akhir",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 1
      },
      {
        "id": "maju-harusnya-belok",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-kepagian",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "maju-harusnya-belok-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-kepagian-cermin-datar",
        "w": 3,
        "h": 3,
        "start": {
          "x": 2,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "lurus-belok-nyasar-cermin-tegak",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "lurus-belok-di-akhir-cermin-tegak",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          }
        ],
        "fixes": 1
      },
      {
        "id": "maju-harusnya-belok-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-kepagian-putar-kanan",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "maju-harusnya-belok-putar-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-kepagian-putar-kanan-cermin-tegak",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "lurus-belok-nyasar-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "lurus-belok-di-akhir-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ],
        "fixes": 1
      },
      {
        "id": "maju-harusnya-belok-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      },
      {
        "id": "belok-kepagian-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ],
        "fixes": 1
      }
    ]
  },
  {
    "id": "program-panjang-jadi-pendek",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.ULANGI.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Program Jadi Pendek",
        "instruksi": "Program robot ini panjang: tulis ulang dengan blok ulangi supaya muat di rak dan jalannya tetap sama."
      },
      "en": {
        "judul": "Shorten the Program",
        "instruksi": "This program is long: rewrite it with a repeat block so it fits the rack and robot walks the same path."
      }
    },
    "knobs": {
      "distance": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "panjang program asli yang harus dipadatkan"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "kanan",
      "ulangi"
    ],
    "grids": [
      {
        "id": "empat-maju",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "lima-maju",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik",
        "w": 2,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "maju-kanan-dua-kali",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ]
      },
      {
        "id": "enam-maju",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik-cermin-datar",
        "w": 2,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik-putar-kanan",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "maju-kanan-dua-kali-putar-kiri",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ]
      },
      {
        "id": "empat-maju-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "lima-maju-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik-putar-kanan-cermin-tegak",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik-papan-3x4-00",
        "w": 3,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "maju-kanan-dua-kali-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          }
        ]
      },
      {
        "id": "enam-maju-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik-cermin-datar-papan-3x4-00",
        "w": 3,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "tiga-maju-naik-putar-kanan-papan-5x2-00",
        "w": 5,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      }
    ]
  },
  {
    "id": "rak-maju-lurus-atas",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.NAVIGASI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Naik ke Bintang",
        "instruksi": "Robot mau naik ke bintang: susun blok 'maju' secukupnya di rak, lalu tekan jalan."
      },
      "en": {
        "judul": "Up to the Star",
        "instruksi": "Robot wants to climb to the star: put just enough 'forward' blocks on the rack, then press go."
      }
    },
    "knobs": {
      "distance": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jarak ke bintang; memilih grid dengan optimal = distance"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "menara",
    "execMode": "program",
    "commands": [
      "maju"
    ],
    "grids": [
      {
        "id": "atas-2",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-3",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "atas-4",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "atas-2b",
        "w": 2,
        "h": 4,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-2-cermin-datar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-3-cermin-datar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "atas-4-cermin-datar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "atas-2b-cermin-datar",
        "w": 2,
        "h": 4,
        "start": {
          "x": 1,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-2-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-3-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "atas-2-papan-3x5-00-cermin-datar",
        "w": 3,
        "h": 5,
        "start": {
          "x": 2,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-3-papan-3x5-00-cermin-datar",
        "w": 3,
        "h": 5,
        "start": {
          "x": 2,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "atas-4-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "atas-2b-papan-3x4-00",
        "w": 3,
        "h": 4,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-2-cermin-datar-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "atas-3-cermin-datar-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      }
    ]
  },
  {
    "id": "rak-maju-lurus-kanan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKA.NAVIGASI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Blok Maju",
        "instruksi": "Susun blok 'maju' di rak sebanyak langkah ke bintang, lalu tekan jalan."
      },
      "en": {
        "judul": "Forward Block Rack",
        "instruksi": "Put 'forward' blocks on the rack, one for each step to the star, then press go."
      }
    },
    "knobs": {
      "distance": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jarak ke bintang; memilih grid dengan optimal = distance"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju"
    ],
    "grids": [
      {
        "id": "kanan-2",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kanan-3",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-4",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-3b",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-2-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kanan-3-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-4-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-3b-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-2-papan-6x1-10",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kanan-4-papan-6x1-10",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-2-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kanan-3-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-4-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      },
      {
        "id": "kanan-3b-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "kanan-2-papan-6x1-10-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "kanan-4-papan-6x1-10-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4
      }
    ]
  },
  {
    "id": "robot-maju-langsung",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.PAUD.PERINTAH.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Robot Maju Satu-Satu",
        "instruksi": "Tekan 'maju' satu-satu sampai robot berdiri di bintang."
      },
      "en": {
        "judul": "Robot Step by Step",
        "instruksi": "Press 'forward' one at a time until robot stands on the star."
      }
    },
    "knobs": {
      "distance": {
        "min": 1,
        "max": 3,
        "default": 1,
        "step": 1,
        "keterangan": "jarak ke bintang (1–3 langkah); memilih grid dengan optimal = distance"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "langsung",
    "commands": [
      "maju"
    ],
    "grids": [
      {
        "id": "lurus-1",
        "w": 4,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-2",
        "w": 4,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "lurus-3",
        "w": 4,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "lurus-1-papan-5x1-00",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-2-papan-5x1-00",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "lurus-3-papan-5x1-00",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "lurus-1-papan-5x1-10",
        "w": 5,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-2-papan-5x1-10",
        "w": 5,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "lurus-3-papan-5x1-10",
        "w": 5,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "lurus-1-papan-4x2-00",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-1-papan-4x2-00-cermin-tegak",
        "w": 4,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-1-papan-5x1-00-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-2-papan-5x1-00-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      },
      {
        "id": "lurus-3-papan-5x1-00-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3
      },
      {
        "id": "lurus-1-papan-5x1-10-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 1
      },
      {
        "id": "lurus-2-papan-5x1-10-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2
      }
    ]
  },
  {
    "id": "tebak-petak-berikutnya",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.PROGRAM-5-8.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tebak Petak Berikutnya",
        "instruksi": "Sebelum tiap blok dijalankan, tunjuk petak tempat robot akan berdiri, lalu tekan langkah."
      },
      "en": {
        "judul": "Guess the Next Square",
        "instruksi": "Before each block runs, point to the square where robot will stand, then press step."
      }
    },
    "knobs": {
      "turns": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "jumlah belokan dalam program: 0 → 1 (setelah belok, maju mengarah ke arah baru)"
      },
      "distance": {
        "min": 5,
        "max": 5,
        "default": 5,
        "step": 1,
        "keterangan": "program selalu 5 blok untuk 5 prediksi"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "langkah",
    "prediksi": true,
    "commands": [
      "maju",
      "kiri",
      "kanan"
    ],
    "grids": [
      {
        "id": "lurus-lima",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima",
        "w": 2,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-belok-kanan",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "kanan-belok-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-cermin-datar",
        "w": 2,
        "h": 6,
        "start": {
          "x": 1,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-belok-kanan-cermin-datar",
        "w": 4,
        "h": 4,
        "start": {
          "x": 3,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "kanan-belok-kiri-cermin-tegak",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-putar-kanan",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "lurus-lima-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-papan-3x6-00",
        "w": 3,
        "h": 6,
        "start": {
          "x": 0,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-papan-3x6-00-cermin-datar",
        "w": 3,
        "h": 6,
        "start": {
          "x": 2,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-putar-kanan-cermin-tegak",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-papan-3x6-00-putar-kanan",
        "w": 6,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-belok-kanan-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kanan"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "kanan-belok-kiri-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "kiri"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      },
      {
        "id": "naik-lima-cermin-datar-papan-3x6-00",
        "w": 3,
        "h": 6,
        "start": {
          "x": 1,
          "y": 5,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "program": [
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          },
          {
            "cmd": "maju"
          }
        ]
      }
    ]
  },
  {
    "id": "ulangi-berapa-kali-lurus",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.ULANGI.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ulangi Berapa Kali?",
        "instruksi": "Hitung petak sampai bintang, jangan hitung petak robot, lalu pilih angka ulangi yang pas."
      },
      "en": {
        "judul": "Repeat How Many Times?",
        "instruksi": "Count the squares to the star, not the robot's own square, then pick the right repeat number."
      }
    },
    "knobs": {
      "distance": {
        "min": 2,
        "max": 6,
        "default": 3,
        "step": 1,
        "keterangan": "panjang jalur = angka ulangi (2–6); rak 2 slot"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "ulangi"
    ],
    "grids": [
      {
        "id": "lurus-2",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2,
        "rackSlots": 2
      },
      {
        "id": "lurus-3",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "lurus-4",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 2
      },
      {
        "id": "lurus-5",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "rackSlots": 2
      },
      {
        "id": "lurus-6",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 2
      },
      {
        "id": "lurus-2-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2,
        "rackSlots": 2
      },
      {
        "id": "lurus-3-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "lurus-4-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 2
      },
      {
        "id": "lurus-5-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "rackSlots": 2
      },
      {
        "id": "lurus-6-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 2
      },
      {
        "id": "lurus-2-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2,
        "rackSlots": 2
      },
      {
        "id": "lurus-3-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "lurus-4-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 2
      },
      {
        "id": "lurus-5-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 5,
        "rackSlots": 2
      },
      {
        "id": "lurus-6-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 2
      },
      {
        "id": "lurus-2-papan-8x1-10",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 2,
        "rackSlots": 2
      }
    ]
  },
  {
    "id": "ulangi-maju-dan-belok",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.ULANGI.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ulangi Maju dan Belok",
        "instruksi": "Isi blok ulangi dengan dua perintah, lalu pilih berapa kali supaya robot tepat di bintang."
      },
      "en": {
        "judul": "Repeat Forward and Turn",
        "instruksi": "Fill the repeat block with two commands, then choose how many times so robot lands right on the star."
      }
    },
    "knobs": {
      "distance": {
        "min": 3,
        "max": 6,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah perintah terpendek tanpa ulangi; rak 3 slot memaksa 'ulangi N × (dua perintah)'"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "taman",
    "execMode": "program",
    "commands": [
      "maju",
      "kanan",
      "ulangi"
    ],
    "grids": [
      {
        "id": "maju-maju-x2",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 3
      },
      {
        "id": "maju-maju-x3",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-pojok",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-tengah",
        "w": 4,
        "h": 4,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-naik",
        "w": 3,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-tengah-putar-kiri",
        "w": 4,
        "h": 4,
        "start": {
          "x": 1,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-maju-x2-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 3
      },
      {
        "id": "maju-maju-x3-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-pojok-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-tengah-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-pojok-papan-4x3-00-putar-kiri",
        "w": 3,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-tengah-papan-5x4-00-putar-kiri",
        "w": 4,
        "h": 5,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 2
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-naik-papan-4x3-00",
        "w": 4,
        "h": 3,
        "start": {
          "x": 0,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-kanan-x2-tengah-putar-kiri-papan-5x4-00",
        "w": 5,
        "h": 4,
        "start": {
          "x": 1,
          "y": 2,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 3
      },
      {
        "id": "maju-maju-x2-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 4,
        "rackSlots": 3
      },
      {
        "id": "maju-maju-x3-papan-8x1-00-papan-9x1-00",
        "w": 9,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 6,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 6,
        "rackSlots": 3
      }
    ]
  },
  {
    "id": "ulangi-tiga-ke-atas",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.ULANGI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ulangi Tiga ke Atas",
        "instruksi": "Robot naik tiga petak tapi rak cuma dua slot: pakai 'ulangi 3' berisi maju."
      },
      "en": {
        "judul": "Repeat Three Upward",
        "instruksi": "Robot climbs three squares but the rack has two slots: use 'repeat 3' with forward."
      }
    },
    "knobs": {
      "distance": {
        "min": 3,
        "max": 3,
        "default": 3,
        "step": 1,
        "keterangan": "jalur selalu 3 petak; rak hanya 2 slot sehingga 'ulangi 3 × maju' satu-satunya jalan"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "menara",
    "execMode": "program",
    "commands": [
      "maju",
      "ulangi"
    ],
    "grids": [
      {
        "id": "atas-3",
        "w": 2,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek",
        "w": 2,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-lebar",
        "w": 2,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek-cermin-datar",
        "w": 2,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek-papan-3x4-00",
        "w": 3,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-lebar-papan-3x5-00",
        "w": 3,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek-papan-3x4-10",
        "w": 3,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-lebar-papan-3x5-10",
        "w": 3,
        "h": 5,
        "start": {
          "x": 2,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-papan-2x6-00",
        "w": 2,
        "h": 6,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek-papan-3x4-00-cermin-datar",
        "w": 3,
        "h": 4,
        "start": {
          "x": 2,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-papan-2x6-00-cermin-datar",
        "w": 2,
        "h": 6,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-papan-3x5-00-papan-4x5-00",
        "w": 4,
        "h": 5,
        "start": {
          "x": 0,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek-papan-3x4-00-papan-4x4-00",
        "w": 4,
        "h": 4,
        "start": {
          "x": 0,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 0,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-lebar-papan-3x5-00-papan-4x5-00",
        "w": 4,
        "h": 5,
        "start": {
          "x": 1,
          "y": 4,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "atas-3-pendek-papan-3x4-10-papan-4x4-00",
        "w": 4,
        "h": 4,
        "start": {
          "x": 1,
          "y": 3,
          "dir": "N"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      }
    ]
  },
  {
    "id": "ulangi-tiga-ke-kanan",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.TKB.ULANGI.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ulangi Tiga Kali",
        "instruksi": "Rak cuma muat dua blok: pakai blok 'ulangi 3' berisi maju supaya robot sampai bintang."
      },
      "en": {
        "judul": "Repeat Three Times",
        "instruksi": "The rack only holds two blocks: use a 'repeat 3' block with forward so robot reaches the star."
      }
    },
    "knobs": {
      "distance": {
        "min": 3,
        "max": 3,
        "default": 3,
        "step": 1,
        "keterangan": "jalur selalu 3 petak; rak hanya 2 slot sehingga 'ulangi 3 × maju' satu-satunya jalan"
      }
    },
    "assets": [],
    "generatif": false,
    "rounds": 10,
    "world": "kebun-pasar",
    "execMode": "program",
    "commands": [
      "maju",
      "ulangi"
    ],
    "grids": [
      {
        "id": "kanan-3",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-geser",
        "w": 6,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar-cermin-tegak",
        "w": 6,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-papan-6x1-00",
        "w": 6,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-geser-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar-papan-7x2-00",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-geser-papan-7x1-10",
        "w": 7,
        "h": 1,
        "start": {
          "x": 2,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 5,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar-papan-7x2-10",
        "w": 7,
        "h": 2,
        "start": {
          "x": 1,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-papan-5x2-00",
        "w": 5,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar-papan-7x2-00-cermin-tegak",
        "w": 7,
        "h": 2,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar-papan-7x2-10-cermin-tegak",
        "w": 7,
        "h": 2,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-papan-5x2-00-cermin-tegak",
        "w": 5,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-papan-6x1-00-papan-7x1-00",
        "w": 7,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-geser-papan-7x1-00-papan-8x1-00",
        "w": 8,
        "h": 1,
        "start": {
          "x": 1,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      },
      {
        "id": "kanan-3-lebar-papan-7x2-00-papan-8x2-00",
        "w": 8,
        "h": 2,
        "start": {
          "x": 0,
          "y": 1,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 1
        },
        "walls": [],
        "rocks": [],
        "optimal": 3,
        "rackSlots": 2
      }
    ]
  },
  {
    "id": "baju-beruang-besar-kecil",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BANDING.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Baju Beruang",
        "instruksi": "Beruang besar dan beruang kecil mau berpakaian: sentuh yang diminta.",
        "pilihan": "pilihan",
        "baju": "baju",
        "topi": "topi",
        "sepatu": "sepatu",
        "mangkuk": "mangkuk",
        "bola": "bola",
        "tBesar": "Mana yang lebih besar?",
        "tKecil": "Mana yang lebih kecil?"
      },
      "en": {
        "judul": "Bear Outfits",
        "instruksi": "Big bear and little bear are getting dressed: touch the one asked for.",
        "pilihan": "choices",
        "baju": "shirt",
        "topi": "hat",
        "sepatu": "shoe",
        "mangkuk": "bowl",
        "bola": "ball",
        "tBesar": "Which one is bigger?",
        "tKecil": "Which one is smaller?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua benda sejenis; rasio ukuran 1,5–2 (knob rasio diatur lewat scale item)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah-beruang",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "baju-besar",
        "labelKey": "baju",
        "bin": "pilihan",
        "emoji": "👕",
        "scale": 1.8
      },
      {
        "id": "baju-kecil",
        "labelKey": "baju",
        "bin": "pilihan",
        "emoji": "👕",
        "scale": 1
      },
      {
        "id": "topi-besar",
        "labelKey": "topi",
        "bin": "pilihan",
        "emoji": "🎩",
        "scale": 1.6
      },
      {
        "id": "topi-kecil",
        "labelKey": "topi",
        "bin": "pilihan",
        "emoji": "🎩",
        "scale": 1
      },
      {
        "id": "sepatu-besar",
        "labelKey": "sepatu",
        "bin": "pilihan",
        "emoji": "👟",
        "scale": 1.7
      },
      {
        "id": "sepatu-kecil",
        "labelKey": "sepatu",
        "bin": "pilihan",
        "emoji": "👟",
        "scale": 1
      },
      {
        "id": "mangkuk-besar",
        "labelKey": "mangkuk",
        "bin": "pilihan",
        "emoji": "🥣",
        "scale": 1.6
      },
      {
        "id": "mangkuk-kecil",
        "labelKey": "mangkuk",
        "bin": "pilihan",
        "emoji": "🥣",
        "scale": 1
      },
      {
        "id": "bola-besar",
        "labelKey": "bola",
        "bin": "pilihan",
        "emoji": "⚽",
        "scale": 1.8
      },
      {
        "id": "bola-kecil",
        "labelKey": "bola",
        "bin": "pilihan",
        "emoji": "⚽",
        "scale": 1
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBesar",
        "choices": [
          "baju-kecil",
          "baju-besar"
        ],
        "correct": "baju-besar"
      },
      {
        "id": "r2",
        "promptKey": "tKecil",
        "choices": [
          "topi-besar",
          "topi-kecil"
        ],
        "correct": "topi-kecil"
      },
      {
        "id": "r3",
        "promptKey": "tBesar",
        "choices": [
          "sepatu-kecil",
          "sepatu-besar"
        ],
        "correct": "sepatu-besar"
      },
      {
        "id": "r4",
        "promptKey": "tKecil",
        "choices": [
          "mangkuk-besar",
          "mangkuk-kecil"
        ],
        "correct": "mangkuk-kecil"
      },
      {
        "id": "r5",
        "promptKey": "tBesar",
        "choices": [
          "bola-kecil",
          "bola-besar"
        ],
        "correct": "bola-besar"
      }
    ]
  },
  {
    "id": "bentuk-di-rumah",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BENTUK-DASAR.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bentuk di Rumah",
        "instruksi": "Dengarkan bentuk yang disebut, lalu sentuh benda di rumah yang bentuknya itu.",
        "pilihan": "pilihan",
        "jam": "jam dinding",
        "bola": "bola",
        "piring": "piring",
        "jendela": "jendela",
        "kado": "kotak kado",
        "bingkai": "bingkai foto",
        "tenda": "tenda",
        "pizza": "potongan pizza",
        "gantungan": "gantungan baju",
        "tBulat": "Mana yang bulat?",
        "tKotak": "Mana yang kotak?",
        "tSegitiga": "Mana yang segitiga?"
      },
      "en": {
        "judul": "Shapes at Home",
        "instruksi": "Listen to the shape, then touch the thing in the house with that shape.",
        "pilihan": "choices",
        "jam": "wall clock",
        "bola": "ball",
        "piring": "plate",
        "jendela": "window",
        "kado": "gift box",
        "bingkai": "picture frame",
        "tenda": "tent",
        "pizza": "pizza slice",
        "gantungan": "coat hanger",
        "tBulat": "Which one is round?",
        "tKotak": "Which one is square?",
        "tSegitiga": "Which one is a triangle?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 3,
        "default": 3,
        "step": 1,
        "keterangan": "tiga benda, satu per bentuk; benda dengan dua bentuk (rumah) sengaja dihindari"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "jam",
        "labelKey": "jam",
        "bin": "pilihan",
        "emoji": "⏰"
      },
      {
        "id": "bola",
        "labelKey": "bola",
        "bin": "pilihan",
        "emoji": "⚽"
      },
      {
        "id": "piring",
        "labelKey": "piring",
        "bin": "pilihan",
        "emoji": "🍽️"
      },
      {
        "id": "jendela",
        "labelKey": "jendela",
        "bin": "pilihan",
        "emoji": "🪟"
      },
      {
        "id": "kado",
        "labelKey": "kado",
        "bin": "pilihan",
        "emoji": "🎁"
      },
      {
        "id": "bingkai",
        "labelKey": "bingkai",
        "bin": "pilihan",
        "emoji": "🖼️"
      },
      {
        "id": "tenda",
        "labelKey": "tenda",
        "bin": "pilihan",
        "emoji": "⛺"
      },
      {
        "id": "pizza",
        "labelKey": "pizza",
        "bin": "pilihan",
        "emoji": "🍕"
      },
      {
        "id": "gantungan",
        "labelKey": "gantungan",
        "bin": "pilihan",
        "emoji": "🪝"
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBulat",
        "choices": [
          "jam",
          "jendela",
          "tenda"
        ],
        "correct": "jam"
      },
      {
        "id": "r2",
        "promptKey": "tKotak",
        "choices": [
          "bola",
          "kado",
          "pizza"
        ],
        "correct": "kado"
      },
      {
        "id": "r3",
        "promptKey": "tSegitiga",
        "choices": [
          "piring",
          "bingkai",
          "tenda"
        ],
        "correct": "tenda"
      },
      {
        "id": "r4",
        "promptKey": "tBulat",
        "choices": [
          "pizza",
          "bola",
          "jendela"
        ],
        "correct": "bola"
      },
      {
        "id": "r5",
        "promptKey": "tKotak",
        "choices": [
          "tenda",
          "jam",
          "jendela"
        ],
        "correct": "jendela"
      },
      {
        "id": "r6",
        "promptKey": "tSegitiga",
        "choices": [
          "pizza",
          "kado",
          "piring"
        ],
        "correct": "pizza"
      }
    ]
  },
  {
    "id": "celengan-pecahan-uang",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.UANG-KENAL.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lima Celengan",
        "instruksi": "Robot punya lima celengan: masukkan tiap uang ke celengan yang gambarnya sama.",
        "koin500": "koin lima ratus",
        "koin1000": "koin seribu",
        "kertas2000": "uang dua ribu",
        "kertas5000": "uang lima ribu",
        "kertas10000": "uang sepuluh ribu"
      },
      "en": {
        "judul": "Five Piggy Banks",
        "instruksi": "Robot has five piggy banks: drop each coin or note into the one with the same picture.",
        "koin500": "500 coin",
        "koin1000": "1,000 coin",
        "kertas2000": "2,000 note",
        "kertas5000": "5,000 note",
        "kertas10000": "10,000 note"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah laci aktif: koin 500 & 1.000 dulu, kertas menyusul"
      },
      "itemCount": {
        "min": 4,
        "max": 10,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah uang per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "koin500",
        "labelKey": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin1000",
        "labelKey": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "kertas2000",
        "labelKey": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas5000",
        "labelKey": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas10000",
        "labelKey": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      }
    ],
    "items": [
      {
        "id": "koin500-a",
        "labelKey": "koin500",
        "bin": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin500-b",
        "labelKey": "koin500",
        "bin": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin500-c",
        "labelKey": "koin500",
        "bin": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin1000-a",
        "labelKey": "koin1000",
        "bin": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "koin1000-b",
        "labelKey": "koin1000",
        "bin": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "koin1000-c",
        "labelKey": "koin1000",
        "bin": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "kertas2000-a",
        "labelKey": "kertas2000",
        "bin": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas2000-b",
        "labelKey": "kertas2000",
        "bin": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas2000-c",
        "labelKey": "kertas2000",
        "bin": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas5000-a",
        "labelKey": "kertas5000",
        "bin": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas5000-b",
        "labelKey": "kertas5000",
        "bin": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas5000-c",
        "labelKey": "kertas5000",
        "bin": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas10000-a",
        "labelKey": "kertas10000",
        "bin": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      },
      {
        "id": "kertas10000-b",
        "labelKey": "kertas10000",
        "bin": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      },
      {
        "id": "kertas10000-c",
        "labelKey": "kertas10000",
        "bin": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      }
    ]
  },
  {
    "id": "kartu-titik-1-5",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.04"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kartu Titik",
        "instruksi": "Hitung bendanya, lalu taruh di kartu yang titiknya sama banyak.",
        "n1": "1",
        "n2": "2",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "apel": "apel",
        "ikan": "ikan"
      },
      "en": {
        "judul": "Dot Cards",
        "instruksi": "Count the things, then put them on the card with the same number of dots.",
        "n1": "1",
        "n2": "2",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "apel": "apples",
        "ikan": "fish"
      }
    },
    "knobs": {
      "maxCount": {
        "min": 2,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah terbesar yang muncul; kartu di atas maxCount disembunyikan (4 dan 5 titik mirip, munculkan terakhir)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah kelompok benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "k1",
        "labelKey": "n1",
        "emoji": "⚀"
      },
      {
        "id": "k2",
        "labelKey": "n2",
        "emoji": "⚁"
      },
      {
        "id": "k3",
        "labelKey": "n3",
        "emoji": "⚂"
      },
      {
        "id": "k4",
        "labelKey": "n4",
        "emoji": "⚃"
      },
      {
        "id": "k5",
        "labelKey": "n5",
        "emoji": "⚄"
      }
    ],
    "items": [
      {
        "id": "apel-1",
        "labelKey": "apel",
        "bin": "k1",
        "emoji": "🍎",
        "count": 1
      },
      {
        "id": "ikan-1",
        "labelKey": "ikan",
        "bin": "k1",
        "emoji": "🐟",
        "count": 1
      },
      {
        "id": "apel-2",
        "labelKey": "apel",
        "bin": "k2",
        "emoji": "🍎",
        "count": 2
      },
      {
        "id": "ikan-2",
        "labelKey": "ikan",
        "bin": "k2",
        "emoji": "🐟",
        "count": 2
      },
      {
        "id": "apel-3",
        "labelKey": "apel",
        "bin": "k3",
        "emoji": "🍎",
        "count": 3
      },
      {
        "id": "ikan-3",
        "labelKey": "ikan",
        "bin": "k3",
        "emoji": "🐟",
        "count": 3
      },
      {
        "id": "apel-4",
        "labelKey": "apel",
        "bin": "k4",
        "emoji": "🍎",
        "count": 4
      },
      {
        "id": "ikan-4",
        "labelKey": "ikan",
        "bin": "k4",
        "emoji": "🐟",
        "count": 4
      },
      {
        "id": "apel-5",
        "labelKey": "apel",
        "bin": "k5",
        "emoji": "🍎",
        "count": 5
      },
      {
        "id": "ikan-5",
        "labelKey": "ikan",
        "bin": "k5",
        "emoji": "🐟",
        "count": 5
      }
    ]
  },
  {
    "id": "kebun-buah-besar-kecil",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BANDING.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Buah Besar Kecil",
        "instruksi": "Di kebun ada dua buah yang sama: sentuh yang lebih besar atau lebih kecil sesuai permintaan.",
        "pilihan": "pilihan",
        "semangka": "semangka",
        "labu": "labu",
        "mangga": "mangga",
        "daun": "daun",
        "jamur": "jamur",
        "tBesar": "Mana yang lebih besar?",
        "tKecil": "Mana yang lebih kecil?"
      },
      "en": {
        "judul": "Big and Small Fruit",
        "instruksi": "Two of the same fruit grow in the garden: touch the bigger or smaller one as asked.",
        "pilihan": "choices",
        "semangka": "watermelon",
        "labu": "pumpkin",
        "mangga": "mango",
        "daun": "leaf",
        "jamur": "mushroom",
        "tBesar": "Which one is bigger?",
        "tKecil": "Which one is smaller?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua benda sejenis; rasio ukuran 1,5–2 (knob rasio diatur lewat scale item)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "semangka-besar",
        "labelKey": "semangka",
        "bin": "pilihan",
        "emoji": "🍉",
        "scale": 1.8
      },
      {
        "id": "semangka-kecil",
        "labelKey": "semangka",
        "bin": "pilihan",
        "emoji": "🍉",
        "scale": 1
      },
      {
        "id": "labu-besar",
        "labelKey": "labu",
        "bin": "pilihan",
        "emoji": "🎃",
        "scale": 1.6
      },
      {
        "id": "labu-kecil",
        "labelKey": "labu",
        "bin": "pilihan",
        "emoji": "🎃",
        "scale": 1
      },
      {
        "id": "mangga-besar",
        "labelKey": "mangga",
        "bin": "pilihan",
        "emoji": "🥭",
        "scale": 1.7
      },
      {
        "id": "mangga-kecil",
        "labelKey": "mangga",
        "bin": "pilihan",
        "emoji": "🥭",
        "scale": 1
      },
      {
        "id": "daun-besar",
        "labelKey": "daun",
        "bin": "pilihan",
        "emoji": "🍃",
        "scale": 1.6
      },
      {
        "id": "daun-kecil",
        "labelKey": "daun",
        "bin": "pilihan",
        "emoji": "🍃",
        "scale": 1
      },
      {
        "id": "jamur-besar",
        "labelKey": "jamur",
        "bin": "pilihan",
        "emoji": "🍄",
        "scale": 1.8
      },
      {
        "id": "jamur-kecil",
        "labelKey": "jamur",
        "bin": "pilihan",
        "emoji": "🍄",
        "scale": 1
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBesar",
        "choices": [
          "semangka-kecil",
          "semangka-besar"
        ],
        "correct": "semangka-besar"
      },
      {
        "id": "r2",
        "promptKey": "tKecil",
        "choices": [
          "labu-besar",
          "labu-kecil"
        ],
        "correct": "labu-kecil"
      },
      {
        "id": "r3",
        "promptKey": "tBesar",
        "choices": [
          "mangga-kecil",
          "mangga-besar"
        ],
        "correct": "mangga-besar"
      },
      {
        "id": "r4",
        "promptKey": "tKecil",
        "choices": [
          "daun-besar",
          "daun-kecil"
        ],
        "correct": "daun-kecil"
      },
      {
        "id": "r5",
        "promptKey": "tBesar",
        "choices": [
          "jamur-kecil",
          "jamur-besar"
        ],
        "correct": "jamur-besar"
      }
    ]
  },
  {
    "id": "kebun-bunga-warna",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.WARNA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kebun Bunga Warna",
        "instruksi": "Masukkan tiap bunga dan buah dari kebun ke keranjang yang warnanya sama.",
        "merah": "merah",
        "biru": "biru",
        "kuning": "kuning",
        "hijau": "hijau",
        "mawar": "mawar",
        "stroberi": "stroberi",
        "kupu": "kupu-kupu",
        "bluberi": "bluberi",
        "matahari": "bunga matahari",
        "lemon": "lemon",
        "kaktus": "kaktus",
        "timun": "timun"
      },
      "en": {
        "judul": "Colorful Flower Garden",
        "instruksi": "Put each flower and fruit from the garden into the basket with the same colour.",
        "merah": "red",
        "biru": "blue",
        "kuning": "yellow",
        "hijau": "green",
        "mawar": "rose",
        "stroberi": "strawberry",
        "kupu": "butterfly",
        "bluberi": "blueberry",
        "matahari": "sunflower",
        "lemon": "lemon",
        "kaktus": "cactus",
        "timun": "cucumber"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah keranjang/warna aktif; mulai 2 warna lalu naik ke 4"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "merah",
        "labelKey": "merah",
        "color": "#e53935"
      },
      {
        "id": "biru",
        "labelKey": "biru",
        "color": "#1e88e5"
      },
      {
        "id": "kuning",
        "labelKey": "kuning",
        "color": "#fdd835"
      },
      {
        "id": "hijau",
        "labelKey": "hijau",
        "color": "#43a047"
      }
    ],
    "items": [
      {
        "id": "mawar",
        "labelKey": "mawar",
        "bin": "merah",
        "emoji": "🌹",
        "color": "#e53935"
      },
      {
        "id": "stroberi",
        "labelKey": "stroberi",
        "bin": "merah",
        "emoji": "🍓",
        "color": "#e53935"
      },
      {
        "id": "kupu",
        "labelKey": "kupu",
        "bin": "biru",
        "emoji": "🦋",
        "color": "#1e88e5"
      },
      {
        "id": "bluberi",
        "labelKey": "bluberi",
        "bin": "biru",
        "emoji": "🫐",
        "color": "#1e88e5"
      },
      {
        "id": "matahari",
        "labelKey": "matahari",
        "bin": "kuning",
        "emoji": "🌻",
        "color": "#fdd835"
      },
      {
        "id": "lemon",
        "labelKey": "lemon",
        "bin": "kuning",
        "emoji": "🍋",
        "color": "#fdd835"
      },
      {
        "id": "kaktus",
        "labelKey": "kaktus",
        "bin": "hijau",
        "emoji": "🌵",
        "color": "#43a047"
      },
      {
        "id": "timun",
        "labelKey": "timun",
        "bin": "hijau",
        "emoji": "🥒",
        "color": "#43a047"
      }
    ]
  },
  {
    "id": "keranjang-jeruk-selisih-satu",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.BANDING.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Keranjang Jeruk: Mana Lebih Banyak?",
        "instruksi": "Dua keranjang jeruk hampir sama: sentuh yang jeruknya lebih banyak.",
        "pilihan": "pilihan",
        "jeruk": "jeruk",
        "tBanyak": "Keranjang mana yang jeruknya lebih banyak?"
      },
      "en": {
        "judul": "Orange Baskets: Which Has More?",
        "instruksi": "Two baskets of oranges look alike: touch the one with more oranges.",
        "pilihan": "choices",
        "jeruk": "oranges",
        "tBanyak": "Which basket has more oranges?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua kelompok; selisih 1 sehingga harus dihitung atau dipasangkan; kelompok lebih sedikit sengaja digambar lebih besar"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "jeruk-4",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 4
      },
      {
        "id": "jeruk-4-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 4,
        "scale": 1.4
      },
      {
        "id": "jeruk-5",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 5
      },
      {
        "id": "jeruk-5-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 5,
        "scale": 1.4
      },
      {
        "id": "jeruk-6",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 6
      },
      {
        "id": "jeruk-6-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 6,
        "scale": 1.4
      },
      {
        "id": "jeruk-7",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 7
      },
      {
        "id": "jeruk-7-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 7,
        "scale": 1.4
      },
      {
        "id": "jeruk-8",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 8
      },
      {
        "id": "jeruk-8-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 8,
        "scale": 1.4
      },
      {
        "id": "jeruk-9",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 9
      },
      {
        "id": "jeruk-9-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 9,
        "scale": 1.4
      },
      {
        "id": "jeruk-10",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 10
      },
      {
        "id": "jeruk-10-besar",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 10,
        "scale": 1.4
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBanyak",
        "choices": [
          "jeruk-4-besar",
          "jeruk-5"
        ],
        "correct": "jeruk-5"
      },
      {
        "id": "r2",
        "promptKey": "tBanyak",
        "choices": [
          "jeruk-6",
          "jeruk-5-besar"
        ],
        "correct": "jeruk-6"
      },
      {
        "id": "r3",
        "promptKey": "tBanyak",
        "choices": [
          "jeruk-6-besar",
          "jeruk-7"
        ],
        "correct": "jeruk-7"
      },
      {
        "id": "r4",
        "promptKey": "tBanyak",
        "choices": [
          "jeruk-8",
          "jeruk-7-besar"
        ],
        "correct": "jeruk-8"
      },
      {
        "id": "r5",
        "promptKey": "tBanyak",
        "choices": [
          "jeruk-8-besar",
          "jeruk-9"
        ],
        "correct": "jeruk-9"
      },
      {
        "id": "r6",
        "promptKey": "tBanyak",
        "choices": [
          "jeruk-10",
          "jeruk-9-besar"
        ],
        "correct": "jeruk-10"
      }
    ]
  },
  {
    "id": "kolam-ikan-lebih-banyak",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BANDING.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kolam Ikan: Mana Lebih Banyak?",
        "instruksi": "Kucing robot lapar: sentuh kolam yang ikannya lebih banyak.",
        "pilihan": "pilihan",
        "ikan": "ikan",
        "tBanyak": "Mana kolam yang ikannya lebih banyak?"
      },
      "en": {
        "judul": "Fish Pond: Which Has More?",
        "instruksi": "The robot's cat is hungry: touch the pond with more fish.",
        "pilihan": "choices",
        "ikan": "fish",
        "tBanyak": "Which pond has more fish?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua kelompok; selisih tetap ≥ 2 (knob mengatur susunan rapi → tersebar di presenter)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kolam",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "ikan-1",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "count": 1
      },
      {
        "id": "ikan-2",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "count": 2
      },
      {
        "id": "ikan-3",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "count": 3
      },
      {
        "id": "ikan-4",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "count": 4
      },
      {
        "id": "ikan-5",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "count": 5
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBanyak",
        "choices": [
          "ikan-1",
          "ikan-3"
        ],
        "correct": "ikan-3"
      },
      {
        "id": "r2",
        "promptKey": "tBanyak",
        "choices": [
          "ikan-4",
          "ikan-2"
        ],
        "correct": "ikan-4"
      },
      {
        "id": "r3",
        "promptKey": "tBanyak",
        "choices": [
          "ikan-3",
          "ikan-5"
        ],
        "correct": "ikan-5"
      },
      {
        "id": "r4",
        "promptKey": "tBanyak",
        "choices": [
          "ikan-4",
          "ikan-1"
        ],
        "correct": "ikan-4"
      },
      {
        "id": "r5",
        "promptKey": "tBanyak",
        "choices": [
          "ikan-2",
          "ikan-5"
        ],
        "correct": "ikan-5"
      }
    ]
  },
  {
    "id": "kotak-mainan-warna",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.WARNA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kotak Mainan Warna",
        "instruksi": "Bantu robot merapikan: masukkan tiap mainan ke kotak yang warnanya sama.",
        "merah": "merah",
        "biru": "biru",
        "kuning": "kuning",
        "hijau": "hijau",
        "mobil": "mobil",
        "balon": "balon",
        "jip": "jip",
        "topi": "topi",
        "taksi": "taksi",
        "lonceng": "lonceng",
        "puzel": "kepingan puzel",
        "kura": "kura-kura"
      },
      "en": {
        "judul": "Color Toy Boxes",
        "instruksi": "Help robot tidy up: put each toy into the box with the same colour.",
        "merah": "red",
        "biru": "blue",
        "kuning": "yellow",
        "hijau": "green",
        "mobil": "car",
        "balon": "balloon",
        "jip": "jeep",
        "topi": "cap",
        "taksi": "taxi",
        "lonceng": "bell",
        "puzel": "puzzle piece",
        "kura": "turtle"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah keranjang/warna aktif; mulai 2 warna lalu naik ke 4"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "merah",
        "labelKey": "merah",
        "color": "#e53935"
      },
      {
        "id": "biru",
        "labelKey": "biru",
        "color": "#1e88e5"
      },
      {
        "id": "kuning",
        "labelKey": "kuning",
        "color": "#fdd835"
      },
      {
        "id": "hijau",
        "labelKey": "hijau",
        "color": "#43a047"
      }
    ],
    "items": [
      {
        "id": "mobil",
        "labelKey": "mobil",
        "bin": "merah",
        "emoji": "🚗",
        "color": "#e53935"
      },
      {
        "id": "balon",
        "labelKey": "balon",
        "bin": "merah",
        "emoji": "🎈",
        "color": "#e53935"
      },
      {
        "id": "jip",
        "labelKey": "jip",
        "bin": "biru",
        "emoji": "🚙",
        "color": "#1e88e5"
      },
      {
        "id": "topi",
        "labelKey": "topi",
        "bin": "biru",
        "emoji": "🧢",
        "color": "#1e88e5"
      },
      {
        "id": "taksi",
        "labelKey": "taksi",
        "bin": "kuning",
        "emoji": "🚕",
        "color": "#fdd835"
      },
      {
        "id": "lonceng",
        "labelKey": "lonceng",
        "bin": "kuning",
        "emoji": "🔔",
        "color": "#fdd835"
      },
      {
        "id": "puzel",
        "labelKey": "puzel",
        "bin": "hijau",
        "emoji": "🧩",
        "color": "#43a047"
      },
      {
        "id": "kura",
        "labelKey": "kura",
        "bin": "hijau",
        "emoji": "🐢",
        "color": "#43a047"
      }
    ]
  },
  {
    "id": "kotak-pos-bentuk",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BENTUK-DASAR.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kotak Pos Bentuk",
        "instruksi": "Masukkan tiap keping ke lubang kotak pos yang bentuknya sama.",
        "lingkaran": "lingkaran",
        "segitiga": "segitiga",
        "kotak": "kotak"
      },
      "en": {
        "judul": "Shape Mailbox",
        "instruksi": "Post each piece through the hole with the same shape.",
        "lingkaran": "circle",
        "segitiga": "triangle",
        "kotak": "square"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah lubang/bentuk aktif"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah keping per putaran; warna diacak supaya anak memilah bentuk, bukan warna"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "lingkaran",
        "labelKey": "lingkaran",
        "shape": "circle",
        "color": "#9e9e9e"
      },
      {
        "id": "segitiga",
        "labelKey": "segitiga",
        "shape": "triangle",
        "color": "#9e9e9e"
      },
      {
        "id": "kotak",
        "labelKey": "kotak",
        "shape": "square",
        "color": "#9e9e9e"
      }
    ],
    "items": [
      {
        "id": "lingkaran-merah",
        "labelKey": "lingkaran",
        "bin": "lingkaran",
        "shape": "circle",
        "color": "#e53935"
      },
      {
        "id": "lingkaran-biru",
        "labelKey": "lingkaran",
        "bin": "lingkaran",
        "shape": "circle",
        "color": "#1e88e5"
      },
      {
        "id": "lingkaran-kuning",
        "labelKey": "lingkaran",
        "bin": "lingkaran",
        "shape": "circle",
        "color": "#fdd835"
      },
      {
        "id": "segitiga-merah",
        "labelKey": "segitiga",
        "bin": "segitiga",
        "shape": "triangle",
        "color": "#e53935"
      },
      {
        "id": "segitiga-biru",
        "labelKey": "segitiga",
        "bin": "segitiga",
        "shape": "triangle",
        "color": "#1e88e5"
      },
      {
        "id": "segitiga-kuning",
        "labelKey": "segitiga",
        "bin": "segitiga",
        "shape": "triangle",
        "color": "#fdd835"
      },
      {
        "id": "kotak-merah",
        "labelKey": "kotak",
        "bin": "kotak",
        "shape": "square",
        "color": "#e53935"
      },
      {
        "id": "kotak-biru",
        "labelKey": "kotak",
        "bin": "kotak",
        "shape": "square",
        "color": "#1e88e5"
      },
      {
        "id": "kotak-kuning",
        "labelKey": "kotak",
        "bin": "kotak",
        "shape": "square",
        "color": "#fdd835"
      }
    ]
  },
  {
    "id": "kue-bentuk-toko",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BENTUK-DASAR.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Nampan Kue Bentuk",
        "instruksi": "Taruh tiap kue di nampan yang bentuknya sama supaya toko rapi.",
        "lingkaran": "lingkaran",
        "segitiga": "segitiga",
        "kotak": "kotak"
      },
      "en": {
        "judul": "Shape Cake Trays",
        "instruksi": "Put each cookie on the tray with the same shape so the shop looks neat.",
        "lingkaran": "circle",
        "segitiga": "triangle",
        "kotak": "square"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah lubang/bentuk aktif"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah keping per putaran; warna diacak supaya anak memilah bentuk, bukan warna"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "toko-kue",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "lingkaran",
        "labelKey": "lingkaran",
        "shape": "circle",
        "color": "#9e9e9e"
      },
      {
        "id": "segitiga",
        "labelKey": "segitiga",
        "shape": "triangle",
        "color": "#9e9e9e"
      },
      {
        "id": "kotak",
        "labelKey": "kotak",
        "shape": "square",
        "color": "#9e9e9e"
      }
    ],
    "items": [
      {
        "id": "lingkaran-merah",
        "labelKey": "lingkaran",
        "bin": "lingkaran",
        "shape": "circle",
        "color": "#6d4c41"
      },
      {
        "id": "lingkaran-biru",
        "labelKey": "lingkaran",
        "bin": "lingkaran",
        "shape": "circle",
        "color": "#fff3e0"
      },
      {
        "id": "lingkaran-kuning",
        "labelKey": "lingkaran",
        "bin": "lingkaran",
        "shape": "circle",
        "color": "#fb8c00"
      },
      {
        "id": "segitiga-merah",
        "labelKey": "segitiga",
        "bin": "segitiga",
        "shape": "triangle",
        "color": "#6d4c41"
      },
      {
        "id": "segitiga-biru",
        "labelKey": "segitiga",
        "bin": "segitiga",
        "shape": "triangle",
        "color": "#fff3e0"
      },
      {
        "id": "segitiga-kuning",
        "labelKey": "segitiga",
        "bin": "segitiga",
        "shape": "triangle",
        "color": "#fb8c00"
      },
      {
        "id": "kotak-merah",
        "labelKey": "kotak",
        "bin": "kotak",
        "shape": "square",
        "color": "#6d4c41"
      },
      {
        "id": "kotak-biru",
        "labelKey": "kotak",
        "bin": "kotak",
        "shape": "square",
        "color": "#fff3e0"
      },
      {
        "id": "kotak-kuning",
        "labelKey": "kotak",
        "bin": "kotak",
        "shape": "square",
        "color": "#fb8c00"
      }
    ]
  },
  {
    "id": "kue-tiga-tahap",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "KODE.TKB.DEKOMPOSISI.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tiga Tahap Membuat Kue",
        "instruksi": "Robot mau membuat kue: masukkan tiap langkah kecil ke tahap besarnya.",
        "siapkan": "siapkan",
        "campur": "campur",
        "panggang": "panggang",
        "tepung": "ambil tepung",
        "telur": "ambil telur",
        "aduk": "aduk adonan",
        "tuang": "tuang susu",
        "oven": "masukkan ke oven",
        "jadi": "kue matang"
      },
      "en": {
        "judul": "Three Baking Stages",
        "instruksi": "Robot is baking a cake: put each small step into its big stage.",
        "siapkan": "get ready",
        "campur": "mix",
        "panggang": "bake",
        "tepung": "get the flour",
        "telur": "get the eggs",
        "aduk": "stir the batter",
        "tuang": "pour the milk",
        "oven": "put it in the oven",
        "jadi": "the cake is done"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah tahap aktif; 3 tahap adalah bentuk utuhnya"
      },
      "itemCount": {
        "min": 4,
        "max": 6,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah langkah kecil per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "siapkan",
        "labelKey": "siapkan",
        "emoji": "🧺"
      },
      {
        "id": "campur",
        "labelKey": "campur",
        "emoji": "🥣"
      },
      {
        "id": "panggang",
        "labelKey": "panggang",
        "emoji": "🔥"
      }
    ],
    "items": [
      {
        "id": "tepung",
        "labelKey": "tepung",
        "bin": "siapkan",
        "emoji": "🌾"
      },
      {
        "id": "telur",
        "labelKey": "telur",
        "bin": "siapkan",
        "emoji": "🥚"
      },
      {
        "id": "aduk",
        "labelKey": "aduk",
        "bin": "campur",
        "emoji": "🥄"
      },
      {
        "id": "tuang",
        "labelKey": "tuang",
        "bin": "campur",
        "emoji": "🥛"
      },
      {
        "id": "oven",
        "labelKey": "oven",
        "bin": "panggang",
        "emoji": "♨️"
      },
      {
        "id": "jadi",
        "labelKey": "jadi",
        "bin": "panggang",
        "emoji": "🎂"
      }
    ]
  },
  {
    "id": "laci-uang-warung",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.UANG-KENAL.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Laci Uang Warung",
        "instruksi": "Masukkan tiap uang ke laci warung yang gambarnya sama.",
        "koin500": "koin lima ratus",
        "koin1000": "koin seribu",
        "kertas2000": "uang dua ribu",
        "kertas5000": "uang lima ribu",
        "kertas10000": "uang sepuluh ribu"
      },
      "en": {
        "judul": "Shop Cash Drawer",
        "instruksi": "Put each coin or note into the shop drawer with the same picture.",
        "koin500": "500 coin",
        "koin1000": "1,000 coin",
        "kertas2000": "2,000 note",
        "kertas5000": "5,000 note",
        "kertas10000": "10,000 note"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah laci aktif: koin 500 & 1.000 dulu, kertas menyusul"
      },
      "itemCount": {
        "min": 4,
        "max": 10,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah uang per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "koin500",
        "labelKey": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin1000",
        "labelKey": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "kertas2000",
        "labelKey": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas5000",
        "labelKey": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas10000",
        "labelKey": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      }
    ],
    "items": [
      {
        "id": "koin500-a",
        "labelKey": "koin500",
        "bin": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin500-b",
        "labelKey": "koin500",
        "bin": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin500-c",
        "labelKey": "koin500",
        "bin": "koin500",
        "emoji": "🪙",
        "color": "#b0bec5"
      },
      {
        "id": "koin1000-a",
        "labelKey": "koin1000",
        "bin": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "koin1000-b",
        "labelKey": "koin1000",
        "bin": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "koin1000-c",
        "labelKey": "koin1000",
        "bin": "koin1000",
        "emoji": "🪙",
        "color": "#ffd54f"
      },
      {
        "id": "kertas2000-a",
        "labelKey": "kertas2000",
        "bin": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas2000-b",
        "labelKey": "kertas2000",
        "bin": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas2000-c",
        "labelKey": "kertas2000",
        "bin": "kertas2000",
        "emoji": "💵",
        "color": "#9e9e9e"
      },
      {
        "id": "kertas5000-a",
        "labelKey": "kertas5000",
        "bin": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas5000-b",
        "labelKey": "kertas5000",
        "bin": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas5000-c",
        "labelKey": "kertas5000",
        "bin": "kertas5000",
        "emoji": "💵",
        "color": "#6d4c41"
      },
      {
        "id": "kertas10000-a",
        "labelKey": "kertas10000",
        "bin": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      },
      {
        "id": "kertas10000-b",
        "labelKey": "kertas10000",
        "bin": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      },
      {
        "id": "kertas10000-c",
        "labelKey": "kertas10000",
        "bin": "kertas10000",
        "emoji": "💵",
        "color": "#8e24aa"
      }
    ]
  },
  {
    "id": "mana-bola-warna",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.WARNA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bola Warna Apa?",
        "instruksi": "Dengarkan warna yang disebut, lalu sentuh bola yang warnanya itu.",
        "pilihan": "pilihan",
        "tMerah": "Mana yang merah?",
        "tBiru": "Mana yang biru?",
        "tKuning": "Mana yang kuning?",
        "tHijau": "Mana yang hijau?",
        "bola": "bola"
      },
      "en": {
        "judul": "Which Color Ball?",
        "instruksi": "Listen to the colour, then touch the ball of that colour.",
        "pilihan": "choices",
        "tMerah": "Which one is red?",
        "tBiru": "Which one is blue?",
        "tKuning": "Which one is yellow?",
        "tHijau": "Which one is green?",
        "bola": "ball"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 4,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah bola yang ditampilkan per pertanyaan; 4 benda sejenis beda warna"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "bola-merah",
        "labelKey": "bola",
        "bin": "pilihan",
        "shape": "circle",
        "color": "#e53935"
      },
      {
        "id": "bola-biru",
        "labelKey": "bola",
        "bin": "pilihan",
        "shape": "circle",
        "color": "#1e88e5"
      },
      {
        "id": "bola-kuning",
        "labelKey": "bola",
        "bin": "pilihan",
        "shape": "circle",
        "color": "#fdd835"
      },
      {
        "id": "bola-hijau",
        "labelKey": "bola",
        "bin": "pilihan",
        "shape": "circle",
        "color": "#43a047"
      }
    ],
    "pilihan": [
      {
        "id": "merah",
        "promptKey": "tMerah",
        "choices": [
          "bola-merah",
          "bola-biru",
          "bola-kuning",
          "bola-hijau"
        ],
        "correct": "bola-merah"
      },
      {
        "id": "biru",
        "promptKey": "tBiru",
        "choices": [
          "bola-merah",
          "bola-biru",
          "bola-kuning",
          "bola-hijau"
        ],
        "correct": "bola-biru"
      },
      {
        "id": "kuning",
        "promptKey": "tKuning",
        "choices": [
          "bola-merah",
          "bola-biru",
          "bola-kuning",
          "bola-hijau"
        ],
        "correct": "bola-kuning"
      },
      {
        "id": "hijau",
        "promptKey": "tHijau",
        "choices": [
          "bola-merah",
          "bola-biru",
          "bola-kuning",
          "bola-hijau"
        ],
        "correct": "bola-hijau"
      }
    ]
  },
  {
    "id": "mana-topi-warna",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.WARNA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Topi Pesta Robot",
        "instruksi": "Robot mau pakai topi pesta: sentuh topi yang warnanya disebut.",
        "pilihan": "pilihan",
        "tMerah": "Mana yang merah?",
        "tBiru": "Mana yang biru?",
        "tKuning": "Mana yang kuning?",
        "tHijau": "Mana yang hijau?",
        "topi": "topi pesta"
      },
      "en": {
        "judul": "Robot's Party Hat",
        "instruksi": "Robot wants a party hat: touch the hat of the colour you hear.",
        "pilihan": "choices",
        "tMerah": "Which one is red?",
        "tBiru": "Which one is blue?",
        "tKuning": "Which one is yellow?",
        "tHijau": "Which one is green?",
        "topi": "party hat"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 4,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah topi yang ditampilkan per pertanyaan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pesta",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "topi-merah",
        "labelKey": "topi",
        "bin": "pilihan",
        "shape": "triangle",
        "color": "#e53935"
      },
      {
        "id": "topi-biru",
        "labelKey": "topi",
        "bin": "pilihan",
        "shape": "triangle",
        "color": "#1e88e5"
      },
      {
        "id": "topi-kuning",
        "labelKey": "topi",
        "bin": "pilihan",
        "shape": "triangle",
        "color": "#fdd835"
      },
      {
        "id": "topi-hijau",
        "labelKey": "topi",
        "bin": "pilihan",
        "shape": "triangle",
        "color": "#43a047"
      }
    ],
    "pilihan": [
      {
        "id": "merah",
        "promptKey": "tMerah",
        "choices": [
          "topi-merah",
          "topi-biru",
          "topi-kuning",
          "topi-hijau"
        ],
        "correct": "topi-merah"
      },
      {
        "id": "biru",
        "promptKey": "tBiru",
        "choices": [
          "topi-merah",
          "topi-biru",
          "topi-kuning",
          "topi-hijau"
        ],
        "correct": "topi-biru"
      },
      {
        "id": "kuning",
        "promptKey": "tKuning",
        "choices": [
          "topi-merah",
          "topi-biru",
          "topi-kuning",
          "topi-hijau"
        ],
        "correct": "topi-kuning"
      },
      {
        "id": "hijau",
        "promptKey": "tHijau",
        "choices": [
          "topi-merah",
          "topi-biru",
          "topi-kuning",
          "topi-hijau"
        ],
        "correct": "topi-hijau"
      }
    ]
  },
  {
    "id": "pensil-panjang-pendek",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BANDING.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Panjang Pendek di Meja",
        "instruksi": "Di meja robot ada dua benda sejenis: sentuh yang lebih panjang atau lebih pendek.",
        "pilihan": "pilihan",
        "pensil": "pensil",
        "kereta": "kereta",
        "penggaris": "penggaris",
        "sendok": "sendok",
        "pita": "pita",
        "tPanjang": "Mana yang lebih panjang?",
        "tPendek": "Mana yang lebih pendek?"
      },
      "en": {
        "judul": "Long and Short on the Desk",
        "instruksi": "On the robot's desk are two of the same thing: touch the longer or the shorter one.",
        "pilihan": "choices",
        "pensil": "pencil",
        "kereta": "train",
        "penggaris": "ruler",
        "sendok": "spoon",
        "pita": "ribbon",
        "tPanjang": "Which one is longer?",
        "tPendek": "Which one is shorter?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua benda sejenis sejajar di garis dasar yang sama; rasio panjang ≥ 1,5 lewat width"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "pensil-panjang",
        "labelKey": "pensil",
        "bin": "pilihan",
        "emoji": "✏️",
        "width": 1.8
      },
      {
        "id": "pensil-pendek",
        "labelKey": "pensil",
        "bin": "pilihan",
        "emoji": "✏️",
        "width": 1
      },
      {
        "id": "kereta-panjang",
        "labelKey": "kereta",
        "bin": "pilihan",
        "emoji": "🚃",
        "width": 2
      },
      {
        "id": "kereta-pendek",
        "labelKey": "kereta",
        "bin": "pilihan",
        "emoji": "🚃",
        "width": 1
      },
      {
        "id": "penggaris-panjang",
        "labelKey": "penggaris",
        "bin": "pilihan",
        "emoji": "📏",
        "width": 1.6
      },
      {
        "id": "penggaris-pendek",
        "labelKey": "penggaris",
        "bin": "pilihan",
        "emoji": "📏",
        "width": 1
      },
      {
        "id": "sendok-panjang",
        "labelKey": "sendok",
        "bin": "pilihan",
        "emoji": "🥄",
        "width": 1.7
      },
      {
        "id": "sendok-pendek",
        "labelKey": "sendok",
        "bin": "pilihan",
        "emoji": "🥄",
        "width": 1
      },
      {
        "id": "pita-panjang",
        "labelKey": "pita",
        "bin": "pilihan",
        "emoji": "🎀",
        "width": 1.8
      },
      {
        "id": "pita-pendek",
        "labelKey": "pita",
        "bin": "pilihan",
        "emoji": "🎀",
        "width": 1
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tPanjang",
        "choices": [
          "pensil-pendek",
          "pensil-panjang"
        ],
        "correct": "pensil-panjang"
      },
      {
        "id": "r2",
        "promptKey": "tPendek",
        "choices": [
          "kereta-panjang",
          "kereta-pendek"
        ],
        "correct": "kereta-pendek"
      },
      {
        "id": "r3",
        "promptKey": "tPanjang",
        "choices": [
          "penggaris-pendek",
          "penggaris-panjang"
        ],
        "correct": "penggaris-panjang"
      },
      {
        "id": "r4",
        "promptKey": "tPendek",
        "choices": [
          "sendok-panjang",
          "sendok-pendek"
        ],
        "correct": "sendok-pendek"
      },
      {
        "id": "r5",
        "promptKey": "tPanjang",
        "choices": [
          "pita-pendek",
          "pita-panjang"
        ],
        "correct": "pita-panjang"
      }
    ]
  },
  {
    "id": "piktogram-buah-keranjang",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKB.DATA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Piktogram Buah",
        "instruksi": "Keranjangnya campur: tumpuk tiap buah di kolomnya sendiri, mulai dari bawah.",
        "apel": "apel",
        "pisang": "pisang",
        "jeruk": "jeruk",
        "anggur": "anggur"
      },
      "en": {
        "judul": "Fruit Pictogram",
        "instruksi": "The basket is mixed: stack each fruit in its own column, starting from the bottom.",
        "apel": "apples",
        "pisang": "bananas",
        "jeruk": "oranges",
        "anggur": "grapes"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah kolom/jenis aktif"
      },
      "itemCount": {
        "min": 6,
        "max": 15,
        "default": 6,
        "step": 3,
        "keterangan": "jumlah benda yang ditumpuk per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "apel",
        "labelKey": "apel",
        "emoji": "🍎"
      },
      {
        "id": "pisang",
        "labelKey": "pisang",
        "emoji": "🍌"
      },
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "emoji": "🍊"
      },
      {
        "id": "anggur",
        "labelKey": "anggur",
        "emoji": "🍇"
      }
    ],
    "items": [
      {
        "id": "apel-a",
        "labelKey": "apel",
        "bin": "apel",
        "emoji": "🍎"
      },
      {
        "id": "apel-b",
        "labelKey": "apel",
        "bin": "apel",
        "emoji": "🍎"
      },
      {
        "id": "apel-c",
        "labelKey": "apel",
        "bin": "apel",
        "emoji": "🍎"
      },
      {
        "id": "apel-d",
        "labelKey": "apel",
        "bin": "apel",
        "emoji": "🍎"
      },
      {
        "id": "pisang-a",
        "labelKey": "pisang",
        "bin": "pisang",
        "emoji": "🍌"
      },
      {
        "id": "pisang-b",
        "labelKey": "pisang",
        "bin": "pisang",
        "emoji": "🍌"
      },
      {
        "id": "pisang-c",
        "labelKey": "pisang",
        "bin": "pisang",
        "emoji": "🍌"
      },
      {
        "id": "pisang-d",
        "labelKey": "pisang",
        "bin": "pisang",
        "emoji": "🍌"
      },
      {
        "id": "jeruk-a",
        "labelKey": "jeruk",
        "bin": "jeruk",
        "emoji": "🍊"
      },
      {
        "id": "jeruk-b",
        "labelKey": "jeruk",
        "bin": "jeruk",
        "emoji": "🍊"
      },
      {
        "id": "jeruk-c",
        "labelKey": "jeruk",
        "bin": "jeruk",
        "emoji": "🍊"
      },
      {
        "id": "jeruk-d",
        "labelKey": "jeruk",
        "bin": "jeruk",
        "emoji": "🍊"
      },
      {
        "id": "anggur-a",
        "labelKey": "anggur",
        "bin": "anggur",
        "emoji": "🍇"
      },
      {
        "id": "anggur-b",
        "labelKey": "anggur",
        "bin": "anggur",
        "emoji": "🍇"
      },
      {
        "id": "anggur-c",
        "labelKey": "anggur",
        "bin": "anggur",
        "emoji": "🍇"
      },
      {
        "id": "anggur-d",
        "labelKey": "anggur",
        "bin": "anggur",
        "emoji": "🍇"
      }
    ]
  },
  {
    "id": "piktogram-sayur-kebun",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKB.DATA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Piktogram Panen Sayur",
        "instruksi": "Panen robot campur: tumpuk tiap sayur di kolomnya sendiri, mulai dari bawah.",
        "wortel": "wortel",
        "brokoli": "brokoli",
        "jagung": "jagung",
        "tomat": "tomat"
      },
      "en": {
        "judul": "Vegetable Harvest Pictogram",
        "instruksi": "The robot's harvest is mixed: stack each vegetable in its own column, starting from the bottom.",
        "wortel": "carrots",
        "brokoli": "broccoli",
        "jagung": "corn",
        "tomat": "tomatoes"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah kolom/jenis aktif"
      },
      "itemCount": {
        "min": 6,
        "max": 15,
        "default": 6,
        "step": 3,
        "keterangan": "jumlah benda yang ditumpuk per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "wortel",
        "labelKey": "wortel",
        "emoji": "🥕"
      },
      {
        "id": "brokoli",
        "labelKey": "brokoli",
        "emoji": "🥦"
      },
      {
        "id": "jagung",
        "labelKey": "jagung",
        "emoji": "🌽"
      },
      {
        "id": "tomat",
        "labelKey": "tomat",
        "emoji": "🍅"
      }
    ],
    "items": [
      {
        "id": "wortel-a",
        "labelKey": "wortel",
        "bin": "wortel",
        "emoji": "🥕"
      },
      {
        "id": "wortel-b",
        "labelKey": "wortel",
        "bin": "wortel",
        "emoji": "🥕"
      },
      {
        "id": "wortel-c",
        "labelKey": "wortel",
        "bin": "wortel",
        "emoji": "🥕"
      },
      {
        "id": "wortel-d",
        "labelKey": "wortel",
        "bin": "wortel",
        "emoji": "🥕"
      },
      {
        "id": "brokoli-a",
        "labelKey": "brokoli",
        "bin": "brokoli",
        "emoji": "🥦"
      },
      {
        "id": "brokoli-b",
        "labelKey": "brokoli",
        "bin": "brokoli",
        "emoji": "🥦"
      },
      {
        "id": "brokoli-c",
        "labelKey": "brokoli",
        "bin": "brokoli",
        "emoji": "🥦"
      },
      {
        "id": "brokoli-d",
        "labelKey": "brokoli",
        "bin": "brokoli",
        "emoji": "🥦"
      },
      {
        "id": "jagung-a",
        "labelKey": "jagung",
        "bin": "jagung",
        "emoji": "🌽"
      },
      {
        "id": "jagung-b",
        "labelKey": "jagung",
        "bin": "jagung",
        "emoji": "🌽"
      },
      {
        "id": "jagung-c",
        "labelKey": "jagung",
        "bin": "jagung",
        "emoji": "🌽"
      },
      {
        "id": "jagung-d",
        "labelKey": "jagung",
        "bin": "jagung",
        "emoji": "🌽"
      },
      {
        "id": "tomat-a",
        "labelKey": "tomat",
        "bin": "tomat",
        "emoji": "🍅"
      },
      {
        "id": "tomat-b",
        "labelKey": "tomat",
        "bin": "tomat",
        "emoji": "🍅"
      },
      {
        "id": "tomat-c",
        "labelKey": "tomat",
        "bin": "tomat",
        "emoji": "🍅"
      },
      {
        "id": "tomat-d",
        "labelKey": "tomat",
        "bin": "tomat",
        "emoji": "🍅"
      }
    ]
  },
  {
    "id": "piring-kue-lebih-banyak",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BANDING.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Piring Kue: Mana Lebih Banyak?",
        "instruksi": "Robot lapar sekali: sentuh piring yang kuenya lebih banyak.",
        "pilihan": "pilihan",
        "kue": "kue",
        "tBanyak": "Mana piring yang kuenya lebih banyak?"
      },
      "en": {
        "judul": "Cake Plates: Which Has More?",
        "instruksi": "Robot is very hungry: touch the plate with more cookies.",
        "pilihan": "choices",
        "kue": "cookies",
        "tBanyak": "Which plate has more cookies?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua kelompok; selisih tetap ≥ 2 (knob mengatur susunan rapi → tersebar di presenter)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "kue-1",
        "labelKey": "kue",
        "bin": "pilihan",
        "emoji": "🍪",
        "count": 1
      },
      {
        "id": "kue-2",
        "labelKey": "kue",
        "bin": "pilihan",
        "emoji": "🍪",
        "count": 2
      },
      {
        "id": "kue-3",
        "labelKey": "kue",
        "bin": "pilihan",
        "emoji": "🍪",
        "count": 3
      },
      {
        "id": "kue-4",
        "labelKey": "kue",
        "bin": "pilihan",
        "emoji": "🍪",
        "count": 4
      },
      {
        "id": "kue-5",
        "labelKey": "kue",
        "bin": "pilihan",
        "emoji": "🍪",
        "count": 5
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBanyak",
        "choices": [
          "kue-1",
          "kue-3"
        ],
        "correct": "kue-3"
      },
      {
        "id": "r2",
        "promptKey": "tBanyak",
        "choices": [
          "kue-4",
          "kue-2"
        ],
        "correct": "kue-4"
      },
      {
        "id": "r3",
        "promptKey": "tBanyak",
        "choices": [
          "kue-3",
          "kue-5"
        ],
        "correct": "kue-5"
      },
      {
        "id": "r4",
        "promptKey": "tBanyak",
        "choices": [
          "kue-4",
          "kue-1"
        ],
        "correct": "kue-4"
      },
      {
        "id": "r5",
        "promptKey": "tBanyak",
        "choices": [
          "kue-2",
          "kue-5"
        ],
        "correct": "kue-5"
      }
    ]
  },
  {
    "id": "rak-angka-1-10-buah",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Angka Buah",
        "instruksi": "Hitung buahnya, lalu taruh di rak yang angkanya pas.",
        "n1": "1",
        "n2": "2",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "n6": "6",
        "n7": "7",
        "n8": "8",
        "n9": "9",
        "n10": "10",
        "jeruk": "jeruk",
        "anggur": "anggur"
      },
      "en": {
        "judul": "Fruit Number Shelf",
        "instruksi": "Count the fruit, then put them on the shelf with the matching number.",
        "n1": "1",
        "n2": "2",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "n6": "6",
        "n7": "7",
        "n8": "8",
        "n9": "9",
        "n10": "10",
        "jeruk": "oranges",
        "anggur": "grapes"
      }
    },
    "knobs": {
      "maxCount": {
        "min": 5,
        "max": 10,
        "default": 5,
        "step": 1,
        "keterangan": "angka terbesar yang aktif; rak di atas maxCount disembunyikan (6 dan 9 rawan tertukar)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 5,
        "step": 1,
        "keterangan": "jumlah kelompok benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "r1",
        "labelKey": "n1"
      },
      {
        "id": "r2",
        "labelKey": "n2"
      },
      {
        "id": "r3",
        "labelKey": "n3"
      },
      {
        "id": "r4",
        "labelKey": "n4"
      },
      {
        "id": "r5",
        "labelKey": "n5"
      },
      {
        "id": "r6",
        "labelKey": "n6"
      },
      {
        "id": "r7",
        "labelKey": "n7"
      },
      {
        "id": "r8",
        "labelKey": "n8"
      },
      {
        "id": "r9",
        "labelKey": "n9"
      },
      {
        "id": "r10",
        "labelKey": "n10"
      }
    ],
    "items": [
      {
        "id": "jeruk-1",
        "labelKey": "jeruk",
        "bin": "r1",
        "emoji": "🍊",
        "count": 1
      },
      {
        "id": "anggur-1",
        "labelKey": "anggur",
        "bin": "r1",
        "emoji": "🍇",
        "count": 1
      },
      {
        "id": "jeruk-2",
        "labelKey": "jeruk",
        "bin": "r2",
        "emoji": "🍊",
        "count": 2
      },
      {
        "id": "anggur-2",
        "labelKey": "anggur",
        "bin": "r2",
        "emoji": "🍇",
        "count": 2
      },
      {
        "id": "jeruk-3",
        "labelKey": "jeruk",
        "bin": "r3",
        "emoji": "🍊",
        "count": 3
      },
      {
        "id": "anggur-3",
        "labelKey": "anggur",
        "bin": "r3",
        "emoji": "🍇",
        "count": 3
      },
      {
        "id": "jeruk-4",
        "labelKey": "jeruk",
        "bin": "r4",
        "emoji": "🍊",
        "count": 4
      },
      {
        "id": "anggur-4",
        "labelKey": "anggur",
        "bin": "r4",
        "emoji": "🍇",
        "count": 4
      },
      {
        "id": "jeruk-5",
        "labelKey": "jeruk",
        "bin": "r5",
        "emoji": "🍊",
        "count": 5
      },
      {
        "id": "anggur-5",
        "labelKey": "anggur",
        "bin": "r5",
        "emoji": "🍇",
        "count": 5
      },
      {
        "id": "jeruk-6",
        "labelKey": "jeruk",
        "bin": "r6",
        "emoji": "🍊",
        "count": 6
      },
      {
        "id": "anggur-6",
        "labelKey": "anggur",
        "bin": "r6",
        "emoji": "🍇",
        "count": 6
      },
      {
        "id": "jeruk-7",
        "labelKey": "jeruk",
        "bin": "r7",
        "emoji": "🍊",
        "count": 7
      },
      {
        "id": "anggur-7",
        "labelKey": "anggur",
        "bin": "r7",
        "emoji": "🍇",
        "count": 7
      },
      {
        "id": "jeruk-8",
        "labelKey": "jeruk",
        "bin": "r8",
        "emoji": "🍊",
        "count": 8
      },
      {
        "id": "anggur-8",
        "labelKey": "anggur",
        "bin": "r8",
        "emoji": "🍇",
        "count": 8
      },
      {
        "id": "jeruk-9",
        "labelKey": "jeruk",
        "bin": "r9",
        "emoji": "🍊",
        "count": 9
      },
      {
        "id": "anggur-9",
        "labelKey": "anggur",
        "bin": "r9",
        "emoji": "🍇",
        "count": 9
      },
      {
        "id": "jeruk-10",
        "labelKey": "jeruk",
        "bin": "r10",
        "emoji": "🍊",
        "count": 10
      },
      {
        "id": "anggur-10",
        "labelKey": "anggur",
        "bin": "r10",
        "emoji": "🍇",
        "count": 10
      }
    ]
  },
  {
    "id": "rak-angka-1-10-hewan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Angka Kandang",
        "instruksi": "Hitung hewan di kandang, lalu taruh di rak yang angkanya pas.",
        "n1": "1",
        "n2": "2",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "n6": "6",
        "n7": "7",
        "n8": "8",
        "n9": "9",
        "n10": "10",
        "bebek": "bebek",
        "kelinci": "kelinci"
      },
      "en": {
        "judul": "Barn Number Shelf",
        "instruksi": "Count the animals in the pen, then put them on the shelf with the matching number.",
        "n1": "1",
        "n2": "2",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "n6": "6",
        "n7": "7",
        "n8": "8",
        "n9": "9",
        "n10": "10",
        "bebek": "ducks",
        "kelinci": "rabbits"
      }
    },
    "knobs": {
      "maxCount": {
        "min": 5,
        "max": 10,
        "default": 5,
        "step": 1,
        "keterangan": "angka terbesar yang aktif; rak di atas maxCount disembunyikan (6 dan 9 rawan tertukar)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 5,
        "step": 1,
        "keterangan": "jumlah kelompok benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "r1",
        "labelKey": "n1"
      },
      {
        "id": "r2",
        "labelKey": "n2"
      },
      {
        "id": "r3",
        "labelKey": "n3"
      },
      {
        "id": "r4",
        "labelKey": "n4"
      },
      {
        "id": "r5",
        "labelKey": "n5"
      },
      {
        "id": "r6",
        "labelKey": "n6"
      },
      {
        "id": "r7",
        "labelKey": "n7"
      },
      {
        "id": "r8",
        "labelKey": "n8"
      },
      {
        "id": "r9",
        "labelKey": "n9"
      },
      {
        "id": "r10",
        "labelKey": "n10"
      }
    ],
    "items": [
      {
        "id": "bebek-1",
        "labelKey": "bebek",
        "bin": "r1",
        "emoji": "🦆",
        "count": 1
      },
      {
        "id": "kelinci-1",
        "labelKey": "kelinci",
        "bin": "r1",
        "emoji": "🐰",
        "count": 1
      },
      {
        "id": "bebek-2",
        "labelKey": "bebek",
        "bin": "r2",
        "emoji": "🦆",
        "count": 2
      },
      {
        "id": "kelinci-2",
        "labelKey": "kelinci",
        "bin": "r2",
        "emoji": "🐰",
        "count": 2
      },
      {
        "id": "bebek-3",
        "labelKey": "bebek",
        "bin": "r3",
        "emoji": "🦆",
        "count": 3
      },
      {
        "id": "kelinci-3",
        "labelKey": "kelinci",
        "bin": "r3",
        "emoji": "🐰",
        "count": 3
      },
      {
        "id": "bebek-4",
        "labelKey": "bebek",
        "bin": "r4",
        "emoji": "🦆",
        "count": 4
      },
      {
        "id": "kelinci-4",
        "labelKey": "kelinci",
        "bin": "r4",
        "emoji": "🐰",
        "count": 4
      },
      {
        "id": "bebek-5",
        "labelKey": "bebek",
        "bin": "r5",
        "emoji": "🦆",
        "count": 5
      },
      {
        "id": "kelinci-5",
        "labelKey": "kelinci",
        "bin": "r5",
        "emoji": "🐰",
        "count": 5
      },
      {
        "id": "bebek-6",
        "labelKey": "bebek",
        "bin": "r6",
        "emoji": "🦆",
        "count": 6
      },
      {
        "id": "kelinci-6",
        "labelKey": "kelinci",
        "bin": "r6",
        "emoji": "🐰",
        "count": 6
      },
      {
        "id": "bebek-7",
        "labelKey": "bebek",
        "bin": "r7",
        "emoji": "🦆",
        "count": 7
      },
      {
        "id": "kelinci-7",
        "labelKey": "kelinci",
        "bin": "r7",
        "emoji": "🐰",
        "count": 7
      },
      {
        "id": "bebek-8",
        "labelKey": "bebek",
        "bin": "r8",
        "emoji": "🦆",
        "count": 8
      },
      {
        "id": "kelinci-8",
        "labelKey": "kelinci",
        "bin": "r8",
        "emoji": "🐰",
        "count": 8
      },
      {
        "id": "bebek-9",
        "labelKey": "bebek",
        "bin": "r9",
        "emoji": "🦆",
        "count": 9
      },
      {
        "id": "kelinci-9",
        "labelKey": "kelinci",
        "bin": "r9",
        "emoji": "🐰",
        "count": 9
      },
      {
        "id": "bebek-10",
        "labelKey": "bebek",
        "bin": "r10",
        "emoji": "🦆",
        "count": 10
      },
      {
        "id": "kelinci-10",
        "labelKey": "kelinci",
        "bin": "r10",
        "emoji": "🐰",
        "count": 10
      }
    ]
  },
  {
    "id": "rak-angka-11-20-kelereng",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Angka Kelereng",
        "instruksi": "Hitung kelerengnya, lalu taruh di rak yang angkanya pas.",
        "n11": "11",
        "n12": "12",
        "n13": "13",
        "n14": "14",
        "n15": "15",
        "n16": "16",
        "n17": "17",
        "n18": "18",
        "n19": "19",
        "n20": "20",
        "kelereng": "kelereng",
        "kancing": "kancing"
      },
      "en": {
        "judul": "Marble Number Shelf",
        "instruksi": "Count the marbles, then put them on the shelf with the matching number.",
        "n11": "11",
        "n12": "12",
        "n13": "13",
        "n14": "14",
        "n15": "15",
        "n16": "16",
        "n17": "17",
        "n18": "18",
        "n19": "19",
        "n20": "20",
        "kelereng": "marbles",
        "kancing": "buttons"
      }
    },
    "knobs": {
      "maxCount": {
        "min": 15,
        "max": 20,
        "default": 15,
        "step": 1,
        "keterangan": "angka terbesar yang aktif: 11–15 dulu, lalu sampai 20; rak berurutan supaya posisi membantu"
      },
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah kelompok per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "r11",
        "labelKey": "n11"
      },
      {
        "id": "r12",
        "labelKey": "n12"
      },
      {
        "id": "r13",
        "labelKey": "n13"
      },
      {
        "id": "r14",
        "labelKey": "n14"
      },
      {
        "id": "r15",
        "labelKey": "n15"
      },
      {
        "id": "r16",
        "labelKey": "n16"
      },
      {
        "id": "r17",
        "labelKey": "n17"
      },
      {
        "id": "r18",
        "labelKey": "n18"
      },
      {
        "id": "r19",
        "labelKey": "n19"
      },
      {
        "id": "r20",
        "labelKey": "n20"
      }
    ],
    "items": [
      {
        "id": "kelereng-11",
        "labelKey": "kelereng",
        "bin": "r11",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 11
      },
      {
        "id": "kancing-11",
        "labelKey": "kancing",
        "bin": "r11",
        "shape": "circle",
        "color": "#e53935",
        "count": 11
      },
      {
        "id": "kelereng-12",
        "labelKey": "kelereng",
        "bin": "r12",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 12
      },
      {
        "id": "kancing-12",
        "labelKey": "kancing",
        "bin": "r12",
        "shape": "circle",
        "color": "#e53935",
        "count": 12
      },
      {
        "id": "kelereng-13",
        "labelKey": "kelereng",
        "bin": "r13",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 13
      },
      {
        "id": "kancing-13",
        "labelKey": "kancing",
        "bin": "r13",
        "shape": "circle",
        "color": "#e53935",
        "count": 13
      },
      {
        "id": "kelereng-14",
        "labelKey": "kelereng",
        "bin": "r14",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 14
      },
      {
        "id": "kancing-14",
        "labelKey": "kancing",
        "bin": "r14",
        "shape": "circle",
        "color": "#e53935",
        "count": 14
      },
      {
        "id": "kelereng-15",
        "labelKey": "kelereng",
        "bin": "r15",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 15
      },
      {
        "id": "kancing-15",
        "labelKey": "kancing",
        "bin": "r15",
        "shape": "circle",
        "color": "#e53935",
        "count": 15
      },
      {
        "id": "kelereng-16",
        "labelKey": "kelereng",
        "bin": "r16",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 16
      },
      {
        "id": "kancing-16",
        "labelKey": "kancing",
        "bin": "r16",
        "shape": "circle",
        "color": "#e53935",
        "count": 16
      },
      {
        "id": "kelereng-17",
        "labelKey": "kelereng",
        "bin": "r17",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 17
      },
      {
        "id": "kancing-17",
        "labelKey": "kancing",
        "bin": "r17",
        "shape": "circle",
        "color": "#e53935",
        "count": 17
      },
      {
        "id": "kelereng-18",
        "labelKey": "kelereng",
        "bin": "r18",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 18
      },
      {
        "id": "kancing-18",
        "labelKey": "kancing",
        "bin": "r18",
        "shape": "circle",
        "color": "#e53935",
        "count": 18
      },
      {
        "id": "kelereng-19",
        "labelKey": "kelereng",
        "bin": "r19",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 19
      },
      {
        "id": "kancing-19",
        "labelKey": "kancing",
        "bin": "r19",
        "shape": "circle",
        "color": "#e53935",
        "count": 19
      },
      {
        "id": "kelereng-20",
        "labelKey": "kelereng",
        "bin": "r20",
        "shape": "circle",
        "color": "#1e88e5",
        "count": 20
      },
      {
        "id": "kancing-20",
        "labelKey": "kancing",
        "bin": "r20",
        "shape": "circle",
        "color": "#e53935",
        "count": 20
      }
    ]
  },
  {
    "id": "rak-angka-11-20-telur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Angka Telur",
        "instruksi": "Hitung telur di keranjang, lalu taruh di rak yang angkanya pas.",
        "n11": "11",
        "n12": "12",
        "n13": "13",
        "n14": "14",
        "n15": "15",
        "n16": "16",
        "n17": "17",
        "n18": "18",
        "n19": "19",
        "n20": "20",
        "telur": "telur",
        "biji": "biji"
      },
      "en": {
        "judul": "Egg Number Shelf",
        "instruksi": "Count the eggs in the basket, then put them on the shelf with the matching number.",
        "n11": "11",
        "n12": "12",
        "n13": "13",
        "n14": "14",
        "n15": "15",
        "n16": "16",
        "n17": "17",
        "n18": "18",
        "n19": "19",
        "n20": "20",
        "telur": "eggs",
        "biji": "seeds"
      }
    },
    "knobs": {
      "maxCount": {
        "min": 15,
        "max": 20,
        "default": 15,
        "step": 1,
        "keterangan": "angka terbesar yang aktif: 11–15 dulu, lalu sampai 20; rak berurutan supaya posisi membantu"
      },
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah kelompok per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "r11",
        "labelKey": "n11"
      },
      {
        "id": "r12",
        "labelKey": "n12"
      },
      {
        "id": "r13",
        "labelKey": "n13"
      },
      {
        "id": "r14",
        "labelKey": "n14"
      },
      {
        "id": "r15",
        "labelKey": "n15"
      },
      {
        "id": "r16",
        "labelKey": "n16"
      },
      {
        "id": "r17",
        "labelKey": "n17"
      },
      {
        "id": "r18",
        "labelKey": "n18"
      },
      {
        "id": "r19",
        "labelKey": "n19"
      },
      {
        "id": "r20",
        "labelKey": "n20"
      }
    ],
    "items": [
      {
        "id": "telur-11",
        "labelKey": "telur",
        "bin": "r11",
        "emoji": "🥚",
        "count": 11
      },
      {
        "id": "biji-11",
        "labelKey": "biji",
        "bin": "r11",
        "emoji": "🌰",
        "count": 11
      },
      {
        "id": "telur-12",
        "labelKey": "telur",
        "bin": "r12",
        "emoji": "🥚",
        "count": 12
      },
      {
        "id": "biji-12",
        "labelKey": "biji",
        "bin": "r12",
        "emoji": "🌰",
        "count": 12
      },
      {
        "id": "telur-13",
        "labelKey": "telur",
        "bin": "r13",
        "emoji": "🥚",
        "count": 13
      },
      {
        "id": "biji-13",
        "labelKey": "biji",
        "bin": "r13",
        "emoji": "🌰",
        "count": 13
      },
      {
        "id": "telur-14",
        "labelKey": "telur",
        "bin": "r14",
        "emoji": "🥚",
        "count": 14
      },
      {
        "id": "biji-14",
        "labelKey": "biji",
        "bin": "r14",
        "emoji": "🌰",
        "count": 14
      },
      {
        "id": "telur-15",
        "labelKey": "telur",
        "bin": "r15",
        "emoji": "🥚",
        "count": 15
      },
      {
        "id": "biji-15",
        "labelKey": "biji",
        "bin": "r15",
        "emoji": "🌰",
        "count": 15
      },
      {
        "id": "telur-16",
        "labelKey": "telur",
        "bin": "r16",
        "emoji": "🥚",
        "count": 16
      },
      {
        "id": "biji-16",
        "labelKey": "biji",
        "bin": "r16",
        "emoji": "🌰",
        "count": 16
      },
      {
        "id": "telur-17",
        "labelKey": "telur",
        "bin": "r17",
        "emoji": "🥚",
        "count": 17
      },
      {
        "id": "biji-17",
        "labelKey": "biji",
        "bin": "r17",
        "emoji": "🌰",
        "count": 17
      },
      {
        "id": "telur-18",
        "labelKey": "telur",
        "bin": "r18",
        "emoji": "🥚",
        "count": 18
      },
      {
        "id": "biji-18",
        "labelKey": "biji",
        "bin": "r18",
        "emoji": "🌰",
        "count": 18
      },
      {
        "id": "telur-19",
        "labelKey": "telur",
        "bin": "r19",
        "emoji": "🥚",
        "count": 19
      },
      {
        "id": "biji-19",
        "labelKey": "biji",
        "bin": "r19",
        "emoji": "🌰",
        "count": 19
      },
      {
        "id": "telur-20",
        "labelKey": "telur",
        "bin": "r20",
        "emoji": "🥚",
        "count": 20
      },
      {
        "id": "biji-20",
        "labelKey": "biji",
        "bin": "r20",
        "emoji": "🌰",
        "count": 20
      }
    ]
  },
  {
    "id": "rak-bentuk-ruang-dapur",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.BENTUK-RUANG.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Bentuk Dapur",
        "instruksi": "Bantu robot menata dapur: taruh tiap benda di rak yang bentuknya sama.",
        "bola": "bola",
        "kubus": "kubus",
        "tabung": "tabung",
        "melon": "melon",
        "jeruk": "jeruk",
        "bilyar": "bola bilyar",
        "es": "es batu",
        "susu": "kotak susu",
        "kado": "kotak kado",
        "gelas": "gelas",
        "kaleng": "kaleng",
        "lilin": "lilin",
        "tisu": "gulungan tisu"
      },
      "en": {
        "judul": "Kitchen Shape Shelf",
        "instruksi": "Help robot tidy the kitchen: put each thing on the shelf with the same shape.",
        "bola": "sphere",
        "kubus": "cube",
        "tabung": "cylinder",
        "melon": "melon",
        "jeruk": "orange",
        "bilyar": "billiard ball",
        "es": "ice cube",
        "susu": "milk carton",
        "kado": "gift box",
        "gelas": "cup",
        "kaleng": "can",
        "lilin": "candle",
        "tisu": "paper roll"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah rak aktif: bola & kubus dulu, tabung menyusul"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "dapur",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "bola",
        "labelKey": "bola",
        "emoji": "⚪"
      },
      {
        "id": "kubus",
        "labelKey": "kubus",
        "emoji": "🎲"
      },
      {
        "id": "tabung",
        "labelKey": "tabung",
        "emoji": "🥫"
      }
    ],
    "items": [
      {
        "id": "melon",
        "labelKey": "melon",
        "bin": "bola",
        "emoji": "🍈"
      },
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "bin": "bola",
        "emoji": "🍊"
      },
      {
        "id": "bilyar",
        "labelKey": "bilyar",
        "bin": "bola",
        "emoji": "🎱"
      },
      {
        "id": "es",
        "labelKey": "es",
        "bin": "kubus",
        "emoji": "🧊"
      },
      {
        "id": "susu",
        "labelKey": "susu",
        "bin": "kubus",
        "emoji": "🧃"
      },
      {
        "id": "kado",
        "labelKey": "kado",
        "bin": "kubus",
        "emoji": "🎁"
      },
      {
        "id": "gelas",
        "labelKey": "gelas",
        "bin": "tabung",
        "emoji": "🥤"
      },
      {
        "id": "kaleng",
        "labelKey": "kaleng",
        "bin": "tabung",
        "emoji": "🥫"
      },
      {
        "id": "lilin",
        "labelKey": "lilin",
        "bin": "tabung",
        "emoji": "🕯️"
      },
      {
        "id": "tisu",
        "labelKey": "tisu",
        "bin": "tabung",
        "emoji": "🧻"
      }
    ]
  },
  {
    "id": "rak-bentuk-ruang-mainan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.BENTUK-RUANG.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Bentuk Mainan",
        "instruksi": "Taruh tiap mainan di rak yang bentuknya sama: bola, kubus, atau tabung.",
        "bola": "bola",
        "kubus": "kubus",
        "tabung": "tabung",
        "sepak": "bola sepak",
        "basket": "bola basket",
        "tenis": "bola tenis",
        "dadu": "dadu",
        "kado": "kotak kado",
        "kardus": "kardus",
        "kaleng": "kaleng",
        "baterai": "baterai",
        "kayu": "gelondong kayu"
      },
      "en": {
        "judul": "Toy Shape Shelf",
        "instruksi": "Put each toy on the shelf with the same shape: sphere, cube or cylinder.",
        "bola": "sphere",
        "kubus": "cube",
        "tabung": "cylinder",
        "sepak": "football",
        "basket": "basketball",
        "tenis": "tennis ball",
        "dadu": "dice",
        "kado": "gift box",
        "kardus": "cardboard box",
        "kaleng": "can",
        "baterai": "battery",
        "kayu": "log"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah rak aktif: bola & kubus dulu, tabung menyusul"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "pilihan": [],
    "bins": [
      {
        "id": "bola",
        "labelKey": "bola",
        "emoji": "⚪"
      },
      {
        "id": "kubus",
        "labelKey": "kubus",
        "emoji": "🎲"
      },
      {
        "id": "tabung",
        "labelKey": "tabung",
        "emoji": "🥫"
      }
    ],
    "items": [
      {
        "id": "sepak",
        "labelKey": "sepak",
        "bin": "bola",
        "emoji": "⚽"
      },
      {
        "id": "basket",
        "labelKey": "basket",
        "bin": "bola",
        "emoji": "🏀"
      },
      {
        "id": "tenis",
        "labelKey": "tenis",
        "bin": "bola",
        "emoji": "🎾"
      },
      {
        "id": "dadu",
        "labelKey": "dadu",
        "bin": "kubus",
        "emoji": "🎲"
      },
      {
        "id": "kado",
        "labelKey": "kado",
        "bin": "kubus",
        "emoji": "🎁"
      },
      {
        "id": "kardus",
        "labelKey": "kardus",
        "bin": "kubus",
        "emoji": "📦"
      },
      {
        "id": "kaleng",
        "labelKey": "kaleng",
        "bin": "tabung",
        "emoji": "🥫"
      },
      {
        "id": "baterai",
        "labelKey": "baterai",
        "bin": "tabung",
        "emoji": "🔋"
      },
      {
        "id": "kayu",
        "labelKey": "kayu",
        "bin": "tabung",
        "emoji": "🪵"
      }
    ]
  },
  {
    "id": "sains-anak-dan-induk",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.SIKLUS-HIDUP.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Cari Induknya",
        "instruksi": "Antar tiap anak hewan ke induknya. Hati-hati, ada yang berubah bentuk saat besar.",
        "kupu": "kupu-kupu",
        "ayam": "ayam",
        "kucing": "kucing",
        "anjing": "anjing",
        "sapi": "sapi",
        "katak": "katak",
        "i-ulat": "ulat",
        "i-anakayam": "anak ayam",
        "i-anakkucing": "anak kucing",
        "i-anakanjing": "anak anjing",
        "i-anaksapi": "anak sapi",
        "i-kecebong": "kecebong berekor"
      },
      "en": {
        "judul": "Find the Parent",
        "instruksi": "Take each baby animal to its parent. Careful, some change shape when they grow.",
        "kupu": "butterfly",
        "ayam": "hen",
        "kucing": "cat",
        "anjing": "dog",
        "sapi": "cow",
        "katak": "frog",
        "i-ulat": "caterpillar",
        "i-anakayam": "chick",
        "i-anakkucing": "kitten",
        "i-anakanjing": "puppy",
        "i-anaksapi": "calf",
        "i-kecebong": "tadpole with a tail"
      }
    },
    "knobs": {
      "binCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah pasangan induk per putaran; selalu campur pasangan mirip dan pasangan berubah bentuk"
      },
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah anak hewan yang diseret = jumlah induk aktif"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "kupu",
        "labelKey": "kupu",
        "emoji": "🦋"
      },
      {
        "id": "ayam",
        "labelKey": "ayam",
        "emoji": "🐔"
      },
      {
        "id": "kucing",
        "labelKey": "kucing",
        "emoji": "🐈"
      },
      {
        "id": "anjing",
        "labelKey": "anjing",
        "emoji": "🐕"
      },
      {
        "id": "sapi",
        "labelKey": "sapi",
        "emoji": "🐄"
      },
      {
        "id": "katak",
        "labelKey": "katak",
        "emoji": "🐸"
      }
    ],
    "items": [
      {
        "id": "ulat",
        "labelKey": "i-ulat",
        "bin": "kupu",
        "emoji": "🐛"
      },
      {
        "id": "anakayam",
        "labelKey": "i-anakayam",
        "bin": "ayam",
        "emoji": "🐥"
      },
      {
        "id": "anakkucing",
        "labelKey": "i-anakkucing",
        "bin": "kucing",
        "emoji": "🐱",
        "scale": 0.7
      },
      {
        "id": "anakanjing",
        "labelKey": "i-anakanjing",
        "bin": "anjing",
        "emoji": "🐶",
        "scale": 0.7
      },
      {
        "id": "anaksapi",
        "labelKey": "i-anaksapi",
        "bin": "sapi",
        "emoji": "🐄",
        "scale": 0.6
      },
      {
        "id": "kecebong",
        "labelKey": "i-kecebong",
        "bin": "katak",
        "emoji": "🐟",
        "scale": 0.6,
        "color": "#263238"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-antar-ke-habitat",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.HEWAN-HABITAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Antar Pulang ke Habitat",
        "instruksi": "Antar tiap hewan ke habitatnya: unta ke gurun, beruang kutub ke es, monyet ke hutan, ikan badut ke terumbu.",
        "gurun": "gurun",
        "es": "es",
        "hutan": "hutan",
        "terumbu": "terumbu karang",
        "i-unta": "unta",
        "i-kadal": "kadal gurun",
        "i-beruangkutub": "beruang kutub",
        "i-penguin": "penguin di es",
        "i-monyet": "monyet",
        "i-harimau": "harimau",
        "i-ikanbadut": "ikan badut",
        "i-penyu": "penyu"
      },
      "en": {
        "judul": "Take Them Home",
        "instruksi": "Take each animal home: camel to the desert, polar bear to the ice, monkey to the forest, clownfish to the reef.",
        "gurun": "desert",
        "es": "ice",
        "hutan": "forest",
        "terumbu": "coral reef",
        "i-unta": "camel",
        "i-kadal": "desert lizard",
        "i-beruangkutub": "polar bear",
        "i-penguin": "penguin on ice",
        "i-monyet": "monkey",
        "i-harimau": "tiger",
        "i-ikanbadut": "clownfish",
        "i-penyu": "sea turtle"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah habitat: 2 (gurun, es) → 4 (tambah hutan, terumbu)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 2,
        "keterangan": "jumlah hewan per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "laut",
    "mode": "kelompok",
    "bins": [
      {
        "id": "gurun",
        "labelKey": "gurun",
        "emoji": "🏜️",
        "color": "#ffe0b2"
      },
      {
        "id": "es",
        "labelKey": "es",
        "emoji": "🧊",
        "color": "#e1f5fe"
      },
      {
        "id": "hutan",
        "labelKey": "hutan",
        "emoji": "🌴",
        "color": "#c8e6c9"
      },
      {
        "id": "terumbu",
        "labelKey": "terumbu",
        "emoji": "🪸",
        "color": "#b3e5fc"
      }
    ],
    "items": [
      {
        "id": "unta",
        "labelKey": "i-unta",
        "bin": "gurun",
        "emoji": "🐪"
      },
      {
        "id": "kadal",
        "labelKey": "i-kadal",
        "bin": "gurun",
        "emoji": "🦎"
      },
      {
        "id": "beruangkutub",
        "labelKey": "i-beruangkutub",
        "bin": "es",
        "emoji": "🐻‍❄️"
      },
      {
        "id": "penguin",
        "labelKey": "i-penguin",
        "bin": "es",
        "emoji": "🐧",
        "color": "#e1f5fe"
      },
      {
        "id": "monyet",
        "labelKey": "i-monyet",
        "bin": "hutan",
        "emoji": "🐒"
      },
      {
        "id": "harimau",
        "labelKey": "i-harimau",
        "bin": "hutan",
        "emoji": "🐯"
      },
      {
        "id": "ikanbadut",
        "labelKey": "i-ikanbadut",
        "bin": "terumbu",
        "emoji": "🐠"
      },
      {
        "id": "penyu",
        "labelKey": "i-penyu",
        "bin": "terumbu",
        "emoji": "🐢"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-apa-yang-tanaman-perlu",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.KEBUTUHAN-TUMBUHAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Apa yang Tanaman Perlu?",
        "instruksi": "Taruh yang dibutuhkan tanaman ke pot, yang tidak perlu ke keranjang.",
        "pot": "pot tanaman (perlu)",
        "tidak": "tidak perlu",
        "i-air": "air",
        "i-cahaya": "cahaya matahari",
        "i-tanah": "tanah",
        "i-udara": "udara",
        "i-mainan": "mainan",
        "i-permen": "permen",
        "i-selimut": "selimut",
        "i-tv": "televisi",
        "i-susu": "susu"
      },
      "en": {
        "judul": "What Does a Plant Need?",
        "instruksi": "Put what the plant needs into the pot and what it doesn't need into the basket.",
        "pot": "plant pot (needed)",
        "tidak": "not needed",
        "i-air": "water",
        "i-cahaya": "sunlight",
        "i-tanah": "soil",
        "i-udara": "air",
        "i-mainan": "toy",
        "i-permen": "candy",
        "i-selimut": "blanket",
        "i-tv": "TV",
        "i-susu": "milk"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah kartu per putaran; susu sebagai pengecoh muncul di 8 kartu"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "pot",
        "labelKey": "pot",
        "emoji": "🪴",
        "color": "#c8e6c9"
      },
      {
        "id": "tidak",
        "labelKey": "tidak",
        "emoji": "🧺",
        "color": "#eeeeee"
      }
    ],
    "items": [
      {
        "id": "air",
        "labelKey": "i-air",
        "bin": "pot",
        "emoji": "💧"
      },
      {
        "id": "cahaya",
        "labelKey": "i-cahaya",
        "bin": "pot",
        "emoji": "☀️"
      },
      {
        "id": "tanah",
        "labelKey": "i-tanah",
        "bin": "pot",
        "shape": "square",
        "color": "#6d4c41"
      },
      {
        "id": "udara",
        "labelKey": "i-udara",
        "bin": "pot",
        "emoji": "🌬️"
      },
      {
        "id": "mainan",
        "labelKey": "i-mainan",
        "bin": "tidak",
        "emoji": "🧸"
      },
      {
        "id": "permen",
        "labelKey": "i-permen",
        "bin": "tidak",
        "emoji": "🍬"
      },
      {
        "id": "selimut",
        "labelKey": "i-selimut",
        "bin": "tidak",
        "emoji": "🛏️"
      },
      {
        "id": "tv",
        "labelKey": "i-tv",
        "bin": "tidak",
        "emoji": "📺"
      },
      {
        "id": "susu",
        "labelKey": "i-susu",
        "bin": "tidak",
        "emoji": "🥛"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-bekal-cuaca-piknik",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.CUACA-PAKAIAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Siap-siap Piknik",
        "instruksi": "Robot mau piknik: dengarkan cuacanya, lalu sentuh benda yang harus dipakai.",
        "pilihan": "pilihan",
        "i-payung": "payung",
        "i-kacamata": "kacamata hitam",
        "i-sarungtangan": "sarung tangan",
        "i-sepatubot": "sepatu bot",
        "i-kaus": "kaus tipis",
        "t-panas": "Langit cerah, silau sekali. Pakai apa?",
        "t-hujan": "Hujan turun, jalan becek. Pakai apa di kaki?",
        "t-dingin": "Dingin sekali, tangan kaku. Pakai apa?",
        "t-hujan2": "Gerimis mulai turun. Bawa apa?",
        "t-panas2": "Hari panas dan gerah. Pakai baju apa?"
      },
      "en": {
        "judul": "Getting Ready for the Picnic",
        "instruksi": "Robot is going on a picnic: listen to the weather, then touch what to wear.",
        "pilihan": "choices",
        "i-payung": "umbrella",
        "i-kacamata": "sunglasses",
        "i-sarungtangan": "gloves",
        "i-sepatubot": "rain boots",
        "i-kaus": "thin t-shirt",
        "t-panas": "Clear sky, very bright. What do we wear?",
        "t-hujan": "It's raining, the path is muddy. What goes on our feet?",
        "t-dingin": "So cold, our hands are stiff. What do we wear?",
        "t-hujan2": "A drizzle is starting. What do we take?",
        "t-panas2": "A hot, sticky day. Which top do we wear?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah pilihan per cuaca; sandal saat hujan sengaja jadi pengecoh"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "payung",
        "labelKey": "i-payung",
        "bin": "pilihan",
        "emoji": "☂️"
      },
      {
        "id": "kacamata",
        "labelKey": "i-kacamata",
        "bin": "pilihan",
        "emoji": "🕶️"
      },
      {
        "id": "sarungtangan",
        "labelKey": "i-sarungtangan",
        "bin": "pilihan",
        "emoji": "🧤"
      },
      {
        "id": "sepatubot",
        "labelKey": "i-sepatubot",
        "bin": "pilihan",
        "emoji": "🥾"
      },
      {
        "id": "kaus",
        "labelKey": "i-kaus",
        "bin": "pilihan",
        "emoji": "👕"
      }
    ],
    "pilihan": [
      {
        "id": "panas",
        "promptKey": "t-panas",
        "choices": [
          "kacamata",
          "sarungtangan",
          "sepatubot"
        ],
        "correct": "kacamata"
      },
      {
        "id": "hujan",
        "promptKey": "t-hujan",
        "choices": [
          "sepatubot",
          "kaus",
          "kacamata"
        ],
        "correct": "sepatubot"
      },
      {
        "id": "dingin",
        "promptKey": "t-dingin",
        "choices": [
          "sarungtangan",
          "kacamata",
          "payung"
        ],
        "correct": "sarungtangan"
      },
      {
        "id": "hujan2",
        "promptKey": "t-hujan2",
        "choices": [
          "payung",
          "kaus",
          "kacamata",
          "sarungtangan"
        ],
        "correct": "payung"
      },
      {
        "id": "panas2",
        "promptKey": "t-panas2",
        "choices": [
          "kaus",
          "sarungtangan",
          "sepatubot",
          "payung"
        ],
        "correct": "kaus"
      }
    ]
  },
  {
    "id": "sains-bekal-sehari-hari-pasar",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.MAKANAN-SEHAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Belanja Piring Sehari-hari",
        "instruksi": "Robot belanja di pasar: makanan sehari-hari ke piring, jajanan sesekali ke toples.",
        "piring": "piring sehari-hari",
        "toples": "toples sesekali",
        "kadang": "kadang-kadang",
        "i-apel": "apel",
        "i-brokoli": "brokoli",
        "i-jagung": "jagung",
        "i-ayam": "ayam panggang",
        "i-tempe": "tempe",
        "i-semangka": "semangka",
        "i-kacang": "kacang rebus",
        "i-lolipop": "lolipop",
        "i-donat": "donat",
        "i-cokelat": "cokelat",
        "i-cupcake": "kue mangkuk krim",
        "i-pancake": "panekuk",
        "i-biskuit": "biskuit"
      },
      "en": {
        "judul": "Shopping for the Everyday Plate",
        "instruksi": "Robot shops at the market: everyday food to the plate, once-in-a-while treats to the jar.",
        "piring": "everyday plate",
        "toples": "once-in-a-while jar",
        "kadang": "sometimes",
        "i-apel": "apple",
        "i-brokoli": "broccoli",
        "i-jagung": "corn",
        "i-ayam": "roast chicken",
        "i-tempe": "tempeh",
        "i-semangka": "watermelon",
        "i-kacang": "boiled peanuts",
        "i-lolipop": "lollipop",
        "i-donat": "doughnut",
        "i-cokelat": "chocolate bar",
        "i-cupcake": "cupcake",
        "i-pancake": "pancake",
        "i-biskuit": "biscuit"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah wadah: 2 → 3 (tambah 'kadang-kadang')"
      },
      "itemCount": {
        "min": 4,
        "max": 10,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah makanan per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "bins": [
      {
        "id": "piring",
        "labelKey": "piring",
        "emoji": "🍽️",
        "color": "#c8e6c9"
      },
      {
        "id": "toples",
        "labelKey": "toples",
        "emoji": "🫙",
        "color": "#ffe0b2"
      },
      {
        "id": "kadang",
        "labelKey": "kadang",
        "emoji": "🧺",
        "color": "#fff9c4"
      }
    ],
    "items": [
      {
        "id": "apel",
        "labelKey": "i-apel",
        "bin": "piring",
        "emoji": "🍎"
      },
      {
        "id": "brokoli",
        "labelKey": "i-brokoli",
        "bin": "piring",
        "emoji": "🥦"
      },
      {
        "id": "jagung",
        "labelKey": "i-jagung",
        "bin": "piring",
        "emoji": "🌽"
      },
      {
        "id": "ayam",
        "labelKey": "i-ayam",
        "bin": "piring",
        "emoji": "🍗"
      },
      {
        "id": "tempe",
        "labelKey": "i-tempe",
        "bin": "piring",
        "emoji": "🍢"
      },
      {
        "id": "semangka",
        "labelKey": "i-semangka",
        "bin": "piring",
        "emoji": "🍉"
      },
      {
        "id": "kacang",
        "labelKey": "i-kacang",
        "bin": "piring",
        "emoji": "🥜"
      },
      {
        "id": "lolipop",
        "labelKey": "i-lolipop",
        "bin": "toples",
        "emoji": "🍭"
      },
      {
        "id": "donat",
        "labelKey": "i-donat",
        "bin": "toples",
        "emoji": "🍩"
      },
      {
        "id": "cokelat",
        "labelKey": "i-cokelat",
        "bin": "toples",
        "emoji": "🍫"
      },
      {
        "id": "cupcake",
        "labelKey": "i-cupcake",
        "bin": "toples",
        "emoji": "🧁"
      },
      {
        "id": "pancake",
        "labelKey": "i-pancake",
        "bin": "kadang",
        "emoji": "🥞"
      },
      {
        "id": "biskuit",
        "labelKey": "i-biskuit",
        "bin": "kadang",
        "emoji": "🍪"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-ciri-tubuh-dan-habitat",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.HEWAN-HABITAT.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ciri Tubuh Cocok di Mana?",
        "instruksi": "Taruh kartu ciri tubuh ke tempat hidup yang cocok: bulu tebal ke es, sirip ke air, punuk ke gurun.",
        "es": "es",
        "air": "air",
        "gurun": "gurun",
        "hutan": "hutan",
        "i-bulutebal": "bulu tebal hangat",
        "i-lemaktebal": "lapisan lemak tebal",
        "i-sirip": "sirip untuk berenang",
        "i-insang": "insang untuk bernapas di air",
        "i-punuk": "punuk penyimpan cadangan",
        "i-kakilebar": "kaki lebar untuk pasir",
        "i-warnahijau": "warna hijau daun untuk bersembunyi",
        "i-ekorpanjang": "ekor panjang untuk bergelantung"
      },
      "en": {
        "judul": "Which Home Fits This Body?",
        "instruksi": "Put each body-feature card on the home it suits: thick fur to the ice, fins to the water, hump to the desert.",
        "es": "ice",
        "air": "water",
        "gurun": "desert",
        "hutan": "forest",
        "i-bulutebal": "thick warm fur",
        "i-lemaktebal": "thick fat layer",
        "i-sirip": "fins for swimming",
        "i-insang": "gills to breathe in water",
        "i-punuk": "hump that stores reserves",
        "i-kakilebar": "wide feet for sand",
        "i-warnahijau": "leaf-green colour to hide",
        "i-ekorpanjang": "long tail for hanging"
      }
    },
    "knobs": {
      "binCount": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah habitat: 3 (es, air, gurun) → 4 (tambah hutan)"
      },
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah kartu ciri per putaran: 3 → 5 pasangan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "laut",
    "mode": "kelompok",
    "bins": [
      {
        "id": "es",
        "labelKey": "es",
        "emoji": "🧊",
        "color": "#e1f5fe"
      },
      {
        "id": "air",
        "labelKey": "air",
        "emoji": "🌊",
        "color": "#b3e5fc"
      },
      {
        "id": "gurun",
        "labelKey": "gurun",
        "emoji": "🏜️",
        "color": "#ffe0b2"
      },
      {
        "id": "hutan",
        "labelKey": "hutan",
        "emoji": "🌴",
        "color": "#c8e6c9"
      }
    ],
    "items": [
      {
        "id": "bulutebal",
        "labelKey": "i-bulutebal",
        "bin": "es",
        "emoji": "🧥",
        "color": "#ffffff"
      },
      {
        "id": "lemaktebal",
        "labelKey": "i-lemaktebal",
        "bin": "es",
        "emoji": "🦭",
        "color": "#e1f5fe"
      },
      {
        "id": "sirip",
        "labelKey": "i-sirip",
        "bin": "air",
        "shape": "triangle",
        "color": "#0288d1"
      },
      {
        "id": "insang",
        "labelKey": "i-insang",
        "bin": "air",
        "emoji": "🫧"
      },
      {
        "id": "punuk",
        "labelKey": "i-punuk",
        "bin": "gurun",
        "emoji": "🐪",
        "color": "#ffe0b2"
      },
      {
        "id": "kakilebar",
        "labelKey": "i-kakilebar",
        "bin": "gurun",
        "shape": "rect",
        "color": "#d7ccc8",
        "width": 1.8
      },
      {
        "id": "warnahijau",
        "labelKey": "i-warnahijau",
        "bin": "hutan",
        "shape": "circle",
        "color": "#43a047"
      },
      {
        "id": "ekorpanjang",
        "labelKey": "i-ekorpanjang",
        "bin": "hutan",
        "emoji": "🐒",
        "color": "#c8e6c9"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-darat-air-udara-kebun",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Darat, Air, atau Udara?",
        "instruksi": "Antar tiap hewan ke tempat hidupnya: darat, air, atau udara.",
        "darat": "darat",
        "air": "air",
        "udara": "udara",
        "i-sapi": "sapi",
        "i-kambing": "kambing",
        "i-kucing": "kucing",
        "i-ikan": "ikan",
        "i-gurita": "gurita",
        "i-penyu": "penyu",
        "i-burung": "burung",
        "i-kupu": "kupu-kupu",
        "i-lebah": "lebah"
      },
      "en": {
        "judul": "Land, Water, or Sky?",
        "instruksi": "Take each animal to where it lives: land, water, or sky.",
        "darat": "land",
        "air": "water",
        "udara": "sky",
        "i-sapi": "cow",
        "i-kambing": "goat",
        "i-kucing": "cat",
        "i-ikan": "fish",
        "i-gurita": "octopus",
        "i-penyu": "sea turtle",
        "i-burung": "bird",
        "i-kupu": "butterfly",
        "i-lebah": "bee"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah tempat: 2 (darat, air) → 3 (tambah udara)"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah hewan per putaran; bebek dan katak sengaja tidak dipakai"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "darat",
        "labelKey": "darat",
        "emoji": "🌾",
        "color": "#c5e1a5"
      },
      {
        "id": "air",
        "labelKey": "air",
        "emoji": "🌊",
        "color": "#81d4fa"
      },
      {
        "id": "udara",
        "labelKey": "udara",
        "emoji": "☁️",
        "color": "#e3f2fd"
      }
    ],
    "items": [
      {
        "id": "sapi",
        "labelKey": "i-sapi",
        "bin": "darat",
        "emoji": "🐄"
      },
      {
        "id": "kambing",
        "labelKey": "i-kambing",
        "bin": "darat",
        "emoji": "🐐"
      },
      {
        "id": "kucing",
        "labelKey": "i-kucing",
        "bin": "darat",
        "emoji": "🐈"
      },
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "air",
        "emoji": "🐟"
      },
      {
        "id": "gurita",
        "labelKey": "i-gurita",
        "bin": "air",
        "emoji": "🐙"
      },
      {
        "id": "penyu",
        "labelKey": "i-penyu",
        "bin": "air",
        "emoji": "🐢"
      },
      {
        "id": "burung",
        "labelKey": "i-burung",
        "bin": "udara",
        "emoji": "🐦"
      },
      {
        "id": "kupu",
        "labelKey": "i-kupu",
        "bin": "udara",
        "emoji": "🦋"
      },
      {
        "id": "lebah",
        "labelKey": "i-lebah",
        "bin": "udara",
        "emoji": "🐝"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-darat-air-udara-safari",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hewan Besar, Tempat Mana?",
        "instruksi": "Robot bertemu hewan dari jauh: antar ke darat, air, atau udara.",
        "darat": "darat",
        "air": "air",
        "udara": "udara",
        "i-gajah": "gajah",
        "i-zebra": "zebra",
        "i-kuda": "kuda",
        "i-hiu": "hiu",
        "i-lumba": "lumba-lumba",
        "i-udang": "udang",
        "i-elang": "elang",
        "i-burunghantu": "burung hantu",
        "i-capung": "capung"
      },
      "en": {
        "judul": "Big Animals, Which Home?",
        "instruksi": "Robot meets animals from far away: take each to land, water, or sky.",
        "darat": "land",
        "air": "water",
        "udara": "sky",
        "i-gajah": "elephant",
        "i-zebra": "zebra",
        "i-kuda": "horse",
        "i-hiu": "shark",
        "i-lumba": "dolphin",
        "i-udang": "shrimp",
        "i-elang": "eagle",
        "i-burunghantu": "owl",
        "i-capung": "dragonfly"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah tempat: 2 (darat, air) → 3 (tambah udara)"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah hewan per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "laut",
    "mode": "kelompok",
    "bins": [
      {
        "id": "darat",
        "labelKey": "darat",
        "emoji": "🌾",
        "color": "#c5e1a5"
      },
      {
        "id": "air",
        "labelKey": "air",
        "emoji": "🌊",
        "color": "#81d4fa"
      },
      {
        "id": "udara",
        "labelKey": "udara",
        "emoji": "☁️",
        "color": "#e3f2fd"
      }
    ],
    "items": [
      {
        "id": "gajah",
        "labelKey": "i-gajah",
        "bin": "darat",
        "emoji": "🐘"
      },
      {
        "id": "zebra",
        "labelKey": "i-zebra",
        "bin": "darat",
        "emoji": "🦓"
      },
      {
        "id": "kuda",
        "labelKey": "i-kuda",
        "bin": "darat",
        "emoji": "🐎"
      },
      {
        "id": "hiu",
        "labelKey": "i-hiu",
        "bin": "air",
        "emoji": "🦈"
      },
      {
        "id": "lumba",
        "labelKey": "i-lumba",
        "bin": "air",
        "emoji": "🐬"
      },
      {
        "id": "udang",
        "labelKey": "i-udang",
        "bin": "air",
        "emoji": "🦐"
      },
      {
        "id": "elang",
        "labelKey": "i-elang",
        "bin": "udara",
        "emoji": "🦅"
      },
      {
        "id": "burunghantu",
        "labelKey": "i-burunghantu",
        "bin": "udara",
        "emoji": "🦉"
      },
      {
        "id": "capung",
        "labelKey": "i-capung",
        "bin": "udara",
        "emoji": "🪰"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-habitat-hewan-lain",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.HEWAN-HABITAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rumah Hewan di Seluruh Dunia",
        "instruksi": "Robot keliling dunia: antar tiap hewan ke habitat tempat tinggalnya.",
        "gurun": "gurun",
        "es": "es",
        "hutan": "hutan",
        "terumbu": "terumbu karang",
        "i-kalajengking": "kalajengking",
        "i-ular": "ular pasir",
        "i-anjinglaut": "anjing laut",
        "i-rusakutub": "rusa kutub",
        "i-burungbeo": "burung beo",
        "i-gorila": "gorila",
        "i-kepiting": "kepiting karang",
        "i-cumi": "cumi-cumi"
      },
      "en": {
        "judul": "Animal Homes Around the World",
        "instruksi": "Robot travels the world: take each animal to the habitat where it lives.",
        "gurun": "desert",
        "es": "ice",
        "hutan": "forest",
        "terumbu": "coral reef",
        "i-kalajengking": "scorpion",
        "i-ular": "sand snake",
        "i-anjinglaut": "seal",
        "i-rusakutub": "reindeer",
        "i-burungbeo": "parrot",
        "i-gorila": "gorilla",
        "i-kepiting": "reef crab",
        "i-cumi": "squid"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah habitat: 2 → 4"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 2,
        "keterangan": "jumlah hewan per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "gurun",
        "labelKey": "gurun",
        "emoji": "🏜️",
        "color": "#ffe0b2"
      },
      {
        "id": "es",
        "labelKey": "es",
        "emoji": "🧊",
        "color": "#e1f5fe"
      },
      {
        "id": "hutan",
        "labelKey": "hutan",
        "emoji": "🌴",
        "color": "#c8e6c9"
      },
      {
        "id": "terumbu",
        "labelKey": "terumbu",
        "emoji": "🪸",
        "color": "#b3e5fc"
      }
    ],
    "items": [
      {
        "id": "kalajengking",
        "labelKey": "i-kalajengking",
        "bin": "gurun",
        "emoji": "🦂"
      },
      {
        "id": "ular",
        "labelKey": "i-ular",
        "bin": "gurun",
        "emoji": "🐍",
        "color": "#ffe0b2"
      },
      {
        "id": "anjinglaut",
        "labelKey": "i-anjinglaut",
        "bin": "es",
        "emoji": "🦭"
      },
      {
        "id": "rusakutub",
        "labelKey": "i-rusakutub",
        "bin": "es",
        "emoji": "🦌",
        "color": "#e1f5fe"
      },
      {
        "id": "burungbeo",
        "labelKey": "i-burungbeo",
        "bin": "hutan",
        "emoji": "🦜"
      },
      {
        "id": "gorila",
        "labelKey": "i-gorila",
        "bin": "hutan",
        "emoji": "🦍"
      },
      {
        "id": "kepiting",
        "labelKey": "i-kepiting",
        "bin": "terumbu",
        "emoji": "🦀"
      },
      {
        "id": "cumi",
        "labelKey": "i-cumi",
        "bin": "terumbu",
        "emoji": "🦑"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-hidup-tak-hidup-halaman",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.HIDUP-TAK-HIDUP.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hidup atau Tak Hidup?",
        "instruksi": "Taruh yang hidup ke keranjang daun, yang tak hidup ke keranjang batu.",
        "hidup": "hidup",
        "takhidup": "tak hidup",
        "i-kucing": "kucing",
        "i-ayam": "ayam",
        "i-pohon": "pohon",
        "i-bunga": "bunga",
        "i-ikan": "ikan",
        "i-batu": "batu",
        "i-bola": "bola",
        "i-mobil": "mobil mainan",
        "i-cangkir": "cangkir",
        "i-boneka": "boneka beruang"
      },
      "en": {
        "judul": "Living or Not Living?",
        "instruksi": "Put living things in the leaf basket and non-living things in the stone basket.",
        "hidup": "living",
        "takhidup": "not living",
        "i-kucing": "cat",
        "i-ayam": "chicken",
        "i-pohon": "tree",
        "i-bunga": "flower",
        "i-ikan": "fish",
        "i-batu": "stone",
        "i-bola": "ball",
        "i-mobil": "toy car",
        "i-cangkir": "cup",
        "i-boneka": "teddy bear"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah benda per putaran; pohon/bunga dan mobil selalu ikut sejak awal supaya jebakan bergerak/diam terlihat"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "hidup",
        "labelKey": "hidup",
        "emoji": "🌱"
      },
      {
        "id": "takhidup",
        "labelKey": "takhidup",
        "emoji": "🪨"
      }
    ],
    "items": [
      {
        "id": "kucing",
        "labelKey": "i-kucing",
        "bin": "hidup",
        "emoji": "🐈"
      },
      {
        "id": "ayam",
        "labelKey": "i-ayam",
        "bin": "hidup",
        "emoji": "🐔"
      },
      {
        "id": "pohon",
        "labelKey": "i-pohon",
        "bin": "hidup",
        "emoji": "🌳"
      },
      {
        "id": "bunga",
        "labelKey": "i-bunga",
        "bin": "hidup",
        "emoji": "🌼"
      },
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "hidup",
        "emoji": "🐟"
      },
      {
        "id": "batu",
        "labelKey": "i-batu",
        "bin": "takhidup",
        "emoji": "🪨"
      },
      {
        "id": "bola",
        "labelKey": "i-bola",
        "bin": "takhidup",
        "emoji": "⚽"
      },
      {
        "id": "mobil",
        "labelKey": "i-mobil",
        "bin": "takhidup",
        "emoji": "🚗"
      },
      {
        "id": "cangkir",
        "labelKey": "i-cangkir",
        "bin": "takhidup",
        "emoji": "☕"
      },
      {
        "id": "boneka",
        "labelKey": "i-boneka",
        "bin": "takhidup",
        "emoji": "🧸"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-hidup-tak-hidup-laut",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.HIDUP-TAK-HIDUP.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hidup di Bawah Laut",
        "instruksi": "Robot menyelam: taruh makhluk hidup ke keranjang daun, benda tak hidup ke keranjang batu.",
        "hidup": "hidup",
        "takhidup": "tak hidup",
        "i-ikan": "ikan",
        "i-penyu": "penyu",
        "i-gurita": "gurita",
        "i-rumputlaut": "rumput laut",
        "i-kepiting": "kepiting",
        "i-jangkar": "jangkar",
        "i-botol": "botol",
        "i-batu": "batu",
        "i-kapal": "kapal mainan",
        "i-koin": "koin"
      },
      "en": {
        "judul": "Living Things Under the Sea",
        "instruksi": "Robot dives: put living things in the leaf basket and non-living things in the stone basket.",
        "hidup": "living",
        "takhidup": "not living",
        "i-ikan": "fish",
        "i-penyu": "turtle",
        "i-gurita": "octopus",
        "i-rumputlaut": "seaweed",
        "i-kepiting": "crab",
        "i-jangkar": "anchor",
        "i-botol": "bottle",
        "i-batu": "rock",
        "i-kapal": "toy boat",
        "i-koin": "coin"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah benda per putaran; rumput laut (hidup, diam) dan kapal (tak hidup, bergerak) ikut sejak awal"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "laut",
    "mode": "kelompok",
    "bins": [
      {
        "id": "hidup",
        "labelKey": "hidup",
        "emoji": "🌱"
      },
      {
        "id": "takhidup",
        "labelKey": "takhidup",
        "emoji": "🪨"
      }
    ],
    "items": [
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "hidup",
        "emoji": "🐠"
      },
      {
        "id": "penyu",
        "labelKey": "i-penyu",
        "bin": "hidup",
        "emoji": "🐢"
      },
      {
        "id": "gurita",
        "labelKey": "i-gurita",
        "bin": "hidup",
        "emoji": "🐙"
      },
      {
        "id": "rumputlaut",
        "labelKey": "i-rumputlaut",
        "bin": "hidup",
        "emoji": "🌿"
      },
      {
        "id": "kepiting",
        "labelKey": "i-kepiting",
        "bin": "hidup",
        "emoji": "🦀"
      },
      {
        "id": "jangkar",
        "labelKey": "i-jangkar",
        "bin": "takhidup",
        "emoji": "⚓"
      },
      {
        "id": "botol",
        "labelKey": "i-botol",
        "bin": "takhidup",
        "emoji": "🍾"
      },
      {
        "id": "batu",
        "labelKey": "i-batu",
        "bin": "takhidup",
        "emoji": "🪨"
      },
      {
        "id": "kapal",
        "labelKey": "i-kapal",
        "bin": "takhidup",
        "emoji": "⛵"
      },
      {
        "id": "koin",
        "labelKey": "i-koin",
        "bin": "takhidup",
        "emoji": "🪙"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-isi-piringku",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.MAKANAN-SEHAT.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Isi Piringku",
        "instruksi": "Isi tiap bagian piring: nasi, lauk, sayur, dan buah. Jajanan tidak masuk piring.",
        "nasi": "nasi",
        "lauk": "lauk",
        "sayur": "sayur",
        "buah": "buah",
        "bukan": "bukan untuk piring",
        "i-nasiputih": "nasi putih",
        "i-kentang": "kentang rebus",
        "i-ayam": "ayam",
        "i-ikan": "ikan",
        "i-telur": "telur",
        "i-bayam": "bayam",
        "i-wortel": "wortel",
        "i-brokoli": "brokoli",
        "i-pisang": "pisang",
        "i-jeruk": "jeruk",
        "i-anggur": "anggur",
        "i-permen": "permen",
        "i-soda": "soda"
      },
      "en": {
        "judul": "Fill My Plate",
        "instruksi": "Fill each part of the plate: rice, protein, veggies, and fruit. Treats stay off the plate.",
        "nasi": "rice",
        "lauk": "protein",
        "sayur": "vegetables",
        "buah": "fruit",
        "bukan": "not for the plate",
        "i-nasiputih": "white rice",
        "i-kentang": "boiled potato",
        "i-ayam": "chicken",
        "i-ikan": "fish",
        "i-telur": "egg",
        "i-bayam": "spinach",
        "i-wortel": "carrot",
        "i-brokoli": "broccoli",
        "i-pisang": "banana",
        "i-jeruk": "orange",
        "i-anggur": "grapes",
        "i-permen": "candy",
        "i-soda": "fizzy drink"
      }
    },
    "knobs": {
      "binCount": {
        "min": 4,
        "max": 5,
        "default": 5,
        "step": 1,
        "keterangan": "4 bagian piring (nasi, lauk, sayur, buah) + 1 keranjang 'bukan untuk piring'; 4 = tanpa pengecoh"
      },
      "itemCount": {
        "min": 4,
        "max": 10,
        "default": 8,
        "step": 2,
        "keterangan": "jumlah pilihan di meja; makin banyak makin banyak pengecoh"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "nasi",
        "labelKey": "nasi",
        "emoji": "🍚",
        "color": "#fff8e1"
      },
      {
        "id": "lauk",
        "labelKey": "lauk",
        "emoji": "🍗",
        "color": "#ffccbc"
      },
      {
        "id": "sayur",
        "labelKey": "sayur",
        "emoji": "🥬",
        "color": "#c8e6c9"
      },
      {
        "id": "buah",
        "labelKey": "buah",
        "emoji": "🍎",
        "color": "#f8bbd0"
      },
      {
        "id": "bukan",
        "labelKey": "bukan",
        "emoji": "🚫",
        "color": "#eeeeee"
      }
    ],
    "items": [
      {
        "id": "nasiputih",
        "labelKey": "i-nasiputih",
        "bin": "nasi",
        "emoji": "🍚"
      },
      {
        "id": "kentang",
        "labelKey": "i-kentang",
        "bin": "nasi",
        "emoji": "🥔"
      },
      {
        "id": "ayam",
        "labelKey": "i-ayam",
        "bin": "lauk",
        "emoji": "🍗"
      },
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "lauk",
        "emoji": "🐟"
      },
      {
        "id": "telur",
        "labelKey": "i-telur",
        "bin": "lauk",
        "emoji": "🥚"
      },
      {
        "id": "bayam",
        "labelKey": "i-bayam",
        "bin": "sayur",
        "emoji": "🥬"
      },
      {
        "id": "wortel",
        "labelKey": "i-wortel",
        "bin": "sayur",
        "emoji": "🥕"
      },
      {
        "id": "brokoli",
        "labelKey": "i-brokoli",
        "bin": "sayur",
        "emoji": "🥦"
      },
      {
        "id": "pisang",
        "labelKey": "i-pisang",
        "bin": "buah",
        "emoji": "🍌"
      },
      {
        "id": "jeruk",
        "labelKey": "i-jeruk",
        "bin": "buah",
        "emoji": "🍊"
      },
      {
        "id": "anggur",
        "labelKey": "i-anggur",
        "bin": "buah",
        "emoji": "🍇"
      },
      {
        "id": "permen",
        "labelKey": "i-permen",
        "bin": "bukan",
        "emoji": "🍬"
      },
      {
        "id": "soda",
        "labelKey": "i-soda",
        "bin": "bukan",
        "emoji": "🥤"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-kandang-dua-empat-kaki",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.HEWAN-SUARA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kandang Dua Kaki, Empat Kaki",
        "instruksi": "Hitung kakinya, lalu taruh hewan ke kandang dua kaki atau empat kaki.",
        "dua": "dua kaki",
        "empat": "empat kaki",
        "nol": "tanpa kaki",
        "i-ayam": "ayam",
        "i-bebek": "bebek",
        "i-burung": "burung",
        "i-kucing": "kucing",
        "i-sapi": "sapi",
        "i-kambing": "kambing",
        "i-anjing": "anjing",
        "i-ikan": "ikan"
      },
      "en": {
        "judul": "Two-Leg, Four-Leg Pens",
        "instruksi": "Count the legs, then put each animal in the two-leg or four-leg pen.",
        "dua": "two legs",
        "empat": "four legs",
        "nol": "no legs",
        "i-ayam": "chicken",
        "i-bebek": "duck",
        "i-burung": "bird",
        "i-kucing": "cat",
        "i-sapi": "cow",
        "i-kambing": "goat",
        "i-anjing": "dog",
        "i-ikan": "fish"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "2 kandang (dua kaki, empat kaki); 3 menambah kandang tanpa kaki untuk ikan sebagai pengecoh"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah hewan per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "dua",
        "labelKey": "dua",
        "emoji": "🦶",
        "count": 2
      },
      {
        "id": "empat",
        "labelKey": "empat",
        "emoji": "🐾",
        "count": 4
      },
      {
        "id": "nol",
        "labelKey": "nol",
        "emoji": "🌊"
      }
    ],
    "items": [
      {
        "id": "ayam",
        "labelKey": "i-ayam",
        "bin": "dua",
        "emoji": "🐔"
      },
      {
        "id": "bebek",
        "labelKey": "i-bebek",
        "bin": "dua",
        "emoji": "🦆"
      },
      {
        "id": "burung",
        "labelKey": "i-burung",
        "bin": "dua",
        "emoji": "🐦"
      },
      {
        "id": "kucing",
        "labelKey": "i-kucing",
        "bin": "empat",
        "emoji": "🐈"
      },
      {
        "id": "sapi",
        "labelKey": "i-sapi",
        "bin": "empat",
        "emoji": "🐄"
      },
      {
        "id": "kambing",
        "labelKey": "i-kambing",
        "bin": "empat",
        "emoji": "🐐"
      },
      {
        "id": "anjing",
        "labelKey": "i-anjing",
        "bin": "empat",
        "emoji": "🐕"
      },
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "nol",
        "emoji": "🐟"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-kegiatan-sesuai-cuaca",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.CUACA-PAKAIAN.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Main Apa Hari Ini?",
        "instruksi": "Taruh kartu kegiatan ke papan cuaca yang cocok: layang-layang ke berangin, payung ke hujan.",
        "cerah": "cerah",
        "hujan": "hujan",
        "angin": "berangin",
        "i-jemur": "menjemur baju",
        "i-renang": "berenang di kolam",
        "i-eskrim": "makan es krim di taman",
        "i-payung": "pakai payung",
        "i-berteduh": "berteduh di rumah",
        "i-jashujan": "pakai jas hujan",
        "i-layang": "main layang-layang",
        "i-kincir": "main kincir angin",
        "i-layar": "naik perahu layar"
      },
      "en": {
        "judul": "What Shall We Do Today?",
        "instruksi": "Put each activity card on the matching weather board: kite to windy, umbrella to rainy.",
        "cerah": "sunny",
        "hujan": "rainy",
        "angin": "windy",
        "i-jemur": "drying laundry",
        "i-renang": "swimming in the pool",
        "i-eskrim": "eating ice cream in the park",
        "i-payung": "using an umbrella",
        "i-berteduh": "sheltering indoors",
        "i-jashujan": "wearing a raincoat",
        "i-layang": "flying a kite",
        "i-kincir": "playing with a pinwheel",
        "i-layar": "sailing a boat"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah papan cuaca: 2 (cerah, hujan) → 3 (tambah berangin)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah kartu kegiatan per putaran; main di dalam rumah tidak dipakai"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "cerah",
        "labelKey": "cerah",
        "emoji": "☀️"
      },
      {
        "id": "hujan",
        "labelKey": "hujan",
        "emoji": "🌧️"
      },
      {
        "id": "angin",
        "labelKey": "angin",
        "emoji": "💨"
      }
    ],
    "items": [
      {
        "id": "jemur",
        "labelKey": "i-jemur",
        "bin": "cerah",
        "emoji": "🧺"
      },
      {
        "id": "renang",
        "labelKey": "i-renang",
        "bin": "cerah",
        "emoji": "🏊"
      },
      {
        "id": "eskrim",
        "labelKey": "i-eskrim",
        "bin": "cerah",
        "emoji": "🍦"
      },
      {
        "id": "payung",
        "labelKey": "i-payung",
        "bin": "hujan",
        "emoji": "☂️"
      },
      {
        "id": "berteduh",
        "labelKey": "i-berteduh",
        "bin": "hujan",
        "emoji": "🏠"
      },
      {
        "id": "jashujan",
        "labelKey": "i-jashujan",
        "bin": "hujan",
        "emoji": "🧥",
        "color": "#ffee58"
      },
      {
        "id": "layang",
        "labelKey": "i-layang",
        "bin": "angin",
        "emoji": "🪁"
      },
      {
        "id": "kincir",
        "labelKey": "i-kincir",
        "bin": "angin",
        "emoji": "🎐"
      },
      {
        "id": "layar",
        "labelKey": "i-layar",
        "bin": "angin",
        "emoji": "⛵"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-keranjang-indra-pasar",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.TUBUH-PANCAINDRA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Indra di Pasar",
        "instruksi": "Robot jalan-jalan di pasar: taruh tiap benda ke indra yang dipakainya.",
        "mata": "mata",
        "telinga": "telinga",
        "hidung": "hidung",
        "lidah": "lidah",
        "i-balon": "balon warna-warni",
        "i-lukisan": "lukisan",
        "i-terompet": "terompet",
        "i-gitar": "gitar",
        "i-mawar": "bunga mawar",
        "i-parfum": "minyak wangi",
        "i-eskrim": "es krim",
        "i-madu": "madu manis"
      },
      "en": {
        "judul": "Senses at the Market",
        "instruksi": "Robot strolls the market: put each thing with the sense it uses.",
        "mata": "eye",
        "telinga": "ear",
        "hidung": "nose",
        "lidah": "tongue",
        "i-balon": "colourful balloons",
        "i-lukisan": "painting",
        "i-terompet": "trumpet",
        "i-gitar": "guitar",
        "i-mawar": "rose",
        "i-parfum": "perfume",
        "i-eskrim": "ice cream",
        "i-madu": "sweet honey"
      }
    },
    "knobs": {
      "binCount": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah keranjang indra aktif: mata, telinga, hidung → tambah lidah"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah benda per putaran; tiap benda hanya satu indra dominan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "bins": [
      {
        "id": "mata",
        "labelKey": "mata",
        "emoji": "👁️"
      },
      {
        "id": "telinga",
        "labelKey": "telinga",
        "emoji": "👂"
      },
      {
        "id": "hidung",
        "labelKey": "hidung",
        "emoji": "👃"
      },
      {
        "id": "lidah",
        "labelKey": "lidah",
        "emoji": "👅"
      }
    ],
    "items": [
      {
        "id": "balon",
        "labelKey": "i-balon",
        "bin": "mata",
        "emoji": "🎈"
      },
      {
        "id": "lukisan",
        "labelKey": "i-lukisan",
        "bin": "mata",
        "emoji": "🖼️"
      },
      {
        "id": "terompet",
        "labelKey": "i-terompet",
        "bin": "telinga",
        "emoji": "🎺"
      },
      {
        "id": "gitar",
        "labelKey": "i-gitar",
        "bin": "telinga",
        "emoji": "🎸"
      },
      {
        "id": "mawar",
        "labelKey": "i-mawar",
        "bin": "hidung",
        "emoji": "🌹"
      },
      {
        "id": "parfum",
        "labelKey": "i-parfum",
        "bin": "hidung",
        "emoji": "🧴"
      },
      {
        "id": "eskrim",
        "labelKey": "i-eskrim",
        "bin": "lidah",
        "emoji": "🍦"
      },
      {
        "id": "madu",
        "labelKey": "i-madu",
        "bin": "lidah",
        "emoji": "🍯"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-keranjang-indra-rumah",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.TUBUH-PANCAINDRA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Keranjang Pancaindra",
        "instruksi": "Taruh tiap benda ke indra yang memakainya: lampu ke mata, lonceng ke telinga.",
        "mata": "mata",
        "telinga": "telinga",
        "hidung": "hidung",
        "lidah": "lidah",
        "i-lampu": "lampu menyala",
        "i-pelangi": "pelangi",
        "i-lonceng": "lonceng",
        "i-genderang": "genderang",
        "i-bunga": "bunga harum",
        "i-sabun": "sabun wangi",
        "i-kue": "kue manis",
        "i-permen": "permen"
      },
      "en": {
        "judul": "Five-Sense Baskets",
        "instruksi": "Put each thing with the sense that uses it: the lamp with the eye, the bell with the ear.",
        "mata": "eye",
        "telinga": "ear",
        "hidung": "nose",
        "lidah": "tongue",
        "i-lampu": "glowing lamp",
        "i-pelangi": "rainbow",
        "i-lonceng": "bell",
        "i-genderang": "drum",
        "i-bunga": "sweet-smelling flower",
        "i-sabun": "scented soap",
        "i-kue": "sweet cake",
        "i-permen": "candy"
      }
    },
    "knobs": {
      "binCount": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah keranjang indra aktif: mata, telinga, hidung → tambah lidah"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah benda per putaran; tiap benda hanya satu indra dominan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "mata",
        "labelKey": "mata",
        "emoji": "👁️"
      },
      {
        "id": "telinga",
        "labelKey": "telinga",
        "emoji": "👂"
      },
      {
        "id": "hidung",
        "labelKey": "hidung",
        "emoji": "👃"
      },
      {
        "id": "lidah",
        "labelKey": "lidah",
        "emoji": "👅"
      }
    ],
    "items": [
      {
        "id": "lampu",
        "labelKey": "i-lampu",
        "bin": "mata",
        "emoji": "💡"
      },
      {
        "id": "pelangi",
        "labelKey": "i-pelangi",
        "bin": "mata",
        "emoji": "🌈"
      },
      {
        "id": "lonceng",
        "labelKey": "i-lonceng",
        "bin": "telinga",
        "emoji": "🔔"
      },
      {
        "id": "genderang",
        "labelKey": "i-genderang",
        "bin": "telinga",
        "emoji": "🥁"
      },
      {
        "id": "bunga",
        "labelKey": "i-bunga",
        "bin": "hidung",
        "emoji": "🌸"
      },
      {
        "id": "sabun",
        "labelKey": "i-sabun",
        "bin": "hidung",
        "emoji": "🧼"
      },
      {
        "id": "kue",
        "labelKey": "i-kue",
        "bin": "lidah",
        "emoji": "🍰"
      },
      {
        "id": "permen",
        "labelKey": "i-permen",
        "bin": "lidah",
        "emoji": "🍬"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-langit-siang-malam",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.SIANG-MALAM-CUACA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Siang atau Malam?",
        "instruksi": "Taruh tiap gambar kegiatan ke langit siang atau langit malam.",
        "siang": "siang",
        "malam": "malam",
        "i-bola": "main bola di lapangan",
        "i-sepeda": "naik sepeda",
        "i-sekolah": "berangkat sekolah",
        "i-layang": "main layang-layang",
        "i-tidur": "tidur di kasur",
        "i-bintang": "melihat bintang",
        "i-senter": "menyalakan senter",
        "i-burunghantu": "burung hantu terbang"
      },
      "en": {
        "judul": "Day or Night?",
        "instruksi": "Put each activity picture under the day sky or the night sky.",
        "siang": "day",
        "malam": "night",
        "i-bola": "playing ball outside",
        "i-sepeda": "riding a bike",
        "i-sekolah": "going to school",
        "i-layang": "flying a kite",
        "i-tidur": "sleeping in bed",
        "i-bintang": "watching the stars",
        "i-senter": "turning on a torch",
        "i-burunghantu": "an owl flying"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah gambar per putaran; semua gambar punya petunjuk kuat (matahari, lampu, piyama)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "siang",
        "labelKey": "siang",
        "emoji": "☀️",
        "color": "#bbdefb"
      },
      {
        "id": "malam",
        "labelKey": "malam",
        "emoji": "🌙",
        "color": "#1a237e"
      }
    ],
    "items": [
      {
        "id": "bola",
        "labelKey": "i-bola",
        "bin": "siang",
        "emoji": "⚽"
      },
      {
        "id": "sepeda",
        "labelKey": "i-sepeda",
        "bin": "siang",
        "emoji": "🚲"
      },
      {
        "id": "sekolah",
        "labelKey": "i-sekolah",
        "bin": "siang",
        "emoji": "🏫"
      },
      {
        "id": "layang",
        "labelKey": "i-layang",
        "bin": "siang",
        "emoji": "🪁"
      },
      {
        "id": "tidur",
        "labelKey": "i-tidur",
        "bin": "malam",
        "emoji": "🛌"
      },
      {
        "id": "bintang",
        "labelKey": "i-bintang",
        "bin": "malam",
        "emoji": "🌟"
      },
      {
        "id": "senter",
        "labelKey": "i-senter",
        "bin": "malam",
        "emoji": "🔦"
      },
      {
        "id": "burunghantu",
        "labelKey": "i-burunghantu",
        "bin": "malam",
        "emoji": "🦉"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-lapisan-tulang-otot-organ",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.TULANG-OTOT-ORGAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lapisan Tubuh",
        "instruksi": "Taruh tiap potongan ke lapisannya: tulang, otot, atau organ. Jantung masuk organ.",
        "tulang": "lapisan tulang",
        "otot": "lapisan otot",
        "organ": "lapisan organ (jantung di sini)",
        "i-tengkorak": "tengkorak",
        "i-tulangpaha": "tulang paha",
        "i-ototlengan": "otot lengan",
        "i-ototbetis": "otot betis",
        "i-jantung": "jantung",
        "i-paru": "paru-paru",
        "i-otak": "otak"
      },
      "en": {
        "judul": "Layers of the Body",
        "instruksi": "Put each piece in its layer: bones, muscles, or organs. The heart goes with organs.",
        "tulang": "bone layer",
        "otot": "muscle layer",
        "organ": "organ layer (heart goes here)",
        "i-tengkorak": "skull",
        "i-tulangpaha": "thigh bone",
        "i-ototlengan": "arm muscle",
        "i-ototbetis": "calf muscle",
        "i-jantung": "heart",
        "i-paru": "lungs",
        "i-otak": "brain"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah potongan per putaran: 3 → 6"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "klinik",
    "mode": "kelompok",
    "bins": [
      {
        "id": "tulang",
        "labelKey": "tulang",
        "emoji": "🦴",
        "color": "#f5f5f5"
      },
      {
        "id": "otot",
        "labelKey": "otot",
        "emoji": "💪",
        "color": "#ef9a9a"
      },
      {
        "id": "organ",
        "labelKey": "organ",
        "emoji": "🫀",
        "color": "#ffe0b2"
      }
    ],
    "items": [
      {
        "id": "tengkorak",
        "labelKey": "i-tengkorak",
        "bin": "tulang",
        "emoji": "💀"
      },
      {
        "id": "tulangpaha",
        "labelKey": "i-tulangpaha",
        "bin": "tulang",
        "emoji": "🦴"
      },
      {
        "id": "ototlengan",
        "labelKey": "i-ototlengan",
        "bin": "otot",
        "emoji": "💪"
      },
      {
        "id": "ototbetis",
        "labelKey": "i-ototbetis",
        "bin": "otot",
        "emoji": "🦵"
      },
      {
        "id": "jantung",
        "labelKey": "i-jantung",
        "bin": "organ",
        "emoji": "🫀"
      },
      {
        "id": "paru",
        "labelKey": "i-paru",
        "bin": "organ",
        "emoji": "🫁"
      },
      {
        "id": "otak",
        "labelKey": "i-otak",
        "bin": "organ",
        "emoji": "🧠"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-lemari-cuaca",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.CUACA-PAKAIAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lemari Cuaca",
        "instruksi": "Dengarkan cuacanya, lalu sentuh pakaian yang cocok untuk robot.",
        "pilihan": "pilihan",
        "i-jashujan": "jas hujan",
        "i-topi": "topi",
        "i-jaket": "jaket tebal",
        "i-syal": "syal",
        "i-sandal": "sandal jepit",
        "t-hujan": "Di luar hujan deras. Pakai apa?",
        "t-panas": "Matahari terik, hari panas. Pakai apa?",
        "t-dingin": "Udara dingin sekali, menggigil. Pakai apa?",
        "t-hujan2": "Awan gelap, hujan turun lagi. Pakai apa?",
        "t-dingin2": "Angin dingin bertiup di pagi hari. Pakai apa?"
      },
      "en": {
        "judul": "The Weather Wardrobe",
        "instruksi": "Listen to the weather, then touch the right clothes for robot.",
        "pilihan": "choices",
        "i-jashujan": "raincoat",
        "i-topi": "sun hat",
        "i-jaket": "warm jacket",
        "i-syal": "scarf",
        "i-sandal": "flip-flops",
        "t-hujan": "It's raining hard outside. What do we wear?",
        "t-panas": "The sun is strong, it's hot. What do we wear?",
        "t-dingin": "It's very cold and chilly. What do we wear?",
        "t-hujan2": "Dark clouds, it's raining again. What do we wear?",
        "t-dingin2": "A cold wind blows this morning. What do we wear?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah pilihan pakaian per cuaca; posisi diacak supaya tidak memilih favorit"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "jashujan",
        "labelKey": "i-jashujan",
        "bin": "pilihan",
        "emoji": "🧥",
        "color": "#ffee58"
      },
      {
        "id": "topi",
        "labelKey": "i-topi",
        "bin": "pilihan",
        "emoji": "👒"
      },
      {
        "id": "jaket",
        "labelKey": "i-jaket",
        "bin": "pilihan",
        "emoji": "🧥",
        "color": "#5c6bc0"
      },
      {
        "id": "syal",
        "labelKey": "i-syal",
        "bin": "pilihan",
        "emoji": "🧣"
      },
      {
        "id": "sandal",
        "labelKey": "i-sandal",
        "bin": "pilihan",
        "emoji": "🩴"
      }
    ],
    "pilihan": [
      {
        "id": "hujan",
        "promptKey": "t-hujan",
        "choices": [
          "jashujan",
          "topi",
          "sandal"
        ],
        "correct": "jashujan"
      },
      {
        "id": "panas",
        "promptKey": "t-panas",
        "choices": [
          "topi",
          "jaket",
          "jashujan"
        ],
        "correct": "topi"
      },
      {
        "id": "dingin",
        "promptKey": "t-dingin",
        "choices": [
          "jaket",
          "sandal",
          "topi"
        ],
        "correct": "jaket"
      },
      {
        "id": "hujan2",
        "promptKey": "t-hujan2",
        "choices": [
          "sandal",
          "jashujan",
          "syal",
          "topi"
        ],
        "correct": "jashujan"
      },
      {
        "id": "dingin2",
        "promptKey": "t-dingin2",
        "choices": [
          "syal",
          "sandal",
          "topi",
          "jashujan"
        ],
        "correct": "syal"
      }
    ]
  },
  {
    "id": "sains-mana-bagian-tubuh",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.TUBUH-PANCAINDRA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Bagian Tubuhnya?",
        "instruksi": "Dengarkan nama bagian tubuh, lalu sentuh gambarnya.",
        "pilihan": "pilihan",
        "i-mata": "mata",
        "i-hidung": "hidung",
        "i-telinga": "telinga",
        "i-mulut": "mulut",
        "i-tangan": "tangan",
        "i-kaki": "kaki",
        "t-mata": "Mana matanya?",
        "t-hidung": "Mana hidungnya?",
        "t-telinga": "Mana telinganya?",
        "t-mulut": "Mana mulutnya?",
        "t-tangan": "Mana tangannya?",
        "t-kaki": "Mana kakinya?"
      },
      "en": {
        "judul": "Where Is That Body Part?",
        "instruksi": "Listen to the body part, then touch its picture.",
        "pilihan": "choices",
        "i-mata": "eye",
        "i-hidung": "nose",
        "i-telinga": "ear",
        "i-mulut": "mouth",
        "i-tangan": "hand",
        "i-kaki": "foot",
        "t-mata": "Where is the eye?",
        "t-hidung": "Where is the nose?",
        "t-telinga": "Where is the ear?",
        "t-mulut": "Where is the mouth?",
        "t-tangan": "Where is the hand?",
        "t-kaki": "Where is the foot?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah gambar bagian tubuh per pertanyaan; mulai 3–4 bagian besar, naik ke 6"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "klinik",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "mata",
        "labelKey": "i-mata",
        "bin": "pilihan",
        "emoji": "👁️"
      },
      {
        "id": "hidung",
        "labelKey": "i-hidung",
        "bin": "pilihan",
        "emoji": "👃"
      },
      {
        "id": "telinga",
        "labelKey": "i-telinga",
        "bin": "pilihan",
        "emoji": "👂"
      },
      {
        "id": "mulut",
        "labelKey": "i-mulut",
        "bin": "pilihan",
        "emoji": "👄"
      },
      {
        "id": "tangan",
        "labelKey": "i-tangan",
        "bin": "pilihan",
        "emoji": "✋"
      },
      {
        "id": "kaki",
        "labelKey": "i-kaki",
        "bin": "pilihan",
        "emoji": "🦶"
      }
    ],
    "pilihan": [
      {
        "id": "mata",
        "promptKey": "t-mata",
        "choices": [
          "mata",
          "hidung",
          "telinga",
          "mulut"
        ],
        "correct": "mata"
      },
      {
        "id": "hidung",
        "promptKey": "t-hidung",
        "choices": [
          "hidung",
          "mulut",
          "telinga",
          "tangan"
        ],
        "correct": "hidung"
      },
      {
        "id": "telinga",
        "promptKey": "t-telinga",
        "choices": [
          "telinga",
          "mata",
          "kaki",
          "hidung"
        ],
        "correct": "telinga"
      },
      {
        "id": "mulut",
        "promptKey": "t-mulut",
        "choices": [
          "mulut",
          "mata",
          "hidung",
          "tangan"
        ],
        "correct": "mulut"
      },
      {
        "id": "tangan",
        "promptKey": "t-tangan",
        "choices": [
          "tangan",
          "kaki",
          "telinga",
          "mata"
        ],
        "correct": "tangan"
      },
      {
        "id": "kaki",
        "promptKey": "t-kaki",
        "choices": [
          "kaki",
          "tangan",
          "mulut",
          "hidung"
        ],
        "correct": "kaki"
      }
    ]
  },
  {
    "id": "sains-mana-bagian-tumbuhan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.BAGIAN-TUMBUHAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Bagian Tumbuhannya?",
        "instruksi": "Dengarkan nama bagian tumbuhan, lalu sentuh gambarnya.",
        "pilihan": "pilihan",
        "i-akar": "akar",
        "i-batang": "batang",
        "i-daun": "daun",
        "i-bunga": "bunga",
        "t-akar": "Mana akarnya? Akar ada di dalam tanah.",
        "t-daun": "Mana daunnya?",
        "t-bunga": "Mana bunganya?",
        "t-batang": "Mana batangnya?"
      },
      "en": {
        "judul": "Which Plant Part?",
        "instruksi": "Listen to the plant part, then touch its picture.",
        "pilihan": "choices",
        "i-akar": "root",
        "i-batang": "stem",
        "i-daun": "leaf",
        "i-bunga": "flower",
        "t-akar": "Where is the root? Roots grow in the soil.",
        "t-daun": "Where is the leaf?",
        "t-bunga": "Where is the flower?",
        "t-batang": "Where is the stem?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 4,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah pilihan per pertanyaan: akar, batang, daun, bunga (buah tidak dicampur di tahap ini)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "akar",
        "labelKey": "i-akar",
        "bin": "pilihan",
        "emoji": "🫚",
        "color": "#8d6e63"
      },
      {
        "id": "batang",
        "labelKey": "i-batang",
        "bin": "pilihan",
        "emoji": "🎋"
      },
      {
        "id": "daun",
        "labelKey": "i-daun",
        "bin": "pilihan",
        "emoji": "🍃"
      },
      {
        "id": "bunga",
        "labelKey": "i-bunga",
        "bin": "pilihan",
        "emoji": "🌸"
      }
    ],
    "pilihan": [
      {
        "id": "akar",
        "promptKey": "t-akar",
        "choices": [
          "akar",
          "batang",
          "daun",
          "bunga"
        ],
        "correct": "akar"
      },
      {
        "id": "daun",
        "promptKey": "t-daun",
        "choices": [
          "daun",
          "bunga",
          "akar",
          "batang"
        ],
        "correct": "daun"
      },
      {
        "id": "bunga",
        "promptKey": "t-bunga",
        "choices": [
          "bunga",
          "daun",
          "batang",
          "akar"
        ],
        "correct": "bunga"
      },
      {
        "id": "batang",
        "promptKey": "t-batang",
        "choices": [
          "batang",
          "akar",
          "bunga",
          "daun"
        ],
        "correct": "batang"
      }
    ]
  },
  {
    "id": "sains-mana-benda-langit",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.MATAHARI-BUMI-BULAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Bumi, Mana Bulan?",
        "instruksi": "Robot terbang di angkasa: dengarkan nama benda langit, lalu sentuh gambarnya.",
        "pilihan": "pilihan",
        "i-matahari": "Matahari",
        "i-bumi": "Bumi",
        "i-bulan": "Bulan",
        "i-mars": "Mars",
        "i-bintang": "bintang",
        "t-bumi": "Mana Bumi? Bumi biru dan hijau.",
        "t-matahari": "Mana Matahari?",
        "t-bulan": "Mana Bulan? Bulan kecil dan abu-abu.",
        "t-bumi2": "Mana Bumi?",
        "t-mars": "Mana Mars yang merah?"
      },
      "en": {
        "judul": "Which Is Earth, Which Is Moon?",
        "instruksi": "Robot flies through space: listen to the space object, then touch its picture.",
        "pilihan": "choices",
        "i-matahari": "the Sun",
        "i-bumi": "Earth",
        "i-bulan": "the Moon",
        "i-mars": "Mars",
        "i-bintang": "a star",
        "t-bumi": "Where is Earth? Earth is blue and green.",
        "t-matahari": "Where is the Sun?",
        "t-bulan": "Where is the Moon? The Moon is small and grey.",
        "t-bumi2": "Where is Earth?",
        "t-mars": "Where is red Mars?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah benda langit per pertanyaan: 3 (Matahari, Bumi, Bulan) → 5 (tambah Mars merah dan bintang)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "angkasa",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "matahari",
        "labelKey": "i-matahari",
        "bin": "pilihan",
        "emoji": "☀️",
        "scale": 1.6
      },
      {
        "id": "bumi",
        "labelKey": "i-bumi",
        "bin": "pilihan",
        "emoji": "🌍"
      },
      {
        "id": "bulan",
        "labelKey": "i-bulan",
        "bin": "pilihan",
        "emoji": "🌕",
        "scale": 0.6,
        "color": "#263238"
      },
      {
        "id": "mars",
        "labelKey": "i-mars",
        "bin": "pilihan",
        "shape": "circle",
        "color": "#d84315",
        "scale": 0.8
      },
      {
        "id": "bintang",
        "labelKey": "i-bintang",
        "bin": "pilihan",
        "emoji": "⭐",
        "scale": 0.6
      }
    ],
    "pilihan": [
      {
        "id": "bumi",
        "promptKey": "t-bumi",
        "choices": [
          "bumi",
          "bulan",
          "matahari"
        ],
        "correct": "bumi"
      },
      {
        "id": "matahari",
        "promptKey": "t-matahari",
        "choices": [
          "matahari",
          "bumi",
          "bintang"
        ],
        "correct": "matahari"
      },
      {
        "id": "bulan",
        "promptKey": "t-bulan",
        "choices": [
          "bulan",
          "bumi",
          "mars"
        ],
        "correct": "bulan"
      },
      {
        "id": "bumi2",
        "promptKey": "t-bumi2",
        "choices": [
          "mars",
          "bumi",
          "bulan",
          "bintang"
        ],
        "correct": "bumi"
      },
      {
        "id": "mars",
        "promptKey": "t-mars",
        "choices": [
          "bulan",
          "mars",
          "bumi",
          "matahari",
          "bintang"
        ],
        "correct": "mars"
      }
    ]
  },
  {
    "id": "sains-mana-hewan-halaman",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.HEWAN-SUARA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hewan di Halaman",
        "instruksi": "Dengarkan nama hewannya, lalu sentuh hewan itu.",
        "pilihan": "pilihan",
        "i-kucing": "kucing",
        "i-ayam": "ayam",
        "i-sapi": "sapi",
        "i-kambing": "kambing",
        "i-bebek": "bebek",
        "i-burung": "burung",
        "t-sapi": "Mana sapinya?",
        "t-kucing": "Mana kucingnya?",
        "t-ayam": "Mana ayamnya?",
        "t-bebek": "Mana bebeknya?",
        "t-kambing": "Mana kambingnya?",
        "t-burung": "Mana burungnya?"
      },
      "en": {
        "judul": "Animals in the Yard",
        "instruksi": "Listen to the animal's name, then touch that animal.",
        "pilihan": "choices",
        "i-kucing": "cat",
        "i-ayam": "chicken",
        "i-sapi": "cow",
        "i-kambing": "goat",
        "i-bebek": "duck",
        "i-burung": "bird",
        "t-sapi": "Where is the cow?",
        "t-kucing": "Where is the cat?",
        "t-ayam": "Where is the chicken?",
        "t-bebek": "Where is the duck?",
        "t-kambing": "Where is the goat?",
        "t-burung": "Where is the bird?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah hewan di layar per pertanyaan: 3 → 6"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "kucing",
        "labelKey": "i-kucing",
        "bin": "pilihan",
        "emoji": "🐱"
      },
      {
        "id": "ayam",
        "labelKey": "i-ayam",
        "bin": "pilihan",
        "emoji": "🐔"
      },
      {
        "id": "sapi",
        "labelKey": "i-sapi",
        "bin": "pilihan",
        "emoji": "🐄",
        "scale": 1.3
      },
      {
        "id": "kambing",
        "labelKey": "i-kambing",
        "bin": "pilihan",
        "emoji": "🐐"
      },
      {
        "id": "bebek",
        "labelKey": "i-bebek",
        "bin": "pilihan",
        "emoji": "🦆"
      },
      {
        "id": "burung",
        "labelKey": "i-burung",
        "bin": "pilihan",
        "emoji": "🐦",
        "scale": 0.8
      }
    ],
    "pilihan": [
      {
        "id": "sapi",
        "promptKey": "t-sapi",
        "choices": [
          "sapi",
          "kambing",
          "kucing",
          "ayam"
        ],
        "correct": "sapi"
      },
      {
        "id": "kucing",
        "promptKey": "t-kucing",
        "choices": [
          "kucing",
          "bebek",
          "sapi",
          "burung"
        ],
        "correct": "kucing"
      },
      {
        "id": "ayam",
        "promptKey": "t-ayam",
        "choices": [
          "ayam",
          "bebek",
          "kambing",
          "kucing"
        ],
        "correct": "ayam"
      },
      {
        "id": "bebek",
        "promptKey": "t-bebek",
        "choices": [
          "bebek",
          "ayam",
          "burung",
          "sapi"
        ],
        "correct": "bebek"
      },
      {
        "id": "kambing",
        "promptKey": "t-kambing",
        "choices": [
          "kambing",
          "sapi",
          "kucing",
          "bebek"
        ],
        "correct": "kambing"
      },
      {
        "id": "burung",
        "promptKey": "t-burung",
        "choices": [
          "burung",
          "ayam",
          "bebek",
          "kambing"
        ],
        "correct": "burung"
      }
    ]
  },
  {
    "id": "sains-mana-hewan-laut",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.HEWAN-SUARA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hewan di Bawah Laut",
        "instruksi": "Robot menyelam: dengarkan nama hewan laut, lalu sentuh hewan itu.",
        "pilihan": "pilihan",
        "i-ikan": "ikan",
        "i-penyu": "penyu",
        "i-gurita": "gurita",
        "i-kepiting": "kepiting",
        "i-lumba": "lumba-lumba",
        "i-udang": "udang",
        "t-penyu": "Mana penyunya?",
        "t-ikan": "Mana ikannya?",
        "t-gurita": "Mana guritanya?",
        "t-kepiting": "Mana kepitingnya?",
        "t-lumba": "Mana lumba-lumbanya?"
      },
      "en": {
        "judul": "Animals Under the Sea",
        "instruksi": "Robot dives down: listen to the sea animal's name, then touch it.",
        "pilihan": "choices",
        "i-ikan": "fish",
        "i-penyu": "turtle",
        "i-gurita": "octopus",
        "i-kepiting": "crab",
        "i-lumba": "dolphin",
        "i-udang": "shrimp",
        "t-penyu": "Where is the turtle?",
        "t-ikan": "Where is the fish?",
        "t-gurita": "Where is the octopus?",
        "t-kepiting": "Where is the crab?",
        "t-lumba": "Where is the dolphin?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah hewan laut di layar per pertanyaan: 3 → 6"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "laut",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "pilihan",
        "emoji": "🐟"
      },
      {
        "id": "penyu",
        "labelKey": "i-penyu",
        "bin": "pilihan",
        "emoji": "🐢"
      },
      {
        "id": "gurita",
        "labelKey": "i-gurita",
        "bin": "pilihan",
        "emoji": "🐙"
      },
      {
        "id": "kepiting",
        "labelKey": "i-kepiting",
        "bin": "pilihan",
        "emoji": "🦀"
      },
      {
        "id": "lumba",
        "labelKey": "i-lumba",
        "bin": "pilihan",
        "emoji": "🐬",
        "scale": 1.3
      },
      {
        "id": "udang",
        "labelKey": "i-udang",
        "bin": "pilihan",
        "emoji": "🦐",
        "scale": 0.8
      }
    ],
    "pilihan": [
      {
        "id": "penyu",
        "promptKey": "t-penyu",
        "choices": [
          "penyu",
          "ikan",
          "gurita",
          "kepiting"
        ],
        "correct": "penyu"
      },
      {
        "id": "ikan",
        "promptKey": "t-ikan",
        "choices": [
          "ikan",
          "lumba",
          "kepiting",
          "udang"
        ],
        "correct": "ikan"
      },
      {
        "id": "gurita",
        "promptKey": "t-gurita",
        "choices": [
          "gurita",
          "penyu",
          "udang",
          "ikan"
        ],
        "correct": "gurita"
      },
      {
        "id": "kepiting",
        "promptKey": "t-kepiting",
        "choices": [
          "kepiting",
          "udang",
          "ikan",
          "lumba"
        ],
        "correct": "kepiting"
      },
      {
        "id": "lumba",
        "promptKey": "t-lumba",
        "choices": [
          "lumba",
          "ikan",
          "penyu",
          "gurita"
        ],
        "correct": "lumba"
      }
    ]
  },
  {
    "id": "sains-mana-organ-tubuh",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.TULANG-OTOT-ORGAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Organnya?",
        "instruksi": "Dengarkan nama organ di dalam tubuh, lalu sentuh gambarnya.",
        "pilihan": "pilihan",
        "i-jantung": "jantung",
        "i-paru": "paru-paru",
        "i-otak": "otak",
        "i-tulang": "tulang",
        "t-jantung": "Mana jantungnya? Jantung berdetak dug-dug.",
        "t-paru": "Mana paru-parunya? Paru-paru untuk bernapas.",
        "t-otak": "Mana otaknya? Otak untuk berpikir.",
        "t-jantung2": "Mana jantungnya?"
      },
      "en": {
        "judul": "Where Is That Organ?",
        "instruksi": "Listen to the organ inside the body, then touch its picture.",
        "pilihan": "choices",
        "i-jantung": "heart",
        "i-paru": "lungs",
        "i-otak": "brain",
        "i-tulang": "bone",
        "t-jantung": "Where is the heart? It goes thump-thump.",
        "t-paru": "Where are the lungs? Lungs are for breathing.",
        "t-otak": "Where is the brain? The brain is for thinking.",
        "t-jantung2": "Where is the heart?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah pilihan: 3 organ besar (jantung, paru-paru, otak) → 4 (tambah tulang sebagai pengecoh)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "klinik",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "jantung",
        "labelKey": "i-jantung",
        "bin": "pilihan",
        "emoji": "🫀"
      },
      {
        "id": "paru",
        "labelKey": "i-paru",
        "bin": "pilihan",
        "emoji": "🫁"
      },
      {
        "id": "otak",
        "labelKey": "i-otak",
        "bin": "pilihan",
        "emoji": "🧠"
      },
      {
        "id": "tulang",
        "labelKey": "i-tulang",
        "bin": "pilihan",
        "emoji": "🦴"
      }
    ],
    "pilihan": [
      {
        "id": "jantung",
        "promptKey": "t-jantung",
        "choices": [
          "jantung",
          "paru",
          "otak"
        ],
        "correct": "jantung"
      },
      {
        "id": "paru",
        "promptKey": "t-paru",
        "choices": [
          "paru",
          "otak",
          "jantung",
          "tulang"
        ],
        "correct": "paru"
      },
      {
        "id": "otak",
        "promptKey": "t-otak",
        "choices": [
          "otak",
          "jantung",
          "tulang",
          "paru"
        ],
        "correct": "otak"
      },
      {
        "id": "jantung2",
        "promptKey": "t-jantung2",
        "choices": [
          "tulang",
          "jantung",
          "paru",
          "otak"
        ],
        "correct": "jantung"
      }
    ]
  },
  {
    "id": "sains-mana-yang-dari-kayu",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.BAHAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Terbuat dari Apa?",
        "instruksi": "Dengarkan bahannya, lalu sentuh benda yang terbuat dari bahan itu.",
        "pilihan": "pilihan",
        "i-kursi": "kursi kayu",
        "i-kaleng": "kaleng",
        "i-ember": "ember plastik",
        "i-gelas": "gelas kaca",
        "i-paku": "paku",
        "i-talenan": "talenan kayu",
        "t-kayu": "Mana yang terbuat dari kayu?",
        "t-logam": "Mana yang terbuat dari logam?",
        "t-kaca": "Mana yang terbuat dari kaca?",
        "t-plastik": "Mana yang terbuat dari plastik?",
        "t-logam2": "Mana yang terbuat dari logam?"
      },
      "en": {
        "judul": "What Is It Made Of?",
        "instruksi": "Listen to the material, then touch the object made from it.",
        "pilihan": "choices",
        "i-kursi": "wooden chair",
        "i-kaleng": "tin can",
        "i-ember": "plastic bucket",
        "i-gelas": "glass cup",
        "i-paku": "nail",
        "i-talenan": "wooden board",
        "t-kayu": "Which one is made of wood?",
        "t-logam": "Which one is made of metal?",
        "t-kaca": "Which one is made of glass?",
        "t-plastik": "Which one is made of plastic?",
        "t-logam2": "Which one is made of metal?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah benda per pertanyaan: 2 → 4"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "kursi",
        "labelKey": "i-kursi",
        "bin": "pilihan",
        "emoji": "🪑"
      },
      {
        "id": "kaleng",
        "labelKey": "i-kaleng",
        "bin": "pilihan",
        "emoji": "🥫"
      },
      {
        "id": "ember",
        "labelKey": "i-ember",
        "bin": "pilihan",
        "emoji": "🪣"
      },
      {
        "id": "gelas",
        "labelKey": "i-gelas",
        "bin": "pilihan",
        "emoji": "🥛"
      },
      {
        "id": "paku",
        "labelKey": "i-paku",
        "bin": "pilihan",
        "emoji": "🔩"
      },
      {
        "id": "talenan",
        "labelKey": "i-talenan",
        "bin": "pilihan",
        "emoji": "🪵"
      }
    ],
    "pilihan": [
      {
        "id": "kayu",
        "promptKey": "t-kayu",
        "choices": [
          "kursi",
          "kaleng",
          "ember"
        ],
        "correct": "kursi"
      },
      {
        "id": "logam",
        "promptKey": "t-logam",
        "choices": [
          "gelas",
          "kaleng",
          "kursi"
        ],
        "correct": "kaleng"
      },
      {
        "id": "kaca",
        "promptKey": "t-kaca",
        "choices": [
          "ember",
          "gelas",
          "talenan"
        ],
        "correct": "gelas"
      },
      {
        "id": "plastik",
        "promptKey": "t-plastik",
        "choices": [
          "paku",
          "ember",
          "gelas",
          "talenan"
        ],
        "correct": "ember"
      },
      {
        "id": "logam2",
        "promptKey": "t-logam2",
        "choices": [
          "talenan",
          "ember",
          "paku",
          "gelas"
        ],
        "correct": "paku"
      }
    ]
  },
  {
    "id": "sains-mana-yang-tenggelam",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.APUNG-TENGGELAM-MAGNET.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tebak Mana yang Tenggelam",
        "instruksi": "Tebak dulu sebelum dicoba: sentuh benda yang akan tenggelam atau terapung sesuai pertanyaan.",
        "pilihan": "pilihan",
        "i-kayu": "balok kayu",
        "i-batu": "batu",
        "i-daun": "daun",
        "i-paku": "paku logam",
        "i-bola": "bola plastik",
        "i-kunci": "kunci logam",
        "t-t1": "Mana yang akan tenggelam?",
        "t-a1": "Mana yang akan terapung?",
        "t-t2": "Mana yang akan tenggelam?",
        "t-a2": "Kayunya besar sekali. Mana yang akan terapung?",
        "t-t3": "Mana yang akan tenggelam?"
      },
      "en": {
        "judul": "Guess Which One Sinks",
        "instruksi": "Guess before we test: touch the thing that will sink or float as asked.",
        "pilihan": "choices",
        "i-kayu": "wooden block",
        "i-batu": "stone",
        "i-daun": "leaf",
        "i-paku": "metal nail",
        "i-bola": "plastic ball",
        "i-kunci": "metal key",
        "t-t1": "Which one will sink?",
        "t-a1": "Which one will float?",
        "t-t2": "Which one will sink?",
        "t-a2": "The wood is really big. Which one will float?",
        "t-t3": "Which one will sink?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah pilihan per pertanyaan; bahan yang sama tampil pada benda baru"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "kayu",
        "labelKey": "i-kayu",
        "bin": "pilihan",
        "emoji": "🪵",
        "scale": 1.3
      },
      {
        "id": "batu",
        "labelKey": "i-batu",
        "bin": "pilihan",
        "emoji": "🪨"
      },
      {
        "id": "daun",
        "labelKey": "i-daun",
        "bin": "pilihan",
        "emoji": "🍃"
      },
      {
        "id": "paku",
        "labelKey": "i-paku",
        "bin": "pilihan",
        "emoji": "🔩"
      },
      {
        "id": "bola",
        "labelKey": "i-bola",
        "bin": "pilihan",
        "emoji": "🏐"
      },
      {
        "id": "kunci",
        "labelKey": "i-kunci",
        "bin": "pilihan",
        "emoji": "🔑"
      }
    ],
    "pilihan": [
      {
        "id": "t1",
        "promptKey": "t-t1",
        "choices": [
          "batu",
          "kayu",
          "daun"
        ],
        "correct": "batu"
      },
      {
        "id": "a1",
        "promptKey": "t-a1",
        "choices": [
          "paku",
          "daun",
          "kunci"
        ],
        "correct": "daun"
      },
      {
        "id": "t2",
        "promptKey": "t-t2",
        "choices": [
          "bola",
          "paku",
          "kayu"
        ],
        "correct": "paku"
      },
      {
        "id": "a2",
        "promptKey": "t-a2",
        "choices": [
          "kunci",
          "batu",
          "kayu"
        ],
        "correct": "kayu"
      },
      {
        "id": "t3",
        "promptKey": "t-t3",
        "choices": [
          "daun",
          "kunci",
          "bola"
        ],
        "correct": "kunci"
      }
    ]
  },
  {
    "id": "sains-payung-atau-topi",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.SIANG-MALAM-CUACA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Payung atau Topi?",
        "instruksi": "Lihat langitnya, lalu sentuh benda yang harus dibawa robot keluar rumah.",
        "pilihan": "pilihan",
        "i-payung": "payung",
        "i-topi": "topi",
        "i-layang": "layang-layang",
        "t-cerah1": "Langit cerah, matahari terik. Mana yang dipakai?",
        "t-hujan1": "Langit gelap, hujan turun. Mana yang dipakai?",
        "t-cerah2": "Matahari bersinar terang. Mana yang dipakai?",
        "t-hujan2": "Tetes hujan jatuh dari langit. Mana yang dipakai?",
        "t-angin": "Angin bertiup kencang, daun beterbangan. Mana yang dimainkan?"
      },
      "en": {
        "judul": "Umbrella or Hat?",
        "instruksi": "Look at the sky, then touch what robot should take before going out.",
        "pilihan": "choices",
        "i-payung": "umbrella",
        "i-topi": "sun hat",
        "i-layang": "kite",
        "t-cerah1": "Sunny sky, the sun is hot. Which one do we use?",
        "t-hujan1": "Dark sky, the rain is falling. Which one do we use?",
        "t-cerah2": "The sun is shining bright. Which one do we use?",
        "t-hujan2": "Raindrops are falling from the sky. Which one do we use?",
        "t-angin": "The wind is blowing hard, leaves are flying. Which one do we play with?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah pilihan: 2 (payung, topi) → 3 (tambah layang-layang untuk langit berangin)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "payung",
        "labelKey": "i-payung",
        "bin": "pilihan",
        "emoji": "☂️"
      },
      {
        "id": "topi",
        "labelKey": "i-topi",
        "bin": "pilihan",
        "emoji": "👒"
      },
      {
        "id": "layang",
        "labelKey": "i-layang",
        "bin": "pilihan",
        "emoji": "🪁"
      }
    ],
    "pilihan": [
      {
        "id": "cerah1",
        "promptKey": "t-cerah1",
        "choices": [
          "topi",
          "payung"
        ],
        "correct": "topi"
      },
      {
        "id": "hujan1",
        "promptKey": "t-hujan1",
        "choices": [
          "payung",
          "topi"
        ],
        "correct": "payung"
      },
      {
        "id": "cerah2",
        "promptKey": "t-cerah2",
        "choices": [
          "payung",
          "topi",
          "layang"
        ],
        "correct": "topi"
      },
      {
        "id": "hujan2",
        "promptKey": "t-hujan2",
        "choices": [
          "topi",
          "payung",
          "layang"
        ],
        "correct": "payung"
      },
      {
        "id": "angin",
        "promptKey": "t-angin",
        "choices": [
          "layang",
          "payung",
          "topi"
        ],
        "correct": "layang"
      }
    ]
  },
  {
    "id": "sains-pilih-bahan-bangun-rumah",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.BAHAN.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pilih Bahan untuk Rumah Kecil",
        "instruksi": "Robot membangun rumah kecil: dengarkan bendanya, lalu sentuh bahan yang paling cocok.",
        "pilihan": "pilihan",
        "i-kayu": "kayu",
        "i-logam": "logam",
        "i-plastik": "plastik",
        "i-kaca": "kaca",
        "t-jendela": "Jendela supaya cahaya masuk. Bahan apa?",
        "t-kursi": "Kursi untuk duduk yang kuat dan nyaman. Bahan apa?",
        "t-paku": "Paku supaya papan tidak lepas. Bahan apa?",
        "t-botol": "Botol minum yang ringan dan tidak pecah. Bahan apa?",
        "t-pintu": "Pintu rumah yang kokoh. Bahan apa?"
      },
      "en": {
        "judul": "Pick Materials for the Little House",
        "instruksi": "Robot builds a little house: listen to the object, then touch the best material for it.",
        "pilihan": "choices",
        "i-kayu": "wood",
        "i-logam": "metal",
        "i-plastik": "plastic",
        "i-kaca": "glass",
        "t-jendela": "A window to let light in. Which material?",
        "t-kursi": "A strong, comfy chair to sit on. Which material?",
        "t-paku": "A nail to hold the boards. Which material?",
        "t-botol": "A light drinking bottle that won't break. Which material?",
        "t-pintu": "A sturdy front door. Which material?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 4,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah bahan pilihan per pertanyaan: 3 → 4; benda dengan dua bahan sah (ember) tidak dipakai"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "kayu",
        "labelKey": "i-kayu",
        "bin": "pilihan",
        "emoji": "🪵",
        "color": "#d7ccc8"
      },
      {
        "id": "logam",
        "labelKey": "i-logam",
        "bin": "pilihan",
        "emoji": "🔩",
        "color": "#cfd8dc"
      },
      {
        "id": "plastik",
        "labelKey": "i-plastik",
        "bin": "pilihan",
        "emoji": "🧴",
        "color": "#ffe0b2"
      },
      {
        "id": "kaca",
        "labelKey": "i-kaca",
        "bin": "pilihan",
        "emoji": "🥛",
        "color": "#e1f5fe"
      }
    ],
    "pilihan": [
      {
        "id": "jendela",
        "promptKey": "t-jendela",
        "choices": [
          "kaca",
          "kayu",
          "logam",
          "plastik"
        ],
        "correct": "kaca"
      },
      {
        "id": "kursi",
        "promptKey": "t-kursi",
        "choices": [
          "kayu",
          "kaca",
          "plastik",
          "logam"
        ],
        "correct": "kayu"
      },
      {
        "id": "paku",
        "promptKey": "t-paku",
        "choices": [
          "logam",
          "plastik",
          "kayu",
          "kaca"
        ],
        "correct": "logam"
      },
      {
        "id": "botol",
        "promptKey": "t-botol",
        "choices": [
          "plastik",
          "kaca",
          "logam",
          "kayu"
        ],
        "correct": "plastik"
      },
      {
        "id": "pintu",
        "promptKey": "t-pintu",
        "choices": [
          "kayu",
          "kaca",
          "plastik"
        ],
        "correct": "kayu"
      }
    ]
  },
  {
    "id": "sains-piring-sehari-hari",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.MAKANAN-SEHAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Piring Sehari-hari, Toples Sesekali",
        "instruksi": "Taruh makanan sehari-hari ke piring, dan makanan sesekali ke toples.",
        "piring": "piring sehari-hari",
        "toples": "toples sesekali",
        "kadang": "kadang-kadang",
        "i-pisang": "pisang",
        "i-wortel": "wortel",
        "i-nasi": "nasi",
        "i-telur": "telur",
        "i-ikan": "ikan",
        "i-susu": "susu",
        "i-air": "air putih",
        "i-permen": "permen",
        "i-keripik": "keripik",
        "i-soda": "soda",
        "i-kuekrim": "kue krim",
        "i-rotimanis": "roti manis",
        "i-wafel": "wafel"
      },
      "en": {
        "judul": "Everyday Plate, Sometimes Jar",
        "instruksi": "Put everyday food on the plate and once-in-a-while treats in the jar.",
        "piring": "everyday plate",
        "toples": "once-in-a-while jar",
        "kadang": "sometimes",
        "i-pisang": "banana",
        "i-wortel": "carrot",
        "i-nasi": "rice",
        "i-telur": "egg",
        "i-ikan": "fish",
        "i-susu": "milk",
        "i-air": "water",
        "i-permen": "candy",
        "i-keripik": "crisps",
        "i-soda": "fizzy drink",
        "i-kuekrim": "cream cake",
        "i-rotimanis": "sweet bun",
        "i-wafel": "waffle"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah wadah: 2 → 3 (tambah 'kadang-kadang' untuk roti manis)"
      },
      "itemCount": {
        "min": 4,
        "max": 10,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah makanan per putaran; buah selalu utuh, bukan jus kemasan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "piring",
        "labelKey": "piring",
        "emoji": "🍽️",
        "color": "#c8e6c9"
      },
      {
        "id": "toples",
        "labelKey": "toples",
        "emoji": "🫙",
        "color": "#ffe0b2"
      },
      {
        "id": "kadang",
        "labelKey": "kadang",
        "emoji": "🧺",
        "color": "#fff9c4"
      }
    ],
    "items": [
      {
        "id": "pisang",
        "labelKey": "i-pisang",
        "bin": "piring",
        "emoji": "🍌"
      },
      {
        "id": "wortel",
        "labelKey": "i-wortel",
        "bin": "piring",
        "emoji": "🥕"
      },
      {
        "id": "nasi",
        "labelKey": "i-nasi",
        "bin": "piring",
        "emoji": "🍚"
      },
      {
        "id": "telur",
        "labelKey": "i-telur",
        "bin": "piring",
        "emoji": "🍳"
      },
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "piring",
        "emoji": "🐟"
      },
      {
        "id": "susu",
        "labelKey": "i-susu",
        "bin": "piring",
        "emoji": "🥛"
      },
      {
        "id": "air",
        "labelKey": "i-air",
        "bin": "piring",
        "emoji": "💧"
      },
      {
        "id": "permen",
        "labelKey": "i-permen",
        "bin": "toples",
        "emoji": "🍬"
      },
      {
        "id": "keripik",
        "labelKey": "i-keripik",
        "bin": "toples",
        "emoji": "🍟"
      },
      {
        "id": "soda",
        "labelKey": "i-soda",
        "bin": "toples",
        "emoji": "🥤"
      },
      {
        "id": "kuekrim",
        "labelKey": "i-kuekrim",
        "bin": "toples",
        "emoji": "🍰"
      },
      {
        "id": "rotimanis",
        "labelKey": "i-rotimanis",
        "bin": "kadang",
        "emoji": "🥐"
      },
      {
        "id": "wafel",
        "labelKey": "i-wafel",
        "bin": "kadang",
        "emoji": "🧇"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-pot-di-kebun",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.KEBUTUHAN-TUMBUHAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rawat Pot di Kebun",
        "instruksi": "Robot merawat bibit: beri yang dibutuhkan ke pot, singkirkan yang tidak perlu.",
        "pot": "pot tanaman (perlu)",
        "tidak": "tidak perlu",
        "i-siram": "air siraman",
        "i-matahari": "sinar matahari",
        "i-tanah": "tanah gembur",
        "i-angin": "udara segar",
        "i-bola": "bola",
        "i-roti": "roti",
        "i-sepatu": "sepatu",
        "i-buku": "buku",
        "i-eskrim": "es krim"
      },
      "en": {
        "judul": "Caring for the Garden Pot",
        "instruksi": "Robot cares for a seedling: give the pot what it needs, set aside what it doesn't.",
        "pot": "plant pot (needed)",
        "tidak": "not needed",
        "i-siram": "watering can",
        "i-matahari": "sunshine",
        "i-tanah": "loose soil",
        "i-angin": "fresh air",
        "i-bola": "ball",
        "i-roti": "bread",
        "i-sepatu": "shoes",
        "i-buku": "book",
        "i-eskrim": "ice cream"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah kartu per putaran; roti dan sepatu pengecoh di 8 kartu"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "bins": [
      {
        "id": "pot",
        "labelKey": "pot",
        "emoji": "🪴",
        "color": "#c8e6c9"
      },
      {
        "id": "tidak",
        "labelKey": "tidak",
        "emoji": "🧺",
        "color": "#eeeeee"
      }
    ],
    "items": [
      {
        "id": "siram",
        "labelKey": "i-siram",
        "bin": "pot",
        "emoji": "🚿"
      },
      {
        "id": "matahari",
        "labelKey": "i-matahari",
        "bin": "pot",
        "emoji": "🔆"
      },
      {
        "id": "tanah",
        "labelKey": "i-tanah",
        "bin": "pot",
        "shape": "square",
        "color": "#5d4037"
      },
      {
        "id": "angin",
        "labelKey": "i-angin",
        "bin": "pot",
        "emoji": "💨"
      },
      {
        "id": "bola",
        "labelKey": "i-bola",
        "bin": "tidak",
        "emoji": "⚽"
      },
      {
        "id": "roti",
        "labelKey": "i-roti",
        "bin": "tidak",
        "emoji": "🍞"
      },
      {
        "id": "sepatu",
        "labelKey": "i-sepatu",
        "bin": "tidak",
        "emoji": "👟"
      },
      {
        "id": "buku",
        "labelKey": "i-buku",
        "bin": "tidak",
        "emoji": "📚"
      },
      {
        "id": "eskrim",
        "labelKey": "i-eskrim",
        "bin": "tidak",
        "emoji": "🍦"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-pot-mana-yang-layu",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.KEBUTUHAN-TUMBUHAN.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pot Mana yang Akan Layu?",
        "instruksi": "Dengarkan di mana tiap pot disimpan, lalu tebak pot yang akan layu sebelum hari berganti.",
        "pilihan": "pilihan",
        "i-jendela": "pot di jendela terang",
        "i-teras": "pot di teras",
        "i-lemari": "pot di lemari gelap",
        "i-kotak": "pot di dalam kotak tertutup",
        "t-r1": "Satu pot ditaruh di jendela, satu di lemari gelap. Pot mana yang akan layu?",
        "t-r2": "Pot di jendela, pot di teras, dan pot di kotak tertutup. Mana yang akan layu?",
        "t-r3": "Semua disiram, tapi satu tak kena cahaya. Mana yang akan layu?",
        "t-r4": "Mana pot yang akan layu karena gelap?"
      },
      "en": {
        "judul": "Which Pot Will Wilt?",
        "instruksi": "Listen to where each pot is kept, then guess which one will wilt before tomorrow.",
        "pilihan": "choices",
        "i-jendela": "pot by the bright window",
        "i-teras": "pot on the porch",
        "i-lemari": "pot in the dark cupboard",
        "i-kotak": "pot inside a closed box",
        "t-r1": "One pot is by the window, one in a dark cupboard. Which will wilt?",
        "t-r2": "A pot by the window, one on the porch, one in a closed box. Which will wilt?",
        "t-r3": "All were watered, but one gets no light. Which will wilt?",
        "t-r4": "Which pot will wilt because it is dark?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah pot per tebakan: 2 → 4; latar pot menunjukkan terang/gelap"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "jendela",
        "labelKey": "i-jendela",
        "bin": "pilihan",
        "emoji": "🪴",
        "color": "#fff59d"
      },
      {
        "id": "teras",
        "labelKey": "i-teras",
        "bin": "pilihan",
        "emoji": "🪴",
        "color": "#c8e6c9"
      },
      {
        "id": "lemari",
        "labelKey": "i-lemari",
        "bin": "pilihan",
        "emoji": "🪴",
        "color": "#263238"
      },
      {
        "id": "kotak",
        "labelKey": "i-kotak",
        "bin": "pilihan",
        "emoji": "📦",
        "color": "#4e342e"
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "t-r1",
        "choices": [
          "jendela",
          "lemari"
        ],
        "correct": "lemari"
      },
      {
        "id": "r2",
        "promptKey": "t-r2",
        "choices": [
          "jendela",
          "kotak",
          "teras"
        ],
        "correct": "kotak"
      },
      {
        "id": "r3",
        "promptKey": "t-r3",
        "choices": [
          "teras",
          "lemari",
          "jendela"
        ],
        "correct": "lemari"
      },
      {
        "id": "r4",
        "promptKey": "t-r4",
        "choices": [
          "kotak",
          "teras",
          "jendela",
          "lemari"
        ],
        "correct": "kotak"
      }
    ]
  },
  {
    "id": "sains-rak-bahan-dapur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.BAHAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Rak Bahan di Dapur",
        "instruksi": "Taruh tiap benda ke rak bahannya: kayu, logam, plastik, atau kaca.",
        "kayu": "kayu",
        "logam": "logam",
        "plastik": "plastik",
        "kaca": "kaca",
        "i-sendokkayu": "sendok kayu",
        "i-talenan": "talenan kayu",
        "i-kaleng": "kaleng",
        "i-panci": "panci",
        "i-botolplastik": "botol plastik",
        "i-sedotan": "sedotan plastik",
        "i-gelaskaca": "gelas kaca",
        "i-toples": "toples kaca"
      },
      "en": {
        "judul": "Kitchen Material Shelves",
        "instruksi": "Put each object on its material shelf: wood, metal, plastic, or glass.",
        "kayu": "wood",
        "logam": "metal",
        "plastik": "plastic",
        "kaca": "glass",
        "i-sendokkayu": "wooden spoon",
        "i-talenan": "wooden cutting board",
        "i-kaleng": "tin can",
        "i-panci": "metal pot",
        "i-botolplastik": "plastic bottle",
        "i-sedotan": "plastic straw",
        "i-gelaskaca": "glass cup",
        "i-toples": "glass jar"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah rak: 2 (kayu, logam) → 4 (tambah plastik, kaca)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 2,
        "keterangan": "jumlah benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "kayu",
        "labelKey": "kayu",
        "emoji": "🪵",
        "color": "#d7ccc8"
      },
      {
        "id": "logam",
        "labelKey": "logam",
        "emoji": "🔩",
        "color": "#cfd8dc"
      },
      {
        "id": "plastik",
        "labelKey": "plastik",
        "emoji": "🧴",
        "color": "#ffe0b2"
      },
      {
        "id": "kaca",
        "labelKey": "kaca",
        "emoji": "🥛",
        "color": "#e1f5fe"
      }
    ],
    "items": [
      {
        "id": "sendokkayu",
        "labelKey": "i-sendokkayu",
        "bin": "kayu",
        "emoji": "🥄",
        "color": "#d7ccc8"
      },
      {
        "id": "talenan",
        "labelKey": "i-talenan",
        "bin": "kayu",
        "emoji": "🪵"
      },
      {
        "id": "kaleng",
        "labelKey": "i-kaleng",
        "bin": "logam",
        "emoji": "🥫"
      },
      {
        "id": "panci",
        "labelKey": "i-panci",
        "bin": "logam",
        "emoji": "🍳"
      },
      {
        "id": "botolplastik",
        "labelKey": "i-botolplastik",
        "bin": "plastik",
        "emoji": "🧴"
      },
      {
        "id": "sedotan",
        "labelKey": "i-sedotan",
        "bin": "plastik",
        "emoji": "🥤"
      },
      {
        "id": "gelaskaca",
        "labelKey": "i-gelaskaca",
        "bin": "kaca",
        "emoji": "🥛"
      },
      {
        "id": "toples",
        "labelKey": "i-toples",
        "bin": "kaca",
        "emoji": "🫙"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-rak-bahan-halaman",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.BAHAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bahan Benda di Halaman",
        "instruksi": "Robot merapikan halaman: taruh tiap benda ke rak bahan kayu, logam, plastik, atau kaca.",
        "kayu": "kayu",
        "logam": "logam",
        "plastik": "plastik",
        "kaca": "kaca",
        "i-kursi": "kursi kayu",
        "i-pagar": "pagar kayu",
        "i-kunci": "kunci",
        "i-paku": "paku",
        "i-ember": "ember plastik",
        "i-mainan": "mainan plastik",
        "i-jendela": "kaca jendela",
        "i-botolkaca": "botol kaca"
      },
      "en": {
        "judul": "Materials in the Yard",
        "instruksi": "Robot tidies the yard: put each object on the wood, metal, plastic, or glass shelf.",
        "kayu": "wood",
        "logam": "metal",
        "plastik": "plastic",
        "kaca": "glass",
        "i-kursi": "wooden chair",
        "i-pagar": "wooden fence",
        "i-kunci": "key",
        "i-paku": "nail",
        "i-ember": "plastic bucket",
        "i-mainan": "plastic toy",
        "i-jendela": "window glass",
        "i-botolkaca": "glass bottle"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah rak: 2 → 4"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 2,
        "keterangan": "jumlah benda per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "kayu",
        "labelKey": "kayu",
        "emoji": "🪵",
        "color": "#d7ccc8"
      },
      {
        "id": "logam",
        "labelKey": "logam",
        "emoji": "🔩",
        "color": "#cfd8dc"
      },
      {
        "id": "plastik",
        "labelKey": "plastik",
        "emoji": "🧴",
        "color": "#ffe0b2"
      },
      {
        "id": "kaca",
        "labelKey": "kaca",
        "emoji": "🥛",
        "color": "#e1f5fe"
      }
    ],
    "items": [
      {
        "id": "kursi",
        "labelKey": "i-kursi",
        "bin": "kayu",
        "emoji": "🪑"
      },
      {
        "id": "pagar",
        "labelKey": "i-pagar",
        "bin": "kayu",
        "emoji": "🪵",
        "scale": 1.2
      },
      {
        "id": "kunci",
        "labelKey": "i-kunci",
        "bin": "logam",
        "emoji": "🔑"
      },
      {
        "id": "paku",
        "labelKey": "i-paku",
        "bin": "logam",
        "emoji": "🔩"
      },
      {
        "id": "ember",
        "labelKey": "i-ember",
        "bin": "plastik",
        "emoji": "🪣"
      },
      {
        "id": "mainan",
        "labelKey": "i-mainan",
        "bin": "plastik",
        "emoji": "🪀"
      },
      {
        "id": "jendela",
        "labelKey": "i-jendela",
        "bin": "kaca",
        "emoji": "🪟"
      },
      {
        "id": "botolkaca",
        "labelKey": "i-botolkaca",
        "bin": "kaca",
        "emoji": "🍾"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-rak-sayur-bagian-tumbuhan",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.BAGIAN-TUMBUHAN.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Sayur dari Bagian Mana?",
        "instruksi": "Taruh tiap sayur ke rak bagian tumbuhan asalnya: wortel ke akar, bayam ke daun.",
        "akar": "akar",
        "batang": "batang",
        "daun": "daun",
        "bunga": "bunga",
        "i-wortel": "wortel",
        "i-ubi": "ubi jalar",
        "i-lobak": "lobak putih",
        "i-tebu": "tebu",
        "i-rebung": "rebung bambu",
        "i-bayam": "bayam",
        "i-selada": "selada",
        "i-kangkung": "kangkung",
        "i-brokoli": "brokoli",
        "i-kembangkol": "kembang kol"
      },
      "en": {
        "judul": "Which Part Is the Veggie?",
        "instruksi": "Put each vegetable on the shelf of the plant part it comes from: carrot to root, spinach to leaf.",
        "akar": "root",
        "batang": "stem",
        "daun": "leaf",
        "bunga": "flower",
        "i-wortel": "carrot",
        "i-ubi": "sweet potato",
        "i-lobak": "white radish",
        "i-tebu": "sugar cane",
        "i-rebung": "bamboo shoot",
        "i-bayam": "spinach",
        "i-selada": "lettuce",
        "i-kangkung": "water spinach",
        "i-brokoli": "broccoli",
        "i-kembangkol": "cauliflower"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah rak: 2 (akar, daun) → 4 (tambah batang, bunga)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 2,
        "keterangan": "jumlah sayur per putaran; kentang dan bawang sengaja tidak dipakai"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "bins": [
      {
        "id": "akar",
        "labelKey": "akar",
        "emoji": "🫚",
        "color": "#8d6e63"
      },
      {
        "id": "batang",
        "labelKey": "batang",
        "emoji": "🎋"
      },
      {
        "id": "daun",
        "labelKey": "daun",
        "emoji": "🍃"
      },
      {
        "id": "bunga",
        "labelKey": "bunga",
        "emoji": "🌸"
      }
    ],
    "items": [
      {
        "id": "wortel",
        "labelKey": "i-wortel",
        "bin": "akar",
        "emoji": "🥕"
      },
      {
        "id": "ubi",
        "labelKey": "i-ubi",
        "bin": "akar",
        "emoji": "🍠"
      },
      {
        "id": "lobak",
        "labelKey": "i-lobak",
        "bin": "akar",
        "emoji": "🥕",
        "color": "#f5f5f5"
      },
      {
        "id": "tebu",
        "labelKey": "i-tebu",
        "bin": "batang",
        "emoji": "🎋"
      },
      {
        "id": "rebung",
        "labelKey": "i-rebung",
        "bin": "batang",
        "emoji": "🎍"
      },
      {
        "id": "bayam",
        "labelKey": "i-bayam",
        "bin": "daun",
        "emoji": "🌿"
      },
      {
        "id": "selada",
        "labelKey": "i-selada",
        "bin": "daun",
        "emoji": "🥬"
      },
      {
        "id": "kangkung",
        "labelKey": "i-kangkung",
        "bin": "daun",
        "emoji": "☘️"
      },
      {
        "id": "brokoli",
        "labelKey": "i-brokoli",
        "bin": "bunga",
        "emoji": "🥦"
      },
      {
        "id": "kembangkol",
        "labelKey": "i-kembangkol",
        "bin": "bunga",
        "emoji": "🥦",
        "color": "#fff8e1"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-siang-malam-di-kebun",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.SIANG-MALAM-CUACA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kebun Siang dan Malam",
        "instruksi": "Robot menata foto kebun: taruh yang terjadi siang ke matahari, yang malam ke bulan.",
        "siang": "siang",
        "malam": "malam",
        "i-jemur": "menjemur baju",
        "i-kupu": "kupu-kupu di bunga",
        "i-siram": "menyiram tanaman pagi",
        "i-kacamata": "pakai kacamata hitam",
        "i-kunang": "kunang-kunang menyala",
        "i-lampu": "lampu teras menyala",
        "i-piyama": "pakai piyama",
        "i-kelelawar": "kelelawar terbang"
      },
      "en": {
        "judul": "The Garden by Day and Night",
        "instruksi": "Robot sorts garden photos: day things go to the sun, night things to the moon.",
        "siang": "day",
        "malam": "night",
        "i-jemur": "hanging laundry in the sun",
        "i-kupu": "butterfly on a flower",
        "i-siram": "watering plants in the morning",
        "i-kacamata": "wearing sunglasses",
        "i-kunang": "glowing fireflies",
        "i-lampu": "porch lamp on",
        "i-piyama": "putting on pyjamas",
        "i-kelelawar": "bats flying"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah gambar per putaran; hindari kegiatan yang bisa siang atau malam"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "kelompok",
    "bins": [
      {
        "id": "siang",
        "labelKey": "siang",
        "emoji": "☀️",
        "color": "#bbdefb"
      },
      {
        "id": "malam",
        "labelKey": "malam",
        "emoji": "🌙",
        "color": "#1a237e"
      }
    ],
    "items": [
      {
        "id": "jemur",
        "labelKey": "i-jemur",
        "bin": "siang",
        "emoji": "🧺"
      },
      {
        "id": "kupu",
        "labelKey": "i-kupu",
        "bin": "siang",
        "emoji": "🦋"
      },
      {
        "id": "siram",
        "labelKey": "i-siram",
        "bin": "siang",
        "emoji": "🚿"
      },
      {
        "id": "kacamata",
        "labelKey": "i-kacamata",
        "bin": "siang",
        "emoji": "🕶️"
      },
      {
        "id": "kunang",
        "labelKey": "i-kunang",
        "bin": "malam",
        "emoji": "✨"
      },
      {
        "id": "lampu",
        "labelKey": "i-lampu",
        "bin": "malam",
        "emoji": "🏮"
      },
      {
        "id": "piyama",
        "labelKey": "i-piyama",
        "bin": "malam",
        "emoji": "🥱"
      },
      {
        "id": "kelelawar",
        "labelKey": "i-kelelawar",
        "bin": "malam",
        "emoji": "🦇"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-siapa-yang-bekerja",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKB.TULANG-OTOT-ORGAN.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Siapa yang Bekerja?",
        "instruksi": "Taruh kartu kegiatan ke bagian tubuh yang paling bekerja: lari ke otot kaki, bernapas ke paru-paru.",
        "kaki": "otot kaki",
        "paru": "paru-paru",
        "lengan": "otot lengan",
        "otak": "otak",
        "i-lari": "lari",
        "i-tendang": "menendang bola",
        "i-napas": "tarik napas dalam",
        "i-balon": "meniup balon",
        "i-tas": "mengangkat tas",
        "i-beban": "mengangkat beban",
        "i-baca": "membaca buku",
        "i-puzel": "memikirkan puzel"
      },
      "en": {
        "judul": "Which Part Is Working?",
        "instruksi": "Put each activity card on the body part doing the work: running to leg muscles, breathing to lungs.",
        "kaki": "leg muscles",
        "paru": "lungs",
        "lengan": "arm muscles",
        "otak": "brain",
        "i-lari": "running",
        "i-tendang": "kicking a ball",
        "i-napas": "taking a deep breath",
        "i-balon": "blowing up a balloon",
        "i-tas": "lifting a bag",
        "i-beban": "lifting weights",
        "i-baca": "reading a book",
        "i-puzel": "solving a puzzle"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah bagian tubuh: 2 (otot kaki, paru-paru) → 4 (tambah otot lengan, otak)"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 6,
        "step": 2,
        "keterangan": "jumlah kartu kegiatan per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "klinik",
    "mode": "kelompok",
    "bins": [
      {
        "id": "kaki",
        "labelKey": "kaki",
        "emoji": "🦵"
      },
      {
        "id": "paru",
        "labelKey": "paru",
        "emoji": "🫁"
      },
      {
        "id": "lengan",
        "labelKey": "lengan",
        "emoji": "💪"
      },
      {
        "id": "otak",
        "labelKey": "otak",
        "emoji": "🧠"
      }
    ],
    "items": [
      {
        "id": "lari",
        "labelKey": "i-lari",
        "bin": "kaki",
        "emoji": "🏃"
      },
      {
        "id": "tendang",
        "labelKey": "i-tendang",
        "bin": "kaki",
        "emoji": "⚽"
      },
      {
        "id": "napas",
        "labelKey": "i-napas",
        "bin": "paru",
        "emoji": "🌬️"
      },
      {
        "id": "balon",
        "labelKey": "i-balon",
        "bin": "paru",
        "emoji": "🎈"
      },
      {
        "id": "tas",
        "labelKey": "i-tas",
        "bin": "lengan",
        "emoji": "🎒"
      },
      {
        "id": "beban",
        "labelKey": "i-beban",
        "bin": "lengan",
        "emoji": "🏋️"
      },
      {
        "id": "baca",
        "labelKey": "i-baca",
        "bin": "otak",
        "emoji": "📖"
      },
      {
        "id": "puzel",
        "labelKey": "i-puzel",
        "bin": "otak",
        "emoji": "🧩"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-siapa-yang-bersuara",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.PAUD.HEWAN-SUARA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Siapa yang Bersuara?",
        "instruksi": "Dengarkan suaranya, lalu sentuh hewan yang bersuara begitu.",
        "pilihan": "pilihan",
        "i-kucing": "kucing",
        "i-ayam": "ayam jago",
        "i-sapi": "sapi",
        "i-kambing": "kambing",
        "i-bebek": "bebek",
        "i-burung": "burung",
        "t-meong": "Siapa yang bilang meong?",
        "t-kukuruyuk": "Siapa yang bilang kukuruyuk?",
        "t-moo": "Siapa yang bilang mooo?",
        "t-kwek": "Siapa yang bilang kwek kwek?",
        "t-mbee": "Siapa yang bilang mbeee?",
        "t-cicit": "Siapa yang bilang cit cit cuit?"
      },
      "en": {
        "judul": "Who Made That Sound?",
        "instruksi": "Listen to the sound, then touch the animal that makes it.",
        "pilihan": "choices",
        "i-kucing": "cat",
        "i-ayam": "rooster",
        "i-sapi": "cow",
        "i-kambing": "goat",
        "i-bebek": "duck",
        "i-burung": "bird",
        "t-meong": "Who says meow?",
        "t-kukuruyuk": "Who says cock-a-doodle-doo?",
        "t-moo": "Who says moo?",
        "t-kwek": "Who says quack quack?",
        "t-mbee": "Who says baa?",
        "t-cicit": "Who says tweet tweet?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah hewan per pertanyaan; di 5–6 hewan suara mirip (kambing vs sapi) tampil bersama"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "kucing",
        "labelKey": "i-kucing",
        "bin": "pilihan",
        "emoji": "🐱"
      },
      {
        "id": "ayam",
        "labelKey": "i-ayam",
        "bin": "pilihan",
        "emoji": "🐓"
      },
      {
        "id": "sapi",
        "labelKey": "i-sapi",
        "bin": "pilihan",
        "emoji": "🐄",
        "scale": 1.3
      },
      {
        "id": "kambing",
        "labelKey": "i-kambing",
        "bin": "pilihan",
        "emoji": "🐐"
      },
      {
        "id": "bebek",
        "labelKey": "i-bebek",
        "bin": "pilihan",
        "emoji": "🦆"
      },
      {
        "id": "burung",
        "labelKey": "i-burung",
        "bin": "pilihan",
        "emoji": "🐦",
        "scale": 0.8
      }
    ],
    "pilihan": [
      {
        "id": "meong",
        "promptKey": "t-meong",
        "choices": [
          "kucing",
          "bebek",
          "ayam",
          "sapi"
        ],
        "correct": "kucing"
      },
      {
        "id": "kukuruyuk",
        "promptKey": "t-kukuruyuk",
        "choices": [
          "ayam",
          "kucing",
          "kambing",
          "burung"
        ],
        "correct": "ayam"
      },
      {
        "id": "moo",
        "promptKey": "t-moo",
        "choices": [
          "sapi",
          "bebek",
          "kucing",
          "burung"
        ],
        "correct": "sapi"
      },
      {
        "id": "kwek",
        "promptKey": "t-kwek",
        "choices": [
          "bebek",
          "ayam",
          "sapi",
          "kucing"
        ],
        "correct": "bebek"
      },
      {
        "id": "mbee",
        "promptKey": "t-mbee",
        "choices": [
          "kambing",
          "sapi",
          "bebek",
          "burung"
        ],
        "correct": "kambing"
      },
      {
        "id": "cicit",
        "promptKey": "t-cicit",
        "choices": [
          "burung",
          "ayam",
          "kucing",
          "kambing"
        ],
        "correct": "burung"
      }
    ]
  },
  {
    "id": "sains-sirip-sayap-kaki",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.HEWAN-DARAT-AIR-UDARA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Sirip, Sayap, atau Kaki?",
        "instruksi": "Lihat tubuh hewannya: taruh ke rak sirip, sayap, atau kaki sesuai cara geraknya.",
        "sirip": "sirip",
        "sayap": "sayap",
        "kaki": "kaki",
        "i-ikan": "ikan",
        "i-hiu": "hiu",
        "i-lumba": "lumba-lumba",
        "i-kupu": "kupu-kupu",
        "i-lebah": "lebah",
        "i-kelelawar": "kelelawar",
        "i-kucing": "kucing",
        "i-sapi": "sapi",
        "i-gajah": "gajah",
        "i-burung": "burung terbang"
      },
      "en": {
        "judul": "Fins, Wings, or Legs?",
        "instruksi": "Look at the animal's body: put it on the fins, wings, or legs shelf by how it moves.",
        "sirip": "fins",
        "sayap": "wings",
        "kaki": "legs",
        "i-ikan": "fish",
        "i-hiu": "shark",
        "i-lumba": "dolphin",
        "i-kupu": "butterfly",
        "i-lebah": "bee",
        "i-kelelawar": "bat",
        "i-kucing": "cat",
        "i-sapi": "cow",
        "i-gajah": "elephant",
        "i-burung": "flying bird"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah rak: 2 (sirip, kaki) → 3 (tambah sayap)"
      },
      "itemCount": {
        "min": 4,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah hewan per putaran; burung (sayap dan kaki) baru muncul di 8–9 hewan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "kelompok",
    "bins": [
      {
        "id": "sirip",
        "labelKey": "sirip",
        "emoji": "🐟"
      },
      {
        "id": "sayap",
        "labelKey": "sayap",
        "emoji": "🪶"
      },
      {
        "id": "kaki",
        "labelKey": "kaki",
        "emoji": "🐾"
      }
    ],
    "items": [
      {
        "id": "ikan",
        "labelKey": "i-ikan",
        "bin": "sirip",
        "emoji": "🐠"
      },
      {
        "id": "hiu",
        "labelKey": "i-hiu",
        "bin": "sirip",
        "emoji": "🦈"
      },
      {
        "id": "lumba",
        "labelKey": "i-lumba",
        "bin": "sirip",
        "emoji": "🐬"
      },
      {
        "id": "kupu",
        "labelKey": "i-kupu",
        "bin": "sayap",
        "emoji": "🦋"
      },
      {
        "id": "lebah",
        "labelKey": "i-lebah",
        "bin": "sayap",
        "emoji": "🐝"
      },
      {
        "id": "kelelawar",
        "labelKey": "i-kelelawar",
        "bin": "sayap",
        "emoji": "🦇"
      },
      {
        "id": "kucing",
        "labelKey": "i-kucing",
        "bin": "kaki",
        "emoji": "🐈"
      },
      {
        "id": "sapi",
        "labelKey": "i-sapi",
        "bin": "kaki",
        "emoji": "🐄"
      },
      {
        "id": "gajah",
        "labelKey": "i-gajah",
        "bin": "kaki",
        "emoji": "🐘"
      },
      {
        "id": "burung",
        "labelKey": "i-burung",
        "bin": "sayap",
        "emoji": "🐦"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sains-tebak-apung-tenggelam",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "SAINS.TKA.APUNG-TENGGELAM-MAGNET.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tebak: Apung atau Tenggelam?",
        "instruksi": "Sebelum dicoba di air, tebak dulu: taruh benda ke kolom apung atau tenggelam.",
        "apung": "terapung",
        "tenggelam": "tenggelam",
        "i-bola": "bola plastik",
        "i-daun": "daun",
        "i-kayu": "balok kayu besar",
        "i-bebekkaret": "bebek karet",
        "i-gabus": "tutup gabus",
        "i-batu": "batu",
        "i-sendok": "sendok logam",
        "i-koin": "koin",
        "i-kelereng": "kelereng kecil",
        "i-kunci": "kunci"
      },
      "en": {
        "judul": "Guess: Float or Sink?",
        "instruksi": "Before we try it in water, guess first: put each thing in the float or sink column.",
        "apung": "floats",
        "tenggelam": "sinks",
        "i-bola": "plastic ball",
        "i-daun": "leaf",
        "i-kayu": "big wooden block",
        "i-bebekkaret": "rubber duck",
        "i-gabus": "cork",
        "i-batu": "stone",
        "i-sendok": "metal spoon",
        "i-koin": "coin",
        "i-kelereng": "little marble",
        "i-kunci": "key"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah benda yang ditebak per putaran; kayu besar selalu ada supaya 'besar pasti tenggelam' teruji"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kelompok",
    "bins": [
      {
        "id": "apung",
        "labelKey": "apung",
        "emoji": "🛟",
        "color": "#e1f5fe"
      },
      {
        "id": "tenggelam",
        "labelKey": "tenggelam",
        "emoji": "⬇️",
        "color": "#0d47a1"
      }
    ],
    "items": [
      {
        "id": "bola",
        "labelKey": "i-bola",
        "bin": "apung",
        "emoji": "🏐"
      },
      {
        "id": "daun",
        "labelKey": "i-daun",
        "bin": "apung",
        "emoji": "🍃"
      },
      {
        "id": "kayu",
        "labelKey": "i-kayu",
        "bin": "apung",
        "emoji": "🪵",
        "scale": 1.5
      },
      {
        "id": "bebekkaret",
        "labelKey": "i-bebekkaret",
        "bin": "apung",
        "emoji": "🦆",
        "color": "#fff176"
      },
      {
        "id": "gabus",
        "labelKey": "i-gabus",
        "bin": "apung",
        "emoji": "🍾",
        "scale": 0.7
      },
      {
        "id": "batu",
        "labelKey": "i-batu",
        "bin": "tenggelam",
        "emoji": "🪨"
      },
      {
        "id": "sendok",
        "labelKey": "i-sendok",
        "bin": "tenggelam",
        "emoji": "🥄"
      },
      {
        "id": "koin",
        "labelKey": "i-koin",
        "bin": "tenggelam",
        "emoji": "🪙"
      },
      {
        "id": "kelereng",
        "labelKey": "i-kelereng",
        "bin": "tenggelam",
        "emoji": "🔮",
        "scale": 0.6
      },
      {
        "id": "kunci",
        "labelKey": "i-kunci",
        "bin": "tenggelam",
        "emoji": "🔑"
      }
    ],
    "pilihan": []
  },
  {
    "id": "sarang-telur-selisih-satu",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKA.BANDING.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Sarang Telur: Mana Lebih Banyak?",
        "instruksi": "Dua sarang ayam hampir sama: sentuh yang telurnya lebih banyak.",
        "pilihan": "pilihan",
        "telur": "telur",
        "tBanyak": "Sarang mana yang telurnya lebih banyak?"
      },
      "en": {
        "judul": "Egg Nests: Which Has More?",
        "instruksi": "Two hen nests look alike: touch the one with more eggs.",
        "pilihan": "choices",
        "telur": "eggs",
        "tBanyak": "Which nest has more eggs?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua kelompok; selisih 1 sehingga harus dihitung atau dipasangkan; kelompok lebih sedikit sengaja digambar lebih besar"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "telur-4",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 4
      },
      {
        "id": "telur-4-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 4,
        "scale": 1.4
      },
      {
        "id": "telur-5",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 5
      },
      {
        "id": "telur-5-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 5,
        "scale": 1.4
      },
      {
        "id": "telur-6",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 6
      },
      {
        "id": "telur-6-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 6,
        "scale": 1.4
      },
      {
        "id": "telur-7",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 7
      },
      {
        "id": "telur-7-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 7,
        "scale": 1.4
      },
      {
        "id": "telur-8",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 8
      },
      {
        "id": "telur-8-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 8,
        "scale": 1.4
      },
      {
        "id": "telur-9",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 9
      },
      {
        "id": "telur-9-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 9,
        "scale": 1.4
      },
      {
        "id": "telur-10",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 10
      },
      {
        "id": "telur-10-besar",
        "labelKey": "telur",
        "bin": "pilihan",
        "emoji": "🥚",
        "count": 10,
        "scale": 1.4
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tBanyak",
        "choices": [
          "telur-4-besar",
          "telur-5"
        ],
        "correct": "telur-5"
      },
      {
        "id": "r2",
        "promptKey": "tBanyak",
        "choices": [
          "telur-6",
          "telur-5-besar"
        ],
        "correct": "telur-6"
      },
      {
        "id": "r3",
        "promptKey": "tBanyak",
        "choices": [
          "telur-6-besar",
          "telur-7"
        ],
        "correct": "telur-7"
      },
      {
        "id": "r4",
        "promptKey": "tBanyak",
        "choices": [
          "telur-8",
          "telur-7-besar"
        ],
        "correct": "telur-8"
      },
      {
        "id": "r5",
        "promptKey": "tBanyak",
        "choices": [
          "telur-8-besar",
          "telur-9"
        ],
        "correct": "telur-9"
      },
      {
        "id": "r6",
        "promptKey": "tBanyak",
        "choices": [
          "telur-10",
          "telur-9-besar"
        ],
        "correct": "telur-10"
      }
    ]
  },
  {
    "id": "stok-buah-piktogram",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKB.DATA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Stok Buah di Rak",
        "instruksi": "Lihat piktogram stok buah, lalu sentuh rak yang diminta pembeli.",
        "pilihan": "pilihan",
        "apel": "apel",
        "pisang": "pisang",
        "jeruk": "jeruk",
        "anggur": "anggur",
        "tSedikit": "Tukang antar datang. Rak mana yang paling sedikit, supaya diisi?",
        "tBanyak": "Pemborong datang. Rak mana yang paling banyak, supaya diborong?"
      },
      "en": {
        "judul": "Fruit Stock on the Shelf",
        "instruksi": "Look at the fruit stock chart, then touch the shelf the customer asks for.",
        "pilihan": "choices",
        "apel": "apples",
        "pisang": "bananas",
        "jeruk": "oranges",
        "anggur": "grapes",
        "tSedikit": "The delivery is here. Which shelf has the fewest, so we can refill it?",
        "tBanyak": "The wholesaler is here. Which shelf has the most, so they can buy it all?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah kolom piktogram yang dibandingkan; selisih antar kolom terdekat 2 → 1"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "apel-a",
        "labelKey": "apel",
        "bin": "pilihan",
        "emoji": "🍎",
        "count": 2
      },
      {
        "id": "apel-b",
        "labelKey": "apel",
        "bin": "pilihan",
        "emoji": "🍎",
        "count": 7
      },
      {
        "id": "pisang-a",
        "labelKey": "pisang",
        "bin": "pilihan",
        "emoji": "🍌",
        "count": 4
      },
      {
        "id": "pisang-b",
        "labelKey": "pisang",
        "bin": "pilihan",
        "emoji": "🍌",
        "count": 6
      },
      {
        "id": "jeruk-a",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 6
      },
      {
        "id": "jeruk-b",
        "labelKey": "jeruk",
        "bin": "pilihan",
        "emoji": "🍊",
        "count": 5
      },
      {
        "id": "anggur-a",
        "labelKey": "anggur",
        "bin": "pilihan",
        "emoji": "🍇",
        "count": 8
      },
      {
        "id": "anggur-b",
        "labelKey": "anggur",
        "bin": "pilihan",
        "emoji": "🍇",
        "count": 4
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tSedikit",
        "choices": [
          "apel-a",
          "pisang-a",
          "jeruk-a"
        ],
        "correct": "apel-a"
      },
      {
        "id": "r2",
        "promptKey": "tBanyak",
        "choices": [
          "apel-a",
          "pisang-a",
          "jeruk-a"
        ],
        "correct": "jeruk-a"
      },
      {
        "id": "r3",
        "promptKey": "tSedikit",
        "choices": [
          "pisang-a",
          "jeruk-a",
          "anggur-a"
        ],
        "correct": "pisang-a"
      },
      {
        "id": "r4",
        "promptKey": "tBanyak",
        "choices": [
          "apel-a",
          "pisang-a",
          "jeruk-a",
          "anggur-a"
        ],
        "correct": "anggur-a"
      },
      {
        "id": "r5",
        "promptKey": "tSedikit",
        "choices": [
          "apel-b",
          "pisang-b",
          "jeruk-b",
          "anggur-b"
        ],
        "correct": "anggur-b"
      },
      {
        "id": "r6",
        "promptKey": "tBanyak",
        "choices": [
          "apel-b",
          "pisang-b",
          "jeruk-b"
        ],
        "correct": "apel-b"
      }
    ]
  },
  {
    "id": "stok-sayur-piktogram",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.TKB.DATA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Stok Sayur Warung",
        "instruksi": "Lihat piktogram stok sayur warung, lalu sentuh rak yang diminta.",
        "pilihan": "pilihan",
        "wortel": "wortel",
        "jagung": "jagung",
        "tomat": "tomat",
        "terong": "terong",
        "tSedikit": "Tukang antar datang. Rak mana yang paling sedikit, supaya diisi?",
        "tBanyak": "Pemborong datang. Rak mana yang paling banyak, supaya diborong?"
      },
      "en": {
        "judul": "Shop Vegetable Stock",
        "instruksi": "Look at the vegetable stock chart in the shop, then touch the shelf asked for.",
        "pilihan": "choices",
        "wortel": "carrots",
        "jagung": "corn",
        "tomat": "tomatoes",
        "terong": "eggplants",
        "tSedikit": "The delivery is here. Which shelf has the fewest, so we can refill it?",
        "tBanyak": "The wholesaler is here. Which shelf has the most, so they can buy it all?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah kolom piktogram yang dibandingkan; selisih antar kolom terdekat 2 → 1"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "warung",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "wortel-a",
        "labelKey": "wortel",
        "bin": "pilihan",
        "emoji": "🥕",
        "count": 2
      },
      {
        "id": "wortel-b",
        "labelKey": "wortel",
        "bin": "pilihan",
        "emoji": "🥕",
        "count": 7
      },
      {
        "id": "jagung-a",
        "labelKey": "jagung",
        "bin": "pilihan",
        "emoji": "🌽",
        "count": 4
      },
      {
        "id": "jagung-b",
        "labelKey": "jagung",
        "bin": "pilihan",
        "emoji": "🌽",
        "count": 6
      },
      {
        "id": "tomat-a",
        "labelKey": "tomat",
        "bin": "pilihan",
        "emoji": "🍅",
        "count": 6
      },
      {
        "id": "tomat-b",
        "labelKey": "tomat",
        "bin": "pilihan",
        "emoji": "🍅",
        "count": 5
      },
      {
        "id": "terong-a",
        "labelKey": "terong",
        "bin": "pilihan",
        "emoji": "🍆",
        "count": 8
      },
      {
        "id": "terong-b",
        "labelKey": "terong",
        "bin": "pilihan",
        "emoji": "🍆",
        "count": 4
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tSedikit",
        "choices": [
          "wortel-a",
          "jagung-a",
          "tomat-a"
        ],
        "correct": "wortel-a"
      },
      {
        "id": "r2",
        "promptKey": "tBanyak",
        "choices": [
          "wortel-a",
          "jagung-a",
          "tomat-a"
        ],
        "correct": "tomat-a"
      },
      {
        "id": "r3",
        "promptKey": "tSedikit",
        "choices": [
          "jagung-a",
          "tomat-a",
          "terong-a"
        ],
        "correct": "jagung-a"
      },
      {
        "id": "r4",
        "promptKey": "tBanyak",
        "choices": [
          "wortel-a",
          "jagung-a",
          "tomat-a",
          "terong-a"
        ],
        "correct": "terong-a"
      },
      {
        "id": "r5",
        "promptKey": "tSedikit",
        "choices": [
          "wortel-b",
          "jagung-b",
          "tomat-b",
          "terong-b"
        ],
        "correct": "terong-b"
      },
      {
        "id": "r6",
        "promptKey": "tBanyak",
        "choices": [
          "wortel-b",
          "jagung-b",
          "tomat-b"
        ],
        "correct": "wortel-b"
      }
    ]
  },
  {
    "id": "ular-panjang-pendek",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BANDING.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ular Berjemur",
        "instruksi": "Dua ular berjemur sejajar: sentuh yang lebih panjang atau lebih pendek sesuai permintaan.",
        "pilihan": "pilihan",
        "ular": "ular",
        "cacing": "cacing",
        "ikan": "ikan",
        "buaya": "buaya",
        "ulat": "ulat",
        "tPanjang": "Mana yang lebih panjang?",
        "tPendek": "Mana yang lebih pendek?"
      },
      "en": {
        "judul": "Sunbathing Snakes",
        "instruksi": "Two snakes are sunbathing side by side: touch the longer or shorter one as asked.",
        "pilihan": "choices",
        "ular": "snake",
        "cacing": "worm",
        "ikan": "fish",
        "buaya": "crocodile",
        "ulat": "caterpillar",
        "tPanjang": "Which one is longer?",
        "tPendek": "Which one is shorter?"
      }
    },
    "knobs": {
      "itemCount": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua benda sejenis sejajar di garis dasar yang sama; rasio panjang ≥ 1,5 lewat width"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "sungai",
    "mode": "pilih",
    "bins": [
      {
        "id": "pilihan",
        "labelKey": "pilihan"
      }
    ],
    "items": [
      {
        "id": "ular-panjang",
        "labelKey": "ular",
        "bin": "pilihan",
        "emoji": "🐍",
        "width": 2
      },
      {
        "id": "ular-pendek",
        "labelKey": "ular",
        "bin": "pilihan",
        "emoji": "🐍",
        "width": 1
      },
      {
        "id": "cacing-panjang",
        "labelKey": "cacing",
        "bin": "pilihan",
        "emoji": "🪱",
        "width": 1.8
      },
      {
        "id": "cacing-pendek",
        "labelKey": "cacing",
        "bin": "pilihan",
        "emoji": "🪱",
        "width": 1
      },
      {
        "id": "ikan-panjang",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "width": 1.6
      },
      {
        "id": "ikan-pendek",
        "labelKey": "ikan",
        "bin": "pilihan",
        "emoji": "🐟",
        "width": 1
      },
      {
        "id": "buaya-panjang",
        "labelKey": "buaya",
        "bin": "pilihan",
        "emoji": "🐊",
        "width": 2
      },
      {
        "id": "buaya-pendek",
        "labelKey": "buaya",
        "bin": "pilihan",
        "emoji": "🐊",
        "width": 1
      },
      {
        "id": "ulat-panjang",
        "labelKey": "ulat",
        "bin": "pilihan",
        "emoji": "🐛",
        "width": 1.7
      },
      {
        "id": "ulat-pendek",
        "labelKey": "ulat",
        "bin": "pilihan",
        "emoji": "🐛",
        "width": 1
      }
    ],
    "pilihan": [
      {
        "id": "r1",
        "promptKey": "tPanjang",
        "choices": [
          "ular-pendek",
          "ular-panjang"
        ],
        "correct": "ular-panjang"
      },
      {
        "id": "r2",
        "promptKey": "tPendek",
        "choices": [
          "cacing-panjang",
          "cacing-pendek"
        ],
        "correct": "cacing-pendek"
      },
      {
        "id": "r3",
        "promptKey": "tPanjang",
        "choices": [
          "ikan-pendek",
          "ikan-panjang"
        ],
        "correct": "ikan-panjang"
      },
      {
        "id": "r4",
        "promptKey": "tPendek",
        "choices": [
          "buaya-panjang",
          "buaya-pendek"
        ],
        "correct": "buaya-pendek"
      },
      {
        "id": "r5",
        "promptKey": "tPanjang",
        "choices": [
          "ulat-pendek",
          "ulat-panjang"
        ],
        "correct": "ulat-panjang"
      }
    ]
  },
  {
    "id": "barisan-buah-piring",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.PAUD.POLA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Barisan Buah",
        "instruksi": "Lihat barisan buah di piring, lalu taruh buah yang tepat di tempat kosong.",
        "apel": "apel",
        "pisang": "pisang",
        "anggur": "anggur"
      },
      "en": {
        "judul": "Fruit Parade",
        "instruksi": "Look at the row of fruit on the plate, then put the right fruit in the empty spot.",
        "apel": "apple",
        "pisang": "banana",
        "anggur": "grapes"
      }
    },
    "knobs": {
      "shown": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah ulangan penuh pola yang ditampilkan sebelum slot kosong"
      },
      "blanks": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah slot kosong di ujung pola"
      },
      "distractor": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = palet hanya dua buah pola; 1 = tambah buah ketiga sebagai pengecoh"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "dapur",
    "mode": "lanjut",
    "unitLen": 2,
    "items": [
      {
        "labelKey": "apel",
        "id": "apel",
        "emoji": "🍎"
      },
      {
        "labelKey": "pisang",
        "id": "pisang",
        "emoji": "🍌"
      },
      {
        "labelKey": "anggur",
        "id": "anggur",
        "emoji": "🍇"
      }
    ],
    "patterns": [],
    "nada": {
      "apel": "C4",
      "pisang": "G4",
      "anggur": "E4"
    }
  },
  {
    "id": "barisan-pantai-keliru",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.TKA.POLA-ABC.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Barisan Pantai Keliru",
        "instruksi": "Satu benda di barisan ini salah tempat, sentuh yang salah lalu ganti dengan yang benar.",
        "ikan": "ikan",
        "kerang": "kerang",
        "kepiting": "kepiting"
      },
      "en": {
        "judul": "Beach Row Mix-Up",
        "instruksi": "One thing in this row is in the wrong place; touch it, then swap in the right one.",
        "ikan": "fish",
        "kerang": "shell",
        "kepiting": "crab"
      }
    },
    "knobs": {
      "posisi": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = unsur yang tertukar ada di tengah pola; 1 = boleh di ujung (lebih sulit dilihat)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pantai",
    "mode": "perbaiki",
    "unitLen": 2,
    "items": [
      {
        "labelKey": "ikan",
        "id": "ikan",
        "emoji": "🐟"
      },
      {
        "labelKey": "kerang",
        "id": "kerang",
        "emoji": "🐚"
      },
      {
        "labelKey": "kepiting",
        "id": "kepiting",
        "emoji": "🦀"
      }
    ],
    "patterns": [],
    "nada": {
      "ikan": "C4",
      "kerang": "G4",
      "kepiting": "E4"
    }
  },
  {
    "id": "bendera-tiga-warna",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.TKA.POLA-ABC.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bendera Tiga Warna",
        "instruksi": "Lihat barisan bendera, lalu gantung bendera yang tepat di tali yang kosong.",
        "bendera-merah": "bendera merah",
        "bendera-biru": "bendera biru",
        "bendera-kuning": "bendera kuning",
        "bendera-hijau": "bendera hijau"
      },
      "en": {
        "judul": "Three-Colour Flags",
        "instruksi": "Look at the row of flags, then hang the right flags on the empty string.",
        "bendera-merah": "red flag",
        "bendera-biru": "blue flag",
        "bendera-kuning": "yellow flag",
        "bendera-hijau": "green flag"
      }
    },
    "knobs": {
      "shown": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah ulangan penuh ABC yang ditampilkan"
      },
      "blanks": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah slot kosong di ujung pola"
      },
      "distractor": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "pengecoh warna keempat selalu ada di palet supaya anak tidak melanjutkan AB"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pesta",
    "mode": "lanjut",
    "unitLen": 3,
    "items": [
      {
        "labelKey": "bendera-merah",
        "id": "bendera-merah",
        "shape": "triangle",
        "color": "#e53935"
      },
      {
        "labelKey": "bendera-biru",
        "id": "bendera-biru",
        "shape": "triangle",
        "color": "#1e88e5"
      },
      {
        "labelKey": "bendera-kuning",
        "id": "bendera-kuning",
        "shape": "triangle",
        "color": "#fdd835"
      },
      {
        "labelKey": "bendera-hijau",
        "id": "bendera-hijau",
        "shape": "triangle",
        "color": "#43a047"
      }
    ],
    "patterns": [],
    "nada": {
      "bendera-merah": "C4",
      "bendera-biru": "E4",
      "bendera-kuning": "G4",
      "bendera-hijau": "A4"
    }
  },
  {
    "id": "kalung-buatanku",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.PAUD.POLA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kalung Buatanku",
        "instruksi": "Pilih dua benda kesukaanmu, lalu susun bergantian sampai kalungnya penuh.",
        "kerang": "kerang",
        "bunga": "bunga",
        "bintang": "bintang",
        "permata": "permata"
      },
      "en": {
        "judul": "My Own Necklace",
        "instruksi": "Pick two things you like, then place them one after the other until the necklace is full.",
        "kerang": "shell",
        "bunga": "flower",
        "bintang": "star",
        "permata": "gem"
      }
    },
    "knobs": {
      "slots": {
        "min": 4,
        "max": 6,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah slot kalung yang harus diisi; benar bila ABAB… atau BABA… penuh"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pantai",
    "mode": "cipta",
    "unitLen": 2,
    "items": [
      {
        "labelKey": "kerang",
        "id": "kerang",
        "emoji": "🐚"
      },
      {
        "labelKey": "bunga",
        "id": "bunga",
        "emoji": "🌸"
      },
      {
        "labelKey": "bintang",
        "id": "bintang",
        "emoji": "⭐"
      },
      {
        "labelKey": "permata",
        "id": "permata",
        "emoji": "💎"
      }
    ],
    "patterns": [],
    "nada": {
      "kerang": "C4",
      "bunga": "E4",
      "bintang": "G4",
      "permata": "A4"
    }
  },
  {
    "id": "lagu-tiga-nada",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.TKA.POLA-ABC.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lagu Tiga Nada",
        "instruksi": "Pilih tiga alat musik, lalu susun berulang sampai barisnya penuh dan dengarkan lagumu.",
        "drum": "drum",
        "lonceng": "lonceng",
        "terompet": "terompet",
        "gitar": "gitar",
        "marakas": "marakas"
      },
      "en": {
        "judul": "Three-Note Song",
        "instruksi": "Pick three instruments, then repeat them in order until the row is full and hear your song.",
        "drum": "drum",
        "lonceng": "bell",
        "terompet": "trumpet",
        "gitar": "guitar",
        "marakas": "maracas"
      }
    },
    "knobs": {
      "slots": {
        "min": 6,
        "max": 9,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah slot yang harus diisi; benar bila unit tiga berulang penuh minimal 2 kali"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pesta",
    "mode": "cipta",
    "unitLen": 3,
    "items": [
      {
        "labelKey": "drum",
        "id": "drum",
        "emoji": "🥁"
      },
      {
        "labelKey": "lonceng",
        "id": "lonceng",
        "emoji": "🔔"
      },
      {
        "labelKey": "terompet",
        "id": "terompet",
        "emoji": "🎺"
      },
      {
        "labelKey": "gitar",
        "id": "gitar",
        "emoji": "🎸"
      },
      {
        "labelKey": "marakas",
        "id": "marakas",
        "emoji": "🪇"
      }
    ],
    "patterns": [],
    "nada": {
      "drum": "C4",
      "lonceng": "E4",
      "terompet": "G4",
      "gitar": "A4",
      "marakas": "D4"
    }
  },
  {
    "id": "manik-warna-berbaris",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.PAUD.POLA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Manik Warna Berbaris",
        "instruksi": "Lihat barisan manik, lalu taruh manik yang tepat di tempat kosong.",
        "manik-merah": "manik merah",
        "manik-biru": "manik biru",
        "manik-kuning": "manik kuning"
      },
      "en": {
        "judul": "Colour Bead Line",
        "instruksi": "Look at the row of beads, then put the right bead in the empty spot.",
        "manik-merah": "red bead",
        "manik-biru": "blue bead",
        "manik-kuning": "yellow bead"
      }
    },
    "knobs": {
      "shown": {
        "min": 2,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah ulangan penuh pola yang ditampilkan sebelum slot kosong"
      },
      "blanks": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "jumlah slot kosong di ujung pola"
      },
      "distractor": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = palet hanya dua manik pola; 1 = tambah manik warna ketiga sebagai pengecoh (setelah 3 sukses)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "lanjut",
    "unitLen": 2,
    "items": [
      {
        "labelKey": "manik-merah",
        "id": "manik-merah",
        "shape": "circle",
        "color": "#e53935"
      },
      {
        "labelKey": "manik-biru",
        "id": "manik-biru",
        "shape": "square",
        "color": "#1e88e5"
      },
      {
        "labelKey": "manik-kuning",
        "id": "manik-kuning",
        "shape": "triangle",
        "color": "#fdd835"
      }
    ],
    "patterns": [],
    "nada": {
      "manik-merah": "C4",
      "manik-biru": "G4",
      "manik-kuning": "E4"
    }
  },
  {
    "id": "pagar-bunga-keliru",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.TKA.POLA-ABC.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pagar Bunga Keliru",
        "instruksi": "Satu bunga di pagar ini salah tempat, sentuh yang salah lalu ganti dengan bunga yang benar.",
        "tulip": "tulip",
        "matahari": "bunga matahari",
        "melati": "bunga putih",
        "semanggi": "semanggi"
      },
      "en": {
        "judul": "Flower Fence Mix-Up",
        "instruksi": "One flower on this fence is in the wrong place; touch it, then swap in the right flower.",
        "tulip": "tulip",
        "matahari": "sunflower",
        "melati": "white blossom",
        "semanggi": "clover"
      }
    },
    "knobs": {
      "posisi": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = unsur yang tertukar ada di tengah pola; 1 = boleh di ujung (lebih sulit dilihat)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "taman",
    "mode": "perbaiki",
    "unitLen": 3,
    "items": [
      {
        "labelKey": "tulip",
        "id": "tulip",
        "emoji": "🌷"
      },
      {
        "labelKey": "matahari",
        "id": "matahari",
        "emoji": "🌻"
      },
      {
        "labelKey": "melati",
        "id": "melati",
        "emoji": "🌼"
      },
      {
        "labelKey": "semanggi",
        "id": "semanggi",
        "emoji": "🍀"
      }
    ],
    "patterns": [],
    "nada": {
      "tulip": "C4",
      "matahari": "E4",
      "melati": "G4",
      "semanggi": "A4"
    }
  },
  {
    "id": "ubin-tiga-bentuk",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "pola",
    "competencyIds": [
      "KODE.TKA.POLA-ABC.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ubin Tiga Bentuk",
        "instruksi": "Lihat barisan ubin, lalu pasang ubin yang bentuknya tepat di lantai yang kosong.",
        "ubin-lingkaran": "ubin lingkaran",
        "ubin-kotak": "ubin kotak",
        "ubin-segitiga": "ubin segitiga",
        "ubin-bintang": "ubin bintang"
      },
      "en": {
        "judul": "Three-Shape Tiles",
        "instruksi": "Look at the row of tiles, then fit the right shapes into the empty floor spots.",
        "ubin-lingkaran": "circle tile",
        "ubin-kotak": "square tile",
        "ubin-segitiga": "triangle tile",
        "ubin-bintang": "star tile"
      }
    },
    "knobs": {
      "shown": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah ulangan penuh ABC yang ditampilkan"
      },
      "blanks": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah slot kosong di ujung pola"
      },
      "distractor": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "pengecoh bentuk keempat selalu ada di palet; semua ubin satu warna supaya yang dibaca bentuknya"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "lanjut",
    "unitLen": 3,
    "items": [
      {
        "labelKey": "ubin-lingkaran",
        "id": "ubin-lingkaran",
        "shape": "circle",
        "color": "#9e9e9e"
      },
      {
        "labelKey": "ubin-kotak",
        "id": "ubin-kotak",
        "shape": "square",
        "color": "#9e9e9e"
      },
      {
        "labelKey": "ubin-segitiga",
        "id": "ubin-segitiga",
        "shape": "triangle",
        "color": "#9e9e9e"
      },
      {
        "labelKey": "ubin-bintang",
        "id": "ubin-bintang",
        "shape": "star",
        "color": "#9e9e9e"
      }
    ],
    "patterns": [],
    "nada": {
      "ubin-lingkaran": "C4",
      "ubin-kotak": "E4",
      "ubin-segitiga": "G4",
      "ubin-bintang": "A4"
    }
  },
  {
    "id": "bagi-ikan-dua-kucing",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.TAMBAH-KURANG-10.04"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Bagi Ikan Adil",
        "instruksi": "Dua anak kucing lapar, bagi semua ikan ke dua piring supaya sama banyak.",
        "ikan": "ikan",
        "kucing-kiri": "kucing kiri",
        "kucing-kanan": "kucing kanan"
      },
      "en": {
        "judul": "Share the Fish Fairly",
        "instruksi": "Two kittens are hungry; share all the fish onto two plates so each gets the same.",
        "ikan": "fish",
        "kucing-kiri": "left kitten",
        "kucing-kanan": "right kitten"
      }
    },
    "knobs": {
      "max": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 2,
        "keterangan": "jumlah ikan terbanyak yang dibagi (target genap 2/4/6/8 sampai max)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "bagi",
    "items": [
      {
        "labelKey": "ikan",
        "id": "ikan",
        "role": "benda",
        "emoji": "🐟"
      },
      {
        "labelKey": "kucing-kiri",
        "id": "kucing-kiri",
        "role": "hewan",
        "emoji": "🐱",
        "color": "#fb8c00"
      },
      {
        "labelKey": "kucing-kanan",
        "id": "kucing-kanan",
        "role": "hewan",
        "emoji": "🐱",
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "id": "jam-dinding-dapur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.JAM-BULAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Jam di Dapur",
        "instruksi": "Robot bertanya pukul berapa, lihat jam di dapur lalu sentuh kartu jam yang benar.",
        "jam-dinding": "jam dinding"
      },
      "en": {
        "judul": "Kitchen Clock",
        "instruksi": "The robot asks what time it is; look at the kitchen clock, then touch the right time card.",
        "jam-dinding": "wall clock"
      }
    },
    "knobs": {
      "hourMax": {
        "min": 6,
        "max": 12,
        "default": 6,
        "step": 1,
        "keterangan": "angka jam terbesar yang diuji (1..hourMax)"
      },
      "bantuanWarna": {
        "min": 0,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "1 = jarum pendek diberi warna beda sebagai bantuan; 0 = kedua jarum sewarna"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "dapur",
    "mode": "jam-baca",
    "items": [
      {
        "labelKey": "jam-dinding",
        "id": "jam-dinding",
        "role": "benda",
        "emoji": "🕒"
      }
    ]
  },
  {
    "id": "jam-dinding-kelas",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.JAM-BULAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pukul Berapa Sekarang?",
        "instruksi": "Lihat jarum pendek di jam dinding kelas, lalu sentuh kartu pukul berapa sekarang.",
        "jam-dinding": "jam dinding"
      },
      "en": {
        "judul": "What Time Is It?",
        "instruksi": "Look at the short hand on the classroom clock, then touch the card that says what time it is.",
        "jam-dinding": "wall clock"
      }
    },
    "knobs": {
      "hourMax": {
        "min": 6,
        "max": 12,
        "default": 6,
        "step": 1,
        "keterangan": "angka jam terbesar yang diuji (1..hourMax)"
      },
      "bantuanWarna": {
        "min": 0,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "1 = jarum pendek diberi warna beda sebagai bantuan; 0 = kedua jarum sewarna"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "jalan-ke-sekolah",
    "mode": "jam-baca",
    "items": [
      {
        "labelKey": "jam-dinding",
        "id": "jam-dinding",
        "role": "benda",
        "emoji": "🕒"
      }
    ]
  },
  {
    "id": "jengkal-meja-dapur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.UKUR-NONSTANDAR.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Jengkal di Dapur",
        "instruksi": "Ukur benda di meja dengan jengkalmu, rapat tanpa celah, lalu sebutkan berapa jengkal.",
        "taplak": "taplak meja",
        "nampan": "nampan",
        "roti": "roti panjang",
        "talenan": "talenan",
        "pisang": "pisang",
        "sendok": "sendok kayu"
      },
      "en": {
        "judul": "Spans in the Kitchen",
        "instruksi": "Measure the thing on the table with your spans, snug with no gaps, then say how many spans.",
        "taplak": "tablecloth",
        "nampan": "tray",
        "roti": "long bread",
        "talenan": "cutting board",
        "pisang": "banana",
        "sendok": "wooden spoon"
      }
    },
    "knobs": {
      "snap": {
        "min": 0,
        "max": 0,
        "default": 0,
        "step": 1,
        "keterangan": "0 = tanpa snap; anak menaruh jengkal sendiri, celah/tumpang tindih terdeteksi"
      },
      "maxSpans": {
        "min": 4,
        "max": 10,
        "default": 4,
        "step": 1,
        "keterangan": "panjang benda terpanjang yang muncul (jengkal)"
      },
      "bayang": {
        "min": 0,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "1 = garis bayang bantu posisi jengkal berikutnya; 0 = tanpa bantuan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "dapur",
    "mode": "jengkal",
    "items": [
      {
        "labelKey": "taplak",
        "id": "taplak",
        "role": "benda",
        "emoji": "🧣",
        "value": 10,
        "width": 4
      },
      {
        "labelKey": "nampan",
        "id": "nampan",
        "role": "benda",
        "emoji": "🍽️",
        "value": 9,
        "width": 3.6
      },
      {
        "labelKey": "roti",
        "id": "roti",
        "role": "benda",
        "emoji": "🥖",
        "value": 7,
        "width": 2.8
      },
      {
        "labelKey": "talenan",
        "id": "talenan",
        "role": "benda",
        "emoji": "🪵",
        "value": 6,
        "width": 2.4
      },
      {
        "labelKey": "pisang",
        "id": "pisang",
        "role": "benda",
        "emoji": "🍌",
        "value": 5,
        "width": 2
      },
      {
        "labelKey": "sendok",
        "id": "sendok",
        "role": "benda",
        "emoji": "🥄",
        "value": 4,
        "width": 1.6
      }
    ]
  },
  {
    "id": "jengkal-sayur-kebun",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKA.UKUR-NONSTANDAR.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ukur dengan Jengkal",
        "instruksi": "Tempelkan jengkal tanganmu dari ujung ke ujung, lalu sebutkan berapa jengkal panjangnya.",
        "wortel": "wortel",
        "timun": "timun",
        "jagung": "jagung",
        "terong": "terong",
        "roti": "roti panjang"
      },
      "en": {
        "judul": "Measure in Hand Spans",
        "instruksi": "Lay your hand spans from one end to the other, then say how many spans long it is.",
        "wortel": "carrot",
        "timun": "cucumber",
        "jagung": "corn",
        "terong": "eggplant",
        "roti": "long bread"
      }
    },
    "knobs": {
      "snap": {
        "min": 1,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "1 = jengkal menempel otomatis ke ujung jengkal sebelumnya"
      },
      "maxSpans": {
        "min": 2,
        "max": 5,
        "default": 2,
        "step": 1,
        "keterangan": "panjang benda terpanjang yang muncul (jengkal)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "jengkal",
    "items": [
      {
        "labelKey": "wortel",
        "id": "wortel",
        "role": "benda",
        "emoji": "🥕",
        "value": 2,
        "width": 1
      },
      {
        "labelKey": "timun",
        "id": "timun",
        "role": "benda",
        "emoji": "🥒",
        "value": 3,
        "width": 1.5
      },
      {
        "labelKey": "jagung",
        "id": "jagung",
        "role": "benda",
        "emoji": "🌽",
        "value": 4,
        "width": 2
      },
      {
        "labelKey": "terong",
        "id": "terong",
        "role": "benda",
        "emoji": "🍆",
        "value": 3,
        "width": 1.5
      },
      {
        "labelKey": "roti",
        "id": "roti",
        "role": "benda",
        "emoji": "🥖",
        "value": 5,
        "width": 2.5
      }
    ]
  },
  {
    "id": "jengkal-tali-halaman",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.UKUR-NONSTANDAR.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Jengkal di Halaman",
        "instruksi": "Taruh jengkalmu satu per satu tanpa celah dan tanpa tumpang tindih, lalu sebutkan jumlahnya.",
        "tali": "tali",
        "bambu": "bambu",
        "ular": "ular",
        "selang": "selang air",
        "kayu": "kayu",
        "sapu": "sapu"
      },
      "en": {
        "judul": "Spans in the Yard",
        "instruksi": "Place your spans one by one with no gaps and no overlaps, then say how many there are.",
        "tali": "rope",
        "bambu": "bamboo",
        "ular": "snake",
        "selang": "hose",
        "kayu": "log",
        "sapu": "broom"
      }
    },
    "knobs": {
      "snap": {
        "min": 0,
        "max": 0,
        "default": 0,
        "step": 1,
        "keterangan": "0 = tanpa snap; anak menaruh jengkal sendiri, celah/tumpang tindih terdeteksi"
      },
      "maxSpans": {
        "min": 4,
        "max": 10,
        "default": 4,
        "step": 1,
        "keterangan": "panjang benda terpanjang yang muncul (jengkal)"
      },
      "bayang": {
        "min": 0,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "1 = garis bayang bantu posisi jengkal berikutnya; 0 = tanpa bantuan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "jengkal",
    "items": [
      {
        "labelKey": "tali",
        "id": "tali",
        "role": "benda",
        "emoji": "🪢",
        "value": 10,
        "width": 4
      },
      {
        "labelKey": "bambu",
        "id": "bambu",
        "role": "benda",
        "emoji": "🎋",
        "value": 8,
        "width": 3.2
      },
      {
        "labelKey": "ular",
        "id": "ular",
        "role": "benda",
        "emoji": "🐍",
        "value": 7,
        "width": 2.8
      },
      {
        "labelKey": "selang",
        "id": "selang",
        "role": "benda",
        "emoji": "🧵",
        "value": 6,
        "width": 2.4
      },
      {
        "labelKey": "kayu",
        "id": "kayu",
        "role": "benda",
        "emoji": "🪵",
        "value": 5,
        "width": 2
      },
      {
        "labelKey": "sapu",
        "id": "sapu",
        "role": "benda",
        "emoji": "🧹",
        "value": 4,
        "width": 1.6
      }
    ]
  },
  {
    "id": "jungkat-jungkit-berat",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKA.BANDING.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Lebih Berat?",
        "instruksi": "Taruh dua benda di timbangan, lihat sisi yang turun, lalu sentuh benda yang lebih berat.",
        "batu": "batu",
        "semangka": "semangka",
        "buku": "buku",
        "bola": "bola",
        "boneka": "boneka beruang",
        "stroberi": "stroberi",
        "balon": "balon"
      },
      "en": {
        "judul": "Which Is Heavier?",
        "instruksi": "Put the two things on the balance, watch which side goes down, then touch the heavier one.",
        "batu": "rock",
        "semangka": "watermelon",
        "buku": "book",
        "bola": "ball",
        "boneka": "teddy bear",
        "stroberi": "strawberry",
        "balon": "balloon"
      }
    },
    "knobs": {
      "tipuan": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = pasangan biasa; 1 = pakai pasangan besar-ringan vs kecil-berat (balon vs batu) setelah 3 sukses"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "taman",
    "mode": "timbangan",
    "items": [
      {
        "labelKey": "batu",
        "id": "batu",
        "role": "benda",
        "emoji": "🪨",
        "value": 9,
        "scale": 0.8
      },
      {
        "labelKey": "semangka",
        "id": "semangka",
        "role": "benda",
        "emoji": "🍉",
        "value": 8,
        "scale": 1.6
      },
      {
        "labelKey": "buku",
        "id": "buku",
        "role": "benda",
        "emoji": "📚",
        "value": 6,
        "scale": 1
      },
      {
        "labelKey": "bola",
        "id": "bola",
        "role": "benda",
        "emoji": "⚽",
        "value": 4,
        "scale": 1.3
      },
      {
        "labelKey": "boneka",
        "id": "boneka",
        "role": "benda",
        "emoji": "🧸",
        "value": 3,
        "scale": 1.5
      },
      {
        "labelKey": "stroberi",
        "id": "stroberi",
        "role": "benda",
        "emoji": "🍓",
        "value": 2,
        "scale": 0.6
      },
      {
        "labelKey": "balon",
        "id": "balon",
        "role": "benda",
        "emoji": "🎈",
        "value": 1,
        "scale": 1.8
      }
    ]
  },
  {
    "id": "keran-macet-minta-tolong",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "simulasi",
    "competencyIds": [
      "KODE.PAUD.SEBAB-AKIBAT.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Alat Macet, Minta Tolong",
        "instruksi": "Robot mau pakai alat di rumah. Ketuk alatnya supaya bekerja.",
        "keran": "keran",
        "lampu": "lampu",
        "pintu": "pintu"
      },
      "en": {
        "judul": "It's Stuck, Ask for Help",
        "instruksi": "The robot wants to use something at home. Tap it to make it work.",
        "keran": "tap",
        "lampu": "lamp",
        "pintu": "door"
      }
    },
    "knobs": {
      "batas": {
        "min": 3,
        "max": 8,
        "default": 5,
        "step": 1,
        "keterangan": "batas ketukan sia-sia sebelum minta tolong yang masih dihitung berhasil; lebih dari itu dicatat belum"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "bantuan",
    "items": [
      {
        "id": "keran",
        "labelKey": "keran",
        "role": "alat",
        "emoji": "🚰"
      },
      {
        "id": "lampu",
        "labelKey": "lampu",
        "role": "alat",
        "emoji": "💡"
      },
      {
        "id": "pintu",
        "labelKey": "pintu",
        "role": "alat",
        "emoji": "🚪"
      }
    ]
  },
  {
    "id": "klinik-hewan-alat-ukur",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.UKUR-NONSTANDAR.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Alat Ukur Klinik",
        "instruksi": "Dengar apa yang ditanya tentang hewan ini, lalu pilih alat yang tepat dan pakai untuk mengukurnya.",
        "ular": "ular",
        "cacing": "cacing",
        "kadal": "kadal",
        "kelinci": "kelinci",
        "kucing": "kucing",
        "ayam": "ayam",
        "penggaris-kubus": "penggaris kubus",
        "timbangan": "timbangan"
      },
      "en": {
        "judul": "Clinic Measuring Tools",
        "instruksi": "Listen to what we need to know about this animal, then pick the right tool and use it.",
        "ular": "snake",
        "cacing": "worm",
        "kadal": "lizard",
        "kelinci": "rabbit",
        "kucing": "cat",
        "ayam": "chicken",
        "penggaris-kubus": "cube ruler",
        "timbangan": "balance scale"
      }
    },
    "knobs": {
      "hewanAktif": {
        "min": 4,
        "max": 6,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah jenis hewan yang bisa muncul; putaran diacak, bukan pencocokan 1:1"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "mode": "alat",
    "items": [
      {
        "labelKey": "ular",
        "id": "ular",
        "role": "hewan",
        "emoji": "🐍",
        "value": 1
      },
      {
        "labelKey": "cacing",
        "id": "cacing",
        "role": "hewan",
        "emoji": "🪱",
        "value": 1
      },
      {
        "labelKey": "kadal",
        "id": "kadal",
        "role": "hewan",
        "emoji": "🦎",
        "value": 1
      },
      {
        "labelKey": "kelinci",
        "id": "kelinci",
        "role": "hewan",
        "emoji": "🐰",
        "value": 2
      },
      {
        "labelKey": "kucing",
        "id": "kucing",
        "role": "hewan",
        "emoji": "🐱",
        "value": 2
      },
      {
        "labelKey": "ayam",
        "id": "ayam",
        "role": "hewan",
        "emoji": "🐔",
        "value": 2
      },
      {
        "labelKey": "penggaris-kubus",
        "id": "penggaris-kubus",
        "role": "alat",
        "emoji": "📏"
      },
      {
        "labelKey": "timbangan",
        "id": "timbangan",
        "role": "alat",
        "emoji": "⚖️"
      }
    ]
  },
  {
    "id": "menara-balok-bola",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKA.BENTUK-RUANG.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Menara Balok dan Bola",
        "instruksi": "Bangun menara empat tingkat, ketuk benda yang bisa ditumpuk.",
        "kubus": "kubus",
        "kotak": "kotak",
        "buku": "buku",
        "kaleng": "kaleng",
        "bola-sepak": "bola sepak",
        "bola-basket": "bola basket",
        "bola-tenis": "bola tenis"
      },
      "en": {
        "judul": "Block and Ball Tower",
        "instruksi": "Build a four-level tower; tap the things that can be stacked.",
        "kubus": "cube",
        "kotak": "box",
        "buku": "book",
        "kaleng": "can",
        "bola-sepak": "soccer ball",
        "bola-basket": "basketball",
        "bola-tenis": "tennis ball"
      }
    },
    "knobs": {
      "tinggi": {
        "min": 3,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "tinggi menara yang harus berdiri (jumlah tingkat); bukti kompetensi = 4 tingkat"
      },
      "benda": {
        "min": 5,
        "max": 6,
        "default": 5,
        "step": 1,
        "keterangan": "jumlah benda di lantai per ronde; selalu ada cukup benda rata dan minimal satu bola"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "ruang-main",
    "mode": "menara",
    "items": [
      {
        "id": "kubus",
        "labelKey": "kubus",
        "role": "benda",
        "value": 1,
        "emoji": "🧊"
      },
      {
        "id": "kotak",
        "labelKey": "kotak",
        "role": "benda",
        "value": 1,
        "emoji": "📦"
      },
      {
        "id": "buku",
        "labelKey": "buku",
        "role": "benda",
        "value": 1,
        "emoji": "📕"
      },
      {
        "id": "kaleng",
        "labelKey": "kaleng",
        "role": "benda",
        "value": 2,
        "emoji": "🥫"
      },
      {
        "id": "bola-sepak",
        "labelKey": "bola-sepak",
        "role": "benda",
        "value": 0,
        "emoji": "⚽"
      },
      {
        "id": "bola-basket",
        "labelKey": "bola-basket",
        "role": "benda",
        "value": 0,
        "emoji": "🏀"
      },
      {
        "id": "bola-tenis",
        "labelKey": "bola-tenis",
        "role": "benda",
        "value": 0,
        "emoji": "🎾"
      }
    ]
  },
  {
    "id": "penggaris-kubus-meja",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.UKUR-NONSTANDAR.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Berapa Kubus Panjangnya?",
        "instruksi": "Sejajarkan ujung benda dengan kubus nomor satu, lalu baca nomor di ujung satunya.",
        "krayon": "krayon",
        "kunci": "kunci",
        "sendok": "sendok",
        "sikat-gigi": "sikat gigi",
        "pensil": "pensil",
        "wortel": "wortel",
        "sumpit": "sumpit",
        "penggaris-kayu": "tongkat kayu"
      },
      "en": {
        "judul": "How Many Cubes Long?",
        "instruksi": "Line up the end of the object with cube number one, then read the number at the other end.",
        "krayon": "crayon",
        "kunci": "key",
        "sendok": "spoon",
        "sikat-gigi": "toothbrush",
        "pensil": "pencil",
        "wortel": "carrot",
        "sumpit": "chopstick",
        "penggaris-kayu": "wooden stick"
      }
    },
    "knobs": {
      "offset": {
        "min": 0,
        "max": 1,
        "default": 0,
        "step": 1,
        "keterangan": "0 = benda sudah sejajar kubus pertama; 1 = benda mulai di kubus ke-2 (jebakan: anak harus menggeser atau menghitung selisih)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "kubus",
    "items": [
      {
        "labelKey": "krayon",
        "id": "krayon",
        "role": "benda",
        "emoji": "🖍️",
        "value": 3,
        "width": 1.2
      },
      {
        "labelKey": "kunci",
        "id": "kunci",
        "role": "benda",
        "emoji": "🔑",
        "value": 4,
        "width": 1.6
      },
      {
        "labelKey": "sendok",
        "id": "sendok",
        "role": "benda",
        "emoji": "🥄",
        "value": 5,
        "width": 2
      },
      {
        "labelKey": "sikat-gigi",
        "id": "sikat-gigi",
        "role": "benda",
        "emoji": "🪥",
        "value": 6,
        "width": 2.4
      },
      {
        "labelKey": "pensil",
        "id": "pensil",
        "role": "benda",
        "emoji": "✏️",
        "value": 7,
        "width": 2.8
      },
      {
        "labelKey": "wortel",
        "id": "wortel",
        "role": "benda",
        "emoji": "🥕",
        "value": 8,
        "width": 3.2
      },
      {
        "labelKey": "sumpit",
        "id": "sumpit",
        "role": "benda",
        "emoji": "🥢",
        "value": 9,
        "width": 3.6
      },
      {
        "labelKey": "penggaris-kayu",
        "id": "penggaris-kayu",
        "role": "benda",
        "emoji": "🪄",
        "value": 10,
        "width": 4
      }
    ]
  },
  {
    "id": "putar-jarum-kegiatan-hari",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.JAM-BULAT.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Jam Kegiatanku",
        "instruksi": "Dengar kegiatannya pukul berapa, lalu putar jarum pendek ke angka itu.",
        "bangun-tidur": "bangun tidur pukul 6",
        "berangkat-sekolah": "berangkat sekolah pukul 7",
        "istirahat": "istirahat pukul 10",
        "makan-siang": "makan siang pukul 12",
        "mandi-sore": "mandi sore pukul 4",
        "tidur-malam": "tidur malam pukul 8"
      },
      "en": {
        "judul": "My Day on the Clock",
        "instruksi": "Listen to what time the activity happens, then turn the short hand to that number.",
        "bangun-tidur": "wake up at 6 o'clock",
        "berangkat-sekolah": "go to school at 7 o'clock",
        "istirahat": "playtime at 10 o'clock",
        "makan-siang": "lunch at 12 o'clock",
        "mandi-sore": "bath at 4 o'clock",
        "tidur-malam": "bedtime at 8 o'clock"
      }
    },
    "knobs": {
      "kegiatanAktif": {
        "min": 3,
        "max": 6,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah kegiatan yang bisa diundi; semua jam bulat dan tidak ada jam ganda"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "jam-putar",
    "items": [
      {
        "labelKey": "bangun-tidur",
        "id": "bangun-tidur",
        "role": "kegiatan",
        "emoji": "🛏️",
        "value": 6
      },
      {
        "labelKey": "berangkat-sekolah",
        "id": "berangkat-sekolah",
        "role": "kegiatan",
        "emoji": "🏫",
        "value": 7
      },
      {
        "labelKey": "istirahat",
        "id": "istirahat",
        "role": "kegiatan",
        "emoji": "⚽",
        "value": 10
      },
      {
        "labelKey": "makan-siang",
        "id": "makan-siang",
        "role": "kegiatan",
        "emoji": "🍚",
        "value": 12
      },
      {
        "labelKey": "mandi-sore",
        "id": "mandi-sore",
        "role": "kegiatan",
        "emoji": "🚿",
        "value": 4
      },
      {
        "labelKey": "tidur-malam",
        "id": "tidur-malam",
        "role": "kegiatan",
        "emoji": "😴",
        "value": 8
      }
    ]
  },
  {
    "id": "taksir-keranjang-apel",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.04"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kira-kira Berapa Apel?",
        "instruksi": "Lihat keranjang apel sebentar saja, lalu geser penanda ke angka yang kira-kira sama banyaknya.",
        "apel": "apel"
      },
      "en": {
        "judul": "About How Many Apples?",
        "instruksi": "Look at the basket of apples for a moment, then slide the marker to about how many you saw.",
        "apel": "apple"
      }
    },
    "knobs": {
      "max": {
        "min": 8,
        "max": 20,
        "default": 8,
        "step": 1,
        "keterangan": "jumlah apel terbanyak yang bisa muncul (target acak 8..max)"
      },
      "flashMs": {
        "min": 1500,
        "max": 3000,
        "default": 3000,
        "step": 100,
        "keterangan": "lama keranjang terlihat (ms) sebelum ditutup"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pasar",
    "mode": "taksir",
    "items": [
      {
        "labelKey": "apel",
        "id": "apel",
        "role": "benda",
        "emoji": "🍎"
      }
    ]
  },
  {
    "id": "telusur-angka-peti-harta",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKA.BILANGAN-1-10.04"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Telusur Angka Peti Harta",
        "instruksi": "Telusuri angka dengan jarimu mengikuti panah, itu mantra pembuka peti harta.",
        "peti": "peti harta"
      },
      "en": {
        "judul": "Trace the Treasure Number",
        "instruksi": "Trace the number with your finger following the arrows; it is the spell that opens the treasure chest.",
        "peti": "treasure chest"
      }
    },
    "knobs": {
      "max": {
        "min": 1,
        "max": 5,
        "default": 5,
        "step": 1,
        "keterangan": "angka terbesar yang diacak (1 sampai max)"
      },
      "panah": {
        "min": 0,
        "max": 1,
        "default": 1,
        "step": 1,
        "keterangan": "1 = panah urutan goresan ditampilkan, 0 = disembunyikan (anak mengingat arah sendiri)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pulau-harta",
    "mode": "telusur",
    "items": [
      {
        "id": "peti",
        "labelKey": "peti",
        "role": "benda",
        "emoji": "🧰"
      }
    ]
  },
  {
    "id": "tombol-ajaib-kamar",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "simulasi",
    "competencyIds": [
      "KODE.PAUD.SEBAB-AKIBAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tombol Ajaib Kamar",
        "instruksi": "Coba tekan tiap tombol dulu, lalu tunjuk alat yang akan menyala sebelum kamu menekannya lagi.",
        "tombol-merah": "tombol merah",
        "tombol-biru": "tombol biru",
        "tombol-kuning": "tombol kuning",
        "lampu": "lampu",
        "kipas": "kipas angin",
        "radio": "radio"
      },
      "en": {
        "judul": "Magic Room Buttons",
        "instruksi": "Try each button first, then point to the device that will turn on before you press it again.",
        "tombol-merah": "red button",
        "tombol-biru": "blue button",
        "tombol-kuning": "yellow button",
        "lampu": "lamp",
        "kipas": "fan",
        "radio": "radio"
      }
    },
    "knobs": {
      "pairs": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah pasangan tombol→alat yang aktif; pemetaan diacak tiap sesi"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "tombol",
    "items": [
      {
        "labelKey": "tombol-merah",
        "id": "tombol-merah",
        "role": "tombol",
        "shape": "circle",
        "color": "#e53935"
      },
      {
        "labelKey": "tombol-biru",
        "id": "tombol-biru",
        "role": "tombol",
        "shape": "circle",
        "color": "#1e88e5"
      },
      {
        "labelKey": "tombol-kuning",
        "id": "tombol-kuning",
        "role": "tombol",
        "shape": "circle",
        "color": "#fdd835"
      },
      {
        "labelKey": "lampu",
        "id": "lampu",
        "role": "alat",
        "emoji": "💡"
      },
      {
        "labelKey": "kipas",
        "id": "kipas",
        "role": "alat",
        "emoji": "🌀"
      },
      {
        "labelKey": "radio",
        "id": "radio",
        "role": "alat",
        "emoji": "📻"
      }
    ]
  },
  {
    "id": "tombol-bengkel-robot",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "simulasi",
    "competencyIds": [
      "KODE.PAUD.SEBAB-AKIBAT.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Tombol Bengkel Robot",
        "instruksi": "Robot lupa tombol mana untuk apa, coba dulu, lalu tunjuk alat yang akan menyala sebelum menekan lagi.",
        "tombol-merah": "tombol merah",
        "tombol-biru": "tombol biru",
        "tombol-kuning": "tombol kuning",
        "lampu": "lampu",
        "kipas": "kipas angin",
        "radio": "radio"
      },
      "en": {
        "judul": "Robot Workshop Buttons",
        "instruksi": "The robot forgot which button does what; try them, then point to the device that will turn on before pressing again.",
        "tombol-merah": "red button",
        "tombol-biru": "blue button",
        "tombol-kuning": "yellow button",
        "lampu": "lamp",
        "kipas": "fan",
        "radio": "radio"
      }
    },
    "knobs": {
      "pairs": {
        "min": 2,
        "max": 3,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah pasangan tombol→alat yang aktif; pemetaan diacak tiap sesi"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "menara",
    "mode": "tombol",
    "items": [
      {
        "labelKey": "tombol-merah",
        "id": "tombol-merah",
        "role": "tombol",
        "shape": "circle",
        "color": "#e53935"
      },
      {
        "labelKey": "tombol-biru",
        "id": "tombol-biru",
        "role": "tombol",
        "shape": "circle",
        "color": "#1e88e5"
      },
      {
        "labelKey": "tombol-kuning",
        "id": "tombol-kuning",
        "role": "tombol",
        "shape": "circle",
        "color": "#fdd835"
      },
      {
        "labelKey": "lampu",
        "id": "lampu",
        "role": "alat",
        "emoji": "💡"
      },
      {
        "labelKey": "kipas",
        "id": "kipas",
        "role": "alat",
        "emoji": "🌀"
      },
      {
        "labelKey": "radio",
        "id": "radio",
        "role": "alat",
        "emoji": "📻"
      }
    ]
  },
  {
    "id": "turus-hewan-lewat-gerbang",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.DATA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Catat Hewan Lewat",
        "instruksi": "Tiap ada hewan lewat gerbang, sentuh baris hewan itu supaya satu turus tercatat.",
        "kucing": "kucing",
        "bebek": "bebek",
        "kambing": "kambing",
        "sapi": "sapi"
      },
      "en": {
        "judul": "Tally the Animals",
        "instruksi": "Each time an animal passes the gate, touch that animal's row so one tally mark is recorded.",
        "kucing": "cat",
        "bebek": "duck",
        "kambing": "goat",
        "sapi": "cow"
      }
    },
    "knobs": {
      "count": {
        "min": 6,
        "max": 10,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah hewan yang lewat dalam satu putaran"
      },
      "kinds": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah jenis hewan (baris turus) yang dipakai"
      },
      "gapMs": {
        "min": 1200,
        "max": 2000,
        "default": 2000,
        "step": 100,
        "keterangan": "jeda antar hewan lewat (ms); makin pendek makin menuntut perhatian"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "mode": "turus",
    "items": [
      {
        "labelKey": "kucing",
        "id": "kucing",
        "role": "hewan",
        "emoji": "🐱"
      },
      {
        "labelKey": "bebek",
        "id": "bebek",
        "role": "hewan",
        "emoji": "🦆"
      },
      {
        "labelKey": "kambing",
        "id": "kambing",
        "role": "hewan",
        "emoji": "🐐"
      },
      {
        "labelKey": "sapi",
        "id": "sapi",
        "role": "hewan",
        "emoji": "🐄"
      }
    ]
  },
  {
    "id": "turus-hewan-pulang-kandang",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "simulasi",
    "competencyIds": [
      "MAT.TKB.DATA.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hewan Pulang Kandang",
        "instruksi": "Sore ini hewan pulang satu per satu, sentuh baris hewan yang lewat supaya turusnya bertambah.",
        "ayam": "ayam",
        "babi": "babi",
        "domba": "domba",
        "kuda": "kuda"
      },
      "en": {
        "judul": "Animals Coming Home",
        "instruksi": "This evening the animals come home one by one; touch the row of the one passing to add a tally.",
        "ayam": "chicken",
        "babi": "pig",
        "domba": "sheep",
        "kuda": "horse"
      }
    },
    "knobs": {
      "count": {
        "min": 6,
        "max": 10,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah hewan yang lewat dalam satu putaran"
      },
      "kinds": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah jenis hewan (baris turus) yang dipakai"
      },
      "gapMs": {
        "min": 1200,
        "max": 2000,
        "default": 2000,
        "step": 100,
        "keterangan": "jeda antar hewan lewat (ms); makin pendek makin menuntut perhatian"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "peternakan",
    "mode": "turus",
    "items": [
      {
        "labelKey": "ayam",
        "id": "ayam",
        "role": "hewan",
        "emoji": "🐔"
      },
      {
        "labelKey": "babi",
        "id": "babi",
        "role": "hewan",
        "emoji": "🐷"
      },
      {
        "labelKey": "domba",
        "id": "domba",
        "role": "hewan",
        "emoji": "🐑"
      },
      {
        "labelKey": "kuda",
        "id": "kuda",
        "role": "hewan",
        "emoji": "🐴"
      }
    ]
  },
  {
    "id": "berangkat-sekolah",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.PAUD.URUTAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Berangkat Sekolah",
        "instruksi": "Susun gambar supaya berangkat sekolah dengan urutan yang benar.",
        "sekolah": "Robot ke sekolah",
        "teh": "Membuat teh hangat",
        "seragam": "pakai seragam",
        "tas": "pakai tas",
        "sepeda": "naik sepeda",
        "tiba": "sampai sekolah",
        "rebus": "rebus air",
        "tuang": "tuang ke cangkir",
        "minum": "minum teh"
      },
      "en": {
        "judul": "Off to School",
        "instruksi": "Put the pictures in order so getting to school the right way.",
        "sekolah": "Robot goes to school",
        "teh": "Making warm tea",
        "seragam": "put on uniform",
        "tas": "put on backpack",
        "sepeda": "ride the bike",
        "tiba": "arrive at school",
        "rebus": "boil water",
        "tuang": "pour into the cup",
        "minum": "drink the tea"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah langkah yang ditampilkan; mulai 3, naik ke 4"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "jalan-ke-sekolah",
    "mode": "susun",
    "sequences": [
      {
        "id": "sekolah",
        "titleKey": "sekolah",
        "steps": [
          {
            "id": "seragam",
            "labelKey": "seragam",
            "emoji": "👕"
          },
          {
            "id": "tas",
            "labelKey": "tas",
            "emoji": "🎒"
          },
          {
            "id": "sepeda",
            "labelKey": "sepeda",
            "emoji": "🚲"
          },
          {
            "id": "tiba",
            "labelKey": "tiba",
            "emoji": "🏫"
          }
        ]
      },
      {
        "id": "teh",
        "titleKey": "teh",
        "steps": [
          {
            "id": "rebus",
            "labelKey": "rebus",
            "emoji": "♨️"
          },
          {
            "id": "tuang",
            "labelKey": "tuang",
            "emoji": "🫖"
          },
          {
            "id": "minum",
            "labelKey": "minum",
            "emoji": "🍵"
          }
        ]
      }
    ]
  },
  {
    "id": "cerita-pertama-lalu-terakhir",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.TKA.URUTAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Cerita Pertama, Lalu, Terakhir",
        "instruksi": "Tempel label pertama, lalu, dan terakhir di bawah gambar, lalu tekan Ceritakan supaya robot bercerita.",
        "pagi": "Pagi hari",
        "bangun": "bangun tidur",
        "mandi": "mandi",
        "sarapan": "sarapan",
        "berangkat": "berangkat sekolah",
        "tanam": "Menanam biji",
        "gali": "gali tanah",
        "biji": "taruh biji",
        "siram": "siram air",
        "tumbuh": "tunas tumbuh"
      },
      "en": {
        "judul": "First, Then, Last Story",
        "instruksi": "Put the first, then, and last labels under the pictures, then press Tell so the robot tells the story.",
        "pagi": "Morning time",
        "bangun": "wake up",
        "mandi": "take a bath",
        "sarapan": "eat breakfast",
        "berangkat": "go to school",
        "tanam": "Planting a seed",
        "gali": "dig the soil",
        "biji": "put in the seed",
        "siram": "water it",
        "tumbuh": "a sprout grows"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah gambar; 3 = pertama/lalu/terakhir, 4 = dua label lalu"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "label",
    "sequences": [
      {
        "id": "pagi",
        "titleKey": "pagi",
        "steps": [
          {
            "id": "bangun",
            "labelKey": "bangun",
            "emoji": "🛏️"
          },
          {
            "id": "mandi",
            "labelKey": "mandi",
            "emoji": "🚿"
          },
          {
            "id": "sarapan",
            "labelKey": "sarapan",
            "emoji": "🍳"
          },
          {
            "id": "berangkat",
            "labelKey": "berangkat",
            "emoji": "🎒"
          }
        ]
      },
      {
        "id": "tanam",
        "titleKey": "tanam",
        "steps": [
          {
            "id": "gali",
            "labelKey": "gali",
            "emoji": "⛏️"
          },
          {
            "id": "biji",
            "labelKey": "biji",
            "emoji": "🌰"
          },
          {
            "id": "siram",
            "labelKey": "siram",
            "emoji": "🪣"
          },
          {
            "id": "tumbuh",
            "labelKey": "tumbuh",
            "emoji": "🌱"
          }
        ]
      }
    ]
  },
  {
    "id": "dari-kebun-ke-meja",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.TKA.URUTAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Dari Kebun ke Meja",
        "instruksi": "Susun gambar supaya ceritanya urut dari menanam sampai memanen.",
        "tanam": "Menanam apel",
        "sayur": "Memasak sayur",
        "biji": "tanam biji",
        "siram": "siram air",
        "bunga": "bunga mekar",
        "buah": "buah matang",
        "panen": "panen ke keranjang",
        "cuci": "cuci sayur",
        "potong": "potong sayur",
        "masak": "masak di panci",
        "sajikan": "sajikan di piring"
      },
      "en": {
        "judul": "From Garden to Table",
        "instruksi": "Put the pictures in order, from planting to harvest.",
        "tanam": "Growing an apple",
        "sayur": "Cooking vegetables",
        "biji": "plant the seed",
        "siram": "water it",
        "bunga": "blossom",
        "buah": "ripe fruit",
        "panen": "harvest into the basket",
        "cuci": "wash the vegetables",
        "potong": "chop them",
        "masak": "cook in the pot",
        "sajikan": "serve on a plate"
      }
    },
    "knobs": {
      "steps": {
        "min": 4,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah gambar yang ditampilkan: 4 → 5; tidak ada dua gambar yang bisa bertukar tanpa salah"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "susun",
    "sequences": [
      {
        "id": "tanam",
        "titleKey": "tanam",
        "steps": [
          {
            "id": "biji",
            "labelKey": "biji",
            "emoji": "🌱"
          },
          {
            "id": "siram",
            "labelKey": "siram",
            "emoji": "💧"
          },
          {
            "id": "bunga",
            "labelKey": "bunga",
            "emoji": "🌸"
          },
          {
            "id": "buah",
            "labelKey": "buah",
            "emoji": "🍎"
          },
          {
            "id": "panen",
            "labelKey": "panen",
            "emoji": "🧺"
          }
        ]
      },
      {
        "id": "sayur",
        "titleKey": "sayur",
        "steps": [
          {
            "id": "cuci",
            "labelKey": "cuci",
            "emoji": "🥬"
          },
          {
            "id": "potong",
            "labelKey": "potong",
            "emoji": "🔪"
          },
          {
            "id": "masak",
            "labelKey": "masak",
            "emoji": "🍲"
          },
          {
            "id": "sajikan",
            "labelKey": "sajikan",
            "emoji": "🍽️"
          }
        ]
      }
    ]
  },
  {
    "id": "hujan-dan-pesta-ulang-tahun",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.TKA.URUTAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Hujan dan Pesta",
        "instruksi": "Susun gambar supaya ceritanya urut dari awal sampai akhir.",
        "hujan": "Hujan lalu pelangi",
        "pesta": "Pesta ulang tahun",
        "awan": "awan datang",
        "turun": "hujan turun",
        "reda": "hujan reda",
        "pelangi": "pelangi muncul",
        "hias": "pasang balon",
        "kue": "kue datang",
        "tiup": "tiup lilin",
        "potong": "potong kue",
        "makan": "makan kue"
      },
      "en": {
        "judul": "Rain and the Party",
        "instruksi": "Put the pictures in order from the beginning to the end of the story.",
        "hujan": "Rain then rainbow",
        "pesta": "The robot's birthday party",
        "awan": "clouds gather",
        "turun": "rain falls",
        "reda": "rain stops",
        "pelangi": "a rainbow appears",
        "hias": "hang balloons",
        "kue": "the cake arrives",
        "tiup": "blow out the candle",
        "potong": "cut the cake",
        "makan": "eat the cake"
      }
    },
    "knobs": {
      "steps": {
        "min": 4,
        "max": 5,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah gambar yang ditampilkan: 4 → 5; tidak ada dua gambar yang bisa bertukar tanpa salah"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "pesta",
    "mode": "susun",
    "sequences": [
      {
        "id": "hujan",
        "titleKey": "hujan",
        "steps": [
          {
            "id": "awan",
            "labelKey": "awan",
            "emoji": "☁️"
          },
          {
            "id": "turun",
            "labelKey": "turun",
            "emoji": "🌧️"
          },
          {
            "id": "reda",
            "labelKey": "reda",
            "emoji": "⛅"
          },
          {
            "id": "pelangi",
            "labelKey": "pelangi",
            "emoji": "🌈"
          }
        ]
      },
      {
        "id": "pesta",
        "titleKey": "pesta",
        "steps": [
          {
            "id": "hias",
            "labelKey": "hias",
            "emoji": "🎈"
          },
          {
            "id": "kue",
            "labelKey": "kue",
            "emoji": "🎂"
          },
          {
            "id": "tiup",
            "labelKey": "tiup",
            "emoji": "🕯️"
          },
          {
            "id": "potong",
            "labelKey": "potong",
            "emoji": "🍰"
          },
          {
            "id": "makan",
            "labelKey": "makan",
            "emoji": "😋"
          }
        ]
      }
    ]
  },
  {
    "id": "kue-tiga-tahap-urut",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.TKB.DEKOMPOSISI.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Enam Langkah Membuat Kue",
        "instruksi": "Susun enam langkah membuat kue: dua langkah siapkan, dua campur, dua panggang.",
        "kue": "Membuat kue: siapkan, campur, panggang",
        "roti": "Membuat roti: siapkan, campur, panggang",
        "tepung": "ambil tepung",
        "telur": "ambil telur",
        "aduk": "aduk adonan",
        "tuang": "tuang ke loyang",
        "oven": "masukkan ke oven",
        "jadi": "kue matang",
        "ragi": "ambil ragi",
        "uleni": "uleni adonan",
        "bentuk": "bentuk roti",
        "roti2": "roti matang"
      },
      "en": {
        "judul": "Six Baking Steps",
        "instruksi": "Order the six cake steps: two to get ready, two to mix, two to bake.",
        "kue": "Baking: get ready, mix, bake",
        "roti": "Bread: get ready, mix, bake",
        "tepung": "get the flour",
        "telur": "get the eggs",
        "aduk": "stir the batter",
        "tuang": "pour into the tin",
        "oven": "put it in the oven",
        "jadi": "the cake is done",
        "ragi": "get the yeast",
        "uleni": "knead the dough",
        "bentuk": "shape the loaf",
        "roti2": "the bread is done"
      }
    },
    "knobs": {
      "steps": {
        "min": 4,
        "max": 6,
        "default": 6,
        "step": 1,
        "keterangan": "jumlah langkah tampil; 6 = tiga tahap lengkap"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "dapur",
    "mode": "susun",
    "sequences": [
      {
        "id": "kue",
        "titleKey": "kue",
        "steps": [
          {
            "id": "tepung",
            "labelKey": "tepung",
            "emoji": "🌾"
          },
          {
            "id": "telur",
            "labelKey": "telur",
            "emoji": "🥚"
          },
          {
            "id": "aduk",
            "labelKey": "aduk",
            "emoji": "🥄"
          },
          {
            "id": "tuang",
            "labelKey": "tuang",
            "emoji": "🥣"
          },
          {
            "id": "oven",
            "labelKey": "oven",
            "emoji": "♨️"
          },
          {
            "id": "jadi",
            "labelKey": "jadi",
            "emoji": "🎂"
          }
        ]
      },
      {
        "id": "roti",
        "titleKey": "roti",
        "steps": [
          {
            "id": "tepung2",
            "labelKey": "tepung",
            "emoji": "🌾"
          },
          {
            "id": "ragi",
            "labelKey": "ragi",
            "emoji": "🧂"
          },
          {
            "id": "uleni",
            "labelKey": "uleni",
            "emoji": "🤲"
          },
          {
            "id": "bentuk",
            "labelKey": "bentuk",
            "emoji": "🫓"
          },
          {
            "id": "oven2",
            "labelKey": "oven",
            "emoji": "♨️"
          },
          {
            "id": "roti2",
            "labelKey": "roti2",
            "emoji": "🍞"
          }
        ]
      }
    ]
  },
  {
    "id": "lanjutkan-hitungan-sampai-10",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "urutkan",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lanjut Hitung Sampai 10",
        "instruksi": "Robot berdiri di angka ini: susun kartu angka berikutnya, jangan mulai dari satu.",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "n6": "6",
        "n7": "7",
        "n8": "8",
        "n9": "9",
        "n10": "10",
        "dari2": "Lanjutkan dari 2",
        "dari4": "Lanjutkan dari 4",
        "dari5": "Lanjutkan dari 5",
        "dari7": "Lanjutkan dari 7"
      },
      "en": {
        "judul": "Keep Counting to 10",
        "instruksi": "Robot is standing on this number: lay out the next number cards, don't start from one.",
        "n3": "3",
        "n4": "4",
        "n5": "5",
        "n6": "6",
        "n7": "7",
        "n8": "8",
        "n9": "9",
        "n10": "10",
        "dari2": "Continue from 2",
        "dari4": "Continue from 4",
        "dari5": "Continue from 5",
        "dari7": "Continue from 7"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "panjang lanjutan yang disusun: 3 → 4 kartu"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "jalan-angka",
    "mode": "susun",
    "sequences": [
      {
        "id": "dari-2",
        "titleKey": "dari2",
        "steps": [
          {
            "id": "k3",
            "labelKey": "n3"
          },
          {
            "id": "k4",
            "labelKey": "n4"
          },
          {
            "id": "k5",
            "labelKey": "n5"
          }
        ]
      },
      {
        "id": "dari-4",
        "titleKey": "dari4",
        "steps": [
          {
            "id": "k5",
            "labelKey": "n5"
          },
          {
            "id": "k6",
            "labelKey": "n6"
          },
          {
            "id": "k7",
            "labelKey": "n7"
          },
          {
            "id": "k8",
            "labelKey": "n8"
          }
        ]
      },
      {
        "id": "dari-5",
        "titleKey": "dari5",
        "steps": [
          {
            "id": "k6",
            "labelKey": "n6"
          },
          {
            "id": "k7",
            "labelKey": "n7"
          },
          {
            "id": "k8",
            "labelKey": "n8"
          }
        ]
      },
      {
        "id": "dari-7",
        "titleKey": "dari7",
        "steps": [
          {
            "id": "k8",
            "labelKey": "n8"
          },
          {
            "id": "k9",
            "labelKey": "n9"
          },
          {
            "id": "k10",
            "labelKey": "n10"
          }
        ]
      }
    ]
  },
  {
    "id": "lanjutkan-hitungan-sampai-20",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "urutkan",
    "competencyIds": [
      "MAT.TKB.BILANGAN-20.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Lanjut Hitung Sampai 20",
        "instruksi": "Robot sudah sampai angka ini: susun kartu berikutnya sampai dua puluh.",
        "n9": "9",
        "n10": "10",
        "n11": "11",
        "n12": "12",
        "n13": "13",
        "n14": "14",
        "n15": "15",
        "n16": "16",
        "n17": "17",
        "n18": "18",
        "n19": "19",
        "n20": "20",
        "dari8": "Lanjutkan dari 8",
        "dari11": "Lanjutkan dari 11",
        "dari13": "Lanjutkan dari 13",
        "dari15": "Lanjutkan dari 15"
      },
      "en": {
        "judul": "Keep Counting to 20",
        "instruksi": "Robot has reached this number: lay out the next cards, up to twenty.",
        "n9": "9",
        "n10": "10",
        "n11": "11",
        "n12": "12",
        "n13": "13",
        "n14": "14",
        "n15": "15",
        "n16": "16",
        "n17": "17",
        "n18": "18",
        "n19": "19",
        "n20": "20",
        "dari8": "Continue from 8",
        "dari11": "Continue from 11",
        "dari13": "Continue from 13",
        "dari15": "Continue from 15"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "panjang lanjutan yang disusun: 3 → 5 kartu; jebakan setelah 9 memilih 01"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "jalan-angka",
    "mode": "susun",
    "sequences": [
      {
        "id": "dari-8",
        "titleKey": "dari8",
        "steps": [
          {
            "id": "k9",
            "labelKey": "n9"
          },
          {
            "id": "k10",
            "labelKey": "n10"
          },
          {
            "id": "k11",
            "labelKey": "n11"
          }
        ]
      },
      {
        "id": "dari-11",
        "titleKey": "dari11",
        "steps": [
          {
            "id": "k12",
            "labelKey": "n12"
          },
          {
            "id": "k13",
            "labelKey": "n13"
          },
          {
            "id": "k14",
            "labelKey": "n14"
          },
          {
            "id": "k15",
            "labelKey": "n15"
          }
        ]
      },
      {
        "id": "dari-13",
        "titleKey": "dari13",
        "steps": [
          {
            "id": "k14",
            "labelKey": "n14"
          },
          {
            "id": "k15",
            "labelKey": "n15"
          },
          {
            "id": "k16",
            "labelKey": "n16"
          },
          {
            "id": "k17",
            "labelKey": "n17"
          }
        ]
      },
      {
        "id": "dari-15",
        "titleKey": "dari15",
        "steps": [
          {
            "id": "k16",
            "labelKey": "n16"
          },
          {
            "id": "k17",
            "labelKey": "n17"
          },
          {
            "id": "k18",
            "labelKey": "n18"
          },
          {
            "id": "k19",
            "labelKey": "n19"
          },
          {
            "id": "k20",
            "labelKey": "n20"
          }
        ]
      }
    ]
  },
  {
    "id": "mana-dulu-alam",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.PAUD.URUTAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Dulu di Alam?",
        "instruksi": "Lihat dua gambar, lalu sentuh yang terjadi lebih dulu.",
        "telur": "Telur dan anak ayam",
        "biji": "Biji dan pohon",
        "ulat": "Ulat dan kupu-kupu",
        "awan": "Awan dan hujan",
        "bunga": "Bunga dan buah",
        "sTelur": "telur",
        "sAnak": "anak ayam",
        "sBiji": "tunas kecil",
        "sPohon": "pohon besar",
        "sUlat": "ulat",
        "sKupu": "kupu-kupu",
        "sAwan": "awan gelap",
        "sHujan": "hujan turun",
        "sBunga": "bunga mekar",
        "sBuah": "apel matang"
      },
      "en": {
        "judul": "Which Came First in Nature?",
        "instruksi": "Look at the two pictures, then touch the one that happens first.",
        "telur": "Egg and chick",
        "biji": "Seed and tree",
        "ulat": "Caterpillar and butterfly",
        "awan": "Cloud and rain",
        "bunga": "Blossom and fruit",
        "sTelur": "egg",
        "sAnak": "chick",
        "sBiji": "little sprout",
        "sPohon": "big tree",
        "sUlat": "caterpillar",
        "sKupu": "butterfly",
        "sAwan": "dark cloud",
        "sHujan": "rain falls",
        "sBunga": "blossom",
        "sBuah": "ripe apple"
      }
    },
    "knobs": {
      "steps": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua gambar; pasangan sebab-akibat jelas, tidak bisa dibolak-balik"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "dulu",
    "sequences": [
      {
        "id": "telur",
        "titleKey": "telur",
        "steps": [
          {
            "id": "telur",
            "labelKey": "sTelur",
            "emoji": "🥚"
          },
          {
            "id": "anak",
            "labelKey": "sAnak",
            "emoji": "🐥"
          }
        ]
      },
      {
        "id": "biji",
        "titleKey": "biji",
        "steps": [
          {
            "id": "tunas",
            "labelKey": "sBiji",
            "emoji": "🌱"
          },
          {
            "id": "pohon",
            "labelKey": "sPohon",
            "emoji": "🌳"
          }
        ]
      },
      {
        "id": "ulat",
        "titleKey": "ulat",
        "steps": [
          {
            "id": "ulat",
            "labelKey": "sUlat",
            "emoji": "🐛"
          },
          {
            "id": "kupu",
            "labelKey": "sKupu",
            "emoji": "🦋"
          }
        ]
      },
      {
        "id": "awan",
        "titleKey": "awan",
        "steps": [
          {
            "id": "awan",
            "labelKey": "sAwan",
            "emoji": "🌧️"
          },
          {
            "id": "hujan",
            "labelKey": "sHujan",
            "emoji": "☔"
          }
        ]
      },
      {
        "id": "bunga",
        "titleKey": "bunga",
        "steps": [
          {
            "id": "bunga",
            "labelKey": "sBunga",
            "emoji": "🌸"
          },
          {
            "id": "buah",
            "labelKey": "sBuah",
            "emoji": "🍎"
          }
        ]
      }
    ]
  },
  {
    "id": "mana-dulu-di-rumah",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.PAUD.URUTAN.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Mana Dulu di Rumah?",
        "instruksi": "Lihat dua gambar di rumah, lalu sentuh yang terjadi lebih dulu.",
        "nasi": "Piring nasi",
        "es": "Es batu",
        "kue": "Kue ulang tahun",
        "lilin": "Lilin",
        "balon": "Balon",
        "sPenuh": "piring penuh",
        "sKosong": "piring kosong",
        "sEs": "es batu",
        "sAir": "air",
        "sUtuh": "kue utuh",
        "sPotong": "kue dipotong",
        "sNyala": "lilin menyala",
        "sPadam": "lilin padam",
        "sKempis": "balon kempis",
        "sTiup": "balon besar"
      },
      "en": {
        "judul": "Which Came First at Home?",
        "instruksi": "Look at the two pictures from the house, then touch the one that happens first.",
        "nasi": "Plate of rice",
        "es": "Ice cube",
        "kue": "Birthday cake",
        "lilin": "Candle",
        "balon": "Balloon",
        "sPenuh": "full plate",
        "sKosong": "empty plate",
        "sEs": "ice cube",
        "sAir": "water",
        "sUtuh": "whole cake",
        "sPotong": "cake slice",
        "sNyala": "lit candle",
        "sPadam": "candle out",
        "sKempis": "flat balloon",
        "sTiup": "blown-up balloon"
      }
    },
    "knobs": {
      "steps": {
        "min": 2,
        "max": 2,
        "default": 2,
        "step": 1,
        "keterangan": "selalu dua gambar; pasangan sebab-akibat jelas, tidak bisa dibolak-balik"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "dulu",
    "sequences": [
      {
        "id": "nasi",
        "titleKey": "nasi",
        "steps": [
          {
            "id": "penuh",
            "labelKey": "sPenuh",
            "emoji": "🍚"
          },
          {
            "id": "kosong",
            "labelKey": "sKosong",
            "emoji": "🍽️"
          }
        ]
      },
      {
        "id": "es",
        "titleKey": "es",
        "steps": [
          {
            "id": "es",
            "labelKey": "sEs",
            "emoji": "🧊"
          },
          {
            "id": "air",
            "labelKey": "sAir",
            "emoji": "💧"
          }
        ]
      },
      {
        "id": "kue",
        "titleKey": "kue",
        "steps": [
          {
            "id": "utuh",
            "labelKey": "sUtuh",
            "emoji": "🎂"
          },
          {
            "id": "potong",
            "labelKey": "sPotong",
            "emoji": "🍰"
          }
        ]
      },
      {
        "id": "lilin",
        "titleKey": "lilin",
        "steps": [
          {
            "id": "nyala",
            "labelKey": "sNyala",
            "emoji": "🕯️"
          },
          {
            "id": "padam",
            "labelKey": "sPadam",
            "emoji": "💨"
          }
        ]
      },
      {
        "id": "balon",
        "titleKey": "balon",
        "steps": [
          {
            "id": "kempis",
            "labelKey": "sKempis",
            "emoji": "🫧"
          },
          {
            "id": "tiup",
            "labelKey": "sTiup",
            "emoji": "🎈"
          }
        ]
      }
    ]
  },
  {
    "id": "pensil-pendek-ke-panjang",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "MAT.TKA.BANDING.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pensil Pendek ke Panjang",
        "instruksi": "Susun pensil dari yang paling pendek ke yang paling panjang.",
        "pensil": "Pensil: pendek ke panjang",
        "kereta": "Kereta: pendek ke panjang",
        "pendek": "pendek",
        "sedang": "sedang",
        "panjang": "panjang",
        "terpanjang": "paling panjang"
      },
      "en": {
        "judul": "Pencils Short to Long",
        "instruksi": "Line up the pencils from the shortest to the longest.",
        "pensil": "Pencils: short to long",
        "kereta": "Trains: short to long",
        "pendek": "short",
        "sedang": "medium",
        "panjang": "long",
        "terpanjang": "longest"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah benda yang diurutkan: 3 → 4 (pengaya); beda panjang antar benda ≥ 20%"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "susun",
    "sequences": [
      {
        "id": "pensil",
        "titleKey": "pensil",
        "steps": [
          {
            "id": "pensil-1",
            "labelKey": "pendek",
            "emoji": "✏️",
            "width": 1
          },
          {
            "id": "pensil-2",
            "labelKey": "sedang",
            "emoji": "✏️",
            "width": 1.4
          },
          {
            "id": "pensil-3",
            "labelKey": "panjang",
            "emoji": "✏️",
            "width": 2
          }
        ]
      },
      {
        "id": "kereta",
        "titleKey": "kereta",
        "steps": [
          {
            "id": "kereta-1",
            "labelKey": "pendek",
            "emoji": "🚃",
            "width": 1
          },
          {
            "id": "kereta-2",
            "labelKey": "sedang",
            "emoji": "🚃",
            "width": 1.3
          },
          {
            "id": "kereta-3",
            "labelKey": "panjang",
            "emoji": "🚃",
            "width": 1.7
          },
          {
            "id": "kereta-4",
            "labelKey": "terpanjang",
            "emoji": "🚃",
            "width": 2.2
          }
        ]
      }
    ]
  },
  {
    "id": "perbaiki-urutan-kebun",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.TKA.DEBUG.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Urutan Kebun Tertukar",
        "instruksi": "Satu gambar di kebun tertukar: tukar dua gambar supaya urutannya benar.",
        "tanam": "Menanam bunga",
        "layang": "Main layang-layang",
        "gali": "gali tanah",
        "taruh": "taruh biji",
        "siram": "siram air",
        "mekar": "bunga mekar",
        "buat": "buat layang-layang",
        "lari": "lari sambil tarik",
        "terbang": "layang-layang terbang"
      },
      "en": {
        "judul": "Mixed-Up Garden Order",
        "instruksi": "One garden picture is swapped: swap two pictures to fix the order.",
        "tanam": "Planting a flower",
        "layang": "Flying a kite",
        "gali": "dig the soil",
        "taruh": "drop the seed",
        "siram": "water it",
        "mekar": "flower blooms",
        "buat": "make the kite",
        "lari": "run and pull",
        "terbang": "kite flies"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah gambar: 3 → 4; mesin menukar tepat satu pasang, anak menukar balik tepat sekali"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun",
    "mode": "perbaiki",
    "sequences": [
      {
        "id": "tanam",
        "titleKey": "tanam",
        "steps": [
          {
            "id": "gali",
            "labelKey": "gali",
            "emoji": "🪏"
          },
          {
            "id": "taruh",
            "labelKey": "taruh",
            "emoji": "🌰"
          },
          {
            "id": "siram",
            "labelKey": "siram",
            "emoji": "💧"
          },
          {
            "id": "mekar",
            "labelKey": "mekar",
            "emoji": "🌼"
          }
        ]
      },
      {
        "id": "layang",
        "titleKey": "layang",
        "steps": [
          {
            "id": "buat",
            "labelKey": "buat",
            "emoji": "✂️"
          },
          {
            "id": "lari",
            "labelKey": "lari",
            "emoji": "🏃"
          },
          {
            "id": "terbang",
            "labelKey": "terbang",
            "emoji": "🪁"
          }
        ]
      }
    ]
  },
  {
    "id": "perbaiki-urutan-pagi",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.TKA.DEBUG.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Urutan Pagi Tertukar",
        "instruksi": "Robot salah menyusun satu gambar: tukar dua gambar supaya urutannya benar.",
        "pagi": "Pagi hari",
        "mandi": "Robot mandi",
        "bangun": "bangun tidur",
        "gosok": "gosok gigi",
        "sarapan": "sarapan",
        "berangkat": "berangkat",
        "handuk": "ambil handuk",
        "siram": "siram badan",
        "sabun": "pakai sabun",
        "bilas": "bilas sampai bersih"
      },
      "en": {
        "judul": "Mixed-Up Morning Order",
        "instruksi": "Robot put one picture in the wrong place: swap two pictures to fix the order.",
        "pagi": "The morning",
        "mandi": "The robot's bath",
        "bangun": "wake up",
        "gosok": "brush teeth",
        "sarapan": "breakfast",
        "berangkat": "head out",
        "handuk": "get the towel",
        "siram": "pour water",
        "sabun": "soap up",
        "bilas": "rinse clean"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah gambar: 3 → 4; mesin menukar tepat satu pasang, anak menukar balik tepat sekali"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "perbaiki",
    "sequences": [
      {
        "id": "pagi",
        "titleKey": "pagi",
        "steps": [
          {
            "id": "bangun",
            "labelKey": "bangun",
            "emoji": "🌅"
          },
          {
            "id": "gosok",
            "labelKey": "gosok",
            "emoji": "🪥"
          },
          {
            "id": "sarapan",
            "labelKey": "sarapan",
            "emoji": "🍳"
          },
          {
            "id": "berangkat",
            "labelKey": "berangkat",
            "emoji": "🎒"
          }
        ]
      },
      {
        "id": "mandi",
        "titleKey": "mandi",
        "steps": [
          {
            "id": "handuk",
            "labelKey": "handuk",
            "emoji": "🧺"
          },
          {
            "id": "siram",
            "labelKey": "siram",
            "emoji": "🚿"
          },
          {
            "id": "sabun",
            "labelKey": "sabun",
            "emoji": "🧼"
          },
          {
            "id": "bilas",
            "labelKey": "bilas",
            "emoji": "✨"
          }
        ]
      }
    ]
  },
  {
    "id": "sains-biji-sampai-berbunga",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "SAINS.TKA.BAGIAN-TUMBUHAN.04"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Dari Biji Sampai Berbunga",
        "instruksi": "Susun gambar tanaman dari biji, tunas, berdaun, sampai berbunga.",
        "s-bungamatahari": "Bunga matahari tumbuh",
        "bungamatahari-biji": "biji di tanah",
        "bungamatahari-tunas": "tunas dua daun",
        "bungamatahari-daun": "berdaun banyak",
        "bungamatahari-bunga": "berbunga",
        "s-kacang": "Kacang tumbuh",
        "kacang-biji": "biji kacang",
        "kacang-tunas": "tunas kecil",
        "kacang-daun": "berdaun lebat",
        "kacang-bunga": "berbunga"
      },
      "en": {
        "judul": "From Seed to Flower",
        "instruksi": "Put the plant pictures in order: seed, sprout, leafy, then flowering.",
        "s-bungamatahari": "A sunflower grows",
        "bungamatahari-biji": "seed in the soil",
        "bungamatahari-tunas": "sprout with two leaves",
        "bungamatahari-daun": "many leaves",
        "bungamatahari-bunga": "flowering",
        "s-kacang": "A bean grows",
        "kacang-biji": "bean seed",
        "kacang-tunas": "little sprout",
        "kacang-daun": "lots of leaves",
        "kacang-bunga": "flowering"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah gambar: 3 (biji, tunas, berbunga) → 4 (tambah tahap berdaun banyak)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "susun",
    "sequences": [
      {
        "id": "bungamatahari",
        "titleKey": "s-bungamatahari",
        "steps": [
          {
            "id": "biji",
            "labelKey": "bungamatahari-biji",
            "emoji": "🌰",
            "scale": 0.6
          },
          {
            "id": "tunas",
            "labelKey": "bungamatahari-tunas",
            "emoji": "🌱",
            "scale": 0.8
          },
          {
            "id": "daun",
            "labelKey": "bungamatahari-daun",
            "emoji": "🌿",
            "scale": 1.1
          },
          {
            "id": "bunga",
            "labelKey": "bungamatahari-bunga",
            "emoji": "🌻",
            "scale": 1.3
          }
        ]
      },
      {
        "id": "kacang",
        "titleKey": "s-kacang",
        "steps": [
          {
            "id": "biji",
            "labelKey": "kacang-biji",
            "emoji": "🫘",
            "scale": 0.6
          },
          {
            "id": "tunas",
            "labelKey": "kacang-tunas",
            "emoji": "🌱",
            "scale": 0.8
          },
          {
            "id": "daun",
            "labelKey": "kacang-daun",
            "emoji": "🪴",
            "scale": 1.1
          },
          {
            "id": "bunga",
            "labelKey": "kacang-bunga",
            "emoji": "🌼",
            "scale": 1.3
          }
        ]
      }
    ]
  },
  {
    "id": "sains-cerah-mendung-hujan",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "urutkan",
    "competencyIds": [
      "SAINS.PAUD.SIANG-MALAM-CUACA.03"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Awan Datang, Hujan Turun",
        "instruksi": "Susun gambar langit dari cerah, lalu mendung, lalu hujan.",
        "s-hujan": "Hujan datang",
        "hujan-cerah": "langit cerah",
        "hujan-mendung": "awan tebal, langit gelap",
        "hujan-hujan": "hujan turun",
        "s-pelangi": "Sampai pelangi",
        "pelangi-cerah": "langit cerah",
        "pelangi-mendung": "awan tebal",
        "pelangi-hujan": "hujan turun",
        "pelangi-pelangi": "pelangi muncul",
        "s-awan": "Awan makin tebal",
        "awan-cerah": "langit cerah",
        "awan-tipis": "awan tipis datang",
        "awan-tebal": "awan tebal, langit gelap",
        "awan-hujan": "hujan turun"
      },
      "en": {
        "judul": "Clouds Come, Rain Falls",
        "instruksi": "Put the sky pictures in order: sunny, then cloudy, then rainy.",
        "s-hujan": "The rain comes",
        "hujan-cerah": "sunny sky",
        "hujan-mendung": "thick cloud, dark sky",
        "hujan-hujan": "rain falls",
        "s-pelangi": "Until the rainbow",
        "pelangi-cerah": "sunny sky",
        "pelangi-mendung": "thick cloud",
        "pelangi-hujan": "rain falls",
        "pelangi-pelangi": "a rainbow appears",
        "s-awan": "Clouds get thicker",
        "awan-cerah": "sunny sky",
        "awan-tipis": "a thin cloud comes",
        "awan-tebal": "thick cloud, dark sky",
        "awan-hujan": "rain falls"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah gambar: 3 (cerah, mendung, hujan) → 4 (tambah pelangi setelah hujan atau awan tipis sebelum tebal)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "susun",
    "sequences": [
      {
        "id": "hujan",
        "titleKey": "s-hujan",
        "steps": [
          {
            "id": "cerah",
            "labelKey": "hujan-cerah",
            "emoji": "☀️"
          },
          {
            "id": "mendung",
            "labelKey": "hujan-mendung",
            "emoji": "☁️",
            "color": "#90a4ae"
          },
          {
            "id": "hujan",
            "labelKey": "hujan-hujan",
            "emoji": "🌧️",
            "color": "#546e7a"
          }
        ]
      },
      {
        "id": "pelangi",
        "titleKey": "s-pelangi",
        "steps": [
          {
            "id": "cerah",
            "labelKey": "pelangi-cerah",
            "emoji": "☀️"
          },
          {
            "id": "mendung",
            "labelKey": "pelangi-mendung",
            "emoji": "☁️",
            "color": "#90a4ae"
          },
          {
            "id": "hujan",
            "labelKey": "pelangi-hujan",
            "emoji": "🌧️",
            "color": "#546e7a"
          },
          {
            "id": "pelangi",
            "labelKey": "pelangi-pelangi",
            "emoji": "🌈"
          }
        ]
      },
      {
        "id": "awan",
        "titleKey": "s-awan",
        "steps": [
          {
            "id": "cerah",
            "labelKey": "awan-cerah",
            "emoji": "☀️"
          },
          {
            "id": "tipis",
            "labelKey": "awan-tipis",
            "emoji": "⛅"
          },
          {
            "id": "tebal",
            "labelKey": "awan-tebal",
            "emoji": "☁️",
            "color": "#90a4ae"
          },
          {
            "id": "hujan",
            "labelKey": "awan-hujan",
            "emoji": "🌧️",
            "color": "#546e7a"
          }
        ]
      }
    ]
  },
  {
    "id": "sains-siklus-ayam",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "SAINS.TKA.SIKLUS-HIDUP.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Telur Jadi Ayam",
        "instruksi": "Susun gambar dari telur, anak ayam, sampai ayam dewasa.",
        "s-ayam": "Siklus hidup ayam",
        "ayam-telur": "telur",
        "ayam-retak": "telur retak, menetas",
        "ayam-anak": "anak ayam kuning",
        "ayam-dewasa": "ayam dewasa cokelat",
        "s-bebek": "Siklus hidup bebek",
        "bebek-telur": "telur bebek",
        "bebek-anak": "anak bebek kecil",
        "bebek-dewasa": "bebek dewasa"
      },
      "en": {
        "judul": "Egg to Chicken",
        "instruksi": "Put the pictures in order: egg, chick, then grown chicken.",
        "s-ayam": "Chicken life cycle",
        "ayam-telur": "egg",
        "ayam-retak": "egg cracks and hatches",
        "ayam-anak": "yellow chick",
        "ayam-dewasa": "grown brown hen",
        "s-bebek": "Duck life cycle",
        "bebek-telur": "duck egg",
        "bebek-anak": "little duckling",
        "bebek-dewasa": "grown duck"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah tahap: 3 (telur, anak ayam, ayam) → 4 (tambah telur retak menetas)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "halaman",
    "mode": "susun",
    "sequences": [
      {
        "id": "ayam",
        "titleKey": "s-ayam",
        "steps": [
          {
            "id": "telur",
            "labelKey": "ayam-telur",
            "emoji": "🥚",
            "scale": 0.8
          },
          {
            "id": "retak",
            "labelKey": "ayam-retak",
            "emoji": "🐣",
            "scale": 0.9
          },
          {
            "id": "anak",
            "labelKey": "ayam-anak",
            "emoji": "🐥",
            "scale": 1
          },
          {
            "id": "dewasa",
            "labelKey": "ayam-dewasa",
            "emoji": "🐔",
            "scale": 1.4,
            "color": "#8d6e63"
          }
        ]
      },
      {
        "id": "bebek",
        "titleKey": "s-bebek",
        "steps": [
          {
            "id": "telur",
            "labelKey": "bebek-telur",
            "emoji": "🥚",
            "scale": 0.8,
            "color": "#c8e6c9"
          },
          {
            "id": "anak",
            "labelKey": "bebek-anak",
            "emoji": "🐤",
            "scale": 1
          },
          {
            "id": "dewasa",
            "labelKey": "bebek-dewasa",
            "emoji": "🦆",
            "scale": 1.4
          }
        ]
      }
    ]
  },
  {
    "id": "sains-siklus-kupu-kupu",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "SAINS.TKA.SIKLUS-HIDUP.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ulat Jadi Kupu-kupu",
        "instruksi": "Susun gambar dari telur di daun, ulat, kepompong, sampai kupu-kupu.",
        "s-kupu": "Siklus hidup kupu-kupu",
        "kupu-telur": "telur kecil di daun",
        "kupu-ulat": "ulat makan daun",
        "kupu-kepompong": "kepompong menggantung",
        "kupu-kupu": "kupu-kupu terbang"
      },
      "en": {
        "judul": "Caterpillar to Butterfly",
        "instruksi": "Put the pictures in order: egg on a leaf, caterpillar, chrysalis, then butterfly.",
        "s-kupu": "Butterfly life cycle",
        "kupu-telur": "tiny egg on a leaf",
        "kupu-ulat": "caterpillar eating leaves",
        "kupu-kepompong": "chrysalis hanging",
        "kupu-kupu": "butterfly flies"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah tahap: 4 lengkap; 3 (tanpa telur) sebagai bantuan"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "susun",
    "sequences": [
      {
        "id": "kupu",
        "titleKey": "s-kupu",
        "steps": [
          {
            "id": "telur",
            "labelKey": "kupu-telur",
            "emoji": "🍃",
            "scale": 0.8
          },
          {
            "id": "ulat",
            "labelKey": "kupu-ulat",
            "emoji": "🐛"
          },
          {
            "id": "kepompong",
            "labelKey": "kupu-kepompong",
            "emoji": "🛡️",
            "color": "#a1887f"
          },
          {
            "id": "kupu",
            "labelKey": "kupu-kupu",
            "emoji": "🦋",
            "scale": 1.2
          }
        ]
      }
    ]
  },
  {
    "id": "sains-susun-tumbuhan-utuh",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "SAINS.TKA.BAGIAN-TUMBUHAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Susun Tumbuhan Utuh",
        "instruksi": "Susun potongan dari bawah tanah ke pucuk: akar, batang, daun, lalu bunga.",
        "s-bungamatahari": "Bunga matahari dari bawah ke atas",
        "bungamatahari-akar": "akar di dalam tanah",
        "bungamatahari-batang": "batang di atas tanah",
        "bungamatahari-daun": "daun di batang",
        "bungamatahari-bunga": "bunga di pucuk",
        "s-pohon": "Pohon kecil dari bawah ke atas",
        "pohon-akar": "akar di dalam tanah",
        "pohon-batang": "batang pohon",
        "pohon-daun": "daun rimbun"
      },
      "en": {
        "judul": "Build the Whole Plant",
        "instruksi": "Stack the pieces from under the ground to the top: root, stem, leaf, then flower.",
        "s-bungamatahari": "Sunflower from bottom to top",
        "bungamatahari-akar": "root under the soil",
        "bungamatahari-batang": "stem above the soil",
        "bungamatahari-daun": "leaf on the stem",
        "bungamatahari-bunga": "flower at the top",
        "s-pohon": "Little tree from bottom to top",
        "pohon-akar": "root under the soil",
        "pohon-batang": "tree trunk",
        "pohon-daun": "leafy top"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah potongan: 3 (akar, batang, bunga) → 4 (tambah daun di batang)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "kebun-pasar",
    "mode": "susun",
    "sequences": [
      {
        "id": "bungamatahari",
        "titleKey": "s-bungamatahari",
        "steps": [
          {
            "id": "akar",
            "labelKey": "bungamatahari-akar",
            "emoji": "🫚",
            "color": "#8d6e63"
          },
          {
            "id": "batang",
            "labelKey": "bungamatahari-batang",
            "emoji": "🎋"
          },
          {
            "id": "daun",
            "labelKey": "bungamatahari-daun",
            "emoji": "🍃"
          },
          {
            "id": "bunga",
            "labelKey": "bungamatahari-bunga",
            "emoji": "🌻"
          }
        ]
      },
      {
        "id": "pohon",
        "titleKey": "s-pohon",
        "steps": [
          {
            "id": "akar",
            "labelKey": "pohon-akar",
            "emoji": "🫚",
            "color": "#8d6e63"
          },
          {
            "id": "batang",
            "labelKey": "pohon-batang",
            "emoji": "🪵"
          },
          {
            "id": "daun",
            "labelKey": "pohon-daun",
            "emoji": "🌳"
          }
        ]
      }
    ]
  },
  {
    "id": "sains-urutkan-matahari-bumi-bulan",
    "version": "1.0.0",
    "level": "TKB",
    "mechanic": "urutkan",
    "competencyIds": [
      "SAINS.TKB.MATAHARI-BUMI-BULAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Paling Besar ke Paling Kecil di Langit",
        "instruksi": "Susun benda langit dari yang paling besar ke paling kecil: Matahari, Bumi, lalu Bulan.",
        "s-besar": "Dari paling besar",
        "besar-matahari": "Matahari paling besar",
        "besar-bumi": "Bumi",
        "besar-bulan": "Bulan paling kecil",
        "s-kecil": "Dari paling kecil",
        "kecil-bulan": "Bulan paling kecil",
        "kecil-bumi": "Bumi",
        "kecil-matahari": "Matahari paling besar"
      },
      "en": {
        "judul": "Biggest to Smallest in the Sky",
        "instruksi": "Put the space objects in order from biggest to smallest: Sun, Earth, then Moon.",
        "s-besar": "From the biggest",
        "besar-matahari": "the Sun, the biggest",
        "besar-bumi": "Earth",
        "besar-bulan": "the Moon, the smallest",
        "s-kecil": "From the smallest",
        "kecil-bulan": "the Moon, the smallest",
        "kecil-bumi": "Earth",
        "kecil-matahari": "the Sun, the biggest"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 3,
        "default": 3,
        "step": 1,
        "keterangan": "selalu tiga benda: Matahari, Bumi, Bulan; urutan kedua membalik arah (kecil ke besar)"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "angkasa",
    "mode": "susun",
    "sequences": [
      {
        "id": "besar",
        "titleKey": "s-besar",
        "steps": [
          {
            "id": "matahari",
            "labelKey": "besar-matahari",
            "emoji": "☀️",
            "scale": 2
          },
          {
            "id": "bumi",
            "labelKey": "besar-bumi",
            "emoji": "🌍",
            "scale": 1
          },
          {
            "id": "bulan",
            "labelKey": "besar-bulan",
            "emoji": "🌕",
            "scale": 0.5,
            "color": "#263238"
          }
        ]
      },
      {
        "id": "kecil",
        "titleKey": "s-kecil",
        "steps": [
          {
            "id": "bulan",
            "labelKey": "kecil-bulan",
            "emoji": "🌕",
            "scale": 0.5,
            "color": "#263238"
          },
          {
            "id": "bumi",
            "labelKey": "kecil-bumi",
            "emoji": "🌍",
            "scale": 1
          },
          {
            "id": "matahari",
            "labelKey": "kecil-matahari",
            "emoji": "☀️",
            "scale": 2
          }
        ]
      }
    ]
  },
  {
    "id": "siang-dan-malam",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.PAUD.URUTAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Siang dan Malam",
        "instruksi": "Susun gambar supaya kegiatan urut dari awal sampai akhir.",
        "makan": "Makan siang robot",
        "tidur": "Robot tidur malam",
        "cuci": "cuci tangan",
        "ambil": "ambil piring",
        "santap": "makan",
        "habis": "piring kosong",
        "sikat": "sikat gigi",
        "piyama": "pakai piyama",
        "lampu": "matikan lampu",
        "bobo": "tidur"
      },
      "en": {
        "judul": "Day and Night",
        "instruksi": "Put the pictures in order so the activity goes from start to finish.",
        "makan": "The robot's lunch",
        "tidur": "The robot's bedtime",
        "cuci": "wash hands",
        "ambil": "get a plate",
        "santap": "eat",
        "habis": "empty plate",
        "sikat": "brush teeth",
        "piyama": "put on pyjamas",
        "lampu": "turn off the light",
        "bobo": "sleep"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah langkah yang ditampilkan; mulai 3, naik ke 4"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "rumah",
    "mode": "susun",
    "sequences": [
      {
        "id": "makan",
        "titleKey": "makan",
        "steps": [
          {
            "id": "cuci",
            "labelKey": "cuci",
            "emoji": "🧼"
          },
          {
            "id": "ambil",
            "labelKey": "ambil",
            "emoji": "🍽️"
          },
          {
            "id": "santap",
            "labelKey": "santap",
            "emoji": "🍚"
          },
          {
            "id": "habis",
            "labelKey": "habis",
            "emoji": "✨"
          }
        ]
      },
      {
        "id": "tidur",
        "titleKey": "tidur",
        "steps": [
          {
            "id": "sikat",
            "labelKey": "sikat",
            "emoji": "🪥"
          },
          {
            "id": "piyama",
            "labelKey": "piyama",
            "emoji": "👕"
          },
          {
            "id": "lampu",
            "labelKey": "lampu",
            "emoji": "🌙"
          },
          {
            "id": "bobo",
            "labelKey": "bobo",
            "emoji": "😴"
          }
        ]
      }
    ]
  },
  {
    "id": "ular-pendek-ke-panjang",
    "version": "1.0.0",
    "level": "TKA",
    "mechanic": "urutkan",
    "competencyIds": [
      "MAT.TKA.BANDING.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Ular Pendek ke Panjang",
        "instruksi": "Susun ular dari yang paling pendek ke yang paling panjang.",
        "ular": "Ular: pendek ke panjang",
        "cacing": "Cacing: pendek ke panjang",
        "pendek": "pendek",
        "sedang": "sedang",
        "panjang": "panjang",
        "terpanjang": "paling panjang"
      },
      "en": {
        "judul": "Snakes Short to Long",
        "instruksi": "Line up the snakes from the shortest to the longest.",
        "ular": "Snakes: short to long",
        "cacing": "Worms: short to long",
        "pendek": "short",
        "sedang": "medium",
        "panjang": "long",
        "terpanjang": "longest"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 4,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah benda yang diurutkan: 3 → 4 (pengaya); beda panjang antar benda ≥ 20%"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 10,
    "world": "sungai",
    "mode": "susun",
    "sequences": [
      {
        "id": "ular",
        "titleKey": "ular",
        "steps": [
          {
            "id": "ular-1",
            "labelKey": "pendek",
            "emoji": "🐍",
            "width": 1
          },
          {
            "id": "ular-2",
            "labelKey": "sedang",
            "emoji": "🐍",
            "width": 1.4
          },
          {
            "id": "ular-3",
            "labelKey": "panjang",
            "emoji": "🐍",
            "width": 2
          }
        ]
      },
      {
        "id": "cacing",
        "titleKey": "cacing",
        "steps": [
          {
            "id": "cacing-1",
            "labelKey": "pendek",
            "emoji": "🪱",
            "width": 1
          },
          {
            "id": "cacing-2",
            "labelKey": "sedang",
            "emoji": "🪱",
            "width": 1.3
          },
          {
            "id": "cacing-3",
            "labelKey": "panjang",
            "emoji": "🪱",
            "width": 1.7
          },
          {
            "id": "cacing-4",
            "labelKey": "terpanjang",
            "emoji": "🪱",
            "width": 2.2
          }
        ]
      }
    ]
  },
  {
    "id": "hitung-ambil",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Kotak Kelereng",
        "instruksi": "Sentuh setiap kelereng satu per satu, lalu masukkan ke kotak yang angkanya pas.",
        "k1": "1",
        "k2": "2",
        "k3": "3",
        "k4": "4",
        "k5": "5",
        "kelereng": "kelereng"
      },
      "en": {
        "judul": "Marble Boxes",
        "instruksi": "Touch each marble one by one, then put the group in the box with the right number.",
        "k1": "1",
        "k2": "2",
        "k3": "3",
        "k4": "4",
        "k5": "5",
        "kelereng": "marbles"
      }
    },
    "knobs": {
      "maxCount": {
        "min": 2,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah terbesar yang muncul; bin di atas maxCount disembunyikan"
      },
      "itemCount": {
        "min": 4,
        "max": 8,
        "default": 4,
        "step": 1,
        "keterangan": "jumlah kelompok kelereng per putaran"
      }
    },
    "assets": [],
    "generatif": true,
    "bins": [
      {
        "id": "k1",
        "labelKey": "k1",
        "emoji": "📦"
      },
      {
        "id": "k2",
        "labelKey": "k2",
        "emoji": "📦"
      },
      {
        "id": "k3",
        "labelKey": "k3",
        "emoji": "📦"
      },
      {
        "id": "k4",
        "labelKey": "k4",
        "emoji": "📦"
      },
      {
        "id": "k5",
        "labelKey": "k5",
        "emoji": "📦"
      }
    ],
    "items": [
      {
        "id": "g1",
        "labelKey": "kelereng",
        "bin": "k1",
        "emoji": "🔵",
        "count": 1
      },
      {
        "id": "g2",
        "labelKey": "kelereng",
        "bin": "k2",
        "emoji": "🔵",
        "count": 2
      },
      {
        "id": "g3",
        "labelKey": "kelereng",
        "bin": "k3",
        "emoji": "🔵",
        "count": 3
      },
      {
        "id": "g4",
        "labelKey": "kelereng",
        "bin": "k4",
        "emoji": "🔵",
        "count": 4
      },
      {
        "id": "g5",
        "labelKey": "kelereng",
        "bin": "k5",
        "emoji": "🔵",
        "count": 5
      }
    ]
  },
  {
    "id": "keranjang-warna",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "pilah",
    "competencyIds": [
      "MAT.PAUD.WARNA.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Keranjang Warna",
        "instruksi": "Masukkan setiap benda ke keranjang yang warnanya sama.",
        "merah": "merah",
        "biru": "biru",
        "kuning": "kuning",
        "hijau": "hijau",
        "apel": "apel",
        "stroberi": "stroberi",
        "bola": "bola",
        "ikan": "ikan",
        "pisang": "pisang",
        "bebek": "bebek",
        "daun": "daun",
        "katak": "katak"
      },
      "en": {
        "judul": "Color Baskets",
        "instruksi": "Put each object into the basket with the same colour.",
        "merah": "red",
        "biru": "blue",
        "kuning": "yellow",
        "hijau": "green",
        "apel": "apple",
        "stroberi": "strawberry",
        "bola": "ball",
        "ikan": "fish",
        "pisang": "banana",
        "bebek": "duck",
        "daun": "leaf",
        "katak": "frog"
      }
    },
    "knobs": {
      "binCount": {
        "min": 2,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jumlah keranjang/warna aktif"
      },
      "itemCount": {
        "min": 4,
        "max": 12,
        "default": 6,
        "step": 2
      }
    },
    "assets": [],
    "generatif": true,
    "bins": [
      {
        "id": "merah",
        "labelKey": "merah",
        "emoji": "🧺",
        "color": "#e8646a"
      },
      {
        "id": "biru",
        "labelKey": "biru",
        "emoji": "🧺",
        "color": "#5b8fd6"
      },
      {
        "id": "kuning",
        "labelKey": "kuning",
        "emoji": "🧺",
        "color": "#fdc23e"
      },
      {
        "id": "hijau",
        "labelKey": "hijau",
        "emoji": "🧺",
        "color": "#5db57c"
      }
    ],
    "items": [
      {
        "id": "apel",
        "labelKey": "apel",
        "bin": "merah",
        "emoji": "🍎"
      },
      {
        "id": "stroberi",
        "labelKey": "stroberi",
        "bin": "merah",
        "emoji": "🍓"
      },
      {
        "id": "bola",
        "labelKey": "bola",
        "bin": "biru",
        "emoji": "🔵"
      },
      {
        "id": "ikan",
        "labelKey": "ikan",
        "bin": "biru",
        "emoji": "🐟"
      },
      {
        "id": "pisang",
        "labelKey": "pisang",
        "bin": "kuning",
        "emoji": "🍌"
      },
      {
        "id": "bebek",
        "labelKey": "bebek",
        "bin": "kuning",
        "emoji": "🐤"
      },
      {
        "id": "daun",
        "labelKey": "daun",
        "bin": "hijau",
        "emoji": "🍃"
      },
      {
        "id": "katak",
        "labelKey": "katak",
        "bin": "hijau",
        "emoji": "🐸"
      }
    ]
  },
  {
    "id": "pasar-buah-1-5",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "dagang",
    "competencyIds": [
      "MAT.PAUD.BILANGAN-1-5.01",
      "MAT.PAUD.BILANGAN-1-5.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Pasar Buah",
        "instruksi": "Pembeli datang. Dengarkan, lalu ambil buah sebanyak yang diminta.",
        "jeruk": "jeruk",
        "apel": "apel",
        "pisang": "pisang",
        "mangga": "mangga"
      },
      "en": {
        "judul": "Fruit Market",
        "instruksi": "A customer is here. Listen, then pick as many fruits as they ask for.",
        "jeruk": "orange",
        "apel": "apple",
        "pisang": "banana",
        "mangga": "mango"
      }
    },
    "knobs": {
      "itemsMax": {
        "min": 1,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah buah maksimum per pesanan"
      },
      "kinds": {
        "min": 1,
        "max": 2,
        "default": 1,
        "step": 1,
        "keterangan": "berapa jenis buah dalam satu pesanan"
      }
    },
    "assets": [
      {
        "id": "jeruk",
        "kind": "image",
        "path": "fruits/jeruk.png"
      },
      {
        "id": "apel",
        "kind": "image",
        "path": "fruits/apel.png"
      },
      {
        "id": "pisang",
        "kind": "image",
        "path": "fruits/pisang.png"
      },
      {
        "id": "mangga",
        "kind": "image",
        "path": "fruits/mangga.png"
      }
    ],
    "generatif": true,
    "currency": "IDR",
    "denominations": [
      1000
    ],
    "goods": [
      {
        "id": "jeruk",
        "labelKey": "jeruk",
        "price": 1000,
        "assetId": "jeruk",
        "emoji": "🍊"
      },
      {
        "id": "apel",
        "labelKey": "apel",
        "price": 1000,
        "assetId": "apel",
        "emoji": "🍎"
      },
      {
        "id": "pisang",
        "labelKey": "pisang",
        "price": 1000,
        "assetId": "pisang",
        "emoji": "🍌"
      },
      {
        "id": "mangga",
        "labelKey": "mangga",
        "price": 1000,
        "assetId": "mangga",
        "emoji": "🥭"
      }
    ],
    "customerRule": {
      "itemsMin": 1,
      "itemsMax": 5,
      "payExact": true,
      "maxTotal": 5000
    }
  },
  {
    "id": "robot-ke-bintang-lurus",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "navigasi",
    "competencyIds": [
      "KODE.PAUD.PERINTAH.01"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Robot ke Bintang",
        "instruksi": "Tekan 'maju' sampai robot sampai di bintang, lalu tekan jalan."
      },
      "en": {
        "judul": "Robot to the Star",
        "instruksi": "Press 'forward' until robot reaches the star, then press go."
      }
    },
    "knobs": {
      "distance": {
        "min": 1,
        "max": 4,
        "default": 2,
        "step": 1,
        "keterangan": "jarak ke bintang; memilih grid dengan optimal = distance"
      }
    },
    "assets": [],
    "generatif": false,
    "commands": [
      "maju"
    ],
    "grids": [
      {
        "id": "lurus-1",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 1,
          "y": 0
        },
        "walls": [],
        "optimal": 1
      },
      {
        "id": "lurus-2",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 2,
          "y": 0
        },
        "walls": [],
        "optimal": 2
      },
      {
        "id": "lurus-3",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 3,
          "y": 0
        },
        "walls": [],
        "optimal": 3
      },
      {
        "id": "lurus-4",
        "w": 5,
        "h": 1,
        "start": {
          "x": 0,
          "y": 0,
          "dir": "E"
        },
        "goal": {
          "x": 4,
          "y": 0
        },
        "walls": [],
        "optimal": 4
      }
    ]
  },
  {
    "id": "urutan-pagi-hari",
    "version": "1.0.0",
    "level": "PAUD",
    "mechanic": "urutkan",
    "competencyIds": [
      "KODE.PAUD.URUTAN.02"
    ],
    "instructionKey": "instruksi",
    "locale": {
      "id": {
        "judul": "Urutan Pagi Hari",
        "instruksi": "Susun gambar supaya pagi hari berurutan.",
        "pagi": "Pagi hari",
        "bangun": "bangun tidur",
        "gosok": "gosok gigi",
        "sarapan": "sarapan",
        "tanam": "Menanam biji",
        "gali": "gali tanah",
        "taruh": "taruh biji",
        "siram": "siram air",
        "tumbuh": "tunas tumbuh"
      },
      "en": {
        "judul": "Morning Routine",
        "instruksi": "Put the pictures in order so The morning makes sense.",
        "pagi": "The morning",
        "bangun": "wake up",
        "gosok": "brush teeth",
        "sarapan": "breakfast",
        "tanam": "Planting a seed",
        "gali": "dig the soil",
        "taruh": "put the seed",
        "siram": "water it",
        "tumbuh": "a sprout grows"
      }
    },
    "knobs": {
      "steps": {
        "min": 3,
        "max": 5,
        "default": 3,
        "step": 1,
        "keterangan": "jumlah langkah yang ditampilkan; urutan lebih panjang diambil dari sequence yang punya langkah cukup"
      }
    },
    "assets": [],
    "generatif": true,
    "sequences": [
      {
        "id": "pagi",
        "titleKey": "pagi",
        "steps": [
          {
            "id": "bangun",
            "labelKey": "bangun",
            "emoji": "🛏️"
          },
          {
            "id": "gosok",
            "labelKey": "gosok",
            "emoji": "🪥"
          },
          {
            "id": "sarapan",
            "labelKey": "sarapan",
            "emoji": "🍳"
          }
        ]
      },
      {
        "id": "tanam",
        "titleKey": "tanam",
        "steps": [
          {
            "id": "gali",
            "labelKey": "gali",
            "emoji": "⛏️"
          },
          {
            "id": "taruh",
            "labelKey": "taruh",
            "emoji": "🌰"
          },
          {
            "id": "siram",
            "labelKey": "siram",
            "emoji": "🚿"
          },
          {
            "id": "tumbuh",
            "labelKey": "tumbuh",
            "emoji": "🌱"
          }
        ]
      }
    ]
  }
];
