// Tulis ulang ulangi.ts dan kalau.ts dari pembuat soal. Jalankan: npx tsx scripts/gen-prog.ts
import { writeFileSync } from 'node:fs';
import { buildKalau, buildUlangi } from '../src/lib/koding/gen-prog';

const games: [string, string, string, string, () => { best: number; limit: number }[]][] = [
  ['ulangi', 'ULANGI', 'UlangiLevel', 'Ulangi · Agam Pelukis (konsep: perulangan)', buildUlangi],
  ['kalau', 'KALAU', 'KalauLevel', 'Kalau… · Agam Pelari (konsep: percabangan & ulangi sampai)', buildKalau],
];
for (const [file, name, type, title, build] of games) {
  const t0 = Date.now();
  const levels = build();
  const src = `// Soal game "${title}" — 100 soal (10 Level × 10 coding) untuk usia 3–8 tahun.
// DIBUAT OTOMATIS oleh scripts/gen-prog.ts (lihat src/lib/koding/gen-prog.ts); jangan diedit manual.

import type { ${type} } from './worlds';

export const ${name}: ${type}[] = ${JSON.stringify(levels).replace(/\},\{"id":"(?=[a-z]\d)/g, '},\n{"id":"')};
`;
  writeFileSync(new URL(`../src/lib/koding/${file}.ts`, import.meta.url), src);
  console.log(file, `${Date.now() - t0} ms`, levels.map((l) => `${l.best}/${l.limit}`).join(' '));
}
