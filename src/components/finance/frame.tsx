"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { useFinance, useFinUI } from "@/lib/finance/store";
import { useFinCloud } from "@/lib/supabase/finance";
import { useMe, useRumila } from "@/lib/store";
import { AddTxModal, AsistenModal } from "./modals";
import { useFT } from "./ui";

// Kerangka modul Finance — acuan sidebar "Keuangan-Playful"/"Keuangan-Mobile" (mode wide ≥880px).

export const FIN_NAV: { title: string; items: [string, string, string][] }[] = [
  {
    title: "Menu",
    items: [
      ["", "home", "Beranda"],
      ["transaksi", "receipt_long", "Transaksi"],
      ["analitik", "bar_chart", "Analitik"],
    ],
  },
  {
    title: "Keuangan",
    items: [
      ["akun", "account_balance", "Akun Finansial"],
      ["kalender", "calendar_month", "Kalender"],
    ],
  },
  {
    title: "Aset",
    items: [
      ["investasi", "trending_up", "Investasi"],
      ["properti", "home_work", "Properti & Fisik"],
    ],
  },
  {
    title: "Alat",
    items: [
      ["budget", "donut_small", "Budget"],
      ["goals", "flag", "Goals"],
      ["tagihan", "receipt", "Tagihan & Cicilan"],
      ["utang", "credit_card", "Utang & Piutang"],
    ],
  },
];

const hrefOf = (id: string) => (id ? `/finance/${id}` : "/finance");

export function FinanceFrame({ children }: { children: ReactNode }) {
  // Tampilkan halaman setelah data keuangan rumah ini termuat dari Supabase.
  const fin = useFinCloud();
  const ready = fin.status === "ready";
  const T = useFT();

  return (
    <div className="min-h-dvh desk:flex desk:items-start" style={{ background: T.page, fontFamily: T.body, color: T.ink }}>
      <Sidebar />
      <MobileBar />
      <main className="mx-auto flex w-full max-w-[1240px] min-w-0 flex-1 flex-col gap-[18px] px-[18px] pt-4 pb-28 desk:gap-[22px] desk:px-6 desk:pt-6 desk:pb-12 wide:px-9 wide:pt-7">
        {ready ? (
          children
        ) : fin.status === "error" ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Icon name="cloud_off" size={40} />
            <p className="font-bold">Data keuangan belum bisa dimuat.</p>
            <p className="text-sm opacity-70">{fin.error}</p>
            <button onClick={() => location.reload()} className="rounded-xl px-5 py-3 font-bold" style={T.primary}>
              Coba lagi
            </button>
          </div>
        ) : (
          <p className="py-16 text-center text-sm opacity-60">Memuat data keuangan…</p>
        )}
      </main>
      <MobileFab />
      <AddTxModal />
      <AsistenModal />
    </div>
  );
}

function Sidebar() {
  const T = useFT();
  const path = usePathname();
  const me = useMe();
  const count = useRumila((s) => s.members.length);
  const hide = useFinance((s) => s.hide);
  const toggleHide = useFinance((s) => s.toggleHide);
  const { openAdd, openAsisten } = useFinUI();

  return (
    <aside
      className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col gap-3 overflow-y-auto bg-white px-4 py-5 desk:flex"
      style={{ borderRight: `1.5px solid ${T.play ? "#f1ecf7" : "#e6e8ec"}` }}
    >
      <div className="flex items-center gap-2.5 px-1 pb-1.5">
        <Link
          href="/beranda"
          title="Kembali ke Beranda"
          aria-label="Kembali ke Beranda"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: T.subtle, color: T.ink }}
        >
          <Icon name="apps" />
        </Link>
        <div className="min-w-0">
          <div style={{ fontFamily: T.head, fontSize: 20, fontWeight: T.headWeight, lineHeight: 1 }}>Keuangan</div>
          <div className="flex items-center gap-[5px]" style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
            <Image src="/brand/rumila-mark.png" alt="" width={16} height={15} />
            by Rumila
          </div>
        </div>
      </div>
      <button
        onClick={openAdd}
        className="flex h-12 items-center justify-center gap-1.5 rounded-[14px] transition-transform active:translate-y-px"
        style={{ ...T.primary, fontWeight: T.bold, fontSize: 15 }}
      >
        <Icon name="add" />
        Tambah transaksi
      </button>
      <button
        onClick={openAsisten}
        className="flex h-11 items-center justify-center gap-1.5 rounded-[14px]"
        style={{
          border: `1.5px solid ${T.play ? "#e6def0" : "#dfe2e7"}`,
          background: T.play ? "#effcf4" : "#fffaeb",
          color: T.play ? "#12904a" : "#2c6b4f",
          fontWeight: T.bold,
          fontSize: 14,
        }}
      >
        <Icon name="auto_awesome" size={20} />
        Asisten
      </button>

      {FIN_NAV.map((g) => (
        <nav key={g.title} aria-label={g.title} className="flex flex-col gap-0.5 pt-1.5">
          <div
            className="px-3 py-1"
            style={{
              fontSize: 11,
              fontWeight: T.bold,
              color: T.play ? "#b3a48f" : "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            {g.title}
          </div>
          {g.items.map(([id, icon, label]) => {
            const href = hrefOf(id);
            const on = path === href;
            return (
              <Link
                key={id}
                href={href}
                aria-current={on ? "page" : undefined}
                className="flex h-[42px] items-center gap-2.5 rounded-xl px-3 transition-colors"
                style={{
                  background: on ? T.sideOn : "transparent",
                  color: on ? T.ink : T.play ? "#4a3d66" : "#374151",
                  fontWeight: T.play ? 800 : 600,
                  fontSize: 14,
                }}
              >
                <Icon name={icon} size={21} />
                {label}
              </Link>
            );
          })}
        </nav>
      ))}

      <div className="mt-auto flex items-center gap-2.5 rounded-2xl px-3 py-2.5" style={{ background: T.play ? "#fff8ee" : "#f5f6f8" }}>
        <div
          className="flex size-[38px] shrink-0 items-center justify-center rounded-full text-white"
          style={{
            background: T.play ? "linear-gradient(155deg,#7cc0ff,#2f86ff)" : "linear-gradient(150deg,#ffd45c,#f5b400)",
            fontWeight: T.bold,
            fontSize: 17,
          }}
        >
          {me.name.replace(/^(Kak|Dek|Om|Tante) /, "")[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate" style={{ fontWeight: T.bold, fontSize: 14 }}>
            {me.name}
          </div>
          <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>Keluarga · {count} anggota</div>
        </div>
        <button
          onClick={toggleHide}
          title={hide ? "Tampilkan nominal" : "Sembunyikan nominal"}
          aria-label={hide ? "Tampilkan nominal" : "Sembunyikan nominal"}
          aria-pressed={hide}
          className="flex size-9 items-center justify-center rounded-[10px] bg-white"
          style={{ color: T.ink2 }}
        >
          <Icon name={hide ? "visibility_off" : "visibility"} size={20} />
        </button>
      </div>
    </aside>
  );
}

/** Mobile: bar atas + chip navigasi geser. */
function MobileBar() {
  const T = useFT();
  const path = usePathname();
  const items = FIN_NAV.flatMap((g) => g.items);
  return (
    <div className="sticky top-0 z-20 flex flex-col gap-2.5 px-[18px] pt-3 pb-2 desk:hidden" style={{ background: T.page }}>
      <div className="flex items-center gap-2.5">
        <Link
          href="/beranda"
          aria-label="Kembali ke Beranda"
          className="flex size-10 items-center justify-center rounded-xl bg-white"
          style={{ color: T.ink }}
        >
          <Icon name="apps" />
        </Link>
        <div style={{ fontFamily: T.head, fontSize: 20, fontWeight: T.headWeight }}>Keuangan</div>
      </div>
      <nav className="-mx-[18px] flex gap-2 overflow-x-auto px-[18px]" aria-label="Menu keuangan">
        {items.map(([id, icon, label]) => {
          const href = hrefOf(id);
          const on = path === href;
          return (
            <Link
              key={id}
              href={href}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[13px] whitespace-nowrap"
              style={{ background: on ? T.sideOn : "#fff", color: T.ink, fontWeight: T.play ? 800 : 600 }}
            >
              <Icon name={icon} size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function MobileFab() {
  const T = useFT();
  const openAdd = useFinUI((s) => s.openAdd);
  return (
    <button
      onClick={openAdd}
      aria-label="Tambah transaksi"
      className="fixed right-5 bottom-6 z-30 flex size-[58px] items-center justify-center rounded-[20px] desk:hidden"
      style={{ ...T.primary, boxShadow: "0 12px 24px rgba(16,24,40,.28)" }}
    >
      <Icon name="add" size={32} />
    </button>
  );
}
