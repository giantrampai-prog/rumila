// Color grading sinematik Umroh Virtual: sedikit hangat, saturasi naik tipis, kontras lembut, dan vinyet.
// Dijalankan di ruang linear (sebelum OutputPass melakukan tone mapping ACES & sRGB).

export type QualityTier = 'tinggi' | 'hemat';

/** Pilih mutu dari kemampuan perangkat; tablet/HP kelas bawah memakai mode hemat (tanpa ambient occlusion). */
export function qualityTier(env: { memory?: number; cores?: number; narrow?: boolean } = {}): QualityTier {
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : undefined;
  const memory = env.memory ?? nav?.deviceMemory ?? 8;
  const cores = env.cores ?? nav?.hardwareConcurrency ?? 4;
  const narrow = env.narrow ?? (typeof window !== 'undefined' && window.matchMedia('(max-width: 800px)').matches);
  if (memory < 4 || cores < 4) return 'hemat';
  if (narrow && (memory < 6 || cores < 6)) return 'hemat';
  return 'tinggi';
}

export const GRADING_SHADER = {
  name: 'UmrohGrading',
  uniforms: {
    tDiffuse: { value: null },
    uWarmth: { value: 0.045 },
    uSaturation: { value: 1.1 },
    uContrast: { value: 1.06 },
    uVignette: { value: 0.28 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uWarmth, uSaturation, uContrast, uVignette;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = c.rgb;
      // hangat: angkat merah-kuning, tekan biru sedikit
      col *= vec3(1.0 + uWarmth, 1.0 + uWarmth * 0.45, 1.0 - uWarmth * 0.6);
      // saturasi di sekitar luminans
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, uSaturation);
      // kontras lembut di sekitar abu tengah linear (0.18)
      col = max(vec3(0.0), (col - 0.18) * uContrast + 0.18);
      // vinyet halus
      vec2 d = vUv - 0.5;
      float v = smoothstep(0.85, 0.25, length(d * vec2(1.15, 1.0)));
      col *= mix(1.0 - uVignette, 1.0, v);
      gl_FragColor = vec4(col, c.a);
    }
  `,
};
