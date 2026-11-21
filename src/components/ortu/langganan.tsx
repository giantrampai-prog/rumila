"use client";

// Ruang Orang Tua → Langganan. Harga per keluarga (rumah), paket & rekening diatur owner di admin Kampus
// (pulaurinoya.com/admin → Kampus Rinoya → Harga & paket): satu paket dasar 1 anak + add-on per anak tambahan,
// periode bulan/3 bulan/6 bulan/tahun, harga coret di semua tier. Pembayaran sementara MANUAL: orang tua memilih paket
// dan periode, mentransfer jumlah persis (harga + kode unik 3 digit agar mudah dicocokkan di mutasi), lalu
// mengirim bukti transfer ke bucket privat `bukti-bayar`. Owner menerima/menolak di menu Pembayaran;
// begitu diterima, `akademi_status_langganan` mengembalikan `aktif_sampai`. Harga dihitung ulang di trigger DB.

import { useCallback, useEffect, useMemo, useState } from "react";
import { BALOO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";
import { useCloud } from "@/lib/supabase/family";
import { useRumila } from "@/lib/store";
import { anakRumah } from "@/lib/akademi/konten";
import { muatLangganan } from "@/lib/akademi/langganan";
import { useModeApp } from "@/lib/mode-app";

const INK = "#0b2545";
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.06)]";
const TOMBOL = "inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-5 text-[14px] font-extrabold transition-transform active:scale-95 disabled:opacity-50";

type Periode = "bulan" | "triwulan" | "semester" | "tahun";
const PERIODE: [Periode, string, string, number][] = [
  ["bulan", "Bulanan", "/bulan", 1],
  ["triwulan", "3 bulan", "/3 bulan", 3],
  ["semester", "6 bulan", "/6 bulan", 6],
  ["tahun", "Tahunan", "/tahun", 12],
];
type Tarif = { harga?: number; coret?: number; tambah?: number; tambah_coret?: number };
type Paket = { id: string; nama: string; deskripsi: string | null; maks_anak: number; tarif: Partial<Record<Periode, Tarif>>; label_promo: string | null; unggulan: boolean };
type Atur = { bank: string; no_rekening: string; atas_nama: string; trial_hari: number; kode_unik: boolean; catatan: string | null };
type Bayar = { id: string; paket_id: string; periode: Periode; anak_tambahan: number; jumlah: number; status: "menunggu" | "diterima" | "ditolak" | "batal"; alasan: string | null; bukti_path: string | null; dibuat_at: string; sampai: string | null };
type Status = { trial_sampai: string; aktif_sampai: string | null; paket_id: string | null; periode: Periode | null; menunggu: number; alumni?: string[] } | null;

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");
const tgl = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const tarifDari = (p: Paket, per: Periode): Tarif => p.tarif?.[per] ?? {};
const hargaDari = (p: Paket, per: Periode) => tarifDari(p, per).harga ?? null;
/** Total satu periode untuk `anak` anak (1 = dasar saja). */
const totalDari = (p: Paket, per: Periode, anak: number) => {
  const t = tarifDari(p, per);
  if (!t.harga) return null;
  const n = Math.max(0, anak - 1);
  return { harga: t.harga + (t.tambah ?? 0) * n, coret: (t.coret ?? t.harga) + (t.tambah_coret ?? t.tambah ?? 0) * n };
};
const namaPeriode = (per: Periode) => PERIODE.find(([id]) => id === per)?.[1] ?? per;
const anakTeks = (n: number) => `${n} anak`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Kecilkan foto bukti (sisi panjang 1400 px, JPEG) supaya hemat kuota HP. */
async function siapkanBukti(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((ok, gagal) => c.toBlob((b) => (b ? ok(b) : gagal(new Error("Foto gagal diproses."))), "image/jpeg", 0.85));
}

function pesanGalat(m: string) {
  if (/paket_tidak_tersedia/.test(m)) return "Paket ini sedang tidak dijual. Muat ulang halaman.";
  if (/periode_tidak_tersedia/.test(m)) return "Periode ini tidak tersedia untuk paket tersebut.";
  if (/anak_terlalu_banyak/.test(m)) return "Jumlah anak melebihi batas paket.";
  if (/addon_tidak_tersedia/.test(m)) return "Tambahan anak belum tersedia untuk periode ini.";
  if (/relation .* does not exist|schema cache/i.test(m)) return "Langganan belum dibuka di server.";
  return m;
}

export function LanggananKeluarga() {
  const familyId = useCloud((s) => s.familyId);
  const [paket, setPaket] = useState<Paket[] | null>(null);
  const [atur, setAtur] = useState<Atur | null>(null);
  const [riwayat, setRiwayat] = useState<Bayar[]>([]);
  const [status, setStatus] = useState<Status>(null);
  const [err, setErr] = useState("");
  const [pilih, setPilih] = useState<{ paket: Paket; periode: Periode; anak: number } | null>(null);
  const members = useRumila((s) => s.members);
  const anakSemua = useMemo(() => anakRumah(members), [members]);
  const alumni = useMemo(() => anakSemua.filter((m) => status?.alumni?.includes(m.id)), [anakSemua, status]);
  // Alumni SD 6 tidak dihitung sebagai anak berbayar (rapor & sertifikatnya tetap gratis).
  const anakDiRumah = Math.max(1, anakSemua.length - alumni.length);
  const [anakPilih, setAnak] = useState<number | null>(null);
  const [periode, setPeriode] = useState<Periode>("bulan");
  const app = useModeApp();

  const muat = useCallback(async () => {
    if (!familyId || !UUID.test(familyId)) return;
    const sb = supabase();
    const [p, a, r, s] = await Promise.all([
      sb.from("akademi_paket").select("id,nama,deskripsi,maks_anak,tarif,label_promo,unggulan").order("urut"),
      sb.from("akademi_bayar_atur").select("bank,no_rekening,atas_nama,trial_hari,kode_unik,catatan").maybeSingle(),
      sb.from("akademi_bayar").select("id,paket_id,periode,anak_tambahan,jumlah,status,alasan,bukti_path,dibuat_at,sampai").eq("family_id", familyId).order("dibuat_at", { ascending: false }).limit(20),
      sb.rpc("akademi_status_langganan", { fid: familyId }),
    ]);
    const g = p.error || a.error || r.error || s.error;
    if (g) return setErr(pesanGalat(g.message));
    const ps = (p.data ?? []) as Paket[];
    setPaket(ps);
    setAtur(a.data as Atur | null);
    setRiwayat((r.data ?? []) as Bayar[]);
    setStatus(s.data as Status);
    void muatLangganan();
    // pilih periode pertama yang dijual
    const ada = PERIODE.find(([id]) => ps.some((x) => hargaDari(x, id)));
    if (ada) setPeriode((cur) => (ps.some((x) => hargaDari(x, cur)) ? cur : ada[0]));
  }, [familyId]);

  useEffect(() => void muat(), [muat]);

  if (!familyId || !UUID.test(familyId)) return <p className={`${KARTU} p-5 text-[14px] font-bold text-ink-3`}>Masuk dengan akun rumah dulu untuk melihat langganan.</p>;
  if (err) return <p className={`${KARTU} p-5 text-[14px] font-bold text-[#c0283a]`}>{err}</p>;
  if (!paket) return <p className={`${KARTU} p-5 text-[14px] font-bold text-ink-3`}>Memuat langganan…</p>;

  // App toko: hanya status akun, tanpa harga/paket/rekening/riwayat bayar dan tanpa ajakan membayar (kebijakan toko).
  if (app)
    return (
      <div className="flex flex-col gap-4">
        <KartuStatus status={status} paket={paket} app />
        <p className={`${KARTU} flex items-start gap-3 p-4 text-[13.5px] font-bold text-ink-3 sm:p-5`}>
          <Icon name="info" size={22} />
          <span>Pengaturan akun rumah dikelola di situs web RINOYA Academy. Semua progres, rapor, dan sertifikat anak tersimpan di akun yang sama.</span>
        </p>
      </div>
    );

  const menunggu = riwayat.find((b) => b.status === "menunggu");
  const dijual = paket.filter((p) => PERIODE.some(([id]) => hargaDari(p, id)));
  const periodeAda = PERIODE.filter(([id]) => dijual.some((p) => hargaDari(p, id)));

  return (
    <div className="flex flex-col gap-4">
      <KartuStatus status={status} paket={paket} />
      {menunggu ? (
        <Tagihan bayar={menunggu} atur={atur} paket={paket} familyId={familyId} onBerubah={muat} />
      ) : pilih ? (
        <Konfirmasi pilihan={pilih} atur={atur} familyId={familyId} onBatal={() => setPilih(null)} onTerkirim={() => (setPilih(null), muat())} />
      ) : dijual.length === 0 ? (
        <p className={`${KARTU} p-5 text-[14px] font-bold text-ink-3`}>Paket langganan sedang disiapkan. Selama itu semua kegiatan tetap bisa dipakai.</p>
      ) : (
        <section className={`${KARTU} flex flex-col gap-4 p-4 sm:p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>Pilih lama langganan</h2>
            {periodeAda.length > 1 && (
              <div className="flex gap-1 rounded-full bg-[#f4f7fb] p-1" role="tablist" aria-label="Periode">
                {periodeAda.map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={periode === id} onClick={() => setPeriode(id)} className="h-9 rounded-full px-3.5 text-[13px] font-extrabold" style={{ background: periode === id ? INK : "transparent", color: periode === id ? "#fff" : INK }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {alumni.length > 0 && (
            <p className="flex items-start gap-2 rounded-[14px] bg-[#e6f7f3] p-3 text-[13px] font-bold text-[#0b5e52]">
              <Icon name="school" size={20} />
              <span>
                {alumni.map((m) => m.name).join(", ")} sudah lulus SD 6. Sebagai alumni, rapor dan sertifikatnya tetap terbuka gratis dan tidak perlu dihitung dalam jumlah anak.
              </span>
            </p>
          )}
          <div className="grid gap-3">
            {dijual.map((p) => {
              const anak = Math.min(p.maks_anak, anakPilih ?? anakDiRumah);
              const t = tarifDari(p, periode);
              const tot = totalDari(p, periode, anak);
              const bln = PERIODE.find(([id]) => id === periode)![3];
              const hemat = tot && tot.coret > tot.harga ? Math.round((1 - tot.harga / tot.coret) * 100) : 0;
              return (
                <div key={p.id} className="flex flex-col gap-3 rounded-[18px] border-2 p-4 sm:p-5" style={{ borderColor: p.unggulan ? "#0786eb" : "#eef2f7" }}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>{p.nama}</h3>
                      {p.deskripsi && <p className="text-[13.5px] font-semibold text-ink-2">{p.deskripsi}</p>}
                    </div>
                    {p.label_promo && <span className="rounded-full bg-[#fdecee] px-2.5 py-0.5 text-[12px] font-extrabold text-[#c0283a]">{p.label_promo}</span>}
                  </div>
                  {p.maks_anak > 1 && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[13.5px] font-extrabold">Jumlah anak</span>
                      <div className="flex items-center gap-1 rounded-full bg-[#f4f7fb] p-1">
                        <button aria-label="Kurangi anak" disabled={anak <= 1} onClick={() => setAnak(anak - 1)} className="flex size-9 items-center justify-center rounded-full bg-white disabled:opacity-40">
                          <Icon name="remove" size={18} />
                        </button>
                        <span className="w-8 text-center text-[16px] font-extrabold tabular-nums">{anak}</span>
                        <button aria-label="Tambah anak" disabled={anak >= p.maks_anak || (anak > 1 && !t.tambah) || (anak === 1 && !t.tambah)} onClick={() => setAnak(anak + 1)} className="flex size-9 items-center justify-center rounded-full bg-white disabled:opacity-40">
                          <Icon name="add" size={18} />
                        </button>
                      </div>
                      {t.tambah ? <span className="text-[12.5px] font-bold text-ink-3">anak ke-2 dst. +{rupiah(t.tambah)}{PERIODE.find(([id]) => id === periode)![2]}</span> : null}
                    </div>
                  )}
                  {tot ? (
                    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                      <div>
                        {tot.coret > tot.harga && <p className="text-[14px] font-bold text-ink-3 line-through tabular-nums">{rupiah(tot.coret)}</p>}
                        <p className="flex items-baseline gap-1">
                          <span className="tabular-nums" style={{ fontFamily: BALOO, fontSize: 30, fontWeight: 800, color: "#c0283a" }}>{rupiah(tot.harga)}</span>
                          <span className="text-[13px] font-bold text-ink-3">{PERIODE.find(([id]) => id === periode)![2]}</span>
                        </p>
                      </div>
                      {hemat > 0 && <span className="mb-2 rounded-full bg-[#e6f7f3] px-2.5 py-0.5 text-[12.5px] font-extrabold text-[#0b7a6b]">Hemat {hemat}%</span>}
                      <p className="w-full text-[12.5px] font-bold text-ink-3">
                        {anakTeks(anak)}
                        {bln > 1 ? ` · setara ${rupiah(Math.round(tot.harga / bln / 100) * 100)}/bulan` : ""}
                        {anak > 1 && t.tambah ? ` · ${rupiah(t.harga!)} + ${anak - 1} × ${rupiah(t.tambah)}` : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[13px] font-bold text-ink-3">Tidak tersedia untuk periode ini.</p>
                  )}
                  <button disabled={!tot} onClick={() => setPilih({ paket: p, periode, anak })} className={`${TOMBOL} mt-auto text-white`} style={{ background: "#0786eb" }}>
                    Langganan {namaPeriode(periode).toLowerCase()}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
      <Riwayat riwayat={riwayat} paket={paket} />
    </div>
  );
}

function KartuStatus({ status, paket, app }: { status: Status; paket: Paket[]; app?: boolean }) {
  if (!status) return null;
  const kini = Date.now();
  const aktif = status.aktif_sampai && Date.parse(status.aktif_sampai) > kini;
  const trial = !aktif && Date.parse(status.trial_sampai) > kini;
  const sisa = (iso: string) => Math.max(0, Math.ceil((Date.parse(iso) - kini) / 864e5));
  const nama = paket.find((p) => p.id === status.paket_id)?.nama ?? status.paket_id;
  const [ikon, warna, judul, sub] = aktif
    ? ["verified", "#12b8a6", `Langganan aktif${nama ? ` · ${nama}` : ""}`, `Berlaku sampai ${tgl(status.aktif_sampai!)} (${sisa(status.aktif_sampai!)} hari lagi).`]
    : trial
      ? ["hourglass_top", "#f29d0b", "Masa coba gratis", app ? `Berakhir ${tgl(status.trial_sampai)} (${sisa(status.trial_sampai)} hari lagi).` : `Berakhir ${tgl(status.trial_sampai)} (${sisa(status.trial_sampai)} hari lagi). Berlangganan kapan saja; masa aktif dihitung sejak pembayaran diterima.`]
      : app
        ? ["info", "#c0283a", "Akun belum aktif", status.aktif_sampai ? `Masa aktif berakhir ${tgl(status.aktif_sampai)}.` : "Masa coba sudah selesai."]
        : ["info", "#c0283a", "Belum berlangganan", status.aktif_sampai ? `Langganan berakhir ${tgl(status.aktif_sampai)}.` : "Masa coba sudah selesai. Pilih paket di bawah untuk melanjutkan."];
  return (
    <section className={`${KARTU} flex items-start gap-3 p-4 sm:p-5`}>
      <Icon name={ikon} size={30} style={{ color: warna }} />
      <div className="min-w-0">
        <h2 style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800 }}>{judul}</h2>
        <p className="text-[13.5px] font-bold text-ink-3">{sub}</p>
      </div>
    </section>
  );
}

function Rekening({ atur, jumlah }: { atur: Atur | null; jumlah: number }) {
  const [salin, setSalin] = useState("");
  const kopi = (teks: string, apa: string) => {
    navigator.clipboard?.writeText(teks).then(() => (setSalin(apa), setTimeout(() => setSalin(""), 1500)));
  };
  if (!atur?.no_rekening) return <p className="text-[14px] font-bold text-[#c0283a]">Rekening tujuan belum diatur. Hubungi kampus@pulaurinoya.com.</p>;
  return (
    <div className="flex flex-col gap-2 rounded-[16px] bg-[#f4f7fb] p-4">
      <Baris label="Jumlah transfer" nilai={rupiah(jumlah)} besar onSalin={() => kopi(String(jumlah), "jumlah")} tersalin={salin === "jumlah"} />
      <Baris label={`Bank ${atur.bank}`} nilai={atur.no_rekening} onSalin={() => kopi(atur.no_rekening.replace(/\D/g, ""), "rek")} tersalin={salin === "rek"} />
      <Baris label="Atas nama" nilai={atur.atas_nama} />
      {atur.kode_unik && <p className="text-[12.5px] font-bold text-ink-3">Transfer persis sampai 3 angka terakhir supaya pembayaranmu mudah dicocokkan.</p>}
      {atur.catatan && <p className="text-[12.5px] font-bold text-ink-3">{atur.catatan}</p>}
    </div>
  );
}

function Baris({ label, nilai, besar, onSalin, tersalin }: { label: string; nilai: string; besar?: boolean; onSalin?: () => void; tersalin?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-extrabold text-ink-3 uppercase">{label}</p>
        <p className="tabular-nums" style={{ fontFamily: besar ? BALOO : undefined, fontSize: besar ? 24 : 16, fontWeight: 800 }}>
          {nilai}
        </p>
      </div>
      {onSalin && (
        <button onClick={onSalin} className="inline-flex h-9 items-center gap-1 rounded-full bg-white px-3 text-[13px] font-extrabold text-[#0567c2]">
          <Icon name={tersalin ? "check" : "content_copy"} size={16} /> {tersalin ? "Tersalin" : "Salin"}
        </button>
      )}
    </div>
  );
}

function Konfirmasi({ pilihan, atur, familyId, onBatal, onTerkirim }: { pilihan: { paket: Paket; periode: Periode; anak: number }; atur: Atur | null; familyId: string; onBatal: () => void; onTerkirim: () => void }) {
  const harga = totalDari(pilihan.paket, pilihan.periode, pilihan.anak)!.harga;
  const [kode] = useState(() => (atur?.kode_unik ? 100 + Math.floor(Math.random() * 900) : 0));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const buat = async () => {
    setBusy(true);
    setErr("");
    const { error } = await supabase().from("akademi_bayar").insert({ family_id: familyId, paket_id: pilihan.paket.id, periode: pilihan.periode, anak_tambahan: pilihan.anak - 1, harga, kode_unik: kode, jumlah: harga + kode });
    setBusy(false);
    if (error) setErr(pesanGalat(error.message));
    else onTerkirim();
  };
  return (
    <section className={`${KARTU} flex flex-col gap-4 p-4 sm:p-5`}>
      <h2 style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>
        {pilihan.paket.nama} · {namaPeriode(pilihan.periode)} · {anakTeks(pilihan.anak)}
      </h2>
      <p className="text-[14px] font-semibold text-ink-2">Setelah kamu lanjut, transfer ke rekening berikut lalu kirim foto bukti transfernya. Langganan aktif begitu pembayaran kami terima (biasanya di hari yang sama).</p>
      <Rekening atur={atur} jumlah={harga + kode} />
      {err && <p className="text-[13px] font-bold text-[#c0283a]">{err}</p>}
      <div className="flex flex-wrap gap-2">
        <button onClick={buat} disabled={busy} className={`${TOMBOL} text-white`} style={{ background: "#0786eb" }}>
          {busy ? "Menyimpan…" : "Saya akan transfer"}
        </button>
        <button onClick={onBatal} className={`${TOMBOL} bg-[#f4f7fb]`} style={{ color: INK }}>
          Ganti paket
        </button>
      </div>
    </section>
  );
}

function Tagihan({ bayar, atur, paket, familyId, onBerubah }: { bayar: Bayar; atur: Atur | null; paket: Paket[]; familyId: string; onBerubah: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nama = paket.find((p) => p.id === bayar.paket_id)?.nama ?? bayar.paket_id;
  const kirimBukti = async (file: File | undefined) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) return setErr("Bukti harus berupa foto atau tangkapan layar.");
    setBusy(true);
    setErr("");
    try {
      const blob = await siapkanBukti(file);
      const path = `${familyId}/bukti/${crypto.randomUUID()}.jpg`;
      const up = await supabase().storage.from("bukti-bayar").upload(path, blob, { contentType: "image/jpeg" });
      if (up.error) throw new Error(up.error.message);
      const { error } = await supabase().from("akademi_bayar").update({ bukti_path: path }).eq("id", bayar.id);
      if (error) throw new Error(error.message);
      onBerubah();
    } catch (e) {
      setErr(pesanGalat(e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };
  const batal = async () => {
    setBusy(true);
    const { error } = await supabase().from("akademi_bayar").update({ status: "batal" }).eq("id", bayar.id);
    setBusy(false);
    if (error) setErr(pesanGalat(error.message));
    else onBerubah();
  };
  return (
    <section className={`${KARTU} flex flex-col gap-4 p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="flex-1" style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800 }}>
          {nama} · {namaPeriode(bayar.periode)} · {anakTeks(1 + (bayar.anak_tambahan ?? 0))}
        </h2>
        <span className="rounded-full bg-[#fff0da] px-2.5 py-0.5 text-[12px] font-extrabold text-[#a34a00]">{bayar.bukti_path ? "Sedang diperiksa" : "Menunggu transfer"}</span>
      </div>
      {bayar.bukti_path ? (
        <p className="text-[14px] font-semibold text-ink-2">Bukti transfer sudah kami terima. Kami cocokkan dengan mutasi rekening; langganan aktif otomatis begitu diterima. Kalau ada yang kurang, kami kabari lewat email akun rumah.</p>
      ) : (
        <p className="text-[14px] font-semibold text-ink-2">Transfer jumlah persis di bawah, lalu kirim foto atau tangkapan layar bukti transfernya.</p>
      )}
      <Rekening atur={atur} jumlah={bayar.jumlah} />
      {err && <p className="text-[13px] font-bold text-[#c0283a]">{err}</p>}
      <div className="flex flex-wrap gap-2">
        <label className={`${TOMBOL} cursor-pointer text-white`} style={{ background: "#0786eb", opacity: busy ? 0.5 : 1 }}>
          <Icon name="upload" size={18} /> {busy ? "Mengirim…" : bayar.bukti_path ? "Ganti bukti transfer" : "Kirim bukti transfer"}
          <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => kirimBukti(e.target.files?.[0])} />
        </label>
        <button onClick={batal} disabled={busy} className={`${TOMBOL} bg-[#f4f7fb]`} style={{ color: INK }}>
          Batalkan
        </button>
      </div>
    </section>
  );
}

function Riwayat({ riwayat, paket }: { riwayat: Bayar[]; paket: Paket[] }) {
  const tampil = riwayat.filter((b) => b.status !== "menunggu");
  if (!tampil.length) return null;
  const LABEL = { diterima: ["Diterima", "#0b7a6b", "#e6f7f3"], ditolak: ["Ditolak", "#c0283a", "#fdecee"], batal: ["Dibatalkan", "#5b6b80", "#f4f7fb"], menunggu: ["", "", ""] } as const;
  return (
    <section className={`${KARTU} flex flex-col gap-3 p-4 sm:p-5`}>
      <h2 style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800 }}>Riwayat pembayaran</h2>
      <ul className="flex flex-col divide-y divide-[#eef2f7]">
        {tampil.map((b) => {
          const [l, c, bg] = LABEL[b.status];
          return (
            <li key={b.id} className="flex flex-wrap items-center gap-2 py-2.5 text-[13.5px]">
              <span className="min-w-0 flex-1 font-bold">
                {paket.find((p) => p.id === b.paket_id)?.nama ?? b.paket_id} · {namaPeriode(b.periode)} · {anakTeks(1 + (b.anak_tambahan ?? 0))}
                <span className="block text-[12.5px] font-semibold text-ink-3">
                  {tgl(b.dibuat_at)}
                  {b.status === "diterima" && b.sampai ? ` · aktif sampai ${tgl(b.sampai)}` : ""}
                  {b.status === "ditolak" && b.alasan ? ` · ${b.alasan}` : ""}
                </span>
              </span>
              <span className="font-extrabold tabular-nums">{rupiah(b.jumlah)}</span>
              <span className="rounded-full px-2.5 py-0.5 text-[12px] font-extrabold" style={{ color: c, background: bg }}>
                {l}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
