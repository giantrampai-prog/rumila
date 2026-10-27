import { describe, expect, it } from 'vitest';
import { CLOUD_BASE, CLOUD_TOP, CRUISE_ALTITUDE, DESCENT_START, FLIGHT_PHASES, FLIGHT_SECONDS, LIFTOFF, TOUCHDOWN, getArrivalRunway, getBoardingStep, getFlightPhase, getFlightState } from './flight-profile';

const during = (id: string, local = .5) => { const phase = FLIGHT_PHASES.find((item) => item.id === id)!; return phase.start + (phase.end - phase.start) * local; };

describe('flight profile', () => {
  it('covers progress 0–1 with contiguous gate-to-gate phases', () => {
    expect(FLIGHT_PHASES[0].start).toBe(0);
    expect(FLIGHT_PHASES[FLIGHT_PHASES.length - 1].end).toBe(1);
    FLIGHT_PHASES.slice(1).forEach((phase, i) => expect(phase.start).toBe(FLIGHT_PHASES[i].end));
    expect(FLIGHT_PHASES.map((phase) => phase.id)).toEqual(['pushback', 'taxi', 'lineup', 'takeoff', 'rotate', 'climb', 'cruise', 'descent', 'approach', 'flare', 'touchdown', 'rollout', 'stopped']);
    for (const value of [-1, NaN, Infinity]) expect(getFlightPhase(value).id).toBe('pushback');
  });

  it('spends about two minutes in the air', () => {
    const airborne = (TOUCHDOWN - LIFTOFF) * FLIGHT_SECONDS;
    expect(airborne).toBeGreaterThan(105);
    expect(airborne).toBeLessThan(130);
    expect(getFlightState(LIFTOFF - .002).altitude).toBe(0);
    expect(getFlightState(LIFTOFF + .004).altitude).toBeGreaterThan(0);
    expect(getFlightPhase(DESCENT_START).id).toBe('descent');
  });

  it('stays on the ground until rotation and lines up on the runway centreline', () => {
    const lined = getFlightState(during('lineup', 1) - 1e-6);
    expect(lined.onGround).toBe(true);
    expect(Math.abs(lined.x)).toBeLessThan(1);
    expect(Math.abs(lined.z)).toBeLessThan(1);
    const roll = getFlightState(during('takeoff', .8));
    expect(roll.onGround).toBe(true);
    expect(roll.speed).toBeGreaterThan(60);
    expect(Math.abs(roll.x)).toBeLessThan(.5);
    expect(roll.shake).toBeGreaterThan(.3);
  });

  it('climbs through the cloud layer to cruise and comes back to the ground', () => {
    const climb = Array.from({ length: 200 }, (_, i) => getFlightState(during('climb', i / 200)).altitude);
    climb.slice(1).forEach((altitude, i) => expect(altitude).toBeGreaterThanOrEqual(climb[i]));
    expect(climb.some((altitude) => altitude > CLOUD_BASE && altitude < CLOUD_TOP)).toBe(true);
    const cruise = getFlightState(during('cruise'));
    expect(cruise.altitude).toBeGreaterThan(CRUISE_ALTITUDE - 100);
    expect(cruise.inCloud).toBe(0);
    expect(cruise.seatbelt).toBe(false);
  });

  it('lands main wheels first, lowers the nose, reverses thrust and comes to a stop', () => {
    expect(getFlightState(during('flare', .5)).pitch).toBeGreaterThan(getFlightState(during('approach', .5)).pitch);
    const touch = getFlightState(during('touchdown', .1));
    expect(touch.onGround).toBe(true);
    expect(touch.noseDown).toBe(false);
    expect(touch.smoke).toBeGreaterThan(.5);
    expect(touch.shake).toBeGreaterThan(.6);
    expect(getFlightState(during('touchdown', .9)).noseDown).toBe(true);
    const roll = getFlightState(during('rollout', .3));
    expect(roll.thrust).toBeLessThan(0);
    expect(roll.spoilers).toBe(1);
    expect(roll.brake).toBeGreaterThan(.5);
    const stopped = getFlightState(1);
    expect(stopped.speed).toBe(0);
    expect(stopped.onGround).toBe(true);
    expect(getFlightState(during('stopped', .2)).z).toBeCloseTo(stopped.z, 3);
  });

  it('raises the gear after take-off and lowers it before landing', () => {
    expect(getFlightState(during('takeoff')).gearDown).toBe(true);
    expect(getFlightState(during('cruise')).gearDown).toBe(false);
    expect(getFlightState(during('approach')).gearDown).toBe(true);
  });

  it('lands on a runway placed along the final approach track', () => {
    const runway = getArrivalRunway(), touchdown = getFlightState(TOUCHDOWN + 1e-4);
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
