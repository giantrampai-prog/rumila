async (page)=>{
 const result={};await page.waitForSelector('canvas');
 for(const name of ['mata','telinga','hidung','mulut & gigi','kaki']){
  await page.getByRole('button',{name:'Pelajari '+name,exact:true}).click();
  await page.waitForTimeout(1000);
  const close=page.getByRole('button',{name:'Tutup informasi',exact:true});if(await close.isVisible())await close.click();
  await page.screenshot({path:'output/playwright/expanded-'+name.replaceAll(' ','-').replace('&','and')+'.png'});
  result[name]=await page.locator('.anatomy-detail h2').textContent();
 }
 return result;
}
