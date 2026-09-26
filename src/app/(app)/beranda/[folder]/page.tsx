"use client";

import { notFound, useParams } from "next/navigation";
import { WorldView } from "@/components/world";
import { getFolder } from "@/lib/catalog";

export default function FolderPage() {
  const { folder } = useParams<{ folder: string }>();
  const f = getFolder(folder);
  if (!f) notFound();
  return <WorldView f={f} />;
}
