"use client";

// Presenter mekanik dagang: lapak pasar dengan pembeli (emoji) + balon pesanan. Sembilan mode lewat switch `ronde.mode`.
// Presenter hanya menampilkan dan mengirim jawaban; kebenaran dinilai runner (nilaiDagang). Setelah `hasil` terisi interaksi dikunci.

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { PaketDagang } from "@akademi/schema";
import type { JawabanDagang, RondeDagang } from "@akademi/mechanics";
import { useModeUjian } from "./mode-ujian";
import { Icon } from "@/components/ui";
import { useBahasaAnak, type BahasaAnak } from "@/lib/akademi/konten";
import { angkaKata, ucapkan, ucapkanBerurutan } from "@/lib/akademi/suara";
import { useMe } from "@/lib/store";

/**
 * Bacakan pesanan pembeli. Bahasa Indonesia: pola "Aku mau 3 jeruk dan 2 apel." → potongan pra-rekam ElevenLabs,
 * selain pola itu dibacakan utuh. Bahasa Inggris ("I want 3 oranges.") → speechSynthesis voice en-US.
 */
function ucapPesanan(teks: string, bahasa: BahasaAnak = "id") {
  if (bahasa === "en") return ucapkan(teks, "en-US");
  const m = /^Aku mau (\d+) ([^.]+?)(?: dan (\d+) ([^.]+?))?\.$/.exec(teks);
  if (!m) return ucapkan(teks);
  const pot = ["Aku mau", angkaKata(Number(m[1])), m[2]];
  if (m[3]) pot.push("dan", angkaKata(Number(m[3])), m[4]);
  ucapkanBerurutan(pot);
}
import { sfx } from "@/lib/sfx";
import { Benda, KartuBenda, type VisualSpec } from "./benda";
import { usePanggung } from "./dunia";
import { Wadah } from "./wadah";
import { BALOO, BENAR, INK, SALAH, type PresenterProps } from "./jenis";

type Props = PresenterProps<RondeDagang, JawabanDagang, PaketDagang>;
type Good = PaketDagang["goods"][number];

const KOIN = 1000;
const PEMBELI = ["🧒", "👩", "👨"] as const;
let urutanPembeli = 0;

/* ---------------- visual ---------------- */

const EMOJI_BARANG: Record<string, string> = {
  jeruk: "🍊", apel: "🍎", pisang: "🍌", mangga: "🥭", anggur: "🍇", semangka: "🍉", stroberi: "🍓", nanas: "🍍", pepaya: "🍈",
  wortel: "🥕", tomat: "🍅", jagung: "🌽", terong: "🍆", ikan: "🐟", telur: "🥚", roti: "🍞", susu: "🥛", permen: "🍬", kue: "🧁", donat: "🍩", es: "🍦",
};

function visualGood(g: Good | undefined, id: string): VisualSpec {
  if (!g) return { emoji: EMOJI_BARANG[id] ?? "🛍️" };
  const { emoji, color, scale, shape, width, angka } = g;
  return { emoji: emoji ?? (shape ? undefined : EMOJI_BARANG[id] ?? "🛍️"), color, scale, shape, width, angka };
}

function visualUang(nilai: number): VisualSpec & { label: string } {
  const label = formatRibuan(nilai);
  // koin seribu emas tanpa latar; koin < 1000 berlatar perak supaya beda dari seribu
  if (nilai === KOIN) return { emoji: "🪙", color: "#ffd23f", label };
  if (nilai < KOIN) return { emoji: "🪙", color: "#cfd4dc", label, latar: true };
  // uang kertas: 💵 sama untuk semua pecahan, jadi warna pecahan digambar sebagai latar
  const warna: Record<number, string> = { 2000: "#cfd4dc", 5000: "#b5835a", 10000: "#9b7bd6", 20000: "#7ec8a0", 50000: "#6ab0e8", 100000: "#e88a8a" };
  return { emoji: "💵", color: warna[nilai] ?? "#cfd4dc", label, latar: true };
}

function formatRibuan(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
const rupiah = (n: number) => `Rp${formatRibuan(n)}`;

const TANGAN: Record<number, string> = { 0: "✊", 1: "☝️", 2: "✌️", 3: "🤟", 4: "🖖", 5: "🖐️" };
function tangan(n: number): string {
  if (n <= 5) return TANGAN[n] ?? "✊";
  return `🖐️${TANGAN[n - 5] ?? "✊"}`;
}

function ulang(emoji: string, n: number) {
  return Array.from({ length: n }, () => emoji).join("");
}

/**
 * Rincian harga per barang (bayar/kembalian): dipakai bila pembelian > 1 barang, paket tanpa knob `harga`, dan jumlah
 * qty × price persis = harga ronde. Anak menjumlahkan sendiri, jadi total TIDAK ditampilkan/dibacakan (kecuali saat bantuan
 * atau sesudah dijawab). Pembelian 1 barang / paket ber-knob harga (TK) → null, tampilan lama (total).
 */
export function rincianHarga(paket: PaketDagang, ronde: RondeDagang): { goodId: string; qty: number; price: number }[] | null {
  if (paket.knobs?.harga) return null;
  const qty = ronde.pesanan.reduce((s, x) => s + x.qty, 0);
  if (qty < 2) return null;
  const baris = ronde.pesanan.map((x) => ({ goodId: x.goodId, qty: x.qty, price: paket.goods.find((g) => g.id === x.goodId)?.price ?? NaN }));
  return baris.reduce((s, b) => s + b.qty * b.price, 0) === ronde.harga ? baris : null;
}

/** Kalimat VO rincian: "Buku 2 kali 23.000 rupiah dan pensil 9.000 rupiah." */
function ucapRincian(baris: { goodId: string; qty: number; price: number }[], nama: (id: string) => string): string {
  return baris.map((b) => `${nama(b.goodId)} ${b.qty > 1 ? `${b.qty} kali ` : ""}${formatRibuan(b.price)} rupiah`).join(" dan ") + ".";
}

/** Daftar harga per barang + baris total ("?" sampai bantuan/hasil). */
function RincianHarga({ baris, nama, visual, total, buka }: { baris: { goodId: string; qty: number; price: number }[]; nama: (id: string) => string; visual: (id: string) => VisualSpec; total: number; buka: boolean }) {
  const sk = useSk();
  return (
    <div className="flex flex-col gap-1" aria-label="Harga tiap barang">
      {baris.map((b) => (
        <div key={b.goodId} className="flex flex-wrap items-center gap-1.5">
          <Benda v={visual(b.goodId)} size={Math.round(30 * sk)} />
          <span className="font-bold" style={{ fontSize: 14 * sk }}>{nama(b.goodId)}</span>
          {b.qty > 1 && <span className="rounded-full px-2" style={{ ...Tebal, fontSize: 15 * sk, background: "#fff1c2" }}>{b.qty} ×</span>}
          <span style={{ ...Tebal, fontSize: 18 * sk, color: "#0567c2" }}>{rupiah(b.price)}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 border-t border-dashed pt-1" style={{ borderColor: "rgba(11,37,69,.25)" }}>
        <span className="font-bold" style={{ fontSize: 14 * sk }}>Total</span>
        <span className={buka ? "akademi-pop" : ""} style={{ ...Tebal, fontSize: 20 * sk, color: buka ? "#0567c2" : INK }}>{buka ? rupiah(total) : "?"}</span>
      </div>
    </div>
  );
}

/* ---------------- kerangka bersama ---------------- */

const Tebal: CSSProperties = { fontFamily: BALOO, fontWeight: 900, color: INK };

/** Skala isi panggung: 1 di HP, sampai 1,6 di tablet/desktop luas. */
const useSk = () => usePanggung().skala;

/** Panggung mendatar lebar (tablet landscape) → tata dua kolom; selain itu satu kolom ringkas (HP). */
function useLebar() {
  const { w, h } = usePanggung();
  return w >= 760 && h > 0 && w > h * 1.3;
}

/** Skala barang di atas meja lapak: meja mengisi tinggi panggung, jadi barang ikut tinggi panggung (HP tetap 1). */
function useSkMeja() {
  const { skala, h } = usePanggung();
  return skala <= 1 ? 1 : Math.round(Math.min(1.9, Math.max(skala, h / 430)) * 100) / 100;
}

/** Teks keterangan/status di atas latar dunia: selalu di pil putih, teks gelap (kontras di dunia gelap sekalipun). */
function Keterangan({ children, className = "" }: { children: ReactNode; className?: string }) {
  const sk = useSk();
  return (
    <span className={`flex-1 rounded-full bg-white/95 px-3 py-1.5 text-center font-bold shadow-[0_3px_0_rgba(11,37,69,.1)] ${className}`} style={{ fontSize: 14 * sk, color: INK }}>
      {children}
    </span>
  );
}

/**
 * Tata letak mode: satu kolom di HP/potret; di layar mendatar yang lebar (tablet landscape) dua kolom
 * (kiri = pembeli + lapak, kanan = wadah/laci/tombol) supaya isi menyebar memenuhi panggung, bukan pita tengah.
 * Interaksi dikunci saat hasil terisi.
 */
function Kunci({ terkunci, kiri, kanan }: { terkunci: boolean; kiri: ReactNode; kanan: ReactNode }) {
  const { skala } = usePanggung();
  const lebar = useLebar();
  const gap = 12 * skala;
  return (
    <div className={`flex flex-1 ${lebar ? "flex-row" : "flex-col"}`} style={{ gap: lebar ? 16 * skala : gap, ...(terkunci ? { pointerEvents: "none" } : {}) }} aria-busy={terkunci}>
      {lebar ? (
        <>
          <div className="flex min-w-0 flex-[1.15] flex-col" style={{ gap }}>{kiri}</div>
          <div className="flex min-w-0 flex-1 flex-col" style={{ gap }}>{kanan}</div>
        </>
      ) : (
        <>
          {kiri}
          {kanan}
        </>
      )}
    </div>
  );
}

/** Lapak pasar: tenda bergaris warna dunia + meja kayu (papan CSS). Mengisi sisa tinggi kolom; isi ditengahkan di atas meja. */
function Lapak({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  const { tema, skala: sk } = usePanggung();
  // HP (satu kolom): tenda tipis supaya isi tidak meluap dari layar
  const tenda = useLebar() || sk > 1 ? Math.round(16 * sk) : 8;
  return (
    <div className={`relative flex flex-1 flex-col overflow-hidden rounded-[24px] ${className}`} style={{ background: "linear-gradient(180deg,#c98b4a 0,#b9783a 10px,#c98b4a 10px,#c98b4a 26px,#a86a2f 26px,#a86a2f 28px,#c98b4a 28px)", backgroundSize: "100% 56px", boxShadow: "0 6px 0 #7d4a1c, inset 0 2px 0 rgba(255,255,255,.25)", padding: `${tenda + (tenda > 8 ? 10 * sk : 4)}px ${12 * sk}px ${12 * sk}px`, ...style }}>
      {/* tenda: garis-garis warna aksen dunia dengan tepi bergerigi */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ height: tenda, background: `repeating-linear-gradient(90deg,${tema.aksen} 0 ${tenda * 2}px,#fff ${tenda * 2}px ${tenda * 4}px)` }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0" style={{ top: tenda, height: tenda / 2, background: `radial-gradient(circle at ${tenda}px 0,${tema.aksen} ${tenda / 2}px,transparent ${tenda / 2 + 0.5}px) 0 0/${tenda * 2}px 100% repeat-x`, opacity: 0.85 }} />
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

/** Pembeli + balon ucapan (balon bisa diketuk untuk dibacakan ulang). */
function Pembeli({
  wajah, balon, teksUcap, hasil, jawabanBenar, kanan, kecil, bahasa,
}: {
  wajah: string; balon: ReactNode; teksUcap: string; hasil: Props["hasil"]; jawabanBenar?: ReactNode; kanan?: boolean; kecil?: boolean; bahasa?: BahasaAnak;
}) {
  const muka = hasil ? (hasil.benar ? "😄" : "🤔") : wajah;
  const sk = useSk();
  return (
    <div className={`flex shrink-0 items-end gap-2 ${kanan ? "flex-row-reverse" : ""}`}>
      <div className={`shrink-0 ${hasil?.benar ? "akademi-bounce" : ""}`} style={{ fontSize: (kecil ? 48 : 64) * sk, lineHeight: 1, filter: "drop-shadow(0 4px 0 rgba(11,37,69,.15))" }} aria-hidden>
        {muka}
      </div>
      <button
        type="button"
        onClick={() => { sfx.tap(); ucapPesanan(teksUcap, bahasa); }}
        aria-label={`Dengar pesanan: ${teksUcap}`}
        className="relative min-h-14 flex-1 rounded-[20px] bg-white px-3 py-2 text-left active:scale-[.98]"
        style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)", color: INK, minHeight: 56 * sk, padding: `${8 * sk}px ${12 * sk}px` }}
      >
        <span aria-hidden className="absolute bottom-4" style={kanan ? { right: -9, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "9px solid #fff" } : { left: -9, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "9px solid #fff" }} />
        <span className="absolute top-1.5 right-2 text-[#0567c2]"><Icon name="volume_up" size={Math.round(18 * sk)} /></span>
        <div className="pr-6">{balon}</div>
        {hasil && jawabanBenar && (
          <div className="akademi-pop mt-1 flex items-center gap-1.5 rounded-[12px] px-2 py-1" style={{ background: hasil.benar ? "#e4f8ee" : "#ffe9ec", fontFamily: BALOO, fontWeight: 800, fontSize: 14 * sk, color: hasil.benar ? BENAR : SALAH }}>
            <Icon name={hasil.benar ? "check_circle" : "info"} size={Math.round(18 * sk)} />
            <span>{jawabanBenar}</span>
          </div>
        )}
      </button>
    </div>
  );
}

/** Baris pesanan di balon: emoji diulang qty kali + angka kecil. */
function BarisPesanan({ v, qty, label }: { v: VisualSpec; qty: number; label: string }) {
  const sk = useSk();
  return (
    <div className="flex flex-wrap items-center gap-1">
      {Array.from({ length: qty }, (_, k) => <Benda key={k} v={v} size={Math.round(30 * sk)} />)}
      <span className="ml-1 rounded-full px-2" style={{ ...Tebal, fontSize: 16 * sk, background: "#fff1c2" }}>{qty}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function TombolBesar({ children, onClick, disabled, warna = "#22b573", bayang = "#16804f", className = "" }: { children: ReactNode; onClick: () => void; disabled?: boolean; warna?: string; bayang?: string; className?: string }) {
  const sk = useSk();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-16 flex-1 items-center justify-center gap-2 rounded-[20px] px-4 text-white transition-transform active:translate-y-1 ${className}`}
      style={{ background: disabled ? "#cdd6d2" : warna, boxShadow: `0 5px 0 ${disabled ? "#aab5b0" : bayang}`, fontFamily: BALOO, fontWeight: 900, fontSize: 20 * Math.min(sk, 1.4), minHeight: 64 * sk }}
    >
      {children}
    </button>
  );
}

function TombolBantu({ onClick, disabled, label = "Bantu" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  const sk = useSk();
  if (useModeUjian()) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex min-h-14 min-w-14 items-center justify-center gap-1 rounded-[20px] bg-white px-3 text-[#b8860b] active:scale-95 disabled:opacity-50"
      style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)", fontFamily: BALOO, fontWeight: 800, fontSize: 15 * Math.min(sk, 1.4), minHeight: 56 * sk, minWidth: 56 * sk }}
    >
      <Icon name="lightbulb" size={Math.round(26 * sk)} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/** Strip angka: tombol bulat besar min..max. */
/** Angka tertinggi minimal di strip jawaban. */
const PILIHAN_MINIMAL = 10;

function StripAngka({ min, max, dipilih, sorot, onPilih, disabled }: { min: number; max: number; dipilih?: number | null; sorot?: number | null; onPilih: (n: number) => void; disabled?: boolean }) {
  // Pilihan selalu sampai minimal 10 agar anak tidak bisa menebak dari sedikit tombol; soal tetap mengikuti jenjang.
  const atas = Math.max(max, PILIHAN_MINIMAL);
  const angka = useMemo(() => Array.from({ length: Math.max(0, atas - min + 1) }, (_, k) => min + k), [min, atas]);
  // Penanda kuning: diseret dari parkiran ke angka (atau angka diketuk langsung); dilepas = jawaban.
  const [seret, setSeret] = useState(false);
  const [geser, setGeser] = useState<number | null>(null);
  const angkaDi = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-angka]");
    return el ? Number(el.dataset.angka) : null;
  };
  const tampil = seret ? geser : (dipilih ?? null);
  // tombol angka ikut skala panggung, dibatasi supaya 11 angka tetap muat dua baris di tablet
  const lebar = useLebar();
  const skPanggung = useSk();
  const banyak = !lebar && atas - min + 1 > 11;
  // HP dengan banyak angka (mis. 11–20): tombol dirapatkan supaya strip tidak memakan banyak baris
  const s = banyak ? 0.75 : Math.min(skPanggung, 1.4);
  const bulat = Math.round(64 * s);
  return (
    <div
      className="flex shrink-0 select-none flex-wrap items-center justify-center gap-2 rounded-[20px] bg-white p-2 pt-5 shadow-[0_4px_0_rgba(11,37,69,.12)]"
      style={{ touchAction: "none", gap: 8 * s, paddingTop: 20 * s }}
      role="group"
      aria-label="Geser penanda ke angka"
      onPointerDown={(e) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setSeret(true);
        setGeser(angkaDi(e.clientX, e.clientY));
      }}
      onPointerMove={(e) => { if (seret) setGeser(angkaDi(e.clientX, e.clientY)); }}
      onPointerUp={() => {
        if (!seret) return;
        setSeret(false);
        if (geser != null) onPilih(geser);
      }}
      onPointerCancel={() => setSeret(false)}
    >
      <span
        className={`flex size-12 shrink-0 cursor-grab items-center justify-center rounded-full ${tampil == null && !disabled ? "akademi-bounce" : ""}`}
        style={{ width: 48 * s, height: 48 * s, background: tampil == null ? "#ffd23f" : "rgba(11,37,69,.08)", boxShadow: tampil == null ? "0 4px 0 #d9a400" : "none", opacity: disabled ? 0.6 : 1 }}
        aria-hidden
      >
        {tampil == null && <Penanda />}
      </span>
      {angka.map((n) => {
        const aktif = tampil === n;
        return (
          <button
            key={n}
            type="button"
            data-angka={n}
            disabled={disabled}
            onClick={(e) => { if (e.detail === 0) onPilih(n); }}
            className={`relative flex size-16 items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-60 ${sorot === n ? "akademi-bounce" : ""}`}
            style={{ ...Tebal, width: bulat, height: bulat, fontSize: 28 * s, background: aktif ? "#0786eb" : "#fff", color: aktif ? "#fff" : INK, boxShadow: `0 4px 0 ${aktif ? "#0567c2" : "rgba(11,37,69,.15)"}${sorot === n ? ", 0 0 0 4px #ffd23f" : ""}` }}
            aria-label={`Angka ${n}`}
          >
            {n}
            {aktif && <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2"><Penanda /></span>}
          </button>
        );
      })}
    </div>
  );
}

/** Penanda strip: segitiga kuning menunjuk ke bawah. */
function Penanda() {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" aria-hidden>
      <path d="M3 3h22L14 21z" fill="#ffd23f" stroke="#0b2545" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Keranjang 🧺: isi bisa diketuk untuk dikembalikan. */
function Keranjang({ isi, onKembali, judul = "Keranjang", kosong = "Ketuk barang di lapak", ikon = "🧺", sorot, className = "" }: { isi: { key: string; v: VisualSpec; label?: string }[]; onKembali?: (key: string) => void; judul?: string; kosong?: string; ikon?: string; sorot?: boolean; className?: string }) {
  const sk = useSk();
  return (
    <Wadah
      className={`flex-1 ${className}`}
      ring={sorot ? "#ffd23f" : undefined}
      minIsi={72}
      label={
        <>
          <span style={{ fontSize: 26 * sk, lineHeight: 1 }}>{ikon}</span>
          <span>{judul}</span>
          <span className="rounded-full px-2.5" style={{ ...Tebal, fontSize: 17 * sk, background: "#fff1c2" }}>{isi.length}</span>
        </>
      }
    >
      {isi.length === 0 && <span className="w-full rounded-full bg-white/80 px-3 py-1 text-center font-bold" style={{ fontSize: 14 * sk, color: INK }}>{kosong}</span>}
      {isi.map((b) => (
        <KartuBenda key={b.key} v={b.v} size={Math.round(44 * sk)} label={b.label} labelSize={Math.round(13 * sk)} onClick={onKembali ? () => onKembali(b.key) : undefined} className="min-h-14 min-w-14 akademi-pop" style={{ minHeight: 56 * sk, minWidth: 56 * sk }} />
      ))}
    </Wadah>
  );
}

/** Laci uang: tombol per pecahan (dikelompokkan), tampil sisa lembar. */
function Laci({ laci, dipakai, onAmbil, sorot, disabled, penuh }: { laci: number[]; dipakai: number[]; onAmbil: (nilai: number) => void; sorot?: number | null; disabled?: boolean; /** mengisi sisa tinggi kolom */ penuh?: boolean }) {
  const kelompok = useMemo(() => {
    const m = new Map<number, number>();
    for (const d of laci) m.set(d, (m.get(d) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [laci]);
  const terpakai = (nilai: number) => dipakai.filter((x) => x === nilai).length;
  const { tema, skala: sk } = usePanggung();
  return (
    // laci kasir: badan kayu/warna wadah dunia, sekat-sekat pecahan di dalam, gagang di depan
    <div className={`relative flex flex-col rounded-[22px] ${penuh ? "flex-1" : "shrink-0"}`} style={{ background: `linear-gradient(180deg,${tema.wadahWarna},${tema.wadahGelap})`, boxShadow: `0 6px 0 ${tema.wadahGelap}, inset 0 2px 0 rgba(255,255,255,.25)`, padding: `${10 * sk}px ${12 * sk}px ${20 * sk}px` }}>
      <div className="mb-1.5 flex w-fit items-center gap-2 rounded-full bg-white/95 px-3 py-0.5 shadow-[0_3px_0_rgba(0,0,0,.12)]" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 15 * sk, color: INK }}>
        <Icon name="point_of_sale" size={Math.round(20 * sk)} /> Laci uang
      </div>
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full" style={{ bottom: 6 * sk, width: 56 * sk, height: 7 * sk, background: tema.wadahGelap, boxShadow: "inset 0 2px 0 rgba(0,0,0,.25)" }} />
      <div className={`flex flex-wrap content-center justify-center rounded-[16px] ${penuh ? "flex-1" : ""}`} style={{ gap: 8 * sk, padding: 6 * sk, background: "rgba(0,0,0,.16)", boxShadow: "inset 0 4px 8px rgba(0,0,0,.2)" }}>
        {kelompok.map(([nilai, jumlah]) => {
          const sisa = jumlah - terpakai(nilai);
          const v = visualUang(nilai);
          return (
            <KartuBenda
              key={nilai}
              v={v}
              size={Math.round(44 * sk)}
              label={v.label}
              labelSize={Math.round(13 * sk)}
              dim={sisa <= 0}
              selected={sorot === nilai}
              onClick={() => { if (!disabled && sisa > 0) onAmbil(nilai); }}
              className={`relative min-h-16 min-w-[72px] ${sorot === nilai ? "akademi-bounce" : ""}`}
              style={{ minHeight: 64 * sk, minWidth: 72 * sk, background: `linear-gradient(180deg,#fff,${v.color}33)`, ...(disabled || sisa <= 0 ? { pointerEvents: "none" } : {}) }}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Nampan uang: uang yang sudah ditaruh (ketuk untuk ambil lagi) + total kecil. */
function Nampan({ uang, onAmbil, judul = "Nampan", sorot, kosong = "Ketuk uang di laci" }: { uang: number[]; onAmbil?: (i: number) => void; judul?: string; sorot?: boolean; kosong?: string }) {
  const total = uang.reduce((s, x) => s + x, 0);
  const { tema, skala: sk } = usePanggung();
  return (
    // baki: bibir tebal warna wadah dunia, alas terang cekung tempat uang ditaruh
    <div className="flex flex-1 flex-col rounded-[26px]" style={{ background: `linear-gradient(180deg,${tema.wadahWarna},${tema.wadahGelap})`, boxShadow: `0 6px 0 ${tema.wadahGelap}${sorot ? ", 0 0 0 4px #ffd23f" : ""}`, padding: 10 * sk, gap: 8 * sk }}>
      <div className="flex items-center gap-2 self-stretch rounded-full bg-white/95 px-3 py-1 shadow-[0_3px_0_rgba(0,0,0,.12)]" style={{ ...Tebal, fontSize: 16 * sk }}>
        <span style={{ fontSize: 24 * sk, lineHeight: 1 }}>🍽️</span>
        <span>{judul}</span>
        <span className="ml-auto rounded-full px-3" style={{ fontSize: 15 * sk, background: "#fff1c2" }}>{rupiah(total)}</span>
      </div>
      <div className="flex flex-1 flex-wrap content-center items-center justify-center rounded-[20px]" style={{ minHeight: 64 * sk, gap: 8 * sk, padding: 8 * sk, background: tema.panel, boxShadow: `inset 0 4px 10px rgba(0,0,0,.16), inset 0 0 0 3px ${tema.aksen}22` }}>
        {uang.length === 0 && <span className="w-full text-center font-bold" style={{ fontSize: 14 * sk, color: "#4a5a6e" }}>{kosong}</span>}
        {uang.map((nilai, i) => {
          const v = visualUang(nilai);
          return <KartuBenda key={`${i}-${nilai}`} v={v} size={Math.round(36 * sk)} label={v.label} labelSize={Math.round(13 * sk)} onClick={onAmbil ? () => onAmbil(i) : undefined} className="min-h-14 min-w-14 akademi-pop" style={{ minHeight: 56 * sk, minWidth: 56 * sk }} />;
        })}
      </div>
    </div>
  );
}

/** Harga: "koin" → deretan 🪙 sebanyak harga/1000 ; "rupiah" → Rp besar + emoji barang. */
function Harga({ harga, priceLabel, barang }: { harga: number; priceLabel: RondeDagang["priceLabel"]; barang: VisualSpec[] }) {
  const koin = Math.max(0, Math.round(harga / KOIN));
  const sk = useSk();
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[18px] bg-white px-3 py-2" style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}>
      {barang.slice(0, 3).map((v, k) => <Benda key={k} v={v} size={Math.round(44 * sk)} />)}
      <span aria-hidden style={{ ...Tebal, fontSize: 22 * sk }}>=</span>
      {priceLabel === "koin" ? (
        <span className="flex flex-wrap items-center gap-0.5" aria-label={`${koin} koin`}>
          {Array.from({ length: koin }, (_, k) => <span key={k} style={{ fontSize: 28 * sk, lineHeight: 1 }}>🪙</span>)}
          <span className="ml-1 rounded-full px-2" style={{ ...Tebal, fontSize: 16 * sk, background: "#fff1c2" }}>{koin}</span>
        </span>
      ) : (
        <span style={{ ...Tebal, fontSize: 32 * sk, color: "#0567c2" }}>{rupiah(harga)}</span>
      )}
    </div>
  );
}

/** Hook: hitung latency sejak suatu momen (ms). */
function useJam() {
  const mulai = useRef<number | null>(null);
  return {
    mulai: () => { mulai.current = Date.now(); },
    latency: () => (mulai.current === null ? undefined : Date.now() - mulai.current),
  };
}

/** Bantuan: dipakai semua mode. Memanggil onHint lalu menandai hint lokal. */
function useBantu(onHint?: () => void) {
  const [hint, setHint] = useState(false);
  const bantu = useCallback(() => { onHint?.(); setHint(true); }, [onHint]);
  return { hint, bantu, setHint };
}

/* ---------------- presenter utama ---------------- */

export function PresenterDagang(props: Props) {
  const { paket, ronde, t } = props;
  const me = useMe();
  const bahasa = useBahasaAnak(me?.id ?? "dev");
  const [pembeliIdx] = useState(() => urutanPembeli++);
  const wajah = PEMBELI[pembeliIdx % PEMBELI.length];
  const goodById = useCallback((id: string) => paket.goods.find((g) => g.id === id), [paket.goods]);
  const nama = useCallback((id: string) => { const g = goodById(id); return g ? t(g.labelKey) : id; }, [goodById, t]);
  const visual = useCallback((id: string) => visualGood(goodById(id), id), [goodById]);
  const ctx: Ctx = { ...props, wajah, nama, visual, bahasa, terkunci: !!props.hasil };

  switch (ronde.mode) {
    case "ambil": return <ModeAmbil {...ctx} />;
    case "subitasi": return <ModeSubitasi {...ctx} />;
    case "hitung": return <ModeHitung {...ctx} />;
    case "bayar": return <ModeBayar {...ctx} />;
    case "kembalian": return <ModeKembalian {...ctx} />;
    case "tukar": return <ModeTukar {...ctx} />;
    case "lengkapi": return <ModeLengkapi {...ctx} />;
    case "gabung": return <ModeGabung {...ctx} />;
    case "sisa": return <ModeSisa {...ctx} />;
  }
  return null;
}

interface Ctx extends Props {
  wajah: string;
  /** bahasa konten anak; menentukan kalimat pesanan ("Aku mau …" / "I want …") dan voice pembacaannya */
  bahasa: BahasaAnak;
  nama: (goodId: string) => string;
  visual: (goodId: string) => VisualSpec;
  terkunci: boolean;
}

/* ---------------- ambil ---------------- */

function ModeAmbil(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual, wajah, bahasa } = c;
  const [keranjang, setKeranjang] = useState<Record<string, number>>({});
  const { hint, bantu } = useBantu(c.onHint);
  const goods = useMemo(() => Object.keys(ronde.tersedia), [ronde.tersedia]);
  const teks = useMemo(
    () => (bahasa === "en" ? "I want " : "Aku mau ") + ronde.pesanan.map((p) => `${p.qty} ${nama(p.goodId)}`).join(bahasa === "en" ? " and " : " dan ") + ".",
    [ronde.pesanan, nama, bahasa],
  );
  const kurang = (id: string) => (ronde.pesanan.find((p) => p.goodId === id)?.qty ?? 0) - (keranjang[id] ?? 0);

  const ambil = (id: string) => {
    if ((keranjang[id] ?? 0) >= (ronde.tersedia[id] ?? 0)) return;
    sfx.pick();
    setKeranjang((k) => ({ ...k, [id]: (k[id] ?? 0) + 1 }));
  };
  const kembali = (id: string) => {
    sfx.plop();
    setKeranjang((k) => ({ ...k, [id]: Math.max(0, (k[id] ?? 0) - 1) }));
  };
  const isi = goods.flatMap((id) => Array.from({ length: keranjang[id] ?? 0 }, (_, k) => ({ key: `${id}-${k}`, v: visual(id), label: nama(id) })));
  const sk = useSk();

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil} bahasa={bahasa}
        balon={<div className="flex flex-col gap-1">{ronde.pesanan.map((p) => <BarisPesanan key={p.goodId} v={visual(p.goodId)} qty={p.qty} label={nama(p.goodId)} />)}</div>}
        jawabanBenar={ronde.pesanan.map((p) => `${p.qty} ${nama(p.goodId)}`).join(" + ")}
      />
      <Lapak>
        <div className="flex flex-1 flex-col justify-around" style={{ gap: 8 * sk }}>
          {goods.map((id) => {
            const sisa = (ronde.tersedia[id] ?? 0) - (keranjang[id] ?? 0);
            const sorot = hint && kurang(id) > 0;
            return (
              <div key={id} className="flex items-center gap-2 overflow-x-auto rounded-[16px] px-2 py-1" style={{ background: sorot ? "rgba(255,210,63,.75)" : "rgba(255,255,255,.3)", gap: 8 * sk, padding: `${4 * sk}px ${8 * sk}px` }}>
                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-center" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 14 * sk, color: INK, minWidth: 64 * sk }}>{nama(id)}</span>
                {Array.from({ length: sisa }, (_, k) => (
                  <KartuBenda key={k} v={visual(id)} size={Math.round(44 * sk)} keterangan={false} onClick={() => ambil(id)} className={`min-h-14 min-w-14 shrink-0 ${sorot && k < kurang(id) ? "akademi-bounce" : ""}`} style={{ minHeight: 56 * sk, minWidth: 56 * sk }} />
                ))}
                {sisa === 0 && <span className="rounded-full bg-white px-2 py-0.5 font-bold" style={{ fontSize: 13 * sk, color: INK }}>habis</span>}
              </div>
            );
          })}
        </div>
      </Lapak>
    </>} kanan={<>
      <Keranjang isi={isi} onKembali={(key) => kembali(key.replace(/-\d+$/, ""))} />
      <div className="flex shrink-0 gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ keranjang }); }} disabled={terkunci || isi.length === 0}>
          <Icon name="volunteer_activism" size={26} /> Beri ke pembeli
        </TombolBesar>
      </div>
    </>} />
  );
}

/* ---------------- subitasi ---------------- */

function ModeSubitasi(c: Ctx) {
  const ujian = useModeUjian();
  const { ronde, onJawab, hasil, terkunci, nama, visual, wajah } = c;
  const pesanan = ronde.pesanan[0] ?? { goodId: Object.keys(ronde.tersedia)[0] ?? "", qty: ronde.target };
  const id = pesanan.goodId;
  const target = pesanan.qty;
  const tersedia = ronde.tersedia[id] ?? target + 2;
  const [jumlah, setJumlah] = useState(0);
  // Anak sendiri yang memulai kilasan jari (ketuk "Lihat jari") supaya tidak terlewat saat instruksi dibacakan.
  const [sudahLihat, setSudahLihat] = useState(false);
  const [tampil, setTampil] = useState(false);
  const jam = useJam();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback(() => {
    setTampil(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setTampil(false); jam.mulai(); }, Math.max(300, ronde.flashMs || 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ronde.flashMs]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const lihatPertama = () => { sfx.tap(); setSudahLihat(true); flash(); };

  const lihatLagi = () => { c.onHint?.(); flash(); };
  const teks = `Aku mau ${nama(id)} sebanyak jariku.`;
  const sk = useSk();
  const meja = useSkMeja();

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={
          !sudahLihat ? (
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 48 * sk, lineHeight: 1 }}>🖐️</span>
              <span style={{ ...Tebal, fontSize: 18 * sk }}>Siap? Lihat jariku!</span>
            </div>
          ) : tampil ? (
            <div className="flex items-center gap-3">
              <span className="akademi-pop" style={{ fontSize: 56 * sk, lineHeight: 1 }} aria-label={`${target} jari`}>{tangan(target)}</span>
              <span style={{ ...Tebal, fontSize: 18 * sk }}>Lihat jarinya!</span>
            </div>
          ) : (
            // tangan sudah turun: satu pertanyaan jelas, bukan kepalan tangan yang bisa dikira "nol"
            <div className="flex items-center gap-3" aria-label="Tangan sudah turun. Berapa jari tadi?">
              <span style={{ fontSize: 48 * sk, lineHeight: 1 }}>🙈</span>
              <span style={{ ...Tebal, fontSize: 18 * sk }}>Berapa jari tadi?</span>
            </div>
          )
        }
        jawabanBenar={`${target} ${nama(id)}`}
      />
      <Lapak>
        <div className="flex flex-wrap content-center justify-center" style={{ gap: 8 * sk }}>
          {Array.from({ length: tersedia - jumlah }, (_, k) => (
            <KartuBenda key={k} v={visual(id)} size={Math.round(48 * meja)} keterangan={false} onClick={() => { if (sudahLihat && !tampil) { sfx.pick(); setJumlah((n) => n + 1); } }} dim={!sudahLihat || tampil} className="min-h-14 min-w-14" style={{ minHeight: 56 * sk, minWidth: 56 * sk }} />
          ))}
        </div>
      </Lapak>
    </>} kanan={<>
      <Keranjang isi={Array.from({ length: jumlah }, (_, k) => ({ key: String(k), v: visual(id) }))} onKembali={() => { sfx.plop(); setJumlah((n) => Math.max(0, n - 1)); }} />
      {!sudahLihat ? (
        <div className="flex shrink-0">
          <TombolBesar onClick={lihatPertama} warna="#0786eb" bayang="#0567c2">
            <Icon name="visibility" size={26} /> Lihat jari
          </TombolBesar>
        </div>
      ) : (
      <div className="flex shrink-0 gap-2">
        {!ujian && <button type="button" onClick={lihatLagi} disabled={terkunci || tampil} className="flex min-h-14 items-center gap-1 rounded-[20px] bg-white px-3 text-[#0567c2] active:scale-95 disabled:bg-[#eef1f0] disabled:text-[#6b7a8a]" style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)", fontFamily: BALOO, fontWeight: 800, fontSize: 15 * Math.min(sk, 1.4), minHeight: 56 * sk }}>
          <Icon name="visibility" size={Math.round(24 * sk)} /> Lihat lagi
        </button>}
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ keranjang: { [id]: jumlah }, latencyMs: jam.latency() }); }} disabled={terkunci || tampil || jumlah === 0}>
          <Icon name="volunteer_activism" size={26} /> Beri
        </TombolBesar>
      </div>
      )}
    </>} />
  );
}

/* ---------------- hitung ---------------- */

/** Posisi acak-stabil dari indeks: grid + jitter, tidak bertumpuk. */
function posisiBenda(n: number): { left: string; top: string }[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n * 1.8)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const noise = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
  return Array.from({ length: n }, (_, i) => {
    const cx = (i % cols + 0.5) / cols, cy = (Math.floor(i / cols) + 0.5) / rows;
    const jx = (noise(i, 1) - 0.5) * 0.5 / cols, jy = (noise(i, 2) - 0.5) * 0.5 / rows;
    return { left: `${(cx + jx) * 100}%`, top: `${(cy + jy) * 100}%` };
  });
}

function ModeHitung(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual, wajah } = c;
  const [urutan, setUrutan] = useState<Record<number, number>>({});
  const sentuhan = useRef<string[]>([]);
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  const pos = useMemo(() => posisiBenda(ronde.benda.length), [ronde.benda.length]);
  const n = ronde.benda.length;
  const terhitung = Object.keys(urutan).length;
  const id0 = ronde.benda[0] ?? "";
  const teks = `Ada berapa ${nama(id0)} di meja? Sentuh satu-satu, lalu pilih angkanya.`;

  const sentuh = (i: number) => {
    sentuhan.current.push(String(i));
    if (urutan[i] !== undefined) { sfx.thud(); return; }
    sfx.coin();
    setUrutan((u) => ({ ...u, [i]: Object.keys(u).length + 1 }));
  };
  const lebar = useLebar();
  const tinggi = n <= 5 ? 180 : n <= 10 ? 240 : lebar ? 300 : 230;
  const sk = useSk();
  const meja = useSkMeja();
  // benda hitung ikut meja; bila banyak, dibatasi supaya tidak saling menindih
  const skB = n > 10 ? (lebar ? sk : 0.8) : meja;
  const bulat = Math.round(64 * skB);

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli wajah={wajah} teksUcap={teks} hasil={hasil} balon={<div className="flex items-center gap-2"><Benda v={visual(id0)} size={Math.round(34 * sk)} /><span style={{ ...Tebal, fontSize: 24 * sk }}>?</span><span className="font-bold" style={{ fontSize: 14 * sk, color: "#4a5a6e" }}>Ada berapa?</span></div>} jawabanBenar={`${ronde.target} ${nama(id0)}`} />
      <Lapak>
        {/* meja hitung mengisi sisa tinggi; benda tersebar di seluruh meja */}
        <div className="relative w-full flex-1" style={{ minHeight: tinggi * sk, margin: lebar ? `${bulat / 2}px 0` : undefined }} role="group" aria-label="Benda untuk dihitung">
          {ronde.benda.map((gid, i) => {
            const no = urutan[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => sentuh(i)}
                aria-label={no ? `${nama(gid)} ke-${no}` : nama(gid)}
                className={`absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-90 ${hint && !no ? "akademi-bounce" : ""}`}
                style={{ ...pos[i], width: bulat, height: bulat, background: no ? "rgba(214,236,255,.92)" : "#fff", boxShadow: no ? "inset 0 0 0 3px #0786eb" : "0 4px 0 rgba(11,37,69,.18)" }}
              >
                <span style={{ opacity: no ? 0.6 : 1 }}><Benda v={visual(gid)} size={Math.round(44 * skB)} /></span>
                {no && <span className="akademi-pop absolute -top-2 -right-1 flex items-center justify-center rounded-full bg-[#0786eb] text-white" style={{ width: 32 * sk, height: 32 * sk, fontFamily: BALOO, fontWeight: 900, fontSize: 18 * sk, boxShadow: "0 0 0 2px #fff" }}>{no}</span>}
              </button>
            );
          })}
        </div>
      </Lapak>
    </>} kanan={<>
      <div className="flex shrink-0 items-center gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <Keterangan>{terhitung > 0 ? `Sudah dihitung: ${terhitung}` : "Sentuh satu per satu"}</Keterangan>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <StripAngka min={ronde.strip[0]} max={ronde.strip[1]} dipilih={hasil ? ronde.target : dipilih} sorot={hint && terhitung === n ? terhitung : null} disabled={terkunci} onPilih={(a) => { setDipilih(a); sfx.tap(); onJawab({ angka: a, disentuh: [...sentuhan.current] }); }} />
      </div>
    </>} />
  );
}

/* ---------------- uang: bayar / kembalian / tukar / lengkapi ---------------- */

/** Pecahan tepat berikutnya untuk mencapai `sisa` dari yang masih ada di laci. */
function pecahanBerikut(laci: number[], dipakai: number[], sisa: number): number | null {
  if (sisa <= 0) return null;
  const tersisa = [...laci];
  for (const d of dipakai) { const i = tersisa.indexOf(d); if (i >= 0) tersisa.splice(i, 1); }
  const unik = [...new Set(tersisa)].sort((a, b) => b - a);
  return unik.find((d) => d <= sisa) ?? null;
}

function useNampan(batas?: number) {
  const [uang, setUang] = useState<number[]>([]);
  const ambil = (nilai: number) => { if (batas !== undefined && uang.length >= batas) return; sfx.coin(); setUang((u) => [...u, nilai]); };
  const kembalikan = (i: number) => { sfx.clink(); setUang((u) => u.filter((_, k) => k !== i)); };
  const total = uang.reduce((s, x) => s + x, 0);
  return { uang, ambil, kembalikan, total };
}

function ModeBayar(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual, wajah } = c;
  const { uang, ambil, kembalikan, total } = useNampan();
  const { hint, bantu } = useBantu(c.onHint);
  const barang = ronde.pesanan.length ? ronde.pesanan : [];
  const rincian = useMemo(() => rincianHarga(c.paket, ronde), [c.paket, ronde]);
  const teks = rincian
    ? `${ucapRincian(rincian, nama)} Berapa semuanya? Bayar dengan uang pas.`
    : ronde.priceLabel === "koin" ? `Harganya ${Math.round(ronde.harga / KOIN)} koin.` : `Harganya ${formatRibuan(ronde.harga)} rupiah.`;
  const sorot = hint ? pecahanBerikut(ronde.laci, uang, ronde.harga - total) : null;
  const sk = useSk();
  const meja = useSkMeja();

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli wajah={wajah} teksUcap={teks} hasil={hasil} balon={rincian
        ? <RincianHarga baris={rincian} nama={nama} visual={visual} total={ronde.harga} buka={hint || !!hasil} />
        : <Harga harga={ronde.harga} priceLabel={ronde.priceLabel} barang={barang.map((p) => ({ ...visual(p.goodId), count: p.qty }))} />} jawabanBenar={ronde.priceLabel === "koin" ? `${Math.round(ronde.harga / KOIN)} koin` : rupiah(ronde.harga)} />
      <Lapak><div className="flex flex-wrap justify-center" style={{ gap: 8 * sk }}>{barang.map((p) => <KartuBenda key={p.goodId} v={{ ...visual(p.goodId), count: p.qty }} size={Math.round(52 * meja)} label={nama(p.goodId)} labelSize={Math.round(14 * sk)} className="min-h-14 min-w-14" />)}</div></Lapak>
    </>} kanan={<>
      <Nampan uang={uang} onAmbil={kembalikan} judul="Nampan bayar" sorot={hint && total === ronde.harga} />
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={ambil} sorot={sorot} disabled={terkunci} />
      <div className="flex shrink-0 gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang }); }} disabled={terkunci || uang.length === 0}><Icon name="payments" size={26} /> Bayar</TombolBesar>
      </div>
    </>} />
  );
}

function ModeKembalian(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual, wajah } = c;
  const { uang, ambil, kembalikan, total } = useNampan();
  const { hint, bantu } = useBantu(c.onHint);
  const kembalian = ronde.dibayar - ronde.harga;
  const vBayar = visualUang(ronde.dibayar);
  const rincian = useMemo(() => rincianHarga(c.paket, ronde), [c.paket, ronde]);
  const teks = rincian
    ? `Ini uang ${formatRibuan(ronde.dibayar)}. ${ucapRincian(rincian, nama)} Jumlahkan harganya. Berapa kembaliannya?`
    : `Ini uang ${formatRibuan(ronde.dibayar)}. Harganya ${formatRibuan(ronde.harga)}. Berapa kembaliannya?`;
  const sorot = hint ? pecahanBerikut(ronde.laci, uang, kembalian - total) : null;
  const langkah = useMemo(() => { const out: number[] = []; for (let v = ronde.harga; v <= ronde.dibayar; v += KOIN) out.push(v); return out.length <= 12 ? out : []; }, [ronde.harga, ronde.dibayar]);
  const sk = useSk();
  const meja = useSkMeja();

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={rincian ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2"><Benda v={vBayar} size={Math.round(40 * sk)} /><span style={{ ...Tebal, fontSize: 20 * sk }}>{rupiah(ronde.dibayar)}</span></div>
            <RincianHarga baris={rincian} nama={nama} visual={visual} total={ronde.harga} buka={hint || !!hasil} />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Benda v={vBayar} size={Math.round(40 * sk)} /><span style={{ ...Tebal, fontSize: 20 * sk }}>{rupiah(ronde.dibayar)}</span>
            <span style={{ ...Tebal, fontSize: 20 * sk, color: "#6b7a8a" }}>→</span>
            {ronde.pesanan.map((p) => <Benda key={p.goodId} v={{ ...visual(p.goodId), count: p.qty }} size={Math.round(36 * sk)} />)}
            <span style={{ ...Tebal, fontSize: 18 * sk, color: "#0567c2" }}>{rupiah(ronde.harga)}</span>
          </div>
        )}
        jawabanBenar={rincian ? `Total ${rupiah(ronde.harga)} · kembalian ${rupiah(kembalian)}` : `Kembalian ${rupiah(kembalian)}`}
      />
      <Lapak>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 12 * sk }}>
          <div className="flex items-center gap-2 rounded-[16px] bg-white px-3 py-2" style={{ color: INK, boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}><Benda v={vBayar} size={Math.round(48 * meja)} /><span style={{ ...Tebal, fontSize: 18 * meja }}>{vBayar.label}</span></div>
          {ronde.pesanan.map((p) => <KartuBenda key={p.goodId} v={{ ...visual(p.goodId), count: p.qty }} size={Math.round(48 * meja)} label={nama(p.goodId)} labelSize={Math.round(13 * sk)} className="min-h-14 min-w-14" />)}
        </div>
        {hint && langkah.length > 0 && (
          <div className="akademi-pop mt-2 flex flex-wrap items-center justify-center gap-1 rounded-[16px] bg-white p-2" aria-label="Hitung maju dari harga ke uang pembeli">
            {langkah.map((v, k) => (
              <span key={v} className="flex items-center gap-1">
                <span className="rounded-full px-2 py-0.5" style={{ ...Tebal, fontSize: 14 * sk, background: k === 0 ? "#0786eb" : k === langkah.length - 1 ? "#22b573" : "#fff1c2", color: k === 0 || k === langkah.length - 1 ? "#fff" : INK }}>{formatRibuan(v)}</span>
                {k < langkah.length - 1 && <span style={{ fontSize: 16 }}>🪙</span>}
              </span>
            ))}
          </div>
        )}
      </Lapak>
    </>} kanan={<>
      <Nampan uang={uang} onAmbil={kembalikan} judul="Kembalian" sorot={hint && total === kembalian} />
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={ambil} sorot={sorot} disabled={terkunci} />
      <div className="flex shrink-0 gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang }); }} disabled={terkunci || uang.length === 0}><Icon name="currency_exchange" size={26} /> Beri kembalian</TombolBesar>
      </div>
    </>} />
  );
}

function ModeTukar(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, wajah } = c;
  const slot = Math.max(1, Math.round(ronde.dibayar / KOIN));
  const { uang, ambil, kembalikan, total } = useNampan(ronde.laci.length);
  const { hint, bantu } = useBantu(c.onHint);
  const lembar = ronde.lembar.length ? ronde.lembar : [ronde.dibayar];
  const teks = `Tolong tukar uang ${lembar.map(formatRibuan).join(" dan ")}${lembar.length > 1 ? `, semuanya ${formatRibuan(ronde.dibayar)},` : ""} jadi koin seribuan.`;
  const { tema, skala: sk } = usePanggung();
  const slotPx = Math.round(56 * sk);

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli wajah={wajah} teksUcap={teks} hasil={hasil} balon={<div className="flex flex-wrap items-center gap-2">{lembar.map((v, i) => <Benda key={i} v={visualUang(v)} size={Math.round(36 * sk)} />)}<span style={{ ...Tebal, fontSize: 20 * sk }}>{rupiah(ronde.dibayar)}</span><span style={{ ...Tebal, fontSize: 20 * sk, color: "#6b7a8a" }}>→</span><span style={{ fontSize: 28 * sk }}>🪙</span><span style={{ ...Tebal, fontSize: 22 * sk }}>?</span></div>} jawabanBenar={`${slot} koin`} />
      <Lapak>
        {/* mesin tukar: badan logam terang + bingkai warna aksen dunia */}
        <div className="flex flex-1 flex-col justify-center rounded-[18px]" style={{ padding: 12 * sk, background: "linear-gradient(180deg,#f4f7fb,#dfe6ef)", boxShadow: `inset 0 3px 0 rgba(0,0,0,.08), 0 0 0 4px ${tema.aksen}` }}>
          <div className="mb-2 flex items-center justify-center gap-2" style={{ ...Tebal, fontSize: 18 * sk }}><Icon name="currency_exchange" size={Math.round(22 * sk)} /> Mesin tukar</div>
          <div className="mx-auto mb-3 flex w-fit flex-wrap items-center justify-center gap-2" aria-label={`Uang yang ditukar: ${lembar.map(rupiah).join(" + ")}`}>
            {lembar.map((v, i) => (
              <div key={i} className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-2" style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}><Benda v={visualUang(v)} size={Math.round(44 * sk)} /><span style={{ ...Tebal, fontSize: 18 * sk }}>{formatRibuan(v)}</span></div>
            ))}
          </div>
        </div>
      </Lapak>
    </>} kanan={<>
      {/* baki cetakan koin: slot berbingkai tegas di atas alas terang */}
      <div className="flex flex-1 flex-col rounded-[26px]" style={{ background: `linear-gradient(180deg,${tema.wadahWarna},${tema.wadahGelap})`, boxShadow: `0 6px 0 ${tema.wadahGelap}`, padding: 10 * sk, gap: 8 * sk }}>
        <div className="flex flex-1 flex-wrap content-center items-center justify-center rounded-[20px]" style={{ gap: 6 * sk, padding: 10 * sk, background: tema.panel, boxShadow: "inset 0 4px 10px rgba(0,0,0,.16)" }} aria-label="Cetakan koin">
          {Array.from({ length: Math.max(slot, uang.length) }, (_, k) => (
            <button key={k} type="button" onClick={() => { if (k < uang.length) kembalikan(k); }} disabled={k >= uang.length} aria-label={k < uang.length ? `Koin ke-${k + 1}, ketuk untuk ambil` : "Cetakan kosong"} className="flex size-14 items-center justify-center rounded-full active:scale-90" style={{ width: slotPx, height: slotPx, border: k < uang.length ? "none" : "3px dashed rgba(11,37,69,.55)", background: k < uang.length ? "#fff" : k >= slot ? "#ffe9ec" : "#fff", boxShadow: k < uang.length ? "0 3px 0 rgba(11,37,69,.18), inset 0 0 0 2px #e0b400" : "none", fontSize: 30 * sk, lineHeight: 1 }}>
              {k < uang.length ? <span className="akademi-pop">🪙</span> : hint && k === uang.length ? <span className="akademi-bounce opacity-60">🪙</span> : null}
            </button>
          ))}
        </div>
        <div className="self-center rounded-full bg-white px-3 py-0.5 text-center" style={{ ...Tebal, fontSize: 15 * sk }}>{uang.length} koin = {rupiah(total)}</div>
      </div>
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={ambil} sorot={hint && total < ronde.dibayar ? KOIN : null} disabled={terkunci} />
      <div className="flex shrink-0 gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang }); }} disabled={terkunci || uang.length === 0}><Icon name="swap_horiz" size={26} /> Tukar</TombolBesar>
      </div>
    </>} />
  );
}

function ModeLengkapi(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, wajah } = c;
  const totalKoin = Math.max(1, Math.round(ronde.harga / KOIN));
  const ditunjukkan = Math.max(0, Math.round(ronde.dibayar / KOIN));
  const { uang, ambil, kembalikan } = useNampan(Math.max(0, totalKoin - ditunjukkan) + 3);
  const [tampil, setTampil] = useState(true);
  const [hint, setHint] = useState(false);
  const jam = useJam();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback(() => {
    setTampil(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setTampil(false); jam.mulai(); }, Math.max(300, ronde.flashMs || 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ronde.flashMs]);
  useEffect(() => { flash(); return () => { if (timer.current) clearTimeout(timer.current); }; }, [flash]);

  const bantu = () => { c.onHint?.(); setHint(true); flash(); };
  const teks = `Harganya ${totalKoin} koin. Aku punya segini. Berapa koin lagi supaya cukup?`;
  const kurang = Math.max(0, totalKoin - ditunjukkan);
  const { tema, skala: sk } = usePanggung();
  const slotPx = Math.round(56 * sk);

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={
          <div className="flex flex-wrap items-center gap-2">
            {tampil ? (
              <span className="akademi-pop flex flex-wrap gap-0.5" aria-label={`${ditunjukkan} koin`}>{Array.from({ length: ditunjukkan }, (_, k) => <span key={k} style={{ fontSize: 26 * sk, lineHeight: 1 }}>🪙</span>)}</span>
            ) : (
              <span className="flex items-center gap-1"><span style={{ fontSize: 40 * sk, lineHeight: 1 }}>✊</span><span style={{ ...Tebal, fontSize: 24 * sk, color: "#6b7a8a" }}>…</span></span>
            )}
            <span className="font-bold" style={{ fontSize: 14 * sk, color: "#4a5a6e" }}>Harga {totalKoin} koin</span>
          </div>
        }
        jawabanBenar={`Kurang ${ronde.target} koin`}
      />
      <Lapak>
        <div className="flex flex-1 flex-col rounded-[18px]" style={{ padding: 12 * sk, background: tema.panel, boxShadow: `inset 0 0 0 3px ${tema.aksen}55` }}>
          <div className="mb-2 flex items-center justify-between" style={{ ...Tebal, fontSize: 17 * sk }}><span>Harga: {totalKoin} koin</span><span className="rounded-full px-3" style={{ background: "#fff1c2", fontSize: 15 * sk }}>{uang.length} ditambah</span></div>
          <div className="flex flex-1 flex-wrap content-center justify-center" style={{ gap: 6 * sk }} aria-label="Deretan koin harga">
            {Array.from({ length: totalKoin }, (_, k) => {
              const milikPembeli = k < ditunjukkan;
              const idx = k - ditunjukkan;
              const terisi = !milikPembeli && idx < uang.length;
              return (
                <button key={k} type="button" disabled={!terisi} onClick={() => { if (terisi) kembalikan(idx); }} aria-label={milikPembeli ? (tampil ? "Koin pembeli" : "Koin pembeli (tersembunyi)") : terisi ? "Koin kamu, ketuk untuk ambil" : "Belum terisi"} className="flex size-14 items-center justify-center rounded-full active:scale-90" style={{ width: slotPx, height: slotPx, border: terisi || (milikPembeli && tampil) ? "none" : milikPembeli ? "3px solid rgba(91,75,255,.55)" : "3px dashed rgba(11,37,69,.55)", background: terisi ? "#fff" : milikPembeli ? "#ece9ff" : "#fff", boxShadow: terisi ? "0 3px 0 rgba(11,37,69,.18), inset 0 0 0 2px #e0b400" : "none", fontSize: 30 * sk, lineHeight: 1 }}>
                  {milikPembeli ? (tampil ? "🪙" : <span style={{ ...Tebal, fontSize: 18 * sk, color: "#5b4bff" }}>?</span>) : terisi ? <span className="akademi-pop">🪙</span> : hint && idx === uang.length ? <span className="akademi-bounce opacity-60">🪙</span> : null}
                </button>
              );
            })}
            {uang.length > kurang && Array.from({ length: uang.length - kurang }, (_, k) => (
              <button key={`lebih-${k}`} type="button" onClick={() => kembalikan(kurang + k)} aria-label="Koin berlebih, ketuk untuk ambil" className="flex size-14 items-center justify-center rounded-full bg-[#ffe9ec] active:scale-90" style={{ width: slotPx, height: slotPx, boxShadow: "inset 0 0 0 3px #ff5a6e", fontSize: 30 * sk, lineHeight: 1 }}>🪙</button>
            ))}
          </div>
        </div>
      </Lapak>
    </>} kanan={<>
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={(n) => { if (!tampil) ambil(n); }} sorot={hint && uang.length < kurang ? KOIN : null} disabled={terkunci || tampil} penuh />
      <div className="flex shrink-0 gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci || tampil} label="Lihat lagi" />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang, latencyMs: jam.latency() }); }} disabled={terkunci || tampil || uang.length === 0}><Icon name="check" size={26} /> Cukup!</TombolBesar>
      </div>
    </>} />
  );
}

/* ---------------- gabung ---------------- */

function ModeGabung(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual } = c;
  const id = Object.keys(ronde.tersedia)[0] ?? "";
  const [a, b] = ronde.kelompok;
  const [fase, setFase] = useState<"pisah" | "gabung">("pisah");
  const [dipilih, setDipilih] = useState<number | null>(null);
  const { hint, bantu } = useBantu(c.onHint);
  useEffect(() => {
    const t1 = setTimeout(() => { setFase("gabung"); sfx.plop(); }, 1100);
    return () => clearTimeout(t1);
  }, []);
  const teks = `${a} ${nama(id)} dan ${b} ${nama(id)} digabung. Jadi berapa semuanya?`;
  const min = Math.max(1, ronde.strip[0]);
  const { tema, skala: sk } = usePanggung();
  const meja = useSkMeja();
  const bs = Math.round(36 * meja);
  const wadahB = { borderRadius: 24, background: `linear-gradient(180deg,${tema.wadahWarna},${tema.wadahGelap})`, boxShadow: `0 6px 0 ${tema.wadahGelap}` };

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <div className="grid shrink-0 grid-cols-2 gap-2">
        <Pembeli wajah={PEMBELI[0]} teksUcap={teks} hasil={hasil} kecil balon={<BarisPesanan v={visual(id)} qty={a} label={nama(id)} />} />
        <Pembeli wajah={PEMBELI[1]} teksUcap={teks} hasil={hasil} kecil kanan balon={<BarisPesanan v={visual(id)} qty={b} label={nama(id)} />} jawabanBenar={`${a} + ${b} = ${ronde.target}`} />
      </div>
      <Lapak>
        <div className="relative flex flex-1 flex-col justify-end" style={{ minHeight: 160 * sk }}>
          {/* dua tumpukan (di panel terang supaya jelas di dunia gelap) → satu wadah bertema dunia */}
          {[a, b].map((n, sisi) => (
            <div key={sisi} className="absolute flex max-w-[42%] flex-wrap justify-center gap-0.5 rounded-[16px] bg-white/90 p-1.5 transition-all duration-700 ease-in-out" style={{ top: "8%", left: sisi === 0 ? "6%" : undefined, right: sisi === 1 ? "6%" : undefined, transform: fase === "gabung" ? `translate(${sisi === 0 ? "60%" : "-60%"}, ${60 * sk}px) scale(.6)` : "none", opacity: fase === "gabung" ? 0 : 1, boxShadow: "0 4px 0 rgba(11,37,69,.12)" }} aria-hidden>
              {Array.from({ length: n }, (_, k) => <Benda key={k} v={visual(id)} size={bs} />)}
            </div>
          ))}
          <div className="relative mx-auto flex w-full flex-col items-center transition-transform duration-500" style={{ ...wadahB, maxWidth: 420 * sk, padding: 10 * sk, gap: 8 * sk, transform: fase === "gabung" ? "scale(1.02)" : "none" }}>
            <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 shadow-[0_3px_0_rgba(0,0,0,.12)]" style={{ ...Tebal, fontSize: 16 * sk }}><span style={{ fontSize: 26 * sk, lineHeight: 1 }}>🧺</span>{fase === "gabung" ? "Semua jadi satu" : "Keranjang bersama"}</div>
            <div className="flex w-full flex-wrap content-center justify-center gap-1 rounded-[16px]" style={{ minHeight: 56 * sk, padding: 6 * sk, background: tema.panel, boxShadow: "inset 0 4px 10px rgba(0,0,0,.16)" }} aria-label={fase === "gabung" ? `${a + b} ${nama(id)}` : undefined}>
              {fase === "gabung" && Array.from({ length: a + b }, (_, k) => (
                <span key={k} className="akademi-pop" style={{ animationDelay: `${k * 60}ms`, borderRadius: 999, padding: 2, background: hint ? (k < a ? "rgba(91,75,255,.22)" : "rgba(34,181,115,.25)") : "transparent" }}><Benda v={visual(id)} size={bs} /></span>
              ))}
            </div>
          </div>
        </div>
      </Lapak>
    </>} kanan={<>
      <div className="flex shrink-0 items-center gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <Keterangan>{hint ? `Hitung semuanya: ${a} lalu lanjut ${ulang("•", b)}` : "Berapa semuanya?"}</Keterangan>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <StripAngka min={min} max={ronde.strip[1]} dipilih={hasil ? ronde.target : dipilih} disabled={terkunci || fase !== "gabung"} onPilih={(n) => { setDipilih(n); sfx.tap(); onJawab({ angka: n }); }} />
      </div>
    </>} />
  );
}

/* ---------------- sisa ---------------- */

/** Tema adegan sisa per dunia paket. `kolam` = adegan ikan asli (kolam biru, 🎣 ditangkap, kabut, ember pelet). */
interface TemaSisa {
  latar: string; ditangkap: string; tutupIkon: string; tutup: string; wadah: string; wadahIkon: string; tombol: string; ikonTombol: string;
  /** kata kerja pengambilan (ditangkap/dibeli/dipetik/diambil) */
  kerja: string;
}
const TEMA_SISA: Record<string, TemaSisa> = {
  kolam: { latar: "radial-gradient(ellipse at 50% 40%,#9fdcff,#3fa9e8)", ditangkap: "🎣", tutupIkon: "🌫️", tutup: "Kolam tertutup kabut", wadah: "Piring", wadahIkon: "🍽️", tombol: "Beri makan", ikonTombol: "set_meal", kerja: "ditangkap" },
  "toko-kue": { latar: "radial-gradient(ellipse at 50% 40%,#fff7ec,#f6d7b0)", ditangkap: "🛍️", tutupIkon: "🧺", tutup: "Piring ditutup", wadah: "Taruh di sini", wadahIkon: "🍽️", tombol: "Selesai", ikonTombol: "check", kerja: "dibeli" },
  kebun: { latar: "radial-gradient(ellipse at 50% 40%,#d9f2c4,#9ccc65)", ditangkap: "🧺", tutupIkon: "🍃", tutup: "Bedeng ditutup daun", wadah: "Taruh di sini", wadahIkon: "🧺", tombol: "Selesai", ikonTombol: "check", kerja: "dipetik" },
};
const TEMA_SISA_UMUM: TemaSisa = { latar: "radial-gradient(ellipse at 50% 40%,#fffaf0,#f1dcb4)", ditangkap: "✋", tutupIkon: "📦", tutup: "Kotak ditutup", wadah: "Taruh di sini", wadahIkon: "🧺", tombol: "Selesai", ikonTombol: "check", kerja: "diambil" };

function ModeSisa(c: Ctx) {
  const { paket, ronde, onJawab, hasil, terkunci, wajah, nama, visual } = c;
  const [awal, diambil] = ronde.kelompok;
  // benda utama dari mesin (tersedia), penanda = yang ditaruh anak (pesanan); paket lama tanpa pesanan → penanda = benda
  const benda = Object.keys(ronde.tersedia)[0] ?? "";
  const penanda = ronde.pesanan[0]?.goodId ?? benda;
  const kolam = paket.world === "kolam";
  const tema = TEMA_SISA[paket.world ?? ""] ?? TEMA_SISA_UMUM;
  const [fase, setFase] = useState<"kolam" | "tangkap" | "kabut">("kolam");
  const [taruh, setTaruh] = useState(0);
  const { hint, bantu } = useBantu(c.onHint);
  useEffect(() => {
    const t1 = setTimeout(() => { setFase("tangkap"); sfx.plop(); }, 1300);
    const t2 = setTimeout(() => setFase("kabut"), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const pos = useMemo(() => posisiBenda(awal), [awal]);
  const nb = nama(benda), np = nama(penanda);
  const vBenda = visual(benda), vPenanda = visual(penanda);
  const teks = kolam
    ? `Ada ${awal} ${nb} di kolam. ${diambil} ${nb} ditangkap. Beri makan ${nb} yang tersisa, satu ${np} untuk satu ${nb}.`
    : penanda === benda
      ? `Ada ${awal} ${nb}. ${diambil} ${nb} ${tema.kerja}. Taruh ${np} sebanyak yang tersisa.`
      : `Ada ${awal} ${nb}. ${diambil} ${nb} ${tema.kerja}. Taruh ${np} sebanyak ${nb} yang tersisa, satu ${np} untuk satu ${nb}.`;
  const { tema: dunia, skala: sk } = usePanggung();

  return (
    <Kunci terkunci={terkunci} kiri={<>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={<div className="flex flex-wrap items-center gap-1"><BarisPesanan v={vBenda} qty={awal} label={nb} /><span style={{ ...Tebal, fontSize: 20 * sk }}>−</span><BarisPesanan v={{ emoji: tema.ditangkap }} qty={diambil} label={tema.kerja} /><span style={{ ...Tebal, fontSize: 20 * sk }}>= ?</span></div>}
        jawabanBenar={`${awal} − ${diambil} = ${ronde.target} ${nb}`}
      />
      <Lapak>
        <div className="relative flex-1 overflow-hidden rounded-[18px]" style={{ minHeight: (awal <= 5 ? 150 : awal <= 10 ? 200 : 250) * sk, background: tema.latar, boxShadow: "inset 0 4px 0 rgba(0,0,0,.08)" }} aria-label={fase === "kabut" ? tema.tutup : `${fase === "kolam" ? awal : awal - diambil} ${nb}`}>
          {Array.from({ length: awal }, (_, i) => {
            const pergi = i >= awal - diambil;
            return (
              <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700" style={{ ...pos[i], lineHeight: 1, opacity: pergi && fase !== "kolam" ? 0 : 1, transform: pergi && fase !== "kolam" ? "translate(-50%,-150%) scale(.4)" : undefined }} aria-hidden><Benda v={vBenda} size={Math.round((awal > 10 ? 32 : 40) * sk)} /></span>
            );
          })}
          {fase === "tangkap" && <span className="akademi-pop absolute top-2 right-3" style={{ fontSize: 40 * sk }} aria-hidden>{tema.ditangkap}</span>}
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700" style={{ background: "repeating-radial-gradient(circle at 30% 50%, rgba(255,255,255,.95) 0 18px, rgba(240,246,255,.92) 18px 36px)", opacity: fase === "kabut" && !(hint || hasil) ? 1 : 0, pointerEvents: "none" }} aria-hidden>
            <span className="rounded-full bg-white px-4 py-1.5" style={{ ...Tebal, fontSize: 20 * sk, boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}>{tema.tutupIkon} Berapa {nb} tersisa?</span>
          </div>
        </div>
      </Lapak>
    </>} kanan={<>
      <div className="grid flex-1 grid-cols-[auto_1fr] gap-2" style={{ gap: 8 * sk }}>
        <button
          type="button"
          onClick={() => { if (fase === "kabut" && taruh < awal) { sfx.pick(); setTaruh((n) => n + 1); } }}
          disabled={terkunci || fase !== "kabut"}
          aria-label={`Ambil satu ${np}`}
          className={`flex min-h-24 min-w-24 flex-col items-center justify-center self-center rounded-[22px] active:scale-95 disabled:opacity-75 ${hint && taruh < ronde.target ? "akademi-bounce" : ""}`}
          style={{ minHeight: 96 * sk, minWidth: 96 * sk, gap: 4 * sk, padding: 8 * sk, background: `linear-gradient(180deg,${dunia.wadahWarna},${dunia.wadahGelap})`, boxShadow: `0 5px 0 ${dunia.wadahGelap}`, fontFamily: BALOO, fontWeight: 800, fontSize: 14 * sk }}
        >
          <span className="flex items-center justify-center rounded-full bg-white" style={{ width: 60 * sk, height: 60 * sk }}>{kolam ? <span style={{ fontSize: 40 * sk, lineHeight: 1 }}>🪣</span> : <Benda v={vPenanda} size={Math.round(40 * sk)} />}</span>
          <span className="flex items-center gap-1 rounded-full bg-white px-2" style={{ color: INK }}>{kolam && <Benda v={vPenanda} size={Math.round(16 * sk)} />}{np}</span>
        </button>
        <Keranjang
          ikon={tema.wadahIkon} judul={tema.wadah}
          kosong={`Ketuk untuk menaruh ${np}`}
          isi={Array.from({ length: taruh }, (_, k) => ({ key: String(k), v: vPenanda }))}
          onKembali={() => { sfx.plop(); setTaruh((n) => Math.max(0, n - 1)); }}
        />
      </div>
      <div className="flex shrink-0 gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ keranjang: { [penanda]: taruh } }); }} disabled={terkunci || fase !== "kabut" || taruh === 0}><Icon name={tema.ikonTombol} size={26} /> {tema.tombol}</TombolBesar>
      </div>
    </>} />
  );
}
