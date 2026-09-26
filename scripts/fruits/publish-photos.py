"""Optimize reviewed local photographs and keep license attribution with each image.

Input is the human-reviewed selection in output/fruits/photos/selected.json.
The exported photo-sources.json records the precise original URLs and licenses.
"""
import json,pathlib,re,html,sys,urllib.request,urllib.parse,time
from PIL import Image,ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[2]
selection=ROOT/'output/fruits/photos/selected.json'
if selection.exists():
 selected=json.loads(selection.read_text())
else:
 # The committed credits manifest makes the reviewed asset set reproducible.
 credits=json.loads((ROOT/'public/fruits/photos/credits.json').read_text());selected={}
 cache=ROOT/'output/fruits/photo-originals';cache.mkdir(parents=True,exist_ok=True)
 for fid,e in credits.items():
  local=cache/f'{fid}.jpg'
  if not local.exists():
   if '--download' not in sys.argv:raise SystemExit('Source cache missing. Run with --download to restore reviewed originals from Commons.')
   assert urllib.parse.urlparse(e['downloadUrl']).hostname in ['thumb.wikimedia.org','upload.wikimedia.org']
   req=urllib.request.Request(e['downloadUrl'],headers={'User-Agent':'RumilaFruitCatalog/1.0 (educational fruit photo attribution)'})
   with urllib.request.urlopen(req,timeout=40) as response:local.write_bytes(response.read())
   time.sleep(2)
  selected[fid]={'local':str(local),'title':e['title'],'info':{'descriptionurl':e['source'],'url':e['originalUrl'],'thumburl':e['downloadUrl'],'width':e['width'],'height':e['height'],'extmetadata':{'Artist':{'value':e['author']},'LicenseShortName':{'value':e['license']},'LicenseUrl':{'value':e['licenseUrl']}}}}

out=ROOT/'public/fruits/photos';(out/'thumbs').mkdir(parents=True,exist_ok=True)
manifest={};sources={};lines=['# Foto asli Kebun Buah 3D','', '48 foto nyata dari Wikimedia Commons. Setiap foto tetap berada di bawah lisensi masing-masing. Kredit juga tersedia pada detail buah di aplikasi.','', 'Perubahan oleh Rumila: orientasi EXIF dinormalkan, ukuran diperkecil, dan format dikompresi menjadi WebP. Foto tidak diganti dengan gambar AI. Tampilan kartu menggunakan crop CSS; detail menampilkan foto utuh. Salinan foto berlisensi ShareAlike tetap didistribusikan dengan lisensi yang sama.','', '| Buah | Fotografer / sumber | Lisensi | Foto sumber |','|---|---|---|---|']
for fid,e in selected.items():
 im=ImageOps.exif_transpose(Image.open(e['local'])).convert('RGB')
 for size,path in [(1280,out/f'{fid}.webp'),(480,out/'thumbs'/f'{fid}.webp')]:
  copy=im.copy();copy.thumbnail((size,size),Image.Resampling.LANCZOS);copy.save(path,quality=84,method=6)
 m=e['info']['extmetadata'];author=' '.join(html.unescape(re.sub('<[^>]+>',' ',m.get('Artist',{}).get('value',''))).split())
 if fid in ['lengkeng','belimbing']:author='USDA Agricultural Research Service'
 if fid=='nangka':author='Tushar Hossain'
 license=m['LicenseShortName']['value'];source=e['info']['descriptionurl'];license_url=m.get('LicenseUrl',{}).get('value') or source
 if license_url.startswith('//'):license_url='https:'+license_url
 assert license in ['Public domain','CC0'] or license.startswith(('CC BY ','CC BY-SA ')),(fid,license)
 assert author
 manifest[fid]={'src':f'/fruits/photos/{fid}.webp','thumb':f'/fruits/photos/thumbs/{fid}.webp','alt':'Foto buah '+fid.replace('-',' '),'author':author,'license':license,'licenseUrl':license_url,'source':source}
 sources[fid]={'title':e['title'],'originalUrl':e['info']['url'],'downloadUrl':e['info'].get('thumburl',e['info']['url']),'width':e['info']['width'],'height':e['info']['height'],**manifest[fid]}
 lines.append(f'| {fid} | {author.replace("|","/")} | [{license}]({license_url}) | [Wikimedia Commons]({source}) |')
(ROOT/'src/lib/fruits/photo-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(out/'credits.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n')
(ROOT/'docs/fruits/PHOTO_CREDITS.md').write_text('\n'.join(lines)+'\n')
print('Published',len(manifest),'photos; detail+thumb',round(sum(f.stat().st_size for f in out.rglob('*.webp'))/1024/1024,2),'MiB')
