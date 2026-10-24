// DIBUAT OTOMATIS oleh scripts/akademi-index.ts — jangan diedit.
// Sumber: content/kurikulum/*.json (6 berkas) dan content/paket/**/*.json (122 berkas).
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
        "min": 2,
        "max": 5,
        "default": 2,
        "step": 3,
        "keterangan": "nilai lembar yang ditukar (ribuan): dua ribu dulu, lalu lima ribu"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 4,
    "world": "pasar",
    "currency": "IDR",
    "denominations": [
      1000
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
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 5000,
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
    "rounds": 5,
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
    "rounds": 5,
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
        "min": 2,
        "max": 5,
        "default": 2,
        "step": 3,
        "keterangan": "nilai lembar yang ditukar (ribuan): dua ribu dulu, lalu lima ribu"
      }
    },
    "assets": [],
    "generatif": true,
    "rounds": 4,
    "world": "bank-mini",
    "currency": "IDR",
    "denominations": [
      1000
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
      "itemsMax": 1,
      "payExact": true,
      "maxTotal": 5000,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 6,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 6,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 6,
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
    "rounds": 6,
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
    "rounds": 6,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 6,
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
    "rounds": 5,
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
    "rounds": 6,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 5,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
    "rounds": 4,
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
