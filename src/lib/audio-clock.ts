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

/**
 * Unduh rekaman sekali ke memori (blob URL) supaya lompat-posisi (seek) instan di HP — tanpa jeda
 * "memuat" ±1–2 detik setiap kali pindah adegan. Sebelum selesai, pakai URL aslinya.
 */
const blobs = new Map<string, string>();
const loading = new Map<string, Promise<string>>();
export function preloadAudio(src: string): Promise<string> {
  const done = blobs.get(src);
  if (done) return Promise.resolve(done);
  let p = loading.get(src);
  if (!p) {
    p = fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
      .then((b) => {
        const url = URL.createObjectURL(b);
        blobs.set(src, url);
        return url;
      })
      .catch(() => src);
    loading.set(src, p);
  }
  return p;
}
export const audioUrl = (src: string) => blobs.get(src) ?? src;
