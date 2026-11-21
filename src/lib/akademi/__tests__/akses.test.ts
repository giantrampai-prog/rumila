import { describe, expect, it } from "vitest";
import type { ContentPack } from "@akademi/schema";
import { aksesPaket, alasanKunci, dariKampus } from "../akses";
import { KOMPETENSI, PAKET } from "../konten";
import { petaJenjang } from "../peta";
import { TRACK_AKTIF } from "../katalog";

const INDEKS = new Map(KOMPETENSI.map((c) => [c.id, c]));
const paketDari = (cid: string) => PAKET.find((p) => p.competencyIds[0] === cid) as ContentPack;

describe("akses paket Academy", () => {
  // anak PAUD baru: belum ada event, belum ada ujian
  const peta = petaJenjang({}, new Set(), KOMPETENSI, "PAUD", TRACK_AKTIF, new Map(), []);
  const unit1 = peta.unit[0];
  const unit3 = peta.unit[2];

  it("misi di modul aktif boleh dimainkan, modul sesudahnya terkunci dengan alasan", () => {
    expect(aksesPaket(paketDari(unit1.misi[0].kompetensi.id), peta, INDEKS)).toEqual({ boleh: true });
    const a = aksesPaket(paketDari(unit3.misi[0].kompetensi.id), peta, INDEKS);
    expect(a.boleh).toBe(false);
    if (!a.boleh) expect(a.alasan).toBe(alasanKunci(peta));
    expect(alasanKunci(peta)).toContain(unit1.nama.id);
  });

  it("misi yang sudah selesai di modul terkunci tetap boleh dimainkan ulang", () => {
    const cid = unit3.misi[0].kompetensi.id;
    const p2 = petaJenjang({}, new Set([cid]), KOMPETENSI, "PAUD", TRACK_AKTIF, new Map(), []);
    expect(aksesPaket(paketDari(cid), p2, INDEKS)).toEqual({ boleh: true });
  });

  it("jenjang di atas terkunci, jenjang di bawah boleh diulang", () => {
    const sd1 = PAKET.find((p) => INDEKS.get(p.competencyIds[0])?.level === "SD1")!;
    const a = aksesPaket(sd1, peta, INDEKS);
    expect(a.boleh).toBe(false);
    if (!a.boleh) expect(a.alasan).toContain("SD 1");
    const petaSd1 = petaJenjang({}, new Set(), KOMPETENSI, "SD1", TRACK_AKTIF, new Map(), []);
    const paud = PAKET.find((p) => INDEKS.get(p.competencyIds[0])?.level === "PAUD")!;
    expect(aksesPaket(paud, petaSd1, INDEKS)).toEqual({ boleh: true });
  });

  it("mengenali event gedung kampus", () => {
    expect(dariKampus({ activityId: "koding-ulangi", payload: {} })).toBe(true);
    expect(dariKampus({ activityId: "quest:angkasa6", payload: {} })).toBe(true);
    expect(dariKampus({ activityId: "import", payload: {} })).toBe(true);
    expect(dariKampus({ activityId: "berangkat-sekolah", payload: { imported: true } })).toBe(true);
    expect(dariKampus({ activityId: "berangkat-sekolah", payload: {} })).toBe(false);
  });
});
