"use client";

// Pratinjau KHUSUS DEVELOPMENT: layar pilih profil, PIN pad, tab Anggota, dan pemilih avatar dengan data demo.
// ?p=pilih | pin | gambar | anggota | avatar. Di produksi halaman ini 404.

import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PilihAvatar } from "@/components/avatar-karakter";
import { AnggotaRumah } from "@/components/ortu/anggota";
import { MasukPin } from "@/components/pin-pad";
import { SheetHost } from "@/components/sheets";
import { PilihProfil } from "@/app/masuk/pilih-profil";
import type { Member } from "@/lib/store";

const DEMO: Member[] = [
  { id: "d-agam", name: "Agam", c: "orange", admin: false, perms: [], pin: "1234", avatar: "k1-r1-w0-a0", peran: "anak", jenisPin: "angka" },
  { id: "d-mecca", name: "Mecca", c: "pink", admin: false, perms: [], pin: "1234", avatar: "k1-r4-w0-a0", peran: "anak", jenisPin: "gambar" },
  { id: "d-raka", name: "Raka", c: "teal", admin: false, perms: [], avatar: "k3-r6-w0-a1", peran: "anak" },
  { id: "d-ayah", name: "Ayah", c: "indigo", admin: true, perms: [], pin: "1234", avatar: "k2-r5-w0-a0", peran: "dewasa" },
  { id: "d-ibu", name: "Ibu", c: "blue", admin: false, perms: [], pin: "1234", avatar: "k1-r4-w2-a0", peran: "dewasa" },
];

function Preview() {
  const p = useSearchParams().get("p") ?? "pilih";
  return (
    <div className="bg-dots flex min-h-dvh items-center justify-center p-6" style={{ fontFamily: "var(--ff-nunito)" }}>
      {p === "pilih" && <PilihProfil members={DEMO} onMasuk={() => {}} />}
      {p === "pin" && <MasukPin m={DEMO[0]} judul="Halo Agam, ketik PIN-mu" onBenar={() => {}} />}
      {p === "gambar" && <MasukPin m={DEMO[1]} judul="Halo Mecca, ketuk gambar rahasiamu" onBenar={() => {}} />}
      {p === "avatar" && (
        <div className="w-full max-w-[440px]">
          <PilihAvatar awal="k1-r4-w0-a0" c="pink" onSimpan={() => {}} />
        </div>
      )}
      {p === "anggota" && (
        <div className="w-full max-w-[900px]">
          <AnggotaRumah />
        </div>
      )}
      <SheetHost />
    </div>
  );
}

export default function DevProfil() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
