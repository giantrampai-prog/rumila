'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Keep old bookmarks working after merging the duplicate menu. */
export default function ScienceLab() {
  const router = useRouter();
  // Wait until AppShell has mounted after account/profile hydration.
  useEffect(() => { router.replace('/jelajah-tubuh'); }, [router]);
  return <p role="status">Membuka <Link href="/jelajah-tubuh" className="underline">Tubuh Manusia</Link>…</p>;
}
