"use client";

// Sertifikat jenjang untuk anak yang sedang masuk: bila pangkat tercapai → terbitkan sekali, lalu kartu + Cetak/PDF +
// Bagikan tautan verifikasi. Bila belum → progres pangkat & kompetensi inti yang masih harus dikuasai.
// Layar penuh (terdaftar di shell), gaya tenang seperti Rapor.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LEVELS, type LevelId } from "@akademi/schema";
import { BALOO, NUNITO } from "@/components/launcher";
import { Icon } from "@/components/ui";
import { SERTIFIKAT_PRINT_CSS, SertifikatKartu } from "@/components/akademi/sertifikat";
import { useEvents } from "@/lib/akademi/jejak";
import { LEVEL_PANGKAT, pangkat } from "@/lib/akademi/koleksi";
import { KOMPETENSI } from "@/lib/akademi/konten";
import { proyeksi } from "@/lib/akademi/mastery";
import { ambilSertifikat, terbitkan, URL_VERIFIKASI, useSertifikat } from "@/lib/akademi/sertifikat";
import { useCloud } from "@/lib/supabase/family";
import { useMe, useUI } from "@/lib/store";

const INK = "#0b2545";
const KARTU = "rounded-[22px] bg-white shadow-[0_4px_0_rgba(11,37,69,.08)]";

export default function SertifikatLevelPage() {
  const { level: raw } = useParams<{ level: string }>();
  const level = (raw ?? "").toUpperCase() as LevelId;
  const valid = (LEVEL_PANGKAT as readonly string[]).includes(level);
  return <Kerangka>{valid ? <IsiSertifikat level={level} /> : <TidakAda />}</Kerangka>;
}

function Kerangka({ children }: { children: React.ReactNode }) {
  return (
    <div className="sertifikat-root min-h-dvh" style={{ background: "#fff0da", fontFamily: NUNITO, color: INK }}>
      <style>{SERTIFIKAT_PRINT_CSS}</style>
      <div className="mx-auto flex max-w-[1040px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
        {children}
      </div>
    </div>
  );
}

function Kepala({ judul, sub }: { judul: string; sub: string }) {
  return (
    <header className="no-print flex items-center gap-3">
      <Link href="/akademi" aria-label="Kembali" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#f0e4d2] bg-white transition-transform active:scale-95" style={{ color: INK }}>
        <Icon name="arrow_back" size={22} />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK, lineHeight: 1.05 }}>{judul}</h1>
        <p className="text-[13px] font-bold text-ink-3">{sub}</p>
      </div>
    </header>
  );
}

function TidakAda() {
  return (
    <>
      <Kepala judul="Sertifikat" sub="RINOYA Academy" />
      <p className={`${KARTU} p-5 text-[14px] font-bold text-ink-3`}>Jenjang ini belum punya sertifikat.</p>
    </>
  );
}

function IsiSertifikat({ level }: { level: LevelId }) {
  const me = useMe();
  const showToast = useUI((s) => s.showToast);
  const familyId = useCloud((s) => s.familyId);
  const events = useEvents(me.id);
  const peng = useMemo(() => proyeksi(events, KOMPETENSI), [events]);
  const p = useMemo(() => pangkat(peng, KOMPETENSI, [level])[0], [peng, level]);
  const meta = LEVELS.find((l) => l.id === level)!;
  const daftar = useSertifikat(me.id);
  const sert = daftar.find((s) => s.level === level && !s.track);
  const [sibuk, setSibuk] = useState(false);

  // Sertifikat yang terbit di perangkat lain: tarik dari server sekali saat halaman dibuka.
  useEffect(() => {
    if (!familyId) return;
    ambilSertifikat(me.id).catch((e) => console.error("[akademi] ambil sertifikat gagal", e));
  }, [familyId, me.id]);

  const terbit = async () => {
    setSibuk(true);
    try {
      const s = await terbitkan(me.id, level);
      showToast(s.pending ? "Sertifikat terbit. Akan disinkronkan saat online." : "Sertifikat terbit! 🎓");
    } catch (e) {
      console.error("[akademi] terbitkan sertifikat gagal", e);
      showToast("Sertifikat belum bisa diterbitkan. Coba lagi, ya.");
    } finally {
      setSibuk(false);
    }
  };

  const bagikan = async () => {
    if (!sert) return;
    const url = URL_VERIFIKASI(sert.code);
    const title = `Sertifikat ${meta.nama} — ${me.name}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: `${me.name} menuntaskan ${meta.nama} (${meta.lokal}) — pangkat ${meta.pangkat}. Cek keasliannya:`, url });
        return;
      }
    } catch {
      /* dibatalkan pengguna → jatuh ke salin */
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Tautan verifikasi disalin.");
    } catch {
      showToast(url);
    }
  };

  if (sert) {
    return (
      <>
        <Kepala judul={`Sertifikat ${meta.pangkat}`} sub={`${meta.nama} · ${meta.lokal} · ${me.name}`} />
        <div className="flex justify-center">
          <SertifikatKartu nama={me.name} level={level} kode={sert.code} issuedAt={sert.issuedAt} snapshot={sert.snapshot} pending={sert.pending} />
        </div>
        <div className="no-print flex flex-wrap justify-center gap-2">
          <button onClick={() => window.print()} className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-white transition-transform active:scale-95" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, background: "linear-gradient(155deg,#1f94f0,#0567c2 60%)", boxShadow: "0 3px 0 #0567c2" }}>
            <Icon name="print" size={22} /> Cetak / PDF
          </button>
          <button onClick={bagikan} className="inline-flex h-12 items-center gap-2 rounded-full border border-[#f0e4d2] bg-white px-6 transition-transform active:scale-95" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: INK }}>
            <Icon name="share" size={22} /> Bagikan tautan
          </button>
          <Link href={`/sertifikat/${sert.code}`} className="inline-flex h-12 items-center gap-2 rounded-full border border-[#f0e4d2] bg-white px-6 transition-transform active:scale-95" style={{ fontFamily: BALOO, fontSize: 17, fontWeight: 800, color: INK }}>
            <Icon name="verified" size={22} /> Halaman verifikasi
          </Link>
        </div>
        <p className="no-print text-center text-[12px] font-bold text-ink-3">
          Kode <b style={{ color: INK }}>{sert.code}</b> bisa dicek siapa saja di {URL_VERIFIKASI(sert.code).replace(/^https:\/\//, "")}. Halaman publik hanya menampilkan nama depan.
          {sert.pending && " · Salinan ini masih di perangkat; akan dikirim ke server saat online."}
        </p>
      </>
    );
  }

  if (p?.tercapai) {
    return (
      <>
        <Kepala judul={`Pangkat ${meta.pangkat} tercapai! 🎖️`} sub={`${meta.nama} · ${meta.lokal} · ${me.name}`} />
        <div className={`${KARTU} flex flex-col items-center gap-4 p-6 text-center`}>
          <span className="flex size-24 items-center justify-center rounded-full" style={{ background: "linear-gradient(155deg,#ffe46b,#ffbe0b 65%)", boxShadow: "0 4px 0 #d99400", fontSize: 52 }}>
            🎓
          </span>
          <p className="max-w-[420px] leading-tight" style={{ fontFamily: BALOO, fontSize: 24, fontWeight: 800, color: INK }}>
            Semua kompetensi inti {meta.nama} sudah dikuasai
          </p>
          <p className="max-w-[460px] text-[14px] font-bold text-ink-3">
            Sertifikat jenjang diterbitkan sekali dengan kode verifikasi unik, lalu bisa dicetak jadi PDF atau dibagikan ke keluarga.
          </p>
          <button
            onClick={terbit}
            disabled={sibuk}
            className="inline-flex h-14 items-center gap-2 rounded-[18px] px-8 text-[#0b2545] transition-transform active:scale-95 disabled:opacity-60"
            style={{ fontFamily: BALOO, fontSize: 19, fontWeight: 800, background: "linear-gradient(155deg,#ffb347,#fd861d 60%)", boxShadow: "0 4px 0 #c85400" }}
          >
            <Icon name="workspace_premium" size={26} /> {sibuk ? "Menerbitkan…" : "Terbitkan sertifikat"}
          </button>
        </div>
      </>
    );
  }

  // Belum tercapai: progres + daftar kompetensi inti yang belum dikuasai.
  const belum = KOMPETENSI.filter((c) => c.level === level && c.core && peng[c.id]?.status !== "dikuasai");
  const persen = Math.round((p?.progres ?? 0) * 100);
  return (
    <>
      <Kepala judul={`Menuju pangkat ${meta.pangkat}`} sub={`${meta.nama} · ${meta.lokal} · ${me.name}`} />
      <div className={`${KARTU} flex flex-col gap-3 p-5`}>
        <div className="flex items-center justify-between">
          <p style={{ fontFamily: BALOO, fontSize: 20, fontWeight: 800, color: INK }}>Progres pangkat</p>
          <span className="rounded-full bg-[#e3f1fd] px-3 py-1 text-[13px] font-black text-[#0567c2]">{persen}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#fff0da]">
          <div className="h-full rounded-full" style={{ width: `${persen}%`, background: "linear-gradient(90deg,#4fb3ff,#0786eb)" }} />
        </div>
        <p className="text-[13px] font-bold text-ink-3">
          Sertifikat terbit otomatis bisa diminta setelah semua kompetensi inti jenjang ini dikuasai. Tinggal {belum.length} lagi.
        </p>
      </div>
      <section className={`${KARTU} flex flex-col gap-2 p-5`}>
        <p style={{ fontFamily: BALOO, fontSize: 18, fontWeight: 800, color: INK }}>Yang masih harus dikuasai</p>
        {belum.length === 0 ? (
          <p className="text-[13px] font-bold text-ink-3">Jenjang ini belum punya kompetensi inti.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#fff0da]">
            {belum.map((c) => {
              const st = peng[c.id]?.status ?? "belum";
              return (
                <li key={c.id} className="flex items-center gap-3 py-2.5">
                  <span className="size-3 shrink-0 rounded-full" style={{ background: st === "berkembang" ? "#ffbe0b" : "#f0e4d2" }} aria-label={st} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold" style={{ color: INK }}>
                      {c.statement.id}
                    </p>
                    <p className="text-[12px] font-bold text-ink-3">
                      {c.unit.nama.id} · {st === "berkembang" ? "Berkembang" : "Belum"}
                    </p>
                  </div>
                  <Link href={`/akademi/pelajaran/${c.track}`} className="rounded-full border border-[#f0e4d2] bg-white px-3 py-1 text-[12px] font-extrabold transition-transform active:scale-95" style={{ color: INK }}>
                    Latih
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
