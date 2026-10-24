"use client";

import { useParams } from "next/navigation";
import { ActivityRunner } from "@/components/akademi/runner";

export default function AkademiMainPage() {
  const { paket } = useParams<{ paket: string }>();
  return <ActivityRunner paketId={paket} />;
}
