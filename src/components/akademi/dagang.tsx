"use client";

// Presenter mekanik dagang: lapak pasar dengan pembeli (emoji) + balon pesanan. Sembilan mode lewat switch `ronde.mode`.
// Presenter hanya menampilkan dan mengirim jawaban; kebenaran dinilai runner (nilaiDagang). Setelah `hasil` terisi interaksi dikunci.

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { PaketDagang } from "@akademi/schema";
import type { JawabanDagang, RondeDagang } from "@akademi/mechanics";
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
  const { emoji, color, scale, shape, width } = g;
  return { emoji: emoji ?? (shape ? undefined : EMOJI_BARANG[id] ?? "🛍️"), color, scale, shape, width };
}

function visualUang(nilai: number): VisualSpec & { label: string } {
  const label = formatRibuan(nilai);
  if (nilai <= KOIN) return { emoji: "🪙", color: "#ffd23f", label };
  const warna: Record<number, string> = { 2000: "#cfd4dc", 5000: "#b5835a", 10000: "#9b7bd6", 20000: "#7ec8a0", 50000: "#6ab0e8", 100000: "#e88a8a" };
  return { emoji: "💵", color: warna[nilai] ?? "#cfd4dc", label };
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

/* ---------------- kerangka bersama ---------------- */

const Tebal: CSSProperties = { fontFamily: BALOO, fontWeight: 900, color: INK };

/** Lapak pasar: meja kayu (papan CSS) + tenda. Isi digambar di atas meja. */
function Lapak({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="relative rounded-[24px] p-3" style={{ background: "linear-gradient(180deg,#c98b4a 0,#b9783a 10px,#c98b4a 10px,#c98b4a 26px,#a86a2f 26px,#a86a2f 28px,#c98b4a 28px)", backgroundSize: "100% 56px", boxShadow: "0 6px 0 #7d4a1c, inset 0 2px 0 rgba(255,255,255,.25)", ...style }}>
      {children}
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
  return (
    <div className={`flex items-end gap-2 ${kanan ? "flex-row-reverse" : ""}`}>
      <div className={`shrink-0 ${hasil?.benar ? "akademi-bounce" : ""}`} style={{ fontSize: kecil ? 48 : 64, lineHeight: 1, filter: "drop-shadow(0 4px 0 rgba(11,37,69,.15))" }} aria-hidden>
        {muka}
      </div>
      <button
        type="button"
        onClick={() => { sfx.tap(); ucapPesanan(teksUcap, bahasa); }}
        aria-label={`Dengar pesanan: ${teksUcap}`}
        className="relative min-h-14 flex-1 rounded-[20px] bg-white px-3 py-2 text-left active:scale-[.98]"
        style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)", color: INK }}
      >
        <span aria-hidden className="absolute bottom-4" style={kanan ? { right: -9, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "9px solid #fff" } : { left: -9, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderRight: "9px solid #fff" }} />
        <span className="absolute top-1.5 right-2 text-[#0567c2]"><Icon name="volume_up" size={18} /></span>
        <div className="pr-6">{balon}</div>
        {hasil && jawabanBenar && (
          <div className="akademi-pop mt-1 flex items-center gap-1.5 rounded-[12px] px-2 py-1" style={{ background: hasil.benar ? "#e4f8ee" : "#ffe9ec", fontFamily: BALOO, fontWeight: 800, fontSize: 14, color: hasil.benar ? BENAR : SALAH }}>
            <Icon name={hasil.benar ? "check_circle" : "info"} size={18} />
            <span>{jawabanBenar}</span>
          </div>
        )}
      </button>
    </div>
  );
}

/** Baris pesanan di balon: emoji diulang qty kali + angka kecil. */
function BarisPesanan({ v, qty, label }: { v: VisualSpec; qty: number; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {Array.from({ length: qty }, (_, k) => <Benda key={k} v={v} size={30} />)}
      <span className="ml-1 rounded-full px-2" style={{ ...Tebal, fontSize: 16, background: "#fff1c2" }}>{qty}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function TombolBesar({ children, onClick, disabled, warna = "#22b573", bayang = "#16804f", className = "" }: { children: ReactNode; onClick: () => void; disabled?: boolean; warna?: string; bayang?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-16 flex-1 items-center justify-center gap-2 rounded-[20px] px-4 text-white transition-transform active:translate-y-1 ${className}`}
      style={{ background: disabled ? "#cdd6d2" : warna, boxShadow: `0 5px 0 ${disabled ? "#aab5b0" : bayang}`, fontFamily: BALOO, fontWeight: 900, fontSize: 20 }}
    >
      {children}
    </button>
  );
}

function TombolBantu({ onClick, disabled, label = "Bantu" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex min-h-14 min-w-14 items-center justify-center gap-1 rounded-[20px] bg-white px-3 text-[#b8860b] active:scale-95 disabled:opacity-50"
      style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)", fontFamily: BALOO, fontWeight: 800, fontSize: 15 }}
    >
      <Icon name="lightbulb" size={26} />
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
  return (
    <div
      className="flex select-none flex-wrap items-center justify-center gap-2 rounded-[20px] bg-white/80 p-2 pt-5"
      style={{ touchAction: "none" }}
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
        style={{ background: tampil == null ? "#ffd23f" : "rgba(11,37,69,.08)", boxShadow: tampil == null ? "0 4px 0 #d9a400" : "none", opacity: disabled ? 0.6 : 1 }}
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
            style={{ ...Tebal, fontSize: 28, background: aktif ? "#0786eb" : "#fff", color: aktif ? "#fff" : INK, boxShadow: `0 4px 0 ${aktif ? "#0567c2" : "rgba(11,37,69,.15)"}${sorot === n ? ", 0 0 0 4px #ffd23f" : ""}` }}
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
function Keranjang({ isi, onKembali, judul = "Keranjang", kosong = "Ketuk barang di lapak", ikon = "🧺", sorot }: { isi: { key: string; v: VisualSpec; label?: string }[]; onKembali?: (key: string) => void; judul?: string; kosong?: string; ikon?: string; sorot?: boolean }) {
  return (
    <div className="rounded-[22px] p-3" style={{ background: "linear-gradient(180deg,#f7e2b6,#e9c98a)", boxShadow: `0 5px 0 #b48a4e${sorot ? ", 0 0 0 4px #ffd23f" : ""}` }}>
      <div className="mb-1 flex items-center gap-2" style={{ ...Tebal, fontSize: 16 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{ikon}</span>
        <span>{judul}</span>
        <span className="ml-auto rounded-full bg-white/80 px-3" style={{ fontSize: 18 }}>{isi.length}</span>
      </div>
      <div className="flex min-h-[72px] flex-wrap items-center gap-2">
        {isi.length === 0 && <span className="w-full text-center text-[14px] font-bold opacity-60">{kosong}</span>}
        {isi.map((b) => (
          <KartuBenda key={b.key} v={b.v} size={44} label={b.label} onClick={onKembali ? () => onKembali(b.key) : undefined} className="min-h-14 min-w-14 akademi-pop" />
        ))}
      </div>
    </div>
  );
}

/** Laci uang: tombol per pecahan (dikelompokkan), tampil sisa lembar. */
function Laci({ laci, dipakai, onAmbil, sorot, disabled }: { laci: number[]; dipakai: number[]; onAmbil: (nilai: number) => void; sorot?: number | null; disabled?: boolean }) {
  const kelompok = useMemo(() => {
    const m = new Map<number, number>();
    for (const d of laci) m.set(d, (m.get(d) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [laci]);
  const terpakai = (nilai: number) => dipakai.filter((x) => x === nilai).length;
  return (
    <div className="rounded-[22px] p-3" style={{ background: "linear-gradient(180deg,#6b7f99,#4e6079)", boxShadow: "0 5px 0 #2f3b4c" }}>
      <div className="mb-1 flex items-center gap-2 text-white" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 15 }}>
        <Icon name="point_of_sale" size={20} /> Laci uang
      </div>
      <div className="flex flex-wrap gap-2">
        {kelompok.map(([nilai, jumlah]) => {
          const sisa = jumlah - terpakai(nilai);
          const v = visualUang(nilai);
          return (
            <KartuBenda
              key={nilai}
              v={v}
              size={44}
              label={v.label}
              dim={sisa <= 0}
              selected={sorot === nilai}
              onClick={() => { if (!disabled && sisa > 0) onAmbil(nilai); }}
              className={`relative min-h-16 min-w-[72px] ${sorot === nilai ? "akademi-bounce" : ""}`}
              style={{ background: `linear-gradient(180deg,#fff,${v.color}33)`, ...(disabled || sisa <= 0 ? { pointerEvents: "none" } : {}) }}
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
  return (
    <div className="rounded-[22px] p-3" style={{ background: "linear-gradient(180deg,#fff7e0,#ffe8ad)", boxShadow: `0 5px 0 #d8b55a${sorot ? ", 0 0 0 4px #ffd23f" : ""}` }}>
      <div className="mb-1 flex items-center gap-2" style={{ ...Tebal, fontSize: 16 }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>🍽️</span>
        <span>{judul}</span>
        <span className="ml-auto rounded-full bg-white px-3" style={{ fontSize: 15 }}>{rupiah(total)}</span>
      </div>
      <div className="flex min-h-[64px] flex-wrap items-center gap-2">
        {uang.length === 0 && <span className="w-full text-center text-[14px] font-bold opacity-60">{kosong}</span>}
        {uang.map((nilai, i) => {
          const v = visualUang(nilai);
          return <KartuBenda key={`${i}-${nilai}`} v={v} size={36} label={v.label} onClick={onAmbil ? () => onAmbil(i) : undefined} className="min-h-14 min-w-14 akademi-pop" />;
        })}
      </div>
    </div>
  );
}

/** Harga: "koin" → deretan 🪙 sebanyak harga/1000 ; "rupiah" → Rp besar + emoji barang. */
function Harga({ harga, priceLabel, barang }: { harga: number; priceLabel: RondeDagang["priceLabel"]; barang: VisualSpec[] }) {
  const koin = Math.max(0, Math.round(harga / KOIN));
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[18px] bg-white px-3 py-2" style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}>
      {barang.slice(0, 3).map((v, k) => <Benda key={k} v={v} size={44} />)}
      <span aria-hidden style={{ ...Tebal, fontSize: 22 }}>=</span>
      {priceLabel === "koin" ? (
        <span className="flex flex-wrap items-center gap-0.5" aria-label={`${koin} koin`}>
          {Array.from({ length: koin }, (_, k) => <span key={k} style={{ fontSize: 28, lineHeight: 1 }}>🪙</span>)}
          <span className="ml-1 rounded-full px-2" style={{ ...Tebal, fontSize: 16, background: "#fff1c2" }}>{koin}</span>
        </span>
      ) : (
        <span style={{ ...Tebal, fontSize: 32, color: "#0567c2" }}>{rupiah(harga)}</span>
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

/** Pembungkus tiap mode: mengunci interaksi saat hasil terisi. */
function Kunci({ terkunci, children }: { terkunci: boolean; children: ReactNode }) {
  return <div className="flex flex-col gap-3" style={terkunci ? { pointerEvents: "none" } : undefined} aria-busy={terkunci}>{children}</div>;
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

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil} bahasa={bahasa}
        balon={<div className="flex flex-col gap-1">{ronde.pesanan.map((p) => <BarisPesanan key={p.goodId} v={visual(p.goodId)} qty={p.qty} label={nama(p.goodId)} />)}</div>}
        jawabanBenar={ronde.pesanan.map((p) => `${p.qty} ${nama(p.goodId)}`).join(" + ")}
      />
      <Lapak>
        <div className="flex flex-col gap-2">
          {goods.map((id) => {
            const sisa = (ronde.tersedia[id] ?? 0) - (keranjang[id] ?? 0);
            const sorot = hint && kurang(id) > 0;
            return (
              <div key={id} className="flex items-center gap-2 overflow-x-auto rounded-[16px] px-2 py-1" style={{ background: sorot ? "rgba(255,210,63,.55)" : "rgba(255,255,255,.22)" }}>
                <span className="w-16 shrink-0 text-white" style={{ fontFamily: BALOO, fontWeight: 800, fontSize: 14, textShadow: "0 1px 0 rgba(0,0,0,.3)" }}>{nama(id)}</span>
                {Array.from({ length: sisa }, (_, k) => (
                  <KartuBenda key={k} v={visual(id)} size={44} onClick={() => ambil(id)} className={`min-h-14 min-w-14 shrink-0 ${sorot && k < kurang(id) ? "akademi-bounce" : ""}`} />
                ))}
                {sisa === 0 && <span className="text-white/80 text-[13px] font-bold">habis</span>}
              </div>
            );
          })}
        </div>
      </Lapak>
      <Keranjang isi={isi} onKembali={(key) => kembali(key.replace(/-\d+$/, ""))} />
      <div className="flex gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ keranjang }); }} disabled={terkunci || isi.length === 0}>
          <Icon name="volunteer_activism" size={26} /> Beri ke pembeli
        </TombolBesar>
      </div>
    </Kunci>
  );
}

/* ---------------- subitasi ---------------- */

function ModeSubitasi(c: Ctx) {
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

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={
          !sudahLihat ? (
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 48, lineHeight: 1 }}>🖐️</span>
              <span style={{ ...Tebal, fontSize: 18 }}>Siap? Lihat jariku!</span>
            </div>
          ) : tampil ? (
            <div className="flex items-center gap-3">
              <span className="akademi-pop" style={{ fontSize: 56, lineHeight: 1 }} aria-label={`${target} jari`}>{tangan(target)}</span>
              <span style={{ ...Tebal, fontSize: 18 }}>Lihat jarinya!</span>
            </div>
          ) : (
            // tangan sudah turun: satu pertanyaan jelas, bukan kepalan tangan yang bisa dikira "nol"
            <div className="flex items-center gap-3" aria-label="Tangan sudah turun. Berapa jari tadi?">
              <span style={{ fontSize: 48, lineHeight: 1 }}>🙈</span>
              <span style={{ ...Tebal, fontSize: 18 }}>Berapa jari tadi?</span>
            </div>
          )
        }
        jawabanBenar={`${target} ${nama(id)}`}
      />
      <Lapak>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: tersedia - jumlah }, (_, k) => (
            <KartuBenda key={k} v={visual(id)} size={48} onClick={() => { if (sudahLihat && !tampil) { sfx.pick(); setJumlah((n) => n + 1); } }} dim={!sudahLihat || tampil} className="min-h-14 min-w-14" />
          ))}
        </div>
      </Lapak>
      <Keranjang isi={Array.from({ length: jumlah }, (_, k) => ({ key: String(k), v: visual(id) }))} onKembali={() => { sfx.plop(); setJumlah((n) => Math.max(0, n - 1)); }} />
      {!sudahLihat ? (
        <TombolBesar onClick={lihatPertama} warna="#0786eb" bayang="#0567c2">
          <Icon name="visibility" size={26} /> Lihat jari
        </TombolBesar>
      ) : (
      <div className="flex gap-2">
        <button type="button" onClick={lihatLagi} disabled={terkunci || tampil} className="flex min-h-14 items-center gap-1 rounded-[20px] bg-white px-3 text-[#0567c2] active:scale-95 disabled:bg-[#eef1f0] disabled:text-[#9aa7b4]" style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)", fontFamily: BALOO, fontWeight: 800, fontSize: 15 }}>
          <Icon name="visibility" size={24} /> Lihat lagi
        </button>
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ keranjang: { [id]: jumlah }, latencyMs: jam.latency() }); }} disabled={terkunci || tampil || jumlah === 0}>
          <Icon name="volunteer_activism" size={26} /> Beri
        </TombolBesar>
      </div>
      )}
    </Kunci>
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
  const tinggi = n <= 5 ? 180 : n <= 10 ? 240 : 300;

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli wajah={wajah} teksUcap={teks} hasil={hasil} balon={<div className="flex items-center gap-2"><Benda v={visual(id0)} size={34} /><span style={{ ...Tebal, fontSize: 24 }}>?</span><span className="text-[14px] font-bold opacity-70">Ada berapa?</span></div>} jawabanBenar={`${ronde.target} ${nama(id0)}`} />
      <Lapak>
        <div className="relative w-full" style={{ height: tinggi }} role="group" aria-label="Benda untuk dihitung">
          {ronde.benda.map((gid, i) => {
            const no = urutan[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => sentuh(i)}
                aria-label={no ? `${nama(gid)} ke-${no}` : nama(gid)}
                className={`absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-90 ${hint && !no ? "akademi-bounce" : ""}`}
                style={{ ...pos[i], background: no ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.85)", boxShadow: no ? "none" : "0 4px 0 rgba(11,37,69,.15)", opacity: no ? 0.55 : 1 }}
              >
                <Benda v={visual(gid)} size={44} />
                {no && <span className="akademi-pop absolute -top-2 -right-1 flex size-8 items-center justify-center rounded-full bg-[#0786eb] text-white" style={{ fontFamily: BALOO, fontWeight: 900, fontSize: 18 }}>{no}</span>}
              </button>
            );
          })}
        </div>
      </Lapak>
      <div className="flex items-center gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <span className="flex-1 text-center text-[14px] font-bold opacity-70">{terhitung > 0 ? `Sudah dihitung: ${terhitung}` : "Sentuh satu per satu"}</span>
      </div>
      <StripAngka min={ronde.strip[0]} max={ronde.strip[1]} dipilih={hasil ? ronde.target : dipilih} sorot={hint && terhitung === n ? terhitung : null} disabled={terkunci} onPilih={(a) => { setDipilih(a); sfx.tap(); onJawab({ angka: a, disentuh: [...sentuhan.current] }); }} />
    </Kunci>
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
  const teks = ronde.priceLabel === "koin" ? `Harganya ${Math.round(ronde.harga / KOIN)} koin.` : `Harganya ${formatRibuan(ronde.harga)} rupiah.`;
  const sorot = hint ? pecahanBerikut(ronde.laci, uang, ronde.harga - total) : null;

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli wajah={wajah} teksUcap={teks} hasil={hasil} balon={<Harga harga={ronde.harga} priceLabel={ronde.priceLabel} barang={barang.map((p) => ({ ...visual(p.goodId), count: p.qty }))} />} jawabanBenar={ronde.priceLabel === "koin" ? `${Math.round(ronde.harga / KOIN)} koin` : rupiah(ronde.harga)} />
      <Lapak><div className="flex flex-wrap justify-center gap-2">{barang.map((p) => <KartuBenda key={p.goodId} v={{ ...visual(p.goodId), count: p.qty }} size={52} label={nama(p.goodId)} className="min-h-14 min-w-14" />)}</div></Lapak>
      <Nampan uang={uang} onAmbil={kembalikan} judul="Nampan bayar" sorot={hint && total === ronde.harga} />
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={ambil} sorot={sorot} disabled={terkunci} />
      <div className="flex gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang }); }} disabled={terkunci || uang.length === 0}><Icon name="payments" size={26} /> Bayar</TombolBesar>
      </div>
    </Kunci>
  );
}

function ModeKembalian(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, nama, visual, wajah } = c;
  const { uang, ambil, kembalikan, total } = useNampan();
  const { hint, bantu } = useBantu(c.onHint);
  const kembalian = ronde.dibayar - ronde.harga;
  const vBayar = visualUang(ronde.dibayar);
  const teks = `Ini uang ${formatRibuan(ronde.dibayar)}. Harganya ${formatRibuan(ronde.harga)}. Berapa kembaliannya?`;
  const sorot = hint ? pecahanBerikut(ronde.laci, uang, kembalian - total) : null;
  const langkah = useMemo(() => { const out: number[] = []; for (let v = ronde.harga; v <= ronde.dibayar; v += KOIN) out.push(v); return out.length <= 12 ? out : []; }, [ronde.harga, ronde.dibayar]);

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={
          <div className="flex flex-wrap items-center gap-2">
            <Benda v={vBayar} size={40} /><span style={{ ...Tebal, fontSize: 20 }}>{rupiah(ronde.dibayar)}</span>
            <span className="opacity-50" style={{ ...Tebal, fontSize: 20 }}>→</span>
            {ronde.pesanan.map((p) => <Benda key={p.goodId} v={{ ...visual(p.goodId), count: p.qty }} size={36} />)}
            <span style={{ ...Tebal, fontSize: 18, color: "#0567c2" }}>{rupiah(ronde.harga)}</span>
          </div>
        }
        jawabanBenar={`Kembalian ${rupiah(kembalian)}`}
      />
      <Lapak>
        <div className="flex flex-wrap items-center justify-center gap-3 text-white">
          <div className="flex items-center gap-2 rounded-[16px] bg-white/90 px-3 py-2" style={{ color: INK }}><Benda v={vBayar} size={48} /><span style={{ ...Tebal, fontSize: 18 }}>{vBayar.label}</span></div>
          {ronde.pesanan.map((p) => <KartuBenda key={p.goodId} v={{ ...visual(p.goodId), count: p.qty }} size={48} label={nama(p.goodId)} className="min-h-14 min-w-14" />)}
        </div>
        {hint && langkah.length > 0 && (
          <div className="akademi-pop mt-2 flex flex-wrap items-center justify-center gap-1 rounded-[16px] bg-white/90 p-2" aria-label="Hitung maju dari harga ke uang pembeli">
            {langkah.map((v, k) => (
              <span key={v} className="flex items-center gap-1">
                <span className="rounded-full px-2 py-0.5" style={{ ...Tebal, fontSize: 14, background: k === 0 ? "#0786eb" : k === langkah.length - 1 ? "#22b573" : "#fff1c2", color: k === 0 || k === langkah.length - 1 ? "#fff" : INK }}>{formatRibuan(v)}</span>
                {k < langkah.length - 1 && <span style={{ fontSize: 16 }}>🪙</span>}
              </span>
            ))}
          </div>
        )}
      </Lapak>
      <Nampan uang={uang} onAmbil={kembalikan} judul="Kembalian" sorot={hint && total === kembalian} />
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={ambil} sorot={sorot} disabled={terkunci} />
      <div className="flex gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang }); }} disabled={terkunci || uang.length === 0}><Icon name="currency_exchange" size={26} /> Beri kembalian</TombolBesar>
      </div>
    </Kunci>
  );
}

function ModeTukar(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, wajah } = c;
  const slot = Math.max(1, Math.round(ronde.dibayar / KOIN));
  const { uang, ambil, kembalikan, total } = useNampan(ronde.laci.length);
  const { hint, bantu } = useBantu(c.onHint);
  const lembar = ronde.lembar.length ? ronde.lembar : [ronde.dibayar];
  const teks = `Tolong tukar uang ${lembar.map(formatRibuan).join(" dan ")}${lembar.length > 1 ? `, semuanya ${formatRibuan(ronde.dibayar)},` : ""} jadi koin seribuan.`;

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli wajah={wajah} teksUcap={teks} hasil={hasil} balon={<div className="flex flex-wrap items-center gap-2">{lembar.map((v, i) => <Benda key={i} v={visualUang(v)} size={36} />)}<span style={{ ...Tebal, fontSize: 20 }}>{rupiah(ronde.dibayar)}</span><span style={{ ...Tebal, fontSize: 20, opacity: 0.5 }}>→</span><span style={{ fontSize: 28 }}>🪙</span><span style={{ ...Tebal, fontSize: 22 }}>?</span></div>} jawabanBenar={`${slot} koin`} />
      <Lapak>
        <div className="rounded-[18px] p-3" style={{ background: "linear-gradient(180deg,#eef2f7,#d7dee8)", boxShadow: "inset 0 3px 0 rgba(0,0,0,.08)" }}>
          <div className="mb-2 flex items-center justify-center gap-2" style={Tebal}><Icon name="currency_exchange" size={22} /> Mesin tukar</div>
          <div className="mx-auto mb-3 flex w-fit flex-wrap items-center justify-center gap-2" aria-label={`Uang yang ditukar: ${lembar.map(rupiah).join(" + ")}`}>
            {lembar.map((v, i) => (
              <div key={i} className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-2" style={{ boxShadow: "0 4px 0 rgba(11,37,69,.12)" }}><Benda v={visualUang(v)} size={44} /><span style={{ ...Tebal, fontSize: 18 }}>{formatRibuan(v)}</span></div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5" aria-label="Cetakan koin">
            {Array.from({ length: Math.max(slot, uang.length) }, (_, k) => (
              <button key={k} type="button" onClick={() => { if (k < uang.length) kembalikan(k); }} disabled={k >= uang.length} aria-label={k < uang.length ? `Koin ke-${k + 1}, ketuk untuk ambil` : "Cetakan kosong"} className="flex size-14 items-center justify-center rounded-full active:scale-90" style={{ border: k < uang.length ? "none" : "3px dashed rgba(11,37,69,.3)", background: k < uang.length ? "#fff" : k >= slot ? "#ffe9ec" : "transparent", boxShadow: k < uang.length ? "0 3px 0 rgba(11,37,69,.15)" : "none", fontSize: 30, lineHeight: 1 }}>
                {k < uang.length ? <span className="akademi-pop">🪙</span> : hint && k === uang.length ? <span className="akademi-bounce opacity-50">🪙</span> : null}
              </button>
            ))}
          </div>
          <div className="mt-2 text-center" style={{ ...Tebal, fontSize: 15, opacity: 0.7 }}>{uang.length} koin = {rupiah(total)}</div>
        </div>
      </Lapak>
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={ambil} sorot={hint && total < ronde.dibayar ? KOIN : null} disabled={terkunci} />
      <div className="flex gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang }); }} disabled={terkunci || uang.length === 0}><Icon name="swap_horiz" size={26} /> Tukar</TombolBesar>
      </div>
    </Kunci>
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

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={
          <div className="flex flex-wrap items-center gap-2">
            {tampil ? (
              <span className="akademi-pop flex flex-wrap gap-0.5" aria-label={`${ditunjukkan} koin`}>{Array.from({ length: ditunjukkan }, (_, k) => <span key={k} style={{ fontSize: 26, lineHeight: 1 }}>🪙</span>)}</span>
            ) : (
              <span className="flex items-center gap-1"><span style={{ fontSize: 40, lineHeight: 1 }}>✊</span><span style={{ ...Tebal, fontSize: 24, opacity: 0.6 }}>…</span></span>
            )}
            <span className="text-[14px] font-bold opacity-70">Harga {totalKoin} koin</span>
          </div>
        }
        jawabanBenar={`Kurang ${ronde.target} koin`}
      />
      <Lapak>
        <div className="rounded-[18px] bg-white/90 p-3">
          <div className="mb-2 flex items-center justify-between" style={Tebal}><span>Harga: {totalKoin} koin</span><span className="rounded-full px-3" style={{ background: "#fff1c2", fontSize: 15 }}>{uang.length} ditambah</span></div>
          <div className="flex flex-wrap justify-center gap-1.5" aria-label="Deretan koin harga">
            {Array.from({ length: totalKoin }, (_, k) => {
              const milikPembeli = k < ditunjukkan;
              const idx = k - ditunjukkan;
              const terisi = !milikPembeli && idx < uang.length;
              return (
                <button key={k} type="button" disabled={!terisi} onClick={() => { if (terisi) kembalikan(idx); }} aria-label={milikPembeli ? (tampil ? "Koin pembeli" : "Koin pembeli (tersembunyi)") : terisi ? "Koin kamu, ketuk untuk ambil" : "Belum terisi"} className="flex size-14 items-center justify-center rounded-full active:scale-90" style={{ border: terisi || (milikPembeli && tampil) ? "none" : "3px dashed rgba(11,37,69,.3)", background: terisi ? "#fff" : milikPembeli ? "rgba(91,75,255,.08)" : "transparent", boxShadow: terisi ? "0 3px 0 rgba(11,37,69,.15)" : "none", fontSize: 30, lineHeight: 1 }}>
                  {milikPembeli ? (tampil ? "🪙" : <span style={{ ...Tebal, fontSize: 18, opacity: 0.5 }}>?</span>) : terisi ? <span className="akademi-pop">🪙</span> : hint && idx === uang.length ? <span className="akademi-bounce opacity-50">🪙</span> : null}
                </button>
              );
            })}
            {uang.length > kurang && Array.from({ length: uang.length - kurang }, (_, k) => (
              <button key={`lebih-${k}`} type="button" onClick={() => kembalikan(kurang + k)} aria-label="Koin berlebih, ketuk untuk ambil" className="flex size-14 items-center justify-center rounded-full bg-[#ffe9ec] active:scale-90" style={{ fontSize: 30, lineHeight: 1 }}>🪙</button>
            ))}
          </div>
        </div>
      </Lapak>
      <Laci laci={ronde.laci} dipakai={uang} onAmbil={(n) => { if (!tampil) ambil(n); }} sorot={hint && uang.length < kurang ? KOIN : null} disabled={terkunci || tampil} />
      <div className="flex gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci || tampil} label="Lihat lagi" />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ uang, latencyMs: jam.latency() }); }} disabled={terkunci || tampil || uang.length === 0}><Icon name="check" size={26} /> Cukup!</TombolBesar>
      </div>
    </Kunci>
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

  return (
    <Kunci terkunci={terkunci}>
      <div className="grid grid-cols-2 gap-2">
        <Pembeli wajah={PEMBELI[0]} teksUcap={teks} hasil={hasil} kecil balon={<BarisPesanan v={visual(id)} qty={a} label={nama(id)} />} />
        <Pembeli wajah={PEMBELI[1]} teksUcap={teks} hasil={hasil} kecil kanan balon={<BarisPesanan v={visual(id)} qty={b} label={nama(id)} />} jawabanBenar={`${a} + ${b} = ${ronde.target}`} />
      </div>
      <Lapak>
        <div className="relative flex min-h-[160px] items-end justify-center">
          {/* dua tumpukan → satu keranjang */}
          {[a, b].map((n, sisi) => (
            <div key={sisi} className="absolute bottom-[64px] flex max-w-[45%] flex-wrap justify-center gap-0.5 transition-all duration-700 ease-in-out" style={{ left: sisi === 0 ? "12%" : undefined, right: sisi === 1 ? "12%" : undefined, transform: fase === "gabung" ? `translate(${sisi === 0 ? "80%" : "-80%"}, 60px) scale(.6)` : "none", opacity: fase === "gabung" ? 0 : 1 }} aria-hidden>
              {Array.from({ length: n }, (_, k) => <Benda key={k} v={visual(id)} size={36} />)}
            </div>
          ))}
          <div className="relative flex w-full max-w-[420px] flex-col items-center rounded-[22px] p-3 transition-transform duration-500" style={{ background: "linear-gradient(180deg,#f7e2b6,#e9c98a)", boxShadow: "0 5px 0 #b48a4e", transform: fase === "gabung" ? "scale(1.02)" : "none" }}>
            <div className="mb-1 flex items-center gap-2" style={Tebal}><span style={{ fontSize: 28, lineHeight: 1 }}>🧺</span>{fase === "gabung" ? "Semua jadi satu" : "Keranjang bersama"}</div>
            <div className="flex min-h-[48px] flex-wrap justify-center gap-1" aria-label={fase === "gabung" ? `${a + b} ${nama(id)}` : undefined}>
              {fase === "gabung" && Array.from({ length: a + b }, (_, k) => (
                <span key={k} className="akademi-pop" style={{ animationDelay: `${k * 60}ms`, borderRadius: 999, padding: 2, background: hint ? (k < a ? "rgba(91,75,255,.18)" : "rgba(34,181,115,.2)") : "transparent" }}><Benda v={visual(id)} size={36} /></span>
              ))}
            </div>
          </div>
        </div>
      </Lapak>
      <div className="flex items-center gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <span className="flex-1 text-center text-[14px] font-bold opacity-70">{hint ? `Hitung semuanya: ${a} lalu lanjut ${ulang("•", b)}` : "Berapa semuanya?"}</span>
      </div>
      <StripAngka min={min} max={ronde.strip[1]} dipilih={hasil ? ronde.target : dipilih} disabled={terkunci || fase !== "gabung"} onPilih={(n) => { setDipilih(n); sfx.tap(); onJawab({ angka: n }); }} />
    </Kunci>
  );
}

/* ---------------- sisa ---------------- */

function ModeSisa(c: Ctx) {
  const { ronde, onJawab, hasil, terkunci, wajah } = c;
  const [awal, diambil] = ronde.kelompok;
  const [fase, setFase] = useState<"kolam" | "tangkap" | "kabut">("kolam");
  const [pelet, setPelet] = useState(0);
  const { hint, bantu } = useBantu(c.onHint);
  useEffect(() => {
    const t1 = setTimeout(() => { setFase("tangkap"); sfx.plop(); }, 1300);
    const t2 = setTimeout(() => setFase("kabut"), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const pos = useMemo(() => posisiBenda(awal), [awal]);
  const teks = `Ada ${awal} ikan di kolam. ${diambil} ikan ditangkap. Beri makan ikan yang tersisa, satu pelet untuk satu ikan.`;

  return (
    <Kunci terkunci={terkunci}>
      <Pembeli
        wajah={wajah} teksUcap={teks} hasil={hasil}
        balon={<div className="flex flex-wrap items-center gap-1"><BarisPesanan v={{ emoji: "🐟" }} qty={awal} label="ikan" /><span style={{ ...Tebal, fontSize: 20 }}>−</span><BarisPesanan v={{ emoji: "🎣" }} qty={diambil} label="ditangkap" /><span style={{ ...Tebal, fontSize: 20 }}>= ?</span></div>}
        jawabanBenar={`${awal} − ${diambil} = ${ronde.target} ikan`}
      />
      <Lapak>
        <div className="relative overflow-hidden rounded-[18px]" style={{ height: awal <= 5 ? 150 : awal <= 10 ? 200 : 250, background: "radial-gradient(ellipse at 50% 40%,#9fdcff,#3fa9e8)", boxShadow: "inset 0 4px 0 rgba(0,0,0,.08)" }} aria-label={fase === "kabut" ? "Kolam tertutup kabut" : `${fase === "kolam" ? awal : awal - diambil} ikan di kolam`}>
          {Array.from({ length: awal }, (_, i) => {
            const ditangkap = i >= awal - diambil;
            return (
              <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700" style={{ ...pos[i], fontSize: 34, lineHeight: 1, opacity: ditangkap && fase !== "kolam" ? 0 : 1, transform: ditangkap && fase !== "kolam" ? "translate(-50%,-150%) scale(.4)" : undefined }} aria-hidden>🐟</span>
            );
          })}
          {fase === "tangkap" && <span className="akademi-pop absolute top-2 right-3" style={{ fontSize: 40 }} aria-hidden>🎣</span>}
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700" style={{ background: "repeating-radial-gradient(circle at 30% 50%, rgba(255,255,255,.95) 0 18px, rgba(240,246,255,.92) 18px 36px)", opacity: fase === "kabut" && !(hint || hasil) ? 1 : 0, pointerEvents: "none" }} aria-hidden>
            <span style={{ ...Tebal, fontSize: 20, opacity: 0.6 }}>🌫️ Berapa ikan tersisa?</span>
          </div>
        </div>
      </Lapak>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <button
          type="button"
          onClick={() => { if (fase === "kabut" && pelet < awal) { sfx.pick(); setPelet((n) => n + 1); } }}
          disabled={terkunci || fase !== "kabut"}
          aria-label="Ember pelet, ketuk untuk ambil satu"
          className={`flex min-h-24 min-w-24 flex-col items-center justify-center rounded-[22px] active:scale-95 disabled:opacity-60 ${hint && pelet < ronde.target ? "akademi-bounce" : ""}`}
          style={{ background: "linear-gradient(180deg,#9aa5b5,#6d7a8d)", boxShadow: "0 5px 0 #3f4958", color: "#fff", fontFamily: BALOO, fontWeight: 800, fontSize: 14 }}
        >
          <span style={{ fontSize: 40, lineHeight: 1 }}>🪣</span>
          <span>🟤 Pelet</span>
        </button>
        <Keranjang
          ikon="🍽️" judul="Piring"
          kosong="Ketuk ember untuk menaruh pelet"
          isi={Array.from({ length: pelet }, (_, k) => ({ key: String(k), v: { emoji: "🟤" } }))}
          onKembali={() => { sfx.plop(); setPelet((n) => Math.max(0, n - 1)); }}
        />
      </div>
      <div className="flex gap-2">
        <TombolBantu onClick={bantu} disabled={terkunci} />
        <TombolBesar onClick={() => { sfx.tap(); onJawab({ keranjang: { pelet } }); }} disabled={terkunci || fase !== "kabut" || pelet === 0}><Icon name="set_meal" size={26} /> Beri makan</TombolBesar>
      </div>
    </Kunci>
  );
}
