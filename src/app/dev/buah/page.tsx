"use client";

// Pratinjau KHUSUS DEVELOPMENT Kebun Buah versi anak tanpa akun. Di produksi halaman ini 404.
import { notFound } from "next/navigation";
import KidFruits from "@/components/fruits/kid-fruits";

export default function DevBuah() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <KidFruits />;
}
