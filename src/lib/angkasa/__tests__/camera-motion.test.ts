import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { cameraOffset, orbitDamping } from '../camera-motion';

describe('smooth camera flight',()=>{
  it('flies around a planet when the destination is directly behind it',()=>{
    const from=new Vector3(0,0,10),to=new Vector3(0,0,-10),out=new Vector3();
    for(let i=0;i<=100;i++)expect(cameraOffset(from,to,i/100,out).length()).toBeCloseTo(10,8);
    expect(cameraOffset(from,to,1,out).distanceTo(to)).toBeLessThan(1e-8);
  });
  it('zooms logarithmically while following the shortest arc',()=>{
    const out=cameraOffset(new Vector3(0,0,100),new Vector3(4,0,0),.5,new Vector3());
    expect(out.length()).toBeCloseTo(20);
    expect(out.x).toBeCloseTo(out.z);
    expect(out.y).toBeCloseTo(0);
  });
  it('has finite output even for a degenerate starting offset',()=>{
    const p=cameraOffset(new Vector3(),new Vector3(1,0,0),.5,new Vector3());
    expect(p.toArray().every(Number.isFinite)).toBe(true);
    expect(p.length()).toBeGreaterThan(0);
  });
  it('damps the same residual motion after one second on different displays',()=>{
    const residual=[30,60,120].map(hz=>Math.pow(1-orbitDamping(1/hz),hz));
    expect(residual[0]).toBeCloseTo(residual[1],10);
    expect(residual[1]).toBeCloseTo(residual[2],10);
  });
});
