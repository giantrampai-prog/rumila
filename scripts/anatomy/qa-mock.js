async (page) => {
 const base='http://127.0.0.1:3100';
 const idA='00000000-0000-4000-8000-000000000001',idB='00000000-0000-4000-8000-000000000002',idC='00000000-0000-4000-8000-000000000003',fid='00000000-0000-4000-8000-000000000010',uid='00000000-0000-4000-8000-000000000020';
 const members=[{id:idA,name:'Profil Uji',color_key:'teal',is_admin:true,has_pin:false,sort:0},{id:idB,name:'Profil Kedua',color_key:'orange',is_admin:false,has_pin:false,sort:1},{id:idC,name:'Tanpa Edukasi',color_key:'pink',is_admin:false,has_pin:false,sort:2}];
 await page.unrouteAll();
 await page.route('https://*.supabase.co/**',async route=>{
   const req=route.request(),url=req.url();let body={};
   if(url.includes('/family_user'))body={family_id:fid};
   else if(url.includes('/member_permission'))body=[{member_id:idA,key:'edukasi'},{member_id:idA,key:'laporan'},{member_id:idB,key:'edukasi'}];
   else if(url.includes('/member'))body=members;
   else if(url.includes('/family'))body={name:'QA Anatomi'};
   else if(url.includes('/activity_log'))body=[];
   else if(url.includes('/auth/'))body={user:{id:uid,email:'qa@example.invalid'}};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
 });
 await page.evaluate(({idA,idB,idC})=>localStorage.setItem('rumila-v3',JSON.stringify({state:{familyName:'QA Anatomi',members:[{id:idA,name:'Profil Uji',c:'teal',admin:true,perms:['edukasi','laporan']},{id:idB,name:'Profil Kedua',c:'orange',admin:false,perms:['edukasi']},{id:idC,name:'Tanpa Edukasi',c:'pink',admin:false,perms:[]}],meId:idA,signedIn:true,theme:'modern',activity:[]},version:0})),{idA,idB,idC});
 await page.evaluate(({uid})=>{
  const user={id:uid,email:'qa@example.invalid',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
  localStorage.setItem('SUPABASE_STORAGE_KEY',JSON.stringify({access_token:'qa.mock.token',token_type:'bearer',refresh_token:'qa-mock-refresh',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user}));
 },{uid});
 await page.goto(base+'/jelajah-tubuh');await page.setViewportSize({width:1440,height:980});
}
