"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setPin, signOutAccount, useCloud } from "@/lib/supabase/family";
import { displayLogin } from "@/app/masuk/account";
import { accessText } from "@/components/sheets";
import { Avatar, Card, Icon, Modal, RoleBadge, Tile, listRow } from "@/components/ui";
import type { ColorKey } from "@/lib/catalog";
import { useMe, useRumila, useUI } from "@/lib/store";

export default function Saya() {
  const me = useMe();
  const members = useRumila((s) => s.members);
  const familyName = useRumila((s) => s.familyName);
  const email = useCloud((s) => s.email);
  const [pinOpen, setPinOpen] = useState(false);
  const signOut = useRumila((s) => s.signOut);
  const router = useRouter();
  const { openSheet, showToast } = useUI();
  const sorted = [...members].sort((a, b) => Number(b.admin) - Number(a.admin));

  const settings: { icon: string; c: ColorKey; label: string; meta: string; tap?: () => void }[] = [
    { icon: "timer", c: "orange", label: "Batas waktu layar anak", meta: "2 jam per hari" },
    {
      icon: "lock",
      c: "gold",
      label: "PIN profil",
      meta: me.pin ? "Aktif · ketuk untuk ganti" : "Belum dipasang",
      tap: () => setPinOpen(true),
    },
    { icon: "help", c: "sky", label: "Bantuan & cara install", meta: "Pasang di layar utama HP" },
    {
      icon: "logout",
      c: "red",
      label: "Ganti profil",
      meta: "Kembali ke pilih profil",
      tap: () => {
        signOut();
        router.replace("/masuk");
      },
    },
    {
      icon: "no_accounts",
      c: "red",
      label: "Keluar akun",
      meta: email ? `Masuk sebagai ${displayLogin(email)}` : "Keluar dari akun rumah ini",
      tap: async () => {
        await signOutAccount();
        router.replace("/masuk");
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5 desk:grid desk:grid-cols-2 desk:items-start">
        <div className="flex flex-col gap-5">
          <Card radius={26} className="flex items-center gap-3.5 p-5">
            <Avatar c={me.c} name={me.name} size={64} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xl font-extrabold tracking-[-0.02em]">{me.name}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <RoleBadge admin={me.admin} />
                <span className="text-xs text-ink-3">Rumah {familyName}</span>
              </div>
            </div>
          </Card>

          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold tracking-[.06em] whitespace-nowrap text-ink-4 uppercase">Anggota · {members.length}</h2>
              {me.admin && (
                <button
                  onClick={() => openSheet({ kind: "add" })}
                  className="flex items-center gap-1 py-1.5 text-[13px] font-bold text-coral-deep"
                >
                  <Icon name="person_add" size={18} />
                  Tambah
                </button>
              )}
            </div>
            <Card className="px-3.5 py-0.5">
              {sorted.map((m) => (
                <button
                  key={m.id}
                  onClick={() => (me.admin ? openSheet({ kind: "edit", memberId: m.id }) : showToast("Minta Admin untuk mengubah akses"))}
                  className={listRow}
                >
                  <Avatar c={m.c} name={m.name} size={42} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[15px] font-bold">
                      <span className="truncate">{m.name}</span>
                      <RoleBadge admin={m.admin} />
                    </span>
                    <span className="text-xs text-ink-3">{accessText(m)}</span>
                  </span>
                  {me.admin && <Icon name="chevron_right" className="text-chev" />}
                </button>
              ))}
            </Card>
            {!me.admin && <p className="px-1 text-xs text-ink-4">Hanya Admin yang bisa menambah anggota dan mengatur akses.</p>}
          </section>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-xs font-bold tracking-[.06em] text-ink-4 uppercase">Pengaturan</h2>
          <Card className="px-3.5 py-0.5">
            {settings.map((s) => (
              <button key={s.label} onClick={s.tap ?? (() => showToast(`${s.label} — segera hadir`))} className={`${listRow} py-3.5`}>
                <Tile c={s.c} icon={s.icon} size={38} radius={0.32} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">{s.label}</span>
                  <span className="text-xs text-ink-3">{s.meta}</span>
                </span>
                <Icon name="chevron_right" className="text-chev" />
              </button>
            ))}
          </Card>
        </section>
      </div>
      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} memberId={me.id} hasPin={!!me.pin} />
    </>
  );
}

/** Pasang / ganti / hapus PIN profil sendiri (disimpan sebagai hash di server). */
function PinModal({ open, onClose, memberId, hasPin }: { open: boolean; onClose: () => void; memberId: string; hasPin: boolean }) {
  const showToast = useUI((s) => s.showToast);
  const [pin, setPinVal] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (value: string | null) => {
    setBusy(true);
    try {
      await setPin(memberId, value);
      showToast(value ? "PIN tersimpan" : "PIN dihapus");
      setPinVal("");
      onClose();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan PIN");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={hasPin ? "Ganti PIN profil" : "Pasang PIN profil"} width={420}>
      <p className="text-sm text-ink-3">PIN 4 angka dipakai saat masuk ke profilmu, supaya anak-anak tidak membuka profil orang tua.</p>
      <input
        autoFocus
        inputMode="numeric"
        autoComplete="off"
        aria-label="PIN baru"
        value={pin}
        onChange={(e) => setPinVal(e.target.value.replace(/\D/g, "").slice(0, 4))}
        placeholder="4 angka"
        className="h-14 rounded-2xl border border-line px-4 text-center text-2xl font-bold tracking-[.5em] outline-none focus:border-ink-3"
      />
      <button
        disabled={pin.length !== 4 || busy}
        onClick={() => save(pin)}
        className="h-[52px] rounded-2xl bg-ink font-bold text-white disabled:opacity-40"
      >
        Simpan PIN
      </button>
      {hasPin && (
        <button disabled={busy} onClick={() => save(null)} className="h-10 text-sm font-semibold text-negative">
          Hapus PIN
        </button>
      )}
    </Modal>
  );
}
