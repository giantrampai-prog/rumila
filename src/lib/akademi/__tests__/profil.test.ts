import { describe, expect, it } from "vitest";
import { AVATAR_AWAL, bacaAvatar, tulisAvatar } from "../../avatar";
import { anakRumah } from "../konten";
import { isOrangTua } from "../../profil";

describe("avatar karakter", () => {
  it("teks avatar bolak-balik dan menolak isian rusak", () => {
    const b = { kulit: 3, rambut: 4, warna: 1, aksesori: 2 };
    expect(bacaAvatar(tulisAvatar(b))).toEqual(b);
    expect(bacaAvatar("k9-r9-w9-a9")).toEqual({ kulit: 0, rambut: 0, warna: 0, aksesori: 0 });
    expect(bacaAvatar("<script>")).toBeNull();
    expect(bacaAvatar(undefined)).toBeNull();
    expect(tulisAvatar(AVATAR_AWAL)).toMatch(/^[a-z0-9-]{1,40}$/);
  });
});

describe("peran profil", () => {
  const ayah = { id: "a", admin: true };
  const siswaSendiri = { id: "s", admin: true, peran: "anak" as const };
  const kakak = { id: "k", admin: false };
  const nenek = { id: "n", admin: false, peran: "dewasa" as const };

  it("admin = orang tua, kecuali siswa yang mendaftar sendiri", () => {
    expect(isOrangTua(ayah)).toBe(true);
    expect(isOrangTua(siswaSendiri)).toBe(false);
    expect(isOrangTua(kakak)).toBe(false);
    expect(isOrangTua(nenek)).toBe(true);
  });

  it("daftar anak memakai peran server, termasuk siswa admin", () => {
    expect(anakRumah([ayah, siswaSendiri, kakak, nenek]).map((m) => m.id)).toEqual(["s", "k"]);
  });
});
