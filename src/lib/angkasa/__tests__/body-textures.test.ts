import { describe, expect, it, vi } from 'vitest';
import { MeshStandardMaterial, Texture } from 'three';
import { createBody } from '@/components/angkasa/engine/bodies';
import type { EngineCtx } from '@/components/angkasa/engine/core';
import { getObj } from '../manifest';

function fixture() {
  const requests=new Map<string,(t:Texture)=>void>();
  const ctx={lowPower:false,ultra:false,loadTexture:(url:string)=>new Promise<Texture>(resolve=>requests.set(url,resolve))} as EngineCtx;
  const obj=getObj('mercury');
  const body=createBody(obj,ctx,{radius:2});
  return {body,obj,ctx,requests,mat:body.surface.material as MeshStandardMaterial};
}

describe('planet texture lifecycle',()=>{
  it('keeps the detailed map when the slower initial request arrives afterwards',async()=>{
    const {body,obj,ctx,requests,mat}=fixture();
    const detailed=new Texture(),initial=new Texture();
    const done=body.loadDetail(ctx);
    requests.get(obj.texture.hi!)!(detailed);await done;
    requests.get(obj.texture.lo!)!(initial);await Promise.resolve();
    expect(mat.map).toBe(detailed);expect(body.mapReady).toBe(true);
    body.dispose();initial.dispose();detailed.dispose();
  });
  it('does not attach a late map to a disposed planet',async()=>{
    const {body,obj,requests,mat}=fixture();body.dispose();
    requests.get(obj.texture.lo!)!(new Texture());await Promise.resolve();
    expect(mat.map).toBeNull();expect(body.mapReady).not.toBe(true);
  });
  it('releases the close-up mesh when focus moves away, including on a 2K device',()=>{
    const {body}=fixture();const overview=body.surface.geometry;
    body.setUltra!(true);const detail=body.surface.geometry;
    expect(detail.attributes.position.count).toBeGreaterThan(overview.attributes.position.count);
    const dispose=vi.spyOn(detail,'dispose');
    body.setUltra!(false);expect(dispose).toHaveBeenCalledOnce();expect(body.surface.geometry).toBe(overview);
    body.dispose();
  });
});
