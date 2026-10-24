"use client";

import { Suspense } from "react";
import { RaporView } from "@/components/akademi/portal/rapor";

export default function RaporPage() {
  // useSearchParams (pilih anak lewat ?anak=) butuh batas Suspense di App Router.
  return (
    <Suspense fallback={null}>
      <RaporView />
    </Suspense>
  );
}
