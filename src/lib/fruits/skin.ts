import * as T from 'three';
import type { Fruit } from './catalog';
const random=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
function noise(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return T.MathUtils.lerp(T.MathUtils.lerp(random(ix,iy),random(ix+1,iy),sx),T.MathUtils.lerp(random(ix,iy+1),random(ix+1,iy+1),sx),sy);}
/** Microgeometry in real material channels, independent of interface colors. */
export function applyFruitSkin(root:T.Object3D,fruit:Fruit,width=1024){
 const height=width/2,bump=new Uint8Array(width*height*4),rough=new Uint8Array(width*height*4),albedo=new Uint8Array(width*height*4);
 const shape=fruit.shape,citrus=shape==='citrus'||fruit.id==='lemon'||fruit.id==='jeruk-bali';
 const base=new T.Color(fruit.color).convertLinearToSRGB(),accent=new T.Color(fruit.accent).convertLinearToSRGB();
 const sample=new T.Color();
 const polished=['apple','waxapple','cherries','grapes','pomegranate','mangosteen','persimmon'].includes(shape);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=x/width,v=y/height,grain=random(x,y),low=noise(u*32,v*16),mid=noise(u*170,v*85);
  let relief=.48+grain*.12+mid*.13,roughness=polished?.42:.76,blend=.08+low*.18;
  if(citrus||['avocado','guava','mango'].includes(shape)){const pore=grain>.91?-.4:0;relief=.56+mid*.13+pore;roughness=.60+low*.17;}
  if(shape==='melon'&&fruit.id!=='blewah'){
   const warpU=u*40+noise(u*12,v*6)*1.9,warpV=v*22+noise(u*9+2,v*7)*1.8;
   const a=Math.abs(Math.sin(warpU*Math.PI)),b=Math.abs(Math.sin(warpV*Math.PI));const net=Math.min(a,b)<.12?1:0;
   relief=.31+net*.44+grain*.08;roughness=.85;blend=net?.96:.06+low*.13;
  }
  if(shape==='salak'){
   const row=Math.floor(v*42),fx=(u*70+(row%2)*.5)%1,fy=(v*42)%1;
   const edge=Math.abs(fx-.5)*1.8+Math.abs(fy-.45)*.72;
   relief=.25+Math.max(0,1-edge)*.53+grain*.07;roughness=.66+grain*.12;blend=Math.max(0,1-edge)*.65;
  }
  if(shape==='coconut'){const fiber=noise(u*320+noise(u*18,v*12)*3,v*19);relief=.25+fiber*.40+noise(u*690,v*36)*.20+grain*.10;roughness=.94;blend=.12+fiber*.52+low*.12;}
  if(shape==='kiwi'||shape==='peach'){relief=.42+grain*.35;roughness=.96;}
  if(shape==='date'){relief=.5+.20*Math.sin(u*135+noise(u*7,v*19)*9)+grain*.06;roughness=.60;}
  if(shape==='watermelon'){relief=.46+grain*.025+mid*.07;roughness=.58+low*.08;}
  if(['durian','soursop','jackfruit','pineapple','custard','lychee'].includes(shape)){relief=.40+mid*.30+grain*.12;roughness=.80+grain*.14;}
  if(shape==='banana'){relief=.43+grain*.13+low*.06;roughness=.71+low*.12;}
  if(shape==='apple')blend=Math.max(0,Math.sin(u*19+v*8)+noise(u*52,v*20)-.7)*.45+low*.1;
  if(shape==='mango')blend=T.MathUtils.smoothstep(v+low*.35,.25,.88)*.87;
  if(shape==='papaya')blend=Math.pow(low,3)*.68;
  if(shape==='watermelon'){const band=Math.sin(u*Math.PI*22+noise(u*10,v*25)*1.8),mottle=noise(u*140,v*85);blend=T.MathUtils.smoothstep(band+(mottle-.5)*1.7+(mid-.5)*.8,-.2,.5)*(.48+mottle*.45);}
  if(shape==='peach')blend=T.MathUtils.smoothstep(Math.sin(u*7+v*2)+low,0,1.4)*.88;
  if(shape==='grapes'||fruit.id==='plum')blend=T.MathUtils.smoothstep(low+mid*.16,.42,.78)*.55;
  if(fruit.id==='blewah')blend=Math.pow(.5+.5*Math.cos(u*Math.PI*20),6)*.72;
  if(shape==='banana')blend=(noise(u*180,v*260)>.73?.42:0)+(v<.025||v>.985?.85:0);
  const index=(y*width+x)*4,b=T.MathUtils.clamp(relief*255,0,255),r=T.MathUtils.clamp(roughness*255,0,255);
  let tint=.91+low*.065+mid*.035;
  if(citrus)tint=.86+low*.09+mid*.05;
  if(['banana','pear','oval'].includes(shape)&&grain>.992)tint=.52;
  if(shape==='salak')tint=.75+relief*.25;
  if(shape==='date')tint=.80+relief*.2;
  sample.copy(base).lerp(accent,T.MathUtils.clamp(blend,0,1)).multiplyScalar(tint);
  albedo[index]=Math.round(sample.r*255);albedo[index+1]=Math.round(sample.g*255);albedo[index+2]=Math.round(sample.b*255);albedo[index+3]=255;
  bump[index]=bump[index+1]=bump[index+2]=b;bump[index+3]=255;rough[index]=rough[index+1]=rough[index+2]=r;rough[index+3]=255;
 }
 const bumpMap=new T.DataTexture(bump,width,height,T.RGBAFormat),roughnessMap=new T.DataTexture(rough,width,height,T.RGBAFormat),map=new T.DataTexture(albedo,width,height,T.RGBAFormat);
 map.colorSpace=T.SRGBColorSpace;
 for(const texture of [bumpMap,roughnessMap,map]){texture.wrapS=T.RepeatWrapping;texture.wrapT=T.ClampToEdgeWrapping;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;}
 const fuzz=['kiwi','peach'].includes(shape),rind=citrus||['salak','melon','avocado'].includes(shape);
 root.traverse(object=>{if(!(object instanceof T.Mesh)||!object.userData.fruitSurface)return;
  const old=object.material as T.MeshStandardMaterial;
  const skin=new T.MeshPhysicalMaterial({color:'#ffffff',roughness:1,map,roughnessMap,bumpMap,bumpScale:rind?.022:fuzz?.017:.008,metalness:0,clearcoat:polished?.22:.035,clearcoatRoughness:polished?.28:.7,sheen:fuzz?.5:0,sheenColor:'#d9bf91',sheenRoughness:1,specularIntensity:.7});
  old.dispose();object.material=skin;
 });
}
