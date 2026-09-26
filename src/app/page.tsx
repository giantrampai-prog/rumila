import { redirect } from "next/navigation";

// Fase 1: langsung ke aplikasi. Landing page (Rumila Website) menyusul di route ini.
export default function Home() {
  redirect("/beranda");
}
