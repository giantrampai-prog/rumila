import { describe, expect, it } from 'vitest';
import { getFlightPov, isFlightChapter } from './flight-camera';

describe('flight camera', () => {
  it('follows the flight phases: window seat for taxi, outside for take-off and landing', () => {
    expect([0, .129, .13, .319, .32, .499, .5, .659, .66, .839, .84, 1].map((p) => getFlightPov(p)))
      .toEqual(['cabin', 'cabin', 'exterior', 'exterior', 'cabin', 'cabin', 'exterior', 'exterior', 'cabin', 'cabin', 'exterior', 'exterior']);
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
    expect(getFlightPov(-1)).toBe('cabin');
    expect(getFlightPov(Infinity)).toBe('cabin');
    expect(getFlightPov(NaN)).toBe('cabin');
    expect(getFlightPov(10)).toBe('exterior');
    expect(isFlightChapter('garuda_jed')).toBe(true);
    expect(isFlightChapter('garuda_cgk')).toBe(true);
    for (const chapter of ['haramain', 'taxi_cgk', 'umroh', undefined]) expect(isFlightChapter(chapter)).toBe(false);
  });
});
