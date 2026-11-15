"use client";

// Tes Profil Berpikir untuk satu anak; hanya bila Ruang Orang Tua sedang terbuka (PIN sudah dimasukkan).

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TesBerpikir } from "@/components/ortu/profil-berpikir";
import { ruangTerbuka } from "@/lib/ortu";
import { useRumila } from "@/lib/store";

function Isi() {
  const q = useSearchParams();
  const router = useRouter();
  const anak = useRumila((s) => s.members.find((m) => m.id === q.get("anak")));
  const [boleh, setBoleh] = useState<boolean | null>(null);
  useEffect(() => {
    const ok = ruangTerbuka();
    setBoleh(ok);
    if (!ok) router.replace("/orang-tua");
  }, [router]);
  if (!boleh || !anak) return null;
  return <TesBerpikir anak={anak} kembaliKe="/orang-tua" />;
}

export default function TesBerpikirPage() {
  return (
    <Suspense>
      <Isi />
    </Suspense>
  );
}
