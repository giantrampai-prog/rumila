# GPT reference to textured 3D

Date: 26 September 2026. Status: GPT reference converted to a real volumetric
heart GLB using the official Tencent Hunyuan3D 2.1 demo. Geometry review only;
natural textures, semantic separation and anatomical approval remain pending.

The user requested GPT-generated organ images before 3D generation. Interface
colors remain Rumila Playful; organ materials follow natural tissue colors.

## Delivered reference

- File: `public/anatomy/references/heart-gpt-reference.png`
- Mode: built-in `image_gen.imagegen`, new image, no source image.
- Subject: external human heart, anterior slight three-quarter view, complete
  silhouette, natural reddish brown tissue, epicardial fat and coronary vessels.
- Confirmed Higgsfield image input: `5abeb013-d44f-4451-b8b4-5a7d6a081a0b`.
- The generated image was visually inspected. Its surface detail and natural
  colors are a production direction, not proof of anatomical accuracy.

## Exact image prompt

Create one exceptionally detailed, realistic anatomical heart asset reference for a children's science education 3D application. Single complete adult human heart, external anterior view with very slight three-quarter perspective, centered and entirely visible, apex downward toward viewer's right, occupying 82% of square composition. Correct asymmetric ventricular mass, atrial appendages, naturally proportioned ascending aorta and aortic arch with three superior branches, pulmonary trunk, vena cava, visible anterior interventricular coronary vessels embedded in subtle pale epicardial fat. Rich natural muted reddish brown myocardial tissue with fine organic surface variation, cream pale yellow fat in coronary grooves, ivory pink vessel walls; vessels natural tissue colors, absolutely no artificial blue purple color coding. Medical atlas sculpture quality, not a Valentine heart. Educational clean non-bloody specimen with convincing organic microtexture, satin soft specular highlights, no wax/plastic look, no gore, no cuts, no exposed chambers. Gentle neutral studio light, no harsh shadows, tack-sharp all-over focus, white seamless background, no ground plane, no text, labels, watermark, border or props. This is a production reference for image-to-3D reconstruction: clear silhouette, no occluding objects, no dramatic perspective, no blurry regions. Render highest possible quality and detail.

## Successful geometry conversion

- Generator: https://huggingface.co/spaces/tencent/Hunyuan3D-2.1
- 30 steps, guidance 5, seed 260926, octree 512, background removal enabled.
- Service reported 3,270,224 triangles and 1,635,043 vertices. Blender imported
  3,270,194 triangles (30 fewer than the service report).
- Source: `sources/anatomy/generated-heart/heart-generated-raw.glb` (58,864,480 bytes).
- Editable review: `sources/anatomy/generated-heart/review/review-master.blend`.
- Browser GLB: `public/anatomy/review/heart-shape.glb`, 300,000 triangles,
  1,776,432 bytes. Meshopt compressed, re-imported and verified.
- Preview: `/dev/anatomy-assets` (development only; production route is 404).
- Four-sided review renders: `public/anatomy/review/{front,back,left,right}.png`.
- Receipt and geometry report: `heart-generation-receipt.json` and
  `heart-review-report.json` in this directory. Raw/editable sources are local
  and ignored by Git; the compressed review output is in the project assets.

Visual inspection confirms full volume. The posterior vessel arrangement,
branch endpoints, smooth tissue boundaries and absent coronary detail need
correction. Zero non-manifold edges does not establish correct vessel lumens,
internal chambers or anatomical correctness. This is a single merged exterior,
not the modular acceptance asset. It has no UV maps or natural PBR textures.
It is deliberately excluded from the teaching atlas manifest.

## Texture conversion blockers

Hunyuan's full texture endpoint rejected the requested GPU duration (270 seconds
exceeded its allowed duration). Geometry-only generation succeeded. The official
Microsoft TRELLIS.2 alternative then rejected preprocessing due to exhausted
ZeroGPU quota (60 seconds requested, 55 left; approximately 24-hour reset).
No textured generation was claimed successful and no subscription was bought.

The original Meshy route remains available as a prepared configuration:

Catalog model: `meshy_v7_image_to_3d`; target 300,000 polygons, textured,
PBR enabled, ultra mode, symmetry off, no humanoid rig or canned animation.

The connected catalog lists image-to-3D models, but the current callable tool
inventory does not expose `generate_3d`. An attempted call through
`generate_image` was explicitly rejected with `INVALID_ARGUMENT`, directing us
to `generate_3d`. No generation job ID was returned and no 3D asset was produced.
The browser fallback opens a logged-out Higgsfield session. Do not record this
as successful Meshy conversion or replace the runtime atlas with a flat image.

The user confirmed an active Higgsfield account. On 26 September the accessible
in-app browser still showed the login dialog. A browser sign-in handoff is
pending; account confirmation alone does not establish a usable browser session
or add a missing connector capability. No paid texture job has been submitted.

## Additional reference

`public/anatomy/references/eye-gpt-reference.png` was generated with the built-in
GPT image tool in new-image mode. Prompt: a single realistic anatomical eyeball
with natural sclera, brown radially detailed iris, black pupil, transparent cornea,
short optic nerve, three-quarter front view on a white background, no labels,
cuts or surrounding facial tissue. The exact production prompt is stored in
`reference-prompts.json`. The image is a visual direction; iris proportions
and other anatomical details still need review. It has not been converted to 3D.

## Required after conversion

Inspect front, back, both sides and vessel openings. Correct invented/merged
structures against anatomical sources. Register orientation and scale, create
separate named components and real interior surfaces, preserve PBR maps,
produce bounded runtime variants, and perform an anatomical review before
releasing for children's education. A single external reconstruction cannot
provide trustworthy hidden chambers or selectable tissue boundaries by itself.
