# Keputusan 08 — SAINS SD6 & KODE SD6

Validasi skema: 810 paket valid. `akademi:audit`: ERROR 0; tidak ada temuan (ERROR/WARNING) untuk paket sd6-sains/sd6-kode, termasuk `soal-berulang-satu-sesi`.

## Keputusan yang diambil

| butir | keputusan | perubahan |
|---|---|---|
| Fosil "tertimbun ↔ membusuk" bebas tukar (SAINS.SD6.BATUAN.02) | (a) gabungkan menjadi satu langkah di semua urutan yang kena | urutkan/sd6-sains-terbentuknya-fosil 1.2.1 → 1.2.2: langkah `busuk`/`amber-3`/`mamut-3` digabung ke langkah timbun ("<tertimbun …>; <bagian lunak membusuk …> tertinggal") di urutan cangkang, dino, ikan, amber, hiu, mamut, burung, penyu (8 urutan); semua urutan kini 5 langkah; knob steps max 6 → 5 (min 4, default 5). urutkan/sd6-sains-terbentuknya-fosil-perbaiki 1.0.1 → 1.0.2: sama untuk amonit, trilobit, stegodon, bulubabi, kepiting, buaya, tengkorak (7 urutan); pakis: timbun + cetak digabung ("daun tertutup lumpur halus, lalu hancur; cetakannya tertinggal di lumpur") dan ditambah langkah `angkat` ⛰️ "lapisan batu terangkat menjadi bukit" sebelum `singkap`, supaya tetap 5 langkah; knob max 6 → 5. Tambahan (aturan hindari "babi"): "Fosil bulu babi" → "Fosil landak laut", "bulu babi purba mati…" → "landak laut purba mati…" (id urutan internal tetap `bulubabi`; EN tetap "sea urchin") |
| Kapiler darah langkah 3–4 serentak (SAINS.SD6.SIRKULASI.01) | gabungkan menjadi satu langkah | Langkah kapiler + "sel menyerahkan karbon dioksida" kini satu langkah "di kapiler …, oksigen (dan sari makanan) masuk ke sel, karbon dioksida masuk ke darah" di semua urutan yang menuju organ |
| Variasi semu peredaran darah (8 dari 11 urutan hanya ganti organ) | tulis ulang paket dengan konteks berbeda nyata | urutkan/sd6-sains-aliran-darah 1.1.1 → 1.1.2 dan urutkan/sd6-sains-aliran-darah-perbaiki 1.1.0 → 1.1.1 (isi urutan sama di kedua paket, mode beda): 11 urutan, semua 5 langkah: tubuh (diakhiri "jantung memompa darah itu ke paru-paru"), paru → "Satu putaran lengkap" (paru → jantung → tubuh → kapiler), otak (arteri/vena di leher), BARU: lari (jantung berdetak lebih cepat), katup (darah naik dari telapak kaki; otot betis + katup vena), ginjal (menyaring sisa zat), usus (menyerap sari makanan → hati), koroner (otot jantung sendiri), oksigen (dari hirup udara sampai sel otot lengan), karbon (dari sel otot sampai diembuskan), parupanjang (tetap). Dihapus: kaki, lengan, tangan, telinga, lidah, hidung, mata (pola sama). Instruksi susun "…mulai dari jantung memompa" → "…dari langkah pertama sampai terakhir" (tidak semua urutan mulai dari jantung). Knob steps 4–5, default 5 (semua 11 urutan jadi kandidat, 10 ronde tanpa soal berulang). Pernyataan kompetensi tidak diubah (tetap cocok) |

## Kalimat suara berubah

Dibuat otomatis dengan membandingkan locale.id ke `git show HEAD:<berkas>`. Untuk aliran darah, kunci lama urutan yang dihapus/ditata ulang tercatat sebagai "(dihapus)" dan kunci baru sebagai "(baru)".

| paket | kunci | lama | baru |
|---|---|---|---|
| sd6-sains-terbentuknya-fosil | cangkang-timbun | tertimbun lumpur dan pasir | tertimbun lumpur dan pasir; bagian lunak membusuk, cangkang tertinggal |
| sd6-sains-terbentuknya-fosil | cangkang-busuk | bagian lunak membusuk, cangkang tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | dino-timbun | tubuhnya tertimbun lumpur sungai | tubuhnya tertimbun lumpur sungai; daging membusuk, tulang tertinggal |
| sd6-sains-terbentuknya-fosil | dino-busuk | daging membusuk, tulang tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | ikan-timbun | tertutup lumpur halus | tertutup lumpur halus; bagian lunak membusuk, tulang dan sisik tertinggal |
| sd6-sains-terbentuknya-fosil | ikan-busuk | bagian lunak membusuk, tulang dan sisik tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | hiu-timbun | tertimbun pasir dan lumpur | tertimbun pasir dan lumpur; bagian lunak hancur, gigi yang keras tertinggal |
| sd6-sains-terbentuknya-fosil | hiu-busuk | bagian lunak hancur, gigi yang keras tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | burung-timbun | tertutup lumpur yang sangat halus | tertutup lumpur yang sangat halus; daging membusuk, tulang dan bekas bulu tertinggal |
| sd6-sains-terbentuknya-fosil | burung-busuk | daging membusuk, tulang dan bekas bulu tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | penyu-timbun | tertimbun pasir | tertimbun pasir; bagian lunak membusuk, tempurung dan tulang tertinggal |
| sd6-sains-terbentuknya-fosil | penyu-busuk | bagian lunak membusuk, tempurung dan tulang tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | amber-2 | cangkangnya tertutup pasir dan lumpur | cangkangnya tertutup pasir dan lumpur; bagian lunak membusuk, cangkang keras tertinggal |
| sd6-sains-terbentuknya-fosil | amber-3 | bagian lunak membusuk, cangkang keras tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil | mamut-2 | banjir menimbunnya dengan lumpur | banjir menimbunnya dengan lumpur; daging membusuk, tulang dan gading tertinggal |
| sd6-sains-terbentuknya-fosil | mamut-3 | daging membusuk, tulang dan gading tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | amonit-timbun | cangkangnya tertimbun lumpur | cangkangnya tertimbun lumpur; bagian lunak membusuk, cangkang spiral tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | amonit-busuk | bagian lunak membusuk, cangkang spiral tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | trilobit-timbun | tubuhnya tertutup pasir halus | tubuhnya tertutup pasir halus; bagian lunak hancur, kulit kerasnya tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | trilobit-busuk | bagian lunak hancur, kulit kerasnya tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | stegodon-timbun | tubuhnya tertimbun lumpur dan pasir sungai | tubuhnya tertimbun lumpur dan pasir sungai; daging membusuk, tulang dan gadingnya tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | stegodon-busuk | daging membusuk, tulang dan gadingnya tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | pakis-timbun | daun tertutup lumpur halus | daun tertutup lumpur halus, lalu hancur; cetakannya tertinggal di lumpur |
| sd6-sains-terbentuknya-fosil-perbaiki | pakis-cetak | daun hancur, cetakannya tertinggal di lumpur | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | s-bulubabi | Fosil bulu babi | Fosil landak laut |
| sd6-sains-terbentuknya-fosil-perbaiki | bulubabi-mati | bulu babi purba mati di laut dangkal | landak laut purba mati di laut dangkal |
| sd6-sains-terbentuknya-fosil-perbaiki | bulubabi-timbun | tertimbun pasir dan pecahan karang | tertimbun pasir dan pecahan karang; duri lepas, cangkang bulatnya tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | bulubabi-busuk | duri lepas, cangkang bulatnya tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | kepiting-timbun | tertimbun lumpur muara | tertimbun lumpur muara; bagian dalam membusuk, cangkang kerasnya tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | kepiting-busuk | bagian dalam membusuk, cangkang kerasnya tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | buaya-timbun | banjir menimbun tubuhnya dengan lumpur | banjir menimbun tubuhnya dengan lumpur; daging membusuk, tulang dan giginya tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | buaya-busuk | daging membusuk, tulang dan giginya tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | tengkorak-timbun | tubuhnya tertimbun pasir dan abu gunung api | tubuhnya tertimbun pasir dan abu gunung api; bagian lunak hancur, tengkoraknya tertinggal |
| sd6-sains-terbentuknya-fosil-perbaiki | tengkorak-busuk | bagian lunak hancur, tengkoraknya tertinggal | (dihapus) |
| sd6-sains-terbentuknya-fosil-perbaiki | pakis-angkat | (baru) | lapisan batu terangkat menjadi bukit |
| sd6-sains-aliran-darah | instruksi | Baca judulnya, lalu susun perjalanan darah, mulai dari jantung memompa. | Baca judulnya, lalu susun perjalanan darah dari langkah pertama sampai terakhir. |
| sd6-sains-aliran-darah | tubuh-kapiler | kapiler: oksigen dan sari makanan masuk ke sel | di kapiler, oksigen dan sari makanan masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | tubuh-sisa | sel menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | tubuh-vena | vena membawa darah kembali ke jantung | vena membawa darah miskin oksigen kembali ke jantung |
| sd6-sains-aliran-darah | s-paru | Darah ke paru-paru | Satu putaran lengkap |
| sd6-sains-aliran-darah | paru-pompa | jantung memompa darah ke paru-paru | jantung memompa darah miskin oksigen ke paru-paru |
| sd6-sains-aliran-darah | paru-ambil | di paru-paru darah melepas karbon dioksida dan mengambil oksigen | di paru-paru, darah melepas karbon dioksida dan mengambil oksigen |
| sd6-sains-aliran-darah | paru-ketubuh | jantung memompanya ke seluruh tubuh | jantung memompanya lewat arteri ke seluruh tubuh |
| sd6-sains-aliran-darah | s-otak | Darah menuju otak | Darah naik ke otak |
| sd6-sains-aliran-darah | otak-arteri | arteri membawa darah ke otak | arteri di leher membawa darah naik ke otak |
| sd6-sains-aliran-darah | otak-kapiler | di kapiler otak, oksigen dan sari makanan masuk ke sel | di kapiler otak, oksigen dan sari makanan masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | otak-sisa | sel otak menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | otak-vena | vena membawa darah kembali ke jantung | vena di leher membawa darah turun dari otak |
| sd6-sains-aliran-darah | s-kaki | Darah menuju otot kaki | (dihapus) |
| sd6-sains-aliran-darah | kaki-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | kaki-arteri | arteri membawa darah ke otot kaki | (dihapus) |
| sd6-sains-aliran-darah | kaki-kapiler | di kapiler otot kaki, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | kaki-sisa | sel otot kaki menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | kaki-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | s-lengan | Darah menuju otot lengan | (dihapus) |
| sd6-sains-aliran-darah | lengan-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | lengan-arteri | arteri membawa darah ke otot lengan | (dihapus) |
| sd6-sains-aliran-darah | lengan-kapiler | di kapiler otot lengan, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | lengan-sisa | sel otot lengan menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | lengan-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | s-tangan | Darah menuju jari tangan | (dihapus) |
| sd6-sains-aliran-darah | tangan-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | tangan-arteri | arteri membawa darah ke jari tangan | (dihapus) |
| sd6-sains-aliran-darah | tangan-kapiler | di kapiler jari tangan, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | tangan-sisa | sel jari tangan menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | tangan-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | s-telinga | Darah menuju telinga | (dihapus) |
| sd6-sains-aliran-darah | telinga-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | telinga-arteri | arteri membawa darah ke telinga | (dihapus) |
| sd6-sains-aliran-darah | telinga-kapiler | di kapiler telinga, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | telinga-sisa | sel telinga menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | telinga-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | s-lidah | Darah menuju lidah | (dihapus) |
| sd6-sains-aliran-darah | lidah-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | lidah-arteri | arteri membawa darah ke lidah | (dihapus) |
| sd6-sains-aliran-darah | lidah-kapiler | di kapiler lidah, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | lidah-sisa | sel lidah menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | lidah-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | s-hidung | Darah menuju hidung | (dihapus) |
| sd6-sains-aliran-darah | hidung-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | hidung-arteri | arteri membawa darah ke hidung | (dihapus) |
| sd6-sains-aliran-darah | hidung-kapiler | di kapiler hidung, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | hidung-sisa | sel hidung menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | hidung-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | s-mata | Darah menuju mata | (dihapus) |
| sd6-sains-aliran-darah | mata-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah | mata-arteri | arteri membawa darah ke mata | (dihapus) |
| sd6-sains-aliran-darah | mata-kapiler | di kapiler mata, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah | mata-sisa | sel mata menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah | mata-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah | tubuh-keparu | (baru) | jantung memompa darah itu ke paru-paru untuk mengambil oksigen lagi |
| sd6-sains-aliran-darah | paru-kapiler | (baru) | di kapiler tubuh, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | otak-tiba | (baru) | darah tiba kembali di jantung |
| sd6-sains-aliran-darah | s-lari | (baru) | Jantung saat kamu berlari |
| sd6-sains-aliran-darah | lari-mulai | (baru) | kamu berlari, otot kaki butuh lebih banyak oksigen |
| sd6-sains-aliran-darah | lari-cepat | (baru) | jantung berdetak lebih cepat dan lebih kuat |
| sd6-sains-aliran-darah | lari-arteri | (baru) | arteri membawa lebih banyak darah ke otot kaki |
| sd6-sains-aliran-darah | lari-kapiler | (baru) | di kapiler otot kaki, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | lari-vena | (baru) | vena membawa darah kembali ke jantung |
| sd6-sains-aliran-darah | s-katup | (baru) | Darah naik dari telapak kaki |
| sd6-sains-aliran-darah | katup-pompa | (baru) | jantung memompa darah kaya oksigen ke kaki |
| sd6-sains-aliran-darah | katup-arteri | (baru) | arteri membawa darah turun sampai telapak kaki |
| sd6-sains-aliran-darah | katup-kapiler | (baru) | di kapiler telapak kaki, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | katup-vena | (baru) | darah masuk ke vena kaki |
| sd6-sains-aliran-darah | katup-naik | (baru) | otot betis memeras vena dan katupnya menahan darah, jadi darah naik ke jantung |
| sd6-sains-aliran-darah | s-ginjal | (baru) | Darah dibersihkan di ginjal |
| sd6-sains-aliran-darah | ginjal-pompa | (baru) | jantung memompa darah kaya oksigen |
| sd6-sains-aliran-darah | ginjal-arteri | (baru) | arteri ginjal membawa darah ke ginjal |
| sd6-sains-aliran-darah | ginjal-saring | (baru) | ginjal menyaring sisa zat dan air berlebih dari darah |
| sd6-sains-aliran-darah | ginjal-vena | (baru) | darah yang sudah bersih keluar lewat vena ginjal |
| sd6-sains-aliran-darah | ginjal-tiba | (baru) | vena besar membawa darah itu kembali ke jantung |
| sd6-sains-aliran-darah | s-usus | (baru) | Darah menjemput sari makanan |
| sd6-sains-aliran-darah | usus-pompa | (baru) | jantung memompa darah kaya oksigen |
| sd6-sains-aliran-darah | usus-arteri | (baru) | arteri membawa darah ke dinding usus |
| sd6-sains-aliran-darah | usus-serap | (baru) | di kapiler usus, darah menyerap sari makanan |
| sd6-sains-aliran-darah | usus-hati | (baru) | vena membawa darah kaya sari makanan ke hati |
| sd6-sains-aliran-darah | usus-tiba | (baru) | dari hati, darah mengalir kembali ke jantung |
| sd6-sains-aliran-darah | s-koroner | (baru) | Darah untuk otot jantung sendiri |
| sd6-sains-aliran-darah | koroner-pompa | (baru) | jantung memompa darah kaya oksigen ke aorta |
| sd6-sains-aliran-darah | koroner-arteri | (baru) | arteri koroner membawa sebagian darah ke otot jantung |
| sd6-sains-aliran-darah | koroner-kapiler | (baru) | di kapiler otot jantung, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | koroner-vena | (baru) | vena jantung mengumpulkan darah miskin oksigen |
| sd6-sains-aliran-darah | koroner-tiba | (baru) | darah itu masuk kembali ke dalam jantung |
| sd6-sains-aliran-darah | s-oksigen | (baru) | Oksigen dari udara sampai ke otot |
| sd6-sains-aliran-darah | oksigen-hirup | (baru) | kamu menghirup udara, oksigen masuk ke paru-paru |
| sd6-sains-aliran-darah | oksigen-masuk | (baru) | di kapiler paru-paru, oksigen masuk ke darah |
| sd6-sains-aliran-darah | oksigen-venaparu | (baru) | vena paru-paru membawa darah kaya oksigen ke jantung |
| sd6-sains-aliran-darah | oksigen-pompa | (baru) | jantung memompa darah itu lewat arteri ke otot lengan |
| sd6-sains-aliran-darah | oksigen-sel | (baru) | di kapiler otot lengan, oksigen masuk ke sel otot |
| sd6-sains-aliran-darah | s-karbon | (baru) | Karbon dioksida keluar dari tubuh |
| sd6-sains-aliran-darah | karbon-buat | (baru) | sel otot memakai oksigen dan menghasilkan karbon dioksida |
| sd6-sains-aliran-darah | karbon-masuk | (baru) | di kapiler, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah | karbon-vena | (baru) | vena membawa darah itu ke jantung |
| sd6-sains-aliran-darah | karbon-pompa | (baru) | jantung memompanya ke paru-paru |
| sd6-sains-aliran-darah | karbon-embus | (baru) | di paru-paru, karbon dioksida dilepas dan diembuskan keluar |
| sd6-sains-aliran-darah-perbaiki | tubuh-kapiler | kapiler: oksigen dan sari makanan masuk ke sel | di kapiler, oksigen dan sari makanan masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | tubuh-sisa | sel menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tubuh-vena | vena membawa darah kembali ke jantung | vena membawa darah miskin oksigen kembali ke jantung |
| sd6-sains-aliran-darah-perbaiki | s-paru | Darah ke paru-paru | Satu putaran lengkap |
| sd6-sains-aliran-darah-perbaiki | paru-pompa | jantung memompa darah ke paru-paru | jantung memompa darah miskin oksigen ke paru-paru |
| sd6-sains-aliran-darah-perbaiki | paru-ambil | di paru-paru darah melepas karbon dioksida dan mengambil oksigen | di paru-paru, darah melepas karbon dioksida dan mengambil oksigen |
| sd6-sains-aliran-darah-perbaiki | paru-ketubuh | jantung memompanya ke seluruh tubuh | jantung memompanya lewat arteri ke seluruh tubuh |
| sd6-sains-aliran-darah-perbaiki | s-otak | Darah menuju otak | Darah naik ke otak |
| sd6-sains-aliran-darah-perbaiki | otak-arteri | arteri membawa darah ke otak | arteri di leher membawa darah naik ke otak |
| sd6-sains-aliran-darah-perbaiki | otak-kapiler | di kapiler otak, oksigen dan sari makanan masuk ke sel | di kapiler otak, oksigen dan sari makanan masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | otak-sisa | sel otak menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | otak-vena | vena membawa darah kembali ke jantung | vena di leher membawa darah turun dari otak |
| sd6-sains-aliran-darah-perbaiki | s-kaki | Darah menuju otot kaki | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | kaki-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | kaki-arteri | arteri membawa darah ke otot kaki | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | kaki-kapiler | di kapiler otot kaki, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | kaki-sisa | sel otot kaki menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | kaki-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | s-lengan | Darah menuju otot lengan | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lengan-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lengan-arteri | arteri membawa darah ke otot lengan | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lengan-kapiler | di kapiler otot lengan, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lengan-sisa | sel otot lengan menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lengan-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | s-tangan | Darah menuju jari tangan | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tangan-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tangan-arteri | arteri membawa darah ke jari tangan | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tangan-kapiler | di kapiler jari tangan, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tangan-sisa | sel jari tangan menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tangan-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | s-telinga | Darah menuju telinga | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | telinga-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | telinga-arteri | arteri membawa darah ke telinga | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | telinga-kapiler | di kapiler telinga, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | telinga-sisa | sel telinga menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | telinga-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | s-lidah | Darah menuju lidah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lidah-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lidah-arteri | arteri membawa darah ke lidah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lidah-kapiler | di kapiler lidah, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lidah-sisa | sel lidah menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | lidah-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | s-hidung | Darah menuju hidung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | hidung-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | hidung-arteri | arteri membawa darah ke hidung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | hidung-kapiler | di kapiler hidung, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | hidung-sisa | sel hidung menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | hidung-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | s-mata | Darah menuju mata | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | mata-pompa | jantung memompa darah kaya oksigen | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | mata-arteri | arteri membawa darah ke mata | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | mata-kapiler | di kapiler mata, oksigen dan sari makanan masuk ke sel | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | mata-sisa | sel mata menyerahkan karbon dioksida ke darah | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | mata-vena | vena membawa darah kembali ke jantung | (dihapus) |
| sd6-sains-aliran-darah-perbaiki | tubuh-keparu | (baru) | jantung memompa darah itu ke paru-paru untuk mengambil oksigen lagi |
| sd6-sains-aliran-darah-perbaiki | paru-kapiler | (baru) | di kapiler tubuh, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | otak-tiba | (baru) | darah tiba kembali di jantung |
| sd6-sains-aliran-darah-perbaiki | s-lari | (baru) | Jantung saat kamu berlari |
| sd6-sains-aliran-darah-perbaiki | lari-mulai | (baru) | kamu berlari, otot kaki butuh lebih banyak oksigen |
| sd6-sains-aliran-darah-perbaiki | lari-cepat | (baru) | jantung berdetak lebih cepat dan lebih kuat |
| sd6-sains-aliran-darah-perbaiki | lari-arteri | (baru) | arteri membawa lebih banyak darah ke otot kaki |
| sd6-sains-aliran-darah-perbaiki | lari-kapiler | (baru) | di kapiler otot kaki, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | lari-vena | (baru) | vena membawa darah kembali ke jantung |
| sd6-sains-aliran-darah-perbaiki | s-katup | (baru) | Darah naik dari telapak kaki |
| sd6-sains-aliran-darah-perbaiki | katup-pompa | (baru) | jantung memompa darah kaya oksigen ke kaki |
| sd6-sains-aliran-darah-perbaiki | katup-arteri | (baru) | arteri membawa darah turun sampai telapak kaki |
| sd6-sains-aliran-darah-perbaiki | katup-kapiler | (baru) | di kapiler telapak kaki, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | katup-vena | (baru) | darah masuk ke vena kaki |
| sd6-sains-aliran-darah-perbaiki | katup-naik | (baru) | otot betis memeras vena dan katupnya menahan darah, jadi darah naik ke jantung |
| sd6-sains-aliran-darah-perbaiki | s-ginjal | (baru) | Darah dibersihkan di ginjal |
| sd6-sains-aliran-darah-perbaiki | ginjal-pompa | (baru) | jantung memompa darah kaya oksigen |
| sd6-sains-aliran-darah-perbaiki | ginjal-arteri | (baru) | arteri ginjal membawa darah ke ginjal |
| sd6-sains-aliran-darah-perbaiki | ginjal-saring | (baru) | ginjal menyaring sisa zat dan air berlebih dari darah |
| sd6-sains-aliran-darah-perbaiki | ginjal-vena | (baru) | darah yang sudah bersih keluar lewat vena ginjal |
| sd6-sains-aliran-darah-perbaiki | ginjal-tiba | (baru) | vena besar membawa darah itu kembali ke jantung |
| sd6-sains-aliran-darah-perbaiki | s-usus | (baru) | Darah menjemput sari makanan |
| sd6-sains-aliran-darah-perbaiki | usus-pompa | (baru) | jantung memompa darah kaya oksigen |
| sd6-sains-aliran-darah-perbaiki | usus-arteri | (baru) | arteri membawa darah ke dinding usus |
| sd6-sains-aliran-darah-perbaiki | usus-serap | (baru) | di kapiler usus, darah menyerap sari makanan |
| sd6-sains-aliran-darah-perbaiki | usus-hati | (baru) | vena membawa darah kaya sari makanan ke hati |
| sd6-sains-aliran-darah-perbaiki | usus-tiba | (baru) | dari hati, darah mengalir kembali ke jantung |
| sd6-sains-aliran-darah-perbaiki | s-koroner | (baru) | Darah untuk otot jantung sendiri |
| sd6-sains-aliran-darah-perbaiki | koroner-pompa | (baru) | jantung memompa darah kaya oksigen ke aorta |
| sd6-sains-aliran-darah-perbaiki | koroner-arteri | (baru) | arteri koroner membawa sebagian darah ke otot jantung |
| sd6-sains-aliran-darah-perbaiki | koroner-kapiler | (baru) | di kapiler otot jantung, oksigen masuk ke sel, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | koroner-vena | (baru) | vena jantung mengumpulkan darah miskin oksigen |
| sd6-sains-aliran-darah-perbaiki | koroner-tiba | (baru) | darah itu masuk kembali ke dalam jantung |
| sd6-sains-aliran-darah-perbaiki | s-oksigen | (baru) | Oksigen dari udara sampai ke otot |
| sd6-sains-aliran-darah-perbaiki | oksigen-hirup | (baru) | kamu menghirup udara, oksigen masuk ke paru-paru |
| sd6-sains-aliran-darah-perbaiki | oksigen-masuk | (baru) | di kapiler paru-paru, oksigen masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | oksigen-venaparu | (baru) | vena paru-paru membawa darah kaya oksigen ke jantung |
| sd6-sains-aliran-darah-perbaiki | oksigen-pompa | (baru) | jantung memompa darah itu lewat arteri ke otot lengan |
| sd6-sains-aliran-darah-perbaiki | oksigen-sel | (baru) | di kapiler otot lengan, oksigen masuk ke sel otot |
| sd6-sains-aliran-darah-perbaiki | s-karbon | (baru) | Karbon dioksida keluar dari tubuh |
| sd6-sains-aliran-darah-perbaiki | karbon-buat | (baru) | sel otot memakai oksigen dan menghasilkan karbon dioksida |
| sd6-sains-aliran-darah-perbaiki | karbon-masuk | (baru) | di kapiler, karbon dioksida masuk ke darah |
| sd6-sains-aliran-darah-perbaiki | karbon-vena | (baru) | vena membawa darah itu ke jantung |
| sd6-sains-aliran-darah-perbaiki | karbon-pompa | (baru) | jantung memompanya ke paru-paru |
| sd6-sains-aliran-darah-perbaiki | karbon-embus | (baru) | di paru-paru, karbon dioksida dilepas dan diembuskan keluar |

## Butuh fitur baru

| paket | item/urutan | fitur | nilai yang diinginkan |
|---|---|---|---|
| — | — | — | Tidak ada. Emoji ginjal tidak ada; dipakai 🫘 (kacang merah/ginjal) untuk langkah ginjal-saring. Bila nanti ada aset organ (ginjal, hati), langkah ginjal-saring dan usus-hati bisa memakainya |

## Tidak dikerjakan

| butir | alasan |
|---|---|
| — | Semua butir keputusan kelompok 08 dikerjakan |
