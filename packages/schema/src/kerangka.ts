// Kamus kode kerangka internasional (Cambridge, EYFS, …) — sumber: content/kerangka/*.json.

import { z } from "zod";
import { FrameworkId } from "./jenjang";

export const KerangkaEntry = z.object({
  code: z.string().trim().min(1),
  stage: z.string().optional(),
  strand: z.string().optional(),
  text: z.string().trim().min(1),
  verified: z.boolean(),
  source: z.string().optional(),
});
export type KerangkaEntry = z.infer<typeof KerangkaEntry>;

export const KerangkaFile = z.object({
  framework: FrameworkId,
  title: z.string(),
  version: z.string().optional(),
  sources: z.array(z.string()).default([]),
  retrieved_at: z.string().optional(),
  entries: z.array(KerangkaEntry),
});
export type KerangkaFile = z.infer<typeof KerangkaFile>;

export class Kamus {
  private map = new Map<string, KerangkaEntry>();
  constructor(files: KerangkaFile[] = []) { for (const f of files) this.add(f); }
  add(f: KerangkaFile) { for (const e of f.entries) this.map.set(`${f.framework}:${e.code}`, e); }
  get(framework: FrameworkId, code: string): KerangkaEntry | undefined { return this.map.get(`${framework}:${code}`); }
  has(framework: FrameworkId, code: string) { return this.map.has(`${framework}:${code}`); }
  get size() { return this.map.size; }
}
