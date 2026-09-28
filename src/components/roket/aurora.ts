import * as T from 'three';

/** Continuous folded curtains with thin vertical emission strands and feathered ends. */
export function createAurora(bottom:number, top:number) {
  const mat=new T.ShaderMaterial({
    uniforms:{uTime:{value:0},uAlpha:{value:0}},
    transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
    vertexShader:`uniform float uTime;varying vec2 curtainUv;
      void main(){curtainUv=uv;vec3 p=position;
        float folds=sin(uv.x*24.+uTime*.11)*3.+sin(uv.x*59.-uTime*.08)*1.2;
        p.x+=folds*uv.y;p.z+=folds*.65*uv.y;
        p.y+=sin(uv.x*17.+uTime*.06)*2.*(1.-uv.y);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader:`uniform float uTime;uniform float uAlpha;varying vec2 curtainUv;
      float hash(float n){return fract(sin(n*127.1)*43758.5453);}
      float noise(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(hash(i),hash(i+1.),f);}
      void main(){
        float u=curtainUv.x,v=curtainUv.y;
        float flow=u+sin(u*13.+uTime*.08)*.007;
        float ray=noise(flow*480.)*.45+noise(flow*930.)*.32+noise(flow*171.)*.23;
        float edge=smoothstep(0.,.045,u)*(1.-smoothstep(.94,1.,u));
        float lower=.08+sin(u*18.+uTime*.06)*.025+noise(u*24.)*.022;
        float green=smoothstep(lower-.025,lower+.024,v)*exp(-max(0.,v-lower)*6.5);
        float red=exp(-pow((v-.43)/.23,2.))*.13;
        float heightFade=1.-smoothstep(.58,.98,v);
        float strands=.38+.62*pow(ray,1.35);
        vec3 color=vec3(.15,.85,.39)*green+vec3(.52,.09,.18)*red;
        float alpha=edge*heightFade*strands*uAlpha*.48;
        gl_FragColor=vec4(color,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const group=new T.Group();group.name='aurora-curtains';
  for(let layer=0;layer<3;layer++) {
    const positions:number[]=[],uv:number[]=[],indices:number[]=[];
    const columns=180,rows=28,radius=260+layer*32;
    for(let y=0;y<=rows;y++) for(let x=0;x<=columns;x++) {
      const u=x/columns,v=y/rows,a=layer*1.5+u*2.65;
      const fold=Math.sin(u*25+layer)*9+Math.sin(u*53)*3;
      positions.push(Math.sin(a)*(radius+fold),bottom+v*(top-bottom)+layer*8,Math.cos(a)*(radius+fold));uv.push(u,v);
      if(x<columns&&y<rows){const n=y*(columns+1)+x;indices.push(n,n+1,n+columns+1,n+1,n+columns+2,n+columns+1);}
    }
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);
    group.add(new T.Mesh(geometry,mat));
  }
  return {group,mat};
}
