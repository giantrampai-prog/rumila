# Jelajah Angkasa — visual and motion update

Implementation branch: `codex/angkasa-realism`, based on `524f1c3`. This isolated checkout preserves the separate uncommitted Rocket and Coding work in `rumila-app`.

## Review locally

```sh
RUMILA_DIST_DIR=.next-angkasa-dev npm run dev -- --hostname 127.0.0.1 --port 3101
```

- `/dev/angkasa`: complete child experience, including launch, exploration and tour.
- `/dev/angkasa?obj=earth`: begin at Earth.
- `/dev/angkasa/launch`: development-only timeline slider to inspect the actual launch scene. Reports render counts and animation frame rate; these measurements do not represent physical phone performance.
- `/jelajah-angkasa`: authenticated application route.

## Visual changes

- Foreground coastal terrain with multi-scale grass detail, raised concrete landing pad, expansion joints, recessed perimeter lights and soft ship/astronaut shadows.
- Instanced tropical trees, branching trunks, curved palm fronds, bushes and grass tufts. Leaf movement also drives the shadow material. Five GPT Image materials are reused from the existing Rumila Rocket work; see `launch-material-provenance.json` for prompts. The existing distant mountain/beach panorama remains photographic; it is not newly reconstructed terrain.
- Photographic GPT Image cloud billboards replace the coarse procedural cloud puffs in the ascent.
- Animated coastal water with ripples, view-dependent reflection, sun highlights and shoreline foam.
- Existing Rinoya GLB retains its authored color, normal, metallic and roughness maps; anisotropic filtering and scene lighting improve its appearance. No new spaceship mesh is claimed.
- Earth cloud-shell shadows follow the rotating clouds. Night lights use defined GLSL interpolation edges. Atmospheric shells are thinner and less saturated. Saturn's ring shadows are applied to linear lighting before tone mapping.
- Focused globes use higher tessellation. Existing scientific planet maps and source records are retained. The subtle rocky-surface bump uses color-map contrast for illustrative micro-relief, **not measured elevation**. Learning-mode size/distance simplifications remain unchanged.

## Motion and rendering

- The intro lasts 22 seconds, with a stable horizon, gentle deterministic camera vibration, reduced banking and no barrel roll.
- Camera travel uses a quaternion arc and logarithmic zoom; opposite camera directions no longer send the camera through the globe. Flight progress uses visible-frame elapsed time, so returning to a hidden tab does not skip the flight.
- Orbit damping is normalized by elapsed time. Information-card measurements reserve visible space above the HUD on desktop and mobile.
- Ground intro replaces the hidden solar render. Distant trees are excluded from the local shadow pass. Smoke sprites are pooled instead of allocated every frame.
- Close-up geometry is released when selection changes; low-power devices use 2K maps. Late texture/GLB loads are guarded after disposal, and stale low-resolution maps cannot overwrite a more recent detail request.

## Validation

- Angkasa suite: 63 tests, including antipodal camera flight, frame-rate-independent damping, out-of-order texture loading and close-up geometry release.
- TypeScript, scoped ESLint and isolated production build.
- Browser review: launch foreground, Earth, Saturn and ring shadows, mouse rotation, planet selection, mobile card layout, tour entry/exit and WebGL console errors.
- Build output and dev cache use separate directories to avoid Next.js cache collisions. No production deployment is performed by this change.

```sh
npm test -- src/lib/angkasa/__tests__
RUMILA_DIST_DIR=.next-angkasa-build npm run build
```
