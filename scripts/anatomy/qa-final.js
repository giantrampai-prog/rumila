async (page) => {
 const result={};await page.waitForSelector('canvas');
 await page.getByRole('button',{name:'Cek pemahaman',exact:true}).click();
 for(const [index,name] of ['Jantung','Lambung','Ginjal kiri'].entries()){
  if(index)await page.getByRole('button',{name:'Lapisan & pencarian',exact:true}).click();
  await page.getByRole('searchbox',{name:'Cari bagian tubuh'}).fill(name);
  await page.getByRole('button',{name,exact:true}).click();
  await page.getByRole('button',{name:index===2?'Selesaikan latihan':'Lanjut',exact:true}).click();
 }
 result.quiz=await page.evaluate(()=>JSON.parse(localStorage.getItem('rumila-v3')).state.activity.filter(a=>a.event==='exercise_complete').length);
 await page.getByRole('button',{name:'Pelajari jantung',exact:true}).click();
 await page.getByRole('checkbox',{name:'Kurangi gerakan',exact:true}).check();
 await page.getByRole('tab',{name:'Fungsi',exact:true}).click();
 result.reducedMotion=await page.getByRole('button',{name:'Putar simulasi',exact:true}).isDisabled();
 await page.getByRole('checkbox',{name:'Kurangi gerakan',exact:true}).uncheck();
 await page.getByRole('tab',{name:'Definisi',exact:true}).click();
 const close=page.getByRole('button',{name:'Tutup informasi',exact:true});if(await close.isVisible())await close.click();
 await page.waitForTimeout(800);await page.screenshot({path:'output/playwright/final-heart-desktop.png'});
 await page.getByRole('button',{name:'Layar penuh',exact:true}).click();await page.waitForTimeout(500);
 result.fullscreen=await page.evaluate(()=>!!document.fullscreenElement);await page.getByRole('button',{name:'Keluar layar penuh',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Pelajari jantung',exact:true}).click();await page.waitForTimeout(700);
 if(await close.isVisible())await close.click();
 await page.screenshot({path:'output/playwright/final-heart-mobile.png'});
 result.mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,detailVisible:!!document.querySelector('.anatomy-detail.is-open')}));
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(700);
 await page.screenshot({path:'output/playwright/final-heart-landscape.png'});
 result.environment=await page.evaluate(()=>({ua:navigator.userAgent,dpr:devicePixelRatio,webgl:document.querySelector('canvas').getContext('webgl2').getParameter(7937)}));
 await page.setViewportSize({width:1440,height:980});return result;
}
