import { describe, expect, it } from 'vitest';
import { CLOUD_BASE, CLOUD_TOP, CRUISE_ALTITUDE, FLIGHT_PHASES, getArrivalRunway, getBoardingStep, getFlightPhase, getFlightState } from './flight-profile';

describe('flight profile', () => {
  it('covers progress 0–1 with contiguous gate-to-gate phases', () => {
    expect(FLIGHT_PHASES[0].start).toBe(0);
    expect(FLIGHT_PHASES[FLIGHT_PHASES.length - 1].end).toBe(1);
    FLIGHT_PHASES.slice(1).forEach((phase, i) => expect(phase.start).toBe(FLIGHT_PHASES[i].end));
    expect(FLIGHT_PHASES.map((phase) => phase.id)).toEqual(['pushback', 'taxi', 'lineup', 'takeoff', 'rotate', 'climb', 'cruise', 'descent', 'approach', 'landing', 'rollout']);
    for (const value of [-1, NaN, Infinity]) expect(getFlightPhase(value).id).toBe('pushback');
  });

  it('stays on the ground until rotation and lines up on the runway centreline', () => {
    const lined = getFlightState(.13);
    expect(lined.onGround).toBe(true);
    expect(Math.abs(lined.x)).toBeLessThan(.5);
    expect(Math.abs(lined.z)).toBeLessThan(.5);
    expect(lined.heading).toBe(0);
    const roll = getFlightState(.2);
    expect(roll.onGround).toBe(true);
    expect(roll.speed).toBeGreaterThan(60);
    expect(Math.abs(roll.x)).toBeLessThan(.5);
    expect(roll.shake).toBeGreaterThan(.3);
  });

  it('climbs through the cloud layer to cruise and comes back to the ground', () => {
    const climb = Array.from({ length: 200 }, (_, i) => getFlightState(.26 + i * .0008).altitude);
    climb.slice(1).forEach((altitude, i) => expect(altitude).toBeGreaterThanOrEqual(climb[i]));
    expect(climb.some((altitude) => altitude > CLOUD_BASE && altitude < CLOUD_TOP)).toBe(true);
    expect(getFlightState(.6).altitude).toBeGreaterThan(CRUISE_ALTITUDE - 100);
    expect(getFlightState(.6).inCloud).toBe(0);
    expect(getFlightState(.6).seatbelt).toBe(false);
    expect(getFlightState(.99).onGround).toBe(true);
    expect(getFlightState(.99).altitude).toBe(0);
    expect(getFlightState(1).speed).toBeLessThan(10);
  });

  it('raises the gear after take-off and lowers it before landing', () => {
    expect(getFlightState(.2).gearDown).toBe(true);
    expect(getFlightState(.6).gearDown).toBe(false);
    expect(getFlightState(.93).gearDown).toBe(true);
    expect(getFlightState(.98).thrust).toBeLessThan(0);
  });

  it('lands on a runway placed along the final approach track', () => {
    const runway = getArrivalRunway(), touchdown = getFlightState(.966);
    const along = -(touchdown.x - runway.x) * Math.sin(runway.heading) - (touchdown.z - runway.z) * Math.cos(runway.heading);
    const across = (touchdown.x - runway.x) * Math.cos(runway.heading) - (touchdown.z - runway.z) * Math.sin(runway.heading);
    expect(along).toBeGreaterThan(300);
    expect(along).toBeLessThan(700);
    expect(Math.abs(across)).toBeLessThan(5);
  });

  it('names each boarding milestone in order', () => {
    expect([0, .3, .5, .7, 1].map((p) => getBoardingStep(p).index)).toEqual([0, 1, 2, 3, 4]);
  });
});
