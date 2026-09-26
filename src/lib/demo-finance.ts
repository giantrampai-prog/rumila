import type { ColorKey } from "./catalog";

// Data demo ringkasan Finance (fase 1). Diganti tabel account/transaction/bill di fase Finance.

export const FIN_SUMMARY = {
  totalBalance: 32_397_000,
  accountCount: 7,
  monthLabel: "Sep",
  income: 18_500_000,
  expense: 13_000_000,
};

export const FIN_DUES: { name: string; icon: string; c: ColorKey; dueDate: string; note?: string; amount: number }[] = [
  { name: "BPJS Kesehatan", icon: "health_and_safety", c: "green", dueDate: "2026-09-28", amount: 510_000 },
  { name: "Asuransi Mobil", icon: "directions_car", c: "blue", dueDate: "2026-09-30", amount: 420_000 },
  { name: "Cicilan Mobil", icon: "receipt_long", c: "indigo", dueDate: "2026-10-15", note: "ke-21 dari 48", amount: 4_200_000 },
];

export const FIN_TXS: { name: string; icon: string; c: ColorKey; meta: string; amount: number }[] = [
  { name: "Makan siang kantor", icon: "restaurant", c: "red", meta: "GoPay · Ayah · hari ini", amount: -45_000 },
  { name: "Gaji Ayah", icon: "work", c: "green", meta: "BCA · 25 Sep", amount: 12_000_000 },
  { name: "Belanja bulanan", icon: "shopping_cart", c: "orange", meta: "Mandiri · Ibu · 24 Sep", amount: -1_850_000 },
  { name: "Uang saku anak", icon: "child_care", c: "pink", meta: "Kas · 22 Sep", amount: -600_000 },
];

export const FIN_ACTIONS: { icon: string; label: string; c: ColorKey }[] = [
  { icon: "add_card", label: "Catat", c: "gold" },
  { icon: "donut_small", label: "Budget", c: "orange" },
  { icon: "receipt_long", label: "Cicilan", c: "indigo" },
  { icon: "account_balance", label: "Akun", c: "teal" },
];
