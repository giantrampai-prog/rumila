import type { FlightTelemetry } from './realistic/types';

/**
 * Procedural aircraft sound with Web Audio: engine rumble, fan whine, airflow and runway
 * rumble follow the flight telemetry, and a two-tone chime marks seat-belt sign changes.
 * Nothing is downloaded. The cabin view is muffled by a low-pass filter.
 */
export class FlightAudio {
  private master: GainNode;
  private tone: BiquadFilterNode;
  private rumble: { gain: GainNode; filter: BiquadFilterNode };
  private air: { gain: GainNode; filter: BiquadFilterNode };
  private runway: { gain: GainNode; filter: BiquadFilterNode };
  private whine: { gain: GainNode; a: OscillatorNode; b: OscillatorNode };
  private enabled = false;
  private seatbelt: boolean | null = null;
  private disposed = false;

  static create(): FlightAudio | null {
    const Context = typeof window === 'undefined' ? undefined : window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return null;
    try { return new FlightAudio(new Context()); } catch { return null; }
  }

  private constructor(private context: AudioContext) {
    const ctx = context;
    this.master = ctx.createGain(); this.master.gain.value = 0;
    this.tone = ctx.createBiquadFilter(); this.tone.type = 'lowpass'; this.tone.frequency.value = 9000;
    this.master.connect(this.tone); this.tone.connect(ctx.destination);
    const noise = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate), data = noise.getChannelData(0);
    // Brown noise: integrated white noise gives a deep, even roar.
    let last = 0;
    for (let i = 0; i < data.length; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5; }
    const layer = (type: BiquadFilterType, frequency: number, q = .7) => {
      const source = ctx.createBufferSource(); source.buffer = noise; source.loop = true;
      source.playbackRate.value = .8 + Math.random() * .4;
      const filter = ctx.createBiquadFilter(); filter.type = type; filter.frequency.value = frequency; filter.Q.value = q;
      const gain = ctx.createGain(); gain.gain.value = 0;
      source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start();
      return { gain, filter };
    };
    this.rumble = layer('lowpass', 180);
    this.air = layer('bandpass', 900, .5);
    this.runway = layer('lowpass', 70, 1.4);
    const whineGain = ctx.createGain(); whineGain.gain.value = 0;
    const band = ctx.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = 2200; band.Q.value = 3;
    const a = ctx.createOscillator(), b = ctx.createOscillator();
    a.type = 'sawtooth'; b.type = 'triangle';
    a.connect(band); b.connect(band); band.connect(whineGain); whineGain.connect(this.master);
    a.start(); b.start();
    this.whine = { gain: whineGain, a, b };
  }

  resume(): void { if (this.context.state === 'suspended') void this.context.resume().catch(() => undefined); }

  setEnabled(enabled: boolean): void {
    if (this.disposed || enabled === this.enabled) return;
    this.enabled = enabled;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(enabled ? .55 : 0, now, enabled ? .6 : .25);
  }

  update(telemetry: FlightTelemetry, cabin: boolean, delta: number): void {
    if (this.disposed || !this.enabled) return;
    const now = this.context.currentTime, smooth = Math.max(.05, Math.min(.4, delta * 4));
    const thrust = Math.abs(telemetry.thrust), speed = Math.min(1, telemetry.speed / 245);
    this.tone.frequency.setTargetAtTime(cabin ? 1500 : 9000, now, .3);
    this.rumble.gain.gain.setTargetAtTime(.18 + thrust * .55, now, smooth);
    this.rumble.filter.frequency.setTargetAtTime(110 + thrust * 260, now, smooth);
    this.air.gain.gain.setTargetAtTime(speed * (cabin ? .35 : .5) + telemetry.inCloud * .12, now, smooth);
    this.air.filter.frequency.setTargetAtTime(500 + speed * 1300, now, smooth);
    this.runway.gain.gain.setTargetAtTime(telemetry.onGround ? Math.min(.8, Math.abs(telemetry.speed) / 70) * .9 + telemetry.shake * .25 : 0, now, .08);
    const n1 = 380 + thrust * 1650;
    this.whine.a.frequency.setTargetAtTime(n1, now, .4);
    this.whine.b.frequency.setTargetAtTime(n1 * 1.503, now, .4);
    this.whine.gain.gain.setTargetAtTime((cabin ? .012 : .035) * (.3 + thrust), now, smooth);
    if (this.seatbelt !== null && this.seatbelt !== telemetry.seatbelt) this.chime();
    this.seatbelt = telemetry.seatbelt;
  }

  /** The familiar high–low cabin chime. */
  private chime(): void {
    const ctx = this.context;
    [[1318, 0], [988, .38]].forEach(([frequency, offset]) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain(), at = ctx.currentTime + offset;
      osc.type = 'sine'; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(.16, at + .02); gain.gain.exponentialRampToValueAtTime(.0005, at + 1.4);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(at); osc.stop(at + 1.5);
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    try { this.whine.a.stop(); this.whine.b.stop(); } catch { /* already stopped */ }
    void this.context.close().catch(() => undefined);
  }
}
