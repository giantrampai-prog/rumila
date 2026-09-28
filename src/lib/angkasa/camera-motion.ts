import { Quaternion, Vector3 } from 'three';

const rotation = new Quaternion(), arc = new Quaternion();
const a = new Vector3(), b = new Vector3();

/** Orbit around the target, including antipodal endpoints, without passing through the planet. */
export function cameraOffset(from: Vector3, to: Vector3, progress: number, out: Vector3) {
  const t=Math.max(0,Math.min(1,progress));
  const r0=Math.max(1e-4,from.length()),r1=Math.max(1e-4,to.length());
  a.copy(from).divideScalar(r0); b.copy(to).divideScalar(r1);
  if(a.lengthSq()<.5)a.copy(b.lengthSq()>.5?b:new Vector3(0,0,1));
  if(b.lengthSq()<.5)b.copy(a);
  rotation.setFromUnitVectors(a,b);
  arc.identity().slerp(rotation,t);
  return out.copy(a).applyQuaternion(arc).multiplyScalar(Math.exp(Math.log(r0)+(Math.log(r1)-Math.log(r0))*t));
}

/** Same orbit damping at 30, 60 and 120 Hz. */
export function orbitDamping(dt: number) { return 1-Math.pow(1-.08,Math.max(0,dt)*60); }
