// UUID v4 yang tetap jalan di koneksi tidak aman (http://192.168.x.x dari tablet/HP di jaringan rumah):
// crypto.randomUUID hanya tersedia di HTTPS/localhost, crypto.getRandomValues tersedia di semua konteks.
export function uuid(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") return c.randomUUID();
  const b = new Uint8Array(16);
  if (c?.getRandomValues) c.getRandomValues(b);
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40; // versi 4
  b[8] = (b[8] & 0x3f) | 0x80; // varian RFC 4122
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
