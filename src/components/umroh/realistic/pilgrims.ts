import * as T from 'three';
import type { Position, Rect, UmrohWorld, WorldResources } from './types';
import { HumanBatch, humanAppearance, type Attire, type HumanAppearance, type HumanPose } from './human';
import { RealisticHumanBatch } from './character-batch';

interface Person { x: number; z: number; angle: number; scale: number; phase: number; appearance: HumanAppearance }
const position = new T.Vector3();

/** Human-scale, articulated walkers with a shared GPU-instanced wardrobe and face geometry. */
export class Pilgrims {
  readonly group: T.Group;
  private bodies: HumanBatch;
  private realistic: RealisticHumanBatch;
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
    this.bodies = new HumanBatch(r, count);
    this.realistic = new RealisticHumanBatch(r, count);
    this.group = new T.Group(); this.group.name = main ? 'Selected pilgrim' : 'Pilgrim crowd'; this.group.userData.dynamic = true;
    this.group.add(this.bodies.group, this.realistic.group);
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
      const pose = { position: position.set(x, 0, z), angle, scale: p.scale, gait: this.elapsed * 4.5 + p.phase, walking };
      this.bodies.pose(i, p.appearance, pose, this.attire);
      this.realistic.pose(i, p.appearance, pose, this.attire);
      if (!p.appearance.female && this.realistic.isReady(this.attire)) this.bodies.hide(i);
    });
    this.bodies.flush(); this.realistic.flush();
  }
  dispose(): void { this.bodies.dispose(); this.realistic.dispose(); this.group.removeFromParent(); }
}

/** Seat positions are cushion/hip positions. A zero angle faces +Z; PI faces -Z. */
export function createSeatedPassengers(r: WorldResources, seats: readonly { position: Position; angle?: number; driving?: boolean }[]): T.Group {
  const passengers = new HumanBatch(r, seats.length, true);
  const group = new T.Group(); group.name = 'Seated passengers'; group.userData.dynamic = true;
  const update = () => {
    seats.forEach((seat, i) => {
      const appearance = humanAppearance(i, i % 5 === 1 || i % 5 === 3);
      const pose = { position: new T.Vector3(...seat.position), angle: seat.angle ?? 0, scale: .97 + (i % 4) * .018, gait: 0, walking: false, seated: true, driving: seat.driving,
        headTurn: i % 7 === 2 ? .12 : i % 7 === 5 ? -.15 : 0 };
      passengers.pose(i, appearance, pose, 'travel'); realistic.pose(i, appearance, pose, 'travel');
      if (!appearance.female && realistic.isReady('travel', pose)) passengers.hide(i);
    });
    passengers.flush(); realistic.flush();
  };
  const realistic = new RealisticHumanBatch(r, seats.length, true, update);
  group.add(passengers.group, realistic.group);
  group.userData.disposeCharacters = () => { realistic.dispose(); passengers.dispose(); };
  update(); return group;
}

export interface StandingPerson {
  position: Position; angle?: number; female?: boolean;
  /** Uniform colours, for example airport staff or cabin crew. */
  colors?: Partial<Record<'shirt' | 'trousers' | 'dress' | 'scarf', string>>;
  pose?: Partial<Pick<HumanPose, 'arms' | 'forearms' | 'headTurn'>>;
}
/** Static or individually re-posed standing figures (staff, crew, queueing travellers). */
export class StandingPeople {
  readonly group: T.Group;
  private batch: HumanBatch;
  private appearances: HumanAppearance[];
  constructor(r: WorldResources, private people: StandingPerson[]) {
    this.batch = new HumanBatch(r, people.length); this.group = this.batch.group; this.group.name = 'Petugas dan penumpang berdiri';
    this.appearances = people.map((person, i) => {
      const appearance = humanAppearance(i + 3, person.female ?? i % 2 === 1);
      for (const [slot, value] of Object.entries(person.colors ?? {})) appearance[slot as 'shirt'].set(value);
      return appearance;
    });
    people.forEach((_, i) => this.pose(i));
    this.batch.flush();
  }
  /** Re-poses one figure; call flush() after a batch of updates. */
  pose(index: number, override: Partial<Pick<HumanPose, 'arms' | 'forearms' | 'headTurn' | 'walking' | 'gait'>> & { position?: Position; angle?: number } = {}): void {
    const person = this.people[index];
    const { position: at, angle, ...limbs } = override;
    this.batch.pose(index, this.appearances[index], {
      gait: 0, walking: false, ...person.pose, ...limbs,
      position: new T.Vector3(...(at ?? person.position)), angle: angle ?? person.angle ?? 0, scale: .98 + (index % 3) * .02,
    }, 'travel');
  }
  flush(): void { this.batch.flush(); }
}
