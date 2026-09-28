import * as T from 'three';

/** A tapered, closed radial surface swept along a curve; longitudinal/radial UVs stay continuous. */
export function organicTube(curve: T.Curve<T.Vector3>, radius: (u: number, angle: number) => number, segments = 56, sides = 16) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [], uv: number[] = [], indices: number[] = [];
  for (let j = 0; j <= segments; j++) {
    const u = j / segments, c = curve.getPointAt(u);
    for (let k = 0; k <= sides; k++) {
      const a = k / sides * Math.PI * 2, r = radius(u, a);
      const p = c.clone().addScaledVector(frames.normals[j], -Math.cos(a) * r).addScaledVector(frames.binormals[j], Math.sin(a) * r);
      positions.push(p.x,p.y,p.z); uv.push(k/sides,u);
      if(j<segments&&k<sides) {
        const n=j*(sides+1)+k;
        indices.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2);
      }
    }
  }
  // Center vertices close the two ends; avoid the visible cut cylinders used by the old models.
  for(const [j,reverse] of [[0,true],[segments,false]] as const) {
    const c=curve.getPointAt(j/segments), center=positions.length/3;
    positions.push(c.x,c.y,c.z); uv.push(.5,j/segments);
    for(let k=0;k<sides;k++) {
      const n=j*(sides+1)+k;
      if(reverse) indices.push(center,n,n+1); else indices.push(center,n+1,n);
    }
  }
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  geo.setIndex(indices); geo.computeVertexNormals();
  // Share the smooth radial seam normal without welding the UV seam.
  const normals=geo.attributes.normal;
  for(let j=0;j<=segments;j++) {
    const a=j*(sides+1), b=a+sides;
    const n=new T.Vector3().fromBufferAttribute(normals,a).add(new T.Vector3().fromBufferAttribute(normals,b)).normalize();
    normals.setXYZ(a,n.x,n.y,n.z); normals.setXYZ(b,n.x,n.y,n.z);
  }
  geo.computeBoundingBox(); geo.computeBoundingSphere(); return geo;
}

export const path = (points: number[][]) => new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p as [number,number,number])));

export function surfaceGrid(sample:(u:number,v:number)=>T.Vector3, rows=32, columns=12) {
  const positions:number[]=[],uv:number[]=[],idx:number[]=[];
  for(let j=0;j<=rows;j++) for(let i=0;i<=columns;i++) {
    const p=sample(j/rows,i/columns);positions.push(p.x,p.y,p.z);uv.push(i/columns,j/rows);
    if(j<rows&&i<columns){const n=j*(columns+1)+i;idx.push(n,n+1,n+columns+1,n+1,n+columns+2,n+columns+1);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
