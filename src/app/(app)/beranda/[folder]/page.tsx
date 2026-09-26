"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { LauncherFolder } from "@/components/launcher";
import { useOpenTool } from "@/components/shell";
import { Card, Icon, Tile, listRow } from "@/components/ui";
import { CAT, getFolder } from "@/lib/catalog";
import { useIsDesktop } from "@/lib/store";

export default function FolderPage() {
  const { folder } = useParams<{ folder: string }>();
  const f = getFolder(folder);
  const openTool = useOpenTool();
  const desk = useIsDesktop();
  if (!f) notFound();
  if (desk) return <LauncherFolder f={f} open={openTool} />;

  return (
    <>
      <div
        className="flex flex-col gap-2 rounded-3xl border border-line p-5 desk:gap-3 desk:p-8"
        style={{ background: `linear-gradient(135deg, ${CAT[f.c][0]}, #fff 80%)` }}
      >
        <Link href="/beranda" aria-label="Kembali" className="flex size-10 items-center justify-center self-start rounded-xl bg-white">
          <Icon name="arrow_back" />
        </Link>
        <h1 className="text-[28px] leading-[1.05] font-extrabold tracking-[-0.03em] desk:text-[34px]">{f.name}</h1>
        <p className="text-sm leading-normal text-ink-2">{f.desc}</p>
        {f.id === 'edukasi' && <p className="text-xs font-semibold text-ink-3">{f.items.length} kategori · Pilih yang ingin kamu kenali</p>}
      </div>
      {/* Desktop: alat jadi kartu dalam grid */}
      <Card className="px-3.5 py-1 desk:grid desk:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] desk:gap-3 desk:border-0 desk:bg-transparent desk:p-0">
        {f.items.map((t) => (
          <button
            key={t.id}
            onClick={() => openTool(t)}
            className={`${listRow} gap-3.5 ${t.planned ? 'grayscale' : ''} desk:rounded-[20px] desk:border desk:border-line desk:bg-white desk:p-4 desk:transition-transform desk:last:border-b desk:hover:-translate-y-0.5`}
          >
            <Tile c={t.g} icon={t.icon} size={44} />
            <span className="flex-1 text-[15px] font-bold">{t.name}{t.planned && <span className="mt-1 block text-xs font-medium text-ink-3">Segera hadir</span>}</span>
            <Icon name="chevron_right" className="text-chev" />
          </button>
        ))}
      </Card>
    </>
  );
}
