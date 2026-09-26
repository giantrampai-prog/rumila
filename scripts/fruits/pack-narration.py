"""Bundle exported narration text for a single download (no generated voice files)."""
from pathlib import Path
import zipfile
root = Path(__file__).resolve().parents[2] / 'public/fruits/narasi'
with zipfile.ZipFile(root / 'paket-narasi-buah.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob('*')):
        if path.is_file() and path.suffix in {'.txt', '.csv'}:
            archive.write(path, path.relative_to(root))
print('Packed 50 scripts, recording guide, TXT collection, and CSV.')
