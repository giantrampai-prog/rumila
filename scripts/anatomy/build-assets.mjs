// Sequential pipeline: the compiler metadata is written only after Blender exits.
// Do not run optimize in parallel with export, which would mix manifest versions.
import { spawn } from 'node:child_process';
const blender=process.env.RUMILA_BLENDER,source=process.env.RUMILA_ANATOMY_SOURCE;
if(!blender||!source)throw new Error('Set RUMILA_BLENDER and RUMILA_ANATOMY_SOURCE to the verified Blender binary and upstream Startup.blend.');
const run=(cmd,args)=>new Promise((resolve,reject)=>{const child=spawn(cmd,args,{stdio:'inherit'});child.on('error',reject);child.on('close',code=>code===0?resolve():reject(new Error(cmd+' exited '+code)));});
await run(process.execPath,['scripts/anatomy/plan.mjs']);
await run(blender,['--background','--factory-startup','--disable-autoexec',source,'--python','scripts/anatomy/export_blend.py']);
await run(blender,['--background','--factory-startup','--disable-autoexec','--python','scripts/anatomy/export_nih_ear.py']);
await run(process.execPath,['scripts/anatomy/optimize.mjs']);
await run(process.execPath,['--import','tsx','--test','scripts/anatomy/test.ts']);
