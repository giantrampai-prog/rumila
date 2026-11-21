import { describe, expect, it } from "vitest";
import { BAB_FILM, FILM_BERANGKAT, durasiFilm, mulaiAdegan, penandaFilm, posisiFilm, teksAdegan } from "../film-berangkat";
import { JOURNEY_CHAPTERS, getJourneyChapter } from "../journey";

describe("film Berangkat", () => {
  it("mengikuti urutan bab perjalanan dari rumah sampai Jeddah tanpa melompat", () => {
    const ids = JOURNEY_CHAPTERS.map((c) => c.id);
    const awal = ids.indexOf("rumah");
    expect(BAB_FILM).toEqual(ids.slice(awal, awal + BAB_FILM.length));
    expect(BAB_FILM.at(-1)).toBe("jeddah");
  });

  it("adegan perjalanan sepanjang durasi babnya, langkah tidak melebihi langkah bab", () => {
    for (const a of FILM_BERANGKAT) {
      const bab = getJourneyChapter(a.bab);
      if (bab.kind === "travel") { expect(a.perjalanan).toBe(true); expect(a.detik).toBe(bab.durationSeconds); }
      else expect(a.perjalanan).toBeFalsy();
      expect(a.langkah ?? 0).toBeLessThanOrEqual(bab.steps?.length ?? 0);
      expect(a.teks.length).toBeGreaterThan(0);
      for (const t of a.teks) expect(t.isi.length).toBeLessThanOrEqual(90);
    }
  });

  it("lama film sekitar 3–4 menit dan posisi waktu konsisten", () => {
    const total = durasiFilm();
    expect(total).toBeGreaterThanOrEqual(180);
    expect(total).toBeLessThanOrEqual(270);
    const awal = mulaiAdegan();
    awal.forEach((m, i) => expect(posisiFilm(m + 0.01)).toEqual({ i, dalam: expect.closeTo(0.01, 5) }));
    expect(posisiFilm(-5)).toEqual({ i: 0, dalam: 0 });
    expect(posisiFilm(total + 10).i).toBe(FILM_BERANGKAT.length - 1);
    expect(posisiFilm(Number.NaN)).toEqual({ i: 0, dalam: 0 });
  });

  it("teks bawah berganti sesuai waktu di dalam adegan", () => {
    const terbang = FILM_BERANGKAT.find((a) => a.bab === "garuda_jed")!;
    expect(teksAdegan(terbang, 0)).toMatch(/keselamatan/);
    expect(teksAdegan(terbang, 47)).toMatch(/mendarat/);
  });

  it("penanda garis waktu satu per bab", () => {
    expect(penandaFilm().map((p) => p.bab)).toEqual([...BAB_FILM]);
  });
});

import { AKSI_LANGKAH } from "../aksi";

describe("aksi langkah interaktif", () => {
  it("setiap bab berlangkah punya satu aksi per langkah", () => {
    for (const bab of JOURNEY_CHAPTERS) {
      const aksi = AKSI_LANGKAH[bab.id];
      if (bab.steps && ["rumah", "cgk", "cgk_imigrasi", "cgk_keamanan", "cgk_gate"].includes(bab.id)) expect(aksi?.length, bab.id).toBe(bab.steps.length);
      if (aksi) for (const a of aksi) expect(a.aksi.length).toBeLessThanOrEqual(26);
    }
  });
});

import { FILM_PULANG, babFilm, durasiFilm as durasi, filmUntukBab, penandaFilm as penanda } from "../film-berangkat";

describe("film Pulang", () => {
  it("mengikuti bab kepulangan dari Makkah sampai rumah", () => {
    const ids = JOURNEY_CHAPTERS.map((c) => c.id);
    const bab = babFilm(FILM_PULANG);
    const awal = ids.indexOf("makkah_jed");
    expect(bab).toEqual(ids.slice(awal, awal + bab.length));
    expect(bab.at(-1)).toBe("rumah_selesai");
  });
  it("durasi perjalanan sama dengan bab, lama 2–3 menit, penanda satu per bab", () => {
    for (const a of FILM_PULANG) {
      const bab = getJourneyChapter(a.bab);
      if (bab.kind === "travel") expect(a.detik).toBe(bab.durationSeconds);
      else expect(a.perjalanan).toBeFalsy();
    }
    expect(durasi(FILM_PULANG)).toBeGreaterThanOrEqual(120);
    expect(durasi(FILM_PULANG)).toBeLessThanOrEqual(180);
    expect(penanda(FILM_PULANG).map((p) => p.bab)).toEqual([...babFilm(FILM_PULANG)]);
  });
  it("tiap bab tahu filmnya", () => {
    expect(filmUntukBab("cgk")).toBe("berangkat");
    expect(filmUntukBab("garuda_cgk")).toBe("pulang");
    expect(filmUntukBab("umroh")).toBeNull();
  });
});
