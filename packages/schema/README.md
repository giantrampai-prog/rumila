# @akademi/schema

Skema zod untuk Rumila Kids Academy. AI dan manusia menulis ke skema ini, bukan ke prosa.

| Berkas | Isi |
|---|---|
| `jenjang.ts` | id level (PAUD…SMA3), mata pelajaran, mekanik, kerangka, tipe dwibahasa |
| `kompetensi.ts` | `Competency` "Aku bisa …", `StandardRef`, `MasteryRule`, `KurikulumFile` |
| `paket.ts` | `ContentPack` per mekanik (pilah, urutkan, dagang, navigasi), `Activity`, `AssetRef`, `KnobSchema` |
| `event.ts` | `GameEvent` append-only dengan payload per tipe |
| `kerangka.ts` | kamus kode kerangka (`content/kerangka/*.json`) |
| `validasi.ts` | validasi lintas kompetensi: id unik, prasyarat, siklus, ref di kamus |
| `cli.ts` | `npm run akademi:validate [jalur…]` |

Tes: `npx vitest run packages`.
