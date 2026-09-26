async (page) => {
 await page.setViewportSize({width:1440,height:980});await page.reload();
 await page.waitForFunction(()=>{const e=document.querySelector('[data-testid="anatomy-canvas"]');return e?.dataset.metrics&&Object.keys(JSON.parse(e.dataset.metrics).packages).length>=4;});
 await page.getByRole('button',{name:'Jelajahi jantung',exact:true}).click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics).packages['heart-detail']);
 await page.waitForTimeout(800);const close=page.getByRole('button',{name:'Tutup informasi',exact:true});if(await close.isVisible())await close.click();
 await page.screenshot({path:'output/playwright/studio-heart.png'});
 const before=await page.evaluate(()=>JSON.parse(document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics));await page.waitForTimeout(5000);
 const after=await page.evaluate(()=>JSON.parse(document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics));
 await page.getByRole('button',{name:'Lihat bagian dalam',exact:true}).click();await page.waitForTimeout(800);
 await page.screenshot({path:'output/playwright/studio-heart-interior.png'});
 await page.getByRole('button',{name:'Susun kembali',exact:true}).click();
 await page.getByRole('button',{name:'Belakang',exact:true}).click();await page.waitForTimeout(800);
 await page.screenshot({path:'output/playwright/studio-heart-back.png'});
 return {fps:Math.round((after.frames-before.frames)*100000/(after.elapsedMs-before.elapsedMs))/100,metrics:after};
}
