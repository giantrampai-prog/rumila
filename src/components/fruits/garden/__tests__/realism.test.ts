import { afterEach, describe, expect, it, vi } from 'vitest';
import * as T from 'three';
import { buildGardenBird, birdFlightPose, featherGeometry } from '../birds';
import { grassClump, riverRock } from '../materials';
import { loadGardenMaterial } from '../textures';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('geometri satwa dan vegetasi kebun', () => {
  it('mempertahankan bulu melengkung, bilah rumput dan batu dengan angka geometri valid', () => {
    for (const g of [featherGeometry(0.22, 0.04), grassClump(125), riverRock(0.4, 3)]) {
      for (const key of ['position', 'normal']) for (const value of g.getAttribute(key).array) expect(Number.isFinite(value)).toBe(true);
      g.computeBoundingBox();
      expect(g.boundingBox!.max.y - g.boundingBox!.min.y).toBeGreaterThan(0.001);
      g.dispose();
    }
  });
  it.each([0, 1, 2])('burung varian %s memiliki sayap terpisah dan anggaran render terkendali', variant => {
    const bird = buildGardenBird(variant);
    expect(bird.wl).not.toBe(bird.wr);
    expect(bird.tipL.parent).toBe(bird.wl);
    expect(bird.tipR.parent).toBe(bird.wr);
    let meshes = 0, triangles = 0;
    const materials = new Set<T.Material>();
    bird.g.traverse(o => {
      if (!(o instanceof T.Mesh)) return;
      meshes++; triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
      expect(o.geometry.boundingSphere?.radius).toBeLessThan(1);
      o.geometry.dispose();
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m);
    });
    expect(meshes).toBeLessThanOrEqual(8);
    expect(triangles).toBeLessThan(13000);
    materials.forEach(m => m.dispose());
  });
  it('transisi mengepak dan meluncur tidak meloncat, termasuk di batas fase', () => {
    for (let phase = 0; phase < 6; phase++) for (let t = 0; t < 30; t += 0.03) {
      const a = birdFlightPose(t, phase), b = birdFlightPose(t + 1 / 120, phase);
      expect(Math.abs(a.flap)).toBeLessThanOrEqual(0.65);
      expect(Math.abs(b.flap - a.flap)).toBeLessThan(0.09);
      expect(Math.abs(b.flex - a.flex)).toBeLessThan(0.045);
    }
  });
});

describe('pemuatan material tanpa mengubah alokasi GPU', () => {
  function setup() {
    const draw = vi.fn(), clear = vi.fn();
    const canvas = { width: 0, height: 0, getContext: () => ({ drawImage: draw, clearRect: clear }) };
    vi.stubGlobal('document', { createElement: () => canvas });
    let complete!: (t: T.Texture) => void, fail!: () => void;
    vi.spyOn(T.TextureLoader.prototype, 'load').mockImplementation((_path, onLoad, _progress, onError) => {
      complete = t => onLoad?.(t as T.Texture<HTMLImageElement>); fail = () => onError?.(new Error('offline')); return new T.Texture();
    });
    const result = loadGardenMaterial('/fruits/garden/realism/foliage.webp', new T.Texture({ width: 512, height: 512 }));
    return { result, canvas, draw, clear, complete, fail };
  }
  it('memperbarui piksel pada sumber tetap agar tekstur kloning ikut menerima gambar', () => {
    const { result, canvas, draw, complete } = setup();
    const clone = result.clone(), source = result.source;
    complete(new T.Texture({ width: 1254, height: 1254 }));
    expect(result.source).toBe(source);
    expect(clone.image).toBe(canvas);
    expect(result.image).toBe(canvas);
    expect(canvas.width).toBe(1024);
    expect(draw).toHaveBeenCalledTimes(2);
    expect(result.userData.assetStatus).toBe('ready');
    result.dispose(); clone.dispose();
  });
  it('tidak menghidupkan kembali tekstur setelah keluar dari kebun', () => {
    const { result, draw, complete } = setup();
    result.dispose(); complete(new T.Texture());
    expect(draw).toHaveBeenCalledTimes(1);
  });
  it('fallback tetap dapat dipakai saat aset tidak tersedia', () => {
    const { result, canvas, fail } = setup(); fail();
    expect(result.image).toBe(canvas);
    expect(result.userData.assetStatus).toBe('fallback'); result.dispose();
  });
});
