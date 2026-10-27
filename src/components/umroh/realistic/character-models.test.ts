import { readFileSync } from 'node:fs';
import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { describe, expect, it } from 'vitest';
import { bakeCharacter, type BakedCharacterPose } from './character-assets';

interface ModelDocument {
  asset: { version: string };
  materials: (Record<string, unknown> & { pbrMetallicRoughness?: Record<string, unknown> })[];
  nodes: { name?: string }[];
  images?: unknown; textures?: unknown; samplers?: unknown;
}
interface ManifestEntry { file: string; bytes: number; triangles: number; clips: string[]; removedCap: boolean }
const directory = 'public/umroh/';
const manifest: Record<'ihram' | 'travel', ManifestEntry> = JSON.parse(readFileSync(`${directory}models/manifest.json`, 'utf8'));

/** Retain actual meshes/rigs/animations while avoiding browser image decoding in Node. */
async function loadGeometry(entry: ManifestEntry) {
  const data = readFileSync(`${directory}models/${entry.file}`);
  expect(data.byteLength).toBe(entry.bytes); expect(data.readUInt32LE(0)).toBe(0x46546c67);
  const jsonLength = data.readUInt32LE(12), document: ModelDocument = JSON.parse(data.subarray(20, 20 + jsonLength).toString());
  expect(document.asset.version).toBe('2.0');
  expect(document.materials.some((material) => material.pbrMetallicRoughness?.baseColorTexture)).toBe(true);
  for (const material of document.materials) {
    delete material.normalTexture; delete material.occlusionTexture; delete material.emissiveTexture; delete material.extensions;
    delete material.pbrMetallicRoughness?.baseColorTexture; delete material.pbrMetallicRoughness?.metallicRoughnessTexture;
  }
  delete document.images; delete document.textures; delete document.samplers;
  const json = Buffer.from(JSON.stringify(document)), padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 32); json.copy(padded);
  const binary = data.subarray(20 + jsonLength), header = Buffer.from(data.subarray(0, 20));
  header.writeUInt32LE(20 + padded.length + binary.length, 8); header.writeUInt32LE(padded.length, 12);
  const rebuilt = Buffer.concat([header, padded, binary]);
  return { document, source: await new GLTFLoader().parseAsync(rebuilt.buffer.slice(rebuilt.byteOffset, rebuilt.byteOffset + rebuilt.byteLength), '') };
}

function poseBounds(pose: BakedCharacterPose, frame?: number): T.Box3 {
  const bounds = new T.Box3(), vertex = new T.Vector3();
  for (const { geometry } of pose.parts) {
    const positions = frame === undefined ? geometry.getAttribute('position') : geometry.morphAttributes.position![frame];
    for (let i = 0; i < positions.count; i++) bounds.expandByPoint(vertex.fromBufferAttribute(positions, i));
  }
  return bounds;
}

describe('bundled human assets', () => {
  it('retains the source attribution and adaptation license beside the binaries', () => {
    const credits = readFileSync(`${directory}ASSETS.md`, 'utf8');
    expect(credits).toContain('Mostafa 1001'); expect(credits).toContain('creativecommons.org/licenses/by/4.0/');
    for (const entry of Object.values(manifest)) expect(credits).toContain(entry.file);
  });

  for (const attire of ['ihram', 'travel'] as const) it(`${attire} has usable rigged poses, normal scale, and bounded root motion`, async () => {
    const entry = manifest[attire], { document, source } = await loadGeometry(entry);
    expect(source.animations.map((clip) => clip.name).sort()).toEqual([...entry.clips].sort());
    if (attire === 'ihram') {
      expect(entry.removedCap).toBe(true);
      expect(document.nodes.some((node) => /kopiah/i.test(node.name ?? ''))).toBe(false);
    }
    const asset = await bakeCharacter(source);
    try {
      const standing = asset.poses.standing!, idleBounds = poseBounds(standing);
      expect(idleBounds.min.y).toBeCloseTo(0, 4); expect(idleBounds.max.y).toBeCloseTo(1.76, 3);
      const triangles = standing.parts.reduce((sum, { geometry }) => sum + (geometry.index?.count ?? geometry.getAttribute('position').count) / 3, 0);
      expect(triangles).toBe(entry.triangles); expect(triangles).toBeLessThan(30_000);
      for (const pose of Object.values(asset.poses)) for (const { geometry } of pose.parts) {
        for (const attribute of [geometry.getAttribute('position'), ...geometry.morphAttributes.position ?? []]) expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
        for (const normals of [geometry.getAttribute('normal'), ...geometry.morphAttributes.normal ?? []]) {
          let maxError = 0;
          for (let i = 0; i < normals.count; i++) maxError = Math.max(maxError, Math.abs(Math.hypot(normals.getX(i), normals.getY(i), normals.getZ(i)) - 1));
          expect(maxError).toBeLessThan(.0001);
        }
      }
      const origin = idleBounds.getCenter(new T.Vector3()).setY(0);
      for (let frame = 0; frame < standing.walkFrames; frame++) expect(poseBounds(standing, frame).getCenter(new T.Vector3()).setY(0).distanceTo(origin)).toBeLessThan(.3);
      expect(standing.parts.some(({ geometry }) => !geometry.morphAttributes.position![0].array.every((value, i) => value === geometry.morphAttributes.position![6].array[i]))).toBe(true);
      if (attire === 'travel') {
        const seated = poseBounds(asset.poses.seated!), driving = poseBounds(asset.poses.driving!);
        expect(seated.getSize(new T.Vector3()).x).toBeLessThan(.6);
        // Existing cabin cushions are .56 m high; the pelvis rests .08 m above them.
        expect(.56 + .97 * (.08 + seated.min.y)).toBeGreaterThan(-.02);
        // The taxi floor is .36 m high and its roof is 1.55 m above the road.
        expect(.625 + .97 * (.08 + driving.min.y)).toBeGreaterThan(.34);
        expect(.625 + .97 * (.08 + driving.max.y)).toBeLessThan(1.55);
        expect(-.22 - .97 * driving.max.z).toBeGreaterThan(-1.35);
      }
    } finally { asset.dispose(); }
  });
});
