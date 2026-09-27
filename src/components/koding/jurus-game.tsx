'use client';

// Coding Agam · Jurus — lihat prog-game.tsx untuk cara main; soal di src/lib/koding/jurus.ts.

import { JURUS } from '@/lib/koding/jurus';
import { ProgGame, type ProgGameConfig } from './prog-game';

const CFG: ProgGameConfig = {
  title: 'Jurus',
  tool: 'koding-jurus',
  levels: JURUS,
  intro: 'Halo, aku Agam! Ayo buat JURUS sendiri: susun gerakan sekali, lalu panggil berkali-kali. Selesaikan 10 level (100 coding), kamu dapat Sertifikat Programmer Cilik!',
};

export function JurusGame() {
  return <ProgGame cfg={CFG} />;
}
