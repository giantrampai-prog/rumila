import type { ColorKey } from "./catalog";

// Warna inti RINOYA Academy. Sumber: docs/brand/design-tokens.json (desain sistem RINOYA).
export const RINOYA = {
  blue: "#0786eb",
  blueDeep: "#0567c2",
  blueTint: "#e3f1fd",
  orange: "#fd861d",
  orangeDeep: "#a34a00",
  gold: "#fdb724",
  navy: "#135385",
  ink: "#0b2545",
} as const;

/** Warna teks/ikon di atas sebuah latar: oranye & emas memakai ink (putih di atasnya <3:1), selain itu putih. */
/** Tinta ikon/teks di atas ubin kategori (gradien PLAY). Putih hanya untuk warna gelap (ungu, indigo, space); warna lain gagal 3:1 dengan putih, jadi navy. */
export const tintaPada = (c: ColorKey) => (c === "purple" || c === "indigo" || c === "space" ? "#fff" : RINOYA.ink);

export const teksDiAtas = (latar: string) => (/#fd861d|#fdb724|#ffb347|#ffd23f|#ffbe0b/i.test(latar) ? RINOYA.ink : "#fff");

const luminansi = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Tinta untuk latar warna padat (#rrggbb): putih bila kontrasnya ≥3:1, selain itu navy. */
export const tintaKontras = (latar: string) => (1.05 / (luminansi(latar) + 0.05) >= 3 ? "#fff" : RINOYA.ink);
