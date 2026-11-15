import { describe, expect, it } from 'vitest';
import { getFlightPov, isFlightChapter } from './flight-camera';
import { FLIGHT_PHASES } from './flight-profile';

describe('flight camera', () => {
  it('follows the flight phases: window seat for taxi, outside for take-off and the whole landing', () => {
    const phase = (id: string, local = .5) => { const p = FLIGHT_PHASES.find((item) => item.id === id)!; return p.start + (p.end - p.start) * local; };
    expect(getFlightPov(phase('taxi'))).toBe('cabin');
    expect(getFlightPov(phase('takeoff'))).toBe('exterior');
    expect(getFlightPov(phase('climb', .2))).toBe('exterior');
    expect(getFlightPov(phase('climb', .8))).toBe('cabin');
    expect(getFlightPov(phase('cruise', .5))).toBe('exterior');
    expect(getFlightPov(phase('cruise', .9))).toBe('cabin');
    for (const id of ['approach', 'flare', 'touchdown', 'rollout', 'stopped']) expect(getFlightPov(phase(id))).toBe('exterior');
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
    expect(getFlightPov(0)).toBe('cabin');
    expect(isFlightChapter('garuda_jed')).toBe(true);
    expect(isFlightChapter('garuda_cgk')).toBe(true);
    for (const chapter of ['haramain', 'taxi_cgk', 'umroh', undefined]) expect(isFlightChapter(chapter)).toBe(false);
  });
});
