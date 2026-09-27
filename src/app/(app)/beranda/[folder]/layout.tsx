import type { ReactNode } from "react";
import { FOLDERS } from "@/lib/catalog";

// Semua folder dibuat statis saat build (disajikan dari CDN, tanpa render server tiap kunjungan).
export const dynamicParams = false;
export function generateStaticParams() {
  return FOLDERS.map((f) => ({ folder: f.id }));
}

export default function FolderLayout({ children }: { children: ReactNode }) {
  return children;
}
