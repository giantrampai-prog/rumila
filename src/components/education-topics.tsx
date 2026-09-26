import type { Tool } from '@/lib/catalog';

/** Shared category preview; opening a plan never starts a learning session. */
export function EducationTopics({ tool }: { tool: Tool }) {
  return <div className="w-full rounded-2xl bg-[#f4f4f5] p-4 text-left text-[#565661]">
    <p className="text-xs font-extrabold uppercase tracking-wide">Segera hadir</p>
    <h3 className="mt-2 text-sm font-bold">Topik yang akan kita jelajahi</h3>
    <ul className="mt-3 flex flex-wrap gap-2">
      {tool.topics?.map(topic => <li key={topic} className="rounded-xl border border-[#dedee3] bg-white px-3 py-2 text-xs font-semibold">{topic}</li>)}
    </ul>
  </div>;
}
