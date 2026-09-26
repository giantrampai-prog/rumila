async (page) => {
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 const close=page.getByRole('button',{name:'Tutup informasi',exact:true});if(await close.isVisible())await close.click();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
 await page.screenshot({path:'output/playwright/playful-mobile.png'});
 await page.getByRole('button',{name:'Lapisan & pencarian',exact:true}).click();
 await page.getByRole('searchbox',{name:'Cari bagian tubuh'}).fill('jantung');
 await page.getByRole('button',{name:'Jantung',exact:true}).click();
 await page.getByRole('button',{name:'Isolasi',exact:true}).click();await page.waitForTimeout(700);
 await page.screenshot({path:'output/playwright/playful-mobile-detail.png'});
 await page.getByRole('button',{name:'Tutup panel informasi',exact:true}).click();
 if(await close.isVisible())await close.click();
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(500);
 await page.screenshot({path:'output/playwright/playful-landscape.png'});
 return await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth}));
}
