// Tulis ulang src/lib/koding/langkah.ts dari pembuat level. Jalankan: npx tsx scripts/gen-langkah.ts
import { writeFileSync } from 'node:fs';
import { buildLangkah } from '../src/lib/koding/gen-langkah';
import { solve } from '../src/lib/koding/engine';

const levels = buildLangkah();
const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const rows = levels.map(
  (l) => `  { id: ${q(l.id)}, theme: ${q(l.theme)}, dir: ${l.dir}, blocks: [${l.blocks.map(q).join(', ')}], map: [${l.map.map(q).join(', ')}], hint: ${q(l.hint)} },`,
);
const src = `// Level game "Langkah" (konsep: urutan perintah) — 100 level untuk usia 3–8 tahun, makin tinggi makin sulit.
// DIBUAT OTOMATIS oleh scripts/gen-langkah.ts (lihat src/lib/koding/gen-langkah.ts); jangan diedit manual.
// Kebun 1–20 · Pantai 21–40 · Salju 41–60 · Gurun 61–80 · Luar Angkasa 81–100.
// Peta: . kosong · # rintangan · ~ air/es · S mulai · G bintang. dir: 0 atas, 1 kanan, 2 bawah, 3 kiri.

import type { Level } from './engine';

export const LANGKAH: Level[] = [
${rows.join('\n')}
];
`;
writeFileSync(new URL('../src/lib/koding/langkah.ts', import.meta.url), src);
console.log(levels.map((l) => solve(l)!.length).join(' '));
