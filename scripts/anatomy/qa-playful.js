async (page) => {
 await page.reload();
 await page.waitForSelector('canvas');
 await page.waitForFunction(()=>{const el=document.querySelector('[data-testid="anatomy-canvas"]');if(!el?.dataset.metrics)return false;return Object.keys(JSON.parse(el.dataset.metrics).packages).length>=4;});
 await page.waitForTimeout(800);
 await page.screenshot({path:'output/playwright/playful-body.png'});
 await page.getByRole('button',{name:'Jelajahi jantung',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.anatomy-detail.is-open h2')?.textContent==='Jantung');
 await page.waitForTimeout(1000);
 await page.screenshot({path:'output/playwright/playful-heart.png'});
 return await page.evaluate(()=>({metrics:JSON.parse(document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics),overflow:document.documentElement.scrollWidth>innerWidth,canvas:[document.querySelector('canvas').width,document.querySelector('canvas').height]}));
}
