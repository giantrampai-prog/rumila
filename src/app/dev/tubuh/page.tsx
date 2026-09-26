"use client";

// Pratinjau KHUSUS DEVELOPMENT modul Jelajah Tubuh tanpa login (untuk menguji tampilan 3D). Di produksi 404.
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Explorer } from "@/components/anatomy/explorer";
import { KidBody } from "@/components/anatomy/kid-body";
import { validateManifest } from "@/lib/anatomy/state";
import type { Manifest } from "@/lib/anatomy/types";
import "@/components/anatomy/anatomy.css";

export default function DevTubuh() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  useEffect(() => {
    fetch("/anatomy/manifest.json")
      .then((r) => r.json())
      .then((m: Manifest) => {
        if (!validateManifest(m).length) setManifest(m);
      });
  }, []);
  if (process.env.NODE_ENV !== "development") notFound();
  if (!manifest) return <p style={{ padding: 24 }}>Memuat katalog…</p>;
  // Default: tampilan anak (sama dengan aplikasi). ?lengkap=1 untuk Explorer lengkap.
  if (new URLSearchParams(location.search).get("lengkap")) return <Explorer manifest={manifest} memberId="dev-preview" />;
  return <KidBody manifest={manifest} memberId="dev-preview" />;
}
