/**
 * One deterministic flight from gate to gate, driven only by active journey progress
 * (0–1). Ground positions are in a runway frame: the departure runway threshold is the
 * origin, the aircraft nose points along -Z and Y is altitude. Airborne distances are
 * compressed so clouds and coastlines visibly move during a short simulated flight.
 */
export type FlightPhaseId = 'pushback' | 'taxi' | 'lineup' | 'takeoff' | 'rotate' | 'climb' | 'cruise' | 'descent' | 'approach' | 'flare' | 'touchdown' | 'rollout' | 'stopped';

export interface FlightPhase { id: FlightPhaseId; start: number; end: number; label: string }

/** Simulated seconds per flight; about two minutes of it are airborne. Kept in step with the journey chapter. */
export const FLIGHT_SECONDS = 160;
const at = (seconds: number) => seconds / FLIGHT_SECONDS;

export const FLIGHT_PHASES: readonly FlightPhase[] = [
  { id: 'pushback', start: 0, end: at(6), label: 'Didorong mundur dari gerbang' },
  { id: 'taxi', start: at(6), end: at(16), label: 'Meluncur ke landasan pacu' },
  { id: 'lineup', start: at(16), end: at(21), label: 'Bersiap di ujung landasan' },
  { id: 'takeoff', start: at(21), end: at(31), label: 'Lepas landas · melaju kencang' },
  { id: 'rotate', start: at(31), end: at(35), label: 'Hidung pesawat terangkat' },
  { id: 'climb', start: at(35), end: at(60), label: 'Menanjak menembus awan' },
  { id: 'cruise', start: at(60), end: at(113), label: 'Terbang jelajah di atas awan' },
  { id: 'descent', start: at(113), end: at(133), label: 'Mulai turun menuju bandara tujuan' },
  { id: 'approach', start: at(133), end: at(146), label: 'Pendekatan akhir · roda dan flap keluar' },
  { id: 'flare', start: at(146), end: at(149.5), label: 'Flare · hidung sedikit diangkat' },
  { id: 'touchdown', start: at(149.5), end: at(152), label: 'Roda menyentuh landasan' },
  { id: 'rollout', start: at(152), end: at(158), label: 'Rem dan dorongan balik · melambat' },
  { id: 'stopped', start: at(158), end: 1, label: 'Pesawat berhenti di landasan' },
];

/** Progress where the wheels leave the runway and where they touch down again. */
export const LIFTOFF = at(33.2);
export const TOUCHDOWN = at(149.5);
/** Start of the descent, used by "skip to landing". */
export const DESCENT_START = at(113);
export const CRUISE_ALTITUDE = 9500;
export const CLOUD_BASE = 1500;
export const CLOUD_TOP = 2300;
export const TAXIWAY_X = 160;
const DEG = Math.PI / 180;

export interface FlightState {
  phase: FlightPhase;
  /** 0–1 within the current phase. */
  local: number;
  x: number; z: number; altitude: number;
  heading: number; pitch: number; bank: number;
  /** Visual ground speed in metres per second. */
  speed: number;
  onGround: boolean; gearDown: boolean; flaps: number; spoilers: number;
  /** 0 idle – 1 take-off thrust; negative values are reverse thrust. */
  thrust: number;
  seatbelt: boolean; cabinDim: number;
  /** 0–1 intensity of vibration from the runway, clouds or touchdown. */
  shake: number;
  /** 1 while inside the cloud layer. */
  inCloud: number;
  /** 0–1 tyre smoke at touchdown; wheel brake pressure on the landing roll. */
  smoke: number; brake: number;
  /** Nose wheel on the runway (main wheels touch first on landing). */
  noseDown: boolean;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function getFlightPhase(progress: number): FlightPhase {
  const p = clamp01(progress);
  return FLIGHT_PHASES.find((phase) => p < phase.end) ?? FLIGHT_PHASES[FLIGHT_PHASES.length - 1];
}

function phaseAt(p: number): { phase: FlightPhase; t: number } {
  const phase = getFlightPhase(p);
  return { phase, t: clamp01((p - phase.start) / (phase.end - phase.start)) };
}

/** Speed relative to the ground (negative while pushed back). */
function speedAt(p: number): number {
  const { phase, t } = phaseAt(p);
  switch (phase.id) {
    case 'pushback': return -2.2 * Math.sin(t * Math.PI);
    case 'taxi': return 9 * Math.sin(Math.min(1, t * 3) * Math.PI / 2);
    case 'lineup': return lerp(9, 0, smooth(t));
    case 'takeoff': return 82 * t;
    case 'rotate': return lerp(82, 92, t);
    case 'climb': return lerp(92, 235, smooth(t));
    case 'cruise': return 245;
    case 'descent': return lerp(235, 115, smooth(t));
    case 'approach': return lerp(115, 76, t);
    case 'flare': return lerp(76, 71, t);
    case 'touchdown': return lerp(71, 64, t);
    case 'rollout': return 64 * Math.pow(1 - t, 1.6);
    default: return 0;
  }
}

/** Airborne travel is time-compressed so the cloud deck flows visibly past. */
function compressionAt(p: number): number {
  const { phase, t } = phaseAt(p);
  if (phase.id === 'climb') return lerp(1, 7, smooth(t));
  if (phase.id === 'cruise') return 7;
  if (phase.id === 'descent') return lerp(7, 2.4, smooth(t));
  if (phase.id === 'approach') return lerp(2.4, 1, smooth(t));
  return 1;
}

function headingRateAt(p: number): number {
  const { phase, t } = phaseAt(p);
  // A coordinated left turn after take-off and a right turn onto final approach
  // (heading grows toward -X; positive bank lowers the left wing).
  if (phase.id === 'climb' && t > .38 && t < .82) return 2.6 * DEG * Math.sin((t - .38) / .44 * Math.PI);
  if (phase.id === 'descent' && t > .45 && t < .9) return -2.6 * DEG * Math.sin((t - .45) / .45 * Math.PI);
  return 0;
}

function bankAt(p: number): number {
  const { phase, t } = phaseAt(p);
  if (phase.id === 'climb' && t > .38 && t < .82) return 16 * DEG * Math.sin((t - .38) / .44 * Math.PI);
  if (phase.id === 'descent' && t > .45 && t < .9) return -16 * DEG * Math.sin((t - .45) / .45 * Math.PI);
  if (phase.id === 'cruise') return 2.5 * DEG * Math.sin(t * Math.PI * 3);
  return 0;
}

function altitudeAt(p: number): number {
  const { phase, t } = phaseAt(p);
  switch (phase.id) {
    case 'rotate': return t < .55 ? 0 : 22 * ((t - .55) / .45) ** 2;
    case 'climb': return lerp(22, CRUISE_ALTITUDE, Math.pow(t, 1.45));
    case 'cruise': return CRUISE_ALTITUDE + 60 * Math.sin(t * Math.PI * 2);
    case 'descent': return lerp(CRUISE_ALTITUDE, 160, 1 - Math.pow(1 - t, 1.25));
    case 'approach': return lerp(160, 14, t);
    case 'flare': return lerp(14, 0, 1 - (1 - t) ** 2);
    default: return 0;
  }
}

function pitchAt(p: number): number {
  const { phase, t } = phaseAt(p);
  switch (phase.id) {
    case 'rotate': return 12 * DEG * smooth(t);
    case 'climb': return lerp(12, 3, smooth(t)) * DEG;
    case 'cruise': return 2 * DEG;
    case 'descent': return -2.5 * DEG;
    case 'approach': return lerp(-1, 2, t) * DEG;
    case 'flare': return lerp(2, 5.5, smooth(t)) * DEG;
    // Main wheels first, then the nose is lowered onto the runway.
    case 'touchdown': return lerp(5.5, 0, smooth(clamp01((t - .25) / .6))) * DEG;
    default: return 0;
  }
}

interface Sample { x: number; z: number; heading: number }
const SAMPLES = 3000;
let table: Sample[] | null = null;

/** Integrates ground track once: taxi along the parallel taxiway, line up, then fly. */
function track(): Sample[] {
  if (table) return table;
  const result: Sample[] = [];
  let x = TAXIWAY_X, z = 340, heading = 0;
  const dt = FLIGHT_SECONDS / SAMPLES;
  const lineup = FLIGHT_PHASES.find((phase) => phase.id === 'lineup')!;
  for (let i = 0; i <= SAMPLES; i++) {
    const p = i / SAMPLES;
    result.push({ x, z, heading });
    const v = speedAt(p) * compressionAt(p);
    if (p >= lineup.start && p < lineup.end) {
      // An S-turn from the taxiway onto the runway centreline, ending aligned.
      const next = Math.min(1, (p + 1 / SAMPLES - lineup.start) / (lineup.end - lineup.start));
      const nx = TAXIWAY_X * (1 - smooth(next)), nz = z - Math.max(.5, v * dt);
      heading = next >= 1 ? 0 : Math.atan2(-(nx - x), -(nz - z));
      x = nx; z = nz;
      continue;
    }
    heading += headingRateAt(p) * dt;
    x += -Math.sin(heading) * v * dt; z += -Math.cos(heading) * v * dt;
  }
  // Shift the frame so the aircraft lines up exactly on the runway threshold (z = 0).
  const aligned = result[Math.round(lineup.end * SAMPLES)];
  const dx = aligned.x, dz = aligned.z;
  for (const sample of result) { sample.x -= dx; sample.z -= dz; }
  table = result; return result;
}

/** Position, attitude and cabin cues for a progress value. Invalid input clamps to the gate. */
export function getFlightState(progress: number): FlightState {
  const p = clamp01(progress);
  const { phase, t } = phaseAt(p);
  const samples = track(), f = p * SAMPLES, i = Math.min(SAMPLES - 1, Math.floor(f)), k = f - i;
  const a = samples[i], b = samples[i + 1];
  const altitude = altitudeAt(p), speed = speedAt(p);
  const airborne = ['climb', 'cruise', 'descent', 'approach', 'flare'].includes(phase.id);
  const onGround = altitude <= 0.01 && !airborne;
  const impact = phase.id === 'touchdown' ? Math.max(0, 1 - t / .3) + (t > .55 && t < .75 ? .5 : 0) : 0;
  const inCloud = altitude > CLOUD_BASE - 150 && altitude < CLOUD_TOP + 150
    ? Math.min(1, (altitude - CLOUD_BASE + 150) / 300, (CLOUD_TOP + 150 - altitude) / 300) : 0;
  const thrust = phase.id === 'takeoff' || phase.id === 'rotate' ? 1 : phase.id === 'climb' ? .88 : phase.id === 'cruise' ? .66
    : phase.id === 'descent' ? .22 : phase.id === 'approach' ? .45 : phase.id === 'flare' ? .2 : phase.id === 'lineup' ? lerp(.25, .55, t)
      : phase.id === 'touchdown' ? (t > .5 ? -.6 : .12) : phase.id === 'rollout' ? (t < .6 ? -.85 : .12) : phase.id === 'taxi' ? .26 : .08;
  return {
    phase, local: t,
    x: lerp(a.x, b.x, k), z: lerp(a.z, b.z, k), altitude,
    heading: lerp(a.heading, b.heading, k), pitch: pitchAt(p), bank: bankAt(p), speed,
    onGround, gearDown: p < at(38) || p > at(129),
    flaps: p < at(28) ? .55 : p < at(48) ? lerp(.55, 0, smooth((p - at(28)) / at(20))) : p > at(124) ? lerp(.3, 1, smooth(clamp01((p - at(124)) / at(10)))) : 0,
    spoilers: (phase.id === 'touchdown' && t > .12) || (phase.id === 'rollout' && t < .85) ? 1 : 0,
    thrust,
    seatbelt: p < at(60) || p > at(118),
    cabinDim: p > at(16) && p < at(48) ? 1 : p > at(128) ? 1 : 0,
    shake: Math.min(1, (onGround ? Math.abs(speed) / 82 * .7 : 0) + inCloud * .55 + impact + (phase.id === 'cruise' ? .08 : 0)),
    inCloud,
    smoke: phase.id === 'touchdown' ? Math.max(0, 1 - t / .55) : 0,
    brake: phase.id === 'rollout' ? 1 - t * .6 : phase.id === 'touchdown' && t > .7 ? .5 : 0,
    noseDown: !airborne && !(phase.id === 'touchdown' && t < .7) && phase.id !== 'rotate',
  };
}

/** Where the destination runway threshold sits in the departure runway frame. */
export function getArrivalRunway(): { x: number; z: number; heading: number } {
  const touchdown = getFlightState(TOUCHDOWN);
  // The aim point sits ~400 m beyond the threshold.
  return { x: touchdown.x + Math.sin(touchdown.heading) * 400, z: touchdown.z + Math.cos(touchdown.heading) * 400, heading: touchdown.heading };
}

/** Boarding milestones follow the same active progress as the camera path. */
export const BOARDING_STEPS = [
  { until: .16, label: 'Pindai boarding pass di gerbang' },
  { until: .46, label: 'Berjalan melewati garbarata' },
  { until: .56, label: 'Disambut awak kabin di pintu pesawat' },
  { until: .88, label: 'Mencari kursi 32A di lorong kabin' },
  { until: 1.01, label: 'Duduk dan pasang sabuk pengaman' },
] as const;

export function getBoardingStep(progress: number): { index: number; label: string } {
  const p = clamp01(progress), index = BOARDING_STEPS.findIndex((step) => p < step.until);
  return { index, label: BOARDING_STEPS[index].label };
}
