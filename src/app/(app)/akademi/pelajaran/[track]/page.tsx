"use client";

import { useParams } from "next/navigation";
import { TrackView } from "@/components/akademi/portal/track";

export default function PelajaranTrackPage() {
  const { track } = useParams<{ track: string }>();
  return <TrackView track={(track ?? "").toUpperCase()} />;
}
