const nf = new Intl.NumberFormat("id-ID");

/** Rp 1.250.000 */
export const rupiah = (n: number) => `Rp ${nf.format(Math.round(n))}`;

/** Rp 850 rb · Rp 5,5 jt · Rp 1,2 M */
export function rupiahShort(n: number) {
  const a = Math.abs(n);
  const one = (v: number) => v.toLocaleString("id-ID", { maximumFractionDigits: 1 });
  if (a >= 1e9) return `Rp ${one(n / 1e9)} M`;
  if (a >= 1e6) return `Rp ${one(n / 1e6)} jt`;
  if (a >= 1e3) return `Rp ${Math.round(n / 1e3)} rb`;
  return rupiah(n);
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
}

/** Inisial tanpa sapaan: "Kak Raka" → "R" */
export const initialOf = (name: string) => (name.replace(/^(Kak|Dek|Om|Tante) /, "").trim()[0] || "?").toUpperCase();
