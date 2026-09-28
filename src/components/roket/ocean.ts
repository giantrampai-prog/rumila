import * as T from 'three';
import { COAST_GLSL, groundY } from './terrain-math';
import { NOISE_GLSL } from './surface-materials';

// The same height + analytic slopes are used in both stages, so highlights follow the moving mesh.
const WAVES = `
  vec3 waves(vec2 p,float t){
    vec3 w=vec3(0.0);
    vec4 spec[5]=vec4[5](vec4(0.96,0.28,0.045,5.8),vec4(-0.78,0.63,0.034,3.1),
      vec4(0.83,-0.55,0.013,1.5),vec4(0.28,0.96,0.006,0.72),vec4(-0.48,-0.88,0.003,0.31));
    for(int i=0;i<5;i++){
      vec2 d=normalize(spec[i].xy);float k=6.283185/spec[i].w;
      vec2 crossDir=vec2(-d.y,d.x);
      float along=dot(p,d)*0.18+float(i);
      float bend=dot(p,crossDir)*0.67+sin(along)*0.9+float(i)*2.1;
      vec2 bendSlope=crossDir*0.67+cos(along)*0.162*d;
      float ph=dot(p,d)*k+sin(bend)*2.2-t*sqrt(0.98*k)+float(i)*1.71;
      w.x += sin(ph)*spec[i].z;
      w.yz += cos(ph)*spec[i].z*(k*d+cos(bend)*2.2*bendSlope);
    }
    return w;
  }
`;

export function buildOcean(sun:T.Vector3,low:boolean) {
  const geo=new T.RingGeometry(0.01,900,low?192:320,low?110:180);
  geo.rotateX(-Math.PI/2);
  const p=geo.getAttribute('position');
  for(let i=0;i<p.count;i++) {
    const x=p.getX(i),z=p.getZ(i),d=Math.hypot(x,z)/900,k=Math.pow(d,2.1)/Math.max(d,1e-8);
    p.setXYZ(i,x*k,-0.12+groundY(x*k,z*k),z*k);
  }
  geo.computeBoundingSphere();
  const mat=new T.ShaderMaterial({
    uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{uTime:{value:0},uSun:{value:sun.clone().normalize()},uSky:{value:new T.Color('#bbcbd2')},uZenith:{value:new T.Color('#5e94b8')}}]),
    fog:true,transparent:true,depthWrite:false,
    vertexShader:`uniform float uTime;varying vec3 vW; ${COAST_GLSL} ${WAVES}
      #include <fog_pars_vertex>
      void main(){
        vec3 pos=position;
        float shore=pos.x-coast(pos.z);
        pos.y+=waves(pos.xz,uTime).x*smoothstep(-0.4,3.0,shore);
        vec4 w=modelMatrix*vec4(pos,1.0);vW=w.xyz;
        vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader:`uniform float uTime;uniform vec3 uSun;uniform vec3 uSky;uniform vec3 uZenith;varying vec3 vW;
      #include <fog_pars_fragment>
      ${COAST_GLSL} ${NOISE_GLSL} ${WAVES}
      void main(){
        vec2 p=vW.xz;float shore=p.x-coast(p.y);
        if(shore < -0.55) discard;
        float dist=length(cameraPosition-vW);
        vec3 wave=waves(p,uTime);
        float damp=smoothstep(-0.4,3.0,shore);
        float microFade=1.0-smoothstep(12.0,85.0,dist);
        vec2 fine=vec2(sin(p.x*33.0+sin(p.y*27.0)+uTime*1.7),sin(p.y*31.0+sin(p.x*29.0)-uTime*1.3))*0.016*microFade;
        vec3 n=normalize(vec3(p.x/1000.0-wave.y*damp-fine.x,1.0,p.y/1000.0-wave.z*damp-fine.y));
        vec3 v=normalize(cameraPosition-vW),reflection=reflect(-v,n);
        float fres=0.02+0.98*pow(1.0-max(dot(n,v),0.0),5.0);
        vec3 sky=mix(uSky,uZenith,smoothstep(0.0,0.8,reflection.y));
        float cloud=rf(reflection.xz/max(0.1,reflection.y)*2.3);
        sky=mix(sky,vec3(0.71,0.75,0.76),smoothstep(0.56,0.77,cloud)*0.45);
        float depth=smoothstep(0.0,25.0,shore);
        vec3 water=mix(vec3(0.035,0.28,0.25),vec3(0.008,0.074,0.105),depth);
        water*=0.8+rf(p*0.35)*0.25;
        // Thin migrating caustic lines remain confined to transparent shallow water.
        float net=pow(1.0-abs(sin(p.x*5.0+sin(p.y*3.7)+uTime*.6)*sin(p.y*4.7-uTime*.4)),16.0);
        water+=vec3(0.035,0.055,0.038)*net*(1.0-smoothstep(1.0,6.0,shore))*microFade;
        vec3 col=mix(water,sky,fres);
        float sunDot=max(dot(reflection,uSun),0.0);
        col+=vec3(1.0,0.88,0.69)*(pow(sunDot,700.0)*5.0+pow(sunDot,65.0)*0.12);
        // Breaking fronts travel towards the shore; wet swash recedes between waves.
        float wash=0.22+0.18*sin(uTime*0.65+p.y*0.24);
        float front=sin(shore*3.3+uTime*1.0+sin(p.y*.85)*.5);
        float lace=smoothstep(0.28,0.66,rf(p*19.0+uTime*.07));
        float breaker=smoothstep(0.83,0.99,front)*(1.0-smoothstep(0.5,3.0,shore));
        float edge=(1.0-smoothstep(0.05,0.30,abs(shore-wash)));
        float foam=clamp((breaker*.7+edge*.65)*lace,0.0,0.85);
        col=mix(col,vec3(0.79,0.84,0.8),foam);
        float alpha=mix(0.42,0.98,smoothstep(-0.1,2.8,shore))*smoothstep(-0.55,-0.1,shore);
        gl_FragColor=vec4(col,max(alpha,foam*.8));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
  const mesh=new T.Mesh(geo,mat);mesh.name='ocean';mesh.renderOrder=2;
  return {mesh,mat};
}
