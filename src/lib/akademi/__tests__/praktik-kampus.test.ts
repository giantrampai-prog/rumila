import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/akademi/jejak", () => ({ catatEvent: () => undefined }));
vi.mock("@/lib/store", () => ({ useRumila: { getState: () => ({ activity: [] }), subscribe: () => () => {} } }));

import { KOMPETENSI } from "../konten";
import { daftarLevel, kompetensiLevel, type GameKoding } from "../bukti-koding";
import { QUEST } from "../quest";
import { KOMPETENSI_GEDUNG, gedungEvent, penilaianKampus, skorStatus, snapshotPraktik } from "../praktik-kampus";
import { proyeksi } from "../mastery";
import { attempt } from "./helper";

const IDX = new Set(KOMPETENSI.map((c) => c.id));

describe("Penilaian Praktik Kampus", () => {
  it("pemetaan gedung sama dengan bukti-koding dan quest, dan semua kompetensinya ada di katalog", () => {
    const koding = new Set<string>();
    for (const g of ["langkah", "ulangi", "kalau"] as GameKoding[]) daftarLevel(g).forEach((l, i) => kompetensiLevel(g, l.id, i).forEach((c) => koding.add(c)));
    expect(new Set(KOMPETENSI_GEDUNG.komputer)).toEqual(koding);
    expect(new Set(KOMPETENSI_GEDUNG.lab)).toEqual(new Set(QUEST.map((q) => q.competencyId)));
    for (const id of [...KOMPETENSI_GEDUNG.komputer, ...KOMPETENSI_GEDUNG.lab]) expect(IDX.has(id)).toBe(true);
  });

  it("gedungEvent mengenali asal event", () => {
    expect(gedungEvent({ activityId: "koding-ulangi" })).toBe("komputer");
    expect(gedungEvent({ activityId: "import" })).toBe("komputer");
    expect(gedungEvent({ activityId: "quest:edukasi6" })).toBe("lab");
    expect(gedungEvent({ activityId: "berangkat-sekolah" })).toBeUndefined();
  });

  it("jenjang tanpa praktik kampus bernilai null; PAUD punya Lab Komputer dan Lab 3D", () => {
    expect(penilaianKampus([], KOMPETENSI, "SD3").nilai).toBeNull();
    const p = penilaianKampus([], KOMPETENSI, "PAUD");
    expect(p.komponen.map((k) => k.gedung).sort()).toEqual(["komputer", "lab"]);
    expect(p.nilai).toBe(0);
    expect(p.lengkap).toBe(false);
  });

  it("hanya jejak gedung yang dihitung, dan per gedungnya sendiri", () => {
    const cid = "KODE.PAUD.PERINTAH.01";
    const dariKelas = Array.from({ length: 6 }, (_, i) => attempt([cid], { hari: i, activityId: `paket-${i}` }));
    expect(penilaianKampus(dariKelas, KOMPETENSI, "PAUD").komponen.find((k) => k.gedung === "komputer")!.kompetensi[0].percobaan).toBe(0);
    const dariLab = Array.from({ length: 6 }, (_, i) => attempt([cid], { hari: i, activityId: "quest:edukasi6" }));
    expect(penilaianKampus(dariLab, KOMPETENSI, "PAUD").komponen.find((k) => k.gedung === "komputer")!.nilai).toBe(0);
    const dariKomputer = [attempt([cid], { hari: 1, activityId: "koding-langkah" })];
    const p = penilaianKampus(dariKomputer, KOMPETENSI, "PAUD");
    const k = p.komponen.find((x) => x.gedung === "komputer")!.kompetensi[0];
    expect(k.percobaan).toBe(1);
    expect(k.skor).toBe(skorStatus(k.status, 1));
    // jejak kampus tetap tidak menaikkan penguasaan Academy
    expect(proyeksi(dariKomputer, KOMPETENSI)[cid].success).toBe(0);
  });

  it("skor dan snapshot", () => {
    expect([skorStatus("dikuasai", 3), skorStatus("berkembang", 2), skorStatus("belum", 1), skorStatus("belum", 0)]).toEqual([100, 75, 40, 0]);
    expect(snapshotPraktik(penilaianKampus([], KOMPETENSI, "SD3"))).toBeUndefined();
    const s = snapshotPraktik(penilaianKampus([], KOMPETENSI, "TKB"))!;
    expect(s.nilai).toBe(0);
    expect(s.predikat).toBe("Cukup");
    expect(s.komponen.length).toBeGreaterThan(0);
  });
});
