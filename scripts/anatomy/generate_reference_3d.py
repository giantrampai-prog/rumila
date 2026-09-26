"""Submit the GPT reference to the public official Tencent research demo.

Generated output remains a review asset, outside the runtime atlas. No source
anatomy, private user data or credentials are uploaded. Requires gradio_client.
"""
import json
import argparse
import pathlib
import time
from gradio_client import Client, handle_file

parser = argparse.ArgumentParser()
parser.add_argument('--shape-only', action='store_true', help='Use the shorter public geometry-only endpoint.')
args = parser.parse_args()
api = '/shape_generation' if args.shape_only else '/generation_all'

root = pathlib.Path(__file__).resolve().parents[2]
out = root / 'sources/anatomy/generated-heart'
out.mkdir(parents=True, exist_ok=True)
image = root / 'public/anatomy/references/heart-gpt-reference.png'
settings = dict(steps=30, guidance_scale=5.0, seed=260926,
                octree_resolution=512, check_box_rembg=True,
                num_chunks=8000, randomize_seed=False)
record = dict(provider='Tencent official Hugging Face demo',
              endpoint='https://tencent-hunyuan3d-2-1.hf.space/',
              reference=str(image.relative_to(root)), settings=settings,
              api=api, status='submitting', reviewStatus='pending')
receipt = out / ('shape-generation.json' if args.shape_only else 'generation.json')
def save():
    receipt.write_text(json.dumps(record, indent=2))
save()
try:
    # Save remote paths before downloading. Gradio 1.3's implicit downloader
    # uses an unbounded timeout and can stall after GPU work has completed.
    client = Client(record['endpoint'], download_files=False,
                    httpx_kwargs={'timeout': 40})
    job = client.submit(image=handle_file(str(image)),
                        mv_image_front=None, mv_image_back=None,
                        mv_image_left=None, mv_image_right=None,
                        **settings, api_name=api)
    record['status'] = 'submitted'
    record['session'] = client.session_hash
    save()
    last = None
    while not job.done():
        state = job.status()
        if job.communicator.event_id:
            record['eventId'] = job.communicator.event_id
        status = str(state.code)
        if status != last:
            print(status, flush=True)
            last = status
            record['status'] = status
            save()
        time.sleep(5)
    result = job.result()
    record.update(status='completed', result=result)
    save()
    print(json.dumps(result, default=str), flush=True)
except Exception as error:
    record.update(status='failed', error=str(error))
    save()
    print(type(error).__name__ + ': ' + str(error), flush=True)
    raise
