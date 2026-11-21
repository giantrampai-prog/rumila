import type { ReactNode } from "react";
import { GEDUNG } from "@/lib/kampus";

// Gedung kampus (Laboratorium 3D, Lab Komputer, Taman Bermain, Musala) dibuat statis saat build.
export const dynamicParams = false;
export function generateStaticParams() {
  return GEDUNG.map((g) => ({ gedung: g.id }));
}

export default function GedungLayout({ children }: { children: ReactNode }) {
  return children;
}
