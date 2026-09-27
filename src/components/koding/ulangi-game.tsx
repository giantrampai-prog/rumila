'use client';

// Coding Agam · Ulangi — lihat prog-game.tsx untuk cara main; soal di src/lib/koding/ulangi.ts.

import { ULANGI } from '@/lib/koding/ulangi';
import { ProgGame, type ProgGameConfig } from './prog-game';

const CFG: ProgGameConfig = {
  title: 'Ulangi',
  tool: 'koding-ulangi',
  levels: ULANGI,
  intro: 'Halo, aku Agam! Jalannya makin panjang, tapi jatah bloknya sedikit. Pakai blok ULANGI supaya programnya pendek. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!',
};

export function UlangiGame() {
  return <ProgGame cfg={CFG} />;
}
