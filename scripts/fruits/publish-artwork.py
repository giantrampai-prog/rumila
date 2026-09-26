"""Package GPT Image originals for Rumila; never fetch replacement images online.

Generation prompts are saved in docs/fruits/gpt-image-prompts.json.
Place each completed built-in image_gen output in
output/fruits/gpt-image/originals/<fruit-id>.png before running this script.
Only image format and resolution are changed; no generative edits happen here.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
spec = json.loads((ROOT / 'docs/fruits/gpt-image-prompts.json').read_text())
originals = ROOT / 'output/fruits/gpt-image/originals'
missing = [fruit for fruit in spec['subjects'] if not (originals / f'{fruit}.png').exists()]
if missing:
    raise SystemExit('Waiting for GPT Image outputs: ' + ', '.join(missing))

target = ROOT / 'public/fruits/artwork/gpt-v1'
(target / 'thumbs').mkdir(parents=True, exist_ok=True)
manifest = {}
for fruit in spec['subjects']:
    image = Image.open(originals / f'{fruit}.png').convert('RGB')
    if image.width != image.height or image.width < 1024:
        raise ValueError(f'{fruit}: expected a square original at least 1024 pixels')
    image.save(target / f'{fruit}.webp', quality=94, method=6)
    thumb = image.copy()
    thumb.thumbnail((512, 512), Image.Resampling.LANCZOS)
    thumb.save(target / 'thumbs' / f'{fruit}.webp', quality=90, method=6)
    manifest[fruit] = {
        'src': f'/fruits/artwork/gpt-v1/{fruit}.webp',
        'thumb': f'/fruits/artwork/gpt-v1/thumbs/{fruit}.webp',
        'alt': 'Ilustrasi realistis buah ' + fruit.replace('-', ' '),
        'origin': 'gpt-image',
        'width': image.width,
        'height': image.height,
        'referenceId': f'rumila-fruit-v1-{fruit}',
    }
(ROOT / 'src/lib/fruits/artwork-manifest.json').write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + '\n'
)
print(f'Packaged {len(manifest)} original GPT Image fruit assets with thumbnails.')
