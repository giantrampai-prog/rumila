"use client";

// Modal global Finance: Tambah transaksi & Asisten — port dari prototype "Keuangan-Playful"/"Keuangan-Mobile".

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { create } from "zustand";
import { Icon } from "@/components/ui";
import { ACCOUNTS, AS_EXAMPLES, CAT_DEF, TODAY, TYPES, accName, catInfo, parseTx, type Tx, type TxType } from "@/lib/finance/data";
import { useFinance, useFinUI } from "@/lib/finance/store";
import { useMe, useUI } from "@/lib/store";
import { FDot, FLabel, FModal, useFT, useInputStyle, useMoney } from "./ui";

/* ================= Tambah transaksi ================= */

const firstCat = (t: TxType) => (t === "tf" ? "" : CAT_DEF[t][0][0]);

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <FLabel>{label}</FLabel>
      {children}
    </label>
  );
}

export function AddTxModal() {
  const { adding, closeAdd } = useFinUI();
  // Form di-mount ulang setiap dibuka → nilai kembali ke awal (nominal & catatan kosong, tanggal hari ini).
  return (
    <FModal open={adding} onClose={closeAdd} title="Tambah transaksi">
      {adding && <AddTxForm onDone={closeAdd} />}
    </FModal>
  );
}

function AddTxForm({ onDone }: { onDone: () => void }) {
  const T = useFT();
  const input = useInputStyle();
  const addTx = useFinance((s) => s.addTx);
  const me = useMe();
  const showToast = useUI((s) => s.showToast);

  const [type, setType] = useState<TxType>("out");
  const [cat, setCat] = useState(firstCat("out"));
  const [acc, setAcc] = useState("kas");
  const [to, setTo] = useState("bca");
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("2026-09-26");

  const amtNum = parseInt(amt || "0", 10);
  const canSubmit = amtNum > 0 && !(type === "tf" && acc === to);
  const border = T.play ? "#e6def0" : "#dfe2e7";
  const field: CSSProperties = { ...input, height: 50, borderRadius: 14 };
  const select: CSSProperties = {
    ...field,
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    paddingRight: 40,
    backgroundImage: `linear-gradient(45deg,transparent 50%,${T.muted} 50%),linear-gradient(135deg,${T.muted} 50%,transparent 50%)`,
    backgroundPosition: "calc(100% - 20px) 22px, calc(100% - 14px) 22px",
    backgroundSize: "6px 6px",
    backgroundRepeat: "no-repeat",
  };

  const submit = () => {
    if (!canSubmit) return;
    addTx({
      type,
      cat: type === "tf" ? "" : cat,
      note: note.trim() || (type === "tf" ? "Transfer" : cat),
      amt: amtNum,
      d: Math.min(30, Math.max(1, parseInt(date.slice(8), 10) || TODAY)),
      by: me?.name || "Kamu",
      acc,
      to: type === "tf" ? to : undefined,
    });
    showToast("Transaksi tersimpan");
    onDone();
  };

  return (
    <form
      className="grid grid-cols-[minmax(0,1fr)] gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div role="tablist" aria-label="Jenis transaksi" className="grid grid-cols-4 gap-1 p-1" style={{ background: T.subtle, borderRadius: 14 }}>
        {TYPES.map(([id, label, c]) => {
          const on = type === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                setType(id);
                setCat(firstCat(id));
              }}
              style={{
                height: 42,
                borderRadius: 10,
                fontFamily: T.body,
                fontWeight: T.bold,
                fontSize: 14,
                background: on ? "#fff" : "transparent",
                color: on ? T.pal[c][2] : T.muted,
                boxShadow: on ? (T.play ? "0 2px 0 rgba(43,29,78,.08)" : "0 1px 2px rgba(16,24,40,.08)") : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <Field label="Nominal">
        <div className="flex items-center gap-2" style={{ border: `1.5px solid ${border}`, borderRadius: 14, padding: "0 14px", height: 56 }}>
          <span style={{ fontWeight: T.bold, fontSize: 18, color: T.muted }}>Rp</span>
          <input
            value={amtNum ? amtNum.toLocaleString("id-ID") : ""}
            onChange={(e) => setAmt(e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12))}
            inputMode="numeric"
            placeholder="0"
            autoFocus
            className="min-w-0 flex-1 bg-transparent outline-none"
            style={{ fontFamily: T.body, fontWeight: T.bold, fontSize: 22, color: T.ink }}
          />
        </div>
      </Field>

      {type !== "tf" && (
        <Field label="Kategori">
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={select}>
            {CAT_DEF[type].map(([n]) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid gap-2.5" style={{ gridTemplateColumns: type === "tf" ? "minmax(0,1fr) minmax(0,1fr)" : "minmax(0,1fr)" }}>
        <Field label={type === "tf" ? "Dari akun" : type === "in" ? "Masuk ke akun" : "Bayar pakai"}>
          <select
            value={acc}
            onChange={(e) => {
              const v = e.target.value;
              setAcc(v);
              if (to === v) setTo(ACCOUNTS.find((a) => a.id !== v)!.id);
            }}
            style={select}
          >
            {ACCOUNTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        {type === "tf" && (
          <Field label="Ke akun">
            <select value={to} onChange={(e) => setTo(e.target.value)} style={select}>
              {ACCOUNTS.filter((a) => a.id !== acc).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <Field label="Tanggal">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value || "2026-09-26")} min="2026-09-01" max="2026-09-30" style={field} />
      </Field>

      <Field
        label={
          <>
            Catatan <span style={{ color: T.faint }}>(opsional)</span>
          </>
        }
      >
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Misal: belanja sayur" style={field} />
      </Field>

      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          height: 54,
          borderRadius: 16,
          marginTop: 4,
          fontFamily: T.body,
          fontWeight: T.bold,
          fontSize: 16,
          cursor: canSubmit ? "pointer" : "default",
          background: canSubmit ? T.ink : T.play ? "#f1ecf7" : "#e6e8ec",
          color: canSubmit ? "#fff" : T.faint,
        }}
      >
        Simpan transaksi
      </button>
    </form>
  );
}

/* ================= Asisten ================= */

type AsItem = Tx & { saved: boolean };
interface AsMsg {
  id: string;
  role: "user" | "ai";
  text: string;
  items?: AsItem[];
}
interface AsState {
  msgs: AsMsg[];
  busy: string | null;
  send: (text: string, by: string) => void;
  scan: (by: string) => void;
  talk: (by: string) => void;
  markSaved: (msgId: string, itemId: string) => void;
}

const LISTEN = "Mendengarkan…";
let asTimer: ReturnType<typeof setTimeout> | undefined;
let talkTimer: ReturnType<typeof setTimeout> | undefined;

/** State percakapan Asisten (bertahan selama sesi, seperti prototype). Dipakai juga oleh tombol scan/mic di Beranda. */
export const useAsisten = create<AsState>()((set, get) => ({
  msgs: [],
  busy: null,
  send: (raw, by) => {
    const text = raw.trim();
    if (!text) return;
    const items = parseTx(text, by).map((t) => ({ ...t, saved: false }));
    set((s) => ({ msgs: [...s.msgs, { id: "u" + Date.now(), role: "user", text }], busy: "Menganalisis…" }));
    clearTimeout(asTimer);
    asTimer = setTimeout(
      () =>
        set((s) => ({
          busy: null,
          msgs: [
            ...s.msgs,
            {
              id: "a" + Date.now(),
              role: "ai",
              text: items.length ? `Aku menemukan ${items.length} transaksi. Cek dulu, lalu simpan.` : "Belum ada nominal yang terbaca. Coba sebut jumlahnya, misal “bensin 100rb”.",
              items,
            },
          ],
        })),
      700,
    );
  },
  // Simulasi scan struk (belum ada OCR sungguhan).
  scan: (by) => {
    set((s) => ({ msgs: [...s.msgs, { id: "u" + Date.now(), role: "user", text: "Foto struk belanja" }], busy: "Memindai struk…" }));
    clearTimeout(asTimer);
    asTimer = setTimeout(
      () =>
        set((s) => ({
          busy: null,
          msgs: [
            ...s.msgs,
            {
              id: "a" + Date.now(),
              role: "ai",
              text: "Struk Indomaret terbaca. Total belanja:",
              items: [{ id: "p" + Date.now(), type: "out", cat: "Belanja", note: "Indomaret — belanja harian", amt: 87500, d: TODAY, by, acc: "gopay", saved: false }],
            },
          ],
        })),
      1400,
    );
  },
  // Simulasi input suara.
  talk: (by) => {
    if (get().busy) return;
    set({ busy: LISTEN });
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => {
      set({ busy: null });
      get().send("Beli kopi 25rb dan makan siang 40rb pakai GoPay", by);
    }, 1500);
  },
  markSaved: (msgId, itemId) =>
    set((s) => ({ msgs: s.msgs.map((m) => (m.id !== msgId ? m : { ...m, items: m.items?.map((it) => (it.id === itemId ? { ...it, saved: true } : it)) })) })),
}));

export function AsistenModal() {
  const T = useFT();
  const { asOpen, closeAsisten } = useFinUI();
  const { msgs, busy, send, scan, talk, markSaved } = useAsisten();
  const addTx = useFinance((s) => s.addTx);
  const showToast = useUI((s) => s.showToast);
  const me = useMe();
  const by = me?.name || "Kamu";
  const [text, setText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = 1e6;
  }, [msgs, busy, asOpen]);

  if (!asOpen) return null;

  const line = T.play ? "#f1ecf7" : "#e6e8ec";
  const bubble: CSSProperties = T.play ? { background: "#fff", boxShadow: "0 3px 0 rgba(43,29,78,.08)" } : { background: "#fff", border: "1px solid #e6e8ec" };
  const outline = T.play ? "#e6def0" : "#dfe2e7";
  const listening = busy === LISTEN;
  const hasText = !!text.trim();
  const softPos = T.play ? "#e3f9ec" : "#e9f2ec";

  const doSend = (t?: string) => {
    send(t ?? text, by);
    if (t === undefined) setText("");
  };
  const save = (msgId: string, it: AsItem) => {
    if (it.saved) return;
    addTx({ type: it.type, cat: it.cat, note: it.note, amt: it.amt, d: it.d, by: it.by, acc: it.acc, to: it.to });
    markSaved(msgId, it.id);
    showToast("Transaksi tersimpan");
  };

  return (
    <div
      className="anim-fade fixed inset-0 z-[80] flex flex-col items-center justify-end pt-10 desk:justify-center desk:p-5"
      style={{ background: T.play ? "rgba(43,29,78,.45)" : "rgba(16,24,40,.45)", backdropFilter: "blur(4px)" }}
      onClick={closeAsisten}
      onKeyDown={(e) => e.key === "Escape" && closeAsisten()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Asisten Keuangan"
        onClick={(e) => e.stopPropagation()}
        className="anim-sheet flex min-h-0 w-full max-w-[520px] flex-1 flex-col overflow-hidden rounded-t-[28px] desk:h-[80vh] desk:flex-none desk:rounded-[28px]"
        style={{ background: T.page, fontFamily: T.body, color: T.ink, boxShadow: "0 30px 80px rgba(16,24,40,.35)" }}
      >
        <div className="flex items-center gap-3 bg-white px-[18px] py-4" style={{ borderBottom: `1.5px solid ${line}` }}>
          <div className="flex size-[42px] items-center justify-center rounded-[14px]" style={{ background: T.ink, color: "#fff" }}>
            <Icon name="auto_awesome" />
          </div>
          <div className="flex-1">
            <div style={{ fontWeight: T.bold, fontSize: 16 }}>Asisten Keuangan</div>
            <div className="flex items-center gap-[5px]" style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: T.pal.green[2] }} aria-live="polite">
              <span className="size-[7px] rounded-full" style={{ background: T.pal.green[1] }} />
              {busy || "Online"}
            </div>
          </div>
          <button onClick={closeAsisten} aria-label="Tutup" className="flex size-11 items-center justify-center rounded-[14px]" style={{ background: T.subtle, color: T.ink }}>
            <Icon name="close" />
          </button>
        </div>

        <div ref={chatRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-[18px] py-4">
          {msgs.length === 0 && !busy && (
            <>
              <div className="flex flex-col gap-2 rounded-[20px] p-4" style={bubble}>
                <div style={{ fontFamily: T.head, fontSize: 19, fontWeight: T.headWeight, lineHeight: 1.1, letterSpacing: T.play ? 0 : "-.02em" }}>Catat tanpa ribet</div>
                <div style={{ fontSize: 14, fontWeight: T.play ? 800 : 600, color: T.ink2, lineHeight: 1.5 }}>
                  Sebut nominal, kategori, dan akun. Contoh: <b>“Makan siang 35rb pakai GoPay”</b>. Bisa beberapa sekaligus, pisahkan dengan koma.
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: T.bold, color: T.muted, textTransform: "uppercase", letterSpacing: ".05em" }}>Coba contoh</div>
              <div className="flex flex-wrap gap-2">
                {AS_EXAMPLES.map((e) => (
                  <button
                    key={e}
                    onClick={() => doSend(e)}
                    className="text-left"
                    style={{ border: `1.5px solid ${outline}`, background: "#fff", borderRadius: 999, padding: "10px 14px", fontFamily: T.body, fontWeight: T.bold, fontSize: 13, color: T.ink }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </>
          )}

          {msgs.map((m) =>
            m.role === "user" ? (
              <div
                key={m.id}
                className="max-w-[82%] self-end"
                style={{ background: T.ink, color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontWeight: T.bold, fontSize: 14, lineHeight: 1.4 }}
              >
                {m.text}
              </div>
            ) : (
              <div key={m.id} className="flex w-[92%] flex-col gap-2 self-start">
                <div style={{ ...bubble, borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontWeight: T.bold, fontSize: 14, lineHeight: 1.4 }}>{m.text}</div>
                {m.items?.map((it) => (
                  <AsItemRow key={it.id} it={it} onSave={() => save(m.id, it)} bubble={bubble} softPos={softPos} />
                ))}
              </div>
            ),
          )}

          {busy && (
            <div className="self-start rounded-[18px] bg-white px-3.5 py-2.5" style={{ fontWeight: T.play ? 800 : 600, fontSize: 13, color: T.muted }}>
              {busy}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 bg-white px-3.5 pt-3 pb-4" style={{ borderTop: `1.5px solid ${line}` }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSend()}
            placeholder="Ketik, bicara, atau scan struk…"
            aria-label="Pesan untuk Asisten"
            className="outline-none"
            style={{ background: T.play ? "#f7f3fb" : "#f3f4f6", borderRadius: 14, padding: 14, fontFamily: T.body, fontWeight: T.bold, fontSize: 15, color: T.ink }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => scan(by)}
              className="flex h-11 items-center gap-1.5 px-3.5"
              style={{ border: `1.5px solid ${outline}`, background: "#fff", borderRadius: 14, fontFamily: T.body, fontWeight: T.play ? 800 : 600, fontSize: 14, color: T.ink }}
            >
              <Icon name="document_scanner" size={20} />
              Scan
            </button>
            <button
              onClick={() => talk(by)}
              aria-pressed={listening}
              className="flex h-11 items-center gap-1.5 px-3.5"
              style={{
                background: listening ? T.pal.green[1] : softPos,
                color: listening ? "#fff" : T.pal.green[2],
                borderRadius: 14,
                fontFamily: T.body,
                fontWeight: T.play ? 800 : 600,
                fontSize: 14,
              }}
            >
              <Icon name="mic" size={20} />
              {listening ? LISTEN : "Bicara"}
            </button>
            <button
              onClick={() => doSend()}
              aria-label="Kirim"
              className="ml-auto flex h-11 w-12 items-center justify-center"
              style={{ borderRadius: 14, background: hasText ? T.ink : T.play ? "#e6def0" : "#dfe2e7", color: "#fff" }}
            >
              <Icon name="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AsItemRow({ it, onSave, bubble, softPos }: { it: AsItem; onSave: () => void; bubble: CSSProperties; softPos: string }) {
  const T = useFT();
  const { m } = useMoney();
  const k = catInfo(it.type, it.cat);
  const date = `${it.d} Sep`;
  const sub = it.type === "tf" ? `${accName(it.acc)} → ${accName(it.to)} · ${date}` : `${it.cat} · ${accName(it.acc)} · ${date}`;
  const amount = it.type === "tf" ? m(it.amt) : (it.type === "in" ? "+ " : "− ") + m(it.amt);
  const color = it.type === "in" ? T.pos : it.type === "tf" ? T.ink : T.neg;
  return (
    <div className="flex items-center gap-2.5 rounded-[18px] p-3" style={bubble}>
      <FDot c={k.c} icon={k.icon} size={40} />
      <div className="min-w-0 flex-1">
        <div className="truncate" style={{ fontWeight: T.bold, fontSize: 14 }}>
          {it.note}
        </div>
        <div className="truncate" style={{ fontSize: 12, fontWeight: T.bold, color: T.muted }}>
          {sub}
        </div>
        <div style={{ fontWeight: T.bold, fontSize: 14, color, whiteSpace: "nowrap" }}>{amount}</div>
      </div>
      <button
        onClick={onSave}
        disabled={it.saved}
        className="shrink-0"
        style={{
          height: 40,
          padding: "0 14px",
          borderRadius: 12,
          fontFamily: T.body,
          fontWeight: T.bold,
          fontSize: 13,
          cursor: it.saved ? "default" : "pointer",
          background: it.saved ? softPos : T.pal.green[1],
          color: it.saved ? T.pal.green[2] : "#fff",
        }}
      >
        {it.saved ? "Tersimpan" : "Simpan"}
      </button>
    </div>
  );
}
