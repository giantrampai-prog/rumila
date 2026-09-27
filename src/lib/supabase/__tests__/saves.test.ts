import { beforeAll, describe, expect, it, vi } from 'vitest';
import { savedKeyOwner } from '../saves';

const id = '3f2b8c1e-9a4d-4c2e-8b7a-1d2e3f4a5b6c';

describe('sinkron progres game', () => {
  it('progres per anggota ikut disinkron, pemiliknya anggota itu', () => {
    for (const k of [`rumila-koding-${id}`, `rumila-ular-${id}`, `rumila-resto-${id}`, `rumila-kebun-${id}`, `rumila-kebun-main-${id}`, `rumila-angkasa:${id}`])
      expect(savedKeyOwner(k), k).toBe(id);
  });
  it('progres milik rumah disinkron tanpa pemilik', () => {
    expect(savedKeyOwner('rumila-bumi-fosil')).toBeNull();
  });
  it('preferensi perangkat & anggota contoh lokal tidak ikut', () => {
    for (const k of ['rumila-sfx-off', 'rumila-install-dismissed', 'rumila-resto-intro', 'rumila-sync-meta', 'rumila-koding-m1', 'rumila-koding-dev'])
      expect(savedKeyOwner(k), k).toBeUndefined();
  });
});

/* ---------- tarik & kirim dengan server tiruan ---------- */


const server = new Map<string, { key: string; data: unknown; updated_at: string }>();
const upserts: { key: string; data: unknown }[] = [];
vi.mock('../client', () => ({
  supabase: () => ({
    from: () => ({
      select: () => ({ eq: async () => ({ data: [...server.values()], error: null }) }),
      upsert: async (row: { key: string; data: unknown; updated_at: string }) => {
        upserts.push(row);
        server.set(row.key, { key: row.key, data: row.data, updated_at: row.updated_at });
        return { error: null };
      },
    }),
  }),
}));

class MemStorage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

describe('tarik & kirim progres', () => {
  const g = globalThis as unknown as Record<string, unknown>;
  beforeAll(() => {
    g.Storage = MemStorage;
    g.localStorage = new MemStorage();
    g.window = Object.assign(globalThis, { dispatchEvent: () => true, addEventListener: () => {} });
    g.document = { addEventListener: () => {}, visibilityState: 'visible' };
    g.CustomEvent = class {
      constructor(
        public type: string,
        public init?: unknown,
      ) {}
    };
  });

  it('perangkat baru mengambil progres dari server; progres baru dikirim ke server', async () => {
    vi.useFakeTimers();
    const { pullSaves } = await import('../saves');
    const key = `rumila-koding-${id}`;
    server.set(key, { key, data: { stars: { k1: 3, k2: 2 } }, updated_at: new Date(1000).toISOString() });
    const changed = await pullSaves('fam', new Set([id]));
    expect(changed).toEqual([key]);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual({ stars: { k1: 3, k2: 2 } });
    // game menyimpan progres baru → terkirim setelah jeda singkat
    localStorage.setItem(key, JSON.stringify({ stars: { k1: 3, k2: 3, k3: 1 } }));
    await vi.advanceTimersByTimeAsync(2500);
    expect(upserts.at(-1)).toMatchObject({ key, data: { stars: { k1: 3, k2: 3, k3: 1 } } });
    // simpan terus-menerus (tiap detik): paling banyak 1 kiriman per 20 dtk, isinya selalu yang terbaru
    const before = upserts.filter((u) => u.key === key).length;
    for (let i = 0; i < 40; i++) {
      localStorage.setItem(key, JSON.stringify({ stars: { k1: 3, k2: 3, k3: 1 }, tick: i }));
      await vi.advanceTimersByTimeAsync(1000);
    }
    await vi.advanceTimersByTimeAsync(20000);
    const sent = upserts.filter((u) => u.key === key).slice(before);
    expect(sent.length).toBeLessThanOrEqual(3);
    expect(sent.at(-1)!.data).toMatchObject({ tick: 39 });
    // preferensi perangkat tidak dikirim
    const n = upserts.length;
    localStorage.setItem('rumila-sfx-off', '1');
    await vi.advanceTimersByTimeAsync(2500);
    expect(upserts.length).toBe(n);
    vi.useRealTimers();
  });

  it('progres lokal lama yang belum ada di server ikut dikirim', async () => {
    const { pullSaves } = await import('../saves');
    const key = `rumila-ular-${id}`;
    (localStorage as unknown as MemStorage).setItem(key, '{"win":1}');
    await pullSaves('fam', new Set([id]));
    await new Promise((r) => setTimeout(r, 0));
    expect(upserts.some((u) => u.key === key)).toBe(true);
  });
});
