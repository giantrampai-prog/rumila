// KHUSUS DEVELOPMENT: simpan tangkapan render (data URL JPEG) ke folder sementara untuk diperiksa.
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") return new Response("not found", { status: 404 });
  const { name, data } = (await req.json()) as { name: string; data: string };
  const dir = join(tmpdir(), "rumila-shots");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${name.replace(/[^a-z0-9-]/gi, "")}.jpg`);
  writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
  return Response.json({ file });
}
