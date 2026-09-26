async (page) => {
 const result={};await page.setViewportSize({width:1440,height:980});
 await page.route('**/anatomy/nerve.glb',route=>route.fulfill({status:503,body:'QA retry'}));
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.getByRole('button',{name:'Pelajari otak',exact:true}).click();
 await page.getByRole('region',{name:'Ruang eksplorasi tubuh'}).getByRole('alert').waitFor();result.error=await page.getByRole('region',{name:'Ruang eksplorasi tubuh'}).getByRole('alert').textContent();
 await page.unroute('**/anatomy/nerve.glb');await page.getByRole('button',{name:'Coba lagi',exact:true}).click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics).packages.nerve);
 result.recovered=await page.getByRole('region',{name:'Ruang eksplorasi tubuh'}).getByRole('alert').count()===0;
 await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
 await page.getByRole('button',{name:'Pulihkan 3D',exact:true}).waitFor();result.contextFallback=true;
 await page.getByRole('button',{name:'Pulihkan 3D',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('canvas')&&document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics);
 result.contextRestored=await page.getByRole('button',{name:'Pulihkan 3D',exact:true}).count()===0;
 await page.getByRole('button',{name:'Ganti profil',exact:true}).click();
 return {...result,profileSheet:await page.locator('body').innerText()};
}
