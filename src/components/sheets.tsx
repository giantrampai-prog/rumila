"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ALL_PERMS, CAT, KID_PRESET, MEMBER_COLORS, PERMS, getTool, type ColorKey } from "@/lib/catalog";
import { initialOf } from "@/lib/format";
import { can, useIsDesktop, useMe, useRumila, useUI, type Member } from "@/lib/store";
import { AppModal } from "./launcher";
import { Avatar, Icon, RoleBadge, Switch, Tile } from "./ui";
import { EducationTopics } from './education-topics';
import { signOutAccount, useCloud } from "@/lib/supabase/family";
import { displayLogin } from "@/app/masuk/account";
import { installApp, useCanInstall } from "./pwa";

export const accessText = (m: Member) =>
  m.admin ? "Akses penuh" : `${PERMS.filter((p) => can(m, p.key)).length} dari ${PERMS.length} menu`;

export function SheetHost() {
  const sheet = useUI((s) => s.sheet);
  const close = useUI((s) => s.closeSheet);
  const desk = useIsDesktop();

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sheet, close]);

  if (!sheet) return null;
  // Website: detail alat pakai modal launcher.
  if (desk && sheet.kind === "app") return <AppModal toolId={sheet.toolId} onClose={close} />;

  let body: ReactNode = null;
  if (sheet.kind === "members") body = <MembersSheet />;
  if (sheet.kind === "add") body = <AddSheet />;
  if (sheet.kind === "edit") body = <EditSheet memberId={sheet.memberId} />;
  if (sheet.kind === "app") body = <AppSheet toolId={sheet.toolId} />;

  return (
    <div className="anim-fade fixed inset-0 z-[60] bg-[rgba(31,48,68,.45)]">
      <div className="mx-auto flex h-full max-w-[440px] flex-col justify-end desk:max-w-[520px] desk:justify-center desk:px-5">
        <div className="flex-1 desk:min-h-5" onClick={close} />
        <div
          role="dialog"
          aria-modal="true"
          className="anim-sheet grid max-h-[90vh] grid-cols-[minmax(0,1fr)] gap-4 overflow-y-auto rounded-t-[28px] bg-white px-5 pt-3.5 desk:max-h-[94vh] desk:rounded-[28px] desk:px-6 desk:pt-6 desk:shadow-[0_30px_80px_rgba(31,48,68,.35)]"
          style={{ paddingBottom: "max(26px, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto h-[5px] w-11 rounded-full bg-[#e6e3dd] desk:hidden" />
          {body}
        </div>
        <div className="hidden flex-1 desk:block desk:min-h-5" onClick={close} />
      </div>
    </div>
  );
}

function SheetTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-extrabold tracking-[-0.02em]">{children}</h2>;
}

function MembersSheet() {
  const members = useRumila((s) => s.members);
  const meId = useRumila((s) => s.meId);
  const switchMember = useRumila((s) => s.switchMember);
  const close = useUI((s) => s.closeSheet);
  const openSheet = useUI((s) => s.openSheet);
  const email = useCloud((s) => s.email);
  const canInstall = useCanInstall();
  const router = useRouter();
  const me = members.find((m) => m.id === meId);
  const others = members.filter((m) => m.id !== meId);
  const row = "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[15px] font-bold";

  return (
    <>
      <SheetTitle>Profil & pengaturan</SheetTitle>
      {me && (
        <div className="flex items-center gap-3 rounded-2xl px-3 py-3" style={{ background: CAT[me.c][0] }}>
          <Avatar c={me.c} name={me.name} size={48} />
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-extrabold">{me.name}</span>
            <span className="text-xs text-ink-3">
              {me.admin ? "Admin" : "User"} · {accessText(me)}
            </span>
          </span>
          <button onClick={() => openSheet({ kind: "edit", memberId: me.id })} className="rounded-xl bg-white px-3 py-2 text-[13px] font-bold">
            Ubah
          </button>
        </div>
      )}

      {others.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="px-1 text-xs font-bold text-ink-3">Ganti pemain</span>
          {others.map((m) => (
            <div key={m.id} className="flex items-center gap-1">
              <button
                onClick={() => {
                  close();
                  switchMember(m.id);
                  router.push("/beranda");
                }}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3 py-2 text-left"
              >
                <Avatar c={m.c} name={m.name} size={36} />
                <span className="min-w-0 flex-1 truncate text-[15px] font-bold">{m.name}</span>
              </button>
              <button onClick={() => openSheet({ kind: "edit", memberId: m.id })} aria-label={`Atur ${m.name}`} className="flex size-10 items-center justify-center rounded-xl text-ink-3">
                <Icon name="settings" size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 border-t border-line pt-2">
        <span className="px-1 text-xs font-bold text-ink-3">Pengaturan</span>
        {canInstall && (
          <button
            onClick={() => {
              close();
              void installApp();
            }}
            className={row}
          >
            <Icon name="install_mobile" /> Pasang aplikasi di layar utama
          </button>
        )}
        <button onClick={() => openSheet({ kind: "add" })} className={row}>
          <Icon name="person_add" /> Tambah anggota
        </button>
        <button
          onClick={async () => {
            close();
            await signOutAccount();
            router.replace("/masuk");
          }}
          className={`${row} text-negative`}
        >
          <Icon name="logout" /> Keluar akun
        </button>
        {email && <span className="px-3 text-xs text-ink-4">Masuk sebagai {displayLogin(email)}</span>}
      </div>
    </>
  );
}

function AddSheet() {
  const count = useRumila((s) => s.members.length);
  const addMember = useRumila((s) => s.addMember);
  const openSheet = useUI((s) => s.openSheet);
  const showToast = useUI((s) => s.showToast);
  const [name, setName] = useState("");
  const [c, setC] = useState<ColorKey>(MEMBER_COLORS[count % MEMBER_COLORS.length]);
  const ok = name.trim().length > 0;

  const save = () => {
    if (!ok) return;
    const n = name.trim();
    const id = addMember(n, c);
    openSheet({ kind: "edit", memberId: id });
    showToast(`Selamat datang, ${n}! Atur aksesnya, ya`);
  };

  return (
    <>
      <SheetTitle>Tambah anggota keluarga</SheetTitle>
      <div className="flex justify-center">
        <Avatar c={c} name={name} size={72} initial={name.trim() ? initialOf(name) : "?"} />
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink-2">Nama panggilan</span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          maxLength={24}
          placeholder="Misal: Nenek, Om Budi, Si Bungsu"
          className="h-[50px] rounded-[14px] border border-[#dfdbd3] px-3.5 text-[15px] font-medium outline-none focus:border-ink-3"
        />
      </label>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink-2">Warna</span>
        <div className="flex gap-2.5">
          {MEMBER_COLORS.map((k) => (
            <button
              key={k}
              aria-label={`Warna ${k}`}
              aria-pressed={c === k}
              onClick={() => setC(k)}
              className="size-9 rounded-full"
              style={{ background: CAT[k][1], boxShadow: c === k ? `0 0 0 3px #fff, 0 0 0 5px ${CAT[k][1]}` : "none" }}
            />
          ))}
        </div>
      </div>
      <p className="rounded-[14px] bg-page px-3.5 py-3 text-[13px] leading-normal text-ink-3">
        Anggota baru masuk sebagai <b className="text-ink">User</b>. Aksesnya bisa kamu atur setelah ini.
      </p>
      <button
        onClick={save}
        disabled={!ok}
        className="h-[54px] rounded-2xl text-base font-bold transition-colors disabled:cursor-default"
        style={{ background: ok ? "var(--coral)" : "#ece9e3", color: ok ? "#fff" : "var(--ink-4)" }}
      >
        Masukkan ke rumah
      </button>
    </>
  );
}

function EditSheet({ memberId }: { memberId: string }) {
  const m = useRumila((s) => s.members.find((x) => x.id === memberId));
  const { togglePerm, setPerms, makeAdmin, removeMember } = useRumila();
  const close = useUI((s) => s.closeSheet);
  const showToast = useUI((s) => s.showToast);
  const [confirmRemove, setConfirmRemove] = useState(false);
  if (!m) return null;
  const active = PERMS.filter((p) => can(m, p.key)).length;

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar c={m.c} name={m.name} size={52} />
        <div className="flex-1">
          <div className="text-xl font-extrabold tracking-[-0.02em]">{m.name}</div>
          <RoleBadge admin={m.admin} />
        </div>
      </div>

      {m.admin ? (
        <p className="rounded-[14px] bg-[#FFF2D1] px-3.5 py-3 text-sm leading-[1.55] text-ink-2">
          Admin punya akses penuh ke semua menu dan bisa mengatur anggota lain. Hanya ada satu Admin di tiap rumah.
        </p>
      ) : (
        <>
          <div className="flex items-baseline justify-between">
            <div className="text-sm font-bold">Boleh membuka</div>
            <div className="text-xs text-ink-3">
              {active} dari {PERMS.length} aktif
            </div>
          </div>
          <div className="rounded-[18px] bg-page px-3.5 py-0.5">
            {PERMS.map((p) => {
              const on = m.perms.includes(p.key);
              return (
                <button
                  key={p.key}
                  role="switch"
                  aria-checked={on}
                  onClick={() => togglePerm(m.id, p.key)}
                  className="flex w-full items-center gap-3 border-b border-[#efece6] py-2.5 text-left last:border-b-0"
                >
                  <Tile c={p.c} icon={p.icon} size={34} radius={0.32} />
                  <span className="flex-1 text-sm font-semibold">{p.name}</span>
                  <Switch on={on} />
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setPerms(m.id, KID_PRESET)}
              className="h-[46px] rounded-[14px] border border-line bg-white text-sm font-semibold"
            >
              Preset anak
            </button>
            <button
              onClick={() => setPerms(m.id, ALL_PERMS)}
              className="h-[46px] rounded-[14px] border border-line bg-white text-sm font-semibold"
            >
              Buka semua
            </button>
          </div>
          <button
            onClick={() => {
              makeAdmin(m.id);
              close();
              showToast(`${m.name} sekarang Admin`);
            }}
            className="h-[50px] rounded-[14px] bg-ink text-[15px] font-bold text-white"
          >
            Jadikan Admin
          </button>
          {confirmRemove ? (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setConfirmRemove(false)}
                className="h-[46px] rounded-[14px] border border-line bg-white text-sm font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  removeMember(m.id);
                  close();
                  showToast(`${m.name} dikeluarkan dari rumah`);
                }}
                className="h-[46px] rounded-[14px] bg-negative text-sm font-bold text-white"
              >
                Ya, keluarkan
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmRemove(true)} className="h-10 text-sm font-semibold text-negative">
              Keluarkan dari rumah
            </button>
          )}
        </>
      )}
    </>
  );
}

function AppSheet({ toolId }: { toolId: string }) {
  const t = getTool(toolId);
  const me = useMe();
  const close = useUI((s) => s.closeSheet);
  const showToast = useUI((s) => s.showToast);
  const logOpen = useRumila((s) => s.logOpen);
  if (!t) return null;

  return (
    <div className="flex flex-col items-center gap-3 pt-1 text-center">
      <span className={t.planned ? 'grayscale' : undefined}><Tile c={t.g} icon={t.icon} size={88} /></span>
      <div className="text-xs font-bold text-ink-3">{t.folderName}</div>
      <div className="-mt-1.5 text-2xl font-extrabold tracking-[-0.025em]">{t.name}</div>
      <p className="text-[15px] leading-[1.55] text-pretty text-ink-2">
        {t.planned ? t.desc : <>Dari menu {t.folderName}. Progres {me.name} tersimpan otomatis dan muncul di Laporan.</>}
      </p>
      {t.planned && <EducationTopics tool={t} />}
      <div className={`mt-1.5 grid w-full gap-2.5 ${t.planned ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <button autoFocus={t.planned} onClick={close} className="h-[50px] rounded-[14px] border border-line bg-white text-[15px] font-semibold">
          {t.planned ? 'Tutup' : 'Nanti dulu'}
        </button>
        {!t.planned && <button
          onClick={() => {
            logOpen(t.id);
            close();
            showToast(`Membuka ${t.name}…`);
          }}
          className="h-[50px] rounded-[14px] bg-ink text-[15px] font-bold text-white"
        >
          Yuk mulai
        </button>}
      </div>
    </div>
  );
}
