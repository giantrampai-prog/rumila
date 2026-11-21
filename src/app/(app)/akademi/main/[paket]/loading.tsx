import { Icon } from "@/components/ui";

// Ditampilkan Next.js selama halaman misi dimuat (ketukan di peta langsung terasa).
export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6" role="status" aria-label="Membuka misi">
      <div className="flex flex-col items-center gap-3 rounded-[28px] bg-white px-8 py-6 shadow-[0_6px_0_rgba(11,37,69,.08)]">
        <Icon name="progress_activity" size={44} className="animate-spin text-[#0786eb]" />
        <p className="text-[20px] font-extrabold text-[#0b2545]">Membuka misi…</p>
      </div>
    </div>
  );
}
