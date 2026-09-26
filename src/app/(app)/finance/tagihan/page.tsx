"use client";

import { useEffect, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import {
  FBar,
  FBtn,
  FCard,
  FDot,
  FEmpty,
  FLabel,
  FModal,
  PageHead,
  gridCards,
  useFT,
  useInputStyle,
  useMoney,
} from "@/components/finance/ui";
import { docUrl } from "@/lib/supabase/finance";
import { ACCOUNTS, CIC_KINDS, TODAY, accName, addMonths, totalIn, type Bill, type DocFile, type Installment } from "@/lib/finance/data";
import { useFinance } from "@/lib/finance/store";
import { useMe, useUI } from "@/lib/store";

type BillTab = "rutin" | "cicilan";
const TABS: [BillTab, string][] = [
  ["rutin", "Tagihan rutin"],
  ["cicilan", "Cicilan & angsuran"],
];

/** Batas upload: kontrak disimpan sebagai data URL di localStorage (kuota ±5 MB). */
const MAX_FILE = 10 * 1024 * 1024; // sama dengan batas bucket Storage "documents"
const TOO_BIG = "Filenya kegedean (maks 10 MB). Coba kompres PDF-nya atau foto ulang ya.";

const fileSize = (n: number) =>
  n > 1048576 ? (n / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";

/** Baca file jadi DocFile (data URL). */
function readDoc(f: File): Promise<DocFile> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () =>
      resolve({
        name: f.name,
        size: fileSize(f.size),
        url: typeof r.result === "string" ? r.result : null,
        type: /pdf/.test(f.type) ? "pdf" : /image/.test(f.type) ? "img" : "other",
      });
    r.onerror = () => reject(r.error);
    r.readAsDataURL(f);
  });
}

/** Handler input file: cek ukuran, baca, lalu panggil `done`. */
function usePickDoc() {
  const toast = useUI((st) => st.showToast);
  return (e: ChangeEvent<HTMLInputElement>, done: (d: DocFile) => void) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > MAX_FILE) {
      toast(TOO_BIG);
      return;
    }
    readDoc(f)
      .then(done)
      .catch(() => toast("Gagal membaca file, coba lagi ya"));
  };
}

/** Hari jatuh tempo berikutnya relatif ke 1 Sep (tgl < hari ini → bulan depan). */
const nextDay = (c: Installment) => (c.due >= TODAY ? c.due : c.due + 30);
const dueLbl = (c: Installment) => (c.due >= TODAY ? `${c.due} Sep` : `${c.due} Okt`);

export default function TagihanPage() {
  const T = useFT();
  const { m } = useMoney();
  const bills = useFinance((st) => st.bills);
  const cic = useFinance((st) => st.cic);
  const tx = useFinance((st) => st.tx);
  const [tab, setTab] = useState<BillTab>("rutin");
  const [paying, setPaying] = useState<Bill | null>(null);
  const [cicOpen, setCicOpen] = useState(false);
  const [doc, setDoc] = useState<DocFile | null>(null);
  const toastDoc = useUI((st) => st.showToast);
  // Dokumen di Supabase Storage dibuka lewat tautan sementara (berlaku 1 jam).
  const openDoc = (d: DocFile) => {
    if (d.url || !d.path) return setDoc(d);
    docUrl(d.path)
      .then((url) => setDoc({ ...d, url }))
      .catch(() => toastDoc("Dokumen belum bisa dibuka. Coba lagi, ya."));
  };

  const w2 = T.play ? 800 : 600;
  const unpaid = bills.filter((b) => !b.paid).sort((a, b) => a.day - b.day);
  const paid = bills.filter((b) => b.paid).sort((a, b) => b.day - a.day);

  const active = cic.filter((c) => c.paid < c.tenor);
  const monthly = active.reduce((a, c) => a + c.amt, 0);
  const remain = cic.reduce((a, c) => a + (c.tenor - c.paid) * c.amt, 0);
  const nx = [...active].sort((x, y) => nextDay(x) - nextDay(y))[0];
  const inc = totalIn(tx);

  return (
    <>
      <PageHead
        title="Tagihan & Cicilan"
        sub="Rutin bulanan, angsuran, dan jatuh tempo"
        right={
          <FBtn
            icon="add"
            onClick={() => {
              setTab("cicilan");
              setCicOpen(true);
            }}
          >
            Cicilan
          </FBtn>
        }
      />

      <div
        role="tablist"
        aria-label="Jenis tagihan"
        className="grid max-w-[480px] grid-cols-2 gap-1 p-1"
        style={{ background: T.subtle, borderRadius: 14 }}
      >
        {TABS.map(([id, label]) => {
          const on = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(id)}
              style={{
                height: 42,
                borderRadius: 9,
                fontFamily: T.body,
                fontWeight: T.bold,
                fontSize: 14,
                background: on ? "#fff" : "transparent",
                color: on ? T.ink : T.muted,
                boxShadow: on ? (T.play ? "0 2px 0 rgba(43,29,78,.08)" : "0 1px 2px rgba(16,24,40,.08)") : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "rutin" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["Belum dibayar", unpaid, "red"],
                ["Sudah lunas", paid, "green"],
              ] as const
            ).map(([label, list, c]) => (
              <div
                key={label}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 16,
                  border: `1px solid ${T.line}`,
                  borderTop: `3px solid ${T.pal[c][1]}`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: w2, color: T.muted }}>{label}</div>
                <div style={{ fontWeight: T.bold, fontSize: 18, whiteSpace: "nowrap" }}>{m(list.reduce((a, b) => a + b.amt, 0))}</div>
                <div style={{ fontSize: 12, fontWeight: w2, color: T.pal[c][2] }}>{list.length} tagihan</div>
              </div>
            ))}
          </div>
          <div className={gridCards}>
            {[...unpaid, ...paid].map((b) => {
              const left = b.day - TODAY;
              const soon = !b.paid && left <= 3;
              return (
                <FCard key={b.id} pad={0} className="flex items-center gap-3" style={{ borderRadius: 20, padding: "14px 16px" }}>
                  <FDot c={b.c} icon={b.icon} size={40} />
                  <div className="min-w-0 flex-1">
                    <div style={{ fontWeight: T.bold, fontSize: 15 }}>{b.name}</div>
                    <div style={{ fontSize: 12, fontWeight: w2, color: b.paid ? T.pos : soon ? T.neg : T.muted }}>
                      {b.paid ? `Lunas · ${b.due}` : `${left <= 0 ? "Hari ini" : `${left} hari lagi`} · ${b.due}`}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div style={{ fontWeight: T.bold, fontSize: 14, whiteSpace: "nowrap" }}>{m(b.amt)}</div>
                    <button
                      onClick={() => !b.paid && setPaying(b)}
                      disabled={b.paid}
                      aria-label={b.paid ? `${b.name} sudah lunas` : `Bayar ${b.name}`}
                      style={{
                        height: 36,
                        padding: "0 14px",
                        borderRadius: 12,
                        fontFamily: T.body,
                        fontWeight: T.bold,
                        fontSize: 13,
                        cursor: b.paid ? "default" : "pointer",
                        background: b.paid ? (T.play ? "#e3f9ec" : "#e9f2ec") : T.ink,
                        color: b.paid ? T.pos : "#fff",
                      }}
                    >
                      {b.paid ? "Lunas ✓" : "Bayar"}
                    </button>
                  </div>
                </FCard>
              );
            })}
          </div>
          {bills.length === 0 && <FEmpty icon="receipt">Belum ada tagihan rutin.</FEmpty>}
        </>
      ) : (
        <>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 overflow-hidden text-white"
            style={{ borderRadius: 22, padding: 20, background: T.hero }}
          >
            <HeroStat
              label="Total cicilan per bulan"
              big
              value={m(monthly)}
              note={`${active.length} cicilan aktif`}
              noteColor={T.play ? "#ffe46b" : "#ffc42e"}
            />
            <HeroStat
              label="Sisa kewajiban"
              value={m(remain)}
              note={inc ? `${Math.round((monthly / inc) * 100)}% dari pemasukan bulanan` : ""}
            />
            <HeroStat label="Jatuh tempo terdekat" value={nx ? dueLbl(nx) : "-"} note={nx ? `${nx.name} · ${m(nx.amt)}` : "Tidak ada"} />
          </div>
          {cic.length === 0 ? (
            <FEmpty icon="receipt_long">Belum ada cicilan. Tambahkan lewat tombol “+ Cicilan”.</FEmpty>
          ) : (
            <div className={gridCards}>
              {cic.map((c) => (
                <CicCard key={c.id} c={c} onView={openDoc} />
              ))}
            </div>
          )}
        </>
      )}

      <PayBillModal bill={paying} onClose={() => setPaying(null)} />
      <CicForm open={cicOpen} onClose={() => setCicOpen(false)} />
      {doc && <DocViewer key={doc.name + (doc.url?.length ?? 0)} doc={doc} onClose={() => setDoc(null)} />}
    </>
  );
}

function HeroStat({
  label,
  value,
  note,
  noteColor,
  big,
}: {
  label: string;
  value: string;
  note: string;
  noteColor?: string;
  big?: boolean;
}) {
  const T = useFT();
  const w2 = T.play ? 800 : 600;
  return (
    <div className="min-w-0">
      <div style={{ fontSize: 13, fontWeight: w2, opacity: 0.75 }}>{label}</div>
      <div
        style={
          big
            ? {
                fontFamily: T.head,
                fontSize: 24,
                fontWeight: T.headWeight,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
                letterSpacing: T.play ? 0 : "-.02em",
              }
            : { fontWeight: T.bold, fontSize: 18, lineHeight: 1.3 }
        }
      >
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: w2, ...(noteColor ? { color: noteColor } : { opacity: 0.75 }) }}>{note}</div>
    </div>
  );
}

/* ---------------- Kartu cicilan ---------------- */

function CicCard({ c, onView }: { c: Installment; onView: (d: DocFile) => void }) {
  const T = useFT();
  const { m, s } = useMoney();
  const me = useMe();
  const payCic = useFinance((st) => st.payCic);
  const updateCic = useFinance((st) => st.updateCic);
  const removeCic = useFinance((st) => st.removeCic);
  const toast = useUI((st) => st.showToast);
  const pick = usePickDoc();

  const w2 = T.play ? 800 : 600;
  const sub2 = T.play ? "#6b5d80" : "#4b5563";
  const k = CIC_KINDS.find((x) => x[0] === c.kind) ?? CIC_KINDS[7];
  const p = c.tenor ? c.paid / c.tenor : 1;
  const done = c.paid >= c.tenor;
  const soon = !done && nextDay(c) - TODAY <= 3;

  const upload = (e: ChangeEvent<HTMLInputElement>) =>
    pick(e, (file) => {
      updateCic(c.id, { file });
      toast("Kontrak terunggah");
    });
  const pay = () => {
    if (done) return;
    payCic(c.id, me?.name ?? "Kamu");
    toast(c.paid + 1 >= c.tenor ? `${c.name} lunas!` : `Cicilan ke-${c.paid + 1} dicatat`);
  };
  const remove = () => {
    if (!window.confirm(`Hapus cicilan “${c.name}”?`)) return;
    removeCic(c.id);
    toast(`${c.name} dihapus`);
  };

  const box: CSSProperties = { background: T.soft, borderRadius: 12, padding: 10, minWidth: 0 };
  const boxLabel: CSSProperties = { fontSize: 11, fontWeight: w2, color: T.muted };

  return (
    <FCard className="flex flex-col gap-3.5" style={{ borderRadius: 20 }}>
      <div className="flex items-center gap-3">
        <FDot c={k[2]} icon={k[1]} size={44} />
        <div className="min-w-0 flex-1">
          <div className="truncate" style={{ fontWeight: T.bold, fontSize: 16 }}>
            {c.name}
          </div>
          <div className="truncate" style={{ fontSize: 12, fontWeight: w2, color: T.muted }}>
            {c.kind} · {c.lender} · {accName(c.acc)}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div style={{ fontWeight: T.bold, fontSize: 16, whiteSpace: "nowrap" }}>{m(c.amt)}</div>
          <div style={{ fontSize: 11, fontWeight: w2, color: T.muted }}>per bulan</div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between" style={{ fontSize: 12, fontWeight: w2, color: sub2 }}>
          <span>
            {c.paid} dari {c.tenor} bulan terbayar
          </span>
          <span>{Math.round(p * 100)}%</span>
        </div>
        <FBar pct={p * 100} height={8} color={done ? T.pal.green[1] : T.ink} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div style={box}>
          <div style={boxLabel}>Sisa</div>
          <div className="truncate" style={{ fontWeight: T.bold, fontSize: 13 }}>
            {done ? "Lunas" : s((c.tenor - c.paid) * c.amt)}
          </div>
        </div>
        <div style={box}>
          <div style={boxLabel}>Lunas</div>
          <div style={{ fontWeight: T.bold, fontSize: 13 }}>{addMonths(c.start, c.tenor - 1)}</div>
        </div>
        <div style={box}>
          <div style={boxLabel}>Jatuh tempo</div>
          <div style={{ fontWeight: T.bold, fontSize: 13, color: soon ? T.neg : T.ink }}>{done ? "—" : dueLbl(c)}</div>
        </div>
      </div>

      {c.file ? (
        <div className="flex items-center gap-2.5" style={{ border: `1px solid ${T.line}`, borderRadius: 14, padding: "10px 12px" }}>
          <Icon name={c.file.type === "img" ? "image" : "picture_as_pdf"} size={24} style={{ color: T.pal.red[1] }} />
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ fontWeight: w2, fontSize: 13 }}>
              {c.file.name}
            </div>
            <div style={{ fontSize: 11, fontWeight: T.play ? 700 : 500, color: T.muted }}>Kontrak · {c.file.size}</div>
          </div>
          <button
            onClick={() => c.file && onView(c.file)}
            aria-label={`Lihat kontrak ${c.name}`}
            style={{
              height: 36,
              padding: "0 12px",
              borderRadius: 10,
              background: T.subtle,
              color: T.ink,
              fontFamily: T.body,
              fontWeight: w2,
              fontSize: 13,
            }}
          >
            Lihat
          </button>
          <label
            className="flex cursor-pointer items-center focus-within:outline-2"
            style={{
              height: 36,
              padding: "0 10px",
              borderRadius: 10,
              color: T.accent,
              fontFamily: T.body,
              fontWeight: w2,
              fontSize: 13,
              outlineColor: T.accent,
            }}
          >
            Ganti
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={upload}
              className="sr-only"
              aria-label={`Ganti kontrak ${c.name}`}
            />
          </label>
        </div>
      ) : (
        <UploadBox
          onChange={upload}
          ariaLabel={`Upload kontrak ${c.name}`}
          style={{ height: 48, justifyContent: "center", borderRadius: 14 }}
        >
          <Icon name="upload_file" size={20} />
          Upload kontrak (PDF/foto)
        </UploadBox>
      )}

      <div className="flex gap-2">
        <button
          onClick={pay}
          disabled={done}
          className="flex-1"
          style={{
            height: 46,
            borderRadius: 12,
            fontFamily: T.body,
            fontWeight: T.bold,
            fontSize: 14,
            cursor: done ? "default" : "pointer",
            background: done ? (T.play ? "#e3f9ec" : "#e9f2ec") : T.ink,
            color: done ? T.pos : "#fff",
          }}
        >
          {done ? "Sudah lunas ✓" : `Bayar cicilan ke-${c.paid + 1}`}
        </button>
        <button
          onClick={remove}
          aria-label={`Hapus ${c.name}`}
          title="Hapus"
          className="flex shrink-0 items-center justify-center"
          style={{ width: 48, height: 46, borderRadius: 12, border: `1px solid ${T.line}`, background: "#fff", color: T.neg }}
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </FCard>
  );
}

/** Kotak upload putus-putus (label + input file tersembunyi tapi tetap bisa difokus). */
function UploadBox({
  children,
  onChange,
  ariaLabel,
  style,
}: {
  children: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  style?: CSSProperties;
}) {
  const T = useFT();
  return (
    <label
      className="flex cursor-pointer items-center gap-2 focus-within:outline-2"
      style={{
        border: `1.5px dashed ${T.play ? "#d0c6dc" : "#c4c8cf"}`,
        background: T.play ? "#fff8ee" : "#fafbfc",
        color: T.play ? "#6b5d80" : "#4b5563",
        fontFamily: T.body,
        fontWeight: T.play ? 800 : 600,
        fontSize: 13,
        outlineColor: T.accent,
        ...style,
      }}
    >
      {children}
      <input type="file" accept="application/pdf,image/*" onChange={onChange} className="sr-only" aria-label={ariaLabel} />
    </label>
  );
}

/* ---------------- Bayar tagihan rutin ---------------- */

function PayBillModal({ bill, onClose }: { bill: Bill | null; onClose: () => void }) {
  const T = useFT();
  const { m } = useMoney();
  const me = useMe();
  const payBill = useFinance((st) => st.payBill);
  const toast = useUI((st) => st.showToast);
  const inputStyle = useInputStyle();
  const [acc, setAcc] = useState("bca");

  const pay = () => {
    if (!bill) return;
    payBill(bill.id, acc, me?.name ?? "Kamu");
    toast(`${bill.name} ditandai lunas`);
    onClose();
  };

  return (
    <FModal open={!!bill} onClose={onClose} title="Bayar tagihan" width={420}>
      {bill && (
        <>
          <div className="flex items-center gap-3" style={{ background: T.soft, borderRadius: 16, padding: 14 }}>
            <FDot c={bill.c} icon={bill.icon} size={44} />
            <div className="min-w-0 flex-1">
              <div style={{ fontWeight: T.bold, fontSize: 15 }}>{bill.name}</div>
              <div style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: T.muted }}>Jatuh tempo {bill.due}</div>
            </div>
            <div style={{ fontWeight: T.bold, fontSize: 16, whiteSpace: "nowrap" }}>{m(bill.amt)}</div>
          </div>
          <label className="flex flex-col gap-1.5">
            <FLabel>Bayar dari akun</FLabel>
            <select value={acc} onChange={(e) => setAcc(e.target.value)} style={inputStyle}>
              {ACCOUNTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <div style={{ fontSize: 12, fontWeight: T.play ? 800 : 600, color: T.muted }}>
            Otomatis tercatat sebagai pengeluaran hari ini.
          </div>
          <FBtn onClick={pay} style={{ height: 52 }}>
            Bayar {m(bill.amt)}
          </FBtn>
        </>
      )}
    </FModal>
  );
}

/* ---------------- Form tambah cicilan ---------------- */

type CicF = {
  name: string;
  kind: string;
  lender: string;
  amt: string;
  tenor: string;
  paid: string;
  start: string;
  due: string;
  acc: string;
  file: DocFile | null;
};
const CF0: CicF = {
  name: "",
  kind: "Kendaraan",
  lender: "",
  amt: "",
  tenor: "12",
  paid: "0",
  start: "2026-09",
  due: "5",
  acc: "bca",
  file: null,
};

function CicForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [seq, setSeq] = useState(0);
  const close = () => {
    onClose();
    setSeq((n) => n + 1); // form kosong lagi di pembukaan berikutnya
  };
  return (
    <FModal open={open} onClose={close} title="Tambah cicilan" width={560}>
      <CicFormBody key={seq} onDone={close} />
    </FModal>
  );
}

function CicFormBody({ onDone }: { onDone: () => void }) {
  const T = useFT();
  const { m } = useMoney();
  const addCic = useFinance((st) => st.addCic);
  const toast = useUI((st) => st.showToast);
  const inputStyle = useInputStyle();
  const pick = usePickDoc();
  const [cf, setCf] = useState<CicF>(CF0);
  const set = (patch: Partial<CicF>) => setCf((f) => ({ ...f, ...patch }));

  const w2 = T.play ? 800 : 600;
  const cAmt = parseInt(cf.amt || "0", 10);
  const cTen = parseInt(cf.tenor || "0", 10);
  const cPaid = Math.min(parseInt(cf.paid || "0", 10), cTen);
  const ok = !!cf.name.trim() && cAmt > 0 && cTen > 0;

  const summary: [string, string][] = [
    ["Total kewajiban", cAmt && cTen ? m(cAmt * cTen) : "—"],
    ["Sisa kewajiban", cAmt && cTen ? m(cAmt * (cTen - cPaid)) : "—"],
    ["Perkiraan lunas", cTen ? addMonths(cf.start || "2026-09", cTen - 1) : "—"],
    ["Sisa bulan", cTen ? `${cTen - cPaid} bulan` : "—"],
  ];

  const save = () => {
    if (!ok) return;
    addCic({
      name: cf.name.trim(),
      kind: cf.kind,
      lender: cf.lender.trim() || "-",
      amt: cAmt,
      tenor: cTen,
      paid: cPaid,
      start: cf.start || "2026-09",
      due: parseInt(cf.due, 10),
      acc: cf.acc,
      file: cf.file,
    });
    toast("Cicilan ditambahkan");
    onDone();
  };

  const field = (label: string, el: ReactNode) => (
    <label className="flex min-w-0 flex-col gap-1.5">
      <FLabel>{label}</FLabel>
      {el}
    </label>
  );

  return (
    <>
      {field(
        "Nama cicilan",
        <input
          value={cf.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Misal: Kredit Motor"
          style={inputStyle}
          autoFocus
        />,
      )}
      <div className="grid grid-cols-2 gap-2.5">
        {field(
          "Jenis",
          <select value={cf.kind} onChange={(e) => set({ kind: e.target.value })} style={inputStyle}>
            {CIC_KINDS.map(([k]) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>,
        )}
        {field(
          "Lembaga / pemberi",
          <input value={cf.lender} onChange={(e) => set({ lender: e.target.value })} placeholder="Misal: Adira" style={inputStyle} />,
        )}
      </div>
      {field(
        "Cicilan per bulan",
        <div className="flex items-center gap-2" style={{ ...inputStyle, height: 52 }}>
          <span style={{ fontWeight: T.bold, color: T.muted }}>Rp</span>
          <input
            value={cAmt ? cAmt.toLocaleString("id-ID") : ""}
            onChange={(e) => set({ amt: e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12) })}
            inputMode="numeric"
            placeholder="0"
            className="min-w-0 flex-1 bg-transparent outline-none"
            style={{ fontFamily: T.body, fontWeight: T.bold, fontSize: 20, color: T.ink }}
          />
        </div>,
      )}
      <div className="grid grid-cols-2 gap-2.5">
        {field(
          "Tenor (bulan)",
          <input
            value={cf.tenor}
            onChange={(e) => set({ tenor: e.target.value.replace(/\D/g, "").slice(0, 3) })}
            inputMode="numeric"
            placeholder="12"
            style={inputStyle}
          />,
        )}
        {field(
          "Sudah dibayar (bulan)",
          <input
            value={cf.paid}
            onChange={(e) => set({ paid: e.target.value.replace(/\D/g, "").slice(0, 3) })}
            inputMode="numeric"
            placeholder="0"
            style={inputStyle}
          />,
        )}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {field(
          "Mulai cicilan",
          <input type="month" value={cf.start} onChange={(e) => set({ start: e.target.value || "2026-09" })} style={inputStyle} />,
        )}
        {field(
          "Jatuh tempo tiap tgl",
          <select value={cf.due} onChange={(e) => set({ due: e.target.value })} style={inputStyle}>
            {Array.from({ length: 28 }, (_, i) => String(i + 1)).map((d) => (
              <option key={d} value={d}>
                Tanggal {d}
              </option>
            ))}
          </select>,
        )}
      </div>
      {field(
        "Bayar dari akun",
        <select value={cf.acc} onChange={(e) => set({ acc: e.target.value })} style={inputStyle}>
          {ACCOUNTS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>,
      )}
      <div className="flex flex-col gap-1.5">
        <FLabel>
          Kontrak / perjanjian <span style={{ color: T.faint, fontWeight: T.play ? 700 : 500 }}>(opsional)</span>
        </FLabel>
        <UploadBox
          onChange={(e) => pick(e, (file) => set({ file }))}
          ariaLabel="Upload kontrak cicilan (PDF atau foto, maks 2 MB)"
          style={{ minHeight: 52, padding: "8px 14px", borderRadius: 12, gap: 10, fontSize: 14 }}
        >
          <Icon name={cf.file ? "task" : "upload_file"} size={22} />
          <span className="min-w-0 flex-1 truncate" style={{ color: T.ink2 }}>
            {cf.file ? `${cf.file.name} · ${cf.file.size}` : "Upload PDF atau foto kontrak"}
          </span>
          <span style={{ color: T.accent, fontSize: 13 }}>Pilih file</span>
        </UploadBox>
        <div style={{ fontSize: 11, fontWeight: T.play ? 700 : 500, color: T.faint }}>Maks 2 MB · disimpan di perangkat ini</div>
      </div>
      <div
        className="grid grid-cols-2 gap-2.5"
        style={{
          background: T.play ? "#fff4d6" : "#fff8e1",
          border: `1px solid ${T.play ? "#ffe08a" : "#ffe7a3"}`,
          borderRadius: 14,
          padding: "12px 14px",
        }}
      >
        {summary.map(([label, value]) => (
          <div key={label}>
            <div style={{ fontSize: 11, fontWeight: w2, color: T.play ? "#8a6a00" : "#6b5b24" }}>{label}</div>
            <div style={{ fontWeight: T.bold, fontSize: 14 }}>{value}</div>
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={!ok}
        style={{
          height: 52,
          borderRadius: 14,
          fontFamily: T.body,
          fontWeight: T.bold,
          fontSize: 15,
          cursor: ok ? "pointer" : "default",
          background: ok ? T.ink : T.play ? "#f1ecf7" : "#e6e8ec",
          color: ok ? "#fff" : T.faint,
        }}
      >
        Simpan cicilan
      </button>
    </>
  );
}

/* ---------------- Penampil dokumen ---------------- */

function DocViewer({ doc, onClose }: { doc: DocFile; onClose: () => void }) {
  const T = useFT();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const isFrame = doc.type === "pdf" || doc.type === "other";

  // Chrome menolak menampilkan PDF dari data URL di iframe → ubah jadi blob URL.
  useEffect(() => {
    if (!isFrame || !doc.url) return;
    let url: string | null = null;
    let alive = true;
    fetch(doc.url)
      .then((r) => r.blob())
      .then((b) => {
        if (!alive) return;
        url = URL.createObjectURL(b);
        setBlobUrl(url);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [doc.url, isFrame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const placeholder = (text: ReactNode) => (
    <div
      style={{ padding: "48px 24px", textAlign: "center", color: T.muted, fontWeight: T.play ? 800 : 600, fontSize: 14, lineHeight: 1.5 }}
    >
      {text}
    </div>
  );

  return (
    <div
      className="anim-fade fixed inset-0 z-[90] flex items-center justify-center p-5"
      style={{ background: T.play ? "rgba(43,29,78,.6)" : "rgba(16,24,40,.6)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Kontrak ${doc.name}`}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden bg-white"
        style={{ borderRadius: 20, fontFamily: T.body, color: T.ink }}
      >
        <div className="flex items-center gap-2.5" style={{ padding: "14px 16px", borderBottom: `1px solid ${T.line}` }}>
          <Icon name="description" size={22} style={{ color: T.pal.red[1] }} />
          <div className="min-w-0 flex-1 truncate" style={{ fontWeight: T.bold, fontSize: 14 }}>
            {doc.name}
          </div>
          {doc.url && (
            <a
              href={blobUrl ?? doc.url}
              download={doc.name}
              aria-label={`Unduh ${doc.name}`}
              title="Unduh"
              className="flex size-9 items-center justify-center"
              style={{ borderRadius: 10, background: T.subtle, color: T.ink }}
            >
              <Icon name="download" size={20} />
            </a>
          )}
          <button
            onClick={onClose}
            aria-label="Tutup"
            autoFocus
            className="flex size-9 items-center justify-center"
            style={{ borderRadius: 10, background: T.subtle, color: T.ink }}
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto" style={{ background: T.soft }}>
          {doc.type === "demo" || !doc.url ? (
            placeholder(
              <>
                Ini file contoh, jadi pratinjaunya belum ada.
                <br />
                Upload kontrak asli lewat tombol “Ganti”.
              </>,
            )
          ) : doc.type === "img" ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL lokal, bukan aset yang dioptimasi
            <img src={doc.url} alt={`Kontrak ${doc.name}`} className="block h-[70vh] w-full object-contain" />
          ) : blobUrl ? (
            <iframe src={blobUrl} title={`Kontrak ${doc.name}`} className="block h-[70vh] w-full border-0" />
          ) : (
            placeholder("Membuka dokumen…")
          )}
        </div>
      </div>
    </div>
  );
}
