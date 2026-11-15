import * as T from 'three';
import { createGarudaAircraft, animateAircraft, type AircraftParts } from './aircraft';
import { applyAttitude, createFlightEnvironment, flightTelemetry, updateTelemetry } from './flight-env';
import { getFlightState } from '../flight-profile';
import type { UmrohWorld, WorldResources } from './types';

/**
 * The whole aircraft flying gate to gate. It stays at the origin; the runway, ground and
 * cloud layers move beneath it while its attitude, gear, flaps and lights follow the
 * flight profile.
 */
export function createFlightWorld(r: WorldResources, destination: 'jeddah' | 'jakarta'): UmrohWorld {
  const group = new T.Group(); group.name = `Penerbangan Garuda · ${destination}`;
  const aircraft = createGarudaAircraft(r, { animated: true }); group.add(aircraft);
  const parts = aircraft.userData.parts as AircraftParts;
  const env = createFlightEnvironment(r, destination); group.add(env.group);
  const telemetry = flightTelemetry(env);
  return {
    group, flight: { aircraft }, vehicle: aircraft, telemetry,
    spawn: [58, 18, -62], lookAt: [0, 1, -2], overview: [58, 18, -62],
    bounds: { minX: -150, maxX: 150, minZ: -160, maxZ: 160 }, blockers: [],
    landmarks: [
      { id: 'flight-front', label: 'Pesawat dari depan', position: [58, 18, -62], lookAt: [0, 1, -2] },
      { id: 'flight-wing', label: 'Sayap dan langit', position: [-53, 10, 47], lookAt: [0, 1, 0] },
      { id: 'flight-below', label: 'Perut pesawat dan roda', position: [22, -26, -30], lookAt: [0, -2, 0] },
    ],
    animate(frame) {
      const state = getFlightState(frame.travel);
      env.update(frame, state); updateTelemetry(telemetry, state);
      applyAttitude(aircraft, state, frame);
      animateAircraft(parts, {
        gear: state.gearDown ? 1 : 0, flaps: state.flaps, spoilers: state.spoilers, thrust: state.thrust, smoke: state.smoke, noseLoad: state.noseDown ? 1 : 0,
        landingLights: state.altitude < 3000 && state.phase.id !== 'cruise' && state.phase.id !== 'stopped', contrail: Math.max(0, Math.min(1, (state.altitude - 7800) / 1200)),
      }, frame.time, frame.delta);
    },
  };
}
