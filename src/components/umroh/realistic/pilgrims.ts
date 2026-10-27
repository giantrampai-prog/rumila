import * as T from 'three';
import type { Position, Rect, UmrohWorld, WorldResources } from './types';
import { HumanBatch, humanAppearance, type Attire, type HumanAppearance } from './human';

interface Person { x: number; z: number; angle: number; scale: number; phase: number; appearance: HumanAppearance }
const position = new T.Vector3();

/** Human-scale, articulated walkers with a shared GPU-instanced wardrobe and face geometry. */
export class Pilgrims {
  readonly group: T.Group;
  private bodies: HumanBatch;
  private people: Person[];
  private spec: NonNullable<UmrohWorld['crowd']>;
  private elapsed = 0;
  private attire: Attire = 'ihram';
  private main = false;
  private mainPosition = new T.Vector3();
  private mainAngle = 0;
  private mainWalking = false;

  constructor(r: WorldResources, spec: NonNullable<UmrohWorld['crowd']>, main = false, female = false) {
    this.spec = spec; this.main = main;
    const count = main ? 1 : spec.count;
    const random = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    const area: Rect = spec.area ?? { minX: -35, maxX: 35, minZ: -25, maxZ: 25 };
    this.people = Array.from({ length: count }, (_, i) => ({
      x: area.minX + random(i + 3) * (area.maxX - area.minX), z: area.minZ + random(i + 16) * (area.maxZ - area.minZ),
      angle: random(i + 40) * Math.PI * 2, scale: .94 + random(i + 75) * .12, phase: random(i + 98) * Math.PI * 2,
      appearance: humanAppearance(i, main ? female : random(i + 21) > .63),
    }));
    this.bodies = new HumanBatch(r, count); this.group = this.bodies.group;
    this.update(0, false);
  }

  setAttire(attire: Attire): void { this.attire = attire; }
  pose(at: T.Vector3, angle: number, walking: boolean, female: boolean): void {
    this.mainPosition.copy(at); this.mainAngle = angle; this.mainWalking = walking; this.people[0].appearance.female = female;
  }
  update(delta: number, animate = true, avoid?: T.Vector3): void {
    if (animate) this.elapsed += delta;
    const area = this.spec.area ?? { minX: -35, maxX: 35, minZ: -25, maxZ: 25 };
    this.people.forEach((p, i) => {
      let x = p.x, z = p.z, angle = p.angle;
      if (this.main) { x = this.mainPosition.x; z = this.mainPosition.z; angle = this.mainAngle; }
      else if (this.spec.kind === 'tawaf') {
        const radius = (this.spec.radius ?? 24) + (i % 9) * 1.35;
        angle = p.angle - this.elapsed * (.023 + (i % 3) * .002);
        x = Math.cos(angle) * radius; z = Math.sin(angle) * radius;
        angle = Math.PI - angle;
      } else if (this.spec.kind === 'sai') {
        const span = area.maxZ - area.minZ;
        const shift = ((p.z - area.minZ + this.elapsed * .85) % (span * 2));
        const outbound = shift < span;
        z = outbound ? area.minZ + shift : area.maxZ - (shift - span);
        angle = outbound ? 0 : Math.PI;
      } else {
        const span = area.maxX - area.minX;
        const shift = ((p.x - area.minX + this.elapsed * .52) % (span * 2));
        const outbound = shift < span;
        x = outbound ? area.minX + shift : area.maxX - (shift - span);
        angle = outbound ? Math.PI / 2 : -Math.PI / 2;
      }
      if (avoid && !this.main) {
        const distance = Math.hypot(x - avoid.x, z - avoid.z);
        if (distance < 1.1) { const a = distance < .001 ? p.angle : Math.atan2(z - avoid.z, x - avoid.x); x = avoid.x + Math.cos(a) * 1.1; z = avoid.z + Math.sin(a) * 1.1; }
      }
      const walking = animate && (!this.main || this.mainWalking);
      this.bodies.pose(i, p.appearance, { position: position.set(x, 0, z), angle, scale: p.scale, gait: this.elapsed * 4.5 + p.phase, walking }, this.attire);
    });
    this.bodies.flush();
  }
  dispose(): void { this.bodies.dispose(); }
}

/** Seat positions are cushion/hip positions. A zero angle faces +Z; PI faces -Z. */
export function createSeatedPassengers(r: WorldResources, seats: readonly { position: Position; angle?: number; driving?: boolean }[]): T.Group {
  const passengers = new HumanBatch(r, seats.length, true);
  passengers.group.name = 'Seated passengers';
  seats.forEach((seat, i) => passengers.pose(i, humanAppearance(i, i % 5 === 1 || i % 5 === 3), {
    position: new T.Vector3(...seat.position), angle: seat.angle ?? 0, scale: .97 + (i % 4) * .018, gait: 0, walking: false, seated: true, driving: seat.driving,
    headTurn: i % 7 === 2 ? .12 : i % 7 === 5 ? -.15 : 0,
  }, 'travel'));
  passengers.flush(); return passengers.group;
}
