// Render Benda untuk bentuk baru (belah-ketupat, koin, uang) + angka; tanpa DOM, lewat renderToStaticMarkup.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Benda, tintaKontras, type VisualSpec } from "@/components/akademi/benda";

const html = (v: VisualSpec) => renderToStaticMarkup(createElement(Benda, { v, size: 56 }));

describe("Benda bentuk baru", () => {
  it("belah-ketupat: poligon rombus tegak, beda dari persegi", () => {
    const h = html({ shape: "belah-ketupat", color: "#ff5a6e" });
    expect(h).toContain('data-bentuk="belah-ketupat"');
    expect(h).toContain('points="50,2 84,50 50,98 16,50"');
    expect(html({ shape: "square", color: "#ff5a6e" })).not.toContain("polygon");
  });
  it("akar: akar tunggang + serabut, bawaan cokelat, color opsional", () => {
    const h = html({ shape: "akar" });
    expect(h).toContain('data-bentuk="akar"');
    expect(h).toContain('fill="#8a5a2b"');
    expect((h.match(/stroke="#8a5a2b"/g) ?? []).length).toBe(1);
    expect(html({ shape: "akar", color: "#6d4c41" })).toContain('fill="#6d4c41"');
  });
  it("koin: cakram dengan nominal; warna bawaan perak < 1000, emas ≥ 1000", () => {
    const h = html({ shape: "koin", angka: "500" });
    expect(h).toContain('data-bentuk="koin"');
    expect(h).toContain(">500</text>");
    expect(h).toContain("#c9ced6");
    expect(html({ shape: "koin", angka: "1.000" })).toContain("#f2c230");
    expect(html({ shape: "koin", angka: "1.000", color: "#123456" })).toContain("#123456");
  });
  it("uang: lembar mendatar (lebar > tinggi) berwarna, nominal + RUPIAH", () => {
    const h = html({ shape: "uang", angka: "Rp2.000", color: "#9b7bd6" });
    expect(h).toContain('data-bentuk="uang"');
    expect(h).toContain(">Rp2.000</text>");
    expect(h).toContain("RUPIAH");
    expect(h).toContain('fill="#9b7bd6"');
    const [, w, hh] = /<svg width="([\d.]+)" height="([\d.]+)"[^>]*data-bentuk="uang"/.exec(h) ?? [];
    expect(Number(w)).toBeGreaterThan(Number(hh) * 1.8);
  });
  it("angka di atas bentuk lain; tanpa angka markup lama tetap", () => {
    expect(html({ shape: "circle", color: "#22b573", angka: "7" })).toContain(">7</span>");
    expect(html({ shape: "circle", color: "#22b573" })).toBe(renderToStaticMarkup(createElement(Benda, { v: { shape: "circle", color: "#22b573" }, size: 56 })));
    expect(html({ shape: "circle", color: "#22b573" })).not.toContain("position:absolute");
  });
  it("emoji tetap menang atas bentuk (perilaku lama)", () => {
    expect(html({ emoji: "🪙", shape: "koin", angka: "500" })).not.toContain("data-bentuk");
  });
  it("tintaKontras: gelap di warna terang, putih di warna gelap", () => {
    expect(tintaKontras("#ffd23f")).toBe("#0b2545");
    expect(tintaKontras("#0b2545")).toBe("#ffffff");
  });
});
