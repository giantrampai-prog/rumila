// Tulis ulang ulangi.ts, kalau.ts, jurus.ts dari pembuat level. Jalankan: npx tsx scripts/gen-prog.ts
import { writeFileSync } from 'node:fs';
import { buildJurus, buildKalau, buildUlangi } from '../src/lib/koding/gen-prog';
import type { ProgLevel } from '../src/lib/koding/prog';

const games: [string, string, string, () => ProgLevel[]][] = [
  ['ulangi', 'ULANGI', 'Ulangi (konsep: perulangan)', buildUlangi],
  ['kalau', 'KALAU', 'Kalau… (konsep: percabangan & ulangi sampai)', buildKalau],
  ['jurus', 'JURUS', 'Jurus (konsep: fungsi)', buildJurus],
];
for (const [file, name, title, build] of games) {
  const t0 = Date.now();
  const levels = build();
  const src = `// Level game "${title}" — 100 soal (10 Level bertema × 10 coding) untuk usia 3–8 tahun.
// DIBUAT OTOMATIS oleh scripts/gen-prog.ts (lihat src/lib/koding/gen-prog.ts); jangan diedit manual.
// Peta: . kosong · # rintangan · ~ air/es · S mulai · G bintang. dir: 0 atas, 1 kanan, 2 bawah, 3 kiri.

import type { ProgLevel } from './prog';

export const ${name}: ProgLevel[] = ${JSON.stringify(levels, null, 0).replace(/\},\{"id":"(?=[a-z]\d)/g, '},\n{"id":"')};
`;
  writeFileSync(new URL(`../src/lib/koding/${file}.ts`, import.meta.url), src);
  console.log(file, `${Date.now() - t0} ms`, levels.map((l) => `${l.best}/${l.limit}`).join(' '));
}
