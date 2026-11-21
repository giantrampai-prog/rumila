// Avatar karakter RINOYA: wajah anak dari kode (tanpa gambar). Disimpan sebagai teks pendek di member.avatar,
// mis. "k1-r3-w0-a0" = kulit 1, rambut 3, warna 0, aksesori 0.

export const KULIT = ["#ffe0c7", "#f6c9a0", "#e0a878", "#b9774e", "#8a5232"] as const;
export const RAMBUT = [
  { id: 0, nama: "Pendek" },
  { id: 1, nama: "Jabrik" },
  { id: 2, nama: "Panjang" },
  { id: 3, nama: "Kuncir" },
  { id: 4, nama: "Hijab" },
  { id: 5, nama: "Peci" },
  { id: 6, nama: "Keriting" },
] as const;
/** warna rambut; untuk hijab dipakai sebagai warna kain */
export const WARNA_RAMBUT = ["#2b1d16", "#5a3420", "#8a5a2b", "#c48a3f"] as const;
export const WARNA_HIJAB = ["#ff4fa3", "#12b8a6", "#5b4bff", "#fd861d"] as const;
export const AKSESORI = [
  { id: 0, nama: "Tanpa" },
  { id: 1, nama: "Kacamata" },
  { id: 2, nama: "Pita" },
] as const;

export interface BentukAvatar {
  kulit: number;
  rambut: number;
  warna: number;
  aksesori: number;
}

const batas = (n: number, max: number) => (Number.isInteger(n) && n >= 0 && n < max ? n : 0);

export function bacaAvatar(id: string | null | undefined): BentukAvatar | null {
  const m = /^k(\d)-r(\d)-w(\d)-a(\d)$/.exec(id ?? "");
  if (!m) return null;
  return {
    kulit: batas(Number(m[1]), KULIT.length),
    rambut: batas(Number(m[2]), RAMBUT.length),
    warna: batas(Number(m[3]), WARNA_RAMBUT.length),
    aksesori: batas(Number(m[4]), AKSESORI.length),
  };
}

export const tulisAvatar = (b: BentukAvatar) => `k${b.kulit}-r${b.rambut}-w${b.warna}-a${b.aksesori}`;

export const AVATAR_AWAL: BentukAvatar = { kulit: 1, rambut: 0, warna: 0, aksesori: 0 };
