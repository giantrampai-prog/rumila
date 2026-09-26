# Jelajah Tubuh 3D implementation evidence

Development catalogue, 26 September 2026. Not an acceptance or anatomical
release sign-off. The complete remaining requirements are also exposed in
`public/anatomy/manifest.json` under `missing` and in the module source dialog.

Implemented: Rumila Playful interface, fullscreen/responsive study stage,
volumetric GLB atlas with stable node IDs, natural tissue palette, lazy detail
packages, named search/layers/regions, selection, focus/isolation and restore,
absolute reversible disassembly, named child navigation, source information,
optional Indonesian speech, simplified cardiac path animation, three-question
exercise, profile-scoped completion/time events, and reports integration.

Expanded groups include eyes with named internal components, external/middle
ears, a separate NIH inner-ear inset, nose, mouth with 28 permanent teeth,
hands and feet. Logical assemblies are explicitly marked and contain no fake
proxy anatomy. The catalogue does not include all structures requested in the
PRD; 28 teeth does not mean complete adult or pediatric dentition.

Validation: production build, TypeScript and 12 automated tests passed after the expanded export.
Tests cover GLB node ownership, manifests, package hashes/budgets, reversible
transforms, hidden selection, restored state, profile permission and completion
deduplication. Earlier headless Chromium checks covered desktop/mobile layouts,
selection, isolation/interior, loading retry, context-loss recovery and profile
switching, with screenshots under `output/playwright`. Screenshots are visual
development evidence, not proof of anatomical accuracy or physical-phone speed.

Still required: anatomical review; curated closed section surfaces and cardiac
septa; real contraction/valve, respiratory and joint animations; nephron,
alveolus and skin microstructure; complete muscles/nerves/lymphatic inventory;
female anatomy variant; deciduous/wisdom teeth and tooth interiors; registered
inner ear; physical midrange-phone performance. Current cuts expose uncapped
edges. Geometry/materials remain below the user's requested photoreal quality.
GPT-to-3D status is documented separately in `GPT-TO-3D.md`.

The new development route `/dev/anatomy-assets` displays the actual GPT-image
reconstruction as a separately labeled geometry candidate. It offers orbit,
zoom, four views, wireframe, auto-rotation and GLB download. It does not write
learning data and is unavailable in production. Its source-derived proportions,
textures and semantic anatomical subdivision are not accepted for teaching yet.

Review-page verification (26 September 2026): production build and scoped ESLint
passed. The production prerender contains `NEXT_HTTP_ERROR_FALLBACK;404`.
The browser displayed the 300,000-triangle model at 1280×720 and 390×844;
wireframe toggling, auto-rotation, reset and rear view were visually checked.
No browser console errors were captured. The viewport override was reset.

Editable source files and upstream archives are present locally under
`sources/anatomy/`, which is ignored by Git. They are not included in a commit
or remote distribution. No commit, push, deployment or production sign-off has
been performed by this task.
