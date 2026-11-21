import { describe, expect, it } from 'vitest';
import { GRADING_SHADER, qualityTier } from './grading';

describe('mutu render Umroh', () => {
  it('perangkat kuat mendapat efek penuh, perangkat lemah mode hemat', () => {
    expect(qualityTier({ memory: 8, cores: 8, narrow: false })).toBe('tinggi');
    expect(qualityTier({ memory: 2, cores: 8, narrow: false })).toBe('hemat');
    expect(qualityTier({ memory: 8, cores: 2, narrow: false })).toBe('hemat');
    expect(qualityTier({ memory: 4, cores: 4, narrow: true })).toBe('hemat');
    expect(qualityTier({ memory: 8, cores: 8, narrow: true })).toBe('tinggi');
  });
  it('shader grading punya seragam yang disetel adegan', () => {
    expect(Object.keys(GRADING_SHADER.uniforms)).toEqual(expect.arrayContaining(['tDiffuse', 'uWarmth', 'uSaturation', 'uContrast', 'uVignette']));
  });
});
