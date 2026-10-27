import { describe, expect, it } from 'vitest';
import { getFlightPov, isFlightChapter } from './flight-camera';

describe('flight camera', () => {
  it('alternates whole-aircraft and passenger-cabin shots across one flight', () => {
    expect([0, .249, .25, .499, .5, .749, .75, 1].map((p) => getFlightPov(p)))
      .toEqual(['exterior', 'exterior', 'cabin', 'cabin', 'exterior', 'exterior', 'cabin', 'cabin']);
  });
  it('preserves a manual POV throughout the flight', () => {
    for (const progress of [0, .25, .5, .75, 1]) {
      expect(getFlightPov(progress, 'cabin')).toBe('cabin');
      expect(getFlightPov(progress, 'exterior')).toBe('exterior');
    }
  });
  it('keeps automatic framing still for reduced motion while allowing manual choices', () => {
    for (const progress of [0, .25, .5, .75, 1]) expect(getFlightPov(progress, 'auto', true)).toBe('exterior');
    expect(getFlightPov(.3, 'cabin', true)).toBe('cabin');
  });
  it('keeps valid first/last shots at boundaries and excludes other transport', () => {
    expect(getFlightPov(-1)).toBe('exterior');
    expect(getFlightPov(Infinity)).toBe('exterior');
    expect(getFlightPov(NaN)).toBe('exterior');
    expect(getFlightPov(10)).toBe('cabin');
    expect(isFlightChapter('garuda_jed')).toBe(true);
    expect(isFlightChapter('garuda_cgk')).toBe(true);
    for (const chapter of ['haramain', 'taxi_cgk', 'umroh', undefined]) expect(isFlightChapter(chapter)).toBe(false);
  });
});
