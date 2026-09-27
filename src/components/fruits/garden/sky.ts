// Langit realistis Kebun Buah: atmosfer fisik (hamburan Rayleigh & Mie, Matahari bercahaya) + lapisan awan
// kumulus prosedural yang bergerak pelan tertiup angin, bagian bawahnya lebih gelap (tebal), tepinya terang.

import * as T from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export function buildRealSky(sunDir: T.Vector3, uTime: { value: number }) {
  const g = new T.Group();
  const sky = new Sky();
  sky.scale.setScalar(290);
  const u = sky.material.uniforms;
  u.turbidity.value = 2.2;
  u.rayleigh.value = 2.4;
  u.mieCoefficient.value = 0.003;
  u.mieDirectionalG.value = 0.82;
  u.sunPosition.value.copy(sunDir).multiplyScalar(100);
  sky.frustumCulled = false;
  // digambar paling dulu & tidak menutupi bukit di kejauhan
  sky.material.depthTest = false;
  sky.material.depthWrite = false;
  sky.renderOrder = -10;
  g.add(sky);

  const clouds = new T.Mesh(
    new T.SphereGeometry(270, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.BackSide,
      fog: false,
      uniforms: { uTime, uSun: { value: sunDir.clone().normalize() } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime; uniform vec3 uSun; varying vec3 vDir;
        float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
        float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 6; i++){ s += a * n(p); p = p * 2.03 + 3.1; a *= 0.5; } return s; }
        void main(){
          vec3 d = normalize(vDir);
          if (d.y < 0.015) discard;
          // proyeksi ke bidang awan setinggi ±1,5 km; angin menggeser pelan
          vec2 p = d.xz / (d.y + 0.12) * 1.6 + vec2(uTime * 0.012, uTime * 0.004);
          float base = fbm(p * 1.1);
          float detail = fbm(p * 4.0 + base * 1.5);
          float dens = smoothstep(0.64, 0.9, base * 0.8 + detail * 0.35);
          if (dens < 0.01) discard;
          // penerangan: sisi ke arah Matahari terang, bagian tebal & bawah keabu-abuan
          float toward = fbm((p + uSun.xz * 0.12) * 1.1) * 0.8 + detail * 0.35;
          float shade = clamp(1.0 - (toward - (base * 0.8 + detail * 0.35)) * 3.0, 0.0, 1.0);
          vec3 lit = vec3(1.0, 0.985, 0.96), dark = vec3(0.62, 0.66, 0.74);
          vec3 col = mix(dark, lit, clamp(0.35 + shade * 0.5 + (1.0 - dens) * 0.4, 0.0, 1.0));
          float sunGlow = pow(max(dot(d, normalize(uSun)), 0.0), 8.0);
          col += vec3(1.0, 0.9, 0.7) * sunGlow * 0.35 * (1.0 - dens);
          float horizon = smoothstep(0.015, 0.22, d.y);
          gl_FragColor = vec4(col, dens * 0.95 * horizon);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  );
  clouds.frustumCulled = false;
  g.add(clouds);
  return g;
}
