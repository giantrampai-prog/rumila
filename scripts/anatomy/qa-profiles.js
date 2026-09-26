async (page) => {
 const result={};
 await page.getByRole('button',{name:'Profil Uji Admin · Akses penuh',exact:true}).click();
 await page.getByRole('button',{name:'Tandai sudah dipelajari',exact:true}).click();
 await page.getByRole('button',{name:'Ganti profil',exact:true}).click();
 await page.getByRole('button',{name:'Profil Kedua User · 1 dari 11 menu',exact:true}).click();
 await page.getByRole('button',{name:'Pelajari otak',exact:true}).click();
 result.independent=await page.getByRole('button',{name:'Tandai sudah dipelajari',exact:true}).isEnabled();
 await page.getByRole('button',{name:'Ganti profil',exact:true}).click();
 await page.getByRole('button',{name:'Tanpa Edukasi User · 0 dari 11 menu',exact:true}).click();
 await page.waitForTimeout(300);
 result.denied=await page.locator('body').innerText();
 return result;
}
