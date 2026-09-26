// Service worker Rumila: membuat aplikasi bisa dipasang & tetap terbuka saat sinyal putus.
// Strategi "jaringan dulu": selalu ambil versi terbaru; cadangan cache hanya bila offline.
const CACHE = "rumila-v1";
const SHELL = ["/beranda", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  // Hanya halaman (navigasi) yang disimpan; aset besar (3D, audio) tidak di-cache di sini.
  if (req.mode !== "navigate") return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/beranda"))),
  );
});
