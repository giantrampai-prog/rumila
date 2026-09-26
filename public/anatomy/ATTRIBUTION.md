# Rumila — Jelajah Tubuh 3D: source and licensing

Runtime version: 1.0.0, development catalogue. Exported 26 September 2026.
**No human anatomical reviewer has approved this derivative.** Source authors are
not endorsing Rumila. The catalogue is not a complete anatomical atlas.

## Z-Anatomy geometry

Z-Anatomy — The libre 3D atlas of anatomy. Gauthier Kervyn and contributors.
Source: https://github.com/Z-Anatomy/Models-of-human-anatomy
Editable upstream: `Z-Anatomy.zip`, `Z-Anatomy/Startup.blend` (2023-05-02 master).
License: Creative Commons Attribution-ShareAlike 4.0 International.
https://creativecommons.org/licenses/by-sa/4.0/
The full upstream notice is available in `Z-ANATOMY-LICENSE.txt`.

Underlying BodyParts3D anatomy: Kousaku Okubo and The Database Center for Life
Science. “BodyParts3D, © The Database Center for Life Science licensed under
CC Attribution-Share Alike 2.1 Japan.”
https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en
Research: Mitsuhashi et al., 2009, https://doi.org/10.1093/nar/gkn613

Atlas GLBs (excluding the separate `ear-study.glb`) include Z-Anatomy geometry; urinary.glb combines Z-Anatomy ureters with direct BodyParts3D kidneys. The atlas geometry derivatives
are distributed under CC BY-SA 4.0, preserving the original BodyParts3D notice.
This geometry license is separate from Rumila application code.

Changes: a curated subset, stable node IDs, regional skin grouping, skeletal
parts retained individually, uniform teaching materials, bounded decimation,
GLB export in meters (+Y up, +Z anterior, subject-left +X), meshopt compression,
and partition of the anterior cardiac tissue as a removable teaching cover. Detail variants retain more source polygons; coronary vessels come from source curves, not invented decorative paths.
No texture, labels, definitions, or Wikipedia translations from upstream are used.

Excluded: upstream non-commercial kidney models by Lissie Cowley and inner-ear
models attributed to the University of Dundee. No cranial-foramina or white-matter
tract collection is included. Brain overview uses the source neocortical surfaces;
its provenance remains the Z-Anatomy/BodyParts3D lineage in the upstream notice.

## BodyParts3D direct components

`urinary.glb`: FMA7204 (right kidney), FMA7205 (left kidney). Ureter geometry is from Z-Anatomy. The earlier FMA15571/FMA15572 files remain source archives only.
`heart.glb`: FMA7234 (tricuspid valve), FMA7235 (mitral valve).
Source mirror by Kevin Mattheus Moerman:
https://github.com/Kevin-Mattheus-Moerman/BodyParts3D
Pinned revision: f0eeb6e843380cfe6b83797cf8c3e1af74de5e61
BodyParts3D v3.0 / 20110915, STL conversion of original OBJ assets.
These components retain CC BY-SA 2.1 Japan and their original attribution.
Notice: `BODYPARTS3D-LICENSE.txt`.
Changes: mm to m, positional registration to named target landmarks (no copied non-commercial kidney geometry), GLB export, teaching materials, decimation, meshopt compression. Registration is a development alignment, pending human anatomical review.

The official database license page now states CC BY 4.0 (updated 2025-02-27):
https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
This distribution conservatively retains the mirror's earlier share-alike notice.

## NIH inner-ear study

`ear-study.glb`: “Cochlea”, chris@printhuman.org, NIH 3D entry 3DPX-001794,
version 2. Source: https://3d.nih.gov/entries/1794?version=2
License: Creative Commons Attribution 4.0 International:
https://creativecommons.org/licenses/by/4.0/
Changes: welded vertices, recalculated normals, display-size normalization,
GLB conversion and meshopt compression. The source does not establish a side or
anatomical unit scale; this model is an enlarged separate inset and is not
registered into the atlas skull. Its internal sensory microstructures are not
separate selectable components. This model retains its own CC BY 4.0 license.

## GPT visual reference

`references/heart-gpt-reference.png` was generated with the built-in GPT image
tool on 26 September 2026 as a visual production reference. It is not a measured
anatomical source, reviewed teaching diagram, texture map, or 3D reconstruction.
It is not included as geometry in the runtime atlas. Generation settings and
conversion status are recorded in `docs/anatomy/GPT-TO-3D.md`.

## Generated heart review candidate

`review/heart-shape.glb` is an AI-generated exterior reconstructed from the GPT
heart reference with Tencent Hunyuan3D 2.1. It is not part of the teaching atlas.
The 300,000-triangle review version was decimated in Blender, assigned a neutral
inspection material, renamed, and meshopt-compressed. No anatomical scale,
internal structures or human review is asserted. See `review/manifest.json`.
Generator: https://huggingface.co/spaces/tencent/Hunyuan3D-2.1
The applicable model agreement is included as `review/HUNYUAN-LICENSE.txt`;
the generated output is not a Z-Anatomy or NIH derivative. This sample is for
local development review, not a production anatomy release.

## Educational text

Indonesian text authored for Rumila; factual references are recorded per entry.
NHLBI: https://www.nhlbi.nih.gov/health/heart/anatomy
NHLBI: https://www.nhlbi.nih.gov/health/heart/blood-flow
OpenStax: https://openstax.org/books/anatomy-and-physiology-2e
No medical images or video from those pages are redistributed.
Text, source-to-ID mappings and derivative geometry still require expert review.

## Reproducibility

`manifest.json` supplies per-package byte counts and SHA-256 hashes. The repository
workspace contains editable `.blend` source, original direct STL files, the exact selection
plan, export scripts, original node names, and a geometry export report.
See `docs/anatomy/IMPLEMENTATION.md` in the application repository for acceptance
results and the explicit list of remaining production requirements.
