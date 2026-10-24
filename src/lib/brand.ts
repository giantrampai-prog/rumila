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
export const teksDiAtas = (latar: string) => (/#fd861d|#fdb724|#ffb347|#ffd23f|#ffbe0b/i.test(latar) ? RINOYA.ink : "#fff");
