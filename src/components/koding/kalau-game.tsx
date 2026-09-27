'use client';

// Coding Agam · Kalau… — lihat prog-game.tsx untuk cara main; soal di src/lib/koding/kalau.ts.

import { KALAU } from '@/lib/koding/kalau';
import { ProgGame, type ProgGameConfig } from './prog-game';

const CFG: ProgGameConfig = {
  title: 'Kalau…',
  tool: 'koding-kalau',
  levels: KALAU,
  intro: 'Halo, aku Agam! Aku punya mata: aku bisa melihat rintangan di depan dan jalan di kanan-kiriku. Ajari aku memilih jalan dengan blok KALAU. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!',
};

export function KalauGame() {
  return <ProgGame cfg={CFG} />;
}
