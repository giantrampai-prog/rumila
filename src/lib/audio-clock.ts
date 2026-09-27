// Jam animasi yang mengikuti rekaman suara dengan halus.
// audio.currentTime di HP (terutama Chrome Android) hanya diperbarui beberapa kali per detik, sehingga
// animasi yang membaca langsung nilai itu tampak tersendat/bergetar. Jam ini maju sendiri tiap bingkai
// lalu dikoreksi pelan-pelan ke posisi audio; lompat langsung hanya bila selisihnya besar (seek/ganti adegan).

export function followAudio(clock: number, audioTime: number, dt: number, running: boolean): number {
  if (!running) return Math.abs(audioTime - clock) > 0.4 ? audioTime : clock;
  const next = clock + dt;
  const err = audioTime - next;
  if (Math.abs(err) > 0.4) return audioTime;
  return next + err * Math.min(1, dt * 3);
}
