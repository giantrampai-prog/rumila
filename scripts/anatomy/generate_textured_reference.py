"""Create a review-only textured GLB from a GPT reference via official TRELLIS.2.

Requires current gradio_client; uses the service's public documented API.
Generated anatomy has not been scientifically reviewed.
"""
from pathlib import Path
import json, time
from gradio_client import Client, handle_file

root=Path(__file__).resolve().parents[2]
out=root/'sources/anatomy/generated-heart'
out.mkdir(parents=True,exist_ok=True)
record={'provider':'Microsoft official TRELLIS.2 demo',
        'endpoint':'https://microsoft-trellis-2.hf.space/',
        'reference':'public/anatomy/references/heart-gpt-reference.png',
        'seed':260926,'resolution':'1024','targetTriangles':300000,
        'textureSize':2048,'reviewStatus':'pending','status':'starting'}
receipt=out/'trellis-generation.json'
def save(): receipt.write_text(json.dumps(record,indent=2))
def run(client,api,**kwargs):
    job=client.submit(api_name=api,**kwargs)
    last=None
    while not job.done():
        status=str(job.status().code)
        if status!=last:
            record['status']=api+': '+status;save();print(record['status'],flush=True);last=status
        time.sleep(4)
    return job.result()
save()
try:
    client=Client(record['endpoint'],download_files=False,httpx_kwargs={'timeout':45})
    record['session']=client.session_hash;save()
    run(client,'/start_session')
    prepared=run(client,'/preprocess_image',input=handle_file(str(root/record['reference'])))
    if isinstance(prepared,dict) and 'url' in prepared:
        image=handle_file(prepared['url'])
    else:
        image=prepared
    run(client,'/image_to_3d',image=image,seed=record['seed'],resolution=record['resolution'],
        ss_guidance_strength=7.5,ss_guidance_rescale=.7,ss_sampling_steps=12,ss_rescale_t=5.,
        shape_slat_guidance_strength=7.5,shape_slat_guidance_rescale=.5,shape_slat_sampling_steps=12,shape_slat_rescale_t=3.,
        tex_slat_guidance_strength=1.,tex_slat_guidance_rescale=0.,tex_slat_sampling_steps=12,tex_slat_rescale_t=3.)
    files=run(client,'/extract_glb',decimation_target=record['targetTriangles'],texture_size=record['textureSize'])
    record.update(status='completed',files=files);save();print(json.dumps(files),flush=True)
except Exception as error:
    record.update(status='failed',error=str(error));save();raise
